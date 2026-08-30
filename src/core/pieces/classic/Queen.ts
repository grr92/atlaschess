import { Piece } from "../Piece.ts";
import type { PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class Queen extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Queen');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the 8 possible directions (straight and diagonal)
        const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, // rook type moves
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }  // bishop type moves
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
                    break;
                }

                currentX += dir.x;
                currentY += dir.y;
            }
        }

        return moves;
    }
}