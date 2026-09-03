import { Piece } from '../Piece.ts';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class GrantKing extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'King');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        // 1. One step in any direction
        for (const dir of directions) {
            const targetX = x + dir.x;
            const targetY = y + dir.y;

            if (!board.isOutOfBounds(targetX, targetY)) {
                const targetPiece = board.getPieceAt(targetX, targetY);
                if (targetPiece === null || targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: targetY });
                }
            }
        }

        // 2. On first move: can go 2 squares in any direction, leaping over intermediate pieces
        if (!this.hasMoved) {
            for (const dir of directions) {
                const leapX = x + dir.x * 2;
                const leapY = y + dir.y * 2;

                if (!board.isOutOfBounds(leapX, leapY)) {
                    const targetPiece = board.getPieceAt(leapX, leapY);
                    if (targetPiece === null || targetPiece.color !== this.color) {
                        moves.push({ x: leapX, y: leapY });
                    }
                }
            }
        }

        return moves;
    }
}
