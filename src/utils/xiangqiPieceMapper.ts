import { Piece } from '../core/pieces/piecesIndex';
import { pieceSvgAssets } from './pieceAssets';

export type XiangqiPieceStyle = 'text' | 'icon';

export const getXiangqiPieceImage = (piece: Piece | null, style: XiangqiPieceStyle = 'text'): string | null => {
    if (!piece) return null;

    let pieceName = '';
    switch (piece.name) {
        case 'XiangqiGeneral': pieceName = 'general'; break;
        case 'XiangqiAdvisor': pieceName = 'advisor'; break;
        case 'XiangqiElephant': pieceName = 'elephant'; break;
        case 'XiangqiHorse': pieceName = 'horse'; break;
        case 'XiangqiChariot': pieceName = 'chariot'; break;
        case 'XiangqiCannon': pieceName = 'cannon'; break;
        case 'XiangqiSoldier': pieceName = 'soldier'; break;
        default: return null;
    }

    const fileName = `${pieceName}_${piece.color}_${style}.svg`;
    const key = `../assets/pieces/xiangqi/${fileName}`;

    return pieceSvgAssets[key] || null;
};
