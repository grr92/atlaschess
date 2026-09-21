import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getGoldMoves } from './shogiCommon';

export class ShogiGold extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiGold');
    }

    getPossibleMoves(board: Board): Position[] {
        return getGoldMoves(board, this.color, this.position);
    }
}
