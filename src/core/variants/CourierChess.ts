import type { GameVariant } from './GameVariant';
import { Board } from '../models/Board';
import {
    Rook,
    Knight,
    CourierBishop,
    Courier,
    Sage,
    CourierKing,
    CourierQueen,
    Schleich,
    CourierPawn
} from '../pieces/piecesIndex';

export class CourierChess implements GameVariant {
    readonly name: string = 'Courier Chess';

    setupBoard(): Board {
        const board = new Board(12, 8);

        // White pieces on rank 1 (y = 7)
        board.setPiece(new Rook('wr1', 'white', { x: 0, y: 7 }), 0, 7);
        board.setPiece(new Knight('wn1', 'white', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new CourierBishop('wb1', 'white', { x: 2, y: 7 }), 2, 7);
        board.setPiece(new Courier('ws1', 'white', { x: 3, y: 7 }), 3, 7);
        board.setPiece(new Sage('wx', 'white', { x: 4, y: 7 }), 4, 7);
        board.setPiece(new CourierKing('wk', 'white', { x: 5, y: 7 }), 5, 7);
        board.setPiece(new CourierQueen('wq', 'white', { x: 6, y: 7 }), 6, 7);
        board.setPiece(new Schleich('wt', 'white', { x: 7, y: 7 }), 7, 7);
        board.setPiece(new Courier('ws2', 'white', { x: 8, y: 7 }), 8, 7);
        board.setPiece(new CourierBishop('wb2', 'white', { x: 9, y: 7 }), 9, 7);
        board.setPiece(new Knight('wn2', 'white', { x: 10, y: 7 }), 10, 7);
        board.setPiece(new Rook('wr2', 'white', { x: 11, y: 7 }), 11, 7);

        // White pawns on rank 2 (y = 6)
        for (let x = 0; x < 12; x++) {
            board.setPiece(new CourierPawn(`wp${x}`, 'white', { x, y: 6 }), x, 6);
        }

        // Black pawns on rank 7 (y = 1)
        for (let x = 0; x < 12; x++) {
            board.setPiece(new CourierPawn(`bp${x}`, 'black', { x, y: 1 }), x, 1);
        }

        // Black pieces on rank 8 (y = 0)
        board.setPiece(new Rook('br1', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Knight('bn1', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new CourierBishop('bb1', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Courier('bs1', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new Sage('bx', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new CourierKing('bk', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new CourierQueen('bq', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Schleich('bt', 'black', { x: 7, y: 0 }), 7, 0);
        board.setPiece(new Courier('bs2', 'black', { x: 8, y: 0 }), 8, 0);
        board.setPiece(new CourierBishop('bb2', 'black', { x: 9, y: 0 }), 9, 0);
        board.setPiece(new Knight('bn2', 'black', { x: 10, y: 0 }), 10, 0);
        board.setPiece(new Rook('br2', 'black', { x: 11, y: 0 }), 11, 0);

        return board;
    }
}
