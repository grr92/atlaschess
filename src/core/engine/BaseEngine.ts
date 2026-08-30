import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import type { Move, PieceColor, Position, GameState } from '../../types';
import { Piece } from '../pieces/piecesIndex';
import { getDisambiguator, buildSAN } from "../../utils/notation";

export abstract class BaseEngine {
    board: Board;
    currentTurn: PieceColor;
    history: Move[];
    variant: GameVariant;
    state: GameState;

    constructor(variant: GameVariant) {
        this.variant = variant;
        this.board = variant.setupBoard();
        this.currentTurn = 'white';
        this.history = [];
        this.state = 'playing';
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

    abstract getLegalMoves(piece: Piece): Position[];
    abstract updateGameState(): void;

    // Hook for actions before moving: Castling
    protected beforeMoveHook(_piece: Piece, _from: Position, _to: Position, capturedPiece: Piece | null): Piece | null {
        return capturedPiece;
    }

    // Hook for actions after moving: Pawn promotion, 50 movement rules, etc...
    protected afterMoveHook(_piece: Piece, _from: Position, _to: Position, _capturedPiece: Piece | null, _promotionPiece?: string): void {}

    // Hook for actions after turn: for example saving hashes of the board for the triple repetition rule
    protected postTurnHook(): void {}
}