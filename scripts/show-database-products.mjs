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

async function showDatabaseProducts() {
    try {
        console.log('\n' + '='.repeat(100));
        console.log('PRODUCTOS EN LA BASE DE DATOS - VERIFICACIÓN DIRECTA');
        console.log('='.repeat(100) + '\n');

        // Get total count first
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        console.log(`📊 TOTAL DE PRODUCTOS EN LA BASE DE DATOS: ${count}\n`);

        // Get specific products the user mentioned
        const specificCodes = ['8087BB', '8087BA', '8087BR', 'N25', 'N27', 'N28', 'N29', 'N35', 'N36', 'N37'];

        console.log('🔍 BUSCANDO PRODUCTOS ESPECÍFICOS:\n');
        console.log('='.repeat(100));

        for (const code of specificCodes) {
            const { data, error } = await supabase
                .from('products')
                .select('product_id, code, name, price, stock, active')
                .eq('code', code);

            if (error) {
                console.log(`❌ ERROR buscando ${code}: ${error.message}`);
            } else if (data && data.length > 0) {
                const product = data[0];
                console.log(`✅ CÓDIGO: ${product.code.padEnd(12)} | ID: ${product.product_id.toString().padEnd(6)} | ${product.name}`);
                console.log(`   Precio: $${product.price} | Stock: ${product.stock} | Activo: ${product.active ? 'Sí' : 'No'}`);
                console.log('-'.repeat(100));
            } else {
                console.log(`❌ NO ENCONTRADO: ${code}`);
                console.log('-'.repeat(100));
            }
        }

        console.log('\n' + '='.repeat(100));

        // Also show some products starting with 8087 and N2/N3
        console.log('\n📋 TODOS LOS PRODUCTOS QUE EMPIEZAN CON "8087":\n');
        const { data: p8087 } = await supabase
            .from('products')
            .select('code, name')
            .ilike('code', '8087%')
            .order('code');

        if (p8087 && p8087.length > 0) {
            p8087.forEach(p => {
                console.log(`   ${p.code.padEnd(15)} - ${p.name}`);
            });
        } else {
            console.log('   ❌ NO SE ENCONTRARON PRODUCTOS');
        }

        console.log('\n📋 TODOS LOS PRODUCTOS QUE EMPIEZAN CON "N2" O "N3":\n');
        const { data: pN } = await supabase
            .from('products')
            .select('code, name')
            .or('code.like.N2%,code.like.N3%')
            .order('code');

        if (pN && pN.length > 0) {
            pN.forEach(p => {
                console.log(`   ${p.code.padEnd(15)} - ${p.name}`);
            });
        } else {
            console.log('   ❌ NO SE ENCONTRARON PRODUCTOS');
        }

        console.log('\n' + '='.repeat(100));
        console.log('\nFIN DE LA VERIFICACIÓN\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

showDatabaseProducts().catch(console.error);
