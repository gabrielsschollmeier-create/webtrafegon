import { useState, useRef, useEffect } from 'react'
import { Sparkles, Check, AlertTriangle, ImagePlus, X, Loader2, RefreshCw, Trash2, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { comporArte, FORMATOS_ARTE } from '../lib/compor-arte'

const MAX_REFS  = 6
const MAX_BYTES = 10 * 1024 * 1024

async function sessaoAtual() {
  if (!supabase) throw new Error('Supabase indisponível')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('sua sessão expirou. Saia e entre de novo no hub.')
  return session
}

async function subir(blobOuFile, pasta, ext) {
  await sessaoAtual()
  const path = `${pasta}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('task-images')
    .upload(path, blobOuFile, { contentType: blobOuFile.type || `image/${ext}` })
  if (error) throw error
  return supabase.storage.from('task-images').getPublicUrl(path).data.publicUrl
}

const OBJETIVOS = [
  { id: 'venda',         label: 'Venda' },
  { id: 'institucional', label: 'Institucional' },
  { id: 'engajamento',   label: 'Engajamento' },
  { id: 'remarketing',   label: 'Remarketing' },
]

const SAIDAS = [
  { id: 'post',  label: 'Post' },
  { id: 'story', label: 'Story' },
  { id: 'ambos', label: 'Post + Story' },
]

const NOMES_VERSAO = ['Produto em destaque', 'Produto em uso', 'Composição gráfica']

const inputStyle = { background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }

function Campo({ label, obrigatorio, children, dica }) {
  return (
    <div>
      <label className="block text-[11px] font-bold mb-1" style={{ color: '#4b5068' }}>
        {label}{obrigatorio && ' *'}
      </label>
      {children}
      {dica && <p className="text-[10px] mt-1" style={{ color: '#8890b5' }}>{dica}</p>}
    </div>
  )
}

function Texto({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2 text-xs border outline-none" style={inputStyle} />
  )
}

function Opcoes({ opcoes, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {opcoes.map(o => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)}
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all"
          style={value === o.id
            ? { background: '#be29ec', borderColor: '#be29ec', color: '#fff' }
            : { background: '#fff', borderColor: '#e0e3f0', color: '#4b5068' }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Miniatura({ url, nome, onRemover }) {
  return (
    <div className="relative w-16 h-16 rounded-lg overflow-hidden border" style={{ borderColor: '#e0e3f0' }}>
      <img src={url} alt={nome} className="w-full h-full object-cover" />
      <button type="button" onClick={onRemover}
        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
        <X size={10} />
      </button>
    </div>
  )
}

export default function GerarArteIA({ clientId, clientName, clientColor, taskId, onRegistrar }) {
  const [aberto,      setAberto]      = useState(false)
  const [saida,       setSaida]       = useState('ambos')
  const [objetivo,    setObjetivo]    = useState('venda')
  const [refs,        setRefs]        = useState([])
  const [foto,        setFoto]        = useState(null)
  const [enviando,    setEnviando]    = useState(false)
  const [erroUpload,  setErroUpload]  = useState('')
  const [headline,    setHeadline]    = useState('')
  const [subheadline, setSubheadline] = useState('')
  const [produto,     setProduto]     = useState('')
  const [preco,       setPreco]       = useState('')
  const [condicao,    setCondicao]    = useState('')
  const [selo,        setSelo]        = useState('')
  const [cta,         setCta]         = useState('')
  const [obs,         setObs]         = useState('')
  const [gerando,     setGerando]     = useState(false)
  const [erroGerar,   setErroGerar]   = useState('')
  const [artes,       setArtes]       = useState([])
  const refsInput = useRef(null)
  const fotoInput = useRef(null)

  // Libera as prévias só ao desmontar: limpar a cada mudança de `artes` apagaria
  // as imagens que continuam na tela depois de aprovar ou descartar uma delas.
  const artesRef = useRef(artes)
  useEffect(() => { artesRef.current = artes }, [artes])
  useEffect(() => () => artesRef.current.forEach(a => a.preview && URL.revokeObjectURL(a.preview)), [])

  async function anexar(files, destino) {
    const lista = Array.from(files || []).filter(f => f.type.startsWith('image/') && f.size <= MAX_BYTES)
    if (!lista.length) { setErroUpload('Só imagens até 10 MB.'); return }
    setErroUpload('')
    setEnviando(true)
    try {
      if (destino === 'foto') {
        const f = lista[0]
        setFoto({ nome: f.name, url: await subir(f, `referencias-arte/${clientId || 'sem-cliente'}`, (f.name.split('.').pop() || 'png').toLowerCase()) })
      } else {
        const livres = MAX_REFS - refs.length
        const novos = []
        for (const f of lista.slice(0, livres)) {
          novos.push({ nome: f.name, url: await subir(f, `referencias-arte/${clientId || 'sem-cliente'}`, (f.name.split('.').pop() || 'png').toLowerCase()) })
        }
        setRefs(prev => [...prev, ...novos])
      }
    } catch (err) {
      console.error('[gerar-arte] upload:', err)
      setErroUpload(`Não foi possível enviar a imagem: ${err?.message || 'erro desconhecido'}`)
    } finally {
      setEnviando(false)
    }
  }

  const pendencias = [
    !clientId        && 'selecione o cliente',
    refs.length < 3  && `3 referências vencedoras (tem ${refs.length})`,
    enviando         && 'aguarde o envio das imagens',
    !headline.trim() && 'headline',
    !cta.trim()      && 'CTA',
  ].filter(Boolean)

  const campos = { headline, subheadline, preco, condicao, selo, cta }

  async function gerar() {
    if (pendencias.length || gerando) return
    setGerando(true)
    setErroGerar('')
    artes.forEach(a => a.preview && URL.revokeObjectURL(a.preview))
    setArtes([])
    try {
      const session = await sessaoAtual()
      const r = await fetch('/api/artes-gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          referencias: refs.map(x => x.url),
          fotoProduto: foto?.url || null,
          produto, objetivo, obs,
        }),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok && !data.versoes) throw new Error(data.erro || `o servidor respondeu ${r.status}`)

      const formatos = saida === 'ambos' ? ['post', 'story'] : [saida]
      const prontas = []
      for (const v of data.versoes || []) {
        if (!v.ok) { prontas.push({ id: `${v.direcao}-erro`, versao: v.direcao, erro: v.erro }); continue }
        for (const formato of formatos) {
          const blob = await comporArte(v.imagem, formato, campos, clientColor || '#6eda2c')
          prontas.push({ id: `${v.direcao}-${formato}`, versao: v.direcao, formato, blob, preview: URL.createObjectURL(blob), estado: 'nova' })
        }
      }
      setArtes(prontas)
    } catch (err) {
      console.error('[gerar-arte]', err)
      setErroGerar(err?.message || 'Falha ao gerar as artes.')
    } finally {
      setGerando(false)
    }
  }

  function atualizar(id, mudanca) {
    setArtes(prev => prev.map(a => a.id === id ? { ...a, ...mudanca } : a))
  }

  async function aprovar(arte) {
    atualizar(arte.id, { estado: 'salvando' })
    try {
      const url = await subir(arte.blob, `artes-ia/${clientId || 'sem-cliente'}`, 'png')
      await onRegistrar(
        `🎨 Arte aprovada (IA) · ${NOMES_VERSAO[arte.versao]} · ${FORMATOS_ARTE[arte.formato].rotulo}\n` +
        `Headline: ${headline.trim()}${preco.trim() ? `\nPreço: ${preco.trim()}` : ''}\nCTA: ${cta.trim()}\n` +
        `Referências: ${refs.length}${foto ? ' + foto do produto' : ''}`,
        url,
      )
      atualizar(arte.id, { estado: 'aprovada' })
    } catch (err) {
      console.error('[gerar-arte] aprovar:', err)
      atualizar(arte.id, { estado: 'nova', erro: `Não foi possível salvar: ${err?.message || 'erro'}` })
    }
  }

  function baixar(arte) {
    const a = document.createElement('a')
    a.href = arte.preview
    a.download = `${clientId || 'arte'}-v${arte.versao + 1}-${arte.formato}.png`
    a.click()
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #be29ec30', background: '#be29ec05' }}>
      <button type="button" onClick={() => setAberto(a => !a)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left">
        <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: '#be29ec' }}>
          <Sparkles size={12} /> Gerar arte com IA
          <span className="normal-case tracking-normal font-bold px-1.5 py-0.5 rounded" style={{ background: '#be29ec15' }}>piloto</span>
        </span>
        <span className="text-[10px] font-bold" style={{ color: '#be29ec' }}>{aberto ? 'fechar' : 'abrir'}</span>
      </button>

      {aberto && (
        <div className="px-3.5 pb-3.5 space-y-3">
          <Campo label="3 criativos que deram certo" obrigatorio
            dica="É o padrão que as versões vão seguir: paleta, tipo de cena, enquadramento. Mínimo 3, máximo 6.">
            <div className="flex flex-wrap gap-2">
              {refs.map((x, i) => (
                <Miniatura key={x.url} url={x.url} nome={x.nome} onRemover={() => setRefs(p => p.filter((_, j) => j !== i))} />
              ))}
              {refs.length < MAX_REFS && (
                <button type="button" onClick={() => refsInput.current?.click()} disabled={enviando}
                  className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold"
                  style={{ borderColor: '#be29ec50', color: '#be29ec' }}>
                  {enviando ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                  {enviando ? 'enviando' : 'anexar'}
                </button>
              )}
              <input ref={refsInput} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { anexar(e.target.files, 'refs'); e.target.value = '' }} />
            </div>
          </Campo>

          <Campo label="Foto do produto" dica="Opcional. Se enviar, a IA reproduz o produto real em vez de inventar um.">
            <div className="flex items-center gap-2">
              {foto
                ? <Miniatura url={foto.url} nome={foto.nome} onRemover={() => setFoto(null)} />
                : (
                  <button type="button" onClick={() => fotoInput.current?.click()} disabled={enviando}
                    className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold"
                    style={{ borderColor: '#e0e3f0', color: '#8890b5' }}>
                    <ImagePlus size={14} /> produto
                  </button>
                )}
              <input ref={fotoInput} type="file" accept="image/*" className="hidden"
                onChange={e => { anexar(e.target.files, 'foto'); e.target.value = '' }} />
            </div>
          </Campo>
          {erroUpload && <p className="text-[10px] font-semibold" style={{ color: '#dc2626' }}>{erroUpload}</p>}

          <div className="grid grid-cols-2 gap-2">
            <Campo label="Formato"><Opcoes opcoes={SAIDAS} value={saida} onChange={setSaida} /></Campo>
            <Campo label="Objetivo"><Opcoes opcoes={OBJETIVOS} value={objetivo} onChange={setObjetivo} /></Campo>
          </div>

          <Campo label="Headline" obrigatorio><Texto value={headline} onChange={setHeadline} placeholder="Ex: Queima de estoque Ciacollor" /></Campo>
          <Campo label="Subheadline"><Texto value={subheadline} onChange={setSubheadline} placeholder="Ex: Toda a linha com até 30% de desconto" /></Campo>

          <div className="grid grid-cols-2 gap-2">
            <Campo label="Produto"><Texto value={produto} onChange={setProduto} placeholder="Ex: Ciaflex 18L" /></Campo>
            <Campo label="Preço / oferta"><Texto value={preco} onChange={setPreco} placeholder="R$ 649,90" /></Campo>
            <Campo label="Condição"><Texto value={condicao} onChange={setCondicao} placeholder="à vista · acima de 50 sacos" /></Campo>
            <Campo label="Selo / urgência"><Texto value={selo} onChange={setSelo} placeholder="estoque limitado" /></Campo>
          </div>

          <Campo label="CTA" obrigatorio><Texto value={cta} onChange={setCta} placeholder="Ex: Peça pelo WhatsApp" /></Campo>
          <Campo label="Observações para a IA"><Texto value={obs} onChange={setObs} placeholder="Ex: fundo claro, clima de obra" /></Campo>

          <div className="rounded-lg px-3 py-2 text-[10px] leading-relaxed" style={{ background: '#f8f9fc', color: '#4b5068' }}>
            A IA cria só a imagem. Headline, preço, selo e CTA são escritos por cima exatamente como você digitou — ela nunca inventa preço.
          </div>

          {pendencias.length > 0 && (
            <div className="flex items-start gap-1.5 text-[10px] font-semibold" style={{ color: '#d97706' }}>
              <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" /> Falta: {pendencias.join(', ')}
            </div>
          )}

          <button type="button" onClick={gerar} disabled={pendencias.length > 0 || gerando}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-white transition-opacity disabled:opacity-40"
            style={{ background: '#be29ec' }}>
            {gerando
              ? <><Loader2 size={13} className="animate-spin" /> Gerando 3 versões — leva cerca de 1 minuto</>
              : artes.length
                ? <><RefreshCw size={12} /> Gerar 3 novas versões</>
                : <><Sparkles size={12} /> Gerar 3 versões</>}
          </button>

          {erroGerar && <p className="text-[11px] font-semibold" style={{ color: '#dc2626' }}>{erroGerar}</p>}

          {artes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {artes.map(a => a.erro && !a.blob ? (
                <div key={a.id} className="rounded-lg border p-2 text-[10px]" style={{ borderColor: '#fecaca', color: '#dc2626' }}>
                  {NOMES_VERSAO[a.versao]}: {a.erro}
                </div>
              ) : (
                <div key={a.id} className="rounded-lg border overflow-hidden bg-white" style={{ borderColor: a.estado === 'aprovada' ? '#6eda2c' : '#e0e3f0' }}>
                  <img src={a.preview} alt={NOMES_VERSAO[a.versao]} className="w-full object-cover" />
                  <div className="p-2 space-y-1.5">
                    <p className="text-[10px] font-bold" style={{ color: '#4b5068' }}>
                      {NOMES_VERSAO[a.versao]} · {FORMATOS_ARTE[a.formato].rotulo}
                    </p>
                    {a.erro && <p className="text-[10px]" style={{ color: '#dc2626' }}>{a.erro}</p>}
                    {a.estado === 'aprovada' ? (
                      <p className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#3f9e12' }}><Check size={11} /> Salva na tarefa</p>
                    ) : a.estado === 'descartada' ? (
                      <p className="text-[10px]" style={{ color: '#8890b5' }}>Descartada</p>
                    ) : (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => aprovar(a)} disabled={a.estado === 'salvando'}
                          className="flex-1 rounded-md py-1 text-[10px] font-bold text-white disabled:opacity-50" style={{ background: '#6eda2c' }}>
                          {a.estado === 'salvando' ? 'salvando…' : 'Aprovar'}
                        </button>
                        <button type="button" onClick={() => baixar(a)} title="Baixar"
                          className="rounded-md px-1.5 border" style={{ borderColor: '#e0e3f0', color: '#4b5068' }}>
                          <Download size={11} />
                        </button>
                        <button type="button" onClick={() => atualizar(a.id, { estado: 'descartada' })} title="Descartar"
                          className="rounded-md px-1.5 border" style={{ borderColor: '#e0e3f0', color: '#8890b5' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!taskId && artes.some(a => a.estado === 'aprovada') && (
            <p className="text-[10px]" style={{ color: '#8890b5' }}>A tarefa ainda não foi salva: as artes aprovadas entram nela quando você clicar em salvar.</p>
          )}
        </div>
      )}
    </div>
  )
}
