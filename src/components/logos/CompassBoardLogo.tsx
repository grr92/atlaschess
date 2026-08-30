import React from 'react';

export const CompassBoardLogo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl transition-transform duration-300 hover:scale-105"
            >
                {/* Base de la Rosa de los Vientos (Brújula) */}
                <polygon
                    points="100,10 125,75 190,100 125,125 100,190 75,125 10,100 75,75"
                    fill="#0F172A"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />

                {/* Tablero de ajedrez central rotado como diamante */}
                <polygon points="100,50 150,100 100,150 50,100" fill="#1E293B" />
                <g stroke="#10B981" strokeWidth="2" opacity="0.6">
                    <line x1="100" y1="50" x2="100" y2="150" />
                    <line x1="50" y1="100" x2="150" y2="100" />
                    <line x1="75" y1="75" x2="125" y2="125" />
                    <line x1="75" y1="125" x2="125" y2="75" />
                </g>

                {/* NORTE: Corona Europea (Ajedrez Clásico) */}
                <path d="M 85 30 L 92 15 L 100 25 L 108 15 L 115 30 Z" fill="#D4AF37" />

                {/* ESTE: Kanji 'Shō' - General (Shogi Japonés) */}
                <text
                    x="172"
                    y="106"
                    fontFamily="sans-serif"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#F5F5F4"
                    textAnchor="middle"
                >
                    将
                </text>

                {/* SUR: Abstracto de Colmillo de Elefante (Chaturanga Indio) */}
                <path d="M 90 170 Q 100 190 110 170 Q 105 160 100 160 Q 95 160 90 170 Z" fill="#C84B31" />

                {/* OESTE: Rueda de Carruaje (Shatranj Persa) */}
                <g transform="translate(28, 100)" stroke="#F5F5F4" strokeWidth="2">
                    <circle cx="0" cy="0" r="12" fill="none" />
                    <line x1="-12" y1="0" x2="12" y2="0" />
                    <line x1="0" y1="-12" x2="0" y2="12" />
                    <line x1="-8" y1="-8" x2="8" y2="8" />
                    <line x1="-8" y1="8" x2="8" y2="-8" />
                </g>
            </svg>
        </div>
    );
};