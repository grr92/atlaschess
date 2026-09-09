import { useGameStore } from '../../../store/useGameStore';
import { useTranslation } from '../../../i18n';
import { getPieceImage } from '../../../utils/pieceMapper';
import type { GameInterception } from '../../../types';

interface PromotionModalProps {
    interception: Extract<GameInterception, { type: 'PROMOTION' }>;
}

export const PromotionModal = ({ interception }: PromotionModalProps) => {
    const { t } = useTranslation();
    const { engine, resolveInterception, cancelInterception } = useGameStore();

    if (!engine) return null;

    const promotionPieces = interception.availablePieces || ['Queen', 'Knight', 'Rook', 'Bishop'];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-emerald-500/50 text-center">
                <h3 className="text-xl font-bold text-white mb-4">{t.gameplay.promotePawnTitle}</h3>
                <div className="flex gap-4 mb-6">
                    {promotionPieces.map((pieceName) => {
                        const dummyPiece = { name: pieceName, color: engine.currentTurn } as any;
                        const imgUrl = getPieceImage(dummyPiece);

                        return (
                            <button
                                key={pieceName}
                                onClick={() => resolveInterception({ type: 'PROMOTION', pieceName })}
                                className="w-16 h-16 bg-slate-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                            >
                                <img src={imgUrl!} alt={pieceName} className="w-12 h-12 object-contain" />
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={cancelInterception}
                    className="text-slate-400 hover:text-white underline text-sm"
                >
                    {t.gameplay.cancelMove}
                </button>
            </div>
        </div>
    );
};
