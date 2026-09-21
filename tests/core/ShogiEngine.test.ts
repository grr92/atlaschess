import { describe, it, expect } from 'vitest';
import { ShogiEngine } from '../../src/core/engine/ShogiEngine';
import { Shogi } from '../../src/core/variants/Shogi';
import {
    ShogiKing,
    ShogiPawn,
    ShogiRook,
    ShogiBishop,
    ShogiGold,
    ShogiSilver,
    ShogiKnight,
    ShogiLance,
    ShogiDragon,
    ShogiHorse,
    ShogiTokin,
} from '../../src/core/pieces/piecesIndex';
import { createShogiPiece } from '../../src/core/variants/shogi/shogiSetup';
import { getPieceImage } from '../../src/utils/pieceMapper';

describe('ShogiEngine', () => {
    describe('Board Setup & Piece Initialization', () => {
        it('should correctly initialize a 9x9 board with 40 pieces and empty hands', () => {
            const engine = new ShogiEngine(new Shogi());
            expect(engine.board.cols).toBe(9);
            expect(engine.board.rows).toBe(9);
            expect(engine.currentTurn).toBe('white');
            expect(engine.inHand.white).toEqual([]);
            expect(engine.inHand.black).toEqual([]);

            // Verify Kings
            const whiteKing = engine.board.getPieceAt(4, 8);
            expect(whiteKing).toBeInstanceOf(ShogiKing);
            expect(whiteKing?.color).toBe('white');

            const blackKing = engine.board.getPieceAt(4, 0);
            expect(blackKing).toBeInstanceOf(ShogiKing);
            expect(blackKing?.color).toBe('black');

            // Verify White Rooks and Bishops
            expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(ShogiRook);
            expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(ShogiBishop);

            // Verify Black Rooks and Bishops
            expect(engine.board.getPieceAt(1, 1)).toBeInstanceOf(ShogiRook);
            expect(engine.board.getPieceAt(7, 1)).toBeInstanceOf(ShogiBishop);

            // Verify Pawns (row 6 for white, row 2 for black)
            for (let x = 0; x < 9; x++) {
                expect(engine.board.getPieceAt(x, 6)).toBeInstanceOf(ShogiPawn);
                expect(engine.board.getPieceAt(x, 2)).toBeInstanceOf(ShogiPawn);
            }
        });

        it('should serialize standard initial FEN matching Fairy-Stockfish UCI specification', () => {
            const engine = new ShogiEngine(new Shogi());
            expect(engine.getFen()).toBe('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL[] w - - 0 1');
        });
    });

    describe('Piece Movements & Special Properties', () => {
        it('should allow pawn to move only one square straight forward', () => {
            const engine = new ShogiEngine(new Shogi());
            const pawn = engine.board.getPieceAt(6, 6); // 7g pawn
            expect(pawn).toBeDefined();

            const moves = engine.getLegalMoves(pawn!);
            expect(moves).toHaveLength(1);
            expect(moves[0]).toEqual({ x: 6, y: 5 }); // 7f
        });

        it('should allow knight to jump forward in an L-shape over pieces', () => {
            const engine = new ShogiEngine(new Shogi());
            // Clear board and place knight
            engine.board.clear();
            const knight = createShogiPiece('ShogiKnight', 'white', { x: 4, y: 5 });
            engine.board.setPiece(knight, 4, 5);
            // Place friendly and enemy pieces in front to test jumping
            engine.board.setPiece(createShogiPiece('ShogiPawn', 'white', { x: 4, y: 4 }), 4, 4);

            const moves = knight.getPossibleMoves(engine.board);
            // Knight at (4,5) jumps forward-left (3,3) and forward-right (5,3)
            expect(moves).toContainEqual({ x: 3, y: 3 });
            expect(moves).toContainEqual({ x: 5, y: 3 });
            expect(moves).toHaveLength(2);
        });

        it('should allow lance to slide forward along its file until blocked', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            const lance = createShogiPiece('ShogiLance', 'white', { x: 0, y: 7 });
            engine.board.setPiece(lance, 0, 7);
            engine.board.setPiece(createShogiPiece('ShogiPawn', 'black', { x: 0, y: 3 }), 0, 3);

            const moves = lance.getPossibleMoves(engine.board);
            // Can move to y = 6, 5, 4, and capture at 3
            expect(moves).toContainEqual({ x: 0, y: 6 });
            expect(moves).toContainEqual({ x: 0, y: 5 });
            expect(moves).toContainEqual({ x: 0, y: 4 });
            expect(moves).toContainEqual({ x: 0, y: 3 });
            expect(moves).toHaveLength(4);
        });

        it('should allow silver general to move 5 directions (4 diagonals + forward)', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            const silver = createShogiPiece('ShogiSilver', 'white', { x: 4, y: 4 });
            engine.board.setPiece(silver, 4, 4);

            const moves = silver.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(5);
            expect(moves).toContainEqual({ x: 4, y: 3 }); // Forward
            expect(moves).toContainEqual({ x: 3, y: 3 }); // Forward-left
            expect(moves).toContainEqual({ x: 5, y: 3 }); // Forward-right
            expect(moves).toContainEqual({ x: 3, y: 5 }); // Backward-left
            expect(moves).toContainEqual({ x: 5, y: 5 }); // Backward-right
        });

        it('should allow gold general to move 6 directions (4 orthogonal + 2 forward diagonal)', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            const gold = createShogiPiece('ShogiGold', 'white', { x: 4, y: 4 });
            engine.board.setPiece(gold, 4, 4);

            const moves = gold.getPossibleMoves(engine.board);
            expect(moves).toHaveLength(6);
            expect(moves).toContainEqual({ x: 4, y: 3 }); // Up
            expect(moves).toContainEqual({ x: 4, y: 5 }); // Down
            expect(moves).toContainEqual({ x: 3, y: 4 }); // Left
            expect(moves).toContainEqual({ x: 5, y: 4 }); // Right
            expect(moves).toContainEqual({ x: 3, y: 3 }); // Up-left
            expect(moves).toContainEqual({ x: 5, y: 3 }); // Up-right
        });

        it('should allow Dragon (promoted rook) to move as rook + 1 step diagonal', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            const dragon = createShogiPiece('ShogiDragon', 'white', { x: 4, y: 4 });
            engine.board.setPiece(dragon, 4, 4);

            const moves = dragon.getPossibleMoves(engine.board);
            // 8 orthogonal moves in each direction on 9x9 (4 up, 4 down, 4 left, 4 right = 16) + 4 diagonals (1 step each) = 20
            expect(moves).toHaveLength(20);
            expect(moves).toContainEqual({ x: 3, y: 3 });
            expect(moves).toContainEqual({ x: 5, y: 3 });
            expect(moves).toContainEqual({ x: 3, y: 5 });
            expect(moves).toContainEqual({ x: 5, y: 5 });
        });

        it('should allow Horse (promoted bishop) to move as bishop + 1 step orthogonal', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            const horse = createShogiPiece('ShogiHorse', 'white', { x: 4, y: 4 });
            engine.board.setPiece(horse, 4, 4);

            const moves = horse.getPossibleMoves(engine.board);
            // 4 diagonal directions on center of 9x9 = 4 * 4 = 16 moves + 4 orthogonal 1-step moves = 20
            expect(moves).toHaveLength(20);
            expect(moves).toContainEqual({ x: 4, y: 3 });
            expect(moves).toContainEqual({ x: 4, y: 5 });
            expect(moves).toContainEqual({ x: 3, y: 4 });
            expect(moves).toContainEqual({ x: 5, y: 4 });
        });
    });

    describe('Promotions & Interception', () => {
        it('should intercept optional promotions with availablePieces [promoted, original]', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            // Silver moving into promotion zone (y <= 2 for white)
            const silver = createShogiPiece('ShogiSilver', 'white', { x: 4, y: 3 });
            engine.board.setPiece(silver, 4, 3);

            const interception = engine.getPreMoveInterception({ x: 4, y: 3 }, { x: 4, y: 2 });
            expect(interception).toBeDefined();
            expect(interception?.type).toBe('PROMOTION');
            expect(interception?.availablePieces).toEqual(['ShogiPromotedSilver', 'ShogiSilver']);
        });

        it('should enforce mandatory promotion for Pawn and Lance on last rank', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            const pawn = createShogiPiece('ShogiPawn', 'white', { x: 2, y: 1 });
            engine.board.setPiece(pawn, 2, 1);

            // Moving to y = 0 must NOT return interception modal because promotion is mandatory
            const interception = engine.getPreMoveInterception({ x: 2, y: 1 }, { x: 2, y: 0 });
            expect(interception).toBeNull();

            // Executing move automatically promotes
            engine.executeMove({ x: 2, y: 1 }, { x: 2, y: 0 });
            const pieceAtDest = engine.board.getPieceAt(2, 0);
            expect(pieceAtDest).toBeInstanceOf(ShogiTokin);
        });

        it('should enforce mandatory promotion for Knight on ranks 8 and 9', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            const knight = createShogiPiece('ShogiKnight', 'white', { x: 2, y: 2 });
            engine.board.setPiece(knight, 2, 2);

            // Jumps to y = 0 (rank 9) -> mandatory promotion
            const interception = engine.getPreMoveInterception({ x: 2, y: 2 }, { x: 1, y: 0 });
            expect(interception).toBeNull();

            engine.executeMove({ x: 2, y: 2 }, { x: 1, y: 0 });
            const pieceAtDest = engine.board.getPieceAt(1, 0);
            expect(pieceAtDest?.name).toBe('ShogiPromotedKnight');
        });

        it('should execute move without promotion when original piece is chosen in optional modal', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            const silver = createShogiPiece('ShogiSilver', 'white', { x: 4, y: 3 });
            engine.board.setPiece(silver, 4, 3);

            // Choose 'ShogiSilver' (decline promotion)
            const success = engine.executeMove({ x: 4, y: 3 }, { x: 4, y: 2 }, 'ShogiSilver');
            expect(success).toBe(true);

            const pieceAtDest = engine.board.getPieceAt(4, 2);
            expect(pieceAtDest).toBeInstanceOf(ShogiSilver);
        });
    });

    describe('Captures & Drop Mechanics', () => {
        it('should demote captured promoted piece and add base piece to player hand', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            // White Rook captures Black Dragon
            const whiteRook = createShogiPiece('ShogiRook', 'white', { x: 0, y: 5 });
            const blackDragon = createShogiPiece('ShogiDragon', 'black', { x: 0, y: 1 });
            engine.board.setPiece(whiteRook, 0, 5);
            engine.board.setPiece(blackDragon, 0, 1);

            engine.executeMove({ x: 0, y: 5 }, { x: 0, y: 1 });

            // White hand should have unpromoted ShogiRook
            expect(engine.inHand.white).toContain('ShogiRook');
            expect(engine.inHand.white).not.toContain('ShogiDragon');
        });

        it('should drop piece from hand to empty square and decrement hand count', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            engine.inHand.white.push('ShogiGold');

            const targets = engine.getLegalDrops('ShogiGold', 'white');
            expect(targets.length).toBe(9 * 9 - 2); // 81 - 2 kings

            const dropSuccess = engine.dropPiece('ShogiGold', { x: 4, y: 5 });
            expect(dropSuccess).toBe(true);
            expect(engine.inHand.white).not.toContain('ShogiGold');

            const droppedPiece = engine.board.getPieceAt(4, 5);
            expect(droppedPiece).toBeInstanceOf(ShogiGold);
            expect(droppedPiece?.color).toBe('white');
            expect(engine.currentTurn).toBe('black');
        });

        it('should forbid dead-end drops for Pawn, Lance, and Knight', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            engine.inHand.white.push('ShogiPawn', 'ShogiLance', 'ShogiKnight');

            // White Pawn/Lance cannot be dropped on rank 9 (y = 0)
            const pawnDrops = engine.getLegalDrops('ShogiPawn', 'white');
            expect(pawnDrops.some(p => p.y === 0)).toBe(false);

            const lanceDrops = engine.getLegalDrops('ShogiLance', 'white');
            expect(lanceDrops.some(p => p.y === 0)).toBe(false);

            // White Knight cannot be dropped on rank 9 or 8 (y = 0 or y = 1)
            const knightDrops = engine.getLegalDrops('ShogiKnight', 'white');
            expect(knightDrops.some(p => p.y === 0 || p.y === 1)).toBe(false);
        });

        it('should enforce Nifu (two pawns rule): cannot drop pawn on file with friendly unpromoted pawn', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            // Place White Pawn at file x = 3
            engine.board.setPiece(createShogiPiece('ShogiPawn', 'white', { x: 3, y: 5 }), 3, 5);
            // Place White Tokin at file x = 5 (promoted pawn does NOT block drops on its file)
            engine.board.setPiece(createShogiPiece('ShogiTokin', 'white', { x: 5, y: 5 }), 5, 5);

            engine.inHand.white.push('ShogiPawn');
            const pawnDrops = engine.getLegalDrops('ShogiPawn', 'white');

            // File 3 is forbidden due to Nifu
            expect(pawnDrops.some(p => p.x === 3)).toBe(false);

            // File 5 is allowed because Tokin is promoted
            expect(pawnDrops.some(p => p.x === 5)).toBe(true);
        });

        it('should enforce Uchifuzume (drop pawn mate rule): pawn drop delivering instant checkmate is illegal', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();

            // Setup a position where dropping a pawn in front of Black King would be checkmate
            // Black King trapped in corner at (0, 0)
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 0, y: 0 }), 0, 0);
            // White Silver at (1, 2) defends (0, 1) and covers (1, 1)
            engine.board.setPiece(createShogiPiece('ShogiSilver', 'white', { x: 1, y: 2 }), 1, 2);
            // White Knight at (2, 2) covers (1, 0)
            engine.board.setPiece(createShogiPiece('ShogiKnight', 'white', { x: 2, y: 2 }), 2, 2);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);

            engine.inHand.white.push('ShogiPawn');

            // (0, 1) is in front of King, defended by Gold.
            // If pawn is dropped at (0, 1), Black King cannot take it (defended by Gold), cannot move to (1, 0) or (1, 1) (controlled by Gold).
            // This is checkmate, so dropping pawn at (0, 1) MUST be forbidden by Uchifuzume!
            const pawnDrops = engine.getLegalDrops('ShogiPawn', 'white');
            expect(pawnDrops.some(p => p.x === 0 && p.y === 1)).toBe(false);

            // But dropping another piece (e.g. Gold) to deliver mate is completely legal!
            engine.inHand.white.push('ShogiGold');
            const goldDrops = engine.getLegalDrops('ShogiGold', 'white');
            expect(goldDrops.some(p => p.x === 0 && p.y === 1)).toBe(true);
        });

        it('should prevent pawn drops that would win by leaving opponent with 0 moves (stalemate / ahogado)', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();

            // Black King is boxed in with 0 moves
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 0, y: 0 }), 0, 0);
            engine.board.setPiece(createShogiPiece('ShogiDragon', 'white', { x: 1, y: 2 }), 1, 2);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);

            engine.inHand.white = ['ShogiPawn', 'ShogiGold'];
            engine.inHand.black = [];
            engine.currentTurn = 'white';

            // Black King is not in check, but has 0 moves
            expect(engine.isKingInCheck('black')).toBe(false);

            // Pawn drop cannot be made because it would deliver immediate stalemate win
            const pawnDrops = engine.getLegalDrops('ShogiPawn', 'white');
            expect(pawnDrops.length).toBe(0);

            // Gold drop CAN still be made
            const goldDrops = engine.getLegalDrops('ShogiGold', 'white');
            expect(goldDrops.length).toBeGreaterThan(0);
        });
    });

    describe('Undo Mechanics', () => {
        it('should correctly undo regular moves, captures, and drops', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 8 }), 4, 8);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 0 }), 4, 0);

            // White Rook captures Black Pawn
            engine.board.setPiece(createShogiPiece('ShogiRook', 'white', { x: 2, y: 5 }), 2, 5);
            engine.board.setPiece(createShogiPiece('ShogiPawn', 'black', { x: 2, y: 2 }), 2, 2);

            // 1. Capture move with promotion to Dragon
            engine.executeMove({ x: 2, y: 5 }, { x: 2, y: 2 }, 'ShogiDragon');
            expect(engine.board.getPieceAt(2, 2)).toBeInstanceOf(ShogiDragon);
            expect(engine.inHand.white).toContain('ShogiPawn');

            // 2. Undo move
            const undoSuccess = engine.undoMove();
            expect(undoSuccess).toBe(true);
            expect(engine.currentTurn).toBe('white');
            expect(engine.board.getPieceAt(2, 5)).toBeInstanceOf(ShogiRook);
            expect(engine.board.getPieceAt(2, 2)).toBeInstanceOf(ShogiPawn);
            expect(engine.inHand.white).not.toContain('ShogiPawn');

            // 3. Drop move and undo
            engine.inHand.white.push('ShogiGold');
            engine.dropPiece('ShogiGold', { x: 5, y: 5 });
            expect(engine.board.getPieceAt(5, 5)).toBeInstanceOf(ShogiGold);
            expect(engine.inHand.white).not.toContain('ShogiGold');

            engine.undoMove();
            expect(engine.board.getPieceAt(5, 5)).toBeNull();
            expect(engine.inHand.white).toContain('ShogiGold');
            expect(engine.currentTurn).toBe('white');
        });
    });

    describe('Piece Asset Resolution (Traditional and International)', () => {
        const pieceNames = [
            'ShogiKing',
            'ShogiRook',
            'ShogiBishop',
            'ShogiGold',
            'ShogiSilver',
            'ShogiKnight',
            'ShogiLance',
            'ShogiPawn',
            'ShogiDragon',
            'ShogiHorse',
            'ShogiPromotedSilver',
            'ShogiPromotedKnight',
            'ShogiPromotedLance',
            'ShogiTokin'
        ];

        it('should resolve valid SVG images for all pieces in both Traditional and International styles for both players', () => {
            for (const name of pieceNames) {
                for (const color of ['white', 'black'] as const) {
                    const piece = createShogiPiece(name, color, { x: 0, y: 0 });

                    // Traditional
                    const traditionalImg = getPieceImage(piece, 'text');
                    expect(traditionalImg, `Missing traditional SVG for ${name} (${color})`).toBeTruthy();

                    // International
                    const internationalImg = getPieceImage(piece, 'icon');
                    expect(internationalImg, `Missing international SVG for ${name} (${color})`).toBeTruthy();
                }
            }
        });
    });

    describe('Sennichite (Fourfold Repetition) and Oute Sennichite (Perpetual Check)', () => {
        it('should declare a draw when the same position occurs 4 times without perpetual check', () => {
            const engine = new ShogiEngine(new Shogi());

            // Sequence of non-checking moves between Rooks:
            // White Rook at (7, 7), Black Rook at (1, 1)
            // Cycle:
            // 1. W (7,7)->(6,7), B (1,1)->(2,1)
            // 2. W (6,7)->(7,7), B (2,1)->(1,1) (Occurrence 2 of initial pos)
            // 3. W (7,7)->(6,7), B (1,1)->(2,1)
            // 4. W (6,7)->(7,7), B (2,1)->(1,1) (Occurrence 3 of initial pos)
            // 5. W (7,7)->(6,7), B (1,1)->(2,1)
            // 6. W (6,7)->(7,7), B (2,1)->(1,1) (Occurrence 4 of initial pos -> Draw!)

            for (let cycle = 0; cycle < 3; cycle++) {
                expect(engine.executeMove({ x: 7, y: 7 }, { x: 6, y: 7 })).toBe(true);
                expect(engine.executeMove({ x: 1, y: 1 }, { x: 2, y: 1 })).toBe(true);
                expect(engine.executeMove({ x: 6, y: 7 }, { x: 7, y: 7 })).toBe(true);
                expect(engine.executeMove({ x: 2, y: 1 }, { x: 1, y: 1 })).toBe(true);
            }

            expect(engine.state).toBe('draw');
            expect(engine.endReason).toBe('sennichite');
            expect(engine.getCustomStatus()).toBe('Sennichite (千日手)');

            // Undoing the last move should exit the draw state
            expect(engine.undoMove()).toBe(true);
            expect(engine.state).not.toBe('draw');
            expect(engine.endReason).toBeNull();
        });

        it('should declare defeat for the checking player when repetition is caused by continuous checks (Oute Sennichite)', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();

            // Set up a custom position:
            // White King safely at (0, 8)
            // Black King at (4, 1)
            // White Rook at (4, 7)
            const whiteKing = createShogiPiece('ShogiKing', 'white', { x: 0, y: 8 });
            const blackKing = createShogiPiece('ShogiKing', 'black', { x: 4, y: 1 });
            const whiteRook = createShogiPiece('ShogiRook', 'white', { x: 4, y: 7 });

            engine.board.setPiece(whiteKing, 0, 8);
            engine.board.setPiece(blackKing, 4, 1);
            engine.board.setPiece(whiteRook, 4, 7);

            // Re-seed position signatures for this position
            engine.positionSignatures = [engine.getPositionSignature()];

            // White gives check every turn:
            // 1. W: Rook (4,7) -> (4,2)+ (checks King at 4,1)
            // 2. B: King (4,1) -> (3,1)
            // 3. W: Rook (4,2) -> (3,2)+ (checks King at 3,1)
            // 4. B: King (3,1) -> (4,1)
            // 5. W: Rook (3,2) -> (4,2)+ (checks King at 4,1) -> position after move 1 repeats!
            // Repeating this cycle will result in White giving check on EVERY White move.

            // First move to establish base cycle position:
            expect(engine.executeMove({ x: 4, y: 7 }, { x: 4, y: 2 })).toBe(true); // White checks
            expect(engine.isKingInCheck('black')).toBe(true);

            for (let cycle = 0; cycle < 3; cycle++) {
                expect(engine.executeMove({ x: 4, y: 1 }, { x: 3, y: 1 })).toBe(true); // Black king escapes
                expect(engine.executeMove({ x: 4, y: 2 }, { x: 3, y: 2 })).toBe(true); // White checks
                expect(engine.isKingInCheck('black')).toBe(true);

                expect(engine.executeMove({ x: 3, y: 1 }, { x: 4, y: 1 })).toBe(true); // Black king returns
                expect(engine.executeMove({ x: 3, y: 2 }, { x: 4, y: 2 })).toBe(true); // White checks (and repeats position)
                if (cycle < 2) {
                    expect(engine.isKingInCheck('black')).toBe(true);
                }
            }

            // On the 4th occurrence, White has checked on 100% of White's moves in the cycle.
            // White loses by Oute Sennichite!
            expect(engine.state).toBe('checkmate');
            expect(engine.endReason).toBe('oute_sennichite');
            expect(engine.currentTurn).toBe('white'); // Defeated player
            expect(engine.getCustomStatus()).toBe('Oute Sennichite (王手千日手)');
        });
    });

    describe('Jishogi (Impasse / 24-point rule)', () => {
        it('should correctly calculate Jishogi points according to official rules (Majors=5, Minors=1, King=0)', () => {
            const engine = new ShogiEngine(new Shogi());

            // Initial board has 27 points for White and 27 points for Black (total 54)
            const initialPoints = engine.calculateJishogiPoints();
            expect(initialPoints.white).toBe(27);
            expect(initialPoints.black).toBe(27);
            expect(initialPoints.whiteMajors).toBe(2); // 1 Rook + 1 Bishop
            expect(initialPoints.whiteMinors).toBe(17); // 2 Golds + 2 Silvers + 2 Knights + 2 Lances + 9 Pawns
            expect(initialPoints.blackMajors).toBe(2);
            expect(initialPoints.blackMinors).toBe(17);

            // Give White another Rook in hand and check calculation
            engine.inHand.white.push('ShogiRook');
            const updatedPoints = engine.calculateJishogiPoints();
            expect(updatedPoints.white).toBe(32);
            expect(updatedPoints.whiteMajors).toBe(3);
        });

        it('should identify when both kings have entered opponent promotion territory (Ai-nyuugyoku)', () => {
            const engine = new ShogiEngine(new Shogi());
            // Initially, White King at (4,8) and Black King at (4,0)
            expect(engine.canDeclareJishogi()).toBe(false);

            // Move White King into promotion zone (y <= 2) and Black King into promotion zone (y >= 6)
            engine.board.clear();
            const whiteKing = createShogiPiece('ShogiKing', 'white', { x: 4, y: 1 });
            const blackKing = createShogiPiece('ShogiKing', 'black', { x: 4, y: 7 });
            engine.board.setPiece(whiteKing, 4, 1);
            engine.board.setPiece(blackKing, 4, 7);

            expect(engine.canDeclareJishogi()).toBe(true);
        });

        it('should declare a draw when both players have at least 24 points under Jishogi', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();

            // White King at (4, 1), Black King at (4, 7)
            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 1 }), 4, 1);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 7 }), 4, 7);

            // White has 2 Rooks (10) + 14 Pawns (14) = 24 points
            engine.inHand.white = ['ShogiRook', 'ShogiRook', ...Array(14).fill('ShogiPawn')];

            // Black has 2 Bishops (10) + 14 Pawns (14) = 24 points
            engine.inHand.black = ['ShogiBishop', 'ShogiBishop', ...Array(14).fill('ShogiPawn')];

            expect(engine.canDeclareJishogi()).toBe(true);

            const result = engine.declareJishogi();
            expect(result.result).toBe('draw');
            expect(result.whitePoints).toBe(24);
            expect(result.blackPoints).toBe(24);
            expect(engine.state).toBe('draw');
            expect(engine.endReason).toBe('jishogi_draw');
            expect(engine.getCustomStatus()).toBe('Jishogi (持将棋)');
        });

        it('should declare victory for the player with >= 24 points if the opponent has < 24 points', () => {
            const engine = new ShogiEngine(new Shogi());
            engine.board.clear();

            engine.board.setPiece(createShogiPiece('ShogiKing', 'white', { x: 4, y: 1 }), 4, 1);
            engine.board.setPiece(createShogiPiece('ShogiKing', 'black', { x: 4, y: 7 }), 4, 7);

            // White has 2 Rooks (10) + 2 Bishops (10) + 6 Pawns (6) = 26 points
            engine.inHand.white = ['ShogiRook', 'ShogiRook', 'ShogiBishop', 'ShogiBishop', ...Array(6).fill('ShogiPawn')];

            // Black has only 10 Pawns = 10 points (< 24)
            engine.inHand.black = [...Array(10).fill('ShogiPawn')];

            expect(engine.canDeclareJishogi()).toBe(true);

            const result = engine.declareJishogi();
            expect(result.result).toBe('white_win');
            expect(result.whitePoints).toBe(26);
            expect(result.blackPoints).toBe(10);
            expect(engine.state).toBe('checkmate');
            expect(engine.currentTurn).toBe('black'); // Black is defeated
            expect(engine.endReason).toBe('jishogi_win');
            expect(engine.getCustomStatus()).toBe('Jishogi (持将棋)');
        });
    });
});
