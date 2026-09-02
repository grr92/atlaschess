import { app } from 'electron';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import readline from 'node:readline';
import { EventEmitter } from 'node:events';

export interface CalculateMoveOptions {
    fen?: string;
    moves?: string[];
    movetime?: number;
    depth?: number;
    skillLevel?: number;
}

export class FairyStockfishService extends EventEmitter {
    private process: ChildProcessWithoutNullStreams | null = null;
    private readlineInterface: readline.Interface | null = null;
    private isInitialized = false;
    private isTerminating = false;
    private moveResolver: ((bestMove: string) => void) | null = null;
    private readyResolver: (() => void) | null = null;
    private uciResolver: (() => void) | null = null;

    constructor() {
        super();
    }

    /**
     * Resolves the executable path according to the OS and package state.
     */
    private getBinaryPath(): string {
        const basePath = app.isPackaged
            ? path.join(process.resourcesPath, 'bin')
            : path.join(app.getAppPath(), 'bin');

        let platformDir = 'win';
        let binaryName = 'fairy-stockfish.exe';

        if (process.platform === 'darwin') {
            platformDir = 'mac';
            binaryName = 'fairy-stockfish';
        } else if (process.platform === 'linux') {
            platformDir = 'linux';
            binaryName = 'fairy-stockfish';
        }

        // Try platform specific path first (e.g. bin/win/fairy-stockfish.exe)
        const specificPath = path.join(basePath, platformDir, binaryName);
        if (fs.existsSync(specificPath)) {
            return specificPath;
        }

        // Fallback to direct bin path (e.g. bin/fairy-stockfish.exe)
        const directPath = path.join(basePath, binaryName);
        if (fs.existsSync(directPath)) {
            return directPath;
        }

        throw new Error(`Fairy-Stockfish binary not found at: ${specificPath} or ${directPath}`);
    }

    /**
     * Resolves the path to the optional custom variants.ini file.
     */
    private getVariantsPath(): string | null {
        const basePath = app.isPackaged
            ? path.join(process.resourcesPath, 'bin')
            : path.join(app.getAppPath(), 'bin');

        const variantsPath = path.join(basePath, 'variants.ini');
        return fs.existsSync(variantsPath) ? variantsPath : null;
    }

    /**
     * Spawns the Fairy-Stockfish child process and configures line listening.
     */
    public async initEngine(): Promise<boolean> {
        if (this.process && this.isInitialized) {
            return true;
        }

        this.isTerminating = false;
        const binaryPath = this.getBinaryPath();

        this.process = spawn(binaryPath, [], {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
        });

        // Prevent unhandled EPIPE crashes on broken pipes
        this.process.stdin.on('error', (err: any) => {
            if (err.code !== 'EPIPE' && err.code !== 'ERR_STREAM_DESTROYED') {
                console.error('[Fairy-Stockfish STDIN error]:', err);
            }
        });

        this.process.stdout.on('error', (err: any) => {
            console.error('[Fairy-Stockfish STDOUT error]:', err);
        });

        this.process.on('error', (err: any) => {
            console.error('[Fairy-Stockfish Process error]:', err);
        });

        this.readlineInterface = readline.createInterface({
            input: this.process.stdout,
            terminal: false,
        });

        this.readlineInterface.on('line', (line: string) => {
            this.handleEngineOutput(line.trim());
        });

        this.process.stderr.on('data', (data: Buffer) => {
            console.error('[Fairy-Stockfish STDERR]:', data.toString());
        });

        this.process.on('close', (_code: number | null) => {
            this.isInitialized = false;
            this.process = null;
        });

        // Initialize UCI handshake
        await this.sendUciHandshake();

        // Load custom variants if variants.ini exists
        const variantsFile = this.getVariantsPath();
        if (variantsFile) {
            this.sendCommand(`setoption name VariantPath value ${variantsFile}`);
        }

        // Check readiness
        await this.checkIsReady();
        this.isInitialized = true;

        return true;
    }

    private sendUciHandshake(): Promise<void> {
        return new Promise((resolve) => {
            this.uciResolver = resolve;
            this.sendCommand('uci');
        });
    }

    public checkIsReady(): Promise<void> {
        return new Promise((resolve) => {
            this.readyResolver = () => {
                resolve();
            };
            this.sendCommand('isready');
        });
    }

    /**
     * Maps Atlas Chess variant IDs to Fairy-Stockfish UCI variant names.
     */
    private mapVariantName(variantId: string): string {
        switch (variantId.toLowerCase()) {
            case 'classic':
            case 'standard':
            case 'chess':
                return 'chess';
            case 'shatranj':
                return 'shatranj';
            case 'chaturanga':
                return 'chaturanga';
            case 'courier':
                return 'courier';
            case 'tamerlane':
                return 'tamerlane';
            default:
                return variantId.toLowerCase();
        }
    }

    /**
     * Configures the game variant in the engine.
     */
    public async setVariant(variantId: string): Promise<boolean> {
        if (!this.process) await this.initEngine();

        const uciVariant = this.mapVariantName(variantId);
        this.sendCommand(`setoption name UCI_Variant value ${uciVariant}`);
        await this.checkIsReady();
        return true;
    }

    /**
     * Sets the engine skill level (-20 to 20).
     */
    public setSkillLevel(level: number): void {
        const clampedLevel = Math.max(-20, Math.min(20, level));
        this.sendCommand(`setoption name Skill Level value ${clampedLevel}`);
    }

    /**
     * Calculates the best move for a given position and move history.
     */
    public async calculateBestMove(options: CalculateMoveOptions): Promise<string> {
        if (!this.process || !this.isInitialized) {
            await this.initEngine();
        }

        if (typeof options.skillLevel === 'number') {
            this.setSkillLevel(options.skillLevel);
        }

        // Build position command
        let positionCmd = 'position startpos';
        if (options.fen) {
            positionCmd = `position fen ${options.fen}`;
        }

        if (options.moves && options.moves.length > 0) {
            positionCmd += ` moves ${options.moves.join(' ')}`;
        }

        this.sendCommand(positionCmd);

        // Build go command
        let goCmd = 'go';
        if (options.movetime && options.movetime > 0) {
            goCmd += ` movetime ${options.movetime}`;
        } else if (options.depth && options.depth > 0) {
            goCmd += ` depth ${options.depth}`;
        } else {
            goCmd += ' movetime 1000'; // Default 1 second search
        }

        return new Promise((resolve) => {
            this.moveResolver = resolve;
            this.sendCommand(goCmd);
        });
    }

    /**
     * Sends a raw command line to the engine.
     */
    public sendCommand(cmd: string): void {
        if (!this.process || !this.process.stdin || !this.process.stdin.writable || this.isTerminating) {
            return;
        }
        try {
            this.process.stdin.write(`${cmd}\n`, (err) => {
                if (err && (err as any).code !== 'EPIPE' && (err as any).code !== 'ERR_STREAM_DESTROYED') {
                    console.warn('[Fairy-Stockfish] sendCommand write error:', err);
                }
            });
        } catch {
            // Silence synchronous write errors during process destruction
        }
    }

    /**
     * Stops the current search calculation.
     */
    public stop(): void {
        this.sendCommand('stop');
    }

    /**
     * Parses output from the engine stdout stream.
     */
    private handleEngineOutput(line: string): void {
        if (!line) return;

        // UCI handshake completed
        if (line === 'uciok') {
            if (this.uciResolver) {
                this.uciResolver();
                this.uciResolver = null;
            }
            return;
        }

        // Ready response
        if (line === 'readyok') {
            if (this.readyResolver) {
                this.readyResolver();
                this.readyResolver = null;
            }
            return;
        }

        // Best move response
        if (line.startsWith('bestmove')) {
            const parts = line.split(' ');
            const bestMove = parts[1] || '(none)';

            this.emit('bestmove', bestMove);

            if (this.moveResolver) {
                this.moveResolver(bestMove);
                this.moveResolver = null;
            }
            return;
        }

        // Evaluation info stream
        if (line.startsWith('info')) {
            this.emit('info', line);
        }
    }

    /**
     * Terminates the engine process cleanly.
     */
    public terminate(): void {
        if (this.isTerminating) return;
        this.isTerminating = true;

        if (this.readlineInterface) {
            try {
                this.readlineInterface.close();
            } catch {}
            this.readlineInterface = null;
        }

        if (this.process) {
            const proc = this.process;
            this.process = null;
            this.isInitialized = false;

            try {
                if (proc.stdin && proc.stdin.writable) {
                    proc.stdin.write('quit\n', () => {
                        try {
                            proc.kill();
                        } catch {}
                    });
                } else {
                    proc.kill();
                }
            } catch {
                try {
                    proc.kill();
                } catch {}
            }
        }
    }
}
