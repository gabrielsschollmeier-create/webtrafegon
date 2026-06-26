import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Flag, Clock, ChevronUp, FileText, Save, TrendingUp, MousePointerClick, Eye, DollarSign, Users, Zap, LogOut, CalendarDays, LayoutGrid, Sparkles, Trash2, ArrowUp, ArrowDown, Loader2, Check, FolderOpen, Pencil, X } from 'lucide-react'
import { taskTypes, statusConfig, milestoneTypes, erpClients as mockClients, tasks as mockTasks, collaborators as mockCollaborators } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import MetricsPanel from './MetricsPanel'
import TarefaModal from '../../components/TarefaModal'
import TaskTemplatesDrawer from '../../components/TaskTemplatesDrawer'
import IntimeResultados from './IntimeResultados'
import AssessoriaResultados from './AssessoriaResultados'
import CasaConstrutorResultados from './CasaConstrutorResultados'
import TrafegonResultados from './TrafegonResultados'
import TrafegonEstrategia from './TrafegonEstrategia'
import KamyEstrategia from './KamyEstrategia'
import CacarolaMidia from './CacarolaMidia'
import KamyResultados from './KamyResultados'
import UserAvatar from '../../components/UserAvatar'
import Logo from '../../components/Logo'
import DestravaDigital from '../DestravaDigital'
import TrafegonMarketing from './TrafegonMarketing'
import TrafegonComercial from './TrafegonComercial'

const CUSTOM_MTG_KEY = 'trafegon_custom_meetings_v1'
const MTG_DATA_KEY   = 'trafegon_meeting_data_v2'
function loadCustomMeetings() { try { return JSON.parse(localStorage.getItem(CUSTOM_MTG_KEY)) || [] } catch { return [] } }
function saveCustomMeetings(d) { localStorage.setItem(CUSTOM_MTG_KEY, JSON.stringify(d)) }
function loadMtgData() { try { return JSON.parse(localStorage.getItem(MTG_DATA_KEY)) || {} } catch { return {} } }
function saveMtgData(d) { localStorage.setItem(MTG_DATA_KEY, JSON.stringify(d)) }
function mkTopicId() { return 'tp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) }

// ── Pautas pré-carregadas (histórico) ─────────────────────────────────────────
// Reuniões com pauta já montada, semeadas no localStorage na 1ª abertura do
// workspace. Cada entrada é keyed por clientId. Idempotente: só semeia se o id
// da reunião ainda não existir em trafegon_meeting_data_v2.
const SEED_PAUTAS = {
  nosso_studio: {
    version: 2,
    meeting: {
      id: 'nosso_studio_jun2026', clientId: 'nosso_studio',
      title: 'Reunião — Fechamento Junho | Nosso Studio',
      date: '2026-06-23', time: '10:00', duration: 60,
      attendees: ['gs'], type: 'monthly_review', custom: false, seeded: true,
    },
    topics: [
      'Evolução de ciclos: +42,6% leads (101 → 144) com CPL caindo 4,5% (R$ 6,26 → R$ 5,98) — escala eficiente',
      'Fechamento junho: 81 leads · R$ 589,24 · CPL R$ 7,27 · conversão de LP 27,5%',
      '🟢 Vendas: 1 → 7 contratos (7×) entre os ciclos; CAC caiu de R$ 632 para R$ 123 por contrato',
      'Funil: lead→orçamento estável em 82% (qualificação ótima); o salto veio do fechamento orçamento→contrato (~1,2% → ~5,9%, ~5×)',
      'Criativos campeões: AD02 e AD26 (Aniversário · Sarah Guerra) + AD21 (Gestante) — reativar como base de julho',
      'Conciliação Gerenciador × CRM: −20 leads no acumulado (junho só −2); ~18 perdidos na 2ª quinzena de maio',
      'Definir origem da divergência: falha de integração ou falta de cadastro manual?',
      'Follow-up: manter a régua de atendimento — o funil já converte (82%), não afrouxar',
      'Campanha de locação desativada (conforme solicitado)',
    ],
    notes: `📊 Fechamento Junho — Nosso Studio

EVOLUÇÃO DE CICLOS (15→15)
• 15/abr–15/mai: 101 leads · R$ 632,36 · CPL R$ 6,26
• 15/mai–15/jun: 144 leads · R$ 861,52 · CPL R$ 5,98
• Leads +42,6% · Investimento +36,2% · CPL −4,5% → escala eficiente

JUNHO (MÊS)
• 81 leads · R$ 589,24 · CPL R$ 7,27
• 60.851 impressões · 294 cliques
• Conversão de LP (clique→lead): 27,5%

COMERCIAL / VENDAS
• Contratos fechados: 1 (abr–mai) → 7 (mai–jun) = 7×
• CAC: R$ 632 → R$ 123 por contrato
• Lead → orçamento: ~82% (estável nos dois ciclos)
• Lead → contrato: 0,99% → 4,86%
• A virada veio do fechamento (orçamento→contrato ~1,2% → ~5,9%, ~5×), não da qualificação

CRIATIVOS CAMPEÕES
• AD02 — Estático | Aniversário | Sarah Guerra
• AD26 — Estático P&B 9x16 | Aniversário | Sarah Guerra
• AD21 — Estático | Gestante | Feed
• Pausados no dia 20 → reativar como base de julho

CONCILIAÇÃO GERENCIADOR × CRM
• 15/mai–15/jun: 144 (ger.) × 124 (CRM) = −20 (13,9%)
• Junho: 81 × 79 = −2 (2,5%)
• ~18 dos 20 perdidos estão na 2ª quinzena de maio; tracking de junho já saudável

PONTO DE ATENÇÃO
• Manter a régua de follow-up — funil converte bem, não afrouxar
• Confirmar origem da divergência ger.×CRM (integração ou cadastro manual)`,
  },
}

const COLUMNS = ['todo', 'doing', 'review', 'done']

const fmtNum = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
const fmtBrl = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtPct = n => (n * 100).toFixed(2) + '%'


const priorityConfig = {
  high:   { label: 'Alta',   color: '#ef4444' },
  medium: { label: 'Média',  color: '#ea8a29' },
  low:    { label: 'Baixa',  color: '#8890b5' },
}

function TaskCard({ task, collabMap, onEdit }) {
  const type = taskTypes[task.type]
  const assignee = collabMap[task.assignee]
  const priority = priorityConfig[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate + 'T00:00:00') < new Date() && task.status !== 'done'
  const isDone = task.status === 'done'

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: isDone ? 0.6 : 1, y: 0 }} exit={{ opacity: 0 }}>
      <div
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('taskId', String(task.id))
          e.dataTransfer.effectAllowed = 'move'
        }}
        onClick={() => onEdit && onEdit(task)}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,29,46,0.13)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        className="bg-white rounded-xl p-3.5 select-none"
        style={{
          boxShadow: '0 1px 6px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)',
          cursor: 'grab',
          borderLeft: `3px solid ${type?.color || '#8890b5'}`,
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
      >
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
          style={{ color: type.color, backgroundColor: type.color + '15' }}
        >
          {type.icon} {type.label}
        </span>
        <div className="flex items-center gap-1">
          <Flag size={11} style={{ color: priority?.color || '#8890b5' }} />
          {isOverdue && <span className="text-[9px] font-bold text-danger">Atrasada</span>}
        </div>
      </div>

      <p className={`text-sm font-semibold mb-1 leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>
        {task.title}
      </p>
      {task.description && (
        <p className="text-[11px] text-muted leading-relaxed mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <UserAvatar user={assignee} size={20} />
          <span className="text-[10px] text-muted">{assignee?.name}</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue ? 'text-danger' : 'text-muted'}`}>
          <Clock size={10} />
          {task.dueDate
            ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
            : '—'}
        </div>
      </div>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ status, tasks, clientColor, collabMap, onStatusChange, onEdit, onNewTask }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const cfg = statusConfig[status]

  return (
    <div
      className="flex flex-col w-64 flex-shrink-0 rounded-2xl p-2 transition-all duration-150"
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); e.dataTransfer.dropEffect = 'move' }}
      onDragLeave={e => { if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false) }}
      onDrop={e => {
        e.preventDefault()
        setIsDragOver(false)
        const taskId = e.dataTransfer.getData('taskId')
        if (taskId && onStatusChange) onStatusChange(taskId, status)
      }}
      style={{
        background:  isDragOver ? cfg.color + '10' : 'transparent',
        outline:     isDragOver ? `2px dashed ${cfg.color}50` : 'none',
        outlineOffset: 2,
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        <span className="text-xs font-bold text-text-2 flex-1">{cfg.label}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: cfg.color, backgroundColor: cfg.color + '18' }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-16">
        {isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-xl border-2 border-dashed"
            style={{ borderColor: cfg.color + '50' }}>
            <p className="text-[11px] font-bold" style={{ color: cfg.color }}>Soltar aqui</p>
          </div>
        )}
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} collabMap={collabMap} onEdit={onEdit} />
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={onNewTask}
        className="mt-2 flex items-center gap-1.5 text-xs text-muted hover:text-accent hover:bg-accent/5 rounded-xl px-2 py-2 transition-all w-full border border-transparent hover:border-accent/20">
        <Plus size={12} /> Adicionar tarefa
      </button>
    </div>
  )
}

const TABS_BASE                    = ['Visão Geral', 'Linha do Tempo', 'Tráfego']
const TABS_CLIENT_INTIME           = ['Visão Geral', 'Linha do Tempo', '🏆 Resultados']
const TABS_CLIENT_ASSESSORIA       = ['Visão Geral', 'Linha do Tempo', '🏆 Resultados']
const TABS_ASSESSORIA              = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🏆 Resultados']
const TABS_INTIME                  = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🏆 Resultados']
const TABS_CLIENT_CASA_CONSTRUTOR  = ['Visão Geral', 'Linha do Tempo', '🏆 Resultados']
const TABS_CASA_CONSTRUTOR         = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🏆 Resultados']
const TABS_AGENCIA  = ['Visão Geral', 'Linha do Tempo', '📊 Marketing', '🤝 Comercial']
const TABS_KAMY     = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🏆 Resultados', '🧠 Estratégia']
const TABS_CACAROLA        = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🧠 Estratégia de Mídia']
const TABS_CLIENT_CACAROLA = ['🧠 Estratégia de Mídia']
const TABS_DESTRAVA        = ['Visão Geral', 'Linha do Tempo', 'Tráfego', '🔓 Destrava', '📚 Apresentação']
const TABS_CLIENT_DESTRAVA = ['🏆 Desafio', '📚 Apresentação']

const DESTRAVA_IDS  = ['dsorrir', 'luciana_vasco', 'plano_ideal', 'girassol_arq', 'maria_elisabeth', 'patricia_ramos']

const ESTRUTURACAO_ITEMS = [
  { id: 'e1', icon: '🤝', title: 'Reunião de briefing e alinhamento',     desc: 'Levantamento do negócio, público-alvo e objetivos de campanha' },
  { id: 'e2', icon: '🔍', title: 'Pesquisa e seleção de palavras-chave',  desc: 'Keywords com maior intenção de compra para o seu segmento' },
  { id: 'e3', icon: '📁', title: 'Estrutura de campanhas criada',         desc: 'Campanhas, grupos de anúncios e segmentações configurados' },
  { id: 'e4', icon: '✍️', title: 'Anúncios escritos e configurados',      desc: 'Títulos, descrições e extensões criados com base no briefing' },
  { id: 'e5', icon: '📊', title: 'Rastreamento e conversões ativas',      desc: 'Eventos de conversão instalados, testados e validados' },
  { id: 'e6', icon: '💬', title: 'Integração com destino ativa',          desc: 'Anúncio conectado ao seu canal de recebimento de leads' },
  { id: 'e7', icon: '🚀', title: 'Campanhas publicadas',                  desc: 'Google e Meta no ar — fase de aprendizado iniciada' },
]

// ── Produtos Hub (Agência) ────────────────────────────────────────────────────
const PRODUTOS = [
  { key: 'destrava',   icon: '🔓', label: 'Destrava Digital', desc: 'Estruturação e aceleração de conta',     color: '#f59e0b' },
  { key: 'assessoria', icon: '🔄', label: 'Assessoria',       desc: 'Gestão recorrente de tráfego e social', color: '#6eda2c' },
  { key: 'sites',      icon: '🌐', label: 'Sites',            desc: 'Criação de sites e landing pages',      color: '#60a5fa' },
]

function ProdutosHub() {
  const [produto, setProduto] = useState(null)

  if (produto === 'destrava') {
    return (
      <div>
        <button onClick={() => setProduto(null)}
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-text mb-4 mt-2 ml-4 lg:ml-8 transition-colors">
          ← Voltar para Produtos
        </button>
        <DestravaDigital autoFormat="estruturacao" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Hub</p>
      <h2 className="text-2xl font-extrabold text-text mb-1">Produtos</h2>
      <p className="text-sm text-muted mb-8">Selecione o produto para acessar seu conteúdo</p>
      <div className="flex flex-col gap-4">
        {PRODUTOS.map(p => (
          <motion.button
            key={p.key}
            onClick={() => p.key === 'destrava' ? setProduto('destrava') : null}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 p-5 rounded-2xl text-left transition-all group"
            style={{
              background: `${p.color}0a`,
              border: `1.5px solid ${p.color}25`,
              cursor: p.key === 'destrava' ? 'pointer' : 'default',
              opacity: p.key !== 'destrava' ? 0.6 : 1,
            }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl transition-all group-hover:scale-105"
              style={{ background: `${p.color}18`, border: `1.5px solid ${p.color}35` }}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-text mb-0.5">{p.label}</p>
              <p className="text-sm text-muted">{p.desc}</p>
            </div>
            {p.key === 'destrava' ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                style={{ background: `${p.color}20`, color: p.color }}>
                Acessar →
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted flex-shrink-0">Em breve</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Destrava Board ────────────────────────────────────────────────────────────

const DESTRAVA_MISSIONS_15 = [
  { id: 'm1', day: 3,  icon: '📱', title: 'Primeira resposta documentada', desc: 'Responder o primeiro lead em até 1h e enviar o print da conversa.' },
  { id: 'm2', day: 5,  icon: '📊', title: 'Leia seus números',             desc: 'Acessar o gerenciador e enviar print com impressões, cliques e leads.' },
  { id: 'm3', day: 8,  icon: '🎯', title: 'Separe o joio do trigo',        desc: 'Informar quais leads eram do perfil ideal e o que tinham em comum.' },
  { id: 'm4', day: 12, icon: '📋', title: 'Monte seu registro',            desc: 'Criar planilha ou lista: nome do lead, data, se virou consulta.' },
  { id: 'm5', day: 14, icon: '🏁', title: 'Balanço final',                 desc: 'Enviar total de leads, consultas e fechamentos antes da call.' },
]

const DESTRAVA_MISSIONS_30 = [
  { id: 'm1', day: 5,  icon: '📱', title: 'Missão 1 — Primeira Resposta',            desc: 'Responda os 5 primeiros leads em até 20min após a chegada. Cronometra o tempo real de cada um e registra.' },
  { id: 'm2', day: 10, icon: '📊', title: 'Missão 2 — Primeiros Números (2 canais)', desc: 'Acesse os dois gerenciadores (Google e Meta) e registre: investimento, impressões, cliques, leads e CPL de cada um. Qual canal está com melhor CPL?' },
  { id: 'm3', day: 12, icon: '🔍', title: 'Missão 3 — Defesa do Orçamento',         desc: 'Google: negativize tudo que apareceu e não faz sentido — sem limite. Meta: analise criativos e conjuntos por dia e identifique o que drena verba sem lead.' },
  { id: 'm4', day: 15, icon: '🎯', title: 'Missão 4 — Perfil por Canal',             desc: 'Classifique os leads de cada plataforma: quente, morno ou fora do perfil. Qual canal traz leads mais próximos do perfil ideal?' },
  { id: 'm5', day: 16, icon: '🎨', title: 'Missão 5 — Criativo e Teste',            desc: 'Identifique o criativo com melhor CTR e o com pior. Publique 1 variação com mudança no título ou na imagem — sem pausar os outros.' },
  { id: 'm6', day: 20, icon: '💬', title: 'Missão 6 — Processo de Atendimento',     desc: 'Documente como está atendendo os leads: o que diz na 1ª mensagem, tempo de resposta e quando manda a proposta.' },
  { id: 'm7', day: 25, icon: '📈', title: 'Missão 7 — Funil Real por Canal',        desc: 'Mapeie até onde os leads chegaram em cada canal: recebidos → conversas avançadas → consultas. Onde some mais?' },
  { id: 'm8', day: 30, icon: '🏁', title: 'Missão 8 — Balanço Completo',           desc: 'Escreva: CPL real de cada canal, perfil dos leads, maior dificuldade. Defina 3 prioridades para o mês 2.' },
]

const DESTRAVA_ADJUSTMENTS = [
  { code: 'A', color: '#6eda2c', situation: 'CPL acima da meta definida',           action: 'Reduz orçamento 20% + revisa títulos (ambos os canais)' },
  { code: 'B', color: '#60a5fa', situation: 'Muitos cliques, poucos leads',         action: 'Problema na landing page ou WhatsApp — o anúncio está funcionando' },
  { code: 'C', color: '#1877f2', situation: 'Leads chegam mas não fecham',          action: 'Não é tráfego — revisar atendimento e script de primeiro contato' },
  { code: 'D', color: '#ef4444', situation: 'Keyword com 2x CPL meta e zero leads', action: 'Pausa e avalia virar negativo — não por valor fixo' },
  { code: 'E', color: '#f59e0b', situation: 'Criativo com 2x CPL meta por 5–7 dias', action: 'Pausa e coloca próximo na fila — não por valor fixo' },
  { code: 'F', color: '#ea8a29', situation: 'Frequência Meta acima de 3–4',         action: 'Troca criativo ou expande público — sinal de saturação' },
  { code: 'G', color: '#be29ec', situation: 'Pmax sem resultado',                   action: 'Aguarda 14–21 dias — é o tempo de aprendizado do algoritmo' },
  { code: 'H', color: '#60a5fa', situation: 'Um canal com CPL muito menor',         action: 'Realoca 30% do orçamento do canal fraco para o forte' },
  { code: 'I', color: '#ef4444', situation: 'Lead não responde no WhatsApp',        action: 'Troca 1ª mensagem para pergunta curta e direta' },
  { code: 'J', color: '#6eda2c', situation: 'CPL ok, quer mais volume',             action: 'Aumenta orçamento máx 20% a cada 3–4 dias — nunca de uma vez' },
]

const DESTRAVA_KEY = id => `destrava_${id}_v1`
function loadDestravaState(id)  { try { return JSON.parse(localStorage.getItem(DESTRAVA_KEY(id))) || {} } catch { return {} } }
function saveDestravaState(id, d) { localStorage.setItem(DESTRAVA_KEY(id), JSON.stringify(d)) }

function DestravaBoard({ clientId, clientColor, isClient = false, planDays }) {
  const [state, setState] = useState(() => loadDestravaState(clientId))
  const plan = isClient ? (planDays || '30') : (state.plan || '30')
  const missions = plan === '15' ? DESTRAVA_MISSIONS_15 : DESTRAVA_MISSIONS_30
  const done = missions.filter(m => state.checks?.[m.id]).length
  const [activeTab, setActiveTab] = useState('missoes')
  const [now, setNow] = useState(Date.now())
  const GREEN = '#6eda2c'

  useEffect(() => {
    if (!isClient) return
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [isClient])

  const supportStart = state.supportStartedAt || null
  const msElapsed    = supportStart ? now - supportStart : null
  const daysElapsed  = msElapsed !== null ? msElapsed / (1000 * 60 * 60 * 24) : null
  const planInt      = parseInt(plan)
  const daysLeft     = daysElapsed !== null ? Math.max(0, planInt - daysElapsed) : null
  const daysLeftInt  = daysLeft !== null ? Math.ceil(daysLeft) : null
  const supportPct   = daysElapsed !== null ? Math.min(100, (daysElapsed / planInt) * 100) : 0
  const supportEnded = daysLeftInt === 0

  function setPlan(p) {
    const next = { ...state, plan: p, checks: {} }
    setState(next); saveDestravaState(clientId, next)
  }
  function toggleMission(id) {
    const wasFirstEver = done === 0 && !state.checks?.[id] && !state.supportStartedAt
    const checks = { ...state.checks, [id]: !state.checks?.[id] }
    const next = { ...state, checks, ...(wasFirstEver ? { supportStartedAt: Date.now() } : {}) }
    setState(next); saveDestravaState(clientId, next)
  }
  function logAdjustment(code) {
    const log = [...(state.adjustmentLog || []), { code, date: new Date().toLocaleDateString('pt-BR'), note: '' }]
    const next = { ...state, adjustmentLog: log }
    setState(next); saveDestravaState(clientId, next)
  }

  const accentColor = clientColor || GREEN

  // ─── Vista cliente — design gamificado ───────────────────────────────────
  if (isClient) {
    const pct = missions.length > 0 ? Math.round((done / missions.length) * 100) : 0
    const radius = 36, circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (pct / 100) * circumference
    const levelLabel = pct === 100 ? '🏆 Concluído' : pct >= 75 ? '🔥 Quase lá' : pct >= 50 ? '⚡ Avançando' : pct >= 25 ? '📈 Em andamento' : '🚀 Iniciando'
    return (
      <div className="p-4 lg:p-6 w-full">

        {/* ── Hero full-width ── */}
        <div className="rounded-2xl overflow-hidden mb-5"
          style={{ background: 'linear-gradient(135deg, #0c0e1a 0%, #141728 60%, #1a2040 100%)', border: '1px solid rgba(110,218,44,0.15)' }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 p-6">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                style={{ background: 'rgba(110,218,44,0.15)', color: '#6eda2c' }}>
                🏆 Destrava Digital · {plan} dias
              </span>
              <h2 className="text-white font-extrabold text-xl lg:text-2xl leading-tight mb-2">
                Seu processo de vendas<br className="hidden lg:block" /> na internet começa aqui.
              </h2>
              <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#8890b5' }}>
                Criar ritmo é o primeiro passo: leads chegando com consistência, números lidos com clareza e um processo de atendimento que converte. Com isso no lugar, as vendas pela internet se tornam consequência natural.
              </p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <span className="text-sm font-extrabold" style={{ color: accentColor }}>{levelLabel}</span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{done} de {missions.length} missões</span>
              </div>

              {/* ── Contador de suporte ── */}
              {supportStart ? (
                <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: supportEnded ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{supportEnded ? '🔒' : '⏳'}</span>
                        <div>
                          <p className="text-xs font-extrabold text-white">
                            {supportEnded ? 'Período de suporte encerrado' : `${daysLeftInt} ${daysLeftInt === 1 ? 'dia' : 'dias'} de suporte restantes`}
                          </p>
                          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {supportEnded
                              ? `Acompanhamento de ${plan} dias concluído`
                              : `Suporte encerra em ${new Date(supportStart + planInt * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold flex-shrink-0" style={{ color: supportEnded ? '#ef4444' : (daysLeftInt <= 5 ? '#f59e0b' : accentColor) }}>
                        {Math.round(supportPct)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: supportEnded ? '#ef4444' : (daysLeftInt <= 5 ? '#f59e0b' : accentColor) }}
                        animate={{ width: `${supportPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }} />
                    </div>
                  </div>
                </div>
              ) : done === 0 && (
                <div className="mt-4 rounded-xl px-4 py-2.5 inline-flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm">⏳</span>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    O contador de {plan} dias inicia quando você concluir a 1ª missão.
                  </p>
                </div>
              )}
            </div>
            {/* Right — progress ring */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="relative">
                <svg width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                  <motion.circle cx="48" cy="48" r={radius} fill="none" stroke={accentColor} strokeWidth="7"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    initial={{ strokeDashoffset: circumference }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 48 48)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white leading-none">{pct}%</span>
                  <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>concluído</span>
                </div>
              </div>
              {pct === 100 && (
                <span className="text-xs font-extrabold" style={{ color: accentColor }}>🎉 Desafio completo!</span>
              )}
            </div>
          </div>
        </div>

        {/* ── 2 colunas: Fase 1 | Fase 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5 items-start">

          {/* Fase 1 — Achievement */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(110,218,44,0.05)', border: '1px solid rgba(110,218,44,0.2)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(110,218,44,0.15)' }}>✅</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold" style={{ color: '#6eda2c' }}>Fase 1 — Estruturação</p>
                <p className="text-[10px] text-muted">Feito pela equipe Tráfeg.on</p>
              </div>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex-shrink-0"
                style={{ background: 'rgba(110,218,44,0.15)', color: '#6eda2c' }}>7/7</span>
            </div>
            <div className="space-y-1 mb-3">
              {ESTRUTURACAO_ITEMS.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'rgba(110,218,44,0.04)' }}>
                  <span className="text-sm opacity-40 flex-shrink-0">{item.icon}</span>
                  <p className="text-[11px] font-medium text-muted line-through flex-1">{item.title}</p>
                  <span className="text-[9px] font-extrabold flex-shrink-0" style={{ color: '#6eda2c' }}>✓</span>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(110,218,44,0.08)', border: '1px solid rgba(110,218,44,0.15)' }}>
              <p className="text-[10px] font-extrabold" style={{ color: '#6eda2c' }}>🚀 Google Ads + Meta Ads no ar</p>
              <p className="text-[10px] text-muted mt-0.5">Fase de aprendizado ativa. Agora é com você.</p>
            </div>
          </div>

          {/* Fase 2 — Missões */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: `${accentColor}20` }} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}20` }}>
                🔓 Fase 2 — Missões do desafio
              </span>
              <div className="h-px flex-1" style={{ background: `${accentColor}20` }} />
            </div>

            <div className="space-y-2.5">
              {missions.map((m, i) => {
                const checked = !!state.checks?.[m.id]
                return (
                  <motion.div key={m.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => toggleMission(m.id)}
                    className="rounded-2xl overflow-hidden cursor-pointer select-none transition-all"
                    style={{
                      background: checked ? 'rgba(110,218,44,0.06)' : 'white',
                      border: checked ? '1.5px solid rgba(110,218,44,0.25)' : '1.5px solid rgba(200,205,224,0.5)',
                      boxShadow: checked ? 'none' : '0 2px 10px rgba(26,29,46,0.06)',
                    }}>
                    <div className="flex items-stretch">
                      {/* Número lateral */}
                      <div className="w-11 flex flex-col items-center justify-center py-4 flex-shrink-0"
                        style={{
                          background: checked ? 'rgba(110,218,44,0.1)' : `${accentColor}06`,
                          borderRight: `1px solid ${checked ? 'rgba(110,218,44,0.15)' : 'rgba(200,205,224,0.3)'}`,
                        }}>
                        <span className="text-[8px] font-extrabold uppercase" style={{ color: checked ? '#6eda2c' : '#c8cde0' }}>M</span>
                        <span className="text-base font-extrabold leading-tight" style={{ color: checked ? '#6eda2c' : accentColor }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {/* Conteúdo */}
                      <div className="flex-1 p-3.5 min-w-0 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: checked ? 'rgba(110,218,44,0.15)' : accentColor + '10' }}>
                          {checked ? '✅' : m.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                              style={{ background: accentColor + '12', color: accentColor }}>Dia {m.day}</span>
                            {checked && (
                              <span className="text-[10px] font-extrabold" style={{ color: '#6eda2c' }}>✓ Concluída</span>
                            )}
                          </div>
                          <p className={`text-sm font-bold leading-snug ${checked ? 'text-muted line-through' : 'text-text'}`}>{m.title}</p>
                          {!checked && <p className="text-[11px] text-muted leading-relaxed mt-0.5">{m.desc}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ background: checked ? accentColor : 'transparent', border: `2px solid ${checked ? accentColor : '#c8cde0'}` }}>
                            {checked && <span className="text-white text-[9px] font-extrabold">✓</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {done > 0 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl p-3.5 flex items-center gap-3"
                style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                <span className="text-xl flex-shrink-0">⚡</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold" style={{ color: accentColor }}>{done} de {missions.length} missões concluídas</p>
                  <p className="text-[11px] text-muted">{missions.length - done} restantes para completar o desafio</p>
                </div>
                <span className="text-xs font-extrabold flex-shrink-0" style={{ color: accentColor }}>{done}/{missions.length}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── Vista agência ─────────────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-lg font-extrabold text-text">🔓 Destrava Digital</p>
          <p className="text-xs text-muted mt-0.5">Acompanhamento operacional — {plan === '15' ? '15 dias' : '30 dias'}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface rounded-xl p-1">
          {['15', '30'].map(p => (
            <button key={p} onClick={() => setPlan(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={plan === p ? { background: accentColor + '20', color: accentColor } : { color: '#8890b5' }}>
              {p} dias
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-extrabold text-text">Progresso das missões</p>
          <p className="text-xs font-extrabold" style={{ color: accentColor }}>{done}/{missions.length}</p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: accentColor + '18' }}>
          <motion.div className="h-full rounded-full" style={{ background: accentColor }}
            animate={{ width: `${missions.length > 0 ? (done / missions.length) * 100 : 0}%` }}
            transition={{ duration: 0.6 }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
        {[['missoes', '📋 Missões'], ['ajustes', '⚙️ Ajustes'], ['log', '📝 Log']].map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className="px-3 py-2 text-xs font-bold transition-all relative"
            style={activeTab === k ? { color: accentColor } : { color: '#8890b5' }}>
            {l}
            {activeTab === k && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: accentColor }} />}
          </button>
        ))}
      </div>

      {/* Missões */}
      {activeTab === 'missoes' && (
        <div className="space-y-2">
          {missions.map(m => {
            const checked = !!state.checks?.[m.id]
            return (
              <motion.div key={m.id} layout
                className="bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)', opacity: checked ? 0.65 : 1, borderLeft: `3px solid ${checked ? accentColor : 'transparent'}` }}
                onClick={() => toggleMission(m.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: accentColor + '12' }}>{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                      style={{ background: accentColor + '18', color: accentColor }}>Dia {m.day}</span>
                    {checked && <span className="text-[10px] font-bold text-green-600">✅ Concluída</span>}
                  </div>
                  <p className={`text-sm font-bold ${checked ? 'line-through text-muted' : 'text-text'}`}>{m.title}</p>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{m.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: checked ? accentColor : 'transparent', border: `2px solid ${checked ? accentColor : '#c8cde0'}` }}>
                  {checked && <span className="text-white text-[10px] font-extrabold">✓</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Ajustes */}
      {activeTab === 'ajustes' && (
        <div className="space-y-2">
          {DESTRAVA_ADJUSTMENTS.map(adj => (
            <div key={adj.code} className="bg-white rounded-xl p-3.5 flex items-start gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                style={{ background: adj.color + '18', color: adj.color }}>{adj.code}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text">{adj.situation}</p>
                <p className="text-[11px] text-muted mt-0.5">{adj.action}</p>
              </div>
              <button onClick={() => logAdjustment(adj.code)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all flex-shrink-0"
                style={{ background: adj.color + '12', color: adj.color, border: `1px solid ${adj.color}30` }}>
                + Aplicar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {activeTab === 'log' && (
        <div className="space-y-2">
          {(!state.adjustmentLog || state.adjustmentLog.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm font-bold text-text mb-1">Nenhum ajuste registrado</p>
              <p className="text-xs text-muted">Aplique ajustes na aba "Ajustes" para registrar aqui.</p>
            </div>
          ) : [...state.adjustmentLog].reverse().map((entry, i) => {
            const adj = DESTRAVA_ADJUSTMENTS.find(a => a.code === entry.code)
            return (
              <div key={i} className="bg-white rounded-xl p-3.5 flex items-center gap-3"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{ background: (adj?.color || '#8890b5') + '18', color: adj?.color || '#8890b5' }}>{entry.code}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text">{adj?.situation || entry.code}</p>
                  <p className="text-[10px] text-muted mt-0.5">{entry.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ClientTimeline({ clientId, clientColor, clientTasks: tasksProp = [] }) {
  const { milestones } = useData()
  const [filter,   setFilter]   = useState('all')
  const [expanded, setExpanded] = useState({})
  const today = new Date().toISOString().slice(0, 10)

  /* ── Eventos ─────────────────────────────────── */
  const msEvents = milestones
    .filter(m => m.clientId === clientId)
    .map(m => ({
      id: 'ms_' + m.id, date: m.date, title: m.title,
      description: m.description, type: m.type, kind: 'marco', level: 'marco',
    }))

  const tkEvents = tasksProp
    .filter(t => t.dueDate || t.createdAt)
    .map(t => ({
      id:    'tk_' + t.id,
      date:  t.dueDate || t.createdAt?.split('T')[0],
      title: t.title, description: t.description,
      type:  t.type,  status: t.status,
      level: t.level || 'operacao',
      kind:  'task',  priority: t.priority,
    }))

  const allEvents = [...msEvents, ...tkEvents]
    .sort((a, b) => b.date.localeCompare(a.date))

  const filtered = useMemo(() => {
    if (filter === 'marco')    return allEvents.filter(e => e.level === 'marco')
    if (filter === 'operacao') return allEvents.filter(e => e.level === 'operacao')
    if (filter === 'interno')  return allEvents.filter(e => e.level === 'interno')
    return allEvents
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, allEvents.length])

  /* ── Stats ────────────────────────────────────── */
  const doneTasks       = tasksProp.filter(t => t.status === 'done').length
  const totalXP         = tasksProp.filter(t => t.status === 'done')
    .reduce((s, t) => s + (taskTypes[t.type]?.ons ?? 1), 0)
  const completion      = tasksProp.length > 0 ? Math.round((doneTasks / tasksProp.length) * 100) : 0
  const doneMilestones  = msEvents.filter(m => m.date <= today)
  const futureMilestones = msEvents.filter(m => m.date > today)
  const nextMilestone   = [...futureMilestones].sort((a, b) => a.date.localeCompare(b.date))[0]
  const CIRC            = 2 * Math.PI * 42

  /* ── Agrupar por mês ─────────────────────────── */
  const grouped = useMemo(() => {
    const grp = {}
    filtered.forEach(ev => {
      const d   = new Date(ev.date + 'T00:00:00')
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const lbl = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      if (!grp[key]) grp[key] = { label: lbl, events: [] }
      grp[key].events.push(ev)
    })
    return Object.entries(grp).sort((a, b) => b[0].localeCompare(a[0]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, filter])

  function toggle(id) { setExpanded(p => ({ ...p, [id]: !p[id] })) }

  /* ── Achievement Card (marco) ─────────────────── */
  function AchievementCard({ ev }) {
    const cfg    = milestoneTypes[ev.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
    const open   = expanded[ev.id]
    const isPast = ev.date <= today
    const isMeta = ev.type === 'meta'

    return (
      <motion.div layout whileHover={{ scale: 1.005 }} onClick={() => toggle(ev.id)}
        className="cursor-pointer rounded-2xl p-4 flex gap-4 transition-all"
        style={{
          background:  isMeta && isPast ? 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)' : isPast ? 'white' : '#f8f9fc',
          border:      `1px solid ${isPast ? cfg.color + '30' : '#e8eaf2'}`,
          boxShadow:   isPast ? `0 4px 20px ${cfg.color}15, 0 0 0 1px ${cfg.color}10` : 'none',
          opacity:     isPast ? 1 : 0.52,
          filter:      isPast ? 'none' : 'grayscale(70%)',
        }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: isPast ? cfg.color + '20' : '#f0f1f7', boxShadow: isPast ? `0 2px 8px ${cfg.color}28` : 'none' }}>
          {isPast ? cfg.icon : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: isPast ? cfg.color + '20' : '#f0f1f7', color: isPast ? cfg.color : '#9399b8' }}>
              {cfg.label}
            </span>
            {isMeta && isPast && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.18)', color: '#f59e0b' }}>🏆 Meta Atingida</span>
            )}
            {isPast && !isMeta && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-50 text-green-600">✅ Concluído</span>
            )}
            {!isPast && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface text-muted">🔒 Próximo</span>
            )}
          </div>
          <p className="text-sm font-extrabold" style={{ color: isMeta && isPast ? 'white' : '#1a1d2e' }}>{ev.title}</p>
          <p className="text-[11px] mt-0.5" style={{ color: isMeta && isPast ? 'rgba(255,255,255,0.42)' : '#9399b8' }}>
            {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })}
          </p>
          <AnimatePresence>
            {open && ev.description && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs mt-2 p-3 rounded-xl overflow-hidden"
                style={{ background: isMeta && isPast ? 'rgba(255,255,255,0.07)' : cfg.color + '0c', color: isMeta && isPast ? 'rgba(255,255,255,0.7)' : '#4a5068' }}>
                {ev.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {ev.description && (
          <div className="flex-shrink-0 self-start mt-1" style={{ color: isPast ? cfg.color : '#c0c4d8' }}>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        )}
      </motion.div>
    )
  }

  /* ── Task Card (operação/interno) ─────────────── */
  function TaskCard({ ev }) {
    const open   = expanded[ev.id]
    const tp     = taskTypes[ev.type] || { label: ev.type, icon: '📌', color: '#8890b5', ons: 1 }
    const st     = statusConfig[ev.status] || { label: ev.status, color: '#8890b5' }
    const isDone = ev.status === 'done'
    const isInt  = ev.level === 'interno'

    return (
      <motion.div layout whileHover={{ scale: 1.003 }} onClick={() => toggle(ev.id)}
        className={`cursor-pointer rounded-xl border p-3 flex gap-3 bg-white transition-shadow hover:shadow-md ${isInt ? 'opacity-50' : ''}`}
        style={{ borderColor: tp.color + '28' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: tp.color + '14' }}>
          {tp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: tp.color + '18', color: tp.color }}>{tp.label}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: st.color + '18', color: st.color }}>{st.label}</span>
            {isInt  && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-border text-muted">🔒 Interno</span>}
            {isDone && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">⚡ +{tp.ons ?? 1} ons</span>}
          </div>
          <p className={`text-[12px] font-bold leading-tight ${isDone ? 'line-through text-muted' : 'text-text'}`}>
            {ev.title}
          </p>
          <p className="text-[10px] text-muted mt-0.5">
            {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
          </p>
          <AnimatePresence>
            {open && ev.description && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-text-2 mt-2 p-2 rounded-lg overflow-hidden"
                style={{ background: '#f7f8fc' }}>
                {ev.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {ev.description && (
          <div className="flex-shrink-0 self-start text-muted">{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">

      {/* ── HERO PROGRESS ─────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${clientColor}22 0%, transparent 60%)` }} />
        <div className="relative z-10 flex flex-wrap gap-6 items-center">
          {/* Anel de progresso animado */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="42" fill="none"
                stroke={clientColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={String(CIRC)}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: CIRC * (1 - completion / 100) }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none">{completion}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>tarefas</span>
            </div>
          </div>
          {/* Stats rápidos */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Progresso do Projeto
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Marcos</p>
                <p className="text-2xl font-black text-white">
                  {doneMilestones.length}<span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>/{msEvents.length}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Ons Gerados</p>
                <p className="text-2xl font-black" style={{ color: '#be29ec' }}>
                  {totalXP}<span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}> ons</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Entregas</p>
                <p className="text-2xl font-black text-white">{allEvents.length}</p>
              </div>
            </div>
            {nextMilestone && (
              <div className="mt-3 rounded-xl px-3 py-2 w-fit"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Próximo marco</p>
                <p className="text-[12px] font-extrabold" style={{ color: 'rgba(255,255,255,0.82)' }}>{nextMilestone.title}</p>
                <p className="text-[10px]" style={{ color: clientColor + 'bb' }}>
                  {new Date(nextMilestone.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── TRILHA DA JORNADA ─────────────────────── */}
      {msEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">🗺️ Jornada do Projeto</p>
            <span className="text-[10px] font-bold text-muted">{doneMilestones.length}/{msEvents.length} concluídos</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-0 min-w-max">
              {[...msEvents].sort((a, b) => a.date.localeCompare(b.date)).map((m, i, arr) => {
                const cfg    = milestoneTypes[m.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
                const isPast = m.date <= today
                const isNext = !isPast && (i === 0 || arr[i - 1]?.date <= today)
                const isLast = i === arr.length - 1
                return (
                  <div key={m.id} className="flex items-center">
                    <div className="flex flex-col items-center" style={{ width: 96 }}>
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: isPast ? 1 : isNext ? 0.92 : 0.78, opacity: isPast ? 1 : isNext ? 0.72 : 0.38 }}
                        transition={{ delay: i * 0.04 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{
                          background: isPast ? cfg.color + '20' : '#f0f1f7',
                          border:     isPast ? `2px solid ${cfg.color}` : isNext ? `2px dashed ${cfg.color}55` : '2px solid #e0e3f0',
                          boxShadow:  isPast ? `0 0 14px ${cfg.color}3a` : 'none',
                        }}>
                        {isPast ? cfg.icon : isNext ? cfg.icon : '🔒'}
                      </motion.div>
                      <p className="text-[9px] font-extrabold text-center mt-2 leading-tight px-1"
                        style={{ color: isPast ? cfg.color : '#c0c4d8', maxWidth: 90 }}>
                        {m.title.length > 18 ? m.title.slice(0, 17) + '…' : m.title}
                      </p>
                    </div>
                    {!isLast && (
                      <div className="h-0.5 flex-shrink-0" style={{
                        width: 20,
                        background: isPast && arr[i + 1]?.date <= today
                          ? clientColor
                          : isPast
                            ? `linear-gradient(90deg, ${clientColor}, #e0e3f0)`
                            : '#e0e3f0',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CONQUISTAS ────────────────────────────── */}
      {msEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">🏆 Conquistas</p>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#f59e0b18', color: '#f59e0b' }}>
              {doneMilestones.length}/{msEvents.length} desbloqueadas
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...msEvents].sort((a, b) => a.date.localeCompare(b.date)).map((m, i) => {
              const cfg    = milestoneTypes[m.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
              const isPast = m.date <= today
              const isMeta = m.type === 'meta'
              return (
                <motion.div key={m.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: isPast ? 1 : 0.3, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={isPast ? { scale: 1.04, y: -2 } : {}}
                  className="rounded-xl p-3 flex flex-col items-center text-center"
                  style={{
                    background: isMeta && isPast
                      ? 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)'
                      : isPast ? cfg.color + '0d' : '#f7f8fc',
                    border:  `1px solid ${isPast ? cfg.color + '30' : '#e2e5f0'}`,
                    filter:  isPast ? 'none' : 'grayscale(100%)',
                    boxShadow: isPast && isMeta ? '0 4px 20px rgba(10,10,30,0.2)' : 'none',
                  }}>
                  <div className="text-2xl mb-2">{isPast ? cfg.icon : '🔒'}</div>
                  <p className="text-[10px] font-extrabold leading-tight"
                    style={{ color: isMeta && isPast ? 'white' : isPast ? '#1a1d2e' : '#9399b8' }}>
                    {m.title}
                  </p>
                  {!isPast && <p className="text-[8px] font-bold mt-1.5" style={{ color: cfg.color }}>Em breve</p>}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── FILTROS ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-1.5 flex gap-1 flex-wrap w-fit"
        style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
        {[
          { key: 'all',      icon: '📋', label: 'Todos',    count: allEvents.length },
          { key: 'marco',    icon: '🏆', label: 'Marcos',   count: msEvents.length },
          { key: 'operacao', icon: '⚙️', label: 'Operação', count: tkEvents.filter(t => t.level !== 'interno').length },
          { key: 'interno',  icon: '🔒', label: 'Interno',  count: tkEvents.filter(t => t.level === 'interno').length },
        ].filter(f => f.key !== 'interno' || f.count > 0).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === f.key ? { background: clientColor + '20', color: clientColor } : { color: '#8890b5' }}>
            {f.icon} {f.label}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold"
              style={filter === f.key ? { background: clientColor + '30' } : { background: '#f1f3f9', color: '#8890b5' }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── FEED AGRUPADO POR MÊS ─────────────────── */}
      {grouped.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm font-bold text-text">Nenhuma atividade registrada</p>
          <p className="text-xs text-muted mt-1">Adicione tarefas e marcos para visualizar aqui</p>
        </div>
      ) : grouped.map(([key, { label, events }]) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: clientColor }} />
            <p className="text-[11px] font-extrabold text-muted uppercase tracking-wider capitalize">{label}</p>
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted font-semibold">
              {events.length} {events.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: clientColor + '35' }}>
            {events.map(ev => (
              ev.level === 'marco'
                ? <AchievementCard key={ev.id} ev={ev} />
                : <TaskCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NewMeetingModal({ clientId, onClose, onSave }) {
  const { collaborators } = useData()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    title: '', date: today, time: '10:00', duration: 60, attendees: [],
  })
  const [topics, setTopics]       = useState([])
  const [topicInput, setTopicInput] = useState('')

  function toggleAttendee(id) {
    setForm(f => ({
      ...f,
      attendees: f.attendees.includes(id) ? f.attendees.filter(a => a !== id) : [...f.attendees, id],
    }))
  }

  function addTopic() {
    const t = topicInput.trim()
    if (!t) return
    setTopics(prev => [...prev, t])
    setTopicInput('')
  }

  function removeTopic(i) { setTopics(prev => prev.filter((_, idx) => idx !== i)) }

  function handleSave() {
    if (!form.title.trim()) return
    const meeting = {
      id: 'custom_' + Date.now(),
      clientId,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration) || 60,
      attendees: form.attendees,
      custom: true,
    }
    onSave(meeting, topics)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-y-auto max-h-[90vh]"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <h2 className="text-base font-extrabold text-text">Nova Reunião</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors"><Plus size={15} className="rotate-45" /></button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Título</label>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Reunião mensal de performance"
              autoFocus
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
              style={{ background: '#f8f9fc' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Data</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors" style={{ background: '#f8f9fc' }} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Horário</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors" style={{ background: '#f8f9fc' }} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Dur. (min)</label>
              <input type="number" min={15} max={240} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors" style={{ background: '#f8f9fc' }} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Participantes</label>
            <div className="flex flex-wrap gap-2">
              {collaborators.map(c => (
                <button key={c.id} type="button" onClick={() => toggleAttendee(c.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all"
                  style={form.attendees.includes(c.id)
                    ? { background: c.color + '18', borderColor: c.color + '60', color: c.color }
                    : { background: '#f8f9fc', borderColor: '#e2e5f0', color: '#8890b5' }}>
                  <UserAvatar user={c} size={16} />{c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Tópicos da pauta (opcional)</label>
            {topics.length > 0 && (
              <ul className="space-y-1 mb-2">
                {topics.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text px-2 py-1 rounded-lg bg-surface">
                    <span className="text-[10px] font-bold text-muted w-4">{i + 1}.</span>
                    <span className="flex-1">{t}</span>
                    <button onClick={() => removeTopic(i)} className="text-muted hover:text-danger transition-colors"><Trash2 size={11} /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input value={topicInput} onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTopic() } }}
                placeholder="Adicionar tópico…"
                className="flex-1 border border-dashed border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-accent/40 transition-colors"
                style={{ background: '#f8f9fc' }} />
              {topicInput.trim() && (
                <button onClick={addTopic} className="px-3 rounded-xl text-xs font-bold text-white" style={{ background: '#6eda2c' }}>+</button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5" style={{ borderTop: '1px solid #edf0f7' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white disabled:opacity-50 transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            Criar Reunião
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function MeetingCard({ m, mtgData, onUpdateData, expanded, setExpanded, onDelete, collabMap }) {
  const attendees = (m.attendees || []).map(a => collabMap[a]).filter(Boolean)
  const isOpen = expanded === m.id
  const data = mtgData[m.id] || { topics: [], notes: '', aiResult: null }

  const [editingTopicId, setEditingTopicId] = useState(null)
  const [topicDraft, setTopicDraft]         = useState('')
  const [newTopicText, setNewTopicText]     = useState('')
  const [notesDraft, setNotesDraft]         = useState(data.notes || '')
  const [aiLoading, setAiLoading]           = useState(false)
  const [aiError, setAiError]               = useState(null)
  const notesRef = useRef(null)

  useEffect(() => {
    setNotesDraft(data.notes || '')
  }, [m.id])

  function update(patch) {
    const updated = { ...mtgData, [m.id]: { ...data, ...patch } }
    onUpdateData(updated)
  }

  function addTopic() {
    if (!newTopicText.trim()) return
    const topics = [...data.topics, { id: mkTopicId(), text: newTopicText.trim(), done: false }]
    update({ topics })
    setNewTopicText('')
  }

  function toggleTopic(id) {
    const topics = data.topics.map(t => t.id === id ? { ...t, done: !t.done } : t)
    update({ topics })
  }

  function deleteTopic(id) {
    const topics = data.topics.filter(t => t.id !== id)
    update({ topics })
  }

  function moveTopic(id, dir) {
    const topics = [...data.topics]
    const idx = topics.findIndex(t => t.id === id)
    const to = idx + dir
    if (to < 0 || to >= topics.length) return
    ;[topics[idx], topics[to]] = [topics[to], topics[idx]]
    update({ topics })
  }

  function startEditTopic(id, text) { setEditingTopicId(id); setTopicDraft(text) }

  function saveTopicEdit(id) {
    if (!topicDraft.trim()) return
    const topics = data.topics.map(t => t.id === id ? { ...t, text: topicDraft.trim() } : t)
    update({ topics })
    setEditingTopicId(null)
  }

  function saveNotes() {
    update({ notes: notesDraft })
  }

  async function organizeWithAI() {
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await fetch('/api/ai-pauta', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: m.title,
          topics: data.topics.map(t => t.text),
          notes: notesDraft,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Falha na API')
      }
      const aiResult = await res.json()
      update({ notes: notesDraft, aiResult })
    } catch (e) {
      setAiError(e.message || 'Erro ao conectar com a IA')
    } finally {
      setAiLoading(false)
    }
  }

  const completedCount = data.topics.filter(t => t.done).length
  const totalCount = data.topics.length
  const hasNotes = notesDraft.trim().length > 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: m.custom ? 'rgba(110,218,44,0.1)' : '#8890b518' }}>
          {m.custom ? '🗓️' : '📅'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{m.title}</p>
            {m.custom && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(110,218,44,0.1)', color: '#6eda2c' }}>Nova</span>}
            {totalCount > 0 && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: '#f0f1f8', color: '#8890b5' }}>
                {completedCount}/{totalCount} tópicos
              </span>
            )}
            {data.aiResult && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                ✨ IA
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · {m.time} · {m.duration}min
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-1.5">
            {attendees.map(a => (
              <UserAvatar key={a.id} user={a} size={24} style={{ border: '2px solid white' }} />
            ))}
          </div>
          {m.custom && onDelete && (
            <button onClick={() => onDelete(m.id)} className="text-danger/40 hover:text-danger transition-colors ml-1">
              <Plus size={13} className="rotate-45" />
            </button>
          )}
          <button onClick={() => setExpanded(isOpen ? null : m.id)} className="text-muted hover:text-text transition-colors ml-1">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-5" style={{ borderTop: '1px solid #edf0f7' }}>

              {/* ── PAUTA ── */}
              <div className="pt-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
                  <FileText size={11} /> Pauta
                </p>
                <div className="space-y-1.5">
                  {data.topics.map((t, idx) => (
                    <div key={t.id} className="flex items-center gap-2 group rounded-xl px-2 py-1.5 transition-colors hover:bg-surface">
                      <button onClick={() => toggleTopic(t.id)} className="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors"
                        style={t.done ? { background: '#6eda2c', borderColor: '#6eda2c' } : { borderColor: '#d1d5e0' }}>
                        {t.done && <Check size={11} color="white" strokeWidth={3} />}
                      </button>

                      {editingTopicId === t.id ? (
                        <input
                          autoFocus value={topicDraft}
                          onChange={e => setTopicDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveTopicEdit(t.id); if (e.key === 'Escape') setEditingTopicId(null) }}
                          onBlur={() => saveTopicEdit(t.id)}
                          className="flex-1 text-sm text-text bg-transparent border-b border-accent/40 outline-none pb-0.5"
                        />
                      ) : (
                        <span
                          onClick={() => startEditTopic(t.id, t.text)}
                          className="flex-1 text-sm cursor-text select-none"
                          style={t.done ? { color: '#8890b5', textDecoration: 'line-through' } : { color: '#1a1d2e' }}
                        >
                          <span className="text-[10px] font-bold text-muted mr-1.5">{idx + 1}.</span>{t.text}
                        </span>
                      )}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => moveTopic(t.id, -1)} disabled={idx === 0} className="p-0.5 rounded text-muted hover:text-text disabled:opacity-20 transition-colors">
                          <ArrowUp size={11} />
                        </button>
                        <button onClick={() => moveTopic(t.id, 1)} disabled={idx === data.topics.length - 1} className="p-0.5 rounded text-muted hover:text-text disabled:opacity-20 transition-colors">
                          <ArrowDown size={11} />
                        </button>
                        <button onClick={() => deleteTopic(t.id)} className="p-0.5 rounded text-muted hover:text-danger transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add topic */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={newTopicText}
                    onChange={e => setNewTopicText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addTopic() }}
                    placeholder="+ Adicionar tópico…"
                    className="flex-1 text-xs text-muted border border-dashed border-border rounded-lg px-3 py-2 outline-none focus:border-accent/40 focus:text-text transition-colors bg-transparent"
                  />
                  {newTopicText.trim() && (
                    <button onClick={addTopic} className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold text-white transition-all"
                      style={{ background: '#6eda2c' }}>
                      Adicionar
                    </button>
                  )}
                </div>
              </div>

              {/* ── ANOTAÇÕES ── */}
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5">
                  📝 Anotações da reunião
                </p>
                <textarea
                  ref={notesRef}
                  value={notesDraft}
                  onChange={e => setNotesDraft(e.target.value)}
                  onBlur={saveNotes}
                  rows={5}
                  placeholder="Escreva aqui durante a reunião — pontos discutidos, decisões, dúvidas, nomes citados, próximos passos… Sem formatação, tudo à vontade."
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text resize-none outline-none focus:border-accent/60 transition-colors leading-relaxed"
                  style={{ background: '#f8f9fc' }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-muted">Salvo automaticamente ao sair do campo.</p>
                  <button
                    onClick={organizeWithAI}
                    disabled={aiLoading || !hasNotes}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {aiLoading ? 'Organizando…' : 'Organizar com IA'}
                  </button>
                </div>
                {aiError && (
                  <p className="text-xs text-danger mt-2 bg-red-50 rounded-lg px-3 py-2">{aiError}</p>
                )}
              </div>

              {/* ── RESULTADO IA ── */}
              {data.aiResult && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#8b5cf6' }}>
                      <Sparkles size={11} /> Organizado pela IA
                    </p>
                    <button onClick={() => update({ aiResult: null })} className="text-[10px] text-muted hover:text-danger transition-colors">Limpar</button>
                  </div>

                  {data.aiResult.resumo && (
                    <div>
                      <p className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1">Resumo</p>
                      <p className="text-sm text-text leading-relaxed">{data.aiResult.resumo}</p>
                    </div>
                  )}

                  {data.aiResult.decisoes?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1.5">Decisões</p>
                      <ul className="space-y-1">
                        {data.aiResult.decisoes.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text">
                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold" style={{ background: '#6eda2c22', color: '#6eda2c' }}>{i + 1}</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.aiResult.proximos_passos?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1.5">Próximos Passos</p>
                      <ul className="space-y-1">
                        {data.aiResult.proximos_passos.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text">
                            <span className="text-accent mt-0.5 flex-shrink-0">→</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.aiResult.pontos_atencao?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1.5">Pontos de Atenção</p>
                      <ul className="space-y-1">
                        {data.aiResult.pontos_atencao.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text">
                            <span className="flex-shrink-0" style={{ color: '#f59e0b' }}>⚠</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MeetingsPanel({ clientMeetings, clientId, collabMap }) {
  const [mtgData,    setMtgData]    = useState(loadMtgData)
  const [customMtgs, setCustomMtgs] = useState(() => loadCustomMeetings().filter(m => m.clientId === clientId))
  const [expanded,   setExpanded]   = useState(null)
  const [showModal,  setShowModal]  = useState(false)

  const seedEntry = SEED_PAUTAS[clientId]

  // Semeia a pauta no histórico (localStorage) na 1ª abertura — idempotente.
  useEffect(() => {
    if (!seedEntry) return
    const existing = loadMtgData()
    if (existing[seedEntry.meeting.id]) return
    const topics  = seedEntry.topics.map(text => ({ id: mkTopicId(), text, done: false }))
    const updated = { ...existing, [seedEntry.meeting.id]: { topics, notes: seedEntry.notes || '', aiResult: null } }
    setMtgData(updated)
    saveMtgData(updated)
  }, [clientId])

  const seedMeetings = seedEntry && ![...clientMeetings, ...customMtgs].some(m => m.id === seedEntry.meeting.id)
    ? [seedEntry.meeting]
    : []

  const allMeetings = [...clientMeetings, ...customMtgs, ...seedMeetings]
    .sort((a, b) => a.date.localeCompare(b.date))

  function handleUpdateData(updated) {
    setMtgData(updated)
    saveMtgData(updated)
  }

  function handleNewMeeting(meeting, initialTopics) {
    const allCustom = [...loadCustomMeetings(), meeting]
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => [...prev, meeting])
    if (initialTopics?.length > 0) {
      const topics = initialTopics.map(text => ({ id: mkTopicId(), text, done: false }))
      const updated = { ...loadMtgData(), [meeting.id]: { topics, notes: '', aiResult: null } }
      setMtgData(updated)
      saveMtgData(updated)
    }
    setShowModal(false)
    setExpanded(meeting.id)
  }

  function handleDelete(id) {
    const allCustom = loadCustomMeetings().filter(m => m.id !== id)
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-extrabold text-text">{allMeetings.length} reuniões</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 12px rgba(110,218,44,0.3)' }}
        >
          <Plus size={13} /> Nova Reunião
        </button>
      </div>

      <div className="space-y-3">
        {allMeetings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <span className="text-4xl block mb-3">📅</span>
            <p className="text-sm font-bold text-text mb-1">Nenhuma reunião agendada</p>
            <p className="text-xs text-muted mb-4">Clique em "Nova Reunião" para agendar.</p>
          </div>
        )}
        {allMeetings.map(m => (
          <MeetingCard
            key={m.id} m={m}
            mtgData={mtgData} onUpdateData={handleUpdateData}
            expanded={expanded} setExpanded={setExpanded}
            onDelete={m.custom ? handleDelete : null}
            collabMap={collabMap}
          />
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <NewMeetingModal
            clientId={clientId}
            onClose={() => setShowModal(false)}
            onSave={handleNewMeeting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const WS_MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WS_DOW_NAMES   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function WorkspaceCalendarView({ tasks, onEdit, clientColor }) {
  const [current,     setCurrent]     = useState(() => new Date())
  const [expandedDay, setExpandedDay] = useState(null)
  const year  = current.getFullYear()
  const month = current.getMonth()

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayDate = new Date()
  const isToday   = (d) => d && todayDate.getFullYear() === year && todayDate.getMonth() === month && todayDate.getDate() === d
  const isWeekend = (ci) => ci % 7 === 0 || ci % 7 === 6

  function tasksForDay(d) {
    if (!d) return []
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return tasks.filter(t => t.dueDate === ds)
  }

  const accentColor = clientColor || '#6eda2c'
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const totalTasks  = tasks.filter(t => t.dueDate?.startsWith(monthPrefix)).length
  const STATUS_DOT  = { todo: '#60a5fa', doing: '#f59e0b', review: '#be29ec', aprovado: '#ea8a29', done: '#6eda2c' }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {/* Header navegação */}
      <div className="flex items-center justify-between mb-5 px-1">
        <button
          onClick={() => { setCurrent(new Date(year, month - 1)); setExpandedDay(null) }}
          className="w-9 h-9 rounded-xl border border-border text-muted hover:text-text flex items-center justify-center transition-all"
          style={{ '--hover-border': accentColor + '40' }}>
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-base font-extrabold text-text">{WS_MONTH_NAMES[month]} {year}</p>
          <p className="text-[11px] text-muted mt-0.5">{totalTasks} {totalTasks === 1 ? 'tarefa' : 'tarefas'} este mês</p>
        </div>
        <button
          onClick={() => { setCurrent(new Date(year, month + 1)); setExpandedDay(null) }}
          className="w-9 h-9 rounded-xl border border-border text-muted hover:text-text flex items-center justify-center transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {WS_DOW_NAMES.map((d, i) => (
          <p key={d} className="text-center text-[11px] font-extrabold uppercase tracking-wider py-2"
            style={{ color: i === 0 || i === 6 ? '#c0c5dc' : '#8890b5' }}>{d}</p>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          const dayTasks   = tasksForDay(day)
          const today_     = isToday(day)
          const weekend    = isWeekend(i)
          const isExpanded = expandedDay === day && day !== null
          const visibleMax = isExpanded ? dayTasks.length : 3

          return (
            <div
              key={i}
              className="rounded-2xl transition-all"
              style={{
                minHeight: isExpanded ? 'auto' : 120,
                backgroundColor: day
                  ? today_  ? accentColor + '08'
                  : weekend ? '#f5f6fc'
                  : 'white'
                  : 'transparent',
                boxShadow: day && !today_ ? '0 1px 4px rgba(26,29,46,0.05), 0 0 0 1px rgba(26,29,46,0.04)' : 'none',
                outline: today_ ? `2.5px solid ${accentColor}` : 'none',
                outlineOffset: -1,
                padding: day ? '10px 8px 8px' : 0,
              }}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    {today_ ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold"
                        style={{ background: accentColor }}>
                        {day}
                      </div>
                    ) : (
                      <p className="text-[12px] font-extrabold leading-none"
                        style={{ color: weekend ? '#c0c5dc' : '#4b5068' }}>{day}</p>
                    )}
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none"
                        style={{ background: accentColor + '20', color: accentColor }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {dayTasks.slice(0, visibleMax).map(task => {
                      const tt  = taskTypes[task.type]
                      const sc  = STATUS_DOT[task.status] || '#8890b5'
                      return (
                        <button
                          key={task.id}
                          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task) }}
                          title={task.title}
                          className="text-left text-[9px] font-bold rounded-lg w-full transition-all hover:opacity-90"
                          style={{
                            backgroundColor: (tt?.color || sc) + '18',
                            border: `1px solid ${tt?.color || sc}25`,
                            padding: '3px 6px',
                          }}
                        >
                          <div className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: sc }} />
                            <span className="leading-snug line-clamp-2" style={{ color: tt?.color || '#4b5068' }}>
                              {task.title}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                    {dayTasks.length > 3 && (
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day)}
                        className="text-[9px] font-bold text-center py-1 rounded-lg transition-all w-full"
                        style={{ color: accentColor, background: accentColor + '12' }}>
                        {isExpanded ? '▲ Menos' : `+${dayTasks.length - 3} mais`}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function WorkspaceDetail({ clientUser, onLogout }) {
  const { erpClients: dbClients, tasks: dbTasks, collaborators: dbCollaborators, meetings, milestones, addTask, addMilestone, updateTask, updateErpClient, loading } = useData()
  const erpClients    = dbClients.length       ? dbClients      : mockClients
  const allTasks      = dbTasks.length         ? dbTasks        : mockTasks
  const collaborators = dbCollaborators.length ? dbCollaborators : mockCollaborators
  const collabMap     = useMemo(() => Object.fromEntries(collaborators.map(c => [c.id, c])), [collaborators])
  const { id: paramId } = useParams()
  const isClientMode  = !!clientUser
  const id            = isClientMode ? clientUser.clientId : paramId
  const navigate      = useNavigate()
  const [tab, setTab] = useState('Visão Geral')
  const [typeFilter, setTypeFilter] = useState('all')
  const [taskView,   setTaskView]   = useState('kanban')
  const [showTarefaModal, setShowTarefaModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [clientTasks, setClientTasks] = useState([])
  const [editingDrive, setEditingDrive] = useState(false)
  const [driveInput, setDriveInput] = useState('')

  const client    = erpClients.find(c => c.id === id)
  const isAgencia        = !isClientMode && (client?.type === 'agencia' || client?.niche === 'Agência' || id === 'agencia')
  const isKamy           = !isClientMode && id === 'kamy'
  const isCacarola       = !isClientMode && id === 'cacarola'
  const isCacarolaClient = isClientMode  && id === 'cacarola'
  const PLANO_IDEAL_LIKE = new Set(['plano_ideal', 'girassol_arq', 'maria_elisabeth'])
  const isDestrava = !isClientMode && DESTRAVA_IDS.includes(id)
  const isDestravaClient = isClientMode && DESTRAVA_IDS.includes(id)
  const isAssessoriaClient   = isClientMode  && !isDestravaClient && id !== 'intime' && id !== 'casa_construtor'
  const isAssessoriaInternal = !isClientMode && !isAgencia && !isKamy && !isDestrava && id !== 'intime' && id !== 'casa_construtor'
  const TABS_RAW   = isDestravaClient                           ? TABS_CLIENT_DESTRAVA
    : (isClientMode && id === 'intime')                         ? TABS_CLIENT_INTIME
    : (isClientMode && id === 'casa_construtor')                ? TABS_CLIENT_CASA_CONSTRUTOR
    : isCacarolaClient                                          ? TABS_CLIENT_CACAROLA
    : isAssessoriaClient                                        ? TABS_CLIENT_ASSESSORIA
    : isClientMode                                              ? TABS_BASE
    : id === 'intime'                                           ? TABS_INTIME
    : id === 'casa_construtor'                                  ? TABS_CASA_CONSTRUTOR
    : isAgencia        ? TABS_AGENCIA
    : isKamy           ? TABS_KAMY
    : isCacarola       ? TABS_CACAROLA
    : isDestrava       ? TABS_DESTRAVA
    : isAssessoriaInternal ? TABS_ASSESSORIA
    : TABS_BASE
  // Aba Reuniões exclusiva dos clientes com pauta semeada (visão interna) — não afeta os demais.
  const TABS = (!isClientMode && SEED_PAUTAS[id]) ? [...TABS_RAW, '🗓️ Reuniões'] : TABS_RAW

  useEffect(() => {
    const tasks = allTasks.filter(t => t.clientId === id)
    setClientTasks(isClientMode ? tasks.filter(t => t.level !== 'interno') : tasks)
  }, [allTasks, id, isClientMode])

  useEffect(() => {
    if (!TABS.includes(tab)) setTab(TABS[0])
  }, [id, isClientMode])

  const clientMeetings = useMemo(() => meetings.filter(m => m.clientId === id), [meetings, id])
  const manager        = collabMap[client?.manager]
  const { done, pct }  = useMemo(() => {
    const d = clientTasks.filter(t => t.status === 'done').length
    return { done: d, pct: clientTasks.length > 0 ? Math.round((d / clientTasks.length) * 100) : 0 }
  }, [clientTasks])
  const filteredTasks  = useMemo(
    () => typeFilter === 'all' ? clientTasks : clientTasks.filter(t => t.type === typeFilter),
    [clientTasks, typeFilter]
  )

  if (loading && !client) return (
    <div className="p-4 lg:p-8 animate-pulse space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-surface rounded-xl" />
        <div className="h-7 w-56 bg-surface rounded-xl" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-9 w-20 bg-surface rounded-xl" />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-surface rounded-2xl" />)}
      </div>
      <div className="h-72 bg-surface rounded-2xl" />
    </div>
  )

  if (!client) return (
    <div className="p-8 text-muted">Cliente não encontrado.</div>
  )

  async function handleSaveTarefa(taskData) {
    if (taskData.id) {
      await updateTask(taskData.id, {
        title:       taskData.title,
        type:        taskData.type,
        assignee:    taskData.assignee,
        dueDate:     taskData.dueDate,
        priority:    taskData.priority,
        description: taskData.description,
      })
    } else {
      await addTask({ ...taskData })
      if (taskData.level === 'marco' && taskData.dueDate) {
        await addMilestone({
          clientId:    id,
          date:        taskData.dueDate,
          title:       taskData.title,
          type:        'entrega',
          description: taskData.description || '',
        })
      }
    }
    setShowTarefaModal(false)
    setEditingTask(null)
  }

  async function handleStatusChange(taskId, newStatus) {
    await updateTask(taskId, { status: newStatus })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 lg:px-8 py-4 lg:py-5 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: '0 1px 0 #e0e3f0' }}>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {isClientMode ? (
            <div className="flex items-center flex-shrink-0">
              <Logo size="sm" />
            </div>
          ) : (
            <button
              onClick={() => navigate('/clientes')}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-text-2 font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Clientes
            </button>
          )}
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}99)` }}
            >
              {client.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-text">{client.name}</h1>
              <p className="text-[11px] text-muted">{client.niche} · desde {new Date(client.since + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-extrabold" style={{ color: client.color }}>{pct}%</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Concluído</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-text">{clientTasks.length}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Tarefas</p>
            </div>
            {!isClientMode && (
              <div className="text-center">
                <p className="text-lg font-extrabold text-text">R$ {(client.monthlyValue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Mensalidade</p>
              </div>
            )}
            {!isClientMode && (
              <div className="flex items-center gap-2 bg-surface-2 rounded-xl px-3 py-2">
                <UserAvatar user={manager} size={20} />
                <span className="text-xs font-semibold text-text-2">{manager?.name}</span>
              </div>
            )}
            {/* Botão Drive */}
            {!editingDrive && client?.driveUrl && (
              <a href={client.driveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                style={{ color: client.color, borderColor: client.color + '50', background: client.color + '12' }}>
                <FolderOpen size={13} /> Drive
              </a>
            )}
            {!isClientMode && editingDrive && (
              <div className="flex items-center gap-1.5">
                <input autoFocus value={driveInput} onChange={e => setDriveInput(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="text-xs border border-border rounded-xl px-3 py-2 bg-surface-2 text-text focus:outline-none focus:border-accent/50 w-64 transition-colors" />
                <button onClick={() => { updateErpClient(id, { driveUrl: driveInput.trim() }); setEditingDrive(false) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-accent bg-accent/10 hover:bg-accent/20 transition-colors">
                  <Check size={13} />
                </button>
                <button onClick={() => setEditingDrive(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-surface-2 transition-colors">
                  <X size={13} />
                </button>
              </div>
            )}
            {!isClientMode && !editingDrive && (
              <button onClick={() => { setDriveInput(client?.driveUrl || ''); setEditingDrive(true) }}
                title={client?.driveUrl ? 'Editar link do Drive' : 'Vincular pasta do Drive'}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-surface-2 transition-colors">
                <Pencil size={12} />
              </button>
            )}
            {isClientMode && (
              <button onClick={onLogout}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors font-medium">
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2 hover:bg-surface-2'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {/* ── Visão Geral — dashboard combinado (tarefas + reuniões + progresso) ── */}
          {tab === 'Visão Geral' && (() => {
            const today      = new Date().toISOString().split('T')[0]
            const tasksDoing = clientTasks.filter(t => t.status === 'doing')
            const tasksTodo  = clientTasks.filter(t => t.status === 'todo')
            const tasksDone  = clientTasks.filter(t => t.status === 'done')
            const overdue    = clientTasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length
            const futureMtgs = [...clientMeetings].sort((a, b) => a.date.localeCompare(b.date)).filter(m => m.date >= today)

            const cardShadow = '0 2px 16px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.05)'

            const renderRow = (task) => {
              const cfg       = taskTypes[task.type]
              const assignee  = collabMap[task.assignee]
              const isOvrd    = task.dueDate && task.dueDate < today && task.status !== 'done'
              return (
                <div key={task.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8f9fe] transition-colors cursor-default"
                  style={{ borderLeft: `3px solid ${cfg?.color || '#8890b5'}` }}>
                  <span className="text-sm flex-shrink-0">{cfg?.icon || '•'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold leading-tight truncate ${task.status === 'done' ? 'line-through text-muted' : 'text-text'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: isOvrd ? '#ef4444' : '#b0b8d4' }}>
                        {isOvrd ? '⚠ ' : ''}{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                  <UserAvatar user={assignee} size={22} />
                </div>
              )
            }

            /* ── PORTAL CLIENTE: novo design visual ── */
            if (isAssessoriaClient) {
              const clientMs    = [...milestones.filter(m => m.clientId === id)].sort((a, b) => a.date.localeCompare(b.date))
              const doneMs      = clientMs.filter(m => m.date <= today)
              const nextMs      = clientMs.find(m => m.date > today)
              const CIRC        = 2 * Math.PI * 38
              const todoSorted  = [...tasksTodo].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))

              return (
                <motion.div key="client-hub" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 lg:p-6 space-y-5">

                  {/* ── HERO ── */}
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 60%, #0d1225 100%)', boxShadow: '0 20px 60px rgba(10,10,30,0.4)' }}>
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 85% 0%, ${client.color}28 0%, transparent 55%)` }} />
                    <div className="relative z-10 flex flex-wrap gap-5 items-center">
                      {/* Anel de progresso */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                          <motion.circle cx="50" cy="50" r="38" fill="none"
                            stroke={client.color} strokeWidth="10" strokeLinecap="round"
                            strokeDasharray={String(CIRC)}
                            initial={{ strokeDashoffset: CIRC }}
                            animate={{ strokeDashoffset: CIRC * (1 - pct / 100) }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-white leading-none">{pct}%</span>
                          <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>feito</span>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: client.color + 'cc' }}>Projeto em andamento</p>
                        <h1 className="text-xl font-black text-white mb-0.5 leading-tight">{client.name}</h1>
                        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>
                          desde {new Date(client.since + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap gap-5">
                          {[
                            { label: 'entregas',    value: `${done}/${clientTasks.length}`, color: client.color },
                            { label: 'em execução', value: tasksDoing.length + tasksTodo.length, color: '#60a5fa' },
                            { label: 'marcos',      value: `${doneMs.length}/${clientMs.length}`, color: '#be29ec' },
                          ].map(s => (
                            <div key={s.label}>
                              <p className="text-lg font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Próximo marco */}
                      {nextMs && (() => {
                        const cfg = milestoneTypes[nextMs.type] || { icon: '🏁', color: '#f59e0b' }
                        return (
                          <div className="flex-shrink-0 rounded-2xl px-4 py-3"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Próximo marco</p>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{cfg.icon}</span>
                              <div>
                                <p className="text-xs font-extrabold text-white leading-snug" style={{ maxWidth: 160 }}>
                                  {nextMs.title.replace(/^[\p{Emoji}\s]+/u, '')}
                                </p>
                                <p className="text-[10px] mt-0.5" style={{ color: client.color + 'cc' }}>
                                  📅 {new Date(nextMs.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </motion.div>

                  {/* ── JORNADA HORIZONTAL ── */}
                  {clientMs.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                      className="bg-white rounded-2xl p-5" style={{ boxShadow: cardShadow }}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-extrabold text-text">🗺️ Jornada do Projeto</p>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: client.color + '15', color: client.color }}>
                          {doneMs.length}/{clientMs.length} marcos
                        </span>
                      </div>
                      <div className="overflow-x-auto pb-2">
                        <div className="flex items-start gap-0 min-w-max">
                          {clientMs.map((m, i, arr) => {
                            const cfg    = milestoneTypes[m.type] || { icon: '🏁', color: '#f59e0b' }
                            const isPast = m.date <= today
                            const isNext = !isPast && (i === 0 || arr[i - 1]?.date <= today)
                            const isLast = i === arr.length - 1
                            return (
                              <div key={m.id} className="flex items-center">
                                <div className="flex flex-col items-center" style={{ width: 112 }}>
                                  <motion.div
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: isPast ? 1 : isNext ? 0.85 : 0.35 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl relative"
                                    style={{
                                      background: isPast ? `linear-gradient(135deg, ${cfg.color}25, ${cfg.color}10)` : isNext ? cfg.color + '10' : '#f5f6fa',
                                      border: isPast ? `2px solid ${cfg.color}55` : isNext ? `2px dashed ${cfg.color}45` : '2px solid #eaecf4',
                                      boxShadow: isPast ? `0 4px 16px ${cfg.color}22` : 'none',
                                    }}>
                                    {isPast ? cfg.icon : isNext ? <span style={{ opacity: 0.5 }}>{cfg.icon}</span> : '🔒'}
                                    {isPast && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                                        style={{ background: '#6eda2c' }}>✓</div>
                                    )}
                                    {isNext && (
                                      <motion.div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full"
                                        style={{ background: cfg.color }}
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.35, 0.9] }}
                                        transition={{ duration: 1.8, repeat: Infinity }} />
                                    )}
                                  </motion.div>
                                  <p className="text-[8px] font-extrabold text-center mt-1.5 leading-tight px-1"
                                    style={{ color: isPast ? cfg.color : isNext ? '#5a6080' : '#c8cde6', maxWidth: 108,
                                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {m.title.replace(/^[\p{Emoji}\s]+/u, '')}
                                  </p>
                                  <p className="text-[7.5px] text-center mt-0.5 leading-tight"
                                    style={{ color: isPast ? '#6eda2c' : isNext ? cfg.color + 'cc' : '#c8cde6' }}>
                                    {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                  </p>
                                </div>
                                {!isLast && (
                                  <div className="h-0.5 flex-shrink-0 self-start" style={{
                                    width: 14,
                                    marginTop: 22,
                                    background: isPast && arr[i + 1]?.date <= today
                                      ? client.color
                                      : isPast
                                        ? `linear-gradient(90deg, ${client.color}, #e8eaf2)`
                                        : '#eaecf4',
                                  }} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── GRID TAREFAS + LATERAL ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                    {/* Tarefas — 3/5 */}
                    <div className="lg:col-span-3 space-y-3">

                      {/* Em andamento */}
                      {tasksDoing.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                          className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
                          <div className="px-5 py-3 flex items-center gap-2"
                            style={{ background: 'linear-gradient(90deg, #60a5fa0d, transparent)', borderBottom: '1px solid #f0f2f9' }}>
                            <motion.div className="w-2 h-2 rounded-full bg-[#60a5fa]"
                              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                            <span className="text-xs font-extrabold uppercase tracking-widest text-[#60a5fa]">Em execução agora</span>
                            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#60a5fa18', color: '#60a5fa' }}>{tasksDoing.length}</span>
                          </div>
                          <div className="p-3 space-y-2">
                            {tasksDoing.map((t, i) => {
                              const cfg = taskTypes[t.type] || { icon: '📌', color: '#8890b5', label: t.type }
                              return (
                                <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
                                  className="flex items-start gap-3 p-3 rounded-xl"
                                  style={{ background: cfg.color + '07', border: `1px solid ${cfg.color}18` }}>
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                    style={{ background: cfg.color + '15' }}>{cfg.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text leading-snug">{t.title}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                                        style={{ background: cfg.color + '18', color: cfg.color }}>{cfg.label}</span>
                                      {t.dueDate && <span className="text-[10px] text-muted">📅 {new Date(t.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                                    style={{ background: '#60a5fa12', color: '#60a5fa' }}>{statusConfig[t.status]?.label}</span>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Próximas entregas */}
                      {todoSorted.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                          className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
                          <div className="px-5 py-3 flex items-center gap-2 border-b border-[#f0f2f9]"
                            style={{ background: '#fafbff' }}>
                            <span className="text-xs font-extrabold text-text uppercase tracking-widest">Próximas entregas</span>
                            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8eaf2] text-muted">{todoSorted.length}</span>
                          </div>
                          <div className="divide-y divide-[#f6f7fb]">
                            {todoSorted.map((t, i) => {
                              const cfg    = taskTypes[t.type] || { icon: '📌', color: '#8890b5', label: t.type }
                              const isOvrd = t.dueDate && t.dueDate < today
                              return (
                                <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 + i * 0.02 }}
                                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8f9fe] transition-colors">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                                    style={{ background: isOvrd ? '#ef444410' : cfg.color + '10' }}>{cfg.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-text leading-tight truncate">{t.title}</p>
                                    <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                                  </div>
                                  {t.dueDate && (
                                    <div className="flex-shrink-0 text-right">
                                      <p className="text-[11px] font-bold whitespace-nowrap" style={{ color: isOvrd ? '#ef4444' : '#8890b5' }}>
                                        {isOvrd ? '⚠ ' : ''}{new Date(t.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                      </p>
                                      {t.priority === 'high' && !isOvrd && <p className="text-[9px] font-bold text-danger">alta prioridade</p>}
                                    </div>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Concluídas — lista completa */}
                      {tasksDone.length > 0 && (() => {
                        const doneSorted = [...tasksDone].sort((a, b) => (b.dueDate || '0000').localeCompare(a.dueDate || '0000'))
                        return (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                            className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
                            <div className="px-5 py-3 flex items-center gap-2 border-b border-[#f0f2f9]"
                              style={{ background: 'linear-gradient(90deg, #6eda2c0c, transparent)' }}>
                              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#6eda2c' }}>✅ Entregas concluídas</span>
                              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#6eda2c18', color: '#6eda2c' }}>{doneSorted.length}</span>
                            </div>
                            <div className="divide-y divide-[#f6f7fb]">
                              {doneSorted.map((t, i) => {
                                const cfg = taskTypes[t.type] || { icon: '📌', color: '#8890b5', label: t.type }
                                return (
                                  <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 + i * 0.02 }}
                                    className="flex items-center gap-3 px-4 py-2.5">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                                      style={{ background: '#6eda2c10' }}>{cfg.icon}</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[13px] font-semibold text-text leading-tight">{t.title}</p>
                                      <span className="text-[10px] font-semibold text-muted">{cfg.label}</span>
                                    </div>
                                    {t.dueDate && (
                                      <span className="text-[10px] text-muted flex-shrink-0">
                                        {new Date(t.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white"
                                      style={{ background: '#6eda2c' }}>✓</div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )
                      })()}
                    </div>

                    {/* Lateral — 2/5 */}
                    <div className="lg:col-span-2 space-y-4">

                      {/* Próxima reunião */}
                      {futureMtgs.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                          className="rounded-2xl p-5 relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${client.color}14, ${client.color}06)`, border: `1px solid ${client.color}22`, boxShadow: cardShadow }}>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: client.color }}>Próxima reunião</p>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                              style={{ background: client.color, boxShadow: `0 8px 24px ${client.color}35` }}>
                              <span className="text-xl font-black leading-none">{new Date(futureMtgs[0].date + 'T00:00:00').getDate()}</span>
                              <span className="text-[9px] font-bold uppercase opacity-80">
                                {new Date(futureMtgs[0].date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-extrabold text-text leading-snug">{futureMtgs[0].title}</p>
                              <p className="text-xs text-muted mt-1">
                                {new Date(futureMtgs[0].date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                                {futureMtgs[0].time ? ` · ${futureMtgs[0].time}` : ''}
                              </p>
                            </div>
                          </div>
                          {futureMtgs.length > 1 && (
                            <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: `1px solid ${client.color}15` }}>
                              {futureMtgs.slice(1, 4).map(m => (
                                <div key={m.id} className="flex items-center gap-2 text-xs text-muted">
                                  <span style={{ color: client.color + '80' }}>📅</span>
                                  <span>{new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                                  {m.time && <span>· {m.time}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Progresso por tipo */}
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                        className="bg-white rounded-2xl p-5" style={{ boxShadow: cardShadow }}>
                        <p className="text-xs font-extrabold text-text mb-4 uppercase tracking-wide">Progresso por tipo</p>
                        <div className="space-y-3">
                          {Object.entries(taskTypes).map(([key, cfg]) => {
                            const tt   = clientTasks.filter(t => t.type === key)
                            if (tt.length === 0) return null
                            const td   = tt.filter(t => t.status === 'done').length
                            const tpct = Math.round(td / tt.length * 100)
                            return (
                              <div key={key}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{cfg.icon}</span>
                                    <span className="text-[11px] font-semibold text-text-2">{cfg.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted">{td}/{tt.length}</span>
                                    <span className="text-[10px] font-extrabold" style={{ color: cfg.color }}>{tpct}%</span>
                                  </div>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: cfg.color + '18' }}>
                                  <motion.div className="h-full rounded-full" style={{ background: cfg.color }}
                                    initial={{ width: 0 }} animate={{ width: `${tpct}%` }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>

                    </div>
                  </div>

                </motion.div>
              )
            }

            return (
              <motion.div key="assessoria-hub" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 lg:p-6 space-y-4">

                {/* ── Métricas topo ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      label: 'Concluído',
                      value: `${pct}%`,
                      sub: `${done} de ${clientTasks.length} tarefas`,
                      color: pct >= 70 ? '#6eda2c' : pct >= 40 ? '#ea8a29' : '#ef4444',
                      icon: '✅',
                    },
                    { label: 'Em andamento', value: tasksDoing.length, sub: 'em execução agora',  color: '#60a5fa', icon: '▶' },
                    { label: 'A fazer',      value: tasksTodo.length,  sub: 'aguardando início',  color: '#8890b5', icon: '◻' },
                    overdue > 0
                      ? { label: 'Atrasadas', value: overdue, sub: 'vencimento passado', color: '#ef4444', icon: '⚠️' }
                      : { label: 'Em dia',    value: '✓',     sub: 'sem atrasos',        color: '#6eda2c', icon: '🟢' },
                  ].map((m, i) => (
                    <motion.div key={m.label}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                      style={{ background: m.color + '0d', border: `1px solid ${m.color}22`, boxShadow: '0 1px 6px rgba(26,29,46,0.05)' }}>
                      <span className="text-2xl flex-shrink-0">{m.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xl font-black leading-none" style={{ color: m.color }}>{m.value}</p>
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted mt-0.5">{m.label}</p>
                        <p className="text-[9px] text-muted truncate hidden lg:block">{m.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── Kanban de entregas ── */}
                {(() => {
                  const cols = [
                    { key: 'todo',  label: 'A fazer',       color: '#8890b5', dot: '#c8cde6' },
                    { key: 'doing', label: 'Em andamento',  color: '#60a5fa', dot: '#60a5fa' },
                    { key: 'done',  label: 'Concluído',     color: '#6eda2c', dot: '#6eda2c' },
                  ]
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <LayoutGrid size={14} className="text-muted" />
                        <span className="text-xs font-extrabold uppercase tracking-widest text-muted">Kanban — Entregas</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {cols.map(col => {
                          const items = clientTasks.filter(t => t.status === col.key)
                          return (
                            <div key={col.key} className="bg-white rounded-2xl overflow-hidden"
                              style={{ boxShadow: cardShadow, border: `1px solid ${col.color}18` }}>
                              <div className="px-4 py-3 flex items-center gap-2 border-b border-[#f0f2f9]"
                                style={{ background: col.color + '08' }}>
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.dot }} />
                                <span className="text-xs font-extrabold text-text">{col.label}</span>
                                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: col.color + '18', color: col.color }}>{items.length}</span>
                              </div>
                              <div className={`p-2 space-y-1.5 overflow-y-auto ${isClientMode ? '' : 'max-h-72'}`}>
                                {items.length === 0 ? (
                                  <p className="text-xs text-muted text-center py-6 opacity-50">Nenhuma</p>
                                ) : items.map(task => {
                                  const cfg      = taskTypes[task.type]
                                  const isOvrd   = task.dueDate && task.dueDate < today && task.status !== 'done'
                                  const assignee = collabMap[task.assignee]
                                  return (
                                    <div key={task.id}
                                      onClick={() => { if (!isClientMode) { setEditingTask(task); setShowTarefaModal(true) } }}
                                      className={`flex items-start gap-2 p-2.5 rounded-xl transition-colors hover:bg-[#f8f9fe] group ${isClientMode ? 'cursor-default' : 'cursor-pointer'}`}
                                      style={{ borderLeft: `3px solid ${cfg?.color || col.color}` }}>
                                      <span className="text-sm flex-shrink-0 mt-0.5">{cfg?.icon || '•'}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-[12px] font-semibold leading-tight ${task.status === 'done' ? 'line-through text-muted' : 'text-text'}`}>
                                          {task.title}
                                        </p>
                                        {task.dueDate && (
                                          <p className="text-[10px] mt-0.5 font-medium flex items-center gap-1"
                                            style={{ color: isOvrd ? '#ef4444' : '#b0b8d4' }}>
                                            <Clock size={9} />
                                            {isOvrd ? '⚠ ' : ''}{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                          </p>
                                        )}
                                      </div>
                                      {assignee && <UserAvatar user={assignee} size={18} />}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}

                {/* ── Grid principal ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  {/* Tarefas — col 2/3 */}
                  <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: cardShadow }}>
                    {/* header */}
                    <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0"
                      style={{ borderBottom: '1px solid #f0f2f9', background: `linear-gradient(135deg, ${client.color}08 0%, transparent 60%)` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[11px]"
                          style={{ background: client.color + '20' }}>✓</div>
                        <span className="text-sm font-extrabold text-text">Tarefas</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                          style={{ background: '#f0f2f9', color: '#8890b5' }}>{clientTasks.length}</span>
                      </div>
                      {!isClientMode && (
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => { setShowTarefaModal(true); setEditingTask(null) }}
                          className="flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all"
                          style={{ background: client.color + '15', color: client.color }}>
                          <Plus size={11} /> Nova
                        </motion.button>
                      )}
                    </div>

                    {/* grupos */}
                    <div className="overflow-auto flex-1" style={isClientMode ? {} : { maxHeight: 420 }}>
                      {clientTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
                          <span className="text-3xl opacity-20">📋</span>
                          <p className="text-sm text-muted">Nenhuma tarefa ainda</p>
                        </div>
                      ) : (
                        <>
                          {tasksDoing.length > 0 && (
                            <>
                              <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#60a5fa08', borderBottom: '1px solid #f0f2f9' }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#60a5fa]" />
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#60a5fa]">Em andamento</span>
                                <span className="text-[10px] text-[#60a5fa] font-bold ml-auto">{tasksDoing.length}</span>
                              </div>
                              {tasksDoing.map(t => renderRow(t))}
                            </>
                          )}
                          {tasksTodo.length > 0 && (() => {
                            const overdueTodo = tasksTodo.filter(t => t.dueDate && t.dueDate < today).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                            const upcomingTodo = tasksTodo.filter(t => !t.dueDate || t.dueDate >= today).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
                            return (
                              <>
                                <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#8890b508', borderBottom: '1px solid #f0f2f9', borderTop: tasksDoing.length > 0 ? '1px solid #f0f2f9' : undefined }}>
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c8cde6]" />
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">A fazer</span>
                                  <span className="text-[10px] text-muted font-bold ml-auto">{tasksTodo.length}</span>
                                </div>
                                {overdueTodo.length > 0 && (
                                  <>
                                    <div className="px-4 py-1 flex items-center gap-1.5" style={{ background: '#ef444408', borderBottom: '1px solid #f0f2f9' }}>
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#ef4444]">⚠ Atrasadas</span>
                                    </div>
                                    {overdueTodo.map(t => renderRow(t))}
                                    <div className="px-4 py-1 flex items-center gap-1.5" style={{ background: '#f0f2f908', borderBottom: '1px solid #f0f2f9' }}>
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Próximas</span>
                                    </div>
                                  </>
                                )}
                                {upcomingTodo.map(t => renderRow(t))}
                              </>
                            )
                          })()}
                          {tasksDone.length > 0 && (
                            <>
                              <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#6eda2c08', borderBottom: '1px solid #f0f2f9', borderTop: '1px solid #f0f2f9' }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#6eda2c]" />
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6eda2c]">Concluídas</span>
                                <span className="text-[10px] text-[#6eda2c] font-bold ml-auto">{tasksDone.length}</span>
                              </div>
                              {(isClientMode ? tasksDone : tasksDone.slice(0, 5)).map(t => renderRow(t))}
                              {!isClientMode && tasksDone.length > 5 && (
                                <p className="text-center text-[10px] text-muted py-2">+ {tasksDone.length - 5} concluídas</p>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Coluna direita */}
                  <div className="flex flex-col gap-4">

                    {/* Reuniões */}
                    <div className="bg-white rounded-2xl overflow-hidden flex-1" style={{ boxShadow: cardShadow }}>
                      <div className="px-5 py-3.5 flex items-center justify-between"
                        style={{ borderBottom: '1px solid #f0f2f9', background: `linear-gradient(135deg, ${client.color}08 0%, transparent 60%)` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[11px]"
                            style={{ background: client.color + '20' }}>📅</div>
                          <span className="text-sm font-extrabold text-text">Reuniões</span>
                        </div>
                        {!isClientMode && (
                          <button className="text-[10px] font-bold text-muted hover:text-accent transition-colors flex items-center gap-1">
                            <Plus size={10} /> Agendar
                          </button>
                        )}
                      </div>
                      {futureMtgs.length > 0 ? (
                        <div className="divide-y divide-[#f6f7fb]" style={{ maxHeight: 280, overflowY: 'auto' }}>
                          {futureMtgs.map((m, idx) => {
                            const d       = new Date(m.date + 'T00:00:00')
                            const isToday = m.date === today
                            const isNext  = idx === 0
                            return (
                              <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8f9fe] transition-colors">
                                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                                  style={{
                                    background: isToday ? client.color : isNext ? client.color + '15' : '#f0f2f9',
                                  }}>
                                  <span className="text-sm font-black leading-none"
                                    style={{ color: isToday ? '#fff' : isNext ? client.color : '#8890b5' }}>
                                    {d.getDate()}
                                  </span>
                                  <span className="text-[8px] font-extrabold uppercase"
                                    style={{ color: isToday ? 'rgba(255,255,255,0.75)' : isNext ? client.color + 'aa' : '#b0b8d4' }}>
                                    {d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-text truncate">{m.title}</p>
                                  <p className="text-[10px] text-muted mt-0.5">
                                    {isToday ? <span style={{ color: client.color }} className="font-extrabold">Hoje</span>
                                      : d.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                    {m.time ? ` · ${m.time}` : ''}
                                  </p>
                                </div>
                                {isNext && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                    style={{ background: client.color + '18', color: client.color }}>PRÓ</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 gap-1">
                          <span className="text-2xl opacity-20">📅</span>
                          <p className="text-xs text-muted">Nenhuma reunião agendada</p>
                        </div>
                      )}
                    </div>

                    {/* Progresso por tipo */}
                    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: cardShadow }}>
                      <p className="text-xs font-extrabold text-text mb-4 uppercase tracking-wide">Progresso por tipo</p>
                      {Object.entries(taskTypes).some(([k]) => clientTasks.some(t => t.type === k)) ? (
                        <div className="space-y-3.5">
                          {Object.entries(taskTypes).map(([key, cfg]) => {
                            const tt  = clientTasks.filter(t => t.type === key)
                            if (tt.length === 0) return null
                            const td  = tt.filter(t => t.status === 'done').length
                            const pct = Math.round(td / tt.length * 100)
                            return (
                              <div key={key}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{cfg.icon}</span>
                                    <span className="text-[11px] font-semibold text-text-2">{cfg.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted">{td}/{tt.length}</span>
                                    <span className="text-[10px] font-extrabold" style={{ color: cfg.color }}>{pct}%</span>
                                  </div>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: cfg.color + '18' }}>
                                  <motion.div className="h-full rounded-full" style={{ background: cfg.color }}
                                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted text-center py-3">Sem entregáveis</p>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )
          })()}

          {tab === 'Linha do Tempo' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <ClientTimeline clientId={id} clientColor={client.color} clientTasks={clientTasks} />
            </motion.div>
          )}

          {tab === 'Tráfego' && (
            <motion.div key="traffic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <MetricsPanel clientId={id} clientColor={client.color} client={client} isClientMode={isClientMode} />
            </motion.div>
          )}

          {tab === '🗓️ Reuniões' && (
            <motion.div key="meetings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <MeetingsPanel clientMeetings={clientMeetings} clientId={id} collabMap={collabMap} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && id === 'casa_construtor' && (
            <motion.div key="casa-construtor-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <CasaConstrutorResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && id === 'intime' && (
            <motion.div key="resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <IntimeResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && (isAssessoriaClient || isAssessoriaInternal) && (
            <motion.div key="assessoria-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <AssessoriaResultados clientId={id} color={client.color} />
            </motion.div>
          )}

          {tab === '📊 Marketing' && isAgencia && (
            <motion.div key="trafegon-marketing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TrafegonMarketing color={client.color} />
            </motion.div>
          )}

          {tab === '🤝 Comercial' && isAgencia && (
            <motion.div key="trafegon-comercial" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TrafegonComercial color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && isKamy && (
            <motion.div key="kamy-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <KamyResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🧠 Estratégia' && isKamy && (
            <motion.div key="kamy-estrategia" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <KamyEstrategia color={client.color} />
            </motion.div>
          )}

          {tab === '🧠 Estratégia de Mídia' && (isCacarola || isCacarolaClient) && (
            <motion.div key="cacarola-midia" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <CacarolaMidia color={client.color} />
            </motion.div>
          )}

          {tab === '🔓 Destrava' && isDestrava && !isClientMode && (
            <motion.div key="destrava-board" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaBoard clientId={id} clientColor={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Desafio' && isDestravaClient && (
            <motion.div key="desafio-client" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaBoard clientId={id} clientColor={client.color} isClient planDays={PLANO_IDEAL_LIKE.has(id) ? '15' : undefined} />
            </motion.div>
          )}

          {tab === '📚 Apresentação' && isDestrava && !isClientMode && (
            <motion.div key="apresentacao-interna" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaDigital autoFormat={PLANO_IDEAL_LIKE.has(id) ? 'ativacao_meta' : 'estruturacao'} />
            </motion.div>
          )}

          {tab === '📚 Apresentação' && isDestravaClient && (
            <motion.div key="apresentacao-client" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaDigital autoFormat={PLANO_IDEAL_LIKE.has(id) ? 'ativacao_meta' : 'estruturacao'} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(showTarefaModal || editingTask) && (
          <TarefaModal
            clientId={editingTask ? undefined : id}
            clientName={editingTask ? undefined : client.name}
            task={editingTask}
            onSave={handleSaveTarefa}
            onClose={() => { setShowTarefaModal(false); setEditingTask(null) }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTemplates && (
          <TaskTemplatesDrawer
            clientId={id}
            clientName={client.name}
            assignee={collaborators[0]?.id}
            onApply={async (taskData) => { await handleSaveTarefa(taskData); setShowTemplates(false) }}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
