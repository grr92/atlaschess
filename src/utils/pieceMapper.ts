import { Piece } from '../core/pieces/piecesIndex';

// Vite creates a dictionary mapping all processed paths:
    // Keys are formatted like: '../assets/pieces/Chess_elt45.svg'
const svgAssets = import.meta.glob<string>('../assets/pieces/*.svg', {
    eager: true,
    import: 'default',
});

    // Force the browser to pre-load these exact URLs into the cache in order to prevent possible slow loads of the pieces
if (typeof window !== 'undefined') {
    Object.values(svgAssets).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

export const getPieceImage = (piece: Piece | null): string | null => {
    if (!piece) return null;

    const colorChar = piece.color === 'white' ? 'l' : 'd';

    let pieceChar = '';
    switch (piece.name) {
        case 'King': case 'Raja': case 'Shah': pieceChar = 'k'; break;
        case 'Queen': case 'Mantri': case 'Ferz': case 'Wazir': pieceChar = 'q'; break;
        case 'Rook': case 'Ratha': case 'Rukh': pieceChar = 'r'; break;
        case 'Bishop': case 'Talia': pieceChar = 'b'; break;
        case 'Knight': case 'Asva': case 'Asb': pieceChar = 'n'; break;
        case 'Pawn': case 'Padati': case 'Sarbaz': pieceChar = 'p'; break;
        case 'Gaja': case 'Pil': pieceChar = 'e'; break;
        case 'Zurafa': pieceChar = 'g'; break;
        case 'Dabbaba': pieceChar = 'd'; break;
        case 'Jamal': pieceChar = 'c'; break;

        default: return null;
    }

    const fileName = `Chess_${pieceChar}${colorChar}t45.svg`;
    const key = `../assets/pieces/${fileName}`;

    // Retrieve the exact URL from the pre-loaded dictionary
    return svgAssets[key] || null;
};

export const getSquareBackground = (x: number, y: number, variantId: string): string | undefined => {
    const isLight = (x + y) % 2 === 0;
    let colorChar = isLight ? 'l' : 'd';

    let isMarked = false;

    // Board squares marked with an X for the Chaturanga variant
    if (variantId === 'chaturanga') {
        const markedSquares = [
            '0,0', '3,0', '4,0', '7,0',
            '0,3', '3,3', '4,3', '7,3',
            '0,4', '3,4', '4,4', '7,4',
            '0,7', '3,7', '4,7', '7,7'
        ];
        isMarked = markedSquares.includes(`${x},${y}`);
        colorChar = 'l';
    } else if (variantId === 'shatranj' || variantId === 'tamerlane') {
        // Those games used the same board as Chaturanga but without the X's
        isMarked = false;
        colorChar = 'l';
    }

    const prefix = isMarked ? 'xx' : '';
    const fileName = `Chess_${prefix}${colorChar}45.svg`;
    const key = `../assets/pieces/${fileName}`;

    // Apply the same logic to retrieve square backgrounds
    return svgAssets[key];
};