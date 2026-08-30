import { Piece } from '../pieces/Piece.ts';
import type {Position} from '../../types';

export class Board {
    cols: number;
    rows: number;
    grid: (Piece | null)[][];

    constructor(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
        // create a 2d matrix filled with nulls
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    }

    // In 2d matrices, access is grid[y][x]
    getPieceAt(x: number, y: number): Piece | null {
        if (this.isOutOfBounds(x, y)) return null;
        return this.grid[y][x];
    }

    setPiece(piece: Piece, x: number, y: number): void {
        if (!this.isOutOfBounds(x, y)) {
            this.grid[y][x] = piece;
            piece.position = { x, y };
        }
    }

    removePieceAt(x: number, y: number): void {
        if (!this.isOutOfBounds(x, y)) {
            this.grid[y][x] = null;
        }
    }

    isOutOfBounds(x: number, y: number): boolean {
        return x < 0 || x >= this.cols || y < 0 || y >= this.rows;
    }

    // moves a piece on the board (assumes the move was already validated by the engine)
    movePiece(from: Position, to: Position): void {
        const piece = this.getPieceAt(from.x, from.y);
        if (piece) {
            this.removePieceAt(from.x, from.y);
            this.setPiece(piece, to.x, to.y);
        }
    }
}