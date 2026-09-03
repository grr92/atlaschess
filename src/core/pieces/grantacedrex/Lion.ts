import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class Lion extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Lion');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const jumps = [
            // 3 steps orthogonally
            { dx: 0, dy: 3 }, { dx: 0, dy: -3 },
            { dx: 3, dy: 0 }, { dx: -3, dy: 0 },
            // 2x4 rectangle jumps (2 orthogonal + 1 diagonal)
            { dx: 1, dy: 3 }, { dx: 1, dy: -3 },
            { dx: -1, dy: 3 }, { dx: -1, dy: -3 },
            { dx: 3, dy: 1 }, { dx: 3, dy: -1 },
            { dx: -3, dy: 1 }, { dx: -3, dy: -1 }
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
