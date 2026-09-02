import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const MoveHistory = () => {
    const { history, gameState, currentTurn } = useGameStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom of the history whenever a new move is made
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Group moves into pairs (White & Black) for standard notation display
    const pairedMoves = [];
    for (let i = 0; i < history.length; i += 2) {
        pairedMoves.push([history[i], history[i + 1]]);
    }

    // Determine final match result string
    let matchResult = '';
    if (gameState === 'checkmate') {
        matchResult = currentTurn === 'white' ? '0-1' : '1-0';
    } else if (gameState === 'draw') {
        matchResult = '½-½';
    }

    return (
        <div className="bg-atlas-surface/80 backdrop-blur-md rounded-2xl p-4 w-full h-full flex flex-col shadow-lg border border-white/10 overflow-hidden min-h-0">

            <h3 className="font-extrabold mb-3 pb-2 text-xs text-amber-400 tracking-widest uppercase border-b border-white/5">
                Match History
            </h3>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {pairedMoves.length === 0 && (
                    <div className="opacity-40 text-sm text-slate-400 italic text-center mt-8">
                        No moves yet. Start playing!
                    </div>
                )}

                {pairedMoves.map((pair, index) => (
                    <div key={index} className="flex text-sm text-slate-300 py-1.5 hover:bg-white/5 rounded-lg px-2 transition-colors">
                        <span className="w-8 opacity-40 font-mono select-none text-amber-400/80">{index + 1}.</span>
                        <span className="flex-1 font-medium text-white">
                            {pair[0].san}
                        </span>
                        <span className="flex-1 font-medium opacity-80">
                            {pair[1] ? pair[1].san : ''}
                        </span>
                    </div>
                ))}

                {matchResult && (
                    <div className="text-center text-amber-400 font-extrabold text-base mt-4 tracking-widest bg-amber-500/10 py-1.5 rounded-xl border border-amber-500/20">
                        {matchResult}
                    </div>
                )}
            </div>
        </div>
    );
};