import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, Wifi, WifiOff, Target, TrendingUp, TrendingDown,
  Minus, AlertTriangle, CheckCircle2, ChevronRight, Play, Pause,
  DollarSign, MousePointer, Eye, Zap, Sparkles, X, Terminal,
  BarChart2, Search, Activity, Clock, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

const GREEN  = '#6eda2c'
const DARK   = '#1a1d2e'
const DARKER = '#13151f'
const GADS   = 'http://localhost:3099'

const CONTAS = [
  { nome: 'TráfegOn | Google Ads', id: '3620143733' },
  { nome: 'Andressa Advogada',     id: '3431604401' },
  { nome: 'Ararastur Comércio',    id: '1147445454' },
  { nome: 'Carol adv',             id: '5183788348' },
  { nome: 'Caçarola',              id: '5559435113' },
  { nome: 'CDC Araranguá',         id: '9034028768' },
  { nome: 'RCA Advogados',         id: '3067037900' },
  { nome: 'Cooperja',              id: '9685109260' },
  { nome: 'Cooperja Lojas',        id: '4979499974' },
  { nome: 'Gabriel Pira',          id: '1936436305' },
  { nome: 'Intime Sistemas',       id: '5376240782' },
  { nome: 'kamy',                  id: '2746776066' },
  { nome: 'KINTO SISTEMAS',        id: '1894458588' },
  { nome: 'Lenergy',               id: '2474140291' },
  { nome: 'Mayara Campos',         id: '1808717829' },
  { nome: 'Pil Floripa',           id: '4162632254' },
  { nome: 'Polizio Advogados',     id: '8731710435' },
  { nome: 'Posto Rizzotto',        id: '9175063247' },
  { nome: 'Sítio Girabas',         id: '1754710815' },
]

const PERIODOS = [
  { label: '7d',  dias: 7  },
  { label: '14d', dias: 14 },
  { label: '30d', dias: 30 },
]

const PLAYBOOKS = `
Playbooks de otimização (TráfegOn):
A — CPL alto desde o início → Reduz orçamento 20% + troca criativo
B — Público errado nos anúncios → Edita público com base no perfil de lead ideal
C — Muitos leads frios → Google: revisa termos e adiciona negativos · Meta: restringe público
D — Facebook gastando sem converter → Remove Facebook dos posicionamentos, mantém só Instagram
E — Um canal claramente melhor → Realoca 30% do orçamento do canal fraco para o forte
F — Criativo com >R$40 gasto e zero leads → Pausa o anúncio imediatamente
G — Lead não responde no WhatsApp → Muda primeira mensagem
H — Perfil vencedor identificado → Duplica conjunto de anúncios e segmenta para o perfil
I — Keyword com >R$30 gasto e zero leads → Pausa a keyword
J — Quer escalar o que funciona → Aumenta orçamento máx 20% a cada 3–4 dias

Nível de autonomia:
- Análise, relatórios, alertas, sugestões: executa direto
- Ajuste de orçamento, pausa/ativação: propõe e aguarda aprovação
- Cancelamento de contratos, mudanças estruturais >R$2k/mês: NUNCA executa sozinho
`

function fmt(n, prefix = '', suffix = '') {
  if (n == null || n === '') return '—'
  const v = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(v)) return '—'
  return `${prefix}${v.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}${suffix}`
}

function StatusBadge({ status }) {
  const s = String(status || '').toUpperCase()
  const cfg = s === 'ENABLED'
    ? { label: 'Ativa',  color: GREEN,     bg: `${GREEN}18` }
    : s === 'PAUSED'
    ? { label: 'Pausada', color: '#f59e0b', bg: '#f59e0b18' }
    : { label: s || '—', color: '#8890b5', bg: '#8890b518' }
  return (
    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  )
}

function MetricCard({ icon: Icon, label, value, sub, color = GREEN, trend }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1"
      style={{ background: `${DARK}cc`, border: `1px solid ${color}18` }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <p className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase">{label}</p>
      </div>
      <p className="text-xl font-extrabold text-white leading-none">{value}</p>
      {sub && <p className="text-[10px] text-white/40 mt-0.5">{sub}</p>}
      {trend != null && (
        <div className={`flex items-center gap-1 mt-1 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white/40'}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : trend < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
          <span className="text-[10px] font-bold">{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}

function ActionCard({ action, onConfirm, loading }) {
  const [expanded, setExpanded] = useState(false)
  const codeColors = {
    A: '#ef4444', B: '#f59e0b', C: '#f97316', D: '#8b5cf6',
    E: '#06b6d4', F: '#ef4444', G: '#22c55e', H: GREEN,
    I: '#ef4444', J: GREEN,
  }
  const color = codeColors[action.codigo] || GREEN
  const canAct = action.acao_tipo && action.campanha_id

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: `${DARK}cc`, border: `1px solid ${color}25` }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <span className="text-[11px] font-extrabold" style={{ color }}>{action.codigo}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-snug">{action.titulo}</p>
          <p className="text-xs text-white/50 mt-0.5 leading-snug">{action.descricao}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color, background: `${color}18` }}>
            {action.prioridade === 'alta' ? '🔴 Alta' : action.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}
          </span>
          <ChevronRight size={14} className={`text-white/30 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: `${color}18` }}>
              {action.impacto && (
                <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: `${color}08` }}>
                  <AlertTriangle size={13} style={{ color }} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 leading-snug">{action.impacto}</p>
                </div>
              )}
              {canAct && (
                <div className="flex items-center gap-2 pt-1">
                  {action.acao_tipo === 'pausar' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      disabled={loading}
                      onClick={() => onConfirm(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }}
                    >
                      <Pause size={12} />
                      {loading ? 'Pausando…' : 'Confirmar — Pausar campanha'}
                    </motion.button>
                  )}
                  {action.acao_tipo === 'orcamento' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      disabled={loading}
                      onClick={() => onConfirm(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30` }}
                    >
                      <DollarSign size={12} />
                      {loading ? 'Ajustando…' : `Confirmar — R$ ${action.novo_orcamento}`}
                    </motion.button>
                  )}
                  {action.acao_tipo === 'ativar' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      disabled={loading}
                      onClick={() => onConfirm(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30` }}
                    >
                      <Play size={12} />
                      {loading ? 'Ativando…' : 'Confirmar — Ativar campanha'}
                    </motion.button>
                  )}
                  <p className="text-[10px] text-white/30">Requer confirmação explícita</p>
                </div>
              )}
              {!canAct && (
                <p className="text-[11px] text-white/30 italic pt-1">
                  Ação manual necessária — verificar no gerenciador
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Tab Campanhas ──────────────────────────────────────────── */
function TabCampanhas({ customerId, periodo }) {
  const [campanhas, setCampanhas] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!customerId) return
    setLoading(true)
    setErro(null)
    Promise.all([
      fetch(`${GADS}/campanhas/${customerId}`).then(r => r.json()),
      fetch(`${GADS}/performance/${customerId}?dias=${periodo}`).then(r => r.json()),
    ])
      .then(([c, p]) => {
        if (c.erro) throw new Error(c.erro)
        setCampanhas(c)
        setPerformance(p)
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [customerId, periodo])

  const perfMap = {}
  if (Array.isArray(performance)) {
    for (const p of performance) perfMap[p.id] = p
  }

  const totais = Array.isArray(performance) ? performance.reduce((acc, p) => ({
    gasto: acc.gasto + (p.custo_total || 0),
    cliques: acc.cliques + (p.cliques || 0),
    impressoes: acc.impressoes + (p.impressoes || 0),
    conversoes: acc.conversoes + (p.conversoes || 0),
  }), { gasto: 0, cliques: 0, impressoes: 0, conversoes: 0 }) : null

  if (loading) return <Loader />
  if (erro) return <ErroBox msg={erro} />

  return (
    <div className="space-y-5">
      {totais && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard icon={DollarSign}    label="Gasto total"   value={fmt(totais.gasto, 'R$ ')}                    color={GREEN}    />
          <MetricCard icon={MousePointer}  label="Cliques"       value={totais.cliques.toLocaleString('pt-BR')}      color="#60a5fa"  />
          <MetricCard icon={Eye}           label="Impressões"    value={totais.impressoes.toLocaleString('pt-BR')}   color="#8b5cf6"  />
          <MetricCard icon={CheckCircle2}  label="Conversões"    value={fmt(totais.conversoes)}                       color="#f59e0b"  />
        </div>
      )}

      {Array.isArray(campanhas) && campanhas.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: `${DARK}cc`, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Target size={14} style={{ color: GREEN }} />
            <p className="text-xs font-extrabold text-white/70 tracking-widest uppercase">Campanhas</p>
            <span className="text-[10px] text-white/30 ml-auto">{campanhas.length} campanhas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Campanha','Status','Orçamento/dia','Gasto','Cliques','CTR','CPC','Conv.','CPA'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-extrabold text-white/30 tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campanhas.map((c, i) => {
                  const p = perfMap[c.id] || {}
                  return (
                    <tr key={c.id}
                      style={{ borderBottom: i < campanhas.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white/80 max-w-[200px]">
                        <span className="block truncate" title={c.nome}>{c.nome}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-white/60">{fmt(c.orcamento_diario, 'R$ ')}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: GREEN }}>{fmt(p.custo_total, 'R$ ')}</td>
                      <td className="px-4 py-3 text-white/60">{p.cliques?.toLocaleString('pt-BR') || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.ctr, '', '%')}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.cpc_medio, 'R$ ')}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.conversoes)}</td>
                      <td className="px-4 py-3 text-white/60">{p.cpa ? fmt(p.cpa, 'R$ ') : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && (
        <Vazio msg="Nenhuma campanha encontrada" />
      )}
    </div>
  )
}

/* ── Tab Palavras-chave ─────────────────────────────────────── */
function TabPalavras({ customerId, periodo }) {
  const [palavras, setPalavras]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [erro, setErro]           = useState(null)
  const [busca, setBusca]         = useState('')

  useEffect(() => {
    if (!customerId) return
    setLoading(true)
    setErro(null)
    fetch(`${GADS}/palavras/${customerId}?dias=${periodo}`)
      .then(r => r.json())
      .then(d => { if (d.erro) throw new Error(d.erro); setPalavras(d) })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [customerId, periodo])

  const filtradas = Array.isArray(palavras)
    ? palavras.filter(p => !busca || p.texto?.toLowerCase().includes(busca.toLowerCase()))
    : []

  const alertas = Array.isArray(palavras)
    ? palavras.filter(p => p.custo_total > 30 && p.conversoes === 0)
    : []

  if (loading) return <Loader />
  if (erro)    return <ErroBox msg={erro} />

  return (
    <div className="space-y-4">
      {alertas.length > 0 && (
        <div className="rounded-2xl p-3 flex items-start gap-3"
          style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
          <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-400">Playbook I — {alertas.length} keyword(s) com {'>'} R$30 e 0 conversões</p>
            <p className="text-[11px] text-red-400/70 mt-0.5">
              {alertas.slice(0,3).map(a => a.texto).join(', ')}{alertas.length > 3 ? '…' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Filtrar palavras-chave…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-white/80 placeholder:text-white/25 focus:outline-none"
            style={{ background: `${DARK}cc`, border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
        <span className="text-[11px] text-white/30">{filtradas.length} palavras</span>
      </div>

      {filtradas.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: `${DARK}cc`, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Palavra-chave','Correspondência','QS','Status','Campanha','Gasto','Cliques','CTR','CPC','Conv.'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-extrabold text-white/30 tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((p, i) => {
                  const alert = p.custo_total > 30 && p.conversoes === 0
                  return (
                    <tr key={i}
                      style={{ borderBottom: i < filtradas.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                      className={`hover:bg-white/[0.02] transition-colors ${alert ? 'bg-red-500/[0.03]' : ''}`}>
                      <td className="px-4 py-3 font-semibold max-w-[200px]">
                        <span className={`block truncate ${alert ? 'text-red-400' : 'text-white/80'}`} title={p.texto}>
                          {alert && '⚠️ '}{p.texto || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {p.correspondencia?.split('_').pop() || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.quality_score ? (
                          <span className={`font-bold ${p.quality_score >= 7 ? 'text-green-400' : p.quality_score >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {p.quality_score}/10
                          </span>
                        ) : <span className="text-white/30">—</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-white/40 max-w-[140px]">
                        <span className="block truncate text-[10px]" title={p.campanha_nome}>{p.campanha_nome}</span>
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: alert ? '#ef4444' : GREEN }}>{fmt(p.custo_total, 'R$ ')}</td>
                      <td className="px-4 py-3 text-white/60">{p.cliques?.toLocaleString('pt-BR') || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.ctr, '', '%')}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.cpc_medio, 'R$ ')}</td>
                      <td className="px-4 py-3 text-white/60">{fmt(p.conversoes)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && (
        <Vazio msg="Nenhuma palavra-chave encontrada" />
      )}
    </div>
  )
}

/* ── Tab Análise IA ─────────────────────────────────────────── */
function TabAnalise({ customerId, periodo, contaNome }) {
  const [analise, setAnalise]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState(null)
  const [acaoLoading, setAcaoLoading] = useState(null)
  const [feedback, setFeedback] = useState({})

  async function analisar() {
    const apiKey = localStorage.getItem('claudeApiKey')
    if (!apiKey) { setErro('Configure a chave de API do Claude em IA · Assistente'); return }
    setLoading(true)
    setErro(null)
    setAnalise(null)

    try {
      const [campanhasR, perfR, palavrasR] = await Promise.all([
        fetch(`${GADS}/campanhas/${customerId}`).then(r => r.json()),
        fetch(`${GADS}/performance/${customerId}?dias=${periodo}`).then(r => r.json()),
        fetch(`${GADS}/palavras/${customerId}?dias=${periodo}`).then(r => r.json()),
      ])

      if (campanhasR.erro || perfR.erro) throw new Error(campanhasR.erro || perfR.erro)

      const prompt = `
Você é Ton, analista sênior de tráfego pago da TráfegOn. Analise os dados abaixo da conta "${contaNome}" (últimos ${periodo} dias) e retorne um JSON com sugestões de otimização.

${PLAYBOOKS}

DADOS DA CONTA:
Campanhas:
${JSON.stringify(campanhasR, null, 2)}

Performance por campanha:
${JSON.stringify(perfR, null, 2)}

Top 30 palavras-chave (por gasto):
${JSON.stringify(Array.isArray(palavrasR) ? palavrasR.slice(0, 30) : [], null, 2)}

RETORNE APENAS um JSON no formato:
{
  "resumo": "2-3 linhas de contexto geral sobre a conta",
  "saude": "boa|atencao|critica",
  "acoes": [
    {
      "codigo": "A",
      "titulo": "título curto da ação",
      "descricao": "o que fazer e por quê",
      "impacto": "qual o impacto esperado",
      "prioridade": "alta|media|baixa",
      "acao_tipo": "pausar|orcamento|ativar|manual",
      "campanha_id": "id da campanha ou null",
      "novo_orcamento": null
    }
  ]
}

Regras:
- acao_tipo "pausar": quando uma campanha deve ser pausada
- acao_tipo "orcamento": quando o orçamento deve ser ajustado (informe novo_orcamento em reais)
- acao_tipo "ativar": quando uma campanha pausada deve ser reativada
- acao_tipo "manual": quando a ação precisa ser feita manualmente no gerenciador
- Retorne APENAS o JSON, sem texto adicional
`

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!resp.ok) throw new Error(`API Claude: ${resp.status}`)
      const data = await resp.json()
      const texto = data.content?.[0]?.text || ''
      const jsonMatch = texto.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Resposta inválida da IA')
      setAnalise(JSON.parse(jsonMatch[0]))
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmarAcao(action) {
    setAcaoLoading(action.campanha_id)
    try {
      let url, body = { confirmado: true }
      if (action.acao_tipo === 'pausar')   url = `${GADS}/pausar/${customerId}/${action.campanha_id}`
      if (action.acao_tipo === 'ativar')   url = `${GADS}/ativar/${customerId}/${action.campanha_id}`
      if (action.acao_tipo === 'orcamento') {
        url = `${GADS}/orcamento/${customerId}/${action.campanha_id}`
        body.novo_orcamento_reais = action.novo_orcamento
      }
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (d.erro) throw new Error(d.erro)
      setFeedback(f => ({ ...f, [action.campanha_id]: '✅ Executado com sucesso' }))
    } catch (e) {
      setFeedback(f => ({ ...f, [action.campanha_id]: `❌ ${e.message}` }))
    } finally {
      setAcaoLoading(null)
    }
  }

  const saudeCor = analise?.saude === 'boa' ? GREEN : analise?.saude === 'atencao' ? '#f59e0b' : '#ef4444'
  const saudeIcon = analise?.saude === 'boa' ? CheckCircle2 : analise?.saude === 'atencao' ? AlertTriangle : AlertTriangle

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={analisar}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
          style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}35` }}
        >
          {loading
            ? <><RefreshCw size={14} className="animate-spin" /> Analisando…</>
            : <><Sparkles size={14} /> Analisar conta com IA</>
          }
        </motion.button>
        <p className="text-[11px] text-white/30">Usa Claude Sonnet + playbooks TráfegOn</p>
      </div>

      {erro && <ErroBox msg={erro} />}

      {loading && (
        <div className="flex flex-col items-center py-12 gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={24} style={{ color: GREEN }} />
          </motion.div>
          <p className="text-sm text-white/50">Cruzando dados com os playbooks…</p>
        </div>
      )}

      {analise && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: `${saudeCor}10`, border: `1px solid ${saudeCor}25` }}>
            {(() => { const Icon = saudeIcon; return <Icon size={16} style={{ color: saudeCor }} className="flex-shrink-0 mt-0.5" /> })()}
            <div>
              <p className="text-xs font-extrabold tracking-widest uppercase mb-1" style={{ color: saudeCor }}>
                Saúde da conta — {analise.saude}
              </p>
              <p className="text-sm text-white/70 leading-snug">{analise.resumo}</p>
            </div>
          </div>

          {analise.acoes?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold tracking-widest text-white/30 uppercase px-1">
                {analise.acoes.length} sugestão(ões) de otimização
              </p>
              {analise.acoes.map((a, i) => (
                <div key={i}>
                  <ActionCard
                    action={a}
                    loading={acaoLoading === a.campanha_id}
                    onConfirm={confirmarAcao}
                  />
                  {feedback[a.campanha_id] && (
                    <p className="text-[11px] mt-1 px-2" style={{ color: feedback[a.campanha_id].startsWith('✅') ? GREEN : '#ef4444' }}>
                      {feedback[a.campanha_id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {(!analise.acoes || analise.acoes.length === 0) && (
            <div className="flex flex-col items-center py-8 gap-2">
              <CheckCircle2 size={28} style={{ color: GREEN }} />
              <p className="text-sm font-bold text-white/70">Conta sem alertas críticos</p>
              <p className="text-xs text-white/40">Continue monitorando</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */
function Loader() {
  return (
    <div className="flex items-center justify-center py-14">
      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: GREEN, borderTopColor: 'transparent' }} />
    </div>
  )
}

function ErroBox({ msg }) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3"
      style={{ background: '#ef444410', border: '1px solid #ef444330' }}>
      <Terminal size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-red-400">Erro de conexão</p>
        <p className="text-[11px] text-red-400/70 mt-0.5">{msg}</p>
        <p className="text-[10px] text-white/30 mt-2">
          Execute <code className="text-white/50">npm run server</code> em <code className="text-white/50">mcp-gads/</code> para iniciar o servidor local.
        </p>
      </div>
    </div>
  )
}

function Vazio({ msg }) {
  return (
    <div className="flex flex-col items-center py-12 gap-2">
      <Activity size={22} className="text-white/15" />
      <p className="text-sm text-white/30">{msg}</p>
    </div>
  )
}

/* ══ Trafego ════════════════════════════════════════════════════ */
export default function Trafego() {
  const [contaSelecionada, setContaSelecionada] = useState(CONTAS[0])
  const [periodo, setPeriodo]   = useState(30)
  const [tab, setTab]           = useState('campanhas')
  const [online, setOnline]     = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const checkRef = useRef(null)

  const checkHealth = useCallback(async () => {
    try {
      const r = await fetch(`${GADS}/health`, { signal: AbortSignal.timeout(3000) })
      setOnline(r.ok)
    } catch {
      setOnline(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
    checkRef.current = setInterval(checkHealth, 30000)
    return () => clearInterval(checkRef.current)
  }, [checkHealth])

  const tabs = [
    { id: 'campanhas', label: 'Campanhas',      icon: Target },
    { id: 'palavras',  label: 'Palavras-chave', icon: Search },
    { id: 'analise',   label: 'Análise IA',     icon: Sparkles },
  ]

  return (
    <div className="flex h-[calc(100vh-48px)] overflow-hidden" style={{ background: DARKER }}>
      {/* ── Lista de contas ─────────────────────────── */}
      <aside className="w-56 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ background: DARK, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={13} style={{ color: GREEN }} />
            <p className="text-[10px] font-extrabold text-white/50 tracking-widest uppercase">Google Ads</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: online === null ? '#8890b5' : online ? GREEN : '#ef4444',
                        boxShadow: online ? `0 0 6px ${GREEN}` : 'none' }} />
            <p className="text-[10px] text-white/30">
              {online === null ? 'Verificando…' : online ? 'Servidor local ativo' : 'Servidor offline'}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {CONTAS.map(conta => (
            <button
              key={conta.id}
              onClick={() => { setContaSelecionada(conta); setRefreshKey(k => k + 1) }}
              className="w-full text-left px-4 py-2.5 text-xs transition-all relative"
              style={{
                color: contaSelecionada.id === conta.id ? GREEN : 'rgba(255,255,255,0.45)',
                background: contaSelecionada.id === conta.id ? `${GREEN}0e` : 'transparent',
                borderLeft: `2px solid ${contaSelecionada.id === conta.id ? GREEN : 'transparent'}`,
                fontWeight: contaSelecionada.id === conta.id ? 700 : 500,
              }}
            >
              <span className="block leading-snug">{conta.nome}</span>
              <span className="block text-[9px] mt-0.5" style={{ color: contaSelecionada.id === conta.id ? `${GREEN}80` : 'rgba(255,255,255,0.2)' }}>
                {conta.id}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Painel principal ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-3.5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${DARK}cc` }}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white leading-none">{contaSelecionada.nome}</p>
            <p className="text-[10px] text-white/30 mt-0.5">ID: {contaSelecionada.id} · MCC 744-815-2149</p>
          </div>

          {/* Período */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {PERIODOS.map(p => (
              <button
                key={p.dias}
                onClick={() => setPeriodo(p.dias)}
                className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: periodo === p.dias ? `${GREEN}20` : 'transparent',
                  color: periodo === p.dias ? GREEN : 'rgba(255,255,255,0.35)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setRefreshKey(k => k + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}
            title="Atualizar dados"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {tabs.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: active ? `${GREEN}18` : 'transparent',
                  color: active ? GREEN : 'rgba(255,255,255,0.35)',
                }}
              >
                <Icon size={13} />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
          {online === false && tab !== 'analise' && (
            <div className="mb-4 rounded-2xl p-3 flex items-center gap-3"
              style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
              <WifiOff size={13} className="text-yellow-400 flex-shrink-0" />
              <p className="text-[11px] text-yellow-400">
                Servidor gads-server offline. Execute <code className="text-yellow-300">npm run server</code> em <code className="text-yellow-300">C:\projetos\trafego-central\mcp-gads\</code>
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${contaSelecionada.id}-${refreshKey}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'campanhas' && (
                <TabCampanhas customerId={contaSelecionada.id} periodo={periodo} />
              )}
              {tab === 'palavras' && (
                <TabPalavras customerId={contaSelecionada.id} periodo={periodo} />
              )}
              {tab === 'analise' && (
                <TabAnalise
                  customerId={contaSelecionada.id}
                  periodo={periodo}
                  contaNome={contaSelecionada.nome}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
