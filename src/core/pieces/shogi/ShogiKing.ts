import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { getStepMoves } from './shogiCommon';

export class ShogiKing extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'ShogiKing');
    }

    getPossibleMoves(board: Board): Position[] {
        const kingOffsets = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];
        return getStepMoves(board, this.color, this.position, kingOffsets);
    }
}
