import { Slideshow, PITCH_SLIDES } from './erp/TrafegonComercial'

export default function SolucoesJuridicas() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080a12',
      display: 'flex', flexDirection: 'column',
      padding: '12px 16px',
    }}>
      <Slideshow
        slides={PITCH_SLIDES}
        accentColor="#6eda2c"
        fixedMode="advocacia"
        responsive
      />
    </div>
  )
}
