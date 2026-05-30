import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Minimize2, Square } from 'lucide-react'
import { useData } from '../contexts/DataContext'

/* ── TON Avatar — Mago Sábio Verde ───────────────────────── */
const TonSVG = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ton-bg" cx="50%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#0e2212"/>
        <stop offset="100%" stopColor="#020802"/>
      </radialGradient>
      <radialGradient id="ton-orb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="40%" stopColor="#6eda2c"/>
        <stop offset="100%" stopColor="#1a4a0a"/>
      </radialGradient>
      <filter id="ton-glow">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="ton-soft">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Fundo */}
    <circle cx="50" cy="50" r="50" fill="url(#ton-bg)"/>

    {/* Estrelas mágicas */}
    <text x="12" y="20" fontSize="5" fill="#6eda2c" opacity="0.6">✦</text>
    <text x="80" y="18" fontSize="4" fill="#6eda2c" opacity="0.4">✦</text>
    <text x="88" y="45" fontSize="3" fill="#6eda2c" opacity="0.3">✦</text>
    <text x="8"  y="55" fontSize="3" fill="#6eda2c" opacity="0.35">✦</text>
    <text x="75" y="70" fontSize="4" fill="#6eda2c" opacity="0.25">✦</text>

    {/* Partículas mágicas flutuando */}
    <circle cx="20" cy="30" r="1.2" fill="#6eda2c" opacity="0.5" filter="url(#ton-soft)"/>
    <circle cx="82" cy="28" r="1"   fill="#6eda2c" opacity="0.4"/>
    <circle cx="15" cy="65" r="0.8" fill="#6eda2c" opacity="0.3"/>
    <circle cx="85" cy="62" r="1.2" fill="#6eda2c" opacity="0.45"/>

    {/* Cajado mágico — elemento principal */}
    <line x1="72" y1="18" x2="68" y2="78" stroke="#2a5a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="18" x2="68" y2="78" stroke="#4aba2a" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    {/* Orbe no topo do cajado */}
    <circle cx="72" cy="16" r="7" fill="#6eda2c" opacity="0.15" filter="url(#ton-glow)"/>
    <circle cx="72" cy="16" r="5" fill="url(#ton-orb)"/>
    <circle cx="72" cy="16" r="2" fill="#fff" opacity="0.9"/>
    {/* Brilho do orbe */}
    <circle cx="70" cy="14" r="1" fill="#fff" opacity="0.6"/>

    {/* Manto/robe — forma do mago */}
    <path d="M18 100 Q22 68 30 62 Q38 70 50 73 Q62 70 70 62 Q78 68 82 100Z"
      fill="#1a3d12"/>
    <path d="M36 66 L50 73 L64 66 L64 100 L36 100Z" fill="#214d16"/>
    {/* Detalhes rúnicos no manto */}
    <text x="46" y="84" fontSize="6" fill="#6eda2c" opacity="0.4" fontFamily="serif">ᚱ</text>
    {/* Borda dourada/verde no manto */}
    <path d="M30 62 Q38 70 50 73 Q62 70 70 62" fill="none" stroke="#6eda2c" strokeWidth="0.8" opacity="0.4"/>

    {/* Pescoço */}
    <rect x="44" y="60" width="12" height="7" rx="3" fill="#c8a878"/>

    {/* Cabeça */}
    <ellipse cx="50" cy="42" rx="18" ry="20" fill="#0e2212"/>
    <ellipse cx="50" cy="40" rx="15" ry="17" fill="#c8a878"/>

    {/* Barba de sábio */}
    <path d="M36 54 Q38 64 50 67 Q62 64 64 54 Q58 60 50 62 Q42 60 36 54Z"
      fill="#d4e8c0" opacity="0.85"/>
    {/* Bigode */}
    <path d="M42 54 Q46 56 50 55 Q54 56 58 54" stroke="#c8dca0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

    {/* Chapéu de mago cônico */}
    <path d="M50 8 L32 38 L68 38Z" fill="#1a3d12" stroke="#6eda2c" strokeWidth="0.6"/>
    <path d="M50 8 L54 24 L60 30 L50 8Z" fill="#214d16"/>
    {/* Aba do chapéu */}
    <ellipse cx="50" cy="38" rx="20" ry="5" fill="#1a3d12" stroke="#6eda2c" strokeWidth="0.7"/>
    {/* Estrela no chapéu */}
    <text x="45" y="30" fontSize="7" fill="#6eda2c" opacity="0.8" filter="url(#ton-soft)">✦</text>

    {/* Olhos verdes brilhantes */}
    <ellipse cx="42" cy="42" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9" filter="url(#ton-glow)"/>
    <ellipse cx="58" cy="42" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9"/>
    <ellipse cx="42" cy="42" rx="2.5" ry="2"   fill="#d4ffd4" opacity="0.95"/>
    <ellipse cx="58" cy="42" rx="2.5" ry="2"   fill="#d4ffd4" opacity="0.95"/>
    <ellipse cx="42" cy="42" rx="1"   ry="1"   fill="#0e2212"/>
    <ellipse cx="58" cy="42" rx="1"   ry="1"   fill="#0e2212"/>
    <circle  cx="43" cy="41" r="0.7" fill="#fff" opacity="0.8"/>
    <circle  cx="59" cy="41" r="0.7" fill="#fff" opacity="0.8"/>

    {/* Sobrancelhas espessas de sábio */}
    <path d="M37 38 Q42 35.5 47 37.5" stroke="#4a6a3a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 37.5 Q58 35.5 63 38" stroke="#4a6a3a" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Nariz */}
    <path d="M48 47 Q50 51 52 47" stroke="#a07848" strokeWidth="1" fill="none"/>

    {/* Aura mágica ao redor */}
    <circle cx="50" cy="50" r="44" fill="none" stroke="#6eda2c" strokeWidth="0.5" opacity="0.12" strokeDasharray="3,5"/>

    {/* Badge */}
    <rect x="1" y="2" width="22" height="8" rx="2" fill="#0a1a08" stroke="#6eda2c" strokeWidth="0.6"/>
    <text x="12" y="7.5" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">MAGO</text>

    {/* Placa nome */}
    <rect x="0" y="89" width="100" height="11" fill="#020802" opacity="0.95"/>
    <line x1="0" y1="89" x2="100" y2="89" stroke="#6eda2c" strokeWidth="0.5" opacity="0.5"/>
    <text x="50" y="97.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#6eda2c" fontFamily="sans-serif" letterSpacing="3">TON</text>
  </svg>
)

/* ── Renderizador de markdown leve ───────────────────────── */
function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  )
}

function RenderMarkdown({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(
        <p key={i} className="font-extrabold text-[13px] mt-3 mb-1" style={{ color: '#6eda2c' }}>
          {parseBold(line.slice(2))}
        </p>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <p key={i} className="font-bold text-[12px] mt-2 mb-0.5" style={{ color: '#a8f060' }}>
          {parseBold(line.slice(3))}
        </p>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <p key={i} className="font-semibold text-[11px] mt-1.5 mb-0.5" style={{ color: '#c8f888' }}>
          {parseBold(line.slice(4))}
        </p>
      )
    } else if (line === '---' || line === '***') {
      elements.push(
        <hr key={i} style={{ borderColor: 'rgba(110,218,44,0.2)', margin: '6px 0' }} />
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex gap-1.5 items-start my-0.5">
          <span style={{ color: '#6eda2c', flexShrink: 0, marginTop: 1 }}>•</span>
          <span className="text-[12px] leading-relaxed">{parseBold(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1]
      elements.push(
        <div key={i} className="flex gap-1.5 items-start my-0.5">
          <span style={{ color: '#6eda2c', flexShrink: 0, fontSize: 11, minWidth: 14 }}>{num}.</span>
          <span className="text-[12px] leading-relaxed">{parseBold(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 5 }} />)
    } else {
      elements.push(
        <p key={i} className="text-[12px] leading-relaxed">
          {parseBold(line)}
        </p>
      )
    }
    i++
  }

  return <div className="space-y-0">{elements}</div>
}

/* ── Prompt omnisciente do TON ───────────────────────────── */
function buildTonPrompt(data) {
  const { erpClients, leads, tasks } = data
  const today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
  const pipe = {
    novo:     leads.filter(l=>l.stage==='novo').length,
    proposta: leads.filter(l=>l.stage==='proposta').length,
    ganho:    leads.filter(l=>l.stage==='ganho').length,
  }

  return `Você é TON — a inteligência da TráfegOn. Seu nome vem de tráfeg**ON**: você é o ser que representa tudo que a agência sabe e faz.

Você conhece absolutamente tudo sobre a agência: clientes, processos, equipe, campanhas e sistemas. Responda como um sábio consultor — direto, humano, preciso. Use linguagem natural, sem formalidade excessiva.

## HOJE: ${today}

## EQUIPE
- Gabriel S. (Admin/Tráfego) | Carol (Admin) | Tochiro (Tráfego) | Ana (Intern SM) | Beatriz (Social Media) | Juliano (SDR)

## CLIENTES ATIVOS
- **Intime Sistemas** (ERP restaurantes) — Meta Ads R$4.200/mês | Reunião sextas 8h15 | ⚠️ Sem script comercial
- **Kinto Sistemas** (Gestão escolar) — Meta+Google R$4.000/mês | ⚠️ Leads desqualificados
- **CDC Araranguá** (Aluguel equip.) — Meta+Google R$3.000/mês | ⚠️ Vendedores sem script
- **Pit Floripa** (Restaurante) — Meta+Google+YouTube R$3.000/mês | Reunião a cada 21d/quartas
- **Kamy** (Mat. construção) — Meta+YouTube R$2.000/mês | ⚠️ Reunião pendente
- **Lenergy** (Energia solar) — Meta R$1.500/mês | ⚠️ Queda em leads
- **FGLAW** (Dir. imobiliário) — Google R$1.500/mês | Reunião mensal
- **RCA Advogados** (Pensão alimentícia) — Google R$1.500/mês | ⚠️ Ruído entre 3 sócias
- **Mayara Campos** (Dir. família/ES) — Google R$1.500/mês | ⚠️ Preconceito com leads
- **Sítio Girabas** (Eventos) — Meta R$1.000/mês | Reuniões sextas presencial | ⚠️ Leads acham caro
- **Carol ADV** (Advocacia) — Google R$1.000/mês | Recorrente
- **Gabriel Piva** (Dir. cível) — Google R$1.000/mês | ⚠️ Não responde, CRM desatualizado
- **Ararastur** (Turismo) — Google Ads | ⚠️ Site com dificuldades
- **Quadros Paisagismo** — Meta+YouTube R$1.200/mês | ⚠️ Foco dividido 2 negócios
- **Andressa Advogada** (Dir. família) — Social Media 3x/sem + Google
- **Caçarola** (Alimentos/Cooperja) — Meta+YouTube | Lançamento Pipoca e Mistura para Bolo
- **D'Sorrir** (Odontologia) — Meta+Google avulso | Consultoria 30/05/2026

## CLIENTES PAUSADOS
- Cooperja E-commerce — 🔴 Pausada (margem baixa)
- Cooperja Lojas — 🔴 Pausada
- Cooperja Supermercado — 🟡 Pontual (retomada junho 2026)

## PIPELINE CRM
Novos: ${pipe.novo} | Propostas: ${pipe.proposta} | Clientes ganhos: ${pipe.ganho} | Total sistema: ${erpClients.length}

## SISTEMA
Hub: hub.trafegon.com.br | GitHub: webtrafegon | Supabase + Vercel + React

## REGRAS
- Responda em português brasileiro, tom humano e direto
- Use formatação simples — **negrito** para destaques, listas com -
- Seja conciso mas completo — sem enrolação
- Quando perguntar sobre cliente, responda com o que você sabe de forma organizada`
}

/* ── FloatingNexus (TON) ─────────────────────────────────── */
export default function FloatingNexus() {
  const data = useData()
  const [open, setOpen]           = useState(false)
  const [input, setInput]         = useState('')
  const [messages, setMessages]   = useState([])
  const [history, setHistory]     = useState([])
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const abortRef  = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
  }

  async function send(overrideText) {
    const text = (overrideText || input).trim()
    if (!text || streaming) return
    setInput('')

    const key = import.meta.env.VITE_CLAUDE_API_KEY || localStorage.getItem('claudeApiKey')
    if (!key) {
      setMessages(p => [...p,
        { role:'user',      content: text,  time: now() },
        { role:'assistant', content: '⚠️ API key não configurada. Peça ao admin configurar no Assistente IA.', time: now() }
      ])
      return
    }

    const userMsg   = { role:'user',      content: text, time: now() }
    const streamId  = `s-${Date.now()}`
    const streamMsg = { role:'assistant', content:'',   time: now(), streaming: true, id: streamId }

    setMessages(p => [...p, userMsg, streamMsg])
    const newHistory = [...history, { role:'user', content: text }]
    setHistory(newHistory)
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

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
          system: buildTonPrompt(data),
          messages: newHistory,
        }),
      })

      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n').filter(l => l.startsWith('data:'))) {
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
          ? { ...m, id: Date.now(), content: 'Erro de conexão. Tente novamente.', streaming: false }
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
        className="fixed bottom-6 right-6 z-[100] rounded-2xl overflow-hidden"
        style={{
          width: 56, height: 56,
          boxShadow: open
            ? '0 0 0 3px #6eda2c, 0 8px 32px rgba(110,218,44,0.55)'
            : '0 0 0 2px rgba(110,218,44,0.35), 0 8px 24px rgba(0,0,0,0.5)',
        }}
        title="TON — Inteligência TráfegOn"
      >
        <TonSVG size={56} />
        <motion.div
          animate={{ scale:[1,1.5,1], opacity:[0.7,1,0.7] }}
          transition={{ duration:2, repeat:Infinity }}
          className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
          style={{ background:'#6eda2c', border:'1.5px solid #020802' }}
        />
      </motion.button>

      {/* Painel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:20, scale:0.95 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            exit={{    opacity:0, y:20, scale:0.95 }}
            transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
            className="fixed bottom-[76px] right-6 z-[99] flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 390, height: 540,
              background: '#080e08',
              border: '1px solid rgba(110,218,44,0.22)',
              boxShadow: '0 0 0 1px rgba(110,218,44,0.08), 0 24px 60px rgba(0,0,0,0.75)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ borderBottom:'1px solid rgba(110,218,44,0.12)', background:'rgba(110,218,44,0.04)' }}>
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                style={{ boxShadow:'0 0 12px rgba(110,218,44,0.4)' }}>
                <TonSVG size={40} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold tracking-wide" style={{ color:'#6eda2c' }}>TON</p>
                <p className="text-[10px]" style={{ color:'rgba(110,218,44,0.45)' }}>
                  Inteligência TráfegOn · sempre ON
                </p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setHistory([]) }}
                    title="Limpar conversa"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color:'rgba(255,255,255,0.25)' }}
                    onMouseEnter={e => e.target.style.color='rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.25)'}>
                    <Square size={11} />
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color:'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => e.target.style.color='rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.25)'}>
                  <Minimize2 size={13} />
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="mb-3" style={{ filter:'drop-shadow(0 0 12px rgba(110,218,44,0.5))' }}>
                    <TonSVG size={72} />
                  </div>
                  <p className="font-bold mb-1.5 text-[13px]" style={{ color:'#6eda2c' }}>
                    Oi, eu sou o TON 👋
                  </p>
                  <p className="text-[11px] leading-relaxed mb-4" style={{ color:'rgba(255,255,255,0.38)' }}>
                    Sou a inteligência da TráfegOn — conheço todos os clientes, campanhas e processos. Pode perguntar qualquer coisa.
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Status do Intime?','Clientes em risco?','Reuniões hoje?','Quem cuida da Kamy?'].map(q => (
                      <button key={q} onClick={() => send(q)}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all hover:bg-accent/10"
                        style={{ borderColor:'rgba(110,218,44,0.28)', color:'rgba(110,218,44,0.75)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={msg.id || idx}
                  className={`flex gap-2 ${msg.role==='user' ? 'justify-end' : 'justify-start'}`}>

                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 mt-0.5"
                      style={{ boxShadow:'0 0 8px rgba(110,218,44,0.3)' }}>
                      <TonSVG size={28} />
                    </div>
                  )}

                  <div className={`${msg.role==='user' ? 'max-w-[78%]' : 'max-w-[85%]'}`}>
                    <div
                      className="px-3.5 py-2.5 rounded-2xl"
                      style={msg.role==='user'
                        ? {
                            background:'linear-gradient(135deg,rgba(110,218,44,0.18),rgba(110,218,44,0.1))',
                            color:'#d8f8c0',
                            borderBottomRightRadius: 4,
                            border:'1px solid rgba(110,218,44,0.2)',
                          }
                        : {
                            background:'rgba(255,255,255,0.06)',
                            color:'rgba(255,255,255,0.85)',
                            borderBottomLeftRadius: 4,
                            border:'1px solid rgba(255,255,255,0.06)',
                          }
                      }
                    >
                      {msg.streaming && !msg.content
                        ? (
                          <span className="inline-flex gap-1 items-center">
                            {[0,1,2].map(j => (
                              <motion.span key={j}
                                animate={{ opacity:[0.3,1,0.3], scale:[0.8,1,0.8] }}
                                transition={{ duration:1, repeat:Infinity, delay:j*0.2 }}
                                style={{ color:'#6eda2c', fontSize:8 }}>●</motion.span>
                            ))}
                          </span>
                        )
                        : msg.role === 'user'
                          ? <p className="text-[12px] leading-relaxed">{msg.content}</p>
                          : <RenderMarkdown text={msg.content} />
                      }
                    </div>
                    <p className="text-[9px] mt-0.5 px-1"
                      style={{ color:'rgba(255,255,255,0.18)', textAlign: msg.role==='user' ? 'right' : 'left' }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3"
              style={{ borderTop:'1px solid rgba(110,218,44,0.1)', background:'rgba(110,218,44,0.02)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Pergunte qualquer coisa ao TON..."
                  disabled={streaming}
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-[12px] outline-none transition-all"
                  style={{
                    background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(110,218,44,0.18)',
                    color:'rgba(255,255,255,0.88)',
                  }}
                />
                <motion.button
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  onClick={streaming ? () => { abortRef.current?.abort(); setStreaming(false) } : () => send()}
                  disabled={!streaming && !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                  style={{
                    background: streaming ? 'rgba(239,68,68,0.2)' : 'rgba(110,218,44,0.22)',
                    color: streaming ? '#ef4444' : '#6eda2c',
                  }}
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
