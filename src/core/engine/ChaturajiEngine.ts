import { BaseEngine } from './BaseEngine';
import { Board } from '../models/Board';
import type { GameVariant } from '../variants/GameVariant';
import type { PieceColor, Position, Move, PieceName, GameInterception, InterceptionDecision } from '../../types';
import type { IEvaluationStrategy } from '../ai/strategies/EvaluationStrategy';
import { ChaturajiEvaluationStrategy } from '../ai/strategies/ChaturajiEvaluationStrategy';
import {
    Piece,
    ChaturajiKing,
    ChaturajiElephant,
    ChaturajiHorse,
    ChaturajiBoat,
    ChaturajiPawn
} from '../pieces/piecesIndex';

export type ChaturajiColor = 'red' | 'green' | 'yellow' | 'blue';

export interface KingRescueChoice {
    capturingColor: ChaturajiColor;
    partnerColor: ChaturajiColor;
}

export class ChaturajiEngine extends BaseEngine {
    stakes: Record<ChaturajiColor, number>;
    capturedPiecesByPlayer: Record<ChaturajiColor, Piece[]>;
    throneVisits: Record<ChaturajiColor, Set<ChaturajiColor>>;
    partnerControlled: Record<ChaturajiColor, ChaturajiColor | null>;
    rescuedKings: Set<string>;
    kingsKilledByPlayerKing: Record<ChaturajiColor, number>;
    kingsKilledOnThrone: Record<ChaturajiColor, number>;
    winnerColor: ChaturajiColor | null = null;
    isDraw: boolean = false;
    useDiceRule: boolean = false;
    subTurn: number = 1;

    pendingKingRescueChoice: KingRescueChoice | null = null;
    pendingKingPlacement: { color: ChaturajiColor } | null = null;

    static readonly INITIAL_THRONES: Record<ChaturajiColor, Position> = {
        red: { x: 7, y: 4 },
        green: { x: 3, y: 7 },
        yellow: { x: 0, y: 3 },
        blue: { x: 4, y: 0 }
    };

    static readonly PARTNER_MAP: Record<ChaturajiColor, ChaturajiColor> = {
        red: 'yellow',
        yellow: 'red',
        green: 'blue',
        blue: 'green'
    };

    static readonly TURN_ORDER: ChaturajiColor[] = ['red', 'green', 'yellow', 'blue'];

    constructor(variant: GameVariant) {
        super(variant);
        this.currentTurn = 'red';
        this.stakes = { red: 0, green: 0, yellow: 0, blue: 0 };
        this.capturedPiecesByPlayer = { red: [], green: [], yellow: [], blue: [] };
        this.throneVisits = {
            red: new Set(),
            green: new Set(),
            yellow: new Set(),
            blue: new Set()
        };
        this.partnerControlled = {
            red: null,
            green: null,
            yellow: null,
            blue: null
        };
        this.rescuedKings = new Set();
        this.kingsKilledByPlayerKing = { red: 0, green: 0, yellow: 0, blue: 0 };
        this.kingsKilledOnThrone = { red: 0, green: 0, yellow: 0, blue: 0 };
    }

    getEvaluationStrategy(): IEvaluationStrategy {
        return this.evaluationStrategy || new ChaturajiEvaluationStrategy();
    }

    // In Chaturaji, no check restriction applies; kings can be taken freely
    isKingInCheck(_color: PieceColor, _board: Board = this.board): boolean {
        return false;
    }

    getLegalMoves(piece: Piece): Position[] {
        if (this.state === 'checkmate' || this.state === 'draw') return [];
        return piece.getPossibleMoves(this.board);
    }

    override getActiveController(color?: PieceColor): PieceColor {
        const c = (color || this.currentTurn) as ChaturajiColor;
        return this.partnerControlled[c] || c;
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof ChaturajiEngine) {
            target.stakes = { ...this.stakes };
            target.capturedPiecesByPlayer = {
                red: [...this.capturedPiecesByPlayer.red],
                green: [...this.capturedPiecesByPlayer.green],
                yellow: [...this.capturedPiecesByPlayer.yellow],
                blue: [...this.capturedPiecesByPlayer.blue]
            };
            target.throneVisits = {
                red: new Set(this.throneVisits.red),
                green: new Set(this.throneVisits.green),
                yellow: new Set(this.throneVisits.yellow),
                blue: new Set(this.throneVisits.blue)
            };
            target.partnerControlled = { ...this.partnerControlled };
            target.rescuedKings = new Set(this.rescuedKings);
            target.kingsKilledByPlayerKing = { ...this.kingsKilledByPlayerKing };
            target.kingsKilledOnThrone = { ...this.kingsKilledOnThrone };
            target.winnerColor = this.winnerColor;
            target.isDraw = this.isDraw;
            target.useDiceRule = this.useDiceRule;
            target.subTurn = this.subTurn;
            target.pendingKingRescueChoice = this.pendingKingRescueChoice ? { ...this.pendingKingRescueChoice } : null;
            target.pendingKingPlacement = this.pendingKingPlacement ? { ...this.pendingKingPlacement } : null;
        }
    }

    override getPostMoveInterception(_lastMove: Move): GameInterception | null {
        if (this.pendingKingRescueChoice) {
            return {
                type: 'KING_RESCUE_CHOICE',
                capturingColor: this.pendingKingRescueChoice.capturingColor,
                partnerColor: this.pendingKingRescueChoice.partnerColor
            };
        }
        if (this.pendingKingPlacement) {
            return {
                type: 'KING_PLACEMENT',
                color: this.pendingKingPlacement.color
            };
        }
        return null;
    }

    override resolveInterception(decision: InterceptionDecision): boolean {
        if (decision.type === 'KING_RESCUE_ACCEPT') {
            this.confirmKingRescue();
            return true;
        }
        if (decision.type === 'KING_RESCUE_DECLINE') {
            this.declineKingRescue();
            return true;
        }
        if (decision.type === 'KING_PLACEMENT') {
            return this.placeRescuedKing(decision.pos);
        }
        return super.resolveInterception(decision);
    }

    // In Chaturaji, if a player has taken control of an ally army, they can control both armies' pieces on their turns
    override isPieceControllableByCurrentTurn(piece: Piece): boolean {
        const activeController = this.getActiveController();
        const pieceController = this.getActiveController(piece.color);
        return activeController === pieceController;
    }

    executeMove(from: Position, to: Position, _promotionPiece?: string): boolean {
        if (this.pendingKingRescueChoice || this.pendingKingPlacement) {
            return false;
        }

        const piece = this.board.getPieceAt(from.x, from.y);
        if (!piece || !this.isPieceControllableByCurrentTurn(piece)) {
            return false;
        }

        const legalMoves = this.getLegalMoves(piece);
        const isLegal = legalMoves.some(m => m.x === to.x && m.y === to.y);
        if (!isLegal) return false;

        const currentTurnColor = this.currentTurn as ChaturajiColor;
        const effectivePlayer = this.partnerControlled[currentTurnColor] || currentTurnColor;
        const targetPiece = this.board.getPieceAt(to.x, to.y);

        // 1. Move piece on board
        this.board.movePiece(from, to);
        piece.hasMoved = true;

        // 2. Process regular capture
        if (targetPiece) {
            this.capturedPiecesByPlayer[effectivePlayer].push(targetPiece);

            if (targetPiece.name === 'ChaturajiKing') {
                const victimColor = targetPiece.color as ChaturajiColor;
                if (piece.name === 'ChaturajiKing') {
                    this.kingsKilledByPlayerKing[effectivePlayer]++;
                }
                const victimThrone = ChaturajiEngine.INITIAL_THRONES[victimColor];
                if (victimThrone && to.x === victimThrone.x && to.y === victimThrone.y) {
                    this.kingsKilledOnThrone[effectivePlayer]++;
                }

                // Check for King Rescue possibility for partner
                const partner = ChaturajiEngine.PARTNER_MAP[effectivePlayer];
                const partnerHasKing = this.hasKingAlive(partner);
                const partnerKingId = `k_${partner[0]}`;
                if (victimColor !== partner && !partnerHasKing && !this.rescuedKings.has(partnerKingId)) {
                    this.pendingKingRescueChoice = {
                        capturingColor: effectivePlayer,
                        partnerColor: partner
                    };
                }
            }
        }

        // 3. Process Boat Triumph (Vrihannauka)
        if (piece.name === 'ChaturajiBoat') {
            this.checkAndExecuteBoatTriumph(to, piece, effectivePlayer);
        }

        // 4. Process Throne (Sinhasana) logic for Kings
        if (piece.name === 'ChaturajiKing') {
            this.processThroneEntry(piece, to, effectivePlayer, targetPiece);
        }

        // 5. Process Pawn Promotion / Frozen Pawn checks
        this.processPawnPromotions();

        // 6. Record Move history (san simplified)
        const moveRecord: Move = {
            piece,
            from,
            to,
            capturedPiece: targetPiece,
            san: `${piece.name[0]}${String.fromCharCode(97 + from.x)}${from.y + 1}-${String.fromCharCode(97 + to.x)}${to.y + 1}`
        };
        this.history.push(moveRecord);

        // 7. Update Game State (Draw / Win evaluation)
        this.updateGameState();

        // 8. Turn progression
        if (!this.pendingKingRescueChoice && !this.pendingKingPlacement) {
            if (this.state === 'checkmate' || this.state === 'draw') {
                this.subTurn = 1;
            } else if (this.useDiceRule) {
                if (this.subTurn === 1) {
                    this.subTurn = 2;
                } else {
                    this.subTurn = 1;
                    this.rotateTurn();
                }
            } else {
                this.rotateTurn();
            }
        }

        return true;
    }

    private checkAndExecuteBoatTriumph(to: Position, _movingBoat: Piece, actingColor: ChaturajiColor): void {
        // A 2x2 square containing (to.x, to.y) can be formed in 4 configurations
        const topLeftCandidates = [
            { x: to.x - 1, y: to.y - 1 },
            { x: to.x, y: to.y - 1 },
            { x: to.x - 1, y: to.y },
            { x: to.x, y: to.y }
        ];

        for (const tl of topLeftCandidates) {
            const cells = [
                { x: tl.x, y: tl.y },
                { x: tl.x + 1, y: tl.y },
                { x: tl.x, y: tl.y + 1 },
                { x: tl.x + 1, y: tl.y + 1 }
            ];

            const isAllInside = cells.every(c => !this.board.isOutOfBounds(c.x, c.y));
            if (!isAllInside) continue;

            const boatPieces = cells.map(c => this.board.getPieceAt(c.x, c.y));
            const allBoats = boatPieces.every(p => p !== null && p.name === 'ChaturajiBoat');

            if (allBoats) {
                // Triumph of the boat: the moving boat captures the other 3 boats!
                for (const cell of cells) {
                    if (cell.x === to.x && cell.y === to.y) continue;
                    const capturedBoat = this.board.getPieceAt(cell.x, cell.y);
                    if (capturedBoat) {
                        this.capturedPiecesByPlayer[actingColor].push(capturedBoat);
                        this.board.removePieceAt(cell.x, cell.y);
                    }
                }
                break;
            }
        }
    }

    private processThroneEntry(_king: Piece, to: Position, actingColor: ChaturajiColor, capturedPiece: Piece | null): void {
        const partnerColor = ChaturajiEngine.PARTNER_MAP[actingColor];
        const partnerThrone = ChaturajiEngine.INITIAL_THRONES[partnerColor];

        // 1. Moving to partner's throne -> takes control of partner's army and awards stakes if capturing partner king
        if (to.x === partnerThrone.x && to.y === partnerThrone.y) {
            this.partnerControlled[partnerColor] = actingColor;
            if (capturedPiece && capturedPiece.name === 'ChaturajiKing' && capturedPiece.color === partnerColor) {
                this.stakes[actingColor] += 2;
            }
        }

        // 2. Moving to opponent's throne -> awards stakes
        for (const color of ChaturajiEngine.TURN_ORDER) {
            if (color === actingColor || color === partnerColor) continue;
            const throne = ChaturajiEngine.INITIAL_THRONES[color];
            if (to.x === throne.x && to.y === throne.y) {
                if (!this.throneVisits[actingColor].has(color)) {
                    this.throneVisits[actingColor].add(color);
                    // Double stake if king captures the opponent king on that throne
                    if (capturedPiece && capturedPiece.name === 'ChaturajiKing' && capturedPiece.color === color) {
                        this.stakes[actingColor] += 2;
                    } else {
                        this.stakes[actingColor] += 1;
                    }
                }
            }
        }
    }

    // Evaluates pawn promotion and checks frozen pawns
    processPawnPromotions(): void {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board.getPieceAt(x, y);
                if (piece instanceof ChaturajiPawn && piece.isAtPromotionBoundary()) {
                    this.tryPromotePawn(piece, x, y);
                }
            }
        }
    }

    private tryPromotePawn(pawn: ChaturajiPawn, x: number, y: number): void {
        const targetPieceName = this.getPromotionPieceNameForSquare(x, y);
        if (!targetPieceName) return;

        const pawnsCount = this.getActivePiecesCount(pawn.color, 'ChaturajiPawn');
        const boatsCount = this.getActivePiecesCount(pawn.color, 'ChaturajiBoat');
        const totalPieces = this.getActivePiecesCount(pawn.color);

        // Rule: 3 or 4 pawns owned -> cannot promote
        if (pawnsCount >= 3) return;

        // Rule: 1 or 2 pawns owned -> can promote to Horse or Elephant
        if (pawnsCount === 1 || pawnsCount === 2) {
            if (targetPieceName === 'ChaturajiHorse' || targetPieceName === 'ChaturajiElephant') {
                this.replacePawnWith(pawn, x, y, targetPieceName);
                return;
            }
        }

        // Rule: 1 pawn and <= 1 boat and no other pieces except king -> can promote to any (including King or Boat)
        if (pawnsCount === 1 && boatsCount <= 1 && totalPieces <= (boatsCount + 2)) {
            this.replacePawnWith(pawn, x, y, targetPieceName);
        }
    }

    private replacePawnWith(pawn: ChaturajiPawn, x: number, y: number, name: PieceName): void {
        let newPiece: Piece;
        const id = `${name[0].toLowerCase()}_prom_${pawn.color}_${x}_${y}`;
        switch (name) {
            case 'ChaturajiBoat':
                newPiece = new ChaturajiBoat(id, pawn.color, { x, y });
                break;
            case 'ChaturajiHorse':
                newPiece = new ChaturajiHorse(id, pawn.color, { x, y });
                break;
            case 'ChaturajiElephant':
                newPiece = new ChaturajiElephant(id, pawn.color, { x, y });
                break;
            case 'ChaturajiKing':
                newPiece = new ChaturajiKing(id, pawn.color, { x, y });
                break;
            default:
                return;
        }
        newPiece.hasMoved = true;
        this.board.setPiece(newPiece, x, y);
    }

    getPromotionPieceNameForSquare(x: number, y: number): PieceName | null {
        // Corners: a1, a8, h1, h8 -> Boat
        if ((x === 0 || x === 7) && (y === 0 || y === 7)) {
            return 'ChaturajiBoat';
        }
        // Knights: a2, a7, b1, b8, g1, g8, h2, h7
        const isKnightSquare = (
            (x === 0 && (y === 1 || y === 6)) ||
            (x === 1 && (y === 0 || y === 7)) ||
            (x === 6 && (y === 0 || y === 7)) ||
            (x === 7 && (y === 1 || y === 6))
        );
        if (isKnightSquare) return 'ChaturajiHorse';

        // Rooks: a3, a6, c1, c8, f1, f8, h3, h6
        const isRookSquare = (
            (x === 0 && (y === 2 || y === 5)) ||
            (x === 2 && (y === 0 || y === 7)) ||
            (x === 5 && (y === 0 || y === 7)) ||
            (x === 7 && (y === 2 || y === 5))
        );
        if (isRookSquare) return 'ChaturajiElephant';

        // Kings: a4, a5, d1, d8, e1, e8, h4, h5
        const isKingSquare = (
            (x === 0 && (y === 3 || y === 4)) ||
            (x === 3 && (y === 0 || y === 7)) ||
            (x === 4 && (y === 0 || y === 7)) ||
            (x === 7 && (y === 3 || y === 4))
        );
        if (isKingSquare) return 'ChaturajiKing';

        return null;
    }

    getActivePiecesCount(color: PieceColor, pieceName?: PieceName): number {
        let count = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.board.getPieceAt(x, y);
                if (piece && piece.color === color) {
                    if (!pieceName || piece.name === pieceName) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    hasKingAlive(color: PieceColor): boolean {
        return this.getActivePiecesCount(color, 'ChaturajiKing') > 0;
    }

    canPlayerAct(color: PieceColor): boolean {
        if (this.hasKingAlive(color)) return true;
        // If army is controlled by partner and partner is alive
        const controller = this.partnerControlled[color as ChaturajiColor];
        if (controller && this.hasKingAlive(controller)) return true;
        return false;
    }

    rotateTurn(): void {
        if (this.state === 'checkmate' || this.state === 'draw') return;

        const order = ChaturajiEngine.TURN_ORDER;
        const currentIdx = order.indexOf(this.currentTurn as ChaturajiColor);

        for (let i = 1; i <= 4; i++) {
            const nextColor = order[(currentIdx + i) % 4];
            if (this.canPlayerAct(nextColor)) {
                this.currentTurn = nextColor;
                return;
            }
        }
    }

    // Modal King Rescue decisions
    confirmKingRescue(): void {
        if (!this.pendingKingRescueChoice) return;
        const partnerColor = this.pendingKingRescueChoice.partnerColor;
        this.rescuedKings.add(`k_${partnerColor[0]}`);
        this.pendingKingRescueChoice = null;
        this.pendingKingPlacement = { color: partnerColor };
    }

    declineKingRescue(): void {
        if (this.history.length > 0) {
            this.history[this.history.length - 1].rescuedKingDeclined = true;
        }
        this.pendingKingRescueChoice = null;
        if (this.state === 'checkmate' || this.state === 'draw') {
            this.subTurn = 1;
        } else if (this.useDiceRule) {
            if (this.subTurn === 1) {
                this.subTurn = 2;
            } else {
                this.subTurn = 1;
                this.rotateTurn();
            }
        } else {
            this.rotateTurn();
        }
    }

    placeRescuedKing(pos: Position): boolean {
        if (!this.pendingKingPlacement) return false;
        if (this.board.isOutOfBounds(pos.x, pos.y)) return false;
        if (this.board.getPieceAt(pos.x, pos.y) !== null) return false;

        const color = this.pendingKingPlacement.color;
        const king = new ChaturajiKing(`k_${color[0]}_rescued`, color, { x: pos.x, y: pos.y });
        king.hasMoved = true;
        this.board.setPiece(king, pos.x, pos.y);

        if (this.history.length > 0) {
            this.history[this.history.length - 1].rescuedKingPlacement = { color, pos };
        }

        this.pendingKingPlacement = null;
        this.updateGameState();

        if (this.state === 'checkmate' || this.state === 'draw') {
            this.subTurn = 1;
        } else if (this.useDiceRule) {
            if (this.subTurn === 1) {
                this.subTurn = 2;
            } else {
                this.subTurn = 1;
                this.rotateTurn();
            }
        } else {
            this.rotateTurn();
        }
        return true;
    }

    /**
     * Handles passing a turn or subturn in Chaturaji.
     * In dice mode, passTurn() on subturn 1 advances to subturn 2 (rolling second die for same player).
     * passTurn() on subturn 2 ends the full turn and rotates to the next player.
     */
    override passTurn(): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;
        if (this.pendingKingRescueChoice || this.pendingKingPlacement) return false;

        const passRecord: Move = {
            piece: null as any,
            from: { x: -1, y: -1 },
            to: { x: -1, y: -1 },
            san: 'pass',
            isPass: true
        };
        this.history.push(passRecord);

        if (!this.useDiceRule || this.subTurn === 2) {
            this.subTurn = 1;
            this.rotateTurn();
        } else {
            this.subTurn = 2;
        }
        this.updateGameState();
        return true;
    }

    updateGameState(): void {
        if (this.state === 'checkmate' || this.state === 'draw') return;
        if (this.pendingKingRescueChoice || this.pendingKingPlacement) return;

        // 1. Bare King Draw condition: if any player is reduced to only their King
        for (const color of ChaturajiEngine.TURN_ORDER) {
            const total = this.getActivePiecesCount(color);
            const kings = this.getActivePiecesCount(color, 'ChaturajiKing');
            if (total === 1 && kings === 1) {
                this.state = 'draw';
                this.isDraw = true;
                const match = this.getMatchWinner();
                this.winnerColor = match.winner;
                return;
            }
        }

        // 2. Count living kings across all players
        const livingKingColors = ChaturajiEngine.TURN_ORDER.filter(c => this.hasKingAlive(c));

        // Case A: Exactly 1 king left on the board
        if (livingKingColors.length === 1) {
            const survivor = livingKingColors[0];
            this.state = 'checkmate';

            let stakesAwarded = 1;
            if (this.kingsKilledByPlayerKing[survivor] === 3) {
                stakesAwarded = 2; // Double stake if player's king killed all 3 kings
            }
            if (this.kingsKilledOnThrone[survivor] === 3) {
                stakesAwarded = 4; // Fourfold stake if killed on thrones
            }
            this.stakes[survivor] += stakesAwarded;

            const match = this.getMatchWinner();
            this.winnerColor = match.winner || survivor;
            return;
        }

        // Case B: 2 kings left, and one player controls their partner's army
        if (livingKingColors.length === 2) {
            const [c1, c2] = livingKingColors;
            if (ChaturajiEngine.PARTNER_MAP[c1] === c2) {
                // Check if c1 controls c2 or c2 controls c1
                if (this.partnerControlled[c2] === c1) {
                    this.state = 'checkmate';
                    this.stakes[c1] += 1;
                    const match = this.getMatchWinner();
                    this.winnerColor = match.winner || c1;
                    return;
                } else if (this.partnerControlled[c1] === c2) {
                    this.state = 'checkmate';
                    this.stakes[c2] += 1;
                    const match = this.getMatchWinner();
                    this.winnerColor = match.winner || c2;
                    return;
                }
            }
        }

        // Case C: 0 kings left (rare draw)
        if (livingKingColors.length === 0) {
            this.state = 'draw';
            this.isDraw = true;
            const match = this.getMatchWinner();
            this.winnerColor = match.winner;
        }
    }

    getMatchWinner(): { winner: ChaturajiColor | null; maxStakes: number; isTie: boolean; tiedWinners: ChaturajiColor[] } {
        let maxStakes = -1;
        for (const color of ChaturajiEngine.TURN_ORDER) {
            const s = this.stakes[color] || 0;
            if (s > maxStakes) maxStakes = s;
        }

        if (maxStakes <= 0) {
            return { winner: null, maxStakes: 0, isTie: true, tiedWinners: [] };
        }

        const tiedWinners = ChaturajiEngine.TURN_ORDER.filter(c => (this.stakes[c] || 0) === maxStakes);
        if (tiedWinners.length === 1) {
            return { winner: tiedWinners[0], maxStakes, isTie: false, tiedWinners };
        }
        return { winner: null, maxStakes, isTie: true, tiedWinners };
    }
}
