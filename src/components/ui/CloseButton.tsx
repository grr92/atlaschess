import React from 'react';
import { X } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';
import { useTranslation } from '../../i18n';

interface CloseButtonProps {
    onClick: () => void;
    label?: string; // Optional: Defaults to localized "Close" on the hover tooltip
    className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
    onClick,
    label,
    className = '',
}) => {
    const { t } = useTranslation();
    const displayLabel = label ?? t.common.close;

    const handleClick = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        soundManager.playUiClick();
        onClick();
    };

    return (
        <div className={`relative group/close inline-block ${className}`}>
            <button
                onClick={handleClick}
                className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 rounded-xl transition-all duration-200 border border-white/10 hover:border-red-500/30 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
            >
                <X className="w-5 h-5 transition-colors" />
            </button>

            {/* Floating hover tooltip */}
            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/close:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                {displayLabel}
            </span>
        </div>
    );
};
