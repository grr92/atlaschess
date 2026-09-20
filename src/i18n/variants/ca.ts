import type { VariantMetaI18n, VariantCodexI18n } from '../types';

export const variantMeta_ca: Record<string, VariantMetaI18n> = {
    classic: {
        title: 'Escacs Clàssics',
        origin: 'Segle XV • Europa',
        tag: 'Estàndard',
        desc: 'Les regles modernes reconegudes mundialment amb enroc, captura al pas i dama de llarg abast.',
    },
    chaturanga: {
        title: 'Xaturanga',
        origin: 'Segle VI • Índia',
        tag: 'L\'Origen',
        desc: 'L\'ancestre més antic dels escacs jugat al tauler sense escaquejar Ashtāpada (8x8).',
    },
    shatranj: {
        title: 'Shatranj',
        origin: 'Segle VII • Pèrsia',
        tag: 'Edat d\'Or',
        desc: 'La joia estratègica de la Ruta de la Seda. El Ferz mou 1 diagonal, l\'Elefant en salta 2 i el rei solitari perd.',
    },
    courier: {
        title: 'Escacs del Missatger',
        origin: 'Segle XII • Alemanya',
        tag: 'Tauler 12x8',
        desc: 'L\'obra mestra medieval alemanya amb Missatgers, el Savi, el Schleich i un tauler de 12x8.',
    },
    grant_acedrex: {
        title: 'Gran Acedrex',
        origin: 'Segle XIII • Castella (Alfons X)',
        tag: 'Tauler 12x12',
        desc: 'El gran joc d\'escacs reial d\'Alfons X el Savi amb Aanques, Unicorns, Lleons, Girafes i Cocodrils.',
    },
    four_seasons: {
        title: 'Escacs de les Quatre Estacions',
        origin: 'Segle XIII • Castella (Alfons X)',
        tag: '4 Jugadors',
        desc: 'L\'obra mestra medieval per a 4 jugadors del rei Alfons X el Savi, que representa les estacions, humors corporals i elements en un tauler de 8x8.',
    },
    tamerlane: {
        title: 'Escacs de Tamerlà',
        origin: 'Segle XIV • Imperi Timúrida',
        tag: '112 Caselles',
        desc: 'Els escacs monumentals de Tamerlà amb Girafes, Camells, Màquines de Guerra, 11 peons únics i Ciutadelles reials.',
    },
    chaturaji: {
        title: 'Chaturaji',
        origin: 'Segles X–XI • Índia',
        tag: '4 Jugadors',
        desc: 'El Chaturanga per a 4 jugadors (conegut popularment com a Chaturaji) en un tauler Ashtāpada de 8x8 amb Triomf de la Barca, trons, promocions i apostes.',
    },
    xiangqi: {
        title: 'Xiangqi',
        origin: 'Dinastia Song del Sud • Xina',
        tag: 'Tauler 9x10',
        desc: 'Joc de tauler d\'estratègia per a dos jugadors que representa una batalla entre dos exèrcits, jugat sobre les interseccions d\'una quadrícula de 9x10 amb Canons, el Riu i el Palau.',
    },
    janggi: {
        title: 'Janggi',
        origin: 'Península de Corea',
        tag: 'Tauler 9x10',
        desc: 'Joc d\'estratègia coreà derivat del xiangqi, jugat a les 90 interseccions d\'un tauler de 9×10 sense riu. Destaca per les formacions inicials configurables, canons saltadors, elefants de llarg abast i diagonals de palau.',
    },
    makruk: {
        title: 'Makruk',
        origin: 'Tailàndia',
        tag: 'Tauler 8x8',
        desc: 'Escacs tradicionals tailandesos descendents del chaturanga, amb Senyors, Llavors, Nobles i regles de comptatge úniques per a reis a la fuga.',
    },
    ouk_chaktrang: {
        title: 'Ouk Chaktrang',
        origin: 'Cambodja',
        tag: 'Tauler 8x8',
        desc: 'Escacs tradicionals cambodjans emparentats amb el makruk, caracteritzats per opcions d\'obertura dinàmiques per al senyor i la llavor abans que es produeixi la primera captura.',
    },
    sittuyin: {
        title: 'Sittuyin',
        origin: 'Myanmar (Birmània)',
        tag: 'Tauler 8x8',
        desc: 'Escacs tradicionals birmans amb un tauler marcat per les diagonals Sit-ke-min, peons esglaonats i posicions inicials de les peces variables i personalitzables.',
    },
};

export const variantCodex_ca: Record<string, VariantCodexI18n> = {
    classic: {
        name: 'Escacs Clàssics',
        rules: {
            intro: 'La partida es juga en un tauler escaquejat de 8x8 caselles. Les blanques mouen primer. L\'objectiu és fer escac i mat al rei rival. La partida també pot acabar en taules per ofegat, triple repetició, regla de les 50 jugades o material insuficient.',
            bullets: [
                {
                    title: 'El Rei:',
                    desc: 'Mou una casella en qualsevol direcció. Pot realitzar el moviment especial d\'"enroc" juntament amb una torre per protegir-se i connectar les torres.',
                    pieceName: 'King',
                },
                {
                    title: 'La Dama (Reina):',
                    desc: 'La peça més poderosa del tauler. Mou en horitzontal, vertical o diagonal a través de qualsevol nombre de caselles lliures.',
                    pieceName: 'Queen',
                },
                {
                    title: 'La Torre:',
                    desc: 'Mou en horitzontal o vertical tantes caselles lliures com vulgui. També intervé en l\'enroc del rei.',
                    pieceName: 'Rook',
                },
                {
                    title: 'L\'Alfil:',
                    desc: 'Mou en diagonal a través de qualsevol nombre de caselles desocupades. Un alfil sempre roman a les caselles del seu color d\'inici (clares o fosques).',
                    pieceName: 'Bishop',
                },
                {
                    title: 'El Cavall:',
                    desc: 'Mou en forma de "L" (dues caselles en una direcció i una en perpendicular). És l\'única peça capaç de saltar per sobre d\'altres peces.',
                    pieceName: 'Knight',
                },
                {
                    title: 'El Peó:',
                    desc: 'Avança una casella cap endavant però captura en diagonal. En el seu primer moviment pot avançar dues caselles, capturar "al pas" i es corona en arribar a l\'altre extrem del tauler.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Escac i Escac i Mat:',
                    desc: 'Quan un rei és atacat, està en "escac" i ha d\'escapar de l\'amenaça. Si no hi ha cap moviment legal per salvar el rei, és "escac i mat" i la partida acaba a l\'instant.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell estratègic: Intenta controlar el centre del tauler des de l\'obertura. Desenvolupar els teus cavalls i alfils cap al centre maximitzarà la teva capacitat d\'atac.',
        },
        history: {
            intro: 'Els escacs es van originar a l\'Índia com a Xaturanga abans del segle VII, expandint-se cap a Pèrsia i el món àrab abans d\'adoptar la forma moderna a Europa.',
            leftBoxTitle: 'L\'Evolució Europea',
            leftBoxDesc: 'En arribar a Europa cap al segle IX, les peces es van adaptar a la societat medieval, transformant-se en els cavalls, alfils i la reialesa que coneixem avui dia.',
            rightBoxTitle: 'La Dama Poderosa',
            rightBoxDesc: 'A finals del segle XV a la Península Ibèrica, el joc es va accelerar enormement quan la reina i l\'alfil van adquirir el seu abast modern de llarg recorregut.',
        },
    },
    chaturanga: {
        name: 'Xaturanga',
        rules: {
            intro: 'Es juga en un tauler de 8x8 sense caselles alternades i amb marques especials (Ashtāpada). Les blanques mouen primer. L\'objectiu és fer escac i mat al Raja (rei) rival o deixar-lo com a "rei solitari" (sense més peces), , encara que si en el torn següent el rival també deixa sol a l\'altre rei, la partida és taules.',
            bullets: [
                {
                    title: 'Raja (Rei):',
                    desc: 'Mou exactament com un rei modern, però no disposa d\'enroc per protegir-se.',
                    pieceName: 'Raja',
                },
                {
                    title: 'Mantri (Conseller / Ministre):',
                    desc: 'Mou exactament un pas en diagonal en qualsevol direcció.',
                    pieceName: 'Mantri',
                },
                {
                    title: 'Ratha (Carro de Guerra):',
                    desc: 'Mou igual que una torre moderna: horitzontal o verticalment a través de caselles lliures, sense enroc.',
                    pieceName: 'Ratha',
                },
                {
                    title: 'Gaja (Elefant):',
                    desc: 'Salta exactament dues caselles en diagonal, passant per sobre de qualsevol peça intermèdia.',
                    pieceName: 'Gaja',
                },
                {
                    title: 'Ashva (Cavall):',
                    desc: 'Mou igual que el cavall dels escacs moderns (salt en forma de "L").',
                    pieceName: 'Asva',
                },
                {
                    title: 'Padati (Infanteria / Peó):',
                    desc: 'Avança un pas cap endavant i captura en diagonal, sense doble pas inicial.',
                    pieceName: 'Padati',
                },
                {
                    title: 'Marques de l\'Ashtāpada:',
                    desc: 'El tauler presenta marques especials en creu. Coincideixen amb les caselles a les quals cap Gaja pot arribar a causa del seu patró de salt diagonal.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell estratègic: El Mantri és una peça feble en moure només una casella en diagonal. Mantingues-lo a prop del teu Raja per a tasques defensives.',
        },
        history: {
            intro: 'El Xaturanga és un antic joc d\'estratègia considerat àmpliament l\'ancestre directe més primerenc dels escacs moderns i de tota la seva família de variants globals.',
            leftBoxTitle: 'Orígens i les "Quatre Divisions"',
            leftBoxDesc: 'Va néixer al nord de l\'Índia durant l\'Imperi Gupta (cap al segle VI dC). "Xaturanga" significa en sànscrit "quatre divisions militars": infanteria, cavalleria, elefants i carros de guerra.',
            rightBoxTitle: 'Expansió Global',
            rightBoxDesc: 'A través de la Ruta de la Seda, el joc va viatjar a Pèrsia (devenint Xatranj) i cap a l\'Àsia oriental, donant origen a variants com el Xiangqi (Xina) o el Shogi (Japó).',
        },
    },
    shatranj: {
        name: 'Xatranj',
        rules: {
            intro: 'Es juga en un tauler de 8x8 caselles sense alternança de colors. Les blanques mouen primer. L\'objectiu al Xatranj és fer escac i mat al Shah (rei) rival o desposseir-lo de tot el seu exèrcit ("rei solitari"). A diferència dels escacs moderns, ofegar al rival també atorga la victòria.',
            bullets: [
                {
                    title: 'Shah (Rei):',
                    desc: 'Mou com un rei modern, però sense possibilitat d\'enroc.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Ferz (Conseller / Visir):',
                    desc: 'Mou exactament una casella en diagonal en qualsevol direcció.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Rukh (Carro / Torre):',
                    desc: 'Mou igual que una torre moderna: horitzontal o verticalment a través de caselles lliures.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl / Alfil (Elefant):',
                    desc: 'Salta exactament dues caselles en diagonal, sobrevolant qualsevol peça intermitja.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Asb / Faras (Cavall):',
                    desc: 'Mou exactament igual que el cavall dels escacs moderns.',
                    pieceName: 'Asb',
                },
                {
                    title: 'Sarbaz / Baydaq (Peó):',
                    desc: 'Avança i captura com un peó modern, sense doble pas inicial. En arribar a la vuitena fila, corona automàticament a Ferz.',
                    pieceName: 'Sarbaz',
                },
            ],
            proTip: 'Consell estratègic: Com que el Ferz i el Pīl són peces de curt abast, el Shatranj és un joc posicional i pausat. Concentra\'t a obrir columnes per als teus Rukh (torres).',
        },
        history: {
            intro: 'El Xatranj és l\'evolució persa i àrab del Xaturanga indi. Va ser la forma estàndard d\'escacs jugada a l\'Orient Mitjà, el nord d\'Àfrica i Europa durant prop d\'un mil·lenni.',
            leftBoxTitle: 'L\'Edat d\'Or Islàmica',
            leftBoxDesc: 'Després de la conquesta islàmica de Pèrsia al segle VII, els mestres àrabs van formalitzar les regles, van crear les primeres notacions i van dissenyar problemes tàctics coneguts com a "mansubat".',
            rightBoxTitle: 'Arribada a Europa',
            rightBoxDesc: 'El Xatranj va entrar a Europa a través d\'Al-Àndalus i les rutes comercials italianes, romanent pràcticament inalterat fins a finals del segle XV a Espanya, quan el Ferz i el Pīl van ser substituïts per la moderna Dama i l\'Alfil.\'',
        },
    },
    courier: {
        name: 'Escacs del Missatger',
        rules: {
            intro: 'La partida es juga en un tauler de 12x8 caselles (96 caselles). Les blanques mouen primer. L\'objectiu és fer escac i mat al Rei rival. Aquesta variant és cèlebre per introduir el Missatger (que mou com l\'alfil modern), juntament amb altres peces com el Savi i el Schleich.',
            bullets: [
                {
                    title: 'Rei:',
                    desc: 'Mou una casella en qualsevol direcció. No hi ha enroc.',
                    pieceName: 'King',
                },
                {
                    title: 'Missatger:',
                    desc: 'Mou en diagonal qualsevol nombre de caselles lliures, exactament com l\'alfil modern.',
                    pieceName: 'Courier',
                },
                {
                    title: 'Alfil:',
                    desc: 'Salta exactament dues caselles en diagonal, saltant per sobre de peces intermèdies, com l\'antic Alfil.',
                    pieceName: 'Bishop',
                },
                {
                    title: 'Reina:',
                    desc: 'Mou exactament una casella en diagonal en qualsevol direcció.',
                    pieceName: 'Queen',
                },
                {
                    title: 'Schleich (Bufó / Foll):',
                    desc: 'Mou exactament una casella en ortogonal (endavant, endarrere, esquerra, dreta).',
                    pieceName: 'Schleich',
                },
                {
                    title: 'Savi / Home:',
                    desc: 'Mou una casella en qualsevol direcció com un rei, però és una peça ordinària que pot ser capturada.',
                    pieceName: 'Sage',
                },
                {
                    title: 'Cavall i Torre:',
                    desc: 'Mouen exactament com als escacs moderns. El Cavall salta en "L" i la Torre es desplaça en horitzontal o vertical.',
                    pieceName: 'Knight',
                },
                {
                    title: 'Peons i Promoció:',
                    desc: 'Els peons avancen una casella i capturen en diagonal. No tenen doble pas inicial ni captura al pas. En arribar a l\'última fila, un peó promociona a Reina.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Final i Taules:',
                    desc: 'L\'escac i mat guanya la partida. Els registres històrics són ambigus sobre les regles d\'ofegat; sota l\'estàndard del joc, l\'ofegat resulta en taules.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell estratègic: Els Missatgers dominen extensos passadissos diagonals a l\'ampli tauler de 12x8. Coordina\'ls amb les Torres per generar perill!',
        },
        history: {
            intro: 'Els Escacs del Missatger (Kurierschach) van néixer a l\'Alemanya del segle XII i van florir durant més de sis segles, especialment a la vila escaquística de Ströbeck, a prop de les muntanyes del Harz.',
            leftBoxTitle: 'Tradició local i mecenatge reial',
            leftBoxDesc: 'Els Escacs del Missatger van sobreviure fins ben entrat el segle XIX com a tradició local a la vila alemanya de Ströbeck, cèlebrement documentat per Gustavus Selenus el 1616. El 1651, Frederic Guillem, elector de Brandenburg i duc de Prússia, va obsequiar a la vila un tauler personalitzat i jocs de peces de plata en honor al joc.',
            rightBoxTitle: 'El quadre de Lucas van Leyden',
            rightBoxDesc: 'Immortalitzat el 1508 per Lucas van Leyden en la seva cèlebre pintura "Els jugadors d\'escacs", que retrata una dona jugant als Escacs dels Missatgers contra un home davant de diversos espectadors.',
        },
    },
    grant_acedrex: {
        name: 'Gran Acedrex',
        rules: {
            intro: 'El Gran Acedrex és una monumental variant medieval jugada en un tauler de 12x12 caselles (144 caselles). Documentada pel rei Alfons X el Savi al Libro de los Juegos (1283), presenta bèsties mitològiques i exòtiques, files avançades de peons i moviments compostos únics.',
            bullets: [
                {
                    title: 'El Rei:',
                    desc: 'Mou una casella en qualsevol direcció. En el seu primer moviment pot saltar 2 caselles en qualsevol direcció, fins i tot sobrevolant peces intermitges.',
                    pieceName: 'King',
                },
                {
                    title: 'L\'Aanca (Ocell gegant mític):',
                    desc: 'La peça més temible del tauler. Fa un pas en diagonal i, si la casella és lliure, continua desplaçant-se en línia recta com una Torre qualsevol distància.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'L\'Unicorn (Rinoceront):',
                    desc: 'Salta com un Cavall en el seu primer pas; si la casella està buida, pot continuar lliscant en diagonal com un Alfil cap a l\'exterior.',
                    pieceName: 'Unicorn',
                },
                {
                    title: 'La Torre (Roc):',
                    desc: 'Es desplaça en línia recta tantes caselles lliures com vulgui, igual que als escacs moderns.',
                    pieceName: 'Rook',
                },
                {
                    title: 'El Cocodril:',
                    desc: 'Es desplaça en diagonal qualsevol nombre de caselles lliures, movent exactament com un Alfil modern.',
                    pieceName: 'Crocodile',
                },
                {
                    title: 'El Lleó:',
                    desc: 'Mou 3 caselles ortogonals o salta a l\'extrem oposat d\'un rectangle de 2x4 (2 ortogonals + 1 diagonal), superant caselles ocupades.',
                    pieceName: 'Lion',
                },
                {
                    title: 'La Girafa:',
                    desc: 'Salta a l\'extrem oposat d\'un rectangle de 3x4 (1 ortogonal + 2 diagonals), saltant per sobre de qualsevol peça.',
                    pieceName: 'Giraffe',
                },
                {
                    title: 'Els Peons i el Doble Pas Inicial:',
                    desc: 'Els peons blancs comencen a la 4a fila i els negres a la 9a. Poden avançar dues caselles en el seu primer moviment, però aquest avantatge expira després de la primera captura de peó.',
                    pieceName: 'Grantpawn',
                },
                {
                    title: 'Promoció i Victòria:',
                    desc: 'Els peons coronen a la fila 12 a la peça d\'origen de la seva columna. Es guanya per Escac i Mat, Ofegat (el jugador ofegat perd) o Rei Solitari.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'Variant amb Dau de 8 Cares (Regla d\'Alfons X):',
                    desc: 'Per accelerar les partides, Alfons X va idear daus de 8 cares: 8 = Rei, 7 = Aanca, 6 = Unicorn, 5 = Torre, 4 = Lleó, 3 = Cocodril, 2 = Girafa, 1 = Peó. En aquest mode, és obligatori moure una peça del valor del dau.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Consell estratègic: Aprofita el salt d\'obertura de 2 caselles del teu Rei per activar-lo ràpidament!',
        },
        history: {
            intro: 'El Gran Acedrex va ser encarregat el 1283 pel rei Alfons X "El Savi" com a part del cèlebre Libro de los Juegos, conservat al Monestir de l\'Escorial.',
            leftBoxTitle: 'La Saviesa d\'Alfons X',
            leftBoxDesc: 'Alfons X va concebre els jocs com un diàleg filosòfic entre l\'intel·lecte i l\'atzar, vinculant-los amb l\'astronomia i la naturalesa humana.',
            rightBoxTitle: 'La Gran Evolució',
            rightBoxDesc: 'El Gran Acedrex va ampliar el tauler a un format colossal de 12x12. Peces com el Cocodril van introduir els moviments diagonals d\'alfil dos segles abans que els canvis en els moviments de la reina i l\'alfil arrelessin a l\'Europa occidental.',
        },
    },
    tamerlane: {
        name: 'Escacs de Tamerlà',
        rules: {
            intro: 'Jugat en un immens tauler d\'11x10 amb dues caselles sortints addicionals anomenades ciutadelles (112 caselles en total). Les blanques mouen primer. L\'objectiu és fer escac i mat al Shah rival.',
            bullets: [
                {
                    title: 'Shah (Rei):',
                    desc: 'Mou com un rei normal. Un cop per partida pot intercanviar la posició amb qualsevol peça aliada. Si el Shah és capturat havent-hi un Príncep o Shah Advenedís, aquest és coronat com a nou Shah.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Shahzada (Príncep):',
                    desc: 'Es crea en coronar el Peó de Reis. Mou com un rei i porta la insígnia "P".',
                    pieceName: 'Shahzada',
                },
                {
                    title: 'Shah Advenedís (Rei Advenedís):',
                    desc: 'Es crea després del viatge de 3 fases del Peó de Peons. Porta la insígnia "A" i mou com un rei. Pot entrar a la seva pròpia ciutadella tornant-se invulnerable o assumir el tron si cau el Shah.',
                    pieceName: 'AdventitiousShah',
                },
                {
                    title: 'Ferz (Conseller):',
                    desc: 'Mou exactament un pas en diagonal en qualsevol direcció.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Wazir (Visir / Governador):',
                    desc: 'Mou exactament un pas en vertical o horitzontal en qualsevol direcció.',
                    pieceName: 'Wazir',
                },
                {
                    title: 'Zurafa (Girafa):',
                    desc: 'Mou un pas en diagonal i continua lliscant en línia recta com una torre un mínim de tres caselles.',
                    pieceName: 'Zurafa',
                },
                {
                    title: 'Talia (Explorador / Piquet):',
                    desc: 'Llisca en diagonal com un alfil, però ha de recórrer un mínim de dues caselles.',
                    pieceName: 'Talia',
                },
                {
                    title: 'Faras / Asb (Cavall):',
                    desc: 'Mou igual que el cavall tradicional (salt en "L").',
                    pieceName: 'Asb',
                },
                {
                    title: 'Rukh (Carro / Torre):',
                    desc: 'Mou igual que una torre moderna en horitzontal o vertical.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl (Elefant):',
                    desc: 'Salta exactament dues caselles en diagonal, sobrevolant qualsevol peça.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Jamal (Camell):',
                    desc: 'Salta en forma de "L" allargada (1 diagonal + 2 rectes, o 3x1).',
                    pieceName: 'Jamal',
                },
                {
                    title: 'Dabbaba (Màquina de Guerra):',
                    desc: 'Salta exactament dues caselles en vertical o horitzontal.',
                    pieceName: 'Dabbaba',
                },
                {
                    title: 'Els 11 Peons i les seves Promocions:',
                    desc: 'Avancen 1 casella i capturen en diagonal sense doble pas. Cada peça té el seu propi peó dedicat.',
                    pieceName: 'Sarbaz',
                },
                {
                    title: 'Cicle del Peó de Peons:',
                    desc: 'Realitza un viatge únic en 3 etapes: (1) En la primera coronació, es pot recol·locar per atacar en bifurcació o peces atrapades. (2) A la segona, es teletransporta a la casella d\'inici del Peó de Rei. (3) A la tercera, es transforma en Shah Advenedis.\',',
                    pieceName: 'Shah',
                },
                {
                    title: 'Les Ciutadelles i Infiltració Reial:',
                    desc: 'Dues caselles sortints del tauler. Només el membre de més alt rang de la reialesa pot entrar a la ciutadella enemiga per intercanviar-se amb un hereu o reclamar taules.',
                    iconType: 'citadel',
                },
            ],
            proTip: 'Consell estratègic: Protegeix el teu Peó de Peons i coordina els teus saltadors exòtics amb les peces de llarg abast. Si estàs en desavantatge, intenta infiltrar el teu Shah a la ciutadella rival!',
        },
        history: {
            intro: 'Els escacs de Tamerlà són un tità estratègic creat al segle XIV durant el regnat de Timur (Tamerlà), el conqueridor turcomongol. És la més famosa de les variants de "Gran Escacs" (Shatranj Kamil).',
            leftBoxTitle: 'El Joc d\'un Conqueridor',
            leftBoxDesc: 'El mateix Timur era un apassionat dels escacs i preferia els taulers gegantins al tradicional 8x8. Convocava els millors escaquistes a la seva cort a Samarcanda, com el cèlebre Ali ash-Shatranji.',
            rightBoxTitle: 'Mites i Llegendes',
            rightBoxDesc: 'Manuscrits perses atribueixen l\'origen d\'aquestes complexes variants a llegendes antigues, afirmant que Hermes va obsequiar taulers colossals d\'escacs tàctics a Alexandre el Gran.',
        },
    },
    chaturaji: {
        name: 'Chaturaji (Chaturanga per a 4 jugadors)',
        rules: {
            intro: 'El Chaturaji (nom amb què es coneix habitualment, tot i que de manera històricament inexacta, el Chaturanga per a 4 jugadors) es juga en un tauler de 8x8 sense caselles escaquejades entre 4 jugadors: Vermelles (Est), Verdes (Sud), Grogues (Oest) i Blaves (Nord), en torns en sentit horari. Els jugadors enfrontats (Vermelles i Grogues, Verdes i Blaves) són aliats militars, però cada jugador puntua apostes individualment. Existeixen diverses variants i reconstruccions històriques en manuscrits indis i perses; AtlasChess implementa el conjunt de regles recopilat i documentat per chessvariants.com (a excepció de la regla exclusiva per a apostes de diners).',
            bullets: [
                {
                    title: 'El Rei:',
                    desc: 'Mou una casella en qualsevol direcció. No hi ha concepte d\'escac ni d\'escac i mat; els reis es poden capturar directament com qualsevol peça normal. Quan un jugador perd el seu Rei, perd el torn i resta inactiu tret que el seu aliat el rescati.',
                    pieceName: 'ChaturajiKing',
                },
                {
                    title: 'L\'Elefant:',
                    desc: 'Mou horitzontalment o verticalment a través de qualsevol nombre de caselles desocupades, exactament igual que la Torre moderna.',
                    pieceName: 'ChaturajiElephant',
                },
                {
                    title: 'El Cavall:',
                    desc: 'Mou en forma de "L" (dues caselles en una direcció i una en perpendicular), saltant sobre peces intermèdies, idèntic al Cavall modern.',
                    pieceName: 'ChaturajiHorse',
                },
                {
                    title: 'La Barca:',
                    desc: 'Salta exactament dues caselles en diagonal, sobrevolant qualsevol peça intermèdia. Triomf de la Barca (Vrihannauka)!: Si una Barca mou i completa un quadrat de 2x2 compost per les quatre barques presents al tauler, la barca que mou captura instantàniament les altres tres barques alhora!',
                    pieceName: 'ChaturajiBoat',
                },
                {
                    title: 'El Peó:',
                    desc: 'Avança 1 casella endavant en la direcció de marxa del seu exèrcit i captura 1 casella en diagonal endavant (sense avanç doble inicial). En arribar a la fila final oposada, pot coronar en la peça original d\'aquella columna (Cantonada = Barca, Columna de Cavall = Cavall, Columna d\'Elefant = Elefant, Columna de Rei = Rei). Tanmateix, la coronació només es permet si al jugador li queden 2 o menys peons; si encara té 3 o 4 peons, roman congelat a l\'última fila fins que es perdin peons aliats.',
                    pieceName: 'ChaturajiPawn',
                },
                {
                    title: 'Trons (Sinhasana):',
                    desc: 'Un Rei que entri a la casella de tron inicial d\'un rival guanya 1 aposta (2 apostes si captura el rei rival en aquell tron). Un Rei que entri al tron inicial del seu aliat pren el comandament suprem de tot l\'exèrcit aliat, controlant ambdues forces en el seu torn (i guanya 2 apostes si captura el rei aliat allà).',
                },
                {
                    title: 'Rescat de Reis:',
                    desc: 'Si un jugador captura un rei enemic mentre el rei del seu aliat ha caigut (i no ha estat rescatat prèviament), pot optar per rescatar el rei del seu company i col·locar-lo immediatament a qualsevol casella buida del tauler.',
                },
                {
                    title: 'El Dau (d4):',
                    desc: 'En jugar amb la regla tradicional de daus, es llança un dau per determinar quina peça pot moure: 1 = Peó o Rei, 2 = Barca, 3 = Cavall, 4 = Elefant. Si es juga sense daus, el jugador tria lliurement qualsevol moviment legal.',
                    iconType: 'dices',
                },
                {
                    title: 'Rei Solitari i Victòria:',
                    desc: 'Si qualsevol jugador queda reduït únicament al seu Rei sense altres peces, la partida finalitza immediatament en Taules. L\'últim Rei supervivent guanya 1 aposta (2 si aquell Rei va capturar personalment els 3 reis rivals, 4 si va ser als seus respectius trons). La partida global la guanya el jugador que hagi acumulat el nombre més alt d\'apostes.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell estratègic: Vigila les agrupacions de barques per activar el demolidor Triomf de la Barca (Vrihannauka). Si el teu aliat cau, envaeix el seu tron per comandar el seu exèrcit o captura un rei enemic per efectuar un Rescat de Rei!',
        },
        history: {
            intro: 'El joc per a quatre participants conegut avui com a Chaturaji s\'anomenava realment Chaturanga (en sànscrit, "quatre divisions de l\'exèrcit"). Tot i que a la literatura moderna tardana se\'l va anomenar Chaturaji ("Quatre Reis"), les fonts històriques confirmen que era una modalitat per a quatre jugadors del Chaturanga original.',
            leftBoxTitle: 'Al-Biruni i els Manuscrits Indis',
            leftBoxDesc: 'El primer testimoni detallat va ser documentat cap al 1030 dC pel polímata persa Al-Biruni al seu Kitab al-Hind (Llibre de l\'Índia). Posteriorment va aparèixer en textos sànscrits com el Tithitattva de Raghunandana (segles XV-XVI), descrivint quatre exèrcits (Vermell, Verd, Groc, Blau) que disputaven apostes al tauler Ashtāpada de 8x8 amb daus.',
            rightBoxTitle: 'La Refutada Teoria de Cox-Forbes',
            rightBoxDesc: 'Al segle XIX, Hiram Cox i Duncan Forbes van formular la cèlebre teoria que els escacs amb daus per a 4 jugadors eren l\'ancestre primigeni de tots els escacs. El 1913, l\'historiador H.J.R. Murray i investigadors moderns com Jean-Louis Cazaux van refutar totalment aquesta hipòtesi, demostrant que el Chaturanga per a 2 jugadors va néixer primer (c. segle VI) i la versió per a 4 jugadors va sorgir més tard (segles X-XI).',
        },
    },
    four_seasons: {
        name: 'Escacs de les Quatre Estacions (Acedrex de los cuatro tiempos)',
        rules: {
            intro: 'Els Escacs de les Quatre Estacions es juguen en un tauler de 8x8 caselles per 4 jugadors: Verd (Primavera), Vermell (Estiu), Negre (Tardor) i Blanc (Hivern). El torn rota en sentit antihorari (Verd → Vermell → Negre → Blanc). És un joc de tots contra tots. En fer escac i mat a un Rei rival, el seu exèrcit complet és annexionat pel vencedor. L\'últim jugador dempeus guanya la partida!',
            bullets: [
                {
                    title: 'El Rei:',
                    desc: 'Mou una casella en qualsevol direcció (ortogonal o diagonal). Si un Rei rep escac i mat, és retirat del tauler i el jugador que ha fet el mat pren el control total de totes les peces supervivents d\'aquell exèrcit.',
                    pieceName: 'FourSeasonsKing',
                },
                {
                    title: 'El General:',
                    desc: 'Mou exactament una casella en diagonal en qualsevol direcció.',
                    pieceName: 'FourSeasonsGeneral',
                },
                {
                    title: 'La Torre:',
                    desc: 'Mou horitzontalment o verticalment a través de qualsevol nombre de caselles desocupades, idèntica a la Torre moderna.',
                    pieceName: 'FourSeasonsRook',
                },
                {
                    title: 'El Cavall:',
                    desc: 'Mou en forma de "L" (dues caselles en una direcció i una en perpendicular), saltant sobre qualsevol peça intermèdia.',
                    pieceName: 'FourSeasonsKnight',
                },
                {
                    title: 'L\'Alfil:',
                    desc: 'Salta exactament dues caselles en diagonal, sobrevolant qualsevol peça intermèdia a la casella de salt.',
                    pieceName: 'FourSeasonsBishop',
                },
                {
                    title: 'El Peó:',
                    desc: 'Avança una casella al llarg de la trajectòria assignada al seu quadrant i captura una casella en diagonal endavant. En assolir la vora final corresponent al final de la seva marxa, corona immediatament en un General.',
                    pieceName: 'FourSeasonsPawn',
                },
                {
                    title: 'Escac i Mat i Annexió d\'Exèrcits:',
                    desc: 'En fer escac i mat al Rei d\'un oponent, el seu Rei queda eliminat i heretes la totalitat del seu exèrcit supervivent, podent moure les seves peces en els teus torns!',
                    iconType: 'check',
                },
                {
                    title: 'Ofegat:',
                    desc: 'Si un jugador no té moviments legals en el seu torn i el seu rei no està en escac, queda ofegat. Totes les peces del jugador ofegat són retirades del tauler.',
                },
                {
                    title: 'El Dau de 6 Cares (d6):',
                    desc: 'En jugar amb la regla històrica de daus, es llança un d6 a cada torn: 1 = Peó, 2 = Alfil, 3 = Cavall, 4 = Torre, 5 = General, 6 = Rei. Si la peça obtinguda no té moviments legals, es perd el torn.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Consell estratègic: Concentra els teus atacs en els Reis vulnerables per fer-los mat i annexionar els seus exèrcits! Comandar múltiples exèrcits et donarà una superioritat numèrica aclaparadora.',
        },
        history: {
            intro: 'Documentat el 1283 al "Libro de los Juegos" (fol. 88v) encarregat pel rei Alfons X el Savi de Castella sota el títol "Acedrex de los Quatro Tiempos". A diferència del Chaturaji indi on es jugava per parelles aliades, aquí és un tots contra tots individual entre quatre participants, probablement inspirat per influències orientals com les descripcions d\'Al-Biruni el 1030.',
            leftBoxTitle: 'Les Quatre Estacions, Elements i Humors',
            leftBoxDesc: 'Cada bàndol encarna una estació, element i humor corporal: Verd representa la Primavera, l\'Aire i la Sang; Vermell l\'Estiu, el Foc i la Còlera; Negre la Tardor, la Terra i la Melancolia; i Blanc l\'Hivern, l\'Aigua i la Flema. La partida comença amb el Verd i avança en l\'ordre natural de les estacions.',
            rightBoxTitle: 'El Tauler i el Joc "El Mundo"',
            rightBoxDesc: 'Es disputa en un tauler de 8x8 amb les peces situades a les quatre cantonades (permetent xocs frontals) i diagonals centrals en forma d\'"X" que servien de guia visual per a l\'avanç dels peons. El manuscrit associa a més aquesta variant a un joc de taules circular per a 4 jugadors anomenat "El Mundo" amb els mateixos quatre colors.',
        },
    },
    xiangqi: {
        name: 'Xiangqi',
        rules: {
            intro: 'El Xiangqi es juga en un tauler de nou línies d\'amplada per deu de llargada, on les peces se situen a les interseccions (punts). Dividint els dos bàndols oposats entre les files cinquena i sisena es troba el Riu. Dues zones de 3x3 delimitades per línies diagonals formen el Palau. Les vermelles mouen primer. L\'objectiu principal és fer escac i mat o ofegar el general enemic.',
            bullets: [
                {
                    title: 'El General (Rei):',
                    desc: 'Mou i captura un punt ortogonalment i no pot sortir del Palau. Els dos generals oposats no poden quedar enfrontats directament al llarg d\'una columna oberta sense peces intermèdies (regla del general volador).',
                    pieceName: 'XiangqiGeneral',
                },
                {
                    title: 'El Conseller (Guàrdia / Oficial):',
                    desc: 'Mou i captura un punt diagonalment i no pot sortir del Palau.',
                    pieceName: 'XiangqiAdvisor',
                },
                {
                    title: 'L\'Elefant (Ministre):',
                    desc: 'Mou i captura exactament dos punts en diagonal i no pot saltar per sobre d\'una peça intermèdia (bloqueig de l\'ull de l\'elefant). Els elefants no poden creuar el Riu.',
                    pieceName: 'XiangqiElephant',
                },
                {
                    title: 'El Cavall (Cavaller):',
                    desc: 'Mou un punt ortogonal seguit d\'un punt diagonal cap enfora. No salta: si el punt adjacent en la direcció ortogonal està ocupat, el cavall queda bloquejat (bloqueig de la pota del cavall).',
                    pieceName: 'XiangqiHorse',
                },
                {
                    title: 'El Carro (Torre):',
                    desc: 'Mou i captura qualsevol distància al llarg de línies rectes ortogonals a través de punts desocupats.',
                    pieceName: 'XiangqiChariot',
                },
                {
                    title: 'El Canó:',
                    desc: 'Mou com un carro a través de punts desocupats. Per capturar, ha de saltar sobre exactament una peça intermèdia (la pantalla o plataforma) de qualsevol color.',
                    pieceName: 'XiangqiCannon',
                },
                {
                    title: 'El Soldat (Peó):',
                    desc: 'Mou i captura un punt cap endavant. Després de creuar el Riu, també pot moure i capturar un punt horitzontalment (esquerra o dreta). No pot retrocedir i no corona.',
                    pieceName: 'XiangqiSoldier',
                },
                {
                    title: 'Regla del General Volador:',
                    desc: 'Els dos generals no poden quedar enfrontats a la mateixa columna oberta sense peces intermèdies. Un moviment que exposi els dos generals directament entre si és il·legal.',
                    iconType: 'check',
                },
                {
                    title: 'Victòria i Ofegat:',
                    desc: 'Un jugador guanya fent escac i mat o ofegant el general contrari (deixant l\'oponent sense moviments legals).',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell pro: Desenvolupa els teus carros ràpidament, controla columnes obertes i coordina els canons amb pantalles evitant que els cavalls quedin bloquejats.',
        },
        history: {
            intro: 'Un joc anomenat xiangqi va ser esmentat al text del segle I aC Shuo Yuan remuntant-se al període dels Regnes Combatents, i l\'emperador Wu de Zhou del Nord va descriure el joc xiangxi l\'any 569 dC. La descripció més primerenca de les regles del joc actual apareix al relat "Cén Shùn" a la col·lecció Xuanguai lu, escrita per Niu Sengru durant la dinastia Tang. El joc té la seva forma moderna des de la dinastia Song del Sud.',
            leftBoxTitle: 'Etimologia',
            leftBoxDesc: 'El nom xiangqi s\'interpreta generalment de forma literal com a "escacs d\'elefant" (xiàng = elefant, qí = escacs/joc de tauler). Tanmateix, xiàng també pot significar marfil, figura o representació, o fenomen celeste. L\'historiador H. J. R. Murray va suggerir "el Joc de les Figures" com una interpretació primerenca probable abans que les peces es distingissin per caràcters escrits.',
            rightBoxTitle: 'Orígens i Difusió',
            rightBoxDesc: 'Segons Murray i l\'opinió predominant entre els historiadors dels escacs, el xiangqi actual descendeix del chaturanga indi. Una hipòtesi alternativa defensada per alguns historiadors xinesos suggereix que el xiangqi va sorgir a la Xina durant el període dels Regnes Combatents i es va difondre cap a l\'oest. El janggi coreà també prové directament del xiangqi.',
        },
    },
    janggi: {
        name: 'Janggi',
        rules: {
            intro: 'El Janggi (coreà: 장기), de vegades anomenat escacs coreans, és un joc de tauler d\'estratègia popular a la península de Corea. Derivat del xiangqi (escacs xinesos), es juga a les 90 interseccions d\'un tauler de 9×10 sense riu central. L\'equip blau (Cho) mou primer. L\'objectiu del joc és fer escac i mat al general adversari (weh-tong).',
            bullets: [
                {
                    title: 'Disposició inicial i formacions a triar:',
                    desc: 'Abans de començar la partida, cada jugador pot intercanviar les posicions dels seus cavalls i elefants adjacents. Això dona lloc a quatre disposicions inicials possibles que reben el seu nom de la posició dels elefants: Formació d\'Elefants Interiors (la clàssica per defecte), Formació d\'Elefants Exteriors, Formació d\'Elefant Esquerre i Formació d\'Elefant Dret.',
                    iconType: 'check',
                },
                {
                    title: 'El General (Janggun / Gung):',
                    desc: 'Comença a la intersecció central del palau. Mou un pas per torn seguint les línies marcades dins del palau de 3×3 (nou punts) i no en pot sortir sota cap circumstància. La partida es perd quan el general rep escac i mat.',
                    pieceName: 'JanggiGeneral',
                },
                {
                    title: 'Els Guàrdies (Sa):',
                    desc: 'Dos oficials civils que comencen a esquerra i dreta del general a la primera fila. Mouen un pas per torn seguint les línies marcades dins del palau. No poden abandonar el palau i són valuosos per protegir el general.',
                    pieceName: 'JanggiGuard',
                },
                {
                    title: 'El Cavall (Ma):',
                    desc: 'Mou un pas ortogonal seguit d\'un pas diagonal cap enfora, sense saltar. Queda blocat si hi ha una peça al seu primer pas ortogonal. Pot intercanviar la posició amb un elefant adjacent a la disposició inicial.',
                    pieceName: 'JanggiHorse',
                },
                {
                    title: 'L\'Elefant (Sang):',
                    desc: 'Mou un punt ortogonal seguit de dos punts diagonals cap enfora, assolint la cantonada oposada d\'un rectangle de 2×3. Queda blocat per peces intermèdies al llarg de la seva trajectòria. Com que no hi ha riu, els elefants poden creuar tot el tauler amb caràcter ofensiu.',
                    pieceName: 'JanggiElephant',
                },
                {
                    title: 'El Carro (Cha):',
                    desc: 'Mou i captura a qualsevol distància en línia recta ortogonal, tant horitzontalment com verticalment. A més, es pot desplaçar en línia recta per les diagonals de l\'interior de qualsevol dels dos palaus. Comença a les cantonades i és la peça més poderosa del joc.',
                    pieceName: 'JanggiChariot',
                },
                {
                    title: 'El Canó (Po):',
                    desc: 'Tant per moure com per capturar, ha de saltar obligatòriament sobre exactament una peça intermèdia (amiga o enemiga) en línia horitzontal o vertical. Un canó no pot saltar sobre un altre canó ni capturar un canó rival. També pot viatjar per les diagonals del palau si hi ha una peça al centre.',
                    pieceName: 'JanggiCannon',
                },
                {
                    title: 'El Soldat (Byeong / Jol):',
                    desc: 'Cinc soldats per bàndol (Byeong per al vermell, Jol per al blau). Mouen i capturen un punt cap endavant o cap als costats. No promocionen; en arribar al fons del tauler només poden moure\'s lateralment. Al palau enemic, també poden avançar en diagonal cap endavant per les seves línies marcades.',
                    pieceName: 'JanggiSoldier',
                },
                {
                    title: 'Passar torn (Han-soo-shim) i absència d\'ofegat:',
                    desc: 'Un jugador pot passar el seu torn voluntàriament (han-soo-shim) sempre que el seu general no estigui en escac. L\'ofegat no comporta una derrota: el jugador sense moviments legals simplement ha de passar. Si tots dos jugadors passen consecutivament, la partida acaba en taules.',
                    iconType: 'check',
                },
                {
                    title: 'Bikjang (Generals enfrontats):',
                    desc: 'Un jugador pot moure el seu general perquè quedi enfrontat directament al general rival a la mateixa columna o fila sense peces intermèdies. L\'oponent pot llavors reclamar taules immediatament o fer un moviment que trenqui la situació.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell professional: Aprofita la possibilitat de triar la formació inicial de cavalls i elefants per adaptar la teva obertura. Recorda que els canons no poden moure sense una peça sobre la qual saltar i explota les diagonals del palau amb els teus carros.',
        },
        history: {
            intro: 'El Janggi és una variant d\'escacs originària de la península de Corea, desenvolupada a partir del xiangqi xinès. Tot i que comparteixen el tauler de 9×10 i la col·locació a les interseccions, el janggi va eliminar el riu divisori, va requerir que els canons saltin també en desplaçar-se i va atorgar als elefants plena mobilitat per tot el tauler.',
            leftBoxTitle: 'Contesa Chu–Han',
            leftBoxDesc: 'Els generals representen els estats rivals de Han (漢, bàndol vermell) i Chu (楚, bàndol blau), que van lluitar pel poder després de la caiguda de la dinastia Qin. Les peces vermelles estan escrites amb cal·ligrafia regular (kaishu), mentre que les blaves utilitzen cal·ligrafia cursiva (caoshu).',
            rightBoxTitle: 'Cultura popular',
            rightBoxDesc: 'A Corea del Sud, el janggi és un esport mental tradicional i un passatemps molt estès. Aficionats de totes les edats es reuneixen durant tot l\'any en parcs urbans per jugar partides amistoses i analitzar posicions tàctiques.',
        },
    },
    makruk: {
        name: 'Makruk',
        rules: {
            intro: 'El Makruk (tailandès: หมากรุก), o escacs tailandesos, és un joc de tauler d\'estratègia descendent del chaturanga indi del segle VI o d\'un parent molt proper. Es juga en un tauler de 8x8 sense colors alternats. Les blanques mouen primer. L\'objectiu és fer escac i mat al senyor enemic i l\'ofegat són taules.',
            bullets: [
                {
                    title: 'El Senyor (Khun - ขุน):',
                    desc: 'Mou o captura una casella en qualsevol direcció (ortogonal o diagonal). És la peça reial: la partida es guanya fent escac i mat al senyor contrari. El rei ofegat finalitza en taules, tal com als escacs occidentals i a diferència del Shatranj.',
                    pieceName: 'Khun',
                },
                {
                    title: 'La Llavor (Met - เม็ด):',
                    desc: 'Mou o captura una casella en diagonal en totes quatre direccions, igual que el ferz al Shatranj. Comença situada a la dreta del senyor.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Noble (Khon - โคน):',
                    desc: 'Mou o captura una casella en diagonal en quatre direccions o una casella cap endavant (5 direccions en total), de manera idèntica al general de plata al Shogi.',
                    pieceName: 'Khon',
                },
                {
                    title: 'El Cavall (Ma - ม้า):',
                    desc: 'Mou dues caselles ortogonalment i després una casella en perpendicular, saltant per sobre de qualsevol peça en el seu camí, exactament igual que el cavall dels escacs occidentals.',
                    pieceName: 'Ma',
                },
                {
                    title: 'El Vaixell (Ruea - เรือ):',
                    desc: 'Mou o captura qualsevol nombre de caselles desocupades ortogonalment al llarg de files i columnes, igual que la torre als escacs occidentals.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'El Cauri (Bia - เบี้ย):',
                    desc: 'Mou una casella cap endavant i captura una casella en diagonal cap endavant. No pot avançar dues caselles en el seu primer moviment (no hi ha pas doble ni captura al pas). En assolir la sisena fila relativa (fila 6 per a blanques, fila 3 per a negres), es promociona obligatòriament a cauri invertit (Biangai).',
                    pieceName: 'Bia',
                },
                {
                    title: 'El Cauri Invertit (Biangai - เบี้ยหงาย):',
                    desc: 'Un peó/cauri promocionat (girat). Mou o captura una casella en diagonal en qualsevol direcció, tenint el mateix moviment que la llavor (Met).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Regles de Comptatge - Comptatge de Tauler (64 Jugades):',
                    desc: 'Quan a cap dels dos bàndols li queden cauris sense promocionar al tauler, s\'ha de fer escac i mat en un màxim de 64 jugades o la partida es declara taules. El jugador en desavantatge realitza el compte i el pot aturar (y també reiniciar) en qualsevol moment. Si el jugador que compta fa escac i mat sense haver aturat el compte, la partida es declara taules.',
                    iconType: 'check',
                },
                {
                    title: 'Regles de Comptatge - Comptatge per Peces (Rei a la Fuga):',
                    desc: 'Quan es captura la darrera peça (que no sigui el senyor) del jugador en desavantatge, aquest pot iniciar el compte dels seus moviments de fugida. El bàndol atacant disposa d\'un límit màxim de jugades segons les peces que conservi: 2 Vaixells = 8 jugades; 1 Vaixell = 16 jugades; 2 Nobles = 22 jugades; 2 Cavalls = 32 jugades; 1 Noble = 44 jugades; 1 Cavall = 64 jugades; Només Llavors = 64 jugades. El jugador que fuig comença a comptar a partir del nombre total de peces que queden al tauler (incloent-hi ambdós senyors), de manera que l\'atacant ha de fer mat abans que s\'assoleixi aquest límit. El jugador en desavantatge realitza el compte i el pot aturar (y també reiniciar) en qualsevol moment.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell professional: Coordina els teus vaixells i nobles per controlar el centre, i tingues molt present que en entrar a finals sense cauris o amb un rei solitari, cada jugada compta estrictament contra el límit de taules.',
        },
        history: {
            intro: 'El Makruk (o escacs tailandesos) és un joc de tauler d\'estratègia descendent del joc indi xaturanga del segle VI o d\'un parent molt proper, per la qual cosa està emparentat amb els escacs. A Cambodja es juga pràcticament el mateix joc, conegut com a ouk o ouk chatrang.',
            leftBoxTitle: 'Origen i Transmissió',
            leftBoxDesc: 'Comerciants perses van arribar al regne d\'Ayutthaya al voltant del segle XIV per comerciar i difondre la seva cultura, per la qual cosa és possible que el makruk siamès derivés del shatranj persa per intercanvi cultural, ja que la llavor (met) es mou igual que el ferz persa. No obstant això, es considera més probable que arribés més directament des de l\'Índia, ateses les similituds lingüístiques entre xaturanga i el nom cambodjà ouk chaktrang, així com el moviment del noble (khon). A la seva obra «A History of Chess» (1913), H. J. R. Murray suggereix que el joc podria haver seguit l\'expansió del budisme a la regió.',
            rightBoxTitle: 'L\'Ouk Cambodjà',
            rightBoxDesc: 'A Cambodja i entre els khmers del Vietnam (on s\'anomena cờ ốc o «escacs de cargol marí»), l\'ouk és un element tradicional de les festivitats del Bon Om Touk. Baixos relleus en temples de l\'Imperi Khmer del segle XII demostren que es juga com a mínim des d\'aquella època. Presenta diferències menors com moviments inicials opcionals de cavall per al senyor i de dues caselles per a la llavor abans que hi hagi captures. El 2008 es va celebrar el primer torneig nacional amb regles estandarditzades i es va incloure als Jocs del Sud-est Asiàtic de 2023 (SEA Games).',
        },
    },
    ouk_chaktrang: {
        name: 'Ouk Chaktrang',
        rules: {
            intro: 'L\'Ouk Chaktrang (en khmer: អុកចត្រង្គ), o escacs cambodjans, és un joc de tauler d\'estratègia estretament emparentat amb el Makruk tailandès. Comparteix les mateixes peces, tauler i regles de comptatge, però introdueix moviments especials d\'obertura per al senyor i la llavor si encara no s\'ha produït cap captura a la partida.',
            bullets: [
                {
                    title: 'Obertura Especial - Salt del Senyor (Ang):',
                    desc: 'En el seu primer moviment, i únicament si no està en escac, el senyor pot moure saltant com un cavall (en forma de L), sempre que encara no s\'hagi capturat cap peça a la partida.',
                    pieceName: 'Khun',
                },
                {
                    title: 'Obertura Especial - Avanç Doble de la Llavor (Neang):',
                    desc: 'En el seu primer moviment, la llavor pot avançar dues caselles en línia recta cap endavant (saltant qualsevol obstacle intermedi), sempre que encara no s\'hagi capturat cap peça a la partida.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Senyor (Ang):',
                    desc: 'Mou o captura una casella en qualsevol direcció. La partida es guanya fent escac i mat al senyor adversari, i l\'ofegat són taules.',
                    pieceName: 'Khun',
                },
                {
                    title: 'La Llavor (Neang):',
                    desc: 'Mou o captura una casella en diagonal en les quatre direccions. Comença situada a la dreta del senyor.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Noble (Koul):',
                    desc: 'Mou o captura una casella en diagonal en les quatre direccions o una casella cap endavant (5 direccions en total), idèntic al noble del Makruk.',
                    pieceName: 'Khon',
                },
                {
                    title: 'El Cavall (Ses):',
                    desc: 'Mou en forma de L saltant per damunt de qualsevol peça en el seu camí, exactament igual que el cavall dels escacs.',
                    pieceName: 'Ma',
                },
                {
                    title: 'El Vaixell (Tuuk):',
                    desc: 'Mou o captura qualsevol nombre de casilles ortogonalment al llarg de files i columnes, igual que la torre dels escacs.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'El Peix (Trey):',
                    desc: 'Mou una casella cap endavant i captura una casella en diagonal cap endavant. En assolir la sisena fila relativa, promociona obligatòriament a peix invertit (Trey Bak).',
                    pieceName: 'Bia',
                },
                {
                    title: 'El Peix Invertit (Trey Bak):',
                    desc: 'Un peix promocionat (voltejat). Mou o captura una casella en diagonal en qualsevol direcció, tenint el mateix moviment que la llavor (Neang).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Regles de Comptatge (Comptatge de Tauler i Rei a la Fuga):',
                    desc: 'Hereta les regles de comptatge del Makruk: comptatge de 64 jugades quan no queden peixos sense promocionar i comptatge per peces quan un jugador queda amb rei solitari. Si el jugador que compta fa escac i mat sense aturar el compte, la partida es declara taules.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell professional: Aprofita el salt de cavall inicial del senyor per posar-lo en seguretat ràpidament i buidar la columna per als teus vaixells abans que s\'obri el joc amb la primera captura.',
        },
        history: {
            intro: 'L\'Ouk Chaktrang (o Ouk) és el joc d\'estratègia tradicional de Cambodja, amb arrels que es remunten a més d\'un mil·lenni a partir de l\'antic xaturanga indi.',
            leftBoxTitle: 'Evidència Arqueològica a Angkor',
            leftBoxDesc: 'Hi ha nombrosos baixos relleus del segle XII a temples de l\'Imperi Khmer (com ara el Bayon i Angkor Wat) que representen figures jugant partides d\'Ouk, demostrant l\'arrelament popular i cortesà del joc durant l\'esplendor d\'Angkor.',
            rightBoxTitle: 'Tradició Viva i Esport Modern',
            rightBoxDesc: 'Jugat àmpliament a Cambodja i pels khmers del Vietnam (on es coneix com a cờ ốc), és una part central del festival de l\'aigua Bon Om Touk. El 2008 el Comitè Olímpic de Cambodja en va estandarditzar el reglament nacional i el 2023 va ser esport oficial als Jocs del Sud-est Asiàtic (SEA Games).',
        },
    },
    sittuyin: {
        name: 'Sittuyin',
        rules: {
            intro: 'El Sittuyin (en birmà: စစ်တုရင်) és el joc d\'escacs tradicional de Myanmar (Birmània). Jugat sobre un tauler monocrom de 8×8 amb les diagonals Sit-ke-min creuades, els peons comencen en una formació esglaonada asimètrica i poden promocionar a General en assolir o creuar la línia diagonal de promoció a la meitat enemiga quan el propi General ha caigut.',
            bullets: [
                {
                    title: 'El Rei (Mingyi):',
                    desc: 'Mou una casella en qualsevol direcció (ortogonal o diagonal). L\'objectiu és fer escac i mat. L\'ofegat (stalemate) resulta en taules.',
                    pieceName: 'Mingyi',
                },
                {
                    title: 'El General (Sitke):',
                    desc: 'Mou una casella en diagonal en les quatre direccions (idèntic al Ferz del Shatranj o Met del Makruk). Cada jugador pot tenir un màxim d\'un General actiu al tauler.',
                    pieceName: 'Sitke',
                },
                {
                    title: 'El Elefant (Sin):',
                    desc: 'Mou una casella en diagonal en les quatre direccions o una casella endavant en línia recta (5 direccions en total), idèntic al Noble del Makruk o General de Plata de Shogi.',
                    pieceName: 'Sin',
                },
                {
                    title: 'El Cavall (Myin):',
                    desc: 'Mou amb el salt característic en "L", podent saltar sobre qualsevol obstacle en el seu camí.',
                    pieceName: 'Myin',
                },
                {
                    title: 'El Carro / Torre (Yahhta):',
                    desc: 'Mou ortogonalment qualsevol nombre de caselles lliures al llarg de files o columnes.',
                    pieceName: 'Yahhta',
                },
                {
                    title: 'El Peó / Senyor Feudal (Ne):',
                    desc: 'Mou una casella cap endavant sense capturar i captura una casella en diagonal cap endavant. No disposa d\'avanç doble inicial ni captura al pas.',
                    pieceName: 'Ne',
                },
                {
                    title: 'Promoció Immediata i Diferida:',
                    desc: 'Els peons promocionen a General en assolir o creuar la línia diagonal de la meitat del tauler del rival, sempre que el propi General hagi estat capturat. Si el General ja és mort en creuar la línia, la promoció és immediata. Si el General és viu, el peó roman com a peó; quan el General mori més endavant, el jugador pot promocionar-lo in situ en el seu torn mitjançant la píndola d\'acció flotant.',
                    iconType: 'check',
                },
                {
                    title: 'Regles de Taules i Comptatge del Rei Solitari:',
                    desc: 'Es declaren taules per rei ofegat, posició morta, triple repetició o regla de 50 jugades. A més, si un jugador queda únicament amb el seu Rei i el rival no té peons, el rei solitari empata si sobreviu a un comptatge fix: 16 jugades si el rival té com a mínim una Torre, 44 jugades si té com a mínim un Elefant, o 64 jugades si té com a mínim un Cavall.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consell professional: Mantén els teus peons situats a les diagonals enemigues com una amenaça latent; si perds el teu General, podràs promoure immediatament o reviure un nou General en una posició avançada clau.',
        },
        history: {
            intro: 'El Sittuyin (en birmà: စစ်တုရင်) és el joc d\'escacs mil·lenari de Myanmar, descendent directe del xaturanga indi que va arribar a la regió cap al segle VIII. El seu nom deriva de «sit» (guerra o exèrcit) i representa les quatre divisions militars tradicionals: infanteria (nè), cavalleria (myin), elefants (sin) i carros (yahhta). En fonts històriques i cròniques colonials del segle XIX va ser documentat sota denominacions com «chit-thareen» (Stewart Culin, 1898; Hiram Cox, 1801; Michael Symes, 1800, qui el va anomenar «el joc del general») o «tsit-da-yin» (G. W. Strettell, 1876). Els antics monarques i cabdills birmans el feien servir a la cort per assajar tàctiques de combat abans d\'entrar en campanya: com que els reis birmans lluitaven directament a primera línia de foc, el lideratge actiu del monarca sobre el tauler decidia el resultat de la contesa.',
            leftBoxTitle: 'Mitologia del Ramayana, Art i Tradició Viva',
            leftBoxDesc: 'Les peces tradicionals són escultures en fusta o marfil (vermelles i negres o verdes) que encarnen la lluita èpica del Ramayana (Yama Zatdaw): el príncep Rama i el general simi Hanuman davant el rei dimoni Ravana. Els artesans construïen taulers de taula elevats (sittuyin-kon) dotats de calaixos per desar-hi les peces, pensats per jugar-hi a la gatzollada a terra. En les partides clàssiques, cada moviment s\'acompanya d\'un cop sec i ressonant contra la fusta, recordant el xoc de les armes. Emparentat anatòmicament amb el Makruk tailandès i l\'Ouk Chaktrang cambodjà segons l\'historiador Jean-Louis Cazaux, el joc va patir un fort declivi i una gran escassetat de jocs tallats antics després de cinc dècades de dictadura militar i aïllament al segle XX, eclipsat pel joc internacional però preservat a les regions nord-occidentals.',
            rightBoxTitle: 'Desplegament Sit-tee, Sit-ke-min i Reglament',
            rightBoxDesc: 'El joc es disputa sobre un tauler llis de 64 caselles sense alternança de colors, travessat per dues grans diagonals anomenades Sit-ke-min («línies del general»). La partida comença amb la fase de Sit-tee (desplegament de tropes): darrere dels peons esglaonats, cada bàndol disposa lliurement les seves peces majors; en tornejos oficials es col·loca una petita cortina al mig per ocultar la formació fins que ambdós exèrcits estan preparats. H. J. R. Murray en va descriure el 1913 l\'evolució en tres etapes (col·locació, recol·locació i batalla oberta). Els peons només poden promocionar a General en assolir les diagonals Sit-ke-min i únicament si el propi General ja ha estat capturat. L\'objectiu és fer escac i mat (khwè), estant prohibit l\'ofegat (taules il·legals). Anne Sunnucks també va registrar antigues variants amb tres daus de torns triples.',
        },
    },
};
