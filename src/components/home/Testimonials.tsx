"use client";

import { motion } from "framer-motion";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    initials: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "La cunita llegó perfecta. Mi bebé duerme como un angelito y yo duermo tranquila sabiendo que está seguro.",
        author: "Lucía",
        role: "mamá de Mateo, 3 meses",
        initials: "L"
    },
    {
        id: 2,
        quote: "No solo es hermosa, sino que se nota la calidad en cada detalle. Valió cada peso invertido.",
        author: "Carolina",
        role: "mamá de Emma, 6 meses",
        initials: "C"
    },
    {
        id: 3,
        quote: "Me asesoraron con tanta paciencia para elegir lo mejor para el cuarto de Benja. Se siente el amor que le ponen.",
        author: "Martina",
        role: "mamá de Benjamín, 1 año",
        initials: "M"
    }
];

export default function Testimonials() {
    return (
        <section className="testimonials-section">
            <motion.h2
                className="testimonials-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                💬 Lo que dicen nuestras mamás
            </motion.h2>

            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                        {/* Avatar con iniciales */}
                        <div className="testimonial-avatar">
                            {testimonial.initials}
                        </div>

                        {/* Quote */}
                        <blockquote className="testimonial-quote">
                            "{testimonial.quote}"
                        </blockquote>

                        {/* Author info */}
                        <div>
                            <p className="testimonial-author">— {testimonial.author}</p>
                            <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
