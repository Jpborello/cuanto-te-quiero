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

async function finalVerification() {
    try {
        // Specific codes user mentioned
        const testCodes = ['8087BB', '8087BA', '8087BR', 'N25', 'N27', 'N28', 'N29', 'N35', 'N36', 'N37'];

        const results = {
            totalProducts: 0,
            testedCodes: {},
            summary: []
        };

        // Get total count
        const { data: allProducts } = await supabase
            .from('products')
            .select('code')
            .order('code');

        results.totalProducts = allProducts?.length || 0;

        // Check each code
        for (const code of testCodes) {
            const { data } = await supabase
                .from('products')
                .select('code, name')
                .eq('code', code)
                .single();

            results.testedCodes[code] = data ? {
                found: true,
                name: data.name
            } : {
                found: false
            };

            results.summary.push({
                code,
                found: !!data,
                name: data?.name || 'NOT FOUND'
            });
        }

        // Save to JSON
        writeFileSync(
            join(__dirname, '..', 'final-verification.json'),
            JSON.stringify(results, null, 2)
        );

        console.log(JSON.stringify(results, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

finalVerification().catch(console.error);
