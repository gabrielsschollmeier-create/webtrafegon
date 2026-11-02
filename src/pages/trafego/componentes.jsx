import { useState, useRef } from 'react'
import { ArrowUp, ArrowDown, HelpCircle } from 'lucide-react'
import { cabecalhoLogin } from '../../lib/supabase'
import { SAUDE, GLOSSARIO, pct, variacao } from './regras'

export async function chamar(body) {
  const r = await fetch('/api/trafego', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await cabecalhoLogin()) },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.erro || `o servidor respondeu ${r.status}`)
  return data
}

export const dataBR = iso => iso.split('-').reverse().slice(0, 2).join('/')
export const formatarId = id => id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')

export const diasDesde = iso => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : null)

export function textoOtimizacao(dias) {
  if (dias == null) return 'Nunca'
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  return `Há ${dias} dias`
}

export const linkGoogleAds = (contaId, campanhaId) =>
  `https://ads.google.com/aw/${campanhaId ? 'adgroups' : 'campaigns'}?__e=${contaId}${campanhaId ? `&campaignId=${campanhaId}` : ''}`

export function Ajuda({ chave }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)
  const abrir = () => {
    const r = ref.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: Math.min(Math.max(8, r.left - 120), window.innerWidth - 268) })
  }
  return (
    <>
      <button ref={ref} type="button" aria-label="O que é isso?"
        onMouseEnter={abrir} onMouseLeave={() => setPos(null)} onFocus={abrir} onBlur={() => setPos(null)}
        className="inline-flex align-middle text-muted hover:text-text-2 focus-visible:text-text-2 focus-visible:outline-none">
        <HelpCircle size={13} />
      </button>
      {pos && (
        <span role="tooltip" className="fixed z-50 w-64 px-3 py-2 rounded-lg text-xs leading-relaxed text-white font-normal normal-case tracking-normal text-left"
          style={{ top: pos.top, left: pos.left, background: '#1a1d2e', boxShadow: '0 6px 20px rgba(17,24,39,0.25)' }}>
          {GLOSSARIO[chave]}
        </span>
      )}
    </>
  )
}

// `bomQuandoSobe`: true (conversões), false (custo por conversão) ou null (neutro, ex.: investimento).
export function Variacao({ atual, anterior, bomQuandoSobe = true }) {
  const v = variacao(atual, anterior)
  if (v == null) return <span className="text-xs text-muted">—</span>
  if (Math.abs(v) < 0.01) return <span className="text-xs text-muted">igual</span>
  const sobe = v > 0
  const cor = bomQuandoSobe == null ? '#6b7280' : (sobe === bomQuandoSobe ? '#15803d' : '#dc2626')
  const Icone = sobe ? ArrowUp : ArrowDown
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap" style={{ color: cor }}>
      <Icone size={11} strokeWidth={2.5} />{pct(Math.abs(v))}
    </span>
  )
}

export function SemComparacao() {
  return <span className="text-xs text-muted">não comparável</span>
}

export function Numero({ rotulo, valor, ajuda, children }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted flex items-center gap-1">{rotulo}{ajuda && <Ajuda chave={ajuda} />}</p>
      <p className="text-lg font-bold text-text tabular-nums leading-tight mt-0.5">{valor}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

export function PontoSaude({ saude, comRotulo }) {
  const s = SAUDE[saude]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: s.cor }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.cor }} />
      {comRotulo && s.rotulo}
    </span>
  )
}

export function Bloco({ titulo, descricao, children, acao }) {
  return (
    <section className="bg-white rounded-2xl card-shadow">
      <header className="px-5 pt-5 pb-1 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-text">{titulo}</h2>
          {descricao && <p className="text-sm text-muted mt-0.5">{descricao}</p>}
        </div>
        {acao}
      </header>
      <div className="px-5 pb-2">{children}</div>
    </section>
  )
}
