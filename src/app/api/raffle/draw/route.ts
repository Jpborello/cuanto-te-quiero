import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdmin } from "@/lib/isAdmin";

export const dynamic = "force-dynamic";

// 1. GET - Fetch participants, winners and raffle configuration (Admin only)
export async function GET(req: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all participants
        const { data: participants, error: partError } = await supabaseAdmin
            .from("raffle_participants")
            .select("*")
            .order("created_at", { ascending: false });

        if (partError) throw partError;

        // Fetch winners joined with participant details
        const { data: winners, error: winError } = await supabaseAdmin
            .from("raffle_winners")
            .select(`
                id,
                drawn_at,
                participant_id,
                raffle_participants (
                    name,
                    dni,
                    phone,
                    number
                )
            `)
            .order("drawn_at", { ascending: false });

        if (winError) throw winError;

        // Fetch raffle status from settings
        const { data: settingRow } = await supabaseAdmin
            .from("settings")
            .select("value")
            .eq("key", "raffle_enabled")
            .maybeSingle();

        const raffleEnabled = settingRow?.value === true || settingRow?.value === "true";

        return NextResponse.json({
            success: true,
            participants: participants || [],
            winners: winners || [],
            raffleEnabled
        });

    } catch (error: any) {
        console.error("Error in GET /api/raffle/draw:", error);
        return NextResponse.json({ error: error.message || "Error al obtener datos" }, { status: 500 });
    }
}

// 2. POST - Register a winner (Admin only)
export async function POST(req: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { participant_id } = await req.json();

        if (!participant_id) {
            return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("raffle_winners")
            .insert({ participant_id })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            winner: data
        });

    } catch (error: any) {
        console.error("Error in POST /api/raffle/draw:", error);
        return NextResponse.json({ error: error.message || "Error al registrar el ganador" }, { status: 500 });
    }
}

// 3. PATCH - Enable or disable welcome raffle popup (Admin only)
export async function PATCH(req: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { enabled } = await req.json();

        if (enabled === undefined) {
            return NextResponse.json({ error: "enabled parameter is required" }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from("settings")
            .upsert({
                key: "raffle_enabled",
                value: enabled
            });

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error in PATCH /api/raffle/draw:", error);
        return NextResponse.json({ error: error.message || "Error al guardar configuración" }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { action } = await req.json();

        if (action === "clear_all") {
            // Delete all winners and participants to reset the raffle campaign
            const { error: winErr } = await supabaseAdmin
                .from("raffle_winners")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

            if (winErr) throw winErr;

            const { error: partErr } = await supabaseAdmin
                .from("raffle_participants")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000");

            if (partErr) throw partErr;

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Error in DELETE /api/raffle/draw:", error);
        return NextResponse.json({ error: error.message || "Error al reiniciar el sorteo" }, { status: 500 });
    }
}
