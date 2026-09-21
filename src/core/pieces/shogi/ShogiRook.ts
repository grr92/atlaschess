import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getSlidingMoves } from './shogiCommon';

export class ShogiRook extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiRook');
    }

    getPossibleMoves(board: Board): Position[] {
        const orthogonalDirs = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];
        return getSlidingMoves(board, this.color, this.position, orthogonalDirs);
    }
}
