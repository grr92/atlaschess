import { useGameStore } from '../../store/useGameStore';
import { ChaturajiEngine, type ChaturajiColor } from '../../core/engine/ChaturajiEngine';
import { useTranslation } from '../../i18n';
import { Coins, Crown, ShieldAlert } from 'lucide-react';

const PLAYER_COLORS: { color: ChaturajiColor; labelKey: 'red' | 'green' | 'yellow' | 'blue'; bgDot: string; borderRing: string; team: string }[] = [
    { color: 'red', labelKey: 'red', bgDot: 'bg-red-500', borderRing: 'ring-red-500/50 border-red-500/40', team: 'A' },
    { color: 'green', labelKey: 'green', bgDot: 'bg-emerald-500', borderRing: 'ring-emerald-500/50 border-emerald-500/40', team: 'B' },
    { color: 'yellow', labelKey: 'yellow', bgDot: 'bg-amber-400', borderRing: 'ring-amber-400/50 border-amber-400/40', team: 'A' },
    { color: 'blue', labelKey: 'blue', bgDot: 'bg-sky-500', borderRing: 'ring-sky-500/50 border-sky-500/40', team: 'B' },
];

export const ChaturajiStakesCounter = () => {
    const { t } = useTranslation();
    const engine = useGameStore((state) => state.engine);
    const currentTurn = useGameStore((state) => state.currentTurn);
    const gameState = useGameStore((state) => state.gameState);

    if (!(engine instanceof ChaturajiEngine)) {
        return null;
    }

    const stakes = engine.stakes;
    const isGameOver = gameState === 'checkmate' || gameState === 'draw';
    const matchWinner = isGameOver ? engine.getMatchWinner() : null;

    return (
        <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 text-atlas-titleText">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <h3 className="font-extrabold text-xs text-amber-400 tracking-widest uppercase flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {t.gameplay.chaturajiStakesTitle}
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-white/10">
                    4 Players
                </span>
            </div>

            {/* Game Over Winner Banner */}
            {isGameOver && matchWinner && (
                <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/50 text-center animate-in fade-in">
                    {matchWinner.winner ? (
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-amber-400" />
                                {t.gameplay.winnerByStakes}: {t.common[matchWinner.winner as 'red' | 'green' | 'yellow' | 'blue']}
                            </span>
                            <span className="text-[11px] text-slate-300 mt-0.5 font-medium">
                                {matchWinner.maxStakes} {t.gameplay.wonStakes.toLowerCase()}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-black text-sky-300 uppercase tracking-wider">
                                {t.gameplay.draw}
                            </span>
                            {matchWinner.maxStakes > 0 && (
                                <span className="text-[11px] text-slate-300 mt-0.5">
                                    {matchWinner.tiedWinners.map(w => t.common[w as 'red' | 'green' | 'yellow' | 'blue']).join(' & ')} ({matchWinner.maxStakes} {t.gameplay.wonStakes.toLowerCase()})
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col gap-2.5 justify-around">
                {PLAYER_COLORS.map(({ color, labelKey, bgDot, borderRing, team }) => {
                    const isTurn = !isGameOver && currentTurn === color;
                    const isWinner = isGameOver && matchWinner?.winner === color;
                    const isAlive = engine.hasKingAlive(color);
                    const isPartnerArmyControlled = engine.partnerControlled[color] !== null;
                    const controllingPartner = Object.entries(engine.partnerControlled).find(
                        ([, controller]) => controller === color
                    );
                    const playerScore = stakes[color] || 0;
                    const colorName = t.common[labelKey];

                    return (
                        <div
                            key={color}
                            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                                isWinner
                                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                                    : isTurn
                                        ? `bg-slate-800/90 ${borderRing} shadow-md ring-2`
                                        : 'bg-slate-900/40 border-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-3.5 h-3.5 rounded-full ${bgDot} shadow-sm flex-shrink-0`} />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-200">
                                            {colorName}
                                        </span>
                                        <span className="text-[9px] px-1 py-0.1 bg-white/5 border border-white/10 rounded text-slate-400 font-mono">
                                            Team {team}
                                        </span>
                                        {isTurn && (
                                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold rounded animate-pulse">
                                                Turn
                                            </span>
                                        )}
                                        {isWinner && (
                                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded flex items-center gap-0.5">
                                                <Crown className="w-2.5 h-2.5 fill-slate-950" />
                                                Winner
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                        {!isAlive && (
                                            <span className="text-red-400 flex items-center gap-0.5">
                                                <ShieldAlert className="w-3 h-3" /> Fallen
                                            </span>
                                        )}
                                        {isPartnerArmyControlled && (
                                            <span className="text-sky-300">
                                                • Controlled
                                            </span>
                                        )}
                                        {controllingPartner && (
                                            <span className="text-emerald-300 flex items-center gap-0.5">
                                                <Crown className="w-3 h-3" /> Partner Cmd
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-sm font-black text-amber-300 font-mono">
                                    {playerScore}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 leading-tight flex justify-between items-center">
                <span>Alliances: Red ↔ Yellow | Green ↔ Blue</span>
            </div>
        </div>
    );
};
