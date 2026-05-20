import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Send, Paperclip, Smile, Phone, Video,
  MoreVertical, Check, CheckCheck, Circle, MessageSquare, Zap
} from 'lucide-react'
import { conversations, leads } from '../data/mock'

const leadMap = Object.fromEntries(leads.map(l => [l.id, l]))

function formatTime(time) { return time }
function formatDate(date) {
  const d = new Date(date + 'T00:00:00')
  const today = new Date()
  const diff = Math.floor((today - d) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

const platformColors = { whatsapp: '#25d366' }

function ConvItem({ conv, active, onClick }) {
  const contact = leadMap[conv.contactId]
  const last = conv.messages[conv.messages.length - 1]
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-border/30 ${
        active ? 'bg-accent/8 border-l-2 border-l-accent' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent">
          {contact?.name?.[0] ?? '?'}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: platformColors[conv.platform] }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text truncate">{contact?.name}</p>
          <span className="text-[10px] text-muted flex-shrink-0 ml-2">{formatDate(last.date)}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted truncate">
            {last.dir === 'out' ? '↩ ' : ''}{last.isFile ? '📎 Arquivo' : last.text}
          </p>
          {conv.unread > 0 && (
            <span className="ml-2 w-4 h-4 rounded-full bg-accent text-[#15172a] text-[9px] font-extrabold flex items-center justify-center flex-shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Message({ msg, index }) {
  const isOut = msg.dir === 'out'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-1.5`}
    >
      <div
        className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isOut
            ? 'bg-accent text-[#15172a] rounded-br-sm font-medium'
            : 'bg-white text-text rounded-bl-sm border border-border shadow-sm'
        }`}
      >
        {msg.isFile ? (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOut ? 'bg-white/25' : 'bg-accent/10'}`}>
              <Paperclip size={14} className={isOut ? 'text-[#15172a]' : 'text-accent'} />
            </div>
            <span className="text-xs font-semibold">{msg.text}</span>
          </div>
        ) : (
          <span>{msg.text}</span>
        )}
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOut ? 'opacity-70' : 'opacity-50'}`}>
          <span className="text-[10px]">{msg.time}</span>
          {isOut && <CheckCheck size={11} />}
        </div>
      </div>
    </motion.div>
  )
}

function DateDivider({ date }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border/50" />
      <span className="text-[10px] text-muted bg-bg px-2 py-0.5 rounded-full border border-border/50 font-medium">
        {formatDate(date)}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  )
}

export default function Conversas() {
  const [active, setActive] = useState(conversations[0])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [msgs, setMsgs] = useState(
    Object.fromEntries(conversations.map(c => [c.id, c.messages]))
  )
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.id, msgs])

  const filtered = conversations.filter(c => {
    const contact = leadMap[c.contactId]
    return search === '' || contact?.name?.toLowerCase().includes(search.toLowerCase())
  })

  function send() {
    if (!input.trim()) return
    const newMsg = {
      id: Date.now(),
      dir: 'out',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    }
    setMsgs(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), newMsg] }))
    setInput('')
  }

  const contact = active ? leadMap[active.contactId] : null
  const activeMsgs = active ? msgs[active.id] || [] : []

  // Group messages by date
  const grouped = activeMsgs.reduce((acc, msg) => {
    const key = msg.date
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {})

  return (
    <div className="flex h-screen">
      {/* Left: conversation list */}
      <div className="w-72 bg-surface border-r border-border flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-text">Conversas</h1>
            <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-lg px-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent">WhatsApp</span>
            </div>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.map((conv, i) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ConvItem
                  conv={conv}
                  active={active?.id === conv.id}
                  onClick={() => setActive(conv)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total unread badge */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">{conversations.length} conversas ativas</span>
            <span className="text-accent font-bold">
              {conversations.reduce((s, c) => s + c.unread, 0)} não lidas
            </span>
          </div>
        </div>
      </div>

      {/* Right: chat */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 border-b border-border flex items-center gap-4 bg-surface"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent">
                {contact?.name?.[0]}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25d366] border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text">{contact?.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-accent font-medium">{contact?.phone}</p>
                <span className="text-muted">·</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, MoreVertical].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-surface-2">
            {Object.entries(grouped).map(([date, dayMsgs]) => (
              <div key={date}>
                <DateDivider date={date} />
                {dayMsgs.map((msg, i) => (
                  <Message key={msg.id} msg={msg} index={i} />
                ))}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-6 pt-3 pb-1 flex gap-2 overflow-x-auto">
            {['Enviar proposta 📎', 'Agendar reunião 📅', 'Preciso de mais informações', 'Vou verificar e retorno'].map(r => (
              <button
                key={r}
                onClick={() => setInput(r)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:border-accent/40 hover:text-accent transition-all"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border flex items-center gap-3">
            <button className="text-muted hover:text-text-2 transition-colors flex-shrink-0">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Escreva uma mensagem..."
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2 transition-colors">
                <Smile size={16} />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={send}
              disabled={!input.trim()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() ? 'bg-accent text-[#15172a] glow-green' : 'bg-surface border border-border text-muted'
              }`}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col gap-3">
          <MessageSquare size={40} className="text-border" />
          <p className="text-muted text-sm">Selecione uma conversa</p>
        </div>
      )}
    </div>
  )
}
