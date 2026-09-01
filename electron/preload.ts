import { contextBridge } from 'electron';

// safely expose select APIs to the renderer process (react)
// this creates a secure bridge without exposing the entire node.js environment
contextBridge.exposeInMainWorld('electronAPI', {
    // future custom native functions go here
    getAppVersion: () => process.versions.electron,
});