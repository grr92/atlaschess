import { Piece } from "../Piece.ts";
import type {PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class King extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'King');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];

        const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        const { x, y } = this.position;

        // 1. normal king moves (one step)
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

        // 2. castling logic
        if (!this.hasMoved) {
            // kingside castling (to the right)
            const rightRook = board.getPieceAt(7, y);
            if (rightRook && rightRook.name === 'Rook' && !rightRook.hasMoved) {
                // verify that squares between the king (x=4) and rook (x=7) are empty
                if (board.getPieceAt(5, y) === null && board.getPieceAt(6, y) === null) {
                    moves.push({ x: x + 2, y });
                }
            }

            // queenside castling (to the left)
            const leftRook = board.getPieceAt(0, y);
            if (leftRook && leftRook.name === 'Rook' && !leftRook.hasMoved) {
                // verify that squares between the king (x=4) and rook (x=0) are empty
                if (board.getPieceAt(1, y) === null && board.getPieceAt(2, y) === null && board.getPieceAt(3, y) === null) {
                    moves.push({ x: x - 2, y });
                }
            }
        }

        return moves;
    }
}