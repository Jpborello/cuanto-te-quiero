import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import {
    SITE_URL,
    breadcrumbJsonLd,
    getProduct,
    getRelatedProducts,
    getStorePricesEnabled,
    slugify,
} from "@/lib/catalog";

interface Props {
    params: Promise<{ slug: string }>;
}

const DEFAULT_DESCRIPTION = "Todo lo que tu bebé necesita, con el amor que se merece.";

function describe(product: { name: string; description?: string | null; categories?: { name: string } | null }) {
    if (product.description?.trim()) return product.description.trim().slice(0, 300);
    const category = product.categories?.name ? ` de ${product.categories.name.toLowerCase()}` : "";
    return `${product.name}${category} en Cuanto Te Quiero, Rosario. Consultanos por WhatsApp.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: "Producto no encontrado | Cuanto Te Quiero",
            robots: { index: false },
        };
    }

    const description = describe(product);

    return {
        title: `${product.name} | Cuanto Te Quiero`,
        description,
        alternates: {
            canonical: `/producto/${product.uid}`,
        },
        openGraph: {
            title: product.name,
            description,
            images: product.images[0] ? [product.images[0]] : undefined,
            type: "website",
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const [relatedProducts, pricesEnabled] = await Promise.all([
        getRelatedProducts(product.subcategories?.id, product.uid),
        getStorePricesEnabled(),
    ]);

    const productUrl = `${SITE_URL}/producto/${product.uid}`;
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images.slice(0, 3),
        "description": product.description || DEFAULT_DESCRIPTION,
        "sku": product.code || product.uid,
        "mpn": product.code || product.uid,
        "url": productUrl,
        "brand": { "@type": "Brand", "name": "Cuanto Te Quiero" },
        ...(product.categories?.name && { "category": product.categories.name }),
        // Only expose the price to search engines when the store shows prices
        ...(pricesEnabled && product.price > 0 && {
            "offers": {
                "@type": "Offer",
                "url": productUrl,
                "priceCurrency": "ARS",
                "price": product.price,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "LocalBusiness",
                    "name": "Cuanto Te Quiero"
                }
            }
        })
    };

    const crumbs = [{ name: "Inicio", path: "" }];
    if (product.categories?.name) {
        const categoryPath = `/categoria/${slugify(product.categories.name)}`;
        crumbs.push({ name: product.categories.name, path: categoryPath });
        if (product.subcategories?.name) {
            crumbs.push({ name: product.subcategories.name, path: `${categoryPath}/${slugify(product.subcategories.name)}` });
        }
    }
    crumbs.push({ name: product.name, path: `/producto/${product.uid}` });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd(crumbs)]) }}
            />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </>
    );
}
