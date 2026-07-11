import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'TráfegOn Hub',
        short_name: 'TráfegOn',
        description: 'Central operacional da agência TráfegOn',
        theme_color: '#0f1117',
        background_color: '#0f1117',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: '/index.html',
        // /esclub é link público, aberto por quem nunca visitou o hub.
        // Sem esta exclusão o service worker responde a navegação com o
        // index.html em cache (versão antiga, sem a rota) e a página abre
        // em branco — só o segundo acesso funciona.
        navigateFallbackDenylist: [/^\/esclub/],
        runtimeCaching: [
          {
            urlPattern: /\.js$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 },
            },
          },
          {
            // Dados do Supabase nunca passam pelo cache do service worker.
            // (NetworkFirst guardava respostas vazias e as servia depois,
            //  fazendo o sistema parecer zerado mesmo com o banco cheio.)
            urlPattern: /^https:\/\/bfyshboqvisnuefeyqdv\.supabase\.co\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
