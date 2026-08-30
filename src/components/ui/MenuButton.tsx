import React from 'react';

interface MenuButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    isPrimary?: boolean; // Toggles the distinct scale-up hover visualization for main actions
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, icon, label, isPrimary = false }) => {
    // Shared base styles
    const baseClasses = "relative w-1/2 mx-auto flex items-center justify-center py-3.5 px-6 bg-atlas-surface hover:bg-atlas-hover text-atlas-normalText text-lg rounded-xl transition-all duration-200";

    // Primary action specific styles
    const variantClasses = isPrimary
        ? "font-bold transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        : "font-semibold shadow-sm";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            {/* The icon is anchored to the left, allowing the text to remain centered */}
            <span className="absolute left-5 flex items-center justify-center">
                {icon}
            </span>

            <span>{label}</span>
        </button>
    );
};