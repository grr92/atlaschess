import type { StoreSlice, SaveLoadSliceState, SaveLoadSliceActions } from '../types';
import type { Piece } from '../../core/pieces/Piece';
import {
    King, Queen, Rook, Bishop, Knight, Pawn,
    Shah, Shahzada, AdventitiousShah, Dabbaba, Jamal, Talia, Wazir, Zurafa, TamerlanePawn,
    Ferz, Pil, Asb, Rukh, Raja, Ratha, Asva, Mantri, Gaja, Padati, Sarbaz
} from '../../core/pieces/piecesIndex';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';

export const createSaveLoadSlice: StoreSlice<SaveLoadSliceState & SaveLoadSliceActions> = (set, get) => ({
    gameTime: 0,

    setGameTime: (fn) => set((state) => ({ gameTime: fn(state.gameTime) })),

    saveGame: () => {
        const { currentVariantId, history, gameTime, gameMode, playerColor, aiDifficulty } = get();
        if (history.length === 0) return;

        const saveData = {
            variantId: currentVariantId,
            history: history,
            time: gameTime,
            gameMode,
            playerColor,
            aiDifficulty
        };
        const jsonString = JSON.stringify(saveData, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');

        a.download = `AtlasChess_${currentVariantId}_${date}_${time}.atlas`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    loadGame: (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);

            if (!parsed.variantId) {
                return false;
            }

            const { initGame } = get();
            const loadedMode = parsed.gameMode || 'pvp';
            const loadedColor = parsed.playerColor || 'white';
            const loadedDifficulty = parsed.aiDifficulty || 'medium';

            initGame(parsed.variantId, loadedMode, loadedColor, loadedDifficulty);
            const engine = get().engine;
            if (!engine) return false;

            // Support direct custom board setup
            if (Array.isArray(parsed.customPieces)) {
                // Clear the default board grid
                engine.board.clear();

                for (const p of parsed.customPieces) {
                    let pieceInstance: Piece | null = null;
                    switch (p.name) {
                        case 'Shah': pieceInstance = new Shah(p.id, p.color, p.position); break;
                        case 'Shahzada': pieceInstance = new Shahzada(p.id, p.color, p.position); break;
                        case 'AdventitiousShah': pieceInstance = new AdventitiousShah(p.id, p.color, p.position); break;
                        case 'Dabbaba': pieceInstance = new Dabbaba(p.id, p.color, p.position); break;
                        case 'Jamal': pieceInstance = new Jamal(p.id, p.color, p.position); break;
                        case 'Talia': pieceInstance = new Talia(p.id, p.color, p.position); break;
                        case 'Zurafa': pieceInstance = new Zurafa(p.id, p.color, p.position); break;
                        case 'Wazir': pieceInstance = new Wazir(p.id, p.color, p.position); break;
                        case 'Ferz': pieceInstance = new Ferz(p.id, p.color, p.position); break;
                        case 'Pil': pieceInstance = new Pil(p.id, p.color, p.position); break;
                        case 'Asb': pieceInstance = new Asb(p.id, p.color, p.position); break;
                        case 'Rukh': pieceInstance = new Rukh(p.id, p.color, p.position); break;
                        case 'TamerlanePawn': {
                            const tp = new TamerlanePawn(p.id, p.color, p.position, p.pawnType, p.pawnName);
                            if (p.promotionStage !== undefined) tp.promotionStage = p.promotionStage;
                            if (p.isRestingOnLastRank !== undefined) tp.isRestingOnLastRank = p.isRestingOnLastRank;
                            pieceInstance = tp;
                            break;
                        }
                        // Chaturanga & Classic
                        case 'Raja': pieceInstance = new Raja(p.id, p.color, p.position); break;
                        case 'Ratha': pieceInstance = new Ratha(p.id, p.color, p.position); break;
                        case 'Asva': pieceInstance = new Asva(p.id, p.color, p.position); break;
                        case 'Mantri': pieceInstance = new Mantri(p.id, p.color, p.position); break;
                        case 'Gaja': pieceInstance = new Gaja(p.id, p.color, p.position); break;
                        case 'Padati': pieceInstance = new Padati(p.id, p.color, p.position); break;
                        case 'Sarbaz': pieceInstance = new Sarbaz(p.id, p.color, p.position); break;
                        case 'King': pieceInstance = new King(p.id, p.color, p.position); break;
                        case 'Queen': pieceInstance = new Queen(p.id, p.color, p.position); break;
                        case 'Rook': pieceInstance = new Rook(p.id, p.color, p.position); break;
                        case 'Bishop': pieceInstance = new Bishop(p.id, p.color, p.position); break;
                        case 'Knight': pieceInstance = new Knight(p.id, p.color, p.position); break;
                        case 'Pawn': pieceInstance = new Pawn(p.id, p.color, p.position); break;
                    }
                    if (pieceInstance) {
                        engine.board.setPiece(pieceInstance, p.position.x, p.position.y);
                    }
                }
                engine.updateGameState();
            } else if (Array.isArray(parsed.history)) {
                for (const move of parsed.history) {
                    let promotionPiece: string | undefined = undefined;

                    if (move.san?.includes('=Q')) promotionPiece = 'Queen';
                    else if (move.san?.includes('=R')) promotionPiece = 'Rook';
                    else if (move.san?.includes('=B')) promotionPiece = 'Bishop';
                    else if (move.san?.includes('=N')) promotionPiece = 'Knight';
                    else if (move.san?.includes('=F')) promotionPiece = 'Ferz';

                    if (move.citadelSwappedRoyalId && engine instanceof TamerlaneEngine) {
                        engine.executeCitadelSwap(move.from, move.to, move.citadelSwappedRoyalId);
                    } else {
                        engine.executeMove(move.from, move.to, promotionPiece);
                    }

                    if (move.crownedSuccessorId && engine instanceof TamerlaneEngine) {
                        engine.crownSuccessor(move.crownedSuccessorId);
                    }
                }
            }

            const loadedTime = typeof parsed.time === 'number' ? parsed.time : 0;
            if (parsed.currentTurn) {
                engine.currentTurn = parsed.currentTurn;
            }

            set({
                engine,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                history: engine.history,
                pendingPromotion: null,
                gameTime: loadedTime,
                isAiThinking: false
            });

            // If it's the AI's turn upon loading, trigger AI move
            if (loadedMode === 'vs_ai' && engine.currentTurn !== loadedColor) {
                setTimeout(() => {
                    get().triggerAiMove();
                }, 300);
            }

            return true;
        } catch (error) {
            console.error("Unable to load the game", error);
            return false;
        }
    }
});
