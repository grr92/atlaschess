import { useState } from "react";
import { useNavStore } from './store/useNavStore';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/menu/MainMenu';
import { Board } from './components/board/Board';
import { VariantsCatalog } from "./components/ui/VariantCatalog";
import { MoveHistory } from './components/board/MoveHistory';
import { CapturedPieces } from './components/board/CapturedPieces';
import { Undo2, RefreshCcw, Save } from 'lucide-react';
import { BackButton } from "./components/ui/BackButton";
import {GameTimer} from "./components/board/GameTimer.tsx";

export const App = () => {
    const currentScreen = useNavStore((state) => state.currentScreen);
    const setScreen = useNavStore((state) => state.setScreen);

    const { currentTurn, gameState, currentVariantId, resetGame, undoMove, history, saveGame } = useGameStore();

    // state to control the confirmation pop-ups
    const [confirmAction, setConfirmAction] = useState<'exit' | 'restart' | null>(null);

    // function to process the "yes" confirmation
    const handleConfirm = () => {
        if (confirmAction === 'exit') {
            setScreen('MENU');
        } else if (confirmAction === 'restart') {
            resetGame();
        }
        setConfirmAction(null);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-atlas-grad to-atlas-back to-[150px] text-atlas-titleText">

            {currentScreen === 'MENU' && <MainMenu />}

            {currentScreen === 'GAME' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">

                    <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-[90rem]">

                        {/* 1. left column: buttons and captured pieces */}
                        <div className="flex flex-col w-full lg:w-56 xl:w-64 flex-shrink-0">

                            <div className="flex items-end h-12 pb-2 gap-2 mb-2 lg:mb-0">
                                <BackButton onClick={() => setConfirmAction('exit')} />

                                <div className="relative group">
                                    <button
                                        onClick={saveGame}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface hover:bg-atlas-hover disabled:opacity-40 disabled:hover:bg-atlas-surface p-2.5 rounded-lg font-bold transition-colors shadow-md"
                                    >
                                        <Save className="w-5 h-5"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                                        Save
                                    </span>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={undoMove}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface hover:bg-atlas-hover disabled:opacity-40 disabled:hover:bg-atlas-surface p-2.5 rounded-lg font-bold transition-colors shadow-md"
                                    >
                                        <Undo2 className="w-5 h-5"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                                        Undo
                                    </span>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={() => setConfirmAction('restart')}
                                        className="bg-atlas-surface hover:bg-atlas-hover p-2.5 rounded-lg font-bold transition-colors shadow-md"
                                    >
                                        <RefreshCcw className="w-5 h-5"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                                        Restart
                                    </span>
                                </div>
                            </div>

                            {/* perfect mirror of the right column (history) */}
                            <div className="flex-grow py-4 h-full">
                                <CapturedPieces />
                            </div>
                        </div>

                        {/* 2. center column: board and texts */}
                        <div className="flex flex-col flex-shrink-0 items-center lg:items-stretch">

                            <div className="flex justify-between items-end h-12 pb-2 px-4 w-full">
                                <h2 className="text-atlas-titleText text-xl font-bold capitalize">
                                    {currentVariantId === 'classic' ? 'Classic Chess' : currentVariantId}
                                </h2>
                                <p className="text-atlas-titleText text-sm capitalize opacity-80">
                                    Turn: <span className="font-bold">{currentTurn}</span> | Status: <span className="font-bold">{gameState}</span>
                                </p>
                            </div>

                            <Board />

                        </div>

                        {/* 3. right column: match history */}
                        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col">
                            <GameTimer />

                            <div className="flex-grow py-4 h-full">
                                <MoveHistory />
                            </div>
                        </div>

                    </div>

                    {confirmAction && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="bg-atlas-surface p-6 rounded-2xl shadow-2xl border border-atlas-hover text-center max-w-sm w-full animate-in fade-in zoom-in duration-200">
                                <h3 className="text-2xl font-bold mb-3 text-atlas-titleText">
                                    {confirmAction === 'exit' ? 'Leave game?' : 'Restart game?'}
                                </h3>
                                <p className="opacity-80 mb-8">
                                    {confirmAction === 'exit'
                                        ? 'Are you sure you want to return to the menu? Your progress will be lost.'
                                        : 'Are you sure you want to restart? The current match will be lost.'}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 bg-atlas-secSurface hover:bg-atlas-secHover py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {currentScreen === 'VARIANTS' && (
                <VariantsCatalog />
            )}

            {currentScreen === 'SETTINGS' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="max-w-md w-full bg-atlas-surface rounded-2xl p-8 shadow-2xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Settings</h2>
                        <p className="opacity-60 mb-8">
                            Game configuration options will go here.
                        </p>
                        <BackButton onClick={() => setScreen('MENU')} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default App;