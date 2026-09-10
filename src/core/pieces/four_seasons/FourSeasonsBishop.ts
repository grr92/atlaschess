import { Piece } from '../Piece.ts';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

/**
 * Historical Bishop (Alfil / Pil) in Four Seasons Chess.
 * Leaps exactly two squares diagonally, jumping over any intervening piece.
 */
export class FourSeasonsBishop extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'FourSeasonsBishop');
    }

    getPossibleMoves(board: Board, _lastMove?: Move, isFriendly?: (c1: PieceColor, c2: PieceColor) => boolean): Position[] {
        const moves: Position[] = [];
        const isSameTeam = isFriendly || ((c1: PieceColor, c2: PieceColor) => c1 === c2);
        const offsets = [
            { x: 2, y: 2 },
            { x: 2, y: -2 },
            { x: -2, y: 2 },
            { x: -2, y: -2 }
        ];

        for (const offset of offsets) {
            const newPos: Position = {
                x: this.position.x + offset.x,
                y: this.position.y + offset.y
            };

            if (!board.isOutOfBounds(newPos.x, newPos.y)) {
                const targetPiece = board.getPieceAt(newPos.x, newPos.y);
                if (!targetPiece || !isSameTeam(this.color, targetPiece.color)) {
                    moves.push(newPos);
                }
            }
        }

        return moves;
    }
}
