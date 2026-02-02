import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleCheck() {
    try {
        // Get first 5 active products
        const { data, error } = await supabase
            .from('products')
            .select('product_id, code, name, image_url, price, stock')
            .eq('active', true)
            .order('product_id')
            .limit(5);

        if (error) throw error;

        const result = {
            totalChecked: data?.length || 0,
            products: data?.map(p => ({
                id: p.product_id,
                code: p.code,
                name: p.name,
                hasImage: !!p.image_url,
                imageUrl: p.image_url,
                price: p.price,
                stock: p.stock
            }))
        };

        writeFileSync(
            join(__dirname, '..', 'product-images-check.json'),
            JSON.stringify(result, null, 2)
        );

        console.log('Result saved to product-images-check.json');
        console.log(`Checked ${result.totalChecked} products`);
        console.log(`With images: ${result.products?.filter(p => p.hasImage).length || 0}`);
        console.log(`Without images: ${result.products?.filter(p => !p.hasImage).length || 0}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

simpleCheck().catch(console.error);
