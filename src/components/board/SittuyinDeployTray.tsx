import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../i18n';
import { SittuyinEngine } from '../../core/engine/SittuyinEngine';
import { getPieceImage } from '../../utils/pieceMapper';
import { createSittuyinPiece, type SittuyinPieceName } from '../../core/variants/sittuyin/sittuyinSetup';
import { Check, RotateCcw, Swords } from 'lucide-react';
import type { PieceColor } from '../../types';

const PIECE_TYPES: { name: SittuyinPieceName; total: number }[] = [
    { name: 'Mingyi', total: 1 },
    { name: 'Sitke', total: 1 },
    { name: 'Sin', total: 2 },
    { name: 'Myin', total: 2 },
    { name: 'Yahhta', total: 2 },
];

export const SittuyinDeployTray: React.FC = () => {
    const { t } = useTranslation();
    const {
        engine,
        sittuyinSelectedPiece,
        selectSittuyinDeployPiece,
        autoDeploySittuyin,
        resetSittuyinDeploy,
        confirmSittuyinDeploy,
    } = useGameStore();

    if (!engine || !(engine instanceof SittuyinEngine) || !engine.isDeploying()) {
        return null;
    }

    const deployStage = engine.deployStage;
    if (deployStage === 'transition' || deployStage === 'completed') {
        return null;
    }

    const deployColor = deployStage as PieceColor;
    const pool = engine.deployPool[deployColor as 'red' | 'black'] || [];
    const remainingCount = pool.length;
    const isAllPlaced = remainingCount === 0;

    const isRed = deployColor === 'red';
    const playerTitle = isRed ? t.gameplay.sittuyinDeployRedPlayer : t.gameplay.sittuyinDeployBlackPlayer;

    return (
        <div className="w-full max-w-2xl mt-3 p-3 sm:p-4 bg-slate-900/90 border-2 border-amber-600/40 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3 transition-all animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full ring-2 ring-white/30 shadow-md ${isRed ? 'bg-red-600' : 'bg-slate-950 border border-slate-700'}`} />
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-amber-300 tracking-wide">
                            {t.gameplay.sittuyinDeployTitle} &bull; {playerTitle}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-300">
                            {t.gameplay.sittuyinDeploySubtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-black/40 border border-white/10 rounded-full text-slate-300">
                    <span>{t.gameplay.sittuyinDeployPiecesLeft}:</span>
                    <span className={`font-black ${remainingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {remainingCount} / 8
                    </span>
                </div>
            </div>

            {/* Piece Selection Bar */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 flex-wrap">
                {PIECE_TYPES.map(({ name, total }) => {
                    const available = pool.filter(p => p === name).length;
                    const isSelected = sittuyinSelectedPiece === name;
                    const isExhausted = available === 0;

                    const dummyPiece = createSittuyinPiece(name, deployColor, { x: 0, y: 0 });
                    const imgUrl = getPieceImage(dummyPiece);

                    return (
                        <button
                            key={name}
                            type="button"
                            disabled={isExhausted}
                            onClick={() => selectSittuyinDeployPiece(isSelected ? null : name)}
                            className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 border select-none ${
                                isSelected
                                    ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/20 scale-105'
                                    : isExhausted
                                    ? 'bg-slate-800/40 border-white/5 opacity-35 cursor-not-allowed'
                                    : 'bg-slate-800/80 border-white/15 hover:border-amber-400/50 hover:bg-slate-700/80 cursor-pointer active:scale-95'
                            }`}
                            style={{ minWidth: '3.8rem' }}
                            title={`${name} (${available}/${total})`}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative">
                                {imgUrl && (
                                    <img
                                        src={imgUrl}
                                        alt={name}
                                        className="w-full h-full object-contain pointer-events-none drop-shadow"
                                    />
                                )}
                            </div>

                            <span className="text-[10px] sm:text-xs font-bold text-slate-200 mt-1">
                                {name}
                            </span>

                            {/* Badge count */}
                            <span
                                className={`absolute -top-1.5 -right-1.5 text-[10px] font-black px-1.5 py-0.2 rounded-full border shadow-md ${
                                    isExhausted
                                        ? 'bg-slate-700 text-slate-400 border-slate-600'
                                        : isSelected
                                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold'
                                        : 'bg-slate-950 text-amber-300 border-white/20'
                                }`}
                            >
                                {available}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Hint tip */}
            <div className="text-[11px] sm:text-xs text-slate-400 text-center bg-black/25 py-1 px-2.5 rounded-lg border border-white/5">
                💡 {t.gameplay.sittuyinDeployTip}
            </div>

            {/* Presets and Confirmation Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                {/* Presets & Reset */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Presets:</span>

                    <button
                        type="button"
                        onClick={() => autoDeploySittuyin('tournament')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 text-xs font-bold rounded-lg border border-white/10 transition-colors shadow-sm cursor-pointer active:scale-95"
                        title={t.gameplay.sittuyinDeployPresetTournament}
                    >
                        <Swords className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.gameplay.sittuyinDeployPresetTournament}</span>
                    </button>

                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                autoDeploySittuyin(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        defaultValue=""
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-white/10 transition-colors shadow-sm cursor-pointer"
                        title="Elegir otra formación táctica"
                    >
                        <option value="" disabled>Más formaciones...</option>
                        <option value="offensive_flank">{t.gameplay.sittuyinDeployPresetFlank}</option>
                        <option value="fortress">{t.gameplay.sittuyinDeployPresetFortress}</option>
                        <option value="left_wing_assault">{t.gameplay.sittuyinDeployPresetLeftWing}</option>
                        <option value="double_chariot_center">{t.gameplay.sittuyinDeployPresetCenterChariots}</option>
                        <option value="cavalry_vanguard">{t.gameplay.sittuyinDeployPresetCavalryVanguard}</option>
                    </select>

                    <button
                        type="button"
                        onClick={resetSittuyinDeploy}
                        className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-300 text-xs font-semibold rounded-lg border border-white/10 hover:border-red-500/40 transition-colors cursor-pointer active:scale-95 ml-1"
                        title={t.gameplay.sittuyinDeployReset}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t.gameplay.sittuyinDeployReset}</span>
                    </button>
                </div>

                {/* Confirm deployment button */}
                <button
                    type="button"
                    disabled={!isAllPlaced}
                    onClick={confirmSittuyinDeploy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-lg select-none ${
                        isAllPlaced
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/30 border border-emerald-300 cursor-pointer active:scale-95 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
                    }`}
                >
                    <Check className="w-4 h-4" />
                    <span>
                        {isAllPlaced
                            ? t.gameplay.sittuyinDeployConfirm
                            : t.gameplay.sittuyinDeployIncomplete.replace('{count}', String(remainingCount))}
                    </span>
                </button>
            </div>
        </div>
    );
};
