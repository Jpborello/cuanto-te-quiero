"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Package,
    Layers,
    Gift,
    ShoppingCart,
    LogOut,
    Menu,
    X
} from "lucide-react";
import "@/app/admin/admin.css"; // Import standard CSS

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Productos", icon: Package },
        { href: "/admin/categories", label: "Categorías", icon: Layers },
        { href: "/admin/gift-cards", label: "Gift Cards", icon: Gift },
        { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    ];

    return (
        <div className="admin-container">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Admin Panel</h2>
                    <button onClick={() => setSidebarOpen(false)} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleSignOut} className="logout-btn">
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-content">
                <header className="mobile-header">
                    <button onClick={() => setSidebarOpen(true)} className="menu-btn">
                        <Menu size={24} />
                    </button>
                    <span className="sidebar-title">Menú</span>
                </header>

                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
