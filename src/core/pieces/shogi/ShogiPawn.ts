import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getStepMoves } from './shogiCommon';

export class ShogiPawn extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiPawn');
    }

    getPossibleMoves(board: Board): Position[] {
        const forwardY = this.color === 'white' ? -1 : 1;
        return getStepMoves(board, this.color, this.position, [{ dx: 0, dy: forwardY }]);
    }
}
