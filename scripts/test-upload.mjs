
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
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

async function testUpload() {
    console.log('Testing upload with ANON key...');

    // Create a dummy PNG (just text but with png extension for mime check)
    const testFile = join(__dirname, 'test-upload.png');
    writeFileSync(testFile, 'Fake PNG Content');

    const { data, error } = await supabase.storage
        .from('products')
        .upload('test.png', readFileSync(testFile), {
            contentType: 'image/png'
        });

    unlinkSync(testFile);

    if (error) {
        console.error('❌ Upload failed:', error);
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Upload successful:', data);

        // Clean up
        await supabase.storage.from('products').remove(['test.png']);
    }
}

testUpload();
