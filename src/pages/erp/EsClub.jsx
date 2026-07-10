import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, NotebookPen } from 'lucide-react'

const GREEN  = '#6eda2c'
const PURPLE = '#be29ec'
const BLUE   = '#60a5fa'
const ORANGE = '#ea8a29'
const RED    = '#ef4444'
const AMBER  = '#f59e0b'

const BG_DEEP = 'linear-gradient(140deg, #0a0b14 0%, #12142a 55%, #1a1040 100%)'

/* ─────────────────────────────────────────────────────────────
   Primitivos visuais
   ───────────────────────────────────────────────────────────── */

function Eyebrow({ children, color = GREEN }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
      style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}>
      {children}
    </span>
  )
}

function Title({ children, size = 'lg' }) {
  const cls = size === 'xl' ? 'text-3xl lg:text-5xl' : size === 'lg' ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-3xl'
  return <h2 className={`${cls} font-black text-white leading-[1.05] tracking-tight`}>{children}</h2>
}

function Quote({ children, color = GREEN }) {
  return (
    <div className="relative rounded-2xl px-5 py-4 lg:px-6 lg:py-5"
      style={{ background: `${color}0d`, border: `1px solid ${color}2e` }}>
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: color }} />
      <p className="text-sm lg:text-lg font-bold text-white leading-snug pl-3">{children}</p>
    </div>
  )
}

function Card({ children, color = GREEN, className = '', ...rest }) {
  return (
    <div className={`rounded-2xl p-4 lg:p-5 ${className}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22` }} {...rest}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Mockups visuais dos formatos de criativo
   Cada um desenha um "celular" 9:16 abstrato representando o formato
   ───────────────────────────────────────────────────────────── */

function Phone({ children, color = GREEN }) {
  return (
    <div className="relative mx-auto rounded-[18px] overflow-hidden flex-shrink-0"
      style={{
        width: 116, height: 206,
        background: '#0b0d18',
        border: `1.5px solid ${color}40`,
        boxShadow: `0 8px 30px rgba(0,0,0,0.45), inset 0 0 40px ${color}0d`,
      }}>
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full z-20"
        style={{ background: 'rgba(255,255,255,0.14)' }} />
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

const Person = ({ color, scale = 1, opacity = 1 }) => (
  <div className="flex flex-col items-center" style={{ transform: `scale(${scale})`, opacity }}>
    <div className="rounded-full" style={{ width: 16, height: 16, background: `${color}cc` }} />
    <div className="rounded-t-full -mt-0.5" style={{ width: 26, height: 16, background: `${color}66` }} />
  </div>
)

const Bar = ({ w, color, h = 4, o = 1 }) => (
  <div className="rounded-full" style={{ width: w, height: h, background: color, opacity: o }} />
)

/* 1. Tela Dividida */
const MockTelaDividida = ({ color }) => (
  <Phone color={color}>
    <div className="h-1/2 flex items-center justify-center relative"
      style={{ background: `linear-gradient(160deg, ${color}22, transparent)` }}>
      <Person color={color} />
      <span className="absolute bottom-1 left-1 text-[6px] font-black" style={{ color: `${color}aa` }}>FALANDO</span>
    </div>
    <div className="h-px w-full" style={{ background: `${color}55` }} />
    <div className="h-1/2 p-2 flex flex-col justify-center gap-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-end gap-1 h-9">
        {[40, 65, 30, 85, 55].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 3 ? color : `${color}44` }} />
        ))}
      </div>
      <span className="text-[6px] font-black" style={{ color: `${color}aa` }}>APOIO VISUAL</span>
    </div>
  </Phone>
)

/* 2. React */
const MockReact = ({ color }) => (
  <Phone color={color}>
    <div className="h-full p-2 flex flex-col justify-center gap-1.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <Bar w="70%" color="#ffffff" h={5} o={0.22} />
      <Bar w="90%" color="#ffffff" h={5} o={0.14} />
      <Bar w="55%" color="#ffffff" h={5} o={0.14} />
      <Bar w="80%" color="#ffffff" h={5} o={0.1} />
      <span className="text-[6px] font-black mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>VÍDEO ORIGINAL</span>
    </div>
    <div className="absolute bottom-2 right-2 rounded-lg flex items-center justify-center"
      style={{ width: 44, height: 56, background: '#12142a', border: `1.5px solid ${color}`, boxShadow: `0 4px 16px ${color}44` }}>
      <Person color={color} scale={0.75} />
    </div>
    <div className="absolute bottom-1 left-2 text-[6px] font-black" style={{ color: `${color}cc` }}>+ OPINIÃO</div>
  </Phone>
)

/* 3. Novelinha */
const MockNovelinha = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex flex-col">
      {[
        { l: 'CONFLITO', a: 0.35 },
        { l: 'TENSÃO',   a: 0.6 },
        { l: 'VIRADA',   a: 1 },
      ].map((s, i) => (
        <div key={i} className="flex-1 relative flex items-center justify-center gap-2 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: `${color}${i === 2 ? '1f' : '08'}` }}>
          <Person color={color} scale={0.62} opacity={s.a} />
          <Person color="#8890b5" scale={0.62} opacity={s.a} />
          <div className="absolute top-1.5 right-1.5 rounded-md px-1 py-[1px]"
            style={{ background: `${color}22` }}>
            <span className="text-[5px] font-black" style={{ color }}>{s.l}</span>
          </div>
        </div>
      ))}
      <div className="h-6 flex items-center justify-center" style={{ background: `${color}2e` }}>
        <span className="text-[6px] font-black text-white">LIÇÃO</span>
      </div>
    </div>
  </Phone>
)

/* 4. Comparativo */
const MockComparativo = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex">
      <div className="w-1/2 p-1.5 flex flex-col gap-1.5 justify-center" style={{ background: `${RED}10` }}>
        <span className="text-[7px] font-black mx-auto" style={{ color: RED }}>❌</span>
        {[1, 2, 3].map(i => <Bar key={i} w="100%" color={RED} o={0.3} />)}
      </div>
      <div className="w-px" style={{ background: 'rgba(255,255,255,0.14)' }} />
      <div className="w-1/2 p-1.5 flex flex-col gap-1.5 justify-center" style={{ background: `${color}12` }}>
        <span className="text-[7px] font-black mx-auto" style={{ color }}>✅</span>
        {[1, 2, 3].map(i => <Bar key={i} w="100%" color={color} o={0.55} />)}
      </div>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-6 h-6 flex items-center justify-center"
      style={{ background: '#0b0d18', border: '1px solid rgba(255,255,255,0.18)' }}>
      <span className="text-[6px] font-black text-white">VS</span>
    </div>
  </Phone>
)

/* 5. Narrado */
const MockNarrado = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-center"
            style={{ background: `linear-gradient(${45 + i * 40}deg, ${color}${i % 2 ? '18' : '0c'}, #0b0d18)` }}>
            <span className="text-[6px] font-black" style={{ color: `${color}88` }}>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="h-8 px-2 flex flex-col justify-center gap-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="flex gap-[3px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-full" style={{ height: 3, background: i < 4 ? color : `${color}33` }} />
          ))}
        </div>
        <span className="text-[5px] font-black" style={{ color: `${color}aa` }}>TAKES ≤ 5s · NARRAÇÃO</span>
      </div>
    </div>
  </Phone>
)

/* 6. Trend com texto */
const MockTrend = ({ color }) => (
  <Phone color={color}>
    <div className="h-full relative flex items-center justify-center"
      style={{ background: `radial-gradient(circle at 50% 70%, ${color}18, #0b0d18 70%)` }}>
      <Person color="#8890b5" scale={1.15} opacity={0.5} />
      <div className="absolute top-6 left-2 right-2 text-center">
        <p className="text-[8px] font-black text-white leading-tight" style={{ textShadow: '0 2px 8px #000' }}>
          QUANDO VOCÊ<br />PERCEBE QUE...
        </p>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-[2px] flex items-center gap-1"
        style={{ background: 'rgba(255,255,255,0.08)' }}>
        <span className="text-[6px]">🔇</span>
        <span className="text-[5px] font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>SEM SOM</span>
      </div>
    </div>
  </Phone>
)

/* 7. Conversa */
const MockConversa = ({ color }) => (
  <Phone color={color}>
    <div className="h-full relative flex items-end justify-center gap-1 pb-6"
      style={{ background: `linear-gradient(180deg, ${color}0f, #0b0d18)` }}>
      <Person color="#8890b5" scale={0.9} />
      <Person color={color} scale={0.9} />
      <div className="absolute top-4 left-2 rounded-xl rounded-bl-none px-1.5 py-1"
        style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="flex gap-[2px]">
          {[1, 2, 3].map(i => <div key={i} className="w-[3px] h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }} />)}
        </div>
      </div>
      <div className="absolute top-12 right-2 rounded-xl rounded-br-none px-1.5 py-1" style={{ background: `${color}44` }}>
        <div className="flex gap-[2px]">
          {[1, 2].map(i => <div key={i} className="w-[3px] h-[3px] rounded-full" style={{ background: color }} />)}
        </div>
      </div>
      <span className="absolute bottom-1.5 text-[5px] font-black" style={{ color: `${color}aa` }}>ESPONTÂNEO</span>
    </div>
  </Phone>
)

/* 8. Lista / Ranking */
const MockLista = ({ color }) => (
  <Phone color={color}>
    <div className="h-full p-2 flex flex-col gap-1.5 justify-center">
      <p className="text-[7px] font-black text-white mb-0.5 leading-tight">TOP 5 ERROS</p>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-1.5 rounded-md px-1 py-1"
          style={{ background: i === 1 ? `${color}22` : 'rgba(255,255,255,0.04)' }}>
          <span className="text-[7px] font-black w-2" style={{ color: i === 1 ? color : `${color}77` }}>{i}</span>
          <Bar w="100%" color="#ffffff" o={i === 1 ? 0.4 : 0.15} />
        </div>
      ))}
      <span className="text-[5px] font-black mt-0.5" style={{ color: `${color}aa` }}>PROGRESSÃO ↓</span>
    </div>
  </Phone>
)

/* ─────────────────────────────────────────────────────────────
   Dados
   ───────────────────────────────────────────────────────────── */

const FORMATOS = [
  {
    n: 1, nome: 'Tela Dividida', color: BLUE, Mock: MockTelaDividida,
    objetivo: 'Aumentar retenção e criar reforço visual',
    estrutura: 'Lado 1: pessoa falando. Lado 2: apoio visual (print, resultado, concorrente, site).',
    uso: 'Autoridade · Educação · Análise',
    funil: 'Topo e meio',
  },
  {
    n: 2, nome: 'React', color: PURPLE, Mock: MockReact,
    objetivo: 'Pegar audiência emprestada de temas quentes',
    estrutura: 'Gancho → trecho → opinião forte → explicação → takeaway.',
    uso: 'Polêmicas · Erros do mercado · Notícias',
    funil: 'Topo',
    regra: 'React sem insight = conteúdo preguiçoso.',
  },
  {
    n: 3, nome: 'Novelinha', color: GREEN, Mock: MockNovelinha,
    objetivo: 'Retenção extrema via storytelling',
    estrutura: 'Conflito → tensão → virada → lição. Mais de 1 personagem, ninguém olha pra câmera.',
    uso: 'Identificação · Humor · Frustração',
    funil: 'Topo',
    regra: 'Sem conflito nos primeiros segundos, sem retenção.',
  },
  {
    n: 4, nome: 'Comparativo', color: RED, Mock: MockComparativo,
    objetivo: 'Clareza rápida e compartilhamento',
    estrutura: 'A vs B. ❌ o jeito errado / ✅ o jeito certo.',
    uso: 'Mudança de crença · Compartilhamento',
    funil: 'Topo',
  },
  {
    n: 5, nome: 'Narrado', color: AMBER, Mock: MockNarrado,
    objetivo: 'Retenção cinematográfica',
    estrutura: 'Hook → narrativa → prova → payoff.',
    uso: 'Identificação · Curiosidade · Aspiração',
    funil: 'Topo e meio',
    regra: 'Máximo 5 segundos por take.',
  },
  {
    n: 6, nome: 'Trend com Texto', color: ORANGE, Mock: MockTrend,
    objetivo: 'Alcance rápido',
    estrutura: 'Texto forte + cena cotidiana.',
    uso: 'Identificação · Frustração · Aspiração',
    funil: 'Topo',
    regra: 'Precisa funcionar sem som.',
  },
  {
    n: 7, nome: 'Conversa', color: '#22d3ee', Mock: MockConversa,
    objetivo: 'Parecer espontâneo e criar curiosidade',
    estrutura: 'Alguém aborda. Pergunta simples. Ambiente diferente.',
    uso: 'Curiosidade · Identificação',
    funil: 'Meio e fundo · converte',
  },
  {
    n: 8, nome: 'Lista / Ranking', color: '#f472b6', Mock: MockLista,
    objetivo: 'Retenção por progressão',
    estrutura: 'Top 3, Top 5, Top 7.',
    uso: 'Autoridade · Educação · Compartilhamento',
    funil: 'Topo e meio',
  },
]

const OBJETIVO_FORMATO = [
  { obj: 'Alcance',           fmts: ['Trend', 'React', 'Novelinha'],        color: ORANGE },
  { obj: 'Retenção',          fmts: ['Narrado', 'Conversa', 'Novelinha'],   color: GREEN },
  { obj: 'Autoridade',        fmts: ['Lista', 'React', 'Tela Dividida'],    color: BLUE },
  { obj: 'Compartilhamento',  fmts: ['Comparativo', 'Lista'],               color: PURPLE },
  { obj: 'Conversão',         fmts: ['Narrado', 'Conversa'],                color: AMBER },
]

const PERGUNTAS = [
  { q: 'Como e por onde começar?', a: 'Não comece pelo anúncio. Oferta clara → onde o lead cai → quem responde → só então o anúncio.', star: true },
  { q: '"Impulsionar" é a mesma coisa que fazer tráfego?', a: 'Não. O botão otimiza engajamento e alcance, não venda. É a diferença entre aparecer e vender.' },
  { q: 'Meta ou Google — qual serve pro meu negócio?', a: 'Google = intenção (já procuram você). Meta = descoberta (você cria o desejo).' },
  { q: 'Quanto investir no início para ter resultados?', a: 'Não tem número mágico, tem conta: ticket × taxa de fechamento × custo por lead do nicho.', star: true },
  { q: 'O que realmente funciona hoje em tráfego pago?', a: 'Criativo em volume + oferta clara + números lidos corretamente. Nessa ordem.', star: true },
  { q: 'Além de vídeos, fotos estáticas também funcionam?', a: 'Sim, e muito bem em fundo de funil. O erro não é o formato — é ter pouco criativo.', star: true },
  { q: 'O tempo que a empresa faz tráfego influencia no valor do lead?', a: 'Sim, mas não porque a conta envelhece. O tempo ajuda se você usou esse tempo pra aprender.', star: true },
  { q: 'O que é um lead "caro" ou "barato"?', a: 'Depende de ticket e margem. R$ 100 é barato pra imóvel e caríssimo pra marmita. Não existe caro no absoluto.' },
  { q: 'Preciso responder os leads rápido?', a: 'A janela quente do lead é curtíssima. Ele clicou por impulso e já está vendo outra coisa.' },
  { q: 'Como eu sei se o tráfego dá lucro de verdade?', a: 'Parando de olhar custo por lead e passando a olhar custo por VENDA.' },
]

const CENARIO_2026 = [
  { icon: '💸', color: RED,    t: 'Tributo de 12,5%',            d: 'Desde 01/01/26 a Meta parou de absorver. Quem investe R$ 1.000 entrega R$ 875 de mídia real.' },
  { icon: '🤖', color: PURPLE, t: 'Menos controle de segmentação', d: 'A I.A. assumiu. O Zuckerberg demitiu 8 mil funcionários pra forçar essa transição.' },
  { icon: '👥', color: ORANGE, t: 'Mais concorrentes',           d: 'O empresário está mais consciente. A vitrine ficou disputada e o leilão subiu.' },
  { icon: '🗳️', color: AMBER,  t: 'Ano eleitoral',                d: 'Campanha política injeta verba na plataforma. A tendência é encarecer ainda mais.' },
  { icon: '⚡', color: BLUE,   t: 'MCP liberado',                 d: 'Qualquer I.A. conecta no gerenciador. O ritmo de mudança acelerou.' },
  { icon: '🎬', color: GREEN,  t: 'A entrega depende do criativo', d: 'O algoritmo não funciona mais como antes. É o criativo que decide pra quem o anúncio aparece.' },
]

const CHECKLIST = [
  'Oferta clara — sei o que vendo e por que comprar de mim',
  'Perfil/página apresentável — o lead vai me pesquisar',
  'Criativos em volume — não 1 ou 2, cobrindo topo/meio/fundo',
  'Canal certo pro meu tipo de negócio',
  'Verba compatível com a meta — a conta fecha?',
  'Sei meu custo por VENDA, não só por lead',
  'Alguém pra responder rápido',
]

/* ─────────────────────────────────────────────────────────────
   Slides
   ───────────────────────────────────────────────────────────── */

function SlideCapa() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160 }}>
        <Eyebrow>✦ ES Club · Encontro de Empresários</Eyebrow>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="text-4xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mt-6 mb-6">
        Tráfego pago<br />
        <span style={{ background: `linear-gradient(100deg, ${GREEN}, ${BLUE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          mudou de eixo
        </span>
      </motion.h1>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="max-w-2xl">
        <Quote>
          Antes se ganhava com segmentação e verba.<br />
          Hoje se ganha com criativo em volume e leitura correta dos números.
        </Quote>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-xs font-bold uppercase tracking-[0.2em] mt-8" style={{ color: '#5a6087' }}>
        Tráfeg.on · 60 minutos
      </motion.p>
    </div>
  )
}

function SlideAbertura() {
  const perguntas = [
    { icon: '📊', t: 'Quem já investe em tráfego hoje? Quem nunca investiu?' },
    { icon: '✋', t: 'Quem aqui sentiu o lead ficar mais caro ou pior de qualidade nos últimos meses?' },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-4xl mx-auto w-full">
      <Eyebrow>Antes de começar</Eyebrow>
      <div className="mt-4 mb-8"><Title>Duas perguntas<br />pra sala.</Title></div>
      <div className="grid gap-4">
        {perguntas.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
            <Card>
              <div className="flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <p className="text-base lg:text-xl font-bold text-white leading-snug">{p.t}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlidePerguntas() {
  const [open, setOpen] = useState(0)
  return (
    <div className="h-full flex flex-col px-6 lg:px-14 max-w-5xl mx-auto w-full py-6 lg:py-10">
      <Eyebrow>Fundamentos</Eyebrow>
      <div className="mt-3 mb-5">
        <Title size="md">As 10 perguntas</Title>
        <p className="text-xs mt-1.5" style={{ color: '#5a6087' }}>
          <span style={{ color: GREEN }}>★</span> enviadas por vocês
        </p>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-1.5">
        {PERGUNTAS.map((p, i) => {
          const isOpen = open === i
          return (
            <div key={i} onClick={() => setOpen(isOpen ? -1 : i)}
              className="rounded-xl cursor-pointer transition-all"
              style={{
                background: isOpen ? `${GREEN}0f` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isOpen ? GREEN + '3a' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-black w-5 flex-shrink-0"
                  style={{ color: isOpen ? GREEN : '#3f4463' }}>{String(i + 1).padStart(2, '0')}</span>
                <p className="flex-1 text-sm font-bold text-white leading-snug">{p.q}</p>
                {p.star && <span className="text-xs flex-shrink-0" style={{ color: GREEN }}>★</span>}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-4 pb-3.5 pl-12 text-sm leading-relaxed" style={{ color: '#8890b5' }}>{p.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SlideCenario() {
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-6xl mx-auto w-full py-6">
      <Eyebrow color={RED}>Cenário 2026</Eyebrow>
      <div className="mt-3 mb-6">
        <Title size="md">Não é você.<br />O jogo mudou.</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CENARIO_2026.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card color={c.color} className="h-full">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2.5"
                style={{ background: `${c.color}1e` }}>{c.icon}</div>
              <p className="text-sm font-black text-white mb-1 leading-snug">{c.t}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#7a80a5' }}>{c.d}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-6"><Quote color={RED}>O mercado está assim para todos. Ninguém aqui está fazendo errado — o jogo é que mudou.</Quote></div>
    </div>
  )
}

function SlideCriativoEixo() {
  const pontos = [
    { icon: '🔥', t: '1 ou 2 criativos não duram meses', d: 'Muita queda de lead é fadiga de criativo — não é o mercado.' },
    { icon: '📦', t: 'Volume constante', d: 'Vídeos e artes com topo, meio e fundo agrupados. É o material que o algoritmo escolhe.' },
    { icon: '💀', t: 'Criativo ruim queima verba', d: 'Mesmo com campanha impecável e segmentação perfeita.' },
    { icon: '🎯', t: 'Criativo > segmentação', d: 'Produzir criativo hoje rende mais que qualquer ajuste fino.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-5xl mx-auto w-full py-6">
      <Eyebrow>O novo eixo</Eyebrow>
      <div className="mt-3 mb-5">
        <Title size="md">O criativo virou<br />a variável nº 1</Title>
      </div>
      <div className="mb-6">
        <Quote>
          Com menos segmentação manual, é o criativo que determina pra quem e quando o anúncio aparece.
          O botão que sobrou nas suas mãos é o criativo.
        </Quote>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pontos.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="h-full">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <div>
                  <p className="text-sm font-black text-white leading-snug">{p.t}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#7a80a5' }}>{p.d}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideFormatos() {
  const [sel, setSel] = useState(2) // Novelinha
  const f = FORMATOS[sel]
  return (
    <div className="h-full flex flex-col px-6 lg:px-14 max-w-6xl mx-auto w-full py-5 overflow-y-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <Eyebrow>Biblioteca Oficial de Formatos</Eyebrow>
          <div className="mt-3"><Title size="md">Escolha por objetivo.<br />Nunca por gosto.</Title></div>
        </div>
        <div className="max-w-sm hidden lg:block">
          <Quote color={BLUE}>A mesma ideia pode viralizar ou flopar dependendo do formato escolhido.</Quote>
        </div>
      </div>

      {/* Tiras de mockups */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {FORMATOS.map((fmt, i) => {
          const active = sel === i
          return (
            <button key={fmt.n} onClick={() => setSel(i)}
              className="flex-shrink-0 rounded-2xl p-2 transition-all"
              style={{
                background: active ? `${fmt.color}14` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${active ? fmt.color + '55' : 'rgba(255,255,255,0.06)'}`,
                transform: active ? 'translateY(-3px)' : 'none',
                boxShadow: active ? `0 10px 30px ${fmt.color}22` : 'none',
              }}>
              <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', height: 152, width: 84 }}>
                <fmt.Mock color={fmt.color} />
              </div>
              <p className="text-[10px] font-black leading-tight whitespace-nowrap"
                style={{ color: active ? fmt.color : '#5a6087' }}>
                {fmt.n}. {fmt.nome}
              </p>
            </button>
          )
        })}
      </div>

      {/* Detalhe */}
      <AnimatePresence mode="wait">
        <motion.div key={f.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex-shrink-0 mt-3 rounded-3xl p-5 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-9 items-center"
          style={{ background: `linear-gradient(120deg, ${f.color}10, rgba(255,255,255,0.02))`, border: `1px solid ${f.color}2e` }}>
          <div className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 174, height: 309 }}>
            <div style={{ transform: 'scale(1.5)' }}><f.Mock color={f.color} /></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl lg:text-3xl font-black" style={{ color: f.color }}>{String(f.n).padStart(2, '0')}</span>
              <h3 className="text-xl lg:text-2xl font-black text-white">{f.nome}</h3>
            </div>
            <div className="grid gap-2.5">
              <Row label="Objetivo"  value={f.objetivo}  color={f.color} />
              <Row label="Estrutura" value={f.estrutura} color={f.color} />
              <Row label="Melhor uso" value={f.uso}      color={f.color} />
              <Row label="Funil"     value={f.funil}     color={f.color} />
            </div>
            {f.regra && (
              <div className="mt-3 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
                style={{ background: `${f.color}16`, border: `1px solid ${f.color}33` }}>
                <span className="text-sm">⚠️</span>
                <p className="text-xs font-bold text-white">{f.regra}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div className="flex gap-3">
      <span className="text-[9px] font-black uppercase tracking-wider w-16 flex-shrink-0 pt-0.5" style={{ color: `${color}99` }}>{label}</span>
      <span className="text-xs lg:text-sm leading-relaxed flex-1" style={{ color: '#c3c8e0' }}>{value}</span>
    </div>
  )
}

function SlideObjetivoFormato() {
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-5xl mx-auto w-full py-6">
      <Eyebrow color={BLUE}>O quadro que amarra tudo</Eyebrow>
      <div className="mt-3 mb-6"><Title size="md">Objetivo → Formato</Title></div>
      <div className="grid gap-2.5">
        {OBJETIVO_FORMATO.map((r, i) => (
          <motion.div key={r.obj} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
            className="rounded-2xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: `${r.color}0d`, border: `1px solid ${r.color}2a` }}>
            <div className="flex items-center gap-2.5 sm:w-48 flex-shrink-0">
              <div className="w-1.5 h-8 rounded-full" style={{ background: r.color }} />
              <span className="text-base font-black text-white">{r.obj}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {r.fmts.map(f => (
                <span key={f} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: `${r.color}1c`, color: r.color, border: `1px solid ${r.color}33` }}>{f}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6"><Quote color={BLUE}>Quem escolhe formato por gosto está apostando. Quem escolhe por objetivo está operando.</Quote></div>
    </div>
  )
}

function SlideRegras() {
  const regras = [
    { icon: '🪝', t: 'Hook', d: 'Quebra de padrão + emoção + curiosidade' },
    { icon: '✂️', t: 'Takes', d: 'Máximo 5 segundos cada' },
    { icon: '💬', t: 'Legenda', d: 'A maioria assiste sem som' },
    { icon: '🎁', t: 'Micro recompensa', d: 'Ao longo do vídeo · payoff no fim' },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-5xl mx-auto w-full py-6">
      <Eyebrow>Valem para todos os formatos</Eyebrow>
      <div className="mt-3 mb-6"><Title size="md">As regras de retenção</Title></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {regras.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="h-full text-center">
              <div className="text-2xl mb-2">{r.icon}</div>
              <p className="text-sm font-black text-white mb-1">{r.t}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#7a80a5' }}>{r.d}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <Card color={RED}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: RED }}>❌ Hook fraco</p>
          <p className="text-sm text-white/60 italic">"Hoje vou ensinar..."</p>
        </Card>
        <Card color={GREEN}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: GREEN }}>✅ Hook forte</p>
          <p className="text-sm text-white font-bold italic">"Se você faz isso..." · "Você provavelmente..."</p>
        </Card>
      </div>

      <Quote color={PURPLE}>Reels não vendem. Reels atraem. Stories convertem.</Quote>
    </div>
  )
}

function SlideNumeros() {
  const rows = [
    { c: 'Campanha "volume"',     cpl: 'R$ 15', leads: 200, fecha: '2%', vendas: 4, fat: 'R$ 32.000', cpv: 'R$ 750', win: false },
    { c: 'Campanha "qualificada"', cpl: 'R$ 40', leads: 75,  fecha: '8%', vendas: 6, fat: 'R$ 48.000', cpv: 'R$ 500', win: true },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-6xl mx-auto w-full py-6">
      <Eyebrow color={AMBER}>Os números que importam</Eyebrow>
      <div className="mt-3 mb-2"><Title size="md">Lead barato pode ser<br />o mais caro de todos.</Title></div>
      <p className="text-xs mb-5" style={{ color: '#5a6087' }}>Móveis Planejados "Casa Nova" · exemplo ilustrativo</p>

      <div className="rounded-2xl overflow-hidden mb-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="grid grid-cols-7 gap-px text-[10px] font-black uppercase tracking-wider"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          {['Campanha', 'Custo/lead', 'Leads', '% fecha', 'Vendas', 'Faturamento', 'Custo/venda'].map(h => (
            <div key={h} className="px-2 py-2.5 text-center" style={{ background: '#0e1020', color: '#5a6087' }}>{h}</div>
          ))}
        </div>
        {rows.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.2 }}
            className="grid grid-cols-7 gap-px text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[r.c, r.cpl, r.leads, r.fecha, r.vendas, r.fat, r.cpv].map((v, j) => (
              <div key={j} className="px-2 py-3 text-xs lg:text-sm font-bold flex items-center justify-center"
                style={{
                  background: r.win ? `${GREEN}10` : 'rgba(255,255,255,0.015)',
                  color: r.win && (j === 5 || j === 6) ? GREEN : j === 0 ? '#c3c8e0' : '#8890b5',
                }}>
                {v}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Quote color={AMBER}>Se você comemora lead barato, talvez esteja comemorando o problema.</Quote>
        <Card color={RED}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: RED }}>O teto de aumentar verba</p>
          <p className="text-xs leading-relaxed" style={{ color: '#8890b5' }}>
            Leilão mais caro + 12,5% de tributo + criativo saturado: dobrar a verba <strong className="text-white">não dobra o resultado</strong>.
            Cada real novo compra um lead pior.
          </p>
          <p className="text-sm font-black mt-2.5" style={{ color: GREEN }}>A alavanca não é orçamento. É criativo e qualificação.</p>
        </Card>
      </div>
    </div>
  )
}

function SlideEncosta() {
  const itens = [
    { icon: '⚡', t: 'Velocidade de contato', d: 'A janela quente do lead é curta' },
    { icon: '🔁', t: 'Follow-up', d: 'A maioria desiste no primeiro "vou pensar"' },
    { icon: '🎧', t: 'Atendimento consistente', d: 'Lead bom morre em atendimento ruim' },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-4xl mx-auto w-full py-6">
      <Eyebrow color="#5a6087">Depois do clique</Eyebrow>
      <div className="mt-3 mb-5"><Title size="md">O tráfego entrega o lead.<br />O resto define se ele valeu.</Title></div>
      <div className="grid gap-2.5 mb-6">
        {itens.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Card color="#5a6087">
              <div className="flex items-center gap-3.5">
                <span className="text-xl">{it.icon}</span>
                <div>
                  <p className="text-sm font-black text-white">{it.t}</p>
                  <p className="text-xs" style={{ color: '#7a80a5' }}>{it.d}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Quote color="#5a6087">
        O melhor tráfego do mundo não sobrevive a um comercial que demora 6 horas pra responder.
      </Quote>
    </div>
  )
}

function SlideChecklist() {
  const [checks, setChecks] = useState({})
  const done = Object.values(checks).filter(Boolean).length
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-3xl mx-auto w-full py-6">
      <Eyebrow>Leve com você</Eyebrow>
      <div className="mt-3 mb-5">
        <Title size="md">Está pronto pra investir?</Title>
      </div>
      <div className="grid gap-2 mb-5">
        {CHECKLIST.map((c, i) => {
          const on = !!checks[i]
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
              className="rounded-xl px-4 py-3 flex items-center gap-3.5 cursor-pointer transition-all select-none"
              style={{
                background: on ? `${GREEN}12` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${on ? GREEN + '3a' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: on ? GREEN : 'transparent', border: `2px solid ${on ? GREEN : '#3f4463'}` }}>
                {on && <span className="text-[10px] font-black" style={{ color: '#0a0b14' }}>✓</span>}
              </div>
              <p className={`text-sm font-bold flex-1 ${on ? 'text-white' : ''}`} style={{ color: on ? '#fff' : '#8890b5' }}>{c}</p>
            </motion.div>
          )
        })}
      </div>
      <div className="rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
        style={{ background: done >= 5 ? `${GREEN}12` : `${RED}0d`, border: `1px solid ${done >= 5 ? GREEN + '33' : RED + '2a'}` }}>
        <p className="text-sm font-bold text-white">
          {done >= 5 ? '✅ Pronto pra investir.' : 'Se você marcou menos de 5, o problema não vai ser o tráfego.'}
        </p>
        <span className="text-2xl font-black flex-shrink-0" style={{ color: done >= 5 ? GREEN : RED }}>{done}/7</span>
      </div>
    </div>
  )
}

function SlideFecho() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 lg:px-14 max-w-3xl mx-auto w-full py-6">
      <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight mb-8">
        Não é o mercado que saturou.<br />
        <span style={{ color: GREEN }}>É o seu criativo.</span>
      </motion.h2>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="w-full max-w-2xl">
        <Quote>
          A tendência é aumentar a velocidade e a volatilidade desse trabalho.
          Unam-se a bons parceiros que estejam um passo à frente dessas mudanças.
        </Quote>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="mt-12">
        <p className="text-5xl lg:text-7xl font-black tracking-tighter"
          style={{ background: `linear-gradient(100deg, ${GREEN}, ${BLUE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Perguntas?
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.2em] mt-6" style={{ color: '#5a6087' }}>
          Tráfeg.on
        </p>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Deck
   ───────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: 'capa', label: 'Capa', Comp: SlideCapa, min: 1,
    notes: [
      'Enuncie a tese como promessa: "vou defender que o problema raramente é sua verba — e vou mostrar os números que provam".',
      'Repita essa mesma frase no fecho. É o que eles vão levar e repetir.',
    ],
  },
  {
    id: 'abertura', label: 'Abertura', Comp: SlideAbertura, min: 3,
    notes: [
      'Pergunta 1: mapeia a sala. Ajuste a profundidade dos blocos ao vivo conforme a proporção.',
      'Pergunta 2: quase todos levantam a mão. Cria o "não é só comigo".',
    ],
  },
  {
    id: 'perguntas', label: 'Fundamentos', Comp: SlidePerguntas, min: 8,
    notes: [
      '60–90 segundos por pergunta. Clique pra abrir uma de cada vez.',
      'Devolva algumas pra sala antes de responder: "alguém arrisca?". Mantém a troca e poupa fôlego.',
      'Se atrasar, este é o bloco mais compressível — empurre 4-5 perguntas pro Q&A.',
    ],
  },
  {
    id: 'cenario', label: 'Cenário 2026', Comp: SlideCenario, min: 10,
    notes: [
      'Função do bloco: tirar a culpa do empresário e criar urgência sem pitch.',
      'Armadilha: não vire lamento. Termine sempre em "e por isso a estratégia importa mais do que nunca".',
      'Não corte este bloco. É informação de quem está dentro — te separa de palestrante genérico.',
    ],
  },
  {
    id: 'eixo', label: 'O criativo', Comp: SlideCriativoEixo, min: 4,
    notes: [
      'Este é o coração da aula. Dê peso.',
      'Conecte: é por isso que quem já roda está testando novos formatos. Não é frescura de edição — é a alavanca que sobrou.',
    ],
  },
  {
    id: 'formatos', label: 'Formatos', Comp: SlideFormatos, min: 10,
    notes: [
      'Clique nos mockups da tira pra trocar o formato em destaque.',
      'Pergunte pra sala: "quantos desses 8 vocês têm rodando hoje?". A maioria terá um.',
      'Aí vem o soco: "não é o mercado que saturou, é o seu criativo".',
      'Novelinha e Tela Dividida saíram da conversa do grupo — vale nomear quem citou.',
    ],
  },
  {
    id: 'quadro', label: 'Objetivo × Formato', Comp: SlideObjetivoFormato, min: 4,
    notes: ['Este é o slide que eles vão querer fotografar. Dê tempo.'],
  },
  {
    id: 'regras', label: 'Retenção', Comp: SlideRegras, min: 4,
    notes: ['"Reels não vendem. Reels atraem. Stories convertem." — frase curta e contraintuitiva. Todo mundo anota.'],
  },
  {
    id: 'numeros', label: 'Números', Comp: SlideNumeros, min: 12,
    notes: [
      'Monte a tabela ao vivo: pergunte os números antes de mostrar. "De 200 leads, quantos vocês acham que fecham?"',
      'A plateia chuta, você revela. Muito mais forte que mostrar pronto.',
      'Ataca de frente o instinto de "aumentar a verba" — que no cenário de 2026 é o caminho mais caro.',
    ],
  },
  {
    id: 'encosta', label: 'Depois do clique', Comp: SlideEncosta, min: 4,
    notes: [
      'Curto. Uma passada. NÃO vire uma aula de vendas — o tema de hoje é tráfego.',
      'Planta a semente e segue.',
    ],
  },
  {
    id: 'checklist', label: 'Checklist', Comp: SlideChecklist, min: 3,
    notes: [
      'Handout de 1 página. Entregue impresso.',
      'Frase de entrega: "se você marcou menos de 5, o problema não vai ser o tráfego".',
    ],
  },
  {
    id: 'fecho', label: 'Fecho + Q&A', Comp: SlideFecho, min: 12,
    notes: [
      'Retome a tese central palavra por palavra, como disse no início.',
      'Sem oferta, sem preço, sem link. A aula inteira foi a prova.',
      'Ganchos pro Q&A se travar:',
      '· "Alguém aumentou a verba e o resultado não acompanhou?"',
      '· "Quantos criativos novos vocês produzem por mês?"',
      '· "Alguém sabe seu custo por venda — não por lead?"',
      '· "Quantos dos 8 formatos vocês têm rodando hoje?"',
    ],
  },
]

export default function EsClub() {
  const [i, setI] = useState(0)
  const [full, setFull] = useState(false)
  const [notes, setNotes] = useState(false)
  const total = SLIDES.length

  const go = useCallback(d => setI(p => Math.min(total - 1, Math.max(0, p + d))), [total])

  useEffect(() => {
    const onKey = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1)
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   go(-1)
      if (e.key === 'n' || e.key === 'N') setNotes(v => !v)
      if (e.key === 'Escape') { setFull(false); setNotes(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const slide = SLIDES[i]
  const Cur = slide.Comp

  return (
    <div className={full ? 'fixed inset-0 z-[60]' : 'p-3 lg:p-6'}>
      <div className={`relative overflow-hidden flex flex-col ${full ? 'h-full rounded-none' : 'rounded-3xl'}`}
        style={{
          background: BG_DEEP,
          border: full ? 'none' : '1px solid rgba(255,255,255,0.07)',
          height: full ? '100%' : 'calc(100vh - 190px)',
          minHeight: 560,
          boxShadow: full ? 'none' : '0 24px 70px rgba(0,0,0,0.4)',
        }}>

        {/* glow ambiente */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${GREEN}0f 0%, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 50% 40% at 90% 100%, ${PURPLE}0f 0%, transparent 70%)` }} />

        {/* topo */}
        <div className="relative z-20 flex items-center gap-3 px-4 lg:px-6 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: `${GREEN}1e`, color: GREEN, border: `1px solid ${GREEN}33` }}>ES</div>
            <span className="text-xs font-black text-white hidden sm:block">ES Club</span>
          </div>
          <div className="h-4 w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="flex-1 flex gap-1 overflow-x-auto scrollbar-none">
            {SLIDES.map((s, idx) => (
              <button key={s.id} onClick={() => setI(idx)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: i === idx ? `${GREEN}1e` : 'transparent',
                  color: i === idx ? GREEN : '#4a5070',
                }}>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => setNotes(v => !v)} title="Notas do apresentador (N)"
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: notes ? `${AMBER}1e` : 'rgba(255,255,255,0.05)',
              color: notes ? AMBER : '#8890b5',
            }}>
            <NotebookPen size={13} />
          </button>
          <button onClick={() => setFull(f => !f)}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#8890b5' }}>
            {full ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* slide */}
        <div className="relative z-10 flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={SLIDES[i].id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }} className="h-full">
              <Cur />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* notas do apresentador */}
        <AnimatePresence>
          {notes && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="relative z-20 flex-shrink-0 overflow-hidden"
              style={{ borderTop: `1px solid ${AMBER}2e`, background: 'rgba(245,158,11,0.05)' }}>
              <div className="px-4 lg:px-6 py-3 max-h-44 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <NotebookPen size={11} style={{ color: AMBER }} />
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: AMBER }}>
                    Notas do apresentador
                  </span>
                  {slide.min && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                      style={{ background: `${AMBER}1e`, color: AMBER }}>{slide.min} min</span>
                  )}
                  <span className="text-[9px] ml-auto" style={{ color: '#5a6087' }}>tecla N</span>
                </div>
                {slide.notes?.length ? (
                  <ul className="space-y-1">
                    {slide.notes.map((n, k) => (
                      <li key={k} className="text-xs leading-relaxed flex gap-2" style={{ color: '#b9bfd8' }}>
                        {!n.startsWith('·') && <span className="flex-shrink-0" style={{ color: `${AMBER}88` }}>—</span>}
                        <span className={n.startsWith('·') ? 'pl-4' : ''}>{n}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs" style={{ color: '#5a6087' }}>Sem notas para este slide.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* rodapé */}
        <div className="relative z-20 flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => go(-1)} disabled={i === 0}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-25"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#8890b5' }}>
            <ChevronLeft size={13} /> Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} className="rounded-full transition-all"
                style={{
                  width: i === idx ? 18 : 5, height: 5,
                  background: i === idx ? GREEN : 'rgba(255,255,255,0.14)',
                }} />
            ))}
            <span className="text-[10px] font-black ml-2.5" style={{ color: '#4a5070' }}>
              {String(i + 1).padStart(2, '0')} / {total}
            </span>
          </div>

          <button onClick={() => go(1)} disabled={i === total - 1}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-25"
            style={{ background: `${GREEN}1a`, color: GREEN, border: `1px solid ${GREEN}2e` }}>
            Próximo <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
