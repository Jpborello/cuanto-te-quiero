
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local manually
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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCategories() {
    console.log('Fetching unique subcategories...');

    const { data, error } = await supabase
        .from('products')
        .select('subcategory');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const subcategories = [...new Set(data.map(p => p.subcategory).filter(Boolean))];
    console.log('Unique Subcategories:', subcategories.sort());
}

listCategories();
