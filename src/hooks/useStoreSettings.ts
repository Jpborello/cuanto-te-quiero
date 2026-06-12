import { useState, useEffect } from "react";
import { getStoreSettings, StoreSettings } from "@/lib/settings";

export function useStoreSettings() {
    const [settings, setSettings] = useState<StoreSettings>({
        cart_enabled: false,
        prices_enabled: true,
        raffle_enabled: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoreSettings().then((res) => {
            setSettings(res);
            setLoading(false);
        });
    }, []);

    return { settings, loading };
}
