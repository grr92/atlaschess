import { describe, it, expect } from 'vitest';
import { SittuyinEngine } from '../../src/core/engine/SittuyinEngine';
import { Sittuyin } from '../../src/core/variants/Sittuyin';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import { useGameStore } from '../../src/store/useGameStore';
import {
    getSittuyinPresets,
    getAiSittuyinPreset,
    isSquareValidForSittuyinDeploy,
    SITTUYIN_INITIAL_POOL
} from '../../src/core/variants/sittuyin/sittuyinSetup';
import {
    Mingyi,
    Sitke,
    Sin,
    Myin,
    Yahhta,
    Ne
} from '../../src/core/pieces/piecesIndex';

import { getSquareBackground } from '../../src/utils/pieceMapper';

describe('Sittuyin (Burmese Chess)', () => {
    describe('Variant Registry Definition', () => {
        it('should correctly register Sittuyin in VariantRegistry with monochrome board and red/black colors', () => {
            const def = VariantRegistry.get('sittuyin');
            expect(def).toBeDefined();
            expect(def?.id).toBe('sittuyin');
            expect(def?.title).toBe('Sittuyin');
            expect(def?.category).toBe('regional');
            expect(def?.isMonochromeBoard).toBe(true);
            expect(def?.playerColors).toEqual(['red', 'black']);
            expect(def?.defaultPlayerColor).toBe('red');
        });

        it('should return uniform light background for all squares on Sittuyin board', () => {
            const lightBg = getSquareBackground(0, 0, 'sittuyin');
            expect(lightBg).toBeDefined();
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const bg = getSquareBackground(x, y, 'sittuyin');
                    expect(bg).toBe(lightBg);
                }
            }
        });
    });

    describe('Board Setup', () => {
        it('should correctly initialize the standard 8x8 Sittuyin army configuration', () => {
            const engine = new SittuyinEngine(new Sittuyin());

            // Red starts first
            expect(engine.currentTurn).toBe('red');

            // Rank 8 (Black back rank, y = 0)
            expect(engine.board.getPieceAt(0, 0)).toBeInstanceOf(Yahhta);
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(Myin);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(Sin);
            expect(engine.board.getPieceAt(3, 0)).toBeInstanceOf(Mingyi);
            expect(engine.board.getPieceAt(4, 0)).toBeInstanceOf(Sitke);
            expect(engine.board.getPieceAt(5, 0)).toBeInstanceOf(Sin);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(Myin);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(Yahhta);

            // Black pawns: 4 on rank 5 (a5-d5, y = 3) and 4 on rank 6 (e6-h6, y = 2)
            for (let x = 0; x < 4; x++) {
                const pawn = engine.board.getPieceAt(x, 3);
                expect(pawn).toBeInstanceOf(Ne);
                expect(pawn?.color).toBe('black');
            }
            for (let x = 4; x < 8; x++) {
                const pawn = engine.board.getPieceAt(x, 2);
                expect(pawn).toBeInstanceOf(Ne);
                expect(pawn?.color).toBe('black');
            }

            // Red pawns: 4 on rank 3 (a3-d3, y = 5) and 4 on rank 4 (e4-h4, y = 4)
            for (let x = 0; x < 4; x++) {
                const pawn = engine.board.getPieceAt(x, 5);
                expect(pawn).toBeInstanceOf(Ne);
                expect(pawn?.color).toBe('red');
            }
            for (let x = 4; x < 8; x++) {
                const pawn = engine.board.getPieceAt(x, 4);
                expect(pawn).toBeInstanceOf(Ne);
                expect(pawn?.color).toBe('red');
            }

            // Rank 1 (Red back rank, y = 7)
            expect(engine.board.getPieceAt(0, 7)).toBeInstanceOf(Yahhta);
            expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(Myin);
            expect(engine.board.getPieceAt(2, 7)).toBeInstanceOf(Sin);
            expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(Mingyi);
            expect(engine.board.getPieceAt(4, 7)).toBeInstanceOf(Sitke);
            expect(engine.board.getPieceAt(5, 7)).toBeInstanceOf(Sin);
            expect(engine.board.getPieceAt(6, 7)).toBeInstanceOf(Myin);
            expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(Yahhta);
        });
    });

    describe('Piece Movements', () => {
        it('should verify Sin (Elephant) moves 1 square diagonally in 4 directions or 1 square forward', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Place Red Elephant at (4, 4)
            const redSin = new Sin('sin_r', 'red', { x: 4, y: 4 });
            engine.board.setPiece(redSin, 4, 4);

            // Red moves forward with y = -1 (towards y = 0)
            const moves = redSin.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(5);
            expect(moves).toContainEqual({ x: 4, y: 3 }); // Forward
            expect(moves).toContainEqual({ x: 3, y: 3 }); // Diag forward-left
            expect(moves).toContainEqual({ x: 5, y: 3 }); // Diag forward-right
            expect(moves).toContainEqual({ x: 3, y: 5 }); // Diag backward-left
            expect(moves).toContainEqual({ x: 5, y: 5 }); // Diag backward-right

            // Place Black Elephant at (4, 4)
            engine.board.clear();
            const blackSin = new Sin('sin_b', 'black', { x: 4, y: 4 });
            engine.board.setPiece(blackSin, 4, 4);

            // Black moves forward with y = +1 (towards y = 7)
            const blackMoves = blackSin.getPossibleMoves(engine.board);
            expect(blackMoves).toHaveLength(5);
            expect(blackMoves).toContainEqual({ x: 4, y: 5 }); // Forward
            expect(blackMoves).toContainEqual({ x: 3, y: 5 }); // Diag forward-left
            expect(blackMoves).toContainEqual({ x: 5, y: 5 }); // Diag forward-right
            expect(blackMoves).toContainEqual({ x: 3, y: 3 }); // Diag backward-left
            expect(blackMoves).toContainEqual({ x: 5, y: 3 }); // Diag backward-right
        });

        it('should verify Sitke (General) moves 1 square diagonally in 4 directions', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            const sitke = new Sitke('sitke_r', 'red', { x: 3, y: 3 });
            engine.board.setPiece(sitke, 3, 3);

            const moves = sitke.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(4);
            expect(moves).toContainEqual({ x: 2, y: 2 });
            expect(moves).toContainEqual({ x: 4, y: 2 });
            expect(moves).toContainEqual({ x: 2, y: 4 });
            expect(moves).toContainEqual({ x: 4, y: 4 });
        });

        it('should verify Ne (Pawn) moves 1 step forward and captures diagonally forward', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            const redNe = new Ne('ne_r', 'red', { x: 3, y: 4 });
            engine.board.setPiece(redNe, 3, 4);

            // Without enemies: only 1 forward step
            let moves = redNe.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(1);
            expect(moves).toContainEqual({ x: 3, y: 3 });

            // Place enemy piece diagonally forward at (2, 3)
            const enemy = new Ne('enemy_b', 'black', { x: 2, y: 3 });
            engine.board.setPiece(enemy, 2, 3);

            moves = redNe.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(2);
            expect(moves).toContainEqual({ x: 3, y: 3 });
            expect(moves).toContainEqual({ x: 2, y: 3 });
        });
    });

    describe('Promotion Mechanics', () => {
        it('should identify promotion squares accurately in enemy half on or beyond diagonal', () => {
            const engine = new SittuyinEngine(new Sittuyin());

            // Red enemy half is y in [0..3]
            expect(engine.isPromotionSquare({ x: 0, y: 0 }, 'red')).toBe(true); // a8 (on diagonal)
            expect(engine.isPromotionSquare({ x: 3, y: 3 }, 'red')).toBe(true); // d5 (on diagonal)
            expect(engine.isPromotionSquare({ x: 7, y: 0 }, 'red')).toBe(true); // h8 (on diagonal)
            expect(engine.isPromotionSquare({ x: 4, y: 3 }, 'red')).toBe(true); // e5 (on diagonal)
            expect(engine.isPromotionSquare({ x: 4, y: 2 }, 'red')).toBe(true); // e6 (crossed diagonal into promotion zone!)
            expect(engine.isPromotionSquare({ x: 1, y: 0 }, 'red')).toBe(true); // b8 (crossed diagonal into promotion zone!)
            expect(engine.isPromotionSquare({ x: 4, y: 4 }, 'red')).toBe(false); // friendly half for Red
            expect(engine.isPromotionSquare({ x: 5, y: 3 }, 'red')).toBe(false); // f5 (before reaching diagonal on file f)

            // Black enemy half is y in [4..7]
            expect(engine.isPromotionSquare({ x: 7, y: 7 }, 'black')).toBe(true); // h1 (on diagonal)
            expect(engine.isPromotionSquare({ x: 4, y: 4 }, 'black')).toBe(true); // e4 (on diagonal)
            expect(engine.isPromotionSquare({ x: 0, y: 7 }, 'black')).toBe(true); // a1 (on diagonal)
            expect(engine.isPromotionSquare({ x: 3, y: 4 }, 'black')).toBe(true); // d4 (on diagonal)
            expect(engine.isPromotionSquare({ x: 4, y: 5 }, 'black')).toBe(true); // e3 (crossed diagonal into promotion zone!)
            expect(engine.isPromotionSquare({ x: 3, y: 3 }, 'black')).toBe(false); // friendly half for Black
            expect(engine.isPromotionSquare({ x: 2, y: 4 }, 'black')).toBe(false); // c4 (before reaching diagonal on file c)
        });

        it('should immediately promote when capturing from f5 to e6 if friendly General is dead', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Kings to avoid invalid game state
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

            // Red pawn at f5 (5, 3). General is dead.
            engine.board.setPiece(new Ne('p_r', 'red', { x: 5, y: 3 }), 5, 3);
            // Black pawn at e6 (4, 2)
            engine.board.setPiece(new Ne('p_b', 'black', { x: 4, y: 2 }), 4, 2);

            expect(engine.hasActiveGeneral('red')).toBe(false);

            // Capture from f5 (5, 3) to e6 (4, 2)
            const success = engine.executeMove({ x: 5, y: 3 }, { x: 4, y: 2 });
            expect(success).toBe(true);

            // Piece at e6 (4, 2) must promote immediately to Sitke
            const pieceAtE6 = engine.board.getPieceAt(4, 2);
            expect(pieceAtE6).toBeInstanceOf(Sitke);
            expect(pieceAtE6?.color).toBe('red');
        });

        it('should replay the user save and immediately promote pawn when capturing from f5 to e6', () => {
            const userHistory = [
                {
                    piece: { id: 'p_r_3', color: 'red', position: { x: 3, y: 4 }, name: 'Ne', hasMoved: true },
                    from: { x: 3, y: 5 },
                    to: { x: 3, y: 4 },
                    capturedPiece: null,
                    san: 'd4'
                },
                {
                    piece: { id: 'p_b_2', color: 'black', position: { x: 4, y: 7 }, name: 'Ne', hasMoved: true },
                    from: { x: 2, y: 3 },
                    to: { x: 3, y: 4 },
                    capturedPiece: { id: 'p_r_3', color: 'red', position: { x: 3, y: 4 }, name: 'Ne', hasMoved: true },
                    san: 'xd4'
                },
                {
                    piece: { id: 'p_r_2', color: 'red', position: { x: 2, y: 2 }, name: 'Ne', hasMoved: true },
                    from: { x: 2, y: 5 },
                    to: { x: 2, y: 4 },
                    capturedPiece: null,
                    san: 'c4'
                },
                {
                    piece: { id: 'p_b_2', color: 'black', position: { x: 4, y: 7 }, name: 'Ne', hasMoved: true },
                    from: { x: 3, y: 4 },
                    to: { x: 3, y: 5 },
                    capturedPiece: null,
                    san: 'd3'
                },
                {
                    piece: { id: 'p_r_2', color: 'red', position: { x: 2, y: 2 }, name: 'Ne', hasMoved: true },
                    from: { x: 2, y: 4 },
                    to: { x: 2, y: 3 },
                    capturedPiece: null,
                    san: 'c5'
                },
                {
                    piece: { id: 'p_b_2', color: 'black', position: { x: 4, y: 7 }, name: 'Ne', hasMoved: true },
                    from: { x: 3, y: 5 },
                    to: { x: 3, y: 6 },
                    capturedPiece: null,
                    san: 'd2'
                },
                {
                    piece: { id: 'p_r_2', color: 'red', position: { x: 2, y: 2 }, name: 'Ne', hasMoved: true },
                    from: { x: 2, y: 3 },
                    to: { x: 2, y: 2 },
                    capturedPiece: null,
                    san: 'c6'
                },
                {
                    piece: { id: 'p_b_2', color: 'black', position: { x: 4, y: 7 }, name: 'Ne', hasMoved: true },
                    from: { x: 3, y: 6 },
                    to: { x: 4, y: 7 },
                    capturedPiece: { id: 's_r', color: 'red', position: { x: 4, y: 7 }, name: 'Sitke', hasMoved: false },
                    san: 'xe1'
                },
                {
                    piece: { id: 'p_r_5', color: 'red', position: { x: 5, y: 3 }, name: 'Ne', hasMoved: true },
                    from: { x: 5, y: 4 },
                    to: { x: 5, y: 3 },
                    capturedPiece: null,
                    san: 'f5'
                },
                {
                    piece: { id: 'p_b_6', color: 'black', position: { x: 6, y: 3 }, name: 'Ne', hasMoved: true },
                    from: { x: 6, y: 2 },
                    to: { x: 6, y: 3 },
                    capturedPiece: null,
                    san: 'g5'
                }
            ];

            const engine = new SittuyinEngine(new Sittuyin());
            for (const m of userHistory) {
                engine.executeMove(m.from, m.to);
            }

            expect(engine.currentTurn).toBe('red');
            expect(engine.hasActiveGeneral('red')).toBe(false);

            // Red moves pawn from f5 (5, 3) to e6 (4, 2), capturing Black pawn at e6
            const moveSuccess = engine.executeMove({ x: 5, y: 3 }, { x: 4, y: 2 });
            expect(moveSuccess).toBe(true);

            // Piece at e6 must be immediately promoted to Sitke!
            const pieceAtE6 = engine.board.getPieceAt(4, 2);
            expect(pieceAtE6).toBeInstanceOf(Sitke);
            expect(pieceAtE6?.color).toBe('red');
        });

        it('should NOT promote pawn at c6 when moving upwards to c7 because it is already on the promotion line', () => {
            const userHistory = [
                { from: { x: 3, y: 5 }, to: { x: 3, y: 4 } },
                { from: { x: 2, y: 3 }, to: { x: 3, y: 4 } },
                { from: { x: 2, y: 5 }, to: { x: 2, y: 4 } },
                { from: { x: 3, y: 4 }, to: { x: 3, y: 5 } },
                { from: { x: 2, y: 4 }, to: { x: 2, y: 3 } },
                { from: { x: 3, y: 5 }, to: { x: 3, y: 6 } },
                { from: { x: 2, y: 3 }, to: { x: 2, y: 2 } },
                { from: { x: 3, y: 6 }, to: { x: 4, y: 7 } },
                { from: { x: 5, y: 4 }, to: { x: 5, y: 3 } },
                { from: { x: 6, y: 2 }, to: { x: 6, y: 3 } }
            ];

            const engine = new SittuyinEngine(new Sittuyin());
            for (const m of userHistory) {
                engine.executeMove(m.from, m.to);
            }

            expect(engine.currentTurn).toBe('red');
            expect(engine.hasActiveGeneral('red')).toBe(false);

            // Red pawn at c6 (2, 2) is already on the promotion line and eligible for deferred in-place promotion
            expect(engine.canPromoteDeferred({ x: 2, y: 2 })).toBe(true);

            // But if Red chooses to move the pawn upward to c7 (2, 1):
            const moveSuccess = engine.executeMove({ x: 2, y: 2 }, { x: 2, y: 1 });
            expect(moveSuccess).toBe(true);

            // The piece at c7 MUST NOT have promoted! It must remain a Ne (pawn)
            const pieceAtC7 = engine.board.getPieceAt(2, 1);
            expect(pieceAtC7).toBeInstanceOf(Ne);
            expect(pieceAtC7?.color).toBe('red');
            expect((pieceAtC7 as Ne).hasLostPromotion).toBe(true);

            // And it can no longer promote deferred in future turns
            expect(engine.canPromoteDeferred({ x: 2, y: 1 })).toBe(false);
        });

        it('should allow deferred in-place promotion at c6 if player does not move it away', () => {
            const userHistory = [
                { from: { x: 3, y: 5 }, to: { x: 3, y: 4 } },
                { from: { x: 2, y: 3 }, to: { x: 3, y: 4 } },
                { from: { x: 2, y: 5 }, to: { x: 2, y: 4 } },
                { from: { x: 3, y: 4 }, to: { x: 3, y: 5 } },
                { from: { x: 2, y: 4 }, to: { x: 2, y: 3 } },
                { from: { x: 3, y: 5 }, to: { x: 3, y: 6 } },
                { from: { x: 2, y: 3 }, to: { x: 2, y: 2 } },
                { from: { x: 3, y: 6 }, to: { x: 4, y: 7 } },
                { from: { x: 5, y: 4 }, to: { x: 5, y: 3 } },
                { from: { x: 6, y: 2 }, to: { x: 6, y: 3 } }
            ];

            const engine = new SittuyinEngine(new Sittuyin());
            for (const m of userHistory) {
                engine.executeMove(m.from, m.to);
            }

            expect(engine.currentTurn).toBe('red');
            expect(engine.hasActiveGeneral('red')).toBe(false);

            // Player promotes in-place
            const promoted = engine.promotePawnInPlace({ x: 2, y: 2 });
            expect(promoted).toBe(true);

            const pieceAtC6 = engine.board.getPieceAt(2, 2);
            expect(pieceAtC6).toBeInstanceOf(Sitke);
            expect(pieceAtC6?.color).toBe('red');
            expect(engine.currentTurn).toBe('black');
            expect(engine.history[engine.history.length - 1].san).toBe('c6=Sitke');
        });

        it('should promote immediately when pawn lands on enemy diagonal AND friendly General is dead', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Kings to avoid invalid game state
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

            // Red pawn at (3, 4) moving to (3, 3) which is d5 (on diagonal in enemy half)
            // Note: Red has NO Sitke on the board
            const pawn = new Ne('pawn_r', 'red', { x: 3, y: 4 });
            engine.board.setPiece(pawn, 3, 4);

            expect(engine.hasActiveGeneral('red')).toBe(false);

            const success = engine.executeMove({ x: 3, y: 4 }, { x: 3, y: 3 });
            expect(success).toBe(true);

            // Piece at (3, 3) must now be Sitke (General)
            const promoted = engine.board.getPieceAt(3, 3);
            expect(promoted).toBeInstanceOf(Sitke);
            expect(promoted?.color).toBe('red');
        });

        it('should NOT immediately promote when General is alive', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

            // Red has an active General at (5, 7)
            engine.board.setPiece(new Sitke('s_r', 'red', { x: 5, y: 7 }), 5, 7);
            expect(engine.hasActiveGeneral('red')).toBe(true);

            // Red pawn at (3, 4) moving to (3, 3)
            const pawn = new Ne('pawn_r', 'red', { x: 3, y: 4 });
            engine.board.setPiece(pawn, 3, 4);

            const success = engine.executeMove({ x: 3, y: 4 }, { x: 3, y: 3 });
            expect(success).toBe(true);

            // Piece at (3, 3) must remain a Ne (pawn)
            const unpromoted = engine.board.getPieceAt(3, 3);
            expect(unpromoted).toBeInstanceOf(Ne);
        });

        it('should allow deferred promotion in place (Option A) once General is captured', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

            // Pawn already on promotion diagonal at (3, 3)
            const pawn = new Ne('pawn_r', 'red', { x: 3, y: 3 });
            engine.board.setPiece(pawn, 3, 3);

            // Case 1: General is still alive -> deferred promotion NOT available
            engine.board.setPiece(new Sitke('s_r', 'red', { x: 5, y: 7 }), 5, 7);
            expect(engine.canPromoteDeferred({ x: 3, y: 3 })).toBe(false);

            // Case 2: General is captured (removed from board)
            engine.board.removePieceAt(5, 7);
            expect(engine.hasActiveGeneral('red')).toBe(false);
            expect(engine.canPromoteDeferred({ x: 3, y: 3 })).toBe(true);

            // Execute deferred promotion in-place
            const promoted = engine.promotePawnInPlace({ x: 3, y: 3 });
            expect(promoted).toBe(true);

            // Square (3, 3) is now a Sitke
            const sitke = engine.board.getPieceAt(3, 3);
            expect(sitke).toBeInstanceOf(Sitke);
            expect(sitke?.color).toBe('red');

            // Turn has advanced to black
            expect(engine.currentTurn).toBe('black');
            expect(engine.history[engine.history.length - 1].san).toBe('d5=Sitke');
        });
    });

    describe('Draw Conditions & Lone King Counting', () => {
        it('should declare draw by stalemate when king has no moves and is not in check', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Black King in corner (0, 0)
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 0, y: 0 }), 0, 0);
            // Red pieces confining Black King without checking it
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 2, y: 0 }), 2, 0);
            engine.board.setPiece(new Yahhta('r1_r', 'red', { x: 7, y: 1 }), 7, 1);
            engine.board.setPiece(new Yahhta('r2_r', 'red', { x: 1, y: 7 }), 1, 7);

            engine.currentTurn = 'black';
            engine.updateGameState();

            expect(engine.isKingInCheck('black')).toBe(false);
            expect(engine.state).toBe('draw');
        });

        it('should declare draw by 50-move rule (100 plies without pawn move or capture)', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

            // Simulate 100 plies of king shuffling
            for (let i = 0; i < 50; i++) {
                engine.executeMove({ x: 0, y: 7 }, { x: 1, y: 7 });
                engine.executeMove({ x: 7, y: 0 }, { x: 6, y: 0 });
                engine.executeMove({ x: 1, y: 7 }, { x: 0, y: 7 });
                engine.executeMove({ x: 6, y: 0 }, { x: 7, y: 0 });
            }

            expect(engine.state).toBe('draw');
        });

        it('should trigger counting rule with 16 moves limit against opponent with Rook', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Black is lone King, Red has King and Rook (no pawns)
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Yahhta('r_r', 'red', { x: 3, y: 7 }), 3, 7);

            engine.updateGameState();
            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.loneKingColor).toBe('black');
            expect(status.targetMoves).toBe(16);
            expect(status.remainingMoves).toBe(16);
        });

        it('should trigger counting rule with 44 moves limit against opponent with Elephant (no Rook)', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Black is lone King, Red has King and 2 Elephants
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Sin('e1_r', 'red', { x: 2, y: 7 }), 2, 7);
            engine.board.setPiece(new Sin('e2_r', 'red', { x: 5, y: 7 }), 5, 7);

            engine.updateGameState();
            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.targetMoves).toBe(44);
        });

        it('should trigger counting rule with 64 moves limit against opponent with Knight (no Rook, no Elephant)', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Black is lone King, Red has King and 2 Knights
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Myin('n1_r', 'red', { x: 1, y: 7 }), 1, 7);
            engine.board.setPiece(new Myin('n2_r', 'red', { x: 6, y: 7 }), 6, 7);

            engine.updateGameState();
            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.targetMoves).toBe(64);
        });

        it('should trigger counting rule immediately upon capturing last non-king piece even if attacker has pawns', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Red has King, Rook, and 2 Pawns (Ne)
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Yahhta('r_r', 'red', { x: 4, y: 7 }), 4, 7);
            engine.board.setPiece(new Ne('p1_r', 'red', { x: 2, y: 4 }), 2, 4);
            engine.board.setPiece(new Ne('p2_r', 'red', { x: 3, y: 4 }), 3, 4);

            // Black has King and a Rook at (5, 7)
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 1, y: 1 }), 1, 1);
            engine.board.setPiece(new Yahhta('r_b', 'black', { x: 5, y: 7 }), 5, 7);

            engine.currentTurn = 'red';
            engine.updateGameState();

            // Before capture: Black is NOT lone King, counting should NOT be active
            expect(engine.getCountingStatus().isActive).toBe(false);

            // Red Rook captures Black Rook at (5, 7)
            engine.executeMove({ x: 4, y: 7 }, { x: 5, y: 7 });

            // After capture: Black has only King. Attacker has Rook + Pawns -> 16 moves count starts!
            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.loneKingColor).toBe('black');
            expect(status.targetMoves).toBe(16);
            expect(status.remainingMoves).toBe(16);
            expect(engine.state).toBe('playing');
        });

        it('should count down and declare draw when lone king survives required number of moves', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.board.clear();

            // Red has King, Rook, Pawn
            engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new Yahhta('r_r', 'red', { x: 7, y: 7 }), 7, 7);
            engine.board.setPiece(new Ne('p_r', 'red', { x: 0, y: 5 }), 0, 5);

            // Black has lone King at (3, 3)
            engine.board.setPiece(new Mingyi('k_b', 'black', { x: 3, y: 3 }), 3, 3);

            engine.currentTurn = 'black';
            engine.updateGameState();

            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.targetMoves).toBe(16);
            expect(status.remainingMoves).toBe(16);

            // Black King moves on a 3-cycle: (3,3) -> (4,3) -> (4,4) -> (3,3)
            const blackCycle = [
                { from: { x: 3, y: 3 }, to: { x: 4, y: 3 } },
                { from: { x: 4, y: 3 }, to: { x: 4, y: 4 } },
                { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } }
            ];

            // Red King moves on a 4-cycle: (0,7) -> (1,7) -> (1,6) -> (0,6) -> (0,7)
            const redCycle = [
                { from: { x: 0, y: 7 }, to: { x: 1, y: 7 } },
                { from: { x: 1, y: 7 }, to: { x: 1, y: 6 } },
                { from: { x: 1, y: 6 }, to: { x: 0, y: 6 } },
                { from: { x: 0, y: 6 }, to: { x: 0, y: 7 } }
            ];

            // 16 full turns (Black King moves, then Red King moves)
            for (let i = 0; i < 15; i++) {
                const bMove = blackCycle[i % 3];
                const rMove = redCycle[i % 4];
                engine.executeMove(bMove.from, bMove.to);
                engine.executeMove(rMove.from, rMove.to);
                expect(engine.getCountingStatus().remainingMoves).toBe(15 - i);
                expect(engine.state).toBe('playing');
            }

            // Move 16 (last move that reaches 0 remaining moves)
            const bLast = blackCycle[15 % 3];
            const rLast = redCycle[15 % 4];
            engine.executeMove(bLast.from, bLast.to);
            engine.executeMove(rLast.from, rLast.to);

            expect(engine.getCountingStatus().remainingMoves).toBe(0);
            expect(engine.state).toBe('draw');
        });

        it('should correctly restore counting state using restoreCountingState', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.restoreCountingState({
                halfMoveClock: 12,
                totalPlies: 40,
                countingActive: true,
                loneKingColor: 'black',
                countingTargetMoves: 16,
                countingStartPly: 24
            });

            const status = engine.getCountingStatus();
            expect(status.isActive).toBe(true);
            expect(status.loneKingColor).toBe('black');
            expect(status.targetMoves).toBe(16);
            // 40 - 24 = 16 plies = 8 moves elapsed -> 16 - 8 = 8 moves remaining
            expect(status.elapsedMoves).toBe(8);
            expect(status.remainingMoves).toBe(8);

            const options = engine.getVariantOptions();
            expect(options.countingActive).toBe(true);
            expect(options.loneKingColor).toBe('black');
            expect(options.countingTargetMoves).toBe(16);
            expect(options.countingStartPly).toBe(24);
        });
    });

    describe('Sit-tee (Troop Deployment Phase)', () => {
        it('should correctly initialize deployment mode with only pawns on the board', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            expect(engine.isDeploying()).toBe(true);
            expect(engine.deployStage).toBe('red');
            expect(engine.currentTurn).toBe('red');
            expect(engine.isRedHiddenInDeployment).toBe(false);
            expect(engine.isBlackHiddenInDeployment).toBe(false);

            // Exactly 16 pawns (8 Red, 8 Black) and 0 major pieces
            let pawnCount = 0;
            let majorCount = 0;
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const piece = engine.board.getPieceAt(x, y);
                    if (piece) {
                        if (piece.name === 'Ne') {
                            pawnCount++;
                        } else {
                            majorCount++;
                        }
                    }
                }
            }
            expect(pawnCount).toBe(16);
            expect(majorCount).toBe(0);

            // Pools have all 8 pieces for both sides
            expect(engine.deployPool.red.length).toBe(8);
            expect(engine.deployPool.black.length).toBe(8);

            // Cannot make normal moves during deployment
            const a3Pawn = engine.board.getPieceAt(0, 5)!;
            expect(engine.getLegalMoves(a3Pawn)).toEqual([]);
            expect(engine.executeMove({ x: 0, y: 5 }, { x: 0, y: 4 })).toBe(false);
        });

        it('should enforce historical placement rules and Yahhta first-rank restriction', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            // Yahhta (Chariot): Strictly on the back rank (y=7 for Red, y=0 for Black)
            expect(engine.canDeployPiece('red', 'Yahhta', { x: 0, y: 7 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Yahhta', { x: 7, y: 7 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Yahhta', { x: 0, y: 6 })).toBe(false); // Not back rank!
            expect(engine.canDeployPiece('red', 'Yahhta', { x: 3, y: 6 })).toBe(false);

            // Red major pieces (behind pawns)
            // Files 0..3 (pawns at y=5): rows 6 and 7 (y in [6, 7])
            expect(engine.canDeployPiece('red', 'Mingyi', { x: 1, y: 6 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Mingyi', { x: 1, y: 7 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Mingyi', { x: 1, y: 5 })).toBe(false); // Pawn square
            expect(engine.canDeployPiece('red', 'Mingyi', { x: 1, y: 4 })).toBe(false); // Ahead of pawns

            // Files 4..7 (pawns at y=4): rows 5, 6, and 7 (y in [5, 7])
            expect(engine.canDeployPiece('red', 'Sitke', { x: 4, y: 5 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Sitke', { x: 5, y: 6 })).toBe(true);
            expect(engine.canDeployPiece('red', 'Sitke', { x: 4, y: 4 })).toBe(false); // Pawn square
            expect(engine.canDeployPiece('red', 'Sitke', { x: 4, y: 3 })).toBe(false); // Ahead of pawns

            // Cannot place on enemy side
            expect(engine.canDeployPiece('red', 'Sin', { x: 2, y: 1 })).toBe(false);
        });

        it('should deploy and remove pieces, properly updating the reserve pool', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            expect(engine.deployPool.red.filter(p => p === 'Mingyi').length).toBe(1);

            // Deploy Mingyi
            const deployed = engine.deployPiece('red', 'Mingyi', { x: 3, y: 7 });
            expect(deployed).toBe(true);
            expect(engine.board.getPieceAt(3, 7)?.name).toBe('Mingyi');
            expect(engine.deployPool.red.filter(p => p === 'Mingyi').length).toBe(0);

            // Cannot deploy Mingyi again (none left in pool)
            expect(engine.canDeployPiece('red', 'Mingyi', { x: 4, y: 7 })).toBe(false);

            // Cannot deploy onto occupied square
            expect(engine.canDeployPiece('red', 'Sitke', { x: 3, y: 7 })).toBe(false);

            // Remove deployed Mingyi
            const removed = engine.removeDeployedPiece({ x: 3, y: 7 });
            expect(removed).toBe(true);
            expect(engine.board.getPieceAt(3, 7)).toBeNull();
            expect(engine.deployPool.red.filter(p => p === 'Mingyi').length).toBe(1);

            // Cannot remove pawns
            const pawnPos = { x: 0, y: 5 };
            expect(engine.removeDeployedPiece(pawnPos)).toBe(false);
            expect(engine.board.getPieceAt(0, 5)?.name).toBe('Ne');
        });

        it('should apply deployment presets and reset pieces properly', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            // Apply Tournament preset
            engine.applyDeployPreset('red', 'tournament');
            expect(engine.deployPool.red.length).toBe(0);
            expect(engine.board.getPieceAt(0, 7)?.name).toBe('Yahhta');
            expect(engine.board.getPieceAt(3, 7)?.name).toBe('Mingyi');
            expect(engine.board.getPieceAt(4, 7)?.name).toBe('Sitke');
            expect(engine.board.getPieceAt(7, 7)?.name).toBe('Yahhta');

            // Reset deployment
            engine.resetPlayerDeployment('red');
            expect(engine.deployPool.red.length).toBe(8);
            expect(engine.board.getPieceAt(0, 7)).toBeNull();
            expect(engine.board.getPieceAt(3, 7)).toBeNull();

            // Apply Offensive Flank preset
            engine.applyDeployPreset('red', 'offensive_flank');
            expect(engine.deployPool.red.length).toBe(0);
            expect(engine.board.getPieceAt(2, 6)?.name).toBe('Sin');
            expect(engine.board.getPieceAt(6, 6)?.name).toBe('Myin');
        });

        it('should execute full PvP deployment cycle with curtain fog-of-war', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            // Cannot confirm before placing all 8 pieces
            expect(engine.confirmDeployment('red')).toBe(false);

            // Red deploys all pieces
            engine.applyDeployPreset('red', 'tournament');
            expect(engine.confirmDeployment('red')).toBe(true);

            // In PvP, Red is now hidden behind curtain and stage is transition
            expect(engine.isRedHiddenInDeployment).toBe(true);
            expect(engine.deployStage).toBe('transition');

            // Verify piece hiding: Red major pieces hidden, pawns visible
            const redKing = engine.board.getPieceAt(3, 7)!;
            const redPawn = engine.board.getPieceAt(0, 5)!;
            expect(engine.isPieceHiddenInDeployment(redKing)).toBe(true);
            expect(engine.isPieceHiddenInDeployment(redPawn)).toBe(false);

            // Pass device to Black player
            engine.startBlackDeploymentInPvP();
            expect(engine.deployStage).toBe('black');
            expect(engine.isRedHiddenInDeployment).toBe(true);

            // Black deploys all pieces
            engine.applyDeployPreset('black', 'offensive_flank');
            expect(engine.confirmDeployment('black')).toBe(true);

            // Both armies revealed, deployment completed, Red starts official game
            expect(engine.isRedHiddenInDeployment).toBe(false);
            expect(engine.deployStage).toBe('completed');
            expect(engine.isDeploying()).toBe(false);
            expect(engine.currentTurn).toBe('red');
            expect(engine.state).toBe('playing');

            // Major pieces are no longer hidden
            expect(engine.isPieceHiddenInDeployment(redKing)).toBe(false);

            // Normal moves are now legal and executable
            const pieceToMove = engine.board.getPieceAt(1, 7)!; // Myin (Horse)
            const legalMoves = engine.getLegalMoves(pieceToMove);
            expect(legalMoves.length).toBeGreaterThan(0);
        });

        it('should support transparent PvAI deployment flow where AI deploys in secret', () => {
            const engine = new SittuyinEngine(new Sittuyin());
            engine.startDeployment();

            // AI deploys Black secretly
            engine.applyDeployPreset('black', 'tournament');
            engine.isBlackHiddenInDeployment = true;
            engine.deployStage = 'red';

            // Verify AI pieces are hidden from human
            const blackKing = engine.board.getPieceAt(3, 0)!;
            const blackPawn = engine.board.getPieceAt(0, 3)!;
            expect(engine.isPieceHiddenInDeployment(blackKing)).toBe(true);
            expect(engine.isPieceHiddenInDeployment(blackPawn)).toBe(false);

            // Human deploys Red and confirms
            engine.applyDeployPreset('red', 'fortress');
            const confirmed = engine.confirmDeployment('red', true); // isPvAi = true
            expect(confirmed).toBe(true);

            // Game starts immediately with all pieces visible
            expect(engine.deployStage).toBe('completed');
            expect(engine.isBlackHiddenInDeployment).toBe(false);
            expect(engine.isPieceHiddenInDeployment(blackKing)).toBe(false);
            expect(engine.currentTurn).toBe('red');
        });

        it('should handle entire deployment flow via GameStore in PvP', () => {
            const store = useGameStore.getState();
            store.initGame('sittuyin', 'pvp', 'red', 'medium', false, { deploy: true });

            const engine = useGameStore.getState().engine as SittuyinEngine;
            expect(engine.isDeploying()).toBe(true);
            expect(engine.deployStage).toBe('red');

            // Select piece from tray
            store.selectSittuyinDeployPiece('Mingyi');
            expect(useGameStore.getState().sittuyinSelectedPiece).toBe('Mingyi');

            // Click valid square (3, 7)
            store.selectSquare({ x: 3, y: 7 });
            expect(engine.board.getPieceAt(3, 7)?.name).toBe('Mingyi');
            // Since Mingyi was only 1 in pool, pool count is 0 so selection clears
            expect(useGameStore.getState().sittuyinSelectedPiece).toBeNull();

            // Click on Mingyi at (3, 7) -> removes it and re-selects it
            store.selectSquare({ x: 3, y: 7 });
            expect(engine.board.getPieceAt(3, 7)).toBeNull();
            expect(useGameStore.getState().sittuyinSelectedPiece).toBe('Mingyi');

            // Quick auto-deploy for Red
            store.autoDeploySittuyin('tournament');
            expect(engine.deployPool.red.length).toBe(0);

            // Confirm Red deployment
            store.confirmSittuyinDeploy();
            expect(engine.deployStage).toBe('transition');
            expect(engine.isRedHiddenInDeployment).toBe(true);

            // Start Black deployment
            store.startBlackSittuyinDeploy();
            expect(engine.deployStage).toBe('black');
            expect(engine.isRedHiddenInDeployment).toBe(true);

            // Black auto-deploys
            store.autoDeploySittuyin('offensive_flank');
            expect(engine.deployPool.black.length).toBe(0);

            // Confirm Black deployment
            store.confirmSittuyinDeploy();
            expect(engine.deployStage).toBe('completed');
            expect(engine.isDeploying()).toBe(false);
            expect(engine.isRedHiddenInDeployment).toBe(false);
            expect(engine.currentTurn).toBe('red');
        });

        it('should handle entire deployment flow via GameStore in PvAI (Human Red vs AI Black)', () => {
            const store = useGameStore.getState();
            store.initGame('sittuyin', 'vs_ai', 'red', 'medium', false, { deploy: true });

            const engine = useGameStore.getState().engine as SittuyinEngine;
            expect(engine.isDeploying()).toBe(true);
            expect(engine.deployStage).toBe('red');
            // AI Black has already deployed behind the scenes
            expect(engine.deployPool.black.length).toBe(0);
            expect(engine.isBlackHiddenInDeployment).toBe(true);

            // Human deploys Red
            store.autoDeploySittuyin('fortress');
            store.confirmSittuyinDeploy();

            // Match begins
            expect(engine.isDeploying()).toBe(false);
            expect(engine.deployStage).toBe('completed');
            expect(engine.isBlackHiddenInDeployment).toBe(false);
            expect(engine.currentTurn).toBe('red');
        });

        describe('Tactical Presets and AI Strategic Selection', () => {
            const presetNames = [
                'tournament',
                'offensive_flank',
                'fortress',
                'left_wing_assault',
                'double_chariot_center',
                'cavalry_vanguard'
            ] as const;

            it('should have exactly 6 valid tactical presets for both red and black', () => {
                const redPresets = getSittuyinPresets('red');
                const blackPresets = getSittuyinPresets('black');

                expect(redPresets.map(p => p.id).sort()).toEqual([...presetNames].sort());
                expect(blackPresets.map(p => p.id).sort()).toEqual([...presetNames].sort());
            });

            it('should verify all 6 presets for both colors contain 8 unique and legally valid positions', () => {
                for (const color of ['red', 'black'] as const) {
                    const presets = getSittuyinPresets(color);

                    for (const preset of presets) {
                        expect(preset).toBeDefined();
                        expect(preset.pieces.length).toBe(8);

                        // Check piece distribution matches initial pool
                        const pieceNames = preset.pieces.map(p => p.name).sort();
                        expect(pieceNames).toEqual([...SITTUYIN_INITIAL_POOL].sort());

                        // Check position uniqueness
                        const posKeys = new Set(preset.pieces.map(p => `${p.pos.x},${p.pos.y}`));
                        expect(posKeys.size).toBe(8);

                        // Check legality of each piece on its square
                        const engine = new SittuyinEngine(new Sittuyin());
                        engine.startDeployment();
                        for (const placement of preset.pieces) {
                            const isValid = isSquareValidForSittuyinDeploy(color, placement.name, placement.pos, engine.board);
                            expect(isValid).toBe(true);
                        }
                    }
                }
            });

            it('should select AI presets according to difficulty tiers', () => {
                const easyPool = ['tournament', 'fortress'];
                const mediumPool = ['tournament', 'offensive_flank', 'fortress', 'cavalry_vanguard', 'left_wing_assault'];
                const hardPool = ['offensive_flank', 'left_wing_assault', 'cavalry_vanguard', 'double_chariot_center'];

                // Test 50 iterations per difficulty to check variety and adherence
                const easyChosen = new Set<string>();
                const mediumChosen = new Set<string>();
                const hardChosen = new Set<string>();

                for (let i = 0; i < 50; i++) {
                    const easyPreset = getAiSittuyinPreset('black', 'easy');
                    expect(easyPool).toContain(easyPreset.id);
                    easyChosen.add(easyPreset.id);

                    const medPreset = getAiSittuyinPreset('black', 'medium');
                    expect(mediumPool).toContain(medPreset.id);
                    mediumChosen.add(medPreset.id);

                    const hardPreset = getAiSittuyinPreset('black', 'hard');
                    expect(hardPool).toContain(hardPreset.id);
                    hardChosen.add(hardPreset.id);
                }

                // Verify variety across samples
                expect(easyChosen.size).toBeGreaterThan(1);
                expect(mediumChosen.size).toBeGreaterThan(1);
                expect(hardChosen.size).toBeGreaterThan(1);
            });

            it('should initialize PvAI game where AI selects preset according to difficulty', () => {
                const store = useGameStore.getState();

                // Hard difficulty
                store.initGame('sittuyin', 'vs_ai', 'red', 'hard', false, { deploy: true });
                const engine = useGameStore.getState().engine as SittuyinEngine;

                expect(engine.isDeploying()).toBe(true);
                expect(engine.deployPool.black.length).toBe(0);

                // Check that AI placed 8 pieces on the board
                let blackPiecesCount = 0;
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const piece = engine.board.getPieceAt(x, y);
                        if (piece && piece.color === 'black' && piece.name !== 'Ne') {
                            blackPiecesCount++;
                        }
                    }
                }
                expect(blackPiecesCount).toBe(8);
            });

            it('should execute full Sit-tee deployment, make moves, save/load, and undo moves properly', () => {
                const store = useGameStore.getState();
                store.initGame('sittuyin', 'pvp', 'red', 'medium', false, { deploy: true });

                // Red auto deploys tournament formation
                store.autoDeploySittuyin('tournament');
                store.confirmSittuyinDeploy();

                // Pass device to Black
                store.startBlackSittuyinDeploy();
                store.autoDeploySittuyin('cavalry_vanguard');
                store.confirmSittuyinDeploy();

                const engine = useGameStore.getState().engine as SittuyinEngine;
                expect(engine.isDeploying()).toBe(false);
                expect(engine.currentTurn).toBe('red');

                // Move Red Myin (Horse) at (1, 7) -> (2, 5) or similar legal square
                const piece = engine.board.getPieceAt(1, 7)!;
                const legalMoves = engine.getLegalMoves(piece);
                expect(legalMoves.length).toBeGreaterThan(0);
                const targetSquare = legalMoves[0];

                store.selectSquare({ x: 1, y: 7 });
                store.selectSquare(targetSquare);

                expect(useGameStore.getState().history.length).toBe(1);
                expect(useGameStore.getState().currentTurn).toBe('black');
                expect(engine.board.getPieceAt(1, 7)).toBeNull();
                expect(engine.board.getPieceAt(targetSquare.x, targetSquare.y)?.name).toBe('Myin');

                // Save game
                const savedData = store.saveGame();
                expect(savedData).toBeDefined();

                // Clear current game by loading classic
                store.initGame('classic', 'pvp', 'white', 'medium', false);
                expect(useGameStore.getState().currentVariantId).toBe('classic');

                // Reload saved game
                const loaded = store.loadGame(savedData!);
                expect(loaded).toBe(true);

                const reloadedEngine = useGameStore.getState().engine as SittuyinEngine;
                expect(reloadedEngine.currentTurn).toBe('black');
                expect(reloadedEngine.isDeploying()).toBe(false);
                expect(reloadedEngine.board.getPieceAt(targetSquare.x, targetSquare.y)?.name).toBe('Myin');
                expect(useGameStore.getState().history.length).toBe(1);

                // Undo move
                store.undoMove();
                const afterUndoEngine = useGameStore.getState().engine as SittuyinEngine;
                expect(afterUndoEngine.currentTurn).toBe('red');
                expect(afterUndoEngine.board.getPieceAt(1, 7)?.name).toBe('Myin');
                expect(afterUndoEngine.board.getPieceAt(targetSquare.x, targetSquare.y)).toBeNull();
                expect(useGameStore.getState().history.length).toBe(0);
            });
        });

        describe('Fairy-Stockfish FEN Serialization and AI Integration', () => {
            it('should generate exact Fairy-Stockfish Sittuyin FEN for Tournament deployment setup', () => {
                const engine = new SittuyinEngine(new Sittuyin());
                engine.startDeployment();
                engine.applyDeployPreset('red', 'tournament');
                engine.confirmDeployment('red');
                engine.startBlackDeploymentInPvP();
                engine.applyDeployPreset('black', 'tournament');
                engine.confirmDeployment('black');

                expect(engine.isDeploying()).toBe(false);
                expect(engine.currentTurn).toBe('red');

                // Expected FEN for Tournament vs Tournament
                const expectedFen = 'rnskfsnr/8/4pppp/pppp4/4PPPP/PPPP4/8/RNSKFSNR[] w - - 0 1';
                expect(engine.getFen()).toBe(expectedFen);
            });

            it('should update FEN accurately after moves, turn rotation, and clock changes', () => {
                const engine = new SittuyinEngine(new Sittuyin());
                engine.startDeployment();
                engine.applyDeployPreset('red', 'tournament');
                engine.confirmDeployment('red');
                engine.startBlackDeploymentInPvP();
                engine.applyDeployPreset('black', 'tournament');
                engine.confirmDeployment('black');

                // Move 1: Red pawn at a3 (0, 5) -> a4 (0, 4)
                const moveSuccess = engine.executeMove({ x: 0, y: 5 }, { x: 0, y: 4 });
                expect(moveSuccess).toBe(true);
                expect(engine.currentTurn).toBe('black');

                // Rank 4 (y=4): P (from a3) + empty 3 + PPPP -> P3PPPP
                // Rank 3 (y=5): empty 1 + PPP + empty 4 -> 1PPP4
                const fenAfterMove1 = engine.getFen();
                expect(fenAfterMove1).toBe('rnskfsnr/8/4pppp/pppp4/P3PPPP/1PPP4/8/RNSKFSNR[] b - - 0 1');
            });

            it('should reflect deferred in-place promotion to Sitke (F) in getFen()', () => {
                const engine = new SittuyinEngine(new Sittuyin());
                engine.board.clear();

                // Kings
                engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
                engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);

                // Red pawn at (3, 2) which is d6 (on promotion diagonal in enemy half)
                const pawn = new Ne('pawn_r', 'red', { x: 3, y: 2 });
                engine.board.setPiece(pawn, 3, 2);

                engine.currentTurn = 'red';
                engine.updateGameState();

                expect(engine.canPromoteDeferred({ x: 3, y: 2 })).toBe(true);

                // Promote in-place
                const promoted = engine.promotePawnInPlace({ x: 3, y: 2 });
                expect(promoted).toBe(true);
                expect(engine.board.getPieceAt(3, 2)?.name).toBe('Sitke');

                // In FEN: row y=2 (rank 6) should have 'F' at file 3 (d6): 3F4
                const fen = engine.getFen();
                expect(fen).toContain('3F4');
                expect(fen).toBe('7k/8/3F4/8/8/8/8/K7[] b - - 0 1');
            });

            it('should invoke Fairy-Stockfish calculateMove with dynamic FEN and empty moves array in vs_ai mode', async () => {
                const store = useGameStore.getState();

                // Mock electronAPI on globalThis.window
                const calculateMoveMock = vi.fn().mockResolvedValue('a5a4');
                const setVariantMock = vi.fn().mockResolvedValue(true);
                (globalThis as any).window = {
                    electronAPI: {
                        engine: {
                            setVariant: setVariantMock,
                            calculateMove: calculateMoveMock
                        }
                    }
                };

                // Human Red vs AI Black
                store.initGame('sittuyin', 'vs_ai', 'red', 'medium', false, { deploy: true });
                store.autoDeploySittuyin('tournament');
                store.confirmSittuyinDeploy();

                const engine = useGameStore.getState().engine as SittuyinEngine;
                expect(engine.isDeploying()).toBe(false);
                expect(engine.currentTurn).toBe('red');

                // Human Red moves pawn at a3 (0, 5) -> a4 (0, 4)
                store.selectSquare({ x: 0, y: 5 });
                store.selectSquare({ x: 0, y: 4 });

                expect(useGameStore.getState().currentTurn).toBe('black');

                // Trigger AI calculation
                await store.triggerAiMove();

                // Verify Fairy-Stockfish was invoked with dynamic FEN and moves = []
                expect(setVariantMock).toHaveBeenCalledWith('sittuyin');
                expect(calculateMoveMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        fen: expect.stringContaining('[] b - - 0 1'),
                        moves: []
                    })
                );

                // Verify AI executed bestmove a5a4 (black pawn moved from a5 (0, 3) to a4 (0, 4) capturing or moving)
                expect(useGameStore.getState().currentTurn).toBe('red');

                // Cleanup mock
                delete (globalThis as any).window;
            });

            it('should handle in-place promotion move (d6d6f) from Fairy-Stockfish', async () => {
                const store = useGameStore.getState();

                const calculateMoveMock = vi.fn().mockResolvedValue('d6d6f');
                const setVariantMock = vi.fn().mockResolvedValue(true);
                (globalThis as any).window = {
                    electronAPI: {
                        engine: {
                            setVariant: setVariantMock,
                            calculateMove: calculateMoveMock
                        }
                    }
                };

                // Setup custom scenario where AI (Black) can promote Ne in-place on d3 (3, 5):
                // In UCI, d6 is (3, 2), d3 is (3, 5). If Fairy returns 'd6d6f' for Red or Black
                store.initGame('sittuyin', 'vs_ai', 'black', 'medium', false, { deploy: true });

                // Red (AI) can promote in place at d6 (3, 2)
                const engine = useGameStore.getState().engine as SittuyinEngine;
                engine.board.clear();
                engine.board.setPiece(new Mingyi('k_r', 'red', { x: 0, y: 7 }), 0, 7);
                engine.board.setPiece(new Mingyi('k_b', 'black', { x: 7, y: 0 }), 7, 0);
                engine.board.setPiece(new Ne('p_r', 'red', { x: 3, y: 2 }), 3, 2); // d6 pawn
                engine.deployStage = 'completed';
                engine.currentTurn = 'red';
                engine.updateGameState();

                expect(engine.canPromoteDeferred({ x: 3, y: 2 })).toBe(true);

                // Trigger AI move for Red
                await store.triggerAiMove();

                // Check that Red pawn at (3, 2) promoted to Sitke!
                expect(useGameStore.getState().engine.board.getPieceAt(3, 2)?.name).toBe('Sitke');
                expect(useGameStore.getState().currentTurn).toBe('black');

                // Cleanup mock
                delete (globalThis as any).window;
            });
        });
    });
});
