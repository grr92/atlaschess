import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getSlidingMoves } from './shogiCommon';

export class ShogiLance extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiLance');
    }

    getPossibleMoves(board: Board): Position[] {
        const forwardY = this.color === 'white' ? -1 : 1;
        return getSlidingMoves(board, this.color, this.position, [{ dx: 0, dy: forwardY }]);
    }
}
