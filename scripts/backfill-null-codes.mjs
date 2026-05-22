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

async function backfillCodes() {
    try {
        console.log("Fetching products with NULL 'code'...");
        const { data: products, error } = await supabase
            .from('products')
            .select('uid, name, product_id, code')
            .is('code', null);
        
        if (error) throw error;

        console.log(`Found ${products.length} products with NULL 'code'.`);

        if (products.length === 0) {
            console.log("No backfill needed. All products have a code!");
            return;
        }

        console.log("Starting backfill...");
        let successCount = 0;
        let failCount = 0;

        for (const product of products) {
            // Fallback code is product_id (stripped of surrounding spaces)
            const fallbackCode = String(product.product_id || '').trim();
            if (!fallbackCode) {
                console.log(`⚠️ Skip [UID: ${product.uid}] Name: ${product.name} - 'product_id' is also empty!`);
                continue;
            }

            console.log(`Updating [UID: ${product.uid}] '${product.name}' -> Setting code to '${fallbackCode}'`);
            
            const { error: updateError } = await supabase
                .from('products')
                .update({ code: fallbackCode })
                .eq('uid', product.uid);

            if (updateError) {
                console.error(`❌ Failed to update [UID: ${product.uid}]:`, updateError.message);
                failCount++;
            } else {
                successCount++;
            }
        }

        console.log("\n=================================");
        console.log(`Backfill finished!`);
        console.log(`Successfully updated: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log("=================================");

    } catch (error) {
        console.error('Error during backfill:', error.message);
    }
}

backfillCodes().catch(console.error);
