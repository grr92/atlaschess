import { describe, it, expect } from 'vitest';
import { JanggiEngine } from '../../src/core/engine/JanggiEngine';
import { Janggi } from '../../src/core/variants/Janggi';
import {
    JanggiGeneral,
    JanggiGuard,
    JanggiElephant,
    JanggiHorse,
    JanggiChariot,
    JanggiCannon,
    JanggiSoldier
} from '../../src/core/pieces/piecesIndex';
import { getRandomJanggiSetup, type JanggiSetupType } from '../../src/core/variants/janggi/janggiSetup';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';

describe('JanggiEngine & Piece Mechanics', () => {
    // 1. Board initialization (piece counts, positions)
    describe('Board Initialization', () => {
        it('should initialize a 9x10 board with 32 pieces and blue starting at bottom (South)', () => {
            const engine = new JanggiEngine(new Janggi());
            expect(engine.board.cols).toBe(9);
            expect(engine.board.rows).toBe(10);
            expect(engine.currentTurn).toBe('blue');
            expect(engine.state).toBe('playing');

            const bluePieces = engine.board.getAllPieces().filter(p => p.color === 'blue');
            const redPieces = engine.board.getAllPieces().filter(p => p.color === 'red');
            expect(bluePieces.length).toBe(16);
            expect(redPieces.length).toBe(16);
            expect(engine.board.getAllPieces().length).toBe(32);
        });

        it('should place Generals, Guards, Cannons, and Chariots at standard Janggi coordinates (Blue bottom, Red top)', () => {
            const engine = new JanggiEngine(new Janggi());

            // Generals start at center of respective palaces (Red at top (4,1), Blue at bottom (4,8))
            expect(engine.board.getPieceAt(4, 1)).toBeInstanceOf(JanggiGeneral);
            expect(engine.board.getPieceAt(4, 1)?.color).toBe('red');
            expect(engine.board.getPieceAt(4, 8)).toBeInstanceOf(JanggiGeneral);
            expect(engine.board.getPieceAt(4, 8)?.color).toBe('blue');

            // Guards at back rank of palace (Red at row 0, Blue at row 9)
            expect(engine.board.getPieceAt(3, 0)).toBeInstanceOf(JanggiGuard);
            expect(engine.board.getPieceAt(3, 0)?.color).toBe('red');
            expect(engine.board.getPieceAt(5, 0)).toBeInstanceOf(JanggiGuard);
            expect(engine.board.getPieceAt(5, 0)?.color).toBe('red');
            expect(engine.board.getPieceAt(3, 9)).toBeInstanceOf(JanggiGuard);
            expect(engine.board.getPieceAt(3, 9)?.color).toBe('blue');
            expect(engine.board.getPieceAt(5, 9)).toBeInstanceOf(JanggiGuard);
            expect(engine.board.getPieceAt(5, 9)?.color).toBe('blue');

            // Chariots at the 4 corners
            expect(engine.board.getPieceAt(0, 0)).toBeInstanceOf(JanggiChariot);
            expect(engine.board.getPieceAt(0, 0)?.color).toBe('red');
            expect(engine.board.getPieceAt(8, 0)).toBeInstanceOf(JanggiChariot);
            expect(engine.board.getPieceAt(8, 0)?.color).toBe('red');
            expect(engine.board.getPieceAt(0, 9)).toBeInstanceOf(JanggiChariot);
            expect(engine.board.getPieceAt(0, 9)?.color).toBe('blue');
            expect(engine.board.getPieceAt(8, 9)).toBeInstanceOf(JanggiChariot);
            expect(engine.board.getPieceAt(8, 9)?.color).toBe('blue');

            // Cannons
            expect(engine.board.getPieceAt(1, 2)).toBeInstanceOf(JanggiCannon);
            expect(engine.board.getPieceAt(1, 2)?.color).toBe('red');
            expect(engine.board.getPieceAt(7, 2)).toBeInstanceOf(JanggiCannon);
            expect(engine.board.getPieceAt(7, 2)?.color).toBe('red');
            expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(JanggiCannon);
            expect(engine.board.getPieceAt(1, 7)?.color).toBe('blue');
            expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(JanggiCannon);
            expect(engine.board.getPieceAt(7, 7)?.color).toBe('blue');

            // 5 Soldiers per player (Red at row 3, Blue at row 6)
            [0, 2, 4, 6, 8].forEach(x => {
                expect(engine.board.getPieceAt(x, 3)).toBeInstanceOf(JanggiSoldier);
                expect(engine.board.getPieceAt(x, 3)?.color).toBe('red');
                expect(engine.board.getPieceAt(x, 6)).toBeInstanceOf(JanggiSoldier);
                expect(engine.board.getPieceAt(x, 6)?.color).toBe('blue');
            });
        });

        it('should rotate turns correctly between blue and red', () => {
            const engine = new JanggiEngine(new Janggi());
            expect(engine.currentTurn).toBe('blue');
            engine.rotateTurn();
            expect(engine.currentTurn).toBe('red');
            engine.rotateTurn();
            expect(engine.currentTurn).toBe('blue');
        });
    });

    // 2. General movement (palace orthogonal + diagonal)
    describe('JanggiGeneral — Palace Movement', () => {
        it('should move orthogonally and diagonally along marked palace lines, never leaving palace', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            // Blue General at bottom palace center (4, 8), Red General at top palace center (4, 1)
            // Add shield pieces at y=5 on files 3, 4, 5 so generals never face each other across an open file
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 8 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 4, y: 1 });

            engine.board.setPiece(blueGen, 4, 8);
            engine.board.setPiece(redGen, 4, 1);
            engine.board.setPiece(new JanggiSoldier('s3', 'blue', { x: 3, y: 5 }), 3, 5);
            engine.board.setPiece(new JanggiSoldier('s4', 'blue', { x: 4, y: 5 }), 4, 5);
            engine.board.setPiece(new JanggiSoldier('s5', 'blue', { x: 5, y: 5 }), 5, 5);

            // From center of blue palace (4, 8):
            // 4 orthogonal moves: (4, 7), (4, 9), (3, 8), (5, 8)
            // 4 diagonal moves to corners: (3, 7), (5, 7), (3, 9), (5, 9)
            const centerMoves = engine.getLegalMoves(blueGen);
            expect(centerMoves.length).toBe(8);
            expect(centerMoves.some(m => m.x === 4 && m.y === 7)).toBe(true);
            expect(centerMoves.some(m => m.x === 4 && m.y === 9)).toBe(true);
            expect(centerMoves.some(m => m.x === 3 && m.y === 8)).toBe(true);
            expect(centerMoves.some(m => m.x === 5 && m.y === 8)).toBe(true);
            expect(centerMoves.some(m => m.x === 3 && m.y === 7)).toBe(true);
            expect(centerMoves.some(m => m.x === 5 && m.y === 7)).toBe(true);
            expect(centerMoves.some(m => m.x === 3 && m.y === 9)).toBe(true);
            expect(centerMoves.some(m => m.x === 5 && m.y === 9)).toBe(true);

            // Move General to bottom-left corner (3, 9)
            engine.board.movePiece({ x: 4, y: 8 }, { x: 3, y: 9 });
            const cornerMoves = engine.getLegalMoves(blueGen);
            // From corner (3, 9): orthogonal (4, 9) and (3, 8), diagonal to center (4, 8).
            // Cannot step outside palace (e.g. (2, 9) or (3, 10))
            expect(cornerMoves.length).toBe(3);
            expect(cornerMoves.some(m => m.x === 4 && m.y === 9)).toBe(true);
            expect(cornerMoves.some(m => m.x === 3 && m.y === 8)).toBe(true);
            expect(cornerMoves.some(m => m.x === 4 && m.y === 8)).toBe(true);
            expect(cornerMoves.some(m => m.x === 2 && m.y === 9)).toBe(false);

            // Move General to edge (4, 9) - not a corner, not center
            engine.board.movePiece({ x: 3, y: 9 }, { x: 4, y: 9 });
            const edgeMoves = engine.getLegalMoves(blueGen);
            // From (4, 9): only orthogonal steps inside palace (3, 9), (5, 9), (4, 8)
            // No diagonal lines connect (4, 9)
            expect(edgeMoves.length).toBe(3);
            expect(edgeMoves.some(m => m.x === 3 && m.y === 9)).toBe(true);
            expect(edgeMoves.some(m => m.x === 5 && m.y === 9)).toBe(true);
            expect(edgeMoves.some(m => m.x === 4 && m.y === 8)).toBe(true);
        });
    });

    // 3. Guard movement (same as General)
    describe('JanggiGuard — Movement Identical to General', () => {
        it('should move identically to the General within palace', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 3, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 1 });
            const blueGuard = new JanggiGuard('bguard', 'blue', { x: 4, y: 8 });

            engine.board.setPiece(blueGen, 3, 9);
            engine.board.setPiece(redGen, 5, 1);
            engine.board.setPiece(blueGuard, 4, 8);

            // From center (4, 8): can reach all 4 orthogonal and 3 free corners (excluding (3, 9) occupied by friendly general)
            const moves = engine.getLegalMoves(blueGuard);
            expect(moves.length).toBe(7);
            expect(moves.some(m => m.x === 4 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 9)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 8)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 8)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 9)).toBe(true);
            // Cannot take friendly General at (3, 9)
            expect(moves.some(m => m.x === 3 && m.y === 9)).toBe(false);
        });
    });

    // 4. Chariot movement (orthogonal slides + palace diagonal)
    describe('JanggiChariot — Orthogonal Slides & Palace Diagonals', () => {
        it('should slide any distance orthogonally and slide diagonally across the palace', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 3, y: 8 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 1 });
            // Place Blue Chariot at bottom-left corner of blue palace (3, 9)
            const chariot = new JanggiChariot('bc', 'blue', { x: 3, y: 9 });

            engine.board.setPiece(blueGen, 3, 8);
            engine.board.setPiece(redGen, 5, 1);
            engine.board.setPiece(chariot, 3, 9);

            const moves = engine.getLegalMoves(chariot);

            // Orthogonal:
            // Along rank 9 to the left: (2, 9), (1, 9), (0, 9)
            // Along rank 9 to the right: (4, 9), (5, 9), (6, 9), (7, 9), (8, 9)
            // Blocked upwards by blueGen at (3, 8)
            expect(moves.some(m => m.x === 0 && m.y === 9)).toBe(true);
            expect(moves.some(m => m.x === 8 && m.y === 9)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 8)).toBe(false);

            // Palace diagonal:
            // From corner (3, 9) through center (4, 8) to opposite corner (5, 7)
            expect(moves.some(m => m.x === 4 && m.y === 8)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 7)).toBe(true);

            // Now place chariot at palace center (4, 8)
            engine.board.removePieceAt(3, 9);
            engine.board.removePieceAt(3, 8);
            engine.board.setPiece(blueGen, 3, 9);
            engine.board.setPiece(chariot, 4, 8);

            const centerChariotMoves = engine.getLegalMoves(chariot);
            // Diagonal moves from center to all 4 corners (except (3,9) occupied by friendly)
            expect(centerChariotMoves.some(m => m.x === 3 && m.y === 7)).toBe(true);
            expect(centerChariotMoves.some(m => m.x === 5 && m.y === 7)).toBe(true);
            expect(centerChariotMoves.some(m => m.x === 5 && m.y === 9)).toBe(true);
            expect(centerChariotMoves.some(m => m.x === 3 && m.y === 9)).toBe(false);
        });
    });

    // 5. Cannon movement (mandatory jump for move/capture, palace diagonals, screen rules)
    describe('JanggiCannon — Mandatory Jump & Screen Rules', () => {
        it('should require 1 screen to move and capture, forbid cannon screens/captures, and jump palace diagonals', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 0 });
            const cannon = new JanggiCannon('bca', 'blue', { x: 0, y: 5 });

            // Screen (Horse) at (0, 3) and enemy Soldier at (0, 1)
            const screen = new JanggiHorse('bh', 'blue', { x: 0, y: 3 });
            const enemyTarget = new JanggiSoldier('rs', 'red', { x: 0, y: 1 });

            engine.board.setPiece(blueGen, 4, 9);
            engine.board.setPiece(redGen, 5, 0);
            engine.board.setPiece(cannon, 0, 5);
            engine.board.setPiece(screen, 0, 3);
            engine.board.setPiece(enemyTarget, 0, 1);

            const moves = engine.getLegalMoves(cannon);

            // 1) CANNOT slide through empty squares before the screen:
            expect(moves.some(m => m.x === 0 && m.y === 4)).toBe(false);
            expect(moves.some(m => m.x === 1 && m.y === 5)).toBe(false);

            // 2) Cannot land on the screen (0, 3)
            expect(moves.some(m => m.x === 0 && m.y === 3)).toBe(false);

            // 3) CAN move to empty squares after the screen (0, 2)
            expect(moves.some(m => m.x === 0 && m.y === 2)).toBe(true);

            // 4) Captures enemy target through exactly 1 screen at (0, 1)
            expect(moves.some(m => m.x === 0 && m.y === 1)).toBe(true);

            // 5) Cannot capture another Cannon
            const enemyCannon = new JanggiCannon('rca', 'red', { x: 0, y: 1 });
            engine.board.setPiece(enemyCannon, 0, 1);
            const movesVsCannon = engine.getLegalMoves(cannon);
            expect(movesVsCannon.some(m => m.x === 0 && m.y === 1)).toBe(false);

            // 6) Cannot use another Cannon as screen
            const cannonScreen = new JanggiCannon('bca2', 'blue', { x: 0, y: 3 });
            engine.board.setPiece(cannonScreen, 0, 3);
            engine.board.setPiece(enemyTarget, 0, 1);
            const movesWithCannonScreen = engine.getLegalMoves(cannon);
            expect(movesWithCannonScreen.some(m => m.x === 0 && m.y === 1)).toBe(false);
            expect(movesWithCannonScreen.some(m => m.x === 0 && m.y === 2)).toBe(false);
        });

        it('should jump diagonally in either palace from corner over center screen to opposite corner', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 3, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 0 });

            // Bottom palace (rows 7-9, cols 3-5, center 4,8)
            // Place Blue Cannon at corner (3, 7)
            const cannon = new JanggiCannon('bca', 'blue', { x: 3, y: 7 });
            // Screen Guard at center (4, 8)
            const guardScreen = new JanggiGuard('bg1', 'blue', { x: 4, y: 8 });
            // Enemy Soldier at opposite corner (5, 9)
            const enemySoldier = new JanggiSoldier('rs', 'red', { x: 5, y: 9 });

            engine.board.setPiece(blueGen, 3, 9);
            engine.board.setPiece(redGen, 5, 0);
            engine.board.setPiece(cannon, 3, 7);
            engine.board.setPiece(guardScreen, 4, 8);
            engine.board.setPiece(enemySoldier, 5, 9);

            const moves = engine.getLegalMoves(cannon);
            // Can jump over guardScreen at (4,8) to capture enemySoldier at (5,9)
            expect(moves.some(m => m.x === 5 && m.y === 9)).toBe(true);

            // If center is empty, cannot jump diagonally
            engine.board.removePieceAt(4, 8);
            const movesNoScreen = engine.getLegalMoves(cannon);
            expect(movesNoScreen.some(m => m.x === 5 && m.y === 9)).toBe(false);

            // If center piece is another Cannon, cannot jump
            const cannonCenter = new JanggiCannon('bca2', 'blue', { x: 4, y: 8 });
            engine.board.setPiece(cannonCenter, 4, 8);
            const movesCannonCenter = engine.getLegalMoves(cannon);
            expect(movesCannonCenter.some(m => m.x === 5 && m.y === 9)).toBe(false);
        });
    });

    // 6. Elephant movement (3-step bent path, blockers)
    describe('JanggiElephant — 3-step Bent Path & Blockers', () => {
        it('should move 1 orthogonal + 2 diagonal outward and be blocked at either step', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 0 });
            // Elephant at center (4, 4)
            const elephant = new JanggiElephant('be', 'blue', { x: 4, y: 4 });

            engine.board.setPiece(blueGen, 4, 9);
            engine.board.setPiece(redGen, 5, 0);
            engine.board.setPiece(elephant, 4, 4);

            // Open position: 8 directions available
            // Upward destinations: (2, 1) and (6, 1)
            // Downward destinations: (2, 7) and (6, 7)
            // Leftward destinations: (1, 2) and (1, 6)
            // Rightward destinations: (7, 2) and (7, 6)
            let moves = engine.getLegalMoves(elephant);
            expect(moves.length).toBe(8);
            expect(moves.some(m => m.x === 2 && m.y === 1)).toBe(true);
            expect(moves.some(m => m.x === 6 && m.y === 1)).toBe(true);
            expect(moves.some(m => m.x === 2 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 6 && m.y === 7)).toBe(true);

            // Block 1st orthogonal step at (4, 3) (upward)
            const blocker1 = new JanggiSoldier('bs1', 'red', { x: 4, y: 3 });
            engine.board.setPiece(blocker1, 4, 3);
            moves = engine.getLegalMoves(elephant);
            // Both upward destinations (2, 1) and (6, 1) must be blocked
            expect(moves.some(m => m.x === 2 && m.y === 1)).toBe(false);
            expect(moves.some(m => m.x === 6 && m.y === 1)).toBe(false);
            expect(moves.length).toBe(6);

            // Remove blocker1, block 2nd diagonal step at (3, 2) (towards (2, 1))
            engine.board.removePieceAt(4, 3);
            const blocker2 = new JanggiSoldier('bs2', 'red', { x: 3, y: 2 });
            engine.board.setPiece(blocker2, 3, 2);
            moves = engine.getLegalMoves(elephant);
            // (2, 1) is blocked by blocker2, but (6, 1) is still free
            expect(moves.some(m => m.x === 2 && m.y === 1)).toBe(false);
            expect(moves.some(m => m.x === 6 && m.y === 1)).toBe(true);
            expect(moves.length).toBe(7);
        });
    });

    // 7. Horse movement (1+1 L-shape, hobbling)
    describe('JanggiHorse — L-shape & Hobbling', () => {
        it('should move 1 orthogonal + 1 diagonal outward and be hobbled by orthogonal blocker', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 0 });
            const horse = new JanggiHorse('bh', 'blue', { x: 4, y: 5 });

            engine.board.setPiece(blueGen, 4, 9);
            engine.board.setPiece(redGen, 5, 0);
            engine.board.setPiece(horse, 4, 5);

            // Open position: 8 moves
            let moves = engine.getLegalMoves(horse);
            expect(moves.length).toBe(8);
            expect(moves.some(m => m.x === 3 && m.y === 3)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 3)).toBe(true);

            // Hobble upward step at (4, 4)
            const hobbler = new JanggiSoldier('rs', 'red', { x: 4, y: 4 });
            engine.board.setPiece(hobbler, 4, 4);

            moves = engine.getLegalMoves(horse);
            // Upward destinations (3, 3) and (5, 3) must be blocked
            expect(moves.some(m => m.x === 3 && m.y === 3)).toBe(false);
            expect(moves.some(m => m.x === 5 && m.y === 3)).toBe(false);
            expect(moves.length).toBe(6);
        });
    });

    // 8. Soldier movement (forward + sideways, enemy palace diagonal forward)
    describe('JanggiSoldier — Forward, Sideways & Palace Diagonal Movement', () => {
        it('should move forward and sideways across the entire board without backward movement (Blue up, Red down)', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 5, y: 0 });
            const blueSoldier = new JanggiSoldier('bs', 'blue', { x: 4, y: 4 });

            engine.board.setPiece(blueGen, 4, 9);
            engine.board.setPiece(redGen, 5, 0);
            engine.board.setPiece(blueSoldier, 4, 4);

            const blueMoves = engine.getLegalMoves(blueSoldier);
            // Blue moves up (forward: y-1), left (x-1), right (x+1)
            expect(blueMoves.length).toBe(3);
            expect(blueMoves.some(m => m.x === 4 && m.y === 3)).toBe(true); // forward (up)
            expect(blueMoves.some(m => m.x === 3 && m.y === 4)).toBe(true); // left
            expect(blueMoves.some(m => m.x === 5 && m.y === 4)).toBe(true); // right
            expect(blueMoves.some(m => m.x === 4 && m.y === 5)).toBe(false); // cannot move backward (down)

            // Red Soldier moves down (forward: y+1), left (x-1), right (x+1)
            const redSoldier = new JanggiSoldier('rs', 'red', { x: 4, y: 4 });
            engine.board.removePieceAt(4, 4);
            engine.board.setPiece(redSoldier, 4, 4);

            engine.currentTurn = 'red';
            const redMoves = engine.getLegalMoves(redSoldier);
            expect(redMoves.length).toBe(3);
            expect(redMoves.some(m => m.x === 4 && m.y === 5)).toBe(true); // forward for red (down)
            expect(redMoves.some(m => m.x === 3 && m.y === 4)).toBe(true); // left
            expect(redMoves.some(m => m.x === 5 && m.y === 4)).toBe(true); // right
            expect(redMoves.some(m => m.x === 4 && m.y === 3)).toBe(false); // no backward (up)
        });

        it('should move diagonally forward along diagonal lines inside the enemy palace', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 9 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 3, y: 0 });

            // Blue Soldier in enemy (Red) palace at corner (3, 2)
            const blueSoldier = new JanggiSoldier('bs', 'blue', { x: 3, y: 2 });
            engine.board.setPiece(blueGen, 4, 9);
            engine.board.setPiece(redGen, 3, 0);
            engine.board.setPiece(blueSoldier, 3, 2);

            let moves = engine.getLegalMoves(blueSoldier);
            // At (3, 2): forward (3, 1), left (2, 2), right (4, 2), AND diagonal forward to center (4, 1)
            expect(moves.some(m => m.x === 4 && m.y === 1)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 1)).toBe(true);

            // Move Blue Soldier to enemy palace center (4, 1)
            engine.board.removePieceAt(3, 2);
            engine.board.setPiece(blueSoldier, 4, 1);
            moves = engine.getLegalMoves(blueSoldier);
            // At (4, 1): diagonal forward to (3, 0) and (5, 0)
            expect(moves.some(m => m.x === 3 && m.y === 0)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 0)).toBe(true);

            // Remove blueSoldier so it does not check redGen
            engine.board.removePieceAt(4, 1);

            // Red Soldier in enemy (Blue) palace at corner (3, 7)
            const redSoldier = new JanggiSoldier('rs', 'red', { x: 3, y: 7 });
            engine.board.setPiece(redSoldier, 3, 7);
            engine.currentTurn = 'red';
            const redMoves = engine.getLegalMoves(redSoldier);
            // At (3, 7): diagonal forward to center (4, 8)
            expect(redMoves.some(m => m.x === 4 && m.y === 8)).toBe(true);
        });
    });

    // 9. Bikjang rule (draw, not illegal move)
    describe('Bikjang Rule', () => {
        it('should allow moving into facing generals across open file (legal move)', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            // Blue General at (3, 8), Red General at (4, 1)
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 3, y: 8 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 4, y: 1 });

            engine.board.setPiece(blueGen, 3, 8);
            engine.board.setPiece(redGen, 4, 1);

            const genMoves = engine.getLegalMoves(blueGen);
            // Moving to (4, 8) faces Red General across open file 4.
            // In Janggi, this is LEGAL (unlike Xiangqi).
            expect(genMoves.some(m => m.x === 4 && m.y === 8)).toBe(true);

            // Execute the move into facing
            const executed = engine.executeMove({ x: 3, y: 8 }, { x: 4, y: 8 });
            expect(executed).toBe(true);
            expect(engine.areGeneralsFacing()).toBe(true);
            // Turn passes to Red, state is still playing (Red gets a chance to respond)
            expect(engine.currentTurn).toBe('red');
            expect(engine.state).toBe('playing');
        });

        it('should result in Bikjang (draw) if the player to move does not move away or block', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            // Generals already face each other on file 4
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 8 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 4, y: 1 });
            // Red has a soldier at (0, 3)
            const redSoldier = new JanggiSoldier('rs', 'red', { x: 0, y: 3 });

            engine.board.setPiece(blueGen, 4, 8);
            engine.board.setPiece(redGen, 4, 1);
            engine.board.setPiece(redSoldier, 0, 3);

            engine.currentTurn = 'red';
            expect(engine.areGeneralsFacing()).toBe(true);

            // Red moves soldier horizontally at (0, 3) -> (1, 3), leaving file 4 open
            const moved = engine.executeMove({ x: 0, y: 3 }, { x: 1, y: 3 });
            expect(moved).toBe(true);
            // Generals are still facing, Red did not move away -> Bikjang DRAW!
            expect(engine.state).toBe('draw');
        });

        it('should avert Bikjang and continue playing if the player moves the general away or blocks', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            // Generals face on file 4
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 4, y: 8 });
            const redGen = new JanggiGeneral('rg', 'red', { x: 4, y: 1 });

            engine.board.setPiece(blueGen, 4, 8);
            engine.board.setPiece(redGen, 4, 1);

            engine.currentTurn = 'red';
            expect(engine.areGeneralsFacing()).toBe(true);

            // Red moves General to (3, 1) (moving away from file 4)
            const moved = engine.executeMove({ x: 4, y: 1 }, { x: 3, y: 1 });
            expect(moved).toBe(true);
            expect(engine.areGeneralsFacing()).toBe(false);
            expect(engine.state).toBe('playing');
        });
    });

    // 10. Pass Turn & Stalemate Mechanics
    describe('Pass Turn & Stalemate Mechanics', () => {
        it('should allow passing when not in check, but forbid passing when in check', () => {
            const engine = new JanggiEngine(new Janggi());
            expect(engine.canPassTurn()).toBe(true);

            const passed = engine.passTurn();
            expect(passed).toBe(true);
            expect(engine.currentTurn).toBe('red');
            expect(engine.history[0].isPass).toBe(true);

            // Put Red General in check with a Blue Chariot
            engine.board.clear();
            const redGen = new JanggiGeneral('rg', 'red', { x: 4, y: 1 });
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 3, y: 9 });
            const blueChariot = new JanggiChariot('bc', 'blue', { x: 4, y: 9 });
            engine.board.setPiece(redGen, 4, 1);
            engine.board.setPiece(blueGen, 3, 9);
            engine.board.setPiece(blueChariot, 4, 9);

            engine.currentTurn = 'red';
            expect(engine.isKingInCheck('red')).toBe(true);
            // Cannot pass when in check
            expect(engine.canPassTurn()).toBe(false);
            expect(engine.passTurn()).toBe(false);
        });

        it('should end in draw when both sides pass consecutively', () => {
            const engine = new JanggiEngine(new Janggi());
            expect(engine.passTurn()).toBe(true); // Blue passes
            expect(engine.currentTurn).toBe('red');
            expect(engine.state).toBe('playing');

            expect(engine.passTurn()).toBe(true); // Red passes
            expect(engine.state).toBe('draw');
        });

        it('should treat stalemate not as loss, but as forced pass with game continuing', () => {
            const engine = new JanggiEngine(new Janggi());
            engine.board.clear();

            // Red General trapped with 0 legal moves, but NOT in check
            const redGen = new JanggiGeneral('rg', 'red', { x: 3, y: 1 });
            const blueGen = new JanggiGeneral('bg', 'blue', { x: 5, y: 8 });

            const chariot1 = new JanggiChariot('bc1', 'blue', { x: 8, y: 0 });
            const chariot2 = new JanggiChariot('bc2', 'blue', { x: 8, y: 2 });
            const chariot3 = new JanggiChariot('bc3', 'blue', { x: 4, y: 9 });

            engine.board.setPiece(redGen, 3, 1);
            engine.board.setPiece(blueGen, 5, 8);
            engine.board.setPiece(chariot1, 8, 0);
            engine.board.setPiece(chariot2, 8, 2);
            engine.board.setPiece(chariot3, 4, 9);

            engine.currentTurn = 'red';
            expect(engine.isKingInCheck('red')).toBe(false);
            expect(engine.getLegalMoves(redGen).length).toBe(0);

            // In Janggi, stalemate does NOT end the game
            engine.updateGameState();
            expect(engine.state).toBe('playing');

            // Red is forced to pass
            expect(engine.canPassTurn()).toBe(true);
            expect(engine.passTurn()).toBe(true);
            expect(engine.currentTurn).toBe('blue');
        });
    });

    // 12. Configurable Initial Setups (Horse & Elephant Transpositions)
    describe('Configurable Initial Setups (Inner, Outer, Left, Right Elephant)', () => {
        it('should setup Inner Elephant (standard) correctly for both players', () => {
            const engine = new JanggiEngine(new Janggi({ blueSetup: 'inner', redSetup: 'inner' }));

            // Red (rank 0): H(1), E(2), E(6), H(7)
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(JanggiHorse);

            // Blue (rank 9): H(1), E(2), E(6), H(7)
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(6, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(7, 9)).toBeInstanceOf(JanggiHorse);

            expect(engine.initialFen).toBe('rnba1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR w - - 0 1');
        });

        it('should setup Outer Elephant correctly for both players', () => {
            const engine = new JanggiEngine(new Janggi({ blueSetup: 'outer', redSetup: 'outer' }));

            // Red (rank 0): E(1), H(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(JanggiElephant);

            // Blue (rank 9): E(1), H(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(6, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 9)).toBeInstanceOf(JanggiElephant);

            expect(engine.initialFen).toBe('rbna1anbr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RBNA1ANBR w - - 0 1');
        });

        it('should setup Left Elephant correctly (left swapped, right standard)', () => {
            const engine = new JanggiEngine(new Janggi({ blueSetup: 'left', redSetup: 'left' }));

            // Red (rank 0): E(1), H(2), E(6), H(7)
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(JanggiHorse);

            // Blue (rank 9): E(1), H(2), E(6), H(7)
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(6, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(7, 9)).toBeInstanceOf(JanggiHorse);

            expect(engine.initialFen).toBe('rbna1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RBNA1ABNR w - - 0 1');
        });

        it('should setup Right Elephant correctly (left standard, right swapped)', () => {
            const engine = new JanggiEngine(new Janggi({ blueSetup: 'right', redSetup: 'right' }));

            // Red (rank 0): H(1), E(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(JanggiElephant);

            // Blue (rank 9): H(1), E(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(6, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 9)).toBeInstanceOf(JanggiElephant);

            expect(engine.initialFen).toBe('rnba1anbr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ANBR w - - 0 1');
        });

        it('should support asymmetric setups and integration via VariantRegistry', () => {
            const engine = VariantRegistry.createEngine('janggi', { blueSetup: 'outer', redSetup: 'right' }) as JanggiEngine;

            // Blue Outer: E(1), H(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(6, 9)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 9)).toBeInstanceOf(JanggiElephant);

            // Red Right: H(1), E(2), H(6), E(7)
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(6, 0)).toBeInstanceOf(JanggiHorse);
            expect(engine.board.getPieceAt(7, 0)).toBeInstanceOf(JanggiElephant);

            expect(engine.initialFen).toBe('rnba1anbr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RBNA1ANBR w - - 0 1');
        });

        it('should clone custom fields properly in cloneCustomFields', () => {
            const engine = new JanggiEngine(new Janggi({ blueSetup: 'left', redSetup: 'outer' }), { blueSetup: 'left', redSetup: 'outer' });
            engine.consecutivePasses = 1;

            const cloneTarget = new JanggiEngine(new Janggi());
            engine.cloneCustomFields(cloneTarget);

            expect(cloneTarget.consecutivePasses).toBe(1);
            expect(cloneTarget.janggiSetups).toEqual({ blueSetup: 'left', redSetup: 'outer' });
            expect(cloneTarget.initialFen).toBe(engine.initialFen);
        });

        it('should generate weighted random setups with correct distribution', () => {
            const counts: Record<JanggiSetupType, number> = {
                inner: 0,
                left: 0,
                right: 0,
                outer: 0
            };

            const iterations = 10000;
            for (let i = 0; i < iterations; i++) {
                const setup = getRandomJanggiSetup();
                counts[setup]++;
            }

            // Verify all setups occurred
            expect(counts.inner).toBeGreaterThan(0);
            expect(counts.left).toBeGreaterThan(0);
            expect(counts.right).toBeGreaterThan(0);
            expect(counts.outer).toBeGreaterThan(0);

            // Target weights: inner 40%, left 25%, right 25%, outer 10%
            const innerPct = counts.inner / iterations;
            const leftPct = counts.left / iterations;
            const rightPct = counts.right / iterations;
            const outerPct = counts.outer / iterations;

            expect(innerPct).toBeGreaterThan(0.35);
            expect(innerPct).toBeLessThan(0.45);

            expect(leftPct).toBeGreaterThan(0.20);
            expect(leftPct).toBeLessThan(0.30);

            expect(rightPct).toBeGreaterThan(0.20);
            expect(rightPct).toBeLessThan(0.30);

            expect(outerPct).toBeGreaterThan(0.06);
            expect(outerPct).toBeLessThan(0.14);
        });
    });
});
