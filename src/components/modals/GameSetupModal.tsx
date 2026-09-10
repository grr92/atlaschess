import React, { useState, useEffect } from 'react';
import { Bot, Users, Play, Sparkles, Shield, Swords, Zap, Dices } from 'lucide-react';
import type { PieceColor } from '../../types';
import type { GameMode, AiDifficulty } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundManager';
import { CloseButton } from '../ui/CloseButton';
import { useTranslation } from '../../i18n';

import { VariantRegistry } from '../../core/variants/variantRegistry';

interface GameSetupModalProps {
    variantId: string;
    variantTitle?: string;
    isOpen: boolean;
    onClose: () => void;
    onStartGame: (mode: GameMode, playerColor: PieceColor, difficulty: AiDifficulty, useDiceRule?: boolean) => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
    variantId,
    variantTitle = 'Chess',
    isOpen,
    onClose,
    onStartGame,
}) => {
    const { t } = useTranslation();
    const variantDef = VariantRegistry.get(variantId);
    const supportsDice = !!variantDef?.supportsDiceRule;
    const isChaturaji = variantId === 'chaturaji';
    const isFourSeasons = variantId === 'four_seasons';
    const isFourPlayer = isChaturaji || isFourSeasons;

    const [mode, setMode] = useState<GameMode>('vs_ai');
    const [colorOption, setColorOption] = useState<string>(isFourSeasons ? 'green' : (isChaturaji ? 'red' : 'white'));
    const [difficulty, setDifficulty] = useState<AiDifficulty>('medium');
    const [useDiceRule, setUseDiceRule] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) return;
        if (isFourSeasons && (colorOption === 'yellow' || colorOption === 'blue')) {
            setColorOption('green');
        } else if (isChaturaji && (colorOption === 'white' || colorOption === 'black')) {
            setColorOption('red');
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                soundManager.playUiClick();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, isChaturaji, isFourSeasons, colorOption]);

    if (!isOpen) return null;

    const handleStart = () => {
        let chosenColor: PieceColor = 'white';
        if (isFourSeasons) {
            if (colorOption === 'random') {
                const colors: PieceColor[] = ['green', 'red', 'black', 'white'];
                chosenColor = colors[Math.floor(Math.random() * colors.length)];
            } else {
                chosenColor = colorOption as PieceColor;
            }
        } else if (isChaturaji) {
            if (colorOption === 'random') {
                const colors: PieceColor[] = ['red', 'green', 'yellow', 'blue'];
                chosenColor = colors[Math.floor(Math.random() * colors.length)];
            } else {
                chosenColor = colorOption as PieceColor;
            }
        } else {
            if (colorOption === 'random') {
                chosenColor = Math.random() < 0.5 ? 'white' : 'black';
            } else {
                chosenColor = colorOption as PieceColor;
            }
        }

        soundManager.playUiClick();
        onStartGame(mode, chosenColor, difficulty, supportsDice ? useDiceRule : false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-atlas-surface/95 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl backdrop-blur-xl relative overflow-hidden">
                
                {/* Background Ambient Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/10">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black text-atlas-titleText tracking-tight flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-400" />
                            {variantTitle}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{t.gameSetup.subtitle}</p>
                    </div>
                    <CloseButton onClick={onClose} />
                </div>

                {/* Mode Selector */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                        {t.gameSetup.modeLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setMode('vs_ai')}
                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                                mode === 'vs_ai'
                                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                            }`}
                        >
                            <Bot className={`w-7 h-7 ${mode === 'vs_ai' ? 'text-amber-400' : 'text-slate-400'}`} />
                            <div className="text-center">
                                <span className="font-bold text-sm block">{t.gameSetup.vsAi}</span>
                                <span className="text-[11px] opacity-60">
                                    {isChaturaji ? 'Heuristic AI' : t.gameSetup.vsAiSub}
                                </span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('pvp')}
                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                                mode === 'pvp'
                                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                            }`}
                        >
                            <Users className={`w-7 h-7 ${mode === 'pvp' ? 'text-amber-400' : 'text-slate-400'}`} />
                            <div className="text-center">
                                <span className="font-bold text-sm block">
                                    {isFourPlayer ? t.gameSetup.pvp4Players : t.gameSetup.pvp}
                                </span>
                                <span className="text-[11px] opacity-60">
                                    {isFourPlayer ? t.gameSetup.pvp4PlayersSub : t.gameSetup.pvpSub}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Ruleset Selector (Standard vs Dice) */}
                {supportsDice && (
                    <div className="mb-6">
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                            {t.gameSetup.rulesetVariant}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setUseDiceRule(false)}
                                className={`p-3 rounded-2xl border flex items-center gap-3 font-bold text-sm transition-all ${
                                    !useDiceRule
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                                        : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                                }`}
                            >
                                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-extrabold text-xs">{t.gameSetup.standardRules}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">{t.gameSetup.standardRulesSub}</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setUseDiceRule(true)}
                                className={`p-3 rounded-2xl border flex items-center gap-3 font-bold text-sm transition-all ${
                                    useDiceRule
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                                        : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                                }`}
                            >
                                <Dices className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-extrabold text-xs">
                                        {isFourSeasons ? t.gameSetup.diceRuleFourSeasons : (isChaturaji ? t.gameSetup.diceRuleChaturaji : t.gameSetup.diceRule)}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-normal">
                                        {isFourSeasons ? t.gameSetup.diceRuleFourSeasonsSub : (isChaturaji ? t.gameSetup.diceRuleChaturajiSub : t.gameSetup.diceRuleSub)}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Configuration Section */}
                {mode === 'vs_ai' && (
                    <div className="space-y-5 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Play As (Color) */}
                        <div>
                            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                                {t.gameSetup.playAs}
                            </label>
                            {isFourSeasons ? (
                                <div className="grid grid-cols-5 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setColorOption('green')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'green'
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-2 ring-emerald-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
                                        {t.common.green}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('red')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'red'
                                                ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md ring-2 ring-red-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm" />
                                        {t.common.red}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('black')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'black'
                                                ? 'bg-slate-950 text-white border-slate-600 shadow-md ring-2 ring-slate-400'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-500 shadow-sm" />
                                        {t.common.black}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('white')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'white'
                                                ? 'bg-white/20 border-white text-white shadow-md ring-2 ring-white'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                                        {t.common.white}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('random')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'random'
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-2 ring-amber-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        {t.common.random}
                                    </button>
                                </div>
                            ) : isChaturaji ? (
                                <div className="grid grid-cols-5 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setColorOption('red')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'red'
                                                ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md ring-2 ring-red-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm" />
                                        {t.common.red}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('green')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'green'
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-2 ring-emerald-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
                                        {t.common.green}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('yellow')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'yellow'
                                                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                                        {t.common.yellow}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('blue')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'blue'
                                                ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md ring-2 ring-sky-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-sm" />
                                        {t.common.blue}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('random')}
                                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] transition-all ${
                                            colorOption === 'random'
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-2 ring-amber-500'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        {t.common.random}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setColorOption('white')}
                                        className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                                            colorOption === 'white'
                                                ? 'bg-white text-slate-950 border-white shadow-md'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-white ring-1 ring-slate-400" />
                                        {t.common.white}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('random')}
                                        className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                                            colorOption === 'random'
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        {t.common.random}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setColorOption('black')}
                                        className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                                            colorOption === 'black'
                                                ? 'bg-slate-950 text-white border-slate-600 shadow-md'
                                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-white/50" />
                                        {t.common.black}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                                {t.gameSetup.aiDifficulty}
                            </label>
                            <div className="grid grid-cols-3 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDifficulty('easy')}
                                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold text-xs transition-all ${
                                        difficulty === 'easy'
                                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                            : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                                    }`}
                                >
                                    <Zap className="w-4 h-4 text-emerald-400" />
                                    <span>{t.gameSetup.easy}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDifficulty('medium')}
                                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold text-xs transition-all ${
                                        difficulty === 'medium'
                                            ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                                            : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                                    }`}
                                >
                                    <Shield className="w-4 h-4 text-amber-400" />
                                    <span>{t.gameSetup.medium}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDifficulty('hard')}
                                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold text-xs transition-all ${
                                        difficulty === 'hard'
                                            ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                                            : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                                    }`}
                                >
                                    <Swords className="w-4 h-4 text-rose-400" />
                                    <span>{t.gameSetup.master}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-slate-900/60 hover:bg-slate-800 text-slate-300 py-3 rounded-2xl font-bold transition-all border border-white/10 active:scale-95 text-sm"
                    >
                        {t.common.cancel}
                    </button>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="flex-[2] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3 rounded-2xl font-black transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        <Play className="w-4 h-4 fill-slate-950" />
                        {t.gameSetup.startMatch}
                    </button>
                </div>

            </div>
        </div>
    );
};
