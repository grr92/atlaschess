import React, {useRef} from 'react';
import { ChessKnight, Globe, Save } from 'lucide-react';
import { useNavStore } from '../../store/useNavStore';
import { useGameStore } from '../../store/useGameStore';
import { VerticalFusionLogo } from "../logos/VerticalFusionLogo";
import { MenuButton } from "../ui/MenuButton.tsx";
import windRoseLogo from '../../assets/logos/WInd_Rose_Aguiar.svg';

export const MainMenu: React.FC = () => {
    const setScreen = useNavStore((state) => state.setScreen);
    const { initGame, loadGame} = useGameStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStartClassicGame = () => {
        initGame('classic');
        setScreen('GAME');
    };

    // Programmatically trigger the hidden file input
    const handleLoadClick = () => {
        fileInputRef.current?.click();
    }

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
                    alert("This save file is invalid or corrupted.");
                }
            }
        };
        reader.readAsText(file);

        // Input cleanup to prevent issues with the onChange trigger if the user loads the same file twice
        e.target.value = '';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {/* Main transparent container */}
            <div className="max-w-xl w-full bg-transparent rounded-2xl p-8 text-center">

                {/* Title and Hero Logos */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="bg-transparent pt-6 px-6 pb-2 rounded-3xl mb-6 border border-transparent flex flex-col items-center justify-center relative overflow-hidden group">

                        {/* A. Main Subject Logo (z-10 ensures it stays in the foreground) */}
                        <VerticalFusionLogo className="w-72 h-72 relative z-10" />

                        {/* B. Wind Rose Base (z-0 pushes it to the background) */}
                        <img
                            src={windRoseLogo}
                            alt="Wind Rose Base"
                            className="w-72 h-72 -mt-72 opacity-30 relative z-0 drop-shadow-md"
                        />
                    </div>
                    <h1 className="text-5xl text-atlas-titleText font-extrabold tracking-tight">
                        Atlas Chess
                    </h1>
                    <p className="opacity-70 text-xl text-atlas-titleText mt-2">
                        Discover the history and regional variants of chess!
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-4">
                    <MenuButton
                        onClick={handleStartClassicGame}
                        icon={<ChessKnight className="w-6 h-6" />}
                        label="Classic game"
                        isPrimary={true}
                    />

                    <MenuButton
                        onClick={() => setScreen('VARIANTS')}
                        icon={<Globe className="w-6 h-6 opacity-80" />}
                        label="Chess variants"
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
                        label="Load game"
                    />

                    {/*
                    <MenuButton
                        onClick={() => setScreen('SETTINGS')}
                        icon={<Settings className="w-6 h-6 opacity-80" />}
                        label="Settings"
                    />
                    */}
                </div>

                {/* Footer Metadata */}
                <div className="mt-8 text-xs text-atlas-normalText opacity-40 tracking-wider">
                    Version 0.4.0 • Built with React + Zustand
                </div>
            </div>
        </div>
    );
};