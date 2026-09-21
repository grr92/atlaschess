import type { PieceColor } from '../types';
import { pieceSvgAssets } from './pieceAssets';

export type VisualPiece = { name: string; color: PieceColor };

export const getMakrukPieceImage = (piece: VisualPiece | null): string | null => {
    if (!piece) return null;

    const fileName = `${piece.name}_${piece.color}.svg`;
    const key = `../assets/pieces/makruk/${fileName}`;

    return pieceSvgAssets[key] || null;
};
