import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";
import { breadcrumbJsonLd, getCategoryBySlug, getSubcategoriesWithImages, slugify } from "@/lib/catalog";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return { title: "Categoría no encontrada | Cuanto Te Quiero", robots: { index: false } };
    }

    const name = category.name;
    const description = `Descubrí nuestra colección de ${name.toLowerCase()} en Rosario. Los mejores productos infantiles, cunas y accesorios con atención personalizada.`;

    return {
        title: `${name} | Cuanto Te Quiero`,
        description,
        alternates: {
            canonical: `/categoria/${slugify(name)}`,
        },
        openGraph: {
            title: `${name} | Cuanto Te Quiero`,
            description,
            type: "website",
        }
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const subcategories = await getSubcategoriesWithImages(category.id);
    const categoryPath = `/categoria/${slugify(category.name)}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd([
                        { name: "Inicio", path: "" },
                        { name: category.name, path: categoryPath },
                    ]))
                }}
            />
            <CategoryClient category={category} subcategories={subcategories} />
        </>
    );
}
