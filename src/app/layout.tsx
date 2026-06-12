import type { Metadata } from "next";
import { Inter, Bubblegum_Sans } from "next/font/google"; // Import Bubblegum Sans
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const bubblegumSans = Bubblegum_Sans({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-bubblegum"
});

export const metadata: Metadata = {
    title: "Cuanto Te Quiero | Muebles, Blanquería e Indumentaria Infantil en Rosario",
    description: "Descubrí en Cuanto Te Quiero los mejores muebles infantiles, cunas, blanquería y accesorios para tu bebé. Acompañamos cada etapa de tu dulce espera con atención personalizada en Rosario.",
    keywords: ["muebles infantiles rosario", "cunas funcionales rosario", "cochecitos de bebe rosario", "ropa de bebe rosario", "blanqueria infantil rosario", "cuanto te quiero rosario", "cuna colecho rosario"],
    authors: [{ name: "Cuanto Te Quiero" }],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Cuanto Te Quiero | Muebles y Artículos Infantiles en Rosario",
        description: "Todo lo que tu bebé necesita, con el amor que se merece. Cunas funcionales, cochecitos, blanquería y asesoramiento cálido y familiar.",
        url: "https://cuantotequiero.com.ar",
        siteName: "Cuanto Te Quiero",
        locale: "es_AR",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Cuanto Te Quiero",
        "image": "https://cuantotequiero.com.ar/logo.png",
        "@id": "https://cuantotequiero.com.ar/#localbusiness",
        "url": "https://cuantotequiero.com.ar",
        "telephone": "+5493416029814",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Mendoza 6378",
            "addressLocality": "Rosario",
            "addressRegion": "Santa Fe",
            "postalCode": "S2000",
            "addressCountry": "AR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -32.9477,
            "longitude": -60.7042
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "19:00"
        },
        "sameAs": [
            "https://www.facebook.com/cuantotequieroCTQ",
            "https://www.instagram.com/cuanto_tequiero/"
        ]
    };

    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${inter.className} ${bubblegumSans.variable}`} suppressHydrationWarning>
                {/* JSON-LD de Google Local Business */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </body>
        </html>
    );
}
