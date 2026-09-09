import type { StoreSlice, SaveLoadSliceState, SaveLoadSliceActions } from '../types';
import type { Piece } from '../../core/pieces/Piece';
import {
    King, Queen, Rook, Bishop, Knight, Pawn,
    Shah, Shahzada, AdventitiousShah, Dabbaba, Jamal, Talia, Wazir, Zurafa, TamerlanePawn,
    Ferz, Pil, Asb, Rukh, Raja, Ratha, Asva, Mantri, Gaja, Padati, Sarbaz,
    ChaturajiKing, ChaturajiElephant, ChaturajiHorse, ChaturajiBoat, ChaturajiPawn,
    GrantKing, Aanca, Unicorn, Lion, Giraffe, Crocodile, GrantPawn,
    CourierKing, Courier, CourierBishop, CourierQueen, Schleich, Sage, CourierPawn
} from '../../core/pieces/piecesIndex';
import { TamerlaneEngine } from '../../core/engine/TamerlaneEngine';
import { ChaturajiEngine } from '../../core/engine/ChaturajiEngine';

export const createSaveLoadSlice: StoreSlice<SaveLoadSliceState & SaveLoadSliceActions> = (set, get) => ({
    gameTime: 0,

    setGameTime: (fn) => set((state) => ({ gameTime: fn(state.gameTime) })),

    saveGame: () => {
        const { currentVariantId, history, gameTime, gameMode, playerColor, aiDifficulty, useDiceRule, subTurn, currentDiceRoll } = get();
        if (history.length === 0) return;

        const saveData = {
            variantId: currentVariantId,
            history: history,
            time: gameTime,
            gameMode,
            playerColor,
            currentTurn: get().currentTurn,
            aiDifficulty,
            useDiceRule: !!useDiceRule,
            subTurn: subTurn || 1,
            currentDiceRoll: currentDiceRoll || null
        };
        const jsonString = JSON.stringify(saveData, null, 2);

        if (typeof document !== 'undefined') {
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
        }

        return jsonString;
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
            const loadedUseDiceRule = parsed.useDiceRule !== undefined ? !!parsed.useDiceRule : false;

            initGame(parsed.variantId, loadedMode, loadedColor, loadedDifficulty, loadedUseDiceRule);
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
                        // Chaturaji
                        case 'ChaturajiKing': pieceInstance = new ChaturajiKing(p.id, p.color, p.position); break;
                        case 'ChaturajiElephant': pieceInstance = new ChaturajiElephant(p.id, p.color, p.position); break;
                        case 'ChaturajiHorse': pieceInstance = new ChaturajiHorse(p.id, p.color, p.position); break;
                        case 'ChaturajiBoat': pieceInstance = new ChaturajiBoat(p.id, p.color, p.position); break;
                        case 'ChaturajiPawn': pieceInstance = new ChaturajiPawn(p.id, p.color, p.position); break;
                        // Grant Acedrex
                        case 'GrantKing': pieceInstance = new GrantKing(p.id, p.color, p.position); break;
                        case 'Aanca': pieceInstance = new Aanca(p.id, p.color, p.position); break;
                        case 'Unicorn': pieceInstance = new Unicorn(p.id, p.color, p.position); break;
                        case 'Lion': pieceInstance = new Lion(p.id, p.color, p.position); break;
                        case 'Giraffe': pieceInstance = new Giraffe(p.id, p.color, p.position); break;
                        case 'Crocodile': pieceInstance = new Crocodile(p.id, p.color, p.position); break;
                        case 'GrantPawn': {
                            const originFile = p.originFile !== undefined ? p.originFile : p.position.x;
                            const gp = new GrantPawn(p.id, p.color, p.position, originFile);
                            pieceInstance = gp;
                            break;
                        }
                        // Courier Chess
                        case 'CourierKing': pieceInstance = new CourierKing(p.id, p.color, p.position); break;
                        case 'Courier': pieceInstance = new Courier(p.id, p.color, p.position); break;
                        case 'CourierBishop': pieceInstance = new CourierBishop(p.id, p.color, p.position); break;
                        case 'CourierQueen': pieceInstance = new CourierQueen(p.id, p.color, p.position); break;
                        case 'Schleich': pieceInstance = new Schleich(p.id, p.color, p.position); break;
                        case 'Sage': pieceInstance = new Sage(p.id, p.color, p.position); break;
                        case 'CourierPawn': pieceInstance = new CourierPawn(p.id, p.color, p.position); break;
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
                    if (move.isPass || move.san === 'pass') {
                        engine.passTurn();
                        continue;
                    }

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

                    if (engine instanceof ChaturajiEngine) {
                        if (move.rescuedKingPlacement) {
                            engine.confirmKingRescue();
                            engine.placeRescuedKing(move.rescuedKingPlacement.pos);
                        } else if (move.rescuedKingDeclined || engine.pendingKingRescueChoice) {
                            engine.declineKingRescue();
                        }
                    }
                }
            }

            const loadedTime = typeof parsed.time === 'number' ? parsed.time : 0;
            const lastMove = engine.history.length > 0 ? engine.history[engine.history.length - 1] : null;
            const postInterception = lastMove ? engine.getPostMoveInterception(lastMove) : null;

            set({
                engine,
                selectedPosition: null,
                legalMoves: [],
                gameState: engine.state,
                currentTurn: engine.currentTurn,
                subTurn: (engine as any).subTurn || 1,
                history: engine.history,
                activeInterception: postInterception || null,
                gameTime: loadedTime,
                isAiThinking: false,
                useDiceRule: loadedUseDiceRule,
                currentDiceRoll: null,
                isRollingDice: false,
            });

            if (loadedUseDiceRule) {
                get().rollDiceForCurrentTurn(engine, engine.currentTurn);
            }

            // If it's the AI's turn upon loading, trigger AI move
            const activeController = engine.getActiveController();
            if (loadedMode === 'vs_ai' && activeController !== loadedColor) {
                setTimeout(() => {
                    get().triggerAiMove();
                }, loadedUseDiceRule ? 850 : 300);
            }

            return true;
        } catch (error) {
            console.error("Unable to load the game", error);
            return false;
        }
    }
});

