import type { Position, PieceColor } from '../../types';
import type { BaseEngine } from '../engine/BaseEngine';
import type { Piece } from '../pieces/Piece';
import { TamerlaneEngine } from '../engine/TamerlaneEngine';
import { GrantAcedrexEngine } from '../engine/GrantAcedrexEngine';

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

        if (engine instanceof TamerlaneEngine && freshEngine instanceof TamerlaneEngine) {
            freshEngine.whiteCitadelExchangeUsed = engine.whiteCitadelExchangeUsed;
            freshEngine.blackCitadelExchangeUsed = engine.blackCitadelExchangeUsed;
        }

        if (engine instanceof GrantAcedrexEngine && freshEngine instanceof GrantAcedrexEngine) {
            freshEngine.hasPawnCapturedYet = engine.hasPawnCapturedYet;
        }

        return freshEngine;
    }

    /**
     * Evaluates the full board position from the perspective of the given color using the engine's evaluation strategy.
     */
    public static evaluateBoard(engine: BaseEngine, perspectiveColor: PieceColor): number {
        return engine.getEvaluationStrategy().evaluate(engine, perspectiveColor);
    }

    /**
     * Collects all legal moves for a given color, optionally filtered by piece type name.
     */
    public static getAllLegalMoves(
        engine: BaseEngine,
        color: PieceColor,
        allowedPieceName?: string
    ): { piece: Piece; from: Position; to: Position; isCapture: boolean }[] {
        const movesList: { piece: Piece; from: Position; to: Position; isCapture: boolean }[] = [];
        const board = engine.board;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (piece && piece.color === color) {
                    if (allowedPieceName && piece.name !== allowedPieceName) {
                        continue;
                    }
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
     * Finds the best move using Minimax with Alpha-Beta pruning, optionally constrained to a piece type.
     */
    public static findBestMove(
        engine: BaseEngine,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium',
        allowedPieceName?: string
    ): AiMoveResult | null {
        const color = engine.currentTurn;
        const allMoves = this.getAllLegalMoves(engine, color, allowedPieceName);

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

