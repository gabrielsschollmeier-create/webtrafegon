import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronRight, Search, ArrowRight } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import {
  NIVEIS, SAUDE, brl, num, cpa, semInvestimento, contaInflada,
  insightsDaConta, saudeDaConta, totais, cpaCarteira,
} from './regras'
import { chamar, Variacao, SemComparacao, Numero, PontoSaude, Bloco, dataBR, formatarId } from './componentes'
import Otimizar from './Otimizar'

const PERIODOS = [7, 14, 30, 90]
const DIA = 86400000

const soDigitos = v => String(v || '').replace(/\D/g, '')

function diasDesde(iso) {
  return iso ? Math.floor((Date.now() - new Date(iso).getTime()) / DIA) : null
}

function textoOtimizacao(dias) {
  if (dias == null) return 'Nunca otimizada pelo hub'
  if (dias === 0) return 'Otimizada hoje'
  if (dias === 1) return 'Otimizada ontem'
  return `Otimizada há ${dias} dias`
}

// Prioridade da lista do dia: urgência primeiro; no mesmo nível, a que está há mais tempo sem otimização.
function prioridade(c) {
  const dias = diasDesde(c.ultimaOtimizacao?.em)
  return SAUDE[c.saude].ordem * 1000 - (dias == null ? 999 : Math.min(dias, 998))
}

function LinhaDoDia({ conta, onOtimizar }) {
  const dias = diasDesde(conta.ultimaOtimizacao?.em)
  const principal = conta.insights.find(x => x.nivel === 'critico' || x.nivel === 'atencao')
  const atrasada = dias == null || dias >= 7
  const inflada = contaInflada(conta)
  return (
    <li className="py-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
        <div className="flex-1 min-w-0 flex gap-3">
          <span className="mt-1.5"><PontoSaude saude={conta.saude} /></span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text">{conta.nome}</p>
            <p className="text-xs text-muted">
              {formatarId(conta.id)}{conta.gestor && ` · ${conta.gestor}`} · <span className={atrasada ? 'font-semibold text-text-2' : ''}>{textoOtimizacao(dias)}</span>
            </p>
            {conta.erro
              ? <p className="text-sm mt-1" style={{ color: NIVEIS.critico.cor }}>Não foi possível ler esta conta.</p>
              : principal
                ? <p className="text-sm mt-1" style={{ color: NIVEIS[principal.nivel].cor }}>
                    {principal.titulo}
                    {conta.pendencias > 1 && <span className="text-muted"> e mais {conta.pendencias - 1}</span>}
                  </p>
                : <p className="text-sm text-muted mt-1">Sem alertas.</p>}
          </div>
        </div>
        {!conta.erro && (
          <div className="grid grid-cols-3 gap-5 tabular-nums lg:w-[22rem] pl-5 lg:pl-0">
            <div><p className="text-[11px] text-muted">Investido</p><p className="text-sm font-semibold">{brl(conta.atual.custo)}</p><Variacao atual={conta.atual.custo} anterior={conta.anterior.custo} bomQuandoSobe={null} /></div>
            <div><p className="text-[11px] text-muted">Conversões</p><p className="text-sm font-semibold">{num(conta.atual.conversoes)}</p>{inflada ? <SemComparacao /> : <Variacao atual={conta.atual.conversoes} anterior={conta.anterior.conversoes} />}</div>
            <div><p className="text-[11px] text-muted">Custo/conv.</p><p className="text-sm font-semibold">{cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))}</p>{inflada ? <SemComparacao /> : <Variacao atual={cpa(conta.atual)} anterior={cpa(conta.anterior)} bomQuandoSobe={false} />}</div>
          </div>
        )}
        <button onClick={() => onOtimizar(conta.id)}
          className="self-start lg:self-center ml-5 lg:ml-0 inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-accent text-text hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
          Otimizar<ArrowRight size={14} />
        </button>
      </div>
    </li>
  )
}

function ListaDoDia({ contas, gestores, onOtimizar }) {
  const [gestor, setGestor] = useState('todos')
  const [busca, setBusca] = useState('')
  const [verParadas, setVerParadas] = useState(false)

  const termo = busca.trim().toLowerCase()
  const doGestor = contas
    .filter(c => gestor === 'todos' || (gestor === 'sem' ? !c.gestorId : c.gestorId === gestor))
    .filter(c => !termo || c.nome.toLowerCase().includes(termo))
  const ativas = doGestor.filter(c => c.saude !== 'parada').sort((a, b) => prioridade(a) - prioridade(b))
  const paradas = doGestor.filter(c => c.saude === 'parada')
  const urgentes = ativas.filter(c => c.saude === 'critico').length
  const atrasadas = ativas.filter(c => { const d = diasDesde(c.ultimaOtimizacao?.em); return d == null || d >= 7 }).length

  return (
    <Bloco titulo="Lista do dia"
      descricao={ativas.length
        ? `${ativas.length} contas investindo · ${urgentes} ${urgentes === 1 ? 'urgente' : 'urgentes'} · ${atrasadas} sem otimização há 7 dias ou mais. Comece pela primeira.`
        : 'Nenhuma conta investindo neste filtro.'}>
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
        <label className="text-xs text-muted" htmlFor="gestor">Gestor</label>
        <select id="gestor" value={gestor} onChange={e => setGestor(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg bg-white border border-border outline-none focus:ring-2 focus:ring-accent/30">
          <option value="todos">Todos</option>
          {gestores.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
          {contas.some(c => !c.gestorId) && <option value="sem">Sem gestor no hub</option>}
        </select>
        <label className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 w-full sm:w-56 focus-within:ring-2 focus-within:ring-accent/40">
          <Search size={13} className="text-muted flex-shrink-0" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar conta" aria-label="Buscar conta"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted" />
        </label>
      </div>
      <ul className="divide-y divide-border">{ativas.map(c => <LinhaDoDia key={c.id} conta={c} onOtimizar={onOtimizar} />)}</ul>
      {paradas.length > 0 && (
        <div className="border-t border-border">
          <button onClick={() => setVerParadas(v => !v)} aria-expanded={verParadas}
            className="py-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text">
            {verParadas ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {paradas.length} contas sem investimento neste período e no anterior
          </button>
          {verParadas && <ul className="divide-y divide-border border-t border-border">{paradas.map(c => <LinhaDoDia key={c.id} conta={c} onOtimizar={onOtimizar} />)}</ul>}
        </div>
      )}
    </Bloco>
  )
}

function Esqueleto() {
  const barra = (w, h = 'h-3') => <div className={`${h} rounded bg-surface-2 animate-pulse`} style={{ width: w }} />
  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-6" aria-busy="true" aria-label="Carregando as contas">
      {barra('25%', 'h-4')}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">{barra('30%')}{barra('35%')}{barra('10%', 'h-7')}</div>
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
        pendencias: insights.filter(x => x.nivel === 'critico' || x.nivel === 'atencao').length,
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

  const otimizar = id => { setParams({ conta: id, passo: 'visao' }); window.scrollTo({ top: 0 }) }
  const voltar = () => { setParams({}); carregar() }
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
        <div className={`transition-opacity ${carregando ? 'opacity-60 pointer-events-none' : ''}`}>
          {conta
            ? <Otimizar key={conta.id + dias} conta={conta} dias={dias} onVoltar={voltar} />
            : <ListaDoDia contas={contas} gestores={gestores} onOtimizar={otimizar} />}
        </div>
      )}
    </div>
  )
}
