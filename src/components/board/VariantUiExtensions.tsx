import React from 'react';
import { SittuyinTransitionModal } from './SittuyinTransitionModal';
import { SittuyinDeployTray } from './SittuyinDeployTray';
import { ShogiDropTray } from './ShogiDropTray';

const VARIANT_OVERLAYS: Record<string, React.ComponentType> = {
    sittuyin: SittuyinTransitionModal,
};

const VARIANT_TRAYS: Record<string, React.ComponentType> = {
    sittuyin: SittuyinDeployTray,
    shogi: ShogiDropTray,
};

export const VariantOverlay: React.FC<{ variantId: string }> = ({ variantId }) => {
    const Component = VARIANT_OVERLAYS[variantId];
    return Component ? <Component /> : null;
};

export const VariantTray: React.FC<{ variantId: string }> = ({ variantId }) => {
    const Component = VARIANT_TRAYS[variantId];
    return Component ? <Component /> : null;
};
