import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, Bot, User, Copy, CheckCircle, Zap,
  Target, TrendingUp, Settings2, Users2, BarChart2,
  FileText, Megaphone, Search, AlertTriangle,
  ListChecks, DollarSign, RefreshCw, ChevronDown,
  Key, Eye, EyeOff, X, Calendar, Activity, Square,
  Film, Image as ImageIcon, PieChart, MousePointer,
  Palette, Database, Briefcase
} from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { supabase, supabaseReady } from '../lib/supabase'

/* ── Time de IA ─────────────────────────────────────────── */
const ROLES = [
  {
    id: 'gestor-trafego',
    label: 'Tráfego',
    fullLabel: 'Gestor de Tráfego',
    color: '#6eda2c',
    icon: Target,
    desc: 'Meta Ads · Google Ads · ROAS · Otimização',
  },
  {
    id: 'social-media',
    label: 'Social',
    fullLabel: 'Social Media',
    color: '#be29ec',
    icon: Megaphone,
    desc: 'Calendário · Captions · Hashtags · Engajamento',
  },
  {
    id: 'videomaker',
    label: 'Video',
    fullLabel: 'Videomaker',
    color: '#ef4444',
    icon: Film,
    desc: 'Roteiros · Reels · Hooks · Scripts',
  },
  {
    id: 'designer',
    label: 'Design',
    fullLabel: 'Designer',
    color: '#f59e0b',
    icon: Palette,
    desc: 'Criativos · Briefings · Identidade visual',
  },
  {
    id: 'sdr',
    label: 'SDR',
    fullLabel: 'SDR / Prospecção',
    color: '#22d3ee',
    icon: MousePointer,
    desc: 'Prospecção · Primeiro contato · Qualificação',
  },
  {
    id: 'crm',
    label: 'CRM',
    fullLabel: 'Analista de CRM',
    color: '#60a5fa',
    icon: PieChart,
    desc: 'Pipeline · Funis · Automação · Nurturing',
  },
  {
    id: 'dados',
    label: 'Dados',
    fullLabel: 'Gestor de Dados',
    color: '#ea8a29',
    icon: Database,
    desc: 'Métricas · Dashboards · KPIs · Relatórios',
  },
  {
    id: 'coo',
    label: 'COO',
    fullLabel: 'COO / Diretoria',
    color: '#8b5cf6',
    icon: Settings2,
    desc: 'Processos · Equipe · Qualidade · Estratégia',
  },
  {
    id: 'comercial',
    label: 'Comercial',
    fullLabel: 'Dir. Comercial',
    color: '#34d399',
    icon: DollarSign,
    desc: 'Vendas · Propostas · Fechamento · Retenção',
  },
  {
    id: 'gestor-projetos',
    label: 'Projetos',
    fullLabel: 'Gestor de Projetos',
    color: '#0ea5e9',
    icon: Briefcase,
    desc: 'Portfólio · Sprint · Prioridades · Entregas',
  },
]

const LEVELS = [
  { id: 'estrategico', label: 'Estratégico', sub: '6–18 meses', color: '#ef4444' },
  { id: 'tatico',      label: 'Tático',      sub: '1–6 meses',  color: '#ea8a29' },
  { id: 'operacional', label: 'Operacional', sub: 'Dia a dia',  color: '#6eda2c' },
]

/* ── Ações rápidas por agente + nível ───────────────────── */
const ACTIONS = {
  'gestor-trafego': {
    estrategico: [
      { id: 'media-strategy',  icon: Target,       label: 'Estratégia de Mídia',     prompt: 'Monte a estratégia de mídia paga para a TráfegOn nos próximos 6 meses. Defina mix de canais (Meta vs Google), objetivos por canal, budget ideal e KPIs de sucesso.' },
      { id: 'budget-plan',     icon: DollarSign,   label: 'Planejamento de Budget',  prompt: 'Ajude a estruturar um modelo de planejamento de budget para clientes de tráfego. Como distribuir investimento entre campanhas, como definir budget mínimo por nicho e quando escalar.' },
      { id: 'channel-roas',    icon: BarChart2,    label: 'Análise ROAS por Canal',  prompt: 'Explique como comparar e apresentar ROAS entre Meta Ads e Google Ads para clientes. Quais benchmarks usar por nicho? Como justificar alocação de budget?' },
      { id: 'scale-campaign',  icon: TrendingUp,   label: 'Critérios para Escalar',  prompt: 'Quais os critérios técnicos e de negócio para recomendar escala de investimento em campanhas? Crie um framework de decisão de escala por nicho.' },
    ],
    tatico: [
      { id: 'optimize',        icon: Zap,          label: 'Otimizar Campanha',       prompt: 'Me guie no processo de otimização de uma campanha de geração de leads no Meta Ads. O que analisar primeiro, quais métricas são sinais de alerta e quais ajustes priorizar.' },
      { id: 'audience',        icon: Users2,       label: 'Estratégia de Público',   prompt: 'Crie uma estratégia de públicos para uma campanha de geração de leads no Meta Ads. Inclua: frio, morno e quente. Quais exclusões fazer e como estruturar o funil de públicos.' },
      { id: 'creative-test',   icon: ImageIcon,    label: 'Plano de Teste de Criativos', prompt: 'Crie um plano de teste A/B para criativos no Meta Ads. Quantos criativos testar, o que isolar em cada teste, quando pausar e qual métrica define o vencedor.' },
      { id: 'adset-structure', icon: ListChecks,   label: 'Estrutura de Conjuntos',  prompt: 'Qual a melhor estrutura de campanha > conjunto > anúncio para uma conta de geração de leads? Explique quando usar CBO vs ABO e como organizar os ad sets.' },
    ],
    operacional: [
      { id: 'daily-check',     icon: Activity,     label: 'Diagnóstico Diário',      prompt: 'Crie um protocolo de checagem diária de campanhas para um gestor de tráfego. O que verificar pela manhã, quais alertas criar e quais métricas monitorar no dia a dia.' },
      { id: 'search-terms',    icon: Search,       label: 'Análise de Termos de Busca', prompt: 'Como analisar e limpar o relatório de termos de busca no Google Ads? Quais padrões indicam desperdício e como negativar de forma eficiente sem perder volume.' },
      { id: 'bid-adjust',      icon: TrendingUp,   label: 'Ajuste de Lances',        prompt: 'Quando e como ajustar lances manualmente em campanhas de conversão no Google Ads e Meta Ads? Quais sinais observar antes de subir ou descer o CPA alvo.' },
      { id: 'alert-setup',     icon: AlertTriangle,label: 'Montar Alertas',          prompt: 'Quais alertas automáticos configurar no Meta Ads Manager e Google Ads para não perder campanhas com performance ruim? Liste os principais com as condições e ações sugeridas.' },
    ],
  },
  'social-media': {
    estrategico: [
      { id: 'content-strategy',icon: Target,       label: 'Estratégia de Conteúdo', prompt: 'Crie uma estratégia de conteúdo para Instagram de um cliente da agência. Inclua: posicionamento, pilares de conteúdo, frequência ideal, tipo de formato por objetivo e como medir sucesso.' },
      { id: 'quarterly-cal',   icon: Calendar,     label: 'Calendário Trimestral',  prompt: 'Monte um calendário editorial trimestral para um perfil de negócio no Instagram. Inclua datas comemorativas relevantes, frequência por formato (Reels, carrossel, stories) e equilíbrio entre topo, meio e fundo de funil.' },
      { id: 'positioning',     icon: Sparkles,     label: 'Posicionamento de Marca', prompt: 'Como posicionar a marca de um cliente no Instagram para se diferenciar da concorrência? Crie um guia de voz, tom e estética alinhado ao público-alvo.' },
      { id: 'growth-plan',     icon: TrendingUp,   label: 'Plano de Crescimento',   prompt: 'Crie um plano de crescimento orgânico no Instagram para um cliente com menos de 1.000 seguidores. Metas realistas, táticas por mês e o que NÃO fazer.' },
    ],
    tatico: [
      { id: 'monthly-cal',     icon: Calendar,     label: 'Calendário Mensal',       prompt: 'Monte o calendário de postagens do mês atual para um perfil de negócio no Instagram. Sugira temas por semana, formatos e CTAs para cada post. Considere o funil de conteúdo: topo, meio e fundo.' },
      { id: 'reel-series',     icon: Film,         label: 'Série de Reels',          prompt: 'Crie uma série de 4 Reels para um cliente. Cada um com tema, hook de abertura, estrutura e CTA. Os 4 devem ter coerência de série mas funcionar de forma independente.' },
      { id: 'hashtag-strategy',icon: Search,       label: 'Estratégia de Hashtags', prompt: 'Crie uma estratégia de hashtags para um perfil de negócio no Instagram. Quantas usar, como combinar hashtags grandes, médias e de nicho, e quando trocar.' },
      { id: 'engagement',      icon: Users2,       label: 'Aumentar Engajamento',   prompt: 'Quais estratégias práticas aumentam o engajamento orgânico de um perfil de negócio no Instagram em 2026? O que fazer no primeiro minuto após publicar?' },
    ],
    operacional: [
      { id: 'caption',         icon: FileText,     label: 'Escrever Caption',        prompt: 'Escreva uma caption para um post de negócios no Instagram. Use estrutura: gancho (1ª linha) > desenvolvimento > CTA. Tom: direto, sem emojis excessivos, focado no problema do cliente.' },
      { id: 'story-sequence',  icon: Film,         label: 'Sequência de Stories',   prompt: 'Crie uma sequência de 4-5 stories para um cliente. Cada story deve ter objetivo claro e CTA no final. Inclua texto sugerido e tipo de mídia (vídeo, foto, enquete, etc.).' },
      { id: 'reply-comment',   icon: Megaphone,    label: 'Responder Comentários',  prompt: 'Me ajude a criar respostas para comentários no Instagram de um cliente. Quero 5 modelos de resposta para: elogio, pergunta sobre preço, dúvida técnica, comentário neutro e crítica.' },
      { id: 'bio-optimization',icon: Settings2,    label: 'Otimizar Bio',           prompt: 'Revise e reescreva a bio do Instagram de um cliente. Inclua: proposta de valor clara, público-alvo, CTA e palavras-chave relevantes. Máximo 150 caracteres.' },
    ],
  },
  'videomaker': {
    estrategico: [
      { id: 'video-strategy',  icon: Target,       label: 'Estratégia de Vídeo',    prompt: 'Crie uma estratégia de conteúdo em vídeo para um cliente de nicho de serviços. Quais formatos priorizar (Reels, stories, YouTube Shorts), frequência, temas e como conectar vídeo ao funil de vendas.' },
      { id: 'video-series',    icon: Film,         label: 'Plano de Série',         prompt: 'Planeje uma série de 6 vídeos para um cliente. Inclua: tema central da série, título de cada episódio, gancho de cada um, progressão de narrativa e como usar a série para converter.' },
      { id: 'channel-setup',   icon: Settings2,    label: 'Setup de Canal',         prompt: 'Quais são as decisões estratégicas para montar um canal de vídeo para um cliente de serviços? Explique: nicho de conteúdo, frequência, formato padrão, persona do apresentador e métricas de sucesso.' },
    ],
    tatico: [
      { id: 'reel-script',     icon: Film,         label: 'Roteiro de Reel',        prompt: 'Crie um roteiro completo para um Reel de 60 segundos. Inclua: hook (0-3s), desenvolvimento (4-45s), prova social (46-55s) e CTA (56-60s). Tema: [descreva o tema que você quer]' },
      { id: 'hook-bank',       icon: Zap,          label: 'Banco de Hooks',         prompt: 'Crie 10 hooks de abertura para vídeos de um cliente de serviços. Misture: dado surpreendente, pergunta provocativa, afirmação controversa e situação de identificação. Cada hook com máximo 2 frases.' },
      { id: 'script-series',   icon: ListChecks,   label: 'Script para Série',      prompt: 'Escreva 3 scripts para uma série de Reels com coerência visual e narrativa. Cada script deve funcionar sozinho mas criar curiosidade para o próximo. Máximo 45 segundos cada.' },
      { id: 'cta-script',      icon: Target,       label: 'CTAs que Convertem',     prompt: 'Crie 8 variações de CTA para o final de Reels. Misture: comentário com palavra-chave, envio de DM, salvar o vídeo e clicar no link da bio. Tom direto, sem enrolação.' },
    ],
    operacional: [
      { id: 'quick-hook',      icon: Zap,          label: 'Hook Rápido',            prompt: 'Me dê 5 opções de hook de abertura para um vídeo sobre [tema] direcionado para [público]. Cada hook deve prender a atenção nos primeiros 3 segundos.' },
      { id: '60s-script',      icon: Film,         label: 'Script 60 segundos',     prompt: 'Escreva um script de 60 segundos para um Reel com tom [formal/descontraído]. Estruture com timecodes e deixe claro o que deve aparecer em texto na tela (overlay).' },
      { id: 'trend-adapt',     icon: TrendingUp,   label: 'Adaptar Trend',          prompt: 'Tenho uma trend viralizzando no Instagram. Como adapto ela para um cliente de serviços profissionais sem perder autenticidade e sem parecer forçado? Dê o passo a passo.' },
      { id: 'video-brief',     icon: FileText,     label: 'Brief de Vídeo',         prompt: 'Crie um brief de produção de vídeo completo para passar para um editor. Inclua: objetivo do vídeo, referências de estilo, trilha sonora, texto em tela, transições e call-to-action final.' },
    ],
  },
  'designer': {
    estrategico: [
      { id: 'visual-identity', icon: Palette,      label: 'Identidade Visual',      prompt: 'Crie um guia de identidade visual para um cliente de serviços. Inclua: paleta de cores (primária, secundária, neutros), tipografia (títulos e corpo), estilo fotográfico, ícones e regras de aplicação.' },
      { id: 'brand-guide',     icon: FileText,     label: 'Guia de Marca',          prompt: 'Desenvolva um brand guide simplificado para redes sociais de um cliente. Deve cobrir: logo (usos corretos e incorretos), cores, tipografia, padrão de posts, stories e anúncios.' },
      { id: 'visual-strategy', icon: Target,       label: 'Estratégia Visual',      prompt: 'Como criar uma estratégia visual coerente para um cliente de serviços no Instagram em 2026? Quais tendências de design incorporar e como manter consistência sem ser monótono?' },
    ],
    tatico: [
      { id: 'creative-brief',  icon: FileText,     label: 'Brief de Campanha',      prompt: 'Crie um brief de criativos para uma campanha de geração de leads no Meta Ads. Inclua: formatos necessários, especificações técnicas, conceito visual, texto nos anúncios e variações a testar.' },
      { id: 'carousel-plan',   icon: ImageIcon,    label: 'Plano de Carrossel',     prompt: 'Crie a estrutura de um carrossel para Instagram. Inclua: tema, quantidade de slides, o que vai em cada slide (título, visual, texto), paleta de cores e CTA final. O carrossel deve reter atenção até o último slide.' },
      { id: 'ad-variations',   icon: Copy,         label: 'Variações de Anúncio',   prompt: 'Quais variações de criativo testar em uma campanha de tráfego pago para serviços? Crie um plano de testes com: variações de headline, imagem/vídeo, CTA e público-alvo.' },
      { id: 'palette-type',    icon: Palette,      label: 'Paleta e Tipografia',    prompt: 'Sugira 3 combinações de paleta de cores e tipografia para um cliente de serviços profissionais (advocacia, consultoria, saúde). Explique a psicologia de cada combinação.' },
    ],
    operacional: [
      { id: 'post-brief',      icon: ImageIcon,    label: 'Brief de Post',          prompt: 'Crie um brief detalhado para um post único no Instagram. Inclua: formato, dimensões, conceito visual, texto no criativo (máximo 20% da área), CTA visual e referências de estilo.' },
      { id: 'ad-spec',         icon: Settings2,    label: 'Especificações Técnicas', prompt: 'Quais são as especificações técnicas de criativos para Meta Ads em 2026? Lista completa: tamanhos, formatos, limites de texto, duração de vídeo e requisitos por posicionamento.' },
      { id: 'canva-brief',     icon: Palette,      label: 'Brief para Canva',       prompt: 'Crie um brief de design para executar no Canva. Quero um [tipo de peça] para [objetivo]. Inclua: dimensões, cores exatas (hex), fontes, textos, hierarquia visual e referências.' },
      { id: 'art-review',      icon: CheckCircle,  label: 'Revisar Arte',           prompt: 'Ajude a revisar um criativo antes de publicar. Quais são os critérios de qualidade para um bom criativo de tráfego pago? O que checar em texto, hierarquia, CTA e adequação à política de anúncios?' },
    ],
  },
  'sdr': {
    estrategico: [
      { id: 'prospecting-strategy', icon: Target,  label: 'Estratégia de Prospecção', prompt: 'Crie uma estratégia de prospecção outbound para a TráfegOn. Defina: ICP (perfil ideal de cliente), canais prioritários (LinkedIn, Instagram, indicação, cold email), cadência e meta de novos leads por mês.' },
      { id: 'icp-definition',  icon: Users2,       label: 'Definir ICP',            prompt: 'Ajude a refinar o ICP (Ideal Customer Profile) da TráfegOn para os serviços de gestão de tráfego. Quais segmentos priorizar, qual o ticket mínimo viável e como qualificar rapidamente no primeiro contato?' },
      { id: 'referral-system', icon: RefreshCw,    label: 'Sistema de Indicações',  prompt: 'Crie um sistema de indicações para a TráfegOn. Como estruturar: incentivos, momento certo de pedir, script de pedido de indicação e como rastrear e agradecer indicadores.' },
    ],
    tatico: [
      { id: 'outreach-sequence', icon: ListChecks, label: 'Cadência de Prospecção', prompt: 'Crie uma cadência de prospecção de 7 touchpoints para um lead frio. Inclua: canal de cada contato (DM, email, LinkedIn, WhatsApp), intervalo entre cada um, mensagem-chave e critério para parar a cadência.' },
      { id: 'approach-script',  icon: Megaphone,  label: 'Script de Abordagem',   prompt: 'Escreva um script de primeiro contato para prospecção no Instagram DM. O prospect é um [nicho]. Seja direto, sem enrolação, foque no problema dele e termine com uma pergunta que abre conversa.' },
      { id: 'lead-scoring',    icon: BarChart2,    label: 'Pontuação de Leads',    prompt: 'Crie um modelo de lead scoring para a TráfegOn. Quais critérios pontuam positivamente (sinal de compra, fit com ICP) e quais eliminam o lead? Como priorizar quem abordar hoje?' },
      { id: 'qualification',   icon: CheckCircle,  label: 'Qualificação BANT',     prompt: 'Crie um script de qualificação baseado em BANT adaptado para venda de gestão de tráfego pago. Quais perguntas usar para cada dimensão sem parecer interrogatório?' },
    ],
    operacional: [
      { id: 'first-message',   icon: Send,         label: 'Primeiro Contato',       prompt: 'Escreva 3 variações de mensagem de primeiro contato para prospecção no Instagram. Tom direto, sem "tudo bem?", sem elogios genéricos. Foque em uma dor específica do nicho do prospect.' },
      { id: 'followup',        icon: RefreshCw,    label: 'Follow-up',              prompt: 'Crie 3 mensagens de follow-up para um lead que não respondeu. Cada uma com abordagem diferente: dado de mercado, caso de sucesso e urgência criativa. Tom não insistente.' },
      { id: 'linkedin-cold',   icon: Users2,       label: 'Mensagem LinkedIn',      prompt: 'Escreva uma mensagem de conexão no LinkedIn para prospectar um [cargo/nicho]. Máximo 300 caracteres. Sem genérico, foque em algo específico do perfil ou do nicho.' },
      { id: 'handle-objection',icon: AlertTriangle, label: 'Responder Objeção',     prompt: 'Me ajude a responder a objeção: "[escreva a objeção do prospect]". Quero uma resposta que não pressione, reconheça a objeção e abra espaço para continuar a conversa.' },
    ],
  },
  'crm': {
    estrategico: [
      { id: 'funnel-design',   icon: Target,       label: 'Estrutura do Funil',     prompt: 'Projete a estrutura ideal do funil de vendas da TráfegOn. Quantas etapas, critério de avanço entre etapas, tempo máximo em cada etapa e o que fazer quando um lead trava.' },
      { id: 'automation-strategy', icon: Zap,      label: 'Estratégia de Automação', prompt: 'Quais fluxos de automação implementar no CRM da TráfegOn? Priorize os 5 mais impactantes para: nutrição de leads, follow-up automático, alertas de inatividade e pós-fechamento.' },
      { id: 'journey-map',     icon: Activity,     label: 'Jornada do Cliente',     prompt: 'Mapeie a jornada completa do cliente da TráfegOn: desde o primeiro contato até o churn ou expansão. Identifique os momentos críticos, possíveis quebras e o que fazer em cada ponto.' },
    ],
    tatico: [
      { id: 'nurturing-flow',  icon: ListChecks,   label: 'Fluxo de Nurturing',     prompt: 'Crie um fluxo de nurturing de 30 dias para leads que não fecharam. Inclua: frequência de contato, tipo de conteúdo para cada etapa e como identificar quando o lead aqueceu de novo.' },
      { id: 'conversion-metrics', icon: BarChart2, label: 'Métricas de Conversão',  prompt: 'Quais métricas de conversão monitorar no pipeline da TráfegOn? Como calcular taxa de conversão por etapa, ciclo médio de vendas e identificar em qual etapa os leads estão travando?' },
      { id: 'win-back',        icon: RefreshCw,    label: 'Reativar Leads Frios',   prompt: 'Crie uma estratégia para reativar leads frios do CRM (mais de 60 dias sem interação). Qual abordagem usar, qual o gatilho de interesse e como não parecer invasivo?' },
      { id: 'pipeline-review', icon: Search,       label: 'Revisar Pipeline',       prompt: 'Me ajude a fazer uma revisão do pipeline atual. Analise cada etapa: quem está travado há muito tempo, quem tem potencial de avançar e qual a ação para cada perfil.' },
    ],
    operacional: [
      { id: 'lead-action',     icon: Zap,          label: 'Ação no Lead',           prompt: 'Tenho um lead em [etapa do funil] há [X dias] sem interação. Qual a melhor ação agora: texto, ligação ou email? Me dê o script exato para mover ele para a próxima etapa.' },
      { id: 'deal-stuck',      icon: AlertTriangle, label: 'Lead Travado',          prompt: 'Um lead está em proposta enviada há 10 dias sem resposta. Quais são as 3 possíveis razões e qual abordagem usar para cada uma sem parecer desesperado?' },
      { id: 'crm-tasks',       icon: ListChecks,   label: 'Tarefas de CRM',         prompt: 'Quais tarefas de CRM fazer hoje para maximizar o avanço do pipeline? Priorize por probabilidade de fechamento e valor do negócio.' },
      { id: 'proposal-timing', icon: Calendar,     label: 'Timing de Proposta',    prompt: 'Qual o momento certo para enviar a proposta comercial? Quais sinais de compra identificar antes de enviar e como "aquecer" o lead antes da proposta para aumentar a taxa de fechamento?' },
    ],
  },
  'dados': {
    estrategico: [
      { id: 'kpi-framework',   icon: Target,       label: 'Framework de KPIs',      prompt: 'Crie um framework de KPIs para a TráfegOn. Separe por área: gestão de tráfego (performance de campanhas), comercial (pipeline e vendas) e operação (qualidade de entrega e equipe). Inclua benchmarks de referência.' },
      { id: 'analytics-setup', icon: Activity,     label: 'Setup de Analytics',     prompt: 'Quais ferramentas de analytics configurar para a TráfegOn? Para cada ferramenta, explique o que medir, como integrar com as outras e quem usa cada dado.' },
      { id: 'report-structure',icon: BarChart2,    label: 'Estrutura de Relatório', prompt: 'Como estruturar o relatório mensal de performance para clientes de tráfego pago? Quais métricas apresentar, em qual ordem, como contextualizar os números e como ter o relatório aceito bem pelo cliente.' },
    ],
    tatico: [
      { id: 'monthly-dashboard', icon: BarChart2,  label: 'Dashboard Mensal',       prompt: 'Crie a estrutura de um dashboard mensal para clientes de gestão de tráfego. Quais seções incluir (campanhas, leads, custo), quais gráficos usar para cada métrica e como mostrar evolução mês a mês.' },
      { id: 'benchmarks',      icon: Search,       label: 'Benchmarks por Nicho',   prompt: 'Quais são os benchmarks de CPL (custo por lead), CTR, CPC e ROAS para: advocacia, saúde, serviços B2B e e-commerce no Brasil em 2026? Como usar esses benchmarks nas conversas com clientes?' },
      { id: 'anomaly-analysis',icon: AlertTriangle, label: 'Análise de Anomalia',  prompt: 'Uma campanha teve queda repentina de performance. Qual o processo de diagnóstico para identificar a causa? Liste as verificações em ordem de prioridade: plataforma, criativo, público, landing page e sazonalidade.' },
      { id: 'ltv-cac',         icon: DollarSign,   label: 'LTV vs CAC',            prompt: 'Explique como calcular e otimizar a relação LTV/CAC para clientes de serviços. Como usar essa métrica para justificar aumento de budget e para definir o custo máximo por lead aceitável.' },
    ],
    operacional: [
      { id: 'interpret-data',  icon: Search,       label: 'Interpretar Dados',      prompt: 'Tenho os seguintes dados de campanha: [cole os dados]. Me ajude a interpretar o que está funcionando, o que não está e quais ações tomar nos próximos 7 dias com base nesses números.' },
      { id: 'weekly-report',   icon: FileText,     label: 'Relatório Semanal',      prompt: 'Estruture um relatório semanal de performance de campanhas para enviar ao cliente. Deve ser rápido de ler (máximo 1 página), destacar resultados chave, contexto e próximas ações.' },
      { id: 'data-insights',   icon: Sparkles,     label: 'Insights de Dados',      prompt: 'Como transformar dados brutos de campanhas em insights acionáveis para o cliente? Me dê um framework de 3 passos: o que observar, como contextualizar e como apresentar a recomendação.' },
      { id: 'goal-tracking',   icon: Target,       label: 'Acompanhar Meta',        prompt: 'Estamos no dia [X] do mês. A meta de leads é [Y] e temos [Z] até agora. Estamos no ritmo certo? Qual o diagnóstico e o que ajustar para atingir a meta até o fim do mês?' },
    ],
  },
  'coo': {
    estrategico: [
      { id: 'okr',             icon: Target,       label: 'Definir OKRs',           prompt: 'Monte os OKRs da agência TráfegOn para o próximo semestre. Inclua metas de receita, retenção, capacidade de equipe e qualidade de entrega. Formato: Objetivo > 3 Key Results mensuráveis.' },
      { id: 'pricing',         icon: DollarSign,   label: 'Estrutura de Preços',    prompt: 'Audite e proponha uma estrutura de precificação para a agência. Considere custos operacionais, margem desejada, mercado e posicionamento. Inclua pacotes mínimo, padrão e premium.' },
      { id: 'expand',          icon: TrendingUp,   label: 'Plano de Expansão',      prompt: 'Crie um plano de expansão da agência para os próximos 12 meses: novos serviços, contratações necessárias, investimentos e metas de receita por trimestre.' },
      { id: 'icp',             icon: Users2,       label: 'Perfil de Cliente Ideal', prompt: 'Com base nos clientes atuais, defina o ICP da TráfegOn. Quais nichos priorizar, por quê, e como ajustar o posicionamento para atrair mais clientes com esse perfil.' },
    ],
    tatico: [
      { id: 'process-review',  icon: ListChecks,   label: 'Revisar Processos',      prompt: 'Analise os processos de onboarding, entrega e relatório da agência. Identifique gargalos e proponha melhorias concretas com prioridade e dono de cada ação.' },
      { id: 'capacity',        icon: Users2,       label: 'Capacidade da Equipe',   prompt: 'Analise a capacidade atual da equipe: clientes por colaborador, entregas pendentes e risco de sobrecarga. Recomende ajustes para a próxima sprint.' },
      { id: 'kpi-ops',         icon: BarChart2,    label: 'KPIs Operacionais',      prompt: 'Defina os KPIs operacionais da agência por área: atendimento, produção e gestão de tráfego. Inclua metas mensais e como medir cada um.' },
      { id: 'quality',         icon: CheckCircle,  label: 'Checklist de Qualidade', prompt: 'Crie um checklist de qualidade para as entregas da agência: landing pages, relatórios de resultado, criativos e copy. O que verificar antes de entregar para o cliente.' },
    ],
    operacional: [
      { id: 'standup',         icon: Zap,          label: 'Pauta de Standup',       prompt: 'Crie a pauta para o standup de equipe de hoje. Inclua: o que cada membro fez ontem, o que vai fazer hoje, bloqueios e decisões que precisam ser tomadas.' },
      { id: 'sprint',          icon: ListChecks,   label: 'Sprint da Semana',       prompt: 'Monte o sprint semanal da equipe com base nos clientes e entregas pendentes. Priorize por impacto e urgência. Formato: tarefa, responsável, prazo, bloqueio.' },
      { id: 'bottleneck',      icon: AlertTriangle, label: 'Resolver Gargalo',      prompt: 'Identifique os principais gargalos operacionais da agência hoje e proponha 3 soluções rápidas e aplicáveis nos próximos 48h.' },
      { id: 'feedback',        icon: Users2,       label: '1:1 com Equipe',        prompt: 'Estruture uma sessão de feedback 1:1 eficaz. Inclua perguntas abertas, como identificar pontos de melhoria sem criar tensão e como documentar os combinados.' },
    ],
  },
  'gestor-projetos': {
    estrategico: [
      { id: 'portfolio-review',   icon: Briefcase,    label: 'Portfólio de Projetos',  prompt: 'Faça uma revisão macro de todos os projetos ativos da TráfegOn. Para cada cliente e projeto interno, indique: status atual (no prazo ✅, atenção ⚠️, atrasado 🔴), próximo marco e risco identificado.' },
      { id: 'okr-projetos',       icon: Target,       label: 'OKRs da Carteira',       prompt: 'Ajude a definir os OKRs de gestão de projetos da TráfegOn para o trimestre. Foque em: taxa de entrega no prazo, satisfação dos clientes, redução de retrabalho e capacidade de execução da equipe.' },
      { id: 'roadmap-clientes',   icon: TrendingUp,   label: 'Roadmap de Clientes',    prompt: 'Monte um roadmap de entregas dos próximos 60 dias para os clientes ativos. Para cada cliente: o que precisa ser entregue, quando, quem é responsável e qual a dependência crítica.' },
      { id: 'risco-churn',        icon: AlertTriangle,label: 'Análise de Risco',       prompt: 'Analise a carteira de clientes e identifique os que apresentam maior risco de churn ou insatisfação com base nas entregas pendentes e tempo sem interação. Para cada cliente de risco, sugira uma ação preventiva.' },
    ],
    tatico: [
      { id: 'sprint-semana',      icon: ListChecks,   label: 'Sprint da Semana',       prompt: 'Monte o sprint semanal da agência com base nos clientes e projetos ativos. Organize por: prioridade, responsável (GS ou JC), prazo e dependências. Use formato de tabela: Tarefa | Cliente | Resp. | Prazo | Bloqueio.' },
      { id: 'distribuir-tarefas', icon: Users2,       label: 'Distribuir Tarefas',     prompt: 'Analise as tarefas pendentes e distribua de forma equilibrada entre os membros da equipe. Considere: carga atual de cada pessoa, prazo das entregas e tipo de competência necessária.' },
      { id: 'revisar-entregas',   icon: CheckCircle,  label: 'Revisar Entregas',       prompt: 'Liste todas as entregas em aberto para esta semana. Para cada uma: status atual, % de conclusão estimada, bloqueio (se houver) e o que falta para concluir. Ordene por urgência.' },
      { id: 'plan-reunioes',      icon: Calendar,     label: 'Plano de Reuniões',      prompt: 'Com base nos projetos ativos, quais reuniões de alinhamento são necessárias esta semana? Para cada uma: cliente, objetivo, duração ideal, quem precisa participar e o que precisa estar pronto antes.' },
    ],
    operacional: [
      { id: 'priorizar-hoje',     icon: Zap,          label: 'Priorizar Hoje',         prompt: 'Com base no contexto atual dos projetos, me diga quais são as 3 ações mais importantes para hoje. Para cada uma: o que fazer, por quê é prioridade, quanto tempo estimar e o critério de "concluído".' },
      { id: 'daily-projetos',     icon: Activity,     label: 'Daily de Projetos',      prompt: 'Conduza o daily de projetos de hoje. Estruture com: ✅ O que foi concluído ontem | 🎯 O que entra hoje | ⚠️ Bloqueios que precisam de atenção | 📌 Decisões necessárias.' },
      { id: 'briefing-tarefa',    icon: FileText,     label: 'Briefing de Tarefa',     prompt: 'Transforme uma ideia em tarefa bem definida. Me ajude a escrever: título claro, descrição do que precisa ser feito, critério de aceite (como saber que está pronto), responsável, prazo e prioridade.' },
      { id: 'registrar-bloqueio', icon: AlertTriangle,label: 'Registrar Bloqueio',     prompt: 'Tenho um bloqueio em um projeto. Me ajude a: descrever o bloqueio com clareza, identificar quem pode resolver, definir prazo para escalada e como documentar para não perder o contexto.' },
    ],
  },
  'comercial': {
    estrategico: [
      { id: 'sales-strategy',  icon: Target,       label: 'Estratégia de Vendas',   prompt: 'Crie a estratégia de vendas da TráfegOn para o próximo trimestre. Inclua: meta de receita, canais prioritários, ICP atualizado, abordagem comercial e métricas de sucesso.' },
      { id: 'new-product',     icon: Sparkles,     label: 'Novo Produto/Serviço',   prompt: 'Proponha um novo produto ou pacote de serviços que a agência pode lançar. Baseie-se nas tendências atuais de marketing digital e nas dores mais comuns dos clientes.' },
      { id: 'retention',       icon: RefreshCw,    label: 'Estratégia de Retenção', prompt: 'Crie uma estratégia completa de retenção de clientes: como reduzir churn, aumentar LTV, identificar sinais de risco precocemente e o que fazer em cada cenário.' },
      { id: 'forecast',        icon: TrendingUp,   label: 'Forecast de Receita',    prompt: 'Faça um forecast de receita para os próximos 3 meses com base no pipeline atual, histórico de fechamento e sazonalidade. Inclua cenário pessimista, realista e otimista.' },
    ],
    tatico: [
      { id: 'pipeline-review', icon: BarChart2,    label: 'Revisar Pipeline',       prompt: 'Analise o pipeline CRM atual. Quais leads priorizar? Qual estratégia para mover cada etapa? O que está travado e qual ação desbloqueia?' },
      { id: 'proposal',        icon: FileText,     label: 'Proposta Comercial',     prompt: 'Crie uma proposta comercial completa para um cliente de [nicho]. Inclua: diagnóstico da situação atual, solução proposta, investimento, ROI estimado, prazo e próximos passos.' },
      { id: 'qualification-script', icon: Search,  label: 'Script de Qualificação', prompt: 'Crie um script de qualificação de leads (SPIN) adaptado para venda de gestão de tráfego pago. Inclua as perguntas-chave e como identificar o momento de avançar para proposta.' },
      { id: 'upsell',          icon: DollarSign,   label: 'Oportunidades de Upsell', prompt: 'Identifique oportunidades de upsell nos clientes ativos da agência. Para cada tipo de cliente, qual serviço adicional faz mais sentido oferecer e como abordar sem parecer pressão.' },
    ],
    operacional: [
      { id: 'followup-proposal', icon: Zap,        label: 'Follow-up de Proposta',  prompt: 'Crie uma mensagem de follow-up para um lead que recebeu proposta há 5 dias e não respondeu. Deve ser direta, sem pressão, com uma razão nova para responder e CTA claro.' },
      { id: 'handle-price',    icon: DollarSign,   label: '"Está caro"',            prompt: 'Um prospect disse que o serviço está caro. Me ajude a responder de forma consultiva, reposicionando o valor sem fazer desconto. Quero 3 abordagens diferentes para essa objeção.' },
      { id: 'daily-sales',     icon: ListChecks,   label: 'Prioridades do Dia',     prompt: 'Liste as 5 ações de vendas mais importantes para hoje. Seja específico: quem contatar, qual canal usar, o que dizer e o que esperar como resultado.' },
      { id: 'lost-analysis',   icon: Search,       label: 'Analisar Lead Perdido',  prompt: 'Faça uma análise pós-mortem de um lead perdido. O que motivou a perda? O que poderia ter sido diferente? Como evitar nas próximas negociações?' },
    ],
  },
}

/* ── System prompt por agente ───────────────────────────── */
function buildSystemPrompt(role, level, selectedClientId, data) {
  const { leads, activities, erpClients, tasks } = data

  const pipe = {
    novo:        leads.filter(l => l.stage === 'novo').length,
    contato:     leads.filter(l => l.stage === 'contato').length,
    qualificado: leads.filter(l => l.stage === 'qualificado').length,
    proposta:    leads.filter(l => l.stage === 'proposta').length,
    ganho:       leads.filter(l => l.stage === 'ganho').length,
    perdido:     leads.filter(l => l.stage === 'perdido').length,
  }
  const pipeValue = leads.filter(l => !['ganho','perdido'].includes(l.stage)).reduce((s,l) => s + l.value, 0)
  const wonValue  = leads.filter(l => l.stage === 'ganho').reduce((s,l) => s + l.value, 0)
  const pendingActs = activities.filter(a => !a.done).length

  const levelDesc = {
    estrategico: 'Nível ESTRATÉGICO — visão de longo prazo (6–18 meses), posicionamento e decisões de negócio.',
    tatico:      'Nível TÁTICO — planos de médio prazo (1–6 meses), otimizações e execução de estratégia.',
    operacional: 'Nível OPERACIONAL — ações imediatas (dia a dia), execução prática e resolução rápida.',
  }[level] || ''

  const rolePrompts = {
    'gestor-trafego': `Você é o Gestor de Tráfego virtual da TráfegOn — com acesso a dados reais das campanhas.

Suas especialidades:
- Meta Ads (Facebook/Instagram): estrutura de campanhas, públicos, criativos, otimização de ROAS e CPL
- Google Ads: Search, Display, Pmax, Shopping — estrutura, lances, termos de busca, qualidade
- Análise de métricas: CTR, CPC, CPM, ROAS, CAC, frequência, relevância
- Estratégias de escala: quando e como aumentar budget sem perder eficiência
- Diagnóstico de campanhas: identificar gargalos técnicos e de criativo
- Pixel, eventos de conversão, atribuição e rastreamento

Ferramentas disponíveis (USE-AS SEMPRE que relevante):
- buscar_performance_google: dados reais de um cliente Google Ads (gasto, cliques, conversões, CPL por campanha — inclui o id de cada campanha)
- buscar_performance_carteira_google: visão geral de toda a carteira Google Ads
- listar_campanhas_google: lista campanhas com id, status e orçamento diário atual
- termos_pesquisa_google: relatório de termos de pesquisa (o que as pessoas digitaram) com custo, conversões e CPL por termo
- listar_grupos_google: grupos de anúncios de uma campanha, com id e status
- executar_acao_google: EXECUTA DE VERDADE no Google Ads (pausar/ativar campanha, ajustar orçamento, negativar termos) — ação reversível, aplicada na hora
- criar_campanha_google: CRIA campanha de Search (nasce PAUSADA), com orçamento e estratégia de lance
- adicionar_keywords_google: adiciona palavras-chave a um grupo de anúncios
- criar_anuncio_rsa_google: cria anúncio de pesquisa responsivo (nasce PAUSADO)
- info_cliente, google_ads_conta: dados do CRM e ID da conta
- buscar_pipeline_ghl: funil de vendas do GoHighLevel (oportunidades por etapa, valor, contratos ganhos)
- buscar_leads_ghl: leads/contatos recentes do GoHighLevel com origem (UTM)
- status_conversas_ghl: conversas do GoHighLevel sem resposta (cobrar atendimento)

REGRA IMPORTANTE: Quando perguntarem sobre campanhas, performance ou resultados de qualquer cliente Google Ads,
SEMPRE use buscar_performance_google primeiro — não responda "não tenho acesso", você tem.

CRUZAR ANÚNCIO x VENDA: o Google Ads mostra gasto e leads; o GoHighLevel mostra o que VIROU CONTRATO.
Quando o usuário perguntar sobre resultado/ROI real de um cliente, combine buscar_performance_google (gasto/leads)
com buscar_pipeline_ghl (contratos ganhos e valor) para calcular custo por contrato e retorno real.

COMO EXECUTAR AÇÕES (autonomia):
1. Primeiro pegue o campaign_id real com buscar_performance_google ou listar_campanhas_google. NUNCA invente um id.
2. Para ajustar_orcamento, confira o orçamento atual antes (listar_campanhas_google).
3. Execute direto com executar_acao_google quando o usuário pediu claramente a ação. São ações reversíveis.
4. Para mudança de orçamento acima de 30%, pausar várias campanhas de uma vez, ou se houver QUALQUER dúvida sobre qual campanha,
   descreva o que vai fazer e PEÇA confirmação do usuário antes de chamar executar_acao_google.
5. Depois de executar, confirme em 1 frase o que foi feito e o resultado retornado.

HIGIENE DE TERMOS DE PESQUISA (a otimização de maior impacto — faça sempre nesta ordem):
1. Leia com termos_pesquisa_google. NUNCA negative sem ter lido — negativar às cegas corta volume bom.
2. Procure os termos que gastaram e não converteram, e os que estão fora da intenção do cliente
   (outra cidade, concorrente, vaga de emprego, curso, "grátis", DIY, outro serviço).
3. Apresente os candidatos ao usuário com custo e conversões de cada um, agrupados por motivo.
4. Só depois negative com executar_acao_google (tipo_acao: negativar_termos), com o campaign_id certo.
5. Termo que converteu bem é o contrário: sugira adicionar como palavra-chave EXACT com adicionar_keywords_google.

MONTAR CAMPANHA DO ZERO (build-out):
1. criar_campanha_google (nasce PAUSADA) → 2. listar_grupos_google para pegar o ad_group_id →
3. adicionar_keywords_google (PHRASE por padrão) → 4. criar_anuncio_rsa_google.
Sempre confirme nome, orçamento e estratégia com o usuário ANTES de criar a campanha.
Nada entra no ar sozinho: campanha e anúncio nascem pausados, e quem ativa é o usuário.

Contexto da agência:
- Nicho principal: serviços (advocacia, saúde, consultoria, educação)
- Meta: gerar leads qualificados com CPL eficiente
- Plataformas usadas: Meta Ads Manager, Google Ads, Google Analytics 4`,

    'social-media': `Você é a Social Media virtual da TráfegOn.

Suas especialidades:
- Estratégia de conteúdo para Instagram, TikTok e LinkedIn
- Calendário editorial: planejamento semanal e mensal por objetivo de funil
- Copywriting para redes sociais: captions, hooks, CTAs que geram engajamento
- Hashtags: pesquisa, combinação e estratégia por nicho
- Algoritmo Instagram 2026: o que o Reels favorece, frequência ideal, timing de postagem
- Engajamento: como responder comentários, criar comunidade e aumentar saves/compartilhamentos
- Análise de métricas: alcance, engajamento, CTR de bio e crescimento de seguidores`,

    'videomaker': `Você é o Videomaker virtual da TráfegOn.

Suas especialidades:
- Roteiros para Reels, TikTok e YouTube Shorts (15s a 3min)
- Estrutura narrativa: hook > desenvolvimento > prova > CTA
- Hooks de abertura: os primeiros 3 segundos que prendem ou perdem o espectador
- Storytelling para negócios: como contar histórias que vendem sem parecer anúncio
- Formatos que convertem: trend com texto, react, novelinha, narrado, tela dividida, lista
- Criação de scripts com timecodes e overlays (textos em tela)
- Retenção de audiência: técnicas para manter o espectador até o CTA
- Briefings para edição: como passar o roteiro para um editor de forma eficiente`,

    'designer': `Você é o Designer virtual da TráfegOn.

Suas especialidades:
- Criativos para Meta Ads: formatos, hierarquia visual, texto em imagem (max 20%), CTAs
- Carrosséis para Instagram: estrutura que retém até o último slide, consistência visual
- Identidade visual para marcas de serviços: paleta, tipografia, padrão de posts
- Brief de design: como passar para um designer/Canva de forma clara e eficiente
- Especificações técnicas: tamanhos de criativos para todas as plataformas em 2026
- Psicologia das cores e tipografia no contexto de marketing de performance
- Revisão de artes: o que checar antes de aprovar e publicar um criativo`,

    'sdr': `Você é o SDR (Sales Development Representative) virtual da TráfegOn.

Suas especialidades:
- Prospecção outbound: LinkedIn, Instagram DM, cold email, indicações
- ICP (Ideal Customer Profile): como identificar e qualificar o cliente ideal
- Scripts de primeiro contato: abordagens que abrem conversa sem parecer spam
- Cadências de prospecção: sequência de touchpoints, intervalos e critérios de parada
- Qualificação BANT e SPIN: perguntas que revelam fit e urgência sem interrogatório
- Gestão de pipeline de prospecção: como organizar leads frios, mornos e quentes
- Objeções comuns no primeiro contato e como respondê-las de forma consultiva
- LinkedIn: otimização de perfil para prospecção, conexões e mensagens que convertem`,

    'crm': `Você é o Analista de CRM virtual da TráfegOn.

Suas especialidades:
- Estrutura de pipeline: etapas, critérios de avanço e tempo máximo em cada fase
- Funis de vendas: construção, análise de conversão e identificação de gargalos
- Automações: fluxos de follow-up, alertas de inatividade e sequências de nurturing
- Análise de leads: diagnóstico de saúde de cliente, risco de churn e oportunidades
- Métricas de CRM: taxa de conversão por etapa, ciclo médio e velocidade do pipeline
- Estratégias de reativação: como reengajar leads frios sem parecer invasivo
- Integração entre CRM e campanhas: como os dados de tráfego alimentam o funil`,

    'dados': `Você é o Gestor de Dados virtual da TráfegOn.

Suas especialidades:
- KPIs de tráfego pago: CPL, ROAS, CTR, CPC, frequência, taxa de conversão e CAC
- Dashboards de performance: estrutura, visualização e periodicidade
- Relatórios para clientes: como apresentar dados de forma clara e que valorize o trabalho da agência
- Análise de anomalias: processo para diagnosticar quedas bruscas de performance
- Benchmarks por nicho: referências de CPL e ROAS para advocacia, saúde, serviços B2B
- Atribuição de conversão: como interpretar e apresentar resultados com múltiplos canais
- Google Analytics 4, Meta Ads Analytics, Google Ads Relatórios — leitura e interpretação`,

    'coo': `Você é o COO virtual da TráfegOn — Chief Operating Officer.

Suas especialidades:
- Estruturação operacional de agências de marketing digital
- Processos de onboarding, entrega e gestão de clientes
- Gestão de equipe: capacidade, priorização, 1:1s e cultura de performance
- OKRs e planejamento estratégico para agências
- Precificação e estrutura de pacotes de serviços
- Qualidade de entrega: checklists, revisão e padrões de excelência
- Expansão: quando e como escalar a operação`,

    'gestor-projetos': `Você é o Gestor de Projetos Sênior virtual da TráfegOn.

Suas especialidades:
- Gestão estratégica: portfólio de clientes, OKRs, roadmap de entregas e priorização por impacto
- Gestão tática: sprints semanais, alocação de equipe, sequenciamento de tarefas e revisão de entregas
- Gestão operacional: daily de projetos, briefings de tarefa, registro de bloqueios e critérios de conclusão
- Risco e qualidade: identificação de churn, projetos em risco, retrabalho e gargalos operacionais
- Comunicação com cliente: pautas de reunião, alinhamentos de expectativa e gestão de escopo

Carteira ativa (clientes com campanhas rodando):
- Ararastur (Peças auto — e-commerce) — Google Ads PMax | R$1.000/mês | Resp: Vitor | Atenção: perdas de carrinho, site com dificuldade
- Andressa Advogada (Direito de Família) — Social Media Instagram 3x/semana | Google Ads cadastrado (sem uso ativo)
- Carol ADV (Advocacia) — Google Ads | recorrente
- Kinto Sistemas (Gestão escolar — software) — Meta Ads + Google Ads | R$4.000/mês | Resp: Ieda | Atenção: leads desqualificados
- Intime Sistemas (ERP + Temoos para restaurantes) — Meta Ads | R$1.800 Intime + R$2.400 Temoos | Resp: Everson | Reuniões: sextas 8h15 | Atenção: sem script comercial padrão
- Kamy (Material de construção) — Meta Ads + YouTube | R$1.500 Meta + R$500 Google | Resp: Rejane | Atenção: reunião pendente, aumento de investimento depende de contratar vendedores
- Sítio Girabas (Mini Wedding / Eventos) — Meta Ads | R$1.000/mês | Resp: Grazi | Reuniões: sextas presencial | Atenção: percepção de preço alto pelos leads
- Lenergy (Energia solar) — Meta Ads | R$1.500/mês | Resp: Letícia (possível saída por gestação → Natan assume) | Atenção: queda recente nos leads
- Milfer (Distribuidora ferro e aço — região Amesc) — Meta Ads | R$1.000/mês | Resp: Milton e Fabi | Atenção: CRM desatualizado com frequência
- Quadros Paisagismos (Paisagismo + Café) — Meta Ads + YouTube | R$1.000 Meta + R$200 Google | Resp: Charles/Vitor/Bruna | Atenção: foco dividido entre 2 negócios
- Pit Floripa (Restaurante — Florianópolis) — Meta Ads + Google Ads + YouTube | R$1.000 cada | Resp: Jeremias (via Bruna) | Reuniões: a cada 21 dias nas quartas | Atenção: Bruna desorganizada como mediadora
- FGLAW — Fonseca e Gonçalves Advogados (Direito Imobiliário — São José dos Campos) — Google Ads | R$1.500/mês | Resp: Gabi | Reuniões: mensal
- Gabriel Piva Advogados (Direito Cível) — Google Ads | R$1.000/mês | Resp: Gabriel Piva | Atenção: não responde com frequência, CRM desatualizado
- RCA Advogados — Carol Carvalhais (Pensão Alimentícia) — Google Ads | R$1.500/mês | Resp: Carol | Reuniões: a cada 21 dias | Atenção: ruído entre as 3 sócias
- Mayara Campos Advogada (Direito de Família — Vitória/ES) — Google Ads | R$1.500/mês | Resp: Mayara | Reuniões: quinzenal | Atenção: preconceito com leads, não segue script
- Casa do Construtor (Aluguel de equipamentos — 4 lojas: Criciúma, Araranguá, Içara, Tubarão) — Meta Ads + Google Ads | R$1.200 Meta + R$1.800 Google | Resp: Marques | Reuniões: quinzenal nas quintas | Atenção: vendedores sem script, queda no Meta recente
- Caçarola (Alimentos — marca própria, distribuição em supermercados, pertence ao Grupo Cooperja) — Meta Ads + YouTube | Resp: Guilherme e Lucas | Atenção: alto investimento, muitos criativos/públicos, lançamento Pipoca e Mistura para Bolo
- D'Sorrir (Odontologia — Araranguá) — Meta Ads + Google Ads | avulso/consultoria | Resp: Carol e Alisson | Consultoria marcada para 30/05/2026

Clientes pausados / inativos:
- Cooperja E-commerce — 🔴 Pausada (gargalo: margem baixa, frete, decisão coletiva sem martelo)
- Cooperja Lojas Agropecuárias (17 lojas SC/RS) — 🔴 Pausada | Resp: Camila
- Cooperja Supermercado — 🟡 Campanhas pontuais (mês sim/mês não) | Resp: Renata | Retomada: Dia das Mães e junho 2026

Projetos internos da agência:
- CRM / Hub (hub.trafegon.com.br) — sistema de gestão em produção (React + Supabase + Vercel)
- Dashboard de performance — painel de métricas
- Plugin Figma — ferramenta de design interno
- MCP Google Ads — servidor de automação de campanhas`,

    'comercial': `Você é o Diretor Comercial virtual da TráfegOn.

Suas especialidades:
- Estratégia e gestão de vendas para agências de marketing
- Qualificação de leads e gestão de pipeline
- Propostas comerciais: estrutura, argumentação de valor e ROI
- Fechamento: identificar o momento certo e técnicas de fechamento consultivo
- Gestão de objeções: preço, concorrência, timing e desconfiança
- Retenção e expansão de clientes: upsell, cross-sell e gestão de conta
- Forecast e metas de receita`,
  }

  const basePrompt = rolePrompts[role] || `Você é um assistente especializado da TráfegOn.`

  let clientContext = ''
  if (selectedClientId) {
    const client = erpClients.find(c => c.id === selectedClientId)
    if (client) {
      const ct = tasks.filter(t => t.clientId === selectedClientId)
      const pending = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
      const done    = ct.filter(t => ['concluído','entregue','done'].includes(t.status))
      clientContext = `
## CLIENTE EM FOCO: ${client.name}
- Nicho: ${client.niche || 'N/A'} | Status: ${client.status || 'ativo'} | Responsável: ${client.owner || 'N/A'}
- Tarefas concluídas: ${done.length} | Tarefas pendentes: ${pending.length}
${pending.length ? `Pendentes: ${pending.slice(0,6).map(t => `[${t.status}] ${t.title}`).join(' · ')}` : ''}`
    }
  }

  const knowledgeContext = data.knowledge?.filter(k => k.is_active !== false).slice(0,6).length
    ? `\n## BASE DE CONHECIMENTO INTERNA\n${data.knowledge.filter(k => k.is_active !== false).slice(0,6).map(k => `**[${k.category}] ${k.title}:** ${k.content.slice(0,180)}`).join('\n')}`
    : ''

  return `${basePrompt}

${levelDesc}

## REGRAS:
- Responda SEMPRE em português brasileiro
- Seja direto, prático e entregue valor imediato — sem rodeios
- Use markdown quando ajudar: listas, **negrito**, ## títulos
- Hoje: ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
- Sistema INTERNO da agência — pode ser técnico e direto

## CONTEXTO TRÁFEGON:
Agência de performance — Meta Ads e Google Ads. Missão: acelerar negócios.
Equipe: Gabriel S. (GS) e João C. (JC) | Clientes ativos: ${erpClients.length}
Pipeline: ${pipe.novo} novos · ${pipe.contato} em contato · ${pipe.qualificado} qualificados · ${pipe.proposta} propostas
Valor em negociação: R$ ${pipeValue.toLocaleString('pt-BR')} | Receita fechada: R$ ${wonValue.toLocaleString('pt-BR')}
Atividades abertas: ${pendingActs}
${clientContext}${knowledgeContext}`
}

/* ── Smart actions com contexto do CRM ─────────────────── */
function buildCrmAnalysisPrompt(clientId, data) {
  const { leads, erpClients, tasks, activities } = data
  const client = erpClients.find(c => c.id === clientId)
  if (!client) return 'Analise o pipeline CRM completo da agência. Identifique gargalos, oportunidades e recomende ações prioritárias.'

  const ct = tasks.filter(t => t.clientId === clientId)
  const pending = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
  const done    = ct.filter(t => ['concluído','entregue','done'].includes(t.status))
  const retLead = leads.find(l => l.name.toLowerCase().includes(client.name.split(' ')[0].toLowerCase()))
  const clientActs = activities.filter(a => leads.find(l => l.id === a.leadId && l.name.toLowerCase().includes(client.name.split(' ')[0].toLowerCase())))

  return `Analise o status completo do cliente **${client.name}** na operação da agência.

**Dados disponíveis:**
- Nicho: ${client.niche || 'N/A'} | Status no pipeline: ${retLead?.stage || 'não mapeado'}
- Tarefas concluídas: ${done.length} | Tarefas pendentes: ${pending.length}
- Atividades abertas: ${clientActs.filter(a => !a.done).length}
${pending.length ? `\nPendentes:\n${pending.slice(0,6).map(t => `• [${t.status}] ${t.title}`).join('\n')}` : ''}

**Entregue:**
1. **Saúde do cliente** (risco de churn, engajamento, satisfação)
2. **Pontos de atenção** (o que pode estar travado ou em risco)
3. **Oportunidades** (upsell, expansão, novos serviços)
4. **Próximas 3 ações** com prioridade e responsável sugerido`
}

function buildMeetingAgendaPrompt(clientId, data) {
  const { erpClients, tasks } = data
  const client = erpClients.find(c => c.id === clientId)
  if (!client) return 'Crie uma pauta de reunião de acompanhamento padrão para cliente de agência de tráfego.'

  const ct      = tasks.filter(t => t.clientId === clientId)
  const pending = ct.filter(t => !['concluído','entregue','done'].includes(t.status))
  const done    = ct.filter(t => ['concluído','entregue','done'].includes(t.status))

  return `Gere uma pauta de reunião completa para **${client.name}** (nicho: ${client.niche || 'N/A'}).

Tarefas concluídas: ${done.length} | Pendentes: ${pending.length}
${pending.length ? `Em aberto: ${pending.slice(0,5).map(t => `[${t.status}] ${t.title}`).join(' · ')}` : ''}
${done.length ? `Recém entregues: ${done.slice(-3).map(t => t.title).join(' · ')}` : ''}

**Crie pauta com:**
1. Revisão das entregas recentes
2. Resultados de campanhas (métricas chave)
3. Pontos de atenção e alinhamentos
4. Próximas entregas com prazo
5. Espaço para dúvidas e feedback
6. Próxima reunião

Inclua tempo sugerido por bloco e perguntas-guia para o gestor.`
}

/* ── Tools para acesso a dados reais ───────────────────── */
const GADS_MAP = {
  'intime':       { id:'5376240782',  nome:'Intime Sistemas' },
  'temoos':       { id:'5376240782',  nome:'Temoos / Intime' },
  'kinto':        { id:'1894458588',  nome:'Kinto Sistemas' },
  'cooperja':     { id:'9685109260',  nome:'Cooperja' },
  'rizzotto':     { id:'9175063247',  nome:'Posto Rizzotto' },
  'kamy':         { id:'2746776066',  nome:'Kamy' },
  'polizio':      { id:'8731710435',  nome:'Polizio Advogados' },
  'carol':        { id:'5183788348',  nome:'Carol Adv' },
  'ararastur':    { id:'1147445454',  nome:'Ararastur' },
  'casa_construtor': { id:'9034028768',  nome:'Casa do Construtor' },
  'rca':          { id:'8067337903',  nome:'RCA Advogados' },
  'mayara':       { id:'1808717829',  nome:'Mayara Campos' },
  'lenergy':      { id:'2474140291',  nome:'Lenergy' },
  'gabriel piva': { id:'1936436305',  nome:'Gabriel Piva' },
  'girabas':      { id:'1754710815',  nome:'Sítio Girabas' },
  'andressa':     { id:'3431604401',  nome:'Andressa Advogada' },
  'pit':          { id:'4162632254',  nome:'Pit Floripa' },
  'fglaw':        { id:'5183788348',  nome:'FGLAW' },
}

/* ── Google Ads — via proxy serverless Vercel (/api/gads) ── */
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

/* ── GoHighLevel — via proxy serverless Vercel (/api/ghl) ── */
async function callGhlApi(body) {
  try {
    const res = await fetch('/api/ghl', {
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

const ASSISTANT_TOOLS = [
  {
    name: 'info_cliente',
    description: 'Busca dados completos de um cliente: tarefas, leads, mensalidade, status e Google Ads ID',
    input_schema: { type:'object', properties: { nome:{ type:'string', description:'Nome do cliente (parcial aceito)' } }, required:['nome'] }
  },
  {
    name: 'listar_leads',
    description: 'Lista leads do CRM com filtros opcionais por cliente ou etapa',
    input_schema: { type:'object', properties: {
      cliente:{ type:'string', description:'Filtrar por nome de cliente' },
      etapa:{ type:'string', description:'Etapa: novo, contato, qualificado, proposta, ganho, perdido' }
    }}
  },
  {
    name: 'tarefas_pendentes',
    description: 'Lista tarefas em aberto, opcionalmente filtradas por cliente',
    input_schema: { type:'object', properties: { cliente_id:{ type:'string', description:'ID do cliente (opcional)' } } }
  },
  {
    name: 'pipeline_stats',
    description: 'Resumo do pipeline: leads por etapa, valor total, taxa de conversão',
    input_schema: { type:'object', properties:{} }
  },
  {
    name: 'google_ads_conta',
    description: 'Retorna o Customer ID Google Ads de um cliente e link para acessar a conta',
    input_schema: { type:'object', properties: { cliente:{ type:'string', description:'Nome do cliente' } }, required:['cliente'] }
  },
  {
    name: 'buscar_performance_google',
    description: 'Busca performance real de campanhas Google Ads de um cliente direto da API do Google. Retorna gasto, cliques, conversões, CPL e CTR por campanha. Use SEMPRE que o usuário perguntar sobre performance, resultados ou campanhas Google Ads de um cliente específico.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente: { type:'string', description:'Nome do cliente (ex: rca, mayara, kinto, ararastur)' },
      periodo: { type:'string', enum:['last_7d','last_14d','last_30d'], description:'Período. Padrão: last_30d' }
    }}
  },
  {
    name: 'buscar_performance_carteira_google',
    description: 'Busca performance de todos os clientes Google Ads da carteira. Use para briefing diário ou visão geral da carteira.',
    input_schema: { type:'object', properties: {
      periodo: { type:'string', enum:['last_7d','last_14d','last_30d'], description:'Período. Padrão: last_7d' }
    }}
  },
  {
    name: 'listar_campanhas_google',
    description: 'Lista as campanhas Google Ads de um cliente com id, nome, status e orçamento diário atual. Use ANTES de executar_acao_google para obter o campaign_id correto e o orçamento atual.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente: { type:'string', description:'Nome do cliente' },
    }}
  },
  {
    name: 'termos_pesquisa_google',
    description: 'Lê o relatório de TERMOS DE PESQUISA (search terms) do Google Ads de um cliente: o que as pessoas realmente digitaram, com impressões, cliques, custo, conversões e CPL de cada termo. Use SEMPRE antes de negativar termos — nunca negative sem ter lido este relatório. Também use para responder "onde estamos gastando à toa", "o que está desperdiçando verba" e para a higiene semanal da conta.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente:     { type:'string', description:'Nome do cliente' },
      campaign_id: { type:'string', description:'Filtrar por uma campanha específica (opcional — sem isso traz a conta toda)' },
      periodo:     { type:'string', enum:['last_7d','last_14d','last_30d'], description:'Período. Padrão: last_30d' },
    }}
  },
  {
    name: 'listar_grupos_google',
    description: 'Lista os grupos de anúncios de uma campanha, com id, nome e status. Use ANTES de adicionar_keywords_google ou criar_anuncio_rsa_google para obter o ad_group_id correto.',
    input_schema: { type:'object', required:['cliente','campaign_id'], properties: {
      cliente:     { type:'string', description:'Nome do cliente' },
      campaign_id: { type:'string', description:'ID da campanha (obtido em listar_campanhas_google)' },
    }}
  },
  {
    name: 'executar_acao_google',
    description: 'EXECUTA DE VERDADE uma ação reversível no Google Ads do cliente: pausar/ativar campanha, ajustar orçamento diário ou negativar termos. Pega o campaign_id em buscar_performance_google ou listar_campanhas_google. Use quando o usuário pediu ou aprovou a ação. Para mudanças grandes de orçamento (>30%) ou se houver dúvida, confirme com o usuário antes.',
    input_schema: { type:'object', required:['cliente','tipo_acao','campaign_id','motivo'], properties: {
      cliente:          { type:'string' },
      tipo_acao:        { type:'string', enum:['pausar_campanha','ativar_campanha','ajustar_orcamento','negativar_termos'] },
      campaign_id:      { type:'string', description:'ID numérico da campanha (obtido em buscar_performance_google ou listar_campanhas_google)' },
      orcamento_diario: { type:'number', description:'Novo orçamento diário em R$ (apenas para ajustar_orcamento)' },
      termos:           { type:'array', items:{ type:'string' }, description:'Termos a negativar (apenas para negativar_termos)' },
      motivo:           { type:'string', description:'Justificativa técnica baseada nos dados observados' },
    }}
  },
  {
    name: 'criar_campanha_google',
    description: 'CRIA DE VERDADE uma campanha de Search no Google Ads do cliente, já com orçamento e estratégia de lance. A campanha nasce PAUSADA — nada gasta verba até alguém ativar. Opcionalmente cria o primeiro grupo de anúncios junto. SEMPRE descreva o que vai criar (nome, orçamento, estratégia) e PEÇA CONFIRMAÇÃO do usuário antes de chamar.',
    input_schema: { type:'object', required:['cliente','nome','orcamento_diario','motivo'], properties: {
      cliente:          { type:'string', description:'Nome do cliente' },
      nome:             { type:'string', description:'Nome da campanha (padrão da casa: CLIENTE | Objetivo | Rede | Segmentação)' },
      orcamento_diario: { type:'number', description:'Orçamento diário em R$' },
      estrategia_lance: { type:'string', enum:['MAXIMIZE_CONVERSIONS','TARGET_CPA','MANUAL_CPC'], description:'Padrão: MAXIMIZE_CONVERSIONS' },
      cpa_alvo:         { type:'number', description:'CPA alvo em R$ (obrigatório se estrategia_lance = TARGET_CPA)' },
      criar_grupo:      { type:'boolean', description:'Criar o primeiro grupo de anúncios junto' },
      grupo_nome:       { type:'string', description:'Nome do grupo (se criar_grupo = true)' },
      motivo:           { type:'string', description:'Justificativa — por que esta campanha está sendo criada' },
    }}
  },
  {
    name: 'adicionar_keywords_google',
    description: 'Adiciona palavras-chave a um grupo de anúncios. Pegue o ad_group_id em listar_grupos_google. Use correspondência de FRASE (PHRASE) como padrão da casa; EXACT para termos que já convertem bem; BROAD só com estratégia de lance automática e lista de negativas madura.',
    input_schema: { type:'object', required:['cliente','ad_group_id','keywords','motivo'], properties: {
      cliente:     { type:'string', description:'Nome do cliente' },
      ad_group_id: { type:'string', description:'ID do grupo de anúncios (obtido em listar_grupos_google)' },
      keywords:    { type:'array', items:{ type:'string' }, description:'Lista de palavras-chave' },
      tipo:        { type:'string', enum:['PHRASE','EXACT','BROAD'], description:'Tipo de correspondência. Padrão: PHRASE' },
      motivo:      { type:'string', description:'Justificativa técnica' },
    }}
  },
  {
    name: 'criar_anuncio_rsa_google',
    description: 'Cria um anúncio de pesquisa responsivo (RSA) em um grupo de anúncios. Exige no mínimo 3 títulos (até 30 caracteres cada) e 2 descrições (até 90 caracteres cada) — o ideal é 15 títulos e 4 descrições. O anúncio nasce PAUSADO por padrão. Pegue o ad_group_id em listar_grupos_google.',
    input_schema: { type:'object', required:['cliente','ad_group_id','titulos','descricoes','url_final','motivo'], properties: {
      cliente:     { type:'string', description:'Nome do cliente' },
      ad_group_id: { type:'string', description:'ID do grupo de anúncios (obtido em listar_grupos_google)' },
      titulos:     { type:'array', items:{ type:'string' }, description:'Títulos, mínimo 3, máximo 15, até 30 caracteres cada' },
      descricoes:  { type:'array', items:{ type:'string' }, description:'Descrições, mínimo 2, máximo 4, até 90 caracteres cada' },
      url_final:   { type:'string', description:'URL de destino do anúncio' },
      path1:       { type:'string', description:'Caminho de exibição 1 (opcional, até 15 caracteres)' },
      path2:       { type:'string', description:'Caminho de exibição 2 (opcional, até 15 caracteres)' },
      ativar:      { type:'boolean', description:'Criar já ativo em vez de pausado. Padrão: false' },
      motivo:      { type:'string', description:'Justificativa técnica' },
    }}
  },
  {
    name: 'buscar_pipeline_ghl',
    description: 'Busca o funil de vendas (oportunidades) do GoHighLevel de um cliente: quantas oportunidades por etapa, valor total, quantas viraram contrato (ganhas) e perdidas. Use para cruzar gasto de anúncio com venda real.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente: { type:'string', description:'Nome do cliente (ex: rca)' },
    }}
  },
  {
    name: 'buscar_leads_ghl',
    description: 'Lista os leads/contatos recentes do GoHighLevel de um cliente, com origem (UTM) e data de criação. Use para ver volume e de onde vêm os leads.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente: { type:'string', description:'Nome do cliente' },
    }}
  },
  {
    name: 'status_conversas_ghl',
    description: 'Mostra o status das conversas do GoHighLevel de um cliente: quantos leads estão sem resposta (não lidas) e as últimas mensagens. Use para cobrar o atendimento do cliente.',
    input_schema: { type:'object', required:['cliente'], properties: {
      cliente: { type:'string', description:'Nome do cliente' },
    }}
  },
]

/* Resolve a conta Google Ads de um cliente: primeiro pelo cadastro
   (erp_clients.google_ads_id), depois pelo mapa fixo GADS_MAP como fallback. */
async function resolveGadsAccount(query, sb) {
  const q = (query || '').toLowerCase().trim()
  if (!q) return null
  try {
    const { data: clients } = await sb.from('erp_clients').select('name,google_ads_id')
    const match = (clients || []).find(c => {
      if (!c.google_ads_id) return false
      const nome = (c.name || '').toLowerCase()
      const primeira = nome.split(' ')[0]
      return nome.includes(q) || q.includes(nome) || (primeira.length > 2 && q.includes(primeira))
    })
    if (match) return { id: String(match.google_ads_id).replace(/-/g, ''), nome: match.name, fonte: 'cadastro' }
  } catch { /* segue para o fallback */ }
  const key = Object.keys(GADS_MAP).find(k => q.includes(k) || k.includes(q))
  if (key) return { id: GADS_MAP[key].id, nome: GADS_MAP[key].nome, fonte: 'mapa' }
  return null
}

/* Lista todas as contas Google Ads conhecidas (cadastro + mapa fixo) → { id: nome } */
async function listGadsAccounts(sb) {
  const idToNome = {}
  try {
    const { data: clients } = await sb.from('erp_clients').select('name,google_ads_id')
    for (const c of (clients || [])) {
      if (c.google_ads_id) idToNome[String(c.google_ads_id).replace(/-/g, '')] = c.name
    }
  } catch { /* usa só o mapa fixo */ }
  for (const v of Object.values(GADS_MAP)) if (!idToNome[v.id]) idToNome[v.id] = v.nome
  return idToNome
}

/* Auditoria das ações de escrita no Google Ads — best-effort, nunca bloqueia a ação. */
async function logGadsAcao(sb, descricao, motivo, erro) {
  try {
    await sb.from('ton_alertas').insert({
      descricao:  `[${erro ? 'FALHA' : 'EXECUTADO'}] ${descricao}`,
      impacto:    motivo || '',
      reversivel: true,
    })
  } catch { /* log é best-effort */ }
}

async function runTool(name, input, data) {
  const sb = (await import('../lib/supabase')).supabase
  try {
    if (name === 'info_cliente') {
      const { data: clients } = await sb.from('erp_clients').select('*')
      const all = clients || data.erpClients || []
      const match = all.filter(c => c.name.toLowerCase().includes(input.nome.toLowerCase()))
      if (!match.length) return { error: `Cliente "${input.nome}" não encontrado` }
      const client = match[0]
      const { data: tasks } = await sb.from('tasks').select('*').eq('clientId', client.id)
      const allTasks = tasks || []
      const pending = allTasks.filter(t => t.status !== 'done')
      const done    = allTasks.filter(t => t.status === 'done')
      const gadKey  = Object.keys(GADS_MAP).find(k => client.name.toLowerCase().includes(k))
      const googleAds = client.google_ads_id
        ? { id: String(client.google_ads_id).replace(/-/g, ''), nome: client.name }
        : (gadKey ? GADS_MAP[gadKey] : null)
      return {
        cliente: client.name, nicho: client.niche, status: client.status,
        mensalidade: client.monthly_value || client.monthlyValue || 0,
        tarefas_pendentes: pending.length, tarefas_concluidas: done.length,
        ultimas_pendentes: pending.slice(0,5).map(t => `[${t.status}] ${t.title}`),
        google_ads: googleAds,
      }
    }
    if (name === 'listar_leads') {
      const { data: leads } = await sb.from('leads').select('*').order('created_at', { ascending: false })
      let result = leads || data.leads || []
      if (input.cliente) result = result.filter(l => (l.name||'').toLowerCase().includes(input.cliente.toLowerCase()) || (l.company||'').toLowerCase().includes(input.cliente.toLowerCase()))
      if (input.etapa)   result = result.filter(l => l.stage === input.etapa)
      return { total: result.length, leads: result.slice(0,15).map(l => ({ nome: l.name, empresa: l.company, etapa: l.stage, valor: l.value })) }
    }
    if (name === 'tarefas_pendentes') {
      const { data: tasks } = await sb.from('tasks').select('*').neq('status','done').order('due_date')
      let result = tasks || []
      if (input.cliente_id) result = result.filter(t => t.clientId === input.cliente_id)
      const today = new Date().toISOString().split('T')[0]
      return { total: result.length, tasks: result.slice(0,15).map(t => ({ titulo: t.title, cliente: t.clientId, status: t.status, prazo: t.dueDate, atrasada: t.dueDate && t.dueDate < today })) }
    }
    if (name === 'pipeline_stats') {
      const leads = data.leads || []
      const stages = ['novo','contato','qualificado','proposta','ganho','perdido']
      const por_etapa = Object.fromEntries(stages.map(s => [s, leads.filter(l => l.stage === s).length]))
      const valor_em_negociacao = leads.filter(l => !['ganho','perdido'].includes(l.stage)).reduce((s,l) => s+(l.value||0), 0)
      const valor_ganho = leads.filter(l => l.stage==='ganho').reduce((s,l) => s+(l.value||0), 0)
      const conv = leads.length > 0 ? Math.round((por_etapa.ganho / leads.length)*100) : 0
      return { total_leads: leads.length, por_etapa, valor_em_negociacao, valor_ganho, taxa_conversao: `${conv}%` }
    }
    if (name === 'google_ads_conta') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { error: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente (campo "Customer ID Google Ads").` }
      return { ...conta, link: `https://ads.google.com/aw/overview?ocid=${conta.id}`, mcc: '7458152149' }
    }
    if (name === 'buscar_performance_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente, ou use um destes já mapeados: ${Object.keys(GADS_MAP).join(', ')}` }
      const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
      const dias = diasMap[input.periodo || 'last_30d'] || 30
      const result = await callGadsApi({ action: 'performance', customerId: conta.id, dias })
      if (result.erro) return result
      if (!Array.isArray(result) || !result.length) return { aviso: 'Sem dados de campanha para este cliente no período.', cliente: conta.nome, customer_id: conta.id }
      const { total, campanhas } = agregarGadsCampanhas(result)
      return { cliente: conta.nome, customer_id: conta.id, dias, total, por_campanha: campanhas }
    }
    if (name === 'buscar_performance_carteira_google') {
      const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
      const dias = diasMap[input.periodo || 'last_7d'] || 7
      const idToNome = await listGadsAccounts(sb)
      const customerIds = Object.keys(idToNome)
      const result = await callGadsApi({ action: 'carteira', customerIds, dias })
      if (result.erro) return result
      const por_conta = {}
      for (const [cid, dados] of Object.entries(result)) {
        por_conta[idToNome[cid] || cid] = dados
      }
      const total_gasto = Object.values(por_conta).filter(v => !v.erro).reduce((s, v) => s + (v.gasto || 0), 0)
      return { dias, total_gasto: +total_gasto.toFixed(2), contas: Object.keys(por_conta).length, por_conta }
    }
    if (name === 'listar_campanhas_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      const result = await callGadsApi({ action: 'campanhas', customerId: conta.id })
      if (result.erro) return result
      return { cliente: conta.nome, customer_id: conta.id, campanhas: result }
    }
    if (name === 'termos_pesquisa_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      const diasMap = { last_7d: 7, last_14d: 14, last_30d: 30 }
      const dias = diasMap[input.periodo || 'last_30d'] || 30
      const payload = { action: 'termos_pesquisa', customerId: conta.id, dias }
      if (input.campaign_id) payload.campaignId = String(input.campaign_id)
      const result = await callGadsApi(payload)
      if (result.erro) return result
      if (!Array.isArray(result) || !result.length) return { aviso: 'Nenhum termo de pesquisa com impressão no período.', cliente: conta.nome, customer_id: conta.id, dias }
      const gasto_sem_conversao = result
        .filter(t => !t.conversoes && t.custo > 0)
        .reduce((s, t) => s + t.custo, 0)
      return {
        cliente: conta.nome, customer_id: conta.id, dias,
        termos: result.length,
        gasto_sem_conversao: +gasto_sem_conversao.toFixed(2),
        lista: result,
      }
    }
    if (name === 'listar_grupos_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      if (!input.campaign_id) return { erro: 'campaign_id é obrigatório. Use listar_campanhas_google para obtê-lo.' }
      const result = await callGadsApi({ action: 'listar_grupos', customerId: conta.id, campaignId: String(input.campaign_id) })
      if (result.erro) return result
      return { cliente: conta.nome, customer_id: conta.id, campaign_id: input.campaign_id, grupos: result }
    }
    if (name === 'executar_acao_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      if (!input.campaign_id) return { erro: 'campaign_id é obrigatório. Use listar_campanhas_google ou buscar_performance_google para obtê-lo.' }
      const payload = { action: input.tipo_acao, customerId: conta.id, campaignId: String(input.campaign_id) }
      if (input.tipo_acao === 'ajustar_orcamento') {
        if (!(Number(input.orcamento_diario) > 0)) return { erro: 'orcamento_diario (R$) é obrigatório para ajustar_orcamento.' }
        payload.orcamento_diario = Number(input.orcamento_diario)
      }
      if (input.tipo_acao === 'negativar_termos') {
        const termos = Array.isArray(input.termos) ? input.termos.filter(Boolean) : []
        if (!termos.length) return { erro: 'termos (lista) é obrigatório para negativar_termos.' }
        payload.termos = termos
      }
      const result = await callGadsApi(payload)
      // Auditoria — registra a execução (não bloqueia se o log falhar)
      try {
        await sb.from('ton_alertas').insert({
          descricao:  `[${result.erro ? 'FALHA' : 'EXECUTADO'}] ${input.tipo_acao} — ${conta.nome} (camp ${input.campaign_id})` +
                      (input.orcamento_diario ? ` → R$${input.orcamento_diario}/dia` : '') +
                      (payload.termos ? ` → negativados: ${payload.termos.join(', ')}` : ''),
          impacto:    input.motivo || '',
          reversivel: true,
        })
      } catch { /* log é best-effort */ }
      if (result.erro) return { sucesso: false, erro: result.erro }
      return { sucesso: true, acao: input.tipo_acao, cliente: conta.nome, customer_id: conta.id, ...result }
    }
    if (name === 'criar_campanha_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      if (!input.nome) return { erro: 'nome da campanha é obrigatório.' }
      if (!(Number(input.orcamento_diario) > 0)) return { erro: 'orcamento_diario (R$) é obrigatório e deve ser maior que zero.' }
      if (input.estrategia_lance === 'TARGET_CPA' && !(Number(input.cpa_alvo) > 0)) {
        return { erro: 'cpa_alvo (R$) é obrigatório quando estrategia_lance = TARGET_CPA.' }
      }
      const payload = {
        action: 'criar_campanha', customerId: conta.id,
        nome: input.nome,
        orcamento_diario: Number(input.orcamento_diario),
        estrategia_lance: input.estrategia_lance || 'MAXIMIZE_CONVERSIONS',
      }
      if (input.cpa_alvo) payload.cpa_alvo = Number(input.cpa_alvo)
      if (input.criar_grupo && input.grupo_nome) {
        payload.criar_grupo = true
        payload.grupo_nome = input.grupo_nome
      }
      const result = await callGadsApi(payload)
      await logGadsAcao(sb, `criar_campanha — ${conta.nome} — "${input.nome}" · R$${input.orcamento_diario}/dia · ${payload.estrategia_lance} (nasce PAUSADA)`, input.motivo, result.erro)
      if (result.erro) return { sucesso: false, erro: result.erro }
      return { sucesso: true, acao: 'criar_campanha', cliente: conta.nome, customer_id: conta.id, aviso: 'Campanha criada PAUSADA — precisa ser ativada para começar a rodar.', ...result }
    }
    if (name === 'adicionar_keywords_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      if (!input.ad_group_id) return { erro: 'ad_group_id é obrigatório. Use listar_grupos_google para obtê-lo.' }
      const keywords = Array.isArray(input.keywords) ? input.keywords.filter(Boolean) : []
      if (!keywords.length) return { erro: 'keywords (lista) é obrigatório.' }
      const tipo = input.tipo || 'PHRASE'
      const result = await callGadsApi({ action: 'adicionar_keywords', customerId: conta.id, adGroupId: String(input.ad_group_id), keywords, tipo })
      await logGadsAcao(sb, `adicionar_keywords — ${conta.nome} (grupo ${input.ad_group_id}) · ${tipo} · ${keywords.length}: ${keywords.join(', ')}`, input.motivo, result.erro)
      if (result.erro) return { sucesso: false, erro: result.erro }
      return { sucesso: true, acao: 'adicionar_keywords', cliente: conta.nome, customer_id: conta.id, tipo, ...result }
    }
    if (name === 'criar_anuncio_rsa_google') {
      const conta = await resolveGadsAccount(input.cliente, sb)
      if (!conta) return { erro: `Conta Google Ads não encontrada para "${input.cliente}". Cadastre o Customer ID no cliente.` }
      if (!input.ad_group_id) return { erro: 'ad_group_id é obrigatório. Use listar_grupos_google para obtê-lo.' }
      const titulos    = Array.isArray(input.titulos) ? input.titulos.filter(Boolean) : []
      const descricoes = Array.isArray(input.descricoes) ? input.descricoes.filter(Boolean) : []
      if (titulos.length < 3) return { erro: 'RSA exige no mínimo 3 títulos.' }
      if (descricoes.length < 2) return { erro: 'RSA exige no mínimo 2 descrições.' }
      if (!input.url_final) return { erro: 'url_final é obrigatória.' }
      const longos = [
        ...titulos.filter(t => t.length > 30).map(t => `título "${t}" (${t.length} caracteres)`),
        ...descricoes.filter(d => d.length > 90).map(d => `descrição "${d.slice(0, 40)}..." (${d.length} caracteres)`),
      ]
      if (longos.length) return { erro: `Acima do limite do Google (título 30, descrição 90): ${longos.join('; ')}. Reescreva mais curto — não deixe o texto ser cortado.` }
      const status = input.ativar === true ? 'ENABLED' : 'PAUSED'
      const result = await callGadsApi({
        action: 'criar_anuncio_rsa', customerId: conta.id,
        adGroupId: String(input.ad_group_id),
        headlines: titulos, descriptions: descricoes,
        finalUrl: input.url_final, path1: input.path1, path2: input.path2, status,
      })
      await logGadsAcao(sb, `criar_anuncio_rsa — ${conta.nome} (grupo ${input.ad_group_id}) · ${titulos.length} títulos, ${descricoes.length} descrições · ${status}`, input.motivo, result.erro)
      if (result.erro) return { sucesso: false, erro: result.erro }
      return { sucesso: true, acao: 'criar_anuncio_rsa', cliente: conta.nome, customer_id: conta.id, ...result }
    }
    if (name === 'buscar_pipeline_ghl')  return await callGhlApi({ action: 'pipeline',  cliente: input.cliente })
    if (name === 'buscar_leads_ghl')     return await callGhlApi({ action: 'leads',     cliente: input.cliente })
    if (name === 'status_conversas_ghl') return await callGhlApi({ action: 'conversas', cliente: input.cliente })
  } catch(e) { return { error: e.message } }
  return { error: 'Tool desconhecida' }
}

/* ── Markdown renderer ──────────────────────────────────── */
function MdText({ text, color }) {
  if (!text) return null
  const lines = text.split('\n')
  const els = []
  let listBuf = []

  function flushList() {
    if (!listBuf.length) return
    els.push(<ul key={`ul-${els.length}`} className="pl-4 space-y-0.5 my-1">{listBuf.map((li, i) => <li key={i} className="text-sm leading-relaxed list-disc">{li}</li>)}</ul>)
    listBuf = []
  }

  function inlineRender(s) {
    const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2,-2)}</strong>
      if (p.startsWith('*') && p.endsWith('*'))   return <em key={i}>{p.slice(1,-1)}</em>
      if (p.startsWith('`') && p.endsWith('`'))   return <code key={i} style={{background:'#f0fde4',color:'#166534',padding:'1px 5px',borderRadius:4,fontFamily:'monospace',fontSize:'0.85em'}}>{p.slice(1,-1)}</code>
      const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb',textDecoration:'underline'}}>{linkMatch[1]}</a>
      return p
    })
  }

  lines.forEach((line, i) => {
    if (/^#{1,3} /.test(line)) {
      flushList()
      const text = line.replace(/^#{1,3} /,'')
      els.push(<p key={i} className="text-xs font-extrabold text-text-2 uppercase tracking-wider mt-3 mb-1">{text}</p>)
    } else if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const content = line.replace(/^[-*] /,'').replace(/^\d+\. /, '')
      listBuf.push(inlineRender(content))
    } else if (line.trim() === '' || line.trim() === '---') {
      flushList()
      if (line.trim() === '---') els.push(<hr key={i} className="border-border my-2" />)
      else if (els.length) els.push(<br key={i} />)
    } else {
      flushList()
      els.push(<p key={i} className="text-sm leading-relaxed">{inlineRender(line)}</p>)
    }
  })
  flushList()
  return <div className="space-y-0.5">{els}</div>
}

/* ── Message bubble ─────────────────────────────────────── */
function MessageBubble({ msg, streaming, agentColor }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'
  const col = agentColor || '#be29ec'

  function copy() {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 flex-shrink-0"
        style={{ background: isUser ? '#6eda2c22' : col + '20' }}>
        {isUser
          ? <User size={13} className="text-accent" />
          : <Bot size={13} style={{ color: col }} />}
      </div>

      <div className={`max-w-[84%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Tool call indicator */}
        {msg.toolCalls?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {msg.toolCalls.map((t, i) => (
              <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                style={{ color: col, borderColor: col + '40', background: col + '10' }}>
                🔧 {t}
              </span>
            ))}
          </div>
        )}

        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-accent/12 text-text rounded-tr-sm'
            : msg.error
            ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
            : 'bg-white border border-border text-text rounded-tl-sm'
        }`}
          style={{ boxShadow: isUser ? 'none' : '0 2px 8px rgba(26,29,46,0.07)' }}>
          {/* Tool loading pill */}
          {msg.toolLoading && (
            <div className="flex items-center gap-2 mb-2">
              <motion.div className="w-3 h-3 rounded-full" style={{ background: col }}
                animate={{ scale:[1,1.4,1] }} transition={{ duration:0.8, repeat:Infinity }} />
              <span className="text-xs font-semibold" style={{ color: col }}>{msg.toolLoading}</span>
            </div>
          )}
          {isUser
            ? <p className="text-sm leading-relaxed">{msg.content}</p>
            : <MdText text={msg.content} />
          }
          {streaming && msg.streaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm" style={{ background: col }} />
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

/* ── API key banner ─────────────────────────────────────── */
function ApiKeyBanner({ onSave }) {
  const [key, setKey]   = useState('')
  const [show, setShow] = useState(false)

  function save() {
    if (!key.trim()) return
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
            Insira a chave da Anthropic para ativar os agentes de IA.
            A chave é salva localmente no navegador — use só em dispositivos da agência.
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
      <p className="text-[10px] text-muted mt-2">Obtenha em console.anthropic.com · claude-sonnet-4-6</p>
    </motion.div>
  )
}

/* ── Team selector card ─────────────────────────────────── */
function AgentCard({ agent, active, onClick }) {
  const Icon = agent.icon
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl flex-shrink-0 transition-all border ${
        active
          ? 'border-transparent text-white'
          : 'bg-white border-border hover:border-opacity-60'
      }`}
      style={active ? { backgroundColor: agent.color, boxShadow: `0 4px 12px ${agent.color}40` } : {}}
    >
      <Icon size={16} style={{ color: active ? 'white' : agent.color }} />
      <span className={`text-[11px] font-bold whitespace-nowrap ${active ? 'text-white' : 'text-text'}`}>
        {agent.label}
      </span>
    </motion.button>
  )
}

/* ── Main component ─────────────────────────────────────── */
export default function Assistant() {
  const data = useData()
  const { erpClients } = data

  const [apiKey, setApiKey]               = useState(() =>
    import.meta.env.VITE_CLAUDE_API_KEY ||
    localStorage.getItem('claudeApiKey') || ''
  )
  const [role, setRole]                   = useState('gestor-trafego')
  const [level, setLevel]                 = useState('operacional')
  const [messages, setMessages]           = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const [input, setInput]                 = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [isStreaming, setIsStreaming]     = useState(false)
  const [showClientDrop, setShowClientDrop] = useState(false)
  const [showKeyEdit, setShowKeyEdit]     = useState(false)
  const [dailyLimit, setDailyLimit]       = useState(10)
  const [todayUsage, setTodayUsage]       = useState(0)
  const [isAdmin, setIsAdmin]             = useState(false)
  const [limitReached, setLimitReached]   = useState(false)
  const bottomRef          = useRef(null)
  const inputRef           = useRef(null)
  const abortRef           = useRef(null)
  // Refs estáveis para acesso no cleanup (unmount) sem closures stale
  const convHistoryRef     = useRef([])
  const selectedClientRef  = useRef(selectedClient)
  const roleRef            = useRef(role)
  const levelRef           = useRef(level)
  const convSavedRef       = useRef(false)

  const currentRole  = ROLES.find(r => r.id === role)
  const currentLevel = LEVELS.find(l => l.id === level)
  const actions      = ACTIONS[role]?.[level] ?? []
  const selectedClientObj = erpClients.find(c => c.id === selectedClient)

  // Mantém refs sincronizados para uso seguro no cleanup
  useEffect(() => { convHistoryRef.current    = conversationHistory }, [conversationHistory])
  useEffect(() => { selectedClientRef.current = selectedClient },      [selectedClient])
  useEffect(() => { roleRef.current           = role },                 [role])
  useEffect(() => { levelRef.current          = level },                [level])

  // Salva conversa e extrai insights ao desmontar (navegar para outra página)
  useEffect(() => {
    return () => {
      const hist = convHistoryRef.current
      if (hist.length >= 2 && !convSavedRef.current) {
        saveAndExtract(hist, selectedClientRef.current, roleRef.current, levelRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const prefill = localStorage.getItem('assistantPrefill')
    if (prefill) { localStorage.removeItem('assistantPrefill'); setInput(prefill) }
  }, [])

  // Carrega config compartilhada + uso do dia + verifica admin
  useEffect(() => {
    if (!supabaseReady) return
    async function init() {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      if (!user) return

      const admin = user.email === 'gabrielsschollmeier@gmail.com'
      setIsAdmin(admin)

      // Prioridade: env var > ai_config (Supabase) > localStorage
      let limit = 10
      const envKey = import.meta.env.VITE_CLAUDE_API_KEY
      if (envKey) {
        setApiKey(envKey)
      } else {
        const { data: cfg } = await supabase.from('ai_config').select('api_key,daily_limit').eq('id', 1).single()
        if (cfg) {
          limit = cfg.daily_limit ?? 10
          setDailyLimit(cfg.daily_limit ?? 10)
          if (cfg.api_key) {
            localStorage.setItem('claudeApiKey', cfg.api_key)
            setApiKey(cfg.api_key)
          }
        }
      }

      // Carrega uso de hoje
      const today = new Date().toISOString().split('T')[0]
      const { data: usage } = await supabase
        .from('ai_usage')
        .select('count')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single()
      const count = usage?.count ?? 0
      setTodayUsage(count)
      setLimitReached(!admin && count >= limit)
    }
    init()
  }, [])

  async function persistKey(k) {
    localStorage.setItem('claudeApiKey', k)
    setApiKey(k)
    if (supabaseReady) {
      // Admin salva na config compartilhada
      if (isAdmin) {
        await supabase.from('ai_config').upsert({ id: 1, api_key: k, daily_limit: dailyLimit, enabled: true, updated_at: new Date().toISOString() })
      } else {
        await supabase.auth.updateUser({ data: { claudeApiKey: k } })
      }
    }
  }

  async function incrementUsage() {
    if (!supabaseReady) return
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData?.user?.id
    if (!userId) return
    const today = new Date().toISOString().split('T')[0]
    const newCount = todayUsage + 1
    setTodayUsage(newCount)
    if (!isAdmin && newCount >= dailyLimit) setLimitReached(true)
    await supabase.from('ai_usage').upsert(
      { user_id: userId, usage_date: today, count: newCount },
      { onConflict: 'user_id,usage_date' }
    )
  }

  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  async function callClaude(userText) {
    if (!isAdmin && limitReached) return

    const systemPrompt = buildSystemPrompt(role, level, selectedClient, data)
    const streamId = 'streaming'
    const userMsg  = { id: Date.now(), role: 'user', content: userText, time: now() }
    const assistMsg = { id: streamId, role: 'assistant', content: '', time: now(), streaming: true, toolCalls: [] }
    setMessages(prev => [...prev, userMsg, assistMsg])

    let history = [...conversationHistory, { role: 'user', content: userText }]
    setConversationHistory(history)
    setIsStreaming(true)

    // A chave da Claude fica no servidor (/api/ton) — o navegador nunca a vê.
    const headers = { 'content-type': 'application/json' }

    try {
      let toolCallNames = []
      let MAX_ITER = 5

      // ── Tool use loop (sem stream) ──────────────────────
      while (MAX_ITER-- > 0) {
        const resp = await fetch('/api/ton', {
          method: 'POST',
          headers,
          body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2048, system: systemPrompt, tools: ASSISTANT_TOOLS, messages: history }),
        })
        if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e?.error?.message || `HTTP ${resp.status}`) }
        const json = await resp.json()

        if (json.stop_reason !== 'tool_use') break // sai do loop → vai para streaming final

        // Executa tools
        const toolUseBlocks = json.content.filter(b => b.type === 'tool_use')
        history = [...history, { role: 'assistant', content: json.content }]

        const toolLabels = {
          info_cliente:'📋 Consultando cliente...', listar_leads:'👥 Buscando leads...',
          tarefas_pendentes:'📦 Verificando tarefas...', pipeline_stats:'📊 Calculando pipeline...',
          google_ads_conta:'🎯 Buscando conta Google Ads...',
          buscar_performance_google:'📈 Buscando performance Google Ads...',
          buscar_performance_carteira_google:'📊 Carregando carteira Google Ads...',
          listar_campanhas_google:'🗂️ Listando campanhas...',
          termos_pesquisa_google:'🔍 Lendo termos de pesquisa...',
          listar_grupos_google:'📁 Listando grupos de anúncios...',
          executar_acao_google:'⚡ Executando ação no Google Ads...',
          criar_campanha_google:'🏗️ Criando campanha no Google Ads...',
          adicionar_keywords_google:'🔑 Adicionando palavras-chave...',
          criar_anuncio_rsa_google:'✍️ Criando anúncio RSA...',
          buscar_pipeline_ghl:'💰 Buscando funil de vendas (GHL)...',
          buscar_leads_ghl:'🧲 Buscando leads (GHL)...',
          status_conversas_ghl:'💬 Verificando conversas (GHL)...',
        }
        for (const block of toolUseBlocks) {
          toolCallNames.push(block.name)
          setMessages(prev => prev.map(m => m.id === streamId ? { ...m, toolLoading: toolLabels[block.name] || '🔧 Consultando...', toolCalls: toolCallNames } : m))
          const result = await runTool(block.name, block.input, data)
          history = [...history, { role: 'user', content: [{ type:'tool_result', tool_use_id: block.id, content: JSON.stringify(result) }] }]
        }
        setMessages(prev => prev.map(m => m.id === streamId ? { ...m, toolLoading: null } : m))
      }

      // ── Streaming da resposta final ────────────────────
      const streamRes = await fetch('/api/ton', {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2048, stream: true, system: systemPrompt, messages: history }),
      })
      if (!streamRes.ok) { const e = await streamRes.json().catch(()=>({})); throw new Error(e?.error?.message || `HTTP ${streamRes.status}`) }

      const reader  = streamRes.body.getReader()
      const decoder = new TextDecoder()
      let fullText  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue
          try {
            const parsed = JSON.parse(raw)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text
              setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: fullText, toolCalls: toolCallNames } : m))
            }
          } catch {}
        }
      }

      setMessages(prev => prev.map(m => m.id === streamId ? { ...m, id: Date.now()+1, streaming: false, toolCalls: toolCallNames } : m))
      setConversationHistory(prev => [...prev, { role: 'assistant', content: fullText }])
      await incrementUsage()

    } catch (err) {
      setMessages(prev => prev.map(m => m.id === streamId
        ? { ...m, id: Date.now(), content: err.name === 'AbortError' ? (m.content || '(interrompido)') : `Erro: ${err.message}`, streaming: false, error: err.name !== 'AbortError' }
        : m))
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

  function stop() { abortRef.current?.abort() }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function runQuickAction(action) {
    let prompt = action.prompt
    if (selectedClientObj) {
      prompt = prompt
        .replace(/\[CLIENTE\]/g, selectedClientObj.name)
        .replace(/\[NICHO\]/g, selectedClientObj.niche || 'geral')
    }
    setInput(prompt)
    inputRef.current?.focus()
  }

  // ── TON Learning: salva conversa e extrai insights em background ──
  async function saveAndExtract(history, clientId, roleName, levelName) {
    if (!supabaseReady || history.length < 2) return
    if (convSavedRef.current) return
    convSavedRef.current = true
    const userId = (() => { try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}').id } catch { return null } })()
    let convId = null
    try {
      const { data } = await supabase.from('ton_conversations').insert({
        user_id: userId, client_id: clientId || null,
        role: roleName, level: levelName,
        messages: history,
      }).select('id').single()
      convId = data?.id
    } catch (err) {
      console.warn('[TON] erro ao salvar conversa:', err?.message)
      return
    }
    if (convId) extractInsights(history, convId, clientId)
  }

  async function extractInsights(history, convId, clientId) {
    const convText = history
      .map(m => `${m.role === 'user' ? 'Usuário' : 'TON'}: ${typeof m.content === 'string' ? m.content : '(tool use)'}`)
      .join('\n\n')
      .slice(0, 3000)
    try {
      const resp = await fetch('/api/ton', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: 'Você extrai insights de conversas de marketing digital. Responda APENAS com JSON válido, sem texto extra.',
          messages: [{
            role: 'user',
            content: `Analise esta conversa e extraia até 3 insights úteis.\n\nRetorne JSON:\n{"insights":[{"category":"estrategia|duvida_comum|ideia|decisao|problema_cliente","insight":"frase curta descrevendo o insight","tags":["tag1","tag2"],"importance":1}]}\n\nCategoria importance: 1=baixo 5=crítico. Extraia apenas insights genuinamente úteis para a agência.\n\nConversa:\n${convText}`,
          }],
        }),
      })
      if (!resp.ok) return
      const json = await resp.json()
      const raw  = json.content?.[0]?.text?.trim() || ''
      const parsed = JSON.parse(raw)
      const insights = Array.isArray(parsed?.insights) ? parsed.insights : []
      if (!insights.length) return
      await supabase.from('ton_insights').insert(
        insights.map(ins => ({
          conversation_id: convId,
          category:        ins.category || 'ideia',
          insight:         ins.insight  || '',
          tags:            Array.isArray(ins.tags) ? ins.tags : [],
          client_id:       clientId || null,
          importance:      Number(ins.importance) || 3,
        })).filter(i => i.insight)
      )
      await supabase.from('ton_conversations').update({ insights_extracted: true }).eq('id', convId)
    } catch (err) {
      console.warn('[TON] extração de insights falhou:', err?.message)
    }
  }

  function switchAgent(newRole) {
    if (conversationHistory.length >= 2 && !convSavedRef.current) {
      saveAndExtract(conversationHistory, selectedClient, role, level)
    }
    setRole(newRole)
    setMessages([])
    setConversationHistory([])
    convSavedRef.current = false
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
              {currentRole && <currentRole.icon size={16} className="text-white" />}
            </div>
            <div>
              <h1 className="text-sm font-bold text-text leading-tight">{currentRole?.fullLabel}</h1>
              <p className="text-[11px] text-muted">{currentLevel?.label} · {currentRole?.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Contador de uso diário */}
            {!isAdmin && (
              <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${
                limitReached ? 'bg-red-50 text-red-500' : todayUsage >= dailyLimit * 0.7 ? 'bg-amber-50 text-amber-600' : 'bg-accent/10 text-accent'
              }`}>
                <Zap size={10} />
                {limitReached ? 'Limite atingido' : `${todayUsage}/${dailyLimit} hoje`}
              </div>
            )}

            {/* Admin: botão de API (só se não vier de env var) */}
            {isAdmin && !import.meta.env.VITE_CLAUDE_API_KEY && (
              <button
                onClick={() => setShowKeyEdit(v => !v)}
                className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  apiKey ? 'text-accent bg-accent/10 hover:bg-accent/15' : 'text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/15'
                }`}
              >
                <Key size={10} />
                {apiKey ? 'API ativa' : 'Configurar API'}
              </button>
            )}

            {messages.length > 0 && (
              <button onClick={() => { setMessages([]); setConversationHistory([]) }}
                className="text-[11px] text-muted hover:text-text-2 px-2.5 py-1.5 rounded-lg hover:bg-border/40 transition-colors">
                Limpar
              </button>
            )}

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

        {/* API key edit */}
        <AnimatePresence>
          {showKeyEdit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="password" id="apiKeyInline" defaultValue={apiKey}
                    placeholder="sk-ant-api03-..."
                    className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-xs font-mono text-text focus:outline-none focus:border-[#be29ec]/50"
                  />
                  <button onClick={() => setShowKeyEdit(false)} className="p-2 text-muted hover:text-text-2">
                    <X size={14} />
                  </button>
                </div>
                {/* Botão explícito para salvar na equipe (sempre funciona, independente de timing) */}
                <button
                  onClick={async () => {
                    const val = document.getElementById('apiKeyInline').value.trim()
                    if (!val) return
                    localStorage.setItem('claudeApiKey', val)
                    setApiKey(val)
                    if (supabaseReady) {
                      await supabase.from('ai_config')
                        .upsert({ id: 1, api_key: val, daily_limit: dailyLimit, enabled: true, updated_at: new Date().toISOString() })
                    }
                    setShowKeyEdit(false)
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(90deg,#6eda2c,#4ab81e)' }}
                >
                  <Zap size={11} /> Salvar chave para toda a equipe
                </button>
                <p className="text-[10px] text-muted text-center">
                  A chave ficará salva no Supabase e todos os colaboradores usarão automaticamente
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isAdmin && !apiKey && !import.meta.env.VITE_CLAUDE_API_KEY && (
        <ApiKeyBanner onSave={k => { persistKey(k); setShowKeyEdit(false) }} />
      )}

      {/* ── Seletor de agentes ── */}
      <div className="px-4 lg:px-8 py-3 bg-bg/60 border-b border-border/50 flex-shrink-0 space-y-2.5">
        {/* Time */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {ROLES.map(r => (
            <AgentCard key={r.id} agent={r} active={role === r.id} onClick={() => switchAgent(r.id)} />
          ))}
        </div>

        {/* Nível */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex-shrink-0">Nível:</span>
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
              style={{
                backgroundColor: level === l.id ? l.color + '18' : 'transparent',
                color: level === l.id ? l.color : '#8890b5',
                border: `1px solid ${level === l.id ? l.color + '40' : 'transparent'}`,
              }}>
              {l.label} <span className="opacity-60">· {l.sub}</span>
            </button>
          ))}
        </div>

        {/* Smart actions (data-driven com cliente selecionado) */}
        {selectedClient && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap self-center flex-shrink-0">Smart:</span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => send(buildCrmAnalysisPrompt(selectedClient, data))}
              disabled={isStreaming || !apiKey}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#60a5fa]/15 text-[#60a5fa] border border-[#60a5fa]/25 hover:bg-[#60a5fa]/25 transition-all disabled:opacity-50">
              <Activity size={10} /> Analisar — {selectedClientObj?.name}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => send(buildMeetingAgendaPrompt(selectedClient, data))}
              disabled={isStreaming || !apiKey}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#ea8a29]/15 text-[#ea8a29] border border-[#ea8a29]/25 hover:bg-[#ea8a29]/25 transition-all disabled:opacity-50">
              <Calendar size={10} /> Pauta de reunião — {selectedClientObj?.name}
            </motion.button>
            {Object.keys(GADS_MAP).some(k => selectedClientObj?.name?.toLowerCase().includes(k) || k.includes(selectedClientObj?.name?.toLowerCase().split(' ')[0] || '_')) && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => send(`Busque a performance Google Ads de ${selectedClientObj.name} nos últimos 30 dias. Analise os resultados por campanha, compare com a meta de CPL e sugira ações de otimização.`)}
                disabled={isStreaming || !apiKey}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#6eda2c]/15 text-[#4ab81e] border border-[#6eda2c]/25 hover:bg-[#6eda2c]/25 transition-all disabled:opacity-50">
                <TrendingUp size={10} /> Google Ads — {selectedClientObj?.name}
              </motion.button>
            )}
          </div>
        )}
        {!selectedClient && role === 'gestor-trafego' && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap self-center flex-shrink-0">Google Ads:</span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => send('Busque a performance de toda a carteira Google Ads nos últimos 7 dias. Para cada conta: gasto, conversões, CPL. Destaque quem está acima e abaixo da meta e sugira as 3 ações prioritárias.')}
              disabled={isStreaming || !apiKey}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-[#6eda2c]/15 text-[#4ab81e] border border-[#6eda2c]/25 hover:bg-[#6eda2c]/25 transition-all disabled:opacity-50">
              <BarChart2 size={10} /> Briefing carteira (7 dias)
            </motion.button>
          </div>
        )}

        {/* Quick actions do agente */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap self-center flex-shrink-0">Ações:</span>
          {actions.map(action => (
            <motion.button key={action.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => runQuickAction(action)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 bg-white border border-border text-muted hover:text-text-2 hover:border-opacity-60 transition-all">
              <action.icon size={10} style={{ color: currentRole?.color }} />
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Mensagens ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-5">
        {messages.length === 0 && apiKey && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center py-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `linear-gradient(135deg, ${currentRole?.color}25, #be29ec20)` }}>
              {currentRole && <currentRole.icon size={22} style={{ color: currentRole?.color }} />}
            </div>
            <h2 className="text-base font-bold text-text mb-1">{currentRole?.fullLabel}</h2>
            <p className="text-xs text-muted leading-relaxed mb-2">{currentRole?.desc}</p>
            <p className="text-xs text-muted leading-relaxed mb-5">
              {selectedClientObj
                ? `Contexto: ${selectedClientObj.name}. Use as ações acima ou escreva livremente.`
                : 'Use as ações rápidas acima ou escreva diretamente.'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {actions.slice(0, 4).map(action => (
                <button key={action.id} onClick={() => runQuickAction(action)}
                  className="p-2.5 rounded-xl border border-border hover:border-opacity-60 bg-white text-left transition-all">
                  <div className="flex items-center gap-2 mb-0.5">
                    <action.icon size={11} style={{ color: currentRole?.color }} />
                    <p className="text-[11px] font-bold text-text">{action.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} streaming={isStreaming} agentColor={currentRole?.color} />
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
            disabled={isStreaming || !apiKey || limitReached}
            placeholder={
              limitReached
                ? `Limite de ${dailyLimit} interações atingido hoje. Volta amanhã! ☀️`
                : !apiKey
                ? 'Configure a API key acima para começar...'
                : `${currentRole?.fullLabel} — o que você precisa?`
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
              disabled={!input.trim() || !apiKey || limitReached}
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all"
              style={{ backgroundColor: currentRole?.color }}>
              <Send size={15} />
            </motion.button>
          )}
        </div>
        <p className="text-[10px] text-muted mt-2">
          {isStreaming
            ? 'Gerando resposta... clique ■ para parar'
            : `${currentRole?.fullLabel} · ${currentLevel?.label} · Enter para enviar`}
        </p>
      </div>
    </div>
  )
}
