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

async function importProducts() {
    console.log('='.repeat(80));
    console.log('IMPORTACIÓN DE PRODUCTOS DESDE PRODUCTOS.MD');
    console.log('='.repeat(80));

    try {
        // 1. Obtener categoría "MUEBLES INFANTILES Y JUVENILES"
        console.log('\n📁 Buscando categoría principal...');
        const { data: categories } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%MUEBLES INFANTILES%');

        if (!categories || categories.length === 0) {
            console.error('❌ No se encontró la categoría "MUEBLES INFANTILES"');
            process.exit(1);
        }

        const categoryId = categories[0].id;
        console.log(`✅ Categoría encontrada: ${categories[0].name} (${categoryId})`);

        // 2. Obtener todas las subcategorías existentes
        console.log('\n📋 Obteniendo subcategorías existentes...');
        const { data: existingSubcats } = await supabase
            .from('subcategories')
            .select('id, name, category_id');

        const subcatMap = {};
        existingSubcats?.forEach(sub => {
            subcatMap[sub.name.toUpperCase().trim()] = sub.id;
        });

        console.log(`✅ ${existingSubcats?.length || 0} subcategorías encontradas`);

        // 3. Subcategorías necesarias
        const neededSubcats = [
            'CAJONERAS',
            'ROPEROS Y PLACARES',
            'MONTESSORI',
            'CAMAS DE 1 PLAZA Y NIDO',
            'CUCHETAS - RINCONERAS - PUENTE',
            'ESCRITORIOS'
        ];

        // 4. Crear subcategorías faltantes
        console.log('\n🔨 Verificando subcategorías necesarias...');
        for (const subcatName of neededSubcats) {
            if (!subcatMap[subcatName.toUpperCase()]) {
                console.log(`   ➕ Creando: ${subcatName}`);
                const { data, error } = await supabase
                    .from('subcategories')
                    .insert({ name: subcatName, category_id: categoryId })
                    .select()
                    .single();

                if (error) {
                    console.error(`   ❌ Error creando ${subcatName}:`, error.message);
                } else {
                    subcatMap[subcatName.toUpperCase()] = data.id;
                    console.log(`   ✅ Creada: ${subcatName}`);
                }
            } else {
                console.log(`   ✓ Ya existe: ${subcatName}`);
            }
        }

        // 5. Leer archivo Productos.md
        console.log('\n📖 Leyendo Productos.md...');
        const productosPath = join(__dirname, '..', 'Productos.md');
        const content = readFileSync(productosPath, 'utf-8');
        const lines = content.split('\n');

        // 6. Parse productos
        let currentSubcategory = null;
        const productsToInsert = [];
        let lineNumber = 0;

        for (const line of lines) {
            lineNumber++;
            const trimmed = line.trim();

            // Skip empty lines
            if (!trimmed) continue;

            // Skip main category
            if (trimmed === 'MUEBLES INFANTILES Y JUVENILES') continue;

            // Detectar subcategoría (línea sin indentación y que existe en el mapa)
            const isIndented = line.startsWith('\t') || line.startsWith(' ');

            if (!isIndented && trimmed.length > 0) {
                const cleanName = trimmed.toUpperCase().trim();
                if (subcatMap[cleanName]) {
                    currentSubcategory = cleanName;
                    console.log(`\n📂 Procesando subcategoría: ${trimmed}`);
                }
                continue;
            }

            // Detectar producto (línea indentada)
            if (isIndented && currentSubcategory && trimmed.length > 0) {
                // Formato: "CODE NOMBRE DEL PRODUCTO"
                // El código puede tener letras, números y caracteres como + y espacios
                const match = trimmed.match(/^([A-Z0-9+\s]+?)\s+([A-Z].+)$/);
                if (match) {
                    let [, code, name] = match;
                    // Limpiar código de espacios extras
                    code = code.trim().replace(/\s+/g, ' ');
                    name = name.trim();

                    productsToInsert.push({
                        code: code,
                        name: name,
                        subcategory: currentSubcategory,
                        line: lineNumber
                    });

                    console.log(`   ✓ ${code}: ${name.substring(0, 40)}...`);
                }
            }
        }

        console.log(`\n✅ ${productsToInsert.length} productos parseados`);

        if (productsToInsert.length === 0) {
            console.error('❌ No se encontraron productos para insertar');
            process.exit(1);
        }

        // 7. Obtener próximo product_id disponible
        const { data: lastProduct } = await supabase
            .from('products')
            .select('product_id')
            .order('product_id', { ascending: false })
            .limit(1)
            .single();

        let nextProductId = lastProduct ? lastProduct.product_id + 1 : 1;
        console.log(`\n🔢 Próximo product_id: ${nextProductId}`);

        // 8. Insertar productos
        console.log('\n💾 Insertando productos en la base de datos...');
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

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
                console.error(`   ❌ Error insertando ${product.code}: ${error.message}`);
                errors.push({ product: product.code, error: error.message, line: product.line });
                errorCount++;
            } else {
                successCount++;
                if (successCount % 20 === 0) {
                    console.log(`   ✓ ${successCount} productos insertados...`);
                }
            }

            nextProductId++;
        }

        // 9. Resumen final
        console.log('\n' + '='.repeat(80));
        console.log('RESUMEN DE IMPORTACIÓN');
        console.log('='.repeat(80));
        console.log(`\n✅ Productos insertados correctamente: ${successCount}`);
        console.log(`❌ Errores: ${errorCount}`);
        console.log(`📊 Total procesados: ${productsToInsert.length}`);

        if (errors.length > 0) {
            console.log('\n❌ Detalles de errores:');
            errors.forEach(e => {
                console.log(`   Línea ${e.line}: ${e.product} - ${e.error}`);
            });
        }

        // Mostrar algunos ejemplos
        console.log('\n📝 Ejemplos de productos importados:');
        const examples = productsToInsert.slice(0, 5);
        examples.forEach(p => {
            console.log(`   - ${p.code}: ${p.name} (${p.subcategory})`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ IMPORTACIÓN COMPLETA');
        console.log('='.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ Error durante la importación:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

importProducts().catch(console.error);
