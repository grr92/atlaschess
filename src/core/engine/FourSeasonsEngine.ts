import { BaseEngine } from './BaseEngine';
import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import type { PieceColor, Position, Move, GameState } from '../../types';
import type { IEvaluationStrategy } from '../ai/strategies/EvaluationStrategy';
import { FourSeasonsEvaluationStrategy } from '../ai/strategies/FourSeasonsEvaluationStrategy';
import {
    Piece,
    FourSeasonsGeneral,
    FourSeasonsPawn
} from '../pieces/piecesIndex';

export type FourSeasonsColor = 'green' | 'red' | 'black' | 'white';

export class FourSeasonsEngine extends BaseEngine {
    static readonly TURN_ORDER: FourSeasonsColor[] = ['green', 'red', 'black', 'white'];

    annexedArmies: Record<FourSeasonsColor, FourSeasonsColor[]>;
    capturedPiecesByPlayer: Record<FourSeasonsColor, Piece[]>;
    winnerColor: FourSeasonsColor | null = null;
    useDiceRule: boolean = false;

    constructor(variant: GameVariant) {
        super(variant);
        this.currentTurn = 'green';
        this.annexedArmies = {
            green: ['green'],
            red: ['red'],
            black: ['black'],
            white: ['white']
        };
        this.capturedPiecesByPlayer = {
            green: [],
            red: [],
            black: [],
            white: []
        };
    }

    getEvaluationStrategy(): IEvaluationStrategy {
        return this.evaluationStrategy || new FourSeasonsEvaluationStrategy();
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof FourSeasonsEngine) {
            target.annexedArmies = {
                green: [...this.annexedArmies.green],
                red: [...this.annexedArmies.red],
                black: [...this.annexedArmies.black],
                white: [...this.annexedArmies.white]
            };
            target.capturedPiecesByPlayer = {
                green: [...this.capturedPiecesByPlayer.green],
                red: [...this.capturedPiecesByPlayer.red],
                black: [...this.capturedPiecesByPlayer.black],
                white: [...this.capturedPiecesByPlayer.white]
            };
            target.winnerColor = this.winnerColor;
            target.useDiceRule = this.useDiceRule;
        }
    }

    getControlledColors(color?: PieceColor): FourSeasonsColor[] {
        const c = (color || this.currentTurn) as FourSeasonsColor;
        return this.annexedArmies[c] || [c];
    }

    override getActiveController(color?: PieceColor): PieceColor {
        const targetColor = (color || this.currentTurn) as FourSeasonsColor;
        for (const [controller, controlledList] of Object.entries(this.annexedArmies)) {
            if (controlledList.includes(targetColor)) {
                return controller as PieceColor;
            }
        }
        return targetColor;
    }

    isFriendly(color1: PieceColor, color2: PieceColor): boolean {
        const controller1 = this.getActiveController(color1);
        const controller2 = this.getActiveController(color2);
        return controller1 === controller2;
    }

    override isPieceControllableByCurrentTurn(piece: Piece): boolean {
        const controlled = this.getControlledColors();
        return controlled.includes(piece.color as FourSeasonsColor);
    }

    hasKingAlive(color: PieceColor): boolean {
        return this.board.getAllPieces().some(p => p.name === 'FourSeasonsKing' && p.color === color);
    }

    isKingInCheck(color: PieceColor, board: Board = this.board): boolean {
        const king = board.getAllPieces().find(p => p.name === 'FourSeasonsKing' && p.color === color);
        if (!king) return false;

        const kingPos = king.position;
        const controller = this.getActiveController(color);

        for (const piece of board.getAllPieces()) {
            // Only hostile pieces can deliver check
            if (!this.isFriendly(piece.color, controller)) {
                const possibleMoves = (piece as any).getPossibleMoves(board, undefined, (c1: PieceColor, c2: PieceColor) => this.isFriendly(c1, c2));
                if (possibleMoves.some((m: Position) => m.x === kingPos.x && m.y === kingPos.y)) {
                    return true;
                }
            }
        }

        return false;
    }

    getLegalMoves(target: Piece | Position): Position[] {
        const piece = ('x' in target && 'y' in target && typeof (target as any).getPossibleMoves !== 'function')
            ? this.board.getPieceAt(target.x, target.y)
            : (target as Piece);
        if (!piece) return [];
        if (this.state === 'checkmate' || this.state === 'draw') return [];
        if (!this.isPieceControllableByCurrentTurn(piece)) return [];

        const candidateMoves = (piece as any).getPossibleMoves(this.board, undefined, (c1: PieceColor, c2: PieceColor) => this.isFriendly(c1, c2));
        const activeRoyalColor = this.currentTurn as FourSeasonsColor;

        // If the royal player has no king alive, they have no legal moves
        if (!this.hasKingAlive(activeRoyalColor)) return [];

        const legalMoves: Position[] = [];

        for (const to of candidateMoves) {
            const tempBoard = this.board.clone();
            const movingPiece = tempBoard.getPieceAt(piece.position.x, piece.position.y);
            if (!movingPiece) continue;

            tempBoard.movePiece(piece.position, to);

            // Ensure player's own primary King is not in check after the move
            if (!this.isKingInCheck(activeRoyalColor, tempBoard)) {
                legalMoves.push(to);
            }
        }

        return legalMoves;
    }

    getAllLegalMovesForColor(color: PieceColor): { from: Position; to: Position }[] {
        const controlled = this.getControlledColors(color);
        const moves: { from: Position; to: Position }[] = [];
        const originalTurn = this.currentTurn;
        this.currentTurn = color;
        for (const piece of this.board.getAllPieces()) {
            if (controlled.includes(piece.color as FourSeasonsColor)) {
                const legal = this.getLegalMoves(piece);
                for (const to of legal) {
                    moves.push({ from: piece.position, to });
                }
            }
        }
        this.currentTurn = originalTurn;
        return moves;
    }

    executeMove(from: Position, to: Position, _promotionPiece?: string): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;

        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || !this.isPieceControllableByCurrentTurn(piece)) {
            return false;
        }

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const currentTurnColor = this.currentTurn as FourSeasonsColor;
        const targetPiece = this.board.getPieceAt(to.x, to.y);

        // 1. Move piece
        this.board.movePiece(from, to);
        piece.hasMoved = true;

        // 2. Handle pawn promotion to General
        if (piece instanceof FourSeasonsPawn && piece.isAtPromotionBoundary()) {
            const general = new FourSeasonsGeneral(
                `g_prom_${piece.color}_${to.x}_${to.y}`,
                piece.color,
                to
            );
            general.hasMoved = true;
            this.board.setPiece(general, to.x, to.y);
        }

        // 3. Process capture
        if (targetPiece) {
            this.capturedPiecesByPlayer[currentTurnColor].push(targetPiece);
        }

        // 4. Record move
        const moveRecord: Move = {
            piece,
            from,
            to,
            capturedPiece: targetPiece,
            san: `${piece.name[0]}${String.fromCharCode(97 + from.x)}${8 - from.y}-${String.fromCharCode(97 + to.x)}${8 - to.y}`
        };
        this.history.push(moveRecord);

        // 5. Check and resolve checkmates and stalemates for all opponent players
        this.resolveOpponentStates(currentTurnColor);

        // 6. Update terminal game state
        const newState = this.updateGameState();

        // 7. Rotate turn to next active player
        if (newState !== 'checkmate' && newState !== 'draw') {
            this.rotateTurn();
        }

        return true;
    }

    /**
     * Inspects all opponent players in turn order and eliminates them if mated or stalemated.
     */
    private resolveOpponentStates(actingColor: FourSeasonsColor): void {
        let stateChanged = true;

        while (stateChanged) {
            stateChanged = false;

            for (const color of FourSeasonsEngine.TURN_ORDER) {
                if (color === actingColor) continue;
                if (!this.hasKingAlive(color)) continue;

                const hasLegalMoves = this.hasAnyLegalMove(color);

                if (!hasLegalMoves) {
                    const inCheck = this.isKingInCheck(color);

                    if (inCheck) {
                        // CHECKMATE: Remove King, annex army to the acting player
                        this.removeKing(color);
                        this.annexArmy(actingColor, color);
                        stateChanged = true;
                    } else {
                        // STALEMATE: Remove all pieces belonging to this player
                        this.removeAllPiecesOfColor(color);
                        stateChanged = true;
                    }
                }
            }
        }
    }

    private hasAnyLegalMove(color: FourSeasonsColor): boolean {
        const controlled = this.getControlledColors(color);
        for (const piece of this.board.getAllPieces()) {
            if (controlled.includes(piece.color as FourSeasonsColor)) {
                // Simulate candidate moves
                const candidateMoves = (piece as any).getPossibleMoves(this.board, undefined, (c1: PieceColor, c2: PieceColor) => this.isFriendly(c1, c2));
                for (const to of candidateMoves) {
                    const tempBoard = this.board.clone();
                    tempBoard.movePiece(piece.position, to);
                    if (!this.isKingInCheck(color, tempBoard)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private removeKing(color: FourSeasonsColor): void {
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.name === 'FourSeasonsKing' && p.color === color) {
                    this.board.removePieceAt(x, y);
                }
            }
        }
    }

    private removeAllPiecesOfColor(color: FourSeasonsColor): void {
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === color) {
                    this.board.removePieceAt(x, y);
                }
            }
        }
    }

    private annexArmy(actingColor: FourSeasonsColor, targetColor: FourSeasonsColor): void {
        const targetAnnexed = this.annexedArmies[targetColor] || [targetColor];
        for (const c of targetAnnexed) {
            if (!this.annexedArmies[actingColor].includes(c)) {
                this.annexedArmies[actingColor].push(c);
            }
        }
        this.annexedArmies[targetColor] = [];
    }

    rotateTurn(): void {
        if (this.state === 'checkmate' || this.state === 'draw') return;

        const order = FourSeasonsEngine.TURN_ORDER;
        const currentIdx = order.indexOf(this.currentTurn as FourSeasonsColor);

        for (let i = 1; i <= 4; i++) {
            const nextColor = order[(currentIdx + i) % 4];
            if (this.hasKingAlive(nextColor)) {
                this.currentTurn = nextColor;
                if (!this.hasAnyLegalMove(nextColor)) {
                    if (this.isKingInCheck(nextColor)) {
                        this.removeKing(nextColor);
                        this.annexArmy(order[currentIdx], nextColor);
                    } else {
                        this.removeAllPiecesOfColor(nextColor);
                    }
                    const newState = this.updateGameState();
                    if (newState === 'checkmate' || newState === 'draw') return;
                    continue;
                }
                this.updateCheckStatus();
                return;
            }
        }
    }

    updateCheckStatus(): void {
        if (this.isKingInCheck(this.currentTurn)) {
            this.state = 'check';
        } else {
            this.state = 'playing';
        }
    }

    override updateGameState(): GameState {
        const livingKings = FourSeasonsEngine.TURN_ORDER.filter(c => this.hasKingAlive(c));

        if (livingKings.length === 1) {
            this.state = 'checkmate';
            this.winnerColor = livingKings[0];
        } else if (livingKings.length === 0) {
            this.state = 'draw';
            this.winnerColor = null;
        } else {
            this.updateCheckStatus();
        }
        return this.state;
    }
}
