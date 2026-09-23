import { useTranslation } from '../../i18n';

interface ConfirmModalProps {
    action: 'exit' | 'restart';
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Generic confirmation dialog used for "Exit to Menu" and "Restart Game" actions.
 * Rendered inline (fixed overlay) to avoid z-index conflicts with game modals.
 */
export const ConfirmModal = ({ action, onConfirm, onCancel }: ConfirmModalProps) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-atlas-surface p-7 rounded-3xl shadow-2xl border border-amber-500/40 text-center max-w-sm w-full animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
                <h3 className="text-2xl font-black mb-3 text-atlas-titleText tracking-tight">
                    {action === 'exit' ? t.gameplay.confirmExitTitle : t.gameplay.confirmRestartTitle}
                </h3>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                    {action === 'exit' ? t.gameplay.confirmExitDesc : t.gameplay.confirmRestartDesc}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-atlas-secSurface hover:bg-atlas-secHover text-slate-200 py-3 rounded-xl font-bold transition-all border border-white/10 shadow-sm hover:scale-105 active:scale-95"
                    >
                        {t.common.no}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 py-3 rounded-xl font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                    >
                        {t.common.yes}
                    </button>
                </div>
            </div>
        </div>
    );
};
