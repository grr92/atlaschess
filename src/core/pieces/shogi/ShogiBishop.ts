import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getSlidingMoves } from './shogiCommon';

export class ShogiBishop extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiBishop');
    }

    getPossibleMoves(board: Board): Position[] {
        const diagonalDirs = [
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];
        return getSlidingMoves(board, this.color, this.position, diagonalDirs);
    }
}
