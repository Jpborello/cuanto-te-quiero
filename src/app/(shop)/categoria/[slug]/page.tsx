"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { ShoppingCart } from "lucide-react";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string[] | null;
    active: boolean;
}

interface Category {
    id: string;
    name: string;
}

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryAndProducts();
    }, [slug]);

    const fetchCategoryAndProducts = async () => {
        try {
            // Convertir slug a nombre de categoría
            const categoryName = slug
                .split('-')
                .map(word => word.toUpperCase())
                .join(' ');

            // Buscar categoría
            const { data: categoryData, error: categoryError } = await supabase
                .from("categories")
                .select("*")
                .ilike("name", `%${categoryName}%`)
                .single();

            if (categoryError) throw categoryError;
            setCategory(categoryData);

            // Buscar productos de esta categoría
            const { data: productsData, error: productsError } = await supabase
                .from("products")
                .select("*")
                .eq("category_id", categoryData.id)
                .eq("active", true)
                .order("product_id", { ascending: true });

            if (productsError) throw productsError;
            setProducts(productsData || []);
        } catch (error) {
            console.error("Error fetching category:", error);
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

    if (!category) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
                            Categoría no encontrada
                        </h1>
                        <p style={{ color: '#666' }}>
                            La categoría que buscas no existe.
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
                    {/* Header de categoría */}
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '1rem'
                        }}>
                            {category.name}
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
                                No hay productos disponibles en esta categoría
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {products.map((product) => (
                                <div
                                    key={product.uid}
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
                                        backgroundColor: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {product.image_url && product.image_url.length > 0 ? (
                                            <img
                                                src={product.image_url[0]}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
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
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
