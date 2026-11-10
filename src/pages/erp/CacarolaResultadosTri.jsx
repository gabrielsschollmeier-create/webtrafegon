import { motion } from 'framer-motion'
import { Tv, Smartphone, MapPin, Users, Sparkles, Info } from 'lucide-react'

const shadow = '0 2px 14px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.05)'
const YT = '#e11d48'
const META = '#1877f2'

const PAINEL = [
  { k: 'Investimento',          yt: 'R$ 5.761',            meta: 'R$ 8.668',               tot: 'R$ 14.429' },
  { k: 'Exibições',             yt: '1,33 mi',             meta: '2,54 mi',                tot: '3,87 mi' },
  { k: 'Pessoas alcançadas',    yt: '~900 mil',            meta: '764 mil',                tot: '~1,7 mi de contatos ¹' },
  { k: 'Frequência ²',          yt: '1,3',                 meta: '3,3',                    tot: '' },
  { k: 'CPM ³',                 yt: 'R$ 4,32',             meta: 'R$ 3,42',                tot: '' },
  { k: 'Custo por mil pessoas ⁴', yt: 'R$ 5,54 – 5,89',   meta: 'R$ 11,35',               tot: '' },
  { k: 'Engajamento',           yt: '58,6% de visualização ⁵ · 55% até o fim ⁶', meta: '45,4% ⁷', tot: '' },
  { k: 'Custo unitário',        yt: 'R$ 0,008 por visualização', meta: 'R$ 0,0075 por engajamento', tot: '' },
  { k: 'Onde',                  yt: '90% na TV da sala',   meta: 'Feed e celular',         tot: '' },
]

const NOTAS_PAINEL = [
  '¹ Contatos: soma das pessoas alcançadas nos dois canais. Parte delas foi impactada nos dois, então o número de pessoas diferentes é menor.',
  '² Frequência: quantas vezes, em média, cada pessoa viu a marca no período.',
  '³ CPM: quanto custa mostrar o anúncio 1.000 vezes.',
  '⁴ Custo por mil pessoas: quanto custa alcançar 1.000 pessoas diferentes. Diferente do CPM, conta pessoas, não exibições.',
  '⁵ Taxa de visualização: de cada 100 vezes que o vídeo apareceu, em quantas a pessoa assistiu pelo menos 30 segundos (ou o vídeo inteiro).',
  '⁶ Até o fim: de cada 100 vezes que o vídeo apareceu, em quantas a pessoa assistiu até o último segundo.',
  '⁷ Engajamento no Meta: reações, comentários, compartilhamentos, cliques e reproduções do vídeo, divididos pelas exibições.',
]

const YT_TABELA = {
  cols: ['Bahia', 'SC (filme de 45s)', 'SC (cortes de 6s) ⁸'],
  rows: [
    ['Investimento', 'R$ 2.565 (+ R$ 344 de remarketing ⁹)', 'R$ 2.060', 'R$ 793'],
    ['Pessoas', '463 mil', '350 mil', '88 – 245 mil ¹⁰'],
    ['Taxa de visualização', '57,6%', '59,8%', '—'],
    ['Assistiram até o fim', '54%', '56%', '66%'],
    ['Custo por mil vídeos completos', 'R$ 8,41', 'R$ 8,38', 'R$ 4,04'],
    ['Horas assistidas', '4.756 h', '3.758 h', '—'],
  ],
  notas: [
    '⁸ Cortes de 6s: versões curtas do filme, que não podem ser puladas. Rodam desde 07/10 na Grande Florianópolis. Como não dá para pular, o Google não conta "visualização" nesse formato; o indicador certo é a conclusão.',
    '⁹ Remarketing: anúncio mostrado de novo para quem já interagiu com os vídeos.',
    '¹⁰ As três campanhas de cortes rodam na mesma região, e uma mesma pessoa pode ter sido alcançada por mais de uma. Por isso o número real fica nessa faixa.',
  ],
}

const RETENCAO = [
  { l: 'Início', v: 100 }, { l: '25% (~11s)', v: 71 }, { l: '50% (~22s)', v: 62 }, { l: '75% (~34s)', v: 58 }, { l: 'Fim', v: 55 },
]

const YT_INSIGHTS = [
  ['O filme prende.', 'Cada exibição foi assistida, em média, por 30 dos 45 segundos. Depois da metade, quase ninguém sai: a perda até o fim é de só 7 pontos. A decisão acontece nos primeiros 11 segundos, quando saem 29% das pessoas.'],
  ['A TV é o palco.', 'Ela concentrou 90% das exibições, com 57% de conclusão. No celular, cada vídeo completo custa 2,8 vezes mais.'],
  ['O horário nobre engaja menos', '(cerca de 50% até o fim): a TV disputa atenção com a novela e o jantar. De madrugada e de manhã a atenção é maior (64% até o fim) e o custo é menor.'],
  ['O filme funciona para todas as idades,', 'com conclusão entre 54% e 58% em todas as faixas. As mulheres são a maior fatia: 45% das exibições e 57% de conclusão.'],
  ['O corte de 6s que mais prende é o VT 02,', '"Nunca passou pela minha cabeça abandonar essa cultura", com 69% até o fim.'],
  ['Quem gosta de cozinhar engaja mais.', 'Nos cortes, o público "Entusiastas de culinária" chega a 73% de conclusão, contra 41% de "Compradores de supermercado".'],
  ['A mídia ficou mais barata sem cansar o público.', 'O CPM caiu 18% na BA e 24% em SC, e a conclusão ficou estável por 3 meses com um único filme.'],
  ['Ponto a evoluir:', 'a frequência ficou em 1,3. Alcançamos muita gente, mas com pouca repetição.'],
]

const META_TABELA = [
  ['Investimento', 'R$ 4.338', 'R$ 4.330'],
  ['Pessoas', '362 mil', '401 mil'],
  ['Frequência', '3,4', '3,2'],
  ['Engajamento', '50,9%', '40,1%'],
  ['Custo por engajamento', 'R$ 0,0069', 'R$ 0,0083'],
]

const CRIATIVOS = [
  { n: '"Três famílias viram seus próprios rostos"', verba: 5.6, eng: 64, obs: 'até 70,5% em SC' },
  { n: '"O Ismael acorda cedo"', verba: 2.5, eng: 52 },
  { n: '"Algo novo está chegando… dose dupla"', verba: 4.0, eng: 51 },
  { n: '"Família Cardoso viu pela primeira vez"', verba: 60.7, eng: 48 },
  { n: '"Origem do Amor" (institucional)', verba: 25.6, eng: 36 },
]

const META_INSIGHTS = [
  ['A frequência de 3,3 está na faixa ideal:', 'é a partir de 3 exposições que a marca começa a ser lembrada.'],
  ['O criativo que mais engaja recebeu só 5,6% da verba.', ''],
  ['O mesmo filme se comporta diferente em cada canal:', 'na TV, 55% assistem até o fim; no feed, o engajamento é de 36%.'],
  ['Todos os anúncios receberam qualidade "Acima da média",', 'que é a avaliação do próprio Meta sobre o criativo.'],
]

const REGIOES = [
  { r: 'BA – Salvador e Recôncavo',          p: '177 mil',      fim: '54%', c: 'R$ 4,83', mp: '134 mil', me: '37 – 40%', destaque: ['p', 'c'] },
  { r: 'BA – Cacaueira e Baixo Sul',         p: '137 mil',      fim: '53%', c: 'R$ 6,25', mp: '182 mil', me: '38 – 41%' },
  { r: 'BA – Extremo Sul',                   p: '149 mil',      fim: '54%', c: 'R$ 5,73', mp: '123 mil', me: '41 – 43%', destaque: ['me'] },
  { r: 'SC – Leste (litoral e vale)',        p: '203 mil',      fim: '57%', c: 'R$ 5,08', mp: '362 mil (estado todo) ¹¹', me: '50 – 51%', destaque: ['p', 'fim', 'me'] },
  { r: 'SC – Oeste e Serra',                 p: '147 mil',      fim: '55%', c: 'R$ 6,99', mp: '', me: '' },
  { r: 'SC – Grande Florianópolis (cortes 6s)', p: '88 – 245 mil', fim: '66%', c: 'R$ 3,23', mp: '', me: '', destaque: ['c'] },
]

const REGIAO_INSIGHTS = [
  ['SC – Leste é a região campeã.', 'Tem o maior alcance (203 mil pessoas), a maior conclusão (57%) e a entrega mais bem distribuída: Joinville, Florianópolis, Blumenau, Criciúma, Itajaí e Balneário Camboriú.'],
  ['O Extremo Sul é a região mais engajada da Bahia nos dois canais.', 'Porto Seguro e Trancoso têm as maiores taxas de visualização do estado (60–62%), e o Meta tem ali seu maior engajamento na BA (43%).'],
  ['Salvador e Recôncavo têm o alcance mais barato da campanha,', 'R$ 4,83 por mil pessoas. Por outro lado, é onde o Meta engaja menos, porque o filme institucional recebeu 57% da verba ali.'],
  ['A diferença entre BA e SC no Meta vem mais do criativo do que do público.', 'Com o mesmo vídeo (família Cardoso), a diferença é de só 4 pontos (45,5% contra 49,7%). A diferença total chega a 11 pontos porque a BA recebeu 43% da verba no institucional, contra 8% em SC.'],
]

const CRUZADOS = [
  [Tv, 'Cada tela pede um formato.', 'A história longa funciona na TV, e as famílias reais funcionam no celular.'],
  [Users, 'As pessoas são a mensagem.', 'O depoimento do produtor vence no YouTube, e as famílias vencem no Meta. O conceito "Amor Cultivado" funciona quando tem rosto.'],
  [Smartphone, 'Alcance de um lado, repetição do outro.', 'O YouTube apresenta a marca para muita gente (frequência 1,3), e o Meta faz essas pessoas lembrarem (3,3).'],
  [Sparkles, 'Receita e preparo são um caminho criativo forte,', 'porque o público que cozinha é o que mais engaja.'],
]

function Card({ children, delay = 0, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`bg-white rounded-3xl p-5 lg:p-6 ${className}`} style={{ boxShadow: shadow }}
    >
      {children}
    </motion.section>
  )
}

function Titulo({ cor, children, sub }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: cor }} />
        <h3 className="text-base font-extrabold text-text">{children}</h3>
      </div>
      {sub && <p className="text-xs text-muted mt-0.5 ml-4">{sub}</p>}
    </div>
  )
}

function Notas({ itens }) {
  return (
    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1">
      {itens.map(t => <p key={t} className="text-[11px] leading-relaxed text-muted">{t}</p>)}
    </div>
  )
}

function Lista({ itens, cor }) {
  return (
    <ul className="flex flex-col gap-2.5 mt-4">
      {itens.map(([b, t]) => (
        <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-text">
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cor }} />
          <span><strong className="font-bold">{b}</strong> {t}</span>
        </li>
      ))}
    </ul>
  )
}

function Tabela({ head, rows, destaqueCol }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className={`text-[11px] font-bold uppercase tracking-wider text-muted pb-2 px-2 ${i ? 'text-right' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-slate-100">
              {r.map((c, ci) => (
                <td key={ci} className={`py-2.5 px-2 tabular-nums ${ci ? 'text-right' : 'text-left font-semibold text-text'} ${destaqueCol === ci ? 'font-extrabold text-text' : ci ? 'text-slate-600' : ''}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pilula({ label, valor }) {
  return (
    <div className="rounded-xl px-3 py-1.5 bg-white/15 backdrop-blur flex items-baseline gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/75">{label}</span>
      <span className="text-sm font-black tabular-nums">{valor}</span>
    </div>
  )
}

export default function CacarolaResultadosTri({ color = '#f87171' }) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 lg:p-7 text-white"
        style={{ background: `linear-gradient(135deg, ${color}, #ea580c 55%, #7c2d12)` }}
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">Caçarola · Arroz Edição Especial</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">Resultados BA e SC · 1º Trimestre</h2>
            <p className="text-xs text-white/80 mt-1">YouTube 24/07 a 23/10 (92 dias) · Meta 24/08 a 23/10 (61 dias)</p>
            <p className="text-xs text-white/80">Objetivo: engajamento (primário) e alcance (secundário)</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/75">Investimento</p>
            <p className="text-3xl lg:text-4xl font-black tabular-nums">R$ 14.429</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <Pilula label="Exibições" valor="3,87 mi" />
          <Pilula label="Contatos" valor="~1,7 mi" />
          <Pilula label="Horas assistidas" valor="8.735 h" />
          <Pilula label="Até o fim" valor="55%" />
          <Pilula label="Engajamentos Meta" valor="1,15 mi" />
          <Pilula label="Frequência Meta" valor="3,3" />
        </div>
      </motion.div>

      <Card delay={0.05}>
        <Titulo cor={color}>Resumo</Titulo>
        <Lista cor={color} itens={[
          ['R$ 14.429', 'investidos nos dois canais.'],
          ['3,87 milhões de exibições', 'e cerca de 1,7 milhão de contatos com pessoas.'],
          ['No YouTube,', 'a história da Caçarola foi assistida por 8.735 horas, e 55% de quem começou o vídeo assistiu até o fim.'],
          ['No Meta,', 'foram 1,15 milhão de engajamentos, e cada pessoa viu a marca 3,3 vezes.'],
          ['Os canais se completam:', 'o YouTube gera atenção e alcance barato, e o Meta gera repetição e interação.'],
          ['Santa Catarina responde melhor nos dois canais.', ''],
        ]} />
      </Card>

      <Card delay={0.1}>
        <Titulo cor={color}>Painel geral</Titulo>
        <Tabela head={['', 'YouTube', 'Meta', 'Total']} rows={PAINEL.map(p => [p.k, p.yt, p.meta, p.tot])} destaqueCol={3} />
        <Notas itens={NOTAS_PAINEL} />
      </Card>

      <Card delay={0.15}>
        <Titulo cor={YT} sub="Atenção">YouTube</Titulo>
        <Tabela head={['Indicador', ...YT_TABELA.cols]} rows={YT_TABELA.rows} />
        <Notas itens={YT_TABELA.notas} />

        <div className="mt-6">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Quanto do filme de 45s as pessoas assistem</p>
          <div className="flex items-end gap-2 sm:gap-4 h-40">
            {RETENCAO.map((r, i) => (
              <div key={r.l} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-sm font-black tabular-nums text-text">{r.v}%</span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${r.v}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                  className="w-full rounded-t-xl" style={{ background: `linear-gradient(180deg, ${YT}, ${YT}99)` }}
                />
                <span className="text-[10px] sm:text-[11px] text-muted text-center leading-tight">{r.l}</span>
              </div>
            ))}
          </div>
        </div>

        <Lista cor={YT} itens={YT_INSIGHTS} />
      </Card>

      <Card delay={0.2}>
        <Titulo cor={META} sub="Repetição e interação">Meta</Titulo>
        <Tabela head={['Indicador', 'Santa Catarina', 'Bahia']} rows={META_TABELA} />

        <p className="text-xs font-bold text-muted uppercase tracking-wider mt-6 mb-3">Famílias reais vencem o institucional</p>
        <div className="flex flex-col gap-3">
          {CRIATIVOS.map((c, i) => (
            <div key={c.n}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-semibold text-text">{c.n}</span>
                <span className="text-xs text-muted whitespace-nowrap">{c.verba.toFixed(1).replace('.', ',')}% da verba</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-6 rounded-lg bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${c.eng / 70 * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }}
                    className="h-full rounded-lg" style={{ background: i === 0 ? META : META + '88' }}
                  />
                </div>
                <span className="w-24 text-right text-sm font-black tabular-nums text-text">{c.eng}%{c.obs && <span className="block text-[10px] font-semibold text-muted">{c.obs}</span>}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-2">Barra = taxa de engajamento de cada criativo.</p>

        <Lista cor={META} itens={META_INSIGHTS} />
      </Card>

      <Card delay={0.25}>
        <Titulo cor={color}>Por região</Titulo>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="text-left pb-2 px-2">Região</th>
                <th className="text-right pb-2 px-2" style={{ color: YT }}>YouTube: pessoas</th>
                <th className="text-right pb-2 px-2" style={{ color: YT }}>Até o fim</th>
                <th className="text-right pb-2 px-2" style={{ color: YT }}>Custo/mil pessoas</th>
                <th className="text-right pb-2 px-2" style={{ color: META }}>Meta: pessoas</th>
                <th className="text-right pb-2 px-2" style={{ color: META }}>Engajamento</th>
              </tr>
            </thead>
            <tbody>
              {REGIOES.map(r => {
                const b = k => r.destaque?.includes(k) ? 'font-extrabold text-text' : 'text-slate-600'
                return (
                  <tr key={r.r} className="border-t border-slate-100 tabular-nums">
                    <td className="py-2.5 px-2 font-semibold text-text"><MapPin size={12} className="inline mr-1 -mt-0.5 text-muted" />{r.r}</td>
                    <td className={`py-2.5 px-2 text-right ${b('p')}`}>{r.p}</td>
                    <td className={`py-2.5 px-2 text-right ${b('fim')}`}>{r.fim}</td>
                    <td className={`py-2.5 px-2 text-right ${b('c')}`}>{r.c}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{r.mp}</td>
                    <td className={`py-2.5 px-2 text-right ${b('me')}`}>{r.me}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Notas itens={['¹¹ No Meta, os grupos de Santa Catarina foram montados por ordem alfabética de cidades, e não por região. Por isso, em SC, o Meta só pode ser lido para o estado como um todo.']} />
        <p className="text-xs font-bold text-muted uppercase tracking-wider mt-5">Principais insights</p>
        <Lista cor={color} itens={REGIAO_INSIGHTS} />
      </Card>

      <Card delay={0.3}>
        <Titulo cor={color}>Insights que cruzam os dois canais</Titulo>
        <div className="grid sm:grid-cols-2 gap-3">
          {CRUZADOS.map(([Icon, t, d]) => (
            <div key={t} className="rounded-2xl p-4" style={{ background: color + '0f', border: `1px solid ${color}25` }}>
              <Icon size={18} style={{ color }} />
              <p className="text-sm font-extrabold text-text mt-2">{t}</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1.5 pb-2">
        <Info size={12} /> Fontes: Google Ads (YouTube) e Gerenciador de Anúncios do Meta.
      </p>
    </div>
  )
}
