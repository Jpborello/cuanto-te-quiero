import { Metadata } from "next";
import SubcategoryClient from "./SubcategoryClient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
    params: Promise<{ slug: string; subslug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { subslug } = await params;

    // Convert subslug back to name format for DB query (replaces hyphens with spaces)
    const dbQueryName = subslug.replace(/-/g, ' ');

    // Fetch the subcategory name from Supabase case-insensitively
    const { data: subcategory } = await supabase
        .from("subcategories")
        .select("name")
        .ilike("name", dbQueryName)
        .maybeSingle();

    const name = subcategory?.name || subslug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${name} | Cuanto Te Quiero`,
        description: `Encontrá ${name} en Rosario. Te ofrecemos productos infantiles, cunas y accesorios hechos con amor para el bienestar de tu bebé.`,
        openGraph: {
            title: `${name} | Cuanto Te Quiero`,
            description: `Encontrá ${name} en Rosario. Te ofrecemos productos infantiles, cunas y accesorios hechos con amor para el bienestar de tu bebé.`,
            type: "website",
        }
    };
}

export default async function Page() {
    return <SubcategoryClient />;
}
