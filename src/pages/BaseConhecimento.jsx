import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus, Search, X, Hash, Edit2, Trash2, TrendingUp, Save, ChevronDown, Sparkles, Star } from 'lucide-react'
import { supabase, supabaseReady } from '../lib/supabase'
import { useData } from '../contexts/DataContext'
import { SEED_KNOWLEDGE, CATEGORIES } from '../data/knowledge-seeds'

const TON_CATEGORIES = {
  estrategia:       { label: 'Estratégia',   icon: '🎯', color: '#6eda2c' },
  duvida_comum:     { label: 'Dúvida Comum', icon: '❓', color: '#f59e0b' },
  ideia:            { label: 'Ideia',         icon: '💡', color: '#be29ec' },
  decisao:          { label: 'Decisão',       icon: '✅', color: '#3b82f6' },
  problema_cliente: { label: 'Problema',      icon: '⚠️', color: '#ef4444' },
}

function ImportanceStars({ value = 3 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={9} fill={i < value ? '#f59e0b' : 'none'} stroke={i < value ? '#f59e0b' : '#c0c4d6'} />
      ))}
    </div>
  )
}

function TonInsightCard({ ins, clientMap }) {
  const cat = TON_CATEGORIES[ins.category] || TON_CATEGORIES.ideia
  const client = ins.client_id ? clientMap[ins.client_id] : null
  const date = ins.created_at ? new Date(ins.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''
  return (
    <motion.div
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="bg-white rounded-2xl p-4 flex flex-col gap-3"
      style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)', border: `1px solid ${cat.color}22` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: cat.color + '18', color: cat.color }}>
          {cat.icon} {cat.label}
        </span>
        <ImportanceStars value={ins.importance} />
      </div>
      <p className="text-sm font-semibold leading-snug" style={{ color: '#1a1d2e' }}>{ins.insight}</p>
      {ins.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {ins.tags.map(t => (
            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: '#f4f6fb', color: '#8890b5' }}>#{t}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
        <span className="text-[10px] text-muted">{client ? client.name : '—'}</span>
        <span className="text-[10px] text-muted">{date}</span>
      </div>
    </motion.div>
  )
}

export { CATEGORIES, SEED_KNOWLEDGE }

/* ── CategoryBadge ───────────────────────────────────────── */
function CategoryBadge({ category, size = 'sm' }) {
  const cat = CATEGORIES[category]
  if (!cat) return null
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
      style={{ background: cat.color + '18', color: cat.color }}
    >
      {cat.icon} {cat.label}
    </span>
  )
}

/* ── TagChip ─────────────────────────────────────────────── */
function TagChip({ tag, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: '#f4f6fb', color: '#8890b5', border: '1px solid #e0e3f0' }}>
      #{tag}
      {onRemove && (
        <button onClick={() => onRemove(tag)} className="hover:text-red-400 transition-colors">
          <X size={9} />
        </button>
      )}
    </span>
  )
}

/* ── KnowledgeCard ───────────────────────────────────────── */
function KnowledgeCard({ item, onEdit, onDelete, isAdmin }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES[item.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.05)' }}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
          style={{ background: (cat?.color || '#8890b5') + '15' }}>
          {cat?.icon || '📄'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={item.category} />
              {item.niche && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#f4f6fb', color: '#8890b5' }}>
                  {item.niche}
                </span>
              )}
            </div>
            {isAdmin && (
              <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => onEdit(item)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors">
                  <Edit2 size={11} />
                </button>
                <button onClick={() => onDelete(item.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm font-bold text-text mb-1">{item.title}</p>
          <p className="text-xs text-text-2 leading-relaxed"
            style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical' }}>
            {item.content}
          </p>

          <AnimatePresence>
            {expanded && item.tags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1 mt-2"
              >
                {item.tags.map(tag => <TagChip key={tag} tag={tag} />)}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-2">
            {item.use_count > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <TrendingUp size={9} /> {item.use_count}x usado
              </span>
            )}
            {item.created_at && (
              <span className="text-[10px] text-muted">
                {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            )}
            <button
              onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
              className="ml-auto flex items-center gap-1 text-[10px] text-accent font-semibold hover:underline"
            >
              {expanded ? 'menos' : 'mais'}
              <ChevronDown size={10} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── EntryModal ──────────────────────────────────────────── */
function EntryModal({ entry, onClose, onSave, erpClients, currentUser }) {
  const [form, setForm] = useState({
    category: entry?.category || 'faq',
    title: entry?.title || '',
    content: entry?.content || '',
    tags: entry?.tags || [],
    client_id: entry?.client_id || '',
    niche: entry?.niche || '',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t])
    }
    setTagInput('')
  }

  function removeTag(tag) {
    set('tags', form.tags.filter(t => t !== tag))
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)

    const payload = {
      category:   form.category,
      title:      form.title.trim(),
      content:    form.content.trim(),
      tags:       form.tags,
      client_id:  form.client_id || null,
      niche:      form.niche.trim() || null,
      created_by: currentUser?.id || currentUser?.email || 'equipe',
      is_active:  true,
      use_count:  entry?.use_count || 0,
    }

    try {
      if (supabaseReady) {
        if (entry?.id && !entry.id.startsWith('seed-')) {
          await supabase.from('ai_knowledge').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', entry.id)
        } else {
          await supabase.from('ai_knowledge').insert(payload)
        }
      }
    } catch (err) {
      console.warn('Supabase save failed, using localStorage fallback:', err.message)
    }

    onSave({ ...payload, id: entry?.id || String(Date.now()) })
    setSaving(false)
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-lg bg-white rounded-2xl z-50 overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(26,29,46,0.18), 0 0 0 1px rgba(26,29,46,0.07)', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#6eda2c18' }}>
              <Brain size={14} style={{ color: '#6eda2c' }} />
            </div>
            <p className="text-sm font-extrabold text-text">{entry ? 'Editar entrada' : 'Nova entrada'}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={15} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5">Categoria</label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => set('category', key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${form.category === key ? 'border-2' : 'border-border hover:border-accent/30'}`}
                  style={form.category === key ? { borderColor: cat.color, background: cat.color + '12' } : {}}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-[9px] font-bold" style={{ color: form.category === key ? cat.color : '#8890b5' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Título</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Título descritivo da entrada..."
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Conteúdo</label>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="Descreva o conhecimento, insight ou prompt em detalhes..."
              rows={5}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                placeholder="Adicionar tag (Enter para confirmar)"
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50"
              />
              <button onClick={addTag}
                className="px-3 py-2 bg-accent/10 text-accent rounded-xl text-xs font-bold hover:bg-accent/20 transition-colors">
                <Hash size={13} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(tag => <TagChip key={tag} tag={tag} onRemove={removeTag} />)}
              </div>
            )}
          </div>

          {/* Linha opcional: cliente + nicho */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-2 mb-1">Cliente (opcional)</label>
              <select
                value={form.client_id}
                onChange={e => set('client_id', e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50"
              >
                <option value="">Nenhum</option>
                {(erpClients || []).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-2 mb-1">Nicho (opcional)</label>
              <input
                value={form.niche}
                onChange={e => set('niche', e.target.value)}
                placeholder="ex: advocacia"
                className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-text-2 hover:bg-surface transition-colors rounded-xl">
            Cancelar
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-[#15172a] text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
          >
            <Save size={13} />
            {saving ? 'Salvando...' : 'Salvar'}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

/* ── Contador de categorias ──────────────────────────────── */
function CategoryCounter({ items }) {
  const counts = {}
  Object.keys(CATEGORIES).forEach(k => { counts[k] = items.filter(i => i.category === k).length })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3.5"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{cat.icon}</span>
            <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</span>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: '#1a1d2e' }}>{counts[key]}</p>
          <p className="text-[10px] text-muted mt-0.5">{counts[key] === 1 ? 'entrada' : 'entradas'}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ── Página BaseConhecimento ─────────────────────────────── */
export default function BaseConhecimento() {
  const { erpClients } = useData()
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editEntry, setEditEntry]   = useState(null)
  const [mainTab, setMainTab]       = useState('base')
  const [tonInsights, setTonInsights] = useState([])
  const [tonLoading, setTonLoading] = useState(false)
  const [tonFilter, setTonFilter]   = useState('all')
  const [tonSearch, setTonSearch]   = useState('')
  const clientMap = Object.fromEntries(erpClients.map(c => [c.id, c]))

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}') } catch { return {} }
  })()
  const isAdmin = currentUser?.role === 'admin'

  /* ── Load ── */
  const loadKnowledge = useCallback(async () => {
    setLoading(true)
    try {
      if (supabaseReady) {
        const { data, error } = await supabase
          .from('ai_knowledge')
          .select('*')
          .order('use_count', { ascending: false })
        if (!error && data?.length) {
          setItems(data)
          setLoading(false)
          return
        }
      }
    } catch {}

    // Fallback: localStorage ou seeds
    try {
      const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
      setItems(stored.length ? stored : SEED_KNOWLEDGE)
    } catch {
      setItems(SEED_KNOWLEDGE)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadKnowledge() }, [loadKnowledge])

  const loadTonInsights = useCallback(async () => {
    if (!supabaseReady) return
    setTonLoading(true)
    try {
      const { data, error } = await supabase
        .from('ton_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!error && data) setTonInsights(data)
    } catch (err) {
      console.warn('[BaseConhecimento] ton_insights load falhou:', err?.message)
    } finally {
      setTonLoading(false)
    }
  }, [])

  useEffect(() => {
    if (mainTab === 'ton' && tonInsights.length === 0) loadTonInsights()
  }, [mainTab, loadTonInsights, tonInsights.length])

  /* ── Filtro ── */
  const filtered = items.filter(item => {
    if (filter !== 'all' && item.category !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.tags || []).some(t => t.includes(q)) ||
        (item.niche || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  /* ── Mutations ── */
  function handleSave(payload) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === payload.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...prev[idx], ...payload }
        saveLocal(updated)
        return updated
      }
      const next = [{ ...payload, id: String(Date.now()) }, ...prev]
      saveLocal(next)
      return next
    })
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover esta entrada?')) return
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      saveLocal(next)
      return next
    })
    if (supabaseReady && !String(id).startsWith('seed-')) {
      try { await supabase.from('ai_knowledge').delete().eq('id', id) } catch {}
    }
  }

  function saveLocal(data) {
    try { localStorage.setItem('trafegon_knowledge_v1', JSON.stringify(data)) } catch {}
  }

  function openNew() { setEditEntry(null); setShowModal(true) }
  function openEdit(item) { setEditEntry(item); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditEntry(null) }

  const TABS = [
    { id: 'all', label: 'Todos' },
    ...Object.entries(CATEGORIES).map(([k, c]) => ({ id: k, label: c.icon + ' ' + c.label })),
  ]

  const filteredTon = tonInsights.filter(ins => {
    if (tonFilter !== 'all' && ins.category !== tonFilter) return false
    if (tonSearch.trim()) {
      const q = tonSearch.toLowerCase()
      return ins.insight?.toLowerCase().includes(q) || ins.tags?.some(t => t.toLowerCase().includes(q))
    }
    return true
  })

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb' }}>
      <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-4 flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6eda2c22, #6eda2c08)', border: '1px solid #6eda2c30' }}>
              <Brain size={20} style={{ color: '#6eda2c' }} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold" style={{ color: '#1a1d2e' }}>Conhecimento</h1>
              <p className="text-xs" style={{ color: '#8890b5' }}>Base da equipe + aprendizado do TON</p>
            </div>
          </div>
          {mainTab === 'base' && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#15172a] transition-colors"
              style={{ background: '#6eda2c' }}
            >
              <Plus size={14} /> Adicionar
            </motion.button>
          )}
        </motion.div>

        {/* Main tabs */}
        <div className="flex gap-1 mb-5">
          {[
            { id: 'base', label: 'Base da Equipe', icon: <Brain size={13} /> },
            { id: 'ton',  label: 'Memória do TON', icon: <Sparkles size={13} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={mainTab === t.id
                ? { background: '#6eda2c', color: '#15172a' }
                : { background: '#fff', color: '#8890b5', border: '1px solid #e0e3f0' }}>
              {t.icon}{t.label}
              {t.id === 'ton' && tonInsights.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold"
                  style={{ background: '#be29ec20', color: '#be29ec' }}>{tonInsights.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Counters (base only) */}
        {mainTab === 'base' && !loading && <div className="mb-6"><CategoryCounter items={items} /></div>}

        {/* ── TON Memory section ── */}
        {mainTab === 'ton' && (
          <div>
            <div className="bg-white rounded-2xl mb-4 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search size={13} style={{ color: '#8890b5' }} />
                <input value={tonSearch} onChange={e => setTonSearch(e.target.value)}
                  placeholder="Buscar nos insights do TON..."
                  className="flex-1 text-sm bg-transparent focus:outline-none" style={{ color: '#1a1d2e' }} />
                {tonSearch && <button onClick={() => setTonSearch('')} className="text-muted hover:text-text-2"><X size={13} /></button>}
              </div>
              <div className="flex overflow-x-auto px-3 py-2 gap-1 scrollbar-hide">
                {[{ id: 'all', label: 'Todos' }, ...Object.entries(TON_CATEGORIES).map(([k, c]) => ({ id: k, label: c.icon + ' ' + c.label }))].map(tab => (
                  <button key={tab.id} onClick={() => setTonFilter(tab.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tonFilter === tab.id ? 'bg-accent/[0.14] text-accent' : 'text-muted hover:text-text-2 hover:bg-surface'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {tonLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredTon.length === 0 ? (
              <div className="bg-white rounded-2xl py-16 text-center" style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}>
                <Sparkles size={32} className="mx-auto mb-3" style={{ color: '#8890b5' }} />
                <p className="text-sm font-bold" style={{ color: '#1a1d2e' }}>
                  {tonSearch || tonFilter !== 'all' ? 'Nenhum resultado' : 'Nenhum insight ainda'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#8890b5' }}>
                  {tonSearch || tonFilter !== 'all' ? 'Tente outro filtro' : 'Os insights aparecem aqui automaticamente após cada conversa com o TON'}
                </p>
              </div>
            ) : (
              <motion.div layout className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredTon.map(ins => (
                    <TonInsightCard key={ins.id} ins={ins} clientMap={clientMap} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            {!tonLoading && filteredTon.length > 0 && (
              <p className="text-center text-xs mt-4" style={{ color: '#8890b5' }}>
                {filteredTon.length} insight{filteredTon.length !== 1 ? 's' : ''}
                {tonFilter !== 'all' && ` em ${TON_CATEGORIES[tonFilter]?.label}`}
              </p>
            )}
          </div>
        )}

        {/* ── Base da Equipe section ── */}
        {mainTab === 'base' && <div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-2xl mb-4 overflow-hidden"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search size={13} style={{ color: '#8890b5' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, conteúdo ou tag..."
              className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: '#1a1d2e' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted hover:text-text-2">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex overflow-x-auto px-3 py-2 gap-1 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-accent/[0.14] text-accent'
                    : 'text-muted hover:text-text-2 hover:bg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl py-16 text-center"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}>
            <Brain size={32} className="mx-auto mb-3" style={{ color: '#8890b5' }} />
            <p className="text-sm font-bold" style={{ color: '#1a1d2e' }}>
              {search ? 'Nenhum resultado encontrado' : 'Base vazia'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8890b5' }}>
              {search ? 'Tente outro termo de busca' : 'Adicione a primeira entrada para começar'}
            </p>
            {!search && (
              <button onClick={openNew}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-[#15172a] rounded-xl text-sm font-bold">
                <Plus size={13} /> Adicionar agora
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid gap-3 grid-cols-1 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map(item => (
                <KnowledgeCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs mt-4" style={{ color: '#8890b5' }}>
            {filtered.length} {filtered.length === 1 ? 'entrada' : 'entradas'}
            {filter !== 'all' && ` em ${CATEGORIES[filter]?.label}`}
          </p>
        )}
        </div>}

      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <EntryModal
            entry={editEntry}
            onClose={closeModal}
            onSave={handleSave}
            erpClients={erpClients}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
