import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, Eye, Star, ArrowRight, BarChart2, FolderOpen, Users2, BookOpen, MessageCircle } from 'lucide-react'
import { getAllUsers } from '../data/users-store'
import UserAvatar from '../components/UserAvatar'

const VALORES = [
  { n: '01', text: 'Somos inconformados e ambiciosos' },
  { n: '02', text: 'Alto grau de alinhamento, e alto grau de autonomia' },
  { n: '03', text: 'Verdade nua e crua, doa a quem doer' },
  { n: '04', text: 'Somos obsessivos pelo sucesso e experiência do cliente' },
  { n: '05', text: 'Corremos riscos' },
  { n: '06', text: 'Acreditamos no mérito' },
  { n: '07', text: 'Fazemos mais que o combinado' },
  { n: '08', text: 'Somos adultos, nem tudo será divertido' },
]

const ATALHOS = [
  { to: '/pipeline',   icon: BarChart2,     label: 'Pipeline',    desc: 'Leads e oportunidades',   color: '#6eda2c' },
  { to: '/workspaces', icon: FolderOpen,    label: 'Workspaces',  desc: 'Projetos e entregas',      color: '#60a5fa' },
  { to: '/equipe',     icon: Users2,        label: 'Equipe',      desc: 'Desempenho e ranking',     color: '#be29ec' },
  { to: '/playbooks',  icon: BookOpen,      label: 'Playbooks',   desc: 'POPs e processos',         color: '#ea8a29' },
  { to: '/whatsapp',   icon: MessageCircle, label: 'WhatsApp',    desc: 'Conexões dos clientes',    color: '#25D366' },
]

export default function Home({ user }) {
  const navigate = useNavigate()
  const allUsers = getAllUsers()
  const team     = allUsers.filter(u => u.role !== 'cliente')
  const clients  = allUsers.filter(u => u.role === 'cliente')

  return (
    <div className="space-y-8 pb-8">

      {/* ── Hero banner ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #12141e 0%, #1a1d2e 100%)', minHeight: 200 }}
      >
        {/* glows */}
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(110,218,44,0.12) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-40px] right-[10%] w-[240px] h-[240px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(190,41,236,0.10) 0%, transparent 65%)' }} />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6eda2c,#4ab81e)' }}>
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">TráfegOn Suite</span>
          </div>

          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(110,218,44,0.7)' }}>
            Propósito
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3 max-w-2xl">
            Acelerar negócios &{' '}
            <span style={{ background: 'linear-gradient(90deg,#6eda2c,#be29ec)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              impulsionar o empreendedorismo.
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {team.length} membros ativos
            </div>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {clients.length} clientes
            </div>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(110,218,44,0.15)', color: '#6eda2c', border: '1px solid rgba(110,218,44,0.25)' }}>
              🟢 Sistema online
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Visão + Atalhos row ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Visão card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 flex flex-col justify-between"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.15)' }}>
                <Eye size={16} style={{ color: '#60a5fa' }} />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted">Visão</span>
            </div>
            <p className="text-lg font-bold text-text leading-snug">
              Nos tornar um grande sistema de marketing, oportuno, complexo e que gere valor a todos.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[11px] font-bold text-muted">
            <Target size={12} />
            <span>Norte estratégico da agência</span>
          </div>
        </motion.div>

        {/* Atalhos */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ATALHOS.map(({ to, icon: Icon, label, desc, color }, i) => (
            <motion.button
              key={to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl p-4 text-left group flex flex-col gap-3"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: color + '18' }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{label}</p>
                <p className="text-[11px] text-muted mt-0.5">{desc}</p>
              </div>
              <ArrowRight size={13} className="text-muted group-hover:text-text transition-colors mt-auto" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Valores ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
      >
        {/* header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,138,41,0.15)' }}>
              <Star size={17} style={{ color: '#ea8a29' }} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text">Valores da Agência</h2>
              <p className="text-xs text-muted mt-0.5">Os princípios que guiam cada decisão</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {VALORES.map((v, i) => (
            <motion.div
              key={v.n}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="p-5 group hover:bg-surface transition-colors"
              style={{ borderRight: i % 4 !== 3 ? '1px solid #edf0f7' : 'none', borderBottom: i < 4 ? '1px solid #edf0f7' : 'none' }}
            >
              <p className="text-[10px] font-extrabold tracking-widest mb-2" style={{ color: '#6eda2c' }}>{v.n}</p>
              <p className="text-sm font-semibold text-text leading-snug">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Boas-vindas personalizada ─────────────── */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(110,218,44,0.08)', border: '1px solid rgba(110,218,44,0.18)' }}
        >
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={36} />
            <div>
              <p className="text-sm font-bold text-text">Olá, {user.name.split(' ')[0]} 👋</p>
              <p className="text-xs text-muted">Vamos construir algo incrível hoje?</p>
            </div>
          </div>
          <button onClick={() => navigate('/pipeline')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            Ver Pipeline <ArrowRight size={13} />
          </button>
        </motion.div>
      )}
    </div>
  )
}
