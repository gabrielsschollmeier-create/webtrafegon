import { useState, useEffect, useRef } from 'react'
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

/* ── RSS Feeds ──────────────────────────────────────────── */
const RSS_FEEDS = [
  { url: 'https://www.meioemensagem.com.br/feed/',       category: 'Marketing Digital' },
  { url: 'https://www.ecommercebrasil.com.br/feed/',     category: 'E-commerce' },
  { url: 'https://startupi.com.br/feed/',                category: 'Negócios' },
  { url: 'https://rockcontent.com/br/blog/feed/',        category: 'Conteúdo' },
  { url: 'https://resultadosdigitais.com.br/blog/feed/', category: 'Tráfego Pago' },
  { url: 'https://olhardigital.com.br/feed/',            category: 'Tecnologia' },
]

const PROXIES = [
  function(u) { return 'https://corsproxy.io/?' + encodeURIComponent(u) },
  function(u) { return 'https://api.allorigins.win/get?url=' + encodeURIComponent(u) },
  function(u) { return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u) },
]

function relTime(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return m + 'min atrás'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h atrás'
  const d = Math.floor(h / 24)
  return d + 'd atrás'
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&[a-zA-Z#0-9]+;/g, ' ').replace(/s+/g, ' ').trim()
}

function guessCategory(title, feedCategory) {
  const t = title.toLowerCase()
  if (t.includes('meta ads') || t.includes('google ads') || t.includes('trafego') || t.includes('campanha') || t.includes('anuncio')) return 'Tráfego Pago'
  if (t.includes('e-commerce') || t.includes('ecommerce') || t.includes('marketplace') || t.includes('loja virtual')) return 'E-commerce'
  if (t.includes('inteligencia artificial') || t.includes('chatgpt') || t.includes(' ia ') || t.includes('openai')) return 'Tecnologia'
  if (t.includes('instagram') || t.includes('tiktok') || t.includes('reels') || t.includes('conteudo') || t.includes('criador')) return 'Conteúdo'
  if (t.includes('startup') || t.includes('negocio') || t.includes('empreend')) return 'Negócios'
  return feedCategory
}

function guessTags(title) {
  const keywords = ['Meta Ads','Google Ads','TikTok','Instagram','YouTube','WhatsApp','SEO','IA','E-commerce','Reels','Performance','Branding','Conversão','ROI']
  return keywords.filter(function(k) { return title.toLowerCase().includes(k.toLowerCase()) }).slice(0, 3)
}

function parseXml(xmlStr) {
  try {
    return new DOMParser().parseFromString(xmlStr, 'text/xml')
  } catch { return null }
}

function getItemLink(item) {
  try {
    var guid = item.querySelector('guid')
    if (guid && guid.textContent.startsWith('http')) return guid.textContent.trim()
    var links = item.getElementsByTagName('link')
    for (var i = 0; i < links.length; i++) {
      var t = links[i].textContent.trim()
      if (t.startsWith('http')) return t
    }
  } catch {}
  return '#'
}

async function fetchRaw(feedUrl) {
  for (var pi = 0; pi < PROXIES.length; pi++) {
    try {
      var proxyUrl = PROXIES[pi](feedUrl)
      var res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      var ct = res.headers.get('content-type') || ''
      if (ct.includes('json')) {
        var json = await res.json()
        var txt = json.contents || json.data || ''
        if (txt && txt.includes('<item')) return txt
      } else {
        var txt2 = await res.text()
        if (txt2 && txt2.includes('<item')) return txt2
      }
    } catch {}
  }
  return null
}

async function fetchFeed(feed) {
  try {
    var raw = await fetchRaw(feed.url)
    if (!raw) return []
    var xml = parseXml(raw)
    if (!xml) return []
    var items = Array.from(xml.querySelectorAll('item')).slice(0, 6)
    var srcHost = ''
    try { srcHost = new URL(feed.url).hostname.replace('www.','') } catch {}
    return items.map(function(item, i) {
      var title   = stripHtml(item.querySelector('title')?.textContent || '')
      var desc    = stripHtml(item.querySelector('description')?.textContent || '')
      var link    = getItemLink(item)
      var pubDate = item.querySelector('pubDate')?.textContent || ''
      return {
        id: feed.category + '-' + i + '-' + Date.now(),
        title: title,
        summary: desc.slice(0, 240) || title,
        category: guessCategory(title, feed.category),
        source: srcHost,
        time: relTime(pubDate),
        pubDate: pubDate,
        readTime: Math.max(2, Math.ceil(desc.split(' ').length / 200)) + ' min',
        url: link,
        trending: false,
        tags: guessTags(title),
      }
    }).filter(function(n) { return n.title.length > 5 })
  } catch {
    return []
  }
}
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
  /* ── Advogados — marketing & captação de clientes ────── */
  {
    id: 1,
    nicho: 'juridico',
    format: 'reel',
    formatoTrafegon: 'narrado',
    funil: 'topo',
    emocao: 'Urgência',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    noticia: 'Custo de mídia paga cresceu 22% no Brasil em 2026',
    fonte: 'IAB Brasil / Mercado Hoje (maio 2026)',
    title: 'Anúncio ficou 22% mais caro — o escritório que só tem indicação não aguenta',
    hook: '"O custo de anúncio subiu 22% em 2026. Quem tem estrutura digital amortiza. Quem só tem indicação, não tem nem isso para compensar."',
    roteiro: `[0–4s] Hook direto: "O custo de anúncio subiu 22% em 2026. O escritório sem estrutura digital paga mais para conseguir o mesmo cliente."
[5–18s] CONTEXTO: "Quem tem Google Meu Negócio otimizado, Reels rodando e landing page ativa, o custo por lead continua aceitável. O orgânico aquece, o anúncio fecha."
[19–32s] O PROBLEMA: "Quem não tem isso precisa de anúncio para tudo. E paga 22% mais caro do que no ano passado."
[33–46s] A VIRADA: "Não é hora de investir mais em anúncio. É hora de construir a estrutura que reduz o quanto você precisa gastar para fechar cliente."
[47–56s] POSICIONAMENTO: "Isso é exatamente o que o Destrava Digital resolve. Estrutura antes do tráfego."
[57–60s] CTA: "Comenta 'ESTRUTURA' que te mando o diagnóstico gratuito do seu perfil."`,
    hashtags: ['#advocacia', '#advogado', '#marketingjuridico', '#trafegopago', '#destravadigital'],
    duration: '60s',
    color: '#ef4444',
  },
  {
    id: 2,
    nicho: 'juridico',
    format: 'reel',
    formatoTrafegon: 'react',
    funil: 'topo',
    emocao: 'Polarização',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    noticia: '67% do consumo em redes sociais é vídeo curto no Brasil',
    fonte: 'IAB Brasil / Mundo do Marketing (2026)',
    title: '67% do que seu cliente assiste é vídeo curto — você aparece em algum?',
    hook: '"Vi um advogado postar artigo de jurisprudência. Vi outro aparecer em Reel. Só um deles tem agenda cheia."',
    roteiro: `[0–4s] Hook: "Vi dois advogados na mesma semana. Um postou texto longo. O outro gravou Reel de 40 segundos. Sabe qual dos dois me mandou mensagem dizendo que estava cheio de consulta?"
[5–16s] DADO: "67% de tudo que é consumido no Instagram hoje é vídeo curto. O texto vai para quem já te segue. O vídeo vai para quem ainda não te conhece."
[17–30s] OPINIÃO: "Não é sobre abandonar conteúdo escrito. É entender onde o cliente novo está prestando atenção. E ele está no Reels."
[31–44s] OBJEÇÃO: "'Mas eu não sei gravar.' — Você sabe falar sobre o que você faz. Câmera do celular, luz natural, 45 segundos. Isso já resolve."
[45–56s] TAKEAWAY: "O escritório que está no vídeo hoje está 2 anos na frente do que vai começar amanhã."
[57–60s] CTA: "Comenta 'VÍDEO' que te mando o roteiro do primeiro Reel para gravar essa semana."`,
    hashtags: ['#advocacia', '#advogado', '#reels', '#marketingjuridico', '#destravadigital'],
    duration: '60s',
    color: '#60a5fa',
  },
  {
    id: 3,
    nicho: 'juridico',
    format: 'reel',
    formatoTrafegon: 'lista',
    funil: 'topo',
    emocao: 'Medo de perda',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    noticia: 'Busca local no Google cresceu 42% para serviços profissionais em 2026',
    fonte: 'Think with Google / Meio & Mensagem (2026)',
    title: 'Pesquisei "advogado [cidade]" agora — e você não está nos 3 primeiros',
    hook: '"Pesquisei agora \'advogado trabalhista [cidade]\'. Os 3 primeiros têm foto, avaliações e horário. Você?"',
    roteiro: `[0–4s] Hook com gravação de tela: "Pesquisei 'advogado trabalhista [cidade]' agora. Olha o que aparece."
[5–14s] MOSTRAR: "3 escritórios. Foto profissional, 40+ avaliações, horário, site, botão de ligação. Busca local cresceu 42% em 2026."
[15–28s] A REALIDADE: "Seu potencial cliente faz essa mesma pesquisa. Se você não aparece, ele contrata quem aparece. Não importa o quanto você é bom."
[29–40s] OS 3 FATORES que os primeiros têm em comum:
"1. Google Meu Negócio com fotos e posts atualizados"
"2. Mais de 20 avaliações com resposta do escritório"
"3. Categoria e área de atuação corretas"
[41–52s] POSICIONAMENTO: "Isso não é sorte. É gestão de presença local. Dá para configurar em menos de uma semana."
[53–60s] CTA: "Comenta 'GOOGLE' que te mando o passo a passo de otimização do Google Meu Negócio."`,
    hashtags: ['#googlemynegocio', '#advogado', '#marketingjuridico', '#buscalocal', '#assessoriadecrescimento'],
    duration: '60s',
    color: '#be29ec',
  },
  {
    id: 4,
    nicho: 'juridico',
    format: 'carrossel',
    formatoTrafegon: 'comparativo',
    funil: 'meio',
    emocao: 'Aspiração',
    produto: 'Assessoria de Crescimento',
    channel: 'instagram-reels',
    platform: 'Instagram / LinkedIn',
    noticia: 'PMEs com IA economizam R$ 25 mil por ano e 50h por mês',
    fonte: 'CDL / Serasa Experian / Bloomberg Línea (maio 2026)',
    title: 'Escritório com estrutura digital VS escritório no modo tradicional',
    hook: '"R$ 25 mil de diferença por ano. 50 horas a menos de trabalho repetitivo. Isso separa o escritório estruturado do que ainda faz tudo na mão."',
    roteiro: `SLIDE 1 (capa):
"Escritório estruturado VS Escritório tradicional — 2026"
Subtítulo: "R$ 25 mil de diferença por ano. (Fonte: CDL/Serasa)"

SLIDE 2:
❌ Aguarda indicação para ter novo cliente
✅ Recebe lead toda semana pelo Google e Instagram

SLIDE 3:
❌ Responde WhatsApp manualmente, perde lead fora do horário
✅ Atendimento automático qualifica e agenda 24h

SLIDE 4:
❌ Não sabe qual canal traz mais cliente
✅ Dashboard mostra custo por lead e taxa de conversão

SLIDE 5:
❌ Posta quando tem tempo — sem frequência
✅ Calendário de conteúdo rodando, Reels toda semana

SLIDE 6:
❌ Cresce quando tem sorte
✅ Cresce porque tem sistema

SLIDE 7 (CTA):
"Qual escritório você quer ser em 2026?"
"Comenta 'ESTRUTURA' que eu te mostro o que falta no seu."`,
    hashtags: ['#advocacia', '#marketingjuridico', '#advogado', '#assessoriadecrescimento', '#escritoriodeadvocacia'],
    duration: '7 slides',
    color: '#f59e0b',
  },
  {
    id: 5,
    nicho: 'juridico',
    format: 'reel',
    formatoTrafegon: 'tela-dividida',
    funil: 'topo',
    emocao: 'Medo de perda',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    noticia: 'WhatsApp é o principal canal de decisão de compra no Brasil em 2026',
    fonte: 'Opinion Box / Mundo do Marketing (2026)',
    title: 'Advogado que responde em 5 min fecha 10x mais do que quem demora 2 horas',
    hook: '"Mandei mensagem para 5 escritórios às 10h. Às 14h, só 1 tinha respondido. Esse 1 estava cheio."',
    roteiro: `[0–4s] Hook: "Fiz um teste. Mandei mensagem para 5 escritórios às 10h da manhã. Às 14h, apenas 1 tinha respondido."
LADO 1 (você falando) | LADO 2 (print das conversas — 4 sem resposta, 1 respondeu)

[5–18s] "O WhatsApp é o principal canal de decisão de compra no Brasil. O cliente que está pronto para contratar não manda e-mail. Ele manda mensagem."
[19–32s] "Responder em até 5 minutos aumenta em 10x a chance de fechar. Em 1 hora, cai para 2x. Em 24 horas? Cliente já contratou outro."
[33–46s] "O escritório que respondeu? Cheio de consulta agendada. Os outros 4? Perderam o lead sem saber."
[47–56s] "Não é sobre ser disponível 24h. É sobre ter automação de primeiro contato para não perder o lead quente."
[57–60s] CTA: "Comenta 'ZAP' que te mando o fluxo de atendimento que usamos para escritórios."`,
    hashtags: ['#advocacia', '#whatsappbusiness', '#marketingjuridico', '#advogado', '#destravadigital'],
    duration: '60s',
    color: '#ea8a29',
  },
  {
    id: 6,
    nicho: 'juridico',
    format: 'reel',
    formatoTrafegon: 'trend-texto',
    funil: 'topo',
    emocao: 'Curiosidade',
    produto: 'Destrava Digital',
    channel: 'instagram-reels',
    platform: 'Instagram Reels',
    noticia: 'Instagram vai remunerar criadores por visualizações de Reels a partir de julho de 2026',
    fonte: 'Social Media Hoje / Meta (2026)',
    title: 'Instagram vai pagar por Reels em julho — o advogado que já grava leva dobrado',
    hook: '"A partir de julho, Instagram paga por Reels. O advogado que já está gravando vai ter alcance E monetização."',
    roteiro: `FORMATO: Trend com texto sobreposto. Funciona sem som.

CENA: Advogado(a) olhando o celular, expressão de surpresa positiva.

TEXTO NA TELA (aparece em sequência):
"Instagram vai pagar criadores por Reels a partir de julho..."
"Com mais de 500 seguidores..."
"Por visualizações qualificadas..."
"O advogado que já está gravando vai receber:"
"Alcance orgânico ✓"
"Leads qualificados ✓"
"Monetização ✓"

Corte.

TEXTO FINAL:
"Enquanto você ainda está decidindo se começa a gravar,
seu concorrente já vai estar recebendo por isso.
Isso se chama: primeiro a se mover."

CTA: "Comenta 'REEL' que te mando o roteiro para começar essa semana."`,
    hashtags: ['#reels', '#instagram', '#advogado', '#marketingjuridico', '#destravadigital'],
    duration: '30s',
    color: '#34d399',
  },

  /* ── Marketing & Vendas — baseado em notícias maio/2026 ─── */
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
    noticia: 'Custo de mídia paga cresceu 22% no Brasil em 2026',
    fonte: 'IAB Brasil / Mercado Hoje (maio 2026)',
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
    noticia: '67% do consumo em redes sociais é vídeo curto no Brasil',
    fonte: 'IAB Brasil / Mundo do Marketing (2026)',
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
    noticia: 'Pix ultrapassou 7 bilhões de transações em janeiro de 2026',
    fonte: 'Banco Central / Cielo Blog (2026)',
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
    noticia: 'PMEs com IA economizam R$ 25 mil por ano e 50h por mês',
    fonte: 'CDL / Serasa Experian / Bloomberg Línea (maio 2026)',
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
    noticia: 'Creator economy e vídeos curtos dominam 67% do consumo digital no Brasil',
    fonte: 'IAB Brasil / Mundo do Marketing (2026)',
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
    noticia: 'Custo de mídia paga cresceu mais rápido que o faturamento das PMEs em 2026',
    fonte: 'IAB Brasil / Mercado Hoje (maio 2026)',
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
  const source = sourceMap[news.source] || { name: news.source, color: '#8890b5', url: news.url }
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

        {idea.noticia && (
          <div className="bg-accent/5 border border-accent/15 rounded-xl p-2.5 mb-3">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-accent mb-0.5">Base noticiosa</p>
            <p className="text-[11px] text-text-2 leading-snug">{idea.noticia}</p>
            <p className="text-[10px] text-muted mt-0.5">Fonte: {idea.fonte}</p>
          </div>
        )}

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
  const [news, setNews]             = useState([])
  const [loadingNews, setLoadingNews] = useState(true)
  const fetchCount = useRef(0)

  async function loadNews() {
    setLoadingNews(true)
    const id = ++fetchCount.current
    const results = await Promise.all(RSS_FEEDS.map(fetchFeed))
    if (id !== fetchCount.current) return
    const all = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    const seen = new Set()
    const deduped = all.filter(n => {
      const key = n.title.slice(0, 60)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (deduped.length > 0) {
      deduped[0].trending = true
      if (deduped[2]) deduped[2].trending = true
      if (deduped[5]) deduped[5].trending = true
    }
    setNews(deduped)
    setLoadingNews(false)
  }

  useEffect(() => { loadNews() }, [])

  const filtered = news.filter(n => {
    const matchCat = category === 'Todas' || n.category === category
    const matchSearch = search === '' ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const filteredIdeas = CONTENT_IDEAS.filter(i => {
    if (!i.noticia) return false
    const matchNicho   = (i.nicho || 'juridico') === nichoFilter
    const matchFormat  = formatFilter  === 'todos' || i.format  === formatFilter
    const matchFunil   = funilFilter   === 'todos' || i.funil   === funilFilter
    const matchChannel = channelFilter === 'todos' || i.channel === channelFilter
    return matchNicho && matchFormat && matchFunil && matchChannel
  })

  async function handleUpdate() {
    setUpdating(true)
    await loadNews()
    setUpdating(false)
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
                  {news.filter(n => n.trending).map(n => (
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

            {loadingNews ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-border rounded-2xl p-4 animate-pulse">
                    <div className="flex gap-2 mb-3">
                      <div className="h-4 w-20 bg-border/60 rounded-full" />
                      <div className="h-4 w-16 bg-border/60 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-border/60 rounded mb-1.5" />
                    <div className="h-4 w-4/5 bg-border/60 rounded mb-3" />
                    <div className="h-3 w-full bg-border/40 rounded mb-1" />
                    <div className="h-3 w-2/3 bg-border/40 rounded" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
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
