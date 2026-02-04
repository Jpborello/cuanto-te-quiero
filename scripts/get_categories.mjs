
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

async function listCategories() {
    console.log('Fetching unique categories...');

    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
    console.log('Unique Categories:', categories.sort());
}

listCategories();
