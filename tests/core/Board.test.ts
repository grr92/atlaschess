import { describe, it, expect } from 'vitest';
import { Board } from '../../src/core/models/Board';
import { TamerlaneBoard } from '../../src/core/models/TamerlaneBoard';
import { King, Rook } from '../../src/core/pieces/piecesIndex';

describe('Board & TamerlaneBoard', () => {
    it('should initialize empty board grid with correct dimensions', () => {
        const board = new Board(8, 8);
        expect(board.cols).toBe(8);
        expect(board.rows).toBe(8);
        expect(board.getAllPieces().length).toBe(0);
    });

    it('should correctly place, move and remove pieces', () => {
        const board = new Board(8, 8);
        const king = new King('k1', 'white', { x: 4, y: 7 });
        board.setPiece(king, 4, 7);

        expect(board.getPieceAt(4, 7)).toBe(king);
        expect(king.position).toEqual({ x: 4, y: 7 });

        board.movePiece({ x: 4, y: 7 }, { x: 4, y: 6 });
        expect(board.getPieceAt(4, 7)).toBeNull();
        expect(board.getPieceAt(4, 6)).toBe(king);
        expect(king.position).toEqual({ x: 4, y: 6 });

        board.removePieceAt(4, 6);
        expect(board.getPieceAt(4, 6)).toBeNull();
        expect(board.getAllPieces().length).toBe(0);
    });

    it('should atomically swap two pieces', () => {
        const board = new Board(8, 8);
        const whiteKing = new King('wk', 'white', { x: 0, y: 0 });
        const blackRook = new Rook('br', 'black', { x: 7, y: 7 });

        board.setPiece(whiteKing, 0, 0);
        board.setPiece(blackRook, 7, 7);

        board.swapPieces({ x: 0, y: 0 }, { x: 7, y: 7 });

        expect(board.getPieceAt(0, 0)).toBe(blackRook);
        expect(board.getPieceAt(7, 7)).toBe(whiteKing);
        expect(blackRook.position).toEqual({ x: 0, y: 0 });
        expect(whiteKing.position).toEqual({ x: 7, y: 7 });
    });

    it('should clear all board squares', () => {
        const board = new Board(8, 8);
        board.setPiece(new King('k1', 'white', { x: 1, y: 1 }), 1, 1);
        board.setPiece(new Rook('r1', 'black', { x: 2, y: 2 }), 2, 2);

        expect(board.getAllPieces().length).toBe(2);
        board.clear();
        expect(board.getAllPieces().length).toBe(0);
        expect(board.getPieceAt(1, 1)).toBeNull();
    });

    it('should enforce Tamerlane Citadel boundary coordinates', () => {
        const tamerlaneBoard = new TamerlaneBoard();

        // Citadels: valid squares
        expect(tamerlaneBoard.isOutOfBounds(0, 1)).toBe(false); // Black citadel
        expect(tamerlaneBoard.isOutOfBounds(12, 8)).toBe(false); // White citadel

        // Main battlefield: columns 1 to 11
        expect(tamerlaneBoard.isOutOfBounds(1, 0)).toBe(false);
        expect(tamerlaneBoard.isOutOfBounds(11, 9)).toBe(false);

        // Outside battlefield voids: invalid
        expect(tamerlaneBoard.isOutOfBounds(0, 0)).toBe(true);
        expect(tamerlaneBoard.isOutOfBounds(12, 0)).toBe(true);
        expect(tamerlaneBoard.isOutOfBounds(13, 5)).toBe(true);
        expect(tamerlaneBoard.isOutOfBounds(-1, 5)).toBe(true);
    });
});
