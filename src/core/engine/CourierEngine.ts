import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Position } from '../../types';
import { Piece, CourierQueen } from '../pieces/piecesIndex';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { StandardVictoryStrategy } from './strategies/VictoryStrategy';

export class CourierEngine extends BaseEngine {
    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('CourierKing'),
            new StandardVictoryStrategy({ stalemateIsWin: false })
        );
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position): void {
        // Courier Pawns automatically promote to CourierQueen upon reaching the last rank
        if (piece.name === 'CourierPawn') {
            const promotionRank = piece.color === 'white' ? 0 : this.board.rows - 1;
            if (to.y === promotionRank) {
                const newQueen = new CourierQueen(`${piece.id}_promoted`, piece.color, { x: to.x, y: to.y });
                this.board.setPiece(newQueen, to.x, to.y);
            }
        }
    }
}
