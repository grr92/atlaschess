import { describe, it, expect } from 'vitest';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';
import { ClassicChessEngine } from '../../src/core/engine/ClassicChessEngine';
import { ChaturangaEngine } from '../../src/core/engine/ChaturangaEngine';
import { ShatranjEngine } from '../../src/core/engine/ShatranjEngine';
import { GrantAcedrexEngine } from '../../src/core/engine/GrantAcedrexEngine';
import { TamerlaneEngine } from '../../src/core/engine/TamerlaneEngine';
import { CourierEngine } from '../../src/core/engine/CourierEngine';

describe('VariantRegistry', () => {
    it('should retrieve registered variant definitions', () => {
        const variants = VariantRegistry.getAll();
        expect(variants.length).toBeGreaterThanOrEqual(6);

        const classic = VariantRegistry.get('classic');
        expect(classic?.title).toBe('Classic Chess');
        expect(classic?.category).toBe('standard');

        const grant = VariantRegistry.get('grant_acedrex');
        expect(grant?.title).toBe('Grant Acedrex');
        expect(grant?.supportsDiceRule).toBe(true);

        const courier = VariantRegistry.get('courier');
        expect(courier?.title).toBe('Courier Chess');
        expect(courier?.category).toBe('historical');
    });

    it('should create corresponding engines dynamically', () => {
        expect(VariantRegistry.createEngine('classic')).toBeInstanceOf(ClassicChessEngine);
        expect(VariantRegistry.createEngine('chaturanga')).toBeInstanceOf(ChaturangaEngine);
        expect(VariantRegistry.createEngine('shatranj')).toBeInstanceOf(ShatranjEngine);
        expect(VariantRegistry.createEngine('grant_acedrex')).toBeInstanceOf(GrantAcedrexEngine);
        expect(VariantRegistry.createEngine('tamerlane')).toBeInstanceOf(TamerlaneEngine);
        expect(VariantRegistry.createEngine('courier')).toBeInstanceOf(CourierEngine);
    });

    it('should filter variants by category', () => {
        const historical = VariantRegistry.getByCategory('historical');
        expect(historical.some(v => v.id === 'chaturanga')).toBe(true);
        expect(historical.some(v => v.id === 'shatranj')).toBe(true);
        expect(historical.some(v => v.id === 'tamerlane')).toBe(true);
        expect(historical.some(v => v.id === 'grant_acedrex')).toBe(true);
        expect(historical.some(v => v.id === 'courier')).toBe(true);
    });
});
