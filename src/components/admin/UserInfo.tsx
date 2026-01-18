"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserInfo() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
    }, []);

    if (!userId) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 text-xs">
            <p className="font-bold text-gray-500">Admin Debug</p>
            <p className="text-[var(--brand-brown)] font-mono select-all">
                {userId}
            </p>
            <p className="text-gray-400 mt-1">Copy ID to add to 'admins' table</p>
        </div>
    );
}
