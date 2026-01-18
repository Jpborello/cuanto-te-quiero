"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Power, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("products")
                .update({ active: !product.active }) // Assuming 'active' is the column
                .eq("id", product.id);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Error al cambiar estado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={toggleStatus}
                disabled={loading}
                className={`action-btn ${product.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                title={product.active ? "Desactivar" : "Activar"}
            >
                <Power size={18} />
            </button>
            <Link href={`/admin/products/${product.id}`} className="action-btn edit">
                <Pencil size={18} />
            </Link>
            {/* Delete kept as secondary option or removed if 'deactivate' is preferred */}
        </div>
    );
}
