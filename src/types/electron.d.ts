export interface CalculateMoveOptions {
    fen?: string;
    moves?: string[];
    movetime?: number;
    depth?: number;
    skillLevel?: number;
}

export interface ElectronEngineAPI {
    init: () => Promise<boolean>;
    setVariant: (variant: string) => Promise<boolean>;
    calculateMove: (options: CalculateMoveOptions) => Promise<string>;
    stop: () => Promise<boolean>;
    sendCommand: (command: string) => Promise<boolean>;
    onInfo: (callback: (info: string) => void) => () => void;
    onBestMove: (callback: (bestMove: string) => void) => () => void;
}

export interface ElectronAPI {
    getAppVersion: () => string;
    engine: ElectronEngineAPI;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}
