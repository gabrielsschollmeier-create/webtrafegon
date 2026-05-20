import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, CheckCircle, XCircle, ExternalLink, Plus, Webhook, Zap, ChevronRight, Eye, EyeOff, RefreshCw } from 'lucide-react'

const integrations = [
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

const webhooks = [
  { id: 1, name: 'LP Produto Principal', pipeline: 'Aquisição', stage: 'Novo Lead', token: 'wh_abc123xyz', hits: 47, lastHit: '18/05 14:32' },
  { id: 2, name: 'Meta Lead Ads',        pipeline: 'Aquisição', stage: 'Contato feito', token: 'wh_def456uvw', hits: 128, lastHit: '18/05 11:15' },
  { id: 3, name: 'Google Forms',         pipeline: 'Aquisição', stage: 'Novo Lead', token: 'wh_ghi789rst', hits: 23, lastHit: '17/05 09:00' },
]

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

function IntegrationCard({ intg, index }) {
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
            <button className="text-xs text-muted hover:text-danger transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-danger/10">
              Desconectar
            </button>
          ) : (
            <motion.button
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

function WebhookRow({ wh, index }) {
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
        <button className="text-xs text-danger hover:text-danger/80 font-semibold transition-colors">Revogar</button>
      </td>
    </motion.tr>
  )
}

export default function Integracoes() {
  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-xl font-bold text-text">Integrações</h1>
        <p className="text-sm text-muted mt-0.5">Conecte suas ferramentas e fontes de leads</p>
      </motion.div>

      {/* Integration cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {integrations.map((intg, i) => <IntegrationCard key={intg.id} intg={intg} index={i} />)}
      </div>

      {/* Webhooks */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Webhook size={15} className="text-accent" />
            <h2 className="text-sm font-bold text-text">Webhooks para receber leads</h2>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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
              {webhooks.map((wh, i) => <WebhookRow key={wh.id} wh={wh} index={i} />)}
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
