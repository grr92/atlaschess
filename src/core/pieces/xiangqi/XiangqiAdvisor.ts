import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class XiangqiAdvisor extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'XiangqiAdvisor');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;
        const dirs = [{ dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }];

        for (const { dx, dy } of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            
            // Check if inside board
            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                // Check if inside palace
                const inPalace = this.color === 'red'
                    ? (nx >= 3 && nx <= 5 && ny >= 7 && ny <= 9)
                    : (nx >= 3 && nx <= 5 && ny >= 0 && ny <= 2);
                
                if (inPalace) {
                    const targetPiece = board.getPieceAt(nx, ny);
                    if (!targetPiece || targetPiece.color !== this.color) {
                        moves.push({ x: nx, y: ny });
                    }
                }
            }
        }

        return moves;
    }
}
