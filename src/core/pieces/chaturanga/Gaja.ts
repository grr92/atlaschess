import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Gaja extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Gaja');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the gaja leaps exactly two squares diagonally (4 directions)
        const leaps = [
            { x: 2, y: 2 }, { x: 2, y: -2 }, { x: -2, y: 2 }, { x: -2, y: -2 }
        ];

        const { x, y } = this.position;

        for (const leap of leaps) {
            const targetX = x + leap.x;
            const targetY = y + leap.y;

            // verify that the destination is within board limits
            if (!board.isOutOfBounds(targetX, targetY)) {
                const targetPiece = board.getPieceAt(targetX, targetY);

                // if empty or occupied by an enemy, the move is valid
                if (targetPiece === null || targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: targetY });
                }
            }
        }

        return moves;
    }
}