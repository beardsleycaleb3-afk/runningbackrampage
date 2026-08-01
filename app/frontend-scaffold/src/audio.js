import { Howl, Howler } from 'howler';

// WHY: Mobile Chrome strictly blocks Web Audio API from starting until the user physically interacts with the document.
// This module registers a one-time global `pointerdown` listener to explicitly unlock the AudioContext seamlessly.
export function initAudio() {
    const unlockAudio = () => {
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }
        // Immediately remove listener once successfully unlocked
        document.removeEventListener('pointerdown', unlockAudio);
    };

    // Attach to document body to catch the very first touch anywhere
    document.addEventListener('pointerdown', unlockAudio, { once: true });

    // Example sound definitions (commented out until assets exist):
    // export const sfx = {
    //     tackle: new Howl({ src: ['/assets/sfx/tackle.mp3'] }),
    //     whistle: new Howl({ src: ['/assets/sfx/whistle.mp3'] })
    // };
}
