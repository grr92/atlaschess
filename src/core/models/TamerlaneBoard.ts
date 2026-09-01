import { Board } from './Board';

export class TamerlaneBoard extends Board {
    constructor() {
        // 13 columns (0 to 12) by 10 rows (0 to 9)
        super(13, 10);
    }

    // Core logic: overriding the board boundaries
    isOutOfBounds(x: number, y: number): boolean {
        // Basic security check
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return true;

        // The two citadels
        if (x === 0 && y === 1) return false; // Black Citadel (on the right side of the black pieces)
        if (x === 12 && y === 8) return false; // White Citadel (on the right side of the white pieces)

        // The standard battlefield (Columns 1 through 11)
        if (x >= 1 && x <= 11) return false;

        // Everything else is the void (returns true, meaning it is "out of bounds")
        return true;
    }
}