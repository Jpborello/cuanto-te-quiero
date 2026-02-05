"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

interface Product {
    uid: string;
    product_id: number;
    name: string;
    price: number;
    image_url: string | string[] | null;
}

export default function FeaturedCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000); // Cambio cada 5 segundos

        return () => clearInterval(interval);
    }, [isAutoPlaying, products.length]);

    const fetchFeaturedProducts = async () => {
        try {
            // Primero intentar obtener productos marcados como destacados
            let { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("active", true)
                .eq("featured", true)
                .order("product_id", { ascending: true })
                .limit(6);

            if (error) {
                console.error('Error fetching featured products:', error);
                // Si hay error (ej: columna featured no existe), usar fallback
                data = null;
            }

            // Si no hay productos destacados, usar los primeros 6 productos activos
            if (!data || data.length === 0) {
                const fallback = await supabase
                    .from("products")
                    .select("*")
                    .eq("active", true)
                    .order("product_id", { ascending: true })
                    .limit(6);

                if (fallback.error) throw fallback.error;
                setProducts(fallback.data || []);
            } else {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching featured products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get image URL (handle both string and array)
    const getImageUrl = (imageUrl: string | string[] | null): string | null => {
        if (!imageUrl) return null;
        if (Array.isArray(imageUrl)) {
            return imageUrl.length > 0 ? imageUrl[0] : null;
        }
        return imageUrl;
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    if (loading) {
        return (
            <div style={{
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffc0cb 0%, #add8e6 100%)',
                borderRadius: '24px',
                color: 'white'
            }}>
                <p>Cargando productos destacados...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    const currentProduct = products[currentIndex];

    return (
        <div className="featured-carousel">
            {/* Producto Principal */}
            <div className="featured-carousel-image-container">
                {/* Imagen de fondo */}
                {getImageUrl(currentProduct.image_url) ? (
                    <>
                        <img
                            src={getImageUrl(currentProduct.image_url)!}
                            alt={currentProduct.name}
                            className="featured-carousel-image"
                        />
                        {/* Watermark in Image Container - Only visible if image exists */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-30deg)',
                            fontFamily: 'var(--font-bubblegum)',
                            color: 'rgba(255, 255, 255, 0.2)',
                            fontSize: '6rem',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            lineHeight: '0.9',
                            whiteSpace: 'nowrap',
                            zIndex: 1,
                            width: '100%',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            Cuanto te<br />Quiero
                        </div>
                    </>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #ffc0cb 0%, #add8e6 100%)'
                    }} />
                )}
            </div>

            {/* Content Section */}
            <div className="featured-carousel-content">
                <span className="featured-tag">
                    ✨ Producto Destacado
                </span>

                <h2 className="featured-title">
                    {currentProduct.name}
                </h2>

                <p className="featured-price">
                    ${currentProduct.price.toLocaleString('es-AR')}
                </p>

                <Link href={`/producto/${currentProduct.product_id}`} className="featured-button">
                    <ShoppingCart size={20} />
                    Ver Producto
                </Link>
            </div>


            {/* Controles de Navegación */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ffc0cb';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.color = '#333';
                }}
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ffc0cb';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.color = '#333';
                }}
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicadores */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.75rem',
                zIndex: 10
            }}>
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        style={{
                            width: index === currentIndex ? '40px' : '12px',
                            height: '12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: index === currentIndex ? '#ffc0cb' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: index === currentIndex ? '0 2px 8px rgba(255,192,203,0.5)' : 'none'
                        }}
                    />
                ))}
            </div>
        </div >
    );
}
