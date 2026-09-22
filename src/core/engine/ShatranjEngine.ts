import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Position } from '../../types';
import { Piece, Ferz } from '../pieces/piecesIndex';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { BareKingVictoryStrategy } from './strategies/VictoryStrategy';

export class ShatranjEngine extends BaseEngine {
    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('Shah'),
            new BareKingVictoryStrategy({ stalemateIsWin: true })
        );
    }

    protected afterMoveHook(piece: Piece, _from: Position, to: Position): void {
        // Pawns automatically promote to Ferz when reaching the last rank.
        if (piece.name === 'Sarbaz') {
            const promotionRank = piece.color === 'white' ? 0 : this.board.rows - 1;
            if (to.y === promotionRank) {
                const newFerz = new Ferz(`${piece.id}_promoted`, piece.color, { x: to.x, y: to.y });
                this.board.setPiece(newFerz, to.x, to.y);
            }
        }
    }

    public getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < 8; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < 8; x++) {
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
                        case 'Shah': case 'King': char = 'k'; break;
                        case 'Ferz': case 'Queen': char = 'q'; break;
                        case 'Rukh': case 'Rook': char = 'r'; break;
                        case 'Pil': case 'Bishop': char = 'b'; break;
                        case 'Asb': case 'Knight': char = 'n'; break;
                        case 'Sarbaz': case 'Pawn': default: char = 'p'; break;
                    }
                    rowStr += p.color === 'white' ? char.toUpperCase() : char.toLowerCase();
                }
            }
            if (emptyCount > 0) rowStr += emptyCount;
            rows.push(rowStr);
        }

        const placement = rows.join('/');
        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';
        return `${placement} ${activeColor} - - 0 ${Math.floor(this.history.length / 2) + 1}`;
    }
}