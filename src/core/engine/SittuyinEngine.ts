import { BaseEngine, type ContextAction } from './BaseEngine';
import type { Position, PieceColor, Move } from '../../types';
import { Piece, Sitke, Ne } from '../pieces/piecesIndex';
import type { GameVariant } from '../variants/GameVariant';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import {
    SITTUYIN_INITIAL_POOL,
    isSquareValidForSittuyinDeploy,
    getSittuyinPresets,
    createSittuyinPiece,
    type SittuyinPieceName
} from '../variants/sittuyin/sittuyinSetup';

export type SittuyinDeployStage = 'red' | 'transition' | 'black' | 'completed';

export interface SittuyinCountingStatus {
    isActive: boolean;
    loneKingColor: PieceColor | null;
    targetMoves: number;
    elapsedMoves: number;
    remainingMoves: number;
}

export interface SittuyinEngineOptions {
    halfMoveClock?: number;
    totalPlies?: number;
    countingActive?: boolean;
    loneKingColor?: PieceColor | null;
    countingTargetMoves?: number;
    countingStartPly?: number;
    deployStage?: SittuyinDeployStage;
    deployPool?: Record<'red' | 'black', SittuyinPieceName[]>;
    isRedHiddenInDeployment?: boolean;
    isBlackHiddenInDeployment?: boolean;
    deploy?: boolean;
}

export class SittuyinEngine extends BaseEngine {
    private halfMoveClock: number = 0;
    private totalPlies: number = 0;
    private positionHistory: Map<string, number> = new Map();

    // Counting rule state
    private countingActive: boolean = false;
    private loneKingColor: PieceColor | null = null;
    private countingTargetMoves: number = 0;
    private countingStartPly: number = 0;

    // Sit-tee (deployment phase) state
    public deployStage: SittuyinDeployStage = 'completed';
    public deployPool: Record<'red' | 'black', SittuyinPieceName[]> = {
        red: [...SITTUYIN_INITIAL_POOL],
        black: [...SITTUYIN_INITIAL_POOL]
    };
    public isRedHiddenInDeployment: boolean = false;
    public isBlackHiddenInDeployment: boolean = false;
    public selectedDeployPiece: SittuyinPieceName | null = null;

    constructor(variant: GameVariant, options?: SittuyinEngineOptions) {
        super(variant, new SingleRoyalCheckStrategy('Mingyi'));
        this.currentTurn = 'red';

        if (options) {
            this.restoreCustomState(options);
            if (options.deploy && options.deployStage === undefined) {
                this.startDeployment();
            }
        }

        this.updatePositionHistory();
    }

    /**
     * Starts the interactive Sit-tee troop deployment phase.
     * Clears all pieces except pawns.
     */
    public startDeployment(): void {
        this.board = this.variant.setupBoard(true);
        this.deployPool = {
            red: [...SITTUYIN_INITIAL_POOL],
            black: [...SITTUYIN_INITIAL_POOL]
        };
        this.deployStage = 'red';
        this.isRedHiddenInDeployment = false;
        this.isBlackHiddenInDeployment = false;
        this.currentTurn = 'red';
        this.state = 'playing';
    }

    public isDeploying(): boolean {
        return this.deployStage !== 'completed';
    }

    public setSelectedDeployPiece(piece: SittuyinPieceName | null): void {
        this.selectedDeployPiece = piece;
    }

    public isPieceHiddenInDeployment(piece: Piece): boolean {
        if (this.deployStage === 'completed') return false;
        if (piece.name === 'Ne') return false; // Pawns are always visible
        if (piece.color === 'red' && this.isRedHiddenInDeployment) return true;
        if (piece.color === 'black' && this.isBlackHiddenInDeployment) return true;
        return false;
    }

    override isPieceHidden(piece: Piece): boolean {
        return this.isPieceHiddenInDeployment(piece);
    }

    override getPlacementTargets(): Position[] {
        if (!this.isDeploying() || !this.selectedDeployPiece) return [];
        const targets: Position[] = [];
        const color = this.deployStage as PieceColor;
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                if (this.canDeployPiece(color, this.selectedDeployPiece, { x, y })) {
                    targets.push({ x, y });
                }
            }
        }
        return targets;
    }

    override isSquareRemovable(pos: Position): boolean {
        if (!this.isDeploying()) return false;
        const piece = this.board.getPieceAt(pos.x, pos.y);
        if (!piece || this.isPieceHiddenInDeployment(piece)) return false;
        return piece.color === this.deployStage && piece.name !== 'Ne';
    }

    public canDeployPiece(color: PieceColor, pieceName: SittuyinPieceName, pos: Position): boolean {
        if (!this.isDeploying()) return false;
        if (this.deployStage !== color) return false;
        if (!this.deployPool[color as 'red' | 'black'].includes(pieceName)) return false;
        return isSquareValidForSittuyinDeploy(color, pieceName, pos, this.board);
    }

    public deployPiece(color: PieceColor, pieceName: SittuyinPieceName, pos: Position): boolean {
        if (!this.canDeployPiece(color, pieceName, pos)) return false;

        const pool = this.deployPool[color as 'red' | 'black'];
        const idx = pool.indexOf(pieceName);
        if (idx === -1) return false;

        pool.splice(idx, 1);
        const piece = createSittuyinPiece(pieceName, color, pos, 8 - pool.length);
        this.board.setPiece(piece, pos.x, pos.y);
        return true;
    }

    public removeDeployedPiece(pos: Position): boolean {
        if (!this.isDeploying()) return false;
        const piece = this.board.getPieceAt(pos.x, pos.y);
        if (!piece || piece.name === 'Ne') return false;

        // Can only remove piece belonging to currently deploying player
        if (piece.color !== this.deployStage) return false;

        const pieceName = piece.name as SittuyinPieceName;
        this.board.removePieceAt(pos.x, pos.y);
        this.deployPool[piece.color as 'red' | 'black'].push(pieceName);
        return true;
    }

    public resetPlayerDeployment(color: PieceColor): void {
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const piece = this.board.getPieceAt(x, y);
                if (piece && piece.color === color && piece.name !== 'Ne') {
                    this.board.removePieceAt(x, y);
                }
            }
        }
        this.deployPool[color as 'red' | 'black'] = [...SITTUYIN_INITIAL_POOL];
    }

    public applyDeployPreset(color: PieceColor, presetId?: string): void {
        this.resetPlayerDeployment(color);
        const presets = getSittuyinPresets(color);
        const preset = presets.find(p => p.id === presetId) || presets[0];

        for (let i = 0; i < preset.pieces.length; i++) {
            const spec = preset.pieces[i];
            const piece = createSittuyinPiece(spec.name, color, spec.pos, i);
            this.board.setPiece(piece, spec.pos.x, spec.pos.y);
        }
        this.deployPool[color as 'red' | 'black'] = [];
    }

    public confirmDeployment(color: PieceColor, isPvAi: boolean = false): boolean {
        const pool = this.deployPool[color as 'red' | 'black'];
        if (pool.length > 0) return false; // Must place all 8 pieces

        if (isPvAi) {
            // Human player confirmed. Reveal everything and start game!
            this.isRedHiddenInDeployment = false;
            this.isBlackHiddenInDeployment = false;
            this.deployStage = 'completed';
            this.currentTurn = 'red';
            this.updatePositionHistory();
            this.updateGameState();
            return true;
        }

        // PvP Mode
        if (color === 'red') {
            this.isRedHiddenInDeployment = true;
            this.deployStage = 'transition';
            return true;
        } else if (color === 'black') {
            this.isRedHiddenInDeployment = false;
            this.deployStage = 'completed';
            this.currentTurn = 'red';
            this.updatePositionHistory();
            this.updateGameState();
            return true;
        }

        return false;
    }

    public startBlackDeploymentInPvP(): void {
        if (this.deployStage === 'transition') {
            this.deployStage = 'black';
        }
    }

    override getLegalMoves(piece: Piece): Position[] {
        if (this.isDeploying()) return [];
        return super.getLegalMoves(piece);
    }

    override executeMove(from: Position, to: Position): boolean {
        if (this.isDeploying()) return false;
        return super.executeMove(from, to);
    }

    override rotateTurn(): void {
        this.currentTurn = this.currentTurn === 'red' ? 'black' : 'red';
    }

    private getBoardSignature(): string {
        return this.board.grid.map(row =>
            row.map(p => p ? `${p.color[0]}${p.name[0]}` : '..').join('')
        ).join('') + `_${this.currentTurn}`;
    }

    private updatePositionHistory(): void {
        const sig = this.getBoardSignature();
        this.positionHistory.set(sig, (this.positionHistory.get(sig) || 0) + 1);
    }

    /**
     * Checks if a square is on or has crossed the promotion diagonal line (Sit-ke-myin)
     * in the opponent's half of the board.
     * Board is 8x8 (x, y in 0..7).
     * For Red (advances towards y=0):
     *   On each column x, the diagonal in the enemy half is at y = Math.min(x, 7 - x).
     *   A square is on or has crossed the diagonal if 0 <= y <= Math.min(x, 7 - x).
     * For Black (advances towards y=7):
     *   On each column x, the diagonal in the enemy half is at y = 7 - Math.min(x, 7 - x).
     *   A square is on or has crossed the diagonal if 7 >= y >= (7 - Math.min(x, 7 - x)).
     */
    public isPromotionSquare(pos: Position, color: PieceColor): boolean {
        if (pos.x < 0 || pos.x > 7 || pos.y < 0 || pos.y > 7) return false;

        if (color === 'red') {
            return pos.y >= 0 && pos.y <= Math.min(pos.x, 7 - pos.x);
        } else if (color === 'black') {
            return pos.y <= 7 && pos.y >= (7 - Math.min(pos.x, 7 - pos.x));
        }
        return false;
    }

    /**
     * Checks if the player currently has an active General (Sitke) on the board.
     */
    public hasActiveGeneral(color: PieceColor): boolean {
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.name === 'Sitke' && p.color === color) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Option A: Checks if a pawn at `pos` is eligible for deferred promotion in place.
     */
    public canPromoteDeferred(pos: Position): boolean {
        if (this.isDeploying()) return false;
        if (this.state === 'checkmate' || this.state === 'draw') return false;

        const piece = this.board.getPieceAt(pos.x, pos.y);
        if (!piece || piece.name !== 'Ne' || piece.color !== this.currentTurn) {
            return false;
        }

        const ne = piece as Ne;
        if (ne.hasLostPromotion) {
            return false;
        }

        // Must be in an opponent promotion diagonal square
        if (!this.isPromotionSquare(pos, piece.color)) {
            return false;
        }

        // Must NOT have an active General on the board
        if (this.hasActiveGeneral(piece.color)) {
            return false;
        }

        // Check if promoting in place leaves the King in check
        const originalPiece = piece;
        const testSitke = new Sitke(`${piece.id}_promoted_test`, piece.color, { ...pos });
        this.board.setPiece(testSitke, pos.x, pos.y);
        const leavesKingInCheck = this.isKingInCheck(this.currentTurn);
        this.board.setPiece(originalPiece, pos.x, pos.y);

        return !leavesKingInCheck;
    }

    /**
     * Executes deferred promotion in place (spends the player's turn).
     */
    public promotePawnInPlace(pos: Position): boolean {
        if (!this.canPromoteDeferred(pos)) {
            return false;
        }

        const pawn = this.board.getPieceAt(pos.x, pos.y);
        if (!pawn) return false;

        const sitke = new Sitke(`${pawn.id}_promoted`, pawn.color, { ...pos });
        sitke.hasMoved = true;
        this.board.setPiece(sitke, pos.x, pos.y);

        this.halfMoveClock = 0;
        this.totalPlies++;

        const fileChar = String.fromCharCode(97 + pos.x);
        const rankNum = this.board.rows - pos.y;
        const san = `${fileChar}${rankNum}=Sitke`;

        const moveRecord: Move = {
            piece: sitke,
            from: { ...pos },
            to: { ...pos },
            capturedPiece: null,
            san
        };
        this.history.push(moveRecord);

        this.rotateTurn();
        this.postTurnHook();
        this.updateGameState();

        return true;
    }

    override getContextActions(pos: Position): ContextAction[] {
        if (this.canPromoteDeferred(pos)) {
            return [{
                id: 'promote_general',
                labelKey: 'promoteToGeneral',
                icon: '👑',
                colorScheme: 'amber'
            }];
        }
        return [];
    }

    override executeContextAction(actionId: string, pos: Position): boolean {
        if (actionId === 'promote_general' || actionId === 'default') {
            return this.promotePawnInPlace(pos);
        }
        return false;
    }

    public getCountingStatus(): SittuyinCountingStatus {
        const elapsedMoves = this.countingActive
            ? Math.floor(Math.max(0, this.totalPlies - this.countingStartPly) / 2)
            : 0;
        const remainingMoves = this.countingActive
            ? Math.max(0, this.countingTargetMoves - elapsedMoves)
            : 0;

        return {
            isActive: this.countingActive,
            loneKingColor: this.loneKingColor,
            targetMoves: this.countingTargetMoves,
            elapsedMoves,
            remainingMoves
        };
    }

    private getArmyPieces(): { redPieces: Piece[]; blackPieces: Piece[] } {
        const redPieces: Piece[] = [];
        const blackPieces: Piece[] = [];

        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p) {
                    if (p.color === 'red') redPieces.push(p);
                    else if (p.color === 'black') blackPieces.push(p);
                }
            }
        }

        return { redPieces, blackPieces };
    }

    private evaluateCountingRule(): void {
        if (this.state === 'checkmate' || this.state === 'draw') return;

        const { redPieces, blackPieces } = this.getArmyPieces();

        const isRedLoneKing = redPieces.length === 1 && blackPieces.length > 1;
        const isBlackLoneKing = blackPieces.length === 1 && redPieces.length > 1;

        if (isRedLoneKing || isBlackLoneKing) {
            const currentLoneColor: PieceColor = isRedLoneKing ? 'red' : 'black';
            const attackingArmy = isRedLoneKing ? blackPieces : redPieces;

            if (!this.countingActive || this.loneKingColor !== currentLoneColor) {
                // Determine target moves based on attacker's pieces
                const hasRook = attackingArmy.some(p => p.name === 'Yahhta');
                const hasElephant = attackingArmy.some(p => p.name === 'Sin');
                const hasKnight = attackingArmy.some(p => p.name === 'Myin');

                let target = 64;
                if (hasRook) {
                    target = 16;
                } else if (hasElephant) {
                    target = 44;
                } else if (hasKnight) {
                    target = 64;
                }

                this.countingActive = true;
                this.loneKingColor = currentLoneColor;
                this.countingTargetMoves = target;
                this.countingStartPly = this.totalPlies;
            }
        } else if (!isRedLoneKing && !isBlackLoneKing) {
            this.countingActive = false;
            this.loneKingColor = null;
            this.countingTargetMoves = 0;
        }
    }

    private isDeadPosition(): boolean {
        const { redPieces, blackPieces } = this.getArmyPieces();

        const redNames = redPieces.map(p => p.name);
        const blackNames = blackPieces.map(p => p.name);

        // If any pawns exist, checkmate is still potentially possible via promotion
        if (redNames.includes('Ne') || blackNames.includes('Ne')) {
            return false;
        }

        // King vs King
        if (redPieces.length === 1 && blackPieces.length === 1) {
            return true;
        }

        // King + (Sitke or Sin or Myin) vs King
        if (
            (redPieces.length === 1 && blackPieces.length === 2 && ['Sitke', 'Sin', 'Myin'].includes(blackNames.find(n => n !== 'Mingyi') || '')) ||
            (blackPieces.length === 1 && redPieces.length === 2 && ['Sitke', 'Sin', 'Myin'].includes(redNames.find(n => n !== 'Mingyi') || ''))
        ) {
            return true;
        }

        return false;
    }

    updateGameState(): void {
        if (this.isDeploying()) {
            this.state = 'playing';
            return;
        }

        let hasAnyLegalMove = false;
        for (let y = 0; y < this.board.rows; y++) {
            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (p && p.color === this.currentTurn) {
                    if (this.getLegalMoves(p).length > 0) {
                        hasAnyLegalMove = true;
                        break;
                    }
                    if (this.canPromoteDeferred({ x, y })) {
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
        const isDead = this.isDeadPosition();

        this.evaluateCountingRule();
        const countingStatus = this.getCountingStatus();
        const isCountingLimitReached = countingStatus.isActive && countingStatus.remainingMoves <= 0;

        if (!hasAnyLegalMove) {
            // Stalemate or Checkmate (Stalemate is a draw in Sittuyin)
            this.state = inCheck ? 'checkmate' : 'draw';
        } else if (isFiftyMoveRule || isTripleRepetition || isDead || isCountingLimitReached) {
            this.state = 'draw';
        } else {
            this.state = inCheck ? 'check' : 'playing';
        }
    }

    protected afterMoveHook(piece: Piece, from: Position, to: Position, capturedPiece?: Piece | null): void {
        this.totalPlies++;

        // 50-move rule clock
        if (piece.name === 'Ne' || (capturedPiece !== null && capturedPiece !== undefined)) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }

        // Promotion logic:
        // A pawn only promotes upon reaching or crossing the promotion line from outside the promotion zone.
        // If it was already in the promotion zone before this move (wasInPromotionZone), moving it further
        // does not promote it, and forfeits future promotion opportunities.
        if (piece.name === 'Ne') {
            const wasInPromotionZone = this.isPromotionSquare(from, piece.color);
            const isInPromotionZone = this.isPromotionSquare(to, piece.color);

            if (wasInPromotionZone) {
                (piece as Ne).hasLostPromotion = true;
            } else if (isInPromotionZone) {
                if (!this.hasActiveGeneral(piece.color)) {
                    const sitke = new Sitke(`${piece.id}_promoted`, piece.color, { ...to });
                    sitke.hasMoved = true;
                    this.board.setPiece(sitke, to.x, to.y);
                }
            }
        }
    }

    protected postTurnHook(): void {
        this.updatePositionHistory();
    }

    public override restoreCustomState(options?: SittuyinEngineOptions | null): void {
        if (!options) return;
        if (options.halfMoveClock !== undefined) this.halfMoveClock = options.halfMoveClock;
        if (options.totalPlies !== undefined) this.totalPlies = options.totalPlies;
        if (options.countingActive !== undefined) this.countingActive = options.countingActive;
        if (options.loneKingColor !== undefined) this.loneKingColor = options.loneKingColor;
        if (options.countingTargetMoves !== undefined) this.countingTargetMoves = options.countingTargetMoves;
        if (options.countingStartPly !== undefined) this.countingStartPly = options.countingStartPly;
        if (options.deployStage !== undefined) {
            this.deployStage = options.deployStage;
        } else if (this.history.length > 0) {
            this.deployStage = 'completed';
        }
        if (options.deployPool !== undefined) {
            this.deployPool = {
                red: [...options.deployPool.red],
                black: [...options.deployPool.black]
            };
        }
        if (options.isRedHiddenInDeployment !== undefined) this.isRedHiddenInDeployment = options.isRedHiddenInDeployment;
        if (options.isBlackHiddenInDeployment !== undefined) this.isBlackHiddenInDeployment = options.isBlackHiddenInDeployment;
    }

    /**
     * Backward-compatible alias for restoring custom state (counting & deployment).
     */
    public restoreCountingState(options?: SittuyinEngineOptions | any): void {
        this.restoreCustomState(options);
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof SittuyinEngine) {
            target.halfMoveClock = this.halfMoveClock;
            target.totalPlies = this.totalPlies;
            target.countingActive = this.countingActive;
            target.loneKingColor = this.loneKingColor;
            target.countingTargetMoves = this.countingTargetMoves;
            target.countingStartPly = this.countingStartPly;
            target.positionHistory = new Map(this.positionHistory);
            target.deployStage = this.deployStage;
            target.deployPool = {
                red: [...this.deployPool.red],
                black: [...this.deployPool.black]
            };
            target.isRedHiddenInDeployment = this.isRedHiddenInDeployment;
            target.isBlackHiddenInDeployment = this.isBlackHiddenInDeployment;
            target.selectedDeployPiece = this.selectedDeployPiece;
        }
    }

    override getVariantOptions(): SittuyinEngineOptions {
        return {
            halfMoveClock: this.halfMoveClock,
            totalPlies: this.totalPlies,
            countingActive: this.countingActive,
            loneKingColor: this.loneKingColor,
            countingTargetMoves: this.countingTargetMoves,
            countingStartPly: this.countingStartPly,
            deployStage: this.deployStage,
            deployPool: {
                red: [...this.deployPool.red],
                black: [...this.deployPool.black]
            },
            isRedHiddenInDeployment: this.isRedHiddenInDeployment,
            isBlackHiddenInDeployment: this.isBlackHiddenInDeployment
        };
    }

    override getResetOptions(): SittuyinEngineOptions {
        return { deploy: true };
    }

    override getCustomStatus(): string | null {
        return this.isDeploying() ? 'Sit-tee' : null;
    }

    override getActiveController(color?: PieceColor): PieceColor {
        if (color) return color;
        if (this.isDeploying()) {
            return this.deployStage === 'black' ? 'black' : 'red';
        }
        return this.currentTurn;
    }

    /**
     * Exports the current board position as a Fairy-Stockfish compatible Sittuyin FEN.
     * Format: <8_ranks_board>[] <turn: w|b> - - <halfmove> <fullmove>
     */
    public getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < this.board.rows; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < this.board.cols; x++) {
                const piece = this.board.getPieceAt(x, y);
                if (!piece) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }

                    // Map Sittuyin piece to Fairy-Stockfish letter:
                    // Mingyi -> K, Sitke -> F, Sin -> S, Myin -> N, Yahhta -> R, Ne -> P
                    let char = 'P';
                    switch (piece.name) {
                        case 'Mingyi': char = 'K'; break;
                        case 'Sitke':  char = 'F'; break;
                        case 'Sin':    char = 'S'; break;
                        case 'Myin':   char = 'N'; break;
                        case 'Yahhta': char = 'R'; break;
                        case 'Ne':     char = 'P'; break;
                    }

                    rowStr += piece.color === 'red' ? char.toUpperCase() : char.toLowerCase();
                }
            }

            if (emptyCount > 0) {
                rowStr += emptyCount;
            }
            rows.push(rowStr);
        }

        const boardPart = rows.join('/');
        const pocketPart = '[]';
        const turnChar = this.currentTurn === 'red' ? 'w' : 'b';
        const halfMoves = this.halfMoveClock;
        const fullMoves = Math.floor(this.totalPlies / 2) + 1;

        return `${boardPart}${pocketPart} ${turnChar} - - ${halfMoves} ${fullMoves}`;
    }
}
