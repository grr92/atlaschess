export type PieceColor = 'white' | 'black' | 'red' | 'green' | 'yellow' | 'blue';

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
    | 'GrantKing' | 'Aanca' | 'Unicorn' | 'Lion' | 'Crocodile' | 'Grantpawn'
    // Courier Chess
    | 'CourierKing' | 'Courier' | 'CourierBishop' | 'CourierQueen' | 'Schleich' | 'Sage' | 'CourierPawn'
    // Chaturaji (Four Kings)
    | 'ChaturajiKing' | 'ChaturajiElephant' | 'ChaturajiHorse' | 'ChaturajiBoat' | 'ChaturajiPawn'
    // Four Seasons Chess (Acedrex de los Cuatro Tiempos)
    | 'FourSeasonsKing' | 'FourSeasonsGeneral' | 'FourSeasonsRook' | 'FourSeasonsKnight' | 'FourSeasonsBishop' | 'FourSeasonsPawn'
    // Xiangqi
    | 'XiangqiGeneral' | 'XiangqiAdvisor' | 'XiangqiElephant' | 'XiangqiHorse' | 'XiangqiChariot' | 'XiangqiCannon' | 'XiangqiSoldier'
    // Janggi
    | 'JanggiGeneral' | 'JanggiGuard' | 'JanggiElephant' | 'JanggiHorse' | 'JanggiChariot' | 'JanggiCannon' | 'JanggiSoldier'
    // Makruk (Thai Chess)
    | 'Khun' | 'Met' | 'Khon' | 'Ma' | 'Ruea' | 'Bia' | 'Biangai'
    // Sittuyin (Burmese Chess)
    | 'Mingyi' | 'Sitke' | 'Sin' | 'Myin' | 'Yahhta' | 'Ne'
    // Shogi (Japanese Chess)
    | 'ShogiKing' | 'ShogiRook' | 'ShogiBishop' | 'ShogiGold' | 'ShogiSilver' | 'ShogiKnight' | 'ShogiLance' | 'ShogiPawn'
    | 'ShogiDragon' | 'ShogiHorse' | 'ShogiPromotedSilver' | 'ShogiPromotedKnight' | 'ShogiPromotedLance' | 'ShogiTokin';

import type { Piece } from '../core/pieces/Piece';

export interface Move {
    piece: Piece;
    from: Position;
    to: Position;
    capturedPiece?: Piece | null;
    san?: string;
    crownedSuccessorId?: string;
    citadelSwappedRoyalId?: string;
    rescuedKingPlacement?: { color: PieceColor; pos: Position };
    rescuedKingDeclined?: boolean;
    isPass?: boolean;
    isDrop?: boolean;
    dropPiece?: string;
    isPromotion?: boolean;
    isCheck?: boolean;
}

export type GameState = 'playing' | 'check' | 'checkmate' | 'draw';

// ---------------------------------------------------------------------------
// Engine capability interfaces
// These narrow the BaseEngine type when a specific engine feature is needed,
// avoiding unsafe `as any` casts throughout the store and UI code.
// ---------------------------------------------------------------------------

/** Engines that track sub-turns (e.g. multi-phase turns in Chaturaji). */
export interface ISubTurnEngine {
    subTurn: number;
}

/** Engines where passing the turn may be conditionally forbidden. */
export interface IPassTurnEngine {
    canPassTurn(): boolean;
}

/** Engines that expose a full FEN string for their current position. */
export interface IFenEngine {
    getFen(): string;
}

/** Engines that expose a starting FEN for the initial position. */
export interface IInitialFenEngine {
    initialFen: string;
}

/** Engines that support dropping pieces from hand (e.g. Shogi). */
export interface IDropEngine {
    dropPiece(pieceName: string, pos: { x: number; y: number }): boolean;
}

/** Engines that support in-place pawn promotion (e.g. Sittuyin). */
export interface IInPlacePromotionEngine {
    promotePawnInPlace(pos: { x: number; y: number }): boolean;
}

// Type guards — use these instead of `as any` casts.
export const hasSubTurn = (e: unknown): e is ISubTurnEngine =>
    typeof e === 'object' && e !== null && typeof (e as ISubTurnEngine).subTurn === 'number';

export const hasCanPassTurn = (e: unknown): e is IPassTurnEngine =>
    typeof e === 'object' && e !== null && typeof (e as IPassTurnEngine).canPassTurn === 'function';

export const hasFen = (e: unknown): e is IFenEngine =>
    typeof e === 'object' && e !== null && typeof (e as IFenEngine).getFen === 'function';

export const hasInitialFen = (e: unknown): e is IInitialFenEngine =>
    typeof e === 'object' && e !== null && typeof (e as IInitialFenEngine).initialFen === 'string';

export const hasDropPiece = (e: unknown): e is IDropEngine =>
    typeof e === 'object' && e !== null && typeof (e as IDropEngine).dropPiece === 'function';

export const hasInPlacePromotion = (e: unknown): e is IInPlacePromotionEngine =>
    typeof e === 'object' && e !== null && typeof (e as IInPlacePromotionEngine).promotePawnInPlace === 'function';

export * from './interceptions';