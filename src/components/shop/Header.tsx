"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount] = useState(0); // TODO: Connect to cart context

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#ffc0cb',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    Cuanto Te Quiero
                </Link>

                {/* Desktop Navigation */}
                <nav style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center'
                }} className="desktop-nav">
                    <Link href="/categoria/mundo-bebe" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                        Mundo Bebé
                    </Link>
                    <Link href="/categoria/dulce-espera" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                        Dulce Espera
                    </Link>
                    <Link href="/categoria/regaleria" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'color 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                        Regalería
                    </Link>
                    <Link href="/ofertas" style={{
                        color: '#ff6b9d',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'color 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ff4081'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#ff6b9d'}>
                        Ofertas
                    </Link>
                </nav>

                {/* Search Bar */}
                <div style={{
                    flex: 1,
                    maxWidth: '400px',
                    position: 'relative'
                }} className="desktop-search">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                            border: '2px solid #f0f0f0',
                            borderRadius: '25px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#ffc0cb';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,192,203,0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#f0f0f0';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#999'
                    }} />
                </div>

                {/* Icons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        color: '#666',
                        transition: 'color 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                        <User size={22} />
                    </button>

                    <Link href="/carrito" style={{
                        position: 'relative',
                        padding: '0.5rem',
                        color: '#666',
                        transition: 'color 0.2s',
                        textDecoration: 'none'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#ffc0cb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: '#ff6b9d',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '10px',
                                minWidth: '18px',
                                textAlign: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: '#666',
                            display: 'none'
                        }}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu" style={{
                    padding: '1rem 2rem',
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: 'white'
                }}>
                    <nav style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <Link href="/categoria/mundo-bebe" style={{
                            color: '#666',
                            textDecoration: 'none',
                            fontWeight: '500',
                            padding: '0.5rem 0'
                        }}>
                            Mundo Bebé
                        </Link>
                        <Link href="/categoria/dulce-espera" style={{
                            color: '#666',
                            textDecoration: 'none',
                            fontWeight: '500',
                            padding: '0.5rem 0'
                        }}>
                            Dulce Espera
                        </Link>
                        <Link href="/categoria/regaleria" style={{
                            color: '#666',
                            textDecoration: 'none',
                            fontWeight: '500',
                            padding: '0.5rem 0'
                        }}>
                            Regalería
                        </Link>
                        <Link href="/ofertas" style={{
                            color: '#ff6b9d',
                            textDecoration: 'none',
                            fontWeight: '600',
                            padding: '0.5rem 0'
                        }}>
                            Ofertas
                        </Link>
                    </nav>
                </div>
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .desktop-search {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }
            `}</style>
        </header>
    );
}
