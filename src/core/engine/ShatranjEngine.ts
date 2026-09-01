import { BaseEngine } from './BaseEngine';
import type { Position, PieceColor } from '../../types';
import { Piece } from '../pieces/Piece.ts';
import { Ferz } from '../pieces/piecesIndex.ts';
import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';

export class ShatranjEngine extends BaseEngine {

    constructor(variant: GameVariant) {
        super(variant);
    }

    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        let kingPos: Position | null = null;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'Shah' && p.color === color) {
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

    getLegalMoves(piece: Piece): Position[] {
        const pseudoMoves = piece.getPossibleMoves(this.board);
        const legalMoves: Position[] = [];

        for (const move of pseudoMoves) {
            const targetPiece = this.board.getPieceAt(move.x, move.y);
            const originalPos = { x: piece.position.x, y: piece.position.y };

            this.board.grid[originalPos.y][originalPos.x] = null;
            this.board.grid[move.y][move.x] = piece;
            piece.position = { x: move.x, y: move.y };

            const inCheck = this.isKingInCheck(piece.color, this.board);

            this.board.grid[originalPos.y][originalPos.x] = piece;
            piece.position = originalPos;
            this.board.grid[move.y][move.x] = targetPiece;

            if (!inCheck) {
                legalMoves.push(move);
            }
        }
        return legalMoves;
    }

    updateGameState() {
        let whitePiecesCount = 0;
        let blackPiecesCount = 0;

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p) {
                    if (p.color === 'white') whitePiecesCount++;
                    else blackPiecesCount++;
                }
            }
        }

        // Bare King rule
        if (this.currentTurn === 'white' && whitePiecesCount === 1) {
            this.state = 'checkmate';
            return;
        }
        if (this.currentTurn === 'black' && blackPiecesCount === 1) {
            this.state = 'checkmate';
            return;
        }

        let hasAnyLegalMove = false;
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === this.currentTurn) {
                    if (this.getLegalMoves(p).length > 0) {
                        hasAnyLegalMove = true;
                        break;
                    }
                }
            }
            if (hasAnyLegalMove) break;
        }

        const inCheck = this.isKingInCheck(this.currentTurn);

        if (!hasAnyLegalMove) {
            // Stalemate is a win for the player delivering it.
            this.state = 'checkmate';
        } else {
            this.state = inCheck ? 'check' : 'playing';
        }
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position, _capturedPiece: Piece | null): void {
        // Pawns automatically promote to Fers when reaching the last rank.
        if (piece.name === 'Sarbaz') {
            const promotionRank = piece.color === 'white' ? 0 : this.board.rows - 1;
            if (to.y === promotionRank) {
                const newFers = new Ferz(`${piece.id}_promoted`, piece.color, { x: to.x, y: to.y });
                this.board.setPiece(newFers, to.x, to.y);
            }
        }
    }
}