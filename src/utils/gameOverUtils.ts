import { ChaturajiEngine } from '../core/engine/ChaturajiEngine';
import { FourSeasonsEngine } from '../core/engine/FourSeasonsEngine';
import { ShogiEngine } from '../core/engine/ShogiEngine';
import type { PieceColor, GameState } from '../types';
import type { GameMode } from '../store/types';
import type { BaseEngine } from '../core/engine/BaseEngine';

export type GameOverOutcome = 'player_win' | 'player_loss' | 'draw' | 'pvp_win';

export interface ChaturajiStakesInfo {
    winner: PieceColor | null;
    maxStakes: number;
    isTie: boolean;
    tiedWinners: PieceColor[];
    stakes: Record<string, number>;
}

export interface ShogiJishogiInfo {
    result: 'draw' | 'white_win' | 'black_win';
    whitePoints: number;
    blackPoints: number;
}

export interface OutcomeResult {
    outcome: GameOverOutcome;
    winnerColor: PieceColor | null;
    specialReason: string | null;
    chaturajiStakes?: ChaturajiStakesInfo;
    shogiJishogi?: ShogiJishogiInfo;
    fourSeasonsWinner?: PieceColor | null;
}

/**
 * Pure evaluation helper to determine winner and outcome across all variants and modes.
 */
export function getGameOutcome({
    gameState,
    gameMode,
    playerColor,
    currentTurn,
    engine,
    playerColors,
}: {
    gameState: GameState;
    gameMode: GameMode;
    playerColor: PieceColor;
    currentTurn: PieceColor;
    engine: BaseEngine | null;
    playerColors?: PieceColor[];
}): OutcomeResult {
    let winnerColor: PieceColor | null = null;
    let isDraw = gameState === 'draw';
    let specialReason: string | null = null;
    let chaturajiStakes: ChaturajiStakesInfo | undefined;
    let shogiJishogi: ShogiJishogiInfo | undefined;
    let fourSeasonsWinner: PieceColor | null | undefined;

    if (engine instanceof ChaturajiEngine) {
        const match = engine.getMatchWinner();
        chaturajiStakes = {
            winner: match.winner,
            maxStakes: match.maxStakes,
            isTie: match.isTie,
            tiedWinners: match.tiedWinners,
            stakes: { ...engine.stakes },
        };
        if (match.winner) {
            winnerColor = match.winner;
            isDraw = false;
            specialReason = `${match.maxStakes}`;
        } else if (match.isTie) {
            isDraw = true;
            winnerColor = null;
            if (match.maxStakes > 0) {
                specialReason = `${match.maxStakes}`;
            }
        }
    } else if (engine instanceof FourSeasonsEngine && engine.winnerColor) {
        winnerColor = engine.winnerColor;
        fourSeasonsWinner = engine.winnerColor;
        isDraw = false;
    } else if (engine instanceof ShogiEngine) {
        if (engine.endReason === 'jishogi_win' || engine.endReason === 'jishogi_draw') {
            const pts = engine.calculateJishogiPoints();
            const result = engine.endReason === 'jishogi_draw'
                ? 'draw'
                : (pts.white >= 24 && pts.black < 24 ? 'white_win' : 'black_win');
            shogiJishogi = {
                result,
                whitePoints: pts.white,
                blackPoints: pts.black,
            };
            if (result === 'draw') {
                isDraw = true;
                winnerColor = null;
                specialReason = 'jishogi_draw';
            } else {
                isDraw = false;
                winnerColor = result === 'white_win' ? 'white' : 'black';
                specialReason = 'jishogi_win';
            }
        } else if (engine.endReason === 'sennichite') {
            isDraw = true;
            winnerColor = null;
            specialReason = 'sennichite';
        } else if (engine.endReason === 'oute_sennichite') {
            isDraw = false;
            winnerColor = currentTurn === 'white' ? 'black' : 'white';
            specialReason = 'oute_sennichite';
        } else if (gameState === 'checkmate') {
            winnerColor = currentTurn === 'white' ? 'black' : 'white';
        }
    } else if (gameState === 'checkmate') {
        const colors = playerColors && playerColors.length > 0 ? playerColors : (['white', 'black'] as PieceColor[]);
        winnerColor = colors.find((c) => c !== currentTurn) ?? (currentTurn === 'white' ? 'black' : 'white');
    }

    if (isDraw) {
        return {
            outcome: 'draw',
            winnerColor: null,
            specialReason,
            chaturajiStakes,
            shogiJishogi,
            fourSeasonsWinner,
        };
    }

    if (gameMode === 'vs_ai') {
        if (winnerColor === playerColor) {
            return {
                outcome: 'player_win',
                winnerColor,
                specialReason,
                chaturajiStakes,
                shogiJishogi,
                fourSeasonsWinner,
            };
        } else {
            return {
                outcome: 'player_loss',
                winnerColor,
                specialReason,
                chaturajiStakes,
                shogiJishogi,
                fourSeasonsWinner,
            };
        }
    }

    return {
        outcome: 'pvp_win',
        winnerColor,
        specialReason,
        chaturajiStakes,
        shogiJishogi,
        fourSeasonsWinner,
    };
}
