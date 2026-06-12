"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
    Ticket, 
    Play, 
    RefreshCw, 
    Search, 
    ToggleLeft, 
    ToggleRight, 
    Trash2, 
    UserCheck, 
    Sparkles, 
    Trophy, 
    Smartphone, 
    CreditCard, 
    Calendar,
    Users
} from "lucide-react";

interface Participant {
    id: string;
    name: string;
    dni: string;
    phone: string;
    number: number;
    created_at: string;
}

interface Winner {
    id: string;
    drawn_at: string;
    participant_id: string;
    raffle_participants: {
        name: string;
        dni: string;
        phone: string;
        number: number;
    } | null;
}

export default function AdminSorteo() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [winners, setWinners] = useState<Winner[]>([]);
    const [raffleEnabled, setRaffleEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [drawing, setDrawing] = useState(false);
    const [animationNumber, setAnimationNumber] = useState("000");
    const [animationName, setAnimationName] = useState("Buscando...");
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/raffle/draw");
            const result = await response.json();
            if (response.ok) {
                setParticipants(result.participants);
                setWinners(result.winners);
                setRaffleEnabled(result.raffleEnabled);
            } else {
                throw new Error(result.error);
            }
        } catch (e: any) {
            console.error("Error loading raffle data:", e);
            alert("Error al cargar datos del sorteo: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleRaffleStatus = async () => {
        setActionLoading(true);
        try {
            const nextStatus = !raffleEnabled;
            const response = await fetch("/api/raffle/draw", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: nextStatus })
            });

            if (!response.ok) throw new Error("Error al guardar estado");
            setRaffleEnabled(nextStatus);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    const clearRaffleData = async () => {
        if (!confirm("⚠️ ¿ATENCIÓN? Esto eliminará PERMANENTEMENTE a todos los participantes registrados y ganadores históricos. Esta acción no se puede deshacer. ¿Deseas continuar?")) return;
        
        setActionLoading(true);
        try {
            const response = await fetch("/api/raffle/draw", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "clear_all" })
            });

            if (!response.ok) throw new Error("Error al reiniciar datos");
            
            setParticipants([]);
            setWinners([]);
            alert("¡El sorteo ha sido reiniciado por completo!");
        } catch (e: any) {
            alert(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    const triggerDrawAnimation = () => {
        if (participants.length === 0) {
            alert("No hay ningún participante registrado para realizar el sorteo.");
            return;
        }

        setDrawing(true);
        setShowWinnerModal(false);
        
        // Pick a random winner from the list
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];
        setCurrentWinner(winner);

        // Spin animation parameters
        let speed = 40; // ms
        let duration = 3000; // total animation time in ms
        let elapsed = 0;

        const interval = setInterval(() => {
            // Pick random fake participant for visual effect
            const tempIndex = Math.floor(Math.random() * participants.length);
            const tempParticipant = participants[tempIndex];
            
            setAnimationNumber(String(tempParticipant.number).padStart(3, "0"));
            setAnimationName(tempParticipant.name);

            elapsed += speed;
            if (elapsed >= duration) {
                clearInterval(interval);
                
                // Final reveal
                setAnimationNumber(String(winner.number).padStart(3, "0"));
                setAnimationName(winner.name);
                
                // Save winner to DB
                saveWinnerToDb(winner.id);
            }
        }, speed);
    };

    const saveWinnerToDb = async (participantId: string) => {
        try {
            const response = await fetch("/api/raffle/draw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participant_id: participantId })
            });

            if (!response.ok) throw new Error("No se pudo persistir el ganador en la base de datos");

            // Refresh data to show new winner in history
            const resData = await response.json();
            
            // Wait slightly before showing winner popup for suspension effect
            setTimeout(() => {
                setDrawing(false);
                setShowWinnerModal(true);
                fetchData(); // reload lists
            }, 800);

        } catch (e: any) {
            console.error(e);
            alert("Error al registrar ganador: " + e.message);
            setDrawing(false);
        }
    };

    // Filter participants
    const filteredParticipants = participants.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dni.includes(searchQuery) ||
        p.phone.includes(searchQuery) ||
        p.number.toString().includes(searchQuery)
    );

    if (loading) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
                <RefreshCw className="animate-spin" size={28} style={{ margin: "0 auto 1rem", animation: "spin 1.5s linear infinite" }} />
                <p>Cargando panel de sorteo...</p>
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
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                    <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Ticket size={28} />
                        Sorteo de Bienvenida
                    </h1>
                    <p className="admin-page-subtitle">Gestioná los participantes, habilitá el popup de bienvenida y realizá sorteos en vivo</p>
                </div>

                {/* Status and Action Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                        onClick={toggleRaffleStatus}
                        disabled={actionLoading}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            backgroundColor: raffleEnabled ? "#ecfdf5" : "#f1f5f9",
                            color: raffleEnabled ? "#15803d" : "#475569",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            cursor: actionLoading ? "not-allowed" : "pointer"
                        }}
                    >
                        {raffleEnabled ? <ToggleRight size={24} style={{ color: "#22c55e" }} /> : <ToggleLeft size={24} style={{ color: "#94a3b8" }} />}
                        {raffleEnabled ? "Popup Habilitado" : "Popup Deshabilitado"}
                    </button>

                    <button
                        onClick={clearRaffleData}
                        disabled={actionLoading}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#fef2f2",
                            color: "#991b1b",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            cursor: actionLoading ? "not-allowed" : "pointer"
                        }}
                        title="Reiniciar Sorteo"
                    >
                        <Trash2 size={18} />
                        Reiniciar
                    </button>
                </div>
            </div>

            {/* Grid Dashboard */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "2rem", marginBottom: "2rem" }} className="grid-responsive">
                {/* Left Column: Drawing Panel & Statistics */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Live Draw Board */}
                    <div style={{
                        backgroundColor: "#1e293b", // Slate 800
                        borderRadius: "20px",
                        padding: "3rem 2rem",
                        color: "white",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        border: "1px solid #334155"
                    }}>
                        {/* Gold sparkles background */}
                        <div style={{ position: "absolute", top: "10px", right: "10px", color: "#eab308", opacity: 0.3 }}>
                            <Sparkles size={24} />
                        </div>
                        <div style={{ position: "absolute", bottom: "10px", left: "10px", color: "#eab308", opacity: 0.3 }}>
                            <Sparkles size={24} />
                        </div>

                        {drawing ? (
                            /* --- DRAW ANIMATION STATE --- */
                            <div style={{ animation: "pulse 1.5s infinite" }}>
                                <span style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "3px", color: "#fbbf24", fontWeight: "bold" }}>
                                    Seleccionando número...
                                </span>
                                <div style={{ fontSize: "5rem", fontWeight: "900", fontFamily: "monospace", color: "#fff", margin: "1rem 0", letterSpacing: "4px" }}>
                                    #{animationNumber}
                                </div>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#94a3b8" }}>
                                    {animationName}
                                </h3>
                            </div>
                        ) : showWinnerModal && currentWinner ? (
                            /* --- WINNER CELEBRATION STATE --- */
                            <div style={{ animation: "scaleUp 0.5s ease-out" }}>
                                <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "#fef08a", borderRadius: "50%", color: "#ca8a04", marginBottom: "1rem" }}>
                                    <Trophy size={40} />
                                </div>
                                <h3 style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "3px", color: "#facc15", fontWeight: "bold", margin: 0 }}>
                                    🏆 ¡Tenemos Ganador! 🏆
                                </h3>
                                <div style={{ fontSize: "6rem", fontWeight: "900", fontFamily: "monospace", color: "#facc15", textShadow: "0 0 20px rgba(250,204,21,0.4)", margin: "0.5rem 0" }}>
                                    #{String(currentWinner.number).padStart(3, "0")}
                                </div>
                                <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "white", marginBottom: "1.5rem" }}>
                                    {currentWinner.name}
                                </h2>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "2rem",
                                    maxWidth: "400px",
                                    margin: "0 auto 2rem",
                                    backgroundColor: "#334155",
                                    padding: "1rem",
                                    borderRadius: "12px",
                                    border: "1px solid #475569"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem" }}>
                                        <CreditCard size={16} />
                                        <span>DNI: {currentWinner.dni}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem" }}>
                                        <Smartphone size={16} />
                                        <span>Tel: {currentWinner.phone}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={triggerDrawAnimation}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        backgroundColor: "#facc15",
                                        color: "#1e293b",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 14px rgba(250,204,21,0.4)"
                                    }}
                                >
                                    Realizar Otro Sorteo
                                </button>
                            </div>
                        ) : (
                            /* --- IDLE DRAW BOARD --- */
                            <div>
                                <span style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "3px", color: "#94a3b8", fontWeight: "bold" }}>
                                    Sorteo en Vivo
                                </span>
                                <p style={{ fontSize: "0.9rem", color: "#cbd5e1", maxWidth: "450px", margin: "1rem auto 2rem" }}>
                                    Hacé clic en el botón de abajo para sortear de manera transparente un número ganador entre todos los participantes registrados.
                                </p>
                                <button
                                    onClick={triggerDrawAnimation}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "1rem 2rem",
                                        background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "16px",
                                        fontWeight: "800",
                                        fontSize: "1.25rem",
                                        cursor: "pointer",
                                        boxShadow: "0 10px 25px -5px rgba(217,119,6,0.4)",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    <Play size={24} fill="white" />
                                    ¡INICIAR SORTEO!
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats summary */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", padding: "1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ padding: "12px", backgroundColor: "#eff6ff", borderRadius: "12px", color: "#2563eb" }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Participantes</span>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>{participants.length}</div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", padding: "1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ padding: "12px", backgroundColor: "#fef2f2", borderRadius: "12px", color: "#dc2626" }}>
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Sorteos Hechos</span>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>{winners.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Historical Winners */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "450px"
                }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                        <Trophy size={20} style={{ color: "#ca8a04" }} />
                        Ganadores del Sorteo
                    </h3>

                    {winners.length === 0 ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                            <Ticket size={36} style={{ strokeWidth: 1.5, marginBottom: "0.5rem", opacity: 0.5 }} />
                            <p style={{ fontSize: "0.875rem", margin: 0 }}>Aún no se ha realizado ningún sorteo.</p>
                        </div>
                    ) : (
                        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {winners.map((win) => (
                                <div key={win.id} style={{
                                    border: "1px solid #f1f5f9",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "12px",
                                    backgroundColor: "#fafafb",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#334155" }}>
                                            {win.raffle_participants?.name || "Participante Eliminado"}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                                            <Calendar size={12} />
                                            {new Date(win.drawn_at).toLocaleString("es-AR")}
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: "#fef08a",
                                        color: "#854d0e",
                                        fontWeight: "800",
                                        fontFamily: "monospace",
                                        fontSize: "1rem",
                                        padding: "4px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #fde047"
                                    }}>
                                        #{win.raffle_participants ? String(win.raffle_participants.number).padStart(3, "0") : "???"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Full Participants List */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                padding: "2rem",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Listado de Participantes ({participants.length})
                    </h3>
                    <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, DNI, teléfono o número..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.5rem 1rem 0.5rem 2.25rem",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontSize: "0.875rem",
                                outline: "none"
                            }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#475569", fontWeight: "600" }}>
                                <th style={{ padding: "0.75rem 1rem" }}>Ticket</th>
                                <th style={{ padding: "0.75rem 1rem" }}>Nombre y Apellido</th>
                                <th style={{ padding: "0.75rem 1rem" }}>DNI</th>
                                <th style={{ padding: "0.75rem 1rem" }}>Teléfono</th>
                                <th style={{ padding: "0.75rem 1rem" }}>Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "2rem", color: "#94a3b8", textAlign: "center" }}>
                                        No se encontraron participantes registrados.
                                    </td>
                                </tr>
                            ) : (
                                filteredParticipants.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }} className="table-row">
                                        <td style={{ padding: "0.75rem 1rem", fontWeight: "bold", fontFamily: "monospace", color: "#ff6b9d" }}>
                                            #{String(p.number).padStart(3, "0")}
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>{p.name}</td>
                                        <td style={{ padding: "0.75rem 1rem" }}>{p.dni}</td>
                                        <td style={{ padding: "0.75rem 1rem" }}>{p.phone}</td>
                                        <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>
                                            {new Date(p.created_at).toLocaleString("es-AR")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .grid-responsive {
                    display: grid;
                    grid-template-columns: 3fr 2fr;
                    gap: 2rem;
                }
                @media (max-width: 900px) {
                    .grid-responsive {
                        grid-template-columns: 1fr;
                    }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .table-row:hover {
                    background-color: #f8fafc;
                }
            `}</style>
        </div>
    );
}
