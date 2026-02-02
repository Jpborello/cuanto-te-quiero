
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";

// Group products by subcategory
function groupBySubcategory(products: any[]) {
    const grouped = new Map<string, any[]>();

    products.forEach(product => {
        const subcategoryName = product.subcategories?.name || 'Sin Subcategoría';
        if (!grouped.has(subcategoryName)) {
            grouped.set(subcategoryName, []);
        }
        grouped.get(subcategoryName)!.push(product);
    });

    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminProducts() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            categories (name),
            subcategories (name)
        `)
        .order("subcategories(name)", { ascending: true })
        .order("name", { ascending: true });

    const groupedProducts = products ? groupBySubcategory(products) : [];

    return (
        <div>
            <div className="page-header-actions">
                <div>
                    <h1 className="admin-page-title">Productos</h1>
                    <p className="admin-page-subtitle">
                        {products?.length || 0} productos en {groupedProducts.length} subcategorías
                    </p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus size={18} />
                    Nuevo Producto
                </Link>
            </div>

            {error && (
                <div className="admin-card">
                    <p style={{ color: '#ef4444', padding: '1rem' }}>Error: {error.message}</p>
                </div>
            )}

            {!products || products.length === 0 ? (
                <div className="admin-card">
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                        <p>No hay productos cargados.</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {groupedProducts.map(([subcategoryName, subcategoryProducts]) => (
                        <div key={subcategoryName} className="admin-card">
                            {/* Subcategory Header */}
                            <div className="subcategory-header">
                                <h2 className="subcategory-title">
                                    {subcategoryName}
                                </h2>
                                <p className="subcategory-subtitle">
                                    {subcategoryProducts[0].categories?.name || 'Sin categoría'} • {subcategoryProducts.length} productos
                                </p>
                            </div>

                            {/* Products Grid */}
                            <div className="products-grid">
                                {subcategoryProducts.map((product) => (
                                    <div
                                        key={product.uid}
                                        className={`product-card ${!product.active ? 'inactive' : ''}`}
                                    >
                                        {/* Product Name */}
                                        <h3 className="product-card-name">
                                            {product.name}
                                        </h3>

                                        {/* Code */}
                                        <p className="product-card-code">
                                            {product.code || '---'}
                                        </p>

                                        {/* Price & Stock */}
                                        <div className="product-card-stats">
                                            <span className="product-card-price">
                                                ${product.price?.toFixed(2)}
                                            </span>
                                            <span className={`product-card-stock ${product.stock < 5 ? 'low' : 'ok'}`}>
                                                {product.stock}
                                            </span>
                                        </div>

                                        {/* Badges */}
                                        <div className="product-card-badges">
                                            {product.featured && (
                                                <span className="product-card-featured" title="Destacado">⭐</span>
                                            )}
                                            <span className={`product-card-status ${product.active ? 'active' : 'inactive'}`}>
                                                {product.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="product-card-actions">
                                            <ProductActions product={product} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
