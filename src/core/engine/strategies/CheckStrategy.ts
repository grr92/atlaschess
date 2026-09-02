import type { Position, PieceColor } from '../../../types';
import { Piece } from '../../pieces/Piece';
import { Board } from '../../models/Board';

export interface ICheckStrategy {
    isKingInCheck(color: PieceColor, board: Board): boolean;
    filterLegalMoves(piece: Piece, board: Board, pseudoMoves: Position[]): Position[];
}

export class SingleRoyalCheckStrategy implements ICheckStrategy {
    private royalPieceName: string;

    constructor(royalPieceName: string) {
        this.royalPieceName = royalPieceName;
    }

    isKingInCheck(color: PieceColor, board: Board): boolean {
        let kingPos: Position | null = null;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === this.royalPieceName && p.color === color) {
                    kingPos = { x, y };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.color !== color) {
                    const attacks = p.getPossibleMoves(board);
                    if (attacks.some(m => m.x === kingPos!.x && m.y === kingPos!.y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    filterLegalMoves(piece: Piece, board: Board, pseudoMoves: Position[]): Position[] {
        const legalMoves: Position[] = [];

        for (const move of pseudoMoves) {
            const targetPiece = board.getPieceAt(move.x, move.y);
            const originalPos = { x: piece.position.x, y: piece.position.y };

            // simulate the move
            board.grid[originalPos.y][originalPos.x] = null;
            board.grid[move.y][move.x] = piece;
            piece.position = { x: move.x, y: move.y };

            const inCheck = this.isKingInCheck(piece.color, board);

            // undo the simulation
            board.grid[originalPos.y][originalPos.x] = piece;
            piece.position = originalPos;
            board.grid[move.y][move.x] = targetPiece;

            if (!inCheck) {
                legalMoves.push(move);
            }
        }
        return legalMoves;
    }
}
