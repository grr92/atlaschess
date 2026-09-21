import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getStepMoves } from './shogiCommon';

export class ShogiKnight extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiKnight');
    }

    getPossibleMoves(board: Board): Position[] {
        const forwardY = this.color === 'white' ? -1 : 1;
        const knightOffsets = [
            { dx: -1, dy: 2 * forwardY },
            { dx: 1, dy: 2 * forwardY }
        ];
        return getStepMoves(board, this.color, this.position, knightOffsets);
    }
}
