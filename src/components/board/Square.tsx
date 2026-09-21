import React from 'react';
import type { Position } from '../../types';
import type { Piece } from '../../core/pieces/Piece';
import type { ContextAction } from '../../core/engine/BaseEngine';
import { getPieceImage, getSquareBackground } from '../../utils/pieceMapper';
import { PieceBadges } from './PieceBadges';
import { useTranslation } from '../../i18n';
import { useGameStore } from '../../store/useGameStore';

export interface SquareProps {
    x: number;
    y: number;
    visualRowIdx: number;
    rows: number;
    cols: number;
    isFlipped: boolean;
    squareSizeClass: string;
    isPlayable: boolean;
    isMonochrome: boolean;
    currentVariantId: string;
    piece: Piece | null;
    isHidden: boolean;
    isSelected: boolean;
    isLegalMove: boolean;
    isPlacementTarget: boolean;
    isRemovable: boolean;
    isEnemyThreatened: boolean;
    isAiThinking: boolean;
    contextActions: ContextAction[];
    isJustMoved: boolean;
    deltaX: number;
    deltaY: number;
    historyLength: number;
    onSelect: (pos: Position) => void;
    onHoverEnemy: (piece: Piece) => void;
    onMouseLeave: () => void;
    onExecuteAction: (pos: Position, actionId: string) => void;
}

/**
 * Encapsulates the visual presentation and interactions of an individual square
 * on the chess board (tile background, coordinates, piece image, badges, highlights,
 * and contextual floating buttons).
 */
export const Square: React.FC<SquareProps> = ({
    x,
    y,
    visualRowIdx,
    rows,
    cols,
    isFlipped,
    squareSizeClass,
    isPlayable,
    isMonochrome,
    currentVariantId,
    piece,
    isHidden,
    isSelected,
    isLegalMove,
    isPlacementTarget,
    isRemovable,
    isEnemyThreatened,
    isAiThinking,
    contextActions,
    isJustMoved,
    deltaX,
    deltaY,
    historyLength,
    onSelect,
    onHoverEnemy,
    onMouseLeave,
    onExecuteAction,
}) => {
    const { t } = useTranslation();
    const regionalPieceStyle = useGameStore(state => state.regionalPieceStyle);

    // If square is out of bounds (e.g. empty spaces around Tamerlane citadels)
    if (!isPlayable) {
        return <div className={`${squareSizeClass} bg-transparent`} />;
    }

    const isLight = (x + y) % 2 === 0;
    const bgImage = getSquareBackground(x, y, currentVariantId);
    const pieceImage = isHidden ? null : getPieceImage(piece, regionalPieceStyle);

    // Coordinate logic and Tamerlane variant adjustment
    const isTamerlane = currentVariantId === 'tamerlane';
    const fileIndex = isTamerlane ? x - 1 : x;
    const maxFiles = isTamerlane ? 11 : cols;
    const fileLetter = fileIndex >= 0 && fileIndex < maxFiles ? String.fromCharCode(97 + fileIndex) : '';
    const rankNumber = rows - y;
    const isBottomRow = visualRowIdx === rows - 1 && fileIndex >= 0 && fileIndex < maxFiles;
    const isRightCol = isFlipped
        ? (isTamerlane ? x === 1 : x === 0)
        : (isTamerlane ? x === 11 : x === cols - 1);

    const cssBgClass = (isLight || isMonochrome) ? 'bg-atlas-boardLight' : 'bg-atlas-boardDark';
    const textColor = (isLight || isMonochrome) ? 'text-atlas-boardDark' : 'text-atlas-boardLight';
    const monochromeBorder = isMonochrome ? 'ring-1 ring-inset ring-black/20' : '';
    const removableClass = isRemovable ? 'hover:ring-2 hover:ring-red-400/80 hover:bg-red-500/10' : '';

    const animStyle: React.CSSProperties | undefined = isJustMoved
        ? ({
              '--slide-x': `${deltaX}%`,
              '--slide-y': `${deltaY}%`,
          } as React.CSSProperties)
        : undefined;

    return (
        <div
            onClick={() => !isAiThinking && onSelect({ x, y })}
            onMouseEnter={() => {
                if (!isAiThinking && piece && !isHidden && !isRemovable) {
                    onHoverEnemy(piece);
                }
            }}
            onMouseLeave={onMouseLeave}
            className={`${squareSizeClass} flex justify-center items-center bg-cover bg-center ${isAiThinking ? 'cursor-wait' : 'cursor-pointer'} relative ${cssBgClass} ${monochromeBorder} ${removableClass}`}
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
                <div className="absolute inset-0 bg-yellow-400/50 animate-pulse z-0" />
            )}

            {/* Placement target highlight */}
            {isPlacementTarget && (
                <div className="absolute inset-1 rounded-lg border-2 border-dashed border-emerald-400/90 bg-emerald-500/25 animate-pulse z-15 pointer-events-none" />
            )}

            {/* Polymorphic Contextual Actions (e.g. Sittuyin deferred promotion) */}
            {isSelected && contextActions.map((action) => {
                const rawLabel = t.gameplay[action.labelKey as keyof typeof t.gameplay];
                const label = typeof rawLabel === 'string' ? rawLabel : action.labelKey;
                return (
                    <button
                        key={action.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onExecuteAction({ x, y }, action.id);
                        }}
                        className="absolute -top-9 sm:-top-10 left-1/2 -translate-x-1/2 z-30 px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl whitespace-nowrap flex items-center gap-1.5 border border-amber-300 ring-2 ring-black/40 animate-bounce active:scale-95 cursor-pointer"
                        title={label}
                    >
                        {action.icon && <span className="text-sm">{action.icon}</span>}
                        <span>{label}</span>
                    </button>
                );
            })}

            {/* Enemy threatened square highlight on hover */}
            {isEnemyThreatened && !isSelected && (
                <div className="absolute inset-0 bg-red-500/25 ring-2 ring-inset ring-red-500/60 z-15 pointer-events-none transition-opacity" />
            )}

            {/* Render piece with smooth slide animation and interactive hover */}
            {pieceImage && (
                <div
                    key={`${piece?.id}-${historyLength}`}
                    className={`w-full h-full relative z-10 flex items-center justify-center transition-transform duration-150 ${
                        !isAiThinking ? 'hover:scale-110' : ''
                    } ${isSelected ? 'scale-110' : ''} ${isJustMoved ? 'animate-slide-piece' : ''}`}
                    style={animStyle}
                >
                    <img
                        src={pieceImage}
                        alt={piece?.name}
                        className="w-full h-full object-contain select-none pointer-events-none"
                    />

                    {/* Royal & promotion badges overlay */}
                    <PieceBadges piece={piece} />
                </div>
            )}

            {/* Legal move dots/indicators (green dot for move, red ring for capture) */}
            {isLegalMove && (
                <div
                    className={`absolute z-20 rounded-full pointer-events-none ${
                        piece
                            ? 'inset-0.5 md:inset-1 border-4 border-red-500/80 bg-red-500/10'
                            : 'w-4 h-4 md:w-5 md:h-5 bg-emerald-500/80 shadow-md'
                    }`}
                />
            )}
        </div>
    );
};
