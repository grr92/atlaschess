import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import type { Move, PieceColor, Position, GameState, GameInterception, InterceptionDecision } from '../../types';
import { Piece } from '../pieces/piecesIndex';
import { getDisambiguator, buildSAN } from "../../utils/notation";
import type { ICheckStrategy } from './strategies/CheckStrategy';
import type { IVictoryStrategy } from './strategies/VictoryStrategy';
import type { IEvaluationStrategy } from '../ai/strategies/EvaluationStrategy';
import { DefaultEvaluationStrategy } from '../ai/strategies/EvaluationStrategy';

export type PreMoveInterception = GameInterception;
export type PostMoveInterception = GameInterception;

export abstract class BaseEngine {
    board: Board;
    currentTurn: PieceColor;
    history: Move[];
    variant: GameVariant;
    state: GameState;
    protected checkStrategy?: ICheckStrategy;
    protected victoryStrategy?: IVictoryStrategy;
    protected evaluationStrategy?: IEvaluationStrategy;

    constructor(
        variant: GameVariant,
        checkStrategy?: ICheckStrategy,
        victoryStrategy?: IVictoryStrategy,
        evaluationStrategy?: IEvaluationStrategy
    ) {
        this.variant = variant;
        this.board = variant.setupBoard();
        this.currentTurn = 'white';
        this.history = [];
        this.state = 'playing';
        this.checkStrategy = checkStrategy;
        this.victoryStrategy = victoryStrategy;
        this.evaluationStrategy = evaluationStrategy;
    }

    getEvaluationStrategy(): IEvaluationStrategy {
        return this.evaluationStrategy || new DefaultEvaluationStrategy();
    }

    isPieceControllableByCurrentTurn(piece: Piece): boolean {
        return piece.color === this.getActiveController();
    }

    getActiveController(color?: PieceColor): PieceColor {
        return color || this.currentTurn;
    }

    rotateTurn(): void {
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    }

    /**
     * Passes the current player's turn to the next player.
     */
    passTurn(): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;
        const passRecord: Move = {
            piece: null as any,
            from: { x: -1, y: -1 },
            to: { x: -1, y: -1 },
            san: 'pass',
            isPass: true
        };
        this.history.push(passRecord);
        this.rotateTurn();
        this.updateGameState();
        return true;
    }

    /**
     * Template hook for variant-specific engines to clone their internal states.
     */
    cloneCustomFields(_target: BaseEngine): void {}

    /**
     * Polymorphic resolver for interactive game interceptions.
     */
    resolveInterception(_decision: InterceptionDecision): boolean {
        return false;
    }

    executeMove(from: Position, to: Position, promotionPiece?: string): boolean {
        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || !this.isPieceControllableByCurrentTurn(piece)) return false;

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const disambiguator = getDisambiguator(this, piece, from, to);

        const targetPiece = this.board.getPieceAt(to.x, to.y);
        const capturedPiece = this.beforeMoveHook(piece, from, to, targetPiece);
        this.board.movePiece(from, to);
        piece.hasMoved = true;

        this.afterMoveHook(piece, from, to, capturedPiece, promotionPiece);

        // Switch turn polymorphically (supports 2-player, 4-player, etc.)
        this.rotateTurn();

        // Update game state (detects check, mate, draws)
        this.updateGameState();

        // Prepare promotion letter for SAN
        let promotedToChar: string | undefined = undefined;
        if (promotionPiece) {
            switch(promotionPiece) {
                case 'Queen': promotedToChar = 'Q'; break;
                case 'Rook': promotedToChar = 'R'; break;
                case 'Bishop': promotedToChar = 'B'; break;
                case 'Knight': promotedToChar = 'N'; break;
            }
        }

        // Build standard algebraic notation
        const san = buildSAN(this, piece, from, to, capturedPiece, disambiguator, promotedToChar);

        // Save to history
        this.history.push({ piece, from, to, capturedPiece, san });

        // Trigger final hook
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
    getPreMoveInterception(from: Position, to: Position): GameInterception | null {
        const piece = this.board.getPieceAt(from.x, from.y);
        const isPawn = piece?.name === 'Pawn';
        const isPromotionRank = piece?.color === 'white' ? to.y === 0 : to.y === 7;

        if (isPawn && isPromotionRank) {
            return { type: 'PROMOTION', from, to };
        }
        return null;
    }

    // Interception hook after executing move (e.g. royal succession)
    getPostMoveInterception(_lastMove: Move): GameInterception | null {
        return null;
    }

    // Hook for actions before moving: Castling
    protected beforeMoveHook(_piece: Piece, _from: Position, _to: Position, capturedPiece: Piece | null): Piece | null {
        return capturedPiece;
    }

    // Hook for actions after moving: Pawn promotion, 50 movement rules, etc...
    protected afterMoveHook(_piece: Piece, _from: Position, _to: Position, _capturedPiece: Piece | null, _promotionPiece?: string): void {}

    // Hook for actions after turn: for example saving hashes of the board for the triple repetition rule
    protected postTurnHook(): void {}
}