-- Las fotos optimizadas se guardan como WebP (scripts/optimize-images.mjs y el admin)
update storage.buckets
set allowed_mime_types = array['image/png','image/jpeg','image/jpg','image/gif','image/webp']
where id = 'products';
