import { BaseEngine } from './BaseEngine';
import type {Position, PieceColor} from '../../types';
import { Piece, Queen, Rook, Bishop, Knight } from '../pieces/piecesIndex.ts';
import { Board } from '../models/Board';
import type {GameVariant} from '../variants/GameVariant';

export class ClassicChessEngine extends BaseEngine {
    private halfMoveClock: number = 0;
    private positionHistory: Map<string, number> = new Map();

    constructor(variant: GameVariant) {
        super(variant);
        this.updatePositionHistory();
    }

    private getBoardSignature(): string {
        return this.board.grid.map(row =>
            row.map(p => p ? `${p.color[0]}${p.name[0]}` : '..').join('')
        ).join('');
    }

    private updatePositionHistory() {
        const sig = this.getBoardSignature();
        this.positionHistory.set(sig, (this.positionHistory.get(sig) || 0) + 1);
    }

    // 1. find the king of the corresponding color
    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        let kingPos: Position | null = null;
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'King' && p.color === color) {
                    kingPos = { x, y };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        // 2. check if any enemy piece attacks the king's position
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
        const lastMove = this.history.length > 0 ? this.history[this.history.length - 1] : undefined;
        const pseudoMoves = piece.getPossibleMoves(this.board, lastMove);
        const legalMoves: Position[] = [];

        // filter out moves that would leave the own king in check
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
        const isFiftyMoveRule = this.halfMoveClock >= 100;
        const isTripleRepetition = (this.positionHistory.get(this.getBoardSignature()) || 0) >= 3;

        // Changes the state depending on if its drawn or checkmate by any rule
        if (!hasAnyLegalMove) {
            this.state = inCheck ? 'checkmate' : 'draw';
        } else if (isFiftyMoveRule || isTripleRepetition) {
            this.state = 'draw';
        } else {
            this.state = inCheck ? 'check' : 'playing';
        }
    }


    // template method hooks

    protected beforeMoveHook(piece: Piece, from: Position, to: Position, capturedPiece: Piece | null): Piece | null {
        let actualCaptured = capturedPiece;

        // en passant
        if (piece.name === 'Pawn' && from.x !== to.x && capturedPiece === null) {
            actualCaptured = this.board.getPieceAt(to.x, from.y);
            this.board.removePieceAt(to.x, from.y);
        }

        // castling
        if (piece.name === 'King' && Math.abs(from.x - to.x) === 2) {
            if (to.x > from.x) {
                const rook = this.board.getPieceAt(7, from.y);
                if (rook) {
                    this.board.movePiece({ x: 7, y: from.y }, { x: 5, y: from.y });
                    rook.hasMoved = true;
                }
            } else {
                const rook = this.board.getPieceAt(0, from.y);
                if (rook) {
                    this.board.movePiece({ x: 0, y: from.y }, { x: 3, y: from.y });
                    rook.hasMoved = true;
                }
            }
        }
        return actualCaptured;
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position, capturedPiece: Piece | null, promotionPiece?: string): void {
        // 50-move rule clock
        if (piece.name === 'Pawn' || capturedPiece !== null) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }

        // promotion
        if (piece.name === 'Pawn') {
            const isWhiteAtEdge = piece.color === 'white' && to.y === 0;
            const isBlackAtEdge = piece.color === 'black' && to.y === 7;

            if (isWhiteAtEdge || isBlackAtEdge) {
                let newPiece: Piece;

                switch(promotionPiece) {
                    case 'Rook': newPiece = new Rook(piece.id, piece.color, to); break;
                    case 'Bishop': newPiece = new Bishop(piece.id, piece.color, to); break;
                    case 'Knight': newPiece = new Knight(piece.id, piece.color, to); break;
                    default: newPiece = new Queen(piece.id, piece.color, to); break;
                }

                newPiece.hasMoved = true;
                this.board.grid[to.y][to.x] = newPiece;
            }
        }
    }

    protected postTurnHook(): void {
        this.updatePositionHistory();
    }
}