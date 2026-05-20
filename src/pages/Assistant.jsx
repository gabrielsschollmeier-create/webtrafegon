import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, Bot, User, Copy, CheckCircle, Zap,
  Target, TrendingUp, Settings2, Users2, BarChart2,
  FileText, Megaphone, Search, AlertTriangle,
  ListChecks, DollarSign, RefreshCw, ChevronDown,
  Key, Eye, EyeOff, X, Calendar, Activity, Square
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

/* ── Personas ──────────────────────────────── */
const ROLES = [
  { id: 'coo',    label: 'COO',               color: '#60a5fa', icon: Settings2  },
  { id: 'sales',  label: 'Diretor de Vendas',  color: '#6eda2c', icon: DollarSign },
  { id: 'hybrid', label: 'Híbrido',            color: '#be29ec', icon: Sparkles   },
]

const LEVELS = [
  { id: 'estrategico', label: 'Estratégico', sub: '6–18 meses',  color: '#ef4444' },
  { id: 'tatico',      label: 'Tático',      sub: '1–6 meses',   color: '#ea8a29' },
  { id: 'operacional', label: 'Operacional', sub: 'Dia a dia',   color: '#6eda2c' },
]

/* ── Quick actions por role+level ──────────── */
const ACTIONS = {
  coo: {
    estrategico: [
      { id: 'okr',      icon: Target,       label: 'Definir OKRs',          prompt: 'Monte os OKRs da agência TráfegOn para o próximo semestre. Inclua metas de receita, retenção, capacidade de equipe e qualidade de entrega.' },
      { id: 'pricing',  icon: DollarSign,   label: 'Estrutura de Preços',   prompt: 'Audite e proponha uma estrutura de precificação para a agência. Considere custos operacionais, margem desejada, mercado e posicionamento.' },
      { id: 'expand',   icon: TrendingUp,   label: 'Plano de Expansão',     prompt: 'Crie um plano de expansão da agência para os próximos 12 meses: novos serviços, contratações necessárias e metas de receita.' },
      { id: 'icp',      icon: Users2,       label: 'Perfil de Cliente Ideal', prompt: 'Com base nos clientes atuais, defina o ICP da TráfegOn. Quais nichos priorizar e por quê?' },
    ],
    tatico: [
      { id: 'process',  icon: ListChecks,   label: 'Revisar Processos',     prompt: 'Analise os processos de onboarding, entrega e relatório da agência. Identifique gargalos e proponha melhorias concretas.' },
      { id: 'capacity', icon: Users2,       label: 'Capacidade da Equipe',  prompt: 'Analise a capacidade atual da equipe: clientes por colaborador, entregas pendentes e risco de sobrecarga. Recomende ajustes.' },
      { id: 'kpi',      icon: BarChart2,    label: 'Definir KPIs',          prompt: 'Defina os KPIs operacionais da agência por área: atendimento, produção e gestão de tráfego. Inclua metas e como medir.' },
      { id: 'quality',  icon: CheckCircle,  label: 'Checklist de Qualidade', prompt: 'Crie um checklist de qualidade para as entregas da agência: landing pages, relatórios, criativos e copy.' },
    ],
    operacional: [
      { id: 'standup',  icon: Zap,          label: 'Briefing de Standup',   prompt: 'Crie a pauta para o standup de equipe de hoje com base no contexto atual: prioridades, bloqueios e status das entregas.' },
      { id: 'sprint',   icon: ListChecks,   label: 'Sprint da Semana',      prompt: 'Monte o sprint semanal da equipe com base nos clientes e entregas pendentes. Priorize por impacto e urgência.' },
      { id: 'bottleneck', icon: AlertTriangle, label: 'Resolver Gargalo',   prompt: 'Identifique os principais gargalos operacionais da agência hoje e proponha 3 soluções rápidas e aplicáveis.' },
      { id: 'feedback', icon: Users2,       label: 'Feedback de Equipe',    prompt: 'Estruture uma sessão de feedback 1:1 eficaz para colaboradores. Inclua perguntas, formato e como documentar.' },
    ],
  },
  sales: {
    estrategico: [
      { id: 'strategy', icon: Target,       label: 'Estratégia de Vendas',  prompt: 'Crie a estratégia de vendas da TráfegOn para o próximo trimestre. Inclua meta, canais, ICP, abordagem e métricas de sucesso.' },
      { id: 'product',  icon: Sparkles,     label: 'Novo Produto/Serviço',  prompt: 'Proponha um novo produto ou pacote de serviços que a agência pode lançar. Baseie-se nas tendências atuais de marketing digital e nas dores dos clientes.' },
      { id: 'retention',icon: RefreshCw,    label: 'Estratégia de Retenção', prompt: 'Crie uma estratégia completa de retenção de clientes: como reduzir churn, aumentar LTV e identificar sinais de risco precocemente.' },
      { id: 'forecast', icon: TrendingUp,   label: 'Forecast de Receita',   prompt: 'Faça um forecast de receita para os próximos 3 meses com base no pipeline atual e histórico da agência.' },
    ],
    tatico: [
      { id: 'pipeline', icon: BarChart2,    label: 'Revisar Pipeline',      prompt: 'Analise o pipeline CRM atual. Quais leads priorizar? Qual estratégia para mover cada etapa? O que está travado?' },
      { id: 'proposal', icon: FileText,     label: 'Proposta Comercial',    prompt: 'Crie uma proposta comercial completa. Inclua diagnóstico, solução proposta, investimento, ROI estimado e próximos passos.' },
      { id: 'script',   icon: Megaphone,    label: 'Script de Qualificação', prompt: 'Crie um script de qualificação de leads (SPIN ou BANT) adaptado para venda de gestão de tráfego pago. Inclua perguntas-chave e gatilhos de decisão.' },
      { id: 'upsell',   icon: DollarSign,   label: 'Estratégia de Upsell',  prompt: 'Identifique oportunidades de upsell nos clientes ativos e crie um pitch específico para cada oportunidade.' },
    ],
    operacional: [
      { id: 'followup', icon: Zap,          label: 'Follow-up de Lead',     prompt: 'Crie uma mensagem de follow-up para um lead que recebeu proposta e não respondeu. Deve ser direta, sem pressão e com CTA claro.' },
      { id: 'objection',icon: AlertTriangle, label: 'Responder Objeção',    prompt: 'Me ajude a responder a seguinte objeção de forma consultiva e avançar na negociação: "' },
      { id: 'daily',    icon: ListChecks,   label: 'Prioridades de Vendas', prompt: 'Liste as 5 ações de vendas mais importantes para hoje com base no pipeline atual. Seja específico sobre quem contatar e como.' },
      { id: 'lostanalysis', icon: Search,   label: 'Analisar Lead Perdido', prompt: 'Faça uma análise pós-mortem de um lead perdido. O que motivou a perda? O que poderia ter sido feito diferente? Como evitar nas próximas oportunidades?' },
    ],
  },
  hybrid: {
    estrategico: [
      { id: 'swot',     icon: Target,       label: 'Análise SWOT',          prompt: 'Faça uma análise SWOT completa da TráfegOn hoje. Forças, fraquezas, oportunidades e ameaças. Conclua com os 3 movimentos estratégicos prioritários.' },
      { id: 'revenue',  icon: DollarSign,   label: 'Meta de Receita',       prompt: 'Ajude a definir e decompor a meta de receita anual da agência em metas mensais, por canal e por responsável.' },
      { id: 'position', icon: Sparkles,     label: 'Posicionamento',        prompt: 'Analise o posicionamento atual da TráfegOn no mercado. Como nos diferenciar e justificar preços mais altos?' },
      { id: 'partner',  icon: Users2,       label: 'Parcerias Estratégicas', prompt: 'Identifique parceiros estratégicos ideais para a TráfegOn e como estruturar essas parcerias comercialmente.' },
    ],
    tatico: [
      { id: 'monthly',  icon: BarChart2,    label: 'Revisão Mensal',        prompt: 'Estruture a pauta da revisão mensal da agência: resultados, pipeline, operação, equipe e definição das prioridades dos próximos 30 dias.' },
      { id: 'plan',     icon: ListChecks,   label: 'Plano de Ação 30d',     prompt: 'Crie um plano de ação de 30 dias para atingir o principal objetivo da agência agora. Com responsáveis, prazos e métricas.' },
      { id: 'risk',     icon: AlertTriangle, label: 'Gestão de Riscos',     prompt: 'Mapeie os principais riscos operacionais e comerciais da agência hoje. Para cada um, proponha uma ação de mitigação.' },
      { id: 'health',   icon: Activity,     label: 'Saúde dos Clientes',    prompt: 'Analise a saúde dos clientes ativos: quem está em risco de churn, quem tem potencial de crescimento e quais ações tomar para cada um.' },
    ],
    operacional: [
      { id: 'meeting',  icon: FileText,     label: 'Ata de Reunião',        prompt: 'Estruture uma ata de reunião profissional. Inclua seções para: participantes, pautas discutidas, decisões tomadas, responsáveis e próximos passos com prazo.' },
      { id: 'brief',    icon: Target,       label: 'Brief de Cliente',      prompt: 'Crie um briefing completo para o cliente selecionado. Inclua: objetivo, público-alvo, concorrentes, diferenciais, expectativas e KPIs de sucesso.' },
      { id: 'news',     icon: Search,       label: 'Pesquisa de Mercado',   prompt: 'Pesquise e liste as principais tendências de marketing digital e tráfego pago relevantes para os clientes da agência em 2026.' },
      { id: 'report',   icon: BarChart2,    label: 'Relatório Executivo',   prompt: 'Gere um relatório executivo de performance da agência: resultados do período, destaques, pontos de melhoria e próximos passos.' },
    ],
  },
}

/* ── System prompt builder ─────────────────── */
function buildSystemPrompt(role, level, selectedClientId, data) {
  const { leads, activities, erpClients, tasks, conversations } = data

  const roleDesc = {
    coo:    'Chief Operating Officer (COO) virtual da TráfegOn — especializado em processos, equipe, qualidade de entregas e estruturação operacional da agência.',
    sales:  'Diretor de Vendas virtual da TráfegOn — especializado em pipeline, conversão, propostas comerciais, negociação e retenção de clientes.',
    hybrid: 'Assistente executivo sênior da TráfegOn com competências de COO (operação, equipe, processos) e Diretor de Vendas (pipeline, conversão, crescimento).',
  }[role] || 'Assistente executivo da TráfegOn'

  const levelDesc = {
    estrategico: 'Nível ESTRATÉGICO — pense em visão de longo prazo (6–18 meses), posicionamento, crescimento sustentável e decisões de negócio.',
    tatico:      'Nível TÁTICO — pense em planos de médio prazo (1–6 meses), otimizações de processo e execução de estratégia.',
    operacional: 'Nível OPERACIONAL — pense em ações imediatas (dia a dia), execução prática e resolução rápida de problemas.',
  }[level] || ''

  const pipe = {
    novo:        leads.filter(l => l.stage === 'novo').length,
    contato:     leads.filter(l => l.stage === 'contato').length,
    qualificado: leads.filter(l => l.stage === 'qualificado').length,
    proposta:    leads.filter(l => l.stage === 'proposta').length,
    ganho:       leads.filter(l => l.stage === 'ganho').length,
    perdido:     leads.filter(l => l.stage === 'perdido').length,
  }
  const pipeValue   = leads.filter(l => !['ganho','perdido'].includes(l.stage)).reduce((s,l) => s + l.value, 0)
  const wonValue    = leads.filter(l => l.stage === 'ganho').reduce((s,l) => s + l.value, 0)
  const pendingActs = activities.filter(a => !a.done).length

  let clientContext = ''
  if (selectedClientId) {
    const client = erpClients.find(c => c.id === selectedClientId)
    if (client) {
      const ct = tasks.filter(t => t.clientId === selectedClientId)
      const pending = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
      const done    = ct.filter(t => ['concluído','entregue','done'].includes(t.status))

      clientContext = `
## CLIENTE EM CONTEXTO: ${client.name}
- Nicho: ${client.niche || 'N/A'}
- Status: ${client.status || 'ativo'}
- Responsável: ${client.owner || 'N/A'}
- Tarefas concluídas: ${done.length} | Tarefas pendentes: ${pending.length}
${pending.length ? `\nTarefas pendentes:\n${pending.slice(0,8).map(t => `• [${t.status}] ${t.title}`).join('\n')}` : ''}
`
    }
  }

  return `Você é ${roleDesc}

${levelDesc}

## REGRAS:
- Responda SEMPRE em português brasileiro
- Seja direto, objetivo e prático — entregue valor imediato
- Use markdown (listas, **negrito**, títulos ## quando útil)
- Hoje é: ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
- Este sistema é INTERNO da agência — pode ser técnico e franco

## SOBRE A TRÁFEGON:
Agência de tráfego pago especializada em Meta Ads e Google Ads.
Missão: acelerar negócios e impulsionar o empreendedorismo.
Equipe: Gabriel S. (GS) e João C. (JC)
Clientes ativos no ERP: ${erpClients.length}

## PIPELINE CRM ATUAL:
- Novos leads: ${pipe.novo} | Em contato: ${pipe.contato} | Qualificados: ${pipe.qualificado}
- Proposta enviada: ${pipe.proposta} | Ganhos: ${pipe.ganho} | Perdidos: ${pipe.perdido}
- Valor em negociação: R$ ${pipeValue.toLocaleString('pt-BR')} | Receita fechada: R$ ${wonValue.toLocaleString('pt-BR')}
- Atividades pendentes: ${pendingActs}
${clientContext}`
}

/* ── Smart action prompt builders ──────────── */
function buildCrmAnalysisPrompt(clientId, data) {
  const { leads, erpClients, tasks, conversations, activities } = data
  const client = erpClients.find(c => c.id === clientId)
  if (!client) return 'Analise o pipeline CRM completo da agência. Identifique gargalos, oportunidades e recomende ações prioritárias.'

  const ct         = tasks.filter(t => t.clientId === clientId)
  const pending    = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
  const done       = ct.filter(t => ['concluído','entregue','done'].includes(t.status))
  const retLead    = leads.find(l => l.pipelineId === 2 && l.name.toLowerCase().includes(client.name.split(' ')[0].toLowerCase()))
  const clientActs = activities.filter(a => leads.find(l => l.id === a.leadId && l.name.toLowerCase().includes(client.name.split(' ')[0].toLowerCase())))

  return `Analise o status completo do cliente **${client.name}** no CRM e na operação da agência.

**Dados disponíveis:**
- Nicho: ${client.niche || 'N/A'}
- Status no pipeline de retenção: ${retLead?.stage || 'não mapeado'}
- Tarefas concluídas: ${done.length} | Tarefas pendentes: ${pending.length}
- Atividades abertas: ${clientActs.filter(a => !a.done).length}
${pending.length ? `\nTarefas pendentes:\n${pending.map(t => `• [${t.status}] ${t.title}`).join('\n')}` : ''}

**Quero que você entregue:**
1. **Diagnóstico de saúde do cliente** (risco de churn, engajamento, satisfação)
2. **Pontos de atenção** (o que pode estar travado ou problemático)
3. **Oportunidades** (upsell, novos serviços, expansão)
4. **Próximas 3 ações recomendadas** com prioridade e responsável sugerido`
}

function buildMeetingAgendaPrompt(clientId, data) {
  const { erpClients, tasks, meetings, milestones } = data
  const client = erpClients.find(c => c.id === clientId)
  if (!client) return 'Crie uma pauta de reunião de acompanhamento padrão para cliente de agência de tráfego. Inclua: resultados, entregas, dúvidas, próximos passos.'

  const ct        = tasks.filter(t => t.clientId === clientId)
  const pending   = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
  const done      = ct.filter(t => ['concluído','entregue','done'].includes(t.status))
  const ms        = milestones?.filter(m => m.clientId === clientId) || []
  const lastMeet  = meetings?.filter(m => m.clientId === clientId).sort((a,b) => new Date(b.date) - new Date(a.date))[0]

  return `Gere uma pauta de reunião completa para o cliente **${client.name}**.

**Contexto atual do projeto:**
- Nicho: ${client.niche || 'N/A'}
- Tarefas concluídas: ${done.length} | Tarefas pendentes: ${pending.length}
- Marcos do projeto: ${ms.length} total
- Última reunião: ${lastMeet?.date || 'não registrada'}
${pending.length ? `\nEm aberto:\n${pending.slice(0,6).map(t => `• [${t.status}] ${t.title}`).join('\n')}` : ''}
${done.length ? `\nRecém concluídos:\n${done.slice(-3).map(t => `• ${t.title}`).join('\n')}` : ''}

**Crie uma pauta estruturada com:**
1. Abertura e check-in rápido
2. Revisão das entregas recentes (o que foi feito)
3. Apresentação de resultados (métricas, performance dos anúncios)
4. Pontos de atenção e alinhamentos necessários
5. Próximas entregas e prazos
6. Espaço para dúvidas e feedback do cliente
7. Encerramento e próxima reunião

Inclua o tempo sugerido para cada bloco e perguntas-guia para o gestor.`
}

/* ── Message bubble ────────────────────────── */
function MessageBubble({ msg, streaming }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  function copy() {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatted = msg.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<p class="text-xs font-bold text-text-2 uppercase tracking-wider mt-3 mb-1">$1</p>')
    .replace(/^• (.+)$/gm, '<p class="pl-3">• $1</p>')
    .replace(/\n/g, '<br/>')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isUser ? 'bg-accent/20' : 'bg-[#be29ec]/15'
      }`}>
        {isUser ? <User size={13} className="text-accent" /> : <Bot size={13} className="text-[#be29ec]" />}
      </div>
      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-accent/15 text-text rounded-tr-sm'
              : msg.error
              ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
              : 'bg-white border border-border text-text rounded-tl-sm'
          }`}
          style={{ boxShadow: isUser ? 'none' : '0 2px 8px rgba(26,29,46,0.07)' }}
        >
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {streaming && msg.id === 'streaming' && (
            <span className="inline-block w-1.5 h-4 bg-[#be29ec] ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted">{msg.time}</span>
          {!isUser && msg.content && !streaming && (
            <button onClick={copy} className="text-[10px] text-muted hover:text-text-2 flex items-center gap-1 transition-colors">
              {copied ? <><CheckCircle size={9} className="text-accent" /> Copiado</> : <><Copy size={9} /> Copiar</>}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── API key setup banner ──────────────────── */
function ApiKeyBanner({ onSave }) {
  const [key, setKey]     = useState('')
  const [show, setShow]   = useState(false)

  function save() {
    if (!key.trim()) return
    localStorage.setItem('claudeApiKey', key.trim())
    onSave(key.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="mx-4 lg:mx-8 mt-4 bg-[#be29ec]/8 border border-[#be29ec]/25 rounded-2xl p-5"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#be29ec]/15 flex items-center justify-center flex-shrink-0">
          <Key size={16} className="text-[#be29ec]" />
        </div>
        <div>
          <p className="text-sm font-bold text-text">Configure sua API Key do Claude</p>
          <p className="text-xs text-muted mt-0.5">
            Insira a chave da Anthropic para ativar as respostas de IA em tempo real.
            A chave é salva localmente no seu navegador — use somente em dispositivos da agência.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            placeholder="sk-ant-api03-..."
            className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-[#be29ec]/50 pr-10"
          />
          <button onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2">
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={save}
          disabled={!key.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#be29ec] text-white text-sm font-bold disabled:opacity-40 transition-all"
        >
          Ativar
        </motion.button>
      </div>
      <p className="text-[10px] text-muted mt-2">
        Obtenha em console.anthropic.com · Recomendado: claude-sonnet-4-6
      </p>
    </motion.div>
  )
}

/* ── Main component ────────────────────────── */
export default function Assistant() {
  const data = useData()
  const { erpClients, leads } = data

  const [apiKey, setApiKey]             = useState(() => localStorage.getItem('claudeApiKey') || '')
  const [role, setRole]                 = useState('hybrid')
  const [level, setLevel]               = useState('operacional')
  const [messages, setMessages]         = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const [input, setInput]               = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [isStreaming, setIsStreaming]   = useState(false)
  const [showClientDrop, setShowClientDrop] = useState(false)
  const [showKeyEdit, setShowKeyEdit]   = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const abortRef  = useRef(null)

  const currentRole  = ROLES.find(r => r.id === role)
  const currentLevel = LEVELS.find(l => l.id === level)
  const actions      = ACTIONS[role]?.[level] ?? []
  const selectedClientObj = erpClients.find(c => c.id === selectedClient)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const prefill = localStorage.getItem('assistantPrefill')
    if (prefill) {
      localStorage.removeItem('assistantPrefill')
      setInput(prefill)
    }
  }, [])

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  /* ── Real Claude API call with streaming ── */
  async function callClaude(userText) {
    const key = apiKey || localStorage.getItem('claudeApiKey')
    if (!key) return

    const systemPrompt = buildSystemPrompt(role, level, selectedClient, data)
    const newHistory   = [...conversationHistory, { role: 'user', content: userText }]
    setConversationHistory(newHistory)

    const userMsg = { id: Date.now(), role: 'user', content: userText, time: now() }
    const streamId = 'streaming'
    const streamMsg = { id: streamId, role: 'assistant', content: '', time: now(), streaming: true }

    setMessages(prev => [...prev, userMsg, streamMsg])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          stream: true,
          system: systemPrompt,
          messages: newHistory,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `HTTP ${res.status}`)
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue
          try {
            const parsed = JSON.parse(raw)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text
              setMessages(prev => prev.map(m =>
                m.id === streamId ? { ...m, content: fullText } : m
              ))
            }
          } catch {}
        }
      }

      const finalId = Date.now() + 1
      setMessages(prev => prev.map(m =>
        m.id === streamId ? { ...m, id: finalId, streaming: false } : m
      ))
      setConversationHistory(prev => [...prev, { role: 'assistant', content: fullText }])

    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === streamId ? { ...m, id: Date.now(), content: m.content || '(interrompido)', streaming: false } : m
        ))
      } else {
        setMessages(prev => prev.map(m =>
          m.id === streamId
            ? { ...m, id: Date.now(), content: `Erro ao chamar API: ${err.message}\n\nVerifique se a API key está correta e tem créditos disponíveis.`, streaming: false, error: true }
            : m
        ))
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  function send(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || isStreaming) return
    if (!overrideText) setInput('')
    callClaude(text)
  }

  function stop() {
    abortRef.current?.abort()
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function useQuickAction(action) {
    let prompt = action.prompt
    if (selectedClientObj) {
      prompt = prompt
        .replace(/\[CLIENTE\]/g, selectedClientObj.name)
        .replace(/\[NICHO\]/g, selectedClientObj.niche || 'geral')
    }
    setInput(prompt)
    inputRef.current?.focus()
  }

  function clearHistory() {
    setMessages([])
    setConversationHistory([])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">

      {/* ── Header ── */}
      <div className="px-4 lg:px-8 py-3 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: '0 1px 0 #e0e3f0' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${currentRole?.color}, #be29ec)` }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text leading-tight">Claude · {currentRole?.label}</h1>
              <p className="text-[11px] text-muted">{currentLevel?.label} · uso interno da agência</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* API key status */}
            <button
              onClick={() => setShowKeyEdit(v => !v)}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                apiKey ? 'text-accent bg-accent/10 hover:bg-accent/15' : 'text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/15'
              }`}
            >
              <Key size={10} />
              {apiKey ? 'API conectada' : 'Configurar API'}
            </button>

            {/* Clear */}
            {messages.length > 0 && (
              <button onClick={clearHistory} className="text-[11px] text-muted hover:text-text-2 px-2.5 py-1.5 rounded-lg hover:bg-border/40 transition-colors">
                Limpar
              </button>
            )}

            {/* Client selector */}
            <div className="relative">
              <button
                onClick={() => setShowClientDrop(v => !v)}
                className="flex items-center gap-2 text-xs bg-bg border border-border rounded-xl px-3 py-2 text-text hover:border-accent/40 transition-colors min-w-[140px]"
              >
                <span className="flex-1 text-left truncate">{selectedClientObj?.name ?? 'Todos os clientes'}</span>
                <ChevronDown size={11} className="text-muted flex-shrink-0" />
              </button>
              <AnimatePresence>
                {showClientDrop && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.13 }}
                    className="absolute right-0 top-full mt-1 w-52 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden"
                  >
                    <button onClick={() => { setSelectedClient(''); setShowClientDrop(false) }}
                      className="w-full text-left text-xs px-4 py-2.5 hover:bg-surface transition-colors text-muted">
                      Todos os clientes
                    </button>
                    {erpClients.map(c => (
                      <button key={c.id} onClick={() => { setSelectedClient(c.id); setShowClientDrop(false) }}
                        className="w-full text-left text-xs px-4 py-2.5 hover:bg-surface transition-colors text-text">
                        {c.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* API key edit inline */}
        <AnimatePresence>
          {showKeyEdit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 flex gap-2">
                <input
                  type="password"
                  defaultValue={apiKey}
                  placeholder="sk-ant-api03-..."
                  id="apiKeyInline"
                  className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-xs font-mono text-text focus:outline-none focus:border-[#be29ec]/50"
                />
                <button
                  onClick={() => {
                    const val = document.getElementById('apiKeyInline').value.trim()
                    if (val) { localStorage.setItem('claudeApiKey', val); setApiKey(val) }
                    setShowKeyEdit(false)
                  }}
                  className="px-4 py-2 bg-[#be29ec] text-white text-xs font-bold rounded-xl"
                >
                  Salvar
                </button>
                <button onClick={() => setShowKeyEdit(false)} className="p-2 text-muted hover:text-text-2">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── API Key setup (first time) ── */}
      {!apiKey && <ApiKeyBanner onSave={k => { setApiKey(k); setShowKeyEdit(false) }} />}

      {/* ── Role + Level + Actions ── */}
      <div className="px-4 lg:px-8 py-3 bg-bg/60 border-b border-border/50 flex-shrink-0 space-y-2.5">
        {/* Role tabs */}
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(r => {
            const Icon = r.icon
            const active = role === r.id
            return (
              <motion.button key={r.id} whileTap={{ scale: 0.97 }}
                onClick={() => setRole(r.id)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex-shrink-0"
                style={{
                  backgroundColor: active ? r.color + '20' : 'white',
                  color: active ? r.color : '#8890b5',
                  border: `1px solid ${active ? r.color + '40' : '#e0e3f0'}`,
                }}
              >
                <Icon size={11} /> {r.label}
              </motion.button>
            )
          })}
          <div className="w-px bg-border mx-1" />
          {LEVELS.map(l => {
            const active = level === l.id
            return (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: active ? l.color + '18' : 'transparent',
                  color: active ? l.color : '#8890b5',
                  border: `1px solid ${active ? l.color + '40' : 'transparent'}`,
                }}
              >
                {l.label}
              </button>
            )
          })}
        </div>

        {/* Smart actions (data-driven) */}
        {selectedClient && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap self-center flex-shrink-0">IA smart:</span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => send(buildCrmAnalysisPrompt(selectedClient, data))}
              disabled={isStreaming || !apiKey}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#60a5fa]/15 text-[#60a5fa] border border-[#60a5fa]/25 hover:bg-[#60a5fa]/25 transition-all disabled:opacity-50"
            >
              <Activity size={10} />
              Analisar CRM — {selectedClientObj?.name}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => send(buildMeetingAgendaPrompt(selectedClient, data))}
              disabled={isStreaming || !apiKey}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#ea8a29]/15 text-[#ea8a29] border border-[#ea8a29]/25 hover:bg-[#ea8a29]/25 transition-all disabled:opacity-50"
            >
              <Calendar size={10} />
              Gerar pauta de reunião — {selectedClientObj?.name}
            </motion.button>
          </div>
        )}

        {/* Contextual quick actions */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {!selectedClient && (
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap self-center flex-shrink-0">Ações:</span>
          )}
          {actions.map(action => (
            <motion.button key={action.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => useQuickAction(action)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-white border border-border text-muted hover:text-text-2 hover:border-accent/30 transition-all"
            >
              <action.icon size={10} style={{ color: currentRole?.color }} />
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-5">

        {messages.length === 0 && apiKey && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center py-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `linear-gradient(135deg, ${currentRole?.color}25, #be29ec20)` }}>
              <Sparkles size={22} style={{ color: currentRole?.color }} />
            </div>
            <h2 className="text-base font-bold text-text mb-1">
              {currentRole?.label} · {currentLevel?.label}
            </h2>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {selectedClientObj
                ? `Contexto: ${selectedClientObj.name}. Use as ações inteligentes acima ou escreva livremente.`
                : 'Selecione um cliente para análises específicas ou use as ações rápidas abaixo.'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => setLevel(l.id)}
                  className="p-2.5 rounded-xl border transition-all text-center"
                  style={{
                    borderColor: level === l.id ? l.color + '50' : '#e0e3f0',
                    backgroundColor: level === l.id ? l.color + '10' : 'transparent',
                  }}>
                  <p className="text-[11px] font-bold" style={{ color: l.color }}>{l.label}</p>
                  <p className="text-[10px] text-muted">{l.sub}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} streaming={isStreaming} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 lg:px-8 py-4 bg-white border-t border-border flex-shrink-0">
        {selectedClientObj && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium mb-2"
            style={{ color: currentRole?.color }}>
            <Zap size={10} /> Contexto: {selectedClientObj.name}
          </div>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isStreaming || !apiKey}
            placeholder={
              !apiKey
                ? 'Configure a API key acima para começar...'
                : `${currentRole?.label} · ${currentLevel?.label} — o que você precisa?`
            }
            rows={2}
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none leading-relaxed transition-colors disabled:opacity-60"
          />
          {isStreaming ? (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={stop}
              className="w-10 h-10 rounded-xl bg-[#ef4444]/15 text-[#ef4444] flex items-center justify-center flex-shrink-0 transition-all">
              <Square size={13} />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => send()}
              disabled={!input.trim() || !apiKey}
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all"
              style={{ backgroundColor: currentRole?.color }}>
              <Send size={15} />
            </motion.button>
          )}
        </div>
        <p className="text-[10px] text-muted mt-2">
          {isStreaming
            ? 'Gerando resposta... clique ■ para parar'
            : `${currentRole?.label} · ${currentLevel?.label} · Enter para enviar · Shift+Enter para quebrar linha`}
        </p>
      </div>
    </div>
  )
}
