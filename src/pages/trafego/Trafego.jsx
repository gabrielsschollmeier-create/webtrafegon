import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronRight, Search, CircleCheck } from 'lucide-react'
import {
  NIVEIS, SAUDE, brl, num, cpa, semInvestimento, contaInflada,
  insightsDaConta, saudeDaConta, totais, cpaCarteira,
} from './regras'
import {
  chamar, Ajuda, Variacao, SemComparacao, Numero, PontoSaude, Tarefa, Bloco, ListaComLimite, dataBR, formatarId,
} from './componentes'
import DetalheConta from './Conta'

const PERIODOS = [7, 14, 30, 90]
const LIMITE_HOJE = 6

function ParaResolverHoje({ contas, onAbrirConta }) {
  const itens = contas.flatMap(c => c.insights.map(x => ({ x, conta: c })))
  const urgentes = itens.filter(({ x }) => x.nivel === 'critico' || x.nivel === 'atencao')
    .sort((p, q) => NIVEIS[p.x.nivel].ordem - NIVEIS[q.x.nivel].ordem || q.x.impacto - p.x.impacto)
  const oportunidades = itens.filter(({ x }) => x.nivel === 'oportunidade')

  return (
    <>
      <Bloco titulo="Para resolver hoje"
        descricao={urgentes.length
          ? `${urgentes.length} ${urgentes.length === 1 ? 'ponto' : 'pontos'} em ${new Set(urgentes.map(i => i.conta.id)).size} contas, do mais urgente para o menos urgente.`
          : 'Nenhum problema encontrado nas contas.'}>
        {urgentes.length === 0
          ? <p className="py-6 flex items-center gap-2 text-sm text-text-2"><CircleCheck size={16} className="text-accent-hover" />Tudo em ordem. Vale olhar as oportunidades abaixo.</p>
          : <ListaComLimite itens={urgentes} limite={LIMITE_HOJE} rotuloMais={n => `Ver mais ${n} pontos`}
              render={({ x, conta }, i) => <Tarefa key={conta.id + i + x.titulo} item={x} conta={conta} onAbrirConta={onAbrirConta} />} />}
      </Bloco>
      {oportunidades.length > 0 && (
        <Bloco titulo="Oportunidades" descricao="Campanhas que podem render mais. Não são urgentes.">
          <ListaComLimite itens={oportunidades} limite={3} rotuloMais={n => `Ver mais ${n} oportunidades`}
            render={({ x, conta }, i) => <Tarefa key={conta.id + i + x.titulo} item={x} conta={conta} onAbrirConta={onAbrirConta} />} />
        </Bloco>
      )}
    </>
  )
}

function LinhaConta({ conta, onAbrir }) {
  const pontos = conta.insights.filter(x => x.nivel === 'critico' || x.nivel === 'atencao').length
  const inflada = contaInflada(conta)
  return (
    <li>
      <button onClick={() => onAbrir(conta.id)}
        className="w-full text-left py-3.5 grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_minmax(0,1.2fr)_auto] gap-x-4 gap-y-2 items-center hover:bg-surface-2/40 focus-visible:bg-surface-2/60 focus-visible:outline-none -mx-5 px-5">
        <div className="min-w-0 flex items-center gap-2.5">
          <PontoSaude saude={conta.saude} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{conta.nome}</p>
            <p className="text-xs text-muted">{formatarId(conta.id)}</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-muted md:order-last" />
        {conta.erro ? (
          <p className="col-span-2 md:col-span-4 text-sm" style={{ color: NIVEIS.critico.cor }}>Não foi possível ler esta conta.</p>
        ) : (<>
          <div className="col-span-2 md:col-span-1 grid grid-cols-3 gap-4 md:contents">
            <div className="tabular-nums"><p className="text-sm font-semibold text-text">{brl(conta.atual.custo)}</p><Variacao atual={conta.atual.custo} anterior={conta.anterior.custo} bomQuandoSobe={null} /></div>
            <div className="tabular-nums"><p className="text-sm font-semibold text-text">{num(conta.atual.conversoes)}</p>{inflada ? <SemComparacao /> : <Variacao atual={conta.atual.conversoes} anterior={conta.anterior.conversoes} />}</div>
            <div className="tabular-nums"><p className="text-sm font-semibold text-text">{cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))}</p>{inflada ? <SemComparacao /> : <Variacao atual={cpa(conta.atual)} anterior={cpa(conta.anterior)} bomQuandoSobe={false} />}</div>
          </div>
          <p className="col-span-2 md:col-span-1 text-xs font-semibold" style={{ color: pontos ? SAUDE[conta.saude].cor : '#7680a8' }}>
            {pontos ? `${pontos} ${pontos === 1 ? 'ponto' : 'pontos'} a resolver` : 'Nada a resolver'}
          </p>
        </>)}
      </button>
    </li>
  )
}

function ListaContas({ contas, onAbrir }) {
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [verParadas, setVerParadas] = useState(false)

  const ativas = contas.filter(c => c.saude !== 'parada')
  const paradas = contas.filter(c => c.saude === 'parada')
  const contagem = k => ativas.filter(c => c.saude === k).length
  const filtros = [
    ['todas', `Todas (${ativas.length})`],
    ['critico', `Urgentes (${contagem('critico')})`],
    ['atencao', `Com atenção (${contagem('atencao')})`],
    ['ok', `Saudáveis (${contagem('ok')})`],
  ]
  const termo = busca.trim().toLowerCase()
  const visiveis = ativas
    .filter(c => filtro === 'todas' || c.saude === filtro)
    .filter(c => !termo || c.nome.toLowerCase().includes(termo))
    .sort((x, y) => SAUDE[x.saude].ordem - SAUDE[y.saude].ordem || (y.atual?.custo || 0) - (x.atual?.custo || 0))
  const paradasVisiveis = paradas.filter(c => !termo || c.nome.toLowerCase().includes(termo))

  return (
    <Bloco titulo="Contas" descricao="Da que precisa de mais cuidado para a mais saudável. Clique para ver os detalhes.">
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-2">
        {filtros.map(([k, rotulo]) => (
          <button key={k} onClick={() => setFiltro(k)} aria-pressed={filtro === k}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${filtro === k ? 'bg-text text-white' : 'bg-surface-2 text-text-2 hover:bg-border'}`}>
            {rotulo}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 w-full sm:w-56 focus-within:ring-2 focus-within:ring-accent/40">
          <Search size={13} className="text-muted flex-shrink-0" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar conta" aria-label="Buscar conta"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted" />
        </label>
      </div>
      <div className="hidden md:grid grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_minmax(0,1.2fr)_auto] gap-x-4 pt-3 pb-2 text-xs text-muted border-b border-border">
        <span>Conta</span><span>Investido</span>
        <span className="flex items-center gap-1">Conversões <Ajuda chave="conversao" /></span>
        <span className="flex items-center gap-1">Custo por conversão <Ajuda chave="custoConv" /></span>
        <span>Situação</span><span className="w-4" />
      </div>
      {visiveis.length === 0
        ? <p className="py-6 text-sm text-muted">Nenhuma conta neste filtro.</p>
        : <ul className="divide-y divide-border">{visiveis.map(c => <LinhaConta key={c.id} conta={c} onAbrir={onAbrir} />)}</ul>}
      {paradasVisiveis.length > 0 && filtro === 'todas' && (
        <div className="border-t border-border">
          <button onClick={() => setVerParadas(v => !v)} aria-expanded={verParadas}
            className="py-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text">
            {verParadas ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {paradasVisiveis.length} contas sem investimento neste período e no anterior
          </button>
          {verParadas && <ul className="divide-y divide-border border-t border-border">{paradasVisiveis.map(c => <LinhaConta key={c.id} conta={c} onAbrir={onAbrir} />)}</ul>}
        </div>
      )}
    </Bloco>
  )
}

function Esqueleto() {
  const barra = (w, h = 'h-3') => <div className={`${h} rounded bg-surface-2 animate-pulse`} style={{ width: w }} />
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Carregando as contas">
      {[6, 8].map((linhas, b) => (
        <div key={b} className="bg-white rounded-2xl card-shadow p-5 space-y-5">
          {barra('30%', 'h-4')}
          {Array.from({ length: linhas }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">{barra('18%')}{barra('45%')}{barra('12%')}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Trafego() {
  const [dias, setDias] = useState(30)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [params, setParams] = useSearchParams()
  const contaAberta = params.get('conta')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      setDados(await chamar({ acao: 'contas', dias }))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [dias])

  useEffect(() => { carregar() }, [carregar])

  const contas = useMemo(() => (dados?.contas || []).map(c => {
    const insights = insightsDaConta(c)
    return { ...c, insights, saude: saudeDaConta(c, insights) }
  }), [dados])

  const abrirConta = id => { setParams({ conta: id }); window.scrollTo({ top: 0 }) }
  const voltar = () => setParams({})
  const conta = contaAberta && contas.find(c => c.id === contaAberta)
  const t = totais(contas)
  const investindo = contas.filter(c => !semInvestimento(c) && !c.erro).length

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Tráfego</h1>
          <p className="text-sm text-muted mt-0.5">
            Google Ads
            {dados && ` · ${dataBR(dados.periodo.ini)} a ${dataBR(dados.periodo.fim)}, comparado aos ${dados.dias} dias anteriores`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-xl card-shadow p-1" role="group" aria-label="Período">
            {PERIODOS.map(d => (
              <button key={d} onClick={() => setDias(d)} disabled={carregando} aria-pressed={dias === d}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:cursor-wait ${dias === d ? 'bg-text text-white' : 'text-text-2 hover:bg-surface-2'}`}>
                {d} dias
              </button>
            ))}
          </div>
          <button onClick={carregar} disabled={carregando} aria-label="Atualizar os dados"
            className="p-2.5 rounded-xl bg-white card-shadow text-text-2 hover:text-text disabled:opacity-50">
            <RefreshCw size={15} className={carregando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {dados && !conta && (
        <div className="flex flex-wrap gap-x-8 gap-y-3 px-1 text-sm">
          <Numero rotulo="Investido na carteira" valor={brl(t.atual.custo)}><Variacao atual={t.atual.custo} anterior={t.anterior.custo} bomQuandoSobe={null} /></Numero>
          <Numero rotulo="Conversões" valor={num(t.atual.conversoes)} ajuda="conversao"><Variacao atual={t.atual.conversoes} anterior={t.anterior.conversoes} /></Numero>
          <Numero rotulo="Custo por conversão médio" valor={cpaCarteira(t.atual) == null ? '—' : brl(cpaCarteira(t.atual))} ajuda="custoConv"><Variacao atual={cpaCarteira(t.atual)} anterior={cpaCarteira(t.anterior)} bomQuandoSobe={false} /></Numero>
          <Numero rotulo="Contas investindo" valor={`${investindo} de ${contas.length}`} />
          {t.excluidas.length > 0 && (
            <p className="basis-full text-xs text-muted">
              Conversões e custo médio não incluem {t.excluidas.map(c => c.nome).join(' e ')}, por conversões infladas.
            </p>
          )}
        </div>
      )}

      {erro && (
        <div className="p-5 rounded-2xl bg-white card-shadow">
          <p className="text-sm font-semibold" style={{ color: NIVEIS.critico.cor }}>Não foi possível carregar as contas.</p>
          <p className="text-sm text-text-2 mt-1">{erro}</p>
          <button onClick={carregar} className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl bg-surface-2 hover:bg-border">Tentar de novo</button>
        </div>
      )}

      {carregando && !dados && <Esqueleto />}

      {dados && (
        <div className={`space-y-4 transition-opacity ${carregando ? 'opacity-60 pointer-events-none' : ''}`}>
          {conta
            ? <DetalheConta conta={conta} dias={dias} onVoltar={voltar} />
            : <>
                <ParaResolverHoje contas={contas} onAbrirConta={abrirConta} />
                <ListaContas contas={contas} onAbrir={abrirConta} />
              </>}
        </div>
      )}
    </div>
  )
}
