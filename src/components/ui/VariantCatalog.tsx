import { useNavStore } from '../../store/useNavStore';
import { useGameStore } from '../../store/useGameStore';
import { BackButton } from './BackButton';

export const VariantsCatalog = () => {
    const setScreen = useNavStore((state) => state.setScreen);
    const initGame = useGameStore((state) => state.initGame);

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
                            <button
                                onClick={() => handleSelectVariant('classic')}
                                className="w-full text-left p-4 bg-atlas-surface hover:bg-atlas-hover rounded-xl transition-all duration-200 shadow-sm group"
                            >
                                <div className="font-bold text-lg text-atlas-title Text opacity-90 group-hover:opacity-100">Classic Chess</div>
                                <div className="text-sm opacity-60 mt-1">
                                    The modern standard version of the game.
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Column 2: Historical Variants Section */}
                    <div>
                        <h3 className="text-xl text-atlas-titleText font-bold opacity-80 pb-2 mb-4 border-b border-atlas-hover">
                            Historical Variants
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleSelectVariant('chaturanga')}
                                className="w-full text-left p-4 bg-atlas-surface hover:bg-atlas-hover rounded-xl transition-all duration-200 shadow-sm group"
                            >
                                <div className="font-bold text-lg text-atlas-titleText opacity-90 group-hover:opacity-100">Chaturanga</div>
                                <div className="text-sm opacity-60 mt-1">
                                    The ancient Indian ancestor of chess.
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};