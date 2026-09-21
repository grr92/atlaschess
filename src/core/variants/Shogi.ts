import type { GameVariant } from './GameVariant';
import { Board } from '../models/Board';
import { setupShogiBoard } from './shogi/shogiSetup';

export class Shogi implements GameVariant {
    readonly name = 'Shogi';

    setupBoard(): Board {
        return setupShogiBoard();
    }
}
