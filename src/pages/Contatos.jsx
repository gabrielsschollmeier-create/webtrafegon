import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Phone, MessageSquare, MoreHorizontal, Filter,
  ChevronDown, X, Trash2, UserX, Check,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

const fmt = (v) => v > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v) : '—'

const SOURCES   = ['WhatsApp', 'Meta Ads', 'Meta Formulário', 'Google Ads', 'Orgânico', 'Indicação', 'Lista de leads', 'Cliente']
const ASSIGNEES = ['GS', 'JC', 'AM', 'RF']

const sourceColors = {
  'WhatsApp':       'bg-green-500/10 text-green-400',
  'Meta Ads':       'bg-blue-400/10 text-blue-400',
  'Meta Formulário':'bg-purple/10 text-purple',
  'Google Ads':     'bg-orange/10 text-orange',
  'Orgânico':       'bg-accent/10 text-accent',
  'Indicação':      'bg-pink-500/10 text-pink-400',
  'Lista de leads': 'bg-muted/10 text-muted',
  'Cliente':        'bg-accent/10 text-accent',
}

/* ── Confirm Delete Modal ─────────────────────────────────── */
function ConfirmDeleteModal({ count, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-sm p-6"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
          <UserX size={22} className="text-danger" />
        </div>
        <p className="text-base font-extrabold text-text mb-1">
          Excluir {count === 1 ? 'contato' : `${count} contatos`}?
        </p>
        <p className="text-sm text-muted mb-6">
          {count === 1
            ? 'Este contato será excluído permanentemente.'
            : `Esses ${count} contatos serão excluídos permanentemente.`}{' '}
          Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white bg-danger hover:bg-danger/90 transition-colors">
            Excluir
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── New Contact Modal ────────────────────────────────────── */
function NewContactModal({ onClose, onCreate, stages, pipelines }) {
  const [form, setForm] = useState({
    name:       '',
    phone:      '',
    source:     'WhatsApp',
    pipelineId: pipelines[0]?.id ?? 1,
    stage:      stages.find(s => s.pipelineId === (pipelines[0]?.id ?? 1))?.id ?? 'novo',
    assignee:   'GS',
    value:      0,
  })

  const pipelineStages = stages.filter(s => s.pipelineId === form.pipelineId)

  function changePipeline(pipelineId) {
    const first = stages.find(s => s.pipelineId === pipelineId)?.id || ''
    setForm(f => ({ ...f, pipelineId, stage: first }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    onCreate({ ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], tags: [], notes: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-base font-extrabold text-text">Novo Contato</p>
            <p className="text-xs text-muted mt-0.5">Adicionar ao CRM</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nome ou empresa" autoFocus
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Telefone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+55 47 9 9999-0000"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Origem</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Valor (R$)</label>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Funil</label>
            <div className="flex gap-1.5 mb-3">
              {pipelines.map(p => (
                <button key={p.id} onClick={() => changePipeline(p.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: form.pipelineId === p.id ? '#1a1d2e' : 'transparent',
                    borderColor:     form.pipelineId === p.id ? '#1a1d2e' : '#e0e3f0',
                    color:           form.pipelineId === p.id ? '#fff'    : '#8890b5',
                  }}>
                  {p.name}
                </button>
              ))}
            </div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Etapa inicial</label>
            <div className="flex flex-wrap gap-1.5">
              {pipelineStages.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all"
                  style={{
                    backgroundColor: form.stage === s.id ? s.color + '22' : 'transparent',
                    borderColor:     form.stage === s.id ? s.color + '70' : '#e0e3f0',
                    color:           form.stage === s.id ? s.color         : '#8890b5',
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Responsável</label>
            <div className="flex gap-1.5">
              {ASSIGNEES.map(a => (
                <button key={a} onClick={() => setForm(f => ({ ...f, assignee: a }))}
                  className="flex-1 py-2.5 rounded-xl text-[11px] font-extrabold border transition-all"
                  style={{
                    backgroundColor: form.assignee === a ? '#6eda2c22' : 'transparent',
                    borderColor:     form.assignee === a ? '#6eda2c70' : '#e0e3f0',
                    color:           form.assignee === a ? '#6eda2c'   : '#8890b5',
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all disabled:opacity-40"
            style={{ background: '#6eda2c', boxShadow: form.name.trim() ? '0 4px 16px #6eda2c30' : 'none' }}>
            Criar Contato
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Checkbox ─────────────────────────────────────────────── */
function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <button
      onClick={onChange}
      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all border"
      style={{
        backgroundColor: checked || indeterminate ? '#6eda2c' : 'transparent',
        borderColor: checked || indeterminate ? '#6eda2c' : '#d0d4e8',
      }}
    >
      {indeterminate
        ? <div className="w-2 h-0.5 bg-white rounded-full" />
        : checked && <Check size={10} className="text-white" strokeWidth={3} />
      }
    </button>
  )
}

/* ── Contatos Page ────────────────────────────────────────── */
export default function Contatos() {
  const { leads: initialLeads, stages, pipelines, addLead, deleteLead, deleteLeads } = useData()
  const stageMap = Object.fromEntries(stages.map(s => [s.id, s]))
  const [leads,          setLeads]          = useState([])
  const [search,         setSearch]         = useState('')
  const [filterSource,   setFilterSource]   = useState('')
  const [showFilter,     setShowFilter]     = useState(false)
  const [showNewContact, setShowNewContact] = useState(false)
  const [selected,       setSelected]       = useState(new Set())
  const [openMenuId,     setOpenMenuId]     = useState(null)
  const [confirmDelete,  setConfirmDelete]  = useState(null) // null | 'bulk' | id
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { if (initialLeads.length) setLeads(initialLeads) }, [initialLeads])

  /* Fechar dropdown ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = leads.filter(l => {
    const matchSearch = search === '' ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone && l.phone.includes(search)) ||
      l.source.toLowerCase().includes(search.toLowerCase())
    const matchSource = filterSource === '' || l.source === filterSource
    return matchSearch && matchSource
  })

  const allSelected    = filtered.length > 0 && filtered.every(l => selected.has(l.id))
  const someSelected   = filtered.some(l => selected.has(l.id))
  const selectedCount  = [...selected].filter(id => filtered.some(l => l.id === id)).length

  function toggleSelect(id, e) {
    e.stopPropagation()
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        filtered.forEach(l => next.delete(l.id))
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        filtered.forEach(l => next.add(l.id))
        return next
      })
    }
  }

  function clearSelection() { setSelected(new Set()) }

  async function handleCreate(newLead) {
    const saved = await addLead(newLead)
    setLeads(prev => [saved ?? newLead, ...prev])
  }

  async function handleDeleteOne(id) {
    setConfirmDelete(null)
    await deleteLead(id)
    setLeads(prev => prev.filter(l => l.id !== id))
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  async function handleDeleteSelected() {
    const ids = [...selected].filter(id => leads.some(l => l.id === id))
    setConfirmDelete(null)
    clearSelection()
    await deleteLeads(ids)
    setLeads(prev => prev.filter(l => !ids.includes(l.id)))
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Contatos</h1>
          <p className="text-sm text-muted mt-0.5">{leads.length} contatos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar..."
              className="bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40 w-48 transition-colors" />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-1.5 text-sm text-text-2 bg-surface border px-3 py-2 rounded-lg transition-colors font-medium ${
                filterSource ? 'border-accent/50 text-accent' : 'border-border hover:border-surface-2'
              }`}
            >
              <Filter size={13} /> {filterSource || 'Filtrar'}
            </button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                <button
                  onClick={() => { setFilterSource(''); setShowFilter(false) }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-surface-2 ${!filterSource ? 'text-accent' : 'text-text-2'}`}
                >
                  Todas as origens
                </button>
                {SOURCES.map(s => (
                  <button key={s}
                    onClick={() => { setFilterSource(s); setShowFilter(false) }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-surface-2 ${filterSource === s ? 'text-accent' : 'text-text-2'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewContact(true)}
            className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all">
            <Plus size={14} /> Novo contato
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3.5 w-10">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {['Nome', 'Telefone', 'Origem', 'Etapa', 'Valor', 'Criado em', ''].map((col, i) => (
                <th key={i} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-4 py-3.5">
                  {col && (
                    <div className="flex items-center gap-1 cursor-pointer hover:text-text-2 transition-colors select-none w-fit">
                      {col} {col !== '' && <ChevronDown size={11} />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={menuRef}>
            {filtered.map(lead => {
              const stage    = stageMap[lead.stage]
              const src      = sourceColors[lead.source] || 'bg-muted/10 text-muted'
              const isSel    = selected.has(lead.id)
              const menuOpen = openMenuId === lead.id
              return (
                <tr key={lead.id}
                  onClick={() => navigate(`/contatos/${lead.id}`)}
                  className={`border-b border-border/40 transition-colors cursor-pointer group ${
                    isSel ? 'bg-accent/[0.04]' : 'hover:bg-black/[0.02]'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5 w-10" onClick={e => toggleSelect(lead.id, e)}>
                    <Checkbox checked={isSel} onChange={() => {}} />
                  </td>

                  {/* Nome */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                        {lead.name[0]}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-text">{lead.name}</span>
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {lead.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: '#be29ec12', color: '#be29ec' }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Telefone */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted font-mono">{lead.phone || '—'}</span>
                  </td>

                  {/* Origem */}
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${src}`}>{lead.source}</span>
                  </td>

                  {/* Etapa */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stage?.color }} />
                      <span className="text-sm text-text-2">{stage?.label || '—'}</span>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${lead.value > 0 ? 'text-accent' : 'text-muted'}`}>
                      {fmt(lead.value)}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted">
                      {new Date(lead.createdAt + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); window.location.href = `tel:${lead.phone}` }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                        <Phone size={13} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); window.open(`https://wa.me/55${lead.phone?.replace(/\D/g,'')}`, '_blank') }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-green-500 hover:bg-green-500/10 transition-colors">
                        <MessageSquare size={13} />
                      </button>
                      {/* MoreHorizontal dropdown */}
                      <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setOpenMenuId(menuOpen ? null : lead.id) }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                          <MoreHorizontal size={13} />
                        </button>
                        <AnimatePresence>
                          {menuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-full mt-1 w-40 bg-white border border-border rounded-xl shadow-xl z-30 py-1 overflow-hidden"
                            >
                              <button
                                onClick={() => { navigate(`/contatos/${lead.id}`); setOpenMenuId(null) }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-text-2 hover:bg-surface-2 transition-colors"
                              >
                                Ver perfil
                              </button>
                              <div className="h-px bg-border mx-2 my-1" />
                              <button
                                onClick={() => { setOpenMenuId(null); setConfirmDelete(lead.id) }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/5 transition-colors flex items-center gap-2"
                              >
                                <Trash2 size={12} /> Excluir
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted text-sm">Nenhum contato encontrado.</div>
        )}
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border"
            style={{ background: '#12141e', borderColor: 'rgba(255,255,255,0.1)', minWidth: 320 }}
          >
            <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-accent" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-white flex-1">
              {selectedCount} {selectedCount === 1 ? 'contato selecionado' : 'contatos selecionados'}
            </span>
            <button onClick={clearSelection}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors">
              Cancelar
            </button>
            <button onClick={() => setConfirmDelete('bulk')}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors">
              <Trash2 size={12} /> Excluir {selectedCount}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showNewContact && (
          <NewContactModal
            onClose={() => setShowNewContact(false)}
            onCreate={handleCreate}
            stages={stages}
            pipelines={pipelines}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete !== null && (
          <ConfirmDeleteModal
            count={confirmDelete === 'bulk' ? selectedCount : 1}
            onConfirm={confirmDelete === 'bulk' ? handleDeleteSelected : () => handleDeleteOne(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
