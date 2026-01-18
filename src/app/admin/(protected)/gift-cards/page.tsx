import { createClient } from "@/lib/supabase/server";
import GiftCardManager from "@/components/admin/GiftCardManager";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminGiftCards() {
    const supabase = await createClient();

    const { data: giftCards } = await supabase
        .from("gift_cards")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="page-header-actions mb-8">
                <div>
                    <h1 className="admin-page-title">Gift Cards</h1>
                    <p className="admin-page-subtitle">Gestiona y genera tarjetas de regalo digitales</p>
                </div>
                <GiftCardManager />
            </div>

            <div className="admin-card p-0 overflow-hidden">
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Monto</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Comprador / Destino</th>
                                <th>Fecha Creación</th>
                                {/* <th>Acciones</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {!giftCards || giftCards.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        No se encontraron gift cards.
                                    </td>
                                </tr>
                            ) : (
                                giftCards.map((card) => (
                                    <tr key={card.id}>
                                        <td className="font-mono font-bold text-gray-600 select-all">
                                            {card.code}
                                        </td>
                                        <td className="font-bold text-lg">
                                            ${card.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`text-xs uppercase tracking-wider font-semibold px-2 py-1 rounded-md border ${card.type === 'fixed' ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                                {card.type === 'fixed' ? 'Fija' : 'Variable'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${!card.active
                                                    ? 'bg-red-100 text-red-700'
                                                    : card.used_at
                                                        ? 'bg-gray-100 text-gray-500'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${!card.active ? 'bg-red-500' : card.used_at ? 'bg-gray-500' : 'bg-green-500'}`} />
                                                {!card.active ? 'INACTIVA' : card.used_at ? 'USADA' : 'ACTIVA'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{card.buyer_name || '-'}</span>
                                                <span className="text-xs text-gray-400">Para: {card.recipient_name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="text-sm text-gray-500">
                                            {format(new Date(card.created_at), "d MMM yyyy", { locale: es })}
                                        </td>
                                        {/* <td>
                                            <button className="action-btn delete" title="Desactivar">
                                                <Trash2 size={18} />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
