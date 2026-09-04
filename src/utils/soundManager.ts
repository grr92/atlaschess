/**
 * Sound Manager using the Web Audio API for zero-latency, cross-platform chess audio synthesis.
 * Emulates authentic wooden piece clicks, board placements, captures, and check alerts.
 */
class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            try {
                this.isMuted = localStorage.getItem('atlas_muted') === 'true';
            } catch {
                this.isMuted = false;
            }
        }
    }

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    /**
     * Plays a crisp wooden UI click sound when buttons or modal options are clicked.
     */
    playUiClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    /**
     * Plays a subtle wooden tap when selecting/clicking a piece.
     */
    playSelect() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    /**
     * Plays a crisp wooden placement thud when a move is executed.
     */
    playMove() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Low body frequency (board impact)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.09);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        // High snap frequency (wood-on-wood contact)
        const snap = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snap.type = 'triangle';
        snap.frequency.setValueAtTime(600, now);
        snap.frequency.exponentialRampToValueAtTime(150, now + 0.035);

        snapGain.gain.setValueAtTime(0.22, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        snap.connect(snapGain);
        snapGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
        snap.start(now);
        snap.stop(now + 0.035);
    }

    /**
     * Plays a heavier, double-impact strike sound when capturing a piece.
     */
    playCapture() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Primary heavy impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

        gain.gain.setValueAtTime(0.48, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Secondary clack (captured piece displaced)
        const snap = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snap.type = 'triangle';
        snap.frequency.setValueAtTime(820, now + 0.018);
        snap.frequency.exponentialRampToValueAtTime(220, now + 0.065);

        snapGain.gain.setValueAtTime(0.32, now + 0.018);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        snap.connect(snapGain);
        snapGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
        snap.start(now + 0.018);
        snap.stop(now + 0.065);
    }

    /**
     * Plays an alert chime when a King is placed in check.
     */
    playCheck() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.07); // A5

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('atlas_muted', String(this.isMuted));
            } catch {}
        }
        return this.isMuted;
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('atlas_muted', String(this.isMuted));
            } catch {}
        }
    }

    getMuted(): boolean {
        return this.isMuted;
    }
}

export const soundManager = new SoundManager();
