import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'missile.glb', 'fighter-jet-x-einheit-funf/source/Meshy_AI_Shadow_Wing_0909233125_texture.glb'],
      manifest: {
        name: 'Aero - Autonomous Systems',
        short_name: 'Aero',
        description: 'Intelligent autonomous systems designed to perceive, decide and respond in real time.',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 100000000, // 100MB to allow caching the 3D model
      }
    })
  ]
});
