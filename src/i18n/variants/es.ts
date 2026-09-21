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
    courier: {
        title: 'Ajedrez del Mensajero',
        origin: 'Siglo XII • Alemania',
        tag: 'Tablero 12x8',
        desc: 'La obra maestra medieval alemana con Mensajeros, el Sabio, el Schleich y un tablero de 12x8.',
    },
    grant_acedrex: {
        title: 'Grande Acedrex',
        origin: 'Siglo XIII • Castilla (Alfonso X)',
        tag: 'Tablero 12x12',
        desc: 'El gran ajedrez real de Alfonso X el Sabio con Aancas, Unicornios, Leones, Jirafas y Cocodrilos.',
    },
    four_seasons: {
        title: 'Ajedrez de las Cuatro Estaciones',
        origin: 'Siglo XIII • Castilla (Alfonso X)',
        tag: '4 Jugadores',
        desc: 'La obra maestra medieval para 4 jugadores del rey Alfonso X el Sabio, que representa las estaciones, humores corporales y elementos en un tablero de 8x8.',
    },
    tamerlane: {
        title: 'Ajedrez de Tamerlán',
        origin: 'Siglo XIV • Imperio Timúrida',
        tag: '112 Casillas',
        desc: 'El ajedrez colosal de Tamerlán con Jirafas, Camellos, Máquinas de Guerra, 11 peones únicos y Ciudadelas reales.',
    },
    chaturaji: {
        title: 'Chaturaji',
        origin: 'Siglos X–XI • India',
        tag: '4 Jugadores',
        desc: 'El Chaturanga para 4 jugadores (conocido popularmente como Chaturaji) en un tablero Ashtāpada de 8x8 con Triunfo del Barco, tronos, promociones y apuestas.',
    },
    xiangqi: {
        title: 'Xiangqi',
        origin: 'Dinastía Song del Sur • China',
        tag: 'Tablero 9x10',
        desc: 'Juego de tablero de estrategia para dos jugadores que representa una batalla entre dos ejércitos, jugado sobre las intersecciones de una cuadrícula de 9x10 con Cañones, el Río y el Palacio.',
    },
    janggi: {
        title: 'Janggi',
        origin: 'Península de Corea',
        tag: 'Tablero 9x10',
        desc: 'Juego de estrategia coreano derivado del xiangqi, jugado en las 90 intersecciones de un tablero de 9×10 sin río. Destaca por sus formaciones iniciales configurables, cañones saltadores, elefantes de largo alcance y diagonales de palacio.',
    },
    makruk: {
        title: 'Makruk',
        origin: 'Tailandia',
        tag: 'Tablero 8x8',
        desc: 'Ajedrez tradicional tailandés descendiente del chaturanga, con Señores, Semillas, Nobles y reglas de conteo únicas para reyes en fuga.',
    },
    ouk_chaktrang: {
        title: 'Ouk Chaktrang',
        origin: 'Camboya',
        tag: 'Tablero 8x8',
        desc: 'Ajedrez tradicional camboyano emparentado con el makruk, caracterizado por opciones de apertura dinámicas para el señor y la semilla antes de que se produzca la primera captura.',
    },
    sittuyin: {
        title: 'Sittuyin',
        origin: 'Myanmar (Birmania)',
        tag: 'Tablero 8x8',
        desc: 'Ajedrez tradicional birmano con tablero marcado con las diagonales Sit-ke-min, peones escalonados y posiciones iniciales de las piezas variables y personalizables.',
    },
    shogi: {
        title: 'Shogi',
        origin: 'Período Heian • Japón',
        tag: 'Tablero 9x9',
        desc: 'El ajedrez tradicional japonés. Destaca por su sistema de reintroducción de piezas capturadas (drops), promociones en territorio enemigo y batallas tácticas de máxima profundidad.',
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
    courier: {
        name: 'Ajedrez del Mensajero',
        rules: {
            intro: 'La partida se juega en un tablero de 12x8 casillas (96 casillas). Las blancas mueven primero. El objetivo es dar jaque mate al Rey rival. Esta variante es célebre por introducir el Correo (que mueve como el alfil moderno), junto a otras piezas como el Sabio y el Schleich.',
            bullets: [
                {
                    title: 'Rey:',
                    desc: 'Mueve una casilla en cualquier dirección. No existe el enroque.',
                    pieceName: 'King',
                },
                {
                    title: 'Mensajero:',
                    desc: 'Mueve en diagonal cualquier número de casillas libres, exactamente como el alfil moderno.',
                    pieceName: 'Courier',
                },
                {
                    title: 'Alfil:',
                    desc: 'Salta exactamente dos casillas en diagonal, saltando por encima de piezas intermedias, como el antiguo Alfil.',
                    pieceName: 'Bishop',
                },
                {
                    title: 'Reina:',
                    desc: 'Mueve exactamente una casilla en diagonal en cualquier dirección.',
                    pieceName: 'Queen',
                },
                {
                    title: 'Schleich (Bufón / Loco):',
                    desc: 'Mueve exactamente una casilla en ortogonal (adelante, atrás, izquierda, derecha).',
                    pieceName: 'Schleich',
                },
                {
                    title: 'Sabio / Hombre:',
                    desc: 'Mueve una casilla en cualquier dirección como un rey, pero es una pieza ordinaria que puede ser capturada.',
                    pieceName: 'Sage',
                },
                {
                    title: 'Caballo y Torre:',
                    desc: 'Mueven exactamente como en el ajedrez moderno. El Caballo salta en "L" y la Torre se desplaza en horizontal o vertical.',
                    pieceName: 'Knight',
                },
                {
                    title: 'Peones y Coronación:',
                    desc: 'Los peones avanzan una casilla y capturan en diagonal. No tienen doble paso inicial ni captura al paso. Al alcanzar la última fila, un peón corona a Reina.',
                    pieceName: 'Pawn',
                },
                {
                    title: 'Final y Tablas:',
                    desc: 'El jaque mate gana la partida. Los registros históricos son ambiguos sobre las reglas de rey ahogado; bajo el estándar del juego, el ahogado resulta en tablas.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo estratégico: Los Correos dominan extensos pasillos diagonales en el amplio tablero de 12x8. ¡Coordínalos con las Torres para generar peligro!',
        },
        history: {
            intro: 'El Ajedrez del Mensajero (Kurierschach) nació en la Alemania del siglo XII y floreció durante más de seis siglos, especialmente en la villa ajedrecística de Ströbeck cerca de los montes Harz.',
            leftBoxTitle: 'Tradición local y mecenazgo real',
            leftBoxDesc: 'El Ajedrez del Mensajero sobrevivió hasta bien entrado el siglo XIX como tradición local en la villa alemana de Ströbeck, célebremente documentado por Gustavus Selenus en 1616. En 1651, Federico Guillermo, elector de Brandeburgo y duque de Prusia, obsequió a la villa un tablero personalizado y juegos de piezas de plata en honor al juego.',
            rightBoxTitle: 'El cuadro de Lucas van Leyden',
            rightBoxDesc: 'Inmortalizado en 1508 por Lucas van Leyden en su célebre pintura "Los jugadores de ajedrez", que retrata a una mujer jugando al Ajedrez de los Correos contra un hombre ante varios espectadores.',
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
    chaturaji: {
        name: 'Chaturaji (Chaturanga para 4 jugadores)',
        rules: {
            intro: 'El Chaturaji (nombre con el que se conoce comúnmente, aunque de forma históricamente inexacta, al Chaturanga para 4 jugadores) se juega en un tablero de 8x8 sin casillas ajedrezadas entre 4 jugadores: Rojas (Este), Verdes (Sur), Amarillas (Oeste) y Azules (Norte), en turnos en sentido horario. Los jugadores enfrentados (Rojas y Amarillas, Verdes y Azules) son aliados militares, pero cada jugador puntúa apuestas individualmente. Existen diversas variantes y reconstrucciones históricas en manuscritos indios y persas; AtlasChess implementa el conjunto de reglas recopilado y documentado por chessvariants.com (a excepción de la regla exclusiva para apuestas de dinero).',
            bullets: [
                {
                    title: 'El Rey:',
                    desc: 'Mueve una casilla en cualquier dirección. No existe el concepto de jaque ni de jaque mate; los reyes pueden ser capturados directamente como cualquier pieza normal. Cuando un jugador pierde su Rey, pierde su turno y queda inactivo a menos que su aliado lo rescate.',
                    pieceName: 'ChaturajiKing',
                },
                {
                    title: 'El Elefante:',
                    desc: 'Mueve horizontal o verticalmente a través de cualquier número de casillas desocupadas, exactamente igual que la Torre moderna.',
                    pieceName: 'ChaturajiElephant',
                },
                {
                    title: 'El Caballo:',
                    desc: 'Mueve en forma de "L" (dos casillas en una dirección y una en perpendicular), saltando sobre piezas intermedias, idéntico al Caballo moderno.',
                    pieceName: 'ChaturajiHorse',
                },
                {
                    title: 'El Barco:',
                    desc: 'Salta exactamente dos casillas en diagonal, sobrevolando cualquier pieza intermedia. ¡Triunfo del Barco (Vrihannauka)!: Si un Barco se mueve y completa un cuadrado de 2x2 compuesto por los cuatro barcos presentes en el tablero, ¡el barco que mueve captura instantáneamente a los otros tres barcos a la vez!',
                    pieceName: 'ChaturajiBoat',
                },
                {
                    title: 'El Peón:',
                    desc: 'Avanza 1 casilla hacia adelante en la dirección de marcha de su ejército y captura 1 casilla en diagonal hacia adelante (sin avance doble inicial). Al alcanzar la fila final opuesta, puede coronar en la pieza original de esa columna (Esquina = Barco, Columna de Caballo = Caballo, Columna de Elefante = Elefante, Columna de Rey = Rey). Sin embargo, la coronación solo se permite si al jugador le quedan 2 o menos peones; si aún tiene 3 o 4 peones, permanece congelado en la última fila hasta que se pierdan peones aliados.',
                    pieceName: 'ChaturajiPawn',
                },
                {
                    title: 'Tronos (Sinhasana):',
                    desc: 'Un Rey que entre en la casilla de trono inicial de un oponente gana 1 apuesta (2 apuestas si captura al rey rival en dicho trono). Un Rey que entre en el trono inicial de su aliado toma el mando supremo de todo el ejército aliado, controlando ambas fuerzas en su turno (y gana 2 apuestas si captura al rey aliado allí).',
                },
                {
                    title: 'Rescate de Reyes:',
                    desc: 'Si un jugador captura a un rey enemigo mientras el rey de su aliado ha caído (y no ha sido rescatado previamente), puede optar por rescatar al rey de su compañero y colocarlo inmediatamente en cualquier casilla vacía del tablero.',
                },
                {
                    title: 'El Dado (d4):',
                    desc: 'Al jugar con la regla tradicional de dados, se tira un dado para determinar qué pieza puede mover: 1 = Peón o Rey, 2 = Barco, 3 = Caballo, 4 = Elefante. Si se juega sin dados, el jugador elige libremente cualquier movimiento legal.',
                    iconType: 'dices',
                },
                {
                    title: 'Rey Solitario y Victoria:',
                    desc: 'Si cualquier jugador queda reducido únicamente a su Rey sin otras piezas, la partida finaliza inmediatamente en Tablas. El último Rey superviviente gana 1 apuesta (2 si dicho Rey capturó personalmente a los 3 reyes rivales, 4 si fue en sus respectivos tronos). La partida global la gana el jugador que haya acumulado el mayor número de apuestas.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo estratégico: Vigila las agrupaciones de barcos para desatar el demoledor Triunfo del Barco (Vrihannauka). Si tu aliado cae, ¡invade su trono para comandar su ejército o captura a un rey enemigo para efectuar un Rescate de Rey!',
        },
        history: {
            intro: 'El juego para cuatro participantes conocido hoy como Chaturaji se llamaba realmente Chaturanga (en sánscrito, "cuatro divisiones del ejército"). Aunque en la literatura moderna tardía se le denominó Chaturaji ("Cuatro Reyes"), las fuentes históricas confirman que era una modalidad para cuatro jugadores del Chaturanga original.',
            leftBoxTitle: 'Al-Biruni y los Manuscritos Indios',
            leftBoxDesc: 'El primer testimonio detallado fue documentado hacia 1030 d.C. por el polímata persa Al-Biruni en su Kitab al-Hind (Libro de la India). Posteriormente apareció en textos sánscritos como el Tithitattva de Raghunandana (siglos XV-XVI), describiendo cuatro ejércitos (Rojo, Verde, Amarillo, Azul) que disputaban apuestas en el tablero Ashtāpada de 8x8 con dados.',
            rightBoxTitle: 'La Refutada Teoría de Cox-Forbes',
            rightBoxDesc: 'En el siglo XIX, Hiram Cox y Duncan Forbes formularon la célebre teoría de que el ajedrez con dados para 4 jugadores era el ancestro primigenio de todos los ajedreces. En 1913, el historiador H.J.R. Murray e investigadores modernos como Jean-Louis Cazaux refutaron totalmente esta hipótesis, demostrando que el Chaturanga para 2 jugadores nació primero (c. siglo VI) y la versión para 4 jugadores surgió más tarde (siglos X-XI).',
        },
    },
    four_seasons: {
        name: 'Ajedrez de las Cuatro Estaciones (Acedrex de los cuatro tiempos)',
        rules: {
            intro: 'El Ajedrez de las Cuatro Estaciones se juega en un tablero de 8x8 casillas por 4 jugadores: Verde (Primavera), Rojo (Verano), Negro (Otoño) y Blanco (Invierno). El turno rota en sentido antihorario (Verde → Rojo → Negro → Blanco). Es un juego de todos contra todos. Al dar jaque mate a un Rey rival, su ejército completo es anexionado por el vencedor. ¡El último jugador en pie gana la partida!',
            bullets: [
                {
                    title: 'El Rey:',
                    desc: 'Mueve una casilla en cualquier dirección (ortogonal o diagonal). Si un Rey recibe jaque mate, es retirado del tablero y el jugador que propinó el mate toma el control total de todas las piezas supervivientes de ese ejército.',
                    pieceName: 'FourSeasonsKing',
                },
                {
                    title: 'El General:',
                    desc: 'Mueve exactamente una casilla en diagonal en cualquier dirección.',
                    pieceName: 'FourSeasonsGeneral',
                },
                {
                    title: 'La Torre:',
                    desc: 'Mueve horizontal o verticalmente a través de cualquier número de casillas desocupadas, idéntica a la Torre moderna.',
                    pieceName: 'FourSeasonsRook',
                },
                {
                    title: 'El Caballo:',
                    desc: 'Mueve en forma de "L" (dos casillas en una dirección y una en perpendicular), saltando sobre cualquier pieza intermedia.',
                    pieceName: 'FourSeasonsKnight',
                },
                {
                    title: 'El Alfil:',
                    desc: 'Salta exactamente dos casillas en diagonal, sobrevolando cualquier pieza intermedia en la casilla de salto.',
                    pieceName: 'FourSeasonsBishop',
                },
                {
                    title: 'El Peón:',
                    desc: 'Avanza una casilla a lo largo de la trayectoria asignada a su cuadrante y captura una casilla en diagonal hacia adelante. Al alcanzar el borde final correspondiente al final de su marcha, corona inmediatamente en un General.',
                    pieceName: 'FourSeasonsPawn',
                },
                {
                    title: 'Jaque Mate y Anexión de Ejércitos:',
                    desc: '¡Al dar jaque mate al Rey de un oponente, su Rey queda eliminado y heredas la totalidad de su ejército superviviente, pudiendo mover sus piezas en tus turnos!',
                    iconType: 'check',
                },
                {
                    title: 'Ahogado:',
                    desc: 'Si un jugador no tiene movimientos legales en su turno y su rey no está en jaque, queda ahogado. Todas las piezas del jugador ahogado son retiradas del tablero.',
                },
                {
                    title: 'El Dado de 6 Caras (d6):',
                    desc: 'Al jugar con la regla histórica de dados, se tira un d6 en cada turno: 1 = Peón, 2 = Alfil, 3 = Caballo, 4 = Torre, 5 = General, 6 = Rey. Si la pieza obtenida no tiene movimientos legales, se pierde el turno.',
                    iconType: 'dices',
                },
            ],
            proTip: 'Consejo estratégico: ¡Concentra tus ataques en los Reyes vulnerables para darles mate y anexionar sus ejércitos! Comandar múltiples ejércitos te dará una superioridad numérica arrolladora.',
        },
        history: {
            intro: 'Documentado en 1283 en el "Libro de los Juegos" (fol. 88v) mandado realizar por el rey Alfonso X el Sabio de Castilla bajo el título "Acedrex de los Quatro Tiempos". A diferencia del Chaturaji indio donde se jugaba por parejas aliadas, aquí es un todos contra todos individual entre cuatro participantes, probablemente inspirado por influencias orientales como las descripciones de Al-Biruni en 1030.',
            leftBoxTitle: 'Las Cuatro Estaciones, Elementos y Humores',
            leftBoxDesc: 'Cada bando encarna una estación, elemento y humor corporal: Verde representa la Primavera, el Aire y la Sangre; Rojo el Verano, el Fuego y la Cólera; Negro el Otoño, la Tierra y la Melancolía; y Blanco el Invierno, el Agua y la Flema. El juego inicia con el Verde y progresa en el orden natural de las estaciones.',
            rightBoxTitle: 'El Tablero y el Juego "El Mundo"',
            rightBoxDesc: 'Se disputa en un tablero de 8x8 con las piezas situadas en las cuatro esquinas (permitiendo choques frontales) y diagonales centrales en forma de "X" que servían de guía visual para el avance de los peones. El manuscrito asocia además esta variante a un juego de tablas circular para 4 jugadores llamado "El Mundo" con los mismos cuatro colores.',
        },
    },
    xiangqi: {
        name: 'Xiangqi',
        rules: {
            intro: 'El Xiangqi se juega en un tablero de nueve líneas de ancho por diez de largo, donde las piezas se sitúan en las intersecciones (puntos). Dividiendo los dos bandos opuestos entre las filas quinta y sexta se encuentra el Río. Dos zonas de 3x3 delimitadas por líneas diagonales forman el Palacio. Las rojas mueven primero. El objetivo principal es dar jaque mate o ahogar al general enemigo.',
            bullets: [
                {
                    title: 'El General (Rey):',
                    desc: 'Mueve y captura un punto ortogonalmente y no puede salir del Palacio. Los dos generales opuestos no pueden quedar enfrentados directamente a lo largo de una columna abierta sin piezas intermedias (regla del general volador).',
                    pieceName: 'XiangqiGeneral',
                },
                {
                    title: 'El Consejero (Guardia / Oficial):',
                    desc: 'Mueve y captura un punto diagonalmente y no puede salir del Palacio.',
                    pieceName: 'XiangqiAdvisor',
                },
                {
                    title: 'El Elefante (Ministro):',
                    desc: 'Mueve y captura exactamente dos puntos en diagonal y no puede saltar por encima de una pieza intermedia (bloqueo del ojo del elefante). Los elefantes no pueden cruzar el Río.',
                    pieceName: 'XiangqiElephant',
                },
                {
                    title: 'El Caballo (Caballero):',
                    desc: 'Mueve un punto ortogonal seguido de un punto diagonal hacia afuera. No salta: si el punto adyacente en la dirección ortogonal está ocupado, el caballo queda bloqueado (bloqueo de la pata del caballo).',
                    pieceName: 'XiangqiHorse',
                },
                {
                    title: 'El Carro (Torre):',
                    desc: 'Mueve y captura cualquier distancia a lo largo de líneas rectas ortogonales a través de puntos desocupados.',
                    pieceName: 'XiangqiChariot',
                },
                {
                    title: 'El Cañón:',
                    desc: 'Mueve como un carro a través de puntos desocupados. Para capturar, debe saltar sobre exactamente una pieza intermedia (la pantalla o plataforma) de cualquier color.',
                    pieceName: 'XiangqiCannon',
                },
                {
                    title: 'El Soldado (Peón):',
                    desc: 'Mueve y captura un punto hacia adelante. Tras cruzar el Río, también puede mover y capturar un punto horizontalmente (izquierda o derecha). No puede retroceder y no promociona.',
                    pieceName: 'XiangqiSoldier',
                },
                {
                    title: 'Regla del General Volador:',
                    desc: 'Los dos generales no pueden quedar enfrentados en la misma columna abierta sin piezas intermedias. Un movimiento que exponga a los dos generales directamente entre sí es ilegal.',
                    iconType: 'check',
                },
                {
                    title: 'Victoria y Ahogado:',
                    desc: 'Un jugador gana dando jaque mate o ahogando al general contrario (dejando al oponente sin movimientos legales).',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo pro: Desarrolla tus carros rápidamente, controla columnas abiertas y coordina los cañones con pantallas evitando que los caballos queden bloqueados.',
        },
        history: {
            intro: 'Un juego llamado xiangqi fue mencionado en el texto del siglo I a.C. Shuo Yuan remontándose al período de los Reinos Combatientes, y el emperador Wu de Zhou del Norte describió el juego xiangxi en el año 569 d.C. La descripción más temprana de las reglas del juego actual aparece en el relato "Cén Shùn" en la colección Xuanguai lu, escrita por Niu Sengru durante la dinastía Tang. El juego tiene su forma moderna desde la dinastía Song del Sur.',
            leftBoxTitle: 'Etimología',
            leftBoxDesc: 'El nombre xiangqi se interpreta generalmente de forma literal como "ajedrez de elefante" (xiàng = elefante, qí = ajedrez/juego de tablero). Sin embargo, xiàng también puede significar marfil, figura o representación, o fenómeno celeste. El historiador H. J. R. Murray sugirió "el Juego de las Figuras" como una interpretación temprana probable antes de que las piezas se distinguieran por caracteres escritos.',
            rightBoxTitle: 'Orígenes y Difusión',
            rightBoxDesc: 'Según Murray y la opinión predominante entre los historiadores del ajedrez, el xiangqi actual desciende del chaturanga indio. Una hipótesis alternativa defendida por algunos historiadores chinos sugiere que el xiangqi surgió en China durante el período de los Reinos Combatientes y se difundió hacia el oeste. El janggi coreano también procede directamente del xiangqi.',
        },
    },
    janggi: {
        name: 'Janggi',
        rules: {
            intro: 'El Janggi (coreano: 장기), a veces llamado ajedrez coreano, es un juego de tablero de estrategia popular en la península de Corea. Derivado del xiangqi (ajedrez chino), se juega en las 90 intersecciones de un tablero de 9×10 sin río central. Las piezas azules (Cho) mueven primero. El objetivo del juego es dar jaque mate al general adversario (weh-tong).',
            bullets: [
                {
                    title: 'Disposición inicial y formaciones a elegir:',
                    desc: 'Antes de comenzar la partida, cada jugador puede intercambiar las posiciones de sus caballos y elefantes adyacentes. Esto da lugar a cuatro disposiciones iniciales posibles que reciben su nombre de la posición de los elefantes: Formación de Elefantes Interiores (la clásica por defecto), Formación de Elefantes Exteriores, Formación de Elefante Izquierdo y Formación de Elefante Derecho.',
                    iconType: 'check',
                },
                {
                    title: 'El General (Janggun / Gung):',
                    desc: 'Comienza en la intersección central del palacio. Mueve un paso por turno a lo largo de las líneas marcadas dentro del palacio de 3×3 (nueve puntos) y no puede salir de él bajo ninguna circunstancia. La partida se pierde cuando el general recibe jaque mate.',
                    pieceName: 'JanggiGeneral',
                },
                {
                    title: 'Los Guardias (Sa):',
                    desc: 'Dos oficiales civiles que comienzan a izquierda y derecha del general en la primera fila. Mueven un paso por turno siguiendo las líneas marcadas dentro del palacio. No pueden abandonar el palacio y son valiosos para proteger al general.',
                    pieceName: 'JanggiGuard',
                },
                {
                    title: 'El Caballo (Ma):',
                    desc: 'Mueve un paso ortogonal seguido de un paso diagonal hacia afuera, sin saltar. Queda bloqueado si hay una pieza en su paso ortogonal inicial. Puede intercambiar su posición con un elefante adyacente en la disposición inicial.',
                    pieceName: 'JanggiHorse',
                },
                {
                    title: 'El Elefante (Sang):',
                    desc: 'Mueve un punto ortogonal seguido de dos puntos diagonales hacia afuera, alcanzando la esquina opuesta de un rectángulo de 2×3. Queda bloqueado por piezas intermedias a lo largo de su trayectoria. Al no haber río, los elefantes pueden cruzar todo el tablero con fines ofensivos.',
                    pieceName: 'JanggiElephant',
                },
                {
                    title: 'El Carro (Cha):',
                    desc: 'Mueve y captura cualquier distancia en línea recta ortogonal, ya sea horizontal o verticalmente. Además, puede desplazarse en línea recta por las diagonales del interior de ambos palacios. Comienza en las esquinas y es la pieza más poderosa del juego.',
                    pieceName: 'JanggiChariot',
                },
                {
                    title: 'El Cañón (Po):',
                    desc: 'Tanto para mover como para capturar, debe saltar obligatoriamente sobre exactamente una pieza intermedia (aliada o enemiga) en línea horizontal o vertical. Un cañón no puede saltar sobre otro cañón ni capturar un cañón adversario. También puede desplazarse por las diagonales del palacio si hay una pieza en el centro.',
                    pieceName: 'JanggiCannon',
                },
                {
                    title: 'El Soldado (Byeong / Jol):',
                    desc: 'Cinco soldados por bando (Byeong para el rojo, Jol para el azul). Mueven y capturan un punto hacia adelante o hacia los lados. No promocionan; al llegar al fondo del tablero solo pueden desplazarse lateralmente. En el palacio enemigo, pueden avanzar también en diagonal hacia adelante por sus líneas marcadas.',
                    pieceName: 'JanggiSoldier',
                },
                {
                    title: 'Pasar turno (Han-soo-shim) y ausencia de ahogado:',
                    desc: 'Un jugador puede pasar su turno voluntariamente (han-soo-shim) siempre que su general no esté en jaque. El ahogado no supone una derrota: el jugador sin movimientos legales simplemente debe pasar. Si ambos jugadores pasan consecutivamente, la partida termina en tablas.',
                    iconType: 'check',
                },
                {
                    title: 'Bikjang (Generales enfrentados):',
                    desc: 'Un jugador puede mover su general para que quede enfrentado directamente al general rival en la misma columna o fila sin piezas intermedias. El oponente puede entonces aceptar las tablas de inmediato o realizar un movimiento que rompa el enfrentamiento.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo profesional: Aprovecha la posibilidad de elegir la formación inicial de caballos y elefantes para adaptar tu apertura. Recuerda que los cañones no pueden mover sin una pieza sobre la que saltar y explota las diagonales del palacio con tus carros.',
        },
        history: {
            intro: 'El Janggi es una variante de ajedrez originaria de la península de Corea, desarrollada a partir del xiangqi chino. Aunque comparten el tablero de 9×10 y la colocación sobre intersecciones, el janggi eliminó el río divisorio, requirió que los cañones salten también al desplazarse y otorgó a los elefantes plena movilidad por todo el tablero.',
            leftBoxTitle: 'Contienda Chu–Han',
            leftBoxDesc: 'Los generales representan a los estados rivales de Han (漢, bando rojo) y Chu (楚, bando azul), que lucharon por el poder tras la caída de la dinastía Qin. Las piezas rojas están escritas con caligrafía regular (kaishu), mientras que las azules emplean caligrafía cursiva (caoshu).',
            rightBoxTitle: 'Cultura popular',
            rightBoxDesc: 'En Corea del Sur, el janggi es un deporte mental tradicional y un pasatiempo muy extendido. Aficionados de todas las edades se reúnen durante todo el año en parques urbanos para disputar partidas amistosas y analizar posiciones tácticas.',
        },
    },
    makruk: {
        name: 'Makruk',
        rules: {
            intro: 'El Makruk (tailandés: หมากรุก), o ajedrez tailandés, es un juego de tablero de estrategia descendiente del chaturanga indio del siglo VI o de un pariente muy cercano. Se juega en un tablero de 8x8 sin colores alternados. Las blancas mueven primero. El objetivo es dar jaque mate al señor enemigo y el ahogado es tablas.',
            bullets: [
                {
                    title: 'El Señor (Khun - ขุน):',
                    desc: 'Mueve o captura una casilla en cualquier dirección (ortogonal o diagonal). Es la pieza real: la partida se gana dando jaque mate al señor adversario. El rey ahogado finaliza en tablas, al igual que en el ajedrez occidental y a diferencia del Shatranj.',
                    pieceName: 'Khun',
                },
                {
                    title: 'La Semilla (Met - เม็ด):',
                    desc: 'Mueve o captura una casilla en diagonal en las cuatro direcciones, igual que el ferz en el Shatranj. Comienza situada a la derecha del señor.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Noble (Khon - โคน):',
                    desc: 'Mueve o captura una casilla en diagonal en cuatro direcciones o una casilla hacia adelante (5 direcciones en total), de forma idéntica al general de plata en el Shogi.',
                    pieceName: 'Khon',
                },
                {
                    title: 'El Caballo (Ma - ม้า):',
                    desc: 'Mueve dos casillas ortogonalmente y luego una casilla en perpendicular, saltando por encima de cualquier pieza en su camino, exactamente igual que el caballo del ajedrez occidental.',
                    pieceName: 'Ma',
                },
                {
                    title: 'El Barco (Ruea - เรือ):',
                    desc: 'Mueve o captura cualquier número de casillas desocupadas ortogonalmente a lo largo de filas y columnas, igual que la torre en el ajedrez occidental.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'El Cauri (Bia - เบี้ย):',
                    desc: 'Mueve una casilla hacia adelante y captura una casilla en diagonal hacia adelante. No puede avanzar dos casillas en su primer movimiento (no hay avance doble ni captura al paso). Al alcanzar la sexta fila relativa (fila 6 para blancas, fila 3 para negras), se promociona obligatoriamente a cauri invertido (Biangai).',
                    pieceName: 'Bia',
                },
                {
                    title: 'El Cauri Invertido (Biangai - เบี้ยหงาย):',
                    desc: 'Un peón/cauri promocionado (volteado). Mueve o captura una casilla en diagonal en cualquier dirección, teniendo el mismo movimiento que la semilla (Met).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Reglas de Conteo - Conteo de Tablero (64 Jugadas):',
                    desc: 'Cuando a ninguno de los bandos le quedan cauris sin promocionar en el tablero, se debe dar jaque mate en un máximo de 64 jugadas o la partida se declara tablas. El jugador en desventaja realiza la cuenta y puede detenerla (y también reiniciarla) en cualquier momento. Si el jugador que cuenta da jaque mate sin haber detenido la cuenta, la partida se declara tablas.',
                    iconType: 'check',
                },
                {
                    title: 'Reglas de Conteo - Conteo por Piezas (Rey en Fuga):',
                    desc: 'Cuando se captura la última pieza (que no sea el señor) del jugador en desventaja, este puede iniciar la cuenta de sus movimientos de huida. El bando atacante dispone de un límite máximo de jugadas según las piezas que conserve: 2 Barcos = 8 jugadas; 1 Barco = 16 jugadas; 2 Nobles = 22 jugadas; 2 Caballos = 32 jugadas; 1 Noble = 44 jugadas; 1 Caballo = 64 jugadas; Solo Semillas = 64 jugadas. El jugador que huye comienza a contar a partir del número total de piezas que quedan en el tablero (incluyendo ambos señores), por lo que el atacante debe dar mate antes de que se alcance dicho límite. El jugador en desventaja realiza la cuenta y puede detenerla (y también reiniciarla) en cualquier momento.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo profesional: Coordina tus barcos y nobles para dominar el centro, y ten muy presente que al entrar en finales sin cauris o con un rey solitario, cada jugada cuenta estrictamente contra el límite de tablas.',
        },
        history: {
            intro: 'El Makruk (o ajedrez tailandés) es un juego de tablero de estrategia descendiente del juego indio chaturanga del siglo VI o de un pariente muy cercano, por lo que está emparentado con el ajedrez. En Camboya se juega prácticamente el mismo juego, conocido como ouk u ouk chatrang.',
            leftBoxTitle: 'Origen y Transmisión',
            leftBoxDesc: 'Comerciantes persas llegaron al reino de Ayutthaya alrededor del siglo XIV para comerciar y difundir su cultura, por lo que es posible que el makruk siamés derivara del shatranj persa mediante intercambio cultural, ya que la semilla (met) mueve de forma idéntica al ferz persa. No obstante, se considera más probable que llegara más directamente desde la India, dadas las similitudes lingüísticas entre chaturanga y el nombre camboyano ouk chaktrang, así como el movimiento del noble (khon). En su obra «A History of Chess» (1913), H. J. R. Murray sugiere que el juego pudo haber seguido la expansión del budismo en la región.',
            rightBoxTitle: 'El Ouk Camboyano',
            rightBoxDesc: 'En Camboya y entre los jemeres de Vietnam (donde se conoce como cờ ốc o «ajedrez caracol»), el ouk es un elemento central de las festividades del Bon Om Touk. Existen bajorrelieves en templos del Imperio Jemer del siglo XII que evidencian su práctica desde entonces. Cuenta con sutiles diferencias, como movimientos iniciales opcionales de caballo para el señor y de dos casillas para la semilla si aún no hubo capturas. En 2008 se organizó su primer torneo nacional con reglas estandarizadas y fue incluido en los Juegos del Sudeste Asiático de 2023 (SEA Games).',
        },
    },
    ouk_chaktrang: {
        name: 'Ouk Chaktrang',
        rules: {
            intro: 'El Ouk Chaktrang (en jemer: អុកចត្រង្គ), o ajedrez camboyano, es un juego de tablero de estrategia estrechamente emparentado con el Makruk tailandés. Comparte las mismas piezas, tablero y reglas de conteo, pero introduce movimientos especiales de apertura para el señor y la semilla si todavía no se ha producido ninguna captura en la partida.',
            bullets: [
                {
                    title: 'Apertura Especial - Salto del Señor (Ang):',
                    desc: 'En su primer movimiento, y únicamente si no está en jaque, el señor puede moverse saltando como un caballo (en forma de L), siempre que aún no se haya capturado ninguna pieza en la partida.',
                    pieceName: 'Khun',
                },
                {
                    title: 'Apertura Especial - Avance Doble de la Semilla (Neang):',
                    desc: 'En su primer movimiento, la semilla puede avanzar dos casillas en línea recta hacia adelante (saltando cualquier obstáculo intermedio), siempre que aún no se haya capturado ninguna pieza en la partida.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Señor (Ang):',
                    desc: 'Mueve o captura una casilla en cualquier dirección. La partida se gana dando jaque mate al señor adversario, y el rey ahogado es tablas.',
                    pieceName: 'Khun',
                },
                {
                    title: 'La Semilla (Neang):',
                    desc: 'Mueve o captura una casilla en diagonal en las cuatro direcciones. Comienza situada a la derecha del señor.',
                    pieceName: 'Met',
                },
                {
                    title: 'El Noble (Koul):',
                    desc: 'Mueve o captura una casilla en diagonal en las cuatro direcciones o una casilla hacia adelante (5 direcciones en total), idéntico al noble del Makruk.',
                    pieceName: 'Khon',
                },
                {
                    title: 'El Caballo (Ses):',
                    desc: 'Mueve en forma de L saltando sobre cualquier pieza en su camino, exactamente igual que el caballo del ajedrez.',
                    pieceName: 'Ma',
                },
                {
                    title: 'El Barco (Tuuk):',
                    desc: 'Mueve o captura cualquier número de casillas ortogonalmente a lo largo de filas y columnas, igual que la torre del ajedrez.',
                    pieceName: 'Ruea',
                },
                {
                    title: 'El Pez (Trey):',
                    desc: 'Mueve una casilla hacia adelante y captura una casilla en diagonal hacia adelante. Al alcanzar la sexta fila relativa, promociona obligatoriamente a pez invertido (Trey Bak).',
                    pieceName: 'Bia',
                },
                {
                    title: 'El Pez Invertido (Trey Bak):',
                    desc: 'Un pez promocionado (volteado). Mueve o captura una casilla en diagonal en cualquier dirección, teniendo el mismo movimiento que la semilla (Neang).',
                    pieceName: 'Biangai',
                },
                {
                    title: 'Reglas de Conteo (Conteo de Tablero y Rey en Fuga):',
                    desc: 'Hereda las reglas de conteo del Makruk: conteo de 64 jugadas cuando no quedan peces sin promocionar y conteo por piezas cuando un jugador queda con rey solitario. Si el jugador que cuenta da jaque mate sin detener la cuenta, la partida se declara tablas.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo profesional: Aprovecha el salto de caballo inicial del señor para ponerlo a salvo rápidamente y despejar la columna para tus barcos antes de que se abra el juego con la primera captura.',
        },
        history: {
            intro: 'El Ouk Chaktrang (u Ouk) es el juego de estrategia tradicional de Camboya. Sus raíces se remontan a más de un milenio, habiendo evolucionado a partir del chaturanga indio o de ancestros comunes de la región del sudeste asiático.',
            leftBoxTitle: 'Evidencia Arqueológica en Angkor',
            leftBoxDesc: 'Existen numerosos bajorrelieves del siglo XII en templos del Imperio Jemer (como Bayon y Angkor Wat) que representan figuras jugando partidas de Ouk. Estas representaciones demuestran que el juego ya gozaba de un arraigo popular y cortesano prominente durante el esplendor de Angkor.',
            rightBoxTitle: 'Tradición Viva y Deporte Moderno',
            rightBoxDesc: 'Jugado ampliamente en Camboya y por los jemeres de Vietnam (donde se le conoce como cờ ốc), es un componente insustituible del festival del agua Bon Om Touk. En 2008 el Comité Olímpico de Camboya estandarizó su reglamento nacional, y en 2023 fue disciplina oficial en los Juegos del Sudeste Asiático (SEA Games).',
        },
    },
    sittuyin: {
        name: 'Sittuyin',
        rules: {
            intro: 'El Sittuyin (en birmano: စစ်တုရင်) es el ajedrez tradicional de Myanmar (Birmania). Jugado sobre un tablero monocromo de 8×8 con las diagonales Sit-ke-min cruzadas, los peones comienzan en una formación escalonada asimétrica y pueden promocionar a General al alcanzar o cruzar la línea de promoción de la mitad enemiga cuando el General propio ha caído.',
            bullets: [
                {
                    title: 'El Rey (Mingyi):',
                    desc: 'Mueve una casilla en cualquier dirección (ortogonal o diagonal). El objetivo del juego es darle jaque mate. El rey ahogado (stalemate) resulta en tablas.',
                    pieceName: 'Mingyi',
                },
                {
                    title: 'El General (Sitke):',
                    desc: 'Mueve una casilla en diagonal en las cuatro direcciones (igual al Ferz del Shatranj o Met del Makruk). Cada jugador puede tener un máximo de un General activo en el tablero.',
                    pieceName: 'Sitke',
                },
                {
                    title: 'El Elefante (Sin):',
                    desc: 'Mueve una casilla en diagonal en las cuatro direcciones o una casilla hacia adelante en línea recta (5 direcciones en total), idéntico al Noble del Makruk o General de Plata de Shogi.',
                    pieceName: 'Sin',
                },
                {
                    title: 'El Caballo (Myin):',
                    desc: 'Mueve con el salto característico en "L", pudiendo saltar sobre cualquier obstáculo en su camino.',
                    pieceName: 'Myin',
                },
                {
                    title: 'El Carro / Torre (Yahhta):',
                    desc: 'Mueve ortogonalmente cualquier número de casillas libres a lo largo de filas o columnas.',
                    pieceName: 'Yahhta',
                },
                {
                    title: 'El Peón / Señor Feudal (Ne):',
                    desc: 'Mueve una casilla hacia adelante sin capturar y captura una casilla en diagonal hacia adelante. No dispone de avance doble inicial ni captura al paso.',
                    pieceName: 'Ne',
                },
                {
                    title: 'Promoción Inmediata y Diferida:',
                    desc: 'Los peones promocionan a General al alcanzar o cruzar la línea diagonal de la mitad del tablero del rival, siempre que el General propio haya sido capturado. Si el General ya está muerto al cruzar la línea, la promoción es inmediata. Si el General está vivo, el peón permanece como peón; cuando el General muera más adelante, el jugador puede promocionarlo in situ en su turno mediante la píldora de acción flotante.',
                    iconType: 'check',
                },
                {
                    title: 'Reglas de Tablas y Conteo del Rey Solitario:',
                    desc: 'Se declara tablas por rey ahogado, posición muerta, triple repetición o regla de 50 movimientos. Además, si un jugador queda únicamente con su Rey y el rival no tiene peones, el rey solitario empata si sobrevive a un conteo fijo: 16 movimientos si el rival tiene al menos una Torre, 44 movimientos si tiene al menos un Elefante, o 64 movimientos si tiene al menos un Caballo.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo profesional: Mantén tus peones situados en las diagonales enemigas como una amenaza latente; si pierdes a tu General, podrás promover inmediatamente o revivir a un nuevo General en una casilla avanzada clave.',
        },
        history: {
            intro: 'El Sittuyin (en birmano: စစ်တုရင်) es el ajedrez milenario de Myanmar, descendiente directo del chaturanga indio que penetró en la región hacia el siglo VIII. Su nombre deriva de «sit» (guerra o ejército) y representa las cuatro armas bélicas tradicionales: infantería (nè), caballería (myin), elefantes (sin) y carros (yahhta). En fuentes históricas y crónicas coloniales del siglo XIX fue documentado bajo denominaciones como «chit-thareen» (Stewart Culin, 1898; Hiram Cox, 1801; Michael Symes, 1800, quien lo llamó «el juego del general») o «tsit-da-yin» (G. W. Strettell, 1876). Los antiguos monarcas y caudillos birmanos lo utilizaban en la corte para ensayar tácticas reales antes del combate: al luchar los reyes en primera línea de batalla, el liderazgo audaz del monarca en el tablero decidía el destino de la contienda.',
            leftBoxTitle: 'Mitología del Ramayana, Arte y Tradición',
            leftBoxDesc: 'Las piezas tradicionales son esculturas en madera o marfil (rojas y negras o verdes) que encarnan la epopeya del Ramayana (Yama Zatdaw): el príncipe Rama y el general simio Hanuman frente al rey demonio Ravana. Los artesanos tallaban tableros de mesa elevados (sittuyin-kon) provistos de cajones para guardar las piezas, concebidos para jugar en cuclillas sobre el suelo. En las partidas tradicionales, cada jugada se acompaña de un seco y resonante golpe sobre la madera, evocando el fragor bélico. Emparentado anatómicamente con el Makruk tailandés y el Ouk Chaktrang camboyano según el historiador Jean-Louis Cazaux, el juego sufrió un fuerte declive y escasez de juegos artesanales tras cinco décadas de aislamiento militar y pobreza en el siglo XX, eclipsado en gran medida por el ajedrez internacional aunque preservado en regiones del noroeste.',
            rightBoxTitle: 'Despliegue Sit-tee, Sit-ke-min y Reglamento',
            rightBoxDesc: 'El juego se disputa sobre un tablero liso de 64 casillas sin alternancia de color, cruzado por dos grandes diagonales llamadas Sit-ke-min («líneas del general»). La partida se inicia con la fase de Sit-tee (despliegue de tropas), donde tras fijar los peones escalonados, cada bando posiciona libremente sus piezas mayores; en los torneos oficiales se coloca una cortina divisoria en el centro para ocultar la disposición táctica hasta que ambas fuerzas están listas. H. J. R. Murray documentó en 1913 su evolución en tres etapas (despliegue, recolocación y batalla abierta). Los peones solo pueden ascender a General al alcanzar las diagonales Sit-ke-min y únicamente si el General propio ya ha perecido. El objetivo supremo es dar mate (khwè), estando terminantemente prohibido el rey ahogado (tablas ilegales). Anne Sunnucks registró además antiguas variantes con dados de tres jugadas simultáneas.',
        },
    },
    shogi: {
        name: 'Shogi',
        rules: {
            intro: 'El Shogi (將棋, «juego de los generales»), o ajedrez japonés, se juega en una cuadrícula monocroma de 9×9 casillas. Las piezas tienen forma de cuña y se orientan apuntando hacia el adversario. La partida la inicia Sente (jugador inferior / blancas). El objetivo es dar jaque mate al Rey oponente. Lo que distingue al Shogi de casi todas las demás variantes de ajedrez es la regla de reintroducción (drop): las piezas capturadas pasan a la reserva del jugador y pueden ser reintroducidas en cualquier casilla vacía como propias.',
            bullets: [
                {
                    title: 'El Rey (Gyoku / Osho):',
                    desc: 'Mueve una casilla en cualquier dirección (ortogonal o diagonal). Es la pieza real suprema; la captura o jaque mate del rey rival otorga la victoria.',
                    pieceName: 'ShogiKing',
                },
                {
                    title: 'La Torre (Hisha) y el Dragón (Ryu):',
                    desc: 'La Torre mueve cualquier número de casillas ortogonalmente. Al promocionar se convierte en Dragón Rey (Ryu), conservando el movimiento de la torre y sumando la capacidad de mover una casilla en diagonal.',
                    pieceName: 'ShogiRook',
                },
                {
                    title: 'El Alfil (Kaku) y el Caballo Dragón (Uma):',
                    desc: 'El Alfil mueve cualquier número de casillas en diagonal. Al promocionar se convierte en Caballo Dragón (Uma), conservando las diagonales y sumando la capacidad de mover una casilla ortogonalmente.',
                    pieceName: 'ShogiBishop',
                },
                {
                    title: 'El General de Oro (Kin):',
                    desc: 'Mueve una casilla en las cuatro direcciones ortogonales o una casilla en diagonal hacia adelante (6 direcciones en total). No puede promocionar.',
                    pieceName: 'ShogiGold',
                },
                {
                    title: 'El General de Plata (Gin):',
                    desc: 'Mueve una casilla en las cuatro direcciones diagonales o una casilla ortogonal hacia adelante (5 direcciones en total). Al promocionar se convierte en Plata Promovida (Narigin), moviendo exactamente como un General de Oro.',
                    pieceName: 'ShogiSilver',
                },
                {
                    title: 'El Caballo (Keima):',
                    desc: 'Avanza dos casillas hacia adelante y una hacia el lado (solo los dos saltos frontales). Salta por encima de piezas intermedias. Al promocionar se convierte en Caballo Promovido (Narikei), moviendo como un General de Oro.',
                    pieceName: 'ShogiKnight',
                },
                {
                    title: 'La Lanza (Kyosha):',
                    desc: 'Mueve cualquier número de casillas libres únicamente hacia adelante en su columna. Al promocionar se convierte en Lanza Promovida (Narikyo), moviendo como un General de Oro.',
                    pieceName: 'ShogiLance',
                },
                {
                    title: 'El Peón (Fuhyo) y el Tokin:',
                    desc: 'Mueve y captura una casilla hacia adelante. Al promocionar se convierte en Tokin, moviendo exactamente igual que un General de Oro.',
                    pieceName: 'ShogiPawn',
                },
                {
                    title: 'Reintroducción de Piezas (Drops):',
                    desc: 'En lugar de mover una pieza del tablero, puedes reintroducir una pieza de tu reserva (capturada previamente) en cualquier casilla desocupada en su forma básica no promocionada. Restricciones: no se puede colocar una pieza sin movimientos legales futuros (peón/lanza en última fila, caballo en las dos últimas); regla de Nifu (no puedes colocar un peón en una columna donde ya tengas otro peón no promocionado); regla de Uchifuzume (no se puede dar jaque mate inmediato con la reintroducción de un peón, aunque sí jaque mate con cualquier otra pieza o jaque simple con peón).',
                    iconType: 'check',
                },
                {
                    title: 'Zona de Promoción:',
                    desc: 'Las tres filas más lejanas al inicio de cada bando forman la zona de promoción. Al entrar, salir o moverse dentro de dicha zona, una pieza puede promocionar. La promoción es obligatoria si la pieza no tuviera ningún movimiento legal en caso de no promocionar.',
                    iconType: 'check',
                },
            ],
            proTip: 'Consejo profesional: En Shogi casi nunca se simplifica el material hacia un final tranquilo; cada pieza capturada se convierte en un arma arrojadiza. Construye un castillo sólido (como Mino o Yagura) para tu rey antes de lanzar un ataque coordinado con reintroducciones.',
        },
        history: {
            intro: 'El Shogi es el miembro japonés de la familia del ajedrez, derivado del Chaturanga indio que llegó a Japón a través de China durante el período Heian (con piezas arqueológicas datadas hacia 1058). Hacia el siglo XVI sus reglas quedaron fijadas en el shogi estándar moderno. Su rasgo más distintivo es la regla de reintroducción de piezas capturadas (drops), cuyo momento exacto de invención carece de registro histórico, dotando al juego de un gran dinamismo táctico y una tasa de empates casi nula.',
            leftBoxTitle: 'El Período Edo y las Casas Meijin',
            leftBoxDesc: 'Durante el Shogunato Tokugawa (período Edo), el Shogi recibió el patrocinio estatal del Shogun. Se crearon las tres grandes escuelas dinásticas (Ohashi, Ohashi rama secundaria e Ito) y se instauró el título oficial de Meijin para el mayor maestro del juego.',
            rightBoxTitle: 'Organización Profesional y Títulos',
            rightBoxDesc: 'En el Japón contemporáneo, el Shogi es organizado profesionalmente por la Nihon Shogi Renmei (JSA), que disputa ocho grandes títulos anuales. Maestros legendarios como Yoshiharu Habu (el primero en ostentar siete coronas) o Sota Fujii (poseedor de las ocho coronas) son figuras consagradas de este deporte mental.',
        },
    },
};
