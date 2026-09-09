import { Piece } from '../Piece.ts';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class ChaturajiHorse extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ChaturajiHorse');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const leaps = [
            { x: 1, y: 2 }, { x: 1, y: -2 },
            { x: -1, y: 2 }, { x: -1, y: -2 },
            { x: 2, y: 1 }, { x: 2, y: -1 },
            { x: -2, y: 1 }, { x: -2, y: -1 }
        ];

        const { x, y } = this.position;

        for (const leap of leaps) {
            const targetX = x + leap.x;
            const targetY = y + leap.y;

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
