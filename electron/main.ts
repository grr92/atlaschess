import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FairyStockfishService, type CalculateMoveOptions } from './engine/FairyStockfishService';

// Robust directory resolution for ESM environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null = null;
const engineService = new FairyStockfishService();

// Whitelist patterns for valid UCI engine commands to prevent arbitrary input execution
const ALLOWED_UCI_COMMAND_PATTERNS = [
    /^uci$/,
    /^isready$/,
    /^ucinewgame$/,
    /^stop$/,
    /^quit$/,
    /^position\s+(startpos|fen\s+[a-zA-Z0-9/+\- ]+)(\s+moves(\s+[a-zA-Z0-9+=#]+)*)?$/,
    /^go(\s+(movetime\s+\d+|depth\s+\d+|nodes\s+\d+|infinite|wtime\s+\d+|btime\s+\d+|winc\s+\d+|binc\s+\d+))*$/,
    /^setoption\s+name\s+[a-zA-Z0-9_ -]+(\s+value\s+[a-zA-Z0-9_ .\-/:\\]+)?$/i
];

function isValidUciCommand(cmd: string): boolean {
    if (typeof cmd !== 'string' || cmd.trim().length === 0 || cmd.length > 500) {
        return false;
    }
    const trimmed = cmd.trim();
    // Prevent command injection via newline characters
    if (trimmed.includes('\n') || trimmed.includes('\r')) {
        return false;
    }
    return ALLOWED_UCI_COMMAND_PATTERNS.some(pattern => pattern.test(trimmed));
}

function setupEngineIPC() {
    ipcMain.handle('engine:init', async () => {
        try {
            return await engineService.initEngine();
        } catch (error) {
            console.error('[Main] Failed to initialize engine:', error);
            return false;
        }
    });

    ipcMain.handle('engine:setVariant', async (_event, variant: string) => {
        try {
            return await engineService.setVariant(variant);
        } catch (error) {
            console.error('[Main] Failed to set variant:', error);
            return false;
        }
    });

    ipcMain.handle('engine:calculateMove', async (_event, options: CalculateMoveOptions) => {
        try {
            return await engineService.calculateBestMove(options);
        } catch (error) {
            console.error('[Main] Failed to calculate move:', error);
            return '(none)';
        }
    });

    ipcMain.handle('engine:stop', async () => {
        engineService.stop();
        return true;
    });

    ipcMain.handle('engine:sendCommand', async (_event, cmd: string) => {
        if (!isValidUciCommand(cmd)) {
            console.warn('[Main IPC Security] Blocked invalid UCI command:', cmd);
            return false;
        }
        engineService.sendCommand(cmd.trim());
        return true;
    });

    // Forward engine events to renderer
    engineService.on('info', (info: string) => {
        if (win && !win.isDestroyed()) {
            win.webContents.send('engine:info', info);
        }
    });

    engineService.on('bestmove', (bestMove: string) => {
        if (win && !win.isDestroyed()) {
            win.webContents.send('engine:bestMove', bestMove);
        }
    });
}

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 700,
        title: "Atlas Chess",
        icon: path.join(process.env.VITE_PUBLIC!, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
    });

    // In development it loads localhost, in production it loads the compiled index.html
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(process.env.DIST!, 'index.html'));
    }
}

app.on('window-all-closed', () => {
    engineService.terminate();
    if (process.platform !== 'darwin') {
        app.quit();
        win = null;
    }
});

app.on('before-quit', () => {
    engineService.terminate();
});

app.whenReady().then(() => {
    setupEngineIPC();
    createWindow();
});