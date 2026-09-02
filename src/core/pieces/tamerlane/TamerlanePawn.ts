import { Piece } from '../Piece';
import type { Move, PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';

export type TamerlanePawnType =
    | 'pawn_of_pawns'
    | 'pawn_of_dabbabas'
    | 'pawn_of_camels'
    | 'pawn_of_elephants'
    | 'pawn_of_giraffes'
    | 'pawn_of_king'
    | 'pawn_of_vizier'
    | 'pawn_of_counselor'
    | 'pawn_of_scouts'
    | 'pawn_of_horses'
    | 'pawn_of_rooks';

export class TamerlanePawn extends Piece {
    pawnType: TamerlanePawnType;
    promotionStage: number = 0; // 0: normal pawn, 1: resting on last rank / relocated, 2: second journey
    isRestingOnLastRank: boolean = false;

    constructor(id: string, color: PieceColor, position: Position, pawnType: TamerlanePawnType, name: string) {
        super(id, color, position, name);
        this.pawnType = pawnType;
    }

    getPossibleMoves(board: Board, _lastMove?: Move): Position[] {
        const moves: Position[] = [];

        // resting pawn on last rank does not attack any squares from the back rank
        if (this.isRestingOnLastRank && this.pawnType === 'pawn_of_pawns') {
            const attackDirection = this.color === 'white' ? -1 : 1;

            for (let y = 0; y < board.rows; y++) {
                for (let x = 0; x < board.cols; x++) {
                    if (board.isOutOfBounds(x, y)) continue;

                    // cannot relocate on top of a royal piece
                    const currentOccupant = board.getPieceAt(x, y);
                    if (currentOccupant && ['Shah', 'Shahzada', 'AdventitiousShah'].includes(currentOccupant.name)) {
                        continue;
                    }

                    // calculate the two diagonal attack targets from this strategic square
                    const attackY = y + attackDirection;
                    const attackedEnemies: Piece[] = [];

                    for (const dx of [-1, 1]) {
                        const targetX = x + dx;
                        if (!board.isOutOfBounds(targetX, attackY)) {
                            const enemy = board.getPieceAt(targetX, attackY);
                            if (enemy && enemy.color !== this.color && !['Shah', 'Shahzada', 'AdventitiousShah'].includes(enemy.name)) {
                                attackedEnemies.push(enemy);
                            }
                        }
                    }

                    // condition 1: fork attacking at least 2 distinct enemy pieces
                    if (attackedEnemies.length >= 2) {
                        moves.push({ x, y });
                        continue;
                    }

                    // condition 2: attacking a trapped enemy piece with no escape moves
                    if (attackedEnemies.length === 1) {
                        const trappedEnemy = attackedEnemies[0];
                        const enemyMoves = trappedEnemy.getPossibleMoves(board);
                        if (enemyMoves.length === 0) {
                            moves.push({ x, y });
                        }
                    }
                }
            }
            return moves;
        }

        // white moves upward (y decreases), black moves downward (y increases)
        const direction = this.color === 'white' ? -1 : 1;
        const forwardY = this.position.y + direction;

        // single forward move
        if (!board.isOutOfBounds(this.position.x, forwardY)) {
            const forwardPiece = board.getPieceAt(this.position.x, forwardY);
            if (!forwardPiece) {
                moves.push({ x: this.position.x, y: forwardY });
            }
        }

        // diagonal captures
        const captureOffsets = [-1, 1];
        for (const dx of captureOffsets) {
            const targetX = this.position.x + dx;
            if (!board.isOutOfBounds(targetX, forwardY)) {
                const targetPiece = board.getPieceAt(targetX, forwardY);
                if (targetPiece && targetPiece.color !== this.color) {
                    moves.push({ x: targetX, y: forwardY });
                }
            }
        }

        return moves;
    }

    override clone(): TamerlanePawn {
        const cloned = new TamerlanePawn(this.id, this.color, { ...this.position }, this.pawnType, this.name);
        cloned.hasMoved = this.hasMoved;
        cloned.promotionStage = this.promotionStage;
        cloned.isRestingOnLastRank = this.isRestingOnLastRank;
        return cloned;
    }
}
