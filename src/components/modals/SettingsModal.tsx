import React, { useEffect } from 'react';
import { Settings, Volume2, VolumeX, Globe, Check } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { AppLanguage } from '../../store/types';
import { soundManager } from '../../utils/soundManager';
import { FlagUK, FlagSpain, FlagCatalonia } from '../ui/FlagIcons';
import { CloseButton } from '../ui/CloseButton';
import { useTranslation } from '../../i18n';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LANGUAGES: { id: AppLanguage; icon: React.ReactNode; nativeName: string }[] = [
    { id: 'en', icon: <FlagUK className="w-8 h-5" />, nativeName: 'English' },
    { id: 'es', icon: <FlagSpain className="w-8 h-5" />, nativeName: 'Español' },
    { id: 'ca', icon: <FlagCatalonia className="w-8 h-5" />, nativeName: 'Català' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { isMuted, toggleMute, language, setLanguage } = useGameStore();
    const { t } = useTranslation();

    const handleClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        soundManager.playUiClick();
        onClose();
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleToggleMute = () => {
        toggleMute();
        soundManager.playUiClick();
    };

    const handleSelectLanguage = (lang: AppLanguage) => {
        soundManager.playUiClick();
        setLanguage(lang);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-atlas-surface/95 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/10">
                    <div>
                        <h3 className="text-2xl font-black text-atlas-titleText tracking-tight flex items-center gap-2">
                            <Settings className="w-6 h-6 text-amber-400" />
                            {t.settings.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{t.settings.subtitle}</p>
                    </div>
                    <CloseButton onClick={onClose} />
                </div>

                {/* Settings Content */}
                <div className="space-y-6">
                    {/* Audio Setting */}
                    <div>
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3">
                            {t.settings.audioSection}
                        </label>
                        <button
                            onClick={handleToggleMute}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                isMuted
                                    ? 'bg-red-500/10 border-red-500/40 text-red-200'
                                    : 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {isMuted ? (
                                    <VolumeX className="w-6 h-6 text-red-400" />
                                ) : (
                                    <Volume2 className="w-6 h-6 text-amber-400" />
                                )}
                                <div className="text-left">
                                    <div className="font-bold text-sm">{t.settings.gameSoundEffects}</div>
                                    <div className="text-xs opacity-75">
                                        {isMuted ? t.settings.soundMuted : t.settings.soundActive}
                                    </div>
                                </div>
                            </div>
                            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                                isMuted ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                                {isMuted ? t.settings.mutedBadge : t.settings.enabledBadge}
                            </span>
                        </button>
                    </div>

                    {/* Language Setting */}
                    <div>
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {t.settings.languageSection}
                        </label>
                        <div className="grid grid-cols-1 gap-2.5">
                            {LANGUAGES.map((item) => {
                                const isSelected = language === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelectLanguage(item.id)}
                                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {item.icon}
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{item.nativeName}</div>
                                                <div className="text-xs opacity-60">{t.settings.languages[item.id]}</div>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Close */}
                <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md active:scale-95"
                    >
                        {t.common.done}
                    </button>
                </div>
            </div>
        </div>
    );
};
