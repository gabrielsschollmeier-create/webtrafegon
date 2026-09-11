import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Users2, Layers, Megaphone, Crown,
  Target, Heart, DollarSign, Repeat,
  ChevronLeft, ChevronRight, Rocket, Lock, PlayCircle,
  Maximize2, Minimize2,
} from 'lucide-react'

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
  { icon: Target,     cor: '#2563eb', nome: 'Aquisição',         desc: 'Desconhecido vira lead.' },
  { icon: Heart,      cor: '#db2777', nome: 'Envolvimento',      desc: 'Lead confia e lembra.' },
  { icon: DollarSign, cor: '#3f9c14', nome: 'Monetização',       desc: 'Lead vira cliente pagante.' },
  { icon: Repeat,     cor: '#9333ea', nome: 'Retenção/Expansão', desc: 'Cliente fica e cresce.' },
]
const MOTIVOS = [
  ['Sem handoff',              'O trabalho não atravessa fronteiras — não trava esperando outro setor.'],
  ['Contexto compartilhado',   'Todo mundo conhece o mesmo cliente. A decisão sai rápido.'],
  ['Tamanho certo',            'Grande o bastante pra ser autossuficiente, pequeno pra caber numa conversa.'],
  ['Dono do resultado',        'O squad responde pelo resultado, não por "quantas artes saíram".'],
]

// ─── Slides Semana 2 ──────────────────────────────────────────
const SEMANA2_SLIDES = [
  {
    num: 1, tipo: 'capa',
    titulo: 'Marketing de Performance',
    subtitulo: 'Projeto Órbita · Semana 2',
  },
  {
    num: 2, tipo: 'jornada',
    titulo: 'A Jornada do Projeto Órbita',
    intro: 'Quatro semanas para o time inteiro enxergar o mesmo jogo — do lead ao cliente fidelizado.',
    semanas: [
      {
        num: 1, tema: 'Portfólio & Geração de Valor', status: 'concluida',
        topicos: ['O que entregamos e por quê isso tem valor', 'Como apresentar nosso trabalho para o cliente', 'Diferença entre entrega e resultado'],
      },
      {
        num: 2, tema: 'Marketing de Performance', status: 'ativa',
        topicos: ['O ecossistema real da TráfegOn — quem faz o quê', 'A jornada do lead até virar cliente', 'Por que CRM não é opcional'],
      },
      {
        num: 3, tema: 'Operação de Alta Performance', status: 'futura',
        topicos: ['Como priorizamos tarefas sob pressão', 'Comunicação interna e com o cliente', 'Rituais de time que funcionam'],
      },
      {
        num: 4, tema: 'Mentalidade Orientada a Dados', status: 'futura',
        topicos: ['Ler números sem entrar em pânico', 'Quais métricas realmente importam', 'Tomada de decisão baseada em dados'],
      },
    ],
  },
  {
    num: 3, tipo: 'missao',
    titulo: 'Nossa missão',
    destaque: 'Geramos negócios para o negócio do cliente.',
    contexto: 'Não somos uma agência de anúncios. Somos responsáveis pelo crescimento comercial do cliente — e isso envolve muito mais do que cliques e impressões.',
    pilares: [
      {
        icon: '📡', label: 'Atrair',
        desc: 'Levar o cliente certo ao produto/serviço certo',
        detalhe: 'Tráfego pago, criativo, posicionamento de marca — tudo a serviço de leads qualificados, não apenas volume.',
      },
      {
        icon: '🔄', label: 'Converter',
        desc: 'Transformar interesse em receita',
        detalhe: 'LP, atendimento, CRM, velocidade de resposta — o lead que entra tem que sair como cliente.',
      },
      {
        icon: '📈', label: 'Crescer',
        desc: 'Cliente satisfeito fica, indica e expande',
        detalhe: 'Retenção é resultado do nosso trabalho coletivo. Cliente que cresce renova e abre porta para indicação.',
      },
    ],
  },
  {
    num: 4, tipo: 'ecossistema_contextos',
    titulo: 'O caminho que o cliente percorre',
    subtitulo: 'Cada nicho tem sua jornada — mas a estrutura é sempre a mesma 6 etapas. Escolha um contexto:',
    contextos: [
      {
        label: 'Advocacia', icon: '⚖️', cor: '#818cf8',
        etapas: [
          {
            icon: '🔎', nome: 'Google & Instagram', area: 'Tráfego',
            desc: 'Pessoa pesquisa "advogado de família em Florianópolis" ou vê post com autoridade no Instagram.',
            detalhe: 'Campanha precisa aparecer para quem já tem dor declarada (Search) e para quem ainda não sabe que precisa (Meta).',
          },
          {
            icon: '👀', nome: 'Perfil & Autoridade', area: 'Design & Conteúdo',
            desc: 'Em 5 segundos decide se o advogado parece confiável ou vai pro próximo.',
            detalhe: 'Posts de autoridade, depoimentos de clientes, feed coerente com o nicho do escritório.',
          },
          {
            icon: '📄', nome: 'Landing Page', area: 'Web Design',
            desc: 'Clicou no anúncio — a LP tem um único objetivo: fazer ele entrar em contato.',
            detalhe: 'Formulário curto, prova social (casos, avaliações), CTA claro. Sem menu, sem distração.',
          },
          {
            icon: '💬', nome: 'WhatsApp + CRM', area: 'Atendimento',
            desc: 'Primeira mensagem. Aqui a consulta é marcada ou o lead some para o concorrente.',
            detalhe: 'Resposta em até 5 min aumenta 8x a chance de conversão. CRM garante que ninguém cai no esquecimento.',
          },
          {
            icon: '🗓️', nome: 'Consulta', area: 'Comercial / Cliente',
            desc: 'Advogado faz diagnóstico, apresenta proposta, fecha contrato de honorários.',
            detalhe: 'Nossa responsabilidade termina na porta da consulta. O fechamento é do cliente — mas chegamos até aqui juntos.',
          },
          {
            icon: '🏆', nome: 'Cliente fidelizado', area: 'Toda a equipe',
            desc: 'Honorários fechados. Escritório cresce. Nosso MRR cresce junto.',
            detalhe: 'Cliente satisfeito indica. Ciclo recomeça com custo de aquisição menor.',
          },
        ],
      },
      {
        label: 'Mat. Construção', icon: '🏗️', cor: '#f97316',
        etapas: [
          {
            icon: '🔎', nome: 'Google & Meta Ads', area: 'Tráfego',
            desc: '"Loja de material de construção perto de mim" — intenção de compra imediata no Google.',
            detalhe: 'Meta funciona para quem está construindo ou reformando mas ainda não pesquisou. Google pega quem já decidiu comprar.',
          },
          {
            icon: '👀', nome: 'Presença & Avaliações', area: 'Design & Conteúdo',
            desc: 'Google Meu Negócio, fotos dos produtos e avaliações são o cartão de visita antes do contato.',
            detalhe: 'Loja com foto ruim ou sem avaliações perde para o concorrente antes de qualquer conversa.',
          },
          {
            icon: '📄', nome: 'Site / Catálogo', area: 'Web Design',
            desc: 'Exibe produtos, preços e caminho claro para pedir orçamento ou ligar.',
            detalhe: 'Não precisa ser e-commerce completo — precisa mostrar que a loja existe e tem o que o cliente quer.',
          },
          {
            icon: '💬', nome: 'WhatsApp + CRM', area: 'Atendimento',
            desc: 'Cliente pede orçamento. Quem responde primeiro leva o pedido — literalmente.',
            detalhe: 'Material de construção tem decisão rápida. Follow-up no dia seguinte ainda converte.',
          },
          {
            icon: '📦', nome: 'Orçamento → Pedido', area: 'Comercial / Cliente',
            desc: 'Negociação de preço, prazo e entrega. Oportunidade de up-sell em itens complementares.',
            detalhe: 'Quem compra cimento frequentemente quer areia, vergalhão, bloco. Oferecer o pacote aumenta ticket médio.',
          },
          {
            icon: '🏆', nome: 'Venda confirmada', area: 'Toda a equipe',
            desc: 'Pedido fechado. Entrega realizada. Cliente volta na próxima obra.',
            detalhe: 'Recompra é o modelo. Ticket médio cresce com cada pedido. Custo de aquisição cai com o tempo.',
          },
        ],
      },
      {
        label: 'Serviços Locais', icon: '🛠️', cor: '#38bdf8',
        etapas: [
          {
            icon: '🔎', nome: 'Google & Instagram', area: 'Tráfego',
            desc: '"Encanador perto de mim" — intenção local de alta conversão. Urgência real.',
            detalhe: 'Search captura urgência (vazamento, obra parada). Meta captura quem ainda não tem urgência mas pode ter amanhã.',
          },
          {
            icon: '📍', nome: 'Google Meu Negócio', area: 'Design & Conteúdo',
            desc: 'Avaliações e fotos do serviço realizado. A decisão muitas vezes termina aqui.',
            detalhe: 'Prestador com 4.8 estrelas e foto do serviço feito bate prestador sem perfil toda vez.',
          },
          {
            icon: '📄', nome: 'LP / Formulário', area: 'Web Design',
            desc: 'Uma tela, uma ação: pedir orçamento ou ligar agora.',
            detalhe: 'Simples é melhor. Tempo de carregamento rápido. CTA no topo sem precisar rolar.',
          },
          {
            icon: '💬', nome: 'WhatsApp + CRM', area: 'Atendimento',
            desc: 'Responde rápido, agenda a visita ou passa o orçamento na hora.',
            detalhe: 'Serviço local tem alta concorrência de informalidade. Quem parece mais profissional e responde mais rápido fecha.',
          },
          {
            icon: '🔧', nome: 'Visita / Orçamento', area: 'Comercial / Cliente',
            desc: 'Diagnóstico presencial. Fechamento muitas vezes no mesmo dia.',
            detalhe: 'A confiança construída pelo perfil e pelo atendimento chega na visita já pré-construída.',
          },
          {
            icon: '🏆', nome: 'Serviço Executado', area: 'Toda a equipe',
            desc: 'Serviço feito, cliente satisfeito. Pede avaliação no Google. Indica para vizinho.',
            detalhe: 'Indicação é o motor do serviço local. Nosso trabalho aumenta o volume de porta de entrada — o resto depende da execução do cliente.',
          },
        ],
      },
    ],
  },
  {
    num: 5, tipo: 'crm',
    titulo: 'CRM — Nenhum lead some',
    subtitulo: 'A etapa 4 do ecossistema é onde mais se perde dinheiro do cliente',
    stat: { numero: '80%', texto: 'dos leads que não são contatados em 5 minutos nunca fecham' },
    itens: [
      {
        icon: '📥', titulo: 'Todo lead entra no CRM',
        desc: 'WhatsApp, formulário, direct, indicação — qualquer contato é registrado imediatamente. Nada fica na memória de ninguém.',
      },
      {
        icon: '🏷️', titulo: 'Classificação e qualificação',
        desc: 'Lead é qualificado: qual área, qual momento de decisão, qual verba disponível. O funil define qual a próxima ação e quem é responsável.',
      },
      {
        icon: '⏱️', titulo: 'Resposta em até 5 minutos',
        desc: 'Depois de 30 minutos a conversão cai 80%. Depois de 1 hora, quase zero. O CRM elimina o "vou responder depois".',
      },
      {
        icon: '🔔', titulo: 'Follow-up automático',
        desc: 'Lead que não respondeu ontem não desaparece — o CRM dispara lembrete no dia seguinte. E no próximo. Até fechar ou descarta.',
      },
      {
        icon: '📊', titulo: 'Visibilidade em tempo real',
        desc: 'Gestor vê quantos leads chegaram, quantos foram atendidos, quantos estão em negociação e quantos fecharam. Sem achismo.',
      },
    ],
    alerta: 'Lead sem CRM é dinheiro do cliente jogado fora. O anúncio trouxe — a nossa operação não pode perder.',
  },
  {
    num: 6, tipo: 'exemplo',
    titulo: 'Na prática: escritório de advocacia',
    cliente: 'Caso real — jornada completa',
    contexto: 'Escritório de família em Florianópolis. Objetivo: aumentar volume de consultas pagas.',
    jornada: [
      {
        etapa: 'Campanha no Google',
        quem: 'Tráfego + Design',
        acao: 'Anúncio Search para "advogado divórcio Florianópolis" + criativo de autoridade no Meta para remarketing.',
        resultado: 'CPL médio de R$28. 40 leads no mês.',
      },
      {
        etapa: 'Lead chega na LP',
        quem: 'Web Design',
        acao: 'LP com depoimento de cliente, foto da advogada, formulário de 3 campos. Sem menu. Carrega em 1,2s.',
        resultado: '18% de conversão na página — acima da média do nicho.',
      },
      {
        etapa: 'Registro no CRM',
        quem: 'Atendimento',
        acao: 'Lead entra automático no CRM. Responsável notificado. Contato feito em 4 minutos.',
        resultado: '32 dos 40 leads foram contatados em menos de 5 min.',
      },
      {
        etapa: 'Consulta agendada',
        quem: 'Comercial / escritório',
        acao: 'Diagnóstico via WhatsApp, apresentação da proposta, agendamento da consulta presencial.',
        resultado: '19 consultas agendadas. 12 fechamentos. Ticket médio R$3.200.',
      },
      {
        etapa: 'Resultado para a agência',
        quem: 'Toda a equipe',
        acao: 'Cliente gerou R$38.400 em honorários. Renovou contrato com upgrade de plano.',
        resultado: 'MRR da TráfegOn cresceu junto. Esse é o modelo.',
      },
    ],
  },
  {
    num: 7, tipo: 'integrado',
    titulo: 'O resultado é sempre coletivo',
    destaque: 'Nenhuma área fecha sozinha. O gol é sempre do time.',
    intro: 'Quando um elo falha, toda a cadeia falha — e o cliente paga a conta.',
    linhas: [
      {
        antes: 'Campanha boa + LP ruim',
        depois: 'Lead chega motivado e desiste na página. CPL desperdiçado.',
        icone: '📢 → 📄',
      },
      {
        antes: 'LP boa + atendimento lento',
        depois: 'Lead converte, espera, esfria, vai pro concorrente que respondeu primeiro.',
        icone: '📄 → 💬',
      },
      {
        antes: 'Criativo ruim + campanha boa',
        depois: 'Ninguém clica. CPL explode. Verba do cliente vai embora sem resultado.',
        icone: '🎨 → 📢',
      },
      {
        antes: 'Tudo funcionando junto',
        depois: 'Cliente vende, fica, indica. A gente renova e cresce junto.',
        icone: '✓ todo o time',
      },
    ],
    conclusao: 'Por isso cada área precisa entender o que a outra entrega. Não pra fazer o trabalho do outro — pra saber onde a corrente pode quebrar.',
  },
  {
    num: 8, tipo: 'encerramento',
    titulo: 'Semana 3: Operação de Alta Performance',
    subtitulo: 'Semana 2 concluída ✓',
    destaque: 'Nosso trabalho só termina quando o cliente vende mais.',
    preview: [
      { icon: '⚙️', texto: 'Como priorizamos sob pressão — sem apagar incêndio' },
      { icon: '🗣️', texto: 'Comunicação com o cliente: o que falar, quando e como' },
      { icon: '📋', texto: 'Rituais de time: daily, retrospectiva, alinhamento de meta' },
    ],
  },
]

const ORBITA_SEMANAS = [
  { id: 1, titulo: 'Portfólio & Geração de Valor',  status: 'concluida', data: 'Set/2026',       cor: G,         slides: [] },
  { id: 2, titulo: 'Marketing de Performance',       status: 'ativa',     data: 'Set/2026',       cor: G,         slides: SEMANA2_SLIDES },
  { id: 3, titulo: 'Operação de Alta Performance',   status: 'em_breve',  data: 'Próxima semana', cor: '#3b82f6', slides: [] },
  { id: 4, titulo: 'Mentalidade Orientada a Dados',  status: 'em_breve',  data: 'Em 2 semanas',   cor: '#be29ec', slides: [] },
]

const slideVariants = {
  enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.96 }),
}

// ─── helpers compartilhados ────────────────────────────────────
function Eyebrow({ children }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: G }}>{children}</p>
}
function SH({ children }) {
  return <h2 className="text-2xl font-black text-white leading-tight mb-1">{children}</h2>
}
function Sub({ children }) {
  return <p className="text-sm mb-5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{children}</p>
}
function Row({ children, accent, style = {} }) {
  return (
    <div className="flex items-start gap-3 rounded-xl px-4 py-3.5"
      style={{ background: accent ? G + '12' : 'rgba(255,255,255,0.05)', border: `1px solid ${accent ? G + '35' : 'rgba(255,255,255,0.07)'}`, ...style }}>
      {children}
    </div>
  )
}
function Chip({ children, cor }) {
  return (
    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg flex-shrink-0"
      style={{ background: (cor || G) + '18', color: cor || G }}>{children}</span>
  )
}

// ─── Ecossistema com contextos (tem estado próprio) ────────────
function EcossistemaSlide({ slide, h }) {
  const [ctx, setCtx] = useState(0)
  const [expandido, setExpandido] = useState(null)
  const c = slide.contextos[ctx]
  return (
    <div className={`w-full ${h} p-6 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>Ecossistema TráfegOn</Eyebrow>
      <SH>{slide.titulo}</SH>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{slide.subtitulo}</p>

      {/* Seletor de contexto */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {slide.contextos.map((c2, i) => (
          <button key={i} onClick={() => { setCtx(i); setExpandido(null) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={ctx === i
              ? { background: c2.cor + '22', color: c2.cor, border: `1.5px solid ${c2.cor}55` }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
            <span>{c2.icon}</span> {c2.label}
          </button>
        ))}
        <span className="text-[10px] self-center" style={{ color: 'rgba(255,255,255,0.2)' }}>toque para detalhar →</span>
      </div>

      {/* Etapas */}
      <AnimatePresence mode="wait">
        <motion.div key={ctx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="space-y-1.5">
          {c.etapas.map((e, i) => (
            <div key={i}>
              <button onClick={() => setExpandido(expandido === i ? null : i)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                style={{
                  background: expandido === i ? c.cor + '14' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${expandido === i ? c.cor + '40' : 'rgba(255,255,255,0.07)'}`,
                }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>{e.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tabular-nums flex-shrink-0"
                      style={{ color: c.cor + 'aa' }}>0{i + 1}</span>
                    <p className="text-sm font-black text-white truncate">{e.nome}</p>
                  </div>
                  <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{e.desc}</p>
                </div>
                <Chip cor={c.cor}>{e.area}</Chip>
              </button>
              <AnimatePresence>
                {expandido === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="mx-2 mb-1 px-4 py-3 rounded-b-xl text-xs leading-relaxed"
                      style={{ background: c.cor + '0d', border: `1px solid ${c.cor}25`, borderTop: 'none', color: 'rgba(255,255,255,0.65)' }}>
                      💡 {e.detalhe}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── SlideView ────────────────────────────────────────────────
function SlideView({ slide, fullscreen }) {
  const h = fullscreen ? 'h-full' : ''

  if (slide.tipo === 'capa') return (
    <div className={`w-full ${h} flex flex-col items-center justify-center text-center relative overflow-hidden py-20 px-8`}
      style={{ background: `linear-gradient(150deg, #091406 0%, ${DARK} 55%)` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 90% 55% at 50% 25%, ${G}26 0%, transparent 65%)` }} />
      <motion.div className="relative z-10 flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: G + '20', border: `2px solid ${G}38` }}>🚀</div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: G + 'bb' }}>{slide.subtitulo}</p>
          <h1 className="text-3xl font-black text-white leading-tight">{slide.titulo}</h1>
        </div>
        <div className="px-5 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)' }}>
          TráfegOn · Treinamento Interno
        </div>
      </motion.div>
    </div>
  )

  if (slide.tipo === 'jornada') return (
    <div className={`w-full ${h} p-7 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>Projeto Órbita</Eyebrow>
      <SH>{slide.titulo}</SH>
      <p className="text-xs mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{slide.intro}</p>
      <div className="space-y-2.5">
        {slide.semanas.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: s.status === 'ativa' ? G + '0e' : 'rgba(255,255,255,0.03)',
              border: s.status === 'ativa' ? `1.5px solid ${G}40` : s.status === 'concluida' ? `1.5px solid rgba(255,255,255,0.12)` : '1.5px solid rgba(255,255,255,0.05)',
            }}>
            <div className="flex items-center gap-3 p-3.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: s.status === 'futura' ? 'rgba(255,255,255,0.05)' : G, color: s.status === 'futura' ? 'rgba(255,255,255,0.15)' : DARK }}>
                {s.status === 'concluida' ? '✓' : s.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>Semana {s.num}</p>
                <p className="text-sm font-black"
                  style={{ color: s.status === 'futura' ? 'rgba(255,255,255,0.25)' : s.status === 'ativa' ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                  {s.tema}
                </p>
              </div>
              {s.status === 'ativa'     && <Chip>Hoje</Chip>}
              {s.status === 'concluida' && <Chip>Concluída</Chip>}
              {s.status === 'futura'    && <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>Em breve</span>}
            </div>
            {s.status !== 'futura' && s.topicos && (
              <div className="px-3.5 pb-3.5 pt-0">
                <div className="pl-12 space-y-1">
                  {s.topicos.map((t, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[10px] mt-0.5 flex-shrink-0" style={{ color: G + '80' }}>›</span>
                      <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'missao') return (
    <div className={`w-full ${h} p-7 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>Nossa missão</Eyebrow>
      <SH>{slide.titulo}</SH>
      <motion.div className="mt-3 mb-4 p-5 rounded-2xl"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: `linear-gradient(135deg, #0c1a06, #091406)`, border: `1.5px solid ${G}30` }}>
        <p className="text-xl font-black text-white leading-snug mb-2">"{slide.destaque}"</p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{slide.contexto}</p>
      </motion.div>
      <div className="space-y-2.5">
        {slide.pilares.map((p, i) => (
          <motion.div key={p.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.09 }}
            className="flex gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: G + '15' }}>{p.icon}</div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-sm font-black" style={{ color: G }}>{p.label}</p>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>— {p.desc}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{p.detalhe}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'ecossistema_contextos') return <EcossistemaSlide slide={slide} h={h} />

  if (slide.tipo === 'crm') return (
    <div className={`w-full ${h} p-7 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>CRM</Eyebrow>
      <SH>{slide.titulo}</SH>
      <p className="text-xs mb-3 leading-snug" style={{ color: 'rgba(255,255,255,0.4)' }}>{slide.subtitulo}</p>
      {slide.stat && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 rounded-xl flex items-center gap-4"
          style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)' }}>
          <p className="text-3xl font-black flex-shrink-0" style={{ color: '#f87171' }}>{slide.stat.numero}</p>
          <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>{slide.stat.texto}</p>
        </motion.div>
      )}
      <div className="space-y-2 mb-4">
        {slide.itens.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}>
            <Row>
              <span className="text-lg flex-shrink-0 mt-0.5">{it.icon}</span>
              <div>
                <p className="text-sm font-black text-white mb-0.5">{it.titulo}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{it.desc}</p>
              </div>
            </Row>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="rounded-xl px-4 py-3.5"
        style={{ background: G + '12', border: `1.5px solid ${G}30` }}>
        <p className="text-sm font-black" style={{ color: G }}>⚠️ {slide.alerta}</p>
      </motion.div>
    </div>
  )

  if (slide.tipo === 'exemplo') return (
    <div className={`w-full ${h} p-7 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>Exemplo prático</Eyebrow>
      <SH>{slide.titulo}</SH>
      <p className="text-xs mb-4 leading-snug" style={{ color: 'rgba(255,255,255,0.38)' }}>{slide.contexto}</p>
      <div className="space-y-2">
        {slide.jornada.map((j, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <div className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5"
                  style={{ background: G, color: DARK }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-black text-white">{j.etapa}</p>
                    <Chip>{j.quem}</Chip>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{j.acao}</p>
                </div>
              </div>
              {j.resultado && (
                <div className="px-4 pb-3 pt-0 pl-[52px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black" style={{ color: G }}>→</span>
                    <p className="text-[11px] font-bold" style={{ color: G + 'cc' }}>{j.resultado}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (slide.tipo === 'integrado') return (
    <div className={`w-full ${h} p-7 overflow-auto`} style={{ background: D2 }}>
      <Eyebrow>Interdependência</Eyebrow>
      <SH>{slide.titulo}</SH>
      <p className="text-sm font-bold mb-1 mt-1" style={{ color: G }}>"{slide.destaque}"</p>
      <p className="text-xs mb-5 leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{slide.intro}</p>
      <div className="space-y-2 mb-4">
        {slide.linhas.map((l, i) => {
          const isLast = i === slide.linhas.length - 1
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl px-4 py-3"
              style={{
                background: isLast ? G + '10' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isLast ? G + '35' : 'rgba(255,60,60,0.15)'}`,
              }}>
              <div className="flex items-start gap-3">
                <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: isLast ? G : 'rgba(255,80,80,0.6)' }}>
                  {isLast ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <p className="text-xs font-black" style={{ color: isLast ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)' }}>{l.antes}</p>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{l.icone}</span>
                  </div>
                  <p className="text-xs leading-snug" style={{ color: isLast ? G + 'dd' : 'rgba(255,100,100,0.7)' }}>{l.depois}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="rounded-xl px-4 py-3 text-xs leading-relaxed"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
        {slide.conclusao}
      </motion.div>
    </div>
  )

  if (slide.tipo === 'encerramento') return (
    <div className={`w-full ${h} p-7 overflow-auto relative`}
      style={{ background: `linear-gradient(150deg, #091406 0%, ${DARK} 60%)` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 45% at 50% 10%, ${G}18 0%, transparent 65%)` }} />
      <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: G + '20', border: `2px solid ${G}35` }}>🏁</div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: G + 'aa' }}>{slide.subtitulo}</p>
            <h2 className="text-2xl font-black text-white">{slide.titulo}</h2>
          </div>
        </div>
        <div className="mb-5 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-base font-bold text-white">"{slide.destaque}"</p>
        </div>
        {slide.preview && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>O que vem na Semana 3</p>
            <div className="space-y-2">
              {slide.preview.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-lg flex-shrink-0">{p.icon}</span>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.texto}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
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

  if (semanaId && semana) {
    const toolbar = (
      <div className="flex items-center justify-between flex-shrink-0 mb-3">
        <button onClick={() => { setSemanaId(null); setFs(false) }}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
          <ChevronLeft size={13} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {slideIdx + 1} / {slides.length}
          </span>
          <button onClick={() => setFs(v => !v)}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
            {fs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    )

    const progressBar = (
      <div className="h-[3px] rounded-full mb-4 overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${((slideIdx + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: G, boxShadow: `0 0 12px ${G}90` }} />
      </div>
    )

    const nav = (
      <div className="flex items-center justify-between gap-3 flex-shrink-0 mt-4">
        <button onClick={() => goSlide(-1)} disabled={slideIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-20 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}>
          <ChevronLeft size={14} /> Anterior
        </button>
        <div className="flex gap-1.5 flex-wrap justify-center flex-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > slideIdx ? 1 : -1); setSlideIdx(i) }}
              className="rounded-full transition-all duration-300"
              style={{ width: i === slideIdx ? 22 : 6, height: 6, background: i === slideIdx ? G : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <button onClick={() => goSlide(1)} disabled={slideIdx === slides.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-20 transition-opacity"
          style={{ background: G, color: DARK }}>
          Próximo <ChevronRight size={14} />
        </button>
      </div>
    )

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

    return (
      <div>
        {toolbar}
        {progressBar}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 6px 32px rgba(0,0,0,0.6)' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={slideIdx} custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {slide && <SlideView slide={slide} />}
            </motion.div>
          </AnimatePresence>
        </div>
        {nav}
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, #091406 100%)` }}>
        <div className="absolute top-[-50px] right-[-40px] w-[240px] h-[240px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${G}15 0%, transparent 65%)` }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Rocket size={16} style={{ color: G }} />
            <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: G + 'aa' }}>Projeto Órbita</p>
          </div>
          <p className="text-xl font-extrabold text-white mb-1">Jornada de 4 Semanas</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
              border: s.status === 'ativa' ? `1.5px solid ${G}35` : '1.5px solid rgba(255,255,255,0.07)',
              opacity: s.status === 'em_breve' ? 0.45 : 1,
              cursor: s.status === 'em_breve' ? 'default' : 'pointer',
            }}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0"
                style={{ background: s.status === 'em_breve' ? 'rgba(255,255,255,0.05)' : s.cor + '22', color: s.status === 'em_breve' ? 'rgba(255,255,255,0.2)' : s.cor }}>
                {s.status === 'concluida' ? '✓' : s.status === 'em_breve' ? <Lock size={14} /> : s.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)' }}>Semana {s.id}</p>
                  {s.status === 'ativa'     && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: G, color: DARK }}>Hoje</span>}
                  {s.status === 'concluida' && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: G + '20', color: G }}>Concluída</span>}
                </div>
                <p className="text-sm font-extrabold"
                  style={{ color: s.status === 'em_breve' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.92)' }}>
                  {s.titulo}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{s.data}</p>
              </div>
              {s.status !== 'em_breve'
                ? <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                : <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.18)' }}>Em breve</span>}
            </div>
            {s.status === 'ativa' && s.slides?.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
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

// ─── Conhecimentos Gerais ─────────────────────────────────────
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
      {Icon && <Icon size={13} />}{children}
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

      {tab === 'solucoes' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5" style={{ background: D2 }}>
          <ProjetoOrbita />
        </motion.div>
      )}

      {tab === 'gerais' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <section>
            <SectionTitle icon={Users2}>O que é um squad</SectionTitle>
            <Card>
              <p className="text-text-2 leading-relaxed mb-4">
                <strong className="text-text">Squad</strong> é um time pequeno e multifuncional que entrega
                o cliente do começo ao fim — juntos, sem passar a bola de setor em setor.
                A maioria das agências trabalha em <strong className="text-text">silos</strong> e o cliente
                fica sendo jogado de um pro outro, sem dono.
                A gente junta todas as funções numa <strong className="text-text">célula só</strong>.
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
                  jurídica é editorial de ritmo próprio, que seria atropelado pelo operacional.
                </p>
              </Card>
              <Card>
                <div className="mb-3"><Tag icon={Crown} cor="#be29ec">LIDERANÇA</Tag></div>
                <p className="text-sm font-bold text-text">Gabriel <span className="font-medium text-text-2">— estratégia e condução do squad</span></p>
                <p className="text-sm font-bold text-text mt-2">Carol <span className="font-medium text-text-2">— administração / sociedade</span></p>
              </Card>
            </div>
          </section>

          <section>
            <SectionTitle icon={Target}>O método — a lógica de tudo</SectionTitle>
            <Card>
              <p className="text-text-2 leading-relaxed mb-4">
                Todo cliente passa por 4 fases. Cada função do time serve uma delas.
                <strong className="text-text"> Não se pula fase.</strong>
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
