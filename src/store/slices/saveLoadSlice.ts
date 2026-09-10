import type { StoreSlice, SaveLoadSliceState, SaveLoadSliceActions } from '../types';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../core/engine/ChaturajiEngine';
import { populateCustomPieces } from '../../utils/customPiecesLoader';

export const createSaveLoadSlice: StoreSlice<SaveLoadSliceState & SaveLoadSliceActions> = (set, get) => ({
    gameTime: 0,

    setGameTime: (fn) => set((state) => ({ gameTime: fn(state.gameTime) })),

    saveGame: () => {
        const { currentVariantId, history, gameTime, gameMode, playerColor, aiDifficulty, useDiceRule, subTurn, currentDiceRoll } = get();
        if (history.length === 0) return;

        const saveData = {
            variantId: currentVariantId,
            history: history,
            time: gameTime,
            gameMode,
            playerColor,
            currentTurn: get().currentTurn,
            aiDifficulty,
            useDiceRule: !!useDiceRule,
            subTurn: subTurn || 1,
            currentDiceRoll: currentDiceRoll || null
        };
        const jsonString = JSON.stringify(saveData, null, 2);

        if (typeof document !== 'undefined') {
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');

            a.download = `AtlasChess_${currentVariantId}_${date}_${time}.atlas`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        return jsonString;
    },

    loadGame: (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);

            if (!parsed.variantId) {
                return false;
            }

            const { initGame } = get();
            const loadedMode = parsed.gameMode || 'pvp';
            const loadedColor = parsed.playerColor || 'white';
            const loadedDifficulty = parsed.aiDifficulty || 'medium';
            const loadedUseDiceRule = parsed.useDiceRule !== undefined ? !!parsed.useDiceRule : false;

            initGame(parsed.variantId, loadedMode, loadedColor, loadedDifficulty, loadedUseDiceRule);
            const engine = get().engine;
            if (!engine) return false;

            // Support direct custom board setup
            if (Array.isArray(parsed.customPieces)) {
                populateCustomPieces(engine, parsed.customPieces, parsed.currentTurn, parsed.annexedArmies);
            } else if (Array.isArray(parsed.history)) {
                for (const move of parsed.history) {
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
            }

            const loadedTime = typeof parsed.time === 'number' ? parsed.time : 0;
            const lastMove = engine.history.length > 0 ? engine.history[engine.history.length - 1] : null;
            const postInterception = lastMove ? engine.getPostMoveInterception(lastMove) : null;

            set({
                engine,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
                history: engine.history,
                activeInterception: postInterception || null,
                gameTime: loadedTime,
                isAiThinking: false,
                useDiceRule: loadedUseDiceRule,
                currentDiceRoll: null,
                isRollingDice: false,
                initialCustomPieces: Array.isArray(parsed.customPieces) ? parsed.customPieces : null,
                initialCustomTurn: Array.isArray(parsed.customPieces) ? (parsed.currentTurn || engine.currentTurn) : null,
                initialAnnexedArmies: Array.isArray(parsed.customPieces) ? (parsed.annexedArmies || null) : null,
            });

            if (loadedUseDiceRule) {
                get().rollDiceForCurrentTurn(engine, engine.currentTurn);
            }

            // If it's the AI's turn upon loading, trigger AI move
            const activeController = engine.getActiveController();
            if (loadedMode === 'vs_ai' && activeController !== loadedColor) {
                setTimeout(() => {
                    get().triggerAiMove();
                }, loadedUseDiceRule ? 850 : 300);
            }

            return true;
        } catch (error) {
            console.error("Unable to load the game", error);
            return false;
        }
    }
});

