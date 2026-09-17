import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class Bia extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Bia');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const forwardY = this.color === 'white' ? -1 : 1;
        const { x, y } = this.position;

        // 1. One space forward (non-capturing)
        const forwardPos = { x, y: y + forwardY };
        if (!board.isOutOfBounds(forwardPos.x, forwardPos.y)) {
            if (board.getPieceAt(forwardPos.x, forwardPos.y) === null) {
                moves.push(forwardPos);
            }
        }

        // 2. Diagonally forward captures
        const captureOffsets = [-1, 1];
        for (const dx of captureOffsets) {
            const capX = x + dx;
            const capY = y + forwardY;

            if (!board.isOutOfBounds(capX, capY)) {
                const targetPiece = board.getPieceAt(capX, capY);
                if (targetPiece !== null && targetPiece.color !== this.color) {
                    moves.push({ x: capX, y: capY });
                }
            }
        }

        return moves;
    }
}
