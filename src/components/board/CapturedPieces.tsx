import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';
import { getPieceValue, getPieceSortOrder } from '../../core/pieces/pieceRegistry';
import { useTranslation } from '../../i18n';

export const CapturedPieces = () => {
    const { t } = useTranslation();
    const history = useGameStore(state => state.history);
    const gameMode = useGameStore(state => state.gameMode);
    const playerColor = useGameStore(state => state.playerColor);

    const isFlipped = gameMode === 'vs_ai' && playerColor === 'black';

    // Pieces captured by white
    const whiteCaptures = history
        .filter(m => m.piece.color === 'white' && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Pieces captured by black
    const blackCaptures = history
        .filter(m => m.piece.color === 'black' && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Score calculations using centralized piece registry (normalized to 1 pawn = 1.0)
    const whiteScore = whiteCaptures.reduce((acc, p) => acc + (getPieceValue(p.name) / 100), 0);
    const blackScore = blackCaptures.reduce((acc, p) => acc + (getPieceValue(p.name) / 100), 0);

    const whiteAdvantage = whiteScore - blackScore;
    const blackAdvantage = blackScore - whiteScore;

    // Sorting of captured pieces by their predefined registry sort order
    const sortedWhiteCaptures = [...whiteCaptures].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));
    const sortedBlackCaptures = [...blackCaptures].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));

    const totalCaptures = sortedWhiteCaptures.length + sortedBlackCaptures.length;

    // Determine top and bottom rows based on board orientation
    const topCaptures = isFlipped ? sortedWhiteCaptures : sortedBlackCaptures;
    const topAdvantage = isFlipped ? whiteAdvantage : blackAdvantage;
    const bottomCaptures = isFlipped ? sortedBlackCaptures : sortedWhiteCaptures;
    const bottomAdvantage = isFlipped ? blackAdvantage : whiteAdvantage;

    // Helper function to render a player's capture row
    const renderRow = (pieces: any[], advantage: number) => (
        <div className="flex items-center justify-between min-h-[1.5rem]">
            <div className="flex flex-wrap gap-y-1 items-center flex-1 pr-2">
                {pieces.map((p, i) => (
                    <img
                        key={`${p.id}-${i}`}
                        src={getPieceImage(p)!}
                        alt={p.name}
                        className={`w-5 h-5 md:w-6 md:h-6 opacity-90 drop-shadow-md ${i > 0 ? '-ml-2' : ''}`}
                    />
                ))}
            </div>
            {advantage > 0 && (
                <span className="text-xs md:text-sm font-bold whitespace-nowrap flex-shrink-0 text-atlas-normalText">
                    +{Math.round(advantage * 10) / 10}
                </span>
            )}
        </div>
    );

    return (
        // Reusing identical structural footprint as MoveHistory for visual coherence
        <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">

            <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                {t.gameplay.capturedPieces}
            </h3>

            <div className="flex-1 flex flex-col justify-between">
                {totalCaptures === 0 ? (
                    // Empty state fallback
                    <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                        {t.gameplay.noCaptures}
                    </div>
                ) : (
                    <>
                        {/* Top Section: captures for the player on top */}
                        <div>
                            {renderRow(topCaptures, topAdvantage)}
                        </div>

                        {/* Bottom Section: captures for the player on bottom */}
                        <div className="mt-auto">
                            {renderRow(bottomCaptures, bottomAdvantage)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};