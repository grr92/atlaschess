import { describe, it, expect } from 'vitest';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import { Chaturaji } from '../../src/core/variants/Chaturaji';
import { HeuristicAiEngine } from '../../src/core/ai/HeuristicAiEngine';
import { CHATURAJI_DICE_PIECE_MAP } from '../../src/utils/diceMapper';

describe('Chaturaji Dice Turns (2 Moves Per Round)', () => {
    it('should allow 2 consecutive moves per turn in dice mode before rotating player', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;

        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(1);

        // Red Move 1: Pawn at (6, 4) -> (5, 4)
        expect(engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('red'); // Stays on Red!
        expect(engine.subTurn).toBe(2);

        // Red Move 2: Horse at (7, 6) -> (5, 5)
        expect(engine.executeMove({ x: 7, y: 6 }, { x: 5, y: 5 })).toBe(true);
        expect(engine.currentTurn).toBe('green'); // Now rotates to Green!
        expect(engine.subTurn).toBe(1);

        // Green Move 1: Pawn at (3, 6) -> (3, 5)
        expect(engine.executeMove({ x: 3, y: 6 }, { x: 3, y: 5 })).toBe(true);
        expect(engine.currentTurn).toBe('green'); // Stays on Green!
        expect(engine.subTurn).toBe(2);

        // Green Move 2: Horse at (1, 7) -> (2, 5)
        expect(engine.executeMove({ x: 1, y: 7 }, { x: 2, y: 5 })).toBe(true);
        expect(engine.currentTurn).toBe('yellow'); // Now rotates to Yellow!
        expect(engine.subTurn).toBe(1);
    });

    it('should allow passing move 1 and then executing move 2 for the same player', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;

        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(1);

        // Red passes move 1
        expect(engine.passTurn()).toBe(true);
        expect(engine.currentTurn).toBe('red'); // Still Red!
        expect(engine.subTurn).toBe(2);

        // Red executes move 2: Pawn at (6, 4) -> (5, 4)
        expect(engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('green'); // Rotates to Green!
        expect(engine.subTurn).toBe(1);
    });

    it('should allow passing move 1 and then passing move 2 sequentially', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;

        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(1);

        // Red passes move 1
        expect(engine.passTurn()).toBe(true);
        expect(engine.currentTurn).toBe('red'); // Stays on Red for move 2
        expect(engine.subTurn).toBe(2);

        // Red passes move 2
        expect(engine.passTurn()).toBe(true);
        expect(engine.currentTurn).toBe('green'); // Rotates to Green!
        expect(engine.subTurn).toBe(1);
    });

    it('should allow executing move 1 and then passing move 2', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;

        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(1);

        // Red executes move 1: Pawn at (6, 4) -> (5, 4)
        expect(engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(2);

        // Red passes move 2
        expect(engine.passTurn()).toBe(true);
        expect(engine.currentTurn).toBe('green'); // Rotates to Green!
        expect(engine.subTurn).toBe(1);
    });

    it('should maintain subTurn and currentTurn when cloneCustomFields is called', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;
        engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 });

        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(2);

        const cloned = new ChaturajiEngine(new Chaturaji());
        cloned.currentTurn = engine.currentTurn;
        cloned.history = [...engine.history];
        cloned.state = engine.state;
        engine.cloneCustomFields(cloned);

        expect(cloned.useDiceRule).toBe(true);
        expect(cloned.subTurn).toBe(2);
        expect(cloned.currentTurn).toBe('red');
    });

    it('should work seamlessly with AI move generation for both subturns', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.useDiceRule = true;

        // Subturn 1: Roll 3 (Horse)
        const allowed1 = CHATURAJI_DICE_PIECE_MAP[3];
        const move1 = HeuristicAiEngine.findBestMove(engine, 'medium', allowed1);
        expect(move1).not.toBeNull();
        if (move1) {
            expect(engine.executeMove(move1.from, move1.to)).toBe(true);
        }
        expect(engine.currentTurn).toBe('red');
        expect(engine.subTurn).toBe(2);

        // Subturn 2: Roll 1 (King or Pawn)
        const allowed2 = CHATURAJI_DICE_PIECE_MAP[1];
        const move2 = HeuristicAiEngine.findBestMove(engine, 'medium', allowed2);
        expect(move2).not.toBeNull();
        if (move2) {
            expect(engine.executeMove(move2.from, move2.to)).toBe(true);
        }
        expect(engine.currentTurn).toBe('green');
        expect(engine.subTurn).toBe(1);
    });
});
