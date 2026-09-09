import { useTranslation } from '../../../i18n';

export const KingPlacementBanner = () => {
    const { t } = useTranslation();

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg backdrop-blur-md animate-bounce flex items-center gap-1.5 border border-amber-300 pointer-events-none">
            <span>👑</span>
            <span>{t.gameplay.kingRescuePlacementPrompt}</span>
        </div>
    );
};
