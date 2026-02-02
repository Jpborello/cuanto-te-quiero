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

async function findDuplicates() {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('BUSCANDO PRODUCTOS DUPLICADOS');
        console.log('='.repeat(80) + '\n');

        // Get all products
        const { data: allProducts, error } = await supabase
            .from('products')
            .select('product_id, code, name')
            .order('code');

        if (error) {
            throw new Error(error.message);
        }

        console.log(`Total productos en DB: ${allProducts.length}\n`);

        // Find duplicates by code
        const codeCount = {};
        const duplicates = {};

        allProducts.forEach(product => {
            if (!codeCount[product.code]) {
                codeCount[product.code] = [];
            }
            codeCount[product.code].push(product);
        });

        // Filter only duplicates
        Object.entries(codeCount).forEach(([code, products]) => {
            if (products.length > 1) {
                duplicates[code] = products;
            }
        });

        const duplicateCount = Object.keys(duplicates).length;
        const totalDuplicateProducts = Object.values(duplicates).reduce((sum, arr) => sum + arr.length, 0);

        console.log(`Productos únicos: ${allProducts.length - (totalDuplicateProducts - duplicateCount)}`);
        console.log(`Códigos duplicados: ${duplicateCount}`);
        console.log(`Total productos duplicados: ${totalDuplicateProducts - duplicateCount} (extras a eliminar)\n`);

        if (duplicateCount === 0) {
            console.log('✅ No se encontraron productos duplicados\n');
            return;
        }

        console.log('='.repeat(80));
        console.log('PRODUCTOS DUPLICADOS ENCONTRADOS:\n');

        Object.entries(duplicates).forEach(([code, products]) => {
            console.log(`\n📦 CÓDIGO: ${code} (${products.length} copias)`);
            products.forEach((p, index) => {
                console.log(`   ${index === 0 ? '✓ MANTENER' : '❌ ELIMINAR'} - ID: ${p.product_id} | ${p.name}`);
            });
        });

        // Save report
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts: allProducts.length,
            uniqueProducts: allProducts.length - (totalDuplicateProducts - duplicateCount),
            duplicateCodes: duplicateCount,
            productsToDelete: totalDuplicateProducts - duplicateCount,
            duplicates: duplicates
        };

        writeFileSync(
            join(__dirname, '..', 'duplicates-report.json'),
            JSON.stringify(report, null, 2)
        );

        console.log('\n' + '='.repeat(80));
        console.log(`\n💾 Reporte guardado en: duplicates-report.json`);
        console.log(`\n⚠️  Para eliminar los duplicados, ejecutá: node scripts/remove-duplicates.mjs\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

findDuplicates().catch(console.error);
