import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsAndImages() {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('VERIFICANDO PRODUCTOS E IMÁGENES');
        console.log('='.repeat(80) + '\n');

        // Check first 10 products
        const { data: products, error } = await supabase
            .from('products')
            .select('product_id, code, name, image_url, active, price, stock')
            .eq('active', true)
            .order('product_id')
            .limit(10);

        if (error) {
            console.error('Error fetching products:', error.message);
            return;
        }

        console.log(`Total productos activos (primeros 10):\n`);
        products?.forEach(p => {
            console.log(`ID: ${p.product_id} | ${p.code} | ${p.name}`);
            console.log(`   Precio: $${p.price} | Stock: ${p.stock}`);
            console.log(`   image_url: ${p.image_url || 'NULL'}`);
            console.log('');
        });

        // Check if product_images table exists
        console.log('\n' + '='.repeat(80));
        console.log('VERIFICANDO TABLA product_images:\n');

        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .limit(5);

        if (imagesError) {
            if (imagesError.message.includes('does not exist')) {
                console.log('❌ La tabla product_images NO EXISTE\n');
            } else {
                console.log(`Error: ${imagesError.message}\n`);
            }
        } else {
            console.log(`✅ La tabla product_images EXISTE con ${images?.length || 0} registros (muestra)`);
            if (images && images.length > 0) {
                console.log('\nPrimeros registros:');
                images.forEach(img => {
                    console.log(JSON.stringify(img, null, 2));
                });
            }
        }

        // Count products with and without images
        const { data: allProducts } = await supabase
            .from('products')
            .select('image_url')
            .eq('active', true);

        const withImages = allProducts?.filter(p => p.image_url && p.image_url.trim() !== '') || [];
        const withoutImages = allProducts?.filter(p => !p.image_url || p.image_url.trim() === '') || [];

        console.log('\n' + '='.repeat(80));
        console.log('ESTADÍSTICAS DE IMÁGENES:\n');
        console.log(`Total productos activos: ${allProducts?.length || 0}`);
        console.log(`Con image_url: ${withImages.length}`);
        console.log(`Sin image_url: ${withoutImages.length}`);
        console.log('\n' + '='.repeat(80) + '\n');

    } catch (error) {
        console.error('Error:', error);
    }
}

checkProductsAndImages().catch(console.error);
