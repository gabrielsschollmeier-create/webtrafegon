import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tv, Smartphone, MapPin, Users, Sparkles, MonitorPlay as Youtube, ThumbsUp as Facebook,
  LayoutGrid, Trophy, Heart, Wallet, Clock, Repeat, Eye, ChefHat, HelpCircle,
} from 'lucide-react'

const YT = '#e11d48'
const META = '#1877f2'
const shadow = '0 1px 3px rgba(26,29,46,0.06), 0 8px 24px rgba(26,29,46,0.06)'

const GLOSSARIO = {
  contatos: 'Soma das pessoas alcançadas nos dois canais. Parte delas foi impactada nos dois, então o número de pessoas diferentes é menor.',
  frequencia: 'Quantas vezes, em média, cada pessoa viu a marca no período.',
  cpm: 'Quanto custa mostrar o anúncio 1.000 vezes.',
  custoPessoa: 'Quanto custa alcançar 1.000 pessoas diferentes. Diferente do CPM, conta pessoas, não exibições.',
  visualizacao: 'De cada 100 vezes que o vídeo apareceu, em quantas a pessoa assistiu pelo menos 30 segundos (ou o vídeo inteiro).',
  fim: 'De cada 100 vezes que o vídeo apareceu, em quantas a pessoa assistiu até o último segundo.',
  engMeta: 'Reações, comentários, compartilhamentos, cliques e reproduções do vídeo, divididos pelas exibições.',
  cortes: 'Versões curtas do filme, que não podem ser puladas. Rodam desde 07/10 na Grande Florianópolis. Como não dá para pular, o Google não conta "visualização" nesse formato; o indicador certo é a conclusão.',
  remarketing: 'Anúncio mostrado de novo para quem já interagiu com os vídeos.',
  faixaCortes: 'As três campanhas de cortes rodam na mesma região, e uma mesma pessoa pode ter sido alcançada por mais de uma. Por isso o número real fica nessa faixa.',
  metaSC: 'No Meta, os grupos de Santa Catarina foram montados por ordem alfabética de cidades, e não por região. Por isso, em SC, o Meta só pode ser lido para o estado como um todo.',
  qualidade: 'Avaliação do próprio Meta sobre a qualidade do criativo, comparada a anúncios que disputam o mesmo público.',
  exibicoes: 'Quantas vezes o anúncio apareceu na tela, contando as repetições para a mesma pessoa.',
  alcance: 'Estimativa de pessoas diferentes que viram o anúncio. No YouTube, inclui quem assistiu junto na mesma TV.',
  completos: 'Quanto custa ter 1.000 vídeos assistidos até o último segundo.',
  tempoMedio: 'Tempo que, em média, cada exibição do filme de 45s ficou sendo assistida.',
  horas: 'Soma de todo o tempo em que as pessoas assistiram aos vídeos.',
  cpv: 'Quanto custou, em média, cada visualização do vídeo.',
  custoEng: 'Quanto custou, em média, cada engajamento.',
}

const ABAS = [
  { id: 'geral',   label: 'Visão geral', icon: LayoutGrid },
  { id: 'youtube', label: 'YouTube',     icon: Youtube },
  { id: 'meta',    label: 'Meta',        icon: Facebook },
  { id: 'regioes', label: 'Regiões',     icon: MapPin },
]

function Dica({ texto, claro = false }) {
  const [aberta, setAberta] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!aberta) return
    const fechar = e => { if (ref.current && !ref.current.contains(e.target)) setAberta(false) }
    document.addEventListener('pointerdown', fechar)
    return () => document.removeEventListener('pointerdown', fechar)
  }, [aberta])
  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button type="button" onClick={e => { e.stopPropagation(); setAberta(v => !v) }}
        aria-label="O que significa" aria-expanded={aberta}
        className={`ml-1 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full transition ${claro ? 'text-white/75 hover:text-white' : aberta ? 'text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}>
        <HelpCircle size={15} />
      </button>
      <AnimatePresence>
        {aberta && (
          <motion.span
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute z-30 left-1/2 -translate-x-1/2 top-6 w-64 rounded-xl bg-slate-900 text-white text-xs font-medium leading-relaxed p-3 shadow-xl normal-case tracking-normal text-left">
            {texto}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

function Painel({ children, className = '', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}
      className={`bg-white rounded-2xl p-5 lg:p-6 ${className}`} style={{ boxShadow: shadow }}>
      {children}
    </motion.div>
  )
}

function Cabecalho({ titulo, sub, cor, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {Icon && (
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cor + '14', color: cor }}>
          <Icon size={18} />
        </span>
      )}
      <div>
        <h3 className="text-[15px] font-extrabold text-text leading-tight">{titulo}</h3>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function Kpi({ label, valor, sub, dica, cor, destaque = false }) {
  return (
    <div className="rounded-2xl p-4 lg:p-5 bg-white flex flex-col justify-between min-h-[112px]"
      style={{ boxShadow: shadow, borderTop: `3px solid ${destaque ? cor : 'transparent'}` }}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}{dica && <Dica texto={dica} />}</p>
      <div>
        <p className="text-2xl xl:text-[28px] font-black tabular-nums text-text leading-none mt-3">{valor}</p>
        {sub && <p className="text-xs text-muted mt-1.5">{sub}</p>}
      </div>
    </div>
  )
}

function Barra({ label, valor, max = 100, cor, sufixo = '%', sub, delay = 0, forte = false }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className={`text-sm ${forte ? 'font-bold text-text' : 'text-slate-600'}`}>{label}</span>
        <span className="text-sm font-black tabular-nums text-text whitespace-nowrap">
          {String(valor).replace('.', ',')}{sufixo}{sub && <span className="text-[11px] font-semibold text-muted ml-1.5">{sub}</span>}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(valor / max) * 100}%` }}
          transition={{ delay: 0.15 + delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full" style={{ background: forte ? cor : cor + 'a6' }} />
      </div>
    </div>
  )
}

function Insight({ titulo, texto, cor, icon: Icon = Sparkles }) {
  return (
    <div className="rounded-2xl p-4 lg:p-5 h-full" style={{ background: cor + '0b', border: `1px solid ${cor}22` }}>
      <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: cor + '1a', color: cor }}>
        <Icon size={16} />
      </span>
      <p className="text-sm font-extrabold text-text mt-3 leading-snug">{titulo}</p>
      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{texto}</p>
    </div>
  )
}

function Grade({ children, cols = 'md:grid-cols-2 xl:grid-cols-4' }) {
  return <div className={`grid grid-cols-1 ${cols} gap-4`}>{children}</div>
}

function Linha({ label, dica, yt, meta }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-3 py-3 border-t border-slate-100 first:border-t-0">
      <span className="text-sm font-semibold text-slate-600">{label}{dica && <Dica texto={dica} />}</span>
      <span className="text-sm font-bold tabular-nums text-text">{yt}</span>
      <span className="text-sm font-bold tabular-nums text-text">{meta}</span>
    </div>
  )
}

function VisaoGeral({ cor }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Painel className="xl:col-span-3">
          <Cabecalho titulo="YouTube x Meta" sub="Os dois canais lado a lado" cor={cor} icon={LayoutGrid} />
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 pb-2">
            <span />
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: YT }}><Youtube size={14} /> YouTube</span>
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: META }}><Facebook size={14} /> Meta</span>
          </div>
          <Linha label="Período" yt="24/07 a 23/10" meta="24/08 a 23/10" />
          <Linha label="Investimento" yt="R$ 5.761" meta="R$ 8.668" />
          <Linha label="Exibições" dica={GLOSSARIO.exibicoes} yt="1,33 mi" meta="2,54 mi" />
          <Linha label="Pessoas alcançadas" dica={GLOSSARIO.alcance} yt="~900 mil" meta="764 mil" />
          <Linha label="Frequência" dica={GLOSSARIO.frequencia} yt="1,3" meta="3,3" />
          <Linha label="CPM" dica={GLOSSARIO.cpm} yt="R$ 4,32" meta="R$ 3,42" />
          <Linha label="Custo por mil pessoas" dica={GLOSSARIO.custoPessoa} yt="R$ 5,54 – 5,89" meta="R$ 11,35" />
          <Linha label="Engajamento" dica={`YouTube — ${GLOSSARIO.fim} Meta — ${GLOSSARIO.engMeta}`} yt="55% até o fim" meta="45,4%" />
          <Linha label="Taxa de visualização" dica={GLOSSARIO.visualizacao} yt="58,6%" meta="—" />
          <Linha label="Custo unitário" dica={`YouTube — ${GLOSSARIO.cpv} Meta — ${GLOSSARIO.custoEng}`} yt="R$ 0,008 / visualização" meta="R$ 0,0075 / engajamento" />
          <Linha label="Onde" yt="90% na TV da sala" meta="Feed e celular" />
        </Painel>

        <Painel className="xl:col-span-2" delay={0.05}>
          <Cabecalho titulo="Resumo" sub="O trimestre em 6 pontos" cor={cor} icon={Sparkles} />
          <ul className="flex flex-col gap-3.5">
            {[
              ['R$ 14.429', 'investidos nos dois canais.'],
              ['3,87 milhões de exibições', 'e cerca de 1,7 milhão de contatos com pessoas.'],
              ['8.735 horas', 'de marca na tela no YouTube, e 55% de quem começou o vídeo assistiu até o fim.'],
              ['1,15 milhão de engajamentos', 'no Meta, e cada pessoa viu a marca 3,3 vezes.'],
              ['Os canais se completam:', 'o YouTube gera atenção e alcance barato, e o Meta gera repetição e interação.'],
              ['Santa Catarina', 'responde melhor nos dois canais.'],
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

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted mb-3 ml-1">O que os dois canais mostram juntos</p>
        <Grade>
          <Insight cor={cor} icon={Tv} titulo="Cada tela pede um formato" texto="A história longa funciona na TV, e as famílias reais funcionam no celular." />
          <Insight cor={cor} icon={Users} titulo="As pessoas são a mensagem" texto='O depoimento do produtor vence no YouTube, e as famílias vencem no Meta. O conceito "Amor Cultivado" funciona quando tem rosto.' />
          <Insight cor={cor} icon={Repeat} titulo="Alcance de um lado, repetição do outro" texto="O YouTube apresenta a marca para muita gente (frequência 1,3), e o Meta faz essas pessoas lembrarem (3,3)." />
          <Insight cor={cor} icon={ChefHat} titulo="Receita e preparo são um caminho forte" texto="O público que cozinha é o que mais engaja." />
        </Grade>
      </div>
    </div>
  )
}

function YouTubeAba() {
  const estados = [
    { t: 'Bahia', inv: 'R$ 2.565', extra: '+ R$ 344 de remarketing', dicaExtra: GLOSSARIO.remarketing, p: '463 mil', vis: '57,6%', fim: '54%', comp: 'R$ 8,41', h: '4.756 h' },
    { t: 'SC · filme de 45s', inv: 'R$ 2.060', p: '350 mil', vis: '59,8%', fim: '56%', comp: 'R$ 8,38', h: '3.758 h' },
    { t: 'SC · cortes de 6s', dica: GLOSSARIO.cortes, inv: 'R$ 793', p: '88 – 245 mil', dicaP: GLOSSARIO.faixaCortes, vis: '—', fim: '66%', comp: 'R$ 4,04', h: '—', melhor: true },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Grade cols="sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Horas assistidas" valor="8.735 h" sub="R$ 0,55 por hora" dica={GLOSSARIO.horas} cor={YT} destaque />
        <Kpi label="Assistiram até o fim" valor="55%" sub="filme de 45s" dica={GLOSSARIO.fim} cor={YT} destaque />
        <Kpi label="Taxa de visualização" valor="58,6%" sub="R$ 0,008 por visualização" dica={GLOSSARIO.visualizacao} cor={YT} />
        <Kpi label="Tempo médio" valor="30 de 45s" sub="por exibição" dica={GLOSSARIO.tempoMedio} cor={YT} />
      </Grade>

      <Grade cols="lg:grid-cols-3">
        {estados.map((e, i) => (
          <Painel key={e.t} delay={0.05 * i}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-extrabold text-text">{e.t}{e.dica && <Dica texto={e.dica} />}</p>
              {e.melhor && <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md" style={{ background: YT + '14', color: YT }}>Menor custo</span>}
            </div>
            <p className="text-3xl font-black tabular-nums text-text">{e.fim}</p>
            <p className="text-xs text-muted mb-4">assistiram até o fim<Dica texto={GLOSSARIO.fim} /></p>
            {[
              ['Investimento', e.inv, e.extra && <span className="block text-[11px] text-muted font-medium">{e.extra}<Dica texto={e.dicaExtra} /></span>],
              ['Pessoas', e.p, null, e.dicaP || GLOSSARIO.alcance],
              ['Taxa de visualização', e.vis, null, GLOSSARIO.visualizacao],
              ['Custo por mil completos', e.comp, null, GLOSSARIO.completos],
              ['Horas assistidas', e.h, null, GLOSSARIO.horas],
            ].map(([k, v, extra, d]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-t border-slate-100 text-sm">
                <span className="text-slate-600">{k}{d && <Dica texto={d} />}</span>
                <span className="font-bold tabular-nums text-text text-right">{v}{extra}</span>
              </div>
            ))}
          </Painel>
        ))}
      </Grade>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Painel>
          <Cabecalho titulo="Quanto do filme as pessoas assistem" sub="Filme de 45s · % das exibições em cada ponto" cor={YT} icon={Eye} />
          <div className="flex items-end gap-3 h-48">
            {[['Início', 100], ['25%', 71], ['50%', 62], ['75%', 58], ['Fim', 55]].map(([l, v], i) => (
              <div key={l} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-sm font-black tabular-nums text-text">{v}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${v * 0.8}%` }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6 }}
                  className="w-full rounded-t-lg" style={{ background: i === 4 ? YT : YT + '80' }} />
                <span className="text-[11px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">Depois da metade, quase ninguém sai. A decisão acontece nos <strong>primeiros 11 segundos</strong>, quando saem 29% das pessoas.</p>
        </Painel>

        <Painel delay={0.05}>
          <Cabecalho titulo="Onde e quando assistem" sub="Assistiram até o fim" cor={YT} icon={Tv} />
          <div className="flex flex-col gap-3.5">
            <Barra label="TV · 90% das exibições" valor={57} cor={YT} forte />
            <Barra label="Computador · 3%" valor={62} cor={YT} />
            <Barra label="Celular · 7%" valor={28} cor={YT} />
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex flex-col gap-3.5">
            <Barra label="Madrugada (0h–5h)" valor={64} cor={YT} forte />
            <Barra label="Manhã (6h–11h)" valor={57} cor={YT} />
            <Barra label="Tarde (12h–17h)" valor={55} cor={YT} />
            <Barra label="Noite (18h–23h)" valor={51} cor={YT} />
          </div>
        </Painel>

        <Painel delay={0.1}>
          <Cabecalho titulo="Para quem" sub="Assistiram até o fim" cor={YT} icon={Users} />
          <div className="grid grid-cols-6 gap-1.5 items-end h-28">
            {[['18–24', 57], ['25–34', 58], ['35–44', 57], ['45–54', 58], ['55–64', 55], ['65+', 54]].map(([l, v], i) => (
              <div key={l} className="flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[11px] font-black tabular-nums">{v}%</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-full rounded-t-md" style={{ background: YT + '99' }} />
                <span className="text-[10px] text-muted">{l}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Cortes de 6s · públicos</p>
          <div className="flex flex-col gap-3">
            <Barra label="Entusiastas de culinária" valor={73} cor={YT} forte />
            <Barra label="Chefs de 30 minutos" valor={70} cor={YT} />
            <Barra label="Compradores de supermercado" valor={41} cor={YT} />
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={YT} icon={Heart} titulo="O filme prende" texto="Cada exibição foi assistida, em média, por 30 dos 45 segundos. Depois da metade, a perda até o fim é de só 7 pontos." />
        <Insight cor={YT} icon={Tv} titulo="A TV é o palco" texto="90% das exibições, com 57% de conclusão. No celular, cada vídeo completo custa 2,8 vezes mais." />
        <Insight cor={YT} icon={Clock} titulo="O horário nobre engaja menos" texto="Cerca de 50% até o fim: a TV disputa atenção com a novela e o jantar. Madrugada e manhã têm mais atenção (64%) e custo menor." />
        <Insight cor={YT} icon={Users} titulo="Funciona para todas as idades" texto="Conclusão entre 54% e 58% em todas as faixas. Mulheres são a maior fatia: 45% das exibições e 57% de conclusão." />
        <Insight cor={YT} icon={Trophy} titulo="VT 02 é o corte vencedor" texto='"Nunca passou pela minha cabeça abandonar essa cultura": 69% assistem até o fim.' />
        <Insight cor={YT} icon={ChefHat} titulo="Quem cozinha engaja mais" texto='Nos cortes, "Entusiastas de culinária" chegam a 73% de conclusão, contra 41% de "Compradores de supermercado".' />
        <Insight cor={YT} icon={Wallet} titulo="Mais barato, sem cansar" texto="O CPM caiu 18% na BA e 24% em SC, e a conclusão ficou estável por 3 meses com um único filme." />
        <Insight cor="#d97706" icon={Repeat} titulo="Ponto a evoluir" texto="A frequência ficou em 1,3. Alcançamos muita gente, mas com pouca repetição." />
      </Grade>
    </div>
  )
}

function MetaAba() {
  const criativos = [
    { n: 'Três famílias viram seus próprios rostos', verba: 5.6, eng: 64, obs: 'até 70,5% em SC' },
    { n: 'O Ismael acorda cedo', verba: 2.5, eng: 52 },
    { n: 'Algo novo está chegando… dose dupla', verba: 4.0, eng: 51 },
    { n: 'Família Cardoso viu pela primeira vez', verba: 60.7, eng: 48 },
    { n: 'Origem do Amor (institucional)', verba: 25.6, eng: 36 },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Grade cols="sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Engajamentos" valor="1,15 mi" sub="R$ 0,0075 cada" dica={GLOSSARIO.engMeta} cor={META} destaque />
        <Kpi label="Frequência" valor="3,3" sub="faixa ideal para lembrança" dica={GLOSSARIO.frequencia} cor={META} destaque />
        <Kpi label="Pessoas alcançadas" valor="764 mil" sub="R$ 11,35 por mil pessoas" dica={GLOSSARIO.custoPessoa} cor={META} />
        <Kpi label="Taxa de engajamento" valor="45,4%" sub="CPM R$ 3,42" dica={GLOSSARIO.engMeta} cor={META} />
      </Grade>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Painel className="xl:col-span-2">
          <Cabecalho titulo="Santa Catarina x Bahia" cor={META} icon={MapPin} />
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[['Santa Catarina', '50,9%', true], ['Bahia', '40,1%', false]].map(([e, v, m]) => (
              <div key={e} className="rounded-xl p-4" style={{ background: m ? META + '10' : '#f6f7fb' }}>
                <p className="text-xs font-bold text-muted">{e}</p>
                <p className="text-3xl font-black tabular-nums mt-1" style={{ color: m ? META : '#1a1d2e' }}>{v}</p>
                <p className="text-[11px] text-muted">de engajamento<Dica texto={GLOSSARIO.engMeta} /></p>
              </div>
            ))}
          </div>
          {[
            ['Investimento', 'R$ 4.338', 'R$ 4.330'],
            ['Pessoas', '362 mil', '401 mil'],
            ['Frequência', '3,4', '3,2', GLOSSARIO.frequencia],
            ['Custo por engajamento', 'R$ 0,0069', 'R$ 0,0083', GLOSSARIO.custoEng],
          ].map(([k, a, b, d]) => (
            <div key={k} className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 py-2.5 border-t border-slate-100 text-sm">
              <span className="text-slate-600">{k}{d && <Dica texto={d} />}</span>
              <span className="font-bold tabular-nums text-text">{a}</span>
              <span className="font-bold tabular-nums text-text">{b}</span>
            </div>
          ))}
        </Painel>

        <Painel className="xl:col-span-3" delay={0.05}>
          <Cabecalho titulo="Famílias reais vencem o institucional" sub="Engajamento de cada criativo e quanto da verba ele recebeu" cor={META} icon={Trophy} />
          <div className="flex flex-col gap-4">
            {criativos.map((c, i) => (
              <div key={c.n} className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-x-4 gap-y-1 items-center">
                <Barra label={c.n} valor={c.eng} max={70} cor={META} sub={c.obs} delay={i * 0.06} forte={i === 0} />
                <div className="sm:text-right">
                  <span className="text-[11px] text-muted">verba </span>
                  <span className={`text-sm font-black tabular-nums ${c.verba > 20 ? 'text-text' : 'text-slate-500'}`}>{String(c.verba).replace('.', ',')}%</span>
                </div>
              </div>
            ))}
          </div>
        </Painel>
      </div>

      <Grade>
        <Insight cor={META} icon={Repeat} titulo="Frequência na faixa ideal" texto="3,3 exposições por pessoa: é a partir de 3 que a marca começa a ser lembrada." />
        <Insight cor={META} icon={Trophy} titulo="O melhor criativo teve 5,6% da verba" texto='"Três famílias" engaja 64%, mas recebeu a menor fatia do investimento.' />
        <Insight cor={META} icon={Smartphone} titulo="Mesmo filme, canais diferentes" texto="Na TV, 55% assistem o institucional até o fim. No feed, ele engaja 36%." />
        <Insight cor={META} icon={Sparkles} titulo='Qualidade "Acima da média"' texto={<>Todos os anúncios receberam essa avaliação do Meta.<Dica texto={GLOSSARIO.qualidade} /></>} />
      </Grade>
    </div>
  )
}

function RegioesAba({ cor }) {
  const regioes = [
    { r: 'Salvador e Recôncavo', uf: 'BA', p: '177 mil', fim: '54%', c: 'R$ 4,83', mp: '134 mil', me: '37 – 40%', selo: 'Alcance mais barato da BA' },
    { r: 'Cacaueira e Baixo Sul', uf: 'BA', p: '137 mil', fim: '53%', c: 'R$ 6,25', mp: '182 mil', me: '38 – 41%' },
    { r: 'Extremo Sul', uf: 'BA', p: '149 mil', fim: '54%', c: 'R$ 5,73', mp: '123 mil', me: '41 – 43%', selo: 'Mais engajada da BA' },
    { r: 'Leste (litoral e vale)', uf: 'SC', p: '203 mil', fim: '57%', c: 'R$ 5,08', mp: '362 mil', mpDica: true, me: '50 – 51%', selo: 'Região campeã', top: true },
    { r: 'Oeste e Serra', uf: 'SC', p: '147 mil', fim: '55%', c: 'R$ 6,99', mp: null, me: null },
    { r: 'Grande Florianópolis', uf: 'SC', sub: 'cortes de 6s', p: '88 – 245 mil', fim: '66%', c: 'R$ 3,23', mp: null, me: null, selo: 'Menor custo por pessoa' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {regioes.map((g, i) => (
          <motion.div key={g.r} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-5 flex flex-col"
            style={{ boxShadow: shadow, outline: g.top ? `2px solid ${cor}` : 'none' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{g.uf}</span>
                <p className="text-base font-extrabold text-text mt-1.5">{g.r}</p>
                {g.sub && <p className="text-xs text-muted">{g.sub}</p>}
              </div>
              {g.selo && <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-md text-right" style={{ background: cor + '16', color: cor }}>{g.selo}</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl p-3" style={{ background: YT + '0a' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1" style={{ color: YT }}><Youtube size={12} /> YouTube</p>
                <p className="text-xl font-black tabular-nums text-text mt-1.5">{g.p}</p>
                <p className="text-[11px] text-muted">pessoas<Dica texto={g.sub ? GLOSSARIO.faixaCortes : GLOSSARIO.alcance} /></p>
                <p className="text-sm font-bold tabular-nums text-text mt-2">{g.fim} <span className="text-[11px] font-medium text-muted">até o fim<Dica texto={GLOSSARIO.fim} /></span></p>
                <p className="text-sm font-bold tabular-nums text-text">{g.c} <span className="text-[11px] font-medium text-muted">/mil pessoas<Dica texto={GLOSSARIO.custoPessoa} /></span></p>
              </div>
              <div className="rounded-xl p-3" style={{ background: META + '0a' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1" style={{ color: META }}><Facebook size={12} /> Meta</p>
                {g.mp ? (
                  <>
                    <p className="text-xl font-black tabular-nums text-text mt-1.5">{g.mp}</p>
                    <p className="text-[11px] text-muted">pessoas{g.mpDica && <> · estado todo<Dica texto={GLOSSARIO.metaSC} /></>}</p>
                    <p className="text-sm font-bold tabular-nums text-text mt-2">{g.me} <span className="text-[11px] font-medium text-muted">engajamento<Dica texto={GLOSSARIO.engMeta} /></span></p>
                  </>
                ) : (
                  <p className="text-xs text-muted mt-2 leading-relaxed">Incluído no total de Santa Catarina.<Dica texto={GLOSSARIO.metaSC} /></p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Grade>
        <Insight cor={cor} icon={Trophy} titulo="SC – Leste é a região campeã" texto="Maior alcance (203 mil pessoas), maior conclusão (57%) e entrega bem distribuída: Joinville, Florianópolis, Blumenau, Criciúma, Itajaí e Balneário Camboriú." />
        <Insight cor={cor} icon={Heart} titulo="Extremo Sul: a mais engajada da Bahia" texto="Nos dois canais. Porto Seguro e Trancoso têm as maiores taxas de visualização do estado (60–62%), e o Meta tem ali 43% de engajamento." />
        <Insight cor={cor} icon={Wallet} titulo="Salvador e Recôncavo: alcance mais barato" texto="R$ 4,83 por mil pessoas. Mas é onde o Meta engaja menos, porque o filme institucional recebeu 57% da verba ali." />
        <Insight cor={cor} icon={Sparkles} titulo="BA x SC no Meta: é o criativo" texto="Com o mesmo vídeo (família Cardoso), a diferença é de só 4 pontos. O total chega a 11 porque a BA recebeu 43% da verba no institucional, contra 8% em SC." />
      </Grade>
    </div>
  )
}

export default function CacarolaResultadosTri({ color = '#f87171' }) {
  const [aba, setAba] = useState('geral')

  return (
    <div className="w-full flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative z-10 rounded-3xl text-white"
        style={{ background: `linear-gradient(120deg, ${color} 0%, #ea580c 45%, #7c2d12 100%)` }}>
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/10" />
          <div className="absolute right-40 -bottom-32 w-72 h-72 rounded-full bg-white/5" />
        </div>
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">Caçarola · Arroz Edição Especial</p>
              <h2 className="text-2xl lg:text-4xl font-black mt-1.5 leading-tight">Resultados BA e SC · 1º Trimestre</h2>
              <p className="text-sm text-white/80 mt-2">Objetivo: engajamento (primário) e alcance (secundário)</p>
              <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-white/15 flex items-center gap-1.5"><Youtube size={12} /> YouTube · 24/07 a 23/10</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 flex items-center gap-1.5"><Facebook size={12} /> Meta · 24/08 a 23/10</span>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/75">Investimento total</p>
              <p className="text-4xl lg:text-5xl font-black tabular-nums">R$ 14.429</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-7">
            {[
              ['Exibições', '3,87 mi', GLOSSARIO.exibicoes],
              ['Contatos', '~1,7 mi', GLOSSARIO.contatos],
              ['Horas assistidas', '8.735 h', GLOSSARIO.horas],
              ['Até o fim · YouTube', '55%', GLOSSARIO.fim],
              ['Engajamentos · Meta', '1,15 mi', GLOSSARIO.engMeta],
              ['Frequência · Meta', '3,3', GLOSSARIO.frequencia],
            ].map(([l, v, d]) => (
              <div key={l} className="rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3" style={{ background: 'rgba(255,255,255,0.13)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">{l}{d && <Dica texto={d} claro />}</p>
                <p className="text-2xl font-black tabular-nums mt-1">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-[#f6f7fb]/90 backdrop-blur">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white w-full sm:w-fit overflow-x-auto" style={{ boxShadow: shadow }}>
          {ABAS.map(a => {
            const ativa = aba === a.id
            const c = a.id === 'youtube' ? YT : a.id === 'meta' ? META : color
            return (
              <button key={a.id} onClick={() => setAba(a.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                style={ativa ? { background: c, color: 'white' } : { color: '#6b7299' }}>
                <a.icon size={16} /> {a.label}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={aba} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
          {aba === 'geral'   && <VisaoGeral cor={color} />}
          {aba === 'youtube' && <YouTubeAba />}
          {aba === 'meta'    && <MetaAba />}
          {aba === 'regioes' && <RegioesAba cor={color} />}
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-muted text-center pb-2">Fontes: Google Ads (YouTube) e Gerenciador de Anúncios do Meta.</p>
    </div>
  )
}
