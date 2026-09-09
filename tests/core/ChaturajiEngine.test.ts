import { describe, it, expect } from 'vitest';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import { Chaturaji } from '../../src/core/variants/Chaturaji';
import {
    ChaturajiKing,
    ChaturajiElephant,
    ChaturajiHorse,
    ChaturajiBoat,
    ChaturajiPawn
} from '../../src/core/pieces/piecesIndex';
import { getAvailableDiceNumbers, isPieceAllowedByDice } from '../../src/utils/diceMapper';

describe('ChaturajiEngine', () => {
    it('should initialize 4 armies with 8 pieces each on an 8x8 Ashtāpada board', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        expect(engine.currentTurn).toBe('red');
        expect(engine.state).toBe('playing');

        const allPieces = engine.board.getAllPieces();
        expect(allPieces.length).toBe(32);

        for (const color of ['red', 'green', 'yellow', 'blue'] as const) {
            const playerPieces = allPieces.filter(p => p.color === color);
            expect(playerPieces.length).toBe(8);

            expect(playerPieces.filter(p => p instanceof ChaturajiKing).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof ChaturajiElephant).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof ChaturajiHorse).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof ChaturajiBoat).length).toBe(1);
            expect(playerPieces.filter(p => p instanceof ChaturajiPawn).length).toBe(4);
        }

        // Verify initial starting coordinates
        expect(engine.board.getPieceAt(7, 4)).toBeInstanceOf(ChaturajiKing); // Red King (h4)
        expect(engine.board.getPieceAt(3, 7)).toBeInstanceOf(ChaturajiKing); // Green King (d1)
        expect(engine.board.getPieceAt(0, 3)).toBeInstanceOf(ChaturajiKing); // Yellow King (a5)
        expect(engine.board.getPieceAt(4, 0)).toBeInstanceOf(ChaturajiKing); // Blue King (e8)
    });

    it('should rotate turns clockwise: red -> green -> yellow -> blue -> red', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        expect(engine.currentTurn).toBe('red');

        // Red pawn moves from (6, 4) to (5, 4) (moves -x)
        expect(engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 })).toBe(true);
        expect(engine.currentTurn).toBe('green');

        // Green pawn moves from (3, 6) to (3, 5) (moves -y)
        expect(engine.executeMove({ x: 3, y: 6 }, { x: 3, y: 5 })).toBe(true);
        expect(engine.currentTurn).toBe('yellow');

        // Yellow pawn moves from (1, 3) to (2, 3) (moves +x)
        expect(engine.executeMove({ x: 1, y: 3 }, { x: 2, y: 3 })).toBe(true);
        expect(engine.currentTurn).toBe('blue');

        // Blue pawn moves from (4, 1) to (4, 2) (moves +y)
        expect(engine.executeMove({ x: 4, y: 1 }, { x: 4, y: 2 })).toBe(true);
        expect(engine.currentTurn).toBe('red');
    });

    it('should skip turn for players who have lost their King', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        // Eliminate Green King from the board
        engine.board.removePieceAt(3, 7);

        // Red moves (6, 4) -> (5, 4)
        expect(engine.executeMove({ x: 6, y: 4 }, { x: 5, y: 4 })).toBe(true);
        // Green should be skipped, turn goes directly to yellow
        expect(engine.currentTurn).toBe('yellow');
    });

    it('should allow Boat (Nauka) to leap 2 squares diagonally over pieces', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        const redBoat = engine.board.getPieceAt(7, 7); // Red Boat at h1
        expect(redBoat).toBeInstanceOf(ChaturajiBoat);

        const legalMoves = engine.getLegalMoves(redBoat!);
        // Can leap diagonally over pawn on (6, 6) to (5, 5)
        expect(legalMoves.some(m => m.x === 5 && m.y === 5)).toBe(true);
    });

    it('should allow Elephant (Hathi) to move orthogonally like a Rook', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redElephant = new ChaturajiElephant('e_r', 'red', { x: 3, y: 3 });
        engine.board.setPiece(redElephant, 3, 3);

        const moves = engine.getLegalMoves(redElephant);
        expect(moves.length).toBe(14); // 7 horizontal + 7 vertical
        expect(moves.some(m => m.x === 3 && m.y === 0)).toBe(true);
        expect(moves.some(m => m.x === 0 && m.y === 3)).toBe(true);
        expect(moves.some(m => m.x === 7 && m.y === 3)).toBe(true);
        expect(moves.some(m => m.x === 3 && m.y === 7)).toBe(true);
    });

    it('should execute Boat Triumph (Vrihannauka) when 4 boats form a 2x2 square', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        // 3 stationary boats forming 3 corners of a 2x2 block at (2,2), (2,3), (3,2)
        const b1 = new ChaturajiBoat('b_g', 'green', { x: 2, y: 2 });
        const b2 = new ChaturajiBoat('b_y', 'yellow', { x: 2, y: 3 });
        const b3 = new ChaturajiBoat('b_b', 'blue', { x: 3, y: 2 });
        // Red boat starting at (5, 5)
        const redBoat = new ChaturajiBoat('b_r', 'red', { x: 5, y: 5 });

        engine.board.setPiece(b1, 2, 2);
        engine.board.setPiece(b2, 2, 3);
        engine.board.setPiece(b3, 3, 2);
        engine.board.setPiece(redBoat, 5, 5);

        // Red boat leaps to (3, 3), completing the 2x2 square [2..3, 2..3]
        const success = engine.executeMove({ x: 5, y: 5 }, { x: 3, y: 3 });
        expect(success).toBe(true);

        // The red boat should remain at (3, 3)
        expect(engine.board.getPieceAt(3, 3)).toBe(redBoat);

        // The other 3 boats should be removed from board and recorded in Red's captures
        expect(engine.board.getPieceAt(2, 2)).toBeNull();
        expect(engine.board.getPieceAt(2, 3)).toBeNull();
        expect(engine.board.getPieceAt(3, 2)).toBeNull();

        expect(engine.capturedPiecesByPlayer.red.length).toBe(3);
        expect(engine.capturedPiecesByPlayer.red.map(p => p.id)).toEqual(expect.arrayContaining(['b_g', 'b_y', 'b_b']));
    });

    it('should promote pawn to Horse or Elephant when player has <= 2 pawns', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        // Red has 1 King and 2 pawns, moving -x towards File a (x=0)
        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const p1 = new ChaturajiPawn('p1_r', 'red', { x: 1, y: 1 }); // near West boundary at y=1 (Knight square a7)
        const p2 = new ChaturajiPawn('p2_r', 'red', { x: 6, y: 7 });
        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(p1, 1, 1);
        engine.board.setPiece(p2, 6, 7);

        // Pawn moves to (0, 1) which is column 0 row 1 (Knight square a7) on West boundary
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 0, y: 1 })).toBe(true);

        const promotedPiece = engine.board.getPieceAt(0, 1);
        expect(promotedPiece).toBeInstanceOf(ChaturajiHorse);
        expect(promotedPiece?.color).toBe('red');
    });

    it('should keep pawn frozen on boundary if player owns 3 or more pawns', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        // Red has 1 King and 3 pawns
        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const p1 = new ChaturajiPawn('p1_r', 'red', { x: 1, y: 1 });
        const p2 = new ChaturajiPawn('p2_r', 'red', { x: 6, y: 6 });
        const p3 = new ChaturajiPawn('p3_r', 'red', { x: 6, y: 7 });
        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(p1, 1, 1);
        engine.board.setPiece(p2, 6, 6);
        engine.board.setPiece(p3, 6, 7);

        // Move p1 to (0, 1)
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 0, y: 1 })).toBe(true);

        // Still a pawn (frozen) because 3 pawns exist
        const pieceAtBoundary = engine.board.getPieceAt(0, 1);
        expect(pieceAtBoundary).toBeInstanceOf(ChaturajiPawn);

        // Now simulate capture of p3 so Red only has 2 pawns
        engine.board.removePieceAt(6, 7);

        // Trigger promotion evaluation
        engine.processPawnPromotions();
        expect(engine.board.getPieceAt(0, 1)).toBeInstanceOf(ChaturajiHorse);
    });

    it('should award stakes for entering opponent throne', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 4, y: 1 });
        const redPawn = new ChaturajiPawn('p_r', 'red', { x: 6, y: 4 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });
        const yellowKing = new ChaturajiKing('k_y', 'yellow', { x: 0, y: 3 });
        const yellowPawn = new ChaturajiPawn('p_y', 'yellow', { x: 1, y: 3 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 5, y: 0 });
        const bluePawn = new ChaturajiPawn('p_b', 'blue', { x: 4, y: 0 }); // on blue throne (4, 0)

        engine.board.setPiece(redKing, 4, 1);
        engine.board.setPiece(redPawn, 6, 4);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(greenPawn, 3, 6);
        engine.board.setPiece(yellowKing, 0, 3);
        engine.board.setPiece(yellowPawn, 1, 3);
        engine.board.setPiece(blueKing, 5, 0);
        engine.board.setPiece(bluePawn, 4, 0);

        // Red King captures piece on Blue throne (4, 0)
        expect(engine.executeMove({ x: 4, y: 1 }, { x: 4, y: 0 })).toBe(true);

        expect(engine.stakes.red).toBe(1);
    });

    it('should allow taking control of partner army when King enters partner throne', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 1, y: 3 });
        const redPawn = new ChaturajiPawn('p_r', 'red', { x: 6, y: 4 });
        const yellowKing = new ChaturajiKing('k_y', 'yellow', { x: 0, y: 6 }); // Partner (Yellow)
        const yellowPawn = new ChaturajiPawn('p_y', 'yellow', { x: 1, y: 0 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 });
        const bluePawn = new ChaturajiPawn('p_b', 'blue', { x: 4, y: 1 });

        engine.board.setPiece(redKing, 1, 3);
        engine.board.setPiece(redPawn, 6, 4);
        engine.board.setPiece(yellowKing, 0, 6);
        engine.board.setPiece(yellowPawn, 1, 0);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(greenPawn, 3, 6);
        engine.board.setPiece(blueKing, 4, 0);
        engine.board.setPiece(bluePawn, 4, 1);

        // Red King enters Yellow throne (0, 3)
        expect(engine.executeMove({ x: 1, y: 3 }, { x: 0, y: 3 })).toBe(true);

        // Partner control registered
        expect(engine.partnerControlled.yellow).toBe('red');

        // Red can control Yellow pieces on Red's turn
        expect(engine.isPieceControllableByCurrentTurn(yellowPawn)).toBe(false); // current turn is green
        engine.currentTurn = 'red';
        expect(engine.isPieceControllableByCurrentTurn(yellowPawn)).toBe(true);
    });

    it('should handle King Rescue mechanism when partner king is dead', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const redElephant = new ChaturajiElephant('e_r', 'red', { x: 3, y: 4 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 2 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 });
        const bluePawn = new ChaturajiPawn('p_b', 'blue', { x: 4, y: 1 });
        // Partner (Yellow) has NO king alive

        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(redElephant, 3, 4);
        engine.board.setPiece(greenKing, 3, 2);
        engine.board.setPiece(greenPawn, 3, 6);
        engine.board.setPiece(blueKing, 4, 0);
        engine.board.setPiece(bluePawn, 4, 1);

        // Red elephant captures green king
        expect(engine.executeMove({ x: 3, y: 4 }, { x: 3, y: 2 })).toBe(true);

        // Pending King Rescue choice should be triggered for Yellow
        expect(engine.pendingKingRescueChoice).toEqual({
            capturingColor: 'red',
            partnerColor: 'yellow'
        });

        // Confirming rescue
        engine.confirmKingRescue();
        expect(engine.pendingKingRescueChoice).toBeNull();
        expect(engine.pendingKingPlacement).toEqual({ color: 'yellow' });

        // Place rescued yellow king on empty square (3, 3)
        const placed = engine.placeRescuedKing({ x: 3, y: 3 });
        expect(placed).toBe(true);
        expect(engine.board.getPieceAt(3, 3)).toBeInstanceOf(ChaturajiKing);
        expect(engine.board.getPieceAt(3, 3)?.color).toBe('yellow');
    });

    it('should declare Draw when any player is reduced to Bare King', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        // Red has only 1 King (Bare King)
        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 });
        const greenPawn = new ChaturajiPawn('p_g', 'green', { x: 3, y: 6 });

        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(greenPawn, 3, 6);

        engine.updateGameState();
        expect(engine.state).toBe('draw');
        expect(engine.isDraw).toBe(true);
    });

    it('should declare checkmate and award stakes to sole surviving King', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 7, y: 4 });
        const redPawn = new ChaturajiPawn('p_r', 'red', { x: 6, y: 4 });
        const greenElephant = new ChaturajiElephant('e_g', 'green', { x: 2, y: 7 });
        // No other kings alive

        engine.board.setPiece(redKing, 7, 4);
        engine.board.setPiece(redPawn, 6, 4);
        engine.board.setPiece(greenElephant, 2, 7);

        engine.updateGameState();
        expect(engine.state).toBe('checkmate');
        expect(engine.winnerColor).toBe('red');
        expect(engine.stakes.red).toBe(1);
    });

    it('should award 2 stakes and score king kill when capturing ally King on partner throne', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        const redKing = new ChaturajiKing('k_r', 'red', { x: 1, y: 3 });
        const yellowKing = new ChaturajiKing('k_y', 'yellow', { x: 0, y: 3 }); // on partner throne (0, 3)
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 });

        engine.board.setPiece(redKing, 1, 3);
        engine.board.setPiece(yellowKing, 0, 3);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(blueKing, 4, 0);

        expect(engine.executeMove({ x: 1, y: 3 }, { x: 0, y: 3 })).toBe(true);

        expect(engine.stakes.red).toBe(2);
        expect(engine.kingsKilledByPlayerKing.red).toBe(1);
        expect(engine.partnerControlled.yellow).toBe('red');
    });

    it('should score kills and stakes for the controlling player when using a controlled partner king', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.board.clear();

        // Red controls Yellow's army
        engine.partnerControlled.yellow = 'red';

        const yellowKing = new ChaturajiKing('k_y', 'yellow', { x: 3, y: 6 });
        const greenKing = new ChaturajiKing('k_g', 'green', { x: 3, y: 7 }); // Green on green throne (3, 7)
        const redPawn = new ChaturajiPawn('p_r', 'red', { x: 6, y: 4 });
        const blueKing = new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 });

        engine.board.setPiece(yellowKing, 3, 6);
        engine.board.setPiece(greenKing, 3, 7);
        engine.board.setPiece(redPawn, 6, 4);
        engine.board.setPiece(blueKing, 4, 0);

        engine.currentTurn = 'red';
        // Red moves Yellow's king to capture Green king on Green's throne
        expect(engine.executeMove({ x: 3, y: 6 }, { x: 3, y: 7 })).toBe(true);

        // Stakes and kill stats should be awarded to Red
        expect(engine.stakes.red).toBe(2);
        expect(engine.kingsKilledByPlayerKing.red).toBe(1);
        expect(engine.kingsKilledOnThrone.red).toBe(1);
        expect(engine.capturedPiecesByPlayer.red.map(p => p.id)).toContain('k_g');
    });

    it('should determine match winner based on most stakes won', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.stakes = { red: 3, green: 1, yellow: 0, blue: 2 };

        const result = engine.getMatchWinner();
        expect(result.winner).toBe('red');
        expect(result.maxStakes).toBe(3);
        expect(result.isTie).toBe(false);

        // Tied stakes
        engine.stakes = { red: 3, green: 1, yellow: 0, blue: 3 };
        const tieResult = engine.getMatchWinner();
        expect(tieResult.winner).toBeNull();
        expect(tieResult.isTie).toBe(true);
        expect(tieResult.tiedWinners).toEqual(['red', 'blue']);
    });

    it('should map pieces to dice numbers properly in Chaturaji', () => {
        expect(isPieceAllowedByDice('ChaturajiKing', 1, 'chaturaji')).toBe(true);
        expect(isPieceAllowedByDice('ChaturajiPawn', 1, 'chaturaji')).toBe(true);
        expect(isPieceAllowedByDice('ChaturajiBoat', 1, 'chaturaji')).toBe(false);

        expect(isPieceAllowedByDice('ChaturajiBoat', 2, 'chaturaji')).toBe(true);
        expect(isPieceAllowedByDice('ChaturajiHorse', 3, 'chaturaji')).toBe(true);
        expect(isPieceAllowedByDice('ChaturajiElephant', 4, 'chaturaji')).toBe(true);

        // Alternative historical rolls 5 and 6
        expect(isPieceAllowedByDice('ChaturajiKing', 5, 'chaturaji')).toBe(true);
        expect(isPieceAllowedByDice('ChaturajiElephant', 6, 'chaturaji')).toBe(true);
    });

    it('should retrieve available dice numbers based on pieces with legal moves in Chaturaji', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        // In opening position for red, pawns (1), horse (3), boat (2) can move
        const available = getAvailableDiceNumbers(engine, 'red', 'chaturaji');
        expect(available).toContain(1); // Pawns can move
        expect(available).toContain(2); // Boat can leap
        expect(available).toContain(3); // Horse can leap
    });
});
