import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Trophy, Crown, Zap, Star, ChevronRight, Sword } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { taskTypes } from '../data/erp-mock'

/* ══════════════════════════════════════════════════
   DADOS DE CONFIGURAÇÃO
══════════════════════════════════════════════════ */
const RARIDADES = {
  comum: {
    label: 'Comum', stars: 1, minOns: 0,
    color: '#8890b5', textColor: '#4b5068',
    cardBg: 'linear-gradient(160deg,#f8f9fc,#eef0fb)',
    headerBg: '#e2e5f4', border: '1.5px solid #d1d5e8',
    glow: 'none', dark: false, shine: false,
  },
  incomum: {
    label: 'Incomum', stars: 2, minOns: 0,
    color: '#6eda2c', textColor: '#166534',
    cardBg: 'linear-gradient(160deg,#f0fde4,#dcfce7)',
    headerBg: '#bbf7d0', border: '2px solid #86efac',
    glow: '0 0 22px rgba(110,218,44,0.35)', dark: false, shine: false,
  },
  raro: {
    label: 'Raro', stars: 3, minOns: 10,
    color: '#60a5fa', textColor: '#1d4ed8',
    cardBg: 'linear-gradient(160deg,#eff6ff,#dbeafe,#e0e7ff)',
    headerBg: 'linear-gradient(135deg,#bfdbfe,#c7d2fe)',
    border: '2px solid #93c5fd',
    glow: '0 0 28px rgba(96,165,250,0.55)', dark: false, shine: true,
  },
  epico: {
    label: 'Épico', stars: 4, minOns: 30,
    color: '#c084fc', textColor: '#e9d5ff',
    cardBg: 'linear-gradient(160deg,#1a0a2e,#2d1554,#1e0a3e)',
    headerBg: 'linear-gradient(135deg,#4c1d95,#6d28d9)',
    border: '2px solid #8b5cf6',
    glow: '0 0 38px rgba(139,92,246,0.7), 0 0 80px rgba(139,92,246,0.2)',
    dark: true, shine: true,
  },
  lendario: {
    label: 'Lendário', stars: 5, minOns: 50,
    color: '#fbbf24', textColor: '#fde68a',
    cardBg: 'linear-gradient(160deg,#1c1400,#2e2000,#1c1400)',
    headerBg: 'linear-gradient(135deg,#78350f,#92400e)',
    border: '2px solid #f59e0b',
    glow: '0 0 50px rgba(245,158,11,0.8), 0 0 100px rgba(245,158,11,0.2), 0 0 6px rgba(245,158,11,0.9)',
    dark: true, shine: true,
  },
}

const ARSENAL = [
  { key:'atualizar_gmn',   label:'Google Meu Negócio', icon:'📍', raridade:'comum',   ons:1,  desc:'Atualizar perfil e responder avaliações' },
  { key:'enviar_dash',     label:'Enviar Dashboard',   icon:'📤', raridade:'comum',   ons:1,  desc:'Relatório semanal de performance ao cliente' },
  { key:'whats_grupos',    label:'Grupos WhatsApp',    icon:'💬', raridade:'comum',   ons:1,  desc:'Interagir com cliente nos grupos' },
  { key:'gestao_diaria',   label:'Gestão Diária',      icon:'🔄', raridade:'comum',   ons:1,  desc:'Gerenciar campanhas e anúncios do dia' },
  { key:'planilha_ind',    label:'Planilha Ind.',      icon:'📋', raridade:'comum',   ons:1,  desc:'Preencher planilha de indicadores' },
  { key:'analise_conv',    label:'Analisar Conversas', icon:'🔍', raridade:'comum',   ons:1,  desc:'Revisar conversas no CRM' },
  { key:'org_perfil',      label:'Organizar Perfil',   icon:'✨', raridade:'incomum', ons:3,  desc:'Posts fixados, destaques e bio nas redes' },
  { key:'reuniao',         label:'Reunião de Acomp.',  icon:'📅', raridade:'incomum', ons:3,  desc:'Reunião estratégica com o cliente' },
  { key:'criar_artes',     label:'Criação de Artes',   icon:'🎨', raridade:'incomum', ons:3,  desc:'Artes para campanhas e redes sociais' },
  { key:'roteiro',         label:'Planej. Roteiro',    icon:'✍️', raridade:'incomum', ons:3,  desc:'Roteiro para vídeos e conteúdos' },
  { key:'calendario_post', label:'Calendário de Post', icon:'📆', raridade:'incomum', ons:3,  desc:'Planejamento mensal de conteúdo' },
  { key:'pesquisa_merc',   label:'Pesquisa Mercado',   icon:'🔎', raridade:'incomum', ons:3,  desc:'Análise de concorrência e mercado' },
  { key:'rastreamento',    label:'Rastreamento',       icon:'🎯', raridade:'incomum', ons:3,  desc:'Configurar pixels e eventos de conversão' },
  { key:'pipeline_crm',    label:'Pipeline & CRM',     icon:'📊', raridade:'incomum', ons:3,  desc:'Analisar funil e taxa de conversão' },
  { key:'setup_conta',     label:'Setup de Conta',     icon:'⚙️', raridade:'raro',    ons:5,  desc:'Configuração completa de conta de anúncios' },
  { key:'criar_campanha',  label:'Criar Campanha',     icon:'📢', raridade:'raro',    ons:5,  desc:'Campanhas, públicos e criativos completos' },
  { key:'treinamento',     label:'Treinamento Cliente',icon:'🎓', raridade:'raro',    ons:5,  desc:'Capacitar o cliente em vendas' },
  { key:'captacao_video',  label:'Captação de Vídeo',  icon:'🎥', raridade:'raro',    ons:5,  desc:'Gravação e produção audiovisual' },
  { key:'edicao_video',    label:'Edição de Vídeo',    icon:'🎬', raridade:'raro',    ons:5,  desc:'Edição e pós-produção completa' },
  { key:'lancamento',      label:'Lançar Cliente',     icon:'🚀', raridade:'epico',   ons:8,  desc:'Setup completo de novo cliente do zero' },
  { key:'funil_completo',  label:'Funil Completo',     icon:'⚡', raridade:'epico',   ons:8,  desc:'LP + Campanha + Criativos + Rastreamento' },
  { key:'meta_atingida',   label:'Meta do Mês',        icon:'👑', raridade:'lendario',ons:15, desc:'Cliente bate a meta de ROI do mês' },
  { key:'cliente_100k',    label:'Conta 100k+',        icon:'💎', raridade:'lendario',ons:15, desc:'Gestão de R$100k+ em anúncios ativos' },
]

const TRILHAS = [
  {
    key:'trafego', label:'Gestor de Tráfego', icon:'📢', color:'#60a5fa',
    gradient:'linear-gradient(135deg,#1e3a5f,#1e40af)',
    levels:[
      { level:1, label:'Aprendiz',     icon:'📋', minOns:0,   desc:'Primeiros passos na gestão de tráfego' },
      { level:2, label:'Operador',     icon:'⚙️', minOns:15,  desc:'Gestão diária e rastreamento' },
      { level:3, label:'Especialista', icon:'📢', minOns:50,  desc:'Cria e otimiza campanhas completas' },
      { level:4, label:'Estrategista', icon:'🎯', minOns:120, desc:'Define estratégia e treina equipes' },
    ],
  },
  {
    key:'criativo', label:'Criativo', icon:'🎨', color:'#c084fc',
    gradient:'linear-gradient(135deg,#3b0764,#6d28d9)',
    levels:[
      { level:1, label:'Assistente',    icon:'✏️', minOns:0,   desc:'Apoia na criação de artes e conteúdo' },
      { level:2, label:'Produtor',      icon:'🎨', minOns:15,  desc:'Produz artes, roteiros e calendários' },
      { level:3, label:'Diretor',       icon:'🎬', minOns:50,  desc:'Dirige captação e edição de vídeo' },
      { level:4, label:'Lead Criativo', icon:'👑', minOns:120, desc:'Lidera a identidade visual de clientes' },
    ],
  },
  {
    key:'analista', label:'Analista', icon:'📊', color:'#6eda2c',
    gradient:'linear-gradient(135deg,#14532d,#15803d)',
    levels:[
      { level:1, label:'Observador',   icon:'🔍', minOns:0,   desc:'Acompanha métricas e conversas do CRM' },
      { level:2, label:'Analista Jr',  icon:'📊', minOns:15,  desc:'Analisa pipeline e indicadores' },
      { level:3, label:'Estrategista', icon:'🎯', minOns:50,  desc:'Define estratégias baseadas em dados' },
      { level:4, label:'Growth Lead',  icon:'🚀', minOns:120, desc:'Lidera crescimento com dados e OKRs' },
    ],
  },
]

const RANKS = [
  { min:0,   label:'Iniciante',    icon:'🌱', color:'#8890b5' },
  { min:15,  label:'Executor',     icon:'⚡', color:'#60a5fa' },
  { min:50,  label:'Velocista',    icon:'🚀', color:'#ea8a29' },
  { min:120, label:'Especialista', icon:'🏆', color:'#6eda2c' },
  { min:250, label:'Elite',        icon:'👑', color:'#f59e0b' },
]

const FILTROS = ['todos','comum','incomum','raro','epico','lendario']

function getRank(ons) {
  let rank = RANKS[0], idx = 0
  RANKS.forEach((r, i) => { if (ons >= r.min) { rank = r; idx = i } })
  const next = RANKS[idx + 1]
  const pct  = next ? Math.min(100, Math.round(((ons - rank.min) / (next.min - rank.min)) * 100)) : 100
  return { ...rank, next, pct }
}

/* ── Card individual ─────────────────────────────────────────────── */
function MissaoCard({ card, userOns, index }) {
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef               = useRef(null)
  const rar     = RARIDADES[card.raridade]
  const locked  = userOns < rar.minOns

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x =  ((e.clientX - rect.left)  / rect.width  - 0.5) * 22
    const y = -((e.clientY - rect.top)   / rect.height - 0.5) * 22
    setTilt({ x, y })
  }

  const particles = rar.dark ? Array.from({ length: 6 }) : []

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTilt({ x:0, y:0 }); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      style={{
        perspective: '900px',
        filter: locked ? 'grayscale(0.85) brightness(0.55)' : 'none',
        cursor: locked ? 'not-allowed' : 'pointer',
      }}
    >
      <motion.div
        animate={{ rotateY: tilt.x, rotateX: tilt.y, scale: hovered && !locked ? 1.08 : 1 }}
        transition={{ type:'spring', stiffness:280, damping:22 }}
        style={{
          transformStyle:'preserve-3d',
          width: 148,
          height: 210,
          borderRadius: 18,
          background: rar.cardBg,
          border: rar.border,
          boxShadow: hovered && !locked ? rar.glow : rar.glow === 'none' ? '0 2px 10px rgba(0,0,0,0.08)' : rar.glow,
          position:'relative',
          overflow:'hidden',
          flexShrink: 0,
        }}
      >
        {/* Partículas Épico/Lendário */}
        {hovered && particles.map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: rar.color,
              left: `${Math.random() * 100}%`,
              bottom: '10%',
            }}
            animate={{ y: [0, -(60 + Math.random() * 80)], opacity: [0.8, 0] }}
            transition={{ duration: 1.2 + Math.random() * 0.8, repeat: Infinity, delay: Math.random() * 0.6 }}
          />
        ))}

        {/* Shimmer sweep para Raro+ */}
        {rar.shine && hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ background:'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.25) 50%,transparent 70%)' }}
            initial={{ backgroundPosition:'-100% 0' }}
            animate={{ backgroundPosition:'200% 0' }}
            transition={{ duration:0.9, ease:'easeInOut' }}
          />
        )}

        {/* Header com ícone */}
        <div
          className="flex items-center justify-center"
          style={{
            height: 72,
            background: rar.headerBg,
            borderBottom: `1px solid ${rar.color}30`,
          }}
        >
          <span style={{ fontSize: 36, lineHeight:1, filter: rar.dark ? 'brightness(1.3)' : 'none' }}>
            {locked ? '🔒' : card.icon}
          </span>
        </div>

        {/* Corpo */}
        <div className="px-2.5 pt-2.5 pb-2 flex flex-col" style={{ height: 'calc(100% - 72px)' }}>
          <p className="text-[11px] font-extrabold leading-tight mb-1"
            style={{ color: rar.dark ? rar.textColor : rar.textColor }}>
            {card.label}
          </p>
          <p className="text-[9px] leading-snug flex-1"
            style={{ color: rar.dark ? 'rgba(255,255,255,0.45)' : '#8890b5' }}>
            {locked ? `Desbloqueie com ${rar.minOns} ons` : card.desc}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            {/* ons badge */}
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg"
              style={{ background: rar.color + '22', color: rar.color }}>
              +{card.ons} ons
            </span>
            {/* estrelas */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize:7, opacity: i < rar.stars ? 1 : 0.2, color: rar.color }}>★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Badge rarity — canto superior direito */}
        <div
          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md"
          style={{ background: rar.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)', backdropFilter:'blur(4px)' }}
        >
          <span className="text-[8px] font-extrabold" style={{ color: rar.color }}>
            {rar.label.toUpperCase()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Trilha de evolução ──────────────────────────────────────────── */
function TrilhaCard({ trilha, userOns, selected, onSelect }) {
  const activeLevel = trilha.levels.reduce((acc, l) => userOns >= l.minOns ? l : acc, trilha.levels[0])

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="rounded-2xl overflow-hidden cursor-pointer flex-1 min-w-[200px]"
      style={{
        border: selected ? `2px solid ${trilha.color}` : '1.5px solid #e0e3f0',
        boxShadow: selected ? `0 0 24px ${trilha.color}40` : '0 2px 10px rgba(26,29,46,0.07)',
        background: 'white',
      }}
    >
      {/* Header da trilha */}
      <div className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: trilha.gradient, borderBottom: `1px solid ${trilha.color}30` }}>
        <span className="text-2xl">{trilha.icon}</span>
        <div>
          <p className="text-xs font-extrabold text-white leading-none">{trilha.label}</p>
          <p className="text-[10px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Nível atual: {activeLevel.label}
          </p>
        </div>
        {selected && (
          <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: trilha.color }}>
            <span style={{ fontSize: 10 }}>✓</span>
          </div>
        )}
      </div>

      {/* Nós da trilha */}
      <div className="px-4 py-3 space-y-0">
        {trilha.levels.map((level, i) => {
          const unlocked = userOns >= level.minOns
          const isCurrent = level.key === activeLevel.key || level.label === activeLevel.label
          const isLast = i === trilha.levels.length - 1

          return (
            <div key={level.level} className="flex gap-3">
              {/* Linha + nó */}
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  animate={isCurrent ? {
                    boxShadow: [`0 0 0px ${trilha.color}`, `0 0 14px ${trilha.color}`, `0 0 0px ${trilha.color}`]
                  } : {}}
                  transition={{ duration:2, repeat:Infinity }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] z-10"
                  style={{
                    background: unlocked ? trilha.color : '#e0e3f0',
                    color: unlocked ? '#fff' : '#b0b5cc',
                    border: isCurrent ? `2px solid ${trilha.color}` : 'none',
                    boxShadow: isCurrent ? `0 0 10px ${trilha.color}60` : 'none',
                  }}
                >
                  {unlocked ? level.icon : <Lock size={10} />}
                </motion.div>
                {!isLast && (
                  <div className="w-0.5 flex-1 my-0.5" style={{ minHeight:16, background: unlocked ? trilha.color + '50' : '#e0e3f0' }} />
                )}
              </div>

              {/* Texto */}
              <div className="pb-3 flex-1">
                <p className="text-[11px] font-extrabold leading-none"
                  style={{ color: unlocked ? '#1a1d2e' : '#b0b5cc' }}>
                  {level.label}
                  {!unlocked && <span className="ml-1.5 text-[9px] font-bold" style={{ color:'#c0c5e0' }}>
                    {level.minOns} ons
                  </span>}
                </p>
                <p className="text-[9px] mt-0.5 leading-snug" style={{ color: unlocked ? '#8890b5' : '#c8cce0' }}>
                  {level.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Player Hero ─────────────────────────────────────────────────── */
function PlayerHero({ user, userOns, totalTasks }) {
  const rank = getRank(userOns)

  return (
    <motion.div
      initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
      className="relative overflow-hidden rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start"
      style={{
        background: 'linear-gradient(135deg,#0f1117 0%,#1a1d2e 50%,#0d1020 100%)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${rank.color}15`,
        border: `1px solid ${rank.color}25`,
      }}
    >
      {/* Glow de fundo */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 50%, ${rank.color}12 0%, transparent 60%)` }} />

      {/* Avatar */}
      <motion.div
        animate={{ boxShadow: [`0 0 20px ${rank.color}40`, `0 0 40px ${rank.color}70`, `0 0 20px ${rank.color}40`] }}
        transition={{ duration:2.5, repeat:Infinity }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 relative z-10"
        style={{ backgroundColor: user?.color || '#6eda2c', border: `3px solid ${rank.color}` }}
      >
        {user?.avatar || '?'}
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h2 className="text-xl font-black text-white">{user?.name || 'Jogador'}</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: rank.color + '25', color: rank.color, border: `1px solid ${rank.color}40` }}>
            {rank.icon} {rank.label}
          </span>
        </div>
        <p className="text-[11px] font-medium mb-3" style={{ color:'rgba(255,255,255,0.4)' }}>
          {user?.role || 'Colaborador'} · {totalTasks} tarefas concluídas
        </p>

        {/* Ons e progresso */}
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <p className="text-3xl font-black" style={{ color: rank.color, textShadow:`0 0 20px ${rank.color}60` }}>
              {userOns}
              <span className="text-base font-bold ml-1.5" style={{ color: rank.color + 'aa' }}>ons</span>
            </p>
            {rank.next && (
              <p className="text-[10px] font-bold mt-0.5" style={{ color:'rgba(255,255,255,0.3)' }}>
                Faltam {rank.next.min - userOns} ons para {rank.next.icon} {rank.next.label}
              </p>
            )}
          </div>

          <div className="flex-1 min-w-[140px]">
            <div className="flex justify-between text-[9px] font-bold mb-1" style={{ color:'rgba(255,255,255,0.3)' }}>
              <span>{rank.label}</span>
              <span>{rank.pct}%</span>
              {rank.next && <span>{rank.next?.label}</span>}
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full relative overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${rank.color}, ${rank.color}cc)` }}
                initial={{ width:0 }} animate={{ width:`${rank.pct}%` }}
                transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}>
                <motion.div className="absolute inset-0"
                  style={{ background:'linear-gradient(90deg,transparent 40%,rgba(255,255,255,0.3) 60%,transparent 80%)' }}
                  animate={{ x:['-100%','200%'] }}
                  transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas laterais */}
      <div className="flex md:flex-col gap-3 flex-shrink-0 relative z-10">
        {[
          { label:'Rank',      value: rank.icon + ' ' + rank.label, color: rank.color },
          { label:'Ons total', value: userOns,   color:'#fff' },
          { label:'Tarefas',   value: totalTasks, color:'#6eda2c' },
        ].map(stat => (
          <div key={stat.label} className="text-center px-4 py-2.5 rounded-xl"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color:'rgba(255,255,255,0.3)' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   ARENA — PÁGINA PRINCIPAL
══════════════════════════════════════════════════ */
export default function Arena() {
  const { tasks } = useData()

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2')) } catch { return null }
  }, [])

  const userOns = useMemo(() =>
    tasks
      .filter(t => t.assignee === user?.id && t.status === 'done')
      .reduce((sum, t) => sum + (taskTypes[t.type]?.ons ?? 1), 0)
  , [tasks, user])

  const totalTasks = useMemo(() =>
    tasks.filter(t => t.assignee === user?.id && t.status === 'done').length
  , [tasks, user])

  const trilhaSalva = localStorage.getItem('arena_trilha') || 'trafego'
  const [trilhaSel, setTrilhaSel] = useState(trilhaSalva)
  const [filtro, setFiltro]       = useState('todos')

  function selectTrilha(key) {
    setTrilhaSel(key)
    localStorage.setItem('arena_trilha', key)
  }

  const arsenalFiltrado = useMemo(() =>
    ARSENAL.filter(c => filtro === 'todos' || c.raridade === filtro)
  , [filtro])

  return (
    <div className="p-4 lg:p-8 min-h-screen" style={{ background:'#f4f6fd' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#1a1d2e,#2d3154)' }}>
          <Sword size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-text">Arena</h1>
          <p className="text-xs text-muted">Sua jornada de evolução na TráfegOn</p>
        </div>
      </motion.div>

      {/* ── Player Hero ── */}
      <div className="mb-6">
        <PlayerHero user={user} userOns={userOns} totalTasks={totalTasks} />
      </div>

      {/* ── Trilhas de Evolução ── */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color:'#f59e0b' }} />
          <p className="text-sm font-extrabold text-text">Trilhas de Evolução</p>
          <span className="text-[10px] text-muted ml-1">— selecione sua especialidade</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {TRILHAS.map(t => (
            <TrilhaCard key={t.key} trilha={t} userOns={userOns}
              selected={trilhaSel === t.key}
              onSelect={() => selectTrilha(t.key)} />
          ))}
        </div>
      </motion.div>

      {/* ── Arsenal de Cartas ── */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Trophy size={14} className="text-accent" />
          <p className="text-sm font-extrabold text-text">Arsenal de Cartas</p>
          <span className="text-[10px] text-muted ml-1">— {ARSENAL.length} cartas disponíveis</span>

          <div className="ml-auto flex items-center gap-1.5 flex-wrap">
            {FILTROS.map(f => {
              const rar = f === 'todos' ? null : RARIDADES[f]
              return (
                <button key={f} onClick={() => setFiltro(f)}
                  className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl border transition-all"
                  style={filtro === f
                    ? { background: rar?.color || '#1a1d2e', color:'#fff', borderColor:'transparent' }
                    : { background:'white', color: rar?.color || '#4b5068', borderColor: rar?.color + '40' || '#e0e3f0' }
                  }>
                  {f === 'todos' ? 'Todas' : rar?.label}
                  {rar && <span className="ml-1">{'★'.repeat(rar.stars)}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div layout className="flex flex-wrap gap-3">
            {arsenalFiltrado.map((card, i) => (
              <MissaoCard key={card.key} card={card} userOns={userOns} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Legenda de raridade */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Raridade:</p>
          {Object.entries(RARIDADES).map(([key, r]) => (
            <span key={key} className="flex items-center gap-1 text-[10px] font-bold"
              style={{ color: r.color }}>
              {'★'.repeat(r.stars)} {r.label}
              {r.minOns > 0 && <span className="text-muted font-normal ml-0.5">({r.minOns}+ ons)</span>}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
