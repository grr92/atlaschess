import { useGameStore } from '../../../store/useGameStore';
import { useTranslation } from '../../../i18n';
import type { GameInterception } from '../../../types';

interface CitadelModalProps {
    interception: Extract<GameInterception, { type: 'CITADEL_CHOICE' }>;
}

export const CitadelModal = ({ interception }: CitadelModalProps) => {
    const { t } = useTranslation();
    const { resolveInterception, cancelInterception } = useGameStore();

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-amber-500/50 text-center max-w-md w-full animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-white mb-2">{t.gameplay.citadelTitle}</h3>
                <p className="text-sm text-slate-300 mb-6">
                    {t.gameplay.citadelDesc}
                </p>
                <div className="flex flex-col gap-3">
                    {interception.royals.map((royal) => (
                        <button
                            key={royal.id}
                            onClick={() => resolveInterception({ type: 'CITADEL_SWAP', chosenRoyalId: royal.id })}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            {royal.name === 'Shahzada' ? t.gameplay.citadelTradePrince : t.gameplay.citadelTradeAdventitious}
                        </button>
                    ))}
                    <button
                        onClick={() => resolveInterception({ type: 'CITADEL_DRAW' })}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md"
                    >
                        {t.gameplay.citadelDeclareDraw}
                    </button>
                    <button
                        onClick={cancelInterception}
                        className="text-slate-400 hover:text-white underline text-xs mt-2"
                    >
                        {t.gameplay.cancelMove}
                    </button>
                </div>
            </div>
        </div>
    );
};
