import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

// ── PALETTE ────────────────────────────────────────────────────────────────────
const G      = '#6eda2c'
const DARK   = '#1a1d2e'
const PUR    = '#7c3aed'
const ORANGE = '#f97316'
const RED    = '#f87171'
const GOLD   = '#f59e0b'
const NAVY   = '#0f2044'
const BLUE   = '#3b82f6'

// ── SHARED UTILS ───────────────────────────────────────────────────────────────
const variants = {
  enter:  d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.96 }),
}

function Slideshow({ slides, accentColor = G, fsDefault = false, modeOptions = null }) {
  const [cur,  setCur]  = useState(0)
  const [dir,  setDir]  = useState(1)
  const [mode, setMode] = useState(modeOptions ? modeOptions[0].value : null)
  const [fs,   setFs]   = useState(fsDefault)

  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(-1)
      if (e.key === 'Escape') setFs(false)
      if (e.key === 'f' || e.key === 'F') setFs(v => !v)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [cur])

  const go = delta => {
    const n = cur + delta
    if (n < 0 || n >= slides.length) return
    setDir(delta)
    setCur(n)
  }

  const progress = ((cur + 1) / slides.length) * 100
  const { C: Slide } = slides[cur]

  return (
    <div className={fs ? 'fixed inset-0 z-[300] flex flex-col p-4' : ''}
      style={fs ? { background: '#0a0b12' } : {}}>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-shrink-0">
        {modeOptions ? (
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#1e2035' }}>
            {modeOptions.map(({ value, label }) => (
              <button key={value} onClick={() => setMode(value)}
                className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{ background: mode === value ? accentColor : 'transparent', color: mode === value ? 'white' : '#8890b5' }}>
                {label}
              </button>
            ))}
          </div>
        ) : <div />}
        <span className="text-sm font-mono text-white/25 tabular-nums">{cur + 1} / {slides.length}</span>
        <button onClick={() => setFs(v => !v)}
          className="p-2 rounded-xl transition-colors hover:text-white text-white/35"
          style={{ background: '#1e2035' }}>
          {fs ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-3 overflow-hidden flex-shrink-0" style={{ background: '#1e2035' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}80` }} />
      </div>

      {/* Slide area */}
      <div className="relative rounded-2xl overflow-hidden flex-1"
        style={{ aspectRatio: fs ? undefined : '16 / 9' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`${cur}-${mode}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0">
            <Slide mode={mode} />
          </motion.div>
        </AnimatePresence>

        {cur > 0 && (
          <button onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft className="text-white" size={20} />
          </button>
        )}
        {cur < slides.length - 1 && (
          <button onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight className="text-white" size={20} />
          </button>
        )}
      </div>

      {/* Dot nav */}
      <div className="flex gap-2 justify-center mt-3 flex-shrink-0 flex-wrap">
        {slides.map((s, i) => (
          <button key={s.id} title={s.label}
            onClick={() => { setDir(i > cur ? 1 : -1); setCur(i) }}
            className="rounded-full transition-all duration-300"
            style={{
              height: 8,
              width: i === cur ? 32 : 8,
              background: i === cur ? accentColor : '#1e2035',
              boxShadow: i === cur ? `0 0 8px ${accentColor}80` : 'none',
            }} />
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   DESTRAVA DIGITAL
// ══════════════════════════════════════════════════════════════════════════════

const PLANS = [
  {
    name: 'Ativação',
    sub: 'Para começar do jeito certo',
    color: ORANGE,
    price10: '197', priceAV: '1.870',
    deliveries: [
      { icon: '🤝', text: 'Reunião inicial de projeto' },
      { icon: '📡', text: 'Campanhas de tráfego (1 canal)' },
      { icon: '🎓', text: 'Consultoria estratégica — 2h gravada' },
      { icon: '🎬', text: 'Mini aulas de Google e Meta Ads' },
      { icon: '💬', text: 'Suporte WhatsApp — 15 dias' },
    ],
    forEmpresas:  ['Empresas iniciando no digital', 'Primeiro contato com tráfego', 'Validação de demanda'],
    forAdvocacia: ['Advogado autônomo iniciando',   'Primeiro contato com tráfego', 'Validação de demanda'],
  },
  {
    name: 'Estruturação',
    sub: 'Estrutura + ativação com previsibilidade',
    color: G,
    price10: '349', priceAV: '3.370',
    best: true,
    deliveries: [
      { icon: '🤝', text: 'Reunião inicial de projeto' },
      { icon: '📡', text: 'Campanhas em 2 canais' },
      { icon: '🖥️', text: '1 Landing Page de conversão' },
      { icon: '📍', text: 'Google Meu Negócio otimizado' },
      { icon: '📱', text: 'Instagram e Facebook organizados' },
      { icon: '🎓', text: 'Consultoria — 4h em 2 encontros' },
      { icon: '📚', text: 'Mini curso Google e Meta Ads' },
      { icon: '💬', text: 'Suporte WhatsApp — 30 dias' },
    ],
    forEmpresas:  ['Empresas que querem previsibilidade', 'Estrutura mínima profissional'],
    forAdvocacia: ['Advogados que querem previsibilidade', 'Estrutura mínima profissional'],
  },
  {
    name: 'Aceleração',
    sub: 'Presença completa + base para escalar',
    color: PUR,
    price10: '519', priceAV: '4.970',
    deliveries: [
      { icon: '✅', text: 'Tudo do Estruturação' },
      { icon: '🌐', text: 'Site institucional (3 páginas)' },
      { icon: '🎨', text: 'Identidade visual' },
      { icon: '🏆', text: 'Treinamento de vendas — 1h30' },
    ],
    forEmpresas:  ['Empresas em crescimento', 'Profissionalizar a operação completa'],
    forAdvocacia: ['Escritórios em crescimento', 'Advogados que querem profissionalizar'],
  },
]

const REVIEWS = [
  { name: 'Polizio Advogados',         av: 'P', color: PUR,      time: '16 semanas', text: 'Excelente empresa, vem nos ajudando muito a conseguir mais clientes na internet. Recomendo!' },
  { name: 'Andrade Ferrari Advogados', av: 'A', color: ORANGE,   time: '42 semanas', text: 'Profissionalismo e dedicação foram fundamentais para otimizar nossa presença digital e expandir o alcance dos nossos serviços.' },
  { name: 'Isabel Costa da Cunha',     av: 'I', color: G,        time: '10 semanas', text: 'Tráfego é uma agência maravilhosa! Ótimo atendimento, agilidade nos serviços. Super recomendo!' },
  { name: 'Samea Kurdi',               av: 'S', color: '#60a5fa', time: '9 meses',   text: 'Uma empresa que conseguiu entender todas as minhas dificuldades no meio digital e trouxe soluções práticas com todo o suporte que eu necessitava.' },
]

function DSlideCover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 55%, #90ef3c 100%)` }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 160 + i * 90, height: 160 + i * 90, border: '1.5px solid rgba(255,255,255,0.15)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="font-black text-white leading-none mb-5"
          style={{ fontSize: '5.5rem', letterSpacing: '-5px', textShadow: '0 6px 32px rgba(0,0,0,0.18)' }}
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          tráfegon
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="inline-block px-8 py-3 rounded-full font-bold text-white text-xl shadow-2xl"
          style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.28)' }}>
          Gerando negócios para o seu negócio.
        </motion.div>
      </motion.div>
    </div>
  )
}

function DSlideDor() {
  return (
    <div className="h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.div className="max-w-3xl w-full px-8"
        initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl relative">
          <div className="absolute -bottom-8 left-16 w-0 h-0"
            style={{ borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '32px solid white' }} />
          <p className="text-4xl font-black text-gray-900 leading-tight text-center">
            "Eu sei que preciso ir para o{' '}
            <span className="text-white rounded-lg px-3 py-1" style={{ background: PUR }}>digital,</span>
            {' '}só não sei por onde começar"
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function DSlideDiagnostico({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'empresa'
  const problems = [
    { icon: '🌐', color: ORANGE, label: 'Site inexistente ou amador' },
    { icon: '📱', color: G,      label: 'Redes sociais sem estratégia' },
    { icon: '🚀', color: PUR,   label: 'Sem tráfego pago' },
  ]
  const models = [
    { icon: '💡', color: G,      title: 'Agência',    sub: 'Mensalidade alta' },
    { icon: '📚', color: PUR,   title: 'Curso',      sub: 'Teoria sem execução' },
    { icon: '👤', color: ORANGE, title: 'Freelancer', sub: 'Entrega inconsistente' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-6" style={{ background: DARK }}>
      <motion.h2 className="text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Por que seu {word} ainda não decolou
      </motion.h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3">Cenário atual</p>
          <div className="space-y-3">
            {problems.map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 rounded-xl p-4" style={{ background: '#1e2035' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: p.color }}>
                  {p.icon}
                </div>
                <span className="text-white/70 font-medium text-sm">{p.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3">O que você já tentou</p>
          <div className="space-y-3">
            {models.map((m, i) => (
              <motion.div key={m.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.15 }}
                className="flex items-center gap-4 rounded-xl p-4" style={{ background: '#1e2035' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: m.color + '18', border: `1.5px solid ${m.color}40` }}>
                  {m.icon}
                </div>
                <div>
                  <div className="font-black text-sm" style={{ color: m.color }}>{m.title}</div>
                  <div className="text-white/35 text-xs">{m.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center rounded-full py-3 px-8 mx-auto text-white/50 text-sm self-center"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        O problema não é vontade. É o modelo.
      </motion.p>
    </div>
  )
}

function DSlideImplicacao() {
  const items = [
    { icon: '📉', color: RED,      title: 'Leads indo pro concorrente',    desc: 'Cada busca no Google que você não aparece é um lead que seu concorrente fecha.', delay: 0 },
    { icon: '💸', color: ORANGE,   title: 'Dinheiro no modelo errado',     desc: 'Agência, curso ou freelancer sem método = investimento sem retorno acumulado.',  delay: 0.14 },
    { icon: '⏳', color: '#facc15', title: 'Tempo trabalhando contra você', desc: 'Quem entra no digital depois leva anos para recuperar a posição perdida.',     delay: 0.28 },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: '#0f1018' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white">O custo de não resolver</h2>
        <p className="text-white/35 mt-2 text-base">Cada dia sem presença digital tem um preço.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {items.map(it => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: it.delay, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: it.color + '0d', border: `1px solid ${it.color}28` }}>
            <div className="text-3xl">{it.icon}</div>
            <div className="font-black text-lg text-white leading-snug">{it.title}</div>
            <div className="text-white/45 text-sm leading-relaxed">{it.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-xl py-4 px-8 mx-auto text-center self-center"
        style={{ background: RED + '12', border: `1px solid ${RED}28` }}>
        <p className="text-white/60 font-medium text-sm">
          Enquanto você espera o momento certo,{' '}
          <span className="text-white font-black">seu concorrente já está lá.</span>
        </p>
      </motion.div>
    </div>
  )
}

function DSlideVirada({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'empresa'
  const befores = [
    { icon: '🔍', text: 'Invisível no Google' },
    { icon: '🦗', text: 'Zero leads online' },
    { icon: '🎲', text: 'Improviso no digital' },
    { icon: '😰', text: 'Dependente de indicação' },
  ]
  const afters = [
    { icon: '📈', text: 'Aparece nas primeiras posições' },
    { icon: '📩', text: 'Leads chegando todo dia' },
    { icon: '🎯', text: 'Método e rastreamento' },
    { icon: '⚡', text: 'Autonomia para crescer' },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.h2 className="text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        O que muda para o seu {word}
      </motion.h2>
      <div className="grid grid-cols-2 gap-5">
        <motion.div className="rounded-2xl p-6 flex flex-col gap-4"
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="text-[11px] font-black text-white/30 uppercase tracking-widest">Antes</div>
          {befores.map(b => (
            <div key={b.text} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center opacity-50">{b.icon}</span>
              <span className="text-white/35 text-sm line-through">{b.text}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="rounded-2xl p-6 flex flex-col gap-4"
          initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(0,0,0,0.2)', border: '1.5px solid rgba(255,255,255,0.28)' }}>
          <div className="text-[11px] font-black text-white/80 uppercase tracking-widest">Depois</div>
          {afters.map(a => (
            <div key={a.text} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{a.icon}</span>
              <span className="text-white font-semibold text-sm">{a.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function DSlideFeedbacks() {
  return (
    <div className="h-full flex flex-col p-8 gap-5" style={{ background: '#f8fafc' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-gray-900">Quem já destravou</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
          <span className="font-black text-gray-600 text-sm">G</span>
          <span className="text-yellow-400 tracking-tight">★★★★★</span>
          <span className="text-sm font-semibold text-gray-500">Google</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {REVIEWS.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: r.color }}>
                {r.av}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{r.name}</div>
                <div className="text-xs">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-gray-400"> · {r.time}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DSlideProduto({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'empresa'
  const nodes = [
    { icon: '⚙️', label: 'Estratégia',        x: '50%', y: '12%', delay: 0.1 },
    { icon: '📱', label: 'Ambientes Digitais', x: '20%', y: '70%', delay: 0.2 },
    { icon: '📡', label: 'Tráfego Pago',       x: '80%', y: '70%', delay: 0.3 },
  ]
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-1">🔓</div>
        <h2 className="text-5xl font-black text-white">Destrava Digital</h2>
        <p className="text-xl text-white/75 font-medium mt-1">Seu {word} no digital em até 30 dias.</p>
      </motion.div>
      <div className="relative" style={{ width: 300, height: 200 }}>
        {nodes.map(n => (
          <motion.div key={n.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: n.delay, type: 'spring', stiffness: 200 }}
            className="absolute flex flex-col items-center gap-2"
            style={{ left: n.x, top: n.y, transform: 'translate(-50%, -50%)' }}>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/45 flex items-center justify-center text-2xl"
              style={{ background: 'rgba(0,0,0,0.18)' }}>
              {n.icon}
            </div>
            <span className="text-white font-bold text-xs text-center whitespace-nowrap">{n.label}</span>
          </motion.div>
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
          className="absolute rounded-full"
          style={{ width: 20, height: 20, background: 'white', left: '50%', top: '48%', transform: 'translate(-50%,-50%)', boxShadow: `0 0 24px ${G}, 0 0 8px white` }} />
      </div>
    </div>
  )
}

function DSlidePlanos({ mode }) {
  return (
    <div className="h-full flex flex-col p-6 justify-center gap-3" style={{ background: DARK }}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-white flex-shrink-0">Planos Destrava Digital</h2>
        <div className="text-xs text-white/30 border border-white/10 rounded-full px-4 py-1.5 flex-shrink-0">
          Avulso custaria{' '}
          <span className="text-white/50 line-through font-bold">R$ 15.500</span>
          {' '}· Destrava a partir de{' '}
          <span className="font-black" style={{ color: G }}>10x R$ 197</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {PLANS.map((plan, pi) => (
          <motion.div key={plan.name} initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: pi * 0.12, type: 'spring', stiffness: 180 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            {plan.best && (
              <div className="py-1.5 text-center text-xs font-black text-white tracking-wider" style={{ background: plan.color }}>
                ⭐ MAIS VENDIDO
              </div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="rounded-xl p-3 text-center"
                style={{ background: plan.color + '18', border: `1.5px solid ${plan.color}40` }}>
                <div className="text-lg font-black" style={{ color: plan.color }}>{plan.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{plan.sub}</div>
              </div>
              <div className="text-center py-1">
                <span className="text-2xl font-black text-white">10x R$ {plan.price10}</span>
                <div className="text-white/25 text-xs">ou R$ {plan.priceAV} à vista</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {plan.deliveries.map(d => (
                  <div key={d.text} className="flex items-center gap-2">
                    <span className="text-sm flex-shrink-0 w-5 text-center">{d.icon}</span>
                    <span className="text-xs text-white/65">{d.text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 space-y-1" style={{ borderTop: `1px solid ${plan.color}22` }}>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Indicado para</div>
                {(mode === 'advocacia' ? plan.forAdvocacia : plan.forEmpresas).map(f => (
                  <div key={f} className="text-xs" style={{ color: plan.color + 'bb' }}>→ {f}</div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DSlideComparacao() {
  const rows = [
    ['Serviços soltos',  'Método fechado'],
    ['Sem sequência',    'Processo validado'],
    ['Sem suporte',      'Acompanhamento'],
    ['Improviso',        'Execução orientada'],
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Comparação final
      </motion.h2>
      <motion.div className="max-w-2xl w-full mx-auto rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-2">
          <div className="p-5 text-center font-black text-white/55 text-lg" style={{ background: 'rgba(0,0,0,0.42)' }}>Avulso</div>
          <div className="p-5 text-center font-black text-white text-lg" style={{ background: PUR }}>Método Destrava</div>
        </div>
        <div className="grid grid-cols-2" style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="p-5 text-center border-r border-white/10">
            <div className="text-3xl font-black text-white/35 line-through">R$ 15.500</div>
          </div>
          <div className="p-5 text-center">
            <div className="text-xl font-bold text-white/65">A partir de</div>
            <div className="text-3xl font-black" style={{ color: G, textShadow: `0 0 20px ${G}90` }}>10x R$ 197</div>
          </div>
        </div>
        {rows.map(([bad, good], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
            className="grid grid-cols-2 border-t border-white/[0.08]" style={{ background: 'rgba(0,0,0,0.16)' }}>
            <div className="p-3 text-center text-white/30 text-sm border-r border-white/[0.08]">✕ {bad}</div>
            <div className="p-3 text-center text-white/80 text-sm">✓ {good}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function DSlideProximosPassos() {
  const steps = [
    { num: '01', icon: '🤝', title: 'Formalização',               desc: 'Contrato assinado e plano escolhido. Você começa a executar com segurança e clareza.' },
    { num: '02', icon: '📅', title: 'Reunião inicial de projeto', desc: 'Alinhamos estratégia, público-alvo, calendário e expectativas de entrega.' },
    { num: '03', icon: '🚀', title: 'Execução',                   desc: 'Cada entrega no prazo acordado — você acompanha o progresso em tempo real.' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        O que acontece depois
      </motion.h2>
      <div className="flex gap-5">
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 160 }}
            className="flex-1 rounded-2xl p-7 flex flex-col gap-3"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div className="text-4xl">{s.icon}</div>
            <div className="text-[11px] font-black text-white/35 tracking-widest">{s.num}</div>
            <div className="text-xl font-black text-white leading-snug">{s.title}</div>
            <div className="text-white/65 text-sm leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-white/60 text-base text-center font-medium"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        Quem quer resultado decide. Quem não quer, adia.
      </motion.p>
    </div>
  )
}

function DSlideCTA({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'empresa'
  return (
    <div className="h-full flex flex-col items-center justify-center gap-7"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.div className="bg-white rounded-2xl px-10 py-5 shadow-2xl flex flex-col items-center gap-3 w-full max-w-sm"
        initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="text-2xl font-bold tracking-tight">
          <span style={{ color: '#4285f4' }}>G</span><span style={{ color: '#ea4335' }}>o</span>
          <span style={{ color: '#fbbc04' }}>o</span><span style={{ color: '#4285f4' }}>g</span>
          <span style={{ color: '#34a853' }}>l</span><span style={{ color: '#ea4335' }}>e</span>
        </div>
        <div className="flex items-center border border-gray-200 rounded-full px-5 py-2.5 w-full shadow-sm gap-3">
          <div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: '#4285f4' }} />
          <span className="text-gray-400 text-sm">Seu {word}</span>
          <span className="ml-auto text-xl">🎙️</span>
        </div>
      </motion.div>
      <motion.h2 className="text-3xl font-black text-white text-center max-w-xl leading-snug"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        Se procurar no Google agora, quem aparece primeiro —{' '}
        <span className="underline decoration-2 decoration-white/60">você ou seu concorrente?</span>
      </motion.h2>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.36, type: 'spring', stiffness: 200 }}>
        <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-lg shadow-2xl cursor-default"
          style={{ background: DARK, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <span>📲</span>
          <span>Falar com a equipe agora</span>
        </div>
      </motion.div>
    </div>
  )
}

const DESTRAVA_SLIDES = [
  { id: 'cover',       label: 'Capa',          C: DSlideCover },
  { id: 'dor',         label: 'Dor',           C: DSlideDor },
  { id: 'diagnostico', label: 'Diagnóstico',   C: DSlideDiagnostico },
  { id: 'implicacao',  label: 'Implicação',    C: DSlideImplicacao },
  { id: 'virada',      label: 'A virada',      C: DSlideVirada },
  { id: 'feedbacks',   label: 'Prova',         C: DSlideFeedbacks },
  { id: 'produto',     label: 'Produto',       C: DSlideProduto },
  { id: 'planos',      label: 'Planos',        C: DSlidePlanos },
  { id: 'comparacao',  label: 'Comparação',    C: DSlideComparacao },
  { id: 'proximos',    label: 'Próx. passos',  C: DSlideProximosPassos },
  { id: 'cta',         label: 'CTA',           C: DSlideCTA },
]

// ══════════════════════════════════════════════════════════════════════════════
//   ASSESSORIA DE MARKETING
// ══════════════════════════════════════════════════════════════════════════════

const ASSESSORIA_PLANS = [
  {
    name: 'Ativação',
    sub: 'Primeiros resultados com método',
    color: BLUE,
    price: '1.997',
    highlight: false,
    deliveries: [
      { icon: '📡', text: 'Gerenciamento Meta Ads' },
      { icon: '🎨', text: 'Artes e copies mensais' },
      { icon: '📊', text: 'Relatório mensal de resultados' },
      { icon: '📅', text: '1 reunião mensal de alinhamento' },
      { icon: '💬', text: 'Suporte por WhatsApp' },
    ],
    best: false,
  },
  {
    name: 'Profissional',
    sub: 'Presença completa nos dois canais',
    color: GOLD,
    price: '2.597',
    best: true,
    deliveries: [
      { icon: '📡', text: 'Meta Ads + Google Ads' },
      { icon: '🎨', text: 'Artes, copies e criativos' },
      { icon: '🖥️', text: 'Landing pages de campanha' },
      { icon: '📱', text: 'Organização do perfil social' },
      { icon: '📊', text: 'Relatório + dashboard em tempo real' },
      { icon: '📅', text: '2 reuniões mensais' },
    ],
  },
  {
    name: 'Premium',
    sub: 'Operação de marketing completa',
    color: PUR,
    price: '3.297',
    best: false,
    deliveries: [
      { icon: '✅', text: 'Tudo do Profissional' },
      { icon: '🌐', text: 'Gestão do site / blog' },
      { icon: '📧', text: 'E-mail marketing mensal' },
      { icon: '📍', text: 'SEO e Google Meu Negócio' },
      { icon: '🏆', text: 'Estratégia trimestral com o gestor' },
    ],
  },
]

const ASSESSORIA_CASES = [
  { seg: 'E-commerce',  icon: '🛍️', color: BLUE,   stats: [{ label: 'ROAS', value: '4,2×' }, { label: 'Conversões', value: '+68%' }, { label: 'CPV', value: '−34%' }], desc: 'Loja de moda: de R$8k para R$34k/mês em vendas online em 5 meses.' },
  { seg: 'Advocacia',   icon: '⚖️', color: GOLD,   stats: [{ label: 'CPL', value: '−41%' }, { label: 'Leads/mês', value: '3×' }, { label: 'Prazo', value: '90 dias' }], desc: 'Escritório familiar: 3 leads/mês para 9 leads/mês com orçamento menor.' },
  { seg: 'Saúde',       icon: '🏥', color: PUR,    stats: [{ label: 'Pacientes', value: '+127' }, { label: 'CPL', value: 'R$ 18' }, { label: 'Prazo', value: '60 dias' }], desc: 'Clínica estética: 127 novos pacientes em 60 dias investindo R$ 2.200.' },
]

function ASlidesCover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3570 60%, #0c1f4a 100%)` }}>
      {[...Array(4)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 180 + i * 100, height: 180 + i * 100, border: `1.5px solid ${GOLD}${i % 2 === 0 ? '20' : '10'}`, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 7, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="text-white font-black leading-none mb-3"
          style={{ fontSize: '5rem', letterSpacing: '-4px', textShadow: '0 6px 32px rgba(0,0,0,0.4)' }}
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          tráfegon
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="font-black text-3xl mb-4" style={{ color: GOLD }}>
          Assessoria de Marketing
        </motion.div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
          className="inline-block px-7 py-3 rounded-full font-semibold text-white/80 text-base"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}>
          Resultado previsível, mês após mês.
        </motion.div>
      </motion.div>
    </div>
  )
}

function ASlideDor() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 gap-8"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3570 100%)` }}>
      <motion.div className="max-w-2xl w-full"
        initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative">
          <div className="absolute -bottom-8 left-16 w-0 h-0"
            style={{ borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '32px solid white' }} />
          <p className="text-3xl font-black text-gray-900 leading-tight text-center">
            "Estou investindo em{' '}
            <span className="text-white rounded-lg px-3 py-1" style={{ background: BLUE }}>anúncios</span>
            {' '}mas não tenho clareza se está funcionando."
          </p>
        </div>
      </motion.div>
      <motion.div className="flex gap-4 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        {[
          { icon: '📊', text: 'Sem relatórios claros' },
          { icon: '🔄', text: 'Sem otimização contínua' },
          { icon: '🎯', text: 'Sem estratégia definida' },
        ].map(it => (
          <div key={it.text} className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="text-xl">{it.icon}</span>
            <span className="text-white/60 text-sm font-medium">{it.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function ASlideDiagnostico() {
  const problems = [
    { icon: '🎲', color: RED,    title: 'Anúncio sem estratégia',         desc: 'Impulsionar post não é gestão de tráfego. Sem segmentação e copy, o dinheiro vai embora.' },
    { icon: '📉', color: ORANGE, title: 'Sem otimização contínua',        desc: 'Campanha parada = resultado estagnado. Gestão é ajuste diário, não configurar e esquecer.' },
    { icon: '📂', color: BLUE,   title: 'Relatório que não diz nada',     desc: 'Impressões e curtidas não pagam conta. O que importa é custo por lead e retorno real.' },
    { icon: '🔀', color: GOLD,   title: 'Cada mês recomeça do zero',      desc: 'Sem histórico de aprendizado acumulado, cada campanha é como a primeira.' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-6" style={{ background: '#090e1a' }}>
      <motion.h2 className="text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Por que o resultado não vem
      </motion.h2>
      <div className="grid grid-cols-2 gap-4">
        {problems.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 180 }}
            className="rounded-2xl p-5 flex gap-4"
            style={{ background: p.color + '0e', border: `1px solid ${p.color}22` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: p.color + '18' }}>
              {p.icon}
            </div>
            <div>
              <div className="font-black text-white text-sm mb-1">{p.title}</div>
              <div className="text-white/40 text-xs leading-relaxed">{p.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center text-white/35 text-sm font-medium">
        Não é o canal que falhou. É a ausência de gestão especializada.
      </motion.p>
    </div>
  )
}

function ASlideImplicacao() {
  const items = [
    { icon: '💰', color: RED,    label: 'Verba desperdiçada',   value: 'Meses de investimento sem acúmulo de aprendizado' },
    { icon: '🥇', color: ORANGE, label: 'Concorrente na frente', value: 'Cada mês parado é posição entregue para quem está gerenciando' },
    { icon: '📅', color: GOLD,   label: 'Timing que não volta',  value: 'Mercado digital recompensa quem entra primeiro com consistência' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: '#0b0f1a' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white">O preço da inação</h2>
        <p className="mt-2 text-white/30 text-base">Cada mês sem gestão profissional tem um custo real.</p>
      </motion.div>
      <div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
        {items.map((it, i) => (
          <motion.div key={it.label} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 160 }}
            className="flex items-center gap-5 rounded-2xl p-5"
            style={{ background: it.color + '0d', border: `1px solid ${it.color}25` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: it.color + '18' }}>
              {it.icon}
            </div>
            <div>
              <div className="font-black text-white">{it.label}</div>
              <div className="text-white/40 text-sm mt-0.5">{it.value}</div>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: it.color, boxShadow: `0 0 8px ${it.color}` }} />
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="text-center font-medium text-white/40 text-sm">
        Anunciar sem gestão não é economizar. É pagar mais pelo mesmo resultado.
      </motion.p>
    </div>
  )
}

function ASlideMethod() {
  const steps = [
    { num: '01', icon: '🎯', color: BLUE,   label: 'Estratégia',    desc: 'Definição de público, oferta, canais e metas do mês' },
    { num: '02', icon: '⚙️', color: GOLD,   label: 'Execução',      desc: 'Campanhas ativas, artes, copies e ajustes diários' },
    { num: '03', icon: '📊', color: PUR,    label: 'Relatório',     desc: 'Números reais: CPL, ROAS, leads, conversões' },
    { num: '04', icon: '🔁', color: ORANGE, label: 'Otimização',    desc: 'Aprendizado acumulado → próximo mês mais eficiente' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3570 100%)` }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white">Ciclo mensal</h2>
        <p className="text-white/45 mt-2">O que acontece todo mês na sua conta.</p>
      </motion.div>
      <div className="flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
              className="flex-1 rounded-2xl p-5 flex flex-col gap-2 text-center"
              style={{ background: s.color + '12', border: `1.5px solid ${s.color}30` }}>
              <div className="text-3xl">{s.icon}</div>
              <div className="text-[10px] font-black text-white/25 tracking-widest">{s.num}</div>
              <div className="font-black text-base" style={{ color: s.color }}>{s.label}</div>
              <div className="text-white/40 text-xs leading-relaxed">{s.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.2 }}
                className="text-white/20 text-xl flex-shrink-0">→</motion.div>
            )}
          </div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="text-center py-3 px-6 rounded-full mx-auto self-center"
        style={{ background: GOLD + '15', border: `1px solid ${GOLD}30` }}>
        <span className="font-black text-sm" style={{ color: GOLD }}>
          Resultado acumulativo — cada mês é melhor que o anterior.
        </span>
      </motion.div>
    </div>
  )
}

function ASlideResultados() {
  return (
    <div className="h-full flex flex-col p-8 gap-6" style={{ background: '#0a0e18' }}>
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">Resultados reais</h2>
        <div className="text-xs text-white/25 border border-white/10 rounded-full px-4 py-1.5">clientes ativos</div>
      </motion.div>
      <div className="grid grid-cols-3 gap-5 flex-1">
        {ASSESSORIA_CASES.map((c, i) => (
          <motion.div key={c.seg} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: c.color + '0d', border: `1.5px solid ${c.color}25` }}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{c.icon}</div>
              <div className="font-black text-white text-sm">{c.seg}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {c.stats.map(s => (
                <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: c.color + '12' }}>
                  <div className="font-black text-lg leading-tight" style={{ color: c.color }}>{s.value}</div>
                  <div className="text-white/30 text-[10px] leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-xs leading-relaxed flex-1">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AslidePlanos() {
  return (
    <div className="h-full flex flex-col p-6 justify-center gap-3" style={{ background: '#090e1a' }}>
      <div className="flex items-center justify-between gap-4 mb-1">
        <h2 className="text-3xl font-black text-white">Planos de Assessoria</h2>
        <div className="text-xs border rounded-full px-4 py-1.5 text-white/30 border-white/10">mensalidade · sem fidelidade</div>
      </div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {ASSESSORIA_PLANS.map((plan, pi) => (
          <motion.div key={plan.name} initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: pi * 0.12, type: 'spring', stiffness: 180 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#0f1829' }}>
            {plan.best && (
              <div className="py-1.5 text-center text-xs font-black text-white tracking-wider"
                style={{ background: `linear-gradient(90deg, ${GOLD}cc, ${ORANGE}cc)` }}>
                ⭐ MAIS VENDIDO
              </div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="rounded-xl p-3 text-center"
                style={{ background: plan.color + '15', border: `1.5px solid ${plan.color}35` }}>
                <div className="text-lg font-black" style={{ color: plan.color }}>{plan.name}</div>
                <div className="text-xs text-white/35 mt-0.5">{plan.sub}</div>
              </div>
              <div className="text-center py-1">
                <div className="text-white/35 text-xs">a partir de</div>
                <span className="text-3xl font-black text-white">R$ {plan.price}</span>
                <div className="text-white/25 text-xs">/mês</div>
              </div>
              <div className="flex-1 space-y-2">
                {plan.deliveries.map(d => (
                  <div key={d.text} className="flex items-center gap-2">
                    <span className="text-sm flex-shrink-0 w-5 text-center">{d.icon}</span>
                    <span className="text-xs text-white/60">{d.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ASlideComparacao() {
  const rows = [
    ['Impulsionar post',        'Gestão estratégica'],
    ['Sem rastreamento',        'Métricas reais'],
    ['Relatório genérico',      'Dashboard por cliente'],
    ['Resultado estagnado',     'Acumulativo mês a mês'],
    ['Você faz tudo sozinho',   'Time especializado'],
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-6"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3570 100%)` }}>
      <motion.h2 className="text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Por que a Tráfegon?
      </motion.h2>
      <motion.div className="max-w-2xl w-full mx-auto rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-2">
          <div className="p-4 text-center font-black text-white/40 text-sm" style={{ background: 'rgba(0,0,0,0.42)' }}>Sem assessoria</div>
          <div className="p-4 text-center font-black text-white text-sm" style={{ background: `linear-gradient(90deg, ${BLUE}, ${PUR})` }}>Com Tráfegon</div>
        </div>
        {rows.map(([bad, good], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.07 }}
            className="grid grid-cols-2 border-t border-white/[0.07]" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <div className="p-3 text-center text-white/25 text-sm border-r border-white/[0.07]">✕ {bad}</div>
            <div className="p-3 text-center text-white/80 text-sm">✓ {good}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function ASlideCTA() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-7"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3570 100%)` }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-3">📈</div>
        <h2 className="text-4xl font-black text-white leading-tight">
          Resultado previsível{' '}
          <span style={{ color: GOLD }}>começa com</span>
          <br />gestão profissional.
        </h2>
      </motion.div>
      <motion.div className="flex gap-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {[
          { icon: '⚡', text: 'Início em 48h', color: GOLD },
          { icon: '📋', text: 'Sem fidelidade', color: BLUE },
          { icon: '📊', text: 'Relatório mensal', color: PUR },
        ].map(it => (
          <div key={it.text} className="flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: it.color + '18', border: `1px solid ${it.color}30` }}>
            <span className="text-lg">{it.icon}</span>
            <span className="text-white/80 font-semibold text-sm">{it.text}</span>
          </div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}>
        <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-lg cursor-default shadow-2xl"
          style={{ background: `linear-gradient(90deg, ${BLUE}, ${PUR})`, boxShadow: `0 8px 32px ${BLUE}50` }}>
          <span>📲</span>
          <span>Falar com a equipe agora</span>
        </div>
      </motion.div>
    </div>
  )
}

const ASSESSORIA_SLIDES = [
  { id: 'cover',      label: 'Capa',        C: ASlidesCover },
  { id: 'dor',        label: 'Cenário',     C: ASlideDor },
  { id: 'diag',       label: 'Diagnóstico', C: ASlideDiagnostico },
  { id: 'implicacao', label: 'Implicação',  C: ASlideImplicacao },
  { id: 'method',     label: 'Método',      C: ASlideMethod },
  { id: 'resultados', label: 'Resultados',  C: ASlideResultados },
  { id: 'planos',     label: 'Planos',      C: AslidePlanos },
  { id: 'comparacao', label: 'Comparação',  C: ASlideComparacao },
  { id: 'cta',        label: 'CTA',         C: ASlideCTA },
]

// ══════════════════════════════════════════════════════════════════════════════
//   MAIN
// ══════════════════════════════════════════════════════════════════════════════

export default function TrafegonComercial() {
  const [produto, setProduto] = useState('destrava')

  const isDestrava = produto === 'destrava'

  return (
    <div className="flex flex-col gap-3">
      {/* Product switcher */}
      <div className="flex gap-1 p-1 rounded-xl self-start" style={{ background: '#1e2035' }}>
        {[
          { value: 'destrava',   label: '🔓 Destrava Digital' },
          { value: 'assessoria', label: '📊 Assessoria' },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setProduto(value)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: produto === value ? (value === 'destrava' ? G : GOLD) : 'transparent',
              color: produto === value ? (value === 'destrava' ? 'white' : NAVY) : '#8890b5',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div key={produto}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}>
          {isDestrava ? (
            <Slideshow
              slides={DESTRAVA_SLIDES}
              accentColor={G}
              modeOptions={[
                { value: 'empresas',  label: '🏢 Empresas' },
                { value: 'advocacia', label: '⚖️ Advocacia' },
              ]}
            />
          ) : (
            <Slideshow
              slides={ASSESSORIA_SLIDES}
              accentColor={GOLD}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
