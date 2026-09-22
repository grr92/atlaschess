import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Position } from '../../types';
import { Piece, CourierQueen } from '../pieces/piecesIndex';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { StandardVictoryStrategy } from './strategies/VictoryStrategy';

export class CourierEngine extends BaseEngine {
    public initialFen = 'rnbemkfwebnr/pppppppppppp/12/12/12/12/PPPPPPPPPPPP/RNBEMKFWEBNR w - - 0 1';

    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('CourierKing'),
            new StandardVictoryStrategy({ stalemateIsWin: false })
        );
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position): void {
        // Courier Pawns automatically promote to CourierQueen upon reaching the last rank
        if (piece.name === 'CourierPawn') {
            const promotionRank = piece.color === 'white' ? 0 : this.board.rows - 1;
            if (to.y === promotionRank) {
                const newQueen = new CourierQueen(`${piece.id}_promoted`, piece.color, { x: to.x, y: to.y });
                this.board.setPiece(newQueen, to.x, to.y);
            }
        }
    }

    /**
     * Generates standard Fairy-Stockfish FEN for Courier Chess:
     * 12 files (a-l) x 8 ranks (1-8).
     * Piece mapping:
     * - Rook: r / R
     * - Knight: n / N
     * - Courier: e / E
     * - CourierBishop (Alfil): b / B
     * - Sage (Mann): m / M
     * - CourierKing: k / K
     * - CourierQueen (Ferz): f / F
     * - Schleich (Wazir): w / W
     * - CourierPawn: p / P
     */
    public getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < this.board.rows; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (!p) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }

                    let char = '';
                    switch (p.name) {
                        case 'CourierKing':
                        case 'King':
                            char = 'k';
                            break;
                        case 'CourierQueen':
                        case 'Queen':
                            char = 'f';
                            break;
                        case 'Rook':
                            char = 'r';
                            break;
                        case 'Knight':
                            char = 'n';
                            break;
                        case 'Courier':
                            char = 'e';
                            break;
                        case 'CourierBishop':
                        case 'Bishop':
                            char = 'b';
                            break;
                        case 'Sage':
                            char = 'm';
                            break;
                        case 'Schleich':
                            char = 'w';
                            break;
                        case 'CourierPawn':
                        case 'Pawn':
                        default:
                            char = 'p';
                            break;
                    }

                    rowStr += p.color === 'white' ? char.toUpperCase() : char.toLowerCase();
                }
            }

            if (emptyCount > 0) {
                rowStr += emptyCount;
            }
            rows.push(rowStr);
        }

        const placement = rows.join('/');
        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';
        const castling = '-';
        const ep = '-';
        const halfmove = 0;
        const fullmove = Math.floor(this.history.length / 2) + 1;

        return `${placement} ${activeColor} ${castling} ${ep} ${halfmove} ${fullmove}`;
    }
}
