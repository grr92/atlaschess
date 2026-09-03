import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class Giraffe extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Giraffe');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        // Jumps to the opposed square of a 3x4 rectangle (1 orthogonal + 2 diagonal)
        const jumps = [
            { dx: 2, dy: 3 }, { dx: 2, dy: -3 },
            { dx: -2, dy: 3 }, { dx: -2, dy: -3 },
            { dx: 3, dy: 2 }, { dx: 3, dy: -2 },
            { dx: -3, dy: 2 }, { dx: -3, dy: -2 }
        ];

        for (const { dx, dy } of jumps) {
            const targetX = x + dx;
            const targetY = y + dy;

            if (!board.isOutOfBounds(targetX, targetY)) {
                const targetPiece = board.getPieceAt(targetX, targetY);
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: targetY });
                }
            }
        }

        return moves;
    }
}
