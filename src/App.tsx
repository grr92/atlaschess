import { useState, useEffect } from "react";
import { useNavStore } from './store/useNavStore';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/menu/MainMenu';
import { Board } from './components/board/Board';
import { VariantsCatalog } from "./components/ui/VariantCatalog";
import { MoveHistory } from './components/board/MoveHistory';
import { CapturedPieces } from './components/board/CapturedPieces';
import { Undo2, RefreshCcw, Save, Bot, Volume2, VolumeX, Settings } from 'lucide-react';
import { BackButton } from "./components/ui/BackButton";
import { GameTimer } from "./components/board/GameTimer";
import { InfoButton } from "./components/ui/InfoButton";
import { VariantInfoModal } from "./components/modals/VariantInfoModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import { D8DiceWidget } from "./components/board/D8DiceWidget";
import { useTranslation } from './i18n';

export const App = () => {
    const { t, getVariantMeta } = useTranslation();
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
        isAiThinking,
        isMuted,
        toggleMute
    } = useGameStore();

    // state to control the confirmation pop-ups
    const [confirmAction, setConfirmAction] = useState<'exit' | 'restart' | null>(null);
    // state for the info modal
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    // state for settings modal
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && confirmAction) {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                setConfirmAction(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmAction]);

    // function to process the "yes" confirmation
    const handleConfirm = () => {
        if (confirmAction === 'exit') {
            setScreen('MENU');
        } else if (confirmAction === 'restart') {
            resetGame();
        }
        setConfirmAction(null);
    };

    const currentVariantMeta = getVariantMeta(currentVariantId);

    const getGameStateLabel = () => {
        if (gameState === 'check') return t.gameplay.check;
        if (gameState === 'checkmate') return t.gameplay.checkmate;
        if (gameState === 'draw') return t.gameplay.draw;
        return t.gameplay.playing;
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-atlas-grad to-atlas-back to-[150px] text-atlas-titleText">

            {currentScreen === 'MENU' && <MainMenu />}

            {currentScreen === 'GAME' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">

                    <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-[90rem]">

                        {/* 1. left column: gameplay buttons and captured pieces */}
                        <div className="flex flex-col w-full lg:w-56 xl:w-64 flex-shrink-0 min-h-0">

                            <div className="flex items-end h-12 pb-2 gap-2 mb-2 lg:mb-0">
                                <BackButton onClick={() => setConfirmAction('exit')} />

                                <div className="relative group/undo">
                                    <button
                                        onClick={undoMove}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover disabled:opacity-30 disabled:hover:bg-atlas-surface/80 disabled:cursor-not-allowed text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <Undo2 className="w-5 h-5 transition-colors"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/undo:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        {t.gameplay.tooltips.undo}
                                    </span>
                                </div>

                                <div className="relative group/restart">
                                    <button
                                        onClick={() => setConfirmAction('restart')}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <RefreshCcw className="w-5 h-5 transition-colors"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/restart:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        {t.gameplay.tooltips.restart}
                                    </span>
                                </div>

                                <div className="relative group/save">
                                    <button
                                        onClick={saveGame}
                                        disabled={history.length === 0}
                                        className="bg-atlas-surface/80 hover:bg-atlas-hover disabled:opacity-30 disabled:hover:bg-atlas-surface/80 disabled:cursor-not-allowed text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center backdrop-blur-md"
                                    >
                                        <Save className="w-5 h-5 transition-colors"/>
                                    </button>
                                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/save:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                        {t.gameplay.tooltips.save}
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
                                    {currentVariantMeta.title}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <D8DiceWidget />
                                    <div className="flex items-center gap-3 bg-atlas-surface/80 px-4 py-1.5 rounded-full border border-white/10 shadow-md backdrop-blur-md">
                                    {isAiThinking ? (
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs animate-pulse">
                                            <Bot className="w-4 h-4 animate-spin text-amber-400" />
                                            <span>{t.gameplay.aiThinking}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-amber-400/50 ${
                                                currentTurn === 'white' ? 'bg-white shadow-white/50' : 'bg-slate-900 border border-white/40 shadow-black'
                                            } shadow-md`} />
                                            <span className="text-xs uppercase font-bold tracking-wider text-atlas-titleText">
                                                {currentTurn === 'white' ? t.common.white : t.common.black}
                                            </span>
                                            {gameMode === 'vs_ai' && (
                                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold rounded">
                                                    {currentTurn === playerColor ? t.gameplay.turnYou : t.gameplay.turnAi}
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
                                        {getGameStateLabel()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Board />

                        </div>

                        {/* 3. right column: utility buttons, timer and match history */}
                        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col min-h-0">

                            {/* header wrapper containing the utility buttons (sound, settings, info) and the timer */}
                            <div className="flex justify-between items-end w-full gap-2 mb-2 lg:mb-0">
                                <div className="flex items-end h-12 pb-2 gap-2">
                                    <div className="relative group/mute">
                                        <button
                                            onClick={toggleMute}
                                            className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" />
                                            ) : (
                                                <Volume2 className="w-5 h-5 transition-colors" />
                                            )}
                                        </button>
                                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/mute:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                            {isMuted ? t.gameplay.tooltips.unmute : t.gameplay.tooltips.mute}
                                        </span>
                                    </div>

                                    <div className="relative group/settings">
                                        <button
                                            onClick={() => setIsSettingsOpen(true)}
                                            className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                                        >
                                            <Settings className="w-5 h-5 transition-colors" />
                                        </button>
                                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/settings:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                            {t.gameplay.tooltips.settings}
                                        </span>
                                    </div>

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
                                    {confirmAction === 'exit' ? t.gameplay.confirmExitTitle : t.gameplay.confirmRestartTitle}
                                </h3>
                                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                                    {confirmAction === 'exit'
                                        ? t.gameplay.confirmExitDesc
                                        : t.gameplay.confirmRestartDesc}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 bg-atlas-secSurface hover:bg-atlas-secHover text-slate-200 py-3 rounded-xl font-bold transition-all border border-white/10 shadow-sm hover:scale-105 active:scale-95"
                                    >
                                        {t.common.no}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 py-3 rounded-xl font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                                    >
                                        {t.common.yes}
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

            {/* settings modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

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