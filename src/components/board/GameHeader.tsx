import { Bot, SkipForward, Trophy } from 'lucide-react';
import { D8DiceWidget } from './D8DiceWidget';
import { MakrukCountingWidget } from './MakrukCountingWidget';
import { SittuyinCountingWidget } from './SittuyinCountingWidget';
import { FourSeasonsEngine, type FourSeasonsColor } from '../../core/engine/FourSeasonsEngine';
import { ChaturajiEngine } from '../../core/engine/ChaturajiEngine';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';
import type { GameState } from '../../types';

// Maps a player color name to the Tailwind classes for its indicator dot.
const getPlayerColorDot = (color: string): string => {
    switch (color) {
        case 'white':  return 'bg-white shadow-white/50';
        case 'black':  return 'bg-slate-900 border border-white/40 shadow-black';
        case 'red':    return 'bg-red-500 shadow-red-500/50';
        case 'green':  return 'bg-emerald-500 shadow-emerald-500/50';
        case 'yellow': return 'bg-amber-400 shadow-amber-400/50';
        case 'blue':   return 'bg-sky-500 shadow-sky-500/50';
        default:       return 'bg-white';
    }
};

// Maps a game state to its status label color class.
const getStateColorClass = (state: GameState): string => {
    switch (state) {
        case 'check':     return 'text-amber-400 animate-pulse';
        case 'checkmate': return 'text-red-400';
        case 'draw':      return 'text-sky-400';
        default:          return 'text-emerald-400';
    }
};

interface GameHeaderProps {
    onShowResult: () => void;
}

/**
 * Central header bar displayed above the game board.
 * Shows the variant title, optional piece style toggle, game widgets (dice, counting),
 * the active turn indicator, and the current game state label.
 */
export const GameHeader = ({ onShowResult }: GameHeaderProps) => {
    const { t, getVariantMeta } = useTranslation();
    const {
        engine,
        currentTurn,
        gameState,
        currentVariantId,
        gameMode,
        playerColor,
        isAiThinking,
        isRollingDice,
        passTurn,
        setRegionalPieceStyle,
        regionalPieceStyle,
    } = useGameStore();

    const currentVariantMeta = getVariantMeta(currentVariantId);
    const currentVariantDef = VariantRegistry.get(currentVariantId);

    const isGameOver = gameState === 'checkmate' || gameState === 'draw';
    const activeController = engine ? engine.getActiveController() : currentTurn;
    const isPlayerTurn = gameMode !== 'vs_ai' || activeController === playerColor;

    const canPass = Boolean(
        currentVariantDef?.supportsPassTurn &&
        isPlayerTurn &&
        !isAiThinking &&
        !isRollingDice &&
        (gameState === 'playing' || gameState === 'check')
    );

    const pieceStyleToggleLabel = regionalPieceStyle === 'text'
        ? t.gameplay.pieceStyleInternational
        : t.gameplay.pieceStyleTraditional;

    const togglePieceStyle = () =>
        setRegionalPieceStyle(regionalPieceStyle === 'text' ? 'icon' : 'text');

    // Resolves a color key to its localised display name.
    const getPlayerColorName = (color: string): string => {
        const key = color as keyof typeof t.common;
        return t.common[key] || color;
    };

    // Builds the game state label, with special handling for multi-player variants.
    const getGameStateLabel = (): string => {
        if (gameState === 'check') return t.gameplay.check;

        if (currentVariantId === 'four_seasons' && engine instanceof FourSeasonsEngine) {
            if (gameState === 'checkmate' && engine.winnerColor) {
                return `🏆 ${getPlayerColorName(engine.winnerColor)}`;
            }
            if (gameState === 'draw') return t.gameplay.draw;
        }

        if (currentVariantId === 'chaturaji' && engine instanceof ChaturajiEngine) {
            if (gameState === 'checkmate' || gameState === 'draw') {
                const match = engine.getMatchWinner();
                if (match.winner) {
                    return `🏆 ${getPlayerColorName(match.winner)} (${match.maxStakes} ${t.gameplay.wonStakes.toLowerCase()})`;
                }
                if (match.isTie && match.maxStakes > 0) {
                    return `🤝 ${t.gameplay.draw} (${match.maxStakes} ${t.gameplay.wonStakes.toLowerCase()})`;
                }
                return t.gameplay.draw;
            }
        }

        const customStatus = engine?.getCustomStatus();
        if (customStatus) return customStatus;

        if (gameState === 'checkmate') return t.gameplay.checkmate;
        if (gameState === 'draw') return t.gameplay.draw;
        return t.gameplay.playing;
    };

    return (
        <div className="flex justify-between items-center h-14 pb-2 px-2 w-full gap-2">
            <h2 className="text-atlas-titleText text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 capitalize flex-shrink-0 whitespace-nowrap">
                {currentVariantMeta?.title || currentVariantId}
            </h2>

            {currentVariantDef?.hasPieceStyleToggle && (
                <button
                    onClick={togglePieceStyle}
                    className="ml-2 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-atlas-surface/80 border border-white/20 rounded hover:bg-white/10 transition-colors"
                >
                    {pieceStyleToggleLabel}
                </button>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
                <D8DiceWidget />
                <MakrukCountingWidget />
                <SittuyinCountingWidget />

                {canPass && (
                    <button
                        onClick={passTurn}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex-shrink-0"
                        title={t.gameplay.passTurn}
                    >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span>{t.gameplay.passTurn}</span>
                    </button>
                )}

                {/* Active turn + game state indicator */}
                <div className="flex items-center gap-2.5 bg-atlas-surface/80 px-3 py-1.5 rounded-full border border-white/10 shadow-md backdrop-blur-md flex-shrink-0">
                    {isAiThinking ? (
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs animate-pulse">
                            <Bot className="w-4 h-4 animate-spin text-amber-400" />
                            <span>{t.gameplay.aiThinking}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-amber-400/50 ${getPlayerColorDot(activeController)} shadow-md`} />
                            <span className="text-xs uppercase font-bold tracking-wider text-atlas-titleText">
                                {getPlayerColorName(activeController)}
                            </span>

                            {/* Four Seasons: show annexed army count when a player commands multiple armies */}
                            {currentVariantId === 'four_seasons' && engine instanceof FourSeasonsEngine && engine.annexedArmies[currentTurn as FourSeasonsColor]?.length > 1 && (
                                <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-bold" title="Armies commanded by active player">
                                    <span>+{engine.annexedArmies[currentTurn as FourSeasonsColor].filter((c: FourSeasonsColor) => c !== currentTurn).length}</span>
                                    <div className="flex items-center -space-x-1 ml-0.5">
                                        {engine.annexedArmies[currentTurn as FourSeasonsColor]
                                            .filter((c: FourSeasonsColor) => c !== currentTurn)
                                            .map((c: FourSeasonsColor) => (
                                                <div key={c} className={`w-2.5 h-2.5 rounded-full ${getPlayerColorDot(c)} ring-1 ring-slate-900`} title={getPlayerColorName(c)} />
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {gameMode === 'vs_ai' && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold rounded">
                                    {activeController === playerColor ? t.gameplay.turnYou : t.gameplay.turnAi}
                                </span>
                            )}
                        </div>
                    )}

                    <span className="text-white/20">|</span>

                    <span className={`text-xs font-bold uppercase tracking-wider ${getStateColorClass(gameState)}`}>
                        {getGameStateLabel()}
                    </span>

                    {isGameOver && (
                        <button
                            onClick={onShowResult}
                            className="ml-1 flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-bold transition-all shadow-sm active:scale-95 animate-pulse"
                            title={t.gameplay.viewResult}
                        >
                            <Trophy className="w-3 h-3 text-amber-400" />
                            <span>{t.gameplay.viewResult}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
