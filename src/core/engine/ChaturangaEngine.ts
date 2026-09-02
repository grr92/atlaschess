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
}