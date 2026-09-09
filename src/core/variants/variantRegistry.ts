import type { BaseEngine } from '../engine/BaseEngine';
import { ClassicChessEngine } from '../engine/ClassicChessEngine';
import { ChaturangaEngine } from '../engine/ChaturangaEngine';
import { ShatranjEngine } from '../engine/ShatranjEngine';
import { GrantAcedrexEngine } from '../engine/GrantAcedrexEngine';
import { TamerlaneEngine } from '../engine/TamerlaneEngine';
import { CourierEngine } from '../engine/CourierEngine';
import { ChaturajiEngine } from '../engine/ChaturajiEngine';

import { ClassicChess } from './ClassicChess';
import { Chaturanga } from './Chaturanga';
import { Shatranj } from './Shatranj';
import { GrantAcedrex } from './GrantAcedrex';
import { TamerlaneChess } from './TamerlaneChess';
import { CourierChess } from './CourierChess';
import { Chaturaji } from './Chaturaji';

export type VariantCategory = 'standard' | 'historical' | 'regional';

export interface VariantDefinition {
    id: string;
    title: string;
    category: VariantCategory;
    origin: string;
    tag: string;
    desc: string;
    supportsDiceRule?: boolean;
    tileSize?: 'standard' | 'compact' | 'small';
    createEngine: () => BaseEngine;
}

export class VariantRegistry {
    private static variants: Map<string, VariantDefinition> = new Map();

    static register(definition: VariantDefinition): void {
        this.variants.set(definition.id, definition);
    }

    static get(id: string): VariantDefinition | undefined {
        return this.variants.get(id);
    }

    static getAll(): VariantDefinition[] {
        return Array.from(this.variants.values());
    }

    static getByCategory(category: VariantCategory): VariantDefinition[] {
        return this.getAll().filter(v => v.category === category);
    }

    static getTitle(id: string): string {
        return this.variants.get(id)?.title ?? id;
    }

    static createEngine(variantId: string): BaseEngine {
        const variant = this.variants.get(variantId);
        if (variant) {
            return variant.createEngine();
        }
        console.warn(`Variant '${variantId}' unknown in registry. Defaulting to Classic Chess.`);
        return new ClassicChessEngine(new ClassicChess());
    }
}

// Built-in variant registrations
VariantRegistry.register({
    id: 'classic',
    title: 'Classic Chess',
    category: 'standard',
    origin: '15th Century • Europe',
    tag: 'Standard',
    desc: 'The worldwide recognized modern rules with castling, en passant, and the queen.',
    tileSize: 'standard',
    createEngine: () => new ClassicChessEngine(new ClassicChess())
});

VariantRegistry.register({
    id: 'chaturanga',
    title: 'Chaturanga',
    category: 'historical',
    origin: '6th Century • India',
    tag: 'The Origin',
    desc: 'The ancient four-division ancestor of chess played on an 8x8 uncheckered Ashtāpada.',
    tileSize: 'standard',
    createEngine: () => new ChaturangaEngine(new Chaturanga())
});

VariantRegistry.register({
    id: 'shatranj',
    title: 'Shatranj',
    category: 'historical',
    origin: '7th Century • Persia',
    tag: 'Golden Age',
    desc: 'The strategic jewel of the Silk Road. Ferz moves 1 diagonal, Pil leaps 2, and bare king wins.',
    tileSize: 'standard',
    createEngine: () => new ShatranjEngine(new Shatranj())
});

VariantRegistry.register({
    id: 'chaturaji',
    title: 'Chaturaji',
    category: 'historical',
    origin: '10th-11th Century • India',
    tag: '4 Players',
    desc: 'Four kings battle on an 8x8 Ashtāpada with Boat Triumphs, Thrones (Sinhasana), pawn promotions, and stakes.',
    supportsDiceRule: true,
    tileSize: 'standard',
    createEngine: () => new ChaturajiEngine(new Chaturaji())
});

VariantRegistry.register({
    id: 'courier',
    title: 'Courier Chess',
    category: 'historical',
    origin: '12th Century • Germany',
    tag: '12x8 Board',
    desc: 'The medieval German masterpiece with Couriers, Sage, Schleich, and modern diagonal power.',
    tileSize: 'compact',
    createEngine: () => new CourierEngine(new CourierChess())
});

VariantRegistry.register({
    id: 'grant_acedrex',
    title: 'Grant Acedrex',
    category: 'historical',
    origin: '13th Century • Castile (Alfonso X)',
    tag: '12x12 Board',
    desc: 'The grand royal chess of Alfonso the Wise with Aancas, Unicorns, Lions, Giraffes, and Crocodiles.',
    supportsDiceRule: true,
    tileSize: 'small',
    createEngine: () => new GrantAcedrexEngine(new GrantAcedrex())
});

VariantRegistry.register({
    id: 'tamerlane',
    title: 'Tamerlane Chess',
    category: 'historical',
    origin: '14th Century • Timurid Empire',
    tag: '112 Squares',
    desc: 'Timur\'s grand chess with Giraffes, Camels, War Engines, 11 unique pawns, and royal Citadels.',
    tileSize: 'compact',
    createEngine: () => new TamerlaneEngine(new TamerlaneChess())
});


