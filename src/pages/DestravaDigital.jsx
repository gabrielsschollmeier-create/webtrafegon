import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Unlock, Clock, ChevronDown, CheckCircle2, Circle,
  Monitor, BookOpen, Flag, Package, Target, Search,
  RotateCcw, Zap, TrendingUp,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const ATIVACAO = {
  id: 'ativacao',
  title: 'Ativação',
  subtitle: '1 plataforma — Meta OU Google Ads',
  duration: '1:30h',
  color: '#ea8a29',
  icon: Zap,
  blocos: [
    {
      id: 'a1', num: 1, title: 'Abertura', duration: '10min', color: '#6eda2c', icon: Flag,
      items: [
        'Listar ao vivo todos os entregáveis do plano contratado',
        'Definir o que é papel da agência x papel do cliente',
        '"Hoje você vai ver cada entrega e aprender a gerenciar"',
      ],
    },
    {
      id: 'a2', num: 2, title: 'Teoria mínima', duration: '15min', color: '#60a5fa', icon: BookOpen,
      items: [
        'Marketing não linear — o lead não compra na primeira vez',
        'O ciclo: anúncio → clique → lead → atendimento → venda',
        'As 3 métricas que importam: Investimento, Leads, CPL',
        'O que esperar nos primeiros 30 dias',
      ],
    },
    {
      id: 'a3', num: 3, title: 'Meta Ads ou Google Ads', duration: '50min', color: '#ea8a29', icon: Monitor,
      subsections: [
        {
          id: 'a3-1', title: 'O que construímos', duration: '15min',
          items: [
            'Estrutura criada: campanha → conjunto → anúncio',
            'Público ou palavras-chave escolhidos — explicar o porquê',
            'Criativos ou anúncios aprovados — raciocínio por trás de cada um',
          ],
        },
        {
          id: 'a3-2', title: 'Cliente navega', duration: '20min',
          items: [
            'Cliente abre o Gerenciador no dispositivo dele',
            'Guiar: onde ficam campanhas, conjuntos, anúncios',
            'Ele localiza as métricas principais com orientação',
            'Mostrar onde chegam os leads (formulário ou WhatsApp)',
          ],
        },
        {
          id: 'a3-3', title: 'Gestão diária', duration: '15min',
          items: [
            'O que checar todo dia: campanha ativa, leads, verba gasta',
            'O que NUNCA mexer sem falar com a agência',
            'Quando acionar: campanha pausou, leads zeraram, verba acabou antes do prazo',
          ],
        },
      ],
    },
    {
      id: 'a4', num: 4, title: 'Demais entregas', duration: '10min', color: '#be29ec', icon: Package,
      items: [
        'Landing page — abrir ao vivo e confirmar que está funcionando',
        'Google Meu Negócio — mostrar o perfil otimizado (rápido)',
        'Instagram e Facebook — confirmação rápida dos perfis',
      ],
    },
    {
      id: 'a5', num: 5, title: 'Próximos passos', duration: '5min', color: '#22d3ee', icon: Target,
      items: [
        'Entregar o Guia de Gestão',
        'Como acionar o suporte (canal + prazo de resposta)',
        'O que esperar nos próximos 30 dias',
      ],
    },
  ],
}

const ESTRUTURACAO = {
  id: 'estruturacao',
  title: 'Estruturação / Aceleração',
  subtitle: '2 plataformas — Meta + Google Ads',
  duration: '2:30h',
  color: '#6eda2c',
  icon: TrendingUp,
  blocos: [
    {
      id: 'e1', num: 1, title: 'Abertura', duration: '10min', color: '#6eda2c', icon: Flag,
      items: [
        'Listar ao vivo todos os entregáveis do plano contratado',
        'Definir o que é papel da agência x papel do cliente',
        'Mapa da sessão: Meta → Google → Próximos passos',
      ],
    },
    {
      id: 'e2', num: 2, title: 'Teoria mínima', duration: '15min', color: '#60a5fa', icon: BookOpen,
      items: [
        'Marketing não linear — o lead não compra na primeira vez',
        'O ciclo: anúncio → clique → lead → atendimento → venda',
        'As 3 métricas que importam: Investimento, Leads, CPL',
        'O que esperar nos primeiros 30 dias',
      ],
    },
    {
      id: 'e3', num: 3, title: 'Meta Ads', duration: '50min', color: '#4f6ef7', icon: Monitor,
      subsections: [
        {
          id: 'e3-1', title: 'O que construímos no Meta', duration: '15min',
          items: [
            'Estrutura: campanha → conjunto → anúncio',
            'Público definido e o porquê da escolha',
            'Criativos aprovados — decisão por trás de cada um',
          ],
        },
        {
          id: 'e3-2', title: 'Cliente navega no Meta', duration: '20min',
          items: [
            'Cliente abre o Gerenciador Meta no dispositivo dele',
            'Guiar: campanhas, conjuntos, anúncios, métricas',
            'Onde chegam os leads — formulário ou WhatsApp',
          ],
        },
        {
          id: 'e3-3', title: 'Gestão diária Meta', duration: '15min',
          items: [
            'O que checar: campanha ativa, leads, verba',
            'O que não mexer sem falar com a agência',
            'Quando acionar: campanha pausou, leads zeraram',
          ],
        },
      ],
    },
    {
      id: 'e4', num: 4, title: 'Google Ads', duration: '50min', color: '#ea8a29', icon: Search,
      subsections: [
        {
          id: 'e4-1', title: 'O que construímos no Google', duration: '15min',
          items: [
            'Lógica da busca: pessoa pesquisa → seu anúncio aparece',
            'Palavras-chave escolhidas e o porquê',
            'Extensões configuradas — simulação ao vivo do anúncio',
          ],
        },
        {
          id: 'e4-2', title: 'Cliente navega no Google', duration: '20min',
          items: [
            'Cliente abre Google Ads no dispositivo dele',
            'Guiar: campanha, grupos, palavras-chave, anúncios',
            'Localizar: impressões, cliques, conversões',
            'Termos de pesquisa — o que as pessoas digitaram para encontrar ele',
          ],
        },
        {
          id: 'e4-3', title: 'Gestão diária Google', duration: '15min',
          items: [
            'O que checar: campanha ativa, cliques, custo por conversão',
            'Como ler os termos de pesquisa',
            'Quando acionar: custo disparou, zero conversão por 3+ dias',
          ],
        },
      ],
    },
    {
      id: 'e5', num: 5, title: 'Demais entregas', duration: '8min', color: '#be29ec', icon: Package,
      items: [
        'Landing page — abrir ao vivo e confirmar que está funcionando',
        'Google Meu Negócio — mostrar o perfil otimizado (rápido)',
        'Instagram e Facebook — confirmação rápida dos perfis',
      ],
    },
    {
      id: 'e6', num: 6, title: 'Próximos passos', duration: '7min', color: '#22d3ee', icon: Target,
      items: [
        'Entregar o Guia de Gestão (Meta + Google)',
        'Como acionar o suporte (canal + prazo de resposta)',
        'O que esperar nos próximos 30 dias',
      ],
    },
  ],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getBlocoProgress(bloco, checks) {
  let total = 0, done = 0
  if (bloco.items) {
    bloco.items.forEach((_, i) => {
      total++
      if (checks[`${bloco.id}-item-${i}`]) done++
    })
  }
  if (bloco.subsections) {
    bloco.subsections.forEach(sub =>
      sub.items.forEach((_, i) => {
        total++
        if (checks[`${bloco.id}-sub-${sub.id}-${i}`]) done++
      })
    )
  }
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

function getFormatProgress(format, checks) {
  let total = 0, done = 0
  format.blocos.forEach(b => {
    const p = getBlocoProgress(b, checks)
    total += p.total
    done += p.done
  })
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

// ─── CHECK ITEM ───────────────────────────────────────────────────────────────

function CheckItem({ text, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-start gap-2.5 text-left w-full group py-1 transition-colors"
    >
      {checked
        ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5 text-accent" />
        : <Circle size={15} className="flex-shrink-0 mt-0.5 text-muted group-hover:text-text-2 transition-colors" />
      }
      <span className={`text-sm leading-relaxed transition-colors ${
        checked ? 'text-muted line-through' : 'text-text-2 group-hover:text-text'
      }`}>
        {text}
      </span>
    </button>
  )
}

// ─── SUBSECTION ───────────────────────────────────────────────────────────────

function Subsection({ blocoId, sub, checks, onToggle, blockColor }) {
  const [open, setOpen] = useState(true)
  const done = sub.items.filter((_, i) => checks[`${blocoId}-sub-${sub.id}-${i}`]).length

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg transition-colors"
      >
        <span className="flex-1 text-xs font-bold text-text-2 text-left">{sub.title}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
          style={{ background: blockColor + '15', color: blockColor }}
        >
          <Clock size={9} /> {sub.duration}
        </span>
        <span className="text-[10px] text-muted font-medium flex-shrink-0">{done}/{sub.items.length}</span>
        <ChevronDown size={13} className={`text-muted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-2.5 space-y-0.5 border-t border-border">
              {sub.items.map((item, i) => (
                <CheckItem
                  key={i}
                  text={item}
                  checked={checks[`${blocoId}-sub-${sub.id}-${i}`] || false}
                  onToggle={() => onToggle(`${blocoId}-sub-${sub.id}-${i}`)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── BLOCO ────────────────────────────────────────────────────────────────────

function Bloco({ bloco, index, checks, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? index === 0)
  const Icon = bloco.icon
  const { total, done, pct } = getBlocoProgress(bloco, checks)
  const allDone = total > 0 && done === total

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border rounded-2xl overflow-hidden"
      style={{
        borderColor: allDone ? 'rgba(110,218,44,0.4)' : undefined,
        boxShadow: allDone
          ? '0 0 0 1px rgba(110,218,44,0.15)'
          : '0 1px 4px rgba(26,29,46,0.06)',
      }}
    >
      <div className="h-0.5" style={{ background: bloco.color }} />

      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-bg/50 transition-colors text-left"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bloco.color + '18' }}
        >
          <Icon size={15} style={{ color: bloco.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold text-muted tracking-widest">BLOCO {bloco.num}</span>
            {allDone && <CheckCircle2 size={11} className="text-accent" />}
          </div>
          <h3 className="text-sm font-bold text-text leading-tight">{bloco.title}</h3>
          {pct > 0 && !allDone && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bloco.color }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[9px] text-muted">{done}/{total}</span>
            </div>
          )}
          {allDone && <p className="text-[10px] text-accent font-bold mt-0.5">Concluído</p>}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: bloco.color + '15', color: bloco.color }}
          >
            <Clock size={10} /> {bloco.duration}
          </span>
          <ChevronDown size={14} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
              {bloco.items && (
                <div className="space-y-0.5 pt-1">
                  {bloco.items.map((item, i) => (
                    <CheckItem
                      key={i}
                      text={item}
                      checked={checks[`${bloco.id}-item-${i}`] || false}
                      onToggle={() => onToggle(`${bloco.id}-item-${i}`)}
                    />
                  ))}
                </div>
              )}
              {bloco.subsections && (
                <div className="space-y-2 pt-1">
                  {bloco.subsections.map(sub => (
                    <Subsection
                      key={sub.id}
                      blocoId={bloco.id}
                      sub={sub}
                      checks={checks}
                      onToggle={onToggle}
                      blockColor={bloco.color}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── FORMAT CARD ──────────────────────────────────────────────────────────────

function FormatCard({ format, selected, onClick, progress }) {
  const Icon = format.icon

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left p-5 rounded-2xl border-2 transition-all"
      style={selected ? {
        borderColor: format.color,
        background: format.color + '08',
        boxShadow: `0 0 0 1px ${format.color}22, 0 4px 16px ${format.color}12`,
      } : {
        borderColor: 'var(--border)',
        background: 'white',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: format.color + '20' }}
        >
          <Icon size={18} style={{ color: format.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-text">{format.title}</h3>
          <p className="text-xs text-muted mt-0.5">{format.subtitle}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: format.color + '15', color: format.color }}
            >
              <Clock size={9} /> {format.duration}
            </span>
            <span className="text-[10px] text-muted">{format.blocos.length} blocos</span>
          </div>
          {progress.pct > 0 && (
            <div className="mt-2">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress.pct}%`, background: format.color }}
                />
              </div>
              <p className="text-[9px] text-muted mt-0.5">{progress.pct}% concluído</p>
            </div>
          )}
        </div>
        {selected && (
          <CheckCircle2 size={16} style={{ color: format.color }} className="flex-shrink-0 mt-0.5" />
        )}
      </div>
    </motion.button>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DestravaDigital() {
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [checks, setChecks] = useState({})

  function toggle(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSelectFormat(id) {
    setSelectedFormat(id)
    setChecks({})
  }

  const currentFormat = selectedFormat === 'ativacao' ? ATIVACAO
    : selectedFormat === 'estruturacao' ? ESTRUTURACAO
    : null

  const ativacaoProgress    = getFormatProgress(ATIVACAO, checks)
  const estruturacaoProgress = getFormatProgress(ESTRUTURACAO, checks)
  const currentProgress     = selectedFormat === 'ativacao' ? ativacaoProgress : estruturacaoProgress

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(110,218,44,0.14)' }}>
            <Unlock size={17} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text">Destrava Digital</h1>
            <p className="text-xs text-muted">Guia de consultoria por formato de plano</p>
          </div>
        </div>
      </motion.div>

      {/* Format selector */}
      <div className="mb-6">
        <p className="text-[10px] font-extrabold text-muted tracking-widest uppercase mb-3">
          Selecione o formato
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormatCard
            format={ATIVACAO}
            selected={selectedFormat === 'ativacao'}
            onClick={() => handleSelectFormat('ativacao')}
            progress={ativacaoProgress}
          />
          <FormatCard
            format={ESTRUTURACAO}
            selected={selectedFormat === 'estruturacao'}
            onClick={() => handleSelectFormat('estruturacao')}
            progress={estruturacaoProgress}
          />
        </div>
      </div>

      {/* Blocos */}
      <AnimatePresence mode="wait">
        {currentFormat && (
          <motion.div
            key={currentFormat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {/* Progress bar + reset */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-extrabold text-muted tracking-widest uppercase">
                  {currentProgress.done}/{currentProgress.total} itens
                </p>
                {currentProgress.pct > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: currentFormat.color }}
                        animate={{ width: `${currentProgress.pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: currentFormat.color }}>
                      {currentProgress.pct}%
                    </span>
                  </div>
                )}
              </div>
              {currentProgress.done > 0 && (
                <button
                  onClick={() => setChecks({})}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-text-2 transition-colors"
                >
                  <RotateCcw size={11} /> Resetar
                </button>
              )}
            </div>

            {/* Block list */}
            <div className="space-y-3">
              {currentFormat.blocos.map((bloco, i) => (
                <Bloco
                  key={bloco.id}
                  bloco={bloco}
                  index={i}
                  checks={checks}
                  onToggle={toggle}
                  defaultOpen={i === 0}
                />
              ))}
            </div>

            {/* Completion */}
            <AnimatePresence>
              {currentProgress.pct === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(110,218,44,0.08)',
                    border: '1px solid rgba(110,218,44,0.25)',
                  }}
                >
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-sm font-extrabold text-accent">Consultoria concluída!</p>
                  <p className="text-xs text-muted mt-1">Todos os blocos foram cobertos com sucesso.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
