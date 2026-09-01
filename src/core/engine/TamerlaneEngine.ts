import { BaseEngine } from './BaseEngine';
import type { Position, PieceColor } from '../../types';
import { Piece } from '../pieces/Piece.ts';
import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';

export class TamerlaneEngine extends BaseEngine {

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
            // Citadel squares can be moved to
            const isBlackCitadel = move.x === 0 && move.y === 1;
            const isWhiteCitadel = move.x === 12 && move.y === 8;

            if (isWhiteCitadel || isBlackCitadel) {
                // Only the Shah (King) can enter the citadel
                if (piece.name !== 'Shah') continue;
                // And cannot enter it's own citadel
                if (piece.color === 'white' && isWhiteCitadel) continue;
                if (piece.color === 'black' && isBlackCitadel) continue;
            }

            const targetPiece = this.board.getPieceAt(move.x, move.y);
            const originalPos = { x: piece.position.x, y: piece.position.y };

            // simulate the move
            this.board.grid[originalPos.y][originalPos.x] = null;
            this.board.grid[move.y][move.x] = piece;
            piece.position = { x: move.x, y: move.y };

            const inCheck = this.isKingInCheck(piece.color, this.board);

            // undo the simulation
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
        // Win by citadel verification
        // White player
        const whiteShah = this.board.getPieceAt(0, 1);
        if (whiteShah && whiteShah.name === 'Shah' && whiteShah.color === 'white') {
            this.state = 'draw';
            return;
        }

        // Black player
        const blackShah = this.board.getPieceAt(12, 8);
        if (blackShah && blackShah.name === 'Shah' && blackShah.color === 'black') {
            this.state = 'draw';
            return;
        }

        // Checkmate and stalemate
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
            this.state = inCheck ? 'checkmate' : 'draw';
        } else {
            this.state = inCheck ? 'check' : 'playing';
        }
    }
}