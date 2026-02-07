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

async function checkImages() {
    try {
        console.log('\n=== CHECKING PRODUCT IMAGES ===\n');

        // Get a product with images
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('uid, product_id, name, image_url')
            .not('image_url', 'is', null)
            .limit(3);

        if (prodError) throw prodError;

        if (products && products.length > 0) {
            console.log('Products with image_url:');
            products.forEach(p => {
                console.log(`\n  Product ID: ${p.product_id}`);
                console.log(`  Name: ${p.name}`);
                console.log(`  UID: ${p.uid}`);
                console.log(`  Image URL: ${p.image_url}`);
            });

            // Check product_images for the first product
            console.log('\n=== CHECKING PRODUCT_IMAGES TABLE ===\n');
            const { data: images, error: imgError } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', products[0].uid);

            if (imgError) {
                console.log('Error:', imgError.message);
            } else if (images && images.length > 0) {
                console.log(`Found ${images.length} images for product ${products[0].product_id}:`);
                images.forEach((img, i) => {
                    console.log(`  ${i + 1}. ${img.image_url}`);
                });
            } else {
                console.log('No images found in product_images table for this product');
                console.log('Images are likely stored in products.image_url column instead');
            }
        } else {
            console.log('No products with image_url found');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkImages();
