import { King } from '../piecesIndex';

export class Shah extends King {
    name = 'Shah';
    hasSwappedPiece: boolean = false; // tracks if the one-time royal swap has been used (for Tamerlane Chess)
}