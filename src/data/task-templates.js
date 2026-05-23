/* ── Modelos padrão de atividades da agência TráfegOn ───────────
   Usados para criar tarefas recorrentes com um clique.
   Cada template tem: título, tipo, prioridade, nível, descrição,
   diasParaPrazo (quantidade de dias a partir de hoje para o dueDate)
─────────────────────────────────────────────────────────────── */

export const TASK_TEMPLATES = [
  /* ── Criação de Criativos ───────────────────────────────── */
  {
    id: 'tpl_criativo_feed',
    category: 'criativos',
    label: 'Criativos para Feed',
    title: 'Criativos feed — campanha do mês',
    type: 'criativo',
    priority: 'high',
    level: 'operacao',
    diasParaPrazo: 5,
    description: 'Criar 4 a 6 criativos para feed (1080x1080) com variações de copy. Incluir versão com e sem texto.',
  },
  {
    id: 'tpl_criativo_stories',
    category: 'criativos',
    label: 'Criativos para Stories',
    title: 'Criativos stories — campanha do mês',
    type: 'criativo',
    priority: 'medium',
    level: 'operacao',
    diasParaPrazo: 5,
    description: 'Criar 3 criativos para stories (1080x1920). Formato vertical com CTA animado.',
  },
  {
    id: 'tpl_criativo_video',
    category: 'criativos',
    label: 'Vídeo para Reels/TikTok',
    title: 'Video criativo — reels/tiktok',
    type: 'video',
    priority: 'medium',
    level: 'operacao',
    diasParaPrazo: 7,
    description: 'Editar video de 15 a 30s para reels/tiktok. Incluir legenda, trilha e CTA final.',
  },

  /* ── Gestão de Tráfego ──────────────────────────────────── */
  {
    id: 'tpl_trafego_setup',
    category: 'trafego',
    label: 'Setup Inicial de Campanha',
    title: 'Setup campanha — configuracao inicial',
    type: 'campanha',
    priority: 'high',
    level: 'marco',
    diasParaPrazo: 3,
    description: 'Criar estrutura de campanha: conta, pixel, publicos, conjuntos de anuncios e criativos iniciais. Validar rastreamento antes de ativar.',
  },
  {
    id: 'tpl_trafego_revisao',
    category: 'trafego',
    label: 'Revisão Semanal de Campanhas',
    title: 'Revisao semanal de campanhas',
    type: 'campanha',
    priority: 'medium',
    level: 'operacao',
    diasParaPrazo: 7,
    description: 'Analisar CPL, CTR, frequencia e ROAS. Pausar criativos saturados, ajustar lances e ampliar publicos com bom desempenho.',
  },
  {
    id: 'tpl_trafego_escala',
    category: 'trafego',
    label: 'Escala de Campanha',
    title: 'Escala — campanha com bom ROI',
    type: 'campanha',
    priority: 'high',
    level: 'operacao',
    diasParaPrazo: 3,
    description: 'Aumentar orcamento em 20-30% nos conjuntos com CPL abaixo da meta. Duplicar conjuntos de alto desempenho para novos publicos.',
  },
  {
    id: 'tpl_trafego_relatorio',
    category: 'trafego',
    label: 'Relatorio Mensal de Performance',
    title: 'Relatorio mensal de performance',
    type: 'criativo',
    priority: 'medium',
    level: 'marco',
    diasParaPrazo: 30,
    description: 'Compilar metricas do mes: investimento, impressoes, cliques, leads, CPL, ROAS. Incluir analise e recomendacoes para o proximo mes.',
  },

  /* ── Landing Pages ──────────────────────────────────────── */
  {
    id: 'tpl_lp_nova',
    category: 'lp',
    label: 'Criar Nova Landing Page',
    title: 'Criar landing page para campanha',
    type: 'lp',
    priority: 'high',
    level: 'marco',
    diasParaPrazo: 10,
    description: 'Desenvolver LP responsiva com: headline, problema, solucao, prova social, CTA. Integrar com pixel e formulario de leads.',
  },
  {
    id: 'tpl_lp_otimizacao',
    category: 'lp',
    label: 'Otimizacao de LP Existente',
    title: 'Otimizacao de landing page — CRO',
    type: 'lp',
    priority: 'medium',
    level: 'operacao',
    diasParaPrazo: 7,
    description: 'Analisar heatmap e taxa de conversao da LP atual. Testar variacoes de headline, CTA e prova social para melhorar CR.',
  },

  /* ── Copy ───────────────────────────────────────────────── */
  {
    id: 'tpl_copy_ads',
    category: 'copy',
    label: 'Copy para Anuncios',
    title: 'Copy para anuncios — feed e stories',
    type: 'copy',
    priority: 'medium',
    level: 'operacao',
    diasParaPrazo: 3,
    description: 'Escrever 3 variações de copy para cada formato. Testar abordagens: dor, ganho e medo. Incluir emojis e CTA claro.',
  },
  {
    id: 'tpl_copy_email',
    category: 'copy',
    label: 'Copy para E-mail Marketing',
    title: 'Copy email marketing — sequencia',
    type: 'copy',
    priority: 'low',
    level: 'interno',
    diasParaPrazo: 14,
    description: 'Criar sequencia de 3 emails: (1) boas-vindas, (2) valor/conteudo, (3) oferta/CTA. Assunto A/B para abertura.',
  },

  /* ── Reuniões ───────────────────────────────────────────── */
  {
    id: 'tpl_reuniao_onboarding',
    category: 'reunioes',
    label: 'Reuniao de Onboarding',
    title: 'Reuniao de onboarding — novo cliente',
    type: 'reuniao',
    priority: 'high',
    level: 'marco',
    diasParaPrazo: 3,
    description: 'Apresentar equipe, metodologia e cronograma. Coletar briefing completo, acessos e materiais. Definir metas e KPIs do projeto.',
  },
  {
    id: 'tpl_reuniao_mensal',
    category: 'reunioes',
    label: 'Reuniao Mensal de Resultados',
    title: 'Reuniao mensal de resultados',
    type: 'reuniao',
    priority: 'medium',
    level: 'marco',
    diasParaPrazo: 30,
    description: 'Apresentar relatorio mensal completo. Discutir resultados, aprendizados e estrategia para o proximo mes. Alinhar novos criativos e acoes.',
  },
  {
    id: 'tpl_reuniao_estrategia',
    category: 'reunioes',
    label: 'Reuniao de Estrategia Trimestral',
    title: 'Reuniao estrategia trimestral',
    type: 'reuniao',
    priority: 'high',
    level: 'marco',
    diasParaPrazo: 90,
    description: 'Revisao do trimestre: o que funcionou, o que nao funcionou. Planejamento estrategico para os proximos 3 meses. Apresentar novas oportunidades.',
  },
]

/* ── Agrupamentos por categoria ─────────────────────────────── */
export const TEMPLATE_CATEGORIES = [
  { id: 'criativos', label: 'Criativos', icon: '🎨', color: '#be29ec' },
  { id: 'trafego',   label: 'Trafego',   icon: '🚀', color: '#ea8a29' },
  { id: 'lp',        label: 'Landing Page', icon: '🌐', color: '#60a5fa' },
  { id: 'copy',      label: 'Copy',      icon: '✍️', color: '#6eda2c' },
  { id: 'reunioes',  label: 'Reunioes',  icon: '📅', color: '#8890b5' },
]

/* Helper — aplica datas relativas */
export function applyTemplateDefaults(template, overrides = {}) {
  const today = new Date()
  const due = new Date(today)
  due.setDate(due.getDate() + (template.diasParaPrazo || 7))
  const dueDate = due.toISOString().split('T')[0]
  return {
    title:       template.title,
    type:        template.type,
    priority:    template.priority,
    level:       template.level,
    description: template.description,
    dueDate,
    status:      'todo',
    ...overrides,
  }
}
