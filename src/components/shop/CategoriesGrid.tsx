"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Baby, Heart, Gift, ShoppingBag, Bed, Car } from "lucide-react";

interface Category {
    id: string;
    name: string;
    image_url: string | null;
}

// Mapeo de iconos y colores por categoría
const categoryStyles: Record<string, { icon: any; gradient: string; description: string }> = {
    "MUEBLES INFANTILES Y JUVENILES": {
        icon: Bed,
        gradient: "linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)",
        description: "Todo para el cuarto de tu bebé"
    },
    "COCHES Y RODADOS": {
        icon: Car,
        gradient: "linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)",
        description: "Movilidad y paseos"
    },
    "ACCESORIOS PARA BEBES": {
        icon: Baby,
        gradient: "linear-gradient(135deg, #add8e6 0%, #87ceeb 100%)",
        description: "Todo lo que necesitás"
    },
    "BLANQUERIA Y COLCHONES": {
        icon: Bed,
        gradient: "linear-gradient(135deg, #fff8dc 0%, #ffeaa7 100%)",
        description: "Confort y descanso"
    },
    "FUTURA MAMA": {
        icon: Heart,
        gradient: "linear-gradient(135deg, #ffc0cb 0%, #ff9eb5 100%)",
        description: "Acompañamos tu embarazo"
    },
    "INDUMENTARIA": {
        icon: ShoppingBag,
        gradient: "linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)",
        description: "Moda para bebés y niños"
    }
};

export default function CategoriesGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;

            // Filtrar la categoría "General" si existe
            const filteredCategories = (data || []).filter(cat => cat.name !== "General");
            setCategories(filteredCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#999'
            }}>
                <p>Cargando categorías...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
        }}>
            {categories.map((category) => {
                const style = categoryStyles[category.name] || {
                    icon: ShoppingBag,
                    gradient: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                    description: "Productos seleccionados"
                };

                const Icon = style.icon;

                // Crear slug para la URL
                const slug = category.name.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[áàäâ]/g, 'a')
                    .replace(/[éèëê]/g, 'e')
                    .replace(/[íìïî]/g, 'i')
                    .replace(/[óòöô]/g, 'o')
                    .replace(/[úùüû]/g, 'u')
                    .replace(/ñ/g, 'n');

                return (
                    <Link
                        key={category.id}
                        href={`/categoria/${slug}`}
                        style={{
                            position: 'relative',
                            height: '300px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            textDecoration: 'none',
                            background: style.gradient,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '2rem'
                        }}>
                            <Icon size={40} style={{ color: 'white', marginBottom: '1rem' }} />
                            <h4 style={{
                                color: 'white',
                                fontSize: '1.75rem',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                textTransform: 'capitalize'
                            }}>
                                {category.name}
                            </h4>
                            <p style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '0.875rem'
                            }}>
                                {style.description}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
