
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCategories() {
    const { data, error } = await supabase
        .from('products')
        .select('category, subcategory');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const subcategories = [...new Set(data.map(p => `${p.category} -> ${p.subcategory}`))];
    console.log('Unique Subcategories:', subcategories);
}

listCategories();
