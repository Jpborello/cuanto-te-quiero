// Browser-side resize for admin uploads, producing the same variants as
// scripts/optimize-images.mjs (see src/lib/images.ts for the naming).

export interface ImageVariants {
    full: Blob;  // -1200.webp
    thumb: Blob; // -400.webp
    og: Blob;    // -og.jpg
}

async function encode(bitmap: ImageBitmap, maxSize: number, type: "image/webp" | "image/jpeg", quality: number) {
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (type === "image/jpeg") {
        // JPEG has no transparency: paint white behind PNGs
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    // Browsers without WebP encoding silently return PNG: treat that as unsupported
    return blob && blob.type === type ? blob : null;
}

// Returns null when the browser can't produce the variants (caller uploads the original)
export async function createImageVariants(file: File): Promise<ImageVariants | null> {
    if (file.type === "image/gif") return null; // keep GIF animations untouched
    try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        const [full, thumb, og] = await Promise.all([
            encode(bitmap, 1200, "image/webp", 0.8),
            encode(bitmap, 400, "image/webp", 0.75),
            encode(bitmap, 1200, "image/jpeg", 0.8),
        ]);
        bitmap.close();
        return full && thumb && og ? { full, thumb, og } : null;
    } catch {
        return null;
    }
}
