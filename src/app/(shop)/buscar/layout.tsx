import { Metadata } from "next";

// Search results are thin, changing pages: keep them out of the index but let crawlers follow product links
export const metadata: Metadata = {
    title: "Buscar productos | Cuanto Te Quiero",
    robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
