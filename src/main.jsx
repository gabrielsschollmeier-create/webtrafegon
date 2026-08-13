import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const EsClub = lazy(() => import('./pages/erp/EsClub.jsx'))
const isEsClub = window.location.pathname.replace(/\/+$/, '') === '/esclub'

/* Rota pública da apresentação.
   Monta o deck sem passar pelo App: sem leitura de localStorage, sem
   sessão do Supabase, sem service worker. Assim o link aberto por quem
   nunca visitou o hub carrega de primeira e não toca em nada do sistema. */
if (isEsClub) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0b14' }} />}>
          <EsClub />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>,
  )
} else {

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

/* Aviso de versão nova.
   Antes o service worker recarregava a página sozinho a cada deploy — quem
   estivesse escrevendo uma tarefa ou editando um playbook perdia o que tinha
   digitado. Agora aparece esta barra e a troca só acontece no clique. */
function avisarVersaoNova(atualizar) {
  if (document.getElementById('tf-update-bar')) return

  const barra = document.createElement('div')
  barra.id = 'tf-update-bar'
  barra.setAttribute('role', 'status')
  barra.style.cssText = [
    'position:fixed', 'left:50%', 'bottom:20px', 'transform:translateX(-50%)',
    'z-index:99999', 'display:flex', 'align-items:center', 'gap:14px',
    'padding:12px 16px', 'border-radius:14px', 'background:#1a1d2e',
    'border:1px solid rgba(255,255,255,0.12)', 'box-shadow:0 12px 32px rgba(0,0,0,0.35)',
    'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif', 'font-size:13px',
    'color:#e9ebf3', 'max-width:calc(100vw - 32px)',
  ].join(';')

  const texto = document.createElement('span')
  texto.textContent = 'Nova versão do hub disponível.'

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = 'Atualizar'
  btn.style.cssText = [
    'cursor:pointer', 'border:none', 'border-radius:9px', 'padding:7px 14px',
    'background:#6eda2c', 'color:#0f1117', 'font-weight:700', 'font-size:13px',
    'font-family:inherit',
  ].join(';')
  btn.onclick = () => { btn.disabled = true; btn.textContent = 'Atualizando…'; atualizar() }

  const depois = document.createElement('button')
  depois.type = 'button'
  depois.textContent = 'Depois'
  depois.style.cssText = [
    'cursor:pointer', 'border:none', 'background:transparent', 'color:#8890b5',
    'font-size:12px', 'font-family:inherit', 'padding:6px',
  ].join(';')
  depois.onclick = () => barra.remove()

  barra.append(texto, btn, depois)
  document.body.appendChild(barra)
}

const atualizarSW = registerSW({
  onNeedRefresh() { avisarVersaoNova(() => atualizarSW(true)) },
  onOfflineReady() {},
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

}
