import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class Crocodile extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Crocodile');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const directions = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];

        for (const dir of directions) {
            let currX = this.position.x + dir.x;
            let currY = this.position.y + dir.y;

            while (!board.isOutOfBounds(currX, currY)) {
                const targetPiece = board.getPieceAt(currX, currY);
                if (!targetPiece) {
                    moves.push({ x: currX, y: currY });
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({ x: currX, y: currY });
                    }
                    break;
                }
                currX += dir.x;
                currY += dir.y;
            }
        }

        return moves;
    }
}
