"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
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

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryAndSubcategories();
    }, [slug]);

    const fetchCategoryAndSubcategories = async () => {
        try {
            // Convertir slug a nombre de categoría
            const categoryName = slug
                .split('-')
                .map(word => word.toUpperCase())
                .join(' ');

            // Buscar categoría con match exacto
            const { data: categoryData, error: categoryError } = await supabase
                .from("categories")
                .select("*")
                .eq("name", categoryName)
                .single();

            if (categoryError) throw categoryError;
            setCategory(categoryData);

            // Buscar subcategorías de esta categoría
            const { data: subcategoriesData, error: subcategoriesError } = await supabase
                .from("subcategories")
                .select("*")
                .eq("category_id", categoryData.id)
                .order("name", { ascending: true });

            if (subcategoriesError) throw subcategoriesError;

            // Para cada subcategoría, obtener múltiples imágenes para el carousel
            const subcategoriesWithImages = await Promise.all(
                (subcategoriesData || []).map(async (subcategory) => {
                    // Buscar varios productos de esta subcategoría para el carousel
                    const { data: productsData } = await supabase
                        .from("products")
                        .select(`
                            image_url,
                            product_images (
                                image_url
                            )
                        `)
                        .eq("subcategory_id", subcategory.id)
                        .eq("active", true)
                        .limit(4); // Obtener hasta 4 productos

                    // Extraer todas las imágenes disponibles
                    const allImages: string[] = [];

                    productsData?.forEach(product => {
                        // Priority 1: Check image_url field first
                        if (product.image_url) {
                            if (Array.isArray(product.image_url)) {
                                allImages.push(...product.image_url);
                            } else if (typeof product.image_url === 'string') {
                                try {
                                    const parsed = JSON.parse(product.image_url);
                                    if (Array.isArray(parsed)) {
                                        allImages.push(...parsed);
                                    } else {
                                        allImages.push(product.image_url);
                                    }
                                } catch {
                                    allImages.push(product.image_url);
                                }
                            }
                        }

                        // Priority 2: Fallback to product_images table
                        if (product.product_images && product.product_images.length > 0) {
                            allImages.push(...product.product_images.map((img: any) => img.image_url));
                        }
                    });

                    // Limitar a 4 imágenes máximo y eliminar duplicados
                    const uniqueImages = [...new Set(allImages)].slice(0, 4);

                    return {
                        ...subcategory,
                        images: uniqueImages.length > 0 ? uniqueImages : null
                    };
                })
            );


            // Define custom order for Muebles Infantiles
            const customOrder = [
                "CUNAS",
                "CUNAS COLECHO",
                "CUNAS FUNCIONALES", // Assuming this might exist or user wants it
                "CAJONERAS",
                "ROPEROS Y PLACARES",
                "MONTESSORI",
                "CAMAS DE 1 PLAZA Y NIDO",
                "CUCHETAS - RINCONERAS - PUENTE",
                "ESCRITORIOS"
            ];

            // Sort subcategories based on custom order
            const sortedSubcategories = subcategoriesWithImages.sort((a, b) => {
                // Normalize names for comparison (remove extra spaces, uppercase)
                const nameA = a.name.trim().toUpperCase();
                const nameB = b.name.trim().toUpperCase();

                const indexA = customOrder.indexOf(nameA);
                const indexB = customOrder.indexOf(nameB);

                // If both are in the list, sort by index
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }

                // If only A is in list, it comes first
                if (indexA !== -1) return -1;

                // If only B is in list, it comes first
                if (indexB !== -1) return 1;

                // If neither, sort alphabetically
                return nameA.localeCompare(nameB);
            });

            setSubcategories(sortedSubcategories);
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <p>Cargando...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!category) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
                            Categoría no encontrada
                        </h1>
                        <p style={{ color: '#666' }}>
                            La categoría que buscas no existe.
                        </p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

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
                                    href={`/categoria/${slug}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
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
