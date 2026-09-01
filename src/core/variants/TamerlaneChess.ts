import { TamerlaneBoard } from '../models/TamerlaneBoard';
import type { GameVariant } from './GameVariant';
import { Shah, Rukh, Asb, Ferz, Pil, Sarbaz, Wazir, Dabbaba, Jamal, Talia, Zurafa } from '../pieces/piecesIndex';

export class TamerlaneChess implements GameVariant {
    name = 'Tamerlane';

    setupBoard(): TamerlaneBoard {
        // 11 columns
        const board = new TamerlaneBoard();

        // Black army
        // Rank 10
        board.setPiece(new Pil('a1_b', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Jamal('c1_b', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new Dabbaba('d1_b', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new Dabbaba('d2_b', 'black', { x: 7, y: 0 }), 7, 0);
        board.setPiece(new Jamal('c2_b', 'black', { x: 9, y: 0 }), 9, 0);
        board.setPiece(new Pil('a2_b', 'black', { x: 11, y: 0 }), 11, 0);

        // Rank 9
        board.setPiece(new Rukh('r1_b', 'black', { x: 1, y: 1 }), 1, 1);
        board.setPiece(new Asb('n1_b', 'black', { x: 2, y: 1 }), 2, 1);
        board.setPiece(new Talia('t1_b', 'black', { x: 3, y: 1 }), 3, 1);
        board.setPiece(new Zurafa('z1_b', 'black', { x: 4, y: 1 }), 4, 1);
        board.setPiece(new Ferz('f_b', 'black', { x: 5, y: 1 }), 5, 1);
        board.setPiece(new Shah('k_b', 'black', { x: 6, y: 1 }), 6, 1);
        board.setPiece(new Wazir('w_b', 'black', { x: 7, y: 1 }), 7, 1);
        board.setPiece(new Zurafa('z2_b', 'black', { x: 8, y: 1 }), 8, 1);
        board.setPiece(new Talia('t2_b', 'black', { x: 9, y: 1 }), 9, 1);
        board.setPiece(new Asb('n2_b', 'black', { x: 10, y: 1 }), 10, 1);
        board.setPiece(new Rukh('r2_b', 'black', { x: 11, y: 1 }), 11, 1);

        // Rank 8: 11 pawns
        for (let x = 1; x <= 11; x++) {
            board.setPiece(new Sarbaz(`p_b_${x}`, 'black', { x, y: 2 }), x, 2);
        }

        // White army
        // Rank 1
        board.setPiece(new Pil('a1_w', 'white', { x: 1, y: 9 }), 1, 9);
        board.setPiece(new Jamal('c1_w', 'white', { x: 3, y: 9 }), 3, 9);
        board.setPiece(new Dabbaba('d1_w', 'white', { x: 5, y: 9 }), 5, 9);
        board.setPiece(new Dabbaba('d2_w', 'white', { x: 7, y: 9 }), 7, 9);
        board.setPiece(new Jamal('c2_w', 'white', { x: 9, y: 9 }), 9, 9);
        board.setPiece(new Pil('a2_w', 'white', { x: 11, y: 9 }), 11, 9);

        // Rank 2
        board.setPiece(new Rukh('r1_w', 'white', { x: 1, y: 8 }), 1, 8);
        board.setPiece(new Asb('n1_w', 'white', { x: 2, y: 8 }), 2, 8);
        board.setPiece(new Talia('t1_w', 'white', { x: 3, y: 8 }), 3, 8);
        board.setPiece(new Zurafa('z1_w', 'white', { x: 4, y: 8 }), 4, 8);
        board.setPiece(new Ferz('f_w', 'white', { x: 5, y: 8 }), 5, 8);
        board.setPiece(new Shah('k_w', 'white', { x: 6, y: 8 }), 6, 8);
        board.setPiece(new Wazir('w_w', 'white', { x: 7, y: 8 }), 7, 8);
        board.setPiece(new Zurafa('z2_w', 'white', { x: 8, y: 8 }), 8, 8);
        board.setPiece(new Talia('t2_w', 'white', { x: 9, y: 8 }), 9, 8);
        board.setPiece(new Asb('n2_w', 'white', { x: 10, y: 8 }), 10, 8);
        board.setPiece(new Rukh('r2_w', 'white', { x: 11, y: 8 }), 11, 8);

        // Rank 3: 11 pawns
        for (let x = 1; x <= 11; x++) {
            board.setPiece(new Sarbaz(`p_w_${x}`, 'white', { x, y: 7 }), x, 7);
        }

        return board;
    }
}