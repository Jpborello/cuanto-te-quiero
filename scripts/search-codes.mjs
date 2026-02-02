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

async function searchSpecificProducts() {
    try {
        const specificCodes = [
            '8087BB',
            '8087BA',
            '8087BR',
            'N25',
            'N27',
            'N28',
            'N29',
            'N35',
            'N36',
            'N37'
        ];

        console.log('Searching for specific products...\n');

        for (const code of specificCodes) {
            const { data, error } = await supabase
                .from('products')
                .select('code, name')
                .eq('code', code);

            if (error) {
                console.log(`ERROR searching ${code}: ${error.message}`);
            } else if (data && data.length > 0) {
                console.log(`✅ FOUND: ${code} - ${data[0].name}`);
            } else {
                console.log(`❌ NOT FOUND: ${code}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

searchSpecificProducts().catch(console.error);
