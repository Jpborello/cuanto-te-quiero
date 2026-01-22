"use client";

import Hero from "@/components/home/Hero";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoriesGrid from "@/components/shop/CategoriesGrid";
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

                    {/* Hero Text Section with CTA */}
                    <div className="hero-text-container" style={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto 4rem'
                    }}>
                        <h1 className="hero-title" style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            lineHeight: '1.2'
                        }}>
                            Todo para tu bebé, <br />
                            <span className="highlight" style={{ color: '#ffc0cb' }}>con amor.</span>
                        </h1>
                        <p className="hero-message" style={{
                            fontSize: '1.25rem',
                            color: '#666',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Acompañamos cada etapa de tu dulce espera con productos diseñados para soñar.
                        </p>
                        <Link href="/productos" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 2.5rem',
                            backgroundColor: '#ffc0cb',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '50px',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(255,192,203,0.3)',
                            transition: 'all 0.3s ease'
                        }} onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff6b9d';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,157,0.4)';
                        }} onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffc0cb';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,192,203,0.3)';
                        }}>
                            Ver Productos
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Sección Categorías */}
                    <div className="collections-container" style={{ marginBottom: '4rem' }}>
                        <h3 className="section-title" style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                            color: '#333'
                        }}>
                            Nuestras Categorías
                        </h3>
                        <CategoriesGrid />
                    </div>

                    {/* Sección Productos */}
                    <div className="products-container">
                        <h3 className="section-title" style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                            color: '#333'
                        }}>
                            Lo más buscado
                        </h3>
                        <ProductGrid limit={4} />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}