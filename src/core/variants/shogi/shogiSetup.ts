import { Board } from '../../models/Board';
import type { PieceColor, Position } from '../../../types';
import { Piece } from '../../pieces/Piece';
import {
    ShogiKing,
    ShogiRook,
    ShogiBishop,
    ShogiGold,
    ShogiSilver,
    ShogiKnight,
    ShogiLance,
    ShogiPawn,
    ShogiDragon,
    ShogiHorse,
    ShogiPromotedSilver,
    ShogiPromotedKnight,
    ShogiPromotedLance,
    ShogiTokin,
} from '../../pieces/piecesIndex';

export const SHOGI_INITIAL_FEN = 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL[] w - - 0 1';

export type ShogiBasePieceName =
    | 'ShogiKing'
    | 'ShogiRook'
    | 'ShogiBishop'
    | 'ShogiGold'
    | 'ShogiSilver'
    | 'ShogiKnight'
    | 'ShogiLance'
    | 'ShogiPawn';

export type ShogiPromotedPieceName =
    | 'ShogiDragon'
    | 'ShogiHorse'
    | 'ShogiPromotedSilver'
    | 'ShogiPromotedKnight'
    | 'ShogiPromotedLance'
    | 'ShogiTokin';

let pieceIdCounter = 1;
export function resetShogiPieceCounter(): void {
    pieceIdCounter = 1;
}

export function createShogiPiece(name: string, color: PieceColor, pos: Position, customId?: string): Piece {
    const id = customId || `${color.slice(0, 1)}_${name.toLowerCase()}_${pieceIdCounter++}`;
    switch (name) {
        case 'ShogiKing': return new ShogiKing(id, color, pos);
        case 'ShogiRook': return new ShogiRook(id, color, pos);
        case 'ShogiBishop': return new ShogiBishop(id, color, pos);
        case 'ShogiGold': return new ShogiGold(id, color, pos);
        case 'ShogiSilver': return new ShogiSilver(id, color, pos);
        case 'ShogiKnight': return new ShogiKnight(id, color, pos);
        case 'ShogiLance': return new ShogiLance(id, color, pos);
        case 'ShogiPawn': return new ShogiPawn(id, color, pos);
        case 'ShogiDragon': return new ShogiDragon(id, color, pos);
        case 'ShogiHorse': return new ShogiHorse(id, color, pos);
        case 'ShogiPromotedSilver': return new ShogiPromotedSilver(id, color, pos);
        case 'ShogiPromotedKnight': return new ShogiPromotedKnight(id, color, pos);
        case 'ShogiPromotedLance': return new ShogiPromotedLance(id, color, pos);
        case 'ShogiTokin': return new ShogiTokin(id, color, pos);
        default: throw new Error(`Unknown Shogi piece name: ${name}`);
    }
}

export function getPromotedPieceName(name: string): string | null {
    switch (name) {
        case 'ShogiPawn': return 'ShogiTokin';
        case 'ShogiLance': return 'ShogiPromotedLance';
        case 'ShogiKnight': return 'ShogiPromotedKnight';
        case 'ShogiSilver': return 'ShogiPromotedSilver';
        case 'ShogiBishop': return 'ShogiHorse';
        case 'ShogiRook': return 'ShogiDragon';
        default: return null;
    }
}

export function getUnpromotedPieceName(name: string): string {
    switch (name) {
        case 'ShogiTokin': return 'ShogiPawn';
        case 'ShogiPromotedLance': return 'ShogiLance';
        case 'ShogiPromotedKnight': return 'ShogiKnight';
        case 'ShogiPromotedSilver': return 'ShogiSilver';
        case 'ShogiHorse': return 'ShogiBishop';
        case 'ShogiDragon': return 'ShogiRook';
        default: return name;
    }
}

export function isPiecePromoted(name: string): boolean {
    return [
        'ShogiDragon',
        'ShogiHorse',
        'ShogiPromotedSilver',
        'ShogiPromotedKnight',
        'ShogiPromotedLance',
        'ShogiTokin'
    ].includes(name);
}

export function pieceNameToUciChar(name: string): string {
    switch (name) {
        case 'ShogiPawn': return 'P';
        case 'ShogiLance': return 'L';
        case 'ShogiKnight': return 'N';
        case 'ShogiSilver': return 'S';
        case 'ShogiGold': return 'G';
        case 'ShogiBishop': return 'B';
        case 'ShogiRook': return 'R';
        case 'ShogiKing': return 'K';
        case 'ShogiTokin': return '+P';
        case 'ShogiPromotedLance': return '+L';
        case 'ShogiPromotedKnight': return '+N';
        case 'ShogiPromotedSilver': return '+S';
        case 'ShogiHorse': return '+B';
        case 'ShogiDragon': return '+R';
        default: return 'P';
    }
}

export function uciCharToPieceName(char: string): string {
    const isPromoted = char.startsWith('+');
    const baseChar = isPromoted ? char.slice(1).toUpperCase() : char.toUpperCase();

    if (isPromoted) {
        switch (baseChar) {
            case 'P': return 'ShogiTokin';
            case 'L': return 'ShogiPromotedLance';
            case 'N': return 'ShogiPromotedKnight';
            case 'S': return 'ShogiPromotedSilver';
            case 'B': return 'ShogiHorse';
            case 'R': return 'ShogiDragon';
        }
    }

    switch (baseChar) {
        case 'P': return 'ShogiPawn';
        case 'L': return 'ShogiLance';
        case 'N': return 'ShogiKnight';
        case 'S': return 'ShogiSilver';
        case 'G': return 'ShogiGold';
        case 'B': return 'ShogiBishop';
        case 'R': return 'ShogiRook';
        case 'K': return 'ShogiKing';
        default: return 'ShogiPawn';
    }
}

/**
 * Initializes a standard 9x9 Shogi board with 40 pieces.
 */
export function setupShogiBoard(): Board {
    resetShogiPieceCounter();
    const board = new Board(9, 9);

    // Gote (Black / Top player) - Rows 0, 1, 2
    // Row 0 (Rank 9): Lance, Knight, Silver, Gold, King, Gold, Silver, Knight, Lance
    board.setPiece(createShogiPiece('ShogiLance', 'black', { x: 0, y: 0 }), 0, 0);
    board.setPiece(createShogiPiece('ShogiKnight', 'black', { x: 1, y: 0 }), 1, 0);
    board.setPiece(createShogiPiece('ShogiSilver', 'black', { x: 2, y: 0 }), 2, 0);
    board.setPiece(createShogiPiece('ShogiGold', 'black', { x: 3, y: 0 }), 3, 0);
    board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);
    board.setPiece(createShogiPiece('ShogiGold', 'black', { x: 5, y: 0 }), 5, 0);
    board.setPiece(createShogiPiece('ShogiSilver', 'black', { x: 6, y: 0 }), 6, 0);
    board.setPiece(createShogiPiece('ShogiKnight', 'black', { x: 7, y: 0 }), 7, 0);
    board.setPiece(createShogiPiece('ShogiLance', 'black', { x: 8, y: 0 }), 8, 0);

    // Row 1 (Rank 8): Rook at b8 (x=1), Bishop at h8 (x=7)
    board.setPiece(createShogiPiece('ShogiRook', 'black', { x: 1, y: 1 }), 1, 1);
    board.setPiece(createShogiPiece('ShogiBishop', 'black', { x: 7, y: 1 }), 7, 1);

    // Row 2 (Rank 7): 9 Pawns
    for (let x = 0; x < 9; x++) {
        board.setPiece(createShogiPiece('ShogiPawn', 'black', { x, y: 2 }), x, 2);
    }

    // Sente (White / Bottom player) - Rows 6, 7, 8
    // Row 6 (Rank 3): 9 Pawns
    for (let x = 0; x < 9; x++) {
        board.setPiece(createShogiPiece('ShogiPawn', 'white', { x, y: 6 }), x, 6);
    }

    // Row 7 (Rank 2): Bishop at b2 (x=1), Rook at h2 (x=7)
    board.setPiece(createShogiPiece('ShogiBishop', 'white', { x: 1, y: 7 }), 1, 7);
    board.setPiece(createShogiPiece('ShogiRook', 'white', { x: 7, y: 7 }), 7, 7);

    // Row 8 (Rank 1): Lance, Knight, Silver, Gold, King, Gold, Silver, Knight, Lance
    board.setPiece(createShogiPiece('ShogiLance', 'white', { x: 0, y: 8 }), 0, 8);
    board.setPiece(createShogiPiece('ShogiKnight', 'white', { x: 1, y: 8 }), 1, 8);
    board.setPiece(createShogiPiece('ShogiSilver', 'white', { x: 2, y: 8 }), 2, 8);
    board.setPiece(createShogiPiece('ShogiGold', 'white', { x: 3, y: 8 }), 3, 8);
    board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
    board.setPiece(createShogiPiece('ShogiGold', 'white', { x: 5, y: 8 }), 5, 8);
    board.setPiece(createShogiPiece('ShogiSilver', 'white', { x: 6, y: 8 }), 6, 8);
    board.setPiece(createShogiPiece('ShogiKnight', 'white', { x: 7, y: 8 }), 7, 8);
    board.setPiece(createShogiPiece('ShogiLance', 'white', { x: 8, y: 8 }), 8, 8);

    return board;
}
