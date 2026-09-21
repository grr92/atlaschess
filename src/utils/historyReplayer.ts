import type { BaseEngine } from '../core/engine/BaseEngine';
import type { Move } from '../types';
import { TamerlaneEngine } from '../core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../core/engine/ChaturajiEngine';
import { SittuyinEngine } from '../core/engine/SittuyinEngine';
import { ShogiEngine } from '../core/engine/ShogiEngine';
import { uciCharToPieceName } from '../core/variants/shogi/shogiSetup';

/**
 * Replays a single recorded move on an engine instance, handling variant-specific
 * mechanics such as promotions, pass turns, citadel swaps, royal successions,
 * and Chaturaji king rescues.
 */
export function replayMove(engine: BaseEngine, move: Move): void {
    if (move.isPass || move.san === 'pass') {
        engine.passTurn();
        return;
    }

    if (engine instanceof ShogiEngine) {
        if (move.isDrop && move.dropPiece) {
            engine.dropPiece(move.dropPiece, move.to);
            return;
        }
        if (move.san?.includes('@')) {
            const [pieceChar] = move.san.split('@');
            const pieceName = uciCharToPieceName(pieceChar);
            engine.dropPiece(pieceName, move.to);
            return;
        }
        const promo = move.isPromotion || move.san?.endsWith('+') ? '+' : undefined;
        engine.executeMove(move.from, move.to, promo);
        return;
    }

    if (move.from.x === move.to.x && move.from.y === move.to.y) {
        if (engine instanceof SittuyinEngine) {
            engine.promotePawnInPlace(move.to);
            return;
        }
    }

    let promotionPiece: string | undefined = undefined;

    if (move.san?.includes('=Q')) promotionPiece = 'Queen';
    else if (move.san?.includes('=R')) promotionPiece = 'Rook';
    else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
    else if (move.san?.includes('=N')) promotionPiece = 'Knight';
    else if (move.san?.includes('=F')) promotionPiece = 'Ferz';

    if (move.citadelSwappedRoyalId && engine instanceof TamerlaneEngine) {
        engine.executeCitadelSwap(move.from, move.to, move.citadelSwappedRoyalId);
    } else {
        engine.executeMove(move.from, move.to, promotionPiece);
    }

    if (move.crownedSuccessorId && engine instanceof TamerlaneEngine) {
        engine.crownSuccessor(move.crownedSuccessorId);
    }

    if (engine instanceof ChaturajiEngine) {
        if (move.rescuedKingPlacement) {
            engine.confirmKingRescue();
            engine.placeRescuedKing(move.rescuedKingPlacement.pos);
        } else if (move.rescuedKingDeclined || engine.pendingKingRescueChoice) {
            engine.declineKingRescue();
        }
    }
}

/**
 * Sequentially replays a list of moves onto an engine instance.
 */
export function replayHistory(engine: BaseEngine, history: Move[]): void {
    for (const move of history) {
        replayMove(engine, move);
    }
}
