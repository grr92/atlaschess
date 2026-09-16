import type { GameVariant } from './GameVariant';
import { Board } from '../models/Board';
import {
    JanggiGeneral,
    JanggiCannon,
    JanggiSoldier
} from '../pieces/piecesIndex';
import { type JanggiOptions, placeJanggiBackrankPieces } from './janggi/janggiSetup';

export class Janggi implements GameVariant {
    name: string;
    options: JanggiOptions;

    constructor(options?: JanggiOptions) {
        this.name = 'Janggi';
        this.options = {
            blueSetup: options?.blueSetup || 'inner',
            redSetup: options?.redSetup || 'inner'
        };
    }

    setupBoard(): Board {
        const board = new Board(9, 10);

        // Red (Han) pieces — top (North), row 0 backrank + General at (4,1)
        placeJanggiBackrankPieces(board, 'red', this.options.redSetup);

        board.setPiece(new JanggiGeneral('rk', 'red', { x: 4, y: 1 }), 4, 1);

        board.setPiece(new JanggiCannon('rca1', 'red', { x: 1, y: 2 }), 1, 2);
        board.setPiece(new JanggiCannon('rca2', 'red', { x: 7, y: 2 }), 7, 2);

        board.setPiece(new JanggiSoldier('rp1', 'red', { x: 0, y: 3 }), 0, 3);
        board.setPiece(new JanggiSoldier('rp2', 'red', { x: 2, y: 3 }), 2, 3);
        board.setPiece(new JanggiSoldier('rp3', 'red', { x: 4, y: 3 }), 4, 3);
        board.setPiece(new JanggiSoldier('rp4', 'red', { x: 6, y: 3 }), 6, 3);
        board.setPiece(new JanggiSoldier('rp5', 'red', { x: 8, y: 3 }), 8, 3);

        // Blue (Cho) pieces — bottom (South), General at (4,8) + row 9 backrank
        board.setPiece(new JanggiSoldier('bp1', 'blue', { x: 0, y: 6 }), 0, 6);
        board.setPiece(new JanggiSoldier('bp2', 'blue', { x: 2, y: 6 }), 2, 6);
        board.setPiece(new JanggiSoldier('bp3', 'blue', { x: 4, y: 6 }), 4, 6);
        board.setPiece(new JanggiSoldier('bp4', 'blue', { x: 6, y: 6 }), 6, 6);
        board.setPiece(new JanggiSoldier('bp5', 'blue', { x: 8, y: 6 }), 8, 6);

        board.setPiece(new JanggiCannon('bca1', 'blue', { x: 1, y: 7 }), 1, 7);
        board.setPiece(new JanggiCannon('bca2', 'blue', { x: 7, y: 7 }), 7, 7);

        board.setPiece(new JanggiGeneral('bk', 'blue', { x: 4, y: 8 }), 4, 8);

        placeJanggiBackrankPieces(board, 'blue', this.options.blueSetup);

        return board;
    }
}

