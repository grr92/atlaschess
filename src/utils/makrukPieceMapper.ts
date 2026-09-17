import { Piece } from '../core/pieces/piecesIndex';
import { pieceSvgAssets } from './pieceAssets';

export const getMakrukPieceImage = (piece: Piece | null): string | null => {
    if (!piece) return null;

    const fileName = `${piece.name}_${piece.color}.svg`;
    const key = `../assets/pieces/makruk/${fileName}`;

    return pieceSvgAssets[key] || null;
};
