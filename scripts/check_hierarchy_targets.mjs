
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

async function checkSpecifics() {
    const terms = ['ROPERO', 'CAJONERA', 'CUNA'];

    console.log('--- Categories ---');
    const { data: cats } = await supabase.from('categories').select('id, name');
    const relevantCats = cats.filter(c => terms.some(t => c.name.toUpperCase().includes(t)));
    console.log('Matching Categories:', relevantCats.map(c => c.name));

    console.log('\n--- Subcategories ---');
    const { data: subcats } = await supabase.from('subcategories').select('id, name, category_id');
    const relevantSubcats = subcats.filter(s => terms.some(t => s.name.toUpperCase().includes(t)));

    // Map back to parent name
    const catMap = {};
    cats.forEach(c => catMap[c.id] = c.name);

    relevantSubcats.forEach(s => {
        console.log(`- ${s.name} (Parent: ${catMap[s.category_id]}) -> ID: ${s.id}`);
    });
}

checkSpecifics();
