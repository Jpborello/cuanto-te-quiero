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

async function verifySpecificProducts() {
    try {
        // Get all products from DB
        const { data: allProducts, error } = await supabase
            .from('products')
            .select('code, name')
            .order('code');

        if (error) {
            throw new Error('Error fetching products: ' + error.message);
        }

        console.log(`\n📊 Total products in DB: ${allProducts?.length || 0}\n`);

        // Check specific products mentioned by user
        const testCodes = [
            '8087BB', '8087BA', '8087BR',
            'N25', 'N27', 'N28', 'N29', 'N35', 'N36', 'N37'
        ];

        console.log('🔍 Checking specific products mentioned:\n');
        testCodes.forEach(code => {
            const found = allProducts?.find(p => p.code === code);
            if (found) {
                console.log(`   ✅ ${code}: ${found.name}`);
            } else {
                console.log(`   ❌ ${code}: NOT FOUND`);
            }
        });

        // Get all products starting with 8087
        console.log('\n\n🔍 All products starting with "8087":\n');
        const p8087 = allProducts?.filter(p => p.code.startsWith('8087')) || [];
        if (p8087.length === 0) {
            console.log('   ❌ NO PRODUCTS FOUND');
        } else {
            p8087.forEach(p => console.log(`   ✅ ${p.code}: ${p.name}`));
        }

        // Get all products starting with N2 or N3
        console.log('\n\n🔍 All products starting with "N2" or "N3":\n');
        const pN = allProducts?.filter(p => p.code.startsWith('N2') || p.code.startsWith('N3')) || [];
        if (pN.length === 0) {
            console.log('   ❌ NO PRODUCTS FOUND');
        } else {
            pN.forEach(p => console.log(`   ✅ ${p.code}: ${p.name}`));
        }

        // Now parse Productos.md to find ALL products that should be there
        const productosPath = join(__dirname, '..', 'Productos.md');
        const content = readFileSync(productosPath, 'utf-8');
        const lines = content.split('\n');

        let currentSubcategory = null;
        const expectedProducts = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (!trimmed || trimmed === 'MUEBLES INFANTILES Y JUVENILES') continue;

            const isIndented = line.startsWith('\t') || line.startsWith(' ');

            if (!isIndented && trimmed.length > 0) {
                currentSubcategory = trimmed;
                continue;
            }

            if (isIndented && currentSubcategory) {
                const match = trimmed.match(/^([A-Z0-9+\s]+?)\s+([A-Z].+)$/);
                if (match) {
                    const code = match[1].trim().replace(/\s+/g, ' ');
                    const name = match[2].trim();
                    expectedProducts.push({ code, name, subcategory: currentSubcategory });
                }
            }
        }

        // Find missing products
        const dbCodes = new Set(allProducts?.map(p => p.code) || []);
        const missingProducts = expectedProducts.filter(p => !dbCodes.has(p.code));

        console.log('\n\n' + '='.repeat(80));
        console.log('PRODUCTOS FALTANTES EN LA BASE DE DATOS');
        console.log('='.repeat(80) + '\n');
        console.log(`Total esperado de Productos.md: ${expectedProducts.length}`);
        console.log(`Total en base de datos: ${allProducts?.length || 0}`);
        console.log(`FALTANTES: ${missingProducts.length}\n`);

        if (missingProducts.length > 0) {
            // Group by subcategory
            const bySubcat = {};
            missingProducts.forEach(p => {
                if (!bySubcat[p.subcategory]) bySubcat[p.subcategory] = [];
                bySubcat[p.subcategory].push(p);
            });

            Object.entries(bySubcat).forEach(([subcat, prods]) => {
                console.log(`\n📁 ${subcat} (${prods.length} faltantes):`);
                prods.forEach(p => {
                    console.log(`   ❌ ${p.code}: ${p.name}`);
                });
            });
        } else {
            console.log('✅ No hay productos faltantes');
        }

        // Save to JSON
        const result = {
            totalInDB: allProducts?.length || 0,
            totalExpected: expectedProducts.length,
            missingCount: missingProducts.length,
            missingProducts: missingProducts
        };

        const outputPath = join(__dirname, '..', 'missing-products.json');
        writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`\n\n💾 Results saved to missing-products.json\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

verifySpecificProducts().catch(console.error);
