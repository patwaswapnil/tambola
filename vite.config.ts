import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'tambola';
const basePath = process.env.VITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/');

const repoBasePath = basePath === '/' ? '/tambola/' : basePath;

export default defineConfig({
  base: repoBasePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tambola Royale',
        short_name: 'Tambola Royale',
        description: 'A premium, offline-ready Tambola caller.',
        theme_color: '#090c1c',
        background_color: '#090c1c',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      }
    })
  ]
});
