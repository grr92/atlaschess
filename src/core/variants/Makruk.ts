import { Board } from '../models/Board';
import type { GameVariant } from './GameVariant';
import { Khun, Met, Khon, Ma, Ruea, Bia } from '../pieces/piecesIndex';

export class Makruk implements GameVariant {
    name = 'Makruk';

    setupBoard(): Board {
        const board = new Board(8, 8);

        // --- Black Army (Ranks 8 & 6: y = 0 and y = 2) ---
        board.setPiece(new Ruea('r1_b', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Ma('n1_b', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Khon('s1_b', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Met('m_b', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new Khun('k_b', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new Khon('s2_b', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new Ma('n2_b', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Ruea('r2_b', 'black', { x: 7, y: 0 }), 7, 0);

        for (let x = 0; x < 8; x++) {
            board.setPiece(new Bia(`p_b_${x}`, 'black', { x, y: 2 }), x, 2);
        }

        // --- White Army (Ranks 1 & 3: y = 7 and y = 5) ---
        board.setPiece(new Ruea('r1_w', 'white', { x: 0, y: 7 }), 0, 7);
        board.setPiece(new Ma('n1_w', 'white', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new Khon('s1_w', 'white', { x: 2, y: 7 }), 2, 7);
        board.setPiece(new Khun('k_w', 'white', { x: 3, y: 7 }), 3, 7);
        board.setPiece(new Met('m_w', 'white', { x: 4, y: 7 }), 4, 7);
        board.setPiece(new Khon('s2_w', 'white', { x: 5, y: 7 }), 5, 7);
        board.setPiece(new Ma('n2_w', 'white', { x: 6, y: 7 }), 6, 7);
        board.setPiece(new Ruea('r2_w', 'white', { x: 7, y: 7 }), 7, 7);

        for (let x = 0; x < 8; x++) {
            board.setPiece(new Bia(`p_w_${x}`, 'white', { x, y: 5 }), x, 5);
        }

        return board;
    }
}
