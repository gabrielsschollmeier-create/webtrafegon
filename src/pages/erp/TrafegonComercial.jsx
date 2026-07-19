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
        <span className="text-sm font-mono text-white/60 tabular-nums">{cur + 1} / {slides.length}</span>
        <button onClick={() => setFs(v => !v)}
          className="p-2 rounded-xl transition-colors hover:text-white text-white/95"
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
          <p className="text-[11px] font-black text-white/90 uppercase tracking-widest mb-3">Cenário atual</p>
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
          <p className="text-[11px] font-black text-white/90 uppercase tracking-widest mb-3">O que você já tentou</p>
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
                  <div className="text-white/95 text-xs">{m.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center rounded-full py-3 px-8 mx-auto text-white/75 text-sm self-center"
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
        <p className="text-white/95 mt-2 text-base">Cada dia sem presença digital tem um preço.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {items.map(it => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: it.delay, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: it.color + '0d', border: `1px solid ${it.color}28` }}>
            <div className="text-3xl">{it.icon}</div>
            <div className="font-black text-lg text-white leading-snug">{it.title}</div>
            <div className="text-white/90 text-sm leading-relaxed">{it.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-xl py-4 px-8 mx-auto text-center self-center"
        style={{ background: RED + '12', border: `1px solid ${RED}28` }}>
        <p className="text-white/95 font-medium text-sm">
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
          <div className="text-[11px] font-black text-white/90 uppercase tracking-widest">Antes</div>
          {befores.map(b => (
            <div key={b.text} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center opacity-50">{b.icon}</span>
              <span className="text-white/95 text-sm line-through">{b.text}</span>
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
        <div className="text-xs text-white/90 border border-white/10 rounded-full px-4 py-1.5 flex-shrink-0">
          Avulso custaria{' '}
          <span className="text-white/75 line-through font-bold">R$ 15.500</span>
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
                <div className="text-xs text-white/88 mt-0.5">{plan.sub}</div>
              </div>
              <div className="text-center py-1">
                <span className="text-2xl font-black text-white">10x R$ {plan.price10}</span>
                <div className="text-white/60 text-xs">ou R$ {plan.priceAV} à vista</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {plan.deliveries.map(d => (
                  <div key={d.text} className="flex items-center gap-2">
                    <span className="text-sm flex-shrink-0 w-5 text-center">{d.icon}</span>
                    <span className="text-xs text-white/95">{d.text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 space-y-1" style={{ borderTop: `1px solid ${plan.color}22` }}>
                <div className="text-[10px] text-white/90 uppercase tracking-widest mb-1">Indicado para</div>
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
          <div className="p-5 text-center font-black text-white/90 text-lg" style={{ background: 'rgba(0,0,0,0.42)' }}>Avulso</div>
          <div className="p-5 text-center font-black text-white text-lg" style={{ background: PUR }}>Método Destrava</div>
        </div>
        <div className="grid grid-cols-2" style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="p-5 text-center border-r border-white/10">
            <div className="text-3xl font-black text-white/95 line-through">R$ 15.500</div>
          </div>
          <div className="p-5 text-center">
            <div className="text-xl font-bold text-white/95">A partir de</div>
            <div className="text-3xl font-black" style={{ color: G, textShadow: `0 0 20px ${G}90` }}>10x R$ 197</div>
          </div>
        </div>
        {rows.map(([bad, good], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
            className="grid grid-cols-2 border-t border-white/[0.08]" style={{ background: 'rgba(0,0,0,0.16)' }}>
            <div className="p-3 text-center text-white/90 text-sm border-r border-white/[0.08]">✕ {bad}</div>
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
            <div className="text-[11px] font-black text-white/95 tracking-widest">{s.num}</div>
            <div className="text-xl font-black text-white leading-snug">{s.title}</div>
            <div className="text-white/95 text-sm leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-white/95 text-base text-center font-medium"
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
//   ASSESSORIA DE MARKETING  (14 slides — fiel ao PDF)
// ══════════════════════════════════════════════════════════════════════════════

const A_PLANS = [
  {
    name: 'Ativação', sub: 'Para começar do jeito certo',
    color: ORANGE, price: '1.997',
    forWho: ['Empresas que ainda não têm previsibilidade', 'Marketing acontece, mas não vira sistema', 'Leads vêm de forma inconsistente'],
    gears: ['Atração', 'Clareza de ICP', 'Mensagem e posicionamento', 'Primeiras conversões'],
    insight: 'Aqui a gente tira o crescimento da tentativa e erro.',
    deliveries: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião mensal de mentoria', 'Suporte diário no WhatsApp'],
  },
  {
    name: 'Estruturação', sub: 'Estrutura + ativação com previsibilidade',
    color: G, price: '2.597', best: true,
    forWho: ['Já vende, mas vive no caos', 'Processo depende de pessoas específicas', 'Não sabe exatamente onde está perdendo dinheiro'],
    gears: ['Monetização', 'CRM', 'Funil comercial', 'Rotinas e indicadores'],
    insight: 'Transformar esforço em previsibilidade.',
    deliveries: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião mensal de mentoria', 'Suporte diário no WhatsApp', '1 Landing page', 'Edição básica de vídeo para anúncio', 'Artes'],
  },
  {
    name: 'Aceleração', sub: 'Presença completa + base para escalar',
    color: PUR, price: '3.297',
    forWho: ['Sistema já funciona', 'Quer aumentar velocidade e eficiência', 'Precisa melhorar conversão e LTV'],
    gears: ['Otimização de funil', 'Performance de tráfego', 'Conversão e retenção', 'Ajustes finos de processo'],
    insight: 'Aqui não se cria nada novo. Se extrai mais do que já existe.',
    deliveries: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião quinzenal de mentoria', 'Suporte diário no WhatsApp', '1 Landing page', 'Edição básica de vídeo para anúncio', 'Artes', 'CRM', '1 Agente de IA', 'Automação de leads'],
  },
]

const GBG = `linear-gradient(135deg, #3dba18 0%, ${G} 100%)`

// Slide 1 — Capa
function ASlide01Cover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: GBG }}>
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
          Gerando negócios para seu negócio.
        </motion.div>
      </motion.div>
    </div>
  )
}

// Slide 2 — Vendas oscila (gráfico zigzag)
function ASlide02Vendas() {
  const pts = '0,100 60,62 120,80 190,30 250,50 310,18 370,42 430,28 490,58 550,38 610,70'
  const peaks = [{ x: 190, label: 'Vendas' }, { x: 310, label: 'Vendas' }, { x: 430, label: 'Vendas' }, { x: 550, label: 'Vendas' }]
  return (
    <div className="h-full flex flex-col justify-between p-10 pb-4" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white leading-tight">
          Sem <span className="bg-black/25 px-3 py-1 rounded-lg">método de vendas</span>
          <br />estruturado, não existe previsibilidade.
        </h2>
        <div className="mt-3 text-4xl font-black text-white">Existe esperança.</div>
      </motion.div>
      <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <svg viewBox="0 -20 610 130" className="w-full" style={{ height: 160 }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${pts} 610,100`} fill="url(#chartGrad)" />
          <polyline points={pts} fill="none" stroke="#1a1d2e" strokeWidth="3.5" strokeLinejoin="round" />
          {peaks.map(p => (
            <g key={p.x}>
              <circle cx={p.x} cy={peaks.indexOf(peaks.find(q=>q.x===p.x))%2===0?30:18} r="5" fill="white" />
              <text x={p.x} y={peaks.indexOf(peaks.find(q=>q.x===p.x))%2===0?20:8} textAnchor="middle"
                fill="white" fontSize="11" fontWeight="bold">Vendas</text>
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  )
}

// Slide 3 — O Caos Invisível
function ASlide03Caos() {
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-6" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        O Caos Invisível
      </motion.h2>
      <div className="flex items-center justify-center gap-6">
        {[
          { label: 'Marketing\ngera lead\nruim', color: G, delay: 0 },
          { label: 'Vendas\ndepende\nde heróis', color: PUR, delay: 0.15 },
          { label: 'Resultado\noscila', color: G, delay: 0.3 },
        ].map((c, i) => (
          <div key={c.label} className="flex items-center gap-4">
            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: c.delay, type: 'spring', stiffness: 160 }}
              className="w-44 h-44 rounded-full flex items-center justify-center text-center p-4 font-black text-lg"
              style={{ background: c.color, color: c.color === PUR ? 'white' : DARK, lineHeight: 1.2 }}>
              {c.label.split('\n').map((l, j) => <div key={j}>{l}</div>)}
            </motion.div>
            {i < 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: c.delay + 0.15 }}
                className="flex flex-col gap-1 text-white/88 text-lg font-bold">
                <span>⇐</span><span>⇒</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <motion.p className="text-center text-white/88 text-base"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        Crescimento no improviso cobra juros.
      </motion.p>
    </div>
  )
}

// Slide 4 — A Verdade
function ASlide04Verdade() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5" style={{ background: DARK }}>
      <motion.div className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-white/75 font-semibold text-lg tracking-wide">A Verdade</span>
        <span className="text-white/88 text-2xl">↓</span>
      </motion.div>
      <div className="flex flex-col gap-0 max-w-3xl w-full">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="px-8 py-6 text-4xl font-black text-gray-900 rounded-t-2xl"
          style={{ background: 'white' }}>
          Não é falta de esforço.
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 }}
          className="px-8 py-6 text-4xl font-black text-white rounded-b-2xl"
          style={{ background: PUR }}>
          É falta de processo.
        </motion.div>
      </div>
    </div>
  )
}

// Slide 5 — Não é pra você
function ASlide05NaoPraVoce() {
  const items = [
    'Não somos agência de post',
    'Não somos gestor de tráfego isolado',
    'Não prometemos milagre em 30 dias',
    'Não operamos no improviso',
    'Não funciona se o cliente não pegar junto',
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-5" style={{ background: DARK }}>
      <motion.h2 className="text-4xl font-black text-white text-center leading-snug"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Se você busca isso aqui,<br />não é pra você
      </motion.h2>
      <div className="flex flex-col gap-3 max-w-2xl w-full mx-auto">
        {items.map((it, i) => (
          <motion.div key={it} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 180 }}
            className="flex items-center gap-4 px-5 py-3.5 rounded-full"
            style={{ background: PUR }}>
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0">✕</div>
            <span className="text-white font-medium italic">{it}</span>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center font-black text-white/80 text-lg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        Somos para quem quer processo, rotina e previsibilidade.
      </motion.p>
    </div>
  )
}

// Slide 6 — Nossa Visão de Crescimento
function ASlide06Visao() {
  const nodes = [
    { icon: '🔍', label: 'Marketing', color: PUR, ring: G },
    { icon: '💰', label: 'Vendas',    color: G,   ring: PUR },
    { icon: '👥', label: 'Retenção',  color: PUR, ring: G },
    { icon: '🚀', label: 'Expansão',  color: G,   ring: PUR },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Nossa Visão de Crescimento
      </motion.h2>
      <div className="flex items-center justify-center gap-8">
        {nodes.map((n, i) => (
          <motion.div key={n.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ border: `5px solid ${n.ring}`, opacity: 0.5 }} />
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ background: n.color }}>
                {n.icon}
              </div>
            </div>
            <span className="text-white font-semibold text-sm">{n.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center text-white/95 text-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        Crescimento é sistema, não campanha
      </motion.p>
    </div>
  )
}

// Slide 7 — Estruturando o sistema vamos ter
function ASlide07Sistema() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8" style={{ background: GBG }}>
      <motion.h2 className="text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Estruturando o sistema vamos ter
      </motion.h2>
      <div className="flex flex-col gap-5 w-full max-w-md">
        {['Organização', 'Previsibilidade', 'Escala'].map((item, i) => (
          <motion.div key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 160 }}
            className="flex items-center gap-4 px-8 py-5 rounded-full bg-white shadow-2xl"
            style={{ border: '3px solid #1a1d2e' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: G }}>✓</div>
            <span className="text-gray-900 font-black text-xl">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Slide 8 — O sistema é construído. Não acontece.
function ASlide08Construido() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-7xl font-black text-white leading-tight" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          O sistema é<br />construído.<br />Não acontece.
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="px-8 py-3 rounded-full text-white font-semibold text-xl"
        style={{ background: PUR }}>
        E começa com <strong>método</strong>
      </motion.div>
    </div>
  )
}

// Slide 9 — Casos reais
function ASlide09Casos() {
  const cases = [
    { name: 'Caroline Pagani',    logo: '⚖️',  bg: ORANGE,         text: 'De R$0 a R$60k de faturamento em 3 meses',  seg: 'Advocacia' },
    { name: 'Kinto Escola',       logo: '🎓',  bg: '#f5f5f5',      text: 'De R$0 para R$30k de MRR em 14 meses',      seg: 'SaaS', dark: true },
    { name: 'Michigan Heirs',     logo: '🔧',  bg: '#f59e0b',      text: 'De R$0 para R$580k em 4 meses',             seg: 'Máquinas' },
    { name: 'Kamy',               logo: '🏗️',  bg: '#1e3a5f',      text: 'De R$0 para R$1.5mi faturamento ao ano',    seg: 'Mat. Construção' },
  ]
  return (
    <div className="h-full flex flex-col p-8 gap-5" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">
          Isso não é teoria.{' '}
          <span className="bg-black/25 px-3 py-1 rounded-xl">É método validado para Inside Sales.</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {cases.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 160 }}
            className="rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-6 py-4 font-black text-lg"
              style={{ background: c.bg, color: c.dark ? '#1a1d2e' : 'white' }}>
              <span>{c.logo}</span>
              <span>{c.name}</span>
            </div>
            <div className="px-4 py-3 font-semibold text-sm text-white/90"
              style={{ background: '#1a1d2e' }}>
              {c.text} <span className="text-white/90 font-normal">| {c.seg}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Slide 10 — Não vendemos plano. Estruturamos jornadas.
function ASlide10Jornada() {
  const steps = ['Caos', 'Base', 'Velocidade', 'Eficiência']
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-10" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center leading-tight"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Não vendemos plano.{' '}
        <span className="px-3 py-1 rounded-xl" style={{ background: G, color: DARK }}>Estruturamos</span>
        {' '}jornadas<br />e organizamos processos.
      </motion.h2>
      <div className="flex items-center justify-center gap-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
              className="w-36 h-24 rounded-2xl flex items-center justify-center font-semibold text-white text-lg"
              style={{ background: PUR }}>
              {s}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.15 }}
                className="text-white/95 text-2xl font-bold">→</motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Slide 11 — Planos
function ASlide11Planos() {
  return (
    <div className="h-full flex flex-col p-5 gap-3" style={{ background: '#e8eaef' }}>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {A_PLANS.map((plan, pi) => (
          <motion.div key={plan.name} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: pi * 0.12, type: 'spring', stiffness: 180 }}
            className="rounded-2xl overflow-hidden flex flex-col bg-white shadow-md">
            <div className="py-4 px-5 text-center"
              style={{ background: plan.color }}>
              <div className="font-black text-white text-2xl">{plan.name}</div>
              <div className="text-white/75 text-xs mt-1">{plan.sub}</div>
            </div>
            <div className="flex flex-col gap-3 p-4 flex-1">
              <div className="text-center py-1">
                <span className="text-2xl font-black" style={{ color: plan.color }}>R$ {plan.price}</span>
                <span className="text-gray-500 text-sm"> / mês</span>
              </div>
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Para quem é:</div>
                {plan.forWho.map(w => <div key={w} className="text-xs text-gray-600 flex gap-1.5 mb-0.5"><span className="text-gray-400">•</span>{w}</div>)}
              </div>
              <div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Engrenagens trabalhadas</div>
                {plan.gears.map(g => <div key={g} className="text-xs text-gray-600 flex gap-1.5 mb-0.5"><span className="text-gray-400">•</span>{g}</div>)}
              </div>
              <div className="text-xs text-gray-500 italic px-3 py-2 rounded-lg"
                style={{ background: plan.color + '12' }}>
                {plan.insight}
              </div>
              <div className="rounded-xl p-3 mt-auto" style={{ background: plan.color }}>
                <div className="text-white font-black text-xs text-center mb-1.5">Principais entregas:</div>
                {plan.deliveries.map(d => <div key={d} className="text-white/95 text-xs flex gap-1.5 mb-0.5"><span>•</span>{d}</div>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Slide 12 — Como Escolher a Assessoria
function ASlide12ComoEscolher() {
  const rows = [
    { cond: 'Quer começar',         plan: 'Ativação',     color: ORANGE },
    { cond: 'Quer previsibilidade', plan: 'Estruturação', color: G },
    { cond: 'Quer eficiência',      plan: 'Aceleração',   color: PUR },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Como Escolher a Assessoria
      </motion.h2>
      <div className="flex flex-col gap-5 max-w-2xl w-full mx-auto">
        {rows.map((r, i) => (
          <motion.div key={r.plan} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 160 }}
            className="flex items-center gap-6">
            <div className="text-white font-semibold text-xl flex items-center gap-3 flex-1">
              <span className="text-white/88">•</span> {r.cond}
            </div>
            <div className="px-8 py-3 rounded-full font-black text-white text-lg"
              style={{ background: r.color, color: r.color === G ? DARK : 'white', minWidth: 180, textAlign: 'center' }}>
              {r.plan}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Slide 13 — Estamos alinhados se
function ASlide13Alinhados() {
  const pills = [
    { text: 'O objetivo é ', bold: 'previsibilidade' },
    { text: 'Crescimento é tratado como ', bold: 'sistema' },
    { text: 'Execução é ', bold: 'compartilhada' },
  ]
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8" style={{ background: GBG }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Estamos alinhados se:
      </motion.h2>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {pills.map((p, i) => (
          <motion.div key={p.bold} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 160 }}
            className="px-8 py-4 rounded-full text-center font-semibold text-lg italic"
            style={{ background: DARK, color: 'white' }}>
            {p.text}<strong className="not-italic">{p.bold}</strong>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-white font-black text-xl text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        Se faz sentido, o próximo passo é executar.
      </motion.p>
    </div>
  )
}

// Slide 14 — Próximos passos
function ASlide14Proximos() {
  const steps = [
    { num: '1', text: 'Formalização do contrato de parceria',           color: DARK },
    { num: '2', text: 'Reunião de planejamento (orçamento + cronograma)', color: PUR },
    { num: '3', text: 'Início da execução e onboarding',                 color: ORANGE },
  ]
  return (
    <div className="h-full flex p-10 gap-12 items-center" style={{ background: GBG }}>
      <motion.h2 className="text-6xl font-black text-white leading-tight flex-shrink-0"
        initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}>
        Próximos<br />passos:
      </motion.h2>
      <div className="flex flex-col gap-5 flex-1">
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 160 }}
            className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-3xl flex-shrink-0"
              style={{ background: s.color }}>
              {s.num}
            </div>
            <div className="px-6 py-4 rounded-full text-white font-semibold text-lg italic flex-1"
              style={{ background: s.color }}>
              {s.text}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p className="absolute bottom-6 left-0 right-0 text-center text-white/95 font-semibold italic text-base"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Quem quer resultado decide. Quem não quer, adia.
      </motion.p>
    </div>
  )
}

const ASSESSORIA_SLIDES = [
  { id: 's01', label: 'Capa',           C: ASlide01Cover },
  { id: 's02', label: 'Vendas',         C: ASlide02Vendas },
  { id: 's03', label: 'O Caos',         C: ASlide03Caos },
  { id: 's04', label: 'A Verdade',      C: ASlide04Verdade },
  { id: 's05', label: 'Não é pra você', C: ASlide05NaoPraVoce },
  { id: 's06', label: 'Visão',          C: ASlide06Visao },
  { id: 's07', label: 'Sistema',        C: ASlide07Sistema },
  { id: 's08', label: 'Construído',     C: ASlide08Construido },
  { id: 's09', label: 'Casos',          C: ASlide09Casos },
  { id: 's10', label: 'Jornada',        C: ASlide10Jornada },
  { id: 's11', label: 'Planos',         C: ASlide11Planos },
  { id: 's12', label: 'Como Escolher',  C: ASlide12ComoEscolher },
  { id: 's13', label: 'Alinhados',      C: ASlide13Alinhados },
  { id: 's14', label: 'Próximos',       C: ASlide14Proximos },
]

// ══════════════════════════════════════════════════════════════════════════════
//   PITCH COMPLETO  (11 slides — SPIN geral + portfólio completo)
// ══════════════════════════════════════════════════════════════════════════════

// P1 — Capa
function PSlide01Cover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: GBG }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 160 + i * 90, height: 160 + i * 90, border: '1.5px solid rgba(255,255,255,0.13)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 7, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center px-8"
        initial={{ opacity: 0, scale: 0.78 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="font-black text-white leading-none mb-3"
          style={{ fontSize: '5rem', letterSpacing: '-5px', textShadow: '0 8px 40px rgba(0,0,0,0.2)' }}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          TráfegOn
        </motion.div>
        <motion.div className="text-white/70 font-semibold text-xl mb-6"
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}>
          Apresentação Comercial
        </motion.div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.42 }}
          className="inline-block px-8 py-3 rounded-full font-bold text-white text-base shadow-2xl"
          style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          Estrutura digital que gera resultado — do ativo ao sistema completo.
        </motion.div>
      </motion.div>
    </div>
  )
}

// P2 — Situação (SPIN-S)
function PSlide02Situacao() {
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/75 uppercase tracking-widest mb-2">Situação — SPIN</div>
        <h2 className="text-5xl font-black text-white leading-tight">
          Quem não é encontrado<br />não é considerado.
        </h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {[
          { icon: '🔍', val: '97%', label: 'dos consumidores pesquisam online antes de contratar um serviço local' },
          { icon: '⚡', val: '8s',  label: 'é o tempo médio de atenção — sua presença digital decide se fica ou sai' },
          { icon: '📈', val: '3×',  label: 'mais leads geram negócios com estrutura digital organizada vs. sem estrutura' },
        ].map((it, i) => (
          <motion.div key={it.val} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-6 flex flex-col gap-3 text-center"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div className="text-3xl">{it.icon}</div>
            <div className="text-4xl font-black text-white">{it.val}</div>
            <div className="text-white/95 text-xs leading-relaxed">{it.label}</div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center text-white/95 text-sm font-medium"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        O mercado não espera. Ou você aparece, ou o concorrente aparece no seu lugar.
      </motion.p>
    </div>
  )
}

// P3 — Problema (SPIN-P)
function PSlide03Problema() {
  const probs = [
    { icon: '👻', color: RED,    title: 'Invisível',          desc: 'Sem presença digital. Leads chegam só por indicação — crescimento lento e imprevisível.' },
    { icon: '⚙️', color: ORANGE, title: 'Presente, sem processo', desc: 'Tem redes sociais ou site, mas sem funil, sem CTA claro, sem acompanhamento. Lead some.' },
    { icon: '🔥', color: PUR,    title: 'Tem lead, perde na venda', desc: 'Gera interesse mas não fecha. Falta script, CRM, follow-up. O esforço não vira receita.' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-2">Problema — SPIN</div>
        <h2 className="text-4xl font-black text-white">Três estágios que travam o crescimento</h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {probs.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: p.color + '0e', border: `1.5px solid ${p.color}30` }}>
            <div className="text-4xl">{p.icon}</div>
            <div className="font-black text-lg" style={{ color: p.color }}>{p.title}</div>
            <div className="text-white/75 text-sm leading-relaxed">{p.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center text-white/90 text-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Em qual desses estágios você se enxerga hoje?
      </motion.p>
    </div>
  )
}

// P4 — Implicação (SPIN-I)
function PSlide04Implicacao() {
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-7" style={{ background: '#0f1018' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-2">Implicação — SPIN</div>
        <h2 className="text-4xl font-black text-white">O custo de não resolver</h2>
        <p className="text-white/90 mt-2 text-sm">Cada mês sem estrutura é receita que fica na mesa.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '📉', color: RED,    title: 'Lead perdido',      desc: 'Quem te busca e não encontra vai para o concorrente. Esse lead nunca volta.' },
          { icon: '🔄', color: ORANGE, title: 'Esforço desperdiçado', desc: 'Investir em tráfego sem estrutura de conversão é jogar dinheiro fora.' },
          { icon: '⏳', color: PUR,    title: 'Crescimento travado', desc: 'Sem processo comercial, o crescimento fica preso à capacidade de um dono de fechar tudo na mão.' },
        ].map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: it.color + '0d', border: `1px solid ${it.color}25` }}>
            <div className="text-3xl">{it.icon}</div>
            <div className="font-black text-base" style={{ color: it.color }}>{it.title}</div>
            <div className="text-white/90 text-xs leading-relaxed">{it.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div className="rounded-2xl py-5 px-8 text-center mx-auto w-full"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: RED + '10', border: `1px solid ${RED}25` }}>
        <p className="text-white/90 text-sm">
          Não ter estrutura digital hoje não é "estar começando".<br />
          <span className="text-white font-black text-base">É escolher perder para quem tem.</span>
        </p>
      </motion.div>
    </div>
  )
}

// P5 — A virada (SPIN-N)
function PSlide05Virada() {
  const rows = [
    { before: 'Depende só de indicação',          after: 'Canal digital previsível de leads' },
    { before: 'Sem presença ou presença fraca',   after: 'Credibilidade antes do primeiro contato' },
    { before: 'Lead some sem resposta',           after: 'Funil e follow-up que fecham por você' },
    { before: 'Crescimento na mão do dono',       after: 'Sistema que funciona mesmo sem você' },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/75 uppercase tracking-widest mb-2">Necessidade — SPIN</div>
        <h2 className="text-4xl font-black text-white">O que muda com a estrutura certa</h2>
      </motion.div>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <motion.div key={r.before} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 180 }}
            className="grid grid-cols-2 gap-4 rounded-xl px-5 py-4"
            style={{ background: 'rgba(0,0,0,0.18)' }}>
            <div className="flex items-center gap-3">
              <span className="text-base opacity-35">✗</span>
              <span className="text-white/48 text-sm line-through">{r.before}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">✓</span>
              <span className="text-white font-semibold text-sm">{r.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center text-white/70 font-semibold text-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        Temos caminhos para cada momento do seu negócio. Veja as opções.
      </motion.p>
    </div>
  )
}

// P6 — Portfólio completo (visão geral)
function PSlide06Portfolio() {
  const products = [
    { icon: '🎨', color: ORANGE, title: 'Ativos Digitais',   sub: 'Avulso · pagamento único', items: ['Identidade Visual', 'Landing Page', 'Site Institucional'], tag: 'a partir de R$ 700' },
    { icon: '🔓', color: G,      title: 'Destrava Digital',  sub: 'Estrutura completa do zero', items: ['Tráfego + consultoria', 'Landing page inclusa', 'Mini curso + treinamento'], tag: 'a partir de 10× R$ 197', best: true },
    { icon: '📊', color: PUR,    title: 'Assessoria',        sub: 'Gestão mensal contínua', items: ['Campanhas + CRM', 'Funil + automações', 'Time dedicado ao seu negócio'], tag: 'a partir de R$ 1.997/mês' },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">O que podemos fazer por você</h2>
        <p className="text-white/95 mt-2 text-sm">Cada produto resolve um momento diferente — e eles se complementam.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        {products.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: p.color + '0d', border: `2px solid ${p.color}${p.best ? '55' : '25'}` }}>
            {p.best && (
              <div className="py-1.5 text-center text-[10px] font-black tracking-widest"
                style={{ background: p.color, color: DARK }}>MAIS CONTRATADO</div>
            )}
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div>
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="font-black text-xl" style={{ color: p.color }}>{p.title}</div>
                <div className="text-white/95 text-xs mt-0.5">{p.sub}</div>
              </div>
              <div className="flex-1 space-y-2">
                {p.items.map(it => (
                  <div key={it} className="flex items-center gap-2 text-sm text-white/95">
                    <span style={{ color: p.color }}>→</span>{it}
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: `1px solid ${p.color}20` }}>
                <span className="text-xs font-black" style={{ color: p.color }}>{p.tag}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// P7 — Ativos Digitais (avulso)
function PSlide07AtivosDigitais() {
  const items = [
    {
      icon: '🎨', title: 'Identidade Visual', color: ORANGE,
      price: 'R$ 700', sub: 'pagamento único',
      includes: ['Logo em 2 variações', 'Paleta de cores + tipografia', 'Cartão de visita digital', 'Assinatura de e-mail'],
    },
    {
      icon: '🎯', title: 'Landing Page', color: G,
      price: 'R$ 1.200', sub: 'pagamento único',
      includes: ['1 página de alta conversão', 'Copy + design + desenvolvimento', 'Responsivo · integração pixel', 'Entrega em até 7 dias'],
    },
    {
      icon: '🏛️', title: 'Site Institucional', color: PUR,
      price: 'R$ 2.500', sub: 'pagamento único',
      best: true,
      includes: ['Até 5 páginas personalizadas', 'SEO on-page + Google Analytics', 'Responsivo e rápido', 'Entrega em até 15 dias'],
    },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-5" style={{ background: '#0f1018' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-1">Solução 1</div>
        <h2 className="text-4xl font-black text-white">Ativos Digitais</h2>
        <p className="text-white/95 text-sm mt-1">Avulso · pagamento único · sem fidelidade. O ativo fica seu para sempre.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 170 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            {it.best && (
              <div className="py-1.5 text-center text-[10px] font-black text-white tracking-widest" style={{ background: it.color }}>
                MAIS PEDIDO
              </div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="text-2xl">{it.icon}</div>
              <div className="font-black text-lg" style={{ color: it.color }}>{it.title}</div>
              <div>
                <div className="text-2xl font-black text-white">{it.price}</div>
                <div className="text-white/90 text-xs">{it.sub}</div>
              </div>
              <div className="flex-1 space-y-2 mt-1">
                {it.includes.map(inc => (
                  <div key={inc} className="flex items-center gap-2 text-xs text-white/95">
                    <span style={{ color: it.color }}>✓</span>{inc}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-white/90 text-xs text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Podem ser contratados separadamente ou como add-on dentro dos planos Destrava e Assessoria.
      </motion.p>
    </div>
  )
}

// P8 — Destrava Digital
function PSlide08Destrava() {
  const plans = [
    { name: 'Ativação', color: ORANGE, price: '10× R$ 197', forWho: 'Para começar do jeito certo', items: ['Reunião inicial de projeto', 'Campanhas de tráfego (1 canal)', 'Consultoria estratégica — 2h gravada', 'Mini aulas de Google e Meta Ads', 'Suporte WhatsApp — 15 dias'] },
    { name: 'Estruturação', color: G, price: '10× R$ 349', best: true, forWho: 'Estrutura + ativação com previsibilidade', items: ['Campanhas em 2 canais', '1 Landing Page de conversão', 'Google Meu Negócio otimizado', 'Instagram e Facebook organizados', 'Consultoria — 4h em 2 encontros', 'Mini curso Google e Meta Ads', 'Suporte WhatsApp — 30 dias'] },
    { name: 'Aceleração', color: PUR, price: '10× R$ 519', forWho: 'Presença completa + base para escalar', items: ['Tudo do Estruturação', 'Site institucional (3 páginas)', 'Identidade visual', 'Treinamento de vendas — 1h30'] },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-5" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-1">Solução 2</div>
        <h2 className="text-4xl font-black text-white">🔓 Destrava Digital</h2>
        <p className="text-white/95 text-sm mt-1">Estrutura completa para entrar no digital — do zero ao sistema rodando.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {plans.map((pl, i) => (
          <motion.div key={pl.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 170 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            {pl.best && (
              <div className="py-1.5 text-center text-[10px] font-black tracking-widest"
                style={{ background: pl.color, color: DARK }}>MAIS CONTRATADO</div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div>
                <div className="font-black text-lg" style={{ color: pl.color }}>{pl.name}</div>
                <div className="text-white/95 text-xs">{pl.forWho}</div>
              </div>
              <div className="text-2xl font-black text-white">{pl.price}</div>
              <div className="flex-1 space-y-1.5 mt-1">
                {pl.items.map(it => (
                  <div key={it} className="flex items-center gap-2 text-xs text-white/90">
                    <span style={{ color: pl.color }}>✓</span>{it}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-white/90 text-xs text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Âncora: comprar avulso custaria R$ 15.500 · Destrava a partir de 10× R$ 197
      </motion.p>
    </div>
  )
}

// P9 — Assessoria
function PSlide09Assessoria() {
  const plans = [
    { name: 'Ativação', color: ORANGE, price: 'R$ 1.997/mês', forWho: 'Para começar do jeito certo', items: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião mensal de mentoria', 'Suporte diário no WhatsApp'] },
    { name: 'Estruturação', color: G, price: 'R$ 2.597/mês', best: true, forWho: 'Estrutura + ativação com previsibilidade', items: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião mensal de mentoria', 'Suporte diário no WhatsApp', '1 Landing page', 'Edição básica de vídeo para anúncio', 'Artes'] },
    { name: 'Aceleração', color: PUR, price: 'R$ 3.297/mês', forWho: 'Presença completa + base para escalar', items: ['Gestão de tráfego', 'Dashboard de indicadores', 'Reunião quinzenal de mentoria', 'Suporte diário no WhatsApp', '1 Landing page', 'Edição básica de vídeo para anúncio', 'Artes', 'CRM', '1 Agente de IA', 'Automação de leads'] },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-5" style={{ background: '#0f1018' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-1">Solução 3</div>
        <h2 className="text-4xl font-black text-white">📊 Assessoria de Marketing</h2>
        <p className="text-white/95 text-sm mt-1">Time dedicado, gestão mensal contínua — você foca no negócio, a gente cuida do digital.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {plans.map((pl, i) => (
          <motion.div key={pl.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 170 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            {pl.best && (
              <div className="py-1.5 text-center text-[10px] font-black tracking-widest"
                style={{ background: pl.color, color: DARK }}>MAIS CONTRATADO</div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div>
                <div className="font-black text-lg" style={{ color: pl.color }}>{pl.name}</div>
                <div className="text-white/95 text-xs">{pl.forWho}</div>
              </div>
              <div className="text-xl font-black text-white">{pl.price}</div>
              <div className="flex-1 space-y-1.5 mt-1">
                {pl.items.map(it => (
                  <div key={it} className="flex items-center gap-2 text-xs text-white/90">
                    <span style={{ color: pl.color }}>✓</span>{it}
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

// P10 — Qual é o seu momento?
function PSlide10Momento() {
  const rows = [
    { momento: 'Não tenho marca nem presença',    solucao: 'Ativos Digitais',   color: ORANGE, tag: 'Identidade Visual + Site' },
    { momento: 'Quero entrar no digital do zero', solucao: 'Destrava Digital',  color: G,      tag: 'Estrutura + tráfego + consultoria' },
    { momento: 'Já tenho estrutura, quero escalar', solucao: 'Assessoria',       color: PUR,    tag: 'Gestão mensal + time dedicado' },
    { momento: 'Preciso de site rápido e focado', solucao: 'Landing Page',      color: ORANGE, tag: 'Conversão · entrega em 7 dias' },
    { momento: 'Quero o pacote completo',         solucao: 'Destrava Aceleração', color: G,    tag: 'Site + identidade + tráfego + treinamento' },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">Qual é o seu momento?</h2>
        <p className="text-white/95 mt-2 text-sm">Cada situação tem um caminho. Nenhum cancela o outro.</p>
      </motion.div>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <motion.div key={r.momento} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.09, type: 'spring', stiffness: 180 }}
            className="grid grid-cols-2 items-center gap-4 rounded-xl px-5 py-4"
            style={{ background: '#1e2035' }}>
            <div className="text-white/90 text-sm">→ {r.momento}</div>
            <div className="flex items-center gap-3">
              <div className="font-black text-sm" style={{ color: r.color }}>{r.solucao}</div>
              <div className="text-white/90 text-xs">{r.tag}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// P11 — CTA
function PSlide11CTA() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-7" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-4">🤝</div>
        <h2 className="text-4xl font-black text-white leading-snug">
          Próximos passos
        </h2>
      </motion.div>
      <motion.div className="flex gap-5 w-full" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {[
          { icon: '✍️', num: '01', text: 'Formalizar parceria',               sub: 'Contrato e alinhamento comercial' },
          { icon: '💬', num: '02', text: 'Criar grupo no WhatsApp',            sub: 'Time + cliente no mesmo canal' },
          { icon: '📅', num: '03', text: 'Reunião inicial de projeto',         sub: 'Briefing completo e planejamento' },
        ].map((it, i) => (
          <motion.div key={it.text}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.1, type: 'spring', stiffness: 180 }}
            className="flex-1 flex flex-col items-center gap-2 px-5 py-6 rounded-2xl text-center"
            style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <div className="text-xs font-black text-white/60 tracking-widest">{it.num}</div>
            <span className="text-3xl">{it.icon}</span>
            <span className="text-white font-black text-sm leading-tight">{it.text}</span>
            <span className="text-white/80 text-xs">{it.sub}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}>
        <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-lg cursor-default shadow-2xl"
          style={{ background: DARK, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <span>📲</span>
          <span>Falar com a equipe agora</span>
        </div>
      </motion.div>
      <motion.p className="text-white/90 text-sm font-medium"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
        Quem quer resultado decide. Quem não quer, adia.
      </motion.p>
    </div>
  )
}

const PITCH_SLIDES = [
  { id: 'pc01', label: 'Capa',        C: PSlide01Cover },
  { id: 'pc02', label: 'Situação',    C: PSlide02Situacao },
  { id: 'pc03', label: 'Problema',    C: PSlide03Problema },
  { id: 'pc04', label: 'Implicação',  C: PSlide04Implicacao },
  { id: 'pc05', label: 'A virada',    C: PSlide05Virada },
  { id: 'pc06', label: 'Soluções',    C: PSlide06Portfolio },
  { id: 'pc07', label: 'Ativos',      C: PSlide07AtivosDigitais },
  { id: 'pc08', label: 'Destrava',    C: PSlide08Destrava },
  { id: 'pc09', label: 'Assessoria',  C: PSlide09Assessoria },
  { id: 'pc10', label: 'Momento',     C: PSlide10Momento },
  { id: 'pc11', label: 'CTA',         C: PSlide11CTA },
]

// ══════════════════════════════════════════════════════════════════════════════
//   MAIN
// ══════════════════════════════════════════════════════════════════════════════

export default function TrafegonComercial() {
  const [produto, setProduto] = useState('pitch')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 p-1 rounded-xl self-start" style={{ background: '#1e2035' }}>
        {[
          { value: 'pitch',      label: '📋 Pitch Completo' },
          { value: 'destrava',   label: '🔓 Destrava Digital' },
          { value: 'assessoria', label: '📊 Assessoria' },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setProduto(value)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: produto === value ? G : 'transparent',
              color: produto === value ? DARK : '#a8b0cc',
            }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={produto}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}>
          {produto === 'pitch' && (
            <Slideshow slides={PITCH_SLIDES} accentColor={G} />
          )}
          {produto === 'destrava' && (
            <Slideshow slides={DESTRAVA_SLIDES} accentColor={G}
              modeOptions={[
                { value: 'empresas',  label: '🏢 Empresas' },
                { value: 'advocacia', label: '⚖️ Advocacia' },
              ]}
            />
          )}
          {produto === 'assessoria' && (
            <Slideshow slides={ASSESSORIA_SLIDES} accentColor={G} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
