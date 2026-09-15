import type { GameVariant } from './GameVariant';
import { Board } from '../models/Board';
import {
    XiangqiGeneral,
    XiangqiAdvisor,
    XiangqiElephant,
    XiangqiHorse,
    XiangqiChariot,
    XiangqiCannon,
    XiangqiSoldier
} from '../pieces/piecesIndex';

export class Xiangqi implements GameVariant {
    name: string;

    constructor() {
        this.name = 'Xiangqi';
    }

    setupBoard(): Board {
        const board = new Board(9, 10);

        // Black pieces (top, rows 0-3)
        board.setPiece(new XiangqiChariot('br1', 'black', { x: 0, y: 0 }), 0, 0);
        board.setPiece(new XiangqiHorse('bn1', 'black', { x: 1, y: 0 }), 1, 0);
        board.setPiece(new XiangqiElephant('be1', 'black', { x: 2, y: 0 }), 2, 0);
        board.setPiece(new XiangqiAdvisor('ba1', 'black', { x: 3, y: 0 }), 3, 0);
        board.setPiece(new XiangqiGeneral('bk', 'black', { x: 4, y: 0 }), 4, 0);
        board.setPiece(new XiangqiAdvisor('ba2', 'black', { x: 5, y: 0 }), 5, 0);
        board.setPiece(new XiangqiElephant('be2', 'black', { x: 6, y: 0 }), 6, 0);
        board.setPiece(new XiangqiHorse('bn2', 'black', { x: 7, y: 0 }), 7, 0);
        board.setPiece(new XiangqiChariot('br2', 'black', { x: 8, y: 0 }), 8, 0);

        board.setPiece(new XiangqiCannon('bc1', 'black', { x: 1, y: 2 }), 1, 2);
        board.setPiece(new XiangqiCannon('bc2', 'black', { x: 7, y: 2 }), 7, 2);

        board.setPiece(new XiangqiSoldier('bp1', 'black', { x: 0, y: 3 }), 0, 3);
        board.setPiece(new XiangqiSoldier('bp2', 'black', { x: 2, y: 3 }), 2, 3);
        board.setPiece(new XiangqiSoldier('bp3', 'black', { x: 4, y: 3 }), 4, 3);
        board.setPiece(new XiangqiSoldier('bp4', 'black', { x: 6, y: 3 }), 6, 3);
        board.setPiece(new XiangqiSoldier('bp5', 'black', { x: 8, y: 3 }), 8, 3);

        // Red pieces (bottom, rows 6-9)
        board.setPiece(new XiangqiSoldier('rp1', 'red', { x: 0, y: 6 }), 0, 6);
        board.setPiece(new XiangqiSoldier('rp2', 'red', { x: 2, y: 6 }), 2, 6);
        board.setPiece(new XiangqiSoldier('rp3', 'red', { x: 4, y: 6 }), 4, 6);
        board.setPiece(new XiangqiSoldier('rp4', 'red', { x: 6, y: 6 }), 6, 6);
        board.setPiece(new XiangqiSoldier('rp5', 'red', { x: 8, y: 6 }), 8, 6);

        board.setPiece(new XiangqiCannon('rc1', 'red', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new XiangqiCannon('rc2', 'red', { x: 7, y: 7 }), 7, 7);

        board.setPiece(new XiangqiChariot('rr1', 'red', { x: 0, y: 9 }), 0, 9);
        board.setPiece(new XiangqiHorse('rn1', 'red', { x: 1, y: 9 }), 1, 9);
        board.setPiece(new XiangqiElephant('re1', 'red', { x: 2, y: 9 }), 2, 9);
        board.setPiece(new XiangqiAdvisor('ra1', 'red', { x: 3, y: 9 }), 3, 9);
        board.setPiece(new XiangqiGeneral('rk', 'red', { x: 4, y: 9 }), 4, 9);
        board.setPiece(new XiangqiAdvisor('ra2', 'red', { x: 5, y: 9 }), 5, 9);
        board.setPiece(new XiangqiElephant('re2', 'red', { x: 6, y: 9 }), 6, 9);
        board.setPiece(new XiangqiHorse('rn2', 'red', { x: 7, y: 9 }), 7, 9);
        board.setPiece(new XiangqiChariot('rr2', 'red', { x: 8, y: 9 }), 8, 9);

        return board;
    }
}
