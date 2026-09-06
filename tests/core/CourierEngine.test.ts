import { describe, it, expect } from 'vitest';
import { CourierEngine } from '../../src/core/engine/CourierEngine';
import { CourierChess } from '../../src/core/variants/CourierChess';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import {
    CourierKing,
    Courier,
    CourierBishop,
    CourierQueen,
    Schleich,
    Sage,
    CourierPawn,
    Rook,
    Knight
} from '../../src/core/pieces/piecesIndex';

describe('CourierEngine', () => {
    it('should initialize Courier Chess on a 12x8 board with full 24-piece armies', () => {
        const engine = new CourierEngine(new CourierChess());
        expect(engine.board.cols).toBe(12);
        expect(engine.board.rows).toBe(8);

        // White back rank (y = 7)
        expect(engine.board.getPieceAt(0, 7)).toBeInstanceOf(Rook);
        expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(Knight);
        expect(engine.board.getPieceAt(2, 7)).toBeInstanceOf(CourierBishop);
        expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(Courier);
        expect(engine.board.getPieceAt(4, 7)).toBeInstanceOf(Sage);
        expect(engine.board.getPieceAt(5, 7)).toBeInstanceOf(CourierKing);
        expect(engine.board.getPieceAt(6, 7)).toBeInstanceOf(CourierQueen);
        expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(Schleich);
        expect(engine.board.getPieceAt(8, 7)).toBeInstanceOf(Courier);
        expect(engine.board.getPieceAt(9, 7)).toBeInstanceOf(CourierBishop);
        expect(engine.board.getPieceAt(10, 7)).toBeInstanceOf(Knight);
        expect(engine.board.getPieceAt(11, 7)).toBeInstanceOf(Rook);

        // White pawn rank (y = 6)
        for (let x = 0; x < 12; x++) {
            expect(engine.board.getPieceAt(x, 6)).toBeInstanceOf(CourierPawn);
            expect(engine.board.getPieceAt(x, 6)?.color).toBe('white');
        }

        // Black back rank (y = 0)
        expect(engine.board.getPieceAt(0, 0)).toBeInstanceOf(Rook);
        expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(Knight);
        expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(CourierBishop);
        expect(engine.board.getPieceAt(3, 0)).toBeInstanceOf(Courier);
        expect(engine.board.getPieceAt(4, 0)).toBeInstanceOf(Sage);
        expect(engine.board.getPieceAt(5, 0)).toBeInstanceOf(CourierKing);
        expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(CourierQueen);
        expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(Schleich);
        expect(engine.board.getPieceAt(8, 0)).toBeInstanceOf(Courier);
        expect(engine.board.getPieceAt(9, 0)).toBeInstanceOf(CourierBishop);
        expect(engine.board.getPieceAt(10, 0)).toBeInstanceOf(Knight);
        expect(engine.board.getPieceAt(11, 0)).toBeInstanceOf(Rook);

        // Black pawn rank (y = 1)
        for (let x = 0; x < 12; x++) {
            expect(engine.board.getPieceAt(x, 1)).toBeInstanceOf(CourierPawn);
            expect(engine.board.getPieceAt(x, 1)?.color).toBe('black');
        }

        expect(engine.board.getAllPieces().length).toBe(48);
    });

    it('should allow Courier to slide diagonally across empty squares', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const courier = new Courier('w_courier', 'white', { x: 5, y: 4 });
        const enemyPawn = new CourierPawn('b_pawn', 'black', { x: 7, y: 2 });
        const allyPawn = new CourierPawn('w_pawn', 'white', { x: 3, y: 2 });

        engine.board.setPiece(courier, 5, 4);
        engine.board.setPiece(enemyPawn, 7, 2);
        engine.board.setPiece(allyPawn, 3, 2);

        const moves = courier.getPossibleMoves(engine.board);

        // Northeast ray can capture enemy at (7, 2) and stop
        expect(moves).toContainEqual({ x: 6, y: 3 });
        expect(moves).toContainEqual({ x: 7, y: 2 });
        expect(moves).not.toContainEqual({ x: 8, y: 1 });

        // Northwest ray blocked by ally at (3, 2)
        expect(moves).toContainEqual({ x: 4, y: 3 });
        expect(moves).not.toContainEqual({ x: 3, y: 2 });
    });

    it('should allow CourierBishop (Alfil) to leap 2 squares diagonally over obstacles', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const bishop = new CourierBishop('w_cb', 'white', { x: 4, y: 4 });
        const obstacle = new CourierPawn('obstacle', 'black', { x: 5, y: 5 });

        engine.board.setPiece(bishop, 4, 4);
        engine.board.setPiece(obstacle, 5, 5);

        const moves = bishop.getPossibleMoves(engine.board);
        expect(moves).toContainEqual({ x: 6, y: 6 });
        expect(moves).toContainEqual({ x: 2, y: 2 });
        expect(moves).toContainEqual({ x: 6, y: 2 });
        expect(moves).toContainEqual({ x: 2, y: 6 });
        expect(moves).not.toContainEqual({ x: 5, y: 5 });
    });

    it('should allow CourierQueen (Ferz) to move 1 square diagonally', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const queen = new CourierQueen('w_cq', 'white', { x: 4, y: 4 });
        engine.board.setPiece(queen, 4, 4);

        const moves = queen.getPossibleMoves(engine.board);
        expect(moves).toHaveLength(4);
        expect(moves).toContainEqual({ x: 3, y: 3 });
        expect(moves).toContainEqual({ x: 5, y: 3 });
        expect(moves).toContainEqual({ x: 3, y: 5 });
        expect(moves).toContainEqual({ x: 5, y: 5 });
    });

    it('should allow Schleich to move 1 square orthogonally', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const schleich = new Schleich('w_sc', 'white', { x: 4, y: 4 });
        engine.board.setPiece(schleich, 4, 4);

        const moves = schleich.getPossibleMoves(engine.board);
        expect(moves).toHaveLength(4);
        expect(moves).toContainEqual({ x: 4, y: 3 });
        expect(moves).toContainEqual({ x: 4, y: 5 });
        expect(moves).toContainEqual({ x: 3, y: 4 });
        expect(moves).toContainEqual({ x: 5, y: 4 });
    });

    it('should allow Sage to move 1 square in all 8 directions and be capturable', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const sage = new Sage('w_sage', 'white', { x: 4, y: 4 });
        engine.board.setPiece(sage, 4, 4);

        const moves = sage.getPossibleMoves(engine.board);
        expect(moves).toHaveLength(8);
        expect(moves).toContainEqual({ x: 4, y: 3 });
        expect(moves).toContainEqual({ x: 5, y: 3 });
        expect(moves).toContainEqual({ x: 5, y: 4 });
        expect(moves).toContainEqual({ x: 5, y: 5 });
        expect(moves).toContainEqual({ x: 4, y: 5 });
        expect(moves).toContainEqual({ x: 3, y: 5 });
        expect(moves).toContainEqual({ x: 3, y: 4 });
        expect(moves).toContainEqual({ x: 3, y: 3 });
    });

    it('should allow CourierPawn to advance 1 square and capture diagonally without double steps', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const pawn = new CourierPawn('w_pawn', 'white', { x: 4, y: 6 });
        const enemy = new CourierPawn('b_enemy', 'black', { x: 5, y: 5 });
        engine.board.setPiece(pawn, 4, 6);
        engine.board.setPiece(enemy, 5, 5);

        const moves = pawn.getPossibleMoves(engine.board);
        expect(moves).toContainEqual({ x: 4, y: 5 });
        expect(moves).toContainEqual({ x: 5, y: 5 });
        expect(moves).not.toContainEqual({ x: 4, y: 4 }); // No double step
    });

    it('should automatically promote CourierPawn to CourierQueen on the last rank', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const whitePawn = new CourierPawn('wp', 'white', { x: 3, y: 1 });
        const whiteKing = new CourierKing('wk', 'white', { x: 0, y: 7 });
        const blackKing = new CourierKing('bk', 'black', { x: 11, y: 0 });

        engine.board.setPiece(whitePawn, 3, 1);
        engine.board.setPiece(whiteKing, 0, 7);
        engine.board.setPiece(blackKing, 11, 0);

        const success = engine.executeMove({ x: 3, y: 1 }, { x: 3, y: 0 });
        expect(success).toBe(true);

        const promoted = engine.board.getPieceAt(3, 0);
        expect(promoted).toBeInstanceOf(CourierQueen);
        expect(promoted?.color).toBe('white');
    });

    it('should detect check and checkmate against CourierKing', () => {
        const engine = new CourierEngine(new CourierChess());
        engine.board.clear();

        const blackKing = new CourierKing('bk', 'black', { x: 0, y: 0 });
        const whiteRook1 = new Rook('wr1', 'white', { x: 0, y: 7 });
        const whiteRook2 = new Rook('wr2', 'white', { x: 1, y: 7 });
        const whiteKing = new CourierKing('wk', 'white', { x: 5, y: 7 });

        engine.board.setPiece(blackKing, 0, 0);
        engine.board.setPiece(whiteRook1, 0, 7);
        engine.board.setPiece(whiteRook2, 1, 7);
        engine.board.setPiece(whiteKing, 5, 7);

        // White rook delivers check on file 0
        expect(engine.isKingInCheck('black')).toBe(true);

        // If it's black turn, king cannot escape because file 0 and 1 are covered
        engine.currentTurn = 'black';
        engine.updateGameState();
        expect(engine.state).toBe('checkmate');
    });

    it('should be registered in VariantRegistry', () => {
        const variantDef = VariantRegistry.get('courier');
        expect(variantDef).toBeDefined();
        expect(variantDef?.title).toBe('Courier Chess');

        const engine = VariantRegistry.createEngine('courier');
        expect(engine).toBeInstanceOf(CourierEngine);
    });
});
