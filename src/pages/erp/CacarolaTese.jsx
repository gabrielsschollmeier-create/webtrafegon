import { motion } from 'framer-motion'

const CPM       = 5.90
const CPMA      = 30.63
const FREQ_HIST = parseFloat((CPMA / CPM).toFixed(2)) // 5,19×
const FREQ_META = 7
const CPMA_META = parseFloat((CPM * FREQ_META).toFixed(2)) // 41,30

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
    obs: 'Campanha com histórico real — é a fonte primária do CPM e do CPMA usados em ambas as projeções.',
  },
  {
    emoji: '🍚', nome: 'Arroz Edição Especial', estado: 'PE', cidades: 97,
    budget: 1000, audiencia: 1990000, rmkt: 600000,
    cor: '#f59e0b',
    obs: 'Primeira campanha no estado — usa os mesmos indicadores históricos do SC como referência de CPM e CPMA.',
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
          detalhe: `CPM real: R$ ${CPM.toFixed(2).replace('.', ',')} · CPMA real: R$ ${CPMA.toFixed(2).replace('.', ',')} · Frequência gerada: ${FREQ_HIST}×. Esses são os únicos valores medidos diretamente — todo o restante é derivado a partir deles.`,
        },
        {
          label: 'Frequência histórica (5,19×)',
          valor: `Derivada: CPMA ÷ CPM = R$ ${CPMA.toFixed(2).replace('.', ',')} ÷ R$ ${CPM.toFixed(2).replace('.', ',')}`,
          detalhe: 'Não é meta — é o que a conta naturalmente gerou. Cada pessoa viu o anúncio em média 5,19× durante a campanha no SC. Esse valor ancora os cenários realistas (C1) de ambos os produtos.',
        },
        {
          label: 'Meta de frequência (7×)',
          valor: 'Limiar de recall espontâneo de marca — definido como objetivo de campanha',
          detalhe: `Abaixo de ${FREQ_META}×, o impacto tende a não consolidar memória de marca. O CPMA a essa freq é: CPM × ${FREQ_META} = R$ ${CPMA_META.toFixed(2).replace('.', ',')} — usado nos cenários de cobertura total.`,
        },
      ],
    },
    {
      emoji: '🧮',
      titulo: 'Como calculamos o alcance',
      cor: color,
      linhas: [
        {
          label: 'Fórmula principal',
          valor: `Alcance = Budget ÷ CPMA × 1.000`,
          detalhe: `O CPMA (R$ ${CPMA.toFixed(2).replace('.', ',')}) já embute a frequência — ele é o custo para alcançar 1.000 pessoas únicas. Dividir o orçamento pelo CPMA dá diretamente o número de pessoas, sem precisar passar por impressões.`,
        },
        {
          label: 'Exemplo — Mistura pra Bolo (R$ 4.000)',
          valor: `R$ 4.000 ÷ R$ ${CPMA.toFixed(2).replace('.', ',')} × 1.000 = ${fmt(Math.round(4000 / CPMA * 1000))} pessoas`,
          detalhe: 'Com R$ 2.000 por público (50/50): cada metade alcança o mesmo número de pessoas únicas — o que muda entre frio e rmkt é a frequência com que cada uma é impactada.',
        },
        {
          label: 'Exemplo — Arroz Edição Especial (R$ 1.000)',
          valor: `R$ 1.000 ÷ R$ ${CPMA.toFixed(2).replace('.', ',')} × 1.000 = ${fmt(Math.round(1000 / CPMA * 1000))} pessoas`,
          detalhe: 'Com R$ 500 por público (50/50): cada metade alcança o mesmo número de pessoas. O orçamento menor resulta em cobertura mais baixa — é o que o budget atual entrega.',
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
          detalhe: 'Aplicado cidade a cidade para as 97 cidades de SC e as 97 cidades de PE. Nenhum dado estadual agregado — o cálculo é granular por porte de cidade.',
        },
        {
          label: 'Taxa de penetração Meta por porte',
          valor: '>100K hab: 70% · 50–100K: 65% · 20–50K: 60% · 5–20K: 53%',
          detalhe: 'Cidades maiores têm maior acesso à internet e uso mais intenso de redes sociais. A penetração decai com o porte — padrão de uso do Meta no Brasil.',
        },
        {
          label: 'Pool de remarketing',
          valor: 'Pessoas que já interagiram com a Caçarola (engajamento, site, vídeo)',
          detalhe: 'SC: ~1,34M (conta com histórico ativo). PE: ~600K (estimativa conservadora — primeira campanha no estado).',
        },
      ],
    },
    {
      emoji: '🎯',
      titulo: 'Estrutura dos cenários',
      cor: '#ea8a29',
      linhas: [
        {
          label: 'C1 — Realista',
          valor: `Budget ÷ CPMA R$ ${CPMA.toFixed(2).replace('.', ',')} × 1.000 → alcance com freq histórica ${FREQ_HIST}×`,
          detalhe: 'Espelho do comportamento real da conta. O CPMA R$ 30,63 é o histórico medido — é o mais confiável. Mostra o que o orçamento atual entrega sem nenhuma presunção de melhora.',
        },
        {
          label: 'C2 — Otimista',
          valor: 'Orçamento maior, mesmo CPMA histórico — alcance cresce proporcionalmente',
          detalhe: `Mais verba ÷ mesmo CPMA = mais pessoas alcançadas. A relação é linear enquanto o CPMA se mantiver constante. Cada R$ ${CPMA.toFixed(2).replace('.', ',')} adicional alcança 1.000 pessoas a mais.`,
        },
        {
          label: 'C3 — Cobertura total (meta)',
          valor: `Budget = Audiência × CPMA_meta ÷ 1.000 · CPMA_meta = CPM × ${FREQ_META} = R$ ${CPMA_META.toFixed(2).replace('.', ',')}`,
          detalhe: `Calcula o investimento para que 100% do público (frio + rmkt) receba freq ${FREQ_META}× de exposição. CPMA_meta = R$ ${CPMA_META.toFixed(2).replace('.', ',')} porque cada pessoa precisa de ${FREQ_META} impressões em vez das ${FREQ_HIST}× históricas.`,
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
          Mistura pra Bolo e Arroz Edição Especial têm orçamentos e mercados distintos, mas as projeções de ambos seguem{' '}
          <strong>exatamente a mesma metodologia</strong>: <strong>Alcance = Budget ÷ CPMA × 1.000</strong>.
          O CPMA de R$ {CPMA.toFixed(2).replace('.', ',')} é o custo real para alcançar 1.000 pessoas únicas —
          medido diretamente no histórico da conta Caçarola.
        </p>
      </div>

      {/* Comparativo */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-extrabold text-text">⚖️ Os dois produtos lado a lado</p>
          <p className="text-[10px] text-muted mt-0.5">Mesma fórmula, inputs diferentes</p>
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
                { l: 'Orçamento',        v: brl(p.budget) },
                { l: 'Público frio',     v: fmt(p.audiencia) },
                { l: 'Pool rmkt',        v: fmt(p.rmkt) },
                { l: 'CPMA (base)',      v: `R$ ${CPMA.toFixed(2).replace('.', ',')}` },
                { l: 'Alcance total',    v: fmt(Math.round(p.budget / 2 / CPMA * 1000) + Math.round(p.budget / 2 / CPMA_META * 1000)) },
                { l: 'Alcance frio',     v: fmt(Math.round(p.budget / 2 / CPMA * 1000)) },
                { l: 'Alcance rmkt',     v: fmt(Math.round(p.budget / 2 / CPMA_META * 1000)) },
                { l: 'Freq histórica',   v: `${FREQ_HIST}×` },
                { l: 'Freq meta',        v: `${FREQ_META}×` },
                { l: 'CPMA (meta 7×)',   v: `R$ ${CPMA_META.toFixed(2).replace('.', ',')}` },
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
          CPM (R$ {CPM.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          CPMA (R$ {CPMA.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          Freq histórica ({FREQ_HIST}×) — <strong style={{ color: '#6eda2c' }}>derivada ✓</strong> ·{' '}
          Audiência PE (~1,99M) — <strong style={{ color }}>estimativa IBGE+Meta</strong>.{' '}
          Após 15–30 dias de campanha ativa no PE, o CPMA real deve confirmar ou ajustar as projeções.
        </p>
      </div>
    </div>
  )
}
