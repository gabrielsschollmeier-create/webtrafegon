import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RefreshCw, ChevronDown, ChevronRight, ArrowLeft, ArrowUp, ArrowDown,
  Search, HelpCircle, Loader2, CircleCheck,
} from 'lucide-react'
import { cabecalhoLogin } from '../../lib/supabase'
import {
  NIVEIS, SAUDE, GLOSSARIO, brl, num, pct, cpa, variacao, semInvestimento, contaInflada,
  insightsDaConta, saudeDaConta, etiquetasDaCampanha, totais, cpaCarteira,
} from './regras'

const PERIODOS = [7, 14, 30, 90]
const LIMITE_HOJE = 6

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
const formatarId = id => id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')

function Ajuda({ chave }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)
  const abrir = () => {
    const r = ref.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: Math.min(Math.max(8, r.left - 120), window.innerWidth - 268) })
  }
  return (
    <>
      <button ref={ref} type="button" aria-label="O que é isso?"
        onMouseEnter={abrir} onMouseLeave={() => setPos(null)} onFocus={abrir} onBlur={() => setPos(null)}
        className="inline-flex align-middle text-muted hover:text-text-2 focus-visible:text-text-2 focus-visible:outline-none">
        <HelpCircle size={13} />
      </button>
      {pos && (
        <span role="tooltip" className="fixed z-50 w-64 px-3 py-2 rounded-lg text-xs leading-relaxed text-white font-normal normal-case tracking-normal text-left"
          style={{ top: pos.top, left: pos.left, background: '#1a1d2e', boxShadow: '0 6px 20px rgba(17,24,39,0.25)' }}>
          {GLOSSARIO[chave]}
        </span>
      )}
    </>
  )
}

// `bomQuandoSobe`: true (conversões), false (custo por conversão) ou null (neutro, ex.: investimento).
function Variacao({ atual, anterior, bomQuandoSobe = true }) {
  const v = variacao(atual, anterior)
  if (v == null) return <span className="text-xs text-muted">—</span>
  if (Math.abs(v) < 0.01) return <span className="text-xs text-muted">igual</span>
  const sobe = v > 0
  const cor = bomQuandoSobe == null ? '#6b7280' : (sobe === bomQuandoSobe ? '#15803d' : '#dc2626')
  const Icone = sobe ? ArrowUp : ArrowDown
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap" style={{ color: cor }}>
      <Icone size={11} strokeWidth={2.5} />{pct(Math.abs(v))}
    </span>
  )
}

function SemComparacao() {
  return <span className="text-xs text-muted">não comparável</span>
}

function Numero({ rotulo, valor, ajuda, children }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted flex items-center gap-1">{rotulo}{ajuda && <Ajuda chave={ajuda} />}</p>
      <p className="text-lg font-bold text-text tabular-nums leading-tight mt-0.5">{valor}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

function PontoSaude({ saude, comRotulo }) {
  const s = SAUDE[saude]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: s.cor }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.cor }} />
      {comRotulo && s.rotulo}
    </span>
  )
}

function Tarefa({ item, conta, onAbrirConta, comecaAberta = false }) {
  const [aberta, setAberta] = useState(comecaAberta)
  const n = NIVEIS[item.nivel]
  const temPassos = item.passos.length > 0
  return (
    <li className="py-3.5">
      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
        <span className="sm:mt-0.5 w-fit h-fit text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap" style={{ color: n.cor, background: n.fundo }}>{n.rotulo}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text">
            {item.titulo}{item.ajuda && <> <Ajuda chave={item.ajuda} /></>}
          </p>
          <p className="text-sm text-text-2 mt-0.5">{item.resumo}</p>
          <p className="text-xs text-muted mt-1">
            {conta && <button onClick={() => onAbrirConta(conta.id)} className="text-left font-semibold text-text-2 hover:text-text hover:underline underline-offset-2">{conta.nome}</button>}
            {conta && item.campanha && ' · '}
            {item.campanha && <span>Campanha {item.campanha}</span>}
          </p>
          {temPassos && (
            <button onClick={() => setAberta(v => !v)} aria-expanded={aberta}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-2 hover:text-text">
              {aberta ? <ChevronDown size={14} /> : <ChevronRight size={14} />}Como resolver
            </button>
          )}
          {aberta && temPassos && (
            <ol className="mt-2 space-y-1.5 text-sm text-text-2 list-decimal pl-5 marker:text-muted marker:font-semibold">
              {item.passos.map((p, i) => <li key={i} className="pl-1">{p}</li>)}
            </ol>
          )}
        </div>
      </div>
    </li>
  )
}

function Bloco({ titulo, descricao, children, acao }) {
  return (
    <section className="bg-white rounded-2xl card-shadow">
      <header className="px-5 pt-5 pb-1 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-text">{titulo}</h2>
          {descricao && <p className="text-sm text-muted mt-0.5">{descricao}</p>}
        </div>
        {acao}
      </header>
      <div className="px-5 pb-2">{children}</div>
    </section>
  )
}

function ListaComLimite({ itens, limite, render, rotuloMais }) {
  const [tudo, setTudo] = useState(false)
  const visiveis = tudo ? itens : itens.slice(0, limite)
  return (
    <>
      <ul className="divide-y divide-border">{visiveis.map(render)}</ul>
      {itens.length > limite && (
        <button onClick={() => setTudo(v => !v)} className="w-full py-3 text-sm font-semibold text-text-2 hover:text-text border-t border-border">
          {tudo ? 'Mostrar menos' : rotuloMais(itens.length - limite)}
        </button>
      )}
    </>
  )
}

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

  return (
    <Bloco titulo="Buscas que gastam sem converter"
      descricao="Termos que as pessoas pesquisaram, geraram clique e não viraram conversão. São os candidatos a negativar.">
      <div className="py-3">
        {!estado.termos && !estado.carregando && (
          <>
            <button onClick={carregar} className="text-sm font-semibold px-4 py-2 rounded-xl bg-surface-2 text-text hover:bg-border">Buscar os termos</button>
            {estado.erro && <p className="text-sm mt-2" style={{ color: NIVEIS.critico.cor }}>Não foi possível buscar os termos: {estado.erro}</p>}
          </>
        )}
        {estado.carregando && <p className="text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Buscando termos de pesquisa…</p>}
        {estado.termos?.length === 0 && <p className="text-sm text-text-2">Nenhuma busca com gasto e sem conversão neste período.</p>}
        {estado.termos?.length > 0 && (
          <ul className="divide-y divide-border">
            {estado.termos.map((t, i) => (
              <li key={i} className="py-2.5 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">{t.termo}</p>
                  <p className="text-xs text-muted truncate">{t.campanha} · {t.cliques} {t.cliques === 1 ? 'clique' : 'cliques'}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums whitespace-nowrap">{brl(t.custo)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Bloco>
  )
}

function DetalheConta({ conta, dias, onVoltar }) {
  const tarefas = conta.insights.filter(x => x.nivel !== 'positivo')
  const positivos = conta.insights.filter(x => x.nivel === 'positivo')
  const campanhas = [...(conta.campanhas || [])].sort((x, y) => y.custo - x.custo)

  return (
    <div className="space-y-4">
      <button onClick={onVoltar} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
        <ArrowLeft size={15} />Todas as contas
      </button>

      <section className="bg-white rounded-2xl card-shadow p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-xl font-extrabold text-text">{conta.nome}</h2>
          <PontoSaude saude={conta.saude} comRotulo />
        </div>
        <p className="text-xs text-muted mt-0.5">{formatarId(conta.id)}</p>
        {!conta.erro && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <Numero rotulo="Investido" valor={brl(conta.atual.custo)}><Variacao atual={conta.atual.custo} anterior={conta.anterior.custo} bomQuandoSobe={null} /></Numero>
            <Numero rotulo="Conversões" valor={num(conta.atual.conversoes)} ajuda="conversao">{contaInflada(conta) ? <SemComparacao /> : <Variacao atual={conta.atual.conversoes} anterior={conta.anterior.conversoes} />}</Numero>
            <Numero rotulo="Custo por conversão" valor={cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))} ajuda="custoConv">{contaInflada(conta) ? <SemComparacao /> : <Variacao atual={cpa(conta.atual)} anterior={cpa(conta.anterior)} bomQuandoSobe={false} />}</Numero>
          </div>
        )}
        {positivos.map((x, i) => (
          <p key={i} className="mt-3 text-sm flex items-center gap-2" style={{ color: NIVEIS.positivo.cor }}>
            <CircleCheck size={15} />{x.titulo}: {x.resumo.charAt(0).toLowerCase() + x.resumo.slice(1)}
          </p>
        ))}
      </section>

      <Bloco titulo="O que fazer nesta conta"
        descricao={tarefas.length ? 'Comece pelo primeiro item.' : undefined}>
        {tarefas.length === 0
          ? <p className="py-5 flex items-center gap-2 text-sm text-text-2"><CircleCheck size={16} className="text-accent-hover" />Nenhum problema encontrado nesta conta.</p>
          : <ul className="divide-y divide-border">{tarefas.map((x, i) => <Tarefa key={i} item={x} comecaAberta={i === 0} />)}</ul>}
      </Bloco>

      {!conta.erro && (
        <Bloco titulo="Campanhas ativas" descricao={`${campanhas.length} ${campanhas.length === 1 ? 'campanha' : 'campanhas'}, da que mais investiu para a que menos investiu.`}>
          {campanhas.length === 0 ? <p className="py-5 text-sm text-muted">Nenhuma campanha ativa nesta conta.</p> : (
            <ul className="divide-y divide-border">
              {campanhas.map(c => {
                const etiquetas = etiquetasDaCampanha(c)
                return (
                  <li key={c.id} className="py-3.5">
                    <p className="text-sm font-semibold text-text">{c.nome}</p>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 tabular-nums">
                      <div><p className="text-xs text-muted">Investido</p><p className="text-sm font-semibold">{brl(c.custo)}</p></div>
                      <div><p className="text-xs text-muted">Conversões</p><p className="text-sm font-semibold">{num(c.conversoes)}</p></div>
                      <div><p className="text-xs text-muted">Custo por conversão</p><p className="text-sm font-semibold">{cpa(c) == null ? '—' : brl(cpa(c))}</p></div>
                      <div><p className="text-xs text-muted">Orçamento por dia</p><p className="text-sm font-semibold">{brl(c.orcamento_diario)}</p></div>
                    </div>
                    {etiquetas.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {etiquetas.map(e => (
                          <span key={e.rotulo} className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ color: e.cor, background: e.fundo }}>
                            {e.rotulo}{e.ajuda && <Ajuda chave={e.ajuda} />}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Bloco>
      )}

      {!conta.erro && <Termos contaId={conta.id} dias={dias} />}
    </div>
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
