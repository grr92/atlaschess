import { Piece } from "../Piece.ts";
import type { PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class Knight extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Knight');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        // the 8 possible "L" shaped jumps (2 squares on one axis, 1 on the other)
        const knightOffsets = [
            { x: 2, y: 1 }, { x: 2, y: -1 },
            { x: -2, y: 1 }, { x: -2, y: -1 },
            { x: 1, y: 2 }, { x: 1, y: -2 },
            { x: -1, y: 2 }, { x: -1, y: -2 }
        ];

        const { x, y } = this.position;

        for (const offset of knightOffsets) {
            const targetX = x + offset.x;
            const targetY = y + offset.y;

            // verify that the jump lands within the board limits
            if (!board.isOutOfBounds(targetX, targetY)) {
                const targetPiece = board.getPieceAt(targetX, targetY);

                // if the square is empty or has an enemy, it can land there
                if (targetPiece === null || targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: targetY });
                }
            }
        }

        return moves;
    }
}