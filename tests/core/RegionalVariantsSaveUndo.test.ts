import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { XiangqiEngine } from '../../src/core/engine/XiangqiEngine';
import { JanggiEngine } from '../../src/core/engine/JanggiEngine';
import { MakrukEngine } from '../../src/core/engine/MakrukEngine';
import {
    XiangqiSoldier,
    JanggiElephant,
    JanggiHorse,
    Bia,
    Biangai,
    Ruea
} from '../../src/core/pieces/piecesIndex';

describe('Regional Variants: In-Depth Save/Load and Undo Verification', () => {
    describe('Xiangqi (Chinese Chess)', () => {
        it('should save and reload game with multiple moves, captures, and river crossing', () => {
            useGameStore.getState().initGame('xiangqi', 'pvp', 'red', 'medium', false);
            const store = useGameStore.getState();

            expect(useGameStore.getState().currentTurn).toBe('red');

            // Move 1: Red Cannon (1, 7) -> (4, 7)
            store.selectSquare({ x: 1, y: 7 });
            store.selectSquare({ x: 4, y: 7 });
            expect(useGameStore.getState().currentTurn).toBe('black');

            // Move 2: Black Horse (1, 0) -> (2, 2)
            store.selectSquare({ x: 1, y: 0 });
            store.selectSquare({ x: 2, y: 2 });
            expect(useGameStore.getState().currentTurn).toBe('red');

            // Move 3: Red Soldier (4, 6) -> (4, 5)
            store.selectSquare({ x: 4, y: 6 });
            store.selectSquare({ x: 4, y: 5 });
            expect(useGameStore.getState().currentTurn).toBe('black');

            // Move 4: Black Soldier (4, 3) -> (4, 4)
            store.selectSquare({ x: 4, y: 3 });
            store.selectSquare({ x: 4, y: 4 });
            expect(useGameStore.getState().currentTurn).toBe('red');

            // Move 5: Red Soldier (4, 5) captures Black Soldier at (4, 4) — crossing the river!
            store.selectSquare({ x: 4, y: 5 });
            store.selectSquare({ x: 4, y: 4 });
            expect(useGameStore.getState().currentTurn).toBe('black');

            const historyBeforeSave = [...useGameStore.getState().history];
            expect(historyBeforeSave.length).toBe(5);
            expect(historyBeforeSave[4].capturedPiece).toBeInstanceOf(XiangqiSoldier);

            // Save the game
            const savedJson = store.saveGame();
            expect(savedJson).toBeDefined();

            // Corrupt store state by switching to another variant
            store.initGame('shatranj', 'pvp', 'white', 'medium', false);
            expect(useGameStore.getState().currentVariantId).toBe('shatranj');

            // Load the saved game
            const loaded = store.loadGame(savedJson!);
            expect(loaded).toBe(true);

            const reloadedStore = useGameStore.getState();
            expect(reloadedStore.currentVariantId).toBe('xiangqi');
            expect(reloadedStore.engine).toBeInstanceOf(XiangqiEngine);
            expect(reloadedStore.currentTurn).toBe('black');
            expect(reloadedStore.history.length).toBe(5);

            // Verify the soldier at (4, 4) is now across the river for Red (y <= 4)
            const soldierAt44 = reloadedStore.engine.board.getPieceAt(4, 4);
            expect(soldierAt44).toBeInstanceOf(XiangqiSoldier);
            expect(soldierAt44?.color).toBe('red');

            // Since it crossed the river, it can move forward and sideways
            const legalMoves = reloadedStore.engine.getLegalMoves(soldierAt44!);
            expect(legalMoves.some(m => m.x === 3 && m.y === 4)).toBe(true); // Left
            expect(legalMoves.some(m => m.x === 5 && m.y === 4)).toBe(true); // Right
            expect(legalMoves.some(m => m.x === 4 && m.y === 3)).toBe(true); // Forward
        });

        it('should correctly undo moves in PvP, restoring captured pieces', () => {
            const store = useGameStore.getState();
            store.initGame('xiangqi', 'pvp', 'red', 'medium', false);

            // Move 1: Red Cannon (1, 7) -> (4, 7)
            store.selectSquare({ x: 1, y: 7 });
            store.selectSquare({ x: 4, y: 7 });

            // Move 2: Black Horse (1, 0) -> (2, 2)
            store.selectSquare({ x: 1, y: 0 });
            store.selectSquare({ x: 2, y: 2 });

            // Move 3: Red Soldier (4, 6) -> (4, 5)
            store.selectSquare({ x: 4, y: 6 });
            store.selectSquare({ x: 4, y: 5 });

            // Move 4: Black Soldier (4, 3) -> (4, 4)
            store.selectSquare({ x: 4, y: 3 });
            store.selectSquare({ x: 4, y: 4 });

            // Move 5: Red Soldier captures Black Soldier at (4, 4)
            store.selectSquare({ x: 4, y: 5 });
            store.selectSquare({ x: 4, y: 4 });
            expect(useGameStore.getState().history.length).toBe(5);

            // Undo Move 5
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(4);
            expect(useGameStore.getState().currentTurn).toBe('red');

            // Red Soldier should be back at (4, 5)
            const redSoldier = useGameStore.getState().engine.board.getPieceAt(4, 5);
            expect(redSoldier).toBeInstanceOf(XiangqiSoldier);
            expect(redSoldier?.color).toBe('red');

            // Captured Black Soldier should be restored at (4, 4)
            const restoredBlackSoldier = useGameStore.getState().engine.board.getPieceAt(4, 4);
            expect(restoredBlackSoldier).toBeInstanceOf(XiangqiSoldier);
            expect(restoredBlackSoldier?.color).toBe('black');

            // Undo all remaining moves
            store.undoMove(); // Undo move 4
            store.undoMove(); // Undo move 3
            store.undoMove(); // Undo move 2
            store.undoMove(); // Undo move 1

            expect(useGameStore.getState().history.length).toBe(0);
            expect(useGameStore.getState().currentTurn).toBe('red');
            expect(useGameStore.getState().engine.board.getPieceAt(1, 7)?.name).toBe('XiangqiCannon');
            expect(useGameStore.getState().engine.board.getPieceAt(1, 0)?.name).toBe('XiangqiHorse');
        });

        it('should correctly undo in vs_ai mode back to red turn', () => {
            const store = useGameStore.getState();
            store.initGame('xiangqi', 'vs_ai', 'red', 'medium', false);

            // Red (human) moves Cannon (1, 7) -> (4, 7)
            store.selectSquare({ x: 1, y: 7 });
            store.selectSquare({ x: 4, y: 7 });

            expect(useGameStore.getState().history.length).toBe(1);

            // Undo move before AI responds
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(0);
            expect(useGameStore.getState().currentTurn).toBe('red');
            expect(useGameStore.getState().engine.board.getPieceAt(1, 7)?.name).toBe('XiangqiCannon');
        });
    });

    describe('Janggi (Korean Chess)', () => {
        it('should save and load game with custom starting setups (outer / left)', () => {
            const store = useGameStore.getState();
            const customSetups = { blueSetup: 'outer' as const, redSetup: 'left' as const };
            store.initGame('janggi', 'pvp', 'blue', 'medium', false, customSetups);

            const engine = useGameStore.getState().engine as JanggiEngine;
            expect(engine.janggiSetups).toEqual(customSetups);

            // Blue Outer: file 1 has Elephant, file 2 has Horse
            expect(engine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiHorse);

            // Red Left: file 1 has Elephant, file 2 has Horse
            expect(engine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiElephant);
            expect(engine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiHorse);

            // Move 1: Blue Soldier (0, 6) -> (1, 6)
            store.selectSquare({ x: 0, y: 6 });
            store.selectSquare({ x: 1, y: 6 });
            expect(useGameStore.getState().currentTurn).toBe('red');

            // Move 2: Red passes turn
            store.passTurn();
            expect(useGameStore.getState().currentTurn).toBe('blue');
            expect(useGameStore.getState().history.length).toBe(2);
            expect(useGameStore.getState().history[1].isPass).toBe(true);

            // Save the game
            const saved = store.saveGame();
            expect(saved).toBeDefined();

            // Dirty the store
            store.initGame('classic', 'pvp', 'white', 'medium', false);

            // Load saved game
            const loaded = store.loadGame(saved!);
            expect(loaded).toBe(true);

            const reloadedStore = useGameStore.getState();
            expect(reloadedStore.currentVariantId).toBe('janggi');
            expect(reloadedStore.currentTurn).toBe('blue');
            expect(reloadedStore.history.length).toBe(2);

            const reloadedEngine = reloadedStore.engine as JanggiEngine;
            expect(reloadedEngine.janggiSetups).toEqual(customSetups);
            // Verify custom pieces remained in place
            expect(reloadedEngine.board.getPieceAt(1, 9)).toBeInstanceOf(JanggiElephant);
            expect(reloadedEngine.board.getPieceAt(2, 9)).toBeInstanceOf(JanggiHorse);
            expect(reloadedEngine.board.getPieceAt(1, 0)).toBeInstanceOf(JanggiElephant);
            expect(reloadedEngine.board.getPieceAt(2, 0)).toBeInstanceOf(JanggiHorse);
        });

        it('should correctly undo pass turns and normal moves in Janggi', () => {
            const store = useGameStore.getState();
            const setups = { blueSetup: 'right' as const, redSetup: 'outer' as const };
            store.initGame('janggi', 'pvp', 'blue', 'medium', false, setups);

            // Move 1: Blue Soldier (0, 6) -> (1, 6)
            store.selectSquare({ x: 0, y: 6 });
            store.selectSquare({ x: 1, y: 6 });

            // Move 2: Red passes
            store.passTurn();

            expect(useGameStore.getState().history.length).toBe(2);
            expect(useGameStore.getState().currentTurn).toBe('blue');

            // Undo the pass turn
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(1);
            expect(useGameStore.getState().currentTurn).toBe('red');

            // Undo the soldier move
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(0);
            expect(useGameStore.getState().currentTurn).toBe('blue');
            expect(useGameStore.getState().engine.board.getPieceAt(0, 6)?.name).toBe('JanggiSoldier');

            // Custom setups must still be preserved after undo
            const engine = useGameStore.getState().engine as JanggiEngine;
            expect(engine.janggiSetups).toEqual(setups);
        });
    });

    describe('Makruk (Thai Chess)', () => {
        it('should save, load, and undo promotion from Bia to Biangai with 100% legal moves from opening', () => {
            useGameStore.getState().initGame('makruk', 'pvp', 'white', 'medium', false);
            const store = useGameStore.getState();

            // Advance White Bia at (3, 5) towards rank 6 (row y = 2)
            // Move 1: White Bia (3, 5) -> (3, 4)
            store.selectSquare({ x: 3, y: 5 });
            store.selectSquare({ x: 3, y: 4 });

            // Move 2: Black Bia (0, 2) -> (0, 3)
            store.selectSquare({ x: 0, y: 2 });
            store.selectSquare({ x: 0, y: 3 });

            // Move 3: White Bia (3, 4) -> (3, 3)
            store.selectSquare({ x: 3, y: 4 });
            store.selectSquare({ x: 3, y: 3 });

            // Move 4: Black Bia (0, 3) -> (0, 4)
            store.selectSquare({ x: 0, y: 3 });
            store.selectSquare({ x: 0, y: 4 });

            // Move 5: White Bia (3, 3) captures Black Bia diagonally at (4, 2) (6th rank: mandatory promotion!)
            store.selectSquare({ x: 3, y: 3 });
            store.selectSquare({ x: 4, y: 2 });

            expect(useGameStore.getState().history.length).toBe(5);
            const promotedPiece = useGameStore.getState().engine?.board.getPieceAt(4, 2);
            expect(promotedPiece).toBeInstanceOf(Biangai);

            // Save the game
            const saved = store.saveGame();
            expect(saved).toBeDefined();

            // Dirty store
            store.initGame('classic', 'pvp', 'white', 'medium', false);

            // Reload game
            const loaded = store.loadGame(saved!);
            expect(loaded).toBe(true);

            const reloadedStore = useGameStore.getState();
            expect(reloadedStore.currentVariantId).toBe('makruk');
            expect(reloadedStore.history.length).toBe(5);

            const reloadedPiece = reloadedStore.engine?.board.getPieceAt(4, 2);
            expect(reloadedPiece).toBeInstanceOf(Biangai);

            // Undo the promotion move (Move 5)
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(4);
            expect(useGameStore.getState().currentTurn).toBe('white');

            // Piece should be demoted back to Bia at (3, 3)
            const restoredPiece = useGameStore.getState().engine?.board.getPieceAt(3, 3);
            expect(restoredPiece).toBeInstanceOf(Bia);
            // Captured Black Bia at (4, 2) must be restored
            const restoredBlackBia = useGameStore.getState().engine?.board.getPieceAt(4, 2);
            expect(restoredBlackBia).toBeInstanceOf(Bia);
            expect(restoredBlackBia?.color).toBe('black');
        });

        it('should preserve active counting rules across save, load, and undo', () => {
            const store = useGameStore.getState();

            // Setup lone king vs 2 boats scenario using customPieces:
            // White: Khun (4, 7), 2 Ruea (0, 7) & (7, 7)
            // Black: lone Khun (4, 0)
            const scenarioData = {
                variantId: 'makruk',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                customPieces: [
                    { name: 'Khun', id: 'k_w', color: 'white', position: { x: 4, y: 7 } },
                    { name: 'Ruea', id: 'r1_w', color: 'white', position: { x: 0, y: 7 } },
                    { name: 'Ruea', id: 'r2_w', color: 'white', position: { x: 7, y: 7 } },
                    { name: 'Khun', id: 'k_b', color: 'black', position: { x: 4, y: 0 } }
                ],
                history: []
            };

            const loadedScenario = store.loadGame(JSON.stringify(scenarioData));
            expect(loadedScenario).toBe(true);

            const engine = useGameStore.getState().engine as MakrukEngine;
            // Stronger player (White) has 3 pieces -> 8 - 3 = 5 moves
            expect(engine.getCountingStatus().isCountingActive).toBe(true);
            expect(engine.getCountingStatus().type).toBe('piece_count');
            expect(engine.getCountingStatus().remainingMoves).toBe(5);

            // Move 1: White moves Ruea
            store.selectSquare({ x: 0, y: 7 });
            store.selectSquare({ x: 0, y: 6 });

            // Move 2: Black moves Khun
            store.selectSquare({ x: 4, y: 0 });
            store.selectSquare({ x: 3, y: 0 });

            // 1 full move elapsed (2 plies) -> 4 remaining moves
            expect((useGameStore.getState().engine as MakrukEngine).getCountingStatus().remainingMoves).toBe(4);

            // Save game
            const saved = store.saveGame();
            expect(saved).toBeDefined();

            // Dirty store
            store.initGame('shatranj', 'pvp', 'white', 'medium', false);

            // Load game
            const loaded = store.loadGame(saved!);
            expect(loaded).toBe(true);

            // Verify loaded engine has counting active with exact remaining moves
            const loadedEngine = useGameStore.getState().engine as MakrukEngine;
            const loadedStatus = loadedEngine.getCountingStatus();
            expect(loadedStatus.isCountingActive).toBe(true);
            expect(loadedStatus.type).toBe('piece_count');
            expect(loadedStatus.maxMoves).toBe(5);
            expect(loadedStatus.remainingMoves).toBe(4);

            // Undo move 2 (Black Khun move)
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(1);
            expect((useGameStore.getState().engine as MakrukEngine).getCountingStatus().remainingMoves).toBe(5);

            // Undo move 1 (White Ruea move)
            store.undoMove();
            expect(useGameStore.getState().history.length).toBe(0);
            expect((useGameStore.getState().engine as MakrukEngine).getCountingStatus().remainingMoves).toBe(5);
            expect(useGameStore.getState().engine?.board.getPieceAt(0, 7)).toBeInstanceOf(Ruea);
        });

        it('should preserve user toggle deactivation of counting across save, load, and undo', () => {
            const store = useGameStore.getState();

            const scenarioData = {
                variantId: 'makruk',
                gameMode: 'pvp',
                playerColor: 'white',
                currentTurn: 'white',
                customPieces: [
                    { name: 'Khun', id: 'k_w', color: 'white', position: { x: 4, y: 7 } },
                    { name: 'Ruea', id: 'r1_w', color: 'white', position: { x: 0, y: 7 } },
                    { name: 'Ruea', id: 'r2_w', color: 'white', position: { x: 7, y: 7 } },
                    { name: 'Khun', id: 'k_b', color: 'black', position: { x: 4, y: 0 } }
                ],
                history: []
            };

            store.loadGame(JSON.stringify(scenarioData));
            const engine = useGameStore.getState().engine as MakrukEngine;
            expect(engine.getCountingStatus().isCountingActive).toBe(true);

            // User deactivates counting
            engine.stopCounting();
            expect(engine.getCountingStatus().isCountingActive).toBe(false);

            // Make a move while counting is deactivated
            store.selectSquare({ x: 0, y: 7 });
            store.selectSquare({ x: 0, y: 6 });

            // Save game
            const saved = store.saveGame();
            expect(saved).toBeDefined();

            // Switch variant
            store.initGame('classic', 'pvp', 'white', 'medium', false);

            // Reload game
            store.loadGame(saved!);
            const reloadedEngine = useGameStore.getState().engine as MakrukEngine;
            // Counting must remain deactivated as chosen by the user
            expect(reloadedEngine.getCountingStatus().isCountingActive).toBe(false);

            // Undo move
            store.undoMove();
            expect((useGameStore.getState().engine as MakrukEngine).getCountingStatus().isCountingActive).toBe(false);
        });
    });

    describe('Animation suppression: lastAction transitions', () => {
        it('should correctly transition lastAction between move, undo, and load', () => {
            const store = useGameStore.getState();
            store.initGame('classic', 'pvp', 'white', 'medium', false);
            expect(useGameStore.getState().lastAction).toBe('load');

            // Move: e4 (4, 6) -> (4, 4)
            store.selectSquare({ x: 4, y: 6 });
            store.selectSquare({ x: 4, y: 4 });
            expect(useGameStore.getState().lastAction).toBe('move');

            // Move: e5 (4, 1) -> (4, 3)
            store.selectSquare({ x: 4, y: 1 });
            store.selectSquare({ x: 4, y: 3 });
            expect(useGameStore.getState().lastAction).toBe('move');

            // Undo move
            store.undoMove();
            expect(useGameStore.getState().lastAction).toBe('undo');

            // Another undo move
            store.undoMove();
            expect(useGameStore.getState().lastAction).toBe('undo');
        });
    });
});

