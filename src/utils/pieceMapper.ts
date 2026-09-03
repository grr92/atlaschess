import { Piece } from '../core/pieces/piecesIndex';
import { getPieceSvgChar } from '../core/pieces/pieceRegistry';

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
    const pieceChar = getPieceSvgChar(piece.name);
    if (!pieceChar) return null;

    const fileName = `Chess_${pieceChar}${colorChar}t45.svg`;
    const key = `../assets/pieces/${fileName}`;

    // Retrieve the exact URL from the pre-loaded dictionary
    return svgAssets[key] || null;
};

export const getPawnBadgeIcon = (pawnType: string, color: string): string | null => {
    const colorChar = color === 'white' ? 'l' : 'd';
    let targetChar = '';

    switch (pawnType) {
        case 'pawn_of_dabbabas': targetChar = 'd'; break;
        case 'pawn_of_camels': targetChar = 'c'; break;
        case 'pawn_of_elephants': targetChar = 'e'; break;
        case 'pawn_of_giraffes': targetChar = 'g'; break;
        case 'pawn_of_king': targetChar = 'k'; break;
        case 'pawn_of_vizier': case 'pawn_of_counselor': targetChar = 'q'; break;
        case 'pawn_of_scouts': targetChar = 'b'; break;
        case 'pawn_of_horses': targetChar = 'n'; break;
        case 'pawn_of_rooks': targetChar = 'r'; break;
        case 'pawn_of_pawns': targetChar = 'p'; break;
        default: return null;
    }

    const fileName = `Chess_${targetChar}${colorChar}t45.svg`;
    const key = `../assets/pieces/${fileName}`;
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