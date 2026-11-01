import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight, CircleCheck, Loader2, Search, X, Pencil } from 'lucide-react'
import {
  NIVEIS, brl, num, cpa, contaInflada, etiquetasDaCampanha,
} from './regras'
import { chamar, Ajuda, Variacao, SemComparacao, Numero, PontoSaude, Tarefa, Bloco, formatarId } from './componentes'

const CORRESPONDENCIA = { EXACT: 'Exata', PHRASE: 'Frase', BROAD: 'Ampla' }
const VERMELHO = NIVEIS.critico.cor

const botao = 'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
const botaoNeutro = `${botao} bg-surface-2 text-text hover:bg-border`
const botaoPrincipal = `${botao} bg-accent text-text hover:bg-accent-hover`
const botaoPerigo = `${botao} text-white hover:opacity-90`
const campo = 'text-sm px-3 py-1.5 rounded-lg bg-white border border-border outline-none focus:border-text-2 focus:ring-2 focus:ring-accent/30'

// Confirmação no próprio lugar da ação: mostra exatamente o que vai mudar antes de enviar ao Google Ads.
function Confirmacao({ texto, aviso, rotulo = 'Confirmar', perigo, onConfirmar, onCancelar }) {
  const [executando, setExecutando] = useState(false)
  const [erro, setErro] = useState('')
  async function confirmar() {
    setExecutando(true)
    setErro('')
    try {
      await onConfirmar()
    } catch (e) {
      setErro(e.message)
      setExecutando(false)
    }
  }
  return (
    <div className="mt-2 p-3 rounded-xl bg-surface-2/70" role="alertdialog" aria-label="Confirmar alteração">
      <p className="text-sm text-text">{texto}</p>
      {aviso && <p className="text-xs mt-1" style={{ color: NIVEIS.atencao.cor }}>{aviso}</p>}
      {erro && <p className="text-xs mt-1" style={{ color: VERMELHO }}>{erro}</p>}
      <div className="flex flex-wrap gap-2 mt-2.5">
        <button onClick={confirmar} disabled={executando} className={perigo ? botaoPerigo : botaoPrincipal} style={perigo ? { background: VERMELHO } : undefined}>
          {executando && <Loader2 size={13} className="animate-spin" />}{executando ? 'Enviando ao Google Ads…' : rotulo}
        </button>
        <button onClick={onCancelar} disabled={executando} className={botaoNeutro}>Cancelar</button>
      </div>
    </div>
  )
}

function StatusCampanha({ campanha, executar }) {
  const [confirmando, setConfirmando] = useState(false)
  const ativa = campanha.status === 'ENABLED'
  return (
    <>
      <button onClick={() => setConfirmando(true)} disabled={confirmando} className={botaoNeutro}>
        {ativa ? 'Pausar campanha' : 'Ativar campanha'}
      </button>
      {confirmando && (
        <div className="basis-full order-last">
          <Confirmacao
            texto={ativa
              ? `Pausar "${campanha.nome}"? Os anúncios dela param de aparecer em poucos minutos.`
              : `Ativar "${campanha.nome}"? Ela volta a investir até ${brl(campanha.orcamento_diario)} por dia.`}
            rotulo={ativa ? 'Pausar' : 'Ativar'} perigo={ativa}
            onConfirmar={() => executar({ acao: 'status_campanha', campanhaId: campanha.id, status: ativa ? 'PAUSED' : 'ENABLED' })}
            onCancelar={() => setConfirmando(false)} />
        </div>
      )}
    </>
  )
}

function Orcamento({ campanha, executar }) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const atual = campanha.orcamento_diario
  const novo = Number(String(valor).replace(',', '.'))
  const valido = novo >= 1 && novo <= 5000 && Math.abs(novo - atual) >= 0.01
  const mudanca = atual > 0 ? (novo - atual) / atual : 0

  if (campanha.orcamento_compartilhado) {
    return <span className="text-xs text-muted">Orçamento compartilhado com outras campanhas: altere no Google Ads</span>
  }
  if (!editando) {
    return (
      <button onClick={() => { setValor(String(atual.toFixed(2)).replace('.', ',')); setEditando(true) }} className={botaoNeutro}>
        <Pencil size={12} />Orçamento: {brl(atual)}/dia
      </button>
    )
  }
  return (
    <div className="basis-full order-last">
      <form onSubmit={e => { e.preventDefault(); if (valido) setConfirmando(true) }} className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted" htmlFor={`orc-${campanha.id}`}>Novo orçamento por dia (R$)</label>
        <input id={`orc-${campanha.id}`} inputMode="decimal" value={valor} onChange={e => { setValor(e.target.value); setConfirmando(false) }}
          className={`${campo} w-28 tabular-nums`} autoFocus />
        <button type="submit" disabled={!valido} className={botaoPrincipal}>Revisar</button>
        <button type="button" onClick={() => { setEditando(false); setConfirmando(false) }} className={botaoNeutro}>Cancelar</button>
      </form>
      {valor && !valido && <p className="text-xs mt-1 text-muted">Informe um valor diferente do atual, entre R$ 1 e R$ 5.000.</p>}
      {confirmando && (
        <Confirmacao
          texto={`Mudar o orçamento de "${campanha.nome}" de ${brl(atual)} para ${brl(novo)} por dia (${mudanca > 0 ? '+' : ''}${Math.round(mudanca * 100)}%)?`}
          aviso={mudanca > 0.2 ? 'Aumentos acima de 20% de uma vez podem fazer a campanha voltar ao período de aprendizado. Se puder, aumente aos poucos.' : null}
          rotulo="Salvar orçamento"
          onConfirmar={async () => { await executar({ acao: 'orcamento', campanhaId: campanha.id, valor: novo }); setEditando(false) }}
          onCancelar={() => setConfirmando(false)} />
      )}
    </div>
  )
}

function PalavraLinha({ palavra, executar }) {
  const [confirmando, setConfirmando] = useState(false)
  const ativa = palavra.status === 'ENABLED'
  return (
    <li className="py-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${ativa ? 'text-text' : 'text-muted line-through decoration-muted/50'}`}>{palavra.texto}</p>
          <p className="text-xs text-muted">{CORRESPONDENCIA[palavra.correspondencia] || palavra.correspondencia} · {brl(palavra.custo)} · {num(palavra.conversoes)} conv.{!ativa && ' · pausada'}</p>
        </div>
        <button onClick={() => setConfirmando(true)} disabled={confirmando} className={botaoNeutro}>{ativa ? 'Pausar' : 'Ativar'}</button>
      </div>
      {confirmando && (
        <Confirmacao texto={`${ativa ? 'Pausar' : 'Ativar'} a palavra-chave "${palavra.texto}"?`} rotulo={ativa ? 'Pausar' : 'Ativar'} perigo={ativa}
          onConfirmar={() => executar({ acao: 'palavra_status', palavraId: palavra.id, status: ativa ? 'PAUSED' : 'ENABLED' })}
          onCancelar={() => setConfirmando(false)} />
      )}
    </li>
  )
}

function AdicionarPalavras({ grupo, executar }) {
  const [aberto, setAberto] = useState(false)
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState('PHRASE')
  const [confirmando, setConfirmando] = useState(false)
  const lista = [...new Set(texto.split('\n').map(t => t.trim().toLowerCase()).filter(Boolean))]

  if (!aberto) return <div><button onClick={() => setAberto(true)} className={`${botaoNeutro} mt-2`}>Adicionar palavras-chave</button></div>
  return (
    <div className="mt-2 space-y-2">
      <label className="block text-xs text-muted" htmlFor={`kw-${grupo.id}`}>Uma palavra-chave por linha</label>
      <textarea id={`kw-${grupo.id}`} value={texto} onChange={e => { setTexto(e.target.value); setConfirmando(false) }} rows={4}
        className={`${campo} w-full`} placeholder={'advogado de família\ndivórcio consensual'} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted" htmlFor={`tipo-${grupo.id}`}>Correspondência</label>
        <select id={`tipo-${grupo.id}`} value={tipo} onChange={e => setTipo(e.target.value)} className={campo}>
          <option value="PHRASE">Frase (recomendado)</option>
          <option value="EXACT">Exata</option>
          <option value="BROAD">Ampla</option>
        </select>
        <button onClick={() => setConfirmando(true)} disabled={!lista.length || lista.length > 50} className={botaoPrincipal}>Revisar</button>
        <button onClick={() => { setAberto(false); setTexto(''); setConfirmando(false) }} className={botaoNeutro}>Cancelar</button>
      </div>
      {lista.length > 50 && <p className="text-xs" style={{ color: VERMELHO }}>No máximo 50 palavras-chave por vez.</p>}
      {confirmando && (
        <Confirmacao
          texto={`Adicionar ${lista.length} ${lista.length === 1 ? 'palavra-chave' : 'palavras-chave'} como ${CORRESPONDENCIA[tipo]} no grupo "${grupo.nome}"? Elas começam a valer na hora.`}
          aviso={tipo === 'BROAD' ? 'A correspondência ampla mostra o anúncio para muitas buscas parecidas. Acompanhe os termos de pesquisa nos próximos dias.' : null}
          rotulo="Adicionar"
          onConfirmar={async () => { await executar({ acao: 'palavras_adicionar', grupoId: grupo.id, palavras: lista, correspondencia: tipo }); setTexto(''); setAberto(false) }}
          onCancelar={() => setConfirmando(false)} />
      )}
    </div>
  )
}

const PALAVRAS_VISIVEIS = 8

function GrupoPalavras({ grupo, executar }) {
  const [todas, setTodas] = useState(false)
  const visiveis = todas ? grupo.palavras : grupo.palavras.slice(0, PALAVRAS_VISIVEIS)
  return (
    <div>
      <p className="text-sm font-semibold text-text">Grupo: {grupo.nome}{grupo.status !== 'ENABLED' && <span className="text-muted font-normal"> (pausado)</span>}</p>
      {grupo.palavras.length === 0
        ? <p className="text-xs text-muted mt-1">Nenhuma palavra-chave neste grupo.</p>
        : <ul className="divide-y divide-border">{visiveis.map(k => <PalavraLinha key={k.id} palavra={k} executar={executar} />)}</ul>}
      {grupo.palavras.length > PALAVRAS_VISIVEIS && (
        <button onClick={() => setTodas(v => !v)} className="mt-1 text-xs font-semibold text-text-2 hover:text-text">
          {todas ? 'Mostrar só as que mais gastam' : `Ver todas as ${grupo.palavras.length} palavras-chave`}
        </button>
      )}
      <AdicionarPalavras grupo={grupo} executar={executar} />
    </div>
  )
}

function PainelPalavras({ contaId, campanha, dias, executarBase }) {
  const [grupos, setGrupos] = useState(null)
  const [erro, setErro] = useState('')
  const carregar = useCallback(async () => {
    setErro('')
    try {
      setGrupos((await chamar({ acao: 'palavras', contaId, campanhaId: campanha.id, dias })).grupos)
    } catch (e) { setErro(e.message) }
  }, [contaId, campanha.id, dias])
  useEffect(() => { carregar() }, [carregar])
  const executar = async body => { await executarBase(body); await carregar() }

  if (erro) return <p className="text-sm" style={{ color: VERMELHO }}>Não foi possível carregar as palavras-chave: {erro}</p>
  if (!grupos) return <p className="text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Carregando palavras-chave…</p>
  if (!grupos.length) return <p className="text-sm text-muted">Esta campanha não tem grupos de anúncios.</p>
  return (
    <div className="space-y-5">
      {grupos.map(g => <GrupoPalavras key={g.id} grupo={g} executar={executar} />)}
    </div>
  )
}

function RegiaoLinha({ regiao, campanha, executar }) {
  const [confirmando, setConfirmando] = useState(false)
  return (
    <li className="py-2">
      <div className="flex items-center gap-3">
        <p className="flex-1 min-w-0 text-sm text-text">{regiao.nome}<span className="text-xs text-muted"> · {regiao.tipo}</span></p>
        <button onClick={() => setConfirmando(true)} disabled={confirmando} className={botaoNeutro}>{regiao.excluida ? 'Desfazer exclusão' : 'Remover'}</button>
      </div>
      {confirmando && (
        <Confirmacao
          texto={regiao.excluida
            ? `Desfazer a exclusão de ${regiao.nome}? A campanha volta a poder aparecer lá, se a região estiver dentro das incluídas.`
            : `Remover ${regiao.nome} das regiões da campanha? Os anúncios deixam de aparecer lá.`}
          rotulo={regiao.excluida ? 'Desfazer exclusão' : 'Remover'} perigo={!regiao.excluida}
          onConfirmar={() => executar({ acao: 'regiao_remover', campanhaId: campanha.id, criterio: regiao.criterio })}
          onCancelar={() => setConfirmando(false)} />
      )}
    </li>
  )
}

function Sugestao({ sugestao, campanha, executar, aoConcluir }) {
  const [modo, setModo] = useState(null)
  return (
    <li className="py-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="flex-1 min-w-0 text-sm text-text">{sugestao.nome}
          <span className="text-xs text-muted"> · {sugestao.tipo}{sugestao.alcance > 0 && ` · alcance de ${num(sugestao.alcance)} pessoas`}</span>
        </p>
        <button onClick={() => setModo('incluir')} disabled={!!modo} className={botaoNeutro}>Incluir</button>
        <button onClick={() => setModo('excluir')} disabled={!!modo} className={botaoNeutro}>Excluir</button>
      </div>
      {modo && (
        <Confirmacao
          texto={modo === 'incluir'
            ? `Incluir ${sugestao.nome} nas regiões de "${campanha.nome}"? Os anúncios passam a aparecer lá.`
            : `Excluir ${sugestao.nome} de "${campanha.nome}"? Os anúncios deixam de aparecer lá.`}
          rotulo={modo === 'incluir' ? 'Incluir região' : 'Excluir região'}
          onConfirmar={async () => { await executar({ acao: 'regiao_adicionar', campanhaId: campanha.id, geo: sugestao.geo, nome: sugestao.nome, excluir: modo === 'excluir' }); aoConcluir() }}
          onCancelar={() => setModo(null)} />
      )}
    </li>
  )
}

function PainelRegioes({ contaId, campanha, executarBase }) {
  const [regioes, setRegioes] = useState(null)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [sugestoes, setSugestoes] = useState(null)
  const [buscando, setBuscando] = useState(false)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setRegioes((await chamar({ acao: 'regioes', contaId, campanhaId: campanha.id })).regioes)
    } catch (e) { setErro(e.message) }
  }, [contaId, campanha.id])
  useEffect(() => { carregar() }, [carregar])
  const executar = async body => { await executarBase(body); await carregar() }

  async function buscar(e) {
    e.preventDefault()
    if (busca.trim().length < 2) return
    setBuscando(true)
    try {
      setSugestoes((await chamar({ acao: 'buscar_regiao', contaId, texto: busca })).sugestoes)
    } catch (err) { setErro(err.message) } finally { setBuscando(false) }
  }

  if (erro && !regioes) return <p className="text-sm" style={{ color: VERMELHO }}>Não foi possível carregar as regiões: {erro}</p>
  if (!regioes) return <p className="text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Carregando regiões…</p>

  const incluidas = regioes.filter(r => !r.excluida)
  const excluidas = regioes.filter(r => r.excluida)
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-text">Onde os anúncios aparecem</p>
        {incluidas.length === 0
          ? <p className="text-sm mt-1" style={{ color: NIVEIS.atencao.cor }}>Nenhuma região definida: a campanha pode aparecer em qualquer lugar.</p>
          : <ul className="divide-y divide-border">{incluidas.map(r => <RegiaoLinha key={r.criterio} regiao={r} campanha={campanha} executar={executar} />)}</ul>}
      </div>
      {excluidas.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-text">Regiões excluídas</p>
          <ul className="divide-y divide-border">{excluidas.map(r => <RegiaoLinha key={r.criterio} regiao={r} campanha={campanha} executar={executar} />)}</ul>
        </div>
      )}
      <div>
        <form onSubmit={buscar} className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`reg-${campanha.id}`}>Buscar cidade ou estado</label>
          <input id={`reg-${campanha.id}`} value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar cidade ou estado para incluir ou excluir"
            className={`${campo} flex-1 min-w-[12rem]`} />
          <button type="submit" disabled={buscando || busca.trim().length < 2} className={botaoNeutro}>
            {buscando ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}Buscar
          </button>
        </form>
        {sugestoes?.length === 0 && <p className="text-xs text-muted mt-2">Nenhuma região encontrada com esse nome no Brasil.</p>}
        {sugestoes?.length > 0 && (
          <ul className="divide-y divide-border mt-1">
            {sugestoes.map(s => <Sugestao key={s.geo} sugestao={s} campanha={campanha} executar={executar} aoConcluir={() => { setSugestoes(null); setBusca('') }} />)}
          </ul>
        )}
      </div>
    </div>
  )
}

function CampanhaItem({ campanha, contaId, dias, executar }) {
  const [painel, setPainel] = useState(null)
  const etiquetas = etiquetasDaCampanha(campanha)
  const ativa = campanha.status === 'ENABLED'
  const alternar = p => setPainel(atual => (atual === p ? null : p))
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-sm font-semibold text-text">{campanha.nome}</p>
        {!ativa && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-surface-2 text-muted">Pausada</span>}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2 tabular-nums max-w-xl">
        <div><p className="text-xs text-muted">Investido</p><p className="text-sm font-semibold">{brl(campanha.custo)}</p></div>
        <div><p className="text-xs text-muted">Conversões</p><p className="text-sm font-semibold">{num(campanha.conversoes)}</p></div>
        <div><p className="text-xs text-muted">Custo por conversão</p><p className="text-sm font-semibold">{cpa(campanha) == null ? '—' : brl(cpa(campanha))}</p></div>
      </div>
      {ativa && etiquetas.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {etiquetas.map(e => (
            <span key={e.rotulo} className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ color: e.cor, background: e.fundo }}>
              {e.rotulo}{e.ajuda && <Ajuda chave={e.ajuda} />}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusCampanha campanha={campanha} executar={executar} />
        <Orcamento campanha={campanha} executar={executar} />
        {campanha.pesquisa && (
          <button onClick={() => alternar('palavras')} aria-expanded={painel === 'palavras'} className={botaoNeutro}>
            {painel === 'palavras' ? <ChevronDown size={13} /> : <ChevronRight size={13} />}Palavras-chave
          </button>
        )}
        <button onClick={() => alternar('regioes')} aria-expanded={painel === 'regioes'} className={botaoNeutro}>
          {painel === 'regioes' ? <ChevronDown size={13} /> : <ChevronRight size={13} />}Regiões
        </button>
      </div>
      {painel && (
        <div className="mt-3 p-4 rounded-xl border border-border">
          {painel === 'palavras'
            ? <PainelPalavras contaId={contaId} campanha={campanha} dias={dias} executarBase={executar} />
            : <PainelRegioes contaId={contaId} campanha={campanha} executarBase={executar} />}
        </div>
      )}
    </li>
  )
}

function Termos({ contaId, dias, executar }) {
  const [estado, setEstado] = useState({ carregando: false, termos: null, erro: '' })
  const [marcados, setMarcados] = useState(new Set())
  const [tipo, setTipo] = useState('EXACT')
  const [confirmando, setConfirmando] = useState(false)

  async function carregar() {
    setEstado({ carregando: true, termos: null, erro: '' })
    setMarcados(new Set())
    try {
      const d = await chamar({ acao: 'termos', contaId, dias })
      setEstado({ carregando: false, termos: d.termos, erro: '' })
    } catch (e) {
      setEstado({ carregando: false, termos: null, erro: e.message })
    }
  }

  const chave = t => `${t.campanha_id}|${t.termo}`
  const alternar = t => setMarcados(m => { const n = new Set(m); n.has(chave(t)) ? n.delete(chave(t)) : n.add(chave(t)); return n })
  const selecionados = (estado.termos || []).filter(t => marcados.has(chave(t)))
  const porCampanha = selecionados.reduce((acc, t) => ((acc[t.campanha_id] ||= { nome: t.campanha, termos: [] }).termos.push(t.termo), acc), {})
  const nCampanhas = Object.keys(porCampanha).length

  async function negativar() {
    for (const [campanhaId, g] of Object.entries(porCampanha)) {
      await executar({ acao: 'negativar', campanhaId, termos: g.termos, correspondencia: tipo })
    }
    setEstado(e => ({ ...e, termos: e.termos.filter(t => !marcados.has(chave(t))) }))
    setMarcados(new Set())
    setConfirmando(false)
  }

  return (
    <Bloco titulo="Buscas que gastam sem converter"
      descricao="Termos que as pessoas pesquisaram, geraram clique e não viraram conversão. Marque os que não têm a ver com o cliente e negative.">
      <div className="py-3">
        {!estado.termos && !estado.carregando && (
          <>
            <button onClick={carregar} className={botaoNeutro}>Buscar os termos</button>
            {estado.erro && <p className="text-sm mt-2" style={{ color: VERMELHO }}>Não foi possível buscar os termos: {estado.erro}</p>}
          </>
        )}
        {estado.carregando && <p className="text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Buscando termos de pesquisa…</p>}
        {estado.termos?.length === 0 && <p className="text-sm text-text-2">Nenhuma busca com gasto e sem conversão neste período.</p>}
        {estado.termos?.length > 0 && (
          <>
            <ul className="divide-y divide-border">
              {estado.termos.map(t => (
                <li key={chave(t)}>
                  <label className="py-2.5 flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={marcados.has(chave(t))} onChange={() => alternar(t)} className="w-4 h-4 accent-[#5bc424] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text">{t.termo}</p>
                      <p className="text-xs text-muted truncate">{t.campanha} · {t.cliques} {t.cliques === 1 ? 'clique' : 'cliques'}</p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums whitespace-nowrap">{brl(t.custo)}</p>
                  </label>
                </li>
              ))}
            </ul>
            <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-border flex flex-wrap items-center gap-2">
              <label className="text-xs text-muted" htmlFor="tipo-neg">Negativar como</label>
              <select id="tipo-neg" value={tipo} onChange={e => { setTipo(e.target.value); setConfirmando(false) }} className={campo}>
                <option value="EXACT">Exata: bloqueia só essa busca (recomendado)</option>
                <option value="PHRASE">Frase: bloqueia buscas que contêm o termo</option>
              </select>
              <button onClick={() => setConfirmando(true)} disabled={!selecionados.length || confirmando} className={botaoPrincipal}>
                Negativar {selecionados.length || ''} {selecionados.length === 1 ? 'termo' : 'termos'}
              </button>
            </div>
            {confirmando && (
              <Confirmacao
                texto={`Negativar ${selecionados.length} ${selecionados.length === 1 ? 'termo' : 'termos'} como ${tipo === 'EXACT' ? 'exata' : 'frase'} em ${nCampanhas} ${nCampanhas === 1 ? 'campanha' : 'campanhas'}? Os anúncios deixam de aparecer para essas buscas.`}
                aviso={tipo === 'PHRASE' ? 'Em frase, qualquer busca que contenha o termo também é bloqueada. Confira se nenhum termo é amplo demais.' : null}
                rotulo="Negativar" onConfirmar={negativar} onCancelar={() => setConfirmando(false)} />
            )}
          </>
        )}
      </div>
    </Bloco>
  )
}

function Historico({ historico }) {
  if (!historico) return null
  return (
    <Bloco titulo="Alterações feitas pelo hub" descricao="O que foi mudado nesta conta por aqui, da mais recente para a mais antiga.">
      <div className="py-3">
        {!historico.disponivel && (
          <p className="text-sm text-text-2">O registro de alterações ainda não foi ativado. Rode o arquivo <code className="text-xs px-1 py-0.5 rounded bg-surface-2">supabase/create-trafego-alteracoes.sql</code> no Supabase uma vez.</p>
        )}
        {historico.disponivel && historico.itens.length === 0 && <p className="text-sm text-muted">Nenhuma alteração feita pelo hub nesta conta ainda.</p>}
        {historico.itens.length > 0 && (
          <ul className="divide-y divide-border">
            {historico.itens.map((h, i) => (
              <li key={i} className="py-2.5">
                <p className="text-sm text-text">{h.resumo}{h.campanha_nome && <span className="text-text-2"> · {h.campanha_nome}</span>}</p>
                <p className="text-xs text-muted">
                  {new Date(h.criado_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · {h.usuario_email.split('@')[0]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Bloco>
  )
}

export default function DetalheConta({ conta, dias, onVoltar }) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState(null)
  const [verPausadas, setVerPausadas] = useState(false)

  const carregar = useCallback(async () => {
    try {
      setDados(await chamar({ acao: 'conta', contaId: conta.id, dias }))
      setErro('')
    } catch (e) { setErro(e.message) }
  }, [conta.id, dias])
  useEffect(() => { carregar() }, [carregar])

  // Toda alteração passa por aqui: envia, mostra o resultado e recarrega a conta.
  const executar = useCallback(async body => {
    const r = await chamar({ ...body, contaId: conta.id })
    setAviso(r.resumo + (r.registrado ? '' : '. Atenção: o registro no histórico não foi salvo.'))
    await carregar()
    return r
  }, [conta.id, carregar])

  const tarefas = conta.insights.filter(x => x.nivel !== 'positivo')
  const positivos = conta.insights.filter(x => x.nivel === 'positivo')
  const inflada = contaInflada(conta)
  const campanhas = (dados?.campanhas || []).slice().sort((x, y) => y.custo - x.custo)
  const ativas = campanhas.filter(c => c.status === 'ENABLED')
  const pausadas = campanhas.filter(c => c.status !== 'ENABLED')

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
            <Numero rotulo="Conversões" valor={num(conta.atual.conversoes)} ajuda="conversao">{inflada ? <SemComparacao /> : <Variacao atual={conta.atual.conversoes} anterior={conta.anterior.conversoes} />}</Numero>
            <Numero rotulo="Custo por conversão" valor={cpa(conta.atual) == null ? '—' : brl(cpa(conta.atual))} ajuda="custoConv">{inflada ? <SemComparacao /> : <Variacao atual={cpa(conta.atual)} anterior={cpa(conta.anterior)} bomQuandoSobe={false} />}</Numero>
          </div>
        )}
        {positivos.map((x, i) => (
          <p key={i} className="mt-3 text-sm flex items-center gap-2" style={{ color: NIVEIS.positivo.cor }}>
            <CircleCheck size={15} />{x.titulo}: {x.resumo.charAt(0).toLowerCase() + x.resumo.slice(1)}
          </p>
        ))}
      </section>

      {aviso && (
        <div role="status" className="sticky top-2 z-10 flex items-start gap-3 p-3.5 rounded-xl bg-white card-shadow-md">
          <CircleCheck size={17} className="flex-shrink-0 mt-0.5" style={{ color: NIVEIS.positivo.cor }} />
          <p className="flex-1 text-sm text-text">{aviso}</p>
          <button onClick={() => setAviso(null)} aria-label="Fechar aviso" className="text-muted hover:text-text"><X size={15} /></button>
        </div>
      )}

      <Bloco titulo="O que fazer nesta conta" descricao={tarefas.length ? 'Comece pelo primeiro item.' : undefined}>
        {tarefas.length === 0
          ? <p className="py-5 flex items-center gap-2 text-sm text-text-2"><CircleCheck size={16} className="text-accent-hover" />Nenhum problema encontrado nesta conta.</p>
          : <ul className="divide-y divide-border">{tarefas.map((x, i) => <Tarefa key={i} item={x} comecaAberta={i === 0} />)}</ul>}
      </Bloco>

      <Bloco titulo="Campanhas ativas" descricao={dados ? `${ativas.length} ${ativas.length === 1 ? 'campanha' : 'campanhas'}, da que mais investiu para a que menos investiu.` : undefined}>
        {erro && <p className="py-4 text-sm" style={{ color: VERMELHO }}>Não foi possível carregar as campanhas: {erro}</p>}
        {!dados && !erro && <p className="py-4 text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Carregando campanhas…</p>}
        {dados && ativas.length === 0 && <p className="py-4 text-sm text-muted">Nenhuma campanha ativa nesta conta.</p>}
        {ativas.length > 0 && <ul className="divide-y divide-border">{ativas.map(c => <CampanhaItem key={c.id} campanha={c} contaId={conta.id} dias={dias} executar={executar} />)}</ul>}
        {pausadas.length > 0 && (
          <div className="border-t border-border">
            <button onClick={() => setVerPausadas(v => !v)} aria-expanded={verPausadas} className="py-3 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-text">
              {verPausadas ? <ChevronDown size={14} /> : <ChevronRight size={14} />}{pausadas.length} {pausadas.length === 1 ? 'campanha pausada' : 'campanhas pausadas'}
            </button>
            {verPausadas && <ul className="divide-y divide-border border-t border-border">{pausadas.map(c => <CampanhaItem key={c.id} campanha={c} contaId={conta.id} dias={dias} executar={executar} />)}</ul>}
          </div>
        )}
      </Bloco>

      {!conta.erro && <Termos contaId={conta.id} dias={dias} executar={executar} />}
      <Historico historico={dados?.historico} />
    </div>
  )
}
