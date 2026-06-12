"use client";

import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function SobreNosotrosPage() {
    return (
        <>
            <Header />
            <main style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ffeef2 0%, #e0f2fe 50%, #fffbf0 100%)",
                padding: "6rem 2rem",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {/* Decorative glowing blobs */}
                <div style={{
                    position: "absolute",
                    top: "10%",
                    left: "5%",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    background: "rgba(255, 192, 203, 0.4)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                    zIndex: 0
                }} />
                <div style={{
                    position: "absolute",
                    bottom: "15%",
                    right: "8%",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "rgba(186, 230, 253, 0.45)",
                    filter: "blur(80px)",
                    pointerEvents: "none",
                    zIndex: 0
                }} />

                {/* Glassmorphic card */}
                <div style={{
                    maxWidth: "850px",
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "32px",
                    padding: "3.5rem 2.5rem",
                    boxShadow: "0 20px 50px rgba(255, 180, 190, 0.15), 0 4px 20px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1
                }}>
                    <span style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "#ff6b9d",
                        display: "block",
                        marginBottom: "0.5rem"
                    }}>
                        Nuestra Trayectoria
                    </span>

                    <h1 style={{
                        fontSize: "3rem",
                        fontWeight: "bold",
                        fontFamily: "var(--font-bubblegum)",
                        background: "linear-gradient(135deg, #ff9bb0 0%, #ff5c8a 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "1rem",
                        letterSpacing: "0.5px"
                    }}>
                        Sobre Nosotros
                    </h1>

                    <p style={{
                        fontSize: "1.1rem",
                        color: "#8d775f",
                        fontWeight: "500",
                        marginBottom: "2.5rem",
                        fontStyle: "italic"
                    }}>
                        "Una historia de amor, familia y dedicación en cada etapa de la dulce espera"
                    </p>
                    
                    <div style={{
                        fontSize: "1.15rem",
                        color: "#5d4e3f",
                        lineHeight: "1.9",
                        fontWeight: "400",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.75rem",
                        fontFamily: "var(--font-brand), system-ui, sans-serif",
                        textAlign: "justify"
                    }}>
                        <p style={{ textAlign: "center", fontSize: "1.25rem", color: "#4d3e33" }}>
                            Con <strong>20 años de trayectoria</strong> en el rubro, nos complace presentarnos formalmente ante cada una de las familias que nos visitan día tras día.
                        </p>
                        
                        <p>
                            Somos una <strong>empresa familiar</strong> que nació con el profundo anhelo de estar presentes y brindarte el mejor acompañamiento durante la dulce espera de ese ser tan especial y único en tu vida. Entendemos que la llegada de un bebé es un momento mágico y lleno de emociones, y por eso asumimos el compromiso de ayudarte a preparar su espacio con la mayor dedicación.
                        </p>
                        
                        <p>
                            Día a día trabajamos con esmero para mejorar nuestros servicios, capacitar a nuestro personal y seleccionar minuciosamente cada artículo de nuestro catálogo. Desde el diseño de los muebles de dormitorio hasta el más pequeño de los accesorios, nos aseguramos de que cada producto que lleves a tu hogar cumpla con los más altos estándares de calidad, seguridad y, sobre todo, mucho amor.
                        </p>

                        {/* Highlight Section */}
                        <div style={{
                            backgroundColor: "rgba(255, 192, 203, 0.15)",
                            borderRadius: "20px",
                            padding: "1.5rem 2rem",
                            borderLeft: "4px solid #ff6b9d",
                            marginTop: "1rem",
                            marginBottom: "1rem",
                            textAlign: "center"
                        }}>
                            <h4 style={{
                                fontFamily: "var(--font-bubblegum)",
                                color: "#ff5c8a",
                                fontSize: "1.3rem",
                                margin: "0 0 0.5rem 0"
                            }}>
                                Nuestro Compromiso Familiar
                            </h4>
                            <p style={{ margin: 0, fontSize: "1.05rem", color: "#6d5d4f", fontStyle: "italic" }}>
                                Ofrecerte un asesoramiento cálido y honesto para que te sientas contenido, seguro y acompañado en esta hermosa aventura de la paternidad y maternidad.
                            </p>
                        </div>
                        
                        <p style={{
                            fontSize: "1.6rem",
                            fontFamily: "var(--font-bubblegum)",
                            color: "#ff6b9d",
                            marginTop: "1.5rem",
                            textAlign: "center",
                            textShadow: "0 2px 10px rgba(255, 107, 157, 0.1)"
                        }}>
                            ¡Gracias por hacernos parte de su historia! ♥
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
