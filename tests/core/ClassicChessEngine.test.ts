import { describe, it, expect } from 'vitest';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { ClassicChess } from '../../src/core/variants/ClassicChess';
import { King, Rook, Queen, Knight, Pawn } from '../../src/core/pieces/piecesIndex';

describe('ClassicChessEngine', () => {
    it('should initialize standard chess setup with 20 legal opening moves for White', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        expect(engine.currentTurn).toBe('white');
        expect(engine.state).toBe('playing');

        const whitePieces = engine.board.getAllPieces().filter(p => p.color === 'white');
        const totalOpeningMoves = whitePieces.reduce((acc, p) => acc + engine.getLegalMoves(p).length, 0);

        // 16 pawn moves (8 single + 8 double) + 4 knight moves = 20 opening moves
        expect(totalOpeningMoves).toBe(20);
    });

    it('should alternate turns and track move history', () => {
        const engine = new ClassicChessEngine(new ClassicChess());

        // 1. e4
        const moveSuccess = engine.executeMove({ x: 4, y: 6 }, { x: 4, y: 4 });
        expect(moveSuccess).toBe(true);
        expect(engine.currentTurn).toBe('black');
        expect(engine.history.length).toBe(1);
        expect(engine.history[0].san).toBe('e4');
    });

    it('should execute Scholar\'s Mate and reach checkmate state', () => {
        const engine = new ClassicChessEngine(new ClassicChess());

        // 1. e4 e5
        engine.executeMove({ x: 4, y: 6 }, { x: 4, y: 4 });
        engine.executeMove({ x: 4, y: 1 }, { x: 4, y: 3 });

        // 2. Bc4 Nc6
        engine.executeMove({ x: 5, y: 7 }, { x: 2, y: 4 });
        engine.executeMove({ x: 1, y: 0 }, { x: 2, y: 2 });

        // 3. Qh5 Nf6??
        engine.executeMove({ x: 3, y: 7 }, { x: 7, y: 3 });
        engine.executeMove({ x: 6, y: 0 }, { x: 5, y: 2 });

        // 4. Qxf7# (Checkmate)
        const checkmateSuccess = engine.executeMove({ x: 7, y: 3 }, { x: 5, y: 1 });
        expect(checkmateSuccess).toBe(true);
        expect(engine.state).toBe('checkmate');
    });

    it('should allow Kingside castling (O-O) and reposition King and Rook atomically', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        engine.board.clear();

        const whiteKing = new King('wk', 'white', { x: 4, y: 7 });
        const whiteRook = new Rook('wr', 'white', { x: 7, y: 7 });
        const blackKing = new King('bk', 'black', { x: 4, y: 0 });

        engine.board.setPiece(whiteKing, 4, 7);
        engine.board.setPiece(whiteRook, 7, 7);
        engine.board.setPiece(blackKing, 4, 0);

        // Castling move for King (4,7) -> (6,7)
        const legalMoves = engine.getLegalMoves(whiteKing);
        expect(legalMoves.some(m => m.x === 6 && m.y === 7)).toBe(true);

        const success = engine.executeMove({ x: 4, y: 7 }, { x: 6, y: 7 });
        expect(success).toBe(true);
        expect(engine.board.getPieceAt(6, 7)).toBe(whiteKing);
        expect(engine.board.getPieceAt(5, 7)).toBe(whiteRook);
        expect(engine.board.getPieceAt(7, 7)).toBeNull();
    });

    it('should allow Queenside castling (O-O-O) and reposition King and Rook atomically', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        engine.board.clear();

        const whiteKing = new King('wk', 'white', { x: 4, y: 7 });
        const whiteRook = new Rook('wr', 'white', { x: 0, y: 7 });
        const blackKing = new King('bk', 'black', { x: 4, y: 0 });

        engine.board.setPiece(whiteKing, 4, 7);
        engine.board.setPiece(whiteRook, 0, 7);
        engine.board.setPiece(blackKing, 4, 0);

        // Castling move for King (4,7) -> (2,7)
        const legalMoves = engine.getLegalMoves(whiteKing);
        expect(legalMoves.some(m => m.x === 2 && m.y === 7)).toBe(true);

        const success = engine.executeMove({ x: 4, y: 7 }, { x: 2, y: 7 });
        expect(success).toBe(true);
        expect(engine.board.getPieceAt(2, 7)).toBe(whiteKing);
        expect(engine.board.getPieceAt(3, 7)).toBe(whiteRook);
        expect(engine.board.getPieceAt(0, 7)).toBeNull();
    });

    it('should promote a pawn to the chosen piece when reaching the 8th rank', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        engine.board.clear();

        const whitePawn = new Pawn('wp', 'white', { x: 4, y: 1 });
        const blackKing = new King('bk', 'black', { x: 0, y: 0 });
        const whiteKing = new King('wk', 'white', { x: 4, y: 7 });

        engine.board.setPiece(whitePawn, 4, 1);
        engine.board.setPiece(blackKing, 0, 0);
        engine.board.setPiece(whiteKing, 4, 7);

        // Promote to Queen
        const successQueen = engine.executeMove({ x: 4, y: 1 }, { x: 4, y: 0 }, 'Queen');
        expect(successQueen).toBe(true);
        const promotedPiece = engine.board.getPieceAt(4, 0);
        expect(promotedPiece).toBeInstanceOf(Queen);
        expect(promotedPiece?.color).toBe('white');
    });
});
