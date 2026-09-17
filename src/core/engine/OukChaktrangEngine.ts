import { MakrukEngine } from './MakrukEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Piece } from '../pieces/Piece';
import type { Position } from '../../types';

export class OukChaktrangEngine extends MakrukEngine {
    public override initialFen = 'rnsmksnr/8/pppppppp/8/8/PPPPPPPP/8/RNSKMSNR w DEde - 0 1';

    constructor(variant: GameVariant, options?: any) {
        super(variant, options);
    }

    /**
     * Checks whether any piece has been captured in the entire game history.
     * The special opening moves for Lord and Seed only apply if no captures have occurred yet.
     */
    public hasAnyCaptureOccurred(): boolean {
        return this.history.some(move => !!move.capturedPiece);
    }

    /**
     * In Ouk Chaktrang:
     * If no pieces have been captured so far in the game:
     * 1) On the Lord's (Khun) first move, and only if not in check: can move like a horse.
     * 2) On the Seed's (Met) first move: can move two spaces straight ahead.
     */
    override getLegalMoves(piece: Piece): Position[] {
        const lastMove = this.history.length > 0 ? this.history[this.history.length - 1] : undefined;
        const pseudoMoves = piece.getPossibleMoves(this.board, lastMove);

        if (!this.hasAnyCaptureOccurred()) {
            // 1) Lord's first move: like a horse, and ONLY if not currently in check
            if (piece.name === 'Khun' && !piece.hasMoved && !this.isKingInCheck(piece.color)) {
                const knightOffsets = [
                    { x: 1, y: 2 }, { x: 2, y: 1 },
                    { x: -1, y: 2 }, { x: -2, y: 1 },
                    { x: 1, y: -2 }, { x: 2, y: -1 },
                    { x: -1, y: -2 }, { x: -2, y: -1 }
                ];

                for (const offset of knightOffsets) {
                    const tx = piece.position.x + offset.x;
                    const ty = piece.position.y + offset.y;
                    if (!this.board.isOutOfBounds(tx, ty)) {
                        const targetPiece = this.board.getPieceAt(tx, ty);
                        if (targetPiece === null || targetPiece.color !== piece.color) {
                            pseudoMoves.push({ x: tx, y: ty });
                        }
                    }
                }
            }

            // 2) Seed's first move: two spaces straight ahead
            if (piece.name === 'Met' && !piece.hasMoved) {
                const forwardDy = piece.color === 'white' ? -2 : 2;
                const tx = piece.position.x;
                const ty = piece.position.y + forwardDy;
                if (!this.board.isOutOfBounds(tx, ty)) {
                    const targetPiece = this.board.getPieceAt(tx, ty);
                    if (targetPiece === null || targetPiece.color !== piece.color) {
                        pseudoMoves.push({ x: tx, y: ty });
                    }
                }
            }
        }

        if (this.checkStrategy) {
            return this.checkStrategy.filterLegalMoves(piece, this.board, pseudoMoves);
        }
        return pseudoMoves;
    }

    /**
     * Generates FEN for Ouk Chaktrang compatible with Fairy-Stockfish.
     * Uses DEde in castling field when Lord / Seed have their special opening move rights.
     */
    public override getFen(): string {
        const rows: string[] = [];

        for (let y = 0; y < this.board.rows; y++) {
            let emptyCount = 0;
            let rowStr = '';

            for (let x = 0; x < this.board.cols; x++) {
                const p = this.board.getPieceAt(x, y);
                if (!p) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }
                    let char = '';
                    switch (p.name) {
                        case 'Khun': char = 'k'; break;
                        case 'Met': char = 'm'; break;
                        case 'Khon': char = 's'; break;
                        case 'Ma': char = 'n'; break;
                        case 'Ruea': char = 'r'; break;
                        case 'Bia': char = 'p'; break;
                        case 'Biangai': char = 'm'; break;
                        default: char = 'p'; break;
                    }
                    rowStr += p.color === 'white' ? char.toUpperCase() : char.toLowerCase();
                }
            }

            if (emptyCount > 0) {
                rowStr += emptyCount;
            }
            rows.push(rowStr);
        }

        const placement = rows.join('/');
        const activeColor = this.currentTurn === 'white' ? 'w' : 'b';

        // Calculate special rights flags for Fairy-Stockfish (DEde format)
        let castling = '-';
        if (!this.hasAnyCaptureOccurred()) {
            let flags = '';

            // White King on d1 (D)
            const whiteKing = this.board.getPieceAt(3, 7);
            if (whiteKing && whiteKing.name === 'Khun' && whiteKing.color === 'white' && !whiteKing.hasMoved) {
                flags += 'D';
            }

            // White Seed on e1 (E)
            const whiteSeed = this.board.getPieceAt(4, 7);
            if (whiteSeed && whiteSeed.name === 'Met' && whiteSeed.color === 'white' && !whiteSeed.hasMoved) {
                flags += 'E';
            }

            // Black Seed on d8 (d)
            const blackSeed = this.board.getPieceAt(3, 0);
            if (blackSeed && blackSeed.name === 'Met' && blackSeed.color === 'black' && !blackSeed.hasMoved) {
                flags += 'd';
            }

            // Black King on e8 (e)
            const blackKing = this.board.getPieceAt(4, 0);
            if (blackKing && blackKing.name === 'Khun' && blackKing.color === 'black' && !blackKing.hasMoved) {
                flags += 'e';
            }

            if (flags.length > 0) {
                castling = flags;
            }
        }

        const countingStatus = this.getCountingStatus();
        let countingField = '-';
        let halfmoves = 0;

        if (countingStatus.isCountingActive && countingStatus.type !== 'none') {
            countingField = `${countingStatus.maxMoves * 2}`;
            halfmoves = countingStatus.currentMoves * 2;
        }

        const fullmoves = Math.floor(this.history.length / 2) + 1;

        return `${placement} ${activeColor} ${castling} ${countingField} ${halfmoves} ${fullmoves}`;
    }
}
