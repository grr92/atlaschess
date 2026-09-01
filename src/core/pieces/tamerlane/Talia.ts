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
            // Empezamos en distancia 2 para obligar a que el salto sea largo
            for (let i = 2; i < Math.max(board.cols, board.rows); i++) {
                const targetX = this.position.x + (dir.x * i);
                const targetY = this.position.y + (dir.y * i);

                if (board.isOutOfBounds(targetX, targetY)) break;

                // Regla del salto: ¿puede saltar sobre la casilla 1? En Tamerlán sí se podía, pero lo trataremos como un deslizador que "empieza" en el cuadro 2.
                const p = board.getPieceAt(targetX, targetY);
                if (!p) {
                    moves.push({ x: targetX, y: targetY });
                } else {
                    if (p.color !== this.color) moves.push({ x: targetX, y: targetY });
                    break; // Se bloquea si choca con algo a partir del cuadro 2
                }
            }
        }
        return moves;
    }
}