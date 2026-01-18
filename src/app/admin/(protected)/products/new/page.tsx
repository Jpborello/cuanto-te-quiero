import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
    const supabase = await createClient();

    // Fetch categories and subcategories in parallel
    const [{ data: categories }, { data: subcategories }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="admin-page-title text-xl mb-0">Nuevo Producto</h1>
                    <p className="text-sm text-gray-500">Agrega un nuevo ítem al catálogo</p>
                </div>
            </div>

            <ProductForm
                categories={categories || []}
                subcategories={subcategories || []}
            />
        </div>
    );
}
