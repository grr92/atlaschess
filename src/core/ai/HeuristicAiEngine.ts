import type { Position, PieceColor } from '../../types';
import type { BaseEngine } from '../engine/BaseEngine';
import type { Piece } from '../pieces/Piece';
import { TamerlaneEngine } from '../engine/TamerlaneEngine';
import { TamerlanePawn } from '../pieces/tamerlane/TamerlanePawn';

export interface AiMoveResult {
    from: Position;
    to: Position;
    promotionPiece?: string;
    score: number;
}

const PIECE_VALUES: Record<string, number> = {
    // Classic
    Pawn: 100,
    Knight: 320,
    Bishop: 330,
    Rook: 500,
    Queen: 900,
    King: 20000,

    // Chaturanga & Shatranj
    Padati: 100,
    Sarbaz: 100,
    Gaja: 220,
    Pil: 220,
    Mantri: 250,
    Ferz: 250,
    Asva: 320,
    Asb: 320,
    Ratha: 500,
    Rukh: 500,
    Raja: 20000,
    Shah: 20000,

    // Tamerlane
    TamerlanePawn: 120,
    Wazir: 220,
    Dabbaba: 280,
    Jamal: 350,
    Talia: 400,
    Zurafa: 600,
    Shahzada: 900,
    AdventitiousShah: 900
};

export class HeuristicAiEngine {
    /**
     * Evaluates a piece's base value.
     */
    private static getPieceValue(piece: Piece): number {
        return PIECE_VALUES[piece.name] || 100;
    }

    /**
     * Accurately clones an engine instance and its current board configuration.
     */
    public static cloneEngineState(engine: BaseEngine): BaseEngine {
        const freshEngine = new (engine.constructor as new (v: typeof engine.variant) => BaseEngine)(engine.variant);

        // Clear default grid
        for (let y = 0; y < freshEngine.board.rows; y++) {
            for (let x = 0; x < freshEngine.board.cols; x++) {
                freshEngine.board.grid[y][x] = null;
            }
        }

        // Copy current pieces using polymorphic cloning
        for (let y = 0; y < engine.board.rows; y++) {
            for (let x = 0; x < engine.board.cols; x++) {
                const p = engine.board.getPieceAt(x, y);
                if (p) {
                    freshEngine.board.setPiece(p.clone(), x, y);
                }
            }
        }

        freshEngine.currentTurn = engine.currentTurn;
        freshEngine.state = engine.state;

        if (engine instanceof TamerlaneEngine && freshEngine instanceof TamerlaneEngine) {
            freshEngine.whiteCitadelExchangeUsed = engine.whiteCitadelExchangeUsed;
            freshEngine.blackCitadelExchangeUsed = engine.blackCitadelExchangeUsed;
        }

        return freshEngine;
    }

    /**
     * Evaluates the full board position from the perspective of the given color.
     */
    public static evaluateBoard(engine: BaseEngine, perspectiveColor: PieceColor): number {
        let whiteScore = 0;
        let blackScore = 0;

        let whiteBaseMaterial = 0;
        let blackBaseMaterial = 0;

        const board = engine.board;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (!piece) continue;

                let value = this.getPieceValue(piece);

                if (piece.color === 'white') whiteBaseMaterial += value;
                else blackBaseMaterial += value;

                // --- Tamerlane Pawn Specific Evaluation ---
                if (piece instanceof TamerlanePawn) {
                    const promoRank = piece.color === 'white' ? 0 : (board.rows - 1);
                    const distToPromo = Math.abs(promoRank - y);

                    if (piece.pawnType === 'pawn_of_pawns') {
                        if (piece.promotionStage === 0) {
                            // Stage 0: Advancing towards first promotion
                            value = 160 + (board.rows - 1 - distToPromo) * 45;
                            if (distToPromo === 0) value += 300;
                        } else if (piece.isRestingOnLastRank) {
                            // Stage 1: Resting on last rank waiting to fork or relocate
                            value = 450;
                        } else if (piece.promotionStage === 2) {
                            // Stage 2: Second journey towards Adventitious King!
                            value = 550 + (board.rows - 1 - distToPromo) * 85;
                            if (distToPromo === 0) value += 1500; // Crowned Adventitious Shah!
                        }
                    } else if (piece.pawnType === 'pawn_of_king') {
                        // Pawn of King -> Promotes to Shahzada (Prince)
                        value = 260 + (board.rows - 1 - distToPromo) * 55;
                        if (distToPromo === 0) value += 900; // Crowned Shahzada!
                    } else {
                        // Other standard tamerlane pawns
                        value = 120 + (board.rows - 1 - distToPromo) * 20;
                    }
                } else if (piece.name.includes('Pawn') || piece.name === 'Padati' || piece.name === 'Sarbaz') {
                    // Standard pawns
                    const advance = piece.color === 'white' ? (board.rows - 1 - y) : y;
                    value += advance * 15;
                }

                // --- Adventitious Shah in Citadel (Invulnerability) ---
                if (piece.name === 'AdventitiousShah') {
                    const isWhiteCitadel = piece.color === 'white' && x === 12 && y === 8;
                    const isBlackCitadel = piece.color === 'black' && x === 0 && y === 1;
                    if (isWhiteCitadel || isBlackCitadel) {
                        // Completely invincible in own citadel
                        value += 2500;
                    } else {
                        // Distance to own citadel (guide it towards own citadel for safety)
                        const ownCitadelX = piece.color === 'white' ? 12 : 0;
                        const ownCitadelY = piece.color === 'white' ? 8 : 1;
                        const distToOwnCitadel = Math.abs(x - ownCitadelX) + Math.abs(y - ownCitadelY);
                        value += Math.max(0, 400 - distToOwnCitadel * 35);
                    }
                }

                // --- Shah positioning & Citadel Infiltration ---
                if (piece.name === 'Shah') {
                    const oppCitadelX = piece.color === 'white' ? 0 : 12;
                    const oppCitadelY = piece.color === 'white' ? 1 : 8;
                    const distToOppCitadel = Math.abs(x - oppCitadelX) + Math.abs(y - oppCitadelY);

                    // If losing badly in material, heading into opponent citadel forces a draw
                    const isLosing = piece.color === 'white'
                        ? (whiteBaseMaterial < blackBaseMaterial - 300)
                        : (blackBaseMaterial < whiteBaseMaterial - 300);

                    if (isLosing) {
                        value += Math.max(0, 600 - distToOppCitadel * 60);
                    }
                }

                // Center proximity bonus
                if (!piece.name.includes('Pawn')) {
                    const centerX = board.cols / 2;
                    const centerY = board.rows / 2;
                    const distFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
                    value += Math.max(0, 15 - distFromCenter * 2);
                }

                if (piece.color === 'white') {
                    whiteScore += value;
                } else {
                    blackScore += value;
                }
            }
        }

        // Mobility bonus
        const currentTurn = engine.currentTurn;
        let legalMovesCount = 0;
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (piece && piece.color === currentTurn) {
                    legalMovesCount += engine.getLegalMoves(piece).length;
                }
            }
        }

        if (currentTurn === 'white') whiteScore += legalMovesCount * 2;
        else blackScore += legalMovesCount * 2;

        // Check & Checkmate bonuses
        if (engine.state === 'checkmate') {
            if (currentTurn === 'white') whiteScore -= 100000;
            else blackScore -= 100000;
        } else if (engine.state === 'check') {
            if (currentTurn === 'white') whiteScore -= 60;
            else blackScore -= 60;
        } else if (engine.state === 'draw') {
            // If the side was losing, a draw is evaluated as equal (0 deficit)
            if (whiteScore < blackScore) {
                whiteScore = blackScore;
            } else {
                blackScore = whiteScore;
            }
        }

        const score = perspectiveColor === 'white' ? (whiteScore - blackScore) : (blackScore - whiteScore);
        return score;
    }

    /**
     * Collects all legal moves for a given color.
     */
    public static getAllLegalMoves(engine: BaseEngine, color: PieceColor): { piece: Piece; from: Position; to: Position; isCapture: boolean }[] {
        const movesList: { piece: Piece; from: Position; to: Position; isCapture: boolean }[] = [];
        const board = engine.board;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (piece && piece.color === color) {
                    const legal = engine.getLegalMoves(piece);
                    for (const to of legal) {
                        const target = board.getPieceAt(to.x, to.y);
                        const isCapture = target !== null && target.color !== color;
                        movesList.push({
                            piece,
                            from: { x: piece.position.x, y: piece.position.y },
                            to,
                            isCapture
                        });
                    }
                }
            }
        }

        // Move ordering: Prioritize captures (MVV-LVA)
        movesList.sort((a, b) => {
            if (a.isCapture && !b.isCapture) return -1;
            if (!a.isCapture && b.isCapture) return 1;
            return 0;
        });

        return movesList;
    }

    /**
     * Finds the best move using Minimax with Alpha-Beta pruning.
     */
    public static findBestMove(
        engine: BaseEngine,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium'
    ): AiMoveResult | null {
        const color = engine.currentTurn;
        const allMoves = this.getAllLegalMoves(engine, color);

        if (allMoves.length === 0) return null;

        // Depth according to difficulty
        let maxDepth = 3;
        if (difficulty === 'easy') maxDepth = 1;
        else if (difficulty === 'medium') maxDepth = 2;
        else maxDepth = 3; // Hard

        let bestMove = allMoves[0];
        let bestScore = -Infinity;
        const alpha = -Infinity;
        const beta = Infinity;

        // Easy mode adds slight randomness among top moves
        if (difficulty === 'easy' && Math.random() < 0.3) {
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            return {
                from: randomMove.from,
                to: randomMove.to,
                score: 0
            };
        }

        for (const candidate of allMoves) {
            const simulatedEngine = this.cloneEngineState(engine);
            const success = simulatedEngine.executeMove(candidate.from, candidate.to);
            if (!success) continue;

            const score = -this.alphaBeta(simulatedEngine, maxDepth - 1, -beta, -alpha, color === 'white' ? 'black' : 'white');

            if (score > bestScore) {
                bestScore = score;
                bestMove = candidate;
            }
        }

        let promotionPiece: string | undefined = undefined;
        if (bestMove.piece.name === 'Pawn' && (bestMove.to.y === 0 || bestMove.to.y === engine.board.rows - 1)) {
            promotionPiece = 'Queen';
        }

        return {
            from: bestMove.from,
            to: bestMove.to,
            promotionPiece,
            score: bestScore
        };
    }

    /**
     * Minimax with Alpha-Beta pruning recursion.
     */
    private static alphaBeta(
        engine: BaseEngine,
        depth: number,
        alpha: number,
        beta: number,
        currentColor: PieceColor
    ): number {
        if (depth === 0 || engine.state === 'checkmate' || engine.state === 'draw') {
            return this.evaluateBoard(engine, currentColor);
        }

        const legalMoves = this.getAllLegalMoves(engine, currentColor);
        if (legalMoves.length === 0) {
            return this.evaluateBoard(engine, currentColor);
        }

        let maxScore = -Infinity;

        for (const move of legalMoves) {
            const simulatedEngine = this.cloneEngineState(engine);
            const success = simulatedEngine.executeMove(move.from, move.to);
            if (!success) continue;

            const score = -this.alphaBeta(
                simulatedEngine,
                depth - 1,
                -beta,
                -alpha,
                currentColor === 'white' ? 'black' : 'white'
            );

            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (alpha >= beta) {
                break; // Beta cutoff
            }
        }

        return maxScore;
    }
}

