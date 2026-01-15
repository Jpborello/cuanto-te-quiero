import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

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
        <html lang="es">
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <Header />
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
