import type { BaseEngine } from '../../engine/BaseEngine';
import type { PieceColor } from '../../../types';
import type { ChaturajiEngine, ChaturajiColor } from '../../engine/ChaturajiEngine';
import { getPieceValue } from '../../pieces/pieceRegistry';
import type { IEvaluationStrategy } from './EvaluationStrategy';

const INITIAL_THRONES: Record<ChaturajiColor, { x: number; y: number }> = {
    red: { x: 7, y: 4 },
    green: { x: 3, y: 7 },
    yellow: { x: 0, y: 3 },
    blue: { x: 4, y: 0 }
};

const PARTNER_MAP: Record<ChaturajiColor, ChaturajiColor> = {
    red: 'yellow',
    yellow: 'red',
    green: 'blue',
    blue: 'green'
};

export class ChaturajiEvaluationStrategy implements IEvaluationStrategy {
    evaluate(engine: BaseEngine, perspectiveColor: PieceColor): number {
        if (!('stakes' in engine)) return 0;

        const chaturaji = engine as unknown as ChaturajiEngine;
        const root = perspectiveColor as ChaturajiColor;
        const partner = PARTNER_MAP[root];

        // 1. Check terminal game state
        if (chaturaji.state === 'checkmate' || chaturaji.state === 'draw') {
            const match = chaturaji.getMatchWinner();
            if (match.winner === root) return 100000;
            if (match.winner === partner) return 50000;
            if (match.isTie && match.tiedWinners.includes(root)) return 30000;
            if (match.winner) return -100000; // enemy won
            return 0; // standard draw
        }

        let totalScore = 0;

        // 2. Stakes evaluation (stakes are primary victory condition)
        const ownStakes = chaturaji.stakes[root] || 0;
        const partnerStakes = chaturaji.stakes[partner] || 0;
        const enemy1Color: ChaturajiColor = (root === 'red' || root === 'yellow') ? 'green' : 'red';
        const enemy2Color: ChaturajiColor = (root === 'red' || root === 'yellow') ? 'blue' : 'yellow';
        const enemyStakes = (chaturaji.stakes[enemy1Color] || 0) + (chaturaji.stakes[enemy2Color] || 0);

        totalScore += ownStakes * 1500;
        totalScore += partnerStakes * 750;
        totalScore -= enemyStakes * 1200;

        // 3. Material, Throne Proximity, and Pawn advances
        const board = chaturaji.board;
        const partnerThrone = INITIAL_THRONES[partner];
        const isPartnerControlled = chaturaji.partnerControlled[partner] === root;
        if (isPartnerControlled) {
            totalScore += 2000; // Strategic advantage: commanding 2 armies
        }

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const piece = board.getPieceAt(x, y);
                if (!piece) continue;

                const pieceColor = piece.color as ChaturajiColor;
                const isSelf = pieceColor === root;
                const isAlly = pieceColor === partner;

                let pieceScore = getPieceValue(piece.name);

                // King Evaluation
                if (piece.name === 'ChaturajiKing') {
                    if (isSelf) {
                        // Encourage moving King towards partner throne or enemy thrones for Sinhasana
                        const distToPartnerThrone = Math.abs(x - partnerThrone.x) + Math.abs(y - partnerThrone.y);
                        pieceScore += Math.max(0, 300 - distToPartnerThrone * 30);

                        // Distance to enemy initial thrones
                        for (const enemyColor of [enemy1Color, enemy2Color]) {
                            if (!chaturaji.throneVisits[root].has(enemyColor)) {
                                const enemyThrone = INITIAL_THRONES[enemyColor];
                                const dist = Math.abs(x - enemyThrone.x) + Math.abs(y - enemyThrone.y);
                                pieceScore += Math.max(0, 200 - dist * 20);
                            }
                        }
                    }
                }

                // Boat Evaluation (Vrihannauka clustering)
                if (piece.name === 'ChaturajiBoat') {
                    let nearbyBoats = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (!board.isOutOfBounds(nx, ny)) {
                                const neighbor = board.getPieceAt(nx, ny);
                                if (neighbor && neighbor.name === 'ChaturajiBoat') {
                                    nearbyBoats++;
                                }
                            }
                        }
                    }
                    pieceScore += nearbyBoats * 40;
                }

                // Pawn advancement bonus towards promotion edge
                if (piece.name === 'ChaturajiPawn') {
                    let promoDist = 7;
                    if (pieceColor === 'green') promoDist = y; // moves North (dy = -1), promo at y = 0
                    else if (pieceColor === 'blue') promoDist = 7 - y; // moves South (dy = +1), promo at y = 7
                    else if (pieceColor === 'red') promoDist = x; // moves West (dx = -1), promo at x = 0
                    else if (pieceColor === 'yellow') promoDist = 7 - x; // moves East (dx = +1), promo at x = 7

                    const advance = 7 - promoDist;
                    pieceScore += advance * 25;
                }

                // Aggregate by team
                if (isSelf) {
                    totalScore += pieceScore;
                } else if (isAlly) {
                    totalScore += isPartnerControlled ? pieceScore * 0.95 : pieceScore * 0.75;
                } else {
                    totalScore -= pieceScore;
                }
            }
        }

        // 4. King alive bonus
        if (chaturaji.hasKingAlive(root)) {
            totalScore += 5000;
        } else {
            totalScore -= 5000;
        }

        if (chaturaji.hasKingAlive(partner)) {
            totalScore += 2500;
        }

        if (!chaturaji.hasKingAlive(enemy1Color)) {
            totalScore += 3000;
        }
        if (!chaturaji.hasKingAlive(enemy2Color)) {
            totalScore += 3000;
        }

        // 5. Mobility bonus
        const currentTurnColor = chaturaji.currentTurn as ChaturajiColor;
        let legalCount = 0;
        for (const p of board.getAllPieces()) {
            if (chaturaji.isPieceControllableByCurrentTurn(p)) {
                legalCount += chaturaji.getLegalMoves(p).length;
            }
        }
        const isCurrentTurnSelfOrAlly = currentTurnColor === root || currentTurnColor === partner;
        if (isCurrentTurnSelfOrAlly) {
            totalScore += legalCount * 4;
        } else {
            totalScore -= legalCount * 4;
        }

        return totalScore;
    }
}
