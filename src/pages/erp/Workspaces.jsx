import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronRight, AlertTriangle, CheckCircle2, Clock, X, Trash2 } from 'lucide-react'
import { taskTypes, erpClients as mockClients } from '../../data/erp-mock'
import { getUsers, saveUsers, makeAvatar, AVATAR_COLORS } from '../../data/users-store'
import { useData } from '../../contexts/DataContext'
import UserAvatar from '../../components/UserAvatar'

const NICHES = ['Alimentação', 'Advocacia', 'Combustível', 'Cooperativa', 'E-commerce', 'Educação', 'Imobiliário', 'Moda', 'Saúde', 'Software', 'Turismo', 'Outro']

/* ── Modal Novo Cliente ───────────────────────────── */
function NewClientModal({ onClose, onCreate, collaborators }) {
  const [form, setForm] = useState({
    name: '', niche: 'E-commerce', monthlyValue: 0,
    manager: 'gs', color: AVATAR_COLORS[0],
    email: '', password: '123456',
    clientType: 'recorrente',
  })

  function handleSubmit() {
    if (!form.name.trim()) return
    const id = form.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    const newClient = {
      id, name: form.name.trim(),
      color: form.color, manager: form.manager,
      status: 'active', since: new Date().toISOString().split('T')[0],
      monthlyValue: Number(form.monthlyValue),
      niche: form.niche,
      clientType: form.clientType,
    }
    if (form.email.trim()) {
      const portalUser = {
        id: id + '_c',
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'cliente',
        clientId: id,
        avatar: makeAvatar(form.name),
        color: form.color,
        createdAt: new Date().toISOString().split('T')[0],
      }
      const { team, clients } = getUsers()
      saveUsers({ team, clients: [...clients, portalUser] })
    }
    onCreate(newClient)
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
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-base font-extrabold text-text">Novo Cliente</p>
            <p className="text-xs text-muted mt-0.5">Cria workspace + acesso ao portal</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Nome + Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0 transition-all"
              style={{ background: `linear-gradient(135deg, ${form.color}, ${form.color}99)` }}>
              {form.name ? makeAvatar(form.name) : '?'}
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome do cliente *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Empresa Ltda" autoFocus
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>

          {/* Tipo de cliente */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Tipo de cliente</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: 'recorrente',       label: 'Assessoria',      desc: 'Gestão de tráfego recorrente', icon: '🔄' },
                { key: 'destrava_digital', label: 'Destrava Digital', desc: 'Projeto avulso / consultoria',  icon: '⚡' },
                { key: 'sites',            label: 'Sites',           desc: 'Criação de site / landing page', icon: '🌐' },
              ].map(t => (
                <button key={t.key} onClick={() => setForm(f => ({ ...f, clientType: t.key }))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all"
                  style={{
                    backgroundColor: form.clientType === t.key ? '#6eda2c10' : 'transparent',
                    borderColor:     form.clientType === t.key ? '#6eda2c60' : '#e0e3f0',
                  }}>
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <p className="text-xs font-extrabold text-text">{t.label}</p>
                    <p className="text-[10px] text-muted">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nicho + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nicho</label>
              <select value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                {NICHES.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                {form.clientType === 'recorrente' ? 'Mensalidade (R$)' : 'Valor do projeto (R$)'}
              </label>
              <input type="number" min="0" value={form.monthlyValue}
                onChange={e => setForm(f => ({ ...f, monthlyValue: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>

          {/* Gestor responsável */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Gestor responsável</label>
            <div className="flex gap-1.5 flex-wrap">
              {collaborators.map(c => (
                <button key={c.id} onClick={() => setForm(f => ({ ...f, manager: c.id }))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all"
                  style={{
                    backgroundColor: form.manager === c.id ? c.color + '18' : 'transparent',
                    borderColor:     form.manager === c.id ? c.color + '60' : '#e0e3f0',
                    color:           form.manager === c.id ? c.color         : '#8890b5',
                  }}>
                  <UserAvatar user={c} size={20} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Cor do workspace</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: form.color === c ? '#fff' : c,
                    boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                    transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>

          {/* Acesso portal */}
          <div className="p-4 rounded-xl" style={{ background: '#be29ec0a', border: '1px solid #be29ec20' }}>
            <p className="text-[10px] font-extrabold text-purple uppercase tracking-wider mb-0.5">Acesso ao portal cliente</p>
            <p className="text-[10px] text-muted mb-3">Opcional — pode ser configurado depois</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">E-mail de acesso</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="cliente@empresa.com" type="email"
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              {form.email.trim() && (
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Senha inicial</label>
                  <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Senha"
                    className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              )}
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
            {form.email.trim() ? 'Criar cliente + portal' : 'Criar workspace'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Modal Confirmar Exclusão ─────────────────────── */
function DeleteConfirmModal({ client, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-sm p-6"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#ef44440f' }}>
            <Trash2 size={18} color="#ef4444" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-text">Excluir workspace?</p>
            <p className="text-xs text-muted mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <div className="px-3 py-2.5 rounded-xl mb-5" style={{ background: '#f8f9fc', border: '1px solid #e0e3f0' }}>
          <p className="text-xs text-muted">Workspace</p>
          <p className="text-sm font-bold text-text mt-0.5">{client.name}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-colors"
            style={{ background: '#ef4444' }}>
            Excluir
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const statusBadge = {
  active:  { label: 'Ativo',    color: '#6eda2c', bg: '#6eda2c18' },
  at_risk: { label: 'Em Risco', color: '#ea8a29', bg: '#ea8a2918' },
  paused:  { label: 'Pausado',  color: '#8890b5', bg: '#8890b518' },
}

function ClientCard({ client, index, tasks, collabMap, onDelete }) {
  const navigate = useNavigate()
  const clientTasks = tasks.filter(t => t.clientId === client.id)
  const doing = clientTasks.filter(t => t.status === 'doing').length
  const todo = clientTasks.filter(t => t.status === 'todo').length
  const done = clientTasks.filter(t => t.status === 'done').length
  const total = clientTasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const manager = collabMap?.[client.manager]
  const status = statusBadge[client.status]

  const typeBreakdown = Object.entries(taskTypes).map(([key, cfg]) => ({
    key, cfg, count: clientTasks.filter(t => t.type === key).length
  })).filter(x => x.count > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      onClick={() => navigate(`/workspaces/${client.id}`)}
      className="bg-white rounded-2xl p-5 cursor-pointer group"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}99)` }}
          >
            {client.name[0]}
          </div>
          <div>
            <p className="text-sm font-extrabold text-text group-hover:text-accent transition-colors">{client.name}</p>
            <p className="text-[11px] text-muted">{client.niche}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: status.color, backgroundColor: status.bg }}
          >
            {status.label}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(client) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted font-medium">Conclusão geral</span>
          <span className="font-extrabold" style={{ color: client.color }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e3f0' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${client.color}, ${client.color}80)` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3 + index * 0.06, duration: 0.8 }}
          />
        </div>
      </div>

      {/* Contadores de status */}
      <div className="flex items-center gap-1.5 mb-4">
        {[
          { icon: Clock, count: todo,  color: '#8890b5', label: 'A fazer' },
          { icon: AlertTriangle, count: doing, color: '#60a5fa', label: 'Andando' },
          { icon: CheckCircle2, count: done,  color: '#6eda2c', label: 'Feito' },
        ].map(({ icon: Icon, count, color, label }) => (
          <div key={label} className="flex items-center gap-1 flex-1 rounded-lg px-2 py-1.5" style={{ backgroundColor: color + '12' }}>
            <Icon size={10} style={{ color }} className="flex-shrink-0" />
            <span className="text-xs font-extrabold" style={{ color }}>{count}</span>
            <span className="text-[9px] text-muted truncate hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* Tipos de entregável */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {typeBreakdown.map(({ key, cfg, count }) => (
          <span
            key={key}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ color: cfg.color, backgroundColor: cfg.color + '15' }}
          >
            {cfg.icon} {count}
          </span>
        ))}
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <UserAvatar user={manager} size={20} />
          <span className="text-[11px] text-muted">{manager?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-muted group-hover:text-accent transition-colors">
          <span className="text-[11px] font-semibold">Abrir workspace</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Workspaces() {
  const { erpClients: initialClients, tasks, collaborators, addErpClient, deleteErpClient } = useData()
  const collabMap = Object.fromEntries(collaborators.map(c => [c.id, c]))
  const [search,        setSearch]        = useState('')
  const [filter,        setFilter]        = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [clients,       setClients]       = useState(mockClients)
  const [showNewClient, setShowNewClient] = useState(false)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  useEffect(() => { if (initialClients.length) setClients(initialClients) }, [initialClients])

  function handleCreateClient(newClient) {
    setClients(prev => [...prev, newClient])
    addErpClient(newClient)
  }

  function handleDeleteClient() {
    if (!deleteTarget) return
    setClients(prev => prev.filter(c => c.id !== deleteTarget.id))
    deleteErpClient(deleteTarget.id)
    setDeleteTarget(null)
  }

  const matchesSearch = c =>
    search === '' ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.niche || '').toLowerCase().includes(search.toLowerCase())
  const matchesFilter = c => filter === 'all' || c.status === filter

  const internos = clients.filter(c =>
    (c.type === 'agencia') && matchesSearch(c)
  )
  const recorrentes = clients.filter(c =>
    (c.clientType === 'recorrente' || c.type === 'recorrencia' || (!c.clientType && !c.type)) &&
    matchesSearch(c) && matchesFilter(c)
  )
  const destrava = clients.filter(c =>
    (c.clientType === 'destrava_digital' || c.type === 'destrava_digital') &&
    matchesSearch(c) && matchesFilter(c)
  )
  const sites = clients.filter(c =>
    (c.clientType === 'sites' || c.type === 'sites') &&
    matchesSearch(c) && matchesFilter(c)
  )

  const mrr        = clients.filter(c => c.clientType === 'recorrente' || c.type === 'recorrencia').reduce((s, c) => s + (c.monthlyValue || 0), 0)
  const activeRec  = recorrentes.filter(c => c.status === 'active').length
  const atRisk     = clients.filter(c => c.status === 'at_risk').length
  const totalTasks = tasks.length
  const doneTasks  = tasks.filter(t => t.status === 'done').length

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 lg:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-text">Workspaces</h1>
            <p className="text-xs lg:text-sm text-muted mt-0.5">Central operacional dos clientes</p>
          </div>
          <button
            onClick={() => setShowNewClient(true)}
            className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-bold px-3 lg:px-4 py-2.5 rounded-xl text-[#0f1117] transition-all min-h-[44px]"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px #6eda2c40' }}
          >
            <Plus size={15} /> <span className="hidden sm:inline">Novo cliente</span><span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 lg:mt-6">
          {[
            { label: 'Recorrentes ativos', value: activeRec,      color: '#6eda2c', icon: '🔄' },
            { label: 'Em risco',           value: atRisk,         color: '#ea8a29', icon: '⚠️' },
            { label: 'Tarefas concluídas', value: `${doneTasks}/${totalTasks}`, color: '#60a5fa', icon: '📦' },
            { label: 'MRR',                value: `R$ ${(mrr/1000).toFixed(1)}k`, color: '#be29ec', icon: '💰' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-xl px-3 lg:px-4 py-3 flex items-center gap-2 lg:gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}
            >
              <span className="text-lg lg:text-xl">{m.icon}</span>
              <div className="min-w-0">
                <p className="text-sm lg:text-base font-extrabold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] lg:text-[10px] text-muted font-semibold uppercase tracking-wide truncate">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Barra de busca + filtros */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente ou nicho..."
              className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40"
              style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }} />
          </div>
          <div className="flex items-center bg-white border border-border rounded-xl p-0.5 flex-shrink-0"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
            {[{ key: 'all', label: 'Todos' }, { key: 'active', label: 'Ativos' }, { key: 'at_risk', label: 'Risco' }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f.key ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Serviço:</span>
          <div className="flex items-center bg-white border border-border rounded-xl p-0.5"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
            {[
              { key: 'all',      label: 'Todos' },
              { key: 'recorrente', label: '🔄 Assessoria' },
              { key: 'destrava', label: '⚡ Destrava' },
              { key: 'sites',    label: '🌐 Sites' },
            ].map(f => (
              <button key={f.key} onClick={() => setServiceFilter(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${serviceFilter === f.key ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Seção: Interno (Agência) ── */}
      {internos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏢</span>
            <h2 className="text-sm font-extrabold text-text">Interno</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{ background: '#6eda2c18', color: '#6eda2c' }}>{internos.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {internos.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} tasks={tasks} collabMap={collabMap} onDelete={setDeleteTarget} />
            ))}
          </div>
        </div>
      )}

      {/* ── Seção: Assessoria · Recorrente ── */}
      {(serviceFilter === 'all' || serviceFilter === 'recorrente') && <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔄</span>
          <h2 className="text-sm font-extrabold text-text">Assessoria</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#6eda2c18', color: '#6eda2c' }}>Recorrente</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent ml-1">
            {recorrentes.length}
          </span>
          <span className="text-[10px] text-muted ml-auto">
            MRR · R$ {(recorrentes.reduce((s,c)=>s+(c.monthlyValue||0),0)/1000).toFixed(1)}k
          </span>
        </div>
        {recorrentes.length === 0 ? (
          <p className="text-xs text-muted py-6 text-center">Nenhum cliente recorrente encontrado</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recorrentes.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} tasks={tasks} collabMap={collabMap} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>}

      {/* ── Seção: Destrava Digital · Avulso ── */}
      {(serviceFilter === 'all' || serviceFilter === 'destrava') && <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <h2 className="text-sm font-extrabold text-text">Destrava Digital</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f59e0b18', color: '#f59e0b' }}>Avulso</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: '#f59e0b12', color: '#f59e0b' }}>
            {destrava.length}
          </span>
          <span className="text-[10px] text-muted ml-auto">Consultoria / projeto pontual</span>
        </div>
        {destrava.length === 0 ? (
          <p className="text-xs text-muted py-6 text-center">Nenhum cliente Destrava Digital</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destrava.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} tasks={tasks} collabMap={collabMap} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>}

      {/* ── Seção: Sites · Avulso ── */}
      {(serviceFilter === 'all' || serviceFilter === 'sites') && <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌐</span>
          <h2 className="text-sm font-extrabold text-text">Sites</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#60a5fa18', color: '#60a5fa' }}>Avulso</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: '#60a5fa12', color: '#60a5fa' }}>
            {sites.length}
          </span>
          <span className="text-[10px] text-muted ml-auto">Criação de site / landing page</span>
        </div>
        {sites.length === 0 ? (
          <p className="text-xs text-muted py-6 italic text-center" style={{ color: '#8890b5' }}>Nenhum cliente Sites por enquanto</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} tasks={tasks} collabMap={collabMap} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>}

      <AnimatePresence>
        {showNewClient && (
          <NewClientModal onClose={() => setShowNewClient(false)} onCreate={handleCreateClient} collaborators={collaborators} />
        )}
        {deleteTarget && (
          <DeleteConfirmModal client={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteClient} />
        )}
      </AnimatePresence>
    </div>
  )
}
