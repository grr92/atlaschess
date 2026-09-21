import type { StoreSlice, GameSliceState, GameSliceActions } from '../types';
import type { Position, PieceColor, InterceptionDecision } from '../../types';
import type { BaseEngine } from '../../core/engine/BaseEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../core/engine/ChaturajiEngine';
import { FourSeasonsEngine } from '../../core/engine/FourSeasonsEngine';
import { MakrukEngine } from '../../core/engine/MakrukEngine';
import { SittuyinEngine } from '../../core/engine/SittuyinEngine';
import { ShogiEngine } from '../../core/engine/ShogiEngine';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { replayMove, replayHistory } from '../../utils/historyReplayer';
import { getAvailableDiceNumbers, isPieceAllowedByDice, hasLegalMovesForDiceRoll } from '../../utils/diceMapper';
import { soundManager } from '../../utils/soundManager';
import { populateCustomPieces } from '../../utils/customPiecesLoader';
import { getAiSittuyinPreset, type SittuyinPieceName } from '../../core/variants/sittuyin/sittuyinSetup';

let pendingAiTimeout: ReturnType<typeof setTimeout> | null = null;

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
    regionalPieceStyle: 'text',
    lastAction: null,

    initGame: (variantId = 'classic', mode, playerColor, difficulty, useDiceRule = false, variantOptions?: any) => {
        const engine = VariantRegistry.createEngine(variantId, variantOptions);
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

        // Initialize Sittuyin Sit-tee troops deployment phase
        if (variantId === 'sittuyin' && variantOptions?.deploy === true) {
            if (engine instanceof SittuyinEngine) {
                engine.startDeployment();
                if (activeMode === 'vs_ai') {
                    const aiColor: PieceColor = activePlayerColor === 'red' ? 'black' : 'red';
                    const aiPreset = getAiSittuyinPreset(aiColor, activeDifficulty);
                    engine.applyDeployPreset(aiColor, aiPreset.id);

                    if (activePlayerColor === 'red') {
                        // Human is Red: AI is Black. AI generates preset deploy behind the scenes!
                        engine.isBlackHiddenInDeployment = true;
                        engine.deployStage = 'red';
                    } else {
                        // Human is Black: AI is Red. AI generates preset deploy behind the scenes!
                        engine.isRedHiddenInDeployment = true;
                        engine.deployStage = 'black';
                    }
                }
            }
        }

        if (pendingAiTimeout) {
            clearTimeout(pendingAiTimeout);
            pendingAiTimeout = null;
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
            lastAction: 'load',
            sittuyinSelectedPiece: null,
        });

        // If dice rules are active, roll the opening die
        if (activeDiceRule) {
            get().rollDiceForCurrentTurn(engine, engine.currentTurn);
        }

        // If playing vs AI and it's not the player's opening turn, AI makes the opening move
        const openingController = engine.getActiveController();

        if (activeMode === 'vs_ai' && openingController !== activePlayerColor && !(engine instanceof SittuyinEngine && engine.isDeploying())) {
            pendingAiTimeout = setTimeout(() => {
                pendingAiTimeout = null;
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

        // Sittuyin Sit-tee troop deployment phase square interaction
        if (engine instanceof SittuyinEngine && engine.isDeploying()) {
            if (isAiThinking) return;
            if (gameMode === 'vs_ai' && engine.deployStage !== playerColor) return;
            if (engine.deployStage === 'transition') return;

            const { sittuyinSelectedPiece } = get();
            const currentDeployColor = engine.deployStage as PieceColor;

            if (sittuyinSelectedPiece) {
                if (engine.canDeployPiece(currentDeployColor, sittuyinSelectedPiece, pos)) {
                    get().deploySittuyinPiece(pos);
                    return;
                }
            }

            // Check if clicked piece can be removed
            const pieceAtSquare = engine.board.getPieceAt(pos.x, pos.y);
            if (pieceAtSquare && pieceAtSquare.color === currentDeployColor && pieceAtSquare.name !== 'Ne') {
                const removedName = pieceAtSquare.name as SittuyinPieceName;
                get().removeSittuyinPiece(pos);
                get().selectSittuyinDeployPiece(removedName);
                return;
            }
            return;
        }

        // Disallow moves while AI is thinking or if it's not the player's turn in PvE mode
        const activeController = engine.getActiveController();

        if (isAiThinking) return;
        if (gameMode === 'vs_ai' && activeController !== playerColor) return;

        // Shogi in-hand piece drop placement
        if (engine instanceof ShogiEngine && get().shogiSelectedPiece) {
            const selectedPiece = get().shogiSelectedPiece!;
            const legalDrops = engine.getLegalDrops(selectedPiece, engine.currentTurn);
            if (legalDrops.some(m => m.x === pos.x && m.y === pos.y)) {
                get().dropShogiPiece(pos);
                return;
            } else {
                get().selectShogiDropPiece(null);
            }
        }

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
                        lastAction: 'move',
                    });

                    // If no blocking modal interception, continue turn flow
                    if (!postInterception) {
                        if (useDiceRule) {
                            get().rollDiceForCurrentTurn();
                        }

                        if (gameMode === 'vs_ai') {
                            pendingAiTimeout = setTimeout(() => {
                                pendingAiTimeout = null;
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
        const { currentVariantId, gameMode, playerColor, aiDifficulty, useDiceRule, engine } = get();
        const variantOptions = engine?.getResetOptions();
        get().initGame(currentVariantId, gameMode, playerColor, aiDifficulty, useDiceRule, variantOptions);
    },

    undoMove: () => {
        const { history, currentVariantId, gameMode, playerColor, isAiThinking, useDiceRule, initialCustomPieces, initialCustomTurn, initialAnnexedArmies, engine: currentEngine } = get();

        // If history is empty or AI is currently calculating, do not undo
        if (history.length === 0 || isAiThinking) return;

        if (pendingAiTimeout) {
            clearTimeout(pendingAiTimeout);
            pendingAiTimeout = null;
        }

        let newHistoryLength = history.length - 1;
        const variantOptions = currentEngine?.getVariantOptions();

        if (gameMode === 'vs_ai') {
            // Replay history on a temporary simulation engine to track who controlled each move
            const simEngine = VariantRegistry.createEngine(currentVariantId, variantOptions);
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
                replayMove(simEngine, move);
            }

            if (simEngine instanceof MakrukEngine && variantOptions?.hasUserDeactivated) {
                simEngine.restoreCountingState(variantOptions);
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
        const engine = VariantRegistry.createEngine(currentVariantId, variantOptions);
        if (initialCustomPieces) {
            populateCustomPieces(engine, initialCustomPieces, initialCustomTurn || undefined, initialAnnexedArmies);
        }
        if (useDiceRule && (engine instanceof ChaturajiEngine || engine instanceof FourSeasonsEngine)) {
            engine.useDiceRule = true;
        }

        // Replay previous moves
        replayHistory(engine, newHistory);

        if (engine instanceof MakrukEngine && variantOptions?.hasUserDeactivated) {
            engine.restoreCountingState(variantOptions);
        }

        engine.updateGameState();

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
            lastAction: 'undo',
        });

        if (useDiceRule) {
            get().rollDiceForCurrentTurn(engine, engine.currentTurn);
        }
    },

    passTurn: () => {
        const { engine, gameState, gameMode, playerColor, isAiThinking, useDiceRule, currentVariantId } = get();
        const variantDef = VariantRegistry.get(currentVariantId);
        if (!engine || !variantDef?.supportsPassTurn || gameState === 'checkmate' || gameState === 'draw' || isAiThinking) return;

        // If engine implements specific passing prerequisites (e.g. Janggi forbidding pass when in check)
        if (typeof (engine as any).canPassTurn === 'function' && !(engine as any).canPassTurn()) return;

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
                lastAction: 'move',
            });

            if (useDiceRule) {
                get().rollDiceForCurrentTurn();
            }

            if (gameMode === 'vs_ai' && engine.state !== 'checkmate' && engine.state !== 'draw') {
                const nextActiveController = engine.getActiveController();
                if (nextActiveController !== playerColor) {
                    pendingAiTimeout = setTimeout(() => {
                        pendingAiTimeout = null;
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
                    lastAction: 'move',
                });

                if (!postInterception) {
                    if (useDiceRule) {
                        get().rollDiceForCurrentTurn();
                    }

                    if (gameMode === 'vs_ai') {
                        pendingAiTimeout = setTimeout(() => {
                            pendingAiTimeout = null;
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
                lastAction: 'move',
            });

            if (useDiceRule) {
                get().rollDiceForCurrentTurn();
            }

            if (gameMode === 'vs_ai') {
                pendingAiTimeout = setTimeout(() => {
                    pendingAiTimeout = null;
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
                lastAction: 'move',
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
                pendingAiTimeout = setTimeout(() => {
                    pendingAiTimeout = null;
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
                    lastAction: 'move',
                });

                if (useDiceRule) {
                    get().rollDiceForCurrentTurn();
                }

                if (gameMode === 'vs_ai') {
                    pendingAiTimeout = setTimeout(() => {
                        pendingAiTimeout = null;
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
    },

    setRegionalPieceStyle: (style) => {
        set({ regionalPieceStyle: style });
    },

    toggleMakrukCounting: () => {
        const engine = get().engine;
        if (engine instanceof MakrukEngine) {
            engine.toggleCounting(engine.currentTurn);
            set({
                gameState: engine.state,
            });
        }
    },

    executeContextAction: (pos: Position, actionId: string = 'default') => {
        const { engine, gameMode, playerColor } = get();
        if (!engine) return;
        if (engine.state === 'checkmate' || engine.state === 'draw') return;

        if (gameMode === 'vs_ai' && engine.currentTurn !== playerColor) return;

        const success = engine.executeContextAction(actionId, pos);
        if (success) {
            const currentState: string = engine.state;
            if (currentState === 'check' || currentState === 'checkmate') {
                soundManager.playCheck();
            } else {
                soundManager.playMove();
            }

            set({
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                history: [...engine.history],
                lastAction: 'move',
            });

            const stateAfterMove: string = engine.state;
            if (gameMode === 'vs_ai' && stateAfterMove !== 'checkmate' && stateAfterMove !== 'draw') {
                if (engine.currentTurn !== playerColor) {
                    pendingAiTimeout = setTimeout(() => {
                        pendingAiTimeout = null;
                        get().triggerAiMove();
                    }, 200);
                }
            }
        }
    }
});
