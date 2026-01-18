import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
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
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                                color: '#666',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                <Instagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
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
                            <Link href="/categoria/mundo-bebe" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Mundo Bebé
                            </Link>
                            <Link href="/categoria/dulce-espera" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Dulce Espera
                            </Link>
                            <Link href="/categoria/regaleria" style={{
                                color: '#666',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Regalería
                            </Link>
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
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#666',
                                fontSize: '0.875rem'
                            }}>
                                <Mail size={16} />
                                <span>info@cuantotequiero.com</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#666',
                                fontSize: '0.875rem'
                            }}>
                                <Phone size={16} />
                                <span>+54 9 11 1234-5678</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.5rem',
                                color: '#666',
                                fontSize: '0.875rem'
                            }}>
                                <MapPin size={16} style={{ marginTop: '0.2rem' }} />
                                <span>Buenos Aires, Argentina</span>
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
                    <p style={{
                        color: '#999',
                        fontSize: '0.875rem'
                    }}>
                        © 2024 Cuanto Te Quiero. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
