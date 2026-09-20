import { Board } from '../models/Board';
import type { GameVariant } from './GameVariant';
import { Mingyi, Sitke, Sin, Myin, Yahhta, Ne } from '../pieces/piecesIndex';

export class Sittuyin implements GameVariant {
    name = 'Sittuyin';

    setupBoard(onlyPawns: boolean = false): Board {
        const board = new Board(8, 8);

        // Fixed Pawns (always present in Sittuyin)
        // Black pawns: 4 on rank 5 (a5-d5, y = 3) and 4 on rank 6 (e6-h6, y = 2)
        for (let x = 0; x < 4; x++) {
            board.setPiece(new Ne(`p_b_${x}`, 'black', { x, y: 3 }), x, 3);
        }
        for (let x = 4; x < 8; x++) {
            board.setPiece(new Ne(`p_b_${x}`, 'black', { x, y: 2 }), x, 2);
        }

        // Red pawns: 4 on rank 3 (a3-d3, y = 5) and 4 on rank 4 (e4-h4, y = 4)
        for (let x = 0; x < 4; x++) {
            board.setPiece(new Ne(`p_r_${x}`, 'red', { x, y: 5 }), x, 5);
        }
        for (let x = 4; x < 8; x++) {
            board.setPiece(new Ne(`p_r_${x}`, 'red', { x, y: 4 }), x, 4);
        }

        if (!onlyPawns) {
            // --- Black Army (Back rank: y = 0) ---
            board.setPiece(new Yahhta('r1_b', 'black', { x: 0, y: 0 }), 0, 0);
            board.setPiece(new Myin('n1_b', 'black', { x: 1, y: 0 }), 1, 0);
            board.setPiece(new Sin('e1_b', 'black', { x: 2, y: 0 }), 2, 0);
            board.setPiece(new Mingyi('k_b', 'black', { x: 3, y: 0 }), 3, 0);
            board.setPiece(new Sitke('s_b', 'black', { x: 4, y: 0 }), 4, 0);
            board.setPiece(new Sin('e2_b', 'black', { x: 5, y: 0 }), 5, 0);
            board.setPiece(new Myin('n2_b', 'black', { x: 6, y: 0 }), 6, 0);
            board.setPiece(new Yahhta('r2_b', 'black', { x: 7, y: 0 }), 7, 0);

            // --- Red Army (Back rank: y = 7) ---
            board.setPiece(new Yahhta('r1_r', 'red', { x: 0, y: 7 }), 0, 7);
            board.setPiece(new Myin('n1_r', 'red', { x: 1, y: 7 }), 1, 7);
            board.setPiece(new Sin('e1_r', 'red', { x: 2, y: 7 }), 2, 7);
            board.setPiece(new Mingyi('k_r', 'red', { x: 3, y: 7 }), 3, 7);
            board.setPiece(new Sitke('s_r', 'red', { x: 4, y: 7 }), 4, 7);
            board.setPiece(new Sin('e2_r', 'red', { x: 5, y: 7 }), 5, 7);
            board.setPiece(new Myin('n2_r', 'red', { x: 6, y: 7 }), 6, 7);
            board.setPiece(new Yahhta('r2_r', 'red', { x: 7, y: 7 }), 7, 7);
        }

        return board;
    }
}
