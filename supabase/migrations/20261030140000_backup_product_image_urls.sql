-- Respaldo de image_url antes de optimizar las fotos (scripts/optimize-images.mjs).
-- Para volver atrás:
--   update public.products p set image_url = b.image_url
--   from public.product_image_url_backup b where b.uid = p.uid;
create table public.product_image_url_backup (
    uid uuid primary key,
    image_url text[],
    backed_up_at timestamptz not null default now()
);
-- Solo accesible con la service role (sin políticas)
alter table public.product_image_url_backup enable row level security;
insert into public.product_image_url_backup (uid, image_url)
select uid, image_url from public.products;
