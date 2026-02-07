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

async function checkSchema() {
    try {
        console.log('\n=== PRODUCTS TABLE ===');
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (prodError) throw prodError;

        if (products && products.length > 0) {
            console.log('Columnas:', Object.keys(products[0]).join(', '));
        }

        console.log('\n=== PRODUCT_IMAGES TABLE ===');
        const { data: images, error: imgError } = await supabase
            .from('product_images')
            .select('*')
            .limit(1);

        if (imgError) {
            console.log('Error:', imgError.message);
        } else if (images && images.length > 0) {
            console.log('Columnas:', Object.keys(images[0]).join(', '));
        } else {
            console.log('Tabla existe pero está vacía');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSchema();
