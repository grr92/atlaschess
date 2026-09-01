import { Board } from '../models/Board';
import type { GameVariant } from './GameVariant';
import { Shah, Rukh, Asb, Ferz, Pil, Sarbaz } from '../pieces/piecesIndex';

export class Shatranj implements GameVariant {
    name = 'Shatranj';

    setupBoard(): Board {
        const board = new Board(8, 8);

        // Black army (ranks 1 and 2)
        board.setPiece(new Rukh('r1_b', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Asb('n1_b', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Pil('a1_b', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Ferz('f_b', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new Shah('k_b', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new Pil('a2_b', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new Asb('n2_b', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Rukh('r2_b', 'black', { x: 7, y: 0 }), 7, 0);

        for (let x = 0; x < 8; x++) {
            board.setPiece(new Sarbaz(`p_b_${x}`, 'black', { x, y: 1 }), x, 1);
        }

        // White army (ranks 7 and 8)
        board.setPiece(new Rukh('r1_w', 'white', { x: 0, y: 7 }), 0, 7);
        board.setPiece(new Asb('n1_w', 'white', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new Pil('a1_w', 'white', { x: 2, y: 7 }), 2, 7);
        board.setPiece(new Ferz('f_w', 'white', { x: 3, y: 7 }), 3, 7);
        board.setPiece(new Shah('k_w', 'white', { x: 4, y: 7 }), 4, 7);
        board.setPiece(new Pil('a2_w', 'white', { x: 5, y: 7 }), 5, 7);
        board.setPiece(new Asb('n2_w', 'white', { x: 6, y: 7 }), 6, 7);
        board.setPiece(new Rukh('r2_w', 'white', { x: 7, y: 7 }), 7, 7);

        for (let x = 0; x < 8; x++) {
            board.setPiece(new Sarbaz(`p_w_${x}`, 'white', { x, y: 6 }), x, 6);
        }

        return board;
    }
}