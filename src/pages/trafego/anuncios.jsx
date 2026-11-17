import { useState, useEffect } from 'react'
import { ExternalLink, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { NIVEIS, brl, num } from './regras'
import { chamar, linkGoogleAds } from './componentes'
import { Interruptor, botaoNeutro, botaoPrincipal, campo } from './acoes'

const VERMELHO = NIVEIS.critico.cor
const CINZA = { cor: '#7680a8', fundo: '#eceef8' }
const LIMITES = { titulo: { max: 30, min: 3, maximo: 15 }, descricao: { max: 90, min: 2, maximo: 4 } }
const POSICOES = {
  titulo: [['', 'Qualquer posição'], ['HEADLINE_1', 'Sempre na posição 1'], ['HEADLINE_2', 'Sempre na posição 2'], ['HEADLINE_3', 'Sempre na posição 3']],
  descricao: [['', 'Qualquer posição'], ['DESCRIPTION_1', 'Sempre na posição 1'], ['DESCRIPTION_2', 'Sempre na posição 2']],
}
const COR_DESEMPENHO = { Melhor: NIVEIS.positivo, Bom: NIVEIS.positivo, Baixo: NIVEIS.critico, Aprendendo: CINZA }
const COR_FORCA = { Ruim: NIVEIS.critico, 'Média': NIVEIS.atencao, Boa: NIVEIS.positivo, Excelente: NIVEIS.positivo }
const pct = v => (v == null ? '—' : `${Math.round(v * 100)}%`)

function Etiqueta({ nivel, children }) {
  const n = nivel || CINZA
  return <span className="inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color: n.cor, background: n.fundo }}>{children}</span>
}

function problemas(f) {
  const lista = []
  for (const [tipo, nome] of [['titulo', 'títulos'], ['descricao', 'descrições']]) {
    const itens = (tipo === 'titulo' ? f.titulos : f.descricoes).map(x => x.texto.trim()).filter(Boolean)
    const l = LIMITES[tipo]
    if (itens.length < l.min) lista.push(`Faltam ${l.min - itens.length} ${nome} (mínimo ${l.min})`)
    if (itens.some(t => t.length > l.max)) lista.push(`Há ${nome} com mais de ${l.max} caracteres`)
    const vistos = new Set()
    const repetido = itens.find(t => { const k = t.toLowerCase(); if (vistos.has(k)) return true; vistos.add(k); return false })
    if (repetido) lista.push(`Texto repetido: "${repetido}"`)
  }
  if (!/^https?:\/\/\S+\.\S+/i.test(f.url.trim())) lista.push('Informe a URL de destino começando com https://')
  for (const c of [f.caminho1, f.caminho2]) {
    if (c.length > 15) lista.push(`O caminho "${c}" passa de 15 caracteres`)
    if (/[\s/]/.test(c)) lista.push('O caminho não pode ter espaço nem barra')
  }
  if (f.caminho2 && !f.caminho1) lista.push('Preencha o caminho 1 antes do caminho 2')
  return lista
}

function CampoTexto({ item, limite, posicoes, onMudar, onRemover, podeRemover, rotulo }) {
  const n = item.texto.length
  const longo = limite === 90
  const Tag = longo ? 'textarea' : 'input'
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Tag value={item.texto} onChange={e => onMudar({ ...item, texto: e.target.value })} aria-label={rotulo} rows={longo ? 2 : undefined}
            className={`${campo} w-full pr-14 ${longo ? 'resize-none' : ''}`} style={n > limite ? { borderColor: VERMELHO } : undefined} />
          <span className="absolute right-2.5 top-2 text-[11px] tabular-nums" style={{ color: n > limite ? VERMELHO : '#7680a8' }}>{n}/{limite}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <select value={item.fixo || ''} onChange={e => onMudar({ ...item, fixo: e.target.value || null })} aria-label={`Posição de ${rotulo}`}
            className="text-[11px] text-text-2 bg-transparent outline-none cursor-pointer hover:text-text">
            {posicoes.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
          {item.desempenho && <Etiqueta nivel={COR_DESEMPENHO[item.desempenho]}>{item.desempenho}</Etiqueta>}
          {item.numeros && (
            <span className="text-[11px] text-muted tabular-nums">
              {num(item.numeros.impressoes)} exibições · {num(item.numeros.cliques)} cliques · {num(item.numeros.conversoes)} conv.
            </span>
          )}
        </div>
      </div>
      <button type="button" onClick={onRemover} disabled={!podeRemover} aria-label={`Remover ${rotulo}`} title="Remover"
        className="mt-1.5 p-1 rounded text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={14} /></button>
    </div>
  )
}

function Previa({ f }) {
  const titulos = f.titulos.map(x => x.texto.trim()).filter(Boolean)
  const descricoes = f.descricoes.map(x => x.texto.trim()).filter(Boolean)
  let dominio = ''
  try { dominio = new URL(f.url.trim()).hostname.replace(/^www\./, '') } catch { dominio = 'seusite.com.br' }
  const exibida = [dominio, f.caminho1, f.caminho2].filter(Boolean).join(' › ')
  const pos = (lista, n) => lista.find(x => x.fixo?.endsWith(`_${n}`))?.texto.trim()
  const t = [1, 2, 3].map(n => pos(f.titulos, n)).map((v, i) => v || titulos.filter(x => !f.titulos.some(y => y.fixo && y.texto.trim() === x))[i]).filter(Boolean)
  return (
    <div className="p-4 rounded-xl bg-surface-2/60">
      <p className="text-[11px] font-semibold text-muted mb-2">Como pode aparecer no Google</p>
      <p className="text-xs text-text-2"><span className="font-bold text-text">Patrocinado</span> · {exibida}</p>
      <p className="text-lg leading-snug mt-0.5" style={{ color: '#1a0dab' }}>{t.join(' | ') || 'Seu título aparece aqui'}</p>
      <p className="text-sm text-text-2 mt-0.5">{descricoes.slice(0, 2).join(' ') || 'Sua descrição aparece aqui.'}</p>
      <p className="text-[11px] text-muted mt-2">O Google combina os textos sozinho; esta é só uma das combinações possíveis.</p>
    </div>
  )
}

function Editor({ contaId, anuncio, grupos, executar, onFechar }) {
  const novo = !anuncio
  const linha = x => ({ texto: x?.texto || '', fixo: x?.fixo || null, desempenho: x?.desempenho || null, numeros: x?.numeros || null })
  const [f, setF] = useState(() => ({
    titulos: anuncio ? anuncio.titulos.map(linha) : Array.from({ length: 5 }, () => linha()),
    descricoes: anuncio ? anuncio.descricoes.map(linha) : Array.from({ length: 2 }, () => linha()),
    url: anuncio?.destino || '', caminho1: anuncio?.caminho1 || '', caminho2: anuncio?.caminho2 || '',
  }))
  const [grupoId, setGrupoId] = useState(anuncio?.grupoId || (grupos.length === 1 ? grupos[0].id : ''))
  const [salvando, setSalvando] = useState(false)
  const [urlRuim, setUrlRuim] = useState(null)
  const [erro, setErro] = useState('')
  const lista = problemas(f)

  const mudar = (tipo, i, v) => setF(x => ({ ...x, [tipo]: x[tipo].map((y, j) => (j === i ? v : y)) }))
  const remover = (tipo, i) => setF(x => ({ ...x, [tipo]: x[tipo].filter((_, j) => j !== i) }))
  const adicionar = tipo => setF(x => ({ ...x, [tipo]: [...x[tipo], linha()] }))
  const corpo = v => ({
    titulos: v.titulos.filter(x => x.texto.trim()).map(({ texto, fixo }) => ({ texto: texto.trim(), fixo })),
    descricoes: v.descricoes.filter(x => x.texto.trim()).map(({ texto, fixo }) => ({ texto: texto.trim(), fixo })),
    url: v.url.trim(), caminho1: v.caminho1.trim(), caminho2: v.caminho2.trim(),
  })

  async function salvar(semTestar) {
    setErro('')
    setSalvando(true)
    try {
      if (!semTestar) {
        const t = await chamar({ acao: 'testar_url', contaId, url: f.url.trim() })
        if (!t.ok) { setUrlRuim(t.motivo || 'A página não respondeu'); return }
      }
      if (novo) {
        await executar({ acao: 'anuncio_criar', grupoId, ...corpo(f) })
      } else {
        const antes = { titulos: anuncio.titulos, descricoes: anuncio.descricoes, url: anuncio.destino || '', caminho1: anuncio.caminho1, caminho2: anuncio.caminho2 }
        await executar({ acao: 'anuncio_editar', anuncioId: anuncio.id, ...corpo(f) }, { acao: 'anuncio_editar', anuncioId: anuncio.id, ...corpo(antes) })
      }
      onFechar()
    } catch (e) { setErro(e.message) } finally { setSalvando(false) }
  }

  const bloco = (tipo, nome, rotulo) => {
    const itens = f[tipo === 'titulo' ? 'titulos' : 'descricoes']
    const chave = tipo === 'titulo' ? 'titulos' : 'descricoes'
    const l = LIMITES[tipo]
    return (
      <fieldset className="space-y-2.5">
        <legend className="text-sm font-semibold text-text mb-2">{nome} <span className="text-xs font-normal text-muted">{itens.filter(x => x.texto.trim()).length} de {l.maximo} · até {l.max} caracteres</span></legend>
        {itens.map((x, i) => (
          <CampoTexto key={i} item={x} limite={l.max} posicoes={POSICOES[tipo]} rotulo={`${rotulo} ${i + 1}`}
            onMudar={v => mudar(chave, i, v)} onRemover={() => remover(chave, i)} podeRemover={itens.length > l.min} />
        ))}
        {itens.length < l.maximo && (
          <button type="button" onClick={() => adicionar(chave)} className="inline-flex items-center gap-1 text-xs font-semibold text-text-2 hover:text-text">
            <Plus size={13} />Adicionar {rotulo.toLowerCase()}
          </button>
        )}
      </fieldset>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-white space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-text">{novo ? 'Novo anúncio' : 'Editar anúncio'}</p>
          {!novo && <p className="text-xs text-muted">{anuncio.campanha} › {anuncio.grupo}</p>}
        </div>
        <button onClick={onFechar} aria-label="Fechar editor" className="text-muted hover:text-text"><X size={16} /></button>
      </div>

      {novo && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-semibold text-text" htmlFor="grupo-anuncio">Grupo de anúncios</label>
          <select id="grupo-anuncio" value={grupoId} onChange={e => setGrupoId(e.target.value)} className={`${campo} max-w-full`}>
            <option value="">Escolha o grupo</option>
            {grupos.map(g => <option key={g.id} value={g.id}>{g.campanha} › {g.nome}{g.status !== 'ENABLED' ? ' (pausado)' : ''}</option>)}
          </select>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_20rem] gap-6">
        <div className="space-y-6">
          {bloco('titulo', 'Títulos', 'Título')}
          {bloco('descricao', 'Descrições', 'Descrição')}
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-text mb-2">Página de destino</legend>
            <input value={f.url} onChange={e => { setF(x => ({ ...x, url: e.target.value })); setUrlRuim(null) }} placeholder="https://"
              aria-label="URL de destino" className={`${campo} w-full`} />
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <span>Caminho exibido:</span>
              {['caminho1', 'caminho2'].map((k, i) => (
                <span key={k} className="inline-flex items-center gap-1.5">/
                  <input value={f[k]} onChange={e => setF(x => ({ ...x, [k]: e.target.value }))} aria-label={`Caminho ${i + 1}`} placeholder={i ? 'opcional' : 'ex: advogado'}
                    className={`${campo} w-32 !py-1 !text-xs`} style={f[k].length > 15 ? { borderColor: VERMELHO } : undefined} />
                  <span className="tabular-nums">{f[k].length}/15</span>
                </span>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="space-y-3 lg:sticky lg:top-4 self-start">
          <Previa f={f} />
          {!novo && anuncio.titulos.concat(anuncio.descricoes).some(x => x.numeros) && (
            <p className="text-xs text-muted">Os números de cada texto são do período escolhido. <b className="text-text-2">Melhor</b> é o que mais converteu entre os do mesmo tipo; <b className="text-text-2">Baixo</b> é o que o Google quase não mostra. Troque primeiro os de desempenho baixo.</p>
          )}
        </div>
      </div>

      {lista.length > 0 && <ul className="text-xs space-y-0.5" style={{ color: NIVEIS.atencao.cor }}>{lista.map(p => <li key={p}>{p}</li>)}</ul>}
      {urlRuim && (
        <div className="p-3 rounded-xl text-sm" style={{ background: NIVEIS.atencao.fundo, color: NIVEIS.atencao.cor }}>
          <p><b>A página de destino não abriu:</b> {urlRuim}. Um anúncio com página fora do ar costuma ser reprovado.</p>
          <button onClick={() => salvar(true)} disabled={salvando} className={`${botaoNeutro} mt-2`}>Salvar mesmo assim</button>
        </div>
      )}
      {erro && <p className="text-sm" style={{ color: VERMELHO }}>{erro}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => salvar(false)} disabled={salvando || lista.length > 0 || (novo && !grupoId)} className={`${botaoPrincipal} !text-sm !px-4 !py-2`}>
          {salvando && <Loader2 size={14} className="animate-spin" />}{novo ? 'Criar anúncio' : 'Salvar alterações'}
        </button>
        <span className="text-xs text-muted">{novo ? 'O anúncio entra ativo e passa pela análise do Google.' : 'Ao salvar, o anúncio volta para a análise do Google e o aprendizado recomeça.'}</span>
      </div>
    </div>
  )
}

export function AbaAnuncios({ d, conta, campanhaId, executar }) {
  const [editando, setEditando] = useState(null)
  const lista = d.anuncios.filter(a => !campanhaId || a.campanhaId === campanhaId)
  const grupos = (d.grupos || []).filter(g => !campanhaId || g.campanhaId === campanhaId)
  const status = (a, s) => ({ acao: 'anuncio_status', anuncioId: a.id, status: s })
  const ativosPorGrupo = lista.reduce((m, a) => (a.status === 'ENABLED' ? m.set(a.grupoId, (m.get(a.grupoId) || 0) + 1) : m), new Map())

  return (
    <div className="space-y-4">
      {editando === 'novo'
        ? <Editor contaId={conta.id} grupos={grupos} executar={executar} onFechar={() => setEditando(null)} />
        : grupos.length > 0 && (
          <button onClick={() => setEditando('novo')} className={botaoNeutro}><Plus size={13} />Novo anúncio</button>
        )}

      {!lista.length && <p className="text-sm text-muted">Nenhum anúncio de texto aqui. Campanhas Performance Max e Smart têm os anúncios montados pelo Google.</p>}
      <ul className="divide-y divide-border">
        {lista.map(a => {
          const ativo = a.status === 'ENABLED'
          if (editando === a.id) return <li key={a.id} className="py-3"><Editor contaId={conta.id} anuncio={a} grupos={grupos} executar={executar} onFechar={() => setEditando(null)} /></li>
          const baixos = a.titulos.concat(a.descricoes).filter(x => x.desempenho === 'Baixo').length
          const ctr = a.impressoes ? `${(a.cliques / a.impressoes * 100).toFixed(1)}%` : '—'
          return (
            <li key={a.id} className="py-3.5 flex items-start gap-3">
              <div className="pt-0.5">
                <Interruptor ativo={ativo} rotulo={`${ativo ? 'Pausar' : 'Ativar'} anúncio`}
                  onAlternar={() => executar(status(a, ativo ? 'PAUSED' : 'ENABLED'), status(a, ativo ? 'ENABLED' : 'PAUSED'))} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${ativo ? 'text-text' : 'text-muted'}`}>{a.titulos.slice(0, 3).map(x => x.texto).join(' | ') || 'Anúncio sem títulos'}</p>
                <p className="text-xs text-text-2 mt-0.5 line-clamp-1">{a.descricoes[0]?.texto}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{campanhaId ? a.grupo : `${a.campanha} › ${a.grupo}`}{a.destino && ` · ${a.destino}`}</p>
                <div className="mt-1.5 flex flex-wrap gap-1 empty:hidden">
                  {a.forca && <Etiqueta nivel={COR_FORCA[a.forca]}>Força: {a.forca}</Etiqueta>}
                  {a.reprovado && <Etiqueta nivel={NIVEIS.critico}>Reprovado</Etiqueta>}
                  {a.limitado && <Etiqueta nivel={NIVEIS.atencao}>Aprovado com restrição</Etiqueta>}
                  {baixos > 0 && <Etiqueta nivel={NIVEIS.atencao}>{baixos} {baixos === 1 ? 'texto' : 'textos'} com desempenho baixo</Etiqueta>}
                  {ativo && ativosPorGrupo.get(a.grupoId) === 1 && <Etiqueta>Único ativo do grupo</Etiqueta>}
                </div>
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-4 text-right text-sm tabular-nums whitespace-nowrap">
                <div><p className="text-[11px] text-muted">Investido</p>{brl(a.custo)}</div>
                <div><p className="text-[11px] text-muted">Conv.</p>{num(a.conversoes)}</div>
                <div><p className="text-[11px] text-muted">CTR</p>{ctr}</div>
              </div>
              {a.editavel
                ? <button onClick={() => setEditando(a.id)} className={botaoNeutro} aria-label="Editar anúncio"><Pencil size={13} />Editar</button>
                : <a href={linkGoogleAds(conta.id, a.campanhaId)} target="_blank" rel="noreferrer" title="Este tipo de anúncio só pode ser editado no Google Ads"
                    className={botaoNeutro}>Google Ads<ExternalLink size={12} /></a>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Concorrentes({ contaId, periodo, campanhaId, campanhas }) {
  const [estado, setEstado] = useState({ carregando: false, dados: null, erro: '' })
  const pesquisa = campanhas.filter(c => c.pesquisa)

  useEffect(() => {
    if (!campanhaId) return
    let valido = true
    setEstado({ carregando: true, dados: null, erro: '' })
    chamar({ acao: 'concorrentes', contaId, periodo, campanhaId })
      .then(dados => valido && setEstado({ carregando: false, dados, erro: '' }))
      .catch(e => valido && setEstado({ carregando: false, dados: null, erro: e.message }))
    return () => { valido = false }
  }, [contaId, periodo, campanhaId])

  if (!campanhaId) {
    return <p className="text-sm text-muted">Escolha uma campanha de pesquisa no filtro acima para ver quem disputa os mesmos leilões.{pesquisa.length === 0 && ' Esta conta não tem campanha de pesquisa.'}</p>
  }
  if (estado.carregando) return <p className="text-sm text-muted flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Buscando o relatório de leilões do período…</p>
  if (estado.erro) return <p className="text-sm" style={{ color: VERMELHO }}>Não foi possível buscar: {estado.erro}</p>
  const { voce, concorrentes, disponivel } = estado.dados || {}

  return (
    <div className="space-y-5">
      {voce && (
        <div>
          <p className="text-sm font-semibold text-text">Sua campanha no período</p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[['Aparece em', voce.parcela, 'das buscas em que poderia aparecer'], ['No topo', voce.topo, 'das vezes acima dos resultados'],
              ['Perde por verba', voce.perdaOrcamento, 'das buscas: orçamento acabou'], ['Perde por classificação', voce.perdaClassificacao, 'das buscas: lance ou qualidade baixos']].map(([r, v, a]) => (
              <div key={r}>
                <p className="text-[11px] text-muted">{r}</p>
                <p className="text-xl font-extrabold tabular-nums" style={r.startsWith('Perde') && v > 0.2 ? { color: NIVEIS.atencao.cor } : undefined}>{pct(v)}</p>
                <p className="text-[11px] text-muted">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-sm font-semibold text-text">Quem disputa os mesmos leilões</p>
        {!disponivel
          ? (
            <p className="text-sm text-muted mt-1">O Google não liberou o relatório de leilões para a conexão do hub. Veja em Google Ads › Insights e relatórios › Leilões.{' '}
              <a href={linkGoogleAds(contaId, campanhaId)} target="_blank" rel="noreferrer" className="font-semibold text-text-2 hover:text-text underline underline-offset-2">Abrir a campanha</a>
            </p>
          )
          : concorrentes.length === 0
            ? <p className="text-sm text-muted mt-1">Sem concorrentes registrados no período (pouco volume de leilões).</p>
            : (
              <div className="overflow-x-auto -mx-5 mt-2">
                <table className="w-full min-w-[36rem] [&_tr>*:first-child]:pl-5 [&_tr>*:last-child]:pr-5">
                  <thead className="border-b border-border">
                    <tr className="text-[11px] font-semibold text-muted">
                      <th className="py-2 px-3 text-left">Site</th>
                      <th className="py-2 px-3 text-right" title="Em quantas buscas elegíveis o concorrente apareceu">Aparece em</th>
                      <th className="py-2 px-3 text-right" title="Das suas buscas, em quantas ele também apareceu">Disputa com você</th>
                      <th className="py-2 px-3 text-right" title="Quando os dois aparecem, quantas vezes ele fica acima">Fica acima de você</th>
                      <th className="py-2 px-3 text-right" title="Quantas vezes você fica acima dele ou ele nem aparece">Você na frente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm tabular-nums">
                    {concorrentes.map(c => (
                      <tr key={c.dominio}>
                        <td className="py-2.5 px-3 font-semibold text-text">{c.dominio === 'You' ? 'Você' : c.dominio}</td>
                        <td className="py-2.5 px-3 text-right">{pct(c.parcela)}</td>
                        <td className="py-2.5 px-3 text-right">{pct(c.sobreposicao)}</td>
                        <td className="py-2.5 px-3 text-right" style={c.acimaDeVoce > 0.5 ? { color: NIVEIS.atencao.cor } : undefined}>{pct(c.acimaDeVoce)}</td>
                        <td className="py-2.5 px-3 text-right">{pct(c.voceNaFrente)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </div>
  )
}
