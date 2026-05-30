import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Força reload automático quando nova versão do service worker está pronta
registerSW({ onNeedRefresh() { window.location.reload() }, onOfflineReady() {} })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
