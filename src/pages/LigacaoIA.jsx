import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, PhoneCall, PhoneOff, Mic, Settings, Zap,
  CheckCircle, XCircle, Clock, Eye, EyeOff, Copy,
  Play, Pause, ToggleLeft, ToggleRight, ChevronDown,
  FileText, BarChart2, AlertTriangle, Volume2, RefreshCw
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

/* ── Mock call log ────────────────────────── */
const CALL_LOG = [
  {
    id: 1, leadName: 'Livianne Alcântara', phone: '+5547999990001',
    status: 'atendeu', duration: '2m 34s', at: '18/05 09:14',
    outcome: 'Interesse confirmado — agendou reunião para 20/05',
    transcript: 'IA: Olá, posso falar com a Livianne? Livianne: Sim, sou eu. IA: Que ótimo! Sou a assistente da TráfegOn, agência que entrou em contato pelo anúncio. Você tem 2 minutinhos pra eu apresentar como ajudamos negócios de moda a vender mais pelo Instagram?...',
    score: 92,
  },
  {
    id: 2, leadName: 'RT Publicidade', phone: '+5547999990002',
    status: 'caixa-postal', duration: '0m 18s', at: '18/05 09:31',
    outcome: 'Deixou recado na caixa postal — retornar manualmente',
    transcript: null,
    score: null,
  },
  {
    id: 3, leadName: 'Marcos Teixeira', phone: '+5548991234567',
    status: 'atendeu', duration: '4m 11s', at: '17/05 14:22',
    outcome: 'Pediu proposta por e-mail — interesse em gestão Google Ads',
    transcript: 'IA: Olá, aqui é a assistente da TráfegOn. Marcos Teixeira? Marcos: É, quem fala? IA: Olá Marcos! Vi que você se cadastrou no nosso formulário. Você tem interesse em crescer no digital através de anúncios no Google?...',
    score: 78,
  },
  {
    id: 4, leadName: 'Mariana Costa', phone: '+5547999990012',
    status: 'nao-atendeu', duration: '0m 00s', at: '17/05 11:05',
    outcome: 'Não atendeu — retentar em 2h',
    transcript: null,
    score: null,
  },
  {
    id: 5, leadName: 'Pedro Alves', phone: '+5547999990013',
    status: 'atendeu', duration: '1m 52s', at: '16/05 16:44',
    outcome: 'Desqualificado — orçamento abaixo do mínimo',
    transcript: 'IA: Oi Pedro! Aqui é a TráfegOn, você se cadastrou no nosso formulário sobre gestão de tráfego. Tem 2 min? Pedro: Sim. IA: Qual o investimento mensal que você tem disponível para anúncios?...',
    score: 35,
  },
]

const VOICES = [
  { id: 'pt-BR-FemaleA', label: 'Ana — Feminina, profissional', provider: 'ElevenLabs' },
  { id: 'pt-BR-MaleA',   label: 'Carlos — Masculino, consultivo', provider: 'ElevenLabs' },
  { id: 'pt-BR-FemaleB', label: 'Julia — Feminina, jovem e dinâmica', provider: 'ElevenLabs' },
  { id: 'openai-alloy',  label: 'Alloy (PT-BR) — OpenAI', provider: 'OpenAI' },
]

const STATUS_CONFIG = {
  'atendeu':      { label: 'Atendeu',       color: '#6eda2c', icon: CheckCircle },
  'nao-atendeu':  { label: 'Não atendeu',   color: '#8890b5', icon: XCircle },
  'caixa-postal': { label: 'Caixa postal',  color: '#ea8a29', icon: Volume2 },
  'ocupado':      { label: 'Ocupado',       color: '#ef4444', icon: PhoneOff },
}

const DEFAULT_SCRIPT = `Olá, posso falar com {{nome}}?

[Aguardar confirmação]

Que ótimo! Aqui é {{agente}}, da TráfegOn — agência de tráfego pago. Vi que você se cadastrou pelo nosso formulário, tudo bem?

[Aguardar resposta]

Excelente! Ligamos porque trabalhamos com empresas do {{nicho}} e estamos ajudando a aumentar vendas através de anúncios no Google e Instagram. Você tem uns 2 minutinhos para eu entender melhor o seu negócio?

[Se SIM → qualificação]
— Qual o principal objetivo com anúncios: mais clientes, mais vendas online ou aumentar reconhecimento?
— Você já investe em anúncios hoje?
— Qual o orçamento mensal disponível?

[Conclusão]
Perfeito! Com base no que você me contou, acredito que posso ajudar muito. Vou passar seu contato para nosso consultor que vai preparar uma análise personalizada. Ele entra em contato ainda hoje, tudo bem?`

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '15' }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-text leading-tight">{value}</p>
        <p className="text-xs font-semibold text-text-2">{label}</p>
        {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function CallRow({ call, index }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const status = STATUS_CONFIG[call.status]
  const Icon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border/40 last:border-0"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] transition-colors">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: status.color + '15' }}>
          <Icon size={14} style={{ color: status.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text truncate">{call.leadName}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: status.color + '15', color: status.color }}>
              {status.label}
            </span>
            {call.score !== null && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: call.score >= 70 ? '#6eda2c15' : call.score >= 40 ? '#ea8a2915' : '#ef444415',
                  color: call.score >= 70 ? '#6eda2c' : call.score >= 40 ? '#ea8a29' : '#ef4444',
                }}>
                Score {call.score}
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5 truncate">{call.outcome}</p>
        </div>

        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs font-semibold text-text-2">{call.duration}</p>
          <p className="text-[10px] text-muted">{call.at}</p>
        </div>

        {call.transcript && (
          <button
            onClick={() => setShowTranscript(v => !v)}
            className="flex items-center gap-1 text-[11px] text-accent font-semibold hover:text-accent-hover transition-colors flex-shrink-0"
          >
            <FileText size={11} />
            <span className="hidden sm:inline">Transcript</span>
            <ChevronDown size={10} className={`transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showTranscript && call.transcript && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 bg-bg border border-border/60 rounded-xl p-4">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Transcrição da ligação</p>
              <p className="text-xs text-text-2 leading-relaxed font-mono whitespace-pre-wrap">{call.transcript}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function LigacaoIA() {
  const { leads } = useData()
  const [apiKey, setApiKey]           = useState('')
  const [showKey, setShowKey]         = useState(false)
  const [phone, setPhone]             = useState('+5547')
  const [voice, setVoice]             = useState('pt-BR-FemaleA')
  const [autoCall, setAutoCall]       = useState(true)
  const [delaySeconds, setDelaySeconds] = useState(30)
  const [script, setScript]           = useState(DEFAULT_SCRIPT)
  const [activeTab, setActiveTab]     = useState('log')
  const [testLeadId, setTestLeadId]   = useState('')
  const [calling, setCalling]         = useState(false)
  const [saved, setSaved]             = useState(false)

  const newLeadsToday = leads.filter(l =>
    l.stage === 'novo' && l.createdAt === '2026-05-20'
  ).length

  function handleTestCall() {
    if (!testLeadId) return
    setCalling(true)
    setTimeout(() => setCalling(false), 3000)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function copyWebhookUrl() {
    navigator.clipboard.writeText('https://crm.trafegon.com.br/api/auto-call/trigger')
  }

  return (
    <div className="p-4 lg:p-8">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6eda2c] to-[#60a5fa] flex items-center justify-center">
              <PhoneCall size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text flex items-center gap-2">
                Ligação IA
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6eda2c]/15 text-[#6eda2c]">
                  via Vapi.ai
                </span>
              </h1>
              <p className="text-sm text-muted">Ligação automática em novos leads · IA em português</p>
            </div>
          </div>

          {/* Auto-call toggle */}
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-2.5">
            <div>
              <p className="text-xs font-bold text-text">Auto-call</p>
              <p className="text-[10px] text-muted">Liga ao entrar novo lead</p>
            </div>
            <button onClick={() => setAutoCall(v => !v)} className="flex-shrink-0">
              {autoCall
                ? <ToggleRight size={28} className="text-[#6eda2c]" />
                : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={PhoneCall} label="Ligações hoje"        value="4"    color="#6eda2c" sub="de 5 leads novos" />
        <StatCard icon={CheckCircle} label="Taxa de atendimento" value="62%"  color="#60a5fa" sub="3 de 5 atenderam" />
        <StatCard icon={Clock}      label="Duração média"        value="2m 52s" color="#ea8a29" sub="por chamada" />
        <StatCard icon={BarChart2}  label="Qualificados"         value="2"    color="#be29ec" sub="score ≥ 70" />
      </div>

      {/* ── Auto-call alert ── */}
      {autoCall && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[#6eda2c]/8 border border-[#6eda2c]/25 rounded-xl p-4 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[#6eda2c] animate-pulse flex-shrink-0" />
          <p className="text-sm text-text flex-1">
            <strong className="text-[#6eda2c]">Auto-call ativo.</strong> Novos leads entram no pipeline e
            recebem ligação automática em <strong>{delaySeconds}s</strong>.
            {newLeadsToday > 0 && ` · ${newLeadsToday} lead(s) novo(s) hoje.`}
          </p>
          <span className="text-xs font-bold text-[#6eda2c] bg-[#6eda2c]/15 px-2.5 py-1 rounded-full flex-shrink-0">
            LIVE
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: Config ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Vapi config */}
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={14} className="text-accent" />
              <p className="text-sm font-bold text-text">Configuração Vapi.ai</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                  API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="vapi_xxxxxxxxxxxxxxxx"
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text font-mono placeholder:text-muted focus:outline-none focus:border-accent/50 pr-8"
                    />
                    <button
                      onClick={() => setShowKey(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text-2"
                    >
                      {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-muted mt-1">
                  Obtenha em <span className="text-accent font-medium">dashboard.vapi.ai</span>
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Número de Saída (Caller ID)
                </label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+5547999990000"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent/50"
                />
                <p className="text-[10px] text-muted mt-1">Número registrado no Vapi como Phone Number</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Voz da IA
                </label>
                <select
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent/50"
                >
                  {VOICES.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Delay após lead entrar (segundos)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="5" max="300" step="5"
                    value={delaySeconds}
                    onChange={e => setDelaySeconds(Number(e.target.value))}
                    className="flex-1 accent-accent"
                  />
                  <span className="text-xs font-bold text-text w-10 text-right">{delaySeconds}s</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: saved ? '#6eda2c20' : '#6eda2c', color: saved ? '#6eda2c' : '#15172a' }}
              >
                {saved ? <><CheckCircle size={13} /> Salvo!</> : 'Salvar configurações'}
              </motion.button>
            </div>
          </div>

          {/* Test call */}
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Mic size={14} className="text-[#be29ec]" />
              <p className="text-sm font-bold text-text">Testar ligação</p>
            </div>
            <div className="space-y-3">
              <select
                value={testLeadId}
                onChange={e => setTestLeadId(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent/50"
              >
                <option value="">Selecione um lead para testar...</option>
                {leads.filter(l => l.pipelineId === 1).map(l => (
                  <option key={l.id} value={l.id}>{l.name} · {l.phone}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleTestCall}
                disabled={!testLeadId || calling}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#be29ec]/15 text-[#be29ec] hover:bg-[#be29ec]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {calling
                  ? <><RefreshCw size={12} className="animate-spin" /> Ligando...</>
                  : <><Phone size={12} /> Fazer ligação de teste</>}
              </motion.button>
            </div>
          </div>

          {/* Webhook URL */}
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-accent" />
              <p className="text-sm font-bold text-text">Webhook de resultado</p>
            </div>
            <p className="text-[11px] text-muted mb-3">
              Configure este endpoint no Vapi para receber transcrições e resultados automaticamente no CRM.
            </p>
            <div className="flex gap-2">
              <code className="flex-1 text-[10px] font-mono bg-bg border border-border rounded-lg px-3 py-2 text-accent truncate">
                https://crm.trafegon.com.br/api/vapi/webhook
              </code>
              <button
                onClick={copyWebhookUrl}
                className="flex-shrink-0 p-2 text-muted hover:text-text-2 bg-bg border border-border rounded-lg transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Script + Log ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'log',    label: 'Log de ligações', icon: PhoneCall },
              { id: 'script', label: 'Script da IA',    icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-[#15172a]'
                    : 'bg-white border border-border text-muted hover:text-text-2'
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'log' && (
              <motion.div
                key="log"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white border border-border rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <p className="text-sm font-bold text-text">Chamadas recentes</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{CALL_LOG.length} chamadas</span>
                    <button className="text-muted hover:text-text-2 transition-colors">
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  {CALL_LOG.map((call, i) => (
                    <CallRow key={call.id} call={call} index={i} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'script' && (
              <motion.div
                key="script"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white border border-border rounded-xl p-5 space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-text">Script de abertura</p>
                    <div className="flex gap-1.5">
                      {['{{nome}}', '{{agente}}', '{{nicho}}'].map(v => (
                        <button
                          key={v}
                          onClick={() => setScript(s => s + v)}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#be29ec]/10 text-[#be29ec] hover:bg-[#be29ec]/20 transition-colors"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={script}
                    onChange={e => setScript(e.target.value)}
                    rows={18}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-xs text-text font-mono leading-relaxed focus:outline-none focus:border-accent/50 resize-none"
                    placeholder="Escreva o script que a IA vai seguir..."
                  />
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-accent hover:bg-accent-hover text-[#15172a] transition-all"
                  >
                    {saved ? 'Script salvo!' : 'Salvar script'}
                  </motion.button>
                  <button
                    onClick={() => setScript(DEFAULT_SCRIPT)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-bg border border-border text-muted hover:text-text-2 transition-colors"
                  >
                    Restaurar padrão
                  </button>
                </div>

                <div className="bg-[#ea8a29]/8 border border-[#ea8a29]/25 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={13} className="text-[#ea8a29]" />
                    <p className="text-xs font-bold text-text">Boas práticas</p>
                  </div>
                  <ul className="space-y-1 text-xs text-muted">
                    <li>• Identifique a IA como assistente virtual logo na abertura</li>
                    <li>• Peça permissão antes de continuar ("tem 2 minutos?")</li>
                    <li>• Use pausas marcadas como [Aguardar resposta]</li>
                    <li>• Qualifique antes de falar de preço (BANT/SPIN)</li>
                    <li>• Sempre transfira para humano se o lead mostrar interesse forte</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-xs font-bold text-text-2 uppercase tracking-wider mb-4">Como funciona</p>
            <div className="grid grid-cols-4 gap-2 relative">
              {[
                { step: '1', label: 'Lead entra no CRM', color: '#60a5fa', icon: Zap },
                { step: '2', label: `IA liga em ${delaySeconds}s`, color: '#be29ec', icon: Phone },
                { step: '3', label: 'Conversa + qualificação', color: '#ea8a29', icon: Mic },
                { step: '4', label: 'Transcript no CRM', color: '#6eda2c', icon: FileText },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: s.color + '15' }}>
                      <Icon size={15} style={{ color: s.color }} />
                    </div>
                    <p className="text-[10px] text-muted leading-snug">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
