import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getSlidingMoves, getStepMoves } from './shogiCommon';

export class ShogiHorse extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiHorse');
    }

    getPossibleMoves(board: Board): Position[] {
        const diagonalDirs = [
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];
        const orthogonalSteps = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];

        const slidingMoves = getSlidingMoves(board, this.color, this.position, diagonalDirs);
        const stepMoves = getStepMoves(board, this.color, this.position, orthogonalSteps);

        return [...slidingMoves, ...stepMoves];
    }
}
