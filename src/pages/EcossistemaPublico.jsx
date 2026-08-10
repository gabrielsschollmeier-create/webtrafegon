import { Ecossistema } from './erp/TrafegonEstrategia'

const G = '#6eda2c'

export default function EcossistemaPublico() {
  return (
    <div className="min-h-screen" style={{ background: '#080a12' }}>
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 pb-12">
        <div className="text-center mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: G + '99' }}>
            TráfegOn · Visão Estratégica
          </span>
        </div>
        <Ecossistema />
      </div>
    </div>
  )
}
