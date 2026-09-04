import type { StoreSlice, AiSliceState, AiSliceActions } from '../types';
import { historyToUciMoves, uciToMove } from '../../utils/uciNotation';
import { HeuristicAiEngine } from '../../core/ai/HeuristicAiEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { DICE_PIECE_MAP } from '../../utils/diceMapper';
import { soundManager } from '../../utils/soundManager';

export const createAiSlice: StoreSlice<AiSliceState & AiSliceActions> = (set, get) => ({
    gameMode: 'pvp',
    playerColor: 'white',
    aiDifficulty: 'medium',
    isAiThinking: false,

    setGameMode: (gameMode, playerColor = 'white') => set({ gameMode, playerColor }),
    setAiDifficulty: (aiDifficulty) => set({ aiDifficulty }),

    triggerAiMove: async () => {
        const { engine, gameState, currentTurn, gameMode, playerColor, aiDifficulty, currentVariantId, isAiThinking, useDiceRule, currentDiceRoll, isRollingDice } = get();
        if (!engine || gameState === 'checkmate' || gameState === 'draw') return;
        if (gameMode !== 'vs_ai' || currentTurn === playerColor) return;
        if (isAiThinking) return;

        // If the dice is currently rolling, wait for it to settle before calculating AI move
        if (useDiceRule && isRollingDice) {
            setTimeout(() => {
                get().triggerAiMove();
            }, 300);
            return;
        }

        set({ isAiThinking: true });

        try {
            let executed = false;

            // 1. If playing with 8-sided dice rule, use Native Heuristic AI restricted to the rolled piece
            if (useDiceRule && currentDiceRoll) {
                const allowedPieceName = DICE_PIECE_MAP[currentDiceRoll];
                const aiMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty, allowedPieceName);
                if (aiMove) {
                    executed = engine.executeMove(aiMove.from, aiMove.to, aiMove.promotionPiece);
                }
            } else if (currentVariantId === 'tamerlane') {
                // 2. If playing Tamerlane, use the specialized Native Heuristic AI Engine
                const aiMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty);
                if (aiMove) {
                    executed = engine.executeMove(aiMove.from, aiMove.to, aiMove.promotionPiece);
                }
            } else if (window.electronAPI?.engine) {
                // 3. Otherwise, attempt Fairy-Stockfish calculation
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

            // 4. Robust Fallback: If Fairy-Stockfish failed or was unable to execute the move, use Heuristic Engine
            if (!executed) {
                const allowedPieceName = (useDiceRule && currentDiceRoll) ? DICE_PIECE_MAP[currentDiceRoll] : undefined;
                const fallbackMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty, allowedPieceName);
                if (fallbackMove) {
                    executed = engine.executeMove(fallbackMove.from, fallbackMove.to, fallbackMove.promotionPiece);
                }
            }

            if (executed) {
                // Play sound effect for AI move
                const lastMove = engine.history[engine.history.length - 1];
                if (engine.state === 'check' || engine.state === 'checkmate') {
                    soundManager.playCheck();
                } else if (lastMove && lastMove.capturedPiece) {
                    soundManager.playCapture();
                } else {
                    soundManager.playMove();
                }

                // Check post-move interception (succession, etc.)
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

                // Roll dice for the next turn if dice rule is active
                if (useDiceRule) {
                    get().rollDiceForCurrentTurn();
                }
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
