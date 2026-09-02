import { Piece } from '../Piece';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class AdventitiousShah extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'AdventitiousShah');
    }

    getPossibleMoves(board: Board, _lastMove?: Move): Position[] {
        const moves: Position[] = [];
        const directions = [
            { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        for (const dir of directions) {
            const targetX = this.position.x + dir.x;
            const targetY = this.position.y + dir.y;

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
