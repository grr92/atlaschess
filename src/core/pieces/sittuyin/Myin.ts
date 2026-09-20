import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class Myin extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Myin');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const offsets = [
            { x: 1, y: 2 }, { x: 1, y: -2 },
            { x: -1, y: 2 }, { x: -1, y: -2 },
            { x: 2, y: 1 }, { x: 2, y: -1 },
            { x: -2, y: 1 }, { x: -2, y: -1 }
        ];

        const { x, y } = this.position;

        for (const offset of offsets) {
            const targetX = x + offset.x;
            const targetY = y + offset.y;

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
