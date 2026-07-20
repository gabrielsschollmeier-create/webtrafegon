import { Slideshow, PITCH_SLIDES } from './erp/TrafegonComercial'

const G = '#6eda2c'

export default function SolucoesJuridicas() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: '#080a12' }}>
      <div className="w-full" style={{ maxWidth: 960 }}>
        <Slideshow
          slides={PITCH_SLIDES}
          accentColor={G}
          modeOptions={[
            { value: 'advocacia', label: '⚖️ Advocacia' },
            { value: 'geral',     label: '🏢 Geral' },
          ]}
        />
      </div>
    </div>
  )
}
