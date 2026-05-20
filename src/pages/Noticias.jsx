import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Newspaper, ExternalLink, RefreshCw, Tag, Clock, TrendingUp,
  Bookmark, Search, ChevronRight, Zap, Lightbulb, Copy, Check,
  Film, SquarePlay, Image, AlignLeft
} from 'lucide-react'

/* ─── Notícias ─────────────────────────────────────────── */
const CATEGORIES = ['Todas', 'Marketing Digital', 'Tráfego Pago', 'Negócios', 'Tecnologia', 'E-commerce', 'Conteúdo']

const SOURCES = [
  { id: 'mundo-mkt',  name: 'Mundo do Marketing', color: '#ea8a29', url: 'https://mundodomarketing.com.br' },
  { id: 'exame',      name: 'Exame',               color: '#60a5fa', url: 'https://exame.com' },
  { id: 'meio',       name: 'Meio & Mensagem',     color: '#be29ec', url: 'https://meioemensagem.com.br' },
  { id: 'ecommerce',  name: 'E-Commerce Brasil',   color: '#6eda2c', url: 'https://ecommercebrasil.com.br' },
  { id: 'startups',   name: 'Startups.com.br',     color: '#22d3ee', url: 'https://startups.com.br' },
  { id: 'neilpatel',  name: 'Neil Patel Brasil',   color: '#ef4444', url: 'https://neilpatel.com/br' },
  { id: 'rock',       name: 'Rock Content',         color: '#f59e0b', url: 'https://rockcontent.com/br' },
  { id: 'rd',         name: 'Resultados Digitais',  color: '#34d399', url: 'https://resultadosdigitais.com.br' },
  { id: 'thinkgoogle',name: 'Think with Google',    color: '#4285f4', url: 'https://thinkwithgoogle.com/intl/pt-br' },
  { id: 'socialmedia',name: 'Social Media Hoje',    color: '#a78bfa', url: 'https://socialmedianews.com.br' },
]

const NEWS = [
  {
    id: 1,
    title: 'Meta lança novos formatos de anúncio para Reels com foco em conversão direta',
    summary: 'A Meta anunciou atualizações nos formatos de anúncios para Reels, incluindo botões de CTA sobrepostos e otimização automática de áudio para campanhas de performance.',
    category: 'Tráfego Pago', source: 'mundo-mkt', time: '2h atrás', readTime: '3 min',
    url: 'https://mundodomarketing.com.br', trending: true,
    tags: ['Meta Ads', 'Reels', 'Performance'],
  },
  {
    id: 2,
    title: 'Google Ads anuncia expansão do Performance Max para novos objetivos de campanha',
    summary: 'Com a nova atualização, o Performance Max passará a suportar objetivos de geração de leads B2B com integrações nativas ao CRM, prometendo maior automação no funil de vendas.',
    category: 'Tráfego Pago', source: 'meio', time: '4h atrás', readTime: '4 min',
    url: 'https://meioemensagem.com.br', trending: true,
    tags: ['Google Ads', 'Performance Max', 'B2B'],
  },
  {
    id: 3,
    title: 'E-commerce brasileiro cresce 14% no primeiro trimestre de 2026',
    summary: 'O setor de comércio eletrônico no Brasil registrou crescimento de 14% em faturamento no Q1 2026, com destaque para mobile commerce e pagamentos via Pix.',
    category: 'E-commerce', source: 'ecommerce', time: '6h atrás', readTime: '5 min',
    url: 'https://ecommercebrasil.com.br', trending: false,
    tags: ['E-commerce', 'Mobile', 'Pix'],
  },
  {
    id: 4,
    title: 'Inteligência Artificial redefine a criação de copy: como agências estão se adaptando',
    summary: 'Pesquisa com 500 agências de marketing aponta que 78% já utilizam IA para geração de copy, mas a curadoria humana ainda é fundamental para resultados acima da média.',
    category: 'Marketing Digital', source: 'mundo-mkt', time: '8h atrás', readTime: '6 min',
    url: 'https://mundodomarketing.com.br', trending: false,
    tags: ['IA', 'Copy', 'Agências'],
  },
  {
    id: 5,
    title: 'TikTok Shop chega ao Brasil e promete revolucionar o social commerce',
    summary: 'A plataforma de comércio integrado do TikTok será lançada oficialmente no Brasil no Q2 2026, com foco em criadores de conteúdo e marcas do segmento moda e beleza.',
    category: 'Marketing Digital', source: 'startups', time: '12h atrás', readTime: '4 min',
    url: 'https://startups.com.br', trending: true,
    tags: ['TikTok', 'Social Commerce', 'Brasil'],
  },
  {
    id: 6,
    title: 'Como o neuromarketing está transformando as estratégias de conversão em 2026',
    summary: 'Empresas que aplicam princípios de neuromarketing em landing pages e criativos reportam aumento médio de 32% na taxa de conversão, segundo novo estudo internacional.',
    category: 'Negócios', source: 'exame', time: '1d atrás', readTime: '7 min',
    url: 'https://exame.com', trending: false,
    tags: ['Neuromarketing', 'Conversão', 'CRO'],
  },
  {
    id: 7,
    title: 'WhatsApp Business API: novas funcionalidades para automação de marketing',
    summary: 'Meta liberou novos recursos na API do WhatsApp Business, incluindo templates interativos com carrossel de produtos e botões de pagamento nativo.',
    category: 'Tecnologia', source: 'mundo-mkt', time: '1d atrás', readTime: '3 min',
    url: 'https://mundodomarketing.com.br', trending: false,
    tags: ['WhatsApp', 'Automação', 'API'],
  },
  {
    id: 8,
    title: 'Pequenas empresas que investem em branding crescem 2.5x mais que a média',
    summary: 'Estudo realizado com 1.200 PMEs brasileiras mostra correlação direta entre investimento em identidade visual e crescimento sustentável no longo prazo.',
    category: 'Negócios', source: 'exame', time: '2d atrás', readTime: '5 min',
    url: 'https://exame.com', trending: false,
    tags: ['Branding', 'PME', 'Crescimento'],
  },
  {
    id: 9,
    title: 'SEO em 2026: como a busca por IA está mudando o comportamento do usuário',
    summary: 'Com o crescimento das respostas geradas por IA no Google e Bing, o comportamento de busca mudou: usuários clicam menos, mas convertem mais quando chegam ao site.',
    category: 'Marketing Digital', source: 'neilpatel', time: '3h atrás', readTime: '5 min',
    url: 'https://neilpatel.com/br', trending: true,
    tags: ['SEO', 'IA', 'Google'],
  },
  {
    id: 10,
    title: 'Estratégia de conteúdo B2B: o que funciona em 2026 segundo 300 CMOs',
    summary: 'Rock Content entrevistou 300 CMOs de empresas B2B e concluiu que o conteúdo longo e aprofundado ainda supera vídeos curtos em conversão para serviços complexos.',
    category: 'Conteúdo', source: 'rock', time: '5h atrás', readTime: '6 min',
    url: 'https://rockcontent.com/br', trending: false,
    tags: ['Conteúdo', 'B2B', 'CMO'],
  },
  {
    id: 11,
    title: 'Inbound Marketing: taxas de conversão aumentaram 40% com personalização por IA',
    summary: 'Resultados Digitais revela que empresas que personalizam e-mails e landing pages com IA registram taxa de conversão 40% maior em comparação a campanhas genéricas.',
    category: 'Marketing Digital', source: 'rd', time: '7h atrás', readTime: '4 min',
    url: 'https://resultadosdigitais.com.br', trending: false,
    tags: ['Inbound', 'Personalização', 'Conversão'],
  },
  {
    id: 12,
    title: 'Think with Google: 60% das compras B2C começam por pesquisa no YouTube',
    summary: 'Novo relatório do Google confirma que o YouTube se tornou o segundo motor de busca mais utilizado para decisões de compra, ultrapassando o Instagram no Brasil.',
    category: 'Conteúdo', source: 'thinkgoogle', time: '10h atrás', readTime: '3 min',
    url: 'https://thinkwithgoogle.com/intl/pt-br', trending: true,
    tags: ['YouTube', 'Video', 'Compras'],
  },
  {
    id: 13,
    title: 'Instagram vai remunerar criadores por visualizações de Reels a partir de julho',
    summary: 'Meta anuncia programa de monetização para Reels no Brasil: criadores com mais de 500 seguidores passarão a receber por visualizações qualificadas nas próximas semanas.',
    category: 'Conteúdo', source: 'socialmedia', time: '1h atrás', readTime: '2 min',
    url: 'https://socialmedianews.com.br', trending: true,
    tags: ['Instagram', 'Reels', 'Monetização'],
  },
  {
    id: 14,
    title: 'Automação de marketing: 5 fluxos que geram mais ROI segundo especialistas',
    summary: 'Pesquisa aponta que fluxos de nutrição para leads quentes, recuperação de carrinho e pós-venda são os que geram maior retorno sobre investimento em automação.',
    category: 'Marketing Digital', source: 'rd', time: '2d atrás', readTime: '5 min',
    url: 'https://resultadosdigitais.com.br', trending: false,
    tags: ['Automação', 'ROI', 'Leads'],
  },
]

const sourceMap = Object.fromEntries(SOURCES.map(s => [s.id, s]))

/* ─── Ideias de Conteúdo ───────────────────────────────── */
const FORMAT_ICONS = {
  reel: Film,
  story: SquarePlay,
  carrossel: AlignLeft,
  post: Image,
}

const FORMATO_TRAFEGON_LABELS = {
  'tela-dividida': 'Tela Dividida',
  'react':         'React',
  'novelinha':     'Novelinha',
  'comparativo':   'Comparativo',
  'narrado':       'Narrado',
  'trend-texto':   'Trend c/ Texto',
  'conversa':      'Conversa',
  'lista':         'Lista/Ranking',
}

const FUNIL_CONFIG = {
  topo:  { label: 'Topo',  color: '#60a5fa' },
  meio:  { label: 'Meio',  color: '#ea8a29' },
  fundo: { label: 'Fundo', color: '#6eda2c' },
}

const CONTENT_IDEAS = [
  {
    id: 1,
    format: 'reel',
    formatoTrafegon: 'tela-dividida',
    funil: 'topo',
    emocao: 'Medo de perda',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'Seu escritório não aparece quando alguém pesquisa advogado',
    hook: '"Fiz um teste agora. Pesquisei \'advogado [sua cidade]\' no Google. Seu escritório não estava lá."',
    roteiro: `[0–4s] Câmera no rosto, tom direto: "Fiz um teste agora. Pesquisei 'advogado [cidade]' no Google. Seu escritório não estava lá."
[5–12s] LADO 1: você falando. LADO 2: gravação de tela do Google mostrando concorrentes no topo.
[13–25s] "Enquanto você está aqui, seu concorrente está aparecendo toda hora para quem já quer contratar advogado."
[26–38s] Mostrar Google Meu Negócio configurado vs. perfil vazio. Diferença visual clara.
[39–50s] "Isso não é sorte. É estrutura. E dá pra corrigir em menos de uma semana."
[51–60s] CTA: "Comenta 'MAPA' que eu te mando o checklist de visibilidade jurídica no Google."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#googleadvocacia', '#destravadigital'],
    duration: '60s',
    color: '#60a5fa',
  },
  {
    id: 2,
    format: 'reel',
    formatoTrafegon: 'react',
    funil: 'topo',
    emocao: 'Polarização',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'Reagindo: "Advogado não precisa de marketing"',
    hook: '"Vi um advogado falar isso semana passada. Esse conselho está destruindo escritórios."',
    roteiro: `[0–4s] Hook direto: "Vi um advogado falar que não precisa de marketing. Preciso reagir a isso."
[5–15s] Trecho ou print da afirmação original em tela cheia.
[16–28s] OPINIÃO FORTE: "Advogado que não aparece online não é que não tem cliente. Ele está perdendo clientes que já estavam prontos para contratar."
[29–42s] EXPLICAÇÃO: "O cliente já sabe que precisa de advogado. Ele está só escolhendo qual vai contratar. Quem aparece, ganha."
[43–55s] TAKEAWAY: "Indicação não é estratégia. É sorte. Previsibilidade é sistema."
[56–60s] CTA: "Manda isso para um advogado que precisa ver."`,
    hashtags: ['#advocacia', '#marketingjuridico', '#advogado', '#captacaodeclientes', '#assessoriadecrescimento'],
    duration: '60s',
    color: '#be29ec',
  },
  {
    id: 3,
    format: 'reel',
    formatoTrafegon: 'novelinha',
    funil: 'topo',
    emocao: 'Identificação',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'O advogado que só vivia de indicação',
    hook: '(cena: sócio pergunta "como você consegue cliente?" — resposta: "indicação")',
    roteiro: `[CENA 1 — escritório]:
Sócio entra na sala: "Como você tá conseguindo cliente?"
Advogado, sem tirar os olhos do processo: "Indicação."
Sócio: "E se parar de vir?"
Silêncio.

[CORTE — 3 semanas depois]
Advogado no celular: "Esse mês tá vazio. Não sei o que aconteceu."
Sócio: "Lembra do que eu perguntei?"

[LIÇÃO — câmera no rosto]:
"Indicação não é estratégia. É gratidão de quem já foi bem atendido.
Estratégia é quando você controla de onde vem o próximo cliente.
Isso se chama: Destrava Digital."

CTA: "Comenta 'DESTRAVA' se isso faz sentido."`,
    hashtags: ['#advocacia', '#advogado', '#escritoriodeadvocacia', '#captaçãodeclientes', '#destravadigital'],
    duration: '45s',
    color: '#ea8a29',
  },
  {
    id: 4,
    format: 'carrossel',
    formatoTrafegon: 'comparativo',
    funil: 'topo',
    emocao: 'Aspiração',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram / LinkedIn',
    title: 'Advogado invisível VS advogado estruturado',
    hook: '"Advogado que cresce VS advogado que continua dependendo de indicação. Qual é você?"',
    roteiro: `SLIDE 1 (capa):
"Advogado invisível VS Advogado estruturado"
Fundo escuro. Fonte grande. Sem enrolação.

SLIDE 2:
❌ Não aparece no Google
✅ Top 3 no Maps para sua cidade

SLIDE 3:
❌ Vive esperando indicação
✅ Recebe lead toda semana de forma previsível

SLIDE 4:
❌ Não sabe de onde vem o próximo cliente
✅ Tem funil ativo rodando 24h

SLIDE 5:
❌ Investe em marketing mas não sabe se funciona
✅ Vê o custo por lead e escala o que dá resultado

SLIDE 6:
❌ Depende do que aparece
✅ Escolhe o tipo de caso que quer atender

SLIDE 7 (CTA):
"Qual dos dois você quer ser?
Comenta 'QUERO' e eu te mostro como virar o jogo."`,
    hashtags: ['#advocacia', '#marketingjuridico', '#advogado', '#captacaodeclientes', '#escritoriodeadvocacia'],
    duration: '7 slides',
    color: '#6eda2c',
  },
  {
    id: 5,
    format: 'reel',
    formatoTrafegon: 'narrado',
    funil: 'topo',
    emocao: 'Curiosidade',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'O maior erro dos advogados não é falta de cliente',
    hook: '"O maior erro dos advogados não é falta de cliente... é invisibilidade."',
    roteiro: `[0–4s] Narração, voz firme:
"O maior erro dos advogados não é falta de cliente."
Pausa.
"É invisibilidade."

[5–15s] "Advogado excelente, que atende bem, que tem anos de experiência — mas que ninguém encontra."

[16–28s] "O cliente que precisava de você pesquisou no Google. Encontrou o concorrente. Contratou."
(B-roll: celular com pesquisa no Google Maps, escritório concorrente com avaliações)

[29–40s] "Não foi falta de competência. Foi falta de presença."

[41–52s] "Isso é o que a Assessoria de Crescimento resolve. A gente coloca seu escritório na frente de quem já quer contratar advogado."

[53–60s] CTA: "Me chama no direct e eu te mostro como funciona."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#escritorio', '#assessoriadecrescimento'],
    duration: '60s',
    color: '#f59e0b',
  },
  {
    id: 6,
    format: 'reel',
    formatoTrafegon: 'trend-texto',
    funil: 'topo',
    emocao: 'Frustração',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels / TikTok',
    title: 'Quando você posta toda semana e ninguém chama',
    hook: '"Quando você percebe que posta todo dia e ninguém chama."',
    roteiro: `FORMATO: Trend com texto sobreposto. Funciona sem som.

CENA: Advogado(a) na frente do computador, olhando pro celular, expressão de frustração.

TEXTO NA TELA (aparece em sequência):
"Quando você posta todo dia..."
"Faz stories..."
"Coloca no feed..."
"E o celular não toca."

Corte.

TEXTO FINAL:
"Postar não é estratégia.
Estrutura é estratégia.
Se você quer cliente, você precisa de sistema — não de inspiração."

CTA no texto final:
"Comenta 'SISTEMA' se você se identificou."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#instagramadvocacia', '#destravadigital'],
    duration: '30s',
    color: '#ef4444',
  },
  {
    id: 7,
    format: 'story',
    formatoTrafegon: 'conversa',
    funil: 'meio',
    emocao: 'Curiosidade',
    produto: 'Destrava Digital',
    channel: 'instagram-stories',
    platform: 'Instagram Stories',
    title: 'Você realmente consegue cliente pra advogado usando internet?',
    hook: '"Alguém me perguntou isso semana passada. Gravei a resposta."',
    roteiro: `STORY 1 (texto):
"Alguém me perguntou semana passada:"
"'Você realmente consegue cliente pra advogado usando internet?'"
"Gravei a resposta. Arrasta."

STORY 2 (vídeo ou texto):
"Depende do que você chama de internet."
"Instagram com post bonito? Não."
"Google com estrutura certa + anúncio segmentado? Sim."

STORY 3:
"A diferença é que um coloca você na frente de quem JÁ está procurando advogado."
"O outro só te faz parecer presente."

STORY 4 (CTA):
"Quer ver como funciona na prática?"
[Botão: Me manda mensagem]`,
    hashtags: ['#advocacia', '#marketingjuridico', '#captaçãodeclientes'],
    duration: '4 stories',
    color: '#22d3ee',
  },
  {
    id: 8,
    format: 'reel',
    formatoTrafegon: 'lista',
    funil: 'topo',
    emocao: 'Medo de perda',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: '5 erros que fazem advogados perderem clientes online',
    hook: '"5 erros que eu vejo toda semana em escritórios de advocacia. O #3 é o mais comum."',
    roteiro: `[0–4s] Hook: "5 erros que fazem advogados perderem clientes online. O número 3 é o mais comum."

[5–12s] ERRO 1: "Não ter Google Meu Negócio. Cliente pesquisa, não aparece, vai pro concorrente."

[13–20s] ERRO 2: "Só depender de indicação. Indicação não é previsível. Cliente não é."

[21–28s] ERRO 3: "Ter anúncio sem landing page. Mandar tráfego pro Instagram é jogar dinheiro fora."

[29–36s] ERRO 4: "Não responder lead rápido. Em 5 minutos você tem 10x mais chance de converter."

[37–44s] ERRO 5: "Não saber o custo por lead. Se você não sabe o que funciona, não dá pra crescer."

[45–55s] "Corrige qualquer um desses e você já sai na frente de 80% dos escritórios da sua cidade."

[56–60s] CTA: "Comenta 'ERROS' que eu te mando o guia completo."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#captaçãodeclientes', '#escritoriodeadvocacia'],
    duration: '60s',
    color: '#a78bfa',
  },
  {
    id: 9,
    format: 'reel',
    formatoTrafegon: 'tela-dividida',
    funil: 'meio',
    emocao: 'Aspiração',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: '23 leads em 1 mês para um escritório de advocacia',
    hook: '"Esse escritório de advocacia recebeu 23 leads em um mês. Veja o que eles fizeram."',
    roteiro: `[0–4s] "Esse escritório de advocacia recebeu 23 leads em um mês. Veja o que eles fizeram."

LADO 1 — você falando.
LADO 2 — dashboard do Meta Ads mostrando resultados (nome do cliente em blur).

[5–18s] "Antes: zero estrutura online. Só indicação. Meses bons e meses ruins sem entender o porquê."

[19–32s] "Montamos: Google Meu Negócio otimizado + anúncio segmentado + landing page específica pra área deles."

[33–45s] LADO 2 muda para: resultado do mês. 23 leads. Custo por lead abaixo de R$25.

[46–55s] "Não foi mágica. Foi estrutura. Em 30 dias."

[56–60s] CTA: "Me chama no direct. Vejo se o seu escritório tem esse potencial."`,
    hashtags: ['#advocacia', '#resultados', '#marketingjuridico', '#leads', '#assessoriadecrescimento'],
    duration: '60s',
    color: '#34d399',
  },
  {
    id: 10,
    format: 'reel',
    formatoTrafegon: 'novelinha',
    funil: 'topo',
    emocao: 'Humor',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels / TikTok',
    title: 'A reunião de sócios que ninguém quer ter',
    hook: '(cena: sócio entra na sala batendo o arquivo na mesa — "Explica esse mês pra mim.")',
    roteiro: `[CENA 1]:
Sócio entra batendo o arquivo na mesa:
"Explica esse mês pra mim. Cadê os clientes?"
Advogado: "Tá fraco... indicação tá baixa."
Sócio: "E o que você fez pra não depender de indicação?"
Silêncio constrangedor.

[CENA 2 — mesmo escritório, 60 dias depois]:
Sócio entra sorrindo.
"Esse mês foram 14 consultas. O que mudou?"
Advogado, sorrindo: "Parei de esperar. Comecei a aparecer."

[CÂMERA NO ROSTO — narração direta]:
"A diferença entre os dois cenários é simples:
estrutura de captação vs esperar o telefone tocar.
Isso é o Destrava Digital."

CTA: "Comenta 'REUNIÃO' se você já viveu esse cenário."`,
    hashtags: ['#advocacia', '#advogado', '#escritoriodeadvocacia', '#marketingjuridico', '#destravadigital'],
    duration: '50s',
    color: '#f43f5e',
  },
  {
    id: 11,
    format: 'reel',
    formatoTrafegon: 'react',
    funil: 'topo',
    emocao: 'Surpresa',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'Dado assustador sobre advogados e visibilidade digital',
    hook: '"Achei um dado que a maioria dos advogados não sabe. Muda tudo."',
    roteiro: `[0–4s] Hook: "Achei um dado sobre advogados e presença digital. Muda tudo."

[5–14s] TRECHO / DADO EM TELA: "Mais de 70% das pessoas pesquisam o advogado no Google antes de contratar — mesmo quando vieram por indicação."

[15–28s] OPINIÃO FORTE: "Isso significa que mesmo o seu cliente que veio por indicação foi checar se você existe. Se seu escritório não está bem posicionado, você pode estar perdendo cliente que já era seu."

[29–42s] EXPLICAÇÃO: "O Google Meu Negócio com avaliações, um site funcional e anúncios segmentados não são 'diferencial'. São o básico que o cliente espera ver."

[43–55s] TAKEAWAY: "Seu escritório precisa passar confiança antes da primeira ligação. Isso é presença digital."

[56–60s] CTA: "Comenta 'PRESENÇA' que eu te mando um diagnóstico gratuito."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#googleadvocacia', '#destravadigital'],
    duration: '60s',
    color: '#818cf8',
  },
  {
    id: 12,
    format: 'story',
    formatoTrafegon: 'conversa',
    funil: 'fundo',
    emocao: 'Curiosidade',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-stories',
    platform: 'Instagram Stories',
    title: 'Como funciona a Assessoria de Crescimento na prática',
    hook: '"Me perguntaram: qual a diferença da Assessoria de Crescimento pra um curso?"',
    roteiro: `STORY 1:
"Me perguntaram essa semana:"
"'Qual a diferença da Assessoria de Crescimento pra um curso normal?'"
"Vou responder direto."

STORY 2:
"Curso: você aprende e tenta aplicar sozinho."
"Assessoria de Crescimento: a gente faz junto com você."
"Google Meu Negócio, anúncio, landing page, follow-up de lead."
"Tudo estruturado. Tudo rodando."

STORY 3:
"Você não precisa virar gestor de tráfego."
"Você precisa de cliente."
"A gente cuida do sistema. Você cuida do caso."

STORY 4 (CTA):
"Quer entender se faz sentido pro seu escritório?"
[Botão: Me chama no direct]`,
    hashtags: ['#advocacia', '#assessoriadecrescimento', '#marketingjuridico', '#escritoriodeadvocacia'],
    duration: '4 stories',
    color: '#2dd4bf',
  },

  /* ── Marketing & Vendas ─────────────────────────────────── */
  {
    id: 13,
    nicho: 'marketing',
    format: 'reel',
    formatoTrafegon: 'react',
    funil: 'topo',
    emocao: 'Frustração',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'Por que seu ROI em anúncio encolheu em 2026',
    hook: '"Você investia R$ 3 mil e vendia R$ 15 mil. Hoje investe R$ 3 mil e vende R$ 9 mil. Sabe por quê?"',
    roteiro: `[0–4s] Hook: "Você investe o mesmo em anúncio, mas vende menos. Não é culpa sua. Vou te mostrar o que mudou."
[5–15s] DADO: "Custo de mídia paga no Brasil subiu 22% só em 2026 — mais rápido que o faturamento da maioria das empresas."
[16–28s] PROBLEMA: "CPM no Meta Ads está no maior nível histórico. Quem só faz tráfego pago está com margem comprimida."
[29–42s] VIRADA: "A solução não é investir mais — é combinar anúncio com conteúdo orgânico que aquece o público antes do clique."
[43–55s] PROVA: "Empresa que produz 3 Reels por semana + anúncio para o público engajado paga 40% menos por lead."
[56–60s] CTA: "Comenta 'ROI' que te mando o modelo de estratégia híbrida que usamos aqui."`,
    hashtags: ['#trafegopago', '#metaads', '#googleads', '#marketingdigital', '#roi'],
    duration: '60s',
    color: '#ef4444',
  },
  {
    id: 14,
    nicho: 'marketing',
    format: 'reel',
    formatoTrafegon: 'lista',
    funil: 'topo',
    emocao: 'Curiosidade',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: '67% do consumo é vídeo curto — e você ainda não aparece',
    hook: '"67% de tudo que é consumido em rede social no Brasil é vídeo curto. Você está produzindo?"',
    roteiro: `[0–4s] Hook com dado: "67% do consumo de conteúdo em redes no Brasil é vídeo curto. Se você não está produzindo, você não existe."
[5–18s] AS 3 RAZÕES por que donos de negócio que aparecem em vídeo vendem mais:
#1: Autoridade instantânea — cliente já chega te conhecendo
#2: CAC menor — orgânico aquece, anúncio fecha
#3: Rejeição menor na venda — cliente decide antes de te ligar
[19–35s] DADO: "Micro criadores de nicho têm 3x mais taxa de conversão que páginas de marca genérica. (IAB Brasil 2026)"
[36–50s] VIRADA: "Não precisa de câmera profissional. Precisa de consistência e de falar do problema do seu cliente."
[51–60s] CTA: "Comenta 'VÍDEO' que te mando o roteiro de primeiro Reel pra você gravar hoje."`,
    hashtags: ['#reels', '#conteudodigital', '#marketingdigital', '#creatoreconomy', '#vendas'],
    duration: '60s',
    color: '#be29ec',
  },
  {
    id: 15,
    nicho: 'marketing',
    format: 'reel',
    formatoTrafegon: 'narrado',
    funil: 'meio',
    emocao: 'Praticidade',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'WhatsApp + Pix: o funil de vendas mais eficiente do Brasil hoje',
    hook: '"Meu cliente fatura R$ 80 mil por mês só com WhatsApp e Pix. Deixa eu te mostrar o fluxo."',
    roteiro: `[0–4s] Hook: "Meu cliente fatura R$ 80 mil por mês. Sem site elaborado, sem loja física sofisticada. Só WhatsApp e Pix."
[5–20s] PASSO 1: "Anúncio no Instagram com CTA direto pro WhatsApp — botão verde que vai pro número da empresa."
[21–35s] PASSO 2: "WhatsApp Business com catálogo de produtos, resposta rápida automática e status com oferta do dia."
[36–48s] PASSO 3: "Pix como fechamento — cobra na conversa, manda QR code, confirmação na hora. Zero atrito."
[49–57s] RESULTADO: "Tempo médio de venda: 8 minutos. Taxa de fechamento: 34%. CAC: R$ 12 por cliente."
[58–60s] CTA: "Comenta 'ZAP' que te mando o modelo de fluxo completo."`,
    hashtags: ['#whatsappbusiness', '#vendas', '#negociolocal', '#pix', '#marketingdigital'],
    duration: '60s',
    color: '#6eda2c',
  },
  {
    id: 16,
    nicho: 'marketing',
    format: 'carrossel',
    formatoTrafegon: 'comparativo',
    funil: 'meio',
    emocao: 'Aspiração',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-reels',
    platform: 'Instagram / LinkedIn',
    title: 'Empresa que usa IA no marketing VS empresa que não usa',
    hook: '"PMEs com IA economizam R$ 25 mil por ano e 50h por mês. Você ainda faz tudo na mão?"',
    roteiro: `SLIDE 1 (capa):
"Com IA VS Sem IA no marketing"
Dado real embaixo: "R$ 25 mil de diferença por ano." (Fonte: CDL/Serasa 2026)

SLIDE 2:
❌ Responde mensagem no WhatsApp manualmente
✅ IA responde 24h, qualifica o lead e agenda reunião

SLIDE 3:
❌ Cria proposta comercial do zero toda vez
✅ IA gera proposta personalizada em 3 minutos

SLIDE 4:
❌ Relatório de resultado leva 2 horas todo mês
✅ Dashboard automático atualizado em tempo real

SLIDE 5:
❌ Post feito na correria, sem consistência
✅ Calendário com roteiros prontos, publicação agendada

SLIDE 6 (CTA):
"Qual empresa você quer ser em 2026?"
"Comenta 'IA' que te mando as 5 ferramentas que usamos aqui."`,
    hashtags: ['#inteligenciaartificial', '#marketingdigital', '#automacao', '#pme', '#vendas'],
    duration: '6 slides',
    color: '#22d3ee',
  },
  {
    id: 17,
    nicho: 'marketing',
    format: 'reel',
    formatoTrafegon: 'tela-dividida',
    funil: 'topo',
    emocao: 'Medo de perda',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    title: 'Reel que vende VS Reel que só entretém',
    hook: '"Esse Reel vai ter 100 mil views. Esse vai trazer 30 clientes. Você quer qual?"',
    roteiro: `[0–4s] Hook com divisão visual: "Esse Reel vai ter 100 mil views. Esse vai trazer 30 clientes. Qual você quer?"
[5–20s] LADO 1 — entretém, não vende:
- Trend de dança ou meme
- Sem CTA claro
- Público aleatório
- View alta, conversão zero

LADO 2 — vende:
- Hook baseado no problema do cliente
- Solução em 30 segundos
- CTA com palavra de ativação
- View menor, lead direto

[21–40s] ESTRUTURA do Reel que converte:
0–3s: problema real do seu cliente
4–20s: solução específica
21–30s: prova (dado, resultado, antes/depois)
31–35s: CTA direto com palavra de ativação

[41–55s] PROVA: "Empresa de saúde que aplicou esse formato gerou 47 leads em 72h com 8.200 views."
[56–60s] CTA: "Comenta 'ROTEIRO' que te mando o template completo."`,
    hashtags: ['#reels', '#marketingdigital', '#vendas', '#conteudo', '#trafegopago'],
    duration: '60s',
    color: '#f59e0b',
  },
  {
    id: 18,
    nicho: 'marketing',
    format: 'story',
    formatoTrafegon: 'novelinha',
    funil: 'fundo',
    emocao: 'Identificação',
    produto: 'Gestão de Tráfego',
    channel: 'instagram-stories',
    platform: 'Instagram Stories',
    title: 'O dono que jogava dinheiro fora em anúncio todo mês',
    hook: '(cena: dono olha relatório — "Gasta R$ 5 mil todo mês e não fecha um cliente")',
    roteiro: `STORY 1:
[Cena: empreendedor olhando o celular, semblante frustrado]
"Gasta R$ 5 mil por mês em anúncio."
"Resultado: 3 leads que não fecharam."

STORY 2:
[Corte — reunião com gestor de tráfego]
"O problema não era o anúncio."
"Era que o perfil estava frio."
"Ninguém te conhecia. Ninguém confiava."
"O anúncio mandava tráfego pra um perfil que não convencia."

STORY 3:
[60 dias depois — com conteúdo + anúncio]
"Mesmo R$ 5 mil de investimento."
"28 leads qualificados."
"11 fechamentos."
"R$ 43 mil em contratos."

STORY 4 (CTA):
"A diferença foi a estratégia, não o orçamento."
[Botão: Quero entender como funciona]`,
    hashtags: ['#trafegopago', '#metaads', '#marketingdigital', '#vendas', '#empreendedorismo'],
    duration: '4 stories',
    color: '#ea8a29',
  },
]

function NewsCard({ news, index }) {
  const [saved, setSaved] = useState(false)
  const source = sourceMap[news.source]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="bg-white border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
      style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: source.color + '15', color: source.color }}>
            {source.name}
          </span>
          <span className="text-[10px] font-semibold text-muted bg-border/60 px-2 py-0.5 rounded-full">
            {news.category}
          </span>
          {news.trending && (
            <span className="text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp size={8} /> Em alta
            </span>
          )}
        </div>
        <button onClick={() => setSaved(s => !s)}
          className={`flex-shrink-0 transition-colors ${saved ? 'text-accent' : 'text-muted hover:text-text-2'}`}>
          <Bookmark size={14} className={saved ? 'fill-accent' : ''} />
        </button>
      </div>
      <h3 className="text-sm font-bold text-text leading-snug mb-2">{news.title}</h3>
      <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{news.summary}</p>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {news.tags.map(tag => (
          <span key={tag} className="text-[10px] text-muted bg-border/40 px-2 py-0.5 rounded-md">#{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1"><Clock size={9} /> {news.time}</span>
          <span className="flex items-center gap-1"><Tag size={9} /> {news.readTime} de leitura</span>
        </div>
        <a href={news.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-accent font-bold hover:text-accent-hover transition-colors">
          Ler <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  )
}

function ContentIdeaCard({ idea, index }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const Icon = FORMAT_ICONS[idea.format] ?? Film

  const FORMAT_LABELS = { reel: 'Reel', story: 'Story', carrossel: 'Carrossel', post: 'Post' }
  const funil = FUNIL_CONFIG[idea.funil]
  const formatoLabel = FORMATO_TRAFEGON_LABELS[idea.formatoTrafegon]

  function copyScript() {
    navigator.clipboard.writeText(`${idea.title}\n\nHOOK: ${idea.hook}\n\nROTEIRO:\n${idea.roteiro}\n\nHASHTAGS: ${idea.hashtags.join(' ')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function refineWithAI() {
    const prompt = `Preciso de um roteiro completo para um ${FORMAT_LABELS[idea.format]} com o tema: "${idea.title}". O hook é: "${idea.hook}". Melhore o roteiro abaixo adaptando para a TráfegOn, seguindo a matriz de conteúdo para advogados:\n\n${idea.roteiro}`
    localStorage.setItem('assistantPrefill', prompt)
    navigate('/assistant')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="bg-white border border-border rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}
    >
      <div className="h-1" style={{ backgroundColor: idea.color }} />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: idea.color + '18' }}>
            <Icon size={18} style={{ color: idea.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: idea.color + '15', color: idea.color }}>
                {formatoLabel}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: funil?.color + '18', color: funil?.color }}>
                {funil?.label}
              </span>
              <span className="text-[10px] font-semibold text-muted bg-border/60 px-2 py-0.5 rounded-full">
                {idea.produto}
              </span>
            </div>
            <h3 className="text-sm font-bold text-text leading-snug">{idea.title}</h3>
            <p className="text-[10px] text-muted mt-0.5">{idea.platform} · {idea.duration} · {idea.emocao}</p>
          </div>
        </div>

        <div className="bg-bg rounded-xl p-3 mb-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Hook de abertura</p>
          <p className="text-xs font-semibold text-text leading-relaxed italic">{idea.hook}</p>
        </div>

        <div className="bg-bg rounded-xl p-3 mb-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Roteiro / estrutura</p>
          <pre className="text-[11px] text-text-2 leading-relaxed whitespace-pre-wrap font-sans">{idea.roteiro}</pre>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {idea.hashtags.slice(0, 4).map(h => (
            <span key={h} className="text-[10px] text-muted bg-border/40 px-2 py-0.5 rounded-md">{h}</span>
          ))}
          {idea.hashtags.length > 4 && (
            <span className="text-[10px] text-muted">+{idea.hashtags.length - 4}</span>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={copyScript}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              copied ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-border/60 text-text-2 hover:bg-border'
            }`}>
            {copied ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar roteiro</>}
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={refineWithAI}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-accent hover:bg-accent-hover text-[#15172a] transition-all">
            <Zap size={12} /> Refinar com IA
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Noticias() {
  const [tab, setTab]               = useState('noticias')
  const [category, setCategory]     = useState('Todas')
  const [search, setSearch]         = useState('')
  const [nichoFilter, setNicho]     = useState('juridico')
  const [formatFilter, setFormat]   = useState('todos')
  const [funilFilter, setFunil]     = useState('todos')
  const [channelFilter, setChannel] = useState('todos')
  const [updating, setUpdating]     = useState(false)

  const filtered = NEWS.filter(n => {
    const matchCat = category === 'Todas' || n.category === category
    const matchSearch = search === '' ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const filteredIdeas = CONTENT_IDEAS.filter(i => {
    const matchNicho   = (i.nicho || 'juridico') === nichoFilter
    const matchFormat  = formatFilter  === 'todos' || i.format  === formatFilter
    const matchFunil   = funilFilter   === 'todos' || i.funil   === funilFilter
    const matchChannel = channelFilter === 'todos' || i.channel === channelFilter
    return matchNicho && matchFormat && matchFunil && matchChannel
  })

  function handleUpdate() {
    setUpdating(true)
    setTimeout(() => setUpdating(false), 2000)
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2">
              <Newspaper size={20} className="text-accent" /> Notícias & Conteúdo
            </h1>
            <p className="text-sm text-muted mt-0.5">Notícias do mercado + roteiros prontos para produção</p>
          </div>
          {tab === 'noticias' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleUpdate} disabled={updating}
              className="flex items-center gap-1.5 text-sm border border-border bg-white text-muted hover:text-text-2 font-semibold px-3 py-2 rounded-xl transition-all">
              <RefreshCw size={13} className={updating ? 'animate-spin' : ''} />
              {updating ? 'Atualizando...' : 'Atualizar'}
            </motion.button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-surface border border-border rounded-xl w-fit mb-5">
          {[
            { id: 'noticias', label: 'Notícias', icon: Newspaper },
            { id: 'conteudo', label: 'Ideias de Conteúdo', icon: Lightbulb },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === id ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text-2'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === 'noticias' ? (
          <motion.div key="noticias" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Sources strip */}
            <div className="bg-white border border-border rounded-xl p-3 mb-4">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                {SOURCES.length} fontes monitoradas
              </p>
              <div className="flex gap-2 flex-wrap">
                {SOURCES.map(source => (
                  <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ backgroundColor: source.color + '15', color: source.color }}>
                    {source.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por tema, tag ou palavra-chave..."
                  className="w-full bg-white border border-border rounded-xl pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
              </div>
            </div>

            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    category === cat ? 'bg-accent text-[#15172a]' : 'bg-white border border-border text-muted hover:text-text-2'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {category === 'Todas' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-[#ef4444]" />
                  <p className="text-xs font-bold text-text">Em alta agora</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {NEWS.filter(n => n.trending).map(n => (
                    <span key={n.id}
                      onClick={() => setSearch(n.tags[0])}
                      className="text-xs font-medium px-3 py-1 rounded-xl bg-white border border-border text-text flex items-center gap-1.5 cursor-pointer hover:border-accent/50 transition-colors">
                      <ChevronRight size={10} className="text-accent" />
                      {n.title.slice(0, 42)}...
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div className="bg-[#be29ec]/5 border border-[#be29ec]/20 rounded-xl p-3 mb-5 flex items-center gap-3">
              <Zap size={14} className="text-[#be29ec] flex-shrink-0" />
              <p className="text-xs text-muted">
                <span className="font-bold text-[#be29ec]">Dica:</span> Use o <strong>Assistente IA</strong> para
                pesquisar tendências em tempo real. Digite "pesquise notícias sobre [tema]" lá.
              </p>
            </motion.div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted text-sm">Nenhuma notícia encontrada.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((news, i) => <NewsCard key={news.id} news={news} index={i} />)}
              </div>
            )}

            <p className="text-center text-[10px] text-muted mt-6">
              Atualizado às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {SOURCES.length} fontes monitoradas
            </p>
          </motion.div>
        ) : (
          <motion.div key="conteudo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-5 flex items-start gap-3">
              <Lightbulb size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-text mb-0.5">Roteiros prontos — Matriz TráfegOn</p>
                <p className="text-xs text-muted">
                  Roteiros baseados em notícias e tendências atuais. Copie, refine com IA ou abra no Canva.
                </p>
              </div>
            </div>

            {/* Seletor de nicho */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'juridico',  label: '⚖️ Advogados' },
                { id: 'marketing', label: '📣 Marketing & Vendas' },
              ].map(n => (
                <button key={n.id} onClick={() => { setNicho(n.id); setFormat('todos'); setFunil('todos'); setChannel('todos') }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    nichoFilter === n.id ? 'bg-accent text-[#15172a]' : 'bg-white border border-border text-muted hover:text-text-2'
                  }`}>
                  {n.label}
                </button>
              ))}
            </div>

            {/* Filtros de formato */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              {[
                { id: 'todos', label: 'Todos formatos' },
                { id: 'reel',      label: '🎬 Reels' },
                { id: 'story',     label: '📱 Stories' },
                { id: 'carrossel', label: '🖼️ Carrosseis' },
              ].map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    formatFilter === f.id ? 'bg-accent text-[#15172a]' : 'bg-white border border-border text-muted hover:text-text-2'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Filtros de funil + canal */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {[
                { id: 'todos', label: 'Todo funil',  color: null },
                { id: 'topo',  label: 'Topo',        color: '#60a5fa' },
                { id: 'meio',  label: 'Meio',        color: '#ea8a29' },
                { id: 'fundo', label: 'Fundo',       color: '#6eda2c' },
              ].map(f => (
                <button key={f.id} onClick={() => setFunil(f.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 border ${
                    funilFilter === f.id
                      ? 'border-transparent text-white'
                      : 'bg-white border-border text-muted hover:text-text-2'
                  }`}
                  style={funilFilter === f.id && f.color ? { backgroundColor: f.color } : {}}>
                  {f.label}
                </button>
              ))}
              <div className="w-px h-6 bg-border self-center mx-1" />
              {[
                { id: 'todos',             label: 'Todos canais' },
                { id: 'instagram-reels',   label: '🎬 IG Reels' },
                { id: 'instagram-stories', label: '📱 IG Stories' },
              ].map(c => (
                <button key={c.id} onClick={() => setChannel(c.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    channelFilter === c.id ? 'bg-[#be29ec] text-white' : 'bg-white border border-border text-muted hover:text-text-2'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredIdeas.map((idea, i) => <ContentIdeaCard key={idea.id} idea={idea} index={i} />)}
            </div>

            <div className="mt-6 bg-white border border-border rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-text">Precisa de mais roteiros?</p>
                <p className="text-xs text-muted mt-0.5">Use o Assistente IA para gerar roteiros personalizados por nicho, produto ou campanha.</p>
              </div>
              <a href="/assistant"
                className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap">
                <Zap size={12} /> Abrir Assistente
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
