"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, Save, AlertTriangle, Database, Check, RefreshCw } from "lucide-react";

export default function AdminSettings() {
    const [cartEnabled, setCartEnabled] = useState(false);
    const [pricesEnabled, setPricesEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [dbTableError, setDbTableError] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        setDbTableError(null);
        try {
            const { data, error } = await supabase
                .from("settings")
                .select("key, value");

            if (error) {
                // If it is a table-not-found error, we catch it
                if (error.message.includes("relation") || error.message.includes("cache")) {
                    setDbTableError("table_missing");
                } else {
                    setDbTableError(error.message);
                }
            } else if (data) {
                const settingsMap: Record<string, any> = {};
                data.forEach((row) => {
                    settingsMap[row.key] = row.value;
                });

                if (settingsMap.cart_enabled !== undefined) {
                    setCartEnabled(settingsMap.cart_enabled === true || settingsMap.cart_enabled === "true");
                }
                if (settingsMap.prices_enabled !== undefined) {
                    setPricesEnabled(settingsMap.prices_enabled !== false && settingsMap.prices_enabled !== "false");
                }
            }
        } catch (err: any) {
            console.error("Error fetching settings:", err);
            setDbTableError(err.message || "Error al conectar con la base de datos");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const { error } = await supabase
                .from("settings")
                .upsert([
                    { key: "cart_enabled", value: cartEnabled },
                    { key: "prices_enabled", value: pricesEnabled }
                ]);

            if (error) throw error;
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            alert("Error al guardar la configuración: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const sqlInstructions = `CREATE TABLE public.settings (
    key text PRIMARY KEY,
    value jsonb
);

-- Insertar configuraciones iniciales (Modo Catálogo Whatsapp)
INSERT INTO public.settings (key, value) VALUES
('cart_enabled', 'false'::jsonb),
('prices_enabled', 'true'::jsonb);

-- Habilitar permisos de lectura para todos
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Permitir modificacion a administradores" ON public.settings FOR ALL USING (true);`;

    if (loading) {
        return (
            <div style={{ padding: "2rem", color: "#666", textAlign: "center" }}>
                <RefreshCw className="animate-spin" size={24} style={{ margin: "0 auto 1rem", animation: "spin 1.5s linear infinite" }} />
                <p>Cargando configuraciones...</p>
                <style jsx global>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Settings size={28} />
                    Configuración de la Tienda
                </h1>
                <p className="admin-page-subtitle">Configurá las funcionalidades globales del e-commerce y catálogo</p>
            </div>

            {dbTableError === "table_missing" ? (
                <div style={{
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeeba",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    marginBottom: "2rem",
                    lineHeight: "1.6"
                }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700" }}>
                        <AlertTriangle size={20} />
                        Tabla 'settings' no encontrada en Supabase
                    </h3>
                    <p style={{ fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
                        La base de datos de tu proyecto no posee la tabla <code>settings</code>. Para habilitar la configuración del carrito y los precios de forma dinámica, por favor copiá el siguiente comando SQL y ejecutalo en el editor SQL de tu Supabase Dashboard:
                    </p>
                    <pre style={{
                        backgroundColor: "#fcfcfc",
                        border: "1px solid #ccc",
                        padding: "1rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        color: "#333",
                        margin: "0 0 1rem 0"
                    }}>
                        {sqlInstructions}
                    </pre>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(sqlInstructions);
                            alert("¡SQL Copiado al portapapeles!");
                        }}
                        style={{
                            backgroundColor: "#856404",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginRight: "1rem"
                        }}
                    >
                        Copiar Código SQL
                    </button>
                    <button
                        onClick={fetchSettings}
                        style={{
                            backgroundColor: "white",
                            color: "#856404",
                            border: "1px solid #856404",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Re-verificar Tabla
                    </button>
                </div>
            ) : null}

            <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Toggles */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.5rem", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ flex: 1, paddingRight: "1.5rem" }}>
                            <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
                                Habilitar Carrito de Compras
                            </h3>
                            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", lineHeight: "1.4" }}>
                                Cuando está encendido, los clientes podrán agregar productos a un carrito y realizar pedidos. Cuando está apagado, se ocultará el carrito y se usará el sistema de <strong>Consulta Directa por WhatsApp</strong>.
                            </p>
                        </div>
                        <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px", flexShrink: 0 }}>
                            <input
                                type="checkbox"
                                checked={cartEnabled}
                                disabled={dbTableError !== null}
                                onChange={(e) => setCartEnabled(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: "absolute", cursor: dbTableError ? "not-allowed" : "pointer", top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: cartEnabled ? "#4caf50" : "#ccc",
                                transition: ".4s", borderRadius: "34px",
                                opacity: dbTableError ? 0.5 : 1
                            }}>
                                <span style={{
                                    position: "absolute", content: '""', height: "26px", width: "26px", left: "4px", bottom: "4px",
                                    backgroundColor: "white", transition: ".4s", borderRadius: "50%",
                                    transform: cartEnabled ? "translateX(26px)" : "translateX(0)"
                                }} />
                            </span>
                        </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.5rem", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ flex: 1, paddingRight: "1.5rem" }}>
                            <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
                                Mostrar Precios en el Catálogo
                            </h3>
                            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666", lineHeight: "1.4" }}>
                                Cuando está encendido, se mostrarán los precios en la web (los de precio $0 mostrarán 'Disponible'). Si está apagado, los precios se ocultarán por completo en el catálogo de cara al cliente.
                            </p>
                        </div>
                        <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px", flexShrink: 0 }}>
                            <input
                                type="checkbox"
                                checked={pricesEnabled}
                                disabled={dbTableError !== null}
                                onChange={(e) => setPricesEnabled(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: "absolute", cursor: dbTableError ? "not-allowed" : "pointer", top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: pricesEnabled ? "#4caf50" : "#ccc",
                                transition: ".4s", borderRadius: "34px",
                                opacity: dbTableError ? 0.5 : 1
                            }}>
                                <span style={{
                                    position: "absolute", content: '""', height: "26px", width: "26px", left: "4px", bottom: "4px",
                                    backgroundColor: "white", transition: ".4s", borderRadius: "50%",
                                    transform: pricesEnabled ? "translateX(26px)" : "translateX(0)"
                                }} />
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            onClick={handleSave}
                            disabled={saving || dbTableError !== null}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.75rem 1.5rem",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: dbTableError ? "#ccc" : saveSuccess ? "#4caf50" : "#ffc0cb",
                                color: "white",
                                fontWeight: "600",
                                fontSize: "1rem",
                                cursor: dbTableError || saving ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: dbTableError ? "none" : saveSuccess ? "0 4px 12px rgba(76,175,80,0.3)" : "0 4px 12px rgba(255,192,203,0.4)"
                            }}
                            onMouseOver={(e) => {
                                if (!saving && !dbTableError && !saveSuccess) {
                                    e.currentTarget.style.backgroundColor = "#ff6b9d";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!saving && !dbTableError && !saveSuccess) {
                                    e.currentTarget.style.backgroundColor = "#ffc0cb";
                                }
                            }}
                        >
                            {saving ? (
                                <RefreshCw className="animate-spin" size={18} style={{ animation: "spin 1.5s linear infinite" }} />
                            ) : saveSuccess ? (
                                <Check size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? "Guardando..." : saveSuccess ? "¡Guardado!" : "Guardar Configuración"}
                        </button>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
