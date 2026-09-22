import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { ShogiEngine } from '../../src/core/engine/ShogiEngine';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Generate and verify Shogi save files', () => {
    const downloadsDir = os.tmpdir();

    it('Scenario 1: Jaque Mate (Checkmate)', () => {
        // Setup: Black King at (0, 0), White Dragon at (1, 1), White King at (4, 8)
        // White has Gold in hand.
        // Dropping Gold at (0, 1) or moving Dragon to (0, 1) delivers checkmate.
        const customPieces = [
            { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
            { id: 'w_d', name: 'ShogiDragon', color: 'white', position: { x: 1, y: 1 } },
            { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } }
        ];

        for (const mode of ['pass_and_play', 'vs_ai'] as const) {
            const saveData = {
                variantId: 'shogi',
                gameMode: mode,
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 60,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: ['ShogiGold'],
                        black: []
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);

            const engine = useGameStore.getState().engine as ShogiEngine;
            expect(engine).toBeInstanceOf(ShogiEngine);
            expect(engine.state).toBe('playing');

            // White drops Gold at (0, 1) -> Deliver Checkmate
            expect(engine.dropPiece('ShogiGold', { x: 0, y: 1 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            const fileName = mode === 'pass_and_play'
                ? 'Shogi_JaqueMate_vs_Humano.atlas'
                : 'Shogi_JaqueMate_vs_IA.atlas';
            fs.writeFileSync(path.join(downloadsDir, fileName), JSON.stringify(saveData, null, 2), 'utf8');
        }
    });

    it('Scenario 2: Ahogado (Stalemate / Win by Inmovilidad)', () => {
        // In Shogi, if a player is not in check but has no legal moves (stalemate), they lose immediately.
        // Setup:
        // Black King at (0, 0)
        // White Gold at (1, 2) covering (0, 1) and (1, 1)
        // White Silver at (2, 0) covering (1, 0)
        // White King at (4, 8)
        // Black King at (0, 0) is NOT attacked, but cannot move to (0, 1), (1, 0), or (1, 1).
        // Black has no pieces in hand.
        // Turn: Black.
        // Game state upon load: 'checkmate' (Black is mated/defeated by stalemate rule).
        const customPieces = [
            { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
            { id: 'w_n1', name: 'ShogiKnight', color: 'white', position: { x: 0, y: 2 } },
            { id: 'w_n2', name: 'ShogiKnight', color: 'white', position: { x: 1, y: 3 } },
            { id: 'w_n3', name: 'ShogiKnight', color: 'white', position: { x: 2, y: 3 } },
            { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } }
        ];

        for (const mode of ['pass_and_play', 'vs_ai'] as const) {
            const saveData = {
                variantId: 'shogi',
                gameMode: mode,
                playerColor: 'white',
                currentTurn: 'black',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 120,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: [],
                        black: []
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);

            const engine = useGameStore.getState().engine as ShogiEngine;
            expect(engine).toBeInstanceOf(ShogiEngine);
            expect(engine.isKingInCheck('black')).toBe(false);
            expect(engine.state).toBe('checkmate'); // Defeat for Black

            const fileName = mode === 'pass_and_play'
                ? 'Shogi_Ahogado_vs_Humano.atlas'
                : 'Shogi_Ahogado_vs_IA.atlas';
            fs.writeFileSync(path.join(downloadsDir, fileName), JSON.stringify(saveData, null, 2), 'utf8');
        }
    });

    it('Scenario 3: Uchifuzume (Illegal Pawn-Drop Checkmate)', () => {
        // Setup:
        // Black King at (0, 0)
        // White Dragon at (1, 2) controlling (1, 0), (1, 1), (0, 2) and defending (0, 1)
        // White King at (4, 8)
        // White has Pawn and Gold in hand.
        // Dropping Pawn at (0, 1) or any square that results in mate/ahogado is forbidden by Uchifuzume!
        // Dropping Gold at (0, 1) is legal (Uchifuzume only applies to Pawns)!
        const customPieces = [
            { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
            { id: 'w_d', name: 'ShogiDragon', color: 'white', position: { x: 1, y: 2 } },
            { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } }
        ];

        for (const mode of ['pass_and_play', 'vs_ai'] as const) {
            const saveData = {
                variantId: 'shogi',
                gameMode: mode,
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 90,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: ['ShogiPawn', 'ShogiGold'],
                        black: []
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);

            const engine = useGameStore.getState().engine as ShogiEngine;
            expect(engine).toBeInstanceOf(ShogiEngine);

            // Pawn drops that leave opponent with 0 moves (mate or ahogado) must be rejected!
            const pawnDrops = engine.getLegalDrops('ShogiPawn', 'white');
            expect(pawnDrops.some(p => p.x === 0 && p.y === 1)).toBe(false);
            expect(engine.dropPiece('ShogiPawn', { x: 0, y: 1 })).toBe(false);

            // But Gold drop at (0, 1) is legal (Uchifuzume only applies to Pawns)!
            const goldDrops = engine.getLegalDrops('ShogiGold', 'white');
            expect(goldDrops.some(p => p.x === 0 && p.y === 1)).toBe(true);

            const fileName = mode === 'pass_and_play'
                ? 'Shogi_Uchifuzume_vs_Humano.atlas'
                : 'Shogi_Uchifuzume_vs_IA.atlas';
            fs.writeFileSync(path.join(downloadsDir, fileName), JSON.stringify(saveData, null, 2), 'utf8');
        }
    });

    it('Scenario 4: Sennichite (Fourfold Repetition)', () => {
        // Setup:
        // Play 2 full cycles plus 1 half cycle between Rooks
        const store = useGameStore.getState();
        store.initGame('shogi', 'pvp', 'white', 'medium', false);

        // Cycle moves:
        for (let cycle = 0; cycle < 2; cycle++) {
            store.selectSquare({ x: 7, y: 7 });
            store.selectSquare({ x: 6, y: 7 });
            store.selectSquare({ x: 1, y: 1 });
            store.selectSquare({ x: 2, y: 1 });
            store.selectSquare({ x: 6, y: 7 });
            store.selectSquare({ x: 7, y: 7 });
            store.selectSquare({ x: 2, y: 1 });
            store.selectSquare({ x: 1, y: 1 });
        }

        // Now move White Rook (7, 7) -> (6, 7) and Black Rook (1, 1) -> (2, 1)
        store.selectSquare({ x: 7, y: 7 });
        store.selectSquare({ x: 6, y: 7 });
        store.selectSquare({ x: 1, y: 1 });
        store.selectSquare({ x: 2, y: 1 });

        // Save at this state: 1 move away from 4th repetition!
        // White plays (6, 7) -> (7, 7), Black plays (2, 1) -> (1, 1) -> triggers Sennichite!
        const savedJson = store.saveGame();
        expect(savedJson).toBeDefined();

        for (const mode of ['pass_and_play', 'vs_ai'] as const) {
            const parsed = JSON.parse(savedJson!);
            parsed.gameMode = mode;
            const fileName = mode === 'pass_and_play'
                ? 'Shogi_Sennichite_vs_Humano.atlas'
                : 'Shogi_Sennichite_vs_IA.atlas';
            fs.writeFileSync(path.join(downloadsDir, fileName), JSON.stringify(parsed, null, 2), 'utf8');
        }
    });

    it('Scenario 5: Jishogi (Impasse / 24-point rule)', () => {
        const customPieces = [
            { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 1 } },
            { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 4, y: 7 } }
        ];

        for (const mode of ['pass_and_play', 'vs_ai'] as const) {
            const saveData = {
                variantId: 'shogi',
                gameMode: mode,
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 150,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: ['ShogiRook', 'ShogiRook', ...Array(14).fill('ShogiPawn')],
                        black: ['ShogiBishop', 'ShogiBishop', ...Array(14).fill('ShogiPawn')]
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);

            const engine = useGameStore.getState().engine as ShogiEngine;
            expect(engine).toBeInstanceOf(ShogiEngine);
            expect(engine.canDeclareJishogi()).toBe(true);

            const points = engine.calculateJishogiPoints();
            expect(points.white).toBe(24);
            expect(points.black).toBe(24);

            const fileName = mode === 'pass_and_play'
                ? 'Shogi_Jishogi_vs_Humano.atlas'
                : 'Shogi_Jishogi_vs_IA.atlas';
            fs.writeFileSync(path.join(downloadsDir, fileName), JSON.stringify(saveData, null, 2), 'utf8');
        }
    });
});
