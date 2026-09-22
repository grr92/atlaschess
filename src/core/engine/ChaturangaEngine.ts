import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { BareKingVictoryStrategy } from './strategies/VictoryStrategy';

export class ChaturangaEngine extends BaseEngine {
    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('Raja'),
            new BareKingVictoryStrategy({ stalemateIsWin: false })
        );
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
                        case 'Raja': case 'King': char = 'k'; break;
                        case 'Mantri': case 'Queen': char = 'q'; break;
                        case 'Ratha': case 'Rook': char = 'r'; break;
                        case 'Gaja': case 'Bishop': char = 'b'; break;
                        case 'Ashva': case 'Asva': case 'Knight': char = 'n'; break;
                        case 'Padati': case 'Pawn': default: char = 'p'; break;
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