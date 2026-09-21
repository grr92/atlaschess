import { create } from 'zustand';
import type { GameStore } from './types';
import { createGameSlice } from './slices/gameSlice';
import { createAiSlice } from './slices/aiSlice';
import { createSaveLoadSlice } from './slices/saveLoadSlice';
import { createSittuyinSlice } from './slices/sittuyinSlice';
import { createShogiSlice } from './slices/shogiSlice';

export type { GameMode, AiDifficulty, GameStore } from './types';

export const useGameStore = create<GameStore>()((...a) => ({
    ...createGameSlice(...a),
    ...createAiSlice(...a),
    ...createSaveLoadSlice(...a),
    ...createSittuyinSlice(...a),
    ...createShogiSlice(...a),
}));