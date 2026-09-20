import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class Yahhta extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Yahhta');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        const { x, y } = this.position;

        for (const dir of directions) {
            let step = 1;
            while (true) {
                const targetX = x + dir.x * step;
                const targetY = y + dir.y * step;

                if (board.isOutOfBounds(targetX, targetY)) {
                    break;
                }

                const targetPiece = board.getPieceAt(targetX, targetY);
                if (targetPiece === null) {
                    moves.push({ x: targetX, y: targetY });
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({ x: targetX, y: targetY });
                    }
                    break;
                }
                step++;
            }
        }

        return moves;
    }
}
