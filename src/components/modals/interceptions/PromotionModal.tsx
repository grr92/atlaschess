import { useGameStore } from '../../../store/useGameStore';
import { useTranslation } from '../../../i18n';
import { getPieceImage, type RegionalPieceStyle } from '../../../utils/pieceMapper';
import type { GameInterception, PieceColor } from '../../../types';

interface PromotionModalProps {
    interception: Extract<GameInterception, { type: 'PROMOTION' }>;
}

interface BinaryOptionProps {
    pieceName: string;
    label: string;
    color: PieceColor;
    style: RegionalPieceStyle;
    variant: 'primary' | 'secondary';
    onSelect: () => void;
}

const BinaryOptionButton = ({
    pieceName,
    label,
    color,
    style,
    variant,
    onSelect,
}: BinaryOptionProps) => {
    const imgUrl = getPieceImage({ name: pieceName, color }, style);
    const isPrimary = variant === 'primary';

    return (
        <button
            onClick={onSelect}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-105 shadow-lg group border ${
                isPrimary
                    ? 'bg-emerald-900/40 hover:bg-emerald-700/60 border-emerald-500/50'
                    : 'bg-slate-700 hover:bg-slate-600 border-slate-500/50'
            }`}
        >
            <div className="w-16 h-16 flex items-center justify-center mb-2">
                {imgUrl ? (
                    <img src={imgUrl} alt={pieceName} className="w-12 h-12 object-contain" />
                ) : (
                    <span className="text-xs text-slate-300 font-bold">{pieceName}</span>
                )}
            </div>
            <span
                className={`text-sm font-semibold ${
                    isPrimary ? 'text-emerald-300 group-hover:text-white' : 'text-slate-300 group-hover:text-white'
                }`}
            >
                {label}
            </span>
        </button>
    );
};

export const PromotionModal = ({ interception }: PromotionModalProps) => {
    const { t } = useTranslation();
    const { engine, resolveInterception, cancelInterception, regionalPieceStyle } = useGameStore();

    if (!engine) return null;

    const promotionPieces = interception.availablePieces || ['Queen', 'Knight', 'Rook', 'Bishop'];
    const isBinaryChoice = Boolean(interception.availablePieces && interception.availablePieces.length === 2);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <div
                className={`bg-slate-800 p-6 rounded-2xl shadow-2xl border border-emerald-500/50 text-center mx-4 ${
                    isBinaryChoice ? 'max-w-sm w-full' : ''
                }`}
            >
                <h3 className="text-xl font-bold text-white mb-5">
                    {isBinaryChoice ? t.gameplay.shogiPromotePieceTitle : t.gameplay.promotePawnTitle}
                </h3>

                {isBinaryChoice ? (
                    <div className="flex gap-4 justify-center mb-6">
                        <BinaryOptionButton
                            pieceName={promotionPieces[0]}
                            label={t.gameplay.shogiPromote}
                            color={engine.currentTurn}
                            style={regionalPieceStyle}
                            variant="primary"
                            onSelect={() => resolveInterception({ type: 'PROMOTION', pieceName: promotionPieces[0] })}
                        />
                        <BinaryOptionButton
                            pieceName={promotionPieces[1]}
                            label={t.gameplay.shogiDoNotPromote}
                            color={engine.currentTurn}
                            style={regionalPieceStyle}
                            variant="secondary"
                            onSelect={() => resolveInterception({ type: 'PROMOTION', pieceName: promotionPieces[1] })}
                        />
                    </div>
                ) : (
                    <div className="flex gap-4 justify-center mb-6">
                        {promotionPieces.map((pieceName) => {
                            const imgUrl = getPieceImage({ name: pieceName, color: engine.currentTurn }, regionalPieceStyle);

                            return (
                                <button
                                    key={pieceName}
                                    onClick={() => resolveInterception({ type: 'PROMOTION', pieceName })}
                                    className="w-16 h-16 bg-slate-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                >
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={pieceName} className="w-12 h-12 object-contain" />
                                    ) : (
                                        <span className="text-xs text-white font-bold">{pieceName}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

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
