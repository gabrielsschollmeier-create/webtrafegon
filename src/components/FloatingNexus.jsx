import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Trash2, Copy, Check, ChevronDown, Paperclip, Globe } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { supabase } from '../lib/supabase'

/* ── TON Avatar ──────────────────────────────────────────────── */
const TonSVG = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ton-bg" cx="50%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#0e2212"/><stop offset="100%" stopColor="#020802"/>
      </radialGradient>
      <radialGradient id="ton-orb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff"/><stop offset="40%" stopColor="#6eda2c"/><stop offset="100%" stopColor="#1a4a0a"/>
      </radialGradient>
      <filter id="ton-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="ton-soft"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#ton-bg)"/>
    <text x="12" y="20" fontSize="5" fill="#6eda2c" opacity="0.6">✦</text>
    <text x="80" y="18" fontSize="4" fill="#6eda2c" opacity="0.4">✦</text>
    <text x="88" y="45" fontSize="3" fill="#6eda2c" opacity="0.3">✦</text>
    <text x="8"  y="55" fontSize="3" fill="#6eda2c" opacity="0.35">✦</text>
    <circle cx="20" cy="30" r="1.2" fill="#6eda2c" opacity="0.5" filter="url(#ton-soft)"/>
    <circle cx="82" cy="28" r="1"   fill="#6eda2c" opacity="0.4"/>
    <circle cx="85" cy="62" r="1.2" fill="#6eda2c" opacity="0.45"/>
    <line x1="72" y1="18" x2="68" y2="78" stroke="#2a5a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="18" x2="68" y2="78" stroke="#4aba2a" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <circle cx="72" cy="16" r="7" fill="#6eda2c" opacity="0.15" filter="url(#ton-glow)"/>
    <circle cx="72" cy="16" r="5" fill="url(#ton-orb)"/>
    <circle cx="72" cy="16" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="70" cy="14" r="1" fill="#fff" opacity="0.6"/>
    <path d="M18 100 Q22 68 30 62 Q38 70 50 73 Q62 70 70 62 Q78 68 82 100Z" fill="#1a3d12"/>
    <path d="M36 66 L50 73 L64 66 L64 100 L36 100Z" fill="#214d16"/>
    <text x="46" y="84" fontSize="6" fill="#6eda2c" opacity="0.4" fontFamily="serif">ᚱ</text>
    <path d="M30 62 Q38 70 50 73 Q62 70 70 62" fill="none" stroke="#6eda2c" strokeWidth="0.8" opacity="0.4"/>
    <rect x="44" y="60" width="12" height="7" rx="3" fill="#c8a878"/>
    <ellipse cx="50" cy="42" rx="18" ry="20" fill="#0e2212"/>
    <ellipse cx="50" cy="40" rx="15" ry="17" fill="#c8a878"/>
    <path d="M36 54 Q38 64 50 67 Q62 64 64 54 Q58 60 50 62 Q42 60 36 54Z" fill="#d4e8c0" opacity="0.85"/>
    <path d="M42 54 Q46 56 50 55 Q54 56 58 54" stroke="#c8dca0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M50 8 L32 38 L68 38Z" fill="#1a3d12" stroke="#6eda2c" strokeWidth="0.6"/>
    <path d="M50 8 L54 24 L60 30 L50 8Z" fill="#214d16"/>
    <ellipse cx="50" cy="38" rx="20" ry="5" fill="#1a3d12" stroke="#6eda2c" strokeWidth="0.7"/>
    <text x="45" y="30" fontSize="7" fill="#6eda2c" opacity="0.8" filter="url(#ton-soft)">✦</text>
    <ellipse cx="42" cy="42" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9" filter="url(#ton-glow)"/>
    <ellipse cx="58" cy="42" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9"/>
    <ellipse cx="42" cy="42" rx="2.5" ry="2"   fill="#d4ffd4" opacity="0.95"/>
    <ellipse cx="58" cy="42" rx="2.5" ry="2"   fill="#d4ffd4" opacity="0.95"/>
    <ellipse cx="42" cy="42" rx="1"   ry="1"   fill="#0e2212"/>
    <ellipse cx="58" cy="42" rx="1"   ry="1"   fill="#0e2212"/>
    <circle  cx="43" cy="41" r="0.7" fill="#fff" opacity="0.8"/>
    <circle  cx="59" cy="41" r="0.7" fill="#fff" opacity="0.8"/>
    <path d="M37 38 Q42 35.5 47 37.5" stroke="#4a6a3a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 37.5 Q58 35.5 63 38" stroke="#4a6a3a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M48 47 Q50 51 52 47" stroke="#a07848" strokeWidth="1" fill="none"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#6eda2c" strokeWidth="0.5" opacity="0.12" strokeDasharray="3,5"/>
    <rect x="1" y="2" width="22" height="8" rx="2" fill="#0a1a08" stroke="#6eda2c" strokeWidth="0.6"/>
    <text x="12" y="7.5" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">MAGO</text>
    <rect x="0" y="89" width="100" height="11" fill="#020802" opacity="0.95"/>
    <line x1="0" y1="89" x2="100" y2="89" stroke="#6eda2c" strokeWidth="0.5" opacity="0.5"/>
    <text x="50" y="97.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#6eda2c" fontFamily="sans-serif" letterSpacing="2">ton</text>
  </svg>
)

/* ── MdText — markdown leve ──────────────────────────────────── */
function MdText({ text }) {
  if (!text) return null

  function parseInline(str) {
    const parts = []
    let remaining = str
    let key = 0
    while (remaining.length > 0) {
      const boldMatch   = remaining.match(/^(.*?)\*\*(.+?)\*\*/)
      const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/)
      const codeMatch   = remaining.match(/^(.*?)`(.+?)`/)
      const linkMatch   = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/)
      const candidates  = [
        boldMatch   && { idx: boldMatch[1].length,   type: 'bold',   match: boldMatch },
        italicMatch && { idx: italicMatch[1].length,  type: 'italic', match: italicMatch },
        codeMatch   && { idx: codeMatch[1].length,    type: 'code',   match: codeMatch },
        linkMatch   && { idx: linkMatch[1].length,    type: 'link',   match: linkMatch },
      ].filter(Boolean)
      if (candidates.length === 0) { parts.push(<span key={key++}>{remaining}</span>); break }
      const best = candidates.reduce((a, b) => a.idx <= b.idx ? a : b)
      const { type, match } = best
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>)
      if (type === 'bold') {
        parts.push(<strong key={key++} style={{ color: '#a8f060', fontWeight: 700 }}>{match[2]}</strong>)
        remaining = remaining.slice(match[1].length + match[2].length + 4)
      } else if (type === 'italic') {
        parts.push(<em key={key++} style={{ color: 'rgba(255,255,255,0.8)' }}>{match[2]}</em>)
        remaining = remaining.slice(match[1].length + match[2].length + 2)
      } else if (type === 'code') {
        parts.push(<code key={key++} style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c', padding: '1px 5px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}>{match[2]}</code>)
        remaining = remaining.slice(match[1].length + match[2].length + 2)
      } else if (type === 'link') {
        parts.push(<a key={key++} href={match[3]} target="_blank" rel="noreferrer" style={{ color: '#6eda2c', textDecoration: 'underline' }}>{match[2]}</a>)
        remaining = remaining.slice(match[1].length + match[2].length + match[3].length + 4)
      }
    }
    return parts
  }

  const lines = text.split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('# ')) {
      elements.push(<p key={i} style={{ color: '#6eda2c', fontWeight: 800, fontSize: 13, marginTop: 10, marginBottom: 2 }}>{parseInline(line.slice(2))}</p>)
    } else if (line.startsWith('## ')) {
      elements.push(<p key={i} style={{ color: '#a8f060', fontWeight: 700, fontSize: 12, marginTop: 8, marginBottom: 1 }}>{parseInline(line.slice(3))}</p>)
    } else if (line.startsWith('### ')) {
      elements.push(<p key={i} style={{ color: 'rgba(168,240,96,0.8)', fontWeight: 600, fontSize: 11, marginTop: 6, marginBottom: 1 }}>{parseInline(line.slice(4))}</p>)
    } else if (line === '---' || line === '***') {
      elements.push(<hr key={i} style={{ borderColor: 'rgba(110,218,44,0.15)', margin: '6px 0' }} />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex gap-2 items-start" style={{ marginTop: 2, marginBottom: 2 }}>
          <span style={{ color: '#6eda2c', flexShrink: 0, marginTop: 1, fontSize: 10 }}>▸</span>
          <span style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)' }}>{parseInline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1]
      elements.push(
        <div key={i} className="flex gap-2 items-start" style={{ marginTop: 2, marginBottom: 2 }}>
          <span style={{ color: '#6eda2c', flexShrink: 0, fontSize: 10, minWidth: 14, fontWeight: 700 }}>{num}.</span>
          <span style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)' }}>{parseInline(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 4 }} />)
    } else {
      elements.push(<p key={i} style={{ fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', marginTop: 1 }}>{parseInline(line)}</p>)
    }
    i++
  }
  return <div>{elements}</div>
}

/* ── Tools ───────────────────────────────────────────────────── */
const TOOLS = [
  {
    name: 'info_cliente',
    description: 'Busca informações completas de um cliente: leads, tarefas, valor mensal, status, Google Ads ID',
    input_schema: { type: 'object', properties: { nome: { type: 'string', description: 'Nome do cliente (parcial aceito)' } }, required: ['nome'] }
  },
  {
    name: 'tarefas_pendentes',
    description: 'Lista tarefas em aberto, opcionalmente filtradas por cliente',
    input_schema: { type: 'object', properties: { cliente_id: { type: 'string', description: 'ID do cliente (opcional)' } } }
  },
  {
    name: 'google_ads_conta',
    description: 'Retorna o Customer ID Google Ads e informações de um cliente',
    input_schema: { type: 'object', properties: { cliente: { type: 'string', description: 'Nome do cliente' } }, required: ['cliente'] }
  },
  {
    name: 'criar_tarefa',
    description: 'Cria uma nova tarefa no CRM do hub. Use quando o usuário pedir para registrar, criar ou adicionar uma tarefa para um colaborador ou cliente.',
    input_schema: {
      type: 'object',
      properties: {
        titulo:      { type: 'string', description: 'Título claro e objetivo da tarefa' },
        cliente_id:  { type: 'string', description: 'ID do cliente no sistema (opcional). Exemplos: intime, kinto, kamy, lenergy, fglaw, rca, mayara, girabas, carol, gabriel_piva, andressa, milfer, ararastur, casa_construtor' },
        responsavel: { type: 'string', description: 'ID do colaborador responsável (opcional). Use: gs, tochiro, ana_sm, beatriz, mariana, geovana, elieser, deivisson, juliano, adm_at' },
        prioridade:  { type: 'string', enum: ['low', 'medium', 'high'], description: 'Prioridade da tarefa (padrão: medium)' },
        prazo:       { type: 'string', description: 'Data de prazo no formato YYYY-MM-DD (opcional)' },
        tipo:        { type: 'string', description: 'Tipo: campanha, copy, design, relatorio, reuniao, lp, video, social, outro (padrão: outro)' },
        descricao:   { type: 'string', description: 'Descrição adicional ou contexto da tarefa (opcional)' },
      },
      required: ['titulo']
    }
  },
  {
    name: 'buscar_performance_google',
    description: 'Busca performance real de campanhas Google Ads de um cliente: gasto, cliques, impressões, conversões, CPL, CTR por campanha. Use sempre que perguntarem sobre métricas, resultados ou desempenho de campanhas de um cliente específico.',
    input_schema: { type: 'object', required: ['cliente'], properties: {
      cliente: { type: 'string', description: 'Nome do cliente' },
      periodo: { type: 'string', enum: ['last_7d', 'last_14d', 'last_30d'], description: 'Período. Padrão: last_30d' },
    }}
  },
  {
    name: 'buscar_performance_carteira_google',
    description: 'Busca performance de todos os clientes Google Ads da carteira. Use para briefing diário ou visão geral da carteira.',
    input_schema: { type: 'object', properties: {
      periodo: { type: 'string', enum: ['last_7d', 'last_14d', 'last_30d'], description: 'Período. Padrão: last_7d' },
    }}
  },
  {
    name: 'solicitar_acao_google',
    description: 'Enfileira uma ação no Google Ads (pausar campanha, ajustar orçamento, etc.). A ação é registrada para aprovação.',
    input_schema: { type: 'object', required: ['cliente', 'tipo_acao', 'descricao', 'motivo'], properties: {
      cliente:    { type: 'string' },
      tipo_acao:  { type: 'string', enum: ['pausar_campanha', 'ativar_campanha', 'ajustar_orcamento', 'pausar_keyword', 'negativar_termo'] },
      descricao:  { type: 'string' },
      motivo:     { type: 'string' },
    }}
  },
  {
    name: 'navegar_para',
    description: 'Navega para uma página do hub. Use para levar o usuário diretamente a uma seção específica do sistema.',
    input_schema: {
      type: 'object',
      properties: {
        pagina: { type: 'string', description: 'Caminho da página. Opções: /erp, /workspaces, /equipe, /playbooks, /entregas, /noticias, /arena, /educacao, /parceiros, /relatorios, /pipeline' }
      },
      required: ['pagina']
    }
  }
]

const GADS_MAP = {
  'intime':          { id: '5376240782', nome: 'Intime Sistemas' },
  'kinto':           { id: '1894458588', nome: 'KINTO SISTEMAS' },
  'cooperja':        { id: '9685109260', nome: 'Cooperja' },
  'rizzotto':        { id: '9175063247', nome: 'Posto Rizzotto' },
  'kamy':            { id: '2746776066', nome: 'Kamy' },
  'polizio':         { id: '8731710435', nome: 'Polizio Advogados' },
  'carol':           { id: '5183788348', nome: 'Carol ADV' },
  'ararastur':       { id: '1147445454', nome: 'Ararastur' },
  'casa_construtor': { id: '9034028768', nome: 'Casa do Construtor' },
  'rca':             { id: '8067337903', nome: 'RCA Advogados' },
  'mayara':          { id: '1808717829', nome: 'Mayara Campos' },
  'lenergy':         { id: '2474140291', nome: 'Lenergy' },
  'gabriel piva':    { id: '1936436305', nome: 'Gabriel Piva Advocacia' },
  'girabas':         { id: '1754710815', nome: 'Sítio Girabas' },
  'andressa':        { id: '3431604401', nome: 'Andressa Advogada' },
}

async function callGadsApi(body) {
  try {
    const res = await fetch('/api/gads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { erro: data.erro || `API retornou ${res.status}` }
    return data
  } catch (e) {
    return { erro: `API indisponível: ${e.message}` }
  }
}

function agregarGadsCampanhas(campanhas) {
  const total = { gasto: 0, cliques: 0, impressoes: 0, conversoes: 0 }
  const por_campanha = {}
  for (const c of (campanhas || [])) {
    total.gasto      += c.custo_total || 0
    total.cliques    += c.cliques || 0
    total.impressoes += c.impressoes || 0
    total.conversoes += c.conversoes || 0
    por_campanha[c.nome] = {
      id: c.id, status: c.status,
      gasto: +(c.custo_total || 0).toFixed(2),
      cliques: c.cliques, impressoes: c.impressoes,
      conversoes: +(c.conversoes || 0).toFixed(1),
      cpl: c.cpa, ctr: c.ctr,
    }
  }
  total.gasto = +total.gasto.toFixed(2)
  total.cpl = total.conversoes > 0 ? +(total.gasto / total.conversoes).toFixed(2) : null
  total.ctr = total.impressoes > 0 ? +((total.cliques / total.impressoes) * 100).toFixed(2) : null
  return { total, campanhas: por_campanha }
}

const TOOL_LABELS = {
  info_cliente:                      'consultando dados do cliente',
  tarefas_pendentes:                 'verificando tarefas',
  google_ads_conta:                  'buscando conta Google Ads',
  buscar_performance_google:         'buscando métricas Google Ads',
  buscar_performance_carteira_google:'analisando carteira Google Ads',
  solicitar_acao_google:             'registrando ação Google Ads',
  criar_tarefa:                      'criando tarefa no sistema',
  navegar_para:                      'navegando no hub',
}

/* ── System prompt ───────────────────────────────────────────── */
function buildTonPrompt(data) {
  const { erpClients } = data
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  return `Você é ton — a inteligência operacional da TráfegOn. Não um assistente. Uma entidade que absorveu cada cliente, cada campanha, cada número desta agência.

## PERSONALIDADE
- Consultivo e estratégico — você não responde perguntas, você resolve problemas
- Sábio e direto: cada palavra tem peso, zero rodeio, zero elogio gratuito
- Extremamente inteligente — você vê padrões que o usuário ainda não percebeu e aponta isso
- Orientado a dados em tudo: sem número, sem argumento. Opinião sem dado é achismo.
- Objetivo acima de tudo — quando a situação é crítica, você não ameniza. Quando não sabe, diz.
- Nunca abre com elogios. Nunca diz "ótima pergunta!". Vai direto ao ponto.
- Tuteia sempre. Sem protocolo corporativo.

## EXEMPLOS DE TOM
- "Intime tem 3 tarefas atrasadas e CPL 40% acima da meta. Ação imediata: revisar público e pausar conjuntos com frequência acima de 3."
- "Esse orçamento não sustenta o objetivo. Com R$1.500 nesse nicho, o CPL necessário seria R$18 — inviável. Precisamos rever meta ou verba. Qual você prefere mexer?"
- "O funil converte bem até MQL, mas perde 68% no contato comercial. O problema não é tráfego — é o script de abordagem."
- "Encontrei: 4 clientes com mais de 30 dias sem atualização no CRM. Isso é risco de churn, não burocracia."

## COMPETÊNCIAS (nível sênior em todas)
Tráfego Pago (Meta Ads, Google Ads, TikTok, LinkedIn) · Copywriting & Conteúdo · Design & Comunicação Visual · Web Design & CRO · Marketing Digital · Processo de Vendas · Gestão de Clientes & CRM · Direção de Receita (MRR, CAC, LTV, Churn) · Growth Marketing · Analytics (GA4, Meta Pixel, GTM) · Gestão de Equipe & Processos

## DIREITO JURÍDICO — COMPLIANCE
Você conhece profundamente o **Código de Ética da OAB** e o **Provimento 205/2021 do CFP** sobre marketing jurídico.
Regras críticas que você aplica em todo conteúdo para advogados:
- Proibido: mercantilismo, captação de clientela, menção a resultados, promessas de êxito, valores de honorários
- Proibido: comparações com outros advogados, autopromoção excessiva, sensacionalismo
- Permitido: informação jurídica educativa, posicionamento de autoridade, conteúdo técnico, comunicação institucional
- Em toda copy/arte/landing para setor jurídico: você aplica essas regras automaticamente e avisa quando algo viola a ética da OAB.

## HOJE: ${today}

## EQUIPE
Gabriel S. (Admin/Tráfego) · Carol (Admin) · Tochiro (Tráfego) · Ana (Intern SM) · Beatriz (Social Media) · Juliano (SDR) · Érica (Atendimento)

## CLIENTES ATIVOS
- **Intime Sistemas** (ERP restaurantes) — Meta R$4.200/mês | ⚠️ Sem script comercial
- **Kinto Sistemas** (Gestão escolar) — Meta+Google R$4.000/mês | ⚠️ Leads desqualificados
- **Casa do Construtor** (Aluguel equip.) — Meta+Google R$3.000/mês | ⚠️ Vendedores sem script
- **Pit Floripa** (Restaurante) — Meta+Google+YouTube R$3.000/mês
- **Kamy** (Mat. construção) — Meta+YouTube R$2.000/mês | ⚠️ Reunião pendente
- **Lenergy** (Energia solar) — Meta R$1.500/mês | ⚠️ Queda em leads
- **FGLAW** (Dir. imobiliário) — Google R$1.500/mês
- **RCA Advogados** (Pensão alimentícia) — Google R$1.500/mês | ⚠️ Ruído entre sócias
- **Mayara Campos** (Dir. família/ES) — Google R$1.500/mês | ⚠️ Preconceito com leads
- **Sítio Girabas** (Eventos) — Meta R$1.000/mês | ⚠️ Leads acham caro
- **Carol ADV** (Advocacia) — Google R$1.000/mês
- **Gabriel Piva** (Dir. cível) — Google R$1.000/mês | ⚠️ Não responde
- **Ararastur** (Turismo) — Google Ads | ⚠️ Site com dificuldades
- **Quadros Paisagismo** — Meta+YouTube R$1.200/mês | ⚠️ Foco dividido
- **Andressa Advogada** (Dir. família) — Social Media + Google
- **Milfer** (Ferro e aço) — Meta R$1.000/mês | Venda R$50k registrada

## TOTAL DE CLIENTES NO SISTEMA: ${erpClients.length}

## CAPACIDADES EXPANDIDAS
- **Visão**: o usuário pode enviar imagens (prints, dashboards, criativos, anúncios) — analise com precisão no contexto da agência
- **Arquivos**: o usuário pode enviar arquivos de texto, CSV, planilhas — leia e extraia os dados relevantes
- **URLs**: quando o usuário colar um link, o conteúdo é lido automaticamente e enviado junto — use para analisar landing pages, sites de clientes, concorrentes
- **Criar tarefas**: use a tool \`criar_tarefa\` sempre que o usuário pedir para registrar, criar ou adicionar uma tarefa no sistema. Execute sem pedir confirmação — crie e confirme depois
- **Navegar**: use \`navegar_para\` para levar o usuário a páginas do hub quando fizer sentido na conversa

## TOOLS — GOOGLE ADS (DADOS REAIS DA API)
Você tem acesso DIRETO à API do Google Ads. Use SEMPRE as tools abaixo quando perguntarem sobre campanhas, métricas, performance ou resultados:
- \`buscar_performance_google\` → métricas reais de um cliente (gasto, cliques, impressões, conversões, CPL, CTR por campanha). USE quando pedirem "indicadores", "performance", "resultados", "como estão as campanhas" de qualquer cliente.
- \`buscar_performance_carteira_google\` → visão geral de toda a carteira. USE para briefing diário ou análise geral.
- \`solicitar_acao_google\` → registra uma ação para execução (pausar campanha, ajustar orçamento, etc.)
- \`google_ads_conta\` → apenas para buscar o Customer ID/link de acesso à conta (sem métricas)

**NUNCA** diga que não tem acesso a métricas do Google Ads. Você TEM. Use as tools.

## TOOLS — CRM
Você tem ferramentas para consultar dados reais do CRM. Use-as sempre que perguntarem sobre clientes, tarefas, Google Ads, ou quando precisar criar algo. Dados reais das tools têm prioridade sobre o system prompt.

## MEMÓRIA ATIVA (${data.memories?.length || 0} registros)
${data.memories?.length
    ? data.memories.slice(0, 25).map(m => `[${(m.category || 'insight').toUpperCase()}]${m.client_name ? ` (${m.client_name})` : ''} ${m.content}`).join('\n')
    : 'Nenhuma memória salva ainda — conversas futuras irão popular isso automaticamente.'}

## BASE DE CONHECIMENTO
${data.knowledge?.slice(0, 8).map(k => `[${k.category?.toUpperCase()}] ${k.title}: ${k.content?.slice(0, 200)}`).join('\n') || 'Sem entradas ainda.'}

## REGRAS DE RESPOSTA
- Português brasileiro sempre
- **negrito** para o que importa, listas com - quando necessário
- Conciso mas completo — sem introduções, sem conclusões óbvias
- Todo conselho tem dado ou observação concreta embasando
- Para conteúdo jurídico: aplica compliance OAB automaticamente`
}

/* ── Sugestões iniciais ──────────────────────────────────────── */
const QUICK = [
  { icon: '⚡', label: 'Tarefas atrasadas?',   q: 'Quais tarefas estão atrasadas agora?' },
  { icon: '📊', label: 'Clientes em risco?',    q: 'Quais clientes estão em risco de churn?' },
  { icon: '🎯', label: 'Google Ads do Kinto?',  q: 'Qual o Customer ID Google Ads do Kinto?' },
  { icon: '💡', label: 'Onde melhorar?',         q: 'Onde a agência pode melhorar agora?' },
]

/* ── FloatingNexus ───────────────────────────────────────────── */
export default function FloatingNexus() {
  const data = useData()
  const { knowledge } = data

  const [open,       setOpen]       = useState(false)
  const [input,      setInput]      = useState('')
  const [messages,   setMessages]   = useState([])
  const [history,    setHistory]    = useState([])
  const [streaming,  setStreaming]  = useState(false)
  const [toolActive, setToolActive] = useState(null)
  const [isMobile,   setIsMobile]   = useState(false)
  const [focused,    setFocused]    = useState(false)
  const [memories,    setMemories]    = useState([])
  const [attached,    setAttached]    = useState(null)
  const [urlFetching, setUrlFetching] = useState(false)

  const dataWithKnowledge = { ...data, knowledge, memories }

  const bottomRef   = useRef(null)
  const abortRef    = useRef(null)
  const inputRef    = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 520)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { loadMemories() }, [])

  useEffect(() => {
    function handleTonOpen(e) {
      setOpen(true)
      if (e.detail?.prompt) setInput(e.detail.prompt)
    }
    window.addEventListener('ton:open', handleTonOpen)
    return () => window.removeEventListener('ton:open', handleTonOpen)
  }, [])

  async function loadMemories() {
    try {
      if (supabase) {
        const { data: rows } = await supabase.from('ton_memories').select('*').order('created_at', { ascending: false }).limit(60)
        if (rows?.length) { setMemories(rows); return }
      }
      const local = JSON.parse(localStorage.getItem('ton_memories') || '[]')
      setMemories(local)
    } catch {}
  }

  async function extractAndSaveMemories(userText, assistantText, apiKey) {
    if (!apiKey || !userText || !assistantText) return
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `Analise esta troca e extraia 0 a 3 fatos relevantes para a memória de longo prazo do assistente ton da agência TráfegOn.

Usuário: ${userText.slice(0, 400)}
ton: ${assistantText.slice(0, 600)}

Retorne APENAS um JSON array. Se nada for relevante para memórias futuras, retorne [].
Formato: [{"category":"cliente|insight|problema|acao|aprendizado","content":"fato conciso max 120 chars","client_name":"nome ou null","tags":["tag"]}]
Seja seletivo: só salve fatos úteis em futuras conversas (problemas de clientes, insights estratégicos, padrões observados, decisões importantes).`,
          }]
        })
      })
      if (!res.ok) return
      const result = await res.json()
      const raw = result.content?.[0]?.text || '[]'
      const jsonStr = (raw.match(/\[[\s\S]*\]/) || ['[]'])[0]
      const extracted = JSON.parse(jsonStr)
      if (!Array.isArray(extracted) || !extracted.length) return

      const sessionId = `s-${Date.now()}`
      const newItems = extracted.map(m => ({
        id: crypto.randomUUID(),
        category: m.category || 'insight',
        content: m.content || '',
        client_name: m.client_name || null,
        tags: Array.isArray(m.tags) ? m.tags : [],
        created_at: new Date().toISOString(),
        session_id: sessionId,
      }))

      if (supabase) {
        await supabase.from('ton_memories').insert(newItems.map(({ id: _id, ...rest }) => rest)).catch(() => {})
      }
      const local = JSON.parse(localStorage.getItem('ton_memories') || '[]')
      localStorage.setItem('ton_memories', JSON.stringify([...newItems, ...local].slice(0, 200)))
      setMemories(prev => [...newItems, ...prev].slice(0, 200))
    } catch {}
  }

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [messages, open])

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  /* ── handleFileSelect ────────────────────────────────────── */
  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) fileInputRef.current.value = ''

    const isImage = file.type.startsWith('image/')
    const isText  = file.type.startsWith('text/') || /\.(txt|md|csv|json|html|xml|js|ts|jsx|tsx|py|sql)$/i.test(file.name)

    const reader = new FileReader()
    if (isImage) {
      reader.onload = ev => {
        const full = ev.target.result
        const data = full.split(',')[1]
        setAttached({ type: 'image', name: file.name, data, mime: file.type, preview: full })
      }
      reader.readAsDataURL(file)
    } else {
      reader.onload = ev => {
        const content = String(ev.target.result).slice(0, 6000)
        setAttached({ type: 'text', name: file.name, data: content })
      }
      reader.readAsText(file)
    }
  }

  /* ── executeTool ─────────────────────────────────────────── */
  async function executeTool(name, inp) {
    try {
      if (name === 'info_cliente') {
        const nomeBusca = (inp.nome || '').toLowerCase()
        let clients = data.erpClients || []
        if (supabase) {
          const { data: db } = await supabase.from('erp_clients').select('*')
          if (db?.length) clients = db.map(c => ({ id: c.id, name: c.name, status: c.status, monthlyValue: Number(c.monthly_value) || 0, niche: c.niche }))
        }
        const match = clients.filter(c => c.name.toLowerCase().includes(nomeBusca))
        if (!match.length) return { error: `Cliente "${inp.nome}" não encontrado` }
        const client = match[0]
        let clientTasks = (data.tasks || []).filter(t => String(t.clientId) === String(client.id))
        if (supabase) {
          const { data: dt } = await supabase.from('tasks').select('*').eq('client_id', client.id)
          if (dt) clientTasks = dt.map(t => ({ id: t.id, title: t.title, status: t.status, priority: t.priority, dueDate: t.due_date, assignee: t.assignee }))
        }
        const pendentes = clientTasks.filter(t => t.status !== 'done' && t.status !== 'concluido')
        const gadsKey = Object.keys(GADS_MAP).find(k => nomeBusca.includes(k) || k.includes(nomeBusca.split(' ')[0]))
        const gadsInfo = gadsKey ? GADS_MAP[gadsKey] : null
        return {
          cliente: { id: client.id, nome: client.name, status: client.status, valorMensal: client.monthlyValue, nicho: client.niche },
          tarefas: { total: clientTasks.length, pendentes: pendentes.length, lista: pendentes.slice(0, 5).map(t => ({ titulo: t.title, status: t.status, prioridade: t.priority, prazo: t.dueDate })) },
          googleAds: gadsInfo ? { customerId: gadsInfo.id, nome: gadsInfo.nome, link: `https://ads.google.com/aw/overview?ocid=${gadsInfo.id}` } : 'ID Google Ads não mapeado',
        }
      }

      if (name === 'tarefas_pendentes') {
        let tasks = data.tasks || []
        if (supabase) {
          let q = supabase.from('tasks').select('*').neq('status', 'done').order('created_at', { ascending: false })
          if (inp.cliente_id) q = q.eq('client_id', inp.cliente_id)
          const { data: dt } = await q
          if (dt) tasks = dt.map(t => ({ id: t.id, clientId: t.client_id, title: t.title, status: t.status, priority: t.priority, assignee: t.assignee, dueDate: t.due_date }))
        } else {
          tasks = tasks.filter(t => t.status !== 'done' && t.status !== 'concluido')
          if (inp.cliente_id) tasks = tasks.filter(t => String(t.clientId) === String(inp.cliente_id))
        }
        const hoje = new Date().toISOString().split('T')[0]
        const atrasadas = tasks.filter(t => t.dueDate && t.dueDate < hoje)
        const urgentes  = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent')
        const getClientName = id => (data.erpClients || []).find(c => String(c.id) === String(id))?.name || id
        return {
          total_pendentes: tasks.length, atrasadas: atrasadas.length, urgentes: urgentes.length,
          tarefas: tasks.slice(0, 10).map(t => ({ titulo: t.title, cliente: getClientName(t.clientId), status: t.status, prioridade: t.priority, responsavel: t.assignee, prazo: t.dueDate, atrasada: t.dueDate ? t.dueDate < hoje : false })),
          aviso: tasks.length > 10 ? `Mostrando 10 de ${tasks.length} tarefas` : null,
        }
      }

      if (name === 'google_ads_conta') {
        const q = (inp.cliente || '').toLowerCase()
        const key = Object.keys(GADS_MAP).find(k => q.includes(k) || k.includes(q.split(' ')[0]))
        if (!key) return { error: `Conta Google Ads não mapeada para "${inp.cliente}". Mapeados: ${Object.values(GADS_MAP).map(v => v.nome).join(', ')}` }
        const info = GADS_MAP[key]
        return { cliente: info.nome, customer_id: info.id, link: `https://ads.google.com/aw/overview?ocid=${info.id}`, formato_mcc: info.id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') }
      }

      if (name === 'buscar_performance_google') {
        const q = (inp.cliente || '').toLowerCase()
        const key = Object.keys(GADS_MAP).find(k => q.includes(k) || k.includes(q))
        if (!key) return { erro: `Conta não encontrada para "${inp.cliente}". Nomes válidos: ${Object.keys(GADS_MAP).join(', ')}` }
        const conta = GADS_MAP[key]
        const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
        const dias = diasMap[inp.periodo || 'last_30d'] || 30
        const result = await callGadsApi({ action: 'performance', customerId: conta.id, dias })
        if (result.erro) return result
        if (!Array.isArray(result) || !result.length) return { aviso: 'Sem dados de campanha no período.', cliente: conta.nome }
        const { total, campanhas } = agregarGadsCampanhas(result)
        return { cliente: conta.nome, customer_id: conta.id, dias, total, por_campanha: campanhas }
      }

      if (name === 'buscar_performance_carteira_google') {
        const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
        const dias = diasMap[inp.periodo || 'last_7d'] || 7
        const customerIds = Object.values(GADS_MAP).map(v => v.id)
        const result = await callGadsApi({ action: 'carteira', customerIds, dias })
        if (result.erro) return result
        const idToNome = Object.fromEntries(Object.values(GADS_MAP).map(v => [v.id, v.nome]))
        const por_conta = {}
        for (const [cid, dados] of Object.entries(result)) {
          por_conta[idToNome[cid] || cid] = dados
        }
        const total_gasto = Object.values(por_conta).filter(v => !v.erro).reduce((s, v) => s + (v.gasto || 0), 0)
        return { dias, total_gasto: +total_gasto.toFixed(2), contas: Object.keys(por_conta).length, por_conta }
      }

      if (name === 'solicitar_acao_google') {
        if (!supabase) return { erro: 'Banco de dados indisponível.' }
        const { error } = await supabase.from('ton_alertas').insert({
          descricao:  `[TON] ${inp.tipo_acao} — ${inp.cliente}: ${inp.descricao}`,
          impacto:    inp.motivo,
          reversivel: true,
        })
        if (error) return { erro: error.message }
        return { sucesso: true, mensagem: `Ação "${inp.tipo_acao}" registrada para ${inp.cliente}. Será executada na próxima rodada.` }
      }

      if (name === 'criar_tarefa') {
        if (!supabase) return { erro: 'Banco de dados indisponível.' }
        const taskData = {
          title:      inp.titulo,
          status:     'todo',
          priority:   inp.prioridade || 'medium',
          client_id:  inp.cliente_id  || null,
          assignee:   inp.responsavel || null,
          due_date:   inp.prazo       || null,
          type:       inp.tipo        || 'outro',
          description: inp.descricao  || null,
          created_by: 'ton',
          created_at: new Date().toISOString(),
        }
        const { data: created, error } = await supabase.from('tasks').insert(taskData).select().single()
        if (error) return { erro: `Falha ao criar: ${error.message}` }
        return { sucesso: true, id: created?.id, titulo: inp.titulo, mensagem: `Tarefa "${inp.titulo}" registrada no sistema com sucesso.` }
      }

      if (name === 'navegar_para') {
        const allowed = ['/erp', '/workspaces', '/equipe', '/playbooks', '/entregas', '/noticias', '/arena', '/educacao', '/parceiros', '/relatorios', '/pipeline', '/contatos', '/calendario']
        const path = (inp.pagina || '').startsWith('/') ? inp.pagina : `/${inp.pagina}`
        if (!allowed.some(p => path.startsWith(p))) {
          return { erro: `Página não disponível. Disponíveis: ${allowed.join(', ')}` }
        }
        setTimeout(() => window.dispatchEvent(new CustomEvent('ton:navigate', { detail: { path } })), 600)
        return { sucesso: true, mensagem: `Abrindo ${path} em instantes…` }
      }

      return { error: `Tool desconhecida: ${name}` }
    } catch (err) {
      return { error: `Erro: ${err.message}` }
    }
  }

  /* ── send ────────────────────────────────────────────────── */
  async function send(overrideText) {
    const text = (overrideText || input).trim()
    if ((!text && !attached) || streaming) return
    setInput('')

    const key = import.meta.env.VITE_CLAUDE_API_KEY || localStorage.getItem('claudeApiKey')
    if (!key) {
      setMessages(p => [...p,
        { role: 'user',      content: text || `📎 ${attached?.name}`, time: now() },
        { role: 'assistant', content: 'API key não configurada. Peça ao admin adicionar no painel de configurações.', time: now() },
      ])
      return
    }

    // ── URL detection ─────────────────────────────────────
    let urlContext = ''
    const urlMatch = text.match(/https?:\/\/[^\s]+/)
    if (urlMatch) {
      setUrlFetching(true)
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 9000)
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlMatch[0])}`, { signal: ctrl.signal })
        clearTimeout(timer)
        const html = await res.text()
        const clean = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/&[a-z]+;/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000)
        if (clean.length > 100) urlContext = `\n\n[CONTEÚDO DE ${urlMatch[0]}]\n${clean}\n[/CONTEÚDO URL]`
      } catch {}
      setUrlFetching(false)
    }

    // ── Build API message content ──────────────────────────
    const fileCtx = attached?.type === 'text'
      ? `\n\n[ARQUIVO: ${attached.name}]\n${attached.data}\n[/ARQUIVO]`
      : ''

    let apiContent
    if (attached?.type === 'image') {
      apiContent = [
        { type: 'image', source: { type: 'base64', media_type: attached.mime, data: attached.data } },
        { type: 'text',  text: (text || 'Analise esta imagem no contexto da TráfegOn.') + urlContext },
      ]
    } else {
      apiContent = text + fileCtx + urlContext
    }

    // ── Display content ────────────────────────────────────
    const displayParts = []
    if (text) displayParts.push(text)
    if (attached) displayParts.push(`📎 ${attached.name}`)
    if (urlContext) displayParts.push('🔗 URL lida')
    const displayText = displayParts.join('  ·  ')

    const savedAttached = attached
    setAttached(null)

    const streamId  = `s-${Date.now()}`
    setMessages(p => [...p,
      { role: 'user',      content: displayText, time: now(), imagePreview: savedAttached?.type === 'image' ? savedAttached.preview : null },
      { role: 'assistant', content: '', time: now(), streaming: true, id: streamId },
    ])
    const newHistory = [...history, { role: 'user', content: apiContent }]
    setHistory(newHistory)
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller
    let workingHistory = [...newHistory]

    try {
      let iter = 0
      while (iter < 5) {
        iter++
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
            max_tokens: 2048,
            stream: false,
            system: buildTonPrompt(dataWithKnowledge),
            tools: TOOLS,
            messages: workingHistory,
          }),
        })

        if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
        const response = await res.json()

        if (response.stop_reason === 'tool_use') {
          const toolUseBlocks = response.content.filter(b => b.type === 'tool_use')
          const textBlocks    = response.content.filter(b => b.type === 'text')
          if (textBlocks.length > 0) {
            setMessages(p => p.map(m => m.id === streamId ? { ...m, content: textBlocks.map(b => b.text).join('') } : m))
          }
          workingHistory.push({ role: 'assistant', content: response.content })
          const toolResults = []
          for (const tb of toolUseBlocks) {
            setToolActive(TOOL_LABELS[tb.name] || tb.name)
            setMessages(p => p.map(m => m.id === streamId ? { ...m, toolActive: TOOL_LABELS[tb.name] } : m))
            const result = await executeTool(tb.name, tb.input)
            toolResults.push({ type: 'tool_result', tool_use_id: tb.id, content: JSON.stringify(result) })
          }
          setToolActive(null)
          const toolsUsed = toolUseBlocks.map(b => b.name)
          setMessages(p => p.map(m => m.id === streamId ? { ...m, toolActive: null, toolsUsed } : m))
          workingHistory.push({ role: 'user', content: toolResults })
          continue
        }

        if (response.stop_reason === 'end_turn') {
          const finalText = response.content.filter(b => b.type === 'text').map(b => b.text).join('')
          setMessages(p => p.map(m => m.id === streamId ? { ...m, content: finalText, id: Date.now(), streaming: false, toolActive: null } : m))
          setHistory(p => [...p, { role: 'assistant', content: finalText }])
          extractAndSaveMemories(text, finalText, key)
          break
        }
        break
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(p => p.map(m => m.id === streamId
          ? { ...m, id: Date.now(), content: `Erro de conexão: ${err.message}`, streaming: false }
          : m
        ))
      }
    } finally {
      setStreaming(false)
      setToolActive(null)
    }
  }

  /* ── CopyButton ──────────────────────────────────────────── */
  function CopyButton({ text }) {
    const [copied, setCopied] = useState(false)
    return (
      <button
        onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
        className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'rgba(110,218,44,0.1)', color: '#6eda2c' }}
        title="Copiar">
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
    )
  }

  const msgCount = messages.filter(m => m.role === 'user').length

  return (
    <>
      {/* ── Botão flutuante ────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-[100] rounded-2xl overflow-hidden"
        style={{
          width: 56, height: 56,
          boxShadow: open
            ? '0 0 0 2px #6eda2c, 0 0 32px rgba(110,218,44,0.6), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 0 0 1.5px rgba(110,218,44,0.4), 0 0 20px rgba(110,218,44,0.2), 0 8px 20px rgba(0,0,0,0.5)',
        }}
        title="ton — inteligência TráfegOn">
        <TonSVG size={56} />
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
          style={{ background: '#6eda2c', boxShadow: '0 0 6px #6eda2c' }}
        />
      </motion.button>

      {/* ── Painel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[99] flex flex-col overflow-hidden"
            style={isMobile
              ? { inset: 0, borderRadius: 0 }
              : { bottom: 76, right: 24, width: 480, height: 640, borderRadius: 20 }
            }
          >
            {/* Fundo com gradiente e borda sutil */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(160deg, #0c1410 0%, #07090c 60%, #070a08 100%)',
              border: isMobile ? 'none' : '1px solid rgba(110,218,44,0.18)',
              borderRadius: 'inherit',
              boxShadow: '0 0 0 1px rgba(110,218,44,0.06), 0 32px 80px rgba(0,0,0,0.85)',
            }} />

            {/* ── Header ────────────────────────────────────── */}
            <div className="relative flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(110,218,44,0.1)' }}>
              {/* Avatar com glow */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 16px rgba(110,218,44,0.5)' }}>
                  <TonSVG size={36} />
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: '#6eda2c', boxShadow: '0 0 6px #6eda2c', border: '1.5px solid #07090c' }}
                />
              </div>

              {/* Nome e status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight" style={{ color: '#6eda2c', letterSpacing: '-0.02em' }}>ton</span>
                  {msgCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(110,218,44,0.12)', color: 'rgba(110,218,44,0.6)' }}>
                      {msgCount} msg{msgCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-[10px] truncate" style={{ color: 'rgba(110,218,44,0.4)' }}>
                  {toolActive
                    ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toolActive}…</motion.span>
                    : streaming ? 'pensando…' : 'inteligência TráfegOn · sempre aqui'}
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setHistory([]) }}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                    title="Limpar conversa">
                    <Trash2 size={12} />
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  title="Minimizar">
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* ── Mensagens ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(110,218,44,0.12) transparent' }}>

              {/* Estado vazio */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center px-4 pb-6">
                  <motion.div
                    animate={{ filter: ['drop-shadow(0 0 10px rgba(110,218,44,0.4))', 'drop-shadow(0 0 20px rgba(110,218,44,0.7))', 'drop-shadow(0 0 10px rgba(110,218,44,0.4))'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="mb-4">
                    <TonSVG size={76} />
                  </motion.div>
                  <p className="font-black text-base mb-1" style={{ color: '#6eda2c', letterSpacing: '-0.03em' }}>ton</p>
                  <p className="text-[11px] leading-relaxed mb-5 max-w-[260px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                    Conheço cada cliente, cada campanha, cada número desta agência. Me pergunte o que quiser.
                  </p>
                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
                    {QUICK.map(q => (
                      <motion.button
                        key={q.q}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => send(q.q)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,218,44,0.14)', color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(110,218,44,0.35)'; e.currentTarget.style.background = 'rgba(110,218,44,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(110,218,44,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 14 }}>{q.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{q.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Mensagens */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {/* Avatar TON */}
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 mt-1"
                      style={{ boxShadow: '0 0 8px rgba(110,218,44,0.3)' }}>
                      <TonSVG size={24} />
                    </div>
                  )}

                  <div className={msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[90%]'}>
                    {/* Bubble */}
                    <div className="relative group rounded-2xl px-3.5 py-2.5"
                      style={msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, rgba(110,218,44,0.2) 0%, rgba(80,180,20,0.14) 100%)',
                            border: '1px solid rgba(110,218,44,0.25)',
                            borderBottomRightRadius: 5,
                            color: '#d8f8c0',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderBottomLeftRadius: 5,
                          }
                      }>

                      {/* Tool loading */}
                      {msg.toolActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(110,218,44,0.08)', border: '1px solid rgba(110,218,44,0.15)' }}>
                          <div className="flex gap-1">
                            {[0, 1, 2].map(j => (
                              <motion.span key={j}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1, 0.7] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: j * 0.18 }}
                                style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: '#6eda2c' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 10, color: 'rgba(110,218,44,0.7)', fontFamily: 'monospace' }}>{msg.toolActive}</span>
                        </motion.div>
                      )}

                      {/* Conteúdo */}
                      {msg.streaming && !msg.content && !msg.toolActive
                        ? (
                          <div className="flex items-center gap-1.5 py-0.5">
                            {[0, 1, 2].map(j => (
                              <motion.span key={j}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: j * 0.22 }}
                                style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#6eda2c' }} />
                            ))}
                          </div>
                        )
                        : msg.role === 'user'
                          ? <>
                              {msg.imagePreview && (
                                <img src={msg.imagePreview} alt="anexo" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, marginBottom: 6, objectFit: 'cover' }} />
                              )}
                              <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                            </>
                          : <MdText text={msg.content} />
                      }

                      {msg.role === 'assistant' && msg.content && <CopyButton text={msg.content} />}
                    </div>

                    {/* Tool tags */}
                    {msg.toolsUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 px-0.5">
                        {msg.toolsUsed.map(t => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md"
                            style={{ background: 'rgba(110,218,44,0.07)', color: 'rgba(110,218,44,0.45)', fontFamily: 'monospace', border: '1px solid rgba(110,218,44,0.1)' }}>
                            ⚡ {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Horário */}
                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginTop: 3, paddingLeft: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ─────────────────────────────────────── */}
            <div className="relative flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(110,218,44,0.08)' }}>
              {/* Preview de anexo */}
              {attached && (
                <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-xl"
                  style={{ background: 'rgba(110,218,44,0.06)', border: '1px solid rgba(110,218,44,0.2)' }}>
                  {attached.type === 'image'
                    ? <img src={attached.preview} alt="preview" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                    : <span style={{ fontSize: 16 }}>📄</span>
                  }
                  <span style={{ fontSize: 11, color: 'rgba(110,218,44,0.8)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {attached.name}
                  </span>
                  <button onClick={() => setAttached(null)} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Indicador de leitura de URL */}
              {urlFetching && (
                <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-xl"
                  style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Globe size={12} style={{ color: '#60a5fa' }} />
                  </motion.div>
                  <span style={{ fontSize: 11, color: 'rgba(96,165,250,0.8)' }}>lendo conteúdo da URL…</span>
                </div>
              )}

              {/* Input + botões */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.txt,.md,.csv,.json,.html,.js,.ts,.jsx,.tsx,.py,.sql"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    rows={1}
                    onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Pergunte ao ton…"
                    disabled={streaming}
                    style={{
                      width: '100%',
                      background: focused ? 'rgba(110,218,44,0.05)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${focused ? 'rgba(110,218,44,0.35)' : 'rgba(110,218,44,0.14)'}`,
                      borderRadius: 12,
                      padding: '9px 14px',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.88)',
                      outline: 'none',
                      resize: 'none',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.5,
                      maxHeight: 100,
                      overflow: 'auto',
                      boxShadow: focused ? '0 0 0 3px rgba(110,218,44,0.08)' : 'none',
                    }}
                  />
                  {input.length > 200 && (
                    <span style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                      {input.length}
                    </span>
                  )}
                </div>

                {/* Botão de anexo */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={streaming}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-25"
                  style={{
                    background: attached ? 'rgba(110,218,44,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${attached ? 'rgba(110,218,44,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: attached ? '#6eda2c' : 'rgba(255,255,255,0.3)',
                  }}
                  title="Anexar imagem ou arquivo">
                  <Paperclip size={13} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={streaming
                    ? () => { abortRef.current?.abort(); setStreaming(false); setToolActive(null) }
                    : () => send()}
                  disabled={!streaming && !input.trim() && !attached}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-25"
                  style={{
                    background: streaming
                      ? 'rgba(239,68,68,0.18)'
                      : (input.trim() || attached) ? 'rgba(110,218,44,0.22)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${streaming ? 'rgba(239,68,68,0.3)' : (input.trim() || attached) ? 'rgba(110,218,44,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: streaming ? '#ef4444' : '#6eda2c',
                    boxShadow: (input.trim() || attached) && !streaming ? '0 0 12px rgba(110,218,44,0.2)' : 'none',
                  }}>
                  {streaming
                    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.4)', borderTopColor: '#ef4444' }} />
                    : <Send size={13} />
                  }
                </motion.button>
              </div>

              {/* Dica */}
              {!streaming && (
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.12)', textAlign: 'center', marginTop: 6 }}>
                  Enter para enviar · Shift+Enter para nova linha
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
