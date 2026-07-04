import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Trash2, Copy, Check, ChevronDown, Paperclip, Globe, Sparkles, ChevronRight } from 'lucide-react'
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
        responsavel: { type: 'string', description: 'ID do colaborador responsável (opcional). Use: gs, tochiro, ana_sm, beatriz, mariana, elieser, deivisson, adm_at' },
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
    description: 'Busca performance real de campanhas Google Ads de um cliente: gasto, cliques, impressões, conversões, CPL, CTR. Use sempre que perguntarem sobre métricas, resultados ou desempenho. Aceita períodos predefinidos OU datas específicas (data_inicio + data_fim têm prioridade sobre periodo).',
    input_schema: { type: 'object', required: ['cliente'], properties: {
      cliente:     { type: 'string', description: 'Nome do cliente' },
      periodo:     { type: 'string', enum: ['last_7d', 'last_14d', 'last_30d'], description: 'Período predefinido. Ignorado se data_inicio/data_fim fornecidos.' },
      data_inicio: { type: 'string', description: 'Data inicial YYYY-MM-DD (ex: "2026-06-20"). Usar para períodos específicos.' },
      data_fim:    { type: 'string', description: 'Data final YYYY-MM-DD (ex: "2026-06-25"). Usar junto com data_inicio.' },
    }}
  },
  {
    name: 'buscar_performance_carteira_google',
    description: 'Busca performance de todos os clientes Google Ads. Use para briefing ou visão geral. Aceita períodos predefinidos OU datas específicas.',
    input_schema: { type: 'object', properties: {
      periodo:     { type: 'string', enum: ['last_7d', 'last_14d', 'last_30d'], description: 'Período predefinido. Ignorado se data_inicio/data_fim fornecidos.' },
      data_inicio: { type: 'string', description: 'Data inicial YYYY-MM-DD.' },
      data_fim:    { type: 'string', description: 'Data final YYYY-MM-DD.' },
    }}
  },
  {
    name: 'buscar_termos_pesquisa',
    description: 'Busca o relatório de termos de pesquisa (Search Terms Report) de um cliente. Mostra exatamente o que os usuários digitaram no Google que acionou os anúncios, com custo e conversões por termo. Use para identificar termos ruins a negativar ou boas keywords a adicionar. Após analisar, use negativar_termos para pausar os ruins.',
    input_schema: { type: 'object', required: ['cliente'], properties: {
      cliente:     { type: 'string', description: 'Nome do cliente' },
      campaign_id: { type: 'string', description: 'ID da campanha específica (opcional). Se omitido, traz de todas as campanhas.' },
      data_inicio: { type: 'string', description: 'Data inicial YYYY-MM-DD. Padrão: últimos 30 dias.' },
      data_fim:    { type: 'string', description: 'Data final YYYY-MM-DD.' },
      dias:        { type: 'number', description: 'Alternativa ao data_inicio/fim: últimos N dias. Padrão: 30.' },
    }}
  },
  {
    name: 'pausar_campanha',
    description: 'Pausa uma campanha ATIVA no Google Ads. Quando confirmar=false (padrão): mostre os detalhes e pergunte confirmação. Só execute a ação real com confirmar=true após o usuário confirmar explicitamente.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id', 'confirmar'], properties: {
      cliente:       { type: 'string', description: 'Nome do cliente' },
      campaign_id:   { type: 'string', description: 'ID numérico da campanha (obtenha via buscar_performance_google)' },
      campaign_nome: { type: 'string', description: 'Nome da campanha para exibir na confirmação' },
      confirmar:     { type: 'boolean', description: 'false = mostrar preview e pedir confirmação | true = executar a ação' },
    }}
  },
  {
    name: 'ativar_campanha',
    description: 'Reativa uma campanha PAUSADA no Google Ads. Quando confirmar=false (padrão): mostre os detalhes e pergunte confirmação. Só execute com confirmar=true.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id', 'confirmar'], properties: {
      cliente:       { type: 'string' },
      campaign_id:   { type: 'string' },
      campaign_nome: { type: 'string' },
      confirmar:     { type: 'boolean' },
    }}
  },
  {
    name: 'ajustar_orcamento',
    description: 'Altera o orçamento diário de uma campanha. Quando confirmar=false: mostre o valor atual vs novo e pergunte confirmação. Só execute com confirmar=true.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id', 'orcamento_diario', 'confirmar'], properties: {
      cliente:         { type: 'string' },
      campaign_id:     { type: 'string' },
      campaign_nome:   { type: 'string' },
      orcamento_diario:{ type: 'number', description: 'Novo orçamento diário em R$' },
      confirmar:       { type: 'boolean' },
    }}
  },
  {
    name: 'negativar_termos',
    description: 'Adiciona palavras-chave negativas a uma campanha. Quando confirmar=false: liste os termos e pergunte confirmação. Só execute com confirmar=true.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id', 'termos', 'confirmar'], properties: {
      cliente:       { type: 'string' },
      campaign_id:   { type: 'string' },
      campaign_nome: { type: 'string' },
      termos:        { type: 'array', items: { type: 'string' }, description: 'Termos a negativar' },
      tipo:          { type: 'string', enum: ['BROAD', 'PHRASE', 'EXACT'], description: 'Tipo de correspondência. Padrão: BROAD' },
      confirmar:     { type: 'boolean' },
    }}
  },
  {
    name: 'adicionar_keywords',
    description: 'Adiciona palavras-chave a um grupo de anúncios. Use listar_grupos_anuncios para obter o adGroupId. Quando confirmar=false: liste as keywords e pergunte confirmação. Só execute com confirmar=true.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id', 'ad_group_id', 'keywords', 'confirmar'], properties: {
      cliente:      { type: 'string' },
      campaign_id:  { type: 'string' },
      ad_group_id:  { type: 'string', description: 'ID numérico do grupo de anúncios' },
      ad_group_nome:{ type: 'string' },
      keywords:     { type: 'array', items: { type: 'string' }, description: 'Keywords a adicionar' },
      tipo:         { type: 'string', enum: ['BROAD', 'PHRASE', 'EXACT'], description: 'Tipo de correspondência. Padrão: PHRASE' },
      confirmar:    { type: 'boolean' },
    }}
  },
  {
    name: 'listar_grupos_anuncios',
    description: 'Lista os grupos de anúncios de uma campanha. Use antes de adicionar keywords para obter o ad_group_id.',
    input_schema: { type: 'object', required: ['cliente', 'campaign_id'], properties: {
      cliente:     { type: 'string' },
      campaign_id: { type: 'string' },
    }}
  },
  {
    name: 'criar_anuncio_rsa',
    description: 'Cria um anúncio responsivo de pesquisa (RSA) num grupo de anúncios, via API. Criado PAUSADO por segurança. Com confirmar=false: mostra o preview dos títulos/descrições e pede confirmação. Com confirmar=true: cria de fato. Requer 3-15 títulos (máx 30 chars), 2-4 descrições (máx 90 chars) e a URL de destino.',
    input_schema: { type: 'object', required: ['cliente', 'ad_group_id', 'headlines', 'descriptions', 'final_url', 'confirmar'], properties: {
      cliente:      { type: 'string', description: 'Nome do cliente' },
      ad_group_id:  { type: 'string', description: 'ID do grupo de anúncios (de listar_grupos_anuncios ou criar_campanha)' },
      headlines:    { type: 'array', items: { type: 'string' }, description: '3 a 15 títulos, máx 30 caracteres cada' },
      descriptions: { type: 'array', items: { type: 'string' }, description: '2 a 4 descrições, máx 90 caracteres cada' },
      final_url:    { type: 'string', description: 'URL de destino do anúncio (landing page)' },
      path1:        { type: 'string', description: 'Caminho de exibição 1 (opcional, máx 15 chars)' },
      path2:        { type: 'string', description: 'Caminho de exibição 2 (opcional, máx 15 chars)' },
      confirmar:    { type: 'boolean', description: 'false = preview | true = criar' },
    }}
  },
  {
    name: 'buscar_noticias',
    description: 'Busca notícias em tempo real dos principais sites de marketing, negócios e publicidade (Mundo do Marketing, Meio & Mensagem, AdNews, PropMark, E-Commerce Brasil, B9, Search Engine Journal, Social Media Today e outros). Use para encontrar pautas e tendências para o perfil da TráfegOn. Após buscar, analise e sugira os melhores conteúdos com formato e ângulo de abordagem.',
    input_schema: {
      type: 'object',
      properties: {
        acao:  { type: 'string', enum: ['feeds', 'busca'], description: 'feeds = últimas notícias dos sites curados em tempo real | busca = pesquisa por palavra-chave no Google News. Padrão: feeds' },
        query: { type: 'string', description: 'Termos de busca (usar quando acao=busca). Ex: "Meta Ads novidades", "Google Ads 2025", "inteligência artificial marketing"' },
        max:   { type: 'number', description: 'Máximo de resultados. Padrão: 20' },
      }
    }
  },
  {
    name: 'criar_campanha',
    description: 'Cria uma nova campanha no Google Ads. A campanha é criada PAUSADA por segurança. Com confirmar=false: exibe o resumo completo da estrutura e pede confirmação. Com confirmar=true: cria de fato. Após criar, o usuário deve adicionar grupos, keywords e anúncios antes de ativar.',
    input_schema: {
      type: 'object',
      required: ['cliente', 'nome', 'orcamento_diario', 'confirmar'],
      properties: {
        cliente:          { type: 'string', description: 'Nome do cliente' },
        nome:             { type: 'string', description: 'Nome da campanha (ex: "Campanha Pesquisa | Produto | BH")' },
        orcamento_diario: { type: 'number', description: 'Orçamento diário em R$' },
        tipo:             { type: 'string', enum: ['SEARCH', 'DISPLAY', 'VIDEO'], description: 'Tipo de campanha. Padrão: SEARCH' },
        estrategia_lance: { type: 'string', enum: ['MAXIMIZE_CONVERSIONS', 'TARGET_CPA', 'MANUAL_CPC'], description: 'Estratégia de lance. Padrão: MAXIMIZE_CONVERSIONS' },
        cpa_alvo:         { type: 'number', description: 'CPA alvo em R$ (só para TARGET_CPA)' },
        rede_busca:       { type: 'boolean', description: 'Ativar rede de pesquisa. Padrão: true' },
        rede_display:     { type: 'boolean', description: 'Ativar rede de display. Padrão: false (recomendado manter desativado)' },
        criar_grupo:      { type: 'boolean', description: 'Se true, cria também um grupo de anúncios inicial' },
        grupo_nome:       { type: 'string', description: 'Nome do grupo de anúncios inicial (obrigatório se criar_grupo=true)' },
        grupo_cpc_padrao: { type: 'number', description: 'CPC máximo do grupo em R$. Padrão: R$1,00' },
        confirmar:        { type: 'boolean', description: 'false = mostrar preview e pedir confirmação | true = executar criação' },
      }
    }
  },
  {
    name: 'navegar_para',
    description: 'Navega para uma página do hub. Use para levar o usuário diretamente a uma seção específica do sistema.',
    input_schema: {
      type: 'object',
      properties: {
        pagina: { type: 'string', description: 'Caminho da página. Opções: /erp, /workspaces, /equipe, /playbooks, /entregas, /arena, /educacao, /parceiros, /relatorios, /pipeline' }
      },
      required: ['pagina']
    }
  },
  {
    name: 'ghl_leads',
    description: 'Busca os leads/contatos mais recentes do GoHighLevel de um cliente. Use quando perguntarem sobre leads, contatos, prospects ou novas entradas no CRM do cliente.',
    input_schema: { type: 'object', required: ['cliente'], properties: { cliente: { type: 'string', description: 'Nome ou slug do cliente' } } }
  },
  {
    name: 'ghl_pipeline',
    description: 'Busca o funil de vendas (pipeline de oportunidades) do GoHighLevel de um cliente: quantas oportunidades por etapa, valor total, ganhos e perdidos.',
    input_schema: { type: 'object', required: ['cliente'], properties: { cliente: { type: 'string', description: 'Nome ou slug do cliente' } } }
  },
  {
    name: 'ghl_conversas',
    description: 'Busca as conversas/mensagens do GoHighLevel de um cliente: leads sem resposta, mensagens não lidas, última mensagem de cada contato.',
    input_schema: { type: 'object', required: ['cliente'], properties: { cliente: { type: 'string', description: 'Nome ou slug do cliente' } } }
  },
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
  buscar_termos_pesquisa:            'buscando termos de pesquisa',
  pausar_campanha:                   'pausando campanha',
  ativar_campanha:                   'ativando campanha',
  ajustar_orcamento:                 'ajustando orçamento',
  negativar_termos:                  'adicionando negativações',
  adicionar_keywords:                'adicionando palavras-chave',
  listar_grupos_anuncios:            'buscando grupos de anúncios',
  criar_anuncio_rsa:                 'criando anúncio RSA no Google Ads',
  buscar_noticias:                   'buscando notícias em tempo real',
  criar_campanha:                    'criando campanha no Google Ads',
  criar_tarefa:                      'criando tarefa no sistema',
  navegar_para:                      'navegando no hub',
  ghl_leads:                         'buscando leads no GHL',
  ghl_pipeline:                      'buscando funil de vendas GHL',
  ghl_conversas:                     'buscando conversas GHL',
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
Gabriel S. (Admin/Tráfego) · Carol (Admin) · Juliano (Tráfego) · Ana (Intern SM) · Beatriz (Social Media) · Érica (Atendimento)

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

## TOOLS — GOOGLE ADS (DADOS REAIS + OPERAÇÕES DIRETAS)
Você tem acesso DIRETO à API do Google Ads — leitura E escrita. Use SEMPRE as tools abaixo:

**LEITURA:**
- \`buscar_performance_google\` → métricas reais de um cliente (gasto, cliques, impressões, conversões, CPL, CTR por campanha)
- \`buscar_performance_carteira_google\` → visão geral de toda a carteira
- \`buscar_termos_pesquisa\` → Search Terms Report — o que os usuários digitaram que acionou os anúncios
- \`listar_grupos_anuncios\` → grupos de anúncios de uma campanha
- \`google_ads_conta\` → Customer ID e link de acesso à conta

**OPERAÇÕES (sempre com confirmar=false primeiro para preview):**
- \`criar_campanha\` → cria campanha nova (começa PAUSADA por segurança). USE quando pedirem "criar campanha", "nova campanha", "montar campanha"
- \`pausar_campanha\` / \`ativar_campanha\` → muda status da campanha
- \`ajustar_orcamento\` → altera orçamento diário
- \`negativar_termos\` → adiciona palavras-chave negativas
- \`adicionar_keywords\` → adiciona palavras-chave positivas a um grupo
- \`criar_anuncio_rsa\` → cria anúncio responsivo de pesquisa (RSA) via API, no grupo de anúncios (começa PAUSADO). Já está disponível — NÃO diga que RSA só pode ser criado manualmente. Fluxo completo de campanha: criar_campanha → (pega ad_group_id) → adicionar_keywords → criar_anuncio_rsa.

**NUNCA** diga que não tem acesso a métricas ou que não pode criar/alterar campanhas/anúncios. Você TEM. Use as tools.
**FLUXO OBRIGATÓRIO para operações destrutivas:** sempre chame com confirmar=false primeiro para mostrar preview, depois com confirmar=true após confirmação do usuário.

## TOOLS — NOTÍCIAS & CONTEÚDO (TEMPO REAL)
- \`buscar_noticias\` → busca notícias em tempo real dos principais sites: Mundo do Marketing, Meio & Mensagem, AdNews, PropMark, E-Commerce Brasil, B9, Search Engine Journal, Social Media Today.
  - Use com \`acao: 'feeds'\` para buscar as últimas notícias de todos os sites
  - Use com \`acao: 'busca'\` + \`query\` para pesquisar por tema específico no Google News
  - Após buscar: analise, selecione as mais relevantes e sugira conteúdos com formato e ângulo
  - **NUNCA** diga que não tem acesso a notícias atuais — use essa tool sempre que pedirem pauta, tendências, novidades ou conteúdo para o perfil

## TOOLS — GOHIGHLEVEL (CRM DOS CLIENTES)
Você tem acesso DIRETO ao GoHighLevel de cada cliente que tiver integração configurada. Use sempre que perguntarem sobre leads, funil, conversas ou CRM do cliente.
- \`ghl_leads\` → últimos contatos/leads que entraram no GHL do cliente
- \`ghl_pipeline\` → funil de vendas: oportunidades por etapa, valor total, ganhos e perdidos
- \`ghl_conversas\` → conversas e mensagens: quantos leads sem resposta, últimas mensagens
**NUNCA** diga que não tem acesso ao GHL ou que não pode ver o CRM do cliente. Você TEM — use as tools.
Se retornar erro de "não configurado", informe que o cliente ainda não tem integração GHL ativa.

## TOOLS — CRM INTERNO
Você tem ferramentas para consultar dados reais do CRM interno. Use-as sempre que perguntarem sobre clientes, tarefas, Google Ads, ou quando precisar criar algo. Dados reais das tools têm prioridade sobre o system prompt.

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
  { icon: '📈', label: 'Briefing da carteira',  q: 'Busque a performance de toda a carteira Google Ads nos últimos 7 dias. Para cada conta: gasto, conversões, CPL. Destaque quem está acima e abaixo da meta.' },
  { icon: '💡', label: 'Onde melhorar?',         q: 'Onde a agência pode melhorar agora?' },
]

const PROMPT_CATEGORIES = [
  {
    id: 'gads',
    label: 'Google Ads',
    icon: '📊',
    prompts: [
      { label: '🆕 Criar campanha',         q: 'Quero criar uma nova campanha de pesquisa para o cliente [CLIENTE]. Nome: "[NOME DA CAMPANHA]". Orçamento: R$[VALOR]/dia. Estratégia: Maximizar Conversões. Me mostre o preview antes de criar.' },
      { label: '📈 Briefing da carteira',   q: 'Busque a performance de toda a carteira Google Ads nos últimos 7 dias. Para cada conta: gasto, conversões, CPL. Destaque quem está acima e abaixo da meta com ação recomendada.' },
      { label: '🔍 Analisar termos',        q: 'Busque os termos de pesquisa dos últimos 30 dias de [CLIENTE]. Identifique termos com custo acima de R$5 e zero conversão — são candidatos a negativar. Analise e proponha a lista.' },
      { label: '🚫 Negativar termos ruins', q: 'Vou negativar termos ruins de [CLIENTE]. Primeiro busque os termos de pesquisa dos últimos 30 dias, depois proponha exatamente quais negativar com justificativa. Mostre preview antes de executar.' },
      { label: '⏸ Pausar campanhas ruins',  q: 'Quais campanhas de [CLIENTE] têm gasto relevante mas zero ou poucas conversões nos últimos 14 dias? Analise e recomende quais pausar. Mostre o impacto estimado.' },
      { label: '💰 Ajustar orçamentos',     q: 'Analise os orçamentos de [CLIENTE] e sugira ajustes: qual campanha está limitada por orçamento com bom CPL e merece mais verba? Qual está gastando sem resultado?' },
      { label: '➕ Adicionar keywords',      q: 'Quero adicionar novas palavras-chave ao cliente [CLIENTE]. Primeiro liste os grupos de anúncios da campanha [CAMPANHA ID], depois sugira keywords relevantes para adicionar.' },
    ],
  },
  {
    id: 'trafego',
    label: 'Análise',
    icon: '📈',
    prompts: [
      { label: 'Performance do cliente',    q: 'Busque a performance Google Ads de [CLIENTE] nos últimos 30 dias. Analise por campanha: melhor CPL, maior desperdício, CTR e conversões. Sugira as 2 ações mais urgentes.' },
      { label: 'Clientes abaixo da meta',   q: 'Quais clientes Google Ads estão com CPL acima da meta nos últimos 7 dias? Liste: conta, CPL atual, referência de meta, prioridade de ação.' },
      { label: 'Diagnóstico completo',      q: 'Faça um diagnóstico completo da conta Google Ads de [CLIENTE]: estrutura de campanhas, keywords ativas, métricas de conversão, pontos críticos e próximos 3 passos.' },
      { label: 'Plano de otimização 30d',   q: 'Com base nos dados de [CLIENTE], crie um plano de otimização para os próximos 30 dias. Priorize pelo impacto esperado. Cada ação com métrica de sucesso.' },
      { label: 'Estrutura de campanha',     q: 'Sugira a estrutura ideal de campanhas Google Ads para [PRODUTO/SERVIÇO] com orçamento R$[VALOR]/mês. Tipos de campanha, grupos de anúncios, estratégia de lance justificada.' },
      { label: 'Escalar conta',             q: '[CLIENTE] quer escalar o investimento. Com base no histórico de CPL e conversões, qual é o teto saudável de orçamento e qual estratégia de escala recomenda?' },
    ],
  },
  {
    id: 'copy',
    label: 'Copy',
    icon: '✍️',
    prompts: [
      { label: 'RSA completo',              q: 'Crie um RSA completo para Google Ads. Produto: [PRODUTO]. Nicho: [NICHO]. Crie 15 headlines (máx 30 chars cada) e 4 descrições (máx 90 chars cada). Varie: dor, benefício, prova social, urgência, CTA.' },
      { label: 'Headlines de pesquisa',     q: 'Crie 10 headlines para anúncio Google Search. Nicho: [NICHO]. Público: [PÚBLICO]. Foco em intenção de compra. Máx 30 chars cada. Varie: dor, benefício, diferencial, CTA.' },
      { label: 'Copy para Landing Page',    q: 'Crie copy completo para LP de [PRODUTO/SERVIÇO]: headline principal, subheadline, 3 benefícios com prova, bloco de objeções, CTA. Tom direto, orientado a conversão.' },
      { label: 'Copy jurídico OAB',         q: 'Crie copy para anúncio de escritório de advocacia. Área: [ÁREA DO DIREITO]. Aplique compliance OAB obrigatório: sem promessa de resultado, sem captação direta. Foco em autoridade e educação jurídica.' },
      { label: 'Revisão de copy',           q: 'Revise este copy de anúncio: compliance (se jurídico: OAB), clareza, força da proposta de valor, CTA. Aponte problemas e entregue versão corrigida. Texto:\n[COLE O TEXTO AQUI]' },
      { label: 'Variações A/B',             q: 'Crie 3 variações de copy para teste A/B de [PRODUTO]. Variação 1: emocional (dor/desejo). Variação 2: racional (dados/prova). Variação 3: urgência/escassez. Compare o potencial de conversão de cada uma.' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    icon: '🎨',
    prompts: [
      { label: 'Brief de criativo',         q: 'Gere um brief detalhado para criativo [FORMATO: feed/stories/banner/carrossel]. Cliente: [CLIENTE]. Objetivo: [OBJETIVO]. Inclua: conceito visual, paleta, tipografia, mensagem principal, CTA, elementos obrigatórios e proibidos.' },
      { label: 'Analisar criativo',         q: 'Analise este criativo (vou anexar a imagem). Avalie: hierarquia visual, legibilidade, clareza da mensagem, força do CTA, coerência com o público-alvo. Pontos fortes e o que melhorar com prioridade.' },
      { label: 'Variações para A/B',        q: 'Sugira 4 variações de criativo para testar em [PRODUTO]. Varie: 1) produto vs pessoa, 2) emocional vs racional, 3) CTA direto vs suave, 4) cor de fundo. Descreva cada conceito visualmente.' },
      { label: 'Paleta da marca',           q: 'Sugira paleta de cores para marca no nicho [NICHO]. Inclua: cor principal, secundária, neutro e acento. Justifique a psicologia de cada cor e como aplicar em anúncios e LP.' },
      { label: 'Referências visuais',       q: 'Descreva referências visuais para campanha de [PRODUTO/SERVIÇO]. Mood, estilo, cores dominantes, tipo de imagem/pessoa, elementos gráficos. Nicho: [NICHO]. Público: [PÚBLICO].' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: '🗂️',
    prompts: [
      { label: 'Tarefas atrasadas',         q: 'Liste todas as tarefas atrasadas agora. Agrupe por responsável, mostre prioridade e cliente vinculado. Qual ação imediata para as mais críticas?' },
      { label: 'Clientes em risco',         q: 'Quais clientes estão em risco de churn agora? Considere: inatividade, tarefas atrasadas, performance Google Ads ruim, tempo sem contato. Ordene por nível de risco.' },
      { label: 'Análise do cliente',        q: 'Análise completa de [CLIENTE]: status do contrato, tarefas em aberto, performance Google Ads últimos 30 dias, alertas. Termine com os próximos 3 passos recomendados.' },
      { label: 'Pauta de reunião',          q: 'Gere pauta de reunião de acompanhamento para [CLIENTE]. Inclua: entregas recentes, métricas do período vs meta, pontos de alinhamento e próximas ações com responsável.' },
      { label: 'Criar tarefa',              q: 'Crie uma tarefa para [RESPONSÁVEL]: [DESCRIÇÃO]. Cliente: [CLIENTE]. Prazo: [DATA]. Prioridade: [alta/média/baixa].' },
      { label: 'Saúde financeira',          q: 'Saúde financeira da carteira: MRR atual, clientes por faixa de mensalidade, clientes em risco de cancelamento, projeção de MRR do próximo mês.' },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    icon: '📰',
    prompts: [
      { label: '🗞️ Últimas do mercado',       q: 'Busque as últimas notícias dos principais sites de marketing e negócios (Mundo do Marketing, Meio & Mensagem, AdNews, etc.). Selecione as 5 mais relevantes para a audiência da TráfegOn e sugira um post para cada.' },
      { label: '📱 Tendências Meta Ads',       q: 'Busque notícias recentes sobre Meta Ads, Facebook Ads e Instagram Ads. Identifique a mais relevante e crie um post completo: headline, legenda e hashtags para o perfil da TráfegOn.' },
      { label: '🔍 Novidades Google Ads',      q: 'Busque novidades e atualizações recentes do Google Ads e Google Marketing Platform. Selecione o que mais impacta gestores de tráfego e sugira um conteúdo educativo (carrossel ou single).' },
      { label: '🤖 IA no marketing',           q: 'Busque notícias sobre inteligência artificial aplicada ao marketing digital. Encontre as mais relevantes e sugira como transformar isso em conteúdo de autoridade para o perfil da TráfegOn.' },
      { label: '📊 Cases e resultados',        q: 'Busque cases de sucesso e benchmarks de campanhas digitais recentes. Selecione os mais inspiradores e sugira como adaptar para conteúdo que mostre autoridade da TráfegOn.' },
      { label: '🇧🇷 Mercado brasileiro',        q: 'Busque notícias sobre marketing digital, e-commerce e negócios no Brasil. O que está movimentando o mercado local? Sugira conteúdos adaptados para a realidade dos clientes da TráfegOn.' },
      { label: '📝 Gerar pauta semanal',       q: 'Busque as notícias mais relevantes dos últimos dias em marketing, Google Ads, Meta Ads e negócios. Com base nisso, monte uma pauta de conteúdo para a semana: 5 posts com tema, formato, ângulo e chamada.' },
    ],
  },
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
  const [memories,       setMemories]       = useState([])
  const [attached,       setAttached]       = useState(null)
  const [urlFetching,    setUrlFetching]    = useState(false)
  const [promptsOpen,    setPromptsOpen]    = useState(false)
  const [promptCat,      setPromptCat]      = useState(PROMPT_CATEGORIES[0].id)

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
      const r = await fetch('/api/memories?limit=60')
      if (r.ok) {
        const rows = await r.json()
        if (Array.isArray(rows) && rows.length) { setMemories(rows); return }
      }
    } catch {}
    const local = JSON.parse(localStorage.getItem('ton_memories') || '[]')
    setMemories(local)
  }

  async function extractAndSaveMemories(userText, assistantText) {
    if (!userText || !assistantText) return
    try {
      const res = await fetch('/api/ton', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
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
        category: m.category || 'insight',
        content: m.content || '',
        client_name: m.client_name || null,
        tags: Array.isArray(m.tags) ? m.tags : [],
        session_id: sessionId,
      }))

      const saved = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItems),
      }).then(r => r.ok).catch(() => false)

      if (!saved) {
        const local = JSON.parse(localStorage.getItem('ton_memories') || '[]')
        const withId = newItems.map(m => ({ ...m, id: crypto.randomUUID(), created_at: new Date().toISOString() }))
        localStorage.setItem('ton_memories', JSON.stringify([...withId, ...local].slice(0, 200)))
        setMemories(prev => [...withId, ...prev].slice(0, 200))
      } else {
        loadMemories()
      }
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
        const params = { action: 'performance', customerId: conta.id, dias }
        if (inp.data_inicio && inp.data_fim) { params.dataInicio = inp.data_inicio; params.dataFim = inp.data_fim }
        const result = await callGadsApi(params)
        if (result.erro) return result
        if (!Array.isArray(result) || !result.length) return { aviso: 'Sem dados de campanha no período.', cliente: conta.nome }
        const { total, campanhas } = agregarGadsCampanhas(result)
        const periodo = inp.data_inicio ? `${inp.data_inicio} → ${inp.data_fim}` : `${dias} dias`
        return { cliente: conta.nome, customer_id: conta.id, periodo, total, por_campanha: campanhas }
      }

      if (name === 'buscar_performance_carteira_google') {
        const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
        const dias = diasMap[inp.periodo || 'last_7d'] || 7
        const customerIds = Object.values(GADS_MAP).map(v => v.id)
        const params = { action: 'carteira', customerIds, dias }
        if (inp.data_inicio && inp.data_fim) { params.dataInicio = inp.data_inicio; params.dataFim = inp.data_fim }
        const result = await callGadsApi(params)
        if (result.erro) return result
        const idToNome = Object.fromEntries(Object.values(GADS_MAP).map(v => [v.id, v.nome]))
        const por_conta = {}
        for (const [cid, dados] of Object.entries(result)) {
          por_conta[idToNome[cid] || cid] = dados
        }
        const total_gasto = Object.values(por_conta).filter(v => !v.erro).reduce((s, v) => s + (v.gasto || 0), 0)
        const periodo = inp.data_inicio ? `${inp.data_inicio} → ${inp.data_fim}` : `${dias} dias`
        return { periodo, total_gasto: +total_gasto.toFixed(2), contas: Object.keys(por_conta).length, por_conta }
      }

      if (name === 'buscar_termos_pesquisa') {
        const q = (inp.cliente || '').toLowerCase()
        const gadsKey = Object.keys(GADS_MAP).find(k => q.includes(k) || k.includes(q))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const params = {
          action: 'termos_pesquisa',
          customerId: conta.id,
          dias: inp.dias || 30,
        }
        if (inp.campaign_id) params.campaignId = inp.campaign_id
        if (inp.data_inicio && inp.data_fim) { params.di = inp.data_inicio; params.df = inp.data_fim }
        const result = await callGadsApi(params)
        if (result.erro) return result
        if (!Array.isArray(result) || !result.length) return { aviso: 'Sem termos de pesquisa no período.', cliente: conta.nome }
        const total_custo = result.reduce((s, t) => s + (t.custo || 0), 0)
        const sem_conv = result.filter(t => t.conversoes === 0 && t.custo > 0)
        const com_conv = result.filter(t => t.conversoes > 0)
        return {
          cliente: conta.nome,
          periodo: inp.data_inicio ? `${inp.data_inicio} → ${inp.data_fim}` : `${inp.dias || 30} dias`,
          total_termos: result.length,
          total_custo: +total_custo.toFixed(2),
          com_conversao: com_conv.length,
          sem_conversao: sem_conv.length,
          termos: result.slice(0, 80),
          instrucao: 'Analise os termos com custo alto e zero conversão. Use negativar_termos para pausar os ruins (com confirmar=false primeiro para mostrar preview).',
        }
      }

      if (name === 'pausar_campanha' || name === 'ativar_campanha') {
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: name === 'pausar_campanha' ? '⏸ PAUSAR CAMPANHA' : '▶ ATIVAR CAMPANHA',
            cliente: inp.cliente,
            campanha: inp.campaign_nome || inp.campaign_id,
            campaign_id: inp.campaign_id,
            instrucao: 'Confirme digitando "confirmar" ou "sim" para prosseguir.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({ action: name, customerId: conta.id, campaignId: inp.campaign_id })
        if (result.erro) return result
        const statusNovo = name === 'pausar_campanha' ? 'PAUSADA' : 'ATIVA'
        return { sucesso: true, mensagem: `Campanha "${inp.campaign_nome || inp.campaign_id}" agora está **${statusNovo}**.` }
      }

      if (name === 'ajustar_orcamento') {
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: '💰 AJUSTAR ORÇAMENTO',
            cliente: inp.cliente,
            campanha: inp.campaign_nome || inp.campaign_id,
            novo_orcamento: `R$ ${inp.orcamento_diario}/dia`,
            instrucao: 'Confirme digitando "confirmar" ou "sim" para aplicar.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({ action: 'ajustar_orcamento', customerId: conta.id, campaignId: inp.campaign_id, orcamento_diario: inp.orcamento_diario })
        if (result.erro) return result
        return { sucesso: true, mensagem: `Orçamento da campanha "${inp.campaign_nome || inp.campaign_id}" ajustado para **R$ ${inp.orcamento_diario}/dia**.` }
      }

      if (name === 'negativar_termos') {
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: '🚫 NEGATIVAR TERMOS',
            cliente: inp.cliente,
            campanha: inp.campaign_nome || inp.campaign_id,
            termos: inp.termos,
            tipo: inp.tipo || 'BROAD',
            instrucao: 'Confirme digitando "confirmar" ou "sim" para adicionar as negativações.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({ action: 'negativar_termos', customerId: conta.id, campaignId: inp.campaign_id, termos: inp.termos, tipo: inp.tipo || 'BROAD' })
        if (result.erro) return result
        return { sucesso: true, mensagem: `${inp.termos.length} termo(s) negativado(s) na campanha "${inp.campaign_nome || inp.campaign_id}": ${inp.termos.join(', ')}` }
      }

      if (name === 'adicionar_keywords') {
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: '✅ ADICIONAR KEYWORDS',
            cliente: inp.cliente,
            grupo: inp.ad_group_nome || inp.ad_group_id,
            keywords: inp.keywords,
            tipo: inp.tipo || 'PHRASE',
            instrucao: 'Confirme digitando "confirmar" ou "sim" para adicionar.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({ action: 'adicionar_keywords', customerId: conta.id, adGroupId: inp.ad_group_id, keywords: inp.keywords, tipo: inp.tipo || 'PHRASE' })
        if (result.erro) return result
        return { sucesso: true, mensagem: `${inp.keywords.length} keyword(s) adicionada(s) no grupo "${inp.ad_group_nome || inp.ad_group_id}": ${inp.keywords.join(', ')}` }
      }

      if (name === 'listar_grupos_anuncios') {
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({ action: 'listar_grupos', customerId: conta.id, campaignId: inp.campaign_id })
        if (result.erro) return result
        return { grupos: result, total: result.length }
      }

      if (name === 'criar_anuncio_rsa') {
        const hs = Array.isArray(inp.headlines) ? inp.headlines.filter(Boolean) : []
        const ds = Array.isArray(inp.descriptions) ? inp.descriptions.filter(Boolean) : []
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: '🆕 CRIAR ANÚNCIO RSA',
            cliente: inp.cliente,
            grupo: inp.ad_group_id,
            titulos: hs,
            descricoes: ds,
            url_destino: inp.final_url,
            status_inicio: 'PAUSADO — você ativa após revisar',
            instrucao: 'Confirme com "confirmar" para criar o anúncio.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const result = await callGadsApi({
          action: 'criar_anuncio_rsa', customerId: conta.id,
          adGroupId: inp.ad_group_id, headlines: hs, descriptions: ds,
          finalUrl: inp.final_url, path1: inp.path1, path2: inp.path2,
        })
        if (result.erro) return { erro: result.erro, instrucao_ton: 'Mostre este erro técnico EXATAMENTE como está (verbatim), sem reinterpretar nem resumir.' }
        return { sucesso: true, mensagem: `Anúncio RSA criado (PAUSADO) com ${result.titulos} títulos e ${result.descricoes} descrições. Revise e ative no Google Ads.` }
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

      if (name === 'buscar_noticias') {
        const params = {
          action: inp.acao || (inp.query ? 'busca' : 'feeds'),
          q: inp.query || null,
          max: inp.max || 20,
          por_feed: 4,
        }
        const result = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        }).then(r => r.json()).catch(e => ({ erro: e.message }))

        if (result.erro) return result
        if (!result.artigos?.length) return { aviso: 'Nenhuma notícia encontrada. Tente novamente em instantes.', total: 0 }

        return {
          ...result,
          instrucao: 'Analise estas notícias e selecione as 3-5 mais relevantes para virar conteúdo no perfil da TráfegOn. Para cada uma: título do post sugerido, formato ideal (carrossel/reels/single/story), ângulo de abordagem e por que é relevante para a audiência (gestores de tráfego, empreendedores, clientes de agência).',
        }
      }

      if (name === 'criar_campanha') {
        if (!inp.confirmar) {
          return {
            preview: true,
            acao: '🆕 CRIAR CAMPANHA',
            cliente: inp.cliente,
            nome: inp.nome,
            orcamento_diario: `R$ ${inp.orcamento_diario}/dia`,
            tipo: inp.tipo || 'SEARCH',
            estrategia_lance: inp.estrategia_lance || 'MAXIMIZE_CONVERSIONS',
            cpa_alvo: inp.cpa_alvo ? `R$ ${inp.cpa_alvo}` : null,
            rede_display: inp.rede_display ? 'Sim (cuidado: pode gerar cliques irrelevantes)' : 'Não (recomendado)',
            status_inicio: 'PAUSADA — você ativa manualmente após configurar anúncios',
            grupo_inicial: inp.criar_grupo ? (inp.grupo_nome || '(sem nome definido)') : 'Nenhum — adicionar depois',
            instrucao: 'A campanha será criada PAUSADA por segurança. Confirme com "confirmar" para criar.',
          }
        }
        const gadsKey = Object.keys(GADS_MAP).find(k => (inp.cliente || '').toLowerCase().includes(k) || k.includes((inp.cliente || '').toLowerCase()))
        if (!gadsKey) return { erro: `Cliente não encontrado: ${inp.cliente}` }
        const conta = GADS_MAP[gadsKey]
        const params = {
          action: 'criar_campanha',
          customerId: conta.id,
          nome: inp.nome,
          orcamento_diario: inp.orcamento_diario,
          tipo: inp.tipo || 'SEARCH',
          estrategia_lance: inp.estrategia_lance || 'MAXIMIZE_CONVERSIONS',
          rede_busca: inp.rede_busca !== false,
          rede_display: inp.rede_display === true,
        }
        if (inp.cpa_alvo) params.cpa_alvo = inp.cpa_alvo
        if (inp.criar_grupo && inp.grupo_nome) {
          params.criar_grupo = true
          params.grupo_nome = inp.grupo_nome
          if (inp.grupo_cpc_padrao) params.grupo_cpc_padrao = inp.grupo_cpc_padrao
        }
        const result = await callGadsApi(params)
        if (result.erro) return { erro: result.erro, instrucao_ton: 'Mostre este erro técnico EXATAMENTE como está (verbatim), sem reinterpretar nem resumir — é necessário para corrigir a integração.' }
        return {
          sucesso: true,
          campanha_id: result.campanha_id,
          mensagem: `Campanha **"${inp.nome}"** criada com sucesso (ID: \`${result.campanha_id}\`). Status: **PAUSADA**.\n\n${result.proximo_passo}`,
        }
      }

      if (name === 'navegar_para') {
        const allowed = ['/erp', '/workspaces', '/equipe', '/playbooks', '/entregas', '/arena', '/educacao', '/parceiros', '/relatorios', '/pipeline', '/contatos', '/calendario', '/conhecimento']
        const path = (inp.pagina || '').startsWith('/') ? inp.pagina : `/${inp.pagina}`
        if (!allowed.some(p => path.startsWith(p))) {
          return { erro: `Página não disponível. Disponíveis: ${allowed.join(', ')}` }
        }
        setTimeout(() => window.dispatchEvent(new CustomEvent('ton:navigate', { detail: { path } })), 600)
        return { sucesso: true, mensagem: `Abrindo ${path} em instantes…` }
      }

      if (name === 'ghl_leads' || name === 'ghl_pipeline' || name === 'ghl_conversas') {
        const actionMap = { ghl_leads: 'leads', ghl_pipeline: 'pipeline', ghl_conversas: 'conversas' }
        try {
          const r = await fetch('/api/ghl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: actionMap[name], cliente: inp.cliente }),
          })
          const data = await r.json().catch(() => ({}))
          if (!r.ok) return { erro: data.erro || `GHL retornou ${r.status}` }
          return data
        } catch (e) {
          return { erro: `GHL indisponível: ${e.message}` }
        }
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
        const res = await fetch('/api/ton', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'content-type': 'application/json' },
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
          extractAndSaveMemories(text, finalText)
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
              background: 'linear-gradient(160deg, #0f1a0e 0%, #0b130a 60%, #0d1a0c 100%)',
              border: isMobile ? 'none' : '1px solid rgba(110,218,44,0.15)',
              borderRadius: 'inherit',
              boxShadow: '0 0 0 1px rgba(110,218,44,0.06), 0 32px 80px rgba(0,0,0,0.85)',
            }} />

            {/* ── Header ────────────────────────────────────── */}
            <div className="relative flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(110,218,44,0.12)', background: 'rgba(0,0,0,0.18)' }}>
              {/* Avatar com glow */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 12px rgba(110,218,44,0.45)' }}>
                  <TonSVG size={32} />
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: '#6eda2c', boxShadow: '0 0 5px #6eda2c', border: '1.5px solid #0f1a0e' }}
                />
              </div>

              {/* Nome e status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black tracking-tight" style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.03em' }}>ton</span>
                  {msgCount > 0 && (
                    <span className="font-bold px-1.5 py-0.5 rounded-full"
                      style={{ fontSize: 9, background: 'rgba(110,218,44,0.12)', color: 'rgba(110,218,44,0.7)', border: '1px solid rgba(110,218,44,0.2)' }}>
                      {msgCount} msg{msgCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="truncate" style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>
                  {toolActive
                    ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'rgba(110,218,44,0.65)' }}>⚡ {toolActive}…</motion.span>
                    : streaming
                      ? <span style={{ color: 'rgba(110,218,44,0.5)' }}>pensando…</span>
                      : 'inteligência TráfegOn · sempre aqui'}
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setHistory([]) }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent', border: '1px solid transparent', fontSize: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.8)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                    title="Limpar conversa">
                    <Trash2 size={11} />
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent', border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
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
                  className="flex flex-col items-center justify-center h-full text-center px-4 pb-4">
                  <motion.div
                    animate={{ filter: ['drop-shadow(0 0 14px rgba(110,218,44,0.5))', 'drop-shadow(0 0 28px rgba(110,218,44,0.8))', 'drop-shadow(0 0 14px rgba(110,218,44,0.5))'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ marginBottom: 16 }}>
                    <TonSVG size={88} />
                  </motion.div>
                  <p className="font-black" style={{ fontSize: 22, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.04em', marginBottom: 6 }}>ton</p>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.52)', maxWidth: 268, marginBottom: 20 }}>
                    Conheço cada cliente, cada campanha e cada número desta agência. Pergunte o que quiser.
                  </p>
                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2 w-full" style={{ maxWidth: 340 }}>
                    {QUICK.map(q => (
                      <motion.button
                        key={q.q}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => send(q.q)}
                        className="flex items-center gap-2.5 text-left transition-all"
                        style={{
                          padding: '10px 14px',
                          borderRadius: 14,
                          background: 'rgba(110,218,44,0.06)',
                          border: '1px solid rgba(110,218,44,0.18)',
                          color: 'rgba(255,255,255,0.75)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(110,218,44,0.4)'; e.currentTarget.style.background = 'rgba(110,218,44,0.11)'; e.currentTarget.style.color = 'rgba(255,255,255,0.92)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(110,218,44,0.18)'; e.currentTarget.style.background = 'rgba(110,218,44,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{q.icon}</span>
                        <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3 }}>{q.label}</span>
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
                    <div className="w-7 h-7 rounded-xl overflow-hidden flex-shrink-0 mt-0.5"
                      style={{ boxShadow: '0 0 10px rgba(110,218,44,0.35)' }}>
                      <TonSVG size={28} />
                    </div>
                  )}

                  <div className={msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[90%]'}>
                    {/* Bubble */}
                    <div className="relative group px-3.5 py-2.5"
                      style={msg.role === 'user'
                        ? {
                            background: 'rgba(110,218,44,0.13)',
                            border: '1px solid rgba(110,218,44,0.28)',
                            borderRadius: 18,
                            borderBottomRightRadius: 4,
                            color: 'rgba(255,255,255,0.92)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 18,
                            borderBottomLeftRadius: 4,
                          }
                      }>

                      {/* Tool loading */}
                      {msg.toolActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 mb-2.5 px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(110,218,44,0.08)', border: '1px solid rgba(110,218,44,0.2)' }}>
                          <div className="flex gap-1">
                            {[0, 1, 2].map(j => (
                              <motion.span key={j}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1, 0.7] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: j * 0.18 }}
                                style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: '#6eda2c' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 10, color: '#6eda2c', fontFamily: 'monospace', fontWeight: 600 }}>⚡ {msg.toolActive}…</span>
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
                              <p style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0, color: 'rgba(255,255,255,0.92)' }}>{msg.content}</p>
                            </>
                          : <MdText text={msg.content} />
                      }

                      {msg.role === 'assistant' && msg.content && <CopyButton text={msg.content} />}
                    </div>

                    {/* Tool tags */}
                    {msg.toolsUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5 px-0.5">
                        {msg.toolsUsed.map(t => (
                          <span key={t} className="flex items-center gap-1"
                            style={{
                              fontSize: 9.5,
                              padding: '2px 7px',
                              borderRadius: 20,
                              background: 'rgba(110,218,44,0.08)',
                              color: 'rgba(110,218,44,0.6)',
                              fontFamily: 'monospace',
                              border: '1px solid rgba(110,218,44,0.15)',
                            }}>
                            ⚡ {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Horário */}
                    <p style={{
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.22)',
                      marginTop: 4,
                      paddingLeft: msg.role === 'user' ? 0 : 2,
                      paddingRight: msg.role === 'user' ? 2 : 0,
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ─────────────────────────────────────── */}
            <div className="relative flex-shrink-0 px-3 pb-3 pt-2.5" style={{ borderTop: '1px solid rgba(110,218,44,0.1)' }}>
              {/* Preview de anexo */}
              {attached && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(110,218,44,0.07)', border: '1px solid rgba(110,218,44,0.22)' }}>
                  {attached.type === 'image'
                    ? <img src={attached.preview} alt="preview" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 6 }} />
                    : <span style={{ fontSize: 16 }}>📄</span>
                  }
                  <span style={{ fontSize: 11, color: 'rgba(110,218,44,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {attached.name}
                  </span>
                  <button onClick={() => setAttached(null)}
                    style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, lineHeight: 1 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* ── Painel de prompts por categoria ───────── */}
              <AnimatePresence>
                {promptsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mb-2.5 rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(110,218,44,0.2)', background: 'rgba(8,16,7,0.98)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                    {/* Tabs de categoria */}
                    <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid rgba(110,218,44,0.12)', scrollbarWidth: 'none', background: 'rgba(0,0,0,0.2)' }}>
                      {PROMPT_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setPromptCat(cat.id)}
                          className="flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0"
                          style={{
                            padding: '9px 14px',
                            fontSize: 11,
                            fontWeight: 700,
                            color: promptCat === cat.id ? '#6eda2c' : 'rgba(255,255,255,0.42)',
                            borderBottom: promptCat === cat.id ? '2px solid #6eda2c' : '2px solid transparent',
                            background: promptCat === cat.id ? 'rgba(110,218,44,0.07)' : 'transparent',
                          }}>
                          <span style={{ fontSize: 12 }}>{cat.icon}</span> {cat.label}
                        </button>
                      ))}
                    </div>
                    {/* Prompts da categoria ativa */}
                    <div className="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(110,218,44,0.15) transparent' }}>
                      {PROMPT_CATEGORIES.find(c => c.id === promptCat)?.prompts.map((p, i) => (
                        <button key={i} onClick={() => { setInput(p.q); setPromptsOpen(false); setTimeout(() => inputRef.current?.focus(), 80) }}
                          className="flex items-center gap-2.5 text-left transition-all"
                          style={{
                            padding: '9px 12px',
                            borderRadius: 10,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(110,218,44,0.1)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(110,218,44,0.09)'; e.currentTarget.style.borderColor = 'rgba(110,218,44,0.28)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(110,218,44,0.1)' }}>
                          <ChevronRight size={10} style={{ color: 'rgba(110,218,44,0.7)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.4, fontWeight: 500 }}>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicador de leitura de URL */}
              {urlFetching && (
                <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.22)' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Globe size={12} style={{ color: '#60a5fa' }} />
                  </motion.div>
                  <span style={{ fontSize: 11, color: 'rgba(96,165,250,0.85)', fontWeight: 500 }}>lendo conteúdo da URL…</span>
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
                    placeholder="Pergunte algo…"
                    disabled={streaming}
                    style={{
                      width: '100%',
                      background: focused ? 'rgba(110,218,44,0.06)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${focused ? 'rgba(110,218,44,0.4)' : 'rgba(110,218,44,0.16)'}`,
                      borderRadius: 14,
                      padding: '10px 14px',
                      fontSize: 12.5,
                      color: 'rgba(255,255,255,0.92)',
                      outline: 'none',
                      resize: 'none',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.5,
                      maxHeight: 100,
                      overflow: 'auto',
                      boxShadow: focused ? '0 0 0 3px rgba(110,218,44,0.1)' : 'none',
                    }}
                  />
                  {input.length > 200 && (
                    <span style={{ position: 'absolute', bottom: 5, right: 10, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                      {input.length}
                    </span>
                  )}
                </div>

                {/* Botão de prompts */}
                <div className="relative flex-shrink-0 group/prompts">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setPromptsOpen(v => !v)}
                    disabled={streaming}
                    className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-25"
                    style={{
                      width: 36, height: 36,
                      background: promptsOpen ? 'rgba(110,218,44,0.18)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${promptsOpen ? 'rgba(110,218,44,0.35)' : 'rgba(110,218,44,0.18)'}`,
                      color: promptsOpen ? '#6eda2c' : 'rgba(255,255,255,0.45)',
                    }}>
                    <Sparkles size={12} />
                    <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.01em' }}>Prompts</span>
                  </motion.button>
                </div>

                {/* Botão de anexo */}
                <div className="relative flex-shrink-0 group/attach">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={streaming}
                    className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-25"
                    style={{
                      width: 36, height: 36,
                      background: attached ? 'rgba(110,218,44,0.18)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${attached ? 'rgba(110,218,44,0.35)' : 'rgba(110,218,44,0.18)'}`,
                      color: attached ? '#6eda2c' : 'rgba(255,255,255,0.45)',
                    }}>
                    <Paperclip size={12} />
                    <span style={{ fontSize: 7, fontWeight: 700 }}>Anexar</span>
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={streaming
                    ? () => { abortRef.current?.abort(); setStreaming(false); setToolActive(null) }
                    : () => send()}
                  disabled={!streaming && !input.trim() && !attached}
                  className="flex-shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-25"
                  style={{
                    width: 36, height: 36,
                    background: streaming
                      ? 'rgba(239,68,68,0.18)'
                      : (input.trim() || attached) ? '#6eda2c' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${streaming ? 'rgba(239,68,68,0.35)' : (input.trim() || attached) ? '#6eda2c' : 'rgba(110,218,44,0.18)'}`,
                    color: streaming ? '#ef4444' : (input.trim() || attached) ? '#0f1a0e' : 'rgba(255,255,255,0.45)',
                    boxShadow: (input.trim() || attached) && !streaming ? '0 0 16px rgba(110,218,44,0.4)' : 'none',
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
                <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 7 }}>
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
