import { Piece } from "../Piece.ts";
import type { PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class Rook extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Rook');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the 4 possible directions: up, down, left, right
        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        for (const dir of directions) {
            let currentX = this.position.x + dir.x;
            let currentY = this.position.y + dir.y;

            // advance in that direction until going out of bounds or hitting a piece
            while (!board.isOutOfBounds(currentX, currentY)) {
                const targetPiece = board.getPieceAt(currentX, currentY);

                if (targetPiece === null) {
                    // empty square, valid move and keep searching
                    moves.push({ x: currentX, y: currentY });
                } else {
                    // collision with a piece
                    if (targetPiece.color !== this.color) {
                        // enemy piece: can capture, but the path ends here
                        moves.push({ x: currentX, y: currentY });
                    }
                    // whether ally or enemy, cannot jump over
                    break;
                }

                currentX += dir.x;
                currentY += dir.y;
            }
        }

        return moves;
    }
}