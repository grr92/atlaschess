import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import type { Move, PieceColor, Position, GameState } from '../../types';
import { Piece } from '../pieces/piecesIndex';
import { getDisambiguator, buildSAN } from "../../utils/notation";
import type { ICheckStrategy } from './strategies/CheckStrategy';
import type { IVictoryStrategy } from './strategies/VictoryStrategy';

export type PreMoveInterception =
    | { type: 'PROMOTION'; from: Position; to: Position }
    | { type: 'CITADEL_CHOICE'; from: Position; to: Position; royals: { id: string; name: string }[] };

export type PostMoveInterception =
    | { type: 'SUCCESSION_CHOICE'; color: PieceColor; royals: { id: string; name: string }[] };

export abstract class BaseEngine {
    board: Board;
    currentTurn: PieceColor;
    history: Move[];
    variant: GameVariant;
    state: GameState;
    protected checkStrategy?: ICheckStrategy;
    protected victoryStrategy?: IVictoryStrategy;

    constructor(variant: GameVariant, checkStrategy?: ICheckStrategy, victoryStrategy?: IVictoryStrategy) {
        this.variant = variant;
        this.board = variant.setupBoard();
        this.currentTurn = 'white';
        this.history = [];
        this.state = 'playing';
        this.checkStrategy = checkStrategy;
        this.victoryStrategy = victoryStrategy;
    }

    executeMove(from: Position, to: Position, promotionPiece?: string): boolean {
        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || piece.color !== this.currentTurn) return false;

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const disambiguator = getDisambiguator(this, piece, from, to);

        const targetPiece = this.board.getPieceAt(to.x, to.y);
        const capturedPiece = this.beforeMoveHook(piece, from, to, targetPiece);

        this.board.grid[from.y][from.x] = null;
        this.board.grid[to.y][to.x] = piece;
        piece.position = { x: to.x, y: to.y };
        piece.hasMoved = true;

        this.afterMoveHook(piece, from, to, capturedPiece, promotionPiece);

        // core logic: execution order

        // 1. switch turn to the opponent first
        // this allows the engine to evaluate the enemy king's health (check or mate)
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

        // 2. update the game state
        // the engine now detects if the opponent has no valid moves left
        this.updateGameState();

        // 3. prepare the promotion letter
        let promotedToChar: string | undefined = undefined;
        if (promotionPiece) {
            switch(promotionPiece) {
                case 'Queen': promotedToChar = 'Q'; break;
                case 'Rook': promotedToChar = 'R'; break;
                case 'Bishop': promotedToChar = 'B'; break;
                case 'Knight': promotedToChar = 'N'; break;
            }
        }

        // 4. build the standard algebraic notation (san)
        // since the game state is updated, it correctly appends mate or check symbols
        const san = buildSAN(this, piece, from, to, capturedPiece, disambiguator, promotedToChar);

        // 5. save to history
        this.history.push({ piece, from, to, capturedPiece, san });

        // 6. trigger the final hook
        this.postTurnHook();

        return true;
    }

    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        if (this.checkStrategy) {
            return this.checkStrategy.isKingInCheck(color, board);
        }
        return false;
    }

    getLegalMoves(piece: Piece): Position[] {
        const lastMove = this.history.length > 0 ? this.history[this.history.length - 1] : undefined;
        const pseudoMoves = piece.getPossibleMoves(this.board, lastMove);

        if (this.checkStrategy) {
            return this.checkStrategy.filterLegalMoves(piece, this.board, pseudoMoves);
        }
        return pseudoMoves;
    }

    updateGameState(): void {
        if (this.victoryStrategy) {
            this.state = this.victoryStrategy.evaluateGameState(this);
        }
    }

    // Interception hook before executing move (e.g. pawn promotion, citadel infiltration)
    getPreMoveInterception(from: Position, to: Position): PreMoveInterception | null {
        const piece = this.board.getPieceAt(from.x, from.y);
        const isPawn = piece?.name === 'Pawn';
        const isPromotionRank = piece?.color === 'white' ? to.y === 0 : to.y === 7;

        if (isPawn && isPromotionRank) {
            return { type: 'PROMOTION', from, to };
        }
        return null;
    }

    // Interception hook after executing move (e.g. royal succession)
    getPostMoveInterception(_lastMove: Move): PostMoveInterception | null {
        return null;
    }

    // Special moves support (overridden by variants such as Tamerlane)
    executeCitadelSwap(_from: Position, _to: Position, _chosenRoyalId?: string): boolean {
        return false;
    }

    crownSuccessor(_chosenRoyalId: string): void {}

    // Hook for actions before moving: Castling
    protected beforeMoveHook(_piece: Piece, _from: Position, _to: Position, capturedPiece: Piece | null): Piece | null {
        return capturedPiece;
    }

    // Hook for actions after moving: Pawn promotion, 50 movement rules, etc...
    protected afterMoveHook(_piece: Piece, _from: Position, _to: Position, _capturedPiece: Piece | null, _promotionPiece?: string): void {}

    // Hook for actions after turn: for example saving hashes of the board for the triple repetition rule
    protected postTurnHook(): void {}
}