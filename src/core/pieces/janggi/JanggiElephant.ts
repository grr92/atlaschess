import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiElephant extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiElephant');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const patterns = [
            // Upward
            { b1: { dx: 0, dy: -1 }, b2: { dx: -1, dy: -2 }, dest: { dx: -2, dy: -3 } },
            { b1: { dx: 0, dy: -1 }, b2: { dx: 1, dy: -2 }, dest: { dx: 2, dy: -3 } },
            // Downward
            { b1: { dx: 0, dy: 1 }, b2: { dx: -1, dy: 2 }, dest: { dx: -2, dy: 3 } },
            { b1: { dx: 0, dy: 1 }, b2: { dx: 1, dy: 2 }, dest: { dx: 2, dy: 3 } },
            // Leftward
            { b1: { dx: -1, dy: 0 }, b2: { dx: -2, dy: -1 }, dest: { dx: -3, dy: -2 } },
            { b1: { dx: -1, dy: 0 }, b2: { dx: -2, dy: 1 }, dest: { dx: -3, dy: 2 } },
            // Rightward
            { b1: { dx: 1, dy: 0 }, b2: { dx: 2, dy: -1 }, dest: { dx: 3, dy: -2 } },
            { b1: { dx: 1, dy: 0 }, b2: { dx: 2, dy: 1 }, dest: { dx: 3, dy: 2 } }
        ];

        for (const { b1, b2, dest } of patterns) {
            const nx = x + dest.dx;
            const ny = y + dest.dy;

            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                // Check intermediate blockers (1st orthogonal step and 2nd diagonal step)
                const blocker1 = board.getPieceAt(x + b1.dx, y + b1.dy);
                const blocker2 = board.getPieceAt(x + b2.dx, y + b2.dy);

                if (!blocker1 && !blocker2) {
                    const target = board.getPieceAt(nx, ny);
                    if (!target || target.color !== this.color) {
                        moves.push({ x: nx, y: ny });
                    }
                }
            }
        }

        return moves;
    }
}
