import { useGameStore } from '../../../store/useGameStore';
import { useTranslation } from '../../../i18n';
import type { GameInterception } from '../../../types';

interface SuccessionModalProps {
    interception: Extract<GameInterception, { type: 'SUCCESSION_CHOICE' }>;
}

export const SuccessionModal = ({ interception }: SuccessionModalProps) => {
    const { t } = useTranslation();
    const { resolveInterception } = useGameStore();

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-amber-500/50 text-center max-w-md w-full animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-white mb-2">{t.gameplay.successionTitle}</h3>
                <p className="text-sm text-slate-300 mb-6">
                    {t.gameplay.successionDesc}
                </p>
                <div className="flex flex-col gap-3">
                    {interception.royals.map((royal) => (
                        <button
                            key={royal.id}
                            onClick={() => resolveInterception({ type: 'SUCCESSION', chosenRoyalId: royal.id })}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            {royal.name === 'Shahzada' ? t.gameplay.successionCrownPrince : t.gameplay.successionCrownAdventitious}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
