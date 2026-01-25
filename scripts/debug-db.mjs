// Debug script to check database data
// Run this with: node scripts/debug-db.mjs

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDatabase() {
    console.log('='.repeat(60));
    console.log('DATABASE DEBUG');
    console.log('='.repeat(60));

    // 1. Check subcategories
    console.log('\n1. SUBCATEGORIES:');
    const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');

    if (subError) {
        console.error('Error fetching subcategories:', subError);
    } else {
        console.table(subcategories);
    }

    // 2. Check if "CUNAS" subcategory exists
    console.log('\n2. SEARCHING FOR "CUNAS" SUBCATEGORY:');
    const { data: cunasSubcat, error: cunasError } = await supabase
        .from('subcategories')
        .select('*')
        .ilike('name', '%CUNAS%');

    if (cunasError) {
        console.error('Error:', cunasError);
    } else {
        console.log('Found:', cunasSubcat);
    }

    // 3. Get first subcategory and check products
    if (subcategories && subcategories.length > 0) {
        const firstSubcat = subcategories[0];
        console.log(`\n3. PRODUCTS IN "${firstSubcat.name}" (id: ${firstSubcat.id}):`);

        const { data: products, error: prodError } = await supabase
            .from('products')
            .select(`
                *,
                product_images (
                    image_url,
                    order
                )
            `)
            .eq('subcategory_id', firstSubcat.id)
            .eq('active', true);

        if (prodError) {
            console.error('Error:', prodError);
        } else {
            console.log(`Found ${products?.length || 0} products:`);
            products?.forEach(p => {
                console.log(`  - ${p.name} (${p.code || p.product_id})`);
                console.log(`    Images: ${p.product_images?.length || 0}`);
                if (p.product_images && p.product_images.length > 0) {
                    p.product_images.forEach((img, idx) => {
                        console.log(`      [${idx}] ${img.image_url}`);
                    });
                }
            });
        }
    }

    // 4. Check all products with subcategory_id
    console.log('\n4. ALL PRODUCTS WITH SUBCATEGORY_ID:');
    const { data: allProds, error: allProdsError } = await supabase
        .from('products')
        .select('name, code, subcategory_id')
        .not('subcategory_id', 'is', null)
        .limit(10);

    if (allProdsError) {
        console.error('Error:', allProdsError);
    } else {
        console.table(allProds);
    }

    console.log('\n' + '='.repeat(60));
}

debugDatabase().catch(console.error);
