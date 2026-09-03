import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class Aanca extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Aanca');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        // Diagonal directions for the initial step
        const diagDirs = [
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ];

        for (const { dx, dy } of diagDirs) {
            const stepX = x + dx;
            const stepY = y + dy;

            if (board.isOutOfBounds(stepX, stepY)) continue;

            const targetPiece = board.getPieceAt(stepX, stepY);

            // If the initial diagonal square is occupied by an enemy, it can capture it
            if (targetPiece) {
                if (targetPiece.color !== this.color) {
                    moves.push({ x: stepX, y: stepY });
                }
                // Cannot continue through an occupied square
                continue;
            }

            // Diagonal square is empty: it can move there
            moves.push({ x: stepX, y: stepY });

            // And continue sliding orthogonally away from the diagonal step
            const orthoRays = [
                { ox: dx, oy: 0 },
                { ox: 0, oy: dy }
            ];

            for (const { ox, oy } of orthoRays) {
                let currX = stepX + ox;
                let currY = stepY + oy;

                while (!board.isOutOfBounds(currX, currY)) {
                    const slidePiece = board.getPieceAt(currX, currY);
                    if (!slidePiece) {
                        moves.push({ x: currX, y: currY });
                    } else {
                        if (slidePiece.color !== this.color) {
                            moves.push({ x: currX, y: currY });
                        }
                        break;
                    }
                    currX += ox;
                    currY += oy;
                }
            }
        }

        return moves;
    }
}
