import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Users2, Layers, Megaphone, Crown,
  Target, Heart, DollarSign, Repeat,
  ChevronLeft, ChevronRight, Rocket, Lock, PlayCircle,
  Maximize2, Minimize2,
} from 'lucide-react'

// ─── Paleta hub ───────────────────────────────────────────────
const G    = '#6eda2c'
const DARK = '#12141e'
const D2   = '#1a1d2e'

// ─── Dados estáticos da equipe ────────────────────────────────
const SQUAD = [
  { nome: 'Juliano',   funcao: 'Tráfego (Meta + Google)',                              fase: 'Aquisição' },
  { nome: 'Ana',       funcao: 'Auxiliar de tráfego + vídeos',                         fase: 'Aquisição / Envolvimento' },
  { nome: 'Deivisson', funcao: 'Landing pages',                                        fase: 'Aquisição' },
  { nome: 'Érica',     funcao: 'Artes',                                                fase: 'Envolvimento' },
  { nome: 'Bea',       funcao: 'Vídeos + comunicação nos grupos + tarefas do projeto', fase: 'Envolvimento' },
  { nome: 'Elieser',   funcao: 'Dados e relatórios',                                   fase: 'Retenção/Expansão' },
]

const METODO = [
  { icon: Target,     cor: '#2563eb', nome: 'Aquisição',         desc: 'Desconhecido vira lead — como me encontram.' },
  { icon: Heart,      cor: '#db2777', nome: 'Envolvimento',      desc: 'O lead conhece, confia e lembra da marca.' },
  { icon: DollarSign, cor: '#3f9c14', nome: 'Monetização',       desc: 'Lead vira cliente pagante.' },
  { icon: Repeat,     cor: '#9333ea', nome: 'Retenção/Expansão', desc: 'Cliente fica, volta e compra mais.' },
]

const MOTIVOS = [
  ['Sem handoff', 'O trabalho não atravessa fronteiras — não trava esperando outro setor.'],
  ['Contexto compartilhado', 'Todo mundo conhece o mesmo cliente. A decisão sai rápido.'],
  ['Tamanho certo', 'Grande o bastante pra ser autossuficiente, pequeno pra caber numa conversa.'],
  ['Dono do resultado', 'O squad responde pelo resultado do cliente, não por "quantas artes saíram".'],
]

// ─── Projeto Órbita — Semana 2 (8 slides no estilo hub) ───────
const SEMANA2_SLIDES = [
  {
    num: 1, tipo: 'capa',
    titulo: 'Marketing de Performance',
    subtitulo: 'Projeto Órbita · Semana 2',
    presenter: 'Dê boas-vindas. Hoje vamos entender como cada área da TráfegOn contribui para o cliente vender mais — na prática, não na teoria.',
  },
  {
    num: 2, tipo: 'jornada',
    titulo: 'A Jornada do Projeto Órbita',
    semanas: [
      { num: 1, tema: 'Portfólio & Geração de Valor', status: 'concluida' },
      { num: 2, tema: 'Marketing de Performance',     status: 'ativa' },
      { num: 3, tema: 'Operação de Alta Performance', status: 'futura' },
      { num: 4, tema: 'Mentalidade Orientada a Dados',status: 'futura' },
    ],
    presenter: 'Mostre onde estamos na trilha. Semana 1 concluída — hoje avançamos mais um nível.',
  },
  {
    num: 3, tipo: 'missao',
    titulo: 'Nossa missão',
    destaque: 'Geramos negócios para o negócio do cliente.',
    pilares: [
      { icon: '📡', label: 'Atrair',    desc: 'Leads qualificados chegando todo mês' },
      { icon: '🔄', label: 'Converter', desc: 'Contato se torna cliente pagante' },
      { icon: '📈', label: 'Crescer',   desc: 'Cliente cresce — e renova com a gente' },
    ],
    presenter: 'Esta frase resume tudo. Cada peça do nosso trabalho existe para mover o cliente nessa direção.',
  },
  {
    num: 4, tipo: 'ecossistema_real',
    titulo: 'O caminho que o cliente percorre',
    subtitulo: 'É aqui onde cada área da TráfegOn entra em cena',
    etapas: [
      { n: '01', icon: '🔎', nome: 'Google & Instagram',  desc: 'O cliente pesquisa quem resolve o problema dele',            area: 'Tráfego' },
      { n: '02', icon: '👀', nome: 'Perfil & Marca',      desc: 'Em 5 segundos ele decide se confia ou vai pro próximo',     area: 'Design & Conteúdo' },
      { n: '03', icon: '📄', nome: 'Landing Page',        desc: 'Ele clica. Missão: fazer ele entrar em contato',            area: 'Web Design' },
      { n: '04', icon: '💬', nome: 'WhatsApp',            desc: 'Primeira conversa. Aqui a consulta é marcada (ou não)',     area: 'Atendimento' },
      { n: '05', icon: '🗓️', nome: 'Consulta',            desc: 'Diagnóstico → proposta → fechamento',                       area: 'Inside Sales' },
      { n: '06', icon: '🏆', nome: 'Cliente',             desc: 'Objetivo alcançado. MRR cresce. Cliente bem atendido fica.', area: 'Toda equipe' },
    ],
    presenter: 'Este é o ecossistema real da TráfegOn. Cada etapa tem um dono. Se uma falha, o resultado cai — mesmo que as outras estejam funcionando.',
  },
  {
    num: 5, tipo: 'areas',
    titulo: 'Cada área no ecossistema',
    areas: [
      { icon: '📡', area: 'Media Buyer',  etapa: '01 — Atração',       impacto: 'Traz o lead certo ao menor custo possível' },
      { icon: '🎨', area: 'Designer',     etapa: '02 — Credibilidade',  impacto: 'Para o scroll e comunica autoridade' },
      { icon: '🎬', area: 'Editor',       etapa: '02 — Credibilidade',  impacto: 'Vídeo que convence antes da conversa' },
      { icon: '✍️', area: 'Conteúdo',     etapa: '02 — Credibilidade',  impacto: 'Educa e constrói autoridade ao longo do tempo' },
      { icon: '🖥️', area: 'Web Designer', etapa: '03 — Conversão',      impacto: 'Transforma visitante em lead com CTA claro' },
      { icon: '📞', area: 'Atendimento',  etapa: '04+05 — Fechamento',  impacto: 'Converte lead em cliente pagante' },
    ],
    presenter: 'Ninguém é "só apoio". Cada função existe porque aquela etapa do caminho precisa funcionar.',
  },
  {
    num: 6, tipo: 'exemplo',
    titulo: 'Na prática — escritório de advocacia',
    cliente: 'Jornada de um lead real',
    jornada: [
      { etapa: '1. Anúncio no Google',   quem: 'Media Buyer + Designer', acao: 'Lead busca "advogado família" — nossa campanha aparece com criativo de autoridade' },
      { etapa: '2. Clique na LP',        quem: 'Web Designer',           acao: 'Página rápida, formulário simples, prova social. Lead converte.' },
      { etapa: '3. WhatsApp em minutos', quem: 'Atendimento',            acao: 'Lead registrado no CRM e contatado antes que procure outro' },
      { etapa: '4. Diagnóstico',         quem: 'Cliente / consultoria',  acao: 'Entende o problema, apresenta proposta no valor certo' },
      { etapa: '5. Fechamento',          quem: 'Toda equipe',            acao: 'Cliente assina. MRR da agência cresce porque o negócio do cliente cresceu.' },
    ],
    presenter: 'Substitua pelo cliente mais recente da carteira se possível. Torna o exemplo concreto.',
  },
  {
    num: 7, tipo: 'integrado',
    titulo: 'O resultado é sempre coletivo',
    destaque: 'Nenhuma área fecha sozinha. O gol é sempre do time.',
    linhas: [
      { antes: 'Campanha boa + LP ruim',       depois: 'Lead some antes de converter' },
      { antes: 'LP boa + atendimento lento',   depois: 'Lead esfria e some pro concorrente' },
      { antes: 'Criativo ruim + campanha boa', depois: 'Alto CPL, grana jogada fora' },
      { antes: 'Tudo funcionando',             depois: 'Cliente vende, fica, e indica' },
    ],
    presenter: 'Use isso para mostrar interdependência. Cada um precisa entender que o trabalho do lado importa tanto quanto o próprio.',
  },
  {
    num: 8, tipo: 'encerramento',
    titulo: 'Semana 3: Operação de Alta Performance',
    subtitulo: 'Semana 2 concluída ✓',
    destaque: 'Nosso trabalho só termina quando o cliente vende mais.',
    presenter: 'Abra para perguntas. Na Semana 3 vamos aprofundar como operamos dia a dia para garantir resultados consistentes.',
  },
]

const ORBITA_SEMANAS = [
  { id: 1, titulo: 'Portfólio & Geração de Valor',  status: 'concluida', data: 'Set/2026',       cor: G,         slides: [] },
  { id: 2, titulo: 'Marketing de Performance',       status: 'ativa',     data: 'Set/2026',       cor: G,         slides: SEMANA2_SLIDES },
  { id: 3, titulo: 'Operação de Alta Performance',   status: 'em_breve',  data: 'Próxima semana', cor: '#3b82f6', slides: [] },
  { id: 4, titulo: 'Mentalidade Orientada a Dados',  status: 'em_breve',  data: 'Em 2 semanas',   cor: '#be29ec', slides: [] },
]

// ─── Animação de slide (igual ao hub) ─────────────────────────
const slideVariants = {
  enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.96 }),
}

// ─── SlideView ────────────────────────────────────────────────
function SlideView({ slide, fullscreen }) {
  const h = fullscreen ? 'h-full' : ''
  if (slide.tipo === 'capa') return (
    <div className={`w-full ${h} flex flex-col items-center justify-center text-center relative overflow-hidden py-16 px-6`}
      style={{ background: `linear-gradient(135deg, #0e1a07 0%, ${DARK} 60%)` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${G}22 0%, transparent 70%)` }} />
      <motion.div className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: G + '22', border: `1.5px solid ${G}40` }}>🚀</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: G + 'cc' }}>{slide.subtitulo}</p>
        <h1 className="text-2xl font-black text-white">{slide.titulo}</h1>
        <div className="px-4 py-2 rounded-xl text-[11px] font-bold"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          TráfegOn · Treinamento Interno
        </div>
      </motion.div>
    </div>
  )

  if (slide.tipo === 'jornada') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Projeto Órbita</p>
      <h2 className="text-xl font-black text-white mb-5">{slide.titulo}</h2>
      <div className="space-y-2.5">
        {slide.semanas.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: s.status === 'ativa' ? G + '14' : 'rgba(255,255,255,0.04)',
              border: s.status === 'ativa' ? `1.5px solid ${G}40` : '1.5px solid rgba(255,255,255,0.06)',
            }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: s.status === 'futura' ? 'rgba(255,255,255,0.06)' : G, color: s.status === 'futura' ? 'rgba(255,255,255,0.2)' : DARK }}>
              {s.status === 'concluida' ? '✓' : s.num}
            </div>
            <p className="text-sm font-bold flex-1"
              style={{ color: s.status === 'futura' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)' }}>
              Semana {s.num} — {s.tema}
            </p>
            {s.status === 'ativa' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: G, color: DARK }}>Hoje</span>}
            {s.status === 'concluida' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: G + '20', color: G }}>Concluída</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'missao') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Nossa missão</p>
      <h2 className="text-xl font-black text-white mb-4">{slide.titulo}</h2>
      <motion.div className="p-4 rounded-xl text-sm font-bold leading-snug mb-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: `linear-gradient(135deg, ${DARK}, #0a0e06)`, border: `1.5px solid ${G}30`, color: '#fff' }}>
        "{slide.destaque}"
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {slide.pilares.map((p, i) => (
          <motion.div key={p.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="flex flex-col items-center text-center gap-2 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xl">{p.icon}</span>
            <p className="text-xs font-black" style={{ color: G }}>{p.label}</p>
            <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'ecossistema_real') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Ecossistema TráfegOn</p>
      <h2 className="text-xl font-black text-white">{slide.titulo}</h2>
      <p className="text-[11px] mt-1 mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{slide.subtitulo}</p>
      <div className="space-y-2">
        {slide.etapas.map((e, i) => (
          <motion.div key={e.n} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-lg flex-shrink-0">{e.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white">{e.nome}</p>
              <p className="text-[10px] leading-snug mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{e.desc}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
              style={{ background: G + '14', color: G }}>{e.area}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'areas') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Quem faz o quê</p>
      <h2 className="text-xl font-black text-white mb-5">{slide.titulo}</h2>
      <div className="space-y-2">
        {slide.areas.map((a, i) => (
          <motion.div key={a.area} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-base flex-shrink-0">{a.icon}</span>
            <div style={{ minWidth: 88 }}>
              <p className="text-xs font-black text-white">{a.area}</p>
              <p className="text-[10px] mt-0.5" style={{ color: G }}>{a.etapa}</p>
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{a.impacto}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'exemplo') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Exemplo prático</p>
      <h2 className="text-xl font-black text-white">{slide.titulo}</h2>
      <p className="text-[11px] font-bold mt-1 mb-4 inline-block px-2 py-1 rounded-lg"
        style={{ background: G + '14', color: G }}>{slide.cliente}</p>
      <div className="space-y-2">
        {slide.jornada.map((j, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-[11px] font-black text-white">{j.etapa}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: G + '14', color: G }}>{j.quem}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{j.acao}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'integrado') return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: G }}>Interdependência</p>
      <h2 className="text-xl font-black text-white">{slide.titulo}</h2>
      <p className="text-sm font-bold mt-2 mb-5" style={{ color: G }}>"{slide.destaque}"</p>
      <div className="space-y-2">
        {slide.linhas.map((l, i) => {
          const isLast = i === slide.linhas.length - 1
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="grid items-center gap-3 rounded-xl px-4 py-2.5"
              style={{
                gridTemplateColumns: '1fr auto 1fr',
                background: isLast ? G + '12' : 'rgba(255,255,255,0.04)',
                border: isLast ? `1.5px solid ${G}30` : '1px solid rgba(255,255,255,0.06)',
              }}>
              <span className="text-[11px]" style={{ color: isLast ? G : 'rgba(255,255,255,0.45)' }}>{l.antes}</span>
              <span className="text-xs font-black" style={{ color: isLast ? G : 'rgba(255,80,80,0.55)' }}>→</span>
              <span className="text-[11px] font-bold" style={{ color: isLast ? '#fff' : 'rgba(255,80,80,0.7)' }}>{l.depois}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  if (slide.tipo === 'encerramento') return (
    <div className={`w-full ${h} flex flex-col items-center justify-center text-center relative overflow-hidden py-16 px-6`}
      style={{ background: `linear-gradient(135deg, #0e1a07 0%, ${DARK} 60%)` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${G}1a 0%, transparent 70%)` }} />
      <motion.div className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: G + '22', border: `1.5px solid ${G}40` }}>🏁</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: G + 'cc' }}>{slide.subtitulo}</p>
        <h2 className="text-xl font-black text-white">{slide.titulo}</h2>
        <p className="text-sm font-bold px-5 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 340 }}>
          "{slide.destaque}"
        </p>
      </motion.div>
    </div>
  )

  return null
}

// ─── Projeto Órbita ───────────────────────────────────────────
function ProjetoOrbita() {
  const [semanaId, setSemanaId] = useState(null)
  const [slideIdx, setSlideIdx] = useState(0)
  const [dir,      setDir]      = useState(1)
  const [fs,       setFs]       = useState(false)

  const semana = ORBITA_SEMANAS.find(s => s.id === semanaId)
  const slides = semana?.slides ?? []
  const slide  = slides[slideIdx]

  function goSlide(delta) {
    const n = slideIdx + delta
    if (n < 0 || n >= slides.length) return
    setDir(delta)
    setSlideIdx(n)
  }

  function abrirSemana(s) {
    if (s.status === 'em_breve') return
    setSemanaId(s.id)
    setSlideIdx(0)
    setDir(1)
    setFs(false)
  }

  // Teclado: setas + Esc + F
  useEffect(() => {
    if (!semanaId) return
    const fn = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goSlide(1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goSlide(-1)
      if (e.key === 'Escape') setFs(false)
      if (e.key === 'f' || e.key === 'F') setFs(v => !v)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [semanaId, slideIdx])

  // Visualizador
  if (semanaId && semana) {
    const toolbar = (
      <div className="flex items-center justify-between flex-shrink-0 mb-3">
        <button onClick={() => { setSemanaId(null); setFs(false) }}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
          <ChevronLeft size={13} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{slideIdx + 1} / {slides.length}</span>
          <button onClick={() => setFs(v => !v)}
            className="p-2 rounded-xl transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
            {fs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    )

    const progressBar = (
      <div className="h-1 rounded-full mb-3 overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${((slideIdx + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: G, boxShadow: `0 0 10px ${G}80` }} />
      </div>
    )

    const nav = (
      <div className="flex items-center justify-between gap-3 flex-shrink-0 mt-3">
        <button onClick={() => goSlide(-1)} disabled={slideIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-25"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>
          <ChevronLeft size={14} /> Anterior
        </button>
        <div className="flex gap-1.5 flex-wrap justify-center flex-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > slideIdx ? 1 : -1); setSlideIdx(i) }}
              className="rounded-full transition-all"
              style={{ width: i === slideIdx ? 20 : 6, height: 6, background: i === slideIdx ? G : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <button onClick={() => goSlide(1)} disabled={slideIdx === slides.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-25"
          style={{ background: G, color: DARK }}>
          Próximo <ChevronRight size={14} />
        </button>
      </div>
    )

    // Tela cheia
    if (fs) return (
      <div className="fixed inset-0 z-[300] flex flex-col p-4" style={{ background: '#0a0b12' }}>
        {toolbar}
        {progressBar}
        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={slideIdx} custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0">
              {slide && <SlideView slide={slide} fullscreen />}
            </motion.div>
          </AnimatePresence>
        </div>
        {nav}
      </div>
    )

    // Normal
    return (
      <div>
        {toolbar}
        {progressBar}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
          <div className="relative">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={slideIdx} custom={dir} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                {slide && <SlideView slide={slide} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {nav}
      </div>
    )
  }

  // Seletor de semanas
  return (
    <div>
      <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, #0e1a07 100%)` }}>
        <div className="absolute top-[-40px] right-[-30px] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${G}18 0%, transparent 65%)` }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={15} style={{ color: G }} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: G + 'aa' }}>Projeto Órbita</p>
          </div>
          <p className="text-lg font-extrabold text-white mb-1">Jornada de 4 Semanas</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Alinhamento de toda a equipe sobre como geramos resultados para os clientes.
          </p>
        </div>
      </div>
      <div className="space-y-2.5">
        {ORBITA_SEMANAS.map(s => (
          <button key={s.id} onClick={() => abrirSemana(s)} disabled={s.status === 'em_breve'}
            className="w-full text-left p-4 rounded-2xl transition-all"
            style={{
              background: s.status !== 'em_breve' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              border: s.status === 'ativa' ? `1.5px solid ${G}30` : '1.5px solid rgba(255,255,255,0.06)',
              opacity: s.status === 'em_breve' ? 0.5 : 1,
              cursor: s.status === 'em_breve' ? 'default' : 'pointer',
            }}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: s.status === 'em_breve' ? 'rgba(255,255,255,0.05)' : s.cor + '22', color: s.status === 'em_breve' ? 'rgba(255,255,255,0.2)' : s.cor }}>
                {s.status === 'concluida' ? '✓' : s.status === 'em_breve' ? <Lock size={14} /> : s.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Semana {s.id}</p>
                  {s.status === 'ativa'     && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: G, color: DARK }}>Hoje</span>}
                  {s.status === 'concluida' && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: G + '20', color: G }}>Concluída</span>}
                </div>
                <p className="text-sm font-extrabold"
                  style={{ color: s.status === 'em_breve' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)' }}>
                  {s.titulo}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{s.data}</p>
              </div>
              {s.status !== 'em_breve'
                ? <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                : <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>Em breve</span>}
            </div>
            {s.status === 'ativa' && s.slides?.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <PlayCircle size={12} style={{ color: G }} />
                <span>{s.slides.length} slides disponíveis</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Componentes da aba Conhecimentos Gerais ──────────────────
function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl border border-border p-5 shadow-sm ${className}`}>{children}</div>
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent/10">
        <Icon size={16} className="text-accent" />
      </div>
      <h2 className="text-lg font-bold text-text">{children}</h2>
    </div>
  )
}

function Tag({ icon: Icon, cor, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-lg"
      style={{ background: `${cor}14`, color: cor }}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  )
}

// ─── Página ───────────────────────────────────────────────────
export default function Treinamentos() {
  const [tab, setTab] = useState('gerais')

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10">
          <GraduationCap size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-text">Treinamentos</h1>
          <p className="text-sm text-muted">Como nos organizamos e a lógica por trás do que entregamos.</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'gerais',   label: 'Conhecimentos Gerais', icon: <GraduationCap size={13} /> },
          { id: 'solucoes', label: 'Soluções',             icon: <Rocket size={13} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === t.id
              ? { background: G, color: DARK }
              : { background: '#fff', color: '#8890b5', border: '1px solid #e0e3f0' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Soluções */}
      {tab === 'solucoes' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5" style={{ background: D2 }}>
          <ProjetoOrbita />
        </motion.div>
      )}

      {/* Conhecimentos Gerais */}
      {tab === 'gerais' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <section>
            <SectionTitle icon={Users2}>O que é um squad</SectionTitle>
            <Card>
              <p className="text-text-2 leading-relaxed mb-4">
                <strong className="text-text">Squad</strong> é um time pequeno e multifuncional que entrega
                o cliente do começo ao fim — juntos, sem passar a bola de setor em setor.
                A maioria das agências trabalha em <strong className="text-text">silos</strong> (um time de
                tráfego, um de social, um de criação) e o cliente fica sendo jogado de um pro outro, sem dono.
                A gente junta todas as funções numa <strong className="text-text">célula só</strong>, e ela
                responde pela carteira inteira.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {MOTIVOS.map(([t, d]) => (
                  <div key={t} className="rounded-xl p-3.5 bg-surface-2 border border-border">
                    <p className="text-sm font-bold text-text mb-0.5">{t}</p>
                    <p className="text-xs text-muted leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <SectionTitle icon={Layers}>Nossas funções</SectionTitle>
            <Card className="mb-4">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Tag cor="#2563eb">SQUAD OPERACIONAL</Tag>
                <span className="text-xs text-muted">quem entrega o cliente ponta a ponta</span>
              </div>
              <div className="space-y-1.5">
                {SQUAD.map(p => (
                  <div key={p.nome} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-surface-2 border border-border">
                    <span className="text-sm font-bold text-text w-24 flex-shrink-0">{p.nome}</span>
                    <span className="text-sm text-text-2 flex-1">{p.funcao}</span>
                    <span className="text-[10px] font-bold text-muted hidden sm:block">{p.fase}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <div className="mb-3"><Tag icon={Megaphone} cor="#ea8a29">COMUNICAÇÃO ESPECIALIZADA</Tag></div>
                <p className="text-sm font-bold text-text">Mari — comunicação com o público jurídico</p>
                <p className="text-xs text-muted leading-relaxed mt-1.5">
                  Fica <strong className="text-text-2">fora</strong> do squad de propósito: construir audiência
                  jurídica é um trabalho editorial de ritmo próprio, que seria atropelado pela urgência do
                  operacional se ficasse dentro.
                </p>
              </Card>
              <Card>
                <div className="mb-3"><Tag icon={Crown} cor="#be29ec">LIDERANÇA</Tag></div>
                <p className="text-sm font-bold text-text">Gabriel <span className="font-medium text-text-2">— reuniões, estratégia, condução do squad</span></p>
                <p className="text-sm font-bold text-text mt-2">Carol <span className="font-medium text-text-2">— administração / sociedade</span></p>
              </Card>
            </div>
          </section>

          <section>
            <SectionTitle icon={Target}>O método — a lógica de tudo</SectionTitle>
            <Card>
              <p className="text-text-2 leading-relaxed mb-4">
                Todo cliente passa por 4 fases. Cada função do time serve uma delas.
                <strong className="text-text"> Não se pula fase:</strong> tráfego sem envolvimento = lead frio;
                venda sem retenção = balde furado.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {METODO.map((f, i) => (
                  <div key={f.nome} className="rounded-xl p-4 bg-surface-2 border border-border"
                    style={{ borderTop: `3px solid ${f.cor}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${f.cor}15` }}>
                        <f.icon size={16} style={{ color: f.cor }} />
                      </div>
                      <span className="text-xs font-extrabold text-muted">{i + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-text">{f.nome}</p>
                    <p className="text-xs text-muted leading-relaxed mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </motion.div>
      )}
    </div>
  )
}
