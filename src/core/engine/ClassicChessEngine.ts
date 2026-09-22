import { BaseEngine } from './BaseEngine';
import type { Position } from '../../types';
import { Piece, Queen, Rook, Bishop, Knight } from '../pieces/piecesIndex';
import type { GameVariant } from '../variants/GameVariant';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';

export class ClassicChessEngine extends BaseEngine {
    private halfMoveClock: number = 0;
    private positionHistory: Map<string, number> = new Map();

    constructor(variant: GameVariant) {
        super(variant, new SingleRoyalCheckStrategy('King'));
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
                this.board.setPiece(newPiece, to.x, to.y);
            }
        }
    }

    protected postTurnHook(): void {
        this.updatePositionHistory();
    }

    /**
     * Generates a valid standard FEN string for the current board position,
     * including piece placement, active color, castling rights, en passant target square,
     * halfmove clock, and fullmove number.
     */
    public getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < 8; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < 8; x++) {
                const p = this.board.getPieceAt(x, y);
                if (!p) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }
                    let char = 'p';
                    switch (p.name) {
                        case 'King': char = 'k'; break;
                        case 'Queen': char = 'q'; break;
                        case 'Rook': char = 'r'; break;
                        case 'Bishop': char = 'b'; break;
                        case 'Knight': char = 'n'; break;
                        case 'Pawn': char = 'p'; break;
                    }
                    rowStr += p.color === 'white' ? char.toUpperCase() : char.toLowerCase();
                }
            }
            if (emptyCount > 0) rowStr += emptyCount;
            rows.push(rowStr);
        }

        const placement = rows.join('/');
        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';

        // Castling rights (King and Rooks must not have moved and be on their original squares)
        let castling = '';
        const wk = this.board.getPieceAt(4, 7);
        if (wk && wk.name === 'King' && !wk.hasMoved) {
            const h1Rook = this.board.getPieceAt(7, 7);
            if (h1Rook && h1Rook.name === 'Rook' && !h1Rook.hasMoved) castling += 'K';
            const a1Rook = this.board.getPieceAt(0, 7);
            if (a1Rook && a1Rook.name === 'Rook' && !a1Rook.hasMoved) castling += 'Q';
        }
        const bk = this.board.getPieceAt(4, 0);
        if (bk && bk.name === 'King' && !bk.hasMoved) {
            const h8Rook = this.board.getPieceAt(7, 0);
            if (h8Rook && h8Rook.name === 'Rook' && !h8Rook.hasMoved) castling += 'k';
            const a8Rook = this.board.getPieceAt(0, 0);
            if (a8Rook && a8Rook.name === 'Rook' && !a8Rook.hasMoved) castling += 'q';
        }
        if (!castling) castling = '-';

        // En passant target square
        let ep = '-';
        if (this.history.length > 0) {
            const lastMove = this.history[this.history.length - 1];
            if (lastMove?.piece?.name === 'Pawn' && Math.abs(lastMove.from.y - lastMove.to.y) === 2) {
                const epY = (lastMove.from.y + lastMove.to.y) / 2;
                const file = String.fromCharCode(97 + lastMove.to.x);
                ep = `${file}${8 - epY}`;
            }
        }

        const halfmove = this.halfMoveClock || 0;
        const fullmove = Math.floor(this.history.length / 2) + 1;

        return `${placement} ${activeColor} ${castling} ${ep} ${halfmove} ${fullmove}`;
    }
}