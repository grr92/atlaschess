export type PieceColor = 'white' | 'black';

export interface Position {
    x: number;
    y: number;
}

// Strict union of all available piece names in the system
export type PieceName =
    // Classic Chess
    | 'King' | 'Queen' | 'Rook' | 'Bishop' | 'Knight' | 'Pawn'
    // Chaturanga
    | 'Raja' | 'Mantri' | 'Ratha' | 'Gaja' | 'Asva' | 'Padati'
    // Shatranj
    | 'Shah' | 'Ferz' | 'Rukh' | 'Pil' | 'Asb' | 'Sarbaz'
    // Tamerlane Chess
    | 'TamerlaneKing' | 'Shahzada' | 'AdventitiousShah' | 'General' | 'Wazir'
    | 'Giraffe' | 'Zurafa' | 'Picket' | 'Talia' | 'Elephant' | 'Camel' | 'Jamal'
    | 'WarEngine' | 'Dabbaba'
    | 'Pawn of Pawns' | 'Pawn of War Engines' | 'Pawn of Dabbaba' | 'Pawn of Camels'
    | 'Pawn of Jamal' | 'Pawn of Elephants' | 'Pawn of Pil' | 'Pawn of Generals'
    | 'Pawn of Wazir' | 'Pawn of Kings' | 'Pawn of Shah' | 'Pawn of Viziers'
    | 'Pawn of Ferz' | 'Pawn of Giraffes' | 'Pawn of Zurafa' | 'Pawn of Pickets'
    | 'Pawn of Talia' | 'Pawn of Knights' | 'Pawn of Asb' | 'Pawn of Rooks' | 'Pawn of Rukh'
    // Grant Acedrex
    | 'GrantKing' | 'Aanca' | 'Unicorn' | 'Unicornio' | 'Lion' | 'Crocodile' | 'Grantpawn';

import type { Piece } from '../core/pieces/Piece.ts';

export interface Move {
    piece: Piece;
    from: Position;
    to: Position;
    capturedPiece?: Piece | null;
    san?: string;
    crownedSuccessorId?: string;
    citadelSwappedRoyalId?: string;
}

export type GameState = 'playing' | 'check' | 'checkmate' | 'draw';