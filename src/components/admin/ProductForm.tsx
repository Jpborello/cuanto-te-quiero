"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Upload, X, Image as ImageIcon, Package, DollarSign, Tag, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

interface Subcategory {
    id: string;
    name: string;
    category_id: string;
}

interface ProductFormProps {
    initialData?: any;
    categories: Category[];
    subcategories: Subcategory[];
}

export default function ProductForm({ initialData, categories, subcategories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        custom_id: initialData?.id || "", // Manual ID (4 digits)
        name: initialData?.name || "",
        description: initialData?.description || "",
        category_id: initialData?.category_id || "",
        subcategory_id: initialData?.subcategory_id || "",
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        active: initialData?.active ?? true, // Default true
    });

    const [images, setImages] = useState<string[]>(
        initialData?.product_images?.map((img: any) => img.image_url) || []
    );

    // Filter subcategories based on selected category
    const filteredSubcategories = subcategories.filter(
        sub => sub.category_id.toString() === formData.category_id.toString()
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex?: number) => {
        if (!e.target.files || e.target.files.length === 0) return;

        // If slotIndex is provided, we're replacing that specific slot
        // Otherwise, check if we have room for more images
        if (slotIndex === undefined && images.length >= 4) {
            alert("Máximo 4 imágenes permitidas (3 productos + 1 GIF)");
            return;
        }

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);

            // If slotIndex is provided, update that specific slot
            if (slotIndex !== undefined) {
                const newImages = [...images];
                newImages[slotIndex] = data.publicUrl;
                setImages(newImages);
            } else {
                // Otherwise, append to the end
                setImages([...images, data.publicUrl]);
            }

        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for 4-digit ID
        if (!/^\d{4}$/.test(formData.custom_id.toString())) {
            alert("El ID del producto debe ser de 4 dígitos exactos.");
            return;
        }

        setLoading(true);

        try {
            const productPayload = {
                product_id: parseInt(formData.custom_id), // Internal ID for management
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id || null,
                subcategory_id: formData.subcategory_id || null,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                active: formData.active,
                // Legacy support if schema has image_url on products table
                image_url: images[0] || null
            };

            let productUid = initialData?.uid; // Use uid instead of id

            if (initialData) {
                // UPDATE
                const { error } = await supabase
                    .from("products")
                    .update(productPayload)
                    .eq("uid", initialData.uid); // Use uid for updates
                if (error) throw error;
            } else {
                // INSERT
                const { data, error } = await supabase
                    .from("products")
                    .insert(productPayload)
                    .select()
                    .single();

                if (error) throw error;
                productUid = data.uid; // Get the auto-generated uid
            }

            // Verify if product_images table exists and update it
            // First delete existing images for this product (simple sync strategy)
            if (initialData) {
                await supabase.from("product_images").delete().eq("product_id", productUid);
            }

            // Insert new images
            if (images.length > 0) {
                const imageInserts = images.map(url => ({
                    product_id: productUid, // Use uid for foreign key
                    image_url: url
                }));
                const { error: imgError } = await supabase.from("product_images").insert(imageInserts);
                if (imgError) {
                    console.warn("Could not insert into product_images (table might not exist or schema mismatch). Ignoring as we saved primary image to products table.");
                }
            }

            router.push("/admin/products");
            router.refresh();

        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(`Error al guardar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Card with ID and Status */}
            <div className="admin-card-elevated">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Sparkles className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <p className="text-sm text-gray-500">Agrega un nuevo ítem al catálogo</p>
                            </div>
                        </div>

                        <div className="field-group">
                            <label className="form-label form-label-required">ID Producto (Manual)</label>
                            <input
                                type="number"
                                required
                                className="form-input font-mono font-bold text-lg w-full md:w-48"
                                placeholder="0001"
                                value={formData.custom_id}
                                onChange={(e) => setFormData({ ...formData, custom_id: e.target.value })}
                                disabled={!!initialData}
                            />
                            <p className="form-hint">4 dígitos exactos</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <label className="form-label">Estado del Producto</label>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-bold ${formData.active ? 'text-green-600' : 'text-gray-500'}`}>
                                {formData.active ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Information Section */}
            <div className="form-section">
                <div className="form-section-header">
                    <div className="form-section-icon">
                        <Package size={20} />
                    </div>
                    <div>
                        <h3 className="form-section-title">Información Básica</h3>
                        <p className="form-section-subtitle">Nombre y categorización del producto</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="field-group">
                        <label className="form-label form-label-required">Nombre del Producto</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="Ej: Peluche Osito Romántico"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="field-row field-row-2">
                        <div className="field-group">
                            <label className="form-label form-label-required">Categoría</label>
                            <select
                                className="form-select"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: "" })}
                                required
                            >
                                <option value="">Seleccionar categoría...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label className="form-label">Subcategoría</label>
                            <select
                                className="form-select"
                                value={formData.subcategory_id}
                                onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                                disabled={!formData.category_id}
                            >
                                <option value="">Seleccionar subcategoría...</option>
                                {filteredSubcategories.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                            {!formData.category_id && (
                                <p className="form-hint">Primero selecciona una categoría</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="form-section">
                <div className="form-section-header">
                    <div className="form-section-icon">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <h3 className="form-section-title">Precio e Inventario</h3>
                        <p className="form-section-subtitle">Gestiona el precio y stock disponible</p>
                    </div>
                </div>

                <div className="field-row field-row-2">
                    <div className="field-group">
                        <label className="form-label form-label-required">Precio ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0"
                                className="form-input pl-8 font-semibold text-lg"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <p className="form-hint">Precio de venta al público</p>
                    </div>

                    <div className="field-group">
                        <label className="form-label form-label-required">Stock Disponible</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="form-input font-semibold text-lg"
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                        <p className="form-hint">Unidades en inventario</p>
                    </div>
                </div>
            </div>

            {/* Images Section */}
            <div className="form-section">
                <div className="form-section-header">
                    <div className="form-section-icon">
                        <ImageIcon size={20} />
                    </div>
                    <div>
                        <h3 className="form-section-title">Imágenes del Producto</h3>
                        <p className="form-section-subtitle">3 imágenes del producto + 1 GIF opcional</p>
                    </div>
                </div>

                {/* Product Images - 3 slots */}
                <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>
                        Imágenes del Producto (JPG, PNG)
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem'
                    }}>
                        {[0, 1, 2].map((slotIndex) => {
                            const imageUrl = images[slotIndex];
                            return (
                                <div key={slotIndex} style={{
                                    position: 'relative',
                                    aspectRatio: '1',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f9fafb'
                                }}>
                                    {imageUrl ? (
                                        <>
                                            <img
                                                src={imageUrl}
                                                alt={`Producto ${slotIndex + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(slotIndex)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.5rem',
                                                    right: '0.5rem',
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    padding: '0.5rem',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                            >
                                                <X size={16} />
                                            </button>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '0.5rem',
                                                left: '0.5rem',
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem'
                                            }}>
                                                Imagen {slotIndex + 1}
                                            </div>
                                        </>
                                    ) : (
                                        <label style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '2px dashed #d1d5db',
                                            borderRadius: '12px',
                                            backgroundColor: '#fafbfc',
                                            color: '#64748b',
                                            transition: 'all 0.2s'
                                        }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#6366f1';
                                                e.currentTarget.style.backgroundColor = '#f0f4ff';
                                                e.currentTarget.style.color = '#6366f1';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.backgroundColor = '#fafbfc';
                                                e.currentTarget.style.color = '#64748b';
                                            }}>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleImageUpload(e, slotIndex);
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <Loader2 className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                                        Imagen {slotIndex + 1}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                        JPG/PNG
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* GIF Section - 1 slot */}
                <div>
                    <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>
                        GIF Animado (Opcional)
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        maxWidth: '300px'
                    }}>
                        {images[3] ? (
                            <div style={{
                                position: 'relative',
                                aspectRatio: '1',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                backgroundColor: '#f9fafb'
                            }}>
                                <img
                                    src={images[3]}
                                    alt="GIF Animado"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(3)}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                >
                                    <X size={16} />
                                </button>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0.5rem',
                                    left: '0.5rem',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem'
                                }}>
                                    GIF
                                </div>
                            </div>
                        ) : (
                            <label style={{
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                backgroundColor: '#fafbfc',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#ec4899';
                                    e.currentTarget.style.backgroundColor = '#fdf2f8';
                                    e.currentTarget.style.color = '#ec4899';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.backgroundColor = '#fafbfc';
                                    e.currentTarget.style.color = '#64748b';
                                }}>
                                <input
                                    type="file"
                                    accept="image/gif"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleImageUpload(e, 3);
                                        }
                                    }}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <Sparkles size={24} style={{ marginBottom: '0.5rem' }} />
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                            Subir GIF
                                        </span>
                                        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                            Solo GIF
                                        </span>
                                    </>
                                )}
                            </label>
                        )}
                    </div>
                    <p className="form-hint" style={{ marginTop: '0.5rem' }}>
                        El GIF se mostrará en la galería del producto
                    </p>
                </div>
            </div>

            {/* Description Section */}
            <div className="form-section">
                <div className="form-section-header">
                    <div className="form-section-icon">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="form-section-title">Descripción</h3>
                        <p className="form-section-subtitle">Información adicional del producto (opcional)</p>
                    </div>
                </div>

                <div className="field-group">
                    <textarea
                        rows={4}
                        className="form-textarea resize-none"
                        placeholder="Describe las características, materiales, dimensiones, etc..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <p className="form-hint">Máximo 500 caracteres recomendados</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="admin-card-elevated">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors text-center"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="btn-primary min-w-[200px] justify-center py-3 px-6 text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
