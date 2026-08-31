import { useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const GameTimer = () => {
    const { gameState, gameTime, setGameTime } = useGameStore();

    // Timer logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (gameState === 'playing' || gameState === 'check') {
            interval = setInterval(() => {
                setGameTime((prev) => prev + 1);
            }, 1000);
        }

        // Cleanup interval on unmount or state change
        return () => clearInterval(interval);
    }, [gameState, setGameTime])

    // Function to format raw seconds into MM:SS
    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        // Matching the exact layout of the left column buttons of the screen for visual symmetry
        <div className="flex justify-end items-end h-12 pb-2 w-full">
            <div className="flex items-center gap-2 opacity-80 px-2">
                <Timer className="w-5 h-5" />
                <span className="font-mono text-lg font-bold tracking-widest">
                    {formatTime(gameTime)}
                </span>
            </div>
        </div>
    );
};