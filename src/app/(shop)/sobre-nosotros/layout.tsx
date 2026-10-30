import { Metadata } from "next";

const description = "Conocé Cuanto Te Quiero: tienda de muebles infantiles, blanquería, accesorios para bebés y futura mamá en Mendoza 6378, Rosario.";

export const metadata: Metadata = {
    title: "Sobre Nosotros | Cuanto Te Quiero",
    description,
    alternates: { canonical: "/sobre-nosotros" },
    openGraph: {
        title: "Sobre Nosotros | Cuanto Te Quiero",
        description,
        type: "website",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
