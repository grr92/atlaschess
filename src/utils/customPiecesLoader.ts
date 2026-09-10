import type { BaseEngine } from '../core/engine/BaseEngine';
import type { PieceColor } from '../types';
import type { Piece } from '../core/pieces/Piece';
import {
    King, Queen, Rook, Bishop, Knight, Pawn,
    Shah, Shahzada, AdventitiousShah, Dabbaba, Jamal, Talia, Wazir, Zurafa, TamerlanePawn,
    Ferz, Pil, Asb, Rukh, Raja, Ratha, Asva, Mantri, Gaja, Padati, Sarbaz,
    ChaturajiKing, ChaturajiElephant, ChaturajiHorse, ChaturajiBoat, ChaturajiPawn,
    GrantKing, Aanca, Unicorn, Lion, Giraffe, Crocodile, GrantPawn,
    CourierKing, Courier, CourierBishop, CourierQueen, Schleich, Sage,
    FourSeasonsKing, FourSeasonsGeneral, FourSeasonsRook, FourSeasonsKnight, FourSeasonsBishop, FourSeasonsPawn
} from '../core/pieces/piecesIndex';
import { FourSeasonsEngine } from '../core/engine/FourSeasonsEngine';

export function populateCustomPieces(
    engine: BaseEngine,
    customPieces: any[],
    currentTurn?: PieceColor,
    annexedArmies?: any
): void {
    engine.board.clear();

    for (const p of customPieces) {
        let pieceInstance: Piece | null = null;
        switch (p.name) {
            case 'Shah': pieceInstance = new Shah(p.id, p.color, p.position); break;
            case 'Shahzada': pieceInstance = new Shahzada(p.id, p.color, p.position); break;
            case 'AdventitiousShah': pieceInstance = new AdventitiousShah(p.id, p.color, p.position); break;
            case 'Dabbaba': pieceInstance = new Dabbaba(p.id, p.color, p.position); break;
            case 'Jamal': pieceInstance = new Jamal(p.id, p.color, p.position); break;
            case 'Talia': pieceInstance = new Talia(p.id, p.color, p.position); break;
            case 'Zurafa': pieceInstance = new Zurafa(p.id, p.color, p.position); break;
            case 'Wazir': pieceInstance = new Wazir(p.id, p.color, p.position); break;
            case 'Ferz': pieceInstance = new Ferz(p.id, p.color, p.position); break;
            case 'Pil': pieceInstance = new Pil(p.id, p.color, p.position); break;
            case 'Asb': pieceInstance = new Asb(p.id, p.color, p.position); break;
            case 'Rukh': pieceInstance = new Rukh(p.id, p.color, p.position); break;
            case 'TamerlanePawn': {
                const tp = new TamerlanePawn(p.id, p.color, p.position, p.pawnType, p.pawnName);
                if (p.promotionStage !== undefined) tp.promotionStage = p.promotionStage;
                if (p.isRestingOnLastRank !== undefined) tp.isRestingOnLastRank = p.isRestingOnLastRank;
                pieceInstance = tp;
                break;
            }
            // Chaturaji
            case 'ChaturajiKing': pieceInstance = new ChaturajiKing(p.id, p.color, p.position); break;
            case 'ChaturajiElephant': pieceInstance = new ChaturajiElephant(p.id, p.color, p.position); break;
            case 'ChaturajiHorse': pieceInstance = new ChaturajiHorse(p.id, p.color, p.position); break;
            case 'ChaturajiBoat': pieceInstance = new ChaturajiBoat(p.id, p.color, p.position); break;
            case 'ChaturajiPawn': pieceInstance = new ChaturajiPawn(p.id, p.color, p.position); break;
            // Grant Acedrex
            case 'GrantKing': pieceInstance = new GrantKing(p.id, p.color, p.position); break;
            case 'Aanca': pieceInstance = new Aanca(p.id, p.color, p.position); break;
            case 'Unicorn': pieceInstance = new Unicorn(p.id, p.color, p.position); break;
            case 'Lion': pieceInstance = new Lion(p.id, p.color, p.position); break;
            case 'Giraffe': pieceInstance = new Giraffe(p.id, p.color, p.position); break;
            case 'Crocodile': pieceInstance = new Crocodile(p.id, p.color, p.position); break;
            case 'GrantPawn': {
                const originFile = p.originFile !== undefined ? p.originFile : p.position.x;
                const gp = new GrantPawn(p.id, p.color, p.position, originFile);
                pieceInstance = gp;
                break;
            }
            // Courier Chess
            case 'CourierKing': pieceInstance = new CourierKing(p.id, p.color, p.position); break;
            case 'Courier': pieceInstance = new Courier(p.id, p.color, p.position); break;
            case 'CourierBishop': pieceInstance = new CourierBishop(p.id, p.color, p.position); break;
            case 'CourierQueen': pieceInstance = new CourierQueen(p.id, p.color, p.position); break;
            case 'Schleich': pieceInstance = new Schleich(p.id, p.color, p.position); break;
            case 'Sage': pieceInstance = new Sage(p.id, p.color, p.position); break;
            // Four Seasons Chess
            case 'FourSeasonsKing': pieceInstance = new FourSeasonsKing(p.id, p.color, p.position); break;
            case 'FourSeasonsGeneral': pieceInstance = new FourSeasonsGeneral(p.id, p.color, p.position); break;
            case 'FourSeasonsRook': pieceInstance = new FourSeasonsRook(p.id, p.color, p.position); break;
            case 'FourSeasonsKnight': pieceInstance = new FourSeasonsKnight(p.id, p.color, p.position); break;
            case 'FourSeasonsBishop': pieceInstance = new FourSeasonsBishop(p.id, p.color, p.position); break;
            case 'FourSeasonsPawn': {
                const dir = p.direction || { dx: 0, dy: 1 };
                pieceInstance = new FourSeasonsPawn(p.id, p.color, p.position, dir);
                break;
            }
            // Chaturanga & Classic
            case 'Raja': pieceInstance = new Raja(p.id, p.color, p.position); break;
            case 'Ratha': pieceInstance = new Ratha(p.id, p.color, p.position); break;
            case 'Asva': pieceInstance = new Asva(p.id, p.color, p.position); break;
            case 'Mantri': pieceInstance = new Mantri(p.id, p.color, p.position); break;
            case 'Gaja': pieceInstance = new Gaja(p.id, p.color, p.position); break;
            case 'Padati': pieceInstance = new Padati(p.id, p.color, p.position); break;
            case 'Sarbaz': pieceInstance = new Sarbaz(p.id, p.color, p.position); break;
            case 'King': pieceInstance = new King(p.id, p.color, p.position); break;
            case 'Queen': pieceInstance = new Queen(p.id, p.color, p.position); break;
            case 'Rook': pieceInstance = new Rook(p.id, p.color, p.position); break;
            case 'Bishop': pieceInstance = new Bishop(p.id, p.color, p.position); break;
            case 'Knight': pieceInstance = new Knight(p.id, p.color, p.position); break;
            case 'Pawn': pieceInstance = new Pawn(p.id, p.color, p.position); break;
        }
        if (pieceInstance) {
            engine.board.setPiece(pieceInstance, p.position.x, p.position.y);
        }
    }

    if (currentTurn) {
        engine.currentTurn = currentTurn;
    }
    if (engine instanceof FourSeasonsEngine && annexedArmies) {
        engine.annexedArmies = annexedArmies;
    }
    engine.updateGameState();
}
