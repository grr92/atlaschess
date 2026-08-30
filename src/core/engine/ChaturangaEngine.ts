import { BaseEngine } from './BaseEngine';
import type {Position, PieceColor} from '../../types';
import { Piece } from '../pieces/Piece.ts';
import { Board } from '../models/Board';
import type {GameVariant} from '../variants/GameVariant';

export class ChaturangaEngine extends BaseEngine {

    constructor(variant: GameVariant) {
        super(variant);
    }

    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        let kingPos: Position | null = null;

        // 1. find the raja of the corresponding color
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'Raja' && p.color === color) {
                    kingPos = { x, y };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        // 2. check if any enemy piece attacks the raja's position
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

        // filter out moves that would leave the own raja in check
        for (const move of pseudoMoves) {
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
        // 1. bare king rule
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

        // if it is white's turn and they only have the raja left, they lose.
        if (this.currentTurn === 'white' && whitePiecesCount === 1) {
            this.state = 'checkmate';
            return;
        }
        // same for black
        if (this.currentTurn === 'black' && blackPiecesCount === 1) {
            this.state = 'checkmate';
            return;
        }

        // 2. standard move and check verification
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

    // template method hooks

    protected beforeMoveHook(_piece: Piece, _from: Position, _to: Position, capturedPiece: Piece | null): Piece | null {
        // in chaturanga there is no castling or en passant. return the normally captured piece.
        return capturedPiece;
    }

    protected afterMoveHook(_piece: Piece, _from: Position, _to: Position, _capturedPiece: Piece | null): void {
        // there is no 50-move rule and pawn promotions are blocked
    }

    protected postTurnHook(): void {
        // board hashes are not saved because the threefold repetition rule does not exist
    }
}