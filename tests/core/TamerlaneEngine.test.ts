import { describe, it, expect } from 'vitest';
import { TamerlaneEngine } from '../../src/core/engine/TamerlaneEngine';
import { TamerlaneChess } from '../../src/core/variants/TamerlaneChess';
import { Dabbaba, Jamal, Zurafa, Wazir, Rukh, Shah, Shahzada, AdventitiousShah, TamerlanePawn } from '../../src/core/pieces/piecesIndex';

describe('TamerlaneEngine & Citadels', () => {
    it('should initialize 112-square board with 28 pieces per side', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        const whitePieces = engine.board.getAllPieces().filter(p => p.color === 'white');
        const blackPieces = engine.board.getAllPieces().filter(p => p.color === 'black');

        expect(whitePieces.length).toBe(28);
        expect(blackPieces.length).toBe(28);
        expect(engine.board.cols).toBe(13);
        expect(engine.board.rows).toBe(10);
    });

    it('should allow Dabbaba (War Engine) to leap exactly two squares orthogonally', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        const dabbaba = new Dabbaba('d1', 'white', { x: 6, y: 5 });
        engine.board.setPiece(dabbaba, 6, 5);

        const legalMoves = engine.getLegalMoves(dabbaba);
        expect(legalMoves.length).toBe(4);
        expect(legalMoves.some(m => m.x === 6 && m.y === 3)).toBe(true);
        expect(legalMoves.some(m => m.x === 6 && m.y === 7)).toBe(true);
        expect(legalMoves.some(m => m.x === 4 && m.y === 5)).toBe(true);
        expect(legalMoves.some(m => m.x === 8 && m.y === 5)).toBe(true);
    });

    it('should allow Jamal (Camel) to make a (3,1) extended knight leap', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        const jamal = new Jamal('j1', 'white', { x: 6, y: 5 });
        engine.board.setPiece(jamal, 6, 5);

        const legalMoves = engine.getLegalMoves(jamal);
        expect(legalMoves.length).toBe(8);
        expect(legalMoves.some(m => m.x === 7 && m.y === 2)).toBe(true);
        expect(legalMoves.some(m => m.x === 5 && m.y === 2)).toBe(true);
        expect(legalMoves.some(m => m.x === 9 && m.y === 4)).toBe(true);
    });

    it('should allow Shah to execute ally-swap evasion once per game when attacked', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        const whiteShah = new Shah('w_shah', 'white', { x: 6, y: 8 });
        const whiteWazir = new Wazir('w_wazir', 'white', { x: 6, y: 7 });
        const blackShah = new Shah('b_shah', 'black', { x: 1, y: 1 });
        const blackRukh = new Rukh('b_rukh', 'black', { x: 1, y: 8 }); // Threatens White Shah along rank 8

        engine.board.setPiece(whiteShah, 6, 8);
        engine.board.setPiece(whiteWazir, 6, 7);
        engine.board.setPiece(blackShah, 1, 1);
        engine.board.setPiece(blackRukh, 1, 8);

        // White Shah is directly threatened by Black Rukh on rank 8 and can swap with adjacent White Wazir on (6,7)
        expect(engine.isKingInCheck('white')).toBe(true);
        const legalMoves = engine.getLegalMoves(whiteShah);
        expect(legalMoves.some(m => m.x === 6 && m.y === 7)).toBe(true);

        const success = engine.executeMove({ x: 6, y: 8 }, { x: 6, y: 7 });
        expect(success).toBe(true);
        expect(engine.board.getPieceAt(6, 7)).toBe(whiteShah);
        expect(engine.board.getPieceAt(6, 8)).toBe(whiteWazir);
    });

    it('should crown royal successor when main Shah is eliminated', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        const whiteShahzada = new Shahzada('w_prince', 'white', { x: 5, y: 5 });
        engine.board.setPiece(whiteShahzada, 5, 5);

        engine.crownSuccessor(whiteShahzada.id);
        const crownedPiece = engine.board.getPieceAt(5, 5);

        expect(crownedPiece).toBeInstanceOf(Shah);
        expect(crownedPiece?.id).toContain('_crowned');
    });

    it('should render Adventitious Shah completely immune to check inside own citadel (12,8)', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        // White Adventitious Shah inside white citadel (12,8)
        const whiteAdvShah = new AdventitiousShah('w_adv', 'white', { x: 12, y: 8 });
        // Black Rukh attacking horizontally along rank 8
        const blackRukh = new Rukh('b_r', 'black', { x: 1, y: 8 });
        const blackShah = new Shah('b_s', 'black', { x: 6, y: 1 });

        engine.board.setPiece(whiteAdvShah, 12, 8);
        engine.board.setPiece(blackRukh, 1, 8);
        engine.board.setPiece(blackShah, 6, 1);

        // Inside citadel, isKingInCheck must return false (invulnerable)
        expect(engine.isKingInCheck('white')).toBe(false);
    });

    it('should prevent standard pieces from moving into citadel squares', () => {
        const engine = new TamerlaneEngine(new TamerlaneChess());
        engine.board.clear();

        const whiteWazir = new Wazir('w_wazir', 'white', { x: 1, y: 1 });
        engine.board.setPiece(whiteWazir, 1, 1);

        // Wazir cannot enter Black Citadel at (0,1)
        const legalMoves = engine.getLegalMoves(whiteWazir);
        expect(legalMoves.some(m => m.x === 0 && m.y === 1)).toBe(false);
    });
});
