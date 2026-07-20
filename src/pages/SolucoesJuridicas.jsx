import { Slideshow, PITCH_SLIDES } from './erp/TrafegonComercial'

export default function SolucoesJuridicas() {
  return (
    <Slideshow
      slides={PITCH_SLIDES}
      accentColor="#6eda2c"
      fixedMode="advocacia"
      fsDefault={true}
      responsive
    />
  )
}
