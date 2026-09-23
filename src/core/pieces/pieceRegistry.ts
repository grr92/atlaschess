import type { PieceName } from '../../types';

export interface PieceMetadata {
    name: PieceName;
    displayName: string;
    value: number;
    sortOrder: number;
    svgChar: string;
    diceNumber?: number;
    /** Whether two pieces of this type/color can ever reach the same square (requires disambiguation in SAN). */
    disambiguates: boolean;
}

export const PIECE_REGISTRY: Record<PieceName, PieceMetadata> = {
    // Classic Chess
    King:   { name: 'King',   displayName: 'King',   value: 10000, sortOrder: 0,  svgChar: 'k', diceNumber: 8, disambiguates: false },
    Queen:  { name: 'Queen',  displayName: 'Queen',  value: 900,   sortOrder: 2,  svgChar: 'q',               disambiguates: false },
    Rook:   { name: 'Rook',   displayName: 'Rook',   value: 500,   sortOrder: 4,  svgChar: 'r', diceNumber: 5, disambiguates: true  },
    Bishop: { name: 'Bishop', displayName: 'Bishop', value: 330,   sortOrder: 6,  svgChar: 'b',               disambiguates: true  },
    Knight: { name: 'Knight', displayName: 'Knight', value: 320,   sortOrder: 8,  svgChar: 'n',               disambiguates: true  },
    Pawn:   { name: 'Pawn',   displayName: 'Pawn',   value: 100,   sortOrder: 13, svgChar: 'p',               disambiguates: false },

    // Chaturanga
    Raja:   { name: 'Raja',   displayName: 'Raja',   value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Mantri: { name: 'Mantri', displayName: 'Mantri', value: 200,   sortOrder: 2,  svgChar: 'q', disambiguates: false },
    Ratha:  { name: 'Ratha',  displayName: 'Ratha',  value: 500,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    Gaja:   { name: 'Gaja',   displayName: 'Gaja',   value: 150,   sortOrder: 10, svgChar: 'e', disambiguates: false },
    Asva:   { name: 'Asva',   displayName: 'Asva',   value: 320,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    Padati: { name: 'Padati', displayName: 'Padati', value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Shatranj
    Shah:   { name: 'Shah',   displayName: 'Shah',   value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Ferz:   { name: 'Ferz',   displayName: 'Ferz',   value: 200,   sortOrder: 11, svgChar: 'q', disambiguates: false },
    Rukh:   { name: 'Rukh',   displayName: 'Rukh',   value: 500,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    Pil:    { name: 'Pil',    displayName: 'Pil',    value: 150,   sortOrder: 10, svgChar: 'e', disambiguates: true  },
    Asb:    { name: 'Asb',    displayName: 'Asb',    value: 320,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    Sarbaz: { name: 'Sarbaz', displayName: 'Sarbaz', value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Tamerlane Chess
    TamerlaneKing:    { name: 'TamerlaneKing',    displayName: 'King',               value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Shahzada:         { name: 'Shahzada',         displayName: 'Shahzada',           value: 900,   sortOrder: 0,  svgChar: 'k', disambiguates: false },
    AdventitiousShah: { name: 'AdventitiousShah', displayName: 'Adventitious Shah',  value: 900,   sortOrder: 0,  svgChar: 'k', disambiguates: false },
    General:          { name: 'General',          displayName: 'General',            value: 200,   sortOrder: 11, svgChar: 'q', disambiguates: false },
    Wazir:            { name: 'Wazir',            displayName: 'Wazir',              value: 200,   sortOrder: 11, svgChar: 'w', disambiguates: false },
    Giraffe:          { name: 'Giraffe',          displayName: 'Giraffe',            value: 250,   sortOrder: 5,  svgChar: 'g', diceNumber: 2, disambiguates: true  },
    Zurafa:           { name: 'Zurafa',           displayName: 'Zurafa',             value: 250,   sortOrder: 5,  svgChar: 'g', diceNumber: 2, disambiguates: true  },
    Picket:           { name: 'Picket',           displayName: 'Picket',             value: 300,   sortOrder: 6,  svgChar: 'b', disambiguates: true  },
    Talia:            { name: 'Talia',            displayName: 'Talia',              value: 300,   sortOrder: 6,  svgChar: 'b', disambiguates: true  },
    Elephant:         { name: 'Elephant',         displayName: 'Elephant',           value: 150,   sortOrder: 10, svgChar: 'e', disambiguates: true  },
    Camel:            { name: 'Camel',            displayName: 'Camel',              value: 200,   sortOrder: 12, svgChar: 'c', disambiguates: true  },
    Jamal:            { name: 'Jamal',            displayName: 'Jamal',              value: 200,   sortOrder: 12, svgChar: 'c', disambiguates: true  },
    WarEngine:        { name: 'WarEngine',        displayName: 'War Engine',         value: 150,   sortOrder: 10, svgChar: 'd', disambiguates: true  },
    Dabbaba:          { name: 'Dabbaba',          displayName: 'Dabbaba',            value: 150,   sortOrder: 10, svgChar: 'd', disambiguates: true  },
    'Pawn of Pawns':       { name: 'Pawn of Pawns',       displayName: 'Pawn of Pawns',       value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of War Engines': { name: 'Pawn of War Engines', displayName: 'Pawn of War Engines', value: 80,  sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Dabbaba':     { name: 'Pawn of Dabbaba',     displayName: 'Pawn of Dabbaba',     value: 80,  sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Camels':      { name: 'Pawn of Camels',      displayName: 'Pawn of Camels',      value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Jamal':       { name: 'Pawn of Jamal',       displayName: 'Pawn of Jamal',       value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Elephants':   { name: 'Pawn of Elephants',   displayName: 'Pawn of Elephants',   value: 75,  sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Pil':         { name: 'Pawn of Pil',         displayName: 'Pawn of Pil',         value: 75,  sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Generals':    { name: 'Pawn of Generals',    displayName: 'Pawn of Generals',    value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Wazir':       { name: 'Pawn of Wazir',       displayName: 'Pawn of Wazir',       value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Kings':       { name: 'Pawn of Kings',       displayName: 'Pawn of Kings',       value: 150, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Shah':        { name: 'Pawn of Shah',        displayName: 'Pawn of Shah',        value: 150, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Viziers':     { name: 'Pawn of Viziers',     displayName: 'Pawn of Viziers',     value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Ferz':        { name: 'Pawn of Ferz',        displayName: 'Pawn of Ferz',        value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Giraffes':    { name: 'Pawn of Giraffes',    displayName: 'Pawn of Giraffes',    value: 125, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Zurafa':      { name: 'Pawn of Zurafa',      displayName: 'Pawn of Zurafa',      value: 125, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Pickets':     { name: 'Pawn of Pickets',     displayName: 'Pawn of Pickets',     value: 150, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Talia':       { name: 'Pawn of Talia',       displayName: 'Pawn of Talia',       value: 150, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Knights':     { name: 'Pawn of Knights',     displayName: 'Pawn of Knights',     value: 160, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Asb':         { name: 'Pawn of Asb',         displayName: 'Pawn of Asb',         value: 160, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Rooks':       { name: 'Pawn of Rooks',       displayName: 'Pawn of Rooks',       value: 250, sortOrder: 13, svgChar: 'p', disambiguates: false },
    'Pawn of Rukh':        { name: 'Pawn of Rukh',        displayName: 'Pawn of Rukh',        value: 250, sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Grant Acedrex
    GrantKing:  { name: 'GrantKing',  displayName: 'King',      value: 10000, sortOrder: 0,  svgChar: 'k', diceNumber: 8, disambiguates: false },
    Aanca:      { name: 'Aanca',      displayName: 'Aanca',     value: 950,   sortOrder: 1,  svgChar: 'a', diceNumber: 7, disambiguates: false },
    Unicorn:    { name: 'Unicorn',    displayName: 'Unicorn',   value: 750,   sortOrder: 3,  svgChar: 'u', diceNumber: 6, disambiguates: false },
    Lion:       { name: 'Lion',       displayName: 'Lion',      value: 350,   sortOrder: 7,  svgChar: 'l', diceNumber: 4, disambiguates: true  },
    Crocodile:  { name: 'Crocodile',  displayName: 'Crocodile', value: 300,   sortOrder: 9,  svgChar: 'o', diceNumber: 3, disambiguates: true  },
    Grantpawn:  { name: 'Grantpawn',  displayName: 'Pawn',      value: 100,   sortOrder: 13, svgChar: 'p', diceNumber: 1, disambiguates: false },

    // Courier Chess
    CourierKing:   { name: 'CourierKing',   displayName: 'King',    value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Courier:       { name: 'Courier',       displayName: 'Courier', value: 330,   sortOrder: 6,  svgChar: 's', disambiguates: true  },
    CourierBishop: { name: 'CourierBishop', displayName: 'Bishop',  value: 150,   sortOrder: 10, svgChar: 'b', disambiguates: false },
    CourierQueen:  { name: 'CourierQueen',  displayName: 'Queen',   value: 200,   sortOrder: 11, svgChar: 'q', disambiguates: false },
    Schleich:      { name: 'Schleich',      displayName: 'Schleich',value: 200,   sortOrder: 11, svgChar: 't', disambiguates: false },
    Sage:          { name: 'Sage',          displayName: 'Sage',    value: 300,   sortOrder: 6,  svgChar: 'x', disambiguates: false },
    CourierPawn:   { name: 'CourierPawn',   displayName: 'Pawn',    value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Chaturaji (Four Kings)
    ChaturajiKing:     { name: 'ChaturajiKing',     displayName: 'King',     value: 10000, sortOrder: 0,  svgChar: 'k', diceNumber: 5, disambiguates: false },
    ChaturajiElephant: { name: 'ChaturajiElephant', displayName: 'Elephant', value: 500,   sortOrder: 4,  svgChar: 'e', diceNumber: 4, disambiguates: false },
    ChaturajiHorse:    { name: 'ChaturajiHorse',    displayName: 'Horse',    value: 320,   sortOrder: 8,  svgChar: 'n', diceNumber: 3, disambiguates: false },
    ChaturajiBoat:     { name: 'ChaturajiBoat',     displayName: 'Boat',     value: 200,   sortOrder: 10, svgChar: 's', diceNumber: 2, disambiguates: false },
    ChaturajiPawn:     { name: 'ChaturajiPawn',     displayName: 'Pawn',     value: 100,   sortOrder: 13, svgChar: 'p', diceNumber: 5, disambiguates: false },

    // Four Seasons Chess (Acedrex de los Cuatro Tiempos)
    FourSeasonsKing:    { name: 'FourSeasonsKing',    displayName: 'King',    value: 10000, sortOrder: 0,  svgChar: 'k', diceNumber: 6, disambiguates: false },
    FourSeasonsGeneral: { name: 'FourSeasonsGeneral', displayName: 'General', value: 200,   sortOrder: 11, svgChar: 'q', diceNumber: 5, disambiguates: false },
    FourSeasonsRook:    { name: 'FourSeasonsRook',    displayName: 'Rook',    value: 500,   sortOrder: 4,  svgChar: 'r', diceNumber: 4, disambiguates: false },
    FourSeasonsKnight:  { name: 'FourSeasonsKnight',  displayName: 'Knight',  value: 320,   sortOrder: 8,  svgChar: 'n', diceNumber: 3, disambiguates: false },
    FourSeasonsBishop:  { name: 'FourSeasonsBishop',  displayName: 'Bishop',  value: 150,   sortOrder: 10, svgChar: 'b', diceNumber: 2, disambiguates: false },
    FourSeasonsPawn:    { name: 'FourSeasonsPawn',    displayName: 'Pawn',    value: 100,   sortOrder: 13, svgChar: 'p', diceNumber: 1, disambiguates: false },

    // Xiangqi
    XiangqiGeneral:  { name: 'XiangqiGeneral',  displayName: 'General',  value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    XiangqiAdvisor:  { name: 'XiangqiAdvisor',  displayName: 'Advisor',  value: 200,   sortOrder: 11, svgChar: 'a', disambiguates: true  },
    XiangqiElephant: { name: 'XiangqiElephant', displayName: 'Elephant', value: 250,   sortOrder: 10, svgChar: 'e', disambiguates: true  },
    XiangqiHorse:    { name: 'XiangqiHorse',    displayName: 'Horse',    value: 400,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    XiangqiChariot:  { name: 'XiangqiChariot',  displayName: 'Chariot',  value: 900,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    XiangqiCannon:   { name: 'XiangqiCannon',   displayName: 'Cannon',   value: 450,   sortOrder: 5,  svgChar: 'c', disambiguates: true  },
    XiangqiSoldier:  { name: 'XiangqiSoldier',  displayName: 'Soldier',  value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Janggi
    JanggiGeneral: { name: 'JanggiGeneral', displayName: 'General', value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    JanggiGuard:   { name: 'JanggiGuard',   displayName: 'Guard',   value: 200,   sortOrder: 11, svgChar: 'a', disambiguates: true  },
    JanggiElephant:{ name: 'JanggiElephant',displayName: 'Elephant',value: 300,   sortOrder: 10, svgChar: 'e', disambiguates: true  },
    JanggiHorse:   { name: 'JanggiHorse',   displayName: 'Horse',   value: 400,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    JanggiChariot: { name: 'JanggiChariot', displayName: 'Chariot', value: 900,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    JanggiCannon:  { name: 'JanggiCannon',  displayName: 'Cannon',  value: 500,   sortOrder: 5,  svgChar: 'c', disambiguates: true  },
    JanggiSoldier: { name: 'JanggiSoldier', displayName: 'Soldier', value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Makruk (Thai Chess)
    Khun:    { name: 'Khun',    displayName: 'Lord',             value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Met:     { name: 'Met',     displayName: 'Seed',             value: 200,   sortOrder: 11, svgChar: 'q', disambiguates: false },
    Khon:    { name: 'Khon',    displayName: 'Nobleman',         value: 350,   sortOrder: 6,  svgChar: 'b', disambiguates: true  },
    Ma:      { name: 'Ma',      displayName: 'Horse',            value: 320,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    Ruea:    { name: 'Ruea',    displayName: 'Boat',             value: 500,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    Bia:     { name: 'Bia',     displayName: 'Cowrie',           value: 100,   sortOrder: 13, svgChar: 'p', disambiguates: false },
    Biangai: { name: 'Biangai', displayName: 'Promoted Cowrie',  value: 200,   sortOrder: 12, svgChar: 'm', disambiguates: true  },

    // Sittuyin (Burmese Chess)
    Mingyi: { name: 'Mingyi', displayName: 'King',     value: 10000, sortOrder: 0,  svgChar: 'k', disambiguates: false },
    Sitke:  { name: 'Sitke',  displayName: 'General',  value: 200,   sortOrder: 11, svgChar: 'q', disambiguates: false },
    Sin:    { name: 'Sin',    displayName: 'Elephant', value: 350,   sortOrder: 6,  svgChar: 'e', disambiguates: true  },
    Myin:   { name: 'Myin',   displayName: 'Horse',    value: 320,   sortOrder: 8,  svgChar: 'n', disambiguates: true  },
    Yahhta: { name: 'Yahhta', displayName: 'Chariot',  value: 500,   sortOrder: 4,  svgChar: 'r', disambiguates: true  },
    Ne:     { name: 'Ne',     displayName: 'Feudal Lord', value: 100, sortOrder: 13, svgChar: 'p', disambiguates: false },

    // Shogi (Japanese Chess)
    ShogiKing:           { name: 'ShogiKing',           displayName: 'King (王将/玉将)',        value: 10000, sortOrder: 0, svgChar: 'k', disambiguates: false },
    ShogiRook:           { name: 'ShogiRook',           displayName: 'Rook (飛車)',             value: 1000,  sortOrder: 1, svgChar: 'r', disambiguates: false },
    ShogiBishop:         { name: 'ShogiBishop',         displayName: 'Bishop (角行)',           value: 800,   sortOrder: 2, svgChar: 'b', disambiguates: false },
    ShogiGold:           { name: 'ShogiGold',           displayName: 'Gold General (金将)',     value: 600,   sortOrder: 3, svgChar: 'g', disambiguates: true  },
    ShogiSilver:         { name: 'ShogiSilver',         displayName: 'Silver General (銀将)',   value: 500,   sortOrder: 4, svgChar: 's', disambiguates: true  },
    ShogiKnight:         { name: 'ShogiKnight',         displayName: 'Knight (桂馬)',           value: 400,   sortOrder: 5, svgChar: 'n', disambiguates: true  },
    ShogiLance:          { name: 'ShogiLance',          displayName: 'Lance (香車)',            value: 300,   sortOrder: 6, svgChar: 'l', disambiguates: true  },
    ShogiPawn:           { name: 'ShogiPawn',           displayName: 'Pawn (歩兵)',             value: 100,   sortOrder: 7, svgChar: 'p', disambiguates: false },
    ShogiDragon:         { name: 'ShogiDragon',         displayName: 'Dragon King (龍王)',      value: 1200,  sortOrder: 1, svgChar: 'r', disambiguates: false },
    ShogiHorse:          { name: 'ShogiHorse',          displayName: 'Dragon Horse (龍馬)',     value: 1000,  sortOrder: 2, svgChar: 'b', disambiguates: false },
    ShogiPromotedSilver: { name: 'ShogiPromotedSilver', displayName: 'Promoted Silver (成銀)',  value: 600,   sortOrder: 4, svgChar: 's', disambiguates: true  },
    ShogiPromotedKnight: { name: 'ShogiPromotedKnight', displayName: 'Promoted Knight (成桂)', value: 600,   sortOrder: 5, svgChar: 'n', disambiguates: true  },
    ShogiPromotedLance:  { name: 'ShogiPromotedLance',  displayName: 'Promoted Lance (成車)',   value: 600,   sortOrder: 6, svgChar: 'l', disambiguates: true  },
    ShogiTokin:          { name: 'ShogiTokin',          displayName: 'Tokin (と金)',             value: 600,   sortOrder: 7, svgChar: 'p', disambiguates: false },
};

export const getPieceMetadata = (name: string): PieceMetadata | undefined => {
    return PIECE_REGISTRY[name as PieceName];
};

export const getPieceValue = (name: string): number => {
    return PIECE_REGISTRY[name as PieceName]?.value ?? 100;
};

export const getPieceSortOrder = (name: string): number => {
    return PIECE_REGISTRY[name as PieceName]?.sortOrder ?? 99;
};

export const getPieceDisplayName = (name: string): string => {
    return PIECE_REGISTRY[name as PieceName]?.displayName ?? name;
};

export const getPieceSvgChar = (name: string): string | null => {
    return PIECE_REGISTRY[name as PieceName]?.svgChar ?? null;
};
