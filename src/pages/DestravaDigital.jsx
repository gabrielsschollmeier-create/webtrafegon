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
      { time: '15 dias', desc: 'Fim do suporte WhatsApp' },
      { time: '30 dias', desc: 'Reunião de análise e otimização' },
    ],
    note: 'Dúvida? Chame a gente antes de mexer em qualquer coisa.',
  },
  {
    type: 'plan_intro',
    title: 'Agora Começa a Segunda Parte',
    subtitle: 'A consultoria terminou — mas o suporte está ativo. É aqui que a maioria das pessoas trava.',
    points: [
      { icon: '✅', text: 'Campanhas estão no ar' },
      { icon: '📋', text: 'Você tem um plano de 15 dias' },
      { icon: '🎯', text: 'Há missões com prazo definido' },
      { icon: '⏱️', text: 'Seu suporte vence em data específica' },
    ],
    alert: 'Quem não age nas primeiras semanas paga por cliques e não gera resultado.',
  },
  {
    type: 'missions_overview',
    title: 'Plano de Execução — 30 dias',
    subtitle: 'Sete missões com prazo, entregável e propósito — o mês 1 é de dados, não de vendas',
    note: 'Venda nos primeiros 30 dias é exceção. O objetivo real é: leads chegando, funil entendido, ritmo estabelecido.',
    missions: [
      { day: 2,  icon: '📱', title: 'Primeira resposta documentada',  evidence: 'Print da conversa + script' },
      { day: 5,  icon: '📊', title: 'Primeiros números lidos',        evidence: 'Print do gerenciador' },
      { day: 8,  icon: '🎯', title: 'Perfil do lead mapeado',         evidence: 'Lista com classificação' },
      { day: 12, icon: '🔍', title: 'Termos e defesa do orçamento',   evidence: 'Lista de termos irrelevantes' },
      { day: 16, icon: '🎨', title: 'Criativo analisado e testado',   evidence: 'Print + variação publicada' },
      { day: 22, icon: '📈', title: 'Funil real mapeado',             evidence: 'Onde o lead some' },
      { day: 28, icon: '🏁', title: 'Balanço e calibragem',           evidence: 'Texto escrito + call' },
    ],
  },
  {
    type: 'mission',
    day: 2, number: 1, icon: '📱', deadline: 'Dia 2',
    title: 'Missão 1 — Primeira Resposta',
    instruction: 'Responda o primeiro lead que chegar em até 1h do recebimento. Cronometra o tempo real. Escreva um script de 3 linhas: o que dizer assim que o lead chega.',
    evidence: 'Print da conversa + script enviado no WhatsApp.',
    why: 'Velocidade de resposta define se o lead vira consulta ou some. O script evita que você improvise diferente toda vez.',
    color: GREEN,
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
    title: 'Missão 3 — Perfil do Lead',
    instruction: 'Classifique cada lead recebido: quente, morno ou fora do perfil. Identifique o que os bons leads têm em comum (região, problema, urgência). Faça 2 follow-ups em leads que não responderam após 48h.',
    evidence: 'Lista com classificação + resposta escrita sobre o perfil ideal.',
    why: 'Sem esse filtro você vai otimizar para CPL baixo e fechar pouco. Qualidade de lead define qualidade de resultado.',
    color: '#a78bfa',
  },
  {
    type: 'mission',
    day: 12, number: 4, icon: '🔍', deadline: 'Dia 12',
    title: 'Missão 4 — Termos e Defesa do Orçamento',
    instruction: 'Abra Termos de Pesquisa (Google) ou revisão de posicionamento (Meta). Liste 5 buscas ou contextos irrelevantes que estão consumindo verba sem resultado.',
    evidence: 'Lista enviada — eu aplico os negativos em até 24h.',
    why: 'Todo orçamento tem vazamento. Fechar esse vazamento é o ajuste de maior impacto nas primeiras semanas.',
    color: '#f59e0b',
  },
  {
    type: 'mission',
    day: 16, number: 5, icon: '🎨', deadline: 'Dia 16',
    title: 'Missão 5 — Criativo e Teste',
    instruction: 'Identifique o criativo com melhor CTR e o com pior. Escreva em 3 linhas por que acha que um performa melhor. Publique 1 variação com mudança no título ou imagem — sem pausar os outros.',
    evidence: 'Print comparando os dois + confirmação de que a variação está no ar.',
    why: 'Teste de criativo não é opcional. É a única forma de saber o que funciona para o seu público específico.',
    color: '#ec4899',
  },
  {
    type: 'mission',
    day: 22, number: 6, icon: '📈', deadline: 'Dia 22',
    title: 'Missão 6 — Funil Real',
    instruction: 'Mapeie: X leads recebidos → Y consultas agendadas ou conversas avançadas. Não meça vendas — meça até onde os leads chegaram. Identifique onde o funil trava: o lead some antes da consulta? Na proposta? Sem resposta?',
    evidence: 'Descrição do ponto de abandono mais comum enviada no WhatsApp.',
    why: 'Nos primeiros 30 dias raramente há venda — e não é essa a meta. O que vale é entender onde o processo emperra. Esse dado orienta todo o mês 2.',
    color: '#06b6d4',
  },
  {
    type: 'mission',
    day: 28, number: 7, icon: '🏁', deadline: 'Dia 28',
    title: 'Missão 7 — Balanço e Calibragem',
    instruction: 'Escreva: leads recebidos, perfil predominante, maior dificuldade no atendimento. Estime o CPV com base nos leads em andamento — se fechar nos próximos 30 dias, quanto vai custar cada cliente? Defina 3 ajustes para o mês 2.',
    evidence: 'Texto enviado antes da call de encerramento — sem ele, a call não acontece.',
    why: 'O mês 1 é de dados, não de lucro. Quem entende isso investe melhor no mês 2. Quem espera venda em 30 dias costuma pausar a campanha antes do algoritmo amadurecer.',
    color: GREEN,
  },
  {
    type: 'clock',
    title: 'O Relógio Está Correndo',
    plan: '30 dias',
    warning: 'Cada missão não entregue é um dado que não coletamos. Sem dado, sem ajuste. Sem ajuste, o mês 2 começa no escuro.',
    actions: [
      'Missão não entregue no prazo = suporte daquele ponto não acontece',
      'Campanha pausada sem aviso = dados perdidos sem motivo',
      'Suporte encerra no dia 30, independente de quanto foi usado',
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
    funnel: ['Anúncio', 'Visualização', 'Clique', 'Lead', 'Lead qualificado', 'Cliente'],
    continuous: 'Otimização contínua',
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
  // ─── BLOCO 3 — CPL Limite ─────────────────────────────────────────────────
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
  // ─── BLOCO 4 — Google Ads ─────────────────────────────────────────────────
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
      { label: 'Frequência', desc: 'Meta: acima de 3–4 o público está saturando. Hora de trocar criativo ou expandir público.' },
    ],
    note: 'Impressões e alcance não pagam conta — CPL e conversão sim',
  },
  {
    type: 'adjustments_ref',
    title: 'Tabela de decisão — o que cada cenário exige',
    subtitle: 'Quando você ver isso, faça isso — sem achismo',
    adjustments: [
      { code: 'A', situation: 'CPL alto desde o início',                           action: 'Reduz orçamento 20% e revisa os títulos — não aumenta pressão sem dado' },
      { code: 'B', situation: 'Muitos cliques, poucos leads',                      action: 'Problema na landing page ou WhatsApp — o anúncio está funcionando' },
      { code: 'C', situation: 'Leads chegam mas não fecham',                       action: 'Não é tráfego — é atendimento. Revisar script de primeiro contato' },
      { code: 'D', situation: 'Keyword com 2x CPL meta e zero leads',             action: 'Pausa e avalia virar negativo — não por valor fixo, pela distância do objetivo' },
      { code: 'E', situation: 'Criativo com 2x CPL meta por 5–7 dias',            action: 'Pausa e coloca próximo na fila — não por valor fixo' },
      { code: 'F', situation: 'Frequência Meta acima de 3–4',                      action: 'Troca criativo ou expande público — sinal de saturação' },
      { code: 'G', situation: 'Pmax sem resultado',                                action: 'Aguarda 14–21 dias — é o tempo que o algoritmo precisa para aprender' },
      { code: 'H', situation: 'Um canal com CPL muito menor que o outro',          action: 'Realoca 30% do orçamento do canal fraco para o forte — dado decide' },
    ],
    note: 'Decisão só com dados suficientes — volume pequeno não permite conclusão confiável',
  },
  // ─── BLOCO 7 — Atendimento ────────────────────────────────────────────────
  {
    type: 'list',
    title: 'Atendimento: onde a maioria perde o dinheiro',
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
    title: 'O que você faz toda semana',
    dos: [
      'Segunda-feira, 20–30 min: Termos de pesquisa Google → adicionar negativos; CPL por campanha vs meta',
      'Segunda-feira: CTR abaixo de 3% no Google → testar novo título; keyword com 2x CPL meta → pausar',
      'Segunda-feira: Frequência Meta acima de 3–4 → trocar criativo; CTR do link <1% → novo criativo',
      'Todo dia 1°, 30–40 min: comparar CPL dos canais e realocar orçamento do fraco para o forte',
    ],
    donts: [
      'Não mexe nos primeiros 7 dias de qualquer campanha nova — fase de aprendizado',
      'Não toca na Pmax antes de 14–21 dias — precisa de volume mínimo de dados para otimizar',
      'Não aumenta orçamento mais de 20% a cada 3–4 dias — mudança brusca reinicia aprendizado',
      'Não toma decisão com volume pequeno de dados — feeling não é dado',
    ],
    alert: 'Quem gerencia na emoção gasta mais e converte menos — a rotina semanal evita isso.',
  },
  // ─── BLOCO 9 — Próximos 30 dias ───────────────────────────────────────────
  {
    type: 'plan_intro',
    title: 'Seus próximos 30 dias',
    subtitle: 'O suporte começa agora. Você tem as campanhas no ar e o guia para continuar — e suporte para quando precisar.',
    points: [
      { icon: '📋', text: 'Guia Destrava com as 8 missões e ajustes A–J' },
      { icon: '🎯', text: 'Missões com prazo, entregável e consequência definida' },
      { icon: '⏱️', text: 'Suporte ativo por 30 dias a partir de hoje' },
      { icon: '🎥', text: 'Videoaulas para revisitar tudo que fizemos' },
    ],
    alert: 'O aprendizado de hoje vale zero se não for aplicado. A primeira semana define o ritmo do mês.',
  },
  {
    type: 'missions_overview',
    title: 'Plano de Execução — 30 dias',
    subtitle: 'Oito missões com prazo, entregável e consequência',
    missions: [
      { day: 3,  icon: '📱', title: 'Primeira resposta documentada', evidence: 'Print da conversa' },
      { day: 5,  icon: '📊', title: 'Leia seus números (2 canais)',  evidence: 'Print dos gerenciadores' },
      { day: 7,  icon: '🎯', title: 'Perfil do lead ideal',          evidence: '3 linhas descrevendo o cliente' },
      { day: 10, icon: '🌡️', title: 'Primeira triagem',              evidence: 'Lista: quente/morno/frio' },
      { day: 14, icon: '📈', title: 'Relatório da quinzena',         evidence: '3 perguntas respondidas' },
      { day: 18, icon: '💬', title: 'Processo de atendimento',       evidence: 'Descreve como está atendendo' },
      { day: 22, icon: '🏆', title: 'Padrão dos que fecharam',       evidence: 'O que os clientes tinham em comum' },
      { day: 28, icon: '🏁', title: 'Balanço do mês',               evidence: 'Total de leads, consultas, fechamentos' },
    ],
  },
  {
    type: 'mission',
    day: 3, number: 1, icon: '📱', deadline: 'Dia 3',
    title: 'Missão 1 — Primeira Resposta',
    instruction: 'Responda o primeiro lead que chegar em até 1 hora do recebimento.',
    evidence: 'Me manda o print da conversa no WhatsApp.',
    why: 'Velocidade de resposta define se o lead vira consulta ou some para sempre.',
    color: GREEN,
  },
  {
    type: 'mission',
    day: 5, number: 2, icon: '📊', deadline: 'Dia 5 e Dia 7',
    title: 'Missões 2 e 3 — Números e Perfil',
    instruction: 'Dia 5: print dos dois gerenciadores com impressões, cliques e leads. Dia 7: descreva em 3 linhas quem é o cliente perfeito para o seu negócio.',
    evidence: 'Dia 5: prints dos gerenciadores. Dia 7: descrição no WhatsApp.',
    extra: [
      { icon: '⚙️', text: 'Ajuste A: CPL alto → reduz orçamento 20% nos dois canais e revisa títulos' },
      { icon: '🎯', text: 'Ajuste B: Muitos cliques mas poucos leads → problema na landing page ou WhatsApp' },
    ],
    why: 'Calibrar o público no início economiza semanas de verba.',
    color: '#60a5fa',
  },
  {
    type: 'mission',
    day: 10, number: 4, icon: '🌡️', deadline: 'Dia 10 e Dia 14',
    title: 'Missões 4 e 5 — Triagem e Quinzena',
    instruction: 'Dia 10: separa os leads em Quente/Morno/Frio e me manda a lista. Dia 14: me responde 3 perguntas sobre o relatório: melhor anúncio, melhor canal, o que mudaria.',
    evidence: 'Dia 10: lista de leads triados. Dia 14: 3 respostas por escrito.',
    extra: [
      { icon: '🔵', text: 'Ajuste C: Leads chegam mas não fecham → não é tráfego, é atendimento' },
      { icon: '📘', text: 'Ajuste D: Keyword com 2x CPL meta e zero leads → pausa e avalia virar negativo' },
      { icon: '⚖️', text: 'Ajuste H: Um canal com CPL muito menor → realoca 30% do fraco para o forte' },
    ],
    why: 'A triagem revela se o problema é tráfego ou atendimento — são soluções muito diferentes.',
    color: '#ea8a29',
  },
  {
    type: 'adjustments_ref',
    title: 'Ajustes de Otimização — Referência',
    subtitle: 'Quando acionar e o que fazer em cada situação',
    adjustments: [
      { code: 'A', situation: 'CPL acima da meta definida na consultoria',     action: 'Reduz orçamento 20% + revisa títulos (ambos os canais)' },
      { code: 'B', situation: 'Muitos cliques, poucos leads',                  action: 'Problema na landing page ou WhatsApp — o anúncio está funcionando' },
      { code: 'C', situation: 'Leads chegam mas não fecham',                   action: 'Não é tráfego — é atendimento. Revisar script de primeiro contato' },
      { code: 'D', situation: 'Keyword com 2x CPL meta e zero leads',         action: 'Pausa keyword e avalia virar negativo — não por valor fixo' },
      { code: 'E', situation: 'Criativo com 2x CPL meta por 5–7 dias',        action: 'Pausa e coloca próximo na fila — não por valor fixo' },
      { code: 'F', situation: 'Frequência Meta acima de 3–4',                  action: 'Troca criativo ou expande público — sinal de saturação de público' },
    ],
    note: 'Cada ajuste tem passo a passo no Guia de Gestão — não mexa sem seguir o guia',
  },
  {
    type: 'mission',
    day: 18, number: 6, icon: '💬', deadline: 'Dia 18',
    title: 'Missão 6 — Processo de Atendimento',
    instruction: 'Descreve como está atendendo os leads: o que você fala na primeira mensagem, quando manda a proposta, qual é o tempo médio entre o lead entrar e você responder.',
    evidence: 'Pode ser áudio ou texto no WhatsApp — sem formalidade.',
    extra: [
      { icon: '💡', text: 'Script que funciona: "Oi [nome], vi que você tem interesse em [área]. Posso te fazer uma pergunta rápida?"' },
      { icon: '📝', text: 'Aguarda a resposta antes de qualquer mensagem longa — atenção antes de informação' },
    ],
    why: 'Na maioria dos casos, o problema não é o tráfego — é a abordagem no primeiro contato.',
    color: '#be29ec',
  },
  {
    type: 'mission',
    day: 22, number: 7, icon: '🏆', deadline: 'Dias 22 e 28',
    title: 'Missões 7 e 8 — Padrão e Balanço',
    instruction: 'Dia 22: o que os leads que viraram clientes tinham em comum? Origem, perfil, problema. Dia 28: total de leads, consultas, fechamentos e 1 aprendizado do mês.',
    evidence: 'Dia 22: áudio ou texto. Dia 28: balanço escrito antes da call de encerramento.',
    extra: [
      { icon: '🚀', text: 'Ajuste G: Pmax sem resultado → aguarda 14–21 dias — não interrompa o aprendizado' },
      { icon: '⏸️', text: 'Ajuste H: Um canal muito melhor → realoca 30% do canal fraco para o forte' },
      { icon: '📈', text: 'Ajuste J: CPL ok e quer mais volume → aumenta orçamento máx 20% a cada 3–4 dias' },
    ],
    why: 'O padrão dos que fecharam é o mapa para o próximo mês.',
    color: '#f59e0b',
  },
  {
    type: 'adjustments_ref',
    title: 'Escala e Otimização Final',
    subtitle: 'O que fazemos na reta final dos 30 dias',
    adjustments: [
      { code: 'G', situation: 'Pmax sem resultado nos primeiros dias',               action: 'Aguarda 14–21 dias antes de qualquer decisão — é aprendizado, não falha' },
      { code: 'H', situation: 'Um canal com CPL muito menor que o outro',            action: 'Realoca 30% do orçamento do canal fraco para o forte' },
      { code: 'I', situation: 'Lead não responde no WhatsApp',                       action: 'Troca primeira mensagem para pergunta curta e direta' },
      { code: 'J', situation: 'CPL ok, leads qualificados, quer mais volume',        action: 'Aumenta orçamento máx 20% a cada 3–4 dias — nunca de uma vez' },
    ],
    note: 'Escala gradual: o algoritmo precisa de tempo para se adaptar a cada mudança de orçamento',
  },
  {
    type: 'clock',
    title: 'O Relógio Está Correndo',
    plan: '30 dias',
    warning: 'Cada missão não entregue é um dado que não coletamos. Sem dado, sem ajuste. Sem ajuste, resultado fraco nos próximos 30 dias.',
    actions: [
      'Missão não entregue = aquele ajuste não acontece no período certo',
      'Campanha pausada sem aviso = leads zerados, verba desperdiçada',
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
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className={compact ? 'space-y-2 mt-5' : 'space-y-4 mt-8'}>
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.07 + i * 0.07 }}
            className={`flex items-start gap-3 ${compact ? 'p-3' : 'p-4'} rounded-xl`}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CheckCircle2 size={compact ? 16 : 20} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
            <span className={`text-white/85 ${compact ? 'text-sm' : 'text-lg'}`}>{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function MarketStatsSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-white/45 text-sm mt-1.5 mb-6 max-w-2xl">
        {slide.subtitle}
      </motion.p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {slide.stats.map((stat, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.1 }}
            className="p-4 rounded-2xl"
            style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}28` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{stat.icon}</span>
              <span className="text-xs font-extrabold" style={{ color: stat.color }}>{stat.platform}</span>
            </div>
            <p className="text-3xl font-extrabold text-white leading-none">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1.5 leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        {slide.insights.map((insight, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.58 + i * 0.08 }}
            className="flex items-start gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: GREEN }} />
            <p className="text-sm text-white/65 leading-snug">{insight}</p>
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
  const getWidth = (i) => Math.round(100 - i * (58 / (n - 1)))

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-12 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/55 text-base mt-2 mb-6">
        {slide.subtitle}
      </motion.p>

      <div className="flex items-stretch gap-5">
        {/* Funil */}
        <div className="flex-1 flex flex-col gap-1.5 items-center">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.35 }}
              className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold"
              style={{
                width: `${getWidth(i)}%`,
                background: `rgba(255,255,255,${0.05 + i * 0.008})`,
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'white',
              }}>
              {step}
            </motion.div>
          ))}
        </div>

        {/* Otimização contínua */}
        {slide.continuous && (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}
            className="flex items-stretch" style={{ width: '100px' }}>
            <div className="flex flex-col items-center justify-center w-full px-3 py-5 rounded-xl gap-3"
              style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
              <span style={{ color: GREEN, fontSize: '15px' }}>⟳</span>
              <span className="text-xs font-extrabold"
                style={{ color: GREEN, writingMode: 'vertical-lr', transform: 'rotate(180deg)', letterSpacing: '0.07em' }}>
                {slide.continuous}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {slide.highlight && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="mt-5 p-4 rounded-2xl"
          style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
          <p className="text-white font-semibold leading-relaxed whitespace-pre-line text-base">
            {slide.highlight}
          </p>
        </motion.div>
      )}
    </div>
  )
}

function StepsSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="space-y-5 mt-8">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }}
            className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-extrabold"
              style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}50`, color: GREEN }}>
              {i + 1}
            </div>
            <span className="text-white/85 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
      {slide.duration && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full self-start"
          style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}35`, color: GREEN }}>
          <span className="text-sm font-bold">Duração total: {slide.duration}</span>
        </motion.div>
      )}
    </div>
  )
}

function CycleSlide({ slide }) {
  const steps = slide.cycle
  const isLong = steps.length > 5
  const mid = isLong ? Math.ceil(steps.length / 2) : steps.length
  const row1 = steps.slice(0, mid)
  const row2 = isLong ? steps.slice(mid) : []

  const Pill = ({ label }) => (
    <div className="px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
      {label}
    </div>
  )

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/55 text-lg mt-3 mb-8 max-w-xl">
        {slide.subtitle}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex flex-col gap-3">

        {/* Linha 1 */}
        <div className="flex items-center gap-2">
          {row1.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <Pill label={step} />
              {(i < row1.length - 1 || row2.length > 0) && (
                <ArrowRight size={15} className="text-white/30 flex-shrink-0" />
              )}
            </div>
          ))}
          {/* Indicador de continuação */}
          {row2.length > 0 && (
            <div className="flex flex-col items-center justify-center w-5 h-10 flex-shrink-0">
              <div className="w-px h-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
          )}
        </div>

        {/* Linha 2 */}
        {row2.length > 0 && (
          <div className="flex items-center gap-2 pl-1">
            <div className="flex items-center gap-1 flex-shrink-0 mr-1">
              <div className="w-4 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <ArrowRight size={13} className="text-white/25 flex-shrink-0" />
            </div>
            {row2.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <Pill label={step} />
                {i < row2.length - 1 && (
                  <ArrowRight size={15} className="text-white/30 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-8 p-5 rounded-2xl"
        style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
        <p className="text-white font-semibold text-lg leading-relaxed whitespace-pre-line">
          {slide.highlight}
        </p>
      </motion.div>
    </div>
  )
}

function MetricsSlide({ slide }) {
  const colors = [GREEN, '#60a5fa', '#be29ec']
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {slide.metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12 }}
            className="p-6 rounded-2xl flex flex-col"
            style={{ background: `${colors[i]}10`, border: `1px solid ${colors[i]}30` }}>
            <p className="text-2xl font-extrabold mb-2" style={{ color: colors[i] }}>{m.label}</p>
            <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="mt-6 text-white/45 text-sm text-center">
        {slide.note}
      </motion.p>
    </div>
  )
}

function DiagramSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mt-8 mb-8">
        {slide.diagram.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}>
              {d}
            </div>
            {i < slide.diagram.length - 1 && <ArrowRight size={14} style={{ color: GREEN }} />}
          </div>
        ))}
      </motion.div>
      <div className="space-y-3">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: GREEN }} />
            <span className="text-white/75 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PlatformSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
        style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
        {slide.platformIcon} {slide.platform}
      </motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      {slide.concept && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="mt-4 mb-6 px-4 py-3 rounded-xl text-white font-semibold"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {slide.concept}
        </motion.div>
      )}
      {slide.diagram && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="flex items-center gap-3 mt-4 mb-6">
          {slide.diagram.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-white"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                {d}
              </div>
              {i < slide.diagram.length - 1 && <ArrowRight size={13} style={{ color }} />}
            </div>
          ))}
        </motion.div>
      )}
      <div className="space-y-3">
        {slide.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: color }} />
            <span className="text-white/75 text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PracticeSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
        className="mt-6 p-5 rounded-2xl text-center"
        style={{ background: `${color}18`, border: `1px solid ${color}45` }}>
        <p className="text-xl font-extrabold" style={{ color }}>{slide.action}</p>
      </motion.div>
      <div className="space-y-3 mt-6">
        {slide.steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-center gap-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
              style={{ background: `${color}20`, border: `1px solid ${color}45`, color }}>
              {i + 1}
            </div>
            <span className="text-white/80 text-base">{step}</span>
          </motion.div>
        ))}
      </div>
      {slide.note && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-5 text-white/40 text-sm">
          {slide.note}
        </motion.p>
      )}
    </div>
  )
}

function RulesSlide({ slide }) {
  const color = slide.platformColor || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      {slide.platform && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 self-start"
          style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
          {slide.platform}
        </motion.div>
      )}
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-2 gap-4 mt-7">
        <div>
          <p className="text-xs font-extrabold tracking-widest mb-3" style={{ color: GREEN }}>FAZER</p>
          <div className="space-y-2.5">
            {slide.dos.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-2.5">
                <CheckCircle2 size={16} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold tracking-widest mb-3" style={{ color: '#ef4444' }}>NÃO FAZER</p>
          <div className="space-y-2.5">
            {slide.donts.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-2.5">
                <XCircle size={16} style={{ color: '#ef4444' }} className="flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="mt-6 flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(234,138,41,0.1)', border: '1px solid rgba(234,138,41,0.3)' }}>
        <AlertTriangle size={16} style={{ color: '#ea8a29' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: 'rgba(234,138,41,0.9)' }}>{slide.alert}</p>
      </motion.div>
    </div>
  )
}

function GridSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {slide.cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <p className="text-3xl mb-3">{card.icon}</p>
            <p className="font-bold text-white mb-1">{card.label}</p>
            <p className="text-white/55 text-sm">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TimelineSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <div className="mt-8 space-y-5 relative">
        <div className="absolute left-[22px] top-4 bottom-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        {slide.events.map((ev, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-start gap-5 relative">
            <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold text-center leading-tight z-10"
              style={{ background: DARKER, border: `2px solid ${GREEN}`, color: GREEN }}>
              {ev.time}
            </div>
            <div className="pt-2.5">
              <p className="text-white/80 text-base">{ev.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-8 text-white/40 text-sm">
        {slide.note}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">tráfeg<span style={{ color: GREEN }}>on</span></span>
        <span className="text-white/30 text-sm">· Gerando negócios para o seu negócio</span>
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
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 self-start"
        style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, color: GREEN }}>
        📋 Plano de Execução
      </motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/55 text-lg mt-3 mb-8 max-w-xl leading-relaxed">
        {slide.subtitle}
      </motion.p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {slide.points.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
            className="flex items-center gap-3 p-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <span className="text-xl flex-shrink-0">{p.icon}</span>
            <span className="text-white/80 text-sm font-medium">{p.text}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <span className="text-lg flex-shrink-0">⚠️</span>
        <p className="text-sm font-semibold" style={{ color: 'rgba(239,68,68,0.9)' }}>{slide.alert}</p>
      </motion.div>
    </div>
  )
}

function MissionsOverviewSlide({ slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-16 max-w-4xl mx-auto w-full">
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-white/50 text-base mt-2 mb-6">{slide.subtitle}</motion.p>
      <div className="space-y-2.5">
        {slide.missions.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-4 p-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
              style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40`, color: GREEN }}>
              Dia {m.day}
            </div>
            <span className="text-lg flex-shrink-0">{m.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">{m.title}</p>
              <p className="text-[11px] text-white/40 mt-0.5">Entregável: {m.evidence}</p>
            </div>
            <div className="w-5 h-5 rounded-md flex-shrink-0"
              style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-4 text-white/30 text-xs text-center">
        {slide.note || 'Cada missão tem prazo, entregável obrigatório e consequência se não for cumprida'}
      </motion.p>
    </div>
  )
}

function MissionSlide({ slide }) {
  const color = slide.color || GREEN
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-5">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
          className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-extrabold"
          style={{ background: `${color}20`, border: `2px solid ${color}50`, color }}>
          <span className="text-lg">{slide.icon}</span>
        </motion.div>
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
            style={{ color: color + 'aa' }}>
            Prazo: {slide.deadline}
          </motion.p>
          <SlideTitle>{slide.title}</SlideTitle>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl mb-4"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-white/85 text-lg leading-relaxed">{slide.instruction}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex items-start gap-3 p-4 rounded-xl mb-4"
        style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
        <span className="text-base flex-shrink-0">📎</span>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: color + 'aa' }}>Entregável obrigatório</p>
          <p className="text-sm font-semibold text-white/85">{slide.evidence}</p>
        </div>
      </motion.div>
      {slide.extra && slide.extra.map((ex, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07 }}
          className="flex items-start gap-3 p-3.5 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-base flex-shrink-0">{ex.icon}</span>
          <p className="text-sm text-white/70">{ex.text}</p>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="text-xs">💡</span>
        <p className="text-xs text-white/45 italic">{slide.why}</p>
      </motion.div>
    </div>
  )
}

function AdjustmentsRefSlide({ slide }) {
  const COLORS = { A:'#6eda2c', B:'#60a5fa', C:'#1877f2', D:'#ef4444', E:'#f59e0b', F:'#ef4444', G:'#ea8a29', H:'#be29ec', I:'#ef4444', J:'#6eda2c' }
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
  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-20 max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
        className="text-6xl mb-6 text-center">⏳</motion.div>
      <SlideTitle>{slide.title}</SlideTitle>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-5 p-5 rounded-2xl mb-5"
        style={{ background: 'rgba(234,138,41,0.1)', border: '1px solid rgba(234,138,41,0.3)' }}>
        <p className="text-white/85 leading-relaxed">{slide.warning}</p>
      </motion.div>
      <div className="space-y-2.5 mb-6">
        {slide.actions.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.09 }}
            className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#ea8a29' }} />
            <p className="text-white/70 text-sm">{a}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 }}
        className="p-5 rounded-2xl text-center"
        style={{ background: `${GREEN}15`, border: `2px solid ${GREEN}40` }}>
        <p className="text-xl font-extrabold" style={{ color: GREEN }}>{slide.cta}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        className="mt-6 flex items-center justify-center gap-2">
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
