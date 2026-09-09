import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import {
    ChaturajiKing,
    ChaturajiElephant,
    ChaturajiHorse,
    ChaturajiBoat,
    ChaturajiPawn
} from '../../src/core/pieces/piecesIndex';

describe('Chaturaji Save/Load and Undo Integration', () => {
    beforeEach(() => {
        useGameStore.getState().initGame('chaturaji', 'pvp', 'red', 'medium', true);
    });

    it('should correctly save and load a Chaturaji game with dice rules, subturn, and pass moves', () => {
        const store = useGameStore.getState();

        // 1. Red Move 1: Pawn (6, 4) -> (5, 4) (Dice roll 1 allows Pawn)
        useGameStore.setState({ currentDiceRoll: 1, isRollingDice: false });
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('red');
        expect(useGameStore.getState().subTurn).toBe(2);

        // 2. Red Move 2: Pass
        useGameStore.getState().passTurn();
        expect(useGameStore.getState().currentTurn).toBe('green');
        expect(useGameStore.getState().subTurn).toBe(1);

        // 3. Green Move 1: Horse (1, 7) -> (2, 5) (Dice roll 3 allows Horse)
        useGameStore.setState({ currentDiceRoll: 3, isRollingDice: false });
        store.selectSquare({ x: 1, y: 7 });
        store.selectSquare({ x: 2, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('green');
        expect(useGameStore.getState().subTurn).toBe(2);

        // 4. Save game to JSON
        const savedData = useGameStore.getState().saveGame();
        expect(savedData).toBeDefined();
        const parsed = JSON.parse(savedData!);

        expect(parsed.variantId).toBe('chaturaji');
        expect(parsed.useDiceRule).toBe(true);
        expect(parsed.subTurn).toBe(2);
        expect(parsed.currentTurn).toBe('green');
        expect(parsed.history.length).toBe(3);
        expect(parsed.history[1].isPass).toBe(true);

        // 5. Reset store to a different game (e.g. classic chess)
        useGameStore.getState().initGame('classic', 'pvp', 'white', 'medium', false);
        expect(useGameStore.getState().currentVariantId).toBe('classic');
        expect(useGameStore.getState().useDiceRule).toBe(false);

        // 6. Load saved game
        const loadSuccess = useGameStore.getState().loadGame(savedData!);
        expect(loadSuccess).toBe(true);

        const loadedStore = useGameStore.getState();
        expect(loadedStore.currentVariantId).toBe('chaturaji');
        expect(loadedStore.useDiceRule).toBe(true);
        expect(loadedStore.currentTurn).toBe('green');
        expect(loadedStore.subTurn).toBe(2);
        expect(loadedStore.history.length).toBe(3);

        const loadedEngine = loadedStore.engine as ChaturajiEngine;
        expect(loadedEngine.useDiceRule).toBe(true);
        expect(loadedEngine.subTurn).toBe(2);
        expect(loadedEngine.currentTurn).toBe('green');

        // Verify pieces were properly restored on board
        const redPawn = loadedEngine.board.getPieceAt(5, 4);
        expect(redPawn).toBeInstanceOf(ChaturajiPawn);
        expect(redPawn?.color).toBe('red');

        const greenHorse = loadedEngine.board.getPieceAt(2, 5);
        expect(greenHorse).toBeInstanceOf(ChaturajiHorse);
        expect(greenHorse?.color).toBe('green');
    });

    it('should correctly undo pass moves and restore correct subturn and turn', () => {
        const store = useGameStore.getState();
        expect(store.currentTurn).toBe('red');
        expect(store.subTurn).toBe(1);

        // Red executes move 1: Pawn (6, 4) -> (5, 4) (Dice roll 1 allows Pawn)
        useGameStore.setState({ currentDiceRoll: 1, isRollingDice: false });
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('red');
        expect(useGameStore.getState().subTurn).toBe(2);

        // Red passes move 2 -> rotates to green
        useGameStore.getState().passTurn();
        expect(useGameStore.getState().currentTurn).toBe('green');
        expect(useGameStore.getState().subTurn).toBe(1);

        // Undo move 2 (pass)
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('red');
        expect(useGameStore.getState().subTurn).toBe(2);

        // Undo move 1 (pawn move)
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('red');
        expect(useGameStore.getState().subTurn).toBe(1);
        expect(useGameStore.getState().engine.board.getPieceAt(6, 4)).toBeInstanceOf(ChaturajiPawn);
        expect(useGameStore.getState().engine.board.getPieceAt(5, 4)).toBeNull();
    });

    it('should properly serialize and deserialize custom pieces: King, Elephant, Horse, Boat, Pawn', () => {
        const store = useGameStore.getState();

        // Execute a move so history is non-empty
        useGameStore.setState({ currentDiceRoll: 1, isRollingDice: false });
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 4 });

        const saved = store.saveGame();
        expect(saved).toBeDefined();

        useGameStore.getState().initGame('classic', 'pvp', 'white', 'medium', false);
        const success = useGameStore.getState().loadGame(saved!);
        expect(success).toBe(true);

        const newEngine = useGameStore.getState().engine as ChaturajiEngine;
        expect(newEngine.board.getPieceAt(7, 4)).toBeInstanceOf(ChaturajiKing);
        expect(newEngine.board.getPieceAt(7, 5)).toBeInstanceOf(ChaturajiElephant);
        expect(newEngine.board.getPieceAt(7, 6)).toBeInstanceOf(ChaturajiHorse);
        expect(newEngine.board.getPieceAt(7, 7)).toBeInstanceOf(ChaturajiBoat);
        expect(newEngine.board.getPieceAt(5, 4)).toBeInstanceOf(ChaturajiPawn);
    });
});
