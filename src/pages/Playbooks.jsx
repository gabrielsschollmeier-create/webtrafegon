import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, X, ChevronDown, ChevronRight, ChevronUp, CheckCircle2,
  Clock, Trash2, Edit2, Copy, Link2, Check, Zap, Search,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { PRODUTO_PLAYBOOKS } from '../data/playbooks-produtos'

const CATEGORIES  = ['Onboarding', 'Tráfego Pago', 'Conteúdo', 'Vídeo', 'Landing Page', 'CRM', 'Reuniões', 'Entregas', 'Financeiro', 'Geral']

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
      { id: 'dav04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       assigneeId: 'gs', done: false, checklist: [
        { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
      ] },
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

  // ── ATIVAÇÃO v2 — padrão novo, em validação ───────────────────
  // Convive com o destrava_ativacao original: ids diferentes, nada sobrescrito.
  // Regra de bloqueio de todas as etapas: cliente sem responder em 48h, cobrar
  // no grupo. Passou de 5 dias, marcar como bloqueada e avisar o gerente.
  {
    id: 'destrava_ativacao_v2',
    title: 'Destrava Digital — Ativação v2',
    category: 'Onboarding',
    description: 'EM VALIDAÇÃO — mesmo escopo do Ativação, no padrão novo: marcos, responsável em cada etapa e checklist com "Pronto quando". Não vincule a cliente real até ser aprovado.',
    milestones: [
      { id: 'ms_dav2_abertura',     title: 'Abertura',        icon: '🚀', type: 'kickoff',  order: 1 },
      { id: 'ms_dav2_diagnostico',  title: 'Diagnóstico',     icon: '🔍', type: 'revisao',  order: 2 },
      { id: 'ms_dav2_acessos',      title: 'Acessos',         icon: '🔑', type: 'setup',    order: 3 },
      { id: 'ms_dav2_entregas',     title: 'Entregas',        icon: '📦', type: 'campanha', order: 4 },
      { id: 'ms_dav2_desafio',      title: 'Desafio 15 dias', icon: '🏁', type: 'revisao',  order: 5 },
      { id: 'ms_dav2_encerramento', title: 'Encerramento',    icon: '✅', type: 'revisao',  order: 6 },
    ],
    steps: [
      // ── MARCO 1 — ABERTURA (D0–D1) ───────────────────────────
      { id: 'dav2_01', title: 'Criar o grupo no WhatsApp do cliente', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'whats_grupos', done: false, checklist: [
        { id: 'dav2_01a', title: 'Pronto quando: grupo criado com cliente e equipe dentro, nomeado no padrão TráfegOn × [Cliente]' },
      ] },
      { id: 'dav2_03', title: 'Criar a pasta do cliente no Drive', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'planilha_clientes', done: false, checklist: [
        { id: 'dav2_03a', title: 'Criar a pasta no padrão da agência, com as subpastas prontas' },
        { id: 'dav2_03b', title: 'Pronto quando: link da pasta copiado e pronto para ir na mensagem de boas-vindas' },
      ] },
      { id: 'dav2_05', title: 'Compartilhar a pasta do Drive com o cliente', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'planilha_clientes', done: false, checklist: [
        { id: 'dav2_05a', title: 'Dar acesso ao e-mail do cliente antes de mandar o link' },
        { id: 'dav2_05b', title: 'Pronto quando: o link abre para quem está fora da agência' },
      ] },
      { id: 'dav2_02', title: 'Enviar a mensagem de boas-vindas', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'whats_grupos', done: false, message: 'Seja bem-vinda à Tráfegon! ✨\n\nEste grupo foi criado para centralizarmos as informações com toda a nossa equipe e desenvolvermos o seu projeto de forma organizada e eficiente.\n\nAqui está o link da sua pastinha no Drive:\n📁 [inserir link]\n\nNessa pasta, você já pode adicionar sua identidade visual (caso tenha) e também fotos profissionais que queira utilizar no projeto.\n\nPode me passar aqui também seu Instagram por favor.', checklist: [
        { id: 'dav2_02a', title: 'Colar o link da pasta do Drive no lugar de [inserir link]' },
        { id: 'dav2_02b', title: 'Pronto quando: mensagem enviada no grupo e o cliente confirmou que abriu a pasta' },
      ] },
      { id: 'dav2_04', title: 'Criar o cliente no hub', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'setup_conta', done: false, checklist: [
        { id: 'dav2_04a', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'dav2_04b', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'dav2_04c', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'dav2_04d', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'dav2_04e', title: 'Pronto quando: workspace abre e a equipe foi avisada no grupo interno' },
      ] },
      { id: 'dav2_06', title: 'Enviar o formulário de coleta de dados', daysAfter: 1, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_abertura', type: 'whats_grupos', done: false, checklist: [
        { id: 'dav2_06a', title: 'Enviar o formulário padrão no grupo' },
        { id: 'dav2_06b', title: 'Se travar: 48h sem resposta, cobrar no grupo. 5 dias, avisar o gerente' },
        { id: 'dav2_06c', title: 'Pronto quando: formulário respondido e salvo na pasta do Drive' },
      ] },

      // ── MARCO 2 — DIAGNÓSTICO (D2–D3) ────────────────────────
      // Reunião única: conhecer o negócio e fechar o diagnóstico no mesmo encontro.
      { id: 'dav2_07', title: 'Realizar a Reunião de Início de Projeto', daysAfter: 2, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_diagnostico', type: 'reuniao', done: false, checklist: [
        { id: 'dav2_07a', title: 'Revisar as respostas do formulário antes da chamada' },
        { id: 'dav2_07b', title: 'Entender o negócio: o que vende, para quem e ticket médio' },
        { id: 'dav2_07c', title: 'Levantar o que já foi tentado em tráfego e o que deu errado' },
        { id: 'dav2_07d', title: 'Confirmar quem decide e quem responde no dia a dia' },
        { id: 'dav2_07e', title: 'Definir a oferta que vai para o anúncio, o público e a região' },
        { id: 'dav2_07f', title: 'Definir a meta do período e como ela será medida' },
        { id: 'dav2_07g', title: 'Alinhar o cronograma dos 15 dias e o que é entrega' },
        { id: 'dav2_07h', title: 'Pronto quando: gravação no Drive e oferta, público e meta escritos' },
      ] },
      { id: 'dav2_09', title: 'Documentar e enviar a Ata da Reunião', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_diagnostico', type: 'plan_estrategico', done: false, checklist: [
        { id: 'dav2_09a', title: 'Oferta, público e meta definidos' },
        { id: 'dav2_09b', title: 'O que a TráfegOn entrega e em que prazo' },
        { id: 'dav2_09c', title: 'O que o cliente precisa fornecer e até quando' },
        { id: 'dav2_09d', title: 'Pronto quando: ata no Drive e enviada no grupo pedindo o de acordo' },
      ] },

      // ── MARCO 3 — ACESSOS (D2–D5) ────────────────────────────
      { id: 'dav2_10', title: 'Solicitar os acessos ao cliente', daysAfter: 2, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_acessos', type: 'setup_conta', done: false, message: 'Meta Ads: Liberar como parceiro com a conta 593792896314697 — todos os ativos: conta de anúncios, página, WhatsApp, Instagram, pixel, catálogo e qualquer ativo pertinente ao projeto.\n\nGoogle Ads: Liberar para atendimentotrafegon@gmail.com (permissão administrativa)\n\nGoogle Analytics: Liberar acesso administrativo para atendimentotrafegon@gmail.com\n→ Analytics → Configurações → Administrador → Gerenciamento de acesso → (+) → Administrador (fazer em Conta e Propriedade)\n\nSe você ainda não tiver Gerenciador de Negócios ou conta de anúncios, me avise que eu te ajudo a criar — a conta fica no seu nome.', checklist: [
        { id: 'dav2_10a', title: 'Enviar a lista: Business Manager, conta de anúncios, página, Instagram e Google Ads' },
        { id: 'dav2_10b', title: 'Enviar o tutorial de como conceder cada acesso' },
        { id: 'dav2_10c', title: 'Se o cliente não tiver Business Manager ou conta de anúncios, ajudar ele a criar — no nome dele' },
        { id: 'dav2_10d', title: 'Orientar o cliente a cadastrar a forma de pagamento na conta' },
        { id: 'dav2_10e', title: 'Dizer a data limite e o que atrasa se não vier' },
        { id: 'dav2_10f', title: 'Registrar no Drive o que já chegou e o que falta' },
        { id: 'dav2_10g', title: 'Se travar: 48h sem retorno, cobrar no grupo. 5 dias, marcar bloqueada e avisar o gerente' },
      ] },
      { id: 'dav2_11', title: 'Conferir os acessos e deixar a conta pronta', daysAfter: 5, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_dav2_acessos', type: 'auditoria', done: false, checklist: [
        { id: 'dav2_11a', title: 'Abrir o Business Manager e confirmar o nível de permissão' },
        { id: 'dav2_11b', title: 'Confirmar a forma de pagamento aprovada na conta de anúncios' },
        { id: 'dav2_11c', title: 'Confirmar a página e o Instagram vinculados à conta' },
        { id: 'dav2_11d', title: 'Criar o Pixel e conferir se está disparando na página de destino' },
        { id: 'dav2_11e', title: 'Se o canal for Google, conferir a conta e a conversão configurada' },
        { id: 'dav2_11f', title: 'Pronto quando: você entrou em tudo sozinho e a conta está apta a veicular' },
      ] },

      // ── MARCO 4 — ENTREGAS (D4–D11) ──────────────────────────
      { id: 'dav2_12', title: 'Agendar a consultoria de tráfego', daysAfter: 4, assigneeRole: 'colaborador', assigneeId: 'adm_at', milestoneId: 'ms_dav2_entregas', type: 'reuniao', done: false, checklist: [
        { id: 'dav2_12a', title: 'Pronto quando: data confirmada pelo cliente e convite de calendário enviado' },
      ] },
      { id: 'dav2_13', title: 'Criar as campanhas de tráfego (1 canal)', tag: 'ENTREGA', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_dav2_entregas', type: 'criar_campanha', done: false, checklist: [
        { id: 'dav2_13a', title: 'Montar a estrutura no canal definido no diagnóstico' },
        { id: 'dav2_13b', title: 'Vincular os criativos aprovados' },
        { id: 'dav2_13c', title: 'Conferir o Pixel no nível do conjunto de anúncios' },
        { id: 'dav2_13d', title: 'Subir com o orçamento contratado e conferir o lance' },
        { id: 'dav2_13e', title: 'Pronto quando: campanhas ativas, pixel disparando e print no grupo interno' },
      ] },
      { id: 'dav2_15', title: 'Realizar a consultoria de tráfego — 2h', tag: 'ENTREGA', daysAfter: 10, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_entregas', type: 'trein_equipe', done: false, checklist: [
        { id: 'dav2_15a', title: 'Confirmar a gravação antes de começar' },
        { id: 'dav2_15b', title: 'Apresentar as campanhas já criadas: estrutura, públicos e criativos' },
        { id: 'dav2_15c', title: 'Mostrar onde acompanhar e como ler os números que importam' },
        { id: 'dav2_15d', title: 'Instruir como o cliente conduz dali em diante: o que ajustar e o que não mexer' },
        { id: 'dav2_15e', title: 'Combinar o que fica com ele e o que segue com a gente nos 15 dias' },
        { id: 'dav2_15f', title: 'Pronto quando: gravação no Drive e link enviado no grupo' },
      ] },
      { id: 'dav2_16', title: 'Enviar o resumo da consultoria', daysAfter: 11, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_entregas', type: 'whats_grupos', done: false, checklist: [
        { id: 'dav2_16a', title: 'Pronto quando: resumo com os próximos passos enviado no grupo, com prazo em cada item' },
      ] },
      { id: 'dav2_17', title: 'Liberar o mini curso Google e Meta Ads', tag: 'ENTREGA', daysAfter: 11, assigneeRole: 'colaborador', assigneeId: 'adm_at', milestoneId: 'ms_dav2_entregas', type: 'setup_conta', done: false, checklist: [
        { id: 'dav2_17a', title: 'Pronto quando: acesso liberado na Eduzz e o cliente confirmou que entrou' },
      ] },

      // ── MARCO 5 — DESAFIO 15 DIAS (D11–D26) ──────────────────
      { id: 'dav2_18', title: 'Abrir o Desafio com o cliente', daysAfter: 11, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_desafio', type: 'whats_grupos', done: false, checklist: [
        { id: 'dav2_18a', title: 'Pronto quando: mensagem de abertura enviada, com a data de encerramento explícita' },
      ] },
      { id: 'dav2_19', title: 'Acompanhar o cliente durante o Desafio', daysAfter: 12, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_desafio', type: 'gestao_diaria', done: false, checklist: [
        { id: 'dav2_19a', title: 'Responder dúvidas no grupo em até 24h úteis' },
        { id: 'dav2_19b', title: 'Conferir as campanhas 2× por semana' },
        { id: 'dav2_19c', title: 'Registrar no hub o que foi ajustado e por quê' },
        { id: 'dav2_19d', title: 'Pronto quando: os 15 dias fecharam com os ajustes registrados no hub' },
      ] },
      { id: 'dav2_20', title: 'Encerrar o Desafio com o cliente', daysAfter: 26, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_dav2_desafio', type: 'reuniao', done: false, message: 'Olá, [Nome]! Boa tarde. Tudo certo com você?\n\nHoje encerramos os 15 dias do nosso Destrava Digital.\n\nGostaríamos de saber se você ainda tem alguma dúvida ou se precisa de mais algum apoio da nossa parte.\n\nSe estiver tudo certo, podemos conversar sobre os próximos passos para dar continuidade ao que já está rodando. Vamos agendar uma reunião?\n\nE, se puder, gostaríamos muito de contar com sua avaliação no Google! 🌟\n[link de avaliação]', checklist: [
        { id: 'dav2_20a', title: 'Pronto quando: resultado do período enviado e proposta de continuidade apresentada' },
      ] },

      // ── MARCO 6 — ENCERRAMENTO (D26–D30) ─────────────────────
      { id: 'dav2_21', title: 'Arquivar o grupo no WhatsApp', daysAfter: 26, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_dav2_encerramento', type: 'whats_grupos', done: false, checklist: [
        { id: 'dav2_21a', title: 'Pronto quando: mensagem final enviada e grupo arquivado — nunca apagado' },
      ] },
      { id: 'dav2_22', title: 'Remover os acessos das contas do cliente', daysAfter: 26, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_dav2_encerramento', type: 'setup_conta', done: false, checklist: [
        { id: 'dav2_22a', title: 'Sair do Business Manager e da conta de anúncios' },
        { id: 'dav2_22b', title: 'Sair do Google Ads e do GMB' },
        { id: 'dav2_22c', title: 'Remover o acesso à pasta do Drive, se combinado' },
        { id: 'dav2_22d', title: 'Pronto quando: nenhum acesso ativo sobrou e a data está registrada no hub' },
      ] },
    ],
    createdAt: '2026-08-09',
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
      { id: 'des04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       assigneeId: 'gs', done: false, checklist: [
        { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
      ] },
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
      { id: 'dac04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                                 daysAfter: 0,  assigneeRole: 'admin',       assigneeId: 'gs', done: false, checklist: [
        { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
      ] },
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
    title: 'Assessoria — Ativação (v1 antigo)',
    active: false,
    category: 'Tráfego Pago',
    description: 'Projeto de 6 meses sem fim definido. Tráfego pago em 1 canal (Meta OU Google). Sem Landing Page, CRM ou agente de IA. Inclui rastreamento, criativos, treinamento de conteúdo e rotina mensal.',
    milestones: [
      { id: 'ms_av_onboarding',  title: 'Onboarding',          icon: '🚀', type: 'kickoff',   order: 1 },
      { id: 'ms_av_setup',       title: 'Setup Técnico',        icon: '⚙️', type: 'setup',     order: 2 },
      { id: 'ms_av_perfil',      title: 'Perfil & Criativos',   icon: '📱', type: 'criativo',  order: 3 },
      { id: 'ms_av_campanhas',   title: 'Campanhas no Ar',      icon: '📢', type: 'campanha',  order: 4 },
      { id: 'ms_av_treinamento', title: 'Treinamento Conteúdo', icon: '🎓', type: 'revisao',   order: 5 },
      { id: 'ms_av_resultado1',  title: 'Primeiro Resultado',   icon: '📊', type: 'revisao',   order: 6 },
      { id: 'ms_av_rotina',      title: 'Rotina Mensal',        icon: '🔄', type: 'renovacao', order: 7 },
      { id: 'ms_av_renovacao',   title: 'Renovação',            icon: '🌟', type: 'renovacao', order: 8 },
    ],
    steps: [
      // ── MARCO 1 — ONBOARDING (D0–D5) ──────────────────────────────
      { id: 'aav01', title: 'Criar grupo no WhatsApp do cliente', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_onboarding', type: 'whats_grupos', done: false, checklist: [
        { id: 'aav01a', title: 'Criar o grupo com o padrão de nome: TráfegOn × [Nome do Cliente]' },
        { id: 'aav01b', title: 'Adicionar: cliente(s), gerente e colaborador responsável pelo canal' },
        { id: 'aav01c', title: 'Pronto quando: grupo criado e todos os participantes confirmados dentro' },
      ] },
      { id: 'aav02', title: 'Criar pasta do cliente no Drive', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_onboarding', type: 'planilha_clientes', done: false, checklist: [
        { id: 'aav02a', title: 'Criar pasta com subpastas: Criativos / Relatórios / Documentos / Aprovações' },
        { id: 'aav02b', title: 'Compartilhar com o e-mail do cliente (permissão: Visualizador)' },
        { id: 'aav02c', title: 'Copiar o link da pasta para usar na mensagem de boas-vindas' },
      ] },
      { id: 'aav03', title: 'Enviar mensagem de boas-vindas no grupo', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_onboarding', type: 'whats_grupos', done: false, message: 'Seja bem-vindo(a) à TráfegOn! ✨\n\nEste grupo foi criado para centralizarmos as informações com toda a nossa equipe e desenvolvermos o seu projeto de forma organizada e eficiente.\n\nAqui está o link da sua pasta no Drive:\n📁 [inserir link]\n\nNessa pasta, você pode adicionar sua identidade visual (logotipo, paleta de cores) e fotos profissionais que queira usar nos materiais.\n\nPode nos passar o link do seu Instagram? 😊', checklist: [
        { id: 'aav03a', title: 'Substituir [inserir link] pelo link real da pasta do Drive' },
        { id: 'aav03b', title: 'Pronto quando: mensagem enviada e cliente confirmou que abriu a pasta' },
      ] },
      { id: 'aav04', title: 'Criar o cliente no hub.trafegon.com.br', daysAfter: 0, assigneeRole: 'admin', assigneeId: 'gs', milestoneId: 'ms_av_onboarding', type: 'setup_conta', done: false, checklist: [
        { id: 'aav04a', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'aav04b', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'aav04c', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'aav04d', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'aav04e', title: 'Informar à equipe no grupo interno que o cliente está no sistema' },
      ] },
      { id: 'aav05', title: 'Reunião de Início de Projeto — diagnóstico e conhecimento do negócio', daysAfter: 1, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_onboarding', type: 'reuniao', done: false, checklist: [
        { id: 'aav05a', title: 'Entender o produto/serviço, ticket médio e diferencial competitivo' },
        { id: 'aav05b', title: 'Mapear a jornada de compra: como o cliente ideal encontra e decide?' },
        { id: 'aav05c', title: 'Definir o canal: Meta Ads OU Google Ads (apenas 1)' },
        { id: 'aav05d', title: 'Definir objetivo principal: lead, agendamento, venda ou ligação' },
        { id: 'aav05e', title: 'Alinhar orçamento de mídia mensal e meta de CPL/CPA' },
        { id: 'aav05f', title: 'Coletar referências de concorrentes e o que já foi testado antes' },
        { id: 'aav05g', title: 'Alinhar expectativas: mês 1 é fase de aprendizado — dados, não meta' },
        { id: 'aav05h', title: 'Pronto quando: canal definido, objetivo claro e orçamento alinhado' },
      ] },
      { id: 'aav06', title: 'Enviar Análise 360° do Negócio para preenchimento', daysAfter: 1, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_onboarding', type: 'whats_grupos', done: false, checklist: [
        { id: 'aav06a', title: 'Enviar formulário de briefing no grupo' },
        { id: 'aav06b', title: 'Se 48h sem resposta: cobrar no grupo. Se 5 dias: avisar o gerente' },
        { id: 'aav06c', title: 'Pronto quando: formulário respondido e salvo na pasta do Drive' },
      ] },
      { id: 'aav07', title: 'Reunião de Planejamento — cronograma, orçamento e plano de ação', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_onboarding', type: 'reuniao', done: false, checklist: [
        { id: 'aav07a', title: 'Definir data alvo de lançamento das campanhas (meta: D+10 a D+14)' },
        { id: 'aav07b', title: 'Confirmar orçamento diário de mídia (recomendado: mín. R$30/dia)' },
        { id: 'aav07c', title: 'Definir responsável interno pelo canal escolhido' },
        { id: 'aav07d', title: 'Confirmar quem produz criativos: agência, cliente ou ambos?' },
        { id: 'aav07e', title: 'Registrar plano de ação no hub e comunicar equipe' },
        { id: 'aav07f', title: 'Pronto quando: equipe alinhada e cronograma registrado no hub' },
      ] },

      // ── MARCO 2 — SETUP TÉCNICO (D3–D12) ──────────────────────────
      { id: 'aav08', title: 'Solicitar acessos às plataformas', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_setup', type: 'whats_grupos', done: false, message: 'Para iniciarmos o trabalho, precisamos dos seguintes acessos:\n\n📱 *Meta Ads (se for Meta):*\nLiberar nossa conta parceira como Administrador em: conta de anúncios, Página, Instagram e Pixel\n\n🔍 *Google Ads (se for Google):*\nAdicionar atendimentotrafegon@gmail.com como Administrador\n\n📊 *Google Analytics (GA4):*\nAdicionar atendimentotrafegon@gmail.com como Administrador\n\n📌 *Google Tag Manager:*\nAdicionar atendimentotrafegon@gmail.com com Administrador + Publicação\n\nSe precisar de ajuda para realizar esses acessos, é só chamar! 🙌', checklist: [
        { id: 'aav08a', title: 'Adaptar a mensagem para o canal escolhido (Meta OU Google) antes de enviar' },
        { id: 'aav08b', title: 'Pronto quando: confirmação de acesso recebida e testada na plataforma' },
      ] },
      { id: 'aav09', title: 'Auditoria e configuração das contas de anúncio', daysAfter: 5, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_setup', type: 'config_pixel', done: false, checklist: [
        { id: 'aav09a', title: 'Verificar se a conta está com pagamento ativo e sem bloqueios/pendências' },
        { id: 'aav09b', title: 'Conferir moeda, fuso horário e nome da conta (corrigir se errado)' },
        { id: 'aav09c', title: 'Confirmar que a agência tem acesso de Administrador' },
        { id: 'aav09d', title: 'Verificar histórico: conta nova ou com campanhas anteriores?' },
        { id: 'aav09e', title: 'Se conta existente: auditar campanhas antigas — o que funcionou, CPL histórico' },
        { id: 'aav09f', title: 'Documentar no hub: canal, ID da conta, responsável e situação inicial' },
        { id: 'aav09g', title: 'Pronto quando: conta auditada e situação documentada no hub' },
      ] },
      { id: 'aav10', title: 'Instalação e verificação de rastreamento (Pixel + GTM + Conversões)', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_setup', type: 'config_pixel', done: false, checklist: [
        { id: 'aav10a', title: 'Instalar Google Tag Manager no site do cliente (se não existir)' },
        { id: 'aav10b', title: '[Meta] Criar tag do Pixel Meta no GTM → publicar e testar com Meta Pixel Helper' },
        { id: 'aav10c', title: '[Meta] Criar evento de conversão Lead no Meta Events Manager (clique no CTA)' },
        { id: 'aav10d', title: '[Google] Criar tag de GA4 no GTM e verificar sessões em tempo real' },
        { id: 'aav10e', title: '[Google] Criar tag de conversão Google Ads no GTM e configurar ação de conversão' },
        { id: 'aav10f', title: 'Testar TODOS os eventos no modo Preview do GTM antes de publicar' },
        { id: 'aav10g', title: 'Publicar o contêiner GTM após testes aprovados' },
        { id: 'aav10h', title: 'Confirmar que os eventos chegam no painel: Meta Events Manager ou Google Ads' },
        { id: 'aav10i', title: 'Pronto quando: pixel disparando, evento de conversão configurado e confirmado' },
      ] },
      { id: 'aav11', title: 'Pesquisa de mercado, persona e benchmark de concorrentes', daysAfter: 5, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_setup', type: 'pesquisa_merc', done: false, checklist: [
        { id: 'aav11a', title: 'Mapear 3 concorrentes diretos: anúncios, oferta, posicionamento e CTA' },
        { id: 'aav11b', title: 'Identificar ângulos de comunicação que o mercado ainda não usa' },
        { id: 'aav11c', title: 'Definir persona: faixa etária, gênero, cidade, dor principal, gatilho de compra' },
        { id: 'aav11d', title: 'Definir oferta inicial dos anúncios (lead magnet ou oferta direta?)' },
        { id: 'aav11e', title: 'Salvar referências de anúncios inspiradores na pasta do cliente no Drive' },
        { id: 'aav11f', title: 'Pronto quando: persona e ângulo de copy validados com o gerente' },
      ] },
      { id: 'aav12', title: 'Cadastro de públicos personalizados e lookalikes', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_setup', type: 'gestao_diaria', done: false, checklist: [
        { id: 'aav12a', title: '[Meta] Público: visitantes do site — 30, 60 e 180 dias' },
        { id: 'aav12b', title: '[Meta] Público: engajadores do Instagram — 30 e 60 dias' },
        { id: 'aav12c', title: '[Meta] Público: visualizações de vídeo ≥ 50% (se o cliente tiver vídeos)' },
        { id: 'aav12d', title: '[Meta] Lookalike 1%, 2%, 3% (se cliente tiver lista de clientes)' },
        { id: 'aav12e', title: '[Meta] Público de exclusão: clientes atuais (evitar verba desperdiçada)' },
        { id: 'aav12f', title: '[Google] Criar lista de remarketing de visitantes do site' },
        { id: 'aav12g', title: 'Pronto quando: públicos criados e documentados no hub' },
      ] },

      // ── MARCO 3 — PERFIL & CRIATIVOS (D7–D14) ─────────────────────
      { id: 'aav13', title: 'Criar/Atualizar Google Meu Negócio', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_av_perfil', type: 'config_pixel', done: false, message: 'Bom dia! 🌞\n\nPassando para deixar um passo a passo de como atualizar o Google Meu Negócio:\n\n✅ Manter o perfil sempre atualizado com novas publicações mostra ao Google que sua empresa está ativa — isso aumenta suas chances de aparecer nas primeiras posições.\n\n[Inserir link do guia ou vídeo explicativo]\n\nQualquer dúvida, é só chamar! 😊', checklist: [
        { id: 'aav13a', title: 'Verificar se o GMB já existe ou precisa ser criado e verificado' },
        { id: 'aav13b', title: 'Completar todas as informações: horário, endereço, telefone, site, fotos' },
        { id: 'aav13c', title: 'Pronto quando: perfil 100% preenchido e verificado no Google' },
      ] },
      { id: 'aav14', title: 'Organização e sugestão de perfil Instagram', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_av_perfil', type: 'org_perfil', done: false, checklist: [
        { id: 'aav14a', title: 'Verificar se a conta está em modo Profissional (Criador ou Empresa)' },
        { id: 'aav14b', title: 'Atualizar foto de perfil: logotipo com fundo limpo, alta resolução' },
        { id: 'aav14c', title: 'Reescrever bio: quem é, o que faz, CTA claro, link (máx 150 caracteres)' },
        { id: 'aav14d', title: 'Configurar link na bio (site, WhatsApp ou Linktree)' },
        { id: 'aav14e', title: 'Criar/atualizar capas dos Destaques com identidade visual do cliente' },
        { id: 'aav14f', title: 'Verificar dados de contato: e-mail, telefone, categoria do perfil' },
        { id: 'aav14g', title: 'Pronto quando: sugestão enviada e aprovada pelo cliente' },
      ] },
      { id: 'aav15', title: 'Criação dos primeiros criativos para anúncios', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_av_perfil', type: 'criativo', done: false, checklist: [
        { id: 'aav15a', title: 'Criar 1 arte estática nos formatos: feed 1:1 e stories 9:16' },
        { id: 'aav15b', title: 'Criar 1 carrossel com benefícios, prova social ou processo de trabalho' },
        { id: 'aav15c', title: 'Editar 1 vídeo curto (15–30s) para Reels/Stories' },
        { id: 'aav15d', title: 'Garantir CTA claro e visível em todos os formatos' },
        { id: 'aav15e', title: 'Nomear arquivos: [Cliente]_feed_v1, [Cliente]_stories_v1...' },
        { id: 'aav15f', title: 'Salvar na subpasta Criativos/Aprovações do Drive' },
      ] },
      { id: 'aav16', title: 'Enviar criativos para aprovação do cliente', daysAfter: 12, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_perfil', type: 'whats_grupos', done: false, message: 'Bom dia, [Nome]! 👋\n\nSegue o link com os criativos que vamos usar nos seus anúncios:\n📁 [link da pasta Drive/Aprovações]\n\nPreciso da sua confirmação (ou sugestões de ajuste) até [inserir data — idealmente 24h] para que possamos subir as campanhas no prazo combinado. 🙏\n\nSe quiser ajustar alguma coisa — texto, cor, imagem — é só me falar!', checklist: [
        { id: 'aav16a', title: 'Substituir [Nome] e [inserir data] antes de enviar' },
        { id: 'aav16b', title: 'Se cliente não responder em 24h: cobrar no grupo' },
        { id: 'aav16c', title: 'Pronto quando: aprovação (ou ajuste final) recebida por escrito no grupo' },
      ] },

      // ── MARCO 4 — CAMPANHAS NO AR (D12–D28) ───────────────────────
      { id: 'aav17', title: 'Criação da campanha principal (Conversão / Leads)', daysAfter: 12, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_campanhas', type: 'criar_campanha', done: false, checklist: [
        { id: 'aav17a', title: 'Criar campanha com objetivo Conversões (Meta) ou Geração de Leads (Google)' },
        { id: 'aav17b', title: 'Nomear: "[CLIENTE] — Leads — [MÊS/ANO]"' },
        { id: 'aav17c', title: '[Meta] Conjunto A: Público amplo (cidade + faixa etária, sem interesses)' },
        { id: 'aav17d', title: '[Meta] Conjunto B: Interesses específicos do nicho' },
        { id: 'aav17e', title: '[Meta] Conjunto C: Lookalike 1% (se tiver base de clientes)' },
        { id: 'aav17f', title: 'Verificar pixel e evento de conversão selecionados em cada conjunto/campanha' },
        { id: 'aav17g', title: 'Configurar orçamento diário (R$20–30/conjunto no início)' },
        { id: 'aav17h', title: 'Inserir 2–3 criativos por conjunto (variações de imagem e vídeo)' },
        { id: 'aav17i', title: 'Ativar em modo aprendizado — NÃO otimizar nas primeiras 72h' },
        { id: 'aav17j', title: 'Pronto quando: campanha ativa, anúncios aprovados, pixel disparando' },
      ] },
      { id: 'aav18', title: 'Criação da campanha de Fast Traffic (aquecimento de pixel)', daysAfter: 12, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_campanhas', type: 'criar_campanha', done: false, checklist: [
        { id: 'aav18a', title: '[Meta] Criar campanha Tráfego com objetivo Cliques no Link' },
        { id: 'aav18b', title: 'Nomear: "[CLIENTE] — Fast Traffic — [MÊS]"' },
        { id: 'aav18c', title: 'Público amplo: cidade do cliente, 18–55 anos, sem restrição de interesses' },
        { id: 'aav18d', title: 'Orçamento baixo: R$15–20/dia (objetivo é aquecer pixel, não converter)' },
        { id: 'aav18e', title: 'Usar criativos de engajamento: depoimento, bastidores, processo de trabalho' },
        { id: 'aav18f', title: 'Pronto quando: campanha ativa e CTR monitorado nas primeiras 48h' },
      ] },
      { id: 'aav19', title: 'Check D+3 — primeiras 72h (fase de aprendizado)', daysAfter: 15, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_campanhas', type: 'analise_conv', done: false, checklist: [
        { id: 'aav19a', title: 'Todas as campanhas ativas? Algum anúncio reprovado?' },
        { id: 'aav19b', title: 'O gasto diário está próximo ao orçamento definido? (Tolerância: ±20%)' },
        { id: 'aav19c', title: 'Anúncios em revisão há mais de 24h? → Contatar suporte da plataforma' },
        { id: 'aav19d', title: 'Pixel disparando o evento correto? (verificar Events Manager / Google Ads)' },
        { id: 'aav19e', title: 'Chegou algum lead? Qualidade confirmada com o cliente?' },
        { id: 'aav19f', title: 'IMPORTANTE: não fazer otimizações — algoritmo ainda em fase de aprendizado' },
        { id: 'aav19g', title: 'Pronto quando: status verificado e anomalias (se houver) documentadas no hub' },
      ] },
      { id: 'aav20', title: 'Check D+7 — primeira análise de dados', daysAfter: 19, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_campanhas', type: 'analise_conv', done: false, checklist: [
        { id: 'aav20a', title: 'CTR dos anúncios: abaixo de 0,8%? → pausar e testar novo criativo' },
        { id: 'aav20b', title: 'CPL atual vs meta do cliente: dentro do esperado?' },
        { id: 'aav20c', title: 'CPM alto para o nicho? (Meta: R$15–25 | Google: CPC R$1–5)' },
        { id: 'aav20d', title: 'Frequência > 2,5 já em 7 dias? → público muito pequeno; expandir geo ou faixa etária' },
        { id: 'aav20e', title: 'Qual conjunto/campanha teve melhor CPL? → escalar orçamento em 20%' },
        { id: 'aav20f', title: 'Qual criativo teve maior CTR? → duplicar e testar variação de copy ou visual' },
        { id: 'aav20g', title: 'Perguntar ao cliente: os leads recebidos são do perfil ideal?' },
        { id: 'aav20h', title: 'Registrar análise D+7 no hub com decisões tomadas e justificativas' },
      ] },
      { id: 'aav21', title: 'Enviar atualização D+14 ao cliente no grupo', daysAfter: 26, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_campanhas', type: 'whats_grupos', done: false, message: 'Olá, [Nome]! Boa tarde. 👋\n\nPassando para compartilhar um resumo das primeiras 2 semanas de campanha:\n\n📊 *Investido:* R$ [valor]\n📩 *Leads gerados:* [número]\n💸 *Custo por lead:* R$ [valor]\n📈 *CTR médio:* [%]\n\nO algoritmo ainda está na fase de aprendizado — os resultados tendem a melhorar nas próximas semanas. Já identificamos os criativos e públicos com melhor performance e estamos otimizando com base nos dados.\n\nQualquer dúvida, é só chamar! 💪', checklist: [
        { id: 'aav21a', title: 'Preencher os dados reais antes de enviar' },
        { id: 'aav21b', title: 'Se CPL muito acima da meta: adicionar contexto e os próximos ajustes planejados' },
      ] },

      // ── MARCO 5 — TREINAMENTO DE CONTEÚDO (D14–D45) ───────────────
      { id: 'aav22', title: 'Treinamento conteúdo — encontro 1: estratégia e formatos que convertem', daysAfter: 14, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_treinamento', type: 'treinamento', done: false, checklist: [
        { id: 'aav22a', title: 'Explicar o papel do conteúdo orgânico como suporte ao tráfego pago' },
        { id: 'aav22b', title: 'Mostrar hierarquia: Reels (alcance) > Feed (autoridade) > Stories (relacionamento)' },
        { id: 'aav22c', title: 'Ensinar estrutura de Reel que converte: hook 3s → problema → solução → CTA' },
        { id: 'aav22d', title: 'Definir frequência mínima de postagem: meta 3x por semana' },
        { id: 'aav22e', title: 'Criar calendário editorial das 2 semanas seguintes juntos' },
        { id: 'aav22f', title: 'Pronto quando: cliente saiu com calendário editorial preenchido' },
      ] },
      { id: 'aav23', title: 'Treinamento conteúdo — encontro 2: produção de vídeo com celular', daysAfter: 21, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_treinamento', type: 'treinamento', done: false, checklist: [
        { id: 'aav23a', title: 'Ensinar configurações de câmera: luz natural, enquadramento, fundo limpo' },
        { id: 'aav23b', title: 'Mostrar como criar um hook forte nos primeiros 3 segundos' },
        { id: 'aav23c', title: 'Praticar ao vivo: gravar um Reel simples durante o encontro' },
        { id: 'aav23d', title: 'Mostrar apps de edição básica: CapCut, editor nativo do Instagram' },
        { id: 'aav23e', title: 'Dar feedback imediato sobre o que foi gravado no encontro' },
        { id: 'aav23f', title: 'Pronto quando: cliente gravou ao menos 1 vídeo durante o encontro' },
      ] },
      { id: 'aav24', title: 'Treinamento conteúdo — encontro 3: copy, legenda e CTA', daysAfter: 45, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_treinamento', type: 'treinamento', done: false, checklist: [
        { id: 'aav24a', title: 'Ensinar estrutura de copy: dor → amplificação → solução → CTA' },
        { id: 'aav24b', title: 'Mostrar diferença: legenda de alcance (hashtags) vs legenda de conversão (CTA direto)' },
        { id: 'aav24c', title: 'Criar 3 legendas juntos para os próximos posts do cliente' },
        { id: 'aav24d', title: 'Definir o CTA padrão do cliente: WhatsApp, DM ou link na bio' },
        { id: 'aav24e', title: 'Agendar revisão: cliente está publicando sozinho com consistência?' },
        { id: 'aav24f', title: 'Pronto quando: cliente saiu com 3 legendas prontas e CTA definido' },
      ] },

      // ── MARCO 6 — PRIMEIRO RESULTADO (D30–D40) ─────────────────────
      { id: 'aav25', title: 'Elaborar relatório de performance — mês 1', daysAfter: 30, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_resultado1', type: 'relatorio_perf', done: false, checklist: [
        { id: 'aav25a', title: 'Investimento total do mês vs planejado' },
        { id: 'aav25b', title: 'Total de leads/conversões gerados' },
        { id: 'aav25c', title: 'CPL médio e comparação com a meta acordada' },
        { id: 'aav25d', title: 'CTR médio dos anúncios e evolução semanal' },
        { id: 'aav25e', title: 'CPM e alcance total da campanha' },
        { id: 'aav25f', title: 'Qual campanha/conjunto/criativo gerou mais leads' },
        { id: 'aav25g', title: 'Qualidade dos leads: feedback do cliente sobre o perfil dos contatos' },
        { id: 'aav25h', title: 'Proposta de estratégia para o mês 2 com base nos dados' },
        { id: 'aav25i', title: 'Pronto quando: relatório revisado pelo gerente antes do envio' },
      ] },
      { id: 'aav26', title: 'Enviar relatório ao cliente', daysAfter: 32, assigneeRole: 'gerente', assigneeId: 'beatriz', milestoneId: 'ms_av_resultado1', type: 'enviar_dash', done: false, message: 'Olá, [Nome]! 😊\n\nSegue o relatório com os resultados do primeiro mês de assessoria:\n📊 [link do relatório]\n\nVamos conversar sobre os resultados e planejar os próximos passos na nossa reunião do dia [data]? 📅\n\nAté lá, qualquer dúvida é só chamar!', checklist: [
        { id: 'aav26a', title: 'Substituir [link do relatório] e [data] antes de enviar' },
        { id: 'aav26b', title: 'Pronto quando: cliente confirmou que recebeu e abriu o relatório' },
      ] },
      { id: 'aav27', title: 'Reunião mensal — mês 1 (resultado + planejamento mês 2)', daysAfter: 35, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_resultado1', type: 'reuniao', done: false, checklist: [
        { id: 'aav27a', title: 'Apresentar relatório e explicar os números com contexto do nicho' },
        { id: 'aav27b', title: 'Coletar feedback de qualidade e volume dos leads recebidos' },
        { id: 'aav27c', title: 'Ajustar meta de CPL se necessário (dados reais vs estimativa inicial)' },
        { id: 'aav27d', title: 'Definir estratégia mês 2: escalar o que funcionou, pausar o que não funcionou' },
        { id: 'aav27e', title: 'Verificar taxa de conversão comercial: cliente está fechando vendas com os leads?' },
        { id: 'aav27f', title: 'Confirmar orçamento de mídia para o mês 2' },
        { id: 'aav27g', title: 'Registrar decisões e próximos passos no hub' },
        { id: 'aav27h', title: 'Pronto quando: decisões documentadas e equipe alinhada no hub' },
      ] },
      { id: 'aav28', title: 'Implementar ajustes pós-reunião (mês 1)', daysAfter: 37, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_resultado1', type: 'analise_conv', done: false, checklist: [
        { id: 'aav28a', title: 'Pausar anúncios/conjuntos que não performaram no mês 1' },
        { id: 'aav28b', title: 'Escalar orçamento nos conjuntos/campanhas vencedoras (+20–30%)' },
        { id: 'aav28c', title: 'Criar variações dos criativos vencedores (mesmo ângulo, nova arte ou copy)' },
        { id: 'aav28d', title: 'Ajustar segmentação: novo público, nova geo ou nova faixa etária se necessário' },
        { id: 'aav28e', title: '[Google] Adicionar negative keywords que geraram cliques sem conversão' },
        { id: 'aav28f', title: 'Registrar TODAS as mudanças no hub com data e justificativa' },
        { id: 'aav28g', title: 'Pronto quando: mudanças implementadas e documentadas no hub' },
      ] },

      // ── MARCO 7 — ROTINA MENSAL (recorrente, meses 2–6+) ──────────
      { id: 'aav29', title: '[Rotina] Revisão semanal de campanha', daysAfter: 42, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'gestao_diaria', done: false, checklist: [
        { id: 'aav29a', title: 'Status de todas as campanhas: alguma pausada, com erro ou reprovação?' },
        { id: 'aav29b', title: 'Pacing de gasto diário vs orçamento: está gastando no ritmo certo?' },
        { id: 'aav29c', title: 'CTR por anúncio: abaixo de 0,8%? → avaliar pausa ou troca de criativo' },
        { id: 'aav29d', title: 'Frequência > 3? → renovar criativo ou expandir público (urgente)' },
        { id: 'aav29e', title: 'CPL da semana vs meta: acima em mais de 30%? → investigar causa' },
        { id: 'aav29f', title: 'Leads sem resposta do cliente por mais de 24h? → alertar no grupo' },
        { id: 'aav29g', title: 'Pixel continua disparando corretamente? (checar semanalmente)' },
        { id: 'aav29h', title: 'Registrar observações e decisões da semana no hub' },
      ] },
      { id: 'aav30', title: '[Rotina] Atualização de criativos (quando necessário)', daysAfter: 50, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'ms_av_rotina', type: 'criativo', done: false, checklist: [
        { id: 'aav30a', title: 'Identificar anúncios com frequência > 3 OU CTR caindo semana a semana' },
        { id: 'aav30b', title: 'Pausar anúncios cansados (não deletar — preservar histórico de dados)' },
        { id: 'aav30c', title: 'Criar variação do criativo vencedor: mesmo ângulo, nova arte ou nova copy' },
        { id: 'aav30d', title: 'Testar um ângulo completamente novo (diferente problema ou benefício)' },
        { id: 'aav30e', title: 'Se cliente produz UGC: solicitar vídeo ou foto nova do próprio negócio' },
        { id: 'aav30f', title: 'Publicar novos criativos e monitorar CTR nas primeiras 48h' },
        { id: 'aav30g', title: 'Pronto quando: ao menos 2 novos criativos ativos e sendo monitorados' },
      ] },
      { id: 'aav31', title: '[Rotina] Elaborar relatório e diagnóstico mensal — mês 2', daysAfter: 60, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'relatorio_perf', done: false, checklist: [
        { id: 'aav31a', title: 'Consolidar dados: investimento, leads, CPL e CTR médio do mês' },
        { id: 'aav31b', title: 'Comparativo com mês anterior: CPL melhorou ou piorou? Em quanto?' },
        { id: 'aav31c', title: 'Identificar horários e dias da semana que geraram mais leads' },
        { id: 'aav31d', title: 'Análise de dispositivo: Mobile vs Desktop (onde converte mais?)' },
        { id: 'aav31e', title: 'Renovar públicos personalizados: engajadores e visitantes dos últimos 30 dias' },
        { id: 'aav31f', title: 'Proposta de estratégia para o mês 3 com base na evolução dos dados' },
        { id: 'aav31g', title: 'Pronto quando: relatório revisado e pronto para envio ao cliente' },
      ] },
      { id: 'aav32', title: '[Rotina] Reunião mensal — mês 2', daysAfter: 65, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'reuniao', done: false, checklist: [
        { id: 'aav32a', title: 'Enviar relatório ao cliente pelo menos 24h antes da reunião' },
        { id: 'aav32b', title: 'Apresentar evolução vs mês 1: o que mudou e por quê' },
        { id: 'aav32c', title: 'Coletar feedback de qualidade e volume de leads' },
        { id: 'aav32d', title: 'Definir foco e estratégia do mês 3' },
        { id: 'aav32e', title: 'Registrar decisões no hub após a reunião' },
      ] },
      { id: 'aav33', title: '[Rotina] Elaborar relatório e diagnóstico mensal — mês 3', daysAfter: 90, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'relatorio_perf', done: false, checklist: [
        { id: 'aav33a', title: 'Consolidar dados do mês: investimento, leads, CPL, CTR' },
        { id: 'aav33b', title: 'Análise trimestral (meses 1–3): tendência de CPL, melhores criativos, públicos' },
        { id: 'aav33c', title: '[Google] Revisar e limpar lista de negative keywords do trimestre' },
        { id: 'aav33d', title: '[Meta] Atualizar lookalikes com nova base de clientes do cliente' },
        { id: 'aav33e', title: 'Pronto quando: relatório revisado e pronto para envio' },
      ] },
      { id: 'aav34', title: '[Rotina] Reunião mensal — mês 3', daysAfter: 95, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'reuniao', done: false },
      { id: 'aav35', title: '[Rotina] Elaborar relatório e diagnóstico mensal — mês 4', daysAfter: 120, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'relatorio_perf', done: false },
      { id: 'aav36', title: '[Rotina] Reunião mensal — mês 4', daysAfter: 125, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'reuniao', done: false },
      { id: 'aav37', title: '[Rotina] Elaborar relatório e diagnóstico mensal — mês 5', daysAfter: 150, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'relatorio_perf', done: false },
      { id: 'aav38', title: '[Rotina] Reunião mensal — mês 5', daysAfter: 155, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_rotina', type: 'reuniao', done: false },

      // ── MARCO 8 — RENOVAÇÃO (D165–D180) ───────────────────────────
      { id: 'aav39', title: 'Conversa de renovação — planejamento do próximo semestre', daysAfter: 165, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_renovacao', type: 'plan_estrategico', done: false, message: 'Olá, [Nome]! Boa tarde. 🌟\n\nHoje completamos 6 meses juntos!\n\nFoi uma jornada incrível — [X leads gerados], CPL médio de R$[Y] e [destaque do período].\n\nGostaríamos de agendar uma reunião para planejar os próximos passos e continuar evoluindo os seus resultados. 📅\n\nE se puder, seria incrível contar com sua avaliação no Google:\n⭐ [link de avaliação]\n\nAté mais! 😊' },
      { id: 'aav40', title: 'Elaborar relatório semestral — mês 6', daysAfter: 165, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'ms_av_renovacao', type: 'relatorio_perf', done: false, checklist: [
        { id: 'aav40a', title: 'Compilar dados dos 6 meses: investimento total, leads totais, CPL médio geral' },
        { id: 'aav40b', title: 'Evolução de CPL: mês 1 vs mês 6 — quanto melhorou em %?' },
        { id: 'aav40c', title: 'Top 3 criativos do semestre (maior CTR / mais leads gerados)' },
        { id: 'aav40d', title: 'Top públicos/segmentações que melhor performaram no período' },
        { id: 'aav40e', title: 'Oportunidades identificadas para o próximo semestre' },
        { id: 'aav40f', title: 'Proposta de upgrade de plano (Estruturação ou Aceleração) se aplicável' },
        { id: 'aav40g', title: 'Pronto quando: relatório semestral revisado pelo gerente' },
      ] },
      { id: 'aav41', title: 'Reunião mensal — mês 6 + renovação contratual', daysAfter: 170, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'ms_av_renovacao', type: 'reuniao', done: false, checklist: [
        { id: 'aav41a', title: 'Apresentar relatório semestral com visão consolidada dos 6 meses' },
        { id: 'aav41b', title: 'Compartilhar análise: o que foi descoberto, o que funcionou, o que pode melhorar' },
        { id: 'aav41c', title: 'Apresentar proposta de renovação ou upgrade de plano' },
        { id: 'aav41d', title: 'Alinhar orçamento e estratégia para o próximo semestre' },
        { id: 'aav41e', title: 'Formalizar renovação ou encaminhar para offboarding se for o caso' },
      ] },
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
      { id: 'aes04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                       daysAfter: 0,  assigneeRole: 'admin',       assigneeId: 'gs', done: false, checklist: [
        { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
      ] },
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
    description: 'Jornada de 6 meses: diagnóstico → campanhas → estrutura comercial → automação → inteligência. Objetivo: projeto se pagar e dar lucro dentro do semestre.',
    milestones: [
      { id: 'ms_onboarding',  title: 'Onboarding',             icon: '🚀', type: 'kickoff',  order: 1 },
      { id: 'ms_setup',       title: 'Setup Técnico',           icon: '⚙️', type: 'setup',    order: 2 },
      { id: 'ms_perfil',      title: 'Perfil + Criativos',      icon: '📱', type: 'criativo', order: 3 },
      { id: 'ms_campanhas',   title: 'Campanhas no Ar',         icon: '📢', type: 'campanha', order: 4 },
      { id: 'ms_crm',         title: 'CRM + Automação',         icon: '💬', type: 'automacao',order: 5 },
      { id: 'ms_comercial',   title: 'Estrutura Comercial',     icon: '🛒', type: 'revisao',  order: 6 },
      { id: 'ms_lp',          title: 'Landing Page',            icon: '🖥️', type: 'lp',       order: 7 },
      { id: 'ms_dashboard',   title: 'Dashboard Looker Studio', icon: '📊', type: 'revisao',  order: 8 },
      { id: 'ms_ia',          title: 'Agente de IA',            icon: '🤖', type: 'automacao',order: 9 },
      { id: 'ms_ciclo',       title: 'Novo Ciclo',              icon: '🔄', type: 'renovacao',order: 10 },
    ],
    steps: [
      // ── MÊS 1 — DIAGNÓSTICO + PRIMEIRAS CAMPANHAS (D0–D30) ────────
      { id: 'aac01', title: '[F1] Criar grupo no WhatsApp do cliente',                                                daysAfter: 0,   assigneeRole: 'gerente',     assigneeId: 'beatriz',  milestoneId: 'ms_onboarding', type: 'reuniao',          done: false },
      { id: 'aac02', title: '[F1] Enviar mensagem de boas-vindas no grupo',                                           daysAfter: 0,   assigneeRole: 'gerente',     assigneeId: 'beatriz',  milestoneId: 'ms_onboarding', type: 'reuniao',          done: false, message: 'Seja bem-vinda à Tráfegon! ✨\n\nEste grupo foi criado para centralizarmos as informações com toda a nossa equipe e desenvolvermos o seu projeto de forma organizada e eficiente.\n\nAqui está o link da sua pastinha no Drive:\n📁 [inserir link]\n\nNessa pasta, você já pode adicionar sua identidade visual (caso tenha) e também fotos profissionais que queira utilizar no projeto.\n\nPode me passar aqui também seu Instagram por favor.' },
      { id: 'aac03', title: '[F1] Criar pasta do cliente no Drive',                                                   daysAfter: 0,   assigneeRole: 'admin',       assigneeId: 'beatriz',  milestoneId: 'ms_onboarding', type: 'reuniao',          done: false },
      { id: 'aac04', title: '[F1] Criar o cliente no hub.trafegon.com.br',                                            daysAfter: 0,   assigneeRole: 'admin',       assigneeId: 'gs',       milestoneId: 'ms_onboarding', type: 'reuniao',          done: false, checklist: [
        { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
        { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
        { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
        { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
        { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
      ] },
      { id: 'aac06', title: '[F1] Diagnóstico + Benchmark',                                                           daysAfter: 2,   assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_onboarding', type: 'plan_estrategico', done: false },
      { id: 'aac07', title: '[F1] Enviar Avaliação Análise 360° do Negócio',                                          daysAfter: 3,   assigneeRole: 'gerente',     assigneeId: 'beatriz',  milestoneId: 'ms_onboarding', type: 'reuniao',          done: false },
      { id: 'aac08', title: '[F1] Estudo de público-alvo (persona) + Definição de Ofertas',                           daysAfter: 3,   assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_onboarding', type: 'plan_estrategico', done: false },
      { id: 'aac09', title: '[F1] Reunião de Planejamento Estratégico (Cronograma e Financeiro)',                      daysAfter: 5,   assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_onboarding', type: 'reuniao',          done: false },
      { id: 'aac10', title: '[F1] Auditoria + Configuração de Contas (Gerenciador de negócios + GTM)',                daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_setup',      type: 'auditoria',        done: false, message: 'Google Analytics: Liberar acesso administrativo para atendimentotrafegon@gmail.com\n→ Analytics → Configurações → Administrador → Gerenciamento de acesso → (+) → Administrador (fazer em Conta e Propriedade)\n\nGoogle Search Console: Liberar para atendimentotrafegon@gmail.com\n→ Configurações → Usuários e permissões → Adicionar usuário → Total\n\nGoogle Tag Manager: Liberar para atendimentotrafegon@gmail.com\n→ Configurações → Gerenciamento de usuários → Administrador + Publicação\n\nGoogle Ads: Liberar para atendimentotrafegon@gmail.com (permissão administrativa)\n\nSite: Criar usuário para atendimentotrafegon@gmail.com — informar link de acesso e senha cadastrada.\n\nMeta Ads: Liberar como parceiro com a conta 593792896314697 — todos os ativos: conta de anúncios, página, WhatsApp, Instagram, pixel, catálogo e qualquer ativo pertinente ao projeto.' },
      { id: 'aac11', title: '[F1] Traqueamento de Eventos e Conversões',                                              daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_setup',      type: 'config_pixel',     done: false, checklist: [
        { id: 'trk1', title: 'Confirmar instalação do Pixel Meta via extensão Pixel Helper (Chrome)' },
        { id: 'trk2', title: 'Verificar disparo do evento PageView na LP/site' },
        { id: 'trk3', title: 'Criar evento Lead no Gerenciador de Eventos (formulário ou clique no CTA)' },
        { id: 'trk4', title: 'Instalar Google Tag Manager na LP (se ainda não tiver)' },
        { id: 'trk5', title: 'Criar tag de GA4 e tag de conversão Google Ads no GTM' },
        { id: 'trk6', title: 'Testar todos os eventos no Preview do GTM antes de publicar' },
        { id: 'trk7', title: 'Publicar o contêiner GTM' },
        { id: 'trk8', title: 'Confirmar eventos chegando em Meta Events Manager e Google Ads' },
        { id: 'trk9', title: 'Registrar na tarefa quais eventos foram configurados e onde' },
      ] },
      { id: 'aac12', title: '[F1 — ENTREGA] Criar/Atualizar o Google Meu Negócio',                                   daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'beatriz',  milestoneId: 'ms_perfil',     type: 'atualizar_gmn',    done: false, message: 'Bom dia, pessoal!\n\nPassando para deixar um passo a passo de como atualizar o Google Meu Negócio. 🫱🏻‍🫲🏼\n\nManter seu perfil sempre atualizado com novas publicações mostra ao Google que a sua empresa está ativa e relevante para o público. Isso aumenta suas chances de aparecer nas primeiras posições nas buscas, além de transmitir mais confiança para quem procura pelos seus serviços ou produtos.\n\nLink: [inserir link do documento guia]' },
      { id: 'aac13', title: '[F1 — ENTREGA] Organização do perfil (Instagram)',                                       daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'beatriz',  milestoneId: 'ms_perfil',     type: 'org_perfil',       done: false, checklist: [
        { id: 'ig1', title: 'Verificar se a conta está em modo Profissional (Criador ou Empresa)' },
        { id: 'ig2', title: 'Atualizar foto de perfil: logo do cliente, fundo limpo' },
        { id: 'ig3', title: 'Reescrever bio: quem é, o que faz, CTA e link' },
        { id: 'ig4', title: 'Configurar link na bio (site, WhatsApp ou Linktree)' },
        { id: 'ig5', title: 'Criar capas padronizadas para os Destaques (seguir identidade visual)' },
        { id: 'ig6', title: 'Organizar e renomear os Destaques existentes' },
        { id: 'ig7', title: 'Verificar dados de contato: e-mail, telefone e categoria do perfil' },
        { id: 'ig8', title: 'Publicar os primeiros posts do novo padrão visual' },
      ] },
      { id: 'aac14', title: '[F1 — ENTREGA] Edição de vídeos + Criação de artes',                                    daysAfter: 10,  assigneeRole: 'colaborador', assigneeId: 'adm_at',   milestoneId: 'ms_perfil',     type: 'edicao_video',     done: false },
      { id: 'aac15', title: '[F1 — ENTREGA] B — Campanhas de Fast Traffic',                                          daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_campanhas',  type: 'criar_campanha',   done: false, checklist: [
        { id: 'ft1', title: 'Criar campanha com objetivo Tráfego no Gerenciador de Anúncios' },
        { id: 'ft2', title: 'Nomear: "[CLIENTE] — Fast Traffic — [MÊS]"' },
        { id: 'ft3', title: 'Criar 1 conjunto com público amplo (cidade/Brasil, 18-45, sem interesses)' },
        { id: 'ft4', title: 'Criar 3 anúncios: 1 imagem feed, 1 stories/reels, 1 carrossel' },
        { id: 'ft5', title: 'Verificar pixel selecionado no nível do conjunto de anúncios' },
        { id: 'ft6', title: 'Ativar com orçamento inicial baixo (R$20–30/dia)' },
        { id: 'ft7', title: 'Monitorar CTR nas primeiras 48h' },
        { id: 'ft8', title: 'Pausar criativos com CTR abaixo de 0,8%' },
      ] },
      { id: 'aac16', title: '[F1 — ENTREGA] A — Campanhas de teste (Público, Criativos, Canais)',                    daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_campanhas',  type: 'criar_campanha',   done: false, checklist: [
        { id: 'tst1', title: 'Criar campanha com objetivo Conversões/Leads' },
        { id: 'tst2', title: 'Nomear: "[CLIENTE] — Teste [variável] — [MÊS]"' },
        { id: 'tst3', title: 'Conjunto A: Lookalike 1% a partir de lista de clientes' },
        { id: 'tst4', title: 'Conjunto B: Interesses específicos do nicho do cliente' },
        { id: 'tst5', title: 'Conjunto C: Remarketing de visitantes do site (últimos 30 dias)' },
        { id: 'tst6', title: 'Usar 1 criativo por conjunto (para isolar a variável testada)' },
        { id: 'tst7', title: 'Orçamento igual para cada conjunto (ABO — orçamento no conjunto)' },
        { id: 'tst8', title: 'Deixar rodar 7 dias sem otimizar' },
        { id: 'tst9', title: 'Analisar CPA, CTR e CPM por conjunto → escalar o vencedor, pausar os outros' },
      ] },
      { id: 'aac27', title: '[F1 — ENTREGA] D — Campanhas de Remarketing',                                           daysAfter: 7,   assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_campanhas',  type: 'criar_campanha',   done: false, checklist: [
        { id: 'rmk1', title: 'Criar público personalizado: visitantes do site (últimos 30 dias)' },
        { id: 'rmk2', title: 'Criar público personalizado: engajadores do Instagram (últimos 60 dias)' },
        { id: 'rmk3', title: 'Excluir da campanha quem já converteu (cliente/comprador)' },
        { id: 'rmk4', title: 'Criar campanha objetivo Conversões ou Mensagens' },
        { id: 'rmk5', title: 'Nomear: "[CLIENTE] — Remarketing — [MÊS]"' },
        { id: 'rmk6', title: 'Criativos focados em prova social, depoimentos e oferta específica' },
        { id: 'rmk7', title: 'Orçamento: 20–30% do total de mídia do cliente' },
        { id: 'rmk8', title: 'Monitorar frequência semanal — pausar se ultrapassar 5' },
      ] },
      { id: 'aac17', title: '[F1 — ENTREGA] Dashboard de indicadores',                                                daysAfter: 60,  assigneeRole: 'colaborador', assigneeId: 'elieser',  milestoneId: 'ms_dashboard',  type: 'relatorio_perf',   done: false },
      // ── MÊS 2 — ESTRUTURA DE CONVERSÃO + COMERCIAL (D30–D60) ──────
      { id: 'aac18', title: '[F1] CRM Básico — Implementação + Treinamento',                                         daysAfter: 30,  assigneeRole: 'admin',       assigneeId: 'gs',       milestoneId: 'ms_crm',        type: 'setup_conta',      done: false, checklist: [
        { id: 'crm1', title: 'Criar sub-conta do cliente no GoHighLevel' },
        { id: 'crm2', title: 'Configurar pipeline com os estágios do funil do cliente' },
        { id: 'crm3', title: 'Integrar formulário da landing page com o CRM' },
        { id: 'crm4', title: 'Configurar automação de boas-vindas (mensagem automática ao novo lead)' },
        { id: 'crm5', title: 'Criar template de primeiro contato no WhatsApp' },
        { id: 'crm6', title: 'Testar fluxo completo: preencher form → ver lead → mensagem disparada' },
        { id: 'crm7', title: 'Gravar vídeo curto de treinamento mostrando como usar o funil' },
        { id: 'crm8', title: 'Realizar treinamento ao vivo com o cliente (30–60 min)' },
      ] },
      { id: 'aac19', title: '[F1] Criar automação de entrada de leads no funil + integração WhatsApp API',            daysAfter: 35,  assigneeRole: 'colaborador', assigneeId: 'gs',       milestoneId: 'ms_crm',        type: 'setup_conta',      done: false, checklist: [
        { id: 'aut1', title: 'Criar novo Workflow no GoHighLevel' },
        { id: 'aut2', title: 'Definir gatilho: Form Submitted ou Webhook (conforme fonte do lead)' },
        { id: 'aut3', title: 'Ação 1: adicionar tag "novo_lead" e atribuir ao responsável comercial' },
        { id: 'aut4', title: 'Ação 2: enviar WhatsApp automático de boas-vindas (template aprovado)' },
        { id: 'aut5', title: 'Aguardar 2h → se sem resposta: disparar follow-up automático' },
        { id: 'aut6', title: 'Conectar integração Meta Leads (para campanhas de Lead Ads)' },
        { id: 'aut7', title: 'Testar o fluxo completo com número próprio antes de ativar' },
        { id: 'aut8', title: 'Ativar e monitorar os primeiros leads nas primeiras 24h' },
      ] },
      { id: 'aac20', title: '[F1 — ENTREGA] Estruturar rotina comercial (cadência, follow-up e abordagem)',          daysAfter: 35,  assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_comercial',  type: 'plan_estrategico', done: false },
      { id: 'aac21', title: '[F1 — ENTREGA] Criar script de abordagem e follow-up para leads',                       daysAfter: 37,  assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_comercial',  type: 'criacao_copy',     done: false },
      { id: 'aac22', title: '[F1 — ENTREGA] Treinamento comercial — abordagem, cadência e conversão de leads',       daysAfter: 40,  assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_comercial',  type: 'treinamento',      done: false },
      { id: 'aac23', title: '[F1 — ENTREGA] Desenvolvimento de Landing Page (Design, Textos, Web e Rastreamentos)',  daysAfter: 35,  assigneeRole: 'colaborador', assigneeId: 'adm_at',   milestoneId: 'ms_lp',         type: 'design_lp',        done: false },
      { id: 'aac24', title: '[F1] Aprovação versão Figma da Landing Page pelo cliente',                               daysAfter: 40,  assigneeRole: 'gerente',     assigneeId: 'adm_at',   milestoneId: 'ms_lp',         type: 'design_lp',        done: false },
      { id: 'aac25', title: '[F1 — ENTREGA] Desenvolvimento web da Landing Page',                                    daysAfter: 45,  assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'ms_lp',         type: 'design_lp',        done: false },
      { id: 'aac26', title: '[F1] Aprovação versão web da Landing Page pelo cliente',                                 daysAfter: 47,  assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_lp',         type: 'reuniao',          done: false, message: 'Estou encaminhando a Landing Page, bem focada em um único propósito: a conversão. Com objetivo bem claro e direto, para quando os visitantes caírem na página, tomarem a decisão de entrar em contato com vocês. 🤝\n\nLink: [inserir link da LP]' },
      // ── MÊS 3 — INTELIGÊNCIA + AUTOMAÇÃO (D60–D90) ────────────────
      { id: 'aac28', title: '[F1 — ENTREGA] Dashboard — Looker Studio',                                              daysAfter: 60,  assigneeRole: 'colaborador', assigneeId: 'elieser',  milestoneId: 'ms_dashboard',  type: 'relatorio_perf',   done: false, checklist: [
        { id: 'ls1', title: 'Criar novo relatório em lookerstudio.google.com' },
        { id: 'ls2', title: 'Conectar fonte: Google Ads (conta do cliente)' },
        { id: 'ls3', title: 'Conectar fonte: Google Analytics 4' },
        { id: 'ls4', title: 'Conectar fonte: Meta Ads (via Supermetrics ou conector nativo)' },
        { id: 'ls5', title: 'Criar página 1 — Visão Geral: investimento, leads, CPA e ROAS' },
        { id: 'ls6', title: 'Criar página 2 — Meta Ads: campanhas, conjuntos e criativos (CTR, CPC)' },
        { id: 'ls7', title: 'Criar página 3 — Google Ads: palavras-chave, grupos e conversões' },
        { id: 'ls8', title: 'Adicionar logotipo, cores da agência e filtro de data interativo' },
        { id: 'ls9', title: 'Compartilhar link de visualização com o cliente e explicar como usar' },
      ] },
      { id: 'aac29', title: '[F1 — ENTREGA] Desenvolvimento de agente de I.A pré-vendas',                            daysAfter: 75,  assigneeRole: 'admin',       assigneeId: 'gs',       milestoneId: 'ms_ia',         type: 'setup_conta',      done: false },
      // ── RECORRENTE — quinzenal desde M1, mensal desde M1 ──────────
      { id: 'aac30', title: '[F2] Reunião de acompanhamento de projeto — quinzenal (desde D15)',                      daysAfter: 15,  assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_onboarding', type: 'reuniao',          done: false },
      // ── MÊS 6 — PRÓXIMO CICLO (D150) ──────────────────────────────
      { id: 'aac32', title: '[F2] Novo planejamento próximo semestre',                                                daysAfter: 150, assigneeRole: 'gerente',     assigneeId: 'gs',       milestoneId: 'ms_ciclo',      type: 'plan_estrategico', done: false, message: 'Olá, [Nome]! Boa tarde. Tudo certo com você?\n\nHoje completam-se os 6 meses desde o início da nossa assessoria.\n\nGostaríamos de saber se você ainda tem alguma dúvida ou se precisa de mais algum apoio da nossa parte.\n\nSe estiver tudo certo, passamos para o próximo ciclo. Vamos agendar uma reunião de planejamento para os próximos 6 meses?\n\nE, se puder, gostaríamos muito de contar com sua avaliação no Google! 🌟\n[link de avaliação]' },
    ],
    createdAt: '2026-06-17',
    active: true,
  },
]

const ALL_PLAYBOOKS = [...DESTRAVA_PLAYBOOKS, ...ASSESSORIA_PLAYBOOKS, ...PRODUTO_PLAYBOOKS]


// ── Constantes visuais ─────────────────────────────────────────
const CAT_COLORS = {
  Onboarding: '#6eda2c', 'Tráfego Pago': '#60a5fa', Conteúdo: '#be29ec',
  Vídeo: '#ef4444', 'Landing Page': '#22d3ee', CRM: '#f59e0b',
  Reuniões: '#ea8a29', Entregas: '#f97316', Financeiro: '#06b6d4', Geral: '#8890b5',
}
const ROLE_COLORS  = { admin: '#ef4444', gerente: '#60a5fa', colaborador: '#6eda2c', visualizador: '#be29ec' }
const ROLE_LABELS  = { admin: 'Admin', gerente: 'Gerente', colaborador: 'Colaborador', visualizador: 'Visualizador' }
// Mapa fixo de checklists por step ID — fonte de verdade independente do Supabase
const STEP_CHECKLISTS = {
  aac04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  aes04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  dac04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  aav04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  dav04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  des04: [
    { id: 'hub1', title: 'Acessar hub.trafegon.com.br → menu Workspaces → Novo Cliente' },
    { id: 'hub2', title: 'Preencher nome, nicho e cor do cliente' },
    { id: 'hub3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
    { id: 'hub4', title: 'Salvar e confirmar que o workspace foi criado' },
    { id: 'hub5', title: 'Informar à equipe no grupo do WhatsApp que o cliente está no sistema' },
  ],
  aac11: [
    { id: 'trk1', title: 'Confirmar instalação do Pixel Meta via extensão Pixel Helper (Chrome)' },
    { id: 'trk2', title: 'Verificar disparo do evento PageView na LP/site' },
    { id: 'trk3', title: 'Criar evento Lead no Gerenciador de Eventos (formulário ou clique no CTA)' },
    { id: 'trk4', title: 'Instalar Google Tag Manager na LP (se ainda não tiver)' },
    { id: 'trk5', title: 'Criar tag de GA4 e tag de conversão Google Ads no GTM' },
    { id: 'trk6', title: 'Testar todos os eventos no Preview do GTM antes de publicar' },
    { id: 'trk7', title: 'Publicar o contêiner GTM' },
    { id: 'trk8', title: 'Confirmar eventos chegando em Meta Events Manager e Google Ads' },
    { id: 'trk9', title: 'Registrar na tarefa quais eventos foram configurados e onde' },
  ],
  aac13: [
    { id: 'ig1', title: 'Verificar se a conta está em modo Profissional (Criador ou Empresa)' },
    { id: 'ig2', title: 'Atualizar foto de perfil: logo do cliente, fundo limpo' },
    { id: 'ig3', title: 'Reescrever bio: quem é, o que faz, CTA e link' },
    { id: 'ig4', title: 'Configurar link na bio (site, WhatsApp ou Linktree)' },
    { id: 'ig5', title: 'Criar capas padronizadas para os Destaques (seguir identidade visual)' },
    { id: 'ig6', title: 'Organizar e renomear os Destaques existentes' },
    { id: 'ig7', title: 'Verificar dados de contato: e-mail, telefone e categoria do perfil' },
    { id: 'ig8', title: 'Publicar os primeiros posts do novo padrão visual' },
  ],
  aac15: [
    { id: 'ft1', title: 'Criar campanha com objetivo Tráfego no Gerenciador de Anúncios' },
    { id: 'ft2', title: 'Nomear: "[CLIENTE] — Fast Traffic — [MÊS]"' },
    { id: 'ft3', title: 'Criar 1 conjunto com público amplo (cidade/Brasil, 18-45, sem interesses)' },
    { id: 'ft4', title: 'Criar 3 anúncios: 1 imagem feed, 1 stories/reels, 1 carrossel' },
    { id: 'ft5', title: 'Verificar pixel selecionado no nível do conjunto de anúncios' },
    { id: 'ft6', title: 'Ativar com orçamento inicial baixo (R$20–30/dia)' },
    { id: 'ft7', title: 'Monitorar CTR nas primeiras 48h' },
    { id: 'ft8', title: 'Pausar criativos com CTR abaixo de 0,8%' },
  ],
  aac16: [
    { id: 'tst1', title: 'Criar campanha com objetivo Conversões/Leads' },
    { id: 'tst2', title: 'Nomear: "[CLIENTE] — Teste [variável] — [MÊS]"' },
    { id: 'tst3', title: 'Conjunto A: Lookalike 1% a partir de lista de clientes' },
    { id: 'tst4', title: 'Conjunto B: Interesses específicos do nicho do cliente' },
    { id: 'tst5', title: 'Conjunto C: Remarketing de visitantes do site (últimos 30 dias)' },
    { id: 'tst6', title: 'Usar 1 criativo por conjunto (para isolar a variável testada)' },
    { id: 'tst7', title: 'Orçamento igual para cada conjunto (ABO — orçamento no conjunto)' },
    { id: 'tst8', title: 'Deixar rodar 7 dias sem otimizar' },
    { id: 'tst9', title: 'Analisar CPA, CTR e CPM por conjunto → escalar o vencedor, pausar os outros' },
  ],
  aac27: [
    { id: 'rmk1', title: 'Criar público personalizado: visitantes do site (últimos 30 dias)' },
    { id: 'rmk2', title: 'Criar público personalizado: engajadores do Instagram (últimos 60 dias)' },
    { id: 'rmk3', title: 'Excluir da campanha quem já converteu (cliente/comprador)' },
    { id: 'rmk4', title: 'Criar campanha objetivo Conversões ou Mensagens' },
    { id: 'rmk5', title: 'Nomear: "[CLIENTE] — Remarketing — [MÊS]"' },
    { id: 'rmk6', title: 'Criativos focados em prova social, depoimentos e oferta específica' },
    { id: 'rmk7', title: 'Orçamento: 20–30% do total de mídia do cliente' },
    { id: 'rmk8', title: 'Monitorar frequência semanal — pausar se ultrapassar 5' },
  ],
  aac18: [
    { id: 'crm1', title: 'Criar sub-conta do cliente no GoHighLevel' },
    { id: 'crm2', title: 'Configurar pipeline com os estágios do funil do cliente' },
    { id: 'crm3', title: 'Integrar formulário da landing page com o CRM' },
    { id: 'crm4', title: 'Configurar automação de boas-vindas (mensagem automática ao novo lead)' },
    { id: 'crm5', title: 'Criar template de primeiro contato no WhatsApp' },
    { id: 'crm6', title: 'Testar fluxo completo: preencher form → ver lead → mensagem disparada' },
    { id: 'crm7', title: 'Gravar vídeo curto de treinamento mostrando como usar o funil' },
    { id: 'crm8', title: 'Realizar treinamento ao vivo com o cliente (30–60 min)' },
  ],
  aac19: [
    { id: 'aut1', title: 'Criar novo Workflow no GoHighLevel' },
    { id: 'aut2', title: 'Definir gatilho: Form Submitted ou Webhook (conforme fonte do lead)' },
    { id: 'aut3', title: 'Ação 1: adicionar tag "novo_lead" e atribuir ao responsável comercial' },
    { id: 'aut4', title: 'Ação 2: enviar WhatsApp automático de boas-vindas (template aprovado)' },
    { id: 'aut5', title: 'Aguardar 2h → se sem resposta: disparar follow-up automático' },
    { id: 'aut6', title: 'Conectar integração Meta Leads (para campanhas de Lead Ads)' },
    { id: 'aut7', title: 'Testar o fluxo completo com número próprio antes de ativar' },
    { id: 'aut8', title: 'Ativar e monitorar os primeiros leads nas primeiras 24h' },
  ],
  aac28: [
    { id: 'ls1', title: 'Criar novo relatório em lookerstudio.google.com' },
    { id: 'ls2', title: 'Conectar fonte: Google Ads (conta do cliente)' },
    { id: 'ls3', title: 'Conectar fonte: Google Analytics 4' },
    { id: 'ls4', title: 'Conectar fonte: Meta Ads (via Supermetrics ou conector nativo)' },
    { id: 'ls5', title: 'Criar página 1 — Visão Geral: investimento, leads, CPA e ROAS' },
    { id: 'ls6', title: 'Criar página 2 — Meta Ads: campanhas, conjuntos e criativos (CTR, CPC)' },
    { id: 'ls7', title: 'Criar página 3 — Google Ads: palavras-chave, grupos e conversões' },
    { id: 'ls8', title: 'Adicionar logotipo, cores da agência e filtro de data interativo' },
    { id: 'ls9', title: 'Compartilhar link de visualização com o cliente e explicar como usar' },
  ],
}

// Fallback de exibição. A lista real do seletor vem de `collaborators`,
// para não desatualizar toda vez que alguém entra ou sai da equipe.
const ASSIGNEE_NAMES = {
  gs: 'Gabriel', beatriz: 'Beatriz', carol: 'Carol', tochiro: 'Juliano',
  adm_at: 'Érica', elieser: 'Elieser', deivisson: 'Deivisson',
  mariana: 'Mariana', ana_sm: 'Ana',
  mari: 'Mari', ana: 'Ana',   // ids legados, mantidos para não quebrar exibição
}
const ASSIGNEE_COLORS = {
  gs: '#60a5fa', beatriz: '#f472b6', carol: '#34d399', tochiro: '#22d3ee',
  adm_at: '#f59e0b', elieser: '#a78bfa', deivisson: '#818cf8',
  mariana: '#14b8a6', ana_sm: '#ec4899',
  mari: '#fb923c', ana: '#e879f9',
}
const TASK_TYPE_ICONS = { lp: '🖥️', criativo: '🎨', campanha: '📢', copy: '✍️', video: '🎬', reuniao: '📅' }

// ── parseStep: converte prefixos [F1]/[F1 — ENTREGA]/[F2] em badges ──
function parseStep(title) {
  if (title.startsWith('[F2]'))           return { badge: 'Desafio', color: '#be29ec', clean: title.slice(5).trim() }
  if (title.startsWith('[F1 — ENTREGA]')) return { badge: 'Entrega', color: '#6eda2c', clean: title.slice(15).trim() }
  if (title.startsWith('[F1]'))           return { badge: 'Atividade', color: '#60a5fa', clean: title.slice(5).trim() }
  return { badge: null, color: null, clean: title }
}

// ── StepRow (editor) ───────────────────────────────────────────
function StepRow({ step, index, onChange, onDelete, milestones = [], onMove, isFirst, isLast, equipe = [], destaque }) {
  // Opções do seletor: a equipe real do ERP. Se por algum motivo ela não
  // carregar, cai no mapa fixo para o campo não ficar vazio.
  const opcoes = equipe.length > 0
    ? equipe.map(c => [c.id, c.name])
    : Object.entries(ASSIGNEE_NAMES)
  const checklist = Array.isArray(step.checklist) ? step.checklist : []

  function setChecklist(items) { onChange({ ...step, checklist: items }) }
  function addChecklistItem() {
    setChecklist([...checklist, { id: 'ck_' + Date.now(), title: '' }])
  }

  const hasAssignee = !!step.assigneeId
  const assigneeColor = hasAssignee ? (ASSIGNEE_COLORS[step.assigneeId] || '#8890b5') : (ROLE_COLORS[step.assigneeRole] || '#8890b5')
  const assigneeLabel = hasAssignee ? (ASSIGNEE_NAMES[step.assigneeId] || step.assigneeId) : (ROLE_LABELS[step.assigneeRole] || step.assigneeRole)

  return (
    <div className="flex flex-col gap-0 group"
      style={destaque ? { background: '#6eda2c0d', boxShadow: 'inset 3px 0 0 #6eda2c' } : undefined}>
      {/* flex-wrap: sem ele os controles estouravam a largura do modal e a
          lixeira ficava cortada pela borda — só aparecia com zoom reduzido */}
      <div className="flex items-center gap-x-3 gap-y-2 py-2 px-3 flex-wrap">
        {/* Ordem: a sequência da lista é a ordem que o time executa */}
        <div className="flex flex-col items-center flex-shrink-0">
          <button onClick={() => onMove?.(-1)} disabled={isFirst} title="Subir"
            className="text-muted hover:text-accent disabled:opacity-20 disabled:hover:text-muted transition-colors leading-none">
            <ChevronUp size={12} />
          </button>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold"
            style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{index + 1}</span>
          <button onClick={() => onMove?.(1)} disabled={isLast} title="Descer"
            className="text-muted hover:text-accent disabled:opacity-20 disabled:hover:text-muted transition-colors leading-none">
            <ChevronDown size={12} />
          </button>
        </div>
        <input
          value={step.title}
          autoFocus={destaque}
          onChange={e => onChange({ ...step, title: e.target.value })}
          className="flex-1 min-w-[200px] text-sm text-text bg-transparent border-none outline-none font-medium placeholder:text-muted/50"
          placeholder="Descrição da etapa..."
        />
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto flex-wrap justify-end">
          {/* Início (D) e prazo de entrega, em dias */}
          <div className="flex items-center gap-1" title="Dia em que a etapa começa">
            <Clock size={11} className="text-muted" />
            <input type="number" min={0} max={90} value={step.daysAfter}
              onChange={e => onChange({ ...step, daysAfter: parseInt(e.target.value) || 0 })}
              className="w-10 text-center text-xs font-bold text-text bg-surface border border-border rounded-lg px-1 py-0.5 outline-none" />
            <span className="text-[10px] text-muted">d</span>
          </div>
          <div className="flex items-center gap-0.5" title="Prazo para entregar, contado a partir do início">
            <span className="text-[10px] text-muted">+</span>
            <input type="number" min={0} max={90}
              value={step.prazo ?? ''}
              placeholder="—"
              onChange={e => {
                const v = e.target.value
                onChange({ ...step, prazo: v === '' ? undefined : (parseInt(v) || 0) })
              }}
              className="w-9 text-center text-xs font-bold rounded-lg px-1 py-0.5 outline-none border"
              style={step.prazo == null
                ? { background: '#fff', borderColor: '#e2e5f0', color: '#a8b0c8' }
                : { background: '#60a5fa12', borderColor: '#60a5fa40', color: '#3b82f6' }} />
            <span className="text-[10px] text-muted">d</span>
          </div>
          {hasAssignee ? (
            <select value={step.assigneeId}
              onChange={e => onChange({ ...step, assigneeId: e.target.value })}
              className="text-[10px] font-bold rounded-lg px-2 py-1 border border-border outline-none"
              style={{ color: assigneeColor, background: assigneeColor + '12' }}>
              {opcoes.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          ) : (
            <select value={step.assigneeRole}
              onChange={e => onChange({ ...step, assigneeRole: e.target.value })}
              className="text-[10px] font-bold rounded-lg px-2 py-1 border border-border outline-none"
              style={{ color: ROLE_COLORS[step.assigneeRole] || '#8890b5', background: '#f8f9fc' }}>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          )}
          {milestones.length > 0 && (
            <select value={step.milestoneId || ''}
              onChange={e => onChange({ ...step, milestoneId: e.target.value || undefined })}
              className="text-[10px] font-bold rounded-lg px-2 py-1 border border-border outline-none max-w-[130px]"
              style={{ color: step.milestoneId ? '#60a5fa' : '#8890b5', background: step.milestoneId ? '#60a5fa12' : '#f8f9fc' }}>
              <option value="">Sem marco</option>
              {milestones.map(ms => <option key={ms.id} value={ms.id}>{ms.icon} {ms.title}</option>)}
            </select>
          )}
          {/* Sempre visível: escondido atrás do hover, sumia em celular e tablet */}
          <button onClick={onDelete} title="Excluir esta etapa"
            className="opacity-40 hover:opacity-100 transition-opacity text-danger p-1 -m-1">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Checklist da etapa — é o que o júnior segue na tarefa */}
      <div className="mx-3 mb-2">
        {checklist.length > 0 && (
          <div className="rounded-lg overflow-hidden mb-1.5" style={{ border: '1px solid #6eda2c22', background: '#6eda2c06' }}>
            <div className="flex items-center gap-1.5 px-2 py-1 border-b" style={{ borderColor: '#6eda2c18' }}>
              <span className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: '#4ca31c' }}>
                ✓ Checklist · {checklist.length}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: '#6eda2c12' }}>
              {checklist.map((item, ci) => (
                <div key={item.id} className="flex items-center gap-2 px-2 py-1 group/ck">
                  <span className="text-[9px] text-muted w-3 flex-shrink-0">{ci + 1}</span>
                  <input
                    value={item.title ?? item.text ?? ''}
                    onChange={e => setChecklist(checklist.map(x => x.id === item.id ? { ...x, title: e.target.value, text: undefined } : x))}
                    placeholder="O que precisa ser feito..."
                    className="flex-1 text-[11px] bg-transparent border-none outline-none text-text placeholder:text-muted/50"
                  />
                  <button onClick={() => setChecklist(checklist.filter(x => x.id !== item.id))}
                    title="Remover este item"
                    className="opacity-40 hover:opacity-100 transition-opacity text-danger flex-shrink-0 p-1 -m-1">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={addChecklistItem}
          className="text-[9px] font-bold text-muted hover:text-accent transition-colors flex items-center gap-1">
          <span>+</span> {checklist.length > 0 ? 'Adicionar item ao checklist' : 'Adicionar checklist'}
        </button>
      </div>

      <div className="mx-3 mb-2">
        {step.message ? (
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #f59e0b22', background: '#f59e0b06' }}>
            <div className="flex items-center gap-1.5 px-2 py-1 border-b" style={{ borderColor: '#f59e0b18' }}>
              <span className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: '#f59e0b' }}>📋 Mensagem padrão</span>
              <button
                onClick={() => onChange({ ...step, message: '' })}
                className="ml-auto text-[9px] text-muted hover:text-danger transition-colors">remover</button>
            </div>
            <textarea
              value={step.message}
              onChange={e => onChange({ ...step, message: e.target.value })}
              rows={3}
              className="w-full text-[11px] px-2.5 py-2 resize-none outline-none bg-transparent"
              style={{ color: '#5a4018' }}
              placeholder="Texto da mensagem que será copiada..."
            />
          </div>
        ) : (
          <button
            onClick={() => onChange({ ...step, message: '' })}
            className="text-[9px] font-bold text-muted hover:text-amber-500 transition-colors flex items-center gap-1">
            <span>+</span> Adicionar mensagem padrão
          </button>
        )}
      </div>
    </div>
  )
}

// ── helpers do VincularModal ───────────────────────────────────
// Datas da tarefa a partir da etapa.
// Sem `prazo`, mantém o comportamento antigo: uma data só, o "D" como
// vencimento. Com `prazo`, o "D" vira início e o vencimento é início + prazo.
function datasDaEtapa(inicioProjeto, s) {
  const inicio = calcDate(inicioProjeto, s.daysAfter)
  // Sem prazo definido: inicio e entrega no mesmo dia. O vencimento nao se
  // altera, mas a tarefa deixa de nascer sem data de inicio.
  if (s.prazo == null) return { startDate: inicio, dueDate: inicio }
  return { startDate: inicio, dueDate: calcDate(inicioProjeto, s.daysAfter + s.prazo) }
}

function calcDate(startDate, daysAfter) {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + daysAfter)
  return d.toISOString().slice(0, 10)
}

// O checklist salvo no playbook manda. STEP_CHECKLISTS é só fallback para
// os passos que nunca foram editados — senão a edição no hub era ignorada.
function stepChecklist(s) {
  if (Array.isArray(s.checklist) && s.checklist.length > 0) return s.checklist
  return STEP_CHECKLISTS[s.id] || []
}

// Remove qualquer prefixo entre colchetes do título ([F1], [ENTREGA],
// [TRILHA A — WORDPRESS]...). O prefixo organiza o playbook; na tarefa do
// cliente ele só atrapalha.
function cleanTitle(title) {
  return String(title || '').replace(/^\s*(\[[^\]]*\]\s*)+/, '').trim()
}

// A marcação de entrega externa vinha de o título conter "ENTREGA".
// Agora aceita também a etiqueta no campo tag, sem quebrar o que já existe.
function isEntrega(step) {
  return step.tag === 'ENTREGA' || String(step.title || '').includes('ENTREGA')
}

// ── VincularModal ──────────────────────────────────────────────
function VincularModal({ pb, erpClients, collaborators, onClose, onCreateTasks, onCreateMilestone }) {
  // Detecta se o playbook usa assigneeId (novo sistema) ou assigneeRole (antigo)
  const hasAssigneeIds = pb.steps.some(s => s.assigneeId)
  const hasMilestones  = Array.isArray(pb.milestones) && pb.milestones.length > 0

  const roles    = [...new Set(pb.steps.map(s => s.assigneeRole))]
  const today    = new Date().toISOString().slice(0, 10)
  const [clientId,  setClientId]  = useState(erpClients[0]?.id || '')
  const [startDate, setStartDate] = useState(today)
  const [roleMap,   setRoleMap]   = useState({})
  const [creating,  setCreating]  = useState(false)
  const [done,      setDone]      = useState(false)
  const [expandedMs, setExpandedMs] = useState({})

  const client = erpClients.find(c => c.id === clientId)

  // ── Fluxo ANTIGO: preview por roleMap ──
  const previewOld = !hasAssigneeIds ? pb.steps.map(s => ({
    title:    s.title,
    dueDate:  calcDate(startDate, s.daysAfter),
    type:     getTaskType(pb.category, s.assigneeRole),
    assignee: roleMap[s.assigneeRole] || null,
    role:     s.assigneeRole,
  })) : []

  // ── Fluxo NOVO: agrupado por milestone ──
  const milestoneGroups = hasAssigneeIds && hasMilestones
    ? pb.milestones.map(ms => {
        const steps = pb.steps.filter(s => s.milestoneId === ms.id && s.assigneeId)
        const minDay = steps.length > 0 ? Math.min(...steps.map(s => s.daysAfter)) : 0
        return { ms, steps, msDate: calcDate(startDate, minDay) }
      }).filter(g => g.steps.length > 0)
    : []

  // ── Criar (novo fluxo) ──
  async function handleCreateNew() {
    setCreating(true)
    for (const { ms, steps, msDate } of milestoneGroups) {
      const mgId = `pb_${pb.id}_${ms.id}_${clientId}`
      await onCreateMilestone({
        clientId,
        date:                msDate,
        type:                ms.type,
        title:               ms.title,
        description:         '',
        milestoneGroupId:    mgId,
        playbookId:          pb.id,
        playbookMilestoneId: ms.id,
      })
      for (const s of steps) {
        await onCreateTasks({
          clientId,
          title:           cleanTitle(s.title),
          type:            s.type || getTaskType(pb.category, s.assigneeRole),
          assignee:        s.assigneeId,
          ...datasDaEtapa(startDate, s),
          status:          'todo',
          priority:        'medium',
          level:           isEntrega(s) ? 'externo' : 'operacao',
          description:     s.message || null,
          checklist:       stepChecklist(s),
          milestoneGroupId: mgId,
          playbookId:      pb.id,
        })
      }
    }
    // Steps sem milestoneId (ex: aac31) — cria como tarefas simples
    const orphanSteps = pb.steps.filter(s => s.assigneeId && !s.milestoneId)
    for (const s of orphanSteps) {
      await onCreateTasks({
        clientId,
        title:       cleanTitle(s.title),
        type:        s.type || getTaskType(pb.category, s.assigneeRole),
        assignee:    s.assigneeId,
        ...datasDaEtapa(startDate, s),
        status:      'todo',
        priority:    'medium',
        level:       isEntrega(s) ? 'externo' : 'operacao',
        description: `📋 ${pb.title}`,
        checklist:   stepChecklist(s),
        playbookId:  pb.id,
      })
    }
    setDone(true)
    setCreating(false)
  }

  // ── Criar (fluxo antigo) ──
  async function handleCreateOld() {
    setCreating(true)
    for (const t of previewOld) {
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

  const totalTasks = hasAssigneeIds
    ? milestoneGroups.reduce((s, g) => s + g.steps.length, 0) + pb.steps.filter(s => s.assigneeId && !s.milestoneId).length
    : previewOld.length

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: '#6eda2c15' }}>
          <Check size={32} style={{ color: '#6eda2c' }} />
        </div>
        <p className="text-lg font-extrabold text-text mb-1">{totalTasks} tarefas criadas!</p>
        {hasMilestones && <p className="text-xs text-muted mb-1">{milestoneGroups.length} marcos criados</p>}
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

          {/* ── FLUXO NOVO: agrupado por milestone ── */}
          {hasAssigneeIds ? (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">
                Marcos e tarefas ({milestoneGroups.length} marcos · {totalTasks} tarefas)
              </label>
              <div className="space-y-2">
                {milestoneGroups.map(({ ms, steps, msDate }) => {
                  const isOpen = expandedMs[ms.id]
                  return (
                    <div key={ms.id} className="rounded-xl border border-border overflow-hidden">
                      <button
                        onClick={() => setExpandedMs(p => ({ ...p, [ms.id]: !p[ms.id] }))}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left">
                        <span className="text-base flex-shrink-0">{ms.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-text">{ms.title}</p>
                          <p className="text-[10px] text-muted">D{Math.min(...steps.map(s => s.daysAfter))} · {steps.length} tarefa(s)</p>
                        </div>
                        <span className="text-[10px] font-bold text-muted flex-shrink-0">{msDate}</span>
                        {isOpen ? <ChevronDown size={13} className="text-muted flex-shrink-0" /> : <ChevronRight size={13} className="text-muted flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="border-t border-border divide-y divide-border/50">
                          {steps.map(s => {
                            const collab     = collaborators.find(c => c.id === s.assigneeId)
                            const nameLabel  = collab?.name || ASSIGNEE_NAMES[s.assigneeId] || s.assigneeId
                            const nameColor  = ASSIGNEE_COLORS[s.assigneeId] || '#6eda2c'
                            return (
                              <div key={s.id} className="flex flex-col px-4 py-2 bg-surface/40 border-b border-border/30 last:border-0">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-muted w-6 flex-shrink-0">D{s.daysAfter}</span>
                                  <span className="flex-1 text-xs text-text truncate">{cleanTitle(s.title)}</span>
                                  {s.assigneeId && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                                      style={{ background: nameColor + '18', color: nameColor }}>{nameLabel}</span>
                                  )}
                                  {s.message && (
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded flex-shrink-0"
                                      style={{ background: '#f59e0b18', color: '#f59e0b' }}>📋</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              {/* ── FLUXO ANTIGO: mapeamento de papéis ── */}
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

              {/* Preview das tarefas (fluxo antigo) */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">
                  Tarefas que serão criadas ({previewOld.length})
                </label>
                <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto">
                  {previewOld.map((t, i) => {
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-border">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button
            onClick={hasAssigneeIds ? handleCreateNew : handleCreateOld}
            disabled={!clientId || creating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all disabled:opacity-50"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            {creating
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Criando...</>
              : <><Zap size={15} /> {hasAssigneeIds ? `Criar tarefas e marcos` : `Criar ${previewOld.length} tarefas`}</>
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

          {/* Botão Vincular — bloqueado em playbook arquivado */}
          <button onClick={() => pb.active !== false && onVincular(pb)}
            disabled={pb.active === false}
            title={pb.active === false ? 'Playbook arquivado. Reative para poder vincular.' : undefined}
            className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all disabled:cursor-not-allowed"
            style={pb.active === false
              ? { background: '#f1f3f9', color: '#a8b0c8', border: '1px solid #e2e5f0' }
              : { background: catColor + '15', color: catColor, border: `1px solid ${catColor}30` }}>
            <Link2 size={12} /> {pb.active === false ? 'Arquivado' : 'Vincular a cliente'}
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
                      {s.message && (
                        <button
                          onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(s.message) }}
                          title="Copiar mensagem padrão"
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 transition-colors hover:opacity-80"
                          style={{ background: '#f59e0b18', color: '#f59e0b' }}>
                          📋 Copiar
                        </button>
                      )}
                      <span className="text-[10px] font-bold flex items-center gap-1 flex-shrink-0" style={{ color: '#60a5fa' }}>
                        <Clock size={10} />d{s.daysAfter}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: (s.assigneeId ? ASSIGNEE_COLORS[s.assigneeId] : ROLE_COLORS[s.assigneeRole] || '#8890b5') + '18', color: s.assigneeId ? ASSIGNEE_COLORS[s.assigneeId] || '#8890b5' : ROLE_COLORS[s.assigneeRole] || '#8890b5' }}>
                        {s.assigneeId ? (ASSIGNEE_NAMES[s.assigneeId] || s.assigneeId) : (ROLE_LABELS[s.assigneeRole] || s.assigneeRole)}
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
function PlaybookModal({ pb, onClose, onSave, equipe = [] }) {
  const isNew = !pb
  const [novoStepId, setNovoStepId] = useState(null)
  const [form, setForm] = useState(pb || {
    id: 'pb_' + Date.now(), title: '', category: 'Geral', description: '',
    steps: [], createdAt: new Date().toISOString().slice(0, 10), active: true,
  })

  // A etapa nova nasce com responsável e marco herdados da última. Sem
  // assigneeId ela seria ignorada na hora de vincular a um cliente — virava
  // uma etapa que nunca produzia tarefa.
  function addStep() {
    setForm(f => {
      const ultima  = f.steps[f.steps.length - 1]
      const novoId  = 's_' + Date.now()
      const marcos  = f.milestones || []
      setNovoStepId(novoId)
      return {
        ...f,
        steps: [...f.steps, {
          id: novoId,
          title: '',
          daysAfter:    ultima ? ultima.daysAfter : 0,
          assigneeRole: ultima?.assigneeRole || 'colaborador',
          assigneeId:   ultima?.assigneeId   || equipe[0]?.id || 'gs',
          milestoneId:  ultima?.milestoneId  || marcos[0]?.id,
          type:         ultima?.type,
          done: false,
          checklist: [],
        }],
      }
    })
  }

  // Troca a etapa de posição na lista. A ordem do array é a ordem que o time
  // executa e a ordem em que as tarefas são criadas dentro de cada marco.
  function moveStep(index, dir) {
    setForm(f => {
      const alvo = index + dir
      if (alvo < 0 || alvo >= f.steps.length) return f
      const steps = [...f.steps]
      const [movida] = steps.splice(index, 1)
      steps.splice(alvo, 0, movida)
      return { ...f, steps }
    })
  }

  function addMilestone() {
    setForm(f => {
      const list = f.milestones || []
      return {
        ...f,
        milestones: [...list, {
          id: 'ms_' + Date.now(), title: '', icon: '📌',
          type: 'revisao', order: list.length + 1,
        }],
      }
    })
  }

  function updateMilestone(id, patch) {
    setForm(f => ({ ...f, milestones: (f.milestones || []).map(m => m.id === id ? { ...m, ...patch } : m) }))
  }

  // Ao remover um marco, solta as etapas que apontavam para ele —
  // senão ficam com referência morta e somem do agrupamento.
  function removeMilestone(id) {
    setForm(f => ({
      ...f,
      milestones: (f.milestones || []).filter(m => m.id !== id),
      steps: f.steps.map(s => s.milestoneId === id ? { ...s, milestoneId: undefined } : s),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>

        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-base font-extrabold text-text">{isNew ? 'Novo Playbook' : 'Editar Playbook'}</h2>
          {/* largura maior no editor: a linha da etapa tem muitos controles */}
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

          {/* Marcos — agrupam as etapas e viram os marcos do cliente */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Marcos</label>
              <button onClick={addMilestone}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-accent hover:bg-accent/10 transition-colors border border-accent/20">
                <Plus size={12} /> Adicionar
              </button>
            </div>
            {(form.milestones || []).length === 0 ? (
              <p className="text-xs text-muted text-center py-4 rounded-xl border border-dashed border-border">
                Sem marcos. As etapas viram uma lista corrida.
              </p>
            ) : (
              <div className="space-y-0 divide-y divide-border rounded-xl overflow-hidden border border-border">
                {(form.milestones || []).map((ms, i) => (
                  <div key={ms.id} className="flex items-center gap-2 py-2 px-3 group/ms">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                      style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>{i + 1}</span>
                    <input value={ms.icon || ''} onChange={e => updateMilestone(ms.id, { icon: e.target.value })}
                      className="w-8 text-center text-sm bg-surface border border-border rounded-lg py-0.5 outline-none flex-shrink-0"
                      placeholder="📌" />
                    <input value={ms.title} onChange={e => updateMilestone(ms.id, { title: e.target.value })}
                      placeholder="Nome do marco (ex: Abertura)"
                      className="flex-1 text-sm text-text bg-transparent border-none outline-none font-medium placeholder:text-muted/50" />
                    <span className="text-[10px] text-muted flex-shrink-0">
                      {form.steps.filter(s => s.milestoneId === ms.id).length} etapas
                    </span>
                    <button onClick={() => removeMilestone(ms.id)} title="Remover este marco"
                      className="opacity-40 hover:opacity-100 transition-opacity text-danger flex-shrink-0 p-1 -m-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  <StepRow key={s.id} step={s} index={i} milestones={form.milestones || []} equipe={equipe}
                    destaque={s.id === novoStepId}
                    isFirst={i === 0} isLast={i === form.steps.length - 1}
                    onMove={dir => moveStep(i, dir)}
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
const PRODUTO_IDS = new Set(PRODUTO_PLAYBOOKS.map(pb => pb.id))

// Processos jurídicos e contratuais da agência
const JURIDICO_IDS = new Set(['pb_criacao_contratos'])

const PRODUCT_GROUPS = [
  { key: 'destrava',   label: 'Destrava Digital', icon: '🔒', color: '#6eda2c', match: pb => pb.title.startsWith('Destrava Digital') },
  { key: 'assessoria', label: 'Assessoria',        icon: '📋', color: '#60a5fa', match: pb => pb.title.toLowerCase().includes('assessoria') || pb.title.startsWith('PRO') },
  { key: 'produtos',   label: 'Produtos avulsos',  icon: '💼', color: '#ea8a29', match: pb => PRODUTO_IDS.has(pb.id) },
  { key: 'juridico',   label: 'Jurídico',          icon: '⚖️', color: '#a78bfa', match: pb => JURIDICO_IDS.has(pb.id) },
  // catch-all: sem ele, playbook que não casa com nenhum grupo some da aba Todos
  { key: 'outros',     label: 'Outros',            icon: '📁', color: '#8890b5', match: () => true },
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
  { key: 'produtos',   label: 'Produtos avulsos', icon: '💼', color: '#ea8a29' },
  { key: 'juridico',   label: 'Jurídico',         icon: '⚖️', color: '#a78bfa' },
]

function matchTab(pb, tabKey) {
  if (tabKey === 'todos')      return true
  if (tabKey === 'destrava')   return pb.title.startsWith('Destrava Digital')
  if (tabKey === 'assessoria') return pb.title.toLowerCase().includes('assessoria')
  if (tabKey === 'produtos')   return PRODUTO_IDS.has(pb.id)
  if (tabKey === 'juridico')   return JURIDICO_IDS.has(pb.id)
  return false
}

// ── Main ───────────────────────────────────────────────────────
export default function Playbooks() {
  const { erpClients, collaborators, addTask, addMilestone, loading,
          playbooks, fetchPlaybooks, savePlaybook, deletePlaybook } = useData()
  const [modal,      setModal]      = useState(null)
  const [vincularPb, setVincularPb] = useState(null)
  const [tab,        setTab]        = useState('todos')
  const [mostrarArquivados, setMostrarArquivados] = useState(false)
  const [search,     setSearch]     = useState('')

  useEffect(() => { fetchPlaybooks(ALL_PLAYBOOKS) }, [])

  const activeCount = playbooks.filter(p => p.active).length

  // Playbook aposentado (Ativo desligado) some da tela. A linha continua no
  // banco e as tarefas ja criadas para clientes seguem intactas -- some apenas
  // da lista, para ninguem vincular por engano.
  const arquivados = playbooks.filter(pb => pb.active === false)
  const visiveis   = mostrarArquivados
    ? arquivados                                      // só os arquivados
    : playbooks.filter(pb => pb.active !== false)     // só os ativos

  const filtered = visiveis.filter(pb => {
    const matchesTab    = matchTab(pb, tab)
    const q             = search.trim().toLowerCase()
    const matchesSearch = !q || pb.title.toLowerCase().includes(q) || pb.description.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const useGroups = tab === 'todos' && !search.trim()
  const groups    = useGroups ? groupByProduct(filtered) : null

  async function handleSave(form) {
    const ok = await savePlaybook(form)
    if (ok !== false) setModal(null)
  }

  async function handleDelete(id) {
    const pb = playbooks.find(p => p.id === id)
    if (!pb) return
    const n = (pb.steps || []).length
    const ok = window.confirm(
      `Excluir definitivamente o playbook "${pb.title}"?

${n} etapas serão apagadas e não há como desfazer.
As tarefas já criadas em clientes NÃO são afetadas.

Se você só quer tirá-lo da lista, cancele e use Arquivar.`
    )
    if (!ok) return
    await deletePlaybook(id)
  }

  async function handleVincularTask(taskData)     { await addTask(taskData) }
  async function handleVincularMilestone(msData)  { await addMilestone(msData) }

  function PlaybookGrid({ list }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {list.map(pb => (
            <PlaybookCard key={pb.id} pb={pb}
              onEdit={p => setModal(p)}
              onDuplicate={p => savePlaybook({ ...p, id: 'pb_' + Date.now(), title: p.title + ' (cópia)', createdAt: new Date().toISOString().slice(0, 10), updatedAt: null })}
              onDelete={handleDelete}
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
            ? visiveis.length
            : visiveis.filter(pb => matchTab(pb, t.key)).length
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

        {/* Arquivados: escondidos por padrão, mas nunca perdidos */}
        {arquivados.length > 0 && (
          <button onClick={() => setMostrarArquivados(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ml-auto"
            style={mostrarArquivados
              ? { background: '#8890b5', color: '#fff' }
              : { background: 'transparent', color: '#8890b5', border: '1px dashed #cbd2e5' }}>
            📦 Arquivados ({arquivados.length})
          </button>
        )}
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
          <p className="text-sm font-bold">
            {mostrarArquivados ? 'Nenhum playbook arquivado nesta aba.' : 'Nenhum playbook encontrado.'}
          </p>
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
          <PlaybookModal pb={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} equipe={collaborators} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {vincularPb && (
          <VincularModal
            pb={vincularPb}
            erpClients={erpClients}
            collaborators={collaborators}
            onClose={() => setVincularPb(null)}
            onCreateTasks={handleVincularTask}
            onCreateMilestone={handleVincularMilestone}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
