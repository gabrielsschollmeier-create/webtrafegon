import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── PALETTE ────────────────────────────────────────────────────────────────────
const G      = '#6eda2c'
const DARK   = '#1a1d2e'
const PUR    = '#7c3aed'
const ORANGE = '#f97316'
const RED    = '#f87171'
const GOLD   = '#f59e0b'
const NAVY   = '#0f2044'
const BLUE   = '#3b82f6'
const CYAN   = '#22d3ee'

// ── PRINTS REAIS ───────────────────────────────────────────────────────────────
// Coloque os arquivos em /public/palestra-caf/ e preencha o caminho aqui.
// Enquanto for null, o slide mostra a versão ilustrativa E NÃO afirma que é da Carol.
const PRINTS = {
  crmCurva:  null,  // ex: '/palestra-caf/curva-fechamentos-carol.png'
  crmFunil:  null,  // ex: '/palestra-caf/funil-carol.png'
  landing:   null,  // ex: '/palestra-caf/lp-carol.png'
  termos:    null,  // ex: '/palestra-caf/termos-pesquisa.png'
}

// ── O AVATAR DA JORNADA ────────────────────────────────────────────────────────
// Rostinho que percorre as 4 etapas no slide "A máquina rodando".
// Salve um recorte só da cabeça (quadrado, fundo transparente de preferência)
// em /public/palestra-caf/ e aponte aqui. Vazio = emoji genérico.
const AVATAR = {
  src:   null,          // ex: '/palestra-caf/rostinho.png'
  label: 'Maria',
}

// ── QUEM ESTÁ FALANDO ──────────────────────────────────────────────────────────
// Salve a foto (retrato, quadrada de preferência) em /public/palestra-caf/
// e aponte em `foto`. Vazio = o slide mostra as iniciais no lugar.
const PERFIL = {
  foto:  null,          // ex: '/palestra-caf/gabriel.jpg'
  nome:  'Gabriel',
  linhas: [
    { icone: '👵', texto: 'Neto da Doroti e do seu Milton' },
    { icone: '💍', texto: 'Casado com a Carol — advogada, dona do escritório e minha sócia' },
    { icone: '👶', texto: 'E no fim do mês, pai da Maria Júlia' },
  ],
  remate:    'Tudo o que eu vou mostrar hoje roda no escritório da Carol.',
  remateSub: 'Vocês vão ver cada tela. Não é case de cliente — é a nossa própria casa.',
}

// ── O LABORATÓRIO ──────────────────────────────────────────────────────────────
// Números reais do escritório da Carol. Enquanto for null, o slide mostra o que
// falta preencher em vez de inventar dado.
const LAB = {
  periodo:     null,  // ex: 'jan a jul de 2026'
  investido:   null,  // ex: 'R$ 12.400'
  conversas:   null,  // ex: 487
  consultas:   null,  // ex: 96
  contratos:   null,  // ex: 34
  faturamento: null,  // ex: 'R$ 148.000'
}

// ── AS TELAS DO LABORATÓRIO ────────────────────────────────────────────────────
// Deixe estas abas abertas, nesta ordem, antes de começar.
const TELAS = [
  { n: 1, min: 12, aba: 'Google — busca da área da Carol',      mostrar: 'O anúncio dela aparecendo entre os patrocinados' },
  { n: 2, min: 19, aba: 'Google Ads — a campanha da Carol',      mostrar: 'As palavras e a lista de bloqueadas' },
  { n: 3, min: 23, aba: 'Landing page da Carol',                 mostrar: 'A página inteira, do topo ao FAQ · e no celular' },
  { n: 4, min: 27, aba: 'WhatsApp do escritório',                mostrar: 'Uma conversa real, do "oi" até o agendamento' },
  { n: 5, min: 29, aba: 'O CRM',                      mostrar: 'As linhas e a conta investimento ÷ contratos' },
  { n: 6, min: 38, aba: 'O CRM — aba de resultado',         mostrar: 'Conversas, contratos e faturamento do período' },
]

// ══════════════════════════════════════════════════════════════════════════════
//   ROTEIRO DO PALESTRANTE
// ══════════════════════════════════════════════════════════════════════════════

const ROTEIRO = {
  s1: {
    min: '3–5', tag: 'Bloco I · Por que você ainda não começou',
    falas: [
      '🎬 A CENA DE ABERTURA — dez segundos, ANTES do número, com o slide já no ar: "segunda-feira, oito da manhã. A Maria acorda decidida a se separar. Ela não liga pra ninguém, não pede indicação pra ninguém. Ela pega o celular e digita. Nesse momento alguém vai aparecer pra ela." — pausa — "a pergunta é quem."',
      '"No Brasil existem 1.609.507 advogadas e advogados inscritos. Quantos você conhece que anunciam?" — pausa — "e quantos você conhece que anunciam E têm resultado?"',
      'Pausa. Não responda. Passe o slide.',
      '🔬 A PREMISSA DO LABORATÓRIO — declare agora, é o que segura a sala: "eu toco a TráfegOn e a minha sócia, a Carol, é advogada com escritório próprio. A gente não ensina teoria: testa tudo no escritório dela primeiro. Hoje vocês vão ver cada tela — o anúncio, a página, o WhatsApp, o CRM. E no fim eu mostro quanto isso deu."',
      '⚠️ Prometa os números do fim aqui. É a razão de ficarem até o minuto 41.',
    ],
    exec: [
      'Antes disso: enquete nativa do Meet — "já investiu em anúncio pago?" (nunca / tentei e parei / anuncio sem saber o resultado / sei quanto me custa uma cliente).',
      'Frase de 10s sobre OAB, sem slide: "não vou explicar OAB pra advogada. Só deixo a régua: não pode vender resultado, pode explicar direito."',
      '⚠️ Citar a fonte do número em voz alta ou no rodapé — plateia de advogadas pergunta.',
      '🖥️ PRÉ-VOO — deixe estas 6 abas abertas nesta ordem, antes de entrar no Meet:',
      '  ① Google com a busca da área da Carol · ② Google Ads na campanha dela · ③ a landing page (também no celular) · ④ o WhatsApp do escritório · ⑤ o CRM · ⑥ a aba de resultado do período',
      '⚠️ Todas com dado sensível já borrado ou com nomes trocados. Confira antes, não na hora.',
      '🔗 PONTE PARA O PRÓXIMO: "quase nenhuma anuncia. Não é falta de oportunidade. São dois motivos."',
    ],
  },
  s1b: {
    min: '5–6', tag: 'Um minuto · pertencimento, não currículo',
    falas: [
      '"Antes de continuar, quem está falando com vocês."',
      'Leia as três linhas devagar, sem justificar nenhuma: neto da Doroti e do seu Milton · casado com a Carol, advogada e minha sócia · no fim do mês, pai da Maria Júlia.',
      'O remate: "eu não vim aqui vender ferramenta. A gente vive de fazer isso funcionar — inclusive dentro de casa."',
    ],
    exec: [
      '⏱️ UM MINUTO, no máximo. Não é currículo, é pertencimento — e currículo aqui derruba a energia da abertura.',
      '📷 Coloque a foto em /public/palestra-caf/ e me avise que eu aponto em PERFIL.foto. Sem ela o slide mostra as iniciais.',
      'É esse slide que faz a sala aceitar tudo o que vem depois sobre o escritório da Carol — casado com ela explica por que você tem acesso a essas telas.',
      'Não fale de faturamento, de número de clientes nem de tempo de mercado aqui. A prova vem das telas, mais pra frente.',
    ],
  },
  s2: {
    min: '6–9', tag: 'Coração emocional · o problema, antes do mapa',
    falas: [
      'Use o resultado da enquete aqui: "olha quanta gente nessa sala nunca anunciou. Por quê? Por dois motivos."',
      'Inimigo 1: "a indicação é ótima. O problema é depender dela — ela decide sozinha quando vem. Quantos clientes você vai ter em setembro? Ninguém sabe."',
      'Inimigo 2: "a ideia de que cliente na internet só chega pra quem dança e grava story. Isso trava mais advogada do que a OAB. E tem gente que simplesmente não quer — não por preguiça, por não combinar com o jeito que exerce a profissão. É legítimo, e não devia custar o seu crescimento."',
      'A raiz: "nos dois casos você está esperando: ou a boa vontade de quem indica, ou o algoritmo gostar do seu vídeo."',
      'A saída: "no Google não tem dancinha, não tem edição, não tem constância de post. E a pessoa chega até você já querendo."',
      '✍️ AUTORAL: "eu falo isso com alguma propriedade porque a minha sócia é advogada. Eu vejo de perto o que trava uma advogada na hora de aparecer — e não é falta de vontade."',
    ],
    exec: [
      '⚠️ Alinhe essa fala com a Carol antes. Só diga o que ela autorizar sobre a experiência dela.',
      '🔗 PONTE PARA O PRÓXIMO: "e mesmo quem vence os dois costuma parar no meio. Porque olha pra isso como liga e desliga: deu certo ou não deu. E não é assim que funciona."',
    ],
  },
  s2b: {
    min: '9–11', tag: '🌐 A prova de escala · por que digital',
    falas: [
      '"Antes de falar de Google, olha onde as pessoas já estão."',
      'Leia só dois números, não os quatro: "147 milhões de brasileiros no WhatsApp. E 8,5 bilhões de buscas por dia no Google."',
      '"Setenta e seis por cento das pessoas pesquisam antes de decidir. Isso inclui decidir com qual advogada falar."',
      'O remate, apontando o Google: "só um desses lugares tem gente procurando você de propósito. É por ele que a gente começa."',
    ],
    exec: [
      '⏱️ Dois minutos. É prova de escala, não aula de mercado — não leia os quatro cards em voz alta.',
      '⚠️ Os números são de 2024. Confirme antes do dia e diga a fonte se alguém perguntar.',
    ],
  },
  s2c: {
    min: '11–13', tag: '⚖️ Por que Google primeiro',
    falas: [
      '"As duas plataformas funcionam. A diferença é o estado da pessoa."',
      '"No Google é intenção: ela digitou advogada de divórcio. Você aparece no momento exato da decisão."',
      '"No Meta é atenção: ela estava vendo outra coisa e você interrompe. Dá certo, mas você precisa criar a vontade antes."',
      'O remate que mata o inimigo 2: "comece pelo Google. Colher demanda que já existe é mais rápido, mais barato e não exige você na frente da câmera."',
      '"O Meta entra depois, quando a roda já está girando. E aí é escolha sua, não pré-requisito."',
    ],
    exec: [
      'Não deprecie conteúdo. A frase é "entra depois", nunca "não presta" — tem gente na sala que já produz.',
    ],
  },
  s3b: {
    min: '16–18', tag: '📉 A expectativa calibrada',
    falas: [
      '"Cada etapa filtra. De cem que veem, uma contrata — e isso é o normal, não o fracasso."',
      'Desça a escadinha com o dedo, dizendo os números: "cem apareceu, quarenta e cinco viu, doze clicou, quatro te chamou, duas eram da sua área, uma contratou."',
      'Aponte a divisão: "as três de cima o anúncio faz. As três de baixo é você."',
      '"E é isso que explica tudo: melhorar UMA dessas etapas multiplica tudo o que vem depois. Dobrar a última é dobrar o faturamento sem gastar um real a mais."',
      '⚠️ Diga que é ordem de grandeza: "esses números variam por área, por cidade e por atendimento. Não é promessa, é escala."',
    ],
    exec: [
      'Amarre com a escada: "repara que são os mesmos degraus que a gente acabou de ver — agora com o tamanho de cada um."',
      'Esse slide é o antídoto do dia 15. Volte nele lá no bloco do "mês não é reto".',
    ],
  },
  s3: {
    min: '13–16', tag: 'Fio condutor · volta 4 ou 5 vezes',
    falas: [
      '"Tráfego pago não é deu certo ou não deu. São oito checagens em sequência. Onde você parou é exatamente o seu problema."',
      '"O que conta como vitória muda a cada degrau. Quem só comemora contrato desiste antes de chegar no contrato."',
      '"Cada degrau é a resposta que você precisa pra tomar a próxima decisão. O degrau 7 é uma divisão — sem os números dos degraus 2, 3 e 4, não tem o que dividir."',
      'A exceção: "alguma de vocês vai fechar contrato na primeira semana. É sorte, não método — e sorte não te diz o que repetir. O maior estrago que eu já vi não foi de quem não fechou nada: foi de quem fechou um por acaso e triplicou a verba no mês seguinte."',
      '✍️ AUTORAL: "essa escada não saiu de livro nenhum. É a ordem em que eu vejo as coisas acontecerem em toda conta que a gente sobe — inclusive a do nosso próprio escritório."',
    ],
    exec: [
      'Só trabalhe no degrau seguinte ao seu.',
      'Um ajuste por vez.',
      'Só aumente a verba quando a mesma conta se repetir dois meses seguidos.',
      '💬 "Escreve no chat em que degrau você está. Vou responder por número."',
      'Não leia os oito em voz alta. Aponte três: o 1, o 4 e o 7. O resto a plateia lê sozinha.',
    ],
  },
  s4: {
    min: '15–19', tag: 'Bloco II · Peça a peça · 🖥️ busca ao vivo + 🙋 EXERCÍCIO A',
    falas: [
      '"Tráfego pago é pagar para aparecer na frente de quem tem o problema que você resolve. É escolher estar em frente ao fórum — só que na internet."',
      '🔴 A FRASE QUE MAIS DESTRAVA: "no Google, o anúncio é só texto. Um título, duas linhas e o link. Você escreve num campo e pronto. Não tem arte, não tem gravação, não tem edição."',
      '"E não precisa de site. Uma página basta."',
      '"Criar a conta é de graça e leva uns dez minutos. Você só paga quando alguém clica, define quanto pode gastar por dia e pausa quando quiser."',
      '"Na rede social você interrompe alguém que estava vendo outra coisa. No Google ela já está procurando. É a diferença entre bater na porta e atender a campainha."',
      '"Não é milagre. O tráfego não fecha contrato por você — ele abre a porta."',
    ],
    exec: [
      '🖥️ ABA ① — Google com a busca da área da Carol. Mostre o anúncio DELA entre os patrocinados: "esse aqui é o do nosso laboratório. Está no ar agora."',
      '🖥️ DEMO 1 — busca ao vivo. Peça a área no chat e digite na hora: "esses primeiros, com patrocinado escrito. É isso."',
      'Passe o mouse devagar sobre cada anúncio enquanto fala. O olho acompanha e a conta se faz sozinha.',
      '🙋 EXERCÍCIO A (min 18, um minuto): "agora vocês. Abre outra aba, busca a sua área + a sua cidade, conta quantos anúncios apareceram e escreve o número no chat."',
      'Leia os números com o nome de quem escreveu: "a Fernanda contou 4. A Camila, 6." A urgência passa a ser descoberta por elas, não dita por você.',
      'Se ninguém responder em 40 segundos, dê o seu: "eu contei 5 aqui." Isso destrava o chat.',
      'Ter 2–3 áreas já pesquisadas como backup.',
    ],
  },
  s5: {
    min: '19–23', tag: 'Degrau 1 · LEI 3 · 🙋 EXERCÍCIO B',
    falas: [
      '"Segmentada na área. Genérica na palavra." — e aponte o exemplo na tela, sempre. A frase sozinha não se explica.',
      '"O que não tem busca não tem conserto. Anuncie no nome da área, não na sua tese."',
      '🔴 A ORDEM CERTA DAS ÁREAS: "se você atende mais de uma área, comece amplo. Você precisa de volume pra roda começar a girar. Hipernichar é ótimo — mas é decisão de quem já tem escala e sabe qual área traz a melhor cliente. É problema do degrau 8, não do 1."',
      '⚖️ FAMÍLIA × SUCESSÕES — as duas rodam diferente, e vale dizer: "família decide rápido, porque é urgência: divórcio, guarda, pensão. Sucessões decide devagar, porque inventário espera luto, feriado e acordo entre irmãos. Se você faz as duas, comece pela de família — é ela que traz volume pra campanha aprender."',
      '"E o alcance é o que você realmente atende: se é presencial, sua cidade. Se você atende online, o Brasil todo."',
      '"Seis decisões. Nenhuma é técnica — são escolhas de negócio: onde você atende, o que você faz, quanto aceita gastar."',
      '"O que trava não é o Google. É achar que precisa entender o Google antes de começar."',
      'Frição: "subir é a parte fácil. O que separa quem fica é olhar toda semana a lista do que as pessoas digitaram e ir bloqueando o que não serve."',
      '✍️ AUTORAL: "essa lista de palavras bloqueadas não veio de curso. Veio de dinheiro que a gente já queimou clicando errado — no nosso escritório e nos dos clientes."',
    ],
    exec: [
      '🙋 EXERCÍCIO B (min 22, um minuto): "escreve no chat, do seu jeito: ajudo [quem] a [resolver o quê] em [cidade]."',
      '🔗 AMARRE COM O EXERCÍCIO A: "lembra daqueles anúncios que você contou lá atrás? Agora escreve o seu."',
      'Pegue TRÊS do chat e ajuste ao vivo, em voz alta. É o dia 1 da lista de 7 dias, feito dentro da palestra.',
      'Corrija sempre para o mesmo lado: mais concreto, menos jurídico. "Ajudo quem foi demitido sem receber o que tinha direito, em Florianópolis."',
      '🪜 VOLTE À ESCADA em uma frase antes de entrar: "isso aqui é o degrau 1 — a campanha no ar."',
      '📋 O DETALHE FICA NA SUA BOCA, não na tela. Ao passar por cada uma das seis, complete em voz alta:',
      '  ① Pesquisa, não as outras opções que o Google oferece · ② sua cidade se for presencial, o Brasil todo se atender online · ③ 15 a 20 palavras: "advogada de família", "advogada de divórcio", "advogada de inventário" + cidade',
      '  ④ bloqueie grátis, gratuito, defensoria, vaga, emprego, estágio, curso, concurso, OAB, modelo de petição, calculadora de pensão e "como dar entrada" · ⑤ área e cidade no título, OAB no corpo · ⑥ o valor sai do bolso todo dia, então escolha um que não doa',
      '14 dias sem mexer · recuse as sugestões automáticas do Google nos primeiros 30 dias.',
      '🖥️ ABA ② — a campanha da Carol no Google Ads. Mostre as palavras reais e role a lista de bloqueadas: "olha o tamanho dessa lista. Ela cresceu semana a semana."',
      '📸 Ou o print da lista de termos digitados, com o lixo em vermelho.',
    ],
  },
  s6: {
    min: '23–27', tag: 'Degraus 2–3 · LEI 3 · 🖥️ teste dos 5 segundos',
    falas: [
      '"Uma página por área, não uma por tese. Se o anúncio diz advogada trabalhista e a página fala de uma tese específica, você perde quem chegou. Quem filtra é a sua conversa, não a página."',
      'Frição: "essa estrutura é a que eu vejo funcionar em todas as páginas que passam pela minha mão."',
      '🎬 A MARIA AQUI: "a Maria clicou. Caiu numa página com menu, oito links e um texto sobre a história do escritório. Ela se perdeu, voltou pro Google — e clicou no anúncio de baixo."',
      'SOBRE O MENU — a distinção que quase ninguém faz: "menu que rola a própria página, tudo bem. O que não pode é link que tira a pessoa dali. Cada saída é uma cliente que não volta."',
    ],
    exec: [
      '🪜 VOLTE À ESCADA: "a página é o que decide os degraus 2 e 3 — se ela clica e se ela te chama."',
      '🖥️ DEMO 2 — teste dos 5 segundos: página ruim, 5s, tira. 💬 "Escreve no chat: o que esse escritório faz e pra quem?" Depois a boa.',
      '🖥️ ABA ③ — a landing page da Carol, aberta ao vivo. Role do topo ao FAQ devagar, apontando as 6 caixas na tela real. Depois mostre no celular.',
      'Sensação de atraso: "essa página não é nova. Ela já recebeu tráfego, já foi ajustada, já errou e já corrigiu. É por isso que ela converte."',
      'Abra também no celular ao lado — a plateia vê que funciona onde a cliente de verdade acessa.',
      '⚠️ Diga onde se faz uma página. Nomeie a ferramenta que você recomenda — é aqui que a leiga trava se não souber por onde.',
      '🗣️ A DOR EM FAMÍLIA — dê os exemplos em voz alta: "ninguém digita ação de alimentos. Ela digita ele parou de pagar a pensão. Não digita inventário extrajudicial — digita meu pai morreu e o imóvel está no nome dele. É essa frase que tem que estar na sua página."',
      '⚠️ OAB, e em família aperta mais: caso concreto é o mais tentador de virar conteúdo e o mais arriscado. Nem anonimizado. Fale do direito, nunca do caso.',
    ],
  },
  s7b: {
    min: '29–31', tag: 'Degrau 7 · 🖥️ ABA ⑤ · o CRM na tela',
    falas: [
      '"Uma linha por conversa. Só isso."',
      'Aponte a linha do meio: "repara nessa: perdeu, sem verba. Esse campo é o mais valioso da tabela — é dele que sai a próxima campanha."',
      'Aponte a última: "e essa aqui veio por indicação da Maria, que entrou por anúncio em março. É a parte de baixo da ampulheta aparecendo na tabela."',
      'A conta: "investimento do mês dividido por contratos. Se der menos que o seu honorário, está funcionando."',
      '✍️ AUTORAL: "eu faço essa conta toda sexta. Não é conceito de aula — é a rotina que me diz se o mês está de pé."',
    ],
    exec: [
      '🖥️ ABA ⑤ — abra o CRM real da Carol, role as linhas e faça a divisão ao vivo, na calculadora mesmo.',
      'Sensação de atraso: "essa base não apareceu do nada. É o acúmulo de meses anotando uma linha por conversa."',
      '📸 Nomes, telefones e valores individuais borrados.',
      '🔗 CTA DO MATERIAL AQUI (falada): "o modelo de CRM, o checklist dos 7 dias e a escada estão liberados hoje no @trafegonjuridico. Segue e comenta DEGRAU no post de hoje que eu mando na sua DM."',
      '⚠️ Peça para fazerem em outra aba e voltarem.',
    ],
  },
  s7: {
    min: '27–29', tag: 'Degraus 4–6 · o roteiro pronto',
    falas: [
      '"O objetivo não é fechar contrato no WhatsApp. É levar para uma consulta."',
      '🎬 A MARIA AQUI: "ela te mandou mensagem às duas da tarde. Você respondeu às sete. Quando você respondeu, ela já tinha consulta marcada com outra."',
      '🔗 A PONTE PARA O CRM — a plateia ainda não sente falta de anotar: "anota mesmo sem entender ainda pra quê. Daqui a dez minutos eu mostro o que esse registro salva."',
      'Plante aqui: "guarda isso — daqui a pouco eu volto nesse ponto e ele explica por que a maioria desiste."',
      'Frição: "a conta é uma divisão. O difícil é ter dado limpo pra dividir."',
      '✍️ AUTORAL: "esse CRM é a versão enxuta do que a gente usa. Começou assim, numa aba só — e ainda hoje é ele que manda no que a gente decide."',
    ],
    exec: [
      '🪜 VOLTE À ESCADA: "aqui a gente está nos degraus 4 a 7 — da conversa certa até o contrato."',
      'Bloco enxuto de propósito: a sala ainda não tem nenhuma conversa chegando. Não detalhe demais.',
      'Confirmar na véspera — é onde mais gente some.',
      'Sexta, 15 minutos: investimento ÷ contratos.',
      '🖥️ ABA ④ — o WhatsApp do escritório. Mostre uma conversa real do "oi" até o agendamento, seguindo o roteiro na tela.',
      '🖥️ ABA ⑤ — o CRM. Role as linhas e faça a divisão ao vivo, na calculadora mesmo.',
      'Mostre uma linha com "perdeu" preenchido e leia o motivo em voz alta. É o detalhe que prova que a rotina existe de verdade.',
      '🔗 CTA DO MATERIAL AQUI (falada, não está no slide de propósito): "o modelo de CRM, o checklist dos 7 dias e a escada estão liberados hoje no @trafegonjuridico. Segue e comenta DEGRAU no post de hoje que eu mando na sua DM."',
      '⚠️ Peça para fazerem em outra aba e voltarem. Não deixe a sala migrar para o Instagram no meio da palestra.',
      '📸 Nomes, telefones e valores individuais borrados.',
    ],
  },
  s8: {
    min: '12–15', tag: '🗺️ A visão geral · o mapa antes das peças',
    falas: [
      'A ABERTURA DO BLOCO II: "antes de eu explicar cada pedaço, olha o caminho inteiro. São seis etapas — e só as duas primeiras dependem de anúncio."',
      'Uma frase por etapa, sem parar: "ela pesquisa e vê o anúncio... clica e cai na página... te chama no WhatsApp... vem pra consulta... recebe a proposta... assina."',
      '"Tudo isso é do escritório da Carol. Não é case de cliente — é a nossa própria casa."',
      'O ponto que amarra: "repara que o anúncio cuida das duas primeiras. As quatro últimas são você. É por isso que campanha boa não salva atendimento ruim."',
      '"E o CRM não é uma etapa: ele fica embaixo de todas, registrando. É ele que mostra em qual delas você está perdendo."',
      '"Agora a gente volta e destrincha. Guarda essa imagem: seis etapas, uma por vez."',
      'No fim, sem dramatizar: "e isso está rodando agora, enquanto a gente conversa."',
    ],
    exec: [
      '🗺️ Passagem rápida, não aprofundamento. Três minutos — a explicação vem nos slides seguintes.',
      '⚠️ NÃO ensine preço e forma de pagamento aqui. Diga a frase da etapa 5 e siga: "forma de pagamento derruba mais objeção que desconto." Quem quiser mais, procura você depois. Aprofundar vira outra palestra.',
      '⚖️ Se couber, uma frase só sobre honorário em sucessões: "inventário é processo longo — honorário por fase resolve mais que desconto." Uma frase, e segue.',
      'Prepare as 4 abas ANTES e passe na ordem: busca no Google → página → conversa no WhatsApp → linha no CRM.',
      '😄 O rostinho que anda na trilha: salve um recorte da cabeça em /public/palestra-caf/ e aponte em AVATAR.src no topo do arquivo. Se for o seu rosto com a etiqueta "a cliente", comente a piada em uma frase e siga — não pare para explicar.',
      'Escolha uma cliente real e siga só ela — é a jornada de uma pessoa que gera desejo, não o painel cheio de números.',
      'Borre nome, telefone e valor. Autorização da Carol por escrito.',
      '⚠️ Não solte a chamada do material aqui. Ela vem depois do CRM, no minuto 31, quando o desejo está no pico.',
    ],
  },
  s9: {
    min: '31–35', tag: 'Bloco III · Como não desistir · LEI 2 · 📷 foto',
    falas: [
      'ABRA PREVENDO — ponto mais alto de autoridade: "vou dizer o que vai acontecer nos seus primeiros 30 dias. Lá pelo dia 12 você vai abrir a conta e achar caro. Lá pelo dia 15 você vai responder mais devagar. E o mês vai fechar ruim — não porque a campanha caiu, mas porque você desanimou antes dela."',
      'Só então a curva: "repara nos vinte primeiros dias." — pausa — "quem desligou no dia 15 nunca viu essa parte."',
      'Callback: "lembra do roteiro de atendimento? Ele não é do dia 1. É dos 30."',
      '"Um mês é montanha-russa. Três sobrepostos viram uma linha."',
      '✍️ AUTORAL: "eu faço essa conta toda sexta. Não é conceito de aula — é a rotina que me diz se o mês está de pé ou não."',
    ],
    exec: [
      '🔴 O gráfico é ILUSTRATIVO enquanto PRINTS.crmCurva estiver vazio. NÃO diga que é da Carol até trocar pelo print real.',
      '📸 Para trocar: exporte a curva de fechamentos por dia, salve em /public/palestra-caf/ e me avise — o slide troca sozinho e o rótulo passa a citar o escritório.',
      'A rotina diária que não muda, 15 min: responder as novas · confirmar as de amanhã · voltar a chamar quem não respondeu · anotar.',
      'Uma vez por mês, volte em quem sumiu: "quem não fechou em março pode fechar em agosto. É o contato mais barato que existe — você já pagou por ele."',
      '⚖️ EM SUCESSÕES ISSO É AINDA MAIS FORTE: "inventário não decide em 30 dias. Espera luto, espera feriado, espera os irmãos se acertarem. Quem não voltar nessa base perde contrato que já estava pago."',
    ],
  },
  s10: {
    min: '35–38', tag: 'LEI 1 · 📷 momento da foto',
    falas: [
      '"Vocês acabaram de calcular quanto custa uma cliente. Esse número está errado — e pra pior. Porque você não está comprando uma causa. Está comprando uma cliente."',
      'Descreva o desenho sem usar a palavra funil: "o caminho vai apertando até o contrato. E depois do contrato ele abre de novo."',
      '"Quem tem um problema jurídico hoje vai ter outro daqui a três anos. E ela não vai pesquisar no Google de novo — vai chamar você."',
      '"Eu comecei falando mal da indicação. Não era bem isso. A indicação é o melhor cliente que existe — o problema é depender dela sem controlar a entrada."',
      '"O tráfego pago não substitui a indicação. Ele abastece a indicação." → PAUSA DE 5 SEGUNDOS',
      '⚖️ A CADEIA DE FAMÍLIA — leia a parte de baixo na tela, devagar: "divórcio hoje. Daqui a dois anos, revisão de alimentos. Depois, guarda. Anos depois, o inventário do pai dela. É a mesma cliente, quatro vezes."',
      '"E é o nicho que mais indica: quem passou por uma separação bem conduzida indica pra amiga que está entrando em uma. Ninguém indica advogada de contrato — indica advogada de família."',
      'A BOLA DE NEVE — acompanhe as bolinhas crescendo na tela: "cada degrau de baixo devolve mais gente que o anterior. Uma cliente vira dois casos, que viram cinco conversas, que viram oito contratos. E aí volta pro topo."',
      '"O de cima você paga. O de baixo é de graça — mas só existe se o de cima estiver rodando."',
      '✍️ AUTORAL: "eu vejo isso no escritório da minha sócia. A cliente que entrou por anúncio hoje é a que traz duas por indicação depois."',
    ],
    exec: [
      'O exercício: "pega seus últimos 10 clientes: quantos voltaram? Quantos indicaram alguém? Esse é o seu multiplicador — não o meu, não o do Instagram."',
      '"Quem calcula olhando só o primeiro contrato sempre acha caro. E desiste de uma campanha que estava dando certo."',
      'Coluna "indicada por quem" no CRM · peça a indicação quando o resultado sai · uma mensagem a cada 6 meses · quem não fechou também indica.',
      '⚠️ "Conteúdo funciona — mas não pode ser pré-requisito pra começar."',
    ],
  },
  s11n: {
    min: '38–41', tag: '📊 O fecho · 🖥️ ABA ⑥',
    falas: [
      '"Lá no começo eu prometi que ia mostrar quanto isso deu. É agora."',
      'Abra a aba de resultado antes do slide. Mostre a tela real primeiro, o slide depois: "isso é o CRM que vocês viram há dez minutos, filtrado pelo período."',
      'Leia os quatro números devagar, na ordem: conversas → consultas → contratos → faturamento.',
      '"Nenhum desses números veio de sorte. Vieram dos oito degraus, na ordem — e do jeito mais chato possível: sem mexer, anotando toda semana."',
      '⚠️ Não compare com a plateia, não prometa reprodução. Diga o que é: "foi assim nesse escritório, nesse período."',
    ],
    exec: [
      '🔴 Preencha o bloco LAB no topo do arquivo. Enquanto estiver vazio, o slide mostra o aviso do que falta e não inventa número.',
      'Se o faturamento for sensível, troque por "faturamento gerado a partir do canal" ou mostre só conversas, consultas e contratos. Coerência importa mais que o número.',
      'Autorização da Carol por escrito, também para os números.',
      'É o pico de credibilidade da palestra. Depois dele vem só recap e chamada — não introduza conteúdo novo.',
    ],
  },
  s12: {
    min: '41–43', tag: 'A ação · o degrau 1 na mão',
    falas: [
      '"Nenhum passo leva mais de uma hora. Isso é o degrau 1."',
      'Passe rápido, item por item, sem detalhar. É lista de tarefa, não conteúdo novo.',
      '🔗 O DEGRAU JÁ COMEÇOU: "e repara no dia 1 — vocês já fizeram aqui comigo. É a frase que escreveram no chat. Não é tarefa futura, já começou."',
      '"Ninguém aqui vai fechar contrato essa semana. Vocês vão subir um degrau."',
    ],
    exec: [
      '⚠️ No dia 3, diga com que ferramenta se faz a página. Não deixe em aberto — é onde a leiga trava.',
      'Não termine aqui. Lista de tarefas é um final fraco: siga direto para o slide seguinte.',
    ],
  },
  s11: {
    min: '43–46', tag: '📷 ÚLTIMO SLIDE · fica na tela durante todo o Q&A',
    falas: [
      '🎬 O FECHO DO ARCO — diga ANTES das seis frases: "lembra da Maria, da segunda-feira de manhã? Ela existe. E na semana que vem ela vai digitar de novo." — pausa — "a única pergunta é se você vai estar lá."',
      '"E pra fechar, seis frases. Se vocês esquecerem tudo o que eu falei e lembrarem só dessas, já valeu."',
      'Leia as seis devagar, uma por vez. Não explique de novo — só leia. A explicação já aconteceu.',
      'As 4 perguntas: "daqui a 30 dias: quantas conversas chegaram? Quantas eram da sua área? Quanto custou cada contrato? Qual cliente te trouxe outra cliente?" — pausa — "se você não souber responder, o problema não foi a campanha."',
      'Retome a enquete: "quando a gente começou, a maioria aqui estava no degrau zero. Daqui a uma semana vocês estão no 1."',
      '"E quem sobe um degrau por semana chega antes de quem passou o ano estudando a escada."',
      'O pedido, num canal só: "me manda o print daquela busca que vocês fizeram lá atrás, na DM do @trafegonjuridico. Eu te respondo com o que dá pra fazer com o que você já tem."',
    ],
    exec: [
      '📲 DEIXE ESTE SLIDE NA TELA DURANTE TODO O Q&A. É aqui que a conversão acontece — celular na mão, as seis frases e o @ visíveis.',
      'Dê 5 segundos de silêncio depois da sexta frase. É o slide da foto.',
      'O pedido do print tem lastro: elas JÁ fizeram a busca no exercício A. É só mandar.',
      'Repita o convite uma vez no meio das perguntas, sem insistir.',
      'Se o tempo apertar, corte o slide anterior — nunca este.',
    ],
  },
}

function Roteiro({ id }) {
  const r = ROTEIRO[id]
  if (!r) {
    return (
      <div className="h-full flex items-center justify-center text-white/40 text-sm" style={{ background: '#0f1018' }}>
        Roteiro ainda não escrito para este slide.
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col p-8 gap-4 overflow-auto" style={{ background: '#0f1018' }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="px-3 py-1 rounded-lg text-sm font-black tabular-nums" style={{ background: G, color: DARK }}>{r.min} min</span>
        <span className="text-white/60 text-sm font-semibold">{r.tag}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>O que falar</div>
        {r.falas.map((f, i) => (
          <div key={i} className="rounded-xl px-5 py-3 text-white/90 text-[15px] leading-relaxed"
            style={{ background: '#1e2035', borderLeft: `3px solid ${G}` }}>{f}</div>
        ))}
      </div>

      {r.exec.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Execução e marcações</div>
          {r.exec.map((e, i) => (
            <div key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
              <span style={{ color: GOLD }}>▸</span><span>{e}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Wrap({ mode, id, children }) {
  return mode === 'roteiro' ? <Roteiro id={id} /> : children
}

// ── átomos visuais ─────────────────────────────────────────────────────────────

function Degrau({ n }) {
  return (
    <div className="absolute right-10 text-[11px] font-black tracking-widest text-white/25 z-10"
      style={{ bottom: 17 }}>
      DEGRAU {n}
    </div>
  )
}

// A Maria acompanhando a apresentação: aparece flutuando no canto de cada
// slide em que ela está vivendo aquela etapa.
function Maria({ diz, direita = 28, baixo = 58 }) {
  return (
    <motion.div className="absolute z-20 flex items-end gap-2"
      style={{ right: direita, bottom: baixo, maxWidth: 320 }}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
      <div className="rounded-2xl rounded-br-sm px-4 py-2"
        style={{ background: G, color: DARK, boxShadow: '0 6px 20px rgba(0,0,0,0.35)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Maria</div>
        <div className="text-[13px] font-bold leading-snug">{diz}</div>
      </div>
      <motion.div className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ width: 44, height: 44, background: G, border: `2px solid ${DARK}` }}
        animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        {AVATAR.src
          ? <img src={AVATAR.src} alt="Maria" className="w-full h-full object-cover" />
          : <span className="text-xl">👤</span>}
      </motion.div>
    </motion.div>
  )
}

function Handle() {
  return (
    <div className="absolute left-10 right-10 flex items-center gap-2 z-10 pointer-events-none"
      style={{ bottom: 14 }}>
      <span className="text-[13px]">📲</span>
      <span className="text-[12px] font-black tracking-wide" style={{ color: '#ffffff', opacity: 0.8 }}>
        @trafegonjuridico
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   SLIDES
// ══════════════════════════════════════════════════════════════════════════════

// 1 · A OPORTUNIDADE ───────────────────────────────────────────────────────────
function S01({ mode }) {
  return (
    <Wrap mode={mode} id="s1">
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)` }}>
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: 180 + i * 100, height: 180 + i * 100, border: '1.5px solid rgba(255,255,255,0.1)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 6, repeat: Infinity, ease: 'linear' }} />
        ))}
        <motion.div className="relative z-10 text-center px-10"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest mb-6"
            style={{ background: G, color: NAVY }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            DO ZERO AO PRIMEIRO CONTRATO
          </motion.div>
          <motion.div className="font-black text-white leading-none"
            style={{ fontSize: '7rem', letterSpacing: '-5px', textShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            1.609.507
          </motion.div>
          <motion.div className="text-white/70 text-lg font-semibold mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            advogadas e advogados inscritos na OAB
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
            className="inline-block px-10 py-4 rounded-full font-black text-white text-2xl shadow-2xl"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>
            E quantos você conhece que anunciam e têm resultado?
          </motion.div>
        </motion.div>
        <Handle />
      </div>
    </Wrap>
  )
}

// 1B · QUEM ESTÁ FALANDO ───────────────────────────────────────────────────────
function S1B({ mode }) {
  const iniciais = PERFIL.nome.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Wrap mode={mode} id="s1b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.h2 className="text-3xl font-black text-white leading-none"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          Quem está falando com vocês
        </motion.h2>

        <div className="flex items-center gap-9">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, delay: 0.1 }}
            className="flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden"
            style={{ width: 210, height: 210, border: `3px solid ${G}`, boxShadow: `0 0 40px ${G}30`, background: 'rgba(0,0,0,0.3)' }}>
            {PERFIL.foto
              ? <img src={PERFIL.foto} alt={PERFIL.nome} className="w-full h-full object-cover" />
              : <span className="font-black text-6xl" style={{ color: G, opacity: 0.5 }}>{iniciais}</span>}
          </motion.div>

          <div className="flex-1 flex flex-col gap-3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="font-black text-white" style={{ fontSize: '2.6rem', letterSpacing: '-1.5px', lineHeight: 1 }}>
              {PERFIL.nome}
            </motion.div>
            {PERFIL.linhas.map((l, i) => (
              <motion.div key={l.texto} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 rounded-xl px-5 py-2.5"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <span className="text-xl">{l.icone}</span>
                <span className="text-white/90 text-[15px] font-semibold">{l.texto}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-5"
          style={{ background: G + '14', border: `1.5px solid ${G}55` }}>
          <span className="text-3xl">⚖️</span>
          <div>
            <p className="text-white font-black text-lg leading-snug">{PERFIL.remate}</p>
            <p className="text-white/70 text-sm mt-0.5">{PERFIL.remateSub}</p>
          </div>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 2 · OS DOIS INIMIGOS ─────────────────────────────────────────────────────────
function S02({ mode }) {
  const inimigos = [
    { icon: '📞', color: RED,    t: 'Depender de indicação',
      d: 'A indicação é ótima. O problema é depender dela — ela decide sozinha quando vem.',
      p: '"Quantos clientes você vai ter em setembro? Ninguém sabe."' },
    { icon: '💃', color: ORANGE, t: 'Ter que fazer dancinha e gravar vídeo',
      d: 'A ideia de que cliente na internet só chega pra quem dança e grava story.',
      p: '"Trava mais advogada do que a OAB."' },
  ]
  return (
    <Wrap mode={mode} id="s2">
      <div className="h-full flex flex-col px-10 pt-8 pb-12 gap-5 justify-center relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.h2 className="text-4xl font-black text-white text-center"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          Os dois inimigos
        </motion.h2>

        <div className="grid grid-cols-2 gap-5">
          {inimigos.map((x, i) => (
            <motion.div key={x.t}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-7 flex flex-col gap-3"
              style={{ background: x.color + '0d', border: `1px solid ${x.color}30` }}>
              <div className="text-4xl">{x.icon}</div>
              <div className="font-black text-2xl leading-tight" style={{ color: x.color }}>{x.t}</div>
              <div className="text-white/80 text-sm leading-relaxed">{x.d}</div>
              <div className="text-white/55 text-sm italic mt-auto">{x.p}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="rounded-xl px-7 py-4 text-center" style={{ background: '#1e2035' }}>
          <p className="text-white/85 text-base">
            Nos dois casos você está <span className="font-black text-white">esperando</span>: ou a boa vontade de quem indica, ou o algoritmo gostar do seu vídeo.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-2xl px-8 py-5 text-center" style={{ background: G + '14', border: `1.5px solid ${G}55` }}>
          <p className="text-white font-black text-xl">
            No Google não tem dancinha, não tem edição, não tem constância de post.
          </p>
          <p className="text-white/75 text-base mt-1">E a pessoa chega até você <span className="font-black" style={{ color: G }}>já querendo</span>.</p>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 2B · O MERCADO ───────────────────────────────────────────────────────────────
function S2B({ mode }) {
  const stats = [
    { plat: 'Instagram', valor: '122 mi', label: 'usuários ativos no Brasil',                cor: '#be29ec', icon: '📸' },
    { plat: 'Facebook',  valor: '111 mi', label: 'usuários ativos no Brasil',                cor: '#1877f2', icon: '👥' },
    { plat: 'WhatsApp',  valor: '147 mi', label: 'brasileiros — 2º maior mercado do mundo',  cor: '#25d366', icon: '💬' },
    { plat: 'Google',    valor: '8,5 bi', label: 'buscas realizadas por dia no mundo',       cor: '#4285f4', icon: '🔍' },
  ]
  const insights = [
    '76% dos consumidores pesquisam no Google antes de decidir',
    '180 milhões de brasileiros com acesso à internet',
    'O brasileiro passa 9h por dia online — o maior tempo do mundo',
    'Quem não aparece na hora certa simplesmente não existe para essa pessoa',
  ]
  return (
    <Wrap mode={mode} id="s2b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Onde as pessoas já estão</h2>
          <p className="text-white/60 text-sm mt-1.5">
            Não é sobre gostar de internet. É sobre estar onde está a atenção das pessoas
            <span className="ml-1.5 text-base align-middle">👀</span>
            <span className="ml-1 text-base align-middle">👂</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.plat}
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-5 flex flex-col gap-1"
              style={{ background: s.cor + '10', border: `1px solid ${s.cor}38` }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: s.cor }}>{s.plat}</span>
              </div>
              <div className="font-black text-white leading-none" style={{ fontSize: '2.6rem', letterSpacing: '-2px' }}>
                {s.valor}
              </div>
              <div className="text-white/60 text-[12px] leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 flex-1">
          {insights.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.09 }}
              className="rounded-xl px-5 flex items-center gap-3" style={{ background: '#0f1018' }}>
              <span style={{ color: G }}>↗</span>
              <span className="text-white/85 text-[13px] leading-snug">{t}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </Wrap>
  )
}

// 2C · GOOGLE E META ───────────────────────────────────────────────────────────
function S2C({ mode }) {
  const logicas = [
    { icon: '🔍', t: 'Google = intenção', cor: G,
      d: 'Captura quem já está procurando. Ela digitou "advogada de divórcio" — você aparece no momento exato da decisão.' },
    { icon: '📲', t: 'Meta = atenção', cor: BLUE,
      d: 'Interrompe quem ainda não sabe que quer. Você desperta a necessidade antes de a busca existir.' },
    { icon: '🚀', t: 'Os dois juntos', cor: ORANGE,
      d: 'Captura quem está pronta agora e gera lembrança em quem ainda não está. É o cenário completo.' },
  ]
  return (
    <Wrap mode={mode} id="s2c">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 justify-center relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Lógicas opostas que se completam</h2>
          <p className="text-white/55 text-sm mt-1.5">As duas funcionam. Mas elas não entram na mesma hora.</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {logicas.map((l, i) => (
            <motion.div key={l.t}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: l.cor + '0d', border: `1px solid ${l.cor}38` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: l.cor + '1a', border: `1px solid ${l.cor}40` }}>{l.icon}</div>
              <div className="font-black text-xl leading-tight" style={{ color: l.cor }}>{l.t}</div>
              <div className="text-white/75 text-[13px] leading-relaxed">{l.d}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </Wrap>
  )
}

// 3 · A ESCADA ─────────────────────────────────────────────────────────────────
const DEGRAUS = [
  { n: 1, fato: 'Campanha no ar',                 ajuste: 'Não mexer por 14 dias' },
  { n: 2, fato: 'Apareceram cliques',             ajuste: 'Ver o que digitaram e bloquear o que não serve' },
  { n: 3, fato: 'Alguém te chamou',               ajuste: 'Repetir na página as palavras que trouxeram' },
  { n: 4, fato: 'Chamou alguém da sua área',      ajuste: 'Bloquear o resto, investir no que acertou' },
  { n: 5, fato: 'Marcou consulta',                ajuste: 'Padronizar o roteiro e o tempo de resposta' },
  { n: 6, fato: 'Apareceu na consulta',           ajuste: 'Lembrete na véspera' },
  { n: 7, fato: 'Assinou contrato',               ajuste: 'investimento ÷ contratos' },
  { n: 8, fato: 'Assinou de novo, mesma palavra', ajuste: 'Crescer de propósito' },
]

function S03({ mode }) {
  const cor = n => (n <= 3 ? G : n <= 7 ? GOLD : PUR)
  return (
    <Wrap mode={mode} id="s3">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
          <h2 className="text-3xl font-black text-white leading-none">Em que degrau você está?</h2>
          <p className="text-white/60 text-sm mt-1.5">
            Não é "deu certo ou não deu". São oito, na ordem — e cada um libera
            <span className="font-black" style={{ color: G }}> um</span> ajuste.
          </p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="relative w-full" style={{ maxWidth: 940 }}>
            {/* faixas dos estágios */}
            <div className="absolute left-0 flex flex-col gap-1" style={{ top: 0, bottom: 0, width: '2.4%' }}>
              {[
                { l: 'CRESCER', c: PUR,  f: 1 },
                { l: 'MEDIR',   c: GOLD, f: 4 },
                { l: 'EXISTIR', c: G,    f: 3 },
              ].map(z => (
                <div key={z.l} className="rounded flex items-center justify-center overflow-hidden"
                  style={{ flex: z.f, background: z.c + '12', border: `1px solid ${z.c}30` }}>
                  <span className="font-black text-[10px] tracking-widest whitespace-nowrap"
                    style={{ color: z.c, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{z.l}</span>
                </div>
              ))}
            </div>

            {/* a escada */}
            <div className="flex flex-col" style={{ marginLeft: '4.5%' }}>
              {[...DEGRAUS].reverse().map((d, i) => (
                <motion.div key={d.n}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (7 - i) * 0.07, type: 'spring', stiffness: 190 }}
                  className="flex items-center gap-3 px-3"
                  style={{
                    width: '54%',
                    height: 52,
                    marginLeft: `${(d.n - 1) * 5.8}%`,
                    background: cor(d.n) + '14',
                    borderTop: `2px solid ${cor(d.n)}`,
                    borderRight: `1px solid ${cor(d.n)}30`,
                    borderTopRightRadius: 6,
                  }}>
                  <div className="rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                    style={{ width: 32, height: 32, background: cor(d.n) + '2a', color: cor(d.n) }}>{d.n}</div>
                  <div className="min-w-0">
                    <div className="text-white font-black text-[15px] leading-tight truncate">{d.fato}</div>
                    <div className="text-[11.5px] leading-tight truncate" style={{ color: cor(d.n), opacity: 0.85 }}>
                      → {d.ajuste}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 3B · DA INTERNET AO CONTRATO ─────────────────────────────────────────────────
function S3B({ mode }) {
  const etapas = [
    { t: 'Anúncio',           p: '100%', icon: '📢', cor: '#5b6289' },
    { t: 'Visualização',      p: '45%',  icon: '👁️', cor: BLUE },
    { t: 'Clique',            p: '12%',  icon: '🖱️', cor: CYAN },
    { t: 'Contato',           p: '4%',   icon: '📥', cor: GOLD },
    { t: 'Contato certo',     p: '2%',   icon: '✅', cor: ORANGE },
    { t: 'Cliente',           p: '1%',   icon: '🤝', cor: G },
  ]
  return (
    <Wrap mode={mode} id="s3b">
      <div className="h-full flex flex-col px-10 pt-5 pb-12 gap-2.5 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Da internet ao contrato</h2>
          <p className="text-white/50 text-sm mt-1">Cada etapa filtra — só uma parte chega ao final.</p>
        </motion.div>

        {/* Os dois anúncios */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl px-4 py-2.5" style={{ background: '#4285f410', border: '1px solid #4285f435' }}>
            <div className="text-[10px] mb-0.5" style={{ color: '#8ab4f8' }}>🔍 Anúncio · advogadacaroline.com.br</div>
            <div className="text-[14px] font-bold underline" style={{ color: '#8ab4f8' }}>Advogada de Família em Florianópolis</div>
            <div className="text-[10.5px] text-white/50 mt-0.5">Divórcio, guarda e pensão · OAB/SC 00.000 · Falar agora</div>
            <div className="flex gap-1.5 mt-1.5">
              {['Divórcio', 'Guarda', 'Inventário'].map(s => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#4285f41e', color: '#8ab4f8' }}>{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
            className="rounded-xl px-4 py-2.5" style={{ background: '#be29ec10', border: '1px solid #be29ec35' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full block" style={{ width: 18, height: 18, background: 'linear-gradient(135deg,#f58529,#dd2a7b)' }} />
                <span className="text-[12px] text-white/85 font-semibold">@advogadacaroline</span>
              </div>
              <span className="text-[9.5px]" style={{ color: '#d98fee' }}>Patrocinado</span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="rounded flex items-center justify-center text-base"
                style={{ width: 38, height: 38, background: '#be29ec1e' }}>📸</span>
              <div>
                <div className="text-[12px] text-white/70">Criativo do anúncio</div>
                <div className="text-[12px] font-bold" style={{ color: '#d98fee' }}>Saiba mais ›</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
          <span className="text-white/30 text-sm">↓</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
        </div>

        {/* As etapas */}
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: 34 }}>
            {[
              { l: 'Gerar demanda', c: '#60a5fa' },
              { l: 'Converter',     c: G },
            ].map(z => (
              <div key={z.l} className="rounded-lg flex items-center justify-center flex-1 overflow-hidden"
                style={{ background: z.c + '10', border: `1px solid ${z.c}30` }}>
                <span className="font-black text-[11px] whitespace-nowrap"
                  style={{ color: z.c, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{z.l}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            {etapas.map((e, i) => (
              <motion.div key={e.t}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.09, type: 'spring', stiffness: 170 }}
                className="rounded-lg px-4 py-2 flex items-center justify-between gap-4"
                style={{
                  marginLeft: i * 26, marginRight: i * 12,
                  background: e.cor + '14', border: `1px solid ${e.cor}40`,
                }}>
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">{e.icon}</span>
                  <span className="font-bold text-white text-[15px]">{e.t}</span>
                </span>
                <span className="font-black text-[15px] tabular-nums" style={{ color: e.cor }}>{e.p}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex-shrink-0 rounded-lg flex items-center justify-center" style={{ width: 40, background: G + '0d', border: `1px solid ${G}28` }}>
            <div style={{ writingMode: 'vertical-rl' }} className="py-2 text-center">
              <span className="font-black text-[11px]" style={{ color: G }}>↻ Otimização contínua</span>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 4 · COMO FUNCIONA ────────────────────────────────────────────────────────────
function S04({ mode }) {
  const caminho = ['ela digita', 'vê seu anúncio', 'clica', 'cai na sua página', 'te chama no WhatsApp']
  const regras = [
    { icon: '👆', t: 'Só paga quando clicam' },
    { icon: '🔒', t: 'Você define o teto do dia' },
    { icon: '⚖️', t: 'Página melhor paga menos' },
  ]
  return (
    <Wrap mode={mode} id="s4">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 justify-center relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-3xl font-black text-white leading-none">Como isso funciona, na prática</h2>
        </motion.div>

        {/* O caminho */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-1.5">
          {caminho.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex-1 flex items-center gap-1.5">
              <div className="flex-1 rounded-lg py-2 px-2 text-center text-[13px] font-bold text-white/85"
                style={{ background: i === 4 ? G + '1a' : '#1e2035', border: i === 4 ? `1px solid ${G}55` : 'none' }}>
                {c}
              </div>
              {i < 4 && <span className="text-white/25 text-sm">→</span>}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex-1 grid gap-4" style={{ gridTemplateColumns: '1.15fr 1fr' }}>
          {/* O anúncio é texto */}
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: G + '10', border: `1.5px solid ${G}45` }}>
            <div className="font-black text-white text-lg leading-tight">
              No Google, o anúncio é <span style={{ color: G }}>só texto</span>.
            </div>
            <div className="rounded-lg px-4 py-3" style={{ background: 'white' }}>
              <div className="text-[10px] font-bold text-gray-700 mb-0.5">Patrocinado</div>
              <div className="text-[15px] font-bold" style={{ color: '#1a0dab' }}>Advogada de Família em Florianópolis</div>
              <div className="text-[11px] text-gray-600 leading-snug mt-0.5">
                Divórcio, guarda e pensão. OAB/SC 00.000.<br />Atendimento com hora marcada, presencial ou online.
              </div>
            </div>
            <div className="text-white/75 text-[13px] leading-relaxed">
              Um título, duas linhas e o link. Você escreve num campo e pronto.
              <span className="text-white font-bold"> Sem arte, sem gravação, sem edição.</span>
            </div>
          </motion.div>

          {/* Regras do dinheiro + a conta */}
          <div className="flex flex-col gap-2.5">
            {regras.map((r, i) => (
              <motion.div key={r.t} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: '#0f1018' }}>
                <span className="text-xl">{r.icon}</span>
                <span className="text-white/85 text-[13px] font-semibold">{r.t}</span>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}
              className="rounded-xl px-4 py-3 flex-1 flex flex-col justify-center" style={{ background: BLUE + '12', border: `1px solid ${BLUE}35` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#93c5fd' }}>Antes que você pergunte</div>
              <div className="text-white/85 text-[13px] leading-relaxed">
                Criar a conta é <span className="text-white font-bold">de graça</span> e leva uns 10 minutos.
                Você <span className="text-white font-bold">não precisa de site</span> — uma página basta. E dá pra pausar quando quiser.
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </Wrap>
  )
}

// 5 · A CAMPANHA ───────────────────────────────────────────────────────────────
function S05({ mode }) {
  const passos = [
    { n: '1', t: 'Tipo de campanha',  d: 'Pesquisa', nota: 'o anúncio que aparece quando alguém digita' },
    { n: '2', t: 'Onde aparecer',     d: 'Florianópolis + 20 km', nota: 'ou o Brasil todo, se você atende online' },
    { n: '3', t: 'As palavras',       d: '"advogada de família florianópolis" · "advogada de divórcio florianópolis" · "advogada de inventário florianópolis"', exemplo: true },
    { n: '4', t: 'O que bloquear',    d: 'grátis · defensoria · curso · concurso · modelo de petição · calculadora de pensão' },
    { n: '5', t: 'O texto do anúncio', d: '"Advogada de Família em Florianópolis — OAB/SC 00.000. Divórcio, guarda e pensão."' },
    { n: '6', t: 'Quanto por dia',    d: 'R$ ____ , fixo', nota: 'o mesmo valor todos os dias, por 30 dias' },
  ]
  return (
    <Wrap mode={mode} id="s5">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Degrau n={1} />
        <Maria diz="Digitei advogada de família e vi o seu anúncio." />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">A sua campanha, preenchida</h2>
          </div>
          <p className="text-sm mt-1.5 font-bold" style={{ color: '#c4b5fd' }}>
            Segmentada na área. Genérica na palavra.
            <span className="text-white/45 font-medium"> — é este o preenchimento que você copia e adapta.</span>
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {passos.map((p, i) => (
            <motion.div key={p.n} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-lg px-4 py-2 flex items-start gap-3" style={{ background: '#0f1018' }}>
              <span className="w-6 h-6 rounded flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
                style={{ border: `1.5px solid ${G}`, color: G }}>{p.n}</span>
              <span className="text-white/50 text-[13px] font-semibold flex-shrink-0 mt-0.5" style={{ width: 158 }}>{p.t}</span>
              <span className="flex-1">
                <span className="font-bold text-[14px]" style={{ color: G }}>{p.d}</span>
                {p.nota && <span className="text-white/40 text-[12px]"> — {p.nota}</span>}
                {p.exemplo && (
                  <span className="block text-[12px] mt-0.5">
                    <span style={{ color: RED }}>✕</span>
                    <span className="text-white/40 line-through"> "ação revisional de alimentos retroativa" — ninguém digita isso</span>
                  </span>
                )}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2.5 flex-shrink-0">
          <div className="flex-1 rounded-xl px-4 py-2.5 text-center" style={{ background: BLUE + '14', border: `1px solid ${BLUE}40` }}>
            <span className="font-black text-sm" style={{ color: '#93c5fd' }}>Quanto investir? </span>
            <span className="text-white/80 text-[13px]">Aceite pagar até 20% do que uma cliente te paga.</span>
          </div>
          <div className="flex-1 rounded-xl px-4 py-2.5 text-center" style={{ background: GOLD + '14', border: `1px solid ${GOLD}35` }}>
            <span className="font-black text-sm" style={{ color: GOLD }}>99% das vezes,</span>
            <span className="text-white/70 text-[13px]"> recuse as recomendações do Google.</span>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 6 · A PÁGINA ─────────────────────────────────────────────────────────────────
function S06({ mode }) {
  const caixas = [
    { n: 1, t: 'Título',        d: 'Advogada de Família em Florianópolis' },
    { n: 2, t: 'Subtítulo',     d: 'Atendimento por Caroline Pagani — OAB/SC 55.141' },
    { n: 3, t: 'Botão',         d: 'Falar com a advogada agora', destaque: true },
    { n: 4, t: 'A dor',         d: '"Ele parou de pagar a pensão e você não sabe por onde começar."' },
    { n: 5, t: 'Como funciona', d: '1 Você me chama · 2 A gente marca a consulta · 3 Você sai com o caminho claro' },
    { n: 6, t: 'FAQ + botão',   d: '"Quanto custa?" · "Quanto demora?" · "Precisa ser presencial?"' },
  ]
  return (
    <Wrap mode={mode} id="s6">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Degrau n="2–3" />
        <Maria diz="Cliquei. Agora quero saber se você resolve o meu caso." />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">A sua página, escrita</h2>
          </div>
          <p className="text-white/55 text-sm mt-2">Seis caixas, de cima pra baixo — e é este o texto que vai dentro de cada uma.</p>
        </motion.div>

        <div className="flex-1 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="flex flex-col gap-1.5 justify-center">
            {caixas.map((c, i) => (
              <motion.div key={c.n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="rounded-lg px-4 py-2 flex items-start gap-3"
                style={c.destaque
                  ? { background: G + '18', border: `1.5px solid ${G}` }
                  : { background: '#1e2035', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] font-black w-3 flex-shrink-0 mt-0.5" style={{ color: c.destaque ? G : '#5b6289' }}>{c.n}</span>
                <span className="text-[11px] font-semibold text-white/40 flex-shrink-0 mt-0.5" style={{ width: 88 }}>{c.t}</span>
                <span className="text-[13px] leading-snug flex-1"
                  style={{ color: c.destaque ? G : 'rgba(255,255,255,0.92)', fontWeight: c.destaque ? 800 : 500 }}>
                  {c.d}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: BLUE + '12', border: `1px solid ${BLUE}35` }}>
              <div className="font-black text-white text-base mb-1">O teste dos 5 segundos</div>
              <div className="text-white/75 text-sm leading-relaxed">
                Mostre a página por 5 segundos e pergunte: <span className="italic">"o que esse escritório faz e pra quem?"</span> Se ninguém responder, a página está morta.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-5 grid grid-cols-2 gap-x-5 gap-y-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>Precisa ter</div>
              <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: RED }}>Não pode ter</div>
              <div className="flex flex-col gap-1.5">
                {['Um botão só de contato', 'Foto real sua', 'Abre em 3s no celular'].map(x => (
                  <div key={x} className="text-white/85 text-[13px] flex gap-2 leading-snug"><span style={{ color: G }}>✓</span>{x}</div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {['Link que leve pra fora', 'Formulário longo', '"Fundado em 1998" no topo'].map(x => (
                  <div key={x} className="text-white/85 text-[13px] flex gap-2 leading-snug"><span style={{ color: RED }}>✕</span>{x}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 7 · AS CINCO MENSAGENS ───────────────────────────────────────────────────────
const MENSAGENS = [
  { quando: 'Na hora',    cor: G,
    texto: 'Oi, Maria! Aqui é a Caroline, advogada. Vi que você me chamou sobre pensão. Posso te fazer três perguntas rápidas pra entender o seu caso?' },
  { quando: 'Em seguida', cor: G,
    texto: 'O que aconteceu? Desde quando está assim? Você já conversou com algum advogado antes?' },
  { quando: 'Para fechar', cor: GOLD,
    texto: 'Entendi, Maria. Isso a gente resolve — mas preciso ver seus documentos com calma. Consigo te atender quinta às 14h ou sexta às 10h. Qual fica melhor?' },
  { quando: 'Na véspera',  cor: GOLD,
    texto: 'Oi, Maria! Passando pra confirmar a nossa consulta amanhã às 14h. Pode trazer o que você tiver de documento — mesmo que esteja incompleto.' },
  { quando: 'Se sumiu',    cor: ORANGE,
    texto: 'Oi, Maria, tudo bem? Fiquei à disposição pra falar do seu caso quando você puder. Se quiser, me diz um horário que eu me organizo.' },
]

function S07({ mode }) {
  return (
    <Wrap mode={mode} id="s7">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Degrau n="4–6" />
        <Maria diz="Te chamei no WhatsApp. Você respondeu em quanto tempo?" />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">As cinco mensagens</h2>
          <p className="text-white/55 text-sm mt-1.5">Copie, troque o nome e use. Da primeira resposta até quem sumiu.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-2 justify-center">
          {MENSAGENS.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.09 }}
              className="flex items-start gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest flex-shrink-0 text-right pt-2"
                style={{ width: 108, color: m.cor }}>{m.quando}</span>
              <div className="rounded-xl rounded-tl-sm px-4 py-2 text-white/90 text-[13.5px] leading-snug"
                style={{ background: '#12351f', border: '1px solid rgba(110,218,44,0.22)', maxWidth: 760 }}>
                {m.texto}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl px-6 py-3 flex-shrink-0" style={{ background: RED + '10', border: `1px solid ${RED}28` }}>
          <span className="text-white/85 text-sm">Nunca consultar de graça. </span>
          <span className="font-black text-sm" style={{ color: RED }}>O objetivo não é fechar contrato no WhatsApp, é levar para uma consulta.</span>
        </div>
      </div>
    </Wrap>
  )
}

// 8B · O CRM ───────────────────────────────────────────────────────────────────
function S07B({ mode }) {
  const colunas = [
    { t: 'Nova',       cor: '#5b6289', cards: [
      { n: 'Juliana R.', d: 'Google · divórcio' },
      { n: 'Fernanda M.', d: 'Google · pensão' },
    ] },
    { t: 'Respondi',   cor: BLUE, cards: [
      { n: 'Patrícia L.', d: 'Google · inventário' },
    ] },
    { t: 'Agendou',    cor: CYAN, cards: [
      { n: 'Camila T.', d: 'Indicação da Maria' },
    ] },
    { t: 'Compareceu', cor: GOLD, cards: [
      { n: 'Renata A.', d: 'Google · guarda' },
    ] },
    { t: 'Contratou',  cor: G, cards: [
      { n: 'Maria S.', d: 'Google · divórcio', v: 'R$ 3.500' },
    ] },
    { t: 'Perdida',    cor: RED, cards: [
      { n: 'Ana P.', d: 'sem verba agora' },
    ] },
  ]
  return (
    <Wrap mode={mode} id="s7b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: DARK }}>
        <Degrau n="7" />
        <Maria diz="Virei um cartão aqui. Em qual coluna eu parei?" />
        <Handle />
        <motion.div className="flex items-center gap-3"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Cada conversa é um cartão</h2>
          <p className="text-white/55 text-sm mt-1.5">
            E ele anda da esquerda para a direita. Você bate o olho e sabe onde cada uma parou —
            <span className="text-white/85 font-bold"> e no fim do mês faz a conta: investimento ÷ contratos.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-6 gap-2">
          {colunas.map((c, i) => (
            <motion.div key={c.t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl p-2 flex flex-col gap-2"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 168 }}>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.cor }}>{c.t}</span>
                <span className="text-[10px] font-black tabular-nums px-1.5 rounded"
                  style={{ background: c.cor + '22', color: c.cor }}>{c.cards.length}</span>
              </div>
              {c.cards.map((card, k) => (
                <motion.div key={card.n}
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 + k * 0.06, type: 'spring', stiffness: 220 }}
                  className="rounded-lg px-2.5 py-2"
                  style={{ background: '#0f1018', borderLeft: `3px solid ${c.cor}`, boxShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                  <div className="text-white font-bold text-[12px] leading-tight">{card.n}</div>
                  <div className="text-white/45 text-[10px] leading-snug mt-0.5">{card.d}</div>
                  {card.v && <div className="font-black text-[12px] mt-1" style={{ color: c.cor }}>{card.v}</div>}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-5 flex flex-col justify-center gap-2" style={{ background: '#0f1018' }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>Isso tem nome: CRM</div>
            <div className="text-white/85 text-[13px] leading-snug">
              Não é sistema caro nem coisa de escritório grande. É um quadro que responde três perguntas:
              <span className="text-white font-bold"> quem me chamou, o que eu já fiz e o que falta fazer.</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 flex flex-col justify-center gap-2" style={{ background: GOLD + '12', border: `1px solid ${GOLD}40` }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: GOLD }}>O problema que ele resolve</div>
            <div className="text-white/85 text-[13px] leading-snug">
              Sem ele a conversa some no meio — e você só lembra das que fecharam.
              <span className="text-white font-bold"> No fim do mês, ninguém sabe dizer se o dinheiro do anúncio virou cliente.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Wrap>
  )
}

// 8 · A MÁQUINA RODANDO ────────────────────────────────────────────────────────
function S08({ mode }) {
  const ativos = [
    { n: '01', icon: '🔎', t: 'Pesquisa no Google', cor: BLUE,
      d: 'Ela digita o problema e vê o seu anúncio. Você só paga se ela clicar.' },
    { n: '02', icon: '📄', t: 'Landing page', cor: CYAN,
      d: 'A página onde ela cai depois do clique. Tem uma função só: fazer ela te chamar.' },
    { n: '03', icon: '💬', t: 'O WhatsApp',   cor: GOLD,
      d: 'A primeira conversa. Aqui você não resolve o caso — você marca a consulta.' },
    { n: '04', icon: '🗓️', t: 'A consulta',   cor: ORANGE,
      d: 'Ela conta tudo e você mostra o caminho. É aqui que ela decide se confia em você.' },
    { n: '05', icon: '💰', t: 'A proposta',   cor: PUR,
      d: 'Quanto custa e como ela pode pagar. Forma de pagamento derruba mais objeção que desconto.' },
    { n: '06', icon: '✍️', t: 'O contrato',   cor: G,
      d: 'A assinatura. É o único número que paga a sua conta.' },
  ]
  const total = ativos.length
  const [passo, setPasso] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPasso(p => (p + 1) % total), 2200)
    return () => clearInterval(t)
  }, [total])
  const meio = 100 / total / 2
  const pos = i => meio + i * (100 / total)

  return (
    <Wrap mode={mode} id="s8">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">A máquina rodando</h2>
          </div>
          <p className="text-white/65 text-sm mt-2">Uma cliente real, do clique ao contrato — no escritório da minha sócia.</p>
        </motion.div>

        {/* A cliente percorrendo as etapas */}
        <div className="relative flex-shrink-0" style={{ height: 54 }}>
          <div className="absolute h-[2px] rounded-full"
            style={{ top: 42, left: `${meio}%`, right: `${meio}%`, background: 'rgba(255,255,255,0.10)' }} />
          <motion.div className="absolute h-[2px] rounded-full"
            style={{ top: 42, left: `${meio}%`, background: G, boxShadow: `0 0 8px ${G}` }}
            animate={{ width: `${(passo / (total - 1)) * (100 - meio * 2)}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          {ativos.map((a, i) => (
            <motion.div key={`no-${a.n}`} className="absolute rounded-full"
              style={{ top: 42, left: `${pos(i)}%`, translateX: '-50%', translateY: '-50%', width: 11, height: 11 }}
              animate={{ background: i <= passo ? G : '#2b3050', scale: i === passo ? 1.6 : 1 }}
              transition={{ duration: 0.3 }} />
          ))}
          <motion.div className="absolute flex flex-col items-center"
            style={{ top: 0, translateX: '-50%' }}
            animate={{ left: `${pos(passo)}%` }}
            transition={{ type: 'spring', stiffness: 110, damping: 17 }}>
            <motion.div className="flex flex-col items-center"
              animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="flex items-center gap-1.5 rounded-full whitespace-nowrap shadow-lg"
                style={{ background: G, color: DARK, padding: AVATAR.src ? '3px 10px 3px 3px' : '4px 12px' }}>
                {AVATAR.src ? (
                  <img src={AVATAR.src} alt="" className="rounded-full object-cover"
                    style={{ width: 28, height: 28, border: `2px solid ${DARK}` }} />
                ) : (
                  <span className="text-sm">👤</span>
                )}
                <span className="text-[11px] font-black tracking-wide">{AVATAR.label}</span>
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `6px solid ${G}` }} />
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-6 gap-2 flex-1 min-h-0">
          {ativos.map((a, i) => {
            const on = i === passo
            return (
              <motion.div key={a.n}
                initial={{ opacity: 0, y: 22 }}
                animate={{
                  opacity: 1, y: 0, scale: on ? 1.04 : 1,
                  backgroundColor: on ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
                  borderColor: on ? a.cor : a.cor + '40',
                  boxShadow: on ? `0 0 26px ${a.cor}40` : `0 0 0px ${a.cor}00`,
                }}
                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 150 }}
                className="rounded-2xl px-4 py-5 flex flex-col justify-center gap-2"
                style={{ borderWidth: 1, borderStyle: 'solid' }}>
                <div className="text-[10px] font-black tracking-widest" style={{ color: a.cor }}>{a.n}</div>
                <motion.div className="text-4xl" animate={{ scale: on ? 1.15 : 1 }} transition={{ duration: 0.35 }}>
                  {a.icon}
                </motion.div>
                <div className="font-black text-white text-[17px] leading-tight">{a.t}</div>
                <motion.div className="text-[12px] leading-snug"
                  animate={{ color: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)' }}>
                  {a.d}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="rounded-xl px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.34)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span className="text-2xl">📊</span>
          <p className="text-white/85 text-sm">
            <span className="font-black text-white">O CRM fica embaixo de tudo isso.</span> Ele registra as seis etapas —
            e é o que mostra em qual delas você está perdendo.
          </p>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 9 · O MÊS NÃO É RETO ─────────────────────────────────────────────────────────
function S09({ mode }) {
  const dias = [2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 2, 1, 3, 2, 6, 9, 14, 11, 17, 22, 15, 26, 19, 24]
  const max = Math.max(...dias)
  const temPrint = Boolean(PRINTS.crmCurva)
  return (
    <Wrap mode={mode} id="s9">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">O mês não é reto</h2>
          <p className="text-white/55 text-sm mt-2">Do dia 1 ao dia 30 nada muda: nem a verba, nem o atendimento.</p>
        </motion.div>

        <div className="rounded-2xl px-6 pt-4 pb-3" style={{ background: '#151725' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">📊</span>
            <span className="text-[11px] font-black tracking-widest" style={{ color: temPrint ? G : '#6b7395' }}>
              {temPrint ? 'CONTRATOS POR DIA · ESCRITÓRIO DA CAROL' : 'CONTRATOS FECHADOS POR DIA DO MÊS'}
            </span>
            {!temPrint && <span className="text-white/25 text-[11px]">· esquema ilustrativo</span>}
          </div>
          {temPrint ? (
            <img src={PRINTS.crmCurva} alt="Contratos fechados por dia do mês"
              className="w-full rounded-lg" style={{ maxHeight: 150, objectFit: 'contain' }} />
          ) : (
            <>
              <div className="flex items-end gap-[5px] h-28">
                {dias.map((v, i) => (
                  <motion.div key={i} className="flex-1 rounded-t-sm"
                    initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                    transition={{ delay: 0.15 + i * 0.018, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: i < 20 ? '#2b3050' : G, boxShadow: i >= 20 ? `0 0 10px ${G}55` : 'none' }} />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-white/40 font-mono mt-2">
                <span>dia 1</span><span>dia 15</span><span>dia 30</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: RED + '0d', border: `1px solid ${RED}28` }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: RED }}>A armadilha do dia 15</div>
            <div className="text-white/80 text-[13px] leading-relaxed">
              Nada fechou → desânimo → a resposta esfria, você para de chamar de volta → o mês fecha ruim → <span className="italic">"viu? não funciona"</span>.
            </div>
            <div className="mt-auto text-white font-bold text-sm">
              Consistência no que é controlável. Resultado é efeito colateral.
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: G + '10', border: `1px solid ${G}35` }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>A rotina que não muda · 15 min/dia</div>
            {['Responder as novas', 'Confirmar as de amanhã', 'Voltar a chamar quem não respondeu', 'Anotar'].map(x => (
              <div key={x} className="text-white/85 text-[13px] flex gap-2"><span style={{ color: G }}>✓</span>{x}</div>
            ))}
            <div className="mt-auto text-white/70 text-xs">
              + uma vez por mês, volte em quem sumiu meses atrás. Você já pagou por esse contato.
            </div>
          </motion.div>
        </div>

        <div className="rounded-xl px-6 py-3 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
          <span className="text-white font-black">Um mês é montanha-russa. Três meses sobrepostos viram uma linha.</span>
          <span className="text-white/60 text-sm"> A estabilidade não vem do mês — vem da soma dos meses.</span>
        </div>
      </div>
    </Wrap>
  )
}

// 10 · A AMPULHETA ─────────────────────────────────────────────────────────────
function S10({ mode }) {
  const topo = ['viu', 'clicou', 'chamou', 'agendou', 'apareceu']
  const base = [
    { t: 'você conduziu bem o divórcio',   n: 1 },
    { t: 'ela volta pra revisar alimentos', n: 2 },
    { t: 'depois, a guarda',                n: 3 },
    { t: 'anos depois, o inventário',       n: 5 },
    { t: 'e indica a amiga que vai separar', n: 8 },
  ]
  return (
    <Wrap mode={mode} id="s10">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Você não compra uma causa. Compra uma cliente.</h2>
          <p className="text-white/55 text-sm mt-1.5">O caminho vai apertando até o contrato. E depois do contrato ele <span className="text-white/85 font-bold">abre de novo</span>.</p>
        </motion.div>

        <div className="flex-1 grid gap-5" style={{ gridTemplateColumns: '1.05fr 1fr' }}>
          <div className="flex flex-col items-center justify-center gap-1">
            {topo.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-md py-1.5 text-center text-white/80 text-[13px] font-semibold"
                style={{ width: `${100 - i * 13}%`, background: '#1e2035' }}>{t}</motion.div>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.42 }}
              className="rounded-lg py-2 text-center font-black text-base my-1"
              style={{ width: '34%', background: G, color: DARK }}>CONTRATO</motion.div>
            {base.map((b, i) => (
              <motion.div key={b.t}
                initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.09, type: 'spring', stiffness: 170 }}
                className="rounded-md py-1.5 px-3 flex items-center justify-between gap-2 text-[13px] font-semibold"
                style={{
                  width: `${48 + i * 13}%`,
                  background: `rgba(124,58,237,${0.14 + i * 0.05})`,
                  color: '#c4b5fd',
                  border: `1px solid rgba(167,139,250,${0.12 + i * 0.06})`,
                }}>
                <span>{b.t}</span>
                <span className="flex items-center gap-[3px] flex-shrink-0">
                  {[...Array(b.n)].map((_, k) => (
                    <motion.span key={k} className="rounded-full"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.09 + k * 0.03, type: 'spring', stiffness: 400 }}
                      style={{ width: 5 + i, height: 5 + i, background: '#c4b5fd' }} />
                  ))}
                </span>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              className="mt-1.5 text-[12px] font-black text-center" style={{ color: '#c4b5fd' }}>
              ↺ e cada uma dessas entra lá em cima de novo
            </motion.div>
          </div>

          <div className="flex flex-col gap-2.5 justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: '#0f1018' }}>
              <div className="text-white/85 text-sm leading-relaxed">
                Em família, a mesma cliente volta três, quatro vezes ao longo da vida.
                <span className="text-white font-bold"> E nas próximas ela não vai pesquisar no Google — vai chamar você.</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
              className="rounded-2xl p-5" style={{ background: G + '12', border: `1.5px solid ${G}50` }}>
              <div className="text-white font-black text-lg leading-snug">
                O tráfego pago não substitui a indicação. Ele abastece a indicação.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="rounded-2xl p-5" style={{ background: GOLD + '10', border: `1px solid ${GOLD}30` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Descubra o seu multiplicador</div>
              <div className="text-white/80 text-[13px] leading-relaxed">
                Pega seus últimos 10 clientes: quantos voltaram? Quantos indicaram alguém?
                <span className="text-white/60"> Quem calcula olhando só o primeiro contrato sempre acha caro — e desiste de uma campanha que estava dando certo.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 11 · O RESULTADO EM NÚMEROS ────────────────────────────────────────────────
function S11N({ mode }) {
  const completo = Boolean(LAB.conversas && LAB.contratos && LAB.faturamento)
  const cards = [
    { k: 'conversas',   label: 'Conversas que chegaram', valor: LAB.conversas,   cor: BLUE },
    { k: 'consultas',   label: 'Consultas realizadas',   valor: LAB.consultas,   cor: GOLD },
    { k: 'contratos',   label: 'Contratos assinados',    valor: LAB.contratos,   cor: G },
    { k: 'faturamento', label: 'Faturamento no período', valor: LAB.faturamento, cor: PUR },
  ]
  return (
    <Wrap mode={mode} id="s11n">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">O resultado, em números</h2>
          <p className="text-white/65 text-sm mt-2">
            Mesmo escritório, mesmas telas que vocês acabaram de ver
            {LAB.periodo && <span className="text-white/85 font-bold"> · {LAB.periodo}</span>}
          </p>
        </motion.div>

        {completo ? (
          <>
            <div className="grid grid-cols-4 gap-4 flex-1">
              {cards.map((c, i) => (
                <motion.div key={c.k}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.13, type: 'spring', stiffness: 150 }}
                  className="rounded-2xl p-6 flex flex-col justify-center gap-1"
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${c.cor}45` }}>
                  <div className="font-black text-white leading-none"
                    style={{ fontSize: String(c.valor).length > 8 ? '2.1rem' : '3rem', letterSpacing: '-2px' }}>
                    {c.valor}
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: c.cor }}>{c.label}</div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="rounded-2xl px-7 py-4 flex items-center gap-6"
              style={{ background: G + '14', border: `1.5px solid ${G}55` }}>
              {LAB.investido && (
                <div className="flex-shrink-0 pr-6" style={{ borderRight: '1px solid rgba(255,255,255,0.14)' }}>
                  <div className="text-white/60 text-[11px] font-black uppercase tracking-widest">Investido</div>
                  <div className="text-white font-black text-2xl leading-none mt-1">{LAB.investido}</div>
                </div>
              )}
              <p className="text-white font-black text-lg leading-snug">
                Nenhum desses números veio de sorte. Vieram dos oito degraus, na ordem.
              </p>
            </motion.div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.28)', border: '1px dashed rgba(255,255,255,0.18)' }}>
            <div className="text-5xl">📋</div>
            <div className="font-black text-white text-xl">Preencher com os números reais</div>
            <p className="text-white/60 text-sm text-center max-w-lg leading-relaxed">
              No topo do arquivo, no bloco <span className="font-mono text-white/85">LAB</span>: período, investido,
              conversas, consultas, contratos e faturamento.
            </p>
            <p className="text-white/40 text-xs">Enquanto estiver vazio, o slide não inventa dado.</p>
          </div>
        )}
      </div>
    </Wrap>
  )
}

// 12 · O QUE LEVAR DAQUI ───────────────────────────────────────────────────────
function S11({ mode }) {
  const insights = [
    { n: 1, t: 'Não é "deu certo ou não deu".',   d: 'São 8 degraus — e onde você parou é o seu problema.' },
    { n: 2, t: 'Segmentada na área. Genérica na palavra.', d: 'O que ninguém digita não tem conserto.' },
    { n: 3, t: 'O anúncio abre a porta.',          d: 'Quem fecha é o seu atendimento.' },
    { n: 4, t: 'Do dia 1 ao dia 30, nada muda.',   d: 'Nem a verba, nem a energia com que você responde.' },
    { n: 5, t: 'Você não compra uma causa.',       d: 'Compra uma cliente — que volta e que indica.' },
    { n: 6, t: 'Você não precisa estar pronta.',   d: 'Precisa começar.' },
  ]
  return (
    <Wrap mode={mode} id="s11">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0f1018 0%, ${DARK} 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">O que levar daqui</h2>
          <p className="text-white/55 text-sm mt-2">Se você esquecer todo o resto e lembrar só destas seis, já valeu.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {insights.map((x, i) => (
            <motion.div key={x.n}
              initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.11, type: 'spring', stiffness: 160 }}
              className="flex items-center gap-4 rounded-xl px-5 py-2.5"
              style={{ background: '#1e2035', borderLeft: `3px solid ${G}` }}>
              <span className="font-black text-2xl tabular-nums flex-shrink-0" style={{ color: G, opacity: 0.5 }}>
                {x.n}
              </span>
              <div>
                <div className="text-white font-black text-[16px] leading-tight">{x.t}</div>
                <div className="text-white/60 text-[13px] mt-0.5">{x.d}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-6 flex-shrink-0"
          style={{ background: G + '16', border: `1.5px solid ${G}60` }}>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: G }}>
              Leva o modelo de CRM, o checklist e a escada
            </div>
            <div className="text-white font-black text-2xl leading-none">@trafegonjuridico</div>
            <div className="text-white/70 text-sm mt-1.5">
              Segue e comenta <span className="font-black text-white">DEGRAU</span> no post de hoje — eu mando o material na sua DM.
            </div>
          </div>
          <div className="text-5xl opacity-90">📲</div>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 12 · A PRIMEIRA SEMANA + CTA ─────────────────────────────────────────────────
function S12({ mode }) {
  const dias = [
    'Escrever a frase: "ajudo [quem] a [quê] em [cidade]"',
    'Abrir o WhatsApp Business',
    'Publicar uma página com um botão',
    'Criar a conta no Google Ads',
    'Subir a campanha e as palavras bloqueadas',
    'Montar o CRM',
    'Não mexer em nada',
  ]
  return (
    <Wrap mode={mode} id="s12">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">A sua primeira semana</h2>
          <p className="text-white/65 text-sm mt-1.5">Nenhum passo leva mais de uma hora. Isso é o degrau 1.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {dias.map((d, i) => (
            <motion.div key={d} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-4 rounded-lg px-5 py-2"
              style={{ background: i === 6 ? G + '1a' : 'rgba(0,0,0,0.26)', border: i === 6 ? `1px solid ${G}50` : '1px solid rgba(255,255,255,0.06)' }}>
              <span className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
                style={{ background: i === 6 ? G : 'rgba(255,255,255,0.1)', color: i === 6 ? DARK : 'white' }}>{i + 1}</span>
              <span className="text-white font-semibold text-sm">{d}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="rounded-xl px-6 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <p className="text-white font-black text-base leading-snug">
            Ninguém aqui vai fechar contrato essa semana. Vocês vão subir um degrau.
          </p>
        </motion.div>
      </div>
    </Wrap>
  )
}

export const PALESTRA_CAF_SLIDES = [
  { id: 'pc01', label: '1.609.507',          C: S01 },
  { id: 'pc1b', label: 'Quem está falando',  C: S1B },
  { id: 'pc02', label: 'Os dois inimigos',   C: S02 },
  { id: 'pc2b', label: 'Onde as pessoas estão', C: S2B },
  { id: 'pc2c', label: 'Google e Meta',      C: S2C },
  { id: 'pc3b', label: 'Da internet ao contrato', C: S3B },
  { id: 'pc03', label: 'A escada',           C: S03 },
  { id: 'pc04', label: 'A máquina rodando',  C: S08 },
  { id: 'pc05', label: 'Como funciona',      C: S04 },
  { id: 'pc06', label: 'A campanha',         C: S05 },
  { id: 'pc07', label: 'A página',           C: S06 },
  { id: 'pc08', label: 'As 5 mensagens',     C: S07 },
  { id: 'pc8b', label: 'Uma linha por conversa', C: S07B },
  { id: 'pc09', label: 'O mês não é reto',   C: S09 },
  { id: 'pc10', label: 'A ampulheta',        C: S10 },
  { id: 'pc11', label: 'O lab em números',   C: S11N },
  { id: 'pc12', label: 'Primeira semana',    C: S12 },
  { id: 'pc13', label: 'O que levar daqui',  C: S11 },
]

export default PALESTRA_CAF_SLIDES
