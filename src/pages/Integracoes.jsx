import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, CheckCircle, XCircle, ExternalLink, Plus, Webhook, Zap, ChevronRight, Eye, EyeOff, RefreshCw, X } from 'lucide-react'

const INITIAL_INTEGRATIONS = [
  {
    id: 'whatsapp', name: 'WhatsApp', desc: 'Receba e envie mensagens direto no CRM',
    icon: '💬', color: '#25d366', connected: true, status: 'online',
    detail: 'Conectado via Evolution API · +5547999990000',
  },
  {
    id: 'meta', name: 'Meta Ads', desc: 'Leads de campanhas Facebook e Instagram entram automaticamente',
    icon: '📘', color: '#4f6ef7', connected: true, status: 'online',
    detail: 'Conta: TráfegOn · 3 formulários ativos',
  },
  {
    id: 'google', name: 'Google Ads', desc: 'Captura leads de formulários e campanhas Google',
    icon: '🔍', color: '#ea8a29', connected: false, status: 'offline',
    detail: null,
  },
  {
    id: 'lovable', name: 'Lovable / Sites', desc: 'Receba leads de landing pages via webhook',
    icon: '🌐', color: '#be29ec', connected: true, status: 'online',
    detail: '2 landing pages conectadas',
  },
  {
    id: 'rdstation', name: 'RD Station', desc: 'Sincronize contatos e automações de marketing',
    icon: '📊', color: '#6eda2c', connected: false, status: 'offline',
    detail: null,
  },
  {
    id: 'zapier', name: 'Zapier / Make', desc: 'Conecte qualquer ferramenta via automações',
    icon: '⚡', color: '#ff6b35', connected: false, status: 'offline',
    detail: null,
  },
]

const INITIAL_WEBHOOKS = [
  { id: 1, name: 'LP Produto Principal', pipeline: 'Aquisição', stage: 'Novo Lead', token: 'wh_abc123xyz', hits: 47, lastHit: '18/05 14:32' },
  { id: 2, name: 'Meta Lead Ads',        pipeline: 'Aquisição', stage: 'Contato feito', token: 'wh_def456uvw', hits: 128, lastHit: '18/05 11:15' },
  { id: 3, name: 'Google Forms',         pipeline: 'Aquisição', stage: 'Novo Lead', token: 'wh_ghi789rst', hits: 23, lastHit: '17/05 09:00' },
]

function NewWebhookModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [pipeline, setPipeline] = useState('Aquisição')
  const [stage, setStage] = useState('Novo Lead')
  const stages = { 'Aquisição': ['Novo Lead','Contato feito','Qualificado','Proposta','Fechado'] }

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), pipeline, stage, token: `wh_${Math.random().toString(36).slice(2,10)}` })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-extrabold text-text">Novo Webhook</p>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Nome do webhook</label>
            <input value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Ex: LP Black Friday"
              className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Funil destino</label>
            <select value={pipeline} onChange={e => { setPipeline(e.target.value); setStage(Object.values(stages)[0][0]) }}
              className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors">
              {Object.keys(stages).map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Etapa de entrada</label>
            <select value={stage} onChange={e => setStage(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors">
              {(stages[pipeline] || []).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-text-2 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all disabled:opacity-40"
            style={{ background: '#6eda2c' }}>
            Criar webhook
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const CREATIVE_TOOLS = [
  {
    id: 'figma',
    name: 'Figma',
    desc: 'Design de interfaces, banners e materiais visuais',
    icon: '🎨',
    color: '#be29ec',
    url: 'https://figma.com',
    badge: 'Design',
    tip: 'Crie artes, apresentações e protótipos. Compartilhe com clientes direto pelo link.',
  },
  {
    id: 'canva',
    name: 'Canva',
    desc: 'Templates prontos para posts, stories e apresentações',
    icon: '🖼️',
    color: '#00c4cc',
    url: 'https://canva.com',
    badge: 'Design',
    tip: 'Ideal para criar artes rápidas de social media e materiais para clientes.',
  },
  {
    id: 'lovable-app',
    name: 'Lovable',
    desc: 'Criação de landing pages e aplicativos com IA',
    icon: '💜',
    color: '#8b5cf6',
    url: 'https://lovable.dev',
    badge: 'No-code',
    tip: 'Gere páginas completas descrevendo o que precisa. Conecte via webhook ao CRM.',
  },
  {
    id: 'manus',
    name: 'Manus',
    desc: 'Agente de IA autônomo para tarefas complexas',
    icon: '🤖',
    color: '#06b6d4',
    url: 'https://manus.im',
    badge: 'IA',
    tip: 'Delegue pesquisas, análises e produção de conteúdo longo para o Manus.',
  },
  {
    id: 'make',
    name: 'Make (ex-Integromat)',
    desc: 'Automações visuais entre ferramentas e CRM',
    icon: '🔄',
    color: '#6eda2c',
    url: 'https://make.com',
    badge: 'Automação',
    tip: 'Conecte Meta Ads → CRM → WhatsApp → Relatório em minutos.',
  },
  {
    id: 'n8n',
    name: 'n8n',
    desc: 'Automações open-source self-hosted',
    icon: '⚙️',
    color: '#ea8a29',
    url: 'https://n8n.io',
    badge: 'Automação',
    tip: 'Alternativa ao Make, ideal para fluxos avançados com controle total dos dados.',
  },
]

function CreativeToolCard({ tool, index }) {
  const [tip, setTip] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
      style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: tool.color + '18', border: `1px solid ${tool.color}30` }}>
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-bold text-text">{tool.name}</p>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: tool.color + '18', color: tool.color }}>{tool.badge}</span>
          </div>
          <p className="text-xs text-muted">{tool.desc}</p>
        </div>
      </div>
      <AnimatePresence>
        {tip && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-muted bg-bg rounded-lg px-3 py-2 mb-3 leading-relaxed overflow-hidden">
            💡 {tool.tip}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-1.5 rounded-lg transition-all flex-1 justify-center">
          <ExternalLink size={11} /> Abrir {tool.name}
        </a>
        <button onClick={() => setTip(t => !t)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text-2 transition-colors">
          {tip ? 'Fechar' : 'Dica'}
        </button>
      </div>
    </motion.div>
  )
}


function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={copy}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all font-semibold ${
        copied ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-border text-muted hover:text-text-2'
      }`}
    >
      {copied ? <><CheckCircle size={11} /> Copiado!</> : <><Copy size={11} /> Copiar</>}
    </motion.button>
  )
}

function IntegrationCard({ intg, index, onToggle }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border border-border rounded-xl card-shadow overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-black/[0.03] transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: intg.color + '15', border: `1px solid ${intg.color}30` }}
        >
          {intg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{intg.name}</p>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              intg.connected ? 'bg-accent/10 text-accent' : 'bg-border text-muted'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${intg.connected ? 'bg-accent animate-pulse' : 'bg-muted'}`} />
              {intg.connected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
          <p className="text-xs text-muted mt-0.5">{intg.desc}</p>
          {intg.detail && <p className="text-xs text-accent/70 font-medium mt-0.5">{intg.detail}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {intg.connected ? (
            <button onClick={e => { e.stopPropagation(); onToggle() }} className="text-xs text-muted hover:text-danger transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-danger/10">
              Desconectar
            </button>
          ) : (
            <motion.button onClick={e => { e.stopPropagation(); onToggle() }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="text-xs bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              Conectar
            </motion.button>
          )}
          <ChevronRight size={14} className={`text-muted transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && intg.id === 'whatsapp' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="border-t border-border/50 px-4 py-4 bg-bg/50"
          >
            <div className="flex items-start gap-6">
              <div>
                <p className="text-xs font-bold text-text-2 mb-2">QR Code — Reconectar</p>
                <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({length: 25}).map((_,i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-[#15172a]' : 'bg-white'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Número conectado</span>
                  <span className="text-text font-bold">+55 47 9 9999-0000</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Status</span>
                  <span className="text-accent font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Mensagens hoje</span>
                  <span className="text-text font-bold">24 enviadas / 31 recebidas</span>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-text-2 transition-colors">
                  <RefreshCw size={11} /> Reconectar sesão
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function WebhookRow({ wh, index, onRevoke }) {
  const [visible, setVisible] = useState(false)
  const url = `https://crm.trafegon.com.br/api/webhook/${wh.token}`

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="border-b border-border/40 hover:bg-black/[0.03] transition-colors"
    >
      <td className="px-5 py-3.5">
        <p className="text-sm font-semibold text-text">{wh.name}</p>
        <p className="text-xs text-muted">{wh.pipeline} → {wh.stage}</p>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted font-mono bg-border/50 px-2 py-1 rounded">
            {visible ? url : url.replace(/./g, '·').slice(0, 30) + '...'}
          </code>
          <button onClick={() => setVisible(v => !v)} className="text-muted hover:text-text-2 transition-colors">
            {visible ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <CopyBtn text={url} />
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm font-bold text-accent">{wh.hits}</span>
        <span className="text-xs text-muted ml-1">hits</span>
      </td>
      <td className="px-5 py-3.5 text-xs text-muted">{wh.lastHit}</td>
      <td className="px-5 py-3.5">
        <button onClick={onRevoke} className="text-xs text-danger hover:text-danger/80 font-semibold transition-colors">Revogar</button>
      </td>
    </motion.tr>
  )
}

export default function Integracoes() {
  const [intgs, setIntgs] = useState(INITIAL_INTEGRATIONS)
  const [whs, setWhs] = useState(INITIAL_WEBHOOKS)
  const [showNewWebhook, setShowNewWebhook] = useState(false)

  function toggleIntg(id) {
    setIntgs(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected, status: i.connected ? 'offline' : 'online' } : i))
  }

  function revokeWebhook(id) {
    setWhs(prev => prev.filter(w => w.id !== id))
  }

  function addWebhook(wh) {
    setWhs(prev => [...prev, { ...wh, id: Date.now(), hits: 0, lastHit: '—' }])
  }

  return (
    <div className="p-4 lg:p-8">
      <AnimatePresence>
        {showNewWebhook && (
          <NewWebhookModal onClose={() => setShowNewWebhook(false)} onSave={addWebhook} />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-xl font-bold text-text">Integrações</h1>
        <p className="text-sm text-muted mt-0.5">Conecte suas ferramentas e fontes de leads</p>
      </motion.div>

      {/* Lead integrations */}
      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Zap size={11} className="text-accent" /> Captação de leads e CRM
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {intgs.map((intg, i) => <IntegrationCard key={intg.id} intg={intg} index={i} onToggle={() => toggleIntg(intg.id)} />)}
      </div>

      {/* Creative tools */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
          🎨 Ferramentas de criação e produtividade
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CREATIVE_TOOLS.map((tool, i) => <CreativeToolCard key={tool.id} tool={tool} index={i} />)}
        </div>
      </motion.div>

      {/* Webhooks */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Webhook size={15} className="text-accent" />
            <h2 className="text-sm font-bold text-text">Webhooks para receber leads</h2>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewWebhook(true)}
            className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all"
          >
            <Plus size={14} /> Novo webhook
          </motion.button>
        </div>

        <div className="bg-white border border-border rounded-xl card-shadow overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Nome / Destino', 'URL do Webhook', 'Hits', 'Último hit', ''].map((h, i) => (
                  <th key={i} className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {whs.map((wh, i) => <WebhookRow key={wh.id} wh={wh} index={i} onRevoke={() => revokeWebhook(wh.id)} />)}
            </tbody>
          </table>
        </div>

        {/* Payload example */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white border border-border rounded-xl card-shadow p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-text-2 uppercase tracking-wider">Exemplo de payload (POST)</p>
            <CopyBtn text={`{"nome":"João Silva","telefone":"554799999999","email":"joao@email.com","origem":"lp-produto","funil":"aquisicao"}`} />
          </div>
          <pre className="text-xs text-accent font-mono bg-bg rounded-lg p-4 overflow-x-auto leading-relaxed">
{`{
  "nome":     "João Silva",
  "telefone": "554799999999",
  "email":    "joao@email.com",
  "origem":   "lp-produto-maio2026",
  "funil":    "aquisicao",
  "valor":    1870
}`}
          </pre>
          <p className="text-xs text-muted mt-3 flex items-center gap-1.5">
            <Zap size={11} className="text-accent" />
            O lead entra automaticamente no pipeline correto com a etapa configurada no webhook.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
