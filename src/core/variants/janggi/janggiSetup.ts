import type { PieceColor } from '../../../types';
import { Board } from '../../models/Board';
import { JanggiChariot, JanggiHorse, JanggiElephant, JanggiGuard } from '../../pieces/piecesIndex';

export type JanggiSetupType = 'inner' | 'outer' | 'left' | 'right';

export interface JanggiOptions {
    blueSetup?: JanggiSetupType;
    redSetup?: JanggiSetupType;
}

/**
 * Places the backrank pieces (row 0 for Red, row 9 for Blue) according to the chosen setup.
 */
export function placeJanggiBackrankPieces(
    board: Board,
    color: PieceColor,
    setup: JanggiSetupType = 'inner'
): void {
    const y = color === 'blue' ? 9 : 0;
    const prefix = color === 'blue' ? 'b' : 'r';

    // Chariots at the edges
    board.setPiece(new JanggiChariot(`${prefix}c1`, color, { x: 0, y }), 0, y);
    board.setPiece(new JanggiChariot(`${prefix}c2`, color, { x: 8, y }), 8, y);

    // Guards adjacent to palace center opening
    board.setPiece(new JanggiGuard(`${prefix}g1`, color, { x: 3, y }), 3, y);
    board.setPiece(new JanggiGuard(`${prefix}g2`, color, { x: 5, y }), 5, y);

    // Left Flank (columns 1 & 2):
    // In 'inner' and 'right': Horse at 1, Elephant at 2
    // In 'outer' and 'left': Elephant at 1, Horse at 2
    if (setup === 'outer' || setup === 'left') {
        board.setPiece(new JanggiElephant(`${prefix}e1`, color, { x: 1, y }), 1, y);
        board.setPiece(new JanggiHorse(`${prefix}n1`, color, { x: 2, y }), 2, y);
    } else {
        board.setPiece(new JanggiHorse(`${prefix}n1`, color, { x: 1, y }), 1, y);
        board.setPiece(new JanggiElephant(`${prefix}e1`, color, { x: 2, y }), 2, y);
    }

    // Right Flank (columns 6 & 7):
    // In 'inner' and 'left': Elephant at 6, Horse at 7
    // In 'outer' and 'right': Horse at 6, Elephant at 7
    if (setup === 'outer' || setup === 'right') {
        board.setPiece(new JanggiHorse(`${prefix}n2`, color, { x: 6, y }), 6, y);
        board.setPiece(new JanggiElephant(`${prefix}e2`, color, { x: 7, y }), 7, y);
    } else {
        board.setPiece(new JanggiElephant(`${prefix}e2`, color, { x: 6, y }), 6, y);
        board.setPiece(new JanggiHorse(`${prefix}n2`, color, { x: 7, y }), 7, y);
    }
}

/**
 * Returns the UCI / Fairy-Stockfish rank representation for a given setup and color.
 */
function getRankString(setup: JanggiSetupType, isUppercase: boolean): string {
    const [c, n, b, a] = isUppercase
        ? ['R', 'N', 'B', 'A']
        : ['r', 'n', 'b', 'a'];

    const leftPair = (setup === 'outer' || setup === 'left') ? `${b}${n}` : `${n}${b}`;
    const rightPair = (setup === 'outer' || setup === 'right') ? `${n}${b}` : `${b}${n}`;

    return `${c}${leftPair}${a}1${a}${rightPair}${c}`;
}

/**
 * Generates the complete starting FEN for Fairy-Stockfish for any Janggi setup combination.
 */
export function getJanggiFen(
    blueSetup: JanggiSetupType = 'inner',
    redSetup: JanggiSetupType = 'inner'
): string {
    const redRank = getRankString(redSetup, false); // Rank 10 (Red, top)
    const blueRank = getRankString(blueSetup, true); // Rank 1 (Blue, bottom)

    return `${redRank}/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/${blueRank} w - - 0 1`;
}

/**
 * Selects a Janggi setup for the AI using a weighted random distribution:
 * - Inner Elephant: 40% (Classical, balanced)
 * - Left Elephant: 25% (Popular competitive Gwima)
 * - Right Elephant: 25% (Competitive Gwima)
 * - Outer Elephant: 10% (Aggressive Yang-gwima)
 */
export function getRandomJanggiSetup(): JanggiSetupType {
    const rand = Math.random();
    if (rand < 0.40) return 'inner';
    if (rand < 0.65) return 'left';
    if (rand < 0.90) return 'right';
    return 'outer';
}
