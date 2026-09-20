import type { BaseEngine } from '../engine/BaseEngine';
import type { PieceColor } from '../../types';
import { ClassicChessEngine } from '../engine/ClassicChessEngine';
import { ChaturangaEngine } from '../engine/ChaturangaEngine';
import { ShatranjEngine } from '../engine/ShatranjEngine';
import { GrantAcedrexEngine } from '../engine/GrantAcedrexEngine';
import { TamerlaneEngine } from '../engine/TamerlaneEngine';
import { CourierEngine } from '../engine/CourierEngine';
import { ChaturajiEngine } from '../engine/ChaturajiEngine';
import { FourSeasonsEngine } from '../engine/FourSeasonsEngine';

import { ClassicChess } from './ClassicChess';
import { Chaturanga } from './Chaturanga';
import { Shatranj } from './Shatranj';
import { GrantAcedrex } from './GrantAcedrex';
import { TamerlaneChess } from './TamerlaneChess';
import { CourierChess } from './CourierChess';
import { Chaturaji } from './Chaturaji';
import { FourSeasonsChess } from './FourSeasonsChess';
import { Xiangqi } from './Xiangqi';
import { XiangqiEngine } from '../engine/XiangqiEngine';
import { Janggi } from './Janggi';
import { JanggiEngine } from '../engine/JanggiEngine';
import { Makruk } from './Makruk';
import { MakrukEngine } from '../engine/MakrukEngine';
import { OukChaktrang } from './OukChaktrang';
import { OukChaktrangEngine } from '../engine/OukChaktrangEngine';
import { Sittuyin } from './Sittuyin';
import { SittuyinEngine } from '../engine/SittuyinEngine';

export type VariantCategory = 'standard' | 'historical' | 'regional';

export interface VariantDefinition {
    id: string;
    title: string;
    category: VariantCategory;
    origin: string;
    tag: string;
    supportsDiceRule?: boolean;
    supportsPassTurn?: boolean;
    tileSize?: 'standard' | 'compact' | 'small';
    boardType?: 'grid' | 'xiangqi' | 'janggi';
    playerColors?: PieceColor[];
    defaultPlayerColor?: PieceColor;
    catalogPieceColor?: PieceColor;
    hasPieceStyleToggle?: boolean;
    isMonochromeBoard?: boolean;
    defaultOptions?: any;
    createEngine: (options?: any) => BaseEngine;
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

    static createEngine(variantId: string, options?: any): BaseEngine {
        const variant = this.variants.get(variantId);
        if (variant) {
            return variant.createEngine(options);
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
    tileSize: 'standard',
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new ClassicChessEngine(new ClassicChess())
});

VariantRegistry.register({
    id: 'chaturanga',
    title: 'Chaturanga',
    category: 'historical',
    origin: '6th Century • India',
    tag: 'The Origin',
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new ChaturangaEngine(new Chaturanga())
});

VariantRegistry.register({
    id: 'shatranj',
    title: 'Shatranj',
    category: 'historical',
    origin: '7th Century • Persia',
    tag: 'Golden Age',
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new ShatranjEngine(new Shatranj())
});

VariantRegistry.register({
    id: 'chaturaji',
    title: 'Chaturaji',
    category: 'historical',
    origin: '10th-11th Century • India',
    tag: '4 Players',
    supportsDiceRule: true,
    supportsPassTurn: true,
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['red', 'green', 'yellow', 'blue'],
    defaultPlayerColor: 'red',
    createEngine: () => new ChaturajiEngine(new Chaturaji())
});

VariantRegistry.register({
    id: 'courier',
    title: 'Courier Chess',
    category: 'historical',
    origin: '12th Century • Germany',
    tag: '12x8 Board',
    tileSize: 'compact',
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new CourierEngine(new CourierChess())
});

VariantRegistry.register({
    id: 'grant_acedrex',
    title: 'Grant Acedrex',
    category: 'historical',
    origin: '13th Century • Castile (Alfonso X)',
    tag: '12x12 Board',
    supportsDiceRule: true,
    tileSize: 'small',
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new GrantAcedrexEngine(new GrantAcedrex())
});

VariantRegistry.register({
    id: 'four_seasons',
    title: 'Four Seasons Chess',
    category: 'historical',
    origin: '13th Century • Castile (Alfonso X)',
    tag: '4 Players',
    supportsDiceRule: true,
    tileSize: 'standard',
    playerColors: ['green', 'red', 'black', 'white'],
    defaultPlayerColor: 'green',
    createEngine: () => new FourSeasonsEngine(new FourSeasonsChess())
});

VariantRegistry.register({
    id: 'tamerlane',
    title: 'Tamerlane Chess',
    category: 'historical',
    origin: '14th Century • Timurid Empire',
    tag: '112 Squares',
    tileSize: 'compact',
    isMonochromeBoard: true,
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    createEngine: () => new TamerlaneEngine(new TamerlaneChess())
});

VariantRegistry.register({
    id: 'xiangqi',
    title: 'Xiangqi',
    category: 'regional',
    origin: 'Southern Song Dynasty • China',
    tag: '9x10 Board',
    tileSize: 'compact',
    boardType: 'xiangqi',
    playerColors: ['red', 'black'],
    defaultPlayerColor: 'red',
    hasPieceStyleToggle: true,
    createEngine: () => new XiangqiEngine(new Xiangqi())
});
VariantRegistry.register({
    id: 'janggi',
    title: 'Janggi',
    category: 'regional',
    origin: 'Joseon Dynasty • Korea',
    tag: '9x10 Board',
    tileSize: 'compact',
    boardType: 'janggi',
    playerColors: ['blue', 'red'],
    defaultPlayerColor: 'blue',
    hasPieceStyleToggle: true,
    supportsPassTurn: true,
    createEngine: (options?: any) => new JanggiEngine(new Janggi(options), options)
});

VariantRegistry.register({
    id: 'makruk',
    title: 'Makruk',
    category: 'regional',
    origin: 'Ayutthaya Kingdom • Thailand',
    tag: '8x8 Board',
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    catalogPieceColor: 'black',
    createEngine: (options?: any) => new MakrukEngine(new Makruk(), options)
});

VariantRegistry.register({
    id: 'ouk_chaktrang',
    title: 'Ouk Chaktrang',
    category: 'regional',
    origin: '12th Century • Khmer Empire (Cambodia)',
    tag: '8x8 Board',
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['white', 'black'],
    defaultPlayerColor: 'white',
    catalogPieceColor: 'black',
    createEngine: (options?: any) => new OukChaktrangEngine(new OukChaktrang(), options)
});

VariantRegistry.register({
    id: 'sittuyin',
    title: 'Sittuyin',
    category: 'regional',
    origin: 'Traditional • Myanmar (Burma)',
    tag: '8x8 Board',
    tileSize: 'standard',
    isMonochromeBoard: true,
    playerColors: ['red', 'black'],
    defaultPlayerColor: 'red',
    catalogPieceColor: 'red',
    defaultOptions: { deploy: true },
    createEngine: (options?: any) => new SittuyinEngine(new Sittuyin(), options)
});


