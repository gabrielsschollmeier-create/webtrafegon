import { motion } from 'framer-motion'

// ── PALETTE ────────────────────────────────────────────────────────────────────
const G      = '#6eda2c'
const DARK   = '#1a1d2e'
const PUR    = '#7c3aed'
const ORANGE = '#f97316'
const RED    = '#f87171'
const GOLD   = '#f59e0b'
const NAVY   = '#0f2044'
const BLUE   = '#3b82f6'
const CYAN   = '#22d3ee'

const NAVYBG = `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)`

// ── átomos ──────────────────────────────────────────────────────────────────────
function Kicker({ children, color = G }) {
  return (
    <motion.div className="inline-block px-4 py-1.5 rounded-full text-[15px] font-black tracking-widest mb-5"
      style={{ background: color, color: color === G ? DARK : 'white' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   SLIDES
// ══════════════════════════════════════════════════════════════════════════════

// 1 · CAPA ──────────────────────────────────────────────────────────────────────
function IA01() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: NAVYBG }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 180 + i * 100, height: 180 + i * 100, border: '1.5px solid rgba(255,255,255,0.1)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 6, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div className="relative z-10 text-center px-10"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <div className="text-7xl mb-5">⚖️</div>
        <Kicker>IMPLEMENTAÇÃO COMERCIAL PARA ADVOCACIA</Kicker>
        <div className="font-black text-white leading-none mb-6" style={{ fontSize: '5rem', letterSpacing: '-3px' }}>
          Do lead ao contrato
        </div>
        <div className="inline-block px-8 py-3 rounded-full font-bold text-white text-2xl"
          style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.24)' }}>
          A metodologia · 3 encontros 1:1
        </div>
      </motion.div>
    </div>
  )
}

// 2 · OS 3 ENCONTROS ────────────────────────────────────────────────────────────
function IA02() {
  const enc = [
    { n: '01', icon: '📊', t: 'Indicadores & Metas', d: 'Os números do escritório, o ponto de equilíbrio e as metas do funil.', c: BLUE },
    { n: '02', icon: '💬', t: 'Abordagem comercial', d: 'O roteiro que converte lead em consulta — acolhendo, sem advogar de graça.', c: G },
    { n: '03', icon: '⚙️', t: 'Operação & Ferramenta', d: 'O CRM montado e a rotina que fazem o processo rodar sozinho.', c: PUR },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-8 px-16" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white">A jornada em 3 encontros</h2>
        <p className="text-white/60 text-xl mt-2">Não é aula — é implementação. Entre os encontros, a construção acontece a quatro mãos.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-6">
        {enc.map((e, i) => (
          <motion.div key={e.n} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 150 }}
            className="rounded-3xl p-8 flex flex-col gap-4" style={{ background: '#1e2035', borderTop: `4px solid ${e.c}` }}>
            <div className="flex items-center justify-between">
              <span className="text-5xl">{e.icon}</span>
              <span className="text-lg font-black tracking-widest" style={{ color: e.c }}>{e.n}</span>
            </div>
            <div className="font-black text-white text-2xl leading-tight">{e.t}</div>
            <div className="text-white/70 text-lg leading-snug">{e.d}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex items-center gap-3 self-center rounded-full px-8 py-3" style={{ background: G + '14', border: `1px solid ${G}40` }}>
        <span className="text-2xl">💬</span>
        <p className="text-xl font-bold" style={{ color: G }}>+ 30 dias de suporte para criar o ritmo do processo.</p>
      </motion.div>
    </div>
  )
}

// 3 · FUNIL AMPULHETA ───────────────────────────────────────────────────────────
function IA03() {
  const left = ['1. Lead', '2. Lead qualificado', '3. Pré-consulta', '4. Consulta', '5. Contrato']
  const right = ['6. Nova contratação', '7. Indicação', '8. Indicação para parceiros']
  return (
    <div className="h-full flex flex-col justify-center gap-8 px-16" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-5xl font-black text-white">Funil ampulheta</h2>
        <p className="text-white/80 text-xl mt-2">Estreita até a venda — e volta a abrir no pós-venda.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-8 max-w-5xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl p-8" style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: CYAN }}>Aquisição → Venda</div>
          <div className="flex flex-col gap-3">
            {left.map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: i === 4 ? G : 'rgba(255,255,255,0.06)' }}>
                <span className={`text-xl font-bold ${i === 4 ? '' : 'text-white'}`} style={i === 4 ? { color: DARK } : {}}>{s}</span>
                {i === 4 && <span className="ml-auto text-sm font-black" style={{ color: DARK }}>◄ a cintura</span>}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl p-8" style={{ background: 'rgba(110,218,44,0.1)', border: `1.5px solid ${G}44` }}>
          <div className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: G }}>Pós-venda → Expansão</div>
          <div className="flex flex-col gap-3">
            {right.map(s => (
              <div key={s} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="text-xl font-bold text-white">{s}</span>
              </div>
            ))}
          </div>
          <p className="text-white/70 text-base mt-5">O LTV do escritório: cliente vira nova contratação e indicações.</p>
        </motion.div>
      </div>
    </div>
  )
}

// 4 · E1 — INDICADORES & METAS ──────────────────────────────────────────────────
function IA04() {
  const blocos = [
    { icon: '💰', t: 'Indicadores', d: 'Ticket médio · margem bruta · custo com marketing (agência + ads + CRM)' },
    { icon: '⚖️', t: 'Ponto de equilíbrio', d: 'Quantos contratos/mês para fechar a conta no tempo' },
    { icon: '🔻', t: 'Metas da ampulheta', d: 'Taxa de conversão por etapa — de aquisição a expansão' },
    { icon: '📣', t: 'Metas por canal', d: 'Google e Meta: leads/mês e CPL alvo' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-8 px-16" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={BLUE}>ENCONTRO 1</Kicker>
        <h2 className="text-5xl font-black text-white">Indicadores & Metas</h2>
        <p className="text-white/60 text-xl mt-2">Enxergar os números e sair com metas claras — do dinheiro até o canal.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-5">
        {blocos.map((b, i) => (
          <motion.div key={b.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="flex items-start gap-5 rounded-2xl p-6" style={{ background: '#1e2035' }}>
            <span className="text-4xl">{b.icon}</span>
            <div>
              <div className="text-2xl font-black text-white">{b.t}</div>
              <div className="text-white/70 text-lg mt-1">{b.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 5 · E1 — O CÁLCULO ────────────────────────────────────────────────────────────
function IA05() {
  const escada = [
    { et: 'Contratos (meta)', conta: '', v: '4' },
    { et: 'Consultas', conta: '4 ÷ 50%', v: '8' },
    { et: 'Leads qualificados', conta: '8 ÷ 50%', v: '16' },
    { et: 'Leads / mês', conta: '16 ÷ 50%', v: '32' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-6 px-16" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={GOLD}>ENCONTRO 1 · O CÁLCULO</Kicker>
        <h2 className="text-5xl font-black text-white">Quantos leads eu preciso?</h2>
        <p className="text-white/80 text-xl mt-2">Ticket R$ 3.000 · margem 88% (100% − 4% imposto − 6% cartão)</p>
      </motion.div>
      <div className="grid grid-cols-[1.1fr_1fr] gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="rounded-3xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {escada.map((e, i) => (
            <div key={e.et} className="grid grid-cols-[1.4fr_1fr_0.5fr] items-center px-6 py-4 border-b border-white/10"
              style={{ background: i === 3 ? G + '22' : 'transparent' }}>
              <span className="text-white text-xl font-bold">{e.et}</span>
              <span className="text-white/50 text-lg">{e.conta}</span>
              <span className="text-3xl font-black text-right" style={{ color: i === 3 ? G : 'white' }}>{e.v}</span>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col gap-4">
          <div className="rounded-2xl p-6" style={{ background: G + '18', border: `1.5px solid ${G}55` }}>
            <div className="text-white/70 text-lg">Ponto de equilíbrio</div>
            <div className="text-4xl font-black text-white">~1 contrato/mês</div>
            <div className="text-white/70 text-base mt-1">já paga TODO o marketing. O resto é quase 100% lucro.</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.28)' }}>
            <div className="text-white/70 text-lg">Investimento em ads</div>
            <div className="text-3xl font-black text-white">~R$ 1.160/mês</div>
            <div className="text-white/70 text-base mt-1">32 leads · Google (20) + Meta (12)</div>
          </div>
        </motion.div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="text-center text-white/80 text-lg italic">
        “A margem alta desarma o medo de investir — o ponto de equilíbrio é baixíssimo.”
      </motion.p>
    </div>
  )
}

// 6 · E2 — ABORDAGEM ────────────────────────────────────────────────────────────
function IA06() {
  const itens = [
    { icon: '🕵️', t: 'Cliente oculto', d: 'A simulação no próprio escritório + exemplos de outros — o choque de realidade.' },
    { icon: '⏱️', t: 'Tempo de resposta', d: 'Padrão ≤ 5 min e o handoff com a IA de atendimento.' },
    { icon: '📱', t: 'Canais', d: 'WhatsApp × ligação: quando usar cada um e a regra de escalonamento.' },
    { icon: '💬', t: 'Templates por situação', d: '1º contato, qualificação, pré-consulta, honorários, follow-up, corte gentil.' },
    { icon: '🛡️', t: 'Quebra de objeções', d: '“Está caro”, “vou pensar”, “me tira só uma dúvida”.' },
    { icon: '❤️', t: 'Tom acolhedor (OAB)', d: 'Família/sucessões é emocional — sem promessa, sem advogar de graça.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-6 px-16" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker>ENCONTRO 2</Kicker>
        <h2 className="text-5xl font-black text-white">Abordagem comercial</h2>
        <p className="text-white/60 text-xl mt-2">O roteiro que converte lead em consulta — acolhendo, sem advogar de graça.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-5">
        {itens.map((it, i) => (
          <motion.div key={it.t} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="rounded-2xl p-6" style={{ background: '#1e2035' }}>
            <div className="text-4xl mb-3">{it.icon}</div>
            <div className="text-xl font-black text-white">{it.t}</div>
            <div className="text-white/65 text-base mt-1 leading-snug">{it.d}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 7 · E3 — OPERAÇÃO & FERRAMENTA ────────────────────────────────────────────────
function IA07() {
  const itens = [
    { icon: '🗂️', t: 'Montar o CRM', d: 'Fases do pipeline (as 8 etapas da ampulheta) + critérios de qualificação (o gate) + rotina diária na ferramenta.' },
    { icon: '🔁', t: 'Rotina comercial', d: 'Semanal (revisar funil, leads parados, agendar) e mensal (métricas + CPL, ajustar metas).' },
    { icon: '📥', t: 'Onboarding de clientes', d: 'Estruturar o onboarding e rotinas para reduzir a necessidade de suporte.' },
    { icon: '🚀', t: 'SDR (horizonte)', d: 'Quando escalar: características do candidato e métricas a acompanhar.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-7 px-16" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={PUR}>ENCONTRO 3</Kicker>
        <h2 className="text-5xl font-black text-white">Operação & Ferramenta</h2>
        <p className="text-white/80 text-xl mt-2">Montar o CRM e a rotina que fazem o processo rodar sozinho.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-5">
        {itens.map((it, i) => (
          <motion.div key={it.t} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="flex items-start gap-5 rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.26)' }}>
            <span className="text-4xl">{it.icon}</span>
            <div>
              <div className="text-2xl font-black text-white">{it.t}</div>
              <div className="text-white/70 text-lg mt-1 leading-snug">{it.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 8 · ENTREGÁVEIS ───────────────────────────────────────────────────────────────
function IA08() {
  const itens = [
    { icon: '🗂️', c: BLUE, t: 'CRM montado', d: 'Pipeline, critérios e rotina — rodando na operação.' },
    { icon: '📘', c: G,    t: 'Playbook documentado', d: 'Funil, roteiro, objeções, metas e rotina.' },
    { icon: '🎓', c: PUR,  t: 'Quem atende, treinado', d: 'Você, seu time ou sua IA — prontos na abordagem.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-9 px-16" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-6xl font-black text-white">O que fica com você</h2>
        <p className="text-white/60 text-xl mt-2">Não é curso. É implementado — dentro do Provimento 205/2021 da OAB.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-7">
        {itens.map((it, i) => (
          <motion.div key={it.t} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.13, type: 'spring', stiffness: 150 }}
            className="rounded-3xl p-8 flex flex-col gap-4" style={{ background: '#1e2035', border: `1px solid ${it.c}33` }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl" style={{ background: it.c + '22', border: `1.5px solid ${it.c}55` }}>{it.icon}</div>
            <div className="text-2xl font-black text-white">{it.t}</div>
            <div className="text-white/70 text-lg leading-snug">{it.d}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 9 · INVESTIMENTO / CTA ────────────────────────────────────────────────────────
function IA09() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 px-16" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-6xl mb-3">🚀</div>
        <h2 className="text-5xl font-black text-white">Comercial no ar em 3 encontros</h2>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="rounded-3xl px-14 py-8 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: `1.5px solid ${G}55` }}>
        <div className="text-white/70 text-xl font-bold uppercase tracking-widest">Investimento</div>
        <div className="text-7xl font-black text-white leading-none mt-2">R$ 2.997</div>
        <div className="text-2xl font-black mt-3" style={{ color: G }}>ou 10× de R$ 299,70</div>
        <div className="text-white/60 text-lg mt-2">à vista R$ 2.697 · +30 dias de suporte</div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-white/80 text-2xl font-medium text-center max-w-3xl">
        Seu escritório não precisa de mais leads. Precisa <span className="font-black text-white">fechar os que já chegam.</span>
      </motion.p>
    </div>
  )
}

export const IMPLEMENTACAO_APRES_SLIDES = [
  { id: 'ia01', label: 'Capa',          C: IA01 },
  { id: 'ia02', label: '3 Encontros',   C: IA02 },
  { id: 'ia03', label: 'Ampulheta',     C: IA03 },
  { id: 'ia04', label: 'E1 Indicadores', C: IA04 },
  { id: 'ia05', label: 'E1 Cálculo',    C: IA05 },
  { id: 'ia06', label: 'E2 Abordagem',  C: IA06 },
  { id: 'ia07', label: 'E3 Operação',   C: IA07 },
  { id: 'ia08', label: 'Entregáveis',   C: IA08 },
  { id: 'ia09', label: 'Investimento',  C: IA09 },
]
