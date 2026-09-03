import { describe, it, expect } from 'vitest';
import { ShatranjEngine } from '../../src/core/engine/ShatranjEngine';
import { Shatranj } from '../../src/core/variants/Shatranj';
import { Ferz, Pil, Sarbaz, Shah } from '../../src/core/pieces/piecesIndex';

describe('ShatranjEngine', () => {
    it('should initialize Shatranj setup with Shah, Ferz, and Pil', () => {
        const engine = new ShatranjEngine(new Shatranj());
        expect(engine.board.getPieceAt(4, 7)).toBeInstanceOf(Shah);
        expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(Ferz);
        expect(engine.board.getPieceAt(2, 7)).toBeInstanceOf(Pil);
    });

    it('should automatically promote Sarbaz to Ferz on the opposite last rank', () => {
        const engine = new ShatranjEngine(new Shatranj());
        engine.board.clear();

        const whiteSarbaz = new Sarbaz('p_white', 'white', { x: 3, y: 1 });
        const blackShah = new Shah('k_black', 'black', { x: 7, y: 0 });
        const whiteShah = new Shah('k_white', 'white', { x: 7, y: 7 });

        engine.board.setPiece(whiteSarbaz, 3, 1);
        engine.board.setPiece(blackShah, 7, 0);
        engine.board.setPiece(whiteShah, 7, 7);

        // Advance Sarbaz to last rank (3, 0)
        const success = engine.executeMove({ x: 3, y: 1 }, { x: 3, y: 0 });
        expect(success).toBe(true);

        const promotedPiece = engine.board.getPieceAt(3, 0);
        expect(promotedPiece).toBeInstanceOf(Ferz);
        expect(promotedPiece?.color).toBe('white');
    });

    it('should declare victory when enemy Shah is bared (Bare King rule)', () => {
        const engine = new ShatranjEngine(new Shatranj());
        engine.board.clear();

        // White has Shah and Ferz, Black only has Shah
        const whiteShah = new Shah('w_shah', 'white', { x: 4, y: 7 });
        const whiteFerz = new Ferz('w_ferz', 'white', { x: 3, y: 6 });
        const blackShah = new Shah('b_shah', 'black', { x: 0, y: 0 });
        const blackTarget = new Sarbaz('b_target', 'black', { x: 2, y: 5 });

        engine.board.setPiece(whiteShah, 4, 7);
        engine.board.setPiece(whiteFerz, 3, 6);
        engine.board.setPiece(blackShah, 0, 0);
        engine.board.setPiece(blackTarget, 2, 5);

        // Capture the last remaining non-royal black piece
        const captureSuccess = engine.executeMove({ x: 3, y: 6 }, { x: 2, y: 5 });
        expect(captureSuccess).toBe(true);
        expect(engine.state).toBe('checkmate');
    });
});
