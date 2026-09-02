import { King } from '../piecesIndex';

export class Shah extends King {
    name = 'Shah';
    hasSwappedPiece: boolean = false; // tracks if the one-time royal swap has been used (for Tamerlane Chess)

    override clone(): Shah {
        const cloned = new Shah(this.id, this.color, { ...this.position });
        cloned.hasMoved = this.hasMoved;
        cloned.hasSwappedPiece = this.hasSwappedPiece;
        return cloned;
    }
}