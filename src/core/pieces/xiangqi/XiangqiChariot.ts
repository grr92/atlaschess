import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class XiangqiChariot extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'XiangqiChariot');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;
        const dirs = [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }];

        for (const { dx, dy } of dirs) {
            let nx = x + dx;
            let ny = y + dy;
            while (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const targetPiece = board.getPieceAt(nx, ny);
                if (targetPiece) {
                    if (targetPiece.color !== this.color) {
                        moves.push({ x: nx, y: ny });
                    }
                    break;
                }
                moves.push({ x: nx, y: ny });
                nx += dx;
                ny += dy;
            }
        }

        return moves;
    }
}
