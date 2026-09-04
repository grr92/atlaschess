export interface Translations {
    common: {
        done: string;
        cancel: string;
        undo: string;
        restart: string;
        save: string;
        settings: string;
        info: string;
        infoRules: string;
        back: string;
        close: string;
        white: string;
        black: string;
        random: string;
        yes: string;
        no: string;
        loading: string;
    };
    menu: {
        titlePrefix: string;
        titleHighlight: string;
        subtitle: string;
        classicGame: string;
        chessVariants: string;
        loadGame: string;
        settings: string;
        versionInfo: string;
        techStack: string;
        invalidSaveFile: string;
    };
    settings: {
        title: string;
        subtitle: string;
        audioSection: string;
        gameSoundEffects: string;
        soundActive: string;
        soundMuted: string;
        mutedBadge: string;
        enabledBadge: string;
        languageSection: string;
        languages: {
            en: string;
            es: string;
            ca: string;
        };
    };
    gameSetup: {
        subtitle: string;
        modeLabel: string;
        vsAi: string;
        vsAiSub: string;
        pvp: string;
        pvpSub: string;
        rulesetVariant: string;
        standardRules: string;
        standardRulesSub: string;
        diceRule: string;
        diceRuleSub: string;
        playAs: string;
        aiDifficulty: string;
        easy: string;
        medium: string;
        master: string;
        cancel: string;
        startMatch: string;
    };
    variantCatalog: {
        title: string;
        subtitle: string;
        regionalCategory: string;
        historicalCategory: string;
    };
    gameplay: {
        aiThinking: string;
        turnYou: string;
        turnAi: string;
        playing: string;
        check: string;
        checkmate: string;
        draw: string;
        matchHistory: string;
        noMoves: string;
        capturedPieces: string;
        noCaptures: string;
        confirmExitTitle: string;
        confirmExitDesc: string;
        confirmRestartTitle: string;
        confirmRestartDesc: string;
        promotePawnTitle: string;
        cancelMove: string;
        citadelTitle: string;
        citadelDesc: string;
        citadelTradePrince: string;
        citadelTradeAdventitious: string;
        citadelDeclareDraw: string;
        successionTitle: string;
        successionDesc: string;
        successionCrownPrince: string;
        successionCrownAdventitious: string;
        diceThrown: string;
        rolling: string;
        selectPiece: string;
        tooltips: {
            undo: string;
            restart: string;
            save: string;
            mute: string;
            unmute: string;
            settings: string;
            info: string;
        };
    };
    variantCodex: {
        codexReference: string;
        howToPlayTab: string;
        historicalOriginsTab: string;
        objectiveTitle: string;
        piecesTitle: string;
        strategicInsight: string;
        originsTitle: string;
    };
}

export interface VariantMetaI18n {
    title: string;
    origin: string;
    tag: string;
    desc: string;
}

export interface CodexBullet {
    title: string;
    desc: string;
    pieceName?: string;
    iconType?: 'check' | 'dices' | 'citadel';
}

export interface VariantCodexI18n {
    name: string;
    rules: {
        intro: string;
        bullets: CodexBullet[];
        proTip: string;
    };
    history: {
        intro: string;
        leftBoxTitle: string;
        leftBoxDesc: string;
        rightBoxTitle: string;
        rightBoxDesc: string;
    };
}
