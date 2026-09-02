import type { GameState } from '../../../types';
import { BaseEngine } from '../BaseEngine';

export interface IVictoryStrategy {
    evaluateGameState(engine: BaseEngine): GameState;
}

export class StandardVictoryStrategy implements IVictoryStrategy {
    constructor(private options: { stalemateIsWin: boolean } = { stalemateIsWin: false }) {}

    evaluateGameState(engine: BaseEngine): GameState {
        let hasAnyLegalMove = false;
        for (let y = 0; y < engine.board.rows; y++) {
            for (let x = 0; x < engine.board.cols; x++) {
                const p = engine.board.getPieceAt(x, y);
                if (p && p.color === engine.currentTurn) {
                    if (engine.getLegalMoves(p).length > 0) {
                        hasAnyLegalMove = true;
                        break;
                    }
                }
            }
            if (hasAnyLegalMove) break;
        }

        const inCheck = engine.isKingInCheck(engine.currentTurn);

        if (!hasAnyLegalMove) {
            return inCheck ? 'checkmate' : (this.options.stalemateIsWin ? 'checkmate' : 'draw');
        }

        return inCheck ? 'check' : 'playing';
    }
}

export class BareKingVictoryStrategy implements IVictoryStrategy {
    constructor(private options: { stalemateIsWin: boolean }) {}

    evaluateGameState(engine: BaseEngine): GameState {
        let whitePiecesCount = 0;
        let blackPiecesCount = 0;

        for (let y = 0; y < engine.board.rows; y++) {
            for (let x = 0; x < engine.board.cols; x++) {
                const p = engine.board.getPieceAt(x, y);
                if (p) {
                    if (p.color === 'white') whitePiecesCount++;
                    else blackPiecesCount++;
                }
            }
        }

        // bare king rule
        if (engine.currentTurn === 'white' && whitePiecesCount === 1) return 'checkmate';
        if (engine.currentTurn === 'black' && blackPiecesCount === 1) return 'checkmate';

        let hasAnyLegalMove = false;
        for (let y = 0; y < engine.board.rows; y++) {
            for (let x = 0; x < engine.board.cols; x++) {
                const p = engine.board.getPieceAt(x, y);
                if (p && p.color === engine.currentTurn) {
                    if (engine.getLegalMoves(p).length > 0) {
                        hasAnyLegalMove = true;
                        break;
                    }
                }
            }
            if (hasAnyLegalMove) break;
        }

        const inCheck = engine.isKingInCheck(engine.currentTurn);

        if (!hasAnyLegalMove) {
            return inCheck ? 'checkmate' : (this.options.stalemateIsWin ? 'checkmate' : 'draw');
        }

        return inCheck ? 'check' : 'playing';
    }
}
