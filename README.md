# Atlas Chess

> Discover the history and regional variants of chess!

Welcome to **Atlas Chess**, a chess application built with modern web technologies.

This is my very first software project outside my CS studies and it has been developed with the assistance of AI. My primary intention behind this project is deeply cultural: I wanted to create a platform that allows people to easily play lost historical chess variants that are otherwise nearly impossible to experience today. Furthermore, I aim to preserve and provide access to various regional chess variants from around the world, saving you a trip across the globe just to play a unique game.

## Features

- **Multiple Variants:** Play Classic Chess, travel back in time with historical variants or ancestors of chess (Chaturanga, Shatranj, Tamerlane Chess, Grant Acedrex) or travel around the world playing regional variants. The underlying engine is built to support custom board sizes and piece mechanics.
- **Alfonso X 8-Sided Die (d8) Mode:** Play Grant Acedrex using the historical 13th-century 8-sided die rule commissioned by King Alfonso X, where the rolled die determines which piece hierarchy must move on that turn (fully playable in PvP and against the AI).
- **AI Opponent (PvE):** Challenge the machine powered by a dual-engine architecture:
    - **Fairy-Stockfish 14:** High-performance native UCI engine for classical chess and standard historical variants.
    - **Native Minimax Heuristic Engine:** Custom TypeScript game-theory engine with Alpha-Beta pruning built specifically for complex non-standard variants (such as Tamerlane's 112 squares, 11 pawn stages, citadel mechanics, and Grant Acedrex's d8 dice rule).
    - **Adjustable Difficulty:** Play in Easy, Medium, or Master levels with color selection (White, Black, Random) and automatic board orientation.
- **Undo:** *Undo* button to seamlessly rewind the game state using rapid event replay, ensuring perfect state consistency (automatically steps back 2 moves in PvE mode).
- **Save & Load (.atlas):** Save your game progress at any point into a custom `.atlas` JSON file and load it back later to continue right where you left off.
- **Smart HUD:**
    - Dynamic Captured Pieces tracker with automatic score advantage calculation.
    - Animated 8-sided die widget showing active piece rolls and turn indications.
    - Game Timer and turn status indicators (Player vs. AI).
    - Contextual Modals for pawn promotion, citadel choices, succession choices, and game reset/exit confirmations.

## Project Structure

```text
src/
├── assets/             # Piece images (SVG/PNG), logos, etc.
│   ├── logos/          # Logos used in the game
│   └── pieces/         # Piece images (SVG)
├── components/         # React UI Components
│   ├── board/          # Board, squares, piece rendering, and modals
│   ├── logos/          # Game logo versions in .tsx
│   ├── menu/           # Main menu, variant selector, loading screen
│   ├── modals/         # Modals (How to play, Game Setup, Exit confirmation)
│   └── ui/             # Generic buttons, side panels, badges
├── core/               # Game logic & Domain layer (zero React/Electron dependencies)
│   ├── ai/             # HeuristicAiEngine.ts (Minimax Alpha-Beta native search)
│   ├── engine/         # BaseEngine.ts, TamerlaneEngine.ts, GrantAcedrexEngine.ts
│   ├── models/         # Board.ts, TamerlaneBoard.ts, Position.ts
│   ├── pieces/         # Piece.ts (abstract) and concrete pieces per variant
│   └── variants/       # GameVariant.ts (interface) and variant definitions
├── electron/           # Electron main process, IPC bridge, and Fairy-Stockfish service
├── store/              # Zustand slices (gameSlice, aiSlice, saveLoadSlice)
├── types/              # Global TypeScript types and electron definitions
├── utils/              # Notation, UCI translation, asset mappings, dice mappings
├── App.tsx             # Root component
├── index.css           # Global styles (Tailwind)
└── main.tsx            # Vite entry point
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
- [ ] Add more historical and regional variants.
- [ ] Implement move sound effects.
- [ ] Implement settings (language and board custom themes).

## Feedback & Suggestions

I highly value your feedback! Feel free to open an issue to suggest new features, report bugs, or request the addition of specific historical or regional variants.

## Credits and Attribution

### Chess Pieces & Graphical Artwork

- **Standard Chess Pieces (King, Queen, Rook, Bishop, Knight, Pawn):**
  - Designed by [Colin M.L. Burnett](https://en.wikipedia.org/wiki/User:Cburnett) via Wikimedia Commons.
  - License: [Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)](https://creativecommons.org/licenses/by-sa/3.0/) / [GFDL](https://www.gnu.org/licenses/fdl-1.3.html).

- **Camel (Jamal):**
  - Sources: [White Chess Camel](https://commons.wikimedia.org/wiki/File:White_chess_camel.svg) and [Black Chess Camel](https://commons.wikimedia.org/wiki/File:Black_chess_camel.svg) via Wikimedia Commons.
  - Author: [Kwamikagami](https://commons.wikimedia.org/wiki/User:Kwamikagami) Modified and adapted for the Atlas Chess visual style by Gerard Romero.
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

- **Dabbaba (War Engine):**
  - Sources: [White Dabbaba](https://commons.wikimedia.org/wiki/File:White_dabbaba.svg) and [Black Dabbaba](https://commons.wikimedia.org/wiki/File:Black_dabbaba.svg) via Wikimedia Commons.
  - Author: [Kwamikagami](https://commons.wikimedia.org/wiki/User:Kwamikagami)
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

- **Giraffe (Zurafa / Giraffe):**
  - Sources: [White Chess Giraffe (Chess_Glt45.svg)](https://commons.wikimedia.org/wiki/File:Chess_Glt45.svg) and [Black Chess Giraffe (Chess_Gdt45.svg)](https://commons.wikimedia.org/wiki/File:Chess_Gdt45.svg) via Wikimedia Commons.
  - Author: [Francois Pier](https://commons.wikimedia.org/wiki/User:Francois-Pier)
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

- **Elephant (Pil / Gaja):**
  - Sources: [White Chess Elephant (Chess_elt45.svg)](https://commons.wikimedia.org/wiki/File:Chess_elt45.svg) and [Black Chess Elephant (Chess_edt45.svg)](https://commons.wikimedia.org/wiki/File:Chess_edt45.svg) via Wikimedia Commons.
  - *Note: `Chess_elt45.svg` was also used as the foundational piece to design the Atlas Chess main logo.*
  - Author: [NikNaks93](https://commons.wikimedia.org/wiki/User:NikNaks)
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

- **Unicorn (Unicorn / Rhinoceros):**
  - Sources: [White Chess Unicorn (Chess_Ult45.svg)](https://commons.wikimedia.org/wiki/File:Chess_Ult45.svg) and [Black Chess Unicorn (Chess_Udt45.svg)](https://commons.wikimedia.org/wiki/File:Chess_Udt45.svg) via Wikimedia Commons.
  - Author: [Francois Pier](https://commons.wikimedia.org/wiki/User:Francois-Pier)
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) / [GFDL](https://www.gnu.org/licenses/fdl-1.3.html) / [GPL](https://www.gnu.org/licenses/gpl.html).

- **Knight from the Atlas Chess Fusion Logo:**
  - Source: [Alfaerie SVG Chess Graphics](https://www.chessvariants.com/graphics.dir/alfaerieSVG/index.html).
  - Authors: [Gregory Strong](https://www.chessvariants.com/who/GregoryStrong) and [H.G. Muller](https://www.chessvariants.com/who/HGMuller).

- **Wind Rose Background Logo:**
  - Source: Jorge de Aguiar Nautical Chart (1492), vector reproduction by [Alvesgaspar](https://commons.wikimedia.org/wiki/File:WInd_Rose_Aguiar.svg) via Wikimedia Commons.
  - Author: [Alvesgaspar](https://commons.wikimedia.org/wiki/User:Alvesgaspar)
  - License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

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

## Planned Variants

- Historical:
  - Courier chess
  - Senterej
  - Short assize
  - Chaturaji (4 players)
  - 4 seasons chess (4 players)

- Regional:
  - Xiangqi (China)
  - Shogi (Japan)
  - Makruk (Thailand)
  - Janggi (Korea)
  - Ouk Chatrang (Cambodia)
  - Sittuyin (Myanmar)
  - Shatar (Mongolia)
  - Hiashatar (Mongolia)