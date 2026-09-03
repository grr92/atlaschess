import type { BaseEngine } from '../core/engine/BaseEngine';
import type { PieceColor } from '../types';

// Alfonso X Libro de los Juegos (1283) hierarchy mapping for the 8-sided die
export const DICE_PIECE_MAP: Record<number, string> = {
    8: 'King',
    7: 'Aanca',
    6: 'Unicorn',
    5: 'Rook',
    4: 'Lion',
    3: 'Crocodile',
    2: 'Giraffe',
    1: 'Grantpawn'
};

export const PIECE_DICE_MAP: Record<string, number> = {
    'King': 8,
    'Aanca': 7,
    'Unicorn': 6,
    'Rook': 5,
    'Lion': 4,
    'Crocodile': 3,
    'Giraffe': 2,
    'Grantpawn': 1
};

// Scans the current board and returns only the dice numbers corresponding to active pieces with legal moves
export const getAvailableDiceNumbers = (engine: BaseEngine, color: PieceColor): number[] => {
    // When in check, Alfonso X rules strictly require evading or resolving the check with the King (die 8)
    if (engine.isKingInCheck(color)) {
        const kingPiece = engine.board.getAllPieces().find(p => p.name === 'King' && p.color === color);
        if (kingPiece && engine.getLegalMoves(kingPiece).length > 0) {
            return [8];
        }
        // If the king has no legal evasion moves, it is checkmate
        return [];
    }

    const availableNumbers = new Set<number>();

    for (const piece of engine.board.getAllPieces()) {
        if (piece.color === color) {
            const diceNum = PIECE_DICE_MAP[piece.name];
            if (diceNum && engine.getLegalMoves(piece).length > 0) {
                availableNumbers.add(diceNum);
            }
        }
    }

    return Array.from(availableNumbers).sort((a, b) => a - b);
};
