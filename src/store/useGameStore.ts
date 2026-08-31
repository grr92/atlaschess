import { create } from 'zustand';
import { BaseEngine } from '../core/engine/BaseEngine';
import { ClassicChessEngine } from '../core/engine/ClassicChessEngine';
import { ChaturangaEngine } from "../core/engine/ChaturangaEngine.ts";
import { ClassicChess } from '../core/variants/ClassicChess';
import { ChaturangaVariant } from "../core/variants/Chaturanga.ts";
import type {Position, GameState, Move, PieceColor} from '../types';

interface GameStore {
    engine: BaseEngine | null;
    selectedPosition: Position | null;
    legalMoves: Position[];
    gameState: GameState;
    currentTurn: PieceColor;
    history: Move[];
    currentVariantId: string; // Tracks the currently active game variant
    pendingPromotion: { from: Position, to: Position } | null; // Pawn promotion state variable
    gameTime: number; // Timer global state

    // Store actions
    initGame: (variantId?: string) => void;
    selectSquare: (pos: Position) => void;
    resetGame: () => void;
    undoMove: () => void;

    // Pawn promotion actions
    confirmPromotion: (pieceName: string) => void;
    cancelPromotion: () => void;

    // Load / save actions
    saveGame: () => void;
    loadGame: (jsonData: string) => boolean;
    setGameTime: (fn: (prev: number) => number) => void; // Timer updater
}

export const useGameStore = create<GameStore>((set, get) => ({
    engine: null,
    selectedPosition: null,
    legalMoves: [],
    gameState: 'playing',
    currentTurn: 'white',
    history: [],
    currentVariantId: 'classic',
    pendingPromotion: null,
    gameTime: 0,

    setGameTime: (fn) => set((state) => ({ gameTime: fn(state.gameTime) })),

    // Initialize the game engine based on the selected variant
    initGame: (variantId = 'classic') => {
        let engine: BaseEngine;

        // Engine factory: Future variants will be added here
        switch (variantId) {
            case 'classic':
                engine = new ClassicChessEngine(new ClassicChess());
                break;
            case 'chaturanga':
                engine = new ChaturangaEngine(new ChaturangaVariant());
                break;
            default:
                console.warn(`'${variantId}' variant unknown. Loading classic chess variant.`);
                engine = new ClassicChessEngine(new ClassicChess());
        }

        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            history: engine.history,
            currentVariantId: variantId,
            gameTime: 0,
        });
    },

    selectSquare: (pos: Position) => {
        const { engine, selectedPosition, legalMoves } = get();
        if (!engine || engine.state === 'checkmate' || engine.state === 'draw') return;

        // Deselect the current position if clicked again
        if (selectedPosition && selectedPosition.x === pos.x && selectedPosition.y === pos.y) {
            set({
                selectedPosition: null,
                legalMoves: [],
            });
            return;
        }

        if (selectedPosition) {
            const isMoveValid = legalMoves.some(m => m.x === pos.x && m.y === pos.y);

            if (isMoveValid) {
                const piece = engine.board.getPieceAt(selectedPosition.x, selectedPosition.y);

                // Pawn promotion interceptor
                const isPawn = piece?.name === 'Pawn';
                const isPromotionRank = piece?.color === 'white' ? pos.y === 0 : pos.y === 7;

                if (isPawn && isPromotionRank) {
                    // Pause the game state and trigger the promotion modal
                    set({ pendingPromotion: { from: selectedPosition, to: pos } });
                    return;
                }

                // If not a promotion, execute the move normally
                const success = engine.executeMove(selectedPosition, pos);
                if (success) {
                    set({
                        selectedPosition: null,
                        legalMoves: [],
                        gameState: engine.state,
                        currentTurn: engine.currentTurn,
                        history: [...engine.history],
                    });
                    return;
                }
            }
        }

        const piece = engine.board.getPieceAt(pos.x, pos.y);

        if (piece && piece.color === engine.currentTurn) {
            const moves = engine.getLegalMoves(piece);
            set({
                selectedPosition: pos,
                legalMoves: moves,
            });
        } else {
            set({
                selectedPosition: null,
                legalMoves: [],
            });
        }
    },

    resetGame: () => {
        // Restart the game using the currently active variant
        const { currentVariantId } = get();
        get().initGame(currentVariantId);
    },

    undoMove: () => {
        const { history, currentVariantId, initGame } = get();

        // If history is empty, there is nothing to undo
        if (history.length === 0) return;

        // Save the original history excluding the last move and the time
        const newHistory = history.slice(0, -1);
        const originalTime = get().gameTime;

        // Reset the board from scratch
        initGame(currentVariantId);
        const engine = get().engine;

        if (!engine) return;

        // Replay all previous moves at lightning speed
        for (const move of newHistory) {
            let promotionPiece: string | undefined = undefined;

            // Detect if the original move included a pawn promotion in its notation (e.g., =Q)
            if (move.san?.includes('=Q')) promotionPiece = 'Queen';
            else if (move.san?.includes('=R')) promotionPiece = 'Rook';
            else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
            else if (move.san?.includes('=N')) promotionPiece = 'Knight';

            engine.executeMove(move.from, move.to, promotionPiece);
        }

        // Update the UI state with the reconstructed board
        set({
            engine,
            selectedPosition: null,
            legalMoves: [],
            gameState: engine.state,
            currentTurn: engine.currentTurn,
            history: engine.history, // Use the freshly rebuilt history from the engine
            pendingPromotion: null,
            gameTime: originalTime // The clock is restored
        });
    },

    // Action triggered when the user selects a promotion piece from the modal
    confirmPromotion: (pieceName: string) => {
        const { engine, pendingPromotion } = get();
        if (!engine || !pendingPromotion) return;

        const success = engine.executeMove(pendingPromotion.from, pendingPromotion.to, pieceName);

        if (success) {
            set({
                pendingPromotion: null,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                history: [...engine.history],
            });
        }
    },

    cancelPromotion: () => {
        set({ pendingPromotion: null, selectedPosition: null, legalMoves: [] });
    },

    saveGame: () => {
        const { currentVariantId, history, gameTime } = get();
        if (history.length === 0) return; // Game cannot be saved if it has not been played

        const saveData = { variantId: currentVariantId, history: history, time: gameTime };
        const jsonString = JSON.stringify(saveData, null, 2);

        // Create a virtual file in the browser
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Generate file name and extension
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');

        a.download = `AtlasChess_${currentVariantId}_${date}_${time}.atlas`;

        // Force download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    loadGame: (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);

            // Validation to ensure the loaded file is a structurally valid save file
            if (!parsed.variantId || !Array.isArray(parsed.history)) {
                return false;
            }

            const { initGame } = get();

            // First step is to initialize the engine for the corresponding game variant
            initGame(parsed.variantId);
            const engine = get().engine;
            if (!engine) return false;

            // Replay the full list of performed moves
            for (const move of parsed.history) {
                let promotionPiece: string | undefined = undefined;

                // Logic to handle pawn promotions if present in the saved move history
                if (move.san?.includes('=Q')) promotionPiece = 'Queen';
                else if (move.san?.includes('=R')) promotionPiece = 'Rook';
                else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
                else if (move.san?.includes('=N')) promotionPiece = 'Knight';

                engine.executeMove(move.from, move.to, promotionPiece);
            }

            // Read the saved time or put 0 if no time is found
            const loadedTime = typeof parsed.time === 'number' ? parsed.time : 0;

            // Interface update with the loaded state
            set({
                engine,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                history: engine.history,
                pendingPromotion: null,
                gameTime: loadedTime
            });
            return true;

        } catch (error) {
            console.error("Unable to load the game", error);
            return false;
        }
    }
}));