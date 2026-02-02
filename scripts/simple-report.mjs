import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
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

async function createSimpleReport() {
    try {
        // Get total count
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        // Get specific products
        const specificCodes = ['8087BB', '8087BA', '8087BR', 'N25', 'N27', 'N28', 'N29', 'N35', 'N36', 'N37'];

        const report = {
            totalProductsInDatabase: count,
            timestamp: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
            specificProducts: []
        };

        for (const code of specificCodes) {
            const { data } = await supabase
                .from('products')
                .select('product_id, code, name, price, stock, active')
                .eq('code', code)
                .limit(1);

            if (data && data.length > 0) {
                report.specificProducts.push(data[0]);
            } else {
                report.specificProducts.push({
                    code: code,
                    found: false,
                    message: 'NOT FOUND IN DATABASE'
                });
            }
        }

        // Save to JSON
        const outputPath = join(__dirname, '..', 'productos-verificacion.json');
        writeFileSync(outputPath, JSON.stringify(report, null, 2));

        console.log('Reporte guardado en: productos-verificacion.json');
        console.log(`Total productos: ${count}`);
        console.log(`Encontrados: ${report.specificProducts.filter(p => p.product_id).length}/${specificCodes.length}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createSimpleReport().catch(console.error);
