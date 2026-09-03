import { type ReactNode, useState } from 'react';
import { X, BookOpen, History, Sparkles, Scroll, Compass, Dices } from 'lucide-react';
import { getPieceImage } from '../../utils/pieceMapper';

// dictionary structure for the variant content
interface VariantInfo {
    name: string;
    rules: {
        intro: string;
        [key: `bullet${number}Title`]: ReactNode | undefined;
        [key: `bullet${number}Desc`]: ReactNode | undefined;
        proTip: ReactNode;
    };
    history: {
        intro: string;
        leftBoxTitle: string;
        leftBoxDesc: string;
        rightBoxTitle: string;
        rightBoxDesc: string;
    };
}

// database for the modal texts
const variantDictionary: Record<string, VariantInfo> = {
    classic: {
        name: 'Classic Chess',
        rules: {
            intro: "The game is set on an 8x8 checkered board. White moves first. The objective is to outsmart the enemy and checkmate their king. A game can also end in a draw through stalemate, threefold repetition, the 50-move rule, or insufficient material.",

            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'King', color: 'white' } as any)!} alt="King" className="w-5 h-5 object-contain -mt-1" />
            The King:
        </span>
            ),
            bullet1Desc: "Moves one square in any direction. It can also perform a special move called 'castling' with a rook to improve its safety and connect the rooks.",

            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'Queen', color: 'white' } as any)!} alt="Queen" className="w-5 h-5 object-contain -mt-1" />
            The Queen:
        </span>
            ),
            bullet2Desc: "The most powerful piece. Moves horizontally, vertically, or diagonally through any number of unoccupied squares.",

            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'Rook', color: 'white' } as any)!} alt="Rook" className="w-5 h-5 object-contain -mt-1" />
            The Rook:
        </span>
            ),
            bullet3Desc: "Moves horizontally or vertically through any number of unoccupied squares. It is also involved in the king's castling move.",

            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'Bishop', color: 'white' } as any)!} alt="Bishop" className="w-5 h-5 object-contain -mt-1" />
            The Bishop:
        </span>
            ),
            bullet4Desc: "Moves diagonally through any number of unoccupied squares. A bishop always remains on its starting color (light or dark).",

            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'Knight', color: 'white' } as any)!} alt="Knight" className="w-5 h-5 object-contain -mt-1" />
            The Knight:
        </span>
            ),
            bullet5Desc: "Moves in an 'L' shape (two squares in one direction and one square perpendicularly). It is the only piece capable of jumping over other pieces.",

            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
            <img src={getPieceImage({ name: 'Pawn', color: 'white' } as any)!} alt="Pawn" className="w-5 h-5 object-contain -mt-1" />
            The Pawn:
        </span>
            ),
            bullet6Desc: "Moves forward one square but captures diagonally. It can move two squares on its first move, capture 'en passant', and must be promoted to any other piece upon reaching the opposite end of the board.",

            bullet7Title: (
                <span className="inline-flex items-center gap-1.5">
            <X className="w-5 h-5"/>
            Check & Checkmate:
        </span>
            ),
            bullet7Desc: "When a king is attacked, it is in 'check' and must escape. If there is no legal move to escape the threat, it is 'checkmate' and the game is immediately over.",

            proTip: "Pro tip: Always try to control the center of the board early in the game. Developing your knights and bishops towards the center will maximize your attacking potential."
        },
        history: {
            intro: 'Chess originated in India as Chaturanga before the 7th century, spreading to Persia and the Arab world before taking its modern form in Europe.',
            leftBoxTitle: 'The European Evolution',
            leftBoxDesc: 'As chess reached Europe around the 9th century, the pieces were adapted to reflect medieval society, transforming into the modern knights, bishops, and royalty we know today.',
            rightBoxTitle: 'The Mad Queen',
            rightBoxDesc: 'In late 15th-century Spain, the game drastically sped up when the queen and bishop were granted their modern, long-range sweeping powers, turning a slow game into a dynamic battle.'
        }
    },
    chaturanga: {
        name: 'Chaturanga',
        rules: {
            intro: 'The game is set on an 8x8 uncheckered board with special marks. White moves first. The objective in chaturanga is for one side (say \'white\') to checkmate the opponent\'s raja (king) or to reduce the other side (say \'black\') to just the raja (\'bare king\'), although if on the following move the black side can also reduce the white side to \'bare king\', the game is drawn.',
            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Raja', color: 'white' } as any)!} alt="Raja" className="w-5 h-5 object-contain -mt-1" />
                    Raja (King):
                </span>
            ),
            bullet1Desc: 'moves like a modern king, but there is no castling available to hide him.',
            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Queen', color: 'white' } as any)!} alt="Mantri" className="w-5 h-5 object-contain -mt-1" />
                    Mantri (minister):
                </span>
            ),
            bullet2Desc: 'moves one step diagonally in any direction',
            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Rook', color: 'white' } as any)!} alt="Ratha" className="w-5 h-5 object-contain -mt-1" />
                    Ratha (chariot):
                </span>
            ),
            bullet3Desc: 'moves the same as a rook in chess: horizontally or vertically, through any number of unoccupied squares, with the only difference being the lack of castling.',
            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Gaja', color: 'white' } as any)!} alt="Gaja" className="w-5 h-5 object-contain -mt-1" />
                    Gaja (Elephant):
                </span>
            ),
            bullet4Desc: 'leaps exactly two squares diagonally, jumping over any pieces in between.',
            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Knight', color: 'white' } as any)!} alt="Ashva" className="w-5 h-5 object-contain -mt-1" />
                    Ashva (horse):
                </span>
            ),
            bullet5Desc: 'moves the same as a knight in chess.',
            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Pawn', color: 'white' } as any)!} alt="Padati" className="w-5 h-5 object-contain -mt-1" />
                    Padati or Bhata (foot-soldier or infantry):
                </span>
            ),
            bullet6Desc: 'moves and captures the same as a pawn in chess, but without a double-step option on the first move.',
            bullet7Title: (
                <span className="inline-flex items-center gap-1.5">
                    <X className="w-5 h-5"/>
                    Ashtāpada X\'s:
                </span>
            ),
            bullet7Desc: 'The board has special markings, the meaning of which are unknown today. These marks were not related to chaturanga, but were drawn on the board by tradition. These special markings coincide with squares unreachable by any of the four gajas that start on the board due to movement rules.',

            proTip: 'Pro tip: the mantri (counselor) is very weak, moving only one square diagonally. keep it close for defense.'
        },
        history: {
            intro: 'Chaturanga is an ancient strategy board game widely recognized as the earliest direct ancestor of modern chess. It serves as the foundational root from which an entire family of strategic board games branched out across the globe, acting as the historical bridge between ancient military simulations and modern chess.',
            leftBoxTitle: 'Origins and the "Four Divisions"',
            leftBoxDesc: 'The game originated in Northern India during the Gupta Empire, around the 6th century CE. The Sanskrit name "Chaturanga" translates to "four divisions of the military," reflecting ancient Indian army formations: infantry, cavalry, elephantry, and chariotry. These military branches were represented by distinct pieces on the board that eventually evolved into the modern pawns, knights, bishops, and rooks. The game was traditionally played on an 8x8 uncheckered board known as the ashtāpada.',
            rightBoxTitle: 'Evolution and Global Spread',
            rightBoxDesc: 'Thanks to merchants, diplomats, and pilgrims traveling along the Silk Road, Chaturanga spread far beyond India and adapted to various cultures. To the west, it entered Sassanid Persia and became Shatranj; this version was later carried through the Islamic world into Europe, where it evolved into modern classic chess by the 15th century. To the east, the game traveled into Asia, morphing into distinct and highly popular regional variants such as Xiangqi (Chinese chess), Shogi (Japanese chess), and Makruk (Thai chess).'
        }
    },
    shatranj: {
        name: 'Shatranj',
        rules: {
            intro: 'The game is set on an 8x8 uncheckered board. White moves first. The objective in Shatranj is to checkmate the opponent\'s Shah (king) or to reduce their army to just the Shah ("bare king"). Unlike modern chess, stalemating your opponent is also a victory.',
            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Shah', color: 'white' } as any)!} alt="Shah" className="w-5 h-5 object-contain -mt-1" />
                    Shah (King):
                </span>
            ),
            bullet1Desc: 'moves like a modern king, but there is no castling available to hide him.',
            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Ferz', color: 'white' } as any)!} alt="Ferz" className="w-5 h-5 object-contain -mt-1" />
                    Ferz or Wazir (Counselor):
                </span>
            ),
            bullet2Desc: 'moves exactly one step diagonally in any direction.',
            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Rukh', color: 'white' } as any)!} alt="Rukh" className="w-5 h-5 object-contain -mt-1" />
                    Rukh (Chariot):
                </span>
            ),
            bullet3Desc: 'moves the same as a rook in chess: horizontally or vertically, through any number of unoccupied squares.',
            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Pil', color: 'white' } as any)!} alt="Pïl" className="w-5 h-5 object-contain -mt-1" />
                    Pïl or Alfil (Elephant):
                </span>
            ),
            bullet4Desc: 'leaps exactly two squares diagonally, jumping over any pieces in between.',
            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Asb', color: 'white' } as any)!} alt="Asb" className="w-5 h-5 object-contain -mt-1" />
                    Asb or Faras (Horse):
                </span>
            ),
            bullet5Desc: 'moves the same as a knight in chess.',
            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Sarbaz', color: 'white' } as any)!} alt="Sarbaz" className="w-5 h-5 object-contain -mt-1" />
                    Sarbaz / Piyadeh or Baydaq (Pawn):
                </span>
            ),
            bullet6Desc: 'moves and captures the same as a modern pawn, but without a double-step option on the first move. Upon reaching the last rank, it automatically promotes to a Ferz.',
            proTip: 'Pro tip: Because the Ferz and Pïl are short-range pieces, Shatranj is a slower, highly strategic game. Focus on pawn structures and opening files for your Rukh (rooks), which are by far the most powerful pieces on the board.'
        },
        history: {
            intro: 'Shatranj is the Persian and Arabic evolution of the Indian game Chaturanga. It was the standard form of chess played in the Middle East, North Africa, and Europe for nearly a millennium before the modern rules emerged.',
            leftBoxTitle: 'The Islamic Golden Age',
            leftBoxDesc: 'After Chaturanga arrived in Sasanian Persia, it was renamed Chatrang. Following the Islamic conquest of Persia in the 7th century, the game was adapted into Shatranj. Arab masters formalized the rules, recorded the first algebraic notations, and wrote extensively on chess strategy, creating complex puzzles known as "mansubat".',
            rightBoxTitle: 'The Journey to Europe',
            rightBoxDesc: 'Shatranj was introduced to Europe via the Islamic conquest of the Iberian Peninsula (Al-Andalus) and through Byzantine and Italian trade routes. It remained largely unchanged until the late 15th century in Spain, when the weak Ferz and Pïl were replaced by the modern Queen and Bishop, radically speeding up the game.'
        }
    },
    tamerlane: {
        name: 'Tamerlane Chess',
        rules: {
            intro: 'Played on a massive 11x10 uncheckered board with two extra protruding squares called citadels (112 squares total). White moves first. The objective is to checkmate the opponent\'s Shah. If the Shah infiltrates the enemy citadel or all royals are exhausted, special victory and draw conditions apply.',
            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Shah', color: 'white' } as any)!} alt="Shah" className="w-5 h-5 object-contain -mt-1" />
                    Shah (King):
                </span>
            ),
            bullet1Desc: 'moves like a modern king. Once per game when under check or threat, it can swap places with any allied piece to evade danger. If the Shah is captured while you have a Prince or Adventitious King, your heir is crowned as the new Shah.',
            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Shah', color: 'white' } as any)!} alt="Shah" className="w-5 h-5 object-contain -mt-1" />
                    Shahzada (Prince):
                </span>
            ),
            bullet2Desc: 'created when the Pawn of Kings is promoted. Moves like a king and is marked with a "P" badge. It serves as the primary royal heir. If the reigning Shah is eliminated, the Prince ascends to the throne as the new Shah.',
            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Shah', color: 'white' } as any)!} alt="Shah" className="w-5 h-5 object-contain -mt-1" />
                    Adventitious Shah (Adventitious King):
                </span>
            ),
            bullet3Desc: 'created when the Pawn of Pawns completes its 3-stage journey. Marked with an "A" badge and moves like a king. It can enter its own allied citadel to become permanently immune and block enemy draws, or ascend to the throne if the Shah falls.',
            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Ferz', color: 'white' } as any)!} alt="Ferz" className="w-5 h-5 object-contain -mt-1" />
                    Ferz (Counselor):
                </span>
            ),
            bullet4Desc: 'moves exactly one step diagonally in any direction.',
            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Wazir', color: 'white' } as any)!} alt="Wazir" className="w-5 h-5 object-contain -mt-1 rotate-180" />
                    Wazir (Vizier or Governor):
                </span>
            ),
            bullet5Desc: 'moves exactly one step orthogonally in any direction.',
            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Zurafa', color: 'white' } as any)!} alt="Zurafa" className="w-5 h-5 object-contain -mt-1" />
                    Zurafa (Giraffe):
                </span>
            ),
            bullet6Desc: 'moves one square diagonally, and then slides horizontally or vertically for a minimum of three squares. It cannot jump over intervening pieces.',
            bullet7Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Talia', color: 'white' } as any)!} alt="Talia" className="w-5 h-5 object-contain -mt-1" />
                    Talia (Picket / Scout):
                </span>
            ),
            bullet7Desc: 'slides diagonally like a bishop, but must move a minimum of two squares. It cannot jump over a piece on the adjacent diagonal square.',
            bullet8Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Asb', color: 'white' } as any)!} alt="Faras" className="w-5 h-5 object-contain -mt-1" />
                    Faras (Horse):
                </span>
            ),
            bullet8Desc: 'moves the same as a knight in chess (leaping in an "L" shape).',
            bullet9Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Rukh', color: 'white' } as any)!} alt="Rukh" className="w-5 h-5 object-contain -mt-1" />
                    Rukh (Chariot):
                </span>
            ),
            bullet9Desc: 'moves the same as a rook in chess: horizontally or vertically through any number of unoccupied squares.',
            bullet10Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Pil', color: 'white' } as any)!} alt="Pil" className="w-5 h-5 object-contain -mt-1" />
                    Pil (Elephant):
                </span>
            ),
            bullet10Desc: 'leaps exactly two squares diagonally, jumping over any piece in between.',
            bullet11Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Jamal', color: 'white' } as any)!} alt="Jamal" className="w-5 h-5 object-contain -mt-1" />
                    Jamal (Camel):
                </span>
            ),
            bullet11Desc: 'leaps in an elongated "L" shape (one square diagonally and two straight, or 3x1), jumping over any piece in between.',
            bullet12Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Dabbaba', color: 'white' } as any)!} alt="Dabbaba" className="w-5 h-5 object-contain -mt-1" />
                    Dabbaba (War Engine):
                </span>
            ),
            bullet12Desc: 'leaps exactly two squares orthogonally, jumping over any piece in between.',
            bullet13Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Sarbaz', color: 'white' } as any)!} alt="Sarbaz" className="w-5 h-5 object-contain -mt-1" />
                    The 11 Pawns & Promotions:
                </span>
            ),
            bullet13Desc: 'move forward one square and capture diagonally without initial double moves. Every piece has its own dedicated pawn (pawn of rooks, pawn of horses, pawn of camels, etc.). Upon reaching the last rank, each pawn automatically promotes to its parent piece.',
            bullet14Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Shah', color: 'white' } as any)!} alt="Shah" className="w-5 h-5 object-contain -mt-1" />
                    Pawn of Pawns Lifecycle:
                </span>
            ),
            bullet14Desc: 'has a unique 3-stage journey: (1) Upon reaching the last rank for the first time, it rests immune to capture. When an opportunity develops to fork two enemy pieces or attack a trapped piece with no legal moves, it can relocate directly to that attacking square, sacrificing whatever piece occupied it. (2) On its second promotion, it teleports to the starting square of the Pawn of King. (3) On its third promotion, it transforms into an Adventitious King.',
            bullet15Title: (
                <span className="inline-flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-amber-700/40 ring-2 ring-inset ring-amber-500 rounded-sm -mt-0.5" />
                    The Citadels & Royal Infiltration:
                </span>
            ),
            bullet15Desc: 'two extra squares extending from the board. Only the highest-ranking royal on the board (Shah > Prince > Adventitious King) can enter the opponent\'s citadel. If the Shah enters, you may trade places with a Prince or Adventitious King (unless the Adventitious King is sheltering in your own citadel) to continue fighting, or declare an immediate draw.',
            proTip: 'Pro tip: Protect your Pawn of Pawns and coordinate your exotic jumpers (Jamal and Dabbaba) with long-range sliders. If losing, aim to infiltrate the enemy citadel with your Shah to secure a draw or swap places with your Prince!'
        },
        history: {
            intro: 'Tamerlane chess is a strategic behemoth developed in the 14th century during the reign of Timur (Tamerlane), the Turco-Mongol conqueror. It is the most famous and complex variant of "Great Chess" (Shatranj Kamil).',
            leftBoxTitle: 'The Game of a Conqueror',
            leftBoxDesc: 'Timur himself loved to play chess, and he preferred the large board variants over the smaller 8×8 shatranj. As such, the invention of this game has also been attributed to Timur himself. He is known to have invited the best shatranj players in the land to his court to play him at the game, including one Ali ash-Shatranji of Tabriz.',
            rightBoxTitle: 'Or maybe not...',
            rightBoxDesc: 'Another legend regarding this type of chess is found in a Persian manuscript which may have been by ash-Shatranji himself. The legend states that this game was given to Alexander in India by Hermes.'
        }
    },
    grant_acedrex: {
        name: 'Grant Acedrex',
        rules: {
            intro: 'Grant Acedrex (Great Chess) is an epic 13th-century Spanish chess variant played on a 12x12 board (144 squares). Documented by King Alfonso X of Castile in the Libro de los Juegos (1283), it features majestic mythical and exotic beasts, advanced pawn starting ranks, and unique bent-rider moves.',
            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'King', color: 'white' } as any)!} alt="King" className="w-5 h-5 object-contain -mt-1" />
                    The King:
                </span>
            ),
            bullet1Desc: 'moves one square in any direction. On his first move, he can leap 2 squares in any direction, jumping over intermediate pieces even if the intervening square is occupied.',
            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Aanca', color: 'white' } as any)!} alt="Aanca" className="w-5 h-5 object-contain -mt-1" />
                    The Aanca (Giant bird):
                </span>
            ),
            bullet2Desc: 'a legendary mythical bird and the most fearsome piece on the board. It steps one square diagonally and, if unobstructed, can continue sliding orthogonally as a Rook for any number of squares away from that diagonal step.',
            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Unicorn', color: 'white' } as any)!} alt="Unicorn" className="w-5 h-5 object-contain -mt-1" />
                    The Unicorn (Rhinoceros):
                </span>
            ),
            bullet3Desc: 'leaps as a Knight on its first step; if that landing square is vacant, it can continue sliding diagonally as a Bishop in the outward direction of the leap.',
            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Rook', color: 'white' } as any)!} alt="Rook" className="w-5 h-5 object-contain -mt-1" />
                    The Rook:
                </span>
            ),
            bullet4Desc: 'slides any number of vacant squares orthogonally (horizontal or vertical), identical to modern chess.',
            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Crocodile', color: 'white' } as any)!} alt="Crocodile" className="w-5 h-5 object-contain -mt-1" />
                    The Crocodile:
                </span>
            ),
            bullet5Desc: 'slides any number of vacant squares diagonally, moving exactly like a modern Bishop.',
            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Lion', color: 'white' } as any)!} alt="Lion" className="w-5 h-5 object-contain -mt-1" />
                    The Lion:
                </span>
            ),
            bullet6Desc: 'moves 3 steps orthogonally or jumps to the opposed square of a 2x4 rectangle (2 orthogonal + 1 diagonal step), leaping over any occupied squares.',
            bullet7Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Giraffe', color: 'white' } as any)!} alt="Giraffe" className="w-5 h-5 object-contain -mt-1" />
                    The Giraffe:
                </span>
            ),
            bullet7Desc: 'jumps to the opposed square of a 3x4 rectangle (1 orthogonal + 2 diagonal steps), leaping over any occupied squares in between.',
            bullet8Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Grantpawn', color: 'white' } as any)!} alt="Grantpawn" className="w-5 h-5 object-contain -mt-1" />
                    The Pawns & Initial Double-Step:
                </span>
            ),
            bullet8Desc: 'White pawns start on the 4th rank and Black pawns on the 9th rank. Pawns move 1 square forward and capture 1 diagonally. An initial 2-square move is allowed for all pawns, but only until the first pawn capture of the game occurs.',
            bullet9Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Aanca', color: 'white' } as any)!} alt="Aanca" className="w-5 h-5 object-contain -mt-1" />
                    Promotion & Victory Conditions:
                </span>
            ),
            bullet9Desc: 'Pawns promote on the 12th rank to their file\'s origin piece (King/Aanca files promote to Aanca). Victory is achieved by Checkmate, Stalemate (stalemated side loses), or Bare King (reducing the opponent to just their King).',
            bullet10Title: (
                <span className="inline-flex items-center gap-1.5">
                    <Dices className="w-5 h-5 text-amber-400 -mt-0.5" />
                    The 8-Sided Die Variant (Alfonso X Rule):
                </span>
            ),
            bullet10Desc: 'Because Great Chess is very extensive and slow to play, King Alfonso X ordered custom 8-sided dice (d8) to be crafted to accelerate games, where the pips reflect the hierarchy of pieces: 8 = King, 7 = Aanca, 6 = Unicorn (Rhinoceros), 5 = Rook, 4 = Lion, 3 = Crocodile, 2 = Giraffe, and 1 = Pawn. In this traditional mode, players roll the die and must move a piece corresponding to the rolled number.',
            proTip: 'Pro tip: Leverage your King\'s 2-square opening leap for rapid activation, and note that the initial pawn double-step disappears as soon as any pawn capture takes place!'
        },
        history: {
            intro: 'Grant Acedrex was commissioned in 1283 by King Alfonso X "The Wise" (El Sabio) of Castile and León as part of the famous Libro de los Juegos (Book of Games), preserved at El Escorial Monastery.',
            leftBoxTitle: 'The Wisdom of Alfonso X',
            leftBoxDesc: 'Alfonso was likely influenced by his contact with scholars in the Arab world. Unlike many contemporary texts on the topic, he does not engage the games in the text with moralistic arguments; instead, he portrays them in an astrological context. He conceives of gaming as a dichotomy between the intellect and chance. The Libro de los Juegos is considered the most comprehensive and beautifully illustrated medieval gaming manuscript in European history.',
            rightBoxTitle: 'The Grand Evolution',
            rightBoxDesc: 'Grant Acedrex expanded standard shatranj onto a massive 12x12 board. Pieces like the Crocodile introduced modern diagonal bishop moves two centuries before queen and bishop changes took root in Western Europe.'
        }
    },
};

// fallback data in case a variantId is passed that doesn't exist in the dictionary yet
const fallbackVariant: VariantInfo = {
    name: 'Unknown Variant',
    rules: {
        intro: 'rules for this variant have not been documented yet.',
        bullet1Title: 'work in progress:',
        bullet1Desc: 'we are still gathering data.',
        bullet2Title: 'work in progress:',
        bullet2Desc: 'we are still gathering data.',
        bullet3Title: 'work in progress:',
        bullet3Desc: 'we are still gathering data.',
        proTip: 'pro tip: play carefully.'
    },
    history: {
        intro: 'history for this variant is lost to time.',
        leftBoxTitle: 'Unknown Origins',
        leftBoxDesc: 'documentation pending.',
        rightBoxTitle: 'Future Updates',
        rightBoxDesc: 'documentation pending.'
    }
};

interface VariantInfoModalProps {
    variantId: string;
    onClose: () => void;
}

export const VariantInfoModal = ({ variantId, onClose }: VariantInfoModalProps) => {
    const [activeTab, setActiveTab] = useState<'howToPlay' | 'history'>('howToPlay');

    // grab the data from the dictionary, or use the fallback if it doesn't exist
    const data = variantDictionary[variantId] || fallbackVariant;

// packed and filtered so only the ones with text are shown
    const bullets: { title: ReactNode; desc: ReactNode }[] = [];
    for (let i = 1; i <= 30; i++) {
        const titleKey = `bullet${i}Title` as keyof typeof data.rules;
        const descKey = `bullet${i}Desc` as keyof typeof data.rules;
        if (data.rules[titleKey] && data.rules[descKey]) {
            bullets.push({
                title: data.rules[titleKey] as ReactNode,
                desc: data.rules[descKey] as ReactNode,
            });
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 md:p-8">

            {/* main modal container */}
            <div className="bg-slate-900/95 w-full max-w-5xl h-full max-h-[88vh] rounded-3xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 backdrop-blur-2xl">

                {/* header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-slate-950/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <Compass className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white capitalize tracking-tight">
                                {data.name}
                            </h2>
                            <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest mt-0.5">
                                Codex & Rules Reference
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/10 hover:border-red-500/30 shadow-md hover:scale-105 active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                            Close
                        </span>
                    </div>
                </div>

                {/* tabs navigation */}
                <div className="flex border-b border-white/10 bg-slate-950/40 px-6 pt-2 gap-2">
                    <button
                        onClick={() => setActiveTab('howToPlay')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-bold text-base rounded-t-2xl transition-all ${
                            activeTab === 'howToPlay'
                                ? 'text-amber-400 bg-slate-900 border-t-2 border-x border-amber-500/40 -mb-[1px] shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>How to Play</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-bold text-base rounded-t-2xl transition-all ${
                            activeTab === 'history'
                                ? 'text-amber-400 bg-slate-900 border-t-2 border-x border-amber-500/40 -mb-[1px] shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        <span>Historical Origins</span>
                    </button>
                </div>

                {/* content area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-slate-200">

                    {activeTab === 'howToPlay' ? (

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
                                <h3 className="text-xl font-black text-amber-400 mb-2 flex items-center gap-2">
                                    <Scroll className="w-5 h-5 text-amber-400" />
                                    Objective & Board Rules
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed text-slate-300">
                                    {data.rules.intro}
                                </p>
                            </div>

                            <div className="space-y-3 mt-6">
                                <h4 className="text-xs uppercase font-extrabold tracking-widest text-amber-400/80 mb-3">
                                    Pieces & Special Moves
                                </h4>
                                {bullets.map((bullet, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-atlas-surface/60 hover:bg-atlas-hover/60 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-200 flex items-start gap-4 shadow-sm"
                                    >
                                        <div className="p-1 bg-amber-500/10 rounded-lg text-amber-400 font-bold text-xs mt-0.5 flex-shrink-0">
                                            #{index + 1}
                                        </div>
                                        <div className="flex-1 text-sm md:text-base leading-relaxed">
                                            <strong className="text-white font-extrabold block sm:inline mr-2">
                                                {bullet.title}
                                            </strong>
                                            <span className="text-slate-300">
                                                {bullet.desc}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-400 rounded-2xl shadow-lg mt-8 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider mb-1">
                                    <Sparkles className="w-4 h-4" />
                                    Strategic Insight
                                </div>
                                <p className="text-amber-100/90 font-medium text-sm md:text-base leading-relaxed">
                                    {data.rules.proTip}
                                </p>
                            </div>
                        </div>

                    ) : (

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
                                <h3 className="text-xl font-black text-amber-400 mb-2 flex items-center gap-2">
                                    <History className="w-5 h-5 text-amber-400" />
                                    Origins & Heritage
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed text-slate-300">
                                    {data.history.intro}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="p-6 bg-atlas-surface/80 rounded-2xl border border-rose-500/20 shadow-lg backdrop-blur-md hover:border-rose-500/40 transition-colors">
                                    <h4 className="text-xl font-black text-rose-400 mb-3 tracking-tight">
                                        {data.history.leftBoxTitle}
                                    </h4>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        {data.history.leftBoxDesc}
                                    </p>
                                </div>
                                <div className="p-6 bg-atlas-surface/80 rounded-2xl border border-sky-500/20 shadow-lg backdrop-blur-md hover:border-sky-500/40 transition-colors">
                                    <h4 className="text-xl font-black text-sky-400 mb-3 tracking-tight">
                                        {data.history.rightBoxTitle}
                                    </h4>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        {data.history.rightBoxDesc}
                                    </p>
                                </div>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};