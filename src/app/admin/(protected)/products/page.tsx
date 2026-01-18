
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Image as ImageIcon } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";

export default async function AdminProducts() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            categories (name),
            subcategories (name)
        `)
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="page-header-actions">
                <div>
                    <h1 className="admin-page-title">Productos</h1>
                    <p className="admin-page-subtitle">Administra tu catálogo</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus size={18} />
                    Nuevo Producto
                </Link>
            </div>

            <div className="admin-card">
                {error && <p className="text-red-500 p-4">Error: {error.message}</p>}

                {!products || products.length === 0 ? (
                    <div className="text-center p-12 text-gray-400">
                        <p>No hay productos cargados.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className={!product.active ? "opacity-60 bg-gray-50" : ""}>
                                        <td>
                                            <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={16} className="text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-medium">{product.name}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-700">
                                                    {product.categories?.name || '---'}
                                                </span>
                                                {product.subcategories && (
                                                    <span className="text-gray-500 text-xs block">
                                                        {product.subcategories.name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-mono">
                                            ${product.price?.toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            {product.active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <ProductActions product={product} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
