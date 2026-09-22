import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { CourierEngine } from '../../src/core/engine/CourierEngine';
import { MakrukEngine } from '../../src/core/engine/MakrukEngine';
import { OukChaktrangEngine } from '../../src/core/engine/OukChaktrangEngine';
import { ShogiEngine } from '../../src/core/engine/ShogiEngine';
import { SittuyinEngine } from '../../src/core/engine/SittuyinEngine';
import { ShatranjEngine } from '../../src/core/engine/ShatranjEngine';
import { ChaturangaEngine } from '../../src/core/engine/ChaturangaEngine';
import * as fs from 'fs';
import * as path from 'path';

describe('Generate saves vs Hard AI close to winning for Fairy-Stockfish variants', () => {
    const downloadsDir = 'C:\\Users\\Usuario\\Downloads';

    const writeSave = (fileName: string, data: any) => {
        const filePath = path.join(downloadsDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        expect(fs.existsSync(filePath)).toBe(true);
    };

    it('1. Classic Chess: Ajedrez_Clasico_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'King', color: 'white', position: { x: 6, y: 7 } },
            { id: 'w_p1', name: 'Pawn', color: 'white', position: { x: 5, y: 6 } },
            { id: 'w_p2', name: 'Pawn', color: 'white', position: { x: 6, y: 6 } },
            { id: 'w_p3', name: 'Pawn', color: 'white', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'King', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r', name: 'Rook', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_q', name: 'Queen', color: 'black', position: { x: 4, y: 5 } },
        ];

        const saveData = {
            variantId: 'classic',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 210,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as ClassicChessEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/8/8/8/8/4q3/5PPP/6K1 b');

        // Black Rook a8 -> a1 delivers checkmate
        expect(engine.executeMove({ x: 0, y: 0 }, { x: 0, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Ajedrez_Clasico_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('2. Courier Chess: Ajedrez_Courier_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'CourierKing', color: 'white', position: { x: 11, y: 7 } },
            { id: 'w_p1', name: 'CourierPawn', color: 'white', position: { x: 1, y: 5 } },
            { id: 'w_p2', name: 'CourierPawn', color: 'white', position: { x: 8, y: 5 } },
            { id: 'w_n', name: 'Knight', color: 'white', position: { x: 3, y: 4 } },

            { id: 'b_k', name: 'CourierKing', color: 'black', position: { x: 5, y: 2 } },
            { id: 'b_r1', name: 'Rook', color: 'black', position: { x: 1, y: 6 } },
            { id: 'b_r2', name: 'Rook', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_c', name: 'Courier', color: 'black', position: { x: 4, y: 3 } },
            { id: 'b_p1', name: 'CourierPawn', color: 'black', position: { x: 2, y: 3 } },
            { id: 'b_p2', name: 'CourierPawn', color: 'black', position: { x: 7, y: 3 } },
        ];

        const saveData = {
            variantId: 'courier',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 480,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as CourierEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r11/12/5k6/2p1e2p4/3N8/1P6P3/1r10/11K b');

        // Black Rook a8 -> a1 (0,0 -> 0,7) delivers checkmate
        expect(engine.executeMove({ x: 0, y: 0 }, { x: 0, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Ajedrez_Courier_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('3. Makruk: Makruk_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'Khun', color: 'white', position: { x: 7, y: 7 } },
            { id: 'w_p1', name: 'Bia', color: 'white', position: { x: 5, y: 6 } },
            { id: 'w_p2', name: 'Bia', color: 'white', position: { x: 6, y: 6 } },
            { id: 'w_p3', name: 'Bia', color: 'white', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'Khun', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r1', name: 'Ruea', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r2', name: 'Ruea', color: 'black', position: { x: 1, y: 1 } },
        ];

        const saveData = {
            variantId: 'makruk',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 320,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as MakrukEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/1r6/8/8/8/8/5PPP/7K b');

        // Black Ruea b7 -> b1 (1,1 -> 1,7) delivers checkmate
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 1, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Makruk_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('4. Ouk Chaktrang: Ouk_Chaktrang_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'Khun', color: 'white', position: { x: 7, y: 7 } },
            { id: 'w_p1', name: 'Bia', color: 'white', position: { x: 5, y: 6 } },
            { id: 'w_p2', name: 'Bia', color: 'white', position: { x: 6, y: 6 } },
            { id: 'w_p3', name: 'Bia', color: 'white', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'Khun', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r1', name: 'Ruea', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r2', name: 'Ruea', color: 'black', position: { x: 1, y: 1 } },
        ];

        const saveData = {
            variantId: 'ouk_chaktrang',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 340,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as OukChaktrangEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/1r6/8/8/8/8/5PPP/7K b');

        // Black Ruea b7 -> b1 (1,1 -> 1,7) delivers checkmate
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 1, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Ouk_Chaktrang_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('5. Shogi: Shogi_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'ShogiKing', color: 'white', position: { x: 4, y: 8 } },
            { id: 'w_p1', name: 'ShogiPawn', color: 'white', position: { x: 3, y: 7 } },
            { id: 'w_p2', name: 'ShogiPawn', color: 'white', position: { x: 5, y: 7 } },
            { id: 'w_p3', name: 'ShogiPawn', color: 'white', position: { x: 3, y: 8 } },
            { id: 'w_p4', name: 'ShogiPawn', color: 'white', position: { x: 5, y: 8 } },
            { id: 'b_k', name: 'ShogiKing', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r', name: 'ShogiRook', color: 'black', position: { x: 4, y: 0 } },
            { id: 'b_g', name: 'ShogiGold', color: 'black', position: { x: 4, y: 6 } },
        ];

        const saveData = {
            variantId: 'shogi',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 410,
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
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('k3r4/9/9/9/9/9/4g4/3P1P3/3PKP3[] b');

        // Black Gold (4,6) -> (4,7) delivers checkmate
        expect(engine.executeMove({ x: 4, y: 6 }, { x: 4, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Shogi_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('6. Sittuyin: Sittuyin_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'r_k', name: 'Mingyi', color: 'red', position: { x: 7, y: 7 } },
            { id: 'r_p1', name: 'Ne', color: 'red', position: { x: 5, y: 6 } },
            { id: 'r_p2', name: 'Ne', color: 'red', position: { x: 6, y: 6 } },
            { id: 'r_p3', name: 'Ne', color: 'red', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'Mingyi', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r1', name: 'Yahhta', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r2', name: 'Yahhta', color: 'black', position: { x: 1, y: 1 } },
        ];

        const saveData = {
            variantId: 'sittuyin',
            gameMode: 'vs_ai',
            playerColor: 'red',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 390,
            customPieces,
            variantOptions: {
                deployStage: 'completed',
                deployPool: { red: [], black: [] }
            }
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as SittuyinEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/1r6/8/8/8/8/5PPP/7K[] b');

        // Black Yahhta (1,1) -> (1,7) delivers checkmate
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 1, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Sittuyin_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('7. Shatranj: Shatranj_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'Shah', color: 'white', position: { x: 7, y: 7 } },
            { id: 'w_p1', name: 'Sarbaz', color: 'white', position: { x: 5, y: 6 } },
            { id: 'w_p2', name: 'Sarbaz', color: 'white', position: { x: 6, y: 6 } },
            { id: 'w_p3', name: 'Sarbaz', color: 'white', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'Shah', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r1', name: 'Rukh', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r2', name: 'Rukh', color: 'black', position: { x: 1, y: 1 } },
        ];

        const saveData = {
            variantId: 'shatranj',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 290,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as ShatranjEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/1r6/8/8/8/8/5PPP/7K b');

        // Black Rukh (1,1) -> (1,7) delivers checkmate
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 1, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Shatranj_Derrota_vs_IA_Fuerte.atlas', saveData);
    });

    it('8. Chaturanga: Chaturanga_Derrota_vs_IA_Fuerte.atlas', () => {
        const customPieces = [
            { id: 'w_k', name: 'Raja', color: 'white', position: { x: 7, y: 7 } },
            { id: 'w_p1', name: 'Padati', color: 'white', position: { x: 5, y: 6 } },
            { id: 'w_p2', name: 'Padati', color: 'white', position: { x: 6, y: 6 } },
            { id: 'w_p3', name: 'Padati', color: 'white', position: { x: 7, y: 6 } },
            { id: 'b_k', name: 'Raja', color: 'black', position: { x: 7, y: 0 } },
            { id: 'b_r1', name: 'Ratha', color: 'black', position: { x: 0, y: 0 } },
            { id: 'b_r2', name: 'Ratha', color: 'black', position: { x: 1, y: 1 } },
        ];

        const saveData = {
            variantId: 'chaturanga',
            gameMode: 'vs_ai',
            playerColor: 'white',
            currentTurn: 'black',
            aiDifficulty: 'hard',
            useDiceRule: false,
            time: 270,
            customPieces
        };

        const store = useGameStore.getState();
        expect(store.loadGame(JSON.stringify(saveData))).toBe(true);
        const engine = useGameStore.getState().engine as ChaturangaEngine;
        expect(engine.state).toBe('playing');
        expect(engine.currentTurn).toBe('black');
        expect(engine.getFen()).toContain('r6k/1r6/8/8/8/8/5PPP/7K b');

        // Black Ratha (1,1) -> (1,7) delivers checkmate
        expect(engine.executeMove({ x: 1, y: 1 }, { x: 1, y: 7 })).toBe(true);
        expect(engine.state).toBe('checkmate');

        writeSave('Chaturanga_Derrota_vs_IA_Fuerte.atlas', saveData);
    });
});
