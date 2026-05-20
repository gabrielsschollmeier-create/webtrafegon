import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, WifiOff, RefreshCw, ExternalLink, X, Plus, Smartphone, AlertCircle, Trash2 } from 'lucide-react'
import { getAllUsers } from '../../data/users-store'

const STORAGE_KEY = 'trafegon_zapi_connections_v1'
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} } }
function persist(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }

function ConnectModal({ client, onClose, onConnected }) {
  const [step, setStep] = useState('form')
  const [instanceId, setInstanceId] = useState('')
  const [token, setToken] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function handleConnect() {
    if (!instanceId.trim() || !token.trim()) { setError('Preencha o Instance ID e o Token.'); return }
    setStep('qr')
  }

  function handleConfirm() {
    onConnected(client.id, { instanceId, token, phone })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.75)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.35)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ backgroundColor: client.color }}>{client.avatar}</div>
            <div>
              <p className="text-sm font-extrabold text-text">{client.name}</p>
              <p className="text-[10px] text-muted">Conectar WhatsApp via Z-API</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted"><X size={16} /></button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-7 py-6 space-y-4">
              {/* Passo a passo */}
              <div className="rounded-2xl p-4" style={{ background: '#f8f9fc', border: '1px solid #e2e5f0' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">Como conectar</p>
                {[
                  'Acesse o painel Z-API (z-api.io) e crie uma instância',
                  'Copie o Instance ID e o Token da instância',
                  'Cole abaixo e clique em Próximo',
                  'Escaneie o QR Code no WhatsApp do cliente',
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 mt-0.5"
                      style={{ background: '#6eda2c' }}>{i + 1}</span>
                    <p className="text-xs text-text">{s}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Instance ID</label>
                <input
                  value={instanceId} onChange={e => setInstanceId(e.target.value)}
                  placeholder="Ex: 3DA3C17EF99..." autoFocus
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                  style={{ background: '#f8f9fc' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Token</label>
                <input
                  value={token} onChange={e => setToken(e.target.value)}
                  placeholder="Token de segurança da instância" type="password"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                  style={{ background: '#f8f9fc' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Número do WhatsApp (opcional)</label>
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                  style={{ background: '#f8f9fc' }}
                />
              </div>

              {error && <p className="text-xs text-danger font-semibold">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
                  Cancelar
                </button>
                <button onClick={handleConnect}
                  className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all"
                  style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
                  Próximo →
                </button>
              </div>
            </motion.div>
          )}

          {step === 'qr' && (
            <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-7 py-6 text-center">
              <p className="text-sm font-extrabold text-text mb-2">Escaneie o QR Code</p>
              <p className="text-xs text-muted mb-6">Abra o WhatsApp → ⋮ Menu → Dispositivos vinculados → Vincular dispositivo</p>

              {/* QR placeholder */}
              <div className="w-48 h-48 mx-auto rounded-2xl flex flex-col items-center justify-center mb-6"
                style={{ background: '#f8f9fc', border: '2px dashed #e2e5f0' }}>
                <Smartphone size={36} className="text-muted mb-2" style={{ opacity: 0.35 }} />
                <p className="text-[10px] text-muted font-bold">QR Code Z-API</p>
                <p className="text-[9px] text-muted mt-0.5">Instance: {instanceId.slice(0, 8)}…</p>
              </div>

              <div className="rounded-xl p-3 mb-4 text-xs text-muted"
                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                Na integração real, o QR é gerado automaticamente pela API do Z-API após cadastro da instância.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('form')}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted">
                  Voltar
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white"
                  style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
                  ✓ Confirmar Conexão
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function ClientRow({ client, conn, onConnect, onDisconnect }) {
  const connected = conn?.status === 'connected'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 flex items-center gap-4"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
        style={{ backgroundColor: client.color }}>
        {client.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold text-text">{client.name}</p>
        {connected
          ? <p className="text-xs font-medium mt-0.5" style={{ color: '#25D366' }}>● Conectado{conn.phone ? ` · ${conn.phone}` : ''} desde {conn.connectedAt}</p>
          : <p className="text-xs text-muted mt-0.5">Não conectado</p>
        }
        {connected && conn.instanceId && (
          <p className="text-[10px] text-muted mt-0.5">Instance: {conn.instanceId.slice(0, 12)}…</p>
        )}
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0"
        style={connected
          ? { background: 'rgba(37,211,102,0.12)', color: '#25D366' }
          : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
        {connected ? <CheckCircle2 size={11} /> : <WifiOff size={11} />}
        {connected ? 'Conectado' : 'Desconectado'}
      </div>

      {/* Action */}
      {connected ? (
        <button onClick={() => onDisconnect(client.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-danger/20 text-danger hover:bg-danger/5 transition-colors flex-shrink-0">
          <Trash2 size={12} /> Desconectar
        </button>
      ) : (
        <button onClick={() => onConnect(client)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white flex-shrink-0 transition-all"
          style={{ background: '#25D366', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
          <Plus size={13} /> Conectar
        </button>
      )}
    </motion.div>
  )
}

export default function WhatsApp() {
  const [connections, setConnections] = useState(load)
  const [modal, setModal] = useState(null)

  const clients = getAllUsers().filter(u => u.role === 'cliente')
  const connected = Object.values(connections).filter(c => c.status === 'connected').length

  function handleConnected(clientId, data) {
    const updated = {
      ...connections,
      [clientId]: {
        status: 'connected',
        connectedAt: new Date().toLocaleDateString('pt-BR'),
        ...data,
      },
    }
    setConnections(updated)
    persist(updated)
  }

  function handleDisconnect(clientId) {
    const updated = { ...connections }
    delete updated[clientId]
    setConnections(updated)
    persist(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-text">WhatsApp</h1>
          <p className="text-sm text-muted mt-0.5">
            {connected} de {clients.length} clientes conectados · Integração via Z-API
          </p>
        </div>
        <a href="https://z-api.io" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-border text-muted hover:text-text transition-colors">
          <ExternalLink size={13} /> Painel Z-API
        </a>
      </div>

      {/* Como funciona */}
      <div className="rounded-2xl p-5 flex gap-4"
        style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.2)' }}>
        <MessageCircle size={20} style={{ color: '#25D366', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-bold text-text mb-1">Como conectar o WhatsApp de um cliente</p>
          <ol className="text-xs text-muted space-y-0.5 list-decimal list-inside">
            <li>Crie uma instância gratuita em <strong>z-api.io</strong></li>
            <li>Clique em <strong>"Conectar"</strong> no card do cliente abaixo</li>
            <li>Insira o Instance ID e Token da instância Z-API</li>
            <li>Escaneie o QR Code no WhatsApp do número do cliente</li>
          </ol>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total clientes', value: clients.length, color: '#60a5fa' },
          { label: 'Conectados',     value: connected,      color: '#25D366' },
          { label: 'Pendentes',      value: clients.length - connected, color: '#ea8a29' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de clientes */}
      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <MessageCircle size={32} className="mx-auto mb-3 text-muted" style={{ opacity: 0.3 }} />
          <p className="text-sm font-bold text-muted">Nenhum cliente cadastrado.</p>
          <p className="text-xs text-muted mt-1">Adicione em Workspaces → Novo cliente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map(client => (
            <ClientRow
              key={client.id}
              client={client}
              conn={connections[client.id]}
              onConnect={c => setModal(c)}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ConnectModal
            client={modal}
            onClose={() => setModal(null)}
            onConnected={handleConnected}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
