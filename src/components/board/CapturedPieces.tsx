import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';
import { getPieceValue, getPieceSortOrder } from '../../core/pieces/pieceRegistry';
import { ChaturajiEngine, type ChaturajiColor } from '../../core/engine/ChaturajiEngine';
import { useTranslation } from '../../i18n';

const CHATURAJI_PLAYERS: { color: ChaturajiColor; labelKey: 'red' | 'green' | 'yellow' | 'blue'; bgDot: string }[] = [
    { color: 'red', labelKey: 'red', bgDot: 'bg-red-500' },
    { color: 'green', labelKey: 'green', bgDot: 'bg-emerald-500' },
    { color: 'yellow', labelKey: 'yellow', bgDot: 'bg-amber-400' },
    { color: 'blue', labelKey: 'blue', bgDot: 'bg-sky-500' },
];

export const CapturedPieces = () => {
    const { t } = useTranslation();
    const engine = useGameStore(state => state.engine);
    const history = useGameStore(state => state.history);
    const gameMode = useGameStore(state => state.gameMode);
    const playerColor = useGameStore(state => state.playerColor);

    // 4-Player Chaturaji layout
    if (engine instanceof ChaturajiEngine) {
        const capturedMap = engine.capturedPiecesByPlayer;
        const totalCapturesCount = Object.values(capturedMap).reduce((sum, arr) => sum + arr.length, 0);

        return (
            <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">
                <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                    {t.gameplay.capturedPieces}
                </h3>

                <div className="flex-1 flex flex-col justify-around gap-2 overflow-y-auto">
                    {totalCapturesCount === 0 ? (
                        <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                            {t.gameplay.noCaptures}
                        </div>
                    ) : (
                        CHATURAJI_PLAYERS.map(({ color, labelKey, bgDot }) => {
                            const pieces = capturedMap[color] || [];
                            const sortedPieces = [...pieces].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));
                            const colorName = t.common[labelKey];

                            return (
                                <div key={color} className="flex flex-col gap-1 bg-slate-900/30 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${bgDot}`} />
                                        <span className="text-[11px] font-bold text-slate-300">{colorName}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">({pieces.length})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 items-center min-h-[1.5rem] pl-4">
                                        {sortedPieces.length === 0 ? (
                                            <span className="text-[10px] text-slate-500 italic">-</span>
                                        ) : (
                                            sortedPieces.map((p, i) => (
                                                <img
                                                    key={`${p.id}-${i}`}
                                                    src={getPieceImage(p)!}
                                                    alt={p.name}
                                                    className={`w-5 h-5 opacity-90 drop-shadow-md ${i > 0 ? '-ml-1.5' : ''}`}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // 2-Player Standard layout
    const isFlipped = gameMode === 'vs_ai' && playerColor === 'black';

    // Pieces captured by white
    const whiteCaptures = history
        .filter(m => m.piece?.color === 'white' && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Pieces captured by black
    const blackCaptures = history
        .filter(m => m.piece?.color === 'black' && m.capturedPiece)
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