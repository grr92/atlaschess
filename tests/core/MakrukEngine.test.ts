import { describe, it, expect } from 'vitest';
import { MakrukEngine } from '../../src/core/engine/MakrukEngine';
import { Makruk } from '../../src/core/variants/Makruk';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import {
    Khun,
    Met,
    Khon,
    Ma,
    Ruea,
    Bia,
    Biangai
} from '../../src/core/pieces/piecesIndex';

describe('Makruk (Thai Chess)', () => {
    describe('Board Setup', () => {
        it('should correctly initialize the standard 8x8 Makruk army configuration', () => {
            const engine = new MakrukEngine(new Makruk());

            // Rank 8 (Black back rank, y = 0)
            expect(engine.board.getPieceAt(0, 0)).toBeInstanceOf(Ruea);
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(Ma);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(Khon);
            expect(engine.board.getPieceAt(3, 0)).toBeInstanceOf(Met); // Seed on d8 (right of Lord for Black)
            expect(engine.board.getPieceAt(4, 0)).toBeInstanceOf(Khun); // Lord on e8
            expect(engine.board.getPieceAt(5, 0)).toBeInstanceOf(Khon);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(Ma);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(Ruea);

            // Rank 6 (Black Cowries, y = 2)
            for (let x = 0; x < 8; x++) {
                const bia = engine.board.getPieceAt(x, 2);
                expect(bia).toBeInstanceOf(Bia);
                expect(bia?.color).toBe('black');
            }

            // Rank 3 (White Cowries, y = 5)
            for (let x = 0; x < 8; x++) {
                const bia = engine.board.getPieceAt(x, 5);
                expect(bia).toBeInstanceOf(Bia);
                expect(bia?.color).toBe('white');
            }

            // Rank 1 (White back rank, y = 7)
            expect(engine.board.getPieceAt(0, 7)).toBeInstanceOf(Ruea);
            expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(Ma);
            expect(engine.board.getPieceAt(2, 7)).toBeInstanceOf(Khon);
            expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(Khun); // Lord on d1
            expect(engine.board.getPieceAt(4, 7)).toBeInstanceOf(Met); // Seed on e1 (right of Lord for White)
            expect(engine.board.getPieceAt(5, 7)).toBeInstanceOf(Khon);
            expect(engine.board.getPieceAt(6, 7)).toBeInstanceOf(Ma);
            expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(Ruea);

            // Empty ranks 2, 4, 5, 7 (y = 6, 4, 3, 1)
            for (let x = 0; x < 8; x++) {
                expect(engine.board.getPieceAt(x, 1)).toBeNull();
                expect(engine.board.getPieceAt(x, 3)).toBeNull();
                expect(engine.board.getPieceAt(x, 4)).toBeNull();
                expect(engine.board.getPieceAt(x, 6)).toBeNull();
            }
        });
    });

    describe('Piece Movement Mechanics', () => {
        it('Khun (Lord) should move 1 square in all 8 directions', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const khun = new Khun('k_w', 'white', { x: 3, y: 3 });
            engine.board.setPiece(khun, 3, 3);

            const moves = khun.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(8);
        });

        it('Met (Seed) should move 1 square diagonally in 4 directions', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const met = new Met('m_w', 'white', { x: 3, y: 3 });
            engine.board.setPiece(met, 3, 3);

            const moves = met.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(4);
            expect(moves).toContainEqual({ x: 2, y: 2 });
            expect(moves).toContainEqual({ x: 4, y: 2 });
            expect(moves).toContainEqual({ x: 2, y: 4 });
            expect(moves).toContainEqual({ x: 4, y: 4 });
        });

        it('Khon (Nobleman) should move 4 diagonal steps and 1 forward step', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            // White Khon
            const whiteKhon = new Khon('s_w', 'white', { x: 3, y: 3 });
            engine.board.setPiece(whiteKhon, 3, 3);

            const whiteMoves = whiteKhon.getPossibleMoves(engine.board);
            expect(whiteMoves).toHaveLength(5);
            expect(whiteMoves).toContainEqual({ x: 3, y: 2 }); // Forward for White (y - 1)
            expect(whiteMoves).toContainEqual({ x: 2, y: 2 });
            expect(whiteMoves).toContainEqual({ x: 4, y: 2 });
            expect(whiteMoves).toContainEqual({ x: 2, y: 4 });
            expect(whiteMoves).toContainEqual({ x: 4, y: 4 });

            // Black Khon
            const blackKhon = new Khon('s_b', 'black', { x: 3, y: 3 });
            engine.board.setPiece(blackKhon, 3, 3);

            const blackMoves = blackKhon.getPossibleMoves(engine.board);
            expect(blackMoves).toHaveLength(5);
            expect(blackMoves).toContainEqual({ x: 3, y: 4 }); // Forward for Black (y + 1)
        });

        it('Ma (Horse) should leap in L-shapes like a standard knight', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const ma = new Ma('n_w', 'white', { x: 3, y: 3 });
            engine.board.setPiece(ma, 3, 3);

            const moves = ma.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(8);
        });

        it('Ruea (Boat) should slide orthogonally like a standard rook', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const ruea = new Ruea('r_w', 'white', { x: 3, y: 3 });
            engine.board.setPiece(ruea, 3, 3);

            const moves = ruea.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(14); // 7 vertical + 7 horizontal
        });

        it('Bia (Cowrie) should move 1 square forward and capture diagonally forward without double step', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const bia = new Bia('p_w', 'white', { x: 3, y: 5 });
            const enemy1 = new Ma('e1', 'black', { x: 2, y: 4 });
            const enemy2 = new Ma('e2', 'black', { x: 4, y: 4 });
            engine.board.setPiece(bia, 3, 5);
            engine.board.setPiece(enemy1, 2, 4);
            engine.board.setPiece(enemy2, 4, 4);

            const moves = bia.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(3);
            expect(moves).toContainEqual({ x: 3, y: 4 }); // Forward non-capture
            expect(moves).toContainEqual({ x: 2, y: 4 }); // Diagonal capture left
            expect(moves).toContainEqual({ x: 4, y: 4 }); // Diagonal capture right
            expect(moves).not.toContainEqual({ x: 3, y: 3 }); // No 2-step advance
        });
    });

    describe('Mandatory Promotion Rule', () => {
        it('should automatically promote White Bia to Biangai upon reaching rank 6 (y = 2)', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteBia = new Bia('bia_w', 'white', { x: 3, y: 3 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteBia, 3, 3);

            // Move Bia from y=3 to relative rank 6 (y=2)
            const success = engine.executeMove({ x: 3, y: 3 }, { x: 3, y: 2 });
            expect(success).toBe(true);

            const pieceAtDest = engine.board.getPieceAt(3, 2);
            expect(pieceAtDest).toBeInstanceOf(Biangai);
            expect(pieceAtDest?.color).toBe('white');
        });

        it('should automatically promote Black Bia to Biangai upon reaching rank 3 (y = 5)', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const blackBia = new Bia('bia_b', 'black', { x: 4, y: 4 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(blackBia, 4, 4);

            // White turn first
            engine.executeMove({ x: 7, y: 7 }, { x: 6, y: 7 });

            // Black moves Bia from y=4 to relative rank 6 (y=5)
            const success = engine.executeMove({ x: 4, y: 4 }, { x: 4, y: 5 });
            expect(success).toBe(true);

            const pieceAtDest = engine.board.getPieceAt(4, 5);
            expect(pieceAtDest).toBeInstanceOf(Biangai);
            expect(pieceAtDest?.color).toBe('black');
        });
    });

    describe('Counting Rules', () => {
        it('should trigger board counting (64 moves) when no unpromoted cowries remain', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteMet = new Met('m_w', 'white', { x: 3, y: 3 });
            const blackMet = new Met('m_b', 'black', { x: 4, y: 4 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteMet, 3, 3);
            engine.board.setPiece(blackMet, 4, 4);

            engine.updateGameState();
            const counting = engine.getCountingStatus();
            expect(counting.type).toBe('board_64');
            expect(counting.baseLimit).toBe(64);
            expect(counting.maxMoves).toBe(64);
        });

        it('should calculate piece counting fleeing moves correctly for lone King vs 2 Boats', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 0, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 1, y: 7 });
            const whiteMa = new Ma('n_w', 'white', { x: 2, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            // Stronger player (White) has 4 pieces (2 Ruea + 1 Ma + 1 Khun)
            // Attacker has 2 Boats -> base limit = 8
            // Allowed fleeing moves = 8 - 4 = 4
            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(whiteRuea1, 0, 7);
            engine.board.setPiece(whiteRuea2, 1, 7);
            engine.board.setPiece(whiteMa, 2, 7);
            engine.board.setPiece(blackKhun, 0, 0);

            engine.updateGameState();
            const counting = engine.getCountingStatus();
            expect(counting.type).toBe('piece_count');
            expect(counting.fleeingColor).toBe('black');
            expect(counting.baseLimit).toBe(8);
            expect(counting.maxMoves).toBe(4); // 8 - 4 = 4 moves
        });

        it('should correctly calculate limits for all piece count cases', () => {
            const testCases = [
                { pieces: [new Ruea('r1', 'white', { x: 1, y: 7 }), new Ruea('r2', 'white', { x: 2, y: 7 })], base: 8 }, // 2 boats -> 8 - 3 = 5
                { pieces: [new Ruea('r1', 'white', { x: 1, y: 7 })], base: 16 }, // 1 boat -> 16 - 2 = 14
                { pieces: [new Khon('s1', 'white', { x: 1, y: 7 }), new Khon('s2', 'white', { x: 2, y: 7 })], base: 22 }, // 2 noblemen -> 22 - 3 = 19
                { pieces: [new Ma('n1', 'white', { x: 1, y: 7 }), new Ma('n2', 'white', { x: 2, y: 7 })], base: 32 }, // 2 horses -> 32 - 3 = 29
                { pieces: [new Khon('s1', 'white', { x: 1, y: 7 })], base: 44 }, // 1 nobleman -> 44 - 2 = 42
                { pieces: [new Ma('n1', 'white', { x: 1, y: 7 })], base: 64 }, // 1 horse -> 64 - 2 = 62
                { pieces: [new Met('m1', 'white', { x: 1, y: 7 })], base: 64 }, // seeds only -> 64 - 2 = 62
            ];

            for (const tc of testCases) {
                const engine = new MakrukEngine(new Makruk());
                engine.board.clear();
                const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
                const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
                engine.board.setPiece(whiteKhun, 7, 7);
                engine.board.setPiece(blackKhun, 0, 0);

                for (const p of tc.pieces) {
                    engine.board.setPiece(p, p.position.x, p.position.y);
                }

                engine.updateGameState();
                const status = engine.getCountingStatus();
                expect(status.type).toBe('piece_count');
                expect(status.baseLimit).toBe(tc.base);
                const strongerPieces = tc.pieces.length + 1; // + 1 for White Khun
                expect(status.maxMoves).toBe(tc.base - strongerPieces);
            }
        });

        it('should activate piece counting when a player is reduced to lone King even if cowries remain', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const whiteRuea = new Ruea('r_w', 'white', { x: 1, y: 7 });
            const whiteBia = new Bia('p_w', 'white', { x: 3, y: 5 }); // White still has unpromoted Bia
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(whiteRuea, 1, 7);
            engine.board.setPiece(whiteBia, 3, 5);
            engine.board.setPiece(blackKhun, 0, 0);

            engine.updateGameState();
            const status = engine.getCountingStatus();
            expect(status.type).toBe('piece_count');
            expect(status.fleeingColor).toBe('black');
            expect(status.isCountingActive).toBe(true);
            // 1 boat -> base 16, stronger has 3 pieces (Khun, Ruea, Bia) -> 16 - 3 = 13
            expect(status.maxMoves).toBe(13);
        });

        it('should declare draw if fleeing countdown limit is reached without checkmate', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 4, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 5, y: 7 });
            const whiteMa = new Ma('n_w', 'white', { x: 6, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(whiteRuea1, 4, 7);
            engine.board.setPiece(whiteRuea2, 5, 7);
            engine.board.setPiece(whiteMa, 6, 7);
            engine.board.setPiece(blackKhun, 0, 0);

            engine.updateGameState();
            expect(engine.state).toBe('playing');
            expect(engine.getCountingStatus().maxMoves).toBe(4);

            // Ply 1 & 2: Move 1
            engine.executeMove({ x: 7, y: 7 }, { x: 7, y: 6 });
            engine.executeMove({ x: 0, y: 0 }, { x: 1, y: 0 });

            // Ply 3 & 4: Move 2
            engine.executeMove({ x: 7, y: 6 }, { x: 7, y: 7 });
            engine.executeMove({ x: 1, y: 0 }, { x: 0, y: 0 });

            // Ply 5 & 6: Move 3
            engine.executeMove({ x: 7, y: 7 }, { x: 7, y: 6 });
            engine.executeMove({ x: 0, y: 0 }, { x: 1, y: 0 });

            // Ply 7 & 8: Move 4 (Limit reached!)
            engine.executeMove({ x: 7, y: 6 }, { x: 7, y: 7 });
            engine.executeMove({ x: 1, y: 0 }, { x: 0, y: 0 });

            expect(engine.state).toBe('draw');
        });

        it('should track remaining moves decreasing move by move', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 4, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 5, y: 7 });
            const whiteMa = new Ma('n_w', 'white', { x: 6, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(whiteRuea1, 4, 7);
            engine.board.setPiece(whiteRuea2, 5, 7);
            engine.board.setPiece(whiteMa, 6, 7);
            engine.board.setPiece(blackKhun, 0, 0);

            engine.updateGameState();
            expect(engine.getCountingStatus().remainingMoves).toBe(4);

            // Move 1
            engine.executeMove({ x: 7, y: 7 }, { x: 7, y: 6 });
            engine.executeMove({ x: 0, y: 0 }, { x: 1, y: 0 });
            expect(engine.getCountingStatus().remainingMoves).toBe(3);

            // Move 2
            engine.executeMove({ x: 7, y: 6 }, { x: 7, y: 7 });
            engine.executeMove({ x: 1, y: 0 }, { x: 0, y: 0 });
            expect(engine.getCountingStatus().remainingMoves).toBe(2);
        });

        it('should allow disadvantaged player to deactivate counting and avoid premature draw', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 4, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 5, y: 7 });
            const whiteMa = new Ma('n_w', 'white', { x: 6, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(whiteRuea1, 4, 7);
            engine.board.setPiece(whiteRuea2, 5, 7);
            engine.board.setPiece(whiteMa, 6, 7);
            engine.board.setPiece(blackKhun, 0, 0);

            engine.updateGameState();
            expect(engine.getCountingStatus().isCountingActive).toBe(true);

            // Disadvantaged player deactivates counting
            engine.stopCounting();
            expect(engine.getCountingStatus().isCountingActive).toBe(false);

            // Play 8 plies (4 moves)
            engine.executeMove({ x: 7, y: 7 }, { x: 7, y: 6 });
            engine.executeMove({ x: 0, y: 0 }, { x: 1, y: 0 });
            engine.executeMove({ x: 7, y: 6 }, { x: 7, y: 7 });
            engine.executeMove({ x: 1, y: 0 }, { x: 0, y: 0 });
            engine.executeMove({ x: 7, y: 7 }, { x: 7, y: 6 });
            engine.executeMove({ x: 0, y: 0 }, { x: 1, y: 0 });
            engine.executeMove({ x: 7, y: 6 }, { x: 7, y: 7 });
            engine.executeMove({ x: 1, y: 0 }, { x: 0, y: 0 });

            // Since counting was deactivated, game does not end in draw
            expect(engine.state).toBe('playing');

            // Now disadvantaged player restarts counting
            engine.startCounting('black');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);
            expect(engine.getCountingStatus().remainingMoves).toBe(4);
        });

        it('should continue board counting when any piece is captured (if not the last piece)', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteMet = new Met('m_w', 'white', { x: 3, y: 3 });
            const blackMet1 = new Met('m_b1', 'black', { x: 4, y: 4 });
            const blackMet2 = new Met('m_b2', 'black', { x: 0, y: 2 }); // Black still has another piece!

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteMet, 3, 3);
            engine.board.setPiece(blackMet1, 4, 4);
            engine.board.setPiece(blackMet2, 0, 2);

            engine.updateGameState();
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);

            // White Met captures Black Met1 (Black still has Black Met2, so not lone king)
            engine.executeMove({ x: 3, y: 3 }, { x: 4, y: 4 });

            // Counting does NOT stop on piece capture unless reduced to lone king
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);
        });

        it('should restart counting as piece_count when the captured piece was the last piece of a player', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteMet = new Met('m_w', 'white', { x: 3, y: 3 });
            const blackMet = new Met('m_b', 'black', { x: 4, y: 4 }); // Black's ONLY remaining piece

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteMet, 3, 3);
            engine.board.setPiece(blackMet, 4, 4);

            engine.updateGameState();
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);

            // White Met captures Black's last piece
            engine.executeMove({ x: 3, y: 3 }, { x: 4, y: 4 });

            // When the last piece is captured, count restarts as piece_count
            const newStatus = engine.getCountingStatus();
            expect(newStatus.type).toBe('piece_count');
            expect(newStatus.fleeingColor).toBe('black');
            expect(newStatus.isCountingActive).toBe(true);
        });

        it('should correctly identify the disadvantaged player color', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteRuea = new Ruea('r_w', 'white', { x: 0, y: 7 });

            engine.board.setPiece(whiteKhun, 7, 7);
            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteRuea, 0, 7);

            expect(engine.getDisadvantagedColor()).toBe('black'); // Lone king
        });

        it('should generate valid Makruk FEN strings including counting clock for Fairy-Stockfish', () => {
            const engine = new MakrukEngine(new Makruk());
            expect(engine.getFen()).toBe('rnsmksnr/8/pppppppp/8/8/PPPPPPPP/8/RNSKMSNR w - - 0 1');

            // Set up lone king situation with counting
            engine.board.clear();
            const whiteKhun = new Khun('k_w', 'white', { x: 4, y: 7 }); // e1
            const whiteRuea = new Ruea('r_w', 'white', { x: 0, y: 7 }); // a1
            const blackKhun = new Khun('k_b', 'black', { x: 4, y: 0 }); // e8
            const whiteBiangai = new Biangai('m_w', 'white', { x: 4, y: 6 }); // e2

            engine.board.setPiece(whiteKhun, 4, 7);
            engine.board.setPiece(whiteRuea, 0, 7);
            engine.board.setPiece(blackKhun, 4, 0);
            engine.board.setPiece(whiteBiangai, 4, 6);

            engine.startCounting('black');
            const fen = engine.getFen();
            // Stronger side has 3 pieces (Khun, Ruea, Biangai). 1 rook base = 16.
            // 16 - 3 = 13 moves = 26 plies
            expect(fen).toContain('4k3');
            expect(fen).toContain('4M3');
            expect(fen).toContain('R3K3');
            expect(fen).toMatch(/\sw\s-\s26\s0\s1$/);
        });
    });

    describe('Stalemate and Victory', () => {
        it('should declare draw on stalemate', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            // Black Khun in corner (0,0) stalemated by White Ruea on rank 1 and file 1
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 1, y: 7 }); // covers file 1
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 7, y: 1 }); // covers rank 1
            const whiteKhun = new Khun('k_w', 'white', { x: 7, y: 7 });

            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteRuea1, 1, 7);
            engine.board.setPiece(whiteRuea2, 7, 1);
            engine.board.setPiece(whiteKhun, 7, 7);

            // White makes a move to pass turn to Black without check
            engine.executeMove({ x: 7, y: 7 }, { x: 6, y: 7 });

            // Black has no legal moves and is not in check
            expect(engine.currentTurn).toBe('black');
            expect(engine.state).toBe('draw');
        });

        it('should declare DRAW if the disadvantaged/counting player checkmates without stopping the count', () => {
            const engine = new MakrukEngine(new Makruk());
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
            expect(engine.state).toBe('playing');
            expect(engine.getCountingStatus().type).toBe('board_64');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);
            expect(engine.getCountingStatus().disadvantagedColor).toBe('black');

            // Pass turn to Black
            (engine as any).currentTurn = 'black';

            // Black checkmates White while counting is still active
            const success = engine.executeMove({ x: 4, y: 2 }, { x: 0, y: 2 });
            expect(success).toBe(true);

            // Because Black did not stop counting, checkmate results in a DRAW
            expect(engine.state).toBe('draw');
        });

        it('should declare CHECKMATE (win) if the disadvantaged player stops counting before checkmating', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            const whiteKhun = new Khun('k_w', 'white', { x: 0, y: 0 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 5, y: 7 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 6, y: 7 });

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
            expect(engine.state).toBe('playing');
            (engine as any).currentTurn = 'black';

            // Black explicitly stops counting before delivering checkmate
            engine.stopCounting();
            expect(engine.getCountingStatus().isCountingActive).toBe(false);

            const success = engine.executeMove({ x: 4, y: 2 }, { x: 0, y: 2 });
            expect(success).toBe(true);

            // Since counting was stopped, checkmate stands as a win
            expect(engine.state).toBe('checkmate');
        });

        it('should declare CHECKMATE (win) when the advantaged player checkmates the counting player', () => {
            const engine = new MakrukEngine(new Makruk());
            engine.board.clear();

            // Black is lone king in corner (0, 0)
            const blackKhun = new Khun('k_b', 'black', { x: 0, y: 0 });

            // White has 2 Ruea and Khun
            const whiteKhun = new Khun('k_w', 'white', { x: 2, y: 0 });
            const whiteRuea1 = new Ruea('r1_w', 'white', { x: 1, y: 3 });
            const whiteRuea2 = new Ruea('r2_w', 'white', { x: 0, y: 6 });

            engine.board.setPiece(blackKhun, 0, 0);
            engine.board.setPiece(whiteKhun, 2, 0);
            engine.board.setPiece(whiteRuea1, 1, 3);
            engine.board.setPiece(whiteRuea2, 0, 6);

            engine.updateGameState();
            expect(engine.getCountingStatus().type).toBe('piece_count');
            expect(engine.getCountingStatus().fleeingColor).toBe('black');
            expect(engine.getCountingStatus().isCountingActive).toBe(true);

            // White delivers checkmate on Black
            const success = engine.executeMove({ x: 0, y: 6 }, { x: 0, y: 2 });
            expect(success).toBe(true);

            // Advantaged player wins by checkmate within the quota
            expect(engine.state).toBe('checkmate');
        });
    });

    describe('Variant Registry Integration', () => {
        it('should be registered in VariantRegistry under the regional category', () => {
            const def = VariantRegistry.get('makruk');
            expect(def).toBeDefined();
            expect(def?.title).toBe('Makruk');
            expect(def?.category).toBe('regional');

            const createdEngine = VariantRegistry.createEngine('makruk');
            expect(createdEngine).toBeInstanceOf(MakrukEngine);
        });
    });
});
