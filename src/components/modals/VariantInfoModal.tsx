import {type ReactNode, useState} from 'react';
import { X } from 'lucide-react';
import { getPieceImage } from '../../utils/pieceMapper';

// dictionary structure for the variant content
interface VariantInfo {
    name: string;
    rules: {
        intro: string;
        bullet1Title?: ReactNode;
        bullet1Desc?: ReactNode;
        bullet2Title?: ReactNode;
        bullet2Desc?: ReactNode;
        bullet3Title?: ReactNode;
        bullet3Desc?: ReactNode;
        bullet4Title?: ReactNode;
        bullet4Desc?: ReactNode;
        bullet5Title?: ReactNode;
        bullet5Desc?: ReactNode;
        bullet6Title?: ReactNode;
        bullet6Desc?: ReactNode;
        bullet7Title?: ReactNode;
        bullet7Desc?: ReactNode;
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
            intro: "The initial position is set on an 8x8 checkered board. White moves first. The objective is to outsmart the enemy and checkmate their king. A game can also end in a draw through stalemate, threefold repetition, the 50-move rule, or insufficient material.",

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
            intro: 'The initial position is as shown. White moves first. The objective in chaturanga is for one side (say \'white\') to checkmate the opponent\'s raja (king) or to reduce the other side (say \'black\') to just the raja (\'bare king\'), although if on the following move the black side can also reduce the white side to \'bare king\', the game is drawn.',
            bullet1Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Raja', color: 'white' } as any)!} alt="Raja" className="w-5 h-5 object-contain -mt-1" />
                    The Raja (King):
                </span>
            ),
            bullet1Desc: 'moves like a modern king, but there is no castling available to hide him.',
            bullet2Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Gaja', color: 'white' } as any)!} alt="Gaja" className="w-5 h-5 object-contain -mt-1" />
                    The Gaja (Elephant):
                </span>
            ),
            bullet2Desc: 'leaps exactly two squares diagonally, jumping over any pieces in between.',
            bullet3Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Queen', color: 'white' } as any)!} alt="Mantri" className="w-5 h-5 object-contain -mt-1" />
                    Mantri (minister)
                </span>
            ),
            bullet3Desc: 'moves one step diagonally in any direction',
            bullet4Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Rook', color: 'white' } as any)!} alt="Ratha" className="w-5 h-5 object-contain -mt-1" />
                    Ratha (chariot)
                </span>
            ),
            bullet4Desc: 'moves the same as a rook in chess: horizontally or vertically, through any number of unoccupied squares, with the only difference being the lack of castling.',
            bullet5Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Knight', color: 'white' } as any)!} alt="Ashva" className="w-5 h-5 object-contain -mt-1" />
                    Ashva (horse)
                </span>
            ),
            bullet5Desc: 'moves the same as a knight in chess.',
            bullet6Title: (
                <span className="inline-flex items-center gap-1.5">
                    <img src={getPieceImage({ name: 'Pawn', color: 'white' } as any)!} alt="Padati" className="w-5 h-5 object-contain -mt-1" />
                    Padati or Bhata (foot-soldier or infantry)
                </span>
            ),
            bullet6Desc: 'moves and captures the same as a pawn in chess, but without a double-step option on the first move.',
            bullet7Title: (
                <span className="inline-flex items-center gap-1.5">
                    <X className="w-5 h-5"/>
                    Ashtāpada X\'s
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
    }
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
    const bullets = [
        { title: data.rules.bullet1Title, desc: data.rules.bullet1Desc },
        { title: data.rules.bullet2Title, desc: data.rules.bullet2Desc },
        { title: data.rules.bullet3Title, desc: data.rules.bullet3Desc },
        { title: data.rules.bullet4Title, desc: data.rules.bullet4Desc },
        { title: data.rules.bullet5Title, desc: data.rules.bullet5Desc },
        { title: data.rules.bullet6Title, desc: data.rules.bullet6Desc },
        { title: data.rules.bullet7Title, desc: data.rules.bullet7Desc },
    ].filter(b => b.title && b.desc); // this removes the empty or undefined

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8">

            {/* main modal container */}
            <div className="bg-[#1e1c19] w-full max-w-5xl h-full max-h-[85vh] rounded-2xl shadow-2xl border border-atlas-hover flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* header */}
                <div className="flex justify-between items-center p-6 border-b border-atlas-hover bg-[#1a1815]">
                    <h2 className="text-3xl font-extrabold text-atlas-titleText capitalize tracking-tight">
                        {data.name}
                    </h2>

                    <div className="relative group">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-900/30 text-atlas-normalText hover:text-red-400 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-atlas-surface text-atlas-normalText text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                            Close
                        </span>
                    </div>
                </div>

                {/* tabs navigation */}
                <div className="flex border-b border-atlas-hover bg-[#1a1815]">
                    <button
                        onClick={() => setActiveTab('howToPlay')}
                        className={`flex-1 py-4 font-bold text-lg transition-colors ${
                            activeTab === 'howToPlay'
                                ? 'text-atlas-titleText border-b-2 border-emerald-500 bg-[#22201d]'
                                : 'text-atlas-normalText hover:text-atlas-titleText hover:bg-atlas-hover'
                        }`}
                    >
                        How to play
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 font-bold text-lg transition-colors ${
                            activeTab === 'history'
                                ? 'text-atlas-titleText border-b-2 border-amber-500 bg-[#22201d]'
                                : 'text-atlas-normalText hover:text-atlas-titleText hover:bg-atlas-hover'
                        }`}
                    >
                        Variant history
                    </button>
                </div>

                {/* content area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-atlas-titleText">

                    {activeTab === 'howToPlay' ? (

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-emerald-400">Rules & mechanics</h3>
                            <p className="text-lg leading-relaxed opacity-90">
                                {data.rules.intro}
                            </p>

                            <ul className="space-y-4 mt-6 opacity-80">
                                {/* mapeamos el array dinámico para pintar solo los bullets que existan */}
                                {bullets.map((bullet, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-emerald-500 font-bold text-xl">•</span>
                                        <div>
                                            <strong className="text-atlas-titleText">{bullet.title}</strong> {bullet.desc}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="p-5 bg-emerald-900/10 border border-emerald-500/20 rounded-xl mt-8">
                                <p className="text-emerald-300 font-medium tracking-wide">
                                    {data.rules.proTip}
                                </p>
                            </div>
                        </div>

                    ) : (

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-amber-500">Historical origins</h3>
                            <p className="text-lg leading-relaxed opacity-90">
                                {data.history.intro}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="p-6 bg-atlas-surface rounded-xl border border-atlas-hover">
                                    <h4 className="text-xl font-bold text-rose-400 mb-3">{data.history.leftBoxTitle}</h4>
                                    <p className="opacity-80 leading-relaxed">
                                        {data.history.leftBoxDesc}
                                    </p>
                                </div>
                                <div className="p-6 bg-atlas-surface rounded-xl border border-atlas-hover">
                                    <h4 className="text-xl font-bold text-sky-400 mb-3">{data.history.rightBoxTitle}</h4>
                                    <p className="opacity-80 leading-relaxed">
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