
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

async function findCunas() {
    console.log('Finding products with "CUNA" in name...');

    const { data: products } = await supabase
        .from('products')
        .select('name, subcategory_id')
        .ilike('name', '%CUNA%');

    if (!products || products.length === 0) {
        console.log('No cunas found.');
        return;
    }

    // Get all subcat names
    const { data: subcats } = await supabase.from('subcategories').select('id, name');
    const subcatMap = {};
    subcats.forEach(s => subcatMap[s.id] = s.name);

    // Group
    const groups = {};
    products.forEach(p => {
        const sName = subcatMap[p.subcategory_id] || 'Unknown';
        if (!groups[sName]) groups[sName] = 0;
        groups[sName]++;
    });

    console.log('Cunas distribution:', groups);
}

findCunas();
