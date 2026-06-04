import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap, TrendingUp, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

const GREEN  = '#6eda2c'
const DARK   = '#1a1d2e'
const DARKER = '#13151f'

// ─── SLIDE DATA ──────────────────────────────────────────────────────────────

const SHARED_SLIDES = [
  {
    type: 'list',
    title: 'O que preparamos para você',
    items: [
      'Campanha de tráfego pago ativa e configurada',
      'Público-alvo definido estrategicamente',
      'Criativos e anúncios aprovados',
      'Pixel e rastreamento instalados',
      'Suporte via WhatsApp incluído no plano',
    ],
  },
  {
    type: 'steps',
    title: 'Como vai funcionar hoje',
    items: [
      'Você vai ver tudo que foi feito para seu negócio',
      'Você vai entrar no gerenciador e navegar comigo',
      'Você vai aprender o que precisa checar todo dia',
    ],
  },
  {
    type: 'cycle',
    title: 'Por que seu anúncio funciona assim',
    subtitle: 'Seu cliente não compra na primeira vez que vê. Ele pesquisa, compara e decide — esse é o caminho normal.',
    cycle: ['Anúncio', 'Clique', 'Lead', 'Atendimento', 'Venda'],
    highlight: 'Nosso trabalho: gerar o lead.  Seu trabalho: atender rápido.',
  },
  {
    type: 'metrics',
    title: 'As 3 métricas que você precisa conhecer',
    metrics: [
      { label: 'Investimento', desc: 'Quanto foi gasto no período' },
      { label: 'Leads', desc: 'Pessoas que entraram em contato com você' },
      { label: 'CPL', desc: 'Custo por Lead = Investimento ÷ Leads' },
    ],
    note: 'Nos primeiros 30 dias o algoritmo aprende. Os resultados crescem com o tempo.',
  },
]

const ATIVACAO_SLIDES = [
  {
    type: 'cover',
    title: 'Destrava Digital',
    subtitle: 'Sua consultoria de onboarding no digital',
    badge: 'Meta Ads ou Google Ads · 1h30',
  },
  ...SHARED_SLIDES,
  {
    type: 'diagram',
    title: 'O que fizemos para você',
    diagram: ['Campanha', 'Conjunto de Anúncios', 'Anúncio'],
    items: [
      'Público definido com base no seu negócio e região',
      'Criativos com copy e visual estratégicos',
      'Rastreamento configurado para cada lead',
    ],
  },
  {
    type: 'practice',
    title: 'Agora vamos navegar juntos',
    action: 'Abra o Gerenciador agora',
    steps: [
      'Localize sua campanha ativa',
      'Encontre o conjunto de anúncios',
      'Veja seu anúncio e as métricas',
      'Confira onde chegam seus leads',
    ],
    note: 'Formulário de contato ou WhatsApp',
  },
  {
    type: 'rules',
    title: 'O que checar todo dia',
    dos: ['Campanha está ativa?', 'Quantos leads chegaram hoje?', 'Quanto foi gasto até agora?'],
    donts: ['Não mexa em público, orçamento ou criativos sem falar com a gente'],
    alert: 'Nos acione se: campanha pausou, leads zeraram ou verba acabou antes do prazo',
  },
  {
    type: 'grid',
    title: 'Suas demais entregas',
    cards: [
      { icon: '🌐', label: 'Landing Page', desc: 'Acesse e teste o formulário agora' },
      { icon: '📍', label: 'Google Meu Negócio', desc: 'Perfil otimizado e visível' },
      { icon: '📸', label: 'Instagram', desc: 'Perfil organizado e pronto' },
      { icon: '👤', label: 'Facebook', desc: 'Perfil organizado e pronto' },
    ],
  },
  {
    type: 'timeline',
    title: 'O que acontece agora',
    events: [
      { time: 'Hoje', desc: 'Você recebe o Guia de Gestão' },
      { time: '7 dias', desc: 'Primeiros leads chegando' },
      { time: '15 dias', desc: 'Fim do suporte WhatsApp' },
      { time: '30 dias', desc: 'Reunião de análise e otimização' },
    ],
    note: 'Dúvida? Chame a gente antes de mexer em qualquer coisa.',
  },
]

const ESTRUTURACAO_SLIDES = [
  {
    type: 'cover',
    title: 'Destrava Digital',
    subtitle: 'Sua consultoria de onboarding no digital',
    badge: 'Meta Ads + Google Ads · 2h30',
  },
  ...SHARED_SLIDES,
  {
    type: 'platform',
    platform: 'Meta Ads',
    platformColor: '#4f6ef7',
    platformIcon: '🟦',
    title: 'O que fizemos no Meta',
    diagram: ['Campanha', 'Conjunto de Anúncios', 'Anúncio'],
    items: [
      'Público definido com base no seu negócio e região',
      'Criativos aprovados — decisão por trás de cada um',
      'Pixel e rastreamento configurados',
    ],
  },
  {
    type: 'practice',
    platform: 'Meta Ads',
    platformColor: '#4f6ef7',
    title: 'Agora vamos navegar no Meta',
    action: 'Abra o Gerenciador do Meta agora',
    steps: [
      'Localize a campanha ativa',
      'Encontre o conjunto de anúncios',
      'Veja o anúncio e as métricas',
      'Onde chegam seus leads (formulário ou WhatsApp)',
    ],
  },
  {
    type: 'rules',
    platform: 'Meta Ads',
    platformColor: '#4f6ef7',
    title: 'Meta Ads — o que checar todo dia',
    dos: ['Campanha está ativa?', 'Quantos leads chegaram hoje?', 'Quanto foi gasto até agora?'],
    donts: ['Não mexa em público, orçamento ou criativos sem falar com a gente'],
    alert: 'Nos acione se: campanha pausou, leads zeraram ou verba acabou antes do prazo',
  },
  {
    type: 'platform',
    platform: 'Google Ads',
    platformColor: '#ea8a29',
    platformIcon: '🟠',
    title: 'O que fizemos no Google',
    concept: 'Pessoa pesquisa → seu anúncio aparece',
    items: [
      'Palavras-chave escolhidas estrategicamente',
      'Extensões de anúncio configuradas',
      'Seu anúncio aparece na busca pelo seu serviço',
    ],
  },
  {
    type: 'practice',
    platform: 'Google Ads',
    platformColor: '#ea8a29',
    title: 'Agora vamos navegar no Google',
    action: 'Abra o Google Ads agora',
    steps: [
      'Localize a campanha ativa',
      'Veja os grupos de anúncios',
      'Confira: impressões, cliques e conversões',
      'Veja os Termos de Pesquisa — o que as pessoas digitaram',
    ],
  },
  {
    type: 'rules',
    platform: 'Google Ads',
    platformColor: '#ea8a29',
    title: 'Google Ads — o que checar todo dia',
    dos: ['Campanha está ativa?', 'Cliques e conversões do dia?', 'Custo por conversão dentro do esperado?'],
    donts: ['Não mexa em palavras-chave ou lances sem falar com a gente'],
    alert: 'Nos acione se: custo disparou ou zero conversão por 3 dias seguidos',
  },
  {
    type: 'grid',
    title: 'Suas demais entregas',
    cards: [
      { icon: '🌐', label: 'Landing Page', desc: 'Acesse e teste o formulário agora' },
      { icon: '📍', label: 'Google Meu Negócio', desc: 'Perfil otimizado e visível' },
      { icon: '📸', label: 'Instagram', desc: 'Perfil organizado e pronto' },
      { icon: '👤', label: 'Facebook', desc: 'Perfil organizado e pronto' },
    ],
  },
  {
    type: 'timeline',
    title: 'O que acontece agora',
    events: [
      { time: 'Hoje', desc: 'Você recebe o Guia de Gestão (Meta + Google)' },
      { time: '7 dias', desc: 'Primeiros leads chegando' },
      { time: '30 dias', desc: 'Fim do suporte WhatsApp' },
      { time: '30 dias', desc: 'Reunião de análise e otimização' },
    ],
    note: 'Dúvida? Chame a gente antes de mexer em qualquer coisa.',
  },
]

const FORMATS = [
  {
    id: 'ativacao',
    title: 'Ativação',
    subtitle: '1 plataforma · Meta Ads OU Google Ads',
    duration: '1h30',
    color: '#ea8a29',
    icon: Zap,
    slides: ATIVACAO_SLIDES,
  },
  {
    id: 'estruturacao',
    title: 'Estruturação / Aceleração',
    subtitle: '2 plataformas · Meta Ads + Google Ads',
    duration: '2h30',
    color: GREEN,
    icon: TrendingUp,
    slides: ESTRUTURACAO_SLIDES,
  },
]

// ─── SLIDE COMPONENTS ─────────────────────────────────────────────────────────

function CoverSlide({ slide, format }) {
  const Icon = format.icon
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}>
        <Icon size={28} style={{ color: GREEN }} />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
        {slide.title}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-xl text-white/60 mb-8 max-w-lg">
        {slide.subtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="px-5 py-2.5 rounded-full text-sm font-bold"
        style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, color: GREEN }}>
        {slide.badge}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="absolute bottom-16 flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
      </motion.div>
    </div>
  )
}

function ListSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="space-y-4 mt-8">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CheckCircle2 size={20} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
            <span className="text-white/85 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StepsSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="space-y-5 mt-8">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }}
            className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-extrabold"
              style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}50`, color: GREEN }}>
              {i + 1}
            </div>
            <span className="text-white/85 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
      {slide.duration && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full self-start"
          style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}35`, color: GREEN }}>
          <span className="text-sm font-bold">Duração total: {slide.duration}</span>
        </motion.div>
      )}
    </div>
  )
}

function CycleSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/55 text-lg mt-3 mb-10 max-w-xl">
        {slide.subtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex items-center gap-2 flex-wrap">
        {slide.cycle.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
              {step}
            </div>
            {i < slide.cycle.length - 1 && (
              <ArrowRight size={16} className="text-white/30 flex-shrink-0" />
            )}
          </div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-8 p-5 rounded-2xl"
        style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
        <p className="text-white font-semibold text-lg leading-relaxed whitespace-pre-line">
          {slide.highlight}
        </p>
      </motion.div>
    </div>
  )
}

function MetricsSlide({ slide }) {
  const colors = [GREEN, '#60a5fa', '#be29ec']
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {slide.metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12 }}
            className="p-6 rounded-2xl flex flex-col"
            style={{ background: `${colors[i]}10`, border: `1px solid ${colors[i]}30` }}>
            <p className="text-2xl font-extrabold mb-2" style={{ color: colors[i] }}>{m.label}</p>
            <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="mt-6 text-white/45 text-sm text-center">
        {slide.note}
      </motion.p>
    </div>
  )
}

function DiagramSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mt-8 mb-8">
        {slide.diagram.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}>
              {d}
            </div>
            {i < slide.diagram.length - 1 && <ArrowRight size={14} style={{ color: GREEN }} />}
          </div>
        ))}
      </motion.div>
      <div className="space-y-3">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: GREEN }} />
            <span className="text-white/75 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PlatformSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
        style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
        {slide.platformIcon} {slide.platform}
      </motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      {slide.concept && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="mt-4 mb-6 px-4 py-3 rounded-xl text-white font-semibold"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {slide.concept}
        </motion.div>
      )}
      {slide.diagram && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="flex items-center gap-3 mt-4 mb-6">
          {slide.diagram.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-white"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                {d}
              </div>
              {i < slide.diagram.length - 1 && <ArrowRight size={13} style={{ color }} />}
            </div>
          ))}
        </motion.div>
      )}
      <div className="space-y-3">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: color }} />
            <span className="text-white/75 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PracticeSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
        className="mt-6 p-5 rounded-2xl text-center"
        style={{ background: `${color}18`, border: `1px solid ${color}45` }}>
        <p className="text-xl font-extrabold" style={{ color }}>{slide.action}</p>
      </motion.div>
      <div className="space-y-3 mt-6">
        {slide.steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-center gap-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
              style={{ background: `${color}20`, border: `1px solid ${color}45`, color }}>
              {i + 1}
            </div>
            <span className="text-white/80 text-base">{step}</span>
          </motion.div>
        ))}
      </div>
      {slide.note && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-5 text-white/40 text-sm">
          {slide.note}
        </motion.p>
      )}
    </div>
  )
}

function RulesSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-2 gap-4 mt-7">
        <div>
          <p className="text-xs font-extrabold tracking-widest mb-3" style={{ color: GREEN }}>FAZER</p>
          <div className="space-y-2.5">
            {slide.dos.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-2.5">
                <CheckCircle2 size={16} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold tracking-widest mb-3" style={{ color: '#ef4444' }}>NÃO FAZER</p>
          <div className="space-y-2.5">
            {slide.donts.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-2.5">
                <XCircle size={16} style={{ color: '#ef4444' }} className="flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="mt-6 flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(234,138,41,0.1)', border: '1px solid rgba(234,138,41,0.3)' }}>
        <AlertTriangle size={16} style={{ color: '#ea8a29' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: 'rgba(234,138,41,0.9)' }}>{slide.alert}</p>
      </motion.div>
    </div>
  )
}

function GridSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {slide.cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <p className="text-3xl mb-3">{card.icon}</p>
            <p className="font-bold text-white mb-1">{card.label}</p>
            <p className="text-white/55 text-sm">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TimelineSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="mt-8 space-y-5 relative">
        <div className="absolute left-[22px] top-4 bottom-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        {slide.events.map((ev, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-start gap-5 relative">
            <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold text-center leading-tight z-10"
              style={{ background: DARKER, border: `2px solid ${GREEN}`, color: GREEN }}>
              {ev.time}
            </div>
            <div className="pt-2.5">
              <p className="text-white/80 text-base">{ev.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-8 text-white/40 text-sm">
        {slide.note}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
        <span className="text-white/30 text-sm">· Gerando negócios para o seu negócio</span>
      </motion.div>
    </div>
  )
}

function SlideTitle({ children }) {
  return (
    <motion.h2 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
      {children}
    </motion.h2>
  )
}

function renderSlide(slide, format) {
  switch (slide.type) {
    case 'cover':    return <CoverSlide slide={slide} format={format} />
    case 'list':     return <ListSlide slide={slide} />
    case 'steps':    return <StepsSlide slide={slide} />
    case 'cycle':    return <CycleSlide slide={slide} />
    case 'metrics':  return <MetricsSlide slide={slide} />
    case 'diagram':  return <DiagramSlide slide={slide} />
    case 'platform': return <PlatformSlide slide={slide} />
    case 'practice': return <PracticeSlide slide={slide} />
    case 'rules':    return <RulesSlide slide={slide} />
    case 'grid':     return <GridSlide slide={slide} />
    case 'timeline': return <TimelineSlide slide={slide} />
    default:         return null
  }
}

// ─── FORMAT SELECTOR ──────────────────────────────────────────────────────────

function FormatSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center"
      style={{ minHeight: '80vh' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="mb-2">
        <span className="text-white font-bold text-2xl tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl font-extrabold text-white mt-4 mb-2">
        Destrava Digital
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/50 mb-12 text-lg">
        Selecione o formato da consultoria
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {FORMATS.map((fmt, i) => {
          const Icon = fmt.icon
          return (
            <motion.button
              key={fmt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(fmt)}
              className="p-6 rounded-2xl text-left transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${fmt.color}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${fmt.color}20` }}>
                <Icon size={18} style={{ color: fmt.color }} />
              </div>
              <h3 className="text-white font-extrabold text-lg mb-1">{fmt.title}</h3>
              <p className="text-white/50 text-sm mb-4">{fmt.subtitle}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${fmt.color}18`, color: fmt.color, border: `1px solid ${fmt.color}35` }}>
                  {fmt.duration}
                </span>
                <span className="text-xs text-white/35">{fmt.slides.length} slides</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="mt-10 text-white/25 text-xs">
        navegue com as setas ← → ou clique nas laterais
      </motion.p>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function DestravaDigital() {
  const [format, setFormat]     = useState(null)
  const [current, setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)

  const total = format?.slides.length ?? 0

  const goNext = useCallback(() => {
    if (!format || current >= total - 1) return
    setDirection(1)
    setCurrent(c => c + 1)
  }, [format, current, total])

  const goPrev = useCallback(() => {
    if (!format || current <= 0) return
    setDirection(-1)
    setCurrent(c => c - 1)
  }, [format, current])

  const goBack = useCallback(() => {
    setFormat(null)
    setCurrent(0)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Escape')     goBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, goBack])

  function handleSelect(fmt) {
    setFormat(fmt)
    setCurrent(0)
  }

  const variants = {
    enter:  dir => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center:       ({ opacity: 1, x: 0 }),
    exit:   dir => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <div className="relative flex flex-col" style={{ minHeight: '88vh', background: DARK, color: 'white' }}>

      <AnimatePresence mode="wait">
        {!format ? (
          <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col">
            <FormatSelector onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div key="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative" style={{ minHeight: '88vh' }}>

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={goBack}
                className="text-xs font-bold text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
                <ChevronLeft size={13} /> Voltar
              </button>
              <span className="text-xs font-bold" style={{ color: format.color }}>
                {format.title}
              </span>
              <span className="text-xs text-white/30 font-mono">
                {current + 1} / {total}
              </span>
            </div>

            {/* Slide area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Click zones */}
              <button onClick={goPrev} disabled={current === 0}
                className="absolute left-0 top-0 w-16 h-full z-10 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
                style={{ pointerEvents: current === 0 ? 'none' : 'auto' }}>
                <ChevronLeft size={24} className="text-white/40" />
              </button>
              <button onClick={goNext} disabled={current === total - 1}
                className="absolute right-0 top-0 w-16 h-full z-10 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
                style={{ pointerEvents: current === total - 1 ? 'none' : 'auto' }}>
                <ChevronRight size={24} className="text-white/40" />
              </button>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  {renderSlide(format.slides[current], format)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="flex-shrink-0 px-6 py-4 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: format.color }}
                  animate={{ width: `${((current + 1) / total) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={goPrev} disabled={current === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: current === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}>
                  <ChevronLeft size={14} className={current === 0 ? 'text-white/20' : 'text-white/60'} />
                </button>
                <button onClick={goNext} disabled={current === total - 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: current === total - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}>
                  <ChevronRight size={14} className={current === total - 1 ? 'text-white/20' : 'text-white/60'} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
