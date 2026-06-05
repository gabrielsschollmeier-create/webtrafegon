import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, Plus, Search, CheckCircle2, Clock, X, Users, ArrowLeft, ChevronRight, Lightbulb, AlertTriangle, List, Hash } from 'lucide-react'

const CATEGORIES = ['Todos', 'Treinamento', 'Tráfego Pago', 'Copy & Conteúdo', 'Negócios', 'Ferramentas', 'Vendas']

// ── Conteúdo estruturado para aulas de texto ──────────────────────────────────

const COMERCIAL_LESSONS = [
  {
    id: 1, title: 'Dashboard Comercial', duration: '4 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'O Dashboard Comercial é a tela inicial do módulo CRM. Ele concentra os principais indicadores de vendas e permite visualizar a saúde do negócio em tempo real.' },
      { type: 'heading', text: 'O que cada card mostra' },
      { type: 'table', rows: [
        ['Faturamento', 'Receita total fechada no período'],
        ['Novos Leads', 'Leads captados no mês corrente'],
        ['Deals Fechados', 'Contratos assinados no período'],
        ['Taxa de Conversão', '% de leads que viraram clientes'],
        ['MRR (Client Health)', 'Receita recorrente mensal + clientes ativos e em risco'],
        ['Pipeline Summary', 'Faturamento único, MRR adquirido e valor em negociação'],
        ['Goals', 'Meta diária de novos contatos e meta semanal de deals'],
      ]},
      { type: 'tip', text: 'O card "Nível" no dashboard é o seu progresso na gamificação — mostra seus ons acumulados, faixa atual e streak semanal.' },
    ],
  },
  {
    id: 2, title: 'Pipeline de Leads — do contato ao fechamento', duration: '6 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'O Pipeline organiza todos os leads em estágios de negociação. Arraste os cards para avançar a jornada de cada lead.' },
      { type: 'heading', text: 'Como criar um novo lead' },
      { type: 'steps', items: [
        'Clique em "+ Novo Lead" no topo do Pipeline',
        'Preencha: nome, telefone, e-mail, origem e valor estimado',
        'Defina o tipo de contrato: Único ou Recorrente (MRR)',
        'Atribua um responsável (assignee)',
        'Salve — o lead aparece na primeira coluna do kanban',
      ]},
      { type: 'heading', text: 'Qualidade do lead' },
      { type: 'list', items: [
        '🔥 Quente — respondeu rápido, alto interesse, perfil ideal',
        '🌡️ Morno — interesse moderado, aguardando retorno',
        '❄️ Frio — pouco engajamento, precisa de mais aquecimento',
      ]},
      { type: 'heading', text: 'Movendo entre estágios' },
      { type: 'para', text: 'Arraste o card ou use o menu na ficha do lead. Ao marcar como Ganho, o workspace do cliente é criado automaticamente no módulo Operacional.' },
      { type: 'warn', text: 'Leads marcados como Perdido devem ter um motivo registrado nas notas — isso alimenta os relatórios de objeções.' },
    ],
  },
  {
    id: 3, title: 'Contatos — gerenciando sua base', duration: '5 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'A página de Contatos lista todos os leads com filtros avançados para localizar, editar e acionar qualquer pessoa da base.' },
      { type: 'heading', text: 'Filtros disponíveis' },
      { type: 'list', items: [
        'Origem — onde o lead veio (Meta Ads, Google, Indicação, etc.)',
        'Assignee — responsável pelo lead',
        'Qualidade — 🔥 quente / 🌡️ morno / ❄️ frio',
        'Estágio — posição atual no pipeline',
      ]},
      { type: 'heading', text: 'O que fazer na ficha do contato' },
      { type: 'table', rows: [
        ['Adicionar tags', 'Digite e pressione Enter — serve para segmentar a base'],
        ['Notas', 'Registre informações relevantes da conversa'],
        ['WhatsApp', 'Botão verde abre conversa direto no WhatsApp'],
        ['Editar estágio', 'Muda o estágio sem precisar ir ao Pipeline'],
        ['Histórico', 'Veja todas as atividades registradas para esse lead'],
      ]},
      { type: 'tip', text: 'Para excluir vários contatos de uma vez, marque as checkboxes e use "Excluir selecionados" — útil para limpar leads inválidos.' },
    ],
  },
  {
    id: 4, title: 'Atividades e Calendário', duration: '4 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'Atividades são os próximos passos registrados para cada lead — ligações, reuniões e follow-ups. Elas aparecem no Dashboard como pendências do dia.' },
      { type: 'heading', text: 'Tipos de atividade' },
      { type: 'list', items: [
        'Ligação — para registrar chamadas planejadas ou realizadas',
        'Reunião — encontros presenciais ou por videochamada',
        'Follow-up — retornos agendados por WhatsApp ou e-mail',
      ]},
      { type: 'heading', text: 'Calendário' },
      { type: 'para', text: 'O Calendário consolida todas as atividades em uma visão mensal. Clique em um evento para ver os detalhes do lead associado.' },
      { type: 'tip', text: 'Atividades vencidas ficam marcadas em vermelho no Dashboard — resolva-as no início do dia antes de criar novas.' },
    ],
  },
  {
    id: 5, title: 'Conversas e WhatsApp', duration: '3 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'A seção Conversas centraliza o histórico de mensagens integrado ao WhatsApp Business da agência.' },
      { type: 'heading', text: 'Como funciona' },
      { type: 'steps', items: [
        'Leads enviados pelo WhatsApp aparecem automaticamente em Conversas',
        'Clique em uma conversa para ver o histórico completo',
        'Responda diretamente pela interface do hub',
        'A conversa fica vinculada ao contato no CRM',
      ]},
      { type: 'warn', text: 'A integração com WhatsApp precisa estar ativa em Configurações → Integrações. Fale com o admin se não aparecer mensagens.' },
    ],
  },
  {
    id: 6, title: 'Relatórios e metas', duration: '4 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'A seção Relatórios oferece gráficos e análises de performance comercial com filtros por período.' },
      { type: 'heading', text: 'O que analisar' },
      { type: 'table', rows: [
        ['Funil de aquisição', 'Quantos leads em cada etapa — onde estão as perdas'],
        ['Origem dos leads', 'Qual canal traz mais e melhores leads'],
        ['Taxa de conversão', 'Evolução ao longo do tempo'],
        ['MRR e faturamento', 'Crescimento da receita recorrente'],
        ['Atividades por colaborador', 'Quem está sendo mais ativo no CRM'],
      ]},
      { type: 'tip', text: 'Use o filtro de período para comparar meses — ideal para apresentações de resultado para a diretoria.' },
    ],
  },
]

const OPERACIONAL_LESSONS = [
  {
    id: 1, title: 'Dashboard Operacional', duration: '4 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'O Dashboard Operacional é a tela central do módulo ERP. Ele mostra o estado da produção da agência em tempo real.' },
      { type: 'heading', text: 'Cards de status' },
      { type: 'table', rows: [
        ['Em Andamento', 'Tarefas sendo produzidas agora'],
        ['Em Revisão', 'Aguardando aprovação interna ou do cliente'],
        ['Concluídas', 'Tarefas finalizadas no período'],
        ['Atrasadas', 'Tarefas com prazo vencido sem conclusão'],
      ]},
      { type: 'heading', text: 'Outros elementos' },
      { type: 'list', items: [
        'Tarefas urgentes — top 5 com prazo mais próximo',
        'Top colaboradores — ranking por ons no período',
        'Próximas reuniões — agenda da equipe',
        'Countdown Copa 2026 — motivacional 🏆',
      ]},
      { type: 'tip', text: 'Comece o dia pelo Dashboard Operacional para identificar o que está atrasado e o que precisa de aprovação.' },
    ],
  },
  {
    id: 2, title: 'Workspaces — painel de clientes', duration: '5 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'Cada cliente ativo tem um Workspace — um painel centralizado com seus dados, tarefas, MRR e histórico.' },
      { type: 'heading', text: 'Status de clientes' },
      { type: 'list', items: [
        '🟢 Ativo — cliente regular, tudo em dia',
        '🟠 Em risco — sinalização de problema (inadimplência, insatisfação, etc.)',
        '⚫ Inativo — contrato pausado ou encerrado',
      ]},
      { type: 'heading', text: 'Informações do workspace' },
      { type: 'table', rows: [
        ['MRR', 'Valor mensal recorrente do cliente'],
        ['Manager', 'Gestor responsável pelo cliente'],
        ['Nicho', 'Segmento de atuação'],
        ['Desde', 'Data de início do contrato'],
        ['Tarefas', 'Lista de todas as entregas do cliente'],
      ]},
      { type: 'warn', text: 'Marcar um cliente como "Em risco" gera notificação automática para o gerente responsável — use com critério.' },
    ],
  },
  {
    id: 3, title: 'Entregas — Kanban de Tarefas', duration: '6 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'O Kanban de Entregas é o coração da operação. Todas as tarefas da agência estão aqui organizadas em 5 colunas.' },
      { type: 'heading', text: 'As 5 colunas' },
      { type: 'table', rows: [
        ['A Fazer', 'Tarefa criada, ainda não iniciada'],
        ['Em Andamento', 'Produção em curso — alguém está trabalhando'],
        ['Em Revisão', 'Aguardando aprovação interna ou do cliente'],
        ['Aprovados', 'Aprovado, pronto para publicar ou entregar'],
        ['Concluído', 'Tarefa encerrada — ons creditados'],
      ]},
      { type: 'heading', text: 'Como navegar' },
      { type: 'steps', items: [
        'Arraste cards entre colunas para atualizar o status',
        'Clique no card para abrir os detalhes e editar',
        'Use os filtros (colaborador, data) para focar no que é seu',
        'Cards com borda vermelha estão atrasados — priorize',
      ]},
      { type: 'tip', text: 'Pressione Ctrl+K para buscar qualquer tarefa pelo nome sem precisar rolar o kanban.' },
    ],
  },
  {
    id: 4, title: 'Criando e atribuindo tarefas', duration: '5 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'Gerentes e admins criam tarefas. Colaboradores as recebem com notificação automática.' },
      { type: 'heading', text: 'Campos ao criar uma tarefa' },
      { type: 'table', rows: [
        ['Cliente', 'Workspace ao qual a tarefa pertence'],
        ['Tipo', 'Landing page, Criativo, Copy, Campanha, Vídeo, Reunião...'],
        ['Título', 'Nome claro da entrega (ex: "Criativo Stories Black Friday")'],
        ['Responsável', 'Quem vai executar — recebe notificação'],
        ['Co-responsáveis', 'Colaboradores secundários — também notificados'],
        ['Prazo', 'Data limite de conclusão'],
        ['Prioridade', 'Alta / Média / Baixa'],
        ['Descrição', 'Briefing, referências, observações'],
        ['Link do material', 'Link do Drive, Canva ou onde estará o arquivo'],
      ]},
      { type: 'heading', text: 'Atalho: templates de tarefa' },
      { type: 'para', text: 'Use os Templates de Tarefa para criar tarefas recorrentes com um clique — o botão fica no canto do kanban.' },
      { type: 'tip', text: 'Quanto mais detalhado o briefing na descrição, menos idas e vindas na aprovação. Preencha sempre.' },
    ],
  },
  {
    id: 5, title: 'Fluxo de revisão e aprovação', duration: '5 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'O fluxo de aprovação garante qualidade antes de qualquer entrega chegar ao cliente.' },
      { type: 'heading', text: 'Passo a passo do colaborador' },
      { type: 'steps', items: [
        'Produz o material e salva no Drive/Canva',
        'Abre a tarefa e cola o link no campo "Material"',
        'Arrasta o card para "Em Revisão"',
        'Gerente recebe notificação automática',
      ]},
      { type: 'heading', text: 'Passo a passo do gerente' },
      { type: 'steps', items: [
        'Abre a tarefa em "Em Revisão"',
        'Acessa o link do material',
        'Se aprovado: arrasta para "Aprovados"',
        'Se precisar ajuste: arrasta de volta para "Em Andamento" com comentário explicando o que corrigir',
      ]},
      { type: 'heading', text: 'Flags de aprovação' },
      { type: 'list', items: [
        'Aprovação interna — gerente aprovou internamente',
        'Aprovação cliente — cliente viu e aprovou',
        'Em revisão — marcador visual de atenção',
      ]},
      { type: 'warn', text: 'Nunca mova uma tarefa para "Concluído" sem o link do material preenchido — isso impede a rastreabilidade da entrega.' },
    ],
  },
  {
    id: 6, title: 'Equipe — rankings e gamificação', duration: '5 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'A página Equipe mostra o ranking de todos os colaboradores com base nos ons acumulados.' },
      { type: 'heading', text: 'O que é um "on"' },
      { type: 'para', text: 'Ons são os pontos da plataforma. Você ganha ons ao mover tarefas para "Concluído".' },
      { type: 'table', rows: [
        ['1 on', 'Rotina rápida — menos de 15 minutos'],
        ['2 ons', 'Execução média — 30 a 60 minutos'],
        ['3 ons', 'Entrega estratégica — mais de 1 hora'],
      ]},
      { type: 'heading', text: 'Multiplicadores' },
      { type: 'list', items: [
        '1.1× — semana com 7 ou mais tarefas concluídas',
        '1.2× — semana com 14 ou mais tarefas concluídas',
        'Bônus — tarefas de prioridade alta valem mais',
        'Streak — semanas consecutivas ativas mantêm o multiplicador',
      ]},
      { type: 'heading', text: 'Sistema de faixas' },
      { type: 'list', items: [
        '⬜ Branca — início (0 ons)',
        '🟦 Azul — 180 ons + 6 meses de casa',
        '🟣 Roxa — 600 ons + 18 meses',
        '🟫 Marrom — 1300 ons + 36 meses',
        '⬛ Preta — 2200 ons + 60 meses',
      ]},
      { type: 'tip', text: 'Cada faixa tem 4 graus internos. Acompanhe sua barra de progresso no card de Nível no Dashboard.' },
    ],
  },
  {
    id: 7, title: 'Playbooks — SOPs e processos', duration: '3 min', type: 'text', done: false,
    content: [
      { type: 'para', text: 'Playbooks são os procedimentos operacionais padrão (SOPs) da TráfegOn. Consulte antes de executar qualquer tipo de tarefa nova.' },
      { type: 'heading', text: 'Quando usar' },
      { type: 'list', items: [
        'Antes de criar um tipo de entrega que você nunca fez antes',
        'Para alinhar o padrão de qualidade esperado pela agência',
        'Para onboarding de novos colaboradores',
      ]},
      { type: 'heading', text: 'Como criar um playbook (admins)' },
      { type: 'steps', items: [
        'Acesse Playbooks no menu lateral',
        'Clique em "+ Novo Playbook"',
        'Dê um título claro e descreva o passo a passo',
        'Salve e compartilhe com a equipe',
      ]},
      { type: 'tip', text: 'Se um processo não está documentado, documente agora — o próximo colaborador vai agradecer.' },
    ],
  },
]

// ── Cursos ────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: 7,
    title: 'Módulo Comercial — Como Usar o CRM',
    category: 'Treinamento',
    instructor: 'TráfegOn',
    audience: 'equipe',
    duration: '26 min',
    lessons: COMERCIAL_LESSONS.length,
    level: 'Iniciante',
    description: 'Guia completo para usar o módulo CRM: dashboard, pipeline, leads, contatos, atividades e relatórios.',
    color: '#6eda2c',
    isTextCourse: true,
    videos: COMERCIAL_LESSONS,
  },
  {
    id: 8,
    title: 'Módulo Operacional — Como Usar o ERP',
    category: 'Treinamento',
    instructor: 'TráfegOn',
    audience: 'equipe',
    duration: '33 min',
    lessons: OPERACIONAL_LESSONS.length,
    level: 'Iniciante',
    description: 'Guia completo para usar o módulo Operacional: workspaces, kanban de entregas, tarefas, aprovações, equipe e playbooks.',
    color: '#60a5fa',
    isTextCourse: true,
    videos: OPERACIONAL_LESSONS,
  },
  {
    id: 1, title: 'Google Ads do Zero ao Avançado', category: 'Tráfego Pago',
    instructor: 'Gabriel S.', audience: 'equipe', duration: '4h 20min', lessons: 12, level: 'Iniciante',
    description: 'Aprenda a criar, otimizar e escalar campanhas no Google Ads com foco em resultados reais.',
    color: '#ea8a29',
    videos: [
      { id: 1, title: 'Introdução ao Google Ads', duration: '12:30', youtubeId: 'dQw4w9WgXcQ', done: true },
      { id: 2, title: 'Estrutura de Campanhas', duration: '18:45', youtubeId: 'dQw4w9WgXcQ', done: true },
      { id: 3, title: 'Palavras-chave e Match Types', duration: '22:10', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 4, title: 'Anúncios RSA de Alta Performance', duration: '15:20', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 2, title: 'Meta Ads: Estratégia e Escala', category: 'Tráfego Pago',
    instructor: 'Gabriel S.', audience: 'equipe', duration: '3h 10min', lessons: 9, level: 'Intermediário',
    description: 'Domine o ecossistema Meta Ads — Facebook e Instagram — e aprenda a escalar resultados.',
    color: '#4f6ef7',
    videos: [
      { id: 1, title: 'Pixel e Eventos de Conversão', duration: '20:00', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 2, title: 'Públicos: Custom, Lookalike e Interesses', duration: '25:15', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 3, title: 'Copywriting que Converte', category: 'Copy & Conteúdo',
    instructor: 'Ana M.', audience: 'ambos', duration: '2h 45min', lessons: 8, level: 'Iniciante',
    description: 'Aprenda os fundamentos do copy persuasivo aplicado a anúncios, landing pages e WhatsApp.',
    color: '#6eda2c',
    videos: [
      { id: 1, title: 'Os 5 Elementos do Copy Matador', duration: '18:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 4, title: 'Resultados para o Cliente: Como Apresentar', category: 'Negócios',
    instructor: 'Gabriel S.', audience: 'cliente', duration: '1h 30min', lessons: 5, level: 'Iniciante',
    description: 'Entenda como ler relatórios, interpretar métricas e tirar o máximo da sua parceria com a agência.',
    color: '#be29ec',
    videos: [
      { id: 1, title: 'Entendendo CPL, ROAS e ROI', duration: '15:00', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 2, title: 'Como Acompanhar Suas Campanhas', duration: '12:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 5, title: 'Canva para Marketing Digital', category: 'Ferramentas',
    instructor: 'João C.', audience: 'equipe', duration: '2h 00min', lessons: 7, level: 'Iniciante',
    description: 'Crie artes profissionais para redes sociais, anúncios e apresentações usando Canva.',
    color: '#22d3ee',
    videos: [
      { id: 1, title: 'Template de Stories que Converte', duration: '10:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 6, title: 'Técnicas de Fechamento no WhatsApp', category: 'Vendas',
    instructor: 'Gabriel S.', audience: 'equipe', duration: '1h 50min', lessons: 6, level: 'Intermediário',
    description: 'Scripts, gatilhos mentais e técnicas para fechar mais vendas diretamente pelo WhatsApp.',
    color: '#25d366',
    videos: [
      { id: 1, title: 'O Script de Abertura Perfeito', duration: '14:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
]

const audienceConfig = {
  equipe:  { label: 'Equipe',        color: '#6eda2c', icon: '👥' },
  cliente: { label: 'Para Clientes', color: '#60a5fa', icon: '🏢' },
  ambos:   { label: 'Todos',         color: '#be29ec', icon: '✨' },
}

const levelConfig = {
  Iniciante:    '#6eda2c',
  Intermediário: '#ea8a29',
  Avançado:     '#ef4444',
}

// ── Renderizador de blocos de conteúdo ───────────────────────────────────────

function ContentBlock({ block, i }) {
  switch (block.type) {
    case 'heading':
      return (
        <h4 key={i} className="text-sm font-bold text-text mt-5 mb-2 flex items-center gap-1.5">
          <Hash size={12} className="text-accent flex-shrink-0" /> {block.text}
        </h4>
      )
    case 'para':
      return <p key={i} className="text-sm text-muted leading-relaxed mb-3">{block.text}</p>
    case 'tip':
      return (
        <div key={i} className="flex gap-2.5 bg-accent/8 border-l-2 border-accent rounded-r-xl p-3 mb-3">
          <Lightbulb size={14} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text leading-relaxed">{block.text}</p>
        </div>
      )
    case 'warn':
      return (
        <div key={i} className="flex gap-2.5 bg-orange/8 border-l-2 border-orange rounded-r-xl p-3 mb-3">
          <AlertTriangle size={14} className="text-orange flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text leading-relaxed">{block.text}</p>
        </div>
      )
    case 'list':
      return (
        <ul key={i} className="mb-3 space-y-1.5 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-muted">
              <span className="text-accent text-xs mt-0.5 flex-shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol key={i} className="mb-3 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {j + 1}
              </span>
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div key={i} className="mb-3 rounded-xl overflow-hidden border border-border">
          <table className="w-full text-xs">
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-semibold text-text bg-bg w-2/5">{row[0]}</td>
                  <td className="px-3 py-2 text-muted">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

// ── Modal principal do curso ─────────────────────────────────────────────────

function CourseModal({ course, onClose }) {
  const [activeLesson, setActiveLesson] = useState(null)
  const done = course.videos.filter(v => v.done).length
  const pct = Math.round((done / course.videos.length) * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-start justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: course.color + '20' }}>
                <BookOpen size={18} style={{ color: course.color }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text">{course.title}</h2>
                <p className="text-xs text-muted">{course.instructor} · {course.lessons} aulas · {course.duration}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted hover:text-text-2 p-1 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            <AnimatePresence mode="wait">
              {activeLesson ? (
                /* ── Vista de conteúdo da aula ── */
                <motion.div
                  key="lesson"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-text-2 transition-colors mb-4"
                  >
                    <ArrowLeft size={12} /> Voltar para as aulas
                  </button>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: course.color + '20' }}>
                      <List size={13} style={{ color: course.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text">{activeLesson.title}</h3>
                      <p className="text-[10px] text-muted flex items-center gap-1">
                        <Clock size={9} /> {activeLesson.duration} de leitura
                      </p>
                    </div>
                  </div>
                  <div>
                    {activeLesson.content.map((block, i) => (
                      <ContentBlock key={i} block={block} i={i} />
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-border flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveLesson(null)}
                      className="text-sm font-bold px-4 py-2 rounded-xl transition-all"
                      style={{ backgroundColor: course.color + '20', color: course.color }}
                    >
                      Concluir aula ✓
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* ── Lista de aulas ── */
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  <p className="text-sm text-muted mb-4">{course.description}</p>

                  {/* Progress */}
                  {pct > 0 && (
                    <div className="mb-5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-text-2">{done}/{course.videos.length} aulas concluídas</span>
                        <span className="font-bold" style={{ color: course.color }}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}80)` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {course.videos.map((lesson, i) => {
                      const isText = lesson.type === 'text'
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => isText ? setActiveLesson(lesson) : window.open(`https://youtube.com/watch?v=${lesson.youtubeId}`, '_blank')}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition-colors group cursor-pointer"
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            lesson.done ? 'bg-accent/15' : 'bg-border'
                          }`}>
                            {lesson.done
                              ? <CheckCircle2 size={14} className="text-accent" />
                              : isText
                                ? <List size={12} className="text-muted group-hover:text-text-2" />
                                : <Play size={12} className="text-muted group-hover:text-text-2" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${lesson.done ? 'text-muted line-through' : 'text-text'}`}>
                              {i + 1}. {lesson.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted flex items-center gap-1">
                              <Clock size={10} /> {lesson.duration}
                            </span>
                            <ChevronRight size={13} className="text-muted group-hover:text-text-2 transition-colors" />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Card do curso ────────────────────────────────────────────────────────────

function CourseCard({ course, index }) {
  const [open, setOpen] = useState(false)
  const aud = audienceConfig[course.audience]
  const done = course.videos.filter(v => v.done).length
  const pct = Math.round((done / course.videos.length) * 100)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        onClick={() => setOpen(true)}
        className="bg-white border border-border rounded-2xl overflow-hidden cursor-pointer"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}60)` }} />
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: aud.color + '15', color: aud.color }}>
              {aud.icon} {aud.label}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: levelConfig[course.level] + '15', color: levelConfig[course.level] }}>
              {course.level}
            </span>
            {course.isTextCourse && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-border text-muted">
                Leitura
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-text mb-1 leading-snug">{course.title}</h3>
          <p className="text-xs text-muted mb-3 line-clamp-2">{course.description}</p>

          <div className="flex items-center gap-3 text-xs text-muted mb-3">
            <span className="flex items-center gap-1"><List size={10} /> {course.lessons} aulas</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
            <span className="flex items-center gap-1"><Users size={10} /> {course.instructor}</span>
          </div>

          {pct > 0 && (
            <div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color }} />
              </div>
              <p className="text-[10px] text-muted mt-1">{pct}% concluído</p>
            </div>
          )}
        </div>
      </motion.div>

      {open && <CourseModal course={course} onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function Educacao() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [audience, setAudience] = useState('todos')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = COURSES.filter(c => {
    const matchCat = category === 'Todos' || c.category === category
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase())
    const matchAud = audience === 'todos' || c.audience === audience || c.audience === 'ambos'
    return matchCat && matchSearch && matchAud
  })

  return (
    <div className="p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-text">Educação</h1>
            <p className="text-sm text-muted mt-0.5">Treinamentos e conteúdos para equipe e clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Plus size={14} /> Adicionar aula
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar cursos..."
              className="w-full bg-white border border-border rounded-xl pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <select
            value={audience} onChange={e => setAudience(e.target.value)}
            className="bg-white border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
          >
            <option value="todos">Para todos</option>
            <option value="equipe">Equipe interna</option>
            <option value="cliente">Para clientes</option>
          </select>
        </div>
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
              category === cat
                ? 'bg-accent text-[#15172a]'
                : 'bg-white border border-border text-muted hover:text-text-2'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Cursos disponíveis', value: COURSES.length, color: '#6eda2c' },
          { label: 'Para equipe',        value: COURSES.filter(c => c.audience !== 'cliente').length, color: '#60a5fa' },
          { label: 'Para clientes',      value: COURSES.filter(c => c.audience !== 'equipe').length, color: '#be29ec' },
          { label: 'Total de aulas',     value: COURSES.reduce((s, c) => s + c.lessons, 0), color: '#ea8a29' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white border border-border rounded-xl p-3 text-center"
          >
            <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[11px] text-muted mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">
          Nenhum curso encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}

      {/* Add course modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-text">Adicionar nova aula</h2>
                <button onClick={() => setShowAdd(false)} className="text-muted hover:text-text-2 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Título do curso', placeholder: 'Ex: Google Ads Avançado' },
                  { label: 'Link do YouTube', placeholder: 'https://youtube.com/watch?v=...' },
                  { label: 'Instrutor', placeholder: 'Ex: Gabriel S.' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-text-2 mb-1.5">{f.label}</label>
                    <input
                      placeholder={f.placeholder}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Categoria', options: ['Treinamento', 'Tráfego Pago', 'Copy & Conteúdo', 'Negócios', 'Ferramentas', 'Vendas'] },
                    { label: 'Para quem', options: ['Equipe', 'Clientes', 'Ambos'] },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-bold text-text-2 mb-1.5">{f.label}</label>
                      <select className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50">
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm text-muted border border-border rounded-xl py-2.5 font-semibold hover:bg-bg transition-colors">
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold rounded-xl py-2.5 transition-all"
                >
                  Adicionar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
