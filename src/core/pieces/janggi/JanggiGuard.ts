import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiGuard extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiGuard');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        const isBlue = this.color === 'blue';
        const minRow = isBlue ? 7 : 0;
        const maxRow = isBlue ? 9 : 2;
        const centerRow = isBlue ? 8 : 1;

        // Orthogonal moves within own palace
        const orthoDirs = [
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 }
        ];

        for (const { dx, dy } of orthoDirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 3 && nx <= 5 && ny >= minRow && ny <= maxRow) {
                const target = board.getPieceAt(nx, ny);
                if (!target || target.color !== this.color) {
                    moves.push({ x: nx, y: ny });
                }
            }
        }

        // Diagonal moves along drawn palace lines
        const isCenter = x === 4 && y === centerRow;
        if (isCenter) {
            const corners = [
                { x: 3, y: minRow },
                { x: 5, y: minRow },
                { x: 3, y: maxRow },
                { x: 5, y: maxRow }
            ];
            for (const c of corners) {
                const target = board.getPieceAt(c.x, c.y);
                if (!target || target.color !== this.color) {
                    moves.push(c);
                }
            }
        } else {
            const isCorner = (x === 3 || x === 5) && (y === minRow || y === maxRow);
            if (isCorner) {
                const center = { x: 4, y: centerRow };
                const target = board.getPieceAt(center.x, center.y);
                if (!target || target.color !== this.color) {
                    moves.push(center);
                }
            }
        }

        return moves;
    }
}
