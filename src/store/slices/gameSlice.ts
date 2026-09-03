import type { StoreSlice, GameSliceState, GameSliceActions } from '../types';
import type { Position, PieceColor } from '../../types';
import type { BaseEngine } from '../../core/engine/BaseEngine';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { getAvailableDiceNumbers, DICE_PIECE_MAP } from '../../utils/diceMapper';

export const createGameSlice: StoreSlice<GameSliceState & GameSliceActions> = (set, get) => ({
    engine: null,
    selectedPosition: null,
    legalMoves: [],
    gameState: 'playing',
    currentTurn: 'white',
    history: [],
    currentVariantId: 'classic',
    pendingPromotion: null,
    pendingCitadelChoice: null,
    pendingSuccessionChoice: null,
    useDiceRule: false,
    currentDiceRoll: null,
    isRollingDice: false,
    availableDiceValues: [],

    initGame: (variantId = 'classic', mode, playerColor, difficulty, useDiceRule = false) => {
        const engine = VariantRegistry.createEngine(variantId);
        const variantDef = VariantRegistry.get(variantId);

        const activeMode = mode !== undefined ? mode : get().gameMode;
        const activePlayerColor = playerColor !== undefined ? playerColor : get().playerColor;
        const activeDifficulty = difficulty !== undefined ? difficulty : get().aiDifficulty;
        const activeDiceRule = variantDef?.supportsDiceRule ? !!useDiceRule : false;

        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            history: engine.history,
            currentVariantId: variantId,
            pendingPromotion: null,
            pendingCitadelChoice: null,
            pendingSuccessionChoice: null,
            gameTime: 0,
            gameMode: activeMode,
            playerColor: activePlayerColor,
            aiDifficulty: activeDifficulty,
            isAiThinking: false,
            useDiceRule: activeDiceRule,
            currentDiceRoll: null,
            isRollingDice: false,
            availableDiceValues: [],
        });

        // If dice rules are active, roll the opening die
        if (activeDiceRule) {
            get().rollDiceForCurrentTurn(engine, engine.currentTurn);
        }

        // If playing vs AI as Black, White (AI) makes the opening move
        if (activeMode === 'vs_ai' && activePlayerColor === 'black') {
            setTimeout(() => {
                get().triggerAiMove();
            }, activeDiceRule ? 900 : 300);
        }
    },

    rollDiceForCurrentTurn: (engineOverride?: BaseEngine, turnOverride?: PieceColor) => {
        const engine = engineOverride || get().engine;
        const currentTurn = turnOverride || (engine ? engine.currentTurn : get().currentTurn);
        if (!engine) return;

        const availableNumbers = getAvailableDiceNumbers(engine, currentTurn);
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
        }, 700);
    },

    selectSquare: (pos: Position) => {
        const { engine, selectedPosition, legalMoves, gameMode, playerColor, isAiThinking, useDiceRule, currentDiceRoll, isRollingDice } = get();
        if (!engine || engine.state === 'checkmate' || engine.state === 'draw') return;

        // Disallow moves while AI is thinking or if it's not the player's turn in PvE mode
        if (isAiThinking) return;
        if (gameMode === 'vs_ai' && engine.currentTurn !== playerColor) return;

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
                    if (interception.type === 'PROMOTION') {
                        set({ pendingPromotion: { from: selectedPosition, to: pos } });
                        return;
                    }
                    if (interception.type === 'CITADEL_CHOICE') {
                        set({
                            pendingCitadelChoice: {
                                from: selectedPosition,
                                to: pos,
                                royals: interception.royals
                            }
                        });
                        return;
                    }
                }

                // If not an intercepted decision, execute the move normally
                const success = engine.executeMove(selectedPosition, pos);
                if (success) {
                    // Polymorphic post-move interception (succession choice, etc.)
                    const lastMove = engine.history[engine.history.length - 1];
                    const postInterception = engine.getPostMoveInterception(lastMove);
                    if (postInterception && postInterception.type === 'SUCCESSION_CHOICE') {
                        set({
                            pendingSuccessionChoice: {
                                color: postInterception.color,
                                royals: postInterception.royals
                            }
                        });
                    }

                    set({
                        selectedPosition: null,
                        legalMoves: [],
                        gameState: engine.state,
                        currentTurn: engine.currentTurn,
                        history: [...engine.history],
                    });

                    // If dice rule is active, roll the die for the next turn
                    if (useDiceRule) {
                        get().rollDiceForCurrentTurn();
                    }

                    // If playing vs AI, trigger the machine's turn
                    if (gameMode === 'vs_ai') {
                        setTimeout(() => {
                            get().triggerAiMove();
                        }, useDiceRule ? 850 : 200);
                    }
                    return;
                }
            }
        }

        const piece = engine.board.getPieceAt(pos.x, pos.y);

        if (piece && piece.color === engine.currentTurn) {
            // Check dice restriction if dice rule is active
            if (useDiceRule) {
                if (!currentDiceRoll || isRollingDice) return;
                const allowedPieceName = DICE_PIECE_MAP[currentDiceRoll];
                if (piece.name !== allowedPieceName) {
                    return;
                }
            }

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
        const { history, currentVariantId, gameMode, playerColor, initGame, isAiThinking, useDiceRule } = get();

        // If history is empty or AI is currently calculating, do not undo
        if (history.length === 0 || isAiThinking) return;

        // In vs_ai mode, if it's the player's turn, undo 2 moves (AI move + player move)
        let movesToDrop = 1;
        if (gameMode === 'vs_ai') {
            const currentTurn = get().currentTurn;
            if (currentTurn === playerColor && history.length >= 2) {
                movesToDrop = 2;
            }
        }

        const newHistory = history.slice(0, -movesToDrop);
        const originalTime = get().gameTime;

        // Reset the board from scratch
        initGame(currentVariantId, gameMode, playerColor, get().aiDifficulty, useDiceRule);
        const engine = get().engine;

        if (!engine) return;

        // Replay previous moves
        for (const move of newHistory) {
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
        }

        // Update the UI state with the reconstructed board
        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            history: engine.history,
            pendingPromotion: null,
            pendingCitadelChoice: null,
            pendingSuccessionChoice: null,
            gameTime: originalTime,
            isAiThinking: false
        });
    },

    confirmPromotion: (pieceName: string) => {
        const { engine, pendingPromotion, gameMode, useDiceRule } = get();
        if (!engine || !pendingPromotion) return;

        const success = engine.executeMove(pendingPromotion.from, pendingPromotion.to, pieceName);

        if (success) {
            set({
                pendingPromotion: null,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
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
    },

    cancelPromotion: () => {
        set({ pendingPromotion: null, selectedPosition: null, legalMoves: [] });
    },

    confirmCitadelSwap: (chosenRoyalId?: string) => {
        const { engine, pendingCitadelChoice, gameMode, useDiceRule } = get();
        if (!engine || !pendingCitadelChoice) return;

        if (engine instanceof TamerlaneEngine) {
            engine.executeCitadelSwap(pendingCitadelChoice.from, pendingCitadelChoice.to, chosenRoyalId);
        }

        set({
            pendingCitadelChoice: null,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
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
    },

    confirmCitadelDraw: () => {
        const { engine, pendingCitadelChoice } = get();
        if (!engine || !pendingCitadelChoice) return;

        engine.executeMove(pendingCitadelChoice.from, pendingCitadelChoice.to);
        engine.state = 'draw';

        set({
            pendingCitadelChoice: null,
            selectedPosition: null,
            legalMoves: [],
            gameState: 'draw',
            currentTurn: engine.currentTurn,
            history: [...engine.history],
        });
    },

    cancelCitadelChoice: () => {
        set({ pendingCitadelChoice: null, selectedPosition: null, legalMoves: [] });
    },

    confirmSuccession: (chosenRoyalId: string) => {
        const { engine } = get();
        if (!engine) return;

        if (engine instanceof TamerlaneEngine) {
            engine.crownSuccessor(chosenRoyalId);
            if (engine.history.length > 0) {
                engine.history[engine.history.length - 1].crownedSuccessorId = chosenRoyalId;
            }
        }

        set({
            pendingSuccessionChoice: null,
            gameState: engine.state,
            history: [...engine.history],
        });
    }
});
