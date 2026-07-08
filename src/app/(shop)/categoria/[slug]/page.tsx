import { Metadata } from "next";
import CategoryClient from "./CategoryClient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Convert slug back to name format for DB query (replaces hyphens with spaces)
    const dbQueryName = slug.replace(/-/g, ' ');

    // Fetch the category name from Supabase case-insensitively
    const { data: category } = await supabase
        .from("categories")
        .select("name")
        .ilike("name", dbQueryName)
        .maybeSingle();

    const name = category?.name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${name} | Cuanto Te Quiero`,
        description: `Descubrí nuestra colección de ${name} en Rosario. Los mejores productos infantiles, cunas y accesorios con atención personalizada.`,
        openGraph: {
            title: `${name} | Cuanto Te Quiero`,
            description: `Descubrí nuestra colección de ${name} en Rosario. Los mejores productos infantiles, cunas y accesorios con atención personalizada.`,
            type: "website",
        }
    };
}

export default async function Page() {
    return <CategoryClient />;
}
