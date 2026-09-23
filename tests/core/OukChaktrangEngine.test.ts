import { describe, it, expect } from 'vitest';
import { OukChaktrangEngine } from '../../src/core/engine/OukChaktrangEngine';
import { Makruk } from '../../src/core/variants/Makruk';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import { Khun, Ruea, Ma } from '../../src/core/pieces/piecesIndex';


describe('Ouk Chaktrang (Cambodian Chess)', () => {
    describe('Board Setup & Inheritance', () => {
        it('should correctly initialize 8x8 board with Ouk Chaktrang variant', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            expect(engine.board.rows).toBe(8);
            expect(engine.board.cols).toBe(8);
            expect(engine.currentTurn).toBe('white');
            expect(engine.state).toBe('playing');
        });

        it('should generate initial FEN with DEde special opening rights', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            const fen = engine.getFen();
            expect(fen).toBe('rnsmksnr/8/pppppppp/8/8/PPPPPPPP/8/RNSKMSNR w DEde - 0 1');
        });
    });

    describe('Lord\'s Special Opening Move (Knight Leap)', () => {
        it('should allow Lord to leap like a horse on first move when not in check and no captures occurred', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            // White Lord on d1 (x=3, y=7).
            // Normal 1-step moves: c2 (2,6), d2 (3,6), e2 (4,6)
            // Knight leaps: b2 (1,6), f2 (5,6)
            // Note: c3 (2,5) and e3 (4,5) are occupied by White Bia (own pieces)
            const whiteLord = engine.board.getPieceAt(3, 7)!;
            const legalMoves = engine.getLegalMoves(whiteLord);

            expect(legalMoves).toContainEqual({ x: 1, y: 6 }); // Knight leap to b2
            expect(legalMoves).toContainEqual({ x: 5, y: 6 }); // Knight leap to f2
            expect(legalMoves).toContainEqual({ x: 3, y: 6 }); // Normal step to d2

            // Execute knight leap
            const success = engine.executeMove({ x: 3, y: 7 }, { x: 1, y: 6 });
            expect(success).toBe(true);
            expect(engine.board.getPieceAt(1, 6)?.name).toBe('Khun');
        });

        it('should NOT allow Lord to leap like a horse once it has already moved', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            // Move Lord normally to d2
            engine.executeMove({ x: 3, y: 7 }, { x: 3, y: 6 });
            // Black plays e6e5
            engine.executeMove({ x: 4, y: 2 }, { x: 4, y: 3 });

            // Now White Lord on d2 has moved (hasMoved = true)
            const movedLord = engine.board.getPieceAt(3, 6)!;
            const legalMoves = engine.getLegalMoves(movedLord);

            // Cannot leap like a horse anymore
            expect(legalMoves).not.toContainEqual({ x: 1, y: 7 }); // Knight leap b1
            expect(legalMoves).not.toContainEqual({ x: 5, y: 7 }); // Knight leap f1
        });

        it('should NOT allow Lord to leap like a horse if currently in check', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            engine.board.clear();

            // White Lord on d1 (3, 7) - unmoved
            const whiteLord = new Khun('k_w', 'white', { x: 3, y: 7 });
            // Black Ruea on d8 (3, 0) checking White Lord along file d
            const blackRuea = new Ruea('r_b', 'black', { x: 3, y: 0 });

            engine.board.setPiece(whiteLord, 3, 7);
            engine.board.setPiece(blackRuea, 3, 0);
            engine.updateGameState();

            expect(engine.isKingInCheck('white')).toBe(true);

            const legalMoves = engine.getLegalMoves(whiteLord);
            // Must step out of check normally (c1, e1, c2, e2). Knight moves cannot be used while in check!
            expect(legalMoves).not.toContainEqual({ x: 1, y: 6 }); // b2
            expect(legalMoves).not.toContainEqual({ x: 5, y: 6 }); // f2
        });

        it('should NOT allow Lord to leap like a horse if ANY piece has been captured in the game', () => {
            const engine = new OukChaktrangEngine(new Makruk());

            // 1. d3d4
            engine.executeMove({ x: 3, y: 5 }, { x: 3, y: 4 });
            // 1... c6c5
            engine.executeMove({ x: 2, y: 2 }, { x: 2, y: 3 });
            // 2. d4xc5 (CAPTURE occurs!)
            engine.executeMove({ x: 3, y: 4 }, { x: 2, y: 3 });

            expect(engine.hasAnyCaptureOccurred()).toBe(true);

            // Black plays 2... e6e5
            engine.executeMove({ x: 4, y: 2 }, { x: 4, y: 3 });

            // Now White's turn. White Lord is still unmoved on d1 (3, 7)
            const whiteLord = engine.board.getPieceAt(3, 7)!;
            expect(whiteLord.hasMoved).toBe(false);

            const legalMoves = engine.getLegalMoves(whiteLord);
            // Because a capture occurred, knight leap is disabled!
            expect(legalMoves).not.toContainEqual({ x: 1, y: 6 }); // b2
            expect(legalMoves).not.toContainEqual({ x: 5, y: 6 }); // f2
        });
    });

    describe('Seed\'s Special Opening Move (Two-Square Advance)', () => {
        it('should allow Seed to advance two squares forward on first move when no captures occurred', () => {
            const engine = new OukChaktrangEngine(new Makruk());

            // White moves cowrie in front of Seed: e3e4 (4,5 -> 4,4)
            engine.executeMove({ x: 4, y: 5 }, { x: 4, y: 4 });
            // Black plays a move: a6a5 (0,2 -> 0,3)
            engine.executeMove({ x: 0, y: 2 }, { x: 0, y: 3 });

            // White Seed on e1 (4, 7) now has e3 (4, 5) vacant
            const whiteSeed = engine.board.getPieceAt(4, 7)!;
            const legalMoves = engine.getLegalMoves(whiteSeed);

            // Can advance 2 squares straight forward to e3 (4, 5)
            expect(legalMoves).toContainEqual({ x: 4, y: 5 });

            // Execute 2-square advance
            const success = engine.executeMove({ x: 4, y: 7 }, { x: 4, y: 5 });
            expect(success).toBe(true);
            expect(engine.board.getPieceAt(4, 5)?.name).toBe('Met');
        });

        it('should NOT allow Seed to advance two squares forward once it has already moved', () => {
            const engine = new OukChaktrangEngine(new Makruk());

            // White moves Seed diagonally to d2 (3, 6)
            engine.executeMove({ x: 4, y: 7 }, { x: 3, y: 6 });
            // Black plays a move
            engine.executeMove({ x: 0, y: 2 }, { x: 0, y: 3 });

            // Now White Seed has moved (hasMoved = true)
            const movedSeed = engine.board.getPieceAt(3, 6)!;
            const legalMoves = engine.getLegalMoves(movedSeed);

            // Cannot advance two squares forward
            expect(legalMoves).not.toContainEqual({ x: 3, y: 4 });
        });

        it('should NOT allow Seed to advance two squares forward if ANY piece has been captured in the game', () => {
            const engine = new OukChaktrangEngine(new Makruk());

            // 1. d3d4
            engine.executeMove({ x: 3, y: 5 }, { x: 3, y: 4 });
            // 1... c6c5
            engine.executeMove({ x: 2, y: 2 }, { x: 2, y: 3 });
            // 2. d4xc5 (CAPTURE!)
            engine.executeMove({ x: 3, y: 4 }, { x: 2, y: 3 });
            // 2... b6xc5 (CAPTURE!)
            engine.executeMove({ x: 1, y: 2 }, { x: 2, y: 3 });
            // 3. e3e4 (vacates e3)
            engine.executeMove({ x: 4, y: 5 }, { x: 4, y: 4 });
            // 3... a6a5
            engine.executeMove({ x: 0, y: 2 }, { x: 0, y: 3 });

            expect(engine.hasAnyCaptureOccurred()).toBe(true);

            // White Seed is on e1 (4, 7) - unmoved
            const whiteSeed = engine.board.getPieceAt(4, 7)!;
            expect(whiteSeed.hasMoved).toBe(false);

            const legalMoves = engine.getLegalMoves(whiteSeed);
            // Because captures occurred, 2-square straight move to e3 (4, 5) is disabled!
            expect(legalMoves).not.toContainEqual({ x: 4, y: 5 });
        });
    });

    describe('Makruk Counting Rules Inheritance', () => {
        it('should trigger board counting (64 moves) when no cowries remain', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 3, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 4, y: 0 });

            engine.board.setPiece(whiteKhun, 3, 7);
            engine.board.setPiece(blackKhun, 4, 0);

            engine.updateGameState();
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);
        });

        it('should declare DRAW if the counting player checkmates without stopping the count', () => {
            const engine = new OukChaktrangEngine(new Makruk());
            engine.board.clear();

            // White has advantage (score 10)
            const whiteKhun = new Khun('k_w', 'white', { x: 0, y: 0 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 5, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 6, y: 7 });

            // Black is disadvantaged (score 8)
            const blackKhun = new Khun('k_b', 'black', { x: 2, y: 0 });
            const blackMa = new Ma('n_b', 'black', { x: 1, y: 3 });
            const blackRuea = new Ruea('r_b', 'black', { x: 4, y: 2 });

            engine.board.setPiece(whiteKhun, 0, 0);
            engine.board.setPiece(whiteRuea1, 5, 7);
            engine.board.setPiece(whiteRuea2, 6, 7);
            engine.board.setPiece(blackKhun, 2, 0);
            engine.board.setPiece(blackMa, 1, 3);
            engine.board.setPiece(blackRuea, 4, 2);

            engine.updateGameState();
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().disadvantagedColor).toBe('black');

            // Pass turn to Black
            (engine as any).currentTurn = 'black';

            // Black checkmates White while counting is still active
            const success = engine.executeMove({ x: 4, y: 2 }, { x: 0, y: 2 });
            expect(success).toBe(true);

            // Counting player delivering checkmate without stopping count results in DRAW
            expect(engine.state).toBe('draw');
        });
    });

    describe('Variant Registry Integration', () => {
        it('should be registered in VariantRegistry under regional category', () => {
            const def = VariantRegistry.get('ouk_chaktrang');
            expect(def).toBeDefined();
            expect(def?.title).toBe('Ouk Chaktrang');
            expect(def?.category).toBe('regional');

            const createdEngine = VariantRegistry.createEngine('ouk_chaktrang');
            expect(createdEngine).toBeInstanceOf(OukChaktrangEngine);
        });
    });
});
