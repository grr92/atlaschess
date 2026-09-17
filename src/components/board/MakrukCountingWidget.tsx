import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MakrukEngine } from '../../core/engine/MakrukEngine';
import { Hourglass, Play, Square } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const MakrukCountingWidget: React.FC = () => {
    const { t } = useTranslation();
    const {
        engine,
        currentVariantId,
        gameMode,
        playerColor,
        currentTurn,
        toggleMakrukCounting,
    } = useGameStore();

    if ((currentVariantId !== 'makruk' && currentVariantId !== 'ouk_chaktrang') || !(engine instanceof MakrukEngine)) {
        return null;
    }

    const status = engine.getCountingStatus();

    // If counting rule is not eligible (pawns still on board) and not active, do not render
    if (!status.canToggle && !status.isCountingActive) {
        return null;
    }

    const isPvP = gameMode !== 'vs_ai';
    const isHumanDisadvantaged = status.disadvantagedColor === playerColor || status.disadvantagedColor === null;
    const canShowToggle = isPvP || isHumanDisadvantaged;
    const canPlayerToggle = status.canToggle && (
        isPvP
            ? (status.disadvantagedColor === null || currentTurn === status.disadvantagedColor)
            : (isHumanDisadvantaged && currentTurn === playerColor)
    );

    const countNumber = status.baseLimit || (status.type === 'board_64' ? 64 : status.maxMoves);

    return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Visual countdown indicator when counting is active */}
            {status.isCountingActive && (
                <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 rounded-full px-2.5 py-1 shadow-lg backdrop-blur-md whitespace-nowrap">
                    <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-1 leading-tight text-xs">
                        <span className="font-semibold text-amber-300">
                            {t.gameplay.makrukCount} ({countNumber}):
                        </span>
                        <span className="font-black text-amber-100 font-mono">
                            {status.remainingMoves}
                        </span>
                        <span className="font-medium text-amber-400/90 text-[11px]">
                            {t.gameplay.movesRemaining}
                        </span>
                    </div>
                </div>
            )}

            {/* Toggle button in PvP mode and Vs AI when human is disadvantaged */}
            {canShowToggle && status.canToggle && (
                <button
                    onClick={toggleMakrukCounting}
                    disabled={!canPlayerToggle}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 border ${
                        status.isCountingActive
                            ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border-red-500/40'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 animate-pulse'
                    } disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none`}
                    title={
                        !canPlayerToggle
                            ? t.gameplay.makrukOnlyDisadvantaged
                            : status.isCountingActive
                            ? t.gameplay.makrukStopCountingTooltip
                            : t.gameplay.makrukStartCountingTooltip
                    }
                >
                    {status.isCountingActive ? (
                        <>
                            <Square className="w-3 h-3 flex-shrink-0 fill-current" />
                            <span>{t.gameplay.makrukStopCounting}</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-3 h-3 flex-shrink-0 fill-current" />
                            <span>{t.gameplay.makrukStartCounting}</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
