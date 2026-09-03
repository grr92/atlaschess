import { BaseEngine } from './BaseEngine';
import type { GameVariant } from '../variants/GameVariant';
import type { Position } from '../../types';
import { Piece } from '../pieces/Piece';
import { SingleRoyalCheckStrategy } from './strategies/CheckStrategy';
import { BareKingVictoryStrategy } from './strategies/VictoryStrategy';
import {
    Rook,
    Aanca,
    Unicorn,
    Lion,
    Giraffe,
    Crocodile,
    GrantPawn
} from '../pieces/piecesIndex';

export class GrantAcedrexEngine extends BaseEngine {
    public hasPawnCapturedYet: boolean = false;

    constructor(variant: GameVariant) {
        super(
            variant,
            new SingleRoyalCheckStrategy('King'),
            new BareKingVictoryStrategy({ stalemateIsWin: true })
        );
    }

    override getLegalMoves(piece: Piece): Position[] {
        if (piece instanceof GrantPawn) {
            piece.canDoubleStep = !this.hasPawnCapturedYet && !piece.hasMoved;
        }
        return super.getLegalMoves(piece);
    }

    protected override beforeMoveHook(piece: Piece, _from: Position, _to: Position, capturedPiece: Piece | null): Piece | null {
        if (piece instanceof GrantPawn && capturedPiece) {
            this.hasPawnCapturedYet = true;
        }
        return capturedPiece;
    }

    protected override afterMoveHook(piece: Piece, _from: Position, to: Position): void {
        // Automatic promotion on the last rank according to origin file
        if (piece instanceof GrantPawn) {
            const isPromotionRank = (piece.color === 'white' && to.y === 0) || (piece.color === 'black' && to.y === 11);
            if (isPromotionRank) {
                let promotedPiece: Piece;
                const promoId = `${piece.id}_promo`;
                switch (piece.originFile) {
                    case 0: case 11:
                        promotedPiece = new Rook(promoId, piece.color, to);
                        break;
                    case 1: case 10:
                        promotedPiece = new Lion(promoId, piece.color, to);
                        break;
                    case 2: case 9:
                        promotedPiece = new Unicorn(promoId, piece.color, to);
                        break;
                    case 3: case 8:
                        promotedPiece = new Giraffe(promoId, piece.color, to);
                        break;
                    case 4: case 7:
                        promotedPiece = new Crocodile(promoId, piece.color, to);
                        break;
                    case 5: case 6:
                    default:
                        promotedPiece = new Aanca(promoId, piece.color, to);
                        break;
                }
                this.board.setPiece(promotedPiece, to.x, to.y);
            }
        }
    }
}
