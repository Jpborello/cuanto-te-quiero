"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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

    useEffect(() => {
        fetchSubcategoryAndProducts();
    }, [subslug]);

    const fetchSubcategoryAndProducts = async () => {
        try {
            console.log('[DEBUG] Starting fetchSubcategoryAndProducts');
            console.log('[DEBUG] subslug:', subslug);

            // Convertir subslug a nombre de subcategoría
            const subcategoryName = subslug
                .split('-')
                .map(word => word.toUpperCase())
                .join(' ');

            console.log('[DEBUG] Converted subcategoryName:', subcategoryName);

            // Buscar subcategoría con match exacto
            const { data: subcategoryData, error: subcategoryError } = await supabase
                .from("subcategories")
                .select("*")
                .eq("name", subcategoryName)
                .single();

            console.log('[DEBUG] Subcategory query result:', { subcategoryData, subcategoryError });

            if (subcategoryError) throw subcategoryError;
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
                .order("product_id", { ascending: true });

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

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header de subcategoría */}
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '1rem',
                            textTransform: 'uppercase'
                        }}>
                            {subcategory.name}
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.125rem' }}>
                            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                        </p>
                    </div>

                    {/* Grid de productos */}
                    {products.length === 0 ? (
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
                            {products.map((product) => (
                                <Link
                                    key={product.uid}
                                    href={`/producto/${product.code}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
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
                                            height: '280px',
                                            backgroundColor: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            padding: '0.5rem'
                                        }}>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        width: 'auto',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ color: '#ccc', fontSize: '4rem' }}>
                                                    📦
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: '0.5rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {product.name}
                                            </h3>

                                            <p style={{
                                                fontSize: '0.875rem',
                                                color: '#666',
                                                marginBottom: '1rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {product.description}
                                            </p>

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
