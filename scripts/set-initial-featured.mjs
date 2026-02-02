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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setInitialFeatured() {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('MARCANDO PRODUCTOS INICIALES COMO DESTACADOS');
        console.log('='.repeat(80) + '\n');

        // Get first 6 active products
        const { data: products, error } = await supabase
            .from('products')
            .select('uid, product_id, code, name')
            .eq('active', true)
            .order('product_id', { ascending: true })
            .limit(6);

        if (error) {
            throw error;
        }

        if (!products || products.length === 0) {
            console.log('❌ No hay productos activos en la base de datos\n');
            return;
        }

        console.log(`Encontrados ${products.length} productos para marcar como destacados:\n`);

        // Mark them as featured
        const productUids = products.map(p => p.uid);

        const { error: updateError } = await supabase
            .from('products')
            .update({ featured: true })
            .in('uid', productUids);

        if (updateError) {
            throw updateError;
        }

        console.log('✅ Productos marcados como destacados:\n');
        products.forEach((p, index) => {
            console.log(`   ${index + 1}. ${p.code} - ${p.name}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ PROCESO COMPLETADO');
        console.log('\nPodés ver estos productos en el carrusel del home.');
        console.log('Desde el panel admin podés cambiar cuáles están destacados.\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.message.includes('featured')) {
            console.log('\n⚠️  Parece que la columna "featured" aún no existe.');
            console.log('Por favor, agregá la columna primero desde Supabase Dashboard.\n');
        }

        process.exit(1);
    }
}

setInitialFeatured().catch(console.error);
