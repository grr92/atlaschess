// src/core/variants/GameVariant.ts
import { Board } from '../models/Board';

export interface GameVariant {
    readonly name: string;
    setupBoard(options?: unknown): Board;
}