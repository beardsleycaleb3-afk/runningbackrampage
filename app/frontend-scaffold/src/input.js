import nipplejs from 'nipplejs';
import Hammer from 'hammerjs';

// WHY: Centralized input manager explicitly mapping raw interactions to state.
// By strictly avoiding `onclick` and using PointerEvents/nipplejs/Hammer, we eliminate mobile click delays (300ms) 
// and handle multi-touch gracefully.
export class InputManager {
    constructor() {
        this.state = {
            joystick: { x: 0, y: 0 },
            buttons: { juke: false, truck: false },
            gestures: { swipe: null }
        };

        this.initJoystick();
        this.initButtons();
        this.initGestures();
    }

    initJoystick() {
        // WHY: Nipple.js handles the complex radial math of virtual analog sticks on touch devices.
        const zone = document.getElementById('joystick-zone');
        this.manager = nipplejs.create({
            zone: zone,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white'
        });

        this.manager.on('move', (evt, data) => {
            this.state.joystick = {
                x: Math.cos(data.angle.radian) * data.distance,
                y: Math.sin(data.angle.radian) * data.distance
            };
        });

        this.manager.on('end', () => {
            this.state.joystick = { x: 0, y: 0 };
        });
    }

    initButtons() {
        // WHY: Native PointerEvents (`pointerdown`, `pointerup`) provide the absolute lowest-latency touch interaction possible.
        // `e.preventDefault()` stops synthesized mouse events and scrolling.
        const btnJuke = document.getElementById('btn-juke');
        const btnTruck = document.getElementById('btn-truck');

        const bindButton = (el, key) => {
            el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.state.buttons[key] = true; });
            el.addEventListener('pointerup', (e) => { e.preventDefault(); this.state.buttons[key] = false; });
            el.addEventListener('pointerleave', (e) => { e.preventDefault(); this.state.buttons[key] = false; });
            el.addEventListener('pointercancel', (e) => { e.preventDefault(); this.state.buttons[key] = false; });
        };

        bindButton(btnJuke, 'juke');
        bindButton(btnTruck, 'truck');
    }

    initGestures() {
        // WHY: Hammer.js robustly handles velocity-based gesture recognition (swipes for specials) 
        // across the entire screen area not occupied by UI.
        const root = document.body;
        const hammer = new Hammer(root);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 10, velocity: 0.3 });

        hammer.on('swipe', (ev) => {
            this.state.gestures.swipe = ev.direction;
            // Clear the swipe state after a short window so the game loop registers it as a one-shot event
            setTimeout(() => { this.state.gestures.swipe = null; }, 100);
        });
    }

    getState() {
        return this.state;
    }
}
