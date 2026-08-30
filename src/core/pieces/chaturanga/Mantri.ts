import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Mantri extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Mantri');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the mantri only moves one square diagonally (4 directions)
        const directions = [
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        const { x, y } = this.position;

        for (const dir of directions) {
            const targetX = x + dir.x;
            const targetY = y + dir.y;

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