import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, ChevronRight, Calendar } from 'lucide-react'
import { MANUAIS } from '../data/manuais'

const ACCENT = '#6eda2c'

function slug(str) {
  return 'm-' + str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseInline(str) {
  const parts = []
  let rest = str
  let key = 0
  while (rest.length > 0) {
    const cands = [
      { type: 'bold', m: rest.match(/^(.*?)\*\*(.+?)\*\*/) },
      { type: 'code', m: rest.match(/^(.*?)`(.+?)`/) },
      { type: 'link', m: rest.match(/^(.*?)\[(.+?)\]\((.+?)\)/) },
    ].filter(c => c.m)
    if (cands.length === 0) { parts.push(rest); break }
    const { type, m } = cands.reduce((a, b) => a.m[1].length <= b.m[1].length ? a : b)
    if (m[1]) parts.push(m[1])
    if (type === 'bold') parts.push(<strong key={key++} className="font-extrabold text-text">{parseInline(m[2])}</strong>)
    if (type === 'code') parts.push(<code key={key++} className="px-1.5 py-0.5 rounded text-[12px] font-mono" style={{ background: ACCENT + '18', color: '#3f8f14' }}>{m[2]}</code>)
    if (type === 'link') parts.push(<a key={key++} href={m[3]} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: '#3f8f14' }}>{m[2]}</a>)
    rest = rest.slice(m[0].length)
  }
  return parts
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
}

function ManualBody({ text }) {
  const lines = text.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    if (line.startsWith('## ')) {
      const t = line.slice(3)
      out.push(<h2 key={i} id={slug(t)} className="text-base font-extrabold text-text mt-8 mb-3 pb-2 scroll-mt-24" style={{ borderBottom: '1px solid #edf0f7' }}>{t}</h2>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      out.push(<h3 key={i} className="text-sm font-extrabold text-text mt-5 mb-2">{parseInline(line.slice(4))}</h3>)
      i++; continue
    }

    if (line.trim().startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i]); i++ }
      const [head, , ...body] = rows
      out.push(
        <div key={i} className="overflow-x-auto my-3 rounded-xl" style={{ border: '1px solid #e2e5f0' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f6f8fc' }}>
                {splitRow(head).map((c, k) => <th key={k} className="text-left font-extrabold text-text px-3 py-2">{parseInline(c)}</th>)}
              </tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid #edf0f7' }}>
                  {splitRow(r).map((c, k) => <td key={k} className="px-3 py-2 text-text align-top leading-relaxed">{parseInline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (/^- \[[ x]\] /.test(line)) {
      const items = []
      while (i < lines.length && /^- \[[ x]\] /.test(lines[i])) { items.push(lines[i].slice(6)); i++ }
      out.push(
        <ul key={i} className="my-2 space-y-1.5">
          {items.map((t, k) => (
            <li key={k} className="flex gap-2 items-start text-sm text-text leading-relaxed">
              <span className="mt-1 w-3.5 h-3.5 rounded flex-shrink-0" style={{ border: `1.5px solid ${ACCENT}` }} />
              <span>{parseInline(t)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
      out.push(
        <ul key={i} className="my-2 space-y-1.5">
          {items.map((t, k) => (
            <li key={k} className="flex gap-2 items-start text-sm text-text leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
              <span>{parseInline(t)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++ }
      out.push(
        <ol key={i} className="my-2 space-y-1.5">
          {items.map((t, k) => (
            <li key={k} className="flex gap-2 items-start text-sm text-text leading-relaxed">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                style={{ background: ACCENT + '1f', color: '#3f8f14' }}>{k + 1}</span>
              <span>{parseInline(t)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    out.push(<p key={i} className="text-sm text-text leading-relaxed my-2">{parseInline(line)}</p>)
    i++
  }
  return <div>{out}</div>
}

function ManualReader({ manual, onBack }) {
  const secoes = useMemo(
    () => manual.content.split('\n').filter(l => l.startsWith('## ')).map(l => l.slice(3)),
    [manual]
  )

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-colors">
        <ArrowLeft size={14} /> Voltar aos manuais
      </button>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
        <div className="h-1 w-full" style={{ background: ACCENT }} />
        <div className="p-5 lg:p-8">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: ACCENT + '18', color: '#3f8f14' }}>{manual.category}</span>
          <h2 className="text-lg font-extrabold text-text mt-2">{manual.title}</h2>
          <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
            <Calendar size={11} /> Atualizado em {manual.updatedAt.split('-').reverse().join('/')}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {secoes.map(s => (
              <a key={s} href={`#${slug(s)}`}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg text-muted hover:text-text transition-colors"
                style={{ background: '#f6f8fc', border: '1px solid #e2e5f0' }}>
                {s}
              </a>
            ))}
          </div>

          <div className="max-w-3xl mt-2">
            <ManualBody text={manual.content} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ManuaisView({ search = '' }) {
  const [abertoId, setAbertoId] = useState(null)

  const lista = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return MANUAIS
    return MANUAIS.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q))
  }, [search])

  const aberto = MANUAIS.find(m => m.id === abertoId)
  if (aberto) return <ManualReader manual={aberto} onBack={() => setAbertoId(null)} />

  if (lista.length === 0) return (
    <div className="text-center py-16 text-muted">
      <FileText size={32} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm font-bold">Nenhum manual encontrado.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {lista.map(m => (
        <motion.button key={m.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => setAbertoId(m.id)}
          className="text-left bg-white rounded-2xl overflow-hidden group"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <div className="h-1 w-full" style={{ background: ACCENT }} />
          <div className="p-5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: ACCENT + '18', color: '#3f8f14' }}>{m.category}</span>
            <h3 className="text-sm font-extrabold text-text mt-2">{m.title}</h3>
            <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-2">{m.description}</p>
            <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid #edf0f7' }}>
              <span className="text-xs font-bold text-muted flex items-center gap-1.5">
                <FileText size={12} style={{ color: ACCENT }} />
                {m.content.split('\n').filter(l => l.startsWith('## ')).length} seções
              </span>
              <span className="ml-auto flex items-center gap-1 text-xs font-extrabold" style={{ color: '#3f8f14' }}>
                Ler manual <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
