# Atlas Chess

> Discover the history and regional variants of chess!

Welcome to **Atlas Chess**, a chess application built with modern web technologies.

This is my very first software project outside my CS studies and it has been developed with the assistance of AI. My primary intention behind this project is deeply cultural: I wanted to create a platform that allows people to easily play lost historical chess variants that are otherwise nearly impossible to experience today. Furthermore, I aim to preserve and provide access to various regional chess variants from around the world, saving you a trip across the globe just to play a unique game.

## Features

- **Multiple Variants:** Play Classic Chess, travel back in time with historical variants or ancestors of chess (Chaturanga, Shatranj and more...) or travel around the world playing regional variants. The underlying engine is built to support custom board sizes and piece mechanics.
- **Dice Modes:** Play Grant Acedrex using the historical 13th-century 8-sided dice rule commissioned by King Alfonso X or Chaturanga for 4 players with a 4-sided dice where the rolled die determines which piece must move on that turn (fully playable in PvP and against the AI).
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
- [x] Implement move sound effects.
- [x] Implement settings (language and mute options).
- [ ] Add more historical and regional variants.

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
  - Attibution: By SpinningSpark work: NikNaks, CC BY-SA 3.0

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

## Planned Variants

- Historical:
  - ~~Senterej~~ (not implemented due to differing rule sets)
  - ~~Short assize~~ (not implemented due to lack of evidence)

- Regional:
  - Xiangqi (China)
  - Shogi (Japan)
  - Makruk (Thailand)
  - Janggi (Korea)
  - Ouk Chatrang (Cambodia)
  - Sittuyin (Myanmar)
  - Shatar (Mongolia)
  - Hiashatar (Mongolia)