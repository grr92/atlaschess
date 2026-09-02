import { useState } from "react";
import { useNavStore } from './store/useNavStore';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/menu/MainMenu';
import { Board } from './components/board/Board';
import { VariantsCatalog } from "./components/ui/VariantCatalog";
import { MoveHistory } from './components/board/MoveHistory';
import { CapturedPieces } from './components/board/CapturedPieces';
import { Undo2, RefreshCcw, Save, Bot } from 'lucide-react';
import { BackButton } from "./components/ui/BackButton";
import { GameTimer } from "./components/board/GameTimer.tsx";
import { InfoButton } from "./components/ui/InfoButton";
import { VariantInfoModal } from "./components/modals/VariantInfoModal";

export const App = () => {
    const currentScreen = useNavStore((state) => state.currentScreen);
    const setScreen = useNavStore((state) => state.setScreen);

    const {
        currentTurn,
        gameState,
        currentVariantId,
        resetGame,
        undoMove,
        history,
        saveGame,
        gameMode,
        playerColor,
        isAiThinking
    } = useGameStore();

    // state to control the confirmation pop-ups
    const [confirmAction, setConfirmAction] = useState<'exit' | 'restart' | null>(null);
    // state for the info modal
    const [infoModalOpen, setInfoModalOpen] = useState(false);

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
                        <div className="flex flex-col w-full lg:w-56 xl:w-64 flex-shrink-0 min-h-0">

                            <div className="flex items-end h-12 pb-2 gap-2 mb-2 lg:mb-0">
                                <BackButton onClick={() => setConfirmAction('exit')} />

                                <div className="relative group">
                                    <button
                                        onClick={saveGame}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover disabled:opacity-30 disabled:hover:bg-atlas-surface/80 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md text-atlas-titleText hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <Save className="w-5 h-5 text-amber-400"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        Save
                                    </span>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={undoMove}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover disabled:opacity-30 disabled:hover:bg-atlas-surface/80 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md text-atlas-titleText hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <Undo2 className="w-5 h-5 text-amber-400"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        Undo
                                    </span>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={() => setConfirmAction('restart')}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md text-atlas-titleText hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <RefreshCcw className="w-5 h-5 text-amber-400"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        Restart
                                    </span>
                                </div>
                            </div>

                            {/* perfect mirror of the right column (history) */}
                            <div className="flex-1 relative w-full min-h-[250px] lg:min-h-0">
                                <div className="absolute inset-0 py-4">
                                    <CapturedPieces />
                                </div>
                            </div>
                        </div>

                        {/* 2. center column: board and texts */}
                        <div className="flex flex-col flex-shrink-0 items-center lg:items-stretch">

                            <div className="flex justify-between items-center h-14 pb-2 px-2 w-full">
                                <h2 className="text-atlas-titleText text-2xl font-black tracking-tight flex items-center gap-2 capitalize">
                                    {currentVariantId === 'classic' ? 'Classic Chess' :
                                        currentVariantId === 'tamerlane' ? 'Tamerlane Chess' :
                                        currentVariantId === 'chaturanga' ? 'Chaturanga' :
                                        currentVariantId === 'shatranj' ? 'Shatranj' : currentVariantId}
                                </h2>
                                <div className="flex items-center gap-3 bg-atlas-surface/80 px-4 py-1.5 rounded-full border border-white/10 shadow-md backdrop-blur-md">
                                    {isAiThinking ? (
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs animate-pulse">
                                            <Bot className="w-4 h-4 animate-spin text-amber-400" />
                                            <span>AI Thinking...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-amber-400/50 ${
                                                currentTurn === 'white' ? 'bg-white shadow-white/50' : 'bg-slate-900 border border-white/40 shadow-black'
                                            } shadow-md`} />
                                            <span className="text-xs uppercase font-bold tracking-wider text-atlas-titleText">
                                                {currentTurn}
                                            </span>
                                            {gameMode === 'vs_ai' && (
                                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold rounded">
                                                    {currentTurn === playerColor ? 'YOU' : 'AI'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <span className="text-white/20">|</span>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${
                                        gameState === 'check' ? 'text-amber-400 animate-pulse' :
                                        gameState === 'checkmate' ? 'text-red-400' :
                                        gameState === 'draw' ? 'text-sky-400' : 'text-emerald-400'
                                    }`}>
                                        {gameState}
                                    </span>
                                </div>
                            </div>

                            <Board />

                        </div>

                        {/* 3. right column: match history */}
                        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col min-h-0">

                            {/* header wrapper containing the info button and the timer */}
                            <div className="flex justify-between items-end w-full">
                                <div className="h-12 pb-2 flex items-end">
                                    <InfoButton onClick={() => setInfoModalOpen(true)} />
                                </div>
                                <div className="flex-1">
                                    <GameTimer />
                                </div>
                            </div>

                            <div className="flex-1 relative w-full min-h-[300px] lg:min-h-0">
                                <div className="absolute inset-0 py-4">
                                    <MoveHistory />
                                </div>
                            </div>
                        </div>

                    </div>

                    {confirmAction && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                            <div className="bg-atlas-surface p-7 rounded-3xl shadow-2xl border border-amber-500/40 text-center max-w-sm w-full animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
                                <h3 className="text-2xl font-black mb-3 text-atlas-titleText tracking-tight">
                                    {confirmAction === 'exit' ? 'Leave game?' : 'Restart game?'}
                                </h3>
                                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                                    {confirmAction === 'exit'
                                        ? 'Are you sure you want to return to the menu? Your progress will be lost.'
                                        : 'Are you sure you want to restart? The current match will be lost.'}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 bg-atlas-secSurface hover:bg-atlas-secHover text-slate-200 py-3 rounded-xl font-bold transition-all border border-white/10 shadow-sm hover:scale-105 active:scale-95"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 py-3 rounded-xl font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* info modal */}
            {infoModalOpen && (
                <VariantInfoModal
                    variantId={currentVariantId}
                    onClose={() => setInfoModalOpen(false)}
                />
            )}

            {currentScreen === 'VARIANTS' && (
                <VariantsCatalog />
            )}

            {/*
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
            */}
        </main>
    );
};

export default App;