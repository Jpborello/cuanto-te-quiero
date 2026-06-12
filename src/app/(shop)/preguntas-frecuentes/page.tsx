"use client";

import { useState } from "react";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

export default function PreguntasFrecuentesPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "¿Tienen devolución?",
            answer: "Para devoluciones y problemas con productos, por favor contactarse por WhatsApp con nuestro soporte."
        },
        {
            question: "¿Tienen garantía los productos?",
            answer: "Todo lo que es mueblería trabajamos con productos de alta calidad. Siempre hacemos chequeos frecuentes de nuestros productos para que cuando los tengas que usar o armar no tengas mayores complicaciones."
        },
        {
            question: "¿Los muebles vienen armados?",
            answer: "Los muebles pueden ir armados o desarmados, siempre dependiendo del producto y el tamaño del mismo."
        },
        {
            question: "¿Vivo en un edificio, ustedes lo suben?",
            answer: "Sí, contamos con personal para ese servicio. Aun así, siempre consultar previamente con un asesor."
        }
    ];

    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Header />
            <main style={{ minHeight: "100vh", backgroundColor: "#fafafa", padding: "4rem 2rem" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: "#fff0f5",
                            padding: "0.5rem 1.25rem",
                            borderRadius: "50px",
                            marginBottom: "1rem"
                        }}>
                            <HelpCircle size={18} color="#ffc0cb" />
                            <span style={{ color: "#ff6b9d", fontWeight: "600", fontSize: "0.9rem" }}>Soporte</span>
                        </div>
                        <h1 style={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            fontFamily: "var(--font-bubblegum)",
                            background: "linear-gradient(135deg, #ffc0cb 0%, #ff6b9d 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            letterSpacing: "0.5px",
                            margin: 0
                        }}>
                            Preguntas Frecuentes
                        </h1>
                        <p style={{ color: "#666", marginTop: "0.5rem" }}>
                            Despejá tus dudas sobre devoluciones, armado de muebles, entregas y más.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                        border: "1px solid #f0f0f0",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <button
                                        onClick={() => toggleIndex(index)}
                                        style={{
                                            width: "100%",
                                            padding: "1.5rem",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "none",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            outline: "none"
                                        }}
                                    >
                                        <span style={{
                                            fontSize: "1.125rem",
                                            fontWeight: "600",
                                            color: isOpen ? "#ff6b9d" : "#333",
                                            transition: "color 0.2s ease"
                                        }}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                color: isOpen ? "#ff6b9d" : "#999",
                                                transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                                                transition: "transform 0.3s ease, color 0.3s ease"
                                            }}
                                        />
                                    </button>

                                    <div style={{
                                        maxHeight: isOpen ? "200px" : "0",
                                        opacity: isOpen ? 1 : 0,
                                        overflow: "hidden",
                                        transition: "all 0.3s cubic-bezier(0, 1, 0, 1)",
                                        padding: isOpen ? "0 1.5rem 1.5rem 1.5rem" : "0 1.5rem"
                                    }}>
                                        <p style={{
                                            color: "#666",
                                            lineHeight: "1.6",
                                            fontSize: "0.95rem",
                                            margin: 0
                                        }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
