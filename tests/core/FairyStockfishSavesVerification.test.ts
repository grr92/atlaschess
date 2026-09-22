import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

describe('Verify Fairy-Stockfish calculation on all 8 generated saves', () => {
    const downloadsDir = 'C:\\Users\\Usuario\\Downloads';
    const binaryPath = path.resolve('bin', 'win', 'fairy-stockfish.exe');

    const evaluateSaveWithEngine = (variant: string, fen: string): Promise<{ bestmove: string, scoreMate?: number }> => {
        return new Promise((resolve, reject) => {
            const proc = spawn(binaryPath, [], { stdio: ['pipe', 'pipe', 'pipe'] });
            const rl = readline.createInterface({ input: proc.stdout });

            let scoreMate: number | undefined = undefined;
            let bestmove = '';

            rl.on('line', (line) => {
                const trimmed = line.trim();
                if (trimmed.includes('score mate')) {
                    const match = trimmed.match(/score mate (-?\d+)/);
                    if (match) {
                        scoreMate = parseInt(match[1], 10);
                    }
                }
                if (trimmed.startsWith('bestmove')) {
                    const parts = trimmed.split(' ');
                    bestmove = parts[1];
                    proc.kill();
                    resolve({ bestmove, scoreMate });
                }
            });

            proc.stdin.write('uci\n');
            proc.stdin.write(`setoption name UCI_Variant value ${variant}\n`);
            proc.stdin.write('isready\n');
            proc.stdin.write(`position fen ${fen}\n`);
            proc.stdin.write('go movetime 1000\n');

            setTimeout(() => {
                proc.kill();
                reject(new Error(`Timeout evaluating ${variant} with FEN: ${fen}`));
            }, 6000);
        });
    };

    it('should calculate mate in 1 for all 8 save files using Fairy-Stockfish', async () => {
        const saves = [
            { file: 'Ajedrez_Clasico_Derrota_vs_IA_Fuerte.atlas', variant: 'chess', expectedMove: 'a8a1' },
            { file: 'Ajedrez_Courier_Derrota_vs_IA_Fuerte.atlas', variant: 'courier', expectedMove: 'a8a1' },
            { file: 'Makruk_Derrota_vs_IA_Fuerte.atlas', variant: 'makruk', expectedMove: 'b7b1' },
            { file: 'Ouk_Chaktrang_Derrota_vs_IA_Fuerte.atlas', variant: 'cambodian', expectedMove: 'b7b1' },
            { file: 'Shogi_Derrota_vs_IA_Fuerte.atlas', variant: 'shogi', expectedMove: 'e3e2' },
            { file: 'Sittuyin_Derrota_vs_IA_Fuerte.atlas', variant: 'sittuyin', expectedMove: 'b7b1' },
            { file: 'Shatranj_Derrota_vs_IA_Fuerte.atlas', variant: 'shatranj', expectedMove: 'b7b1' },
            { file: 'Chaturanga_Derrota_vs_IA_Fuerte.atlas', variant: 'chaturanga', expectedMove: 'b7b1' },
        ];

        for (const save of saves) {
            const raw = fs.readFileSync(path.join(downloadsDir, save.file), 'utf8');
            const data = JSON.parse(raw);
            expect(data.gameMode).toBe('vs_ai');
            expect(data.currentTurn).toBe('black');
            expect(data.aiDifficulty).toBe('hard');

            // Get FEN from engine load
            const { useGameStore } = await import('../../src/store/useGameStore');
            useGameStore.getState().loadGame(raw);
            const fen = (useGameStore.getState().engine as any).getFen();

            const result = await evaluateSaveWithEngine(save.variant, fen);
            console.log(`[${save.file}] -> bestmove: ${result.bestmove}, scoreMate: ${result.scoreMate}`);
            expect(result.bestmove).toBe(save.expectedMove);
            expect(result.scoreMate).toBe(1);
        }
    }, 45000);
});
