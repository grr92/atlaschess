import { Piece } from '../Piece.ts';
import type { Position, PieceColor } from '../../../types';
import { Board } from '../../models/Board.ts';

export class GrantPawn extends Piece {
    originFile: number;
    canDoubleStep: boolean = false;

    constructor(id: string, color: PieceColor, position: Position, originFile: number) {
        super(id, color, position, 'Grantpawn');
        this.originFile = originFile;
    }

    getPossibleMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const dir = this.color === 'white' ? -1 : 1;
        const { x, y } = this.position;

        // 1. One square forward step
        const forwardY = y + dir;
        if (!board.isOutOfBounds(x, forwardY) && !board.getPieceAt(x, forwardY)) {
            moves.push({ x, y: forwardY });

            // 2. Initial double step: allowed only until the first pawn capture of the game
            const doubleY = y + dir * 2;
            if (this.canDoubleStep && !board.isOutOfBounds(x, doubleY) && !board.getPieceAt(x, doubleY)) {
                moves.push({ x, y: doubleY });
            }
        }

        // 3. Diagonal forward captures
        for (const dx of [-1, 1]) {
            const capX = x + dx;
            if (!board.isOutOfBounds(capX, forwardY)) {
                const target = board.getPieceAt(capX, forwardY);
                if (target && target.color !== this.color) {
                    moves.push({ x: capX, y: forwardY });
                }
            }
        }

        return moves;
    }

    override clone(): Piece {
        const cloned = new GrantPawn(this.id, this.color, { ...this.position }, this.originFile);
        cloned.hasMoved = this.hasMoved;
        cloned.canDoubleStep = this.canDoubleStep;
        return cloned;
    }
}
