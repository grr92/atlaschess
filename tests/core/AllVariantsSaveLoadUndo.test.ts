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
                const playerCol = variantId === 'chaturaji' ? 'red' : 'white';
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
    });
});
