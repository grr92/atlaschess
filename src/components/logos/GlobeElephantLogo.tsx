import React from 'react';

export const GlobeElephantLogo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl transition-transform duration-300 hover:scale-105"
            >
                {/* El Globo Terráqueo / Tablero */}
                <circle cx="100" cy="100" r="85" fill="#1E293B" stroke="#D4AF37" strokeWidth="4" />

                {/* Latitudes y Longitudes (Cuadrícula del tablero curvada) */}
                <g stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" fill="none">
                    <ellipse cx="100" cy="100" rx="40" ry="85" />
                    <ellipse cx="100" cy="100" rx="85" ry="40" />
                    <line x1="100" y1="15" x2="100" y2="185" />
                    <line x1="15" y1="100" x2="185" y2="100" />
                </g>

                {/* Silueta del Elefante de Chaturanga (Terracota) */}
                <g transform="translate(0, 10)">
                    <path
                        d="M 130 50 C 90 50 60 80 60 120 C 60 145 70 165 85 165 C 95 165 100 145 95 125 C 110 135 120 125 120 105 L 120 160 L 145 160 L 145 95 C 155 95 165 85 165 65 C 165 55 145 50 130 50 Z"
                        fill="#C84B31"
                    />
                    {/* Colmillo del elefante (Hueso) */}
                    <path
                        d="M 95 115 Q 75 120 70 100 Q 85 105 95 105 Z"
                        fill="#F5F5F4"
                    />
                    {/* Ojo */}
                    <circle cx="120" cy="75" r="4" fill="#F5F5F4" />
                </g>
            </svg>
        </div>
    );
};