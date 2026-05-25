import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, X, ChevronDown, ChevronRight, CheckCircle2,
  Clock, Trash2, Edit2, Copy, Link2, Check, Zap,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'

const STORAGE_KEY = 'trafegon_playbooks_v1'
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

function initPlaybooks() {
  const stored = load()
  if (stored.length === 0) { save(SAMPLE); return SAMPLE }
  const storedIds = new Set(stored.map(p => p.id))
  const missing   = SAMPLE.filter(p => !storedIds.has(p.id))
  if (missing.length > 0) {
    const updated = [...stored, ...missing]
    save(updated)
    return updated
  }
  return stored
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
                {pb.steps.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 py-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                      style={{ background: 'rgba(110,218,44,0.12)', color: '#6eda2c' }}>{i + 1}</span>
                    <span className="text-[9px] flex-shrink-0">{TASK_TYPE_ICONS[getTaskType(pb.category, s.assigneeRole)]}</span>
                    <span className="flex-1 text-xs text-text">{s.title}</span>
                    <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#60a5fa' }}>
                      <Clock size={10} />d{s.daysAfter}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: (ROLE_COLORS[s.assigneeRole] || '#8890b5') + '18', color: ROLE_COLORS[s.assigneeRole] || '#8890b5' }}>
                      {ROLE_LABELS[s.assigneeRole] || s.assigneeRole}
                    </span>
                  </div>
                ))}
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

// ── Main ───────────────────────────────────────────────────────
export default function Playbooks() {
  const { erpClients, collaborators, addTask } = useData()
  const [playbooks,     setPlaybooks]     = useState(initPlaybooks)
  const [modal,         setModal]         = useState(null)   // null | 'new' | playbook obj
  const [vincularPb,    setVincularPb]    = useState(null)   // playbook a vincular
  const [filter,        setFilter]        = useState('Todos')

  const categories = ['Todos', ...CATEGORIES]
  const filtered   = filter === 'Todos' ? playbooks : playbooks.filter(p => p.category === filter)
  const activeCount = playbooks.filter(p => p.active).length

  function saveAll(updated) { setPlaybooks(updated); save(updated) }

  function handleSave(form) {
    const existing = playbooks.find(p => p.id === form.id)
    saveAll(existing ? playbooks.map(p => p.id === form.id ? form : p) : [...playbooks, form])
    setModal(null)
  }

  async function handleVincular(taskData) {
    await addTask(taskData)
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-text">Playbooks</h1>
          <p className="text-sm text-muted mt-0.5">{activeCount} playbooks ativos · POPs e processos da agência</p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
          <Plus size={15} /> Novo Playbook
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === c
              ? { background: CAT_COLORS[c] || '#6eda2c', color: '#fff' }
              : { background: '#fff', color: '#8890b5', border: '1px solid #e2e5f0' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(pb => (
            <PlaybookCard key={pb.id} pb={pb}
              onEdit={p => setModal(p)}
              onDuplicate={p => saveAll([...playbooks, { ...p, id: 'pb_' + Date.now(), title: p.title + ' (cópia)', createdAt: new Date().toISOString().slice(0, 10) }])}
              onDelete={id => saveAll(playbooks.filter(p => p.id !== id))}
              onVincular={p => setVincularPb(p)}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">Nenhum playbook nesta categoria.</p>
          </div>
        )}
      </div>

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
