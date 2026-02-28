"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Power, Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteProduct = async () => {
        if (!window.confirm(`¿Estás seguro que querés ELIMINAR el producto "${product.name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("uid", product.uid);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error al eliminar el producto");
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("products")
                .update({ active: !product.active })
                .eq("uid", product.uid);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Error al cambiar estado");
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async () => {
        setFeaturedLoading(true);
        try {
            const { error } = await supabase
                .from("products")
                .update({ featured: !product.featured })
                .eq("uid", product.uid);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error toggling featured:", error);
            alert("Error al cambiar producto destacado. Asegurate de que la columna 'featured' exista en la tabla.");
        } finally {
            setFeaturedLoading(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={toggleFeatured}
                disabled={featuredLoading}
                className={`action-btn ${product.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-300 hover:bg-gray-100'}`}
                title={product.featured ? "Quitar de destacados" : "Marcar como destacado"}
            >
                <Star size={18} fill={product.featured ? "currentColor" : "none"} />
            </button>
            <button
                onClick={toggleStatus}
                disabled={loading}
                className={`action-btn ${product.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                title={product.active ? "Desactivar" : "Activar"}
            >
                <Power size={18} />
            </button>
            <button
                onClick={deleteProduct}
                disabled={deleteLoading}
                className="action-btn text-red-500 hover:bg-red-50"
                title="Eliminar producto"
            >
                <Trash2 size={18} />
            </button>
            <Link href={`/admin/products/${product.product_id}`} className="action-btn edit" title="Editar">
                <Pencil size={18} />
            </Link>
        </div>
    );
}
