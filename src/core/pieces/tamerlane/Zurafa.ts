import { Piece } from "../Piece.ts";
import type { PieceColor, Position } from "../../../types";
import { Board } from "../../models/Board.ts";

export class Zurafa extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Zurafa');
    }
    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        // Las direcciones finales combinan 1 en un eje y >=4 en el otro
        const rayDirs = [
            { dx: 1, dy: 0, ox: 0, oy: 1 }, { dx: 1, dy: 0, ox: 0, oy: -1 },
            { dx: -1, dy: 0, ox: 0, oy: 1 }, { dx: -1, dy: 0, ox: 0, oy: -1 },
            { dx: 0, dy: 1, ox: 1, oy: 0 }, { dx: 0, dy: 1, ox: -1, oy: 0 },
            { dx: 0, dy: -1, ox: 1, oy: 0 }, { dx: 0, dy: -1, ox: -1, oy: 0 }
        ];

        for (const ray of rayDirs) {
            // Empieza deslizando desde la casilla 4
            for (let i = 4; i < Math.max(board.cols, board.rows); i++) {
                const targetX = this.position.x + ray.ox + (ray.dx * i);
                const targetY = this.position.y + ray.oy + (ray.dy * i);

                if (board.isOutOfBounds(targetX, targetY)) break;

                const p = board.getPieceAt(targetX, targetY);
                if (!p) {
                    moves.push({ x: targetX, y: targetY });
                } else {
                    if (p.color !== this.color) moves.push({ x: targetX, y: targetY });
                    break;
                }
            }
        }
        return moves;
    }
}