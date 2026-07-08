"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Hero() {
    const [scrollY, setScrollY] = useState(0);
    const { scrollYProgress } = useScroll();

    // Detectar scroll para animaciones
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animaciones basadas en scroll
    const contentOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const contentScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

    return (
        <div className="hero-container">
            {/* Background - Placeholder gradient (reemplazar con imagen real) */}
            <div className="hero-background">
                <Image
                    src="/images/hero_baby_sleeping_1770473809802.png"
                    alt="Bebé durmiendo en cuna"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                    priority
                />

                {/* Overlay sutil para mejor legibilidad - Ajustado para la imagen */}
                <div className="hero-overlay" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.45) 100%)',
                    backdropFilter: 'blur(0px)'
                }} />
            </div>

            {/* Contenido con animación de scroll */}
            <motion.div
                className="hero-content"
                style={{
                    opacity: contentOpacity,
                    scale: contentScale,
                }}
            >
                <h1 style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    border: '0',
                    whiteSpace: 'nowrap'
                }}>
                    Cuanto Te Quiero | Muebles, Blanquería e Indumentaria Infantil en Rosario
                </h1>

                {/* Logo de Marca */}
                <motion.div
                    className="hero-logo-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Image
                        src="/images/IMG-Hero.png"
                        alt="Cuanto Te Quiero"
                        width={350}
                        height={200}
                        priority
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '350px',
                            filter: 'drop-shadow(0 4px 20px rgba(141, 110, 99, 0.15))'
                        }}
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Creamos espacios llenos de amor, seguridad y ternura para los primeros años de tu pequeño
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <a href="#productos" className="hero-cta" onClick={(e) => {
                        e.preventDefault();
                        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        <Heart size={20} fill="currentColor" />
                        Descubre nuestra colección
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
