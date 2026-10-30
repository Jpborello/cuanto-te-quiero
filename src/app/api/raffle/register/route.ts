import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { name, dni, phone, website } = await req.json();

        // Honeypot: real users never fill this hidden field
        if (website) {
            return NextResponse.json({ error: "Error al procesar el registro" }, { status: 400 });
        }

        // Basic validations
        if (typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
        }
        if (name.trim().length > 100) {
            return NextResponse.json({ error: "El nombre es demasiado largo" }, { status: 400 });
        }
        if (typeof dni !== "string" || !/^\d{7,8}$/.test(dni.trim())) {
            return NextResponse.json({ error: "El DNI debe tener 7 u 8 dígitos numéricos" }, { status: 400 });
        }
        const cleanPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
        if (!/^\d{8,15}$/.test(cleanPhone)) {
            return NextResponse.json({ error: "Ingresá un teléfono válido (solo números, con característica)" }, { status: 400 });
        }

        const cleanName = name.trim();
        const cleanDni = dni.trim();

        // 0. Only accept registrations while the raffle is enabled
        const { data: raffleSetting } = await supabaseAdmin
            .from("settings")
            .select("value")
            .eq("key", "raffle_enabled")
            .maybeSingle();

        if (raffleSetting?.value !== true && raffleSetting?.value !== "true") {
            return NextResponse.json({ error: "El sorteo no está activo en este momento." }, { status: 403 });
        }

        // 1. Check if the DNI or Phone already exists in the database
        const [{ data: dniMatch, error: dniError }, { data: phoneMatch, error: phoneError }] = await Promise.all([
            supabaseAdmin.from("raffle_participants").select("id").eq("dni", cleanDni).limit(1),
            supabaseAdmin.from("raffle_participants").select("id").eq("phone", cleanPhone).limit(1),
        ]);

        if (dniError) throw dniError;
        if (phoneError) throw phoneError;

        if (dniMatch?.length) {
            return NextResponse.json({ error: "Este DNI ya está registrado para el sorteo." }, { status: 409 });
        }
        if (phoneMatch?.length) {
            return NextResponse.json({ error: "Este número de teléfono ya está registrado para el sorteo." }, { status: 409 });
        }

        // 2. Fetch all assigned numbers to find a free one
        const { data: assignedRows, error: fetchError } = await supabaseAdmin
            .from("raffle_participants")
            .select("number");

        if (fetchError) throw fetchError;

        const assignedNumbers = new Set((assignedRows || []).map(r => r.number));
        if (assignedNumbers.size >= 999) {
            return NextResponse.json({ error: "El sorteo ha alcanzado el límite máximo de 999 participantes." }, { status: 409 });
        }

        // Generate list of available numbers
        const availableNumbers: number[] = [];
        for (let i = 1; i <= 999; i++) {
            if (!assignedNumbers.has(i)) {
                availableNumbers.push(i);
            }
        }

        // Pick a random available number
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const assignedNumber = availableNumbers[randomIndex];

        // 3. Insert new participant
        const { data: newParticipant, error: insertError } = await supabaseAdmin
            .from("raffle_participants")
            .insert({
                name: cleanName,
                dni: cleanDni,
                phone: cleanPhone,
                number: assignedNumber
            })
            .select()
            .single();

        if (insertError) {
            // Handle database constraint race condition if number gets assigned right before
            if (insertError.code === "23505") {
                return NextResponse.json({ error: "Error de concurrencia al asignar el número. Intentalo nuevamente." }, { status: 409 });
            }
            throw insertError;
        }

        return NextResponse.json({
            success: true,
            participant: { number: newParticipant.number }
        });

    } catch (error: any) {
        console.error("Error in POST /api/raffle/register:", error);
        return NextResponse.json({ error: "Error al procesar el registro" }, { status: 500 });
    }
}
