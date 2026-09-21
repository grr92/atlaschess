import type { PieceColor } from '../types';
import { pieceSvgAssets } from './pieceAssets';

export type ShogiPieceStyle = 'text' | 'icon';
export type VisualPiece = { name: string; color: PieceColor };

export const getShogiPieceImage = (piece: VisualPiece | null, style: ShogiPieceStyle = 'text'): string | null => {
    if (!piece) return null;

    const isTopPlayer = piece.color === 'black';

    if (style === 'text') {
        // Traditional Ryoko style SVGs with Japanese Kanji (180 deg rotated for top player)
        const suffix = isTopPlayer ? ',_180' : '';
        let fileName = '';

        switch (piece.name) {
            case 'ShogiKing':
                fileName = isTopPlayer ? 'Gyokusho_(Ryoko,_180).svg' : 'Ousho_(Ryoko).svg';
                break;
            case 'ShogiRook':
                fileName = `Hisha_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiBishop':
                fileName = `Kakugyo_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiGold':
                fileName = `Kinsho_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiSilver':
                fileName = `Ginsho_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiKnight':
                fileName = `Keima_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiLance':
                fileName = `Kyosha_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiPawn':
                fileName = `Fuhyo_(Ryoko${suffix}).svg`;
                break;
            case 'ShogiDragon':
                fileName = `Ryuou_(Ryoko,_Red${suffix}).svg`;
                break;
            case 'ShogiHorse':
                fileName = `Ryuma_(Ryoko,_Red${suffix}).svg`;
                break;
            case 'ShogiPromotedSilver':
                fileName = `Narigin_(Ryoko,_Red${suffix}).svg`;
                break;
            case 'ShogiPromotedKnight':
                fileName = `Narikei_(Ryoko,_Red${suffix}).svg`;
                break;
            case 'ShogiPromotedLance':
                fileName = `Narikyo_(Ryoko,_Red${suffix}).svg`;
                break;
            case 'ShogiTokin':
                fileName = `Tokin_(Ryoko,_Red${suffix}).svg`;
                break;
            default:
                return null;
        }

        const key = `../assets/pieces/shogi/traditional/${fileName}`;
        return pieceSvgAssets[key] || null;
    } else {
        // International JI Chess-themed SVGs
        const colorPrefix = piece.color === 'white' ? 'White' : 'Black';
        let fileName = '';

        switch (piece.name) {
            case 'ShogiKing':
                fileName = `${colorPrefix} King (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiRook':
                fileName = piece.color === 'white' ? 'Chess rlt45.svg' : 'Chess rdt45.svg';
                break;
            case 'ShogiBishop':
                fileName = piece.color === 'white' ? 'Chess blt45.svg' : 'Chess bdt45.svg';
                break;
            case 'ShogiGold':
                fileName = `${colorPrefix} Gold (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiSilver':
                fileName = `${colorPrefix} Silver (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiKnight':
                fileName = piece.color === 'white' ? 'Chess nlt45.svg' : 'Chess ndt45.svg';
                break;
            case 'ShogiLance':
                fileName = `${colorPrefix} Lance (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiPawn':
                fileName = piece.color === 'white' ? 'Chess plt45.svg' : 'Chess pdt45.svg';
                break;
            case 'ShogiDragon':
                fileName = `${colorPrefix} Dragon (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiHorse':
                fileName = `${colorPrefix} Horse (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiPromotedSilver':
                fileName = `${colorPrefix} Promoted Silver (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiPromotedKnight':
                fileName = `${colorPrefix} Promoted Knight (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiPromotedLance':
                fileName = `${colorPrefix} Promoted Lance (JI Chess-Themed Shogi).svg`;
                break;
            case 'ShogiTokin':
                fileName = `${colorPrefix} Tokin (JI Chess-Themed Shogi).svg`;
                break;
            default:
                return null;
        }

        const key = `../assets/pieces/shogi/international/${fileName}`;
        return pieceSvgAssets[key] || pieceSvgAssets[key.replace('Chess ', 'Chess_')] || null;
    }
};
