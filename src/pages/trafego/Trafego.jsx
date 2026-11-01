import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import {
  BarChart3, Lightbulb, RefreshCw, Loader2, ChevronDown, ChevronRight,
  Search, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { cabecalhoLogin } from '../../lib/supabase'
import {
  NIVEIS, brl, num, pct, cpa, ctr, variacao, semInvestimento, insightsDaConta, totais, cpaCarteira,
} from './regras'

const PERIODOS = [7, 14, 30, 90]

async function chamar(body) {
  const r = await fetch('/api/trafego', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await cabecalhoLogin()) },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.erro || `o servidor respondeu ${r.status}`)
  return data
}

const dataBR = iso => iso.split('-').reverse().slice(0, 2).join('/')

// `bomQuandoSobe`: true (conversões), false (custo por conversão) ou null (neutro, ex.: investimento).
function Delta({ atual, anterior, bomQuandoSobe = true }) {
  const v = variacao(atual, anterior)
  if (v == null || Math.abs(v) < 0.005) return <span className="text-xs text-muted">—</span>
  const sobe = v > 0
  const cor = bomQuandoSobe == null ? '#6b7280' : (sobe === bomQuandoSobe ? '#5bc424' : '#ef4444')
  const Icone = sobe ? ArrowUpRight : ArrowDownRight
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold" style={{ color: cor }}>
      <Icone size={12} />{pct(Math.abs(v))}
    </span>
  )
}

function Indicador({ rotulo, valor, delta, nota }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow min-w-0">
      <p className="text-[11px] font-bold text-muted uppercase tracking-widest">{rotulo}</p>
      <p className="text-2xl font-black text-text mt-1 truncate">{valor}</p>
      <div className="flex items-center gap-2 mt-1">{delta}{nota && <span className="text-xs text-muted">{nota}</span>}</div>
    </div>
  )
}

function SeloNivel({ nivel }) {
  const n = NIVEIS[nivel]
  return (
    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: n.cor, background: n.cor + '18' }}>{n.rotulo}</span>
  )
}

function Termos({ contaId, dias }) {
  const [estado, setEstado] = useState({ carregando: false, termos: null, erro: '' })

  async function carregar() {
    setEstado({ carregando: true, termos: null, erro: '' })
    try {
      const d = await chamar({ acao: 'termos', contaId, dias })
      setEstado({ carregando: false, termos: d.termos, erro: '' })
    } catch (e) {
      setEstado({ carregando: false, termos: null, erro: e.message })
    }
  }

  if (!estado.termos && !estado.carregando) {
    return (
      <div>
        <button onClick={carregar} className="text-xs font-semibold text-text-2 hover:text-text underline underline-offset-2">
          Ver termos de pesquisa que gastam sem converter
        </button>
        {estado.erro && <p className="text-xs text-danger mt-1">{estado.erro}</p>}
      </div>
    )
  }
  if (estado.carregando) return <p className="text-xs text-muted flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" />Buscando termos…</p>
  if (!estado.termos.length) return <p className="text-xs text-muted">Nenhum termo com gasto e sem conversão no período.</p>

  return (
    <div>
      <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">Termos que gastam sem converter</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-left text-muted">
            <th className="py-1 pr-3 font-semibold">Termo</th><th className="py-1 pr-3 font-semibold">Campanha</th>
            <th className="py-1 pr-3 font-semibold text-right">Cliques</th><th className="py-1 font-semibold text-right">Investido</th>
          </tr></thead>
          <tbody>
            {estado.termos.map((t, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-1.5 pr-3 text-text">{t.termo}</td>
                <td className="py-1.5 pr-3 text-muted">{t.campanha}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{t.cliques}</td>
                <td className="py-1.5 text-right tabular-nums font-semibold">{brl(t.custo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DetalheConta({ conta, dias }) {
  const insights = insightsDaConta(conta)
  return (
    <div className="p-4 space-y-4" style={{ background: '#f7f8fc' }}>
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((x, i) => (
            <div key={i} className="flex gap-2 items-start">
              <SeloNivel nivel={x.nivel} />
              <p className="text-xs text-text-2"><span className="font-semibold text-text">{x.titulo}.</span> {x.texto}</p>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-left text-muted">
            <th className="py-1 pr-3 font-semibold">Campanha ativa</th>
            <th className="py-1 pr-3 font-semibold text-right">Orçamento/dia</th>
            <th className="py-1 pr-3 font-semibold text-right">Investido</th>
            <th className="py-1 pr-3 font-semibold text-right">Conv.</th>
            <th className="py-1 pr-3 font-semibold text-right">Custo/conv.</th>
            <th className="py-1 pr-3 font-semibold text-right" title="Parcela de impressões na rede de pesquisa">Parcela impr.</th>
            <th className="py-1 pr-3 font-semibold text-right" title="Impressões perdidas por orçamento">Perda orçam.</th>
            <th className="py-1 font-semibold text-right" title="Impressões perdidas por classificação">Perda classif.</th>
          </tr></thead>
          <tbody>
            {conta.campanhas.length === 0 && <tr><td colSpan={8} className="py-2 text-muted">Nenhuma campanha ativa.</td></tr>}
            {[...conta.campanhas].sort((x, y) => y.custo - x.custo).map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="py-1.5 pr-3 text-text">{c.nome}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{brl(c.orcamento_diario)}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums font-semibold">{brl(c.custo)}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{num(c.conversoes)}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{cpa(c) == null ? '—' : brl(cpa(c))}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{c.parcela_impressoes == null ? '—' : pct(c.parcela_impressoes)}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums">{c.perda_orcamento == null ? '—' : pct(c.perda_orcamento)}</td>
                <td className="py-1.5 text-right tabular-nums">{c.perda_classificacao == null ? '—' : pct(c.perda_classificacao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Termos contaId={conta.id} dias={dias} />
    </div>
  )
}

function AbaContas({ contas, dias, aberta, setAberta }) {
  const [busca, setBusca] = useState('')
  const [mostrarParadas, setMostrarParadas] = useState(false)

  const filtradas = contas.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
  const ativas  = filtradas.filter(c => !semInvestimento(c)).sort((x, y) => (y.atual?.custo || 0) - (x.atual?.custo || 0))
  const paradas = filtradas.filter(semInvestimento)

  const linha = c => {
    const al = insightsDaConta(c)
    const piores = al.filter(x => x.nivel === 'critico' || x.nivel === 'atencao').length
    const abertaAqui = aberta === c.id
    return (
      <Fragment key={c.id}>
        <tr onClick={() => setAberta(abertaAqui ? null : c.id)} className="border-t border-border cursor-pointer hover:bg-surface-2/50">
          <td className="py-2.5 pl-3 pr-2">{abertaAqui ? <ChevronDown size={14} className="text-muted" /> : <ChevronRight size={14} className="text-muted" />}</td>
          <td className="py-2.5 pr-3">
            <p className="font-semibold text-text truncate max-w-[16rem]">{c.nome}</p>
            <p className="text-[11px] text-muted">{c.id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</p>
          </td>
          {c.erro ? (
            <td colSpan={5} className="py-2.5 pr-3 text-xs text-danger">Erro ao ler a conta</td>
          ) : (<>
            <td className="py-2.5 pr-3 text-right tabular-nums"><p className="font-semibold">{brl(c.atual.custo)}</p><Delta atual={c.atual.custo} anterior={c.anterior.custo} bomQuandoSobe={null} /></td>
            <td className="py-2.5 pr-3 text-right tabular-nums"><p className="font-semibold">{num(c.atual.conversoes)}</p><Delta atual={c.atual.conversoes} anterior={c.anterior.conversoes} /></td>
            <td className="py-2.5 pr-3 text-right tabular-nums"><p className="font-semibold">{cpa(c.atual) == null ? '—' : brl(cpa(c.atual))}</p><Delta atual={cpa(c.atual)} anterior={cpa(c.anterior)} bomQuandoSobe={false} /></td>
            <td className="py-2.5 pr-3 text-right tabular-nums">{ctr(c.atual) == null ? '—' : `${(ctr(c.atual) * 100).toFixed(1)}%`}</td>
            <td className="py-2.5 pr-3 text-right">
              {piores > 0
                ? <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: al[0].nivel === 'critico' ? NIVEIS.critico.cor : NIVEIS.atencao.cor }}><AlertTriangle size={12} />{piores}</span>
                : <span className="text-xs text-muted">—</span>}
            </td>
          </>)}
        </tr>
        {abertaAqui && <tr><td colSpan={7} className="p-0">{c.erro ? <p className="p-4 text-xs text-danger">{c.erro}</p> : <DetalheConta conta={c} dias={dias} />}</td></tr>}
      </Fragment>
    )
  }

  return (
    <div className="bg-white rounded-2xl card-shadow">
      <div className="p-3 border-b border-border">
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 max-w-sm">
          <Search size={14} className="text-muted" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar conta"
            className="bg-transparent outline-none text-sm w-full" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead><tr className="text-left text-[11px] text-muted uppercase tracking-wider">
            <th className="w-8" /><th className="py-2 pr-3 font-bold">Conta</th>
            <th className="py-2 pr-3 font-bold text-right">Investido</th><th className="py-2 pr-3 font-bold text-right">Conversões</th>
            <th className="py-2 pr-3 font-bold text-right">Custo/conv.</th><th className="py-2 pr-3 font-bold text-right">CTR</th>
            <th className="py-2 pr-3 font-bold text-right">Alertas</th>
          </tr></thead>
          <tbody>
            {ativas.map(linha)}
            {paradas.length > 0 && (
              <tr className="border-t border-border">
                <td colSpan={7} className="py-2.5 px-3">
                  <button onClick={() => setMostrarParadas(v => !v)} className="text-xs font-semibold text-muted hover:text-text">
                    {mostrarParadas ? 'Ocultar' : 'Mostrar'} {paradas.length} contas sem investimento nos dois períodos
                  </button>
                </td>
              </tr>
            )}
            {mostrarParadas && paradas.map(linha)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AbaInsights({ contas, verConta }) {
  const t = totais(contas)
  const comGasto = contas.filter(c => !c.erro && c.atual.custo > 0).length
  const todos = contas.flatMap(c => insightsDaConta(c).map(x => ({ ...x, conta: c })))
    .sort((x, y) => NIVEIS[x.nivel].ordem - NIVEIS[y.nivel].ordem)
  const [filtro, setFiltro] = useState(null)
  const visiveis = filtro ? todos.filter(x => x.nivel === filtro) : todos

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Indicador rotulo="Investimento" valor={brl(t.atual.custo)} delta={<Delta atual={t.atual.custo} anterior={t.anterior.custo} bomQuandoSobe={null} />} nota="vs período anterior" />
        <Indicador rotulo="Conversões" valor={num(t.atual.conversoes)} delta={<Delta atual={t.atual.conversoes} anterior={t.anterior.conversoes} />} nota="vs período anterior" />
        <Indicador rotulo="Custo por conversão" valor={cpaCarteira(t.atual) == null ? '—' : brl(cpaCarteira(t.atual))} delta={<Delta atual={cpaCarteira(t.atual)} anterior={cpaCarteira(t.anterior)} bomQuandoSobe={false} />} nota="média da carteira" />
        <Indicador rotulo="Contas investindo" valor={`${comGasto} de ${contas.length}`} />
      </div>
      {t.excluidas.length > 0 && (
        <p className="text-xs text-muted">
          Conversões e custo por conversão não incluem {t.excluidas.map(c => c.nome).join(', ')}, que {t.excluidas.length > 1 ? 'estão' : 'está'} com conversão possivelmente inflada.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFiltro(null)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${!filtro ? 'bg-text text-white' : 'bg-white text-text-2 card-shadow'}`}>Todos ({todos.length})</button>
        {Object.entries(NIVEIS).map(([k, n]) => {
          const q = todos.filter(x => x.nivel === k).length
          return (
            <button key={k} onClick={() => setFiltro(filtro === k ? null : k)} disabled={!q}
              className="text-xs font-semibold px-3 py-1.5 rounded-full card-shadow disabled:opacity-40"
              style={filtro === k ? { background: n.cor, color: '#fff' } : { background: '#fff', color: n.cor }}>
              {n.rotulo} ({q})
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl card-shadow divide-y divide-border">
        {visiveis.length === 0 && <p className="p-4 text-sm text-muted">Nenhum insight neste filtro.</p>}
        {visiveis.map((x, i) => (
          <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <div className="sm:w-28 flex-shrink-0"><SeloNivel nivel={x.nivel} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text">{x.titulo} <span className="font-semibold text-muted">· {x.conta.nome}</span></p>
              <p className="text-sm text-text-2 mt-0.5">{x.texto}</p>
            </div>
            <button onClick={() => verConta(x.conta.id)} className="text-xs font-semibold text-text-2 hover:text-text whitespace-nowrap self-start">Ver conta →</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Trafego() {
  const [aba, setAba] = useState('insights')
  const [dias, setDias] = useState(30)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [aberta, setAberta] = useState(null)

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

  const contas = useMemo(() => dados?.contas || [], [dados])

  function verConta(id) {
    setAberta(id)
    setAba('contas')
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Tráfego</h1>
          <p className="text-sm text-muted mt-0.5">
            Google Ads · todas as contas da MCC
            {dados && ` · ${dataBR(dados.periodo.ini)} a ${dataBR(dados.periodo.fim)}, comparado aos ${dados.dias} dias anteriores`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-xl card-shadow p-1">
            {PERIODOS.map(d => (
              <button key={d} onClick={() => setDias(d)} disabled={carregando}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${dias === d ? 'bg-text text-white' : 'text-text-2'}`}>{d}d</button>
            ))}
          </div>
          <button onClick={carregar} disabled={carregando} title="Atualizar"
            className="p-2.5 rounded-xl bg-white card-shadow text-text-2 hover:text-text disabled:opacity-50">
            <RefreshCw size={15} className={carregando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {[['insights', 'Insights', Lightbulb], ['contas', 'Contas', BarChart3]].map(([k, rotulo, Icone]) => (
          <button key={k} onClick={() => setAba(k)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 -mb-px ${aba === k ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'}`}>
            <Icone size={15} />{rotulo}
          </button>
        ))}
      </div>

      {erro && <div className="p-4 rounded-2xl bg-white card-shadow text-sm text-danger">Não foi possível carregar: {erro}</div>}
      {carregando && !dados && (
        <div className="p-10 flex items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={16} className="animate-spin" />Lendo as contas do Google Ads…
        </div>
      )}
      {dados && (
        <div className={carregando ? 'opacity-60 pointer-events-none' : ''}>
          {aba === 'insights'
            ? <AbaInsights contas={contas} verConta={verConta} />
            : <AbaContas contas={contas} dias={dias} aberta={aberta} setAberta={setAberta} />}
        </div>
      )}
    </div>
  )
}
