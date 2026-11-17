import { useState, useEffect, useRef } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'

export const ATALHOS = [
  ['hoje', 'Hoje'], ['ontem', 'Ontem'], ['d7', 'Últimos 7 dias'], ['d14', 'Últimos 14 dias'], ['d30', 'Últimos 30 dias'],
  ['d90', 'Últimos 90 dias'], ['mes', 'Este mês'], ['mes_anterior', 'Mês passado'],
]
const hojeISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
const br = iso => iso.split('-').reverse().join('/')

export function rotuloPeriodo(chave) {
  const atalho = ATALHOS.find(([k]) => k === chave)
  if (atalho) return atalho[1]
  const [, a, z] = String(chave).split(':')
  return a === z ? br(a) : `${br(a)} a ${br(z)}`
}

export function SeletorPeriodo({ valor, onMudar }) {
  const [aberto, setAberto] = useState(false)
  const [ini, setIni] = useState('')
  const [fim, setFim] = useState('')
  const caixa = useRef(null)
  const hoje = hojeISO()

  useEffect(() => {
    if (!aberto) return
    const [, a, z] = valor.startsWith('r:') ? valor.split(':') : []
    setIni(a || hoje)
    setFim(z || hoje)
    const fora = e => { if (caixa.current && !caixa.current.contains(e.target)) setAberto(false) }
    const esc = e => { if (e.key === 'Escape') setAberto(false) }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', fora); document.removeEventListener('keydown', esc) }
  }, [aberto]) // eslint-disable-line react-hooks/exhaustive-deps

  const escolher = k => { onMudar(k); setAberto(false) }
  const valido = ini && fim && ini <= hoje
  const aplicar = () => {
    if (!valido) return
    const [a, z] = ini <= fim ? [ini, fim] : [fim, ini]
    escolher(`r:${a}:${z > hoje ? hoje : z}`)
  }

  return (
    <div className="relative" ref={caixa}>
      <button onClick={() => setAberto(v => !v)} aria-expanded={aberto} aria-haspopup="dialog"
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white card-shadow text-sm font-semibold text-text hover:bg-surface-2/60">
        <CalendarDays size={15} className="text-text-2" />
        {rotuloPeriodo(valor)}
        <ChevronDown size={14} className={`text-muted transition-transform ${aberto ? 'rotate-180' : ''}`} />
      </button>

      {aberto && (
        <div role="dialog" aria-label="Escolher período"
          className="absolute right-0 top-full mt-2 z-30 w-[min(34rem,calc(100vw-2rem))] bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
          style={{ boxShadow: '0 12px 32px rgba(17,24,39,0.16)' }}>
          <ul className="sm:w-44 grid grid-cols-2 sm:grid-cols-1 gap-0.5">
            {ATALHOS.map(([k, r]) => (
              <li key={k}>
                <button onClick={() => escolher(k)} aria-pressed={valor === k}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg ${valor === k ? 'bg-text text-white font-semibold' : 'text-text-2 hover:bg-surface-2'}`}>{r}</button>
              </li>
            ))}
          </ul>
          <div className="flex-1 sm:border-l border-t sm:border-t-0 border-border p-3 space-y-3">
            <p className="text-sm font-semibold text-text">Personalizado</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-muted space-y-1">
                <span>De</span>
                <input type="date" value={ini} max={hoje} onChange={e => { setIni(e.target.value); if (e.target.value > fim) setFim(e.target.value) }}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border outline-none focus:ring-2 focus:ring-accent/30 text-text" />
              </label>
              <label className="text-xs text-muted space-y-1">
                <span>Até</span>
                <input type="date" value={fim} min={ini} max={hoje} onChange={e => setFim(e.target.value)}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border outline-none focus:ring-2 focus:ring-accent/30 text-text" />
              </label>
            </div>
            <p className="text-xs text-muted">Para ver um dia só, use a mesma data nos dois campos. Os dados de hoje ainda estão em andamento.</p>
            <button onClick={aplicar} disabled={!valido}
              className="w-full text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-text hover:bg-accent-hover disabled:opacity-50">
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
