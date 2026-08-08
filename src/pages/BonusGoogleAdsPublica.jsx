import { useEffect } from 'react'
import { Slideshow } from './erp/TrafegonComercial'
import { BONUS_GADS_SLIDES } from './erp/BonusGoogleAds'
import DicaGirarCelular from './DicaGirarCelular'

export default function BonusGoogleAdsPublica() {
  useEffect(() => {
    document.title = 'Google Ads para advogadas · Material bônus · TráfegOn'
  }, [])

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#080a12' }}>
      <div className="flex-1 flex flex-col px-2 pt-2 pb-1 lg:px-4 lg:pt-3 min-h-0">
        <Slideshow
          slides={BONUS_GADS_SLIDES}
          accentColor="#6eda2c"
          fixedMode="slide"
          responsive
          fillWidth
        />
      </div>
      <div className="text-center pb-2 text-white/25 text-[11px] flex-shrink-0">
        TráfegOn · <span className="font-bold" style={{ color: '#6eda2c', opacity: 0.7 }}>@trafegonjuridico</span>
      </div>
      <DicaGirarCelular />
    </div>
  )
}
