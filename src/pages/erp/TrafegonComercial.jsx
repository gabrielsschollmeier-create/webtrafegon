import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { PALESTRA_CAF_SLIDES } from './PalestraCAF'
import { BONUS_GADS_SLIDES } from './BonusGoogleAds'
import { IMPLEMENTACAO_APRES_SLIDES } from './ImplementacaoApresentacao'

const EsClub = lazy(() => import('./EsClub'))

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

export function Slideshow({ slides, accentColor = G, fsDefault = false, modeOptions = null, fixedMode = null, responsive = false, fillWidth = false }) {
  const [cur,  setCur]  = useState(0)
  const [dir,  setDir]  = useState(1)
  const [mode, setMode] = useState(fixedMode ?? (modeOptions ? modeOptions[0].value : null))
  const [fs,   setFs]   = useState(fsDefault)
  const [scale, setScale] = useState(() =>
    responsive ? Math.min(window.innerWidth / 1280, (window.innerHeight - 80) / 720) : 1
  )
  // Largura do palco. Com fillWidth, ele estica além dos 1280 para ocupar
  // telas mais largas que 16:9 — a altura de 720 continua sendo a referência.
  const [canvasW, setCanvasW] = useState(1280)
  const [isMobile, setIsMobile] = useState(() => responsive && window.innerWidth < 640)
  const areaRef  = useRef(null)
  const touchX   = useRef(null)

  useEffect(() => {
    if (!responsive || !areaRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      // Telas estreitas: o palco encolhe até caber inteiro, sem esticar a largura.
      // Assim o slide continua sendo o mesmo de 1280×720 — só menor.
      if (width < 640) {
        setScale(Math.min(width / 1280, height / 720))
        setCanvasW(1280)
      } else if (fillWidth) {
        const s = height / 720
        setScale(s)
        setCanvasW(Math.max(1280, Math.round(width / s)))
      } else {
        setScale(Math.min(width / 1280, height / 720))
        setCanvasW(1280)
      }
    })
    obs.observe(areaRef.current)
    return () => obs.disconnect()
  }, [responsive, fillWidth])

  useEffect(() => {
    if (!responsive) return
    const fn = () => setIsMobile(responsive && window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [responsive])

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

  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const progress = ((cur + 1) / slides.length) * 100
  const { C: Slide } = slides[cur]
  const showToggle = modeOptions && !fixedMode
  // Modo apresentação: tela cheia sem nenhuma moldura, o slide ocupa 100%.
  const palco = fs && fillWidth

  return (
    <div className={fs ? `fixed inset-0 z-[300] flex flex-col ${palco ? 'p-0' : 'p-4'}` : responsive ? 'flex-1 flex flex-col min-h-0' : ''}
      style={fs ? { background: '#0a0b12' } : {}}>

      {palco && (
        <button onClick={() => setFs(false)} title="Sair da tela cheia (Esc)"
          className="fixed top-4 right-4 z-[310] p-2 rounded-xl text-white/95 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <Minimize2 size={18} />
        </button>
      )}

      {/* Toolbar */}
      <div className={`items-center justify-between mb-3 gap-3 flex-shrink-0 ${palco ? 'hidden' : 'flex'}`}>
        {showToggle ? (
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
      <div className={`h-1 rounded-full mb-3 overflow-hidden flex-shrink-0 ${palco ? "hidden" : ""}`} style={{ background: "#1e2035" }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}80` }} />
      </div>

      {/* Slide area */}
      <div ref={areaRef}
        className={`group relative rounded-2xl overflow-hidden flex-1 min-h-0 ${fillWidth && !isMobile ? 'px-14' : ''}`}
        style={{ aspectRatio: (fs || responsive) ? undefined : '16 / 9' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`${cur}-${mode}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0">
            {responsive ? (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: canvasW, height: 720,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: 'center center',
              }}>
                <Slide mode={mode} />
              </div>
            ) : (
              <Slide mode={mode} />
            )}
          </motion.div>
        </AnimatePresence>

        {cur > 0 && (
          <button onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all z-10 opacity-40 hover:opacity-100 focus:opacity-100"
            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft className="text-white" size={20} />
          </button>
        )}
        {cur < slides.length - 1 && (
          <button onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all z-10 opacity-40 hover:opacity-100 focus:opacity-100"
            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight className="text-white" size={20} />
          </button>
        )}
      </div>

      {/* Dot nav */}
      <div className={`gap-2 justify-center mt-3 flex-shrink-0 flex-wrap ${palco || isMobile ? "hidden" : "flex"}`}>
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
      { icon: '🎬', text: 'Mini tutoriais gravados' },
      { icon: '💬', text: 'Suporte WhatsApp — 15 dias' },
    ],
    forEmpresas:  ['Empresas iniciando no digital', 'Primeiro contato com tráfego', 'Validação de demanda'],
    forAdvocacia: ['Advogado autônomo iniciando',   'Primeiro contato com tráfego', 'Validação de demanda'],
  },
  {
    name: 'Estruturação',
    sub: 'Estrutura + ativação com previsibilidade',
    color: G,
    price10: '347', priceAV: '3.370',
    best: true,
    deliveries: [
      { icon: '🤝', text: 'Reunião inicial de projeto' },
      { icon: '📡', text: 'Campanhas em 2 canais' },
      { icon: '🖥️', text: '1 Landing Page de conversão' },
      { icon: '📍', text: 'Google Meu Negócio otimizado' },
      { icon: '📱', text: 'Instagram e Facebook organizados' },
      { icon: '🎓', text: 'Consultoria — 4h em 2 encontros' },
      { icon: '📚', text: 'Mini tutoriais gravados' },
      { icon: '💬', text: 'Suporte WhatsApp — 30 dias' },
    ],
    forEmpresas:  ['Empresas que querem previsibilidade', 'Estrutura mínima profissional'],
    forAdvocacia: ['Advogados que querem previsibilidade', 'Estrutura mínima profissional'],
  },
  {
    name: 'Aceleração',
    sub: 'Presença completa + base para escalar',
    color: PUR,
    price10: '517', priceAV: '4.970',
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
        <motion.img src="/logo-trafegon.png" alt="TráfegOn"
          className="mx-auto mb-5 rounded-2xl"
          style={{ width: 88, height: 88, filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.28))' }}
          initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} />
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
  { id: 'situacao',    label: 'Situação',       C: PSlide02Situacao },
  { id: 'problema',    label: 'Problema',       C: PSlide03Problema },
  { id: 'implicacao',  label: 'Implicação',     C: PSlide04Implicacao },
  { id: 'virada',      label: 'A virada',       C: PSlide05Virada },
  { id: 'produto',     label: 'Produto',        C: DSlideProduto },
  { id: 'planos',      label: 'Planos',         C: DSlidePlanos },
  { id: 'comparacao',  label: 'Comparação',     C: DSlideComparacao },
  { id: 'proximos',    label: 'Próx. passos',   C: DSlideProximosPassos },
  { id: 'cta',         label: 'CTA',            C: DSlideCTA },
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
        <motion.img src="/logo-trafegon.png" alt="TráfegOn"
          className="mx-auto mb-5 rounded-2xl"
          style={{ width: 88, height: 88, filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.28))' }}
          initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} />
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
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f3faec 52%, #e6f4d6 100%)' }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 220 + i * 130, height: 220 + i * 130, border: `1.5px solid rgba(110,218,44,${0.18 - i * 0.025})`, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 28 + i * 8, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center px-8 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.84 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.img src="/logo-trafegon.png" alt="TráfegOn — Gerando negócios, para o seu negócio"
          style={{ width: 440, height: 'auto', display: 'block', filter: 'drop-shadow(0 16px 36px rgba(26,29,46,0.13))' }}
          initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} />
        <motion.div className="mt-10 inline-block px-8 py-3 rounded-full font-bold text-base"
          style={{ background: G, color: DARK, boxShadow: '0 14px 32px rgba(110,218,44,0.38)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.42 }}>
          Estrutura digital que gera resultado — do ativo ao sistema completo.
        </motion.div>
      </motion.div>
    </div>
  )
}

// P2 — Situação (SPIN-S)
function PSlide02Situacao({ mode }) {
  const adv = mode === 'advocacia'
  const title = adv
    ? <>Seu cliente já está online.<br />A escolha dele também.</>
    : <>Seu cliente já está online.<br />A decisão dele também.</>
  const stats = [
    { icon: '💬', val: '147 mi', top: 'WhatsApp',
      label: 'de brasileiros — o 2º maior mercado do mundo. É onde a conversa que vira contrato acontece.' },
    { icon: '📸', val: '122 mi', top: 'Instagram',
      label: adv
        ? 'usuários ativos no Brasil. Antes de te contratar, ele abre seu perfil para ver com quem está falando.'
        : 'usuários ativos no Brasil. Antes de comprar, ele abre seu perfil para ver com quem está falando.' },
    { icon: '🔍', val: '8,5 bi', top: 'Google',
      label: adv
        ? 'buscas por dia. Quem tem um problema jurídico agora está digitando — e vai chamar quem aparecer.'
        : 'buscas por dia. Quem tem o problema que você resolve está digitando agora — e vai chamar quem aparecer.' },
  ]
  const footer = adv
    ? 'Ninguém escolhe advogado sem pesquisar antes. A dúvida não é se ele vai te procurar na internet — é o que ele vai encontrar.'
    : 'Ninguém decide sem pesquisar antes. A dúvida não é se ele vai te procurar na internet — é o que ele vai encontrar.'
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white leading-tight">{title}</h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {stats.map((it, i) => (
          <motion.div key={it.val + i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-6 flex flex-col gap-2 text-center"
            style={{ background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div className="text-2xl">{it.icon}</div>
            <div className="text-5xl font-black text-white leading-none">{it.val}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{it.top}</div>
            <div className="text-white/90 text-xs leading-relaxed mt-1">{it.label}</div>
          </motion.div>
        ))}
      </div>
      {footer && (
        <motion.p className="text-center text-white/95 text-sm font-medium"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          {footer}
        </motion.p>
      )}
    </div>
  )
}

// P3 — Problema (SPIN-P)
function PSlide03Problema({ mode }) {
  const adv = mode === 'advocacia'
  const title = adv ? 'Três estágios que travam o crescimento do escritório' : 'Três estágios que travam o crescimento'
  const probs = adv
    ? [
        { icon: '👻', color: RED,    title: 'Invisível',                desc: 'Depende só de indicação. Sem presença digital, o escritório cresce devagar e fica preso a quem já te conhece.' },
        { icon: '⚙️', color: ORANGE, title: 'Presente, sem processo',   desc: 'Tem perfil no Instagram ou site, mas sem CTA claro e sem follow-up. O potencial cliente consulta e some.' },
        { icon: '🔥', color: PUR,    title: 'Tem lead, perde na consulta', desc: 'Gera interesse mas não converte em cliente. Falta agilidade no atendimento, script e proposta clara.' },
      ]
    : [
        { icon: '👻', color: RED,    title: 'Invisível',               desc: 'Sem presença digital. Leads chegam só por indicação — crescimento lento e imprevisível.' },
        { icon: '⚙️', color: ORANGE, title: 'Presente, sem processo',  desc: 'Tem redes sociais ou site, mas sem funil, sem CTA claro, sem acompanhamento. Lead some.' },
        { icon: '🔥', color: PUR,    title: 'Tem lead, perde na venda', desc: 'Gera interesse mas não fecha. Falta script, CRM, follow-up. O esforço não vira receita.' },
      ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">{title}</h2>
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
function PSlide04Implicacao({ mode }) {
  const adv = mode === 'advocacia'
  const items = adv
    ? [
        { icon: '📉', color: RED,    title: 'Caso perdido',         desc: 'Quem precisava de um advogado buscou, não encontrou ou não confiou — e contratou o escritório que aparecia.' },
        { icon: '🔄', color: ORANGE, title: 'Reputação invisível',  desc: 'Sua expertise não está na internet. Para quem ainda não te conhece, você simplesmente não existe.' },
        { icon: '⏳', color: PUR,    title: 'Crescimento limitado', desc: 'Sem estrutura digital, o escritório fica preso à rede pessoal — e rede pessoal tem teto.' },
      ]
    : [
        { icon: '📉', color: RED,    title: 'Lead perdido',         desc: 'Quem te busca e não encontra vai para o concorrente. Esse lead nunca volta.' },
        { icon: '🔄', color: ORANGE, title: 'Esforço desperdiçado', desc: 'Investir em tráfego sem estrutura de conversão é jogar dinheiro fora.' },
        { icon: '⏳', color: PUR,    title: 'Crescimento travado',  desc: 'Sem processo comercial, o crescimento fica preso à capacidade de um dono de fechar tudo na mão.' },
      ]
  const callout = adv
    ? { line1: 'Não ter presença digital hoje não é "ser discreto".', line2: 'É escolher crescer menos do que pode.' }
    : { line1: 'Não ter estrutura digital hoje não é "estar começando".', line2: 'É escolher perder para quem tem.' }
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-7" style={{ background: '#0f1018' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">O custo de não resolver</h2>
        <p className="text-white/90 mt-2 text-sm">Cada mês sem estrutura é receita que fica na mesa.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((it, i) => (
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
          {callout.line1}<br />
          <span className="text-white font-black text-base">{callout.line2}</span>
        </p>
      </motion.div>
    </div>
  )
}

// P5 — A virada (SPIN-N)
function PSlide05Virada({ mode }) {
  const adv = mode === 'advocacia'
  const rows = adv
    ? [
        { before: 'Depende só de indicação',              after: 'Canal digital que atrai leads qualificados todo mês' },
        { before: 'Presença fraca ou inexistente',        after: 'Autoridade estabelecida antes da primeira consulta' },
        { before: 'Lead some sem atendimento',            after: 'Funil que converte contato em cliente' },
        { before: 'Crescimento preso à rede pessoal',     after: 'Sistema que funciona mesmo quando você está em audiência' },
      ]
    : [
        { before: 'Depende só de indicação',          after: 'Canal digital previsível de leads' },
        { before: 'Sem presença ou presença fraca',   after: 'Credibilidade antes do primeiro contato' },
        { before: 'Lead some sem resposta',           after: 'Funil e follow-up que fecham por você' },
        { before: 'Crescimento na mão do dono',       after: 'Sistema que funciona mesmo sem você' },
      ]
  const footer = adv
    ? 'Temos caminhos para cada momento do seu escritório. Veja as opções.'
    : 'Temos caminhos para cada momento do seu negócio. Veja as opções.'
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6" style={{ background: GBG }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
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
        {footer}
      </motion.p>
    </div>
  )
}

// ── CAMINHO DO CONTRATO ───────────────────────────────────────────────────────
const CAMINHO = [
  { n: '01', nome: 'Aparece',   furo: 'Ninguém te encontra quando procura' },
  { n: '02', nome: 'Convence',  furo: 'Te encontram e não confiam no que veem' },
  { n: '03', nome: 'Chama',     furo: 'Confiam, mas não têm por onde falar' },
  { n: '04', nome: 'Responde',  furo: 'Chamam e ninguém responde a tempo' },
  { n: '05', nome: 'Conduz',    furo: 'Responde, mas não leva até a decisão' },
  { n: '06', nome: 'Recomenda', furo: 'Contrata bem atendido e ninguém fica sabendo' },
]

// P5b — O caminho furado (funil decrescente)
const ALTURAS = [100, 78, 60, 44, 30, 18]

function PSlideCaminhoFuros({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'negócio'
  return (
    <div className="h-full flex flex-col p-7 gap-4" style={{ background: '#0f1018' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black text-white">O caminho até o contrato</h2>
        <p className="text-white/45 mt-1 text-sm">Todo cliente do seu {word} passa por aqui. Em cada ponto, alguém desiste.</p>
      </motion.div>

      <div className="flex-1 flex items-end gap-2 min-h-0 px-2">
        {CAMINHO.map((p, i) => (
          <div key={p.n} className="flex-1 flex flex-col justify-end h-full gap-2">
            {/* barra decrescente */}
            <div className="flex-1 flex items-end justify-center relative">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${ALTURAS[i]}%`, opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg relative"
                style={{
                  background: `linear-gradient(180deg, ${RED}${i === 0 ? '55' : '33'}, ${RED}0a)`,
                  borderTop: `2px solid ${RED}${i === 0 ? 'cc' : '77'}`,
                }}>
                {i > 0 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.12 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-black whitespace-nowrap"
                    style={{ color: RED }}>
                    ↓ perde
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* etapa */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}
              className="text-center">
              <div className="text-[10px] font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.n}</div>
              <div className="text-white font-black text-[13px] uppercase tracking-wide leading-none mt-0.5">{p.nome}</div>
            </motion.div>

            {/* furo */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.12 }}
              className="rounded-lg px-2 py-2 text-center min-h-[54px] flex items-center justify-center"
              style={{ background: RED + '0d', border: `1px solid ${RED}26` }}>
              <span className="text-white/65 text-[10.5px] leading-snug">{p.furo}</span>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="rounded-xl py-3 px-8 text-center mx-auto"
        style={{ background: RED + '10', border: `1px solid ${RED}28` }}>
        <p className="text-white/70 text-[13px]">
          Tráfego não conserta o caminho. Coloca mais gente nele.<br />
          <span className="text-white font-black text-[15px]">Se o caminho tem furo, você só perde mais rápido — e mais caro.</span>
        </p>
      </motion.div>
    </div>
  )
}

// P5c — O caminho resolvido
function PSlideCaminhoSolucoes() {
  const solucoes = [
    { label: 'Destrava Tráfego',   span: 1, color: G },
    { label: 'Destrava Branding',  span: 2, color: ORANGE },
    { label: 'Destrava Conversão', span: 2, color: BLUE },
    { label: 'Assessoria',         span: 1, color: GOLD },
  ]
  return (
    <div className="h-full flex flex-col p-7 gap-4" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black text-white">Cada serviço tapa um furo</h2>
        <p className="text-white/45 mt-1 text-sm">O mesmo caminho, sem vazamento.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="relative rounded-2xl px-5 pt-7 pb-5 flex-1 flex flex-col justify-center gap-4"
        style={{ border: `1.5px solid ${GOLD}55`, background: GOLD + '07' }}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap"
          style={{ background: GOLD, color: DARK }}>
          ASSESSORIA · CUIDA DO CAMINHO INTEIRO, TODO MÊS
        </div>

        {/* trilho contínuo com as etapas */}
        <div className="relative">
          <div className="absolute left-[8%] right-[8%] top-[18px] h-[3px] rounded-full"
            style={{ background: `linear-gradient(90deg, ${G}00, ${G}88 12%, ${G}88 88%, ${G}00)` }} />
          <div className="grid grid-cols-6 gap-2 relative">
            {CAMINHO.map((p, i) => (
              <motion.div key={p.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-black relative z-10"
                  style={{ background: DARK, border: `2px solid ${G}`, color: G }}>
                  ✓
                </div>
                <div className="text-white font-black text-[12px] uppercase tracking-wide leading-none">{p.nome}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* soluções */}
        <div className="grid grid-cols-6 gap-2">
          {solucoes.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.09, type: 'spring', stiffness: 170 }}
              className={`rounded-xl px-2 py-4 text-center flex items-center justify-center ${s.span === 2 ? 'col-span-2' : ''}`}
              style={{ background: s.color + '16', border: `1.5px solid ${s.color}50` }}>
              <span className="font-black text-[12px] leading-tight" style={{ color: s.color }}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
          className="flex items-center gap-3">
          <span className="text-[11px] font-black" style={{ color: GOLD }}>◄</span>
          <div className="h-px flex-1" style={{ background: `repeating-linear-gradient(90deg, ${GOLD}55 0 6px, transparent 6px 12px)` }} />
          <span className="text-white/55 text-[11px] whitespace-nowrap">o cliente bem atendido traz o próximo</span>
          <div className="h-px flex-1" style={{ background: `repeating-linear-gradient(90deg, ${GOLD}55 0 6px, transparent 6px 12px)` }} />
          <span className="text-[11px] font-black" style={{ color: GOLD }}>►</span>
        </motion.div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="text-center text-white/55 text-[13px]">
        Os Destravas tapam um furo cada. <span className="text-white font-bold">A Assessoria mantém os seis fechados, todo mês.</span>
      </motion.p>
    </div>
  )
}

// ── LINHA DESTRAVA · slides de produto ────────────────────────────────────────
function ProdutoSlide({ eyebrow, cor, dor, contexto, blocos, inclusos, preco, precoSub, extras, fecho, bg = DARK }) {
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-4" style={{ background: bg }}>
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: cor }}>{eyebrow}</div>
        <h2 className="text-3xl font-black text-white leading-tight">{dor}</h2>
        <p className="text-white/60 text-sm mt-2 max-w-3xl leading-relaxed">{contexto}</p>
      </motion.div>

      <div className="grid grid-cols-[1.35fr_0.65fr] gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          {blocos.map((b, i) => (
            <motion.div key={b.titulo} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.09 }}
              className="rounded-xl px-4 py-3 flex-1"
              style={{ background: cor + '0d', border: `1px solid ${cor}28` }}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-black text-sm" style={{ color: cor }}>{b.titulo}</span>
                {b.avulso && <span className="text-[10px] font-bold text-white/40 whitespace-nowrap">avulso {b.avulso}</span>}
              </div>
              <p className="text-white/75 text-[11px] leading-snug">{b.itens}</p>
            </motion.div>
          ))}
          {inclusos && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Inclusos · </span>
              <span className="text-white/65 text-[11px]">{inclusos}</span>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 flex flex-col justify-center gap-3 text-center"
          style={{ background: cor + '12', border: `1.5px solid ${cor}50` }}>
          <div className="text-4xl font-black text-white leading-none">{preco}</div>
          {precoSub && <div className="text-white/50 text-[11px] leading-snug">{precoSub}</div>}
          {extras && (
            <div className="pt-3 space-y-1.5" style={{ borderTop: `1px solid ${cor}30` }}>
              {extras.map(e => (
                <div key={e} className="text-[11px] leading-snug" style={{ color: cor }}>{e}</div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="text-center text-white/70 text-sm italic">
        {fecho}
      </motion.p>
    </div>
  )
}

// Slide único da linha Destrava — formato comparativo (estilo Assessoria)
const DESTRAVAS = [
  {
    nome: 'Branding', cor: ORANGE, parcela: '597,70', avista: '5.677', desconto: '300', total: '5.977',
    dor: 'Te encontram — e escolhem o outro',
    itens: [
      { t: 'Identidade visual completa', tag: true },
      { t: 'Site institucional (5 páginas)', tag: true },
      { t: 'Google Meu Negócio otimizado' },
      { t: 'Instagram e Facebook organizados' },
      { t: 'Consultoria 2h + tutoriais' },
      { t: 'Suporte WhatsApp 15 dias' },
    ],
    nota: 'Com landing page no lugar do site: 10× R$ 347,70',
    avulsos: [
      { n: 'Identidade Visual', p: '297,70' },
      { n: 'Site Institucional', p: '397,70' },
      { n: 'Landing Page', p: '147,70' },
    ],
    avulsoNota: 'abatido no pacote em até 90 dias',
  },
  {
    nome: 'Conversão', cor: BLUE, parcela: '247,70', avista: '2.347', desconto: '130', total: '2.477',
    dor: 'O lead chega e morre no WhatsApp',
    itens: [
      { t: 'Diagnóstico e desenho do funil' },
      { t: 'CRM montado + régua de follow-up' },
      { t: 'Scripts de abordagem (OAB)' },
      { t: 'Playbook comercial documentado' },
      { t: 'Time treinado + checklist' },
      { t: 'Suporte WhatsApp 30 dias' },
    ],
    nota: '3 encontros 1:1 · 3 a 5 semanas',
  },
  {
    nome: 'Tráfego', cor: G, parcela: '297,70', avista: '2.827', desconto: '150', total: '2.977',
    dor: 'Ninguém te encontra quando procura',
    itens: [
      { t: 'Campanhas em 2 canais', tag: true },
      { t: 'Rastreamento e conversões' },
      { t: 'CPL meta e conta de leads' },
      { t: 'Painel de acompanhamento' },
      { t: 'Consultoria 2h30 + tutoriais' },
      { t: 'Suporte WhatsApp 30 dias' },
    ],
    avulsos: [
      { n: 'Só Meta Ads', p: '197,70' },
      { n: 'Só Google Ads', p: '197,70' },
    ],
    avulsoNota: 'o 2º canal entra depois, pela diferença',
  },
  {
    nome: 'Sistema', cor: PUR, parcela: '847,70', avista: '8.047', desconto: '430', total: '8.477', best: true,
    dor: 'O caminho inteiro, na ordem certa',
    itens: [
      { t: 'Tudo do Branding' },
      { t: 'Tudo da Conversão' },
      { t: 'Tudo do Tráfego' },
      { t: 'Cronograma único das 3 frentes' },
      { t: 'Consultoria 6h · suporte 90 dias' },
      { t: 'Revisão no dia 60 com os números' },
    ],
    nota: 'Separado sairia 10× R$ 1.143,10 — economia de R$ 2.954',
  },
]

function PSlideDestravas() {
  return (
    <div className="h-full flex flex-col p-5 gap-2.5" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-white">🔓 Destravas</h2>
        <p className="text-white/50 text-[13px] mt-0.5">Construímos e entregamos pronto. Você opera.</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-2.5 flex-1 min-h-0">
        {DESTRAVAS.map((d, i) => (
          <motion.div key={d.nome} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, type: 'spring', stiffness: 170 }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: '#1e2035', border: `1.5px solid ${d.cor}${d.best ? '70' : '2a'}` }}>

            {d.best && (
              <div className="py-1 text-center text-[9px] font-black tracking-widest"
                style={{ background: d.cor, color: 'white' }}>MAIS COMPLETO</div>
            )}

            <div className="px-3 pt-3 pb-2.5 text-center" style={{ background: d.cor + '14' }}>
              <div className="font-black text-base leading-none" style={{ color: d.cor }}>{d.nome}</div>
              <p className="text-white/50 text-[10px] italic mt-1 leading-snug min-h-[26px]">"{d.dor}"</p>

              <div className="mt-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/35">10× sem juros</div>
                <div className="text-[26px] font-black text-white leading-none mt-0.5">R$ {d.parcela}</div>
                <div className="mt-2 rounded-lg px-2 py-1.5 inline-block"
                  style={{ background: d.cor + '22', border: `1px solid ${d.cor}55` }}>
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: d.cor }}>À vista </span>
                  <span className="text-[15px] font-black" style={{ color: d.cor }}>−R$ {d.desconto}</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-2.5 flex-1 space-y-1">
              {d.itens.map(it => (
                <div key={it.t} className="flex items-start gap-1.5">
                  <span className="text-[9px] flex-shrink-0 mt-[3px]" style={{ color: d.cor }}>✓</span>
                  <span className="text-white/80 text-[10.5px] leading-snug flex-1">
                    {it.t}
                    {it.tag && (
                      <span className="ml-1 text-[8px] font-black px-1 py-[1px] rounded align-middle"
                        style={{ background: d.cor + '2e', color: d.cor }}>AVULSO</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {d.avulsos && (
              <div className="mx-2.5 mb-2 rounded-xl px-2.5 py-2"
                style={{ background: d.cor + '18', border: `1.5px solid ${d.cor}60` }}>
                <div className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: d.cor }}>
                  Dá para contratar separado
                </div>
                {d.avulsos.map(a => (
                  <div key={a.n} className="flex items-baseline justify-between gap-1.5 leading-tight">
                    <span className="text-white/75 text-[10px]">{a.n}</span>
                    <span className="text-white font-black text-[10.5px] whitespace-nowrap">10× {a.p}</span>
                  </div>
                ))}
                <div className="text-[8.5px] text-white/45 mt-1.5 leading-snug">
                  {d.avulsoNota}
                </div>
              </div>
            )}

            {d.nota && (
              <div className="px-3 py-2 text-[9.5px] leading-snug"
                style={{ borderTop: `1px solid ${d.cor}22`, color: d.cor }}>
                {d.nota}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PSlideBranding() {
  return (
    <ProdutoSlide
      eyebrow="🎨 Destrava Branding"
      cor={ORANGE}
      dor="Te encontram — e escolhem o outro."
      contexto="O cliente pesquisou, achou você, abriu seu perfil. E foi para o escritório ao lado. Não foi o preço: foi o que ele viu em cinco segundos."
      blocos={[
        { titulo: 'Identidade visual completa', avulso: 'R$ 2.997', itens: 'Logo em 2 variações · paleta · tipografia · monograma · foto de perfil · cartão digital · papel timbrado · mini manual' },
        { titulo: 'Site institucional', avulso: 'R$ 3.997', itens: 'Até 5 páginas personalizadas · SEO on-page · Google Analytics · responsivo · entrega em 15 dias' },
      ]}
      inclusos="Google Meu Negócio otimizado · Instagram e Facebook organizados · reunião inicial de projeto · consultoria estratégica 2h gravada · mini tutoriais gravados · suporte WhatsApp 15 dias"
      preco="R$ 5.997"
      precoSub="soma avulsa R$ 6.994"
      extras={['Variação com landing page: R$ 3.497', 'Landing page avulsa: R$ 1.497', 'O que for avulso é abatido no pacote em até 90 dias']}
      fecho="Marca fraca não perde cliente uma vez. Perde todos os dias, sem você saber quantos."
    />
  )
}

function PSlideConversao() {
  return (
    <ProdutoSlide
      eyebrow="⚖️ Destrava Conversão"
      cor={BLUE}
      bg="#0f1018"
      dor="O lead chegou. E morreu no seu WhatsApp."
      contexto="Você pagou para ele chegar. Ele mandou mensagem. Alguém respondeu horas depois, sem script, e nunca mais deu retorno. É o furo mais caro que existe — nele você perde quem já custou dinheiro."
      blocos={[
        { titulo: '1 · Diagnóstico e Funil', itens: 'Mapeamos por onde os leads chegam e onde vazam. Desenhamos o funil ideal.' },
        { titulo: '2 · CRM e Cadência', itens: 'CRM montado ao vivo, com pipeline e automações + régua de follow-up.' },
        { titulo: '3 · Abordagem e Scripts', itens: 'Scripts de contato, qualificação e proposta — dentro do Provimento 205/2021 da OAB.' },
        { titulo: 'Fica com você', itens: 'CRM rodando · playbook comercial documentado · time treinado com checklist de atendimento' },
      ]}
      inclusos="30 dias de suporte WhatsApp · 3 a 5 semanas de implementação · 3 encontros 1:1"
      preco="R$ 2.497"
      precoSub="10× R$ 249,70 no cartão"
      extras={['À vista R$ 2.247,30']}
      fecho="Não falta lead. Falta processo para fechar os que já chegam."
    />
  )
}

function PSlideTrafego() {
  return (
    <ProdutoSlide
      eyebrow="📡 Destrava Tráfego"
      cor={G}
      dor="Enquanto você espera indicação, alguém está sendo procurado agora."
      contexto="Neste minuto tem gente digitando exatamente o que você resolve. Aparece quem estruturou para aparecer."
      blocos={[
        { titulo: 'Campanhas em 2 canais', itens: 'Estrutura completa de campanha em Meta Ads e Google Ads.' },
        { titulo: 'Rastreamento configurado', itens: 'Pixel, eventos e conversões — para você saber de onde vem cada lead.' },
        { titulo: 'CPL meta e conta de leads', itens: 'Definimos seu custo por lead alvo e quantos leads você precisa para fechar 1 cliente.' },
        { titulo: 'Painel de acompanhamento', itens: 'Os números do mês na sua mão, sem depender de ninguém.' },
      ]}
      inclusos="Reunião inicial de projeto · consultoria estratégica 2h30 gravada · mini tutoriais gravados · suporte WhatsApp 30 dias"
      preco="R$ 2.997"
      extras={['Variação com 1 canal: R$ 1.997', 'Meta ou Google · consultoria 1h30 · suporte 15 dias']}
      fecho="Indicação é sorte com nome bonito. Aquisição é processo."
    />
  )
}

function PSlideSistema() {
  return (
    <ProdutoSlide
      eyebrow="🚀 Destrava Sistema"
      cor={PUR}
      dor="O caminho inteiro, na ordem certa."
      contexto="Consertar um trecho ajuda. Consertar os três, encaixados, muda o patamar — porque cada um multiplica o resultado do outro."
      blocos={[
        { titulo: 'Tudo do Destrava Branding', avulso: 'R$ 5.997', itens: 'Identidade visual completa · site institucional · Google Meu Negócio · perfis organizados' },
        { titulo: 'Tudo do Destrava Conversão', avulso: 'R$ 2.497', itens: 'CRM montado · playbook comercial · scripts · time treinado' },
        { titulo: 'Tudo do Destrava Tráfego', avulso: 'R$ 2.997', itens: 'Campanhas em 2 canais · rastreamento · CPL meta · painel' },
        { titulo: 'Só no Sistema', itens: 'Cronograma único com as três frentes em sequência · consultoria 6h gravada · suporte 90 dias · sessão de revisão no dia 60 com os números rodando' },
      ]}
      preco="R$ 8.497"
      precoSub="soma dos três separados: R$ 11.491"
      extras={['Economia de R$ 2.994']}
      fecho="Marca boa com atendimento ruim não fecha. Atendimento bom sem gente chegando não tem o que fechar."
    />
  )
}

// P6 — Portfólio completo (visão geral)
function PSlide06Portfolio() {
  const products = [
    { icon: '🎨', color: ORANGE, title: 'Ativos Digitais',   sub: 'Avulso · pagamento único', items: ['Identidade Visual', 'Landing Page', 'Site Institucional'], tag: 'a partir de R$ 797' },
    { icon: '🔓', color: G,      title: 'Destrava Digital',  sub: 'Estrutura completa do zero', items: ['Tráfego + consultoria', 'Landing page inclusa', 'Mini tutoriais gravados + treinamento'], tag: 'a partir de 10× R$ 197', best: true },
    { icon: '📊', color: PUR,    title: 'Assessoria',        sub: 'Gestão mensal contínua', items: ['Campanhas + CRM', 'Funil + automações', 'Time dedicado ao seu negócio'], tag: 'a partir de R$ 1.997/mês' },
    { icon: '⚖️', color: BLUE,   title: 'Implementação Comercial', sub: 'Consultoria 1:1 · advocacia', items: ['CRM montado + funil', 'Playbook + scripts (OAB)', 'Quem atende, treinado'], tag: '3 encontros · 10× R$ 299,70' },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-6" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white">O que podemos fazer por você</h2>
        <p className="text-white/95 mt-2 text-sm">Cada produto resolve um momento diferente — e eles se complementam.</p>
      </motion.div>
      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {products.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.11, type: 'spring', stiffness: 160 }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: p.color + '0d', border: `2px solid ${p.color}${p.best ? '55' : '25'}` }}>
            {p.best && (
              <div className="py-1.5 text-center text-[10px] font-black tracking-widest"
                style={{ background: p.color, color: DARK }}>MAIS CONTRATADO</div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div>
                <div className="text-2xl mb-1.5">{p.icon}</div>
                <div className="font-black text-lg leading-tight" style={{ color: p.color }}>{p.title}</div>
                <div className="text-white/95 text-[11px] mt-0.5">{p.sub}</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {p.items.map(it => (
                  <div key={it} className="flex items-start gap-2 text-xs text-white/95 leading-snug">
                    <span style={{ color: p.color }}>→</span>{it}
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: `1px solid ${p.color}20` }}>
                <span className="text-[11px] font-black" style={{ color: p.color }}>{p.tag}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div className="flex items-center justify-center gap-6"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 text-sm text-white/85">
          <span>🏁</span>
          <span><b className="text-white">Ativos</b>, <b className="text-white">Destrava</b> e <b className="text-white">Implementação</b> — projeto com <b className="text-white">início, meio e fim</b></span>
        </div>
        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <div className="flex items-center gap-2 text-sm text-white/85">
          <span>🔄</span>
          <span><b className="text-white">Assessoria</b> — Método <b className="text-white">contínuo</b>, mês a mês</span>
        </div>
      </motion.div>
    </div>
  )
}

// P7 — Ativos Digitais (avulso)
function PSlide07AtivosDigitais() {
  const items = [
    {
      icon: '🎨', title: 'Identidade Visual', color: ORANGE,
      price: 'R$ 797', sub: 'pagamento único',
      includes: ['Logo em 2 variações', 'Paleta de cores + tipografia', 'Cartão de visita digital', 'Papel timbrado'],
    },
    {
      icon: '🎯', title: 'Landing Page', color: G,
      price: 'R$ 1.297', sub: 'pagamento único',
      includes: ['1 página de alta conversão', 'Copy + design + desenvolvimento', 'Responsivo · integração pixel', 'Entrega em até 7 dias'],
    },
    {
      icon: '🏛️', title: 'Site Institucional', color: PUR,
      price: 'R$ 2.497', sub: 'pagamento único',
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
    { name: 'Ativação', color: ORANGE, price: '10× R$ 197', forWho: 'Para começar do jeito certo', items: ['Reunião inicial de projeto', 'Campanhas de tráfego (1 canal)', 'Consultoria estratégica — 2h gravada', 'Mini tutoriais gravados', 'Suporte WhatsApp — 15 dias'] },
    { name: 'Estruturação', color: G, price: '10× R$ 347', best: true, forWho: 'Estrutura + ativação com previsibilidade', items: ['Campanhas em 2 canais', '1 Landing Page de conversão', 'Google Meu Negócio otimizado', 'Instagram e Facebook organizados', 'Consultoria — 4h em 2 encontros', 'Mini tutoriais gravados', 'Suporte WhatsApp — 30 dias'] },
    { name: 'Aceleração', color: PUR, price: '10× R$ 517', forWho: 'Presença completa + base para escalar', items: ['Tudo do Estruturação', 'Site institucional (3 páginas)', 'Identidade visual', 'Treinamento de vendas — 1h30'] },
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
        Comprar avulso custaria R$ 15.500 · Destrava a partir de 10× R$ 197
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

// P9b — Implementação Comercial (advocacia)
function PSlideImplementacaoPitch() {
  const items = [
    { icon: '🗂️', title: 'CRM montado',   color: BLUE, sub: 'e rodando',            includes: ['Pipeline + etapas do funil', 'Cadência de follow-up', 'Leads já cadastrados'] },
    { icon: '📘', title: 'Playbook comercial', color: G, sub: 'documentado',          includes: ['Scripts de abordagem', 'Tratamento de objeções', 'Metas + rotina semanal'] },
    { icon: '🎓', title: 'Quem atende, treinado', color: PUR,  sub: '+ conformidade OAB',     includes: ['Você, seu time ou sua IA', 'Uso do CRM no dia a dia', 'Provimento 205/2021'] },
  ]
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-5" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-black text-white/88 uppercase tracking-widest mb-1">Solução 4</div>
        <h2 className="text-4xl font-black text-white">⚖️ Implementação Comercial</h2>
        <p className="text-white/95 text-sm mt-1">Consultoria 1:1 para advocacia — do lead ao contrato em 3 encontros. Não precisa de mais leads: precisa fechar os que já chegam.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 170 }}
            className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="text-2xl">{it.icon}</div>
              <div>
                <div className="font-black text-lg" style={{ color: it.color }}>{it.title}</div>
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
        3 encontros · R$ 2.997 ou 10× R$ 299,70 · entrega: CRM + playbook + quem atende treinado
      </motion.p>
    </div>
  )
}

// P10 — Qual é o seu momento?
function PSlide10Momento() {
  const rows = [
    { momento: 'Não tenho marca nem presença',    solucao: 'Ativos Digitais',   color: ORANGE, tag: 'Identidade Visual + Site' },
    { momento: 'Quero entrar no digital do zero', solucao: 'Destrava Digital',  color: G,      tag: 'Estrutura + tráfego + consultoria' },
    { momento: 'Já tenho estrutura, e quer delegar', solucao: 'Assessoria',       color: PUR,    tag: 'Gestão mensal + time dedicado' },
    { momento: 'Preciso de site rápido e focado', solucao: 'Landing Page',      color: ORANGE, tag: 'Conversão · entrega em 7 dias' },
    { momento: 'Quer aprender para fazer o básico bem feito',         solucao: 'Destrava Aceleração', color: G,    tag: 'Site + identidade + tráfego + treinamento' },
    { momento: 'Recebo leads mas perco na hora de fechar', solucao: 'Implementação Comercial', color: BLUE, tag: 'CRM + roteiro + treino · 3 encontros' },
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

export const PITCH_SLIDES = [
  { id: 'pc01', label: 'Capa',        C: PSlide01Cover },
  { id: 'pc02', label: 'Situação',    C: PSlide02Situacao },
  { id: 'pc03', label: 'Problema',    C: PSlide03Problema },
  { id: 'pc04', label: 'Implicação',  C: PSlide04Implicacao },
  { id: 'pc5b', label: 'O caminho',   C: PSlideCaminhoFuros },
  { id: 'pc5c', label: 'As soluções', C: PSlideCaminhoSolucoes },
  { id: 'pcd',  label: 'Destravas',   C: PSlideDestravas },
  { id: 'pc09', label: 'Assessoria',  C: PSlide09Assessoria },
  { id: 'pc11', label: 'CTA',         C: PSlide11CTA },
]

// ══════════════════════════════════════════════════════════════════════════════
//   QUALIFICAÇÃO — Roteiro Leads Camila (Direct → WhatsApp)
// ══════════════════════════════════════════════════════════════════════════════

const Q_PERGUNTAS = [
  { q: 'Como é seu escritório hoje — sozinha ou com mais advogados?', pts: 'autônoma +1 · 2-3 +2 · 4+ +3', sinal: 'Destrava ↔ Assessoria' },
  { q: 'Seus clientes vêm mais de indicação ou já roda anúncio?',     pts: 'já invisto +2 · parei +1 · nunca +1 · não pretendo → corta', sinal: 'Maturidade' },
  { q: 'Tem site ou página pra onde manda esses clientes?',           pts: 'tem/funciona +1 · fraca +1 · não tenho 0', sinal: 'Site/LP/Ativos' },
  { q: 'Quando cai um cliente novo, tem quem atenda na hora?',        pts: 'processo +2 · eu mesma +1 · se perdem 0', sinal: 'Risco comercial' },
  { q: 'Faturamento médio hoje tá em qual faixa?',                    pts: '+30k +3 · 18-30k +2 · 8-18k +1 · <8k 0', sinal: 'Assessoria ↔ Destrava' },
  { q: 'Quanto consegue investir por mês (mídia + serviço)?',         pts: '+3k +3 · 1,5-3k +2 · 800-1,5k +1 · nada → corta', sinal: 'Verba' },
  { q: 'A decisão de fechar é contigo ou tem sócia?',                 pts: 'sou eu +2 · junto +1 · não sou → corta', sinal: 'Decisor' },
  { q: 'Quer começar já ou tá mais pesquisando?',                     pts: 'já +2 · 30-60d +1 · pesquisando 0', sinal: 'Timing' },
  { q: 'Prefere que a gente faça o tráfego ou aprender o caminho?',   pts: '(não pontua)', sinal: 'Assessoria vs Destrava' },
]

const Q_ROTEAMENTO = [
  { sinais: 'Não tem marca nem site — nada online', produto: 'Ativos Digitais',     tag: 'Identidade + site',        color: ORANGE },
  { sinais: 'Já existe, só precisa de página pra campanha', produto: 'Landing Page', tag: 'Conversão · ~7 dias',      color: BLUE },
  { sinais: 'Zero no digital, autônoma, validando', produto: 'Destrava',            tag: 'Estrutura + tráfego',      color: G },
  { sinais: 'Sem site e quer o pacote fechado', produto: 'Destrava Aceleração',     tag: 'Site + treino + tráfego',  color: PUR },
  { sinais: 'Fatura bem (30k+), já investe, quer delegar', produto: 'Assessoria',   tag: 'Gestão mensal + time',     color: GOLD },
]

function QCard({ children, style }) {
  return <div className="rounded-2xl p-5" style={{ background: '#1e2035', ...style }}>{children}</div>
}

function QualificacaoPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: DARK }}>

      {/* Header + fluxo */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">Qualificação — Leads Camila Masera</h2>
            <p className="text-white/60 text-sm">Público: advogadas · Fluxo: Direct → WhatsApp → Reunião</p>
          </div>
        </div>
      </div>

      {/* 1 — DIRECT */}
      <QCard style={{ borderLeft: `4px solid ${ORANGE}` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">1️⃣</span>
          <h3 className="font-black text-white">Direct — Triagem <span className="text-white/50 font-medium text-sm">(Mari)</span></h3>
        </div>
        <p className="text-white/80 text-sm mb-3">Objetivo único: descobrir <b className="text-white">se é advogada</b> e <b className="text-white">a área</b>, e puxar pro WhatsApp. <span style={{ color: RED }}>Não fala preço nem manda proposta aqui.</span></p>
        <div className="grid md:grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg p-3" style={{ background: G + '15' }}>
            <div className="font-bold" style={{ color: G }}>✓ Área que converte → sobe</div>
            <div className="text-white/70 text-xs mt-1">Família · Previdenciário · Cível · Trabalhista · Consumidor · Trânsito</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: RED + '15' }}>
            <div className="font-bold" style={{ color: RED }}>✕ Não converte → nutre</div>
            <div className="text-white/70 text-xs mt-1">Criminal · Empresarial/M&A · Tributário complexo</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#0f1018' }}>
            <div className="font-bold text-white/80">Ponte pro WhatsApp</div>
            <div className="text-white/60 text-xs mt-1">"Consigo te explicar melhor e te mandar um material pelo zap — qual teu número? 📲"</div>
          </div>
        </div>
      </QCard>

      {/* 2 — WHATSAPP */}
      <QCard style={{ borderLeft: `4px solid ${G}` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">2️⃣</span>
          <h3 className="font-black text-white">WhatsApp — Qualificação <span className="text-white/50 font-medium text-sm">(Mari)</span></h3>
        </div>
        <div className="rounded-lg p-3 mb-3" style={{ background: G + '12', border: `1px solid ${G}30` }}>
          <div className="text-xs font-black tracking-widest mb-1" style={{ color: G }}>SÓ AGENDA COM AS 4 CONFIRMAÇÕES</div>
          <div className="text-white/85 text-sm">① Escritório rodando · ② Tem verba (mín. ~R$800/mês) · ③ É ela quem decide · ④ Quer começar agora</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {Q_PERGUNTAS.map((p, i) => (
            <div key={i} className="grid md:grid-cols-[1.6fr_1.4fr_0.9fr] gap-2 items-center rounded-lg px-3 py-2" style={{ background: '#0f1018' }}>
              <span className="text-white/90 text-sm"><b className="text-white/50">Q{i + 1}.</b> {p.q}</span>
              <span className="text-white/55 text-xs">{p.pts}</span>
              <span className="text-xs font-bold" style={{ color: G }}>{p.sinal}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: RED + '18', color: RED }}>🔥 A · Quente 12+ → agenda prioritária</span>
          <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: GOLD + '18', color: GOLD }}>🟡 B · Morno 7-11 → agenda se sobrar</span>
          <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: '#334155', color: '#cbd5e1' }}>❄️ C · Frio ≤6 → nutrição</span>
        </div>
      </QCard>

      {/* 3 — ROTEAMENTO */}
      <QCard style={{ borderLeft: `4px solid ${PUR}` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">3️⃣</span>
          <h3 className="font-black text-white">Roteamento → qual serviço propor <span className="text-white/50 font-medium text-sm">(marca no CRM antes da reunião)</span></h3>
        </div>
        <div className="flex flex-col gap-2">
          {Q_ROTEAMENTO.map(r => (
            <div key={r.produto} className="grid md:grid-cols-[1.5fr_1fr] gap-3 items-center rounded-lg px-4 py-3" style={{ background: '#0f1018' }}>
              <div className="text-white/85 text-sm">→ {r.sinais}</div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm px-2.5 py-1 rounded-lg" style={{ background: r.color + '20', color: r.color }}>{r.produto}</span>
                <span className="text-white/60 text-xs">{r.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </QCard>

      {/* Deal-breakers */}
      <div className="rounded-xl px-5 py-4" style={{ background: RED + '10', border: `1px solid ${RED}30` }}>
        <span className="font-black text-sm" style={{ color: RED }}>Deal-breakers (nunca vão pra reunião): </span>
        <span className="text-white/80 text-sm">não é advogada · área que não converte · nenhuma verba agora · não decide e não traz o decisor.</span>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   IMPLEMENTAÇÃO COMERCIAL — Advocacia (3 encontros · 1:1 · Ver→Organizar→Converter)
// ══════════════════════════════════════════════════════════════════════════════

function ISlide01Cover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)` }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 160 + i * 90, height: 160 + i * 90, border: '1.5px solid rgba(255,255,255,0.12)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center px-8"
        initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="text-4xl sm:text-6xl mb-3 sm:mb-4"
          initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>⚖️</motion.div>
        <motion.div className="inline-block px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest mb-4 sm:mb-5"
          style={{ background: G, color: NAVY }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          IMPLEMENTAÇÃO COMERCIAL PARA ADVOCACIA
        </motion.div>
        <motion.div className="font-black text-white leading-none mb-5 text-[2rem] sm:text-[4.2rem] tracking-[-1px] sm:tracking-[-3px]"
          style={{ textShadow: '0 6px 32px rgba(0,0,0,0.28)' }}
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          Máquina de<br />Clientes Jurídica
        </motion.div>
      </motion.div>
    </div>
  )
}

function ISlide02Situacao() {
  return (
    <div className="h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
      <motion.div className="max-w-3xl w-full px-4 sm:px-8"
        initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative">
          <div className="absolute -bottom-8 left-16 w-0 h-0"
            style={{ borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '32px solid white' }} />
          <p className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight text-center">
            "Os leads até{' '}
            <span className="text-white rounded-lg px-3 py-1" style={{ background: BLUE }}>chegam,</span>
            {' '}mas boa parte some antes de virar cliente."
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function ISlide03Problema() {
  const holes = [
    { icon: '🕳️', color: RED,    title: 'Sem funil',        desc: 'Ninguém sabe em que etapa cada lead está. Some no meio do caminho.' },
    { icon: '🐌', color: ORANGE, title: 'Resposta lenta',   desc: 'Lead esfria em minutos. Responder horas depois é perder o cliente.' },
    { icon: '🎲', color: GOLD,   title: 'Atendimento no improviso', desc: 'Cada um fala de um jeito. Sem script, sem qualificação, sem padrão.' },
    { icon: '👻', color: PUR,    title: 'Zero follow-up',   desc: 'Quem não fechou na hora nunca mais recebe contato. Dinheiro na mesa.' },
  ]
  return (
    <div className="h-full flex flex-col p-3 sm:p-10 justify-center gap-3 sm:gap-7" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl sm:text-4xl font-black text-white">Onde o escritório perde cliente</h2>
        <p className="text-white/70 mt-1 text-sm">O tráfego traz o lead. O comercial deixa vazar.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5">
        {holes.map((h, i) => (
          <motion.div key={h.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-3 sm:p-6 flex items-start gap-3 sm:gap-4"
            style={{ background: h.color + '0d', border: `1px solid ${h.color}28` }}>
            <div className="text-xl sm:text-3xl flex-shrink-0">{h.icon}</div>
            <div>
              <div className="font-black text-sm sm:text-lg" style={{ color: h.color }}>{h.title}</div>
              <div className="text-white/80 text-xs sm:text-sm leading-relaxed mt-0.5">{h.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ISlide04Implicacao() {
  return (
    <div className="h-full flex flex-col p-5 sm:p-10 justify-center gap-5 sm:gap-8" style={{ background: '#0f1018' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl sm:text-5xl font-black text-white">A conta que ninguém faz</h2>
      </motion.div>
      <motion.div className="max-w-2xl w-full mx-auto rounded-2xl p-5 sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
        style={{ background: '#1e2035' }}>
        <div className="flex flex-col gap-4">
          {[
            { l: '10 leads/dia chegam do tráfego', v: '' },
            { l: 'Metade some por atendimento ruim', v: '−5 leads/dia' },
            { l: 'Se 1 vira contrato, a conta já muda completamente', v: '' },
          ].map((r, i) => (
            <motion.div key={r.l} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-center justify-between gap-4 pb-3"
              style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span className="text-white/85 text-base">{r.l}</span>
              {r.v && <span className="font-black text-lg whitespace-nowrap" style={{ color: r.v.includes('−') ? RED : G }}>{r.v}</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-xl py-4 px-5 sm:px-8 mx-auto text-center self-center"
        style={{ background: RED + '12', border: `1px solid ${RED}28` }}>
        <p className="text-white/95 font-medium text-sm">
          Não falta lead. <span className="text-white font-black">Falta processo pra fechar.</span>
        </p>
      </motion.div>
    </div>
  )
}

function ISlide05Virada() {
  const befores = ['Lead some sem resposta', 'Cada um atende de um jeito', 'Não sabe quantos leads tem', 'Quem não fechou é esquecido']
  const afters  = ['Resposta em minutos, com script', 'Padrão único de atendimento', 'CRM com todo o funil visível', 'Follow-up automático até fechar']
  return (
    <div className="h-full flex flex-col p-5 sm:p-8 justify-center gap-4 sm:gap-6" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}>
      <motion.h2 className="text-2xl sm:text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        O que muda no seu escritório
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <motion.div className="rounded-2xl p-6 flex flex-col gap-4"
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'rgba(0,0,0,0.32)' }}>
          <div className="text-[11px] font-black text-white/80 uppercase tracking-widest">Antes</div>
          {befores.map(b => (
            <div key={b} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center opacity-50">😰</span>
              <span className="text-white/85 text-sm line-through">{b}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="rounded-2xl p-6 flex flex-col gap-4"
          initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(110,218,44,0.14)', border: `1.5px solid ${G}55` }}>
          <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>Depois</div>
          {afters.map(a => (
            <div key={a} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">✅</span>
              <span className="text-white font-semibold text-sm">{a}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function ISlide06Jornada() {
  const encontros = [
    { n: '01', icon: '🔍', title: 'Diagnóstico & Funil',    desc: 'Mapeamos por onde os leads chegam e onde vazam. Desenhamos o funil ideal.' },
    { n: '02', icon: '🗂️', title: 'CRM & Cadência',         desc: 'CRM montado ao vivo + rotina de follow-up.' },
    { n: '03', icon: '💬', title: 'Abordagem & Roteiro',     desc: 'Scripts de contato, qualificação e proposta — o roteiro que leva à conversão.' },
  ]
  return (
    <div className="h-full flex flex-col p-3 sm:p-8 justify-center gap-3 sm:gap-5" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl sm:text-4xl font-black text-white">A jornada em 3 encontros</h2>
        <p className="text-white/70 mt-1 text-sm">3 sessões 1:1 de 1h a 1h30 · não é aula, é implementação.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 max-w-3xl w-full mx-auto">
        {encontros.map((e, i) => (
          <motion.div key={e.n} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3" style={{ background: '#1e2035' }}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{e.icon}</span>
              <span className="text-[11px] font-black tracking-widest" style={{ color: G }}>{e.n}</span>
            </div>
            <div className="font-black text-white text-sm leading-tight">{e.title}</div>
            <div className="text-white/70 text-xs leading-snug">{e.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="flex items-center justify-center gap-3 max-w-sm mx-auto rounded-xl px-6 py-3"
        style={{ background: G + '14', border: `1px solid ${G}40` }}>
        <span className="text-lg">💬</span>
        <p className="text-sm font-bold" style={{ color: G }}>30 dias de suporte para criar o ritmo do processo.</p>
      </motion.div>
    </div>
  )
}

function ISlide07Entregaveis() {
  const items = [
    { icon: '🗂️', color: BLUE, title: 'CRM montado', sub: 'e funcionando', desc: 'Pipeline, automações de cadência e leads já cadastrados na sua operação.' },
    { icon: '📘', color: G,    title: 'Playbook comercial', sub: 'documentado', desc: 'Funil, régua de follow-up, todos os scripts, objeções, metas e rotina.' },
    { icon: '🎓', color: PUR,  title: 'Quem atende, treinado', sub: '+ metas', desc: 'Você, seu time ou sua IA de atendimento — preparados na abordagem, com checklist.' },
  ]
  return (
    <div className="h-full flex flex-col p-3 sm:p-10 justify-center gap-3 sm:gap-7" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl sm:text-5xl font-black text-white">O que fica com você</h2>
        <p className="text-white/80 mt-1 text-sm sm:text-base">Não é curso. É implementado, rodando na sua operação.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-5">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-3"
            style={{ background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl flex-shrink-0" style={{ background: it.color + '22', border: `1.5px solid ${it.color}55` }}>{it.icon}</div>
            <div>
              <div className="font-black text-base sm:text-xl text-white leading-none">{it.title}</div>
              <div className="text-sm font-bold" style={{ color: it.color }}>{it.sub}</div>
            </div>
            <div className="text-white/85 text-xs sm:text-sm leading-relaxed">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ISlide08OAB() {
  const rules = [
    { icon: '🤝', text: 'Abordagem consultiva, de confiança — nunca venda agressiva.' },
    { icon: '🚫', text: 'Sem promessa de resultado ou de êxito na causa.' },
    { icon: '📋', text: 'Sem captação indevida ou mercantilização da advocacia.' },
    { icon: '🛡️', text: 'Tudo alinhado ao Provimento 205/2021 do CFOAB.' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-7" style={{ background: DARK }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-2">🛡️</div>
        <h2 className="text-4xl font-black text-white">O diferencial que ninguém respeita</h2>
        <p className="text-white/70 mt-2 text-sm">Processo comercial forte — e ético. Sem risco pra sua OAB.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-4 max-w-3xl w-full mx-auto">
        {rules.map((r, i) => (
          <motion.div key={r.text} initial={{ opacity: 0, x: i % 2 ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 rounded-xl p-4" style={{ background: '#1e2035', borderLeft: `4px solid ${G}` }}>
            <span className="text-2xl flex-shrink-0">{r.icon}</span>
            <span className="text-white/85 text-sm">{r.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ISlide09Investimento() {
  return (
    <div className="h-full flex flex-col p-5 sm:p-8 justify-center gap-4 sm:gap-5" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}>
      <motion.h2 className="text-2xl sm:text-4xl font-black text-white text-center"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        Investimento
      </motion.h2>
      <div className="flex justify-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="rounded-2xl p-5 sm:p-10 flex flex-col gap-5 text-center max-w-md w-full"
          style={{ background: 'rgba(0,0,0,0.28)', border: `1.5px solid ${G}55` }}>
          <div className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-widest">Programa completo · 3 encontros</div>

          {/* Parcelado — destaque principal */}
          <div>
            <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Parcelado</div>
            <div className="text-3xl sm:text-5xl font-black leading-tight" style={{ color: G }}>10x de R$ 249,70</div>
            <div className="text-white/50 text-xs mt-1">no cartão</div>
            <div className="text-white/40 text-sm mt-1">R$ 2.497 no total</div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

          {/* À vista */}
          <div>
            <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">À vista</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="text-2xl sm:text-4xl font-black text-white leading-none">R$ 2.247,30</div>
              <span className="text-[10px] sm:text-xs font-black px-2 py-1 rounded-full"
                style={{ background: G + '22', color: G, border: `1px solid ${G}44` }}>10% OFF</span>
            </div>
          </div>

          <div className="inline-block mx-auto px-4 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'rgba(255,255,255,0.10)' }}>
            ⏱️ ± 3 a 5 semanas
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ISlide10CTA() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 sm:gap-7 px-5 sm:px-0" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-3xl sm:text-5xl mb-2 sm:mb-4">🚀</div>
        <h2 className="text-2xl sm:text-4xl font-black text-white leading-snug">Próximos passos</h2>
      </motion.div>
      <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full max-w-3xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {[
          { icon: '✍️', num: '01', text: 'Formalizar',            sub: 'Contrato e escolha da data' },
          { icon: '🔍', num: '02', text: 'Encontro 1',            sub: 'Diagnóstico do seu comercial' },
          { icon: '📈', num: '03', text: 'Implementar',           sub: 'CRM, scripts e time rodando' },
        ].map((it, i) => (
          <motion.div key={it.text}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.1, type: 'spring', stiffness: 180 }}
            className="flex-1 flex flex-col items-center gap-2 px-4 sm:px-5 py-4 sm:py-6 rounded-2xl text-center"
            style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <div className="text-xs font-black text-white/60 tracking-widest">{it.num}</div>
            <span className="text-2xl sm:text-3xl">{it.icon}</span>
            <span className="text-white font-black text-sm leading-tight">{it.text}</span>
            <span className="text-white/80 text-xs">{it.sub}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}>
        <div className="flex items-center gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg cursor-default shadow-2xl"
          style={{ background: G, color: NAVY, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <span>📲</span>
          <span>Quero implementar meu comercial</span>
        </div>
      </motion.div>
      <motion.p className="text-white/80 text-sm font-medium text-center px-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
        Seu escritório não precisa de mais leads. Precisa fechar os que já chegam.
      </motion.p>
    </div>
  )
}

export const IMPLEMENTACAO_SLIDES = [
  { id: 'im01', label: 'Capa',         C: ISlide01Cover },
  { id: 'im02', label: 'Situação',     C: ISlide02Situacao },
  { id: 'im03', label: 'Problema',     C: ISlide03Problema },
  { id: 'im04', label: 'Implicação',   C: ISlide04Implicacao },
  { id: 'im05', label: 'A virada',     C: ISlide05Virada },
  { id: 'im06', label: 'Jornada',      C: ISlide06Jornada },
  { id: 'im07', label: 'Entregáveis',  C: ISlide07Entregaveis },
  { id: 'im09', label: 'Investimento', C: ISlide09Investimento },
  { id: 'im10', label: 'CTA',          C: ISlide10CTA },
]

// ══════════════════════════════════════════════════════════════════════════════
//   MAIN
// ══════════════════════════════════════════════════════════════════════════════

// Só a Mari (social media jurídico) e admins veem a aba de Qualificação
const MARI_EMAIL = 'socialmediatrafegonjuridico@gmail.com'
function podeVerQualificacao() {
  try {
    const u = JSON.parse(localStorage.getItem('authUser_v2') || '{}')
    return u.role === 'admin' || u.email === MARI_EMAIL
  } catch { return false }
}

function EmBreve({ titulo, descricao, icone }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-10"
      style={{ background: '#0f1018', border: '1px dashed rgba(255,255,255,0.12)', minHeight: 380 }}>
      <div className="text-5xl opacity-80">{icone}</div>
      <div className="font-black text-2xl text-white">{titulo}</div>
      <p className="text-white/55 text-sm max-w-md leading-relaxed">{descricao}</p>
      <span className="mt-2 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest"
        style={{ background: GOLD + '18', color: GOLD }}>APRESENTAÇÃO EM CONSTRUÇÃO</span>
    </motion.div>
  )
}

const ESPACOS_BASE = [
  {
    value: 'apresentacoes', label: '🎬 Apresentações',
    itens: [
      { value: 'ecossistema', label: '🌐 Ecossistema' },
      {
        value: 'palestras', label: '🎤 Apresentações',
        subs: [
          { value: 'impl-apres',   label: '⚖️ Implementação Comercial' },
          { value: 'palestra-caf', label: '⚖️ Palestra CAF' },
          { value: 'bonus-gads',   label: '🎁 Bônus Google Ads' },
          { value: 'esclub',       label: '✦ ES Club' },
        ],
      },
    ],
  },
]

export default function TrafegonComercial() {
  const verQualificacao = podeVerQualificacao()
  const espacos = ESPACOS_BASE

  const [espaco, setEspaco] = useState('apresentacoes')
  const [item,   setItem]   = useState('ecossistema')
  const [sub,    setSub]    = useState(null)

  const espacoAtual = espacos.find(e => e.value === espaco) ?? espacos[0]
  const itemAtual   = espacoAtual.itens.find(i => i.value === item) ?? espacoAtual.itens[0]
  const subAtual    = itemAtual.subs
    ? (itemAtual.subs.find(s => s.value === sub)?.value ?? itemAtual.subs[0].value)
    : null
  const view = subAtual ?? itemAtual.value

  const irEspaco = v => {
    const e = espacos.find(x => x.value === v)
    if (!e) return
    setEspaco(v)
    setItem(e.itens[0].value)
    setSub(e.itens[0].subs ? e.itens[0].subs[0].value : null)
  }
  const irItem = v => {
    const i = espacoAtual.itens.find(x => x.value === v)
    setItem(v)
    setSub(i?.subs ? i.subs[0].value : null)
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Nível 1 — espaços */}
      <div className="flex gap-1 p-1 rounded-xl self-start flex-wrap" style={{ background: '#1e2035' }}>
        {espacos.map(({ value, label }) => (
          <button key={value} onClick={() => irEspaco(value)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: espaco === value ? G : 'transparent',
              color: espaco === value ? DARK : '#a8b0cc',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Nível 2 — itens do espaço */}
      <div className="flex gap-1 p-1 rounded-xl self-start flex-wrap" style={{ background: '#151725' }}>
        {espacoAtual.itens.map(({ value, label }) => (
          <button key={value} onClick={() => irItem(value)}
            className="px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all"
            style={{
              background: itemAtual.value === value ? '#2b3050' : 'transparent',
              color: itemAtual.value === value ? 'white' : '#7b83a8',
              boxShadow: itemAtual.value === value ? `inset 0 -2px 0 ${G}` : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Nível 3 — sub-itens */}
      {itemAtual.subs && (
        <div className="flex gap-2 self-start flex-wrap pl-1">
          {itemAtual.subs.map(({ value, label }) => (
            <button key={value} onClick={() => setSub(value)}
              className="px-3 py-1 rounded-full text-[12px] font-bold transition-all"
              style={{
                background: subAtual === value ? G + '1e' : 'transparent',
                color: subAtual === value ? G : '#6b7395',
                border: `1px solid ${subAtual === value ? G + '55' : 'rgba(255,255,255,0.07)'}`,
              }}>
              {label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={view}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}>
          {view === 'ecossistema' && (
            <Slideshow slides={PITCH_SLIDES} accentColor={G} fixedMode="geral" />
          )}
          {view === 'implementacao' && (
            <Slideshow slides={IMPLEMENTACAO_SLIDES} accentColor={G} />
          )}
          {view === 'destrava' && (
            <Slideshow slides={DESTRAVA_SLIDES} accentColor={G} fixedMode="geral" />
          )}
          {view === 'assessoria' && (
            <Slideshow slides={ASSESSORIA_SLIDES} accentColor={G} />
          )}
          {view === 'identidade' && (
            <EmBreve icone="🎨" titulo="Identidade Visual"
              descricao="Logo, paleta, tipografia e manual de marca — o ativo que faz todo o resto parecer profissional." />
          )}
          {view === 'sites' && (
            <EmBreve icone="🌐" titulo="Sites e Landing Pages"
              descricao="Do site institucional à página de conversão que recebe o tráfego. O ativo onde o clique vira conversa." />
          )}
          {view === 'impl-apres' && (
            <div className="flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: 420 }}>
              <Slideshow slides={IMPLEMENTACAO_APRES_SLIDES} accentColor={G} responsive fillWidth />
            </div>
          )}
          {view === 'palestra-caf' && (
            <div className="flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: 420 }}>
              <Slideshow slides={PALESTRA_CAF_SLIDES} accentColor={G} responsive fillWidth
                modeOptions={[
                  { value: 'slide',   label: '🎬 Slides' },
                  { value: 'roteiro', label: '🎙️ Roteiro' },
                ]} />
            </div>
          )}
          {view === 'bonus-gads' && (
            <div className="flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: 420 }}>
              <Slideshow slides={BONUS_GADS_SLIDES} accentColor={G} fixedMode="slide" responsive fillWidth />
            </div>
          )}
          {view === 'esclub' && (
            <Suspense fallback={<div className="py-16 text-center text-white/40 text-sm">Carregando ES Club…</div>}>
              <EsClub />
            </Suspense>
          )}
          {view === 'qualificacao' && verQualificacao && <QualificacaoPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
