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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY; // Use service role for deletions
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicates() {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('ELIMINANDO PRODUCTOS DUPLICADOS');
        console.log('='.repeat(80) + '\n');

        // Get all products
        const { data: allProducts, error } = await supabase
            .from('products')
            .select('product_id, code, name')
            .order('code');

        if (error) {
            throw new Error(error.message);
        }

        console.log(`Total productos antes: ${allProducts.length}\n`);

        // Find duplicates by code
        const codeGroups = {};
        allProducts.forEach(product => {
            if (!codeGroups[product.code]) {
                codeGroups[product.code] = [];
            }
            codeGroups[product.code].push(product);
        });

        // Identify products to delete (keep the one with lowest product_id)
        const toDelete = [];
        Object.entries(codeGroups).forEach(([code, products]) => {
            if (products.length > 1) {
                // Sort by product_id and keep the first one
                products.sort((a, b) => a.product_id - b.product_id);
                const toKeep = products[0];
                const duplicates = products.slice(1);

                console.log(`\n📦 ${code} (${products.length} copias)`);
                console.log(`   ✓ MANTENER: ID ${toKeep.product_id} - ${toKeep.name}`);
                duplicates.forEach(dup => {
                    console.log(`   ❌ ELIMINAR: ID ${dup.product_id}`);
                    toDelete.push(dup.product_id);
                });
            }
        });

        console.log('\n' + '='.repeat(80));
        console.log(`\nProductos a eliminar: ${toDelete.length}\n`);

        if (toDelete.length === 0) {
            console.log('✅ No hay duplicados para eliminar\n');
            return;
        }

        // Ask for confirmation
        console.log('⚠️  ATENCIÓN: Esta operación eliminará los productos duplicados.');
        console.log('   Se mantendrá el producto con el ID más bajo de cada grupo.\n');

        // Delete duplicates
        console.log('💾 Eliminando productos duplicados...\n');

        let deletedCount = 0;
        let errorCount = 0;

        // Delete in batches of 100
        for (let i = 0; i < toDelete.length; i += 100) {
            const batch = toDelete.slice(i, i + 100);

            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .in('product_id', batch);

            if (deleteError) {
                console.error(`❌ Error eliminando batch ${i / 100 + 1}: ${deleteError.message}`);
                errorCount += batch.length;
            } else {
                deletedCount += batch.length;
                console.log(`   ✓ Eliminados ${deletedCount}/${toDelete.length} productos...`);
            }
        }

        // Get final count
        const { count: finalCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        console.log('\n' + '='.repeat(80));
        console.log('RESUMEN');
        console.log('='.repeat(80));
        console.log(`\nProductos antes: ${allProducts.length}`);
        console.log(`Productos eliminados: ${deletedCount}`);
        console.log(`Errores: ${errorCount}`);
        console.log(`Productos ahora: ${finalCount}`);
        console.log('\n✅ PROCESO COMPLETADO\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

removeDuplicates().catch(console.error);
