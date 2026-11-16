import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Users, Sparkles, ThumbsUp as Facebook, LayoutGrid, Trophy, Heart, Wallet, Target, Video, Megaphone,
} from 'lucide-react'
import {
  META, GLOSSARIO, Dica, Painel, Cabecalho, Kpi, Barra, Insight, Grade, TopoResultados, AbasResultados,
} from './CacarolaResultadosTri'

const G = {
  ...GLOSSARIO,
  contatos: 'Soma das pessoas alcançadas em cada campanha. Uma mesma pessoa pode ter sido alcançada por mais de uma, então o número de pessoas diferentes é menor.',
  thruplay: 'Vídeo assistido até o fim, ou por pelo menos 15 segundos.',
  fimVideo: 'De quem começou a assistir o vídeo, quantos foram até o último segundo.',
  estatico: 'Peça estática gera alcance, mas quase nenhum engajamento, porque não tem reprodução de vídeo.',
  interesse: 'Público escolhido pelo que a pessoa gosta (culinária, gastronomia, restaurantes), e não pela cidade onde mora.',
  remarketing: 'Anúncio mostrado de novo para quem já interagiu com a marca.',
}

const ABAS = [
  { id: 'geral',   label: 'Visão geral',          icon: LayoutGrid },
  { id: 'meta',    label: 'Campanhas e criativos', icon: Facebook },
  { id: 'regioes', label: 'Público e regiões',    icon: MapPin },
]

function Lista({ itens, cor }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {itens.map(([b, t], i) => (
        <li key={b} className="flex gap-3">
          <span className="w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: cor + '1a', color: cor }}>{i + 1}</span>
          <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-text font-bold">{b}</strong> {t}</p>
        </li>
      ))}
    </ul>
  )
}

function Indicador({ label, valor, dica }) {
  return (
    <div className="flex justify-between gap-3 py-3 border-t border-slate-100 first:border-t-0 text-sm">
      <span className="font-semibold text-slate-600">{label}{dica && <Dica texto={dica} />}</span>
      <span className="font-bold tabular-nums text-text text-right">{valor}</span>
    </div>
  )
}

function VisaoGeral({ cor }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Painel className="xl:col-span-2">
          <Cabecalho titulo="Indicadores do trimestre" sub="Meta · 01/01 a 31/03" cor={META} icon={LayoutGrid} />
          <Indicador label="Investimento" valor="R$ 1.315" />
          <Indicador label="Exibições" dica={G.exibicoes} valor="1,08 mi" />
          <Indicador label="Pessoas alcançadas" dica={G.contatos} valor="~438 mil" />
          <Indicador label="Frequência" dica={G.frequencia} valor="2,5" />
          <Indicador label="CPM" dica={G.cpm} valor="R$ 1,22" />
          <Indicador label="Custo por mil pessoas" dica={G.custoPessoa} valor="R$ 3,00" />
          <Indicador label="Engajamento" dica={G.engMeta} valor="2,7% · 28,9 mil" />
          <Indicador label="ThruPlays" dica={G.thruplay} valor="5,7 mil" />
        </Painel>

        <div className="xl:col-span-3 flex flex-col gap-5">
          <Painel delay={0.05}>
            <Cabecalho titulo="Resumo" sub="O trimestre em 5 pontos" cor={cor} icon={Sparkles} />
            <Lista cor={cor} itens={[
              ['R$ 1.315', 'investidos no lançamento da linha de arroz especial.'],
              ['1,08 milhão de exibições', 'e cerca de 438 mil contatos com pessoas, a R$ 3,00 por mil pessoas.'],
              ['A Edição Especial estreou', 'e alcançou 154 mil pessoas em 10 dias, com o alcance mais barato do trimestre.'],
              ['O vídeo gerou o engajamento:', '5% contra 0,1% das peças estáticas.'],
              ['Santa Catarina', 'foi o estado que mais engajou.'],
            ]} />
          </Painel>
          <Painel delay={0.1}>
            <Cabecalho titulo="Análise do trimestre" cor={cor} icon={Target} />
            <p className="text-sm text-slate-600 leading-relaxed">
              O trimestre foi de <strong className="text-text">apresentação da linha de arroz especial</strong>. Com verba enxuta, a marca chegou a cerca de 438 mil pessoas a um custo baixo, de R$ 3 por mil pessoas.
              As peças estáticas cumpriram o papel de alcance, e os vídeos concentraram o engajamento, com destaque para <strong className="text-text">"Disponível nos melhores supermercados"</strong>.
              Em Santa Catarina, a segmentação por interesse (culinária e gastronomia) alcançou mais barato e engajou mais que a segmentação por cidade, e o público acima de 45 anos se mostrou o mais receptivo.
              Esses aprendizados orientaram a escala do trimestre seguinte.
            </p>
          </Painel>
        </div>
      </div>

      <Grade>
        <Insight cor={cor} icon={Video} titulo="O vídeo gera o engajamento" texto="Os vídeos engajaram 5,0%, contra 0,1% das peças estáticas: 50 vezes mais." />
        <Insight cor={cor} icon={Wallet} titulo="Edição Especial: alcance mais barato" texto="R$ 2,41 por mil pessoas. Só em Manaus, foram 99 mil pessoas com R$ 200." />
        <Insight cor={cor} icon={Target} titulo="Interesse alcança mais barato" texto="Em SC, culinária e gastronomia custaram de R$ 1,45 a R$ 2,08 por mil pessoas, contra R$ 2,95 a R$ 3,94 por cidade na BA." />
        <Insight cor={cor} icon={Users} titulo="Acima de 45 anos engaja mais" texto="O engajamento chega a 4,0% entre 55 e 64 anos, contra 1,8% entre 25 e 34." />
      </Grade>
    </div>
  )
}

function CampanhasAba() {
  const campanhas = [
    { t: 'Risoto · BA e ES', inv: 'R$ 473', p: '143 mil', f: '2,8', c: 'R$ 3,30', e: '3,4%' },
    { t: 'Lançamento Dupla de Arroz · SC', inv: 'R$ 470', p: '141 mil', f: '2,7', c: 'R$ 3,33', e: '3,8%' },
    { t: 'Lançamento Edição Especial · BA e Manaus', inv: 'R$ 372', p: '154 mil', f: '1,9', c: 'R$ 2,41', e: '0,1%', dicaE: G.estatico, selo: 'Alcance mais barato' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Grade cols="sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Pessoas alcançadas" valor="~438 mil" sub="R$ 3,00 por mil pessoas" dica={G.contatos} cor={META} destaque />
        <Kpi label="Frequência" valor="2,5" sub="vezes por pessoa" dica={G.frequencia} cor={META} destaque />
        <Kpi label="CPM" valor="R$ 1,22" sub="1,08 mi de exibições" dica={G.cpm} cor={META} />
        <Kpi label="Engajamento" valor="2,7%" sub="28,9 mil engajamentos" dica={G.engMeta} cor={META} />
      </Grade>

      <Grade cols="lg:grid-cols-3">
        {campanhas.map((c, i) => (
          <Painel key={c.t} delay={0.05 * i}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-sm font-extrabold text-text">{c.t}</p>
              {c.selo && <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap" style={{ background: META + '14', color: META }}>{c.selo}</span>}
            </div>
            <p className="text-3xl font-black tabular-nums text-text">{c.p}</p>
            <p className="text-xs text-muted mb-4">pessoas alcançadas<Dica texto={G.alcance} /></p>
            {[
              ['Investimento', c.inv],
              ['Frequência', c.f, G.frequencia],
              ['Custo por mil pessoas', c.c, G.custoPessoa],
              ['Engajamento', c.e, c.dicaE || G.engMeta],
            ].map(([k, v, d]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-t border-slate-100 text-sm">
                <span className="text-slate-600">{k}{d && <Dica texto={d} />}</span>
                <span className="font-bold tabular-nums text-text">{v}</span>
              </div>
            ))}
          </Painel>
        ))}
      </Grade>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Painel>
          <Cabecalho titulo="Engajamento por formato" sub="Taxa de engajamento" cor={META} icon={Megaphone} />
          <div className="flex flex-col gap-4">
            <Barra label="Vídeo · 51% da verba" valor={5.0} max={6} cor={META} forte />
            <Barra label="Carrossel · 8% da verba" valor={0.1} max={6} cor={META} />
            <Barra label="Estático · 41% da verba" valor={0.1} max={6} cor={META} />
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">As peças estáticas cumprem o papel de alcance; o engajamento vem dos vídeos.<Dica texto={G.estatico} /></p>
        </Painel>
        <Painel delay={0.05}>
          <Cabecalho titulo="Vídeos que mais prenderam" sub="De quem começou a assistir, quantos foram até o fim" cor={META} icon={Trophy} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Disponível nos melhores supermercados" valor={48} max={50} cor={META} forte />
            <Barra label="Vontade de comer Risoto" valor={25} max={50} cor={META} />
            <Barra label="Hoje você merece" valor={25} max={50} cor={META} />
            <Barra label="Teaser" valor={9} max={50} cor={META} />
            <Barra label="Risoto de camarão completo" valor={2} max={50} cor={META} />
            <Barra label="Experimente o novo arroz especial" valor={1} max={50} cor={META} />
          </div>
          <p className="text-xs text-muted mt-3">Média dos vídeos: 17%.<Dica texto={G.fimVideo} /></p>
        </Painel>
      </div>

      <Grade cols="md:grid-cols-3">
        <Insight cor={META} icon={Trophy} titulo='"Disponível nos melhores supermercados"' texto="Quase metade de quem começou a assistir foi até o fim: 48%, contra 17% da média dos vídeos." />
        <Insight cor={META} icon={Video} titulo="Vídeo engaja 50 vezes mais" texto="5,0% de engajamento nos vídeos, contra 0,1% nas peças estáticas e carrosséis." />
        <Insight cor={META} icon={Megaphone} titulo="Edição Especial com uma peça só" texto='O estático "A origem do amor · Família Cardoso" levou a Edição Especial a 154 mil pessoas em 10 dias.' />
      </Grade>
    </div>
  )
}

function RegioesAba({ cor }) {
  const estados = [
    { uf: 'SC', t: 'Santa Catarina', inv: 'R$ 468', p: '~141 mil', e: '3,8%', selo: 'Mais engajado', top: true },
    { uf: 'BA', t: 'Bahia', inv: 'R$ 541', p: '~159 mil', e: '2,8%', sub: 'interior e Extremo Sul' },
    { uf: 'AM', t: 'Manaus', inv: 'R$ 200', p: '~99 mil', e: '0,1%', dicaE: G.estatico, selo: 'Menor custo por pessoa' },
    { uf: 'ES', t: 'Espírito Santo', inv: 'R$ 104', p: '~47 mil', e: '1,9%' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {estados.map((g, i) => (
          <motion.div key={g.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(26,29,46,0.06), 0 8px 24px rgba(26,29,46,0.06)', outline: g.top ? `2px solid ${cor}` : 'none' }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{g.uf}</span>
                <p className="text-base font-extrabold text-text mt-1.5">{g.t}</p>
                {g.sub && <p className="text-xs text-muted">{g.sub}</p>}
              </div>
              {g.selo && <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-md text-right" style={{ background: cor + '16', color: cor }}>{g.selo}</span>}
            </div>
            <p className="text-2xl font-black tabular-nums text-text mt-4">{g.p}</p>
            <p className="text-[11px] text-muted">pessoas<Dica texto={G.alcance} /></p>
            <div className="flex justify-between text-sm py-2 mt-3 border-t border-slate-100"><span className="text-slate-600">Investimento</span><span className="font-bold tabular-nums">{g.inv}</span></div>
            <div className="flex justify-between text-sm py-2 border-t border-slate-100"><span className="text-slate-600">Engajamento<Dica texto={g.dicaE || G.engMeta} /></span><span className="font-bold tabular-nums">{g.e}</span></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Painel>
          <Cabecalho titulo="Idade" sub="Taxa de engajamento" cor={META} icon={Users} />
          <div className="grid grid-cols-6 gap-1.5 items-end h-32">
            {[['18–24', 2.4], ['25–34', 1.8], ['35–44', 2.8], ['45–54', 3.4], ['55–64', 4.0], ['65+', 3.8]].map(([l, v], i) => (
              <div key={l} className="flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[11px] font-black tabular-nums">{String(v).replace('.', ',')}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${v / 4.5 * 100}%` }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-full rounded-t-md" style={{ background: v >= 3.8 ? META : META + '80' }} />
                <span className="text-[10px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex flex-col gap-3">
            <Barra label="Mulheres · 51% da verba" valor={2.8} max={4.5} cor={META} forte />
            <Barra label="Homens · 49% da verba" valor={2.5} max={4.5} cor={META} />
          </div>
        </Painel>

        <Painel delay={0.05}>
          <Cabecalho titulo="Interesses (SC)" sub="Taxa de engajamento" cor={META} icon={Target} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Remarketing" valor={6.6} max={7} cor={META} forte />
            <Barra label="Culinária" valor={4.2} max={7} cor={META} />
            <Barra label="Público aberto" valor={4.2} max={7} cor={META} />
            <Barra label="Gastronomia italiana" valor={3.5} max={7} cor={META} />
            <Barra label="Restaurante" valor={3.2} max={7} cor={META} />
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">Alcançar por interesse custou de <strong>R$ 1,45 a R$ 2,08</strong> por mil pessoas.<Dica texto={G.interesse} /></p>
        </Painel>

        <Painel delay={0.1}>
          <Cabecalho titulo="Onde" sub="Taxa de engajamento por posicionamento" cor={META} icon={Facebook} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Feed do Instagram · 15% da verba" valor={5.6} max={6} cor={META} forte />
            <Barra label="Feed do Facebook · 25%" valor={3.8} max={6} cor={META} />
            <Barra label="Reels do Instagram · 11%" valor={2.5} max={6} cor={META} />
            <Barra label="Stories do Instagram · 36%" valor={1.3} max={6} cor={META} />
            <Barra label="Reels do Facebook · 11%" valor={1.0} max={6} cor={META} />
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={cor} icon={Heart} titulo="Santa Catarina engajou mais" texto="3,8% de engajamento, contra 2,8% na BA e 1,9% no ES. O mesmo padrão se repetiu nos trimestres seguintes." />
        <Insight cor={cor} icon={Wallet} titulo="Manaus: alcance mais barato" texto="99 mil pessoas com R$ 200, a R$ 2,01 por mil pessoas, com a estreia da Edição Especial." />
        <Insight cor={cor} icon={Target} titulo="Interesse vence cidade no custo" texto="Em SC, os públicos de culinária e gastronomia custaram até metade do alcance por cidade na BA." />
        <Insight cor={cor} icon={Users} titulo="Público maduro responde mais" texto="Acima de 45 anos, o engajamento passa de 3,4%. O feed do Instagram foi o espaço com mais interação (5,6%)." />
      </Grade>
    </div>
  )
}

export default function CacarolaTrimestre1({ color = '#f87171' }) {
  const [aba, setAba] = useState('geral')
  return (
    <div className="w-full flex flex-col gap-5">
      <TopoResultados color={color}
        eyebrow="Caçarola · Lançamento da linha de arroz especial"
        titulo="Resultados · Trimestre 1"
        objetivo="Objetivo: alcance (reconhecimento) · Dupla de Arroz e Arroz Edição Especial"
        chips={[[Facebook, 'Meta · 01/01 a 31/03']]}
        investimento="R$ 1.315"
        kpis={[
          ['Exibições', '1,08 mi', G.exibicoes],
          ['Contatos', '~438 mil', G.contatos],
          ['Frequência', '2,5', G.frequencia],
          ['CPM', 'R$ 1,22', G.cpm],
          ['Custo por mil pessoas', 'R$ 3,00', G.custoPessoa],
          ['Engajamentos', '28,9 mil', G.engMeta],
        ]} />

      <AbasResultados abas={ABAS} aba={aba} setAba={setAba} color={color} />

      <AnimatePresence mode="wait">
        <motion.div key={aba} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
          {aba === 'geral'   && <VisaoGeral cor={color} />}
          {aba === 'meta'    && <CampanhasAba />}
          {aba === 'regioes' && <RegioesAba cor={color} />}
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-muted text-center pb-2">Fonte: Gerenciador de Anúncios do Meta. Não houve campanhas de YouTube no período.</p>
    </div>
  )
}
