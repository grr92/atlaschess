import { describe, it, expect } from 'vitest';
import { GrantAcedrexEngine } from '../../src/core/engine/GrantAcedrexEngine';
import { GrantAcedrex } from '../../src/core/variants/GrantAcedrex';
import { GrantPawn, GrantKing, King, Rook, Aanca, Unicorn, Lion, Crocodile, Giraffe } from '../../src/core/pieces/piecesIndex';
import { getAvailableDiceNumbers } from '../../src/utils/diceMapper';

describe('GrantAcedrexEngine & Fairy Pieces', () => {
    it('should initialize 12x12 board with 24 pieces per side', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        expect(engine.board.cols).toBe(12);
        expect(engine.board.rows).toBe(12);

        const whitePieces = engine.board.getAllPieces().filter(p => p.color === 'white');
        const blackPieces = engine.board.getAllPieces().filter(p => p.color === 'black');
        expect(whitePieces.length).toBe(24);
        expect(blackPieces.length).toBe(24);

        expect(engine.board.getPieceAt(5, 11)).toBeInstanceOf(Aanca);
        expect(engine.board.getPieceAt(6, 11)).toBeInstanceOf(GrantKing);
    });

    it('should validate Aanca movement (1 diagonal step + orthogonal slide)', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const aanca = new Aanca('a1', 'white', { x: 5, y: 5 });
        engine.board.setPiece(aanca, 5, 5);

        const legalMoves = engine.getLegalMoves(aanca);

        // Diagonal step (6,6) + orthogonal continuation (7,6), (8,6)... and (6,7), (6,8)...
        expect(legalMoves.some(m => m.x === 6 && m.y === 6)).toBe(true);
        expect(legalMoves.some(m => m.x === 7 && m.y === 6)).toBe(true);
        expect(legalMoves.some(m => m.x === 6 && m.y === 7)).toBe(true);
    });

    it('should validate Unicorn movement (1 knight leap + diagonal slide outward)', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const unicorn = new Unicorn('u1', 'white', { x: 5, y: 5 });
        engine.board.setPiece(unicorn, 5, 5);

        const legalMoves = engine.getLegalMoves(unicorn);

        // Knight jump (6, 7) + diagonal slide (7, 8), (8, 9)...
        expect(legalMoves.some(m => m.x === 6 && m.y === 7)).toBe(true);
        expect(legalMoves.some(m => m.x === 7 && m.y === 8)).toBe(true);
        expect(legalMoves.some(m => m.x === 8 && m.y === 9)).toBe(true);
    });

    it('should validate Lion movement (3 squares orthogonal or 2x4 rectangle jumps)', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const lion = new Lion('l1', 'white', { x: 5, y: 5 });
        engine.board.setPiece(lion, 5, 5);

        const legalMoves = engine.getLegalMoves(lion);

        // 3 steps orthogonal
        expect(legalMoves.some(m => m.x === 5 && m.y === 2)).toBe(true);
        expect(legalMoves.some(m => m.x === 5 && m.y === 8)).toBe(true);
        expect(legalMoves.some(m => m.x === 2 && m.y === 5)).toBe(true);
        expect(legalMoves.some(m => m.x === 8 && m.y === 5)).toBe(true);

        // 2x4 rectangle jumps
        expect(legalMoves.some(m => m.x === 6 && m.y === 8)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 8)).toBe(true);
    });

    it('should validate Crocodile diagonal sliding movement', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const croc = new Crocodile('c1', 'white', { x: 5, y: 5 });
        engine.board.setPiece(croc, 5, 5);

        const legalMoves = engine.getLegalMoves(croc);

        expect(legalMoves.some(m => m.x === 6 && m.y === 6)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 4)).toBe(true);
        expect(legalMoves.some(m => m.x === 7 && m.y === 7)).toBe(true);
    });

    it('should validate Giraffe (3x4 rectangle jump) movement', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const giraffe = new Giraffe('g1', 'white', { x: 5, y: 5 });
        engine.board.setPiece(giraffe, 5, 5);

        const legalMoves = engine.getLegalMoves(giraffe);

        expect(legalMoves.some(m => m.x === 7 && m.y === 8)).toBe(true);
        expect(legalMoves.some(m => m.x === 3 && m.y === 8)).toBe(true);
        expect(legalMoves.some(m => m.x === 7 && m.y === 2)).toBe(true);
    });

    it('should allow Grant Pawns to double-step before any capture occurs', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        const pawn = engine.board.getPieceAt(0, 8); // White pawn on rank 4 (y=8)

        expect(pawn).toBeInstanceOf(GrantPawn);
        const legalMoves = engine.getLegalMoves(pawn!);

        expect(legalMoves.some(m => m.x === 0 && m.y === 7)).toBe(true);
        expect(legalMoves.some(m => m.x === 0 && m.y === 6)).toBe(true);
    });

    it('should disable double-step for all pawns after the first pawn capture occurs', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const whitePawn1 = new GrantPawn('w_p1', 'white', { x: 3, y: 5 }, 3);
        const blackPawn = new GrantPawn('b_p', 'black', { x: 4, y: 4 }, 4);
        const whitePawn2 = new GrantPawn('w_p2', 'white', { x: 0, y: 8 }, 0);

        engine.board.setPiece(whitePawn1, 3, 5);
        engine.board.setPiece(blackPawn, 4, 4);
        engine.board.setPiece(whitePawn2, 0, 8);

        // White pawn 1 captures black pawn
        expect(engine.hasPawnCapturedYet).toBe(false);
        engine.executeMove({ x: 3, y: 5 }, { x: 4, y: 4 });
        expect(engine.hasPawnCapturedYet).toBe(true);

        // Now white pawn 2 must not have double-step available
        const moves = engine.getLegalMoves(whitePawn2);
        expect(moves.some(m => m.x === 0 && m.y === 7)).toBe(true);
        expect(moves.some(m => m.x === 0 && m.y === 6)).toBe(false);
    });

    it('should promote Grant Pawn on origin file 0 to Rook upon reaching last rank', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const whitePawn = new GrantPawn('w_p_col0', 'white', { x: 0, y: 1 }, 0);
        engine.board.setPiece(whitePawn, 0, 1);

        engine.executeMove({ x: 0, y: 1 }, { x: 0, y: 0 });
        const promoted = engine.board.getPieceAt(0, 0);

        expect(promoted).toBeInstanceOf(Rook);
        expect(promoted?.color).toBe('white');
    });

    it('should strictly restrict d8 dice options to King [8] when in check', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        engine.board.clear();

        const whiteKing = new King('w_k', 'white', { x: 5, y: 5 });
        const blackRook = new Rook('b_r', 'black', { x: 5, y: 0 }); // Direct check along column 5
        const whitePawn = new GrantPawn('w_p', 'white', { x: 0, y: 10 }, 0);

        engine.board.setPiece(whiteKing, 5, 5);
        engine.board.setPiece(blackRook, 5, 0);
        engine.board.setPiece(whitePawn, 0, 10);

        expect(engine.isKingInCheck('white')).toBe(true);
        const availableRolls = getAvailableDiceNumbers(engine, 'white');

        // Must strictly return [8] (King)
        expect(availableRolls).toEqual([8]);
    });
});
