import type { StoreSlice, AiSliceState, AiSliceActions } from '../types';
import { hasSubTurn, hasCanPassTurn, hasFen, hasInitialFen, hasDropPiece, hasInPlacePromotion } from '../../types';
import { historyToUciMoves, uciToMove } from '../../utils/uciNotation';
import { HeuristicAiEngine } from '../../core/ai/HeuristicAiEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { DICE_PIECE_MAP, CHATURAJI_DICE_PIECE_MAP, FOUR_SEASONS_DICE_PIECE_MAP } from '../../utils/diceMapper';
import { soundManager } from '../../utils/soundManager';
import { uciCharToPieceName } from '../../core/variants/shogi/shogiSetup';


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

                    // Determine the FEN source: engines with a dynamic getFen() send only the FEN;
                    // engines without it send the initial FEN + move list (legacy UCI protocol).
                    const usesDynamicFen = hasFen(engine);
                    const fenToSend = usesDynamicFen
                        ? engine.getFen()
                        : (hasInitialFen(engine) ? engine.initialFen : '');
                    const movesToSend = usesDynamicFen
                        ? []
                        : historyToUciMoves(engine.history, engine.board.rows);

                    const bestMoveStr = await window.electronAPI.engine.calculateMove({
                        fen: fenToSend,
                        moves: movesToSend,
                        movetime,
                        depth,
                        skillLevel
                    });

                    if (bestMoveStr === '0000') {
                        // Stockfish passes the turn (0000 = null move); only allow if the engine permits it
                        if (!hasCanPassTurn(engine) || engine.canPassTurn()) {
                            executed = engine.passTurn();
                        }
                    } else if (bestMoveStr && bestMoveStr !== '(none)') {
                        const parsed = uciToMove(bestMoveStr, engine.board.rows);
                        if (parsed) {
                            if (parsed.dropPiece && hasDropPiece(engine)) {
                                // Shogi drop move (e.g. P@e4)
                                const dropName = uciCharToPieceName(parsed.dropPiece);
                                executed = engine.dropPiece(dropName, parsed.to);
                            } else if (parsed.from.x === parsed.to.x && parsed.from.y === parsed.to.y) {
                                // In-place deferred promotion (e.g. Sittuyin d6d6f)
                                if (hasInPlacePromotion(engine)) {
                                    executed = engine.promotePawnInPlace(parsed.to);
                                }
                            } else {
                                const piece = engine.board.getPieceAt(parsed.from.x, parsed.from.y);
                                let promotionPiece = parsed.promotionPiece;
                                if (piece?.name === 'Pawn' && (parsed.to.y === 0 || parsed.to.y === engine.board.rows - 1) && !promotionPiece) {
                                    promotionPiece = 'Queen';
                                }

                                executed = engine.executeMove(parsed.from, parsed.to, promotionPiece);
                            }
                        }
                    }
                } catch (fsErr) {
                    console.warn("Fairy-Stockfish calculation error, falling back to heuristic engine:", fsErr);
                }
            }

            // 3. Robust fallback: if Fairy-Stockfish failed or produced no move, use the heuristic engine
            if (!executed) {
                const fallbackMove = HeuristicAiEngine.findBestMove(engine, aiDifficulty, allowedPieces);
                if (fallbackMove) {
                    executed = engine.executeMove(fallbackMove.from, fallbackMove.to, fallbackMove.promotionPiece);
                } else if (hasCanPassTurn(engine) && engine.canPassTurn()) {
                    // In variants where passing is valid when no legal moves exist (e.g. Janggi)
                    executed = engine.passTurn();
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

                // Auto-handle post-move interceptions for AI (Tamerlane succession, Chaturaji king rescue)
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

                // Delegate Chaturaji king rescue resolution to the shared AI helper
                HeuristicAiEngine.autoResolveSimulatedRescue(engine);

                set({
                    selectedPosition: null,
                    legalMoves: [],
                    gameState: engine.state,
                    currentTurn: engine.currentTurn,
                    subTurn: (hasSubTurn(engine) ? engine.subTurn : 1),
                    history: [...engine.history],
                    isAiThinking: false,
                    activeInterception: null,
                    lastAction: 'move',
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

