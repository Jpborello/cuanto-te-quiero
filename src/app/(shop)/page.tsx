import Hero from "@/components/home/Hero";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import FeaturedCarousel from "@/components/shop/FeaturedCarousel";
import CategoryBubbles from "@/components/shop/CategoryBubbles";
import Testimonials from "@/components/home/Testimonials";
import WelcomeRaffleModal from "@/components/shop/WelcomeRaffleModal";
import { getFeaturedProducts, getHomeProducts } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default async function Home() {
    // Loaded on the server so products are in the HTML for search engines and AI crawlers
    const [featuredProducts, homeProducts] = await Promise.all([
        getFeaturedProducts(6),
        getHomeProducts(8),
    ]);

    return (
        <>
            <WelcomeRaffleModal />
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
                        <FeaturedCarousel initialProducts={featuredProducts} />
                    </div>

                    {/* Categorías (Burbujas) */}
                    <div id="categorias" className="categories-section" style={{ marginBottom: '6rem' }}>
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
                        </div>
                        <ProductGrid limit={8} initialProducts={homeProducts} />
                    </div>

                </section>

                {/* Testimonials Section - Antes del Footer */}
                <Testimonials />
            </main>
            <Footer />
        </>
    );
}