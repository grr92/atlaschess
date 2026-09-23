import { useState, useEffect } from "react";
import { useNavStore } from './store/useNavStore';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/menu/MainMenu';
import { Board } from './components/board/Board';
import { XiangqiBoard } from './components/board/XiangqiBoard';
import { JanggiBoard } from './components/board/JanggiBoard';
import { VariantsCatalog } from "./components/ui/VariantCatalog";
import { GameSidebar } from './components/board/GameSidebar';
import { GameHeader } from './components/board/GameHeader';
import { GameControls } from './components/board/GameControls';
import { ConfirmModal } from './components/modals/ConfirmModal';
import { VariantInfoModal } from "./components/modals/VariantInfoModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import { GameOverModal } from "./components/modals/GameOverModal";
import { VariantRegistry } from "./core/variants/variantRegistry";

const BOARD_COMPONENTS: Record<string, React.ComponentType> = {
    grid: Board,
    xiangqi: XiangqiBoard,
    janggi: JanggiBoard,
};

const App = () => {
    const currentScreen = useNavStore((state) => state.currentScreen);
    const setScreen = useNavStore((state) => state.setScreen);
    const { gameState, currentVariantId, resetGame } = useGameStore();

    const [confirmAction, setConfirmAction] = useState<'exit' | 'restart' | null>(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGameOverDismissed, setIsGameOverDismissed] = useState(false);
    const [isGameOverDelayed, setIsGameOverDelayed] = useState(false);

    const isGameOver = gameState === 'checkmate' || gameState === 'draw';
    const isGameOverModalOpen = isGameOver && isGameOverDelayed && !isGameOverDismissed;

    // Reset dismissed/delayed flags when a new game starts or a move is undone
    useEffect(() => {
        if (gameState === 'playing' || gameState === 'check') {
            setIsGameOverDismissed(false);
            setIsGameOverDelayed(false);
        }
    }, [gameState]);

    // Delay the game-over modal so players can observe the final position before it appears
    useEffect(() => {
        if (!isGameOver) { setIsGameOverDelayed(false); return; }
        const timer = setTimeout(() => setIsGameOverDelayed(true), 1200);
        return () => clearTimeout(timer);
    }, [isGameOver]);

    // Keyboard shortcut: Escape dismisses the topmost open panel/modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
            if (confirmAction)           setConfirmAction(null);
            else if (isGameOverModalOpen) setIsGameOverDismissed(true);
            else if (infoModalOpen)      setInfoModalOpen(false);
            else if (isSettingsOpen)     setIsSettingsOpen(false);
            else if (currentScreen === 'GAME') setConfirmAction('exit');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmAction, isGameOverModalOpen, infoModalOpen, isSettingsOpen, currentScreen]);

    const handleConfirm = () => {
        if (confirmAction === 'exit') setScreen('MENU');
        else if (confirmAction === 'restart') resetGame();
        setConfirmAction(null);
    };

    const currentVariantDef = VariantRegistry.get(currentVariantId);
    const ActiveBoard = BOARD_COMPONENTS[currentVariantDef?.boardType ?? 'grid'] ?? Board;

    return (
        <main className="min-h-screen bg-gradient-to-b from-atlas-grad to-atlas-back to-[150px] text-atlas-titleText">

            {currentScreen === 'MENU' && <MainMenu />}

            {currentScreen === 'GAME' && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-[90rem]">

                        <GameSidebar
                            onExitRequest={() => setConfirmAction('exit')}
                            onRestartRequest={() => setConfirmAction('restart')}
                        />

                        <div className="flex flex-col flex-shrink-0 items-center lg:items-stretch">
                            <GameHeader
                                onShowResult={() => setIsGameOverDismissed(false)}
                            />
                            <ActiveBoard />
                        </div>

                        <GameControls
                            onInfoOpen={() => setInfoModalOpen(true)}
                            onSettingsOpen={() => setIsSettingsOpen(true)}
                        />
                    </div>

                    {confirmAction && (
                        <ConfirmModal
                            action={confirmAction}
                            onConfirm={handleConfirm}
                            onCancel={() => setConfirmAction(null)}
                        />
                    )}
                </div>
            )}

            {infoModalOpen && (
                <VariantInfoModal
                    variantId={currentVariantId}
                    onClose={() => setInfoModalOpen(false)}
                />
            )}

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            <GameOverModal
                isOpen={isGameOverModalOpen}
                onClose={() => setIsGameOverDismissed(true)}
            />

            {currentScreen === 'VARIANTS' && <VariantsCatalog />}
        </main>
    );
};

export default App;