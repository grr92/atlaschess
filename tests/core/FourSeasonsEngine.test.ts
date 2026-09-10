import { describe, it, expect } from 'vitest';
import { FourSeasonsEngine } from '../../src/core/engine/FourSeasonsEngine';
import { FourSeasonsChess } from '../../src/core/variants/FourSeasonsChess';
import {
    FourSeasonsKing,
    FourSeasonsGeneral,
    FourSeasonsRook,
    FourSeasonsKnight,
    FourSeasonsBishop,
    FourSeasonsPawn
} from '../../src/core/pieces/piecesIndex';
import { isPieceAllowedByDice, hasLegalMovesForDiceRoll } from '../../src/utils/diceMapper';
import { FourSeasonsEvaluationStrategy } from '../../src/core/ai/strategies/FourSeasonsEvaluationStrategy';

describe('FourSeasonsChess Engine and Pieces', () => {
    it('should initialize 4 armies with 8 pieces each on an 8x8 board', () => {
        const engine = new FourSeasonsEngine(new FourSeasonsChess());
        expect(engine.currentTurn).toBe('green');
        expect(engine.state).toBe('playing');

        const allPieces = engine.board.getAllPieces();
        expect(allPieces.length).toBe(32);

        for (const color of ['green', 'red', 'black', 'white'] as const) {
            const playerPieces = allPieces.filter(p => p.color === color);
            expect(playerPieces.length).toBe(8);

            expect(playerPieces.filter(p => p instanceof FourSeasonsKing).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof FourSeasonsRook).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof FourSeasonsKnight).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof FourSeasonsBishop).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof FourSeasonsPawn).length).toBe(4);
        }

        // Verify starting quadrant positions per image
        // Red (Top-Left): a8 (King), b8 (Knight), c8 (Pawn East), a7 (Rook), b7 (Bishop), c7 (Pawn East), a6 (Pawn South), b6 (Pawn South)
        expect(engine.board.getPieceAt(0, 0)).toBeInstanceOf(FourSeasonsKing); // a8
        expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(FourSeasonsKnight); // b8
        expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(FourSeasonsPawn); // c8
        expect(engine.board.getPieceAt(0, 1)).toBeInstanceOf(FourSeasonsRook); // a7
        expect(engine.board.getPieceAt(1, 1)).toBeInstanceOf(FourSeasonsBishop); // b7
        expect(engine.board.getPieceAt(2, 1)).toBeInstanceOf(FourSeasonsPawn); // c7
        expect(engine.board.getPieceAt(0, 2)).toBeInstanceOf(FourSeasonsPawn); // a6
        expect(engine.board.getPieceAt(1, 2)).toBeInstanceOf(FourSeasonsPawn); // b6

        // Green (Top-Right): f8 (Pawn West), g8 (Knight), h8 (King), f7 (Pawn West), g7 (Bishop), h7 (Rook), g6 (Pawn South), h6 (Pawn South)
        expect(engine.board.getPieceAt(5, 0)).toBeInstanceOf(FourSeasonsPawn); // f8
        expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(FourSeasonsKnight); // g8
        expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(FourSeasonsKing); // h8
        expect(engine.board.getPieceAt(5, 1)).toBeInstanceOf(FourSeasonsPawn); // f7
        expect(engine.board.getPieceAt(6, 1)).toBeInstanceOf(FourSeasonsBishop); // g7
        expect(engine.board.getPieceAt(7, 1)).toBeInstanceOf(FourSeasonsRook); // h7
        expect(engine.board.getPieceAt(6, 2)).toBeInstanceOf(FourSeasonsPawn); // g6
        expect(engine.board.getPieceAt(7, 2)).toBeInstanceOf(FourSeasonsPawn); // h6

        // Black (Bottom-Left): a3 (Pawn North), b3 (Pawn North), a2 (Rook), b2 (Bishop), c2 (Pawn East), a1 (King), b1 (Knight), c1 (Pawn East)
        expect(engine.board.getPieceAt(0, 5)).toBeInstanceOf(FourSeasonsPawn); // a3
        expect(engine.board.getPieceAt(1, 5)).toBeInstanceOf(FourSeasonsPawn); // b3
        expect(engine.board.getPieceAt(0, 6)).toBeInstanceOf(FourSeasonsRook); // a2
        expect(engine.board.getPieceAt(1, 6)).toBeInstanceOf(FourSeasonsBishop); // b2
        expect(engine.board.getPieceAt(2, 6)).toBeInstanceOf(FourSeasonsPawn); // c2
        expect(engine.board.getPieceAt(0, 7)).toBeInstanceOf(FourSeasonsKing); // a1
        expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(FourSeasonsKnight); // b1
        expect(engine.board.getPieceAt(2, 7)).toBeInstanceOf(FourSeasonsPawn); // c1

        // White (Bottom-Right): g3 (Pawn North), h3 (Pawn North), f2 (Pawn West), g2 (Bishop), h2 (Rook), f1 (Pawn West), g1 (Knight), h1 (King)
        expect(engine.board.getPieceAt(6, 5)).toBeInstanceOf(FourSeasonsPawn); // g3
        expect(engine.board.getPieceAt(7, 5)).toBeInstanceOf(FourSeasonsPawn); // h3
        expect(engine.board.getPieceAt(5, 6)).toBeInstanceOf(FourSeasonsPawn); // f2
        expect(engine.board.getPieceAt(6, 6)).toBeInstanceOf(FourSeasonsBishop); // g2
        expect(engine.board.getPieceAt(7, 6)).toBeInstanceOf(FourSeasonsRook); // h2
        expect(engine.board.getPieceAt(5, 7)).toBeInstanceOf(FourSeasonsPawn); // f1
        expect(engine.board.getPieceAt(6, 7)).toBeInstanceOf(FourSeasonsKnight); // g1
        expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(FourSeasonsKing); // h1
    });

    it('should rotate turns counter-clockwise: green -> red -> black -> white -> green', () => {
        const engine = new FourSeasonsEngine(new FourSeasonsChess());
        expect(engine.currentTurn).toBe('green');

        // Green moves pawn at g6 (6, 2) south (+y) to (6, 3)
        expect(engine.executeMove({ x: 6, y: 2 }, { x: 6, y: 3 })).toBe(true);
        expect(engine.currentTurn).toBe('red');

        // Red moves pawn at b6 (1, 2) south (+y) to (1, 3)
        expect(engine.executeMove({ x: 1, y: 2 }, { x: 1, y: 3 })).toBe(true);
        expect(engine.currentTurn).toBe('black');

        // Black moves pawn at b3 (1, 5) north (-y) to (1, 4)
        expect(engine.executeMove({ x: 1, y: 5 }, { x: 1, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('white');

        // White moves pawn at g3 (6, 5) north (-y) to (6, 4)
        expect(engine.executeMove({ x: 6, y: 5 }, { x: 6, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('green');
    });

    describe('Piece Mechanics', () => {
        it('FourSeasonsBishop (Alfil) leaps 2 squares diagonally over pieces and cannot move 1 square', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            const bishop = engine.board.getPieceAt(6, 1); // Green Bishop at g7
            expect(bishop).toBeInstanceOf(FourSeasonsBishop);

            // From (6, 1), diagonal leap by 2: (4, 3) is on the board
            const moves = engine.getLegalMoves(bishop!);
            expect(moves.some(m => m.x === 4 && m.y === 3)).toBe(true);
            // Must NOT include 1-step diagonal like (5, 2)
            expect(moves.some(m => m.x === 5 && m.y === 2)).toBe(false);
        });

        it('FourSeasonsGeneral (Alferza) moves exactly 1 square diagonally', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            // Place a Green General at (5, 3)
            const general = new FourSeasonsGeneral('g_test', 'green', { x: 5, y: 3 });
            engine.board.setPiece(general, 5, 3);

            const moves = engine.getLegalMoves(general);
            // Diagonal 1-step moves: (4, 2), (6, 2), (4, 4), (6, 4)
            // (6, 2) has a green pawn initially, so only empty or enemy squares
            expect(moves.some(m => m.x === 4 && m.y === 2)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 4)).toBe(true);
            expect(moves.some(m => m.x === 6 && m.y === 4)).toBe(true);
            // Cannot move orthogonally (5, 4) or (5, 2)
            expect(moves.some(m => m.x === 5 && m.y === 4)).toBe(false);
            expect(moves.some(m => m.x === 5 && m.y === 2)).toBe(false);
        });

        it('FourSeasonsPawn captures diagonally and promotes to General upon reaching its boundary', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            // Clear destination (1, 7)
            engine.board.removePieceAt(1, 7);
            // Place Green pawn at (1, 6) heading south (dy: 1) to y=7
            const greenPawn = new FourSeasonsPawn('p_prom', 'green', { x: 1, y: 6 }, { dx: 0, dy: 1 });
            engine.board.setPiece(greenPawn, 1, 6);

            expect(engine.executeMove({ x: 1, y: 6 }, { x: 1, y: 7 })).toBe(true);

            // Should have auto-promoted to FourSeasonsGeneral
            const promoted = engine.board.getPieceAt(1, 7);
            expect(promoted).toBeInstanceOf(FourSeasonsGeneral);
            expect(promoted?.color).toBe('green');
        });
    });

    describe('Checkmate & Annexation', () => {
        it('should remove the checkmated King and annex the defeated army to the mating player', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            // Clear board
            engine.board.clear();

            // Green King at (0, 7)
            engine.board.setPiece(new FourSeasonsKing('k_g', 'green', { x: 0, y: 7 }), 0, 7);
            // Green General at (6, 2) protecting (7, 1) diagonally
            engine.board.setPiece(new FourSeasonsGeneral('g_g', 'green', { x: 6, y: 2 }), 6, 2);

            // Red King trapped at corner (7, 0) by Red's own pieces
            engine.board.setPiece(new FourSeasonsKing('k_r', 'red', { x: 7, y: 0 }), 7, 0);
            engine.board.setPiece(new FourSeasonsRook('r_r', 'red', { x: 6, y: 0 }), 6, 0);
            engine.board.setPiece(new FourSeasonsBishop('b_r', 'red', { x: 6, y: 1 }), 6, 1);

            // Black King at (3, 7)
            engine.board.setPiece(new FourSeasonsKing('k_b', 'black', { x: 3, y: 7 }), 3, 7);
            // White King at (0, 0)
            engine.board.setPiece(new FourSeasonsKing('k_w', 'white', { x: 0, y: 0 }), 0, 0);

            engine.currentTurn = 'green';

            // Green Rook at (7, 5) moves to (7, 1), giving checkmate along file 7 (protected by General at 6,2)!
            engine.board.setPiece(new FourSeasonsRook('r_g', 'green', { x: 7, y: 5 }), 7, 5);

            expect(engine.executeMove({ x: 7, y: 5 }, { x: 7, y: 1 })).toBe(true);

            // Red King is checkmated!
            // Red King should be removed
            expect(engine.board.getPieceAt(7, 0)).toBeNull();
            // Red pieces should now be annexed to Green
            expect(engine.annexedArmies['green']).toContain('red');

            // Turn advances immediately to black (since red has no king) without blocking modal
            expect(engine.currentTurn).toBe('black');
        });

        it('allows the annexing player to move pieces of annexed armies', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            // Annex red to green manually
            engine.annexedArmies['green'].push('red');
            engine.board.removePieceAt(0, 0); // remove Red King at a8

            engine.currentTurn = 'green';

            // Green can move red rook at a7 (0, 1) to (0, 4) if open
            // Clear path
            engine.board.removePieceAt(0, 2); // remove pawn

            const redRook = engine.board.getPieceAt(0, 1)!;
            const moves = engine.getLegalMoves(redRook);
            expect(moves.length).toBeGreaterThan(0);
            expect(engine.executeMove({ x: 0, y: 1 }, { x: 0, y: 3 })).toBe(true);
            expect(engine.currentTurn).toBe('black');
        });

        it('prevents friendly fire between annexing player and annexed armies', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            engine.board.clear();

            // Green King at (4, 4)
            const greenKing = new FourSeasonsKing('k_g', 'green', { x: 4, y: 4 });
            engine.board.setPiece(greenKing, 4, 4);

            // Green Rook at (4, 0)
            const greenRook = new FourSeasonsRook('r_g', 'green', { x: 4, y: 0 });
            engine.board.setPiece(greenRook, 4, 0);

            // Red Rook at (4, 2)
            const redRook = new FourSeasonsRook('r_r', 'red', { x: 4, y: 2 });
            engine.board.setPiece(redRook, 4, 2);

            // Black King at (0, 7), White King at (7, 7)
            engine.board.setPiece(new FourSeasonsKing('k_b', 'black', { x: 0, y: 7 }), 0, 7);
            engine.board.setPiece(new FourSeasonsKing('k_w', 'white', { x: 7, y: 7 }), 7, 7);

            // Before annexation: Red is enemy to Green. Green Rook can capture Red Rook at (4, 2)
            engine.currentTurn = 'green';
            let greenRookMoves = engine.getLegalMoves(greenRook);
            expect(greenRookMoves.some(m => m.x === 4 && m.y === 2)).toBe(true);

            // Now annex Red to Green
            engine.annexedArmies['green'].push('red');

            // After annexation:
            // 1. Green Rook cannot capture Red Rook at (4, 2)
            greenRookMoves = engine.getLegalMoves(greenRook);
            expect(greenRookMoves.some(m => m.x === 4 && m.y === 2)).toBe(false);

            // 2. Red Rook cannot capture Green King at (4, 4) or Green Rook at (4, 0)
            const redRookMoves = engine.getLegalMoves(redRook);
            expect(redRookMoves.some(m => m.x === 4 && m.y === 4)).toBe(false);
            expect(redRookMoves.some(m => m.x === 4 && m.y === 0)).toBe(false);

            // 3. Red Rook does NOT place Green King in check
            expect(engine.isKingInCheck('green')).toBe(false);
        });
    });

    describe('Stalemate Removal', () => {
        it('removes all pieces of a stalemated player', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            engine.board.clear();

            // Green King at (0, 0)
            engine.board.setPiece(new FourSeasonsKing('k_g', 'green', { x: 0, y: 0 }), 0, 0);

            // Red King at (7, 0) surrounded with immovable pawns
            engine.board.setPiece(new FourSeasonsKing('k_r', 'red', { x: 7, y: 0 }), 7, 0);
            engine.board.setPiece(new FourSeasonsPawn('p_r1', 'red', { x: 6, y: 0 }, { dx: 1, dy: 0 }), 6, 0); // blocked at x=7 by King
            engine.board.setPiece(new FourSeasonsPawn('p_r2', 'red', { x: 7, y: 1 }, { dx: 0, dy: 1 }), 7, 1);
            // Block (7, 1) with friendly pawn at (7, 2) heading dx: 1 (blocked at x=7 by board edge)
            engine.board.setPiece(new FourSeasonsPawn('p_r3', 'red', { x: 7, y: 2 }, { dx: 1, dy: 0 }), 7, 2);
            // Friendly pawn at (6, 1) heading dx: 1 blocked at (7, 1)
            engine.board.setPiece(new FourSeasonsPawn('p_r4', 'red', { x: 6, y: 1 }, { dx: 1, dy: 0 }), 6, 1);

            // Black King at (0, 7)
            engine.board.setPiece(new FourSeasonsKing('k_b', 'black', { x: 0, y: 7 }), 0, 7);
            // White King at (7, 7)
            engine.board.setPiece(new FourSeasonsKing('k_w', 'white', { x: 7, y: 7 }), 7, 7);

            // Check that Red has no legal moves
            const redMoves = engine.getAllLegalMovesForColor('red');
            expect(redMoves.length).toBe(0);

            // Turn starts on Green. When Green rotates turn, it moves to Red, discovers Red is stalemated, removes Red pieces, and lands on Black!
            engine.currentTurn = 'green';
            engine.rotateTurn();

            expect(engine.board.getPieceAt(7, 0)).toBeNull();
            expect(engine.board.getPieceAt(6, 0)).toBeNull();
            expect(engine.hasKingAlive('red')).toBe(false);
            expect(engine.currentTurn).toBe('black');
        });
    });

    describe('Dice Validation', () => {
        it('correctly maps D6 dice rolls to piece types', () => {
            expect(isPieceAllowedByDice('FourSeasonsPawn', 1, 'four_seasons')).toBe(true);
            expect(isPieceAllowedByDice('FourSeasonsBishop', 2, 'four_seasons')).toBe(true);
            expect(isPieceAllowedByDice('FourSeasonsKnight', 3, 'four_seasons')).toBe(true);
            expect(isPieceAllowedByDice('FourSeasonsRook', 4, 'four_seasons')).toBe(true);
            expect(isPieceAllowedByDice('FourSeasonsGeneral', 5, 'four_seasons')).toBe(true);
            expect(isPieceAllowedByDice('FourSeasonsKing', 6, 'four_seasons')).toBe(true);

            expect(isPieceAllowedByDice('FourSeasonsKing', 1, 'four_seasons')).toBe(false);
            expect(isPieceAllowedByDice('FourSeasonsRook', 2, 'four_seasons')).toBe(false);
        });

        it('detects if legal moves exist for a given dice roll', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            // Green has pawns that can move
            expect(hasLegalMovesForDiceRoll(engine, 1, 'four_seasons')).toBe(true);
            // Green has bishops (Alfil) that can leap
            expect(hasLegalMovesForDiceRoll(engine, 2, 'four_seasons')).toBe(true);
            // Green has knights that can leap
            expect(hasLegalMovesForDiceRoll(engine, 3, 'four_seasons')).toBe(true);
            // Green has rooks (blocked initially by pawns)
            expect(hasLegalMovesForDiceRoll(engine, 4, 'four_seasons')).toBe(false);
            // Green has no generals initially
            expect(hasLegalMovesForDiceRoll(engine, 5, 'four_seasons')).toBe(false);
        });
    });

    describe('Evaluation Strategy', () => {
        it('evaluates board positions and values material & annexed armies', () => {
            const engine = new FourSeasonsEngine(new FourSeasonsChess());
            const strategy = new FourSeasonsEvaluationStrategy();

            const initialScore = strategy.evaluate(engine, 'green');
            expect(typeof initialScore).toBe('number');

            // Annexing an army gives a huge positive evaluation
            engine.annexedArmies['green'].push('red');
            const scoreWithAnnexed = strategy.evaluate(engine, 'green');
            expect(scoreWithAnnexed).toBeGreaterThan(initialScore);
        });
    });
});
