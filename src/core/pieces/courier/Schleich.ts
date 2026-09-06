import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class Schleich extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Schleich');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        const { x, y } = this.position;

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

        return moves;
    }
}
