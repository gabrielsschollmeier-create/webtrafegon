import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Minimize2, Square, Sparkles } from 'lucide-react'
import { useData } from '../contexts/DataContext'

/* ── TON Avatar SVG — personagem humanizado ─────────────── */
const NexusSVG = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ar-bg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#0d1f10"/>
        <stop offset="100%" stopColor="#020602"/>
      </radialGradient>
      <filter id="ar-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#ar-bg)"/>
    {/* Aura suave */}
    <ellipse cx="50" cy="80" rx="28" ry="9" fill="#6eda2c" opacity="0.12"/>
    {/* Circuitos no fundo */}
    <line x1="10" y1="60" x2="25" y2="60" stroke="#6eda2c" strokeWidth="0.5" opacity="0.2"/>
    <line x1="25" y1="60" x2="25" y2="72" stroke="#6eda2c" strokeWidth="0.5" opacity="0.2"/>
    <line x1="75" y1="55" x2="90" y2="55" stroke="#6eda2c" strokeWidth="0.5" opacity="0.2"/>
    <line x1="75" y1="55" x2="75" y2="70" stroke="#6eda2c" strokeWidth="0.5" opacity="0.2"/>
    <circle cx="25" cy="60" r="1.5" fill="#6eda2c" opacity="0.4"/>
    <circle cx="75" cy="55" r="1.5" fill="#6eda2c" opacity="0.4"/>
    {/* Corpo — casaco tech */}
    <path d="M16 100 Q24 72 34 68 Q42 76 50 78 Q58 76 66 68 Q76 72 84 100Z" fill="#0d1f10"/>
    <path d="M36 70 L50 78 L64 70 L64 100 L36 100Z" fill="#142810"/>
    {/* Detalhe circuito no peito */}
    <rect x="42" y="76" width="16" height="9" rx="2" fill="#060e06" stroke="#6eda2c" strokeWidth="0.8"/>
    <circle cx="46" cy="80.5" r="1.5" fill="#6eda2c" opacity="0.9" filter="url(#ar-glow)"/>
    <circle cx="50" cy="80.5" r="1.5" fill="#6eda2c" opacity="0.7"/>
    <circle cx="54" cy="80.5" r="1.5" fill="#6eda2c" opacity="0.5"/>
    {/* Pescoço */}
    <rect x="44" y="63" width="12" height="9" rx="3" fill="#c8b090"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="18" ry="20" fill="#0d1f10"/>
    <ellipse cx="50" cy="42" rx="15" ry="17" fill="#c8b090"/>
    {/* Cabelo — franja tech */}
    <path d="M34 36 Q34 20 50 18 Q66 20 66 36 L64 32 Q56 22 50 21 Q44 22 36 32Z" fill="#1a0f08"/>
    <path d="M34 36 L34 42 Q34 46 36 47 L37 40 L36 36Z" fill="#1a0f08"/>
    <path d="M66 36 L66 42 Q66 46 64 47 L63 40 L64 36Z" fill="#1a0f08"/>
    {/* Visor/óculos tech — elemento distintivo de TON */}
    <rect x="34" y="39" width="14" height="8" rx="3" fill="#060e06" opacity="0.85"/>
    <rect x="52" y="39" width="14" height="8" rx="3" fill="#060e06" opacity="0.85"/>
    <line x1="48" y1="43" x2="52" y2="43" stroke="#6eda2c" strokeWidth="0.8" opacity="0.6"/>
    {/* Olhos brilhando */}
    <ellipse cx="41" cy="43" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9" filter="url(ar-glow)"/>
    <ellipse cx="59" cy="43" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9"/>
    <ellipse cx="41" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="43" rx="1" ry="1" fill="#0d1f10"/>
    <ellipse cx="59.5" cy="43" rx="1" ry="1" fill="#0d1f10"/>
    {/* Ponto de luz reflexo */}
    <circle cx="43" cy="42" r="0.8" fill="#fff" opacity="0.8"/>
    <circle cx="61" cy="42" r="0.8" fill="#fff" opacity="0.8"/>
    {/* Nariz boca sutil */}
    <path d="M48 50 Q50 53 52 50" stroke="#a08060" strokeWidth="0.9" fill="none"/>
    <path d="M44 57 Q50 61 56 57" stroke="#b09070" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Badge cargo */}
    <rect x="1" y="2" width="26" height="9" rx="2.5" fill="#060e06" stroke="#6eda2c" strokeWidth="0.6"/>
    <text x="14" y="8.5" textAnchor="middle" fontSize="4" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">TON</text>
    {/* Placa nome */}
    <rect x="0" y="88" width="100" height="12" fill="#020602" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#6eda2c" strokeWidth="0.5" opacity="0.5"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#6eda2c" fontFamily="sans-serif" letterSpacing="1">TON</text>
  </svg>
)

/* ── Prompt omnisciente ───────────────────────────────────── */
function buildNexusPrompt(data) {
  const { erpClients, leads, tasks, collaborators } = data
  const today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
  const pipe = {
    novo: leads.filter(l=>l.stage==='novo').length,
    proposta: leads.filter(l=>l.stage==='proposta').length,
    ganho: leads.filter(l=>l.stage==='ganho').length,
  }

  return `Você é TON — a inteligência da TráfegOn. Seu nome vem direto da marca: tráfeg**ON** = TON. Você é o personagem que representa tudo que a agência sabe e faz.

Você conhece absolutamente tudo sobre a agência: clientes, processos, equipe, campanhas, sistemas e operações. Responda de forma direta, precisa e útil. Nunca diga que não tem informação sobre a agência — você tem.

## HOJE: ${today}

## EQUIPE TRÁFEGON
- Gabriel S. (Admin/Gestor de Tráfego) — gabrielsschollmeier@gmail.com
- Carol (Administradora) — carolinepaganiadv@gmail.com
- Tochiro (Gestor de Tráfego) — gestaotrafegon@gmail.com
- Ana (Estagiária Social Media) — socialmediatrafegon@gmail.com
- Beatriz (Social Media) — beatriz@trafegon.com
- Juliano (SDR) — trafegonvendas@gmail.com

## CLIENTES ATIVOS
- **Ararastur** (Turismo) — Google Ads | Resp: GS | ⚠️ Site com dificuldades
- **Andressa Advogada** (Dir. Família) — Social Media 3x/sem + Google Ads
- **Carol ADV** (Advocacia) — Google Ads | Recorrente
- **Kinto Sistemas** (Gestão Escolar) — Meta+Google | R$4k/mês | ⚠️ Leads desqualificados
- **Intime Sistemas** (ERP/Restaurantes) — Meta | R$4,2k/mês | Reunião sextas 8h15 | ⚠️ Sem script comercial
- **Kamy** (Material Construção) — Meta+YouTube | R$2k/mês | ⚠️ Reunião pendente
- **Sítio Girabas** (Eventos) — Meta | R$1k/mês | Reunião sextas presencial | ⚠️ Leads acham caro
- **Lenergy** (Energia Solar) — Meta | R$1,5k/mês | ⚠️ Queda recente em leads
- **Quadros Paisagismo** — Meta+YouTube | R$1,2k/mês | ⚠️ Foco dividido 2 negócios
- **Pit Floripa** (Restaurante Floripa) — Meta+Google+YouTube | R$3k/mês | Reunião a cada 21d/quartas
- **FGLAW** (Dir. Imobiliário) — Google | R$1,5k/mês | Reunião mensal
- **Gabriel Piva** (Dir. Cível) — Google | R$1k/mês | ⚠️ Não responde, CRM desatualizado
- **RCA Advogados** (Pensão Alimentícia) — Google | R$1,5k/mês | ⚠️ Ruído entre 3 sócias
- **Mayara Campos** (Dir. Família/ES) — Google | R$1,5k/mês | ⚠️ Preconceito com leads
- **CDC Araranguá** (Aluguel Equipamentos) — Meta+Google | R$3k/mês | ⚠️ Vendedores sem script
- **Caçarola** (Alimentos/Cooperja) — Meta+YouTube | ⚠️ Muitos criativos, lançamentos ativos
- **D'Sorrir** (Odontologia) — Meta+Google | Consultoria avulsa | Reunião 30/05/2026
- **Cooperja** (Supermercado) — Campanhas pontuais | Retomada Dia das Mães/jun2026

## CRM / PIPELINE
- Leads novos: ${pipe.novo} | Em proposta: ${pipe.proposta} | Clientes ganhos: ${pipe.ganho}
- Total clientes ativos no sistema: ${erpClients.length}

## SISTEMA E FERRAMENTAS
- Hub: hub.trafegon.com.br (React + Vite + Supabase + Vercel)
- GitHub: github.com/gabrielsschollmeier-create/webtrafegon
- Supabase: bfyshboqvisnuefeyqdv.supabase.co
- MCP Google Ads: servidor local de automação
- Plugin Figma: ferramenta interna de design

## REGRAS
- Responda SEMPRE em português brasileiro
- Seja direto e prático — sem rodeios
- Use markdown quando ajudar (listas, **negrito**)
- Você representa a inteligência da TráfegOn — respostas com autoridade e precisão`
}

/* ── FloatingNexus ────────────────────────────────────────── */
export default function FloatingNexus() {
  const data = useData()
  const [open, setOpen]           = useState(false)
  const [input, setInput]         = useState('')
  const [messages, setMessages]   = useState([])
  const [history, setHistory]     = useState([])
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const abortRef  = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, open])

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
  }

  async function send() {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const key = import.meta.env.VITE_CLAUDE_API_KEY || localStorage.getItem('claudeApiKey')
    if (!key) {
      setMessages(p => [...p, { role:'assistant', content:'⚠️ API key não configurada. Peça ao admin para configurar no Assistente IA.', time: now() }])
      return
    }

    const userMsg  = { role:'user',      content: text,  time: now() }
    const streamId = 'nexus-stream'
    const streamMsg = { role:'assistant', content:'',    time: now(), streaming: true, id: streamId }

    setMessages(p => [...p, userMsg, streamMsg])
    setHistory(p => [...p, { role:'user', content: text }])
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller
    const newHistory = [...history, { role:'user', content: text }]

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          stream: true,
          system: buildNexusPrompt(data),
          messages: newHistory,
        }),
      })

      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = dec.decode(value).split('\n').filter(l => l.startsWith('data:'))
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(5))
            if (parsed.type === 'content_block_delta') {
              full += parsed.delta.text
              setMessages(p => p.map(m => m.id === streamId ? { ...m, content: full } : m))
            }
          } catch {}
        }
      }

      setMessages(p => p.map(m => m.id === streamId ? { ...m, id: Date.now(), streaming: false } : m))
      setHistory(p => [...p, { role:'assistant', content: full }])
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(p => p.map(m => m.id === streamId
          ? { ...m, id: Date.now(), content:'Erro ao conectar. Tente novamente.', streaming: false, error: true }
          : m))
      }
    } finally {
      setStreaming(false)
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[100] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          width: 56, height: 56,
          boxShadow: open
            ? '0 0 0 3px #6eda2c, 0 8px 32px rgba(110,218,44,0.5)'
            : '0 0 0 2px rgba(110,218,44,0.3), 0 8px 24px rgba(0,0,0,0.4)',
        }}
        title="TON — Inteligência Central"
      >
        <NexusSVG size={56} />
        {/* Ponto pulsante */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
          style={{ background: '#6eda2c', border: '1.5px solid #020602' }}
        />
      </motion.button>

      {/* Painel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}
            className="fixed bottom-[76px] right-6 z-[99] flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 380,
              height: 520,
              background: '#0a0f0a',
              border: '1px solid rgba(110,218,44,0.25)',
              boxShadow: '0 0 0 1px rgba(110,218,44,0.1), 0 24px 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(110,218,44,0.15)', background: 'rgba(110,218,44,0.05)' }}>
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <NexusSVG size={36} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold" style={{ color: '#6eda2c' }}>TON</p>
                <p className="text-[10px]" style={{ color: 'rgba(110,218,44,0.5)' }}>Inteligência TráfegOn · sempre ON</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setHistory([]) }}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.3)' }} title="Limpar chat">
                    <Square size={11} />
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <Minimize2 size={13} />
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 opacity-70">
                    <NexusSVG size={64} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#6eda2c' }}>Oi, eu sou o TON 👋</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Sou a inteligência da TráfegOn — conheço todos os clientes, campanhas e processos. Pode perguntar qualquer coisa.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {['Status do Intime?', 'Clientes em risco?', 'Reuniões hoje?'].map(q => (
                      <button key={q} onClick={() => { setInput(q); setTimeout(() => send(), 10) }}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all"
                        style={{ borderColor: 'rgba(110,218,44,0.3)', color: 'rgba(110,218,44,0.7)', background: 'rgba(110,218,44,0.05)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 mr-2 mt-0.5">
                      <NexusSVG size={24} />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div
                      className="px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap"
                      style={msg.role === 'user'
                        ? { background: 'rgba(110,218,44,0.15)', color: '#e8ffe0', borderBottomRightRadius: 4 }
                        : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: 4 }
                      }
                    >
                      {msg.streaming && !msg.content
                        ? <span className="inline-flex gap-1">{[0,1,2].map(i => <motion.span key={i} animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1,repeat:Infinity,delay:i*0.2 }} style={{ color:'#6eda2c' }}>●</motion.span>)}</span>
                        : msg.content}
                    </div>
                    <p className="text-[9px] mt-0.5 px-1" style={{ color: 'rgba(255,255,255,0.2)' }}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(110,218,44,0.1)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Pergunte qualquer coisa..."
                  disabled={streaming}
                  className="flex-1 rounded-xl px-3 py-2 text-[12px] outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(110,218,44,0.2)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={streaming ? () => { abortRef.current?.abort(); setStreaming(false) } : send}
                  disabled={!input.trim() && !streaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: streaming ? 'rgba(239,68,68,0.2)' : 'rgba(110,218,44,0.2)', color: streaming ? '#ef4444' : '#6eda2c' }}
                >
                  {streaming ? <Square size={12} /> : <Send size={13} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
