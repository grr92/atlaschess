import type { PieceColor } from '../types';
import { pieceSvgAssets } from './pieceAssets';

export type JanggiPieceStyle = 'text' | 'icon';
export type VisualPiece = { name: string; color: PieceColor };

export const getJanggiPieceImage = (piece: VisualPiece | null, style: JanggiPieceStyle = 'text'): string | null => {
    if (!piece) return null;

    let pieceName = '';
    switch (piece.name) {
        case 'JanggiGeneral':  pieceName = 'general';  break;
        case 'JanggiGuard':    pieceName = 'guard';     break;
        case 'JanggiElephant': pieceName = 'elephant';  break;
        case 'JanggiHorse':    pieceName = 'horse';     break;
        case 'JanggiChariot':  pieceName = 'chariot';   break;
        case 'JanggiCannon':   pieceName = 'cannon';    break;
        case 'JanggiSoldier':  pieceName = 'soldier';   break;
        default: return null;
    }

    const fileName = `${pieceName}_${piece.color}_${style}.svg`;
    const key = `../assets/pieces/janggi/${fileName}`;

    return pieceSvgAssets[key] || null;
};
