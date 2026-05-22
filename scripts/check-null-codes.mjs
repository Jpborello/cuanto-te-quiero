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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCodes() {
    try {
        console.log("Checking products database for NULL or mismatched 'code' and 'product_id'...");
        const { data: products, error } = await supabase
            .from('products')
            .select('uid, name, product_id, code');
        
        if (error) throw error;

        console.log(`Total products: ${products.length}`);
        
        const nullCodes = products.filter(p => p.code === null || p.code === undefined);
        const mismatchedCodes = products.filter(p => p.code !== null && p.code !== undefined && String(p.code) !== String(p.product_id));

        console.log(`Products with NULL/missing 'code': ${nullCodes.length}`);
        nullCodes.slice(0, 10).forEach(p => {
            console.log(`  - [UID: ${p.uid}] Name: ${p.name} | product_id: ${p.product_id} | code: ${p.code}`);
        });
        if (nullCodes.length > 10) console.log(`  ... and ${nullCodes.length - 10} more`);

        console.log(`Products with mismatched 'code' and 'product_id': ${mismatchedCodes.length}`);
        mismatchedCodes.slice(0, 10).forEach(p => {
            console.log(`  - [UID: ${p.uid}] Name: ${p.name} | product_id: ${p.product_id} | code: ${p.code}`);
        });
        if (mismatchedCodes.length > 10) console.log(`  ... and ${mismatchedCodes.length - 10} more`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkCodes().catch(console.error);
