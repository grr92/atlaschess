// src/core/pieces/Piece.ts
// src/core/pieces/Piece.ts
import type {Move, PieceColor, Position} from '../../types';
import { Board } from '../models/Board.ts';

export abstract class Piece {
    id: string;
    color: PieceColor;
    position: Position;
    name: string;
    hasMoved: boolean = false;

    constructor(id: string, color: PieceColor, position: Position, name: string) {
        this.id = id;
        this.color = color;
        this.position = position;
        this.name = name;
    }

    // the core logic resides here. each child piece must define its own movement rules.
    abstract getPossibleMoves(board: Board, lastMove?: Move): Position[];

    // updates the internal state of the piece.
    move(newPosition: Position): void {
        this.position = newPosition;
        this.hasMoved = true;
    }
}