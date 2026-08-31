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
                className="bg-atlas-surface hover:bg-atlas-hover p-2.5 rounded-lg font-bold transition-colors shadow-md text-atlas-titleText flex items-center justify-center"
            >
                <Info className="w-5 h-5"/>
            </button>

            {/* floating tooltip */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                Info and how to play
            </span>
        </div>
    );
};