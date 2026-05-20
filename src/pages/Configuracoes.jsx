import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Building, Bell, Shield, Palette, Users, Kanban, Plus, GripVertical, Trash2, Save, Check, ChevronRight } from 'lucide-react'
import { stages } from '../data/mock'

const tabs = [
  { id: 'geral',       icon: Building, label: 'Geral' },
  { id: 'pipeline',    icon: Kanban,   label: 'Pipeline' },
  { id: 'equipe',      icon: Users,    label: 'Equipe' },
  { id: 'notificacoes',icon: Bell,     label: 'Notificações' },
  { id: 'aparencia',   icon: Palette,  label: 'Aparência' },
]

const teamMembers = [
  { id: 1, name: 'Gabriel Schollmeier', email: 'gabriel@trafegon.com.br', role: 'Admin',   avatar: 'GS', active: true  },
  { id: 2, name: 'João Carvalho',        email: 'joao@trafegon.com.br',    role: 'Vendedor', avatar: 'JC', active: true  },
  { id: 3, name: 'Ana Lima',             email: 'ana@trafegon.com.br',     role: 'Vendedor', avatar: 'AL', active: false },
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

function SaveBar({ onSave, saved }) {
  return (
    <div className="flex items-center justify-end mt-6 pt-4 border-t border-border gap-3">
      <button className="text-sm text-muted hover:text-text-2 font-semibold transition-colors px-3 py-2">
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
function TabGeral() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    empresa: 'TráfegOn', site: 'https://trafegon.com.br',
    email: 'contato@trafegon.com.br', fone: '+55 47 9 9999-0000',
    timezone: 'America/Sao_Paulo',
  })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

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
          <img src="https://trafegon.com.br/wp-content/uploads/2024/10/logo-trafegon-com-slogan-5-300x134.webp"
            alt="Logo" className="h-10 object-contain rounded-lg border border-border bg-white/5 px-2" />
          <button className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors">Alterar logo</button>
        </div>
      </Field>
      <SaveBar saved={saved} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} />
    </div>
  )
}

function TabPipeline() {
  const [stgs, setStgs] = useState(stages.filter(s => s.pipelineId === 1))
  const [saved, setSaved] = useState(false)
  const colors = ['#6b7280','#4f6ef7','#be29ec','#ea8a29','#6eda2c','#ef4444','#ec4899','#06b6d4']

  function remove(id) { setStgs(s => s.filter(x => x.id !== id)) }
  function addStage() {
    setStgs(s => [...s, { id: `stage_${Date.now()}`, label: 'Nova etapa', color: '#6b7280', pipelineId: 1 }])
  }

  return (
    <div>
      <p className="text-xs text-muted mb-4">Arraste para reordenar. As etapas definem o funil de vendas.</p>
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
      <SaveBar saved={saved} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} />
    </div>
  )
}

function TabEquipe() {
  const [saved, setSaved] = useState(false)
  const roles = ['Admin', 'Gestor', 'Vendedor']
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all">
          <Plus size={14} /> Convidar membro
        </button>
      </div>
      <div className="bg-bg border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Membro','E-mail','Função','Status',''].map((h,i) => (
                <th key={i} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m, i) => (
              <motion.tr key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="border-b border-border/40 hover:bg-black/[0.03] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {m.avatar}
                    </div>
                    <span className="text-sm font-semibold text-text">{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted">{m.email}</td>
                <td className="px-5 py-3.5">
                  <select defaultValue={m.role}
                    className="bg-white border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-accent/40 transition-colors"
                  >
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    m.active ? 'bg-accent/10 text-accent' : 'bg-border text-muted'
                  }`}>
                    {m.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs text-muted hover:text-danger transition-colors font-semibold">Remover</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar saved={saved} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} />
    </div>
  )
}

function TabNotificacoes() {
  const [prefs, setPrefs] = useState({
    novoLead: true, atividadeVencida: true,
    dealFechado: true, emailDiario: false, emailSemanal: true,
    somNotificacao: true,
  })
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
      <SaveBar saved={saved} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} />
    </div>
  )
}

function TabAparencia() {
  const [theme, setTheme] = useState('dark')
  const [accent, setAccent] = useState('#6eda2c')
  const [saved, setSaved] = useState(false)

  const accents = ['#6eda2c','#be29ec','#4f6ef7','#ea8a29','#ec4899','#06b6d4']

  return (
    <div className="space-y-5">
      <Field label="Tema">
        <div className="flex gap-3">
          {['dark','light'].map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                theme === t ? 'border-accent/40 bg-accent/5 text-accent' : 'border-border text-muted hover:border-border'
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
            <button key={c} onClick={() => setAccent(c)}
              className={`w-8 h-8 rounded-xl transition-all hover:scale-110 ${accent === c ? 'ring-2 ring-white/60 scale-110' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </Field>
      <Field label="Densidade da interface">
        <div className="flex gap-2">
          {['Compacta','Normal','Espaçada'].map(d => (
            <button key={d}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                d === 'Normal' ? 'border-accent/40 bg-accent/5 text-accent' : 'border-border text-muted hover:border-accent/20'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Field>
      <SaveBar saved={saved} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} />
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
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-text">Configurações</h1>
        <p className="text-sm text-muted mt-0.5">Gerencie sua conta e preferências</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="w-48 flex-shrink-0 space-y-1"
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
