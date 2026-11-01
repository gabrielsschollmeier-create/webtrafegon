import { useState, useRef } from 'react'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react'
import { cabecalhoLogin } from '../../lib/supabase'
import { NIVEIS, SAUDE, GLOSSARIO, pct, variacao } from './regras'

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

export function Tarefa({ item, conta, onAbrirConta, comecaAberta = false }) {
  const [aberta, setAberta] = useState(comecaAberta)
  const n = NIVEIS[item.nivel]
  const temPassos = item.passos.length > 0
  return (
    <li className="py-3.5">
      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
        <span className="sm:mt-0.5 w-fit h-fit text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap" style={{ color: n.cor, background: n.fundo }}>{n.rotulo}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text">
            {item.titulo}{item.ajuda && <> <Ajuda chave={item.ajuda} /></>}
          </p>
          <p className="text-sm text-text-2 mt-0.5">{item.resumo}</p>
          <p className="text-xs text-muted mt-1">
            {conta && <button onClick={() => onAbrirConta(conta.id)} className="text-left font-semibold text-text-2 hover:text-text hover:underline underline-offset-2">{conta.nome}</button>}
            {conta && item.campanha && ' · '}
            {item.campanha && <span>Campanha {item.campanha}</span>}
          </p>
          {temPassos && (
            <button onClick={() => setAberta(v => !v)} aria-expanded={aberta}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-2 hover:text-text">
              {aberta ? <ChevronDown size={14} /> : <ChevronRight size={14} />}Como resolver
            </button>
          )}
          {aberta && temPassos && (
            <ol className="mt-2 space-y-1.5 text-sm text-text-2 list-decimal pl-5 marker:text-muted marker:font-semibold">
              {item.passos.map((p, i) => <li key={i} className="pl-1">{p}</li>)}
            </ol>
          )}
        </div>
      </div>
    </li>
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

export function ListaComLimite({ itens, limite, render, rotuloMais }) {
  const [tudo, setTudo] = useState(false)
  const visiveis = tudo ? itens : itens.slice(0, limite)
  return (
    <>
      <ul className="divide-y divide-border">{visiveis.map(render)}</ul>
      {itens.length > limite && (
        <button onClick={() => setTudo(v => !v)} className="w-full py-3 text-sm font-semibold text-text-2 hover:text-text border-t border-border">
          {tudo ? 'Mostrar menos' : rotuloMais(itens.length - limite)}
        </button>
      )}
    </>
  )
}
