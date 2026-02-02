import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importMissingProducts() {
    console.log('='.repeat(80));
    console.log('IMPORTACIÓN DE PRODUCTOS FALTANTES');
    console.log('='.repeat(80));

    try {
        // 1. Get category
        const { data: categories } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%MUEBLES INFANTILES%');

        if (!categories || categories.length === 0) {
            console.error('❌ No se encontró la categoría');
            process.exit(1);
        }

        const categoryId = categories[0].id;
        console.log(`✅ Categoría: ${categories[0].name} (${categoryId})`);

        // 2. Get all subcategories
        const { data: existingSubcats } = await supabase
            .from('subcategories')
            .select('id, name, category_id');

        const subcatMap = {};
        existingSubcats?.forEach(sub => {
            subcatMap[sub.name.toUpperCase().trim()] = sub.id;
        });

        // 3. Get all existing products
        const { data: existingProducts } = await supabase
            .from('products')
            .select('code');

        const existingCodes = new Set(existingProducts?.map(p => p.code) || []);
        console.log(`\n📊 Productos existentes: ${existingCodes.size}`);

        // 4. Read Productos.md
        const productosPath = join(__dirname, '..', 'Productos.md');
        const content = readFileSync(productosPath, 'utf-8');
        const lines = content.split('\n');

        let currentSubcategory = null;
        const productsToInsert = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty and main category
            if (!trimmed || trimmed === 'MUEBLES INFANTILES Y JUVENILES') continue;

            const isIndented = line.startsWith('\t') || line.startsWith(' ');

            // Detect subcategory
            if (!isIndented && trimmed.length > 0) {
                const cleanName = trimmed.toUpperCase().trim();
                if (subcatMap[cleanName]) {
                    currentSubcategory = cleanName;
                    console.log(`\n 📂 Subcategoría: ${trimmed}`);
                }
                continue;
            }

            // Detect product
            if (isIndented && currentSubcategory && trimmed.length > 0) {
                // Try different regex patterns
                let match = trimmed.match(/^([A-Z0-9+\s]+?)\s+([A-Z].+)$/);

                // If no match, try a more flexible pattern
                if (!match) {
                    match = trimmed.match(/^([A-Z0-9+]+(?:\s*\+\s*[A-Z0-9]+)*)\s+(.+)$/);
                }

                if (match) {
                    let [, code, name] = match;
                    code = code.trim().replace(/\s+/g, ' ');
                    name = name.trim();

                    // Only add if not exists
                    if (!existingCodes.has(code)) {
                        productsToInsert.push({
                            code: code,
                            name: name,
                            subcategory: currentSubcategory,
                            line: i + 1
                        });
                        console.log(`   ➕ ${code}: ${name.substring(0, 50)}`);
                    }
                } else {
                    console.log(`   ⚠️  No se pudo parsear línea ${i + 1}: ${trimmed.substring(0, 60)}`);
                }
            }
        }

        console.log(`\n✅ Productos a insertar: ${productsToInsert.length}`);

        if (productsToInsert.length === 0) {
            console.log('\n✅ No hay productos faltantes\n');
            return;
        }

        // 5. Get next product_id
        const { data: lastProduct } = await supabase
            .from('products')
            .select('product_id')
            .order('product_id', { ascending: false })
            .limit(1)
            .single();

        let nextProductId = lastProduct ? lastProduct.product_id + 1 : 1;
        console.log(`\n🔢 Próximo product_id: ${nextProductId}`);

        // 6. Insert products
        console.log('\n💾 Insertando productos...\n');
        let successCount = 0;
        let errorCount = 0;

        for (const product of productsToInsert) {
            const subcategoryId = subcatMap[product.subcategory];

            const { error } = await supabase
                .from('products')
                .insert({
                    product_id: nextProductId,
                    code: product.code,
                    name: product.name,
                    category_id: categoryId,
                    subcategory_id: subcategoryId,
                    price: 0,
                    stock: 0,
                    active: true,
                    description: '',
                    image_url: null
                });

            if (error) {
                console.error(`   ❌ Error: ${product.code} - ${error.message}`);
                errorCount++;
            } else {
                console.log(`   ✅ ${product.code}: ${product.name}`);
                successCount++;
            }

            nextProductId++;
        }

        // 7. Summary
        console.log('\n' + '='.repeat(80));
        console.log('RESUMEN');
        console.log('='.repeat(80));
        console.log(`✅ Insertados: ${successCount}`);
        console.log(`❌ Errores: ${errorCount}`);
        console.log('='.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

importMissingProducts().catch(console.error);
