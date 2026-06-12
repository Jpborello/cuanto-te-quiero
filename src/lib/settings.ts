import { supabase } from "@/lib/supabase";

export interface StoreSettings {
    cart_enabled: boolean;
    prices_enabled: boolean;
}

export async function getStoreSettings(): Promise<StoreSettings> {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("key, value");

        if (error || !data) {
            // Default fallback if table doesn't exist
            return {
                cart_enabled: false,
                prices_enabled: true
            };
        }

        const settingsMap: Record<string, any> = {};
        data.forEach((row) => {
            settingsMap[row.key] = row.value;
        });

        // Parse boolean values safely from JSON or string
        const parseBool = (val: any, defaultVal: boolean) => {
            if (val === undefined || val === null) return defaultVal;
            if (typeof val === "boolean") return val;
            if (typeof val === "string") return val.toLowerCase() === "true";
            return !!val;
        };

        return {
            cart_enabled: parseBool(settingsMap.cart_enabled, false),
            prices_enabled: parseBool(settingsMap.prices_enabled, true)
        };
    } catch (e) {
        console.error("Error reading store settings:", e);
        return {
            cart_enabled: false,
            prices_enabled: true
        };
    }
}
