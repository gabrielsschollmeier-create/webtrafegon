import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Bell, Palette, Users, Kanban, Plus, GripVertical, Trash2, Save, Check, ChevronRight, Copy, X, Link, Mail, Clock, Loader2, Key, Eye, EyeOff } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { getUsers, getPendingInvites, revokeInvite, ROLE_CONFIG, TEAM_ROLES, makeAvatar, addTeamMember, AVATAR_COLORS, removeTeamMember, removeClient, updateUserPasswordLocal } from '../data/users-store'
import { supabase, supabaseReady, supabaseAdmin } from '../lib/supabase'

const tabs = [
  { id: 'geral',       icon: Building, label: 'Geral' },
  { id: 'pipeline',    icon: Kanban,   label: 'Pipeline' },
  { id: 'equipe',      icon: Users,    label: 'Equipe' },
  { id: 'notificacoes',icon: Bell,     label: 'Notificações' },
  { id: 'aparencia',   icon: Palette,  label: 'Aparência' },
]

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-text-2 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted mt-1">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
    />
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-all ${checked ? 'bg-accent' : 'bg-border'}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  )
}

function SaveBar({ onSave, saved, onCancel }) {
  return (
    <div className="flex items-center justify-end mt-6 pt-4 border-t border-border gap-3">
      <button onClick={onCancel} className="text-sm text-muted hover:text-text-2 font-semibold transition-colors px-3 py-2">
        Cancelar
      </button>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={onSave}
        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${
          saved ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-accent hover:bg-accent-hover text-[#15172a]'
        }`}
      >
        {saved ? <><Check size={14} /> Salvo!</> : <><Save size={14} /> Salvar alterações</>}
      </motion.button>
    </div>
  )
}

/* ── Tabs content ─── */
const GERAL_KEY = 'trafegon_config_geral'
const INITIAL_GERAL = { empresa: 'TráfegOn', site: 'https://trafegon.com.br', email: 'contato@trafegon.com.br', fone: '+55 47 9 9999-0000', timezone: 'America/Sao_Paulo' }
const DEFAULT_LOGO = 'https://trafegon.com.br/wp-content/uploads/2024/10/logo-trafegon-com-slogan-5-300x134.webp'

function loadGeral() {
  try { return { ...INITIAL_GERAL, ...JSON.parse(localStorage.getItem(GERAL_KEY) || '{}') } } catch { return INITIAL_GERAL }
}

function TabGeral() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState(loadGeral)
  const [logo, setLogo] = useState(DEFAULT_LOGO)
  const logoInputRef = useRef(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    try { localStorage.setItem(GERAL_KEY, JSON.stringify(form)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleCancel() {
    setForm(loadGeral())
    setLogo(DEFAULT_LOGO)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome da empresa"><Input value={form.empresa} onChange={set('empresa')} /></Field>
        <Field label="Site"><Input value={form.site} onChange={set('site')} /></Field>
        <Field label="E-mail de contato"><Input value={form.email} onChange={set('email')} type="email" /></Field>
        <Field label="Telefone"><Input value={form.fone} onChange={set('fone')} /></Field>
      </div>
      <Field label="Fuso horário" hint="Utilizado para agendar atividades e relatórios">
        <select value={form.timezone} onChange={set('timezone')}
          className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
        >
          <option>America/Sao_Paulo</option>
          <option>America/Manaus</option>
          <option>America/Fortaleza</option>
        </select>
      </Field>
      <Field label="Logo da empresa" hint="Formato PNG ou SVG, max 500kb">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 object-contain rounded-lg border border-border bg-white/5 px-2" />
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
            const file = e.target.files[0]
            if (file) setLogo(URL.createObjectURL(file))
            e.target.value = ''
          }} />
          <button onClick={() => logoInputRef.current?.click()} className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors">Alterar logo</button>
        </div>
      </Field>
      <SaveBar saved={saved} onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}

function TabPipeline() {
  const { stages, pipelines, savePipelineConfig } = useData()
  const [stgs, setStgs] = useState([])
  const [activePipelineId, setActivePipelineId] = useState(null)
  useEffect(() => {
    if (!activePipelineId && pipelines.length) setActivePipelineId(pipelines[0].id)
  }, [pipelines, activePipelineId])
  useEffect(() => {
    if (activePipelineId) setStgs(stages.filter(s => s.pipelineId === activePipelineId))
  }, [stages, activePipelineId])
  const [saved, setSaved] = useState(false)
  const colors = ['#6b7280','#4f6ef7','#be29ec','#ea8a29','#6eda2c','#ef4444','#ec4899','#06b6d4']

  function remove(id) { setStgs(s => s.filter(x => x.id !== id)) }
  function addStage() {
    setStgs(s => [...s, { id: `stage_${Date.now()}`, label: 'Nova etapa', color: '#6b7280', pipelineId: activePipelineId }])
  }
  function handleSave() {
    const otherStages = stages.filter(s => s.pipelineId !== activePipelineId)
    savePipelineConfig(pipelines, [...otherStages, ...stgs])
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      {pipelines.length > 1 && (
        <div className="flex gap-1.5 mb-4">
          {pipelines.map(p => (
            <button key={p.id} onClick={() => setActivePipelineId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activePipelineId === p.id ? 'bg-accent/10 text-accent border-accent/30' : 'border-border text-muted hover:border-accent/20'
              }`}>
              {p.name}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-muted mb-4">As etapas definem o funil de vendas do pipeline selecionado.</p>
      <div className="space-y-2 mb-4">
        {stgs.map((stage, i) => (
          <motion.div
            key={stage.id} layout
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3 group"
          >
            <GripVertical size={15} className="text-muted cursor-grab flex-shrink-0" />
            <div className="flex gap-1.5 flex-shrink-0">
              {colors.map(c => (
                <button key={c} onClick={() => setStgs(s => s.map(x => x.id === stage.id ? {...x, color: c} : x))}
                  className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${stage.color === c ? 'ring-2 ring-white/50 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              value={stage.label}
              onChange={e => setStgs(s => s.map(x => x.id === stage.id ? {...x, label: e.target.value} : x))}
              className="flex-1 bg-transparent text-sm font-semibold text-text focus:outline-none min-w-0"
            />
            <button onClick={() => remove(stage.id)}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>
      <button onClick={addStage}
        className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors border border-dashed border-border hover:border-accent/30 rounded-xl px-4 py-2.5 w-full"
      >
        <Plus size={14} /> Adicionar etapa
      </button>
      <SaveBar saved={saved} onSave={handleSave} onCancel={() => setStgs(stages.filter(s => s.pipelineId === activePipelineId))} />
    </div>
  )
}

function AddMemberModal({ onClose, onAdded }) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [role,     setRole]     = useState('colaborador')
  const [password, setPassword] = useState(() => Math.random().toString(36).slice(2, 9) + 'A1!')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)
  const [copied,   setCopied]   = useState(false)

  async function handleCreate() {
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Preencha nome, e-mail e senha (mín. 6 caracteres).')
      return
    }
    setLoading(true)
    setError('')
    const avatar = makeAvatar(name)
    const color  = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

    if (supabaseReady) {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim(), role, avatar, color } },
      })
      if (err && !err.message.toLowerCase().includes('already registered')) {
        setError(err.message)
        setLoading(false)
        return
      }
    }

    addTeamMember({
      id: email.replace(/[^a-z0-9]/gi, '_') + '_' + Date.now(),
      name: name.trim(), email: email.trim(), password, role, avatar, color,
      createdAt: new Date().toISOString(),
    })

    onAdded()
    setDone(true)
    setLoading(false)
  }

  function copyCredentials() {
    navigator.clipboard.writeText(`E-mail: ${email}\nSenha: ${password}\nURL: ${window.location.origin}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function sendByEmail() {
    const subject = encodeURIComponent('Seu acesso ao TráfegOn Suite')
    const body = encodeURIComponent(`Olá ${name}!\n\nSeu acesso ao TráfegOn Suite foi criado.\n\nE-mail: ${email}\nSenha: ${password}\nURL: ${window.location.origin}\n\nPode alterar a senha depois em "Esqueci minha senha".\n\nTráfegOn`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-text">
            {done ? 'Membro adicionado!' : 'Adicionar membro'}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors">
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <Field label="Nome completo">
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="João Silva" autoFocus
                  className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
              </Field>
              <Field label="E-mail">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
              </Field>
              <Field label="Função no sistema">
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
                >
                  {TEAM_ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_CONFIG[r]?.label ?? r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Senha temporária" hint="O usuário pode trocar depois em 'Esqueci minha senha'.">
                <input type="text" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text font-mono focus:outline-none focus:border-accent/50 transition-colors"
                />
              </Field>
              {error && <p className="text-xs font-semibold text-danger bg-danger/8 px-3 py-2 rounded-xl border border-danger/15">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted font-semibold hover:text-text-2 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleCreate} disabled={loading || !name.trim() || !email.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-[#15172a] text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : 'Criar acesso'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-accent mb-2">Credenciais de acesso</p>
                <p className="text-xs text-muted">E-mail: <span className="text-text font-semibold">{email}</span></p>
                <p className="text-xs text-muted">Senha: <span className="text-text font-mono font-semibold">{password}</span></p>
                <p className="text-xs text-muted">URL: <span className="text-text font-semibold">{window.location.origin}</span></p>
              </div>
              <p className="text-xs text-muted bg-border/30 rounded-lg p-3">
                Envie estas credenciais para o usuário. Se não receber e-mail de confirmação do Supabase, pode logar diretamente.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={copyCredentials}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    copied ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-accent hover:bg-accent-hover text-[#15172a]'
                  }`}>
                  {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar credenciais</>}
                </button>
                <button onClick={sendByEmail}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-text-2 transition-colors">
                  <Mail size={14} /> Enviar por e-mail
                </button>
              </div>
              <button onClick={onClose} className="w-full py-2 text-xs text-muted font-semibold hover:text-text-2 transition-colors">
                Fechar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

async function findAndDeleteSupabaseUser(email) {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  if (error) return error.message
  const u = data.users.find(x => x.email === email)
  if (!u) return null
  const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(u.id)
  return delErr ? delErr.message : null
}

async function findAndUpdateSupabasePassword(email, password) {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  if (error) return error.message
  const u = data.users.find(x => x.email === email)
  if (!u) return null
  const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(u.id, { password })
  return upErr ? upErr.message : null
}

function DeleteMemberModal({ member, section, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  async function handleDelete() {
    setLoading(true)
    setError('')
    const err = await findAndDeleteSupabaseUser(member.email)
    if (err) { setError(err); setLoading(false); return }
    if (section === 'team') removeTeamMember(member.id)
    else removeClient(member.id)
    onDeleted()
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
      >
        {done ? (
          <div className="text-center py-4">
            <Check size={32} className="text-accent mx-auto mb-3" />
            <p className="text-sm font-bold text-text">Acesso removido</p>
            <button onClick={onClose} className="mt-4 text-xs text-muted font-semibold hover:text-text-2 transition-colors">Fechar</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Remover acesso</h3>
              <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={16} /></button>
            </div>
            <p className="text-sm text-muted mb-1">Tem certeza que deseja remover o acesso de:</p>
            <p className="text-sm font-bold text-text mb-0.5">{member.name}</p>
            <p className="text-xs text-muted mb-4">{member.email}</p>
            <p className="text-xs text-muted bg-danger/5 border border-danger/15 rounded-lg px-3 py-2 mb-4">
              Esta ação é irreversível. O usuário não conseguirá mais fazer login.
            </p>
            {error && <p className="text-xs font-semibold text-danger mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted font-semibold hover:text-text-2 transition-colors">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-danger hover:bg-danger/90 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={13} /> Remover</>}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function ChangePasswordModal({ member, onClose, onSaved }) {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  async function handleSave() {
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    setError('')
    const err = await findAndUpdateSupabasePassword(member.email, password)
    if (err) { setError(err); setLoading(false); return }
    updateUserPasswordLocal(member.id, password)
    onSaved()
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
      >
        {done ? (
          <div className="text-center py-4">
            <Check size={32} className="text-accent mx-auto mb-3" />
            <p className="text-sm font-bold text-text">Senha alterada!</p>
            <button onClick={onClose} className="mt-4 text-xs text-muted font-semibold hover:text-text-2 transition-colors">Fechar</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Alterar senha</h3>
              <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={16} /></button>
            </div>
            <p className="text-sm text-muted mb-4">
              Nova senha para <span className="font-semibold text-text">{member.name}</span>
            </p>
            <Field label="Nova senha">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Mínimo 6 caracteres"
                  autoFocus
                  className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            {error && <p className="text-xs font-semibold text-danger mt-2">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted font-semibold hover:text-text-2 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={loading || password.length < 6}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-[#15172a] text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function MembersTable({ members, section, onDelete, onChangePass, currentEmail }) {
  return (
    <div className="bg-bg border border-border rounded-xl overflow-hidden mb-5">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Nome','E-mail','Função',''].map((h, i) => (
              <th key={i} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => {
            const cfg   = ROLE_CONFIG[m.role]
            const isSelf = m.email === currentEmail
            return (
              <motion.tr key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/40 hover:bg-black/[0.03] transition-colors group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: m.color }}>
                      {m.avatar}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text">{m.name}</span>
                      {isSelf && <span className="ml-1.5 text-[10px] text-muted">(você)</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-muted">{m.email}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: (cfg?.color ?? '#8890b5') + '18', color: cfg?.color ?? '#8890b5' }}>
                    {cfg?.icon} {cfg?.label ?? m.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">Ativo</span>
                    {!isSelf && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        <button onClick={() => onChangePass(m)} title="Alterar senha"
                          className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors">
                          <Key size={13} />
                        </button>
                        <button onClick={() => onDelete(m)} title="Remover acesso"
                          className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TabEquipe() {
  const [showModal,    setShowModal]    = useState(false)
  const [team,         setTeam]         = useState([])
  const [clients,      setClients]      = useState([])
  const [pending,      setPending]      = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [passTarget,   setPassTarget]   = useState(null)

  const currentEmail = (() => { try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}').email } catch { return '' } })()

  function reload() {
    const { team: t, clients: c } = getUsers()
    setTeam(t)
    setClients(c)
    setPending(getPendingInvites())
  }

  useEffect(() => { reload() }, [])

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all">
          <Plus size={14} /> Adicionar membro
        </button>
      </div>

      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Equipe</p>
      <MembersTable
        members={team}
        section="team"
        currentEmail={currentEmail}
        onDelete={m => setDeleteTarget({ member: m, section: 'team' })}
        onChangePass={m => setPassTarget({ member: m })}
      />

      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Portal de Clientes</p>
      <MembersTable
        members={clients}
        section="clients"
        currentEmail={currentEmail}
        onDelete={m => setDeleteTarget({ member: m, section: 'clients' })}
        onChangePass={m => setPassTarget({ member: m })}
      />

      {pending.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock size={11} /> Convites pendentes
          </p>
          <div className="space-y-2">
            {pending.map((inv, i) => (
              <motion.div key={inv.token} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between bg-bg border border-border rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-text">{inv.email}</p>
                  <p className="text-xs text-muted">{ROLE_CONFIG[inv.role]?.label ?? inv.role} · enviado {new Date(inv.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <button onClick={() => { revokeInvite(inv.token); reload() }}
                  className="text-xs text-muted hover:text-danger transition-colors font-semibold">
                  Revogar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && <AddMemberModal onClose={() => setShowModal(false)} onAdded={reload} />}
        {deleteTarget && (
          <DeleteMemberModal
            member={deleteTarget.member}
            section={deleteTarget.section}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => { reload(); setTimeout(() => setDeleteTarget(null), 1500) }}
          />
        )}
        {passTarget && (
          <ChangePasswordModal
            member={passTarget.member}
            onClose={() => setPassTarget(null)}
            onSaved={() => setTimeout(() => setPassTarget(null), 1500)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const NOTIF_KEY = 'trafegon_config_notif'
const NOTIF_DEFAULT = { novoLead: true, atividadeVencida: true, dealFechado: true, emailDiario: false, emailSemanal: true, somNotificacao: true }

function loadNotif() {
  try { return { ...NOTIF_DEFAULT, ...JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}') } } catch { return NOTIF_DEFAULT }
}

function TabNotificacoes() {
  const [prefs, setPrefs] = useState(loadNotif)
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }))
  const [saved, setSaved] = useState(false)

  const items = [
    { key: 'novoLead',         label: 'Novo lead recebido',       desc: 'WhatsApp, webhook ou manual' },
    { key: 'atividadeVencida', label: 'Atividade vencida',        desc: 'Quando uma tarefa passa do prazo' },
    { key: 'dealFechado',      label: 'Deal fechado',             desc: 'Celebre cada vitória 🎉' },
    { key: 'emailDiario',      label: 'Resumo diário por e-mail', desc: 'Enviado às 8h todo dia útil' },
    { key: 'emailSemanal',     label: 'Relatório semanal',        desc: 'Enviado toda segunda-feira' },
    { key: 'somNotificacao',   label: 'Som de notificação',       desc: 'Efeito sonoro ao receber lead' },
  ]

  function handleSave() {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div key={item.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
          className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl hover:border-accent/20 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-text">{item.label}</p>
            <p className="text-xs text-muted mt-0.5">{item.desc}</p>
          </div>
          <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
        </motion.div>
      ))}
      <SaveBar saved={saved} onSave={handleSave} onCancel={() => setPrefs(loadNotif())} />
    </div>
  )
}

const APARENCIA_KEY = 'trafegon_config_aparencia'
const APARENCIA_DEFAULT = { theme: 'dark', accent: '#6eda2c', density: 'Normal' }

function loadAparencia() {
  try { return { ...APARENCIA_DEFAULT, ...JSON.parse(localStorage.getItem(APARENCIA_KEY) || '{}') } } catch { return APARENCIA_DEFAULT }
}

function TabAparencia() {
  const [prefs, setPrefs] = useState(loadAparencia)
  const [saved, setSaved] = useState(false)
  const accents = ['#6eda2c','#be29ec','#4f6ef7','#ea8a29','#ec4899','#06b6d4']

  function handleSave() {
    try { localStorage.setItem(APARENCIA_KEY, JSON.stringify(prefs)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5">
      <Field label="Tema">
        <div className="flex gap-3">
          {['dark','light'].map(t => (
            <button key={t} onClick={() => setPrefs(p => ({ ...p, theme: t }))}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                prefs.theme === t ? 'border-accent/40 bg-accent/5 text-accent' : 'border-border text-muted hover:border-border'
              }`}
            >
              {t === 'dark' ? '🌙 Escuro' : '☀️ Claro'}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Cor de destaque" hint="Cor principal dos CTAs, destaques e elementos ativos">
        <div className="flex gap-3 mt-1">
          {accents.map(c => (
            <button key={c} onClick={() => setPrefs(p => ({ ...p, accent: c }))}
              className={`w-8 h-8 rounded-xl transition-all hover:scale-110 ${prefs.accent === c ? 'ring-2 ring-white/60 scale-110' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </Field>
      <Field label="Densidade da interface">
        <div className="flex gap-2">
          {['Compacta','Normal','Espaçada'].map(d => (
            <button key={d} onClick={() => setPrefs(p => ({ ...p, density: d }))}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                prefs.density === d ? 'border-accent/40 bg-accent/5 text-accent' : 'border-border text-muted hover:border-accent/20'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Field>
      <SaveBar saved={saved} onSave={handleSave} onCancel={() => setPrefs(loadAparencia())} />
    </div>
  )
}

const tabContent = {
  geral: TabGeral,
  pipeline: TabPipeline,
  equipe: TabEquipe,
  notificacoes: TabNotificacoes,
  aparencia: TabAparencia,
}

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral')
  const Content = tabContent[activeTab]

  return (
    <div className="p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-text">Configurações</h1>
        <p className="text-sm text-muted mt-0.5">Gerencie sua conta e preferências</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-48 lg:flex-shrink-0 flex lg:flex-col flex-row flex-wrap gap-1"
        >
          {tabs.map((tab, i) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2 hover:bg-black/[0.04]'
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {isActive && <ChevronRight size={12} className="ml-auto text-accent/50" />}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="bg-white border border-border rounded-xl card-shadow p-6"
            >
              <Content />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
