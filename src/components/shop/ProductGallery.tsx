"use client";

import { useState } from "react";
import { Package } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#f5f5f5',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
            }}>
                <Package size={80} style={{ color: '#ccc' }} />
                <p style={{ color: '#999', fontSize: '1rem' }}>Sin imágenes disponibles</p>
            </div>
        );
    }

    const currentImage = images[selectedIndex];

    return (
        <div style={{ width: '100%' }}>
            {/* Main Image */}
            <div
                style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <img
                    src={currentImage}
                    alt={`${productName} - imagen ${selectedIndex + 1}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                        transform: isZoomed ? 'scale(1.5)' : 'scale(1)'
                    }}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem'
                }}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            style={{
                                minWidth: '80px',
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: selectedIndex === index ? '3px solid #ffc0cb' : '3px solid transparent',
                                transition: 'all 0.2s ease',
                                opacity: selectedIndex === index ? 1 : 0.6
                            }}
                            onMouseOver={(e) => {
                                if (selectedIndex !== index) {
                                    e.currentTarget.style.opacity = '0.8';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedIndex !== index) {
                                    e.currentTarget.style.opacity = '0.6';
                                }
                            }}
                        >
                            <img
                                src={image}
                                alt={`${productName} - miniatura ${index + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    margin: 'auto'
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
