import React, { useState } from 'react';
import { Bot, Users, Play, X, Sparkles, Shield, Swords, Zap, Dices } from 'lucide-react';
import type { PieceColor } from '../../types';
import type { GameMode, AiDifficulty } from '../../store/useGameStore';

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
    const [mode, setMode] = useState<GameMode>('vs_ai');
    const [colorOption, setColorOption] = useState<'white' | 'black' | 'random'>('white');
    const [difficulty, setDifficulty] = useState<AiDifficulty>('medium');
    const [useDiceRule, setUseDiceRule] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleStart = () => {
        let chosenColor: PieceColor = 'white';
        if (colorOption === 'random') {
            chosenColor = Math.random() < 0.5 ? 'white' : 'black';
        } else {
            chosenColor = colorOption;
        }

        onStartGame(mode, chosenColor, difficulty, variantId === 'grant_acedrex' ? useDiceRule : false);
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
                        <p className="text-xs text-slate-400 mt-0.5">Select your game mode and preferences</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                        Game Mode
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
                                <span className="font-bold text-sm block">Vs Computer</span>
                                <span className="text-[11px] opacity-60">Fairy-Stockfish AI</span>
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
                                <span className="font-bold text-sm block">Pass & Play</span>
                                <span className="text-[11px] opacity-60">2 Players Local</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Grant Acedrex Ruleset Selector (Standard vs 8-Sided Die) */}
                {variantId === 'grant_acedrex' && (
                    <div className="mb-6">
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                            Ruleset Variant
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
                                    <div className="font-extrabold text-xs">Standard Rules</div>
                                    <div className="text-[10px] text-slate-400 font-normal">Pure strategy, no dice</div>
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
                                    <div className="font-extrabold text-xs">8-Sided Die (d8)</div>
                                    <div className="text-[10px] text-slate-400 font-normal">Alfonso X medieval rule</div>
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
                                Play As
                            </label>
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
                                    White
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
                                    Random
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
                                    Black
                                </button>
                            </div>
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                                AI Difficulty
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
                                    <span>Easy</span>
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
                                    <span>Medium</span>
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
                                    <span>Master</span>
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
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="flex-[2] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3 rounded-2xl font-black transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        <Play className="w-4 h-4 fill-slate-950" />
                        Start Match
                    </button>
                </div>

            </div>
        </div>
    );
};
