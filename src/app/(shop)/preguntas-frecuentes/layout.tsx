import { Metadata } from "next";
import { FAQS } from "./faqs";

const description = "Respuestas sobre devoluciones, garantía, armado de muebles y entregas en Cuanto Te Quiero, Rosario.";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | Cuanto Te Quiero",
    description,
    alternates: { canonical: "/preguntas-frecuentes" },
    openGraph: {
        title: "Preguntas Frecuentes | Cuanto Te Quiero",
        description,
        type: "website",
    },
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    );
}
