import { BaseEngine } from './BaseEngine';
import type { Position, PieceColor } from '../../types';
import { Piece, Biangai } from '../pieces/piecesIndex';
import type { GameVariant } from '../variants/GameVariant';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';

export type MakrukCountingType = 'none' | 'board_64' | 'piece_count';

export interface MakrukCountingStatus {
    type: MakrukCountingType;
    isCountingActive: boolean;
    canToggle: boolean;
    currentMoves: number;
    baseLimit: number;
    maxMoves: number;
    remainingMoves: number;
    fleeingColor: PieceColor | null;
    disadvantagedColor: PieceColor | null;
    initiatedBy: PieceColor | null;
}

export class MakrukEngine extends BaseEngine {
    public initialFen = 'rnsmksnr/8/pppppppp/8/8/PPPPPPPP/8/RNSKMSNR w - - 0 1';

    private positionHistory: Map<string, number> = new Map();

    // Counting rules state
    private countingType: 'none' | 'board_64' | 'piece_count' = 'none';
    private countingStartPly: number = 0;
    private countingBaseLimit: number = 64;
    private countingMaxMoves: number = 0;
    private fleeingColor: PieceColor | null = null;
    private totalPlies: number = 0;
    public isCountingActive: boolean = false;
    public countingInitiatedBy: PieceColor | null = null;
    private hasUserDeactivated: boolean = false;

    constructor(variant: GameVariant, options?: {
        hasUserDeactivated?: boolean;
        isCountingActive?: boolean;
        countingType?: MakrukCountingType;
        countingStartPly?: number;
        countingBaseLimit?: number;
        countingMaxMoves?: number;
        countingInitiatedBy?: PieceColor | null;
        fleeingColor?: PieceColor | null;
    }) {
        super(variant, new SingleRoyalCheckStrategy('Khun'));
        if (options) {
            this.variantOptions = options;
            this.restoreCountingState(options);
        }
        this.updatePositionHistory();
    }

    private getBoardSignature(): string {
        return this.board.grid.map(row =>
            row.map(p => p ? `${p.color[0]}${p.name[0]}` : '..').join('')
        ).join('');
    }

    private updatePositionHistory(): void {
        const sig = this.getBoardSignature();
        this.positionHistory.set(sig, (this.positionHistory.get(sig) || 0) + 1);
    }

    /**
     * Determines if counting rules are eligible:
     * 1) When no cowrie (Bia) is in play (for either player), or
     * 2) When a player is reduced to only their king.
     */
    public canStartCounting(): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;
        let whiteCount = 0;
        let blackCount = 0;
        let unpromotedBiaCount = 0;

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p) {
                    if (p.color === 'white') whiteCount++;
                    else if (p.color === 'black') blackCount++;
                    if (p.name === 'Bia') unpromotedBiaCount++;
                }
            }
        }

        // Condition 1: No cowries left in play
        if (unpromotedBiaCount === 0) return true;

        // Condition 2: A player is reduced to only their king
        if ((whiteCount === 1 && blackCount > 1) || (blackCount === 1 && whiteCount > 1)) {
            return true;
        }

        return false;
    }

    /**
     * Returns the disadvantaged player entitled to declare/control counting.
     */
    public getDisadvantagedColor(): PieceColor | null {
        if (!this.canStartCounting()) return null;

        let whitePieces = 0;
        let blackPieces = 0;
        let whiteScore = 0;
        let blackScore = 0;

        const PIECE_VALUES: Record<string, number> = {
            Khun: 0,
            Ruea: 5,
            Khon: 2,
            Ma: 3,
            Met: 1,
            Biangai: 1,
            Bia: 1
        };

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p) {
                    const val = PIECE_VALUES[p.name] ?? 1;
                    if (p.color === 'white') {
                        whitePieces++;
                        whiteScore += val;
                    } else if (p.color === 'black') {
                        blackPieces++;
                        blackScore += val;
                    }
                }
            }
        }

        // Lone King condition
        if (whitePieces === 1 && blackPieces > 1) return 'white';
        if (blackPieces === 1 && whitePieces > 1) return 'black';

        // Material difference
        if (whiteScore < blackScore) return 'white';
        if (blackScore < whiteScore) return 'black';
        if (whitePieces < blackPieces) return 'white';
        if (blackPieces < whitePieces) return 'black';

        return null; // Equal material (either player can claim)
    }

    /**
     * Checks if a player can toggle counting on their turn.
     */
    public canToggleCounting(turn?: PieceColor): boolean {
        if (!this.canStartCounting()) return false;
        const disadvantaged = this.getDisadvantagedColor();
        const activeTurn = turn || this.currentTurn;
        if (disadvantaged === null) return true;
        return activeTurn === disadvantaged;
    }

    public startCounting(byColor?: PieceColor): void {
        this.isCountingActive = true;
        this.hasUserDeactivated = false;
        this.countingStartPly = this.totalPlies;
        this.countingInitiatedBy = byColor || this.getDisadvantagedColor() || this.currentTurn;
        this.evaluateCountingRules(true);
    }

    public stopCounting(): void {
        this.isCountingActive = false;
        this.hasUserDeactivated = true;
    }

    public toggleCounting(byColor?: PieceColor): void {
        if (this.isCountingActive) {
            this.stopCounting();
        } else {
            this.startCounting(byColor);
        }
    }

    /**
     * Calculates the maximum piece-counting limit based on the attacking player's pieces:
     * - If there are two boats left: 8 moves
     * - If there is one boat left: 16 moves
     * - If there are no boats left, but there are two noblemen: 22 moves
     * - If there are no boats or noblemen left, but there are two horses: 32 moves
     * - If there are no boats left, but there is one nobleman: 44 moves
     * - If there are no boats or noblemen left, but there is one horse: 64 moves
     * - If there are no boats, noblemen or horses left, but only seeds: 64 moves
     */
    private calculatePieceCountLimit(strongerColor: PieceColor): number {
        let boats = 0;
        let noblemen = 0;
        let horses = 0;

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === strongerColor) {
                    if (p.name === 'Ruea') boats++;
                    else if (p.name === 'Khon') noblemen++;
                    else if (p.name === 'Ma') horses++;
                }
            }
        }

        if (boats >= 2) return 8;
        if (boats === 1) return 16;
        if (noblemen >= 2) return 22;
        if (noblemen === 0 && horses >= 2) return 32;
        if (noblemen === 1) return 44;
        if (noblemen === 0 && horses === 1) return 64;
        return 64; // No boats, noblemen or horses left, but only seeds
    }

    /**
     * Updates and evaluates the Makruk counting rules.
     * 1) When a player is left with only the King (lone king piece count).
     *    Límite = baseLimit - piezas del jugador con más puntos.
     * 2) When no cowrie (Bia) is in play for either player -> 64 moves.
     */
    private evaluateCountingRules(force: boolean = false): void {
        let whiteCount = 0;
        let blackCount = 0;
        let unpromotedBiaCount = 0;

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p) {
                    if (p.color === 'white') whiteCount++;
                    else if (p.color === 'black') blackCount++;

                    if (p.name === 'Bia') {
                        unpromotedBiaCount++;
                    }
                }
            }
        }

        const isWhiteLone = whiteCount === 1 && blackCount > 1;
        const isBlackLone = blackCount === 1 && whiteCount > 1;

        // Condition 2: When a player is left with only the King
        if (isWhiteLone || isBlackLone) {
            const currentFleeingColor: PieceColor = isWhiteLone ? 'white' : 'black';
            const strongerColor: PieceColor = isWhiteLone ? 'black' : 'white';
            const strongerPiecesCount = isWhiteLone ? blackCount : whiteCount;

            if (this.countingType !== 'piece_count' || this.fleeingColor !== currentFleeingColor || force) {
                this.countingType = 'piece_count';
                this.fleeingColor = currentFleeingColor;
                this.countingStartPly = this.totalPlies;
                this.hasUserDeactivated = false;

                const baseLimit = this.calculatePieceCountLimit(strongerColor);
                this.countingBaseLimit = baseLimit;
                // "A este conteo hay que restarle tantos movimientos como piezas tenga el jugador con mas puntos."
                this.countingMaxMoves = Math.max(0, baseLimit - strongerPiecesCount);
                if (!this.hasUserDeactivated || force) {
                    this.isCountingActive = true;
                    if (!this.countingInitiatedBy) {
                        this.countingInitiatedBy = currentFleeingColor;
                    }
                }
            }
        } else if (unpromotedBiaCount === 0) {
            // Condition 1: When no cowrie is in play for either player -> 64 moves
            if (this.countingType === 'none' || force) {
                this.countingType = 'board_64';
                this.fleeingColor = null;
                this.countingStartPly = this.totalPlies;
                this.countingBaseLimit = 64;
                this.countingMaxMoves = 64;
                if (!this.hasUserDeactivated || force) {
                    this.isCountingActive = true;
                    if (!this.countingInitiatedBy) {
                        this.countingInitiatedBy = this.getDisadvantagedColor();
                    }
                }
            }
        } else {
            this.countingType = 'none';
            this.countingBaseLimit = 64;
            this.isCountingActive = false;
        }
    }

    public getCountingStatus(): MakrukCountingStatus {
        if (this.countingType === 'none') {
            return {
                type: 'none',
                isCountingActive: false,
                canToggle: this.canStartCounting(),
                currentMoves: 0,
                baseLimit: 0,
                maxMoves: 0,
                remainingMoves: 0,
                fleeingColor: null,
                disadvantagedColor: this.getDisadvantagedColor(),
                initiatedBy: null,
            };
        }

        const elapsedPlies = Math.max(0, this.totalPlies - this.countingStartPly);
        const currentMoves = Math.floor(elapsedPlies / 2);
        const remainingMoves = Math.max(0, this.countingMaxMoves - currentMoves);

        return {
            type: this.countingType,
            isCountingActive: this.isCountingActive,
            canToggle: this.canStartCounting(),
            currentMoves,
            baseLimit: this.countingBaseLimit || (this.countingType === 'board_64' ? 64 : this.countingMaxMoves),
            maxMoves: this.countingMaxMoves,
            remainingMoves,
            fleeingColor: this.fleeingColor,
            disadvantagedColor: this.getDisadvantagedColor(),
            initiatedBy: this.countingInitiatedBy,
        };
    }

    /**
     * Generates a valid FEN string for Makruk adhering to Fairy-Stockfish specifications,
     * including piece letters (S for Khon, M for Met/Biangai), active turn, and counting clock.
     */
    public getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < this.board.rows; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (!p) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }
                    let char = '';
                    switch (p.name) {
                        case 'Khun': char = 'k'; break;
                        case 'Met': char = 'm'; break;
                        case 'Khon': char = 's'; break;
                        case 'Ma': char = 'n'; break;
                        case 'Ruea': char = 'r'; break;
                        case 'Bia': char = 'p'; break;
                        case 'Biangai': char = 'm'; break;
                        default: char = 'p'; break;
                    }
                    rowStr += p.color === 'white' ? char.toUpperCase() : char.toLowerCase();
                }
            }

            if (emptyCount > 0) {
                rowStr += emptyCount;
            }
            rows.push(rowStr);
        }

        const placement = rows.join('/');
        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';
        const castling = '-';

        const countingStatus = this.getCountingStatus();
        let countingField = '-';
        let halfmoves = 0;

        if (countingStatus.isCountingActive && countingStatus.type !== 'none') {
            countingField = `${countingStatus.maxMoves * 2}`;
            halfmoves = countingStatus.currentMoves * 2;
        }

        const fullmoves = Math.floor(this.totalPlies / 2) + 1;

        return `${placement} ${activeColor} ${castling} ${countingField} ${halfmoves} ${fullmoves}`;
    }

    updateGameState(): void {
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
        const isTripleRepetition = (this.positionHistory.get(this.getBoardSignature()) || 0) >= 3;

        this.evaluateCountingRules();
        const countingStatus = this.getCountingStatus();
        const isCountingLimitReached = countingStatus.isCountingActive && countingStatus.type !== 'none' && countingStatus.remainingMoves <= 0;

        if (!hasAnyLegalMove) {
            // Checkmate or stalemate (stalemate is a draw in Makruk)
            if (inCheck) {
                // Rule: If the disadvantaged/counting player checkmates the advantaged side
                // and did not stop counting, the game is declared a draw.
                const checkmatingPlayer: PieceColor = this.currentTurn === 'white' ? 'black' : 'white';
                const countingStatus = this.getCountingStatus();
                const countingPlayer = this.fleeingColor || this.countingInitiatedBy || countingStatus.disadvantagedColor;

                if (countingStatus.isCountingActive && countingStatus.type !== 'none' && countingPlayer === checkmatingPlayer) {
                    this.state = 'draw';
                } else {
                    this.state = 'checkmate';
                }
            } else {
                this.state = 'draw';
            }
        } else if (isTripleRepetition || isCountingLimitReached) {
            this.state = 'draw';
        } else {
            this.state = inCheck ? 'check' : 'playing';
        }
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position, _capturedPiece?: Piece | null): void {
        this.totalPlies++;

        // Mandatory promotion: Bia (Cowrie) reaching opponent's 6th rank
        // (y = 2 for White, y = 5 for Black)
        if (piece.name === 'Bia') {
            const isWhitePromotion = piece.color === 'white' && to.y === 2;
            const isBlackPromotion = piece.color === 'black' && to.y === 5;

            if (isWhitePromotion || isBlackPromotion) {
                const biangai = new Biangai(`${piece.id}_promoted`, piece.color, { ...to });
                biangai.hasMoved = true;
                this.board.setPiece(biangai, to.x, to.y);
            }
        }
    }

    protected postTurnHook(): void {
        this.updatePositionHistory();
    }

    public restoreCountingState(options: any): void {
        if (!options) return;
        if (options.hasUserDeactivated !== undefined) this.hasUserDeactivated = options.hasUserDeactivated;
        if (options.isCountingActive !== undefined) this.isCountingActive = options.isCountingActive;
        if (options.countingType !== undefined) this.countingType = options.countingType;
        if (options.countingStartPly !== undefined) this.countingStartPly = options.countingStartPly;
        if (options.countingBaseLimit !== undefined) this.countingBaseLimit = options.countingBaseLimit;
        if (options.countingMaxMoves !== undefined) this.countingMaxMoves = options.countingMaxMoves;
        if (options.countingInitiatedBy !== undefined) this.countingInitiatedBy = options.countingInitiatedBy;
        if (options.fleeingColor !== undefined) this.fleeingColor = options.fleeingColor;
    }

    override restoreCustomState(options: any): void {
        this.restoreCountingState(options);
    }

    override getVariantOptions(): any {
        return {
            hasUserDeactivated: this.hasUserDeactivated,
            isCountingActive: this.isCountingActive,
            countingType: this.countingType,
            countingStartPly: this.countingStartPly,
            countingBaseLimit: this.countingBaseLimit,
            countingMaxMoves: this.countingMaxMoves,
            countingInitiatedBy: this.countingInitiatedBy,
            fleeingColor: this.fleeingColor,
        };
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof MakrukEngine) {
            target.totalPlies = this.totalPlies;
            target.countingType = this.countingType;
            target.countingStartPly = this.countingStartPly;
            target.countingBaseLimit = this.countingBaseLimit;
            target.countingMaxMoves = this.countingMaxMoves;
            target.isCountingActive = this.isCountingActive;
            target.hasUserDeactivated = this.hasUserDeactivated;
            target.countingInitiatedBy = this.countingInitiatedBy;
            target.fleeingColor = this.fleeingColor;
        }
    }
}
