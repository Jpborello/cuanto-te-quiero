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
    title: "Cuanto Te Quiero",
    description: "Tienda online",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${inter.className} ${bubblegumSans.variable}`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
