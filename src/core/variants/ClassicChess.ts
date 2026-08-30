import type {GameVariant} from './GameVariant';
import { Board } from '../models/Board';

import { Pawn } from '../pieces/classic/Pawn.ts';
import { Rook } from '../pieces/classic/Rook.ts';
import { Knight } from '../pieces/classic/Knight.ts';
import { Bishop } from '../pieces/classic/Bishop.ts';
import { Queen } from '../pieces/classic/Queen.ts';
import { King } from '../pieces/classic/King.ts';

export class ClassicChess implements GameVariant {
    name: string;

    constructor() {
        this.name = "Classic Chess";
    }

    setupBoard(): Board {
        const board = new Board(8, 8);

        // --- black pieces ---
        board.setPiece(new Rook('br1', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new Knight('bn1', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new Bishop('bb1', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new Queen('bq', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new King('bk', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new Bishop('bb2', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new Knight('bn2', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new Rook('br2', 'black', { x: 7, y: 0 }), 7, 0);

        for (let i = 0; i < 8; i++) {
            board.setPiece(new Pawn(`bp${i}`, 'black', { x: i, y: 1 }), i, 1);
        }

        // --- white pieces ---
        for (let i = 0; i < 8; i++) {
            board.setPiece(new Pawn(`wp${i}`, 'white', { x: i, y: 6 }), i, 6);
        }

        board.setPiece(new Rook('wr1', 'white', { x: 0, y: 7 }), 0, 7);
        board.setPiece(new Knight('wn1', 'white', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new Bishop('wb1', 'white', { x: 2, y: 7 }), 2, 7);
        board.setPiece(new Queen('wq', 'white', { x: 3, y: 7 }), 3, 7);
        board.setPiece(new King('wk', 'white', { x: 4, y: 7 }), 4, 7);
        board.setPiece(new Bishop('wb2', 'white', { x: 5, y: 7 }), 5, 7);
        board.setPiece(new Knight('wn2', 'white', { x: 6, y: 7 }), 6, 7);
        board.setPiece(new Rook('wr2', 'white', { x: 7, y: 7 }), 7, 7);

        return board;
    }
}