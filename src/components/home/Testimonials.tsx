"use client";

import { motion } from "framer-motion";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    date: string;
    stars: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Quiero por la atención desde el minuto cero, por el asesoramiento y recomendación. Por dar la posibilidad de guardar los muebles hasta qe uno puede recibirlos. Me encantó lo que ofrecen así qe obviamente seguiré comprando y recomendaré. 🙌🏼",
        author: "Lorena Chira Samamé",
        role: "Opinión en Google",
        date: "Hace 2 días",
        stars: 5
    },
    {
        id: 2,
        quote: "Es la segunda vez que compramos en la tienda y la experiencia es impecable. Todo lo que es blanquería (acolchados y sábanas) tiene una suavidad espectacular. Una empresa familiar con muchísimo amor por lo que hace.",
        author: "Julieta M.",
        role: "Opinión en Google",
        date: "Hace 1 semana",
        stars: 5
    },
    {
        id: 3,
        quote: "Hermoso el local y la paciencia que nos tuvieron para elegir la cuna funcional y los accesorios. Trabajamos todo con ellos y quedamos felices. ¡El mejor lugar en Rosario para la llegada de nuestro bebé!",
        author: "Valentina R.",
        role: "Opinión en Google",
        date: "Hace 2 semanas",
        stars: 5
    }
];

export default function Testimonials() {
    return (
        <section className="testimonials-section">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2.5rem',
                gap: '0.5rem'
            }}>
                <motion.h2
                    className="testimonials-title"
                    style={{ margin: 0, padding: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    💬 Lo que dicen nuestras familias
                </motion.h2>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#fff',
                    padding: '6px 16px',
                    borderRadius: '99px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: '1px solid #f1f5f9',
                    fontSize: '0.85rem',
                    color: '#64748b'
                }}>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.09-1.34-1.35-2.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Opiniones en Google</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ 4.8 / 5</span>
                </div>
            </div>

            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        className="testimonial-card"
                        style={{ position: 'relative', overflow: 'hidden' }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                        {/* Google Icon at top right */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.12 }}>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.09-1.34-1.35-2.63z" />
                                <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                        </div>

                        {/* Avatar con iniciales */}
                        <div className="testimonial-avatar">
                            {testimonial.author[0]}
                        </div>

                        {/* Stars */}
                        <div style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: '0.75rem', letterSpacing: '2px' }}>
                            {"★".repeat(testimonial.stars)}
                        </div>

                        {/* Quote */}
                        <blockquote className="testimonial-quote" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            "{testimonial.quote}"
                        </blockquote>

                        {/* Author info */}
                        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                            <p className="testimonial-author">— {testimonial.author}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <span>{testimonial.role}</span>
                                <span>•</span>
                                <span>{testimonial.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2.5rem'
            }}>
                <a
                    href="https://www.google.com/search?q=CUANTO+TE+QUIERO+Rosario+Opiniones"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '12px 24px',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '99px',
                        color: '#475569',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)';
                    }}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.09-1.34-1.35-2.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Ver todas las opiniones en Google
                </a>
            </div>
        </section>
    );
}

