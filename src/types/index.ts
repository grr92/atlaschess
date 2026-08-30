export type PieceColor = 'white' | 'black';

export interface Position {
    x: number;
    y: number;
}

import type { Piece } from '../core/pieces/Piece.ts';

export interface Move {
    piece: Piece;
    from: Position;
    to: Position;
    capturedPiece?: Piece | null;
    san?: string // For saving the san notation.
}

export type GameState = 'playing' | 'check' | 'checkmate' | 'draw';