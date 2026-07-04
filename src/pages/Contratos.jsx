import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, ExternalLink, Copy, Check, RefreshCw, Search,
  Link2, Link2Off, Clock, CheckCircle2, XCircle, AlertCircle, User
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

const GQL_DOCS = `
query {
  documents(page: 1) {
    total
    data {
      id
      name
      created_at
      sandbox
      signatures {
        public_id
        name
        email
        link
        signed { created_at }
        rejected { created_at }
        viewed { created_at }
      }
    }
  }
}
`

const LINKS_KEY = 'autentique_links'
function loadLinks() { try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}') } catch { return {} } }
function saveLinks(l) { try { localStorage.setItem(LINKS_KEY, JSON.stringify(l)) } catch {} }

function docStatus(doc) {
  const sigs = doc.signatures || []
  if (!sigs.length) return 'rascunho'
  if (sigs.every(s => s.signed)) return 'assinado'
  if (sigs.some(s => s.rejected)) return 'rejeitado'
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

export default function Contratos() {
  const { erpClients } = useData()
  const [docs,          setDocs]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [links,         setLinks]         = useState(loadLinks)
  const [search,        setSearch]        = useState('')
  const [filterClient,  setFilterClient]  = useState('')
  const [copied,        setCopied]        = useState(null)
  const [linking,       setLinking]       = useState(null)

  async function fetchDocs() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/autentique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: GQL_DOCS }),
      })
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0]?.message || 'Erro da API Autentique')
      setDocs(json.data?.documents?.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocs() }, [])

  function linkDoc(docId, clientId) {
    const next = { ...links, [docId]: clientId }
    saveLinks(next)
    setLinks(next)
    setLinking(null)
  }

  function unlinkDoc(docId) {
    const next = { ...links }
    delete next[docId]
    saveLinks(next)
    setLinks(next)
  }

  function copyLink(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const clientName = id => erpClients?.find(c => c.id === id)?.name || id

  const filtered = docs.filter(doc => {
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterClient) return links[doc.id] === filterClient
    return true
  })

  const activeClients = erpClients?.filter(c => c.status === 'active') || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Carregando...' : `${docs.length} documento${docs.length !== 1 ? 's' : ''} via Autentique`}
          </p>
        </div>
        <a
          href="https://app.autentique.com.br"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm"
        >
          <ExternalLink size={14} />
          Abrir Autentique
        </a>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome do documento..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
        <select
          value={filterClient}
          onChange={e => setFilterClient(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
        >
          <option value="">Todos os clientes</option>
          {activeClients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={fetchDocs}
          disabled={loading}
          className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
          title="Atualizar"
        >
          <RefreshCw size={15} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <RefreshCw size={16} className="animate-spin" />
          Conectando ao Autentique...
        </div>
      )}

      {/* Vazio */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {docs.length === 0 ? 'Nenhum documento encontrado no Autentique.' : 'Nenhum documento corresponde ao filtro.'}
          </p>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map(doc => {
          const status       = docStatus(doc)
          const cfg          = STATUS_CFG[status]
          const StatusIcon   = cfg.Icon
          const linkedClient = links[doc.id]
          const isLinking    = linking === doc.id

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-gray-50 flex-shrink-0">
                  <FileText size={16} className="text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Nome + status */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{doc.name}</h3>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
                      <StatusIcon size={10} />
                      {cfg.label}
                    </span>
                    {doc.sandbox && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-200">
                        Sandbox
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mb-3">Criado em {fmtDate(doc.created_at)}</p>

                  {/* Signatários */}
                  {doc.signatures?.length > 0 && (
                    <div className="space-y-1.5 mb-3 pl-1">
                      {doc.signatures.map(sig => (
                        <div key={sig.public_id} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <User size={9} className="text-gray-400" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium truncate max-w-[140px]">
                            {sig.name || sig.email}
                          </span>
                          <span className="text-xs">
                            {sig.signed
                              ? <span className="flex items-center gap-0.5 text-emerald-600"><CheckCircle2 size={10} /> {fmtDate(sig.signed.created_at)}</span>
                              : sig.rejected
                              ? <span className="flex items-center gap-0.5 text-red-600"><XCircle size={10} /> Rejeitado</span>
                              : sig.viewed
                              ? <span className="text-blue-500">Visualizou</span>
                              : <span className="text-gray-400">Aguardando</span>}
                          </span>
                          {sig.link && (
                            <button
                              onClick={() => copyLink(sig.link, `${doc.id}-${sig.public_id}`)}
                              className="ml-auto flex-shrink-0 flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition-colors"
                            >
                              {copied === `${doc.id}-${sig.public_id}`
                                ? <><Check size={10} /> Copiado</>
                                : <><Copy size={10} /> Link</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vínculo com cliente */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                    {linkedClient ? (
                      <>
                        <span className="text-xs text-gray-400">Cliente:</span>
                        <span className="text-xs font-semibold text-gray-700">{clientName(linkedClient)}</span>
                        <button
                          onClick={() => unlinkDoc(doc.id)}
                          className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Link2Off size={11} /> Desvincular
                        </button>
                      </>
                    ) : isLinking ? (
                      <div className="flex items-center gap-2 w-full">
                        <select
                          autoFocus
                          className="flex-1 text-xs border border-violet-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white"
                          defaultValue=""
                          onChange={e => e.target.value && linkDoc(doc.id, e.target.value)}
                        >
                          <option value="" disabled>Selecionar cliente...</option>
                          {activeClients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setLinking(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-gray-400">Sem cliente vinculado</span>
                        <button
                          onClick={() => setLinking(doc.id)}
                          className="ml-auto flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
                        >
                          <Link2 size={11} /> Vincular
                        </button>
                      </>
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
