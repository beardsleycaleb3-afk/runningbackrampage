// audio.js - Web Audio API Synthesizer & Touch Audio Unlocker
export class AudioManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error('Audio playback error', e);
        }
    }

    playSwipe() { this.playTone(300, 'sine', 0.1, 0.05); }
    playCoin() { this.playTone(880, 'triangle', 0.15, 0.1); }
    playHit() { this.playTone(120, 'sawtooth', 0.25, 0.15); }
    playTouchdown() {
        this.playTone(523.25, 'sine', 0.2, 0.1);
        setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 150);
        setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.15), 300);
    }
}
