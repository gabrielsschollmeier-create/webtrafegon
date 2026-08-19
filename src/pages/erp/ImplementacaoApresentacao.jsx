import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Slideshow } from './TrafegonComercial'

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
const LILAC  = '#c4b5fd'

const NAVYBG = `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)`

// ── átomos ──────────────────────────────────────────────────────────────────────
function Kicker({ children, color = G }) {
  return (
    <motion.div className="inline-block px-4 py-1.5 rounded-full text-[15px] font-black tracking-widest mb-4"
      style={{ background: color, color: color === G ? DARK : 'white' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  )
}

function Dots({ n, delay = 0 }) {
  return (
    <span className="flex items-center gap-[4px] flex-shrink-0">
      {[...Array(n)].map((_, k) => (
        <motion.span key={k} className="rounded-full"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: delay + k * 0.05, type: 'spring', stiffness: 400 }}
          style={{ width: 7 + n, height: 7 + n, background: LILAC }} />
      ))}
    </span>
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

// 2 · A LÓGICA DOS 3 ENCONTROS (o que cada um desbloqueia) ───────────────────────
function IA_Situacao() {
  return (
    <div className="h-full flex items-center justify-center px-16" style={{ background: NAVYBG }}>
      <motion.div className="max-w-4xl text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="text-7xl mb-6">📉</div>
        <h2 className="text-5xl font-black text-white leading-tight">
          Os leads até chegam. Mas boa parte <span style={{ color: RED }}>some</span> antes de virar cliente.
        </h2>
        <p className="text-white/75 text-2xl mt-7 leading-snug">
          Não falta lead — falta um <span className="text-white font-black">processo</span> pra transformar quem chega em contrato.
        </p>
      </motion.div>
    </div>
  )
}

function IA02() {
  const enc = [
    { n: '01', icon: '📊', t: 'Indicadores & Metas', c: BLUE,
      hoje: 'Não sei quantos clientes preciso nem quanto investir.',
      chave: 'CLAREZA', vira: 'Sei quantos leads perseguir e quanto investir — com metas realistas.' },
    { n: '02', icon: '💬', t: 'Abordagem comercial', c: G,
      hoje: 'Os leads chegam e vazam no atendimento.',
      chave: 'CONVERSÃO', vira: 'Conduzo cada lead com um roteiro claro — acolhendo, sem advogar de graça.' },
    { n: '03', icon: '⚙️', t: 'Operação & Ferramenta', c: PUR,
      hoje: 'Depende de mim lembrar de tudo, o tempo todo.',
      chave: 'AUTONOMIA', vira: 'Tenho um processo organizado — que não depende só de eu lembrar.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-7 px-14" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-5xl font-black text-white">A lógica dos 3 encontros</h2>
        <p className="text-white/60 text-xl mt-2">Cada encontro <span className="text-white font-bold">desbloqueia</span> uma virada. Um abre o próximo.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-6">
        {enc.map((e, i) => (
          <motion.div key={e.n} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, type: 'spring', stiffness: 150 }}
            className="rounded-3xl overflow-hidden flex flex-col" style={{ background: '#1e2035' }}>
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: e.c + '1e', borderBottom: `2px solid ${e.c}` }}>
              <span className="text-4xl">{e.icon}</span>
              <div>
                <div className="text-sm font-black tracking-widest" style={{ color: e.c }}>ENCONTRO {e.n}</div>
                <div className="text-xl font-black text-white leading-tight">{e.t}</div>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex items-start gap-2">
                <span className="text-lg">😟</span>
                <span className="text-white/55 text-base italic leading-snug">“{e.hoje}”</span>
              </div>
              <div className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full" style={{ background: e.c + '22' }}>
                <span className="text-lg">🔓</span>
                <span className="text-sm font-black tracking-widest" style={{ color: e.c }}>{e.chave}</span>
              </div>
              <div className="flex items-start gap-2 mt-auto">
                <span className="text-lg">✅</span>
                <span className="text-white font-semibold text-base leading-snug">“{e.vira}”</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="flex items-center gap-3 self-center rounded-full px-7 py-3" style={{ background: BLUE + '1e', border: `1px solid ${BLUE}55` }}>
        <span className="text-2xl">🔁</span>
        <p className="text-lg font-bold text-white">+ 1 encontro de acompanhamento <span style={{ color: CYAN }}>20 dias depois</span> — o que já foi aplicado e o que ainda falta.</p>
      </motion.div>
    </div>
  )
}

// 3 · FUNIL AMPULHETA (estilo CAF) ──────────────────────────────────────────────
function IA03() {
  const topo = ['Lead', 'Lead qualificado', 'Pré-consulta', 'Consulta']
  const base = [
    { t: 'Nova contratação', n: 1 },
    { t: 'Indicação de clientes', n: 2 },
  ]
  return (
    <div className="h-full flex flex-col px-12 pt-8 pb-10 gap-4" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black text-white leading-none">Você não vende uma causa. Conquista uma cliente.</h2>
        <p className="text-white/55 text-lg mt-2">O caminho aperta até o contrato — e depois <span className="text-white/90 font-bold">abre de novo</span>.</p>
      </motion.div>

      <div className="flex-1 grid gap-8 items-center" style={{ gridTemplateColumns: '1.05fr 1fr' }}>
        {/* Ampulheta */}
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-[13px] font-black uppercase tracking-widest mb-1" style={{ color: CYAN }}>Aquisição → venda</span>
          {topo.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-md py-2 text-center text-white/85 text-lg font-semibold"
              style={{ width: `${100 - i * 15}%`, background: '#1e2035' }}>{t}</motion.div>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
            className="text-[13px] text-white/45 italic mt-0.5">↳ fora do seu perfil? você indica a um parceiro — antes da venda</motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
            className="rounded-lg py-2.5 text-center font-black text-xl my-1"
            style={{ width: '40%', background: G, color: DARK }}>CONTRATO</motion.div>
          {base.map((b, i) => (
            <motion.div key={b.t} initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.1, type: 'spring', stiffness: 170 }}
              className="rounded-md py-2 px-4 flex items-center justify-between gap-2 text-lg font-semibold"
              style={{ width: `${50 + i * 17}%`, background: `rgba(124,58,237,${0.16 + i * 0.06})`, color: LILAC, border: `1px solid rgba(167,139,250,${0.14 + i * 0.07})` }}>
              <span>{b.t}</span>
              <Dots n={b.n} delay={0.65 + i * 0.1} />
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="mt-1.5 text-base font-black" style={{ color: LILAC }}>↺ e cada uma volta lá em cima</motion.div>
        </div>

        {/* Insights */}
        <div className="flex flex-col gap-3 justify-center">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5" style={{ background: '#0f1018' }}>
            <div className="text-white/85 text-lg leading-relaxed">
              Em família, a mesma cliente volta: revisão de alimentos, guarda, anos depois o inventário.
              <span className="text-white font-bold"> Nas próximas, ela não pesquisa no Google — chama você.</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl p-5" style={{ background: G + '12', border: `1.5px solid ${G}50` }}>
            <div className="text-white font-black text-lg leading-snug">O tráfego não substitui a indicação. Ele abastece a indicação.</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5" style={{ background: GOLD + '10', border: `1px solid ${GOLD}30` }}>
            <div className="text-[14px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>O multiplicador</div>
            <div className="text-white/80 text-base leading-relaxed">
              Dos seus últimos 10 clientes: quantos voltaram? Quantos indicaram?
              <span className="text-white/55"> Quem calcula só o 1º contrato acha caro — e desiste do que estava dando certo.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// 4 · E1 — O SEU NÚMERO (de trás pra frente) ─────────────────────────────────────
function IA04() {
  const passos = [
    { v: '4',  t: 'contratos/mês', s: 'a sua meta',     c: G },
    { v: '10', t: 'consultas',     s: '40% fecham',     c: BLUE },
    { v: '20', t: 'qualificados',  s: '50% agendam',    c: CYAN },
    { v: '50', t: 'leads/mês',     s: '40% qualificam', c: ORANGE },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-10 px-14" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={BLUE}>ENCONTRO 1</Kicker>
        <h2 className="text-5xl font-black text-white">Descobrimos o seu número</h2>
        <p className="text-white/60 text-xl mt-2">De trás pra frente: da sua meta até quantos leads buscar. Sem achismo.</p>
      </motion.div>
      <div className="flex items-center justify-center gap-3">
        {passos.map((p, i) => (
          <div key={p.t} className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 160 }}
              className="rounded-2xl px-6 py-5 text-center" style={{ background: '#1e2035', border: `1.5px solid ${p.c}44`, minWidth: 170 }}>
              <div className="text-6xl font-black leading-none" style={{ color: p.c }}>{p.v}</div>
              <div className="text-white text-xl font-bold mt-2">{p.t}</div>
              <div className="text-white/45 text-sm mt-0.5">{p.s}</div>
            </motion.div>
            {i < passos.length - 1 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.1 }}
                className="text-4xl font-black text-white/35">→</motion.span>
            )}
          </div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="self-center rounded-2xl px-8 py-4 flex items-center gap-4" style={{ background: G + '14', border: `1px solid ${G}44` }}>
        <span className="text-3xl">💰</span>
        <p className="text-xl text-white">Investe <b>~R$ 1.800/mês</b> em Google + Meta — e <span style={{ color: G }} className="font-black">1 contrato já paga tudo isso.</span></p>
      </motion.div>
    </div>
  )
}

// 5 · OS DADOS QUE LEVANTAMOS (e por quê) ────────────────────────────────────────
function IA05() {
  const dados = [
    { d: 'Ticket médio', p: 'Quanto vale um contrato (por área)', v: 'R$ 3.000', c: BLUE },
    { d: 'Margem bruta', p: '100% − 4% imposto − 6% cartão', v: '88%', c: G },
    { d: 'Custo com marketing', p: 'Agência + ads + CRM (o que a conta precisa cobrir)', v: 'R$ 3.000', c: ORANGE },
    { d: 'Taxas de conversão', p: 'Quantos leads viram contrato (conservador)', v: '40–50%', c: CYAN },
    { d: 'Recompra + indicação', p: 'O multiplicador (LTV) — o que quase todo mundo esquece', v: '×1,5', c: PUR },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-6 px-16" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={GOLD}>ENCONTRO 1 · O CÁLCULO</Kicker>
        <h2 className="text-5xl font-black text-white">Quais dados levantamos — e por quê</h2>
        <p className="text-white/80 text-xl mt-2">Objetivo: descobrir <span className="text-white font-black">quantos leads perseguir</span> e <span className="text-white font-black">quanto investir</span> com segurança.</p>
      </motion.div>
      <div className="flex flex-col gap-3 max-w-5xl w-full mx-auto">
        {dados.map((r, i) => (
          <motion.div key={r.d} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="grid grid-cols-[1.1fr_1.5fr_0.6fr] items-center rounded-2xl px-6 py-4" style={{ background: 'rgba(0,0,0,0.28)', borderLeft: `4px solid ${r.c}` }}>
            <span className="text-white text-xl font-black">{r.d}</span>
            <span className="text-white/65 text-lg">{r.p}</span>
            <span className="text-2xl font-black text-right" style={{ color: r.c }}>{r.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 6 · COMO CALCULAMOS (de trás pra frente) ──────────────────────────────────────
function IA06() {
  const escada = [
    { et: 'Contratos (meta)', conta: '—',        v: '4',  hl: false },
    { et: 'Consultas',        conta: '÷ 40%',    v: '10', hl: false },
    { et: 'Leads qualificados', conta: '÷ 50%',  v: '20', hl: false },
    { et: 'Leads / mês',      conta: '÷ 40%',    v: '50', hl: true },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-5 px-14" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={GOLD}>ENCONTRO 1 · O CÁLCULO</Kicker>
        <h2 className="text-4xl font-black text-white">Como calculamos — de trás pra frente</h2>
        <p className="text-white/60 text-lg mt-1.5">Parte da meta de contratos e sobe o funil com taxas <span className="text-white font-bold">conservadoras</span>.</p>
      </motion.div>

      <div className="grid grid-cols-[1fr_1fr] gap-6 items-stretch">
        {/* A escada */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl overflow-hidden self-center" style={{ background: '#1e2035' }}>
          {escada.map((e) => (
            <div key={e.et} className="grid grid-cols-[1.5fr_0.7fr_0.5fr] items-center px-5 py-3.5 border-b border-white/10"
              style={{ background: e.hl ? G + '22' : 'transparent' }}>
              <span className="text-white text-lg font-bold">{e.et}</span>
              <span className="text-white/45 text-base">{e.conta}</span>
              <span className="text-2xl font-black text-right" style={{ color: e.hl ? G : 'white' }}>{e.v}</span>
            </div>
          ))}
        </motion.div>

        {/* Os passos + multiplicador */}
        <div className="flex flex-col gap-2.5">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl p-4" style={{ background: '#0f1018' }}>
            <div className="text-white/50 text-sm font-black uppercase tracking-widest mb-1">Ponto de equilíbrio</div>
            <div className="text-white text-lg"><b>R$ 3.000 ÷ R$ 2.640</b> = <span className="text-2xl font-black" style={{ color: G }}>~1 contrato</span> paga todo o marketing</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 }}
            className="rounded-2xl p-4" style={{ background: PUR + '14', border: `1.5px solid ${PUR}55` }}>
            <div className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: LILAC }}>× Multiplicador (recompra + indicação)</div>
            <div className="text-white/85 text-lg">Cada cliente gera, em média, <b className="text-white">1,5 contrato</b> na vida → LTV <span className="text-2xl font-black" style={{ color: LILAC }}>R$ 4.500</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-4" style={{ background: GOLD + '10', border: `1px solid ${GOLD}30` }}>
            <div className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>Investimento em ads</div>
            <div className="text-white/85 text-lg">50 leads · Google (30) + Meta (20) ≈ <b className="text-white">R$ 1.800/mês</b></div>
          </motion.div>
        </div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}
        className="text-center text-white/70 text-lg italic">
        Mesmo conservador e contando só o 1º contrato, o ponto de equilíbrio é baixíssimo. Com o multiplicador, sobra muito mais.
      </motion.p>
    </div>
  )
}

// 7 · E2 — ABORDAGEM ────────────────────────────────────────────────────────────
function IA07() {
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

// 8 · E3 — OPERAÇÃO & FERRAMENTA ────────────────────────────────────────────────
function IA08() {
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

// 9 · ENTREGÁVEIS ───────────────────────────────────────────────────────────────
function IA09() {
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

// 10 · INVESTIMENTO / CTA ────────────────────────────────────────────────────────
function IA10() {
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

// ── DIAGNÓSTICO (respostas da cliente) ───────────────────────────────────────────
function IA_Diagnostico() {
  const pts = [
    { i: '👩‍⚖️', t: 'Você, sozinha', d: 'Conduz o comercial e a operação jurídica ao mesmo tempo.' },
    { i: '📥', t: 'Leads: indicação + tráfego', d: 'Chegam por Google/Meta e WhatsApp — mas parte se perde.' },
    { i: '🤖', t: 'Juscia no 1º atendimento', d: 'A IA inicia e passa pra você — sem ponto claro de virada.' },
    { i: '🗂️', t: 'CRM parado', d: 'Existe na Juscia, mas os leads não são movimentados.' },
    { i: '💬', t: 'Orientação de graça no zap', d: 'Consome seu tempo antes da contratação.' },
    { i: '🎯', t: 'Falta um roteiro', d: 'Acolher e conduzir à consulta sem virar consultoria completa.' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-6 px-14" style={{ background: DARK }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={ORANGE}>DIAGNÓSTICO</Kicker>
        <h2 className="text-5xl font-black text-white">Onde você está hoje</h2>
        <p className="text-white/60 text-xl mt-2">O ponto de partida — o que a gente vai transformar.</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-4">
        {pts.map((p, i) => (
          <motion.div key={p.t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5" style={{ background: '#1e2035' }}>
            <div className="text-3xl mb-2">{p.i}</div>
            <div className="text-lg font-black text-white leading-tight">{p.t}</div>
            <div className="text-white/60 text-sm mt-1 leading-snug">{p.d}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── ICP ──────────────────────────────────────────────────────────────────────────
function IA_ICP() {
  const areas = ['Divórcio', 'Guarda', 'Inventário', 'Pensão', 'Paternidade', 'Curatela']
  const sinais = [
    { i: '💥', t: 'Dor concreta e definida' },
    { i: '⏰', t: 'Urgência (prazo ou conflito ativo)' },
    { i: '❤️', t: 'Impacto emocional / patrimonial' },
    { i: '💳', t: 'Disposição a investir na solução' },
  ]
  return (
    <div className="h-full flex flex-col justify-center gap-7 px-14" style={{ background: NAVYBG }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker color={BLUE}>ICP · CLIENTE IDEAL</Kicker>
        <h2 className="text-5xl font-black text-white">Quem é o seu cliente ideal</h2>
        <p className="text-white/75 text-xl mt-2">Pessoa em conflito ou mudança familiar que precisa de segurança e solução.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: CYAN }}>Áreas que você atua</div>
          <div className="flex flex-wrap gap-2">
            {areas.map(a => <span key={a} className="px-4 py-2 rounded-full text-white font-bold text-base" style={{ background: '#1e2035' }}>{a}</span>)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-6" style={{ background: 'rgba(110,218,44,0.1)', border: `1.5px solid ${G}44` }}>
          <div className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: G }}>Sinais de que vale a consulta</div>
          <div className="flex flex-col gap-3">
            {sinais.map(s => (
              <div key={s.t} className="flex items-center gap-3">
                <span className="text-2xl">{s.i}</span>
                <span className="text-white text-lg font-semibold">{s.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── FUNIL DE VENDAS (preenchível) ─────────────────────────────────────────────────
function IA_FunilCPL() {
  const KEY = 'impl_funil_vendas_v1'
  const [s, setS] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.etapas) return v } catch {}
    return {
      meta: '2', ticket: '3.500', invest: '1.500', margem: '90',
      etapas: [
        { nome: 'Lead',             vol: '120', conv: '50' },
        { nome: 'Lead qualificado', vol: '60',  conv: '20' },
        { nome: 'Pré-consulta',     vol: '12',  conv: '40' },
        { nome: 'Consultas',        vol: '5',   conv: '40' },
      ],
      contratos: '2',
    }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])
  const setE = (i, f, v) => setS(p => ({ ...p, etapas: p.etapas.map((e, j) => j === i ? { ...e, [f]: v } : e) }))
  const setF = (f, v) => setS(p => ({ ...p, [f]: v }))

  return (
    <div className="h-full flex gap-5 px-8 py-5" style={{ background: DARK }}>
      {/* Funil */}
      <div className="flex-1 flex flex-col justify-center gap-2.5 min-w-0">
        <div className="mb-1">
          <h2 className="text-3xl font-black text-white leading-none">Funil de Vendas</h2>
          <p className="text-white/45 text-sm">preencha de baixo para cima · volume e conversão</p>
        </div>
        {s.etapas.map((e, i) => (
          <div key={i} className="rounded-xl px-4 py-2.5 flex items-center gap-3 self-center" style={{ background: '#1e2035', width: `${100 - i * 7}%` }}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: G, color: DARK }}>{i + 1}</span>
            <input value={e.nome} onChange={ev => setE(i, 'nome', ev.target.value)}
              className="bg-transparent text-white font-bold text-base outline-none flex-1 min-w-0" />
            <div className="text-center flex-shrink-0">
              <div className="text-white/40 text-[9px] uppercase tracking-widest">Volume</div>
              <input value={e.vol} onChange={ev => setE(i, 'vol', ev.target.value)}
                className="bg-transparent text-white font-black text-center text-lg outline-none border-b-2" style={{ borderColor: G, width: 62 }} />
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-white/40 text-[9px] uppercase tracking-widest">Conversão %</div>
              <input value={e.conv} onChange={ev => setE(i, 'conv', ev.target.value)}
                className="bg-transparent font-black text-center text-lg outline-none border-b-2" style={{ color: G, borderColor: G, width: 62 }} />
            </div>
          </div>
        ))}
        <div className="rounded-xl px-4 py-3 flex items-center justify-center gap-3 self-center" style={{ background: G, width: '55%' }}>
          <span className="font-black text-sm" style={{ color: DARK }}>CONTRATOS FECHADOS</span>
          <input value={s.contratos} onChange={ev => setF('contratos', ev.target.value)}
            className="bg-transparent font-black text-center text-2xl outline-none" style={{ color: DARK, width: 54 }} />
        </div>
      </div>

      {/* A conta da meta */}
      <div className="w-60 flex flex-col justify-center gap-3 flex-shrink-0">
        <div className="rounded-2xl p-5" style={{ background: '#1e2035', border: `1.5px solid ${G}44` }}>
          <div className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: G }}>A conta da meta</div>
          {[['Meta do período', 'meta'], ['Ticket médio (R$)', 'ticket'], ['Investimento (R$)', 'invest'], ['Margem (%)', 'margem']].map(([lbl, key]) => (
            <div key={key} className="flex items-center justify-between mb-2.5">
              <span className="text-white/60 text-sm">{lbl}</span>
              <input value={s[key]} onChange={ev => setF(key, ev.target.value)}
                className="bg-transparent text-white font-black text-right outline-none border-b" style={{ borderColor: 'rgba(255,255,255,0.2)', width: 84 }} />
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: GOLD + '14', border: `1px solid ${GOLD}44` }}>
          <div className="text-white/60 text-xs uppercase tracking-widest">Custo por lead máximo</div>
          <div className="text-3xl font-black text-white mt-0.5">R$ 211</div>
          <div className="text-white/45 text-xs">não passar disso</div>
        </div>
      </div>
    </div>
  )
}

export const IMPLEMENTACAO_APRES_SLIDES = [
  { id: 'ia01',   label: 'Capa',          C: IA01 },
  { id: 'ia_sit', label: 'A situação',    C: IA_Situacao },
  { id: 'ia_diag', label: 'Diagnóstico',  C: IA_Diagnostico },
  { id: 'ia_icp', label: 'ICP',           C: IA_ICP },
  { id: 'ia02',   label: 'A lógica',      C: IA02 },
  { id: 'ia04',   label: 'E1 · Número',   C: IA04 },
  { id: 'ia03',   label: 'E1 · Ampulheta', C: IA03 },
  { id: 'ia_fun', label: 'Funil · CPL',   C: IA_FunilCPL },
  { id: 'ia07',   label: 'E2 Abordagem',  C: IA07 },
  { id: 'ia08',   label: 'E3 Operação',   C: IA08 },
  { id: 'ia09',   label: 'Entregáveis',   C: IA09 },
  { id: 'ia10',   label: 'Investimento',  C: IA10 },
]

// Componente pronto para embutir num workspace (portal do cliente / visão interna)
export default function ImplementacaoApresentacao() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: 420 }}>
      <Slideshow slides={IMPLEMENTACAO_APRES_SLIDES} accentColor={G} responsive fillWidth />
    </div>
  )
}
