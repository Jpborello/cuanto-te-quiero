"use client";

import { Heart, Sparkles, Medal } from "lucide-react";

export default function BrandValues() {
    return (
        <div style={{
            padding: '4rem 2rem',
            backgroundColor: 'rgba(255, 240, 245, 0.5)', /* Very light pink background */
            borderRadius: '24px',
            margin: '0 auto 4rem',
            maxWidth: '1200px',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto 3rem'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    color: '#8d6e63', /* Brand Brown */
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-brand)',
                    fontWeight: '600'
                }}>
                    Todo para tu bebé, <span style={{ color: '#ff6b9d', fontStyle: 'italic' }}>con amor.</span>
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    lineHeight: '1.6'
                }}>
                    Acompañamos cada etapa de tu dulce espera con productos diseñados para soñar, combinando seguridad, confort y ternura.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                justifyContent: 'center'
            }}>
                {/* Value 1 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.3s ease'
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fff0f5',
                        borderRadius: '50%',
                        color: '#ff6b9d'
                    }}>
                        <Heart size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#555' }}>Diseño con Amor</h3>
                    <p style={{ fontSize: '0.95rem', color: '#888' }}>
                        Cada pieza es seleccionada pensando en la calidez que tu bebé merece.
                    </p>
                </div>

                {/* Value 2 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.3s ease'
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#e0f2fe', /* Light blue */
                        borderRadius: '50%',
                        color: '#3b82f6'
                    }}>
                        <Sparkles size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#555' }}>Estilo Único</h3>
                    <p style={{ fontSize: '0.95rem', color: '#888' }}>
                        Tendencias modernas que transforman el cuarto de tu bebé en un sueño.
                    </p>
                </div>

                {/* Value 3 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.3s ease'
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fef3c7', /* Light yellow */
                        borderRadius: '50%',
                        color: '#d97706'
                    }}>
                        <Medal size={32} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#555' }}>Calidad Premium</h3>
                    <p style={{ fontSize: '0.95rem', color: '#888' }}>
                        Materiales seguros y duraderos para acompañar su crecimiento.
                    </p>
                </div>
            </div>
        </div>
    );
}
