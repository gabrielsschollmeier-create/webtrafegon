-- ============================================================
-- TráfegOn Suite — Schema completo de produção
-- Execute no Supabase SQL Editor (substitui o schema anterior)
-- ============================================================

-- ── Extensões ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- CRM
-- ============================================================

-- Pipelines
create table if not exists public.pipelines (
  id          serial primary key,
  name        text not null,
  created_at  timestamptz default now()
);

-- Estágios do pipeline
create table if not exists public.pipeline_stages (
  id          text primary key,
  pipeline_id int references public.pipelines(id) on delete cascade,
  label       text not null,
  color       text not null default '#8890b5',
  order_index int not null default 0,
  created_at  timestamptz default now()
);

-- Leads / Contatos
create table if not exists public.leads (
  id          bigserial primary key,
  name        text not null,
  phone       text,
  source      text,
  stage_id    text references public.pipeline_stages(id),
  pipeline_id int references public.pipelines(id),
  value       numeric(10,2) default 0,
  assignee    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Atividades CRM
create table if not exists public.activities (
  id          bigserial primary key,
  lead_id     bigint references public.leads(id) on delete cascade,
  type        text not null check (type in ('call','meeting','follow')),
  description text not null,
  due_date    date,
  time        text,
  done        boolean default false,
  created_at  timestamptz default now()
);

-- Notas de contato
create table if not exists public.lead_notes (
  id          bigserial primary key,
  lead_id     bigint references public.leads(id) on delete cascade,
  text        text not null,
  author      text,
  created_at  timestamptz default now()
);

-- Conversas / Mensagens
create table if not exists public.conversations (
  id          bigserial primary key,
  lead_id     bigint references public.leads(id) on delete cascade,
  platform    text default 'whatsapp',
  unread      int default 0,
  updated_at  timestamptz default now()
);

create table if not exists public.messages (
  id              bigserial primary key,
  conversation_id bigint references public.conversations(id) on delete cascade,
  text            text not null,
  direction       text not null check (direction in ('in','out')),
  date            date,
  time            text,
  is_file         boolean default false,
  read            boolean default false,
  created_at      timestamptz default now()
);

-- ============================================================
-- ERP
-- ============================================================

-- Clientes (workspaces)
create table if not exists public.erp_clients (
  id            text primary key,
  name          text not null,
  color         text default '#6eda2c',
  manager_id    text,
  status        text default 'active' check (status in ('active','at_risk','inactive')),
  since         date,
  monthly_value numeric(10,2) default 0,
  niche         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Tarefas / Entregas
create table if not exists public.tasks (
  id          bigserial primary key,
  client_id   text references public.erp_clients(id) on delete cascade,
  title       text not null,
  type        text not null check (type in ('lp','criativo','campanha','copy','video','reuniao')),
  status      text default 'todo' check (status in ('todo','doing','review','done')),
  priority    text default 'medium' check (priority in ('low','medium','high')),
  assignee    text,
  due_date    date,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Reuniões
create table if not exists public.meetings (
  id          bigserial primary key,
  client_id   text references public.erp_clients(id) on delete cascade,
  title       text not null,
  date        date not null,
  time        text,
  duration    int default 60,
  attendees   text[],
  type        text default 'general',
  created_at  timestamptz default now()
);

-- Marcos (linha do tempo)
create table if not exists public.milestones (
  id          bigserial primary key,
  client_id   text references public.erp_clients(id) on delete cascade,
  date        date not null,
  type        text not null,
  title       text not null,
  description text,
  created_at  timestamptz default now()
);

-- ============================================================
-- GAMIFICAÇÃO / EQUIPE
-- ============================================================

-- Colaboradores
create table if not exists public.collaborators (
  id                text primary key,
  name              text not null,
  email             text,
  role_title        text,
  avatar            text,
  color             text default '#6eda2c',
  level             int default 1,
  rank              text default 'Rising Star',
  xp                int default 0,
  xp_to_next        int default 1000,
  streak            int default 0,
  tasks_completed   int default 0,
  tasks_this_month  int default 0,
  since             date,
  badges            text[],
  months            int default 1,
  carteira          numeric(10,2) default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- XP / Progresso diário do usuário logado
create table if not exists public.user_stats (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  level               int default 1,
  rank                text default 'Bronze Closer',
  xp                  int default 0,
  xp_to_next          int default 1000,
  streak              int default 0,
  last_streak_date    date,
  daily_contacted     int default 0,
  daily_target        int default 10,
  weekly_deals_done   int default 0,
  weekly_deals_target int default 5,
  updated_at          timestamptz default now()
);

-- Conquistas do usuário
create table if not exists public.user_achievements (
  id           bigserial primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  achievement  text not null,
  earned_at    timestamptz default now(),
  unique (user_id, achievement)
);

-- Relatórios mensais (dados calculados / salvos)
create table if not exists public.monthly_stats (
  id          bigserial primary key,
  mes         text not null,
  year        int not null,
  leads       int default 0,
  fechados    int default 0,
  receita     numeric(10,2) default 0,
  unique (mes, year)
);

-- ============================================================
-- RLS — Habilitar em todas as tabelas
-- ============================================================

alter table public.pipelines        enable row level security;
alter table public.pipeline_stages  enable row level security;
alter table public.leads            enable row level security;
alter table public.activities       enable row level security;
alter table public.lead_notes       enable row level security;
alter table public.conversations    enable row level security;
alter table public.messages         enable row level security;
alter table public.erp_clients      enable row level security;
alter table public.tasks            enable row level security;
alter table public.meetings         enable row level security;
alter table public.milestones       enable row level security;
alter table public.collaborators    enable row level security;
alter table public.user_stats       enable row level security;
alter table public.user_achievements enable row level security;
alter table public.monthly_stats    enable row level security;

-- ── Políticas: usuários autenticados lêem tudo ──────────────
do $$ declare t text; begin
  foreach t in array array[
    'pipelines','pipeline_stages','leads','activities','lead_notes',
    'conversations','messages','erp_clients','tasks','meetings',
    'milestones','collaborators','monthly_stats'
  ] loop
    execute format('drop policy if exists "authed_read" on public.%I', t);
    execute format(
      'create policy "authed_read" on public.%I for select to authenticated using (true)', t
    );
    execute format('drop policy if exists "authed_write" on public.%I', t);
    execute format(
      'create policy "authed_write" on public.%I for all to authenticated using (true) with check (true)', t
    );
  end loop;
end $$;

-- user_stats: cada usuário acessa/modifica apenas o seu
drop policy if exists "own_stats" on public.user_stats;
create policy "own_stats" on public.user_stats
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_achievements" on public.user_achievements;
create policy "own_achievements" on public.user_achievements
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- REALTIME — Habilitar nas tabelas que precisam de live update
-- ============================================================

drop publication if exists supabase_realtime;
create publication supabase_realtime for table
  public.leads,
  public.activities,
  public.tasks,
  public.messages,
  public.conversations,
  public.meetings,
  public.erp_clients,
  public.user_stats,
  public.collaborators;

-- ============================================================
-- SEED — Dados iniciais (migração do mock)
-- ============================================================

-- Pipelines
insert into public.pipelines (id, name) values
  (1, 'Aquisição'),
  (2, 'Retenção')
on conflict (id) do nothing;

-- Estágios
insert into public.pipeline_stages (id, pipeline_id, label, color, order_index) values
  ('novo',        1, 'Novo Lead',        '#8890b5', 0),
  ('contato',     1, 'Contato feito',    '#60a5fa', 1),
  ('qualificado', 1, 'Qualificado',      '#be29ec', 2),
  ('proposta',    1, 'Proposta enviada', '#ea8a29', 3),
  ('fechado',     1, 'Fechado',          '#6eda2c', 4),
  ('ativo',       2, 'Cliente Ativo',    '#6eda2c', 0),
  ('risco',       2, 'Em Risco',         '#ea8a29', 1),
  ('reengaja',    2, 'Reengajamento',    '#be29ec', 2),
  ('churn',       2, 'Churn',            '#ef4444', 3)
on conflict (id) do nothing;

-- Leads
insert into public.leads (id, name, phone, source, stage_id, pipeline_id, value, assignee, created_at) values
  (1,  'Livianne Alcântara',  '+5547999990001', 'WhatsApp',        'novo',        1, 0,    'GS', '2026-05-10'),
  (2,  'RT Publicidade',      '+5547999990002', 'Meta Ads',        'novo',        1, 0,    'GS', '2026-05-11'),
  (3,  'Marcos Teixeira',     '+5548991234567', 'WhatsApp',        'novo',        1, 0,    'GS', '2026-05-12'),
  (12, 'Mariana Costa',       '+5547999990012', 'Google Ads',      'novo',        1, 0,    'GS', '2026-05-13'),
  (13, 'Pedro Alves',         '+5547999990013', 'Meta Formulário', 'novo',        1, 0,    'GS', '2026-05-14'),
  (4,  'Dr. Paulo Varejão',   '+5547999990004', 'Meta Formulário', 'contato',     1, 0,    'GS', '2026-05-08'),
  (5,  'Morando Advocacia',   '+5547999990005', 'Orgânico',        'contato',     1, 0,    'JC', '2026-05-09'),
  (6,  'Luciano Sordi',       '+5547999990006', 'Lista de leads',  'contato',     1, 0,    'JC', '2026-05-07'),
  (14, 'Simoni Semi Jóias',   '+5547999990014', 'WhatsApp',        'contato',     1, 0,    'GS', '2026-05-06'),
  (7,  'Francine Baenea',     '+5547999990007', 'Meta Formulário', 'qualificado', 1, 1870, 'GS', '2026-05-06'),
  (15, 'Carlos Mendes',       '+5547999990015', 'Meta Ads',        'qualificado', 1, 2500, 'JC', '2026-05-05'),
  (8,  'Luís Henrique',       '+5547999990008', 'WhatsApp',        'proposta',    1, 1870, 'GS', '2026-05-05'),
  (9,  'Larissa A.',          '+5547999990009', 'Meta Ads',        'proposta',    1, 1870, 'JC', '2026-05-04'),
  (10, 'Alexandre',           '+5547999990010', 'WhatsApp',        'proposta',    1, 1870, 'JC', '2026-05-03'),
  (11, 'Graça',               '+5547999990011', 'Indicação',       'fechado',     1, 3370, 'GS', '2026-05-01'),
  (16, 'Alexandre Faria',     '+5547999990016', 'Google Ads',      'fechado',     1, 1870, 'GS', '2026-05-02'),
  (20, 'Cooperja',            '+5547991110001', 'Cliente',         'ativo',       2, 4500, 'GS', '2026-01-10'),
  (21, 'Posto Rizzotto',      '+5547991110002', 'Cliente',         'ativo',       2, 3200, 'GS', '2026-02-05'),
  (22, 'Kamy',                '+5547991110003', 'Cliente',         'ativo',       2, 2800, 'JC', '2026-01-20'),
  (23, 'Ararastur',           '+5547991110004', 'Cliente',         'risco',       2, 1900, 'GS', '2025-11-15'),
  (24, 'Caçarola',            '+5547991110005', 'Cliente',         'risco',       2, 2200, 'GS', '2025-12-01'),
  (25, 'Intime Sistemas',     '+5547991110006', 'Cliente',         'reengaja',    2, 3500, 'JC', '2025-10-20'),
  (26, 'Polizio Advogados',   '+5547991110007', 'Cliente',         'churn',       2, 0,    'GS', '2025-09-01')
on conflict (id) do nothing;

-- Atividades
insert into public.activities (id, lead_id, type, description, due_date, time, done) values
  (1, 4,  'call',    'Ligar para apresentar proposta',    '2026-05-19', '09:00', false),
  (2, 7,  'meeting', 'Reunião de demonstração',           '2026-05-20', '14:00', false),
  (3, 8,  'follow',  'Follow-up da proposta enviada',     '2026-05-18', '10:30', false),
  (4, 11, 'call',    'Onboarding inicial',                '2026-05-15', '11:00', true),
  (5, 15, 'follow',  'Verificar interesse após proposta', '2026-05-19', '16:00', false),
  (6, 23, 'call',    'Conversa de retenção — Ararastur',  '2026-05-20', '09:30', false),
  (7, 24, 'meeting', 'Reunião de revisão — Caçarola',     '2026-05-21', '15:00', false),
  (8, 9,  'follow',  'Acompanhar análise da proposta',    '2026-05-22', '10:00', false)
on conflict (id) do nothing;

-- Clientes ERP
insert into public.erp_clients (id, name, color, manager_id, status, since, monthly_value, niche) values
  ('cooperja',  'Cooperja',          '#6eda2c', 'gs', 'active',  '2026-01-10', 4500, 'Cooperativa'),
  ('rizzotto',  'Posto Rizzotto',    '#60a5fa', 'gs', 'active',  '2026-02-05', 3200, 'Combustível'),
  ('kamy',      'Kamy',              '#be29ec', 'jc', 'active',  '2026-01-20', 2800, 'Moda'),
  ('ararastur', 'Ararastur',         '#ea8a29', 'gs', 'at_risk', '2025-11-15', 1900, 'Turismo'),
  ('cacarola',  'Caçarola',          '#f87171', 'gs', 'at_risk', '2025-12-01', 2200, 'Alimentação'),
  ('intime',    'Intime Sistemas',   '#a78bfa', 'jc', 'active',  '2025-10-20', 3500, 'Software'),
  ('polizio',   'Polizio Advogados', '#34d399', 'am', 'active',  '2026-03-01', 2800, 'Advocacia')
on conflict (id) do nothing;

-- Tarefas
insert into public.tasks (id, client_id, type, title, assignee, status, priority, due_date, description) values
  (1,  'cooperja',  'lp',       'LP Safra 2026',               'gs', 'doing',  'high',   '2026-05-28', 'Landing page para campanha de safra'),
  (2,  'cooperja',  'criativo', 'Banner Facebook — Cooperja',  'jc', 'review', 'medium', '2026-05-22', '5 variações criativo feed + stories'),
  (3,  'cooperja',  'campanha', 'Setup Meta Ads Safra',        'gs', 'todo',   'high',   '2026-05-30', 'Estruturar campanhas Meta Ads para safra'),
  (4,  'cooperja',  'copy',     'Textos LP Safra',             'am', 'done',   'high',   '2026-05-20', 'Copy completa para LP de safra'),
  (5,  'cooperja',  'reuniao',  'Reunião mensal Cooperja',     'gs', 'todo',   'low',    '2026-06-02', 'Apresentação de resultados mensais'),
  (6,  'rizzotto',  'criativo', 'Artes Promoção Combustível',  'jc', 'doing',  'high',   '2026-05-23', 'Criativos para promoção semanal'),
  (7,  'rizzotto',  'campanha', 'Google Ads — Posto Rizzotto', 'rf', 'doing',  'medium', '2026-05-25', 'Campanhas Google Search local'),
  (8,  'rizzotto',  'copy',     'Copy Stories Instagram',      'am', 'todo',   'low',    '2026-05-26', 'Legendas e CTAs para stories semanais'),
  (9,  'rizzotto',  'reuniao',  'Review de Performance',       'gs', 'done',   'medium', '2026-05-18', 'Reunião de revisão mensal'),
  (10, 'kamy',      'lp',       'LP Coleção Inverno 2026',     'jc', 'review', 'high',   '2026-05-24', 'Landing page coleção inverno'),
  (11, 'kamy',      'video',    'Edição Reels Kamy',           'jc', 'todo',   'medium', '2026-05-27', '3 Reels para lançamento de coleção'),
  (12, 'kamy',      'criativo', 'Feed Instagram — Inverno',    'jc', 'doing',  'high',   '2026-05-22', 'Grid planejado para o mês de junho'),
  (13, 'kamy',      'campanha', 'Meta Ads Inverno',            'gs', 'todo',   'high',   '2026-05-29', 'Campanha lançamento coleção inverno'),
  (14, 'ararastur', 'criativo', 'Artes Pacotes de Verão',      'jc', 'todo',   'medium', '2026-06-01', 'Criativos para pacotes de viagem'),
  (15, 'ararastur', 'copy',     'Emails Retenção Ararastur',   'am', 'doing',  'high',   '2026-05-23', 'Sequência de emails para reativar cliente'),
  (16, 'ararastur', 'reuniao',  'Reunião Retenção Urgente',    'gs', 'todo',   'high',   '2026-05-21', 'Alinhamento para reverter situação de risco'),
  (17, 'cacarola',  'lp',       'LP Cardápio Digital',         'gs', 'todo',   'medium', '2026-06-05', 'LP com cardápio e delivery'),
  (18, 'cacarola',  'video',    'Reels Prato do Dia',          'jc', 'doing',  'medium', '2026-05-25', 'Edição de 4 reels semanais'),
  (19, 'intime',    'lp',       'LP Demo do Sistema',          'gs', 'review', 'high',   '2026-05-26', 'LP para captação de demos do software'),
  (20, 'intime',    'copy',     'Copy LinkedIn Intime',        'am', 'done',   'medium', '2026-05-19', 'Posts LinkedIn para geração de leads B2B'),
  (21, 'intime',    'campanha', 'Google Ads B2B Intime',       'rf', 'doing',  'high',   '2026-05-28', 'Campanhas Search para demo do software'),
  (22, 'polizio',   'criativo', 'Artes Direito Trabalhista',   'jc', 'done',   'medium', '2026-05-18', 'Posts informativos sobre direitos'),
  (23, 'polizio',   'copy',     'Copy Posts Jurídicos',        'am', 'review', 'medium', '2026-05-22', 'Textos educativos para Instagram'),
  (24, 'polizio',   'campanha', 'Meta Ads Polizio',            'rf', 'todo',   'low',    '2026-06-01', 'Campanha de captação de leads jurídicos')
on conflict (id) do nothing;

-- Reuniões
insert into public.meetings (id, client_id, title, date, time, duration, attendees, type) values
  (1, 'cooperja',  'Reunião mensal Cooperja',   '2026-06-02', '10:00', 60,  array['gs'],           'monthly_review'),
  (2, 'rizzotto',  'Review de Performance',     '2026-05-28', '14:00', 45,  array['gs','rf'],      'performance'),
  (3, 'ararastur', 'Reunião Retenção Urgente',  '2026-05-21', '09:00', 60,  array['gs'],           'retention'),
  (4, 'kamy',      'Kickoff Coleção Inverno',   '2026-05-23', '11:00', 90,  array['gs','jc','am'], 'kickoff'),
  (5, 'intime',    'Alinhamento B2B Intime',    '2026-05-29', '15:00', 60,  array['gs','rf'],      'alignment')
on conflict (id) do nothing;

-- Colaboradores
insert into public.collaborators (id, name, email, role_title, avatar, color, level, rank, xp, xp_to_next, streak, tasks_completed, tasks_this_month, since, badges, months, carteira) values
  ('gs', 'Gabriel S.', 'gabriel@trafegon.com.br', 'Gestor de Tráfego', 'GS', '#6eda2c', 3, 'Gold Closer',    2840, 4000, 7, 47, 12, '2025-01-10', array['🏆','⚡','🎯'], 16, 22900),
  ('jc', 'João C.',    'joao@trafegon.com.br',    'Designer',          'JC', '#be29ec', 2, 'Silver Maker',   1680, 2500, 3, 31,  8, '2025-04-15', array['🎨','✨'],      13, 10500),
  ('am', 'Ana M.',     'ana@trafegon.com.br',      'Copywriter',        'AM', '#ea8a29', 2, 'Bronze Writer',  1200, 2500, 5, 28,  9, '2025-06-01', array['✍️','🔥'],     11,  8300),
  ('rf', 'Rafael F.',  'rafael@trafegon.com.br',  'Gestor de Tráfego', 'RF', '#60a5fa', 1, 'Rising Star',    540,  1000, 1, 14,  4, '2026-02-01', array['🚀'],           3,  5700)
on conflict (id) do nothing;

-- Marcos / Linha do tempo
insert into public.milestones (id, client_id, date, type, title, description) values
  (1,  'cooperja',  '2026-01-10', 'kickoff',   'Kickoff Cooperja',        'Início da parceria, alinhamento estratégico'),
  (2,  'cooperja',  '2026-02-01', 'lp',        'LP Institucional live',   'Landing page institucional no ar'),
  (3,  'cooperja',  '2026-02-15', 'campanha',  'Meta Ads ativos',         'Campanhas de tráfego pago ativadas'),
  (4,  'cooperja',  '2026-03-05', 'revisao',   'Revisão março',           'Apresentação de resultados do 1º mês'),
  (5,  'cooperja',  '2026-04-10', 'revisao',   'Revisão abril',           'Ajustes de campanha e novos criativos'),
  (6,  'cooperja',  '2026-05-28', 'lp',        'LP Safra 2026',           'Landing page da campanha de safra'),
  (9,  'rizzotto',  '2026-02-05', 'kickoff',   'Kickoff Rizzotto',        'Início da parceria'),
  (10, 'rizzotto',  '2026-02-20', 'campanha',  'Google Ads local',        'Search para combustível e conveniência'),
  (11, 'rizzotto',  '2026-03-15', 'revisao',   'Revisão março',           'Performance do 1º mês'),
  (12, 'rizzotto',  '2026-05-18', 'revisao',   'Revisão maio',            'Ajuste de campanhas'),
  (14, 'kamy',      '2026-01-20', 'kickoff',   'Kickoff Kamy',            'Início da parceria de moda'),
  (15, 'kamy',      '2026-02-10', 'campanha',  'Coleção Verão ativa',     'Campanhas de verão ativadas'),
  (16, 'kamy',      '2026-03-20', 'revisao',   'Review Verão',            'Resultados da temporada'),
  (17, 'kamy',      '2026-05-23', 'kickoff',   'Kickoff Inverno',         'Briefing coleção inverno'),
  (20, 'ararastur', '2025-11-15', 'kickoff',   'Kickoff Ararastur',       'Início da parceria de turismo'),
  (21, 'ararastur', '2025-12-10', 'campanha',  'Campanhas de verão',      'Meta Ads para pacotes de viagem'),
  (22, 'ararastur', '2026-02-01', 'revisao',   'Review pós-verão',        'Análise da temporada'),
  (23, 'ararastur', '2026-04-15', 'alerta',    'Alerta de churn',         'Cliente em risco — ação necessária'),
  (24, 'ararastur', '2026-05-21', 'revisao',   'Reunião de retenção',     'Reunião emergencial'),
  (25, 'cacarola',  '2025-12-01', 'kickoff',   'Kickoff Caçarola',        'Início da parceria gastronômica'),
  (26, 'cacarola',  '2026-01-15', 'campanha',  'Meta Ads delivery',       'Campanhas delivery e local'),
  (27, 'cacarola',  '2026-03-01', 'revisao',   'Revisão Q1',              'Revisão do primeiro trimestre'),
  (28, 'cacarola',  '2026-04-20', 'alerta',    'LP atrasada',             'Prazo vencido para LP Cardápio Digital'),
  (29, 'intime',    '2025-10-20', 'kickoff',   'Kickoff Intime',          'Início da parceria B2B'),
  (30, 'intime',    '2025-11-10', 'campanha',  'Google Ads B2B',          'Search B2B ativo'),
  (31, 'intime',    '2026-01-15', 'revisao',   'Revisão Q4 2025',         'Resultados do último trimestre'),
  (32, 'intime',    '2026-03-20', 'revisao',   'Revisão Q1 2026',         'Resultados do 1º trimestre'),
  (33, 'intime',    '2026-05-26', 'lp',        'LP Demo (revisão)',       'LP captação de demos em aprovação'),
  (35, 'polizio',   '2026-03-01', 'kickoff',   'Kickoff Polizio',         'Início da parceria com advocacia'),
  (36, 'polizio',   '2026-03-20', 'campanha',  'Meta Ads jurídico',       'Campanhas de captação'),
  (37, 'polizio',   '2026-04-25', 'revisao',   'Revisão abril',           'Resultados do primeiro mês')
on conflict (id) do nothing;

-- Stats mensais (para relatórios)
insert into public.monthly_stats (mes, year, leads, fechados, receita) values
  ('Dez', 2025, 28, 4,  7200),
  ('Jan', 2026, 34, 6,  9800),
  ('Fev', 2026, 41, 7,  11400),
  ('Mar', 2026, 52, 9,  15200),
  ('Abr', 2026, 48, 8,  13800),
  ('Mai', 2026, 61, 10, 18600)
on conflict (mes, year) do nothing;

-- ============================================================
-- TRIGGERS — atualizar updated_at automaticamente
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ declare t text; begin
  foreach t in array array['leads','erp_clients','tasks','collaborators','user_stats'] loop
    execute format('drop trigger if exists trg_updated_at on public.%I', t);
    execute format(
      'create trigger trg_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end $$;

-- ============================================================
-- Confirmar
-- ============================================================
select
  (select count(*) from public.leads)         as leads,
  (select count(*) from public.tasks)         as tasks,
  (select count(*) from public.erp_clients)   as clients,
  (select count(*) from public.meetings)      as meetings,
  (select count(*) from public.collaborators) as collaborators,
  (select count(*) from public.milestones)    as milestones;
