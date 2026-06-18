import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, X, ChevronDown, ChevronRight, CheckCircle2,
  Clock, Trash2, Edit2, Copy, Link2, Check, Zap, Search,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

const STORAGE_KEY = 'trafegon_playbooks_v2'
const CATEGORIES  = ['Onboarding', 'Tráfego Pago', 'Conteúdo', 'Vídeo', 'Landing Page', 'CRM', 'Reuniões', 'Entregas', 'Financeiro', 'Geral']

function load()       { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] } }
function save(data)   { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }

// Mapeia categoria/papel para tipo de tarefa ERP
function getTaskType(category, role) {
  if (role === 'gerente' || role === 'admin') return 'reuniao'
  const map = {
    'Tráfego Pago':   'campanha',
    'Conteúdo':       'criativo',
    'Vídeo':          'video',
    'Landing Page':   'lp',
    'CRM':            'reuniao',
    'Entregas':       'criativo',
    'Reuniões':       'reuniao',
    'Onboarding':     'reuniao',
    'Financeiro':     'reuniao',
  }
  return map[category] || 'reuniao'
}

// ── Playbooks de amostra ────────────────────────────────────────
const SAMPLE = [
  {
    id: 'pb1',
    title: 'Onboarding de Novo Cliente',
    category: 'Onboarding',
    description: 'Processo padrão de boas-vindas e configuração inicial para novos clientes da agência.',
    steps: [
      { id: 's1', title: 'Enviar e-mail de boas-vindas',                              daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 's2', title: 'Agendar reunião de kickoff',                                daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 's3', title: 'Criar workspace no sistema',                                daysAfter: 1, assigneeRole: 'admin',       done: false },
      { id: 's4', title: 'Configurar acesso ao portal do cliente',                    daysAfter: 2, assigneeRole: 'admin',       done: false },
      { id: 's5', title: 'Coletar acessos de plataformas (Meta, Google)',             daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 's6', title: 'Realizar auditoria das contas',                             daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 's7', title: 'Apresentar plano de ação 30 dias',                          daysAfter: 7, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-01',
    active: true,
  },
  {
    id: 'pb2',
    title: 'Relatório Mensal de Performance',
    category: 'Entregas',
    description: 'Fluxo mensal de coleta, análise e entrega de relatório aos clientes.',
    steps: [
      { id: 's1', title: 'Exportar dados de Meta Ads',              daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 's2', title: 'Exportar dados de Google Ads',            daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 's3', title: 'Compilar métricas no template',           daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 's4', title: 'Revisão gerencial',                       daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 's5', title: 'Enviar relatório ao cliente',             daysAfter: 3, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-01',
    active: true,
  },
  {
    id: 'pb_sm_onboarding',
    title: 'Onboarding — Social Media',
    category: 'Onboarding',
    description: 'Integração completa do colaborador de Social Media: produção de conteúdo, planejamento editorial, gestão e agendamento de páginas, e relatórios de engajamento.',
    steps: [
      { id: 'sm01', title: 'Reunião de alinhamento: tom de voz, personas e objetivos de cada cliente ativo',                    daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'sm02', title: 'Receber acessos: Instagram, Facebook Business, ferramenta de agendamento',                         daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'sm03', title: 'Onboarding no hub.trafegon.com.br — explorar todos os workspaces de clientes',                     daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'sm04', title: 'Ler info.md de cada cliente: nicho, histórico, campanhas ativas e posicionamento',                  daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'sm05', title: 'Mapear identidade visual de cada cliente: paleta, fontes e estilo gráfico',                         daysAfter: 2,  assigneeRole: 'colaborador', done: false },
      { id: 'sm06', title: 'Levantar frequência de postagem atual e engajamento médio por cliente',                              daysAfter: 2,  assigneeRole: 'colaborador', done: false },
      { id: 'sm07', title: 'Criar calendário editorial do primeiro mês para 2 clientes-piloto',                                 daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'sm08', title: 'Revisão e aprovação do calendário editorial pelo gestor',                                           daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'sm09', title: 'Produzir primeiras 3 artes por cliente seguindo padrão visual aprovado',                            daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'sm10', title: 'Revisão interna das artes — aprovação obrigatória antes de agendar',                                daysAfter: 6,  assigneeRole: 'gerente',     done: false },
      { id: 'sm11', title: 'Configurar agendamento e fluxo de publicação no Metricool',                                         daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'sm12', title: 'Apresentar plano editorial completo do mês para todos os clientes ativos',                          daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'sm13', title: 'Entregar primeira rodada completa: feed + stories agendados para a semana',                         daysAfter: 9,  assigneeRole: 'colaborador', done: false },
      { id: 'sm14', title: 'Monitorar métricas das primeiras publicações: alcance, curtidas, saves e comentários',              daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'sm15', title: 'Reunião de feedback com gestor — ajuste de linha editorial se necessário',                          daysAfter: 12, assigneeRole: 'gerente',     done: false },
      { id: 'sm16', title: 'Entregar 1º relatório quinzenal: alcance, engajamento, stories e top posts',                        daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'sm17', title: 'Iniciar ciclo de captação de depoimentos e provas sociais dos clientes',                            daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'sm18', title: 'Revisar e ajustar calendário da próxima quinzena com base nos dados',                               daysAfter: 20, assigneeRole: 'colaborador', done: false },
      { id: 'sm19', title: 'Propor ideias de campanha de conteúdo para o próximo mês (trends + datas comemorativas)',           daysAfter: 25, assigneeRole: 'colaborador', done: false },
      { id: 'sm20', title: 'Entrega do relatório mensal completo: métricas, aprendizados e plano D+30',                        daysAfter: 30, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-21',
    active: true,
  },
  {
    id: 'pb_sdr_onboarding',
    title: 'Onboarding — SDR (Pré-vendas)',
    category: 'Onboarding',
    description: 'Integração completa do SDR: prospecção ativa, qualificação de inbound, agendamento de reuniões de diagnóstico e follow-up estruturado.',
    steps: [
      { id: 'sdr01', title: 'Reunião de alinhamento: ICP, proposta de valor e diferenciais da TráfegOn',              daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'sdr02', title: 'Acesso ao hub.trafegon.com.br e configuração de ferramentas (WhatsApp Business, CRM)',   daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'sdr03', title: 'Estudar portfólio — explorar workspaces de clientes ativos no sistema',                  daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr04', title: 'Entender estrutura de precificação: planos, escopo e limites de serviço',                daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr05', title: 'Treinar discurso de prospecção: diferenciais vs concorrência',                           daysAfter: 2,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr06', title: 'Sombra em 1 ligação ou reunião de prospecção conduzida pelo gestor',                     daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr07', title: 'Produzir lista inicial de 30 prospects qualificados (nicho, porte, região alvo)',        daysAfter: 4,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr08', title: 'Validar lista de prospects e script de abordagem com o gestor',                          daysAfter: 5,  assigneeRole: 'gerente',     done: false },
      { id: 'sdr09', title: 'Apresentar estratégia do primeiro ciclo de prospecção',                                  daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr10', title: 'Início das abordagens ativas via WhatsApp/Instagram com script aprovado',                daysAfter: 8,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr11', title: 'Primeiro follow-up com prospects sem resposta (24h após contato inicial)',               daysAfter: 9,  assigneeRole: 'colaborador', done: false },
      { id: 'sdr12', title: 'Qualificar leads inbound: responder indicações e pedidos via DM/site',                   daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'sdr13', title: 'Meta da semana 2: 10 contatos, 3 conversas abertas, 1 diagnóstico agendado',            daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'sdr14', title: 'Relatório semanal de prospecção: contatos, respostas, objeções e pipeline',             daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'sdr15', title: 'Conduzir primeira reunião de diagnóstico com acompanhamento do gestor',                  daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'sdr16', title: 'Enviar proposta comercial com follow-up estruturado (D+1, D+3, D+7)',                   daysAfter: 18, assigneeRole: 'colaborador', done: false },
      { id: 'sdr17', title: 'Reunião de pipeline com gestor: revisar funil, objeções e ajustar estratégia',          daysAfter: 21, assigneeRole: 'gerente',     done: false },
      { id: 'sdr18', title: 'Meta do primeiro mês: 2 reuniões de diagnóstico com leads qualificados',                daysAfter: 25, assigneeRole: 'colaborador', done: false },
      { id: 'sdr19', title: 'Balanço do mês 1: leads contatados, conversas, propostas, fechamentos e objeções',      daysAfter: 30, assigneeRole: 'colaborador', done: false },
      { id: 'sdr20', title: 'Definir metas e estratégia do mês 2 em conjunto com o gestor',                          daysAfter: 30, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-21',
    active: true,
  },

  // ── Novos playbooks ───────────────────────────────────────────
  {
    id: 'pb_artes',
    title: 'Criação de Arte — Social Media',
    category: 'Conteúdo',
    description: 'Fluxo completo de produção de artes para feed, stories e reels, desde o briefing até a publicação.',
    steps: [
      { id: 'a01', title: 'Briefing: objetivo, produto/serviço, público, mensagem e referências visuais',            daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'a02', title: 'Pesquisar tendências visuais, concorrentes e referências no Pinterest/Behance',           daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'a03', title: 'Definir formato: carrossel, single, stories, capa de reels',                             daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'a04', title: 'Criar versão inicial no Canva/Figma respeitando identidade visual do cliente',            daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'a05', title: 'Revisão interna: coerência visual, tipografia, paleta e legibilidade',                   daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'a06', title: 'Enviar para aprovação do cliente via portal ou WhatsApp',                                 daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'a07', title: 'Aplicar ajustes solicitados após feedback do cliente',                                    daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'a08', title: 'Exportar em todos os formatos: PNG, JPG, MP4 (se animado), tamanhos corretos',           daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'a09', title: 'Agendar publicação no Metricool ou entregar ao cliente para postagem',                   daysAfter: 4, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_video',
    title: 'Produção de Vídeo — Reels/Stories',
    category: 'Vídeo',
    description: 'Processo de criação de vídeos curtos para Instagram Reels e Stories, do roteiro à publicação.',
    steps: [
      { id: 'v01', title: 'Briefing: tema, objetivo, duração, formato e tom de comunicação',                         daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'v02', title: 'Escrever roteiro ou storyboard (texto + direção de câmera/cenas)',                        daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'v03', title: 'Revisão e aprovação do roteiro',                                                          daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'v04', title: 'Captação ou seleção de material bruto (vídeo, fotos, screen recordings)',                 daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'v05', title: 'Edição: cortes, trilha sonora, legendas, efeitos e transições',                          daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'v06', title: 'Revisão interna do vídeo — qualidade, sincronia e mensagem',                             daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'v07', title: 'Enviar para aprovação do cliente (link Drive ou WeTransfer)',                             daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'v08', title: 'Aplicar ajustes solicitados pelo cliente',                                                daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'v09', title: 'Exportar em formato final: MP4 1080p, 9:16 para Reels, 1:1 para feed',                   daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'v10', title: 'Agendar publicação no Metricool com thumbnail, legenda e hashtags',                      daysAfter: 6, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_trafego',
    title: 'Gestão de Tráfego Pago — Novo Cliente',
    category: 'Tráfego Pago',
    description: 'Onboarding de tráfego pago: auditoria, estratégia, configuração de campanhas Meta Ads e Google Ads com monitoramento inicial.',
    steps: [
      { id: 't01', title: 'Briefing: objetivo da campanha, produto, público, orçamento e prazo',                    daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 't02', title: 'Solicitar acessos: Meta Business Manager, Google Ads, Analytics',                        daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 't03', title: 'Auditoria das contas: pixels, conversões, histórico, estrutura de campanhas',            daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 't04', title: 'Definir estratégia: funil de campanha, objetivos por etapa e distribuição de verba',     daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 't05', title: 'Pesquisar públicos-alvo: interesses, lookalikes, palavras-chave e segmentações',        daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 't06', title: 'Solicitar ou criar criativos: imagens, vídeos e copies para os anúncios',               daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 't07', title: 'Configurar campanhas no Meta Ads (ToFu, MoFu, BoFu)',                                    daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 't08', title: 'Configurar campanhas no Google Ads (Search, Display ou Performance Max)',               daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 't09', title: 'Revisão técnica antes de ativar: pixels, conversões, links, lances e orçamentos',       daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 't10', title: 'Ativar campanhas com orçamento conservador (fase de aprendizado)',                       daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 't11', title: 'Monitoramento das primeiras 48h — ajustar lances, pausar anúncios ruins',               daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 't12', title: 'Relatório da primeira semana: impressões, CTR, CPC, conversões e custo/resultado',      daysAfter: 10, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_lp',
    title: 'Criação de Landing Page',
    category: 'Landing Page',
    description: 'Processo completo de criação de LP: briefing, copy, desenvolvimento, configuração de pixel, aprovação e publicação.',
    steps: [
      { id: 'lp01', title: 'Briefing: produto/serviço, público-alvo, objetivo da LP e CTA principal',              daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'lp02', title: 'Definir estrutura: seções, fluxo de leitura, formulário vs WhatsApp',                  daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'lp03', title: 'Escrever copy: headline, subheadline, benefícios, prova social e CTA',                 daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'lp04', title: 'Revisão e aprovação da copy',                                                           daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'lp05', title: 'Desenvolvimento da LP (HTML/CSS responsivo ou builder)',                                daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'lp06', title: 'Instalar e configurar pixel de conversão (Meta e/ou Google Tag)',                       daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'lp07', title: 'Revisão interna: responsivo mobile, velocidade, links e formulário',                   daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 'lp08', title: 'Enviar para aprovação do cliente',                                                      daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'lp09', title: 'Aplicar ajustes finais solicitados',                                                    daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'lp10', title: 'Publicar LP na URL final e validar em mobile e desktop',                               daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'lp11', title: 'Conectar à campanha de tráfego e testar fluxo completo de conversão',                  daysAfter: 7, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_crm',
    title: 'Análise Mensal de CRM e Pipeline',
    category: 'CRM',
    description: 'Rotina mensal de análise do funil de vendas: taxas de conversão, gargalos, leads parados e ações corretivas.',
    steps: [
      { id: 'c01', title: 'Exportar todos os leads dos últimos 30 dias com status e origem',                        daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'c02', title: 'Calcular taxa de conversão por etapa do funil (lead → qualificado → proposta → fechado)',daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'c03', title: 'Identificar gargalos: onde os leads travam mais tempo',                                  daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'c04', title: 'Mapear leads sem follow-up nos últimos 7 dias',                                          daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'c05', title: 'Analisar tempo médio em cada etapa vs meta ideal',                                       daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'c06', title: 'Cruzar campanhas ativas com leads gerados por fonte (Meta, Google, indicação)',          daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'c07', title: 'Reunião de análise com time comercial: dados + insights',                                daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'c08', title: 'Definir ações corretivas: scripts, ofertas, follow-up e campanhas de reativação',       daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'c09', title: 'Atualizar status de leads parados e registrar motivo no CRM',                           daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'c10', title: 'Relatório mensal: total de leads, conversões, receita gerada e próximos passos',        daysAfter: 5, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
]

/* ── Playbooks expandidos ───────────────────────────────────── */
const EXTRA_PLAYBOOKS = [
  /* ── ONBOARDING ── */
  {
    id: 'pb_ges_onboarding',
    title: 'Onboarding — Gestor de Tráfego',
    category: 'Onboarding',
    description: 'Integração completa de novo gestor de tráfego: plataformas, clientes, processos, métricas e primeiras entregas.',
    steps: [
      { id: 'g01', title: 'Reunião de alinhamento: estrutura da agência, clientes ativos, processos e metas', daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'g02', title: 'Receber acessos: Meta Business Manager, Google Ads, Analytics, hub.trafegon.com.br', daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'g03', title: 'Onboarding no sistema: explorar ERP, workspaces e pipeline de tarefas', daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'g04', title: 'Ler info.md de cada cliente: nicho, objetivo, campanhas ativas, histórico e resultados', daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'g05', title: 'Auditoria das contas: estrutura de campanhas, pixels, conversões e histórico de performance', daysAfter: 2,  assigneeRole: 'colaborador', done: false },
      { id: 'g06', title: 'Documentar pontos críticos e oportunidades encontradas na auditoria', daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'g07', title: 'Apresentar diagnóstico e plano de ação dos primeiros 30 dias ao gestor', daysAfter: 4,  assigneeRole: 'colaborador', done: false },
      { id: 'g08', title: 'Revisão e aprovação do plano de ação', daysAfter: 5,  assigneeRole: 'gerente',     done: false },
      { id: 'g09', title: 'Sombra em reunião de cliente com gestor sênior', daysAfter: 6,  assigneeRole: 'colaborador', done: false },
      { id: 'g10', title: 'Iniciar otimizações nos primeiros clientes sob sua responsabilidade', daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'g11', title: 'Relatório da primeira semana: mudanças feitas, resultados iniciais e aprendizados', daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'g12', title: 'Reunião de feedback do primeiro mês: ajuste de processos e metas M+1', daysAfter: 30, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_adm_onboarding',
    title: 'Onboarding — Atendimento / Administrativo',
    category: 'Onboarding',
    description: 'Integração do colaborador de atendimento: comunicação com clientes, agendamentos, processos administrativos e onboarding de novos clientes.',
    steps: [
      { id: 'adm01', title: 'Reunião de boas-vindas: visão da empresa, tom de comunicação e padrões de atendimento', daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'adm02', title: 'Configurar ferramentas: WhatsApp Business, e-mail corporativo, sistema de agendamento', daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'adm03', title: 'Estudar templates de mensagens, roteiros de atendimento e FAQ de objeções', daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'adm04', title: 'Mapear todos os clientes ativos: nome, responsável, frequência de reuniões e status', daysAfter: 1,  assigneeRole: 'colaborador', done: false },
      { id: 'adm05', title: 'Sombra em 2 reuniões de clientes (onboarding e mensal)', daysAfter: 2,  assigneeRole: 'colaborador', done: false },
      { id: 'adm06', title: 'Assumir agendamentos de reuniões e confirmações semanais', daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'adm07', title: 'Entender processo de cobrança: datas de vencimento, envio de notas e follow-up financeiro', daysAfter: 4,  assigneeRole: 'colaborador', done: false },
      { id: 'adm08', title: 'Conduzir primeira comunicação independente com cliente (supervisionada)', daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'adm09', title: 'Relatório de onboarding: processos dominados, dúvidas pendentes e sugestões', daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'adm10', title: 'Reunião de avaliação do primeiro mês com gestor', daysAfter: 30, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── TRÁFEGO PAGO ── */
  {
    id: 'pb_trafego_otimizacao',
    title: 'Otimização Mensal de Campanhas',
    category: 'Tráfego Pago',
    description: 'Ciclo mensal completo de análise, otimização e reporte de campanhas Meta Ads e Google Ads.',
    steps: [
      { id: 'to01', title: 'Exportar dados do mês: Meta Ads, Google Ads e Analytics (CTR, CPM, CPC, conversões, ROAS)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'to02', title: 'Identificar campanhas abaixo do benchmark: CPA > meta, CTR < 1%, ROAS < 2x', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'to03', title: 'Pausar anúncios com baixa performance (CTR < 0,8% e sem conversão após 300 impressões)', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'to04', title: 'Testar novos criativos: ao menos 2 variações de copy e 2 de imagem por conjunto', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'to05', title: 'Ajustar segmentação: excluir públicos saturados, ampliar ou restringir interesses', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'to06', title: 'Revisar lances e orçamento: realocar verba para campanhas com melhor ROAS', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'to07', title: 'Verificar e expandir palavras-chave no Google Ads: negativar irrelevantes, adicionar variações', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'to08', title: 'Testar novas extensões de anúncio e melhorar quality score', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'to09', title: 'Revisão gerencial: análise crítica dos resultados e aprovação de mudanças', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'to10', title: 'Compilar relatório mensal com dados, análise, ações e projeção para próximo mês', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'to11', title: 'Enviar relatório ao cliente com apresentação em reunião', daysAfter: 6, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_trafego_sazonal',
    title: 'Campanha Sazonal — Datas Comemorativas',
    category: 'Tráfego Pago',
    description: 'Planejamento e execução de campanha de alto impacto para datas sazonais (Black Friday, Natal, Dia das Mães, etc.).',
    steps: [
      { id: 'ts01', title: 'Definir objetivo da campanha: faturamento, leads, tráfego ou awareness', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ts02', title: 'Criar briefing completo: produto em destaque, desconto, mecânica e prazo da oferta', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ts03', title: 'Definir budget: verba diária, período de veiculação e distribuição por canal', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ts04', title: 'Produzir criativos sazonais: pelo menos 3 versões (estática, carrossel e vídeo)', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'ts05', title: 'Escrever copies específicas para a data: urgência, escassez, benefício central', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'ts06', title: 'Configurar campanhas separadas por temperatura: frio (topo), morno (retargeting), quente (CRM)', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'ts07', title: 'Revisar landing page ou página de destino: compatível com a oferta e data', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'ts08', title: 'Revisão técnica completa: pixels, conversões, links e orçamentos', daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 'ts09', title: 'Ativar campanhas com monitoramento intensivo nos primeiros 3 dias', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'ts10', title: 'Pós-campanha: relatório de resultado vs meta, aprendizados e banco de criativos', daysAfter: 10, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_trafego_audit_meta',
    title: 'Auditoria de Conta Meta Ads',
    category: 'Tráfego Pago',
    description: 'Auditoria completa de conta Meta Ads: estrutura, pixel, públicos, criativos, conversões e compliance.',
    steps: [
      { id: 'am01', title: 'Verificar configuração do Pixel: eventos disparando corretamente (PageView, Lead, Purchase)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'am02', title: 'Auditar estrutura de campanhas: nomenclatura, objetivos e hierarquia de conjuntos', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'am03', title: 'Analisar públicos: sobreposição, saturação e tamanho de cada audiência', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'am04', title: 'Revisar criativos ativos: frequência, relevance score e variações sendo testadas', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'am05', title: 'Verificar compliance: políticas de anúncio, aprovações e histórico de reprovações', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'am06', title: 'Analisar funil completo: CPM → CTR → CPC → Landing → Conversão', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'am07', title: 'Comparar performance com benchmarks do nicho', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'am08', title: 'Entregar relatório de auditoria com prioridades e plano de ação', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'am09', title: 'Implementar ações prioritárias da auditoria', daysAfter: 5, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_trafego_audit_google',
    title: 'Auditoria de Conta Google Ads',
    category: 'Tráfego Pago',
    description: 'Auditoria técnica completa de conta Google Ads: qualidade, palavras-chave, extensões, conversões e score.',
    steps: [
      { id: 'ag01', title: 'Verificar configurações de conversão: tags, importações do GA4 e acompanhamento correto', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ag02', title: 'Auditar estrutura de campanhas: Search, Display, PMax — nomenclatura e objetivos', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ag03', title: 'Analisar palavras-chave: Quality Score < 5, termos de pesquisa irrelevantes, negativações pendentes', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'ag04', title: 'Revisar extensões: sitelinks, chamadas, frases de destaque e snippets estruturados', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'ag05', title: 'Analisar grupos de anúncio: relevância, variação de cópias e índice de otimização', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'ag06', title: 'Verificar páginas de destino: speed, mobile, relevância e taxa de conversão', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'ag07', title: 'Revisar estratégia de lances: CPA alvo, ROAS alvo ou manual — adequado ao histórico', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'ag08', title: 'Gerar relatório de auditoria com pontuação por área e plano de melhoria', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'ag09', title: 'Implementar otimizações prioritárias', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'ag10', title: 'Monitorar impact das mudanças nas primeiras 2 semanas', daysAfter: 14, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_trafego_reativacao',
    title: 'Reativação de Cliente com Campanha Pausada',
    category: 'Tráfego Pago',
    description: 'Processo de reativação de cliente que pausou ou está em risco: diagnóstico, proposta e relançamento das campanhas.',
    steps: [
      { id: 'tr01', title: 'Diagnóstico: levantar motivo da pausa, expectativas não atendidas e histórico de resultados', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'tr02', title: 'Análise técnica: identificar o que pode ser melhorado nas campanhas anteriores', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'tr03', title: 'Montar proposta de relançamento: estratégia, metas realistas e cronograma', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'tr04', title: 'Reunião de alinhamento com cliente: apresentar diagnóstico e proposta', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'tr05', title: 'Ajustar criativos, copies e segmentações com base nos aprendizados anteriores', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'tr06', title: 'Configurar campanhas de relançamento com período de teste de 15 dias', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'tr07', title: 'Monitoramento intensivo da primeira semana: relatório diário simplificado', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'tr08', title: 'Check-in de 15 dias: resultado vs expectativa e ajuste de estratégia se necessário', daysAfter: 15, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── CONTEÚDO ── */
  {
    id: 'pb_conteudo_editorial',
    title: 'Planejamento Editorial Mensal',
    category: 'Conteúdo',
    description: 'Processo de criação e aprovação do calendário editorial mensal: temas, formatos, datas e linha editorial.',
    steps: [
      { id: 'ce01', title: 'Levantar datas comemorativas e sazonais do mês relevantes para o nicho', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ce02', title: 'Pesquisar tendências e tópicos em alta: Instagram Trends, Google Trends, concorrentes', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ce03', title: 'Definir pilares de conteúdo do mês: autoridade, vendas, engajamento e entretenimento', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ce04', title: 'Criar calendário: distribuição de formatos (feed, stories, reels, carrossel) e temas por dia', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'ce05', title: 'Escrever hooks e títulos de todos os conteúdos do mês', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'ce06', title: 'Revisão e aprovação do calendário editorial pelo gestor', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'ce07', title: 'Enviar calendário para aprovação do cliente', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'ce08', title: 'Ajustar calendário com base no feedback do cliente', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'ce09', title: 'Iniciar produção de artes e roteiros da primeira quinzena', daysAfter: 7, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_conteudo_stories',
    title: 'Campanha de Stories/Reels Temática',
    category: 'Conteúdo',
    description: 'Planejamento e execução de campanha de conteúdo temático: série de stories ou reels com narrativa conectada.',
    steps: [
      { id: 'cs01', title: 'Definir tema da campanha: produto, evento, data comemorativa ou narrativa de marca', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'cs02', title: 'Criar arco narrativo: começo (problema/gancho), meio (conteúdo) e fim (CTA)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cs03', title: 'Escrever roteiros de cada peça: stories diários ou série de reels', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cs04', title: 'Revisão dos roteiros e aprovação interna', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'cs05', title: 'Produzir artes, stickers, enquetes e elementos interativos dos stories', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'cs06', title: 'Gravar ou editar vídeos dos reels se necessário', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'cs07', title: 'Revisão final: coerência visual, sequência narrativa e CTAs', daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 'cs08', title: 'Enviar para aprovação do cliente', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'cs09', title: 'Agendar publicações no Metricool com timing estratégico', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'cs10', title: 'Monitorar métricas e engajamento durante a campanha', daysAfter: 8, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_conteudo_prova',
    title: 'Captação de Prova Social e Depoimentos',
    category: 'Conteúdo',
    description: 'Processo para coletar, produzir e publicar depoimentos, cases e provas sociais de clientes.',
    steps: [
      { id: 'cp01', title: 'Mapear clientes satisfeitos com bons resultados para solicitar depoimento', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'cp02', title: 'Enviar mensagem personalizada solicitando depoimento (template aprovado)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cp03', title: 'Coletar respostas: texto via WhatsApp, vídeo curto ou Google Forms', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cp04', title: 'Editar depoimentos para formato de stories e feed (manter autenticidade)', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'cp05', title: 'Criar artes visuais com citações-chave dos depoimentos', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'cp06', title: 'Produzir carrossel "resultado de cliente" com dados antes/depois se disponíveis', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'cp07', title: 'Revisão e aprovação interna e pelo cliente depoente', daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 'cp08', title: 'Publicar no feed, stories e highlights de depoimentos', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'cp09', title: 'Arquivar depoimentos no banco de provas sociais da agência', daysAfter: 7, assigneeRole: 'admin',       done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── VÍDEO ── */
  {
    id: 'pb_video_institucional',
    title: 'Produção de Vídeo Institucional',
    category: 'Vídeo',
    description: 'Processo completo de produção de vídeo institucional da empresa para site, YouTube e redes sociais.',
    steps: [
      { id: 'vi01', title: 'Briefing: posicionamento, mensagem central, público, tom e distribuição do vídeo', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'vi02', title: 'Escrever roteiro completo: estrutura narrativa, falas, cenas e direção criativa', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'vi03', title: 'Revisão e aprovação do roteiro pelo cliente', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'vi04', title: 'Criar storyboard: sequência de cenas, ângulos e textos na tela', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'vi05', title: 'Coordenar gravação: espaço, iluminação, figurino e equipamento', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'vi06', title: 'Captação do material bruto (gravação das cenas)', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'vi07', title: 'Edição: montagem, cortes, trilha, narração, animações e legendas', daysAfter: 8, assigneeRole: 'colaborador', done: false },
      { id: 'vi08', title: 'Revisão interna: fluência, mensagem, qualidade técnica e identidade visual', daysAfter: 10, assigneeRole: 'gerente',     done: false },
      { id: 'vi09', title: 'Enviar para aprovação do cliente com prazo de feedback', daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'vi10', title: 'Aplicar ajustes finais e exportar em todos os formatos', daysAfter: 13, assigneeRole: 'colaborador', done: false },
      { id: 'vi11', title: 'Publicar nas plataformas e otimizar descrição, tags e thumbnail', daysAfter: 14, assigneeRole: 'colaborador', done: false },
      { id: 'vi12', title: 'Criar versões adaptadas: 60s para Reels, 15s para Stories, 16:9 para YouTube', daysAfter: 14, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_video_depoimento',
    title: 'Vídeo de Depoimento de Cliente',
    category: 'Vídeo',
    description: 'Captação, edição e publicação de vídeo-depoimento de cliente para prova social.',
    steps: [
      { id: 'vd01', title: 'Selecionar cliente para depoimento: resultado expressivo e boa oratória', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'vd02', title: 'Preparar roteiro de perguntas: situação antes, transformação, resultado e recomendação', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'vd03', title: 'Orientar o cliente: como se posicionar, iluminação e fundo para gravação', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'vd04', title: 'Gravação presencial ou via chamada (OBS + Zoom/Meet)', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'vd05', title: 'Editar depoimento: cortes, legendas automáticas, trilha leve e identidade visual', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'vd06', title: 'Revisão interna: autenticidade, clareza da mensagem e qualidade técnica', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'vd07', title: 'Enviar para aprovação do cliente depoente', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'vd08', title: 'Publicar como Reel, story e versão horizontal no feed ou YouTube', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'vd09', title: 'Usar trecho de 15s como anúncio de prova social nas campanhas ativas', daysAfter: 6, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── LANDING PAGE ── */
  {
    id: 'pb_lp_lancamento',
    title: 'LP para Lançamento de Produto/Serviço',
    category: 'Landing Page',
    description: 'Criação de landing page de alto impacto para lançamento, com copy persuasiva, prova social e funil de captura.',
    steps: [
      { id: 'll01', title: 'Briefing completo: produto, diferenciais, público, objeções e CTA principal', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'll02', title: 'Definir funil: captura de lead, vendas diretas ou agendamento', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'll03', title: 'Pesquisar linguagem do cliente ideal: fóruns, comentários, concorrentes', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'll04', title: 'Estruturar wireframe: hero, problema, solução, benefícios, prova social, garantia, FAQ, CTA', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'll05', title: 'Escrever copy completa: headline, subheadline, bullet points e CTAs', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'll06', title: 'Revisão e aprovação da copy', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'll07', title: 'Desenvolver LP: HTML/CSS responsivo ou builder (Elementor, Webflow, ClickFunnels)', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'll08', title: 'Instalar pixels Meta e Google Tag, configurar eventos de conversão', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'll09', title: 'Teste completo: mobile, desktop, velocidade (PageSpeed > 80), formulário e links', daysAfter: 6, assigneeRole: 'gerente',     done: false },
      { id: 'll10', title: 'Enviar para aprovação do cliente com link de preview', daysAfter: 6, assigneeRole: 'colaborador', done: false },
      { id: 'll11', title: 'Aplicar ajustes e publicar na URL definitiva', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'll12', title: 'Conectar às campanhas de tráfego e validar fluxo completo de conversão', daysAfter: 7, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_lp_leadmagnet',
    title: 'LP de Captura — Lead Magnet',
    category: 'Landing Page',
    description: 'Criação de página de captura de leads com entrega de isca digital: e-book, checklist, vídeo aula ou planilha.',
    steps: [
      { id: 'lm01', title: 'Definir lead magnet: tipo (e-book, checklist, planilha), tema e promessa de resultado', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'lm02', title: 'Produzir o conteúdo do lead magnet (PDF, planilha ou vídeo)', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'lm03', title: 'Criar mockup visual do material para usar como imagem na LP', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'lm04', title: 'Escrever copy da página: headline de benefício, 3 bullet points e CTA de captura', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'lm05', title: 'Desenvolver página minimalista: hero + formulário + botão + política de privacidade', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'lm06', title: 'Configurar integração do formulário com e-mail marketing (Brevo, Mailchimp, ActiveCampaign)', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'lm07', title: 'Configurar e-mail de entrega automática do material', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'lm08', title: 'Instalar pixels e testar fluxo completo de conversão', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'lm09', title: 'Aprovação do cliente e publicação na URL final', daysAfter: 6, assigneeRole: 'gerente',     done: false },
      { id: 'lm10', title: 'Conectar ao tráfego pago e monitorar taxa de conversão (meta: > 30%)', daysAfter: 7, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_lp_cro',
    title: 'Otimização de LP Existente (CRO)',
    category: 'Landing Page',
    description: 'Processo de análise e otimização de conversão em landing page já publicada.',
    steps: [
      { id: 'cro01', title: 'Analisar dados atuais: taxa de conversão, bounce rate, tempo na página e heatmap', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cro02', title: 'Identificar elementos problemáticos: headline fraca, CTA invisível, formulário longo', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cro03', title: 'Testar velocidade (PageSpeed Insights): meta > 80 mobile', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cro04', title: 'Reescrever headline e subheadline com foco no benefício principal', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cro05', title: 'Redesenhar CTA: cor, texto, posicionamento e repetição na página', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'cro06', title: 'Adicionar ou melhorar prova social: depoimentos, selos, números', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'cro07', title: 'Simplificar formulário: reduzir campos ao mínimo necessário', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'cro08', title: 'Implementar urgência: contador, vagas limitadas ou oferta por tempo', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'cro09', title: 'Publicar versão otimizada e monitorar resultados por 14 dias', daysAfter: 4, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── CRM ── */
  {
    id: 'pb_crm_followup',
    title: 'Qualificação e Follow-up de Leads',
    category: 'CRM',
    description: 'Processo estruturado de qualificação de novos leads e follow-up até decisão de compra.',
    steps: [
      { id: 'cf01', title: 'Novo lead entra: registrar no CRM com origem, data e canal', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cf02', title: 'Primeiro contato em até 5 minutos via WhatsApp com mensagem de boas-vindas', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cf03', title: 'Qualificar lead: perguntas BANT (Budget, Authority, Need, Timeline)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cf04', title: 'Segmentar lead: quente (agendamento), morno (nutrir), frio (sequência automática)', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cf05', title: 'Agendar reunião de diagnóstico com lead quente', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cf06', title: 'Follow-up D+2 para lead sem resposta: segunda mensagem com gatilho diferente', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'cf07', title: 'Conduzir reunião de diagnóstico: descobrir dores, objetivos e orçamento', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'cf08', title: 'Montar e enviar proposta personalizada dentro de 24h após a reunião', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'cf09', title: 'Follow-up D+1 após proposta: verificar dúvidas e objeções', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'cf10', title: 'Follow-up D+3: oferecer ajuste na proposta ou material complementar', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'cf11', title: 'Follow-up D+7 final: tomada de decisão ou reentrada em sequência de longo prazo', daysAfter: 11, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_crm_reativacao',
    title: 'Reativação de Leads Frios',
    category: 'CRM',
    description: 'Campanha de reativação para leads que não responderam há mais de 30 dias.',
    steps: [
      { id: 'cr01', title: 'Exportar leads inativos há mais de 30 dias e segmentar por perfil', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'cr02', title: 'Criar sequência de reativação: 3 mensagens em 7 dias com abordagens diferentes', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'cr03', title: 'Mensagem 1: Curiosidade/Atualização — novidade relevante para o nicho', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'cr04', title: 'Mensagem 2: Prova Social — resultado de um cliente similar', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'cr05', title: 'Mensagem 3: Oferta ou Urgência — condição especial ou diagnóstico grátis', daysAfter: 5, assigneeRole: 'colaborador', done: false },
      { id: 'cr06', title: 'Registrar respostas e mover leads reativos para pipeline ativo', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'cr07', title: 'Leads ainda sem resposta: mover para lista de e-mail marketing de longo prazo', daysAfter: 8, assigneeRole: 'colaborador', done: false },
      { id: 'cr08', title: 'Relatório de reativação: taxa de resposta, novos agendamentos e receita potencial', daysAfter: 9, assigneeRole: 'gerente',     done: false },
      { id: 'cr09', title: 'Ajustar sequência com base nos resultados para próximo ciclo', daysAfter: 10, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_crm_fechamento',
    title: 'Fechamento de Proposta Comercial',
    category: 'CRM',
    description: 'Processo estruturado de fechamento: reunião final, negociação, contrato e onboarding do novo cliente.',
    steps: [
      { id: 'fc01', title: 'Preparar apresentação final da proposta: resultados esperados, escopo e investimento', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'fc02', title: 'Reunião de fechamento: apresentar proposta, tirar objeções e negociar condições', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'fc03', title: 'Enviar proposta formal via sistema com prazo de aceite de 48h', daysAfter: 0, assigneeRole: 'admin',       done: false },
      { id: 'fc04', title: 'Follow-up de fechamento: ligar/mensagem 24h após envio da proposta', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'fc05', title: 'Proposta aceita: enviar contrato para assinatura (DocuSign ou similar)', daysAfter: 2, assigneeRole: 'admin',       done: false },
      { id: 'fc06', title: 'Receber contrato assinado e emitir NF do primeiro mês', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'fc07', title: 'Criar workspace do novo cliente no sistema e notificar a equipe', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'fc08', title: 'Disparar playbook de Onboarding de Novo Cliente', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'fc09', title: 'Registrar novo cliente no painel financeiro e agenda de reuniões', daysAfter: 4, assigneeRole: 'admin',       done: false },
      { id: 'fc10', title: 'Anunciar novo cliente internamente: compartilhar com a equipe', daysAfter: 5, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── REUNIÕES ── */
  {
    id: 'pb_reuniao_mensal',
    title: 'Reunião Mensal de Performance com Cliente',
    category: 'Reuniões',
    description: 'Fluxo completo de preparação, execução e follow-up da reunião mensal de resultados.',
    steps: [
      { id: 'rm01', title: 'Compilar relatório do mês: métricas por campanha, comparativo e análise', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'rm02', title: 'Preparar apresentação visual (slides) com destaques e insights', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'rm03', title: 'Revisão interna do relatório e apresentação', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'rm04', title: 'Confirmar reunião com cliente 24h antes e enviar pauta', daysAfter: 2, assigneeRole: 'admin',       done: false },
      { id: 'rm05', title: 'Conduzir reunião: resultados, insights, próximas ações e alinhamento de expectativas', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'rm06', title: 'Enviar ata e próximas ações por e-mail em até 2h após a reunião', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'rm07', title: 'Registrar feedbacks do cliente no sistema para histórico', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'rm08', title: 'Implementar ajustes levantados na reunião', daysAfter: 5, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_reuniao_kickoff',
    title: 'Reunião de Kickoff com Novo Cliente',
    category: 'Reuniões',
    description: 'Reunião de início de parceria: apresentação mútua, alinhamento de expectativas, processos e acesso às plataformas.',
    steps: [
      { id: 'rk01', title: 'Preparar pauta do kickoff: apresentação da equipe, processos, metas e cronograma', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'rk02', title: 'Montar kit de boas-vindas: guia de processos, contatos e canais de comunicação', daysAfter: 0, assigneeRole: 'admin',       done: false },
      { id: 'rk03', title: 'Enviar convite com pauta e kit de boas-vindas com 48h de antecedência', daysAfter: 1, assigneeRole: 'admin',       done: false },
      { id: 'rk04', title: 'Conduzir reunião: apresentação, descoberta de objetivos, coleta de acessos e alinhamentos', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'rk05', title: 'Enviar ata, plano de ação e próximos passos em até 4h após reunião', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'rk06', title: 'Criar workspace completo no sistema com dados do cliente', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'rk07', title: 'Iniciar auditoria das plataformas do cliente', daysAfter: 3, assigneeRole: 'colaborador', done: false },
      { id: 'rk08', title: 'Check-in de 7 dias: como está sendo a experiência inicial', daysAfter: 7, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_reuniao_retencao',
    title: 'Reunião de Retenção — Cliente em Risco',
    category: 'Reuniões',
    description: 'Protocolo de reunião emergencial para reverter situação de cliente insatisfeito ou com cancelamento em risco.',
    steps: [
      { id: 'ret01', title: 'Identificar sinais de risco: reclamações, ausência em reuniões, delay em pagamento', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ret02', title: 'Analisar causas: expectativas vs entregas, comunicação, resultados', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ret03', title: 'Preparar plano de salvamento: ajustes de escopo, bonificação ou nova estratégia', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ret04', title: 'Agendar reunião de retenção com urgência (máximo 48h)', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ret05', title: 'Conduzir reunião: escutar ativamente, reconhecer falhas e apresentar solução concreta', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'ret06', title: 'Formalizar comprometimentos: prazos, responsáveis e métricas de sucesso', daysAfter: 2, assigneeRole: 'admin',       done: false },
      { id: 'ret07', title: 'Check-in semanal intensivo nas próximas 4 semanas', daysAfter: 7, assigneeRole: 'gerente',     done: false },
      { id: 'ret08', title: 'Avaliar resultado: cliente retido ou encaminhamento de offboarding', daysAfter: 28, assigneeRole: 'gerente',    done: false },
      { id: 'ret09', title: 'Documentar aprendizados para evitar situação similar com outros clientes', daysAfter: 30, assigneeRole: 'gerente',    done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_reuniao_proposta',
    title: 'Reunião de Apresentação de Proposta',
    category: 'Reuniões',
    description: 'Preparação e execução de reunião de diagnóstico + apresentação de proposta comercial para novo prospect.',
    steps: [
      { id: 'rp01', title: 'Pesquisar o prospect: site, redes sociais, mercado, concorrência e presença digital', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'rp02', title: 'Preparar diagnóstico visual: pontos de melhoria identificados antes da reunião', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'rp03', title: 'Montar proposta personalizada com base no diagnóstico prévio', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'rp04', title: 'Confirmar reunião 24h antes e enviar agenda de tópicos', daysAfter: 1, assigneeRole: 'admin',       done: false },
      { id: 'rp05', title: 'Conduzir reunião: descoberta de dores → apresentação diagnóstico → apresentação proposta', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'rp06', title: 'Responder objeções com provas sociais e cases relevantes', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'rp07', title: 'Enviar proposta formal e resumo da reunião por e-mail em até 2h', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'rp08', title: 'Follow-up estruturado: D+1, D+3 e D+7 caso não haja resposta', daysAfter: 3, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── ENTREGAS ── */
  {
    id: 'pb_entrega_checklist',
    title: 'Checklist de Entrega Mensal',
    category: 'Entregas',
    description: 'Checklist operacional mensal para garantir que todos os entregáveis foram produzidos, revisados e entregues.',
    steps: [
      { id: 'ec01', title: 'Confirmar todos os posts do mês foram publicados conforme calendário', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ec02', title: 'Verificar campanhas pagas: ativas, dentro do budget e sem reprovações', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ec03', title: 'Confirmar entrega do relatório de performance ao cliente', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ec04', title: 'Verificar tarefas pendentes no sistema: nenhuma em status "A Fazer" vencida', daysAfter: 1, assigneeRole: 'admin',       done: false },
      { id: 'ec05', title: 'Confirmar reunião mensal realizada ou reagendada', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ec06', title: 'Atualizar status dos projetos no ERP', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'ec07', title: 'Confirmar cobrança do mês foi realizada e registrada', daysAfter: 2, assigneeRole: 'admin',       done: false },
      { id: 'ec08', title: 'Planejar entregas do próximo mês: briefings, datas e responsáveis', daysAfter: 3, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_entrega_trimestral',
    title: 'Revisão Trimestral com Cliente',
    category: 'Entregas',
    description: 'Revisão estratégica a cada 3 meses: resultados acumulados, ajuste de metas e planejamento do próximo trimestre.',
    steps: [
      { id: 'et01', title: 'Compilar dados dos 3 meses: evolução de métricas, ROI e comparativos com início', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'et02', title: 'Identificar vitórias, fracassos e aprendizados do trimestre', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'et03', title: 'Preparar apresentação estratégica: consolidado + projeção dos próximos 3 meses', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'et04', title: 'Levantar novas oportunidades: novos canais, serviços e expansão de escopo', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'et05', title: 'Agendar reunião de revisão trimestral com o cliente', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'et06', title: 'Conduzir reunião: consolidado, próximo trimestre e apresentação de upgrade', daysAfter: 4, assigneeRole: 'gerente',     done: false },
      { id: 'et07', title: 'Enviar ata com plano de ação do próximo trimestre', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'et08', title: 'Atualizar contrato se houver ajuste de escopo ou valor', daysAfter: 7, assigneeRole: 'admin',       done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── FINANCEIRO ── */
  {
    id: 'pb_fin_renovacao',
    title: 'Renovação de Contrato',
    category: 'Financeiro',
    description: 'Processo de renovação proativa de contrato antes do vencimento, com reajuste e upgrade de escopo.',
    steps: [
      { id: 'fn01', title: 'Identificar contratos vencendo nos próximos 30 dias', daysAfter: 0, assigneeRole: 'admin',       done: false },
      { id: 'fn02', title: 'Preparar histórico do cliente: resultados, entregas e satisfação', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'fn03', title: 'Definir proposta de renovação: mesmo escopo, ajuste de valor ou upgrade', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'fn04', title: 'Agendar reunião de renovação 30 dias antes do vencimento', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'fn05', title: 'Conduzir reunião de renovação: apresentar resultados e nova proposta', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'fn06', title: 'Negociar condições e ajustar proposta se necessário', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'fn07', title: 'Enviar contrato de renovação para assinatura', daysAfter: 4, assigneeRole: 'admin',       done: false },
      { id: 'fn08', title: 'Confirmar assinatura e atualizar dados no sistema financeiro', daysAfter: 6, assigneeRole: 'admin',       done: false },
      { id: 'fn09', title: 'Comunicar renovação à equipe e registrar no histórico do cliente', daysAfter: 7, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_fin_upsell',
    title: 'Upsell — Expansão de Serviços',
    category: 'Financeiro',
    description: 'Processo de identificação de oportunidades e apresentação de serviços complementares ao cliente atual.',
    steps: [
      { id: 'up01', title: 'Mapear oportunidades: quais serviços o cliente não usa e tem potencial', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'up02', title: 'Identificar gatilho de upsell: resultado positivo, nova necessidade ou evento no negócio', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'up03', title: 'Montar proposta de expansão: novo serviço, valor incremental e resultado esperado', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'up04', title: 'Preparar case de cliente que usa o serviço com sucesso', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'up05', title: 'Agendar reunião de apresentação na reunião mensal ou call dedicada', daysAfter: 2, assigneeRole: 'gerente',     done: false },
      { id: 'up06', title: 'Apresentar oportunidade de expansão com dados e case', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'up07', title: 'Follow-up com material de apoio após apresentação', daysAfter: 4, assigneeRole: 'colaborador', done: false },
      { id: 'up08', title: 'Formalizar aditivo contratual se aceito', daysAfter: 7, assigneeRole: 'admin',       done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── GERAL ── */
  {
    id: 'pb_offboarding',
    title: 'Offboarding de Cliente',
    category: 'Geral',
    description: 'Processo organizado de encerramento de parceria: entregas finais, devoluções de acessos e documentação.',
    steps: [
      { id: 'off01', title: 'Registrar motivo do encerramento e documentar aprendizado', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'off02', title: 'Confirmar últimas entregas pendentes e prazo de conclusão', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'off03', title: 'Entregar relatório final: histórico completo de ações e resultados', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'off04', title: 'Devolver acessos ao cliente: Meta Business, Google Ads, Analytics e outros', daysAfter: 2, assigneeRole: 'colaborador', done: false },
      { id: 'off05', title: 'Remover acessos da equipe e revogar permissões', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'off06', title: 'Enviar carta de encerramento e agradecimento personalizado', daysAfter: 3, assigneeRole: 'gerente',     done: false },
      { id: 'off07', title: 'Arquivar materiais, relatórios e dados do cliente no sistema', daysAfter: 4, assigneeRole: 'admin',       done: false },
      { id: 'off08', title: 'Solicitar depoimento ou avaliação (NPS) ao cliente', daysAfter: 5, assigneeRole: 'gerente',     done: false },
      { id: 'off09', title: 'Atualizar dados financeiros: encerrar cobranças e fechar NFs pendentes', daysAfter: 5, assigneeRole: 'admin',       done: false },
      { id: 'off10', title: 'Reunião interna de aprendizado: o que poderia ter sido diferente', daysAfter: 7, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_aprovacao_interna',
    title: 'Aprovação Interna de Conteúdo',
    category: 'Geral',
    description: 'Fluxo de revisão e aprovação interna antes de qualquer conteúdo ir para o cliente: artes, copies, relatórios.',
    steps: [
      { id: 'ai01', title: 'Colaborador entrega conteúdo no sistema marcando como "Em Revisão"', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'ai02', title: 'Gerente recebe notificação e agenda revisão em até 4h', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ai03', title: 'Revisão técnica: estratégia, mensagem, dados e consistência com o cliente', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ai04', title: 'Revisão criativa: identidade visual, linguagem, tom e calls-to-action', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'ai05', title: 'Aprovado sem ajuste: liberar para o cliente diretamente', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ai06', title: 'Se houver ajuste: devolver ao colaborador com comentários claros e prazo', daysAfter: 1, assigneeRole: 'gerente',     done: false },
      { id: 'ai07', title: 'Colaborador aplica ajustes e resubmete para aprovação final', daysAfter: 1, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },
  {
    id: 'pb_nps_satisfacao',
    title: 'Pesquisa de Satisfação Trimestral (NPS)',
    category: 'Geral',
    description: 'Ciclo de NPS com clientes ativos: coleta, análise, ações corretivas e follow-up.',
    steps: [
      { id: 'nps01', title: 'Preparar formulário de NPS com 3 perguntas: nota, motivo e sugestão', daysAfter: 0, assigneeRole: 'admin',       done: false },
      { id: 'nps02', title: 'Enviar pesquisa para todos os clientes ativos via WhatsApp e e-mail', daysAfter: 0, assigneeRole: 'admin',       done: false },
      { id: 'nps03', title: 'Follow-up com não respondentes em D+3', daysAfter: 3, assigneeRole: 'admin',       done: false },
      { id: 'nps04', title: 'Consolidar respostas: calcular NPS, segmentar promotores, neutros e detratores', daysAfter: 7, assigneeRole: 'gerente',     done: false },
      { id: 'nps05', title: 'Ação imediata com detratores: ligar para entender e reverter insatisfação', daysAfter: 7, assigneeRole: 'gerente',     done: false },
      { id: 'nps06', title: 'Ação com promotores: pedir depoimento ou indicação', daysAfter: 7, assigneeRole: 'colaborador', done: false },
      { id: 'nps07', title: 'Reunião interna: apresentar resultados e plano de melhoria', daysAfter: 10, assigneeRole: 'gerente',     done: false },
      { id: 'nps08', title: 'Implementar melhorias identificadas nas próximas 4 semanas', daysAfter: 14, assigneeRole: 'gerente',     done: false },
    ],
    createdAt: '2026-05-24',
    active: true,
  },

  /* ── GOOGLE MEU NEGÓCIO ── */
  {
    id: 'pb_gmb_setup',
    title: 'Setup e Conferência — Google Meu Negócio',
    category: 'Geral',
    description: 'Checklist essencial para validar e configurar o perfil do Google Meu Negócio de um cliente novo ou existente.',
    steps: [
      { id: 'gmb01', title: 'Confirmar que o perfil está verificado (selo de verificação visível)', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb02', title: 'Verificar acesso: você como gestor, cliente como proprietário', daysAfter: 0, assigneeRole: 'gerente',     done: false },
      { id: 'gmb03', title: 'Buscar perfis duplicados no Google Maps e solicitar remoção se houver', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb04', title: 'Conferir NAP: nome, endereço e telefone idênticos ao site', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb05', title: 'Validar categoria principal — a mais específica do nicho', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb06', title: 'Atualizar horários de funcionamento incluindo feriados', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb07', title: 'Testar o link do site cadastrado no perfil', daysAfter: 0, assigneeRole: 'colaborador', done: false },
      { id: 'gmb08', title: 'Verificar foto de perfil e capa — boa qualidade e representativas', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'gmb09', title: 'Conferir galeria: mínimo 5 fotos do negócio publicadas', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'gmb10', title: 'Responder todas as avaliações pendentes (positivas e negativas)', daysAfter: 1, assigneeRole: 'colaborador', done: false },
      { id: 'gmb11', title: 'Verificar último post — se tiver mais de 30 dias, criar novo', daysAfter: 2, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-08',
    active: true,
  },
]

// ── Produto: Destrava Digital ──────────────────────────────────
const DESTRAVA_PLAYBOOKS = [
  // ── ATIVAÇÃO ──────────────────────────────────────────────────
  {
    id: 'destrava_ativacao',
    title: 'Destrava Digital — Ativação',
    category: 'Onboarding',
    description: 'Tráfego pago em 1 canal + consultoria 2h gravada + GMB + mini curso + suporte 15 dias. Para empresas iniciando no digital.',
    steps: [
      // ── FASE 1 — OPERACIONAL ─────────────────────────────────
      { id: 'dav01', title: '[F1] Criar grupo no WhatsApp do cliente',                                                     daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'dav02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                                daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'dav03', title: '[F1] Criar pasta do cliente no Drive',                                                        daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'dav04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'dav05', title: '[F1] Realizar Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'dav06', title: '[F1] Enviar formulário padrão de coleta de dados',                                            daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'dav07', title: '[F1] Compartilhar pasta do Drive com o cliente',                                              daysAfter: 1,  assigneeRole: 'admin',       done: false },
      { id: 'dav08', title: '[F1] Realizar Reunião de Diagnóstico Estratégico',                                            daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'dav09', title: '[F1] Solicitar acessos — prazos e responsabilidades',                                         daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'dav10', title: '[F1] Desenvolver e enviar Ata do Diagnóstico Estratégico',                                   daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'dav11', title: '[F1] Agendar consultoria de tráfego pago',                                                   daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'dav12', title: '[F1] Verificar acessos do cliente pré-consultoria (BM, conta de anúncios, Pixel)',           daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'dav13', title: '[F1 — ENTREGA] Criar campanhas de tráfego pago (1 canal)',                                   daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'dav14', title: '[F1 — ENTREGA] Criar/Atualizar Google Meu Negócio',                                          daysAfter: 8,  assigneeRole: 'colaborador', done: false },
      { id: 'dav15', title: '[F1 — ENTREGA] Realizar consultoria de tráfego pago — 2h (gravar e entregar ao cliente)',   daysAfter: 10, assigneeRole: 'gerente',     done: false },
      { id: 'dav16', title: '[F1] Pós-consultoria: enviar resumo e próximos passos ao cliente',                           daysAfter: 11, assigneeRole: 'gerente',     done: false },
      { id: 'dav17', title: '[F1 — ENTREGA] Liberar mini curso Google e Meta Ads (videoaulas Eduzz)',                     daysAfter: 11, assigneeRole: 'admin',       done: false },
      // ── FASE 2 — MISSÕES DO DESAFIO (15 dias) ────────────────
      { id: 'dav18', title: '[F2] Início do Desafio — comunicar ao cliente o início das missões (15 dias)',               daysAfter: 11, assigneeRole: 'gerente',     done: false },
      { id: 'dav19', title: '[F2] Acompanhamento via WhatsApp durante o desafio',                                         daysAfter: 12, assigneeRole: 'gerente',     done: false },
      { id: 'dav20', title: '[F2] Mensagem de encerramento ao fim do desafio',                                            daysAfter: 26, assigneeRole: 'gerente',     done: false },
      { id: 'dav21', title: '[F2] Finalizar e arquivar o grupo no WhatsApp',                                              daysAfter: 26, assigneeRole: 'gerente',     done: false },
      { id: 'dav22', title: '[F2] Remover acessos das contas do cliente',                                                 daysAfter: 26, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-14',
    active: true,
  },

  // ── ESTRUTURAÇÃO ──────────────────────────────────────────────
  {
    id: 'destrava_estruturacao',
    title: 'Destrava Digital — Estruturação',
    category: 'Onboarding',
    description: 'Tráfego pago em 2 canais + consultoria 3h gravada + Landing Page + perfil IG/FB + GMB + mini curso + suporte 30 dias. Para empresas que querem previsibilidade.',
    steps: [
      // ── FASE 1 — OPERACIONAL ─────────────────────────────────
      { id: 'des01', title: '[F1] Criar grupo no WhatsApp do cliente',                                                     daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'des02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                                daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'des03', title: '[F1] Criar pasta do cliente no Drive',                                                        daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'des04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'des05', title: '[F1] Realizar Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'des06', title: '[F1] Enviar formulário padrão de coleta de dados',                                            daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'des07', title: '[F1] Compartilhar pasta do Drive com o cliente',                                              daysAfter: 1,  assigneeRole: 'admin',       done: false },
      { id: 'des08', title: '[F1] Realizar Reunião de Diagnóstico Estratégico',                                            daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'des09', title: '[F1] Solicitar acessos — prazos e responsabilidades',                                         daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'des10', title: '[F1] Desenvolver e enviar Ata do Diagnóstico Estratégico',                                   daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'des11', title: '[F1] Coletar acessos das plataformas (Meta, Google, etc.)',                                  daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'des12', title: '[F1] Agendar consultoria de tráfego pago',                                                   daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'des13', title: '[F1] Solicitar acesso ao domínio e hospedagem (para LP)',                                    daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'des14', title: '[F1 — ENTREGA] Criar sugestão de perfil Instagram e Facebook',                               daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'des15', title: '[F1 — ENTREGA] Criar campanhas de tráfego pago (2 canais)',                                  daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'des16', title: '[F1 — ENTREGA] Realizar consultoria de tráfego pago — 3h (gravar e entregar ao cliente)',   daysAfter: 10, assigneeRole: 'gerente',     done: false },
      { id: 'des17', title: '[F1 — ENTREGA] Criar os 3 posts fixados e Destaques do perfil',                             daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'des18', title: '[F1 — ENTREGA] Analisar e sugerir BIO do Instagram',                                        daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'des19', title: '[F1 — ENTREGA] Desenvolvimento de design da Landing Page (Figma)',                           daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'des20', title: '[F1] Aprovação versão Figma da Landing Page pelo cliente',                                   daysAfter: 14, assigneeRole: 'gerente',     done: false },
      { id: 'des21', title: '[F1 — ENTREGA] Desenvolvimento web da Landing Page',                                         daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'des22', title: '[F1] Aprovação versão web da Landing Page pelo cliente',                                     daysAfter: 17, assigneeRole: 'gerente',     done: false },
      { id: 'des23', title: '[F1 — ENTREGA] Criar/Atualizar Google Meu Negócio',                                         daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'des24', title: '[F1 — ENTREGA] Liberar mini curso Google e Meta Ads (videoaulas Eduzz)',                    daysAfter: 18, assigneeRole: 'admin',       done: false },
      { id: 'des25', title: '[F1] Pós-entrega: compartilhar pasta do Drive com o cliente',                                daysAfter: 18, assigneeRole: 'gerente',     done: false },
      // ── FASE 2 — MISSÕES DO DESAFIO (30 dias) ────────────────
      { id: 'des26', title: '[F2] Início do Desafio — comunicar ao cliente o início das missões (30 dias)',               daysAfter: 19, assigneeRole: 'gerente',     done: false },
      { id: 'des27', title: '[F2] Avisar início dos 30 dias de suporte',                                                  daysAfter: 19, assigneeRole: 'gerente',     done: false },
      { id: 'des28', title: '[F2] Acompanhamento via WhatsApp durante o desafio',                                         daysAfter: 20, assigneeRole: 'gerente',     done: false },
      { id: 'des29', title: '[F2] Mensagem de encerramento ao fim do desafio',                                            daysAfter: 49, assigneeRole: 'gerente',     done: false },
      { id: 'des30', title: '[F2] Finalizar e arquivar o grupo no WhatsApp',                                              daysAfter: 49, assigneeRole: 'gerente',     done: false },
      { id: 'des31', title: '[F2] Remover acessos das contas do cliente',                                                 daysAfter: 49, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-14',
    active: true,
  },

  // ── ACELERAÇÃO ────────────────────────────────────────────────
  {
    id: 'destrava_aceleracao',
    title: 'Destrava Digital — Aceleração',
    category: 'Onboarding',
    description: 'Tudo da Estruturação + Site Institucional (até 3 páginas) + Treinamento comercial 1h + consultoria total 5h + suporte 30 dias. Para empresas em crescimento que querem presença digital completa.',
    steps: [
      // ── FASE 1 — OPERACIONAL ─────────────────────────────────
      { id: 'dac01', title: '[F1] Criar grupo no WhatsApp do cliente',                                                     daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'dac02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                                daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'dac03', title: '[F1] Criar pasta do cliente no Drive',                                                        daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'dac04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'dac05', title: '[F1] Realizar Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'dac06', title: '[F1] Enviar formulário padrão de coleta de dados',                                            daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'dac07', title: '[F1] Compartilhar pasta do Drive com o cliente',                                              daysAfter: 1,  assigneeRole: 'admin',       done: false },
      { id: 'dac08', title: '[F1] Realizar Reunião de Diagnóstico Estratégico',                                            daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'dac09', title: '[F1] Solicitar acessos — prazos e responsabilidades',                                         daysAfter: 2,  assigneeRole: 'gerente',     done: false },
      { id: 'dac10', title: '[F1] Desenvolver e enviar Ata do Diagnóstico Estratégico',                                   daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'dac11', title: '[F1] Coletar acessos das plataformas (Meta, Google, domínio, hospedagem)',                   daysAfter: 3,  assigneeRole: 'colaborador', done: false },
      { id: 'dac12', title: '[F1] Agendar consultoria de tráfego pago',                                                   daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'dac13', title: '[F1] Solicitar acesso ao domínio e hospedagem (LP e Site)',                                  daysAfter: 4,  assigneeRole: 'gerente',     done: false },
      { id: 'dac14', title: '[F1 — ENTREGA] Criar sugestão de perfil Instagram e Facebook',                               daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'dac15', title: '[F1 — ENTREGA] Criar campanhas de tráfego pago (2 canais)',                                  daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'dac16', title: '[F1 — ENTREGA] Realizar consultoria de tráfego pago — 5h (gravar e entregar ao cliente)',   daysAfter: 10, assigneeRole: 'gerente',     done: false },
      { id: 'dac17', title: '[F1 — ENTREGA] Criar os 3 posts fixados e Destaques do perfil',                             daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'dac18', title: '[F1 — ENTREGA] Analisar e sugerir BIO do Instagram',                                        daysAfter: 11, assigneeRole: 'colaborador', done: false },
      { id: 'dac19', title: '[F1 — ENTREGA] Desenvolvimento de design da Landing Page (Figma)',                           daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'dac20', title: '[F1] Aprovação versão Figma da Landing Page pelo cliente',                                   daysAfter: 14, assigneeRole: 'gerente',     done: false },
      { id: 'dac21', title: '[F1 — ENTREGA] Desenvolvimento web da Landing Page',                                         daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'dac22', title: '[F1] Aprovação versão web da Landing Page pelo cliente',                                     daysAfter: 17, assigneeRole: 'gerente',     done: false },
      { id: 'dac23', title: '[F1 — ENTREGA] Criar/Atualizar Google Meu Negócio',                                         daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'dac24', title: '[F1 — ENTREGA] Liberar mini curso Google e Meta Ads (videoaulas Eduzz)',                    daysAfter: 17, assigneeRole: 'admin',       done: false },
      { id: 'dac25', title: '[F1 — ENTREGA] Desenvolvimento de design do Site Institucional (Figma)',                    daysAfter: 18, assigneeRole: 'colaborador', done: false },
      { id: 'dac26', title: '[F1] Aprovação versão Figma do Site pelo cliente',                                           daysAfter: 20, assigneeRole: 'gerente',     done: false },
      { id: 'dac27', title: '[F1 — ENTREGA] Desenvolvimento web do Site Institucional (até 3 páginas)',                  daysAfter: 21, assigneeRole: 'colaborador', done: false },
      { id: 'dac28', title: '[F1] Aprovação versão web do Site pelo cliente',                                             daysAfter: 23, assigneeRole: 'gerente',     done: false },
      { id: 'dac29', title: '[F1 — ENTREGA] Treinamento comercial — 1h (gravar e entregar ao cliente)',                  daysAfter: 24, assigneeRole: 'gerente',     done: false },
      { id: 'dac30', title: '[F1] Pós-entrega: compartilhar pasta do Drive com o cliente',                                daysAfter: 25, assigneeRole: 'gerente',     done: false },
      // ── FASE 2 — MISSÕES DO DESAFIO (30 dias) ────────────────
      { id: 'dac31', title: '[F2] Início do Desafio — comunicar ao cliente o início das missões (30 dias)',               daysAfter: 25, assigneeRole: 'gerente',     done: false },
      { id: 'dac32', title: '[F2] Avisar início dos 30 dias de suporte',                                                  daysAfter: 25, assigneeRole: 'gerente',     done: false },
      { id: 'dac33', title: '[F2] Acompanhamento via WhatsApp durante o desafio',                                         daysAfter: 26, assigneeRole: 'gerente',     done: false },
      { id: 'dac34', title: '[F2] Mensagem de encerramento ao fim do desafio',                                            daysAfter: 55, assigneeRole: 'gerente',     done: false },
      { id: 'dac35', title: '[F2] Finalizar e arquivar o grupo no WhatsApp',                                              daysAfter: 55, assigneeRole: 'gerente',     done: false },
      { id: 'dac36', title: '[F2] Remover acessos das contas do cliente',                                                 daysAfter: 55, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-14',
    active: true,
  },
]

// ── ASSESSORIA ────────────────────────────────────────────────────
const ASSESSORIA_PLAYBOOKS = [
  {
    id: 'assessoria_ativacao',
    title: 'Assessoria — Ativação',
    category: 'Tráfego Pago',
    description: 'Gestão mensal: tráfego pago em 1 canal + sugestão de perfil + reuniões quinzenais + BI + treinamento de conteúdo (3 encontros).',
    steps: [
      // ── FASE 1 — ONBOARDING ────────────────────────────────────────
      { id: 'aav01', title: '[F1] Criar grupo no WhatsApp do cliente',                                           daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aav02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                      daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aav03', title: '[F1] Criar pasta do cliente no Drive',                                              daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aav04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                       daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aav05', title: '[F1] Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aav06', title: '[F1] Enviar Avaliação Análise 360° do Negócio',                                     daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aav07', title: '[F1] Reunião de Planejamento de Projeto (cronograma e orçamento)',                  daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'aav08', title: '[F1] Pesquisa de mercado e referências',                                            daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aav09', title: '[F1] Setup de contas (Meta, Google, etc.)',                                         daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aav10', title: '[F1] Cadastro de Públicos Personalizado no Meta Ads',                               daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      // ── FASE 1 — ENTREGAS ─────────────────────────────────────────
      { id: 'aav11', title: '[F1 — ENTREGA] Criar sugestão de perfil Instagram e Facebook',                      daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'aav12', title: '[F1 — ENTREGA] Criação de anúncios nas plataformas (Instagram, Google)',            daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aav13', title: '[F1 — ENTREGA] Criação de artes e edição básica de vídeos para anúncios',          daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aav14', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 1',                  daysAfter: 14, assigneeRole: 'gerente',     done: false },
      { id: 'aav15', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 2',                  daysAfter: 21, assigneeRole: 'gerente',     done: false },
      { id: 'aav16', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 3',                  daysAfter: 28, assigneeRole: 'gerente',     done: false },
      // ── FASE 2 — EXECUÇÃO MENSAL (recorrente) ─────────────────────
      { id: 'aav17', title: '[F2] Reunião de acompanhamento e mentoria — quinzenal',                             daysAfter: 30, assigneeRole: 'gerente',     done: false },
      { id: 'aav18', title: '[F2] B.I — relatório de performance mensal',                                        daysAfter: 30, assigneeRole: 'colaborador', done: false },
      { id: 'aav19', title: '[F2] Finalizar o grupo no WhatsApp',                                                daysAfter: 90, assigneeRole: 'gerente',     done: false },
      { id: 'aav20', title: '[F2] Remover os Acessos das Contas',                                                daysAfter: 90, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-16',
    active: true,
  },
  {
    id: 'assessoria_estruturacao',
    title: 'Assessoria — Estruturação',
    category: 'Tráfego Pago',
    description: 'Tudo da Ativação + usuário no CRM On360 + criação de 1 Landing Page. Para quem quer estrutura de captação profissional.',
    steps: [
      // ── FASE 1 — ONBOARDING ────────────────────────────────────────
      { id: 'aes01', title: '[F1] Criar grupo no WhatsApp do cliente',                                           daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aes02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                      daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aes03', title: '[F1] Criar pasta do cliente no Drive',                                              daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aes04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                       daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aes05', title: '[F1] Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aes06', title: '[F1] Enviar Avaliação Análise 360° do Negócio',                                     daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aes07', title: '[F1] Reunião de Planejamento de Projeto (cronograma e orçamento)',                  daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'aes08', title: '[F1] Pesquisa de mercado e referências',                                            daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aes09', title: '[F1] Setup de contas (Meta, Google, etc.)',                                         daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aes10', title: '[F1] Cadastro de Públicos Personalizado no Meta Ads',                               daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'aes11', title: '[F1] Aprovação versão Figma da Landing Page pelo cliente',                          daysAfter: 14, assigneeRole: 'gerente',     done: false },
      { id: 'aes12', title: '[F1] Aprovação versão web da Landing Page pelo cliente',                            daysAfter: 17, assigneeRole: 'gerente',     done: false },
      // ── FASE 1 — ENTREGAS ─────────────────────────────────────────
      { id: 'aes13', title: '[F1 — ENTREGA] Criar sugestão de perfil Instagram e Facebook',                      daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'aes14', title: '[F1 — ENTREGA] Criação de anúncios nas plataformas (Instagram, Google)',            daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aes15', title: '[F1 — ENTREGA] Criação de artes e edição básica de vídeos para anúncios',          daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aes16', title: '[F1 — ENTREGA] Setup e criação de usuário no CRM On360',                           daysAfter: 10, assigneeRole: 'admin',       done: false },
      { id: 'aes17', title: '[F1 — ENTREGA] Desenvolvimento de design da Landing Page (Figma)',                  daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'aes18', title: '[F1 — ENTREGA] Desenvolvimento web da Landing Page',                               daysAfter: 15, assigneeRole: 'colaborador', done: false },
      { id: 'aes19', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 1',                  daysAfter: 21, assigneeRole: 'gerente',     done: false },
      { id: 'aes20', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 2',                  daysAfter: 28, assigneeRole: 'gerente',     done: false },
      { id: 'aes21', title: '[F1 — ENTREGA] Treinamento de produção de conteúdo — encontro 3',                  daysAfter: 35, assigneeRole: 'gerente',     done: false },
      // ── FASE 2 — EXECUÇÃO MENSAL (recorrente) ─────────────────────
      { id: 'aes22', title: '[F2] Reunião de acompanhamento e mentoria — quinzenal',                             daysAfter: 30, assigneeRole: 'gerente',     done: false },
      { id: 'aes23', title: '[F2] B.I — relatório de performance mensal',                                        daysAfter: 30, assigneeRole: 'colaborador', done: false },
      { id: 'aes24', title: '[F2] Finalizar o grupo no WhatsApp',                                                daysAfter: 90, assigneeRole: 'gerente',     done: false },
      { id: 'aes25', title: '[F2] Remover os Acessos das Contas',                                                daysAfter: 90, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-16',
    active: true,
  },
  {
    id: 'assessoria_aceleracao',
    title: 'Assessoria — Aceleração',
    category: 'Tráfego Pago',
    description: 'Gestão mensal completa: tráfego + Setup CRM + Landing Page + reuniões quinzenais + BI. Para empresas em crescimento que querem profissionalizar a operação.',
    steps: [
      // ── FASE 1 — ONBOARDING ────────────────────────────────────────
      { id: 'aac01', title: '[F1] Criar grupo no WhatsApp do cliente',                                           daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aac02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                      daysAfter: 0,  assigneeRole: 'gerente',     done: false },
      { id: 'aac03', title: '[F1] Criar pasta do cliente no Drive',                                              daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aac04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                       daysAfter: 0,  assigneeRole: 'admin',       done: false },
      { id: 'aac05', title: '[F1] Reunião de Início de Projeto — conhecer o negócio do cliente',                 daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aac06', title: '[F1] Enviar Avaliação Análise 360° do Negócio',                                     daysAfter: 1,  assigneeRole: 'gerente',     done: false },
      { id: 'aac07', title: '[F1] Reunião de Planejamento de Projeto (cronograma e orçamento)',                  daysAfter: 3,  assigneeRole: 'gerente',     done: false },
      { id: 'aac08', title: '[F1] Pesquisa de mercado e referências',                                            daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aac09', title: '[F1] Setup de contas (Meta, Google, etc.)',                                         daysAfter: 5,  assigneeRole: 'colaborador', done: false },
      { id: 'aac10', title: '[F1] Cadastro de Públicos Personalizado no Meta Ads',                               daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'aac11', title: '[F1] Aprovação versão Figma da Landing Page pelo cliente',                          daysAfter: 14, assigneeRole: 'gerente',     done: false },
      { id: 'aac12', title: '[F1] Aprovação versão web da Landing Page pelo cliente',                            daysAfter: 17, assigneeRole: 'gerente',     done: false },
      // ── FASE 1 — ENTREGAS ─────────────────────────────────────────
      { id: 'aac13', title: '[F1 — ENTREGA] Criar sugestão de perfil Instagram e Facebook',                      daysAfter: 7,  assigneeRole: 'colaborador', done: false },
      { id: 'aac14', title: '[F1 — ENTREGA] Criação de anúncios nas plataformas (Instagram, Google)',            daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aac15', title: '[F1 — ENTREGA] Criação de artes e edição básica de vídeos para anúncios',          daysAfter: 10, assigneeRole: 'colaborador', done: false },
      { id: 'aac16', title: '[F1 — ENTREGA] Setup CRM completo',                                                 daysAfter: 10, assigneeRole: 'admin',       done: false },
      { id: 'aac17', title: '[F1 — ENTREGA] Desenvolvimento de design da Landing Page (Figma)',                  daysAfter: 12, assigneeRole: 'colaborador', done: false },
      { id: 'aac18', title: '[F1 — ENTREGA] Desenvolvimento web da Landing Page',                               daysAfter: 15, assigneeRole: 'colaborador', done: false },
      // ── FASE 2 — EXECUÇÃO MENSAL (recorrente) ─────────────────────
      { id: 'aac19', title: '[F2] Reunião de acompanhamento e mentoria — quinzenal',                             daysAfter: 30, assigneeRole: 'gerente',     done: false },
      { id: 'aac20', title: '[F2] B.I — relatório de performance mensal',                                        daysAfter: 30, assigneeRole: 'colaborador', done: false },
      { id: 'aac21', title: '[F2] Finalizar o grupo no WhatsApp',                                                daysAfter: 90, assigneeRole: 'gerente',     done: false },
      { id: 'aac22', title: '[F2] Remover os Acessos das Contas',                                                daysAfter: 90, assigneeRole: 'colaborador', done: false },
    ],
    createdAt: '2026-06-16',
    active: true,
  },
]

const ALL_PLAYBOOKS = [...SAMPLE, ...EXTRA_PLAYBOOKS, ...DESTRAVA_PLAYBOOKS, ...ASSESSORIA_PLAYBOOKS]

function initPlaybooks() {
  const stored = load()
  if (stored.length === 0) { save(ALL_PLAYBOOKS); return ALL_PLAYBOOKS }
  // Force-sync Destrava + Assessoria: substitui versões antigas e adiciona novos
  const forceSyncIds = new Set([
    ...DESTRAVA_PLAYBOOKS.map(p => p.id),
    ...ASSESSORIA_PLAYBOOKS.map(p => p.id),
  ])
  const forceSyncPlaybooks = [...DESTRAVA_PLAYBOOKS, ...ASSESSORIA_PLAYBOOKS]
  const synced = stored
    .filter(p => !forceSyncIds.has(p.id))
    .concat(forceSyncPlaybooks)
  const syncedIds = new Set(synced.map(p => p.id))
  const missing = ALL_PLAYBOOKS.filter(p => !syncedIds.has(p.id))
  const result = missing.length > 0 ? [...synced, ...missing] : synced
  save(result)
  return result
}

// ── Constantes visuais ─────────────────────────────────────────
const CAT_COLORS = {
  Onboarding: '#6eda2c', 'Tráfego Pago': '#60a5fa', Conteúdo: '#be29ec',
  Vídeo: '#ef4444', 'Landing Page': '#22d3ee', CRM: '#f59e0b',
  Reuniões: '#ea8a29', Entregas: '#f97316', Financeiro: '#06b6d4', Geral: '#8890b5',
}
const ROLE_COLORS  = { admin: '#ef4444', gerente: '#60a5fa', colaborador: '#6eda2c', visualizador: '#be29ec' }
const ROLE_LABELS  = { admin: 'Admin', gerente: 'Gerente', colaborador: 'Colaborador', visualizador: 'Visualizador' }
const TASK_TYPE_ICONS = { lp: '🖥️', criativo: '🎨', campanha: '📢', copy: '✍️', video: '🎬', reuniao: '📅' }

// ── parseStep: converte prefixos [F1]/[F1 — ENTREGA]/[F2] em badges ──
function parseStep(title) {
  if (title.startsWith('[F2]'))           return { badge: 'Desafio', color: '#be29ec', clean: title.slice(5).trim() }
  if (title.startsWith('[F1 — ENTREGA]')) return { badge: 'Entrega', color: '#6eda2c', clean: title.slice(15).trim() }
  if (title.startsWith('[F1]'))           return { badge: 'Atividade', color: '#60a5fa', clean: title.slice(5).trim() }
  return { badge: null, color: null, clean: title }
}

// ── StepRow (editor) ───────────────────────────────────────────
function StepRow({ step, index, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-3 group py-2 px-3">
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
        style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{index + 1}</span>
      <input
        value={step.title}
        onChange={e => onChange({ ...step, title: e.target.value })}
        className="flex-1 text-sm text-text bg-transparent border-none outline-none font-medium placeholder:text-muted/50"
        placeholder="Descrição da etapa..."
      />
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-muted" />
          <input type="number" min={0} max={90} value={step.daysAfter}
            onChange={e => onChange({ ...step, daysAfter: parseInt(e.target.value) || 0 })}
            className="w-10 text-center text-xs font-bold text-text bg-surface border border-border rounded-lg px-1 py-0.5 outline-none" />
          <span className="text-[10px] text-muted">d</span>
        </div>
        <select value={step.assigneeRole}
          onChange={e => onChange({ ...step, assigneeRole: e.target.value })}
          className="text-[10px] font-bold rounded-lg px-2 py-1 border border-border outline-none"
          style={{ color: ROLE_COLORS[step.assigneeRole] || '#8890b5', background: '#f8f9fc' }}>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-danger/60 hover:text-danger">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ── VincularModal ──────────────────────────────────────────────
function VincularModal({ pb, erpClients, collaborators, onClose, onCreateTasks }) {
  const roles    = [...new Set(pb.steps.map(s => s.assigneeRole))]
  const today    = new Date().toISOString().slice(0, 10)
  const [clientId,  setClientId]  = useState(erpClients[0]?.id || '')
  const [startDate, setStartDate] = useState(today)
  const [roleMap,   setRoleMap]   = useState({})        // role → collaborator id
  const [creating,  setCreating]  = useState(false)
  const [done,      setDone]      = useState(false)

  const client = erpClients.find(c => c.id === clientId)

  // Pré-visualização das tarefas
  const preview = pb.steps.map(s => {
    const d = new Date(startDate + 'T00:00:00')
    d.setDate(d.getDate() + s.daysAfter)
    return {
      title:    s.title,
      dueDate:  d.toISOString().slice(0, 10),
      type:     getTaskType(pb.category, s.assigneeRole),
      assignee: roleMap[s.assigneeRole] || null,
      role:     s.assigneeRole,
    }
  })

  async function handleCreate() {
    setCreating(true)
    for (const t of preview) {
      await onCreateTasks({
        clientId,
        title:       t.title,
        type:        t.type,
        assignee:    t.assignee,
        dueDate:     t.dueDate,
        status:      'todo',
        priority:    'medium',
        description: `📋 Playbook: ${pb.title}`,
      })
    }
    setDone(true)
    setCreating(false)
  }

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: '#6eda2c15' }}>
          <Check size={32} style={{ color: '#6eda2c' }} />
        </div>
        <p className="text-lg font-extrabold text-text mb-1">{preview.length} tarefas criadas!</p>
        <p className="text-sm text-muted mb-2">
          Playbook <strong>{pb.title}</strong> vinculado a <strong>{client?.name}</strong>
        </p>
        <p className="text-xs text-muted mb-6">Acesse <strong>Entregas</strong> ou o workspace do cliente para acompanhar.</p>
        <button onClick={onClose}
          className="w-full py-3 rounded-2xl text-sm font-extrabold text-white"
          style={{ background: '#6eda2c' }}>
          Fechar
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link2 size={15} style={{ color: CAT_COLORS[pb.category] || '#6eda2c' }} />
              <p className="text-base font-extrabold text-text">Vincular a Cliente</p>
            </div>
            <p className="text-xs text-muted">{pb.title} · {pb.steps.length} etapas</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-5">
          {/* Cliente + data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Cliente *</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none cursor-pointer"
                style={{ background: '#f8f9fc' }}>
                {erpClients.filter(c => c.status !== 'paused').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Data de início *</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none"
                style={{ background: '#f8f9fc' }} />
            </div>
          </div>

          {/* Mapeamento de papéis */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">Responsáveis por papel</label>
            <div className="space-y-2">
              {roles.map(role => (
                <div key={role} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8f9fc', border: '1px solid #edf0f7' }}>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: (ROLE_COLORS[role] || '#8890b5') + '18', color: ROLE_COLORS[role] || '#8890b5' }}>
                    {ROLE_LABELS[role] || role}
                  </span>
                  <span className="text-[10px] text-muted">
                    {pb.steps.filter(s => s.assigneeRole === role).length} tarefa(s)
                  </span>
                  <select value={roleMap[role] || ''}
                    onChange={e => setRoleMap(m => ({ ...m, [role]: e.target.value || null }))}
                    className="ml-auto border border-border rounded-xl px-3 py-1.5 text-xs text-text outline-none cursor-pointer"
                    style={{ background: 'white', minWidth: 140 }}>
                    <option value="">Sem responsável</option>
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>{c.name} — {c.role}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview das tarefas */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">
              Tarefas que serão criadas ({preview.length})
            </label>
            <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto">
              {preview.map((t, i) => {
                const assigneeName = collaborators.find(c => c.id === t.assignee)?.name
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 last:border-0">
                    <span className="text-base flex-shrink-0">{TASK_TYPE_ICONS[t.type]}</span>
                    <span className="flex-1 text-xs text-text font-medium truncate">{t.title}</span>
                    <span className="text-[10px] font-bold text-muted flex-shrink-0">{t.dueDate}</span>
                    {assigneeName && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: '#6eda2c15', color: '#6eda2c' }}>{assigneeName}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-border">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button onClick={handleCreate} disabled={!clientId || creating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all disabled:opacity-50"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            {creating
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Criando...</>
              : <><Zap size={15} /> Criar {preview.length} tarefas</>
            }
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── PlaybookCard ───────────────────────────────────────────────
function PlaybookCard({ pb, onEdit, onDuplicate, onDelete, onVincular }) {
  const [open, setOpen] = useState(false)
  const catColor = CAT_COLORS[pb.category] || '#8890b5'

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <div className="h-1 w-full" style={{ background: catColor }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: catColor + '18', color: catColor }}>{pb.category}</span>
              {pb.active
                ? <span className="text-[10px] font-bold text-accent">● Ativo</span>
                : <span className="text-[10px] font-bold text-muted">○ Inativo</span>}
            </div>
            <h3 className="text-sm font-extrabold text-text mt-1">{pb.title}</h3>
            <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-2">{pb.description}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => onDuplicate(pb)} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors" title="Duplicar">
              <Copy size={14} />
            </button>
            <button onClick={() => onEdit(pb)} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors" title="Editar">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(pb.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors" title="Excluir">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Stats + ações */}
        <div className="flex items-center gap-3 mt-4 pt-3 flex-wrap" style={{ borderTop: '1px solid #edf0f7' }}>
          <span className="text-xs font-bold text-muted flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-accent" />{pb.steps.length} etapas
          </span>
          <span className="text-xs font-bold text-muted flex items-center gap-1.5">
            <Clock size={12} className="text-blue-400" />{pb.steps.reduce((a, s) => Math.max(a, s.daysAfter), 0)} dias
          </span>

          {/* Botão Vincular */}
          <button onClick={() => onVincular(pb)}
            className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all"
            style={{ background: catColor + '15', color: catColor, border: `1px solid ${catColor}30` }}>
            <Link2 size={12} /> Vincular a cliente
          </button>

          <button onClick={() => setOpen(v => !v)}
            className="ml-auto flex items-center gap-1 text-xs font-bold text-muted hover:text-text transition-colors">
            Etapas {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="mt-3 space-y-0 divide-y divide-border">
                {pb.steps.map((s, i) => {
                  const { badge, color, clean } = parseStep(s.title)
                  return (
                    <div key={s.id} className="flex items-center gap-2 py-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                        style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{i + 1}</span>
                      {badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                          style={{ background: color + '18', color }}>
                          {badge}
                        </span>
                      )}
                      <span className="flex-1 text-xs text-text">{clean}</span>
                      <span className="text-[10px] font-bold flex items-center gap-1 flex-shrink-0" style={{ color: '#60a5fa' }}>
                        <Clock size={10} />d{s.daysAfter}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: (ROLE_COLORS[s.assigneeRole] || '#8890b5') + '18', color: ROLE_COLORS[s.assigneeRole] || '#8890b5' }}>
                        {ROLE_LABELS[s.assigneeRole] || s.assigneeRole}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── PlaybookModal (editor) ─────────────────────────────────────
function PlaybookModal({ pb, onClose, onSave }) {
  const isNew = !pb
  const [form, setForm] = useState(pb || {
    id: 'pb_' + Date.now(), title: '', category: 'Geral', description: '',
    steps: [], createdAt: new Date().toISOString().slice(0, 10), active: true,
  })

  function addStep() {
    setForm(f => ({
      ...f,
      steps: [...f.steps, {
        id: 's_' + Date.now(), title: '',
        daysAfter: f.steps.length === 0 ? 0 : (f.steps[f.steps.length - 1].daysAfter + 1),
        assigneeRole: 'colaborador', done: false,
      }],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>

        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-base font-extrabold text-text">{isNew ? 'Novo Playbook' : 'Editar Playbook'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted hover:text-text transition-colors"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Título</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Criação de Landing Page" autoFocus
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Categoria</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none" style={{ background: '#f8f9fc' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ background: form.active ? '#6eda2c' : '#d1d5db' }}>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ transform: form.active ? 'translateX(20px)' : 'translateX(0)' }} />
                </div>
                <span className="text-sm font-bold text-text">Ativo</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Descrição</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Objetivo deste playbook..."
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none resize-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Etapas</label>
              <button onClick={addStep}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-accent hover:bg-accent/10 transition-colors border border-accent/20">
                <Plus size={12} /> Adicionar
              </button>
            </div>
            <div className="space-y-0 divide-y divide-border rounded-xl overflow-hidden border border-border">
              {form.steps.length === 0
                ? <p className="text-xs text-muted text-center py-6">Nenhuma etapa. Clique em Adicionar.</p>
                : form.steps.map((s, i) => (
                  <StepRow key={s.id} step={s} index={i}
                    onChange={updated => setForm(f => ({ ...f, steps: f.steps.map(x => x.id === s.id ? updated : x) }))}
                    onDelete={() => setForm(f => ({ ...f, steps: f.steps.filter(x => x.id !== s.id) }))}
                  />
                ))
              }
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button onClick={() => { if (form.title.trim()) onSave(form) }} disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all disabled:opacity-50"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            {isNew ? 'Criar Playbook' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Grupos de produto ──────────────────────────────────────────
const PRODUCT_GROUPS = [
  { key: 'destrava',   label: 'Destrava Digital', icon: '🔒', color: '#6eda2c', match: pb => pb.title.startsWith('Destrava Digital') },
  { key: 'assessoria', label: 'Assessoria',        icon: '📋', color: '#60a5fa', match: pb => pb.title.toLowerCase().includes('assessoria') || pb.title.startsWith('PRO') },
  { key: 'outros',     label: 'Serviços & Outros', icon: '🛠️', color: '#f59e0b', match: () => true },
]

function groupByProduct(list) {
  const assigned = new Set()
  return PRODUCT_GROUPS.map(g => {
    const items = list.filter(p => !assigned.has(p.id) && g.match(p))
    items.forEach(p => assigned.add(p.id))
    return { ...g, items }
  }).filter(g => g.items.length > 0)
}

// ── Tab de produto (sidebar ou nav) ────────────────────────────
const PRODUCT_TABS = [
  { key: 'todos',      label: 'Todos',           icon: '📁', color: '#8890b5' },
  { key: 'destrava',   label: 'Destrava Digital', icon: '🔒', color: '#6eda2c' },
  { key: 'assessoria', label: 'Assessoria',       icon: '📋', color: '#60a5fa' },
  { key: 'outros',     label: 'Outros',           icon: '🛠️', color: '#f59e0b' },
]

function matchTab(pb, tabKey) {
  if (tabKey === 'todos')      return true
  if (tabKey === 'destrava')   return pb.title.startsWith('Destrava Digital')
  if (tabKey === 'assessoria') return pb.title.toLowerCase().includes('assessoria')
  return !pb.title.startsWith('Destrava Digital') && !pb.title.toLowerCase().includes('assessoria')
}

// ── Main ───────────────────────────────────────────────────────
export default function Playbooks() {
  const { erpClients, collaborators, addTask, loading } = useData()
  const [playbooks,  setPlaybooks]  = useState(initPlaybooks)
  const [modal,      setModal]      = useState(null)
  const [vincularPb, setVincularPb] = useState(null)
  const [tab,        setTab]        = useState('todos')
  const [search,     setSearch]     = useState('')

  const activeCount = playbooks.filter(p => p.active).length

  const filtered = playbooks.filter(pb => {
    const matchesTab    = matchTab(pb, tab)
    const q             = search.trim().toLowerCase()
    const matchesSearch = !q || pb.title.toLowerCase().includes(q) || pb.description.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const useGroups = tab === 'todos' && !search.trim()
  const groups    = useGroups ? groupByProduct(filtered) : null

  function saveAll(updated) { setPlaybooks(updated); save(updated) }

  function handleSave(form) {
    const existing = playbooks.find(p => p.id === form.id)
    saveAll(existing ? playbooks.map(p => p.id === form.id ? form : p) : [...playbooks, form])
    setModal(null)
  }

  async function handleVincular(taskData) { await addTask(taskData) }

  function PlaybookGrid({ list }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {list.map(pb => (
            <PlaybookCard key={pb.id} pb={pb}
              onEdit={p => setModal(p)}
              onDuplicate={p => saveAll([...playbooks, { ...p, id: 'pb_' + Date.now(), title: p.title + ' (cópia)', createdAt: new Date().toISOString().slice(0, 10) }])}
              onDelete={id => saveAll(playbooks.filter(p => p.id !== id))}
              onVincular={p => setVincularPb(p)}
            />
          ))}
        </AnimatePresence>
      </div>
    )
  }

  const currentTab = PRODUCT_TABS.find(t => t.key === tab)

  if (loading) return (
    <div className="p-4 lg:p-8 animate-pulse space-y-5">
      <div className="h-8 w-48 bg-surface rounded-xl" />
      <div className="h-12 bg-surface rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-9 w-24 bg-surface rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-surface rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-text">Playbooks</h1>
          <p className="text-sm text-muted mt-0.5">{activeCount} playbooks ativos</p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
          <Plus size={15} /> Novo Playbook
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou descrição..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-text border border-border outline-none transition-colors"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(26,29,46,0.07)' }}
          onFocus={e => e.target.style.borderColor = '#6eda2c'}
          onBlur={e => e.target.style.borderColor = '#e2e5f0'}
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted hover:text-text transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Abas por produto */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PRODUCT_TABS.map(t => {
          const count = t.key === 'todos'
            ? playbooks.length
            : playbooks.filter(pb => matchTab(pb, t.key)).length
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0"
              style={active
                ? { background: t.color, color: '#fff', boxShadow: `0 4px 12px ${t.color}40` }
                : { background: '#fff', color: '#6b7280', border: '1px solid #e2e5f0' }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                style={active
                  ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                  : { background: (t.color) + '18', color: t.color }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Resultado da busca */}
      {search.trim() && (
        <p className="text-xs text-muted -mt-2">
          {filtered.length === 0 ? 'Nenhum resultado' : `${filtered.length} playbook${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''}`}
          {' '}para <strong>"{search}"</strong>
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold">Nenhum playbook encontrado.</p>
          {search && <p className="text-xs mt-1">Tente outro termo de busca.</p>}
        </div>
      ) : useGroups ? (
        <div className="space-y-8">
          {groups.map(group => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base leading-none">{group.icon}</span>
                <h2 className="text-sm font-extrabold text-text">{group.label}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: group.color + '18', color: group.color }}>
                  {group.items.length}
                </span>
                <div className="flex-1 h-px ml-1" style={{ background: '#edf0f7' }} />
              </div>
              <PlaybookGrid list={group.items} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {tab !== 'todos' && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{currentTab.icon}</span>
              <h2 className="text-sm font-extrabold text-text">{currentTab.label}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: currentTab.color + '18', color: currentTab.color }}>
                {filtered.length}
              </span>
            </div>
          )}
          <PlaybookGrid list={filtered} />
        </>
      )}

      <AnimatePresence>
        {modal && (
          <PlaybookModal pb={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {vincularPb && (
          <VincularModal
            pb={vincularPb}
            erpClients={erpClients}
            collaborators={collaborators}
            onClose={() => setVincularPb(null)}
            onCreateTasks={handleVincular}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
