import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://cuantotequiero.com.ar";

    // 1. Static Routes
    const staticPaths = [
        "",
        "/sobre-nosotros",
        "/preguntas-frecuentes",
    ];

    const staticRoutes = staticPaths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: path === "" ? 1.0 : 0.8,
    }));

    try {
        // 2. Fetch categories and subcategories from DB
        const { data: categories } = await supabase
            .from("categories")
            .select("id, name")
            .eq("active", true);

        const { data: subcategories } = await supabase
            .from("subcategories")
            .select("id, name, category_id")
            .eq("active", true);

        // Map categories to sitemap paths
        const categoryRoutes = (categories || []).map((cat) => {
            const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
            return {
                url: `${baseUrl}/categoria/${slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            };
        });

        // Map subcategories to sitemap paths
        const subcategoryRoutes = (subcategories || []).map((sub) => {
            const parentCat = (categories || []).find(c => c.id === sub.category_id);
            const parentSlug = parentCat ? parentCat.name.toLowerCase().replace(/\s+/g, "-") : "general";
            const subSlug = sub.name.toLowerCase().replace(/\s+/g, "-");
            return {
                url: `${baseUrl}/categoria/${parentSlug}/${subSlug}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.6,
            };
        });

        // 3. Fetch products from DB
        const { data: products } = await supabase
            .from("products")
            .select("code, updated_at")
            .eq("active", true);

        const productRoutes = (products || []).map((prod) => ({
            url: `${baseUrl}/producto/${prod.code}`,
            lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.5,
        }));

        return [
            ...staticRoutes,
            ...categoryRoutes,
            ...subcategoryRoutes,
            ...productRoutes,
        ];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return staticRoutes;
    }
}
