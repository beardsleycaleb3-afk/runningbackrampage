// clock.js - Game Loop Ticker & Delta Time Controller
export class GameClock {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.lastTime = 0;
        this.isRunning = false;
        this.rafId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop = (time) => {
            if (!this.isRunning) return;
            const dt = (time - this.lastTime) / 1000;
            this.lastTime = time;
            this.updateCallback(dt);
            this.rafId = requestAnimationFrame(this.loop);
        };
        this.rafId = requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
