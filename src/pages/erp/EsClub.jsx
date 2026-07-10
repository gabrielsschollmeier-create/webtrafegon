import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, NotebookPen, Heart, MessageCircle, Send, ArrowLeft } from 'lucide-react'

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

const PW = 128, PH = 228

/* Moldura de Reels: barra de progresso, trilha de ações, legenda patrocinada */
function Phone({ children, color = GREEN, scale = 1, chrome = true }) {
  return (
    <div style={{ width: PW * scale, height: PH * scale, flexShrink: 0 }}>
      <div className="relative overflow-hidden rounded-[15px]"
        style={{
          width: PW, height: PH,
          transform: `scale(${scale})`, transformOrigin: 'top left',
          background: '#07080f',
          border: `1.5px solid ${color}80`,
          boxShadow: `0 0 0 1px ${color}20, 0 14px 44px rgba(0,0,0,0.55), 0 0 34px ${color}26, inset 0 0 70px ${color}18`,
        }}>

        {/* arte do formato */}
        <div className="absolute inset-0">{children}</div>

        {chrome && (
          <>
            {/* barra de progresso */}
            <div className="absolute inset-x-0 top-0 flex gap-[2px] px-2 pt-2 z-30">
              {[0, 1, 2].map(k => (
                <div key={k} className="flex-1 rounded-full"
                  style={{ height: 1.5, background: k === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </div>

            {/* trilha de ações */}
            <div className="absolute right-1.5 bottom-9 z-30 flex flex-col items-center gap-2">
              <Heart size={9} style={{ color: 'rgba(255,255,255,0.65)' }} fill="rgba(255,255,255,0.65)" />
              <MessageCircle size={9} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <Send size={9} style={{ color: 'rgba(255,255,255,0.45)' }} />
            </div>

            {/* legenda */}
            <div className="absolute inset-x-0 bottom-0 z-30 px-2 pb-2 pt-6"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8) 55%)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="rounded-full" style={{ width: 9, height: 9, background: color }} />
                <div className="rounded-full" style={{ width: 26, height: 2.5, background: 'rgba(255,255,255,0.5)' }} />
                <span className="text-[5px] font-black rounded-[2px] px-[3px] leading-[7px]"
                  style={{ color: 'rgba(255,255,255,0.45)', border: '0.5px solid rgba(255,255,255,0.25)' }}>Ad</span>
              </div>
              <div className="rounded-full mb-[3px]" style={{ width: '72%', height: 2, background: 'rgba(255,255,255,0.22)' }} />
              <div className="rounded-full" style={{ width: '45%', height: 2, background: 'rgba(255,255,255,0.14)' }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* Silhueta */
const Person = ({ color = '#8890b5', s = 1, o = 1 }) => (
  <div className="flex flex-col items-center" style={{ transform: `scale(${s})`, opacity: o }}>
    <div className="rounded-full" style={{ width: 15, height: 15, background: color }} />
    <div className="-mt-[1px]" style={{ width: 27, height: 15, background: color, opacity: 0.55, borderRadius: '14px 14px 3px 3px' }} />
  </div>
)

const Bubble = ({ side = 'l', color, w = 22 }) => (
  <div className="px-1 py-[3px] flex gap-[2px] items-center"
    style={{
      background: side === 'l' ? 'rgba(255,255,255,0.14)' : `${color}55`,
      borderRadius: side === 'l' ? '7px 7px 7px 1px' : '7px 7px 1px 7px',
      width: w,
    }}>
    {[1, 2, 3].map(k => (
      <div key={k} className="rounded-full flex-1" style={{ height: 2, background: side === 'l' ? 'rgba(255,255,255,0.45)' : color }} />
    ))}
  </div>
)

const Tag = ({ children, color, className = '' }) => (
  <span className={`text-[5px] font-black tracking-wider rounded px-1 py-[1px] ${className}`}
    style={{ background: `${color}4d`, color: '#fff', border: `0.5px solid ${color}` }}>{children}</span>
)

/* 1. Tela Dividida — pessoa em cima, print/gráfico embaixo */
const MockTelaDividida = ({ color }) => (
  <Phone color={color}>
    <div className="h-[46%] relative flex items-end justify-center pb-2"
      style={{ background: `radial-gradient(ellipse at 50% 120%, ${color}66, #0b0d18 78%)` }}>
      <Person color={color} s={1.35} />
      <div className="absolute top-6 left-2"><Tag color={color}>VOCÊ</Tag></div>
    </div>

    <div className="h-[3px] w-full"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 10px ${color}` }} />

    <div className="h-[54%] p-2 pt-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
      {/* barra de navegador */}
      <div className="flex items-center gap-[3px] rounded-[3px] px-1 py-[2px] mb-2"
        style={{ background: 'rgba(255,255,255,0.11)' }}>
        {['#ef4444', '#f59e0b', '#6eda2c'].map(c => (
          <div key={c} className="rounded-full" style={{ width: 2.5, height: 2.5, background: c }} />
        ))}
        <div className="rounded-full ml-1" style={{ width: 34, height: 2, background: 'rgba(255,255,255,0.32)' }} />
      </div>
      <div className="flex items-end gap-[3px]" style={{ height: 42 }}>
        {[38, 58, 30, 92, 47, 66].map((h, k) => (
          <div key={k} className="flex-1 rounded-t-[2px]"
            style={{
              height: `${h}%`,
              background: h === 92 ? color : `${color}70`,
              boxShadow: h === 92 ? `0 0 10px ${color}` : 'none',
            }} />
        ))}
      </div>
      <div className="mt-1.5"><Tag color={color}>PROVA NA TELA</Tag></div>
    </div>
  </Phone>
)

/* 2. React — post original ao fundo, você numa bolha */
const MockReact = ({ color }) => (
  <Phone color={color}>
    <div className="h-full p-2.5 pt-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-1 mb-2 opacity-70">
        <div className="rounded-full" style={{ width: 8, height: 8, background: '#8890b5' }} />
        <div className="rounded-full" style={{ width: 22, height: 2, background: '#8890b5' }} />
      </div>
      {[86, 96, 62, 90, 48].map((w, k) => (
        <div key={k} className="rounded-full mb-[5px]"
          style={{ width: `${w}%`, height: 3, background: 'rgba(255,255,255,0.24)' }} />
      ))}
      <div className="mt-2"><Tag color="#8890b5">VÍDEO DE ALGUÉM</Tag></div>
    </div>

    {/* bolha de reação */}
    <div className="absolute z-20 rounded-[9px] overflow-hidden flex items-end justify-center"
      style={{
        right: 7, bottom: 42, width: 48, height: 62,
        background: `linear-gradient(180deg, ${color}4d, #0b0d18)`,
        border: `1.5px solid ${color}`, boxShadow: `0 6px 24px ${color}, 0 0 0 3px ${color}26`,
      }}>
      <Person color={color} s={0.85} />
    </div>
    <div className="absolute z-20" style={{ left: 8, bottom: 46 }}>
      <Tag color={color}>+ SUA OPINIÃO</Tag>
    </div>
  </Phone>
)

/* 3. Novelinha — três cenas em tensão crescente */
const MockNovelinha = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex flex-col pt-3">
      {[
        { l: 'CONFLITO', o: 0.55, bg: '14' },
        { l: 'TENSÃO',   o: 0.8,  bg: '26' },
        { l: 'VIRADA',   o: 1,    bg: '40' },
      ].map((s, k) => (
        <div key={s.l} className="flex-1 relative flex items-center justify-center gap-3"
          style={{
            background: `linear-gradient(100deg, ${color}${s.bg}, transparent)`,
            borderBottom: k < 2 ? '1px solid rgba(255,255,255,0.09)' : 'none',
          }}>
          <div className="relative">
            <Person color={color} s={0.62} o={s.o} />
            {k === 0 && <div className="absolute -top-1 -left-4"><Bubble side="l" color={color} w={18} /></div>}
          </div>
          <div className="relative">
            <Person color="#8890b5" s={0.62} o={s.o} />
            {k === 1 && <div className="absolute -top-1 -right-4"><Bubble side="r" color={color} w={18} /></div>}
          </div>
          <div className="absolute left-1.5 top-1.5"><Tag color={color}>{s.l}</Tag></div>
        </div>
      ))}
    </div>
  </Phone>
)

/* 4. Comparativo — A vs B */
const MockComparativo = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex pt-4">
      <div className="w-1/2 px-1.5 pt-3 flex flex-col gap-2" style={{ background: `${RED}26` }}>
        <span className="text-[9px] leading-none mx-auto">❌</span>
        {[1, 2, 3, 4].map(k => (
          <div key={k} className="flex items-center gap-1">
            <div className="rounded-full flex-shrink-0" style={{ width: 3, height: 3, background: RED }} />
            <div className="rounded-full flex-1" style={{ height: 2.5, background: RED, opacity: 0.6 }} />
          </div>
        ))}
      </div>
      <div className="w-1/2 px-1.5 pt-3 flex flex-col gap-2" style={{ background: `${color}2e` }}>
        <span className="text-[9px] leading-none mx-auto">✅</span>
        {[1, 2, 3, 4].map(k => (
          <div key={k} className="flex items-center gap-1">
            <div className="rounded-full flex-shrink-0" style={{ width: 3, height: 3, background: color }} />
            <div className="rounded-full flex-1" style={{ height: 2.5, background: color, opacity: 0.8 }} />
          </div>
        ))}
      </div>
    </div>
    <div className="absolute z-20 rounded-full flex items-center justify-center"
      style={{
        left: '50%', top: '46%', transform: 'translate(-50%,-50%)',
        width: 22, height: 22, background: '#07080f', border: '1px solid rgba(255,255,255,0.45)',
      }}>
      <span className="text-[6px] font-black text-white">VS</span>
    </div>
  </Phone>
)

/* 5. Narrado — cortes rápidos + waveform */
const MockNarrado = ({ color }) => (
  <Phone color={color}>
    <div className="h-full flex flex-col pt-3">
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
        {[0, 1, 2, 3].map(k => (
          <div key={k} className="rounded-[3px] flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(${40 + k * 45}deg, ${color}${k % 2 ? '3d' : '1f'}, #0b0d18)` }}>
            <Person color={color} s={0.42} o={0.7 + k * 0.1} />
            <span className="absolute top-[3px] left-[4px] text-[5px] font-black" style={{ color: '#fff' }}>
              {k + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="px-2 py-2" style={{ background: 'rgba(0,0,0,0.45)' }}>
        <div className="flex items-center gap-[2px] mb-1.5" style={{ height: 12 }}>
          {[30, 62, 40, 88, 55, 72, 35, 95, 48, 66, 28, 80, 44, 58].map((h, k) => (
            <div key={k} className="flex-1 rounded-full"
              style={{ height: `${h}%`, background: k < 5 ? color : `${color}59` }} />
          ))}
        </div>
        <Tag color={color}>TAKES ≤ 5s</Tag>
      </div>
    </div>
  </Phone>
)

/* 6. Trend com texto — texto carrega tudo, funciona mudo */
const MockTrend = ({ color }) => (
  <Phone color={color}>
    <div className="h-full relative flex items-end justify-center pb-10"
      style={{ background: `radial-gradient(ellipse at 50% 95%, ${color}4d, #0b0d18 72%)` }}>
      <Person color="#8890b5" s={1.5} o={0.55} />
      <div className="absolute inset-x-2 top-8">
        <p className="text-[9px] font-black text-white leading-[1.15] text-center"
          style={{ textShadow: '0 2px 10px #000, 0 0 20px #000' }}>
          QUANDO VOCÊ<br />PERCEBE QUE O<br />CONCORRENTE<br />APARECE E<br />VOCÊ NÃO
        </p>
      </div>
      <div className="absolute z-20 rounded-full px-1.5 py-[2px] flex items-center gap-1"
        style={{ left: '50%', bottom: 44, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)' }}>
        <span className="text-[6px] leading-none">🔇</span>
        <span className="text-[5px] font-black" style={{ color: 'rgba(255,255,255,0.55)' }}>FUNCIONA MUDO</span>
      </div>
    </div>
  </Phone>
)

/* 7. Conversa — abordagem espontânea */
const MockConversa = ({ color }) => (
  <Phone color={color}>
    <div className="h-full relative flex items-end justify-center gap-2 pb-11"
      style={{ background: `linear-gradient(180deg, ${color}33, #0b0d18 68%)` }}>
      <div className="absolute left-2" style={{ top: 26 }}><Bubble side="l" color={color} w={30} /></div>
      <div className="absolute right-2" style={{ top: 52 }}><Bubble side="r" color={color} w={24} /></div>
      <Person color="#8890b5" s={1.05} o={0.9} />
      <Person color={color} s={1.05} />
      <div className="absolute left-2" style={{ bottom: 44 }}><Tag color={color}>SEM ROTEIRO</Tag></div>
    </div>
  </Phone>
)

/* 8. Lista / Ranking — progressão numerada */
const MockLista = ({ color }) => (
  <Phone color={color}>
    <div className="h-full px-2 pt-5 pb-10 flex flex-col">
      <p className="text-[8px] font-black text-white leading-tight mb-2">
        TOP 5 ERROS<br /><span style={{ color }}>que custam cliente</span>
      </p>
      <div className="flex-1 flex flex-col gap-[5px]">
        {[1, 2, 3, 4, 5].map(k => (
          <div key={k} className="flex items-center gap-1.5 rounded-[4px] px-1 py-[3px]"
            style={{
              background: k === 5 ? `${color}40` : 'rgba(255,255,255,0.08)',
              border: k === 5 ? `0.5px solid ${color}` : '0.5px solid transparent',
              boxShadow: k === 5 ? `0 0 12px ${color}59` : 'none',
            }}>
            <span className="text-[7px] font-black w-2 text-center" style={{ color: k === 5 ? '#fff' : `${color}a6` }}>{k}</span>
            <div className="rounded-full flex-1" style={{ height: 2.5, background: '#fff', opacity: k === 5 ? 0.75 : 0.24 }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5"><Tag color={color}>O 5º SEGURA ATÉ O FIM</Tag></div>
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
    exemplo: {
      cena: 'Você falando de um lado. Do outro, a tela do Google mostrando três concorrentes anunciando — e a sua empresa em lugar nenhum.',
      hook: 'Seu negócio nem aparece quando alguém procura exatamente o que você vende.',
    },
  },
  {
    n: 2, nome: 'React', color: PURPLE, Mock: MockReact,
    objetivo: 'Pegar audiência emprestada de temas quentes',
    estrutura: 'Gancho → trecho → opinião forte → explicação → takeaway.',
    uso: 'Polêmicas · Erros do mercado · Notícias',
    funil: 'Topo',
    regra: 'React sem insight = conteúdo preguiçoso.',
    exemplo: {
      cena: 'Você reage ao vídeo de alguém afirmando que "empresa boa não precisa anunciar" — e desmonta o argumento com o seu próprio caso.',
      hook: 'Esse conselho está travando o crescimento de milhares de empresas.',
    },
  },
  {
    n: 3, nome: 'Novelinha', color: GREEN, Mock: MockNovelinha,
    objetivo: 'Retenção extrema via storytelling',
    estrutura: 'Conflito → tensão → virada → lição. Mais de 1 personagem, ninguém olha pra câmera.',
    uso: 'Identificação · Humor · Frustração',
    funil: 'Topo',
    regra: 'Sem conflito nos primeiros segundos, sem retenção.',
    exemplo: {
      cena: 'Dono no balcão. Alguém pergunta: "como você consegue cliente?" — "Indicação." Corta. Mesmo dono, semanas depois: "esse mês tá parado."',
      hook: 'Previsibilidade não vem de indicação. Vem de aquisição.',
    },
  },
  {
    n: 4, nome: 'Comparativo', color: RED, Mock: MockComparativo,
    objetivo: 'Clareza rápida e compartilhamento',
    estrutura: 'A vs B. ❌ o jeito errado / ✅ o jeito certo.',
    uso: 'Mudança de crença · Compartilhamento',
    funil: 'Topo',
    exemplo: {
      cena: 'Empresa invisível VS empresa estruturada. ❌ vive de indicação · ❌ não aparece no Google · ✅ tem previsibilidade · ✅ sabe seu custo por venda.',
      hook: 'Duas empresas do mesmo tamanho. Só uma cresce todo mês.',
    },
  },
  {
    n: 5, nome: 'Narrado', color: AMBER, Mock: MockNarrado,
    objetivo: 'Retenção cinematográfica',
    estrutura: 'Hook → narrativa → prova → payoff.',
    uso: 'Identificação · Curiosidade · Aspiração',
    funil: 'Topo e meio',
    regra: 'Máximo 5 segundos por take.',
    exemplo: {
      cena: 'Cortes rápidos da rotina da empresa enquanto sua voz narra por cima. Nenhum take passa de 5 segundos.',
      hook: 'O maior erro do empresário não é falta de cliente. É invisibilidade.',
    },
  },
  {
    n: 6, nome: 'Trend com Texto', color: ORANGE, Mock: MockTrend,
    objetivo: 'Alcance rápido',
    estrutura: 'Texto forte + cena cotidiana.',
    uso: 'Identificação · Frustração · Aspiração',
    funil: 'Topo',
    regra: 'Precisa funcionar sem som.',
    exemplo: {
      cena: 'Você trabalhando, cara de cansado, som de trend em alta. O texto na tela carrega a mensagem inteira.',
      hook: 'Quando você percebe que o concorrente aparece e você não.',
    },
  },
  {
    n: 7, nome: 'Conversa', color: '#22d3ee', Mock: MockConversa,
    objetivo: 'Parecer espontâneo e criar curiosidade',
    estrutura: 'Alguém aborda. Pergunta simples. Ambiente diferente.',
    uso: 'Curiosidade · Identificação',
    funil: 'Meio e fundo · converte',
    exemplo: {
      cena: 'Alguém te aborda fora do escritório, câmera na mão, como se fosse casual: "você realmente consegue cliente pela internet?"',
      hook: 'Se você fizer direito, sim. O problema é que quase ninguém faz.',
    },
  },
  {
    n: 8, nome: 'Lista / Ranking', color: '#f472b6', Mock: MockLista,
    objetivo: 'Retenção por progressão',
    estrutura: 'Top 3, Top 5, Top 7.',
    uso: 'Autoridade · Educação · Compartilhamento',
    funil: 'Topo e meio',
    exemplo: {
      cena: 'Cada erro aparece numerado na tela, um take por item. O quinto é o mais forte — é o que segura até o fim.',
      hook: 'Top 5 erros que fazem empresas perderem cliente online.',
    },
  },
]

/* Funil em miniatura, derivado do texto de `funil` de cada formato */
const ETAPAS = [
  { chave: 'topo',  letra: 'T', w: 30 },
  { chave: 'meio',  letra: 'M', w: 21 },
  { chave: 'fundo', letra: 'F', w: 12 },
]

function MiniFunil({ funil, color, size = 1 }) {
  const s = funil.toLowerCase()
  return (
    <div className="flex flex-col items-center" style={{ gap: 3 * size }}>
      {ETAPAS.map(e => {
        const on = s.includes(e.chave)
        return (
          <div key={e.chave} className="flex items-center" style={{ gap: 3 * size }}>
            <span className="font-black text-right" style={{
              fontSize: 7 * size, width: 6 * size, lineHeight: 1,
              color: on ? color : '#4a5070',
            }}>{e.letra}</span>
            <div style={{
              width: e.w * size, height: 3.5 * size, borderRadius: 3,
              background: on ? color : 'rgba(255,255,255,0.13)',
              boxShadow: on ? `0 0 8px ${color}66` : 'none',
            }} />
          </div>
        )
      })}
    </div>
  )
}

const OBJETIVO_FORMATO = [
  { obj: 'Alcance',           fmts: ['Trend', 'React', 'Novelinha'],        color: ORANGE },
  { obj: 'Retenção',          fmts: ['Narrado', 'Conversa', 'Novelinha'],   color: GREEN },
  { obj: 'Autoridade',        fmts: ['Lista', 'React', 'Tela Dividida'],    color: BLUE },
  { obj: 'Compartilhamento',  fmts: ['Comparativo', 'Lista'],               color: PURPLE },
  { obj: 'Conversão',         fmts: ['Narrado', 'Conversa'],                color: AMBER },
]

const PERGUNTAS = [
  'Como e por onde começar?',
  'Quanto investir no início para ter resultados?',
  'O que realmente funciona hoje em tráfego pago?',
  'Além de vídeos, fotos estáticas também funcionam?',
  'O tempo que a empresa faz tráfego influencia no valor do lead?',
]

const CENARIO_2026 = [
  { icon: '💸', color: RED,    t: 'Tributo de 12,5%',            d: 'Desde 01/01/26 a Meta parou de absorver. Quem investe R$ 1.000 entrega R$ 875 de mídia real.' },
  { icon: '🤖', color: PURPLE, t: 'Menos controle de segmentação', d: 'A I.A. assumiu. O Zuckerberg demitiu 8 mil funcionários pra forçar essa transição.' },
  { icon: '👥', color: ORANGE, t: 'Mais concorrentes',           d: 'O empresário está mais consciente. A vitrine ficou disputada e o leilão subiu.' },
  { icon: '🗳️', color: AMBER,  t: 'Ano eleitoral',                d: 'Campanha política injeta verba na plataforma. A tendência é encarecer ainda mais.' },
  { icon: '⚡', color: BLUE,   t: 'MCP liberado',                 d: 'Qualquer I.A. conecta no gerenciador. O ritmo de mudança acelerou.' },
  { icon: '🎬', color: GREEN,  t: 'A entrega depende do criativo', d: 'O algoritmo não funciona mais como antes. É o criativo que decide pra quem o anúncio aparece.' },
]

const CHECK_MARKETING = [
  { t: 'Público definido',       d: 'Sei exatamente pra quem estou falando' },
  { t: 'Oferta clara',           d: 'Sei o que vendo e por que comprar de mim, não do concorrente' },
  { t: 'Canal certo',            d: 'Meta, Google ou outro — onde meu cliente está e com que intenção' },
  { t: 'Criativos em volume',    d: 'Não 1 ou 2, cobrindo topo, meio e fundo de funil' },
  { t: 'Destino do lead',        d: 'WhatsApp, formulário ou página — decidido e testado' },
  { t: 'Verba compatível',       d: 'A conta fecha para a meta que eu quero bater' },
  { t: 'Rastreamento ativo',     d: 'Sei de onde veio cada lead' },
]

const CHECK_COMERCIAL = [
  { t: 'Alguém pra responder',   d: 'Em minutos, não em horas' },
  { t: 'Abordagem definida',     d: 'O que dizer na primeira mensagem' },
  { t: 'Script de atendimento',  d: 'Um roteiro, não improviso de cada um' },
  { t: 'Cadência de follow-up',  d: 'Quantos contatos, em quantos dias, por qual canal' },
  { t: 'CRM ou registro',        d: 'Todo lead anotado — nenhum se perde no WhatsApp' },
  { t: 'Critério de qualificação', d: 'Sei também pra quem NÃO vender' },
  { t: 'Custo por venda',        d: 'Sei quanto custa fechar um cliente, não só gerar um lead' },
]

/* ─────────────────────────────────────────────────────────────
   Slides
   ───────────────────────────────────────────────────────────── */

function SlideCapa() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160 }}>
        <Eyebrow>Encontro de Empresários</Eyebrow>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="text-4xl lg:text-7xl font-black leading-[0.95] tracking-tighter mt-7 mb-7">
        <span className="text-white">ES Club</span>
        <span style={{ color: '#3f4463' }}> · </span>
        <span style={{ background: `linear-gradient(100deg, ${GREEN}, ${BLUE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Tráfego pago
        </span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="max-w-2xl text-base lg:text-xl leading-relaxed" style={{ color: '#8890b5' }}>
        Antes se ganhava com segmentação e verba.<br className="hidden lg:block" />
        {' '}Hoje se ganha com <strong className="text-white font-bold">criativo em volume</strong> e{' '}
        <strong className="text-white font-bold">leitura correta dos números</strong>.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-xs font-bold uppercase tracking-[0.2em] mt-10" style={{ color: '#4a5070' }}>
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
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-5xl mx-auto w-full py-6">
      <Eyebrow>Fundamentos</Eyebrow>
      <div className="mt-3 mb-7">
        <Title size="md">As perguntas de vocês</Title>
      </div>
      <div className="space-y-2.5">
        {PERGUNTAS.map((q, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
            className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${GREEN}22` }}>
            <span className="text-lg lg:text-2xl font-black flex-shrink-0" style={{ color: `${GREEN}88` }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-base lg:text-xl font-bold text-white leading-snug">{q}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideCenario() {
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-6xl mx-auto w-full py-6">
      <div className="mb-6">
        <Title size="md">Cenário 2026</Title>
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
      <Eyebrow>O novo eixo · Redes sociais</Eyebrow>
      <div className="mt-3 mb-5">
        <Title size="md">Nas redes sociais, o criativo<br />virou a variável nº 1</Title>
      </div>
      <div className="mb-6">
        <Quote>
          No Meta, com menos segmentação manual, é o criativo que determina pra quem e quando o anúncio aparece.
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
  const [sel, setSel] = useState(null)

  /* ── Galeria: os 8 lado a lado ── */
  if (sel === null) {
    return (
      <div className="h-full flex flex-col px-6 lg:px-8 max-w-[1780px] mx-auto w-full py-3">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-3.5">
          <Title size="md">Exemplos de formatos vencedores</Title>
          <div className="flex items-center gap-5 pb-1">
            <div className="flex items-center gap-3 rounded-xl px-4 py-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <MiniFunil funil="topo meio fundo" color="#6b7194" size={1.35} />
              <div className="text-xs font-bold leading-[1.45]" style={{ color: '#6b7194' }}>
                <p>Topo</p><p>Meio</p><p>Fundo</p>
              </div>
            </div>
            <p className="text-xs font-bold" style={{ color: '#4a5070' }}>clique em um formato ↓</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {FORMATOS.map((f, i) => (
            <motion.button key={f.n} onClick={() => setSel(i)}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-4 lg:p-5 flex items-center gap-4 lg:gap-6 text-left"
              style={{
                background: `linear-gradient(135deg, ${f.color}1a, rgba(255,255,255,0.02))`,
                border: `1.5px solid ${f.color}4d`,
              }}>
              <Phone color={f.color} scale={1.56}>
                <f.Mock color={f.color} />
              </Phone>

              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div>
                  <p className="text-3xl font-black leading-none mb-2" style={{ color: `${f.color}99` }}>
                    {String(f.n).padStart(2, '0')}
                  </p>
                  <p className="text-lg xl:text-xl font-black leading-tight" style={{ color: f.color }}>
                    {f.nome}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MiniFunil funil={f.funil} color={f.color} size={1.5} />
                  <p className="text-xs font-bold leading-tight" style={{ color: '#9aa0c0' }}>{f.funil}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  /* ── Detalhe ── */
  const f = FORMATOS[sel]
  return (
    <div className="h-full flex flex-col px-6 lg:px-12 max-w-6xl mx-auto w-full py-5 overflow-y-auto">
      <button onClick={() => setSel(null)}
        className="flex items-center gap-1.5 text-[11px] font-black mb-4 self-start px-2.5 py-1.5 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.05)', color: '#8890b5' }}>
        <ArrowLeft size={12} /> Todos os formatos
      </button>

      <AnimatePresence mode="wait">
        <motion.div key={f.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="flex flex-col lg:flex-row gap-7 lg:gap-11 items-center lg:items-start">

          <div className="flex-shrink-0">
            <Phone color={f.color} scale={1.72}>
              <f.Mock color={f.color} />
            </Phone>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl lg:text-5xl font-black leading-none" style={{ color: f.color }}>
                  {String(f.n).padStart(2, '0')}
                </span>
                <h3 className="text-2xl lg:text-3xl font-black text-white leading-none">{f.nome}</h3>
              </div>
              <div className="flex items-center gap-2.5 ml-auto rounded-xl px-3 py-2"
                style={{ background: `${f.color}0f`, border: `1px solid ${f.color}26` }}>
                <MiniFunil funil={f.funil} color={f.color} size={1.1} />
                <div className="text-[9px] font-bold leading-[1.7]" style={{ color: '#5a6087' }}>
                  <p>Topo</p><p>Meio</p><p>Fundo</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2.5 mb-4">
              <Row label="Objetivo"   value={f.objetivo}  color={f.color} />
              <Row label="Estrutura"  value={f.estrutura} color={f.color} />
              <Row label="Melhor uso" value={f.uso}       color={f.color} />
            </div>

            {f.exemplo && (
              <div className="rounded-2xl px-4 py-4 mb-3"
                style={{ background: `linear-gradient(120deg, ${f.color}12, rgba(255,255,255,0.02))`, border: `1px solid ${f.color}33` }}>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-2.5" style={{ color: `${f.color}cc` }}>Exemplo</p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#c3c8e0' }}>{f.exemplo.cena}</p>
                <div className="rounded-xl px-3.5 py-2.5" style={{ background: 'rgba(0,0,0,0.28)' }}>
                  <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: `${f.color}99` }}>Hook</p>
                  <p className="text-sm lg:text-base font-bold text-white italic leading-snug">"{f.exemplo.hook}"</p>
                </div>
              </div>
            )}

            {f.regra && (
              <div className="rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
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
    </div>
  )
}

function SlideRegras() {
  const regras = [
    { icon: '🪝', t: 'Hook', d: 'Quebra de padrão + emoção + curiosidade' },
    { icon: '✂️', t: 'Takes', d: 'Máximo 5 segundos cada' },
    { icon: '💬', t: 'Legenda', d: 'A maioria assiste sem som' },
  ]
  return (
    <div className="h-full flex flex-col justify-center px-6 lg:px-14 max-w-5xl mx-auto w-full py-6">
      <Eyebrow>Valem para todos os formatos</Eyebrow>
      <div className="mt-3 mb-6"><Title size="md">Retenção — e quem<br />você deixa entrar</Title></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
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

      {/* O criativo como filtro e segmentação */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl p-5 mb-5"
        style={{ background: `linear-gradient(120deg, ${BLUE}12, rgba(255,255,255,0.02))`, border: `1px solid ${BLUE}33` }}>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2.5" style={{ color: BLUE }}>
          Reter é filtrar
        </p>
        <p className="text-base lg:text-xl font-black text-white leading-snug mb-3">
          O formato do criativo já escolhe quem fica.
        </p>

        <div className="flex gap-2 flex-wrap mb-3.5">
          {['Estático', 'Carrossel', 'Vídeo', 'Foto'].map(t => (
            <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background: `${BLUE}1c`, color: BLUE, border: `1px solid ${BLUE}33` }}>{t}</span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <p className="text-xs lg:text-sm leading-relaxed" style={{ color: '#c3c8e0' }}>
            Cada formato para um tipo de pessoa. Quem se identifica, assiste até o fim.
            Quem não é seu público, passa direto. <strong className="text-white">Isso não é perda — é filtro.</strong>
          </p>
          <p className="text-xs lg:text-sm leading-relaxed" style={{ color: '#c3c8e0' }}>
            E é exatamente assim que o Meta descobre quem é o seu cliente.
            <strong className="text-white"> Hoje o criativo é a sua segmentação.</strong>
          </p>
        </div>
      </motion.div>

      <Quote color={PURPLE}>Reels não vendem. Reels atraem. Stories convertem.</Quote>
    </div>
  )
}

/* ── Bloco de negócio ───────────────────────────────────────── */

const INDICADORES = [
  {
    n: 1, nome: 'CAC', sub: 'Custo de Aquisição de Cliente', color: BLUE,
    formula: 'Investimento em marketing e vendas ÷ nº de clientes conquistados',
    exemplo: 'R$ 10.000 ÷ 20 clientes = R$ 500 por cliente',
    analogia: 'Quanto custou cada cliente novo que passou a comprar com você.',
  },
  {
    n: 2, nome: 'Margem de contribuição', sub: 'Quanto sobra de cada venda', color: GREEN,
    formula: 'Preço de venda − custos variáveis (produto, imposto, frete, comissão)',
    exemplo: 'Vendeu R$ 1.000, custou R$ 500 → margem de R$ 500',
    analogia: 'Do valor da compra não sobra tudo: tire imposto, taxa de cartão e frete.',
  },
  {
    n: 3, nome: 'ARPU', sub: 'Receita média por cliente', color: '#22d3ee',
    formula: 'Receita total ÷ nº de clientes, dentro de um período',
    exemplo: 'R$ 100.000 ÷ 1.000 clientes = R$ 100 por cliente',
    analogia: 'Quanto o cliente médio gasta com você naquele período.',
  },
  {
    n: 4, nome: 'LTV', sub: 'Valor de vida do cliente', color: PURPLE,
    formula: '(ARPU − custos variáveis) × nº de períodos que o cliente fica ativo',
    exemplo: 'R$ 500/mês de margem × 12 meses = R$ 6.000',
    analogia: 'O lucro bruto que o cliente deixa ao longo de todo o relacionamento.',
  },
  {
    n: 5, nome: 'LTV : CAC', sub: 'O jogo vale a pena?', color: AMBER,
    formula: 'LTV ÷ CAC',
    exemplo: 'R$ 6.000 ÷ R$ 500 = 12x',
    analogia: 'Cada R$ 1 investido para trazer o cliente devolveu R$ 12 ao longo do ano.',
    leitura: ['> 1 · marketing gera lucro', '= 1 · empatando', '< 1 · pagando para trabalhar'],
  },
]

function CardIndicador({ ind, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-2xl p-5 lg:p-6 flex flex-col"
      style={{
        background: `linear-gradient(150deg, ${ind.color}14, rgba(255,255,255,0.02))`,
        border: `1.5px solid ${ind.color}4d`,
      }}>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-black leading-none" style={{ color: `${ind.color}99` }}>
          {ind.n}
        </span>
        <div className="min-w-0">
          <p className="text-xl lg:text-2xl font-black leading-tight" style={{ color: ind.color }}>{ind.nome}</p>
          <p className="text-xs font-bold mt-0.5" style={{ color: '#6b7194' }}>{ind.sub}</p>
        </div>
      </div>

      <div className="rounded-xl px-3.5 py-3 mb-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <p className="text-[13px] leading-snug font-mono" style={{ color: '#c3c8e0' }}>{ind.formula}</p>
      </div>

      <p className="text-base font-black mb-3" style={{ color: '#e6e9f5' }}>{ind.exemplo}</p>

      {ind.leitura && (
        <div className="flex flex-wrap gap-2 mb-3">
          {ind.leitura.map(l => (
            <span key={l} className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background: `${ind.color}26`, color: ind.color, border: `1px solid ${ind.color}40` }}>{l}</span>
          ))}
        </div>
      )}

      <p className="text-[13px] leading-relaxed mt-auto" style={{ color: '#8890b5' }}>
        <span style={{ color: `${ind.color}cc` }}>↳</span> {ind.analogia}
      </p>
    </motion.div>
  )
}

const CONEXAO = ['CAC', 'Margem', 'ARPU', 'LTV', 'LTV : CAC']

function SlideIndicadores() {
  return (
    <div className="h-full flex flex-col px-6 lg:px-10 max-w-[1680px] mx-auto w-full py-4">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
        <div>
          <Eyebrow color={GREEN}>Pensar como dono</Eyebrow>
          <div className="mt-2.5"><Title size="md">Indicadores essenciais</Title></div>
        </div>
        <div className="flex items-center gap-2 flex-wrap pb-1">
          {CONEXAO.map((c, i) => (
            <div key={c} className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#8890b5' }}>{c}</span>
              {i < CONEXAO.length - 1 && <span className="text-[11px]" style={{ color: '#3f4463' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDICADORES.map((ind, i) => (
          <CardIndicador key={ind.n} ind={ind} delay={i * 0.06} />
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
          className="rounded-2xl p-5 lg:p-6 flex flex-col justify-center"
          style={{ background: `linear-gradient(150deg, ${GREEN}26, rgba(255,255,255,0.02))`, border: `1.5px solid ${GREEN}66` }}>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] mb-3" style={{ color: GREEN }}>
            A regra que fecha tudo
          </p>
          <p className="text-2xl lg:text-3xl font-black text-white leading-tight mb-3">LTV maior que CAC.</p>
          <p className="text-sm leading-relaxed" style={{ color: '#8890b5' }}>
            Se essa desigualdade não fecha, não existe tráfego que salve.
          </p>
        </motion.div>
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

function ColunaCheck({ titulo, legenda, itens, cor, checks, toggle, prefixo }) {
  const feitos = itens.filter((_, i) => checks[`${prefixo}${i}`]).length
  return (
    <div className="rounded-2xl p-4 lg:p-5"
      style={{ background: `linear-gradient(155deg, ${cor}0f, rgba(255,255,255,0.015))`, border: `1px solid ${cor}33` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-9 rounded-full" style={{ background: cor }} />
        <div className="flex-1 min-w-0">
          <p className="text-base font-black" style={{ color: cor }}>{titulo}</p>
          <p className="text-[10px] font-bold" style={{ color: '#6b7194' }}>{legenda}</p>
        </div>
        <span className="text-lg font-black flex-shrink-0 tabular-nums"
          style={{ color: feitos === itens.length ? cor : '#4a5070' }}>{feitos}/{itens.length}</span>
      </div>

      <div className="grid gap-2">
        {itens.map((it, i) => {
          const k = `${prefixo}${i}`
          const on = !!checks[k]
          return (
            <motion.div key={it.t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => toggle(k)}
              className="rounded-xl px-3.5 py-2.5 flex items-start gap-3 cursor-pointer select-none transition-colors"
              style={{
                background: on ? `${cor}1a` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${on ? cor + '4d' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: on ? cor : 'transparent', border: `2px solid ${on ? cor : '#3f4463'}` }}>
                {on && <span className="text-[9px] font-black" style={{ color: '#0a0b14' }}>✓</span>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black leading-tight" style={{ color: on ? '#fff' : '#c3c8e0' }}>{it.t}</p>
                <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#6b7194' }}>{it.d}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function SlideChecklist() {
  const [checks, setChecks] = useState({})
  const toggle = k => setChecks(p => ({ ...p, [k]: !p[k] }))

  const mkt = CHECK_MARKETING.filter((_, i) => checks[`m${i}`]).length
  const com = CHECK_COMERCIAL.filter((_, i) => checks[`c${i}`]).length
  const total = mkt + com

  const veredito =
    total >= 12 ? { cor: GREEN, t: 'Pronto pra investir.', d: 'A base está de pé. Agora é escalar com método.' }
    : total >= 7 ? { cor: AMBER, t: 'Dá pra começar, mas com buracos.', d: 'Feche o que falta antes de aumentar a verba.' }
    : { cor: RED, t: 'O problema não vai ser o tráfego.', d: 'Anunciar agora só acelera o prejuízo.' }

  return (
    <div className="h-full flex flex-col px-6 lg:px-10 max-w-[1500px] mx-auto w-full py-4">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
        <div>
          <Eyebrow>Leve com você</Eyebrow>
          <div className="mt-2.5"><Title size="md">Está pronto pra investir?</Title></div>
        </div>
        <p className="text-xs font-bold pb-1" style={{ color: '#4a5070' }}>marque o que você já tem</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ColunaCheck titulo="Marketing" legenda="Antes de ligar o anúncio" prefixo="m"
          itens={CHECK_MARKETING} cor={BLUE} checks={checks} toggle={toggle} />
        <ColunaCheck titulo="Comercial" legenda="Depois que o lead chega" prefixo="c"
          itens={CHECK_COMERCIAL} cor={GREEN} checks={checks} toggle={toggle} />
      </div>

      <motion.div layout className="rounded-2xl px-5 py-4 flex items-center justify-between gap-5 flex-wrap"
        style={{ background: `${veredito.cor}12`, border: `1.5px solid ${veredito.cor}4d` }}>
        <div className="min-w-0">
          <p className="text-lg lg:text-xl font-black text-white leading-tight">{veredito.t}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8890b5' }}>{veredito.d}</p>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: `${BLUE}cc` }}>Marketing</p>
            <p className="text-base font-black tabular-nums" style={{ color: BLUE }}>{mkt}/7</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: `${GREEN}cc` }}>Comercial</p>
            <p className="text-base font-black tabular-nums" style={{ color: GREEN }}>{com}/7</p>
          </div>
          <p className="text-3xl lg:text-4xl font-black tabular-nums" style={{ color: veredito.cor }}>{total}/14</p>
        </div>
      </motion.div>
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

/* Em tela cheia, encolhe o slide até caber inteiro na altura disponível.
   O transform é só visual: a medição usa a altura natural, sem realimentar. */
function FitViewport({ enabled, dep, children }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!enabled) { setScale(1); return }
    const measure = () => {
      const o = outerRef.current, i = innerRef.current
      if (!o || !i) return
      const oh = o.clientHeight
      const ih = i.offsetHeight
      if (!oh || !ih) return
      setScale(Math.min(1, oh / ih))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (innerRef.current) ro.observe(innerRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [enabled, dep])

  if (!enabled) return <div className="h-full">{children}</div>

  return (
    <div ref={outerRef} className="h-full w-full overflow-hidden flex items-center justify-center">
      <div ref={innerRef} className="w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        {children}
      </div>
    </div>
  )
}

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
    id: 'perguntas', label: 'Fundamentos', Comp: SlidePerguntas, min: 7,
    notes: [
      'As cinco perguntas do grupo. Cerca de 90 segundos cada — devolva alguma pra sala antes de responder.',
      '01 Começar: não comece pelo anúncio. Oferta clara → onde o lead cai → quem responde → só então o anúncio.',
      '02 Quanto investir: não tem número mágico, tem conta — ticket × taxa de fechamento × custo por lead do nicho.',
      '03 O que funciona: criativo em volume + oferta clara + números lidos corretamente. Nessa ordem.',
      '04 Estático: sim, e muito bem em fundo de funil. O erro não é o formato — é ter pouco criativo.',
      '05 Tempo de conta: ajuda, mas não porque a conta envelhece. Só se você usou o tempo pra aprender.',
      'As respostas 02 e 03 plantam a conta do mês e o bloco do criativo. Não se alongue aqui.',
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
      'Deixe claro que a tese vale para redes sociais (Meta). No Google a intenção já existe e o jogo é palavra-chave.',
      'Conecte: é por isso que quem já roda está testando novos formatos. Não é frescura de edição — é a alavanca que sobrou.',
    ],
  },
  {
    id: 'formatos', label: 'Formatos', Comp: SlideFormatos, min: 10,
    notes: [
      'Abra na galeria com os 8 visíveis. Clique num formato pra abrir o detalhe e volte com "Todos os formatos".',
      'Com os 8 na tela, pergunte: "quantos desses vocês têm rodando hoje?". A maioria terá um.',
      'Aí vem o soco: "não é o mercado que saturou, é o seu criativo".',
      'Novelinha e Tela Dividida saíram da conversa do grupo — vale nomear quem citou.',
    ],
  },
  {
    id: 'quadro', label: 'Objetivo × Formato', Comp: SlideObjetivoFormato, min: 4,
    notes: ['Este é o slide que eles vão querer fotografar. Dê tempo.'],
  },
  {
    id: 'regras', label: 'Retenção', Comp: SlideRegras, min: 5,
    notes: [
      'O bloco "Reter é filtrar" é o mais importante daqui. Não passe reto.',
      'A ideia: escolher o formato não é só estética — é decidir quem para pra assistir e quem passa direto.',
      'E é o criativo que ensina o Meta quem é o seu cliente. Com a segmentação manual sumindo, ele virou a segmentação.',
      '"Reels não vendem. Reels atraem. Stories convertem." — frase curta e contraintuitiva. Todo mundo anota.',
    ],
  },
  {
    id: 'indicadores', label: 'Indicadores', Comp: SlideIndicadores, min: 7,
    notes: [
      'Aqui você para de falar de tráfego e passa a falar como sócio deles.',
      'Não leia os cinco. Use as analogias — é o que gruda. Aprofunde só onde a sala reagir.',
      'Metade da sala não tem recorrência. Diga em voz alta: sem recompra, LTV é a margem de uma venda.',
      'LTV ÷ CAC é a razão LTV:CAC, não o ROI. O ROI desconta o investimento antes de dividir — ele aparece no slide seguinte.',
      'LTV:CAC muito alto (12x) costuma ser sinal de subinvestimento, não de vitória. A referência saudável é ~3x.',
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
    id: 'checklist', label: 'Checklist', Comp: SlideChecklist, min: 4,
    notes: [
      'Handout de 1 página. Entregue impresso.',
      'Marque ao vivo conforme a sala responde. O veredito muda de cor sozinho.',
      'O ponto do slide: metade do que faz o tráfego funcionar não é tráfego. É comercial.',
      'Frase de entrega: "se você marcou menos de 7, o problema não vai ser o tráfego".',
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
    <div className={full ? 'fixed inset-0 z-[130]' : 'p-3 lg:p-6'}>
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
            <motion.div key={slide.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }} className="h-full">
              <FitViewport enabled={full} dep={slide.id + (notes ? '-n' : '')}>
                <Cur />
              </FitViewport>
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
