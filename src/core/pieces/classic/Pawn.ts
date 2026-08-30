import { Piece } from "../Piece.ts";
import type {Move, PieceColor, Position} from "../../../types";
import { Board } from "../../models/Board.ts";

export class Pawn extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'Pawn');
    }

    getPossibleMoves(board: Board, lastMove?: Move): Position[] {
        const moves: Position[] = [];
        const direction = this.color === 'white' ? -1 : 1;
        const {x, y} = this.position;

        // 1. single step forward
        const forwardY = y + direction;
        if (!board.isOutOfBounds(x, forwardY) && board.getPieceAt(x, forwardY) === null) {
            moves.push({x, y: forwardY});

            // 2. initial double step
            const doubleForwardY = y + (direction * 2);
            if (!this.hasMoved && !board.isOutOfBounds(x, doubleForwardY) && board.getPieceAt(x, doubleForwardY) === null) {
                moves.push({x, y: doubleForwardY});
            }
        }

        // 3. normal diagonal captures
        const captureColumns = [x - 1, x + 1];
        for (const targetX of captureColumns) {
            if (!board.isOutOfBounds(targetX, forwardY)) {
                const targetPiece = board.getPieceAt(targetX, forwardY);
                if (targetPiece !== null && targetPiece.color !== this.color) {
                    moves.push({x: targetX, y: forwardY});
                }
            }
        }

        // 4. en passant capture
        if (lastMove && lastMove.piece.name === 'Pawn') {
            // verify if the enemy pawn moved two squares
            const isDoubleStep = Math.abs(lastMove.from.y - lastMove.to.y) === 2;
            // verify if it landed exactly next to our pawn (same y row, x column +/- 1)
            const isAdjacent = lastMove.to.y === y && Math.abs(lastMove.to.x - x) === 1;

            if (isDoubleStep && isAdjacent) {
                // add the diagonal square behind the enemy pawn as a valid move
                moves.push({x: lastMove.to.x, y: forwardY});
            }
        }

        return moves;
    }
}