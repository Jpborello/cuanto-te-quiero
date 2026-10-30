import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

// Server-side catalog reads (public data only, anon key + RLS)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const SITE_URL = "https://www.cuantotequiero.com.ar";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Same slug format the shop links use: lowercase, spaces -> hyphens
export function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
}

// Aggressive normalization so slugs match names with accents, ñ or symbols
export function normalizeSlug(str: string) {
    if (!str) return "";
    try { str = decodeURIComponent(str); } catch { }
    return str.toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/ñ/g, "n")
        .replace(/[^a-z0-9]/g, "");
}

// image_url can be an array, a JSON string or a single URL; product_images is the legacy fallback
export function parseImages(product: { image_url?: unknown; product_images?: { image_url: string }[] | null }): string[] {
    let images: string[] = [];
    const raw = product.image_url;
    if (Array.isArray(raw)) {
        images = raw as string[];
    } else if (typeof raw === "string" && raw) {
        try {
            const parsed = JSON.parse(raw);
            images = Array.isArray(parsed) ? parsed : [raw];
        } catch {
            images = [raw];
        }
    }
    if (images.length === 0 && product.product_images?.length) {
        images = product.product_images.map((img) => img.image_url);
    }
    return images.filter(Boolean);
}

export const getProduct = cache(async (slug: string) => {
    const isUuid = UUID_RE.test(slug);
    const { data } = await supabase
        .from("products")
        .select(`
            *,
            categories (name),
            subcategories (name, id),
            product_images (image_url)
        `)
        .eq(isUuid ? "uid" : "code", slug)
        .eq("active", true)
        .limit(1);

    const product = data?.[0];
    if (!product) return null;
    return { ...product, images: parseImages(product) };
});

export async function getRelatedProducts(subcategoryId: string | undefined, excludeUid: string) {
    if (!subcategoryId) return [];
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .eq("active", true)
        .neq("uid", excludeUid)
        .limit(4);
    return (data || []).map((p) => ({ ...p, images: parseImages(p) }));
}

export const getCategoryBySlug = cache(async (slug: string) => {
    const { data } = await supabase.from("categories").select("*");
    const wanted = normalizeSlug(slug);
    return (data || []).find((c) => normalizeSlug(c.name) === wanted) || null;
});

// Custom order for Muebles Infantiles; everything else alphabetical
const SUBCATEGORY_ORDER = [
    "CUNAS",
    "CUNAS COLECHO",
    "CUNAS FUNCIONALES",
    "CAJONERAS",
    "ROPEROS Y PLACARES",
    "MONTESSORI",
    "CAMAS DE 1 PLAZA Y NIDO",
    "CUCHETAS - RINCONERAS - PUENTE",
    "ESCRITORIOS"
];

export async function getSubcategoriesWithImages(categoryId: string) {
    const { data: subcategories } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .order("name", { ascending: true });

    const withImages = await Promise.all(
        (subcategories || []).map(async (subcategory) => {
            const { data: products } = await supabase
                .from("products")
                .select(`image_url, product_images (image_url)`)
                .eq("subcategory_id", subcategory.id)
                .eq("active", true)
                .limit(4);

            const allImages = (products || []).flatMap((p) => [
                ...parseImages({ image_url: p.image_url }),
                ...(p.product_images || []).map((img: { image_url: string }) => img.image_url),
            ]);
            const uniqueImages = [...new Set(allImages)].slice(0, 4);
            return { ...subcategory, images: uniqueImages.length > 0 ? uniqueImages : null };
        })
    );

    return withImages.sort((a, b) => {
        const nameA = a.name.trim().toUpperCase();
        const nameB = b.name.trim().toUpperCase();
        const indexA = SUBCATEGORY_ORDER.indexOf(nameA);
        const indexB = SUBCATEGORY_ORDER.indexOf(nameB);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return nameA.localeCompare(nameB);
    });
}

export const getSubcategoryBySlugs = cache(async (slug: string, subslug: string) => {
    const category = await getCategoryBySlug(slug);
    if (!category) return null;
    const { data } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", category.id);
    const wanted = normalizeSlug(subslug);
    const subcategory = (data || []).find((s) => normalizeSlug(s.name) === wanted);
    return subcategory ? { category, subcategory } : null;
});

export async function getSubcategoryProducts(subcategoryId: string) {
    const { data } = await supabase
        .from("products")
        .select(`*, product_images (image_url)`)
        .eq("subcategory_id", subcategoryId)
        .eq("active", true)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("code", { ascending: true });
    return (data || []).map((p) => ({ ...p, images: parseImages(p) }));
}

export async function getStorePricesEnabled() {
    const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "prices_enabled")
        .maybeSingle();
    return data?.value !== false && data?.value !== "false";
}

export async function getActiveCategoriesWithSubcategories() {
    const [{ data: categories }, { data: subcategories }] = await Promise.all([
        supabase.from("categories").select("id, name").eq("active", true).order("name"),
        supabase.from("subcategories").select("id, name, category_id").eq("active", true).order("name"),
    ]);
    return (categories || []).map((c) => ({
        ...c,
        subcategories: (subcategories || []).filter((s) => s.category_id === c.id),
    }));
}

// Home carousel: featured products, falling back to the first active ones (same as FeaturedCarousel)
export async function getFeaturedProducts(limit = 6) {
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("code", { ascending: true })
        .limit(limit);
    if (data?.length) return data;

    const { data: fallback } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("code", { ascending: true })
        .limit(limit);
    return fallback || [];
}

// Home "Novedades" grid (same query as ProductGrid)
export async function getHomeProducts(limit = 8) {
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("code", { ascending: true })
        .limit(limit);
    return data || [];
}

// Plain-text breadcrumb JSON-LD
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": `${SITE_URL}${item.path}`,
        })),
    };
}
