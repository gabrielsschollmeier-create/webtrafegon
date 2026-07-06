/* ── Conteúdo do Treinamento do Hub ──────────────────────────
   Fonte espelhada em _agencia/treinamentos/hub-trafegon.
   Estático e read-only — renderizado na aba Treinamento da Base de Conhecimento.
*/

export const TRAINING_INTRO = {
  title: 'Treinamento do Hub',
  subtitle: 'O que é cada módulo, por que existe e como usar no dia a dia.',
  note: 'Cada card é uma sessão curta: leia, faça ao vivo no sistema e conclua a checagem. Você vê menos itens que um colega de outro papel — isso é proposital.',
}

export const TRAINING_TRACKS = [
  { role: 'Colaborador / Social / Operação', blocks: '0 → 1 → 2 → 3' },
  { role: 'Vendas', blocks: '0 → 1 (Clientes) → 3' },
  { role: 'Designer / Webdesigner', blocks: '0 → 1 (Tarefas, Playbooks) → 2 (Ton) → 3' },
  { role: 'Gerente / Admin', blocks: 'Tudo (0 → 3)' },
]

export const TRAINING_BLOCKS = [
  {
    id: 'b0',
    icon: '🧭',
    color: '#60a5fa',
    title: 'Bloco 0 — Fundamentos',
    forWho: 'Todos · ~30 min',
    cards: [
      {
        id: '0.1',
        title: 'Login, perfil e notificações',
        why: 'O hub sabe quem é você — suas tarefas, seus ONS, seu portal. Tudo é atrelado ao seu login.',
        how: [
          'Acesse hub.trafegon.com.br e entre com e-mail e senha.',
          'Seu avatar (canto) mostra nome, papel e cor. Clique nele para trocar a senha.',
          'O sino de notificações avisa: tarefa atribuída, tarefa movida, prazo estourando. Clique para ir direto na tarefa.',
        ],
        doNow: 'Entre, troque sua senha e abra o sino para ver suas notificações.',
        check: 'Você diz, olhando o topo da tela, qual é o seu papel e sua cor.',
      },
      {
        id: '0.2',
        title: 'Ler a sidebar e seu acesso',
        why: 'O menu lateral é o mapa do hub. Cada papel vê só o que precisa, para não se perder.',
        how: [
          'A sidebar é dividida em blocos: Operacional, Recursos (Base IA) e Config.',
          'Você vê menos itens que um colega de outro papel — é proposital. Seu grupo de acesso liga só os módulos da sua função.',
          'Falta um módulo que você precisa? Fale com o gerente/admin — é ajuste de permissão, não bug.',
        ],
        doNow: 'Percorra cada item da sua sidebar e clique um por um, só pra ver onde vai.',
        check: 'Você nomeia todos os itens que aparecem no SEU menu.',
      },
      {
        id: '0.3',
        title: 'ONS e faixas: como você é medido',
        why: 'O hub mede consistência, não esforço solto. ONS e faixas mostram sua evolução de forma justa e visível.',
        how: [
          'ONS = pontos ganhos ao concluir tarefas, participar de rituais/reuniões e cumprir missões.',
          'Faixas (branca → azul → roxa → marrom → preta): refletem tempo de casa + consistência.',
          'Grau dentro da faixa: reflete sua produtividade (ONS acumulados).',
          'Acompanhe tudo em Equipe e Arena.',
        ],
        doNow: 'Abra Equipe, ache seu card e veja sua faixa/grau e quantos ONS você tem.',
        check: 'Você explica a diferença entre faixa (tempo/consistência) e grau (produtividade).',
      },
    ],
  },
  {
    id: 'b1',
    icon: '⚙️',
    color: '#6eda2c',
    title: 'Bloco 1 — Rotina operacional',
    forWho: 'Colaborador / Operação',
    cards: [
      {
        id: '1.1',
        title: 'Clientes e Workspace',
        why: 'Cada cliente tem um workspace — um lugar único com tudo dele: quem é, tarefas, métricas, estratégia e resultados.',
        how: [
          'Abra Clientes para ver a lista (com nicho, status e alertas de risco).',
          'Clique num cliente para abrir o Workspace dele.',
          'Navegue as abas: tarefas, métricas, estratégia e resultados.',
          'Antes de agir num cliente novo, leia o que é o negócio dele.',
        ],
        doNow: 'Abra um cliente da sua carteira e percorra todas as abas do workspace.',
        check: 'Você acha, em menos de 10 segundos, as tarefas abertas de qualquer cliente.',
      },
      {
        id: '1.2',
        title: 'Tarefas (Entregas)',
        why: 'É o painel de tudo que precisa ser entregue. Se não está aqui, não existe. É o que gera ONS e o que o gerente acompanha.',
        how: [
          'Abra Tarefas: quadro (kanban) com status a fazer → em andamento → em revisão → concluído.',
          'Criar: botão +. Escolha cliente, tipo, responsável e prazo. Use templates para tarefas repetidas.',
          'Assumir: atribua a você — a partir daí é sua responsabilidade.',
          'Mover: arraste conforme o trabalho anda. Só marque concluído quando estiver realmente entregue e revisado.',
          'Respeite os prazos: 🔴 atrasada, ⚠️ hoje, 🕐 amanhã. Vermelho é prioridade.',
        ],
        doNow: 'Assuma uma tarefa real sua, mova até "em revisão" e escreva o que foi feito.',
        check: 'Você cria uma tarefa a partir de um template e a atribui com prazo.',
        rule: 'Regra de ouro: "concluído" significa entregue de verdade. Não mova por adiantar número.',
      },
      {
        id: '1.3',
        title: 'Playbooks',
        why: 'São os passo a passo validados da agência. Antes de "inventar" como fazer algo, o processo já está escrito aqui.',
        how: [
          'Abra Playbooks: organizados por categoria (Onboarding, Tráfego, Conteúdo, Vídeo, Landing, CRM, Reuniões, Entregas, Financeiro, Geral).',
          'Busque a tarefa que vai executar e siga o passo a passo.',
        ],
        doNow: 'Ache o playbook da sua função e leia o de onboarding de cliente.',
        check: 'Você localiza o playbook certo para uma entrega comum do seu dia.',
        rule: 'Na dúvida de "como faço isso?", a primeira parada é Playbooks, não o WhatsApp do gerente.',
      },
      {
        id: '1.4',
        title: 'Dashboard e Início',
        why: 'É o seu raio-x diário — o que é prioridade hoje, o que está atrasado, onde tem risco.',
        how: [
          'Início: sua tela de entrada — resumo, avisos e atalhos do dia.',
          'Dashboard: visão geral — total de tarefas, atrasos, clientes em risco, distribuição por pessoa.',
          'Use os dois para planejar seu dia antes de sair executando.',
        ],
        doNow: 'Abra o Dashboard e liste suas 3 prioridades reais de hoje.',
        check: 'Você identifica, sozinho, o que está atrasado e o que é risco no seu dia.',
      },
    ],
  },
  {
    id: 'b2',
    icon: '🤖',
    color: '#be29ec',
    title: 'Bloco 2 — IA & Cultura',
    forWho: 'Todos que usam IA',
    cards: [
      {
        id: '2.1',
        title: 'Ton (assistente)',
        why: 'O Ton é o assistente de IA da agência. Responde dúvidas e puxa dados de Google Ads por cliente para você analisar mais rápido.',
        how: [
          'Abra o Ton e escolha o cliente — ele carrega os dados daquele cliente.',
          'Pergunte direto: "como está a campanha X?", "quais termos gastaram sem converter?".',
          'Use as respostas como ponto de partida, não como verdade final.',
        ],
        doNow: 'Abra o Ton, selecione um cliente seu e peça um resumo da conta.',
        check: 'Você sabe trocar o cliente ativo e pedir uma análise específica.',
        rule: 'O Ton acelera a análise — a decisão é sua. Nunca repasse um dado do Ton ao cliente sem conferir.',
      },
      {
        id: '2.2',
        title: 'Base de Conhecimento',
        why: 'É a memória da agência que alimenta o Ton. Sem registrar o que aprende, o Ton (e o próximo colega) fica no escuro.',
        how: [
          'Registre entradas por categoria: 👤 Cliente, 💡 Insight, ⚠️ Problema, ✅ Ação, 🎓 Aprendizado.',
          'Escreva curto e claro. Uma boa entrada hoje economiza horas depois.',
        ],
        doNow: 'Crie uma entrada de Aprendizado sobre algo real que descobriu esta semana.',
        check: 'Você classifica corretamente uma informação nas 5 categorias.',
        rule: 'Aprendeu algo relevante sobre um cliente? Registra na hora. Conhecimento na cabeça não escala.',
      },
      {
        id: '2.3',
        title: 'Agenda Interna',
        why: 'Organiza rituais, reuniões e ações da equipe — e participar deles gera ONS.',
        how: [
          'Veja os eventos: rotinas 🔄, rituais ⚡, eventos 🎯, celebrações 🎉, ações 🚀, reuniões 🤝.',
          'Cada tipo vale uma quantidade de ONS. Participar e marcar presença conta para sua evolução.',
        ],
        doNow: 'Abra a agenda e localize o próximo ritual/reunião que envolve você.',
        check: 'Você sabe onde ver os próximos eventos e quais geram ONS.',
      },
      {
        id: '2.4',
        title: 'Equipe e Arena',
        why: 'É onde sua evolução vira visível — faixas, ONS, missões do seu papel e a competição saudável da equipe.',
        how: [
          'Equipe: veja os cards de todo mundo, faixas, graus e ranking.',
          'Missões: cada papel tem missões específicas. Cumpri-las gera ONS.',
          'Arena: a camada de competição (cartas, copa). É pra engajar, não pra pressionar.',
        ],
        doNow: 'Abra Equipe, veja suas missões pendentes e escolha uma para cumprir esta semana.',
        check: 'Você identifica as missões do seu papel e como ganhar ONS com elas.',
      },
    ],
  },
  {
    id: 'b3',
    icon: '🎯',
    color: '#f59e0b',
    title: 'Bloco 3 — Cultura',
    forWho: 'Todos',
    draft: true,
    cards: [
      {
        id: '3.1',
        title: 'Nossa Missão',
        quote: 'Fazer negócios crescerem com tráfego que dá resultado de verdade — com método, transparência e gente que se importa.',
        why: 'A ferramenta muda; a cultura, não. A missão é o porquê do que a gente faz.',
        how: [
          'Cada tarefa sua existe para gerar resultado para um cliente real, não para "cumprir tabela".',
          'A gente entrega o que foi combinado e fala a verdade sobre o que funciona ou não.',
        ],
        check: 'Você liga a tarefa que está fazendo agora ao resultado do cliente.',
      },
      {
        id: '3.2',
        title: 'Nossa Visão',
        quote: 'Ser a agência de referência para quem quer método, não achismo — reconhecida pelo resultado dos clientes e por ser um lugar onde a boa gente quer trabalhar.',
        why: 'É aonde a gente quer chegar — e o que orienta as decisões de longo prazo.',
        how: [
          'A gente constrói reputação a cada entrega — cliente satisfeito é a melhor propaganda.',
          'Crescer bem depende de processo que escala (playbooks, hub, base de conhecimento), não de herói apagando incêndio.',
        ],
        check: 'Você sabe dizer o que, no seu trabalho, constrói (ou arranha) a reputação da agência.',
      },
      {
        id: '3.3',
        title: 'Nossos Valores',
        why: 'Cinco valores. Não são frase de parede — são como a gente decide no dia a dia.',
        how: [
          '1. Método, não achismo — decisão baseada em dado e processo. Antes de inventar, olhe o playbook e os números.',
          '2. Resultado do cliente acima de tudo — entrega bonita que não gera resultado não vale.',
          '3. Transparência — falar a verdade, interna e externamente. Erro comunicado a tempo é problema resolvido.',
          '4. Consistência — o que faz a diferença é aparecer todo dia e entregar. Faixas e ONS premiam isso.',
          '5. Dono do que faz — assumiu a tarefa, é sua. Resolva e peça ajuda cedo quando travar.',
        ],
        doNow: 'Escolha o valor que você mais pratica hoje e o que mais precisa melhorar.',
        check: 'Você dá um exemplo real do seu trabalho para pelo menos 3 dos 5 valores.',
      },
    ],
  },
]
