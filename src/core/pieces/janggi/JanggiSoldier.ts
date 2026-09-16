import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiSoldier extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiSoldier');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;
        const forward = this.color === 'blue' ? -1 : 1;

        // Forward and sideways directions
        const dirs = [
            { dx: 0, dy: forward },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        for (const { dx, dy } of dirs) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const targetPiece = board.getPieceAt(nx, ny);
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push({ x: nx, y: ny });
                }
            }
        }

        // Soldiers may also move one point diagonally forward along the diagonal lines of the enemy palace
        const palaceDiagMoves: Position[] = [];
        if (this.color === 'blue') {
            // Enemy (Red) palace: rows 0-2, cols 3-5, center (4, 1)
            if (x === 3 && y === 2) palaceDiagMoves.push({ x: 4, y: 1 });
            else if (x === 5 && y === 2) palaceDiagMoves.push({ x: 4, y: 1 });
            else if (x === 4 && y === 1) {
                palaceDiagMoves.push({ x: 3, y: 0 });
                palaceDiagMoves.push({ x: 5, y: 0 });
            }
        } else {
            // Enemy (Blue) palace: rows 7-9, cols 3-5, center (4, 8)
            if (x === 3 && y === 7) palaceDiagMoves.push({ x: 4, y: 8 });
            else if (x === 5 && y === 7) palaceDiagMoves.push({ x: 4, y: 8 });
            else if (x === 4 && y === 8) {
                palaceDiagMoves.push({ x: 3, y: 9 });
                palaceDiagMoves.push({ x: 5, y: 9 });
            }
        }

        for (const dest of palaceDiagMoves) {
            const targetPiece = board.getPieceAt(dest.x, dest.y);
            if (!targetPiece || targetPiece.color !== this.color) {
                moves.push(dest);
            }
        }

        return moves;
    }
}
