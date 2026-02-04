
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl, supabaseKey;

try {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = trimmedValue;
            if (trimmedKey === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = trimmedValue;
        }
    });
} catch (e) {
    console.error('Error reading .env.local', e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHierarchy() {
    console.log('Checking Categories...');
    const { data: cats, error: errCat } = await supabase.from('categories').select('id, name');
    if (errCat) console.error('Error cats:', errCat);
    else console.log('Categories:', cats.map(c => c.name));

    console.log('\nChecking Subcategories...');
    const { data: subcats, error: errSub } = await supabase.from('subcategories').select('id, name, category_id');
    if (errSub) console.error('Error subcats:', errSub);
    else {
        // Create map of cat id to name
        const catMap = {};
        if (cats) cats.forEach(c => catMap[c.id] = c.name);

        console.log('Subcategories:');
        subcats.forEach(s => {
            console.log(`- ${s.name} (Parent: ${catMap[s.category_id] || s.category_id})`);
        });
    }
}

checkHierarchy();
