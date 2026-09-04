import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getPieceImage } from '../../utils/pieceMapper';
import { DICE_PIECE_MAP } from '../../utils/diceMapper';
import { Dices } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const D8DiceWidget: React.FC = () => {
    const { t, getPieceName } = useTranslation();
    const { useDiceRule, currentDiceRoll, isRollingDice, currentTurn } = useGameStore();

    if (!useDiceRule) return null;

    const pieceName = currentDiceRoll ? DICE_PIECE_MAP[currentDiceRoll] : null;
    const pieceImg = pieceName ? getPieceImage({ name: pieceName, color: currentTurn } as any) : null;

    // Friendly localized display name
    const displayName = pieceName ? getPieceName(pieceName) : null;

    return (
        <div className="flex items-center gap-3 bg-atlas-surface/90 border border-amber-500/40 rounded-2xl px-4 py-2 shadow-xl backdrop-blur-md">
            {/* Animated d8 octahedron visual */}
            <div className={`relative flex items-center justify-center w-11 h-11 transition-transform ${isRollingDice ? 'animate-spin' : ''}`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <polygon points="50,5 95,50 50,95 5,50" fill="#78350f" stroke="#f59e0b" strokeWidth="3" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                    <text x="50" y="60" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fef3c7">
                        {isRollingDice ? '?' : (currentDiceRoll || '?')}
                    </text>
                </svg>
            </div>

            <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    <Dices className="w-3.5 h-3.5" />
                    {t.gameplay.diceThrown}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                    {pieceImg && <img src={pieceImg} alt={displayName!} className="w-5 h-5 object-contain" />}
                    <span>{isRollingDice ? t.gameplay.rolling : (displayName ? `${displayName}` : t.gameplay.selectPiece)}</span>
                </div>
            </div>
        </div>
    );
};
