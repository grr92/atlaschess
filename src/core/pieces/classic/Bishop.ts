import { Piece } from "../Piece.ts";
import type { PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class Bishop extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Bishop');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the 4 diagonal directions
        const directions = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];

        for (const dir of directions) {
            let currentX = this.position.x + dir.x;
            let currentY = this.position.y + dir.y;

            while (!board.isOutOfBounds(currentX, currentY)) {
                const targetPiece = board.getPieceAt(currentX, currentY);

                if (targetPiece === null) {
                    moves.push({ x: currentX, y: currentY });
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({ x: currentX, y: currentY });
                    }
                    break; // collision detected, stop the ray in this direction
                }

                currentX += dir.x;
                currentY += dir.y;
            }
        }

        return moves;
    }
}