import Hero from "@/components/home/Hero";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />

            <section className="home-section">

                {/* Hero Text Section */}
                <div className="hero-text-container">
                    <h1 className="hero-title">
                        Todo para tu bebé, <br />
                        <span className="highlight">con amor.</span>
                    </h1>
                    <p className="hero-message">
                        Acompañamos cada etapa de tu dulce espera con productos diseñados para soñar.
                    </p>
                </div>

                {/* Sección Colecciones */}
                <div className="collections-container">
                    <h3 className="section-title">
                        Explorá nuestras colecciones
                    </h3>
                    <div className="collections-grid">
                        <div className="collection-card">
                            Mundo Bebé
                        </div>
                        <div className="collection-card">
                            Dulce Espera
                        </div>
                        <div className="collection-card span-md-2">
                            Regalería
                        </div>
                    </div>
                </div>

                {/* Sección Productos */}
                <div className="products-container">
                    <h3 className="section-title">
                        Lo más buscado
                    </h3>
                    <div className="placeholder-grid">
                        Próximamente: Grilla de productos destacados...
                    </div>
                </div>
            </section>
        </main>
    );
}