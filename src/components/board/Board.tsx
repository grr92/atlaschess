import { useGameStore } from '../../store/useGameStore';
import { getPieceImage, getSquareBackground } from '../../utils/pieceMapper';
import { useEffect } from 'react';

export const Board = () => {
    const {
        engine,
        currentVariantId,
        selectedPosition,
        legalMoves,
        selectSquare,
        initGame,
        pendingPromotion,
        confirmPromotion,
        cancelPromotion
    } = useGameStore();

    // Auto-initialize if the engine instance is null
    useEffect(() => {
        if (!engine) {
            initGame(currentVariantId);
        }
    }, [engine, currentVariantId, initGame]);

    if (!engine) {
        return (
            <div className="text-white text-center py-8">
                Loading game engine...
            </div>
        );
    }

    const board = engine.board;
    const promotionPieces = ['Queen', 'Knight', 'Rook', 'Bishop'];

    return (
        <div className="flex justify-center items-center p-4">
            <div className="grid grid-cols-8 grid-rows-8 border-4 border-slate-950 shadow-2xl rounded overflow-hidden">
                {board.grid.map((row, y) =>
                    row.map((piece, x) => {
                        const isLight = (x + y) % 2 === 0;
                        const bgImage = getSquareBackground(x, y, currentVariantId);
                        const pieceImage = getPieceImage(piece);

                        const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
                        const isLegalMove = legalMoves.some((m) => m.x === x && m.y === y);

                        // Coordinate logic
                        const isBottomRow = y === board.rows - 1; // Bottom-most row
                        const isRightCol = x === board.cols - 1;  // Rightmost column
                        const fileLetter = String.fromCharCode(97 + x); // 0 -> a, 1 -> b...
                        const rankNumber = board.rows - y; // 8, 7, 6...

                        // If the square is light, the text must be dark (and vice versa)
                        const textColor = isLight ? 'text-atlas-boardDark' : 'text-atlas-boardLight';

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => selectSquare({ x, y })}
                                className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex justify-center items-center bg-cover bg-center cursor-pointer relative ${
                                    isLight ? 'bg-atlas-boardLight' : 'bg-atlas-boardDark'
                                }`}
                                style={{
                                    backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
                                }}
                            >
                                {/* Coordinates: Rank Number (Top right corner) */}
                                {isRightCol && (
                                    <span className={`absolute top-0.5 right-1 text-[10px] md:text-[11px] font-bold select-none z-20 ${textColor}`}>
                                        {rankNumber}
                                    </span>
                                )}

                                {/* Coordinates: File Letter (Bottom left corner) */}
                                {isBottomRow && (
                                    <span className={`absolute bottom-0 left-1 text-[10px] md:text-[11px] font-bold select-none z-20 ${textColor}`}>
                                        {fileLetter}
                                    </span>
                                )}

                                {/* Selected square indicator */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-yellow-400/50 z-0" />
                                )}

                                {/* Render piece */}
                                {pieceImage && (
                                    <img
                                        src={pieceImage}
                                        alt={piece?.name}
                                        className={`w-full h-full object-contain relative z-10 select-none ${
                                            isSelected ? 'scale-110' : ''
                                        } transition-transform`}
                                    />
                                )}

                                {/* Legal move dots/indicators */}
                                {isLegalMove && (
                                    <div
                                        className={`absolute z-20 rounded-full ${
                                            piece
                                                ? 'inset-0 border-4 border-emerald-500 bg-emerald-500/20'
                                                : 'w-4 h-4 md:w-5 md:h-5 bg-emerald-500/80 shadow-md'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            {/* Pawn promotion modal */}
            {pendingPromotion && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-emerald-500/50 text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Promote Pawn</h3>
                        <div className="flex gap-4 mb-6">
                            {promotionPieces.map(pieceName => {
                                // Creates a dummy object to fetch the correct piece image
                                const dummyPiece = { name: pieceName, color: engine.currentTurn } as any;
                                const imgUrl = getPieceImage(dummyPiece);

                                return (
                                    <button
                                        key={pieceName}
                                        onClick={() => confirmPromotion(pieceName)}
                                        className="w-16 h-16 bg-slate-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                    >
                                        <img src={imgUrl!} alt={pieceName} className="w-12 h-12 object-contain" />
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={cancelPromotion}
                            className="text-slate-400 hover:text-white underline text-sm"
                        >
                            Cancel Move
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};