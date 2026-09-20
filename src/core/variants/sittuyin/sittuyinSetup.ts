import type { PieceColor, Position } from '../../../types';
import { Board } from '../../models/Board';
import { Mingyi, Sitke, Sin, Myin, Yahhta, Piece } from '../../pieces/piecesIndex';

export type SittuyinPieceName = 'Mingyi' | 'Sitke' | 'Sin' | 'Myin' | 'Yahhta';

export interface DeployedPieceSpec {
    name: SittuyinPieceName;
    pos: Position;
}

export const SITTUYIN_INITIAL_POOL: SittuyinPieceName[] = [
    'Mingyi',
    'Sitke',
    'Sin',
    'Sin',
    'Myin',
    'Myin',
    'Yahhta',
    'Yahhta'
];

/**
 * Checks if a square is legally valid for deploying a specific piece during the Sit-tee phase.
 *
 * Rules:
 * - Square must be within the board and currently vacant.
 * - For Red:
 *   - Yahhta (Chariot/Rook): Strictly on the back rank (y = 7).
 *   - Other major pieces: Any square on Red's side behind Red's pawns:
 *     - Columns 0..3 (a..d, pawns at y=5): rows 6 and 7 (y in [6, 7]).
 *     - Columns 4..7 (e..h, pawns at y=4): rows 5, 6, and 7 (y in [5, 7]).
 * - For Black:
 *   - Yahhta (Chariot/Rook): Strictly on the back rank (y = 0).
 *   - Other major pieces: Any square on Black's side behind Black's pawns:
 *     - Columns 0..3 (a..d, pawns at y=3): rows 0, 1, and 2 (y in [0, 2]).
 *     - Columns 4..7 (e..h, pawns at y=2): rows 0 and 1 (y in [0, 1]).
 */
export function isSquareValidForSittuyinDeploy(
    color: PieceColor,
    pieceName: string,
    pos: Position,
    board: Board
): boolean {
    if (board.isOutOfBounds(pos.x, pos.y)) return false;
    if (board.getPieceAt(pos.x, pos.y) !== null) return false;

    if (color === 'red') {
        if (pieceName === 'Yahhta') {
            return pos.y === 7;
        }

        if (pos.x >= 0 && pos.x <= 3) {
            return pos.y === 6 || pos.y === 7;
        } else if (pos.x >= 4 && pos.x <= 7) {
            return pos.y === 5 || pos.y === 6 || pos.y === 7;
        }
    } else if (color === 'black') {
        if (pieceName === 'Yahhta') {
            return pos.y === 0;
        }

        if (pos.x >= 0 && pos.x <= 3) {
            return pos.y === 0 || pos.y === 1 || pos.y === 2;
        } else if (pos.x >= 4 && pos.x <= 7) {
            return pos.y === 0 || pos.y === 1;
        }
    }

    return false;
}

export interface SittuyinDeployPreset {
    id: string;
    name: string;
    pieces: DeployedPieceSpec[];
}

/**
 * Returns a list of classical and strategic presets for the given player color.
 */
export function getSittuyinPresets(color: PieceColor): SittuyinDeployPreset[] {
    const isRed = color === 'red';

    if (isRed) {
        return [
            {
                id: 'tournament',
                name: 'Clásica de Torneo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 7 } },
                    { name: 'Myin', pos: { x: 1, y: 7 } },
                    { name: 'Sin', pos: { x: 2, y: 7 } },
                    { name: 'Mingyi', pos: { x: 3, y: 7 } },
                    { name: 'Sitke', pos: { x: 4, y: 7 } },
                    { name: 'Sin', pos: { x: 5, y: 7 } },
                    { name: 'Myin', pos: { x: 6, y: 7 } },
                    { name: 'Yahhta', pos: { x: 7, y: 7 } }
                ]
            },
            {
                id: 'offensive_flank',
                name: 'Flanco Ofensivo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 7 } },
                    { name: 'Myin', pos: { x: 1, y: 7 } },
                    { name: 'Mingyi', pos: { x: 3, y: 7 } },
                    { name: 'Sitke', pos: { x: 4, y: 7 } },
                    { name: 'Yahhta', pos: { x: 7, y: 7 } },
                    { name: 'Sin', pos: { x: 2, y: 6 } },
                    { name: 'Sin', pos: { x: 5, y: 6 } },
                    { name: 'Myin', pos: { x: 6, y: 6 } }
                ]
            },
            {
                id: 'fortress',
                name: 'Defensa Central',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 7 } },
                    { name: 'Sin', pos: { x: 2, y: 7 } },
                    { name: 'Mingyi', pos: { x: 3, y: 7 } },
                    { name: 'Sitke', pos: { x: 4, y: 7 } },
                    { name: 'Sin', pos: { x: 5, y: 7 } },
                    { name: 'Yahhta', pos: { x: 7, y: 7 } },
                    { name: 'Myin', pos: { x: 1, y: 6 } },
                    { name: 'Myin', pos: { x: 6, y: 5 } }
                ]
            },
            {
                id: 'left_wing_assault',
                name: 'Asalto Flanco Izquierdo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 7 } },
                    { name: 'Myin', pos: { x: 1, y: 7 } },
                    { name: 'Sin', pos: { x: 1, y: 6 } },
                    { name: 'Myin', pos: { x: 2, y: 6 } },
                    { name: 'Sitke', pos: { x: 3, y: 6 } },
                    { name: 'Sin', pos: { x: 5, y: 7 } },
                    { name: 'Mingyi', pos: { x: 6, y: 7 } },
                    { name: 'Yahhta', pos: { x: 7, y: 7 } }
                ]
            },
            {
                id: 'double_chariot_center',
                name: 'Carros Centrales',
                pieces: [
                    { name: 'Mingyi', pos: { x: 1, y: 7 } },
                    { name: 'Sin', pos: { x: 2, y: 7 } },
                    { name: 'Myin', pos: { x: 2, y: 6 } },
                    { name: 'Yahhta', pos: { x: 3, y: 7 } },
                    { name: 'Yahhta', pos: { x: 4, y: 7 } },
                    { name: 'Sitke', pos: { x: 4, y: 6 } },
                    { name: 'Sin', pos: { x: 5, y: 7 } },
                    { name: 'Myin', pos: { x: 5, y: 6 } }
                ]
            },
            {
                id: 'cavalry_vanguard',
                name: 'Vanguardia de Caballería',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 7 } },
                    { name: 'Mingyi', pos: { x: 2, y: 7 } },
                    { name: 'Myin', pos: { x: 2, y: 6 } },
                    { name: 'Sin', pos: { x: 3, y: 7 } },
                    { name: 'Sitke', pos: { x: 4, y: 6 } },
                    { name: 'Sin', pos: { x: 5, y: 6 } },
                    { name: 'Myin', pos: { x: 6, y: 5 } },
                    { name: 'Yahhta', pos: { x: 7, y: 7 } }
                ]
            }
        ];
    } else {
        return [
            {
                id: 'tournament',
                name: 'Clásica de Torneo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 0 } },
                    { name: 'Myin', pos: { x: 1, y: 0 } },
                    { name: 'Sin', pos: { x: 2, y: 0 } },
                    { name: 'Mingyi', pos: { x: 3, y: 0 } },
                    { name: 'Sitke', pos: { x: 4, y: 0 } },
                    { name: 'Sin', pos: { x: 5, y: 0 } },
                    { name: 'Myin', pos: { x: 6, y: 0 } },
                    { name: 'Yahhta', pos: { x: 7, y: 0 } }
                ]
            },
            {
                id: 'offensive_flank',
                name: 'Flanco Ofensivo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 0 } },
                    { name: 'Myin', pos: { x: 1, y: 0 } },
                    { name: 'Mingyi', pos: { x: 3, y: 0 } },
                    { name: 'Sitke', pos: { x: 4, y: 0 } },
                    { name: 'Yahhta', pos: { x: 7, y: 0 } },
                    { name: 'Sin', pos: { x: 2, y: 1 } },
                    { name: 'Sin', pos: { x: 5, y: 1 } },
                    { name: 'Myin', pos: { x: 6, y: 1 } }
                ]
            },
            {
                id: 'fortress',
                name: 'Defensa Central',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 0 } },
                    { name: 'Sin', pos: { x: 2, y: 0 } },
                    { name: 'Mingyi', pos: { x: 3, y: 0 } },
                    { name: 'Sitke', pos: { x: 4, y: 0 } },
                    { name: 'Sin', pos: { x: 5, y: 0 } },
                    { name: 'Yahhta', pos: { x: 7, y: 0 } },
                    { name: 'Myin', pos: { x: 1, y: 1 } },
                    { name: 'Myin', pos: { x: 6, y: 1 } }
                ]
            },
            {
                id: 'left_wing_assault',
                name: 'Asalto Flanco Izquierdo',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 0 } },
                    { name: 'Myin', pos: { x: 1, y: 0 } },
                    { name: 'Sin', pos: { x: 1, y: 1 } },
                    { name: 'Myin', pos: { x: 2, y: 1 } },
                    { name: 'Sitke', pos: { x: 3, y: 1 } },
                    { name: 'Sin', pos: { x: 5, y: 0 } },
                    { name: 'Mingyi', pos: { x: 6, y: 0 } },
                    { name: 'Yahhta', pos: { x: 7, y: 0 } }
                ]
            },
            {
                id: 'double_chariot_center',
                name: 'Carros Centrales',
                pieces: [
                    { name: 'Mingyi', pos: { x: 1, y: 0 } },
                    { name: 'Sin', pos: { x: 2, y: 0 } },
                    { name: 'Myin', pos: { x: 2, y: 1 } },
                    { name: 'Yahhta', pos: { x: 3, y: 0 } },
                    { name: 'Yahhta', pos: { x: 4, y: 0 } },
                    { name: 'Sitke', pos: { x: 4, y: 1 } },
                    { name: 'Sin', pos: { x: 5, y: 0 } },
                    { name: 'Myin', pos: { x: 5, y: 1 } }
                ]
            },
            {
                id: 'cavalry_vanguard',
                name: 'Vanguardia de Caballería',
                pieces: [
                    { name: 'Yahhta', pos: { x: 0, y: 0 } },
                    { name: 'Mingyi', pos: { x: 2, y: 0 } },
                    { name: 'Myin', pos: { x: 2, y: 2 } },
                    { name: 'Sin', pos: { x: 3, y: 0 } },
                    { name: 'Sitke', pos: { x: 4, y: 1 } },
                    { name: 'Sin', pos: { x: 5, y: 1 } },
                    { name: 'Myin', pos: { x: 6, y: 1 } },
                    { name: 'Yahhta', pos: { x: 7, y: 0 } }
                ]
            }
        ];
    }
}

/**
 * Creates a piece instance from its Sittuyin piece name.
 */
export function createSittuyinPiece(name: SittuyinPieceName, color: PieceColor, pos: Position, index: number = 0): Piece {
    const prefix = color === 'red' ? 'r' : 'b';
    switch (name) {
        case 'Mingyi': return new Mingyi(`k_${prefix}`, color, pos);
        case 'Sitke': return new Sitke(`s_${prefix}`, color, pos);
        case 'Sin': return new Sin(`sin_${prefix}_${index}`, color, pos);
        case 'Myin': return new Myin(`myin_${prefix}_${index}`, color, pos);
        case 'Yahhta': return new Yahhta(`yahhta_${prefix}_${index}`, color, pos);
    }
}

/**
 * Selects an intelligent strategic deployment preset for the AI based on difficulty level:
 * - Easy: Simpler, classical, and defensive setups ('tournament', 'fortress')
 * - Medium: Balanced mix of standard and active formations ('tournament', 'offensive_flank', 'fortress', 'cavalry_vanguard')
 * - Hard / Master: Dynamic, asymmetrical, and highly coordinated attacking formations ('offensive_flank', 'left_wing_assault', 'cavalry_vanguard', 'double_chariot_center')
 */
export function getAiSittuyinPreset(
    color: PieceColor,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): SittuyinDeployPreset {
    const presets = getSittuyinPresets(color);
    let candidateIds: string[];

    switch (difficulty) {
        case 'easy':
            candidateIds = ['tournament', 'fortress'];
            break;
        case 'hard':
            candidateIds = ['offensive_flank', 'left_wing_assault', 'cavalry_vanguard', 'double_chariot_center'];
            break;
        case 'medium':
        default:
            candidateIds = ['tournament', 'offensive_flank', 'fortress', 'cavalry_vanguard', 'left_wing_assault'];
            break;
    }

    const available = presets.filter(p => candidateIds.includes(p.id));
    const pool = available.length > 0 ? available : presets;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
}
