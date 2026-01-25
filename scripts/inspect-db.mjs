import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrwwfvzgchjzjnapfrar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3dmdnpnY2hqempuYXBmcmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQ3MDYsImV4cCI6MjA4NDE2MDcwNn0.ZYNrWkx5SNl0l3ICsF6t3gTU36T3ZYH5fJji6Lp1lPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
    console.log('════════════════════════════════════════════════════════');
    console.log('INSPECTING SUPABASE DATABASE');
    console.log('════════════════════════════════════════════════════════\n');

    // 1. Check product_images table structure
    console.log('1️⃣  PRODUCT_IMAGES TABLE - Sample Records:');
    const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .limit(5);

    if (imagesError) {
        console.error('❌ Error:', imagesError);
    } else {
        console.log(`Found ${images?.length || 0} sample records:`);
        console.table(images);
    }

    // 2. Check products table - get one product with its images
    console.log('\n2️⃣  PRODUCTS WITH IMAGES (using JOIN):');
    const { data: productsWithImages, error: prodError } = await supabase
        .from('products')
        .select(`
            uid,
            name,
            code,
            image_url,
            product_images (
                uid,
                image_url
            )
        `)
        .limit(3);

    if (prodError) {
        console.error('❌ Error:', prodError);
    } else {
        console.log('Sample products with images:');
        productsWithImages?.forEach((p, idx) => {
            console.log(`\n  Product ${idx + 1}: ${p.name} (${p.code})`);
            console.log(`    product.image_url: ${p.image_url || 'NULL'}`);
            console.log(`    product_images count: ${p.product_images?.length || 0}`);
            if (p.product_images && p.product_images.length > 0) {
                p.product_images.forEach((img, i) => {
                    console.log(`      [${i}] ${img.image_url}`);
                });
            }
        });
    }

    // 3. Check a specific product by code
    console.log('\n3️⃣  CHECKING SPECIFIC PRODUCT (EKO310AZ):');
    const { data: ekoProduct, error: ekoError } = await supabase
        .from('products')
        .select(`
            *,
            product_images (
                uid,
                image_url
            )
        `)
        .ilike('code', '%EKO310AZ%')
        .single();

    if (ekoError) {
        console.error('❌ Error:', ekoError);
    } else if (ekoProduct) {
        console.log('✅ Found product:');
        console.log(`  Name: ${ekoProduct.name}`);
        console.log(`  Code: ${ekoProduct.code}`);
        console.log(`  UID: ${ekoProduct.uid}`);
        console.log(`  image_url field: ${ekoProduct.image_url || 'NULL'}`);
        console.log(`  product_images records: ${ekoProduct.product_images?.length || 0}`);
        if (ekoProduct.product_images && ekoProduct.product_images.length > 0) {
            console.log('  Images:');
            ekoProduct.product_images.forEach((img, i) => {
                console.log(`    [${i}] ${img.image_url}`);
            });
        } else {
            console.log('  ⚠️  NO IMAGES FOUND IN product_images TABLE');
        }
    } else {
        console.log('❌ Product not found');
    }

    // 4. Count total product_images
    console.log('\n4️⃣  STATISTICS:');
    const { count: imageCount } = await supabase
        .from('product_images')
        .select('*', { count: 'exact', head: true });

    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    console.log(`  Total products: ${productCount}`);
    console.log(`  Total product_images: ${imageCount}`);
    console.log(`  Average images per product: ${imageCount && productCount ? (imageCount / productCount).toFixed(2) : 'N/A'}`);

    console.log('\n════════════════════════════════════════════════════════');
}

inspectDatabase().catch(console.error);
