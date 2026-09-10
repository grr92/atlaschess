import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';
import { DICE_PIECE_MAP } from '../../utils/diceMapper';
import { Dices, SkipForward } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const D8DiceWidget: React.FC = () => {
    const { t, getPieceName } = useTranslation();
    const {
        useDiceRule,
        currentDiceRoll,
        isRollingDice,
        currentTurn,
        currentVariantId,
        subTurn,
        engine,
        gameMode,
        playerColor,
        isAiThinking,
        passTurn,
        gameState
    } = useGameStore();

    if (!useDiceRule) return null;

    const isChaturaji = currentVariantId === 'chaturaji';
    const isFourSeasons = currentVariantId === 'four_seasons';
    const activeController = engine ? engine.getActiveController() : currentTurn;
    const isPlayerTurn = gameMode !== 'vs_ai' || activeController === playerColor;
    const canPass = isChaturaji && isPlayerTurn && !isAiThinking && !isRollingDice && (gameState === 'playing' || gameState === 'check');

    const pieceImgs: string[] = [];
    let displayName: string | null = null;

    if (isFourSeasons) {
        const FOUR_SEASONS_PIECES: Record<number, string> = {
            1: 'FourSeasonsPawn',
            2: 'FourSeasonsBishop',
            3: 'FourSeasonsKnight',
            4: 'FourSeasonsRook',
            5: 'FourSeasonsGeneral',
            6: 'FourSeasonsKing'
        };
        const pieceName = currentDiceRoll ? FOUR_SEASONS_PIECES[currentDiceRoll] : null;
        const img = pieceName ? getPieceImage({ name: pieceName, color: currentTurn } as any) : null;
        if (img) pieceImgs.push(img);
        displayName = pieceName ? getPieceName(pieceName) : null;
    } else if (isChaturaji) {
        if (currentDiceRoll === 1 || currentDiceRoll === 5) {
            const kingImg = getPieceImage({ name: 'ChaturajiKing', color: currentTurn } as any);
            const pawnImg = getPieceImage({ name: 'ChaturajiPawn', color: currentTurn } as any);
            if (kingImg) pieceImgs.push(kingImg);
            if (pawnImg) pieceImgs.push(pawnImg);
            displayName = `${getPieceName('ChaturajiKing')} / ${getPieceName('ChaturajiPawn')}`;
        } else if (currentDiceRoll === 2) {
            const boatImg = getPieceImage({ name: 'ChaturajiBoat', color: currentTurn } as any);
            if (boatImg) pieceImgs.push(boatImg);
            displayName = getPieceName('ChaturajiBoat');
        } else if (currentDiceRoll === 3) {
            const horseImg = getPieceImage({ name: 'ChaturajiHorse', color: currentTurn } as any);
            if (horseImg) pieceImgs.push(horseImg);
            displayName = getPieceName('ChaturajiHorse');
        } else if (currentDiceRoll === 4 || currentDiceRoll === 6) {
            const elephantImg = getPieceImage({ name: 'ChaturajiElephant', color: currentTurn } as any);
            if (elephantImg) pieceImgs.push(elephantImg);
            displayName = getPieceName('ChaturajiElephant');
        }
    } else {
        const pieceName = currentDiceRoll ? DICE_PIECE_MAP[currentDiceRoll] : null;
        const img = pieceName ? getPieceImage({ name: pieceName, color: currentTurn } as any) : null;
        if (img) pieceImgs.push(img);
        displayName = pieceName ? getPieceName(pieceName) : null;
    }

    const titleLabel = isFourSeasons
        ? t.gameplay.diceThrownFourSeasons
        : isChaturaji
        ? t.gameplay.diceThrownChaturaji
        : t.gameplay.diceThrown;

    return (
        <div className="flex items-center gap-2 bg-atlas-surface/90 border border-amber-500/40 rounded-xl px-2.5 py-1 shadow-lg backdrop-blur-md flex-shrink-0">
            {/* Animated die visual */}
            <div className={`relative flex items-center justify-center w-8 h-8 transition-transform flex-shrink-0 ${isRollingDice ? 'animate-spin' : ''}`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    {isFourSeasons ? (
                        <>
                            <rect x="10" y="10" width="80" height="80" rx="16" fill="#78350f" stroke="#f59e0b" strokeWidth="4" />
                            <text x="50" y="66" textAnchor="middle" fontSize="42" fontWeight="900" fill="#fef3c7">
                                {isRollingDice ? '?' : (currentDiceRoll || '?')}
                            </text>
                        </>
                    ) : isChaturaji ? (
                        <>
                            <polygon points="50,10 90,85 10,85" fill="#78350f" stroke="#f59e0b" strokeWidth="3" />
                            <line x1="50" y1="10" x2="50" y2="85" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                            <line x1="10" y1="85" x2="50" y2="60" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                            <line x1="90" y1="85" x2="50" y2="60" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                            <text x="50" y="68" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fef3c7">
                                {isRollingDice ? '?' : (currentDiceRoll || '?')}
                            </text>
                        </>
                    ) : (
                        <>
                            <polygon points="50,5 95,50 50,95 5,50" fill="#78350f" stroke="#f59e0b" strokeWidth="3" />
                            <line x1="50" y1="5" x2="50" y2="95" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                            <line x1="5" y1="50" x2="95" y2="50" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                            <text x="50" y="60" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fef3c7">
                                {isRollingDice ? '?' : (currentDiceRoll || '?')}
                            </text>
                        </>
                    )}
                </svg>
            </div>

            <div className="flex flex-col justify-center min-w-0">
                <div className="text-[9px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 leading-tight">
                    <Dices className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{titleLabel}</span>
                    {isChaturaji && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono text-[9px] flex-shrink-0">
                            {subTurn}/2
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-white leading-tight mt-0.5">
                    {pieceImgs.map((src, idx) => (
                        <img key={idx} src={src} alt="Piece icon" className="w-4 h-4 object-contain flex-shrink-0" />
                    ))}
                    <span className="truncate max-w-[120px]">
                        {isRollingDice ? t.gameplay.rolling : (displayName ? `${displayName}` : t.gameplay.selectPiece)}
                    </span>
                </div>
            </div>

            {/* Pass Turn Button */}
            {canPass && (
                <div className="pl-1 border-l border-white/10 ml-0.5 flex-shrink-0">
                    <button
                        onClick={() => passTurn()}
                        className="bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap"
                        title={t.gameplay.passTurn}
                    >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{t.gameplay.passTurn}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
