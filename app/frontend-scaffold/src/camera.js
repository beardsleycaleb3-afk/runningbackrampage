import * as pc from 'playcanvas';

// WHY: Aggressive near and far clipping planes recreate the geometry pop-in 
// characteristic of PS1/N64 era hardware. Removing texture filtering creates the pixelated aesthetic.
export function setupCamera(app) {
    const camera = new pc.Entity('MainCamera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0, 0, 0),
        // N64 style clipping limits
        nearClip: 0.1,
        farClip: 35.0, // Aggressive far clip for pop-in effect
        fov: 65
    });

    camera.translate(0, 10, 15);
    camera.lookAt(0, 0, 0);
    app.root.addChild(camera);

    // Add thick fog to mask the hard clipping edge, standard practice in N64 rendering
    app.scene.fog = pc.FOG_LINEAR;
    app.scene.fogColor = new pc.Color(0.1, 0.1, 0.15); // Dark stadium sky
    app.scene.fogStart = 15.0;
    app.scene.fogEnd = 35.0;
    
    // Enforce nearest-neighbor filtering (no bilinear blur) to get that crisp, pixelated texture look
    pc.Texture.DEFAULT_FILTER_MAG = pc.FILTER_NEAREST;
    pc.Texture.DEFAULT_FILTER_MIN = pc.FILTER_NEAREST;
}
