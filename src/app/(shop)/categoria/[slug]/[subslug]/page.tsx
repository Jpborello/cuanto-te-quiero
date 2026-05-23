"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { ShoppingCart, Search, X } from "lucide-react";
import Link from "next/link";
import AutoRotatingImage from "@/components/shop/AutoRotatingImage";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
    images: string[];
    active: boolean;
}

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
}

export default function SubcategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const subslug = params.subslug as string;

    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetchSubcategoryAndProducts();
    }, [subslug]);

    const fetchSubcategoryAndProducts = async () => {
        try {
            console.log('[DEBUG] Starting fetchSubcategoryAndProducts');
            console.log('[DEBUG] slug:', slug);
            console.log('[DEBUG] subslug:', subslug);

            // 1. Helper to aggressively normalize any string for robust comparison
            const normalizeString = (str: string) => {
                if (!str) return '';
                // First decode URI component in case it's encoded
                try { str = decodeURIComponent(str); } catch (e) {}
                
                return str.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                    .replace(/ñ/g, 'n') // handle ñ
                    .replace(/[^a-z0-9]/g, ''); // remove all non-alphanumeric (spaces, hyphens, etc)
            };

            // 2. Fetch Category first
            const { data: allCategories, error: catError } = await supabase
                .from("categories")
                .select("*");

            if (catError) throw catError;

            // Find matching category by normalizing both sides
            const normalizedSlug = normalizeString(slug);
            const categoryData = allCategories.find(c => normalizeString(c.name) === normalizedSlug);

            if (!categoryData) {
                console.error("Category not found for slug:", slug, "Normalized:", normalizedSlug);
                throw new Error("Category not found");
            }

            // 3. Fetch all subcategories for this category
            const { data: allSubcats, error: subError } = await supabase
                .from("subcategories")
                .select("*")
                .eq("category_id", categoryData.id);

            if (subError) throw subError;

            // 4. Find matching subcategory by robust normalization
            const normalizedSubslug = normalizeString(subslug);
            const subcategoryData = allSubcats.find(s => normalizeString(s.name) === normalizedSubslug);

            if (!subcategoryData) {
                console.error("Subcategory not found for subslug:", subslug, "Normalized:", normalizedSubslug);
                console.error("Available subcategories:", allSubcats.map(s => s.name));
                // Fallback: try direct name match if slug fails (legacy behavior expectation?)
                throw new Error("Subcategory not found");
            }

            console.log('[DEBUG] Found subcategory:', subcategoryData);
            setSubcategory(subcategoryData);

            console.log('[DEBUG] Found subcategory:', subcategoryData);

            // Buscar productos de esta subcategoría CON sus imágenes
            const { data: productsData, error: productsError } = await supabase
                .from("products")
                .select(`
                    *,
                    product_images (
                        image_url
                    )
                `)
                .eq("subcategory_id", subcategoryData.id)
                .eq("active", true)
                .order("sort_order", { ascending: true, nullsFirst: false })
                .order("code", { ascending: true });

            console.log('[DEBUG] Products query result:', { productsData, productsError });

            if (productsError) throw productsError;

            // Transform product_images array into image_url array
            const transformedProducts = (productsData || []).map(product => {
                let images = [];

                // Priority 1: Check image_url field first (this is where images actually are)
                if (product.image_url) {
                    // Check if it's already an array or needs to be wrapped
                    if (Array.isArray(product.image_url)) {
                        images = product.image_url;
                    } else if (typeof product.image_url === 'string') {
                        // Try to parse as JSON array, or use as single URL
                        try {
                            const parsed = JSON.parse(product.image_url);
                            images = Array.isArray(parsed) ? parsed : [product.image_url];
                        } catch {
                            images = [product.image_url];
                        }
                    }
                }

                // Priority 2: Fallback to product_images table (currently empty)
                if (images.length === 0 && product.product_images && product.product_images.length > 0) {
                    images = product.product_images.map((img: any) => img.image_url);
                }

                return {
                    ...product,
                    images
                };
            });

            console.log('[DEBUG] Transformed products:', transformedProducts);

            setProducts(transformedProducts);
        } catch (error) {
            console.error("[ERROR] Error fetching subcategory:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <p>Cargando...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!subcategory) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
                            Subcategoría no encontrada
                        </h1>
                        <p style={{ color: '#666' }}>
                            La subcategoría que buscas no existe.
                        </p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const filteredProducts = filterText.trim().length >= 1
        ? products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
        : products;

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header de subcategoría */}
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {subcategory.name}
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.125rem' }}>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
                        </p>
                    </div>

                    {/* Barra de filtro */}
                    {products.length > 4 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
                                <input
                                    type="text"
                                    placeholder="Filtrar dentro de esta categoría..."
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 2.8rem 0.75rem 2.8rem',
                                        border: '1.5px solid #ffc0cb',
                                        borderRadius: '50px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(255,192,203,0.2)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <Search size={16} style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#ffc0cb',
                                    pointerEvents: 'none'
                                }} />
                                {filterText && (
                                    <X
                                        size={15}
                                        onClick={() => setFilterText('')}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#aaa',
                                            cursor: 'pointer'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Grid de productos */}
                    {filteredProducts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: '#fafafa',
                            borderRadius: '20px',
                            border: '2px dashed #e0e0e0'
                        }}>
                            <p style={{ fontSize: '1.125rem', color: '#999' }}>
                                No hay productos disponibles en esta subcategoría
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.uid}
                                    href={`/producto/${product.uid}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            height: '100%', // Enforce full height
                                            display: 'flex', // Enable flex layout
                                            flexDirection: 'column' // Stack children vertically
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                        }}
                                    >
                                        {/* Image */}
                                        <div style={{
                                            width: '100%',
                                            backgroundColor: '#fafafa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            position: 'relative' // Needed for absolute positioning
                                        }}>
                                            {product.images && product.images.length > 0 ? (
                                                <>
                                                    <AutoRotatingImage
                                                        images={product.images}
                                                        alt={product.name}
                                                        interval={3000 + (Math.random() * 2000)}
                                                    />
                                                    {/* Watermark */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%) rotate(-30deg)',
                                                        fontFamily: 'var(--font-bubblegum)',
                                                        color: 'rgba(120, 80, 50, 0.15)', // Brown with low opacity
                                                        fontSize: '2.5rem',
                                                        textAlign: 'center',
                                                        pointerEvents: 'none',
                                                        lineHeight: '0.9',
                                                        whiteSpace: 'nowrap',
                                                        zIndex: 10,
                                                        width: '100%'
                                                    }}>
                                                        Cuanto te<br />Quiero
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ color: '#ccc', fontSize: '4rem' }}>
                                                    📦
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{
                                            padding: '1rem',
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: '0.5rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {product.name}
                                            </h3>

                                            {/* Price and Stock */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '1rem'
                                            }}>
                                                <div>
                                                    <span style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: 'bold',
                                                        color: '#ffc0cb'
                                                    }}>
                                                        ${product.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: product.stock > 0 ? '#4caf50' : '#f44336',
                                                    fontWeight: '500'
                                                }}>
                                                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                                                </div>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#ffc0cb',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#ff6b9d';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#ffc0cb';
                                                }}
                                                disabled={product.stock === 0}
                                            >
                                                <ShoppingCart size={16} />
                                                {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
