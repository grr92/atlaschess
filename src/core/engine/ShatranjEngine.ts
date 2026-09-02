import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Position } from '../../types';
import { Piece, Ferz } from '../pieces/piecesIndex';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { BareKingVictoryStrategy } from './strategies/VictoryStrategy';

export class ShatranjEngine extends BaseEngine {
    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('Shah'),
            new BareKingVictoryStrategy({ stalemateIsWin: true })
        );
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position): void {
        // Pawns automatically promote to Ferz when reaching the last rank.
        if (piece.name === 'Sarbaz') {
            const promotionRank = piece.color === 'white' ? 0 : this.board.rows - 1;
            if (to.y === promotionRank) {
                const newFerz = new Ferz(`${piece.id}_promoted`, piece.color, { x: to.x, y: to.y });
                this.board.setPiece(newFerz, to.x, to.y);
            }
        }
    }
}