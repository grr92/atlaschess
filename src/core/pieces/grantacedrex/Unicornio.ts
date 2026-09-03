import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class Unicornio extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Unicornio');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const knightJumps = [
            { kx: 1, ky: 2 }, { kx: 2, ky: 1 },
            { kx: 2, ky: -1 }, { kx: 1, ky: -2 },
            { kx: -1, ky: -2 }, { kx: -2, ky: -1 },
            { kx: -2, ky: 1 }, { kx: -1, ky: 2 }
        ];

        for (const { kx, ky } of knightJumps) {
            const jumpX = x + kx;
            const jumpY = y + ky;

            if (board.isOutOfBounds(jumpX, jumpY)) continue;

            const targetPiece = board.getPieceAt(jumpX, jumpY);

            if (targetPiece) {
                if (targetPiece.color !== this.color) {
                    moves.push({ x: jumpX, y: jumpY });
                }
                continue;
            }

            // Knight jump square is empty: add it and continue sliding diagonally outward
            moves.push({ x: jumpX, y: jumpY });

            const dirX = Math.sign(kx);
            const dirY = Math.sign(ky);

            let currX = jumpX + dirX;
            let currY = jumpY + dirY;

            while (!board.isOutOfBounds(currX, currY)) {
                const diagPiece = board.getPieceAt(currX, currY);
                if (!diagPiece) {
                    moves.push({ x: currX, y: currY });
                } else {
                    if (diagPiece.color !== this.color) {
                        moves.push({ x: currX, y: currY });
                    }
                    break;
                }
                currX += dirX;
                currY += dirY;
            }
        }

        return moves;
    }
}
