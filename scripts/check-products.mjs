import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrwwfvzgchjzjnapfrar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3dmdnpnY2hqempuYXBmcmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQ3MDYsImV4cCI6MjA4NDE2MDcwNn0.ZYNrWkx5SNl0l3ICsF6t3gTU36T3ZYH5fJji6Lp1lPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductImages() {
    console.log('════════════════════════════════════════════════════════');
    console.log('CHECKING PRODUCTS TABLE FOR IMAGES');
    console.log('════════════════════════════════════════════════════════\n');

    // Get products and check image_url field
    console.log('1️⃣  Sample products with image_url field:');
    const { data: products, error } = await supabase
        .from('products')
        .select('uid, name, code, image_url')
        .limit(10);

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    let withImages = 0;
    let withoutImages = 0;

    products?.forEach((p, idx) => {
        console.log(`\n${idx + 1}. ${p.name || 'Unnamed'} (${p.code || 'No code'})`);
        console.log(`   image_url: ${p.image_url || '❌ NULL'}`);

        if (p.image_url) {
            withImages++;
            // Check if it's an array or string
            if (typeof p.image_url === 'string') {
                console.log(`   Type: STRING`);
                // Try to parse as JSON
                try {
                    const parsed = JSON.parse(p.image_url);
                    console.log(`   Parsed as JSON array: ${Array.isArray(parsed) ? 'YES' : 'NO'}`);
                    if (Array.isArray(parsed)) {
                        console.log(`   Array length: ${parsed.length}`);
                        parsed.forEach((url, i) => console.log(`     [${i}] ${url}`));
                    }
                } catch {
                    console.log(`   Not JSON - direct URL`);
                }
            } else if (Array.isArray(p.image_url)) {
                console.log(`   Type: ARRAY (length: ${p.image_url.length})`);
                p.image_url.forEach((url, i) => console.log(`     [${i}] ${url}`));
            }
        } else {
            withoutImages++;
        }
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Products with images: ${withImages}`);
    console.log(`   Products without images: ${withoutImages}`);

    // Check specific EKO products
    console.log('\n2️⃣  Checking EKO310 products (CUNAS):');
    const { data: ekoProducts } = await supabase
        .from('products')
        .select('name, code, image_url')
        .ilike('code', '%EKO310%');

    console.log(`Found ${ekoProducts?.length || 0} EKO310 products:`);
    ekoProducts?.forEach(p => {
        console.log(`  - ${p.code}: ${p.image_url ? '✅ HAS IMAGE' : '❌ NO IMAGE'}`);
    });

    console.log('\n════════════════════════════════════════════════════════');
}

checkProductImages().catch(console.error);
