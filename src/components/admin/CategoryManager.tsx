"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus, Power, Save, Trash2, FolderOpen, Tag, Loader2, Pencil } from "lucide-react";

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

// Helper para capitalizar (ej: MUEBLES INFANTILES -> Muebles Infantiles)
const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

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

    // Edit state
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
    const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

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
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName, active: true })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al crear categoría");

            setCategories([...categories, result]);
            setNewCategoryName("");
            setCreatingCategory(false);
            router.refresh();
        } catch (error: any) {
            console.error("Error creating category:", error);
            alert(error.message || "Error al crear categoría");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubcategory = async (categoryId: string) => {
        if (!newSubName.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/subcategories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newSubName, category_id: categoryId, active: true })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al crear subcategoría");

            setSubcategories([...subcategories, result]);
            setNewSubName("");
            setCreatingSubFor(null);

            // Auto expand parent
            if (!expandedCategories.has(categoryId)) {
                toggleExpand(categoryId);
            }
            router.refresh();
        } catch (error: any) {
            console.error("Error creating subcategory:", error);
            alert(error.message || "Error al crear subcategoría");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async (catId: string) => {
        if (!editingCategoryName.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/categories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: catId, name: editingCategoryName })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al actualizar la categoría");

            setCategories(categories.map(c =>
                c.id === catId ? { ...c, name: editingCategoryName } : c
            ));
            setEditingCategoryId(null);
            router.refresh();
        } catch (error: any) {
            console.error("Error updating category:", error);
            alert(error.message || "Error al actualizar la categoría");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubcategory = async (subId: string) => {
        if (!editingSubcategoryName.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/subcategories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: subId, name: editingSubcategoryName })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al actualizar la subcategoría");

            setSubcategories(subcategories.map(s =>
                s.id === subId ? { ...s, name: editingSubcategoryName } : s
            ));
            setEditingSubcategoryId(null);
            router.refresh();
        } catch (error: any) {
            console.error("Error updating subcategory:", error);
            alert(error.message || "Error al actualizar la subcategoría");
        } finally {
            setLoading(false);
        }
    };

    const toggleCategoryStatus = async (cat: Category) => {
        try {
            const response = await fetch("/api/categories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: cat.id, active: !cat.active })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al actualizar estado");

            setCategories(categories.map(c =>
                c.id === cat.id ? { ...c, active: !c.active } : c
            ));
            router.refresh();
        } catch (error: any) {
            alert(error.message || "Error al actualizar estado");
        }
    };

    const toggleSubcategoryStatus = async (sub: Subcategory) => {
        try {
            const response = await fetch("/api/subcategories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: sub.id, active: !sub.active })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al actualizar estado");

            setSubcategories(subcategories.map(s =>
                s.id === sub.id ? { ...s, active: !s.active } : s
            ));
            router.refresh();
        } catch (error: any) {
            alert(error.message || "Error al actualizar estado");
        }
    };

    const handleDeleteSubcategory = async (subId: string, subName: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar la subcategoría "${subName}"?`)) return;
        setLoading(true);

        try {
            const response = await fetch("/api/subcategories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: subId })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al eliminar la subcategoría");

            setSubcategories(subcategories.filter(s => s.id !== subId));
            router.refresh();
        } catch (error: any) {
            console.error("Error deleting subcategory:", error);
            alert(error.message || "Error al eliminar la subcategoría");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (catId: string, catName: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${catName}"?`)) return;
        setLoading(true);

        try {
            const response = await fetch("/api/categories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: catId })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al eliminar la categoría");

            setCategories(categories.filter(c => c.id !== catId));
            router.refresh();
        } catch (error: any) {
            console.error("Error deleting category:", error);
            alert(error.message || "Error al eliminar la categoría");
        } finally {
            setLoading(false);
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
                                    {editingCategoryId === cat.id ? (
                                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm animate-in fade-in max-w-md my-0.5">
                                            <input
                                                autoFocus
                                                type="text"
                                                className="bg-transparent outline-none px-2 text-sm font-semibold text-[#1e293b] w-full max-w-[200px] sm:max-w-xs"
                                                value={editingCategoryName}
                                                onChange={e => setEditingCategoryName(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleUpdateCategory(cat.id);
                                                    if (e.key === 'Escape') setEditingCategoryId(null);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleUpdateCategory(cat.id)}
                                                disabled={loading}
                                                className="p-1 bg-[var(--admin-accent)] text-white rounded hover:bg-[var(--admin-accent-hover)] transition-colors"
                                                title="Guardar"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            </button>
                                            <button
                                                onClick={() => setEditingCategoryId(null)}
                                                className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                                title="Cancelar"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 style={{
                                                fontWeight: 'bold',
                                                fontSize: '19px',
                                                letterSpacing: '-0.025em',
                                                color: cat.active ? '#1e293b' : '#94a3b8',
                                                textDecoration: cat.active ? 'none' : 'line-through'
                                            }}>
                                                {capitalizeWords(cat.name)}
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setEditingCategoryId(cat.id);
                                                    setEditingCategoryName(cat.name);
                                                }}
                                                style={{
                                                    padding: '4px',
                                                    borderRadius: '6px',
                                                    color: '#94a3b8',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.color = 'var(--admin-accent)';
                                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.color = '#94a3b8';
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                                title="Editar Nombre"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <span style={{
                                                fontSize: '10px',
                                                padding: '2px 8px',
                                                borderRadius: '9999px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                backgroundColor: cat.active ? '#dcfce7' : '#f1f5f9',
                                                color: cat.active ? '#15803d' : '#475569'
                                            }}>
                                                {cat.active ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-0.5">{catSubs.length} subcategorías</p>
                                </div>

                                <div className="flex items-center gap-2 mr-2">
                                    <button
                                        onClick={() => setCreatingSubFor(cat.id)}
                                        style={{
                                            padding: '6px 12px',
                                            color: '#4f46e5',
                                            backgroundColor: '#eef2ff',
                                            border: '1px solid #e0e7ff',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e0e7ff'; e.currentTarget.style.color = '#4338ca'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
                                        title="Agregar Subcategoría"
                                    >
                                        <Plus size={16} />
                                        <span className="hidden sm:inline">Subcategoría</span>
                                    </button>
                                    <button
                                        onClick={() => toggleCategoryStatus(cat)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            color: cat.active ? '#94a3b8' : '#059669',
                                            backgroundColor: cat.active ? 'transparent' : '#ecfdf5',
                                            border: 'none'
                                        }}
                                        onMouseOver={(e) => {
                                            if (cat.active) {
                                                e.currentTarget.style.color = '#dc2626';
                                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                            } else {
                                                e.currentTarget.style.backgroundColor = '#d1fae5';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = cat.active ? '#94a3b8' : '#059669';
                                            e.currentTarget.style.backgroundColor = cat.active ? 'transparent' : '#ecfdf5';
                                        }}
                                        title={cat.active ? "Desactivar" : "Activar"}
                                    >
                                        <Power size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            color: '#94a3b8',
                                            backgroundColor: 'transparent',
                                            border: 'none'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = '#dc2626';
                                            e.currentTarget.style.backgroundColor = '#fef2f2';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = '#94a3b8';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                        title="Eliminar Categoría"
                                    >
                                        <Trash2 size={18} />
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
                                        <div key={sub.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: 'white',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            marginLeft: '2rem',
                                            position: 'relative',
                                            transition: 'all 0.2s',
                                            cursor: 'default'
                                        }}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                        >
                                            {/* Decorative tree line */}
                                            <div style={{ position: 'absolute', left: '-1rem', top: '50%', width: '1rem', height: '2px', backgroundColor: '#e2e8f0' }}></div>
                                            <div style={{ position: 'absolute', left: '-1rem', top: '-100%', width: '2px', height: '150%', backgroundColor: '#e2e8f0' }} className="hidden sm:block"></div>

                                            <div className="flex items-center gap-3 relative z-10 flex-1">
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#f8fafc',
                                                    border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#94a3b8',
                                                    flexShrink: 0
                                                }}>
                                                    <FolderOpen size={16} strokeWidth={2.5} />
                                                </div>
                                                {editingSubcategoryId === sub.id ? (
                                                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm animate-in fade-in flex-1 max-w-md">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            className="bg-transparent outline-none px-2 text-sm font-semibold text-[#334155] w-full"
                                                            value={editingSubcategoryName}
                                                            onChange={e => setEditingSubcategoryName(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') handleUpdateSubcategory(sub.id);
                                                                if (e.key === 'Escape') setEditingSubcategoryId(null);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateSubcategory(sub.id)}
                                                            disabled={loading}
                                                            className="p-1 bg-[var(--admin-accent)] text-white rounded hover:bg-[var(--admin-accent-hover)] transition-colors"
                                                            title="Guardar"
                                                        >
                                                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingSubcategoryId(null)}
                                                            className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                                            title="Cancelar"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span style={{
                                                            fontSize: '15px', fontWeight: '600',
                                                            color: sub.active ? '#334155' : '#cbd5e1',
                                                            textDecoration: sub.active ? 'none' : 'line-through'
                                                        }}>
                                                            {capitalizeWords(sub.name)}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setEditingSubcategoryId(sub.id);
                                                                setEditingSubcategoryName(sub.name);
                                                            }}
                                                            style={{
                                                                padding: '4px',
                                                                borderRadius: '6px',
                                                                color: '#cbd5e1',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.color = 'var(--admin-accent)';
                                                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.color = '#cbd5e1';
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                            title="Editar Nombre"
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => toggleSubcategoryStatus(sub)}
                                                    style={{
                                                        padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                                        color: sub.active ? '#cbd5e1' : '#10b981',
                                                        backgroundColor: sub.active ? 'transparent' : '#ecfdf5',
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (sub.active) {
                                                            e.currentTarget.style.color = '#dc2626';
                                                            e.currentTarget.style.backgroundColor = '#fef2f2';
                                                        } else {
                                                            e.currentTarget.style.backgroundColor = '#d1fae5';
                                                        }
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.color = sub.active ? '#cbd5e1' : '#10b981';
                                                        e.currentTarget.style.backgroundColor = sub.active ? 'transparent' : '#ecfdf5';
                                                    }}
                                                    title={sub.active ? "Desactivar" : "Activar"}
                                                >
                                                    <Power size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                                    style={{
                                                        padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                                        color: '#cbd5e1',
                                                        backgroundColor: 'transparent',
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.color = '#dc2626';
                                                        e.currentTarget.style.backgroundColor = '#fef2f2';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.color = '#cbd5e1';
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                    title="Eliminar Subcategoría"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
