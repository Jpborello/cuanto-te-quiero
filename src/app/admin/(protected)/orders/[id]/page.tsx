import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, MapPin, Phone, Mail, User, CreditCard, Gift } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Order details with relations
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
            *,
            customers (*),
            order_items (
                *,
                products (
                    name,
                    image_url
                )
            ),
            gift_cards (
                code,
                amount
            )
        `)
        .eq("id", id)
        .single();

    if (error || !order) {
        return notFound();
    }

    const customer = order.customers || {};
    // Fallback if data is flat on orders table (legacy support)
    const customerName = customer.full_name || order.customer_name || "Cliente Desconocido";
    const customerPhone = customer.phone || order.customer_phone || "-";
    const customerEmail = customer.email || order.customer_email || "-";
    const address = customer.address || order.shipping_address || "-";
    const city = customer.city || order.shipping_city || "";

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="admin-page-title text-xl mb-0">Pedido #{order.id.slice(0, 8)}</h1>
                        <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        {format(new Date(order.created_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="admin-card">
                        <h3 className="section-title mb-4">Productos</h3>
                        <div className="divide-y divide-gray-100">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="py-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        {item.products?.image_url ? (
                                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.products?.name || "Producto Eliminado"}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x ${item.unit_price?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="font-bold text-gray-700">
                                        ${(item.quantity * item.unit_price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals Section inside items card */}
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${order.total?.toLocaleString()}</span>
                            </div>
                            {/* Assuming shipping cost field exists or logic */}
                            {/* <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span>$0.00</span>
                            </div> */}
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                <span>Total</span>
                                <span>${order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Info */}
                <div className="space-y-6">

                    {/* Customer Card */}
                    <div className="admin-card">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User size={16} /> Datos del Cliente
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{customerName}</p>
                                <a href={`mailto:${customerEmail}`} className="text-sm text-[var(--admin-accent)] hover:underline flex items-center gap-2 mt-1">
                                    <Mail size={14} /> {customerEmail}
                                </a>
                                <a href={`tel:${customerPhone}`} className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                    <Phone size={14} /> {customerPhone}
                                </a>
                            </div>
                            <hr className="border-gray-100" />
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">DIRECCIÓN DE ENVÍO</p>
                                <div className="flex items-start gap-2 text-sm text-gray-700">
                                    <MapPin size={16} className="mt-0.5 text-gray-400" />
                                    <div>
                                        <p>{address}</p>
                                        <p>{city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="admin-card">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CreditCard size={16} /> Pago
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">MEDIO DE PAGO</p>
                                <p className="font-medium capitalize text-gray-700">
                                    {order.payment_method === 'gift_card' ? 'Gift Card' : order.payment_method}
                                </p>
                            </div>

                            {order.gift_cards && (
                                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                    <p className="text-xs text-indigo-400 mb-1 flex items-center gap-1">
                                        <Gift size={12} /> GIFT CARD APLICADA
                                    </p>
                                    <p className="font-mono font-bold text-indigo-700">{order.gift_cards.code}</p>
                                    <p className="text-xs text-indigo-600 mt-1">Monto original: ${order.gift_cards.amount?.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ImageIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
    )
}
