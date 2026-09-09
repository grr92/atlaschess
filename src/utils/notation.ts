import { Piece } from '../core/pieces/piecesIndex';
import type {Position} from '../types';
import { BaseEngine } from '../core/engine/BaseEngine';

// Supports huge boards for different board size variants (e.g. Grand chess)
export const getFile = (x: number) => String.fromCharCode(97 + x);

// Ranks are calculated dynamically based on the total board size
export const getRank = (y: number, totalRows: number) => (totalRows - y).toString();

// Ambiguity detector (Must be executed BEFORE moving the piece)
export const getDisambiguator = (engine: BaseEngine, piece: Piece, from: Position, to: Position): string => {
    // Those pieces cannot cause ambiguity
    if (['Pawn', 'Padati', 'King', 'Raja', 'Shah', 'GrantKing', 'CourierKing', 'Gaja', 'Mantri'].includes(piece.name) || piece.name.includes('Pawn') || piece.name.includes('pawn')) return '';

    const ambiguousPieces: Position[] = [];

    // Check if there is another piece of the same type and color that can move to the target square
    for (let y = 0; y < engine.board.rows; y++) {
        for (let x = 0; x < engine.board.cols; x++) {
            const p = engine.board.getPieceAt(x, y);
            if (p && p !== piece && p.name === piece.name && p.color === piece.color) {
                const legalMoves = engine.getLegalMoves(p);
                if (legalMoves.some(m => m.x === to.x && m.y === to.y)) {
                    ambiguousPieces.push({ x, y });
                }
            }
        }
    }

    if (ambiguousPieces.length === 0) return ''; // No ambiguity found

    const sameFile = ambiguousPieces.some(p => p.x === from.x);
    const sameRank = ambiguousPieces.some(p => p.y === from.y);

    // Official FIDE disambiguation rules
    if (!sameFile) return getFile(from.x);
    if (!sameRank) return getRank(from.y, engine.board.rows);

    return `${getFile(from.x)}${getRank(from.y, engine.board.rows)}`;
};

// Final notation builder (Must be executed AFTER moving the piece)
export const buildSAN = (
    engine: BaseEngine,
    piece: Piece,
    from: Position,
    to: Position,
    capturedPiece: Piece | null,
    disambiguator: string,
    promotedTo?: string // If a pawn is promoted, pass the piece letter: 'Q', 'R', etc.
): string => {
    // Castling case
    if (piece.name === 'King') {
        if (to.x - from.x === 2) return 'O-O'; // Kingside castling
        if (from.x - to.x === 2) return 'O-O-O'; // Queenside castling
    }

    // Piece Letter
    let pieceStr = '';
    switch (piece.name) {
        case 'King': case 'Raja': case 'Shah': case 'Shahzada': case 'AdventitiousShah': case 'CourierKing': case 'GrantKing': pieceStr = 'K'; break;
        case 'Queen': case 'Mantri': case 'Ferz': case 'Wazir': case 'CourierQueen': pieceStr = 'Q'; break;
        case 'Rook': case 'Ratha': case 'Rukh': pieceStr = 'R'; break;
        case 'Bishop': case 'Talia': case 'CourierBishop': pieceStr = 'B'; break;
        case 'Courier': pieceStr = 'C'; break;
        case 'Knight': case 'Asva': case 'Asb': pieceStr = 'N'; break;
        case 'Gaja': case 'Pil': pieceStr = 'E'; break;
        case 'Zurafa': case 'Giraffe': pieceStr = 'G'; break;
        case 'Dabbaba': pieceStr = 'D'; break;
        case 'Jamal': pieceStr = 'C'; break;
        case 'Schleich': pieceStr = 'W'; break;
        case 'Sage': pieceStr = 'M'; break;
        case 'Aanca': pieceStr = 'A'; break;
        case 'Unicorn': pieceStr = 'U'; break;
        case 'Lion': pieceStr = 'L'; break;
        case 'Crocodile': pieceStr = 'O'; break;
    }

    // Captures (If it's a pawn, always include its file of origin)
    const isCapture = capturedPiece !== null;
    let captureStr = isCapture ? 'x' : '';
    let finalDis = disambiguator;

    const isPawnType = piece.name.includes('Pawn') || piece.name.startsWith('Pawn') || piece.name === 'Padati' || piece.name === 'Sarbaz' || piece.name === 'Grantpawn';
    if (isPawnType && isCapture) {
        finalDis = getFile(from.x); // Ex: exd5
    }

    // Destination square
    const destStr = `${getFile(to.x)}${getRank(to.y, engine.board.rows)}`;

    // Promotion case
    const promoStr = promotedTo ? `=${promotedTo}` : '';

    // Base assembly
    let san = `${pieceStr}${finalDis}${captureStr}${destStr}${promoStr}`;

    // Check (+) and Checkmate (#)
    if (engine.state === 'checkmate') {
        san += '#';
    } else if (engine.state === 'check') {
        san += '+';
    }

    return san;
};