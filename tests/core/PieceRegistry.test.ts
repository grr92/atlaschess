import { describe, it, expect } from 'vitest';
import { PIECE_REGISTRY, getPieceValue, getPieceDisplayName, getPieceSvgChar, getPieceSortOrder } from '../../src/core/pieces/pieceRegistry';

describe('PieceRegistry', () => {
    it('should return valid metadata for core classic and historical pieces', () => {
        expect(getPieceValue('Queen')).toBe(900);
        expect(getPieceValue('Pawn')).toBe(100);
        expect(getPieceValue('Aanca')).toBe(950);
        expect(getPieceValue('Unicorn')).toBe(750);
        expect(getPieceValue('Zurafa')).toBe(250);

        expect(getPieceDisplayName('Grantpawn')).toBe('Pawn');
        expect(getPieceDisplayName('Unicorn')).toBe('Unicorn');
        expect(getPieceDisplayName('Shahzada')).toBe('Shahzada');

        expect(getPieceSvgChar('Aanca')).toBe('a');
        expect(getPieceSvgChar('Crocodile')).toBe('o');
        expect(getPieceSvgChar('Lion')).toBe('l');
        expect(getPieceSvgChar('Giraffe')).toBe('g');

        expect(getPieceSortOrder('Aanca')).toBe(1);
    });

    it('should have consistent registered piece metadata without missing fields', () => {
        for (const [name, meta] of Object.entries(PIECE_REGISTRY)) {
            expect(meta.name).toBe(name);
            expect(typeof meta.value).toBe('number');
            expect(typeof meta.displayName).toBe('string');
            expect(typeof meta.svgChar).toBe('string');
            expect(typeof meta.sortOrder).toBe('number');
        }
    });
});
