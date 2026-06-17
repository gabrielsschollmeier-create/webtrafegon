import { motion } from 'framer-motion'

/* Constantes históricas — mesma base usada em ambos os produtos */
const CPM_BLENDED  = 5.90
const CPM_FRIO     = 4.90
const CPM_RMKT     = 7.40
const CPMA_BLENDED = 30.63
const FREQ_HIST    = parseFloat((CPMA_BLENDED / CPM_BLENDED).toFixed(2)) // 5,19×
const FREQ_META    = 7

function brl(n) { return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K'
  return String(n)
}

const PRODUTOS = [
  {
    emoji: '🍰', nome: 'Mistura pra Bolo', estado: 'SC', cidades: 97,
    budget: 4000, audiencia: 3140000, rmkt: 1340000,
    cor: '#e84393',
    obs: 'Campanha com histórico real — é a fonte primária dos dados de CPM e frequência.',
  },
  {
    emoji: '🍚', nome: 'Arroz Edição Especial', estado: 'PE', cidades: 97,
    budget: 1000, audiencia: 1990000, rmkt: 600000,
    cor: '#f59e0b',
    obs: 'Primeira campanha no estado — usa o histórico do SC como referência. Após 15–30 dias, CPM real substitui a estimativa.',
  },
]

export default function CacarolaTese({ color }) {
  const blocos = [
    {
      emoji: '📡',
      titulo: 'De onde vêm os dados',
      cor: '#6eda2c',
      linhas: [
        {
          label: 'Fonte primária',
          valor: 'Histórico real da conta Caçarola — campanha SC Mistura pra Bolo (Meta Ads)',
          detalhe: `CPM real: R$ ${CPM_BLENDED.toFixed(2).replace('.', ',')} · CPMA real: R$ ${CPMA_BLENDED.toFixed(2).replace('.', ',')} · Frequência gerada: ${FREQ_HIST}×. Esses são os únicos valores medidos diretamente — todo o restante é derivado ou estimado a partir deles.`,
        },
        {
          label: 'Frequência histórica (5,19×)',
          valor: `Derivada: CPMA ÷ CPM = R$ ${CPMA_BLENDED.toFixed(2).replace('.', ',')} ÷ R$ ${CPM_BLENDED.toFixed(2).replace('.', ',')}`,
          detalhe: 'Não é meta — é o que a conta naturalmente gerou. Cada pessoa viu o anúncio em média 5,19× durante a campanha. Esse valor ancora os cenários realistas de ambos os produtos.',
        },
        {
          label: 'Meta de frequência (7×)',
          valor: 'Limiar de recall espontâneo de marca — definido como objetivo de campanha',
          detalhe: `Abaixo de ${FREQ_META}×, o impacto tende a não consolidar memória de marca. Acima disso, há rendimento decrescente — mais frequência compra menos pessoas novas pelo mesmo orçamento.`,
        },
      ],
    },
    {
      emoji: '✂️',
      titulo: 'Por que os dois públicos têm CPMs diferentes',
      cor: color,
      linhas: [
        {
          label: `CPM público frio: R$ ${CPM_FRIO.toFixed(2).replace('.', ',')}`,
          valor: `~17% abaixo do CPM blended (R$ ${CPM_BLENDED.toFixed(2).replace('.', ',')})`,
          detalhe: 'Público amplo, inexplorado e sem competição direta. O algoritmo do Meta tem espaço para encontrar impressões eficientes. É onde o orçamento rende mais em volume.',
        },
        {
          label: `CPM remarketing: R$ ${CPM_RMKT.toFixed(2).replace('.', ',')}`,
          valor: `~25% acima do CPM blended (R$ ${CPM_BLENDED.toFixed(2).replace('.', ',')})`,
          detalhe: 'Pool menor e disputado — múltiplos anunciantes segmentam o mesmo público quente ao mesmo tempo. O leilão fica mais concorrido, elevando o custo por impressão.',
        },
        {
          label: 'Validação matemática do split',
          valor: `Média harmônica de frio + rmkt = 2 ÷ (1/${CPM_FRIO.toFixed(2).replace('.', ',')} + 1/${CPM_RMKT.toFixed(2).replace('.', ',')}) = R$ 5,90 ✓`,
          detalhe: 'Com distribuição 50/50 de verba entre os dois públicos, os dois CPMs estimados reconstituem exatamente o CPM blended histórico. Isso valida a coerência interna da divisão.',
        },
      ],
    },
    {
      emoji: '🗺️',
      titulo: 'Como estimamos as audiências',
      cor: '#60a5fa',
      linhas: [
        {
          label: 'Base populacional',
          valor: 'IBGE Censo 2022 — população residente por município',
          detalhe: 'Aplicado cidade a cidade para cada uma das 97 cidades de SC e as 97 cidades de PE. Nenhum dado agregado estadual — o cálculo é granular.',
        },
        {
          label: 'Taxa de penetração Meta por porte',
          valor: '>100K hab: 70% · 50–100K: 65% · 20–50K: 60% · 5–20K: 53%',
          detalhe: 'Cidades maiores têm maior acesso à internet e uso mais intenso de redes sociais. A penetração decai com o porte — padrão observado em dados públicos de uso do Meta no Brasil.',
        },
        {
          label: 'Pool de remarketing',
          valor: 'Estimativa de audiência que já interagiu com a Caçarola (engajamento, site, vídeo)',
          detalhe: 'Para SC: ~1,34M (conta com histórico). Para PE: ~600K (estimativa conservadora para primeira campanha no estado).',
        },
      ],
    },
    {
      emoji: '🎯',
      titulo: 'Como os cenários são construídos',
      cor: '#ea8a29',
      linhas: [
        {
          label: 'C1 — Realista',
          valor: `CPMA blended histórico: R$ ${CPMA_BLENDED.toFixed(2).replace('.', ',')} (freq ${FREQ_HIST}×)`,
          detalhe: 'Espelho direto do comportamento real da conta. Mostra o que o orçamento atual entrega mantendo a frequência que o algoritmo já demonstrou gerar organicamente.',
        },
        {
          label: 'C2 — Otimista',
          valor: 'Orçamento maior, mesma frequência histórica — alcance cresce proporcionalmente',
          detalhe: 'Mais verba compra mais impressões e, mantida a frequência, alcança mais pessoas novas. A lógica é linear porque o CPM e a freq são mantidos constantes.',
        },
        {
          label: 'C3 — Cobertura total (meta)',
          valor: `CPMA com freq ${FREQ_META}× — frio R$ ${(CPM_FRIO * FREQ_META).toFixed(2).replace('.', ',')} · rmkt R$ ${(CPM_RMKT * FREQ_META).toFixed(2).replace('.', ',')}`,
          detalhe: `Calcula o investimento necessário para que 100% do público (frio + rmkt) veja o anúncio pelo menos ${FREQ_META} vezes. É a meta estratégica de saturação de mercado — não o orçamento atual.`,
        },
      ],
    },
  ]

  return (
    <div className="space-y-5">

      {/* Intro */}
      <div className="rounded-2xl p-5" style={{ background: color + '08', border: `1.5px solid ${color}25` }}>
        <p className="text-sm font-extrabold text-text mb-2">📋 A lógica por trás das projeções</p>
        <p className="text-[11px] text-muted leading-relaxed">
          Mistura pra Bolo e Arroz Edição Especial são produtos diferentes, com orçamentos e mercados distintos —
          mas as projeções de ambos seguem <strong>exatamente a mesma metodologia</strong>.
          A base são dados reais da conta Caçarola. O que ainda não tem histórico é estimado com critério explícito e validado matematicamente.
        </p>
      </div>

      {/* Comparativo dos dois produtos */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-extrabold text-text">⚖️ Os dois produtos lado a lado</p>
          <p className="text-[10px] text-muted mt-0.5">Mesma lógica, inputs diferentes</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border">
          {PRODUTOS.map((p, i) => (
            <div key={i} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{p.emoji}</span>
                <div>
                  <p className="text-xs font-extrabold text-text">{p.nome}</p>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: p.cor + '18', color: p.cor }}>{p.estado} · {p.cidades} cidades</span>
                </div>
              </div>
              {[
                { l: 'Orçamento',       v: brl(p.budget) },
                { l: 'Público frio',    v: fmt(p.audiencia) },
                { l: 'Pool rmkt',       v: fmt(p.rmkt) },
                { l: 'CPM base',        v: `R$ ${CPM_BLENDED.toFixed(2).replace('.', ',')}` },
                { l: 'CPM frio est.',   v: `R$ ${CPM_FRIO.toFixed(2).replace('.', ',')}` },
                { l: 'CPM rmkt est.',   v: `R$ ${CPM_RMKT.toFixed(2).replace('.', ',')}` },
                { l: 'Freq histórica',  v: `${FREQ_HIST}×` },
                { l: 'Freq meta',       v: `${FREQ_META}×` },
              ].map((r, j) => (
                <div key={j} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <p className="text-[10px] text-muted">{r.l}</p>
                  <p className="text-[11px] font-extrabold text-text">{r.v}</p>
                </div>
              ))}
              <p className="text-[9px] text-muted mt-3 leading-relaxed">{p.obs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blocos metodológicos */}
      {blocos.map((b, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="px-5 py-4 border-b border-border flex items-center gap-2"
            style={{ background: `linear-gradient(90deg, ${b.cor}08 0%, transparent 100%)` }}>
            <span>{b.emoji}</span>
            <p className="text-sm font-extrabold text-text">{b.titulo}</p>
          </div>
          <div className="divide-y divide-border">
            {b.linhas.map((l, j) => (
              <div key={j} className="px-5 py-4">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mb-1.5"
                  style={{ background: b.cor + '15', color: b.cor }}>{l.label}</span>
                <p className="text-[12px] font-bold text-text mb-1">{l.valor}</p>
                <p className="text-[10px] text-muted leading-relaxed">{l.detalhe}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Rodapé */}
      <div className="rounded-xl p-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
        <p className="text-[10px] text-muted leading-relaxed">
          <strong>Grau de certeza por variável:</strong>{' '}
          CPM blended (R$ {CPM_BLENDED.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          CPMA blended (R$ {CPMA_BLENDED.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          Freq histórica ({FREQ_HIST}×) — <strong style={{ color: '#6eda2c' }}>derivada ✓</strong> ·{' '}
          CPM frio/rmkt (R$ {CPM_FRIO.toFixed(2).replace('.', ',')} / R$ {CPM_RMKT.toFixed(2).replace('.', ',')}) — <strong style={{ color }}>estimativa validada</strong> ·{' '}
          Audiência PE (~1,99M) — <strong style={{ color }}>estimativa IBGE+Meta</strong>.{' '}
          Após 15–30 dias de campanha ativa no PE, os valores reais devem substituir as estimativas desta tese.
        </p>
      </div>
    </div>
  )
}
