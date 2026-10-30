import { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryClient from "./SubcategoryClient";
import { breadcrumbJsonLd, getSubcategoryBySlugs, getSubcategoryProducts, slugify } from "@/lib/catalog";

interface Props {
    params: Promise<{ slug: string; subslug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, subslug } = await params;
    const found = await getSubcategoryBySlugs(slug, subslug);

    if (!found) {
        return { title: "Subcategoría no encontrada | Cuanto Te Quiero", robots: { index: false } };
    }

    const { category, subcategory } = found;
    const name = subcategory.name;
    const description = `Encontrá ${name.toLowerCase()} en Rosario. Te ofrecemos productos infantiles, cunas y accesorios hechos con amor para el bienestar de tu bebé.`;

    return {
        title: `${name} | Cuanto Te Quiero`,
        description,
        alternates: {
            canonical: `/categoria/${slugify(category.name)}/${slugify(name)}`,
        },
        openGraph: {
            title: `${name} | Cuanto Te Quiero`,
            description,
            type: "website",
        }
    };
}

export default async function Page({ params }: Props) {
    const { slug, subslug } = await params;
    const found = await getSubcategoryBySlugs(slug, subslug);

    if (!found) {
        notFound();
    }

    const { category, subcategory } = found;
    const products = await getSubcategoryProducts(subcategory.id);
    const categoryPath = `/categoria/${slugify(category.name)}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd([
                        { name: "Inicio", path: "" },
                        { name: category.name, path: categoryPath },
                        { name: subcategory.name, path: `${categoryPath}/${slugify(subcategory.name)}` },
                    ]))
                }}
            />
            <SubcategoryClient subcategory={subcategory} products={products} />
        </>
    );
}
