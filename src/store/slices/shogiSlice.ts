import type { StoreSlice, ShogiSliceState, ShogiSliceActions } from '../types';
import { ShogiEngine } from '../../core/engine/ShogiEngine';
import { soundManager } from '../../utils/soundManager';
import type { Position } from '../../types';

let pendingAiTimeout: ReturnType<typeof setTimeout> | null = null;

export const createShogiSlice: StoreSlice<ShogiSliceState & ShogiSliceActions> = (set, get) => ({
    shogiSelectedPiece: null,

    selectShogiDropPiece: (pieceName: string | null) => {
        const { engine } = get();
        if (engine instanceof ShogiEngine) {
            engine.setSelectedDropPiece(pieceName);
        }
        set({
            shogiSelectedPiece: pieceName,
            selectedPosition: null,
            legalMoves: []
        });
    },

    dropShogiPiece: (pos: Position) => {
        const { engine, shogiSelectedPiece, gameMode, playerColor } = get();
        if (!engine || !(engine instanceof ShogiEngine)) return;
        if (!shogiSelectedPiece) return;

        // Disallow drop during AI turn in vs_ai
        if (gameMode === 'vs_ai' && engine.currentTurn !== playerColor) return;

        const success = engine.dropPiece(shogiSelectedPiece, pos);
        if (success) {
            const currentState = engine.state;
            if (currentState === 'check' || currentState === 'checkmate') {
                soundManager.playCheck();
            } else {
                soundManager.playMove();
            }

            set({
                engine,
                shogiSelectedPiece: null,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                history: [...engine.history],
                lastAction: 'move',
            });

            if (gameMode === 'vs_ai' && engine.state !== 'checkmate' && engine.state !== 'draw') {
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

    declareShogiJishogi: () => {
        const { engine } = get();
        if (!engine || !(engine instanceof ShogiEngine)) return;
        if (!engine.canDeclareJishogi()) return;

        const result = engine.declareJishogi();
        if (result.result === 'draw') {
            soundManager.playMove();
        } else {
            soundManager.playCheck();
        }

        set({
            engine,
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            history: [...engine.history],
            lastAction: 'move',
            shogiSelectedPiece: null,
            selectedPosition: null,
            legalMoves: []
        });
    },
});
