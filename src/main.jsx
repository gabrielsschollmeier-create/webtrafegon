import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Auto-cura: remove caches antigos que podiam guardar respostas vazias do
// Supabase (bug do RLS). Roda uma vez por navegador; depois fica marcado.
if (!localStorage.getItem('trafegon_cache_purge_v1')) {
  try {
    localStorage.removeItem('trafegon_meta_cache_v1')
    if (window.caches) {
      caches.keys().then(keys => keys.forEach(k => {
        if (k.includes('supabase') || k.includes('js-cache')) caches.delete(k)
      }))
    }
  } catch {}
  localStorage.setItem('trafegon_cache_purge_v1', '1')
}

registerSW({ onNeedRefresh() {}, onOfflineReady() {} })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
