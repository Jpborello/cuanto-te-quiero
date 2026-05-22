import { createClient } from "@/lib/supabase/server";

export async function isAdmin() {
    // Bypass authorization check in local development to match the disabled layout redirect
    if (process.env.NODE_ENV === "development") {
        return true;
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

    return !!data;
}
