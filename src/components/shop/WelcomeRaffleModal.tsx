"use client";

import { useEffect, useState } from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Loader2, Ticket, CheckCircle, Smartphone, User, CreditCard, HelpCircle, EyeOff, FileText } from "lucide-react";

export default function WelcomeRaffleModal() {
    const { settings, loading: settingsLoading } = useStoreSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [dni, setDni] = useState("");
    const [phone, setPhone] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isIncognito, setIsIncognito] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [assignedNumber, setAssignedNumber] = useState<number | null>(null);

    // Heuristic detection of incognito mode
    const detectPrivateMode = async () => {
        if (typeof window === "undefined") return;
        try {
            // Check quota limits (Chromium incognito caps temporary storage)
            if ("storage" in navigator && "estimate" in navigator.storage) {
                const { quota } = await navigator.storage.estimate();
                if (quota && quota < 120000000) {
                    setIsIncognito(true);
                    return;
                }
            }
            // Check Firefox private mode (locks IndexedDB)
            if (navigator.userAgent.includes("Firefox")) {
                const db = indexedDB.open("private_test");
                db.onerror = () => {
                    setIsIncognito(true);
                };
            }
        } catch (e) {
            console.error("Private mode check error:", e);
        }
    };

    useEffect(() => {
        if (settingsLoading) return;

        // Only show if raffle is enabled in settings and not already registered/closed
        if (settings.raffle_enabled) {
            const hasRegistered = localStorage.getItem("ctq_raffle_registered");
            const hasClosed = sessionStorage.getItem("ctq_raffle_closed");
            if (!hasRegistered && !hasClosed) {
                setIsOpen(true);
                detectPrivateMode();
            }
        }
    }, [settings.raffle_enabled, settingsLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // Validation
        if (!name.trim()) {
            setErrorMsg("Por favor, ingresá tu nombre y apellido.");
            return;
        }
        if (!/^\d{7,8}$/.test(dni.trim())) {
            setErrorMsg("El DNI debe tener 7 u 8 dígitos numéricos (sin puntos ni espacios).");
            return;
        }
        if (!phone.trim()) {
            setErrorMsg("Por favor, ingresá tu número de teléfono.");
            return;
        }
        if (!acceptTerms) {
            setErrorMsg("Debés aceptar las Bases y Condiciones para participar.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/raffle/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, dni, phone })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Ocurrió un error al registrarte.");
            }

            // Save state
            const num = result.participant.number;
            setAssignedNumber(num);
            localStorage.setItem("ctq_raffle_registered", JSON.stringify({
                name,
                number: num,
                date: new Date().toISOString()
            }));

        } catch (err: any) {
            setErrorMsg(err.message || "Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        sessionStorage.setItem("ctq_raffle_closed", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(30, 27, 27, 0.45)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
        }}>
            <div style={{
                backgroundColor: "white",
                width: "100%",
                maxWidth: "480px",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(255, 192, 203, 0.25)",
                padding: "2.5rem 2rem",
                position: "relative",
                overflow: "hidden",
                animation: "modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>
                {/* Decorative Pink Glows */}
                <div style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-20%",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,192,203,0.4) 0%, rgba(255,255,255,0) 70%)",
                    zIndex: 0
                }} />
                <div style={{
                    position: "absolute",
                    bottom: "-20%",
                    left: "-20%",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,242,254,0.4) 0%, rgba(255,255,255,0) 70%)",
                    zIndex: 0
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {assignedNumber === null ? (
                        /* --- FORM STATE --- */
                        <div>
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{
                                    display: "inline-flex",
                                    padding: "12px",
                                    backgroundColor: "#fff0f5",
                                    borderRadius: "16px",
                                    color: "#ff6b9d",
                                    marginBottom: "1rem"
                                }}>
                                    <Ticket size={28} />
                                </div>
                                <h2 style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                    color: "#1e293b",
                                    fontFamily: "var(--font-brand)",
                                    marginBottom: "0.5rem"
                                }}>
                                    ¡Sorteo de Bienvenida!
                                </h2>
                                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>
                                    Para festejar nuestra nueva web, te regalamos un número para participar de un sorteo exclusivo. Completá tus datos para obtener tu ticket.
                                </p>
                            </div>

                            {/* Incognito Warning */}
                            {isIncognito && (
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.5rem",
                                    backgroundColor: "#fffbeb",
                                    border: "1px solid #fde68a",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    color: "#b45309",
                                    marginBottom: "1rem",
                                    lineHeight: "1.4"
                                }}>
                                    <EyeOff size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                                    <span>
                                        <strong>Modo Incógnito Detectado:</strong> Podés registrarte igual, pero te recomendamos usar el modo normal para que tu ticket quede guardado en este dispositivo y no te vuelva a aparecer esta pantalla.
                                    </span>
                                </div>
                            )}

                            {errorMsg && (
                                <div style={{
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fca5a5",
                                    color: "#b91c1c",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    marginBottom: "1rem",
                                    textAlign: "center"
                                }}>
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#475569" }}>Nombre y Apellido</label>
                                    <div style={{ position: "relative" }}>
                                        <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Ej: María Pérez"
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem 0.75rem 2.25rem",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "12px",
                                                fontSize: "0.875rem",
                                                outline: "none",
                                                color: "#334155"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#475569" }}>DNI (Sin puntos ni espacios)</label>
                                    <div style={{ position: "relative" }}>
                                        <CreditCard size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                                        <input
                                            type="text"
                                            required
                                            value={dni}
                                            onChange={e => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                            placeholder="Ej: 38450123"
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem 0.75rem 2.25rem",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "12px",
                                                fontSize: "0.875rem",
                                                outline: "none",
                                                color: "#334155"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#475569" }}>Teléfono de Contacto</label>
                                    <div style={{ position: "relative" }}>
                                        <Smartphone size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="Ej: 3416029814"
                                            style={{
                                                width: "100%",
                                                padding: "0.75rem 1rem 0.75rem 2.25rem",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: "12px",
                                                fontSize: "0.875rem",
                                                outline: "none",
                                                color: "#334155"
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Terms and Conditions Checkbox */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginTop: "0.25rem" }}>
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        required
                                        checked={acceptTerms}
                                        onChange={e => setAcceptTerms(e.target.checked)}
                                        style={{
                                            marginTop: "3px",
                                            cursor: "pointer",
                                            accentColor: "#ff6b9d"
                                        }}
                                    />
                                    <label htmlFor="acceptTerms" style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.4", cursor: "pointer" }}>
                                        Acepto las{" "}
                                        <button
                                            type="button"
                                            onClick={() => setShowTermsModal(true)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#ff6b9d",
                                                textDecoration: "underline",
                                                padding: 0,
                                                fontSize: "0.75rem",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Bases y Condiciones
                                        </button>{" "}
                                        del sorteo.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        marginTop: "0.5rem",
                                        padding: "0.85rem",
                                        background: "linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        fontSize: "0.95rem",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        boxShadow: "0 4px 12px rgba(255,107,157,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    {loading ? "Obteniendo ticket..." : "Participar Ahora"}
                                </button>
                            </form>

                            <button
                                onClick={handleClose}
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                    background: "none",
                                    border: "none",
                                    fontSize: "0.8rem",
                                    color: "#94a3b8",
                                    cursor: "pointer",
                                    textDecoration: "underline"
                                }}
                            >
                                Entrar a la web sin participar
                            </button>
                        </div>
                    ) : (
                        /* --- SUCCESS TICKET STATE --- */
                        <div style={{ textAlign: "center", animation: "ticketReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                            <div style={{
                                display: "inline-flex",
                                padding: "12px",
                                backgroundColor: "#dcfce7",
                                borderRadius: "16px",
                                color: "#15803d",
                                marginBottom: "1rem"
                            }}>
                                <CheckCircle size={28} />
                            </div>

                            <h2 style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color: "#15803d",
                                fontFamily: "var(--font-brand)",
                                marginBottom: "0.25rem"
                            }}>
                                ¡Registro Exitoso!
                            </h2>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "2rem" }}>
                                Guardá este ticket en tu celular. Tu número asignado para participar es:
                            </p>

                            {/* Ticket Render */}
                            <div style={{
                                border: "2px dashed #ffc0cb",
                                backgroundColor: "#fff0f5",
                                borderRadius: "16px",
                                padding: "2rem 1rem",
                                position: "relative",
                                overflow: "hidden",
                                marginBottom: "2rem",
                                boxShadow: "0 4px 10px rgba(255,107,157,0.05)"
                            }}>
                                {/* Ticket Notch decorations */}
                                <div style={{ position: "absolute", left: "-8px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", borderRight: "2px dashed #ffc0cb" }} />
                                <div style={{ position: "absolute", right: "-8px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", borderLeft: "2px dashed #ffc0cb" }} />

                                <span style={{
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                    color: "#ff6b9d",
                                    textTransform: "uppercase",
                                    letterSpacing: "2px"
                                }}>
                                    Número de Sorteo
                                </span>
                                <div style={{
                                    fontSize: "3.5rem",
                                    fontWeight: "900",
                                    color: "#ff6b9d",
                                    fontFamily: "monospace",
                                    margin: "0.5rem 0",
                                    letterSpacing: "1px"
                                }}>
                                    {String(assignedNumber).padStart(3, "0")}
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600" }}>
                                    {name}
                                </span>
                            </div>

                            <button
                                onClick={handleClose}
                                style={{
                                    width: "100%",
                                    padding: "0.85rem",
                                    background: "#1e293b",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(30,41,59,0.2)"
                                }}
                            >
                                Entrar a la Tienda
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Terms and Conditions Popup Overlay */}
            {showTermsModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10000,
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        width: "100%",
                        maxWidth: "420px",
                        borderRadius: "20px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
                        padding: "2rem 1.5rem",
                        position: "relative",
                        maxHeight: "85vh",
                        display: "flex",
                        flexDirection: "column",
                        animation: "modalFadeIn 0.3s ease-out"
                    }}>
                        <h3 style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#1e293b",
                            marginTop: 0,
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <FileText size={20} style={{ color: "#ff6b9d" }} />
                            Bases y Condiciones (Borrador)
                        </h3>
                        
                        <div style={{
                            overflowY: "auto",
                            fontSize: "0.8rem",
                            color: "#475569",
                            lineHeight: "1.6",
                            paddingRight: "0.5rem",
                            marginBottom: "1.5rem",
                            flex: 1
                        }}>
                            <p style={{ marginTop: 0 }}><strong>1. Participación:</strong> Sorteo gratuito y sin obligación de compra. Reservado para clientes de la tienda.</p>
                            <p><strong>2. Restricción de registro:</strong> Solo se permite un (1) registro por persona física. Los campos DNI y Teléfono deben ser únicos y reales; el sistema validará de manera automatizada su unicidad.</p>
                            <p><strong>3. Números asignados:</strong> Al registrarse, el sistema asignará al participante un número único aleatorio entre <strong>1 y 999</strong>.</p>
                            <p><strong>4. Alcance Geográfico (A confirmar con el cliente):</strong></p>
                            <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0" }}>
                                <li>Opción A: Todo el territorio nacional de la República Argentina.</li>
                                <li>Opción B: Limitado únicamente a la provincia de Santa Fe.</li>
                                <li>Opción C: Limitado a nivel local (Rosario y zonas aledañas).</li>
                            </ul>
                            <p><strong>5. Sorteo y Ganador:</strong> Se realizará en vivo por transmisión de redes sociales u otro medio utilizando el panel de sorteo del sistema. El ganador será contactado a través del número telefónico provisto.</p>
                        </div>

                        <button
                            onClick={() => setShowTermsModal(false)}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                backgroundColor: "#1e293b",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                cursor: "pointer"
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes ticketReveal {
                    from { opacity: 0; transform: scale(0.9) rotate(-2deg); }
                    to { opacity: 1; transform: scale(1) rotate(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
