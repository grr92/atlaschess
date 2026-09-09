import type { Position, PieceColor } from './index';

export type GameInterception =
    | { type: 'PROMOTION'; from: Position; to: Position; availablePieces?: string[] }
    | { type: 'CITADEL_CHOICE'; from: Position; to: Position; royals: { id: string; name: string }[] }
    | { type: 'SUCCESSION_CHOICE'; color: PieceColor; royals: { id: string; name: string }[] }
    | { type: 'KING_RESCUE_CHOICE'; capturingColor: PieceColor; partnerColor: PieceColor }
    | { type: 'KING_PLACEMENT'; color: PieceColor };

export type InterceptionDecision =
    | { type: 'PROMOTION'; pieceName: string }
    | { type: 'CITADEL_SWAP'; chosenRoyalId: string }
    | { type: 'CITADEL_DRAW' }
    | { type: 'SUCCESSION'; chosenRoyalId: string }
    | { type: 'KING_RESCUE_ACCEPT' }
    | { type: 'KING_RESCUE_DECLINE' }
    | { type: 'KING_PLACEMENT'; pos: Position };
