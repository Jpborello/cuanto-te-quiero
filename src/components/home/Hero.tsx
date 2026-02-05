"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    { id: 1, src: "/images/IMG-Hero.png", alt: "Cuanto Te Quiero" },
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
            {/* Gradient Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #ffc0cb 0%, #e6f3ff 50%, #add8e6 100%)',
                zIndex: -1
            }} />

            {/* Imagen del hero */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-slide-wrapper"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        minHeight: '400px'
                    }}
                >
                    <Image
                        src="/images/IMG-Hero.png"
                        alt={slides[index].alt}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="hero-image"
                        priority
                        unoptimized
                        style={{
                            width: '100%',
                            maxWidth: '800px',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </motion.div>
            </AnimatePresence>

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
