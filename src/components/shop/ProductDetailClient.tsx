"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart, Package } from "lucide-react";
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
    active: boolean;
    categories?: { name: string };
    subcategories?: { name: string; id: string };
    images: string[];
}

export default function ProductDetailClient({ slug }: { slug: string }) {
    const router = useRouter();
    const { settings } = useStoreSettings();

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
                        flexWrap: 'wrap',
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
                    <div className="product-detail-grid">
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

                             {settings.prices_enabled && (
                                 product.price > 0 ? (
                                     <div style={{
                                         fontSize: '2.5rem',
                                         fontWeight: 'bold',
                                         color: '#ffc0cb',
                                         marginBottom: '1.5rem'
                                     }}>
                                         ${product.price.toLocaleString('es-AR')}
                                     </div>
                                 ) : (
                                     <div style={{
                                         fontSize: '2.4rem',
                                         fontWeight: 'bold',
                                         fontFamily: 'var(--font-bubblegum)',
                                         background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                                         WebkitBackgroundClip: 'text',
                                         WebkitTextFillColor: 'transparent',
                                         backgroundClip: 'text',
                                         marginBottom: '1.5rem',
                                         letterSpacing: '0.5px'
                                     }}>
                                         Disponible
                                     </div>
                                 )
                             )}

                            {/* Stock Badge */}
                            {settings.prices_enabled && (
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
                            )}

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

                             {/* Action Button: Cart or WhatsApp */}
                             {settings.cart_enabled ? (
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
                                         transition: 'all 0.2s ease',
                                         boxShadow: product.stock > 0 ? '0 4px 12px rgba(255,107,157,0.3)' : 'none'
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
                             ) : (
                                 <button
                                     onClick={() => {
                                         if (product.stock > 0) {
                                             const message = `Hola! Me gustaría consultar por ${quantity > 1 ? `${quantity} unidades de` : 'el producto'}: ${product.name}${product.code ? ` (Código: ${product.code})` : ''}.\nLink: ${window.location.href}`;
                                             const whatsappUrl = `https://wa.me/5493416029814?text=${encodeURIComponent(message)}`;
                                             window.open(whatsappUrl, '_blank');
                                         }
                                     }}
                                     disabled={product.stock === 0}
                                     style={{
                                         width: '100%',
                                         padding: '1rem',
                                         background: product.stock === 0
                                             ? '#ccc'
                                             : 'linear-gradient(135deg, #85e3b2 0%, #5ad897 100%)',
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
                                         transition: 'all 0.2s ease',
                                         boxShadow: product.stock > 0
                                             ? '0 4px 12px rgba(90,216,151,0.3)'
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
                                 >
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                     </svg>
                                     {product.stock > 0 ? 'Consulta por WhatsApp' : 'Sin stock'}
                                 </button>
                             )}
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
                                                aspectRatio: '1 / 1',
                                                backgroundColor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
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
                                                            color: 'rgba(120, 80, 50, 0.15)',
                                                            fontSize: '2rem',
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
                                                     {settings.prices_enabled && (
                                                         relatedProduct.price > 0 ? (
                                                             `$${relatedProduct.price.toLocaleString('es-AR')}`
                                                         ) : (
                                                             <span style={{
                                                                 fontFamily: 'var(--font-bubblegum)',
                                                                 fontSize: '1.15rem',
                                                                 background: 'linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)',
                                                                 WebkitBackgroundClip: 'text',
                                                                 WebkitTextFillColor: 'transparent',
                                                                 backgroundClip: 'text'
                                                             }}>
                                                                 Disponible
                                                             </span>
                                                         )
                                                     )}
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
