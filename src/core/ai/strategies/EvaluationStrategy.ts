import type { BaseEngine } from '../../engine/BaseEngine';
import type { PieceColor } from '../../../types';
import { getPieceValue } from '../../pieces/pieceRegistry';
import { TamerlanePawn } from '../../pieces/tamerlane/TamerlanePawn';

export interface IEvaluationStrategy {
    evaluate(engine: BaseEngine, perspectiveColor: PieceColor): number;
}

export class DefaultEvaluationStrategy implements IEvaluationStrategy {
    evaluate(engine: BaseEngine, perspectiveColor: PieceColor): number {
        let whiteScore = 0;
        let blackScore = 0;
        const board = engine.board;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (!piece) continue;

                let value = getPieceValue(piece.name);

                // Pawn advance bonus
                if (piece.name.includes('Pawn') || piece.name === 'Padati' || piece.name === 'Sarbaz') {
                    const advance = piece.color === 'white' ? (board.rows - 1 - y) : y;
                    value += advance * 15;
                }

                // Center proximity bonus for major pieces
                if (!piece.name.includes('Pawn')) {
                    const centerX = board.cols / 2;
                    const centerY = board.rows / 2;
                    const distFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
                    value += Math.max(0, 15 - distFromCenter * 2);
                }

                if (piece.color === 'white') whiteScore += value;
                else blackScore += value;
            }
        }

        // Mobility bonus for active turn
        const currentTurn = engine.currentTurn;
        let legalMovesCount = 0;
        for (const p of board.getAllPieces()) {
            if (p.color === currentTurn) {
                legalMovesCount += engine.getLegalMoves(p).length;
            }
        }

        const mobilityBonus = legalMovesCount * 5;
        if (currentTurn === 'white') whiteScore += mobilityBonus;
        else blackScore += mobilityBonus;

        return perspectiveColor === 'white' ? (whiteScore - blackScore) : (blackScore - whiteScore);
    }
}

export class TamerlaneEvaluationStrategy implements IEvaluationStrategy {
    evaluate(engine: BaseEngine, perspectiveColor: PieceColor): number {
        let whiteScore = 0;
        let blackScore = 0;
        let whiteBaseMaterial = 0;
        let blackBaseMaterial = 0;

        const board = engine.board;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (!piece) continue;

                let value = getPieceValue(piece.name);
                if (piece.color === 'white') whiteBaseMaterial += value;
                else blackBaseMaterial += value;

                // Tamerlane Pawn evaluation with promotion stages
                if (piece instanceof TamerlanePawn) {
                    const promoRank = piece.color === 'white' ? 0 : (board.rows - 1);
                    const distToPromo = Math.abs(promoRank - y);

                    if (piece.pawnType === 'pawn_of_pawns') {
                        if (piece.promotionStage === 0) {
                            value = 160 + (board.rows - 1 - distToPromo) * 45;
                            if (distToPromo === 0) value += 300;
                        } else if (piece.isRestingOnLastRank) {
                            value = 450;
                        } else if (piece.promotionStage === 2) {
                            value = 550 + (board.rows - 1 - distToPromo) * 85;
                            if (distToPromo === 0) value += 1500;
                        }
                    } else if (piece.pawnType === 'pawn_of_king') {
                        value = 260 + (board.rows - 1 - distToPromo) * 55;
                        if (distToPromo === 0) value += 900;
                    } else {
                        value = 120 + (board.rows - 1 - distToPromo) * 20;
                    }
                }

                // Adventitious Shah in Citadel (Invulnerability)
                if (piece.name === 'AdventitiousShah') {
                    const isWhiteCitadel = piece.color === 'white' && x === 12 && y === 8;
                    const isBlackCitadel = piece.color === 'black' && x === 0 && y === 1;
                    if (isWhiteCitadel || isBlackCitadel) {
                        value += 2500;
                    } else {
                        const ownCitadelX = piece.color === 'white' ? 12 : 0;
                        const ownCitadelY = piece.color === 'white' ? 8 : 1;
                        const distToOwnCitadel = Math.abs(x - ownCitadelX) + Math.abs(y - ownCitadelY);
                        value += Math.max(0, 400 - distToOwnCitadel * 35);
                    }
                }

                // Shah positioning & Citadel Infiltration
                if (piece.name === 'Shah') {
                    const oppCitadelX = piece.color === 'white' ? 0 : 12;
                    const oppCitadelY = piece.color === 'white' ? 1 : 8;
                    const distToOppCitadel = Math.abs(x - oppCitadelX) + Math.abs(y - oppCitadelY);

                    const isLosing = piece.color === 'white'
                        ? (whiteBaseMaterial < blackBaseMaterial - 300)
                        : (blackBaseMaterial < whiteBaseMaterial - 300);

                    if (isLosing) {
                        value += Math.max(0, 600 - distToOppCitadel * 60);
                    }
                }

                // Center proximity bonus
                if (!piece.name.includes('Pawn')) {
                    const centerX = board.cols / 2;
                    const centerY = board.rows / 2;
                    const distFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
                    value += Math.max(0, 15 - distFromCenter * 2);
                }

                if (piece.color === 'white') whiteScore += value;
                else blackScore += value;
            }
        }

        return perspectiveColor === 'white' ? (whiteScore - blackScore) : (blackScore - whiteScore);
    }
}
