import { Piece } from '../Piece.ts';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board.ts';

export class FourSeasonsKing extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'FourSeasonsKing');
    }

    getPossibleMoves(board: Board, _lastMove?: Move, isFriendly?: (c1: PieceColor, c2: PieceColor) => boolean): Position[] {
        const moves: Position[] = [];
        const isSameTeam = isFriendly || ((c1: PieceColor, c2: PieceColor) => c1 === c2);
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];

        for (const dir of directions) {
            const newPos: Position = {
                x: this.position.x + dir.x,
                y: this.position.y + dir.y
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
