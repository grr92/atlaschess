import { Board } from '../models/Board';
import type { GameVariant } from './GameVariant';
import {
    ChaturajiKing,
    ChaturajiElephant,
    ChaturajiHorse,
    ChaturajiBoat,
    ChaturajiPawn
} from '../pieces/piecesIndex';

export class Chaturaji implements GameVariant {
    name = 'Chaturaji';

    setupBoard(): Board {
        const board = new Board(8, 8);

        // 1. Green (South - Ranks 1-2, moving north dy=-1)
        board.setPiece(new ChaturajiBoat('s_g', 'green', { x: 0, y: 7 }), 0, 7); // a1
        board.setPiece(new ChaturajiHorse('n_g', 'green', { x: 1, y: 7 }), 1, 7); // b1
        board.setPiece(new ChaturajiElephant('e_g', 'green', { x: 2, y: 7 }), 2, 7); // c1
        board.setPiece(new ChaturajiKing('k_g', 'green', { x: 3, y: 7 }), 3, 7); // d1

        board.setPiece(new ChaturajiPawn('p_g_0', 'green', { x: 0, y: 6 }), 0, 6); // a2
        board.setPiece(new ChaturajiPawn('p_g_1', 'green', { x: 1, y: 6 }), 1, 6); // b2
        board.setPiece(new ChaturajiPawn('p_g_2', 'green', { x: 2, y: 6 }), 2, 6); // c2
        board.setPiece(new ChaturajiPawn('p_g_3', 'green', { x: 3, y: 6 }), 3, 6); // d2

        // 2. Red (East - Files g-h Ranks 1-4, moving west dx=-1)
        board.setPiece(new ChaturajiBoat('s_r', 'red', { x: 7, y: 7 }), 7, 7); // h1
        board.setPiece(new ChaturajiHorse('n_r', 'red', { x: 7, y: 6 }), 7, 6); // h2
        board.setPiece(new ChaturajiElephant('e_r', 'red', { x: 7, y: 5 }), 7, 5); // h3
        board.setPiece(new ChaturajiKing('k_r', 'red', { x: 7, y: 4 }), 7, 4); // h4

        board.setPiece(new ChaturajiPawn('p_r_0', 'red', { x: 6, y: 7 }), 6, 7); // g1
        board.setPiece(new ChaturajiPawn('p_r_1', 'red', { x: 6, y: 6 }), 6, 6); // g2
        board.setPiece(new ChaturajiPawn('p_r_2', 'red', { x: 6, y: 5 }), 6, 5); // g3
        board.setPiece(new ChaturajiPawn('p_r_3', 'red', { x: 6, y: 4 }), 6, 4); // g4

        // 3. Blue (North - Ranks 7-8 Files e-h, moving south dy=+1)
        board.setPiece(new ChaturajiKing('k_b', 'blue', { x: 4, y: 0 }), 4, 0); // e8
        board.setPiece(new ChaturajiElephant('e_b', 'blue', { x: 5, y: 0 }), 5, 0); // f8
        board.setPiece(new ChaturajiHorse('n_b', 'blue', { x: 6, y: 0 }), 6, 0); // g8
        board.setPiece(new ChaturajiBoat('s_b', 'blue', { x: 7, y: 0 }), 7, 0); // h8

        board.setPiece(new ChaturajiPawn('p_b_0', 'blue', { x: 4, y: 1 }), 4, 1); // e7
        board.setPiece(new ChaturajiPawn('p_b_1', 'blue', { x: 5, y: 1 }), 5, 1); // f7
        board.setPiece(new ChaturajiPawn('p_b_2', 'blue', { x: 6, y: 1 }), 6, 1); // g7
        board.setPiece(new ChaturajiPawn('p_b_3', 'blue', { x: 7, y: 1 }), 7, 1); // h7

        // 4. Yellow (West - Files a-b Ranks 5-8, moving east dx=+1)
        board.setPiece(new ChaturajiKing('k_y', 'yellow', { x: 0, y: 3 }), 0, 3); // a5
        board.setPiece(new ChaturajiElephant('e_y', 'yellow', { x: 0, y: 2 }), 0, 2); // a6
        board.setPiece(new ChaturajiHorse('n_y', 'yellow', { x: 0, y: 1 }), 0, 1); // a7
        board.setPiece(new ChaturajiBoat('s_y', 'yellow', { x: 0, y: 0 }), 0, 0); // a8

        board.setPiece(new ChaturajiPawn('p_y_0', 'yellow', { x: 1, y: 3 }), 1, 3); // b5
        board.setPiece(new ChaturajiPawn('p_y_1', 'yellow', { x: 1, y: 2 }), 1, 2); // b6
        board.setPiece(new ChaturajiPawn('p_y_2', 'yellow', { x: 1, y: 1 }), 1, 1); // b7
        board.setPiece(new ChaturajiPawn('p_y_3', 'yellow', { x: 1, y: 0 }), 1, 0); // b8

        return board;
    }
}
