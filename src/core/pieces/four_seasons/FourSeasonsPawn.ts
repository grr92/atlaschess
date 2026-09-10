import { Piece } from '../Piece.ts';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class FourSeasonsPawn extends Piece {
    direction: { dx: number; dy: number };

    constructor(
        id: string,
        color: PieceColor,
        position: Position,
        direction: { dx: number; dy: number } = { dx: 0, dy: 1 }
    ) {
        super(id, color, position, 'FourSeasonsPawn');
        this.direction = direction;
    }

    override clone(): FourSeasonsPawn {
        const cloned = new FourSeasonsPawn(
            this.id,
            this.color,
            { ...this.position },
            { ...this.direction }
        );
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }

    isAtPromotionBoundary(): boolean {
        const { dx, dy } = this.direction;
        if (dx === 1) return this.position.x === 7;
        if (dx === -1) return this.position.x === 0;
        if (dy === 1) return this.position.y === 7;
        if (dy === -1) return this.position.y === 0;
        return false;
    }

    getPossibleMoves(board: Board, _lastMove?: Move, isFriendly?: (c1: PieceColor, c2: PieceColor) => boolean): Position[] {
        const moves: Position[] = [];
        const isSameTeam = isFriendly || ((c1: PieceColor, c2: PieceColor) => c1 === c2);
        const { dx, dy } = this.direction;
        const { x, y } = this.position;

        // 1. One step forward move (must be empty)
        const forwardX = x + dx;
        const forwardY = y + dy;
        if (!board.isOutOfBounds(forwardX, forwardY)) {
            if (board.getPieceAt(forwardX, forwardY) === null) {
                moves.push({ x: forwardX, y: forwardY });
            }
        }

        // 2. Diagonal captures (must contain enemy piece)
        let captureOffsets: { cx: number; cy: number }[] = [];
        if (dx === 0) {
            // Moving vertically along Y: diagonal captures change X by +/-1
            captureOffsets = [
                { cx: x - 1, cy: y + dy },
                { cx: x + 1, cy: y + dy }
            ];
        } else {
            // Moving horizontally along X: diagonal captures change Y by +/-1
            captureOffsets = [
                { cx: x + dx, cy: y - 1 },
                { cx: x + dx, cy: y + 1 }
            ];
        }

        for (const offset of captureOffsets) {
            if (!board.isOutOfBounds(offset.cx, offset.cy)) {
                const targetPiece = board.getPieceAt(offset.cx, offset.cy);
                if (targetPiece !== null && !isSameTeam(this.color, targetPiece.color)) {
                    moves.push({ x: offset.cx, y: offset.cy });
                }
            }
        }

        return moves;
    }
}
