"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Save, Gift, CreditCard, Sparkles } from "lucide-react";

interface GiftCard {
    id: string;
    code: string;
    amount: number;
    type: 'fixed' | 'variable';
    active: boolean;
    buyer_name?: string;
    recipient_name?: string;
    created_at: string;
    used_at?: string;
}

export default function GiftCardManager() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [mode, setMode] = useState<'fixed' | 'variable'>('fixed');
    const [amount, setAmount] = useState<number>(50000); // Default 50k
    const [buyerName, setBuyerName] = useState("");
    const [recipientName, setRecipientName] = useState("");

    // Fixed amount options
    const fixedOptions = [30000, 50000, 100000, 200000];

    // Helper to generate code
    const generateCode = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 to avoid confusion
        let result = "GIFT";
        for (let i = 0; i < 8; i++) {
            if (i % 4 === 0) result += "-";
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleCreate = async () => {
        if (amount <= 0) {
            alert("El monto debe ser mayor a 0");
            return;
        }

        setLoading(true);
        const code = generateCode();

        try {
            const { error } = await supabase.from("gift_cards").insert({
                code,
                amount,
                type: mode,
                active: true,
                buyer_name: buyerName,
                recipient_name: recipientName
            });

            if (error) throw error;

            setIsModalOpen(false);
            setBuyerName("");
            setRecipientName("");
            setAmount(50000);
            router.refresh();

        } catch (error) {
            console.error("Error creating gift card:", error);
            alert("Error al crear Gift Card");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
            >
                <Plus size={20} />
                Crear Gift Card
            </button>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                        {/* Header with Gradient */}
                        <div className="relative px-8 py-6 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                            <div className="relative flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <Gift className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            Nueva Gift Card
                                            <Sparkles size={20} className="text-yellow-300" />
                                        </h2>
                                        <p className="text-sm text-white/90 mt-1">Genera un código de regalo único</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">

                            {/* Mode Selection */}
                            <div className="form-section">
                                <label className="form-label mb-3">Tipo de Gift Card</label>
                                <div className="flex bg-gray-100 p-1.5 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setMode('fixed')}
                                        className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all ${mode === 'fixed' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        💰 Monto Fijo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMode('variable'); setAmount(10000); }}
                                        className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all ${mode === 'variable' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        ✏️ Monto Variable
                                    </button>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="form-section">
                                <label className="form-label mb-4">Monto del Regalo</label>

                                {mode === 'fixed' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {fixedOptions.map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setAmount(opt)}
                                                className={`py-5 px-6 rounded-2xl border-2 font-bold text-lg transition-all ${amount === opt
                                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 shadow-lg scale-105'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                ${opt.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <span className="text-gray-400 text-2xl font-bold">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            step={10000}
                                            min={10000}
                                            className="w-full pl-14 pr-6 py-5 text-3xl font-bold text-gray-800 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                        />
                                        <p className="text-xs text-gray-400 mt-3 text-right">Pasos de $10.000 sugeridos</p>
                                    </div>
                                )}
                            </div>

                            {/* Info Fields */}
                            <div className="form-section">
                                <label className="form-label mb-4">Información Adicional (Opcional)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="field-group">
                                        <label className="text-xs font-semibold text-gray-500 mb-2 block">Nombre Comprador</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ej: Juan Pérez"
                                            value={buyerName}
                                            onChange={(e) => setBuyerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="field-group">
                                        <label className="text-xs font-semibold text-gray-500 mb-2 block">Nombre Destinatario</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ej: María García"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary/Preview */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                                        <CreditCard className="text-white" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-amber-900 text-lg mb-2">Resumen de la Gift Card</h4>
                                        <div className="space-y-1 text-amber-800">
                                            <p className="text-sm">
                                                💵 Valor: <span className="font-bold text-lg">${amount.toLocaleString()}</span>
                                            </p>
                                            {recipientName && (
                                                <p className="text-sm">
                                                    🎁 Para: <span className="font-semibold">{recipientName}</span>
                                                </p>
                                            )}
                                            {buyerName && (
                                                <p className="text-sm">
                                                    👤 De: <span className="font-semibold">{buyerName}</span>
                                                </p>
                                            )}
                                            <p className="text-xs text-amber-700 mt-3 pt-3 border-t border-amber-200">
                                                ✨ El código se generará automáticamente al guardar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="flex-[2] py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl flex justify-center items-center gap-3 transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Generar Gift Card
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
