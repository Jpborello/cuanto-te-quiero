"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

export default function Footer() {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        supabase
            .from("categories")
            .select("id, name")
            .eq("active", true)
            .order("name", { ascending: true })
            .then(({ data }) => {
                if (data) setCategories(data);
            });
    }, []);
    return (
        <footer style={{
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            marginTop: '4rem'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '3rem 2rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '2rem'
                }}>
                    {/* Columna 1 - Sobre Nosotros */}
                    <div>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: '#ffc0cb',
                            marginBottom: '1rem'
                        }}>
                            Cuanto Te Quiero
                        </h3>
                        <p style={{
                            color: '#666',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            marginBottom: '1rem'
                        }}>
                            Todo lo que tu bebé necesita, con el amor que se merece. Acompañamos cada etapa de tu dulce espera.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <a href="https://www.instagram.com/cuanto_tequiero/" target="_blank" rel="noopener noreferrer" style={{
                                color: '#666',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.facebook.com/cuantotequieroCTQ" target="_blank" rel="noopener noreferrer" style={{
                                color: '#666',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2 - Categorías */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '1rem'
                        }}>
                            Categorías
                        </h4>
                        <nav style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            {categories.map((cat) => {
                                const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/categoria/${slug}`}
                                        style={{
                                            color: '#666',
                                            fontSize: '0.875rem',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}
                                    >
                                        {capitalizeWords(cat.name)}
                                    </Link>
                                );
                            })}
                            <Link href="/ofertas" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Ofertas
                            </Link>
                        </nav>
                    </div>

                    {/* Columna 3 - Información */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '1rem'
                        }}>
                            Información
                        </h4>
                        <nav style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <Link href="/sobre-nosotros" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Sobre Nosotros
                            </Link>
                            <Link href="/preguntas-frecuentes" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Preguntas Frecuentes
                            </Link>
                            <Link href="/envios" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Envíos
                            </Link>
                            <Link href="/cambios-devoluciones" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Cambios y Devoluciones
                            </Link>
                        </nav>
                    </div>

                    {/* Columna 4 - Contacto */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '1rem'
                        }}>
                            Contacto
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <a 
                                href="https://wa.me/5493416029814" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#666',
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#25D366'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                </svg>
                                <span>3416029814</span>
                            </a>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.5rem',
                                color: '#666',
                                fontSize: '0.875rem'
                            }}>
                                <MapPin size={16} style={{ marginTop: '0.2rem' }} />
                                <span>Mendoza 6378 - Rosario, Santa Fe</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid #e5e5e5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>💳 Visa</span>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>💳 Mastercard</span>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>💳 American Express</span>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>💰 Mercado Pago</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}>
                        <p style={{
                            color: '#999',
                            fontSize: '0.875rem',
                            margin: 0
                        }}>
                            © 2024 Cuanto Te Quiero. Todos los derechos reservados.
                        </p>
                        <p style={{
                            color: '#bbb',
                            fontSize: '0.75rem',
                            margin: 0,
                            letterSpacing: '0.02em'
                        }}>
                            Created by <a href="https://www.neo-core-sys.com/es" target="_blank" rel="noopener noreferrer" style={{ color: '#bbb', textDecoration: 'none', borderBottom: '1px dotted #ccc', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'} onMouseOut={(e) => e.currentTarget.style.color = '#bbb'}>neo core sys</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
