import { CatalogProvider } from "@/components/shop/CatalogContext";
import { getActiveCategoriesWithSubcategories } from "@/lib/catalog";

// Catalog pages are rendered on the server and refreshed every 5 minutes
export const revalidate = 300;

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await getActiveCategoriesWithSubcategories();

    return (
        <CatalogProvider categories={categories.map(({ id, name }) => ({ id, name }))}>
            <div className="main-content">
                {children}
            </div>
        </CatalogProvider>
    );
}
