import { useGameStore } from '../../store/useGameStore';
import { getXiangqiPieceImage } from '../../utils/xiangqiPieceMapper';
import { useState } from 'react';
import type { Position } from '../../types';

export const XiangqiBoard = () => {
    const {
        engine,
        selectedPosition,
        legalMoves,
        selectSquare,
        regionalPieceStyle,
        isAiThinking
    } = useGameStore();

    const [hoveredEnemyMoves, setHoveredEnemyMoves] = useState<Position[]>([]);

    if (!engine) return null;

    const rows = 10;
    const cols = 9;

    const cellSize = 60;
    const boardWidth = (cols - 1) * cellSize;
    const boardHeight = (rows - 1) * cellSize;
    const padding = 30;

    const handleSquareClick = (x: number, y: number) => {
        selectSquare({ x, y });
    };

    // Helper to check if a position is in legal moves
    const isLegalMove = (x: number, y: number) => {
        return legalMoves.some(m => m.x === x && m.y === y);
    };

    const isSelected = (x: number, y: number) => {
        return selectedPosition?.x === x && selectedPosition?.y === y;
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-4 bg-atlas-surface/30 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
            <div 
                className="relative bg-[#dca872] rounded-lg shadow-inner"
                style={{
                    width: boardWidth + padding * 2,
                    height: boardHeight + padding * 2
                }}
            >
                {/* SVG Background for the grid */}
                <svg 
                    width={boardWidth + padding * 2} 
                    height={boardHeight + padding * 2} 
                    className="absolute top-0 left-0 pointer-events-none"
                >
                    <g transform={`translate(${padding}, ${padding})`}>
                        {/* Horizontal lines */}
                        {Array.from({ length: rows }).map((_, i) => (
                            <line key={`h-${i}`} x1={0} y1={i * cellSize} x2={boardWidth} y2={i * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        ))}
                        {/* Vertical lines (top half) */}
                        {Array.from({ length: cols }).map((_, i) => (
                            <line key={`vt-${i}`} x1={i * cellSize} y1={0} x2={i * cellSize} y2={4 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        ))}
                        {/* Vertical lines (bottom half) */}
                        {Array.from({ length: cols }).map((_, i) => (
                            <line key={`vb-${i}`} x1={i * cellSize} y1={5 * cellSize} x2={i * cellSize} y2={9 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        ))}
                        {/* Edges connecting the river */}
                        <line x1={0} y1={4 * cellSize} x2={0} y2={5 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        <line x1={boardWidth} y1={4 * cellSize} x2={boardWidth} y2={5 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />

                        {/* Palaces diagonals */}
                        <line x1={3 * cellSize} y1={0} x2={5 * cellSize} y2={2 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        <line x1={5 * cellSize} y1={0} x2={3 * cellSize} y2={2 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        
                        <line x1={3 * cellSize} y1={7 * cellSize} x2={5 * cellSize} y2={9 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        <line x1={5 * cellSize} y1={7 * cellSize} x2={3 * cellSize} y2={9 * cellSize} stroke="#000" strokeWidth="2" opacity="0.6" />
                        
                        {/* River text */}
                        <text x={boardWidth / 2 - 80} y={4.5 * cellSize + 8} fontSize="24" fill="#000" opacity="0.6" fontFamily="sans-serif">楚河</text>
                        <text x={boardWidth / 2 + 30} y={4.5 * cellSize + 8} fontSize="24" fill="#000" opacity="0.6" fontFamily="sans-serif">漢界</text>
                    </g>
                </svg>

                {/* Clickable intersections and pieces */}
                {Array.from({ length: rows }).map((_, y) => (
                    Array.from({ length: cols }).map((_, x) => {
                        const piece = engine.board.getPieceAt(x, y);
                        const isLegal = isLegalMove(x, y);
                        const selected = isSelected(x, y);
                        const isEnemyThreatened = hoveredEnemyMoves.some((m) => m.x === x && m.y === y);
                        const img = getXiangqiPieceImage(piece, regionalPieceStyle);
                        
                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => !isAiThinking && handleSquareClick(x, y)}
                                onMouseEnter={() => {
                                    if (!isAiThinking && piece && piece.color !== engine.currentTurn) {
                                        setHoveredEnemyMoves(engine.getLegalMoves(piece));
                                    }
                                }}
                                onMouseLeave={() => setHoveredEnemyMoves([])}
                                className={`absolute flex items-center justify-center rounded-full transition-transform duration-150 ${selected ? 'scale-110' : (!isAiThinking ? 'hover:scale-110' : '')} ${isAiThinking ? 'cursor-wait' : 'cursor-pointer'}`}
                                style={{
                                    left: padding + x * cellSize - cellSize / 2,
                                    top: padding + y * cellSize - cellSize / 2,
                                    width: cellSize,
                                    height: cellSize,
                                    zIndex: selected ? 25 : (piece ? 10 : 1)
                                }}
                            >
                                {selected && <div className="absolute inset-0 bg-yellow-400/50 rounded-full animate-pulse z-0" />}
                                {isEnemyThreatened && !selected && (
                                    <div className="absolute inset-0 bg-red-500/25 ring-2 ring-inset ring-red-500/60 rounded-full z-15 pointer-events-none transition-opacity" />
                                )}
                                {isLegal && !piece && <div className="absolute w-4 h-4 bg-green-500/60 rounded-full z-0" />}
                                {isLegal && piece && <div className="absolute inset-0 border-4 border-red-500/80 rounded-full z-0" />}
                                {img && (
                                    <img 
                                        src={img} 
                                        alt={piece?.name} 
                                        className="w-12 h-12 relative z-10 drop-shadow-md pointer-events-none" 
                                        draggable={false}
                                    />
                                )}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};
