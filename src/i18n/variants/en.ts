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
    courier: {
        title: 'Courier Chess',
        origin: '12th Century • Germany',
        tag: '12x8 Board',
        desc: 'The medieval German masterpiece with Couriers, Sage, Schleich, and a 12x8 board.',
    },
    grant_acedrex: {
        title: 'Grant Acedrex',
        origin: '13th Century • Castile (Alfonso X)',
        tag: '12x12 Board',
        desc: 'The grand royal chess of Alfonso the Wise with Aancas, Unicorns, Lions, Giraffes, and Crocodiles.',
    },
    four_seasons: {
        title: 'Four Seasons Chess',
        origin: '13th Century • Castile (Alfonso X)',
        tag: '4 Players',
        desc: 'King Alfonso X\'s medieval four-player masterpiece representing the four seasons, bodily humors, and cosmic elements on an 8x8 board.',
    },
    tamerlane: {
        title: 'Tamerlane Chess',
        origin: '14th Century • Timurid Empire',
        tag: '112 Squares',
        desc: 'Timur\'s grand chess with Giraffes, Camels, War Engines, 11 unique pawns, and royal Citadels.',
    },
    chaturaji: {
        title: 'Chaturaji',
        origin: '10th–11th Century • India',
        tag: '4 Players',
        desc: 'Four-player Chaturanga (often called Chaturaji) on an 8x8 Ashtāpada with Boat Triumphs, thrones, pawn promotions, and stakes.',
    },
    xiangqi: {
        title: 'Xiangqi',
        origin: 'Southern Song Dynasty • China',
        tag: '9x10 Board',
        desc: 'A strategy board game for two players representing a battle between two armies, played on the intersections of a 9x10 grid with Cannons, the River, and the Palace.',
    },
    janggi: {
        title: 'Janggi',
        origin: 'Korean Peninsula',
        tag: '9x10 Board',
        desc: 'Korean strategy board game derived from xiangqi, played on the 90 intersections of a 9×10 board without a river. Features customizable starting setups, jumping cannons, wide-ranging elephants, and palace diagonals.',
    },
    makruk: {
        title: 'Makruk',
        origin: 'Thailand',
        tag: '8x8 Board',
        desc: 'Traditional Thai chess descended from chaturanga, featuring Lords, Seeds, Noblemen, and unique counting rules for fleeing kings.',
    },
    ouk_chaktrang: {
        title: 'Ouk Chaktrang',
        origin: 'Cambodia',
        tag: '8x8 Board',
        desc: 'Traditional Cambodian chess closely related to Makruk, featuring dynamic opening options for the Lord and Seed before the first capture occurs.',
    },
    sittuyin: {
        title: 'Sittuyin',
        origin: 'Myanmar (Burma)',
        tag: '8x8 Board',
        desc: 'Traditional Burmese chess played on a board marked with the Sit-ke-min diagonals, featuring staggered pawns and variable, customizable initial piece positions.',
    },
    shogi: {
        title: 'Shogi',
        origin: 'Heian Period • Japan',
        tag: '9x9 Board',
        desc: 'Traditional Japanese chess. Renowned for its piece drop mechanic (captured pieces rejoin the battle), territory promotions, and exceptional tactical depth.',
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
    courier: {
        name: 'Courier Chess',
        rules: {
            intro: 'The game is played on a 12x8 board (96 squares). White moves first. The objective is to checkmate the opponent\'s King. The game is famous for introducing the Courier (which moves like the modern Bishop), alongside other pieces like the Sage and the Schleich.',
            bullets: [
                {
                    title: 'King:',
                    desc: 'Moves one square in any direction. There is no castling.',
                    pieceName: 'King',
                },
                {
                    title: 'Courier:',
                    desc: 'Moves diagonally any number of unoccupied squares, exactly like the modern bishop.',
                    pieceName: 'Courier',
                },
                {
                    title: 'Bishop:',
                    desc: 'Leaps exactly two squares diagonally, jumping over intermediate pieces, just like the ancient Alfil.',
                    pieceName: 'Bishop',
                },
                {
                    title: 'Queen:',
                    desc: 'Moves exactly one square diagonally in any direction.',
                    pieceName: 'Queen',
                },
                {
                    title: 'Schleich (Jester / Fool):',
                    desc: 'Moves exactly one square orthogonally (forward, backward, left, right).',
                    pieceName: 'Schleich',
                },
                {
                    title: 'Sage / Man:',
                    desc: 'Moves one square in any direction like a king, but is a regular piece that can be hazarded and captured.',
                    pieceName: 'Sage',
                },
                {
                    title: 'Knight & Rook:',
                    desc: 'Move exactly as in modern chess. The Knight leaps in an "L" shape, and the Rook moves horizontally or vertically.',
                    pieceName: 'Knight',
                },
                {
                    title: 'Pawns & Promotion:',
                    desc: 'Pawns move one square forward and capture one square diagonally. There is no initial double step or en passant. Upon reaching the last rank, a pawn promotes to a Queen.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Endgame & Stalemate:',
                    desc: 'Checkmate wins the game. Historical records are ambiguous regarding stalemate and bare king rules; under standard variant rules, stalemate results in a draw.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: The Couriers control extensive diagonal corridors on the wide 12x8 battlefield. Coordinate them with the Rooks to generate danger!',
        },
        history: {
            intro: 'Courier Chess (Kurierschach) originated in 12th-century Germany and flourished for over six centuries, particularly in the chess village of Ströbeck near the Harz mountains.',
            leftBoxTitle: 'Village Tradition and Roya Patronage',
            leftBoxDesc: 'Courier Chess survived well into the 19th century as a local tradition in the German village of Ströbeck, famously documented by Gustavus Selenus in 1616. In 1651, Frederick William, Elector of Brandenburg and Duke of Prussia, gifted the village a custom board and silver playing sets to honor the game.',
            rightBoxTitle: 'Lucas van Leyden\'s Painting',
            rightBoxDesc: 'The game was immortalized in 1508 by Lucas van Leyden in his celebrated painting "The Chess Players", depicting a woman playing Courier Chess against a man with onlookers.',
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
            leftBoxDesc: 'Timur himself loved to play chess and preferred large board variants over the smaller 8x8 shatranj. He invited the best masters of the land to his court in Samarcanda, including Ali ash-Shatranji of Tabriz.',
            rightBoxTitle: 'Myths and Legends',
            rightBoxDesc: 'A Persian manuscript attributes the origin of great chess variants to ancient legends, stating that tactical large-board variants were gifted to Alexander the Great by Hermes.',
        },
    },
    chaturaji: {
        name: 'Chaturaji (Four-Player Chaturanga)',
        rules: {
            intro: 'Chaturaji (as four-player Chaturanga is commonly, though historically imprecisely, called) is played on an 8x8 uncheckered board by 4 players: Red (East), Green (South), Yellow (West), and Blue (North), rotating in clockwise turn order. Facing players (Red & Yellow, Green & Blue) are allied military partners, but each player scores stakes individually. Several historical rule variants and reconstructions exist across Indian and Persian manuscripts; AtlasChess implements the complete rules compiled and documented by chessvariants.com (excluding the gambling-specific rule).',
            bullets: [
                {
                    title: 'The King:',
                    desc: 'Moves one square in any direction. There is no concept of check or checkmate; Kings can be captured like any normal piece. When a player loses their King, they lose their turn and remain inactive unless their partner rescues the King.',
                    pieceName: 'ChaturajiKing',
                },
                {
                    title: 'The Elephant:',
                    desc: 'Moves horizontally or vertically through any number of unoccupied squares, exactly like the modern Rook.',
                    pieceName: 'ChaturajiElephant',
                },
                {
                    title: 'The Horse:',
                    desc: 'Moves in an "L" shape (two squares straight and one square perpendicularly), leaping over intermediate pieces, identical to the modern Knight.',
                    pieceName: 'ChaturajiHorse',
                },
                {
                    title: 'The Boat:',
                    desc: 'Leaps exactly two squares diagonally, jumping over any intervening pieces. Boat Triumph (Vrihannauka): If a Boat moves and completes a 2x2 square containing all four boats on the board, the moving boat instantly captures all other three boats simultaneously!',
                    pieceName: 'ChaturajiBoat',
                },
                {
                    title: 'The Pawn:',
                    desc: 'Moves 1 square forward in its army\'s direction of march and captures 1 square diagonally forward (no double-step). Upon reaching the far opposite baseline, it can promote to the original piece of that square (Corner = Boat, Knight-square = Horse, Rook-square = Elephant, King-square = King). However, promotion is only permitted if the player owns 2 or fewer pawns; if 3 or 4 pawns remain, it stays frozen on the baseline until allied pawns are lost.',
                    pieceName: 'ChaturajiPawn',
                },
                {
                    title: 'Thrones (Sinhasana):',
                    desc: 'A King entering an opponent\'s starting throne square earns 1 stake (2 stakes if capturing the enemy King on that throne). A King entering their partner\'s throne takes supreme command of the partner\'s entire army, controlling both forces on their turn (and earns 2 stakes if capturing the partner\'s king there).',
                },
                {
                    title: 'King Rescue:',
                    desc: 'If a player captures an enemy King while their partner\'s King has fallen (and has not been previously rescued), they can choose to rescue their partner\'s fallen King and place it on any empty square on the board.',
                },
                {
                    title: 'The Die (d4):',
                    desc: 'When playing with traditional dice rules, players roll a die to determine which piece may move: 1 = Pawn or King, 2 = Boat, 3 = Horse, 4 = Elephant. When playing without dice, players choose any legal move freely.',
                    iconType: 'dices',
                },
                {
                    title: 'Bare King & Match Victory:',
                    desc: 'If any player is reduced to only a King without other pieces, the game ends immediately in a Draw. The last surviving King earns 1 stake (2 if that King captured all 3 opposing kings, 4 if on their thrones). The overall match is won by the player who accumulated the highest number of stakes.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Watch for Boat clusters to unleash the devastating Boat Triumph (Vrihannauka). If your partner falls, invade their throne to commandeer their army or capture an enemy King to perform a King Rescue!',
        },
        history: {
            intro: 'The four-handed game known today as Chaturaji was historically called Chaturanga (literally "four divisions of the military"). While popular modern lore often calls it Chaturaji ("Four Kings"), historical manuscripts confirm it was a four-player dice variant of original Chaturanga.',
            leftBoxTitle: 'Al-Biruni & Indian Manuscripts',
            leftBoxDesc: 'The earliest detailed account was recorded around 1030 AD by the Persian polymath Al-Biruni in his Kitab al-Hind (India). The game was later documented in Sanskrit texts like Raghunandana\'s Tithitattva (15th-16th century), describing four armies (Red, Green, Yellow, Blue) competing for stakes on an 8x8 Ashtāpada board using dice.',
            rightBoxTitle: 'The Refuted Cox-Forbes Theory',
            rightBoxDesc: 'In the 19th century, Hiram Cox and Duncan Forbes famously hypothesized that 4-player dice chess was the primitive ancestor of all chess. In 1913, chess historian H.J.R. Murray and modern historians like Jean-Louis Cazaux completely disproved this theory, proving that 2-player Chaturanga came first (c. 6th century) and 4-player Chaturanga developed later around the 10th-11th century.',
        },
    },
    four_seasons: {
        name: 'Four Seasons Chess (Acedrex de los cuatro tiempos)',
        rules: {
            intro: 'Four Seasons Chess is played on an 8x8 checkered board by 4 players: Green (Spring), Red (Summer), Black (Autumn), and White (Winter). Play proceeds in counter-clockwise turn order (Green → Red → Black → White). Unlike Chaturaji, this is a 4-player free-for-all: each season fights for itself! When a King is checkmated, their army is annexed by the victor. The last player standing wins.',
            bullets: [
                {
                    title: 'The King (Rey):',
                    desc: 'Moves one square in any direction (orthogonal or diagonal). If a King is checkmated, the King is removed from the board, and the player who delivered checkmate takes command of all remaining pieces in that army.',
                    pieceName: 'FourSeasonsKing',
                },
                {
                    title: 'The General:',
                    desc: 'Moves exactly one square diagonally in any direction.',
                    pieceName: 'FourSeasonsGeneral',
                },
                {
                    title: 'The Rook (Torre):',
                    desc: 'Moves horizontally or vertically across any number of unoccupied squares, exactly like the modern Rook.',
                    pieceName: 'FourSeasonsRook',
                },
                {
                    title: 'The Knight (Caballo):',
                    desc: 'Leaps in an "L" shape (two squares straight and one perpendicular), leaping over any intermediate pieces.',
                    pieceName: 'FourSeasonsKnight',
                },
                {
                    title: 'The Bishop (Alfil):',
                    desc: 'Leaps exactly two squares diagonally, jumping over any intervening piece on the intermediate square.',
                    pieceName: 'FourSeasonsBishop',
                },
                {
                    title: 'The Pawn (Peón):',
                    desc: 'Moves one square forward along its quadrant\'s designated path and captures one square diagonally forward. Upon reaching the far edge of the board corresponding to the end of its march, it promotes immediately to a General.',
                    pieceName: 'FourSeasonsPawn',
                },
                {
                    title: 'Checkmate & Army Annexation:',
                    desc: 'When you deliver checkmate to an opponent\'s King, their King is eliminated and you inherit their entire surviving army, controlling their pieces on your turns!',
                    iconType: 'check',
                },
                {
                    title: 'Stalemate (Ahogado):',
                    desc: 'If a player has no legal moves on their turn and is not in check, they are stalemated. All pieces of the stalemated player are removed from the board.',
                },
                {
                    title: 'The 6-Sided Die (d6):',
                    desc: 'When playing with traditional dice rules, roll a d6 each turn: 1 = Pawn, 2 = Bishop (Alfil), 3 = Knight, 4 = Rook, 5 = General, 6 = King. If the rolled piece has no legal moves, the turn is forfeited.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Pro tip: Target vulnerable enemy Kings to deliver checkmate and annex their entire army! Controlling multiple armies gives you overwhelming numerical dominance across the board.',
        },
        history: {
            intro: 'Documented in 1283 in the "Libro de los Juegos" (fol. 88v) commissioned by King Alfonso X the Wise of Castile under the title "Acedrex de los Quatro Tiempos". Unlike Indian Chaturaji which was played in teams of two, each participant plays strictly for themselves in a four-way free-for-all, likely inspired by oriental influences such as Al-Biruni\'s 1030 accounts.',
            leftBoxTitle: 'The Four Seasons, Elements & Humors',
            leftBoxDesc: 'Every side represents a season, element, and bodily humor: Green represents Spring, Air, and Blood; Red represents Summer, Fire, and Choler; Black represents Autumn, Earth, and Melancholy; and White represents Winter, Water, and Phlegm. Play starts with Green and progresses in the cyclic order of the seasons.',
            rightBoxTitle: 'The Board & "El Mundo" Tables Game',
            rightBoxDesc: 'Played on an 8x8 board with pieces placed in the four corners (enabling frontal clashes) and central diagonal lines in an "X" that served as a visual guide for pawn movement. Alfonso\'s codex pairs this chess with a four-handed circular Tables (backgammon) variant titled "El Mundo" (The World) using the same four colors.',
        },
    },
    xiangqi: {
        name: 'Xiangqi',
        rules: {
            intro: 'Xiangqi is played on a board nine lines wide and ten lines long, where pieces are placed on the intersections (points). Dividing the two opposing sides between the fifth and sixth ranks is the River. Two 3x3 zones demarcated by diagonal lines form the Palace. Red moves first. The primary object is to checkmate or stalemate the enemy general.',
            bullets: [
                {
                    title: 'The General (King):',
                    desc: 'Moves and captures one point orthogonally and cannot leave the Palace. The two opposing generals cannot face each other directly across an open file with no intervening pieces (the flying general rule).',
                    pieceName: 'XiangqiGeneral',
                },
                {
                    title: 'The Advisor (Guard / Counsellor):',
                    desc: 'Moves and captures one point diagonally and cannot leave the Palace.',
                    pieceName: 'XiangqiAdvisor',
                },
                {
                    title: 'The Elephant (Minister):',
                    desc: 'Moves and captures exactly two points diagonally and cannot jump over an intervening piece (blocking the elephant\'s eye). Elephants cannot cross the River.',
                    pieceName: 'XiangqiElephant',
                },
                {
                    title: 'The Horse (Knight):',
                    desc: 'Moves one point orthogonally followed by one point diagonally outward. It does not jump: if an adjacent point in the orthogonal direction is occupied, the horse is blocked (blocking the horse\'s leg).',
                    pieceName: 'XiangqiHorse',
                },
                {
                    title: 'The Chariot (Rook):',
                    desc: 'Moves and captures any distance along straight orthogonal lines through unoccupied points.',
                    pieceName: 'XiangqiChariot',
                },
                {
                    title: 'The Cannon:',
                    desc: 'Moves like a chariot through unoccupied points. To capture, it must jump over exactly one intervening piece (the screen) of either color.',
                    pieceName: 'XiangqiCannon',
                },
                {
                    title: 'The Soldier (Pawn):',
                    desc: 'Moves and captures one point forward. After crossing the River, it can also move and capture one point horizontally (left or right). It cannot move backward and does not promote.',
                    pieceName: 'XiangqiSoldier',
                },
                {
                    title: 'The Flying General Rule:',
                    desc: 'The two generals may not face each other along the same open file without intermediate pieces. A move that exposes the generals to each other is illegal.',
                    iconType: 'check',
                },
                {
                    title: 'Victory & Stalemate:',
                    desc: 'A player wins by checkmate or by stalemating the opposing general (leaving the opponent with no legal moves).',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Deploy your chariots quickly, control open files, and coordinate cannons with screens while preventing horses from being blocked.',
        },
        history: {
            intro: 'A game called xiangqi was mentioned in the 1st-century-BC text Shuo Yuan dating to the Warring States period, and Emperor Wu of Northern Zhou described the game xiangxi in AD 569. The earliest description of the current game\'s rules appears in the story "Cén Shùn" in the collection Xuanguai lu, written by Niu Sengru during the Tang dynasty. The game has had its modern form since the Southern Song dynasty.',
            leftBoxTitle: 'Etymology',
            leftBoxDesc: 'The name xiangqi is generally interpreted literally as "elephant chess" (xiàng = elephant, qí = chess/board game). However, xiàng can also mean ivory, a figure or representation, or celestial phenomena. Historian H. J. R. Murray suggested "the Figure Game" as a probable early interpretation before pieces were distinguished by written characters.',
            rightBoxTitle: 'Origins & Spread',
            rightBoxDesc: 'According to Murray and the predominant opinion among chess historians, present-day xiangqi developed from Indian chaturanga. An alternative hypothesis favored by some Chinese historians suggests xiangqi arose in China during the Warring States period and spread westwards. Korean janggi also developed directly from xiangqi.',
        },
    },
    janggi: {
        name: 'Janggi',
        rules: {
            intro: 'Janggi (Korean: 장기), sometimes called Korean chess, is a strategy board game popular on the Korean Peninsula. Derived from xiangqi (Chinese chess), it is played on the 90 intersections of a 9×10 board without a central river. Blue (Cho) moves first. The objective of the game is to checkmate the opposing general (weh-tong).',
            bullets: [
                {
                    title: 'Initial Setup & Custom Formations:',
                    desc: 'Before the game begins, each player can transpose the positions of their adjacent Horses and Elephants. This gives rise to four possible starting setups named after the positions of the Elephants: Inner Elephant Setup (traditional default), Outer Elephant Setup, Left Elephant Setup, or Right Elephant Setup.',
                    iconType: 'check',
                },
                {
                    title: 'The General (Janggun / Gung):',
                    desc: 'Starts on the central intersection of the palace. Moves one step per turn along marked lines within the 3×3 palace (nine points) and cannot leave the palace under any circumstances. When the general is checkmated, the game is lost.',
                    pieceName: 'JanggiGeneral',
                },
                {
                    title: 'The Guards (Sa):',
                    desc: 'Two civilian government officials starting to the left and right of the general on the first rank. They move one step per turn along marked lines in the palace. They cannot leave the palace and are valuable for protecting the general.',
                    pieceName: 'JanggiGuard',
                },
                {
                    title: 'The Horse (Ma):',
                    desc: 'Moves one step orthogonally followed by one step diagonally outward without jumping. If an intervening piece occupies its first orthogonal step, the horse is blocked from moving in that direction. Can be transposed with an adjacent elephant in the initial setup.',
                    pieceName: 'JanggiHorse',
                },
                {
                    title: 'The Elephant (Sang):',
                    desc: 'Moves one point orthogonally followed by two points diagonally away, reaching the opposite corner of a 2×3 rectangle. Blocked by any intervening pieces along its path. Because there is no river, elephants can freely cross the entire board offensively.',
                    pieceName: 'JanggiElephant',
                },
                {
                    title: 'The Chariot (Cha):',
                    desc: 'Moves and captures any distance in a straight line either horizontally or vertically. Additionally, it may move in a straight line along the diagonal lines inside either palace. Begins in the corners and is the most powerful piece.',
                    pieceName: 'JanggiChariot',
                },
                {
                    title: 'The Cannon (Po):',
                    desc: 'Requires a jump over exactly one intervening piece (friendly or enemy) to both move and capture, horizontally or vertically. A cannon may not jump over another cannon, nor capture an opponent cannon. It can also travel along palace diagonals if an intervening piece occupies the palace centre.',
                    pieceName: 'JanggiCannon',
                },
                {
                    title: 'The Soldier (Byeong / Jol):',
                    desc: 'Five soldiers per side (Byeong for Red, Jol for Blue). They move and capture one point straight forward or sideways. There is no promotion; at the board edge they move only sideways. They can also move one point diagonally forward along the diagonal lines of the enemy palace.',
                    pieceName: 'JanggiSoldier',
                },
                {
                    title: 'Passing (Han-soo-shim) & Stalemate:',
                    desc: 'A player may voluntarily pass their turn (han-soo-shim) unless their general is in check. Stalemate does not end the game in a loss; a player with no legal moves is simply forced to pass. If both players pass consecutively, the game ends in a draw.',
                    iconType: 'check',
                },
                {
                    title: 'Bikjang (Facing Generals):',
                    desc: 'A player may move their general so that it faces the opposing general unobstructed across an open file or rank. The opponent can either declare a draw or make a move that breaks the face-off.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Choose your initial Elephant-Horse formation carefully to suit your opening plan. Remember that cannons must always jump over a piece to move, and utilize the palace diagonals to infiltrate with your chariots.',
        },
        history: {
            intro: 'Janggi is a strategy board game native to the Korean Peninsula, derived from Chinese xiangqi. Both share a 9×10 board and line-intersection placement, but janggi eliminated the central river, required cannons to jump while moving, and gave elephants unrestricted access across the board.',
            leftBoxTitle: 'Chu–Han Contention',
            leftBoxDesc: 'The generals represent the rival Chinese states of Han (漢, red side) and Chu (楚, blue side) that fought for power after the fall of the Qin dynasty. Red pieces are inscribed with regular script characters, while blue pieces use cursive script.',
            rightBoxTitle: 'Popular Culture',
            rightBoxDesc: 'In South Korea, janggi is a traditional mind sport and widely enjoyed leisure game. Players often gather year-round in city parks to play casual matches and analyze tactical positions.',
        },
    },
    makruk: {
        name: 'Makruk',
        rules: {
            intro: 'Makruk (Thai: หมากรุก), or Thai chess, is a strategy board game descended from 6th-century Indian chaturanga or a close relative thereof. Played on an 8x8 uncheckered board. White moves first. The objective is to checkmate the enemy lord and stalemate is a draw.',
            bullets: [
                {
                    title: 'The Lord (Khun - ขุน):',
                    desc: 'Moves or captures one space in any direction (orthogonally or diagonally). Royal piece: the game is won by checkmating the opponent\'s lord. Stalemate results in a draw, like in Western chess and unlike Shatranj.',
                    pieceName: 'Khun',
                },
                {
                    title: 'The Seed (Met - เม็ด):',
                    desc: 'Moves or captures one space diagonally in all four directions, like the ferz in Shatranj. Starts to the right side of the lord.',
                    pieceName: 'Met',
                },
                {
                    title: 'The Nobleman (Khon - โคน):',
                    desc: 'Moves or captures one space diagonally in four directions or one space straight forward (5 directions total), like the silver general in Shogi.',
                    pieceName: 'Khon',
                },
                {
                    title: 'The Horse (Ma - ม้า):',
                    desc: 'Moves two spaces orthogonally and then one space perpendicularly, leaping over any intervening pieces, exactly like the knight in Western chess.',
                    pieceName: 'Ma',
                },
                {
                    title: 'The Boat (Ruea - เรือ):',
                    desc: 'Moves or captures any number of unoccupied spaces orthogonally along ranks and files, like the rook in Western chess.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'The Cowrie Shell (Bia - เบี้ย):',
                    desc: 'Moves one space forward and captures one space diagonally forward. It cannot advance two spaces on its first move (no double-step, no en passant). When reaching the sixth rank (rank 6 for White, rank 3 for Black), it is always promoted to an overturned cowrie (Biangai).',
                    pieceName: 'Bia',
                },
                {
                    title: 'The Overturned Cowrie (Biangai - เบี้ยหงาย):',
                    desc: 'A promoted cowrie shell. Moves or captures one space diagonally in any direction, possessing identical movement to the seed (Met).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Counting Rules - Board Count (64 Moves):',
                    desc: 'When neither side has any unpromoted cowries left on the board, checkmate must be achieved within 64 moves or the game is declared a draw. The disadvantaged player counts and may stop counting (and also restart) at any time. If the disadvantaged player delivers mate without having stopped counting, the game is declared a draw.',
                    iconType: 'check',
                },
                {
                    title: 'Counting Rules - Piece Count (Fleeing King):',
                    desc: 'When the last non-lord piece of the disadvantaged player is captured, the weaker player may start counting fleeing moves. The maximum move quota is determined by the stronger player\'s surviving pieces: 2 Boats = 8 moves; 1 Boat = 16 moves; 2 Noblemen = 22 moves; 2 Horses = 32 moves; 1 Nobleman = 44 moves; 1 Horse = 64 moves; Seeds only = 64 moves. The disadvantaged player begins counting from the total number of pieces left on the board (including both lords), requiring the attacker to checkmate before the limit is reached. The disadvantaged player counts and may stop counting (and also restart) at any time.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Coordinate your boats and noblemen to establish board control, and remember that when entering the endgame without cowries or with a lone king, every move counts strictly against the countdown.',
        },
        history: {
            intro: 'Makruk (or Thai chess) is a strategy board game descended from the 6th-century Indian game of chaturanga or a close relative thereof, and is related to chess. In Cambodia, virtually the same game is played, where it is known as ouk or ouk chatrang.',
            leftBoxTitle: 'Origin and Transmission',
            leftBoxDesc: 'Persian traders arrived in the Ayutthaya kingdom around the 14th century to trade and spread their culture, suggesting Siamese makruk could have derived from Persian shatranj through cultural exchange, as the movement of the seed (met) is essentially identical to the Persian ferz. However, it is considered more likely that the game arrived more directly from India, given the phonetic similarity between chaturanga and Cambodian ouk chaktrang, as well as the movement of the nobleman (khon). In «A History of Chess» (1913), H. J. R. Murray suggests the game may have followed the expansion of Buddhism in the region.',
            rightBoxTitle: 'Cambodian Ouk',
            rightBoxDesc: 'In Cambodia and among Khmers in Vietnam (who call it cờ ốc, or «seashell chess»), ouk is a traditional staple of the Bon Om Touk festivities. 12th-century temple bas-reliefs from the Khmer Empire demonstrate that the game has been played since at least that era. It features minor differences such as optional free opening moves (the lord moving like a horse and the seed advancing two squares before any capture). Cambodia held the first nationwide standardized tournament in 2008 and featured ouk chaktrang as a traditional sport at the 2023 SEA Games.',
        },
    },
    ouk_chaktrang: {
        name: 'Ouk Chaktrang',
        rules: {
            intro: 'Ouk Chaktrang (Khmer: អុកចត្រង្គ), or Cambodian chess, is a strategy board game closely related to Thai Makruk. It shares the same pieces, board, and counting rules, but introduces dynamic opening options for the lord and seed as long as no captures have occurred in the game.',
            bullets: [
                {
                    title: 'Special Opening - Lord\'s Knight Leap (Ang):',
                    desc: 'On its very first move, and only if not currently in check, the lord may leap like a knight (L-shape), provided no pieces have been captured in the game so far.',
                    pieceName: 'Khun',
                },
                {
                    title: 'Special Opening - Seed\'s Two-Square Advance (Neang):',
                    desc: 'On its very first move, the seed may advance two squares straight forward (jumping over any intervening piece), provided no pieces have been captured in the game so far.',
                    pieceName: 'Met',
                },
                {
                    title: 'The Lord (Ang):',
                    desc: 'Moves or captures one square in any direction. The game is won by checkmating the enemy lord, and stalemate is a draw.',
                    pieceName: 'Khun',
                },
                {
                    title: 'The Seed (Neang):',
                    desc: 'Moves or captures one square diagonally in all four directions. Starts positioned to the right of the lord.',
                    pieceName: 'Met',
                },
                {
                    title: 'The Nobleman (Koul):',
                    desc: 'Moves or captures one square diagonally in four directions or one square straight forward (5 directions total), identical to the Makruk nobleman.',
                    pieceName: 'Khon',
                },
                {
                    title: 'The Horse (Ses):',
                    desc: 'Moves in an L-shape leaping over any intervening piece, exactly like the chess knight.',
                    pieceName: 'Ma',
                },
                {
                    title: 'The Boat (Tuuk):',
                    desc: 'Moves or captures any number of unobstructed squares orthogonally along ranks and files, like the chess rook.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'The Fish (Trey):',
                    desc: 'Moves one square forward and captures one square diagonally forward. Upon reaching the relative 6th rank, mandatory promotion to inverted fish (Trey Bak).',
                    pieceName: 'Bia',
                },
                {
                    title: 'The Inverted Fish (Trey Bak):',
                    desc: 'A promoted (turned over) fish. Moves or captures one square diagonally in any direction, having the same movement as the seed (Neang).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Counting Rules (Board Count & Fleeing King):',
                    desc: 'Inherits all Makruk counting rules: 64-move board count when no unpromoted fish remain, and piece countdown against a fleeing lone king. If the counting player checkmates without stopping the count, the game is declared a draw.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Utilize the lord\'s opening knight leap to quickly reach safety and activate your boats before the first capture unlocks open lines.',
        },
        history: {
            intro: 'Ouk Chaktrang (or Ouk) is the traditional strategy board game of Cambodia, with roots extending back over a millennium from ancient Indian chaturanga.',
            leftBoxTitle: 'Archaeological Evidence at Angkor',
            leftBoxDesc: '12th-century bas-reliefs in Khmer Empire temples such as Angkor Wat and the Bayon depict people playing Ouk, proving that the game was already an established courtly and popular pastime during the zenith of Angkor civilization.',
            rightBoxTitle: 'Living Tradition & Modern Sport',
            rightBoxDesc: 'Played across Cambodia and by Khmers in Vietnam (where it is known as cờ ốc), Ouk is a featured staple of the annual Bon Om Touk water festival. Standardized nationwide in 2008, it was contested as an official medal sport at the 2023 Southeast Asian Games (SEA Games).',
        },
    },
    sittuyin: {
        name: 'Sittuyin',
        rules: {
            intro: 'Sittuyin (Burmese: စစ်တုရင်) is the traditional chess of Myanmar (Burma). Played on an 8×8 monochrome board marked with crossed Sit-ke-min diagonals, pawns start in an asymmetric staggered formation and can promote to General upon reaching or crossing the diagonal promotion line in the opponent\'s territory when one\'s own General has fallen.',
            bullets: [
                {
                    title: 'The King (Mingyi):',
                    desc: 'Moves one square in any direction (orthogonal or diagonal). The objective is checkmate. Stalemate results in a draw.',
                    pieceName: 'Mingyi',
                },
                {
                    title: 'The General (Sitke):',
                    desc: 'Moves one square diagonally in all four directions (identical to the Ferz in Shatranj or Met in Makruk). Each player can have at most one active General on the board.',
                    pieceName: 'Sitke',
                },
                {
                    title: 'The Elephant (Sin):',
                    desc: 'Moves one square diagonally in all four directions or one square straight forward (5 directions in total), identical to the Nobleman in Makruk or Silver General in Shogi.',
                    pieceName: 'Sin',
                },
                {
                    title: 'The Horse (Myin):',
                    desc: 'Moves with the classic "L" leap, jumping over any obstacle in its path.',
                    pieceName: 'Myin',
                },
                {
                    title: 'The Chariot / Rook (Yahhta):',
                    desc: 'Moves orthogonally any number of unoccupied squares along ranks or files.',
                    pieceName: 'Yahhta',
                },
                {
                    title: 'The Pawn / Feudal Lord (Ne):',
                    desc: 'Moves one square straight forward without capturing, and captures one square diagonally forward. No initial double-step or en passant.',
                    pieceName: 'Ne',
                },
                {
                    title: 'Immediate and Deferred Promotion:',
                    desc: 'Pawns promote to General upon reaching or crossing the opponent\'s diagonal line, provided one\'s own General has been captured. If the General is already dead upon crossing the line, promotion is immediate. If the General is alive, the pawn remains a pawn; once the General dies later, the player may promote the pawn in situ on their turn using the floating action pill.',
                    iconType: 'check',
                },
                {
                    title: 'Draw Rules and Lone King Counting:',
                    desc: 'Draws occur by stalemate, dead position, threefold repetition, or the 50-move rule. Additionally, if a player is left with only a lone King and the opponent has no pawns, the lone King escapes with a draw if it survives a fixed move count: 16 moves if the opponent has at least one Rook, 44 moves if at least one Elephant, or 64 moves if at least one Horse.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro tip: Keep pawns posted on or beyond the enemy diagonals as a dormant threat; if your General falls, you can instantly promote or revive a new General on an advanced square.',
        },
        history: {
            intro: 'Sittuyin (Burmese: စစ်တုရင်) is Myanmar\'s millennium-old chess variant, a direct descendant of Indian chaturanga that reached the region around the 8th century. Its name derives from "sit" (war or army) and signifies the representation of the four traditional military divisions: infantry (nè), cavalry (myin), elephants (sin), and chariots (yahhta). Early Western chronicles and colonial scholarship recorded the game under names such as "chit-thareen" (Stewart Culin, 1898; Captain Hiram Cox, 1801; Major Michael Symes, 1800, who described it as the "General\'s game") or "tsit-da-yin" (G. W. Strettell, 1876). Ancient Burmese monarchs and commanders used it to rehearse real-world combat tactics before launching military campaigns: because Burmese kings fought directly on the front lines, the bold leadership of an active monarch on the board decided the battle\'s outcome.',
            leftBoxTitle: 'Ramayana Mythology, Artistry, and Living Heritage',
            leftBoxDesc: 'Traditional sets are miniature sculptures carved in wood or ivory (in official red and black or green) portraying the epic clash of the Ramayana (Yama Zatdaw): Prince Rama and his faithful monkey general Hanuman opposing the demon king Ravana. Traditional craftsmen constructed massive elevated board tables (sittuyin-kon) with sliding drawers beneath the playing surface, designed for players sitting or squatting on the floor. In classical play, pieces are slammed down onto the uncheckered wood with combative, resonant cracks reminiscent of weapon strikes. Structurally twinned with Thai Makruk and Cambodian Ouk Chaktrang as noted by chess historian Jean-Louis Cazaux, Sittuyin suffered severe decline and scarcity of antique carved sets over five decades of military dictatorship and economic hardship in the 20th century, largely overshadowed by international chess yet kept alive in northwestern Myanmar.',
            rightBoxTitle: 'The Sit-tee Encampment, Sit-ke-min Diagonals, and Classical Play',
            rightBoxDesc: 'Played on an uncheckered 64-square board crossed by two corner-to-corner diagonals called Sit-ke-min ("lines of the general"), games begin with the Sit-tee (troop deployment) phase. Behind fixed staggered pawns, each commander secretly positions their officers; in official tournaments, a cloth curtain is hung across the center to conceal army formations until both sides are marshaled. In 1913, H. J. R. Murray described this process across three distinct stages (initial placement, unrestricted maneuver, and open warfare). Pawns promote to General only upon reaching the Sit-ke-min diagonals and strictly when the player\'s original General has fallen. The objective is to checkmate (khwè) the opposing king, while stalemate is strictly forbidden. Chess encyclopedist Anne Sunnucks also documented historical variants employing three dice for triple-move turns.',
        },
    },
    shogi: {
        name: 'Shogi',
        rules: {
            intro: 'Shogi (將棋, "general\'s game"), or Japanese chess, is played on an uncheckered 9×9 board. The wedge-shaped pieces point toward the opponent. Sente (Black / White pieces at bottom) moves first. The goal is to checkmate the opposing King. Shogi\'s most famous feature is the drop rule: captured enemy pieces become part of the captor\'s reserve and can be dropped onto any vacant square as friendly pieces.',
            bullets: [
                {
                    title: 'The King (Gyoku / Osho):',
                    desc: 'Moves one square in any direction (orthogonal or diagonal). Checkmating the opposing King wins the game.',
                    pieceName: 'ShogiKing',
                },
                {
                    title: 'The Rook (Hisha) & Promoted Dragon (Ryu):',
                    desc: 'The Rook moves any number of free squares orthogonally. When promoted, it becomes a Dragon King (Ryu), retaining rook moves plus moving one square diagonally.',
                    pieceName: 'ShogiRook',
                },
                {
                    title: 'The Bishop (Kaku) & Promoted Horse (Uma):',
                    desc: 'The Bishop moves any number of free squares diagonally. When promoted, it becomes a Dragon Horse (Uma), retaining bishop moves plus moving one square orthogonally.',
                    pieceName: 'ShogiBishop',
                },
                {
                    title: 'The Gold General (Kin):',
                    desc: 'Moves one square orthogonally, or one square diagonally forward (6 directions in total). Cannot promote.',
                    pieceName: 'ShogiGold',
                },
                {
                    title: 'The Silver General (Gin):',
                    desc: 'Moves one square diagonally, or one square orthogonally forward (5 directions in total). Promotes to Promoted Silver (Narigin), moving identically to a Gold General.',
                    pieceName: 'ShogiSilver',
                },
                {
                    title: 'The Knight (Keima):',
                    desc: 'Jumps forward two squares and one square sideways (only the two forward-most knight moves). Can jump over pieces. Promotes to Promoted Knight (Narikei), moving like a Gold General.',
                    pieceName: 'ShogiKnight',
                },
                {
                    title: 'The Lance (Kyosha):',
                    desc: 'Moves any number of free squares straight forward along its file. Promotes to Promoted Lance (Narikyo), moving like a Gold General.',
                    pieceName: 'ShogiLance',
                },
                {
                    title: 'The Pawn (Fuhyo) & Tokin:',
                    desc: 'Moves and captures one square straight forward. Promotes to Tokin, moving identically to a Gold General.',
                    pieceName: 'ShogiPawn',
                },
                {
                    title: 'Dropping Pieces:',
                    desc: 'Instead of moving a piece on the board, you may drop a piece from your reserve onto any empty square in its unpromoted state. Restrictions: no dropping pieces with no legal moves left; Nifu rule (no dropping a pawn on a file containing another of your unpromoted pawns); Uchifuzume rule (a pawn cannot be dropped to deliver instant checkmate).',
                    iconType: 'check',
                },
                {
                    title: 'Promotion Zone:',
                    desc: 'The three farthest ranks comprise the promotion zone. When a piece enters, exits, or moves within this zone, it may promote. Promotion is mandatory if the piece would otherwise have no legal moves.',
                    iconType: 'check',
                },
            ],
            proTip: 'Pro Tip: Material is never permanently lost in Shogi. Castling your King in a secure structure (such as Mino or Yagura) is essential before coordinating an offensive with drops.',
        },
        history: {
            intro: 'Shogi is derived from Indian Chaturanga, transmitted to Japan via China during the Heian period (with archaeological pieces dating to 1058). By the 16th century, the rules of standard shogi were established. Although there is no clear historical record of exactly when piece drops were introduced, this unique mechanic gives the game immense tactical dynamism and an almost zero draw rate.',
            leftBoxTitle: 'The Edo Period & Meijin System',
            leftBoxDesc: 'During the Tokugawa Shogunate (Edo period), Shogi was officially sponsored by the state. The hereditary schools (the Ōhashi house, its branch family, and the Itō house) competed before the Shogun, establishing the prestigious Meijin title.',
            rightBoxTitle: 'Professional Shogi & Major Titles',
            rightBoxDesc: 'Today, the Japan Shogi Association (JSA) sanctions eight major professional title matches. Legendary masters such as Yoshiharu Habu (the first to hold seven titles simultaneously) and Sōta Fujii (holder of all eight titles) have elevated Shogi into a celebrated mind sport.',
        },
    },
};
