import type { BaseEngine } from '../../engine/BaseEngine';
import type { PieceColor } from '../../../types';
import type { FourSeasonsEngine, FourSeasonsColor } from '../../engine/FourSeasonsEngine';
import { getPieceValue } from '../../pieces/pieceRegistry';
import type { IEvaluationStrategy } from './EvaluationStrategy';

export class FourSeasonsEvaluationStrategy implements IEvaluationStrategy {
    evaluate(engine: BaseEngine, perspectiveColor: PieceColor): number {
        const fsEngine = engine as unknown as FourSeasonsEngine;
        const root = perspectiveColor as FourSeasonsColor;

        // 1. Check terminal game state
        if (fsEngine.state === 'checkmate') {
            if (fsEngine.winnerColor === root) return 100000;
            if (fsEngine.winnerColor) return -100000;
        }
        if (fsEngine.state === 'draw') return 0;

        let totalScore = 0;

        // 2. King survival bonus
        const hasOwnKing = fsEngine.hasKingAlive(root);
        if (!hasOwnKing) {
            return -80000; // Eliminated
        }
        totalScore += 20000;

        // Check if own king is in check
        if (fsEngine.isKingInCheck(root)) {
            totalScore -= 1500;
        }

        // 3. Annexed armies bonus
        const controlledArmies = fsEngine.getControlledColors(root);
        totalScore += (controlledArmies.length - 1) * 2500;

        // 4. Board Material & Position Evaluation
        const board = fsEngine.board;
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (!piece) continue;

                const pieceColor = piece.color as FourSeasonsColor;
                const isControlled = controlledArmies.includes(pieceColor);

                let pieceScore = getPieceValue(piece.name);

                // Pawn advancement towards promotion boundary
                if (piece.name === 'FourSeasonsPawn' && 'direction' in piece) {
                    const { dx, dy } = (piece as any).direction;
                    let dist = 7;
                    if (dx === 1) dist = 7 - x;
                    else if (dx === -1) dist = x;
                    else if (dy === 1) dist = 7 - y;
                    else if (dy === -1) dist = y;

                    const advancement = 7 - dist;
                    pieceScore += advancement * 20;
                }

                // King centralization / safety
                if (piece.name === 'FourSeasonsKing') {
                    if (isControlled) {
                        // Bonus for keeping king safe away from active center early on
                        const distToCorner = Math.min(
                            Math.abs(x - 0) + Math.abs(y - 0),
                            Math.abs(x - 7) + Math.abs(y - 0),
                            Math.abs(x - 0) + Math.abs(y - 7),
                            Math.abs(x - 7) + Math.abs(y - 7)
                        );
                        pieceScore -= distToCorner * 10;
                    }
                }

                if (isControlled) {
                    totalScore += pieceScore;
                } else {
                    totalScore -= pieceScore / 3;
                }
            }
        }

        // 5. Opponent elimination bonus
        for (const c of (['green', 'red', 'black', 'white'] as FourSeasonsColor[])) {
            if (c !== root && !fsEngine.hasKingAlive(c)) {
                totalScore += 3000;
            }
        }

        // 6. Mobility
        if (fsEngine.currentTurn === root) {
            let mobility = 0;
            for (const p of board.getAllPieces()) {
                if (fsEngine.isPieceControllableByCurrentTurn(p)) {
                    mobility += fsEngine.getLegalMoves(p).length;
                }
            }
            totalScore += mobility * 5;
        }

        return totalScore;
    }
}
