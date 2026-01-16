"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    { id: 1, src: "/images/hero-main.png", alt: "Cuanto Te Quiero - Colección Bebé" },
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);

    useEffect(() => {
        if (!autoplay) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoplay]);

    const goToPrevious = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setAutoplay(false);
    };

    const goToNext = () => {
        setIndex((prev) => (prev + 1) % slides.length);
        setAutoplay(false);
    };

    const goToSlide = (slideIndex: number) => {
        setIndex(slideIndex);
        setAutoplay(false);
    };

    return (
        <div
            className="hero-container"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
        >
            {/* Imagen del hero */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-slide-wrapper"
                >
                    <Image
                        src={slides[index].src}
                        alt={slides[index].alt}
                        width={1920}
                        height={1080}
                        className="hero-image"
                        priority
                        unoptimized
                        sizes="100vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* MARCA */}
            <div className="hero-brand">
                {/* CUANTO */}
                <div className="hero-brand-top">
                    <svg viewBox="0 0 500 120" width="500" height="120">
                        <path
                            id="curve-top"
                            d="M 50 100 Q 250 20 450 100"
                            fill="transparent"
                        />
                        <text>
                            <textPath
                                href="#curve-top"
                                startOffset="50%"
                                textAnchor="middle"
                            >
                                CUANTO
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* TE QUIERO */}
                <div className="hero-brand-bottom">
                    <svg viewBox="0 0 500 160" width="500" height="160">
                        <path
                            id="curve-bottom"
                            d="M 50 40 Q 250 140 450 40"
                            fill="transparent"
                        />
                        <text>
                            <textPath
                                href="#curve-bottom"
                                startOffset="50%"
                                textAnchor="middle"
                            >
                                TE QUIERO
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>

            {/* Navegación */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="hero-nav-button prev"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="hero-nav-button next"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="hero-dots-container">
                        {slides.map((_, slideIndex) => (
                            <motion.button
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className={`hero-dot ${slideIndex === index ? "active" : "inactive"
                                    }`}
                                aria-label={`Ir a slide ${slideIndex + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
