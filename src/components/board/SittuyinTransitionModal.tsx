import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';
import { SittuyinEngine } from '../../core/engine/SittuyinEngine';
import { EyeOff, ArrowRight } from 'lucide-react';

export const SittuyinTransitionModal: React.FC = () => {
    const { t } = useTranslation();
    const { engine, startBlackSittuyinDeploy } = useGameStore();

    if (!engine || !(engine instanceof SittuyinEngine) || engine.deployStage !== 'transition') {
        return null;
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-lg animate-fadeIn p-4">
            <div className="bg-slate-900 border-2 border-amber-600/50 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-1">
                    <EyeOff className="w-8 h-8" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {t.gameplay.sittuyinTransitionTitle}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                    {t.gameplay.sittuyinTransitionSubtitle}
                </p>

                <div className="w-full pt-3">
                    <button
                        type="button"
                        onClick={startBlackSittuyinDeploy}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-600/25 border border-amber-300/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                        <span>{t.gameplay.sittuyinTransitionStartBlack}</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
