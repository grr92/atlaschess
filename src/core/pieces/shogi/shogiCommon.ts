import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

/**
 * Common move generation helpers for Shogi pieces to maintain DRY and SOLID principles.
 */
export function getGoldMoves(board: Board, color: PieceColor, pos: Position): Position[] {
    const moves: Position[] = [];
    const forwardY = color === 'white' ? -1 : 1;

    // Gold moves 1 step in 6 directions: 4 orthogonal + 2 forward-diagonal
    const offsets = [
        { dx: 0, dy: forwardY },   // Forward
        { dx: 0, dy: -forwardY },  // Backward
        { dx: -1, dy: 0 },         // Left
        { dx: 1, dy: 0 },          // Right
        { dx: -1, dy: forwardY },  // Forward-Left
        { dx: 1, dy: forwardY },   // Forward-Right
    ];

    for (const { dx, dy } of offsets) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        if (!board.isOutOfBounds(nx, ny)) {
            const target = board.getPieceAt(nx, ny);
            if (!target || target.color !== color) {
                moves.push({ x: nx, y: ny });
            }
        }
    }

    return moves;
}

export function getStepMoves(board: Board, color: PieceColor, pos: Position, offsets: { dx: number; dy: number }[]): Position[] {
    const moves: Position[] = [];
    for (const { dx, dy } of offsets) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        if (!board.isOutOfBounds(nx, ny)) {
            const target = board.getPieceAt(nx, ny);
            if (!target || target.color !== color) {
                moves.push({ x: nx, y: ny });
            }
        }
    }
    return moves;
}

export function getSlidingMoves(board: Board, color: PieceColor, pos: Position, directions: { dx: number; dy: number }[]): Position[] {
    const moves: Position[] = [];
    for (const { dx, dy } of directions) {
        let nx = pos.x + dx;
        let ny = pos.y + dy;
        while (!board.isOutOfBounds(nx, ny)) {
            const target = board.getPieceAt(nx, ny);
            if (!target) {
                moves.push({ x: nx, y: ny });
            } else {
                if (target.color !== color) {
                    moves.push({ x: nx, y: ny });
                }
                break;
            }
            nx += dx;
            ny += dy;
        }
    }
    return moves;
}
