import { Info } from 'lucide-react';

interface InfoButtonProps {
    onClick: () => void;
}

export const InfoButton = ({ onClick }: InfoButtonProps) => {
    return (
        <div className="relative group inline-block">
            <button
                onClick={(e) => {
                    // prevent triggering parent elements if placed inside containers
                    e.stopPropagation();
                    onClick();
                }}
                className="bg-atlas-surface/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
            >
                <Info className="w-5 h-5"/>
            </button>

            {/* floating tooltip */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                Info & Rules
            </span>
        </div>
    );
};