"use client";

import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import ImageCarousel from "@/components/shop/ImageCarousel";

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
    images: string[] | null;
}

interface Category {
    id: string;
    name: string;
    image_url?: string;
}

// Category and subcategories are loaded on the server (see page.tsx)
export default function CategoryClient({ category, subcategories }: { category: Category; subcategories: Subcategory[] }) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header de categoría */}
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '1rem'
                        }}>
                            {category.name}
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.125rem' }}>
                            {subcategories.length} {subcategories.length === 1 ? 'subcategoría' : 'subcategorías'} disponibles
                        </p>
                    </div>

                    {/* Grid de subcategorías */}
                    {subcategories.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: '#fafafa',
                            borderRadius: '20px',
                            border: '2px dashed #e0e0e0'
                        }}>
                            <p style={{ fontSize: '1.125rem', color: '#999' }}>
                                No hay subcategorías disponibles en esta categoría
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {subcategories.map((subcategory) => (
                                <Link
                                    key={subcategory.id}
                                    href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            height: '100%'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                        }}
                                    >
                                        {/* Image Carousel */}
                                        <div style={{
                                            width: '100%',
                                            height: '280px',
                                            overflow: 'hidden'
                                        }}>
                                            <ImageCarousel
                                                images={subcategory.images}
                                                alt={subcategory.name}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '700',
                                                color: '#333',
                                                marginBottom: '0.5rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {subcategory.name}
                                            </h3>

                                            <p style={{
                                                fontSize: '0.875rem',
                                                color: '#ffc0cb',
                                                fontWeight: '600',
                                                marginTop: '1rem'
                                            }}>
                                                Ver productos →
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
