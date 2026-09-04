import { describe, it, expect } from 'vitest';
import { en } from '../../src/i18n/locales/en';
import { es } from '../../src/i18n/locales/es';
import { ca } from '../../src/i18n/locales/ca';
import { variantMeta_en, variantCodex_en } from '../../src/i18n/variants/en';
import { variantMeta_es, variantCodex_es } from '../../src/i18n/variants/es';
import { variantMeta_ca, variantCodex_ca } from '../../src/i18n/variants/ca';

describe('i18n Module', () => {
    const variants = ['classic', 'chaturanga', 'shatranj', 'grant_acedrex', 'tamerlane'];

    it('should have matching top-level keys across all locale dictionaries', () => {
        const enKeys = Object.keys(en);
        const esKeys = Object.keys(es);
        const caKeys = Object.keys(ca);

        expect(esKeys).toEqual(enKeys);
        expect(caKeys).toEqual(enKeys);

        // Buttons
        expect(en.common.back).toBe('Back');
        expect(es.common.back).toBe('Volver');
        expect(ca.common.back).toBe('Enrere');

        expect(en.common.close).toBe('Close');
        expect(es.common.close).toBe('Cerrar');
        expect(ca.common.close).toBe('Tancar');

        expect(en.common.infoRules).toBe('Info & Rules');
        expect(es.common.infoRules).toBe('Información y reglas');
        expect(ca.common.infoRules).toBe('Informació i regles');

        // Languages
        expect(en.settings.languages.es).toBe('Spanish');
        expect(es.settings.languages.es).toBe('Español');
        expect(ca.settings.languages.es).toBe('Espanyol');
    });

    it('should have complete metadata for all variants in all languages', () => {
        for (const v of variants) {
            expect(variantMeta_en[v]).toBeDefined();
            expect(variantMeta_en[v].title).toBeTruthy();

            expect(variantMeta_es[v]).toBeDefined();
            expect(variantMeta_es[v].title).toBeTruthy();

            expect(variantMeta_ca[v]).toBeDefined();
            expect(variantMeta_ca[v].title).toBeTruthy();
        }
    });

    it('should have complete codex and rules for all variants in all languages', () => {
        for (const v of variants) {
            expect(variantCodex_en[v]).toBeDefined();
            expect(variantCodex_en[v].rules.bullets.length).toBeGreaterThan(0);
            expect(variantCodex_en[v].history.intro).toBeTruthy();

            expect(variantCodex_es[v]).toBeDefined();
            expect(variantCodex_es[v].rules.bullets.length).toBeGreaterThan(0);
            expect(variantCodex_es[v].history.intro).toBeTruthy();

            expect(variantCodex_ca[v]).toBeDefined();
            expect(variantCodex_ca[v].rules.bullets.length).toBeGreaterThan(0);
            expect(variantCodex_ca[v].history.intro).toBeTruthy();
        }
    });
});
