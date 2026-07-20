import { Slideshow, PITCH_SLIDES } from './erp/TrafegonComercial'

export default function SolucoesJuridicas() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080a12',
      display: 'flex', flexDirection: 'column',
      padding: '10px 14px',
      boxSizing: 'border-box',
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
