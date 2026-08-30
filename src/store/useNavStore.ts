import { create } from 'zustand';

// Defines the available screens/views within the application
export type Screen = 'MENU' | 'GAME' | 'SETTINGS' | 'VARIANTS';

// Interface representing the navigation store's state and actions
interface NavState {
    currentScreen: Screen; // The currently active screen being displayed
    setScreen: (screen: Screen) => void; // Action to transition between different screens
}

// Global Zustand store to manage UI navigation state
export const useNavStore = create<NavState>((set) => ({
    currentScreen: 'MENU', // Default screen upon application startup
    setScreen: (screen) => set({ currentScreen: screen }),
}));