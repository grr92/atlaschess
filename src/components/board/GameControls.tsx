import { Volume2, VolumeX, Settings } from 'lucide-react';
import { InfoButton } from '../ui/InfoButton';
import { GameTimer } from './GameTimer';
import { MoveHistory } from './MoveHistory';
import { ChaturajiStakesCounter } from './ChaturajiStakesCounter';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';

interface GameControlsProps {
    onInfoOpen: () => void;
    onSettingsOpen: () => void;
}

/**
 * Right sidebar of the game screen.
 * Contains utility buttons (Mute, Settings, Info), the game timer, and the move history panel.
 */
export const GameControls = ({ onInfoOpen, onSettingsOpen }: GameControlsProps) => {
    const { t } = useTranslation();
    const { isMuted, toggleMute, currentVariantId } = useGameStore();

    return (
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col min-h-0">

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
                            onClick={onSettingsOpen}
                            className="bg-atlas-surface/80 hover:bg-atlas-hover text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md"
                        >
                            <Settings className="w-5 h-5 transition-colors" />
                        </button>
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/settings:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                            {t.gameplay.tooltips.settings}
                        </span>
                    </div>

                    <InfoButton onClick={onInfoOpen} />
                </div>

                <div className="flex-1">
                    <GameTimer />
                </div>
            </div>

            <div className="flex-1 relative w-full min-h-[300px] lg:min-h-0">
                <div className="absolute inset-0 py-4">
                    {currentVariantId === 'chaturaji' ? <ChaturajiStakesCounter /> : <MoveHistory />}
                </div>
            </div>
        </div>
    );
};
