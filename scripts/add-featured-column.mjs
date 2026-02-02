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

async function addFeaturedColumn() {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('AGREGANDO COLUMNA "featured" A LA TABLA products');
        console.log('='.repeat(80) + '\n');

        // Check if column already exists
        const { data: columns, error: checkError } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (checkError) {
            throw checkError;
        }

        if (columns && columns.length > 0 && 'featured' in columns[0]) {
            console.log('✅ La columna "featured" ya existe en la tabla products\n');

            // Show current featured products
            const { data: featured } = await supabase
                .from('products')
                .select('product_id, code, name, featured')
                .eq('featured', true);

            console.log(`Productos destacados actuales: ${featured?.length || 0}\n`);
            if (featured && featured.length > 0) {
                featured.forEach(p => {
                    console.log(`  - ${p.code}: ${p.name}`);
                });
            }
            return;
        }

        console.log('⚠️  La columna "featured" no existe. Deberás agregarla manualmente en Supabase.\n');
        console.log('INSTRUCCIONES:');
        console.log('1. Abrí Supabase Dashboard');
        console.log('2. Andá a Table Editor > products');
        console.log('3. Click en "Add column"');
        console.log('4. Configuración:');
        console.log('   - Name: featured');
        console.log('   - Type: bool (boolean)');
        console.log('   - Default value: false');
        console.log('   - Nullable: NO (unchecked)');
        console.log('5. Click en "Save"\n');
        console.log('Una vez agregada la columna, ejecutá este script de nuevo para verificar.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addFeaturedColumn().catch(console.error);
