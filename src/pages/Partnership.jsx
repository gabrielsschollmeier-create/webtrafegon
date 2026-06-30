import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Presentation, Users2, Plus, TrendingUp, DollarSign,
  Target, CheckCircle, Building2, User, Handshake, AlertTriangle,
  Calendar, ChevronRight, Star, BarChart3, X
} from 'lucide-react'

/* ─── Dados ───────────────────────────────────────────────── */
const initialTimeline = [
  {
    id: 1,
    date: '30/06/2026',
    title: 'Primeira conversa — Pitch de parceria',
    desc: 'Apresentação da proposta de 5% por R$ 54.000 em 18 meses. Valuation R$ 1.080.000 (metodologia SDE × 4,33). Elieser recebeu o pitch completo com DRE, clientes e estrutura.',
    type: 'conversa',
  },
]

const slides = [
  {
    num: '01', type: 'problem',
    title: 'A armadilha do dono',
    body: 'O negócio cresce, mas tudo ainda passa por mim. Não consigo sair de férias, não consigo focar em estratégia, não consigo escalar. Estou preso no que construí.',
    icon: Building2,
  },
  {
    num: '02', type: 'problem',
    title: 'A armadilha do profissional',
    body: 'Perfil de sócio. Trajetória de funcionário. Anos entregando resultado — mas sempre para outros. Sem participação, sem upside, sem construir nada próprio.',
    icon: User,
  },
  {
    num: '03', type: 'solution',
    title: 'Essa proposta resolve as duas',
    body: 'Você entra como sócio em um negócio real, já funcionando, para fazer o que já faz bem — e construir algo seu no processo.',
    icon: Handshake,
  },
  {
    num: '04', type: 'data',
    title: '3 anos de crescimento',
    body: '2024 → R$ 418k  ·  2025 → R$ 505k  ·  2026 → R$ 587k (projetado)\nCAGR de 18,4% ao ano.',
    icon: TrendingUp,
  },
  {
    num: '05', type: 'data',
    title: '20 clientes. MRR R$ 48.578.',
    body: 'Ticket médio R$ 2.378/mês. Maior cliente = 9,3% do MRR. Contratos 100% formalizados. Crescimento da carteira: +17,6% em 2026.',
    icon: Users2,
  },
  {
    num: '06', type: 'data',
    title: 'Valuation R$ 1.080.000',
    body: 'Metodologia SDE (Seller\'s Discretionary Earnings): lucro ajustado R$ 138k + pró-labore R$ 108k = SDE R$ 246k × 4,33 = R$ 1.080.000.\nMúltiplo conservador para agências com MRR formalizado.',
    icon: DollarSign,
  },
  {
    num: '07', type: 'offer',
    title: 'A proposta',
    body: '5% da TráfegOn\nR$ 3.000/mês durante 18 meses = R$ 54.000\n\nPró-labore contratado: R$ 8.000\nRecebido no bolso: R$ 5.000\nCliff único: mês 18',
    icon: Target,
  },
  {
    num: '08', type: 'expectation',
    title: 'O que se espera — 18 meses',
    body: 'Tipo A: absorção dos processos, gestão da equipe, 1 melhoria documentada, teste de 7 dias de ausência.\nTipo B: MRR ≥ R$ 58k, retenção ≥ 80%, margem ≥ 22%, NPS ≥ 8.',
    icon: CheckCircle,
  },
  {
    num: '09', type: 'upside',
    title: 'O seu upside',
    body: 'Participação hoje: R$ 54k\nParticipação projetada em 18 meses: R$ 75k (+39%)\nDistribuição anual de lucros: ~R$ 6.900/ano\nPotencial de nova negociação após o ciclo.',
    icon: Star,
  },
  {
    num: '10', type: 'rules',
    title: 'Regras claras',
    body: 'Saída voluntária antes do mês 18 → encerra limpo, sem cotas.\nDispensa sem justa causa → Gabriel restitui desconto acumulado.\nDistribuição de lucros: anual, após consolidado.\nNão bateu metas → cotas não transferidas, renegociação.',
    icon: AlertTriangle,
  },
  {
    num: '11', type: 'next',
    title: 'Próximo passo',
    body: '1. Alinhamento e perguntas\n2. Assinatura do MOU\n3. Revisão jurídica\n4. Kick-off com registro dos valores base\n5. Início dos 18 meses',
    icon: ChevronRight,
  },
]

const orgNodes = [
  { id: 'gabriel',  name: 'Gabriel Schollmeier', role: 'CEO / Fundador',        type: 'ceo',        parent: null,      scope: ['Estratégico', 'Político', 'Comercial', 'Financeiro'] },
  { id: 'elieser',  name: 'Elieser',             role: 'COO',                   type: 'candidato',  parent: 'gabriel', tag: 'Candidato', scope: ['Operacional', 'Tático'] },
  { id: 'juliano',  name: 'Juliano',              role: 'Comercial',             type: 'clt',        parent: 'gabriel', tag: 'Direto ao CEO' },
  { id: 'tochiro',  name: 'Eduardo Tochiro',      role: 'Gestor de Tráfego',    type: 'clt',        parent: 'elieser' },
  { id: 'ana',      name: 'Ana',                  role: 'Estagiária',            type: 'estagiario', parent: 'elieser' },
  { id: 'deivisson',name: 'Deivisson',            role: 'Freela — Criativo',     type: 'freela',     parent: 'elieser' },
  { id: 'geovana',  name: 'Geovana',              role: 'Freela — Social Media', type: 'freela',     parent: 'elieser' },
]

/* ─── Cores por tipo ──────────────────────────────────────── */
const slideColors = {
  problem:     { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  icon: '#ef4444',  label: 'Problema' },
  solution:    { bg: 'rgba(110,218,44,0.08)', border: 'rgba(110,218,44,0.3)',  icon: '#6eda2c',  label: 'Solução' },
  data:        { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', icon: '#3b82f6',  label: 'Dados' },
  offer:       { bg: 'rgba(110,218,44,0.12)', border: 'rgba(110,218,44,0.5)',  icon: '#6eda2c',  label: 'Proposta' },
  expectation: { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)', icon: '#eab308',  label: 'Metas' },
  upside:      { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', icon: '#a855f7',  label: 'Upside' },
  rules:       { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)', icon: '#fb923c',  label: 'Regras' },
  next:        { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.25)', icon: '#14b8a6',  label: 'Próximo' },
}

const orgColors = {
  ceo:       { bg: 'rgba(110,218,44,0.12)', border: 'rgba(110,218,44,0.4)',  text: '#6eda2c' },
  candidato: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)',  text: '#a855f7' },
  clt:       { bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.3)',  text: '#3b82f6' },
  estagiario:{ bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.3)',   text: '#eab308' },
  freela:    { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.45)' },
}

/* ─── Componentes ─────────────────────────────────────────── */
function OrgCard({ node }) {
  const c = orgColors[node.type]
  return (
    <div className="flex flex-col items-center">
      <div className="px-4 py-3 rounded-xl text-center min-w-[148px]"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <p className="text-sm font-semibold" style={{ color: c.text }}>{node.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{node.role}</p>
        {node.tag && (
          <span className="inline-block mt-1.5 text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded-full"
            style={
              node.type === 'candidato'
                ? { background: 'rgba(168,85,247,0.2)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }
                : { background: 'rgba(59,130,246,0.2)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }
            }>
            {node.tag}
          </span>
        )}
        {node.scope && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {node.scope.map(s => (
              <span key={s} className="text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AddTimelineModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ date: '', title: '', desc: '', type: 'conversa' })
  const types = ['conversa', 'alinhamento', 'documento', 'decisao', 'pendencia']

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: '#1a1d2a', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Novo registro</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/70"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Data</label>
              <input type="text" placeholder="DD/MM/AAAA"
                value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none capitalize"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Título</label>
            <input type="text" placeholder="Ex: Segunda conversa — alinhamento operacional"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Descrição</label>
            <textarea rows={3} placeholder="O que foi discutido, decidido ou encaminhado..."
              value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-white/50 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
          <button onClick={() => { if (form.date && form.title) { onAdd(form); onClose() } }}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#6eda2c', color: '#0a0c12' }}>Salvar</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Tabs ────────────────────────────────────────────────── */
const TABS = [
  { id: 'timeline',     label: 'Linha do Tempo',   icon: Clock },
  { id: 'slides',       label: 'Apresentação',     icon: Presentation },
  { id: 'organograma',  label: 'Organograma',      icon: Users2 },
]

const typeColors = {
  conversa:    { bg: 'rgba(110,218,44,0.12)', text: '#6eda2c',  border: 'rgba(110,218,44,0.3)'  },
  alinhamento: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6',  border: 'rgba(59,130,246,0.3)'  },
  documento:   { bg: 'rgba(234,179,8,0.12)',  text: '#eab308',  border: 'rgba(234,179,8,0.3)'   },
  decisao:     { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444',  border: 'rgba(239,68,68,0.3)'   },
  pendencia:   { bg: 'rgba(251,146,60,0.12)', text: '#fb923c',  border: 'rgba(251,146,60,0.3)'  },
}

/* ─── Page ────────────────────────────────────────────────── */
export default function Partnership({ user }) {
  const [tab, setTab]           = useState('timeline')
  const [timeline, setTimeline] = useState(initialTimeline)
  const [showModal, setShowModal] = useState(false)
  const isAdmin = user?.role === 'admin'

  function handleAdd(entry) {
    setTimeline(prev => [...prev, { ...entry, id: Date.now() }])
  }

  const children = orgNodes.filter(n => n.parent === 'gabriel')
  const ceo = orgNodes.find(n => n.id === 'gabriel')

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#080a12' }}>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Handshake size={18} style={{ color: '#6eda2c' }} />
              <h1 className="text-lg font-bold text-white">Partnership</h1>
              <span className="text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.25)' }}>
                CONFIDENCIAL
              </span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Processo de entrada de Elieser como sócio COO — 5% · R$ 54.000 · 18 meses
            </p>
          </div>
          <div className="flex gap-4 text-center flex-shrink-0">
            {[
              { label: 'Participação', value: '5%' },
              { label: 'Valor total', value: 'R$ 54k' },
              { label: 'Prazo', value: '18 meses' },
              { label: 'Valuation', value: 'R$ 1,08M' },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-bold text-white">{value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === id ? 'rgba(110,218,44,0.12)' : 'transparent',
                color: tab === id ? '#6eda2c' : 'rgba(255,255,255,0.4)',
                border: tab === id ? '1px solid rgba(110,218,44,0.25)' : '1px solid transparent',
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Tab: Linha do Tempo ── */}
          {tab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {timeline.length} registro{timeline.length !== 1 ? 's' : ''}
                </p>
                {isAdmin && (
                  <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                    style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c', border: '1px solid rgba(110,218,44,0.25)' }}>
                    <Plus size={12} /> Adicionar registro
                  </button>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="space-y-4">
                  {timeline.map((item, i) => {
                    const tc = typeColors[item.type] || typeColors.conversa
                    return (
                      <motion.div key={item.id}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center z-10"
                            style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                            <Calendar size={14} style={{ color: tc.text }} />
                          </div>
                        </div>
                        <div className="flex-1 pb-4 rounded-xl p-4"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                              style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                              {item.type}
                            </span>
                            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.date}</span>
                          </div>
                          <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                          {item.desc && <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Próximas conversas previstas */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Próximas etapas previstas</p>
                {[
                  { num: 2, title: 'Alinhamento operacional', desc: 'Definir o que o COO vai assumir e quando. Premissas básicas da relação.' },
                  { num: 3, title: 'Pacto de expectativas', desc: 'Metas Tipo A e B, cliff, distribuição de lucros, conduta.' },
                  { num: 4, title: 'Formalização jurídica', desc: 'Assinatura dos contratos com advogado presente.' },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{num}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">{title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Tab: Apresentação ── */}
          {tab === 'slides' && (
            <motion.div key="slides" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map((s, i) => {
                const c = slideColors[s.type]
                const Icon = s.icon
                return (
                  <motion.div key={s.num}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-xl p-5 space-y-3 ${s.type === 'offer' ? 'md:col-span-2' : ''}`}
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,0,0,0.3)' }}>
                          <Icon size={15} style={{ color: c.icon }} />
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold tracking-widest uppercase"
                            style={{ color: c.icon, opacity: 0.7 }}>{c.label}</span>
                          <p className="text-sm font-bold text-white leading-tight">{s.title}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black flex-shrink-0 mt-0.5"
                        style={{ color: 'rgba(255,255,255,0.2)' }}>#{s.num}</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {s.body}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* ── Tab: Organograma ── */}
          {tab === 'organograma' && (
            <motion.div key="organograma" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Estrutura atual — Junho/2026
              </p>

              {/* Nível 1 — CEO */}
              <div className="flex justify-center">
                <OrgCard node={ceo} />
              </div>

              {/* Divisão lado a lado — CEO | COO */}
              <div className="grid grid-cols-2 gap-3">

                {/* Coluna CEO — Gabriel */}
                <div className="flex flex-col items-center gap-3 rounded-2xl p-4"
                  style={{ background: 'rgba(110,218,44,0.04)', border: '1px solid rgba(110,218,44,0.12)' }}>
                  <span className="text-[8px] font-black uppercase tracking-widest self-start"
                    style={{ color: 'rgba(110,218,44,0.55)' }}>Gestão CEO</span>
                  <OrgCard node={ceo} />
                  <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="w-full flex justify-center">
                    <OrgCard node={orgNodes.find(n => n.id === 'juliano')} />
                  </motion.div>
                </div>

                {/* Coluna COO — Elieser */}
                <div className="flex flex-col items-center gap-3 rounded-2xl p-4"
                  style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.12)' }}>
                  <span className="text-[8px] font-black uppercase tracking-widest self-start"
                    style={{ color: 'rgba(168,85,247,0.55)' }}>Gestão COO</span>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
                    className="w-full flex justify-center">
                    <OrgCard node={orgNodes.find(n => n.id === 'elieser')} />
                  </motion.div>
                  <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <span className="text-[8px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.2)' }}>Time Operacional</span>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {orgNodes.filter(n => n.parent === 'elieser').map((node, i) => (
                      <motion.div key={node.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }} className="flex justify-center">
                        <OrgCard node={node} />
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Legenda */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { type: 'ceo',        label: 'CEO / Fundador' },
                  { type: 'candidato',  label: 'Candidato COO' },
                  { type: 'clt',        label: 'CLT' },
                  { type: 'estagiario', label: 'Estagiário' },
                  { type: 'freela',     label: 'Freela' },
                ].map(({ type, label }) => {
                  const c = orgColors[type]
                  return (
                    <div key={type} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text, opacity: 0.7 }} />
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Nota — divisão de papéis */}
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Divisão de papéis
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#6eda2c' }}>Gabriel — CEO</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Decisões estratégicas e políticas do negócio. Gestão completa da área comercial e financeira
                      (tático, operacional e estratégico).
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#a855f7' }}>Elieser — COO</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Decisões operacionais e táticas da área operacional. Gestão direta do time de entrega.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && <AddTimelineModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  )
}
