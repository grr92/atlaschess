import { describe, it, expect } from 'vitest';
import { HeuristicAiEngine } from '../../src/core/ai/HeuristicAiEngine';
import { ChaturajiEvaluationStrategy } from '../../src/core/ai/strategies/ChaturajiEvaluationStrategy';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import { Chaturaji } from '../../src/core/variants/Chaturaji';
import { CHATURAJI_DICE_PIECE_MAP } from '../../src/utils/diceMapper';

describe('Chaturaji AI Engine & Evaluation', () => {
    it('should accurately clone ChaturajiEngine state including stakes and partnerControlled', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        engine.stakes.red = 3;
        engine.partnerControlled.yellow = 'red';
        engine.throneVisits.red.add('green');
        engine.kingsKilledByPlayerKing.red = 1;

        const clone = HeuristicAiEngine.cloneEngineState(engine) as ChaturajiEngine;

        expect(clone.stakes.red).toBe(3);
        expect(clone.partnerControlled.yellow).toBe('red');
        expect(clone.throneVisits.red.has('green')).toBe(true);
        expect(clone.kingsKilledByPlayerKing.red).toBe(1);

        // Mutate clone and verify original remains unchanged
        clone.stakes.red = 5;
        expect(engine.stakes.red).toBe(3);
    });

    it('should use ChaturajiEvaluationStrategy and produce positive score for material and stakes advantage', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        const strategy = engine.getEvaluationStrategy();
        expect(strategy).toBeInstanceOf(ChaturajiEvaluationStrategy);

        const initialScore = strategy.evaluate(engine, 'red');
        // Initial board is symmetrical between Team Red/Yellow and Team Green/Blue
        expect(initialScore).toBeDefined();

        // Award red stakes
        engine.stakes.red += 2;
        const improvedScore = strategy.evaluate(engine, 'red');
        expect(improvedScore).toBeGreaterThan(initialScore);
    });

    it('should find a legal AI move for Red on opening turn across all difficulties', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        expect(engine.currentTurn).toBe('red');

        for (const difficulty of ['easy', 'medium', 'hard'] as const) {
            const move = HeuristicAiEngine.findBestMove(engine, difficulty);
            expect(move).not.toBeNull();
            expect(move?.from).toBeDefined();
            expect(move?.to).toBeDefined();

            const movingPiece = engine.board.getPieceAt(move!.from.x, move!.from.y);
            expect(movingPiece).not.toBeNull();
            expect(movingPiece?.color).toBe('red');

            const legalMoves = engine.getLegalMoves(movingPiece!);
            const isLegal = legalMoves.some(m => m.x === move!.to.x && m.y === move!.to.y);
            expect(isLegal).toBe(true);
        }
    });

    it('should respect dice roll piece constraints in 4-sided dice rule', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        expect(engine.currentTurn).toBe('red');

        // Roll 2 -> Boat
        const boatRollPieces = CHATURAJI_DICE_PIECE_MAP[2];
        const boatMove = HeuristicAiEngine.findBestMove(engine, 'medium', boatRollPieces);
        expect(boatMove).not.toBeNull();
        const boatPiece = engine.board.getPieceAt(boatMove!.from.x, boatMove!.from.y);
        expect(boatPiece?.name).toBe('ChaturajiBoat');

        // Roll 3 -> Horse
        const horseRollPieces = CHATURAJI_DICE_PIECE_MAP[3];
        const horseMove = HeuristicAiEngine.findBestMove(engine, 'medium', horseRollPieces);
        expect(horseMove).not.toBeNull();
        const horsePiece = engine.board.getPieceAt(horseMove!.from.x, horseMove!.from.y);
        expect(horsePiece?.name).toBe('ChaturajiHorse');

        // Move pawn g3 so Elephant at h3 has a legal open file/rank
        engine.executeMove({ x: 6, y: 5 }, { x: 5, y: 5 }); // Pawn g3 moves West to f3
        engine.currentTurn = 'red'; // Set turn back to red for testing

        // Roll 4 -> Elephant
        const elephantRollPieces = CHATURAJI_DICE_PIECE_MAP[4];
        const elephantMove = HeuristicAiEngine.findBestMove(engine, 'medium', elephantRollPieces);
        expect(elephantMove).not.toBeNull();
        const elephantPiece = engine.board.getPieceAt(elephantMove!.from.x, elephantMove!.from.y);
        expect(elephantPiece?.name).toBe('ChaturajiElephant');

        // Roll 1 -> King or Pawn
        const kingPawnRollPieces = CHATURAJI_DICE_PIECE_MAP[1];
        const kingPawnMove = HeuristicAiEngine.findBestMove(engine, 'medium', kingPawnRollPieces);
        expect(kingPawnMove).not.toBeNull();
        const kpPiece = engine.board.getPieceAt(kingPawnMove!.from.x, kingPawnMove!.from.y);
        expect(kpPiece?.name === 'ChaturajiKing' || kpPiece?.name === 'ChaturajiPawn').toBe(true);
    });

    it('should allow AI to move ally pieces when commanding partner army', () => {
        const engine = new ChaturajiEngine(new Chaturaji());
        // Yellow's king is captured/removed and Red controls Yellow
        engine.board.removePieceAt(0, 3); // Yellow King at a5
        engine.partnerControlled.yellow = 'red';
        engine.currentTurn = 'yellow';

        // When currentTurn is yellow, Red (the controller) finds legal moves among Yellow pieces
        const bestMove = HeuristicAiEngine.findBestMove(engine, 'medium');
        expect(bestMove).not.toBeNull();
        const piece = engine.board.getPieceAt(bestMove!.from.x, bestMove!.from.y);
        expect(piece?.color).toBe('yellow');
    });

    it('should successfully play a sequence of consecutive AI turns', () => {
        const engine = new ChaturajiEngine(new Chaturaji());

        // Play 8 turns with AI
        for (let turn = 0; turn < 8; turn++) {
            if (engine.state === 'checkmate' || engine.state === 'draw') break;
            const currentTurn = engine.currentTurn;
            const move = HeuristicAiEngine.findBestMove(engine, 'easy');
            expect(move).not.toBeNull();

            const success = engine.executeMove(move!.from, move!.to, move!.promotionPiece);
            expect(success).toBe(true);
            expect(engine.history.length).toBe(turn + 1);

            // Turn should have rotated unless game ended or modal pending
            if (engine.state === 'playing') {
                expect(engine.currentTurn).not.toBe(currentTurn);
            }
        }
    });
});
