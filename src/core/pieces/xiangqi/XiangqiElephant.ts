import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class XiangqiElephant extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'XiangqiElephant');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;
        const dirs = [
            { dx: 2, dy: 2, bx: 1, by: 1 },
            { dx: 2, dy: -2, bx: 1, by: -1 },
            { dx: -2, dy: 2, bx: -1, by: 1 },
            { dx: -2, dy: -2, bx: -1, by: -1 }
        ];

        for (const { dx, dy, bx, by } of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            
            // Check if inside board
            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                // Elephant cannot cross the river
                const sameSide = this.color === 'red' ? (ny >= 5) : (ny <= 4);
                
                if (sameSide) {
                    // Check elephant's eye (blocker)
                    const blockPiece = board.getPieceAt(x + bx, y + by);
                    if (!blockPiece) {
                        const targetPiece = board.getPieceAt(nx, ny);
                        if (!targetPiece || targetPiece.color !== this.color) {
                            moves.push({ x: nx, y: ny });
                        }
                    }
                }
            }
        }

        return moves;
    }
}
