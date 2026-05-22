"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UserInfo from "@/components/admin/UserInfo";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            window.location.href = "/admin/dashboard";

        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card animate-in fade-in zoom-in-95 duration-300">
                <div className="login-header">
                    <h1 className="login-title">
                        Bienvenido
                    </h1>
                    <p className="login-subtitle">
                        Ingresá tus credenciales para acceder al panel
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <div className="login-form-group">
                        <label className="login-label">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            placeholder="admin@cuantotequiero.com"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label className="login-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
            <UserInfo />
        </div>
    );
}

