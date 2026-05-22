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
            if (trimmedKey === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = trimmedValue;
        }
    });
} catch (e) {
    console.error('Error reading .env.local', e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- Database Verification Script using Service Role ---');
    
    // 0. Fetch a valid category
    console.log('Fetching an existing category to use for test subcategory...');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .limit(1);
        
    if (catError || !categories || categories.length === 0) {
        console.error('❌ Failed to fetch a valid category for the test:', catError || 'No categories found');
        return;
    }
    const testCategory = categories[0];
    console.log(`✅ Using category "${testCategory.name}" (ID: ${testCategory.id}) for verification test.`);

    // 1. Create subcategory
    console.log(`\n1. Creating a test subcategory under category: ${testCategory.name} (ID: ${testCategory.id})...`);
    const { data: newSub, error: createErr } = await supabase
        .from('subcategories')
        .insert({
            name: 'TEST_MUTATION_SUB',
            category_id: testCategory.id,
            active: true
        })
        .select()
        .single();
    
    if (createErr) {
        console.error('❌ Failed to create subcategory:', createErr);
        return;
    }
    console.log('✅ Subcategory created successfully:', newSub);

    // 2. Update name
    console.log('\n2. Updating the name of the test subcategory...');
    const { data: updatedSubName, error: updateNameErr } = await supabase
        .from('subcategories')
        .update({ name: 'TEST_MUTATION_SUB_CHANGED' })
        .eq('id', newSub.id)
        .select()
        .single();
    
    if (updateNameErr) {
        console.error('❌ Failed to update subcategory name:', updateNameErr);
    } else {
        console.log('✅ Subcategory name updated successfully:', updatedSubName);
    }

    // 3. Update status (active = false)
    console.log('\n3. Toggling active status to false...');
    const { data: updatedSubStatus, error: updateStatusErr } = await supabase
        .from('subcategories')
        .update({ active: false })
        .eq('id', newSub.id)
        .select()
        .single();
    
    if (updateStatusErr) {
        console.error('❌ Failed to update active status:', updateStatusErr);
    } else {
        console.log('✅ Active status updated successfully:', updatedSubStatus);
    }

    // 4. Delete the test subcategory
    console.log('\n4. Deleting the test subcategory...');
    const { data: deletedSub, error: deleteErr } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', newSub.id)
        .select();

    if (deleteErr) {
        console.error('❌ Failed to delete subcategory:', deleteErr);
    } else {
        console.log('✅ Subcategory deleted successfully, cleanup complete.');
    }
    
    console.log('\n--- Verification completed successfully! ---');
}

verify();
