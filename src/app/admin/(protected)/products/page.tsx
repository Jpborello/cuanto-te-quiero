import { createClient } from "@/lib/supabase/server";
import ProductListClient from "@/components/admin/ProductListClient";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            categories (name),
            subcategories (name)
        `)
        .order("name", { ascending: true });

    return (
        <div>
            {error && (
                <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "#ef4444", padding: "1rem", margin: 0 }}>
                        Error al cargar productos: {error.message}
                    </p>
                </div>
            )}

            <ProductListClient products={products || []} />
        </div>
    );
}

