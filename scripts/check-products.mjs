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

async function checkProducts() {
    try {
        // Get all products
        const { data: products, error } = await supabase
            .from('products')
            .select('product_id, code, name, subcategory_id')
            .order('product_id');

        if (error) {
            throw new Error('Error fetching products: ' + error.message);
        }

        const existingCodes = new Set(products?.map(p => p.code) || []);

        // Read Productos.md
        const productosPath = join(__dirname, '..', 'Productos.md');
        const content = readFileSync(productosPath, 'utf-8');
        const lines = content.split('\n');

        let currentSubcategory = null;
        const expectedProducts = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and main category
            if (!trimmed || trimmed === 'MUEBLES INFANTILES Y JUVENILES') continue;

            const isIndented = line.startsWith('\t') || line.startsWith(' ');

            // If not indented, it's a subcategory header
            if (!isIndented && trimmed.length > 0) {
                currentSubcategory = trimmed;
                continue;
            }

            // If indented and we have a subcategory, it's a product
            if (isIndented && currentSubcategory) {
                // Try to match product pattern: "CODE NAME"
                // Code can have letters, numbers, +, and spaces (for combined products like "8083+8088BB")
                const match = trimmed.match(/^([A-Z0-9+\s]+?)\s+([A-Z].+)$/);
                if (match) {
                    const code = match[1].trim().replace(/\s+/g, ' ');
                    const name = match[2].trim();
                    expectedProducts.push({
                        code,
                        name,
                        subcategory: currentSubcategory,
                        lineNumber: i + 1
                    });
                }
            }
        }

        const missingProducts = expectedProducts.filter(p => !existingCodes.has(p.code));

        // Also find products in DB that are NOT in the MD file
        const expectedCodes = new Set(expectedProducts.map(p => p.code));
        const extraProducts = products?.filter(p => !expectedCodes.has(p.code)) || [];

        const result = {
            totalInDB: products?.length || 0,
            totalExpected: expectedProducts.length,
            missingCount: missingProducts.length,
            extraCount: extraProducts.length,
            missingProducts: missingProducts,
            extraProducts: extraProducts.slice(0, 20), // Show first 20 extra
            allSubcategoriesFound: [...new Set(expectedProducts.map(p => p.subcategory))],
            sampleExpected: expectedProducts.slice(0, 10)
        };

        // Save to JSON file
        const outputPath = join(__dirname, '..', 'check-result.json');
        writeFileSync(outputPath, JSON.stringify(result, null, 2));

        console.log('Results saved to check-result.json');
        console.log(`Total in DB: ${result.totalInDB}`);
        console.log(`Total expected from Productos.md: ${result.totalExpected}`);
        console.log(`Missing from DB: ${result.missingCount}`);
        console.log(`Extra in DB (not in MD): ${result.extraCount}`);
        console.log(`\nSubcategories found: ${result.allSubcategoriesFound.join(', ')}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkProducts().catch(console.error);
