"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
}

export default function Header() {
    const router = useRouter();
    const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
    const [cartCount] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

            const filteredCategories = (data || []).filter(cat => cat.name !== "General");
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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchFocused(false);
        }
    };

    const handleSearchClick = () => {
        if (searchQuery.trim().length >= 2) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchFocused(false);
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

    const getCategoryColor = (name: string) => {
        const nameUpper = name.toUpperCase();
        if (nameUpper.includes("MUEBLES")) return { color: '#8B4513', hover: '#654321' };
        if (nameUpper.includes("BLANQUERIA")) return { color: '#20B2AA', hover: '#17a89a' };
        if (nameUpper.includes("COCHES") || nameUpper.includes("RODADOS")) return { color: '#4A90E2', hover: '#357ABD' };
        if (nameUpper.includes("ACCESORIOS")) return { color: '#FF69B4', hover: '#FF1493' };
        if (nameUpper.includes("FUTURA") || nameUpper.includes("MAMA")) return { color: '#E91E63', hover: '#C2185B' };
        if (nameUpper.includes("INDUMENTARIA")) return { color: '#9C27B0', hover: '#7B1FA2' };
        return { color: '#666', hover: '#ffc0cb' };
    };

    return (
        <>
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: '#fff0f5',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
                <div style={{
                    maxWidth: '100%',
                    margin: '0 auto',
                    padding: '0.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    justifyContent: 'space-between'
                }}>
                    {/* Left Section: Hamburger Menu (Mobile) + Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Hamburger Menu Button - SOLO MOBILE */}
                        <button
                            className="mobile-hamburger"
                            onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                            style={{
                                background: 'white',
                                border: '2px solid #F9CBD3',
                                cursor: 'pointer',
                                padding: '0.6rem',
                                color: '#F9CBD3',
                                borderRadius: '8px',
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#F9CBD3';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#F9CBD3';
                            }}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <Link href="/" style={{
                            display: 'block',
                            transition: 'transform 0.2s',
                            flexShrink: 0
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <img
                                src="/images/IMG-Hero.png"
                                alt="Cuanto Te Quiero"
                                style={{
                                    height: '60px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </Link>

                        {/* Horizontal Categories - SOLO DESKTOP */}
                        <nav className="desktop-categories" style={{
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            flex: 1
                        }}>
                            {categories.map((category) => {
                                const colors = getCategoryColor(category.name);
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categoria/${getCategorySlug(category.name)}`}
                                        style={{
                                            color: '#555',
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s ease',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            position: 'relative',
                                            padding: '0.5rem 0',
                                            flexShrink: 0
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = colors.hover;
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = '#555';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Section: Search & Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                        {/* Compact Search Bar */}
                        <div style={{
                            width: searchFocused ? '300px' : '200px',
                            position: 'relative',
                            transition: 'width 0.3s ease'
                        }} className="desktop-search">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 2.5rem 0.6rem 2.5rem',
                                    border: '1px solid transparent',
                                    backgroundColor: 'white',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <Search
                                size={16}
                                onClick={handleSearchClick}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#ffc0cb',
                                    cursor: 'pointer'
                                }}
                            />
                            {searchQuery && (
                                <X
                                    size={14}
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#aaa',
                                        cursor: 'pointer'
                                    }}
                                />
                            )}
                        </div>

                        {/* Icons */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{
                                background: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.6rem',
                                color: '#666',
                                borderRadius: '50%',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={20} />
                            </button>

                            <Link href="/carrito" style={{
                                background: 'white',
                                padding: '0.6rem',
                                color: '#666',
                                borderRadius: '50%',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        background: '#ff6b9d',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 'bold',
                                        padding: '0.1rem 0.3rem',
                                        borderRadius: '10px',
                                        minWidth: '16px',
                                        textAlign: 'center'
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar Categories Menu - Desliza desde la izquierda */}
            {categoriesMenuOpen && (
                <>
                    {/* Overlay oscuro */}
                    <div
                        onClick={() => setCategoriesMenuOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1999,
                            animation: 'fadeIn 0.3s ease'
                        }}
                    />

                    {/* Panel lateral */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: '300px',
                        maxWidth: '80vw',
                        backgroundColor: 'white',
                        zIndex: 2000,
                        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
                        overflowY: 'auto',
                        animation: 'slideInLeft 0.3s ease'
                    }}>
                        {/* Header del menú */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '2px solid #F9CBD3',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FFF5F7'
                        }}>
                            <h3 style={{
                                margin: 0,
                                color: '#8d6e63',
                                fontSize: '1.25rem',
                                fontWeight: '700'
                            }}>
                                Categorías
                            </h3>
                            <button
                                onClick={() => setCategoriesMenuOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    color: '#8d6e63',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Lista de categorías */}
                        <nav style={{ padding: '1rem 0' }}>
                            {categories.map((category) => {
                                const colors = getCategoryColor(category.name);
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categoria/${getCategorySlug(category.name)}`}
                                        onClick={() => setCategoriesMenuOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '1rem 1.5rem',
                                            color: '#555',
                                            textDecoration: 'none',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            borderLeft: '4px solid transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#FFF5F7';
                                            e.currentTarget.style.borderLeftColor = colors.color;
                                            e.currentTarget.style.color = colors.color;
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderLeftColor = 'transparent';
                                            e.currentTarget.style.color = '#555';
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                .desktop-categories::-webkit-scrollbar {
                    display: none;
                }

                /* Desktop: Mostrar categorías horizontales, ocultar hamburguesa */
                @media (min-width: 769px) {
                    .mobile-hamburger {
                        display: none !important;
                    }
                    .desktop-categories {
                        display: flex !important;
                    }
                }

                /* Mobile: Mostrar hamburguesa, ocultar categorías horizontales */
                @media (max-width: 768px) {
                    .mobile-hamburger {
                        display: flex !important;
                    }
                    .desktop-categories {
                        display: none !important;
                    }
                }

                @media (max-width: 1024px) {
                    .desktop-search {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
