"use client";

import Hero from "@/components/home/Hero";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import Link from "next/link";
import { ArrowRight, Baby, Heart, Gift } from "lucide-react";

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

                    {/* Sección Colecciones */}
                    <div className="collections-container" style={{ marginBottom: '4rem' }}>
                        <h3 className="section-title" style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                            color: '#333'
                        }}>
                            Explorá nuestras colecciones
                        </h3>
                        <div className="collections-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            <Link href="/categoria/mundo-bebe" style={{
                                position: 'relative',
                                height: '300px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                background: 'linear-gradient(135deg, #add8e6 0%, #87ceeb 100%)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }} onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }} onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '2rem'
                                }}>
                                    <Baby size={40} style={{ color: 'white', marginBottom: '1rem' }} />
                                    <h4 style={{
                                        color: 'white',
                                        fontSize: '1.75rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Mundo Bebé
                                    </h4>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '0.875rem'
                                    }}>
                                        Todo lo esencial para tu pequeño
                                    </p>
                                </div>
                            </Link>

                            <Link href="/categoria/dulce-espera" style={{
                                position: 'relative',
                                height: '300px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                background: 'linear-gradient(135deg, #ffc0cb 0%, #ff9eb5 100%)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }} onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }} onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '2rem'
                                }}>
                                    <Heart size={40} style={{ color: 'white', marginBottom: '1rem' }} />
                                    <h4 style={{
                                        color: 'white',
                                        fontSize: '1.75rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Dulce Espera
                                    </h4>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '0.875rem'
                                    }}>
                                        Acompañamos tu embarazo
                                    </p>
                                </div>
                            </Link>

                            <Link href="/categoria/regaleria" style={{
                                position: 'relative',
                                height: '300px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                background: 'linear-gradient(135deg, #fff8dc 0%, #ffeaa7 100%)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }} onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }} onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '2rem'
                                }}>
                                    <Gift size={40} style={{ color: 'white', marginBottom: '1rem' }} />
                                    <h4 style={{
                                        color: 'white',
                                        fontSize: '1.75rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Regalería
                                    </h4>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '0.875rem'
                                    }}>
                                        El regalo perfecto
                                    </p>
                                </div>
                            </Link>
                        </div>
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
                        <ProductGrid />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}