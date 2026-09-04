import type { VariantMetaI18n, VariantCodexI18n } from '../types';

export const variantMeta_es: Record<string, VariantMetaI18n> = {
    classic: {
        title: 'Ajedrez Clásico',
        origin: 'Siglo XV • Europa',
        tag: 'Estándar',
        desc: 'Las reglas modernas reconocidas mundialmente con enroque, peón al paso y dama de largo alcance.',
    },
    chaturanga: {
        title: 'Chaturanga',
        origin: 'Siglo VI • India',
        tag: 'El Origen',
        desc: 'El ancestro más antiguo del ajedrez jugado en el tablero no ajedrezado Ashtāpada (8x8).',
    },
    shatranj: {
        title: 'Shatranj',
        origin: 'Siglo VII • Persia',
        tag: 'Edad de Oro',
        desc: 'La joya estratégica de la Ruta de la Seda. El Ferz mueve 1 diagonal, el Elefante salta 2 y el rey solitario pierde.',
    },
    grant_acedrex: {
        title: 'Grande Acedrex',
        origin: 'Siglo XIII • Castilla (Alfonso X)',
        tag: 'Tablero 12x12',
        desc: 'El gran ajedrez real de Alfonso X el Sabio con Aancas, Unicornios, Leones, Jirafas y Cocodrilos.',
    },
    tamerlane: {
        title: 'Ajedrez de Tamerlán',
        origin: 'Siglo XIV • Imperio Timúrida',
        tag: '112 Casillas',
        desc: 'El ajedrez colosal de Tamerlán con Jirafas, Camellos, Máquinas de Guerra, 11 peones únicos y Ciudadelas reales.',
    },
};

export const variantCodex_es: Record<string, VariantCodexI18n> = {
    classic: {
        name: 'Ajedrez Clásico',
        rules: {
            intro: 'La partida se juega en un tablero ajedrezado de 8x8 casillas. Las blancas mueven primero. El objetivo es dar jaque mate al rey rival. La partida también puede terminar en tablas por ahogado, triple repetición, regla de las 50 jugadas o material insuficiente.',
            bullets: [
                {
                    title: 'El Rey:',
                    desc: 'Mueve una casilla en cualquier dirección. Puede realizar el movimiento especial de "enroque" junto a una torre para asegurar su posición y conectar las torres.',
                    pieceName: 'King',
                },
                {
                    title: 'La Dama (Reina):',
                    desc: 'La pieza más poderosa del tablero. Mueve en horizontal, vertical o diagonal a lo largo de cualquier número de casillas libres.',
                    pieceName: 'Queen',
                },
                {
                    title: 'La Torre:',
                    desc: 'Mueve en horizontal o vertical tantas casillas libres como desee. También interviene en el enroque del rey.',
                    pieceName: 'Rook',
                },
                {
                    title: 'El Alfil:',
                    desc: 'Mueve en diagonal a través de cualquier número de casillas desocupadas. Un alfil siempre permanece en casillas de su color inicial (claras u oscuras).',
                    pieceName: 'Bishop',
                },
                {
                    title: 'El Caballo:',
                    desc: 'Mueve en forma de "L" (dos casillas en una dirección y una en perpendicular). Es la única pieza capaz de saltar por encima de otras piezas.',
                    pieceName: 'Knight',
                },
                {
                    title: 'El Peón:',
                    desc: 'Avanza una casilla hacia adelante pero captura en diagonal. En su primer movimiento puede avanzar dos casillas, capturar "al paso" y se corona al alcanzar el extremo opuesto del tablero.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Jaque y Jaque Mate:',
                    desc: 'Cuando un rey es atacado, está en "jaque" y debe escapar de la amenaza. Si no existe ningún movimiento legal para salvar al rey, se produce "jaque mate" y la partida concluye de inmediato.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo estratégico: Intenta controlar el centro del tablero desde la apertura. Desarrollar tus caballos y alfiles hacia el centro maximizará tu capacidad táctica y ofensiva.',
        },
        history: {
            intro: 'El ajedrez se originó en la India como Chaturanga antes del siglo VII, expandiéndose a Persia y el mundo árabe antes de adoptar su forma moderna en Europa.',
            leftBoxTitle: 'La Evolución Europea',
            leftBoxDesc: 'Al llegar a Europa hacia el siglo IX, las piezas se adaptaron a la sociedad medieval, transformándose en los caballos, alfiles y monarcas que conocemos hoy en día.',
            rightBoxTitle: 'La Dama Poderosa',
            rightBoxDesc: 'A finales del siglo XV en España, el juego se aceleró drásticamente cuando la reina y el alfil adquirieron su alcance moderno de largo recorrido, convirtiendo una batalla pausada en un juego sumamente dinámico.',
        },
    },
    chaturanga: {
        name: 'Chaturanga',
        rules: {
            intro: 'Se juega en un tablero de 8x8 sin casillas alternadas y con marcas especiales (Ashtāpada). Las blancas mueven primero. El objetivo es dar jaque mate al Raja (rey) oponente o dejarlo como "rey solitario" (sin más piezas), aunque si en el turno siguiente el rival también deja solo al otro rey, la partida es tablas.',
            bullets: [
                {
                    title: 'Raja (Rey):',
                    desc: 'Mueve exactamente como un rey moderno, pero no existe el enroque para protegerlo.',
                    pieceName: 'Raja',
                },
                {
                    title: 'Mantri (Consejero / Ministro):',
                    desc: 'Mueve exactamente un paso en diagonal en cualquier dirección.',
                    pieceName: 'Mantri',
                },
                {
                    title: 'Ratha (Carro de Guerra):',
                    desc: 'Mueve igual que una torre moderna: horizontal o verticalmente a través de cualquier número de casillas libres, sin posibilidad de enroque.',
                    pieceName: 'Ratha',
                },
                {
                    title: 'Gaja (Elefante):',
                    desc: 'Salta exactamente dos casillas en diagonal, superando cualquier pieza que se interponga en el camino.',
                    pieceName: 'Gaja',
                },
                {
                    title: 'Ashva (Caballo):',
                    desc: 'Mueve igual que el caballo del ajedrez moderno (salto en forma de "L").',
                    pieceName: 'Asva',
                },
                {
                    title: 'Padati (Infantería / Peón):',
                    desc: 'Avanza un paso hacia adelante y captura en diagonal, sin opción de doble avance inicial ni captura al paso.',
                    pieceName: 'Padati',
                },
                {
                    title: 'Marcas del Ashtāpada:',
                    desc: 'El tablero presenta marcas especiales en cruz. Estas marcas tradicionales coinciden con las casillas a las que ningún Gaja puede llegar debido a su patrón de salto de 2 casillas diagonales.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo estratégico: El Mantri es una pieza débil al mover solo una casilla en diagonal. Mantenlo cerca de tu Raja para labores defensivas y apóyate en tus Rathas (carros) para el ataque.',
        },
        history: {
            intro: 'El Chaturanga es un antiguo juego de estrategia considerado apliamente el ancestro directo más temprano del ajedrez moderno y de toda su familia de variantes globales.',
            leftBoxTitle: 'Orígenes y las "Cuatro Divisiones"',
            leftBoxDesc: 'Nació en el norte de la India durante el Imperio Gupta (hacia el siglo VI d.C.). El término en sánscrito "Chaturanga" significa "cuatro divisiones militares": infantería, caballería, elefantes y carros de combate.',
            rightBoxTitle: 'Expansión Global',
            rightBoxDesc: 'A través de la Ruta de la Seda, el juego viajó al oeste hacia Persia (transformándose en Shatranj) y al este hacia Asia, dando origen a variantes como el Xiangqi (China), Shogi (Japón) y Makruk (Tailandia).',
        },
    },
    shatranj: {
        name: 'Shatranj',
        rules: {
            intro: 'Se juega en un tablero de 8x8 casillas sin alternancia de color. Las blancas mueven primero. El objetivo en Shatranj es dar jaque mate al Shah (rey) rival o despojarlo de todo su ejército ("rey solitario"). A diferencia del ajedrez moderno, ahogar al rival también otorga la victoria.',
            bullets: [
                {
                    title: 'Shah (Rey):',
                    desc: 'Mueve como un rey moderno, pero sin posibilidad de enroque.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Ferz (Consejero / Visir):',
                    desc: 'Mueve exactamente una casilla en diagonal en cualquier dirección.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Rukh (Carro / Torre):',
                    desc: 'Mueve igual que una torre moderna: horizontal o verticalmente a través de casillas libres.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl / Alfil (Elefante):',
                    desc: 'Salta exactamente dos casillas en diagonal, sobrevolando cualquier pieza intermedia.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Asb / Faras (Caballo):',
                    desc: 'Mueve exactamente igual que el caballo del ajedrez moderno.',
                    pieceName: 'Asb',
                },
                {
                    title: 'Sarbaz / Baydaq (Peón):',
                    desc: 'Avanza y captura como un peón moderno, pero sin doble paso inicial. Al alcanzar la octava fila, promociona automáticamente a Ferz.',
                    pieceName: 'Sarbaz',
                },
            ],
            proTip: 'Consejo estratégico: Dado que el Ferz y el Pīl son piezas de corto alcance, el Shatranj es un juego más posicional y pausado. Céntrate en abrir columnas para tus Rukh (torres), que son las piezas más letales.',
        },
        history: {
            intro: 'El Shatranj es la evolución persa y árabe del Chaturanga indio. Fue la forma estándar de ajedrez jugada en Oriente Medio, el norte de África y Europa durante casi un milenio.',
            leftBoxTitle: 'La Edad de Oro Islámica',
            leftBoxDesc: 'Tras la conquista islámica de Persia en el siglo VII, los maestros árabes formalizaron las reglas, crearon la primera notación y diseñaron célebres problemas tácticos llamados "mansubat".',
            rightBoxTitle: 'Llegada a Europa',
            rightBoxDesc: 'El Shatranj entró a Europa a través de Al-Ándalus (Península Ibérica) y las rutas comerciales bizantinas e italianas, permaneciendo prácticamente inalterado hasta finales del siglo XV en España, cuando el Ferz y el Pīl fueron sustituidos por la moderna Dama y el Alfil.',
        },
    },
    grant_acedrex: {
        name: 'Gran Acedrex',
        rules: {
            intro: 'El Gran Acedrex es una magna variante medieval española jugada en un tablero de 12x12 casillas (144 casillas). Documentada por el rey Alfonso X el Sabio en el Libro de los Juegos (1283), presenta fabulosas bestias mitológicas y exóticas, filas avanzadas de peones y movimientos compuestos únicos.',
            bullets: [
                {
                    title: 'El Rey:',
                    desc: 'Mueve una casilla en cualquier dirección. En su primer movimiento puede saltar 2 casillas en cualquier dirección, incluso sobrevolando piezas intermedias.',
                    pieceName: 'King',
                },
                {
                    title: 'El Aanca (Ave mitológica colosal):',
                    desc: 'La pieza más temible del tablero. Da un paso en diagonal y, si la casilla está libre, continúa desplazándose en línea recta como una Torre cualquier número de casillas.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'El Unicornio (Rinoceronte):',
                    desc: 'Salta como un Caballo en su primer paso; si esa casilla está vacía, puede continuar deslizándose en diagonal como un Alfil en la dirección exterior del salto.',
                    pieceName: 'Unicorn',
                },
                {
                    title: 'La Torre (Roque):',
                    desc: 'Se desplaza en línea recta (horizontal o vertical) tantas casillas libres como desee, idéntica al ajedrez moderno.',
                    pieceName: 'Rook',
                },
                {
                    title: 'El Cocodrilo:',
                    desc: 'Se desplaza en diagonal cualquier número de casillas libres, moviendo exactamente como un Alfil moderno.',
                    pieceName: 'Crocodile',
                },
                {
                    title: 'El León:',
                    desc: 'Mueve 3 casillas ortogonales o salta al extremo opuesto de un rectángulo de 2x4 (2 ortogonales + 1 diagonal), saltando casillas ocupadas.',
                    pieceName: 'Lion',
                },
                {
                    title: 'La Jirafa:',
                    desc: 'Salta al extremo opuesto de un rectángulo de 3x4 (1 ortogonal + 2 diagonales), saltando por encima de cualquier pieza.',
                    pieceName: 'Giraffe',
                },
                {
                    title: 'Los Peones y el Doble Paso Inicial:',
                    desc: 'Los peones blancos comienzan en la 4ª fila y los negros en la 9ª. Pueden avanzar dos casillas en su primer movimiento, pero este beneficio expira para ambos bandos tras la primera captura de peón de la partida.',
                    pieceName: 'Grantpawn',
                },
                {
                    title: 'Promoción y Victoria:',
                    desc: 'Los peones coronan en la fila 12 a la pieza originaria de su columna (columnas de Rey y Aanca coronan a Aanca). Se gana por Jaque Mate, Ahogado (el jugador ahogado pierde) o Rey Solitario.',
                    pieceName: 'Aanca',
                },
                {
                    title: 'Variante con Dado de 8 Caras (Regla de Alfonso X):',
                    desc: 'Para acelerar las partidas en un tablero tan grande, Alfonso X ideó dados de 8 caras: 8 = Rey, 7 = Aanca, 6 = Unicornio, 5 = Torre, 4 = León, 3 = Cocodrilo, 2 = Jirafa, 1 = Peón. En este modo tradicional, se tira el dado y es obligatorio mover una pieza de ese valor.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Consejo estratégico: ¡Aprovecha el salto de apertura de 2 casillas de tu Rey para activarlo rápidamente y recuerda que el doble paso de los peones se cancela tras la primera captura de peón!',
        },
        history: {
            intro: 'El Gran Acedrex fue encargado en 1283 por el rey Alfonso X "El Sabio" de Castilla y León como parte del célebre Libro de los Juegos, custodiado en el Monasterio de El Escorial.',
            leftBoxTitle: 'La Sabiduría de Alfonso X',
            leftBoxDesc: 'Alfonso X concibió los juegos de mesa como un diálogo filosófico entre el intelecto y el azar, vinculándolos con la astronomía y la naturaleza humana sin prejuicios moralistas.',
            rightBoxTitle: 'La Gran Evolución',
            rightBoxDesc: 'El Gran Acedrex amplió el tablero a un formato colosal de 12x12. Piezas como el Cocodrilo introdujeron los movimientos diagonales largos dos siglos antes de que los cambios en los movimientos de la reina y el alfil se consolidaran en Europa Occidental.',
        },
    },
    tamerlane: {
        name: 'Ajedrez de Tamerlán',
        rules: {
            intro: 'Jugado en un inmenso tablero de 11x10 con dos casillas salientes adicionales llamadas ciudadelas (112 casillas en total). Mueven primero las blancas. El objetivo es dar jaque mate al Shah rival. Existen condiciones especiales de sucesión real y victoria por infiltración.',
            bullets: [
                {
                    title: 'Shah (Rey):',
                    desc: 'Mueve como un rey normal. Una vez por partida, bajo amenaza, puede intercambiar su posición con cualquier pieza aliada. Si el Shah es capturado habiendo un Príncipe o Shah Advenedizo, este es coronado como nuevo Shah.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Shahzada (Príncipe):',
                    desc: 'Se crea al coronar el Peón de Reyes. Mueve como un rey y lleva el distintivo "P".',
                    pieceName: 'Shahzada',
                },
                {
                    title: 'Shah Advenedizo (Rey Advenedizo):',
                    desc: 'Se crea tras el viaje de 3 fases del Peón de Peones. Lleva el distintivo "A" y mueve como un rey. Puede entrar en su propia ciudadela volviéndose invulnerable o asumir el trono si cae el Shah.',
                    pieceName: 'AdventitiousShah',
                },
                {
                    title: 'Ferz (Consejero):',
                    desc: 'Mueve exactamente un paso en diagonal en cualquier dirección.',
                    pieceName: 'Ferz',
                },
                {
                    title: 'Wazir (Visir / Gobernador):',
                    desc: 'Mueve exactamente un paso en vertical u horizontal en cualquier dirección.',
                    pieceName: 'Wazir',
                },
                {
                    title: 'Zurafa (Jirafa):',
                    desc: 'Mueve un paso en diagonal y continúa deslizándose en línea recta como una torre un mínimo de tres casillas.',
                    pieceName: 'Zurafa',
                },
                {
                    title: 'Talia (Explorador / Piquete):',
                    desc: 'Desliza en diagonal como un alfil, pero debe recorrer un mínimo de dos casillas sin poder saltar la casilla adyacente.',
                    pieceName: 'Talia',
                },
                {
                    title: 'Faras / Asb (Caballo):',
                    desc: 'Mueve igual que el caballo del ajedrez tradicional (salto en "L").',
                    pieceName: 'Asb',
                },
                {
                    title: 'Rukh (Carro / Torre):',
                    desc: 'Mueve igual que una torre moderna en horizontal o vertical.',
                    pieceName: 'Rukh',
                },
                {
                    title: 'Pīl (Elefante):',
                    desc: 'Salta exactamente dos casillas en diagonal, sobrevolando cualquier pieza.',
                    pieceName: 'Pil',
                },
                {
                    title: 'Jamal (Camello):',
                    desc: 'Salta en forma de "L" alargada (1 diagonal + 2 rectas, o 3x1), sobrevolando piezas.',
                    pieceName: 'Jamal',
                },
                {
                    title: 'Dabbaba (Máquina de Guerra):',
                    desc: 'Salta exactamente dos casillas en vertical u horizontal, sobrevolando piezas intermedias.',
                    pieceName: 'Dabbaba',
                },
                {
                    title: 'Los 11 Peones y sus Promociones:',
                    desc: 'Avanzan 1 casilla y capturan en diagonal sin doble paso. Cada pieza del ejército tiene su propio peón, el cual promociona a su pieza correspondiente al alcanzar la última fila.',
                    pieceName: 'Sarbaz',
                },
                {
                    title: 'Ciclo del Peón de Peones:',
                    desc: 'Realiza un viaje único en 3 etapas: (1) En su primera coronación, puede recolocarse para atacar en bifurcación o a piezas atrapadas. (2) En la segunda, se teletransporta a la casilla de inicio del Peón de Rey. (3) En la tercera, se transforma en Shah Advenedizo.',
                    pieceName: 'Shah',
                },
                {
                    title: 'Las Ciudadelas e Infiltración Real:',
                    desc: 'Dos casillas salientes del tablero. Solo el miembro de mayor rango de la realeza puede entrar a la ciudadela enemiga para intercambiarse con un heredero o reclamar tablas.',
                    iconType: 'citadel',
                },
            ],
            proTip: 'Consejo estratégico: Protege a tu Peón de Peones y coordina tus saltadores exóticos (Camello y Dabbaba) con tus piezas de largo alcance. Si estás en desventaja, ¡intenta infiltrar tu Shah en la ciudadela rival!',
        },
        history: {
            intro: 'El ajedrez de Tamerlán es un titán estratégico concebido en el siglo XIV durante el reinado de Timur (Tamerlán), el conquistador turcomongol. Es la más famosa de las variantes de "Gran Ajedrez" (Shatranj Kamil).',
            leftBoxTitle: 'El Juego de un Conquistador',
            leftBoxDesc: 'El propio Timur era un apasionado del ajedrez y prefería los tableros gigantescos al tradicional 8x8. Convocaba a los mejores ajedrecistas a su corte en Samarcanda, como el célebre Ali ash-Shatranji.',
            rightBoxTitle: 'Mitos y Leyendas',
            rightBoxDesc: 'Manuscritos persas atribuyen el origen de estas complejas variantes a leyendas antiguas, afirmando que Hermes obsequió tableros colosales de ajedrez táctico a Alejandro Magno.',
        },
    },
};
