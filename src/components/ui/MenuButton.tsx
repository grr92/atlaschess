import React from 'react';
import { soundManager } from '../../utils/soundManager';

interface MenuButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    isPrimary?: boolean; // Toggles primary gold gradient vs sleek glass surface
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, icon, label, isPrimary = false }) => {
    const handleClick = () => {
        soundManager.playUiClick();
        onClick();
    };

    if (isPrimary) {
        return (
            <button
                onClick={handleClick}
                className="group relative w-full sm:w-3/4 md:w-2/3 mx-auto flex items-center justify-center gap-3.5 py-4 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] border border-amber-300/40"
            >
                <span className="text-slate-950 group-hover:scale-110 transition-transform flex items-center">
                    {icon}
                </span>
                <span className="tracking-wide">{label}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className="group relative w-full sm:w-3/4 md:w-2/3 mx-auto flex items-center justify-center gap-3.5 py-3.5 px-6 bg-atlas-surface/80 hover:bg-atlas-hover text-slate-200 hover:text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border border-white/10 hover:border-amber-500/40 backdrop-blur-md"
        >
            <span className="text-slate-300 group-hover:text-amber-400 group-hover:scale-110 transition-all flex items-center">
                {icon}
            </span>
            <span className="tracking-wide opacity-90 group-hover:opacity-100">{label}</span>
        </button>
    );
};