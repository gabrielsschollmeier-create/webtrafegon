import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse, ChevronLeft, ChevronRight, Check, Lock, ShieldCheck,
  AlertTriangle, Download, RefreshCw, Trash2, Users2, TrendingDown,
} from 'lucide-react'
import { supabase, supabaseReady } from '../lib/supabase'
import { getAllUsers } from '../data/users-store'
import {
  RODADA_ATUAL, BLOCOS, FATORES, ANCORAS, ABERTAS, DIMENSOES, TOTAL_ITENS,
  calcularScores, faixaIME, faixaIRS, quadrante, motorDominante,
  ALAVANCA_POR_MOTOR,
} from '../data/motivograma-schema'

const DONO = 'gabrielsschollmeier@gmail.com'

/* ══════════════════════════════════════════════════════════
   Componentes base
   ══════════════════════════════════════════════════════════ */

function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl border border-border p-5 shadow-sm ${className}`}>{children}</div>
}

function Likert({ value, onChange, ancoras = ['Discordo totalmente', 'Concordo totalmente'] }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 h-11 rounded-xl text-sm font-bold border transition-all ${
              value === v
                ? 'border-accent bg-accent text-white shadow-sm scale-[1.03]'
                : 'border-border bg-surface-2 text-text-2 hover:border-accent/40'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-muted">
        <span>{ancoras[0]}</span>
        <span>{ancoras[1]}</span>
      </div>
    </div>
  )
}

function MiniEscala({ value, onChange, cor = '#6eda2c' }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className="w-8 h-8 rounded-lg text-xs font-bold border transition-all"
          style={value === v
            ? { background: cor, borderColor: cor, color: '#fff' }
            : { background: '#eceef8', borderColor: '#e0e3f0', color: '#3d4575' }}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

function Barra({ valor, cor, altura = 6 }) {
  return (
    <div className="w-full rounded-full bg-surface-2 overflow-hidden" style={{ height: altura }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, valor))}%`, background: cor }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FORMULÁRIO
   ══════════════════════════════════════════════════════════ */

function Formulario({ user, onEnviado }) {
  const [etapa, setEtapa]       = useState(0)
  const [respostas, setResp]    = useState({})
  const [fatores, setFatores]   = useState({})
  const [ancora, setAncora]     = useState(null)
  const [enps, setEnps]         = useState(null)
  const [h2, setH2]             = useState(null)
  const [h3, setH3]             = useState(null)
  const [abertas, setAbertas]   = useState({})
  const [erro, setErro]         = useState('')
  const [enviando, setEnviando] = useState(false)
  const [inicio]                = useState(() => Date.now())

  const etapas = [...BLOCOS.map(b => ({ tipo: 'likert', bloco: b })),
    { tipo: 'fatores' }, { tipo: 'fechamento' }, { tipo: 'abertas' }]

  const atual = etapas[etapa]
  const totalEtapas = etapas.length

  const preenchidos = useMemo(() => {
    const likert = Object.keys(respostas).length
    const fat = Object.values(fatores).filter(f => f?.i && f?.p).length * 2
    const fim = (ancora ? 1 : 0) + (enps != null ? 1 : 0) + (h2 != null ? 1 : 0) + (h3 != null ? 1 : 0)
    return likert + fat + fim
  }, [respostas, fatores, ancora, enps, h2, h3])

  const progresso = Math.round((preenchidos / TOTAL_ITENS) * 100)

  function validarEtapa() {
    if (atual.tipo === 'likert') {
      const falta = atual.bloco.itens.filter(i => !respostas[i.id])
      if (falta.length) return `Faltam ${falta.length} resposta(s) neste bloco.`
    }
    if (atual.tipo === 'fatores') {
      const falta = FATORES.filter(f => !fatores[f.id]?.i || !fatores[f.id]?.p)
      if (falta.length) return `Faltam ${falta.length} fator(es) — responda as duas colunas.`
    }
    if (atual.tipo === 'fechamento') {
      if (!ancora)      return 'Escolha para onde você quer crescer.'
      if (enps == null) return 'Responda o quanto recomendaria a TráfegOn.'
      if (h2 == null)   return 'Responda se você se vê aqui daqui a 12 meses.'
      if (h3 == null)   return 'Responda a última pergunta.'
    }
    return ''
  }

  function avancar() {
    const e = validarEtapa()
    if (e) { setErro(e); return }
    setErro('')
    if (etapa < totalEtapas - 1) { setEtapa(etapa + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    else enviar()
  }

  async function enviar() {
    setEnviando(true); setErro('')
    const scores = calcularScores({ respostas, fatores, enps, h2, h3 })
    const linha = {
      rodada:      RODADA_ATUAL,
      user_email:  user.email,
      user_id:     user.id,
      nome:        user.name,
      funcao:      user.role,
      respostas,
      fatores:     scores.fatores,
      ancoras:     [ANCORAS.find(a => a.id === ancora)?.nome || ancora],
      abertas,
      aut: scores.AUT, mae: scores.MAE, vin: scores.VIN,
      eng: scores.ENG, hig: scores.HIG, lid: scores.LID,
      ime: scores.ime, irs: scores.irs, gmp: scores.gmp,
      enps: Number(enps),
      pensou_sair: h3,
      duracao_seg: Math.round((Date.now() - inicio) / 1000),
    }

    if (!supabaseReady) { setErro('Sem conexão com o servidor. Tente de novo mais tarde.'); setEnviando(false); return }

    const { error } = await supabase.from('motivograma_respostas').insert(linha)
    if (error) {
      if (error.code === '23505') {
        marcarLocal()
        onEnviado('duplicada')
        return
      }
      setErro(`Não foi possível enviar: ${error.message}`)
      setEnviando(false)
      return
    }
    marcarLocal()
    onEnviado('ok')
  }

  function marcarLocal() {
    try { localStorage.setItem(`motivograma_${RODADA_ATUAL}_${user.email}`, new Date().toISOString()) } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Progresso */}
      <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur pt-2 pb-3 -mx-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-text-2">Etapa {etapa + 1} de {totalEtapas}</span>
          <span className="text-xs font-bold text-accent">{progresso}%</span>
        </div>
        <Barra valor={progresso} cor="#6eda2c" altura={5} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={etapa} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>

          {atual.tipo === 'likert' && (
            <Card>
              <h2 className="text-lg font-extrabold text-text">{atual.bloco.titulo}</h2>
              <p className="text-sm text-muted mb-5">{atual.bloco.subtitulo}</p>
              <div className="space-y-5">
                {atual.bloco.itens.map((item, idx) => (
                  <div key={item.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-text mb-2.5">
                      <span className="text-muted font-bold mr-1.5">{idx + 1}.</span>
                      {item.texto.replace(/\*/g, '')}
                    </p>
                    <Likert value={respostas[item.id]} onChange={v => setResp(p => ({ ...p, [item.id]: v }))} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {atual.tipo === 'fatores' && (
            <Card>
              <h2 className="text-lg font-extrabold text-text">O que importa × o que existe</h2>
              <p className="text-sm text-muted mb-1">
                Para cada item, responda <b>duas</b> coisas: o quanto isso <b>importa pra você</b> e o quanto isso <b>existe hoje</b> na TráfegOn.
              </p>
              <p className="text-xs text-muted mb-5">1 = nada · 5 = muito. Não precisa ser coerente entre as duas colunas — a diferença é justamente o que interessa.</p>
              <div className="space-y-4">
                {FATORES.map(f => (
                  <div key={f.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <p className="text-sm font-bold text-text">{f.nome}</p>
                    <p className="text-xs text-muted mb-2.5">{f.desc}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Importa pra mim</p>
                        <MiniEscala value={fatores[f.id]?.i} cor="#be29ec"
                          onChange={v => setFatores(p => ({ ...p, [f.id]: { ...p[f.id], i: v } }))} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">Existe hoje</p>
                        <MiniEscala value={fatores[f.id]?.p} cor="#6eda2c"
                          onChange={v => setFatores(p => ({ ...p, [f.id]: { ...p[f.id], p: v } }))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {atual.tipo === 'fechamento' && (
            <Card>
              <h2 className="text-lg font-extrabold text-text">Últimas quatro</h2>
              <p className="text-sm text-muted mb-5">Responder com sinceridade aqui é o que torna o resto útil.</p>

              <div className="pb-5 border-b border-border">
                <p className="text-sm font-semibold text-text mb-2.5">Para onde você quer crescer nos próximos 3 anos?</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {ANCORAS.map(a => (
                    <button key={a.id} type="button" onClick={() => setAncora(a.id)}
                      className={`text-left p-3 rounded-xl border text-sm font-bold transition-all ${ancora === a.id ? 'border-purple bg-purple-dim text-text' : 'border-border bg-surface-2 text-text-2 hover:border-purple/40'}`}>
                      {a.nome}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-5 border-b border-border">
                <p className="text-sm font-semibold text-text mb-2.5">De 0 a 10, o quanto você recomendaria a TráfegOn como lugar para trabalhar?</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 11 }, (_, v) => (
                    <button key={v} type="button" onClick={() => setEnps(v)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold border transition-all ${enps === v ? 'border-accent bg-accent text-white' : 'border-border bg-surface-2 text-text-2 hover:border-accent/40'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-5 border-b border-border">
                <p className="text-sm font-semibold text-text mb-2.5">Me vejo trabalhando aqui daqui a 12 meses.</p>
                <Likert value={h2} onChange={setH2} />
              </div>

              <div className="pt-5">
                <p className="text-sm font-semibold text-text mb-1">Nos últimos 3 meses, considerei seriamente sair.</p>
                <p className="text-xs text-muted mb-2.5">Responder “sim” aqui não tem consequência nenhuma — é informação, não infração.</p>
                <div className="flex gap-2">
                  {[['Sim', true], ['Não', false]].map(([label, val]) => (
                    <button key={label} type="button" onClick={() => setH3(val)}
                      className={`px-6 h-11 rounded-xl text-sm font-bold border transition-all ${h3 === val ? 'border-accent bg-accent text-white' : 'border-border bg-surface-2 text-text-2 hover:border-accent/40'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {atual.tipo === 'abertas' && (
            <Card>
              <h2 className="text-lg font-extrabold text-text">Com suas palavras</h2>
              <p className="text-sm text-muted mb-5">Pode ser curto. Deixe em branco o que não quiser responder.</p>
              <div className="space-y-4">
                {ABERTAS.map(a => (
                  <div key={a.id}>
                    <label className="text-sm font-semibold text-text block mb-1.5">{a.texto}</label>
                    <textarea rows={2} value={abertas[a.id] || ''}
                      onChange={e => setAbertas(p => ({ ...p, [a.id]: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent resize-y" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {erro && (
        <div className="flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-3" style={{ background: '#ef444414', color: '#ef4444' }}>
          <AlertTriangle size={16} /> {erro}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={etapa === 0 || enviando}
          onClick={() => { setErro(''); setEtapa(e => e - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-1.5 px-4 h-11 rounded-xl border border-border bg-white text-sm font-bold text-text-2 disabled:opacity-40">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button type="button" onClick={avancar} disabled={enviando}
          className="flex items-center gap-1.5 px-6 h-11 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-extrabold disabled:opacity-60">
          {enviando ? 'Enviando…' : etapa === totalEtapas - 1 ? <>Enviar respostas <Check size={16} /></> : <>Continuar <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   RESULTADOS — exclusivo do Gabriel
   ══════════════════════════════════════════════════════════ */

function FichaPessoa({ r }) {
  const [aberto, setAberto] = useState(false)
  const fIME = faixaIME(r.ime)
  const fIRS = faixaIRS(r.irs)
  const scores = { AUT: r.aut, MAE: r.mae, VIN: r.vin, ENG: r.eng, HIG: r.hig, LID: r.lid }
  const motor = motorDominante(scores)
  const agir = (r.fatores || []).filter(f => quadrante(f).id === 'agir').sort((a, b) => b.gap - a.gap)
  const proteger = (r.fatores || []).filter(f => quadrante(f).id === 'proteger')

  return (
    <Card className="!p-0 overflow-hidden">
      <button onClick={() => setAberto(!aberto)} className="w-full text-left p-4 hover:bg-surface-2/50 transition-colors">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <p className="text-sm font-extrabold text-text">{r.nome || r.user_email}</p>
            <p className="text-[11px] text-muted">{r.user_email}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted uppercase">IME</p>
            <p className="text-lg font-extrabold" style={{ color: fIME.cor }}>{r.ime}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted uppercase">Risco</p>
            <p className="text-lg font-extrabold" style={{ color: fIRS.cor }}>{r.irs}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted uppercase">eNPS</p>
            <p className="text-lg font-extrabold text-text-2">{r.enps}</p>
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg" style={{ background: `${fIRS.cor}18`, color: fIRS.cor }}>
            {fIRS.emoji} {fIRS.label}
          </span>
          <ChevronRight size={16} className={`text-muted transition-transform ${aberto ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {aberto && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {r.pensou_sair && (
            <div className="flex items-center gap-2 text-xs font-bold rounded-xl px-3 py-2" style={{ background: '#ef444414', color: '#ef4444' }}>
              <AlertTriangle size={14} /> Considerou sair nos últimos 3 meses
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {Object.entries(DIMENSOES).map(([k, d]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-text-2">{d.label}</span>
                  <span className="font-extrabold" style={{ color: d.cor }}>{scores[k]}</span>
                </div>
                <Barra valor={scores[k]} cor={d.cor} />
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: '#ef44440d' }}>
              <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1.5" style={{ color: '#ef4444' }}>🔴 Agir já</p>
              {agir.length ? agir.map(f => (
                <p key={f.id} className="text-xs text-text-2"><b>{f.nome}</b> — importa {f.i}, existe {f.p} <span className="text-muted">(gap {f.gap})</span></p>
              )) : <p className="text-xs text-muted">Nenhum</p>}
            </div>
            <div className="rounded-xl p-3" style={{ background: '#6eda2c0d' }}>
              <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1.5" style={{ color: '#4a9c1c' }}>🟢 Proteger</p>
              {proteger.length ? proteger.map(f => (
                <p key={f.id} className="text-xs text-text-2">{f.nome}</p>
              )) : <p className="text-xs text-muted">Nenhum</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase mb-1">Motor dominante</p>
              <p className="font-extrabold text-text">{motor}</p>
              <p className="text-muted mt-1">✓ {ALAVANCA_POR_MOTOR[motor]?.funciona}</p>
              <p className="text-muted">✗ {ALAVANCA_POR_MOTOR[motor]?.evitar}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase mb-1">Quer crescer para</p>
              {(r.ancoras || []).map((a, i) => <p key={i} className="font-semibold text-text">{a}</p>)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase mb-1">Gap ponderado</p>
              <p className="font-extrabold text-text">{r.gmp}</p>
              <p className="text-muted">quanto maior, mais distante do que a pessoa valoriza</p>
            </div>
          </div>

          {r.abertas && Object.keys(r.abertas).length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-bold text-muted uppercase">Respostas abertas</p>
              {ABERTAS.map(a => r.abertas[a.id] ? (
                <div key={a.id} className="rounded-xl bg-surface-2 p-3">
                  <p className="text-[11px] font-bold text-muted mb-0.5">{a.texto}</p>
                  <p className="text-xs text-text whitespace-pre-wrap">{r.abertas[a.id]}</p>
                </div>
              ) : null)}
            </div>
          )}

          <p className="text-[10px] text-muted">
            Respondido em {new Date(r.created_at).toLocaleString('pt-BR')} · levou {Math.round((r.duracao_seg || 0) / 60)} min
          </p>
        </div>
      )}
    </Card>
  )
}

function Resultados() {
  const [linhas, setLinhas]   = useState([])
  const [carregando, setCarr] = useState(true)
  const [erro, setErro]       = useState('')

  async function carregar() {
    setCarr(true); setErro('')
    const { data, error } = await supabase
      .from('motivograma_respostas').select('*')
      .eq('rodada', RODADA_ATUAL).order('irs', { ascending: false })
    if (error) setErro(error.message)
    setLinhas(data || [])
    setCarr(false)
  }
  useEffect(() => { if (supabaseReady) carregar() }, [])

  const equipe = useMemo(() => getAllUsers().filter(u => u.role !== 'cliente' && u.role !== 'client'), [])
  const pendentes = equipe.filter(u => !linhas.some(l => l.user_email === u.email))

  const agg = useMemo(() => {
    if (!linhas.length) return null
    const n = linhas.length
    const md = k => Math.round(linhas.reduce((a, l) => a + (Number(l[k]) || 0), 0) / n * 10) / 10
    const imes = linhas.map(l => Number(l.ime) || 0)
    const mediaIME = imes.reduce((a, b) => a + b, 0) / n
    const dp = Math.round(Math.sqrt(imes.reduce((a, v) => a + (v - mediaIME) ** 2, 0) / n) * 10) / 10
    const prom = linhas.filter(l => l.enps >= 9).length
    const det  = linhas.filter(l => l.enps <= 6).length
    const dims = Object.keys(DIMENSOES).map(k => ({ k, label: DIMENSOES[k].label, v: md(k.toLowerCase()) }))
    const maisFraca = [...dims].sort((a, b) => a.v - b.v)[0]

    const contagem = {}
    linhas.forEach(l => (l.fatores || []).forEach(f => {
      if (quadrante(f).id === 'agir') contagem[f.nome] = (contagem[f.nome] || 0) + 1
    }))
    const sistemicos = Object.entries(contagem).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1])

    return {
      n, ime: md('ime'), dp,
      enps: Math.round(((prom - det) / n) * 100),
      risco: linhas.filter(l => Number(l.irs) >= 45).length,
      dims, maisFraca, sistemicos,
    }
  }, [linhas])

  function exportarCSV() {
    const cols = ['nome', 'user_email', 'ime', 'irs', 'gmp', 'enps', 'pensou_sair', 'aut', 'mae', 'vin', 'des', 'eng', 'hig', 'lid', 'created_at']
    const csv = [cols.join(';'), ...linhas.map(l => cols.map(c => `"${String(l[c] ?? '').replace(/"/g, '""')}"`).join(';'))].join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url; a.download = `motivograma-${RODADA_ATUAL}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  async function apagar(email, nome) {
    if (!window.confirm(`Apagar a resposta de ${nome}? Isso libera a pessoa para responder de novo — a resposta atual será perdida.`)) return
    const { error } = await supabase.from('motivograma_respostas')
      .delete().eq('rodada', RODADA_ATUAL).eq('user_email', email)
    if (error) { alert(`Não foi possível apagar: ${error.message}`); return }
    carregar()
  }

  if (carregando) return <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-muted">Carregando respostas…</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: '#6eda2c14', color: '#4a9c1c' }}>
          <ShieldCheck size={14} /> Visível apenas para você — rodada {RODADA_ATUAL}
        </div>
        <div className="flex gap-2">
          <button onClick={carregar} className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border bg-white text-xs font-bold text-text-2">
            <RefreshCw size={13} /> Atualizar
          </button>
          <button onClick={exportarCSV} disabled={!linhas.length} className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border bg-white text-xs font-bold text-text-2 disabled:opacity-40">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-3" style={{ background: '#ef444414', color: '#ef4444' }}>
          <AlertTriangle size={16} /> {erro}
        </div>
      )}

      {!linhas.length ? (
        <Card><p className="text-sm text-muted">Nenhuma resposta ainda nesta rodada.</p></Card>
      ) : (
        <>
          {/* Agregados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'IME médio',   valor: agg.ime,   sufixo: '', alvo: '≥ 75', cor: faixaIME(agg.ime).cor },
              { label: 'eNPS',        valor: agg.enps,  sufixo: '', alvo: '> +30', cor: agg.enps > 30 ? '#6eda2c' : '#ea8a29' },
              { label: 'Dispersão',   valor: agg.dp,    sufixo: '', alvo: '< 12', cor: agg.dp < 12 ? '#6eda2c' : '#ea8a29' },
              { label: 'Em risco',    valor: agg.risco, sufixo: `/${agg.n}`, alvo: '< 15%', cor: agg.risco ? '#ef4444' : '#6eda2c' },
            ].map(c => (
              <Card key={c.label} className="!p-4">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wide">{c.label}</p>
                <p className="text-2xl font-extrabold" style={{ color: c.cor }}>{c.valor}<span className="text-sm text-muted">{c.sufixo}</span></p>
                <p className="text-[10px] text-muted">alvo {c.alvo}</p>
              </Card>
            ))}
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={15} className="text-accent" />
              <h3 className="text-sm font-extrabold text-text">Dimensões do time</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {agg.dims.map(d => (
                <div key={d.k}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-text-2">{d.label}</span>
                    <span className="font-extrabold" style={{ color: DIMENSOES[d.k].cor }}>{d.v}</span>
                  </div>
                  <Barra valor={d.v} cor={DIMENSOES[d.k].cor} />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              Dimensão mais fraca: <b className="text-text">{agg.maisFraca.label}</b> ({agg.maisFraca.v}) — vira tema do treinamento do mês.
            </p>
          </Card>

          {agg.sistemicos.length > 0 && (
            <Card className="!border-danger/30" >
              <p className="text-[11px] font-extrabold uppercase tracking-wide mb-2" style={{ color: '#ef4444' }}>Problemas de sistema (3+ pessoas)</p>
              <div className="flex flex-wrap gap-2">
                {agg.sistemicos.map(([nome, c]) => (
                  <span key={nome} className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#ef444414', color: '#ef4444' }}>
                    {nome} — {c} pessoas
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">Não resolve em 1:1. Resolve mudando a operação ou a liderança.</p>
            </Card>
          )}

          {/* Individuais */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-text px-1">Respostas individuais — ordenadas por risco</h3>
            {linhas.map(r => (
              <div key={r.user_email} className="relative group">
                <FichaPessoa r={r} />
                <button onClick={() => apagar(r.user_email, r.nome)} title="Apagar resposta (libera para responder de novo)"
                  className="absolute top-4 right-11 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-danger/10">
                  <Trash2 size={13} className="text-danger" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {pendentes.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Users2 size={15} className="text-muted" />
            <h3 className="text-sm font-extrabold text-text">Ainda não responderam ({pendentes.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {pendentes.map(u => (
              <span key={u.email} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-2 text-text-2">{u.name}</span>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PÁGINA
   ══════════════════════════════════════════════════════════ */

export default function Motivograma({ user }) {
  const ehDono = user?.email === DONO
  const [aba, setAba] = useState(ehDono ? 'resultados' : 'responder')
  const [status, setStatus] = useState(() => {
    try { return localStorage.getItem(`motivograma_${RODADA_ATUAL}_${user?.email}`) ? 'ok' : null } catch { return null }
  })
  const [verificando, setVerificando] = useState(!status)

  // Confere no servidor se esta pessoa já respondeu — o localStorage só vale
  // no navegador em que ela respondeu. A função devolve true/false, nunca o conteúdo.
  useEffect(() => {
    if (status || !supabaseReady) { setVerificando(false); return }
    let vivo = true
    supabase.rpc('motivograma_ja_respondi', { p_rodada: RODADA_ATUAL })
      .then(({ data }) => { if (vivo) { if (data === true) setStatus('duplicada'); setVerificando(false) } })
      .catch(() => { if (vivo) setVerificando(false) })
    return () => { vivo = false }
  }, [status])

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10">
            <HeartPulse size={22} className="text-accent" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl font-extrabold text-text">Motivograma</h1>
            <p className="text-sm text-muted">O que te move, e o quanto disso existe hoje. Rodada {RODADA_ATUAL}.</p>
          </div>
          {ehDono && (
            <div className="flex gap-1 p-1 rounded-xl bg-surface-2">
              {[['resultados', 'Resultados'], ['responder', 'Responder']].map(([k, label]) => (
                <button key={k} onClick={() => setAba(k)}
                  className={`px-3 h-8 rounded-lg text-xs font-bold transition-all ${aba === k ? 'bg-white text-text shadow-sm' : 'text-muted'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {aba === 'resultados' && ehDono && <Resultados />}

      {aba === 'responder' && verificando && (
        <div className="max-w-2xl mx-auto px-4 py-10 text-sm text-muted">Verificando…</div>
      )}

      {aba === 'responder' && !verificando && (
        status ? (
          <div className="max-w-2xl mx-auto px-4 py-10">
            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Check size={26} className="text-accent" />
              </div>
              <h2 className="text-lg font-extrabold text-text mb-1">
                {status === 'duplicada' ? 'Você já respondeu esta rodada' : 'Resposta enviada'}
              </h2>
              <p className="text-sm text-muted mb-4">
                {status === 'duplicada'
                  ? 'Já existe uma resposta sua registrada nesta rodada. Se precisar refazer, fale com o Gabriel — só ele consegue reabrir.'
                  : 'Obrigado pela franqueza. A devolutiva vem no seu próximo 1:1, em até 10 dias.'}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl" style={{ background: '#12141e0a', color: '#3d4575' }}>
                <Lock size={13} /> A partir de agora, só o Gabriel tem acesso a esta resposta
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto px-4 pt-5">
              <Card className="!bg-surface-2 !border-0">
                <div className="flex items-start gap-2.5">
                  <Lock size={15} className="text-text-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-text-2 space-y-1">
                    <p><b>Como isso funciona:</b> 4 etapas, ~5 minutos. Não é anônimo e não é avaliação de desempenho — mede o que a empresa entrega a você, não o contrário.</p>
                    <p><b>Depois de enviar, só o Gabriel tem acesso.</b> Nem você consegue reler; a devolutiva é feita no seu 1:1, em até 10 dias.</p>
                  </div>
                </div>
              </Card>
            </div>
            <Formulario user={user} onEnviado={setStatus} />
          </>
        )
      )}
    </div>
  )
}
