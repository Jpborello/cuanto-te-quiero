import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingCart, Gift, TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch data in parallel
    const [
        { count: productsCount },
        { count: lowStockCount },
        { count: ordersPendingCount },
        { count: ordersTotalCount },
        { count: giftCardsCount },
        { count: giftCardsUsedCount }
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).lt("stock", 5),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("gift_cards").select("*", { count: "exact", head: true }).eq("is_used", false),
        supabase.from("gift_cards").select("*", { count: "exact", head: true }).eq("is_used", true)
    ]);

    const stats = [
        {
            title: "Pedidos Totales",
            value: ordersTotalCount || 0,
            subtitle: `${ordersPendingCount || 0} pendientes de procesar`,
            icon: ShoppingCart,
            iconBg: "#dbeafe",
            iconColor: "#2563eb",
            link: "/admin/orders",
            alert: (ordersPendingCount || 0) > 0,
            trend: "+12%"
        },
        {
            title: "Productos Activos",
            value: productsCount || 0,
            subtitle: `${lowStockCount || 0} con stock bajo`,
            icon: Package,
            iconBg: "#e9d5ff",
            iconColor: "#9333ea",
            link: "/admin/products",
            alert: (lowStockCount || 0) > 0,
            trend: "+5%"
        },
        {
            title: "Gift Cards",
            value: giftCardsCount || 0,
            subtitle: `${giftCardsUsedCount || 0} ya utilizadas`,
            icon: Gift,
            iconBg: "#fce7f3",
            iconColor: "#ec4899",
            link: "/admin/gift-cards",
            alert: false,
            trend: "+8%"
        }
    ];

    return (
        <div>
            {/* Welcome Header */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                color: 'white',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '16rem',
                    height: '16rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    marginRight: '-8rem',
                    marginTop: '-8rem'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '12rem',
                    height: '12rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    marginLeft: '-6rem',
                    marginBottom: '-6rem'
                }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '1rem'
                        }}>
                            <TrendingUp size={32} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
                            <p style={{ opacity: 0.9, fontSize: '1.125rem' }}>Bienvenido al panel de administración</p>
                        </div>
                    </div>
                    <p style={{ opacity: 0.8, maxWidth: '48rem' }}>
                        Gestiona tu tienda, monitorea ventas y mantén el control de tu inventario desde un solo lugar.
                    </p>
                </div>
            </div>

            {/* Stats Grid - HORIZONTAL */}
            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            href={stat.link}
                            className="admin-card"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Header with Icon and Alert */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    background: stat.iconBg,
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <Icon color={stat.iconColor} size={32} />
                                </div>
                                {stat.alert && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        background: '#fef3c7',
                                        color: '#b45309',
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        border: '2px solid #fde68a'
                                    }}>
                                        <AlertTriangle size={14} />
                                        Atención
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.75rem'
                                }}>
                                    {stat.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                    <p className="stat-card-value">
                                        {stat.value}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        color: '#16a34a',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold'
                                    }}>
                                        <ArrowUpRight size={16} />
                                        {stat.trend}
                                    </div>
                                </div>
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: stat.alert ? '#b45309' : '#64748b',
                                    marginTop: '0.5rem'
                                }}>
                                    {stat.subtitle}
                                </p>
                            </div>

                            {/* Action Hint */}
                            <div style={{
                                paddingTop: '1rem',
                                borderTop: '2px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#9ca3af'
                                }}>
                                    Ver detalles
                                </span>
                                <ArrowUpRight size={16} style={{ color: '#9ca3af' }} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
                        borderRadius: '1rem'
                    }}>
                        <CheckCircle color="#6366f1" size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>Acciones Rápidas</h2>
                        <p style={{ color: '#64748b' }}>Accede rápidamente a las funciones más usadas</p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <Link
                        href="/admin/products/new"
                        className="admin-card"
                        style={{
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #eef2ff 0%, #fae8ff 100%)',
                            border: '2px solid #c7d2fe',
                            textAlign: 'center',
                            padding: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <Package color="#6366f1" size={28} />
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Nuevo Producto</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Agregar al catálogo</p>
                    </Link>

                    <Link
                        href="/admin/gift-cards"
                        className="admin-card"
                        style={{
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)',
                            border: '2px solid #fbcfe8',
                            textAlign: 'center',
                            padding: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <Gift color="#ec4899" size={28} />
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Nueva Gift Card</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Generar código</p>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="admin-card"
                        style={{
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #dbeafe 0%, #cffafe 100%)',
                            border: '2px solid #bfdbfe',
                            textAlign: 'center',
                            padding: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <ShoppingCart color="#2563eb" size={28} />
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Ver Pedidos</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Gestionar ventas</p>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="admin-card"
                        style={{
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                            border: '2px solid #fde68a',
                            textAlign: 'center',
                            padding: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <TrendingUp color="#f59e0b" size={28} />
                        </div>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Categorías</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Organizar productos</p>
                    </Link>
                </div>
            </div>

            {/* Alerts Section */}
            {((lowStockCount || 0) > 0 || (ordersPendingCount || 0) > 0) && (
                <div className="admin-card" style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                    border: '2px solid #fde68a'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            flexShrink: 0
                        }}>
                            <AlertTriangle color="white" size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: 'bold', color: '#78350f', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Alertas del Sistema</h3>
                            <p style={{ color: '#b45309', marginBottom: '1rem' }}>Hay elementos que requieren tu atención</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(lowStockCount || 0) > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: 'rgba(255,255,255,0.6)',
                                        padding: '1rem',
                                        borderRadius: '0.75rem'
                                    }}>
                                        <div style={{ width: '0.5rem', height: '0.5rem', background: '#b45309', borderRadius: '50%', flexShrink: 0 }}></div>
                                        <span style={{ color: '#78350f', fontWeight: '500', flex: 1 }}>
                                            <strong style={{ fontSize: '1.125rem' }}>{lowStockCount}</strong> producto(s) con stock bajo o agotado
                                        </span>
                                        <Link href="/admin/products" style={{
                                            color: '#b45309',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            textDecoration: 'none'
                                        }}>
                                            Ver <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                )}
                                {(ordersPendingCount || 0) > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: 'rgba(255,255,255,0.6)',
                                        padding: '1rem',
                                        borderRadius: '0.75rem'
                                    }}>
                                        <div style={{ width: '0.5rem', height: '0.5rem', background: '#b45309', borderRadius: '50%', flexShrink: 0 }}></div>
                                        <span style={{ color: '#78350f', fontWeight: '500', flex: 1 }}>
                                            <strong style={{ fontSize: '1.125rem' }}>{ordersPendingCount}</strong> pedido(s) pendiente(s) de procesar
                                        </span>
                                        <Link href="/admin/orders" style={{
                                            color: '#b45309',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            textDecoration: 'none'
                                        }}>
                                            Ver <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
