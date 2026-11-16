import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tv, Smartphone, MapPin, Users, Sparkles, MonitorPlay as Youtube, ThumbsUp as Facebook,
  LayoutGrid, Trophy, Heart, Wallet, Clock, Repeat, Eye, Target, Video, Cake, ShoppingCart,
} from 'lucide-react'
import {
  YT, META, shadow, GLOSSARIO, Dica, Painel, Cabecalho, Kpi, Barra, Insight, Grade, Linha, TopoResultados, AbasResultados,
} from './CacarolaResultadosTri'

const G = {
  ...GLOSSARIO,
  thruplay: 'Vídeo assistido até o fim, ou por pelo menos 15 segundos.',
  fimVideo: 'De quem começou a assistir o vídeo, quantos foram até o último segundo.',
  campanhaEng: 'Campanha com objetivo de engajamento: o Meta entrega o anúncio para quem tende a interagir, por isso a taxa fica bem mais alta que nas campanhas de alcance.',
  shorts: 'Vídeos curtos em formato vertical, feitos para a tela do celular.',
  dia23: 'Inclui R$ 70 do dia 23/07, quando entrou no ar o filme "A Origem do Amor", campanha do Trimestre 3.',
  abBolo: 'Teste A/B: duas versões do anúncio rodam ao mesmo tempo para o mesmo público, e comparamos qual traz o resultado mais barato. Aqui, o resultado era a visita ao perfil.',
  estadoEng: 'RJ e SC receberam campanhas com objetivo de engajamento (SuperMarket e início da Edição Especial), por isso a taxa é mais alta.',
}

const ABAS = [
  { id: 'geral',   label: 'Visão geral', icon: LayoutGrid },
  { id: 'meta',    label: 'Meta',        icon: Facebook },
  { id: 'youtube', label: 'YouTube',     icon: Youtube },
  { id: 'regioes', label: 'Regiões',     icon: MapPin },
]

function VisaoGeral({ cor }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Painel className="xl:col-span-3">
          <Cabecalho titulo="Meta x YouTube" sub="Os dois canais lado a lado" cor={cor} icon={LayoutGrid} />
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 pb-2">
            <span />
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: META }}><Facebook size={14} /> Meta</span>
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: YT }}><Youtube size={14} /> YouTube</span>
          </div>
          <Linha label="Período" yt="01/04 a 23/07" meta="13/04 a 23/07" />
          <Linha label="Investimento" dica={G.dia23} yt="R$ 8.994" meta="R$ 768" />
          <Linha label="Exibições" dica={G.exibicoes} yt="6,08 mi" meta="265 mil" />
          <Linha label="Pessoas alcançadas" dica={G.alcance} yt="~2,0 mi" meta="140 mil" />
          <Linha label="Frequência" dica={G.frequencia} yt="3,0" meta="2,2 – 3,0" />
          <Linha label="CPM" dica={G.cpm} yt="R$ 1,48" meta="R$ 2,89" />
          <Linha label="Custo por mil pessoas" dica={G.custoPessoa} yt="R$ 4,48" meta="R$ 4,97" />
          <Linha label="Engajamento" dica={`Meta — ${G.engMeta} YouTube — ${G.visualizacao}`} yt="4,9% · 297 mil" meta="13,9% de visualização" />
          <Linha label="Até o fim" dica={G.fim} yt="—" meta="12%" />
          <Linha label="Onde" yt="Stories e feed" meta="86% na TV" />
        </Painel>

        <div className="xl:col-span-2 flex flex-col gap-5">
          <Painel delay={0.05}>
            <Cabecalho titulo="Resumo" sub="O trimestre em 6 pontos" cor={cor} icon={Sparkles} />
            <ul className="flex flex-col gap-3.5">
              {[
                ['R$ 9.762', 'investidos: R$ 8.994 no Meta e R$ 768 no YouTube.'],
                ['6,34 milhões de exibições', 'e cerca de 2,15 milhões de contatos com pessoas.'],
                ['4 estados:', 'a Dupla de Arroz chegou à BA, ao ES, ao RJ e a SC, com campanhas por cidade.'],
                ['Mais de 3 exposições por pessoa', 'na BA e no ES, patamar em que a marca começa a ser lembrada.'],
                ['55% de engajamento', 'no vídeo com uma família real, na ação com o SuperMarket no RJ.'],
                ['A foto da fatia', 'venceu a do bolo inteiro no teste da Mistura para Bolo.'],
              ].map(([b, t], i) => (
                <li key={b} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: cor + '1a', color: cor }}>{i + 1}</span>
                  <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-text font-bold">{b}</strong> {t}</p>
                </li>
              ))}
            </ul>
          </Painel>
        </div>
      </div>

      <Painel delay={0.1}>
        <Cabecalho titulo="Análise do trimestre" cor={cor} icon={Target} />
        <p className="text-sm text-slate-600 leading-relaxed">
          O trimestre foi de <strong className="text-text">escala</strong>: a marca passou de cerca de 438 mil para 2,15 milhões de contatos, em 4 estados, com frequência acima de 3 na Bahia e no Espírito Santo, patamar em que a marca começa a ser lembrada.
          A estratégia por cidade levou o arroz especial a dezenas de municípios do interior da BA e do ES.
          Os vídeos seguiram como principal fonte de engajamento, e o conteúdo com pessoas reais (a família recebendo o arroz) teve o maior engajamento do período.
          No YouTube, o teste com Shorts mostrou que o formato vertical rende no celular, mas não na TV, aprendizado que levou ao filme horizontal do trimestre seguinte.
          Na Mistura para Bolo, o teste A/B indicou a foto da fatia como a mais eficiente.
        </p>
      </Painel>

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted mb-3 ml-1">O que os dois canais mostram juntos</p>
        <Grade cols="md:grid-cols-3">
          <Insight cor={cor} icon={Smartphone} titulo="Cada tela pede um formato" texto="Vídeo vertical funciona no celular (44% até o fim) e não na TV (6%)." />
          <Insight cor={cor} icon={Users} titulo="Emoção e pessoas reais engajam mais" texto="A família recebendo o arroz chegou a 55% de engajamento. Peças só explicativas ficaram em 0,1%." />
          <Insight cor={cor} icon={Heart} titulo="O público mais velho responde mais" texto="No Meta, o engajamento sobe de 2,4% (18 a 24 anos) para 21,9% (65+). No YouTube, 35% dos acima de 65 assistem até o fim." />
        </Grade>
      </div>
    </div>
  )
}

function MetaAba() {
  const produtos = [
    { n: 'Dupla de Arroz', inv: 'R$ 7.617', v: 85, p: '~1,7 mi', e: '3,1%' },
    { n: 'Supermercado (RJ)', inv: 'R$ 556', v: 6, p: '60 mil', e: '54,8%', d: true },
    { n: 'Mistura para Bolo', inv: 'R$ 385', v: 4, p: '111 mil', e: '1,0%' },
    { n: 'Edição Especial (julho)', inv: 'R$ 376', v: 4, p: '100 mil', e: '35,8%', d: true },
    { n: 'Evento Natural Tech (SP)', inv: 'R$ 59', v: 1, p: '23 mil', e: '4,4%' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Grade cols="sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Pessoas alcançadas" valor="~2,0 mi" sub="R$ 4,48 por mil pessoas" dica={G.contatos} cor={META} destaque />
        <Kpi label="Frequência" valor="3,0" sub="patamar de lembrança" dica={G.frequencia} cor={META} destaque />
        <Kpi label="Engajamentos" valor="297 mil" sub="4,9% das exibições" dica={G.engMeta} cor={META} />
        <Kpi label="ThruPlays" valor="63 mil" sub="CPM R$ 1,48" dica={G.thruplay} cor={META} />
      </Grade>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Painel className="xl:col-span-3">
          <Cabecalho titulo="Por produto" sub="Investimento, alcance e engajamento" cor={META} icon={ShoppingCart} />
          <div className="grid grid-cols-[1.6fr_1fr_0.9fr_1fr] gap-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            <span>Produto</span><span>Investimento</span><span>Pessoas</span><span>Engajamento</span>
          </div>
          {produtos.map(p => (
            <div key={p.n} className="grid grid-cols-[1.6fr_1fr_0.9fr_1fr] gap-2 py-2.5 border-t border-slate-100 text-sm items-center">
              <span className="font-semibold text-text">{p.n}</span>
              <span className="tabular-nums text-slate-700">{p.inv} <span className="text-[11px] text-muted">({p.v}%)</span></span>
              <span className="tabular-nums text-slate-700">{p.p}</span>
              <span className="tabular-nums font-bold text-text">{p.e}{p.d && <Dica texto={G.campanhaEng} />}</span>
            </div>
          ))}
        </Painel>

        <Painel className="xl:col-span-2" delay={0.05}>
          <Cabecalho titulo="Mistura para Bolo · teste A/B" sub="Custo por visita ao perfil (Salvador)" cor={META} icon={Cake} />
          <div className="grid grid-cols-2 gap-3">
            {[['Laranja', 'R$ 0,19', 'R$ 0,23'], ['Chocolate', 'R$ 0,18', 'R$ 0,20']].map(([s, f, i]) => (
              <div key={s} className="rounded-xl p-4 bg-slate-50">
                <p className="text-xs font-bold text-muted">{s}</p>
                <p className="text-2xl font-black tabular-nums mt-1" style={{ color: META }}>{f}</p>
                <p className="text-[11px] text-muted">foto da fatia</p>
                <p className="text-sm font-bold tabular-nums text-slate-500 mt-2">{i}</p>
                <p className="text-[11px] text-muted">bolo inteiro</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">Nos dois sabores, a <strong>foto da fatia</strong> trouxe a visita mais barata.<Dica texto={G.abBolo} /></p>
        </Painel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Painel>
          <Cabecalho titulo="Engajamento por criativo" sub="Taxa de engajamento" cor={META} icon={Trophy} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Família recebendo o arroz Caçarola" valor={54.9} max={60} cor={META} forte sub="engajamento" />
            <Barra label="A origem do amor (Edição Especial)" valor={35.8} max={60} cor={META} sub="engajamento" />
            <Barra label="UGC Pérola e Arbório (influenciadoras)" valor={9.3} max={60} cor={META} />
            <Barra label="Seja lembrado por fazer o melhor risoto" valor={5.8} max={60} cor={META} />
            <Barra label="Hoje você merece (BA e ES)" valor={4.3} max={60} cor={META} />
            <Barra label="Vontade de Risoto (BA e ES)" valor={3.8} max={60} cor={META} />
            <Barra label="Explicativos Pérola e Arbório (estáticos)" valor={0.1} max={60} cor={META} />
          </div>
          <p className="text-xs text-muted mt-3">Os dois primeiros rodaram em campanhas de engajamento.<Dica texto={G.campanhaEng} /></p>
        </Painel>

        <Painel delay={0.05}>
          <Cabecalho titulo="Vídeos que mais prenderam" sub="De quem começou a assistir, quantos foram até o fim" cor={META} icon={Video} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Vontade de Risoto" valor={28} max={35} cor={META} forte />
            <Barra label="Hoje você merece" valor={26} max={35} cor={META} />
            <Barra label="Seja lembrado por fazer o melhor risoto" valor={22} max={35} cor={META} />
            <Barra label="UGC Pérola e Arbório" valor={1} max={35} cor={META} />
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Engajamento por formato</p>
          <div className="flex flex-col gap-3">
            <Barra label="Vídeo" valor={8.1} max={10} cor={META} forte />
            <Barra label="Estático" valor={0.2} max={10} cor={META} />
          </div>
        </Painel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Painel>
          <Cabecalho titulo="Para quem" sub="Taxa de engajamento por idade" cor={META} icon={Users} />
          <div className="grid grid-cols-6 gap-1.5 items-end h-36">
            {[['18–24', 2.4], ['25–34', 3.1], ['35–44', 4.4], ['45–54', 6.1], ['55–64', 11.0], ['65+', 21.9]].map(([l, v], i) => (
              <div key={l} className="flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[11px] font-black tabular-nums">{String(v).replace('.', ',')}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(v / 22 * 100, 4)}%` }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-full rounded-t-md" style={{ background: i === 5 ? META : META + '80' }} />
                <span className="text-[10px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex flex-col gap-3">
            <Barra label="Mulheres · 57% da verba" valor={5.4} max={6} cor={META} forte />
            <Barra label="Homens · 43% da verba" valor={4.2} max={6} cor={META} />
          </div>
        </Painel>
        <Painel delay={0.05}>
          <Cabecalho titulo="Onde" sub="Taxa de engajamento por posicionamento" cor={META} icon={Smartphone} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Reels do Facebook · 8% da verba" valor={12.0} max={13} cor={META} forte />
            <Barra label="Feed do Facebook · 20%" valor={9.0} max={13} cor={META} />
            <Barra label="Feed do Instagram · 18%" valor={7.6} max={13} cor={META} />
            <Barra label="Reels do Instagram · 17%" valor={3.5} max={13} cor={META} />
            <Barra label="Stories do Instagram · 36%" valor={1.4} max={13} cor={META} />
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={META} icon={Repeat} titulo="Frequência no patamar de lembrança" texto="3 exposições por pessoa no trimestre, e acima de 3 na BA e no ES." />
        <Insight cor={META} icon={Heart} titulo="Pessoas reais engajam mais" texto="A família recebendo o arroz chegou a 55% de engajamento e 983 reações." />
        <Insight cor={META} icon={Video} titulo="Vídeo engaja 40 vezes mais" texto="8,1% nos vídeos contra 0,2% nas peças estáticas. Os vídeos de risoto prenderam 1 em cada 4 pessoas até o fim." />
        <Insight cor={META} icon={Users} titulo="Influenciadoras chamam atenção" texto="Os vídeos UGC tiveram 9% de engajamento, o maior entre os vídeos de alcance da Dupla de Arroz." />
      </Grade>
    </div>
  )
}

function YouTubeAba() {
  const estados = [
    { t: 'Bahia', inv: 'R$ 347', p: '87 mil', f: '2,2', cpm: 'R$ 2,47', vis: '12,0%', fim: '9%' },
    { t: 'Espírito Santo', inv: 'R$ 350', p: '53 mil', f: '3,0', cpm: 'R$ 2,93', vis: '13,8%', fim: '12%' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Grade cols="sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Pessoas alcançadas" valor="140 mil" sub="R$ 4,97 por mil pessoas" dica={G.alcance} cor={YT} destaque />
        <Kpi label="Assistiram até o fim" valor="12%" sub="Shorts" dica={G.fim} cor={YT} destaque />
        <Kpi label="Taxa de visualização" valor="13,9%" sub="R$ 0,021 por visualização" dica={G.visualizacao} cor={YT} />
        <Kpi label="Horas assistidas" valor="279 h" sub="265 mil exibições" dica={G.horas} cor={YT} />
      </Grade>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {estados.map((e, i) => (
          <Painel key={e.t} delay={0.05 * i}>
            <p className="text-sm font-extrabold text-text mb-4">{e.t}<span className="text-xs font-semibold text-muted"> · Shorts</span><Dica texto={G.shorts} /></p>
            <p className="text-3xl font-black tabular-nums text-text">{e.p}</p>
            <p className="text-xs text-muted mb-4">pessoas alcançadas<Dica texto={G.alcance} /></p>
            {[
              ['Investimento', e.inv],
              ['Frequência', e.f, G.frequencia],
              ['CPM', e.cpm, G.cpm],
              ['Taxa de visualização', e.vis, G.visualizacao],
              ['Assistiram até o fim', e.fim, G.fim],
            ].map(([k, v, d]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-t border-slate-100 text-sm">
                <span className="text-slate-600">{k}{d && <Dica texto={d} />}</span>
                <span className="font-bold tabular-nums text-text">{v}</span>
              </div>
            ))}
          </Painel>
        ))}
        <Painel delay={0.1}>
          <Cabecalho titulo="Quanto do vídeo assistem" sub="% das exibições em cada ponto" cor={YT} icon={Eye} />
          <div className="flex items-end gap-3 h-44">
            {[['Início', 100], ['25%', 35], ['50%', 21], ['75%', 16], ['Fim', 12]].map(([l, v], i) => (
              <div key={l} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-sm font-black tabular-nums text-text">{v}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${v * 0.8}%` }} transition={{ delay: 0.2 + i * 0.07, duration: 0.6 }}
                  className="w-full rounded-t-lg" style={{ background: i === 4 ? YT : YT + '80' }} />
                <span className="text-[11px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3">Investimento total no YouTube: R$ 768.<Dica texto={G.dia23} /></p>
        </Painel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Painel>
          <Cabecalho titulo="Onde e quando assistem" sub="Assistiram até o fim" cor={YT} icon={Tv} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Celular · 14% das exibições" valor={44} max={50} cor={YT} forte />
            <Barra label="TV · 86% das exibições" valor={6} max={50} cor={YT} />
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex flex-col gap-3.5">
            <Barra label="Madrugada (0h–5h)" valor={24} max={50} cor={YT} forte />
            <Barra label="Noite (18h–23h)" valor={14} max={50} cor={YT} />
            <Barra label="Tarde (12h–17h)" valor={10} max={50} cor={YT} />
            <Barra label="Manhã (6h–11h)" valor={9} max={50} cor={YT} />
          </div>
        </Painel>

        <Painel delay={0.05}>
          <Cabecalho titulo="Para quem" sub="Assistiram até o fim, por idade" cor={YT} icon={Users} />
          <div className="grid grid-cols-4 gap-2 items-end h-36">
            {[['35–44', 17], ['45–54', 27], ['55–64', 34], ['65+', 35]].map(([l, v], i) => (
              <div key={l} className="flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[11px] font-black tabular-nums">{v}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${v / 40 * 100}%` }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-full rounded-t-md" style={{ background: i === 3 ? YT : YT + '99' }} />
                <span className="text-[10px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex flex-col gap-3">
            <Barra label="Homens" valor={29} max={40} cor={YT} />
            <Barra label="Mulheres" valor={27} max={40} cor={YT} />
          </div>
          <p className="text-[11px] text-muted mt-3">Na TV, o Google não identifica idade e gênero em 3 de cada 4 exibições.</p>
        </Painel>

        <Painel delay={0.1}>
          <Cabecalho titulo="Vídeos" sub="Assistiram até o fim" cor={YT} icon={Trophy} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Seu dia pede algo especial" valor={22} max={25} cor={YT} forte />
            <Barra label="Impressione alguém especial" valor={16} max={25} cor={YT} />
            <Barra label="Hoje você merece algo especial" valor={15} max={25} cor={YT} />
            <Barra label="Experimente a tradição de um risoto" valor={10} max={25} cor={YT} />
            <Barra label="Experimente o melhor do risoto" valor={6} max={25} cor={YT} />
            <Barra label="Seja lembrado por fazer o melhor risoto" valor={5} max={25} cor={YT} />
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={YT} icon={Smartphone} titulo="Vertical é formato de celular" texto="No celular, 44% assistiram até o fim; na TV, 6%. O aprendizado levou ao filme horizontal do Trimestre 3, com 57% de conclusão na TV." />
        <Insight cor={YT} icon={Heart} titulo="Convite emocional prende mais" texto='"Seu dia pede algo especial" chegou a 22% de conclusão, contra 5% dos vídeos com foco em receita.' />
        <Insight cor={YT} icon={Users} titulo="Público mais velho assiste mais" texto="35% de conclusão acima de 65 anos, contra 17% entre 35 e 44." />
        <Insight cor={YT} icon={Clock} titulo="Madrugada tem mais atenção" texto="24% de conclusão de madrugada, contra 9% de manhã. O mesmo padrão aparece no Trimestre 3." />
      </Grade>
    </div>
  )
}

function RegioesAba({ cor }) {
  const estados = [
    { uf: 'BA', t: 'Bahia', inv: 'R$ 4.935', p: '~1,07 mi', f: '3,3', e: '3,6%', selo: 'Maior alcance', top: true },
    { uf: 'ES', t: 'Espírito Santo', inv: 'R$ 3.037', p: '~528 mil', f: '4,1', e: '2,7%', selo: 'Maior frequência' },
    { uf: 'RJ', t: 'Rio de Janeiro', inv: 'R$ 974', p: '~262 mil', f: '1,8', e: '18,2%', d: true, selo: 'Mais engajado' },
    { uf: 'SC', t: 'Santa Catarina', inv: 'R$ 716', p: '~261 mil', f: '1,5', e: '10,4%', d: true },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {estados.map((g, i) => (
          <motion.div key={g.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-5" style={{ boxShadow: shadow, outline: g.top ? `2px solid ${cor}` : 'none' }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{g.uf}</span>
                <p className="text-base font-extrabold text-text mt-1.5">{g.t}</p>
              </div>
              {g.selo && <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-md text-right" style={{ background: cor + '16', color: cor }}>{g.selo}</span>}
            </div>
            <p className="text-2xl font-black tabular-nums text-text mt-4">{g.p}</p>
            <p className="text-[11px] text-muted">pessoas · Meta + YouTube<Dica texto={G.alcance} /></p>
            <div className="mt-3">
              {[
                ['Investimento', g.inv],
                ['Frequência', g.f, G.frequencia],
                ['Engajamento (Meta)', g.e, g.d ? G.estadoEng : G.engMeta],
              ].map(([k, v, d]) => (
                <div key={k} className="flex justify-between gap-3 py-2 border-t border-slate-100 text-sm">
                  <span className="text-slate-600">{k}{d && <Dica texto={d} />}</span>
                  <span className="font-bold tabular-nums text-text">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Painel>
          <Cabecalho titulo="Alcance mais barato" sub="Custo por mil pessoas, em R$ (Meta)" cor={cor} icon={Wallet} />
          <div className="flex flex-col gap-3.5">
            <Barra label="BA · cidades restantes" valor={1.81} max={2.5} sufixo="" cor={cor} forte />
            <Barra label="Salvador" valor={1.86} max={2.5} sufixo="" cor={cor} />
            <Barra label="Rio de Janeiro" valor={2.07} max={2.5} sufixo="" cor={cor} />
            <Barra label="ES · cidades restantes" valor={2.14} max={2.5} sufixo="" cor={cor} />
          </div>
        </Painel>
        <Painel delay={0.05}>
          <Cabecalho titulo="Mais engajamento" sub="Taxa de engajamento por cidade (Meta)" cor={cor} icon={Heart} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Baianópolis (BA)" valor={6.6} max={7} cor={cor} forte />
            <Barra label="ES · cidades restantes" valor={5.7} max={7} cor={cor} />
            <Barra label="Bom Jesus da Lapa (BA)" valor={5.1} max={7} cor={cor} />
            <Barra label="Conceição do Castelo (ES)" valor={4.3} max={7} cor={cor} />
          </div>
        </Painel>
        <Painel delay={0.1}>
          <Cabecalho titulo="Mais repetição" sub="Vezes que cada pessoa viu a marca (Meta)" cor={cor} icon={Repeat} />
          <div className="flex flex-col gap-3.5">
            <Barra label="Formosa do Rio Preto (BA)" valor={5.8} max={6.5} sufixo="" cor={cor} forte />
            <Barra label="Ubaitaba (BA)" valor={5.2} max={6.5} sufixo="" cor={cor} />
            <Barra label="Seabra (BA)" valor={5.2} max={6.5} sufixo="" cor={cor} />
            <Barra label="Ourolândia (BA)" valor={5.2} max={6.5} sufixo="" cor={cor} />
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={cor} icon={Trophy} titulo="BA e ES foram o centro do trimestre" texto="Juntos, receberam 82% da verba, com frequência acima de 3, patamar em que a marca começa a ser lembrada." />
        <Insight cor={cor} icon={Wallet} titulo="Cidades grandes: alcance mais barato" texto="Em Salvador e nas demais cidades da BA, alcançar mil pessoas custou de R$ 1,81 a R$ 1,86." />
        <Insight cor={cor} icon={Repeat} titulo="Cidades menores: mais repetição" texto="Em Formosa do Rio Preto, Ubaitaba, Seabra e Ourolândia, cada pessoa viu a marca mais de 5 vezes." />
        <Insight cor={cor} icon={Heart} titulo="Interior engaja mais" texto="Baianópolis (6,6%), demais cidades do ES (5,7%) e Bom Jesus da Lapa (5,1%) lideraram o engajamento nas campanhas de alcance." />
      </Grade>
    </div>
  )
}

export default function CacarolaTrimestre2({ color = '#f87171' }) {
  const [aba, setAba] = useState('geral')
  return (
    <div className="w-full flex flex-col gap-5">
      <TopoResultados color={color}
        eyebrow="Caçarola · Escala por cidade"
        titulo="Resultados · Trimestre 2"
        objetivo="Objetivo: alcance (reconhecimento) · Dupla de Arroz, Mistura para Bolo e Supermercado"
        chips={[[Facebook, 'Meta · 01/04 a 23/07'], [Youtube, 'YouTube · 13/04 a 23/07']]}
        investimento="R$ 9.762"
        kpis={[
          ['Exibições', '6,34 mi', G.exibicoes],
          ['Contatos', '~2,15 mi', G.contatos],
          ['Frequência · Meta', '3,0', G.frequencia],
          ['CPM', 'R$ 1,54', G.cpm],
          ['Engajamentos · Meta', '297 mil', G.engMeta],
          ['Pessoas · YouTube', '140 mil', G.alcance],
        ]} />

      <AbasResultados abas={ABAS} aba={aba} setAba={setAba} color={color} />

      <AnimatePresence mode="wait">
        <motion.div key={aba} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
          {aba === 'geral'   && <VisaoGeral cor={color} />}
          {aba === 'meta'    && <MetaAba />}
          {aba === 'youtube' && <YouTubeAba />}
          {aba === 'regioes' && <RegioesAba cor={color} />}
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-muted text-center pb-2">Fontes: Gerenciador de Anúncios do Meta e Google Ads (YouTube).</p>
    </div>
  )
}
