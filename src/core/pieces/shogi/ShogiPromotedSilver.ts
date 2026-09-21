import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getGoldMoves } from './shogiCommon';

export class ShogiPromotedSilver extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiPromotedSilver');
    }

    getPossibleMoves(board: Board): Position[] {
        return getGoldMoves(board, this.color, this.position);
    }
}
