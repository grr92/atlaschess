import type { StoreSlice, AiSliceState, AiSliceActions } from '../types';
import type { Position } from '../../types';
import { historyToUciMoves, uciToMove } from '../../utils/uciNotation';
import { HeuristicAiEngine } from '../../core/ai/HeuristicAiEngine';
import { DICE_PIECE_MAP, CHATURAJI_DICE_PIECE_MAP, FOUR_SEASONS_DICE_PIECE_MAP } from '../../utils/diceMapper';
import { soundManager } from '../../utils/soundManager';

export const createAiSlice: StoreSlice<AiSliceState & AiSliceActions> = (set, get) => ({
    gameMode: 'pvp',
    playerColor: 'white',
    aiDifficulty: 'medium',
    isAiThinking: false,

    setGameMode: (gameMode, playerColor = 'white') => set({ gameMode, playerColor }),
    setAiDifficulty: (aiDifficulty) => set({ aiDifficulty }),

    triggerAiMove: async () => {
        const { engine, gameState, gameMode, playerColor, aiDifficulty, currentVariantId, isAiThinking, useDiceRule, currentDiceRoll, isRollingDice } = get();
        if (!engine || gameState === 'checkmate' || gameState === 'draw') return;

        const isChaturaji = currentVariantId === 'chaturaji';
        const isFourSeasons = currentVariantId === 'four_seasons';
        const activeController = engine.getActiveController();

        if (gameMode !== 'vs_ai' || activeController === playerColor) return;
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

            let allowedPieces: string | string[] | undefined = undefined;
            if (useDiceRule && currentDiceRoll) {
                if (isFourSeasons) {
                    allowedPieces = FOUR_SEASONS_DICE_PIECE_MAP[currentDiceRoll];
                } else if (isChaturaji) {
                    const normalizedRoll = currentDiceRoll === 5 ? 1 : (currentDiceRoll === 6 ? 4 : currentDiceRoll);
                    allowedPieces = CHATURAJI_DICE_PIECE_MAP[normalizedRoll];
                } else {
                    allowedPieces = DICE_PIECE_MAP[currentDiceRoll];
                }
            }

            // 1. If playing Chaturaji, Four Seasons, or with Dice Rule or Tamerlane, use Native Heuristic AI
            if (isChaturaji || isFourSeasons || currentVariantId === 'tamerlane' || (useDiceRule && currentDiceRoll)) {
                const aiMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty, allowedPieces);
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
                const fallbackMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty, allowedPieces);
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

                // Check post-move interception (succession in Tamerlane, etc.)
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

                // Auto-handle King Rescue in Chaturaji for AI
                if (engine instanceof ChaturajiEngine) {
                    if (engine.pendingKingRescueChoice) {
                        engine.confirmKingRescue();
                    }
                    if (engine.pendingKingPlacement) {
                        const partnerColor = engine.pendingKingPlacement.color;
                        const initialThrone = ChaturajiEngine.INITIAL_THRONES[partnerColor];
                        const candidateSquares: Position[] = [];
                        for (let y = 0; y < 8; y++) {
                            for (let x = 0; x < 8; x++) {
                                if (engine.board.getPieceAt(x, y) === null) {
                                    candidateSquares.push({ x, y });
                                }
                            }
                        }
                        candidateSquares.sort((a, b) => {
                            const distA = Math.abs(a.x - initialThrone.x) + Math.abs(a.y - initialThrone.y);
                            const distB = Math.abs(b.x - initialThrone.x) + Math.abs(b.y - initialThrone.y);
                            return distA - distB;
                        });
                        if (candidateSquares.length > 0) {
                            engine.placeRescuedKing(candidateSquares[0]);
                        }
                    }
                }

                set({
                    selectedPosition: null,
                    legalMoves: [],
                    gameState: engine.state,
                    currentTurn: engine.currentTurn,
                    subTurn: (engine as any).subTurn || 1,
                    history: [...engine.history],
                    isAiThinking: false,
                    activeInterception: null,
                });

                // Roll dice for the next turn if dice rule is active
                if (useDiceRule) {
                    get().rollDiceForCurrentTurn();
                }

                // If the next turn is ALSO an AI player, trigger AI move after animation delay (for 4 player variants)
                if (gameMode === 'vs_ai' && engine.state !== 'checkmate' && engine.state !== 'draw') {
                    const nextActiveController = engine.getActiveController();

                    if (nextActiveController !== playerColor) {
                        setTimeout(() => {
                            get().triggerAiMove();
                        }, useDiceRule ? 850 : 350);
                    }
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

