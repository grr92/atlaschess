import { BaseEngine } from './BaseEngine';
import type { Position, PieceColor } from '../../types';
import { Piece } from '../pieces/piecesIndex';
import type { GameVariant } from '../variants/GameVariant';
import { Board } from '../models/Board';
import { StandardVictoryStrategy } from './strategies/VictoryStrategy';
import type { ICheckStrategy } from './strategies/CheckStrategy';

class XiangqiCheckStrategy implements ICheckStrategy {
    isKingInCheck(color: PieceColor, board: Board): boolean {
        let generalPos: Position | null = null;
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'XiangqiGeneral' && p.color === color) {
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

    private areGeneralsFacing(board: Board): boolean {
        let redGen: Position | null = null;
        let blackGen: Position | null = null;
        
        for (let y = 0; y < board.rows; y++) {
            for (let x = 3; x <= 5; x++) { // Generals are always in columns 3 to 5
                const p = board.getPieceAt(x, y);
                if (p && p.name === 'XiangqiGeneral') {
                    if (p.color === 'red') redGen = { x, y };
                    if (p.color === 'black') blackGen = { x, y };
                }
            }
        }
        
        if (redGen && blackGen && redGen.x === blackGen.x) {
            const x = redGen.x;
            const minY = Math.min(redGen.y, blackGen.y);
            const maxY = Math.max(redGen.y, blackGen.y);
            let hasBlocker = false;
            for (let y = minY + 1; y < maxY; y++) {
                if (board.getPieceAt(x, y)) {
                    hasBlocker = true;
                    break;
                }
            }
            if (!hasBlocker) return true;
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
            const facing = this.areGeneralsFacing(board);

            // Undo the simulation
            board.movePiece(move, originalPos);
            if (targetPiece) {
                board.setPiece(targetPiece, move.x, move.y);
            }

            if (!inCheck && !facing) {
                legalMoves.push(move);
            }
        }
        return legalMoves;
    }
}

export class XiangqiEngine extends BaseEngine {
    constructor(variant: GameVariant) {
        super(variant, new XiangqiCheckStrategy(), new StandardVictoryStrategy({ stalemateIsWin: true }));
        this.currentTurn = 'red';
    }

    rotateTurn(): void {
        this.currentTurn = this.currentTurn === 'red' ? 'black' : 'red';
    }
}
