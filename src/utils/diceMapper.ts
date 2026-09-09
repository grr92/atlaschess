import type { BaseEngine } from '../core/engine/BaseEngine';
import type { PieceColor } from '../types';
import { ChaturajiEngine } from '../core/engine/ChaturajiEngine';

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

// Chaturaji historical 4-sided (or 6-sided) die mapping:
// 1 or 5: King (Raja) or Pawn (Padati)
// 2: Boat (Nauka)
// 3: Horse (Ghoda / Ashva)
// 4 or 6: Elephant (Hathi)
export const CHATURAJI_DICE_PIECE_MAP: Record<number, string[]> = {
    1: ['ChaturajiKing', 'ChaturajiPawn'],
    2: ['ChaturajiBoat'],
    3: ['ChaturajiHorse'],
    4: ['ChaturajiElephant'],
};

export const isPieceAllowedByDice = (pieceName: string, diceRoll: number, variantId?: string): boolean => {
    if (variantId === 'chaturaji') {
        const normalizedRoll = diceRoll === 5 ? 1 : (diceRoll === 6 ? 4 : diceRoll);
        const allowed = CHATURAJI_DICE_PIECE_MAP[normalizedRoll];
        return allowed ? allowed.includes(pieceName) : false;
    }
    return DICE_PIECE_MAP[diceRoll] === pieceName;
};

// Scans the current board and returns only the dice numbers corresponding to active pieces with legal moves
export const getAvailableDiceNumbers = (engine: BaseEngine, color: PieceColor, variantId?: string): number[] => {
    if (variantId === 'chaturaji' || engine instanceof ChaturajiEngine) {
        const availableNumbers = new Set<number>();
        for (const piece of engine.board.getAllPieces()) {
            if (engine.isPieceControllableByCurrentTurn(piece) && engine.getLegalMoves(piece).length > 0) {
                if (piece.name === 'ChaturajiKing' || piece.name === 'ChaturajiPawn') {
                    availableNumbers.add(1);
                } else if (piece.name === 'ChaturajiBoat') {
                    availableNumbers.add(2);
                } else if (piece.name === 'ChaturajiHorse') {
                    availableNumbers.add(3);
                } else if (piece.name === 'ChaturajiElephant') {
                    availableNumbers.add(4);
                }
            }
        }
        return Array.from(availableNumbers).sort((a, b) => a - b);
    }

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
