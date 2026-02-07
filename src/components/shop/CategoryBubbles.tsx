"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface BubbleData {
    id: string;
    name: string;
    slug: string;
    parentSlug: string;
    image_url: string | null;
    color: string;
}

const TARGET_SUBCATEGORIES = [
    {
        name: "ROPEROS Y PLACARES",
        color: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)",
        label: "Roperos"
    },
    {
        name: "CAJONERAS",
        color: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 50%, #F48FB1 100%)",
        label: "Cajoneras"
    },
    {
        name: "CUNAS",
        color: "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 50%, #FFF176 100%)",
        label: "Cunas"
    }
];

export default function CategoryBubbles() {
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.all(
                    TARGET_SUBCATEGORIES.map(async (target) => {
                        const { data: subcatData, error: subcatError } = await supabase
                            .from("subcategories")
                            .select("id, name, category_id")
                            .ilike("name", target.name)
                            .maybeSingle();

                        if (subcatError || !subcatData) {
                            console.warn(`Subcategory not found: ${target.name}`, subcatError);
                            return null;
                        }

                        const { data: catData } = await supabase
                            .from("categories")
                            .select("name")
                            .eq("id", subcatData.category_id)
                            .single();

                        if (!catData) return null;

                        const { data: productData } = await supabase
                            .from("products")
                            .select("image_url")
                            .eq("subcategory_id", subcatData.id)
                            .eq("active", true)
                            .not("image_url", "is", null)
                            .limit(1);

                        let imageUrl = null;
                        if (productData && productData.length > 0) {
                            const rawUrl = productData[0].image_url;
                            if (Array.isArray(rawUrl)) imageUrl = rawUrl[0];
                            else if (typeof rawUrl === "string") {
                                try {
                                    const parsed = JSON.parse(rawUrl);
                                    imageUrl = Array.isArray(parsed) ? parsed[0] : rawUrl;
                                } catch {
                                    imageUrl = rawUrl;
                                }
                            }
                        }

                        return {
                            id: subcatData.id,
                            name: target.label,
                            slug: subcatData.name.toLowerCase().replace(/\s+/g, '-'),
                            parentSlug: catData.name.toLowerCase().replace(/\s+/g, '-'),
                            image_url: imageUrl,
                            color: target.color
                        };
                    })
                );

                setBubbles(results.filter((b): b is BubbleData => b !== null));
            } catch (error) {
                console.error("Error fetching bubbles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [bubbles]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 300);
        }
    };

    if (loading) return null;

    return (
        <section className="categories-section-wrapper">
            <h3 className="section-title" style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#333'
            }}>
                Categorías Populares
            </h3>

            {/* Hint text para mobile */}
            <p className="categories-hint">
                Deslizá para ver más →
            </p>

            <div className="categories-scroll-wrapper">
                {/* Flecha izquierda */}
                {canScrollLeft && (
                    <button
                        className="category-arrow category-arrow-left"
                        onClick={() => scroll('left')}
                        aria-label="Ver categorías anteriores"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                {/* Container con scroll */}
                <div
                    ref={scrollContainerRef}
                    className="categories-scroll-container"
                    onScroll={checkScroll}
                >
                    {bubbles.map((bubble, index) => (
                        <Link
                            key={bubble.id}
                            href={`/categoria/${bubble.parentSlug}/${bubble.slug}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div
                                className="category-bubble-container"
                                style={{
                                    animation: `float 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`
                                }}
                            >
                                {/* Bubble Circle */}
                                <div className="category-bubble">
                                    {bubble.image_url ? (
                                        <img
                                            src={bubble.image_url}
                                            alt={bubble.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    ) : (
                                        <ImageIcon size={48} color="#999" opacity={0.5} />
                                    )}
                                </div>

                                {/* Label */}
                                <span className="category-label">
                                    {bubble.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Flecha derecha */}
                {canScrollRight && (
                    <button
                        className="category-arrow category-arrow-right"
                        onClick={() => scroll('right')}
                        aria-label="Ver más categorías"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            <style jsx>{`
                .categories-section-wrapper {
                    margin-bottom: 4rem;
                    position: relative;
                }

                .categories-hint {
                    text-align: center;
                    color: #F9CBD3;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                    display: none;
                }

                .categories-scroll-wrapper {
                    position: relative;
                    max-width: 100%;
                }

                .categories-scroll-container {
                    display: flex;
                    gap: 2rem;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                    padding: 1rem 2rem;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .categories-scroll-container::-webkit-scrollbar {
                    display: none;
                }

                .category-bubble-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                .category-bubble-container:hover {
                    transform: translateY(-8px) scale(1.05);
                }

                .category-bubble {
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    background: var(--bubble-color, #F9CBD3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1);
                    border: 4px solid white;
                    transition: all 0.3s ease;
                }

                .category-label {
                    fontSize: 1.125rem;
                    font-weight: 600;
                    color: #555;
                    text-align: center;
                }

                .category-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    border: 2px solid #F9CBD3;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    color: #F9CBD3;
                }

                .category-arrow:hover {
                    background: #F9CBD3;
                    color: white;
                    transform: translateY(-50%) scale(1.1);
                }

                .category-arrow-left {
                    left: 0;
                }

                .category-arrow-right {
                    right: 0;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }
                
                .category-bubble-container:hover {
                    animation-play-state: paused;
                }

                /* Mobile styles */
                @media (max-width: 768px) {
                    .categories-hint {
                        display: block;
                    }

                    .categories-scroll-container {
                        justify-content: flex-start;
                        padding: 1rem;
                        gap: 1.5rem;
                    }

                    .category-bubble {
                        width: 140px;
                        height: 140px;
                    }

                    .category-arrow {
                        display: none;
                    }
                }

                /* Desktop: center items */
                @media (min-width: 769px) {
                    .categories-scroll-container {
                        justify-content: center;
                        overflow-x: visible;
                    }

                    .category-arrow {
                        display: none;
                    }
                }
            `}</style>
        </section>
    );
}
