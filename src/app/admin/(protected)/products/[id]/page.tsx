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

    // Fetch product first to get its uid
    const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("product_id", id)
        .single();

    if (productError || !product) {
        return notFound();
    }

    // Now fetch images, categories, and subcategories in parallel using the product's uid
    const [
        { data: productImages },
        { data: categories },
        { data: subcategories }
    ] = await Promise.all([
        supabase.from("product_images").select("image_url").eq("product_id", product.uid),
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
    ]);

    // Merge product images into the product object for the form
    // Fallback: if product_images is empty but product has image_url, use that
    let imagesToShow = productImages || [];
    if (imagesToShow.length === 0 && product.image_url) {
        // Convert array of strings to product_images format
        if (Array.isArray(product.image_url)) {
            imagesToShow = product.image_url.map((url: string) => ({ image_url: url }));
        } else if (typeof product.image_url === 'string') {
            imagesToShow = [{ image_url: product.image_url }];
        }
    }

    const productWithImages = {
        ...product,
        product_images: imagesToShow
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="admin-page-title text-xl mb-0">Editar Producto</h1>
                    <p className="text-sm text-gray-500">#{product.product_id} - {product.name}</p>
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
