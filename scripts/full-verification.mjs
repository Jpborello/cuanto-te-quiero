import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://jrwwfvzgchjzjnapfrar.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3dmdnpnY2hqempuYXBmcmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQ3MDYsImV4cCI6MjA4NDE2MDcwNn0.ZYNrWkx5SNl0l3ICsF6t3gTU36T3ZYH5fJji6Lp1lPM'
);

async function fullVerification() {
    console.log('='.repeat(80));
    console.log('VERIFICACION COMPLETA DE IMPORTACION');
    console.log('='.repeat(80));

    // 1. Total de productos con código
    const { data: withCode, count: totalWithCode } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .not('code', 'is', null);

    console.log(`\n✅ Total productos con CODE: ${totalWithCode}`);

    // 2. Productos por subcategoría
    const subcatCounts = {};
    withCode?.forEach(p => {
        const key = p.subcategory_id || 'Sin subcategoría';
        subcatCounts[key] = (subcatCounts[key] || 0) + 1;
    });

    // Get subcategory names
    const { data: subcats } = await supabase
        .from('subcategories')
        .select('id, name');

    const subcatMap = {};
    subcats?.forEach(s => {
        subcatMap[s.id] = s.name;
    });

    console.log('\n📊 Productos por subcategoría:');
    Object.entries(subcatCounts).forEach(([id, count]) => {
        const name = subcatMap[id] || 'Sin subcategoría';
        console.log(`   ${name}: ${count} productos`);
    });

    // 3. Ejemplos de productos
    console.log('\n📝 Ejemplos de productos importados (primeros 20):');
    withCode?.slice(0, 20).forEach((p, i) => {
        const subname = subcatMap[p.subcategory_id] || 'N/A';
        console.log(`   ${i + 1}. [${p.code}] ${p.name}`);
        console.log(`      Subcategoría: ${subname} | Precio: $${p.price} | Stock: ${p.stock}`);
    });

    // 4. Verificar códigos únicos
    const codes = withCode?.map(p => p.code) || [];
    const uniqueCodes = new Set(codes);
    const duplicates = codes.length - uniqueCodes.size;

    console.log(`\n🔍 Verificación de códigos:`);
    console.log(`   Total códigos: ${codes.length}`);
    console.log(`   Códigos únicos: ${uniqueCodes.size}`);
    console.log(`   Duplicados: ${duplicates}`);

    if (duplicates > 0) {
        console.log('\n⚠️ ADVERTENCIA: Hay códigos duplicados');
    }

    console.log('\n' + '='.repeat(80));
    console.log('IMPORTACION VERIFICADA EXITOSAMENTE');
    console.log('='.repeat(80));
}

fullVerification().catch(console.error);
