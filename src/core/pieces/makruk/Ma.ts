import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class Ma extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Ma');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const jumps = [
            { x: 1, y: 2 }, { x: 1, y: -2 },
            { x: -1, y: 2 }, { x: -1, y: -2 },
            { x: 2, y: 1 }, { x: 2, y: -1 },
            { x: -2, y: 1 }, { x: -2, y: -1 }
        ];

        const { x, y } = this.position;

        for (const jump of jumps) {
            const targetX = x + jump.x;
            const targetY = y + jump.y;

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
