# Atlas Chess

> Discover the history and regional variants of chess!

Welcome to **Atlas Chess**, a chess application built with modern web technologies.

This is my very first software project outside my CS studies and it has been developed with the assistance of AI. My primary intention behind this project is deeply cultural: I wanted to create a platform that allows people to easily play lost historical chess variants that are otherwise nearly impossible to experience today. Furthermore, I aim to preserve and provide access to various regional chess variants from around the world, saving you a trip across the globe just to play a unique game.

## Features

- **Multiple Variants:** Play Classic Chess, travel back in time with historical variants or ancestors of chess or travel around the world playing the regional variants of chess. The underlying engine is built to support infinite custom variants.
- **Undo:** *Undo* button to seamlessly rewind the game state using rapid event replay, ensuring perfect state consistency.
- **Save & Load (.atlas):** Save your game progress at any point into a custom `.atlas` JSON file and load it back later to continue right where you left off.
- **Smart HUD:**
    - Dynamic Captured Pieces tracker with automatic score advantage calculation.
    - Game Timer.
    - Contextual Modals for pawn promotion and game reset/exit confirmations.

## Project Structure

```text
src/
├── assets/             # Piece images (SVG/PNG), sounds, etc.
│   ├── logos/          # Logos used in the game
│   ├── pieces/         # Piece images (SVG)
├── components/         # React UI Components
│   ├── board/          # Board, squares, and piece rendering
│   ├── logos/          # Game logo versions in .tsx
│   ├── menu/           # Main menu, variant selector, loading screen
│   ├── modals/         # Modals (How to play, Exit confirmation, Save)
│   └── ui/             # Generic buttons, side panels, badges
├── core/               # Game logic (engine, board, pieces, etc..)
│   ├── engine/         # GameEngine.ts (turn control, check, general rules)
│   ├── models/         # Board.ts, Move.ts, Position.ts
│   ├── pieces/         # Piece.ts (abstract) and concrete pieces separated by variant
│   └── variants/       # GameVariant.ts (interface) and variants (ClassicChess.ts, etc.)
├── store/              # Zustand (Global React State)
│   ├── useGameStore.ts # Connects React with the GameEngine
│   └── useNavStore.ts  # Screen control (Menu vs. Game)
├── types/              # Global TypeScript types/interfaces definitions
├── utils/              # Auxiliary functions (save/load JSON, helpers)
├── App.tsx             # Root component
├── index.css           # Global styles (Tailwind)
└── main.tsx            # Vite entry point
```

## Tech Stack

- **[React](https://reactjs.org/)** - UI Components and rendering.
- **[TypeScript](https://www.typescriptlang.org/)** - For robust typing and engine logic.
- **[Electron](https://www.electronjs.org/)** - Cross-platform framework for secure, native desktop applications.
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight and lightning-fast state management.
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling with custom theme extensions.
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling for instant server starts and fast HMR.
- **[Lucide React](https://lucide.dev/)** - Clean SVG icons.

## getting started

### play the game
the easiest way to play atlas chess is to download the ready-to-run executable. no installation required.
1. go to the [releases](https://github.com/grr92/atlaschess/releases) page of this repository.
2. download the latest `.exe` file.
3. double-click the file and start playing!

*(note: as a new and non-professional developer, windows might show a screen warning on the first run. click "more info" and "run anyway").*

### development setup
if you want to inspect the code, modify the game, or run it from the source, follow these steps:

#### prerequisites
make sure you have [node.js](https://nodejs.org/) installed on your machine.

#### installation

1. clone the repository
   ```bash
   git clone [https://github.com/grr92/atlaschess.git](https://github.com/grr92/atlaschess.git)
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
- [ ] Add more historical and regional variants.
- [ ] Better UI.
- [ ] Implement move sound effects.
- [ ] Implement settings (language and board change).

## Feedback & Suggestions

I highly value your feedback! Feel free to open an issue to suggest new features, report bugs, or request the addition of specific historical or regional variants.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
You are free to share and adapt the material for non-commercial purposes, as long as you give appropriate credit. See the [LICENSE](https://creativecommons.org/licenses/by-nc/4.0/) details for more information.

## Planned variants

- Historical:
  - Chaturanga
  - Shatranj
  - Tamerlane chess (Shatranj variant)
  - Chaturagi (4 players)
  - Grant Acedrex
  - Courier chess
  - Semedo
  - Short assize
  - Chess from other centuries?

- Regional: under research