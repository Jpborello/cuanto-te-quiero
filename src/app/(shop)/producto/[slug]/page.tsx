import { Metadata } from "next";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
    
    const { data: product } = await supabase
        .from("products")
        .select("name, description, image_url, code")
        .eq(isUuid ? "uid" : "code", slug)
        .eq("active", true)
        .maybeSingle();

    if (!product) {
        return {
            title: "Producto no encontrado | Cuanto Te Quiero",
        };
    }

    // Get first image URL
    let imageUrl = "";
    if (product.image_url) {
        if (Array.isArray(product.image_url)) {
            imageUrl = product.image_url[0] || "";
        } else if (typeof product.image_url === "string") {
            try {
                const parsed = JSON.parse(product.image_url);
                imageUrl = Array.isArray(parsed) ? (parsed[0] || "") : product.image_url;
            } catch {
                imageUrl = product.image_url;
            }
        }
    }

    return {
        title: `${product.name} | Cuanto Te Quiero`,
        description: product.description || "Todo lo que tu bebé necesita, con el amor que se merece.",
        openGraph: {
            title: product.name,
            description: product.description || "Todo lo que tu bebé necesita, con el amor que se merece.",
            images: imageUrl ? [imageUrl] : [],
            type: "website",
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    return <ProductDetailClient slug={slug} />;
}
