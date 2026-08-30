import { Board } from '../models/Board';
import type {GameVariant} from './GameVariant';
import { Raja, Ratha, Asva, Mantri, Gaja, Padati } from '../pieces/piecesIndex';

export class ChaturangaVariant implements GameVariant {
    name = 'Chaturanga';

    setupBoard(): Board {
        const board = new Board(8, 8);

        // black army (ranks 0 and 1)

        // rank 0 - main pieces
        board.setPiece(new Ratha('r1_b', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Asva('n1_b', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Gaja('g1_b', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Mantri('m_b', 'black', { x: 3, y: 0 }), 3, 0); // mantri (d8)
        board.setPiece(new Raja('k_b', 'black', { x: 4, y: 0 }), 4, 0);   // raja (e8)
        board.setPiece(new Gaja('g2_b', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new Asva('n2_b', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Ratha('r2_b', 'black', { x: 7, y: 0 }), 7, 0);

        // rank 1 - padati
        for (let x = 0; x < 8; x++) {
            board.setPiece(new Padati(`p_b_${x}`, 'black', { x, y: 1 }), x, 1);
        }

        // white army (ranks 6 and 7)

        // rank 7 - main pieces
        board.setPiece(new Ratha('r1_w', 'white', { x: 0, y: 7 }), 0, 7);
        board.setPiece(new Asva('n1_w', 'white', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new Gaja('g1_w', 'white', { x: 2, y: 7 }), 2, 7);
        board.setPiece(new Mantri('m_w', 'white', { x: 3, y: 7 }), 3, 7); // mantri (d1)
        board.setPiece(new Raja('k_w', 'white', { x: 4, y: 7 }), 4, 7);   // raja (e1)
        board.setPiece(new Gaja('g2_w', 'white', { x: 5, y: 7 }), 5, 7);
        board.setPiece(new Asva('n2_w', 'white', { x: 6, y: 7 }), 6, 7);
        board.setPiece(new Ratha('r2_w', 'white', { x: 7, y: 7 }), 7, 7);

        // rank 6 - padati
        for (let x = 0; x < 8; x++) {
            board.setPiece(new Padati(`p_w_${x}`, 'white', { x, y: 6 }), x, 6);
        }

        return board;
    }
}