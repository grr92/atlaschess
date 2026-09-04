import { useState, useEffect } from 'react';
import { X, BookOpen, History, Sparkles, Scroll, Compass, Dices } from 'lucide-react';
import { getPieceImage } from '../../utils/pieceMapper';
import { soundManager } from '../../utils/soundManager';
import { CloseButton } from '../ui/CloseButton';
import { useTranslation } from '../../i18n';
import type { CodexBullet } from '../../i18n/types';

interface VariantInfoModalProps {
    variantId: string;
    onClose: () => void;
}

export const VariantInfoModal = ({ variantId, onClose }: VariantInfoModalProps) => {
    const { t, getVariantCodex } = useTranslation();
    const [activeTab, setActiveTab] = useState<'howToPlay' | 'history'>('howToPlay');

    const handleClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        soundManager.playUiClick();
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const data = getVariantCodex(variantId);

    const renderBulletIcon = (bullet: CodexBullet) => {
        if (bullet.pieceName) {
            const imgUrl = getPieceImage({ name: bullet.pieceName, color: 'white' } as any);
            if (imgUrl) {
                return <img src={imgUrl} alt={bullet.pieceName} className="w-5 h-5 object-contain -mt-1" />;
            }
        }

        if (bullet.iconType === 'dices') {
            return <Dices className="w-5 h-5 text-amber-400 -mt-0.5" />;
        }

        if (bullet.iconType === 'citadel') {
            return <div className="w-4 h-4 bg-amber-700/40 ring-2 ring-inset ring-amber-500 rounded-sm -mt-0.5" />;
        }

        if (bullet.iconType === 'check') {
            return <X className="w-5 h-5 text-amber-400" />;
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 md:p-8">
            {/* main modal container */}
            <div className="bg-slate-900/95 w-full max-w-5xl h-full max-h-[88vh] rounded-3xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 backdrop-blur-2xl">
                {/* header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-slate-950/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <Compass className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white capitalize tracking-tight">
                                {data.name}
                            </h2>
                            <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest mt-0.5">
                                {t.variantCodex.codexReference}
                            </p>
                        </div>
                    </div>

                    <CloseButton onClick={onClose} />
                </div>

                {/* tabs navigation */}
                <div className="flex border-b border-white/10 bg-slate-950/40 px-6 pt-2 gap-2">
                    <button
                        onClick={() => setActiveTab('howToPlay')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-bold text-base rounded-t-2xl transition-all ${
                            activeTab === 'howToPlay'
                                ? 'text-amber-400 bg-slate-900 border-t-2 border-x border-amber-500/40 -mb-[1px] shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>{t.variantCodex.howToPlayTab}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-bold text-base rounded-t-2xl transition-all ${
                            activeTab === 'history'
                                ? 'text-amber-400 bg-slate-900 border-t-2 border-x border-amber-500/40 -mb-[1px] shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        <span>{t.variantCodex.historicalOriginsTab}</span>
                    </button>
                </div>

                {/* content area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-slate-200">
                    {activeTab === 'howToPlay' ? (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
                                <h3 className="text-xl font-black text-amber-400 mb-2 flex items-center gap-2">
                                    <Scroll className="w-5 h-5 text-amber-400" />
                                    {t.variantCodex.objectiveTitle}
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed text-slate-300">
                                    {data.rules.intro}
                                </p>
                            </div>

                            <div className="space-y-3 mt-6">
                                <h4 className="text-xs uppercase font-extrabold tracking-widest text-amber-400/80 mb-3">
                                    {t.variantCodex.piecesTitle}
                                </h4>
                                {data.rules.bullets.map((bullet, index) => {
                                    const icon = renderBulletIcon(bullet);
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 bg-atlas-surface/60 hover:bg-atlas-hover/60 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-200 flex items-start gap-4 shadow-sm"
                                        >
                                            <div className="p-1 bg-amber-500/10 rounded-lg text-amber-400 font-bold text-xs mt-0.5 flex-shrink-0">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1 text-sm md:text-base leading-relaxed">
                                                <strong className="text-white font-extrabold inline-flex items-center gap-1.5 mr-2">
                                                    {icon}
                                                    {bullet.title}
                                                </strong>
                                                <span className="text-slate-300">
                                                    {bullet.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-400 rounded-2xl shadow-lg mt-8 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider mb-1">
                                    <Sparkles className="w-4 h-4" />
                                    {t.variantCodex.strategicInsight}
                                </div>
                                <p className="text-amber-100/90 font-medium text-sm md:text-base leading-relaxed">
                                    {data.rules.proTip}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
                                <h3 className="text-xl font-black text-amber-400 mb-2 flex items-center gap-2">
                                    <History className="w-5 h-5 text-amber-400" />
                                    {t.variantCodex.originsTitle}
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed text-slate-300">
                                    {data.history.intro}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="p-6 bg-atlas-surface/80 rounded-2xl border border-rose-500/20 shadow-lg backdrop-blur-md hover:border-rose-500/40 transition-colors">
                                    <h4 className="text-xl font-black text-rose-400 mb-3 tracking-tight">
                                        {data.history.leftBoxTitle}
                                    </h4>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        {data.history.leftBoxDesc}
                                    </p>
                                </div>
                                <div className="p-6 bg-atlas-surface/80 rounded-2xl border border-sky-500/20 shadow-lg backdrop-blur-md hover:border-sky-500/40 transition-colors">
                                    <h4 className="text-xl font-black text-sky-400 mb-3 tracking-tight">
                                        {data.history.rightBoxTitle}
                                    </h4>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        {data.history.rightBoxDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};