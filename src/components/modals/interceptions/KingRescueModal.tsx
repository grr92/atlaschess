import { useGameStore } from '../../../store/useGameStore';
import { useTranslation } from '../../../i18n';
import type { GameInterception } from '../../../types';

interface KingRescueModalProps {
    interception: Extract<GameInterception, { type: 'KING_RESCUE_CHOICE' }>;
}

export const KingRescueModal = ({ interception }: KingRescueModalProps) => {
    const { t } = useTranslation();
    const { resolveInterception } = useGameStore();

    const capturingColorName = t.common[interception.capturingColor as 'red' | 'green' | 'yellow' | 'blue'] || interception.capturingColor;
    const partnerColorName = t.common[interception.partnerColor as 'red' | 'green' | 'yellow' | 'blue'] || interception.partnerColor;

    return (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-amber-500/50 text-center max-w-md w-full animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-white mb-2">{t.gameplay.kingRescueTitle}</h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {t.gameplay.kingRescueDesc
                        .replace('{capturing}', capturingColorName)
                        .replace('{partner}', partnerColorName)}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => resolveInterception({ type: 'KING_RESCUE_DECLINE' })}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-xl font-bold transition-all border border-white/10 shadow-sm hover:scale-105 active:scale-95"
                    >
                        {t.gameplay.kingRescueDecline}
                    </button>
                    <button
                        onClick={() => resolveInterception({ type: 'KING_RESCUE_ACCEPT' })}
                        className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95"
                    >
                        {t.gameplay.kingRescueAccept}
                    </button>
                </div>
            </div>
        </div>
    );
};
