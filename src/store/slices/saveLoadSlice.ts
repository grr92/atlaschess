import type { StoreSlice, SaveLoadSliceState, SaveLoadSliceActions } from '../types';
import { MakrukEngine } from '../../core/engine/MakrukEngine';
import { populateCustomPieces } from '../../utils/customPiecesLoader';
import { replayHistory } from '../../utils/historyReplayer';

export const createSaveLoadSlice: StoreSlice<SaveLoadSliceState & SaveLoadSliceActions> = (set, get) => ({
    gameTime: 0,

    setGameTime: (fn) => set((state) => ({ gameTime: fn(state.gameTime) })),

    saveGame: () => {
        const { currentVariantId, history, gameTime, gameMode, playerColor, aiDifficulty, useDiceRule, subTurn, currentDiceRoll, engine, initialCustomPieces, initialCustomTurn, initialAnnexedArmies } = get();
        if (history.length === 0 && !initialCustomPieces) return;

        const saveData: any = {
            variantId: currentVariantId,
            history: history,
            time: gameTime,
            gameMode,
            playerColor,
            currentTurn: get().currentTurn,
            aiDifficulty,
            useDiceRule: !!useDiceRule,
            subTurn: subTurn || 1,
            currentDiceRoll: currentDiceRoll || null,
            variantOptions: engine?.getVariantOptions() || undefined
        };

        if (initialCustomPieces) {
            saveData.customPieces = initialCustomPieces;
            saveData.currentTurn = initialCustomTurn || get().currentTurn;
            saveData.annexedArmies = initialAnnexedArmies;
        }
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
            const loadedVariantOptions = parsed.variantOptions ?? parsed.janggiSetups;

            initGame(parsed.variantId, loadedMode, loadedColor, loadedDifficulty, loadedUseDiceRule, loadedVariantOptions);
            const engine = get().engine;
            if (!engine) return false;

            // Support direct custom board setup
            if (Array.isArray(parsed.customPieces)) {
                populateCustomPieces(engine, parsed.customPieces, parsed.currentTurn, parsed.annexedArmies);
            }
            if (Array.isArray(parsed.history)) {
                replayHistory(engine, parsed.history);
            }

            if (engine instanceof MakrukEngine && loadedVariantOptions) {
                engine.restoreCountingState(loadedVariantOptions);
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
                lastAction: 'load',
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

