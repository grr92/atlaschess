import { ChevronLeft } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';
import { useTranslation } from '../../i18n';

interface BackButtonProps {
    onClick: () => void;
    label?: string; // Optional: Defaults to localized "Back" on the hover tooltip
}

export const BackButton = ({ onClick, label }: BackButtonProps) => {
    const { t } = useTranslation();
    const displayLabel = label ?? t.common.back;

    const handleClick = () => {
        soundManager.playUiClick();
        onClick();
    };

    return (
        <div className="relative group/back inline-block">
            <button
                onClick={handleClick}
                className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
            >
                <ChevronLeft className="w-5 h-5 transition-colors"/>
            </button>

            {/* Floating hover tooltip indicator */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/back:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                {displayLabel}
            </span>
        </div>
    );
};