import React from 'react';
import { Info } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';
import { useTranslation } from '../../i18n';

interface InfoButtonProps {
    onClick: () => void;
    variant?: 'default' | 'ghost';
    label?: string;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ onClick, variant = 'default', label }: InfoButtonProps) => {
    const { t } = useTranslation();
    const isGhost = variant === 'ghost';
    const displayLabel = label ?? t.common.infoRules;

    return (
        <div className="relative group/info inline-block">
            <button
                onClick={(e) => {
                    // prevent triggering parent elements if placed inside containers
                    e.stopPropagation();
                    soundManager.playUiClick();
                    onClick();
                }}
                className={
                    isGhost
                        ? "bg-transparent hover:bg-amber-500/15 text-slate-400 hover:text-amber-400 p-2 rounded-xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
                        : "bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                }
            >
                <Info className="w-5 h-5 transition-colors"/>
            </button>

            {/* floating tooltip */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                {displayLabel}
            </span>
        </div>
    );
};