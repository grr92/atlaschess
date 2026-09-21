import React, { useEffect } from 'react';
import { Trophy, Swords, Handshake, RotateCcw, Eye, Home, Timer, Hash, Crown, Coins } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useNavStore } from '../../store/useNavStore';
import { VariantRegistry } from '../../core/variants/variantRegistry';
import { soundManager } from '../../utils/soundManager';
import { useTranslation } from '../../i18n';
import { CloseButton } from '../ui/CloseButton';
import { getGameOutcome } from '../../utils/gameOverUtils';
import type { PieceColor } from '../../types';

export interface GameOverModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose }) => {
    const {
        gameState,
        gameMode,
        playerColor,
        currentTurn,
        engine,
        history,
        gameTime,
        currentVariantId,
        resetGame,
    } = useGameStore();

    const setScreen = useNavStore((state) => state.setScreen);
    const { t } = useTranslation();

    const currentVariantDef = VariantRegistry.get(currentVariantId);
    const outcomeResult = getGameOutcome({
        gameState,
        gameMode,
        playerColor,
        currentTurn,
        engine,
        playerColors: currentVariantDef?.playerColors,
    });

    const {
        outcome,
        winnerColor,
        specialReason,
        chaturajiStakes,
        shogiJishogi,
        fourSeasonsWinner
    } = outcomeResult;

    // Play synthesized sound effect on mount / open
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            if (outcome === 'player_win' || outcome === 'pvp_win') {
                soundManager.playVictory();
            } else if (outcome === 'player_loss') {
                soundManager.playDefeat();
            } else if (outcome === 'draw') {
                soundManager.playDraw();
            }
        }, 120);

        return () => clearTimeout(timer);
    }, [isOpen, outcome]);

    if (!isOpen) return null;

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getPlayerColorName = (color: PieceColor | null) => {
        if (!color) return '';
        const key = color as keyof typeof t.common;
        return t.common[key] || color;
    };

    const handlePlayAgain = () => {
        soundManager.playUiClick();
        resetGame();
        onClose();
    };

    const handleReviewBoard = () => {
        soundManager.playUiClick();
        onClose();
    };

    const handleMainMenu = () => {
        soundManager.playUiClick();
        resetGame();
        setScreen('MENU');
    };

    // Calculate dynamic title & subtitle
    let customTitle: string | null = null;
    let customSubtitle: string | null = null;

    if (chaturajiStakes) {
        if (chaturajiStakes.winner) {
            const winnerName = getPlayerColorName(chaturajiStakes.winner);
            const stakesDesc = `${chaturajiStakes.maxStakes} ${t.gameplay.wonStakes.toLowerCase()}`;
            if (outcome === 'player_win') {
                customTitle = t.gameplay.victory;
                customSubtitle = `${t.gameplay.winnerByStakes}: ${winnerName} (${stakesDesc})`;
            } else if (outcome === 'player_loss') {
                customTitle = t.gameplay.defeat;
                customSubtitle = `${t.gameplay.winnerByStakes}: ${winnerName} (${stakesDesc})`;
            } else {
                customTitle = t.gameplay.playerVictory.replace('{player}', winnerName);
                customSubtitle = `${t.gameplay.winnerByStakes}: ${winnerName} (${stakesDesc})`;
            }
        } else if (chaturajiStakes.isTie) {
            customTitle = t.gameplay.draw;
            if (chaturajiStakes.maxStakes > 0) {
                const tiedNames = chaturajiStakes.tiedWinners.map((w) => getPlayerColorName(w)).join(' & ');
                customSubtitle = `${t.gameplay.draw}: ${tiedNames} (${chaturajiStakes.maxStakes} ${t.gameplay.wonStakes.toLowerCase()})`;
            } else {
                customSubtitle = t.gameplay.drawDesc;
            }
        }
    } else if (shogiJishogi) {
        if (shogiJishogi.result === 'draw') {
            customTitle = t.gameplay.shogiJishogiTitle;
            customSubtitle = t.gameplay.shogiJishogiDraw;
        } else {
            customTitle = outcome === 'player_win'
                ? t.gameplay.victory
                : outcome === 'player_loss'
                    ? t.gameplay.defeat
                    : t.gameplay.playerVictory.replace('{player}', getPlayerColorName(winnerColor));
            customSubtitle = t.gameplay.shogiJishogiWin;
        }
    } else if (fourSeasonsWinner && outcome === 'player_loss') {
        customSubtitle = `${getPlayerColorName(fourSeasonsWinner)} - ${t.gameplay.defeatDesc}`;
    }

    // Styling configurations based on outcome
    const config = {
        player_win: {
            title: customTitle || t.gameplay.victory,
            subtitle: customSubtitle || t.gameplay.victoryDesc,
            glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
            borderColor: 'border-amber-500/50',
            iconContainer: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
            icon: <Trophy className="w-12 h-12 animate-pulse text-amber-400" />,
        },
        player_loss: {
            title: customTitle || t.gameplay.defeat,
            subtitle: customSubtitle || t.gameplay.defeatDesc,
            glow: 'from-rose-500/20 via-red-900/10 to-transparent',
            borderColor: 'border-rose-500/40',
            iconContainer: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
            icon: <Swords className="w-12 h-12 text-rose-400" />,
        },
        pvp_win: {
            title: customTitle || t.gameplay.playerVictory.replace('{player}', getPlayerColorName(winnerColor)),
            subtitle: customSubtitle || (gameState === 'checkmate' ? t.gameplay.checkmate : t.gameplay.gameOverTitle),
            glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
            borderColor: 'border-amber-500/50',
            iconContainer: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
            icon: <Trophy className="w-12 h-12 text-amber-400" />,
        },
        draw: {
            title: customTitle || t.gameplay.draw,
            subtitle: customSubtitle || t.gameplay.drawDesc,
            glow: 'from-sky-500/20 via-blue-900/10 to-transparent',
            borderColor: 'border-sky-500/40',
            iconContainer: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
            icon: <Handshake className="w-12 h-12 text-sky-400" />,
        },
    }[outcome];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className={`bg-atlas-surface/95 border ${config.borderColor} rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl relative overflow-hidden text-center animate-in zoom-in-95 duration-200`}>
                
                {/* Ambient glow decoration */}
                <div className={`absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br ${config.glow} rounded-full blur-3xl pointer-events-none`} />
                <div className={`absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-tl ${config.glow} rounded-full blur-3xl pointer-events-none`} />

                {/* Close (review board) button */}
                <div className="absolute top-4 right-4 z-10">
                    <CloseButton onClick={handleReviewBoard} />
                </div>

                {/* Outcome Icon */}
                <div className="flex justify-center mb-4 relative">
                    <div className={`p-4 rounded-2xl border shadow-lg ${config.iconContainer}`}>
                        {config.icon}
                    </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-black text-atlas-titleText tracking-tight mb-1">
                    {config.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {config.subtitle}
                    {specialReason && !chaturajiStakes && !shogiJishogi && (
                        <span className="block text-xs font-semibold text-amber-400 mt-1">
                            ({specialReason})
                        </span>
                    )}
                </p>

                {/* Chaturaji Stakes Leaderboard */}
                {chaturajiStakes && (
                    <div className="mb-5 bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                {t.gameplay.chaturajiStakesTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                {t.gameplay.winnerByStakes}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {(['red', 'green', 'yellow', 'blue'] as const).map((color) => {
                                const isWinner = chaturajiStakes.winner === color;
                                const isTied = chaturajiStakes.isTie && chaturajiStakes.tiedWinners.includes(color) && chaturajiStakes.maxStakes > 0;
                                const score = chaturajiStakes.stakes[color] || 0;
                                const dotClass = color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-emerald-500' : color === 'yellow' ? 'bg-amber-400' : 'bg-sky-500';
                                return (
                                    <div
                                        key={color}
                                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                                            isWinner
                                                ? 'bg-amber-500/20 border border-amber-400/60 font-bold shadow-sm'
                                                : isTied
                                                    ? 'bg-sky-500/15 border border-sky-400/40 font-bold'
                                                    : 'bg-white/5 border border-white/5 text-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 truncate">
                                            <div className={`w-2.5 h-2.5 rounded-full ${dotClass} flex-shrink-0`} />
                                            <span className={isWinner ? 'text-amber-200' : isTied ? 'text-sky-200' : 'text-slate-300'}>
                                                {getPlayerColorName(color)}
                                            </span>
                                            {isWinner && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                                        </div>
                                        <span className={`font-mono text-xs ml-1 flex-shrink-0 ${isWinner ? 'text-amber-300 font-black' : 'text-slate-300'}`}>
                                            {score}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Shogi Jishogi Impasse Points Box */}
                {shogiJishogi && (
                    <div className="mb-5 bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                {t.gameplay.shogiJishogiTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                24 pts
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className={`flex items-center justify-between p-2 rounded-xl text-xs ${shogiJishogi.whitePoints >= 24 ? 'bg-amber-500/20 border border-amber-400/50' : 'bg-white/5 border border-white/5'}`}>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white border border-white/40" />
                                    <span className="text-slate-200 font-semibold">{t.gameplay.shogiSentePlayer}</span>
                                    {shogiJishogi.whitePoints >= 24 && <Crown className="w-3 h-3 text-amber-400" />}
                                </div>
                                <span className="font-mono font-black text-amber-300">{shogiJishogi.whitePoints} pts</span>
                            </div>
                            <div className={`flex items-center justify-between p-2 rounded-xl text-xs ${shogiJishogi.blackPoints >= 24 ? 'bg-amber-500/20 border border-amber-400/50' : 'bg-white/5 border border-white/5'}`}>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/40" />
                                    <span className="text-slate-200 font-semibold">{t.gameplay.shogiGotePlayer}</span>
                                    {shogiJishogi.blackPoints >= 24 && <Crown className="w-3 h-3 text-amber-400" />}
                                </div>
                                <span className="font-mono font-black text-amber-300">{shogiJishogi.blackPoints} pts</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Match Summary Box */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-3 divide-x divide-white/10">
                        <div className="flex flex-col items-center justify-center p-1">
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                                <Hash className="w-3.5 h-3.5 text-amber-400" />
                                {t.gameplay.matchMoves}
                            </span>
                            <span className="text-lg font-black text-slate-100 font-mono">
                                {history.length}
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-1">
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                                <Timer className="w-3.5 h-3.5 text-amber-400" />
                                {t.gameplay.matchDuration}
                            </span>
                            <span className="text-lg font-black text-slate-100 font-mono tracking-wider">
                                {formatTime(gameTime)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5">
                    <button
                        onClick={handlePlayAgain}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 border border-amber-300/40"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>{t.gameplay.playAgain}</span>
                    </button>

                    <button
                        onClick={handleReviewBoard}
                        className="w-full bg-atlas-surface/80 hover:bg-atlas-hover text-slate-200 border border-white/15 hover:border-amber-500/40 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 backdrop-blur-md"
                    >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>{t.gameplay.reviewBoard}</span>
                    </button>

                    <button
                        onClick={handleMainMenu}
                        className="w-full bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 mt-1"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>{t.gameplay.backToMenu}</span>
                    </button>
                </div>

            </div>
        </div>
    );
};
