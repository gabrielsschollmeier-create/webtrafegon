import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, ExternalLink, Copy, Check, RefreshCw, Search,
  Link2, Link2Off, Clock, CheckCircle2, XCircle, AlertCircle,
  User, Plus, ArrowLeft, ArrowRight, Send, ChevronRight
} from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { TEMPLATES, generateContractPdf } from '../data/contract-templates'

/* ── GraphQL ────────────────────────────────────────────────────── */
const GQL_DOCS = `query { documents(page: 1) { total data {
  id name created_at sandbox
  signatures { public_id name email link
    signed { created_at } rejected { created_at } viewed { created_at }
  }
} } }`

const LINKS_KEY = 'autentique_links'
function loadLinks() { try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}') } catch { return {} } }
function saveLinks(l) { try { localStorage.setItem(LINKS_KEY, JSON.stringify(l)) } catch {} }

function docStatus(doc) {
  const s = doc.signatures || []
  if (!s.length) return 'rascunho'
  if (s.every(x => x.signed)) return 'assinado'
  if (s.some(x => x.rejected)) return 'rejeitado'
  return 'pendente'
}

const STATUS_CFG = {
  assinado:  { label: 'Assinado',  cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: CheckCircle2 },
  pendente:  { label: 'Pendente',  cls: 'text-amber-700   bg-amber-50   border-amber-200',   Icon: Clock },
  rejeitado: { label: 'Rejeitado', cls: 'text-red-700     bg-red-50     border-red-200',     Icon: XCircle },
  rascunho:  { label: 'Rascunho',  cls: 'text-gray-500    bg-gray-50    border-gray-200',    Icon: FileText },
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function Contratos() {
  const [mode, setMode] = useState('list')

  if (mode === 'new') return <NovoContrato onBack={() => setMode('list')} />

  return <ContratosList onNew={() => setMode('new')} />
}

/* ════════════════════════════════════════════════════════════════
   LISTA DE CONTRATOS
═══════════════════════════════════════════════════════════════════ */
function ContratosList({ onNew }) {
  const { erpClients } = useData()
  const [docs,         setDocs]         = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [links,        setLinks]        = useState(loadLinks)
  const [search,       setSearch]       = useState('')
  const [filterClient, setFilterClient] = useState('')
  const [copied,       setCopied]       = useState(null)
  const [linking,      setLinking]      = useState(null)

  async function fetchDocs() {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/autentique', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: GQL_DOCS }) })
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0]?.message || 'Erro da API')
      setDocs(json.data?.documents?.data || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDocs() }, [])

  function linkDoc(docId, clientId) { const n = { ...links, [docId]: clientId }; saveLinks(n); setLinks(n); setLinking(null) }
  function unlinkDoc(docId)          { const n = { ...links }; delete n[docId]; saveLinks(n); setLinks(n) }
  function copyLink(text, key)       { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000) }
  const clientName = id => erpClients?.find(c => c.id === id)?.name || id
  const activeClients = erpClients?.filter(c => c.status === 'active') || []

  const filtered = docs.filter(doc => {
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterClient) return links[doc.id] === filterClient
    return true
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Carregando...' : `${docs.length} documento${docs.length !== 1 ? 's' : ''} via Autentique`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://app.autentique.com.br" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ExternalLink size={13} /> Autentique
          </a>
          <button onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm">
            <Plus size={15} /> Novo Contrato
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
        </div>
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer">
          <option value="">Todos os clientes</option>
          {activeClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={fetchDocs} disabled={loading} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40">
          <RefreshCw size={14} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
          <AlertCircle size={14} className="flex-shrink-0" /> {error}
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2"><RefreshCw size={15} className="animate-spin" /> Carregando...</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm mb-4">{docs.length === 0 ? 'Nenhum documento encontrado no Autentique.' : 'Nenhum documento corresponde ao filtro.'}</p>
          <button onClick={onNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700">
            <Plus size={14} /> Criar primeiro contrato
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(doc => {
          const status = docStatus(doc)
          const cfg    = STATUS_CFG[status]
          const Icon   = cfg.Icon
          const linkedClient = links[doc.id]
          const isLinking    = linking === doc.id
          return (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-gray-50 flex-shrink-0"><FileText size={15} className="text-gray-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{doc.name}</h3>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                      <Icon size={9} /> {cfg.label}
                    </span>
                    {doc.sandbox && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-200">Sandbox</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Criado em {fmtDate(doc.created_at)}</p>
                  {doc.signatures?.length > 0 && (
                    <div className="space-y-1.5 mb-3 pl-1">
                      {doc.signatures.map(sig => (
                        <div key={sig.public_id} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><User size={9} className="text-gray-400" /></div>
                          <span className="text-xs text-gray-700 font-medium truncate max-w-[130px]">{sig.name || sig.email}</span>
                          <span className="text-xs">
                            {sig.signed  ? <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle2 size={9} /> {fmtDate(sig.signed.created_at)}</span>
                            : sig.rejected ? <span className="text-red-600 flex items-center gap-0.5"><XCircle size={9} /> Rejeitado</span>
                            : sig.viewed   ? <span className="text-blue-500">Visualizou</span>
                            :                <span className="text-gray-400">Aguardando</span>}
                          </span>
                          {sig.link && (
                            <button onClick={() => copyLink(sig.link, `${doc.id}-${sig.public_id}`)}
                              className="ml-auto flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800">
                              {copied === `${doc.id}-${sig.public_id}` ? <><Check size={9} /> Copiado</> : <><Copy size={9} /> Link</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                    {linkedClient ? (
                      <><span className="text-xs text-gray-400">Cliente:</span>
                        <span className="text-xs font-semibold text-gray-700">{clientName(linkedClient)}</span>
                        <button onClick={() => unlinkDoc(doc.id)} className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600">
                          <Link2Off size={10} /> Desvincular
                        </button></>
                    ) : isLinking ? (
                      <div className="flex items-center gap-2 w-full">
                        <select autoFocus className="flex-1 text-xs border border-violet-300 rounded-lg px-2 py-1 focus:outline-none bg-white"
                          defaultValue="" onChange={e => e.target.value && linkDoc(doc.id, e.target.value)}>
                          <option value="" disabled>Selecionar cliente...</option>
                          {activeClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button onClick={() => setLinking(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
                      </div>
                    ) : (
                      <><span className="text-xs text-gray-400">Sem cliente vinculado</span>
                        <button onClick={() => setLinking(doc.id)} className="ml-auto flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium">
                          <Link2 size={10} /> Vincular
                        </button></>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   NOVO CONTRATO — WIZARD 3 PASSOS
═══════════════════════════════════════════════════════════════════ */
const FORM_DEFAULT = {
  contratante_nome: '',
  cnpj:            '',
  endereco:        '',
  representante_nome:  '',
  representante_cpf:   '',
  representante_email: '',
  valor:           '',
  dia_vencimento:  '10',
  data_inicio:     new Date().toISOString().split('T')[0],
  vigencia:        '12',
  cidade_foro:     'Florianópolis',
}

function NovoContrato({ onBack }) {
  const { erpClients } = useData()
  const [step,      setStep]     = useState(1)
  const [tplId,     setTplId]    = useState(null)
  const [clientId,  setClientId] = useState('')
  const [form,      setForm]     = useState(FORM_DEFAULT)
  const [sending,   setSending]  = useState(false)
  const [result,    setResult]   = useState(null)
  const [pdfError,  setPdfError] = useState(null)

  const tpl          = TEMPLATES.find(t => t.id === tplId)
  const activeClients = erpClients?.filter(c => c.status === 'active') || []
  const selectedClient = activeClients.find(c => c.id === clientId)

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function handleClientSelect(id) {
    setClientId(id)
    const c = activeClients.find(x => x.id === id)
    if (c) setField('contratante_nome', c.name)
  }

  async function handleSend() {
    setPdfError(null)
    setSending(true)
    try {
      const pdfBase64 = generateContractPdf(tplId, form, selectedClient?.name || form.contratante_nome)

      const res  = await fetch('/api/autentique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:       'createDocument',
          documentName: `${tpl.nome} — ${selectedClient?.name || form.contratante_nome}`,
          message:      `Olá! Segue o contrato de ${tpl.nome.toLowerCase()} para sua assinatura digital. Em caso de dúvidas, entre em contato conosco.`,
          pdfBase64,
          signers: [
            { name: form.representante_nome,   email: form.representante_email,           action: 'SIGN' },
            { name: 'Gabriel Schollmeier',      email: 'gabrielsschollmeier@gmail.com',    action: 'SIGN' },
          ],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setPdfError(e.message)
    } finally {
      setSending(false)
    }
  }

  /* ── Resultado final ── */
  if (result && !result.error) {
    const sigs = result.data?.createDocument?.signatures || []
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contrato enviado!</h2>
          <p className="text-sm text-gray-500 mb-6">O Autentique já disparou os e-mails de assinatura para os signatários.</p>
          {sigs.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3 mb-6">
              {sigs.map(s => (
                <div key={s.public_id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0"><User size={12} className="text-violet-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{s.name || s.email}</p>
                    <p className="text-xs text-gray-400">Aguardando assinatura</p>
                  </div>
                  {s.link && (
                    <button onClick={() => navigator.clipboard.writeText(s.link)}
                      className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800">
                      <Copy size={10} /> Copiar link
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={onBack} className="px-4 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50">Ver contratos</button>
            <button onClick={() => { setStep(1); setTplId(null); setResult(null); setForm(FORM_DEFAULT) }}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700">
              Novo contrato
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Novo Contrato</h1>
          <p className="text-xs text-gray-400">Passo {step} de 3</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
              ${step === n ? 'bg-violet-600 text-white' : step > n ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > n ? <Check size={12} /> : n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === n ? 'text-violet-700' : step > n ? 'text-emerald-600' : 'text-gray-400'}`}>
              {['Modelo','Dados','Enviar'][i]}
            </span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > n ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Passo 1: Escolher modelo ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Escolha o modelo de contrato</h2>
            <div className="space-y-3">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setTplId(t.id); setStep(2) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:border-violet-400
                    ${tplId === t.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 bg-white'}`}>
                  <span className="text-3xl flex-shrink-0">{t.icone}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{t.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.descricao}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Passo 2: Preencher dados ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Dados do contrato</h2>
            <p className="text-xs text-gray-400 mb-5">{tpl?.icone} {tpl?.nome}</p>

            <div className="space-y-5">
              {/* Bloco: Contratante */}
              <fieldset className="border border-gray-200 rounded-2xl p-4">
                <legend className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Contratante</legend>
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cliente do CRM</label>
                    <select value={clientId} onChange={e => handleClientSelect(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400">
                      <option value="">— Selecionar cliente —</option>
                      {activeClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <Field label="Nome da empresa / pessoa" value={form.contratante_nome} onChange={v => setField('contratante_nome', v)} placeholder="Ex: Intime Sistemas Ltda" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CNPJ / CPF" value={form.cnpj} onChange={v => setField('cnpj', v)} placeholder="00.000.000/0001-00" />
                    <Field label="Endereço" value={form.endereco} onChange={v => setField('endereco', v)} placeholder="Cidade, UF" />
                  </div>
                </div>
              </fieldset>

              {/* Bloco: Signatário */}
              <fieldset className="border border-gray-200 rounded-2xl p-4">
                <legend className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Signatário do cliente</legend>
                <div className="space-y-3 mt-2">
                  <Field label="Nome completo" value={form.representante_nome} onChange={v => setField('representante_nome', v)} placeholder="Quem vai assinar pelo cliente" required />
                  <Field label="E-mail para assinatura" value={form.representante_email} onChange={v => setField('representante_email', v)} type="email" placeholder="email@cliente.com.br" required />
                  <Field label="CPF (opcional)" value={form.representante_cpf} onChange={v => setField('representante_cpf', v)} placeholder="000.000.000-00" />
                </div>
              </fieldset>

              {/* Bloco: Contrato */}
              <fieldset className="border border-gray-200 rounded-2xl p-4">
                <legend className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Detalhes do contrato</legend>
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Valor mensal (R$)" value={form.valor} onChange={v => setField('valor', v)} placeholder="2500,00" required />
                    <Field label="Dia de vencimento" value={form.dia_vencimento} onChange={v => setField('dia_vencimento', v)} placeholder="10" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Data de início" value={form.data_inicio} onChange={v => setField('data_inicio', v)} type="date" required />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Vigência</label>
                      <select value={form.vigencia} onChange={e => setField('vigencia', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200">
                        {[3,6,12,24,36].map(m => <option key={m} value={m}>{m} meses</option>)}
                      </select>
                    </div>
                  </div>
                  <Field label="Cidade do foro" value={form.cidade_foro} onChange={v => setField('cidade_foro', v)} placeholder="Florianópolis" />
                </div>
              </fieldset>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!form.contratante_nome || !form.representante_nome || !form.representante_email || !form.valor}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Revisar contrato <ArrowRight size={15} />
            </button>
          </motion.div>
        )}

        {/* ── Passo 3: Revisão + Envio ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Revisar e enviar</h2>
            <p className="text-xs text-gray-400 mb-5">Confirme os dados antes de gerar e enviar o contrato</p>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-5 text-sm">
              <Row label="Modelo"      value={`${tpl?.icone} ${tpl?.nome}`} />
              <Row label="Contratante" value={selectedClient?.name || form.contratante_nome} />
              {form.cnpj && <Row label="CNPJ/CPF" value={form.cnpj} />}
              <Row label="Signatário"  value={`${form.representante_nome} (${form.representante_email})`} />
              <div className="border-t border-gray-200 pt-3 mt-3" />
              <Row label="Valor mensal" value={`R$ ${form.valor}`} highlight />
              <Row label="Vencimento"   value={`Dia ${form.dia_vencimento} de cada mês`} />
              <Row label="Início"       value={form.data_inicio ? new Date(form.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR') : '—'} />
              <Row label="Vigência"     value={`${form.vigencia} meses`} />
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-5">
              <p className="text-xs font-semibold text-violet-800 mb-2">Signatários que receberão o e-mail:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center"><User size={11} className="text-violet-700" /></div>
                  <span className="text-xs text-violet-900 font-medium">{form.representante_nome}</span>
                  <span className="text-xs text-violet-600">{form.representante_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center"><User size={11} className="text-violet-700" /></div>
                  <span className="text-xs text-violet-900 font-medium">Gabriel Schollmeier</span>
                  <span className="text-xs text-violet-600">gabrielsschollmeier@gmail.com</span>
                </div>
              </div>
            </div>

            {pdfError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                <AlertCircle size={14} className="flex-shrink-0" /> {pdfError}
              </div>
            )}

            <button onClick={handleSend} disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 transition-colors">
              {sending ? <><RefreshCw size={14} className="animate-spin" /> Gerando PDF e enviando…</> : <><Send size={14} /> Gerar contrato e enviar para assinatura</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Componentes auxiliares ────────────────────────────────────── */
function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-xs font-semibold text-right ${highlight ? 'text-violet-700' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}
