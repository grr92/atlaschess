import { useGameStore } from '../../store/useGameStore';
import { getPieceImage, getSquareBackground, getPawnBadgeIcon } from '../../utils/pieceMapper';
import { TamerlanePawn } from '../../core/pieces/piecesIndex';
import { useEffect, useState } from 'react';
import type { Position } from '../../types';

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
        cancelPromotion,
        pendingCitadelChoice,
        confirmCitadelSwap,
        confirmCitadelDraw,
        cancelCitadelChoice,
        pendingSuccessionChoice,
        confirmSuccession,
        isAiThinking
    } = useGameStore();

    const [hoveredEnemyMoves, setHoveredEnemyMoves] = useState<Position[]>([]);

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
            <div
                className="grid border-4 border-slate-950 shadow-2xl rounded overflow-hidden relative"
                style={{
                    gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${board.rows}, minmax(0, 1fr))`
                }}
            >
                {board.grid.map((row, y) =>
                    row.map((piece, x) => {
                        const isPlayable = !board.isOutOfBounds(x, y);
                        // If the square is "out of bounds", a transparent square is drawn
                        if (!isPlayable) {
                            return <div key={`${x}-${y}`} className="w-8 h-8 md:w-11 md:h-11 lg:w-[3.8rem] lg:h-[3.8rem] bg-transparent" />;
                        }

                        const isLight = (x + y) % 2 === 0;
                        const isMonochrome = currentVariantId === 'chaturanga' || currentVariantId === 'shatranj' || currentVariantId === 'tamerlane';
                        const bgImage = getSquareBackground(x, y, currentVariantId);
                        const pieceImage = getPieceImage(piece);

                        const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
                        const isLegalMove = legalMoves.some((m) => m.x === x && m.y === y);
                        const isEnemyThreatened = hoveredEnemyMoves.some((m) => m.x === x && m.y === y);

                        // Coordinate logic and tamerlane variant case
                        const isTamerlane = currentVariantId === 'tamerlane';
                        const fileIndex = isTamerlane ? x - 1 : x;
                        const fileLetter = fileIndex >= 0 && fileIndex <= 10 ? String.fromCharCode(97 + fileIndex) : '';
                        const rankNumber = board.rows - y;
                        const isBottomRow = y === board.rows - 1 && fileIndex >= 0;
                        const isRightCol = isTamerlane ? x === 11 : x === board.cols - 1;

                        // If uses monocrome board use only light tiles and add a black separator
                        const cssBgClass = (isLight || isMonochrome) ? 'bg-atlas-boardLight' : 'bg-atlas-boardDark';
                        const textColor = (isLight || isMonochrome) ? 'text-atlas-boardDark' : 'text-atlas-boardLight';                         // If the square is light, the text must be dark (and vice versa)
                        const monochromeBorder = isMonochrome ? 'ring-1 ring-inset ring-black/20' : '';

                        // To rotate the Queen icon to represent the Wazir
                        const isWazir = piece?.name === 'Wazir';

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => !isAiThinking && selectSquare({ x, y })}
                                onMouseEnter={() => {
                                    if (!isAiThinking && piece && piece.color !== engine.currentTurn) {
                                        setHoveredEnemyMoves(engine.getLegalMoves(piece));
                                    }
                                }}
                                onMouseLeave={() => setHoveredEnemyMoves([])}
                                className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex justify-center items-center bg-cover bg-center ${isAiThinking ? 'cursor-wait' : 'cursor-pointer'} relative ${cssBgClass} ${monochromeBorder}`}
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

                                {/* Enemy threatened square highlight on hover */}
                                {isEnemyThreatened && !isSelected && (
                                    <div className="absolute inset-0 bg-red-500/25 ring-2 ring-inset ring-red-500/60 z-15 pointer-events-none transition-opacity" />
                                )}

                                {/* Render piece */}
                                {pieceImage && (
                                    <img
                                        src={pieceImage}
                                        alt={piece?.name}
                                        className={`w-full h-full object-contain relative z-10 select-none 
                                        transition-transform ${isSelected ? 'scale-110' : ''} ${isWazir ? 'rotate-180' : ''}`}
                                    />
                                )}

                                {/* Shahzada (Prince) badge indicator */}
                                {piece?.name === 'Shahzada' && (
                                    <div
                                        className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border shadow-md pointer-events-none flex items-center justify-center font-black text-[10px] md:text-xs lg:text-sm ${
                                            piece.color === 'black'
                                                ? 'bg-slate-100 text-black border-amber-600 shadow-black/40'
                                                : 'bg-slate-900/90 text-white border-amber-400 shadow-black/60'
                                        }`}
                                    >
                                        P
                                    </div>
                                )}

                                {/* Adventitious King badge indicator */}
                                {piece?.name === 'AdventitiousShah' && (
                                    <div
                                        className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border shadow-md pointer-events-none flex items-center justify-center font-black text-[10px] md:text-xs lg:text-sm ${
                                            piece.color === 'black'
                                                ? 'bg-slate-100 text-black border-amber-600 shadow-black/40'
                                                : 'bg-slate-900/90 text-white border-amber-400 shadow-black/60'
                                        }`}
                                    >
                                        A
                                    </div>
                                )}

                                {/* Tamerlane pawn sub-badge indicator */}
                                {piece instanceof TamerlanePawn && getPawnBadgeIcon(piece.pawnType, piece.color) && (
                                    <div
                                        className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full p-0.5 border shadow-md pointer-events-none flex items-center justify-center ${
                                            piece.color === 'black'
                                                ? 'bg-slate-100 border-amber-600 shadow-black/40'
                                                : 'bg-slate-900/90 border-amber-400 shadow-black/60'
                                        }`}
                                    >
                                        <img
                                            src={getPawnBadgeIcon(piece.pawnType, piece.color)!}
                                            alt="Target piece"
                                            className={`w-full h-full object-contain ${
                                                piece.pawnType === 'pawn_of_vizier' ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>
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

            {/* Citadel decision modal */}
            {pendingCitadelChoice && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-amber-500/50 text-center max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-white mb-2">Citadel Infiltration!</h3>
                        <p className="text-sm text-slate-300 mb-6">
                            Your Shah has entered the enemy Citadel. Choose whether to trade places with a royal heir to continue fighting or declare an immediate draw:
                        </p>
                        <div className="flex flex-col gap-3">
                            {pendingCitadelChoice.royals.map(royal => (
                                <button
                                    key={royal.id}
                                    onClick={() => confirmCitadelSwap(royal.id)}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                                >
                                    Trade places with {royal.name === 'Shahzada' ? 'Prince (Shahzada)' : 'Adventitious King'}
                                </button>
                            ))}
                            <button
                                onClick={confirmCitadelDraw}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md"
                            >
                                Declare Draw
                            </button>
                            <button
                                onClick={cancelCitadelChoice}
                                className="text-slate-400 hover:text-white underline text-xs mt-2"
                            >
                                Cancel Move
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Royal succession modal */}
            {pendingSuccessionChoice && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-amber-500/50 text-center max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-white mb-2">The Shah has Fallen!</h3>
                        <p className="text-sm text-slate-300 mb-6">
                            Choose which royal heir will ascend to the throne as the new Shah:
                        </p>
                        <div className="flex flex-col gap-3">
                            {pendingSuccessionChoice.royals.map(royal => (
                                <button
                                    key={royal.id}
                                    onClick={() => confirmSuccession(royal.id)}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                                >
                                    Crown {royal.name === 'Shahzada' ? 'Prince (Shahzada)' : 'Adventitious King'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};