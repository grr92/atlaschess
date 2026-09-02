import type { StoreSlice, AiSliceState, AiSliceActions } from '../types';
import { historyToUciMoves, uciToMove } from '../../utils/uciNotation';
import { HeuristicAiEngine } from '../../core/ai/HeuristicAiEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';

export const createAiSlice: StoreSlice<AiSliceState & AiSliceActions> = (set, get) => ({
    gameMode: 'pvp',
    playerColor: 'white',
    aiDifficulty: 'medium',
    isAiThinking: false,

    setGameMode: (gameMode, playerColor = 'white') => set({ gameMode, playerColor }),
    setAiDifficulty: (aiDifficulty) => set({ aiDifficulty }),

    triggerAiMove: async () => {
        const { engine, gameState, currentTurn, gameMode, playerColor, aiDifficulty, currentVariantId, isAiThinking } = get();
        if (!engine || gameState === 'checkmate' || gameState === 'draw') return;
        if (gameMode !== 'vs_ai' || currentTurn === playerColor) return;
        if (isAiThinking) return;

        set({ isAiThinking: true });

        try {
            let executed = false;

            // 1. If playing Tamerlane, use the specialized Native Heuristic AI Engine
            if (currentVariantId === 'tamerlane') {
                const aiMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty);
                if (aiMove) {
                    executed = engine.executeMove(aiMove.from, aiMove.to, aiMove.promotionPiece);
                }
            } else if (window.electronAPI?.engine) {
                // 2. Otherwise, attempt Fairy-Stockfish calculation
                try {
                    await window.electronAPI.engine.setVariant(currentVariantId);

                    let movetime = 800;
                    let skillLevel = 10;
                    let depth: number | undefined = undefined;

                    switch (aiDifficulty) {
                        case 'easy':
                            movetime = 250;
                            skillLevel = 1;
                            depth = 4;
                            break;
                        case 'medium':
                            movetime = 700;
                            skillLevel = 10;
                            depth = 8;
                            break;
                        case 'hard':
                        default:
                            movetime = 1400;
                            skillLevel = 20;
                            depth = undefined;
                            break;
                    }

                    const uciMoves = historyToUciMoves(engine.history, engine.board.rows);
                    const bestMoveStr = await window.electronAPI.engine.calculateMove({
                        moves: uciMoves,
                        movetime,
                        depth,
                        skillLevel
                    });

                    if (bestMoveStr && bestMoveStr !== '(none)') {
                        const parsed = uciToMove(bestMoveStr, engine.board.rows);
                        if (parsed) {
                            const piece = engine.board.getPieceAt(parsed.from.x, parsed.from.y);
                            let promotionPiece = parsed.promotionPiece;
                            if (piece?.name === 'Pawn' && (parsed.to.y === 0 || parsed.to.y === engine.board.rows - 1) && !promotionPiece) {
                                promotionPiece = 'Queen';
                            }

                            executed = engine.executeMove(parsed.from, parsed.to, promotionPiece);
                        }
                    }
                } catch (fsErr) {
                    console.warn("Fairy-Stockfish calculation error, falling back to heuristic engine:", fsErr);
                }
            }

            // 3. Robust Fallback: If Fairy-Stockfish failed or was unable to execute the move, use Heuristic Engine
            if (!executed) {
                const fallbackMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty);
                if (fallbackMove) {
                    executed = engine.executeMove(fallbackMove.from, fallbackMove.to, fallbackMove.promotionPiece);
                }
            }

            if (executed) {
                // Check post-move interception (succession, etc.)
                const lastMove = engine.history[engine.history.length - 1];
                const postInterception = engine.getPostMoveInterception(lastMove);
                if (postInterception && postInterception.type === 'SUCCESSION_CHOICE' && engine instanceof TamerlaneEngine) {
                    // Auto-crown first royal for AI
                    if (postInterception.royals.length > 0) {
                        engine.crownSuccessor(postInterception.royals[0].id);
                        if (engine.history.length > 0) {
                            engine.history[engine.history.length - 1].crownedSuccessorId = postInterception.royals[0].id;
                        }
                    }
                }

                set({
                    selectedPosition: null,
                    legalMoves: [],
                    gameState: engine.state,
                    currentTurn: engine.currentTurn,
                    history: [...engine.history],
                    isAiThinking: false,
                });
            } else {
                console.warn("No legal moves were executed for the AI.");
                set({
                    gameState: engine.state,
                    isAiThinking: false
                });
            }
        } catch (error) {
            console.error("Failed to calculate or execute AI move:", error);
            set({ isAiThinking: false });
        }
    }
});
