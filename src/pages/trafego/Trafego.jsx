import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronRight, Search, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import { NIVEIS, SAUDE, brl, num, cpa, insightsDaConta, saudeDaConta, totais, cpaCarteira, contaInflada } from './regras'
import { chamar, dataBR, formatarId, diasDesde, textoOtimizacao, Variacao, SemComparacao } from './componentes'
import Conta from './Conta'
import { SeletorPeriodo } from './periodo'

const soDigitos = v => String(v || '').replace(/\D/g, '')
const ATRASO_OTIMIZACAO = 7
const FUNDO_SAUDE = { critico: NIVEIS.critico.fundo, atencao: NIVEIS.atencao.fundo, ok: NIVEIS.positivo.fundo, parada: '#f3f4f6' }
const TEXTO_SAUDE = { critico: NIVEIS.critico.cor, atencao: NIVEIS.atencao.cor, ok: NIVEIS.positivo.cor, parada: '#6b7280' }

// Último resultado de cada período fica guardado neste navegador: a lista aparece na hora
// e os números novos chegam por trás. É só uma cópia de leitura; nada é gravado no Google Ads.
const CACHE = 'trafego:contas:v1:'
const lerCache = periodo => { try { return JSON.parse(localStorage.getItem(CACHE + periodo)) } catch { return null } }
const gravarCache = (periodo, dados) => { try { localStorage.setItem(CACHE + periodo, JSON.stringify({ em: Date.now(), dados })) } catch { /* sem espaço: segue sem cache */ } }

const atrasada = c => { const d = diasDesde(c.ultimaOtimizacao?.em); return d == null || d >= ATRASO_OTIMIZACAO }

const COLUNAS = [
  { id: 'nome', rotulo: 'Conta', valor: c => c.nome.toLowerCase() },
  { id: 'custo', rotulo: 'Investido', valor: c => c.atual?.custo || 0 },
  { id: 'conversoes', rotulo: 'Conversões', valor: c => c.atual?.conversoes || 0 },
  { id: 'cpa', rotulo: 'Custo/conv.', valor: c => (c.atual && cpa(c.atual)) ?? Infinity },
  { id: 'otimizada', rotulo: 'Otimizada', valor: c => diasDesde(c.ultimaOtimizacao?.em) ?? 9999 },
]
const GRADE = 'md:grid md:grid-cols-[minmax(0,1fr)_5.5rem_7rem_6.5rem_7rem_6.5rem_1rem] md:gap-4 md:items-center'

function Grafico({ serie }) {
  if (!serie || serie.length < 2) return <span className="hidden md:block" />
  const max = Math.max(...serie)
  if (!max) return <span className="hidden md:block text-[11px] text-muted text-center">sem gasto</span>
  const w = 88, h = 26
  const pts = serie.map((v, i) => [i / (serie.length - 1) * w, h - 2 - v / max * (h - 4)])
  const linha = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')
  const ultimo = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="hidden md:block overflow-visible" aria-hidden="true">
      <polygon points={`0,${h} ${linha} ${w},${h}`} fill="#6eda2c" opacity="0.14" />
      <polyline points={linha} fill="none" stroke="#4a9c1c" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={ultimo[0]} cy={ultimo[1]} r="2.2" fill={serie[serie.length - 1] > 0 ? '#4a9c1c' : NIVEIS.critico.cor} />
    </svg>
  )
}

function Situacao({ saude }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: TEXTO_SAUDE[saude], background: FUNDO_SAUDE[saude] }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: SAUDE[saude].cor }} />
      {SAUDE[saude].rotulo}
    </span>
  )
}

function Otimizada({ conta }) {
  const dias = diasDesde(conta.ultimaOtimizacao?.em)
  const texto = textoOtimizacao(dias)
  if (conta.saude === 'parada') return <span className="text-xs text-muted">—</span>
  if (dias == null) return <span className="text-xs text-muted">Nunca</span>
  return <span className="text-xs font-semibold" style={dias >= ATRASO_OTIMIZACAO ? { color: NIVEIS.atencao.cor } : { color: '#6b7280' }}>{texto}</span>
}

function LinhaConta({ conta, onAbrir }) {
  const motivo = conta.insights.find(x => x.nivel === 'critico' || x.nivel === 'atencao')
  const inflada = contaInflada(conta)
  const custoConv = conta.atual && cpa(conta.atual)
  return (
    <li>
      <button onClick={() => onAbrir(conta.id)}
        className={`group w-full text-left px-5 py-3.5 hover:bg-surface-2/50 focus-visible:outline-none focus-visible:bg-surface-2 ${GRADE}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm font-semibold text-text truncate" title={conta.nome}>{conta.nome}</p>
          </div>
          <div className="mt-1 flex items-center gap-2 min-w-0">
            <Situacao saude={conta.saude} />
            <p className="text-xs text-text-2 truncate">
              {conta.erro && !conta.situacao ? 'Não foi possível ler esta conta' : motivo?.titulo || (conta.saude === 'ok' ? 'Sem alertas' : '')}
            </p>
          </div>
          <p className="text-[11px] text-muted mt-1 truncate">{conta.gestor ? `${conta.gestor} · ` : ''}{formatarId(conta.id)}</p>
        </div>

        {!conta.erro
          ? (
            <>
              <Grafico serie={conta.serie} />
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold tabular-nums text-text">{brl(conta.atual.custo)}</p>
                <Variacao atual={conta.atual.custo} anterior={conta.anterior.custo} bomQuandoSobe={null} />
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm tabular-nums text-text">{num(conta.atual.conversoes)}</p>
                {inflada ? <SemComparacao /> : <Variacao atual={conta.atual.conversoes} anterior={conta.anterior.conversoes} />}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm tabular-nums text-text">{custoConv == null ? '—' : brl(custoConv)}</p>
                {!inflada && custoConv != null && <Variacao atual={custoConv} anterior={cpa(conta.anterior)} bomQuandoSobe={false} />}
              </div>
              <div className="hidden md:block text-right"><Otimizada conta={conta} /></div>
              <ChevronRight size={15} className="hidden md:block text-muted group-hover:text-text" />
              <p className="md:hidden mt-2 text-xs text-text-2 tabular-nums">
                <b className="text-text">{brl(conta.atual.custo)}</b> · {num(conta.atual.conversoes)} conv. · {custoConv == null ? '—' : brl(custoConv)}/conv. · otimizada: {textoOtimizacao(diasDesde(conta.ultimaOtimizacao?.em)).toLowerCase()}
              </p>
            </>
          )
          : <span className="hidden md:block md:col-span-6" />}
      </button>
    </li>
  )
}

function Resumo({ contas, periodo }) {
  const t = totais(contas)
  const cpaAtual = cpaCarteira(t.atual), cpaAnt = cpaCarteira(t.anterior)
  const itens = [
    ['Investido', brl(t.atual.custo), <Variacao key="v" atual={t.atual.custo} anterior={t.anterior.custo} bomQuandoSobe={null} />],
    ['Conversões', num(t.atual.conversoes), <Variacao key="v" atual={t.atual.conversoes} anterior={t.anterior.conversoes} />],
    ['Custo por conversão', cpaAtual == null ? '—' : brl(cpaAtual), <Variacao key="v" atual={cpaAtual} anterior={cpaAnt} bomQuandoSobe={false} />],
  ]
  return (
    <section className="bg-white rounded-2xl card-shadow px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x divide-border" aria-label="Resumo da carteira">
      {itens.map(([r, v, variacao], i) => (
        <div key={r} className={i ? 'sm:pl-5' : ''}>
          <p className="text-xs font-semibold text-muted">{r}</p>
          <p className="text-2xl font-extrabold text-text tabular-nums mt-0.5">{v}</p>
          <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">{variacao}<span>vs {dataBR(periodo.iniAnt)} a {dataBR(periodo.fimAnt)}</span></p>
        </div>
      ))}
    </section>
  )
}

function MinhasContas({ contas, gestores, onAbrir }) {
  const [gestor, setGestor] = useState('todos')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState(null)
  const [filtro, setFiltro] = useState('todas')
  const [verParadas, setVerParadas] = useState(false)

  const termo = busca.trim().toLowerCase()
  const base = contas
    .filter(c => gestor === 'todos' || (gestor === 'sem' ? !c.gestorId : c.gestorId === gestor))
    .filter(c => !termo || c.nome.toLowerCase().includes(termo) || soDigitos(c.id).includes(soDigitos(termo) || '-'))
  const investindo = base.filter(c => c.saude !== 'parada')
  const paradas = base.filter(c => c.saude === 'parada')
  const contagem = {
    todas: investindo.length,
    critico: investindo.filter(c => c.saude === 'critico').length,
    atencao: investindo.filter(c => c.saude === 'atencao').length,
    ok: investindo.filter(c => c.saude === 'ok').length,
    atrasadas: investindo.filter(atrasada).length,
  }
  const coluna = ordem && COLUNAS.find(c => c.id === ordem.id)
  const lista = investindo
    .filter(c => filtro === 'todas' || (filtro === 'atrasadas' ? atrasada(c) : c.saude === filtro))
    .sort((a, b) => {
      if (!coluna) return SAUDE[a.saude].ordem - SAUDE[b.saude].ordem || b.atual.custo - a.atual.custo
      const x = coluna.valor(a), y = coluna.valor(b)
      return (x < y ? -1 : x > y ? 1 : 0) * (ordem.desc ? -1 : 1)
    })
  const ordenar = id => setOrdem(o => (o?.id === id ? { id, desc: !o.desc } : { id, desc: id !== 'nome' }))
  const FILTROS = [
    ['todas', 'Todas', null], ['critico', 'Urgentes', SAUDE.critico.cor], ['atencao', 'Atenção', SAUDE.atencao.cor],
    ['ok', 'Saudáveis', SAUDE.ok.cor], ['atrasadas', `Sem otimização há ${ATRASO_OTIMIZACAO}+ dias`, null],
  ]

  return (
    <section className="bg-white rounded-2xl card-shadow">
      <div className="px-5 pt-4 pb-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-text mr-auto">Contas investindo</h2>
          <select value={gestor} onChange={e => setGestor(e.target.value)} aria-label="Gestor"
            className="text-sm px-3 py-1.5 rounded-lg bg-white border border-border outline-none focus:ring-2 focus:ring-accent/30">
            <option value="todos">Todos os gestores</option>
            {gestores.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
            {contas.some(c => !c.gestorId) && <option value="sem">Sem gestor no hub</option>}
          </select>
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 w-full sm:w-56 focus-within:ring-2 focus-within:ring-accent/40">
            <Search size={13} className="text-muted flex-shrink-0" />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar conta ou ID" aria-label="Buscar conta"
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted" />
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por situação">
          {FILTROS.map(([k, r, cor]) => (
            <button key={k} onClick={() => setFiltro(k)} aria-pressed={filtro === k} disabled={k !== 'todas' && !contagem[k]}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-default ${filtro === k ? 'bg-text text-white' : 'bg-surface-2 text-text-2 hover:bg-border'}`}>
              {cor && <span className="w-1.5 h-1.5 rounded-full" style={{ background: cor }} />}
              {r}<span className={`tabular-nums ${filtro === k ? 'text-white/70' : 'text-muted'}`}>{contagem[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`hidden md:grid px-5 py-2 border-y border-border bg-surface-2/30 ${GRADE}`}>
        {COLUNAS.map((c, i) => [
          <button key={c.id} onClick={() => ordenar(c.id)} aria-sort={ordem?.id === c.id ? (ordem.desc ? 'descending' : 'ascending') : undefined}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-text ${i > 0 ? 'justify-end' : ''}`}>
            {c.rotulo}
            {ordem?.id === c.id && (ordem.desc ? <ArrowDown size={11} /> : <ArrowUp size={11} />)}
          </button>,
          i === 0 && <span key="g" className="text-[11px] font-semibold text-muted text-center">Gasto diário</span>,
        ])}
        <span />
      </div>
      {!coluna && <p className="sr-only">Ordenado por situação: urgentes primeiro.</p>}

      {lista.length === 0
        ? <p className="px-5 py-8 text-sm text-muted text-center">Nenhuma conta neste filtro.</p>
        : <ul className="divide-y divide-border">{lista.map(c => <LinhaConta key={c.id} conta={c} onAbrir={onAbrir} />)}</ul>}

      {paradas.length > 0 && (
        <div className="border-t border-border">
          <button onClick={() => setVerParadas(v => !v)} aria-expanded={verParadas}
            className="px-5 py-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text">
            {verParadas ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {paradas.length} {paradas.length === 1 ? 'conta' : 'contas'} sem investimento
          </button>
          {verParadas && <ul className="divide-y divide-border border-t border-border">{paradas.map(c => <LinhaConta key={c.id} conta={c} onAbrir={onAbrir} />)}</ul>}
        </div>
      )}
    </section>
  )
}

function Esqueleto() {
  const barra = (w, h = 'h-3') => <div className={`${h} rounded bg-surface-2 animate-pulse`} style={{ width: w }} />
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Carregando as contas">
      <div className="bg-white rounded-2xl card-shadow p-5 grid grid-cols-3 gap-4">{[0, 1, 2].map(i => <div key={i} className="space-y-2">{barra('40%')}{barra('60%', 'h-6')}</div>)}</div>
      <div className="bg-white rounded-2xl card-shadow p-5 space-y-6">
        {barra('25%', 'h-4')}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">{barra('35%')}{barra('12%')}{barra('10%')}{barra('12%')}</div>
        ))}
      </div>
    </div>
  )
}

function minutosDesde(ms) {
  const m = Math.round((Date.now() - ms) / 60000)
  return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`
}

export default function Trafego() {
  const [periodo, setPeriodo] = useState('d30')
  const [dados, setDados] = useState(() => lerCache('d30')?.dados || null)
  const [atualizadoEm, setAtualizadoEm] = useState(() => lerCache('d30')?.em || null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [params, setParams] = useSearchParams()
  const contaAberta = params.get('conta')
  const { erpClients = [], collaborators = [] } = useData()

  // Trocar de período no meio de uma leitura descarta a resposta antiga.
  const pedido = useRef(0)
  const [versao, setVersao] = useState(0)
  const carregar = useCallback(async () => {
    const meu = ++pedido.current
    const guardado = lerCache(periodo)
    if (guardado) { setDados(guardado.dados); setAtualizadoEm(guardado.em) }
    setCarregando(true)
    setErro('')
    try {
      const r = await chamar({ acao: 'contas', periodo })
      if (meu !== pedido.current) return
      setDados(r)
      setAtualizadoEm(Date.now())
      gravarCache(periodo, r)
    } catch (e) {
      if (meu === pedido.current) setErro(e.message)
    } finally {
      if (meu === pedido.current) setCarregando(false)
    }
  }, [periodo])
  const atualizar = () => { setVersao(v => v + 1); carregar() }

  useEffect(() => { carregar() }, [carregar])

  // Cada conta do Google Ads é ligada ao cliente do hub pelo Customer ID e, por ele, ao gestor responsável.
  const contas = useMemo(() => {
    const clientePorConta = new Map(erpClients.filter(c => c.googleAdsId).map(c => [soDigitos(c.googleAdsId), c]))
    const nomeGestor = id => collaborators.find(c => c.id === id)?.name
    return (dados?.contas || []).map(c => {
      const insights = insightsDaConta(c)
      const cliente = clientePorConta.get(c.id)
      return {
        ...c, insights, saude: saudeDaConta(c, insights),
        gestorId: cliente?.manager || null,
        gestor: cliente?.manager ? nomeGestor(cliente.manager) : null,
        ultimaOtimizacao: dados.otimizacoes?.[c.id] || null,
      }
    })
  }, [dados, erpClients, collaborators])

  const gestores = useMemo(() => {
    const ids = [...new Set(contas.map(c => c.gestorId).filter(Boolean))]
    return ids.map(id => ({ id, nome: collaborators.find(c => c.id === id)?.name || id })).sort((a, b) => a.nome.localeCompare(b.nome))
  }, [contas, collaborators])

  const abrir = id => { setParams({ conta: id }); window.scrollTo({ top: 0 }) }
  const voltar = () => { setParams({}); carregar() }
  const conta = contaAberta && contas.find(c => c.id === contaAberta)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Tráfego</h1>
          <p className="text-sm text-muted mt-0.5 flex flex-wrap items-center gap-x-1.5">
            <span>Google Ads</span>
            {dados && !conta && <span>· {dataBR(dados.periodo.ini)} a {dataBR(dados.periodo.fim)}</span>}
            {!conta && (carregando
              ? <span className="inline-flex items-center gap-1">· <Loader2 size={12} className="animate-spin" />atualizando</span>
              : atualizadoEm && <span>· atualizado {minutosDesde(atualizadoEm)}</span>)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeletorPeriodo valor={periodo} onMudar={setPeriodo} />
          <button onClick={atualizar} disabled={carregando} aria-label="Atualizar os dados" title="Buscar os números mais recentes"
            className="p-2.5 rounded-xl bg-white card-shadow text-text-2 hover:text-text disabled:opacity-50">
            <RefreshCw size={15} className={carregando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {erro && (
        <div className="p-5 rounded-2xl bg-white card-shadow">
          <p className="text-sm font-semibold" style={{ color: NIVEIS.critico.cor }}>Não foi possível atualizar as contas.</p>
          <p className="text-sm text-text-2 mt-1">{erro}{dados && ' Os números abaixo são da última leitura.'}</p>
          <button onClick={carregar} className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl bg-surface-2 hover:bg-border">Tentar de novo</button>
        </div>
      )}

      {!dados && carregando && <Esqueleto />}

      {dados && (
        conta
          ? <Conta key={`${conta.id}-${periodo}-${versao}`} conta={conta} periodo={periodo} onVoltar={voltar} />
          : (
            <>
              <Resumo contas={contas} periodo={dados.periodo} />
              <MinhasContas contas={contas} gestores={gestores} onAbrir={abrir} />
            </>
          )
      )}
    </div>
  )
}
