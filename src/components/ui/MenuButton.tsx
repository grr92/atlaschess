import React from 'react';

interface MenuButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    isPrimary?: boolean; // Toggles primary gold gradient vs sleek glass surface
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, icon, label, isPrimary = false }) => {
    if (isPrimary) {
        return (
            <button
                onClick={onClick}
                className="group relative w-full sm:w-2/3 mx-auto flex items-center justify-between py-4 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] border border-amber-300/40"
            >
                <div className="flex items-center gap-4">
                    <span className="p-2 bg-slate-950/15 rounded-xl text-slate-950 group-hover:scale-110 transition-transform">
                        {icon}
                    </span>
                    <span className="tracking-wide">{label}</span>
                </div>
                <span className="text-xs uppercase tracking-widest px-2.5 py-1 bg-slate-950/20 rounded-full font-bold">
                    Play
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="group relative w-full sm:w-2/3 mx-auto flex items-center justify-start gap-4 py-3.5 px-6 bg-atlas-surface/80 hover:bg-atlas-hover text-atlas-titleText font-bold text-lg rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border border-white/10 hover:border-amber-500/40 backdrop-blur-md"
        >
            <span className="p-2 bg-white/5 group-hover:bg-amber-500/10 rounded-xl text-atlas-normalText group-hover:text-amber-400 transition-colors">
                {icon}
            </span>
            <span className="tracking-wide opacity-90 group-hover:opacity-100">{label}</span>
        </button>
    );
};