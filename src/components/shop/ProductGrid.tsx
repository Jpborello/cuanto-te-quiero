"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import AutoRotatingImage from "./AutoRotatingImage";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface Product {
    uid: string;
    product_id: number;
    code?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | string[] | null;
    active: boolean;
}

interface ProductGridProps {
    limit?: number; // Número máximo de productos a mostrar
}

export default function ProductGrid({ limit }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { settings } = useStoreSettings();

    useEffect(() => {
        fetchProducts();
    }, [limit]);

    const fetchProducts = async () => {
        try {
            let query = supabase
                .from("products")
                .select("*")
                .eq("active", true)
                .order("code", { ascending: true });

            // Si hay un límite, aplicarlo
            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get image array
    const getImageUrlArray = (imageUrl: string | string[] | null): string[] => {
        if (!imageUrl) return [];
        if (Array.isArray(imageUrl)) return imageUrl;
        try {
            const parsed = JSON.parse(imageUrl);
            return Array.isArray(parsed) ? parsed : [imageUrl];
        } catch {
            return [imageUrl];
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#999'
            }}>
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#fafafa',
                borderRadius: '20px',
                border: '2px dashed #e0e0e0'
            }}>
                <p style={{
                    fontSize: '1.125rem',
                    color: '#999',
                    marginBottom: '1rem'
                }}>
                    🛍️ Próximamente: Grilla de productos destacados
                </p>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#bbb'
                }}>
                    Estamos preparando los mejores productos para ti
                </p>
            </div>
        );
    }

    return (
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
                        aspectRatio: '1 / 1',
                        backgroundColor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative' // Needed for absolute positioning of watermark
                    }}>
                        {getImageUrlArray(product.image_url).length > 0 ? (
                            <>
                                <AutoRotatingImage
                                    images={getImageUrlArray(product.image_url)}
                                    alt={product.name}
                                    interval={3000 + (Math.random() * 2000)} // slight random offset so they don't all flip exactly at the same time
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
                            <div style={{
                                color: '#ccc',
                                fontSize: '4rem'
                            }}>
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
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.5rem',
                            lineHeight: '1.25rem'
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
                                {settings.prices_enabled && (
                                    product.price > 0 ? (
                                        <span style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '800',
                                            background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            ${product.price.toLocaleString('es-AR')}
                                        </span>
                                    ) : (
                                        <span style={{
                                            fontSize: '1.35rem',
                                            fontWeight: 'bold',
                                            fontFamily: 'var(--font-bubblegum)',
                                            background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Disponible
                                        </span>
                                    )
                                )}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'white',
                                backgroundColor: product.stock > 0 ? '#4caf50' : '#f44336',
                                fontWeight: '600',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                            </div>
                        </div>

                        {/* Action Button: Cart or WhatsApp */}
                        {settings.cart_enabled ? (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: product.stock > 0
                                        ? 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)'
                                        : '#e0e0e0',
                                    color: product.stock > 0 ? 'white' : '#999',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: product.stock > 0
                                        ? '0 4px 12px rgba(255,107,157,0.3)'
                                        : 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff4081 0%, #ff6b9d 100%)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,157,0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,157,0.3)';
                                    }
                                }}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={18} />
                                {product.stock > 0 ? 'Agregar' : 'Agotado'}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (product.stock > 0) {
                                        const images = getImageUrlArray(product.image_url);
                                        const firstImage = images.length > 0 ? images[0] : '';
                                        const absoluteImageUrl = firstImage ? (firstImage.startsWith('http') ? firstImage : `${window.location.origin}${firstImage}`) : '';
                                        const message = `Hola! Me gustaría consultar por el producto: ${product.name}${product.code ? ` (Código: ${product.code})` : ''}.\nLink: ${window.location.origin}/producto/${product.uid}${absoluteImageUrl ? `\nImagen: ${absoluteImageUrl}` : ''}`;
                                        const whatsappUrl = `https://wa.me/5493416029814?text=${encodeURIComponent(message)}`;
                                        window.open(whatsappUrl, '_blank');
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: product.stock > 0
                                        ? 'linear-gradient(135deg, #85e3b2 0%, #5ad897 100%)'
                                        : '#e0e0e0',
                                    color: product.stock > 0 ? 'white' : '#999',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: product.stock > 0
                                        ? '0 4px 12px rgba(90,216,151,0.3)'
                                        : 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #5ad897 0%, #3acb7e 100%)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(90,216,151,0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #85e3b2 0%, #5ad897 100%)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(90,216,151,0.3)';
                                    }
                                }}
                                disabled={product.stock === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                </svg>
                                {product.stock > 0 ? 'Consulta WhatsApp' : 'Agotado'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
