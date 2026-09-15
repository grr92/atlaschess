import { describe, it, expect } from 'vitest';
import { XiangqiEngine } from '../../src/core/engine/XiangqiEngine';
import { Xiangqi } from '../../src/core/variants/Xiangqi';
import {
    XiangqiGeneral,
    XiangqiAdvisor,
    XiangqiElephant,
    XiangqiHorse,
    XiangqiChariot,
    XiangqiCannon,
    XiangqiSoldier
} from '../../src/core/pieces/piecesIndex';

describe('XiangqiEngine & Piece Mechanics', () => {
    describe('Board Initialization', () => {
        it('should initialize a 9x10 board with 32 pieces and red starting', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            expect(engine.board.cols).toBe(9);
            expect(engine.board.rows).toBe(10);
            expect(engine.currentTurn).toBe('red');
            expect(engine.state).toBe('playing');

            const redPieces = engine.board.getAllPieces().filter(p => p.color === 'red');
            const blackPieces = engine.board.getAllPieces().filter(p => p.color === 'black');
            expect(redPieces.length).toBe(16);
            expect(blackPieces.length).toBe(16);

            expect(engine.board.getPieceAt(4, 9)).toBeInstanceOf(XiangqiGeneral);
            expect(engine.board.getPieceAt(4, 0)).toBeInstanceOf(XiangqiGeneral);
            expect(engine.board.getPieceAt(1, 7)).toBeInstanceOf(XiangqiCannon);
            expect(engine.board.getPieceAt(7, 7)).toBeInstanceOf(XiangqiCannon);
        });

        it('should rotate turns correctly between red and black', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            expect(engine.currentTurn).toBe('red');
            engine.rotateTurn();
            expect(engine.currentTurn).toBe('black');
            engine.rotateTurn();
            expect(engine.currentTurn).toBe('red');
        });
    });

    describe('XiangqiGeneral & Palace Restrictions', () => {
        it('should restrict General to 1-step orthogonal moves strictly within the palace', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            // Place Red General at center of palace (4, 8) and Black General at (4, 0)
            const redGen = new XiangqiGeneral('rg', 'red', { x: 4, y: 8 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 4, y: 0 });
            // Add a blocker between them to avoid flying general along file 4
            const blocker = new XiangqiSoldier('bs', 'black', { x: 4, y: 5 });

            engine.board.setPiece(redGen, 4, 8);
            engine.board.setPiece(blackGen, 4, 0);
            engine.board.setPiece(blocker, 4, 5);

            const moves = engine.getLegalMoves(redGen);
            // Center of red palace (4,8): can move to (3,8), (5,8), (4,7), (4,9)
            expect(moves.length).toBe(4);
            expect(moves.some(m => m.x === 3 && m.y === 8)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 8)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 9)).toBe(true);

            // Move General to edge of palace (3, 7) - top-left corner of red palace
            engine.board.movePiece({ x: 4, y: 8 }, { x: 3, y: 7 });
            const cornerMoves = engine.getLegalMoves(redGen);
            // From (3,7): can only step right to (4,7) or down to (3,8). Cannot step to (2,7) or (3,6)
            expect(cornerMoves.length).toBe(2);
            expect(cornerMoves.some(m => m.x === 4 && m.y === 7)).toBe(true);
            expect(cornerMoves.some(m => m.x === 3 && m.y === 8)).toBe(true);
            expect(cornerMoves.some(m => m.x === 2 && m.y === 7)).toBe(false);
            expect(cornerMoves.some(m => m.x === 3 && m.y === 6)).toBe(false);
        });
    });

    describe('XiangqiAdvisor (Guard)', () => {
        it('should move 1 step diagonally only within the palace', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 4, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 5, y: 0 });
            const advisor = new XiangqiAdvisor('ra', 'red', { x: 4, y: 8 });

            engine.board.setPiece(redGen, 4, 9);
            engine.board.setPiece(blackGen, 5, 0);
            engine.board.setPiece(advisor, 4, 8);

            const moves = engine.getLegalMoves(advisor);
            // From center of red palace (4,8), advisor can reach all 4 diagonal points
            expect(moves.length).toBe(4);
            expect(moves.some(m => m.x === 3 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 9)).toBe(true);
            expect(moves.some(m => m.x === 5 && m.y === 9)).toBe(true);

            // From corner of palace (3,7), advisor can ONLY return to center (4,8)
            engine.board.movePiece({ x: 4, y: 8 }, { x: 3, y: 7 });
            const cornerMoves = engine.getLegalMoves(advisor);
            expect(cornerMoves.length).toBe(1);
            expect(cornerMoves[0]).toEqual({ x: 4, y: 8 });
        });
    });

    describe('XiangqiElephant & River / Eye Blocking', () => {
        it('should move 2 steps diagonally, respect the eye blocker, and never cross the river', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 4, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 4, y: 0 });
            const blocker = new XiangqiSoldier('bs', 'black', { x: 4, y: 5 });

            // Red elephant on (2, 9)
            const elephant = new XiangqiElephant('re', 'red', { x: 2, y: 9 });
            engine.board.setPiece(redGen, 4, 9);
            engine.board.setPiece(blackGen, 4, 0);
            engine.board.setPiece(blocker, 4, 5);
            engine.board.setPiece(elephant, 2, 9);

            // From (2,9), can reach (0,7) and (4,7)
            let moves = engine.getLegalMoves(elephant);
            expect(moves.length).toBe(2);
            expect(moves.some(m => m.x === 0 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 7)).toBe(true);

            // Place an "eye blocker" at (3, 8)
            const eyeBlocker = new XiangqiSoldier('eye', 'red', { x: 3, y: 8 });
            engine.board.setPiece(eyeBlocker, 3, 8);

            moves = engine.getLegalMoves(elephant);
            // Now (4,7) is blocked by (3,8); only (0,7) remains legal
            expect(moves.length).toBe(1);
            expect(moves[0]).toEqual({ x: 0, y: 7 });

            // Test River boundary: move elephant to (2, 5) which is just at the river bank
            engine.board.removePieceAt(3, 8);
            engine.board.movePiece({ x: 2, y: 9 }, { x: 2, y: 5 });
            moves = engine.getLegalMoves(elephant);

            // From (2,5), diagonal upward moves would be to (0,3) and (4,3) which are across the river (y <= 4)
            // Neither (0,3) nor (4,3) should be allowed! Only downward moves (0,7) and (4,7)
            expect(moves.some(m => m.y < 5)).toBe(false);
            expect(moves.some(m => m.x === 0 && m.y === 7)).toBe(true);
            expect(moves.some(m => m.x === 4 && m.y === 7)).toBe(true);
        });
    });

    describe('XiangqiHorse (Knight) & Leg Blocking (Hobbling)', () => {
        it('should move 1 orthogonal + 1 diagonal outward, blocked by adjacent pieces', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 3, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 5, y: 0 });

            // Horse in middle of board (4, 4)
            const horse = new XiangqiHorse('rh', 'red', { x: 4, y: 4 });
            engine.board.setPiece(redGen, 3, 9);
            engine.board.setPiece(blackGen, 5, 0);
            engine.board.setPiece(horse, 4, 4);

            // In open position, horse has 8 moves
            let moves = engine.getLegalMoves(horse);
            expect(moves.length).toBe(8);

            // Block upward leg at (4, 3)
            const upBlocker = new XiangqiSoldier('ub', 'black', { x: 4, y: 3 });
            engine.board.setPiece(upBlocker, 4, 3);

            moves = engine.getLegalMoves(horse);
            // Upward destinations (3, 2) and (5, 2) must be blocked
            expect(moves.some(m => m.x === 3 && m.y === 2)).toBe(false);
            expect(moves.some(m => m.x === 5 && m.y === 2)).toBe(false);
            expect(moves.length).toBe(6);

            // Also block rightward leg at (5, 4)
            const rightBlocker = new XiangqiSoldier('rb', 'red', { x: 5, y: 4 });
            engine.board.setPiece(rightBlocker, 5, 4);

            moves = engine.getLegalMoves(horse);
            // Rightward destinations (6, 3) and (6, 5) must also be blocked
            expect(moves.some(m => m.x === 6 && m.y === 3)).toBe(false);
            expect(moves.some(m => m.x === 6 && m.y === 5)).toBe(false);
            expect(moves.length).toBe(4);
        });
    });

    describe('XiangqiCannon (Pao)', () => {
        it('should slide without capture, and require exactly 1 intervening piece to capture', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 3, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 5, y: 0 });
            const cannon = new XiangqiCannon('rc', 'red', { x: 1, y: 5 });

            // Place enemy chariot at (1, 1) and a screen at (1, 3)
            const screen = new XiangqiSoldier('sc', 'red', { x: 1, y: 3 });
            const targetChariot = new XiangqiChariot('tc', 'black', { x: 1, y: 1 });

            engine.board.setPiece(redGen, 3, 9);
            engine.board.setPiece(blackGen, 5, 0);
            engine.board.setPiece(cannon, 1, 5);
            engine.board.setPiece(screen, 1, 3);
            engine.board.setPiece(targetChariot, 1, 1);

            const moves = engine.getLegalMoves(cannon);

            // Sliding without capture: along rank 5, and files up to screen
            expect(moves.some(m => m.x === 1 && m.y === 4)).toBe(true);
            // Cannot slide onto or past screen (1,2) without capturing
            expect(moves.some(m => m.x === 1 && m.y === 3)).toBe(false);
            expect(moves.some(m => m.x === 1 && m.y === 2)).toBe(false);
            // Can capture enemy target through exactly 1 screen at (1, 1)
            expect(moves.some(m => m.x === 1 && m.y === 1)).toBe(true);
            // Cannot capture beyond target
            expect(moves.some(m => m.x === 1 && m.y === 0)).toBe(false);

            // Add a second screen between cannon and target at (1, 2)
            const secondScreen = new XiangqiSoldier('sc2', 'black', { x: 1, y: 2 });
            engine.board.setPiece(secondScreen, 1, 2);

            const movesWithTwoScreens = engine.getLegalMoves(cannon);
            // With two screens, (1, 1) capture is no longer legal
            expect(movesWithTwoScreens.some(m => m.x === 1 && m.y === 1)).toBe(false);
        });
    });

    describe('XiangqiSoldier (Pawn) & River Crossing', () => {
        it('should move only forward before crossing river, and forward + sideways after crossing', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 4, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 4, y: 0 });
            const blocker = new XiangqiSoldier('bs', 'black', { x: 4, y: 5 });

            // Soldier on own side (y = 6)
            const soldier = new XiangqiSoldier('rs', 'red', { x: 2, y: 6 });

            engine.board.setPiece(redGen, 4, 9);
            engine.board.setPiece(blackGen, 4, 0);
            engine.board.setPiece(blocker, 4, 5);
            engine.board.setPiece(soldier, 2, 6);

            // Before river: only 1 move forward (2, 5)
            let moves = engine.getLegalMoves(soldier);
            expect(moves.length).toBe(1);
            expect(moves[0]).toEqual({ x: 2, y: 5 });

            // Advance across the river to (2, 4)
            engine.board.movePiece({ x: 2, y: 6 }, { x: 2, y: 4 });
            moves = engine.getLegalMoves(soldier);

            // Across river: forward (2, 3), left (1, 4), right (3, 4). Cannot retreat to (2, 5).
            expect(moves.length).toBe(3);
            expect(moves.some(m => m.x === 2 && m.y === 3)).toBe(true);
            expect(moves.some(m => m.x === 1 && m.y === 4)).toBe(true);
            expect(moves.some(m => m.x === 3 && m.y === 4)).toBe(true);
            expect(moves.some(m => m.x === 2 && m.y === 5)).toBe(false);
        });
    });

    describe('Flying General Rule', () => {
        it('should forbid moves that leave the opposing generals directly facing on an open file', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            const redGen = new XiangqiGeneral('rg', 'red', { x: 4, y: 9 });
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 4, y: 0 });
            // Red chariot at (4, 5) sits between the two generals
            const shieldChariot = new XiangqiChariot('rc', 'red', { x: 4, y: 5 });

            engine.board.setPiece(redGen, 4, 9);
            engine.board.setPiece(blackGen, 4, 0);
            engine.board.setPiece(shieldChariot, 4, 5);

            const chariotMoves = engine.getLegalMoves(shieldChariot);

            // The chariot can move along file 4 (up/down) because it still shields the generals
            expect(chariotMoves.some(m => m.x === 4 && m.y === 4)).toBe(true);
            expect(chariotMoves.some(m => m.x === 4 && m.y === 6)).toBe(true);

            // Moving horizontally off file 4 (e.g. to (3, 5) or (5, 5)) exposes the generals, which is illegal!
            expect(chariotMoves.some(m => m.x === 3 && m.y === 5)).toBe(false);
            expect(chariotMoves.some(m => m.x === 5 && m.y === 5)).toBe(false);
        });
    });

    describe('Stalemate is a Win', () => {
        it('should declare victory when the opponent is stalemated (no legal moves)', () => {
            const engine = new XiangqiEngine(new Xiangqi());
            engine.board.clear();

            // Setup a position where Black general is trapped with no legal moves (stalemated)
            // Black General at (3, 0)
            const blackGen = new XiangqiGeneral('bg', 'black', { x: 3, y: 0 });
            // Red General at (5, 9)
            const redGen = new XiangqiGeneral('rg', 'red', { x: 5, y: 9 });

            // Place Red Chariots controlling all escape points of the Black General
            // General at (3,0) could orthogonally move to (4,0) and (3,1)
            // A Red Chariot at (4, 8) covers file 4 (controls (4,0))
            // A Red Chariot at (8, 1) covers rank 1 (controls (3,1))
            const chariot1 = new XiangqiChariot('rr1', 'red', { x: 4, y: 8 });
            const chariot2 = new XiangqiChariot('rr2', 'red', { x: 8, y: 1 });

            engine.board.setPiece(blackGen, 3, 0);
            engine.board.setPiece(redGen, 5, 9);
            engine.board.setPiece(chariot1, 4, 8);
            engine.board.setPiece(chariot2, 8, 1);

            // It is Black's turn, Black is NOT in check at (3,0), but has 0 legal moves
            engine.currentTurn = 'black';

            // Verify Black has no legal moves
            const moves = engine.getLegalMoves(blackGen);
            expect(moves.length).toBe(0);

            // In Xiangqi, stalemate is a loss for the stalemated player (evaluated as checkmate)
            engine.updateGameState();
            expect(engine.state).toBe('checkmate');
        });
    });
});
