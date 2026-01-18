import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, ShoppingBag, Filter, Search } from "lucide-react";

export default async function AdminOrders() {
    const supabase = await createClient();

    // Fetch orders with customer info (assuming relationship or embedded data)
    // If 'customers' is a separate table and foreign key exists:
    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            customers (
                full_name
            )
        `)
        .order("created_at", { ascending: false });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Pagado';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            case 'shipped': return 'Enviado';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return '✅';
            case 'pending': return '⏳';
            case 'cancelled': return '❌';
            case 'shipped': return '📦';
            default: return '📋';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="admin-page-header mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                        <ShoppingBag className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="admin-page-title">Pedidos</h1>
                        <p className="admin-page-subtitle">Monitorea y gestiona las ventas recientes</p>
                    </div>
                </div>
            </div>

            {/* Filters Section (Placeholder for future implementation) */}
            <div className="admin-card mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, ID de pedido..."
                            className="form-input pl-10"
                            disabled
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2" disabled>
                        <Filter size={18} />
                        Filtros
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">🚧 Filtros y búsqueda próximamente</p>
            </div>

            {/* Orders Table */}
            <div className="admin-card-elevated p-0 overflow-hidden">
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="pl-6">Pedido</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Medio Pago</th>
                                <th>Total</th>
                                <th className="pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!orders || orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-100 rounded-full">
                                                <ShoppingBag className="text-gray-400" size={32} />
                                            </div>
                                            <p className="text-gray-500 font-medium">No hay pedidos registrados</p>
                                            <p className="text-sm text-gray-400">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-bold text-indigo-600">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    ID: {order.id.slice(0, 12)}...
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {format(new Date(order.created_at), "d MMM yyyy", { locale: es })}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(order.created_at), "HH:mm", { locale: es })}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {(order.customers?.full_name || order.customer_name || 'C')[0].toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {order.customers?.full_name || order.customer_name || 'Consumidor Final'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center gap-1.5 text-xs uppercase font-bold px-3 py-1.5 rounded-full border-2 ${getStatusColor(order.status)}`}>
                                                <span>{getStatusIcon(order.status)}</span>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-lg">
                                                {order.payment_method || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-lg text-gray-900">
                                                ${order.total?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="pr-6">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-medium transition-colors"
                                                title="Ver Detalle"
                                            >
                                                <Eye size={16} />
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            {orders && orders.length > 0 && (
                <div className="admin-card mt-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Mostrando <span className="font-bold text-gray-900">{orders.length}</span> pedido(s)
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-gray-600">
                                    {orders.filter((o: any) => o.status === 'pending').length} Pendientes
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-gray-600">
                                    {orders.filter((o: any) => o.status === 'paid').length} Pagados
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
