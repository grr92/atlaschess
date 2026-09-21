import { describe, it, expect } from 'vitest';
import { getGameOutcome } from '../../src/utils/gameOverUtils';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import type { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import type { FourSeasonsEngine } from '../../src/core/engine/FourSeasonsEngine';

describe('GameOverLogic - getGameOutcome', () => {
    describe('vs_ai mode', () => {
        it('should detect player_win when human player checkmates AI', () => {
            // Player is white. Current turn at checkmate is black (black has been mated).
            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'black',
                engine: null,
                playerColors: ['white', 'black'],
            });

            expect(result.outcome).toBe('player_win');
            expect(result.winnerColor).toBe('white');
        });

        it('should detect player_loss when AI checkmates human player', () => {
            // Player is white. Current turn at checkmate is white (white has been mated).
            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                engine: null,
                playerColors: ['white', 'black'],
            });

            expect(result.outcome).toBe('player_loss');
            expect(result.winnerColor).toBe('black');
        });

        it('should detect draw in vs_ai mode', () => {
            const result = getGameOutcome({
                gameState: 'draw',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                engine: null,
                playerColors: ['white', 'black'],
            });

            expect(result.outcome).toBe('draw');
            expect(result.winnerColor).toBeNull();
        });
    });

    describe('pvp mode (1v1 local)', () => {
        it('should declare correct winner color in 2-player chess', () => {
            // White mated Black -> current turn is Black
            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'black',
                engine: null,
                playerColors: ['white', 'black'],
            });

            expect(result.outcome).toBe('pvp_win');
            expect(result.winnerColor).toBe('white');
        });

        it('should handle custom variant colors (e.g. Xiangqi red/black)', () => {
            // Red mated Black -> current turn is Black
            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'black',
                engine: null,
                playerColors: ['red', 'black'],
            });

            expect(result.outcome).toBe('pvp_win');
            expect(result.winnerColor).toBe('red');
        });

        it('should declare draw in pvp mode', () => {
            const result = getGameOutcome({
                gameState: 'draw',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'black',
                engine: null,
                playerColors: ['white', 'black'],
            });

            expect(result.outcome).toBe('draw');
            expect(result.winnerColor).toBeNull();
        });
    });

    describe('Multiplayer / Specialty Engines', () => {
        it('should recognize Four Seasons winner', () => {
            const fsEngine = VariantRegistry.createEngine('four_seasons') as FourSeasonsEngine;
            fsEngine.winnerColor = 'green';

            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'red',
                engine: fsEngine,
                playerColors: ['green', 'red', 'black', 'white'],
            });

            expect(result.outcome).toBe('pvp_win');
            expect(result.winnerColor).toBe('green');
        });

        it('should recognize Chaturaji match winner and stakes', () => {
            const chaturaji = VariantRegistry.createEngine('chaturaji') as ChaturajiEngine;
            chaturaji.stakes = { red: 14, green: 4, yellow: 0, blue: 2 };

            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'vs_ai',
                playerColor: 'red',
                currentTurn: 'blue',
                engine: chaturaji,
                playerColors: ['red', 'green', 'yellow', 'blue'],
            });

            expect(result.outcome).toBe('player_win');
            expect(result.winnerColor).toBe('red');
            expect(result.specialReason).toBe('14');
            expect(result.chaturajiStakes?.winner).toBe('red');
            expect(result.chaturajiStakes?.maxStakes).toBe(14);
        });

        it('should identify AI player with most stakes on player defeat in Chaturaji', () => {
            const chaturaji = VariantRegistry.createEngine('chaturaji') as ChaturajiEngine;
            chaturaji.stakes = { red: 3, green: 15, yellow: 0, blue: 0 };

            const result = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'vs_ai',
                playerColor: 'red',
                currentTurn: 'red',
                engine: chaturaji,
                playerColors: ['red', 'green', 'yellow', 'blue'],
            });

            expect(result.outcome).toBe('player_loss');
            expect(result.winnerColor).toBe('green');
            expect(result.chaturajiStakes?.winner).toBe('green');
            expect(result.chaturajiStakes?.maxStakes).toBe(15);
        });

        it('should award win by stakes even when board gameState is draw (Bare King)', () => {
            const chaturaji = VariantRegistry.createEngine('chaturaji') as ChaturajiEngine;
            chaturaji.stakes = { red: 12, green: 4, yellow: 0, blue: 0 };

            const result = getGameOutcome({
                gameState: 'draw',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'green',
                engine: chaturaji,
                playerColors: ['red', 'green', 'yellow', 'blue'],
            });

            expect(result.outcome).toBe('pvp_win');
            expect(result.winnerColor).toBe('red');
            expect(result.chaturajiStakes?.winner).toBe('red');
            expect(result.chaturajiStakes?.maxStakes).toBe(12);
        });

        it('should recognize Chaturaji tied stakes as draw', () => {
            const chaturaji = VariantRegistry.createEngine('chaturaji') as ChaturajiEngine;
            chaturaji.stakes = { red: 8, green: 8, yellow: 0, blue: 0 };

            const result = getGameOutcome({
                gameState: 'draw',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'red',
                engine: chaturaji,
                playerColors: ['red', 'green', 'yellow', 'blue'],
            });

            expect(result.outcome).toBe('draw');
            expect(result.winnerColor).toBeNull();
            expect(result.specialReason).toBe('8');
            expect(result.chaturajiStakes?.isTie).toBe(true);
            expect(result.chaturajiStakes?.tiedWinners).toEqual(['red', 'green']);
        });

        it('should handle Shogi Jishogi draw and win evaluation', () => {
            const shogi = VariantRegistry.createEngine('shogi') as any;
            shogi.endReason = 'jishogi_draw';
            shogi.calculateJishogiPoints = () => ({ white: 26, black: 25 });

            const drawResult = getGameOutcome({
                gameState: 'draw',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                engine: shogi,
                playerColors: ['white', 'black'],
            });

            expect(drawResult.outcome).toBe('draw');
            expect(drawResult.shogiJishogi?.result).toBe('draw');
            expect(drawResult.shogiJishogi?.whitePoints).toBe(26);

            shogi.endReason = 'jishogi_win';
            shogi.calculateJishogiPoints = () => ({ white: 27, black: 21 });

            const winResult = getGameOutcome({
                gameState: 'checkmate',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'black',
                engine: shogi,
                playerColors: ['white', 'black'],
            });

            expect(winResult.outcome).toBe('player_win');
            expect(winResult.winnerColor).toBe('white');
            expect(winResult.shogiJishogi?.result).toBe('white_win');
        });
    });
});
