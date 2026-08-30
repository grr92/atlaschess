import React from 'react';

export const ChimeraLogo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl transition-transform duration-300 hover:scale-105"
            >
                {/* Lado Izquierdo: Rey de Ajedrez Clásico (Occidente) */}
                <g stroke="#F5F5F4" strokeWidth="2" strokeLinejoin="round">
                    {/* Cruz de la corona */}
                    <path d="M 100 15 L 100 35 M 90 25 L 100 25" strokeWidth="3" />

                    {/* Perfil del Rey */}
                    <path
                        d="M 100 35 L 85 35 L 75 55 L 90 70 L 65 95 L 90 120 L 75 155 L 100 155 Z"
                        fill="#D4AF37" /* Oro Antiguo */
                    />
                    {/* Base del Rey */}
                    <path
                        d="M 100 160 L 65 160 L 65 175 L 100 175 Z"
                        fill="#D4AF37"
                    />
                    <path
                        d="M 100 180 L 55 180 L 55 195 L 100 195 Z"
                        fill="#D4AF37"
                    />
                </g>

                {/* Lado Derecho: Ficha de Shogi (Oriente) */}
                <g stroke="#F5F5F4" strokeWidth="2" strokeLinejoin="round">
                    {/* Forma pentagonal clásica del Shogi */}
                    <polygon
                        points="100,15 165,35 175,195 100,195"
                        fill="#10B981" /* Jade Imperial */
                    />
                </g>

                {/* El Kanji 'Rey' (王) en el lado del Shogi */}
                <text
                    x="137"
                    y="135"
                    fontFamily="sans-serif"
                    fontSize="50"
                    fontWeight="bold"
                    fill="#F5F5F4" /* Hueso */
                    textAnchor="middle"
                    className="opacity-90"
                >
                    王
                </text>

                {/* Línea divisoria central para marcar la fusión */}
                <line x1="100" y1="5" x2="100" y2="200" stroke="#F5F5F4" strokeWidth="3" opacity="0.8" />
            </svg>
        </div>
    );
};