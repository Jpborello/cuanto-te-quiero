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

async function finalReport() {
    try {
        // Get ALL products
        const { data: allProducts, error } = await supabase
            .from('products')
            .select('code, name')
            .order('code');

        if (error) throw error;

        const productMap = new Map();
        allProducts.forEach(p => productMap.set(p.code, p.name));

        // Specific codes to check
        const testCodes = ['8087BB', '8087BA', '8087BR', 'N25', 'N27', 'N28', 'N29', 'N35', 'N36', 'N37'];

        const report = {
            totalInDB: allProducts.length,
            timestamp: new Date().toISOString(),
            specificProductsCheck: {},
            summary: []
        };

        console.log('='.repeat(80));
        console.log('REPORTE FINAL DE VERIFICACIÓN');
        console.log('='.repeat(80));
        console.log(`\nTotal productos en base de datos: ${allProducts.length}\n`);
        console.log('Productos específicos solicitados:\n');

        testCodes.forEach(code => {
            const found = productMap.has(code);
            const name = productMap.get(code) || 'NOT FOUND';

            report.specificProductsCheck[code] = { found, name };
            report.summary.push({ code, found, name });

            console.log(`  ${found ? '✅' : '❌'} ${code.padEnd(10)} - ${name}`);
        });

        // Count how many are found
        const foundCount = testCodes.filter(code => productMap.has(code)).length;

        console.log(`\n${'='.repeat(80)}`);
        console.log(`RESULTADO: ${foundCount}/${testCodes.length} productos encontrados`);
        console.log('='.repeat(80));

        if (foundCount === testCodes.length) {
            console.log('\n✅ TODOS LOS PRODUCTOS ESTÁN EN LA BASE DE DATOS\n');
        } else {
            console.log('\n❌ FALTAN PRODUCTOS POR AGREGAR\n');
        }

        // Save report
        writeFileSync(
            join(__dirname, '..', 'final-report.json'),
            JSON.stringify(report, null, 2)
        );

        process.exit(foundCount === testCodes.length ? 0 : 1);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

finalReport().catch(console.error);
