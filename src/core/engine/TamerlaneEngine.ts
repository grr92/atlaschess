import { BaseEngine, type PreMoveInterception, type PostMoveInterception } from './BaseEngine';
import type { Position, PieceColor, Move } from '../../types';
import { Piece } from '../pieces/Piece.ts';
import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import {
    Dabbaba,
    Jamal,
    Pil,
    Zurafa,
    Wazir,
    Ferz,
    Talia,
    Asb,
    Rukh,
    Shahzada,
    AdventitiousShah,
    Shah,
    TamerlanePawn
} from '../pieces/piecesIndex';

export class TamerlaneEngine extends BaseEngine {
    whiteCitadelExchangeUsed: boolean = false;
    blackCitadelExchangeUsed: boolean = false;

    constructor(variant: GameVariant) {
        super(variant);
    }

    override getPreMoveInterception(from: Position, to: Position): PreMoveInterception | null {
        const piece = this.board.getPieceAt(from.x, from.y);
        const isTamerlaneShah = piece?.name === 'Shah';
        const isOpponentCitadel = (piece?.color === 'white' && to.x === 0 && to.y === 1) ||
                                  (piece?.color === 'black' && to.x === 12 && to.y === 8);

        if (isTamerlaneShah && isOpponentCitadel) {
            const exchangeUsed = piece?.color === 'white' ? this.whiteCitadelExchangeUsed : this.blackCitadelExchangeUsed;
            const lowerRoyals = this.getRoyalPieces(piece?.color).filter(p => {
                if (p.name !== 'Shahzada' && p.name !== 'AdventitiousShah') return false;

                const isOwnCitadel = (piece?.color === 'white' && p.position.x === 12 && p.position.y === 8) ||
                                     (piece?.color === 'black' && p.position.x === 0 && p.position.y === 1);
                if (p.name === 'AdventitiousShah' && isOwnCitadel) return false;

                return true;
            });

            if (!exchangeUsed && lowerRoyals.length > 0) {
                return {
                    type: 'CITADEL_CHOICE',
                    from,
                    to,
                    royals: lowerRoyals.map(r => ({ id: r.id, name: r.name }))
                };
            }
        }
        return null;
    }

    override getPostMoveInterception(lastMove: Move): PostMoveInterception | null {
        if (!lastMove || !lastMove.piece) return null;

        const defenderColor = lastMove.piece.color === 'white' ? 'black' : 'white';
        const defenderRoyals = this.getRoyalPieces(defenderColor);
        const hasShah = defenderRoyals.some(p => p.name === 'Shah');

        if (!hasShah && defenderRoyals.length > 1) {
            return {
                type: 'SUCCESSION_CHOICE',
                color: defenderColor,
                royals: defenderRoyals.map(r => ({ id: r.id, name: r.name }))
            };
        }
        return null;
    }

    // returns all royal pieces of a given color currently on the board
    getRoyalPieces(color: PieceColor, board: Board = this.board): Piece[] {
        const royals: Piece[] = [];
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && (p.name === 'Shah' || p.name === 'Shahzada' || p.name === 'AdventitiousShah') && p.color === color) {
                    royals.push(p);
                }
            }
        }
        return royals;
    }

    // determines the highest-ranking royal piece on the board
    getHighestRankingRoyal(color: PieceColor, board: Board = this.board): Piece | null {
        const royals = this.getRoyalPieces(color, board);
        if (royals.some(p => p.name === 'Shah')) {
            return royals.find(p => p.name === 'Shah') || null;
        }
        if (royals.some(p => p.name === 'Shahzada')) {
            return royals.find(p => p.name === 'Shahzada') || null;
        }
        if (royals.some(p => p.name === 'AdventitiousShah')) {
            return royals.find(p => p.name === 'AdventitiousShah') || null;
        }
        return null;
    }

    // helper to check if a specific position is attacked by any enemy piece
    isSquareAttacked(pos: Position, color: PieceColor, board: Board = this.board): boolean {
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.color !== color) {
                    if (p instanceof TamerlanePawn && p.isRestingOnLastRank) continue;
                    const attacks = p.getPossibleMoves(board);
                    if (attacks.some(m => m.x === pos.x && m.y === pos.y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        const royalPieces = this.getRoyalPieces(color, board);

        // multiple royals act like normal pieces without check restrictions
        if (royalPieces.length !== 1) return false;

        const soleKing = royalPieces[0];

        // adventitious king is completely immune when inside its own citadel
        const isOwnCitadel = (soleKing.color === 'white' && soleKing.position.x === 12 && soleKing.position.y === 8) ||
                             (soleKing.color === 'black' && soleKing.position.x === 0 && soleKing.position.y === 1);
        if (soleKing.name === 'AdventitiousShah' && isOwnCitadel) {
            return false;
        }

        return this.isSquareAttacked(soleKing.position, color, board);
    }

    getLegalMoves(piece: Piece): Position[] {
        const pseudoMoves = piece.getPossibleMoves(this.board);
        const legalMoves: Position[] = [];

        // royal piece swap evasion moves strictly for the Shah when under attack or check
        if (piece.name === 'Shah' && !(piece as Shah).hasSwappedPiece) {
            const isUnderThreat = this.isKingInCheck(piece.color) || this.isSquareAttacked(piece.position, piece.color);
            if (isUnderThreat) {
                for (let y = 0; y < this.board.rows; y++) {
                    for (let x = 0; x < this.board.cols; x++) {
                        const ally = this.board.getPieceAt(x, y);
                        if (ally && ally.color === piece.color && ally !== piece) {
                            pseudoMoves.push({ x, y });
                        }
                    }
                }
            }
        }

        const highestRoyal = this.getHighestRankingRoyal(piece.color);

        for (const move of pseudoMoves) {
            const isBlackCitadel = move.x === 0 && move.y === 1;
            const isWhiteCitadel = move.x === 12 && move.y === 8;
            const isOwnCitadel = (piece.color === 'white' && isWhiteCitadel) || (piece.color === 'black' && isBlackCitadel);
            const isOpponentCitadel = (piece.color === 'white' && isBlackCitadel) || (piece.color === 'black' && isWhiteCitadel);

            // only adventitious king can enter own citadel
            if (isOwnCitadel) {
                if (piece.name !== 'AdventitiousShah') continue;
            }

            // only the highest-ranking royal on the board can enter opponent citadel
            if (isOpponentCitadel) {
                if (!highestRoyal || highestRoyal !== piece) continue;
            }

            const targetPiece = this.board.getPieceAt(move.x, move.y);

            // check if target is immune
            if (targetPiece) {
                const targetIsAdventitiousInOwnCitadel = targetPiece.name === 'AdventitiousShah' &&
                    ((targetPiece.color === 'white' && move.x === 12 && move.y === 8) ||
                     (targetPiece.color === 'black' && move.x === 0 && move.y === 1));

                const targetIsRestingPawn = targetPiece instanceof TamerlanePawn &&
                    targetPiece.pawnType === 'pawn_of_pawns' && targetPiece.isRestingOnLastRank;

                if (targetIsAdventitiousInOwnCitadel) continue;
                if (targetIsRestingPawn && !(piece instanceof TamerlanePawn && piece.isRestingOnLastRank)) continue;
            }

            const originalPos = { x: piece.position.x, y: piece.position.y };
            const isAllySwap = piece.name === 'Shah' && targetPiece && targetPiece.color === piece.color;

            // simulate move or swap
            if (isAllySwap) {
                this.board.grid[originalPos.y][originalPos.x] = targetPiece;
                this.board.grid[move.y][move.x] = piece;
                piece.position = { x: move.x, y: move.y };
                targetPiece.position = originalPos;
            } else {
                this.board.grid[originalPos.y][originalPos.x] = null;
                this.board.grid[move.y][move.x] = piece;
                piece.position = { x: move.x, y: move.y };
            }

            const inCheck = this.isKingInCheck(piece.color, this.board);

            // undo simulation
            if (isAllySwap) {
                this.board.grid[originalPos.y][originalPos.x] = piece;
                this.board.grid[move.y][move.x] = targetPiece;
                piece.position = originalPos;
                targetPiece.position = { x: move.x, y: move.y };
            } else {
                this.board.grid[originalPos.y][originalPos.x] = piece;
                piece.position = originalPos;
                this.board.grid[move.y][move.x] = targetPiece;
            }

            if (!inCheck) {
                legalMoves.push(move);
            }
        }
        return legalMoves;
    }

    override executeMove(from: Position, to: Position, promotionPiece?: string): boolean {
        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || piece.color !== this.currentTurn) return false;

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const targetPiece = this.board.getPieceAt(to.x, to.y);
        const isAllySwap = piece.name === 'Shah' && targetPiece && targetPiece.color === piece.color;

        if (isAllySwap) {
            // swap positions cleanly without setting from to null
            this.board.grid[from.y][from.x] = targetPiece;
            this.board.grid[to.y][to.x] = piece;
            targetPiece.position = { x: from.x, y: from.y };
            piece.position = { x: to.x, y: to.y };
            targetPiece.hasMoved = true;
            piece.hasMoved = true;
            (piece as Shah).hasSwappedPiece = true;

            // switch turn to opponent
            this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
            this.updateGameState();

            const san = `K<=>${targetPiece.name[0]}${this.board.rows - to.y}`;
            this.history.push({ piece, from, to, capturedPiece: null, san });
            this.postTurnHook();
            return true;
        }

        const success = super.executeMove(from, to, promotionPiece);
        if (success && targetPiece && targetPiece.name === 'Shah') {
            // automatic succession if exactly 1 lower royal remains
            const defenderRoyals = this.getRoyalPieces(targetPiece.color);
            if (!defenderRoyals.some(p => p.name === 'Shah') && defenderRoyals.length === 1) {
                this.crownSuccessor(defenderRoyals[0].id);
                if (this.history.length > 0) {
                    this.history[this.history.length - 1].crownedSuccessorId = defenderRoyals[0].id;
                }
            }
        }
        return success;
    }

    executeCitadelSwap(from: Position, to: Position, chosenRoyalId?: string): boolean {
        const success = this.executeMove(from, to);
        if (!success) return false;

        const shah = this.board.getPieceAt(to.x, to.y);
        if (!shah) return true;

        // exclude adventitious king if it is currently inside its own citadel
        const lowerRoyals = this.getRoyalPieces(shah.color).filter(p => {
            if (p === shah) return false;
            if (p.name !== 'Shahzada' && p.name !== 'AdventitiousShah') return false;

            const isOwnCitadel = (shah.color === 'white' && p.position.x === 12 && p.position.y === 8) ||
                                 (shah.color === 'black' && p.position.x === 0 && p.position.y === 1);
            if (p.name === 'AdventitiousShah' && isOwnCitadel) return false;

            return true;
        });

        if (lowerRoyals.length > 0) {
            const lowerRoyal = (chosenRoyalId ? lowerRoyals.find(r => r.id === chosenRoyalId) : null) || lowerRoyals[0];
            const lowerPos = { ...lowerRoyal.position };

            this.board.grid[to.y][to.x] = lowerRoyal;
            this.board.grid[lowerPos.y][lowerPos.x] = shah;

            lowerRoyal.position = { x: to.x, y: to.y };
            shah.position = lowerPos;

            if (shah.color === 'white') this.whiteCitadelExchangeUsed = true;
            else this.blackCitadelExchangeUsed = true;

            if (this.history.length > 0) {
                this.history[this.history.length - 1].citadelSwappedRoyalId = lowerRoyal.id;
            }

            this.state = 'playing';
        }
        return true;
    }

    crownSuccessor(chosenRoyalId: string): void {
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.id === chosenRoyalId) {
                    const newShah = new Shah(`${p.id}_crowned`, p.color, { x, y });
                    newShah.hasMoved = true;
                    newShah.hasSwappedPiece = true; // crowned king cannot use the evasion swap
                    this.board.setPiece(newShah, x, y);
                    this.updateGameState();
                    return;
                }
            }
        }
    }

    protected beforeMoveHook(piece: Piece, _from: Position, to: Position, capturedPiece: Piece | null): Piece | null {
        // if resting pawn of pawns relocates to an occupied square, sacrifice and remove occupant
        if (piece instanceof TamerlanePawn && piece.isRestingOnLastRank && piece.pawnType === 'pawn_of_pawns') {
            piece.isRestingOnLastRank = false;
            if (capturedPiece) {
                this.board.removePieceAt(to.x, to.y);
            }
        }

        return capturedPiece;
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position, _capturedPiece: Piece | null): void {
        const isBlackCitadel = to.x === 0 && to.y === 1;
        const isWhiteCitadel = to.x === 12 && to.y === 8;
        const isOpponentCitadel = (piece.color === 'white' && isBlackCitadel) || (piece.color === 'black' && isWhiteCitadel);

        // handle entering opponent citadel without immediate swap (declares draw)
        if (isOpponentCitadel && piece.name === 'Shah') {
            this.state = 'draw';
            return;
        }

        // handle pawn promotions
        if (piece instanceof TamerlanePawn) {
            const promotionRank = piece.color === 'white' ? 0 : 9;
            if (to.y === promotionRank) {
                if (piece.pawnType === 'pawn_of_pawns') {
                    if (piece.promotionStage === 0) {
                        piece.isRestingOnLastRank = true;
                        piece.promotionStage = 1;
                        return;
                    } else if (piece.promotionStage === 1) {
                        // second promotion: teleport to pawn of king starting square
                        const kingPawnPos = piece.color === 'white' ? { x: 6, y: 7 } : { x: 6, y: 2 };
                        this.board.removePieceAt(to.x, to.y);
                        this.board.removePieceAt(kingPawnPos.x, kingPawnPos.y);
                        this.board.setPiece(piece, kingPawnPos.x, kingPawnPos.y);
                        piece.promotionStage = 2;
                        return;
                    } else if (piece.promotionStage === 2) {
                        // third promotion: becomes adventitious king
                        const adventitiousKing = new AdventitiousShah(`${piece.id}_promoted`, piece.color, to);
                        adventitiousKing.hasMoved = true;
                        this.board.setPiece(adventitiousKing, to.x, to.y);
                        return;
                    }
                }

                let promotedPiece: Piece | null = null;
                switch (piece.pawnType) {
                    case 'pawn_of_dabbabas':
                        promotedPiece = new Dabbaba(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_camels':
                        promotedPiece = new Jamal(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_elephants':
                        promotedPiece = new Pil(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_giraffes':
                        promotedPiece = new Zurafa(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_king':
                        promotedPiece = new Shahzada(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_vizier':
                        promotedPiece = new Wazir(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_counselor':
                        promotedPiece = new Ferz(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_scouts':
                        promotedPiece = new Talia(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_horses':
                        promotedPiece = new Asb(`${piece.id}_promoted`, piece.color, to);
                        break;
                    case 'pawn_of_rooks':
                        promotedPiece = new Rukh(`${piece.id}_promoted`, piece.color, to);
                        break;
                }

                if (promotedPiece) {
                    promotedPiece.hasMoved = true;
                    this.board.setPiece(promotedPiece, to.x, to.y);
                }
            }
        }
    }

    updateGameState() {
        const inCheck = this.isKingInCheck(this.currentTurn);

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

        if (!hasAnyLegalMove) {
            this.state = inCheck ? 'checkmate' : 'draw';
        } else if (this.state !== 'draw') {
            this.state = inCheck ? 'check' : 'playing';
        }
    }
}