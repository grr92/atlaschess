import { useState } from "react";
import { useNavStore } from '../../store/useNavStore';
import { useGameStore, type GameMode, type AiDifficulty } from '../../store/useGameStore';
import { BackButton } from './BackButton';
import { InfoButton } from './InfoButton';
import { VariantInfoModal } from '../modals/VariantInfoModal';
import { GameSetupModal } from '../modals/GameSetupModal';
import type { PieceColor } from '../../types';
import { Sparkles, Scroll, Compass } from 'lucide-react';

interface VariantCardData {
    id: string;
    title: string;
    origin: string;
    desc: string;
    tag: string;
}

export const VariantsCatalog = () => {
    const setScreen = useNavStore((state) => state.setScreen);
    const initGame = useGameStore((state) => state.initGame);

    // state to control which variant info is being displayed in the modal
    const [infoVariantId, setInfoVariantId] = useState<string | null>(null);
    // state to control game setup modal
    const [setupVariant, setSetupVariant] = useState<{ id: string; title: string } | null>(null);

    // Open setup modal for the chosen variant
    const handleSelectVariant = (variant: VariantCardData) => {
        setSetupVariant({ id: variant.id, title: variant.title });
    };

    const handleStartVariantGame = (mode: GameMode, playerColor: PieceColor, difficulty: AiDifficulty) => {
        if (!setupVariant) return;
        initGame(setupVariant.id, mode, playerColor, difficulty);
        setScreen('GAME');
    };

    const regionalVariants: VariantCardData[] = [
        {
            id: 'classic',
            title: 'Classic Chess',
            origin: '15th Century • Europe',
            tag: 'Standard',
            desc: 'The worldwide recognized modern rules with castling, en passant, and the queen.'
        }
    ];

    const historicalVariants: VariantCardData[] = [
        {
            id: 'chaturanga',
            title: 'Chaturanga',
            origin: '6th Century • India',
            tag: 'The Origin',
            desc: 'The ancient four-division ancestor of chess played on an 8x8 uncheckered Ashtāpada.'
        },
        {
            id: 'shatranj',
            title: 'Shatranj',
            origin: '7th Century • Persia',
            tag: 'Golden Age',
            desc: 'The strategic jewel of the Silk Road. Ferz moves 1 diagonal, Pil leaps 2, and bare king wins.'
        },
        {
            id: 'tamerlane',
            title: 'Tamerlane Chess',
            origin: '14th Century • Timurid Empire',
            tag: '112 Squares',
            desc: 'Timur\'s grand chess with Giraffes, Camels, War Engines, 11 unique pawns, and royal Citadels.'
        }
    ];

    const renderCard = (variant: VariantCardData) => (
        <div
            key={variant.id}
            className="group relative flex w-full bg-atlas-surface/80 hover:bg-atlas-hover/90 rounded-2xl shadow-lg border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-amber-500/10 hover:shadow-2xl overflow-hidden backdrop-blur-md"
        >
            <button
                onClick={() => handleSelectVariant(variant)}
                className="flex-1 text-left p-5 transition-transform duration-200"
            >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-extrabold text-xl text-atlas-titleText group-hover:text-amber-400 transition-colors">
                        {variant.title}
                    </h4>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        {variant.tag}
                    </span>
                </div>
                <div className="text-xs font-semibold text-amber-500/80 mb-2">
                    {variant.origin}
                </div>
                <p className="text-sm text-atlas-normalText leading-relaxed line-clamp-2">
                    {variant.desc}
                </p>
            </button>
            <div className="flex items-center justify-center px-4 border-l border-white/5 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors">
                <InfoButton onClick={() => setInfoVariantId(variant.id)} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
            <div className="max-w-5xl w-full rounded-3xl p-6 md:p-10 border border-white/10 bg-atlas-surface/40 backdrop-blur-xl shadow-2xl">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-atlas-titleText tracking-tight flex items-center gap-3">
                            <Compass className="w-8 h-8 text-amber-400" />
                            Variant Catalog
                        </h2>
                        <p className="text-sm text-atlas-normalText mt-1">
                            Choose an era and embark on a historical chess journey.
                        </p>
                    </div>
                    <BackButton onClick={() => setScreen('MENU')} />
                </div>

                {/* Catalog Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Column 1: Regional Variants Section */}
                    <div>
                        <h3 className="text-lg font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            Regional Variants
                        </h3>
                        <div className="space-y-4">
                            {regionalVariants.map(renderCard)}
                        </div>
                    </div>

                    {/* Column 2: Historical Variants Section */}
                    <div>
                        <h3 className="text-lg font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Scroll className="w-5 h-5 text-amber-400" />
                            Historical Variants
                        </h3>
                        <div className="space-y-4">
                            {historicalVariants.map(renderCard)}
                        </div>
                    </div>

                </div>
            </div>

            {/* variant info modal rendering */}
            {infoVariantId && (
                <VariantInfoModal
                    variantId={infoVariantId}
                    onClose={() => setInfoVariantId(null)}
                />
            )}

            {/* game setup modal */}
            {setupVariant && (
                <GameSetupModal
                    variantId={setupVariant.id}
                    variantTitle={setupVariant.title}
                    isOpen={!!setupVariant}
                    onClose={() => setSetupVariant(null)}
                    onStartGame={handleStartVariantGame}
                />
            )}
        </div>
    );
};