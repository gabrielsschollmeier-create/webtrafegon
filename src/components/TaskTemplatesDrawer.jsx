import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Zap } from 'lucide-react'
import { TASK_TEMPLATES, TEMPLATE_CATEGORIES, applyTemplateDefaults } from '../data/task-templates'
import { TASK_LEVELS } from '../data/tasks-store'
import { taskTypes } from '../data/erp-mock'

export default function TaskTemplatesDrawer({ clientId, clientName, assignee, onApply, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [applying, setApplying] = useState(null)

  const filtered = activeCategory === 'all'
    ? TASK_TEMPLATES
    : TASK_TEMPLATES.filter(t => t.category === activeCategory)

  async function handleApply(template) {
    setApplying(template.id)
    const taskData = applyTemplateDefaults(template, {
      clientId,
      assignee: assignee || 'gs',
    })
    await onApply(taskData)
    setApplying(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, x: 340 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 340 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col overflow-hidden"
        style={{ boxShadow: '-8px 0 40px rgba(26,29,46,0.18)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-accent" fill="currentColor" />
              <p className="text-sm font-extrabold text-text">Modelos Rapidos</p>
            </div>
            {clientName && <p className="text-[10px] text-muted mt-0.5">{clientName}</p>}
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Category filter */}
        <div className="px-4 py-3 border-b border-border overflow-x-auto">
          <div className="flex gap-1.5 w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeCategory === 'all' ? 'bg-text text-white' : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              Todos
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap border"
                style={{
                  backgroundColor: activeCategory === cat.id ? cat.color + '20' : 'transparent',
                  borderColor: activeCategory === cat.id ? cat.color + '60' : '#e0e3f0',
                  color: activeCategory === cat.id ? cat.color : '#8890b5',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map(template => {
              const typeCfg  = taskTypes[template.type]
              const levelCfg = TASK_LEVELS[template.level]
              const isApplying = applying === template.id
              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white border border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-sm transition-all group cursor-pointer"
                  onClick={() => !isApplying && handleApply(template)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ color: typeCfg?.color, backgroundColor: typeCfg?.color + '15' }}
                        >
                          {typeCfg?.icon} {typeCfg?.label}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ color: levelCfg?.color, backgroundColor: levelCfg?.color + '15' }}
                        >
                          {levelCfg?.icon} {levelCfg?.label}
                        </span>
                        <span className="text-[10px] text-muted ml-auto">
                          +{template.diasParaPrazo}d
                        </span>
                      </div>
                      {/* Title */}
                      <p className="text-xs font-extrabold text-text leading-snug mb-1">
                        {template.label}
                      </p>
                      {/* Description */}
                      <p className="text-[10px] text-muted leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {isApplying ? (
                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent/10 text-accent opacity-0 group-hover:opacity-100 transition-all">
                          <ChevronRight size={13} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="text-3xl mb-3">📭</span>
              <p className="text-sm font-bold text-text">Nenhum modelo nesta categoria</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-border">
          <p className="text-[10px] text-muted text-center">
            Clique em um modelo para criar a tarefa com prazos automaticos
          </p>
        </div>
      </motion.div>
    </>
  )
}
