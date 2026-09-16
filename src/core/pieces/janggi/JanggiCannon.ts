import { Piece } from '../Piece';
import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export class JanggiCannon extends Piece {
    constructor(id: string, color: PieceColor, position: Position) {
        super(id, color, position, 'JanggiCannon');
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { x, y } = this.position;

        // 1. Orthogonal movement (must jump over exactly 1 piece to move or capture)
        const dirs = [
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 }
        ];

        for (const { dx, dy } of dirs) {
            let nx = x + dx;
            let ny = y + dy;
            let screenFound = false;

            while (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const targetPiece = board.getPieceAt(nx, ny);

                if (!screenFound) {
                    if (targetPiece) {
                        // In Janggi, a cannon cannot jump over another cannon
                        if (targetPiece.name === 'JanggiCannon') {
                            break;
                        }
                        screenFound = true;
                    }
                    // Cannot move to empty squares before jumping over a screen
                } else {
                    if (!targetPiece) {
                        // Valid move to empty square after jumping over the screen
                        moves.push({ x: nx, y: ny });
                    } else {
                        // Janggi rule: cannot capture cannons or jump over a second piece
                        if (targetPiece.color !== this.color && targetPiece.name !== 'JanggiCannon') {
                            moves.push({ x: nx, y: ny });
                        }
                        break;
                    }
                }

                nx += dx;
                ny += dy;
            }
        }

        // 2. Palace diagonal movement:
        // May move or capture diagonally along the diagonal lines in either palace,
        // provided there is an intervening piece in the center (from corner over center to opposite corner).
        const PALACE_DIAGONAL_JUMPS: Record<string, { center: Position; dest: Position }> = {
            // Top palace (Red): rows 0-2, cols 3-5, center (4, 1)
            '3,0': { center: { x: 4, y: 1 }, dest: { x: 5, y: 2 } },
            '5,0': { center: { x: 4, y: 1 }, dest: { x: 3, y: 2 } },
            '3,2': { center: { x: 4, y: 1 }, dest: { x: 5, y: 0 } },
            '5,2': { center: { x: 4, y: 1 }, dest: { x: 3, y: 0 } },
            // Bottom palace (Blue): rows 7-9, cols 3-5, center (4, 8)
            '3,7': { center: { x: 4, y: 8 }, dest: { x: 5, y: 9 } },
            '5,7': { center: { x: 4, y: 8 }, dest: { x: 3, y: 9 } },
            '3,9': { center: { x: 4, y: 8 }, dest: { x: 5, y: 7 } },
            '5,9': { center: { x: 4, y: 8 }, dest: { x: 3, y: 7 } },
        };

        const diagJump = PALACE_DIAGONAL_JUMPS[`${x},${y}`];
        if (diagJump) {
            const screen = board.getPieceAt(diagJump.center.x, diagJump.center.y);
            if (screen && screen.name !== 'JanggiCannon') {
                const targetPiece = board.getPieceAt(diagJump.dest.x, diagJump.dest.y);
                if (!targetPiece) {
                    moves.push(diagJump.dest);
                } else if (targetPiece.color !== this.color && targetPiece.name !== 'JanggiCannon') {
                    moves.push(diagJump.dest);
                }
            }
        }

        return moves;
    }
}
