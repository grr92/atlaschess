import { Piece } from '../pieces/Piece.ts';
import type { Position } from '../../types';

export class Board {
    readonly cols: number;
    readonly rows: number;
    private _grid: (Piece | null)[][];

    constructor(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
        this._grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    }

    // Read-only view of the grid matrix
    get grid(): readonly (readonly (Piece | null)[])[] {
        return this._grid;
    }

    getPieceAt(x: number, y: number): Piece | null {
        if (this.isOutOfBounds(x, y)) return null;
        return this._grid[y][x];
    }

    setPiece(piece: Piece, x: number, y: number): void {
        if (!this.isOutOfBounds(x, y)) {
            this._grid[y][x] = piece;
            piece.position = { x, y };
        }
    }

    removePieceAt(x: number, y: number): Piece | null {
        if (this.isOutOfBounds(x, y)) return null;
        const piece = this._grid[y][x];
        this._grid[y][x] = null;
        return piece;
    }

    // Atomically moves a piece from one coordinate to another
    movePiece(from: Position, to: Position): Piece | null {
        const piece = this.getPieceAt(from.x, from.y);
        if (!piece) return null;
        const capturedPiece = this.getPieceAt(to.x, to.y);
        this.removePieceAt(from.x, from.y);
        this.setPiece(piece, to.x, to.y);
        return capturedPiece;
    }

    // Atomically swaps two pieces on the board
    swapPieces(pos1: Position, pos2: Position): void {
        const piece1 = this.getPieceAt(pos1.x, pos1.y);
        const piece2 = this.getPieceAt(pos2.x, pos2.y);
        if (piece1) this.setPiece(piece1, pos2.x, pos2.y);
        else this.removePieceAt(pos2.x, pos2.y);
        if (piece2) this.setPiece(piece2, pos1.x, pos1.y);
        else this.removePieceAt(pos1.x, pos1.y);
    }

    // Clears all squares on the board
    clear(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this._grid[y][x] = null;
            }
        }
    }

    // Returns all active pieces currently placed on the board
    getAllPieces(): Piece[] {
        const pieces: Piece[] = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const p = this._grid[y][x];
                if (p) pieces.push(p);
            }
        }
        return pieces;
    }

    isOutOfBounds(x: number, y: number): boolean {
        return x < 0 || x >= this.cols || y < 0 || y >= this.rows;
    }
}