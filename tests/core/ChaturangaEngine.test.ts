import { describe, it, expect } from 'vitest';
import { ChaturangaEngine } from '../../src/core/engine/ChaturangaEngine';
import { Chaturanga } from '../../src/core/variants/Chaturanga';
import { Gaja, Mantri, Padati, Raja } from '../../src/core/pieces/piecesIndex';

describe('ChaturangaEngine', () => {
    it('should initialize board with 16 pieces per side and Raja at (4,7) / (4,0)', () => {
        const engine = new ChaturangaEngine(new Chaturanga());
        expect(engine.currentTurn).toBe('white');
        expect(engine.state).toBe('playing');

        const whitePieces = engine.board.getAllPieces().filter(p => p.color === 'white');
        const blackPieces = engine.board.getAllPieces().filter(p => p.color === 'black');
        expect(whitePieces.length).toBe(16);
        expect(blackPieces.length).toBe(16);

        expect(engine.board.getPieceAt(4, 7)).toBeInstanceOf(Raja);
        expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(Mantri);
    });

    it('should allow Gaja (Elephant) to leap exactly two squares diagonally jumping over pieces', () => {
        const engine = new ChaturangaEngine(new Chaturanga());
        const gaja = engine.board.getPieceAt(2, 7); // Gaja on c1
        expect(gaja).toBeInstanceOf(Gaja);

        // Can leap over pawns on rank 6 to (0, 5) and (4, 5)
        const legalMoves = engine.getLegalMoves(gaja!);
        expect(legalMoves.some(m => m.x === 0 && m.y === 5)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 5)).toBe(true);
    });

    it('should restrict Padati (Pawn) to single forward steps without initial double-step', () => {
        const engine = new ChaturangaEngine(new Chaturanga());
        const padati = engine.board.getPieceAt(4, 6); // Padati on e2
        expect(padati).toBeInstanceOf(Padati);

        const legalMoves = engine.getLegalMoves(padati!);
        expect(legalMoves.length).toBe(1);
        expect(legalMoves[0]).toEqual({ x: 4, y: 5 });
    });

    it('should allow Mantri (Counselor) to move only one square diagonally', () => {
        const engine = new ChaturangaEngine(new Chaturanga());
        engine.board.clear();

        const mantri = new Mantri('m_w', 'white', { x: 3, y: 3 });
        engine.board.setPiece(mantri, 3, 3);

        const legalMoves = engine.getLegalMoves(mantri);
        expect(legalMoves.length).toBe(4);
        expect(legalMoves.some(m => m.x === 2 && m.y === 2)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 2)).toBe(true);
        expect(legalMoves.some(m => m.x === 2 && m.y === 4)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 4)).toBe(true);
    });
});
