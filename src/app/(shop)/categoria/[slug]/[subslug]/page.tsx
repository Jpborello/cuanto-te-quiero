"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { ShoppingCart, Search, X } from "lucide-react";
import Link from "next/link";
import AutoRotatingImage from "@/components/shop/AutoRotatingImage";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
    images: string[];
    active: boolean;
}

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
}

export default function SubcategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const subslug = params.subslug as string;

    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const { settings } = useStoreSettings();

    useEffect(() => {
        fetchSubcategoryAndProducts();
    }, [subslug]);

    const fetchSubcategoryAndProducts = async () => {
        try {
            console.log('[DEBUG] Starting fetchSubcategoryAndProducts');
            console.log('[DEBUG] slug:', slug);
            console.log('[DEBUG] subslug:', subslug);

            // 1. Helper to aggressively normalize any string for robust comparison
            const normalizeString = (str: string) => {
                if (!str) return '';
                // First decode URI component in case it's encoded
                try { str = decodeURIComponent(str); } catch (e) {}
                
                return str.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                    .replace(/ñ/g, 'n') // handle ñ
                    .replace(/[^a-z0-9]/g, ''); // remove all non-alphanumeric (spaces, hyphens, etc)
            };

            // 2. Fetch Category first
            const { data: allCategories, error: catError } = await supabase
                .from("categories")
                .select("*");

            if (catError) throw catError;

            // Find matching category by normalizing both sides
            const normalizedSlug = normalizeString(slug);
            const categoryData = allCategories.find(c => normalizeString(c.name) === normalizedSlug);

            if (!categoryData) {
                console.error("Category not found for slug:", slug, "Normalized:", normalizedSlug);
                throw new Error("Category not found");
            }

            // 3. Fetch all subcategories for this category
            const { data: allSubcats, error: subError } = await supabase
                .from("subcategories")
                .select("*")
                .eq("category_id", categoryData.id);

            if (subError) throw subError;

            // 4. Find matching subcategory by robust normalization
            const normalizedSubslug = normalizeString(subslug);
            const subcategoryData = allSubcats.find(s => normalizeString(s.name) === normalizedSubslug);

            if (!subcategoryData) {
                console.error("Subcategory not found for subslug:", subslug, "Normalized:", normalizedSubslug);
                console.error("Available subcategories:", allSubcats.map(s => s.name));
                // Fallback: try direct name match if slug fails (legacy behavior expectation?)
                throw new Error("Subcategory not found");
            }

            console.log('[DEBUG] Found subcategory:', subcategoryData);
            setSubcategory(subcategoryData);

            console.log('[DEBUG] Found subcategory:', subcategoryData);

            // Buscar productos de esta subcategoría CON sus imágenes
            const { data: productsData, error: productsError } = await supabase
                .from("products")
                .select(`
                    *,
                    product_images (
                        image_url
                    )
                `)
                .eq("subcategory_id", subcategoryData.id)
                .eq("active", true)
                .order("sort_order", { ascending: true, nullsFirst: false })
                .order("code", { ascending: true });

            console.log('[DEBUG] Products query result:', { productsData, productsError });

            if (productsError) throw productsError;

            // Transform product_images array into image_url array
            const transformedProducts = (productsData || []).map(product => {
                let images = [];

                // Priority 1: Check image_url field first (this is where images actually are)
                if (product.image_url) {
                    // Check if it's already an array or needs to be wrapped
                    if (Array.isArray(product.image_url)) {
                        images = product.image_url;
                    } else if (typeof product.image_url === 'string') {
                        // Try to parse as JSON array, or use as single URL
                        try {
                            const parsed = JSON.parse(product.image_url);
                            images = Array.isArray(parsed) ? parsed : [product.image_url];
                        } catch {
                            images = [product.image_url];
                        }
                    }
                }

                // Priority 2: Fallback to product_images table (currently empty)
                if (images.length === 0 && product.product_images && product.product_images.length > 0) {
                    images = product.product_images.map((img: any) => img.image_url);
                }

                return {
                    ...product,
                    images
                };
            });

            console.log('[DEBUG] Transformed products:', transformedProducts);

            setProducts(transformedProducts);
        } catch (error) {
            console.error("[ERROR] Error fetching subcategory:", error);
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

    if (!subcategory) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
                            Subcategoría no encontrada
                        </h1>
                        <p style={{ color: '#666' }}>
                            La subcategoría que buscas no existe.
                        </p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const filteredProducts = filterText.trim().length >= 1
        ? products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
        : products;

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header de subcategoría */}
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {subcategory.name}
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.125rem' }}>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
                        </p>
                    </div>

                    {/* Barra de filtro */}
                    {products.length > 4 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
                                <input
                                    type="text"
                                    placeholder="Filtrar dentro de esta categoría..."
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 2.8rem 0.75rem 2.8rem',
                                        border: '1.5px solid #ffc0cb',
                                        borderRadius: '50px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(255,192,203,0.2)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <Search size={16} style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#ffc0cb',
                                    pointerEvents: 'none'
                                }} />
                                {filterText && (
                                    <X
                                        size={15}
                                        onClick={() => setFilterText('')}
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
                        </div>
                    )}

                    {/* Grid de productos */}
                    {filteredProducts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: '#fafafa',
                            borderRadius: '20px',
                            border: '2px dashed #e0e0e0'
                        }}>
                            <p style={{ fontSize: '1.125rem', color: '#999' }}>
                                No hay productos disponibles en esta subcategoría
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.uid}
                                    href={`/producto/${product.uid}`}
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
                                            height: '100%', // Enforce full height
                                            display: 'flex', // Enable flex layout
                                            flexDirection: 'column' // Stack children vertically
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
                                        {/* Image */}
                                        <div style={{
                                            width: '100%',
                                            aspectRatio: '1 / 1',
                                            backgroundColor: '#fafafa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            position: 'relative' // Needed for absolute positioning
                                        }}>
                                            {product.images && product.images.length > 0 ? (
                                                <>
                                                    <AutoRotatingImage
                                                        images={product.images}
                                                        alt={product.name}
                                                        interval={3000 + (Math.random() * 2000)}
                                                    />
                                                    {/* Watermark */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%) rotate(-30deg)',
                                                        fontFamily: 'var(--font-bubblegum)',
                                                        color: 'rgba(120, 80, 50, 0.15)', // Brown with low opacity
                                                        fontSize: '2.5rem',
                                                        textAlign: 'center',
                                                        pointerEvents: 'none',
                                                        lineHeight: '0.9',
                                                        whiteSpace: 'nowrap',
                                                        zIndex: 10,
                                                        width: '100%'
                                                    }}>
                                                        Cuanto te<br />Quiero
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ color: '#ccc', fontSize: '4rem' }}>
                                                    📦
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{
                                            padding: '1rem',
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: '0.5rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {product.name}
                                            </h3>

                                            {/* Price and Stock */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '1rem'
                                            }}>
                                                <div>
                                                    {settings.prices_enabled && (
                                                        product.price > 0 ? (
                                                            <span style={{
                                                                fontSize: '1.5rem',
                                                                fontWeight: 'bold',
                                                                color: '#ffc0cb'
                                                            }}>
                                                                ${product.price.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span style={{
                                                                fontSize: '1.35rem',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'var(--font-bubblegum)',
                                                                background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                backgroundClip: 'text',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                Disponible
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: product.stock > 0 ? '#4caf50' : '#f44336',
                                                    fontWeight: '500'
                                                }}>
                                                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                                                </div>
                                            </div>

                                            {/* Action Button: Cart or WhatsApp */}
                                            {settings.cart_enabled ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        background: product.stock > 0
                                                            ? 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)'
                                                            : '#e0e0e0',
                                                        color: product.stock > 0 ? 'white' : '#999',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '700',
                                                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        transition: 'all 0.3s ease',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        boxShadow: product.stock > 0
                                                            ? '0 4px 12px rgba(255,107,157,0.3)'
                                                            : 'none'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (product.stock > 0) {
                                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ff4081 0%, #ff6b9d 100%)';
                                                        }
                                                    }}
                                                    onMouseOut={(e) => {
                                                        if (product.stock > 0) {
                                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)';
                                                        }
                                                    }}
                                                    disabled={product.stock === 0}
                                                >
                                                    <ShoppingCart size={16} />
                                                    {product.stock > 0 ? 'Agregar' : 'Sin stock'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (product.stock > 0) {
                                                            const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';
                                                            const absoluteImageUrl = firstImage ? (firstImage.startsWith('http') ? firstImage : `${window.location.origin}${firstImage}`) : '';
                                                            const message = `Hola! Me gustaría consultar por el producto: ${product.name}${product.code ? ` (Código: ${product.code})` : ''}.\nLink: ${window.location.origin}/producto/${product.uid}${absoluteImageUrl ? `\nImagen: ${absoluteImageUrl}` : ''}`;
                                                            const whatsappUrl = `https://wa.me/5493416029814?text=${encodeURIComponent(message)}`;
                                                            window.open(whatsappUrl, '_blank');
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        background: product.stock > 0
                                                            ? 'linear-gradient(135deg, #85e3b2 0%, #5ad897 100%)'
                                                            : '#e0e0e0',
                                                        color: product.stock > 0 ? 'white' : '#999',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: product.stock > 0
                                                            ? '0 4px 12px rgba(90,216,151,0.2)'
                                                            : 'none'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (product.stock > 0) {
                                                            e.currentTarget.style.background = 'linear-gradient(135deg, #5ad897 0%, #3acb7e 100%)';
                                                        }
                                                    }}
                                                    onMouseOut={(e) => {
                                                        if (product.stock > 0) {
                                                            e.currentTarget.style.background = 'linear-gradient(135deg, #85e3b2 0%, #5ad897 100%)';
                                                        }
                                                    }}
                                                    disabled={product.stock === 0}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                                    </svg>
                                                    {product.stock > 0 ? 'Consulta WhatsApp' : 'Sin stock'}
                                                </button>
                                            )}
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
