# Atlas Chess

> Discover the history and regional variants of chess!

Welcome to **Atlas Chess**, a chess application built with modern web technologies.

This is my very first software project outside my CS studies, and it has been developed with the assistance of AI. My primary intention behind this project is deeply cultural: I wanted to create a platform that allows people to easily play lost historical chess variants that are otherwise nearly impossible to experience today. Furthermore, I aim to preserve and provide access to various regional chess variants from around the world, saving you a trip across the globe just to play a unique game.

## Features

- **Rich Catalog of 14 Chess Variants:**
    - **Standard:** Classic FIDE Chess (8×8).
    - **Historical Ancestors & Medieval Variants:**
        - **Chaturanga** (6th c. India, 8×8) — The ancient forefather of chess featuring Gajas, Mantris, and early infantry tactics.
        - **Shatranj** (7th c. Persia, 8×8) — Classical Islamic chess featuring the Ferz, Alfil, and Baidaq.
        - **Courier Chess** (12th c. Germany, 12×8) — Medieval German favorite introducing the fast-stepping Courier, Jester, and Sage.
        - **Grant Acedrex** (13th c. Castile, 12×12) — Commissioned by King Alfonso X, featuring mythical beasts (Aanca, Crocodile, Giraffe, Unicorn, Lion) and an 8-sided die.
        - **Tamerlane Chess** (14th c. Timurid Empire, 112 squares) — Legendary 10×11 board with 2 imperial Citadels, 11 distinct pawn types with multi-tier promotions, and Adventitious King succession.
        - **Chaturaji** (8×8, 4 Players) — Ancient 4-player Indian dice chess featuring stakes counters, alliances, and a 4-sided die.
        - **Four Seasons Chess** (8×8, 4 Players) — Medieval allegorical chess representing Spring, Summer, Autumn, and Winter with elemental rotations and an optional 6-sided die.
    - **Living Regional Variants:**
        - **Xiangqi** (Chinese Chess, 9×10) — Played across the River and inside the Nine Palaces, featuring jumping Cannons, crossing Soldiers, and a toggle between traditional calligraphy (Hanzi) and modern Westernized pieces.
        - **Janggi** (Korean Chess, 9×10) — Fast-paced Korean chess with customizable starting formations (Sang-Ma swaps), wide-sweeping Elephants, Palace diagonals, and turn-passing / Bikjang mechanics.
        - **Shogi** (Japanese Chess, 9×9) — Uncheckered 9×9 board with 40 wedge-shaped pieces. Features the famous piece drop mechanism (captured enemy pieces become part of the captor's reserve in dedicated *Komadai* trays and can be dropped onto vacant squares), dual-piece set support (traditional Japanese Kanji vs. Westernized chess icons), 3-rank promotion zone, and authentic end rules (Uchifuzume pawn-drop mate prohibition, Sennichite repetition & perpetual check, and Jishogi impasse rule).
        - **Makruk** (Thai Chess, 8×8) — Traditional uncheckered board with Seeds, Nobles, 6th-rank Bia promotions, and authentic Board & Piece Counting rules.
        - **Ouk Chaktrang** (Cambodian Chess, 8×8) — Ancient Khmer counterpart to Makruk featuring dynamic opening moves (Lord's knight leap and Seed's two-square advance before the first capture) and full countdown systems.
        - **Sittuyin** (Burmese Chess, 8×8) — Traditional Myanmar chess on an uncheckered monochrome board with large diagonals, featuring the interactive *Sit-tee* troop deployment phase, staggered pawn chains, diagonal promotions, and lone king counting rules.
- **Multiple Game Modes & 4-Player Battle:**
    - **Player vs. Player (PvP):** Local pass-and-play supporting standard 2-player games as well as full 4-player rotational battles (Chaturaji and Four Seasons).
    - **Player vs. AI (PvE):** Single-player mode with adjustable difficulty (Easy, Medium, Master), custom player color assignment, and automatic board flipping.
    - **Historical Dice Modes:** Authentic dice-driven turns powered by animated dice widgets:
        - 4-sided die (d4) in *Chaturaji*.
        - 6-sided die (d6) in *Four Seasons Chess*.
        - 8-sided die (d8) in *Grant Acedrex*.
        - Optional dice-less mode toggle where supported.
- **Dual-Engine AI Architecture:**
    - **Fairy-Stockfish 14:** High-performance native UCI engine embedded via Electron IPC for Classic Chess and standard regional/historical games (*Xiangqi*, *Janggi*, *Shogi* with dynamic SFEN and piece-drops, *Makruk*, *Ouk Chaktrang*, *Shatranj*, *Chaturanga*, *Courier*).
    - **Native Minimax Heuristic Engine:** Custom TypeScript game-theory engine with Alpha-Beta pruning built specifically for complex non-standard geometries and mechanics (*Tamerlane's* 112 squares, Citadels, 11 pawn varieties; *Grant Acedrex's* 12×12 d8; 4-player *Chaturaji* and *Four Seasons*).
- **Interactive Variant Codex & Customization:**
    - **Variant Codex:** Integrated educational modal with complete rules, piece movement guides, historical context, and pro tips for every variant.
    - **Calligraphy / Icon Style Toggle:** Instant switching between traditional characters and graphical icons for *Xiangqi*, *Janggi*, and *Shogi*.
    - **Piece Drop Trays (*Komadai*):** Interactive in-hand piece pools for Shogi with instant drop placement and count badges.
    - **Pre-Game Formation Setup:** Interactive modal to configure custom initial setups (such as horse/elephant placement in Janggi or *Sit-tee* in Sittuyin) before starting the match.
- **Endgame & Counting HUD:**
    - Dedicated **Makruk & Ouk Chaktrang Counting Widget**: Real-time HUD showing remaining fleeing moves (Piece Count) and 64-board limits, with interactive start/stop controls for the disadvantaged player and automatic draw enforcement.
- **Undo & State Rewind:**
    - Universal *Undo* button utilizing deep event replay for guaranteed state consistency across multi-player turns, dice rolls, and AI matches (automatically rewinds 2 plies in PvE).
- **Save & Load (.atlas):**
    - Seamless game persistence allowing you to export and reload entire game states—including move history, captured/in-hand pieces, position repetition signatures, dice outcomes, counting clocks, and active formations—via custom `.atlas` JSON files, with full post-load undo capability.
- **Smart HUD & Audio:**
    - Dynamic Captured Pieces tracker with real-time material balance and advantage calculation.
    - Animated dice widgets displaying active rolled pieces and eligible moves.
    - Chaturaji stakes and score counter.
    - Turn status indicator, game timers, and contextual modals for pawn promotions, citadel choices, and royal succession.
    - Atmospheric sound effects for moves, captures, checks, dice rolls, and victory/draw states, with full mute/unmute audio settings.
- **Multilingual Support (i18n):**
    - Fully translated into **English**, **Spanish (Español)**, and **Catalan (Català)** across all menus, codex entries, modals, and in-game tooltips.

## Project Structure

```text
├── bin/                # Bundled binaries & configs (Fairy-Stockfish engine, variants.ini)
├── electron/           # Electron main process, IPC bridge & FairyStockfishService
├── src/                # Frontend application & game domain layer
│   ├── assets/         # Piece SVGs, branding, and graphics
│   │   ├── logos/      # Game logos
│   │   └── pieces/     # Piece graphics per variant
│   ├── components/     # React UI Components
│   │   ├── board/      # Board renderers (8x8, 10x11, 9x10) & HUD widgets (dice, counters)
│   │   ├── logos/      # Interactive vector logo components
│   │   ├── menu/       # Main menu and navigation
│   │   ├── modals/     # Setup, Settings, Codex, and in-game modal overlays
│   │   └── ui/         # Buttons, badges, and variant catalog components
│   ├── core/           # Pure TypeScript domain & engine layer (zero UI/Electron dependencies)
│   │   ├── ai/         # HeuristicAiEngine (Minimax Alpha-Beta) & evaluation strategies
│   │   ├── engine/     # Variant engines (rules, Makruk counting, dice turns, strategies)
│   │   ├── models/     # Board, Position, Move, and domain data models
│   │   ├── pieces/     # Base piece class & concrete piece sets per variant
│   │   └── variants/   # Variant registry and rule specifications
│   ├── i18n/           # Trilingual localization system (EN, ES, CA)
│   │   ├── locales/    # UI interface translations
│   │   └── variants/   # History, piece definitions, and rules codex per variant
│   ├── store/          # Zustand state slices (gameSlice, aiSlice, saveLoadSlice)
│   ├── types/          # Global TypeScript definitions and IPC contracts
│   ├── utils/          # Notation, UCI translation, asset mappers & SoundManager
│   ├── App.tsx         # Root component
│   ├── index.css       # Global styles (Tailwind CSS)
│   └── main.tsx        # Vite application entry point
└── tests/              # Vitest test suites (engines, rules, AI heuristic, and save/load)
```

## Tech Stack

- **[React](https://reactjs.org/)** - UI Components and rendering.
- **[TypeScript](https://www.typescriptlang.org/)** - For robust typing and engine logic.
- **[Electron](https://www.electronjs.org/)** - Cross-platform framework for secure, native desktop applications.
- **[Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish)** - World-class chess variant engine by Fabian Fichter (GPLv3).
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight and lightning-fast sliced state management.
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling with custom theme extensions.
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling for instant server starts and fast HMR.
- **[Lucide React](https://lucide.dev/)** - Clean SVG icons.

## Getting Started

### Play the Game
The easiest way to play Atlas Chess is to download the ready-to-run executable. No installation required.
1. Go to the [Releases](https://github.com/grr92/atlaschess/releases) page of this repository.
2. Download the latest `.exe` file.
3. Double-click the file and start playing!

*(Note: As a new and non-professional developer, Windows might show a screen warning on the first run. Click "More info" and "Run anyway").*

### Development Setup
If you want to inspect the code, modify the game, or run it from the source, follow these steps:

#### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

#### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/grr92/atlaschess.git
   ```
2. Navigate to the project directory
   ```bash
   cd atlaschess
   ```
3. Install NPM packages
   ```bash
   npm install
   ```
4. Start the desktop app in development mode (with hot-reloading)
   ```bash
   npm run dev
   ```
5. Compile and build the final executable for distribution
   ```bash
   npm run build:electron
   ```

## Roadmap

- [x] Build desktop executables (Windows/Mac/Linux) using **Electron**.
- [x] Add variant explanation and how to play.
- [x] AI Opponent integration (Fairy-Stockfish & Native Minimax Engine with difficulty levels).
- [x] Implement move sound effects.
- [x] Implement settings (language and mute options).
- [x] Add more historical and regional variants.

## Feedback & Suggestions

I highly value your feedback! Feel free to open an issue to suggest new features, report bugs, or request the addition of specific historical or regional variants.

## Credits and Attribution

### Chess Pieces & Graphical Artwork

- **Standard Chess Pieces (King, Queen, Rook, Bishop, Knight, Pawn):**
  - Designed by [Colin M.L. Burnett](https://en.wikipedia.org/wiki/User:Cburnett) via Wikimedia Commons.
  - License: [Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)](https://creativecommons.org/licenses/by-sa/3.0/) / [GFDL](https://www.gnu.org/licenses/fdl-1.3.html).

- **Camel (Jamal):**
  - Attribution: Modified by grr92 using the original by Kwamikagami, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=151279591 & https://commons.wikimedia.org/w/index.php?curid=151279589

- **Dabbaba (War Engine):**
  - Attribution: By Kwamikagami - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=151279587 & https://commons.wikimedia.org/w/index.php?curid=151279588

- **Giraffe (Zurafa / Giraffe):**
  - Attribution: By Francois-Pier - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=48195965 & https://commons.wikimedia.org/w/index.php?curid=48195964

- **Elephant (Pil / Gaja):**
  - Attribution: By NikNaks93 - Own work based on: Chess blt45.svg by Cburnett, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10403980 & https://commons.wikimedia.org/w/index.php?curid=10403985

- **Unicorn (Unicorn / Rhinoceros):**
  - Attribution: By en:User:Cburnett (knight); Francois-Pier (unicorn) - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=48195799 & https://commons.wikimedia.org/w/index.php?curid=48195800

- **Schleich (Fool / Jester):**
  - Attribution: By File:Chess tll44.png: Mykola Dolgalov based on Omega Chess Advanced / *derivative work NikNaks93 - File:Chess tll44.png, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10404354 & https://commons.wikimedia.org/w/index.php?curid=10404340

- **Sage:**
  - Attribution: By Uray M. János - http://zoldsakk.hu/en/info.php?item=images, GFDL, https://commons.wikimedia.org/w/index.php?curid=61257887 & https://commons.wikimedia.org/w/index.php?curid=61261369

- **Colour Pieces (Chaturaji)**
  - Attibution: By SpinningSpark work: NikNaks, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/User:Spinningspark

- **Xiangqi Pieces**
  - Attribution: By Inductiveload - Own work, Public Domain, https://commons.wikimedia.org/wiki/User:Inductiveload

- **Janggi Pieces**
  - Attribution: By Hari Seldon - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/User:Hari_Seldon

- **Shogi Pieces**
  - Attribution: By Luffykudo - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/User:Luffykudo

- **Makruk Pieces**
  - Attribution: By Yevrowl - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/User:Yevrowl

- **Knight from the Atlas Chess Fusion Logo:**
  - Attribution: By [Gregory Strong](https://www.chessvariants.com/who/GregoryStrong) and [H.G. Muller](https://www.chessvariants.com/who/HGMuller), [Alfaerie SVG Chess Graphics](https://www.chessvariants.com/graphics.dir/alfaerieSVG/index.html)

- **Wind Rose Background Logo:**
  - Attribution: By I, Alvesgaspar, CC BY 2.5, https://commons.wikimedia.org/w/index.php?curid=2268766

### Chess Engines & Open Source Software

- **[Fairy-Stockfish 14](https://github.com/fairy-stockfish/Fairy-Stockfish):**
  - World-class chess variant engine developed by [Fabian Fichter](https://github.com/fairy-stockfish) and the Stockfish community.
  - License: [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html). Source code available at [github.com/fairy-stockfish/Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish).
- **Native Heuristic AI Engine:**
  - Custom TypeScript Minimax engine with Alpha-Beta pruning built specifically for non-standard board geometries and rules (Tamerlane Chess and Grant Acedrex).
- **Icons & Libraries:**
  - [Lucide Icons](https://lucide.dev/) (ISC License).
  - React, Zustand, Tailwind CSS, Electron, Vite (MIT License).

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
You are free to share and adapt the material for non-commercial purposes, as long as you give appropriate credit. See the [LICENSE](https://creativecommons.org/licenses/by-nc/4.0/) details for more information.