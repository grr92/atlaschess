import type { StoreSlice, SittuyinSliceState, SittuyinSliceActions } from '../types';
import { SittuyinEngine } from '../../core/engine/SittuyinEngine';
import { soundManager } from '../../utils/soundManager';
import type { PieceColor, Position } from '../../types';
import type { SittuyinPieceName } from '../../core/variants/sittuyin/sittuyinSetup';

let pendingAiTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Zustand slice dedicated to Sittuyin Sit-tee troop deployment phase.
 * Segregated from the general GameSlice in accordance with ISP and SRP.
 */
export const createSittuyinSlice: StoreSlice<SittuyinSliceState & SittuyinSliceActions> = (set, get) => ({
    sittuyinSelectedPiece: null,

    selectSittuyinDeployPiece: (pieceName: SittuyinPieceName | null) => {
        const { engine } = get();
        if (engine instanceof SittuyinEngine) {
            engine.setSelectedDeployPiece(pieceName);
        }
        set({ sittuyinSelectedPiece: pieceName });
    },

    deploySittuyinPiece: (pos: Position) => {
        const { engine, sittuyinSelectedPiece } = get();
        if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) return;
        if (!sittuyinSelectedPiece) return;

        const currentDeployColor = engine.deployStage as PieceColor;
        const success = engine.deployPiece(currentDeployColor, sittuyinSelectedPiece, pos);
        if (success) {
            soundManager.playMove();
            const pool = engine.deployPool[currentDeployColor as 'red' | 'black'];
            const stillAvailable = pool.includes(sittuyinSelectedPiece);
            const nextSelected = stillAvailable ? sittuyinSelectedPiece : null;
            engine.setSelectedDeployPiece(nextSelected);
            set({
                engine,
                sittuyinSelectedPiece: nextSelected
            });
        }
    },

    removeSittuyinPiece: (pos: Position) => {
        const { engine } = get();
        if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) return;

        const success = engine.removeDeployedPiece(pos);
        if (success) {
            soundManager.playCapture();
            set({ engine });
        }
    },

    autoDeploySittuyin: (presetId?: string) => {
        const { engine } = get();
        if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) return;

        const currentDeployColor = engine.deployStage as PieceColor;
        engine.applyDeployPreset(currentDeployColor, presetId);
        engine.setSelectedDeployPiece(null);
        soundManager.playMove();
        set({
            engine,
            sittuyinSelectedPiece: null
        });
    },

    resetSittuyinDeploy: () => {
        const { engine } = get();
        if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) return;

        const currentDeployColor = engine.deployStage as PieceColor;
        engine.resetPlayerDeployment(currentDeployColor);
        engine.setSelectedDeployPiece(null);
        soundManager.playMove();
        set({
            engine,
            sittuyinSelectedPiece: null
        });
    },

    confirmSittuyinDeploy: () => {
        const { engine, gameMode, playerColor } = get();
        if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) return;

        const currentDeployColor = engine.deployStage as PieceColor;
        const isPvAi = gameMode === 'vs_ai';
        const success = engine.confirmDeployment(currentDeployColor, isPvAi);
        if (success) {
            engine.setSelectedDeployPiece(null);
            soundManager.playCheck();
            set({
                engine,
                sittuyinSelectedPiece: null,
                gameState: engine.state,
                currentTurn: engine.currentTurn
            });

            // If PvAI mode and deployment just completed, check if AI has the opening move
            if (isPvAi && !engine.isDeploying()) {
                if (engine.currentTurn !== playerColor) {
                    if (pendingAiTimeout) clearTimeout(pendingAiTimeout);
                    pendingAiTimeout = setTimeout(() => {
                        pendingAiTimeout = null;
                        get().triggerAiMove();
                    }, 300);
                }
            }
        }
    },

    startBlackSittuyinDeploy: () => {
        const { engine } = get();
        if (!engine || !(engine instanceof SittuyinEngine)) return;

        engine.startBlackDeploymentInPvP();
        engine.setSelectedDeployPiece(null);
        soundManager.playSelect();
        set({
            engine,
            sittuyinSelectedPiece: null
        });
    }
});
