import { useGameStore } from '../../store/useGameStore';
import { getPieceImage, getSquareBackground, getPawnBadgeIcon } from '../../utils/pieceMapper';
import { TamerlanePawn } from '../../core/pieces/piecesIndex';
import { useEffect, useState } from 'react';
import type { Position } from '../../types';
import { useTranslation } from '../../i18n';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { InterceptionOverlay } from '../modals/interceptions';

export const Board = () => {
    const { t } = useTranslation();
    const {
        engine,
        currentVariantId,
        selectedPosition,
        legalMoves,
        selectSquare,
        initGame,
        isAiThinking,
        gameMode,
        playerColor
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
                {t.common.loading}
            </div>
        );
    }

    const board = engine.board;
    const variantDef = VariantRegistry.get(currentVariantId);

    const isFlipped = gameMode === 'vs_ai' && playerColor === 'black';
    const yIndices = Array.from({ length: board.rows }, (_, i) => isFlipped ? board.rows - 1 - i : i);
    const xIndices = Array.from({ length: board.cols }, (_, i) => isFlipped ? board.cols - 1 - i : i);

    let squareSizeClass = 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20';
    if (variantDef?.tileSize === 'compact') {
        squareSizeClass = 'w-8 h-8 md:w-11 md:h-11 lg:w-[3.8rem] lg:h-[3.8rem]';
    } else if (variantDef?.tileSize === 'small') {
        squareSizeClass = 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[3.1rem] lg:h-[3.1rem] xl:w-[3.4rem] xl:h-[3.4rem]';
    }

    return (
        <div className="flex justify-center items-center p-4 relative">
            <InterceptionOverlay />
            <div
                className="grid border-4 border-slate-950 shadow-2xl rounded overflow-hidden relative"
                style={{
                    gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${board.rows}, minmax(0, 1fr))`
                }}
            >
                {yIndices.map((y, visualRowIdx) =>
                    xIndices.map((x) => {
                        const piece = board.getPieceAt(x, y);
                        const isPlayable = !board.isOutOfBounds(x, y);

                        // If the square is "out of bounds", a transparent square is drawn
                        if (!isPlayable) {
                            return <div key={`${x}-${y}`} className={`${squareSizeClass} bg-transparent`} />;
                        }

                        const isLight = (x + y) % 2 === 0;
                        const isMonochrome = currentVariantId === 'chaturanga' || currentVariantId === 'shatranj' || currentVariantId === 'tamerlane' || currentVariantId === 'chaturaji';
                        const bgImage = getSquareBackground(x, y, currentVariantId);
                        const pieceImage = getPieceImage(piece);

                        const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
                        const isLegalMove = legalMoves.some((m) => m.x === x && m.y === y);
                        const isEnemyThreatened = hoveredEnemyMoves.some((m) => m.x === x && m.y === y);

                        // Coordinate logic and tamerlane variant case
                        const isTamerlane = currentVariantId === 'tamerlane';
                        const fileIndex = isTamerlane ? x - 1 : x;
                        const maxFiles = isTamerlane ? 11 : board.cols;
                        const fileLetter = fileIndex >= 0 && fileIndex < maxFiles ? String.fromCharCode(97 + fileIndex) : '';
                        const rankNumber = board.rows - y;
                        const isBottomRow = visualRowIdx === board.rows - 1 && fileIndex >= 0 && fileIndex < maxFiles;
                        const isRightCol = isFlipped
                            ? (isTamerlane ? x === 1 : x === 0)
                            : (isTamerlane ? x === 11 : x === board.cols - 1);

                        // If uses monochrome board use only light tiles and add a black separator
                        const cssBgClass = (isLight || isMonochrome) ? 'bg-atlas-boardLight' : 'bg-atlas-boardDark';
                        const textColor = (isLight || isMonochrome) ? 'text-atlas-boardDark' : 'text-atlas-boardLight';
                        const monochromeBorder = isMonochrome ? 'ring-1 ring-inset ring-black/20' : '';

                        // Track the last move to trigger CSS slide transition
                        const lastMove = engine.history.length > 0 ? engine.history[engine.history.length - 1] : null;
                        const isJustMoved = Boolean(piece && lastMove && lastMove.to.x === x && lastMove.to.y === y);

                        let animStyle: React.CSSProperties | undefined = undefined;
                        if (isJustMoved && lastMove) {
                            const deltaX = isFlipped
                                ? (lastMove.to.x - lastMove.from.x) * 100
                                : (lastMove.from.x - lastMove.to.x) * 100;
                            const deltaY = isFlipped
                                ? (lastMove.to.y - lastMove.from.y) * 100
                                : (lastMove.from.y - lastMove.to.y) * 100;

                            animStyle = {
                                '--slide-x': `${deltaX}%`,
                                '--slide-y': `${deltaY}%`,
                            } as React.CSSProperties;
                        }

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
                                className={`${squareSizeClass} flex justify-center items-center bg-cover bg-center ${isAiThinking ? 'cursor-wait' : 'cursor-pointer'} relative ${cssBgClass} ${monochromeBorder}`}
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

                                {/* Render piece with smooth slide animation */}
                                {pieceImage && (
                                    <div
                                        key={`${piece?.id}-${engine.history.length}`}
                                        className={`w-full h-full relative z-10 flex items-center justify-center ${isJustMoved ? 'animate-slide-piece' : ''}`}
                                        style={animStyle}
                                    >
                                        <img
                                            src={pieceImage}
                                            alt={piece?.name}
                                            className={`w-full h-full object-contain select-none transition-transform ${isSelected ? 'scale-110' : ''}`}
                                        />

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
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
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
        </div>
    );
};
