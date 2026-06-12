"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    price: number;
    image_url: string | string[] | null;
}

export default function FeaturedCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { settings } = useStoreSettings();

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
                .order("code", { ascending: true })
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
                    .order("code", { ascending: true })
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

    // Helper function to get short product name (before numbers/special chars)
    const getShortProductName = (name: string): string => {
        // Extract main product name before numbers, dimensions, or special details
        // Examples: "CUNA BARANDA FIJA 1.30 X 70 C/RUEDAS ROSA" -> "CUNA BARANDA FIJA"
        //           "CUNA CON BARANDA DESLIZABLE Y CAJONES NORDIC" -> "CUNA CON BARANDA"

        // Split by common separators and take meaningful first parts
        const parts = name.split(/[\d\/\(]/)[0].trim(); // Split before numbers, /, or (

        // If still too long, take first 3-4 words
        const words = parts.split(' ');
        if (words.length > 4) {
            return words.slice(0, 4).join(' ');
        }

        return parts;
    };

    const currentProduct = products[currentIndex];
    const shortName = getShortProductName(currentProduct.name);

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
                        /* Dark gradient overlay for better text readability */
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.1) 100%)'
                    }} />
                )}
            </div>

            {/* Content Section */}
            <div className="featured-carousel-content">
                <span className="featured-tag">
                    ✨ Producto Destacado
                </span>

                <h2 className="featured-title">
                    {shortName}
                </h2>

                {settings.prices_enabled && (
                    currentProduct.price > 0 ? (
                        <p className="featured-price">
                            ${currentProduct.price.toLocaleString('es-AR')}
                        </p>
                    ) : (
                        <p className="featured-price" style={{
                            background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: 'var(--font-bubblegum)',
                            letterSpacing: '0.5px'
                        }}>
                            Disponible
                        </p>
                    )
                )}

                <Link href={`/producto/${currentProduct.uid}`} className="featured-button">
                    <Eye size={22} />
                    Ver Detalles
                </Link>
            </div>


            {/* Controles de Navegación */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    backdropFilter: 'blur(8px)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,157,0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                }}
            >
                <ChevronLeft size={26} />
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    backdropFilter: 'blur(8px)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,157,0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                }}
            >
                <ChevronRight size={26} />
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
