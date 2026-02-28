"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart, Package } from "lucide-react";

interface Product {
    uid: string;
    product_id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
    active: boolean;
    categories?: { name: string };
    subcategories?: { name: string; id: string };
    images: string[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProductAndRelated();
    }, [slug]);

    const fetchProductAndRelated = async () => {
        try {
            // Check if slug is UUID
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

            // Fetch main product
            let query = supabase
                .from("products")
                .select(`
                    *,
                    categories (name),
                    subcategories (name, id),
                    product_images (image_url)
                `)
                .eq(isUuid ? "uid" : "code", slug)
                .eq("active", true);

            let productData;
            let productError;

            if (isUuid) {
                const { data, error } = await query.single();
                productData = data;
                productError = error;
            } else {
                const { data, error } = await query.limit(1);
                productData = data?.[0];
                productError = error;
                // If data is empty array, trigger not found error
                if (!productData && !error) {
                    productError = new Error("Product not found");
                }
            }

            if (productError) throw productError;

            // Transform images
            let images: string[] = [];
            if (productData.image_url) {
                if (Array.isArray(productData.image_url)) {
                    images = productData.image_url;
                } else if (typeof productData.image_url === 'string') {
                    try {
                        const parsed = JSON.parse(productData.image_url);
                        images = Array.isArray(parsed) ? parsed : [productData.image_url];
                    } catch {
                        images = [productData.image_url];
                    }
                }
            }
            if (images.length === 0 && productData.product_images && productData.product_images.length > 0) {
                images = productData.product_images.map((img: any) => img.image_url);
            }

            const transformedProduct = {
                ...productData,
                images
            };

            setProduct(transformedProduct);

            // Fetch related products from same subcategory
            if (productData.subcategories?.id) {
                const { data: relatedData } = await supabase
                    .from("products")
                    .select("*")
                    .eq("subcategory_id", productData.subcategories.id)
                    .eq("active", true)
                    .neq("code", slug)
                    .limit(4);

                if (relatedData) {
                    const transformedRelated = relatedData.map(p => {
                        let imgs: string[] = [];
                        if (p.image_url) {
                            if (Array.isArray(p.image_url)) {
                                imgs = p.image_url;
                            } else if (typeof p.image_url === 'string') {
                                try {
                                    const parsed = JSON.parse(p.image_url);
                                    imgs = Array.isArray(parsed) ? parsed : [p.image_url];
                                } catch {
                                    imgs = [p.image_url];
                                }
                            }
                        }
                        return { ...p, images: imgs };
                    });
                    setRelatedProducts(transformedRelated);
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <p>Cargando producto...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Package size={80} style={{ color: '#ccc', margin: '0 auto 2rem' }} />
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
                            Producto no encontrado
                        </h1>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>
                            El producto que buscas no existe o no está disponible.
                        </p>
                        <Link href="/" style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            backgroundColor: '#ffc0cb',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '600'
                        }}>
                            Volver al inicio
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Breadcrumb */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                        color: '#666'
                    }}>
                        <Link href="/" style={{ color: '#ffc0cb', textDecoration: 'none' }}>Inicio</Link>
                        <ChevronRight size={16} />
                        <Link href={`/categoria/${product.categories?.name.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: '#ffc0cb', textDecoration: 'none' }}>
                            {product.categories?.name || 'Categoría'}
                        </Link>
                        {product.subcategories && (
                            <>
                                <ChevronRight size={16} />
                                <span>{product.subcategories.name}</span>
                            </>
                        )}
                        <ChevronRight size={16} />
                        <span style={{ color: '#999' }}>{product.code}</span>
                    </div>

                    {/* Product Content */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '4rem',
                        marginBottom: '4rem'
                    }}>
                        {/* Left: Gallery */}
                        <div>
                            <ProductGallery images={product.images} productName={product.name} />
                        </div>

                        {/* Right: Product Info */}
                        <div>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '0.5rem'
                            }}>
                                {product.name}
                            </h1>

                            <p style={{
                                fontSize: '0.875rem',
                                color: '#999',
                                marginBottom: '2rem'
                            }}>
                                Código: {product.code}
                            </p>

                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#ffc0cb',
                                marginBottom: '1.5rem'
                            }}>
                                ${product.price.toLocaleString('es-AR')}
                            </div>

                            {/* Stock Badge */}
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    backgroundColor: product.stock > 0 ? '#e8f5e9' : '#ffebee',
                                    color: product.stock > 0 ? '#4caf50' : '#f44336'
                                }}>
                                    {product.stock > 0 ? `✓ En stock (${product.stock} disponibles)` : '✕ Sin stock'}
                                </span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: '0.75rem'
                                    }}>
                                        Descripción
                                    </h3>
                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#666',
                                        lineHeight: '1.6'
                                    }}>
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '0.5rem'
                                }}>
                                    Cantidad
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            style={{
                                                padding: '0.75rem',
                                                backgroundColor: 'white',
                                                border: 'none',
                                                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                                                opacity: quantity <= 1 ? 0.5 : 1
                                            }}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span style={{
                                            padding: '0 1.5rem',
                                            fontSize: '1.125rem',
                                            fontWeight: '600'
                                        }}>
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                            style={{
                                                padding: '0.75rem',
                                                backgroundColor: 'white',
                                                border: 'none',
                                                cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                                opacity: quantity >= product.stock ? 0.5 : 1
                                            }}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                disabled={product.stock === 0}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: product.stock === 0 ? '#ccc' : '#ffc0cb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.backgroundColor = '#ff6b9d';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.backgroundColor = '#ffc0cb';
                                    }
                                }}
                            >
                                <ShoppingCart size={24} />
                                {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                            </button>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '2rem'
                            }}>
                                Productos Relacionados
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.uid}
                                        href={`/producto/${relatedProduct.uid}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
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
                                            <div style={{
                                                width: '100%',
                                                height: '200px',
                                                backgroundColor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative', // Needed for watermark
                                                overflow: 'hidden'
                                            }}>
                                                {relatedProduct.images && relatedProduct.images.length > 0 ? (
                                                    <>
                                                        <img
                                                            src={relatedProduct.images[0]}
                                                            alt={relatedProduct.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        {/* Watermark */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%) rotate(-30deg)',
                                                            fontFamily: 'var(--font-bubblegum)',
                                                            color: 'rgba(120, 80, 50, 0.15)', // Brown with low opacity
                                                            fontSize: '2rem', // Slightly smaller for related products
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
                                                    <Package size={60} style={{ color: '#ccc' }} />
                                                )}
                                            </div>
                                            <div style={{ padding: '1rem' }}>
                                                <h3 style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    marginBottom: '0.5rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {relatedProduct.name}
                                                </h3>
                                                <div style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 'bold',
                                                    color: '#ffc0cb'
                                                }}>
                                                    ${relatedProduct.price.toLocaleString('es-AR')}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
