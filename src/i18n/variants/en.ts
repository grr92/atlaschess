import type { VariantMetaI18n, VariantCodexI18n } from '../types';

export const variantMeta_en: Record<string, VariantMetaI18n> = {
    classic: {
        title: 'Classic Chess',
        origin: '15th Century • Europe',
        tag: 'Standard',
        desc: 'The worldwide recognized modern rules with castling, en passant, and the queen.',
    },
    chaturanga: {
        title: 'Chaturanga',
        origin: '6th Century • India',
        tag: 'The Origin',
        desc: 'The earliest ancestor of chess played on an 8x8 uncheckered Ashtāpada.',
    },
    shatranj: {
        title: 'Shatranj',
        origin: '7th Century • Persia',
        tag: 'Golden Age',
        desc: 'The strategic jewel of the Silk Road. Ferz moves 1 diagonal, Pil leaps 2, and bare king loses.',
    },
    grant_acedrex: {
        title: 'Grant Acedrex',
        origin: '13th Century • Castile (Alfonso X)',
        tag: '12x12 Board',
        desc: 'The grand royal chess of Alfonso the Wise with Aancas, Unicorns, Lions, Giraffes, and Crocodiles.',
    },
    tamerlane: {
        title: 'Tamerlane Chess',
        origin: '14th Century • Timurid Empire',
        tag: '112 Squares',
        desc: 'Timur\'s grand chess with Giraffes, Camels, War Engines, 11 unique pawns, and royal Citadels.',
    },
};

export const variantCodex_en: Record<string, VariantCodexI18n> = {
    classic: {
        name: 'Classic Chess',
        rules: {
            intro: 'The game is set on an 8x8 checkered board. White moves first. The objective is to outsmart the enemy and checkmate their king. A game can also end in a draw through stalemate, threefold repetition, the 50-move rule, or insufficient material.',
            bullets: [
                {
                    title: 'The King:',
                    desc: 'Moves one square in any direction. It can also perform a special move called "castling" with a rook to improve its safety and connect the rooks.',
                    pieceName: 'King',
                },
                {
                    title: 'The Queen:',
                    desc: 'The most powerful piece. Moves horizontally, vertically, or diagonally through any number of unoccupied squares.',
                    pieceName: 'Queen',
                },
                {
                    title: 'The Rook:',
                    desc: 'Moves horizontally or vertically through any number of unoccupied squares. It is also involved in the king\'s castling move.',
                    pieceName: 'Rook',
                },
                {
                    title: 'The Bishop:',
                    desc: 'Moves diagonally through any number of unoccupied squares. A bishop always remains on its starting color (light or dark).',
                    pieceName: 'Bishop',
                },
                {
                    title: 'The Knight:',
                    desc: 'Moves in an "L" shape (two squares in one direction and one square perpendicularly). It is the only piece capable of jumping over other pieces.',
                    pieceName: 'Knight',
                },
                {
                    title: 'The Pawn:',
                    desc: 'Moves forward one square but captures diagonally. It can move two squares on its first move, capture "en passant", and must be promoted to any other piece upon reaching the opposite end of the board.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Check & Checkmate:',
                    desc: 'When a king is attacked, it is in "check" and must escape. If there is no legal move to escape the threat, it is "checkmate" and the game is immediately over.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Always try to control the center of the board early in the game. Developing your knights and bishops towards the center will maximize your attacking potential.',
        },
        history: {
            intro: 'Chess originated in India as Chaturanga before the 7th century, spreading to Persia and the Arab world before taking its modern form in Europe.',
            leftBoxTitle: 'The European Evolution',
            leftBoxDesc: 'As chess reached Europe around the 9th century, the pieces were adapted to reflect medieval society, transforming into the modern knights, bishops, and royalty we know today.',
            rightBoxTitle: 'The Mad Queen',
            rightBoxDesc: 'In late 15th-century Spain, the game drastically sped up when the queen and bishop were granted their modern, long-range sweeping powers, turning a slow game into a dynamic battle.',
        },
    },
    chaturanga: {
        name: 'Chaturanga',
        rules: {
            intro: 'The game is set on an 8x8 uncheckered board with special marks. White moves first. The objective in chaturanga is for one side to checkmate the opponent\'s raja (king) or to reduce the other side to just the raja ("bare king"), although if on the following move the other side can also reduce the opponent to "bare king", the game is drawn.',
            bullets: [
                {
                    title: 'Raja (King):',
                    desc: 'Moves like a modern king, but there is no castling available to hide him.',
                    pieceName: 'Raja',
                },
                {
                    title: 'Mantri (Counselor / Minister):',
                    desc: 'Moves exactly one step diagonally in any direction.',
                    pieceName: 'Mantri',
                },
                {
                    title: 'Ratha (Chariot):',
                    desc: 'Moves the same as a rook in chess: horizontally or vertically, through any number of unoccupied squares, without castling.',
                    pieceName: 'Ratha',
                },
                {
                    title: 'Gaja (Elephant):',
                    desc: 'Leaps exactly two squares diagonally, jumping over any pieces in between.',
                    pieceName: 'Gaja',
                },
                {
                    title: 'Ashva (Horse):',
                    desc: 'Moves the same as a knight in chess (leaping in an "L" shape).',
                    pieceName: 'Asva',
                },
                {
                    title: 'Padati (Foot-Soldier / Pawn):',
                    desc: 'Moves and captures the same as a pawn in chess, but without a double-step option on the first move.',
                    pieceName: 'Padati',
                },
                {
                    title: 'Ashtāpada Markings:',
                    desc: 'The board has traditional special markings. These markings coincide with squares unreachable by any of the four starting Gajas due to their 2-square diagonal leap rule.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: The mantri is very weak, moving only one square diagonally. Keep it close to your king for defense and rely on your rathas (rooks) for offense.',
        },
        history: {
            intro: 'Chaturanga is an ancient strategy board game widely recognized as the earliest direct ancestor of modern chess. It serves as the foundational root from which an entire family of strategic board games branched out across the globe.',
            leftBoxTitle: 'Origins and the "Four Divisions"',
            leftBoxDesc: 'The game originated in Northern India during the Gupta Empire, around the 6th century CE. The Sanskrit name "Chaturanga" translates to "four divisions of the military," reflecting ancient Indian army formations: infantry, cavalry, elephantry, and chariotry.',
            rightBoxTitle: 'Evolution and Global Spread',
            rightBoxDesc: 'Thanks to merchants and scholars along the Silk Road, Chaturanga spread westward into Persia (becoming Shatranj) and eastward into Asia, evolving into Xiangqi (China), Shogi (Japan), and Makruk (Thailand).',
        },
    },
    shatranj: {
        name: 'Shatranj',
        rules: {
            intro: 'The game is set on an 8x8 uncheckered board. White moves first. The objective in Shatranj is to checkmate the opponent\'s Shah (king) or to reduce their army to just the Shah ("bare king"). Unlike modern chess, stalemating your opponent is also counted as a victory.',
            bullets: [
                {
                    title: 'Shah (King):',
                    desc: 'Moves like a modern king, but there is no castling available to hide him.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Ferz (Counselor / Vizier):',
                    desc: 'Moves exactly one step diagonally in any direction.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Rukh (Chariot / Rook):',
                    desc: 'Moves the same as a rook in chess: horizontally or vertically, through any number of unoccupied squares.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl / Alfil (Elephant):',
                    desc: 'Leaps exactly two squares diagonally, jumping over any pieces in between.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Asb / Faras (Horse):',
                    desc: 'Moves the same as a knight in chess.',
                    pieceName: 'Asb',
                },
                {
                    title: 'Sarbaz / Baydaq (Foot-Soldier / Pawn):',
                    desc: 'Moves and captures the same as a modern pawn, but without an initial double-step. Upon reaching the 8th rank, it automatically promotes to a Ferz.',
                    pieceName: 'Sarbaz',
                },
            ],
            proTip: 'Pro tip: Because the Ferz and Pīl are short-range pieces, Shatranj is a slower, highly strategic game. Focus on pawn structures and opening files for your Rukh (rooks), which are by far the most powerful pieces on the board.',
        },
        history: {
            intro: 'Shatranj is the Persian and Arabic evolution of the Indian game Chaturanga. It was the standard form of chess played in the Middle East, North Africa, and Europe for nearly a millennium before modern chess rules emerged.',
            leftBoxTitle: 'The Islamic Golden Age',
            leftBoxDesc: 'After Chaturanga arrived in Sasanian Persia, it was renamed Chatrang and later adapted into Shatranj. Arab masters formalized the rules, recorded the first algebraic notations, and wrote extensively on strategy, creating complex puzzles known as "mansubat".',
            rightBoxTitle: 'The Journey to Europe',
            rightBoxDesc: 'Shatranj was introduced to Europe via Al-Andalus (Iberian Peninsula) and Italian trade routes. It remained largely unchanged until the late 15th century in Spain, when the Ferz and Pīl were replaced by the modern Queen and Bishop.',
        },
    },
    grant_acedrex: {
        name: 'Grant Acedrex',
        rules: {
            intro: 'Grant Acedrex (Great Chess) is an epic 13th-century Spanish chess variant played on a 12x12 board (144 squares). Documented by King Alfonso X of Castile in the Libro de los Juegos (1283), it features majestic mythical and exotic beasts, advanced pawn starting ranks, and unique bent-rider moves.',
            bullets: [
                {
                    title: 'The King (Rey):',
                    desc: 'Moves one square in any direction. On his first move, he can leap 2 squares in any direction, jumping over intermediate pieces even if the intervening square is occupied.',
                    pieceName: 'King',
                },
                {
                    title: 'The Aanca (Giant mythical bird):',
                    desc: 'A legendary mythical bird and the most fearsome piece on the board. It steps one square diagonally and, if unobstructed, continues sliding orthogonally as a Rook for any distance away from that diagonal step.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'The Unicorn (Rhinoceros):',
                    desc: 'Leaps as a Knight on its first step; if that landing square is vacant, it can continue sliding diagonally as a Bishop in the outward direction of the leap.',
                    pieceName: 'Unicorn',
                },
                {
                    title: 'The Rook (Roque):',
                    desc: 'Slides any number of vacant squares orthogonally (horizontal or vertical), identical to modern chess.',
                    pieceName: 'Rook',
                },
                {
                    title: 'The Crocodile (Cocodrilo):',
                    desc: 'Slides any number of vacant squares diagonally, moving exactly like a modern Bishop.',
                    pieceName: 'Crocodile',
                },
                {
                    title: 'The Lion (León):',
                    desc: 'Moves 3 steps orthogonally or jumps to the opposed square of a 2x4 rectangle (2 orthogonal + 1 diagonal step), leaping over any occupied squares.',
                    pieceName: 'Lion',
                },
                {
                    title: 'The Giraffe (Jirafa):',
                    desc: 'Jumps to the opposed square of a 3x4 rectangle (1 orthogonal + 2 diagonal steps), leaping over any occupied squares in between.',
                    pieceName: 'Giraffe',
                },
                {
                    title: 'The Pawns & Initial Double-Step:',
                    desc: 'White pawns start on the 4th rank and Black pawns on the 9th rank. Pawns move 1 square forward and capture 1 diagonally. An initial 2-square move is allowed for all pawns, but only until the first pawn capture of the game occurs.',
                    pieceName: 'Grantpawn',
                },
                {
                    title: 'Promotion & Victory Conditions:',
                    desc: 'Pawns promote on the 12th rank to their file\'s origin piece (King/Aanca files promote to Aanca). Victory is achieved by Checkmate, Stalemate (stalemated side loses), or Bare King.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'The 8-Sided Die Variant (Alfonso X Rule):',
                    desc: 'To accelerate games, King Alfonso X ordered custom 8-sided dice (d8) reflecting piece hierarchy: 8 = King, 7 = Aanca, 6 = Unicorn, 5 = Rook, 4 = Lion, 3 = Crocodile, 2 = Giraffe, 1 = Pawn. In this mode, players roll the die and must move a piece corresponding to the rolled number.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Pro tip: Leverage your King\'s 2-square opening leap for rapid activation, and note that the initial pawn double-step disappears as soon as any pawn capture takes place!',
        },
        history: {
            intro: 'Grant Acedrex was commissioned in 1283 by King Alfonso X "The Wise" (El Sabio) of Castile and León as part of the famous Libro de los Juegos (Book of Games), preserved at El Escorial Monastery.',
            leftBoxTitle: 'The Wisdom of Alfonso X',
            leftBoxDesc: 'Alfonso was deeply influenced by scholars in the Arab world. He conceived gaming as a philosophical dichotomy between intellect and chance. The Libro de los Juegos is considered the most comprehensive medieval gaming manuscript in European history.',
            rightBoxTitle: 'The Grand Evolution',
            rightBoxDesc: 'Grant Acedrex expanded chess onto a massive 12x12 board. Pieces like the Crocodile introduced modern diagonal bishop moves two centuries before queen and bishop changes took root in Western Europe.',
        },
    },
    tamerlane: {
        name: 'Tamerlane Chess',
        rules: {
            intro: 'Played on a massive 11x10 uncheckered board with two extra protruding squares called citadels (112 squares total). White moves first. The objective is to checkmate the opponent\'s Shah. If the Shah infiltrates the enemy citadel or all royals are exhausted, special victory and draw conditions apply.',
            bullets: [
                {
                    title: 'Shah (King):',
                    desc: 'Moves like a modern king. Once per game when under check or threat, it can swap places with any allied piece to evade danger. If the Shah falls while you have a Prince or Adventitious King, your heir is crowned as the new Shah.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Shahzada (Prince):',
                    desc: 'Created when the Pawn of Kings is promoted. Moves like a king and is marked with a "P" badge.',
                    pieceName: 'Shahzada',
                },
                {
                    title: 'Adventitious Shah (Adventitious King):',
                    desc: 'Created when the Pawn of Pawns completes its 3-stage journey. Marked with an "A" badge and moves like a king. It can enter its allied citadel to become immune or ascend to the throne if the Shah falls.',
                    pieceName: 'AdventitiousShah',
                },
                {
                    title: 'Ferz (Counselor):',
                    desc: 'Moves exactly one step diagonally in any direction.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Wazir (Vizier / Governor):',
                    desc: 'Moves exactly one step orthogonally (horizontal or vertical) in any direction.',
                    pieceName: 'Wazir',
                },
                {
                    title: 'Zurafa (Giraffe):',
                    desc: 'Moves one square diagonally, and then slides horizontally or vertically for a minimum of three squares. It cannot jump over intervening pieces.',
                    pieceName: 'Zurafa',
                },
                {
                    title: 'Talia (Picket / Scout):',
                    desc: 'Slides diagonally like a bishop, but must move a minimum of two squares. It cannot jump over an adjacent diagonal piece.',
                    pieceName: 'Talia',
                },
                {
                    title: 'Faras / Asb (Horse):',
                    desc: 'Moves the same as a knight in chess (leaping in an "L" shape).',
                    pieceName: 'Asb',
                },
                {
                    title: 'Rukh (Chariot):',
                    desc: 'Moves the same as a rook in chess: horizontally or vertically through any number of unoccupied squares.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl (Elephant):',
                    desc: 'Leaps exactly two squares diagonally, jumping over any piece in between.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Jamal (Camel):',
                    desc: 'Leaps in an elongated "L" shape (1 diagonal + 2 straight, or 3x1), jumping over any piece in between.',
                    pieceName: 'Jamal',
                },
                {
                    title: 'Dabbaba (War Engine):',
                    desc: 'Leaps exactly two squares orthogonally, jumping over any piece in between.',
                    pieceName: 'Dabbaba',
                },
                {
                    title: 'The 11 Pawns & Promotions:',
                    desc: 'Move forward 1 square and capture diagonally without initial double moves. Every piece has its dedicated pawn. Upon reaching the last rank, each pawn automatically promotes to its parent piece.',
                    pieceName: 'Sarbaz',
                },
                {
                    title: 'Pawn of Pawns Lifecycle:',
                    desc: 'Has a unique 3-stage journey: (1) Upon reaching the last rank, it can relocate to fork pieces or attack trapped pieces. (2) On its second promotion, it teleports to the Pawn of King square. (3) On its third promotion, it transforms into an Adventitious King.',
                    pieceName: 'Shah',
                },
                {
                    title: 'The Citadels & Royal Infiltration:',
                    desc: 'Two extra squares extending from the board. Only the highest-ranking royal on the board can enter the opponent\'s citadel. If the Shah enters, you may trade places with a Prince or Adventitious King or declare an immediate draw.',
                    iconType: 'citadel',
                },
            ],
            proTip: 'Pro tip: Protect your Pawn of Pawns and coordinate your exotic jumpers (Jamal and Dabbaba) with long-range sliders. If losing, aim to infiltrate the enemy citadel with your Shah to secure a draw or swap places with your Prince!',
        },
        history: {
            intro: 'Tamerlane chess is a strategic behemoth developed in the 14th century during the reign of Timur (Tamerlane), the Turco-Mongol conqueror. It is the most famous and complex variant of "Great Chess" (Shatranj Kamil).',
            leftBoxTitle: 'The Game of a Conqueror',
            leftBoxDesc: 'Timur himself loved to play chess and preferred large board variants over the smaller 8x8 shatranj. He invited the best masters of the land to his court in Samarkand, including Ali ash-Shatranji of Tabriz.',
            rightBoxTitle: 'Myths and Legends',
            rightBoxDesc: 'A Persian manuscript attributes the origin of great chess variants to ancient legends, stating that tactical large-board variants were gifted to Alexander the Great by Hermes.',
        },
    },
};
