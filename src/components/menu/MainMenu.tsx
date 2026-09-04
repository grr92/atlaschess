import React, { useRef, useState } from 'react';
import { ChessKnight, Globe, Save, Volume2, VolumeX, Settings } from 'lucide-react';
import { useNavStore } from '../../store/useNavStore';
import { useGameStore, type GameMode, type AiDifficulty } from '../../store/useGameStore';
import { VerticalFusionLogo } from "../logos/VerticalFusionLogo";
import { MenuButton } from "../ui/MenuButton.tsx";
import { GameSetupModal } from "../modals/GameSetupModal";
import { SettingsModal } from "../modals/SettingsModal";
import type { PieceColor } from '../../types';
import windRoseLogo from '../../assets/logos/WInd_Rose_Aguiar.svg';
import { useTranslation } from '../../i18n';

export const MainMenu: React.FC = () => {
    const { t, getVariantMeta } = useTranslation();
    const setScreen = useNavStore((state) => state.setScreen);
    const { initGame, loadGame, isMuted, toggleMute } = useGameStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleStartClassicGame = (mode: GameMode, playerColor: PieceColor, difficulty: AiDifficulty, useDiceRule?: boolean) => {
        initGame('classic', mode, playerColor, difficulty, useDiceRule);
        setScreen('GAME');
    };

    // Programmatically trigger the hidden file input
    const handleLoadClick = () => {
        fileInputRef.current?.click();
    };

    // Function to handle reading the selected save file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        // Asynchronous event triggered when the reader finishes reading successfully
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                const success = loadGame(content);
                if (success) {
                    setScreen('GAME');
                } else {
                    alert(t.menu.invalidSaveFile);
                }
            }
        };
        reader.readAsText(file);

        // Input cleanup to prevent issues with the onChange trigger if the user loads the same file twice
        e.target.value = '';
    };

    const classicMeta = getVariantMeta('classic');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
            {/* Top-Right Quick Settings */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                    onClick={toggleMute}
                    className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                    title={isMuted ? t.gameplay.tooltips.unmute : t.gameplay.tooltips.mute}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" />
                    ) : (
                        <Volume2 className="w-5 h-5 transition-colors" />
                    )}
                </button>

                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                    title={t.gameplay.tooltips.settings}
                >
                    <Settings className="w-5 h-5 transition-colors" />
                </button>
            </div>

            {/* Main transparent container */}
            <div className="max-w-xl w-full bg-transparent rounded-2xl p-8 text-center">

                {/* Title and Hero Logos */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="pt-4 pb-2 mb-4 flex flex-col items-center justify-center relative group">

                        {/* Ambient Gold Glow Effect */}
                        <div className="absolute w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

                        {/* A. Main Subject Logo (z-10 ensures it stays in the foreground) */}
                        <VerticalFusionLogo className="w-72 h-72 relative z-10 drop-shadow-2xl" />

                        {/* B. Wind Rose Base (z-0 pushes it to the background) */}
                        <img
                            src={windRoseLogo}
                            alt="Wind Rose Base"
                            className="w-72 h-72 -mt-72 opacity-25 relative z-0 drop-shadow-md group-hover:rotate-12 transition-transform duration-700 pointer-events-none"
                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl text-atlas-titleText font-black tracking-tight drop-shadow-md">
                        {t.menu.titlePrefix} <span className="text-amber-400">{t.menu.titleHighlight}</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl mt-3 font-medium max-w-md">
                        {t.menu.subtitle}
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-4">
                    <MenuButton
                        onClick={() => setIsSetupOpen(true)}
                        icon={<ChessKnight className="w-6 h-6" />}
                        label={t.menu.classicGame}
                        isPrimary={true}
                    />

                    <MenuButton
                        onClick={() => setScreen('VARIANTS')}
                        icon={<Globe className="w-6 h-6 opacity-80" />}
                        label={t.menu.chessVariants}
                    />

                    {/* Hidden input used exclusively for handling file uploads */}
                    <input
                        type="file"
                        accept=".atlas,.json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <MenuButton
                        onClick={handleLoadClick}
                        icon={<Save className="w-6 h-6 opacity-80" />}
                        label={t.menu.loadGame}
                    />

                    <MenuButton
                        onClick={() => setIsSettingsOpen(true)}
                        icon={<Settings className="w-6 h-6 opacity-80" />}
                        label={t.menu.settings}
                    />
                </div>

                {/* Footer Metadata */}
                <div className="mt-8 text-xs text-atlas-normalText opacity-50 tracking-wider flex flex-col items-center gap-1">
                    <div>{t.menu.versionInfo}</div>
                    <div className="opacity-75 text-[11px]">{t.menu.techStack}</div>
                </div>
            </div>

            {/* Game Setup Modal */}
            <GameSetupModal
                variantId="classic"
                variantTitle={classicMeta.title}
                isOpen={isSetupOpen}
                onClose={() => setIsSetupOpen(false)}
                onStartGame={handleStartClassicGame}
            />

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};