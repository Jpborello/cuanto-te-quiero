"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus, Power, Save, Trash2, FolderOpen, Tag, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    active: boolean;
}

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
    active: boolean;
}

interface CategoryManagerProps {
    initialCategories: Category[];
    initialSubcategories: Subcategory[];
}

export default function CategoryManager({ initialCategories, initialSubcategories }: CategoryManagerProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);

    // UI State
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [creatingSubFor, setCreatingSubFor] = useState<string | null>(null);
    const [newSubName, setNewSubName] = useState("");

    const [loading, setLoading] = useState(false);

    const toggleExpand = (catId: string) => {
        const newSet = new Set(expandedCategories);
        if (newSet.has(catId)) {
            newSet.delete(catId);
        } else {
            newSet.add(catId);
        }
        setExpandedCategories(newSet);
    };

    // --- Actions ---

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("categories")
                .insert({ name: newCategoryName, active: true })
                .select()
                .single();

            if (error) throw error;

            setCategories([...categories, data]);
            setNewCategoryName("");
            setCreatingCategory(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Error al crear categoría");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubcategory = async (categoryId: string) => {
        if (!newSubName.trim()) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("subcategories")
                .insert({ name: newSubName, category_id: categoryId, active: true })
                .select()
                .single();

            if (error) throw error;

            setSubcategories([...subcategories, data]);
            setNewSubName("");
            setCreatingSubFor(null);

            // Auto expand parent
            if (!expandedCategories.has(categoryId)) {
                toggleExpand(categoryId);
            }
            router.refresh();
        } catch (error) {
            console.error("Error creating subcategory:", error);
            alert("Error al crear subcategoría");
        } finally {
            setLoading(false);
        }
    };

    const toggleCategoryStatus = async (cat: Category) => {
        try {
            const { error } = await supabase
                .from("categories")
                .update({ active: !cat.active })
                .eq("id", cat.id);

            if (error) throw error;

            setCategories(categories.map(c =>
                c.id === cat.id ? { ...c, active: !c.active } : c
            ));
            router.refresh();
        } catch (error) {
            alert("Error al actualizar estado");
        }
    };

    const toggleSubcategoryStatus = async (sub: Subcategory) => {
        try {
            const { error } = await supabase
                .from("subcategories")
                .update({ active: !sub.active })
                .eq("id", sub.id);

            if (error) throw error;

            setSubcategories(subcategories.map(s =>
                s.id === sub.id ? { ...s, active: !s.active } : s
            ));
            router.refresh();
        } catch (error) {
            alert("Error al actualizar estado");
        }
    };

    return (
        <div className="space-y-6">
            {/* Create Category Button/Form */}
            <div className="flex justify-end">
                {creatingCategory ? (
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm animate-in fade-in slide-in-from-right-4">
                        <input
                            autoFocus
                            type="text"
                            className="bg-transparent outline-none px-2 text-sm w-48"
                            placeholder="Nombre categoría..."
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                        />
                        <button
                            onClick={handleCreateCategory}
                            disabled={loading}
                            className="p-1.5 bg-[var(--admin-accent)] text-white rounded hover:bg-[var(--admin-accent-hover)]"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        </button>
                        <button
                            onClick={() => setCreatingCategory(false)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setCreatingCategory(true)}
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        Nueva Categoría
                    </button>
                )}
            </div>

            {/* List */}
            <div className="grid gap-4">
                {categories.length === 0 && (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                        <FolderOpen size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No hay categorías creadas</p>
                    </div>
                )}

                {categories.map(cat => {
                    const catSubs = subcategories.filter(s => s.category_id === cat.id);
                    const isExpanded = expandedCategories.has(cat.id);

                    return (
                        <div key={cat.id} className={`admin-card p-0 overflow-hidden border transition-shadow ${!cat.active ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'}`}>
                            {/* Category Header */}
                            <div className="p-4 flex items-center gap-3">
                                <button
                                    onClick={() => toggleExpand(cat.id)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-transform"
                                >
                                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold text-lg ${!cat.active && 'text-gray-500 line-through decoration-gray-400'}`}>
                                            {cat.name}
                                        </h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {cat.active ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{catSubs.length} subcategorías</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCreatingSubFor(cat.id)}
                                        className="p-2 text-[var(--admin-accent)] hover:bg-indigo-50 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={16} />
                                        <span className="hidden sm:inline">Subcategoría</span>
                                    </button>
                                    <button
                                        onClick={() => toggleCategoryStatus(cat)}
                                        className={`p-2 rounded-lg transition-colors ${cat.active ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                        title={cat.active ? "Desactivar" : "Activar"}
                                    >
                                        <Power size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Subcategories (Expandable) */}
                            {isExpanded && (
                                <div className="bg-slate-50 border-t border-gray-100 p-2 sm:p-4 space-y-2">
                                    {/* New Sub Form */}
                                    {creatingSubFor === cat.id && (
                                        <div className="flex items-center gap-2 bg-white p-3 rounded-lg border shadow-sm mb-3 ml-8 animate-in slide-in-from-top-2">
                                            <div className="w-6 border-l-2 border-b-2 border-gray-200 h-full absolute -left-4 top-0 rounded-bl-lg"></div>
                                            <Tag size={16} className="text-gray-400" />
                                            <input
                                                autoFocus
                                                type="text"
                                                className="bg-transparent outline-none px-2 text-sm w-full"
                                                placeholder="Nombre subcategoría..."
                                                value={newSubName}
                                                onChange={e => setNewSubName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleCreateSubcategory(cat.id)}
                                            />
                                            <button
                                                onClick={() => handleCreateSubcategory(cat.id)}
                                                disabled={loading}
                                                className="p-1.5 bg-[var(--admin-accent)] text-white rounded hover:bg-[var(--admin-accent-hover)]"
                                            >
                                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            </button>
                                            <button
                                                onClick={() => setCreatingSubFor(null)}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {catSubs.length === 0 && !creatingSubFor && (
                                        <p className="text-xs text-gray-400 ml-10 italic">Sin subcategorías.</p>
                                    )}

                                    {catSubs.map(sub => (
                                        <div key={sub.id} className="group flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 ml-4 sm:ml-8 hover:border-[var(--admin-accent)] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[var(--admin-accent)] transition-colors"></div>
                                                <span className={`text-sm font-medium ${!sub.active && 'text-gray-400 line-through'}`}>{sub.name}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSubcategoryStatus(sub)}
                                                className={`p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${sub.active ? 'text-gray-300 hover:text-red-500' : 'text-green-500 opacity-100'}`}
                                                title={sub.active ? "Desactivar" : "Activar"}
                                            >
                                                <Power size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Helper component for icon
function X({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" /><path d="m6 6 18 18" />
        </svg>
    )
}
