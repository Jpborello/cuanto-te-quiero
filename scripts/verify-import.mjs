import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://jrwwfvzgchjzjnapfrar.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3dmdnpnY2hqempuYXBmcmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQ3MDYsImV4cCI6MjA4NDE2MDcwNn0.ZYNrWkx5SNl0l3ICsF6t3gTU36T3ZYH5fJji6Lp1lPM'
);

async function verifyImport() {
    console.log('Verificando productos importados...\n');

    // Total con código
    const { data: withCode, count } = await supabase
        .from('products')
        .select('code, name', { count: 'exact' })
        .not('code', 'is', null);

    console.log(`Total productos con CODE: ${count}\n`);

    // Primeros 15 productos
    console.log('Primeros 15 productos:');
    withCode?.slice(0, 15).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.code} - ${p.name}`);
    });

    // Agrupar por subcategoría
    console.log('\n\nProductos por subcategoría:');
    const { data: bySub } = await supabase
        .from('products')
        .select('subcategory_id, subcategories(name)')
        .not('code', 'is', null);

    const grouped = {};
    bySub?.forEach(p => {
        const subname = p.subcategories?.name || 'Sin subcategoría';
        grouped[subname] = (grouped[subname] || 0) + 1;
    });

    Object.entries(grouped).forEach(([name, count]) => {
        console.log(`  ${name}: ${count} productos`);
    });
}

verifyImport().catch(console.error);
