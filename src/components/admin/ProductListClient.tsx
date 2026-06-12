"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Plus } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | string[] | null;
    active: boolean;
    featured: boolean;
    categories?: { name: string };
    subcategories?: { name: string; id: string };
}

interface ProductListClientProps {
    products: Product[];
}

export default function ProductListClient({ products }: ProductListClientProps) {
    const [searchText, setSearchText] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");

    // Extract unique subcategories from products list
    const subcategories = useMemo(() => {
        const set = new Set<string>();
        products.forEach((product) => {
            const subcatName = product.subcategories?.name || "Sin Subcategoría";
            set.add(subcatName);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [products]);

    // Filter products list based on search term and selected subcategory
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                searchText.trim() === "" ||
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                (product.code && product.code.toLowerCase().includes(searchText.toLowerCase()));

            const subcatName = product.subcategories?.name || "Sin Subcategoría";
            const matchesSubcategory =
                selectedSubcategory === "all" || subcatName === selectedSubcategory;

            return matchesSearch && matchesSubcategory;
        });
    }, [products, searchText, selectedSubcategory]);

    // Group filtered products by subcategory
    const groupedProducts = useMemo(() => {
        const grouped = new Map<string, Product[]>();

        filteredProducts.forEach((product) => {
            const subcategoryName = product.subcategories?.name || "Sin Subcategoría";
            if (!grouped.has(subcategoryName)) {
                grouped.set(subcategoryName, []);
            }
            grouped.get(subcategoryName)!.push(product);
        });

        return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [filteredProducts]);

    return (
        <div>
            {/* Header & New Button */}
            <div className="page-header-actions">
                <div>
                    <h1 className="admin-page-title">Productos</h1>
                    <p className="admin-page-subtitle">
                        {filteredProducts.length === products.length
                            ? `${products.length} productos en total`
                            : `Filtrados ${filteredProducts.length} de ${products.length} productos`}
                    </p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus size={18} />
                    Nuevo Producto
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="admin-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", flex: 1, minWidth: "280px", gap: "0.75rem", flexWrap: "wrap" }}>
                        {/* Search Bar Input */}
                        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Buscar por nombre o código..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ paddingLeft: "2.5rem" }}
                            />
                            <Search size={18} style={{
                                position: "absolute",
                                left: "0.85rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#94a3b8"
                            }} />
                            {searchText && (
                                <button
                                    onClick={() => setSearchText("")}
                                    style={{
                                        position: "absolute",
                                        right: "0.85rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#94a3b8",
                                        padding: 0
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Subcategory Select Dropdown */}
                        <div style={{ minWidth: "220px", display: "flex", alignItems: "center" }}>
                            <select
                                className="form-select"
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                            >
                                <option value="all">Todas las subcategorías</option>
                                {subcategories.map((subcat) => (
                                    <option key={subcat} value={subcat}>
                                        {subcat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchText !== "" || selectedSubcategory !== "all") && (
                        <button
                            onClick={() => {
                                setSearchText("");
                                setSelectedSubcategory("all");
                            }}
                            className="btn-primary"
                            style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                border: "1px solid #cbd5e1",
                                padding: "0.6rem 1.2rem",
                                fontSize: "0.875rem",
                                boxShadow: "none"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#e2e8f0";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f5f9";
                            }}
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
                <div className="admin-card">
                    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#9ca3af" }}>
                        <p style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                            No se encontraron productos
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                            Intentá ajustando los términos de búsqueda o el filtro de subcategorías.
                        </p>
                        <button
                            onClick={() => {
                                setSearchText("");
                                setSelectedSubcategory("all");
                            }}
                            className="btn-primary"
                            style={{ marginTop: "1.5rem" }}
                        >
                            Ver todos los productos
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {groupedProducts.map(([subcategoryName, subcategoryProducts]) => (
                        <div key={subcategoryName} className="admin-card">
                            {/* Subcategory Header */}
                            <div className="subcategory-header">
                                <h2 className="subcategory-title">
                                    {subcategoryName}
                                </h2>
                                <p className="subcategory-subtitle">
                                    {subcategoryProducts[0].categories?.name || "Sin categoría"} • {subcategoryProducts.length} productos
                                </p>
                            </div>

                            {/* Products Grid */}
                            <div className="products-grid">
                                {subcategoryProducts.map((product) => (
                                    <div
                                        key={product.uid}
                                        className={`product-card ${!product.active ? "inactive" : ""}`}
                                    >
                                        {/* Product Name */}
                                        <h3 className="product-card-name" title={product.name}>
                                            {product.name}
                                        </h3>

                                        {/* Code */}
                                        <p className="product-card-code">
                                            {product.code || "---"}
                                        </p>

                                        {/* Price & Stock */}
                                        <div className="product-card-stats">
                                            <span className="product-card-price">
                                                ${product.price?.toFixed(2)}
                                            </span>
                                            <span className={`product-card-stock ${product.stock < 5 ? "low" : "ok"}`}>
                                                {product.stock}
                                            </span>
                                        </div>

                                        {/* Badges */}
                                        <div className="product-card-badges">
                                            {!product.image_url && (
                                                <span
                                                    className="product-card-featured"
                                                    title="Sin imagen"
                                                    style={{
                                                        background: "#fee2e2",
                                                        color: "#dc2626",
                                                        fontSize: "0.65rem",
                                                        padding: "0.2rem 0.5rem",
                                                        borderRadius: "6px"
                                                    }}
                                                >
                                                    📷 Sin foto
                                                </span>
                                            )}
                                            {product.featured && (
                                                <span className="product-card-featured" title="Destacado">⭐</span>
                                            )}
                                            <span className={`product-card-status ${product.active ? "active" : "inactive"}`}>
                                                {product.active ? "Activo" : "Inactivo"}
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
