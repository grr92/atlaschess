import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';

const PIECE_VALUES: Record<string, number> = {
    'Queen': 9, 'Rook': 5, 'Bishop': 3, 'Knight': 3, 'Pawn': 1,
    'Mantri': 2, 'Ratha': 5, 'Gaja': 2, 'Asva': 3, 'Padati': 1,
    'King': 0, 'Raja': 0
};

const SORT_ORDER: Record<string, number> = {
    'Queen': 1, 'Mantri': 1,
    'Rook': 2, 'Ratha': 2,
    'Bishop': 3, 'Gaja': 3,
    'Knight': 4, 'Asva': 4,
    'Pawn': 5, 'Padati': 5
};

export const CapturedPieces = () => {
    const history = useGameStore(state => state.history);

    // Pieces captured by white
    const whiteCaptures = history
        .filter(m => m.piece.color === 'white' && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Pieces captured by black
    const blackCaptures = history
        .filter(m => m.piece.color === 'black' && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Score calculations
    const whiteScore = whiteCaptures.reduce((acc, p) => acc + (PIECE_VALUES[p.name] || 0), 0);
    const blackScore = blackCaptures.reduce((acc, p) => acc + (PIECE_VALUES[p.name] || 0), 0);

    const whiteAdvantage = whiteScore - blackScore;
    const blackAdvantage = blackScore - whiteScore;

    // Sorting of captured pieces by their predefined values
    const sortedWhiteCaptures = [...whiteCaptures].sort((a, b) => (SORT_ORDER[a.name] || 99) - (SORT_ORDER[b.name] || 99));
    const sortedBlackCaptures = [...blackCaptures].sort((a, b) => (SORT_ORDER[a.name] || 99) - (SORT_ORDER[b.name] || 99));

    const totalCaptures = sortedWhiteCaptures.length + sortedBlackCaptures.length;

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
                    +{advantage}
                </span>
            )}
        </div>
    );

    return (
        // Reusing of identical structural footprint as MoveHistory for visual coherence
        <div className="bg-atlas-surface rounded-xl p-4 w-full h-full flex flex-col shadow-sm text-atlas-titleText">

            <h3 className="font-bold mb-3 pb-2 opacity-80 text-sm tracking-wide uppercase">
                Captured Pieces
            </h3>

            <div className="flex-1 flex flex-col justify-between">
                {totalCaptures === 0 ? (
                    // Empty state fallback
                    <div className="opacity-60 text-sm text-atlas-normalText italic text-center mt-8">
                        No pieces captured yet!
                    </div>
                ) : (
                    <>
                        {/* Top Section: Pieces captured by Black */}
                        <div>
                            {renderRow(sortedBlackCaptures, blackAdvantage)}
                        </div>

                        {/* Bottom Section: Pieces captured by White */}
                        <div className="mt-auto">
                            {renderRow(sortedWhiteCaptures, whiteAdvantage)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};