import { Piece } from '../Piece.ts';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class FourSeasonsRook extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'FourSeasonsRook');
    }

    getPossibleMoves(board: Board, _lastMove?: Move, isFriendly?: (c1: PieceColor, c2: PieceColor) => boolean): Position[] {
        const moves: Position[] = [];
        const isSameTeam = isFriendly || ((c1: PieceColor, c2: PieceColor) => c1 === c2);
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        for (const dir of directions) {
            let currentX = this.position.x + dir.x;
            let currentY = this.position.y + dir.y;

            while (!board.isOutOfBounds(currentX, currentY)) {
                const targetPiece = board.getPieceAt(currentX, currentY);

                if (!targetPiece) {
                    moves.push({ x: currentX, y: currentY });
                } else {
                    if (!isSameTeam(this.color, targetPiece.color)) {
                        moves.push({ x: currentX, y: currentY });
                    }
                    break;
                }

                currentX += dir.x;
                currentY += dir.y;
            }
        }

        return moves;
    }
}
