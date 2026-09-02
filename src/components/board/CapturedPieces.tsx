import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';

const PIECE_VALUES: Record<string, number> = {
    // classic chess pieces
    'Queen': 9, 'Rook': 5, 'Bishop': 3, 'Knight': 3, 'Pawn': 1, 'King': 0,

    // chaturanga pieces
    'Mantri': 2, 'Ratha': 5, 'Gaja': 2, 'Asva': 3, 'Padati': 1, 'Raja': 0,

    // shatranj pieces
    'Ferz': 2, 'Rukh': 5, 'Pil': 2, 'Asb': 3, 'Sarbaz': 1, 'Shah': 0,

    // tamerlane exclusive pieces (normalized to rook = 5 with factor 5/16 - the 16 value is taken from internet sources-)
    'Zurafa': 4.4, 'Talia': 3.8, 'Wazir': 2.5, 'Jamal': 1.6, 'Dabbaba': 1.3,
    'Shahzada': 2, 'AdventitiousShah': 2,

    // tamerlane individual pawn values
    'Pawn of Rukh': 0.6, 'Pawn of Zurafa': 0.55, 'Pawn of Talia': 0.47, 'Pawn of Shah': 0.5,
    'Pawn of Asb': 0.39, 'Pawn of Wazir': 0.31, 'Pawn of Ferz': 0.23, 'Pawn of Jamal': 0.2,
    'Pawn of Pawns': 0.2, 'Pawn of Dabbaba': 0.16, 'Pawn of Pil': 0.15
};

const SORT_ORDER: Record<string, number> = {
    'Queen': 1, 'Mantri': 1,
    'Rook': 2, 'Ratha': 2, 'Rukh': 2,
    'Zurafa': 3,
    'Talia': 4, 'Bishop': 4,
    'Knight': 5, 'Asva': 5, 'Asb': 5,
    'Wazir': 6,
    'Ferz': 7,
    'Jamal': 8,
    'Dabbaba': 9,
    'Pil': 10, 'Gaja': 10,
    'Pawn': 11, 'Padati': 11, 'Sarbaz': 11,
    'Pawn of Rukh': 12, 'Pawn of Zurafa': 13, 'Pawn of Talia': 14,
    'Pawn of Asb': 15, 'Pawn of Shah': 16, 'Pawn of Wazir': 17,
    'Pawn of Ferz': 18, 'Pawn of Jamal': 19, 'Pawn of Dabbaba': 20,
    'Pawn of Pil': 21, 'Pawn of Pawns': 22
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
                    +{Math.round(advantage * 10) / 10}
                </span>
            )}
        </div>
    );

    return (
        // Reusing of identical structural footprint as MoveHistory for visual coherence
        <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">

            <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                Captured Pieces
            </h3>

            <div className="flex-1 flex flex-col justify-between">
                {totalCaptures === 0 ? (
                    // Empty state fallback
                    <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
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