import type { Position, PieceColor } from '../../types';
import type { BaseEngine } from '../engine/BaseEngine';
import type { Piece } from '../pieces/Piece';

export interface AiMoveResult {
    from: Position;
    to: Position;
    promotionPiece?: string;
    score: number;
}

export class HeuristicAiEngine {
    /**
     * Accurately clones an engine instance and its current board configuration.
     */
    public static cloneEngineState(engine: BaseEngine): BaseEngine {
        const freshEngine = new (engine.constructor as new (v: typeof engine.variant) => BaseEngine)(engine.variant);

        // Clear default grid
        freshEngine.board.clear();

        // Copy current pieces using polymorphic cloning
        for (const p of engine.board.getAllPieces()) {
            freshEngine.board.setPiece(p.clone(), p.position.x, p.position.y);
        }

        freshEngine.currentTurn = engine.currentTurn;
        freshEngine.state = engine.state;

        // Polymorphic delegation to copy variant-specific internal state
        engine.cloneCustomFields(freshEngine);

        return freshEngine;
    }

    /**
     * Evaluates the full board position from the perspective of the given color using the engine's evaluation strategy.
     */
    public static evaluateBoard(engine: BaseEngine, perspectiveColor: PieceColor): number {
        return engine.getEvaluationStrategy().evaluate(engine, perspectiveColor);
    }

    /**
     * Collects all legal moves for a given color, optionally filtered by piece type name or array of allowed piece names.
     */
    public static getAllLegalMoves(
        engine: BaseEngine,
        color: PieceColor,
        allowedPieceNames?: string | string[]
    ): { piece: Piece; from: Position; to: Position; isCapture: boolean }[] {
        const movesList: { piece: Piece; from: Position; to: Position; isCapture: boolean }[] = [];
        const board = engine.board;

        const isAllowed = (pieceName: string) => {
            if (!allowedPieceNames) return true;
            if (Array.isArray(allowedPieceNames)) return allowedPieceNames.includes(pieceName);
            return allowedPieceNames === pieceName;
        };

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (piece) {
                    const isControllable = (piece.color === color) || engine.isPieceControllableByCurrentTurn(piece);
                    if (!isControllable) continue;

                    if (!isAllowed(piece.name)) {
                        continue;
                    }

                    const legal = engine.getLegalMoves(piece);
                    for (const to of legal) {
                        const target = board.getPieceAt(to.x, to.y);
                        const isCapture = target !== null && target.color !== piece.color;
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
     * Automatically resolves Chaturaji's pending King rescue choice/placement in simulated engine instances.
     */
    public static autoResolveSimulatedRescue(engine: BaseEngine): void {
        if ('pendingKingRescueChoice' in engine && (engine as any).pendingKingRescueChoice) {
            (engine as any).confirmKingRescue();
        }
        if ('pendingKingPlacement' in engine && (engine as any).pendingKingPlacement) {
            const partnerColor = (engine as any).pendingKingPlacement.color;
            const throneMap: Record<string, { x: number; y: number }> = {
                red: { x: 7, y: 4 },
                green: { x: 3, y: 7 },
                yellow: { x: 0, y: 3 },
                blue: { x: 4, y: 0 }
            };
            const throne = throneMap[partnerColor] || { x: 0, y: 0 };
            const emptySquares: Position[] = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (engine.board.getPieceAt(c, r) === null) {
                        emptySquares.push({ x: c, y: r });
                    }
                }
            }
            emptySquares.sort((a, b) => {
                const distA = Math.abs(a.x - throne.x) + Math.abs(a.y - throne.y);
                const distB = Math.abs(b.x - throne.x) + Math.abs(b.y - throne.y);
                return distA - distB;
            });
            if (emptySquares.length > 0) {
                (engine as any).placeRescuedKing(emptySquares[0]);
            }
        }
    }

    /**
     * Finds the best move using Minimax with Alpha-Beta pruning, optionally constrained to a piece type.
     */
    public static findBestMove(
        engine: BaseEngine,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium',
        allowedPieceName?: string | string[]
    ): AiMoveResult | null {
        const rootColor = engine.currentTurn;
        const allMoves = this.getAllLegalMoves(engine, rootColor, allowedPieceName);

        if (allMoves.length === 0) return null;

        // Depth according to difficulty
        let maxDepth = 3;
        if (difficulty === 'easy') maxDepth = 1;
        else if (difficulty === 'medium') maxDepth = 2;
        else maxDepth = (engine.variant.name === 'Chaturaji' || engine.variant.name === 'Four Seasons Chess' ? 2 : 3);

        let bestMove = allMoves[0];
        let bestScore = -Infinity;

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

            this.autoResolveSimulatedRescue(simulatedEngine);

            const score = this.minimax(
                simulatedEngine,
                maxDepth - 1,
                -Infinity,
                Infinity,
                rootColor
            );

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

    private static isFriendly(c1: PieceColor, c2: PieceColor, engine: BaseEngine): boolean {
        if (c1 === c2) return true;
        if (engine.variant.name === 'Chaturaji') {
            const PARTNER_MAP: Record<string, string> = {
                red: 'yellow',
                yellow: 'red',
                green: 'blue',
                blue: 'green'
            };
            return PARTNER_MAP[c1] === c2;
        }
        if (engine.variant.name === 'Four Seasons Chess' && 'getControlledColors' in engine) {
            const controlled = (engine as any).getControlledColors(c1);
            return controlled.includes(c2);
        }
        return false;
    }

    /**
     * Generalized Minimax with Alpha-Beta pruning recursion supporting 2-player and multi-player teams.
     */
    private static minimax(
        engine: BaseEngine,
        depth: number,
        alpha: number,
        beta: number,
        rootColor: PieceColor
    ): number {
        if (depth === 0 || engine.state === 'checkmate' || engine.state === 'draw') {
            return this.evaluateBoard(engine, rootColor);
        }

        const currentTurn = engine.currentTurn;
        const legalMoves = this.getAllLegalMoves(engine, currentTurn);
        if (legalMoves.length === 0) {
            return this.evaluateBoard(engine, rootColor);
        }

        const isMax = this.isFriendly(currentTurn, rootColor, engine);

        if (isMax) {
            let maxEval = -Infinity;
            for (const move of legalMoves) {
                const simulatedEngine = this.cloneEngineState(engine);
                const success = simulatedEngine.executeMove(move.from, move.to);
                if (!success) continue;

                this.autoResolveSimulatedRescue(simulatedEngine);

                const score = this.minimax(
                    simulatedEngine,
                    depth - 1,
                    alpha,
                    beta,
                    rootColor
                );

                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of legalMoves) {
                const simulatedEngine = this.cloneEngineState(engine);
                const success = simulatedEngine.executeMove(move.from, move.to);
                if (!success) continue;

                this.autoResolveSimulatedRescue(simulatedEngine);

                const score = this.minimax(
                    simulatedEngine,
                    depth - 1,
                    alpha,
                    beta,
                    rootColor
                );

                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            return minEval;
        }
    }
}


