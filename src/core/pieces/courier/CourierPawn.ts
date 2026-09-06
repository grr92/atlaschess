import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class CourierPawn extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'CourierPawn');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const direction = this.color === 'white' ? -1 : 1;
        const { x, y } = this.position;

        // 1. Single step forward
        const forwardY = y + direction;
        if (!board.isOutOfBounds(x, forwardY) && board.getPieceAt(x, forwardY) === null) {
            moves.push({ x, y: forwardY });
        }

        // 2. Diagonal captures
        const captureColumns = [x - 1, x + 1];
        for (const targetX of captureColumns) {
            if (!board.isOutOfBounds(targetX, forwardY)) {
                const targetPiece = board.getPieceAt(targetX, forwardY);
                if (targetPiece !== null && targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: forwardY });
                }
            }
        }

        return moves;
    }
}
