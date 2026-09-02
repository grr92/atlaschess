import type { Position, Move } from '../types';

/**
 * Converts a matrix coordinate {x, y} to a standard UCI square string (e.g. {x:4, y:6} -> "e2").
 */
export function positionToUciSquare(pos: Position, totalRows: number): string {
    const file = String.fromCharCode(97 + pos.x);
    const rank = totalRows - pos.y;
    return `${file}${rank}`;
}

/**
 * Converts a UCI square string (e.g. "e2" or "a10") to a matrix coordinate {x, y}.
 */
export function uciSquareToPosition(square: string, totalRows: number): Position {
    const fileChar = square[0].toLowerCase();
    const x = fileChar.charCodeAt(0) - 97;
    const rankNum = parseInt(square.slice(1), 10);
    const y = totalRows - rankNum;
    return { x, y };
}

/**
 * Converts a move to a UCI move string (e.g. "e2e4", "e7e8q").
 */
export function moveToUci(
    from: Position,
    to: Position,
    promotionPiece?: string,
    totalRows: number = 8
): string {
    const fromStr = positionToUciSquare(from, totalRows);
    const toStr = positionToUciSquare(to, totalRows);

    let promoStr = '';
    if (promotionPiece) {
        switch (promotionPiece.toLowerCase()) {
            case 'queen': promoStr = 'q'; break;
            case 'rook': promoStr = 'r'; break;
            case 'bishop': promoStr = 'b'; break;
            case 'knight': promoStr = 'n'; break;
            case 'ferz': promoStr = 'f'; break;
            default: promoStr = promotionPiece[0].toLowerCase(); break;
        }
    }

    return `${fromStr}${toStr}${promoStr}`;
}

/**
 * Parses a UCI move string (e.g. "e2e4", "e7e8q") into { from, to, promotionPiece }.
 */
export function uciToMove(
    uciStr: string,
    totalRows: number = 8
): { from: Position; to: Position; promotionPiece?: string } | null {
    if (!uciStr || uciStr.length < 4 || uciStr === '(none)') {
        return null;
    }

    // In cases with double-digit ranks (e.g. 10x11 boards like "e2e10"), regex parses file+rank
    const match = uciStr.match(/^([a-z])(\d+)([a-z])(\d+)([a-z])?$/i);
    if (!match) {
        // Fallback for standard 4-5 char string
        const fromStr = uciStr.slice(0, 2);
        const toStr = uciStr.slice(2, 4);
        const promoChar = uciStr.length >= 5 ? uciStr[4].toLowerCase() : undefined;

        const from = uciSquareToPosition(fromStr, totalRows);
        const to = uciSquareToPosition(toStr, totalRows);

        let promotionPiece: string | undefined = undefined;
        if (promoChar) {
            switch (promoChar) {
                case 'q': promotionPiece = 'Queen'; break;
                case 'r': promotionPiece = 'Rook'; break;
                case 'b': promotionPiece = 'Bishop'; break;
                case 'n': promotionPiece = 'Knight'; break;
                case 'f': promotionPiece = 'Ferz'; break;
                default: promotionPiece = 'Queen'; break;
            }
        }

        return { from, to, promotionPiece };
    }

    const fromSquare = `${match[1]}${match[2]}`;
    const toSquare = `${match[3]}${match[4]}`;
    const promoChar = match[5]?.toLowerCase();

    const from = uciSquareToPosition(fromSquare, totalRows);
    const to = uciSquareToPosition(toSquare, totalRows);

    let promotionPiece: string | undefined = undefined;
    if (promoChar) {
        switch (promoChar) {
            case 'q': promotionPiece = 'Queen'; break;
            case 'r': promotionPiece = 'Rook'; break;
            case 'b': promotionPiece = 'Bishop'; break;
            case 'n': promotionPiece = 'Knight'; break;
            case 'f': promotionPiece = 'Ferz'; break;
            default: promotionPiece = 'Queen'; break;
        }
    }

    return { from, to, promotionPiece };
}

/**
 * Converts a list of Atlas Chess Move objects to a list of UCI move strings.
 */
export function historyToUciMoves(history: Move[], totalRows: number = 8): string[] {
    return history.map((move) => {
        let promoPiece: string | undefined = undefined;
        if (move.san?.includes('=Q')) promoPiece = 'Queen';
        else if (move.san?.includes('=R')) promoPiece = 'Rook';
        else if (move.san?.includes('=B')) promoPiece = 'Bishop';
        else if (move.san?.includes('=N')) promoPiece = 'Knight';
        else if (move.san?.includes('=F')) promoPiece = 'Ferz';

        return moveToUci(move.from, move.to, promoPiece, totalRows);
    });
}
