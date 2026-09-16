import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiHorse extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiHorse');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const possibleMoves = [
            // orthogonal step, then diagonal
            { dx: 1, dy: 2, bx: 0, by: 1 },
            { dx: -1, dy: 2, bx: 0, by: 1 },
            { dx: 1, dy: -2, bx: 0, by: -1 },
            { dx: -1, dy: -2, bx: 0, by: -1 },
            { dx: 2, dy: 1, bx: 1, by: 0 },
            { dx: 2, dy: -1, bx: 1, by: 0 },
            { dx: -2, dy: 1, bx: -1, by: 0 },
            { dx: -2, dy: -1, bx: -1, by: 0 }
        ];

        for (const { dx, dy, bx, by } of possibleMoves) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                // Check hobbling (blocker in orthogonal step)
                const blockPiece = board.getPieceAt(x + bx, y + by);
                if (!blockPiece) {
                    const targetPiece = board.getPieceAt(nx, ny);
                    if (!targetPiece || targetPiece.color !== this.color) {
                        moves.push({ x: nx, y: ny });
                    }
                }
            }
        }

        return moves;
    }
}
