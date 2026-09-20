import React from 'react';
import type { Piece } from '../../core/pieces/Piece';
import { TamerlanePawn } from '../../core/pieces/piecesIndex';
import { getPawnBadgeIcon } from '../../utils/pieceMapper';

interface PieceBadgesProps {
    piece: Piece | null;
}

/**
 * Renders badges on top of pieces (e.g. Prince 'P', Adventitious King 'A',
 * or promotion target icons on Tamerlane pawns).
 */
export const PieceBadges: React.FC<PieceBadgesProps> = ({ piece }) => {
    if (!piece) return null;

    if (piece.name === 'Shahzada') {
        return (
            <div
                className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border shadow-md pointer-events-none flex items-center justify-center font-black text-[10px] md:text-xs lg:text-sm ${
                    piece.color === 'black'
                        ? 'bg-slate-100 text-black border-amber-600 shadow-black/40'
                        : 'bg-slate-900/90 text-white border-amber-400 shadow-black/60'
                }`}
            >
                P
            </div>
        );
    }

    if (piece.name === 'AdventitiousShah') {
        return (
            <div
                className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border shadow-md pointer-events-none flex items-center justify-center font-black text-[10px] md:text-xs lg:text-sm ${
                    piece.color === 'black'
                        ? 'bg-slate-100 text-black border-amber-600 shadow-black/40'
                        : 'bg-slate-900/90 text-white border-amber-400 shadow-black/60'
                }`}
            >
                A
            </div>
        );
    }

    if (piece instanceof TamerlanePawn) {
        const badgeIcon = getPawnBadgeIcon(piece.pawnType, piece.color);
        if (badgeIcon) {
            return (
                <div
                    className={`absolute bottom-0.5 right-0.5 z-20 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full p-0.5 border shadow-md pointer-events-none flex items-center justify-center ${
                        piece.color === 'black'
                            ? 'bg-slate-100 border-amber-600 shadow-black/40'
                            : 'bg-slate-900/90 border-amber-400 shadow-black/60'
                    }`}
                >
                    <img
                        src={badgeIcon}
                        alt="Target piece"
                        className="w-full h-full object-contain"
                    />
                </div>
            );
        }
    }

    return null;
};
