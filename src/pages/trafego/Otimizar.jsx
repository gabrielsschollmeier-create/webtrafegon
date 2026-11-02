import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CircleCheck, Loader2, X, Pencil } from 'lucide-react'
import {
  NIVEIS, PASSOS, brl, num, pct, cpa, contaInflada, etiquetasDaCampanha, achadosDaOtimizacao, paraCadaPasso,
} from './regras'
import { chamar, Ajuda, Variacao, SemComparacao, Numero, PontoSaude, Tarefa, Bloco, formatarId, dataBR } from './componentes'
import {
  Confirmacao, StatusCampanha, Orcamento, AdicionarPalavras, PainelRegioes, Termos, Historico,
  CORRESPONDENCIA, botaoNeutro, botaoPrincipal, campo,
} from './acoes'

const COR_INVESTIMENTO = '#4a63c9'
const COR_CONVERSOES = '#2f9e44'
const VERMELHO = NIVEIS.critico.cor

const CATEGORIAS = {
  PAGE_VIEW: 'Visualização de página', ENGAGEMENT: 'Engajamento', ADD_TO_CART: 'Adicionar ao carrinho',
  BEGIN_CHECKOUT: 'Início de compra', PURCHASE: 'Compra', CONTACT: 'Contato', SUBMIT_LEAD_FORM: 'Formulário',
  PHONE_CALL_LEAD: 'Ligação', GET_DIRECTIONS: 'Rotas', BOOK_APPOINTMENT: 'Agendamento', SIGNUP: 'Cadastro',
  QUALIFIED_LEAD: 'Lead qualificado', CONVERTED_LEAD: 'Lead convertido', DOWNLOAD: 'Download', DEFAULT: 'Outra',
}

// Um gráfico de barras por medida (nunca dois eixos): investimento e conversões ficam empilhados, com as mesmas datas.
function Grafico({ dias, campo: chave, cor, titulo, formatar }) {
  const [foco, setFoco] = useState(null)
  const max = Math.max(...dias.map(d => d[chave]), 0)
  const W = 600, H = 96, n = dias.length, passo = W / n, larg = Math.max(2, passo - 2)
  const rotuloDia = d => dataBR(d.data)
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-text-2">{titulo}</span>
        <span className="text-xs text-muted tabular-nums">máx. {formatar(max)}</span>
      </figcaption>
      <div className="relative mt-1.5">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-24 block" role="img"
          aria-label={`${titulo} por dia, de ${rotuloDia(dias[0])} a ${rotuloDia(dias[n - 1])}. Máximo de ${formatar(max)}.`}
          onMouseLeave={() => setFoco(null)}>
          <line x1="0" x2={W} y1={H - 0.5} y2={H - 0.5} stroke="#e0e3f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {dias.map((d, i) => {
            const h = max > 0 ? Math.max(d[chave] > 0 ? 2 : 0, (d[chave] / max) * (H - 4)) : 0
            return (
              <g key={d.data}>
                <rect x={i * passo + 1} y={H - h} width={larg} height={h} rx="1.5" fill={cor} opacity={foco == null || foco === i ? 1 : 0.45} />
                <rect x={i * passo} y="0" width={passo} height={H} fill="transparent" onMouseEnter={() => setFoco(i)} />
              </g>
            )
          })}
        </svg>
        {foco != null && (
          <div className="absolute -top-9 px-2 py-1 rounded-md text-xs text-white whitespace-nowrap pointer-events-none tabular-nums"
            style={{ left: `${Math.min(88, Math.max(0, (foco / n) * 100 - 5))}%`, background: '#1a1d2e' }}>
            {rotuloDia(dias[foco])}: {formatar(dias[foco][chave])}
          </div>
        )}
      </div>
      <div className="flex justify-between text-[11px] text-muted mt-1 tabular-nums">
        <span>{rotuloDia(dias[0])}</span><span>{rotuloDia(dias[Math.floor(n / 2)])}</span><span>{rotuloDia(dias[n - 1])}</span>
      </div>
    </figure>
  )
}

function Achados({ itens }) {
  if (!itens.length) {
    return <p className="flex items-center gap-2 text-sm text-text-2 py-1"><CircleCheck size={16} className="text-accent-hover" />Nada a corrigir neste passo.</p>
  }
  return <ul className="divide-y divide-border -my-2">{itens.map((x, i) => <Tarefa key={i} item={x} comecaAberta={i === 0 && x.passos.length > 0} />)}</ul>
}

function PassoVisao({ d, conta }) {
  const inflada = contaInflada(conta)
  const projecao = d.mes.diasPassados > 0 ? d.mes.custo / d.mes.diasPassados * d.mes.diasNoMes : null
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Numero rotulo="Investido" valor={brl(d.atual.custo)}><Variacao atual={d.atual.custo} anterior={d.anterior.custo} bomQuandoSobe={null} /></Numero>
        <Numero rotulo="Conversões" valor={num(d.atual.conversoes)} ajuda="conversao">{inflada ? <SemComparacao /> : <Variacao atual={d.atual.conversoes} anterior={d.anterior.conversoes} />}</Numero>
        <Numero rotulo="Custo por conversão" valor={cpa(d.atual) == null ? '—' : brl(cpa(d.atual))} ajuda="custoConv">{inflada ? <SemComparacao /> : <Variacao atual={cpa(d.atual)} anterior={cpa(d.anterior)} bomQuandoSobe={false} />}</Numero>
      </div>
      <div className="grid md:grid-cols-2 gap-6 pt-1">
        <Grafico dias={d.dias} campo="custo" cor={COR_INVESTIMENTO} titulo="Investimento por dia" formatar={brl} />
        <Grafico dias={d.dias} campo="conversoes" cor={COR_CONVERSOES} titulo="Conversões por dia" formatar={num} />
      </div>
      {projecao != null && (
        <p className="text-sm text-text-2">
          Neste mês: {brl(d.mes.custo)} em {d.mes.diasPassados} {d.mes.diasPassados === 1 ? 'dia' : 'dias'}. No ritmo atual, o mês fecha em <strong className="text-text">{brl(projecao)}</strong>.
        </p>
      )}
    </div>
  )
}

function PassoConversoes({ d, executar }) {
  const [confirmando, setConfirmando] = useState(null)
  return (
    <div>
      <p className="text-sm text-text-2">
        <strong className="text-text">Principal</strong> conta no total de conversões e orienta os lances automáticos.
        Deixe como principal só o que é contato ou venda de verdade.
      </p>
      <ul className="divide-y divide-border mt-3">
        {d.conversoes.map(x => (
          <li key={x.id} className="py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex-1 min-w-[12rem]">
                <p className="text-sm font-semibold text-text">{x.nome}</p>
                <p className="text-xs text-muted">{(CATEGORIAS[x.categoria] || x.categoria) !== x.nome && `${CATEGORIAS[x.categoria] || x.categoria} · `}{num(x.todas)} no período</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={x.principal ? (x.fraca && x.todas > 0 ? { color: NIVEIS.atencao.cor, background: NIVEIS.atencao.fundo } : { color: NIVEIS.positivo.cor, background: NIVEIS.positivo.fundo }) : { color: '#7680a8', background: '#eceef8' }}>
                {x.principal ? 'Principal' : 'Secundária'}
              </span>
              <button onClick={() => setConfirmando(x.id)} disabled={confirmando === x.id} className={botaoNeutro}>
                {x.principal ? 'Tornar secundária' : 'Tornar principal'}
              </button>
            </div>
            {confirmando === x.id && (
              <Confirmacao
                texto={x.principal
                  ? `Tornar "${x.nome}" secundária? Ela continua sendo registrada, mas deixa de contar no total e de orientar os lances.`
                  : `Tornar "${x.nome}" principal? Ela passa a contar no total e a orientar os lances.`}
                aviso="Mudar o que é principal altera os números da conta e os lances automáticos levam cerca de 2 semanas para se reajustar."
                rotulo={x.principal ? 'Tornar secundária' : 'Tornar principal'}
                onConfirmar={async () => { await executar({ acao: 'conversao_principal', conversaoId: x.id, principal: !x.principal }); setConfirmando(null) }}
                onCancelar={() => setConfirmando(null)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function EditarValor({ rotulo, atual, min, max, texto, aviso, onSalvar, prefixo = 'R$' }) {
  const [aberto, setAberto] = useState(false)
  const [valor, setValor] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const novo = Number(String(valor).replace(',', '.'))
  const valido = novo >= min && novo <= max && Math.abs(novo - (atual || 0)) >= 0.01
  if (!aberto) {
    return (
      <button onClick={() => { setValor(atual ? String(atual.toFixed(2)).replace('.', ',') : ''); setAberto(true) }} className={botaoNeutro}>
        <Pencil size={12} />{rotulo}: {atual ? brl(atual) : 'não definido'}
      </button>
    )
  }
  return (
    <div className="basis-full order-last">
      <form onSubmit={e => { e.preventDefault(); if (valido) setConfirmando(true) }} className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{rotulo} ({prefixo})</span>
        <input inputMode="decimal" value={valor} onChange={e => { setValor(e.target.value); setConfirmando(false) }} className={`${campo} w-24 tabular-nums`} autoFocus aria-label={rotulo} />
        <button type="submit" disabled={!valido} className={botaoPrincipal}>Revisar</button>
        <button type="button" onClick={() => { setAberto(false); setConfirmando(false) }} className={botaoNeutro}>Cancelar</button>
      </form>
      {confirmando && (
        <Confirmacao texto={texto(novo)} aviso={aviso?.(novo)} rotulo="Salvar"
          onConfirmar={async () => { await onSalvar(novo); setAberto(false) }} onCancelar={() => setConfirmando(false)} />
      )}
    </div>
  )
}

const PALAVRAS_POR_PAGINA = 25

function PassoPalavras({ d, conta, executar }) {
  const cpaConta = cpa(d.atual)
  const limite = Math.max(50, 2 * (cpaConta || 0))
  const ruins = d.palavras.filter(k => k.status === 'ENABLED' && k.conversoes === 0 && k.custo >= limite)
  const [filtro, setFiltro] = useState(ruins.length ? 'ruins' : 'todas')
  const [qtd, setQtd] = useState(PALAVRAS_POR_PAGINA)
  const [confirmando, setConfirmando] = useState(null)
  const [grupoNovo, setGrupoNovo] = useState('')
  const campanhas = d.campanhas.filter(c => c.status === 'ENABLED' && c.pesquisa)
  const porCampanha = new Map(d.campanhas.map(c => [c.id, c]))
  const lista = filtro === 'ruins' ? ruins : d.palavras
  const grupos = [...new Map(d.palavras.map(k => [k.grupoId, { id: k.grupoId, nome: k.grupo, campanha: k.campanha }])).values()]

  return (
    <div className="space-y-5">
      {campanhas.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-text">Estratégia de lance das campanhas</p>
          <ul className="divide-y divide-border mt-1">
            {campanhas.map(c => (
              <li key={c.id} className="py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="flex-1 min-w-[12rem]">
                  <p className="text-sm text-text">{c.nome}</p>
                  <p className="text-xs text-muted">{c.lanceNome}{c.lanceManual && ': você define o lance de cada palavra-chave abaixo'}</p>
                </div>
                {['TARGET_CPA', 'MAXIMIZE_CONVERSIONS'].includes(c.lance) && (
                  <EditarValor rotulo="CPA desejado" atual={c.cpaAlvo} min={1} max={5000}
                    texto={v => `Definir o CPA desejado de "${c.nome}" em ${brl(v)}?${c.cpaAlvo ? ` Hoje é ${brl(c.cpaAlvo)}.` : ''}`}
                    aviso={v => (c.cpaAlvo && Math.abs(v - c.cpaAlvo) / c.cpaAlvo > 0.2 ? 'Mudanças acima de 20% de uma vez podem desestabilizar a campanha. Se puder, ajuste aos poucos.' : (!c.cpaAlvo ? 'Definir um CPA desejado pode reduzir o volume se o valor estiver abaixo do custo atual.' : null))}
                    onSalvar={v => executar({ acao: 'cpa_alvo', campanhaId: c.id, valor: v })} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text mr-auto">Palavras-chave</p>
          {[['ruins', `Gastando sem converter (${ruins.length})`], ['todas', `Todas (${d.palavras.length})`]].map(([k, r]) => (
            <button key={k} onClick={() => { setFiltro(k); setQtd(PALAVRAS_POR_PAGINA) }} aria-pressed={filtro === k}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${filtro === k ? 'bg-text text-white' : 'bg-surface-2 text-text-2 hover:bg-border'}`}>{r}</button>
          ))}
        </div>
        {lista.length === 0 && <p className="text-sm text-muted mt-3">{filtro === 'ruins' ? 'Nenhuma palavra-chave gastando sem converter.' : 'Nenhuma palavra-chave com dados no período.'}</p>}
        <ul className="divide-y divide-border mt-2">
          {lista.slice(0, qtd).map(k => {
            const camp = porCampanha.get(k.campanhaId)
            const ativa = k.status === 'ENABLED'
            return (
              <li key={k.id} className="py-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex-1 min-w-[12rem]">
                    <p className={`text-sm font-semibold ${ativa ? 'text-text' : 'text-muted line-through decoration-muted/50'}`}>{k.texto}</p>
                    <p className="text-xs text-muted">{CORRESPONDENCIA[k.correspondencia] || k.correspondencia} · {k.campanha} › {k.grupo}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-right tabular-nums">
                    <div><p className="text-[11px] text-muted">Investido</p><p className="text-sm font-semibold">{brl(k.custo)}</p></div>
                    <div><p className="text-[11px] text-muted">Conv.</p><p className="text-sm font-semibold">{num(k.conversoes)}</p></div>
                    <div><p className="text-[11px] text-muted">Custo/conv.</p><p className="text-sm font-semibold">{cpa(k) == null ? '—' : brl(cpa(k))}</p></div>
                    <div><p className="text-[11px] text-muted flex items-center justify-end gap-1">Qualidade <Ajuda chave="qualidade" /></p>
                      <p className="text-sm font-semibold" style={k.qualidade && k.qualidade <= 3 ? { color: VERMELHO } : undefined}>{k.qualidade ? `${k.qualidade}/10` : '—'}</p></div>
                  </div>
                  <button onClick={() => setConfirmando(k.id)} disabled={confirmando === k.id} className={`${botaoNeutro} w-16 justify-center`}>{ativa ? 'Pausar' : 'Ativar'}</button>
                </div>
                <div className="flex flex-wrap items-center gap-2 empty:hidden">
                  {camp?.lanceManual && (
                    <EditarValor rotulo="Lance máximo" atual={k.lance} min={0.05} max={200}
                      texto={v => `Mudar o lance de "${k.texto}" para ${brl(v)} por clique?`}
                      aviso={v => (k.lance && v > k.lance * 1.3 ? 'Aumento acima de 30%: acompanhe o custo nos próximos dias.' : null)}
                      onSalvar={v => executar({ acao: 'lance_palavra', palavraId: k.id, valor: v })} />
                  )}
                  {confirmando === k.id && (
                    <div className="basis-full">
                      <Confirmacao texto={`${ativa ? 'Pausar' : 'Ativar'} a palavra-chave "${k.texto}"?`} rotulo={ativa ? 'Pausar' : 'Ativar'} perigo={ativa}
                        onConfirmar={async () => { await executar({ acao: 'palavra_status', palavraId: k.id, status: ativa ? 'PAUSED' : 'ENABLED' }); setConfirmando(null) }}
                        onCancelar={() => setConfirmando(null)} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {lista.length > qtd && (
          <button onClick={() => setQtd(q => q + PALAVRAS_POR_PAGINA)} className="w-full py-3 text-sm font-semibold text-text-2 hover:text-text border-t border-border">
            Ver mais {Math.min(PALAVRAS_POR_PAGINA, lista.length - qtd)} de {lista.length - qtd}
          </button>
        )}
      </div>

      {grupos.length > 0 && (
        <div className="pt-1">
          <p className="text-sm font-semibold text-text">Adicionar palavras-chave</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <label className="text-xs text-muted" htmlFor="grupo-novo">Grupo de anúncios</label>
            <select id="grupo-novo" value={grupoNovo} onChange={e => setGrupoNovo(e.target.value)} className={`${campo} max-w-full`}>
              <option value="">Escolha o grupo</option>
              {grupos.map(g => <option key={g.id} value={g.id}>{g.campanha} › {g.nome}</option>)}
            </select>
          </div>
          {grupoNovo && <AdicionarPalavras key={grupoNovo} grupo={grupos.find(g => g.id === grupoNovo)} executar={executar} />}
        </div>
      )}
    </div>
  )
}

function PassoAnuncios({ d, executar }) {
  const [confirmando, setConfirmando] = useState(null)
  if (!d.anuncios.length) return <p className="text-sm text-muted">Nenhum anúncio de texto nas campanhas ativas. Campanhas Performance Max e Smart têm os anúncios montados pelo Google.</p>
  const corForca = { Ruim: NIVEIS.critico, 'Média': NIVEIS.atencao, Boa: NIVEIS.positivo, Excelente: NIVEIS.positivo }
  return (
    <ul className="divide-y divide-border">
      {d.anuncios.map(a => {
        const ativo = a.status === 'ENABLED'
        const cor = corForca[a.forca]
        return (
          <li key={a.id} className="py-3">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
              <div className="flex-1 min-w-[14rem]">
                <p className={`text-sm font-semibold ${ativo ? 'text-text' : 'text-muted'}`}>{a.titulos.join(' | ') || 'Anúncio sem títulos'}</p>
                <p className="text-xs text-muted">{a.campanha} › {a.grupo}{!ativo && ' · pausado'}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {a.forca && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={cor ? { color: cor.cor, background: cor.fundo } : { color: '#7680a8', background: '#eceef8' }}>Força: {a.forca}</span>}
                  {a.reprovado && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ color: VERMELHO, background: NIVEIS.critico.fundo }}>Reprovado</span>}
                  {a.limitado && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ color: NIVEIS.atencao.cor, background: NIVEIS.atencao.fundo }}>Aprovado com restrição</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right tabular-nums">
                <div><p className="text-[11px] text-muted">Investido</p><p className="text-sm font-semibold">{brl(a.custo)}</p></div>
                <div><p className="text-[11px] text-muted">Conv.</p><p className="text-sm font-semibold">{num(a.conversoes)}</p></div>
                <div><p className="text-[11px] text-muted">CTR</p><p className="text-sm font-semibold">{a.impressoes ? `${(a.cliques / a.impressoes * 100).toFixed(1)}%` : '—'}</p></div>
              </div>
            </div>
            <div className="mt-2">
              <button onClick={() => setConfirmando(a.id)} disabled={confirmando === a.id} className={botaoNeutro}>{ativo ? 'Pausar anúncio' : 'Ativar anúncio'}</button>
              {confirmando === a.id && (
                <Confirmacao texto={`${ativo ? 'Pausar' : 'Ativar'} este anúncio do grupo "${a.grupo}"?`} rotulo={ativo ? 'Pausar' : 'Ativar'} perigo={ativo}
                  onConfirmar={async () => { await executar({ acao: 'anuncio_status', anuncioId: a.id, status: ativo ? 'PAUSED' : 'ENABLED' }); setConfirmando(null) }}
                  onCancelar={() => setConfirmando(null)} />
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function PassoOrcamento({ d, executar }) {
  const ativas = d.campanhas.filter(c => c.status === 'ENABLED').sort((a, b) => b.custo - a.custo)
  const pausadas = d.campanhas.filter(c => c.status !== 'ENABLED' && c.custo > 0)
  const projecao = d.mes.diasPassados > 0 ? d.mes.custo / d.mes.diasPassados * d.mes.diasNoMes : null
  const linha = c => {
    const etiquetas = etiquetasDaCampanha(c)
    return (
      <li key={c.id} className="py-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex-1 min-w-[12rem]">
            <p className="text-sm font-semibold text-text">{c.nome}{c.status !== 'ENABLED' && <span className="text-muted font-normal"> · pausada</span>}</p>
            <p className="text-xs text-muted">{c.lanceNome}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-right tabular-nums">
            <div><p className="text-[11px] text-muted">Investido</p><p className="text-sm font-semibold">{brl(c.custo)}</p></div>
            <div><p className="text-[11px] text-muted">Conv.</p><p className="text-sm font-semibold">{num(c.conversoes)}</p></div>
            <div><p className="text-[11px] text-muted">Custo/conv.</p><p className="text-sm font-semibold">{cpa(c) == null ? '—' : brl(cpa(c))}</p></div>
          </div>
        </div>
        {c.status === 'ENABLED' && etiquetas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {etiquetas.map(e => <span key={e.rotulo} className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ color: e.cor, background: e.fundo }}>{e.rotulo}{e.ajuda && <Ajuda chave={e.ajuda} />}</span>)}
          </div>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Orcamento campanha={c} executar={executar} />
          <StatusCampanha campanha={c} executar={executar} />
        </div>
      </li>
    )
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface-2/60">
        <Numero rotulo="Investido neste mês" valor={brl(d.mes.custo)}><span className="text-xs text-muted">{d.mes.diasPassados} de {d.mes.diasNoMes} dias</span></Numero>
        <Numero rotulo="Previsão para o mês" valor={projecao == null ? '—' : brl(projecao)}><span className="text-xs text-muted">no ritmo atual</span></Numero>
        <Numero rotulo="Soma dos orçamentos" valor={`${brl(d.mes.orcamentoDiario)}/dia`}><span className="text-xs text-muted">≈ {brl(d.mes.orcamentoDiario * d.mes.diasNoMes)} no mês</span></Numero>
      </div>
      <ul className="divide-y divide-border">{ativas.map(linha)}</ul>
      {pausadas.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-text pt-2">Pausadas que investiram no período</p>
          <ul className="divide-y divide-border">{pausadas.map(linha)}</ul>
        </div>
      )}
    </div>
  )
}

function PassoRegioes({ d, conta, executar }) {
  const cpaConta = cpa(d.atual)
  const limite = Math.max(30, 1.5 * (cpaConta || 0))
  const [confirmando, setConfirmando] = useState(null)
  const [campanhaSel, setCampanhaSel] = useState('')
  const porId = new Map(d.campanhas.map(c => [c.id, c]))
  const ativas = d.campanhas.filter(c => c.status === 'ENABLED')

  async function excluirCidade(c) {
    for (const id of c.campanhas) {
      for (const geo of c.geos || [c.geo]) await executar({ acao: 'regiao_adicionar', campanhaId: id, geo, nome: c.nome, excluir: true })
    }
    setConfirmando(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-text">Onde o dinheiro foi gasto</p>
        <p className="text-xs text-muted">Cidades de quem viu o anúncio no período, da que mais gastou para a que menos gastou.</p>
        {d.cidades.length === 0 && <p className="text-sm text-muted mt-2">Sem dados por cidade no período.</p>}
        <ul className="divide-y divide-border mt-1">
          {d.cidades.map(c => {
            const ruim = c.conversoes === 0 && c.custo >= limite
            return (
              <li key={c.geo} className="py-2.5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex-1 min-w-[12rem]">
                    <p className="text-sm text-text">{c.nome}</p>
                    {ruim && <p className="text-xs font-semibold" style={{ color: NIVEIS.atencao.cor }}>Gastando sem converter</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right tabular-nums">
                    <div><p className="text-[11px] text-muted">Investido</p><p className="text-sm font-semibold">{brl(c.custo)}</p></div>
                    <div><p className="text-[11px] text-muted">Conv.</p><p className="text-sm font-semibold">{num(c.conversoes)}</p></div>
                    <div><p className="text-[11px] text-muted">Custo/conv.</p><p className="text-sm font-semibold">{cpa(c) == null ? '—' : brl(cpa(c))}</p></div>
                  </div>
                  <button onClick={() => setConfirmando(c.geo)} disabled={confirmando === c.geo} className={botaoNeutro}>Excluir cidade</button>
                </div>
                {confirmando === c.geo && (
                  <Confirmacao
                    texto={`Excluir ${c.nome} ${c.campanhas.length === 1 ? `da campanha "${porId.get(c.campanhas[0])?.nome || ''}"` : `das ${c.campanhas.length} campanhas onde ela apareceu`}? Os anúncios deixam de aparecer lá.`}
                    aviso={c.conversoes > 0 ? `Atenção: ${c.nome} gerou ${num(c.conversoes)} conversões no período.` : null}
                    rotulo="Excluir cidade" onConfirmar={() => excluirCidade(c)} onCancelar={() => setConfirmando(null)} />
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-text">Regiões de cada campanha</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <label className="text-xs text-muted" htmlFor="campanha-regiao">Campanha</label>
          <select id="campanha-regiao" value={campanhaSel} onChange={e => setCampanhaSel(e.target.value)} className={`${campo} max-w-full`}>
            <option value="">Escolha a campanha</option>
            {ativas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        {campanhaSel && (
          <div className="mt-3 p-4 rounded-xl border border-border">
            <PainelRegioes key={campanhaSel} contaId={conta.id} campanha={porId.get(campanhaSel)} executarBase={executar} />
          </div>
        )}
      </div>
    </div>
  )
}

function PassoConcluir({ d, conta, executar, inicio, onVoltar }) {
  const [nota, setNota] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [concluida, setConcluida] = useState(false)
  const feitas = (d.historico?.itens || []).filter(h => new Date(h.criado_em) >= inicio && h.acao !== 'otimizacao_concluida')

  async function concluir() {
    setEnviando(true)
    setErro('')
    try {
      await executar({ acao: 'concluir_otimizacao', nota })
      setConcluida(true)
    } catch (e) { setErro(e.message) } finally { setEnviando(false) }
  }

  if (concluida) {
    return (
      <div className="py-4 text-center space-y-3">
        <CircleCheck size={32} className="mx-auto" style={{ color: NIVEIS.positivo.cor }} />
        <p className="text-base font-bold text-text">Otimização de {conta.nome} registrada</p>
        <p className="text-sm text-text-2">Ela aparece na lista do dia com a data de hoje.</p>
        <button onClick={onVoltar} className={`${botaoPrincipal} !text-sm !px-4 !py-2`}>Voltar para a lista do dia</button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-text">Alterações feitas nesta otimização</p>
        {feitas.length === 0
          ? <p className="text-sm text-muted mt-1">Nenhuma alteração feita pelo hub nesta otimização.</p>
          : <ul className="mt-1 space-y-1">{feitas.map((h, i) => <li key={i} className="text-sm text-text-2 flex gap-2"><Check size={15} className="flex-shrink-0 mt-0.5 text-accent-hover" />{h.resumo}{h.campanha_nome && ` · ${h.campanha_nome}`}</li>)}</ul>}
      </div>
      <div>
        <label htmlFor="nota" className="text-sm font-semibold text-text">Anotação</label>
        <p className="text-xs text-muted">O que você analisou, o que decidiu e o que conferir na próxima vez.</p>
        <textarea id="nota" value={nota} onChange={e => setNota(e.target.value)} rows={4} className={`${campo} w-full mt-2`}
          placeholder="Ex.: negativei termos de concurso; aumentar orçamento da campanha de Família se o CPA seguir abaixo de R$ 30." />
      </div>
      {erro && <p className="text-sm" style={{ color: VERMELHO }}>{erro}</p>}
      <button onClick={concluir} disabled={enviando} className={`${botaoPrincipal} !text-sm !px-4 !py-2`}>
        {enviando && <Loader2 size={14} className="animate-spin" />}Concluir otimização
      </button>
    </div>
  )
}

const DESCRICOES = {
  visao: 'Como a conta está em relação ao período anterior.',
  conversoes: 'Confira se o que conta como conversão é contato ou venda de verdade. Sem isso, o resto da análise engana.',
  termos: 'O que as pessoas pesquisaram para ver os anúncios. Negative o que não tem a ver com o cliente.',
  palavras: 'Pause o que gasta sem converter e ajuste lances. Adicione palavras novas que apareceram nos termos.',
  anuncios: 'Anúncios reprovados ou fracos limitam a conta inteira.',
  orcamento: 'Distribua a verba para o que converte e confira o ritmo de gasto do mês.',
  regioes: 'Corte cidades que gastam sem converter e ajuste onde cada campanha aparece.',
  concluir: 'Registre o que foi feito para a próxima pessoa que abrir a conta.',
}

export default function Otimizar({ conta, dias, onVoltar }) {
  const [params, setParams] = useSearchParams()
  const passoAtual = PASSOS.some(p => p.id === params.get('passo')) ? params.get('passo') : 'visao'
  const [d, setD] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState(null)
  const [visitados, setVisitados] = useState(() => new Set(['visao']))
  const inicio = useRef(new Date(Date.now() - 60000)).current

  const carregar = useCallback(async () => {
    try {
      setD(await chamar({ acao: 'otimizar', contaId: conta.id, dias }))
      setErro('')
    } catch (e) { setErro(e.message) }
  }, [conta.id, dias])
  useEffect(() => { carregar() }, [carregar])

  const executar = useCallback(async body => {
    const r = await chamar({ ...body, contaId: conta.id })
    if (body.acao !== 'concluir_otimizacao') setAviso(r.resumo + (r.registrado ? '' : '. Atenção: o registro no histórico não foi salvo.'))
    await carregar()
    return r
  }, [conta.id, carregar])

  const porPasso = useMemo(() => (d ? paraCadaPasso(conta.insights, achadosDaOtimizacao(d)) : null), [d, conta.insights])
  const indice = PASSOS.findIndex(p => p.id === passoAtual)
  const irPara = id => {
    setVisitados(v => new Set(v).add(id))
    setParams({ conta: conta.id, passo: id })
    window.scrollTo({ top: 0 })
  }
  const ultima = d && conta.ultimaOtimizacao

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onVoltar} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
          <ArrowLeft size={15} />Lista do dia
        </button>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-xl font-extrabold text-text">Otimizar {conta.nome}</h2>
          <PontoSaude saude={conta.saude} comRotulo />
        </div>
        <p className="text-xs text-muted mt-0.5">
          {formatarId(conta.id)}
          {conta.gestor && ` · ${conta.gestor}`}
          {ultima ? ` · última otimização em ${new Date(ultima.em).toLocaleDateString('pt-BR')}` : ' · nunca otimizada pelo hub'}
        </p>
      </div>

      <nav aria-label="Passos da otimização" className="overflow-x-auto -mx-1 px-1">
        <ol className="flex gap-1.5 min-w-max">
          {PASSOS.map((p, i) => {
            const pendentes = porPasso?.[p.id]?.filter(x => x.nivel !== 'oportunidade').length || 0
            const atual = p.id === passoAtual
            const feito = visitados.has(p.id) && !atual
            return (
              <li key={p.id}>
                <button onClick={() => irPara(p.id)} aria-current={atual ? 'step' : undefined}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${atual ? 'bg-text text-white' : 'bg-white text-text-2 card-shadow hover:text-text'}`}>
                  <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${atual ? 'bg-white text-text' : feito ? 'bg-accent text-text' : 'bg-surface-2 text-text-2'}`}>
                    {feito ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </span>
                  {p.rotulo}
                  {pendentes > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full grid place-items-center text-[11px] font-bold text-white" style={{ background: NIVEIS.atencao.cor }}>{pendentes}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {aviso && (
        <div role="status" className="sticky top-2 z-10 flex items-start gap-3 p-3.5 rounded-xl bg-white card-shadow-md">
          <CircleCheck size={17} className="flex-shrink-0 mt-0.5" style={{ color: NIVEIS.positivo.cor }} />
          <p className="flex-1 text-sm text-text">{aviso}</p>
          <button onClick={() => setAviso(null)} aria-label="Fechar aviso" className="text-muted hover:text-text"><X size={15} /></button>
        </div>
      )}

      {erro && (
        <div className="p-5 rounded-2xl bg-white card-shadow">
          <p className="text-sm font-semibold" style={{ color: VERMELHO }}>Não foi possível carregar a conta.</p>
          <p className="text-sm text-text-2 mt-1">{erro}</p>
          <button onClick={carregar} className={`${botaoNeutro} mt-3`}>Tentar de novo</button>
        </div>
      )}
      {!d && !erro && (
        <div className="p-10 bg-white rounded-2xl card-shadow flex items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={16} className="animate-spin" />Lendo campanhas, palavras-chave, anúncios e regiões…
        </div>
      )}

      {d && (
        <>
          {passoAtual !== 'concluir' && passoAtual !== 'termos' && (
            <Bloco titulo={`${indice + 1}. ${PASSOS[indice].rotulo}`} descricao={DESCRICOES[passoAtual]}>
              {porPasso[passoAtual].length > 0 && (
                <div className="mt-3 mb-4 p-4 rounded-xl" style={{ background: '#f7f8fc' }}>
                  <p className="text-xs font-bold text-text-2 mb-1">O que o hub encontrou</p>
                  <Achados itens={porPasso[passoAtual]} />
                </div>
              )}
              <div className="py-3">
                {passoAtual === 'visao' && <PassoVisao d={d} conta={conta} />}
                {passoAtual === 'conversoes' && <PassoConversoes d={d} executar={executar} />}
                {passoAtual === 'palavras' && <PassoPalavras d={d} conta={conta} executar={executar} />}
                {passoAtual === 'anuncios' && <PassoAnuncios d={d} executar={executar} />}
                {passoAtual === 'orcamento' && <PassoOrcamento d={d} executar={executar} />}
                {passoAtual === 'regioes' && <PassoRegioes d={d} conta={conta} executar={executar} />}
              </div>
            </Bloco>
          )}
          {passoAtual === 'termos' && (
            <>
              <section className="px-1">
                <h3 className="text-base font-bold text-text">3. Termos de pesquisa</h3>
                <p className="text-sm text-muted">{DESCRICOES.termos}</p>
              </section>
              <Termos contaId={conta.id} dias={dias} executar={executar} />
            </>
          )}
          {passoAtual === 'concluir' && (
            <>
              <Bloco titulo={`${PASSOS.length}. Concluir`} descricao={DESCRICOES.concluir}>
                <div className="py-3"><PassoConcluir d={d} conta={conta} executar={executar} inicio={inicio} onVoltar={onVoltar} /></div>
              </Bloco>
              <Historico historico={d.historico} />
            </>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            {indice > 0
              ? <button onClick={() => irPara(PASSOS[indice - 1].id)} className={`${botaoNeutro} !text-sm !px-4 !py-2`}><ArrowLeft size={14} />{PASSOS[indice - 1].rotulo}</button>
              : <span />}
            {indice < PASSOS.length - 1 && (
              <button onClick={() => irPara(PASSOS[indice + 1].id)} className={`${botaoPrincipal} !text-sm !px-4 !py-2`}>
                Próximo: {PASSOS[indice + 1].rotulo}<ArrowRight size={14} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
