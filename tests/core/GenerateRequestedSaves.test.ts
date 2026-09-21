import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { TamerlaneEngine } from '../../src/core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../src/core/engine/ChaturajiEngine';
import { ShogiEngine } from '../../src/core/engine/ShogiEngine';
import * as fs from 'fs';
import * as path from 'path';

describe('Generate all requested save files to Downloads', () => {
    const downloadsDir = 'C:\\Users\\Usuario\\Downloads';

    // Helper to write save file
    const writeSave = (fileName: string, data: any) => {
        const filePath = path.join(downloadsDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        expect(fs.existsSync(filePath)).toBe(true);
    };

    describe('1. Ajedrez Clásico (Classic Chess)', () => {
        it('Save 1: Victoria a punto de ganar vs IA', () => {
            // White to move: Back rank mate in 1 move: Ra1 -> a8#
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 6, y: 7 } },
                { id: 'w_q', name: 'Queen', color: 'white', position: { x: 3, y: 6 } },
                { id: 'w_r', name: 'Rook', color: 'white', position: { x: 0, y: 7 } },
                { id: 'w_p1', name: 'Pawn', color: 'white', position: { x: 5, y: 6 } },
                { id: 'w_p2', name: 'Pawn', color: 'white', position: { x: 6, y: 6 } },
                { id: 'w_p3', name: 'Pawn', color: 'white', position: { x: 7, y: 6 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 7, y: 0 } },
                { id: 'b_p1', name: 'Pawn', color: 'black', position: { x: 6, y: 1 } },
                { id: 'b_p2', name: 'Pawn', color: 'black', position: { x: 7, y: 1 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 142,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;
            expect(engine.state).toBe('playing');

            // Verify Ra1 -> a8 delivers checkmate
            expect(engine.executeMove({ x: 0, y: 7 }, { x: 0, y: 0 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Ajedrez_Victoria_vs_IA.atlas', saveData);
        });

        it('Save 2: Tablas (Ahogado en 1 movimiento) vs IA', () => {
            // White King at f6 (5,2), Queen at e4 (4,4), Black King at h8 (7,0)
            // Move: Queen to g6 (6,2) leaves Black with no legal moves and not in check -> Stalemate
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 5, y: 2 } },
                { id: 'w_q', name: 'Queen', color: 'white', position: { x: 4, y: 4 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 7, y: 0 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 320,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;

            expect(engine.executeMove({ x: 4, y: 4 }, { x: 6, y: 2 })).toBe(true);
            expect(engine.state).toBe('draw');

            writeSave('Ajedrez_Tablas_vs_IA.atlas', saveData);
        });

        it('Save 3: Derrota a punto de perder vs IA', () => {
            // Human White is mated on next move by Black AI: Ra8 -> a1#
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 7, y: 7 } },
                { id: 'w_p1', name: 'Pawn', color: 'white', position: { x: 6, y: 6 } },
                { id: 'w_p2', name: 'Pawn', color: 'white', position: { x: 7, y: 6 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 4, y: 1 } },
                { id: 'b_q', name: 'Queen', color: 'black', position: { x: 3, y: 1 } },
                { id: 'b_r', name: 'Rook', color: 'black', position: { x: 0, y: 0 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'black',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 215,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;

            expect(engine.executeMove({ x: 0, y: 0 }, { x: 0, y: 7 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Ajedrez_Derrota_vs_IA.atlas', saveData);
        });

        it('Save 4: Victoria a punto de ganar vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 6, y: 7 } },
                { id: 'w_q', name: 'Queen', color: 'white', position: { x: 3, y: 6 } },
                { id: 'w_r', name: 'Rook', color: 'white', position: { x: 0, y: 7 } },
                { id: 'w_p1', name: 'Pawn', color: 'white', position: { x: 5, y: 6 } },
                { id: 'w_p2', name: 'Pawn', color: 'white', position: { x: 6, y: 6 } },
                { id: 'w_p3', name: 'Pawn', color: 'white', position: { x: 7, y: 6 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 7, y: 0 } },
                { id: 'b_p1', name: 'Pawn', color: 'black', position: { x: 6, y: 1 } },
                { id: 'b_p2', name: 'Pawn', color: 'black', position: { x: 7, y: 1 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 98,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;
            expect(engine.executeMove({ x: 0, y: 7 }, { x: 0, y: 0 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Ajedrez_Victoria_vs_Humano.atlas', saveData);
        });

        it('Save 5: Tablas vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 5, y: 2 } },
                { id: 'w_q', name: 'Queen', color: 'white', position: { x: 4, y: 4 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 7, y: 0 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 180,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;
            expect(engine.executeMove({ x: 4, y: 4 }, { x: 6, y: 2 })).toBe(true);
            expect(engine.state).toBe('draw');

            writeSave('Ajedrez_Tablas_vs_Humano.atlas', saveData);
        });

        it('Save 6: Derrota a punto de perder (Victoria de Negras) vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'w_k', name: 'King', color: 'white', position: { x: 7, y: 7 } },
                { id: 'w_p1', name: 'Pawn', color: 'white', position: { x: 6, y: 6 } },
                { id: 'w_p2', name: 'Pawn', color: 'white', position: { x: 7, y: 6 } },
                { id: 'b_k', name: 'King', color: 'black', position: { x: 4, y: 1 } },
                { id: 'b_q', name: 'Queen', color: 'black', position: { x: 3, y: 1 } },
                { id: 'b_r', name: 'Rook', color: 'black', position: { x: 0, y: 0 } },
            ];

            const saveData = {
                variantId: 'classic',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'black',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 245,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ClassicChessEngine;
            expect(engine.executeMove({ x: 0, y: 0 }, { x: 0, y: 7 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Ajedrez_Derrota_vs_Humano.atlas', saveData);
        });
    });

    describe('2. Tamerlane Chess', () => {
        it('Save 7: Tamerlane Jaque Mate vs IA', () => {
            // White Shah at (6,8), Rukh 1 at (1,1) cutting rank 1, Rukh 2 at (2,8)
            // Black Shah at (6,0). Moving Rukh 2 from (2,8) to (2,0) delivers mate on rank 0.
            const customPieces = [
                { id: 'w_shah', name: 'Shah', color: 'white', position: { x: 6, y: 8 } },
                { id: 'w_r1', name: 'Rukh', color: 'white', position: { x: 1, y: 1 } },
                { id: 'w_r2', name: 'Rukh', color: 'white', position: { x: 2, y: 8 } },
                { id: 'b_shah', name: 'Shah', color: 'black', position: { x: 6, y: 0 } },
            ];

            const saveData = {
                variantId: 'tamerlane',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 310,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as TamerlaneEngine;
            expect(engine.executeMove({ x: 2, y: 8 }, { x: 2, y: 0 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Tamerlane_Victoria_JaqueMate_vs_IA.atlas', saveData);
        });

        it('Save 8: Tamerlane Jaque Mate vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'w_shah', name: 'Shah', color: 'white', position: { x: 6, y: 8 } },
                { id: 'w_r1', name: 'Rukh', color: 'white', position: { x: 1, y: 1 } },
                { id: 'w_r2', name: 'Rukh', color: 'white', position: { x: 2, y: 8 } },
                { id: 'b_shah', name: 'Shah', color: 'black', position: { x: 6, y: 0 } },
            ];

            const saveData = {
                variantId: 'tamerlane',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 290,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as TamerlaneEngine;
            expect(engine.executeMove({ x: 2, y: 8 }, { x: 2, y: 0 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Tamerlane_Victoria_JaqueMate_vs_Humano.atlas', saveData);
        });

        it('Save 9: Tamerlane Infiltración en la Ciudadela (Tablas)', () => {
            // Black citadel is at (0, 1). White Shah is at (1, 1).
            // White Shah moves to (0, 1) entering opponent Citadel -> Draw
            const customPieces = [
                { id: 'w_shah', name: 'Shah', color: 'white', position: { x: 1, y: 1 } },
                { id: 'b_shah', name: 'Shah', color: 'black', position: { x: 8, y: 4 } },
            ];

            const saveData = {
                variantId: 'tamerlane',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 450,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as TamerlaneEngine;
            expect(engine.executeMove({ x: 1, y: 1 }, { x: 0, y: 1 })).toBe(true);
            expect(engine.state).toBe('draw');

            writeSave('Tamerlane_Tablas_Ciudadela_vs_Humano.atlas', saveData);
        });

        it('Save 10: Tamerlane Derrota vs IA', () => {
            // Black AI ladder mates White Shah
            const customPieces = [
                { id: 'w_shah', name: 'Shah', color: 'white', position: { x: 6, y: 9 } },
                { id: 'b_shah', name: 'Shah', color: 'black', position: { x: 6, y: 1 } },
                { id: 'b_r1', name: 'Rukh', color: 'black', position: { x: 1, y: 8 } },
                { id: 'b_r2', name: 'Rukh', color: 'black', position: { x: 2, y: 1 } },
            ];

            const saveData = {
                variantId: 'tamerlane',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'black',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 380,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as TamerlaneEngine;
            expect(engine.executeMove({ x: 2, y: 1 }, { x: 2, y: 9 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Tamerlane_Derrota_vs_IA.atlas', saveData);
        });

        it('Save 11: Tamerlane Intercambio de Shah con Aliado', () => {
            // White Shah is threatened by Black Rukh on (1, 8) along rank 8.
            // White Shah can swap with adjacent Wazir on (6, 7)
            const customPieces = [
                { id: 'w_shah', name: 'Shah', color: 'white', position: { x: 6, y: 8 } },
                { id: 'w_wazir', name: 'Wazir', color: 'white', position: { x: 6, y: 7 } },
                { id: 'b_shah', name: 'Shah', color: 'black', position: { x: 1, y: 1 } },
                { id: 'b_rukh', name: 'Rukh', color: 'black', position: { x: 1, y: 8 } },
            ];

            const saveData = {
                variantId: 'tamerlane',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 210,
                customPieces
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as TamerlaneEngine;

            expect(engine.isKingInCheck('white')).toBe(true);
            expect(engine.executeMove({ x: 6, y: 8 }, { x: 6, y: 7 })).toBe(true);
            expect(engine.board.getPieceAt(6, 7)?.name).toBe('Shah');
            expect(engine.board.getPieceAt(6, 8)?.name).toBe('Wazir');

            writeSave('Tamerlane_Intercambio_Shah_vs_Humano.atlas', saveData);
        });
    });

    describe('3. Chaturaji', () => {
        it('Save 12: Chaturaji Victoria por Apuestas vs IA', () => {
            // Red has Elephant at (4, 5). Green has King at (4, 7) and Pawn at (3, 6) (avoiding bare king draw initially).
            // Red captures Green King gaining 5 stakes and eliminating last opponent king!
            const customPieces = [
                { id: 'r_k', name: 'ChaturajiKing', color: 'red', position: { x: 7, y: 4 } },
                { id: 'r_e', name: 'ChaturajiElephant', color: 'red', position: { x: 4, y: 5 } },
                { id: 'g_k', name: 'ChaturajiKing', color: 'green', position: { x: 4, y: 7 } },
                { id: 'g_p', name: 'ChaturajiPawn', color: 'green', position: { x: 3, y: 6 } },
            ];

            const saveData = {
                variantId: 'chaturaji',
                gameMode: 'vs_ai',
                playerColor: 'red',
                currentTurn: 'red',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 512,
                customPieces,
                variantOptions: {
                    stakes: { red: 13, green: 4, yellow: 0, blue: 0 },
                    rescuedKings: ['k_y', 'k_b'],
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ChaturajiEngine;
            expect(engine.state).toBe('playing');

            expect(engine.executeMove({ x: 4, y: 5 }, { x: 4, y: 7 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Chaturaji_Victoria_Apuestas_vs_IA.atlas', saveData);
        });

        it('Save 13: Chaturaji Victoria por Apuestas vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'r_k', name: 'ChaturajiKing', color: 'red', position: { x: 7, y: 4 } },
                { id: 'r_e', name: 'ChaturajiElephant', color: 'red', position: { x: 4, y: 5 } },
                { id: 'g_k', name: 'ChaturajiKing', color: 'green', position: { x: 4, y: 7 } },
                { id: 'g_p', name: 'ChaturajiPawn', color: 'green', position: { x: 3, y: 6 } },
            ];

            const saveData = {
                variantId: 'chaturaji',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'red',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 480,
                customPieces,
                variantOptions: {
                    stakes: { red: 13, green: 4, yellow: 0, blue: 0 },
                    rescuedKings: ['k_y', 'k_b'],
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ChaturajiEngine;
            expect(engine.state).toBe('playing');
            expect(engine.executeMove({ x: 4, y: 5 }, { x: 4, y: 7 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Chaturaji_Victoria_Apuestas_vs_Humano.atlas', saveData);
        });

        it('Save 14: Chaturaji Derrota vs IA', () => {
            // Human Red has King at (7, 4) and Pawn at (6, 4). Green AI Elephant at (7, 2) moves to (7, 4) capturing Red King!
            const customPieces = [
                { id: 'r_k', name: 'ChaturajiKing', color: 'red', position: { x: 7, y: 4 } },
                { id: 'r_p', name: 'ChaturajiPawn', color: 'red', position: { x: 6, y: 4 } },
                { id: 'g_k', name: 'ChaturajiKing', color: 'green', position: { x: 3, y: 7 } },
                { id: 'g_e', name: 'ChaturajiElephant', color: 'green', position: { x: 7, y: 2 } },
            ];

            const saveData = {
                variantId: 'chaturaji',
                gameMode: 'vs_ai',
                playerColor: 'red',
                currentTurn: 'green',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 430,
                customPieces,
                variantOptions: {
                    stakes: { red: 2, green: 14, yellow: 0, blue: 0 },
                    rescuedKings: ['k_y', 'k_b'],
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ChaturajiEngine;
            expect(engine.state).toBe('playing');

            expect(engine.executeMove({ x: 7, y: 2 }, { x: 7, y: 4 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Chaturaji_Derrota_vs_IA.atlas', saveData);
        });

        it('Save 15: Chaturaji Tablas por Apuestas Empatadas (PvP)', () => {
            // Red and Green tied at 8 stakes. Both have King and 1 piece alive.
            const customPieces = [
                { id: 'r_k', name: 'ChaturajiKing', color: 'red', position: { x: 7, y: 4 } },
                { id: 'r_p', name: 'ChaturajiPawn', color: 'red', position: { x: 6, y: 4 } },
                { id: 'g_k', name: 'ChaturajiKing', color: 'green', position: { x: 3, y: 7 } },
                { id: 'g_p', name: 'ChaturajiPawn', color: 'green', position: { x: 3, y: 6 } },
            ];

            const saveData = {
                variantId: 'chaturaji',
                gameMode: 'pvp',
                playerColor: 'red',
                currentTurn: 'red',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 600,
                customPieces,
                variantOptions: {
                    stakes: { red: 8, green: 8, yellow: 0, blue: 0 },
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ChaturajiEngine;
            expect(engine.stakes.red).toBe(8);
            expect(engine.stakes.green).toBe(8);

            writeSave('Chaturaji_Tablas_Apuestas_vs_Humano.atlas', saveData);
        });
    });

    describe('4. Shogi', () => {
        it('Save 16: Shogi Victoria Jaque Mate con Komadai vs IA', () => {
            const customPieces = [
                { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
                { id: 'w_d', name: 'ShogiDragon', color: 'white', position: { x: 1, y: 1 } },
                { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } }
            ];

            const saveData = {
                variantId: 'shogi',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 195,
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
            expect(engine.dropPiece('ShogiGold', { x: 0, y: 1 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Shogi_Victoria_JaqueMate_vs_IA.atlas', saveData);
        });

        it('Save 17: Shogi Victoria Jaque Mate vs Humano (PvP)', () => {
            const customPieces = [
                { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
                { id: 'w_d', name: 'ShogiDragon', color: 'white', position: { x: 1, y: 1 } },
                { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } }
            ];

            const saveData = {
                variantId: 'shogi',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 150,
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
            expect(engine.dropPiece('ShogiGold', { x: 0, y: 1 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Shogi_Victoria_JaqueMate_vs_Humano.atlas', saveData);
        });

        it('Save 18: Shogi Derrota a punto de perder vs IA', () => {
            // Human White King at (4, 8). Black AI has Dragon at (5, 7) and Gold in hand.
            // Black AI drops Gold at (4, 7) delivering checkmate to White!
            const customPieces = [
                { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } },
                { id: 'b_d', name: 'ShogiDragon', color: 'black', position: { x: 5, y: 7 } },
                { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 4, y: 0 } }
            ];

            const saveData = {
                variantId: 'shogi',
                gameMode: 'vs_ai',
                playerColor: 'white',
                currentTurn: 'black',
                aiDifficulty: 'hard',
                useDiceRule: false,
                time: 280,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: [],
                        black: ['ShogiGold']
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ShogiEngine;
            expect(engine.dropPiece('ShogiGold', { x: 4, y: 7 })).toBe(true);
            expect(engine.state).toBe('checkmate');

            writeSave('Shogi_Derrota_vs_IA.atlas', saveData);
        });

        it('Save 19: Shogi Impasse (Jishogi) Tablas vs Humano', () => {
            // Both kings crossed into promotion camps and reached 24+ points
            const customPieces = [
                { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 1 } },
                { id: 'w_r1', name: 'ShogiRook', color: 'white', position: { x: 3, y: 1 } },
                { id: 'w_b1', name: 'ShogiBishop', color: 'white', position: { x: 5, y: 1 } },
                { id: 'w_g1', name: 'ShogiGold', color: 'white', position: { x: 2, y: 1 } },
                { id: 'w_g2', name: 'ShogiGold', color: 'white', position: { x: 6, y: 1 } },
                { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 4, y: 7 } },
                { id: 'b_r1', name: 'ShogiRook', color: 'black', position: { x: 3, y: 7 } },
                { id: 'b_b1', name: 'ShogiBishop', color: 'black', position: { x: 5, y: 7 } },
                { id: 'b_g1', name: 'ShogiGold', color: 'black', position: { x: 2, y: 7 } },
                { id: 'b_g2', name: 'ShogiGold', color: 'black', position: { x: 6, y: 7 } },
            ];

            const saveData = {
                variantId: 'shogi',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                aiDifficulty: 'medium',
                useDiceRule: false,
                time: 600,
                customPieces,
                variantOptions: {
                    inHand: {
                        white: ['ShogiSilver', 'ShogiSilver', 'ShogiKnight', 'ShogiKnight', 'ShogiLance', 'ShogiLance'],
                        black: ['ShogiSilver', 'ShogiSilver', 'ShogiKnight', 'ShogiKnight', 'ShogiLance', 'ShogiLance']
                    }
                }
            };

            const store = useGameStore.getState();
            expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
            const engine = useGameStore.getState().engine as ShogiEngine;

            expect(engine.canDeclareJishogi()).toBe(true);
            const res = engine.declareJishogi();
            expect(res.result).toBe('draw');
            expect(engine.state).toBe('draw');

            writeSave('Shogi_Tablas_Jishogi_vs_Humano.atlas', saveData);
        });
    });
});
