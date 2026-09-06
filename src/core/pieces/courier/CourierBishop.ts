import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class CourierBishop extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'CourierBishop');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const leaps = [
            { x: 2, y: 2 }, { x: 2, y: -2 }, { x: -2, y: 2 }, { x: -2, y: -2 }
        ];

        const { x, y } = this.position;

        for (const leap of leaps) {
            const targetX = x + leap.x;
            const targetY = y + leap.y;

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
