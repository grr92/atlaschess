import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import {
    ChaturajiKing,
    ChaturajiPawn
} from '../../src/core/pieces/piecesIndex';

describe('Chaturaji Undo and Partner Control', () => {
    beforeEach(() => {
        useGameStore.getState().initGame('chaturaji', 'pvp', 'red', 'medium', false);
    });

    it('should properly restore turn and allow piece movements after undoing when controlling partner army', () => {
        const store = useGameStore.getState();

        // Round 1
        // Red Pawn (6, 4) -> (5, 4)
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (0, 6) -> (0, 5)
        store.selectSquare({ x: 0, y: 6 });
        store.selectSquare({ x: 0, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (1, 0) -> (2, 0)
        store.selectSquare({ x: 1, y: 0 });
        store.selectSquare({ x: 2, y: 0 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (7, 1) -> (7, 2)
        store.selectSquare({ x: 7, y: 1 });
        store.selectSquare({ x: 7, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 2
        // Red King (7, 4) -> (6, 4)
        store.selectSquare({ x: 7, y: 4 });
        store.selectSquare({ x: 6, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (1, 6) -> (1, 5)
        store.selectSquare({ x: 1, y: 6 });
        store.selectSquare({ x: 1, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (1, 1) -> (2, 1)
        store.selectSquare({ x: 1, y: 1 });
        store.selectSquare({ x: 2, y: 1 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (6, 1) -> (6, 2)
        store.selectSquare({ x: 6, y: 1 });
        store.selectSquare({ x: 6, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 3
        // Red King (6, 4) -> (5, 3)
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (2, 6) -> (2, 5)
        store.selectSquare({ x: 2, y: 6 });
        store.selectSquare({ x: 2, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (1, 2) -> (2, 2)
        store.selectSquare({ x: 1, y: 2 });
        store.selectSquare({ x: 2, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (5, 1) -> (5, 2)
        store.selectSquare({ x: 5, y: 1 });
        store.selectSquare({ x: 5, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 4
        // Red King (5, 3) -> (4, 3)
        store.selectSquare({ x: 5, y: 3 });
        store.selectSquare({ x: 4, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (3, 6) -> (3, 5)
        store.selectSquare({ x: 3, y: 6 });
        store.selectSquare({ x: 3, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (1, 3) -> (2, 3)
        store.selectSquare({ x: 1, y: 3 });
        store.selectSquare({ x: 2, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (4, 1) -> (4, 2)
        store.selectSquare({ x: 4, y: 1 });
        store.selectSquare({ x: 4, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 5
        // Red King (4, 3) -> (3, 3)
        store.selectSquare({ x: 4, y: 3 });
        store.selectSquare({ x: 3, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (0, 5) -> (0, 4)
        store.selectSquare({ x: 0, y: 5 });
        store.selectSquare({ x: 0, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (2, 0) -> (3, 0)
        store.selectSquare({ x: 2, y: 0 });
        store.selectSquare({ x: 3, y: 0 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (7, 2) -> (7, 3)
        store.selectSquare({ x: 7, y: 2 });
        store.selectSquare({ x: 7, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 6
        // Red King (3, 3) -> (2, 3) captures Yellow Pawn
        store.selectSquare({ x: 3, y: 3 });
        store.selectSquare({ x: 2, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (1, 5) -> (1, 4)
        store.selectSquare({ x: 1, y: 5 });
        store.selectSquare({ x: 1, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (2, 1) -> (3, 1)
        store.selectSquare({ x: 2, y: 1 });
        store.selectSquare({ x: 3, y: 1 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (6, 2) -> (6, 3)
        store.selectSquare({ x: 6, y: 2 });
        store.selectSquare({ x: 6, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 7
        // Red King (2, 3) -> (1, 3)
        store.selectSquare({ x: 2, y: 3 });
        store.selectSquare({ x: 1, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Green Pawn (2, 5) -> (2, 4)
        store.selectSquare({ x: 2, y: 5 });
        store.selectSquare({ x: 2, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow Pawn (2, 2) -> (3, 2)
        store.selectSquare({ x: 2, y: 2 });
        store.selectSquare({ x: 3, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (5, 2) -> (5, 3)
        store.selectSquare({ x: 5, y: 2 });
        store.selectSquare({ x: 5, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Round 8
        // Red King (1, 3) -> (0, 3) takes Yellow Throne and captures Yellow King!
        store.selectSquare({ x: 1, y: 3 });
        store.selectSquare({ x: 0, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        const engineAfterThrone = useGameStore.getState().engine as ChaturajiEngine;
        expect(engineAfterThrone.partnerControlled.yellow).toBe('red');

        // Green Pawn (3, 5) -> (3, 4)
        store.selectSquare({ x: 3, y: 5 });
        store.selectSquare({ x: 3, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Yellow turn: Red controls Yellow. Red moves Yellow Pawn (3, 1) -> (4, 1)
        store.selectSquare({ x: 3, y: 1 });
        store.selectSquare({ x: 4, y: 1 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Blue Pawn (7, 3) -> (7, 4)
        store.selectSquare({ x: 7, y: 3 });
        store.selectSquare({ x: 7, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Now test Undos:
        // 1. Undo Blue's move -> Turn should be 'blue'
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // 2. Undo Yellow's move (which was controlled by Red) -> Turn should be 'yellow'
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Verify: Red still controls Yellow
        const engineRestored = useGameStore.getState().engine as ChaturajiEngine;
        expect(engineRestored.partnerControlled.yellow).toBe('red');

        // Verify Red piece is controllable on Yellow's turn
        const redPawn = engineRestored.board.getPieceAt(6, 7);
        expect(redPawn).not.toBeNull();
        expect(engineRestored.isPieceControllableByCurrentTurn(redPawn!)).toBe(true);

        // Verify Yellow piece is controllable on Yellow's turn
        const yellowPawn = engineRestored.board.getPieceAt(3, 1);
        expect(yellowPawn).not.toBeNull();
        expect(engineRestored.isPieceControllableByCurrentTurn(yellowPawn!)).toBe(true);

        // Move Yellow pawn (3, 1) -> (4, 1) again
        useGameStore.getState().selectSquare({ x: 3, y: 1 });
        useGameStore.getState().selectSquare({ x: 4, y: 1 });
        expect(useGameStore.getState().currentTurn).toBe('blue');
    });

    it('should allow moving Red piece on Yellow turn when Red controls Yellow', () => {
        const store = useGameStore.getState();
        const engine = store.engine as ChaturajiEngine;

        engine.board.clear();
        const redKing = new ChaturajiKing('k_r', 'red', { x: 0, y: 3 }); // already on yellow throne (0, 3)
        const redPawn = new ChaturajiPawn('p_r', 'red', { x: 6, y: 4 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });
        const yellowPawn = new ChaturajiPawn('p_y', 'yellow', { x: 1, y: 2 });
        const yellowPawn2 = new ChaturajiPawn('p_y_2', 'yellow', { x: 1, y: 1 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 });
        const bluePawn = new ChaturajiPawn('p_b', 'blue', { x: 4, y: 1 });

        engine.board.setPiece(redKing, 0, 3);
        engine.board.setPiece(redPawn, 6, 4);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(greenPawn, 3, 6);
        engine.board.setPiece(yellowPawn, 1, 2);
        engine.board.setPiece(yellowPawn2, 1, 1);
        engine.board.setPiece(blueKing, 4, 0);
        engine.board.setPiece(bluePawn, 4, 1);

        engine.partnerControlled.yellow = 'red';
        engine.currentTurn = 'yellow';

        // Red piece should be controllable on Yellow's turn
        expect(engine.isPieceControllableByCurrentTurn(redPawn)).toBe(true);
        expect(engine.isPieceControllableByCurrentTurn(yellowPawn)).toBe(true);

        // Move Red piece on Yellow's turn (Red pawn moves -x: (6, 4) -> (5, 4))
        const moved = engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 });
        expect(moved).toBe(true);
        expect(engine.currentTurn).toBe('blue');
    });

    it('should correctly handle multiple undos in full 4-player match cycle', () => {
        // Play 4 opening moves on standard initial board
        const store = useGameStore.getState();

        // 1. Red moves pawn (6, 4) -> (5, 4)
        store.selectSquare({ x: 6, y: 4 });
        store.selectSquare({ x: 5, y: 4 });
        expect(useGameStore.getState().currentTurn).toBe('green');

        // 2. Green moves pawn (3, 6) -> (3, 5)
        store.selectSquare({ x: 3, y: 6 });
        store.selectSquare({ x: 3, y: 5 });
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // 3. Yellow moves pawn (1, 3) -> (2, 3)
        store.selectSquare({ x: 1, y: 3 });
        store.selectSquare({ x: 2, y: 3 });
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // 4. Blue moves pawn (4, 1) -> (4, 2)
        store.selectSquare({ x: 4, y: 1 });
        store.selectSquare({ x: 4, y: 2 });
        expect(useGameStore.getState().currentTurn).toBe('red');

        // Undo Blue
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('blue');

        // Undo Yellow
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('yellow');

        // Undo Green
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('green');

        // Undo Red
        useGameStore.getState().undoMove();
        expect(useGameStore.getState().currentTurn).toBe('red');
        expect(useGameStore.getState().history.length).toBe(0);
    });
});
