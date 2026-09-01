import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// robust directory resolution for esm environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 700,
        title: "Atlas Chess",
        icon: path.join(process.env.VITE_PUBLIC!, 'icon.png'), // links the window icon
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,    // security: restricts direct node.js access from the renderer
            contextIsolation: true,    // security: isolates the execution context (prevents prototype pollution)
            sandbox: true              // security: enables standard chromium sandbox
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
    if (process.platform !== 'darwin') {
        app.quit();
        win = null;
    }
});

app.whenReady().then(createWindow);