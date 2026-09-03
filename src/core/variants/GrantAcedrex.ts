import type { GameVariant } from './GameVariant';
import { Board } from '../models/Board';
import {
    GrantKing,
    Rook,
    Aanca,
    Unicorn,
    Lion,
    Giraffe,
    Crocodile,
    GrantPawn
} from '../pieces/piecesIndex';

export class GrantAcedrex implements GameVariant {
    readonly name: string = 'Grant Acedrex';

    setupBoard(): Board {
        const board = new Board(12, 12);

        // White pieces on rank 1 (y = 11)
        board.setPiece(new Rook('wr1', 'white', { x: 0, y: 11 }), 0, 11);
        board.setPiece(new Lion('wl1', 'white', { x: 1, y: 11 }), 1, 11);
        board.setPiece(new Unicorn('wu1', 'white', { x: 2, y: 11 }), 2, 11);
        board.setPiece(new Giraffe('wg1', 'white', { x: 3, y: 11 }), 3, 11);
        board.setPiece(new Crocodile('wo1', 'white', { x: 4, y: 11 }), 4, 11);
        board.setPiece(new Aanca('wa', 'white', { x: 5, y: 11 }), 5, 11);
        board.setPiece(new GrantKing('wk', 'white', { x: 6, y: 11 }), 6, 11);
        board.setPiece(new Crocodile('wo2', 'white', { x: 7, y: 11 }), 7, 11);
        board.setPiece(new Giraffe('wg2', 'white', { x: 8, y: 11 }), 8, 11);
        board.setPiece(new Unicorn('wu2', 'white', { x: 9, y: 11 }), 9, 11);
        board.setPiece(new Lion('wl2', 'white', { x: 10, y: 11 }), 10, 11);
        board.setPiece(new Rook('wr2', 'white', { x: 11, y: 11 }), 11, 11);

        // White pawns on rank 4 (y = 8)
        for (let x = 0; x < 12; x++) {
            board.setPiece(new GrantPawn(`wp${x}`, 'white', { x, y: 8 }, x), x, 8);
        }

        // Black pawns on rank 9 (y = 3)
        for (let x = 0; x < 12; x++) {
            board.setPiece(new GrantPawn(`bp${x}`, 'black', { x, y: 3 }, x), x, 3);
        }

        // Black pieces on rank 12 (y = 0)
        board.setPiece(new Rook('br1', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Lion('bl1', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Unicorn('bu1', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Giraffe('bg1', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new Crocodile('bo1', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new Aanca('ba', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new GrantKing('bk', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Crocodile('bo2', 'black', { x: 7, y: 0 }), 7, 0);
        board.setPiece(new Giraffe('bg2', 'black', { x: 8, y: 0 }), 8, 0);
        board.setPiece(new Unicorn('bu2', 'black', { x: 9, y: 0 }), 9, 0);
        board.setPiece(new Lion('bl2', 'black', { x: 10, y: 0 }), 10, 0);
        board.setPiece(new Rook('br2', 'black', { x: 11, y: 0 }), 11, 0);

        return board;
    }
}
