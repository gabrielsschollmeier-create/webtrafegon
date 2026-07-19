import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

const G  = '#6eda2c'
const DARK = '#1a1d2e'
const PUR  = '#7c3aed'
const ORANGE = '#f97316'

// ── DATA ──────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Ativação',
    sub: 'Para começar do jeito certo',
    color: ORANGE,
    price10: '197',
    priceAV: '1.870',
    deliveries: [
      { icon: '🤝', text: 'Reunião inicial de projeto' },
      { icon: '📡', text: 'Campanhas de tráfego (1 canal)' },
      { icon: '🎓', text: 'Consultoria estratégica — 2h gravada' },
      { icon: '🎬', text: 'Mini aulas de Google e Meta Ads' },
      { icon: '💬', text: 'Suporte WhatsApp — 15 dias' },
    ],
    forEmpresas: ['Empresas iniciando no digital', 'Primeiro contato com tráfego', 'Validação de demanda'],
    forAdvocacia: ['Advogado autônomo iniciando', 'Primeiro contato com tráfego', 'Validação de demanda'],
  },
  {
    name: 'Estruturação',
    sub: 'Estrutura + ativação com previsibilidade',
    color: G,
    price10: '349',
    priceAV: '3.370',
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
    forEmpresas: ['Empresas que querem previsibilidade', 'Estrutura mínima profissional'],
    forAdvocacia: ['Advogados que querem previsibilidade', 'Estrutura mínima profissional'],
  },
  {
    name: 'Aceleração',
    sub: 'Presença completa + base para escalar',
    color: PUR,
    price10: '519',
    priceAV: '4.970',
    deliveries: [
      { icon: '✅', text: 'Tudo do Estruturação' },
      { icon: '🌐', text: 'Site institucional (3 páginas)' },
      { icon: '🎨', text: 'Identidade visual' },
      { icon: '🏆', text: 'Treinamento de vendas — 1h30' },
    ],
    forEmpresas: ['Empresas em crescimento', 'Profissionalizar a operação completa'],
    forAdvocacia: ['Escritórios em crescimento', 'Advogados que querem profissionalizar'],
  },
]

const AVULSO = [
  { label: 'Diagnóstico estratégico inicial',    val: '1.200' },
  { label: 'Setup de campanhas de tráfego',      val: '1.500' },
  { label: 'Gestão de tráfego pago (30 dias)',   val: '2.000' },
  { label: 'Landing page de conversão',          val: '1.800' },
  { label: 'Site institucional profissional',    val: '3.500' },
  { label: 'Google Meu Negócio',                 val: '1.000' },
  { label: 'Instagram / Facebook',               val: '1.200' },
  { label: 'Atendimento comercial estruturado',  val: '1.300' },
  { label: 'Consultoria comercial estratégica',  val: '2.000' },
]

const REVIEWS = [
  { name: 'Polizio Advogados',          av: 'P', color: PUR,     time: '16 semanas', text: 'Excelente empresa, vem nos ajudando muito a conseguir mais clientes na internet. Recomendo!' },
  { name: 'Andrade Ferrari Advogados',  av: 'A', color: ORANGE,  time: '42 semanas', text: 'Profissionalismo e dedicação foram fundamentais para otimizar nossa presença digital e expandir o alcance dos nossos serviços.' },
  { name: 'Isabel Costa da Cunha',      av: 'I', color: G,       time: '10 semanas', text: 'Tráfego é uma agência maravilhosa! Ótimo atendimento, agilidade nos serviços. Super recomendo! Grandes parceiros de negócio.' },
  { name: 'Samea Kurdi',                av: 'S', color: '#60a5fa', time: '9 meses',  text: 'Uma empresa que conseguiu entender todas as minhas dificuldades no meio digital e trouxe soluções práticas com todo o suporte que eu necessitava.' },
]

// ── HOOK ──────────────────────────────────────────────────────────────────────

function useCounter(target, ms = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    setV(0)
    let start = null
    const id = requestAnimationFrame(function tick(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / ms, 1)
      setV(Math.round(p * target))
      if (p < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [target, ms])
  return v
}

// ── SLIDES ────────────────────────────────────────────────────────────────────

function SlideCover() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 55%, #90ef3c 100%)` }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 160 + i * 90, height: 160 + i * 90, border: '1.5px solid rgba(255,255,255,0.18)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center" initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="font-black text-white leading-none mb-5"
          style={{ fontSize: '5.5rem', letterSpacing: '-5px', textShadow: '0 6px 32px rgba(0,0,0,0.18)' }}
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.55 }}>
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

function SlideDor() {
  return (
    <div className="h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.div className="max-w-3xl w-full px-8"
        initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
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

function SlideProblemas({ mode }) {
  const word = mode === 'advocacia' ? 'escritório' : 'empresa'
  const items = [
    { icon: '🌐', color: ORANGE, bg: '#fff3e0', label: 'Site inexistente ou amador' },
    { icon: '📱', color: G,      bg: '#f0fde4', label: 'Redes sociais sem estratégia' },
    { icon: '🚀', color: PUR,   bg: '#f3e8ff', label: 'Sem tráfego pago' },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}>
        Problemas comuns
      </motion.h2>
      <div className="grid grid-cols-3 gap-6">
        {items.map((it, i) => (
          <motion.div key={it.label} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * i, type: 'spring', stiffness: 180 }}
            className="rounded-2xl p-6 flex items-center gap-4 shadow-lg" style={{ background: it.bg }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md" style={{ background: it.color }}>
              {it.icon}
            </div>
            <span className="font-bold text-lg text-gray-800 leading-snug">{it.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center rounded-full py-3 px-8 mx-auto text-white/55 text-base self-center"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        O digital virou obrigação — seu {word} precisa estar onde seu cliente está.
      </motion.p>
    </div>
  )
}

function SlideWhyFail() {
  const items = [
    { color: G,      icon: '💡', title: 'Agência',     sub: 'Mensalidade alta',         delay: 0 },
    { color: PUR,    icon: '📚', title: 'Curso',       sub: 'Teoria sem execução',      delay: 0.14 },
    { color: ORANGE, icon: '👤', title: 'Freelancer',  sub: 'Entrega inconsistente',    delay: 0.28 },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-10" style={{ background: DARK }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}>
        Por que a maioria trava
      </motion.h2>
      <div className="flex justify-center gap-12">
        {items.map(it => (
          <motion.div key={it.title} initial={{ scale: 0.65, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: it.delay, type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-4">
            <div className="w-36 h-36 flex items-center justify-center rounded-2xl text-4xl"
              style={{ background: it.color + '18', border: `2px solid ${it.color}`, boxShadow: `0 0 36px ${it.color}35` }}>
              {it.icon}
            </div>
            <div className="text-center">
              <div className="text-xl font-black" style={{ color: it.color }}>{it.title}</div>
              <div className="text-white/45 text-sm">{it.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center rounded-full py-3 px-8 mx-auto text-white/55 text-base self-center"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        O problema não é vontade. É o modelo.
      </motion.p>
    </div>
  )
}

function SlideProposal() {
  const items = [
    { icon: '✅', title: 'Estrutura pronta',    desc: 'Site, landing page, redes e presença digital montados por nós — você não começa do zero.',        delay: 0 },
    { icon: '📡', title: 'Tráfego pago',        desc: 'Campanhas ativas no Google e Meta gerando leads todo dia, com método e rastreamento completo.',     delay: 0.14 },
    { icon: '🎯', title: 'Autonomia c/ método', desc: 'Você aprende a acompanhar os resultados e tomar decisões — sem depender de terceiros para sempre.', delay: 0.28 },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center gap-8"
      style={{ background: `linear-gradient(135deg, #3dba18 0%, ${G} 100%)` }}>
      <motion.h2 className="text-5xl font-black text-white text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Nossa Proposta
      </motion.h2>
      <div className="grid grid-cols-3 gap-6">
        {items.map(it => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: it.delay, type: 'spring', stiffness: 160 }}
            className="rounded-2xl p-7 flex flex-col gap-4"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="text-4xl">{it.icon}</div>
            <div className="text-xl font-black text-white">{it.title}</div>
            <div className="text-white/65 text-sm leading-relaxed">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideProduto({ mode }) {
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

function SlideEtapas() {
  const steps = [
    { num: '1', bg: G,        text: 'white',   title: 'Presença Digital estruturada', items: ['Site institucional', 'Landing page', 'Google Meu Negócio', 'Redes sociais'] },
    { num: '2', bg: DARK,     text: 'white',   title: 'Ativação',                    items: ['Tráfego pago ativo', 'Campanhas configuradas'] },
    { num: '3', bg: '#f8fafc', text: '#1a1d2e', title: 'Primeiras Vendas',            items: ['Atendimento comercial', 'CRM'] },
  ]
  return (
    <div className="h-full flex flex-col p-10 justify-center" style={{ background: '#f1f5f9' }}>
      <div className="flex gap-5 items-stretch h-full py-2">
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 170 }}
            className="rounded-2xl p-7 flex flex-col gap-4 flex-1 shadow-xl"
            style={{ background: s.bg }}>
            <div className="text-5xl font-black opacity-20" style={{ color: s.text }}>{s.num}</div>
            <div className="text-xl font-black leading-snug" style={{ color: s.text }}>{s.title}</div>
            <ul className="space-y-2 flex-1">
              {s.items.map(it => (
                <li key={it} className="flex items-center gap-2 text-sm" style={{ color: s.text === 'white' ? 'rgba(255,255,255,0.7)' : '#64748b' }}>
                  <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]"
                    style={{ background: s.bg === G ? 'rgba(255,255,255,0.2)' : s.bg === DARK ? 'rgba(255,255,255,0.12)' : `${G}25`, color: s.text === 'white' ? 'white' : G }}>✓</span>
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideAncora() {
  const count = useCounter(15500, 1600)
  const fmt = (n) => n.toLocaleString('pt-BR')
  return (
    <div className="h-full flex flex-col p-8 justify-center gap-4" style={{ background: '#f8fafc' }}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-gray-900">Se você fosse fazer tudo avulso</h2>
        <p className="text-gray-400 text-sm mt-1">Referência de mercado — valores mínimos para contratação separada</p>
      </motion.div>
      <div className="rounded-2xl overflow-hidden shadow-xl max-w-2xl w-full mx-auto" style={{ background: DARK }}>
        {AVULSO.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055 }}
            className="flex justify-between items-center px-6 py-2.5 border-b border-white/[0.06]">
            <span className="text-white/55 text-sm">{it.label}</span>
            <span className="text-white font-bold">R$ {it.val}</span>
          </motion.div>
        ))}
        <div className="flex justify-between items-center px-6 py-4">
          <span className="text-white/50 font-bold">Total</span>
          <motion.div className="px-5 py-2 rounded-full font-black text-white text-lg shadow-lg"
            style={{ background: G, boxShadow: `0 0 24px ${G}60` }}>
            R$ {fmt(count)}
          </motion.div>
        </div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="text-center text-gray-500 font-medium">
        Comprar tudo separado é mais caro, mais lento e sem método.
      </motion.p>
    </div>
  )
}

function SlidePlanos({ mode }) {
  return (
    <div className="h-full flex flex-col p-6 justify-center gap-4" style={{ background: DARK }}>
      <h2 className="text-4xl font-black text-white text-center">Planos Destrava Digital</h2>
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
              <div className="rounded-xl p-3 text-center" style={{ background: plan.color + '18', border: `1.5px solid ${plan.color}40` }}>
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

function SlideComparacao() {
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
          <div className="p-5 text-center font-black text-white/60 text-lg" style={{ background: 'rgba(0,0,0,0.42)' }}>Avulso</div>
          <div className="p-5 text-center font-black text-white text-lg"   style={{ background: PUR }}>Método Destrava</div>
        </div>
        <div className="grid grid-cols-2" style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="p-5 text-center border-r border-white/10">
            <div className="text-3xl font-black text-white/40 line-through">R$ 15.500</div>
          </div>
          <div className="p-5 text-center">
            <div className="text-xl font-bold text-white/70">A partir de</div>
            <div className="text-3xl font-black" style={{ color: G, textShadow: `0 0 20px ${G}90` }}>10x R$ 197</div>
          </div>
        </div>
        {rows.map(([bad, good], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
            className="grid grid-cols-2 border-t border-white/[0.08]" style={{ background: 'rgba(0,0,0,0.16)' }}>
            <div className="p-3 text-center text-white/35 text-sm border-r border-white/[0.08]">✕ {bad}</div>
            <div className="p-3 text-center text-white/80 text-sm">✓ {good}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function SlideFeedbacks() {
  return (
    <div className="h-full flex flex-col p-8 gap-5" style={{ background: '#f8fafc' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-gray-900">Feedbacks</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
          <span className="font-black text-gray-600 text-sm">G</span>
          <span className="text-yellow-400 tracking-tight">★★★★★</span>
          <span className="text-sm font-semibold text-gray-500">Google</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {REVIEWS.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: r.color }}>
                {r.av}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{r.name}</div>
                <div className="text-xs"><span className="text-yellow-400">★★★★★</span> <span className="text-gray-400">· {r.time}</span></div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideProximosPassos() {
  const steps = [
    { num: '01', icon: '🤝', title: 'Formalização',                desc: 'Contrato assinado e plano escolhido. Você começa a executar com segurança e clareza.' },
    { num: '02', icon: '📅', title: 'Reunião inicial de projeto',  desc: 'Alinhamos estratégia, público-alvo, calendário e expectativas de entrega.' },
    { num: '03', icon: '🚀', title: 'Execução',                    desc: 'Cada entrega no prazo acordado — você acompanha o progresso em tempo real.' },
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
      <motion.p className="text-white/65 text-base text-center font-medium"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        Quem quer resultado decide. Quem não quer, adia.
      </motion.p>
    </div>
  )
}

function SlideCTA({ mode }) {
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
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.36, type: 'spring', stiffness: 200 }}>
        <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-lg shadow-2xl cursor-default"
          style={{ background: DARK, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <span>📲</span>
          <span>Falar com a equipe agora</span>
        </div>
      </motion.div>
    </div>
  )
}

// ── SLIDE LIST ────────────────────────────────────────────────────────────────

const SLIDES = [
  { id: 'cover',      label: 'Capa',            C: SlideCover },
  { id: 'dor',        label: 'Dor',             C: SlideDor },
  { id: 'problemas',  label: 'Problemas',       C: SlideProblemas },
  { id: 'whyfail',    label: 'Por que trava',   C: SlideWhyFail },
  { id: 'proposal',   label: 'Proposta',        C: SlideProposal },
  { id: 'produto',    label: 'Produto',         C: SlideProduto },
  { id: 'etapas',     label: 'Como funciona',   C: SlideEtapas },
  { id: 'ancora',     label: 'Âncora de valor', C: SlideAncora },
  { id: 'planos',     label: 'Planos',          C: SlidePlanos },
  { id: 'comparacao', label: 'Comparação',      C: SlideComparacao },
  { id: 'feedbacks',  label: 'Feedbacks',       C: SlideFeedbacks },
  { id: 'proximos',   label: 'Próx. passos',    C: SlideProximosPassos },
  { id: 'cta',        label: 'CTA',             C: SlideCTA },
]

const variants = {
  enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.96 }),
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function TrafegonComercial() {
  const [cur, setCur]   = useState(0)
  const [dir, setDir]   = useState(1)
  const [mode, setMode] = useState('empresas')
  const [fs, setFs]     = useState(false)

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
    if (n < 0 || n >= SLIDES.length) return
    setDir(delta)
    setCur(n)
  }

  const progress = ((cur + 1) / SLIDES.length) * 100
  const { C: Slide } = SLIDES[cur]

  return (
    <div className={fs ? 'fixed inset-0 z-[300] flex flex-col p-0' : 'p-4 lg:p-6'}
      style={fs ? { background: '#0a0b12' } : {}}>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-shrink-0">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#1e2035' }}>
          {[['empresas', '🏢 Empresas'], ['advocacia', '⚖️ Advocacia']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: mode === m ? G : 'transparent', color: mode === m ? 'white' : '#8890b5' }}>
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm font-mono text-white/25 tabular-nums">{cur + 1} / {SLIDES.length}</span>
        <button onClick={() => setFs(v => !v)}
          className="p-2 rounded-xl transition-colors hover:text-white text-white/35"
          style={{ background: '#1e2035' }}>
          {fs ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 rounded-full mb-3 overflow-hidden flex-shrink-0" style={{ background: '#1e2035' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: G, boxShadow: `0 0 10px ${G}80` }} />
      </div>

      {/* ── Slide area ── */}
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
        {cur < SLIDES.length - 1 && (
          <button onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight className="text-white" size={20} />
          </button>
        )}
      </div>

      {/* ── Dot nav ── */}
      <div className="flex gap-2 justify-center mt-3 flex-shrink-0 flex-wrap">
        {SLIDES.map((s, i) => (
          <button key={s.id} title={s.label}
            onClick={() => { setDir(i > cur ? 1 : -1); setCur(i) }}
            className="rounded-full transition-all duration-300"
            style={{
              height: 8,
              width: i === cur ? 32 : 8,
              background: i === cur ? G : '#1e2035',
              boxShadow: i === cur ? `0 0 8px ${G}80` : 'none',
            }} />
        ))}
      </div>
    </div>
  )
}
