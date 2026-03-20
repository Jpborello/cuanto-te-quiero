"use client";

import { useState, useEffect } from "react";

interface AutoRotatingImageProps {
    images: string[];
    alt: string;
    interval?: number; // ms
}

export default function AutoRotatingImage({ images, alt, interval = 3000 }: AutoRotatingImageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validImages = (images || []).map(img => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object') {
            return (img as any).url || (img as any).src || (img as any).image_url || '';
        }
        return '';
    }).filter(src => src && typeof src === 'string' && src.trim() !== '');

    useEffect(() => {
        if (validImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [validImages.length, interval]);

    if (validImages.length === 0) {
        return (
            <div style={{ color: '#ccc', fontSize: '4rem' }}>
                📦
            </div>
        );
    }

    // Para evitar flasheos blancos, renderizamos todas las imágenes apiladas y
    // cambiamos la opacidad.
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {validImages.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`${alt} - vista ${index + 1}`}
                    style={{
                        position: index === 0 ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        display: 'block'
                    }}
                />
            ))}
        </div>
    );
}
