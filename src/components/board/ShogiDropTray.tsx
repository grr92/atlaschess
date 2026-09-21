import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';
import { ShogiEngine } from '../../core/engine/ShogiEngine';
import { getPieceImage } from '../../utils/pieceMapper';
import { createShogiPiece } from '../../core/variants/shogi/shogiSetup';
import type { PieceColor } from '../../types';

const SHOGI_DROP_PIECES = [
    { name: 'ShogiRook', label: '飛' },
    { name: 'ShogiBishop', label: '角' },
    { name: 'ShogiGold', label: '金' },
    { name: 'ShogiSilver', label: '銀' },
    { name: 'ShogiKnight', label: '桂' },
    { name: 'ShogiLance', label: '香' },
    { name: 'ShogiPawn', label: '歩' },
];

export const ShogiDropTray: React.FC = () => {
    const { t } = useTranslation();
    const {
        engine,
        currentTurn,
        shogiSelectedPiece,
        selectShogiDropPiece,
        declareShogiJishogi,
        regionalPieceStyle,
        gameMode,
        playerColor,
        isAiThinking
    } = useGameStore();

    if (!engine || !(engine instanceof ShogiEngine)) {
        return null;
    }

    const isPvAi = gameMode === 'vs_ai';
    const isHumanTurn = !isPvAi || currentTurn === playerColor;

    const hand = engine.inHand[currentTurn as 'white' | 'black'] || [];
    const isWhite = currentTurn === 'white';
    const playerTitle = isWhite
        ? t.gameplay.shogiSentePlayer
        : t.gameplay.shogiGotePlayer;

    // Map all 7 droppable piece types in fixed order
    const pieceItems = SHOGI_DROP_PIECES.map(p => ({
        ...p,
        count: hand.filter(item => item === p.name).length
    }));

    return (
        <div className="w-full max-w-[288px] sm:max-w-[396px] lg:max-w-[548px] mt-3 p-2.5 sm:p-3 bg-slate-900/90 border-2 border-amber-600/40 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-2 transition-all">
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ring-2 ring-white/30 shadow-md ${isWhite ? 'bg-white' : 'bg-slate-950 border border-slate-700'}`} />
                    <h3 className="text-xs sm:text-sm font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                        <span>{t.gameplay.shogiKomadaiTitle}</span>
                        <span className="text-white/40">&bull;</span>
                        <span className="text-slate-200 font-semibold">{playerTitle}</span>
                    </h3>
                </div>

                <div className="text-[10px] sm:text-xs text-slate-300 font-semibold truncate">
                    {shogiSelectedPiece ? (
                        <span className="text-amber-400 font-bold animate-pulse">
                            {t.gameplay.shogiSelectDropSquare}
                        </span>
                    ) : (
                        <span>{t.gameplay.shogiDropInstruction}</span>
                    )}
                </div>
            </div>

            {/* Jishogi (Impasse) Declaration Banner */}
            {engine.canDeclareJishogi() && (() => {
                const jishogiPoints = engine.calculateJishogiPoints();
                return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 bg-amber-950/70 border border-amber-500/60 rounded-xl shadow-inner animate-fadeIn">
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                <span>🏛️</span>
                                <span>{t.gameplay.shogiJishogiTitle}</span>
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-slate-300">
                                {t.gameplay.shogiSentePlayer}: <strong className={jishogiPoints.white >= 24 ? 'text-emerald-400' : 'text-red-400'}>{jishogiPoints.white}</strong>/24 &bull; {t.gameplay.shogiGotePlayer}: <strong className={jishogiPoints.black >= 24 ? 'text-emerald-400' : 'text-red-400'}>{jishogiPoints.black}</strong>/24
                            </span>
                        </div>
                        <button
                            type="button"
                            disabled={!isHumanTurn || isAiThinking}
                            onClick={declareShogiJishogi}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {t.gameplay.shogiJishogiButton}
                        </button>
                    </div>
                );
            })()}

            {/* 7-Piece Fixed Selection Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 py-0.5 w-full">
                {pieceItems.map(({ name, count }) => {
                    const hasPiece = count > 0;
                    const isSelected = shogiSelectedPiece === name;
                    const canSelect = hasPiece && isHumanTurn && !isAiThinking;
                    const dummyPiece = createShogiPiece(name, currentTurn as PieceColor, { x: 0, y: 0 });
                    const imgUrl = getPieceImage(dummyPiece, regionalPieceStyle);

                    return (
                        <button
                            key={name}
                            type="button"
                            disabled={!canSelect}
                            onClick={() => selectShogiDropPiece(isSelected ? null : name)}
                            className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl transition-all duration-150 border select-none aspect-square ${
                                isSelected
                                    ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/20 scale-105 z-10'
                                    : canSelect
                                    ? 'bg-slate-800/90 border-amber-500/40 hover:border-amber-400 hover:bg-slate-700/80 cursor-pointer active:scale-95 shadow-sm'
                                    : 'bg-slate-800/20 border-white/5 opacity-25 cursor-not-allowed'
                            }`}
                            title={`${name} (x${count})`}
                        >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center relative">
                                {imgUrl && (
                                    <img
                                        src={imgUrl}
                                        alt={name}
                                        className={`w-full h-full object-contain drop-shadow-md pointer-events-none transition-all ${
                                            hasPiece ? 'opacity-100' : 'opacity-40 grayscale'
                                        }`}
                                        draggable={false}
                                    />
                                )}
                            </div>

                            {/* Badge count */}
                            {hasPiece ? (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full shadow border border-amber-300">
                                    {count}
                                </span>
                            ) : (
                                <span className="text-[9px] text-slate-600 font-mono">
                                    0
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
