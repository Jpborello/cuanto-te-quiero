"use client";

import Hero from "@/components/home/Hero";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import FeaturedCarousel from "@/components/shop/FeaturedCarousel";
import CategoryBubbles from "@/components/shop/CategoryBubbles";
import Testimonials from "@/components/home/Testimonials";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <div className="hero-wrapper">
                    <Hero />
                </div>

                <section className="home-section">



                    {/* Carrusel de Productos Destacados */}
                    <div className="featured-container" style={{ marginBottom: '4rem' }}>
                        <h3 className="section-title" style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                            color: '#333'
                        }}>
                            Productos Destacados
                        </h3>
                        <FeaturedCarousel />
                    </div>

                    {/* Categorías (Burbujas) */}
                    <div className="categories-section" style={{ marginBottom: '6rem' }}>
                        <CategoryBubbles />
                    </div>

                    {/* Grilla de Productos */}
                    <div className="products-section" style={{ marginBottom: '4rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'end',
                            marginBottom: '2rem',
                            padding: '0 1rem'
                        }}>
                            <h3 className="section-title" style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: 0
                            }}>
                                Novedades
                            </h3>
                            <Link href="/productos" style={{
                                color: '#ff6b9d',
                                fontWeight: '600',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                Ver todos <ArrowRight size={16} />
                            </Link>
                        </div>
                        <ProductGrid limit={8} />
                    </div>

                </section>

                {/* Testimonials Section - Antes del Footer */}
                <Testimonials />
            </main>
            <Footer />
        </>
    );
}