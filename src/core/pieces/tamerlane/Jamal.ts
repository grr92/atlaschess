import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Jamal extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Jamal');
    }
    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const leaps = [
            { x: 1, y: 3 }, { x: 1, y: -3 }, { x: -1, y: 3 }, { x: -1, y: -3 },
            { x: 3, y: 1 }, { x: 3, y: -1 }, { x: -3, y: 1 }, { x: -3, y: -1 }
        ];
        for (const leap of leaps) {
            const targetX = this.position.x + leap.x;
            const targetY = this.position.y + leap.y;
            if (!board.isOutOfBounds(targetX, targetY)) {
                const p = board.getPieceAt(targetX, targetY);
                if (!p || p.color !== this.color) moves.push({ x: targetX, y: targetY });
            }
        }
        return moves;
    }
}