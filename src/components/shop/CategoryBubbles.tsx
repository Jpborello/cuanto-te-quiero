"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface BubbleData {
    id: string;
    name: string;
    slug: string; // subcategory slug
    parentSlug: string; // category slug
    image_url: string | null;
    color: string;
}

const TARGET_SUBCATEGORIES = [
    { name: "ROPEROS Y PLACARES", color: "#E0F7FA", label: "Roperos" }, // Celeste
    { name: "CAJONERAS", color: "#FCE4EC", label: "Cajoneras" },          // Rosa
    { name: "CUNAS", color: "#FFF9C4", label: "Cunas" }               // Amarillo
];

export default function CategoryBubbles() {
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.all(
                    TARGET_SUBCATEGORIES.map(async (target) => {
                        // 1. Find subcategory and its parent
                        const { data: subcatData, error: subcatError } = await supabase
                            .from("subcategories")
                            .select("id, name, category_id")
                            .ilike("name", target.name)
                            .maybeSingle();

                        if (subcatError || !subcatData) {
                            console.warn(`Subcategory not found: ${target.name}`, subcatError);
                            return null;
                        }

                        // 2. Find parent category
                        const { data: catData } = await supabase
                            .from("categories")
                            .select("name")
                            .eq("id", subcatData.category_id)
                            .single();

                        if (!catData) return null;

                        // 3. Find one representative image (product)
                        const { data: productData } = await supabase
                            .from("products")
                            .select("image_url")
                            .eq("subcategory_id", subcatData.id)
                            .eq("active", true)
                            .not("image_url", "is", null)
                            .limit(1);

                        let imageUrl = null;
                        if (productData && productData.length > 0) {
                            const rawUrl = productData[0].image_url;
                            if (Array.isArray(rawUrl)) imageUrl = rawUrl[0];
                            else if (typeof rawUrl === "string") {
                                try {
                                    const parsed = JSON.parse(rawUrl);
                                    imageUrl = Array.isArray(parsed) ? parsed[0] : rawUrl;
                                } catch {
                                    imageUrl = rawUrl;
                                }
                            }
                        }

                        return {
                            id: subcatData.id,
                            name: target.label, // Use friendly label
                            slug: subcatData.name.toLowerCase().replace(/\s+/g, '-'),
                            parentSlug: catData.name.toLowerCase().replace(/\s+/g, '-'),
                            image_url: imageUrl,
                            color: target.color
                        };
                    })
                );

                setBubbles(results.filter((b): b is BubbleData => b !== null));
            } catch (error) {
                console.error("Error fetching bubbles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <section style={{ marginBottom: "4rem" }}>
            <h3 className="section-title" style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '2.5rem',
                color: '#333'
            }}>
                Categorías Populares
            </h3>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap"
            }}>
                {bubbles.map((bubble) => (
                    <Link
                        key={bubble.id}
                        href={`/categoria/${bubble.parentSlug}/${bubble.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1rem",
                            cursor: "pointer",
                            transition: "transform 0.3s ease"
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            {/* Bubble Circle */}
                            <div style={{
                                width: "160px",
                                height: "160px",
                                borderRadius: "50%",
                                backgroundColor: bubble.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                border: "4px solid white"
                            }}>
                                {bubble.image_url ? (
                                    <img
                                        src={bubble.image_url}
                                        alt={bubble.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <ImageIcon size={48} color="#999" opacity={0.5} />
                                )}
                            </div>

                            {/* Label */}
                            <span style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#555",
                                textAlign: "center"
                            }}>
                                {bubble.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
