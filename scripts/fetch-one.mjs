import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from project root
const projectRoot = join(__dirname, '..');
const envPath = join(projectRoot, '.env.local');
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

async function testFetch() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('uid, name, code, image_url')
            .eq('active', true)
            .limit(1);
        if (error) throw error;
        console.log("FETCHED PRODUCT:", JSON.stringify(data[0], null, 2));
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

testFetch();
