import { useState, useEffect, useCallback } from 'react'
import { Check, Loader2, Search, X, Pencil } from 'lucide-react'
import { NIVEIS, brl, num } from './regras'
import { chamar } from './componentes'

export const CORRESPONDENCIA = { EXACT: 'Exata', PHRASE: 'Frase', BROAD: 'Ampla' }
const VERMELHO = NIVEIS.critico.cor

export const botao = 'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
export const botaoNeutro = `${botao} bg-surface-2 text-text hover:bg-border`
export const botaoPrincipal = `${botao} bg-accent text-text hover:bg-accent-hover`
export const botaoPerigo = `${botao} text-white hover:opacity-90`
export const campo = 'text-sm px-3 py-1.5 rounded-lg bg-white border border-border outline-none focus:border-text-2 focus:ring-2 focus:ring-accent/30'

// Confirmação no próprio lugar da ação, usada só no que é difícil de desfazer.
export function Confirmacao({ texto, aviso, rotulo = 'Confirmar', perigo, onConfirmar, onCancelar }) {
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

// Liga e pausa na hora; o aviso com "Desfazer" substitui a confirmação.
export function Interruptor({ ativo, rotulo, onAlternar }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  async function alternar() {
    setEnviando(true)
    setErro('')
    try {
      await onAlternar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <button type="button" role="switch" aria-checked={ativo} aria-label={rotulo} title={ativo ? 'Ativa: clique para pausar' : 'Pausada: clique para ativar'}
        onClick={alternar} disabled={enviando}
        className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${ativo ? 'bg-accent-hover' : 'bg-border'}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${ativo ? 'translate-x-4' : ''}`} />
      </button>
      {enviando && <Loader2 size={13} className="animate-spin text-muted" />}
      {erro && <span className="text-[11px] max-w-[10rem] truncate" style={{ color: VERMELHO }} title={erro}>{erro}</span>}
    </span>
  )
}

// Valor em reais editável na própria linha: clica, digita, Enter salva, Esc cancela.
export function ValorEditavel({ valor, min, max, rotulo, sufixo = '', aviso, onSalvar }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  if (!editando) {
    return (
      <button type="button" aria-label={`Editar ${rotulo}`}
        onClick={() => { setTexto(valor ? valor.toFixed(2).replace('.', ',') : ''); setErro(''); setEditando(true) }}
        className="group inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-text rounded px-1 -mx-1 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
        {valor > 0 ? brl(valor) : <span className="text-text-2 font-normal">Definir</span>}
        {valor > 0 && sufixo && <span className="text-muted font-normal">{sufixo}</span>}
        <Pencil size={11} className="text-muted opacity-40 group-hover:opacity-100" />
      </button>
    )
  }

  const novo = Number(texto.replace(',', '.'))
  const valido = texto !== '' && Number.isFinite(novo) && novo >= min && novo <= max
  const mudanca = valor ? (novo - valor) / valor : 0
  const alerta = valido ? aviso?.(novo, mudanca) : null

  async function salvar(e) {
    e.preventDefault()
    if (!valido) return
    if (Math.abs(novo - (valor || 0)) < 0.01) { setEditando(false); return }
    setEnviando(true)
    setErro('')
    try {
      await onSalvar(novo)
      setEditando(false)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={salvar} className="inline-flex flex-col gap-1 items-start">
      <span className="inline-flex items-center gap-1">
        <span className="text-xs text-muted">R$</span>
        <input autoFocus inputMode="decimal" value={texto} aria-label={rotulo} disabled={enviando}
          onChange={e => setTexto(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setEditando(false) }}
          className={`${campo} w-20 !px-2 !py-1 tabular-nums`} />
        <button type="submit" disabled={!valido || enviando} aria-label="Salvar" className={`${botaoPrincipal} !px-2`}>
          {enviando ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        </button>
        <button type="button" onClick={() => setEditando(false)} disabled={enviando} aria-label="Cancelar" className={`${botaoNeutro} !px-2`}><X size={12} /></button>
      </span>
      {texto !== '' && !valido && <span className="text-[11px] text-muted">Entre {brl(min)} e {brl(max)}</span>}
      {alerta && <span className="text-[11px] max-w-[14rem]" style={{ color: NIVEIS.atencao.cor }}>{alerta}</span>}
      {erro && <span className="text-[11px] max-w-[14rem]" style={{ color: VERMELHO }}>{erro}</span>}
    </form>
  )
}

export function AdicionarPalavras({ grupo, executar }) {
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState('PHRASE')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const lista = [...new Set(texto.split('\n').map(t => t.trim().toLowerCase()).filter(Boolean))]

  async function adicionar() {
    setEnviando(true)
    setErro('')
    try {
      await executar({ acao: 'palavras_adicionar', grupoId: grupo.id, palavras: lista, correspondencia: tipo })
      setTexto('')
    } catch (e) { setErro(e.message) } finally { setEnviando(false) }
  }

  return (
    <div className="mt-2 space-y-2">
      <label className="block text-xs text-muted" htmlFor={`kw-${grupo.id}`}>Uma palavra-chave por linha</label>
      <textarea id={`kw-${grupo.id}`} value={texto} onChange={e => setTexto(e.target.value)} rows={3}
        className={`${campo} w-full`} placeholder={'advogado de família\ndivórcio consensual'} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted" htmlFor={`tipo-${grupo.id}`}>Correspondência</label>
        <select id={`tipo-${grupo.id}`} value={tipo} onChange={e => setTipo(e.target.value)} className={campo}>
          <option value="PHRASE">Frase</option>
          <option value="EXACT">Exata</option>
          <option value="BROAD">Ampla</option>
        </select>
        <button onClick={adicionar} disabled={!lista.length || lista.length > 50 || enviando} className={botaoPrincipal}>
          {enviando && <Loader2 size={12} className="animate-spin" />}Adicionar {lista.length || ''}
        </button>
      </div>
      {lista.length > 50 && <p className="text-xs" style={{ color: VERMELHO }}>No máximo 50 palavras-chave por vez.</p>}
      {tipo === 'BROAD' && lista.length > 0 && <p className="text-xs" style={{ color: NIVEIS.atencao.cor }}>A ampla mostra o anúncio para muitas buscas parecidas. Acompanhe os termos nos próximos dias.</p>}
      {erro && <p className="text-xs" style={{ color: VERMELHO }}>{erro}</p>}
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

export function PainelRegioes({ contaId, campanha, executarBase }) {
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

export function Termos({ contaId, dias, campanhaId, executar }) {
  const [estado, setEstado] = useState({ carregando: true, termos: null, erro: '' })
  const [marcados, setMarcados] = useState(new Set())
  const [tipo, setTipo] = useState('EXACT')
  const [confirmando, setConfirmando] = useState(false)

  const carregar = useCallback(async () => {
    setEstado({ carregando: true, termos: null, erro: '' })
    setMarcados(new Set())
    try {
      const d = await chamar({ acao: 'termos', contaId, dias })
      setEstado({ carregando: false, termos: d.termos, erro: '' })
    } catch (e) {
      setEstado({ carregando: false, termos: null, erro: e.message })
    }
  }, [contaId, dias])
  useEffect(() => { carregar() }, [carregar])

  const chave = t => `${t.campanha_id}|${t.termo}`
  const visiveis = (estado.termos || []).filter(t => !campanhaId || String(t.campanha_id) === campanhaId)
  const alternar = t => setMarcados(m => { const n = new Set(m); n.has(chave(t)) ? n.delete(chave(t)) : n.add(chave(t)); return n })
  const todosMarcados = visiveis.length > 0 && visiveis.every(t => marcados.has(chave(t)))
  const alternarTodos = () => setMarcados(todosMarcados ? new Set() : new Set(visiveis.map(chave)))
  const selecionados = visiveis.filter(t => marcados.has(chave(t)))
  const porCampanha = selecionados.reduce((acc, t) => ((acc[t.campanha_id] ||= { nome: t.campanha, termos: [] }).termos.push(t.termo), acc), {})
  const nCampanhas = Object.keys(porCampanha).length

  async function negativar() {
    for (const [id, g] of Object.entries(porCampanha)) {
      await executar({ acao: 'negativar', campanhaId: id, termos: g.termos, correspondencia: tipo })
    }
    setEstado(e => ({ ...e, termos: e.termos.filter(t => !marcados.has(chave(t))) }))
    setMarcados(new Set())
    setConfirmando(false)
  }

  if (estado.carregando) return <p className="text-sm text-muted flex items-center gap-2 py-2"><Loader2 size={14} className="animate-spin" />Buscando termos de pesquisa…</p>
  if (estado.erro) {
    return (
      <div className="py-2">
        <p className="text-sm" style={{ color: VERMELHO }}>Não foi possível buscar os termos: {estado.erro}</p>
        <button onClick={carregar} className={`${botaoNeutro} mt-2`}>Tentar de novo</button>
      </div>
    )
  }
  return (
    <div>
      <p className="text-sm text-muted">Buscas que geraram clique e não viraram conversão no período. Marque e negative.</p>
      {visiveis.length === 0
        ? <p className="text-sm text-text-2 mt-3">Nenhuma busca com gasto e sem conversão neste período.</p>
        : (
          <>
            <label className="mt-3 py-2 flex items-center gap-3 border-b border-border text-xs font-semibold text-text-2 cursor-pointer">
              <input type="checkbox" checked={todosMarcados} onChange={alternarTodos} className="w-4 h-4 accent-[#5bc424]" />
              Marcar todos ({visiveis.length})
            </label>
            <ul className="divide-y divide-border">
              {visiveis.map(t => (
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
                <option value="EXACT">Exata: só essa busca</option>
                <option value="PHRASE">Frase: buscas que contêm o termo</option>
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
  )
}

export function Historico({ historico }) {
  if (!historico) return null
  if (!historico.disponivel) {
    return <p className="text-sm text-text-2">O registro de alterações ainda não foi ativado. Rode o arquivo <code className="text-xs px-1 py-0.5 rounded bg-surface-2">supabase/create-trafego-alteracoes.sql</code> no Supabase uma vez.</p>
  }
  if (!historico.itens.length) return <p className="text-sm text-muted">Nenhuma alteração feita pelo hub nesta conta ainda.</p>
  return (
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
  )
}
