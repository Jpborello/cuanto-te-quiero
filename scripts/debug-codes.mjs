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

async function debugCodes() {
    try {
        // Search for products with codes containing "8087" or starting with "N2" or "N3"
        const { data: all } = await supabase
            .from('products')
            .select('code, name')
            .order('code');

        console.log(`Total products: ${all?.length || 0}\n`);

        // Filter products
        const p8087 = all?.filter(p => p.code.includes('8087')) || [];
        const pN2 = all?.filter(p => p.code.startsWith('N2') || p.code.startsWith('N3')) || [];

        console.log(`Products containing "8087": ${p8087.length}`);
        p8087.forEach(p => console.log(`  ${p.code} - ${p.name}`));

        console.log(`\nProducts starting with "N2" or "N3": ${pN2.length}`);
        pN2.forEach(p => console.log(`  ${p.code} - ${p.name}`));

        // Look for specific codes  (maybe they have spaces?)
        console.log('\n\nSearching with variations:\n');
        const testVars = [
            '8087BB', '8087 BB', 'N25', 'N 25', ' N25', 'N25 ',
            'N27', 'N28', 'N29', 'N35', 'N36', 'N37'
        ];

        for (const code of testVars) {
            const found = all?.find(p => p.code === code);
            if (found) {
                console.log(`✅ Found: "${code}" -> ${found.name}`);
            }
        }

        // Show all codes that contain "N2" or "N3" or "8087" (case insensitive)
        console.log('\n\nAll codes containing N2, N3, or 8087:');
        const relevant = all?.filter(p =>
            p.code.toLowerCase().includes('n2') ||
            p.code.toLowerCase().includes('n3') ||
            p.code.includes('8087')
        ) || [];

        relevant.forEach(p => console.log(`  "${p.code}" - ${p.name}`));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugCodes().catch(console.error);
