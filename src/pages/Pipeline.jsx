import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, MessageSquare, Calendar, Tag, Plus, Search, Filter, MoreHorizontal,
  TrendingDown, LayoutGrid, Settings2, X, Check, ChevronDown, Trash2, Hourglass, UserX,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'

/* ── Constants ────────────────────────────────────────────── */
const QUALITY_CONFIG = {
  hot:  { label: 'Quente', icon: '🔥', color: '#ef4444' },
  warm: { label: 'Morno',  icon: '🌡️', color: '#ea8a29' },
  cold: { label: 'Frio',   icon: '❄️', color: '#60a5fa' },
}

const SOURCES   = ['WhatsApp', 'Meta Ads', 'Meta Formulário', 'Google Ads', 'Orgânico', 'Indicação', 'Lista de leads', 'Cliente']
const ASSIGNEES = ['GS', 'JC', 'AM', 'RF']
const PRESET_COLORS = ['#6eda2c', '#60a5fa', '#be29ec', '#ea8a29', '#ef4444', '#22d3ee', '#8890b5', '#f59e0b', '#ec4899', '#34d399']

const fmt = (v) => v > 0
  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
  : null

const sourceColors = {
  'WhatsApp':        'bg-green-500/10 text-green-400',
  'Meta Ads':        'bg-blue-400/10 text-blue-400',
  'Meta Formulário': 'bg-purple/10 text-purple',
  'Google Ads':      'bg-orange/10 text-orange',
  'Orgânico':        'bg-accent/10 text-accent',
  'Indicação':       'bg-pink-500/10 text-pink-400',
  'Lista de leads':  'bg-muted/10 text-muted',
  'Cliente':         'bg-accent/10 text-accent',
}

/* ── Lead Detail Modal ────────────────────────────────────── */
function LeadDetailModal({ lead, stages, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    name:      lead.name,
    phone:     lead.phone,
    email:     lead.email     || '',
    source:    lead.source,
    value:     lead.value     || 0,
    valueType: lead.valueType || 'unico',
    quality:   lead.quality   || null,
    tags:      lead.tags      || [],
    stage:     lead.stage,
    assignee:  lead.assignee,
    notes:     lead.notes     || '',
  })
  const [tagInput, setTagInput] = useState('')

  function addTag(e) {
    if (e.key !== 'Enter' && e.key !== ',') return
    e.preventDefault()
    const tag = tagInput.trim().replace(/,$/, '')
    if (tag && !form.tags.includes(tag)) setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    setTagInput('')
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
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-base font-bold text-accent flex-shrink-0">
              {form.name[0]}
            </div>
            <div>
              <p className="text-sm font-extrabold text-text">{lead.name}</p>
              <p className="text-[11px] text-muted">{lead.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors"
              title="Abrir WhatsApp">
              <MessageSquare size={15} />
            </a>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Telefone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">E-mail</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              type="email" placeholder="email@exemplo.com"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>

          {/* Value + Quality */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Valor</label>
              <div className="flex gap-1 mb-1.5">
                <button onClick={() => setForm(f => ({ ...f, valueType: 'unico' }))}
                  className="flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all"
                  style={{ background: form.valueType !== 'recorrente' ? '#6eda2c' : '#f2f4fb', color: form.valueType !== 'recorrente' ? '#fff' : '#8890b5', borderColor: form.valueType !== 'recorrente' ? '#6eda2c' : '#e0e3f0' }}>
                  Único
                </button>
                <button onClick={() => setForm(f => ({ ...f, valueType: 'recorrente' }))}
                  className="flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all"
                  style={{ background: form.valueType === 'recorrente' ? '#be29ec' : '#f2f4fb', color: form.valueType === 'recorrente' ? '#fff' : '#8890b5', borderColor: form.valueType === 'recorrente' ? '#be29ec' : '#e0e3f0' }}>
                  /mês
                </button>
              </div>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder={form.valueType === 'recorrente' ? 'R$/mês' : 'R$'}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Temperatura</label>
              <div className="flex gap-1.5">
                {Object.entries(QUALITY_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => setForm(f => ({ ...f, quality: f.quality === key ? null : key }))}
                    title={cfg.label}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm border transition-all"
                    style={{
                      backgroundColor: form.quality === key ? cfg.color + '22' : 'transparent',
                      borderColor:     form.quality === key ? cfg.color + '70' : '#e0e3f0',
                    }}
                  >
                    {cfg.icon}
                  </button>
                ))}
              </div>
              {form.quality && (
                <p className="text-[10px] mt-1 font-semibold text-center" style={{ color: QUALITY_CONFIG[form.quality].color }}>
                  {QUALITY_CONFIG[form.quality].label}
                </p>
              )}
            </div>
          </div>

          {/* Source + Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Origem</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
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

          {/* Stage */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Etapa atual</label>
            <div className="flex flex-wrap gap-1.5">
              {stages.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all"
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

          {/* Tags */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Tags</label>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: '#be29ec15', color: '#be29ec' }}>
                    {t}
                    <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}
                      className="hover:text-danger transition-colors ml-0.5">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Digite e pressione Enter para adicionar tag..."
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Observações</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Notas sobre este lead..."
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
          <button onClick={() => onDelete(lead.id)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-colors flex-shrink-0"
            title="Excluir lead">
            <Trash2 size={15} />
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave({ ...lead, ...form }); onClose() }}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 16px #6eda2c30' }}>
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── New Lead Modal ───────────────────────────────────────── */
function NewLeadModal({ pipelines, stages, activePipelineId, defaultStageId, onClose, onCreate }) {
  const firstStageId = stages.find(s => s.pipelineId === activePipelineId)?.id || ''
  const [form, setForm] = useState({
    name:       '',
    phone:      '',
    email:      '',
    source:     'WhatsApp',
    value:      0,
    valueType:  'unico',
    quality:    null,
    tags:       [],
    pipelineId: activePipelineId,
    stage:      defaultStageId || firstStageId,
    assignee:   'GS',
    notes:      '',
  })
  const [tagInput, setTagInput] = useState('')

  const pipelineStages = stages.filter(s => s.pipelineId === form.pipelineId)

  function addTag(e) {
    if (e.key !== 'Enter' && e.key !== ',') return
    e.preventDefault()
    const tag = tagInput.trim().replace(/,$/, '')
    if (tag && !form.tags.includes(tag)) setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    setTagInput('')
  }

  function changePipeline(pipelineId) {
    const first = stages.find(s => s.pipelineId === pipelineId)?.id || ''
    setForm(f => ({ ...f, pipelineId, stage: first }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    onCreate({ ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] })
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
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[88vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-base font-extrabold text-text">Nova Oportunidade</p>
            <p className="text-xs text-muted mt-0.5">Adicionar lead ao pipeline</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nome do lead ou empresa" autoFocus
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Telefone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+55 47 9 9999-0000"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">E-mail</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              type="email" placeholder="email@exemplo.com"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>

          {/* Value + Quality */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Valor</label>
              <div className="flex gap-1 mb-1.5">
                <button onClick={() => setForm(f => ({ ...f, valueType: 'unico' }))}
                  className="flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all"
                  style={{ background: form.valueType !== 'recorrente' ? '#6eda2c' : '#f2f4fb', color: form.valueType !== 'recorrente' ? '#fff' : '#8890b5', borderColor: form.valueType !== 'recorrente' ? '#6eda2c' : '#e0e3f0' }}>
                  Único
                </button>
                <button onClick={() => setForm(f => ({ ...f, valueType: 'recorrente' }))}
                  className="flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all"
                  style={{ background: form.valueType === 'recorrente' ? '#be29ec' : '#f2f4fb', color: form.valueType === 'recorrente' ? '#fff' : '#8890b5', borderColor: form.valueType === 'recorrente' ? '#be29ec' : '#e0e3f0' }}>
                  /mês
                </button>
              </div>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder={form.valueType === 'recorrente' ? 'R$/mês' : 'R$'}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Temperatura</label>
              <div className="flex gap-1.5">
                {Object.entries(QUALITY_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => setForm(f => ({ ...f, quality: f.quality === key ? null : key }))}
                    title={cfg.label}
                    className="flex-1 py-2.5 rounded-xl text-sm border transition-all"
                    style={{
                      backgroundColor: form.quality === key ? cfg.color + '22' : 'transparent',
                      borderColor:     form.quality === key ? cfg.color + '70' : '#e0e3f0',
                    }}>
                    {cfg.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Origem</label>
            <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Pipeline */}
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

          {/* Assignee */}
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

          {/* Tags */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Tags</label>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: '#be29ec15', color: '#be29ec' }}>
                    {t}
                    <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Ex: e-commerce, urgente... (Enter para adicionar)"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted" />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all disabled:opacity-40"
            style={{ background: '#6eda2c', boxShadow: form.name.trim() ? '0 4px 16px #6eda2c30' : 'none' }}>
            Criar Oportunidade
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Pipeline Editor Modal ────────────────────────────────── */
function PipelineEditorModal({ pipelines, stages, activePipelineId, onClose, onSave }) {
  const [localPipelines, setLocalPipelines] = useState(pipelines)
  const [localStages,    setLocalStages]    = useState(stages)
  const [editId,         setEditId]         = useState(activePipelineId)
  const [newPipeName,    setNewPipeName]    = useState('')
  const [newStageName,   setNewStageName]   = useState('')
  const [newStageColor,  setNewStageColor]  = useState('#8890b5')
  const [showColorFor,   setShowColorFor]   = useState(null)

  const editableStages = localStages.filter(s => s.pipelineId === editId)

  function addPipeline() {
    if (!newPipeName.trim()) return
    const id = Math.max(0, ...localPipelines.map(p => p.id)) + 1
    setLocalPipelines(prev => [...prev, { id, name: newPipeName }])
    setEditId(id)
    setNewPipeName('')
  }

  function deletePipeline(id) {
    if (localPipelines.length <= 1) return
    const next = localPipelines.find(p => p.id !== id)
    setLocalPipelines(prev => prev.filter(p => p.id !== id))
    setLocalStages(prev => prev.filter(s => s.pipelineId !== id))
    if (editId === id) setEditId(next?.id)
  }

  function addStage() {
    if (!newStageName.trim()) return
    const id = newStageName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
    setLocalStages(prev => [...prev, { id, label: newStageName, color: newStageColor, pipelineId: editId }])
    setNewStageName('')
  }

  function deleteStage(id) { setLocalStages(prev => prev.filter(s => s.id !== id)) }

  function updateStageLabel(id, label) { setLocalStages(prev => prev.map(s => s.id === id ? { ...s, label } : s)) }

  function setStageColor(id, color) {
    setLocalStages(prev => prev.map(s => s.id === id ? { ...s, color } : s))
    setShowColorFor(null)
  }

  function moveStage(idx, dir) {
    const arr = [...editableStages]
    const [item] = arr.splice(idx, 1)
    arr.splice(idx + dir, 0, item)
    setLocalStages(prev => [...prev.filter(s => s.pipelineId !== editId), ...arr])
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
        className="relative bg-white rounded-2xl w-full max-w-xl max-h-[88vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <p className="text-base font-extrabold text-text">Editar Pipeline</p>
            <p className="text-xs text-muted mt-0.5">Gerencie funis e etapas</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pipelines list */}
          <div>
            <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-3">Funis</p>
            <div className="space-y-1.5 mb-3">
              {localPipelines.map(p => (
                <div key={p.id} onClick={() => setEditId(p.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    editId === p.id ? 'bg-accent/8 border-accent/30' : 'border-border hover:bg-surface-2'
                  }`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: editId === p.id ? '#6eda2c' : '#8890b5' }} />
                  <p className={`text-sm font-bold flex-1 ${editId === p.id ? 'text-accent' : 'text-text-2'}`}>{p.name}</p>
                  <span className="text-[10px] text-muted">{localStages.filter(s => s.pipelineId === p.id).length} etapas</span>
                  {localPipelines.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); deletePipeline(p.id) }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newPipeName} onChange={e => setNewPipeName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPipeline()}
                placeholder="Nome do novo funil..."
                className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted" />
              <button onClick={addPipeline} disabled={!newPipeName.trim()}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#0f1117] disabled:opacity-40 transition-all"
                style={{ background: '#6eda2c' }}>
                Criar
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Stages for selected pipeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest">
                Etapas — {localPipelines.find(p => p.id === editId)?.name}
              </p>
              <span className="text-[10px] text-muted">{editableStages.length} etapas</span>
            </div>

            <div className="space-y-1.5 mb-3">
              <AnimatePresence>
                {editableStages.map((stage, idx) => (
                  <motion.div key={stage.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  >
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface-2 group">
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => idx > 0 && moveStage(idx, -1)} disabled={idx === 0}
                          className="text-muted hover:text-text-2 disabled:opacity-25 transition-colors">
                          <ChevronDown size={11} className="rotate-180" />
                        </button>
                        <button onClick={() => idx < editableStages.length - 1 && moveStage(idx, 1)} disabled={idx === editableStages.length - 1}
                          className="text-muted hover:text-text-2 disabled:opacity-25 transition-colors">
                          <ChevronDown size={11} />
                        </button>
                      </div>
                      {/* Color dot */}
                      <button onClick={() => setShowColorFor(showColorFor === stage.id ? null : stage.id)}
                        className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: stage.color }} />
                      {/* Label */}
                      <input value={stage.label} onChange={e => updateStageLabel(stage.id, e.target.value)}
                        className="flex-1 bg-transparent text-sm font-semibold text-text focus:outline-none min-w-0" />
                      {/* Delete */}
                      <button onClick={() => deleteStage(stage.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all">
                        <Trash2 size={11} />
                      </button>
                    </div>
                    {/* Inline color picker */}
                    <AnimatePresence>
                      {showColorFor === stage.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-1.5 px-3 py-2.5 bg-surface-2 border-x border-b border-border rounded-b-xl -mt-1 overflow-hidden">
                          {PRESET_COLORS.map(c => (
                            <button key={c} onClick={() => setStageColor(stage.id, c)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110 flex-shrink-0"
                              style={{ backgroundColor: c }}>
                              {stage.color === c && <Check size={10} className="text-white" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add stage row */}
            <div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setShowColorFor(showColorFor === 'new' ? null : 'new')}
                  className="w-9 h-9 rounded-xl border border-border flex-shrink-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: newStageColor }} />
                <input value={newStageName} onChange={e => setNewStageName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStage()}
                  placeholder="Nome da nova etapa..."
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors placeholder:text-muted" />
                <button onClick={addStage} disabled={!newStageName.trim()}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-[#0f1117] disabled:opacity-40 transition-all"
                  style={{ background: '#6eda2c' }}>
                  <Plus size={12} /> Etapa
                </button>
              </div>
              <AnimatePresence>
                {showColorFor === 'new' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5 px-2 py-2.5 mt-1.5 bg-surface-2 border border-border rounded-xl overflow-hidden">
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => { setNewStageColor(c); setShowColorFor(null) }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}>
                        {newStageColor === c && <Check size={10} className="text-white" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave(localPipelines, localStages); onClose() }}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 16px #6eda2c30' }}>
            Salvar configurações
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Funnel View ──────────────────────────────────────────── */
function FunnelView({ leads, stages, onSelectStage, selectedStage }) {
  const maxCount = Math.max(...stages.map(s => leads.filter(l => l.stage === s.id).length), 1)
  const totalLeads = leads.length
  return (
    <div className="bg-white border border-border rounded-xl p-6 mb-6 card-shadow">
      <div className="flex items-center gap-2 mb-5">
        <TrendingDown size={16} className="text-accent" />
        <h2 className="text-sm font-bold text-text">Funil de Vendas</h2>
        <span className="ml-auto text-xs text-muted">{leads.length} leads totais</span>
      </div>
      <div className="flex flex-col gap-1.5 items-center">
        {stages.map((stage, i) => {
          const count    = leads.filter(l => l.stage === stage.id).length
          const value    = leads.filter(l => l.stage === stage.id).reduce((s, l) => s + l.value, 0)
          const prev     = i > 0 ? leads.filter(l => l.stage === stages[i - 1].id).length : count
          const conv     = prev > 0 ? Math.round((count / prev) * 100) : 100
          const pctTotal = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
          const width    = 40 + (count / maxCount) * 60
          const isSel    = selectedStage === stage.id
          return (
            <motion.div key={stage.id}
              initial={{ opacity: 0, scaleX: 0.5 }} animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex items-center gap-4 group cursor-pointer"
              onClick={() => onSelectStage(isSel ? null : stage.id)}
            >
              <div className="w-36 text-right flex-shrink-0">
                <p className="text-xs font-semibold text-text-2 group-hover:text-text transition-colors truncate">{stage.label}</p>
                <p className="text-[10px] text-muted">
                  {pctTotal}% do total{i > 0 && <> · <span style={{ color: stage.color }}>{conv}% conv.</span></>}
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.div className="relative h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all overflow-hidden"
                  style={{ width: `${width}%`, backgroundColor: isSel ? stage.color + '30' : stage.color + '18', border: `1px solid ${isSel ? stage.color + '80' : stage.color + '30'}` }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 shimmer" />
                  <div className="relative flex items-center gap-2 px-4">
                    <span className="text-sm font-bold" style={{ color: stage.color }}>{count}</span>
                    <span className="text-xs text-text-2">leads</span>
                    {value > 0 && <span className="text-xs font-semibold" style={{ color: stage.color }}>· {fmt(value)}</span>}
                  </div>
                </motion.div>
              </div>
              <div className="w-16 flex-shrink-0">
                {count > 0 && (
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: stage.color }}
                      initial={{ width: 0 }} animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.6 }} />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ── GTM View — Land & Expand ─────────────────────────────── */
function HourglassView({ leads, stages, pipelines }) {
  const landPipeline   = pipelines.find(p => /aquisi/i.test(p.name)) || pipelines[0]
  const expandPipeline = pipelines.find(p => /reten/i.test(p.name))  || pipelines[1] || pipelines[0]

  const landStages   = stages.filter(s => s.pipelineId === landPipeline?.id)
  const expandStages = stages.filter(s => s.pipelineId === expandPipeline?.id)
  const landLeads    = leads.filter(l => l.pipelineId === landPipeline?.id)
  const expandLeads  = leads.filter(l => l.pipelineId === expandPipeline?.id)

  const landValue   = landLeads.reduce((s, l) => s + (l.value || 0), 0)
  const expandValue = expandLeads.reduce((s, l) => s + (l.value || 0), 0)
  const totalValue  = landValue + expandValue

  const landFirst  = landStages[0]   ? landLeads.filter(l => l.stage === landStages[0].id).length   : 0
  const landLast   = landStages.slice(-1)[0] ? landLeads.filter(l => l.stage === landStages.slice(-1)[0].id).length : 0
  const landConv   = landFirst > 0 ? Math.round((landLast / landFirst) * 100) : 0

  const expandFirst = expandStages[0] ? expandLeads.filter(l => l.stage === expandStages[0].id).length : 0
  const expandLast  = expandStages.slice(-1)[0] ? expandLeads.filter(l => l.stage === expandStages.slice(-1)[0].id).length : 0
  const expandConv  = expandFirst > 0 ? Math.round((expandLast / expandFirst) * 100) : 0

  // Insight: maior gargalo (maior queda de conversão)
  function getBiggestDrop(stgs, lds) {
    let worst = null, worstDrop = 0
    stgs.forEach((s, i) => {
      if (i === 0) return
      const cur  = lds.filter(l => l.stage === s.id).length
      const prev = lds.filter(l => l.stage === stgs[i-1].id).length
      if (prev > 0) {
        const drop = 100 - Math.round((cur / prev) * 100)
        if (drop > worstDrop) { worstDrop = drop; worst = { stage: s.label, drop } }
      }
    })
    return worst
  }
  const landDrop   = getBiggestDrop(landStages, landLeads)
  const expandDrop = getBiggestDrop(expandStages, expandLeads)

  function TrackBar({ stage, count, total, prev, idx, color }) {
    const maxW = Math.max(total, 1)
    const pct  = Math.round((count / maxW) * 100)
    const conv = prev != null && prev > 0 ? Math.round((count / prev) * 100) : null
    const isAlert = conv !== null && conv < 50
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.3 }}
        className="flex items-center gap-3 group"
      >
        <div className="w-28 flex-shrink-0 text-right">
          <p className="text-[11px] font-semibold text-text-2 truncate">{stage.label}</p>
          {conv !== null && (
            <p className="text-[9px] font-bold" style={{ color: isAlert ? '#ef4444' : '#8890b5' }}>
              {isAlert ? '⚠ ' : ''}{conv}% conv.
            </p>
          )}
        </div>
        <div className="flex-1 relative h-8">
          <div className="absolute inset-y-0 left-0 right-0 rounded-lg" style={{ background: color + '10' }} />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-end pr-2"
            style={{ background: `linear-gradient(90deg, ${color}30, ${color}55)`, border: `1px solid ${color}40` }}
            initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 8)}%` }}
            transition={{ delay: idx * 0.05 + 0.2, duration: 0.6, ease: [0.22,1,0.36,1] }}
          />
          <div className="absolute inset-0 flex items-center px-3 gap-2">
            <span className="text-xs font-extrabold relative z-10" style={{ color }}>{count}</span>
            <span className="text-[10px] text-text-2 relative z-10">leads</span>
            {stage.color && count > 0 && (
              <span className="text-[10px] font-semibold relative z-10" style={{ color: '#8890b5' }}>
                · {pct}%
              </span>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 mb-6">

      {/* ── Header KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pipeline total',      value: fmt(totalValue),            color: '#6eda2c', icon: '💰' },
          { label: 'Taxa Land',           value: `${landConv}%`,             color: '#60a5fa', icon: '🎯' },
          { label: 'Taxa Expand',         value: `${expandConv}%`,           color: '#be29ec', icon: '🚀' },
          { label: 'Leads ativos',        value: leads.length,               color: '#ea8a29', icon: '👥' },
        ].map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.05)' }}>
            <span className="text-lg">{k.icon}</span>
            <div>
              <p className="text-base font-extrabold" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">{k.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Duas trilhas lado a lado ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LAND — Aquisição */}
        <div className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <p className="text-xs font-extrabold text-text">🎯 LAND — Aquisição</p>
            <span className="ml-auto text-[10px] font-bold text-muted">{landLeads.length} leads · {fmt(landValue)}</span>
          </div>
          <p className="text-[9px] text-muted mb-4 uppercase tracking-wider">Conquistar novos clientes</p>
          <div className="space-y-2">
            {landStages.map((s, i) => (
              <TrackBar key={s.id} stage={s} idx={i} color="#60a5fa"
                count={landLeads.filter(l => l.stage === s.id).length}
                total={landFirst}
                prev={i > 0 ? landLeads.filter(l => l.stage === landStages[i-1].id).length : null} />
            ))}
          </div>
          {landDrop && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
              <span className="text-sm">⚠️</span>
              <p className="text-[10px] font-bold text-red-500">
                Gargalo: <span className="font-extrabold">{landDrop.stage}</span> — perde {landDrop.drop}% dos leads
              </p>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <p className="text-[10px] text-muted">Conversão total</p>
            <p className="text-sm font-extrabold" style={{ color: landConv >= 20 ? '#6eda2c' : landConv >= 10 ? '#ea8a29' : '#ef4444' }}>
              {landConv}%
            </p>
          </div>
        </div>

        {/* EXPAND — Retenção */}
        <div className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(190,41,236,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#be29ec' }} />
            <p className="text-xs font-extrabold text-text">🚀 EXPAND — Retenção</p>
            <span className="ml-auto text-[10px] font-bold text-muted">{expandLeads.length} leads · {fmt(expandValue)}</span>
          </div>
          <p className="text-[9px] text-muted mb-4 uppercase tracking-wider">Crescer dentro dos clientes ativos</p>
          <div className="space-y-2">
            {expandStages.map((s, i) => (
              <TrackBar key={s.id} stage={s} idx={i} color="#be29ec"
                count={expandLeads.filter(l => l.stage === s.id).length}
                total={expandFirst}
                prev={i > 0 ? expandLeads.filter(l => l.stage === expandStages[i-1].id).length : null} />
            ))}
          </div>
          {expandDrop && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
              <span className="text-sm">⚠️</span>
              <p className="text-[10px] font-bold text-red-500">
                Gargalo: <span className="font-extrabold">{expandDrop.stage}</span> — perde {expandDrop.drop}% dos leads
              </p>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <p className="text-[10px] text-muted">Conversão total</p>
            <p className="text-sm font-extrabold" style={{ color: expandConv >= 20 ? '#6eda2c' : expandConv >= 10 ? '#ea8a29' : '#ef4444' }}>
              {expandConv}%
            </p>
          </div>
        </div>
      </div>

      {/* ── Insights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: '💡', label: 'Oportunidade Land',
            value: landLeads.filter(l => {
              const s = landStages.find(st => st.id === l.stage)
              return s && landStages.indexOf(s) >= Math.floor(landStages.length / 2)
            }).length + ' leads no fundo',
            sub: `${fmt(landLeads.filter(l => { const s = landStages.find(st => st.id === l.stage); return s && landStages.indexOf(s) >= Math.floor(landStages.length/2) }).reduce((s,l) => s+(l.value||0), 0))} em jogo`,
            color: '#60a5fa',
          },
          {
            icon: '🔄', label: 'Oportunidade Expand',
            value: expandLeads.filter(l => {
              const s = expandStages.find(st => st.id === l.stage)
              return s && expandStages.indexOf(s) >= Math.floor(expandStages.length / 2)
            }).length + ' para expandir',
            sub: `${fmt(expandLeads.filter(l => { const s = expandStages.find(st => st.id === l.stage); return s && expandStages.indexOf(s) >= Math.floor(expandStages.length/2) }).reduce((s,l) => s+(l.value||0), 0))} em jogo`,
            color: '#be29ec',
          },
          {
            icon: '📊', label: 'Saúde do Pipeline',
            value: totalValue > 0 ? fmt(totalValue) + ' total' : 'Pipeline vazio',
            sub: `Land ${landConv}% · Expand ${expandConv}% conversão`,
            color: totalValue > 0 ? '#6eda2c' : '#8890b5',
          },
        ].map((ins, i) => (
          <motion.div key={ins.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="bg-white rounded-xl px-4 py-3"
            style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)', border: `1px solid ${ins.color}25` }}>
            <div className="flex items-center gap-2 mb-1">
              <span>{ins.icon}</span>
              <p className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: ins.color }}>{ins.label}</p>
            </div>
            <p className="text-sm font-extrabold text-text">{ins.value}</p>
            <p className="text-[10px] text-muted mt-0.5">{ins.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Lead Card ────────────────────────────────────────────── */
function LeadCard({ lead, isSelected, onToggleSelect, selectionMode }) {
  const navigate = useNavigate()
  const src     = sourceColors[lead.source] || 'bg-muted/10 text-muted'
  const value   = lead.value ? fmt(lead.value) + (lead.valueType === 'recorrente' ? '/mês' : '') : null
  const quality = lead.quality ? QUALITY_CONFIG[lead.quality] : null

  return (
    <motion.div
      className={`bg-white border rounded-xl p-3.5 cursor-grab select-none transition-all card-shadow ${
        isSelected ? 'border-accent/40 bg-accent/[0.03] ring-1 ring-accent/20'
        : 'border-border hover:border-accent/30 hover:shadow-md'
      }`}
      whileHover={{ y: -1 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Checkbox — visível em selection mode ou hover */}
          <button
            onClick={e => { e.stopPropagation(); onToggleSelect(lead.id) }}
            className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
              selectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              backgroundColor: isSelected ? '#6eda2c' : 'transparent',
              borderColor:     isSelected ? '#6eda2c' : '#d0d4e8',
            }}
          >
            {isSelected && <Check size={9} className="text-white" strokeWidth={3} />}
          </button>
          <div className="relative w-6 h-6 flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
              {lead.name[0]}
            </div>
            {quality && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                style={{ backgroundColor: quality.color }} />
            )}
          </div>
          <p className="text-sm font-semibold text-text leading-snug truncate">{lead.name}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); navigate(`/contatos/${lead.id}`) }} className="text-muted hover:text-text-2 flex-shrink-0 transition-colors" title="Ver perfil">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Source + Value */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${src}`}>{lead.source}</span>
        {value && <span className="text-[11px] text-accent font-bold ml-auto">{value}</span>}
      </div>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {lead.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#be29ec12', color: '#be29ec' }}>
              {t}
            </span>
          ))}
          {lead.tags.length > 2 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#8890b512', color: '#8890b5' }}>
              +{lead.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-0.5">
          {[
            { Icon: Phone,         title: 'Ligar',        fn: () => { window.location.href = `tel:+55${lead.phone?.replace(/\D/g,'')}` } },
            { Icon: MessageSquare, title: 'WhatsApp',     fn: () => { window.open(`https://wa.me/55${lead.phone?.replace(/\D/g,'')}`, '_blank') } },
            { Icon: Calendar,      title: 'Calendário',   fn: () => { navigate('/calendario') } },
            { Icon: Tag,           title: 'Ver contato',  fn: () => { navigate(`/contatos/${lead.id}`) } },
          ].map(({ Icon, title, fn }, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); fn() }} title={title}
              className="w-6 h-6 rounded-md flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
              <Icon size={11} />
            </button>
          ))}
        </div>
        <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[9px] font-bold text-accent">
          {lead.assignee}
        </div>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ stage, leads, onCardClick, onAddLead, selected, onToggleSelect, selectionMode, isDragOver, onDragOver, onDragLeave, onDrop, dragRef }) {
  const value = leads.reduce((s, l) => s + l.value, 0)
  return (
    <div className="flex flex-col w-[calc(100vw-48px)] sm:w-60 flex-shrink-0 snap-start">
      <div className="flex items-center gap-2 mb-2 px-0.5">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
        <span className="text-xs font-bold text-text-2 flex-1 truncate">{stage.label}</span>
        <span className="text-[11px] text-muted bg-surface-2 px-1.5 py-0.5 rounded-md font-semibold">{leads.length}</span>
      </div>
      {value > 0 && <p className="text-xs text-accent px-0.5 -mt-0.5 mb-2 font-semibold">{fmt(value)}</p>}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col gap-2 min-h-[60px] rounded-xl p-1 transition-all ${
          isDragOver ? 'bg-accent/5 border-2 border-dashed border-accent/40' : 'border-2 border-transparent'
        }`}
      >
        <AnimatePresence>
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              className="group"
              draggable
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onCardClick(lead)}
              onDragStart={() => { dragRef.current = lead.id }}
              onDragEnd={() => { dragRef.current = null }}
            >
              <LeadCard
                lead={lead}
                isSelected={selected.has(lead.id)}
                onToggleSelect={onToggleSelect}
                selectionMode={selectionMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button onClick={() => onAddLead(stage.id)}
        className="mt-2 flex items-center gap-1.5 text-xs text-muted hover:text-accent hover:bg-accent/5 rounded-lg px-2 py-2 transition-colors w-full border border-transparent hover:border-accent/20">
        <Plus size={12} /> Adicionar lead
      </button>
    </div>
  )
}

/* ── Pipeline Page ────────────────────────────────────────── */
export default function Pipeline() {
  const { leads: initialLeads, stages: initialStages, pipelines: initialPipelines, updateLead, addLead, deleteLead, deleteLeads, savePipelineConfig } = useData()
  const [leads,           setLeads]           = useState([])
  const [localPipelines,  setLocalPipelines]  = useState([])
  const [localStages,     setLocalStages]     = useState([])
  useEffect(() => { if (initialLeads.length)     setLeads(initialLeads)           }, [initialLeads])
  useEffect(() => { if (initialPipelines.length) setLocalPipelines(initialPipelines) }, [initialPipelines])
  useEffect(() => { if (initialStages.length)    setLocalStages(initialStages)    }, [initialStages])
  const dragRef         = useRef(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [selectedLead,    setSelectedLead]    = useState(null)
  const [newLeadStage,    setNewLeadStage]    = useState(null)
  const [search,          setSearch]          = useState('')
  const [activePipeline,  setActivePipeline]  = useState(null)
  const [view,            setView]            = useState('kanban')
  useEffect(() => {
    if (activePipeline === null && initialPipelines.length) {
      setActivePipeline(initialPipelines[0].id)
    }
  }, [initialPipelines, activePipeline])
  const [selectedStage,   setSelectedStage]   = useState(null)
  const [showNewLead,     setShowNewLead]     = useState(false)
  const [showEditPipeline,setShowEditPipeline]= useState(false)
  const [selected,        setSelected]        = useState(new Set())
  const [confirmDeleteLead, setConfirmDeleteLead] = useState(null)
  const pipelineStages = localStages.filter(s => s.pipelineId === activePipeline)
  const filtered      = leads.filter(l =>
    l.pipelineId === activePipeline &&
    (search === '' || l.name.toLowerCase().includes(search.toLowerCase())) &&
    (selectedStage === null || l.stage === selectedStage)
  )
  const totalValue = leads.filter(l => l.pipelineId === activePipeline).reduce((s, l) => s + l.value, 0)

  function handleDrop(stageId) {
    const id = dragRef.current
    if (!id) { setDragOverStage(null); return }
    const dragged = leads.find(l => l.id === id)
    if (dragged && dragged.stage !== stageId) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: stageId } : l))
      updateLead(id, { stage: stageId, pipelineId: dragged.pipelineId })
    }
    setDragOverStage(null)
  }

  function handleCardClick(lead) { setSelectedLead(lead) }

  function handleOpenNewLead(stageId = null) {
    setNewLeadStage(stageId)
    setShowNewLead(true)
  }

  function handleSaveLead(updated) {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
    updateLead(updated.id, updated)
  }

  async function handleCreateLead(newLead) {
    await addLead(newLead)
  }

  function handleSavePipeline(newPipelines, newStages) {
    setLocalPipelines(newPipelines)
    setLocalStages(newStages)
    savePipelineConfig(newPipelines, newStages)
    if (!newPipelines.find(p => p.id === activePipeline)) {
      setActivePipeline(newPipelines[0]?.id)
    }
  }

  function switchPipeline(id) {
    setActivePipeline(id)
    setSelectedStage(null)
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleDeleteLead(id) {
    setConfirmDeleteLead(null)
    setSelectedLead(null)
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
    setLeads(prev => prev.filter(l => l.id !== id))
    await deleteLead(id)
  }

  async function handleDeleteSelected() {
    const ids = [...selected]
    setConfirmDeleteLead(null)
    setSelected(new Set())
    setLeads(prev => prev.filter(l => !selected.has(l.id)))
    await deleteLeads(ids)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="px-4 lg:px-8 py-3 lg:py-5 border-b border-border flex-shrink-0 bg-surface">

        {/* Linha 1: título + ações */}
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-text">Pipeline</h1>
            <p className="text-xs text-muted font-medium truncate">
              {leads.filter(l => l.pipelineId === activePipeline).length} leads ·{' '}
              <span className="text-accent font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValue)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0 ml-2">
            {/* View toggle — ícones no mobile, labels no desktop */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
              {[
                { key: 'funnel',    icon: TrendingDown, label: 'Funil'     },
                { key: 'hourglass', icon: Hourglass,    label: 'Ampulheta' },
                { key: 'kanban',    icon: LayoutGrid,   label: 'Kanban'    },
              ].map(v => (
                <button key={v.key} onClick={() => { setView(v.key); setSelectedStage(null) }}
                  className={`flex items-center gap-1 px-2 lg:px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[32px] ${
                    view === v.key ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2'
                  }`}>
                  <v.icon size={13} />
                  <span className="hidden lg:inline">{v.label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setShowEditPipeline(true)}
              className="w-8 h-8 lg:auto lg:flex lg:items-center lg:gap-1.5 lg:text-sm lg:px-3 lg:py-2 flex items-center justify-center rounded-lg text-text-2 bg-surface border border-border hover:border-accent/30 hover:text-accent transition-colors font-semibold"
              title="Editar pipeline">
              <Settings2 size={14} />
              <span className="hidden lg:inline text-sm">Editar</span>
            </button>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenNewLead()}
              className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-2.5 lg:px-3 py-2 rounded-lg transition-all min-h-[36px]">
              <Plus size={14} /> <span>Novo</span><span className="hidden sm:inline"> lead</span>
            </motion.button>
          </div>
        </div>

        {/* Linha 2: busca + pipeline tabs */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar leads..."
              className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors" />
          </div>

          {/* Pipeline tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-shrink-0 max-w-[50%]">
            {localPipelines.map(p => (
              <button key={p.id} onClick={() => switchPipeline(p.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex-shrink-0 min-h-[32px] ${
                  p.id === activePipeline
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-muted hover:text-text-2'
                }`}>
                {p.name}
              </button>
            ))}
            <button onClick={() => setShowEditPipeline(true)}
              title="Criar novo pipeline"
              className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent/5 border border-transparent hover:border-accent/20 transition-colors">
              <Plus size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 lg:p-6">
        <AnimatePresence mode="wait">
          {view === 'funnel' && (
            <motion.div key="funnel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <FunnelView
                leads={leads.filter(l => l.pipelineId === activePipeline)}
                stages={pipelineStages}
                onSelectStage={setSelectedStage}
                selectedStage={selectedStage}
              />
              {selectedStage && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                  <p className="text-xs text-muted font-semibold mb-3 uppercase tracking-wide">
                    {pipelineStages.find(s => s.id === selectedStage)?.label} · {filtered.length} leads
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((lead, i) => (
                      <motion.div key={lead.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        onClick={() => handleCardClick(lead)}>
                        <LeadCard lead={lead} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === 'hourglass' && (
            <motion.div key="hourglass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <HourglassView leads={leads} stages={localStages} pipelines={localPipelines} />
            </motion.div>
          )}

          {view === 'kanban' && (
            <motion.div key={`kanban-${activePipeline}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <div className="flex gap-3 lg:gap-5 pb-6 snap-x snap-mandatory overflow-x-auto sm:overflow-x-visible">
                {pipelineStages.map(stage => (
                  <KanbanColumn
                    key={stage.id}
                    stage={stage}
                    leads={filtered.filter(l => l.stage === stage.id)}
                    onCardClick={handleCardClick}
                    onAddLead={handleOpenNewLead}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                    selectionMode={selected.size > 0}
                    isDragOver={dragOverStage === stage.id}
                    onDragOver={e => { e.preventDefault(); setDragOverStage(stage.id) }}
                    onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverStage(null) }}
                    onDrop={() => handleDrop(stage.id)}
                    dragRef={dragRef}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal
            key="lead-detail"
            lead={selectedLead}
            stages={pipelineStages}
            onClose={() => setSelectedLead(null)}
            onSave={handleSaveLead}
            onDelete={id => setConfirmDeleteLead(id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewLead && (
          <NewLeadModal
            key="new-lead"
            pipelines={localPipelines}
            stages={localStages}
            activePipelineId={activePipeline}
            defaultStageId={newLeadStage}
            onClose={() => { setShowNewLead(false); setNewLeadStage(null) }}
            onCreate={handleCreateLead}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditPipeline && (
          <PipelineEditorModal
            key="edit-pipeline"
            pipelines={localPipelines}
            stages={localStages}
            activePipelineId={activePipeline}
            onClose={() => setShowEditPipeline(false)}
            onSave={handleSavePipeline}
          />
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selected.size > 0 && (
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
              {selected.size} {selected.size === 1 ? 'lead selecionado' : 'leads selecionados'}
            </span>
            <button onClick={() => setSelected(new Set())}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors">
              Cancelar
            </button>
            <button onClick={() => setConfirmDeleteLead('bulk')}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors">
              <Trash2 size={12} /> Excluir {selected.size}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDeleteLead !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDeleteLead(null)} />
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
                {confirmDeleteLead === 'bulk'
                  ? `Excluir ${selected.size} ${selected.size === 1 ? 'lead' : 'leads'}?`
                  : 'Excluir lead?'}
              </p>
              <p className="text-sm text-muted mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteLead(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteLead === 'bulk' ? handleDeleteSelected : () => handleDeleteLead(confirmDeleteLead)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white bg-danger hover:bg-danger/90 transition-colors">
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
