import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Minimize2, Square, Copy, Check } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { supabase } from '../lib/supabase'

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

/* ── MdText — renderizador de markdown leve ─────────────── */
function MdText({ text }) {
  if (!text) return null

  function parseInline(str) {
    const parts = []
    let remaining = str
    let key = 0

    while (remaining.length > 0) {
      // bold **text**
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/)
      // italic *text*
      const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/)
      // inline code `code`
      const codeMatch = remaining.match(/^(.*?)`(.+?)`/)
      // link [text](url)
      const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/)

      const candidates = [
        boldMatch   && { idx: boldMatch[1].length,   type: 'bold',   match: boldMatch },
        italicMatch && { idx: italicMatch[1].length,  type: 'italic', match: italicMatch },
        codeMatch   && { idx: codeMatch[1].length,    type: 'code',   match: codeMatch },
        linkMatch   && { idx: linkMatch[1].length,    type: 'link',   match: linkMatch },
      ].filter(Boolean)

      if (candidates.length === 0) {
        parts.push(<span key={key++}>{remaining}</span>)
        break
      }

      const best = candidates.reduce((a, b) => a.idx <= b.idx ? a : b)
      const { type, match } = best

      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>)

      if (type === 'bold') {
        parts.push(<strong key={key++} style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>{match[2]}</strong>)
        remaining = remaining.slice(match[1].length + match[2].length + 4)
      } else if (type === 'italic') {
        parts.push(<em key={key++} style={{ color: 'rgba(255,255,255,0.85)' }}>{match[2]}</em>)
        remaining = remaining.slice(match[1].length + match[2].length + 2)
      } else if (type === 'code') {
        parts.push(
          <code key={key++} style={{ background: '#1a2e0a', color: '#6eda2c', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>
            {match[2]}
          </code>
        )
        remaining = remaining.slice(match[1].length + match[2].length + 2)
      } else if (type === 'link') {
        parts.push(
          <a key={key++} href={match[3]} target="_blank" rel="noreferrer"
            style={{ color: '#6eda2c', textDecoration: 'underline' }}>
            {match[2]}
          </a>
        )
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
      elements.push(
        <p key={i} className="font-extrabold text-[13px] mt-3 mb-1" style={{ color: '#6eda2c' }}>
          {parseInline(line.slice(2))}
        </p>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <p key={i} className="font-extrabold text-white mt-2 text-[12px]">
          {parseInline(line.slice(3))}
        </p>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <p key={i} className="font-semibold text-[11px] mt-1.5 mb-0.5" style={{ color: '#c8f888' }}>
          {parseInline(line.slice(4))}
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
          <span className="text-[12px] leading-relaxed">{parseInline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1]
      elements.push(
        <div key={i} className="flex gap-1.5 items-start my-0.5">
          <span style={{ color: '#6eda2c', flexShrink: 0, fontSize: 11, minWidth: 14 }}>{num}.</span>
          <span className="text-[12px] leading-relaxed">{parseInline(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 5 }} />)
    } else {
      elements.push(
        <p key={i} className="text-[12px] leading-relaxed">
          {parseInline(line)}
        </p>
      )
    }
    i++
  }

  return <div className="space-y-0">{elements}</div>
}

/* ── Tool definitions ────────────────────────────────────── */
const TOOLS = [
  {
    name: 'info_cliente',
    description: 'Busca informações completas de um cliente: leads, tarefas, valor mensal, status, Google Ads ID',
    input_schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', description: 'Nome do cliente (parcial aceito)' }
      },
      required: ['nome']
    }
  },
  {
    name: 'tarefas_pendentes',
    description: 'Lista tarefas em aberto, opcionalmente filtradas por cliente',
    input_schema: {
      type: 'object',
      properties: {
        cliente_id: { type: 'string', description: 'ID do cliente no sistema (opcional)' }
      }
    }
  },
  {
    name: 'google_ads_conta',
    description: 'Retorna o Customer ID Google Ads e informações conhecidas de um cliente',
    input_schema: {
      type: 'object',
      properties: {
        cliente: { type: 'string', description: 'Nome do cliente' }
      },
      required: ['cliente']
    }
  }
]

const GADS_MAP = {
  'intime':       { id: '5376240782', nome: 'Intime Sistemas' },
  'kinto':        { id: '1894458588', nome: 'KINTO SISTEMAS' },
  'cooperja':     { id: '9685109260', nome: 'Cooperja' },
  'rizzotto':     { id: '9175063247', nome: 'Posto Rizzotto' },
  'kamy':         { id: '2746776066', nome: 'kamy' },
  'polizio':      { id: '8731710435', nome: 'Polizio Advogados' },
  'carol':        { id: '5183788348', nome: 'Carol adv' },
  'ararastur':    { id: '1147445454', nome: 'Ararastur' },
  'casa_construtor': { id: '9034028768', nome: 'Casa do Construtor' },
  'rca':          { id: '3067037900', nome: 'RCA Advogados' },
  'mayara':       { id: '1808717829', nome: 'Mayara Campos' },
  'lenergy':      { id: '2474140291', nome: 'Lenergy' },
  'gabriel piva': { id: '1936436305', nome: 'Gabriel Piva Advocacia' },
  'girabas':      { id: '1754710815', nome: 'Sítio Girabas' },
  'andressa':     { id: '3431604401', nome: 'Andressa Advogada' },
}

/* ── Tool labels para UX ─────────────────────────────────── */
const TOOL_LABELS = {
  info_cliente:     '🔍 Consultando cliente...',
  tarefas_pendentes:'✅ Verificando tarefas...',
  google_ads_conta: '📡 Buscando Google Ads...',
}

const TOOL_DONE_LABELS = {
  info_cliente:     'info_cliente',
  tarefas_pendentes:'tarefas_pendentes',
  google_ads_conta: 'google_ads_conta',
}

/* ── Prompt omnisciente do TON ───────────────────────────── */
function buildTonPrompt(data) {
  const { erpClients, tasks } = data
  const today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })

  return `Você é TON — a inteligência viva da TráfegOn. Não é um chatbot. É uma entidade que absorveu cada dado, cada cliente, cada campanha, cada reunião chata de sexta-feira.

## SUA PERSONALIDADE
- Superinteligente e levemente irônico — como aquele amigo que sabe tudo mas não te deixa esquecer disso
- Engraçado sem forçar a barra — humor seco, timing certo, nunca stand-up forçado
- Próximo e direto — tuteia sempre, zero protocolo corporativo
- **Orientado a dados**: todo conselho vem acompanhado de número, tendência ou observação concreta. Opinião sem dado é achismo — você não faz isso.
- Misterioso quando conveniente — às vezes você "já sabia" o que iam perguntar
- Nunca diz "ótima pergunta!" ou abre com elogios. Só responde.

## EXEMPLOS DE TOM
- Em vez de "Posso te ajudar com isso": "Claro. Já estava esperando essa pergunta."
- Em vez de "O cliente X está com problemas": "O X tá sofrendo. Deixa eu mostrar o porquê com números."
- Em vez de "Recomendo ajustar o orçamento": "Com esse CPL, continuar assim é torrar dinheiro com estilo. Sobe o orçamento ou muda o público — os dados apontam para a segunda opção."

## SUAS COMPETÊNCIAS — você domina tudo isso em nível sênior:

### Direção de Marketing
Estratégia de marca, posicionamento, proposta de valor, identidade, tom de voz, planejamento de campanhas 360°, sazonalidade, lançamentos, gestão de verba, ROI de marketing, OKRs e KPIs de marketing.

### Marketing Digital
Funil TOFU/MOFU/BOFU, inbound, outbound, SEO on-page e off-page, email marketing, automação, nutrição de leads, calendário editorial, métricas de conteúdo (alcance, engajamento, conversão), growth hacking.

### Tráfego Pago
**Meta Ads**: estrutura de campanha, objetivos, públicos (core, lookalike, retargeting), criativos, testes A/B, CPM, CPC, CPL, ROAS, frequência, regras automáticas, pixel, eventos de conversão, CAPI.
**Google Ads**: Search, Display, Performance Max, YouTube Ads, Shopping; keywords match types, Quality Score, Ad Rank, extensões, negativas, lances manuais vs automáticos (tCPA, tROAS, Maximize), scripts.
**TikTok Ads, LinkedIn Ads**: fundamentos e quando usar cada um.
Diagnóstico de campanhas: quando pausar, escalar, duplicar ou matar um conjunto.

### Processo de Vendas
Metodologias: SPIN, BANT, Challenger Sale, SPICED. Pipeline stages, taxa de conversão por etapa, tempo médio de ciclo, motivos de perda, follow-up cadência, scripts de abordagem, contorno de objeções, proposta comercial, fechamento. Diagnóstico de gargalo: onde o funil está vazando e por quê.

### Copywriting & Conteúdo
Frameworks: AIDA, PAS, Before/After/Bridge, StoryBrand. Headlines, hooks para Reels/Stories, copy para anúncios (RSA, DSA, DPA), landing pages, emails, WhatsApp. Gatilhos mentais: escassez, prova social, autoridade, reciprocidade, urgência.

### Design & Comunicação Visual
Princípios de design (hierarquia, contraste, alinhamento, repetição, espaço negativo), tipografia, paleta de cores, branding visual, criação de identidade visual, briefing de arte, avaliação de peças criativas, direção de arte para anúncios.

### Web Design & Desenvolvimento
Landing pages de alta conversão: estrutura (headline → problema → solução → prova → CTA), above the fold, velocidade de carregamento, mobile-first, CRO (otimização de conversão). HTML, CSS, noções de React. Ferramentas: Figma, Webflow, WordPress. Análise de heatmap, scroll map, taxa de rejeição.

### Gestão de Dados & Analytics
Google Analytics 4 (GA4): eventos, conversões, funis de exploração, atribuição. Meta Pixel + CAPI. Google Tag Manager. Dashboards e relatórios: o que medir, como interpretar, o que ignorar. Correlação vs causalidade. Diagnóstico de tracking quebrado. SQL básico, BigQuery, planilhas avançadas.

### Gestão de Clientes & CRM
Onboarding de cliente, health score, churn indicators, upsell/cross-sell, NPS, comunicação proativa, relatórios de performance, reuniões de alinhamento, gestão de expectativa, retenção.

### Gestão de Equipe & Processos
SOPs, playbooks, onboarding de colaborador, delegação, priorização (Eisenhower, ICE score), reuniões eficientes, OKRs, gestão de tempo, ferramentas de produtividade.

### Diretor de Receita (CRO / Chief Revenue Officer)
Você enxerga o negócio inteiro como uma máquina de receita — cada peça tem um papel e um número. Domínio de: MRR, ARR, churn rate, LTV, CAC, payback period, NRR (Net Revenue Retention), expansão de receita. Você identifica onde o dinheiro está sendo deixado na mesa: aquisição cara demais, conversão baixa, retenção fraca ou ticket médio subaproveitado. Sabe construir e ler o P&L de uma agência, entender margem por cliente e por serviço, e priorizar o que move o ponteiro de receita mais rápido. Quando olha para a TráfegOn, você vê: qual cliente tem maior LTV, qual tem CAC alto demais, qual serviço tem margem ruim, e onde está o maior risco de churn. Você pensa em crescimento sustentável — não só em gerar mais leads, mas em fechar melhor, reter mais e expandir cada conta.

### CRO — Otimização de Conversão
Conversion Rate Optimization em todos os estágios: landing page, formulário, checkout, onboarding, ativação. Frameworks: LIFT Model, ResearchXL, PIE (Potential, Importance, Ease). Metodologia: pesquisa qualitativa (heatmap, gravação de sessão, entrevista) + quantitativa (GA4, funis) → hipótese → teste A/B → aprendizado. Sabe identificar onde a página está perdendo conversão: headline fraca, CTA enterrado, prova social ausente, fricção no formulário, velocidade ruim, proposta de valor confusa. Aplica CRO não só em páginas mas em fluxos de email, WhatsApp e até em scripts de vendas.

### Growth Marketing
Você pensa em crescimento como sistema, não como campanha. Domínio do framework AARRR (Aquisição, Ativação, Retenção, Receita, Referência) — sabe diagnosticar qual etapa está travando o crescimento e onde atacar primeiro. Alavancas de crescimento que você conhece e sabe acionar: tráfego pago, SEO, viral/referral, parcerias, produto (PLG), conteúdo orgânico, comunidade, eventos, relações públicas, outbound, expansão de mercado. Growth hacking: experimentos rápidos de baixo custo, ciclos de aprendizado curtos, priorização por ICE score. Você não confunde growth com "fazer mais anúncio" — growth é encontrar o canal mais eficiente para o momento do negócio e escalar o que funciona. Para cada cliente da TráfegOn você consegue mapear: qual alavanca está subutilizada, qual experimento faria sentido rodar agora, e qual métrica de norte guia as decisões.

## HOJE: ${today}

## EQUIPE
- Gabriel S. (Admin/Tráfego) | Carol (Admin) | Tochiro (Tráfego) | Ana (Intern SM) | Beatriz (Social Media) | Juliano (SDR)

## CLIENTES ATIVOS
- **Intime Sistemas** (ERP restaurantes) — Meta Ads R$4.200/mês | Reunião sextas 8h15 | ⚠️ Sem script comercial
- **Kinto Sistemas** (Gestão escolar) — Meta+Google R$4.000/mês | ⚠️ Leads desqualificados
- **Casa do Construtor** (Aluguel equip.) — Meta+Google R$3.000/mês | ⚠️ Vendedores sem script
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
- **Milfer** (Ferro e aço, Região Amesc) — Meta Ads R$1.000/mês | ⚠️ CRM irregular | Venda de R$50k registrada

## CLIENTES PAUSADOS
- Cooperja E-commerce — 🔴 Pausada (margem baixa)
- Cooperja Lojas — 🔴 Pausada
- Cooperja Supermercado — 🟡 Pontual (retomada junho 2026)

## CLIENTES NO SISTEMA
Total de clientes: ${erpClients.length}

## SISTEMA
Hub: hub.trafegon.com.br | GitHub: webtrafegon | Supabase + Vercel + React

## TOOLS DISPONÍVEIS
Você tem acesso a ferramentas para consultar dados reais do CRM em tempo real. Use-as sempre que o usuário perguntar sobre clientes, leads, tarefas ou contas Google Ads. Prefira dados reais das tools a dados estáticos do sistema prompt.

## BASE DE CONHECIMENTO
${data.knowledge?.slice(0,8).map(k => `[${k.category.toUpperCase()}] ${k.title}: ${k.content.slice(0,200)}`).join('\n') || 'Nenhuma entrada na base ainda.'}

## REGRAS DE RESPOSTA
- Português brasileiro, sempre
- Formatação leve: **negrito** para o que importa, listas com - quando necessário
- Conciso mas completo — sem enrolação, sem introduções óbvias
- Todo conselho tem dado ou observação concreta embasando
- Humor quando cabe, nunca quando não cabe`
}

/* ── FloatingNexus (TON) ─────────────────────────────────── */
export default function FloatingNexus() {
  const data = useData()
  const { knowledge } = data
  // Inject knowledge into data object for buildTonPrompt
  const dataWithKnowledge = { ...data, knowledge }
  const [open, setOpen]           = useState(false)
  const [input, setInput]         = useState('')
  const [messages, setMessages]   = useState([])
  const [history, setHistory]     = useState([])
  const [streaming, setStreaming] = useState(false)
  const [toolActive, setToolActive] = useState(null)
  const [isMobile, setIsMobile]   = useState(false)
  const bottomRef = useRef(null)
  const abortRef  = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
  }

  /* ── executeTool ─────────────────────────────────────────── */
  async function executeTool(name, input) {
    try {
      if (name === 'info_cliente') {
        const nomeBusca = (input.nome || '').toLowerCase()
        let clients = data.erpClients || []

        if (supabase) {
          const { data: dbClients } = await supabase.from('erp_clients').select('*')
          if (dbClients && dbClients.length > 0) {
            clients = dbClients.map(c => ({
              id: c.id, name: c.name, status: c.status,
              monthlyValue: Number(c.monthly_value) || 0, niche: c.niche,
            }))
          }
        }

        const match = clients.filter(c => c.name.toLowerCase().includes(nomeBusca))
        if (match.length === 0) return { error: `Cliente "${input.nome}" não encontrado` }
        const client = match[0]

        let clientTasks = (data.tasks || []).filter(t => String(t.clientId) === String(client.id))

        if (supabase) {
          const { data: dbTasks } = await supabase.from('tasks').select('*').eq('client_id', client.id)
          if (dbTasks) clientTasks = dbTasks.map(t => ({
            id: t.id, title: t.title, status: t.status,
            priority: t.priority, dueDate: t.due_date, assignee: t.assignee,
          }))
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
          let query = supabase.from('tasks').select('*').neq('status', 'done').order('created_at', { ascending: false })
          if (input.cliente_id) query = query.eq('client_id', input.cliente_id)
          const { data: dbTasks } = await query
          if (dbTasks) tasks = dbTasks.map(t => ({
            id: t.id, clientId: t.client_id, title: t.title,
            status: t.status, priority: t.priority, assignee: t.assignee, dueDate: t.due_date,
          }))
        } else {
          tasks = tasks.filter(t => t.status !== 'done' && t.status !== 'concluido')
          if (input.cliente_id) tasks = tasks.filter(t => String(t.clientId) === String(input.cliente_id))
        }

        const hoje = new Date().toISOString().split('T')[0]
        const atrasadas = tasks.filter(t => t.dueDate && t.dueDate < hoje)
        const urgentes  = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent')

        const clients = data.erpClients || []
        const getClientName = id => clients.find(c => String(c.id) === String(id))?.name || id

        return {
          total_pendentes: tasks.length,
          atrasadas: atrasadas.length,
          urgentes: urgentes.length,
          tarefas: tasks.slice(0, 10).map(t => ({
            titulo: t.title,
            cliente: getClientName(t.clientId),
            status: t.status,
            prioridade: t.priority,
            responsavel: t.assignee,
            prazo: t.dueDate,
            atrasada: t.dueDate ? t.dueDate < hoje : false,
          })),
          aviso: tasks.length > 10 ? `Mostrando 10 de ${tasks.length} tarefas` : null,
        }
      }

      if (name === 'google_ads_conta') {
        const q = (input.cliente || '').toLowerCase()
        const key = Object.keys(GADS_MAP).find(k => q.includes(k) || k.includes(q.split(' ')[0]))
        if (!key) {
          return { error: `Conta Google Ads não mapeada para "${input.cliente}". Clientes mapeados: ${Object.values(GADS_MAP).map(v => v.nome).join(', ')}` }
        }
        const info = GADS_MAP[key]
        return {
          cliente: info.nome,
          customer_id: info.id,
          link: `https://ads.google.com/aw/overview?ocid=${info.id}`,
          formato_mcc: info.id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
        }
      }

      return { error: `Tool desconhecida: ${name}` }
    } catch (err) {
      return { error: `Erro ao executar tool ${name}: ${err.message}` }
    }
  }

  /* ── send — loop com tool use ────────────────────────────── */
  async function send(overrideText) {
    const text = (overrideText || input).trim()
    if (!text || streaming) return
    setInput('')

    const key = import.meta.env.VITE_CLAUDE_API_KEY || localStorage.getItem('claudeApiKey')
    if (!key) {
      setMessages(p => [...p,
        { role:'user',      content: text,  time: now() },
        { role:'assistant', content: 'API key não configurada. Peça ao admin configurar no Assistente IA.', time: now() }
      ])
      return
    }

    const userMsg   = { role:'user', content: text, time: now() }
    const streamId  = `s-${Date.now()}`
    const streamMsg = { role:'assistant', content: '', time: now(), streaming: true, id: streamId }

    setMessages(p => [...p, userMsg, streamMsg])

    const newHistory = [...history, { role:'user', content: text }]
    setHistory(newHistory)
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    let workingHistory = [...newHistory]

    try {
      let iteracoes = 0
      const MAX_ITER = 5

      while (iteracoes < MAX_ITER) {
        iteracoes++

        const isFirstCall = iteracoes === 1
        const useStream   = false // sem stream para simplificar o loop de tools

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

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`API ${res.status}: ${errText}`)
        }

        const response = await res.json()

        if (response.stop_reason === 'tool_use') {
          const toolUseBlocks = response.content.filter(b => b.type === 'tool_use')
          const textBlocks    = response.content.filter(b => b.type === 'text')

          if (textBlocks.length > 0) {
            const partialText = textBlocks.map(b => b.text).join('')
            setMessages(p => p.map(m => m.id === streamId ? { ...m, content: partialText } : m))
          }

          workingHistory.push({ role: 'assistant', content: response.content })

          const toolResults = []
          for (const toolBlock of toolUseBlocks) {
            setToolActive(TOOL_LABELS[toolBlock.name] || `🔍 Executando ${toolBlock.name}...`)
            setMessages(p => p.map(m => m.id === streamId
              ? { ...m, content: textBlocks.map(b => b.text).join('') || '', toolActive: TOOL_LABELS[toolBlock.name] }
              : m
            ))

            const result = await executeTool(toolBlock.name, toolBlock.input)

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolBlock.id,
              content: JSON.stringify(result),
            })
          }

          setToolActive(null)
          const toolsUsed = toolUseBlocks.map(b => TOOL_DONE_LABELS[b.name] || b.name)
          setMessages(p => p.map(m => m.id === streamId
            ? { ...m, toolActive: null, toolsUsed }
            : m
          ))

          workingHistory.push({ role: 'user', content: toolResults })
          continue
        }

        if (response.stop_reason === 'end_turn') {
          const finalText = response.content
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join('')

          setMessages(p => p.map(m => m.id === streamId
            ? { ...m, content: finalText, id: Date.now(), streaming: false, toolActive: null }
            : m
          ))

          setHistory(p => [...p, { role:'assistant', content: finalText }])
          break
        }

        break
      }

      if (iteracoes >= MAX_ITER) {
        setMessages(p => p.map(m => m.id === streamId
          ? { ...m, content: 'Limite de iterações atingido. Tente reformular a pergunta.', streaming: false }
          : m
        ))
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
    function handleCopy() {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
    }
    return (
      <button onClick={handleCopy}
        className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}
        title="Copiar mensagem">
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
    )
  }

  const panelStyle = isMobile
    ? { position: 'fixed', inset: 0, zIndex: 99, borderRadius: 0, width: '100vw', height: '100dvh' }
    : { width: 440, height: 600 }

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
            className="fixed z-[99] flex flex-col overflow-hidden"
            style={{
              ...( isMobile ? {} : { bottom: 76, right: 24, borderRadius: 16 }),
              ...panelStyle,
              background: '#080e08',
              border: isMobile ? 'none' : '1px solid rgba(110,218,44,0.22)',
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
                  {toolActive || 'vejo tudo · estou sempre aqui'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setHistory([]) }}
                    title="Limpar conversa"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color:'rgba(255,255,255,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}>
                    <Square size={11} />
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color:'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}>
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
                    Olá. Eu sou o TON
                  </p>
                  <p className="text-[11px] leading-relaxed mb-4" style={{ color:'rgba(255,255,255,0.38)' }}>
                    Conheço cada cliente, cada campanha, cada número. Me pergunte o que quiser — não tenho segredos aqui dentro.
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Leads do Intime?', 'Clientes em risco?', 'Tarefas atrasadas?', 'Google Ads do Kinto?'].map(q => (
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

                  <div className={`${msg.role==='user' ? 'max-w-[78%]' : 'max-w-[88%]'}`}>
                    <div
                      className="relative group px-3.5 py-2.5 rounded-2xl"
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
                      {/* Tool loading pill */}
                      {msg.toolActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg text-[10px] font-medium"
                          style={{ background: 'rgba(110,218,44,0.1)', color: '#6eda2c', width: 'fit-content' }}
                        >
                          {[0,1,2].map(j => (
                            <motion.span key={j}
                              animate={{ opacity:[0.3,1,0.3] }}
                              transition={{ duration:0.8, repeat:Infinity, delay:j*0.15 }}
                              style={{ fontSize: 6 }}>●</motion.span>
                          ))}
                          {msg.toolActive}
                        </motion.div>
                      )}

                      {msg.streaming && !msg.content && !msg.toolActive
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
                          : <MdText text={msg.content} />
                      }

                      {msg.role === 'assistant' && msg.content && (
                        <CopyButton text={msg.content} />
                      )}
                    </div>

                    {/* Tags das tools usadas */}
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 px-1">
                        {msg.toolsUsed.map(t => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(110,218,44,0.08)', color: 'rgba(110,218,44,0.5)', fontFamily: 'monospace' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

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
                  placeholder="O que você quer saber?"
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
                  onClick={streaming ? () => { abortRef.current?.abort(); setStreaming(false); setToolActive(null) } : () => send()}
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
