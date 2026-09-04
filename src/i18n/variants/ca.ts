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
    grant_acedrex: {
        title: 'Gran Acedrex',
        origin: 'Segle XIII • Castella (Alfons X)',
        tag: 'Tauler 12x12',
        desc: 'El gran joc d\'escacs reial d\'Alfons X el Savi amb Aanques, Unicorns, Lleons, Girafes i Cocodrils.',
    },
    tamerlane: {
        title: 'Escacs de Tamerlà',
        origin: 'Segle XIV • Imperi Timúrida',
        tag: '112 Caselles',
        desc: 'Els escacs monumentals de Tamerlà amb Girafes, Camells, Màquines de Guerra, 11 peons únics i Ciutadelles reials.',
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
};
