import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, X, ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, Users, Tag, Trash2, Edit2, Copy } from 'lucide-react'

const STORAGE_KEY = 'trafegon_playbooks_v1'

const CATEGORIES = ['Onboarding', 'Tráfego Pago', 'Conteúdo', 'Reuniões', 'Entregas', 'Financeiro', 'Geral']

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const SAMPLE = [
  {
    id: 'pb1',
    title: 'Onboarding de Novo Cliente',
    category: 'Onboarding',
    description: 'Processo padrão de boas-vindas e configuração inicial para novos clientes da agência.',
    steps: [
      { id: 's1', title: 'Enviar e-mail de boas-vindas', daysAfter: 0, assigneeRole: 'gerente', done: false },
      { id: 's2', title: 'Agendar reunião de kickoff', daysAfter: 1, assigneeRole: 'gerente', done: false },
      { id: 's3', title: 'Criar workspace no sistema', daysAfter: 1, assigneeRole: 'admin', done: false },
      { id: 's4', title: 'Configurar acesso ao portal do cliente', daysAfter: 2, assigneeRole: 'admin', done: false },
      { id: 's5', title: 'Coletar acessos de plataformas (Meta, Google)', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 's6', title: 'Realizar auditoria das contas', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 's7', title: 'Apresentar plano de ação 30 dias', daysAfter: 7, assigneeRole: 'gerente', done: false },
    ],
    createdAt: '2026-05-01',
    active: true,
  },
  {
    id: 'pb2',
    title: 'Relatório Mensal de Performance',
    category: 'Entregas',
    description: 'Fluxo mensal de coleta, análise e entrega de relatório aos clientes.',
    steps: [
      { id: 's1', title: 'Exportar dados de Meta Ads', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 's2', title: 'Exportar dados de Google Ads', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 's3', title: 'Compilar métricas no template', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 's4', title: 'Revisão gerencial', daysAfter: 2, assigneeRole: 'gerente', done: false },
      { id: 's5', title: 'Enviar relatório ao cliente', daysAfter: 3, assigneeRole: 'gerente', done: false },
    ],
    createdAt: '2026-05-01',
    active: true,
  },
  {
    id: 'pb_sm_onboarding',
    title: 'Onboarding — Social Media',
    category: 'Onboarding',
    description: 'Integração completa do colaborador de Social Media: produção de conteúdo, planejamento editorial, gestão e agendamento de páginas, e relatórios de engajamento.',
    steps: [
      { id: 'sm01', title: 'Reunião de alinhamento: tom de voz, personas e objetivos de cada cliente ativo', daysAfter: 0, assigneeRole: 'gerente', done: false },
      { id: 'sm02', title: 'Receber acessos: Instagram, Facebook Business, ferramenta de agendamento (Metricool ou Meta Business Suite)', daysAfter: 0, assigneeRole: 'admin', done: false },
      { id: 'sm03', title: 'Onboarding no hub.trafegon.com.br — explorar todos os workspaces de clientes', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'sm04', title: 'Ler info.md de cada cliente: nicho, histórico, campanhas ativas e posicionamento', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'sm05', title: 'Mapear identidade visual de cada cliente: paleta, fontes e estilo gráfico', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'sm06', title: 'Levantar frequência de postagem atual e engajamento médio por cliente', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'sm07', title: 'Criar calendário editorial do primeiro mês para 2 clientes-piloto', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'sm08', title: 'Revisão e aprovação do calendário editorial pelo gestor', daysAfter: 4, assigneeRole: 'gerente', done: false },
      { id: 'sm09', title: 'Produzir primeiras 3 artes por cliente seguindo padrão visual aprovado', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'sm10', title: 'Revisão interna das artes — aprovação obrigatória antes de agendar', daysAfter: 6, assigneeRole: 'gerente', done: false },
      { id: 'sm11', title: 'Configurar agendamento e fluxo de publicação no Metricool', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'sm12', title: 'Apresentar plano editorial completo do mês para todos os clientes ativos', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'sm13', title: 'Entregar primeira rodada completa: feed + stories agendados para a semana', daysAfter: 9, assigneeRole: 'colaborador', done: false },
      { id: 'sm14', title: 'Monitorar métricas das primeiras publicações: alcance, curtidas, saves e comentários', daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'sm15', title: 'Reunião de feedback com gestor — ajuste de linha editorial se necessário', daysAfter: 12, assigneeRole: 'gerente', done: false },
      { id: 'sm16', title: 'Entregar 1º relatório quinzenal: alcance, engajamento, stories e top posts', daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'sm17', title: 'Iniciar ciclo de captação de depoimentos e provas sociais dos clientes', daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'sm18', title: 'Revisar e ajustar calendário da próxima quinzena com base nos dados', daysAfter: 20, assigneeRole: 'colaborador', done: false },
      { id: 'sm19', title: 'Propor ideias de campanha de conteúdo para o próximo mês (trends + datas comemorativas)', daysAfter: 25, assigneeRole: 'colaborador', done: false },
      { id: 'sm20', title: 'Entrega do relatório mensal completo: métricas, aprendizados e plano D+30', daysAfter: 30, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-21',
    active: true,
  },
  {
    id: 'pb_sdr_onboarding',
    title: 'Onboarding — SDR (Pré-vendas)',
    category: 'Onboarding',
    description: 'Integração completa do SDR: prospecção ativa, qualificação de inbound, agendamento de reuniões de diagnóstico e follow-up estruturado.',
    steps: [
      { id: 'sdr01', title: 'Reunião de alinhamento: ICP (perfil de cliente ideal), proposta de valor e diferenciais da TráfegOn', daysAfter: 0, assigneeRole: 'gerente', done: false },
      { id: 'sdr02', title: 'Acesso ao hub.trafegon.com.br e configuração de ferramentas (WhatsApp Business, CRM)', daysAfter: 0, assigneeRole: 'admin', done: false },
      { id: 'sdr03', title: 'Estudar portfólio e resultados — explorar workspaces de clientes ativos no sistema', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'sdr04', title: 'Entender estrutura de precificação: planos, escopo de cada pacote e limites de serviço', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'sdr05', title: 'Treinar discurso de prospecção: o que a TráfegOn entrega e diferenciais vs concorrência', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'sdr06', title: 'Sombra em 1 ligação ou reunião de prospecção conduzida pelo gestor', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'sdr07', title: 'Produzir lista inicial de 30 prospects qualificados (nicho, porte, região alvo)', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'sdr08', title: 'Validar lista de prospects e script de abordagem com o gestor', daysAfter: 5, assigneeRole: 'gerente', done: false },
      { id: 'sdr09', title: 'Apresentar estratégia do primeiro ciclo de prospecção', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'sdr10', title: 'Início das abordagens ativas via WhatsApp/Instagram com script aprovado', daysAfter: 8, assigneeRole: 'colaborador', done: false },
      { id: 'sdr11', title: 'Primeiro follow-up com prospects sem resposta (24h após contato inicial)', daysAfter: 9, assigneeRole: 'colaborador', done: false },
      { id: 'sdr12', title: 'Qualificar leads inbound: responder indicações e pedidos via DM/site', daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'sdr13', title: 'Meta da semana 2: 10 contatos feitos, 3 conversas abertas, 1 diagnóstico agendado', daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'sdr14', title: 'Relatório semanal de prospecção: contatos, respostas, objeções e pipeline', daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'sdr15', title: 'Conduzir primeira reunião de diagnóstico com acompanhamento do gestor', daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'sdr16', title: 'Enviar proposta comercial com follow-up estruturado (D+1, D+3, D+7)', daysAfter: 18, assigneeRole: 'colaborador', done: false },
      { id: 'sdr17', title: 'Reunião de pipeline com gestor: revisar funil, objeções e ajustar estratégia', daysAfter: 21, assigneeRole: 'gerente', done: false },
      { id: 'sdr18', title: 'Meta do primeiro mês: 2 reuniões de diagnóstico com leads qualificados', daysAfter: 25, assigneeRole: 'colaborador', done: false },
      { id: 'sdr19', title: 'Balanço do mês 1: leads contatados, conversas abertas, propostas enviadas, fechamentos e objeções mapeadas', daysAfter: 30, assigneeRole: 'colaborador', done: false },
      { id: 'sdr20', title: 'Definir metas e estratégia do mês 2 em conjunto com o gestor', daysAfter: 30, assigneeRole: 'gerente', done: false },
    ],
    createdAt: '2026-05-21',
    active: true,
  },
]

function initPlaybooks() {
  const stored = load()
  if (stored.length === 0) {
    save(SAMPLE)
    return SAMPLE
  }
  const storedIds = new Set(stored.map(p => p.id))
  const missing = SAMPLE.filter(p => !storedIds.has(p.id))
  if (missing.length > 0) {
    const updated = [...stored, ...missing]
    save(updated)
    return updated
  }
  return stored
}

const ROLE_COLORS = {
  admin: '#ef4444',
  gerente: '#60a5fa',
  colaborador: '#6eda2c',
  visualizador: '#be29ec',
}
const ROLE_LABELS = { admin: 'Admin', gerente: 'Gerente', colaborador: 'Colaborador', visualizador: 'Visualizador' }

function StepRow({ step, index, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-3 group py-2">
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
        style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{index + 1}</span>

      <input
        value={step.title}
        onChange={e => onChange({ ...step, title: e.target.value })}
        className="flex-1 text-sm text-text bg-transparent border-none outline-none font-medium placeholder:text-muted/50"
        placeholder="Descrição da etapa..."
      />

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-muted" />
          <input
            type="number" min={0} max={90}
            value={step.daysAfter}
            onChange={e => onChange({ ...step, daysAfter: parseInt(e.target.value) || 0 })}
            className="w-10 text-center text-xs font-bold text-text bg-surface border border-border rounded-lg px-1 py-0.5 outline-none"
          />
          <span className="text-[10px] text-muted">d</span>
        </div>

        <select
          value={step.assigneeRole}
          onChange={e => onChange({ ...step, assigneeRole: e.target.value })}
          className="text-[10px] font-bold rounded-lg px-2 py-1 border border-border outline-none"
          style={{ color: ROLE_COLORS[step.assigneeRole] || '#8890b5', background: '#f8f9fc' }}
        >
          {Object.entries(ROLE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-danger/60 hover:text-danger">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

function PlaybookCard({ pb, onEdit, onDuplicate, onDelete, onToggle }) {
  const [open, setOpen] = useState(false)
  const catColor = {
    Onboarding: '#6eda2c', 'Tráfego Pago': '#60a5fa', Conteúdo: '#be29ec',
    Reuniões: '#ea8a29', Entregas: '#f59e0b', Financeiro: '#06b6d4', Geral: '#8890b5',
  }[pb.category] || '#8890b5'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
    >
      {/* Top bar */}
      <div className="h-1 w-full" style={{ background: catColor }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: catColor + '18', color: catColor }}>{pb.category}</span>
              {pb.active
                ? <span className="text-[10px] font-bold text-accent">● Ativo</span>
                : <span className="text-[10px] font-bold text-muted">○ Inativo</span>}
            </div>
            <h3 className="text-sm font-extrabold text-text mt-1">{pb.title}</h3>
            <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-2">{pb.description}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => onDuplicate(pb)} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors" title="Duplicar">
              <Copy size={14} />
            </button>
            <button onClick={() => onEdit(pb)} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors" title="Editar">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(pb.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors" title="Excluir">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid #edf0f7' }}>
          <span className="text-xs font-bold text-muted flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-accent" />
            {pb.steps.length} etapas
          </span>
          <span className="text-xs font-bold text-muted flex items-center gap-1.5">
            <Clock size={12} className="text-blue-400" />
            {pb.steps.reduce((a, s) => Math.max(a, s.daysAfter), 0)} dias
          </span>
          <button
            onClick={() => setOpen(v => !v)}
            className="ml-auto flex items-center gap-1 text-xs font-bold text-muted hover:text-text transition-colors"
          >
            Ver etapas {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-0 divide-y divide-border">
                {pb.steps.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 py-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                      style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{i + 1}</span>
                    <span className="flex-1 text-xs text-text">{s.title}</span>
                    <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#60a5fa' }}>
                      <Clock size={10} />dia {s.daysAfter}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: (ROLE_COLORS[s.assigneeRole] || '#8890b5') + '18', color: ROLE_COLORS[s.assigneeRole] || '#8890b5' }}>
                      {ROLE_LABELS[s.assigneeRole] || s.assigneeRole}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PlaybookModal({ pb, onClose, onSave }) {
  const isNew = !pb
  const [form, setForm] = useState(pb || {
    id: 'pb_' + Date.now(),
    title: '',
    category: 'Geral',
    description: '',
    steps: [],
    createdAt: new Date().toISOString().slice(0, 10),
    active: true,
  })

  function addStep() {
    setForm(f => ({
      ...f,
      steps: [...f.steps, {
        id: 's_' + Date.now(),
        title: '',
        daysAfter: f.steps.length === 0 ? 0 : (f.steps[f.steps.length - 1].daysAfter + 1),
        assigneeRole: 'colaborador',
        done: false,
      }],
    }))
  }

  function updateStep(id, updated) {
    setForm(f => ({ ...f, steps: f.steps.map(s => s.id === id ? updated : s) }))
  }

  function deleteStep(id) {
    setForm(f => ({ ...f, steps: f.steps.filter(s => s.id !== id) }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <h2 className="text-base font-extrabold text-text">{isNew ? 'Novo Playbook' : 'Editar Playbook'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted hover:text-text transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Título</label>
              <input
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Onboarding de Novo Cliente"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Categoria</label>
              <select
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none"
                style={{ background: '#f8f9fc' }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ background: form.active ? '#6eda2c' : '#d1d5db' }}
                >
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ transform: form.active ? 'translateX(20px)' : 'translateX(0)' }} />
                </div>
                <span className="text-sm font-bold text-text">Ativo</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Descrição</label>
              <textarea
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Descreva o objetivo deste playbook..."
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none resize-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Etapas</label>
              <button onClick={addStep}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-accent hover:bg-accent/10 transition-colors border border-accent/20">
                <Plus size={12} /> Adicionar
              </button>
            </div>
            <div className="space-y-0 divide-y divide-border rounded-xl overflow-hidden border border-border">
              {form.steps.length === 0
                ? <p className="text-xs text-muted text-center py-6">Nenhuma etapa. Clique em Adicionar.</p>
                : form.steps.map((s, i) => (
                  <StepRow key={s.id} step={s} index={i}
                    onChange={updated => updateStep(s.id, updated)}
                    onDelete={() => deleteStep(s.id)}
                  />
                ))
              }
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5" style={{ borderTop: '1px solid #edf0f7' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (form.title.trim()) onSave(form) }}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all disabled:opacity-50"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}
          >
            {isNew ? 'Criar Playbook' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Playbooks() {
  const [playbooks, setPlaybooks] = useState(initPlaybooks)
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('Todos')

  const categories = ['Todos', ...CATEGORIES]
  const filtered = filter === 'Todos' ? playbooks : playbooks.filter(p => p.category === filter)
  const activeCount = playbooks.filter(p => p.active).length

  function saveAll(updated) {
    setPlaybooks(updated)
    save(updated)
  }

  function handleSave(form) {
    const existing = playbooks.find(p => p.id === form.id)
    if (existing) {
      saveAll(playbooks.map(p => p.id === form.id ? form : p))
    } else {
      saveAll([...playbooks, form])
    }
    setModal(null)
  }

  function handleDelete(id) {
    saveAll(playbooks.filter(p => p.id !== id))
  }

  function handleDuplicate(pb) {
    const copy = { ...pb, id: 'pb_' + Date.now(), title: pb.title + ' (cópia)', createdAt: new Date().toISOString().slice(0, 10) }
    saveAll([...playbooks, copy])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-text">Playbooks</h1>
          <p className="text-sm text-muted mt-0.5">{activeCount} playbooks ativos · POPs e processos da agência</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}
        >
          <Plus size={15} /> Novo Playbook
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === c
              ? { background: '#6eda2c', color: '#fff' }
              : { background: '#fff', color: '#8890b5', border: '1px solid #e2e5f0' }
            }>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(pb => (
            <PlaybookCard
              key={pb.id}
              pb={pb}
              onEdit={p => setModal(p)}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onToggle={id => saveAll(playbooks.map(p => p.id === id ? { ...p, active: !p.active } : p))}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">Nenhum playbook nesta categoria.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <PlaybookModal
            pb={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
