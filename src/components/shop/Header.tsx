"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount] = useState(0); // TODO: Connect to cart context
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("id, name")
                .order("name", { ascending: true });

            if (error) throw error;

            // Filtrar y ordenar las categorías
            const filteredCategories = (data || []).filter(cat => cat.name !== "General");

            // Ordenar: Muebles Infantiles primero, luego Blanquería, luego el resto
            const sortedCategories = filteredCategories.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA.includes("MUEBLES")) return -1;
                if (nameB.includes("MUEBLES")) return 1;
                if (nameA.includes("BLANQUERIA")) return -1;
                if (nameB.includes("BLANQUERIA")) return 1;
                return nameA.localeCompare(nameB);
            });

            setCategories(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getCategorySlug = (name: string) => {
        return name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    };

    const isFeaturedCategory = (name: string) => {
        return name.toUpperCase().includes("MUEBLES");
    };

    // Asignar colores únicos a cada categoría
    const getCategoryColor = (name: string) => {
        const nameUpper = name.toUpperCase();

        // Muebles Infantiles - Marrón
        if (nameUpper.includes("MUEBLES")) return { color: '#8B4513', hover: '#654321' };

        // Blanquería y Colchones - Verde menta
        if (nameUpper.includes("BLANQUERIA")) return { color: '#20B2AA', hover: '#17a89a' };

        // Coches y Rodados - Azul cielo
        if (nameUpper.includes("COCHES") || nameUpper.includes("RODADOS")) return { color: '#4A90E2', hover: '#357ABD' };

        // Accesorios para Bebés - Rosa claro
        if (nameUpper.includes("ACCESORIOS")) return { color: '#FF69B4', hover: '#FF1493' };

        // Futura Mamá - Rosa suave
        if (nameUpper.includes("FUTURA") || nameUpper.includes("MAMA")) return { color: '#E91E63', hover: '#C2185B' };

        // Indumentaria - Morado
        if (nameUpper.includes("INDUMENTARIA")) return { color: '#9C27B0', hover: '#7B1FA2' };

        // Default - Gris
        return { color: '#666', hover: '#ffc0cb' };
    };

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

                {/* Desktop Navigation - Dynamic Categories */}
                <nav style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }} className="desktop-nav">
                    {categories.map((category) => {
                        const isFeatured = isFeaturedCategory(category.name);
                        const colors = getCategoryColor(category.name);
                        return (
                            <Link
                                key={category.id}
                                href={`/categoria/${getCategorySlug(category.name)}`}
                                style={{
                                    color: colors.color,
                                    textDecoration: 'none',
                                    fontWeight: isFeatured ? '700' : '600',
                                    fontSize: isFeatured ? '1rem' : '0.95rem',
                                    transition: 'all 0.2s',
                                    textTransform: 'capitalize',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = colors.hover;
                                    if (isFeatured) {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = colors.color;
                                    if (isFeatured) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                {category.name}
                            </Link>
                        );
                    })}
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
                        {categories.map((category) => {
                            const isFeatured = isFeaturedCategory(category.name);
                            const colors = getCategoryColor(category.name);
                            return (
                                <Link
                                    key={category.id}
                                    href={`/categoria/${getCategorySlug(category.name)}`}
                                    style={{
                                        color: colors.color,
                                        textDecoration: 'none',
                                        fontWeight: isFeatured ? '700' : '600',
                                        padding: '0.5rem 0',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {category.name}
                                </Link>
                            );
                        })}
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
