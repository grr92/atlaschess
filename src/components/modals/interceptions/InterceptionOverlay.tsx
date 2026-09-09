import { useGameStore } from '../../../store/useGameStore';
import { PromotionModal } from './PromotionModal';
import { CitadelModal } from './CitadelModal';
import { SuccessionModal } from './SuccessionModal';
import { KingRescueModal } from './KingRescueModal';
import { KingPlacementBanner } from './KingPlacementBanner';

export const InterceptionOverlay = () => {
    const { activeInterception } = useGameStore();

    if (!activeInterception) return null;

    switch (activeInterception.type) {
        case 'PROMOTION':
            return <PromotionModal interception={activeInterception} />;
        case 'CITADEL_CHOICE':
            return <CitadelModal interception={activeInterception} />;
        case 'SUCCESSION_CHOICE':
            return <SuccessionModal interception={activeInterception} />;
        case 'KING_RESCUE_CHOICE':
            return <KingRescueModal interception={activeInterception} />;
        case 'KING_PLACEMENT':
            return <KingPlacementBanner />;
        default:
            return null;
    }
};
