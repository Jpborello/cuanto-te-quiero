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

async function testFetchSettings() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');
        if (error) {
            console.log("SETTINGS ERROR:", error.message);
        } else {
            console.log("SETTINGS DATA:", data);
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

testFetchSettings();
