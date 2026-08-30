import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
    onClick: () => void;
    label?: string; // Optional: Defaults to "Back" on the hover tooltip
}

export const BackButton = ({ onClick, label = 'Back' }: BackButtonProps) => {
    return (
        <div className="relative group inline-block">
            <button
                onClick={onClick}
                className="bg-atlas-surface hover:bg-atlas-hover p-2.5 rounded-lg font-bold transition-colors shadow-md text-atlas-titleText"
            >
                <ChevronLeft className="w-5 h-5"/>
            </button>

            {/* Floating hover tooltip indicator */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                {label}
            </span>
        </div>
    );
};