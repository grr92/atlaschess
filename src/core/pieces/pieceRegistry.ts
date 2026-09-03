import type { PieceName } from '../../types';

export interface PieceMetadata {
    name: PieceName;
    displayName: string;
    value: number;
    sortOrder: number;
    svgChar: string;
    diceNumber?: number;
}

export const PIECE_REGISTRY: Record<PieceName, PieceMetadata> = {
    // Classic Chess
    King: { name: 'King', displayName: 'King', value: 10000, sortOrder: 0, svgChar: 'k', diceNumber: 8 },
    Queen: { name: 'Queen', displayName: 'Queen', value: 900, sortOrder: 2, svgChar: 'q' },
    Rook: { name: 'Rook', displayName: 'Rook', value: 500, sortOrder: 4, svgChar: 'r', diceNumber: 5 },
    Bishop: { name: 'Bishop', displayName: 'Bishop', value: 330, sortOrder: 6, svgChar: 'b' },
    Knight: { name: 'Knight', displayName: 'Knight', value: 320, sortOrder: 8, svgChar: 'n' },
    Pawn: { name: 'Pawn', displayName: 'Pawn', value: 100, sortOrder: 13, svgChar: 'p' },

    // Chaturanga
    Raja: { name: 'Raja', displayName: 'Raja', value: 10000, sortOrder: 0, svgChar: 'k' },
    Mantri: { name: 'Mantri', displayName: 'Mantri', value: 200, sortOrder: 2, svgChar: 'q' },
    Ratha: { name: 'Ratha', displayName: 'Ratha', value: 500, sortOrder: 4, svgChar: 'r' },
    Gaja: { name: 'Gaja', displayName: 'Gaja', value: 150, sortOrder: 10, svgChar: 'e' },
    Asva: { name: 'Asva', displayName: 'Asva', value: 320, sortOrder: 8, svgChar: 'n' },
    Padati: { name: 'Padati', displayName: 'Padati', value: 100, sortOrder: 13, svgChar: 'p' },

    // Shatranj
    Shah: { name: 'Shah', displayName: 'Shah', value: 10000, sortOrder: 0, svgChar: 'k' },
    Ferz: { name: 'Ferz', displayName: 'Ferz', value: 200, sortOrder: 11, svgChar: 'q' },
    Rukh: { name: 'Rukh', displayName: 'Rukh', value: 500, sortOrder: 4, svgChar: 'r' },
    Pil: { name: 'Pil', displayName: 'Pil', value: 150, sortOrder: 10, svgChar: 'e' },
    Asb: { name: 'Asb', displayName: 'Asb', value: 320, sortOrder: 8, svgChar: 'n' },
    Sarbaz: { name: 'Sarbaz', displayName: 'Sarbaz', value: 100, sortOrder: 13, svgChar: 'p' },

    // Tamerlane Chess
    TamerlaneKing: { name: 'TamerlaneKing', displayName: 'King', value: 10000, sortOrder: 0, svgChar: 'k' },
    Shahzada: { name: 'Shahzada', displayName: 'Shahzada', value: 900, sortOrder: 0, svgChar: 'k' },
    AdventitiousShah: { name: 'AdventitiousShah', displayName: 'Adventitious Shah', value: 900, sortOrder: 0, svgChar: 'k' },
    General: { name: 'General', displayName: 'General', value: 200, sortOrder: 11, svgChar: 'q' },
    Wazir: { name: 'Wazir', displayName: 'Wazir', value: 200, sortOrder: 11, svgChar: 'q' },
    Giraffe: { name: 'Giraffe', displayName: 'Giraffe', value: 250, sortOrder: 5, svgChar: 'g', diceNumber: 2 },
    Zurafa: { name: 'Zurafa', displayName: 'Zurafa', value: 250, sortOrder: 5, svgChar: 'g', diceNumber: 2 },
    Picket: { name: 'Picket', displayName: 'Picket', value: 300, sortOrder: 6, svgChar: 'b' },
    Talia: { name: 'Talia', displayName: 'Talia', value: 300, sortOrder: 6, svgChar: 'b' },
    Elephant: { name: 'Elephant', displayName: 'Elephant', value: 150, sortOrder: 10, svgChar: 'e' },
    Camel: { name: 'Camel', displayName: 'Camel', value: 200, sortOrder: 12, svgChar: 'c' },
    Jamal: { name: 'Jamal', displayName: 'Jamal', value: 200, sortOrder: 12, svgChar: 'c' },
    WarEngine: { name: 'WarEngine', displayName: 'War Engine', value: 150, sortOrder: 10, svgChar: 'd' },
    Dabbaba: { name: 'Dabbaba', displayName: 'Dabbaba', value: 150, sortOrder: 10, svgChar: 'd' },
    'Pawn of Pawns': { name: 'Pawn of Pawns', displayName: 'Pawn of Pawns', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of War Engines': { name: 'Pawn of War Engines', displayName: 'Pawn of War Engines', value: 80, sortOrder: 13, svgChar: 'p' },
    'Pawn of Dabbaba': { name: 'Pawn of Dabbaba', displayName: 'Pawn of Dabbaba', value: 80, sortOrder: 13, svgChar: 'p' },
    'Pawn of Camels': { name: 'Pawn of Camels', displayName: 'Pawn of Camels', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Jamal': { name: 'Pawn of Jamal', displayName: 'Pawn of Jamal', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Elephants': { name: 'Pawn of Elephants', displayName: 'Pawn of Elephants', value: 75, sortOrder: 13, svgChar: 'p' },
    'Pawn of Pil': { name: 'Pawn of Pil', displayName: 'Pawn of Pil', value: 75, sortOrder: 13, svgChar: 'p' },
    'Pawn of Generals': { name: 'Pawn of Generals', displayName: 'Pawn of Generals', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Wazir': { name: 'Pawn of Wazir', displayName: 'Pawn of Wazir', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Kings': { name: 'Pawn of Kings', displayName: 'Pawn of Kings', value: 150, sortOrder: 13, svgChar: 'p' },
    'Pawn of Shah': { name: 'Pawn of Shah', displayName: 'Pawn of Shah', value: 150, sortOrder: 13, svgChar: 'p' },
    'Pawn of Viziers': { name: 'Pawn of Viziers', displayName: 'Pawn of Viziers', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Ferz': { name: 'Pawn of Ferz', displayName: 'Pawn of Ferz', value: 100, sortOrder: 13, svgChar: 'p' },
    'Pawn of Giraffes': { name: 'Pawn of Giraffes', displayName: 'Pawn of Giraffes', value: 125, sortOrder: 13, svgChar: 'p' },
    'Pawn of Zurafa': { name: 'Pawn of Zurafa', displayName: 'Pawn of Zurafa', value: 125, sortOrder: 13, svgChar: 'p' },
    'Pawn of Pickets': { name: 'Pawn of Pickets', displayName: 'Pawn of Pickets', value: 150, sortOrder: 13, svgChar: 'p' },
    'Pawn of Talia': { name: 'Pawn of Talia', displayName: 'Pawn of Talia', value: 150, sortOrder: 13, svgChar: 'p' },
    'Pawn of Knights': { name: 'Pawn of Knights', displayName: 'Pawn of Knights', value: 160, sortOrder: 13, svgChar: 'p' },
    'Pawn of Asb': { name: 'Pawn of Asb', displayName: 'Pawn of Asb', value: 160, sortOrder: 13, svgChar: 'p' },
    'Pawn of Rooks': { name: 'Pawn of Rooks', displayName: 'Pawn of Rooks', value: 250, sortOrder: 13, svgChar: 'p' },
    'Pawn of Rukh': { name: 'Pawn of Rukh', displayName: 'Pawn of Rukh', value: 250, sortOrder: 13, svgChar: 'p' },

    // Grant Acedrex
    GrantKing: { name: 'GrantKing', displayName: 'King', value: 10000, sortOrder: 0, svgChar: 'k', diceNumber: 8 },
    Aanca: { name: 'Aanca', displayName: 'Aanca', value: 950, sortOrder: 1, svgChar: 'a', diceNumber: 7 },
    Unicorn: { name: 'Unicorn', displayName: 'Unicorn', value: 750, sortOrder: 3, svgChar: 'u', diceNumber: 6 },
    Unicornio: { name: 'Unicornio', displayName: 'Unicorn', value: 750, sortOrder: 3, svgChar: 'u', diceNumber: 6 },
    Lion: { name: 'Lion', displayName: 'Lion', value: 350, sortOrder: 7, svgChar: 'l', diceNumber: 4 },
    Crocodile: { name: 'Crocodile', displayName: 'Crocodile', value: 300, sortOrder: 9, svgChar: 'o', diceNumber: 3 },
    Grantpawn: { name: 'Grantpawn', displayName: 'Pawn', value: 100, sortOrder: 13, svgChar: 'p', diceNumber: 1 }
};

export const getPieceMetadata = (name: string): PieceMetadata | undefined => {
    return PIECE_REGISTRY[name as PieceName];
};

export const getPieceValue = (name: string): number => {
    return PIECE_REGISTRY[name as PieceName]?.value ?? 100;
};

export const getPieceSortOrder = (name: string): number => {
    return PIECE_REGISTRY[name as PieceName]?.sortOrder ?? 99;
};

export const getPieceDisplayName = (name: string): string => {
    return PIECE_REGISTRY[name as PieceName]?.displayName ?? name;
};

export const getPieceSvgChar = (name: string): string | null => {
    return PIECE_REGISTRY[name as PieceName]?.svgChar ?? null;
};
