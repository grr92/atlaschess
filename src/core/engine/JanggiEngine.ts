import { BaseEngine } from './BaseEngine';
import type { Position, PieceColor, Move } from '../../types';
import { Piece } from '../pieces/piecesIndex';
import type { GameVariant } from '../variants/GameVariant';
import { Board } from '../models/Board';
import { JanggiVictoryStrategy } from './strategies/VictoryStrategy';
import type { ICheckStrategy } from './strategies/CheckStrategy';

/**
 * Checks whether the two generals face each other across the board on the same
 * file or rank with no intervening pieces.
 */
export function areJanggiGeneralsFacing(board: Board): boolean {
    let blueGen: Position | null = null;
    let redGen: Position | null = null;

    for (let y = 0; y < board.rows; y++) {
        for (let x = 3; x <= 5; x++) {
            const p = board.getPieceAt(x, y);
            if (p && p.name === 'JanggiGeneral') {
                if (p.color === 'blue') blueGen = { x, y };
                if (p.color === 'red') redGen = { x, y };
            }
        }
    }

    if (!blueGen || !redGen) return false;

    // Check if on same column (vertical facing)
    if (blueGen.x === redGen.x) {
        const col = blueGen.x;
        const minY = Math.min(blueGen.y, redGen.y);
        const maxY = Math.max(blueGen.y, redGen.y);
        for (let y = minY + 1; y < maxY; y++) {
            if (board.getPieceAt(col, y)) return false;
        }
        return true;
    }

    // Check if on same row (horizontal facing)
    if (blueGen.y === redGen.y) {
        const row = blueGen.y;
        const minX = Math.min(blueGen.x, redGen.x);
        const maxX = Math.max(blueGen.x, redGen.x);
        for (let x = minX + 1; x < maxX; x++) {
            if (board.getPieceAt(x, row)) return false;
        }
        return true;
    }

    return false;
}

class JanggiCheckStrategy implements ICheckStrategy {
    isKingInCheck(color: PieceColor, board: Board): boolean {
        let generalPos: Position | null = null;
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'JanggiGeneral' && p.color === color) {
                    generalPos = { x, y };
                    break;
                }
            }
            if (generalPos) break;
        }

        if (!generalPos) return false;

        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.color !== color) {
                    const attacks = p.getPossibleMoves(board);
                    if (attacks.some(m => m.x === generalPos!.x && m.y === generalPos!.y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    filterLegalMoves(piece: Piece, board: Board, pseudoMoves: Position[]): Position[] {
        const legalMoves: Position[] = [];

        for (const move of pseudoMoves) {
            const targetPiece = board.getPieceAt(move.x, move.y);
            const originalPos = { x: piece.position.x, y: piece.position.y };

            // Simulate the move
            board.movePiece(originalPos, move);

            const inCheck = this.isKingInCheck(piece.color, board);

            // Undo the simulation
            board.movePiece(move, originalPos);
            if (targetPiece) {
                board.setPiece(targetPiece, move.x, move.y);
            }

            // In Janggi, generals facing is NOT an illegal move (unlike Xiangqi).
            // Only king in check makes a move illegal.
            if (!inCheck) {
                legalMoves.push(move);
            }
        }
        return legalMoves;
    }
}

import { type JanggiOptions, getJanggiFen } from '../variants/janggi/janggiSetup';

export class JanggiEngine extends BaseEngine {
    consecutivePasses: number = 0;
    initialFen?: string;

    get janggiSetups(): JanggiOptions | undefined {
        return this.variantOptions;
    }

    set janggiSetups(options: JanggiOptions | undefined) {
        this.variantOptions = options;
    }

    constructor(variant: GameVariant, options?: JanggiOptions) {
        super(variant, new JanggiCheckStrategy(), new JanggiVictoryStrategy());
        this.currentTurn = 'blue';
        const resolvedOptions = options || (variant as any)?.options;
        this.variantOptions = resolvedOptions;
        this.initialFen = getJanggiFen(resolvedOptions?.blueSetup, resolvedOptions?.redSetup);
    }

    rotateTurn(): void {
        this.currentTurn = this.currentTurn === 'blue' ? 'red' : 'blue';
    }

    areGeneralsFacing(board: Board = this.board): boolean {
        return areJanggiGeneralsFacing(board);
    }

    /**
     * In Janggi, a player may pass their turn at any time unless their General is in check.
     */
    canPassTurn(): boolean {
        return this.state !== 'checkmate' && this.state !== 'draw' && !this.isKingInCheck(this.currentTurn);
    }

    override passTurn(): boolean {
        if (!this.canPassTurn()) return false;

        const generalsWereFacing = this.areGeneralsFacing(this.board);

        const passRecord: Move = {
            piece: null as any,
            from: { x: -1, y: -1 },
            to: { x: -1, y: -1 },
            san: 'pass',
            isPass: true
        };
        this.history.push(passRecord);

        this.consecutivePasses++;

        // Bikjang: if the generals were facing at the start of this player's turn,
        // and the player passes (does not move away or block), it is Bikjang -> draw.
        if (generalsWereFacing && this.areGeneralsFacing(this.board)) {
            this.state = 'draw';
            return true;
        }

        // Two consecutive passes -> draw
        if (this.consecutivePasses >= 2) {
            this.state = 'draw';
            return true;
        }

        this.rotateTurn();
        this.updateGameState();
        return true;
    }

    override executeMove(from: Position, to: Position, promotionPiece?: string): boolean {
        if (this.state === 'checkmate' || this.state === 'draw') return false;

        const generalsWereFacing = this.areGeneralsFacing(this.board);

        const success = super.executeMove(from, to, promotionPiece);
        if (success) {
            this.consecutivePasses = 0;

            // Bikjang: if the generals came to face each other across the board
            // and the player to move does not move away (they were already facing and still face),
            // this is Bikjang -> draw.
            if (generalsWereFacing && this.areGeneralsFacing(this.board)) {
                this.state = 'draw';
            }
        }
        return success;
    }

    override cloneCustomFields(target: BaseEngine): void {
        if (target instanceof JanggiEngine) {
            target.consecutivePasses = this.consecutivePasses;
            target.janggiSetups = this.janggiSetups;
            target.initialFen = this.initialFen;
        }
    }
}

