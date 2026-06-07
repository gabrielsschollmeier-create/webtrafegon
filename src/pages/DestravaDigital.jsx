import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap, TrendingUp, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react'

const GREEN  = '#6eda2c'
const DARK   = '#1a1d2e'
const DARKER = '#13151f'

// ─── SLIDE DATA ──────────────────────────────────────────────────────────────

const SHARED_SLIDES = [
  {
    type: 'list',
    title: 'O que preparamos para você',
    items: [
      'Campanha de tráfego pago ativa e configurada',
      'Público-alvo definido estrategicamente',
      'Criativos e anúncios aprovados',
      'Pixel e rastreamento instalados',
      'Suporte via WhatsApp incluído no plano',
    ],
  },
  {
    type: 'steps',
    title: 'Como vai funcionar hoje',
    items: [
      'Você vai ver tudo que foi feito para seu negócio',
      'Você vai entrar no gerenciador e navegar comigo',
      'Você vai aprender o que precisa checar todo dia',
    ],
  },
  {
    type: 'cycle',
    title: 'Por que seu anúncio funciona assim',
    subtitle: 'Seu cliente não compra na primeira vez que vê. Ele pesquisa, compara e decide — esse é o caminho normal.',
    cycle: ['Anúncio', 'Clique', 'Lead', 'Atendimento', 'Venda'],
    highlight: 'Nosso trabalho: gerar o lead.  Seu trabalho: atender rápido.',
  },
  {
    type: 'metrics',
    title: 'As 3 métricas que você precisa conhecer',
    metrics: [
      { label: 'Investimento', desc: 'Quanto foi gasto no período' },
      { label: 'Leads', desc: 'Pessoas que entraram em contato com você' },
      { label: 'CPL', desc: 'Custo por Lead = Investimento ÷ Leads' },
    ],
    note: 'Nos primeiros 30 dias o algoritmo aprende. Os resultados crescem com o tempo.',
  },
]

const ATIVACAO_SLIDES = [
  {
    type: 'cover',
    title: 'Destrava Digital',
    subtitle: 'Sua consultoria de onboarding no digital',
    badge: 'Meta Ads ou Google Ads · 1h30',
  },
  ...SHARED_SLIDES,
  {
    type: 'diagram',
    title: 'O que fizemos para você',
    diagram: ['Campanha', 'Conjunto de Anúncios', 'Anúncio'],
    items: [
      'Público definido com base no seu negócio e região',
      'Criativos com copy e visual estratégicos',
      'Rastreamento configurado para cada lead',
    ],
  },
  {
    type: 'practice',
    title: 'Agora vamos navegar juntos',
    action: 'Abra o Gerenciador agora',
    steps: [
      'Localize sua campanha ativa',
      'Encontre o conjunto de anúncios',
      'Veja seu anúncio e as métricas',
      'Confira onde chegam seus leads',
    ],
    note: 'Formulário de contato ou WhatsApp',
  },
  {
    type: 'rules',
    title: 'O que checar todo dia',
    dos: ['Campanha está ativa?', 'Quantos leads chegaram hoje?', 'Quanto foi gasto até agora?'],
    donts: ['Não mexa em público, orçamento ou criativos sem falar com a gente'],
    alert: 'Nos acione se: campanha pausou, leads zeraram ou verba acabou antes do prazo',
  },
  {
    type: 'grid',
    title: 'Suas demais entregas',
    cards: [
      { icon: '🌐', label: 'Landing Page', desc: 'Acesse e teste o formulário agora' },
      { icon: '📍', label: 'Google Meu Negócio', desc: 'Perfil otimizado e visível' },
      { icon: '📸', label: 'Instagram', desc: 'Perfil organizado e pronto' },
      { icon: '👤', label: 'Facebook', desc: 'Perfil organizado e pronto' },
    ],
  },
  {
    type: 'timeline',
    title: 'O que acontece agora',
    events: [
      { time: 'Hoje', desc: 'Você recebe o Guia de Gestão' },
      { time: '7 dias', desc: 'Primeiros leads chegando' },
      { time: '15 dias', desc: 'Primeira análise de resultados parciais' },
      { time: '30 dias', desc: 'Call de encerramento + balanço do mês' },
    ],
    note: 'Dúvida? Chame a gente antes de mexer em qualquer coisa.',
  },
  {
    type: 'plan_intro',
    title: 'Agora Começa a Segunda Parte',
    subtitle: 'A consultoria terminou — mas o suporte está ativo. É aqui que a maioria das pessoas trava.',
    points: [
      { icon: '✅', text: 'Campanha está no ar' },
      { icon: '📋', text: 'Você tem um plano de 15 dias' },
      { icon: '🎯', text: 'Cinco missões com prazo e entregável' },
      { icon: '⏱️', text: 'Suporte ativo até o dia 15' },
    ],
    alert: 'Os primeiros 15 dias definem o ritmo. Quem não age nesse período paga por cliques sem saber o que está acontecendo.',
  },
  {
    type: 'missions_overview',
    title: 'Plano de Execução — 15 dias',
    subtitle: 'Cinco missões para sair do zero e entrar no ritmo',
    note: 'O objetivo não é venda — é entender o que está chegando, responder rápido e aprender a ler os números.',
    missions: [
      { day: 2,  icon: '📱', title: 'Primeira resposta documentada', evidence: 'Print das 5 conversas' },
      { day: 5,  icon: '📊', title: 'Primeiros números lidos',       evidence: 'Print do gerenciador' },
      { day: 8,  icon: '🎯', title: 'Qualidade do lead mapeada',     evidence: 'Lista com classificação' },
      { day: 12, icon: '🔍', title: 'Primeira limpeza do orçamento', evidence: 'Lista de termos/posicionamentos fracos' },
      { day: 15, icon: '🏁', title: 'Balanço da quinzena',           evidence: 'Texto antes da call' },
    ],
  },
  {
    type: 'mission',
    day: 2, number: 1, icon: '📱', deadline: 'Dia 2',
    title: 'Missão 1 — Primeira Resposta',
    instruction: 'Responda os 5 primeiros leads em até 20min após a chegada. Cronometra o tempo real de cada um e registra.',
    evidence: 'Print das 5 conversas com horário de chegada e horário de resposta visíveis.',
    why: 'Velocidade de resposta define se o lead vira consulta ou some. 20min é o limite — depois disso a chance de conversão cai drasticamente.',
    color: GREEN,
    deadline: 'Dia 5',
  },
  {
    type: 'mission',
    day: 5, number: 2, icon: '📊', deadline: 'Dia 5',
    title: 'Missão 2 — Primeiros Números',
    instruction: 'Acesse o gerenciador sozinho e registre: investimento total, impressões, cliques, leads e CPL. Compare o CPL real com o CPL limite que você calculou na consultoria.',
    evidence: 'Print do gerenciador com as métricas marcadas.',
    why: 'Quem não sabe ler o número fica dependente de terceiros para sempre. Esse é o hábito semanal que você vai carregar daqui pra frente.',
    color: '#60a5fa',
  },
  {
    type: 'mission',
    day: 8, number: 3, icon: '🎯', deadline: 'Dia 8',
    title: 'Missão 3 — Qualidade do Lead',
    instruction: 'Classifique cada lead recebido: quente, morno ou fora do perfil. Identifique o que os bons leads têm em comum — região, problema, urgência. Faça 1 follow-up em leads que não responderam após 48h.',
    evidence: 'Lista com classificação enviada no WhatsApp.',
    why: 'Sem esse filtro você vai otimizar para CPL baixo e fechar pouco. Qualidade de lead define qualidade de resultado.',
    color: '#a78bfa',
  },
  {
    type: 'mission',
    day: 12, number: 4, icon: '🔍', deadline: 'Dia 12',
    title: 'Missão 4 — Primeira Limpeza',
    instruction: 'Abra Termos de Pesquisa (Google) ou análise de posicionamento (Meta). Liste 5 buscas ou contextos que estão consumindo verba sem trazer o perfil certo.',
    evidence: 'Lista enviada — eu aplico os ajustes em até 24h.',
    why: 'Todo orçamento tem vazamento. Fechar esse vazamento nas primeiras semanas é o ajuste de maior impacto.',
    color: '#f59e0b',
  },
  {
    type: 'mission',
    day: 15, number: 5, icon: '🏁', deadline: 'Dia 15',
    title: 'Missão 5 — Balanço da Quinzena',
    instruction: 'Escreva: total de leads recebidos, perfil predominante dos que chegaram, principal dificuldade no atendimento. O que funcionou? O que não funcionou? O que quer testar?',
    evidence: 'Texto enviado antes da call de encerramento — sem ele, a call não acontece.',
    why: 'Quem faz o balanço por escrito entra na call com clareza. Quem não faz gasta metade do tempo relembrando o que aconteceu.',
    color: GREEN,
  },
  {
    type: 'clock',
    title: 'O Relógio Está Correndo',
    plan: '15 dias',
    warning: 'Cada missão não entregue é um dado que não coletamos. Sem dado, a call de encerramento não serve para nada.',
    actions: [
      'Missão não entregue no prazo = suporte daquele ponto não acontece',
      'Campanha pausada sem aviso = leads zerados sem motivo',
      'Suporte encerra no dia 15, independente de quanto foi usado',
    ],
    cta: 'Dúvida? Me chame agora — não depois do suporte acabar.',
  },
]

const ESTRUTURACAO_SLIDES = [
  // ─── BLOCO 1 — Abertura ───────────────────────────────────────────────────
  {
    type: 'cover',
    title: 'Destrava Digital',
    subtitle: 'Meta Ads + Google Ads · 2h30',
    badge: 'Estruturação / Aceleração',
  },
  {
    type: 'four_ps',
    title: 'Marketing é muito mais do que anúncios',
    subtitle: 'O cérebro estratégico define o jogo — os 4 P\'s são como ele age no mercado',
    brain: {
      icon: '🧠',
      label: 'Estratégia',
      desc: 'Define posicionamento, público, objetivos e como os 4 P\'s se conectam para gerar resultado consistente',
    },
    ps: [
      {
        icon: '🎁', label: 'Produto',
        desc: 'O que você entrega',
        items: ['Proposta de valor', 'Qualidade e diferencial', 'Experiência de entrega', 'Atendimento e pós-venda', 'Prova social / depoimentos'],
      },
      {
        icon: '💰', label: 'Preço',
        desc: 'Como você se posiciona',
        items: ['Posicionamento de preço', 'Condições de pagamento', 'Pacotes e combos', 'Ancoragem de valor', 'Garantias e risco zero'],
      },
      {
        icon: '📍', label: 'Praça',
        desc: 'Onde você opera',
        items: ['Loja física / presencial', 'Canal digital próprio', 'WhatsApp e direto', 'Marketplaces', 'Parceiros e revendedores', 'Eventos e feiras'],
      },
      {
        icon: '📢', label: 'Promoção',
        desc: 'Como você aparece',
        highlight: true,
        items: ['SEO e orgânico', 'Conteúdo e redes sociais', 'E-mail / CRM', 'Influência e PR', 'Tráfego pago', 'Mídia offline (TV, rádio)', 'Indicação e boca a boca'],
        highlightItem: 'Tráfego pago',
      },
    ],
    note: 'Dominar tráfego pago é o passo 1 — mas o negócio cresce quando os 4 P\'s trabalham juntos.',
  },
  {
    type: 'market_stats',
    title: 'O mercado onde você vai anunciar',
    subtitle: 'Brasil · 2024 — por que o digital não é mais opção, é onde a decisão de compra acontece',
    stats: [
      { platform: 'Instagram', value: '122 mi', label: 'usuários ativos no Brasil', color: '#be29ec', icon: '📸' },
      { platform: 'Facebook', value: '111 mi', label: 'usuários ativos no Brasil', color: '#1877f2', icon: '👥' },
      { platform: 'WhatsApp', value: '147 mi', label: 'brasileiros — 2° maior mercado do mundo', color: '#25d366', icon: '💬' },
      { platform: 'Google', value: '8,5 bi', label: 'buscas realizadas por dia no mundo', color: '#4285f4', icon: '🔍' },
    ],
    insights: [
      '76% dos consumidores pesquisam no Google antes de tomar uma decisão de compra',
      '180 milhões de brasileiros têm acesso à internet — mais da metade da população comprando online',
      'Brasileiro passa em média 9h por dia online — maior tempo do mundo entre países pesquisados',
      'Quem não aparece na busca ou no feed no momento certo, simplesmente não existe para esse cliente',
    ],
  },
  {
    type: 'steps',
    title: 'O que acontece hoje',
    items: [
      'A lógica dos anúncios',
      'Validar o que foi construído Google e Meta Ads',
      'Aprender a ler os principais indicadores e quando e como otimizar',
      'Seu guia operacional para os próximos 30 dias',
    ],
    duration: '2h30',
  },
  // ─── BLOCO 2 — Lógica ─────────────────────────────────────────────────────
  {
    type: 'metrics',
    title: 'Google vs Meta — lógicas opostas',
    metrics: [
      { label: 'Google = Intenção', desc: 'Captura quem já está procurando. O cliente digitou a busca — você aparece no momento certo.' },
      { label: 'Meta = Atenção', desc: 'Interrompe quem ainda não sabe que quer. Você cria o desejo/necessidade antes da busca existir.' },
      { label: 'Os dois juntos', desc: 'Captura quem está pronto agora + alcança e gera lembrança em quem ainda não está pronto.' },
    ],
    note: 'O poder está em saber usar ambos os canais dentro da sua estratégia.',
  },
  {
    type: 'funnel',
    title: 'O ciclo que fecha negócio',
    subtitle: 'Cada etapa filtra — só os mais qualificados chegam ao final',
    channels: [
      { icon: '🔍', name: 'Google Ads', color: '#4285f4', desc: 'captura intenção ativa' },
      { icon: '📸', name: 'Meta Ads', color: '#be29ec', desc: 'gera atenção e interrompe' },
    ],
    funnel: ['Anúncio', 'Visualização', 'Clique', 'Lead', 'Lead qualificado', 'Cliente'],
    continuous: 'Otimização contínua',
    leftZones: [
      { label: 'Gerar demanda', sub: 'Ambos os canais', steps: 3, color: '#60a5fa' },
      { label: 'Converter demanda', sub: 'Vendas', steps: 3, color: '#6eda2c' },
    ],
    highlight: 'Tráfego sem atendimento = verba jogada fora.\nAtendimento sem tráfego = sem volume para fechar.',
  },
  {
    type: 'list',
    title: 'Regras que governam as campanhas',
    items: [
      'O Google não ranqueia o anúncio mais caro — ranqueia o mais relevante para o usuário',
      'O criativo é o maior alavancador de resultado — a mesma verba com criativo melhor gera mais leads',
      'Segmentação ampla + criativo forte bate segmentação cirúrgica + criativo fraco',
      'Leads baratos e ruins custam mais caro que leads caros e qualificados — volume não é qualidade',
      'Teste de criativo não é opcional — é a única forma de saber o que funciona para o seu público',
      'R$20/dia constante bate R$40 intenso por poucos dias — o algoritmo precisa de sinal contínuo',
      'Mexer antes de ter dados suficientes é sabotar a própria campanha',
    ],
  },
  // ─── BLOCO 3 — Google Ads ─────────────────────────────────────────────────
  {
    type: 'google_intro',
    platform: '🔵 Google Ads',
    platformColor: '#4285f4',
    title: 'Como o Google Ads funciona',
    concept: 'Sistema de leilão em tempo real: toda busca dispara um leilão. Quem vence não é quem paga mais — é quem tem o anúncio mais relevante para aquela intenção.',
    networks: [
      { icon: '🔍', name: 'Rede de Pesquisa', desc: 'Aparece quando alguém busca ativamente — a maior intenção de compra existente' },
      { icon: '🖼️', name: 'Rede de Display', desc: 'Banners em milhões de sites e apps parceiros — ideal para remarketing e awareness' },
      { icon: '▶️', name: 'YouTube', desc: 'Anúncios em vídeo antes ou durante conteúdos — alcance massivo com segmentação' },
      { icon: '⚡', name: 'Performance Max', desc: 'Todos os canais em uma campanha — o algoritmo distribui onde gera mais resultado' },
    ],
    note: 'Para a maioria dos negócios de serviço e geração de lead: Rede de Pesquisa é o ponto de partida.',
  },
  {
    type: 'platform',
    platform: '🔵 Google Ads',
    platformColor: '#4285f4',
    title: 'Google Ads — estrutura que construímos',
    diagram: ['Conta', 'Campanha', 'Grupo de anúncios', 'Keywords + Anúncio'],
    items: [
      'Rede de Pesquisa: correspondência ampla, de frase e exata — cada uma com um papel diferente',
      'Negativos: a defesa do orçamento — palavras que bloqueiam buscas irrelevantes',
      'Anúncio RSA: Problema + Solução + Diferencial — você escreveu pelo menos um título',
      'Sitelinks e extensões: aumentam o CTR sem custo extra',
      'Pmax (se aplicável): não tocar antes de 14–21 dias — regra de ouro do algoritmo',
      'Rastreamento confirmado: sem conversão disparando, o algoritmo fica cego',
    ],
  },
  {
    type: 'practice',
    platform: '🔵 Google Ads',
    platformColor: '#4285f4',
    title: 'Vamos conhecer o Google Ads',
    action: 'Abra o Google Ads e localize cada parte',
    steps: [
      'Encontre a campanha que criamos e clique em Grupos de anúncios',
      'Abra o anúncio RSA e veja os títulos que você escreveu',
      'Veja as palavras-chave e identifique as correspondências de cada uma',
      'Abra Termos de pesquisa — é daqui que surgem os negativos toda semana',
      'Encontre o relatório de conversões e confirme que está disparando',
    ],
    note: 'Você precisa saber navegar sozinho — é o que vai fazer toda segunda-feira',
  },
  // ─── BLOCO 5 — Meta Ads ───────────────────────────────────────────────────
  {
    type: 'platform',
    platform: '🔵 Meta Ads',
    platformColor: '#1877f2',
    title: 'Meta Ads — estrutura que construímos',
    concept: 'Ninguém está procurando — você interrompe a rolagem com relevância',
    diagram: ['Campanha', 'Conjunto de anúncios', 'Anúncio'],
    items: [
      'Objetivo: geração de leads — a escolha errada desperdiça todo o orçamento',
      'Público: interesse + comportamento + localização — evitar público muito amplo no início',
      'Criativo: os primeiros 3 segundos prendem ou perdem o scroll — gancho antes do "ver mais"',
      'Estrutura de teste: variações para descobrir o que converte — não é um único anúncio',
      'Você publicou o anúncio — não apenas assistiu à criação',
    ],
  },
  {
    type: 'practice',
    platform: '🔵 Meta Ads',
    platformColor: '#1877f2',
    title: 'Navegue no Gerenciador de Anúncios',
    action: 'Abra o Meta Ads Manager e localize cada parte',
    steps: [
      'Encontre a campanha e o conjunto de anúncios que criamos',
      'Veja o público definido: região, interesse, faixa etária',
      'Abra o anúncio e veja onde o criativo e o texto aparecem',
      'Localize CPL, Frequência e CTR do link no relatório de métricas',
      'Confirme que o Pixel está registrando os eventos de conversão',
    ],
    note: 'Esses são os números que você vai acompanhar toda semana',
  },
  // ─── BLOCO 6 — Lendo os dados ─────────────────────────────────────────────
  {
    type: 'metrics',
    title: 'Métricas que importam vs vaidade',
    metrics: [
      { label: 'CPL', desc: 'Custo por lead — o número que decide se a campanha está dando retorno ou não. Definimos o seu CPL meta agora.' },
      { label: 'CTR', desc: 'Taxa de clique. Google <3% = título não chama. Meta <1% no link = criativo não para o scroll.' },
      { label: 'CPM', desc: 'Custo por mil impressões — indica o custo de chegar às pessoas. CPM alto com pouco clique = criativo não engaja ou público pequeno demais.' },
      { label: 'Frequência', desc: 'Meta: acima de 3–4 o público está saturando. Hora de trocar criativo ou expandir público.' },
    ],
    note: 'Impressões e alcance não pagam conta — CPL e conversão sim',
    obs: 'Com volume mínimo de dados (30–50 leads), vale começar a olhar o CPLQ — Custo por Lead Qualificado. É ele que conecta o tráfego com a realidade do seu processo de vendas.',
  },
  // ─── BLOCO 7 — CPL Limite ─────────────────────────────────────────────────
  {
    type: 'task',
    badge: '📋 Tarefa — faça a conta agora',
    title: 'CPL e CPV: os dois números que governam tudo',
    subtitle: 'O CPL (custo por lead) só faz sentido quando você sabe o CPV (custo por venda) que o seu negócio aguenta.',
    cpvNote: 'CPV é o indicador mestre — quanto você gasta para fechar 1 cliente. O CPL limite é consequência direta dele.',
    formula: [
      { label: 'Margem por cliente fechado (CPV máximo)', field: 'R$ ___' },
      { label: 'Leads necessários para fechar 1 cliente', field: '___ leads' },
    ],
    formulaResult: 'CPL limite = CPV ÷ leads para fechar',
    example: {
      items: [
        'Ticket R$3.000 · margem 50% = R$1.500 por cliente',
        'Fecha 1 a cada 20 leads',
        'CPV máximo: R$ 1.500',
        'CPL limite = R$1.500 ÷ 20',
      ],
      result: '→ CPL máximo aceitável: R$ 75',
    },
    quality: 'O que define um lead de qualidade para o seu negócio? Região, perfil, urgência do problema, capacidade de pagar? Esse filtro é o que transforma CPL em CPV real.',
  },
  {
    type: 'adjustments_ref',
    title: 'Tabela de decisão — o que cada cenário exige',
    subtitle: 'Quando você ver isso, faça isso — sem achismo',
    groups: [
      {
        category: 'Custo', icon: '💰', color: '#f59e0b',
        items: [
          { situation: 'CPL alto desde o início', action: 'Reduz orçamento 20% e revisa títulos — não aumenta pressão sem dado', tag: 'Ajustar' },
          { situation: 'CPC subindo sem mudança na campanha', action: 'Pode ser concorrência no leilão — aguarda 2–3 dias antes de agir', tag: 'Aguardar' },
          { situation: 'CPL subiu após ajuste recente', action: 'Desfaz o ajuste ou aguarda 3 dias — mudança leva tempo para estabilizar', tag: 'Aguardar' },
          { situation: 'Um canal com CPL muito menor que o outro', action: 'Realoca 30% do orçamento do canal fraco para o forte — dado decide', tag: 'Ajustar' },
          { situation: 'Orçamento esgotando antes do fim do período', action: 'Reduz lance máximo ou limita horário de veiculação para distribuir melhor', tag: 'Ajustar' },
        ],
      },
      {
        category: 'Leads', icon: '🎯', color: '#60a5fa',
        items: [
          { situation: 'Muitos cliques, poucos leads', action: 'Anúncio funciona — problema na landing page, formulário ou WhatsApp', tag: 'Checar' },
          { situation: 'Leads chegam mas sem perfil ideal', action: 'Tráfego desqualificado — revisar segmentação, restrição geográfica e copy do anúncio', tag: 'Ajustar' },
          { situation: 'Volume de leads zerou', action: 'Checar se campanha está ativa, verba disponível e posição no leilão antes de agir', tag: 'Checar' },
          { situation: 'Leads chegando fora do horário de atendimento', action: 'Ativar programação de horário — anúncio só roda quando você pode responder', tag: 'Ajustar' },
          { situation: 'Formulários com dados incompletos ou irreais', action: 'Copy do anúncio gera expectativa errada — revisar promessa e qualificação no criativo', tag: 'Ajustar' },
        ],
      },
      {
        category: 'Conversão', icon: '📞', color: '#6eda2c',
        items: [
          { situation: 'Lead não fecha + atendimento rápido', action: 'Não é tráfego — revisar script, proposta e diferencial comunicado', tag: 'Ajustar' },
          { situation: 'Lead não fecha + atendimento lento', action: 'Velocidade define se o lead esfria — resposta em até 1h é o mínimo', tag: 'Checar' },
          { situation: 'Lead qualifica mas não fecha na proposta', action: 'Problema na oferta, preço ou garantia — não é tráfego, não é atendimento', tag: 'Ajustar' },
          { situation: 'Lead some após receber o preço', action: 'Ancoragem de valor ausente — justifique o resultado antes de apresentar o número', tag: 'Ajustar' },
          { situation: 'Lead marca consulta e não aparece', action: 'Enviar lembrete 1h antes — reduz no-show sem esforço adicional', tag: 'Ajustar' },
        ],
      },
      {
        category: 'Criativo', icon: '🎨', color: '#be29ec',
        items: [
          { situation: 'CTR baixo (Google <3% / Meta <1% no link)', action: 'Testar novo headline, thumbnail ou gancho nos primeiros segundos do vídeo', tag: 'Ajustar' },
          { situation: 'Frequência Meta acima de 3–4', action: 'Público saturando — trocar criativo ou expandir segmentação', tag: 'Pausar' },
          { situation: 'CPM alto com CTR baixo', action: 'Público muito pequeno ou criativo irrelevante — expandir ou revisar copy', tag: 'Ajustar' },
          { situation: 'Criativo vencedor perdeu performance', action: 'Fadiga de criativo após 3–4 semanas — substituir com variação similar ao que funcionou', tag: 'Pausar' },
          { situation: 'Alto alcance mas poucos cliques', action: 'Curiosidade sem intenção — revisar CTA e chamada para ação no criativo', tag: 'Ajustar' },
        ],
      },
      {
        category: 'Algoritmo', icon: '⚡', color: '#f472b6',
        items: [
          { situation: 'Pmax sem resultado nos primeiros dias', action: 'Aguarda 14–21 dias — interromper antes sabota o aprendizado', tag: 'Aguardar' },
          { situation: 'CPL alto na 1ª semana de campanha nova', action: 'Normal — fase de aprendizado. Avalie só após 50+ cliques ou 7 dias', tag: 'Aguardar' },
          { situation: 'Performance caiu após aumento de orçamento', action: 'Mudança brusca reinicia o aprendizado — nunca mais de 20% a cada 3–4 dias', tag: 'Checar' },
          { situation: 'Campanha em "Aprendizado limitado"', action: 'Poucos eventos de conversão — considerar objetivo mais amplo ou reduzir restrições de público', tag: 'Ajustar' },
          { situation: 'Conversões pararam de registrar', action: 'Verificar se pixel/tag está ativo — sem rastreamento o algoritmo fica cego', tag: 'Checar' },
        ],
      },
    ],
    note: 'Decisão só com dados suficientes — volume pequeno não permite conclusão confiável',
  },
  // ─── BLOCO 7 — Atendimento ────────────────────────────────────────────────
  {
    type: 'list',
    title: 'Atendimento: onde a maioria perde o dinheiro',
    icons: ['⚡', '🚫', '💬', '🎯', '📊'],
    items: [
      'Lead tem vida curta: 1 hora de resposta ou ele já foi falar com o concorrente',
      'Erro mais comum: mandar mensagem longa antes de ter atenção do lead',
      'Script de primeiro contato: "Oi [nome], vi que você tem interesse em [área]. Posso te fazer uma pergunta rápida?"',
      'A pergunta certa qualifica antes de apresentar — separa lead quente de curioso',
      'Registre tudo no CRM/On360: dado sem registro não vira decisão',
    ],
  },
  // ─── BLOCO 8 — Rotina ─────────────────────────────────────────────────────
  {
    type: 'rules',
    platform: '📅 Rotina de Operação',
    title: 'Rotinas básicas',
    dos: [
      'Todo dia, 5 min: confirmar que campanhas estão ativas e entregando — gasto real vs meta diária',
      'Segunda-feira, 20–30 min: Termos de pesquisa Google → adicionar negativos; CPL por campanha vs meta',
      'Segunda-feira: CTR abaixo de 3% no Google → testar novo título; keyword com 2x CPL meta → pausar',
      'Segunda-feira: Frequência Meta acima de 3–4 → trocar criativo; CTR do link <1% → novo criativo',
      'Quarta-feira, 15 min: comparar CPL acumulado vs semana anterior; checar se há lead sem retorno há +24h',
      'Sexta-feira, 20 min: registrar CPL semanal, volume de leads e o que foi testado — anotar aprendizado',
      'A cada 15 dias: revisar criativos em teste → pausar o perdedor; comparar taxa de qualificação Meta vs Google',
      'Todo dia 1°, 30–40 min: comparar CPL dos canais e realocar orçamento do fraco para o forte; revisar se meta de CPL ainda faz sentido vs ticket médio',
    ],
    donts: [
      { rule: 'Tratar curtidas, alcance e visualizações como resultado', why: 'Métricas de vaidade não pagam conta — CPL e conversão são os únicos que importam' },
      { rule: 'Pausar criativo antes de ter dado suficiente para avaliar', why: 'Todo criativo precisa de tempo mínimo rodando — decisão prematura descarta o que poderia funcionar' },
      { rule: 'Deixar o mesmo criativo por meses sem testar variação', why: 'Fadiga de criativo é real — o público cansa do mesmo conteúdo e o CTR cai progressivamente' },
      { rule: 'Pausar campanha quando achar caro sem analisar o CPL', why: 'Custo sem contexto não significa nada — o que importa é quanto custa cada lead, não o gasto total' },
      { rule: 'Mudar orçamento todo dia baseado na ansiedade do momento', why: 'Oscilação constante impede o algoritmo de estabilizar — consistência gera aprendizado' },
      { rule: 'Não fazer follow-up em lead que não respondeu', why: 'A maioria dos leads precisa de mais de um contato para avançar — silêncio não é rejeição' },
    ],
    alert: 'Quem gerencia na emoção gasta mais e converte menos — a rotina semanal evita isso.',
  },
  // ─── BLOCO 9 — Próximos 30 dias ───────────────────────────────────────────
  {
    type: 'plan_intro',
    title: 'Seus próximos 30 dias',
    subtitle: 'Dois canais ativos, suporte aberto e um plano — ',
    subtitleHighlight: 'o foco é começar a ter ritmo para construir processo.',
    points: [
      { icon: '✅', text: 'Google Ads e Meta Ads no ar' },
      { icon: '📋', text: 'Oito missões distribuídas em 30 dias' },
      { icon: '⏱️', text: 'Suporte ativo até o dia 30' },
      { icon: '🎥', text: 'Videoaulas para revisitar tudo que fizemos' },
    ],
    alert: 'O mês 1 é de dados, não de vendas. Quem entende isso investe melhor no mês 2 — quem espera resultado imediato desiste antes do algoritmo amadurecer.',
  },
  {
    type: 'missions_overview',
    title: 'Plano de Execução — 30 dias',
    subtitle: 'Oito missões para sair do zero e entrar no ritmo com dois canais',
    note: 'Venda nos primeiros 30 dias é exceção. O objetivo real é: leads chegando, canais comparados, funil entendido.',
    missions: [
      { day: 2,  icon: '📱', title: 'Primeira resposta + script',       evidence: 'Print + script' },
      { day: 5,  icon: '📊', title: 'Primeiros números (2 canais)',      evidence: 'Print dos dois gerenciadores' },
      { day: 8,  icon: '🎯', title: 'Perfil do lead por canal',          evidence: 'Lista com canal de origem' },
      { day: 12, icon: '🔍', title: 'Defesa do orçamento (2 canais)',    evidence: 'Lista Google + lista Meta' },
      { day: 16, icon: '🎨', title: 'Criativo analisado e testado',      evidence: 'Print + variação no ar' },
      { day: 20, icon: '💬', title: 'Processo de atendimento mapeado',   evidence: 'Áudio ou texto' },
      { day: 25, icon: '📈', title: 'Funil real por canal',              evidence: 'Onde o lead some em cada canal' },
      { day: 30, icon: '🏁', title: 'Balanço completo',                  evidence: 'Texto antes da call' },
    ],
  },
  {
    type: 'mission',
    day: 2, number: 1, icon: '📱', deadline: 'Dia 2',
    title: 'Missão 1 — Primeira Resposta',
    instruction: 'Responda os 5 primeiros leads em até 20min após a chegada. Cronometra o tempo real de cada um e registra.',
    evidence: 'Print das 5 conversas com horário de chegada e horário de resposta visíveis.',
    why: 'Velocidade de resposta define se o lead vira consulta ou some. 20min é o limite — depois disso a chance de conversão cai drasticamente.',
    color: GREEN,
    deadline: 'Dia 5',
  },
  {
    type: 'mission',
    day: 5, number: 2, icon: '📊', deadline: 'Dia 5',
    title: 'Missão 2 — Primeiros Números (2 canais)',
    instruction: 'Acesse os dois gerenciadores (Google e Meta) e registre separadamente: investimento, impressões, cliques, leads e CPL de cada um. Qual canal está com melhor CPL neste momento?',
    evidence: 'Print dos dois gerenciadores com métricas marcadas.',
    why: 'Com dois canais ativos, saber qual está performando melhor orienta onde concentrar atenção — e onde ajustar antes.',
    color: '#60a5fa',
  },
  {
    type: 'mission',
    day: 8, number: 3, icon: '🎯', deadline: 'Dia 8',
    title: 'Missão 3 — Perfil por Canal',
    instruction: 'Classifique os leads de cada plataforma separadamente: quente, morno ou fora do perfil. Qual canal traz leads mais próximos do perfil ideal? O que eles têm em comum?',
    evidence: 'Lista com classificação e canal de origem de cada lead.',
    why: 'Canais diferentes atraem perfis diferentes. Saber qual converte melhor é o dado que vai guiar a alocação de orçamento no mês 2.',
    color: '#a78bfa',
  },
  {
    type: 'mission',
    day: 12, number: 4, icon: '🔍', deadline: 'Dia 12',
    title: 'Missão 4 — Defesa do Orçamento',
    instruction: 'Google: abra Termos de Pesquisa e liste 5+ buscas irrelevantes. Meta: identifique posicionamentos com alto custo e baixa entrega de leads. Me mande as duas listas.',
    evidence: 'Lista de termos irrelevantes (Google) + posicionamentos fracos (Meta).',
    why: 'Dois canais = dois pontos de vazamento. Fechar os dois nas primeiras semanas protege o orçamento e melhora o CPL de ambos.',
    color: '#f59e0b',
  },
  {
    type: 'mission',
    day: 16, number: 5, icon: '🎨', deadline: 'Dia 16',
    title: 'Missão 5 — Criativo e Teste',
    instruction: 'Identifique o criativo com melhor CTR e o com pior. Escreva em 3 linhas por que acha que um performa melhor. Publique 1 variação com mudança no título ou imagem — sem pausar os outros.',
    evidence: 'Print comparando os dois criativos + confirmação de que a variação está no ar.',
    why: 'Teste de criativo não é opcional. É a única forma de saber o que funciona para o seu público específico.',
    color: '#ec4899',
  },
  {
    type: 'mission',
    day: 20, number: 6, icon: '💬', deadline: 'Dia 20',
    title: 'Missão 6 — Processo de Atendimento',
    instruction: 'Documente como está atendendo os leads: o que você diz na 1ª mensagem, quanto tempo leva para responder, quando manda a proposta. O script que escreveu no dia 2 ainda é o mesmo?',
    evidence: 'Áudio ou texto no WhatsApp — sem formalidade.',
    why: 'Na maioria dos casos o problema não é o tráfego — é a abordagem. Quem documenta o processo consegue melhorá-lo.',
    color: '#be29ec',
  },
  {
    type: 'mission',
    day: 25, number: 7, icon: '📈', deadline: 'Dia 25',
    title: 'Missão 7 — Funil Real por Canal',
    instruction: 'Mapeie até onde os leads chegaram em cada canal: X recebidos → Y conversas avançadas → Z consultas. Onde some mais: antes de responder, na proposta, após receber o preço? O comportamento é diferente entre Google e Meta?',
    evidence: 'Texto descrevendo o ponto de abandono mais comum em cada canal.',
    why: 'Funil diferente por canal = causa diferente. Esse dado define se o ajuste é no tráfego, no criativo ou no atendimento.',
    color: '#06b6d4',
  },
  {
    type: 'mission',
    day: 30, number: 8, icon: '🏁', deadline: 'Dia 30',
    title: 'Missão 8 — Balanço Completo',
    instruction: 'Escreva: CPL real de cada canal, perfil predominante dos leads, maior dificuldade no processo. Se houve fechamento, ótimo — se não, qual lead está mais próximo? Defina 3 prioridades para o mês 2.',
    evidence: 'Texto enviado antes da call de encerramento — sem ele, a call não acontece.',
    why: 'O mês 1 é de dados, não de vendas. Quem chega na call com esse balanço entra no mês 2 com estratégia. Quem não faz repete os mesmos erros.',
    color: GREEN,
  },
  {
    type: 'clock',
    title: 'O Relógio Está Correndo',
    plan: '30 dias',
    warning: 'Cada missão não entregue é um dado que não coletamos. Sem dado, sem ajuste. Sem ajuste, o mês 2 começa no escuro.',
    actions: [
      'Missão não entregue no prazo = suporte daquele ponto não acontece',
      'Campanha pausada sem aviso = dados perdidos, verba desperdiçada',
      'Suporte encerra no dia 30, independente de quanto foi aproveitado',
    ],
    cta: 'Dúvida? Me chame agora — não depois do suporte acabar.',
  },
]

const FORMATS = [
  {
    id: 'ativacao',
    title: 'Ativação',
    subtitle: '1 plataforma · Meta Ads OU Google Ads',
    duration: '1h30',
    color: '#ea8a29',
    icon: Zap,
    slides: ATIVACAO_SLIDES,
  },
  {
    id: 'estruturacao',
    title: 'Estruturação / Aceleração',
    subtitle: '2 plataformas · Meta Ads + Google Ads',
    duration: '2h30',
    color: GREEN,
    icon: TrendingUp,
    slides: ESTRUTURACAO_SLIDES,
  },
]

// ─── SLIDE COMPONENTS ─────────────────────────────────────────────────────────

function CoverSlide({ slide, format }) {
  const Icon = format.icon
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}>
        <Icon size={28} style={{ color: GREEN }} />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
        {slide.title}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-xl text-white/60 mb-8 max-w-lg">
        {slide.subtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="px-5 py-2.5 rounded-full text-sm font-bold"
        style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, color: GREEN }}>
        {slide.badge}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="absolute bottom-16 flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
      </motion.div>
    </div>
  )
}

function ListSlide({ slide }) {
  const compact = slide.items.length > 5
  const colors = [GREEN, '#60a5fa', '#f59e0b', '#a78bfa', '#ec4899', '#06b6d4', '#f87171']

  const splitItem = (item) => {
    const d = item.indexOf(' — ')
    if (d >= 0) return [item.slice(0, d), item.slice(d + 3)]
    const c = item.indexOf(': ')
    if (c >= 0 && c < 42) return [item.slice(0, c), item.slice(c + 2)]
    return [null, item]
  }

  // ── Slide 7: 7 regras — grid estilo "painel de lei" com número grande
  if (compact) {
    const isOdd = slide.items.length % 2 !== 0
    return (
      <div className="flex flex-col justify-center h-full px-6 lg:px-10 max-w-5xl mx-auto w-full">
        <SlideTitle>{slide.title}</SlideTitle>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {slide.items.map((item, i) => {
            const c = colors[i % colors.length]
            const [strong, rest] = splitItem(item)
            const isLast = isOdd && i === slide.items.length - 1
            return (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                className={`relative rounded-xl overflow-hidden flex${isLast ? ' col-span-2' : ''}`}
                style={{ border: `1px solid ${c}28` }}>
                {/* Left strip with big number */}
                <div className="flex flex-col items-center justify-start pt-3.5 pb-3 px-2.5 gap-1 flex-shrink-0"
                  style={{ background: `${c}16`, borderRight: `1px solid ${c}20`, width: 52 }}>
                  <span className="font-black leading-none" style={{ fontSize: 32, color: c }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="h-px w-5 rounded-full" style={{ background: `${c}50` }} />
                </div>
                {/* Content */}
                <div className="flex-1 px-3.5 py-3 relative overflow-hidden" style={{ background: `${c}05` }}>
                  <div className="absolute -right-1 bottom-0 font-black leading-none select-none pointer-events-none"
                    style={{ fontSize: 70, color: `${c}06` }}>{i + 1}</div>
                  {strong ? (
                    <>
                      <p className="font-extrabold text-xs leading-snug mb-1 relative z-10" style={{ color: c }}>{strong}</p>
                      <p className="text-white/52 text-[11px] leading-relaxed relative z-10">{rest}</p>
                    </>
                  ) : (
                    <p className="text-white/75 text-xs leading-relaxed relative z-10">{item}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Slide 16: 5 itens — cards "playbook" com ícone e barra lateral forte
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-12 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="space-y-2 mt-4">
        {slide.items.map((item, i) => {
          const c = colors[i % colors.length]
          const [strong, rest] = splitItem(item)
          const icon = slide.icons?.[i]
          const isScript = icon === '💬'
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.09 }}
              className="flex items-stretch rounded-xl overflow-hidden relative"
              style={{ border: `1px solid ${c}25`,
                       boxShadow: i === 0 ? `0 0 18px ${c}18` : undefined }}>
              {/* Icon strip */}
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 62, background: `${c}18`, borderRight: `1px solid ${c}22` }}>
                <span style={{ fontSize: 26 }}>{icon || <span className="font-black text-xl" style={{ color: c }}>{i + 1}</span>}</span>
              </div>
              {/* Body */}
              <div className="flex-1 px-5 py-3 relative overflow-hidden" style={{ background: `${c}06` }}>
                <div className="absolute right-2 top-0 font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: 78, color: `${c}06` }}>{i + 1}</div>
                <div className="relative z-10">
                  {strong && (
                    <span className="font-extrabold text-sm" style={{ color: c }}>{strong}: </span>
                  )}
                  {isScript ? (
                    <span className="text-white/80 text-sm font-mono leading-relaxed italic">{rest}</span>
                  ) : (
                    <span className="text-white/72 text-sm leading-relaxed">{strong ? rest : item}</span>
                  )}
                </div>
              </div>
              {/* Right accent for first item (urgência) */}
              {i === 0 && (
                <div className="w-1 flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${c}, transparent)` }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function FourPsSlide({ slide }) {
  const PURPLE = '#a78bfa'
  const find = (label) => slide.ps.find(p => p.label === label)
  const prod = find('Produto'), prec = find('Preço'), prac = find('Praça'), prom = find('Promoção')

  // Função (não componente) para evitar remount e loop de animação
  const renderCard = (p, delay, side) => {
    if (!p) return null
    return (
      <motion.div key={p.label} initial={{ opacity: 0, x: side === 'left' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="rounded-xl p-3 flex flex-col flex-1"
        style={p.highlight
          ? { background: `${GREEN}12`, border: `1.5px solid ${GREEN}50`, boxShadow: `0 0 14px ${GREEN}15` }
          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontSize: 18 }}>{p.icon}</span>
          <p className="text-sm font-extrabold flex-1" style={{ color: p.highlight ? GREEN : 'white' }}>{p.label}</p>
          {p.highlight && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${GREEN}25`, color: GREEN, border: `1px solid ${GREEN}50` }}>
              você está aqui
            </span>
          )}
        </div>
        <p className="text-white/35 text-[10px] mb-2 leading-snug">{p.desc}</p>
        <div className="flex flex-col gap-1">
          {p.items.slice(0, 5).map(item => {
            const hl = p.highlightItem && item === p.highlightItem
            return (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: hl ? GREEN : 'rgba(255,255,255,0.18)' }} />
                <span className="text-[11px]"
                  style={{ color: hl ? GREEN : 'rgba(255,255,255,0.55)', fontWeight: hl ? 700 : 400 }}>
                  {item}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-3 max-w-5xl mx-auto w-full">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-0.5">
        {slide.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-white/40 text-xs mb-3">{slide.subtitle}</motion.p>

      <div className="flex-1 flex items-center gap-4">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-3 flex-1 self-stretch">
          {renderCard(prod, 0.3, 'left')}
          {renderCard(prec, 0.4, 'left')}
        </div>

        {/* Corpo humano */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative flex-shrink-0" style={{ width: 150, height: 340 }}>

          {/* Cabeça */}
          <div className="absolute flex items-center justify-center"
            style={{ top: 0, left: 45, width: 70, height: 70, borderRadius: '50%',
              background: `${PURPLE}22`, border: `2px solid ${PURPLE}80`,
              boxShadow: `0 0 20px ${PURPLE}35` }}>
            <span style={{ fontSize: 28 }}>🧠</span>
          </div>
          <div className="absolute text-center" style={{ top: 72, left: 25, width: 100 }}>
            <span className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: PURPLE }}>
              Estratégia
            </span>
          </div>

          {/* Pescoço */}
          <div className="absolute" style={{ top: 84, left: 69, width: 14, height: 12,
            background: 'rgba(255,255,255,0.07)' }} />

          {/* Torso */}
          <div className="absolute" style={{ top: 95, left: 40, width: 72, height: 105,
            borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }} />

          {/* Braço esquerdo — Produto */}
          <div className="absolute" style={{ top: 97, left: 8, width: 30, height: 90,
            borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 14, writingMode: 'vertical-lr', transform: 'rotate(180deg)', color: 'rgba(255,255,255,0.35)' }}>🎁</span>
            </div>
          </div>

          {/* Braço direito — Promoção */}
          <div className="absolute" style={{ top: 97, right: 8, width: 30, height: 90,
            borderRadius: 12, background: `${GREEN}18`, border: `1.5px solid ${GREEN}55`,
            boxShadow: `0 0 12px ${GREEN}22` }}>
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 14, writingMode: 'vertical-lr', transform: 'rotate(180deg)', color: GREEN }}>📢</span>
            </div>
          </div>

          {/* Perna esquerda — Preço */}
          <div className="absolute" style={{ top: 198, left: 36, width: 28, height: 120,
            borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 13, writingMode: 'vertical-lr', transform: 'rotate(180deg)', color: 'rgba(255,255,255,0.3)' }}>💰</span>
            </div>
          </div>

          {/* Perna direita — Praça */}
          <div className="absolute" style={{ top: 198, right: 36, width: 28, height: 120,
            borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 13, writingMode: 'vertical-lr', transform: 'rotate(180deg)', color: 'rgba(255,255,255,0.3)' }}>📍</span>
            </div>
          </div>
        </motion.div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-3 flex-1 self-stretch">
          {renderCard(prom, 0.3, 'right')}
          {renderCard(prac, 0.4, 'right')}
        </div>

      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-center text-white/30 text-xs mt-2">
        {slide.note}
      </motion.p>
    </div>
  )
}

function MarketStatsSlide({ slide }) {
  const BR_POP = 210
  const getBar = (platform) => {
    if (platform === 'Instagram') return { pct: 58, label: '58% dos brasileiros' }
    if (platform === 'Facebook')  return { pct: 53, label: '53% dos brasileiros' }
    if (platform === 'WhatsApp')  return { pct: 70, label: '70% dos brasileiros' }
    return null
  }

  return (
    <div className="flex flex-col h-full px-6 lg:px-14 pt-5 pb-3 max-w-5xl mx-auto w-full">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-1">
        {slide.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
        className="text-white/40 text-xs mb-3">{slide.subtitle}</motion.p>

      {/* Plataformas — 4 colunas */}
      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {slide.stats.map((stat, i) => {
          const bar = getBar(stat.platform)
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.09 }}
              className="rounded-2xl p-4 flex flex-col"
              style={{ background: `${stat.color}0d`, border: `1px solid ${stat.color}30` }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 22 }}>{stat.icon}</span>
                <span className="text-xs font-extrabold uppercase tracking-wider"
                  style={{ color: stat.color }}>{stat.platform}</span>
              </div>
              <p className="font-extrabold leading-none mb-1"
                style={{ fontSize: 28, color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-white/40 leading-snug mb-3">{stat.label}</p>
              {bar ? (
                <div className="mt-auto">
                  <div className="h-1.5 rounded-full overflow-hidden mb-1"
                    style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${bar.pct}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                      style={{ background: stat.color }} />
                  </div>
                  <p className="text-[9px] font-bold" style={{ color: `${stat.color}80` }}>{bar.label}</p>
                </div>
              ) : (
                <div className="mt-auto">
                  <p className="text-[9px] font-bold" style={{ color: `${stat.color}80` }}>
                    maior buscador do mundo
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Insights — manchetes */}
      <div className="grid grid-cols-2 gap-2">
        {slide.insights.map((insight, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.07 }}
            className="flex items-start gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ color: GREEN, fontSize: 14, flexShrink: 0, marginTop: 1 }}>↗</span>
            <p className="text-xs text-white/65 leading-snug">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function GoogleIntroSlide({ slide }) {
  const color = slide.platformColor || '#4285f4'
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
        style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
        {slide.platform}
      </motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-3 mb-5 px-4 py-3 rounded-xl"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <p className="text-white/80 text-sm leading-relaxed">{slide.concept}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {slide.networks.map((net, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.09 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <span className="text-xl flex-shrink-0">{net.icon}</span>
            <div>
              <p className="text-sm font-extrabold text-white mb-1">{net.name}</p>
              <p className="text-xs text-white/50 leading-relaxed">{net.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {slide.note && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}28` }}>
          <span style={{ color: GREEN, fontSize: '14px' }}>★</span>
          <p className="text-sm font-semibold" style={{ color: GREEN }}>{slide.note}</p>
        </motion.div>
      )}
    </div>
  )
}

function FunnelSlide({ slide }) {
  const steps = slide.funnel || []
  const n = steps.length
  const stepIcons = ['📢', '👁️', '🖱️', '📩', '✅', '🤝']
  const dropoff = ['100%', '45%', '12%', '4%', '1%', '0,3%']
  const getWidth = (i) => Math.round(100 - i * (52 / (n - 1)))
  const highlights = slide.highlight ? slide.highlight.split('\n') : []

  const stepColor = (i) => {
    if (!slide.leftZones) return GREEN
    let cum = 0
    for (const z of slide.leftZones) { cum += z.steps; if (i < cum) return z.color }
    return GREEN
  }

  return (
    <div className="flex flex-col h-full px-6 lg:px-10 pt-4 pb-3 max-w-5xl mx-auto w-full">
      {/* Header */}
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-0.5">
        {slide.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-white/40 text-xs mb-2">{slide.subtitle}</motion.p>

      {/* Channels → convergência */}
      {slide.channels && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col items-center mb-1">
          {/* Dois canais */}
          <div className="flex items-center gap-3">
            {slide.channels.map((ch, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: `${ch.color}12`, border: `1.5px solid ${ch.color}45` }}>
                <span style={{ fontSize: 15 }}>{ch.icon}</span>
                <div>
                  <p className="text-xs font-extrabold leading-none mb-0.5" style={{ color: ch.color }}>{ch.name}</p>
                  <p className="text-[9px] text-white/35 leading-none">{ch.desc}</p>
                </div>
              </div>
            ))}
            {/* separador + entre os dois */}
            <div className="absolute flex items-center justify-center"
              style={{ left: '50%', transform: 'translateX(-50%)' }}>
              <span className="text-white/15 font-black text-sm">+</span>
            </div>
          </div>
          {/* Linhas convergindo para o funil */}
          <div className="flex" style={{ width: 220, height: 18, marginTop: 2 }}>
            <div style={{
              flex: 1, borderRight: `1.5px solid ${slide.channels[0].color}30`,
              borderBottom: `1.5px solid ${slide.channels[0].color}30`,
              borderRadius: '0 0 10px 0',
            }} />
            <div style={{
              flex: 1, borderLeft: `1.5px solid ${slide.channels[1].color}30`,
              borderBottom: `1.5px solid ${slide.channels[1].color}30`,
              borderRadius: '0 0 0 10px',
            }} />
          </div>
        </motion.div>
      )}

      {/* Funil + zonas */}
      <div className="flex items-stretch gap-3 flex-1">
        {/* Sidebar esquerda */}
        {slide.leftZones && (
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-1.5" style={{ width: 78 }}>
            {slide.leftZones.map((zone, zi) => (
              <div key={zi} className="flex flex-col items-center justify-center rounded-xl gap-0.5"
                style={{ flex: zone.steps, background: `${zone.color}10`, border: `1px solid ${zone.color}28`, padding: '6px 4px' }}>
                <span className="font-extrabold text-center leading-tight"
                  style={{ color: zone.color, writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: 10, letterSpacing: '0.08em' }}>
                  {zone.label}
                </span>
                <span className="font-semibold text-center"
                  style={{ color: `${zone.color}70`, writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: 8 }}>
                  {zone.sub}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Funil central */}
        <div className="flex-1 flex flex-col gap-1.5 items-center justify-center">
          {steps.map((step, i) => {
            const color = stepColor(i)
            const isLast = i === n - 1
            return (
              <motion.div key={i}
                initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.22 + i * 0.09, duration: 0.3 }}
                className="flex items-center gap-3 px-4 rounded-xl"
                style={{
                  width: `${getWidth(i)}%`, height: 40,
                  background: isLast ? `${GREEN}22` : `${color}10`,
                  border: `1px solid ${color}${isLast ? '70' : '30'}`,
                  boxShadow: isLast ? `0 0 18px ${GREEN}30` : undefined,
                }}>
                <span style={{ fontSize: 14 }}>{stepIcons[i] || '▸'}</span>
                <span className="flex-1 text-sm font-bold"
                  style={{ color: isLast ? GREEN : 'rgba(255,255,255,0.88)' }}>
                  {step}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: `${color}70` }}>
                  {dropoff[i]}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar direita */}
        {slide.continuous && (
          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
            className="flex items-stretch" style={{ width: 64 }}>
            <div className="flex flex-col items-center justify-center w-full rounded-xl gap-2"
              style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}28`, padding: '12px 6px' }}>
              <span style={{ color: GREEN, fontSize: 14 }}>↻</span>
              <span className="font-extrabold text-center leading-tight"
                style={{ color: GREEN, writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: 9, letterSpacing: '0.06em' }}>
                {slide.continuous}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.88 }}
          className="mt-2.5 grid gap-2" style={{ gridTemplateColumns: `repeat(${highlights.length}, 1fr)` }}>
          {highlights.map((line, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}28` }}>
              <span style={{ color: GREEN, fontSize: 12, flexShrink: 0 }}>⚡</span>
              <p className="text-white/80 text-xs font-semibold leading-snug">{line}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function StepsSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-10 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="mt-6 space-y-2.5">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="relative flex items-center gap-5 px-5 py-4 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="absolute right-5 font-black select-none leading-none pointer-events-none"
              style={{ fontSize: 72, color: 'rgba(255,255,255,0.04)', top: '50%', transform: 'translateY(-50%)' }}>
              {i + 1}
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-extrabold relative z-10"
              style={{ background: `${GREEN}22`, border: `2px solid ${GREEN}50`, color: GREEN }}>
              {i + 1}
            </div>
            <span className="text-white/90 text-lg font-medium relative z-10">{item}</span>
          </motion.div>
        ))}
      </div>
      {slide.duration && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl self-start"
          style={{ background: `${GREEN}15`, border: `1.5px solid ${GREEN}45` }}>
          <span style={{ fontSize: 20 }}>⏱</span>
          <span className="font-extrabold text-base" style={{ color: GREEN }}>Duração total: {slide.duration}</span>
        </motion.div>
      )}
    </div>
  )
}

function CycleSlide({ slide }) {
  const steps = slide.cycle
  const stepColors = [GREEN, '#60a5fa', '#f59e0b', '#a78bfa', '#ec4899', '#06b6d4', '#34d399', '#f87171']

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-5xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-white/50 text-sm mt-1 mb-6 max-w-2xl">
        {slide.subtitle}
      </motion.p>

      {/* Steps flow */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {steps.map((step, i) => {
          const c = stepColors[i % stepColors.length]
          return (
            <div key={i} className="flex items-center gap-1.5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl relative overflow-hidden"
                style={{ background: `${c}10`, border: `1.5px solid ${c}35` }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                  style={{ background: c, color: DARK }}>
                  {i + 1}
                </div>
                <span className="text-white/90 text-sm font-semibold whitespace-nowrap">{step}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07 }}>
                  <ArrowRight size={13} style={{ color: stepColors[(i + 1) % stepColors.length], opacity: 0.5 }} />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="p-5 rounded-2xl relative overflow-hidden"
        style={{ background: `${GREEN}0e`, border: `1.5px solid ${GREEN}35`,
                 boxShadow: `0 0 30px ${GREEN}10` }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: `${GREEN}08`, transform: 'translate(30%, -30%)' }} />
        <div className="flex items-start gap-3 relative z-10">
          <span style={{ color: GREEN, fontSize: 20, flexShrink: 0 }}>💡</span>
          <p className="text-white font-semibold text-base leading-relaxed whitespace-pre-line">
            {slide.highlight}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function MetricsSlide({ slide }) {
  const colors = [GREEN, '#60a5fa', '#f59e0b', '#be29ec']
  const cols = slide.metrics.length === 4 ? 'grid-cols-2' : 'grid-cols-3'
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-5xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className={`grid ${cols} gap-3 mt-5`}>
        {slide.metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.1 }}
            className="p-5 rounded-2xl flex flex-col relative overflow-hidden"
            style={{ background: `${colors[i]}08`, border: `1px solid ${colors[i]}30` }}>
            <div className="absolute -right-1 -top-2 font-black leading-none select-none pointer-events-none"
              style={{ fontSize: 60, color: `${colors[i]}10` }}>{m.label}</div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
              style={{ background: `${colors[i]}18`, border: `1px solid ${colors[i]}30` }}>
              <span className="text-base font-extrabold" style={{ color: colors[i] }}>{m.label.substring(0,2)}</span>
            </div>
            <p className="text-xl font-extrabold mb-2" style={{ color: colors[i] }}>{m.label}</p>
            <p className="text-white/65 text-sm leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
      {slide.note && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}
          className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: GREEN, fontSize: 12 }}>★</span>
          <p className="text-white/45 text-sm">{slide.note}</p>
        </motion.div>
      )}
      {slide.obs && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-2 flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}22` }}>
          <span className="text-base flex-shrink-0">💡</span>
          <p className="text-sm text-white/65 leading-relaxed">{slide.obs}</p>
        </motion.div>
      )}
    </div>
  )
}

function DiagramSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex items-center gap-2 mt-6 mb-6 p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {slide.diagram.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="px-4 py-2.5 rounded-xl text-sm font-extrabold text-white text-center"
              style={{ background: `${GREEN}22`, border: `1.5px solid ${GREEN}50`,
                       boxShadow: `0 0 12px ${GREEN}15` }}>
              {d}
            </div>
            {i < slide.diagram.length - 1 && (
              <div className="flex-shrink-0 flex items-center gap-1">
                <div className="h-px w-4" style={{ background: `${GREEN}50` }} />
                <ArrowRight size={12} style={{ color: GREEN }} />
              </div>
            )}
          </div>
        ))}
      </motion.div>
      <div className="grid grid-cols-2 gap-2.5">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.08 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}18` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: GREEN }} />
            <span className="text-white/80 text-sm leading-snug">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PlatformSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 self-start"
        style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
        {slide.platformIcon} {slide.platform}
      </motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      {slide.concept && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="mt-3 mb-4 px-5 py-3.5 rounded-xl flex items-start gap-3"
          style={{ background: `${color}12`, border: `1px solid ${color}28`, borderLeft: `3px solid ${color}` }}>
          <p className="text-white/85 text-sm leading-relaxed">{slide.concept}</p>
        </motion.div>
      )}
      {slide.diagram && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="flex items-center gap-2 mb-5 flex-wrap">
          {slide.diagram.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: `${color}20`, border: `1px solid ${color}45` }}>
                {d}
              </div>
              {i < slide.diagram.length - 1 && (
                <div className="w-5 h-px flex-shrink-0" style={{ background: `${color}50` }}>
                  <span style={{ fontSize: 10, color }}> ▶</span>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: `${color}06`, border: `1px solid ${color}18` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
            <span className="text-white/80 text-sm leading-snug">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PracticeSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-4xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-4 flex items-center gap-4 px-5 py-4 rounded-2xl mb-5"
        style={{ background: `${color}14`, border: `1.5px solid ${color}40` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: `${color}25`, border: `1px solid ${color}50` }}>🎯</div>
        <p className="font-extrabold text-lg" style={{ color }}>{slide.action}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-2.5">
        {slide.steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-3 p-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
              style={{ background: `${color}22`, border: `1px solid ${color}45`, color }}>
              {i + 1}
            </div>
            <span className="text-white/82 text-sm leading-snug">{step}</span>
          </motion.div>
        ))}
      </div>
      {slide.note && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ color, fontSize: 12 }}>→</span>
          <p className="text-white/40 text-sm">{slide.note}</p>
        </motion.div>
      )}
    </div>
  )
}

function RulesSlide({ slide }) {
  const color = slide.platformColor || GREEN
  const RED = '#ef4444'
  const isRich = slide.donts?.length > 0 && typeof slide.donts[0] === 'object'

  return (
    <div className="flex flex-col justify-center h-full px-6 lg:px-10 max-w-5xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-2 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* FAZER */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${GREEN}25` }}>
          <div className="flex items-center gap-2 px-4 py-2.5"
            style={{ background: `${GREEN}18`, borderBottom: `1px solid ${GREEN}20` }}>
            <CheckCircle2 size={14} style={{ color: GREEN }} />
            <p className="text-[11px] font-extrabold tracking-widest" style={{ color: GREEN }}>FAZER</p>
          </div>
          <div className="p-2 space-y-1.5">
            {slide.dos.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-start gap-2 px-3 py-2 rounded-lg"
                style={{ background: `${GREEN}07` }}>
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: GREEN }} />
                <span className="text-white/72 text-xs leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NÃO FAZER */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${RED}25` }}>
          <div className="flex items-center gap-2 px-4 py-2.5"
            style={{ background: `${RED}15`, borderBottom: `1px solid ${RED}20` }}>
            <XCircle size={14} style={{ color: RED }} />
            <p className="text-[11px] font-extrabold tracking-widest" style={{ color: RED }}>NÃO FAZER</p>
          </div>
          <div className="p-2 space-y-1.5">
            {slide.donts.map((item, i) => {
              const rule = isRich ? item.rule : item
              const why  = isRich ? item.why  : null
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="px-3 py-2 rounded-lg"
                  style={{ background: `${RED}07`, borderLeft: `2.5px solid ${RED}50` }}>
                  <p className="text-white/85 text-xs font-semibold leading-snug">{rule}</p>
                  {why && <p className="text-white/38 text-[10px] mt-0.5 leading-snug">{why}</p>}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="mt-3 flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(234,138,41,0.07)', border: '1px solid rgba(234,138,41,0.22)',
                 borderLeft: '3px solid rgba(234,138,41,0.65)' }}>
        <AlertTriangle size={13} style={{ color: '#ea8a29' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(234,138,41,0.85)' }}>{slide.alert}</p>
      </motion.div>
    </div>
  )
}

function GridSlide({ slide }) {
  const colors = [GREEN, '#60a5fa', '#f59e0b', '#be29ec', '#ec4899', '#06b6d4']
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {slide.cards.map((card, i) => {
          const c = colors[i % colors.length]
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.09 }}
              className="p-5 rounded-2xl flex items-start gap-4 relative overflow-hidden"
              style={{ background: `${c}08`, border: `1px solid ${c}25` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ background: `${c}18`, border: `1px solid ${c}35` }}>
                {card.icon}
              </div>
              <div>
                <p className="font-extrabold text-white mb-1" style={{ color: c }}>{card.label}</p>
                <p className="text-white/55 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineSlide({ slide }) {
  const segColors = [GREEN, '#60a5fa', '#f59e0b', '#a78bfa', '#ec4899', '#06b6d4']
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="mt-5 relative">
        {/* Linha vertical */}
        <div className="absolute left-[26px] top-5 w-0.5 rounded-full"
          style={{ bottom: 20, background: 'linear-gradient(to bottom, rgba(110,218,44,0.5), rgba(110,218,44,0.05))' }} />

        <div className="space-y-3">
          {slide.events.map((ev, i) => {
            const c = segColors[i % segColors.length]
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.09 }}
                className="flex items-start gap-4 relative">
                {/* Time chip */}
                <div className="flex-shrink-0 w-[52px] h-[52px] rounded-2xl flex items-center justify-center z-10 text-center"
                  style={{ background: `${c}16`, border: `2px solid ${c}50`,
                           boxShadow: `0 0 14px ${c}18` }}>
                  <span className="text-[10px] font-extrabold leading-tight" style={{ color: c }}>{ev.time}</span>
                </div>
                {/* Card */}
                <div className="flex-1 py-3 px-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                           borderLeft: `3px solid ${c}50` }}>
                  <p className="text-white/85 text-sm leading-relaxed">{ev.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="mt-4 flex items-center justify-between">
        <p className="text-white/35 text-xs">{slide.note}</p>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-base tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
        </div>
      </motion.div>
    </div>
  )
}

function TaskSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold mb-4 self-start"
        style={{ background: 'rgba(234,138,41,0.15)', border: '1px solid rgba(234,138,41,0.4)', color: '#ea8a29' }}>
        {slide.badge}
      </motion.div>

      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-white/55 text-base mt-2 mb-3 max-w-2xl">
        {slide.subtitle}
      </motion.p>

      {/* CPV destaque */}
      {slide.cpvNote && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-4"
          style={{ background: 'rgba(190,41,236,0.1)', border: '1px solid rgba(190,41,236,0.3)' }}>
          <span className="text-base flex-shrink-0">📊</span>
          <p className="text-sm font-semibold" style={{ color: 'rgba(190,41,236,0.9)' }}>{slide.cpvNote}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Fórmula */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <p className="text-[10px] font-extrabold tracking-widest mb-4 text-white/35">A CONTA</p>
            <div className="space-y-3">
              {slide.formula.map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-white/65 text-sm">{row.label}</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.07)', minWidth: '72px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                    {row.field}
                  </span>
                </div>
              ))}
            </div>
            {slide.formulaResult && (
              <p className="text-xs text-white/30 mt-3 italic">{slide.formulaResult}</p>
            )}
          </div>
          <div className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-sm font-extrabold" style={{ color: GREEN }}>Meu CPL limite =</span>
            <span className="text-base font-extrabold px-4 py-1.5 rounded-lg"
              style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, color: GREEN }}>
              R$ ___
            </span>
          </div>
        </motion.div>

        {/* Exemplo */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}22` }}>
          <div>
            <p className="text-[10px] font-extrabold tracking-widest mb-4" style={{ color: `${GREEN}80` }}>EXEMPLO</p>
            <div className="space-y-2">
              {slide.example.items.map((item, i) => (
                <p key={i} className={`text-sm ${i === 2 ? 'font-bold text-white/80 mt-3' : 'text-white/55'}`}>{item}</p>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${GREEN}20` }}>
            <p className="text-base font-extrabold" style={{ color: GREEN }}>{slide.example.result}</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="mt-4 p-3.5 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-base flex-shrink-0">💡</span>
        <p className="text-sm text-white/55 leading-relaxed">{slide.quality}</p>
      </motion.div>
    </div>
  )
}

function SlideTitle({ children }) {
  return (
    <motion.h2 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
      {children}
    </motion.h2>
  )
}

function PlanIntroSlide({ slide }) {
  const statColors = ['#60a5fa', '#f59e0b', GREEN, '#a78bfa']
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-4xl mx-auto w-full">
      {/* Badge + title */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
        style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, color: GREEN }}>
        📋 Plano de Execução
      </motion.div>

      <SlideTitle>{slide.title}</SlideTitle>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
        className="text-white/55 text-base mt-2 mb-5 max-w-2xl leading-relaxed">
        {slide.subtitle}
        {slide.subtitleHighlight && <strong className="text-white font-extrabold">{slide.subtitleHighlight}</strong>}
      </motion.p>

      {/* Stats visuais */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {slide.points.map((p, i) => {
          const c = statColors[i % statColors.length]
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.07 }}
              className="flex flex-col items-center text-center py-5 px-3 rounded-2xl relative overflow-hidden"
              style={{ background: `${c}0c`, border: `1.5px solid ${c}30` }}>
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                style={{ background: `${c}10` }} />
              <span className="text-3xl mb-2">{p.icon}</span>
              <span className="text-xs font-medium text-white/65 leading-snug">{p.text}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Alerta */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="flex items-start gap-3 px-5 py-4 rounded-xl"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                 borderLeft: '4px solid rgba(239,68,68,0.7)' }}>
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: 'rgba(239,68,68,0.9)' }}>{slide.alert}</p>
      </motion.div>
    </div>
  )
}

function MissionsOverviewSlide({ slide }) {
  const many = slide.missions.length > 5
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-5xl mx-auto w-full">
      <SlideTitle style={{ fontSize: many ? '2rem' : undefined }}>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/50 text-sm mt-1 mb-4">{slide.subtitle}</motion.p>
      <div className={many ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
        {slide.missions.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: many ? '10px 12px' : '12px 14px' }}>
            <div className="rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold"
              style={{ width: many ? 38 : 44, height: many ? 38 : 44, background: `${GREEN}20`, border: `1px solid ${GREEN}40`, color: GREEN }}>
              Dia {m.day}
            </div>
            <span className="flex-shrink-0" style={{ fontSize: many ? '0.9rem' : '1.1rem' }}>{m.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white" style={{ fontSize: many ? '0.72rem' : '0.85rem' }}>{m.title}</p>
              <p className="text-white/40 mt-0.5" style={{ fontSize: '0.65rem' }}>Entregável: {m.evidence}</p>
            </div>
            <div className="rounded-md flex-shrink-0"
              style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)' }} />
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-3 text-white/30 text-xs text-center">
        {slide.note || 'Cada missão tem prazo, entregável obrigatório e consequência se não for cumprida'}
      </motion.p>
    </div>
  )
}

function MissionSlide({ slide }) {
  const color = slide.color || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-4xl mx-auto w-full relative overflow-hidden">
      {/* Big mission number background */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
        style={{ fontSize: 180, color: `${color}06` }}>
        {slide.number || ''}
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
          className="flex items-center justify-center rounded-2xl flex-shrink-0 text-3xl"
          style={{ width: 72, height: 72, background: `${color}20`, border: `2px solid ${color}60`,
                   boxShadow: `0 0 20px ${color}25` }}>
          {slide.icon}
        </motion.div>
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest mb-1"
            style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}>
            ⏰ Prazo: {slide.deadline}
          </motion.div>
          <SlideTitle>{slide.title}</SlideTitle>
        </div>
      </div>

      {/* Instruction */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="px-5 py-4 rounded-2xl mb-3 relative z-10"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                 borderLeft: `4px solid ${color}` }}>
        <p className="text-white/88 text-base leading-relaxed">{slide.instruction}</p>
      </motion.div>

      {/* Evidence */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
        className="flex items-center gap-4 px-5 py-4 rounded-xl mb-3 relative z-10"
        style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}>📎</div>
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: `${color}99` }}>
            Entregável obrigatório
          </p>
          <p className="text-sm font-bold text-white/90">{slide.evidence}</p>
        </div>
      </motion.div>

      {slide.extra && slide.extra.map((ex, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 + i * 0.07 }}
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-2 relative z-10"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-base flex-shrink-0">{ex.icon}</span>
          <p className="text-sm text-white/70">{ex.text}</p>
        </motion.div>
      ))}

      {/* Why */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex items-start gap-2 mt-1 px-4 py-2.5 rounded-xl relative z-10"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <span className="text-sm flex-shrink-0">💡</span>
        <p className="text-xs text-white/40 italic leading-relaxed">{slide.why}</p>
      </motion.div>
    </div>
  )
}

function AdjustmentsRefSlide({ slide }) {
  const COLORS = { A:'#6eda2c', B:'#60a5fa', C:'#1877f2', D:'#ef4444', E:'#f59e0b', F:'#ef4444', G:'#ea8a29', H:'#be29ec', I:'#ef4444', J:'#6eda2c' }

  const TAG_STYLES = {
    'Pausar':   { bg: '#ef444418', border: '#ef444440', color: '#ef4444' },
    'Ajustar':  { bg: '#f59e0b18', border: '#f59e0b40', color: '#f59e0b' },
    'Aguardar': { bg: '#60a5fa18', border: '#60a5fa40', color: '#60a5fa' },
    'Checar':   { bg: '#a78bfa18', border: '#a78bfa40', color: '#a78bfa' },
  }

  if (slide.groups) {
    const row1 = slide.groups.slice(0, 3)
    const row2 = slide.groups.slice(3)

    const renderGroup = (group, idx) => (
      <motion.div key={group.category}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 + idx * 0.06 }}
        className="flex flex-col rounded-xl overflow-hidden flex-1"
        style={{ border: `1px solid ${group.color}20`, background: `${group.color}04` }}>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5"
          style={{ background: `${group.color}10`, borderBottom: `1px solid ${group.color}15` }}>
          <span className="text-[11px]">{group.icon}</span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: group.color }}>
            {group.category}
          </span>
          <span className="ml-auto text-[8px] font-bold px-1 py-0.5 rounded"
            style={{ background: `${group.color}18`, color: `${group.color}bb` }}>
            {group.items.length}
          </span>
        </div>
        <div className="flex flex-col flex-1">
          {group.items.map((item, ii) => {
            const ts = TAG_STYLES[item.tag] || TAG_STYLES['Checar']
            return (
              <div key={ii} className="px-2.5 py-1 flex items-start gap-1.5"
                style={{ borderTop: ii > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="w-1 h-1 rounded-full mt-[5px] flex-shrink-0" style={{ background: group.color + '70' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap leading-none">
                    <p className="text-[10px] font-semibold text-white/85 leading-snug">{item.situation}</p>
                    {item.tag && (
                      <span className="text-[7px] font-extrabold uppercase tracking-wider px-1 py-px rounded flex-shrink-0"
                        style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color }}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/38 leading-snug">{item.action}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    )

    return (
      <div className="flex flex-col h-full px-5 lg:px-8 pt-4 pb-2 max-w-6xl mx-auto w-full gap-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-4 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-white leading-tight">{slide.title}</h2>
            <p className="text-white/40 text-xs mt-0.5">{slide.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {Object.entries(TAG_STYLES).map(([label, s]) => (
              <span key={label} className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-2 flex-1 min-h-0">
          {row1.map((g, i) => renderGroup(g, i))}
        </div>

        <div className="flex gap-2 flex-1 min-h-0">
          {row2.map((g, i) => renderGroup(g, row1.length + i))}
        </div>

        {slide.note && (
          <p className="text-white/25 text-[9px] text-center flex-shrink-0">{slide.note}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-white/45 text-sm mt-2 mb-5">{slide.subtitle}</motion.p>
      <div className="space-y-2">
        {slide.adjustments.map((adj, i) => {
          const c = COLORS[adj.code] || GREEN
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-start gap-4 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
                style={{ background: c + '20', color: c }}>
                {adj.code}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/80">{adj.situation}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{adj.action}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
      {slide.note && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="mt-4 text-white/30 text-xs text-center">{slide.note}</motion.p>
      )}
    </div>
  )
}

function ClockSlide({ slide }) {
  const ORANGE = '#ea8a29'
  const RED = '#ef4444'
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-14 max-w-4xl mx-auto w-full relative overflow-hidden">
      <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none"
        style={{ fontSize: 200, color: 'rgba(234,138,41,0.04)' }}>⏳</div>

      <div className="flex items-center gap-5 mb-5 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, type: 'spring', stiffness: 200 }}
          className="text-5xl flex-shrink-0">⏳</motion.div>
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
            className="text-xs font-extrabold uppercase tracking-widest mb-1 text-white/30">{slide.plan}</motion.p>
          <SlideTitle>{slide.title}</SlideTitle>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="px-5 py-4 rounded-2xl mb-4 relative z-10"
        style={{ background: `${ORANGE}10`, border: `1.5px solid ${ORANGE}35`,
                 borderLeft: `4px solid ${ORANGE}` }}>
        <p className="text-white/88 leading-relaxed font-medium">{slide.warning}</p>
      </motion.div>

      <div className="space-y-2 mb-5 relative z-10">
        {slide.actions.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.09 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: `${RED}07`, border: `1px solid ${RED}20` }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-extrabold mt-0.5"
              style={{ background: `${RED}20`, color: RED }}>✕</div>
            <p className="text-white/75 text-sm leading-snug">{a}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65 }}
        className="p-5 rounded-2xl text-center relative z-10"
        style={{ background: `${GREEN}15`, border: `2px solid ${GREEN}50`,
                 boxShadow: `0 0 28px ${GREEN}20` }}>
        <p className="text-xl font-extrabold" style={{ color: GREEN }}>{slide.cta}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        className="mt-5 flex items-center justify-center gap-2 relative z-10">
        <span className="text-white font-bold text-lg tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
        <span className="text-white/25 text-sm">· Gerando negócios para o seu negócio</span>
      </motion.div>
    </div>
  )
}

function renderSlide(slide, format) {
  switch (slide.type) {
    case 'cover':            return <CoverSlide slide={slide} format={format} />
    case 'list':             return <ListSlide slide={slide} />
    case 'funnel':           return <FunnelSlide slide={slide} />
    case 'task':             return <TaskSlide slide={slide} />
    case 'google_intro':     return <GoogleIntroSlide slide={slide} />
    case 'four_ps':          return <FourPsSlide slide={slide} />
    case 'market_stats':     return <MarketStatsSlide slide={slide} />
    case 'steps':            return <StepsSlide slide={slide} />
    case 'cycle':            return <CycleSlide slide={slide} />
    case 'metrics':          return <MetricsSlide slide={slide} />
    case 'diagram':          return <DiagramSlide slide={slide} />
    case 'platform':         return <PlatformSlide slide={slide} />
    case 'practice':         return <PracticeSlide slide={slide} />
    case 'rules':            return <RulesSlide slide={slide} />
    case 'grid':             return <GridSlide slide={slide} />
    case 'timeline':         return <TimelineSlide slide={slide} />
    case 'plan_intro':       return <PlanIntroSlide slide={slide} />
    case 'missions_overview':return <MissionsOverviewSlide slide={slide} />
    case 'mission':          return <MissionSlide slide={slide} />
    case 'adjustments_ref':  return <AdjustmentsRefSlide slide={slide} />
    case 'clock':            return <ClockSlide slide={slide} />
    default:                 return null
  }
}

// ─── FORMAT SELECTOR ──────────────────────────────────────────────────────────

function FormatSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center"
      style={{ minHeight: '80vh' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="mb-2">
        <span className="text-white font-bold text-2xl tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl font-extrabold text-white mt-4 mb-2">
        Destrava Digital
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/50 mb-12 text-lg">
        Selecione o formato da consultoria
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {FORMATS.map((fmt, i) => {
          const Icon = fmt.icon
          return (
            <motion.button
              key={fmt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(fmt)}
              className="p-6 rounded-2xl text-left transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${fmt.color}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${fmt.color}20` }}>
                <Icon size={18} style={{ color: fmt.color }} />
              </div>
              <h3 className="text-white font-extrabold text-lg mb-1">{fmt.title}</h3>
              <p className="text-white/50 text-sm mb-4">{fmt.subtitle}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${fmt.color}18`, color: fmt.color, border: `1px solid ${fmt.color}35` }}>
                  {fmt.duration}
                </span>
                <span className="text-xs text-white/35">{fmt.slides.length} slides</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="mt-10 text-white/25 text-xs">
        navegue com as setas ← → ou clique nas laterais
      </motion.p>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function DestravaDigital() {
  const [format, setFormat]       = useState(null)
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const total = format?.slides.length ?? 0

  const goNext = useCallback(() => {
    if (!format || current >= total - 1) return
    setDirection(1)
    setCurrent(c => c + 1)
  }, [format, current, total])

  const goPrev = useCallback(() => {
    if (!format || current <= 0) return
    setDirection(-1)
    setCurrent(c => c - 1)
  }, [format, current])

  const goBack = useCallback(() => {
    setFormat(null)
    setCurrent(0)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    function onFsChange() { setIsFullscreen(!!document.fullscreenElement) }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Escape' && !document.fullscreenElement) goBack()
      if (e.key === 'F' || e.key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, goBack, toggleFullscreen])

  function handleSelect(fmt) {
    setFormat(fmt)
    setCurrent(0)
  }

  const variants = {
    enter:  dir => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center:       ({ opacity: 1, x: 0 }),
    exit:   dir => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <div ref={containerRef} className="relative flex flex-col"
      style={{ minHeight: isFullscreen ? '100vh' : '88vh', height: isFullscreen ? '100vh' : undefined, background: DARK, color: 'white' }}>

      <AnimatePresence mode="wait">
        {!format ? (
          <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col">
            <FormatSelector onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div key="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative" style={{ minHeight: '88vh' }}>

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={goBack}
                className="text-xs font-bold text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
                <ChevronLeft size={13} /> Voltar
              </button>
              <span className="text-xs font-bold" style={{ color: format.color }}>
                {format.title}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-mono">
                  {current + 1} / {total}
                </span>
                <button onClick={toggleFullscreen}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-white/10"
                  title={isFullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'}>
                  {isFullscreen
                    ? <Minimize2 size={14} className="text-white/50 hover:text-white/80" />
                    : <Maximize2 size={14} className="text-white/50 hover:text-white/80" />}
                </button>
              </div>
            </div>

            {/* Slide area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Click zones */}
              <button onClick={goPrev} disabled={current === 0}
                className="absolute left-0 top-0 w-16 h-full z-10 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
                style={{ pointerEvents: current === 0 ? 'none' : 'auto' }}>
                <ChevronLeft size={24} className="text-white/40" />
              </button>
              <button onClick={goNext} disabled={current === total - 1}
                className="absolute right-0 top-0 w-16 h-full z-10 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
                style={{ pointerEvents: current === total - 1 ? 'none' : 'auto' }}>
                <ChevronRight size={24} className="text-white/40" />
              </button>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  {renderSlide(format.slides[current], format)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="flex-shrink-0 px-6 py-4 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: format.color }}
                  animate={{ width: `${((current + 1) / total) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={goPrev} disabled={current === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: current === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}>
                  <ChevronLeft size={14} className={current === 0 ? 'text-white/20' : 'text-white/60'} />
                </button>
                <button onClick={goNext} disabled={current === total - 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: current === total - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}>
                  <ChevronRight size={14} className={current === total - 1 ? 'text-white/20' : 'text-white/60'} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
