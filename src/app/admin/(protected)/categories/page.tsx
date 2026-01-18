import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategories() {
    const supabase = await createClient();

    // Fetch categories and subcategories
    const [{ data: categories }, { data: subcategories }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="page-header-actions mb-6">
                <div>
                    <h1 className="admin-page-title">Categorías</h1>
                    <p className="admin-page-subtitle">Gestiona la estructura de tu catálogo</p>
                </div>
            </div>

            <CategoryManager
                initialCategories={categories || []}
                initialSubcategories={subcategories || []}
            />
        </div>
    );
}
