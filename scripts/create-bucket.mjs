
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
            // IMPORTANT: Use Service Role Key for Admin actions like creating buckets
            if (trimmedKey === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = trimmedValue;
        }
    });
} catch (e) {
    console.error('Error reading .env.local', e);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials (Service Role Key needed)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
    console.log('Creating "products" bucket...');
    const { data, error } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
        console.error('Error creating bucket:', error);
    } else {
        console.log('✅ Bucket "products" created successfully!');
        console.log(data);
    }
}

createBucket();
