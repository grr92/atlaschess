import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class XiangqiSoldier extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'XiangqiSoldier');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;
        const forward = this.color === 'red' ? -1 : 1;
        
        // Forward move
        const ny = y + forward;
        if (ny >= 0 && ny < 10) {
            const targetPiece = board.getPieceAt(x, ny);
            if (!targetPiece || targetPiece.color !== this.color) {
                moves.push({ x, y: ny });
            }
        }

        // Check if crossed the river
        const crossedRiver = this.color === 'red' ? y <= 4 : y >= 5;
        
        if (crossedRiver) {
            const sideDirs = [-1, 1];
            for (const dx of sideDirs) {
                const nx = x + dx;
                if (nx >= 0 && nx < 9) {
                    const targetPiece = board.getPieceAt(nx, y);
                    if (!targetPiece || targetPiece.color !== this.color) {
                        moves.push({ x: nx, y });
                    }
                }
            }
        }

        return moves;
    }
}
