import { Piece } from '../core/pieces/piecesIndex';

const svgAssets = import.meta.glob<string>('../assets/pieces/xiangqi/*.svg', {
    eager: true,
    import: 'default',
});

if (typeof window !== 'undefined') {
    Object.values(svgAssets).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

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

    return svgAssets[key] || null;
};
