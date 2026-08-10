import { Slideshow, PITCH_SLIDES } from './erp/TrafegonComercial'

export default function EcossistemaPublico() {
  return (
    <Slideshow
      slides={PITCH_SLIDES}
      accentColor="#6eda2c"
      fixedMode="geral"
      fsDefault={true}
      responsive
    />
  )
}
