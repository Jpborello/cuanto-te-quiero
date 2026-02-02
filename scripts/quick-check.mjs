import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://jrwwfvzgchjzjnapfrar.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3dmdnpnY2hqempuYXBmcmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQ3MDYsImV4cCI6MjA4NDE2MDcwNn0.ZYNrWkx5SNl0l3ICsF6t3gTU36T3ZYH5fJji6Lp1lPM'
);

async function quickCheck() {
    const { data, count } = await supabase
        .from('products')
        .select('code, name, subcategory_id', { count: 'exact' })
        .not('code', 'is', null);

    console.log(`Total productos con CODE: ${count}`);
    console.log(`\nÚltimos 10 productos:`);
    data?.slice(-10).forEach(p => {
        console.log(`  ${p.code}: ${p.name}`);
    });
}

quickCheck();
