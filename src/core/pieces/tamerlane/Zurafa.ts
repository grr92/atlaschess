import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Zurafa extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Zurafa');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const diagDirs = [
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        for (const diag of diagDirs) {
            const diagX = this.position.x + diag.x;
            const diagY = this.position.y + diag.y;

            // diagonal step at distance 1 must be empty
            if (board.isOutOfBounds(diagX, diagY) || board.getPieceAt(diagX, diagY) !== null) {
                continue;
            }

            // slides in the two orthogonal rays matching the diagonal direction
            const orthoDirs = [
                { x: diag.x, y: 0 },
                { x: 0, y: diag.y }
            ];

            for (const ortho of orthoDirs) {
                // intermediate orthogonal steps 1 and 2 must be empty
                let blocked = false;
                for (let step = 1; step < 3; step++) {
                    const stepX = diagX + ortho.x * step;
                    const stepY = diagY + ortho.y * step;
                    if (board.isOutOfBounds(stepX, stepY) || board.getPieceAt(stepX, stepY) !== null) {
                        blocked = true;
                        break;
                    }
                }
                if (blocked) continue;

                // minimum 3 orthogonal steps to land or slide further
                for (let step = 3; step < Math.max(board.cols, board.rows); step++) {
                    const targetX = diagX + ortho.x * step;
                    const targetY = diagY + ortho.y * step;

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
        }
        return moves;
    }
}