import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/useGameStore';
import { VariantRegistry } from '../../src/core/variants/variantRegistry';

describe('All Variants: Save/Load and Undo Verification', () => {
    const allVariants = VariantRegistry.getAll();

    allVariants.forEach((variantDef) => {
        const variantId = variantDef.id;

        describe(`Variant: ${variantDef.title} (${variantId})`, () => {
            it(`should save and load a game in PvP mode`, () => {
                const store = useGameStore.getState();
                store.initGame(variantId, 'pvp', 'white', 'medium', false);

                const initialEngine = useGameStore.getState().engine;
                expect(initialEngine).toBeDefined();

                // Find a legal move on initial board
                let moveExecuted = false;
                const board = initialEngine.board;
                for (let y = 0; y < board.rows; y++) {
                    for (let x = 0; x < board.cols; x++) {
                        const piece = board.getPieceAt(x, y);
                        if (piece && initialEngine.isPieceControllableByCurrentTurn(piece)) {
                            const legalMoves = initialEngine.getLegalMoves(piece);
                            if (legalMoves.length > 0) {
                                store.selectSquare({ x, y });
                                store.selectSquare(legalMoves[0]);
                                moveExecuted = true;
                                break;
                            }
                        }
                    }
                    if (moveExecuted) break;
                }

                expect(moveExecuted).toBe(true);
                const historyAfterMove = useGameStore.getState().history;
                expect(historyAfterMove.length).toBeGreaterThanOrEqual(1);

                // Save game
                const savedData = useGameStore.getState().saveGame();
                expect(savedData).toBeDefined();
                const parsed = JSON.parse(savedData!);
                expect(parsed.variantId).toBe(variantId);
                expect(parsed.history.length).toBe(historyAfterMove.length);

                // Switch to another variant to dirty state
                useGameStore.getState().initGame('classic', 'pvp', 'white', 'medium', false);

                // Load the saved game
                const loadSuccess = useGameStore.getState().loadGame(savedData!);
                expect(loadSuccess).toBe(true);

                const loadedStore = useGameStore.getState();
                expect(loadedStore.currentVariantId).toBe(variantId);
                expect(loadedStore.history.length).toBe(historyAfterMove.length);
                expect(loadedStore.currentTurn).toBe(historyAfterMove[historyAfterMove.length - 1] ? loadedStore.engine.currentTurn : 'white');
            });

            it(`should properly undo moves in PvP mode`, () => {
                const store = useGameStore.getState();
                store.initGame(variantId, 'pvp', 'white', 'medium', false);

                const engine = useGameStore.getState().engine;
                const initialTurn = engine.currentTurn;

                // Make move 1
                let move1Executed = false;
                let from1 = { x: 0, y: 0 };
                for (let y = 0; y < engine.board.rows; y++) {
                    for (let x = 0; x < engine.board.cols; x++) {
                        const piece = engine.board.getPieceAt(x, y);
                        if (piece && engine.isPieceControllableByCurrentTurn(piece)) {
                            const legalMoves = engine.getLegalMoves(piece);
                            if (legalMoves.length > 0) {
                                from1 = { x, y };
                                store.selectSquare({ x, y });
                                store.selectSquare(legalMoves[0]);
                                move1Executed = true;
                                break;
                            }
                        }
                    }
                    if (move1Executed) break;
                }

                expect(move1Executed).toBe(true);
                expect(useGameStore.getState().history.length).toBe(1);

                // Undo move 1
                useGameStore.getState().undoMove();
                expect(useGameStore.getState().history.length).toBe(0);
                expect(useGameStore.getState().currentTurn).toBe(initialTurn);

                // Verify piece is back at original square
                const restoredPiece = useGameStore.getState().engine.board.getPieceAt(from1.x, from1.y);
                expect(restoredPiece).not.toBeNull();
            });

            it(`should properly undo moves in vs_ai mode`, () => {
                const store = useGameStore.getState();
                const playerCol = variantId === 'four_seasons' ? 'green' : (variantId === 'chaturaji' ? 'red' : 'white');
                store.initGame(variantId, 'vs_ai', playerCol, 'medium', false);

                const engine = useGameStore.getState().engine;

                // Human makes move 1
                let humanMoved = false;
                let humanFrom = { x: 0, y: 0 };
                for (let y = 0; y < engine.board.rows; y++) {
                    for (let x = 0; x < engine.board.cols; x++) {
                        const piece = engine.board.getPieceAt(x, y);
                        if (piece && engine.isPieceControllableByCurrentTurn(piece)) {
                            const legalMoves = engine.getLegalMoves(piece);
                            if (legalMoves.length > 0) {
                                humanFrom = { x, y };
                                store.selectSquare({ x, y });
                                store.selectSquare(legalMoves[0]);
                                humanMoved = true;
                                break;
                            }
                        }
                    }
                    if (humanMoved) break;
                }

                expect(humanMoved).toBe(true);

                // Undo back to player's turn
                useGameStore.getState().undoMove();
                expect(useGameStore.getState().currentTurn).toBe(playerCol);
                expect(useGameStore.getState().history.length).toBe(0);

                const restoredPiece = useGameStore.getState().engine.board.getPieceAt(humanFrom.x, humanFrom.y);
                expect(restoredPiece).not.toBeNull();
            });
        });
    });

    describe('Dice Rule Variants Specific Verification', () => {
        it('should save/load Grant Acedrex in dice mode', () => {
            const store = useGameStore.getState();
            store.initGame('grant_acedrex', 'pvp', 'white', 'medium', true);
            expect(useGameStore.getState().useDiceRule).toBe(true);

            // Set dice roll for Pawn (1)
            useGameStore.setState({ currentDiceRoll: 1, isRollingDice: false });
            // White Pawn at (0, 8) -> (0, 7)
            store.selectSquare({ x: 0, y: 8 });
            store.selectSquare({ x: 0, y: 7 });

            const saved = store.saveGame();
            expect(saved).toBeDefined();

            store.initGame('classic', 'pvp', 'white', 'medium', false);
            const loaded = store.loadGame(saved!);
            expect(loaded).toBe(true);
            expect(useGameStore.getState().currentVariantId).toBe('grant_acedrex');
            expect(useGameStore.getState().useDiceRule).toBe(true);
        });

        it('should save/load Chaturaji in dice mode', () => {
            const store = useGameStore.getState();
            store.initGame('chaturaji', 'pvp', 'red', 'medium', true);
            expect(useGameStore.getState().useDiceRule).toBe(true);

            // Set dice roll for Pawn (1)
            useGameStore.setState({ currentDiceRoll: 1, isRollingDice: false });
            // Red Pawn at (6, 4) -> (5, 4)
            store.selectSquare({ x: 6, y: 4 });
            store.selectSquare({ x: 5, y: 4 });

            const saved = store.saveGame();
            expect(saved).toBeDefined();

            store.initGame('classic', 'pvp', 'white', 'medium', false);
            const loaded = store.loadGame(saved!);
            expect(loaded).toBe(true);
            expect(useGameStore.getState().currentVariantId).toBe('chaturaji');
            expect(useGameStore.getState().useDiceRule).toBe(true);
            expect(useGameStore.getState().subTurn).toBe(2);
        });

        it('should not allow passing turn in Grant Acedrex (only Chaturaji allows pass turn)', () => {
            const store = useGameStore.getState();
            store.initGame('grant_acedrex', 'pvp', 'white', 'medium', true);

            const initialTurn = useGameStore.getState().currentTurn;
            const initialHistoryLen = useGameStore.getState().history.length;

            store.passTurn();

            expect(useGameStore.getState().currentTurn).toBe(initialTurn);
            expect(useGameStore.getState().history.length).toBe(initialHistoryLen);
        });

        it('should properly load and execute mate-in-one in Four Seasons custom setup', () => {
            const store = useGameStore.getState();
            const mateSave = {
                variantId: 'four_seasons',
                gameMode: 'pvp',
                playerColor: 'green',
                currentTurn: 'green',
                useDiceRule: false,
                customPieces: [
                    { id: 'k_g', name: 'FourSeasonsKing', color: 'green', position: { x: 0, y: 7 } },
                    { id: 'g_g', name: 'FourSeasonsGeneral', color: 'green', position: { x: 6, y: 2 } },
                    { id: 'r_g', name: 'FourSeasonsRook', color: 'green', position: { x: 7, y: 5 } },
                    { id: 'k_r', name: 'FourSeasonsKing', color: 'red', position: { x: 7, y: 0 } },
                    { id: 'r_r', name: 'FourSeasonsRook', color: 'red', position: { x: 6, y: 0 } },
                    { id: 'b_r', name: 'FourSeasonsBishop', color: 'red', position: { x: 6, y: 1 } },
                    { id: 'k_b', name: 'FourSeasonsKing', color: 'black', position: { x: 3, y: 7 } },
                    { id: 'k_w', name: 'FourSeasonsKing', color: 'white', position: { x: 0, y: 0 } }
                ]
            };

            const loaded = store.loadGame(JSON.stringify(mateSave));
            expect(loaded).toBe(true);
            expect(useGameStore.getState().currentTurn).toBe('green');

            // Green Rook moves (7, 5) -> (7, 1), checkmating Red!
            useGameStore.getState().selectSquare({ x: 7, y: 5 });
            useGameStore.getState().selectSquare({ x: 7, y: 1 });

            // Turn advances directly to black without blocking modal
            expect(useGameStore.getState().activeInterception).toBeNull();
            expect(useGameStore.getState().currentTurn).toBe('black');
            expect(useGameStore.getState().engine.board.getPieceAt(7, 0)).toBeNull(); // Red King removed
            expect(useGameStore.getState().engine.annexedArmies['green']).toContain('red');

            // Black moves King (3, 7) -> (4, 7)
            useGameStore.getState().selectSquare({ x: 3, y: 7 });
            useGameStore.getState().selectSquare({ x: 4, y: 7 });
            expect(useGameStore.getState().currentTurn).toBe('white');

            // White moves King (0, 0) -> (0, 1)
            useGameStore.getState().selectSquare({ x: 0, y: 0 });
            useGameStore.getState().selectSquare({ x: 0, y: 1 });
            expect(useGameStore.getState().currentTurn).toBe('green');

            // Now it's Green's turn again! Green can move the annexed Red Rook at (6, 0)
            useGameStore.getState().selectSquare({ x: 6, y: 0 });
            const legalMovesForRedRook = useGameStore.getState().legalMoves;
            expect(legalMovesForRedRook.length).toBeGreaterThan(0);
            expect(legalMovesForRedRook.some(m => m.x === 5 && m.y === 0)).toBe(true);

            // Green moves Red Rook to (5, 0)
            useGameStore.getState().selectSquare({ x: 5, y: 0 });
            expect(useGameStore.getState().engine.board.getPieceAt(5, 0)?.id).toBe('r_r');
            expect(useGameStore.getState().currentTurn).toBe('black');

            // Now test undoMove(): Undo all 4 moves back to the initial loaded state!
            useGameStore.getState().undoMove(); // Undo Green's Red Rook move
            expect(useGameStore.getState().currentTurn).toBe('green');
            expect(useGameStore.getState().engine.board.getPieceAt(6, 0)?.id).toBe('r_r');
            expect(useGameStore.getState().engine.board.getPieceAt(5, 0)).toBeNull();

            useGameStore.getState().undoMove(); // Undo White move
            expect(useGameStore.getState().currentTurn).toBe('white');

            useGameStore.getState().undoMove(); // Undo Black move
            expect(useGameStore.getState().currentTurn).toBe('black');

            useGameStore.getState().undoMove(); // Undo Green mate move
            expect(useGameStore.getState().currentTurn).toBe('green');
            // The board is restored to the EXACT loaded custom position (Red King is back at 7,0, Green Rook back at 7,5)
            expect(useGameStore.getState().engine.board.getPieceAt(7, 0)?.id).toBe('k_r');
            expect(useGameStore.getState().engine.board.getPieceAt(7, 5)?.id).toBe('r_g');
            expect(useGameStore.getState().engine.annexedArmies['green']).toEqual(['green']);
            // Verify board did not reset to the default 32-piece starting setup (e.g. a8 had King in default, but in custom it's white king at 0,0)
            expect(useGameStore.getState().engine.board.getAllPieces().length).toBe(8);
        });

        it('should properly load and execute stalemate-in-one in Four Seasons custom setup', () => {
            const store = useGameStore.getState();
            const stalemateSave = {
                variantId: 'four_seasons',
                gameMode: 'pvp',
                playerColor: 'green',
                currentTurn: 'green',
                useDiceRule: false,
                customPieces: [
                    { id: 'k_g', name: 'FourSeasonsKing', color: 'green', position: { x: 0, y: 0 } },
                    { id: 'r_g', name: 'FourSeasonsRook', color: 'green', position: { x: 5, y: 5 } },
                    { id: 'k_r', name: 'FourSeasonsKing', color: 'red', position: { x: 7, y: 0 } },
                    { id: 'p_r1', name: 'FourSeasonsPawn', color: 'red', position: { x: 6, y: 0 }, direction: { dx: 0, dy: 1 } },
                    { id: 'p_r2', name: 'FourSeasonsPawn', color: 'red', position: { x: 6, y: 1 }, direction: { dx: 0, dy: -1 } },
                    { id: 'p_r3', name: 'FourSeasonsPawn', color: 'red', position: { x: 7, y: 1 }, direction: { dx: -1, dy: 0 } },
                    { id: 'k_b', name: 'FourSeasonsKing', color: 'black', position: { x: 0, y: 7 } },
                    { id: 'k_w', name: 'FourSeasonsKing', color: 'white', position: { x: 7, y: 7 } }
                ]
            };

            const loaded = store.loadGame(JSON.stringify(stalemateSave));
            expect(loaded).toBe(true);
            expect(useGameStore.getState().currentTurn).toBe('green');

            // Green Rook moves (5, 5) -> (5, 4)
            useGameStore.getState().selectSquare({ x: 5, y: 5 });
            useGameStore.getState().selectSquare({ x: 5, y: 4 });

            // Turn rotates to Red, Red has no legal moves and is not in check -> stalemated!
            // Red's pieces are removed, turn rotates to Black
            const stateAfter = useGameStore.getState();
            expect(stateAfter.engine.board.getPieceAt(7, 0)).toBeNull(); // Red King removed
            expect(stateAfter.engine.board.getPieceAt(6, 0)).toBeNull(); // Red pawn removed
            expect(stateAfter.engine.board.getPieceAt(6, 1)).toBeNull();
            expect(stateAfter.engine.board.getPieceAt(7, 1)).toBeNull();
            expect(stateAfter.engine.hasKingAlive('red')).toBe(false);
            expect(stateAfter.currentTurn).toBe('black');
        });
    });
});
