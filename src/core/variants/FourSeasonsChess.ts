import { Board } from '../models/Board';
import type { GameVariant } from './GameVariant';
import {
    FourSeasonsKing,
    FourSeasonsRook,
    FourSeasonsKnight,
    FourSeasonsBishop,
    FourSeasonsPawn
} from '../pieces/piecesIndex';

export class FourSeasonsChess implements GameVariant {
    name = 'Four Seasons Chess';

    setupBoard(): Board {
        const board = new Board(8, 8);

        // 1. Red (Top-Left / Summer - Ranks 8..6, Files a..c)
        board.setPiece(new FourSeasonsKing('k_r', 'red', { x: 0, y: 0 }), 0, 0); // a8
        board.setPiece(new FourSeasonsKnight('n_r', 'red', { x: 1, y: 0 }), 1, 0); // b8
        board.setPiece(new FourSeasonsPawn('p_r_c8', 'red', { x: 2, y: 0 }, { dx: 1, dy: 0 }), 2, 0); // c8 (East)

        board.setPiece(new FourSeasonsRook('r_r', 'red', { x: 0, y: 1 }), 0, 1); // a7
        board.setPiece(new FourSeasonsBishop('b_r', 'red', { x: 1, y: 1 }), 1, 1); // b7
        board.setPiece(new FourSeasonsPawn('p_r_c7', 'red', { x: 2, y: 1 }, { dx: 1, dy: 0 }), 2, 1); // c7 (East)

        board.setPiece(new FourSeasonsPawn('p_r_a6', 'red', { x: 0, y: 2 }, { dx: 0, dy: 1 }), 0, 2); // a6 (South)
        board.setPiece(new FourSeasonsPawn('p_r_b6', 'red', { x: 1, y: 2 }, { dx: 0, dy: 1 }), 1, 2); // b6 (South)

        // 2. Green (Top-Right / Spring - Ranks 8..6, Files f..h)
        board.setPiece(new FourSeasonsPawn('p_g_f8', 'green', { x: 5, y: 0 }, { dx: -1, dy: 0 }), 5, 0); // f8 (West)
        board.setPiece(new FourSeasonsKnight('n_g', 'green', { x: 6, y: 0 }), 6, 0); // g8
        board.setPiece(new FourSeasonsKing('k_g', 'green', { x: 7, y: 0 }), 7, 0); // h8

        board.setPiece(new FourSeasonsPawn('p_g_f7', 'green', { x: 5, y: 1 }, { dx: -1, dy: 0 }), 5, 1); // f7 (West)
        board.setPiece(new FourSeasonsBishop('b_g', 'green', { x: 6, y: 1 }), 6, 1); // g7
        board.setPiece(new FourSeasonsRook('r_g', 'green', { x: 7, y: 1 }), 7, 1); // h7

        board.setPiece(new FourSeasonsPawn('p_g_g6', 'green', { x: 6, y: 2 }, { dx: 0, dy: 1 }), 6, 2); // g6 (South)
        board.setPiece(new FourSeasonsPawn('p_g_h6', 'green', { x: 7, y: 2 }, { dx: 0, dy: 1 }), 7, 2); // h6 (South)

        // 3. Black (Bottom-Left / Autumn - Ranks 3..1, Files a..c)
        board.setPiece(new FourSeasonsPawn('p_b_a3', 'black', { x: 0, y: 5 }, { dx: 0, dy: -1 }), 0, 5); // a3 (North)
        board.setPiece(new FourSeasonsPawn('p_b_b3', 'black', { x: 1, y: 5 }, { dx: 0, dy: -1 }), 1, 5); // b3 (North)

        board.setPiece(new FourSeasonsRook('r_b', 'black', { x: 0, y: 6 }), 0, 6); // a2
        board.setPiece(new FourSeasonsBishop('b_b', 'black', { x: 1, y: 6 }), 1, 6); // b2
        board.setPiece(new FourSeasonsPawn('p_b_c2', 'black', { x: 2, y: 6 }, { dx: 1, dy: 0 }), 2, 6); // c2 (East)

        board.setPiece(new FourSeasonsKing('k_b', 'black', { x: 0, y: 7 }), 0, 7); // a1
        board.setPiece(new FourSeasonsKnight('n_b', 'black', { x: 1, y: 7 }), 1, 7); // b1
        board.setPiece(new FourSeasonsPawn('p_b_c1', 'black', { x: 2, y: 7 }, { dx: 1, dy: 0 }), 2, 7); // c1 (East)

        // 4. White (Bottom-Right / Winter - Ranks 3..1, Files f..h)
        board.setPiece(new FourSeasonsPawn('p_w_g3', 'white', { x: 6, y: 5 }, { dx: 0, dy: -1 }), 6, 5); // g3 (North)
        board.setPiece(new FourSeasonsPawn('p_w_h3', 'white', { x: 7, y: 5 }, { dx: 0, dy: -1 }), 7, 5); // h3 (North)

        board.setPiece(new FourSeasonsPawn('p_w_f2', 'white', { x: 5, y: 6 }, { dx: -1, dy: 0 }), 5, 6); // f2 (West)
        board.setPiece(new FourSeasonsBishop('b_w', 'white', { x: 6, y: 6 }), 6, 6); // g2
        board.setPiece(new FourSeasonsRook('r_w', 'white', { x: 7, y: 6 }), 7, 6); // h2

        board.setPiece(new FourSeasonsPawn('p_w_f1', 'white', { x: 5, y: 7 }, { dx: -1, dy: 0 }), 5, 7); // f1 (West)
        board.setPiece(new FourSeasonsKnight('n_w', 'white', { x: 6, y: 7 }), 6, 7); // g1
        board.setPiece(new FourSeasonsKing('k_w', 'white', { x: 7, y: 7 }), 7, 7); // h1

        return board;
    }
}
