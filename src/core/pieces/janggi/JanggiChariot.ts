import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiChariot extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiChariot');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        // Orthogonal sliding moves (like a Rook)
        const orthoDirs = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        for (const { dx, dy } of orthoDirs) {
            let nx = x + dx;
            let ny = y + dy;
            while (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const target = board.getPieceAt(nx, ny);
                if (!target) {
                    moves.push({ x: nx, y: ny });
                } else {
                    if (target.color !== this.color) {
                        moves.push({ x: nx, y: ny });
                    }
                    break;
                }
                nx += dx;
                ny += dy;
            }
        }

        // Diagonal sliding within palaces (either Blue or Red palace)
        const palaces = [
            { minRow: 0, maxRow: 2, centerRow: 1 },
            { minRow: 7, maxRow: 9, centerRow: 8 }
        ];

        for (const palace of palaces) {
            const { minRow, maxRow, centerRow } = palace;
            let diagDirs: { dx: number; dy: number }[] = [];

            if (x === 4 && y === centerRow) {
                diagDirs = [
                    { dx: 1, dy: 1 },
                    { dx: -1, dy: 1 },
                    { dx: 1, dy: -1 },
                    { dx: -1, dy: -1 }
                ];
            } else if (x === 3 && y === minRow) {
                diagDirs = [{ dx: 1, dy: 1 }];
            } else if (x === 5 && y === minRow) {
                diagDirs = [{ dx: -1, dy: 1 }];
            } else if (x === 3 && y === maxRow) {
                diagDirs = [{ dx: 1, dy: -1 }];
            } else if (x === 5 && y === maxRow) {
                diagDirs = [{ dx: -1, dy: -1 }];
            }

            for (const { dx, dy } of diagDirs) {
                let nx = x + dx;
                let ny = y + dy;
                while (nx >= 3 && nx <= 5 && ny >= minRow && ny <= maxRow) {
                    const target = board.getPieceAt(nx, ny);
                    if (!target) {
                        moves.push({ x: nx, y: ny });
                    } else {
                        if (target.color !== this.color) {
                            moves.push({ x: nx, y: ny });
                        }
                        break;
                    }
                    nx += dx;
                    ny += dy;
                }
            }
        }

        return moves;
    }
}
