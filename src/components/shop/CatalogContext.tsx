"use client";

import { createContext, useContext } from "react";

export interface CatalogCategory {
    id: string;
    name: string;
}

// Categories loaded on the server by the shop layout, so Header/Footer links are in the HTML
const CatalogContext = createContext<CatalogCategory[] | null>(null);

export function CatalogProvider({ categories, children }: { categories: CatalogCategory[]; children: React.ReactNode }) {
    return <CatalogContext.Provider value={categories}>{children}</CatalogContext.Provider>;
}

export function useCatalogCategories() {
    return useContext(CatalogContext);
}
