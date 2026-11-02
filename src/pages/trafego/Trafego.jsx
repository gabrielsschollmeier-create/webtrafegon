import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronRight, Search, ArrowUp, ArrowDown } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import { NIVEIS, SAUDE, brl, num, cpa, insightsDaConta, saudeDaConta, totais, cpaCarteira } from './regras'
import { chamar, dataBR, formatarId, diasDesde, textoOtimizacao } from './componentes'
import Conta from './Conta'

const PERIODOS = [7, 14, 30, 90]
const soDigitos = v => String(v || '').replace(/\D/g, '')

const COLUNAS = [
  { id: 'nome', rotulo: 'Conta', valor: c => c.nome.toLowerCase() },
  { id: 'custo', rotulo: 'Investido', valor: c => c.atual?.custo || 0 },
  { id: 'conversoes', rotulo: 'Conversões', valor: c => c.atual?.conversoes || 0 },
  { id: 'cpa', rotulo: 'Custo/conv.', valor: c => (c.atual && cpa(c.atual)) ?? Infinity },
  { id: 'otimizada', rotulo: 'Otimizada', valor: c => diasDesde(c.ultimaOtimizacao?.em) ?? 9999 },
]
const GRADE = 'md:grid md:grid-cols-[minmax(0,1fr)_7rem_6rem_7rem_6.5rem] md:gap-4 md:items-center'

function LinhaConta({ conta, onAbrir }) {
  const motivo = conta.insights.find(x => x.nivel === 'critico' || x.nivel === 'atencao')
  const dias = diasDesde(conta.ultimaOtimizacao?.em)
  return (
    <li>
      <button onClick={() => onAbrir(conta.id)}
        className={`w-full text-left px-5 py-3 hover:bg-surface-2/60 focus-visible:outline-none focus-visible:bg-surface-2 ${GRADE}`}>
        <div className="flex gap-3 min-w-0">
          <span className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0" style={{ background: SAUDE[conta.saude].cor }}
            title={motivo?.titulo || SAUDE[conta.saude].rotulo} aria-label={SAUDE[conta.saude].rotulo} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{conta.nome}</p>
            <p className="text-xs text-muted truncate">
              {conta.gestor || formatarId(conta.id)}
              {conta.erro
                ? <span style={{ color: NIVEIS.critico.cor }}> · não foi possível ler esta conta</span>
                : motivo && <span style={{ color: NIVEIS[motivo.nivel].cor }}> · {motivo.titulo}</span>}
            </p>
          </div>
        </div>
        {!conta.erro && (
          <>
            <p className="hidden md:block text-sm text-right tabular-nums">{brl(conta.atual.custo)}</p>
            <p className="hidden md:block text-sm text-right tabular-nums">{num(conta.atual.conversoes)}</p>
            <p className="hidden md:block text-sm text-right tabular-nums">{cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))}</p>
            <p className={`hidden md:block text-sm text-right ${dias == null || dias >= 7 ? 'font-semibold text-text-2' : 'text-muted'}`}>{textoOtimizacao(dias)}</p>
            <p className="md:hidden mt-1 pl-5 text-xs text-text-2 tabular-nums">
              {brl(conta.atual.custo)} · {num(conta.atual.conversoes)} conv. · {cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))}/conv. · otimizada: {textoOtimizacao(dias).toLowerCase()}
            </p>
          </>
        )}
      </button>
    </li>
  )
}

function MinhasContas({ contas, gestores, onAbrir }) {
  const [gestor, setGestor] = useState('todos')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState({ id: 'custo', desc: true })
  const [verParadas, setVerParadas] = useState(false)

  const termo = busca.trim().toLowerCase()
  const coluna = COLUNAS.find(c => c.id === ordem.id)
  const filtradas = contas
    .filter(c => gestor === 'todos' || (gestor === 'sem' ? !c.gestorId : c.gestorId === gestor))
    .filter(c => !termo || c.nome.toLowerCase().includes(termo))
    .sort((a, b) => {
      const x = coluna.valor(a), y = coluna.valor(b)
      return (x < y ? -1 : x > y ? 1 : 0) * (ordem.desc ? -1 : 1)
    })
  const ativas = filtradas.filter(c => c.saude !== 'parada')
  const paradas = filtradas.filter(c => c.saude === 'parada')
  const ordenar = id => setOrdem(o => ({ id, desc: o.id === id ? !o.desc : id !== 'nome' }))

  return (
    <section className="bg-white rounded-2xl card-shadow">
      <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold text-text mr-auto">Minhas contas <span className="text-muted font-normal">({ativas.length})</span></h2>
        <select value={gestor} onChange={e => setGestor(e.target.value)} aria-label="Gestor"
          className="text-sm px-3 py-1.5 rounded-lg bg-white border border-border outline-none focus:ring-2 focus:ring-accent/30">
          <option value="todos">Todos os gestores</option>
          {gestores.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
          {contas.some(c => !c.gestorId) && <option value="sem">Sem gestor no hub</option>}
        </select>
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 w-full sm:w-56 focus-within:ring-2 focus-within:ring-accent/40">
          <Search size={13} className="text-muted flex-shrink-0" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar conta" aria-label="Buscar conta"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted" />
        </label>
      </div>

      <div className={`hidden md:grid px-5 py-2 border-y border-border ${GRADE}`}>
        {COLUNAS.map((c, i) => (
          <button key={c.id} onClick={() => ordenar(c.id)} aria-sort={ordem.id === c.id ? (ordem.desc ? 'descending' : 'ascending') : undefined}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-text ${i > 0 ? 'justify-end' : 'pl-5'}`}>
            {c.rotulo}
            {ordem.id === c.id && (ordem.desc ? <ArrowDown size={11} /> : <ArrowUp size={11} />)}
          </button>
        ))}
      </div>

      {ativas.length === 0
        ? <p className="px-5 py-6 text-sm text-muted">Nenhuma conta investindo neste filtro.</p>
        : <ul className="divide-y divide-border">{ativas.map(c => <LinhaConta key={c.id} conta={c} onAbrir={onAbrir} />)}</ul>}

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
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-6" aria-busy="true" aria-label="Carregando as contas">
      {barra('25%', 'h-4')}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">{barra('35%')}{barra('12%')}{barra('10%')}{barra('12%')}</div>
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
  const { erpClients = [], collaborators = [] } = useData()

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
  const t = totais(contas)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Tráfego</h1>
          <p className="text-sm text-muted mt-0.5">
            Google Ads
            {dados && ` · ${dataBR(dados.periodo.ini)} a ${dataBR(dados.periodo.fim)}`}
            {dados && !conta && ` · ${brl(t.atual.custo)} investidos · ${num(t.atual.conversoes)} conversões · ${cpaCarteira(t.atual) == null ? '—' : brl(cpaCarteira(t.atual))} por conversão`}
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

      {erro && (
        <div className="p-5 rounded-2xl bg-white card-shadow">
          <p className="text-sm font-semibold" style={{ color: NIVEIS.critico.cor }}>Não foi possível carregar as contas.</p>
          <p className="text-sm text-text-2 mt-1">{erro}</p>
          <button onClick={carregar} className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl bg-surface-2 hover:bg-border">Tentar de novo</button>
        </div>
      )}

      {carregando && !dados && <Esqueleto />}

      {dados && (
        <div className={`transition-opacity ${carregando ? 'opacity-60 pointer-events-none' : ''}`}>
          {conta
            ? <Conta key={conta.id + dias} conta={conta} dias={dias} onVoltar={voltar} />
            : <MinhasContas contas={contas} gestores={gestores} onAbrir={abrir} />}
        </div>
      )}
    </div>
  )
}
