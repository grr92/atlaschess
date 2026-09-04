import React from 'react';

interface FlagProps {
    className?: string;
}

export const FlagUK: React.FC<FlagProps> = ({ className = "w-7 h-5" }) => (
    <svg viewBox="0 0 60 40" className={`${className} rounded-md overflow-hidden flex-shrink-0`} xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#ffffff" strokeWidth="8" strokeLinecap="square" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" strokeLinecap="square" />
        <path d="M30,0 v40 M0,20 h60" stroke="#ffffff" strokeWidth="12" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
);

export const FlagSpain: React.FC<FlagProps> = ({ className = "w-7 h-5" }) => (
    <svg viewBox="0 0 60 40" className={`${className} rounded-md overflow-hidden flex-shrink-0`} xmlns="http://www.w3.org/2000/svg">
        {/* Top Red Band (1/4) */}
        <rect y="0" width="60" height="10" fill="#AA151B" />
        {/* Middle Yellow Band (2/4) */}
        <rect y="10" width="60" height="20" fill="#F1BF00" />
        {/* Bottom Red Band (1/4) */}
        <rect y="30" width="60" height="10" fill="#AA151B" />
        {/* Subtle Spanish Coat of Arms Silhouette */}
        <g transform="translate(14, 15) scale(0.6)">
            <rect x="0" y="2" width="10" height="11" rx="2" fill="#AA151B" />
            <rect x="2" y="4" width="6" height="7" fill="#F1BF00" />
            <circle cx="5" cy="0" r="2" fill="#AA151B" />
        </g>
    </svg>
);

export const FlagCatalonia: React.FC<FlagProps> = ({ className = "w-7 h-5" }) => (
    <svg viewBox="0 0 60 40" className={`${className} rounded-md overflow-hidden flex-shrink-0`} xmlns="http://www.w3.org/2000/svg">
        {/* Yellow Background (5 stripes) */}
        <rect width="60" height="40" fill="#FCD116" />
        {/* 4 Red Stripes */}
        <rect y="4.44" width="60" height="4.44" fill="#DA121A" />
        <rect y="13.33" width="60" height="4.44" fill="#DA121A" />
        <rect y="22.22" width="60" height="4.44" fill="#DA121A" />
        <rect y="31.11" width="60" height="4.44" fill="#DA121A" />
    </svg>
);
