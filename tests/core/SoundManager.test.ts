import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundManager } from '../../src/utils/soundManager';

describe('SoundManager', () => {
    beforeEach(() => {
        soundManager.setMuted(false);
    });

    it('should toggle mute state and persist preference', () => {
        expect(soundManager.getMuted()).toBe(false);

        const muted = soundManager.toggleMute();
        expect(muted).toBe(true);
        expect(soundManager.getMuted()).toBe(true);

        const unmuted = soundManager.toggleMute();
        expect(unmuted).toBe(false);
        expect(soundManager.getMuted()).toBe(false);
    });

    it('should safely execute sound methods without throwing errors', () => {
        expect(() => soundManager.playUiClick()).not.toThrow();
        expect(() => soundManager.playSelect()).not.toThrow();
        expect(() => soundManager.playMove()).not.toThrow();
        expect(() => soundManager.playCapture()).not.toThrow();
        expect(() => soundManager.playCheck()).not.toThrow();
    });
});
