import { useGameStore } from '../store/useGameStore';
import type { AppLanguage } from '../store/types';
import type { Translations, VariantMetaI18n, VariantCodexI18n } from './types';

import { en } from './locales/en';
import { es } from './locales/es';
import { ca } from './locales/ca';

import { variantMeta_en, variantCodex_en } from './variants/en';
import { variantMeta_es, variantCodex_es } from './variants/es';
import { variantMeta_ca, variantCodex_ca } from './variants/ca';

const translationsMap: Record<AppLanguage, Translations> = {
    en,
    es,
    ca,
};

const variantMetaMap: Record<AppLanguage, Record<string, VariantMetaI18n>> = {
    en: variantMeta_en,
    es: variantMeta_es,
    ca: variantMeta_ca,
};

const variantCodexMap: Record<AppLanguage, Record<string, VariantCodexI18n>> = {
    en: variantCodex_en,
    es: variantCodex_es,
    ca: variantCodex_ca,
};

const fallbackVariantCodex: VariantCodexI18n = {
    name: 'Unknown Variant',
    rules: {
        intro: 'Rules for this variant have not been documented yet.',
        bullets: [],
        proTip: 'Play carefully.',
    },
    history: {
        intro: 'History for this variant is lost to time.',
        leftBoxTitle: 'Unknown Origins',
        leftBoxDesc: 'Documentation pending.',
        rightBoxTitle: 'Future Updates',
        rightBoxDesc: 'Documentation pending.',
    },
};

const pieceNamesMap: Record<AppLanguage, Record<string, string>> = {
    en: {
        King: 'King',
        Queen: 'Queen',
        Rook: 'Rook',
        Bishop: 'Bishop',
        Knight: 'Knight',
        Pawn: 'Pawn',
        GrantKing: 'King',
        Aanca: 'Aanca',
        Unicorn: 'Unicorn',
        Lion: 'Lion',
        Crocodile: 'Crocodile',
        Giraffe: 'Giraffe',
        Grantpawn: 'Pawn',
    },
    es: {
        King: 'Rey',
        Queen: 'Dama',
        Rook: 'Torre',
        Bishop: 'Alfil',
        Knight: 'Caballo',
        Pawn: 'Peón',
        GrantKing: 'Rey',
        Aanca: 'Aanca',
        Unicorn: 'Unicornio',
        Lion: 'León',
        Crocodile: 'Cocodrilo',
        Giraffe: 'Jirafa',
        Grantpawn: 'Peón',
    },
    ca: {
        King: 'Rei',
        Queen: 'Dama',
        Rook: 'Torre',
        Bishop: 'Alfil',
        Knight: 'Cavall',
        Pawn: 'Peó',
        GrantKing: 'Rei',
        Aanca: 'Aanca',
        Unicorn: 'Unicorn',
        Lion: 'Lleó',
        Crocodile: 'Cocodril',
        Giraffe: 'Girafa',
        Grantpawn: 'Peó',
    },
};

export const useTranslation = () => {
    const language = useGameStore((state) => state.language) || 'en';

    const t = translationsMap[language] || en;

    const getVariantMeta = (variantId: string): VariantMetaI18n => {
        const metas = variantMetaMap[language] || variantMeta_en;
        return metas[variantId] || variantMeta_en[variantId] || {
            title: variantId,
            origin: '',
            tag: '',
            desc: '',
        };
    };

    const getVariantCodex = (variantId: string): VariantCodexI18n => {
        const codices = variantCodexMap[language] || variantCodex_en;
        return codices[variantId] || variantCodex_en[variantId] || fallbackVariantCodex;
    };

    const getPieceName = (name: string): string => {
        const names = pieceNamesMap[language] || pieceNamesMap.en;
        return names[name] || name;
    };

    return {
        t,
        language,
        getVariantMeta,
        getVariantCodex,
        getPieceName,
    };
};
