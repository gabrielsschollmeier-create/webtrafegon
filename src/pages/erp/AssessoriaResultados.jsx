import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

const R2 = n => n != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) : '—'
const N  = n => n != null ? new Intl.NumberFormat('pt-BR').format(n) : '0'

/* ── Dados por cliente ────────────────────────────────
   Preencher com os números reais de cada cliente.
   Clientes sem entrada aqui exibem estado vazio.
──────────────────────────────────────────────────── */
const CLIENTS_DATA = {
  ararastur: {
    periodo: 'Jan–Jun/2026',
    meta: {
      investimento: 3120,
      alcance:      92000,
      impressoes:   218000,
      cliques:      1380,
      ctr:          0.63,
      cpm:          14.31,
      cpc:          2.26,
      leads:        86,
      cpl:          36.28,
    },
    google: {
      investimento: 780,
      impressoes:   21500,
      cliques:      365,
      cpc:          2.14,
      leads:        26,
      cpl:          30.00,
    },
    porMes: [
      { mes: 'Jan', meta: 470, google: 120, leads: 15, conversoes: 1 },
      { mes: 'Fev', meta: 490, google: 125, leads: 17, conversoes: 2 },
      { mes: 'Mar', meta: 520, google: 135, leads: 19, conversoes: 2 },
      { mes: 'Abr', meta: 530, google: 130, leads: 18, conversoes: 1 },
      { mes: 'Mai', meta: 560, google: 135, leads: 22, conversoes: 2 },
      { mes: 'Jun', meta: 550, google: 135, leads: 21, conversoes: 2 },
    ],
    acoes: [
      { icon: '📸', titulo: 'Criativos para alta temporada', acao: 'Produzir peças para pacotes de julho/agosto antes do pico sazonal', color: '#6eda2c', tag: 'PRIORIDADE' },
      { icon: '⚠️', titulo: 'CPL acima de R$30 — otimizar', acao: 'Revisar segmentação e públicos — meta de CPL abaixo de R$30', color: '#ea8a29', tag: 'ATENÇÃO' },
      { icon: '🚀', titulo: 'Escalar em julho e agosto', acao: 'Aumentar orçamento para capturar demanda sazonal do turismo', color: '#60a5fa', tag: 'OPORTUNIDADE' },
    ],
  },

  mayara_campos: {
    periodo: 'Junho/2026',
    meta: { investimento: 0, alcance: 0, impressoes: 0, cliques: 0, ctr: 0, cpm: 0, cpc: 0, leads: 0, cpl: 0 },
    google: {
      investimento: 1002.70,
      impressoes:   3119,
      cliques:      148,
      cpc:          6.77,
      leads:        23,
      cpl:          43.60,
    },
    porMes: [
      { mes: 'Jun', meta: 0, google: 1002.70, leads: 23, conversoes: 1 },
    ],
    acoes: [
      { icon: '✅', titulo: 'Formalizar a Priscila (venda)',                 acao: 'Entrada já paga — concluir contratação e marcar como ganho no GHL',        color: '#6eda2c', tag: 'PRIORIDADE' },
      { icon: '🧯', titulo: 'Resgatar Leonardo Deus',                        acao: 'Proposta enviada esfriando há ~19 dias — retomar antes de virar perda',     color: '#ea8a29', tag: 'ATENÇÃO' },
      { icon: '🔓', titulo: 'Destravar a coorte em "Lead qualificado"',      acao: '12 de 20 leads pararam após qualificar — reativar follow-up dos mais quentes', color: '#60a5fa', tag: 'OPORTUNIDADE' },
    ],
    resumo: {
      periodo: '01–28 Jun/2026 · 4 semanas',
      semanasGoogle: [
        { s: 'S1 (01–07)', gasto: 149.05, cliques: 31, conv: 2,  cpa: 74.52 },
        { s: 'S2 (08–14)', gasto: 304.72, cliques: 49, conv: 10, cpa: 30.47 },
        { s: 'S3 (15–21)', gasto: 380.27, cliques: 51, conv: 3,  cpa: 126.76 },
        { s: 'S4 (22–28)', gasto: 168.66, cliques: 17, conv: 8,  cpa: 21.08 },
      ],
      semanasGhl: [
        { s: 'S1 (01–07)', criados: 4,  ganhos: 0, avancaram: 3, parados: 1, perdidos: 0 },
        { s: 'S2 (08–14)', criados: 10, ganhos: 1, avancaram: 1, parados: 6, perdidos: 2 },
        { s: 'S3 (15–21)', criados: 1,  ganhos: 0, avancaram: 0, parados: 1, perdidos: 0 },
        { s: 'S4 (22–28)', criados: 5,  ganhos: 0, avancaram: 1, parados: 4, perdidos: 0 },
      ],
      fonte: '~90% dos leads vieram da internet (link de anúncio / landing page). Apenas 1 indicação no período. A "Fonte" do GHL é genérica ("WhatsApp") e não distingue o canal.',
      analise: [
        'Gargalo "qualifica e some": 12 dos 20 leads travaram em "Lead qualificado" — o lead para de responder, não é falta de atendimento.',
        'Atendimento saudável: ~84% das conversas respondidas, com a assistente conduzindo follow-up e fechamento.',
        'Buraco contato → oportunidade: 125 contatos no total, mas só 69 viraram oportunidade — leads chegando sem entrar no pipeline.',
        'Os 2 maiores tickets e a única venda (Priscila e Mirian) são de INDICAÇÃO, não da internet. A internet entrega volume que avança, mas com ticket menor.',
      ],
      foco: [
        { lead: 'Priscila',           estagio: 'Contratação · GANHO', valor: 3475.84, fonte: 'Indicação', acao: 'Formalizar — entrada já paga' },
        { lead: 'Mirian',             estagio: 'Proposta enviada',    valor: 4044.80, fonte: 'Indicação', acao: 'Maior ticket aberto — empurrar fechamento' },
        { lead: 'Julio Cezar Franco', estagio: 'Proposta enviada',    valor: 1220,    fonte: 'Internet',  acao: 'Confirmar status no funil' },
        { lead: 'Leonardo Deus',      estagio: 'Proposta enviada',    valor: 1220,    fonte: 'Internet',  acao: 'Esfriando ~19d — resgatar já' },
        { lead: 'Paula',              estagio: 'Consulta',            valor: 300,     fonte: 'Internet',  acao: 'Retomar para proposta' },
        { lead: 'Edinho e Cris',      estagio: 'Reunião inicial',     valor: 0,       fonte: 'Internet',  acao: 'Quente — agendar consulta rápido' },
      ],
    },
  },

  nosso_studio: {
    periodo: 'Abr–Jun/2026 · Trimestre 2',
    meta: {
      investimento: 2011.65,
      alcance:      63386,
      impressoes:   238263,
      cliques:      null,
      ctr:          null,
      cpm:          8.44,
      cpc:          null,
      leads:        169,
      cpl:          11.90,
    },
    google: { investimento: 0, impressoes: 0, cliques: 0, cpc: 0, leads: 0, cpl: 0 },
    porMes: [
      { mes: 'Abr', meta: 581.50, google: 0, leads: 46, conversoes: 26 },
      { mes: 'Mai', meta: 698.69, google: 0, leads: 74, conversoes: 22 },
      { mes: 'Jun', meta: 731.46, google: 0, leads: 49, conversoes: 41 },
    ],
    acoes: [
      { icon: '🔓', titulo: 'Reabrir "Direcionamento aberto"',      acao: 'Melhor CPR do trimestre (R$ 5,07) e menor frequência (2,19) — pausado desde junho', color: '#6eda2c', tag: 'PRIORIDADE' },
      { icon: '⏱️', titulo: 'Responder lead pago em até 15 min',     acao: 'Mediana atual é 9h30 — quem responde em ≤30 min converte ~3× mais',               color: '#ea8a29', tag: 'ATENÇÃO' },
      { icon: '💸', titulo: 'Realocar a verba do AD09',              acao: '35% do investimento no criativo de pior CPR (R$ 8,82) — migrar para AD26 e AD25',  color: '#ea8a29', tag: 'ATENÇÃO' },
      { icon: '🌐', titulo: 'Confirmar origem de 79 contatos',       acao: 'R$ 16.616 fechados sem marca de anúncio — sem isso o ROI real fica em aberto',     color: '#60a5fa', tag: 'OPORTUNIDADE' },
    ],
    trimestre: {
      nome: 'Trimestre 2 · Abril, Maio e Junho de 2026',
      cprMedio: 6.73,
      nota: 'CPR = custo por conversa iniciada (Meta). CPL = custo por lead novo no CRM. A diferença entre 299 conversas (Meta) e 169 leads (CRM) é reengajamento de contatos já existentes na base.',
      meses: [
        { mes: 'Abril',  investimento: 581.50, dia: 19.38, leads: 46, cpl: 12.64, conversas:  70, cpr: 8.31, cpm: 7.75, impressoes: 75072 },
        { mes: 'Maio',   investimento: 698.69, dia: 22.54, leads: 74, cpl:  9.44, conversas: 127, cpr: 5.50, cpm: 8.05, impressoes: 86775 },
        { mes: 'Junho',  investimento: 731.46, dia: 24.38, leads: 49, cpl: 14.93, conversas: 102, cpr: 7.17, cpm: 9.57, impressoes: 76416 },
      ],
      leitura: [
        'Maio foi o melhor mês: +20% de investimento sobre abril gerou +61% de leads (46 → 74), com CPL e CPR nos menores patamares do trimestre.',
        'Junho regrediu: maior investimento do trimestre (R$ 731,46) com queda de 34% nos leads. CPL subiu para R$ 14,93 — 58% pior que maio.',
        'Causa provável: concentração no Remarketing 365D com frequência acima de 6, somada à ausência do "Direcionamento aberto", que seguia pausado.',
        'Maio trouxe mais leads e fechou menos ensaios (22); junho trouxe menos leads e fechou 41. O resultado acompanha o atendimento, não o volume de leads.',
      ],
      criativos: [
        { nome: 'AD25 — Estático · Aniversário Sarah Guerra 9x16',   investido:  42.41, conversas: 14, cpr: 3.03 },
        { nome: 'AD26 — Estático · Aniversário Sarah P&B 9x16',      investido: 284.97, conversas: 60, cpr: 4.75 },
        { nome: 'AD02 — Estático · Aniversário Sarah Guerra',        investido: 210.18, conversas: 35, cpr: 6.01 },
        { nome: 'AD21 — Estático · Gestante / feed',                 investido:  81.16, conversas: 13, cpr: 6.24 },
        { nome: 'AD08 — Estático · Ensaio fotográfico P&B',          investido: 131.21, conversas: 16, cpr: 8.20 },
      ],
      criativosNota: 'Considerados apenas criativos com investimento ≥ R$ 40 no trimestre. Versões duplicadas ("— Cópia") somadas ao original. Alerta: o AD09 consumiu R$ 696,44 (35% da verba) com o pior CPR de volume (R$ 8,82).',
      vendas: {
        oportunidades: 276,
        fechados:      89,
        faturamento:   56152.50,
        ticket:        630.93,
        taxa:          32.2,
        porMes: [
          { mes: 'Abril',  opps:  63, fechados: 26, faturamento: 15099.50, ticket: 580.75 },
          { mes: 'Maio',   opps: 102, fechados: 22, faturamento: 20455.00, ticket: 929.77 },
          { mes: 'Junho',  opps: 111, fechados: 41, faturamento: 20598.00, ticket: 502.39 },
        ],
        etapas: [
          { etapa: 'Orçamento enviado',    qtd: 138, cor: '#60a5fa' },
          { etapa: 'Ensaio agendado',      qtd:  89, cor: '#6eda2c' },
          { etapa: 'Contato',              qtd:  39, cor: '#8890b5' },
          { etapa: 'Aguardando pagamento', qtd:  10, cor: '#ea8a29' },
        ],
        atribuicao: 'Das 477 conversas do trimestre, 169 têm marca comprovada de anúncio (texto do Click-to-WhatsApp). Comprovado do tráfego: 7 ensaios · R$ 5.145 (ROAS mínimo 2,56× · CAC R$ 287,38). As demais não têm registro de origem no CRM.',
      },
    },
  },
}

/* ── Helpers ────────────────────────────────────── */
function getClientData(clientId) {
  const d = CLIENTS_DATA[clientId]
  if (!d) return null
  const totalInvest = (d.meta?.investimento || 0) + (d.google?.investimento || 0)
  const totalLeads  = (d.meta?.leads || 0) + (d.google?.leads || 0)
  const cplMedio    = totalLeads > 0 ? totalInvest / totalLeads : 0
  const totalConv   = d.porMes.reduce((s, m) => s + (m.conversoes || 0), 0)
  return { ...d, totalInvest, totalLeads, cplMedio, totalConv }
}

/* ── Mini componentes ─────────────────────────── */
function KpiCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}20` }}>
      <span className="text-xl mb-2">{icon}</span>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

/* ── Estado vazio ─────────────────────────────── */
function EmptyState({ color }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: color + '12', border: `1px solid ${color}30` }}>
        <span className="text-3xl">📊</span>
      </div>
      <p className="text-sm font-extrabold text-text mb-1">Resultados ainda não configurados</p>
      <p className="text-xs text-muted max-w-xs">
        Os indicadores de campanha deste cliente serão exibidos aqui assim que a equipe inserir os dados do período.
      </p>
    </div>
  )
}

/* ── KPIs por plataforma ──────────────────────── */
function KpisMeta({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento"   value={R2(d.meta.investimento)} color={color} />
      <KpiCard icon="👁️"  label="Alcance"         value={N(d.meta.alcance)}       sub={`${N(d.meta.impressoes)} impressões`} color="#60a5fa" />
      <KpiCard icon="🖱️" label="Cliques"         value={d.meta.cliques != null ? N(d.meta.cliques) : '—'}
        sub={d.meta.cliques != null ? `CTR ${d.meta.ctr}% · CPC ${R2(d.meta.cpc)}` : 'não disponível no relatório'} color="#a78bfa" />
      <KpiCard icon="👥" label="Leads"            value={d.meta.leads}             sub={`CPL ${R2(d.meta.cpl)}`} color="#ea8a29" />
    </div>
  )
}

function KpisGoogle({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento"   value={R2(d.google.investimento)} color={color} />
      <KpiCard icon="👁️"  label="Impressões"      value={N(d.google.impressoes)}    color="#60a5fa" />
      <KpiCard icon="🖱️" label="Cliques"         value={N(d.google.cliques)}        sub={`CPC ${R2(d.google.cpc)}`} color="#a78bfa" />
      <KpiCard icon="👥" label="Leads"            value={d.google.leads}             sub={`CPL ${R2(d.google.cpl)}`} color="#ea8a29" />
    </div>
  )
}

function KpisTotal({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento Total" value={R2(d.totalInvest)}  sub={d.periodo}                                     color={color} />
      <KpiCard icon="👥" label="Leads Gerados"       value={N(d.totalLeads)}   sub={`Meta ${d.meta.leads} · Google ${d.google.leads}`} color="#60a5fa" />
      <KpiCard icon="📉" label="CPL Médio"           value={R2(d.cplMedio)}    sub="Custo por Lead combinado"                       color="#ea8a29" />
      <KpiCard icon="🛒" label="Conversões"          value={d.totalConv}       sub="Vendas / contatos qualificados"                 color="#a78bfa" />
    </div>
  )
}

/* ── Tabela mensal ────────────────────────────── */
function TabelaMensal({ d, color }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
        <p className="text-sm font-extrabold text-text">📅 Evolução Mensal</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f7f8fc' }}>
              {['Mês', 'Meta Ads', 'Google Ads', 'Total', 'Leads', 'CPL', 'Conversões'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.porMes.map((row, i) => {
              const total  = row.meta + (row.google || 0)
              const cplRow = row.leads > 0 ? total / row.leads : 0
              const prev   = d.porMes[i - 1]
              const cplColor = cplRow === 0 ? '#8890b5' : cplRow < 30 ? '#6eda2c' : cplRow < 50 ? '#ea8a29' : '#ef4444'
              return (
                <tr key={row.mes} style={{ borderBottom: '1px solid #f1f3f9' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-text">{row.mes}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(row.meta)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{row.google ? R2(row.google) : '—'}</td>
                  <td className="px-4 py-3 font-bold text-text">{R2(total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold" style={{ color }}>{row.leads}</span>
                      {prev && row.leads > prev.leads && <TrendingUp  size={11} className="text-green-400" />}
                      {prev && row.leads < prev.leads && <TrendingDown size={11} className="text-red-400"  />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-sm" style={{ color: cplColor }}>{cplRow > 0 ? R2(cplRow) : '—'}</span>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#a78bfa' }}>{row.conversoes ?? '—'}</td>
                </tr>
              )
            })}
            <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
              <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
              <td className="px-4 py-3 font-bold text-muted">{R2(d.meta.investimento)}</td>
              <td className="px-4 py-3 font-bold text-muted">{R2(d.google.investimento)}</td>
              <td className="px-4 py-3 font-extrabold text-text">{R2(d.totalInvest)}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color }}>{d.totalLeads}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color: '#ea8a29' }}>{R2(d.cplMedio)}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color: '#a78bfa' }}>{d.totalConv}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Ações recomendadas ───────────────────────── */
function Acoes({ acoes }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-text mb-3">🎯 Onde Focar Agora</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {acoes.map((a, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl p-3.5 flex gap-3 items-start"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)', border: `1px solid ${a.color}20` }}>
            <span className="text-xl flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-xs font-extrabold text-text">{a.titulo}</p>
                <Badge color={a.color} text={a.tag} />
              </div>
              <p className="text-[11px] text-muted">→ {a.acao}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Trimestre: evolução, criativos e vendas ──── */
function BarraComparativa({ valor, max, cor, invertido = false }) {
  const pct = max > 0 ? Math.max(4, (valor / max) * 100) : 0
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: '#eef0f7' }}>
      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: invertido ? cor : cor }} />
    </div>
  )
}

function EvolucaoTrimestre({ t, color }) {
  const maxInv   = Math.max(...t.meses.map(m => m.investimento))
  const maxLeads = Math.max(...t.meses.map(m => m.leads))
  const maxCpr   = Math.max(...t.meses.map(m => m.cpr))
  const corCpr   = v => v <= 6 ? '#6eda2c' : v <= 8 ? '#ea8a29' : '#ef4444'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">📈</span>
        <div>
          <p className="text-sm font-extrabold text-text">Evolução no tempo</p>
          <p className="text-[11px] text-muted">{t.nome}</p>
        </div>
      </div>

      {/* Cards por mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {t.meses.map((m, i) => {
          const prev = t.meses[i - 1]
          const dLeads = prev ? m.leads - prev.leads : null
          const dCpr   = prev ? m.cpr - prev.cpr : null
          return (
            <motion.div key={m.mes}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}20` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-extrabold text-text">{m.mes}</p>
                <span className="text-[9px] font-bold text-muted">{R2(m.dia)}/dia</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Investimento</span>
                    <span className="text-sm font-black text-text">{R2(m.investimento)}</span>
                  </div>
                  <BarraComparativa valor={m.investimento} max={maxInv} cor={color} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Leads</span>
                    <span className="flex items-center gap-1">
                      <span className="text-sm font-black" style={{ color }}>{m.leads}</span>
                      {dLeads > 0 && <TrendingUp   size={11} className="text-green-500" />}
                      {dLeads < 0 && <TrendingDown size={11} className="text-red-400"   />}
                    </span>
                  </div>
                  <BarraComparativa valor={m.leads} max={maxLeads} cor="#60a5fa" />
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">CPR</span>
                    <span className="flex items-center gap-1">
                      <span className="text-sm font-black" style={{ color: corCpr(m.cpr) }}>{R2(m.cpr)}</span>
                      {dCpr < 0 && <TrendingDown size={11} className="text-green-500" />}
                      {dCpr > 0 && <TrendingUp   size={11} className="text-red-400"   />}
                    </span>
                  </div>
                  <BarraComparativa valor={m.cpr} max={maxCpr} cor={corCpr(m.cpr)} />
                </div>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #f1f3f9' }}>
                <span className="text-[10px] text-muted">CPL {R2(m.cpl)}</span>
                <span className="text-[10px] text-muted">{N(m.conversas)} conversas</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tabela detalhada */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Mês', 'Investimento', 'R$/dia', 'Leads', 'CPL', 'Conversas', 'CPR', 'CPM', 'Impressões'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.meses.map(m => (
                <tr key={m.mes} style={{ borderBottom: '1px solid #f1f3f9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-text">{m.mes}</td>
                  <td className="px-4 py-3 font-bold text-text text-xs">{R2(m.investimento)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(m.dia)}</td>
                  <td className="px-4 py-3 font-extrabold" style={{ color }}>{m.leads}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(m.cpl)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{N(m.conversas)}</td>
                  <td className="px-4 py-3 font-extrabold text-xs" style={{ color: corCpr(m.cpr) }}>{R2(m.cpr)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(m.cpm)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{N(m.impressoes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {t.nota && (
        <div className="rounded-2xl p-3.5" style={{ background: '#f7f8fc', border: '1px solid #e2e5f0' }}>
          <p className="text-[11px] text-muted">{t.nota}</p>
        </div>
      )}

      {t.leitura?.length > 0 && (
        <div className="space-y-2">
          {t.leitura.map((l, i) => (
            <div key={i} className="flex gap-2 items-start bg-white rounded-xl p-3" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.06)' }}>
              <span className="text-xs mt-0.5" style={{ color }}>●</span>
              <p className="text-[11px] text-text flex-1">{l}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TopCriativos({ t, color }) {
  const medal = ['🥇', '🥈', '🥉', '4º', '5º']
  const maxCpr = Math.max(...t.criativos.map(c => c.cpr))
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">🏅</span>
        <div>
          <p className="text-sm font-extrabold text-text">Top 5 criativos — menor CPR</p>
          <p className="text-[11px] text-muted">Média do trimestre: {R2(t.cprMedio)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        {t.criativos.map((c, i) => {
          const vsMedia = ((c.cpr - t.cprMedio) / t.cprMedio) * 100
          return (
            <motion.div key={c.nome}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="px-5 py-3.5 flex items-center gap-3 flex-wrap"
              style={{ borderTop: i ? '1px solid #f1f3f9' : 'none' }}>
              <span className="text-base w-7 flex-shrink-0 text-center font-extrabold text-muted">{medal[i]}</span>
              <div className="flex-1 min-w-[180px]">
                <p className="text-xs font-extrabold text-text">{c.nome}</p>
                <p className="text-[10px] text-muted">{R2(c.investido)} · {c.conversas} conversas</p>
                <div className="mt-1.5 max-w-[220px]">
                  <BarraComparativa valor={maxCpr - c.cpr + 0.5} max={maxCpr} cor={color} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black" style={{ color: c.cpr <= t.cprMedio ? '#6eda2c' : '#ea8a29' }}>{R2(c.cpr)}</p>
                <p className="text-[10px] font-bold" style={{ color: vsMedia < 0 ? '#6eda2c' : '#ea8a29' }}>
                  {vsMedia < 0 ? '↓' : '↑'} {Math.abs(vsMedia).toFixed(0)}% vs média
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {t.criativosNota && (
        <div className="rounded-2xl p-3.5" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <p className="text-[11px] text-text">{t.criativosNota}</p>
        </div>
      )}
    </div>
  )
}

function ResumoVendas({ v, color }) {
  const maxEtapa = Math.max(...v.etapas.map(e => e.qtd))
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">💰</span>
        <p className="text-sm font-extrabold text-text">Vendas e faturamento do período</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="🛒" label="Ensaios fechados" value={v.fechados}          sub={`de ${v.oportunidades} oportunidades`} color="#6eda2c" />
        <KpiCard icon="💵" label="Faturamento"      value={R2(v.faturamento)}   sub="no trimestre"                         color={color} />
        <KpiCard icon="🎫" label="Ticket médio"     value={R2(v.ticket)}        sub="por ensaio"                           color="#a78bfa" />
        <KpiCard icon="📊" label="Taxa de fechamento" value={`${v.taxa}%`}      sub="1 em cada 3 orçamentos"               color="#60a5fa" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-xs font-extrabold text-text">📅 Vendas por mês</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Mês', 'Oportunidades', 'Fechados', 'Faturamento', 'Ticket médio'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {v.porMes.map(m => (
                <tr key={m.mes} style={{ borderBottom: '1px solid #f1f3f9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-text">{m.mes}</td>
                  <td className="px-4 py-3 text-muted text-xs">{m.opps}</td>
                  <td className="px-4 py-3 font-extrabold" style={{ color: '#6eda2c' }}>{m.fechados}</td>
                  <td className="px-4 py-3 font-bold text-text text-xs">{R2(m.faturamento)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(m.ticket)}</td>
                </tr>
              ))}
              <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
                <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
                <td className="px-4 py-3 font-bold text-muted">{v.oportunidades}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: '#6eda2c' }}>{v.fechados}</td>
                <td className="px-4 py-3 font-extrabold text-text">{R2(v.faturamento)}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: '#a78bfa' }}>{R2(v.ticket)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-xs font-extrabold text-text mb-3">🎯 Distribuição do funil</p>
        <div className="space-y-2.5">
          {v.etapas.map(e => (
            <div key={e.etapa}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-text">{e.etapa}</span>
                <span className="text-[11px] font-extrabold" style={{ color: e.cor }}>
                  {e.qtd} <span className="text-muted font-normal">({((e.qtd / v.oportunidades) * 100).toFixed(1)}%)</span>
                </span>
              </div>
              <BarraComparativa valor={e.qtd} max={maxEtapa} cor={e.cor} />
            </div>
          ))}
        </div>
      </div>

      {v.atribuicao && (
        <div className="rounded-2xl p-4" style={{ background: '#f7f8fc', border: '1px solid #e2e5f0' }}>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1">🌐 Origem dos leads</p>
          <p className="text-xs text-text">{v.atribuicao}</p>
        </div>
      )}
    </div>
  )
}

/* ── Resumo semanal (pauta de acompanhamento) ─── */
function ResumoSemanal({ r, color }) {
  const Th = ({ children }) => (
    <th className="text-left px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">{children}</th>
  )
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">📌</span>
        <div>
          <p className="text-sm font-extrabold text-text">Acompanhamento de Resultados</p>
          <p className="text-[11px] text-muted">{r.periodo}</p>
        </div>
      </div>

      {/* Google por semana */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-xs font-extrabold text-text">🟡 Google Ads por semana</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#f7f8fc' }}>{['Semana', 'Gasto', 'Cliques', 'Conv.', 'CPA'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {r.semanasGoogle.map(w => (
                <tr key={w.s} style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-2.5 font-bold text-text text-xs">{w.s}</td>
                  <td className="px-4 py-2.5 text-muted text-xs">{R2(w.gasto)}</td>
                  <td className="px-4 py-2.5 text-muted text-xs">{w.cliques}</td>
                  <td className="px-4 py-2.5 font-bold text-xs" style={{ color }}>{w.conv}</td>
                  <td className="px-4 py-2.5 font-bold text-xs" style={{ color: w.cpa < 40 ? '#6eda2c' : w.cpa < 80 ? '#ea8a29' : '#ef4444' }}>{R2(w.cpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads (GHL) por semana */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-xs font-extrabold text-text">🟢 Leads (GHL) por semana — criados × avanço</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#f7f8fc' }}>{['Semana', 'Criados', 'Ganhos', 'Avançaram', 'Parados', 'Perdidos'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {r.semanasGhl.map(w => (
                <tr key={w.s} style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-2.5 font-bold text-text text-xs">{w.s}</td>
                  <td className="px-4 py-2.5 text-text text-xs font-bold">{w.criados}</td>
                  <td className="px-4 py-2.5 text-xs font-bold" style={{ color: '#6eda2c' }}>{w.ganhos}</td>
                  <td className="px-4 py-2.5 text-xs font-bold" style={{ color }}>{w.avancaram}</td>
                  <td className="px-4 py-2.5 text-xs text-muted">{w.parados}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: '#ef4444' }}>{w.perdidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Origem */}
      <div className="rounded-2xl p-4" style={{ background: '#f7f8fc', border: '1px solid #e2e5f0' }}>
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1">🌐 Origem dos leads</p>
        <p className="text-xs text-text">{r.fonte}</p>
      </div>

      {/* Análise */}
      <div>
        <p className="text-sm font-extrabold text-text mb-2">🔎 Pontos de análise</p>
        <div className="space-y-2">
          {r.analise.map((a, i) => (
            <div key={i} className="flex gap-2 items-start bg-white rounded-xl p-3" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.06)' }}>
              <span className="text-xs mt-0.5" style={{ color }}>●</span>
              <p className="text-[11px] text-text flex-1">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Foco — leads que mais avançaram */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-xs font-extrabold text-text">🔥 Foco — leads que mais avançaram</p>
        </div>
        <div>
          {r.foco.map((f, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3 flex-wrap" style={{ borderTop: i ? '1px solid #f1f3f9' : 'none' }}>
              <div className="flex-1 min-w-[150px]">
                <p className="text-xs font-extrabold text-text">{f.lead}</p>
                <p className="text-[10px] text-muted">{f.estagio} · {f.fonte}</p>
              </div>
              <p className="text-xs font-black" style={{ color }}>{f.valor > 0 ? R2(f.valor) : '—'}</p>
              <p className="text-[11px] text-muted flex-1 min-w-[160px]">→ {f.acao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function AssessoriaResultados({ clientId, color = '#6eda2c' }) {
  const [plat, setPlat] = useState('total')
  const d = getClientData(clientId)

  if (!d) return <EmptyState color={color} />

  const heroInvest = plat === 'meta' ? d.meta.investimento : plat === 'google' ? d.google.investimento : d.totalInvest
  const heroLeads  = plat === 'meta' ? d.meta.leads        : plat === 'google' ? d.google.leads        : d.totalLeads
  const heroCpl    = plat === 'meta' ? d.meta.cpl          : plat === 'google' ? d.google.cpl          : d.cplMedio
  const heroLabel  = plat === 'meta' ? 'Meta Ads' : plat === 'google' ? 'Google Ads' : 'Meta Ads + Google Ads'

  return (
    <div className="space-y-5">

      {/* Seletor de plataforma */}
      <div className="flex items-center gap-1 rounded-2xl p-1 bg-white w-fit"
        style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
        {[
          { key: 'total',  label: '📊 Consolidado' },
          { key: 'meta',   label: '🔵 Meta Ads' },
          { key: 'google', label: '🟡 Google Ads' },
        ].map(t => (
          <button key={t.key} onClick={() => setPlat(t.key)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all"
            style={plat === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1a0a 0%, #132010 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-4"
            style={{ color: color + 'aa' }}>
            {heroLabel} · {d.periodo}
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Investimento</p>
              <p className="text-3xl font-black text-white">{R2(heroInvest)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Leads Gerados</p>
              <p className="text-3xl font-black" style={{ color }}>{N(heroLeads)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CPL Médio</p>
              <p className="text-3xl font-black text-white">{R2(heroCpl)}</p>
            </div>
            {plat === 'total' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Conversões</p>
                <p className="text-3xl font-black" style={{ color: '#a78bfa' }}>{d.totalConv}</p>
              </div>
            )}
            {plat === 'meta' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CTR</p>
                <p className="text-3xl font-black text-white">{d.meta.ctr}%</p>
              </div>
            )}
            {plat === 'google' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CPC</p>
                <p className="text-3xl font-black text-white">{R2(d.google.cpc)}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div key={plat} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {plat === 'total'  && <KpisTotal  d={d} color={color} />}
        {plat === 'meta'   && <KpisMeta   d={d} color={color} />}
        {plat === 'google' && <KpisGoogle d={d} color={color} />}
      </motion.div>

      {/* Tabela mensal */}
      {d.porMes.length > 0 && <TabelaMensal d={d} color={color} />}

      {/* Trimestre: evolução, criativos e vendas */}
      {d.trimestre && (
        <div className="space-y-6">
          <EvolucaoTrimestre t={d.trimestre} color={color} />
          <TopCriativos      t={d.trimestre} color={color} />
          <ResumoVendas      v={d.trimestre.vendas} color={color} />
        </div>
      )}

      {/* Resumo semanal / pauta de acompanhamento */}
      {d.resumo && <ResumoSemanal r={d.resumo} color={color} />}

      {/* Ações */}
      {d.acoes?.length > 0 && <Acoes acoes={d.acoes} />}

    </div>
  )
}
