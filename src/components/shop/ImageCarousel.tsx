"use client";

import { useState, useEffect } from "react";
import { FolderOpen } from "lucide-react";

interface ImageCarouselProps {
    images: string[] | null;
    alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000); // Cambiar cada 3 segundos

        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #BDE3F2 0%, #F9CBD3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <FolderOpen size={80} style={{ color: 'white', opacity: 0.8 }} />
            </div>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>
            {/* Images */}
            {images.map((image, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <img
                        src={image}
                        alt={`${alt} - imagen ${index + 1}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            ))}

            {/* Indicators */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10
                }}>
                    {images.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
