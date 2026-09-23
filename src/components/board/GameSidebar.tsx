import { Undo2, RefreshCcw, Save } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { CapturedPieces } from './CapturedPieces';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';

interface GameSidebarProps {
    onExitRequest: () => void;
    onRestartRequest: () => void;
}

/**
 * Left sidebar of the game screen.
 * Contains navigation controls (Back, Undo, Restart, Save) and the captured pieces panel.
 */
export const GameSidebar = ({ onExitRequest, onRestartRequest }: GameSidebarProps) => {
    const { t } = useTranslation();
    const { undoMove, saveGame, history } = useGameStore();
    const hasHistory = history.length > 0;

    return (
        <div className="flex flex-col w-full lg:w-56 xl:w-64 flex-shrink-0 min-h-0">

            <div className="flex items-end h-12 pb-2 gap-2 mb-2 lg:mb-0">
                <BackButton onClick={onExitRequest} />

                <div className="relative group/undo">
                    <button
                        onClick={undoMove}
                        disabled={!hasHistory}
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
                        onClick={onRestartRequest}
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
                        disabled={!hasHistory}
                        className="bg-atlas-surface/80 hover:bg-atlas-hover disabled:opacity-30 disabled:hover:bg-atlas-surface/80 disabled:cursor-not-allowed text-slate-300 hover:text-amber-400 p-2.5 rounded-xl font-bold transition-all duration-200 border border-white/10 hover:border-amber-500/40 shadow-md hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center backdrop-blur-md"
                    >
                        <Save className="w-5 h-5 transition-colors"/>
                    </button>
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover/save:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                        {t.gameplay.tooltips.save}
                    </span>
                </div>
            </div>

            {/* Mirrors the right column height so both panels align with the board */}
            <div className="flex-1 relative w-full min-h-[250px] lg:min-h-0">
                <div className="absolute inset-0 py-4">
                    <CapturedPieces />
                </div>
            </div>
        </div>
    );
};
