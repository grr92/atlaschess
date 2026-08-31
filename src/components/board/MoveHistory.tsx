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
        <div className="bg-atlas-surface rounded-xl p-4 w-full h-full flex flex-col shadow-sm overflow-hidden min-h-0">

            <h3 className="font-bold mb-3 pb-2 opacity-80 text-sm text-atlas-titleText tracking-wide uppercase">
                Match History
            </h3>

            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {pairedMoves.length === 0 && (
                    <div className="opacity-60 text-sm text-atlas-normalText italic text-center mt-8">
                        No moves yet. Start playing!
                    </div>
                )}

                {pairedMoves.map((pair, index) => (
                    <div key={index} className="flex text-sm text-atlas-normalText py-1.5 hover:bg-black/20 rounded px-2 transition-colors">
                        <span className="w-8 opacity-50 font-mono select-none">{index + 1}.</span>
                        <span className="flex-1 font-medium">
                            {pair[0].san}
                        </span>
                        <span className="flex-1 font-medium opacity-80">
                            {pair[1] ? pair[1].san : ''}
                        </span>
                    </div>
                ))}

                {matchResult && (
                    <div className="text-center text-atlas-normalText font-bold mt-4 tracking-widest">
                        {matchResult}
                    </div>
                )}
            </div>
        </div>
    );
};