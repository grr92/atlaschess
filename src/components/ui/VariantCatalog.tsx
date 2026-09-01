import { useState } from "react";
import { useNavStore } from '../../store/useNavStore';
import { useGameStore } from '../../store/useGameStore';
import { BackButton } from './BackButton';
import { InfoButton } from './InfoButton';
import { VariantInfoModal } from '../modals/VariantInfoModal';

export const VariantsCatalog = () => {
    const setScreen = useNavStore((state) => state.setScreen);
    const initGame = useGameStore((state) => state.initGame);

    // state to control which variant info is being displayed in the modal
    const [infoVariantId, setInfoVariantId] = useState<string | null>(null);

    // Initialize the selected engine variant and route directly to the game screen
    const handleSelectVariant = (variantId: string) => {
        initGame(variantId);
        setScreen('GAME');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="max-w-4xl w-full bg-transparent rounded-2xl p-8">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl text-atlas-titleText md:text-4xl font-extrabold tracking-tight">
                        Variant Catalog
                    </h2>
                    <BackButton onClick={() => setScreen('MENU')} />
                </div>

                {/* Catalog Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Column 1: Regional Variants Section */}
                    <div>
                        <h3 className="text-xl text-atlas-titleText font-bold opacity-80 pb-2 mb-4 border-b border-atlas-hover">
                            Regional Variants
                        </h3>
                        <div className="space-y-3">
                            <div className="relative flex w-full bg-atlas-surface rounded-xl shadow-sm">
                                <button
                                    onClick={() => handleSelectVariant('classic')}
                                    className="flex-1 text-left p-4 hover:bg-atlas-hover transition-colors duration-200 group"
                                >
                                    <div className="font-bold text-lg text-atlas-titleText opacity-90 group-hover:opacity-100">Classic Chess</div>
                                    <div className="text-sm opacity-60 mt-1">
                                        The modern standard version of the game.
                                    </div>
                                </button>
                                <div className="flex items-center justify-center px-4 border-l border-atlas-hover/30">
                                    <InfoButton onClick={() => setInfoVariantId('classic')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Historical Variants Section */}
                    <div>
                        <h3 className="text-xl text-atlas-titleText font-bold opacity-80 pb-2 mb-4 border-b border-atlas-hover">
                            Historical Variants
                        </h3>
                        <div className="space-y-3">
                            <div className="relative flex w-full bg-atlas-surface rounded-xl shadow-sm">
                                <button
                                    onClick={() => handleSelectVariant('chaturanga')}
                                    className="flex-1 text-left p-4 hover:bg-atlas-hover transition-colors duration-200 group"
                                >
                                    <div className="font-bold text-lg text-atlas-titleText opacity-90 group-hover:opacity-100">Chaturanga</div>
                                    <div className="text-sm opacity-60 mt-1">
                                        The first known ancestor of chess.
                                    </div>
                                </button>
                                <div className="flex items-center justify-center px-4 border-l border-atlas-hover/30">
                                    <InfoButton onClick={() => setInfoVariantId('chaturanga')} />
                                </div>
                            </div>
                            <div className="relative flex w-full bg-atlas-surface rounded-xl shadow-sm mt-3">
                                <button
                                    onClick={() => handleSelectVariant('shatranj')}
                                    className="flex-1 text-left p-4 hover:bg-atlas-hover transition-colors duration-200 group"
                                >
                                    <div className="font-bold text-lg text-atlas-titleText opacity-90 group-hover:opacity-100">Shatranj</div>
                                    <div className="text-sm opacity-60 mt-1">
                                        The Persian golden age variant. Pawns auto-promote to Fers and stalemate is a win!
                                    </div>
                                </button>
                                <div className="flex items-center justify-center px-4 border-l border-atlas-hover/30">
                                    <InfoButton onClick={() => setInfoVariantId('shatranj')} />
                                </div>
                            </div>
                            <div className="relative flex w-full bg-atlas-surface rounded-xl shadow-sm mt-3">
                                <button
                                    onClick={() => handleSelectVariant('tamerlane')}
                                    className="flex-1 text-left p-4 hover:bg-atlas-hover transition-colors duration-200 group"
                                >
                                    <div className="font-bold text-lg text-atlas-titleText opacity-90 group-hover:opacity-100">Temarlane Chess</div>
                                    <div className="text-sm opacity-60 mt-1">
                                        Timur's epic 112-square variant. Command Camels, Giraffes, and siege the enemy Citadel!
                                    </div>
                                </button>
                                <div className="flex items-center justify-center px-4 border-l border-atlas-hover/30">
                                    <InfoButton onClick={() => setInfoVariantId('tamerlane')} />
                                </div>
                            </div>
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
        </div>
    );
};