import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getSlidingMoves, getStepMoves } from './shogiCommon';

export class ShogiDragon extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiDragon');
    }

    getPossibleMoves(board: Board): Position[] {
        const orthogonalDirs = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];
        const diagonalSteps = [
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];

        const slidingMoves = getSlidingMoves(board, this.color, this.position, orthogonalDirs);
        const stepMoves = getStepMoves(board, this.color, this.position, diagonalSteps);

        return [...slidingMoves, ...stepMoves];
    }
}
