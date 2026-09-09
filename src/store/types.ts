import type { StateCreator } from 'zustand';
import type { Position, GameState, Move, PieceColor, GameInterception, InterceptionDecision } from '../types';
import type { BaseEngine } from '../core/engine/BaseEngine';

export type GameMode = 'pvp' | 'vs_ai';
export type AiDifficulty = 'easy' | 'medium' | 'hard';
export type AppLanguage = 'en' | 'es' | 'ca';

export interface GameSliceState {
    engine: BaseEngine | null;
    selectedPosition: Position | null;
    legalMoves: Position[];
    gameState: GameState;
    currentTurn: PieceColor;
    history: Move[];
    currentVariantId: string;
    activeInterception: GameInterception | null;
    useDiceRule: boolean;
    subTurn: number;
    currentDiceRoll: number | null;
    isRollingDice: boolean;
    availableDiceValues: number[];
    isMuted: boolean;
    language: AppLanguage;
}

export interface GameSliceActions {
    initGame: (
        variantId?: string,
        gameMode?: GameMode,
        playerColor?: PieceColor,
        aiDifficulty?: AiDifficulty,
        useDiceRule?: boolean
    ) => void;
    selectSquare: (pos: Position) => void;
    resetGame: () => void;
    undoMove: () => void;
    passTurn: () => void;
    resolveInterception: (decision: InterceptionDecision) => void;
    cancelInterception: () => void;
    rollDiceForCurrentTurn: (engineOverride?: BaseEngine, turnOverride?: PieceColor) => void;
    toggleMute: () => void;
    setLanguage: (lang: AppLanguage) => void;
}

export interface AiSliceState {
    gameMode: GameMode;
    playerColor: PieceColor;
    aiDifficulty: AiDifficulty;
    isAiThinking: boolean;
}

export interface AiSliceActions {
    setGameMode: (mode: GameMode, playerColor?: PieceColor) => void;
    setAiDifficulty: (difficulty: AiDifficulty) => void;
    triggerAiMove: () => Promise<void>;
}

export interface SaveLoadSliceState {
    gameTime: number;
}

export interface SaveLoadSliceActions {
    setGameTime: (fn: (prev: number) => number) => void;
    saveGame: () => string | void;
    loadGame: (jsonData: string) => boolean;
}

export type GameStore = GameSliceState &
    GameSliceActions &
    AiSliceState &
    AiSliceActions &
    SaveLoadSliceState &
    SaveLoadSliceActions;

export type StoreSlice<T> = StateCreator<GameStore, [], [], T>;
