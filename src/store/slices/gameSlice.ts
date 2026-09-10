import type { StoreSlice, GameSliceState, GameSliceActions } from '../types';
import type { Position, PieceColor, InterceptionDecision } from '../../types';
import type { BaseEngine } from '../../core/engine/BaseEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../core/engine/ChaturajiEngine';
import { FourSeasonsEngine } from '../../core/engine/FourSeasonsEngine';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { getAvailableDiceNumbers, isPieceAllowedByDice, hasLegalMovesForDiceRoll } from '../../utils/diceMapper';
import { soundManager } from '../../utils/soundManager';
import { populateCustomPieces } from '../../utils/customPiecesLoader';

export const createGameSlice: StoreSlice<GameSliceState & GameSliceActions> = (set, get) => ({
    engine: null,
    selectedPosition: null,
    legalMoves: [],
    gameState: 'playing',
    currentTurn: 'white',
    history: [],
    currentVariantId: 'classic',
    activeInterception: null,
    useDiceRule: false,
    subTurn: 1,
    currentDiceRoll: null,
    isRollingDice: false,
    availableDiceValues: [],
    isMuted: soundManager.getMuted(),
    language: (typeof window !== 'undefined' && (localStorage.getItem('atlas_language') as any)) || 'en',
    initialCustomPieces: null,
    initialCustomTurn: null,
    initialAnnexedArmies: null,

    initGame: (variantId = 'classic', mode, playerColor, difficulty, useDiceRule = false) => {
        const engine = VariantRegistry.createEngine(variantId);
        const variantDef = VariantRegistry.get(variantId);

        const activeMode = mode !== undefined ? mode : get().gameMode;
        const activePlayerColor = playerColor !== undefined ? playerColor : get().playerColor;
        const activeDifficulty = difficulty !== undefined ? difficulty : get().aiDifficulty;
        const activeDiceRule = variantDef?.supportsDiceRule ? !!useDiceRule : false;

        if (activeDiceRule) {
            if (engine instanceof ChaturajiEngine || engine instanceof FourSeasonsEngine) {
                engine.useDiceRule = true;
            }
        }

        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            subTurn: (engine as any).subTurn || 1,
            history: engine.history,
            currentVariantId: variantId,
            activeInterception: null,
            gameTime: 0,
            gameMode: activeMode,
            playerColor: activePlayerColor,
            aiDifficulty: activeDifficulty,
            isAiThinking: false,
            useDiceRule: activeDiceRule,
            currentDiceRoll: null,
            isRollingDice: false,
            availableDiceValues: [],
            initialCustomPieces: null,
            initialCustomTurn: null,
            initialAnnexedArmies: null,
        });

        // If dice rules are active, roll the opening die
        if (activeDiceRule) {
            get().rollDiceForCurrentTurn(engine, engine.currentTurn);
        }

        // If playing vs AI and it's not the player's opening turn, AI makes the opening move
        const openingController = engine.getActiveController();

        if (activeMode === 'vs_ai' && openingController !== activePlayerColor) {
            setTimeout(() => {
                get().triggerAiMove();
            }, activeDiceRule ? 900 : 300);
        }
    },

    rollDiceForCurrentTurn: (engineOverride?: BaseEngine, turnOverride?: PieceColor) => {
        const engine = engineOverride || get().engine;
        const currentTurn = turnOverride || (engine ? engine.currentTurn : get().currentTurn);
        const currentVariantId = get().currentVariantId;
        if (!engine) return;

        const availableNumbers = getAvailableDiceNumbers(engine, currentTurn, currentVariantId);
        if (availableNumbers.length === 0) {
            set({ currentDiceRoll: null, isRollingDice: false, availableDiceValues: [] });
            return;
        }

        // Pick a random number among valid pieces with legal moves
        const chosenRoll = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

        set({ isRollingDice: true, availableDiceValues: availableNumbers });

        setTimeout(() => {
            set({
                currentDiceRoll: chosenRoll,
                isRollingDice: false
            });

            // Four Seasons Chess: If no piece matching the rolled die has legal moves, the turn is lost
            if (currentVariantId === 'four_seasons') {
                const currentEng = get().engine;
                if (currentEng instanceof FourSeasonsEngine && currentEng.state !== 'checkmate' && currentEng.state !== 'draw') {
                    const hasMoves = hasLegalMovesForDiceRoll(currentEng, chosenRoll, currentVariantId);
                    if (!hasMoves) {
                        setTimeout(() => {
                            const activeEng = get().engine;
                            if (activeEng instanceof FourSeasonsEngine && activeEng.state !== 'checkmate' && activeEng.state !== 'draw') {
                                activeEng.rotateTurn();
                                set({
                                    currentTurn: activeEng.currentTurn,
                                    gameState: activeEng.state,
                                    selectedPosition: null,
                                    legalMoves: [],
                                });
                                get().rollDiceForCurrentTurn();

                                if (get().gameMode === 'vs_ai') {
                                    const nextCtrl = activeEng.getActiveController();
                                    if (nextCtrl !== get().playerColor) {
                                        setTimeout(() => {
                                            get().triggerAiMove();
                                        }, 850);
                                    }
                                }
                            }
                        }, 900);
                    }
                }
            }
        }, 700);
    },

    selectSquare: (pos: Position) => {
        const {
            engine,
            selectedPosition,
            legalMoves,
            gameMode,
            playerColor,
            isAiThinking,
            useDiceRule,
            currentDiceRoll,
            isRollingDice,
            activeInterception,
            currentVariantId
        } = get();

        if (!engine || engine.state === 'checkmate' || engine.state === 'draw') return;

        // Disallow moves while AI is thinking or if it's not the player's turn in PvE mode
        const activeController = engine.getActiveController();

        if (isAiThinking) return;
        if (gameMode === 'vs_ai' && activeController !== playerColor) return;

        // If pending King Placement is active (Chaturaji), clicking a board square places the King
        if (activeInterception?.type === 'KING_PLACEMENT') {
            get().resolveInterception({ type: 'KING_PLACEMENT', pos });
            return;
        }

        // If any modal interception is currently active, disallow standard board clicks
        if (activeInterception) return;

        // Deselect the current position if clicked again
        if (selectedPosition && selectedPosition.x === pos.x && selectedPosition.y === pos.y) {
            set({
                selectedPosition: null,
                legalMoves: [],
            });
            return;
        }

        if (selectedPosition) {
            const isMoveValid = legalMoves.some(m => m.x === pos.x && m.y === pos.y);

            if (isMoveValid) {
                // Polymorphic pre-move interception (promotion, citadel infiltration, etc.)
                const interception = engine.getPreMoveInterception(selectedPosition, pos);
                if (interception) {
                    set({ activeInterception: interception });
                    return;
                }

                // If not an intercepted decision, execute the move normally
                const success = engine.executeMove(selectedPosition, pos);
                if (success) {
                    // Play sound effect
                    const lastMove = engine.history[engine.history.length - 1];
                    const currentState: string = engine.state;
                    if (currentState === 'check' || currentState === 'checkmate') {
                        soundManager.playCheck();
                    } else if (lastMove && lastMove.capturedPiece) {
                        soundManager.playCapture();
                    } else {
                        soundManager.playMove();
                    }

                    // Polymorphic post-move interception (succession choice, king rescue, etc.)
                    const postInterception = engine.getPostMoveInterception(lastMove);

                    set({
                        selectedPosition: null,
                        legalMoves: [],
                        gameState: engine.state,
                        currentTurn: engine.currentTurn,
                        subTurn: (engine as any).subTurn || 1,
                        history: [...engine.history],
                        activeInterception: postInterception || null,
                    });

                    // If no blocking modal interception, continue turn flow
                    if (!postInterception) {
                        if (useDiceRule) {
                            get().rollDiceForCurrentTurn();
                        }

                        if (gameMode === 'vs_ai') {
                            setTimeout(() => {
                                get().triggerAiMove();
                            }, useDiceRule ? 850 : 200);
                        }
                    }
                    return;
                }
            }
        }

        const piece = engine.board.getPieceAt(pos.x, pos.y);

        if (piece && engine.isPieceControllableByCurrentTurn(piece)) {
            // Check dice restriction if dice rule is active
            if (useDiceRule) {
                if (!currentDiceRoll || isRollingDice) return;
                if (!isPieceAllowedByDice(piece.name, currentDiceRoll, currentVariantId)) {
                    return;
                }
            }

            soundManager.playSelect();
            const moves = engine.getLegalMoves(piece);
            set({
                selectedPosition: pos,
                legalMoves: moves,
            });
        } else {
            set({
                selectedPosition: null,
                legalMoves: [],
            });
        }
    },

    resetGame: () => {
        const { currentVariantId, gameMode, playerColor, aiDifficulty, useDiceRule } = get();
        get().initGame(currentVariantId, gameMode, playerColor, aiDifficulty, useDiceRule);
    },

    undoMove: () => {
        const { history, currentVariantId, gameMode, playerColor, isAiThinking, useDiceRule, initialCustomPieces, initialCustomTurn, initialAnnexedArmies } = get();

        // If history is empty or AI is currently calculating, do not undo
        if (history.length === 0 || isAiThinking) return;

        let newHistoryLength = history.length - 1;

        if (gameMode === 'vs_ai') {
            // Replay history on a temporary simulation engine to track who controlled each move
            const simEngine = VariantRegistry.createEngine(currentVariantId);
            if (initialCustomPieces) {
                populateCustomPieces(simEngine, initialCustomPieces, initialCustomTurn || undefined, initialAnnexedArmies);
            }
            if (useDiceRule && (simEngine instanceof ChaturajiEngine || simEngine instanceof FourSeasonsEngine)) {
                simEngine.useDiceRule = true;
            }

            const humanActionIndices: number[] = [];

            for (let i = 0; i < history.length; i++) {
                const move = history[i];
                const activeCtrl = simEngine.getActiveController();
                if (activeCtrl === playerColor) {
                    humanActionIndices.push(i);
                }

                if (move.isPass || move.san === 'pass') {
                    simEngine.passTurn();
                    continue;
                }

                let promotionPiece: string | undefined = undefined;
                if (move.san?.includes('=Q')) promotionPiece = 'Queen';
                else if (move.san?.includes('=R')) promotionPiece = 'Rook';
                else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
                else if (move.san?.includes('=N')) promotionPiece = 'Knight';
                else if (move.san?.includes('=F')) promotionPiece = 'Ferz';

                if (move.citadelSwappedRoyalId && simEngine instanceof TamerlaneEngine) {
                    simEngine.executeCitadelSwap(move.from, move.to, move.citadelSwappedRoyalId);
                } else {
                    simEngine.executeMove(move.from, move.to, promotionPiece);
                }

                if (move.crownedSuccessorId && simEngine instanceof TamerlaneEngine) {
                    simEngine.crownSuccessor(move.crownedSuccessorId);
                }

                if (simEngine instanceof ChaturajiEngine) {
                    if (move.rescuedKingPlacement) {
                        simEngine.confirmKingRescue();
                        simEngine.placeRescuedKing(move.rescuedKingPlacement.pos);
                    } else if (move.rescuedKingDeclined || simEngine.pendingKingRescueChoice) {
                        simEngine.declineKingRescue();
                    }
                }
            }

            const currentActiveController = simEngine.getActiveController();
            if (currentActiveController === playerColor && humanActionIndices.length > 0) {
                // Drop back to before the player's last executed action
                newHistoryLength = humanActionIndices[humanActionIndices.length - 1];
            } else {
                newHistoryLength = Math.max(0, history.length - 1);
            }
        }

        const newHistory = history.slice(0, newHistoryLength);
        const originalTime = get().gameTime;

        // Create a clean engine instance for replay
        const engine = VariantRegistry.createEngine(currentVariantId);
        if (initialCustomPieces) {
            populateCustomPieces(engine, initialCustomPieces, initialCustomTurn || undefined, initialAnnexedArmies);
        }
        if (useDiceRule && (engine instanceof ChaturajiEngine || engine instanceof FourSeasonsEngine)) {
            engine.useDiceRule = true;
        }

        // Replay previous moves
        for (const move of newHistory) {
            if (move.isPass || move.san === 'pass') {
                engine.passTurn();
                continue;
            }

            let promotionPiece: string | undefined = undefined;

            if (move.san?.includes('=Q')) promotionPiece = 'Queen';
            else if (move.san?.includes('=R')) promotionPiece = 'Rook';
            else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
            else if (move.san?.includes('=N')) promotionPiece = 'Knight';
            else if (move.san?.includes('=F')) promotionPiece = 'Ferz';

            if (move.citadelSwappedRoyalId && engine instanceof TamerlaneEngine) {
                engine.executeCitadelSwap(move.from, move.to, move.citadelSwappedRoyalId);
            } else {
                engine.executeMove(move.from, move.to, promotionPiece);
            }

            if (move.crownedSuccessorId && engine instanceof TamerlaneEngine) {
                engine.crownSuccessor(move.crownedSuccessorId);
            }

            if (engine instanceof ChaturajiEngine) {
                if (move.rescuedKingPlacement) {
                    engine.confirmKingRescue();
                    engine.placeRescuedKing(move.rescuedKingPlacement.pos);
                } else if (move.rescuedKingDeclined || engine.pendingKingRescueChoice) {
                    engine.declineKingRescue();
                }
            }
        }

        const lastMove = engine.history.length > 0 ? engine.history[engine.history.length - 1] : null;
        const postInterception = lastMove ? engine.getPostMoveInterception(lastMove) : null;

        // Update the UI state with the reconstructed board
        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            subTurn: (engine as any).subTurn || 1,
            history: engine.history,
            activeInterception: postInterception || null,
            gameTime: originalTime,
            isAiThinking: false,
            isRollingDice: false,
        });

        if (useDiceRule) {
            get().rollDiceForCurrentTurn(engine, engine.currentTurn);
        }
    },

    passTurn: () => {
        const { engine, gameState, gameMode, playerColor, isAiThinking, useDiceRule, currentVariantId } = get();
        if (!engine || currentVariantId !== 'chaturaji' || gameState === 'checkmate' || gameState === 'draw' || isAiThinking) return;

        // In vs_ai mode, only human player can manually trigger passTurn from UI
        const activeController = engine.getActiveController();
        if (gameMode === 'vs_ai' && activeController !== playerColor) return;

        const success = engine.passTurn();

        if (success) {
            soundManager.playMove();

            set({
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
                history: [...engine.history],
            });

            if (useDiceRule) {
                get().rollDiceForCurrentTurn();
            }

            if (gameMode === 'vs_ai' && engine.state !== 'checkmate' && engine.state !== 'draw') {
                const nextActiveController = engine.getActiveController();
                if (nextActiveController !== playerColor) {
                    setTimeout(() => {
                        get().triggerAiMove();
                    }, useDiceRule ? 850 : 200);
                }
            }
        }
    },

    resolveInterception: (decision: InterceptionDecision) => {
        const { engine, activeInterception, gameMode, useDiceRule } = get();
        if (!engine || !activeInterception) return;

        if (decision.type === 'PROMOTION' && activeInterception.type === 'PROMOTION') {
            const success = engine.executeMove(activeInterception.from, activeInterception.to, decision.pieceName);

            if (success) {
                const lastMove = engine.history[engine.history.length - 1];
                const currentState: string = engine.state;
                if (currentState === 'check' || currentState === 'checkmate') {
                    soundManager.playCheck();
                } else if (lastMove && lastMove.capturedPiece) {
                    soundManager.playCapture();
                } else {
                    soundManager.playMove();
                }

                const postInterception = engine.getPostMoveInterception(lastMove);

                set({
                    activeInterception: postInterception || null,
                    selectedPosition: null,
                    legalMoves: [],
                    gameState: engine.state,
                    currentTurn: engine.currentTurn,
                    subTurn: (engine as any).subTurn || 1,
                    history: [...engine.history],
                });

                if (!postInterception) {
                    if (useDiceRule) {
                        get().rollDiceForCurrentTurn();
                    }

                    if (gameMode === 'vs_ai') {
                        setTimeout(() => {
                            get().triggerAiMove();
                        }, useDiceRule ? 850 : 200);
                    }
                }
            }
            return;
        }

        if (decision.type === 'CITADEL_SWAP' && activeInterception.type === 'CITADEL_CHOICE') {
            if (engine instanceof TamerlaneEngine) {
                engine.executeCitadelSwap(activeInterception.from, activeInterception.to, decision.chosenRoyalId);
            }

            soundManager.playMove();

            set({
                activeInterception: null,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
                history: [...engine.history],
            });

            if (useDiceRule) {
                get().rollDiceForCurrentTurn();
            }

            if (gameMode === 'vs_ai') {
                setTimeout(() => {
                    get().triggerAiMove();
                }, useDiceRule ? 850 : 200);
            }
            return;
        }

        if (decision.type === 'CITADEL_DRAW' && activeInterception.type === 'CITADEL_CHOICE') {
            engine.executeMove(activeInterception.from, activeInterception.to);
            engine.state = 'draw';

            soundManager.playMove();

            set({
                activeInterception: null,
                selectedPosition: null,
                legalMoves: [],
                gameState: 'draw',
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
                history: [...engine.history],
            });
            return;
        }

        if (decision.type === 'SUCCESSION') {
            engine.resolveInterception(decision);

            set({
                activeInterception: null,
                gameState: engine.state,
                subTurn: (engine as any).subTurn || 1,
                history: [...engine.history],
            });
            return;
        }

        if (decision.type === 'KING_RESCUE_ACCEPT') {
            engine.resolveInterception(decision);
            const lastMove = engine.history[engine.history.length - 1];
            const nextInterception = lastMove ? engine.getPostMoveInterception(lastMove) : null;

            set({
                activeInterception: nextInterception || null,
                subTurn: (engine as any).subTurn || 1,
            });
            return;
        }

        if (decision.type === 'KING_RESCUE_DECLINE') {
            engine.resolveInterception(decision);

            set({
                activeInterception: null,
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
            });

            if (useDiceRule) {
                get().rollDiceForCurrentTurn();
            }

            if (gameMode === 'vs_ai') {
                setTimeout(() => {
                    get().triggerAiMove();
                }, useDiceRule ? 850 : 200);
            }
            return;
        }

        if (decision.type === 'KING_PLACEMENT') {
            const success = engine.resolveInterception(decision);
            if (success) {
                soundManager.playMove();
                set({
                    activeInterception: null,
                    selectedPosition: null,
                    legalMoves: [],
                    gameState: engine.state,
                    currentTurn: engine.currentTurn,
                    subTurn: (engine as any).subTurn || 1,
                    history: [...engine.history],
                });

                if (useDiceRule) {
                    get().rollDiceForCurrentTurn();
                }

                if (gameMode === 'vs_ai') {
                    setTimeout(() => {
                        get().triggerAiMove();
                    }, useDiceRule ? 850 : 200);
                }
            }
            return;
        }
    },

    cancelInterception: () => {
        set({ activeInterception: null, selectedPosition: null, legalMoves: [] });
    },

    toggleMute: () => {
        const newMuted = soundManager.toggleMute();
        set({ isMuted: newMuted });
    },

    setLanguage: (lang) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('atlas_language', lang);
            } catch {}
        }
        set({ language: lang });
    }
});
