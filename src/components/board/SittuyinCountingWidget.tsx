import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SittuyinEngine } from '../../core/engine/SittuyinEngine';
import { Hourglass } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const SittuyinCountingWidget: React.FC = () => {
    const { t } = useTranslation();
    const { engine, currentVariantId } = useGameStore();

    if (currentVariantId !== 'sittuyin' || !(engine instanceof SittuyinEngine)) {
        return null;
    }

    const status = engine.getCountingStatus();
    if (!status.isActive) {
        return null;
    }

    return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 rounded-full px-2.5 py-1 shadow-lg backdrop-blur-md whitespace-nowrap">
                <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
                <div className="flex items-center gap-1 leading-tight text-xs">
                    <span className="font-semibold text-amber-300">
                        {t.gameplay.sittuyinCount || 'Conteo'} ({status.targetMoves}):
                    </span>
                    <span className="font-black text-amber-100 font-mono">
                        {status.remainingMoves}
                    </span>
                    <span className="font-medium text-amber-400/90 text-[11px]">
                        {t.gameplay.movesRemaining}
                    </span>
                </div>
            </div>
        </div>
    );
};
