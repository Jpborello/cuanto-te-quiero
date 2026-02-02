import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('='.repeat(70));
    console.log('DATABASE SCHEMA CHECK');
    console.log('='.repeat(70));

    // 1. Check categories structure
    console.log('\n1. CATEGORIES:');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .limit(3);

    if (catError) {
        console.error('Error:', catError);
    } else {
        console.table(categories);
        if (categories && categories.length > 0) {
            console.log('Columns:', Object.keys(categories[0]));
        }
    }

    // 2. Check subcategories structure
    console.log('\n2. SUBCATEGORIES:');
    const { data: subcategories, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .limit(5);

    if (subError) {
        console.error('Error:', subError);
    } else {
        console.table(subcategories);
        if (subcategories && subcategories.length > 0) {
            console.log('Columns:', Object.keys(subcategories[0]));
        }
    }

    // 3. Check products structure
    console.log('\n3. PRODUCTS:');
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('*')
        .limit(2);

    if (prodError) {
        console.error('Error:', prodError);
    } else {
        console.table(products);
        if (products && products.length > 0) {
            console.log('Columns:', Object.keys(products[0]));
            console.log('\nSample product:');
            console.log(JSON.stringify(products[0], null, 2));
        }
    }

    // 4. Check product_images structure
    console.log('\n4. PRODUCT_IMAGES:');
    const { data: images, error: imgError } = await supabase
        .from('product_images')
        .select('*')
        .limit(3);

    if (imgError) {
        console.error('Error:', imgError);
    } else {
        console.table(images);
        if (images && images.length > 0) {
            console.log('Columns:', Object.keys(images[0]));
        }
    }

    console.log('\n' + '='.repeat(70));
}

checkSchema().catch(console.error);
