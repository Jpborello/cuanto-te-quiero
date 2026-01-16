"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    { id: 1, src: '/images/hero-main.png', alt: 'Cuanto Te Quiero - Colección Bebé' },
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
            {/* Carousel Container - Natural Aspect Ratio */}
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

            {/* Navigation Buttons - Hidden if only 1 slide */}
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

                    {/* Dot Indicators */}
                    <div className="hero-dots-container">
                        {slides.map((_, slideIndex) => (
                            <motion.button
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className={`hero-dot ${slideIndex === index ? 'active' : 'inactive'}`}
                                aria-label={`Ir a slide ${slideIndex + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}