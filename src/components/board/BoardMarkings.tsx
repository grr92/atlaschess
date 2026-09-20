import React from 'react';

interface BoardMarkingsProps {
    variantId: string;
}

/**
 * Renders historic board markings (e.g. Alfonso X crossed diagonals for Four Seasons Chess,
 * or Sit-ke-min crossed corner diagonals for Sittuyin).
 */
export const BoardMarkings: React.FC<BoardMarkingsProps> = ({ variantId }) => {
    if (variantId === 'four_seasons') {
        return (
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <clipPath id="fourSeasonsDiagonalsClip">
                        <rect x="25" y="25" width="50" height="50" />
                    </clipPath>
                </defs>
                <g clipPath="url(#fourSeasonsDiagonalsClip)">
                    {/* Diagonal crossing light/white squares (c6 to f3) in dark tile color (#D18B47) */}
                    <line x1="25" y1="25" x2="75" y2="75" stroke="#D18B47" strokeWidth="1.4" strokeLinecap="square" />
                    {/* Diagonal crossing dark/black squares (c3 to f6) in light tile color (#ffce9e) */}
                    <line x1="25" y1="75" x2="75" y2="25" stroke="#ffce9e" strokeWidth="1.4" strokeLinecap="square" />
                </g>
            </svg>
        );
    }

    if (variantId === 'sittuyin') {
        return (
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <line x1="0" y1="0" x2="100" y2="100" stroke="#8c5f3b" strokeWidth="0.8" strokeLinecap="square" />
                <line x1="0" y1="100" x2="100" y2="0" stroke="#8c5f3b" strokeWidth="0.8" strokeLinecap="square" />
            </svg>
        );
    }

    return null;
};
