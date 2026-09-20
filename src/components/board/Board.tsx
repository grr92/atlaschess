import { useGameStore } from '../../store/useGameStore';
import { useEffect, useState } from 'react';
import type { Position } from '../../types';
import type { Piece } from '../../core/pieces/Piece';
import { useTranslation } from '../../i18n';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { InterceptionOverlay } from '../modals/interceptions';
import { VariantOverlay, VariantTray } from './VariantUiExtensions';
import { BoardMarkings } from './BoardMarkings';
import { Square } from './Square';

/**
 * Orchestrator component for the main chess board grid.
 * Sets up grid dimensions, orientation, overlays, and renders individual squares.
 */
export const Board = () => {
    const { t } = useTranslation();
    const {
        engine,
        currentVariantId,
        selectedPosition,
        legalMoves,
        selectSquare,
        executeContextAction,
        initGame,
        isAiThinking,
        gameMode,
        playerColor,
        lastAction,
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

    const placementTargets = engine.getPlacementTargets();
    const isMonochrome = Boolean(variantDef?.isMonochromeBoard);

    let squareSizeClass = 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20';
    if (variantDef?.tileSize === 'compact') {
        squareSizeClass = 'w-8 h-8 md:w-11 md:h-11 lg:w-[3.8rem] lg:h-[3.8rem]';
    } else if (variantDef?.tileSize === 'small') {
        squareSizeClass = 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[3.1rem] lg:h-[3.1rem] xl:w-[3.4rem] xl:h-[3.4rem]';
    }

    const lastMove = engine.history.length > 0 ? engine.history[engine.history.length - 1] : null;

    const handleHoverEnemy = (piece: Piece) => {
        if (piece.color !== engine.currentTurn) {
            setHoveredEnemyMoves(engine.getLegalMoves(piece));
        }
    };

    const handleMouseLeave = () => setHoveredEnemyMoves([]);

    return (
        <div className="flex flex-col justify-center items-center p-4 relative">
            <InterceptionOverlay />
            <VariantOverlay variantId={currentVariantId} />

            <div
                className="grid border-4 border-slate-950 shadow-2xl rounded overflow-hidden relative"
                style={{
                    gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${board.rows}, minmax(0, 1fr))`
                }}
            >
                {/* Historic Board Diagonal Markings (e.g. Four Seasons central 'X' or Sittuyin Sit-ke-min) */}
                <BoardMarkings variantId={currentVariantId} />

                {yIndices.map((y, visualRowIdx) =>
                    xIndices.map((x) => {
                        const piece = board.getPieceAt(x, y);
                        const isPlayable = !board.isOutOfBounds(x, y);
                        const isHidden = Boolean(piece && engine.isPieceHidden(piece));
                        const isPlacementTarget = placementTargets.some((m) => m.x === x && m.y === y);
                        const isRemovable = engine.isSquareRemovable({ x, y });
                        const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
                        const isLegalMove = legalMoves.some((m) => m.x === x && m.y === y);
                        const isEnemyThreatened = hoveredEnemyMoves.some((m) => m.x === x && m.y === y);

                        const isJustMoved = Boolean(lastAction === 'move' && piece && lastMove && lastMove.to.x === x && lastMove.to.y === y);
                        const deltaX = lastMove ? (isFlipped ? (lastMove.to.x - lastMove.from.x) * 100 : (lastMove.from.x - lastMove.to.x) * 100) : 0;
                        const deltaY = lastMove ? (isFlipped ? (lastMove.to.y - lastMove.from.y) * 100 : (lastMove.from.y - lastMove.to.y) * 100) : 0;

                        return (
                            <Square
                                key={`${x}-${y}`}
                                x={x}
                                y={y}
                                visualRowIdx={visualRowIdx}
                                rows={board.rows}
                                cols={board.cols}
                                isFlipped={isFlipped}
                                squareSizeClass={squareSizeClass}
                                isPlayable={isPlayable}
                                isMonochrome={isMonochrome}
                                currentVariantId={currentVariantId}
                                piece={piece}
                                isHidden={isHidden}
                                isSelected={isSelected}
                                isLegalMove={isLegalMove}
                                isPlacementTarget={isPlacementTarget}
                                isRemovable={isRemovable}
                                isEnemyThreatened={isEnemyThreatened}
                                isAiThinking={isAiThinking}
                                contextActions={isSelected ? engine.getContextActions({ x, y }) : []}
                                isJustMoved={isJustMoved}
                                deltaX={deltaX}
                                deltaY={deltaY}
                                historyLength={engine.history.length}
                                onSelect={selectSquare}
                                onHoverEnemy={handleHoverEnemy}
                                onMouseLeave={handleMouseLeave}
                                onExecuteAction={executeContextAction}
                            />
                        );
                    })
                )}
            </div>

            {/* Variant Trays (e.g. Sittuyin Troops Deployment Tray) */}
            <VariantTray variantId={currentVariantId} />
        </div>
    );
};