import { useEffect } from 'react'
import { Slideshow } from './erp/TrafegonComercial'
import { TREINAMENTO_JURIDICO_SLIDES } from './erp/TreinamentoJuridico'
import DicaGirarCelular from './DicaGirarCelular'

// As fontes do deck não vêm no bundle do hub — sem elas as métricas mudam e o
// texto pode estourar os cards. Carrega antes de pintar e só uma vez.
function useFontesDoDeck() {
  useEffect(() => {
    const id = 'fontes-treinamento-juridico'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

export default function TreinamentoJuridicoPublica() {
  useFontesDoDeck()

  useEffect(() => {
    document.title = 'Como transformar uma conversa em consulta agendada · TráfegOn'
  }, [])

  // ?slide=7 abre direto nesse slide — serve para mandar um ponto específico
  const n = Number(new URLSearchParams(window.location.search).get('slide'))
  const startAt = Number.isFinite(n) && n >= 1 ? n - 1 : 0

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#080a12' }}>
      <div className="flex-1 flex flex-col px-2 pt-2 pb-1 lg:px-4 lg:pt-3 min-h-0">
        <Slideshow
          slides={TREINAMENTO_JURIDICO_SLIDES}
          accentColor="#6eda2c"
          fixedMode="slide"
          responsive
          fillWidth
          startAt={startAt}
        />
      </div>
      <div className="text-center pb-2 text-white/25 text-[11px] flex-shrink-0">
        TráfegOn · <span className="font-bold" style={{ color: '#6eda2c', opacity: 0.7 }}>@trafegonjuridico</span>
      </div>
      <DicaGirarCelular />
    </div>
  )
}
