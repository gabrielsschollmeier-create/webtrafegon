import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Calendar, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react'
import { supabase, supabaseReady } from '../lib/supabase'

/* ── Tipos de evento ─────────────────────────────────────────── */
const EVENT_TYPES = {
  rotina:          { label: 'Rotina',        icon: '🔄', color: '#8890b5', ons: 1 },
  ritual:          { label: 'Ritual',        icon: '⚡', color: '#6eda2c', ons: 3 },
  evento:          { label: 'Evento',        icon: '🎯', color: '#60a5fa', ons: 3 },
  celebracao:      { label: 'Celebração',    icon: '🎉', color: '#f59e0b', ons: 5 },
  acao:            { label: 'Ação',          icon: '🚀', color: '#be29ec', ons: 5 },
  reuniao_cliente: { label: 'Reunião',       icon: '🤝', color: '#34d399', ons: 3 },
}

/* ── Eventos completos da TráfegOn ───────────────────────────── */
const INITIAL_EVENTS = [
  // ── DIÁRIAS ──────────────────────────────────────────────────
  { id:'d1', title:'Check de campanhas',     type:'rotina', recurrence:'daily', time:'08:00', participants:'all', description:'Verificar status, gastos e alertas de todas as campanhas ativas.' },
  { id:'d2', title:'Atualização do CRM',     type:'rotina', recurrence:'daily', time:'17:30', participants:'all', description:'Leads com ação definida. Sem pendência sem dono.' },
  { id:'d3', title:'Grupos WhatsApp clientes',type:'rotina',recurrence:'daily', time:'08:30', participants:'all', description:'Responder e interagir nos grupos de cada cliente.' },

  // ── SEMANAIS — rituais internos ───────────────────────────────
  { id:'w1', title:'Planejamento semanal',       type:'ritual', recurrence:'weekly', day:1, time:'08:30', participants:'all', description:'Distribuição de tarefas da semana. Quem faz o quê.' },
  { id:'w2', title:'Alinhamento de equipe',      type:'ritual', recurrence:'weekly', day:1, time:'09:00', participants:'all', description:'O que cada um vai fazer. Bloqueios. Decisões rápidas.' },
  { id:'w3', title:'Enviar dashboards',          type:'rotina', recurrence:'weekly', day:5, time:'12:00', participants:'all', description:'Relatório semanal de performance para todos os clientes ativos.' },
  { id:'w4', title:'Review de campanhas',        type:'ritual', recurrence:'weekly', day:5, time:'14:00', participants:'all', description:'O que funcionou, o que não funcionou, o que muda na próxima semana.' },

  // ── REUNIÕES DE EQUIPE OPERACIONAL — seg, qua, sex 11h ───────
  { id:'eq1', title:'Reunião operacional',       type:'ritual', recurrence:'weekly', day:1, time:'11:00', participants:'all', description:'Equipe operacional — alinhamento rápido (~30 min).' },
  { id:'eq2', title:'Reunião operacional',       type:'ritual', recurrence:'weekly', day:3, time:'11:00', participants:'all', description:'Equipe operacional — alinhamento rápido (~30 min).' },
  { id:'eq3', title:'Reunião operacional',       type:'ritual', recurrence:'weekly', day:5, time:'11:00', participants:'all', description:'Equipe operacional — alinhamento rápido (~30 min).' },

  // ── SEMANAL — Carol ADV ───────────────────────────────────────
  { id:'cli_carol', title:'Reunião Carol ADV', type:'reuniao_cliente', recurrence:'weekly', day:5, time:'10:00', participants:'all', description:'Reunião semanal.' },

  // ── QUINZENAIS — clientes (biweekly) ─────────────────────────
  { id:'cli_andressa', title:'Reunião Andressa Advogada',   type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-02', time:'10:00', participants:'all' },
  { id:'cli_cacarola', title:'Reunião Caçarola',            type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-03', time:'10:00', participants:'all' },
  { id:'cli_cdc',      title:'Reunião CDC Araranguá',       type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-05', time:'10:00', participants:'all', description:'Aluguel de equipamentos — 4 lojas. Quinzenais às quintas.' },
  { id:'cli_heirs',    title:'Reunião Heirs do Brasil',     type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-02', time:'14:00', participants:'all' },
  { id:'cli_intime',   title:'Reunião Intime + Temoos',     type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-06', time:'08:15', participants:'all', description:'Intime Sistemas e Temoos — mesma reunião. Sextas 08h15.' },
  { id:'cli_kamy',     title:'Reunião Kamy',                type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-03', time:'10:00', participants:'all' },
  { id:'cli_kinto',    title:'Reunião Kinto Sistemas',      type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-04', time:'10:00', participants:'all' },
  { id:'cli_lenergy',  title:'Reunião Lenergy',             type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-02', time:'14:00', participants:'all' },
  { id:'cli_loja',     title:'Reunião Loja Ambiente',       type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-03', time:'14:00', participants:'all' },
  { id:'cli_mayara',   title:'Reunião Mayara Campos',       type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-04', time:'10:00', participants:'all' },
  { id:'cli_quadros',  title:'Reunião Quadros Paisagismo',  type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-02', time:'10:00', participants:'all' },
  { id:'cli_girabas',  title:'Reunião Sítio Girabas',       type:'reuniao_cliente', recurrence:'biweekly', anchorDate:'2026-06-06', time:'10:00', participants:'all', description:'Presencial. Sextas.' },

  // ── MENSAIS — clientes ────────────────────────────────────────
  { id:'cli_ararastur',title:'Reunião Ararastur',            type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-05', time:'10:00', participants:'all' },
  { id:'cli_coop_sup', title:'Reunião Cooperja Supermercado',type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-03', time:'10:00', participants:'all' },
  { id:'cli_fglaw',    title:'Reunião FGLAW',               type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-04', time:'10:00', participants:'all' },
  { id:'cli_gpiva',    title:'Reunião Gabriel Piva',        type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-04', time:'14:00', participants:'all' },
  { id:'cli_milfer',   title:'Reunião Milfer',              type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-02', time:'10:00', participants:'all' },
  { id:'cli_nueva',    title:'Reunião Nueva',               type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-03', time:'14:00', participants:'all' },
  { id:'cli_pit',      title:'Reunião Pit Floripa',         type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-04', time:'10:00', participants:'all', description:'A cada 21 dias — quartas.' },
  { id:'cli_polizio',  title:'Reunião Polizio Advogados',   type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-02', time:'10:00', participants:'all' },
  { id:'cli_rizzotto', title:'Reunião Posto Rizzotto',      type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-05', time:'10:00', participants:'all' },
  { id:'cli_rca',      title:'Reunião RCA Advogados',       type:'reuniao_cliente', recurrence:'monthly', anchorDate:'2026-06-04', time:'10:00', participants:'all', description:'A cada 21 dias.' },

  // ── MENSAIS — rituais internos ────────────────────────────────
  { id:'m1', title:'Review de carteira',    type:'ritual',     recurrence:'monthly', anchorDate:'2026-06-26', time:'14:00', participants:'all', description:'Saúde da carteira: risco de churn, upsell, expansão.' },
  { id:'m2', title:'Distribuição de ons',   type:'celebracao', recurrence:'monthly', anchorDate:'2026-06-30', time:'15:00', participants:'all', description:'Destaque do mês + distribuição de ons da equipe.' },
  { id:'m3', title:'Fechamento relatórios', type:'rotina',     recurrence:'monthly', anchorDate:'2026-06-01', time:'09:00', participants:'all', description:'Relatório mensal de todos os clientes ativos.' },

  // ── PONTUAIS ──────────────────────────────────────────────────
  { id:'e1', title:'Retomada Cooperja Super', type:'acao',       date:'2026-06-01', time:'09:00', participants:'all', description:'Campanha pontual retomando em junho.' },
  { id:'c1', title:'Aniversário da agência',  type:'celebracao', date:'2026-07-15', participants:'all', description:'TráfegOn completa mais um ano! 🎂' },
]

/* ── Helpers de data ─────────────────────────────────────────── */
function toDateStr(d) {
  return d.toISOString().split('T')[0]
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

function getToday() {
  return toDateStr(new Date())
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today  = getToday()
  const [yyyy, mm, dd] = dateStr.split('-').map(Number)

  if (dateStr === today) return { main: 'Hoje', sub: d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }) }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const dow = d.getDay()
  return {
    main: dayNames[dow] + ' ' + String(dd).padStart(2, '0'),
    sub: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
  }
}

function formatUpdatedAt(str) {
  if (!str) return ''
  try {
    const d = new Date(str)
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return str
  }
}

/* ── Expande eventos recorrentes nos proximos 30 dias ───────── */
function expandEvents(events, todayStr) {
  const days = []
  for (let i = 0; i < 30; i++) {
    days.push(addDays(todayStr, i))
  }

  const byDay = {}
  days.forEach(d => { byDay[d] = [] })

  events.forEach(ev => {
    if (ev.recurrence === 'daily') {
      days.forEach(d => byDay[d].push({ ...ev, _date: d }))
    } else if (ev.recurrence === 'weekly' && ev.day != null) {
      days.forEach(d => {
        if (new Date(d + 'T12:00:00').getDay() === ev.day) byDay[d].push({ ...ev, _date: d })
      })
    } else if (ev.recurrence === 'biweekly' && ev.anchorDate) {
      const anchor = new Date(ev.anchorDate + 'T12:00:00')
      days.forEach(d => {
        const diff = Math.round((new Date(d + 'T12:00:00') - anchor) / 86400000)
        if (diff >= 0 && diff % 14 === 0) byDay[d].push({ ...ev, _date: d })
      })
    } else if (ev.recurrence === 'monthly' && ev.anchorDate) {
      const anchorDay = new Date(ev.anchorDate + 'T12:00:00').getDate()
      days.forEach(d => {
        if (new Date(d + 'T12:00:00').getDate() === anchorDay) byDay[d].push({ ...ev, _date: d })
      })
    } else if (ev.date) {
      if (byDay[ev.date] != null) byDay[ev.date].push({ ...ev, _date: ev.date })
    }
  })

  Object.keys(byDay).forEach(d => {
    byDay[d].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
  })

  return days.map(d => ({ date: d, items: byDay[d] })).filter(g => g.items.length > 0)
}

/* ── Confetti CSS simples ────────────────────────────────────── */
function Confetti() {
  const pieces = Array.from({ length: 12 }, (_, i) => i)
  const colors = ['#6eda2c', '#f59e0b', '#60a5fa', '#be29ec', '#ef4444']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {pieces.map(i => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-sm"
          style={{
            left: `${10 + i * 7}%`,
            top: '20%',
            backgroundColor: colors[i % colors.length],
          }}
          animate={{ y: [0, -16, 20], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 1.2, delay: i * 0.08, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
    </div>
  )
}

/* ── Renderizador de Markdown simples ───────────────────────── */
function MdText({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <p key={i} className="text-xs font-extrabold text-[#1a1d2e] mt-3 mb-1">{line.slice(3)}</p>
        }
        if (line.startsWith('# ')) {
          return <p key={i} className="text-sm font-extrabold text-[#1a1d2e] mt-2 mb-1">{line.slice(2)}</p>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-[#6eda2c] text-xs mt-0.5 flex-shrink-0">•</span>
              <p className="text-xs text-[#1a1d2e] leading-snug">{line.slice(2)}</p>
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i} className="text-xs text-[#1a1d2e] leading-snug">{line}</p>
      })}
    </div>
  )
}

/* ── Card de evento ──────────────────────────────────────────── */
function EventCard({ ev, delay = 0, onSelect, isSelected }) {
  const type    = EVENT_TYPES[ev.type] || EVENT_TYPES.evento
  const isCeleb = ev.type === 'celebracao'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      onClick={() => onSelect(ev)}
      className="relative rounded-xl border overflow-hidden cursor-pointer transition-all"
      style={{
        background: isSelected ? type.color + '0a' : '#ffffff',
        borderColor: isSelected ? type.color + '60' : type.color + '30',
        boxShadow: isSelected
          ? `0 2px 8px rgba(26,29,46,0.10), 0 0 0 2px ${type.color}40`
          : `0 1px 4px rgba(26,29,46,0.06), 0 0 0 1px ${type.color}18`,
      }}
    >
      {isCeleb && <Confetti />}

      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: type.color }} />

      <div className="flex items-start gap-3 px-4 py-3 pl-5 relative z-10">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
          style={{ background: type.color + '14' }}
        >
          {type.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-[#1a1d2e] leading-snug truncate">{ev.title}</p>
            {ev.time && (
              <span className="text-[10px] font-bold text-[#8890b5] flex-shrink-0 mt-0.5">{ev.time}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] font-semibold" style={{ color: type.color }}>
              {type.label}
              {ev.recurrence === 'daily'  && ' · diario'}
              {ev.recurrence === 'weekly' && ' · semanal'}
            </span>
            <span className="text-[10px] text-[#8890b5]">
              {ev.participants === 'all' ? 'todos' : Array.isArray(ev.participants) ? ev.participants.join(', ') : ev.participants}
            </span>
          </div>

          {ev.description && (
            <p className="text-[11px] text-[#8890b5] mt-1 leading-snug line-clamp-2">{ev.description}</p>
          )}
        </div>

        <div
          className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg mt-0.5"
          style={{ background: type.color + '14' }}
        >
          <span className="text-[9px] font-extrabold" style={{ color: type.color }}>
            +{type.ons} {type.ons === 1 ? 'on' : 'ons'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Painel lateral de notas ────────────────────────────────── */
function NotePanel({ ev, onClose }) {
  const type     = EVENT_TYPES[ev.type] || EVENT_TYPES.evento
  const noteId   = `${ev.id}_${ev._date}`
  const lsKey    = `note_${noteId}`

  const [content,    setContent]    = useState('')
  const [aiSummary,  setAiSummary]  = useState('')
  const [updatedAt,  setUpdatedAt]  = useState('')
  const [updatedBy,  setUpdatedBy]  = useState('')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [analyzing,  setAnalyzing]  = useState(false)
  const [recording,  setRecording]  = useState(false)
  const [noSpeech,   setNoSpeech]   = useState(false)

  const debounceRef  = useRef(null)
  const recognRef    = useRef(null)
  const interimRef   = useRef('')

  /* Carrega nota ao abrir */
  useEffect(() => {
    async function load() {
      if (supabaseReady) {
        try {
          const { data } = await supabase
            .from('agenda_notes')
            .select('*')
            .eq('id', noteId)
            .single()
          if (data) {
            setContent(data.content || '')
            setAiSummary(data.ai_summary || '')
            setUpdatedAt(data.updated_at || '')
            setUpdatedBy(data.updated_by || '')
            return
          }
        } catch {}
      }
      const ls = localStorage.getItem(lsKey)
      if (ls) {
        try {
          const parsed = JSON.parse(ls)
          setContent(parsed.content || '')
          setAiSummary(parsed.ai_summary || '')
          setUpdatedAt(parsed.updated_at || '')
        } catch {
          setContent(ls)
        }
      }
    }
    load()
  }, [noteId, lsKey])

  /* Auto-save com debounce */
  const doSave = useCallback(async (text, summary) => {
    setSaving(true)
    const now = new Date().toISOString()
    const userId = 'gs'
    const record = {
      id: noteId,
      event_id: ev.id,
      event_date: ev._date,
      content: text,
      ai_summary: summary || aiSummary,
      updated_at: now,
      updated_by: userId,
    }

    if (supabaseReady) {
      try {
        await supabase.from('agenda_notes').upsert(record)
        setUpdatedAt(now)
        setUpdatedBy(userId)
      } catch {}
    }
    localStorage.setItem(lsKey, JSON.stringify(record))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [noteId, ev.id, ev._date, aiSummary, lsKey])

  function handleContentChange(val) {
    setContent(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSave(val, aiSummary), 1500)
  }

  /* Gravação de áudio */
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null

  function startRecording() {
    if (!SpeechRecognition) { setNoSpeech(true); return }
    const r = new SpeechRecognition()
    r.continuous = true
    r.interimResults = true
    r.lang = 'pt-BR'
    interimRef.current = ''

    r.onresult = (e) => {
      let interim = ''
      let final   = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + ' '
        } else {
          interim += e.results[i][0].transcript
        }
      }
      if (final) {
        interimRef.current += final
        setContent(prev => {
          const base = prev.endsWith('\n') || prev === '' ? prev : prev + '\n'
          return base + interimRef.current
        })
        interimRef.current = ''
      }
    }

    r.onerror = () => { setRecording(false) }
    r.onend   = () => { setRecording(false) }
    r.start()
    recognRef.current = r
    setRecording(true)
  }

  function stopRecording() {
    if (recognRef.current) {
      recognRef.current.stop()
      recognRef.current = null
    }
    setRecording(false)
  }

  /* Análise com IA */
  async function analyzeWithAI() {
    if (!content.trim()) return
    setAnalyzing(true)
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLAUDE_API_KEY)
      || localStorage.getItem('claudeApiKey')
    if (!apiKey) {
      setAiSummary('Configure a chave da API em localStorage: claudeApiKey')
      setAnalyzing(false)
      return
    }
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: `Você é um especialista em reuniões da TráfegOn. Analise as notas da reunião e retorne:

## 📋 Pauta Organizada
[organize os tópicos abordados]

## ✅ To-dos
[liste todas as ações com responsável quando identificável]

## 💡 Insights
[observações importantes, pontos de atenção]

## ⚠️ Decisões Tomadas
[o que foi decidido na reunião]

Responda em português. Seja conciso e direto.`,
          messages: [{ role: 'user', content: content }],
        }),
      })
      const data = await res.json()
      const summary = data?.content?.[0]?.text || 'Não foi possível gerar o resumo.'
      setAiSummary(summary)
      doSave(content, summary)
    } catch (err) {
      setAiSummary('Erro ao conectar com a IA. Verifique sua chave de API.')
    }
    setAnalyzing(false)
  }

  /* Formatação do recurrence label */
  function recurrenceLabel() {
    if (ev.recurrence === 'daily')    return 'Diário'
    if (ev.recurrence === 'weekly')   return 'Semanal'
    if (ev.recurrence === 'biweekly') return 'Quinzenal'
    if (ev.recurrence === 'monthly')  return 'Mensal'
    return ''
  }

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const dateObj  = new Date(ev._date + 'T12:00:00')
  const dayLabel = dayNames[dateObj.getDay()]

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-[#e0e3f0] rounded-2xl flex flex-col overflow-hidden"
      style={{
        boxShadow: '0 4px 24px rgba(26,29,46,0.08)',
        maxHeight: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '24px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-[#e0e3f0] flex-shrink-0">
        <div className="flex items-start gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
            style={{ background: type.color + '14' }}
          >
            {type.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#1a1d2e] leading-snug">{ev.title}</p>
            <p className="text-[10px] text-[#8890b5] mt-0.5">
              {dayLabel} · {ev.time || 'sem hora'}{recurrenceLabel() ? ` · ${recurrenceLabel()}` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#8890b5] hover:text-[#1a1d2e] transition-colors flex-shrink-0 ml-2 mt-0.5"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {/* Label pauta */}
        <div>
          <p className="text-[10px] font-extrabold text-[#8890b5] uppercase tracking-wide mb-1.5">Pauta / Notas</p>
          <textarea
            className="w-full bg-[#f4f6fb] border border-[#e0e3f0] rounded-xl px-3 py-2.5 text-sm text-[#1a1d2e] placeholder:text-[#8890b5] focus:outline-none focus:border-[#6eda2c]/50 transition-colors resize-none leading-relaxed"
            rows={7}
            placeholder="Digite a pauta, anotações da reunião, decisões tomadas..."
            value={content}
            onChange={e => handleContentChange(e.target.value)}
          />

          {/* Status de save */}
          <div className="flex items-center gap-1.5 mt-1 h-4">
            {saving && (
              <span className="text-[10px] text-[#8890b5] flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                Salvando...
              </span>
            )}
            {saved && !saving && (
              <span className="text-[10px] text-[#6eda2c] font-semibold">Salvo</span>
            )}
            {updatedAt && !saving && !saved && (
              <span className="text-[10px] text-[#8890b5]">
                Editado {formatUpdatedAt(updatedAt)}{updatedBy ? ` · ${updatedBy}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          {/* Gravar áudio */}
          <button
            onClick={recording ? stopRecording : startRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border flex-1 justify-center"
            style={recording ? {
              background: '#ef444418',
              borderColor: '#ef444440',
              color: '#ef4444',
            } : {
              background: '#f4f6fb',
              borderColor: '#e0e3f0',
              color: '#8890b5',
            }}
          >
            {recording ? (
              <>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <MicOff size={12} />
                </motion.div>
                Parar
              </>
            ) : (
              <>
                <Mic size={12} />
                Gravar
              </>
            )}
          </button>

          {/* Analisar com IA */}
          <button
            onClick={analyzeWithAI}
            disabled={analyzing || !content.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#6eda2c18',
              borderColor: '#6eda2c40',
              color: '#5cb823',
            }}
          >
            {analyzing ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Sparkles size={12} />
                Analisar com IA
              </>
            )}
          </button>
        </div>

        {/* Aviso sem suporte a áudio */}
        {noSpeech && (
          <p className="text-[11px] text-[#f59e0b] bg-[#f59e0b10] border border-[#f59e0b30] rounded-xl px-3 py-2">
            Use Chrome para gravação de áudio.
          </p>
        )}

        {/* Resumo IA */}
        {aiSummary && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-px bg-[#e0e3f0]" />
              <span className="text-[10px] font-extrabold text-[#8890b5] uppercase tracking-wide flex-shrink-0">Resumo IA</span>
              <div className="flex-1 h-px bg-[#e0e3f0]" />
            </div>
            <div className="bg-[#f4f6fb] border border-[#e0e3f0] rounded-xl px-3 py-3">
              <MdText text={aiSummary} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Modal Novo Evento ───────────────────────────────────────── */
function NovoEventoModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', type: 'evento', date: '', time: '',
    description: '', recurrence: 'none', participants: 'all',
  })
  const [error, setError] = useState('')

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function handleSave() {
    if (!form.title.trim()) { setError('Titulo e obrigatorio.'); return }
    const id = 'user_' + Date.now()
    const ev = { ...form, id, title: form.title.trim() }
    if (ev.recurrence === 'none') { delete ev.recurrence }
    onSave(ev)
    onClose()
  }

  const inputCls = 'w-full bg-[#f4f6fb] border border-[#e0e3f0] rounded-xl px-3 py-2 text-sm text-[#1a1d2e] placeholder:text-[#8890b5] focus:outline-none focus:border-[#6eda2c]/50 transition-colors'
  const labelCls = 'block text-[11px] font-bold text-[#8890b5] mb-1 uppercase tracking-wide'

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-md bg-white rounded-2xl z-50 overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(26,29,46,0.18), 0 0 0 1px rgba(26,29,46,0.07)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3f0]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#6eda2c18' }}>
              <Plus size={14} style={{ color: '#6eda2c' }} />
            </div>
            <p className="text-sm font-extrabold text-[#1a1d2e]">Novo Evento</p>
          </div>
          <button onClick={onClose} className="text-[#8890b5] hover:text-[#1a1d2e] transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={labelCls}>Titulo *</label>
            <input
              className={inputCls}
              placeholder="Ex: Reuniao de alinhamento"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tipo</label>
              <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                {Object.entries(EVENT_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Recorrencia</label>
              <select className={inputCls} value={form.recurrence} onChange={e => set('recurrence', e.target.value)}>
                <option value="none">Sem recorrencia</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Data</label>
              <input type="date" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Hora</label>
              <input type="time" className={inputCls} value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          {form.recurrence === 'weekly' && (
            <div>
              <label className={labelCls}>Dia da semana</label>
              <select className={inputCls} value={form.day ?? 1} onChange={e => set('day', Number(e.target.value))}>
                {['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado'].map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelCls}>Descricao</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={2}
              placeholder="Contexto ou objetivo do evento..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Participantes</label>
            <input
              className={inputCls}
              placeholder="all, gs, tochiro..."
              value={form.participants}
              onChange={e => set('participants', e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#e0e3f0] flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#e0e3f0] text-[#8890b5] hover:bg-[#f4f6fb] transition-colors">
            Cancelar
          </button>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#15172a] transition-colors"
            style={{ background: '#6eda2c' }}>
            Salvar evento
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

/* ── Pagina principal ────────────────────────────────────────── */
export default function AgendaInterna() {
  const today = getToday()
  const [events,        setEvents]        = useState(INITIAL_EVENTS)
  const [filterType,    setFilterType]    = useState('all')
  const [showModal,     setShowModal]     = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events
    return events.filter(ev => ev.type === filterType)
  }, [events, filterType])

  const groups = useMemo(() => expandEvents(filteredEvents, today), [filteredEvents, today])

  const { weekCount, weekOns } = useMemo(() => {
    const weekEnd = addDays(today, 6)
    let count = 0
    let ons   = 0
    groups.forEach(g => {
      if (g.date >= today && g.date <= weekEnd) {
        g.items.forEach(ev => {
          count++
          ons += (EVENT_TYPES[ev.type]?.ons || 0)
        })
      }
    })
    return { weekCount: count, weekOns: ons }
  }, [groups, today])

  function handleSave(ev) {
    setEvents(prev => [...prev, ev])
  }

  function handleSelect(ev) {
    if (selectedEvent && selectedEvent.id === ev.id && selectedEvent._date === ev._date) {
      setSelectedEvent(null)
    } else {
      setSelectedEvent(ev)
    }
  }

  const filterOptions = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(EVENT_TYPES).map(([k, v]) => ({ key: k, label: v.label })),
  ]

  const panelOpen = selectedEvent !== null

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-4 md:p-6">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#1a1d2e] tracking-tight">Agenda Interna</h1>
            <p className="text-sm text-[#8890b5] mt-0.5">O calendario vivo da TrafegOn</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e0e3f0] bg-white">
              <Calendar size={13} style={{ color: '#6eda2c' }} />
              <span className="text-xs font-bold text-[#1a1d2e]">{weekCount} eventos</span>
              <span className="text-[10px] text-[#8890b5]">esta semana</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: '#6eda2c12', border: '1px solid #6eda2c30' }}>
              <span className="text-xs font-extrabold" style={{ color: '#6eda2c' }}>+{weekOns}</span>
              <span className="text-[10px] font-bold" style={{ color: '#6eda2c' }}>ons disponíveis</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-[#15172a]"
              style={{ background: '#6eda2c' }}
            >
              <Plus size={14} />
              Novo Evento
            </motion.button>
          </div>
        </div>

        {/* Filtros de tipo */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filterOptions.map(opt => {
            const type  = EVENT_TYPES[opt.key]
            const color = type?.color || '#8890b5'
            const isActive = filterType === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setFilterType(opt.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
                style={isActive ? {
                  background: (color) + '18',
                  borderColor: color + '50',
                  color,
                } : {
                  background: '#ffffff',
                  borderColor: '#e0e3f0',
                  color: '#8890b5',
                }}
              >
                {type && <span>{type.icon}</span>}
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Timeline + Painel ── */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm font-bold text-[#1a1d2e]">Nenhum evento nos proximos 30 dias</p>
          <p className="text-xs text-[#8890b5] mt-1">Adicione um evento clicando em "Novo Evento"</p>
        </div>
      ) : (
        <div className={`flex gap-6 ${panelOpen ? 'md:grid md:grid-cols-[1fr_360px]' : ''}`}>

          {/* Coluna esquerda: timeline */}
          <div className="flex gap-0 md:gap-6 flex-1 min-w-0">

            {/* Linha vertical — so desktop */}
            <div className="hidden md:flex flex-col items-center w-16 flex-shrink-0 pt-2">
              {groups.map((group, gi) => {
                const isToday = group.date === today
                const isPast  = group.date < today
                return (
                  <div key={group.date} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: gi * 0.04 }}
                      className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                      style={{
                        background:   isToday ? '#6eda2c' : isPast ? '#e0e3f0' : '#ffffff',
                        borderColor:  isToday ? '#6eda2c' : isPast ? '#c8cce0' : '#8890b5',
                      }}
                    />
                    {gi < groups.length - 1 && (
                      <div className="w-0.5 flex-shrink-0"
                        style={{
                          height: Math.max(group.items.length, 1) * 80 + 16,
                          background: isToday
                            ? 'linear-gradient(to bottom, #6eda2c60, #e0e3f0)'
                            : '#e0e3f0',
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-8 min-w-0">
              {groups.map((group, gi) => {
                const isToday = group.date === today
                const isPast  = group.date < today
                const { main, sub } = formatDateLabel(group.date)

                return (
                  <motion.div
                    key={group.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isPast ? 0.55 : 1, y: 0 }}
                    transition={{ delay: gi * 0.04 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-extrabold"
                          style={{ color: isToday ? '#6eda2c' : '#1a1d2e' }}
                        >
                          {main}
                        </span>
                        <span className="text-[11px] text-[#8890b5]">{sub}</span>
                      </div>
                      {isToday && (
                        <span
                          className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                          style={{ background: '#6eda2c18', color: '#6eda2c', border: '1px solid #6eda2c30' }}
                        >
                          HOJE
                        </span>
                      )}
                      <div className="flex-1 h-px" style={{ background: isToday ? '#6eda2c20' : '#e0e3f0' }} />
                      <span className="text-[10px] text-[#8890b5] font-semibold flex-shrink-0">
                        {group.items.length} evento{group.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((ev, i) => (
                        <EventCard
                          key={ev.id + '_' + group.date}
                          ev={ev}
                          delay={gi * 0.04 + i * 0.03}
                          onSelect={handleSelect}
                          isSelected={
                            selectedEvent?.id === ev.id &&
                            selectedEvent?._date === ev._date
                          }
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Painel lateral — desktop */}
          <AnimatePresence>
            {panelOpen && (
              <>
                {/* Mobile: fullscreen overlay */}
                <div className="fixed inset-0 z-40 md:hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setSelectedEvent(null)}
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl overflow-hidden"
                    style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
                  >
                    <NotePanel ev={selectedEvent} onClose={() => setSelectedEvent(null)} />
                  </motion.div>
                </div>

                {/* Desktop: coluna lateral */}
                <div className="hidden md:block w-[360px] flex-shrink-0">
                  <NotePanel ev={selectedEvent} onClose={() => setSelectedEvent(null)} />
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Modal novo evento ── */}
      <AnimatePresence>
        {showModal && (
          <NovoEventoModal onClose={() => setShowModal(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  )
}
