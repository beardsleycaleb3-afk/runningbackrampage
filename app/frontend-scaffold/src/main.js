import * as pc from 'playcanvas';
import * as PIXI from 'pixi.js';
import { createWorld } from 'bitecs';
import RAPIER from '@dimforge/rapier3d';
import { InputManager } from './input.js';
import { setupCamera } from './camera.js';
import { initAudio } from './audio.js';
import { registerSW } from 'virtual:pwa-register';

// WHY: Registers the Workbox service worker for offline asset caching (GLB, WASM, etc.)
registerSW({ immediate: true });

// WHY: Central entry point orchestrating 3D (PlayCanvas), 2D (PixiJS), ECS (bitECS), and Physics (Rapier).
// Using separate dedicated engines per domain ensures no compromises on physics stability or 2D render speed.

async function init() {
    // 1. Initialize Physics (Rapier WASM)
    // WHY: Rapier requires an async WASM load. It provides deterministic, high-density collisions without JS frame drops.
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const physicsWorld = new RAPIER.World(gravity);

    // 2. Initialize 3D Engine (PlayCanvas)
    const canvas3D = document.getElementById('playcanvas-canvas');
    const app3D = new pc.Application(canvas3D, {
        mouse: new pc.Mouse(document.body),
        touch: new pc.TouchDevice(document.body)
    });
    app3D.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app3D.setCanvasResolution(pc.RESOLUTION_AUTO);
    
    // Constraint check: Cap devicePixelRatio to 2 to maintain steady framerates on lower-end Androids
    app3D.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 2);
    
    setupCamera(app3D); // Applies specific N64-style near/far clipping

    // 3. Initialize 2D Engine (PixiJS)
    const canvas2D = document.getElementById('pixi-canvas');
    const app2D = new PIXI.Application({
        view: canvas2D,
        transparent: true,
        resizeTo: window,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
    });

    // 4. Initialize ECS (bitECS)
    // WHY: bitECS ensures high-performance memory alignment for game state (positions, velocities) independent of the rendering graphs.
    const ecsWorld = createWorld();

    // 5. Initialize Input (nipplejs, Hammer, PointerEvents)
    const inputManager = new InputManager();

    // 6. Initialize Audio (Howler)
    initAudio();

    // Core Game Loop
    // WHY: A fixed timestep loop is crucial for Rapier physics stability. 
    // It syncs physics, logic (bitECS), and rendering (PlayCanvas + PixiJS) consistently regardless of screen refresh rate.
    let lastTime = performance.now();
    const fixedTimeStep = 1.0 / 60.0;
    let accumulator = 0.0;

    function gameLoop(currentTime) {
        requestAnimationFrame(gameLoop);

        const dt = (currentTime - lastTime) / 1000.0;
        lastTime = currentTime;
        accumulator += dt;

        // Physics & Logic step (Fixed Timestep)
        while (accumulator >= fixedTimeStep) {
            physicsWorld.step();
            // TODO: Execute bitECS systems (e.g. sync Rapier Rigidbody transforms to ECS arrays)
            accumulator -= fixedTimeStep;
        }

        // Input gathering
        const inputState = inputManager.getState();
        // TODO: Apply inputState logic to player entity components

        // Render step
        // PlayCanvas internal loop usually auto-renders, but manual update ensures rigid synchronization.
        app3D.render();
        // PixiJS auto-renders via its own ticker unless disabled.
    }

    requestAnimationFrame(gameLoop);
}

init();
