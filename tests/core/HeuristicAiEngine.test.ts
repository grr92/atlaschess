import { describe, it, expect } from 'vitest';
import { HeuristicAiEngine } from '../../src/core/ai/HeuristicAiEngine';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { ClassicChess } from '../../src/core/variants/ClassicChess';
import { GrantAcedrexEngine } from '../../src/core/engine/GrantAcedrexEngine';
import { GrantAcedrex } from '../../src/core/variants/GrantAcedrex';

describe('HeuristicAiEngine', () => {
    it('should accurately clone engine state without mutating original', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        const cloned = HeuristicAiEngine.cloneEngineState(engine);

        expect(cloned.board.getAllPieces().length).toBe(engine.board.getAllPieces().length);
        expect(cloned.currentTurn).toBe(engine.currentTurn);
        expect(cloned.state).toBe(engine.state);

        // Mutate clone
        cloned.executeMove({ x: 4, y: 6 }, { x: 4, y: 4 });
        expect(cloned.history.length).toBe(1);
        expect(engine.history.length).toBe(0);
    });

    it('should find legal opening AI move for White in Classic Chess', () => {
        const engine = new ClassicChessEngine(new ClassicChess());
        const bestMove = HeuristicAiEngine.findBestMove(engine, 'easy');

        expect(bestMove).not.toBeNull();
        expect(bestMove?.from).toBeDefined();
        expect(bestMove?.to).toBeDefined();
        expect(typeof bestMove?.score).toBe('number');
    });

    it('should filter candidate moves strictly to allowed piece in d8 mode', () => {
        const engine = new GrantAcedrexEngine(new GrantAcedrex());
        // Find best move restricted strictly to 'Giraffe'
        const bestMove = HeuristicAiEngine.findBestMove(engine, 'easy', 'Giraffe');

        expect(bestMove).not.toBeNull();
        const movedPiece = engine.board.getPieceAt(bestMove!.from.x, bestMove!.from.y);
        expect(movedPiece?.name).toBe('Giraffe');
    });
});
