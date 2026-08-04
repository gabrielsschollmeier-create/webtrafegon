import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    // Separa as libs grandes em chunks próprios: mudam pouco, então ficam em
    // cache de longo prazo. Num deploy só de código, o navegador rebaixa apenas
    // o chunk do app — vendors (react, supabase, framer, charts) vêm do cache.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/scheduler/') || /[\\/]react[\\/]/.test(id)) return 'react-vendor'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) return 'charts'
          return 'vendor'
        },
      },
    },
  },
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
        // /esclub e /solucoes-juridicas são links públicos, abertos por quem nunca
        // visitou o hub. Sem esta exclusão o SW responde a navegação com o index.html
        // em cache (versão antiga) e a página abre em branco — só o 2º acesso funcionava.
        navigateFallbackDenylist: [/^\/esclub/, /^\/solucoes-juridicas/, /^\/api/],
        runtimeCaching: [
          {
            // Os JS/CSS têm nome com hash de conteúdo (imutáveis). CacheFirst serve
            // na hora do cache — sem esperar a rede a cada arquivo (era o que deixava
            // a 1ª carga lenta). Deploy novo = hash novo = busca na rede 1x e cacheia.
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
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
