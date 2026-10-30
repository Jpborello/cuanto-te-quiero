-- Auditoría de seguridad: cierra escrituras públicas y limita la gestión a admins.
-- La tienda solo lee datos activos; el panel escribe con la sesión del admin
-- (cliente del navegador) o con la service role (rutas /api).

-- Helper: ¿el usuario logueado es admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- admins: cualquier usuario logueado podía insertarse como admin.
-- Solo se deja la lectura de su propia fila; altas/bajas desde el dashboard de Supabase.
drop policy if exists "Admins only" on public.admins;

-- products: tenía RLS desactivado (cualquiera podía editar o borrar el catálogo)
alter table public.products enable row level security;
drop policy if exists "Public read products" on public.products;
create policy "Public read active products" on public.products
    for select using (active = true);
create policy "Admins manage products" on public.products
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- categories: tenía RLS desactivado
alter table public.categories enable row level security;
create policy "Admins manage categories" on public.categories
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- subcategories: el admin no veía las inactivas
create policy "Admins manage subcategories" on public.subcategories
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- product_images: tenía RLS desactivado
alter table public.product_images enable row level security;
create policy "Admins manage product images" on public.product_images
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- settings: la política de escritura era `true` (cualquiera cambiaba precios, carrito y sorteo)
drop policy if exists "Permitir modificacion a administradores" on public.settings;
create policy "Admins manage settings" on public.settings
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- raffle_participants: el registro pasa por /api/raffle/register (service role),
-- el insert público permitía saltear sus validaciones
drop policy if exists "Allow public inserts" on public.raffle_participants;

-- orders / order_items / customers: sin políticas, el panel no podía leerlas
create policy "Admins manage orders" on public.orders
    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage order items" on public.order_items
    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage customers" on public.customers
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage, bucket `products`: cualquiera podía subir, pisar o borrar archivos.
-- El bucket es público, así que la lectura por URL pública sigue funcionando.
drop policy if exists "Public Access to Products" on storage.objects;
create policy "Admins manage product files" on storage.objects
    for all to authenticated
    using (bucket_id = 'products' and public.is_admin())
    with check (bucket_id = 'products' and public.is_admin());

-- Funciones con search_path fijo (advisor de Supabase)
alter function public.decrease_product_stock() set search_path = public;
alter function public.redeem_gift_card(text) set search_path = public;
alter function public.pay_order_with_gift_card(uuid, text) set search_path = public;
alter function public.create_variable_gift_card(numeric, text, text, text) set search_path = public;
