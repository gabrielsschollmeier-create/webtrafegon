import { Slideshow, IMPLEMENTACAO_SLIDES } from './erp/TrafegonComercial'

export default function ImplementacaoComercial() {
  return (
    <Slideshow
      slides={IMPLEMENTACAO_SLIDES}
      accentColor="#6eda2c"
      fsDefault={true}
      responsive
    />
  )
}
