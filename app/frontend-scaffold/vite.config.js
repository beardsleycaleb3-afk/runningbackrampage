import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// WHY: Using Vite for fast ESM bundling, avoiding heavy Webpack overhead. 
// vite-plugin-pwa configures Workbox specifically for offline-first, aggressive caching of heavy 3D assets.
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // WHY: Caching strategy tailored for large game assets to ensure true offline play (no network fallback needed after first load).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,gltf,bin,webp,mp3,wav}'],
        maximumFileSizeToCacheInBytes: 50000000, // 50MB limit to permit large compiled WASM and uncompressed audio/models
      },
      manifest: {
        name: 'Blitz RPG',
        short_name: 'Blitz',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'fullscreen', // WHY: Maximizes screen real-estate on mobile, natively hiding status bars and nav bars.
        orientation: 'portrait'
      }
    })
  ]
});
