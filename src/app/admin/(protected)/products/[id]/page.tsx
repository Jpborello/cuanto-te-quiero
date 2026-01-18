import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    // Await params to get the ID
    const { id } = await params;

    const supabase = await createClient();

    // Fetch product, images, categories, and subcategories in parallel
    const [
        { data: product, error: productError },
        { data: productImages },
        { data: categories },
        { data: subcategories }
    ] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("product_images").select("image_url").eq("product_id", id),
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
    ]);

    if (productError || !product) {
        return notFound();
    }

    // Merge product images into the product object for the form
    const productWithImages = {
        ...product,
        product_images: productImages || []
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="admin-page-title text-xl mb-0">Editar Producto</h1>
                    <p className="text-sm text-gray-500">#{product.id} - {product.name}</p>
                </div>
            </div>

            <ProductForm
                initialData={productWithImages}
                categories={categories || []}
                subcategories={subcategories || []}
            />
        </div>
    );
}
