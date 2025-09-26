import { VitePWA } from 'vite-plugin-pwa'

const pwa = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Armanfit Admin',
    short_name: 'Admin',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0052CC',
    background_color: '#ffffff',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: {
    navigateFallback: '/',
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: { cacheName: 'pages' }
      },
      {
        urlPattern: ({ request }) => ['style','script','worker'].includes(request.destination),
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'assets' }
      },
      {
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 60*60*24*30 } }
      }
    ]
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [pwa,  [react()] })
