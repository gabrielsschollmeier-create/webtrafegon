import { useEffect } from 'react'
import { Slideshow } from './erp/TrafegonComercial'
import { PALESTRA_CAF_SLIDES } from './erp/PalestraCAF'

// ── RASTREAMENTO ───────────────────────────────────────────────────────────────
// Preencha os IDs para ativar. Vazio = nada é carregado.
// Estes scripts rodam SOMENTE nesta página pública, nunca no hub logado.
const TRACKING = {
  metaPixelId:  null,  // ex: '1234567890123456'
  googleTagId:  null,  // ex: 'G-XXXXXXXXXX' (GA4) ou 'AW-XXXXXXXXX' (Google Ads)
}

function usarRastreamento() {
  useEffect(() => {
    if (TRACKING.metaPixelId) {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []
        t = b.createElement(e); t.async = !0; t.src = v
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      /* eslint-enable */
      window.fbq('init', TRACKING.metaPixelId)
      window.fbq('track', 'PageView')
    }

    if (TRACKING.googleTagId) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING.googleTagId}`
      document.head.appendChild(s)
      window.dataLayer = window.dataLayer || []
      window.gtag = function () { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', TRACKING.googleTagId)
    }
  }, [])
}

export default function PalestraCafPublica() {
  usarRastreamento()

  useEffect(() => {
    document.title = 'Do zero ao primeiro contrato · TráfegOn'
  }, [])

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#080a12' }}>
      <div className="flex-1 flex flex-col px-2 pt-2 pb-1 lg:px-4 lg:pt-3 min-h-0">
        <Slideshow
          slides={PALESTRA_CAF_SLIDES}
          accentColor="#6eda2c"
          fixedMode="slide"
          responsive
          fillWidth
        />
      </div>
      <div className="text-center pb-2 text-white/25 text-[11px] flex-shrink-0">
        TráfegOn · <span className="font-bold" style={{ color: '#6eda2c', opacity: 0.7 }}>@trafegonjuridico</span>
      </div>
    </div>
  )
}
