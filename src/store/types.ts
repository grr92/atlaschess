import type { StateCreator } from 'zustand';
import type { Position, GameState, Move, PieceColor } from '../types';
import type { BaseEngine } from '../core/engine/BaseEngine';

export type GameMode = 'pvp' | 'vs_ai';
export type AiDifficulty = 'easy' | 'medium' | 'hard';

export interface GameSliceState {
    engine: BaseEngine | null;
    selectedPosition: Position | null;
    legalMoves: Position[];
    gameState: GameState;
    currentTurn: PieceColor;
    history: Move[];
    currentVariantId: string;
    pendingPromotion: { from: Position; to: Position } | null;
    pendingCitadelChoice: { from: Position; to: Position; royals: { id: string; name: string }[] } | null;
    pendingSuccessionChoice: { color: PieceColor; royals: { id: string; name: string }[] } | null;
    useDiceRule: boolean;
    currentDiceRoll: number | null;
    isRollingDice: boolean;
    availableDiceValues: number[];
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
    confirmPromotion: (pieceName: string) => void;
    cancelPromotion: () => void;
    confirmCitadelSwap: (chosenRoyalId?: string) => void;
    confirmCitadelDraw: () => void;
    cancelCitadelChoice: () => void;
    confirmSuccession: (chosenRoyalId: string) => void;
    rollDiceForCurrentTurn: (engineOverride?: BaseEngine, turnOverride?: PieceColor) => void;
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
    saveGame: () => void;
    loadGame: (jsonData: string) => boolean;
}

export type GameStore = GameSliceState &
    GameSliceActions &
    AiSliceState &
    AiSliceActions &
    SaveLoadSliceState &
    SaveLoadSliceActions;

export type StoreSlice<T> = StateCreator<GameStore, [], [], T>;
