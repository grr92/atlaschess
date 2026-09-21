import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';
import { getPieceValue, getPieceSortOrder } from '../../core/pieces/pieceRegistry';
import { ChaturajiEngine, type ChaturajiColor } from '../../core/engine/ChaturajiEngine';
import { FourSeasonsEngine, type FourSeasonsColor } from '../../core/engine/FourSeasonsEngine';
import { ShogiEngine } from '../../core/engine/ShogiEngine';
import { createShogiPiece } from '../../core/variants/shogi/shogiSetup';
import { useTranslation } from '../../i18n';
import { VariantRegistry } from '../../core/variants/variantRegistry';

const CHATURAJI_PLAYERS: { color: ChaturajiColor; labelKey: 'red' | 'green' | 'yellow' | 'blue'; bgDot: string }[] = [
    { color: 'red', labelKey: 'red', bgDot: 'bg-red-500' },
    { color: 'green', labelKey: 'green', bgDot: 'bg-emerald-500' },
    { color: 'yellow', labelKey: 'yellow', bgDot: 'bg-amber-400' },
    { color: 'blue', labelKey: 'blue', bgDot: 'bg-sky-500' },
];

const FOUR_SEASONS_PLAYERS: { color: FourSeasonsColor; labelKey: 'green' | 'red' | 'black' | 'white'; bgDot: string }[] = [
    { color: 'green', labelKey: 'green', bgDot: 'bg-emerald-500' },
    { color: 'red', labelKey: 'red', bgDot: 'bg-red-500' },
    { color: 'black', labelKey: 'black', bgDot: 'bg-slate-950 border border-slate-500' },
    { color: 'white', labelKey: 'white', bgDot: 'bg-white' },
];

export const CapturedPieces = () => {
    const { t } = useTranslation();
    const engine = useGameStore(state => state.engine);
    const history = useGameStore(state => state.history);
    const gameMode = useGameStore(state => state.gameMode);
    const playerColor = useGameStore(state => state.playerColor);
    const currentVariantId = useGameStore(state => state.currentVariantId);
    const regionalPieceStyle = useGameStore(state => state.regionalPieceStyle);
    const shogiSelectedPiece = useGameStore(state => state.shogiSelectedPiece);
    const selectShogiDropPiece = useGameStore(state => state.selectShogiDropPiece);
    const isAiThinking = useGameStore(state => state.isAiThinking);

    const isShogiFlipped = gameMode === 'vs_ai' && playerColor === 'black';

    // Shogi Komadai (In-hand pieces) layout
    if (engine instanceof ShogiEngine) {
        const isHumanTurn = gameMode !== 'vs_ai' || engine.currentTurn === playerColor;

        const renderHand = (color: 'white' | 'black', label: string) => {
            const hand = engine.inHand[color];
            const isTurn = engine.currentTurn === color;
            const canInteract = isTurn && isHumanTurn && !isAiThinking;

            const counts = ['ShogiRook', 'ShogiBishop', 'ShogiGold', 'ShogiSilver', 'ShogiKnight', 'ShogiLance', 'ShogiPawn'].map(name => ({
                name,
                count: hand.filter(p => p === name).length
            })).filter(item => item.count > 0);

            return (
                <div className={`p-2.5 rounded-xl border transition-all ${
                    isTurn ? 'bg-amber-500/10 border-amber-500/40 shadow-md' : 'bg-slate-900/40 border-white/10'
                }`}>
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full shadow-md ${color === 'white' ? 'bg-white' : 'bg-slate-950 border border-slate-600'}`} />
                            <span className="text-xs font-bold text-slate-200">{label}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({hand.length})</span>
                        </div>
                        {isTurn && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                                {t.gameplay.playing}
                            </span>
                        )}
                    </div>

                    {counts.length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic py-1 pl-1 min-h-[36px] flex items-center">
                            {t.gameplay.shogiKomadaiEmpty}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5 items-center min-h-[36px]">
                            {counts.map(({ name, count }) => {
                                const isSelected = shogiSelectedPiece === name && isTurn;
                                const dummy = createShogiPiece(name, color, { x: 0, y: 0 });
                                const img = getPieceImage(dummy, regionalPieceStyle);

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        disabled={!canInteract}
                                        onClick={() => selectShogiDropPiece(isSelected ? null : name)}
                                        className={`relative p-1 rounded-lg border transition-all ${
                                            isSelected
                                                ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400/80 shadow-md scale-105'
                                                : canInteract
                                                ? 'bg-slate-800/80 border-white/15 hover:border-amber-400/50 hover:bg-slate-700/80 cursor-pointer'
                                                : 'bg-slate-800/40 border-white/10 cursor-default'
                                        }`}
                                        title={`${name} (x${count})`}
                                    >
                                        <img src={img!} alt={name} className="w-6 h-6 object-contain pointer-events-none" />
                                        <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full border border-amber-300">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        };

        const topPlayer = isShogiFlipped ? 'white' : 'black';
        const bottomPlayer = isShogiFlipped ? 'black' : 'white';
        const topLabel = topPlayer === 'black' ? t.gameplay.shogiGotePlayer : t.gameplay.shogiSentePlayer;
        const bottomLabel = bottomPlayer === 'white' ? t.gameplay.shogiSentePlayer : t.gameplay.shogiGotePlayer;

        return (
            <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">
                <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5 flex items-center justify-between">
                    <span>{t.gameplay.shogiKomadaiTitle}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                        {shogiSelectedPiece ? t.gameplay.shogiSelectDropSquare : ''}
                    </span>
                </h3>

                <div className="flex-1 flex flex-col justify-between gap-3">
                    {renderHand(topPlayer, topLabel)}
                    <div className="mt-auto">
                        {renderHand(bottomPlayer, bottomLabel)}
                    </div>
                </div>
            </div>
        );
    }

    // 4-Player Four Seasons layout
    if (engine instanceof FourSeasonsEngine) {
        const capturedMap = engine.capturedPiecesByPlayer;
        const totalCapturesCount = Object.values(capturedMap).reduce((sum, arr) => sum + arr.length, 0);

        return (
            <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">
                <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                    {t.gameplay.capturedPieces}
                </h3>

                <div className="flex-1 flex flex-col justify-around gap-2 overflow-y-auto">
                    {totalCapturesCount === 0 ? (
                        <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                            {t.gameplay.noCaptures}
                        </div>
                    ) : (
                        FOUR_SEASONS_PLAYERS.map(({ color, labelKey, bgDot }) => {
                            const pieces = capturedMap[color] || [];
                            const sortedPieces = [...pieces].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));
                            const colorName = t.common[labelKey];

                            const isKingAlive = engine.hasKingAlive(color);
                            const controller = engine.getActiveController(color);
                            const isAnnexed = !isKingAlive && controller !== color;
                            const annexedArmies = engine.annexedArmies[color]?.filter(c => c !== color) || [];
                            const controllerName = t.common[controller as keyof typeof t.common] || controller;

                            return (
                                <div key={color} className={`flex flex-col gap-1 p-2 rounded-xl border transition-all ${
                                    isAnnexed ? 'bg-slate-950/40 border-white/5 opacity-60' : 'bg-slate-900/40 border-white/10'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${bgDot}`} />
                                            <span className={`text-[11px] font-bold ${isAnnexed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                                {colorName}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">({pieces.length})</span>
                                        </div>
                                        {isAnnexed && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                                                {t.gameplay.annexedBy} {controllerName}
                                            </span>
                                        )}
                                        {isKingAlive && annexedArmies.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-[9px] text-amber-300 font-semibold">{t.gameplay.commandingArmies}:</span>
                                                {annexedArmies.map(ann => {
                                                    const annDot = FOUR_SEASONS_PLAYERS.find(p => p.color === ann)?.bgDot || 'bg-white';
                                                    return (
                                                        <span key={ann} className={`w-2 h-2 rounded-full ${annDot}`} title={t.common[ann as keyof typeof t.common]} />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 items-center min-h-[1.5rem] pl-4">
                                        {sortedPieces.length === 0 ? (
                                            <span className="text-[10px] text-slate-500 italic">-</span>
                                        ) : (
                                            sortedPieces.map((p, i) => (
                                                <img
                                                    key={`${p.id}-${i}`}
                                                    src={getPieceImage(p)!}
                                                    alt={p.name}
                                                    className={`w-5 h-5 opacity-90 drop-shadow-md ${i > 0 ? '-ml-1.5' : ''}`}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // 4-Player Chaturaji layout
    if (engine instanceof ChaturajiEngine) {
        const capturedMap = engine.capturedPiecesByPlayer;
        const totalCapturesCount = Object.values(capturedMap).reduce((sum, arr) => sum + arr.length, 0);

        return (
            <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">
                <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                    {t.gameplay.capturedPieces}
                </h3>

                <div className="flex-1 flex flex-col justify-around gap-2 overflow-y-auto">
                    {totalCapturesCount === 0 ? (
                        <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                            {t.gameplay.noCaptures}
                        </div>
                    ) : (
                        CHATURAJI_PLAYERS.map(({ color, labelKey, bgDot }) => {
                            const pieces = capturedMap[color] || [];
                            const sortedPieces = [...pieces].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));
                            const colorName = t.common[labelKey];

                            return (
                                <div key={color} className="flex flex-col gap-1 bg-slate-900/30 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${bgDot}`} />
                                        <span className="text-[11px] font-bold text-slate-300">{colorName}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">({pieces.length})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 items-center min-h-[1.5rem] pl-4">
                                        {sortedPieces.length === 0 ? (
                                            <span className="text-[10px] text-slate-500 italic">-</span>
                                        ) : (
                                            sortedPieces.map((p, i) => (
                                                <img
                                                    key={`${p.id}-${i}`}
                                                    src={getPieceImage(p)!}
                                                    alt={p.name}
                                                    className={`w-5 h-5 opacity-90 drop-shadow-md ${i > 0 ? '-ml-1.5' : ''}`}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // 2-Player Standard layout
    const variantDef = VariantRegistry.get(currentVariantId);
    const [player1Color, player2Color] = (variantDef?.playerColors && variantDef.playerColors.length === 2)
        ? variantDef.playerColors
        : ['white', 'black'];
    const isFlipped = gameMode === 'vs_ai' && playerColor === player2Color;

    // Pieces captured by Player 1
    const player1Captures = history
        .filter(m => (m.piece?.color === player1Color || (!variantDef?.playerColors && m.piece?.color === 'white')) && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Pieces captured by Player 2
    const player2Captures = history
        .filter(m => m.piece?.color === player2Color && m.capturedPiece)
        .map(m => m.capturedPiece!);

    // Score calculations using centralized piece registry (normalized to 1 pawn = 1.0)
    const player1Score = player1Captures.reduce((acc, p) => acc + (getPieceValue(p.name) / 100), 0);
    const player2Score = player2Captures.reduce((acc, p) => acc + (getPieceValue(p.name) / 100), 0);

    const player1Advantage = player1Score - player2Score;
    const player2Advantage = player2Score - player1Score;

    // Sorting of captured pieces by their predefined registry sort order
    const sortedPlayer1Captures = [...player1Captures].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));
    const sortedPlayer2Captures = [...player2Captures].sort((a, b) => getPieceSortOrder(a.name) - getPieceSortOrder(b.name));

    const totalCaptures = sortedPlayer1Captures.length + sortedPlayer2Captures.length;

    // Determine top and bottom rows based on board orientation
    const topCaptures = isFlipped ? sortedPlayer1Captures : sortedPlayer2Captures;
    const topAdvantage = isFlipped ? player1Advantage : player2Advantage;
    const bottomCaptures = isFlipped ? sortedPlayer2Captures : sortedPlayer1Captures;
    const bottomAdvantage = isFlipped ? player2Advantage : player1Advantage;

    // Helper function to render a player's capture row
    const pieceStyle = regionalPieceStyle;

    const renderRow = (pieces: any[], advantage: number) => (
        <div className="flex items-center justify-between min-h-[1.5rem]">
            <div className="flex flex-wrap gap-y-1 items-center flex-1 pr-2">
                {pieces.map((p, i) => {
                    const imgSrc = getPieceImage(p, pieceStyle);
                    return (
                        <img
                            key={`${p.id}-${i}`}
                            src={imgSrc!}
                            alt={p.name}
                            className={`w-5 h-5 md:w-6 md:h-6 opacity-90 drop-shadow-md ${i > 0 ? '-ml-2' : ''}`}
                        />
                    );
                })}
            </div>
            {advantage > 0 && (
                <span className="text-xs md:text-sm font-bold whitespace-nowrap flex-shrink-0 text-atlas-normalText">
                    +{Math.round(advantage * 10) / 10}
                </span>
            )}
        </div>
    );

    return (
        // Reusing identical structural footprint as MoveHistory for visual coherence
        <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">

            <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                {t.gameplay.capturedPieces}
            </h3>

            <div className="flex-1 flex flex-col justify-between">
                {totalCaptures === 0 ? (
                    // Empty state fallback
                    <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                        {t.gameplay.noCaptures}
                    </div>
                ) : (
                    <>
                        {/* Top Section: captures for the player on top */}
                        <div>
                            {renderRow(topCaptures, topAdvantage)}
                        </div>

                        {/* Bottom Section: captures for the player on bottom */}
                        <div className="mt-auto">
                            {renderRow(bottomCaptures, bottomAdvantage)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};