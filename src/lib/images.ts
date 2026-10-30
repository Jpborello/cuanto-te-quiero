// Optimized product photos live in the `products` bucket as
//   optimized/<id>-1200.webp  (stored in image_url, used on the product page)
//   optimized/<id>-400.webp   (thumbnail for grids and carousels)
//   optimized/<id>-og.jpg     (JPEG for link previews: WhatsApp/social don't always render WebP)
// See scripts/optimize-images.mjs and the admin ProductForm upload.
// Anything else (originals, GIFs, external URLs) is returned unchanged.

const FULL_SUFFIX = "-1200.webp";

function isOptimized(url: string | null | undefined): url is string {
    return typeof url === "string" && url.includes("/optimized/") && url.endsWith(FULL_SUFFIX);
}

export function thumbUrl<T extends string | null | undefined>(url: T): T {
    return (isOptimized(url) ? url.slice(0, -FULL_SUFFIX.length) + "-400.webp" : url) as T;
}

export function ogImageUrl<T extends string | null | undefined>(url: T): T {
    return (isOptimized(url) ? url.slice(0, -FULL_SUFFIX.length) + "-og.jpg" : url) as T;
}
