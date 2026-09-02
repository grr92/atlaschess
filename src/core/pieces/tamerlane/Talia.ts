import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Talia extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Talia');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const dirs = [ { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 } ];

        for (const dir of dirs) {
            // square at distance 1 must be empty because talia slides without leaping
            const step1X = this.position.x + dir.x;
            const step1Y = this.position.y + dir.y;

            if (board.isOutOfBounds(step1X, step1Y) || board.getPieceAt(step1X, step1Y) !== null) {
                continue;
            }

            // from distance 2 onwards it slides like a bishop
            for (let i = 2; i < Math.max(board.cols, board.rows); i++) {
                const targetX = this.position.x + (dir.x * i);
                const targetY = this.position.y + (dir.y * i);

                if (board.isOutOfBounds(targetX, targetY)) break;

                const p = board.getPieceAt(targetX, targetY);
                if (!p) {
                    moves.push({ x: targetX, y: targetY });
                } else {
                    if (p.color !== this.color) {
                        moves.push({ x: targetX, y: targetY });
                    }
                    break; // blocked by piece
                }
            }
        }
        return moves;
    }
}