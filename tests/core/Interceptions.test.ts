import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import { TamerlaneEngine } from '../../src/core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { Pawn, Shah, Shahzada, ChaturajiKing, ChaturajiElephant, ChaturajiPawn } from '../../src/core/pieces/piecesIndex';

describe('Interception and Polymorphism Architecture', () => {
    it('should trigger PROMOTION interception and resolve via resolveInterception', () => {
        const store = useGameStore.getState();
        store.initGame('classic', 'pvp');

        const engine = useGameStore.getState().engine as ClassicChessEngine;
        expect(engine).toBeDefined();

        engine.board.clear();
        const whitePawn = new Pawn('p_w', 'white', { x: 4, y: 1 });
        engine.board.setPiece(whitePawn, 4, 1);
        engine.currentTurn = 'white';

        // Select the pawn
        store.selectSquare({ x: 4, y: 1 });
        expect(useGameStore.getState().selectedPosition).toEqual({ x: 4, y: 1 });

        // Click promotion rank (e8: x=4, y=0)
        store.selectSquare({ x: 4, y: 0 });

        // activeInterception should be PROMOTION
        const interception = useGameStore.getState().activeInterception;
        expect(interception).toEqual({
            type: 'PROMOTION',
            from: { x: 4, y: 1 },
            to: { x: 4, y: 0 }
        });

        // Resolve promotion to Queen
        store.resolveInterception({ type: 'PROMOTION', pieceName: 'Queen' });

        expect(useGameStore.getState().activeInterception).toBeNull();
        expect(engine.board.getPieceAt(4, 0)?.name).toBe('Queen');
        expect(useGameStore.getState().currentTurn).toBe('black');
    });

    it('should trigger Tamerlane Citadel interception and resolve via CITADEL_SWAP', () => {
        const store = useGameStore.getState();
        store.initGame('tamerlane', 'pvp');

        const engine = useGameStore.getState().engine as TamerlaneEngine;
        engine.board.clear();

        // White Shah on battlefield at (1, 2) near black citadel (0, 1)
        const whiteShah = new Shah('s_w', 'white', { x: 1, y: 2 });
        const whitePrince = new Shahzada('p_w', 'white', { x: 6, y: 7 });
        engine.board.setPiece(whiteShah, 1, 2);
        engine.board.setPiece(whitePrince, 6, 7);
        engine.currentTurn = 'white';

        // Select and enter citadel
        store.selectSquare({ x: 1, y: 2 });
        store.selectSquare({ x: 0, y: 1 });

        const interception = useGameStore.getState().activeInterception;
        expect(interception?.type).toBe('CITADEL_CHOICE');

        // Resolve by swapping with Prince
        store.resolveInterception({ type: 'CITADEL_SWAP', chosenRoyalId: 'p_w' });

        expect(useGameStore.getState().activeInterception).toBeNull();
        // Shah should be at (6, 7) and Prince at (0, 1)
        expect(engine.board.getPieceAt(6, 7)?.name).toBe('Shah');
        expect(engine.board.getPieceAt(0, 1)?.name).toBe('Shahzada');
    });

    it('should handle Chaturaji King Rescue lifecycle through unified store', () => {
        const store = useGameStore.getState();
        store.initGame('chaturaji', 'pvp');

        const engine = useGameStore.getState().engine as ChaturajiEngine;
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const redElephant = new ChaturajiElephant('e_r', 'red', { x: 3, y: 4 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 2 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });
        const yellowPawn = new ChaturajiPawn('p_y', 'yellow', { x: 1, y: 3 });
        // Partner Yellow has NO king alive

        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(redElephant, 3, 4);
        engine.board.setPiece(greenKing, 3, 2);
        engine.board.setPiece(greenPawn, 3, 6);
        engine.board.setPiece(yellowPawn, 1, 3);
        engine.currentTurn = 'red';

        // Move Red elephant to capture green king
        store.selectSquare({ x: 3, y: 4 });
        store.selectSquare({ x: 3, y: 2 });

        // activeInterception should be KING_RESCUE_CHOICE
        expect(useGameStore.getState().activeInterception).toEqual({
            type: 'KING_RESCUE_CHOICE',
            capturingColor: 'red',
            partnerColor: 'yellow'
        });

        // Accept rescue
        store.resolveInterception({ type: 'KING_RESCUE_ACCEPT' });

        // Should transition to KING_PLACEMENT
        expect(useGameStore.getState().activeInterception).toEqual({
            type: 'KING_PLACEMENT',
            color: 'yellow'
        });

        // Click empty square (3, 3) to place rescued king
        store.selectSquare({ x: 3, y: 3 });

        expect(useGameStore.getState().activeInterception).toBeNull();
        expect(engine.board.getPieceAt(3, 3)?.name).toBe('ChaturajiKing');
        expect(engine.board.getPieceAt(3, 3)?.color).toBe('yellow');
    });

    it('should allow cancelInterception to abort a pending pre-move choice', () => {
        const store = useGameStore.getState();
        store.initGame('classic', 'pvp');

        const engine = useGameStore.getState().engine as ClassicChessEngine;
        engine.board.clear();
        const whitePawn = new Pawn('p_w', 'white', { x: 4, y: 1 });
        engine.board.setPiece(whitePawn, 4, 1);
        engine.currentTurn = 'white';

        store.selectSquare({ x: 4, y: 1 });
        store.selectSquare({ x: 4, y: 0 });

        expect(useGameStore.getState().activeInterception?.type).toBe('PROMOTION');

        store.cancelInterception();

        expect(useGameStore.getState().activeInterception).toBeNull();
        expect(useGameStore.getState().selectedPosition).toBeNull();
        // Pawn has not moved
        expect(engine.board.getPieceAt(4, 1)).toBe(whitePawn);
    });
});
