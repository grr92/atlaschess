import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getStepMoves } from './shogiCommon';

export class ShogiSilver extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiSilver');
    }

    getPossibleMoves(board: Board): Position[] {
        const forwardY = this.color === 'white' ? -1 : 1;
        const silverOffsets = [
            { dx: 0, dy: forwardY }, // 1 step forward
            { dx: 1, dy: 1 },        // 4 diagonals
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ];
        return getStepMoves(board, this.color, this.position, silverOffsets);
    }
}
