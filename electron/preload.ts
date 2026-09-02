import { contextBridge, ipcRenderer } from 'electron';

export interface CalculateMovePayload {
    fen?: string;
    moves?: string[];
    movetime?: number;
    depth?: number;
    skillLevel?: number;
}

// safely expose select APIs to the renderer process (react)
// this creates a secure bridge without exposing the entire node.js environment
contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => process.versions.electron,
    engine: {
        init: () => ipcRenderer.invoke('engine:init'),
        setVariant: (variant: string) => ipcRenderer.invoke('engine:setVariant', variant),
        calculateMove: (options: CalculateMovePayload) => ipcRenderer.invoke('engine:calculateMove', options),
        stop: () => ipcRenderer.invoke('engine:stop'),
        sendCommand: (command: string) => ipcRenderer.invoke('engine:sendCommand', command),
        onInfo: (callback: (info: string) => void) => {
            const listener = (_event: any, value: string) => callback(value);
            ipcRenderer.on('engine:info', listener);
            return () => {
                ipcRenderer.removeListener('engine:info', listener);
            };
        },
        onBestMove: (callback: (bestMove: string) => void) => {
            const listener = (_event: any, value: string) => callback(value);
            ipcRenderer.on('engine:bestMove', listener);
            return () => {
                ipcRenderer.removeListener('engine:bestMove', listener);
            };
        },
    }
});