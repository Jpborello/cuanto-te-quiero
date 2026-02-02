import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubcategories() {
    console.log('='.repeat(70));
    console.log('SUBCATEGORÍAS ACTUALES EN LA BASE DE DATOS');
    console.log('='.repeat(70));

    // Get all existing subcategories
    const { data: subcategories, error } = await supabase
        .from('subcategories')
        .select('id, name, category_id')
        .order('name');

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log(`\n✅ Total subcategorías encontradas: ${subcategories?.length || 0}\n`);

    if (subcategories && subcategories.length > 0) {
        subcategories.forEach((sub, idx) => {
            console.log(`${idx + 1}. ${sub.name}`);
        });
    }

    // Nuevas subcategorías del archivo Productos.md
    const newSubcategories = [
        'CAJONERAS',
        'ROPEROS Y PLACARES',
        'MONTESSORI',
        'CAMAS DE 1 PLAZA Y NIDO',
        'CUCHETAS - RINCONERAS - PUENTE',
        'ESCRITORIOS'
    ];

    console.log('\n' + '='.repeat(70));
    console.log('SUBCATEGORÍAS EN PRODUCTOS.MD (A VERIFICAR)');
    console.log('='.repeat(70) + '\n');

    const existingNames = subcategories?.map(s => s.name.toUpperCase()) || [];
    const missing = [];
    const existing = [];

    newSubcategories.forEach(name => {
        if (existingNames.includes(name.toUpperCase())) {
            existing.push(name);
            console.log(`✅ ${name} - YA EXISTE`);
        } else {
            missing.push(name);
            console.log(`❌ ${name} - FALTA CREAR`);
        }
    });

    console.log('\n' + '='.repeat(70));
    console.log('RESUMEN');
    console.log('='.repeat(70));
    console.log(`\n📊 Subcategorías que ya existen: ${existing.length}`);
    console.log(`🆕 Subcategorías que hay que crear: ${missing.length}\n`);

    if (missing.length > 0) {
        console.log('📝 Subcategorías a crear:');
        missing.forEach((name, idx) => {
            console.log(`   ${idx + 1}. ${name}`);
        });
    }

    console.log('\n' + '='.repeat(70) + '\n');
}

checkSubcategories().catch(console.error);
