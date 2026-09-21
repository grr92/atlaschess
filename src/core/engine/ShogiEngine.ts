import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import { Shogi } from '../variants/Shogi';
import { Piece } from '../pieces/Piece';
import type { PieceColor, Position, GameState, GameInterception } from '../../types';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import type { IVictoryStrategy } from './strategies/VictoryStrategy';
import {
    createShogiPiece,
    getPromotedPieceName,
    getUnpromotedPieceName,
    pieceNameToUciChar,
    SHOGI_INITIAL_FEN
} from '../variants/shogi/shogiSetup';
import { positionToUciSquare } from '../../utils/uciNotation';

export type ShogiEndReason = 'sennichite' | 'oute_sennichite' | 'jishogi_draw' | 'jishogi_win' | null;

export class ShogiVictoryStrategy implements IVictoryStrategy {
    evaluateGameState(engine: BaseEngine): GameState {
        if (!(engine instanceof ShogiEngine)) {
            return 'playing';
        }

        // 1. Preserved Jishogi resolution
        if (engine.endReason === 'jishogi_draw') {
            return 'draw';
        }
        if (engine.endReason === 'jishogi_win') {
            return 'checkmate';
        }

        // 2. Sennichite check (4-fold repetition)
        const sennichiteState = engine.checkSennichite();
        if (sennichiteState) {
            return sennichiteState;
        }

        const color = engine.currentTurn;
        const hasAnyMove = engine.hasAnyLegalMove(color);
        const inCheck = engine.isKingInCheck(color);

        if (!hasAnyMove) {
            return 'checkmate';
        }

        return inCheck ? 'check' : 'playing';
    }
}

export class ShogiEngine extends BaseEngine {
    inHand: Record<string, string[]> & { white: string[]; black: string[] };
    selectedDropPiece: string | null = null;
    initialFen: string = SHOGI_INITIAL_FEN;
    positionSignatures: string[] = [];
    endReason: ShogiEndReason = null;

    constructor(variant: GameVariant = new Shogi()) {
        super(variant, new SingleRoyalCheckStrategy('ShogiKing'), new ShogiVictoryStrategy());
        this.inHand = {
            white: [],
            black: []
        };
        this.positionSignatures = [this.getPositionSignature()];
    }

    getPositionSignature(): string {
        const fen = this.getFen();
        const parts = fen.split(' ');
        return `${parts[0]} ${parts[1]}`;
    }

    setSelectedDropPiece(pieceName: string | null): void {
        this.selectedDropPiece = pieceName;
    }

    override getPlacementTargets(): Position[] {
        if (!this.selectedDropPiece) return [];
        return this.getLegalDrops(this.selectedDropPiece, this.currentTurn);
    }

    /**
     * Checks whether a square is within the promotion zone for the given color.
     * White promotion zone: ranks 9, 8, 7 (y = 0, 1, 2)
     * Black promotion zone: ranks 1, 2, 3 (y = 6, 7, 8)
     */
    isInPromotionZone(y: number, color: PieceColor): boolean {
        return color === 'white' ? y <= 2 : y >= 6;
    }

    /**
     * Determines whether promotion is mandatory because the piece has no further legal moves.
     */
    isMandatoryPromotion(pieceName: string, toY: number, color: PieceColor): boolean {
        if (pieceName === 'ShogiPawn' || pieceName === 'ShogiLance') {
            return color === 'white' ? toY === 0 : toY === 8;
        }
        if (pieceName === 'ShogiKnight') {
            return color === 'white' ? toY <= 1 : toY >= 7;
        }
        return false;
    }

    /**
     * Returns pre-move interception for optional promotions.
     */
    override getPreMoveInterception(from: Position, to: Position): GameInterception | null {
        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || piece.color !== this.currentTurn) return null;

        const promotedName = getPromotedPieceName(piece.name);
        if (!promotedName) return null; // King, Gold, or already promoted pieces cannot promote

        const canPromote = this.isInPromotionZone(from.y, piece.color) || this.isInPromotionZone(to.y, piece.color);
        if (!canPromote) return null;

        // If promotion is mandatory (e.g. Pawn/Lance at rank 9, Knight at rank 8-9), do not intercept with modal
        if (this.isMandatoryPromotion(piece.name, to.y, piece.color)) {
            return null;
        }

        // Optional promotion modal
        return {
            type: 'PROMOTION',
            from,
            to,
            availablePieces: [promotedName, piece.name]
        };
    }

    override executeMove(from: Position, to: Position, promotionPiece?: string): boolean {
        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || !this.isPieceControllableByCurrentTurn(piece)) return false;

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const targetPiece = this.board.getPieceAt(to.x, to.y);
        const capturedPiece = this.beforeMoveHook(piece, from, to, targetPiece);

        // Move on board
        this.board.movePiece(from, to);
        piece.hasMoved = true;

        // Check if piece should be promoted
        let shouldPromote = false;
        if (this.isMandatoryPromotion(piece.name, to.y, piece.color)) {
            shouldPromote = true;
        } else if (promotionPiece) {
            const promotedName = getPromotedPieceName(piece.name);
            if (promotionPiece === '+' || promotionPiece === promotedName) {
                shouldPromote = true;
            }
        }

        if (shouldPromote) {
            const promotedName = getPromotedPieceName(piece.name);
            if (promotedName) {
                const newPromotedPiece = createShogiPiece(promotedName, piece.color, to);
                this.board.setPiece(newPromotedPiece, to.x, to.y);
            }
        }

        this.afterMoveHook(piece, from, to, capturedPiece, promotionPiece);

        // Check if move gave check to opponent (who is about to become activeTurn)
        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        const deliveredCheck = this.isKingInCheck(opponentColor);

        // Switch turn
        this.rotateTurn();

        // Build SAN
        const fromSquare = positionToUciSquare(from, 9);
        const toSquare = positionToUciSquare(to, 9);
        const promoSuffix = shouldPromote ? '+' : '';
        const san = `${fromSquare}${toSquare}${promoSuffix}`;

        this.history.push({
            piece,
            from,
            to,
            capturedPiece,
            san,
            isPromotion: shouldPromote,
            isCheck: deliveredCheck
        });

        // Record position signature for Sennichite tracking
        this.positionSignatures.push(this.getPositionSignature());

        // Update game state
        this.updateGameState();

        this.selectedDropPiece = null;
        this.postTurnHook();
        return true;
    }

    protected override beforeMoveHook(piece: Piece, _from: Position, _to: Position, targetPiece: Piece | null): Piece | null {
        if (targetPiece) {
            // Revert promoted piece to unpromoted base form
            const baseName = getUnpromotedPieceName(targetPiece.name);
            this.inHand[piece.color].push(baseName);
        }
        return targetPiece;
    }

    /**
     * Determines whether the specified player has at least one legal move
     * (either a piece move on the board or a valid drop from hand).
     */
    hasAnyLegalMove(color: PieceColor, useSimulatedDrops = false): boolean {
        // 1. Board moves
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === color) {
                    if (this.getLegalMoves(p).length > 0) {
                        return true;
                    }
                }
            }
        }

        // 2. Drop moves from hand
        const hand = this.inHand[color] || [];
        const uniquePiecesInHand: string[] = Array.from(new Set(hand));
        for (const pName of uniquePiecesInHand) {
            const drops = useSimulatedDrops
                ? this.getLegalDropsSimulated(pName, color)
                : this.getLegalDrops(pName, color);
            if (drops.length > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Precomputes columns containing unpromoted pawns of the given color (for the Nifu rule).
     */
    private getPawnFiles(color: PieceColor): Set<number> {
        const filesWithPawns = new Set<number>();
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === color && p.name === 'ShogiPawn') {
                    filesWithPawns.add(x);
                }
            }
        }
        return filesWithPawns;
    }

    /**
     * Computes all legal squares where a given in-hand piece can be dropped.
     */
    getLegalDrops(pieceName: string, color: PieceColor): Position[] {
        if (!this.inHand[color].includes(pieceName)) return [];

        const legalPositions: Position[] = [];
        const filesWithPawns = pieceName === 'ShogiPawn' ? this.getPawnFiles(color) : null;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (this.board.getPieceAt(x, y) !== null) continue;

                // Dead-end check (pieces cannot be dropped where they would have no legal forward moves)
                if (this.isMandatoryPromotion(pieceName, y, color)) continue;

                // Nifu rule (二歩): cannot drop a pawn in a file containing another unpromoted pawn of the same player
                if (filesWithPawns?.has(x)) continue;

                // Simulate placing the piece
                const testPiece = createShogiPiece(pieceName, color, { x, y });
                this.board.setPiece(testPiece, x, y);

                // Check 1: Drop cannot leave or place own King in check
                const ownKingInCheck = this.isKingInCheck(color);
                let isLegal = !ownKingInCheck;

                // Check 2: Uchifuzume (打ち歩詰め): A pawn drop cannot deliver an immediate win
                // (neither by checkmate nor by stalemating / ahogando the opponent).
                if (isLegal && pieceName === 'ShogiPawn') {
                    const opponentColor: PieceColor = color === 'white' ? 'black' : 'white';
                    if (!this.hasAnyLegalMove(opponentColor, true)) {
                        isLegal = false;
                    }
                }

                // Undo simulation
                this.board.removePieceAt(x, y);

                if (isLegal) {
                    legalPositions.push({ x, y });
                }
            }
        }

        return legalPositions;
    }

    /**
     * Helper for simulating drops without recursive Uchifuzume checking.
     */
    private getLegalDropsSimulated(pieceName: string, color: PieceColor): Position[] {
        const legalPositions: Position[] = [];
        const filesWithPawns = pieceName === 'ShogiPawn' ? this.getPawnFiles(color) : null;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (this.board.getPieceAt(x, y) !== null) continue;
                if (this.isMandatoryPromotion(pieceName, y, color)) continue;
                if (filesWithPawns?.has(x)) continue;

                const testPiece = createShogiPiece(pieceName, color, { x, y });
                this.board.setPiece(testPiece, x, y);
                const ownCheck = this.isKingInCheck(color);
                this.board.removePieceAt(x, y);

                if (!ownCheck) {
                    legalPositions.push({ x, y });
                }
            }
        }
        return legalPositions;
    }

    /**
     * Executes a piece drop from hand to the board.
     */
    dropPiece(pieceName: string, pos: Position): boolean {
        const color = this.currentTurn;
        const handIndex = this.inHand[color].indexOf(pieceName);
        if (handIndex === -1) return false;

        const legalDrops = this.getLegalDrops(pieceName, color);
        const isLegal = legalDrops.some(p => p.x === pos.x && p.y === pos.y);
        if (!isLegal) return false;

        // Remove from hand
        this.inHand[color].splice(handIndex, 1);

        // Place on board
        const droppedPiece = createShogiPiece(pieceName, color, pos);
        this.board.setPiece(droppedPiece, pos.x, pos.y);

        const opponentColor = color === 'white' ? 'black' : 'white';
        const deliveredCheck = this.isKingInCheck(opponentColor);

        // Turn & state update
        this.rotateTurn();

        const uciPieceChar = pieceNameToUciChar(pieceName).toUpperCase();
        const destSquare = positionToUciSquare(pos, 9);
        const san = `${uciPieceChar}@${destSquare}`;

        this.history.push({
            piece: droppedPiece,
            from: { x: -1, y: -1 },
            to: pos,
            san,
            isDrop: true,
            dropPiece: pieceName,
            isCheck: deliveredCheck
        });

        // Record position signature for Sennichite tracking
        this.positionSignatures.push(this.getPositionSignature());

        // Update state
        this.updateGameState();

        this.selectedDropPiece = null;
        this.postTurnHook();
        return true;
    }

    /**
     * Reverses the last move or drop.
     */
    undoMove(): boolean {
        if (this.history.length === 0) return false;

        const lastMove = this.history.pop();
        if (!lastMove) return false;

        // Pop last position signature
        if (this.positionSignatures.length > 1) {
            this.positionSignatures.pop();
        }
        this.endReason = null;

        // Previous turn
        this.rotateTurn();
        const player = this.currentTurn;

        if (lastMove.isDrop && lastMove.dropPiece) {
            // Remove dropped piece from board
            this.board.removePieceAt(lastMove.to.x, lastMove.to.y);
            // Return piece to player's hand
            this.inHand[player].push(lastMove.dropPiece);
        } else {
            // Standard move
            const movedPiece = this.board.getPieceAt(lastMove.to.x, lastMove.to.y);
            this.board.removePieceAt(lastMove.to.x, lastMove.to.y);

            let restoredPiece = movedPiece;
            if (lastMove.isPromotion && movedPiece) {
                // Demote back to base piece
                const baseName = getUnpromotedPieceName(movedPiece.name);
                restoredPiece = createShogiPiece(baseName, player, lastMove.from);
            } else if (restoredPiece) {
                restoredPiece.position = { ...lastMove.from };
            }

            if (restoredPiece) {
                this.board.setPiece(restoredPiece, lastMove.from.x, lastMove.from.y);
            }

            // Restore captured piece if any
            if (lastMove.capturedPiece) {
                this.board.setPiece(lastMove.capturedPiece, lastMove.to.x, lastMove.to.y);
                // Remove from player's hand
                const unpromotedName = getUnpromotedPieceName(lastMove.capturedPiece.name);
                const handIdx = this.inHand[player].indexOf(unpromotedName);
                if (handIdx !== -1) {
                    this.inHand[player].splice(handIdx, 1);
                }
            }
        }

        this.selectedDropPiece = null;
        this.updateGameState();
        return true;
    }

    /**
     * Serializes board and hand to official Fairy-Stockfish Shogi FEN.
     * Format: <board>[<hand>] <turn> - - <halfmove> <fullmove>
     */
    getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < 9; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < 9; x++) {
                const piece = this.board.getPieceAt(x, y);
                if (!piece) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount.toString();
                        emptyCount = 0;
                    }
                    const uciChar = pieceNameToUciChar(piece.name);
                    rowStr += piece.color === 'white' ? uciChar : uciChar.toLowerCase();
                }
            }
            if (emptyCount > 0) {
                rowStr += emptyCount.toString();
            }
            rows.push(rowStr);
        }

        const boardFen = rows.join('/');

        // Hand pieces
        // Order for standard Fairy-Stockfish hand serialization:
        // R, B, G, S, N, L, P (uppercase for White, lowercase for Black)
        const PIECE_HAND_ORDER = [
            'ShogiRook',
            'ShogiBishop',
            'ShogiGold',
            'ShogiSilver',
            'ShogiKnight',
            'ShogiLance',
            'ShogiPawn'
        ];

        let handStr = '';

        // White hand (uppercase)
        for (const pName of PIECE_HAND_ORDER) {
            const count = this.inHand.white.filter(p => p === pName).length;
            if (count > 0) {
                const char = pieceNameToUciChar(pName);
                handStr += (count > 1 ? count.toString() : '') + char;
            }
        }

        // Black hand (lowercase)
        for (const pName of PIECE_HAND_ORDER) {
            const count = this.inHand.black.filter(p => p === pName).length;
            if (count > 0) {
                const char = pieceNameToUciChar(pName).toLowerCase();
                handStr += (count > 1 ? count.toString() : '') + char;
            }
        }

        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';
        const fullMoveCount = Math.floor(this.history.length / 2) + 1;
        const halfMoveClock = 0;

        return `${boardFen}[${handStr}] ${activeColor} - - ${halfMoveClock} ${fullMoveCount}`;
    }

    /**
     * Checks for 4-fold repetition (Sennichite) and perpetual check (Oute Sennichite).
     * Returns 'draw' or 'checkmate' if triggered, or null if no Sennichite.
     */
    checkSennichite(): GameState | null {
        const currentSig = this.getPositionSignature();
        const occurrences = this.positionSignatures.filter(s => s === currentSig).length;
        if (occurrences < 4) {
            return null;
        }

        // Fourfold repetition reached!
        // Find indices of this signature in positionSignatures:
        const occIndices: number[] = [];
        for (let i = 0; i < this.positionSignatures.length; i++) {
            if (this.positionSignatures[i] === currentSig) {
                occIndices.push(i);
            }
        }

        // Evaluate moves between the 1st occurrence and the 4th occurrence
        const startPosIdx = occIndices[0];
        const endPosIdx = occIndices[occIndices.length - 1];

        let whiteChecksCount = 0;
        let whiteTotalMoves = 0;
        let blackChecksCount = 0;
        let blackTotalMoves = 0;

        for (let i = startPosIdx; i < endPosIdx; i++) {
            const move = this.history[i];
            if (!move) continue;
            const color = move.piece.color;
            if (color === 'white') {
                whiteTotalMoves++;
                if (move.isCheck) {
                    whiteChecksCount++;
                }
            } else {
                blackTotalMoves++;
                if (move.isCheck) {
                    blackChecksCount++;
                }
            }
        }

        const whiteAllChecks = whiteTotalMoves > 0 && whiteChecksCount === whiteTotalMoves;
        const blackAllChecks = blackTotalMoves > 0 && blackChecksCount === blackTotalMoves;

        if (whiteAllChecks && !blackAllChecks) {
            // White gave continuous checks: White loses, Black wins
            this.endReason = 'oute_sennichite';
            this.currentTurn = 'white'; // White is defeated
            return 'checkmate';
        }

        if (blackAllChecks && !whiteAllChecks) {
            // Black gave continuous checks: Black loses, White wins
            this.endReason = 'oute_sennichite';
            this.currentTurn = 'black'; // Black is defeated
            return 'checkmate';
        }

        // Standard repetition draw
        this.endReason = 'sennichite';
        return 'draw';
    }

    findKing(color: PieceColor): Piece | null {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.name === 'ShogiKing' && p.color === color) {
                    return p;
                }
            }
        }
        return null;
    }

    /**
     * Calculates piece points according to standard 24-point JSA rules:
     * - King: 0 pts
     * - Rook, Bishop, Dragon, Horse: 5 pts each
     * - All other pieces (both on board and in hand): 1 pt each
     */
    calculateJishogiPoints(): {
        white: number;
        black: number;
        whiteMajors: number;
        whiteMinors: number;
        blackMajors: number;
        blackMinors: number;
    } {
        let whiteMajors = 0;
        let whiteMinors = 0;
        let blackMajors = 0;
        let blackMinors = 0;

        // 1. Board
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const p = this.board.getPieceAt(x, y);
                if (!p || p.name === 'ShogiKing') continue;

                const isMajor = p.name === 'ShogiRook' || p.name === 'ShogiDragon' ||
                                p.name === 'ShogiBishop' || p.name === 'ShogiHorse';

                if (p.color === 'white') {
                    if (isMajor) whiteMajors++;
                    else whiteMinors++;
                } else {
                    if (isMajor) blackMajors++;
                    else blackMinors++;
                }
            }
        }

        // 2. Hand
        for (const pName of this.inHand.white) {
            if (pName === 'ShogiRook' || pName === 'ShogiBishop') {
                whiteMajors++;
            } else {
                whiteMinors++;
            }
        }

        for (const pName of this.inHand.black) {
            if (pName === 'ShogiRook' || pName === 'ShogiBishop') {
                blackMajors++;
            } else {
                blackMinors++;
            }
        }

        const white = (whiteMajors * 5) + (whiteMinors * 1);
        const black = (blackMajors * 5) + (blackMinors * 1);

        return {
            white,
            black,
            whiteMajors,
            whiteMinors,
            blackMajors,
            blackMinors
        };
    }

    /**
     * Checks whether both kings have entered the opponent's promotion zone (Ai-nyuugyoku):
     * - White King at y <= 2
     * - Black King at y >= 6
     */
    canDeclareJishogi(): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;
        const whiteKing = this.findKing('white');
        const blackKing = this.findKing('black');
        if (!whiteKing || !blackKing) return false;
        return whiteKing.position.y <= 2 && blackKing.position.y >= 6;
    }

    /**
     * Declares Jishogi and resolves by the official JSA 24-point rule.
     * - Both >= 24 -> draw
     * - White >= 24 & Black < 24 -> White wins
     * - Black >= 24 & White < 24 -> Black wins
     */
    declareJishogi(): {
        result: 'draw' | 'white_win' | 'black_win';
        whitePoints: number;
        blackPoints: number;
    } {
        const pts = this.calculateJishogiPoints();
        let result: 'draw' | 'white_win' | 'black_win';

        if (pts.white >= 24 && pts.black >= 24) {
            result = 'draw';
            this.state = 'draw';
            this.endReason = 'jishogi_draw';
        } else if (pts.white >= 24 && pts.black < 24) {
            result = 'white_win';
            this.state = 'checkmate';
            this.currentTurn = 'black'; // Black is defeated
            this.endReason = 'jishogi_win';
        } else if (pts.black >= 24 && pts.white < 24) {
            result = 'black_win';
            this.state = 'checkmate';
            this.currentTurn = 'white'; // White is defeated
            this.endReason = 'jishogi_win';
        } else {
            result = 'draw';
            this.state = 'draw';
            this.endReason = 'jishogi_draw';
        }

        return {
            result,
            whitePoints: pts.white,
            blackPoints: pts.black
        };
    }

    override getCustomStatus(): string | null {
        if (this.endReason === 'sennichite') {
            return 'Sennichite (千日手)';
        }
        if (this.endReason === 'oute_sennichite') {
            return 'Oute Sennichite (王手千日手)';
        }
        if (this.endReason === 'jishogi_draw' || this.endReason === 'jishogi_win') {
            return 'Jishogi (持将棋)';
        }
        return null;
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof ShogiEngine) {
            target.inHand = {
                white: [...this.inHand.white],
                black: [...this.inHand.black]
            };
            target.selectedDropPiece = this.selectedDropPiece;
            target.positionSignatures = [...this.positionSignatures];
            target.endReason = this.endReason;
        }
    }

    override restoreCustomState(options: any): void {
        if (options?.inHand) {
            this.inHand = {
                white: [...(options.inHand.white || [])],
                black: [...(options.inHand.black || [])]
            };
        }
        if (options?.positionSignatures) {
            this.positionSignatures = [...options.positionSignatures];
        }
        if (options?.endReason !== undefined) {
            this.endReason = options.endReason;
        }
    }

    override getVariantOptions(): any {
        return {
            inHand: {
                white: [...this.inHand.white],
                black: [...this.inHand.black]
            },
            positionSignatures: [...this.positionSignatures],
            endReason: this.endReason
        };
    }
}
