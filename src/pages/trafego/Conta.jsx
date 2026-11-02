import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, CircleCheck, ExternalLink, Loader2, Search, X } from 'lucide-react'
import { NIVEIS, brl, num, cpa, contaInflada, etiquetasDaCampanha } from './regras'
import {
  chamar, Ajuda, Variacao, SemComparacao, Numero, PontoSaude, formatarId, diasDesde, textoOtimizacao, linkGoogleAds,
} from './componentes'
import {
  Confirmacao, Interruptor, ValorEditavel, AdicionarPalavras, PainelRegioes, Termos, Historico,
  CORRESPONDENCIA, botaoNeutro, botaoPrincipal, campo,
} from './acoes'

const VERMELHO = NIVEIS.critico.cor
const ABAS = [
  { id: 'campanhas', rotulo: 'Campanhas' },
  { id: 'palavras', rotulo: 'Palavras-chave', porCampanha: true },
  { id: 'termos', rotulo: 'Termos de pesquisa', porCampanha: true },
  { id: 'anuncios', rotulo: 'Anúncios', porCampanha: true },
  { id: 'regioes', rotulo: 'Regiões', porCampanha: true },
  { id: 'conversoes', rotulo: 'Conversões' },
  { id: 'historico', rotulo: 'Histórico' },
]
const CATEGORIAS = {
  PAGE_VIEW: 'Visualização de página', ENGAGEMENT: 'Engajamento', ADD_TO_CART: 'Adicionar ao carrinho',
  BEGIN_CHECKOUT: 'Início de compra', PURCHASE: 'Compra', CONTACT: 'Contato', SUBMIT_LEAD_FORM: 'Formulário',
  PHONE_CALL_LEAD: 'Ligação', GET_DIRECTIONS: 'Rotas', BOOK_APPOINTMENT: 'Agendamento', SIGNUP: 'Cadastro',
  QUALIFIED_LEAD: 'Lead qualificado', CONVERTED_LEAD: 'Lead convertido', DOWNLOAD: 'Download', DEFAULT: 'Outra',
}
const POR_PAGINA = 50

const th = 'py-2 px-3 text-[11px] font-semibold text-muted text-left whitespace-nowrap'
const thNum = `${th} !text-right`
const td = 'py-2.5 px-3 align-middle'
const tdNum = `${td} text-right text-sm tabular-nums whitespace-nowrap`
const custoConv = m => (cpa(m) == null ? '—' : brl(cpa(m)))

function Tabela({ colunas, children }) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full min-w-[40rem] [&_tr>*:first-child]:pl-5 [&_tr>*:last-child]:pr-5">
        <thead className="border-b border-border">
          <tr>{colunas.map((c, i) => <th key={i} className={c.num ? thNum : th}>{c.rotulo}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  )
}

function LinhaConfirmacao({ colunas, children }) {
  return <tr><td colSpan={colunas} className="px-3 pb-3">{children}</td></tr>
}

function Etiqueta({ cor, fundo, children }) {
  return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ color: cor, background: fundo }}>{children}</span>
}

function Filtros({ opcoes, valor, onMudar }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtro">
      {opcoes.map(([k, r]) => (
        <button key={k} onClick={() => onMudar(k)} aria-pressed={valor === k}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${valor === k ? 'bg-text text-white' : 'bg-surface-2 text-text-2 hover:bg-border'}`}>{r}</button>
      ))}
    </div>
  )
}

function AbaCampanhas({ d, conta, executar, verPalavras }) {
  const [pausando, setPausando] = useState(null)
  const lista = [...d.campanhas].sort((a, b) => (a.status === 'ENABLED' ? 0 : 1) - (b.status === 'ENABLED' ? 0 : 1) || b.custo - a.custo)
  const status = (c, s) => ({ acao: 'status_campanha', campanhaId: c.id, status: s })
  const colunas = [{ rotulo: '' }, { rotulo: 'Campanha' }, { rotulo: 'Orçamento por dia' }, { rotulo: 'Lance' },
    { rotulo: 'Investido', num: true }, { rotulo: 'Conv.', num: true }, { rotulo: 'Custo/conv.', num: true }, { rotulo: '' }]

  if (!lista.length) return <p className="text-sm text-muted">Nenhuma campanha ativa ou pausada nesta conta.</p>
  return (
    <Tabela colunas={colunas}>
      {lista.map(c => {
        const ativa = c.status === 'ENABLED'
        const etiquetas = ativa ? etiquetasDaCampanha(c) : []
        const comCpa = ['TARGET_CPA', 'MAXIMIZE_CONVERSIONS'].includes(c.lance)
        return [
          <tr key={c.id} className={ativa ? '' : 'bg-surface-2/40'}>
            <td className={`${td} w-12`}>
              <Interruptor ativo={ativa} rotulo={`${ativa ? 'Pausar' : 'Ativar'} ${c.nome}`}
                onAlternar={ativa ? () => setPausando(c.id) : () => executar(status(c, 'ENABLED'), status(c, 'PAUSED'))} />
            </td>
            <td className={`${td} min-w-[14rem]`}>
              <p className={`text-sm font-semibold ${ativa ? 'text-text' : 'text-text-2'}`}>{c.nome}</p>
              {!ativa && <p className="text-xs text-muted">Pausada</p>}
              {etiquetas.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {etiquetas.map(e => <Etiqueta key={e.rotulo} cor={e.cor} fundo={e.fundo}>{e.rotulo}{e.ajuda && <Ajuda chave={e.ajuda} />}</Etiqueta>)}
                </div>
              )}
            </td>
            <td className={td}>
              {c.orcamento_compartilhado
                ? <span className="text-xs text-muted" title="Orçamento compartilhado com outras campanhas: altere no Google Ads">{brl(c.orcamento_diario)} · compartilhado</span>
                : <ValorEditavel valor={c.orcamento_diario} min={1} max={5000} rotulo={`orçamento de ${c.nome}`}
                    aviso={(_, m) => (m > 0.2 ? 'Aumento acima de 20% pode reiniciar o aprendizado da campanha.' : null)}
                    onSalvar={v => executar({ acao: 'orcamento', campanhaId: c.id, valor: v }, { acao: 'orcamento', campanhaId: c.id, valor: c.orcamento_diario })} />}
            </td>
            <td className={td}>
              <p className="text-xs text-text-2 whitespace-nowrap">{c.lanceNome || '—'}</p>
              {comCpa && (
                <div className="flex items-center gap-1 text-xs text-muted whitespace-nowrap">CPA desejado
                  <ValorEditavel valor={c.cpaAlvo} min={1} max={5000} rotulo={`CPA desejado de ${c.nome}`}
                    aviso={(v, m) => (c.cpaAlvo && Math.abs(m) > 0.2 ? 'Mudança acima de 20% pode desestabilizar a campanha.' : null)}
                    onSalvar={v => executar({ acao: 'cpa_alvo', campanhaId: c.id, valor: v }, c.cpaAlvo ? { acao: 'cpa_alvo', campanhaId: c.id, valor: c.cpaAlvo } : null)} />
                </div>
              )}
            </td>
            <td className={tdNum}>{brl(c.custo)}</td>
            <td className={tdNum}>{num(c.conversoes)}</td>
            <td className={tdNum}>{custoConv(c)}</td>
            <td className={`${td} whitespace-nowrap text-right`}>
              {c.pesquisa && <button onClick={() => verPalavras(c.id)} className={botaoNeutro}>Palavras</button>}
              <a href={linkGoogleAds(conta.id, c.id)} target="_blank" rel="noreferrer" aria-label={`Abrir ${c.nome} no Google Ads`} title="Abrir no Google Ads"
                className="inline-flex align-middle ml-1 p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2"><ExternalLink size={14} /></a>
            </td>
          </tr>,
          pausando === c.id && (
            <LinhaConfirmacao key={`${c.id}-c`} colunas={colunas.length}>
              <Confirmacao texto={`Pausar "${c.nome}"? Os anúncios dela param de aparecer em poucos minutos.`} rotulo="Pausar campanha" perigo
                onConfirmar={async () => { await executar(status(c, 'PAUSED'), status(c, 'ENABLED')); setPausando(null) }}
                onCancelar={() => setPausando(null)} />
            </LinhaConfirmacao>
          ),
        ]
      })}
    </Tabela>
  )
}

function AbaPalavras({ d, campanhaId, executar }) {
  const base = d.palavras.filter(k => !campanhaId || k.campanhaId === campanhaId)
  const limite = Math.max(50, 2 * (cpa(d.atual) || 0))
  const ruins = base.filter(k => k.status === 'ENABLED' && k.conversoes === 0 && k.custo >= limite)
  const pausadas = base.filter(k => k.status !== 'ENABLED')
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [qtd, setQtd] = useState(POR_PAGINA)
  const [grupoNovo, setGrupoNovo] = useState('')
  const porCampanha = new Map(d.campanhas.map(c => [c.id, c]))
  const termo = busca.trim().toLowerCase()
  const lista = (filtro === 'ruins' ? ruins : filtro === 'pausadas' ? pausadas : base).filter(k => !termo || k.texto.includes(termo))
  const grupos = [...new Map(base.map(k => [k.grupoId, { id: k.grupoId, nome: k.grupo, campanha: k.campanha }])).values()]
  const status = (k, s) => ({ acao: 'palavra_status', palavraId: k.id, status: s })
  const colunas = [{ rotulo: '' }, { rotulo: 'Palavra-chave' }, { rotulo: 'Investido', num: true }, { rotulo: 'Conv.', num: true },
    { rotulo: 'Custo/conv.', num: true }, { rotulo: <span className="inline-flex items-center gap-1">Qualidade <Ajuda chave="qualidade" /></span>, num: true }, { rotulo: 'Lance máx.', num: true }]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filtros valor={filtro} onMudar={k => { setFiltro(k); setQtd(POR_PAGINA) }}
          opcoes={[['todas', `Todas (${base.length})`], ['ruins', `Gastando sem converter (${ruins.length})`], ['pausadas', `Pausadas (${pausadas.length})`]]} />
        <label className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 w-full sm:w-52 focus-within:ring-2 focus-within:ring-accent/40">
          <Search size={13} className="text-muted flex-shrink-0" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar palavra" aria-label="Buscar palavra-chave"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted" />
        </label>
      </div>

      {lista.length === 0
        ? <p className="text-sm text-muted">Nenhuma palavra-chave neste filtro.</p>
        : (
          <Tabela colunas={colunas}>
            {lista.slice(0, qtd).map(k => {
              const ativa = k.status === 'ENABLED'
              const manual = porCampanha.get(k.campanhaId)?.lanceManual
              return (
                <tr key={k.id}>
                  <td className={`${td} w-12`}>
                    <Interruptor ativo={ativa} rotulo={`${ativa ? 'Pausar' : 'Ativar'} ${k.texto}`}
                      onAlternar={() => executar(status(k, ativa ? 'PAUSED' : 'ENABLED'), status(k, ativa ? 'ENABLED' : 'PAUSED'))} />
                  </td>
                  <td className={`${td} min-w-[14rem]`}>
                    <p className={`text-sm font-semibold ${ativa ? 'text-text' : 'text-muted'}`}>{k.texto}</p>
                    <p className="text-xs text-muted">{CORRESPONDENCIA[k.correspondencia] || k.correspondencia} · {campanhaId ? k.grupo : `${k.campanha} › ${k.grupo}`}</p>
                  </td>
                  <td className={tdNum}>{brl(k.custo)}</td>
                  <td className={tdNum}>{num(k.conversoes)}</td>
                  <td className={tdNum}>{custoConv(k)}</td>
                  <td className={tdNum} style={k.qualidade && k.qualidade <= 3 ? { color: VERMELHO } : undefined}>{k.qualidade ? `${k.qualidade}/10` : '—'}</td>
                  <td className={`${td} text-right`}>
                    {manual
                      ? <ValorEditavel valor={k.lance} min={0.05} max={200} rotulo={`lance de ${k.texto}`}
                          aviso={(_, m) => (m > 0.3 ? 'Aumento acima de 30%: acompanhe o custo nos próximos dias.' : null)}
                          onSalvar={v => executar({ acao: 'lance_palavra', palavraId: k.id, valor: v }, k.lance ? { acao: 'lance_palavra', palavraId: k.id, valor: k.lance } : null)} />
                      : <span className="text-xs text-muted" title="A campanha usa lance automático do Google">Automático</span>}
                  </td>
                </tr>
              )
            })}
          </Tabela>
        )}
      {lista.length > qtd && (
        <button onClick={() => setQtd(q => q + POR_PAGINA)} className="w-full py-2 text-sm font-semibold text-text-2 hover:text-text">
          Ver mais {Math.min(POR_PAGINA, lista.length - qtd)} de {lista.length - qtd}
        </button>
      )}

      {grupos.length > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-semibold text-text" htmlFor="grupo-novo">Adicionar palavras-chave em</label>
            <select id="grupo-novo" value={grupoNovo} onChange={e => setGrupoNovo(e.target.value)} className={`${campo} max-w-full`}>
              <option value="">Escolha o grupo de anúncios</option>
              {grupos.map(g => <option key={g.id} value={g.id}>{campanhaId ? g.nome : `${g.campanha} › ${g.nome}`}</option>)}
            </select>
          </div>
          {grupoNovo && <AdicionarPalavras key={grupoNovo} grupo={grupos.find(g => g.id === grupoNovo)} executar={executar} />}
        </div>
      )}
    </div>
  )
}

function AbaAnuncios({ d, campanhaId, executar }) {
  const lista = d.anuncios.filter(a => !campanhaId || a.campanhaId === campanhaId)
  const corForca = { Ruim: NIVEIS.critico, 'Média': NIVEIS.atencao, Boa: NIVEIS.positivo, Excelente: NIVEIS.positivo }
  const status = (a, s) => ({ acao: 'anuncio_status', anuncioId: a.id, status: s })
  const colunas = [{ rotulo: '' }, { rotulo: 'Anúncio' }, { rotulo: 'Investido', num: true }, { rotulo: 'Conv.', num: true }, { rotulo: 'CTR', num: true }]

  if (!lista.length) return <p className="text-sm text-muted">Nenhum anúncio de texto aqui. Campanhas Performance Max e Smart têm os anúncios montados pelo Google.</p>
  return (
    <Tabela colunas={colunas}>
      {lista.map(a => {
        const ativo = a.status === 'ENABLED'
        const cor = corForca[a.forca]
        return (
          <tr key={a.id}>
            <td className={`${td} w-12`}>
              <Interruptor ativo={ativo} rotulo={`${ativo ? 'Pausar' : 'Ativar'} anúncio`}
                onAlternar={() => executar(status(a, ativo ? 'PAUSED' : 'ENABLED'), status(a, ativo ? 'ENABLED' : 'PAUSED'))} />
            </td>
            <td className={`${td} min-w-[16rem]`}>
              <p className={`text-sm font-semibold ${ativo ? 'text-text' : 'text-muted'}`}>{a.titulos.join(' | ') || 'Anúncio sem títulos'}</p>
              <p className="text-xs text-muted">{campanhaId ? a.grupo : `${a.campanha} › ${a.grupo}`}</p>
              <div className="mt-1 flex flex-wrap gap-1 empty:hidden">
                {a.forca && <Etiqueta cor={cor?.cor || '#7680a8'} fundo={cor?.fundo || '#eceef8'}>Força: {a.forca}</Etiqueta>}
                {a.reprovado && <Etiqueta cor={VERMELHO} fundo={NIVEIS.critico.fundo}>Reprovado</Etiqueta>}
                {a.limitado && <Etiqueta cor={NIVEIS.atencao.cor} fundo={NIVEIS.atencao.fundo}>Aprovado com restrição</Etiqueta>}
              </div>
            </td>
            <td className={tdNum}>{brl(a.custo)}</td>
            <td className={tdNum}>{num(a.conversoes)}</td>
            <td className={tdNum}>{a.impressoes ? `${(a.cliques / a.impressoes * 100).toFixed(1)}%` : '—'}</td>
          </tr>
        )
      })}
    </Tabela>
  )
}

function AbaRegioes({ d, conta, campanhaId, executar }) {
  const [confirmando, setConfirmando] = useState(null)
  const [campanhaSel, setCampanhaSel] = useState('')
  const limite = Math.max(30, 1.5 * (cpa(d.atual) || 0))
  const porId = new Map(d.campanhas.map(c => [c.id, c]))
  const cidades = d.cidades.filter(c => !campanhaId || c.campanhas.includes(campanhaId))
  const alvo = campanhaId || campanhaSel
  const colunas = [{ rotulo: 'Cidade' }, { rotulo: 'Investido', num: true }, { rotulo: 'Conv.', num: true }, { rotulo: 'Custo/conv.', num: true }, { rotulo: '' }]

  async function excluirCidade(c) {
    for (const id of campanhaId ? [campanhaId] : c.campanhas) {
      for (const geo of c.geos || [c.geo]) await executar({ acao: 'regiao_adicionar', campanhaId: id, geo, nome: c.nome, excluir: true })
    }
    setConfirmando(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-text">Onde o dinheiro foi gasto</p>
        {cidades.length === 0
          ? <p className="text-sm text-muted mt-1">Sem dados por cidade no período.</p>
          : (
            <Tabela colunas={colunas}>
              {cidades.map(c => {
                const ruim = c.conversoes === 0 && c.custo >= limite
                const n = campanhaId ? 1 : c.campanhas.length
                return [
                  <tr key={c.geo}>
                    <td className={td}>
                      <p className="text-sm text-text">{c.nome}</p>
                      {ruim && <p className="text-xs font-semibold" style={{ color: NIVEIS.atencao.cor }}>Gastando sem converter</p>}
                    </td>
                    <td className={tdNum}>{brl(c.custo)}</td>
                    <td className={tdNum}>{num(c.conversoes)}</td>
                    <td className={tdNum}>{custoConv(c)}</td>
                    <td className={`${td} text-right`}>
                      <button onClick={() => setConfirmando(c.geo)} disabled={confirmando === c.geo} className={botaoNeutro}>Excluir</button>
                    </td>
                  </tr>,
                  confirmando === c.geo && (
                    <LinhaConfirmacao key={`${c.geo}-c`} colunas={colunas.length}>
                      <Confirmacao
                        texto={`Excluir ${c.nome} ${n === 1 ? `da campanha "${porId.get(campanhaId || c.campanhas[0])?.nome || ''}"` : `das ${n} campanhas onde ela apareceu`}? Os anúncios deixam de aparecer lá.`}
                        aviso={c.conversoes > 0 ? `Atenção: ${c.nome} gerou ${num(c.conversoes)} conversões no período.` : null}
                        rotulo="Excluir cidade" onConfirmar={() => excluirCidade(c)} onCancelar={() => setConfirmando(null)} />
                    </LinhaConfirmacao>
                  ),
                ]
              })}
            </Tabela>
          )}
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text">Regiões configuradas{campanhaId && ` em ${porId.get(campanhaId)?.nome || ''}`}</p>
          {!campanhaId && (
            <select value={campanhaSel} onChange={e => setCampanhaSel(e.target.value)} aria-label="Campanha" className={`${campo} max-w-full`}>
              <option value="">Escolha a campanha</option>
              {d.campanhas.filter(c => c.status === 'ENABLED').map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          )}
        </div>
        {alvo && porId.get(alvo) && (
          <div className="mt-3"><PainelRegioes key={alvo} contaId={conta.id} campanha={porId.get(alvo)} executarBase={executar} /></div>
        )}
      </div>
    </div>
  )
}

function AbaConversoes({ d, executar }) {
  const [confirmando, setConfirmando] = useState(null)
  if (!d.conversoes.length) return <p className="text-sm text-muted">Nenhuma ação de conversão nesta conta.</p>
  return (
    <div>
      <p className="text-sm text-muted">
        <strong className="text-text-2">Principal</strong> conta no total e orienta os lances automáticos. Deixe como principal só contato ou venda de verdade.
      </p>
      <ul className="divide-y divide-border mt-2">
        {d.conversoes.map(x => (
          <li key={x.id} className="py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex-1 min-w-[12rem]">
                <p className="text-sm font-semibold text-text">{x.nome}</p>
                <p className="text-xs text-muted">{(CATEGORIAS[x.categoria] || x.categoria) !== x.nome && `${CATEGORIAS[x.categoria] || x.categoria} · `}{num(x.todas)} no período</p>
              </div>
              <Etiqueta {...(x.principal
                ? (x.fraca && x.todas > 0 ? { cor: NIVEIS.atencao.cor, fundo: NIVEIS.atencao.fundo } : { cor: NIVEIS.positivo.cor, fundo: NIVEIS.positivo.fundo })
                : { cor: '#7680a8', fundo: '#eceef8' })}>{x.principal ? 'Principal' : 'Secundária'}</Etiqueta>
              <button onClick={() => setConfirmando(x.id)} disabled={confirmando === x.id} className={botaoNeutro}>
                {x.principal ? 'Tornar secundária' : 'Tornar principal'}
              </button>
            </div>
            {confirmando === x.id && (
              <Confirmacao
                texto={x.principal
                  ? `Tornar "${x.nome}" secundária? Ela continua registrada, mas deixa de contar no total e de orientar os lances.`
                  : `Tornar "${x.nome}" principal? Ela passa a contar no total e a orientar os lances.`}
                aviso="Os lances automáticos levam cerca de 2 semanas para se reajustar."
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

function MarcarOtimizacao({ d, inicio, executar, onConcluida, onFechar }) {
  const [nota, setNota] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const feitas = (d.historico?.itens || []).filter(h => new Date(h.criado_em) >= inicio && h.acao !== 'otimizacao_concluida')

  async function concluir() {
    setEnviando(true)
    setErro('')
    try {
      await executar({ acao: 'concluir_otimizacao', nota })
      onConcluida()
    } catch (e) { setErro(e.message) } finally { setEnviando(false) }
  }

  return (
    <section className="bg-white rounded-2xl card-shadow p-5 space-y-3" aria-label="Marcar otimização feita">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-text">Marcar otimização feita</p>
        <button onClick={onFechar} aria-label="Fechar" className="text-muted hover:text-text"><X size={16} /></button>
      </div>
      {feitas.length > 0 && (
        <ul className="space-y-1">
          {feitas.map((h, i) => <li key={i} className="text-sm text-text-2 flex gap-2"><Check size={15} className="flex-shrink-0 mt-0.5 text-accent-hover" />{h.resumo}{h.campanha_nome && ` · ${h.campanha_nome}`}</li>)}
        </ul>
      )}
      <textarea value={nota} onChange={e => setNota(e.target.value)} rows={3} className={`${campo} w-full`} aria-label="Anotação"
        placeholder="Anotação opcional: o que você fez e o que conferir na próxima vez." />
      {erro && <p className="text-sm" style={{ color: VERMELHO }}>{erro}</p>}
      <button onClick={concluir} disabled={enviando} className={`${botaoPrincipal} !text-sm !px-4 !py-2`}>
        {enviando && <Loader2 size={14} className="animate-spin" />}Registrar
      </button>
    </section>
  )
}

function Aviso({ aviso, onFechar, onDesfazer }) {
  const [desfazendo, setDesfazendo] = useState(false)
  useEffect(() => {
    const t = setTimeout(onFechar, 10000)
    return () => clearTimeout(t)
  }, [aviso]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div role="status" className="fixed z-40 inset-x-4 sm:left-auto sm:right-6 sm:w-[26rem] flex items-start gap-3 p-3.5 rounded-xl text-white"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', background: '#1a1d2e', boxShadow: '0 10px 30px rgba(17,24,39,0.3)' }}>
      <CircleCheck size={17} className="flex-shrink-0 mt-0.5 text-accent" />
      <p className="flex-1 text-sm">{aviso.texto}</p>
      {aviso.desfazer && (
        <button disabled={desfazendo} onClick={async () => { setDesfazendo(true); try { await onDesfazer(aviso.desfazer) } finally { setDesfazendo(false) } }}
          className="text-sm font-bold text-accent hover:underline underline-offset-2 disabled:opacity-60 whitespace-nowrap">
          {desfazendo ? 'Desfazendo…' : 'Desfazer'}
        </button>
      )}
      <button onClick={onFechar} aria-label="Fechar aviso" className="text-white/60 hover:text-white"><X size={15} /></button>
    </div>
  )
}

export default function Conta({ conta, dias, onVoltar }) {
  const [params, setParams] = useSearchParams()
  const aba = ABAS.some(a => a.id === params.get('aba')) ? params.get('aba') : 'campanhas'
  const campanhaId = params.get('campanha') || ''
  const [d, setD] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState(null)
  const [marcando, setMarcando] = useState(false)
  const [otimizadaEm, setOtimizadaEm] = useState(conta.ultimaOtimizacao?.em || null)
  const inicio = useRef(new Date(Date.now() - 60000)).current

  const carregar = useCallback(async () => {
    try {
      setD(await chamar({ acao: 'otimizar', contaId: conta.id, dias }))
      setErro('')
    } catch (e) { setErro(e.message) }
  }, [conta.id, dias])
  useEffect(() => { carregar() }, [carregar])

  const executar = useCallback(async (body, desfazer) => {
    const r = await chamar({ ...body, contaId: conta.id })
    if (body.acao !== 'concluir_otimizacao') {
      setAviso({ texto: r.resumo + (r.registrado ? '' : '. O registro no histórico não foi salvo.'), desfazer: desfazer || null })
    }
    await carregar()
    return r
  }, [conta.id, carregar])

  const navegar = mudancas => {
    const p = { conta: conta.id, aba, campanha: campanhaId, ...mudancas }
    setParams(Object.fromEntries(Object.entries(p).filter(([, v]) => v)))
  }
  const abaAtual = ABAS.find(a => a.id === aba)
  const inflada = contaInflada(conta)
  const motivo = conta.insights.find(x => x.nivel === 'critico' || x.nivel === 'atencao')
  const projecao = d && d.mes.diasPassados > 0 ? d.mes.custo / d.mes.diasPassados * d.mes.diasNoMes : null

  return (
    <div className="space-y-4">
      <button onClick={onVoltar} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
        <ArrowLeft size={15} />Minhas contas
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-text">{conta.nome}</h2>
          <p className="text-xs text-muted mt-0.5 flex flex-wrap items-center gap-x-1.5">
            <PontoSaude saude={conta.saude} comRotulo />
            {motivo && <span style={{ color: NIVEIS[motivo.nivel].cor }}>{motivo.titulo}</span>}
            <span>· {formatarId(conta.id)}</span>
            {conta.gestor && <span>· {conta.gestor}</span>}
            <span>· Otimizada: {textoOtimizacao(diasDesde(otimizadaEm)).toLowerCase()}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={linkGoogleAds(conta.id)} target="_blank" rel="noreferrer" className={`${botaoNeutro} !text-sm !px-3.5 !py-2`}>
            Abrir no Google Ads<ExternalLink size={13} />
          </a>
          <button onClick={() => setMarcando(v => !v)} disabled={!d} aria-expanded={marcando} className={`${botaoPrincipal} !text-sm !px-3.5 !py-2`}>
            <CircleCheck size={14} />Marcar otimização feita
          </button>
        </div>
      </div>

      {marcando && d && (
        <MarcarOtimizacao d={d} inicio={inicio} executar={executar} onFechar={() => setMarcando(false)}
          onConcluida={() => { setMarcando(false); setOtimizadaEm(new Date().toISOString()); setAviso({ texto: `Otimização de ${conta.nome} registrada.` }) }} />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1">
            <Numero rotulo="Investido" valor={brl(d.atual.custo)}><Variacao atual={d.atual.custo} anterior={d.anterior.custo} bomQuandoSobe={null} /></Numero>
            <Numero rotulo="Conversões" valor={num(d.atual.conversoes)} ajuda="conversao">{inflada ? <SemComparacao /> : <Variacao atual={d.atual.conversoes} anterior={d.anterior.conversoes} />}</Numero>
            <Numero rotulo="Custo por conversão" valor={custoConv(d.atual)} ajuda="custoConv">{inflada ? <SemComparacao /> : <Variacao atual={cpa(d.atual)} anterior={cpa(d.anterior)} bomQuandoSobe={false} />}</Numero>
            <Numero rotulo="Previsão do mês" valor={projecao == null ? '—' : brl(projecao)}><span className="text-xs text-muted">{brl(d.mes.custo)} até agora</span></Numero>
          </div>

          <section className="bg-white rounded-2xl card-shadow">
            <div className="px-5 pt-3 border-b border-border flex flex-wrap items-end justify-between gap-x-4">
              <nav aria-label="Seções da conta" className="overflow-x-auto overflow-y-hidden -mx-1 px-1 max-w-full">
                <ul className="flex gap-1 min-w-max">
                  {ABAS.map(a => (
                    <li key={a.id}>
                      <button onClick={() => navegar({ aba: a.id })} aria-current={a.id === aba ? 'page' : undefined}
                        className={`px-3 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${a.id === aba ? 'border-text text-text' : 'border-transparent text-muted hover:text-text-2'}`}>
                        {a.rotulo}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              {abaAtual.porCampanha && (
                <select value={campanhaId} onChange={e => navegar({ campanha: e.target.value })} aria-label="Filtrar por campanha"
                  className={`${campo} my-2 max-w-full sm:max-w-[16rem]`}>
                  <option value="">Todas as campanhas</option>
                  {d.campanhas.map(c => <option key={c.id} value={c.id}>{c.nome}{c.status !== 'ENABLED' ? ' (pausada)' : ''}</option>)}
                </select>
              )}
            </div>
            <div className="p-5">
              {aba === 'campanhas' && <AbaCampanhas d={d} conta={conta} executar={executar} verPalavras={id => navegar({ aba: 'palavras', campanha: id })} />}
              {aba === 'palavras' && <AbaPalavras key={campanhaId} d={d} campanhaId={campanhaId} executar={executar} />}
              {aba === 'termos' && <Termos contaId={conta.id} dias={dias} campanhaId={campanhaId} executar={executar} />}
              {aba === 'anuncios' && <AbaAnuncios d={d} campanhaId={campanhaId} executar={executar} />}
              {aba === 'regioes' && <AbaRegioes key={campanhaId} d={d} conta={conta} campanhaId={campanhaId} executar={executar} />}
              {aba === 'conversoes' && <AbaConversoes d={d} executar={executar} />}
              {aba === 'historico' && <Historico historico={d.historico} />}
            </div>
          </section>
        </>
      )}

      {aviso && <Aviso aviso={aviso} onFechar={() => setAviso(null)} onDesfazer={body => executar(body)} />}
    </div>
  )
}
