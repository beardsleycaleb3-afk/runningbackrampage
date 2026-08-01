// buffer.js - Asset & Sprite Buffer Cache
export class AssetBuffer {
    constructor() {
        this.cache = {};
    }

    preload(sources, callback) {
        let loaded = 0;
        const total = Object.keys(sources).length;
        if (total === 0) {
            if (callback) callback();
            return;
        }
        for (let key in sources) {
            const img = new Image();
            img.src = sources[key];
            img.onload = () => {
                this.cache[key] = img;
                loaded++;
                if (loaded === total && callback) callback();
            };
            img.onerror = () => {
                // Fallback graceful
                loaded++;
                if (loaded === total && callback) callback();
            };
        }
    }

    get(key) {
        return this.cache[key];
    }
}
