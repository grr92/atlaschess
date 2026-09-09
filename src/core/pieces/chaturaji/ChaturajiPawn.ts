import { Piece } from '../Piece.ts';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class ChaturajiPawn extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ChaturajiPawn');
    }

    // Direction vector for each player color
    getForwardVector(): { dx: number; dy: number } {
        switch (this.color) {
            case 'green': return { dx: 0, dy: -1 };
            case 'red': return { dx: -1, dy: 0 };
            case 'yellow': return { dx: 1, dy: 0 };
            case 'blue': return { dx: 0, dy: 1 };
            default: return { dx: 0, dy: -1 };
        }
    }

    isAtPromotionBoundary(): boolean {
        switch (this.color) {
            case 'green': return this.position.y === 0;
            case 'red': return this.position.x === 0;
            case 'yellow': return this.position.x === 7;
            case 'blue': return this.position.y === 7;
            default: return false;
        }
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { dx, dy } = this.getForwardVector();
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
                if (targetPiece !== null && targetPiece.color !== this.color) {
                    moves.push({ x: offset.cx, y: offset.cy });
                }
            }
        }

        return moves;
    }
}
