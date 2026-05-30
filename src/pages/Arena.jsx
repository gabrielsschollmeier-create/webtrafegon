import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Trophy, Crown, Zap, Star, ChevronRight, Sword } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { taskTypes } from '../data/erp-mock'
import UserAvatar from '../components/UserAvatar'
import { getAvatarComponent } from '../data/avatars'
import CartasCopaSection from '../components/CartasCopaSection'

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
  // ── COMUM ──────────────────────────────────────────────────────────────────
  {
    key:'atualizar_gmn', icon:'📍', raridade:'comum', ons:1,
    label:'O Guardião do Mapa',
    tipo:'Atividade — Presença Digital',
    desc:'Atualizar perfil e responder avaliações',
    flavor:'"O cliente sumiu do Google. Os concorrentes, não."',
  },
  {
    key:'enviar_dash', icon:'📊', raridade:'comum', ons:1,
    label:'O Profeta dos Números',
    tipo:'Atividade — Relatório',
    desc:'Relatório semanal de performance ao cliente',
    flavor:'"Enviado às sexta 23h. Resposta do cliente: posso te ligar agora?"',
  },
  {
    key:'whats_grupos', icon:'💬', raridade:'comum', ons:1,
    label:'Sussurrador de Clientes',
    tipo:'Atividade — Relacionamento',
    desc:'Interagir nos grupos do cliente',
    flavor:'"Todo gestor tem um grupo de WhatsApp que nunca dorme."',
  },
  {
    key:'gestao_diaria', icon:'🔄', raridade:'comum', ons:1,
    label:'Vigilante das Impressões',
    tipo:'Atividade — Tráfego Pago',
    desc:'Gerenciar campanhas e anúncios do dia',
    flavor:'"Pausa na campanha às 8h, corrige às 8h01. Saldo salvo."',
  },
  {
    key:'planilha_ind', icon:'📋', raridade:'comum', ons:1,
    label:'Arquivista da Verdade',
    tipo:'Atividade — Dados',
    desc:'Preencher planilha de indicadores',
    flavor:'"Se não tá na planilha, não aconteceu."',
  },
  {
    key:'analise_conv', icon:'🔍', raridade:'comum', ons:1,
    label:'Detetive do Funil',
    tipo:'Atividade — CRM',
    desc:'Revisar conversas e leads no CRM',
    flavor:'"O lead sumiu após a proposta. Investigação iniciada."',
  },

  // ── INCOMUM ────────────────────────────────────────────────────────────────
  {
    key:'org_perfil', icon:'✨', raridade:'incomum', ons:3,
    label:'A Grande Reforma',
    tipo:'Execução — Social Media',
    desc:'Posts fixados, destaques e bio nas redes',
    flavor:'"Bio atualizada. Destaques organizados. Cliente impressionado."',
  },
  {
    key:'reuniao', icon:'📅', raridade:'incomum', ons:3,
    label:'O Grande Concílio',
    tipo:'Execução — Reunião',
    desc:'Reunião estratégica com o cliente',
    flavor:'"45 minutos de reunião. Decisão: fazer o que já estava planejado."',
  },
  {
    key:'criar_artes', icon:'🎨', raridade:'incomum', ons:3,
    label:'Forjador de Criativos',
    tipo:'Execução — Design',
    desc:'Artes para campanhas e redes sociais',
    flavor:'"Versão 1, 2, 3... O cliente aprova na 4. Sempre."',
  },
  {
    key:'roteiro', icon:'✍️', raridade:'incomum', ons:3,
    label:'O Escriba Digital',
    tipo:'Execução — Conteúdo',
    desc:'Roteiro para vídeos e conteúdos',
    flavor:'"Hook nos primeiros 3 segundos ou o algoritmo te pune."',
  },
  {
    key:'calendario_post', icon:'📆', raridade:'incomum', ons:3,
    label:'Arquiteto do Calendário',
    tipo:'Execução — Social Media',
    desc:'Planejamento mensal de conteúdo',
    flavor:'"O mês inteiro organizado num domingo. Isso é poder."',
  },
  {
    key:'pesquisa_merc', icon:'🔎', raridade:'incomum', ons:3,
    label:'O Espião do Mercado',
    tipo:'Execução — Estratégia',
    desc:'Análise de concorrência e mercado',
    flavor:'"Concorrente com CPL R$12. Nossa missão: R$9."',
  },
  {
    key:'rastreamento', icon:'🎯', raridade:'incomum', ons:3,
    label:'Instalador de Fantasmas',
    tipo:'Execução — Tráfego',
    desc:'Configurar pixels e eventos de conversão',
    flavor:'"Pixel instalado. Agora o Facebook sabe mais sobre o cliente do que ele mesmo."',
  },
  {
    key:'pipeline_crm', icon:'📈', raridade:'incomum', ons:3,
    label:'Anatomista do Funil',
    tipo:'Execução — CRM',
    desc:'Analisar funil e taxa de conversão',
    flavor:'"Onde o lead some? A resposta está sempre nos dados."',
  },

  // ── RARO ───────────────────────────────────────────────────────────────────
  {
    key:'setup_conta', icon:'⚙️', raridade:'raro', ons:5,
    label:'Ritual de Fundação',
    tipo:'Estratégia — Setup',
    desc:'Configuração completa de conta de anúncios',
    flavor:'"Sem base sólida, nem os deuses do ROAS te salvam."',
  },
  {
    key:'criar_campanha', icon:'📢', raridade:'raro', ons:5,
    label:'Invocador de Leads',
    tipo:'Estratégia — Tráfego Pago',
    desc:'Campanhas, públicos e criativos completos',
    flavor:'"Público certo, criativo certo, lance certo. Arte."',
  },
  {
    key:'treinamento', icon:'🎓', raridade:'raro', ons:5,
    label:'O Sensei Comercial',
    tipo:'Estratégia — Capacitação',
    desc:'Capacitar o cliente em atendimento e vendas',
    flavor:'"Leads chegando, cliente sem script. Missão aceita."',
  },
  {
    key:'captacao_video', icon:'🎥', raridade:'raro', ons:5,
    label:'Caçador de Cenas',
    tipo:'Estratégia — Produção',
    desc:'Gravação e produção audiovisual',
    flavor:'"Hook em 3 segundos. Câmera na mão, paciência no coração."',
  },
  {
    key:'edicao_video', icon:'🎬', raridade:'raro', ons:5,
    label:'Alquimista da Edição',
    tipo:'Estratégia — Produção',
    desc:'Edição e pós-produção completa',
    flavor:'"O corte certo transforma 3h de gravação em 30s de ouro."',
  },

  // ── ÉPICO ──────────────────────────────────────────────────────────────────
  {
    key:'lancamento', icon:'🚀', raridade:'epico', ons:8,
    label:'O Rito de Passagem',
    tipo:'Épico — Onboarding',
    desc:'Setup completo de novo cliente do zero',
    flavor:'"Do zero ao digital em 30 dias. Quem disse que não dá?"',
  },
  {
    key:'funil_completo', icon:'⚡', raridade:'epico', ons:8,
    label:'A Máquina Completa',
    tipo:'Épico — Full Funnel',
    desc:'LP + Campanha + Criativos + Rastreamento',
    flavor:'"Tráfego, landing, pixel, copy. Quando tudo encaixa, a conta chora de alegria."',
  },

  // ── LENDÁRIO ───────────────────────────────────────────────────────────────
  {
    key:'meta_atingida', icon:'👑', raridade:'lendario', ons:15,
    label:'O Feito dos Feitos',
    tipo:'Lendário — Performance',
    desc:'Cliente bate a meta de ROI do mês',
    flavor:'"ROAS acima da meta. Screenshot salvo. Print no grupo. Lenda."',
  },
  {
    key:'cliente_100k', icon:'💎', raridade:'lendario', ons:15,
    label:'Magnata do Tráfego',
    tipo:'Lendário — Carteira',
    desc:'Gestão de R$100k+ em anúncios ativos',
    flavor:'"R$100 mil rodando. Cada centavo tem um responsável aqui."',
  },
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

/* ── Copa do Mundo 2026 — evento limitado ─────────────────────────── */
const COPA_ATIVO = true // desativar após julho 2026

const COPA_FRASES = [
  'Agora o Hexa vem! 🇧🇷',
  'Joga junto, vence junto.',
  'Seleção TráfegOn — rumo ao topo.',
  'O campo é o mercado. A bola é a campanha.',
  'Time que entrega junto, levanta a taça junto.',
]

const COPA_CARD = {
  key: 'hexa_2026', icon: '🏆', raridade: 'lendario', ons: 26,
  label: 'O Hexa Digital',
  tipo: 'Edição Limitada — Copa 2026',
  desc: 'Conquiste com a Seleção TráfegOn.',
  flavor: '"Brasil, Hexacampeão. A TráfegOn, idem."',
  copa: true,
}

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
  const isCopa  = !!card.copa
  const rar     = isCopa
    ? { ...RARIDADES.lendario,
        cardBg:   'linear-gradient(160deg,#00521e,#009C3B,#006b28)',
        headerBg: 'linear-gradient(135deg,#FFDF00,#f5c400)',
        border:   '2px solid #FFDF00',
        glow:     '0 0 50px rgba(255,223,0,0.7), 0 0 100px rgba(0,156,59,0.3)',
        color:    '#FFDF00', textColor: '#FFDF00', dark: true, shine: true }
    : RARIDADES[card.raridade]
  const locked  = userOns < RARIDADES[card.raridade].minOns

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
          width: 160,
          height: 248,
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

        {/* Arte do card — área do ícone */}
        <div
          className="flex flex-col items-center justify-center relative overflow-hidden"
          style={{ height: 80, background: rar.headerBg, borderBottom: `1px solid ${rar.color}30` }}
        >
          {/* textura de fundo */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 30% 30%, ${rar.color}, transparent 60%)` }} />
          <span style={{ fontSize: 38, lineHeight:1, filter: rar.dark ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', position:'relative', zIndex:1 }}>
            {locked ? '🔒' : card.icon}
          </span>
        </div>

        {/* Linha de tipo — estilo TCG */}
        <div className="px-2.5 py-1" style={{ background: rar.color + '18', borderBottom: `1px solid ${rar.color}20` }}>
          <p className="text-[8px] font-bold tracking-wide truncate"
            style={{ color: rar.dark ? rar.color : rar.color, opacity: 0.85 }}>
            {locked ? '???' : (card.tipo || card.raridade.toUpperCase())}
          </p>
        </div>

        {/* Corpo */}
        <div className="px-2.5 pt-2 pb-2 flex flex-col" style={{ height: 'calc(100% - 80px - 22px)' }}>
          <p className="text-[11px] font-extrabold leading-tight mb-1"
            style={{ color: rar.dark ? rar.textColor : '#1a1d2e' }}>
            {locked ? '???' : card.label}
          </p>

          {/* Desc */}
          <p className="text-[8.5px] leading-snug mb-1.5"
            style={{ color: rar.dark ? 'rgba(255,255,255,0.5)' : '#8890b5' }}>
            {locked ? `Desbloqueie com ${rar.minOns} ons` : card.desc}
          </p>

          {/* Flavor text — em itálico, estilo TCG */}
          {!locked && card.flavor && (
            <p className="text-[7.5px] italic leading-snug flex-1 border-t pt-1.5 mt-auto"
              style={{ color: rar.dark ? 'rgba(255,255,255,0.35)' : '#b0b5cc', borderColor: rar.color + '25' }}>
              {card.flavor}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg"
              style={{ background: rar.color + '22', color: rar.color }}>
              +{card.ons} ons
            </span>
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

/* ── Avatares por rank (evoluem visualmente) ─────────────────────── */
const RANK_AURAS = {
  '🌱': { rings: 1, pulse: '#6eda2c', particles: false, crown: false },
  '⚡': { rings: 2, pulse: '#60a5fa', particles: false, crown: false },
  '🚀': { rings: 2, pulse: '#ea8a29', particles: true,  crown: false },
  '🏆': { rings: 3, pulse: '#6eda2c', particles: true,  crown: false },
  '👑': { rings: 3, pulse: '#f59e0b', particles: true,  crown: true  },
}

function AvatarEvolution({ user, rank }) {
  const aura = RANK_AURAS[rank.icon] || RANK_AURAS['🌱']
  const Svg  = getAvatarComponent(user?.email) || getAvatarComponent(user?.id)

  return (
    <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
      {/* Anéis de aura — crescem com o rank */}
      {Array.from({ length: aura.rings }).map((_, i) => (
        <motion.div key={i}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `${i === 0 ? 2.5 : 1.5}px solid ${rank.color}${i === 0 ? 'cc' : '44'}` }}
          animate={{ scale: [1, 1.06 + i * 0.04, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Partículas — Velocista+ */}
      {aura.particles && Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: 3, height: 3, background: rank.color,
                   left: `${15 + i * 18}%`, bottom: '8%' }}
          animate={{ y: [0, -35, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.6 + i * 0.25, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Corona — Elite */}
      {aura.crown && (
        <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl pointer-events-none z-20"
          animate={{ y: [0, -3, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          👑
        </motion.div>
      )}

      {/* Avatar principal */}
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden relative z-10"
        style={{
          border: COPA_ATIVO ? '3px solid #009C3B' : `3px solid ${rank.color}`,
          boxShadow: COPA_ATIVO
            ? '0 0 20px #009C3B55, 0 0 40px #FFDF0030'
            : `0 0 28px ${rank.color}55`,
        }}
        animate={{ boxShadow: COPA_ATIVO
          ? ['0 0 16px #009C3B40, 0 0 32px #FFDF0020', '0 0 32px #009C3B80, 0 0 56px #FFDF0050', '0 0 16px #009C3B40, 0 0 32px #FFDF0020']
          : [`0 0 20px ${rank.color}40`, `0 0 45px ${rank.color}80`, `0 0 20px ${rank.color}40`]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {Svg
          ? <div className="w-full h-full"><Svg /></div>
          : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
              style={{ background: `linear-gradient(135deg,${rank.color}33,${rank.color}11)` }}>
              {(user?.name || '?')[0]}
            </div>
        }
        {/* Faixa verde-amarela Copa — estilo camiseta Brasil */}
        {COPA_ATIVO && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
              background: 'linear-gradient(180deg, transparent, rgba(0,156,59,0.55))',
            }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
              background: 'linear-gradient(90deg, #009C3B, #FFDF00, #009C3B)',
              opacity: 0.9,
            }} />
          </div>
        )}
        {/* Overlay brilho no topo */}
        <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none rounded-t-xl"
          style={{ background: `linear-gradient(180deg,${COPA_ATIVO ? '#FFDF0020' : rank.color + '25'},transparent)` }} />
      </motion.div>

      {/* Badge 🇧🇷 Copa */}
      {COPA_ATIVO && (
        <motion.div
          className="absolute top-0 right-0 z-30 text-base leading-none"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🇧🇷
        </motion.div>
      )}

      {/* Estrelas abaixo do avatar — estilo escudo de clube */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
        {Array.from({ length: 5 }).map((_, i) => {
          const rankIdx = RANKS.findIndex(r => r.icon === rank.icon)
          const filled  = i <= rankIdx
          return (
            <motion.span key={i}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
              style={{
                fontSize: filled ? 13 : 11,
                color: filled ? rank.color : 'rgba(255,255,255,0.12)',
                filter: filled ? `drop-shadow(0 0 5px ${rank.color}cc)` : 'none',
                lineHeight: 1,
              }}>
              ★
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Skill Bar estilo FreeFire ───────────────────────────────────── */
function SkillBar({ userOns }) {
  const SLOTS = 8
  const unlocked = ARSENAL
    .filter(c => userOns >= RARIDADES[c.raridade].minOns)
    .sort((a, b) => RARIDADES[b.raridade].stars - RARIDADES[a.raridade].stars)
  const slots = Array.from({ length: SLOTS }, (_, i) => unlocked[i] || null)

  return (
    <div className="mt-7 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-[9px] font-extrabold tracking-widest uppercase mb-2.5"
        style={{ color: 'rgba(255,255,255,0.25)' }}>Skills desbloqueadas</p>
      <div className="flex gap-2 flex-wrap">
        {slots.map((card, i) => {
          const rar = card ? RARIDADES[card.raridade] : null
          return (
            <motion.div key={i}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 280 }}
              title={card ? `${card.label} — ${rar.label}` : 'Bloqueado'}
              className="relative flex flex-col items-center gap-1"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: card ? rar.cardBg : 'rgba(255,255,255,0.04)',
                  border: card ? `1.5px solid ${rar.color}55` : '1.5px solid rgba(255,255,255,0.07)',
                  boxShadow: card ? `0 0 10px ${rar.color}30` : 'none',
                }}
              >
                {card && rar.shine && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.2) 50%,transparent 70%)' }}
                    animate={{ x: ['-120%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                )}
                {card
                  ? <span style={{ fontSize: 20 }}>{card.icon}</span>
                  : <Lock size={12} style={{ color: 'rgba(255,255,255,0.15)' }} />
                }
              </div>
              {/* Pip de raridade */}
              {card && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: rar.color, boxShadow: `0 0 4px ${rar.color}` }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Player Hero ─────────────────────────────────────────────────── */
function PlayerHero({ user, userOns, totalTasks }) {
  const rank = getRank(userOns)

  return (
    <motion.div
      initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: 'linear-gradient(135deg,#0a0c14 0%,#111420 40%,#0d0f1c 100%)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 24px 70px rgba(0,0,0,0.6), 0 0 100px ${rank.color}12`,
        border: `1px solid ${rank.color}20`,
      }}
    >
      {/* Glow fundo radial */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 15% 40%, ${rank.color}10 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 85% 60%, ${rank.color}07 0%, transparent 50%)` }} />

      {/* Linha superior: avatar + info + stats */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">

        {/* Avatar com aura e estrelas */}
        <div className="pb-6 flex-shrink-0">
          <AvatarEvolution user={user} rank={rank} />
        </div>

        {/* Info central */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-1">
            <h2 className="text-xl font-black text-white">{user?.name || 'Jogador'}</h2>
          </div>

          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {user?.role || 'Colaborador'} · {totalTasks} tarefas concluídas
          </p>

          {/* Ons + barra de progresso */}
          <div className="flex items-end gap-4 flex-wrap justify-center sm:justify-start">
            <div>
              <p className="text-4xl font-black leading-none"
                style={{ color: rank.color, textShadow: `0 0 30px ${rank.color}70` }}>
                {userOns}
                <span className="text-lg font-bold ml-1.5" style={{ color: rank.color + '99' }}>ons</span>
              </p>
              {rank.next && (
                <p className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {rank.next.min - userOns} ons para {rank.next.icon} {rank.next.label}
                </p>
              )}
            </div>

            <div className="flex-1 min-w-[160px]">
              <div className="flex justify-between text-[9px] font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                <span>{rank.icon}</span><span>{rank.pct}%</span>
                {rank.next && <span>{rank.next.icon}</span>}
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background: `linear-gradient(90deg,${rank.color}bb,${rank.color})` }}
                  initial={{ width: 0 }} animate={{ width: `${rank.pct}%` }}
                  transition={{ duration: 1.4, ease: [0.22,1,0.36,1] }}>
                  <motion.div className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg,transparent 30%,rgba(255,255,255,0.35) 55%,transparent 80%)' }}
                    animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.2, repeat: Infinity }} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats laterais */}
        <div className="flex sm:flex-col gap-2 flex-shrink-0">
          {[
            { label: 'Nível',   value: rank.icon, color: rank.color },
            { label: 'Ons',     value: userOns,                       color: '#fff' },
            { label: 'Tarefas', value: totalTasks,                    color: '#6eda2c' },
          ].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl min-w-[64px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skill bar abaixo — estilo FreeFire */}
      <div className="relative z-10">
        <SkillBar userOns={userOns} />
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   ARENA — PÁGINA PRINCIPAL
══════════════════════════════════════════════════ */
function getTimeLeft() {
  const diff = Math.max(0, new Date('2026-07-31T23:59:59').getTime() - Date.now())
  return {
    dias:  Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    min:   Math.floor((diff % 3600000) / 60000),
  }
}

function BannerCopa({ userOns, topPlayers, timeLeft }) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6"
      style={{
        background: 'linear-gradient(135deg,#04180a 0%,#063314 30%,#0a4a1f 55%,#063314 80%,#04180a 100%)',
        border: '1px solid rgba(255,223,0,0.35)',
        boxShadow: '0 8px 40px rgba(0,156,59,0.45), 0 0 0 1px rgba(255,223,0,0.15)',
        minHeight: 190,
      }}>

      {/* Bokeh lights */}
      {[
        {top:'10%',left:'8%',w:90,op:0.12},
        {top:'60%',left:'18%',w:55,op:0.08},
        {top:'20%',left:'55%',w:120,op:0.1},
        {top:'65%',right:'10%',w:70,op:0.09},
        {top:'5%',right:'25%',w:50,op:0.07},
      ].map((b,i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ ...b, height:b.w, background:'#FFDF00', filter:'blur(22px)', opacity:b.op }} />
      ))}

      {/* Listras campo */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity:0.04 }}>
        {Array.from({length:10}).map((_,i) => (
          <div key={i} style={{
            position:'absolute', top:'-50%', left:`${i*11-5}%`,
            width:'6%', height:'200%',
            background:'#fff', transform:'rotate(8deg)',
          }} />
        ))}
      </div>

      <div className="relative z-10 p-5 lg:p-7 flex flex-col lg:flex-row gap-6">

        {/* Esquerda: título + countdown */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <motion.span style={{ fontSize:42, lineHeight:1, filter:'drop-shadow(0 0 12px rgba(255,223,0,0.8))' }}
              animate={{ rotate:[0,360], y:[0,-4,0] }}
              transition={{ rotate:{duration:4,repeat:Infinity,ease:'linear'}, y:{duration:1.2,repeat:Infinity,ease:'easeInOut'} }}>
              ⚽
            </motion.span>
            <div>
              <motion.p style={{ fontSize:22, fontWeight:900, color:'#FFDF00', lineHeight:1, letterSpacing:'-0.01em',
                textShadow:'0 0 20px rgba(255,223,0,0.6)' }}
                animate={{ textShadow:['0 0 16px rgba(255,223,0,0.4)','0 0 28px rgba(255,223,0,0.8)','0 0 16px rgba(255,223,0,0.4)'] }}
                transition={{ duration:2.5, repeat:Infinity }}>
                COPA TRÁFEGON 2026
              </motion.p>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:'0.08em', marginTop:3 }}>
                🇧🇷 SELEÇÃO EM CAMPO · JOGA JUNTO VENCE JUNTO
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', marginRight:4 }}>
              ENCERRA EM
            </p>
            {[
              { v: timeLeft.dias,  l: 'DIAS' },
              { v: timeLeft.horas, l: 'HRS'  },
              { v: timeLeft.min,   l: 'MIN'  },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center"
                style={{ background:'rgba(255,223,0,0.12)', border:'1px solid rgba(255,223,0,0.25)',
                  borderRadius:8, padding:'4px 10px', minWidth:44 }}>
                <span style={{ fontSize:20, fontWeight:900, color:'#FFDF00', lineHeight:1,
                  textShadow:'0 0 12px rgba(255,223,0,0.5)' }}>
                  {String(v).padStart(2,'0')}
                </span>
                <span style={{ fontSize:7, fontWeight:800, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em' }}>
                  {l}
                </span>
              </div>
            ))}
            <div style={{ marginLeft:8, padding:'3px 10px', borderRadius:20,
              background:'linear-gradient(90deg,#009C3B,#00c44a)', fontSize:8, fontWeight:900,
              color:'#fff', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>
              ★ EVENTO LIMITADO
            </div>
          </div>
        </div>

        {/* Direita: top jogadores */}
        {topPlayers.length > 0 && (
          <div style={{ background:'rgba(0,0,0,0.35)', borderRadius:14,
            border:'1px solid rgba(255,223,0,0.18)', padding:'12px 16px',
            minWidth:190, flexShrink:0 }}>
            <p style={{ fontSize:8, fontWeight:900, color:'rgba(255,223,0,0.7)',
              letterSpacing:'0.12em', marginBottom:10, textAlign:'center' }}>
              ⚡ TOP JOGADORES ⚡
            </p>
            {topPlayers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2" style={{ marginBottom: i < topPlayers.length-1 ? 8 : 0 }}>
                <span style={{ fontSize:14, width:20, flexShrink:0, textAlign:'center' }}>
                  {['🥇','🥈','🥉'][i]}
                </span>
                <div style={{ width:22, height:22, borderRadius:8, overflow:'hidden',
                  background:p.color, flexShrink:0, fontSize:9, fontWeight:800,
                  color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {p.avatar}
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:'#fff', flex:1, minWidth:0,
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {p.name.split(' ')[0]}
                </span>
                <span style={{ fontSize:10, fontWeight:900, color:'#FFDF00', flexShrink:0 }}>
                  {p.ons}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Arena() {
  const { tasks, collaborators } = useData()

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2')) } catch { return null }
  }, [])

  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 30000)
    return () => clearInterval(id)
  }, [])

  const userOns = useMemo(() =>
    tasks
      .filter(t => t.assignee === user?.id && t.status === 'done')
      .reduce((sum, t) => sum + (taskTypes[t.type]?.ons ?? 1), 0)
  , [tasks, user])

  const totalTasks = useMemo(() =>
    tasks.filter(t => t.assignee === user?.id && t.status === 'done').length
  , [tasks, user])

  const topPlayers = useMemo(() =>
    [...(collaborators || [])].map(c => ({
      ...c,
      ons: tasks.filter(t => t.assignee === c.id && t.status === 'done')
               .reduce((s, t) => s + (taskTypes[t.type]?.ons ?? 1), 0),
    })).sort((a,b) => b.ons - a.ons).slice(0,3),
    [tasks, collaborators]
  )

  const trilhaSalva = localStorage.getItem('arena_trilha') || 'trafego'
  const [trilhaSel, setTrilhaSel] = useState(trilhaSalva)
  const [filtro, setFiltro]       = useState('todos')

  function selectTrilha(key) {
    setTrilhaSel(key)
    localStorage.setItem('arena_trilha', key)
  }

  const arsenalBase = COPA_ATIVO ? [COPA_CARD, ...ARSENAL] : ARSENAL
  const arsenalFiltrado = useMemo(() =>
    arsenalBase.filter(c => filtro === 'todos' || c.raridade === filtro)
  , [filtro, arsenalBase])

  return (
    <div className="p-4 lg:p-8 min-h-screen" style={{ background:'#f4f6fd' }}>

      {/* ── Banner Copa 2026 ── */}
      {COPA_ATIVO && <BannerCopa userOns={userOns} topPlayers={topPlayers} timeLeft={timeLeft} />}

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#1a1d2e,#2d3154)' }}>
          <Sword size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-text">Arena</h1>
          <p className="text-xs text-muted">
            {COPA_ATIVO ? '🇧🇷 Seleção TráfegOn — rumo ao Hexa' : 'Sua jornada de evolução na TráfegOn'}
          </p>
        </div>
      </motion.div>

      {/* ── Player Hero ── */}
      <div className="mb-6">
        <PlayerHero user={user} userOns={userOns} totalTasks={totalTasks} />
      </div>

      {/* ── Cartas Colecionáveis Copa 2026 ── */}
      {COPA_ATIVO && <CartasCopaSection userOns={userOns} userId={user?.id} />}

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
