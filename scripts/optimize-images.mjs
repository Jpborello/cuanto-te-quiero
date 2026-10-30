// Genera versiones WebP livianas de las fotos de productos y actualiza image_url.
//
// Por cada foto crea, en el bucket `products`:
//   optimized/<id>-1200.webp  (ficha de producto, es la que queda en image_url)
//   optimized/<id>-400.webp   (miniatura para grillas; la tienda la deduce del sufijo)
//   optimized/<id>-og.jpg     (vista previa al compartir: WhatsApp no siempre muestra WebP)
// Los GIF, las URLs externas y las fotos ya optimizadas no se tocan.
// Las originales NO se borran. Respaldo: tabla product_image_url_backup.
//
// Uso:
//   node scripts/optimize-images.mjs --dry-run            muestra qué haría
//   node scripts/optimize-images.mjs --uids <uid,uid>     solo esos productos
//   node scripts/optimize-images.mjs --limit 5            los primeros 5 pendientes
//   node scripts/optimize-images.mjs                      todos los pendientes

import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";

const env = Object.fromEntries(
    fs.readFileSync(".env.local", "utf8").split(/\r?\n/)
        .filter((l) => l.includes("=") && !l.startsWith("#"))
        .map((l) => {
            const i = l.indexOf("=");
            return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
        })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "products";
const OPTIMIZED_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/optimized/`;
const SIZES = [
    { suffix: "1200", width: 1200, quality: 80, format: "webp" },
    { suffix: "400", width: 400, quality: 75, format: "webp" },
    { suffix: "og", width: 1200, quality: 80, format: "jpeg" },
];

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const argValue = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
};
const LIMIT = argValue("--limit") ? parseInt(argValue("--limit"), 10) : Infinity;
const UIDS = argValue("--uids")?.split(",").map((s) => s.trim()).filter(Boolean);

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const needsOptimizing = (url) =>
    typeof url === "string" &&
    url.startsWith(`${SUPABASE_URL}/storage/v1/object/public/`) &&
    !url.startsWith(OPTIMIZED_PREFIX) &&
    !/\.gif(\?|$)/i.test(url);

async function fetchProducts() {
    let query = `${SUPABASE_URL}/rest/v1/products?select=uid,code,image_url&order=code`;
    if (UIDS?.length) query += `&uid=in.(${UIDS.join(",")})`;
    const res = await fetch(query, { headers: { ...headers, Range: "0-4999" } });
    if (!res.ok) throw new Error(`No se pudieron leer los productos: ${res.status} ${await res.text()}`);
    return res.json();
}

async function upload(path, buffer, contentType) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
        method: "POST",
        headers: { ...headers, "Content-Type": contentType, "Cache-Control": "max-age=31536000", "x-upsert": "true" },
        body: buffer,
    });
    if (!res.ok) throw new Error(`Upload ${path}: ${res.status} ${await res.text()}`);
}

// Same origin URL always maps to the same optimized file, so re-runs are idempotent
const cache = new Map();
async function optimize(url) {
    if (cache.has(url)) return cache.get(url);
    const id = crypto.createHash("sha1").update(url).digest("hex").slice(0, 20);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Descarga ${url}: ${res.status}`);
    const original = Buffer.from(await res.arrayBuffer());

    const sizes = {};
    for (const size of SIZES) {
        const resized = sharp(original)
            .rotate() // respeta la orientación EXIF
            .resize({ width: size.width, height: size.width, fit: "inside", withoutEnlargement: true });
        const out = size.format === "jpeg"
            ? await resized.flatten({ background: "#ffffff" }).jpeg({ quality: size.quality, mozjpeg: true }).toBuffer()
            : await resized.webp({ quality: size.quality }).toBuffer();
        sizes[size.suffix] = out.length;
        const ext = size.format === "jpeg" ? "jpg" : "webp";
        if (!DRY_RUN) await upload(`optimized/${id}-${size.suffix}.${ext}`, out, `image/${size.format}`);
    }
    const result = { newUrl: `${OPTIMIZED_PREFIX}${id}-1200.webp`, before: original.length, sizes };
    cache.set(url, result);
    return result;
}

async function updateProduct(uid, imageUrl) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?uid=eq.${uid}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ image_url: imageUrl }),
    });
    if (!res.ok) throw new Error(`Update ${uid}: ${res.status} ${await res.text()}`);
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

const products = (await fetchProducts()).filter((p) => (p.image_url || []).some(needsOptimizing));
const queue = products.slice(0, LIMIT);
console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Productos con fotos pendientes: ${products.length}. Procesando: ${queue.length}`);

let totalBefore = 0, totalAfter1200 = 0, totalAfter400 = 0, done = 0;
const failures = [];

for (const product of queue) {
    try {
        const newImages = [];
        for (const url of product.image_url) {
            if (!needsOptimizing(url)) {
                newImages.push(url);
                continue;
            }
            const r = await optimize(url);
            totalBefore += r.before;
            totalAfter1200 += r.sizes["1200"];
            totalAfter400 += r.sizes["400"];
            newImages.push(r.newUrl);
        }
        if (!DRY_RUN) await updateProduct(product.uid, newImages);
        done++;
        if (done % 25 === 0 || queue.length <= 10) {
            console.log(`  ${done}/${queue.length} ${product.code} ok`);
        }
    } catch (error) {
        failures.push({ uid: product.uid, code: product.code, error: error.message });
        console.log(`  ERROR ${product.code}: ${error.message}`);
    }
}

console.log(`\nListo: ${done} productos${DRY_RUN ? " (sin escribir nada)" : ""}, ${failures.length} con error.`);
console.log(`Peso original: ${kb(totalBefore)} | 1200px: ${kb(totalAfter1200)} | 400px: ${kb(totalAfter400)}`);
if (failures.length) {
    fs.writeFileSync("optimize-images-errors.json", JSON.stringify(failures, null, 2));
    console.log("Errores guardados en optimize-images-errors.json");
}
