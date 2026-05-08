"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import AutoRotatingImage from "@/components/shop/AutoRotatingImage";
import Link from "next/link";
import { Search } from "lucide-react";

interface Product {
    uid: string;
    name: string;
    price: number;
    stock: number;
    image_url: string | null;
    images: string[];
    code: string;
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setProducts([]);
            return;
        }
        fetchResults(query.trim());
    }, [query]);

    const fetchResults = async (q: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("uid, name, price, stock, image_url, code")
                .ilike("name", `%${q}%`)
                .eq("active", true)
                .order("name", { ascending: true })
                .limit(60);

            if (error) throw error;

            const transformed = (data || []).map((p) => {
                let images: string[] = [];
                if (p.image_url) {
                    if (Array.isArray(p.image_url)) {
                        images = p.image_url;
                    } else if (typeof p.image_url === "string") {
                        try {
                            const parsed = JSON.parse(p.image_url);
                            images = Array.isArray(parsed) ? parsed : [p.image_url];
                        } catch {
                            images = [p.image_url];
                        }
                    }
                }
                return { ...p, images };
            });

            setProducts(transformed);
        } catch (err) {
            console.error("Error searching:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: "100vh", padding: "3rem 2rem" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Título */}
                <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        backgroundColor: "#fff0f5",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "50px",
                        marginBottom: "1rem"
                    }}>
                        <Search size={20} color="#ffc0cb" />
                        <span style={{ color: "#888", fontSize: "0.95rem" }}>Resultados para</span>
                    </div>
                    <h1 style={{
                        fontSize: "2.2rem",
                        fontWeight: "800",
                        color: "#333",
                        margin: "0 0 0.5rem"
                    }}>
                        &ldquo;{query}&rdquo;
                    </h1>
                    {!loading && (
                        <p style={{ color: "#888", fontSize: "1rem" }}>
                            {products.length === 0
                                ? "No se encontraron productos"
                                : `${products.length} producto${products.length !== 1 ? "s" : ""} encontrado${products.length !== 1 ? "s" : ""}`}
                        </p>
                    )}
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                borderRadius: "16px",
                                overflow: "hidden",
                                backgroundColor: "#f5f5f5",
                                animation: "pulse 1.5s ease-in-out infinite"
                            }}>
                                <div style={{ height: "240px", backgroundColor: "#ebebeb" }} />
                                <div style={{ padding: "1rem" }}>
                                    <div style={{ height: "16px", backgroundColor: "#ebebeb", borderRadius: "8px", marginBottom: "8px" }} />
                                    <div style={{ height: "16px", backgroundColor: "#ebebeb", borderRadius: "8px", width: "60%" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sin resultados */}
                {!loading && query.length >= 2 && products.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "5rem 2rem",
                        backgroundColor: "#fafafa",
                        borderRadius: "20px",
                        border: "2px dashed #e0e0e0"
                    }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
                        <h2 style={{ color: "#555", marginBottom: "0.5rem" }}>Sin resultados</h2>
                        <p style={{ color: "#999" }}>
                            No encontramos productos para <strong>&ldquo;{query}&rdquo;</strong>.
                            <br />Probá con otras palabras.
                        </p>
                        <Link href="/" style={{
                            display: "inline-block",
                            marginTop: "1.5rem",
                            padding: "0.75rem 2rem",
                            backgroundColor: "#ffc0cb",
                            color: "white",
                            borderRadius: "50px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "0.9rem"
                        }}>
                            Volver al inicio
                        </Link>
                    </div>
                )}

                {/* Resultados */}
                {!loading && products.length > 0 && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {products.map((product) => (
                            <Link
                                key={product.uid}
                                href={`/producto/${product.uid}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                                    }}
                                >
                                    {/* Imagen */}
                                    <div style={{
                                        width: "100%",
                                        height: "240px",
                                        backgroundColor: "#fafafa",
                                        overflow: "hidden",
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {product.images.length > 0 ? (
                                            <>
                                                <AutoRotatingImage
                                                    images={product.images}
                                                    alt={product.name}
                                                    interval={3500}
                                                />
                                                <div style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%) rotate(-30deg)",
                                                    fontFamily: "var(--font-bubblegum)",
                                                    color: "rgba(120,80,50,0.13)",
                                                    fontSize: "2rem",
                                                    textAlign: "center",
                                                    pointerEvents: "none",
                                                    whiteSpace: "nowrap",
                                                    zIndex: 10
                                                }}>
                                                    Cuanto te<br />Quiero
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ color: "#ccc", fontSize: "3.5rem" }}>📦</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <p style={{
                                            fontSize: "0.85rem",
                                            color: "#aaa",
                                            marginBottom: "0.25rem",
                                            fontWeight: "500"
                                        }}>
                                            Cód. {product.code}
                                        </p>
                                        <h3 style={{
                                            fontSize: "0.95rem",
                                            fontWeight: "600",
                                            color: "#333",
                                            marginBottom: "0.75rem",
                                            lineHeight: "1.4"
                                        }}>
                                            {product.name}
                                        </h3>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#ffc0cb" }}>
                                                {product.price > 0 ? `$${product.price.toLocaleString()}` : "Consultar"}
                                            </span>
                                            <span style={{
                                                fontSize: "0.75rem",
                                                color: product.stock > 0 ? "#4caf50" : "#f44336",
                                                fontWeight: "500"
                                            }}>
                                                {product.stock > 0 ? "En stock" : "Sin stock"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Query demasiado corta */}
                {query.trim().length < 2 && query.length > 0 && (
                    <p style={{ textAlign: "center", color: "#aaa" }}>
                        Escribí al menos 2 caracteres para buscar.
                    </p>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </main>
    );
}

export default function BuscarPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#999" }}>Cargando...</p>
                </main>
            }>
                <SearchResults />
            </Suspense>
            <Footer />
        </>
    );
}
