-- ============================================================
-- TráfegOn Suite — Setup completo do banco de dados
-- Cole este SQL no Supabase → SQL Editor → Run
-- ============================================================

-- 1. TABELAS DE AUTENTICAÇÃO / PERFIS
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text,
  role text not null default 'colaborador',
  avatar text,
  color text default '#6eda2c',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated using (true);
create policy "profiles_update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Trigger: cria perfil automaticamente ao criar usuário no Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, avatar, color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'admin'),
    coalesce(new.raw_user_meta_data->>'avatar', upper(substring(split_part(new.email, '@', 1), 1, 2))),
    coalesce(new.raw_user_meta_data->>'color', '#6eda2c')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CRM — PIPELINES E ESTÁGIOS
-- ============================================================
create table if not exists public.pipelines (
  id serial primary key,
  name text not null
);
alter table public.pipelines enable row level security;
drop policy if exists "pipelines_all" on public.pipelines;
create policy "pipelines_all" on public.pipelines for all to authenticated using (true) with check (true);

create table if not exists public.pipeline_stages (
  id text primary key,
  label text not null,
  color text,
  pipeline_id integer references public.pipelines(id),
  order_index integer default 0
);
alter table public.pipeline_stages enable row level security;
drop policy if exists "stages_all" on public.pipeline_stages;
create policy "stages_all" on public.pipeline_stages for all to authenticated using (true) with check (true);

-- 3. CRM — LEADS
-- ============================================================
create table if not exists public.leads (
  id serial primary key,
  name text not null,
  phone text,
  source text,
  stage_id text references public.pipeline_stages(id),
  pipeline_id integer references public.pipelines(id),
  value numeric default 0,
  assignee text,
  created_at timestamptz default now()
);
alter table public.leads enable row level security;
drop policy if exists "leads_all" on public.leads;
create policy "leads_all" on public.leads for all to authenticated using (true) with check (true);

-- 4. CRM — ATIVIDADES
-- ============================================================
create table if not exists public.activities (
  id serial primary key,
  lead_id integer,
  type text,
  description text,
  due_date date,
  time text,
  done boolean default false,
  created_at timestamptz default now()
);
alter table public.activities enable row level security;
drop policy if exists "activities_all" on public.activities;
create policy "activities_all" on public.activities for all to authenticated using (true) with check (true);

-- 5. ERP — CLIENTES
-- ============================================================
create table if not exists public.erp_clients (
  id text primary key,
  name text not null,
  color text,
  manager_id text,
  status text default 'active',
  since date,
  monthly_value numeric default 0,
  niche text
);
alter table public.erp_clients enable row level security;
drop policy if exists "erp_clients_all" on public.erp_clients;
create policy "erp_clients_all" on public.erp_clients for all to authenticated using (true) with check (true);

-- 6. ERP — TAREFAS / ENTREGAS
-- ============================================================
create table if not exists public.tasks (
  id serial primary key,
  client_id text references public.erp_clients(id),
  type text,
  title text not null,
  status text default 'todo',
  priority text default 'medium',
  assignee text,
  due_date date,
  description text,
  created_at timestamptz default now()
);
alter table public.tasks enable row level security;
drop policy if exists "tasks_all" on public.tasks;
create policy "tasks_all" on public.tasks for all to authenticated using (true) with check (true);

-- 7. ERP — COLABORADORES
-- ============================================================
create table if not exists public.collaborators (
  id text primary key,
  name text not null,
  email text,
  role text,
  avatar text,
  color text,
  level integer default 1,
  rank text,
  xp integer default 0,
  xp_to_next integer default 1000,
  streak integer default 0,
  tasks_completed integer default 0,
  tasks_this_month integer default 0,
  since date,
  badges text[] default '{}',
  deliveries_by_type jsonb default '{}'
);
alter table public.collaborators enable row level security;
drop policy if exists "collaborators_all" on public.collaborators;
create policy "collaborators_all" on public.collaborators for all to authenticated using (true) with check (true);

-- 8. ERP — REUNIÕES
-- ============================================================
create table if not exists public.meetings (
  id serial primary key,
  client_id text references public.erp_clients(id),
  title text,
  date date,
  time text,
  duration integer,
  attendees text[] default '{}',
  type text,
  created_at timestamptz default now()
);
alter table public.meetings enable row level security;
drop policy if exists "meetings_all" on public.meetings;
create policy "meetings_all" on public.meetings for all to authenticated using (true) with check (true);

-- 9. ERP — MARCOS (TIMELINE)
-- ============================================================
create table if not exists public.milestones (
  id serial primary key,
  client_id text references public.erp_clients(id),
  date date,
  type text,
  title text,
  description text
);
alter table public.milestones enable row level security;
drop policy if exists "milestones_all" on public.milestones;
create policy "milestones_all" on public.milestones for all to authenticated using (true) with check (true);

-- 10. RELATÓRIOS — STATS MENSAIS
-- ============================================================
create table if not exists public.monthly_stats (
  id serial primary key,
  mes text,
  year integer default 2026,
  leads integer default 0,
  fechados integer default 0,
  receita numeric default 0
);
alter table public.monthly_stats enable row level security;
drop policy if exists "monthly_stats_all" on public.monthly_stats;
create policy "monthly_stats_all" on public.monthly_stats for all to authenticated using (true) with check (true);

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

-- Pipelines
insert into public.pipelines (id, name) values
  (1, 'Aquisição'),
  (2, 'Retenção')
on conflict do nothing;

-- Estágios
insert into public.pipeline_stages (id, label, color, pipeline_id, order_index) values
  ('novo',        'Novo Lead',        '#8890b5', 1, 1),
  ('contato',     'Contato feito',    '#60a5fa', 1, 2),
  ('qualificado', 'Qualificado',      '#be29ec', 1, 3),
  ('proposta',    'Proposta enviada', '#ea8a29', 1, 4),
  ('ganho',       'Ganho ✓',          '#6eda2c', 1, 5),
  ('perdido',     'Perdido ✗',        '#ef4444', 1, 6),
  ('ativo',       'Cliente Ativo',    '#6eda2c', 2, 1),
  ('risco',       'Em Risco',         '#ea8a29', 2, 2),
  ('reengaja',    'Reengajamento',    '#be29ec', 2, 3),
  ('churn',       'Churn',            '#ef4444', 2, 4)
on conflict do nothing;

-- Clientes ERP
insert into public.erp_clients (id, name, color, manager_id, status, since, monthly_value, niche) values
  ('cooperja',      'Cooperja',             '#6eda2c', 'gs', 'active',  '2026-01-10', 4500, 'Cooperativa'),
  ('rizzotto',      'Posto Rizzotto',        '#60a5fa', 'gs', 'active',  '2026-02-05', 3200, 'Combustível'),
  ('kamy',          'Kamy',                  '#be29ec', 'jc', 'active',  '2026-01-20', 2800, 'Moda'),
  ('intime',        'Intime Sistemas',        '#a78bfa', 'jc', 'active',  '2025-10-20', 3500, 'Software'),
  ('kinto',         'Kinto Sistemas',         '#f59e0b', 'gs', 'active',  '2025-09-01', 3200, 'Software'),
  ('carol_adv',     'Carol Adv',              '#f43f5e', 'am', 'active',  '2025-08-15', 2500, 'Advocacia'),
  ('polizio',       'Polizio Advogados',      '#34d399', 'am', 'active',  '2026-03-01', 2800, 'Advocacia'),
  ('pit_floripa',   'Pit Floripa',             '#fb923c', 'gs', 'active',  '2025-11-01', 2200, 'Alimentação'),
  ('cacarola',      'Caçarola',               '#f87171', 'gs', 'at_risk', '2025-12-01', 2200, 'Alimentação'),
  ('sitio_girabas', 'Sítio Girabas',          '#4ade80', 'jc', 'active',  '2025-07-10', 1800, 'Turismo'),
  ('ararastur',     'Ararastur',               '#ea8a29', 'gs', 'at_risk', '2025-11-15', 1900, 'Turismo'),
  ('gabriel_piva',  'Gabriel Piva Advocacia', '#818cf8', 'am', 'active',  '2026-01-05', 1800, 'Advocacia'),
  ('quadros',       'Quadros Paisagismo',     '#2dd4bf', 'jc', 'active',  '2025-10-15', 1500, 'Paisagismo')
on conflict do nothing;

-- Colaboradores
insert into public.collaborators (id, name, email, role, avatar, color, level, rank, xp, xp_to_next, streak, tasks_completed, tasks_this_month, since, badges, deliveries_by_type) values
  ('gs', 'Gabriel S.', 'gabrielsschollmeier@gmail.com', 'Gestor de Tráfego', 'GS', '#6eda2c', 3, 'Gold Closer',   2840, 4000, 7, 47, 12, '2025-01-10', '{"🏆","⚡","🎯"}', '{"lp":4,"criativo":2,"campanha":8,"copy":3,"video":1,"reuniao":6}'),
  ('jc', 'João C.',    'joao@trafegon.com.br',          'Designer',          'JC', '#be29ec', 2, 'Silver Maker',  1680, 2500, 3, 31, 8,  '2025-04-15', '{"🎨","✨"}',       '{"lp":6,"criativo":12,"campanha":0,"copy":1,"video":3,"reuniao":4}'),
  ('am', 'Ana M.',     'ana@trafegon.com.br',            'Copywriter',        'AM', '#ea8a29', 2, 'Bronze Writer', 1200, 2500, 5, 28, 9,  '2025-06-01', '{"✍️","🔥"}',     '{"lp":2,"criativo":0,"campanha":0,"copy":18,"video":0,"reuniao":3}'),
  ('rf', 'Rafael F.',  'rafael@trafegon.com.br',         'Gestor de Tráfego', 'RF', '#60a5fa', 1, 'Rising Star',   540,  1000, 1, 14, 4,  '2026-02-01', '{"🚀"}',           '{"lp":1,"criativo":0,"campanha":4,"copy":2,"video":0,"reuniao":2}')
on conflict do nothing;

-- Tarefas ERP
insert into public.tasks (client_id, type, title, status, priority, assignee, due_date, description) values
  ('cooperja',  'lp',       'LP Safra 2026',               'doing',  'high',   'gs', '2026-05-28', 'Landing page para campanha de safra'),
  ('rizzotto',  'campanha', 'Google Ads — Posto Rizzotto',  'doing',  'medium', 'rf', '2026-05-25', 'Campanhas Google Search local'),
  ('kamy',      'criativo', 'Feed Instagram — Inverno',     'doing',  'high',   'jc', '2026-05-22', 'Grid planejado para o mês de junho'),
  ('ararastur', 'reuniao',  'Reunião Retenção Urgente',     'todo',   'high',   'gs', '2026-05-21', 'Alinhamento para reverter situação de risco'),
  ('cacarola',  'lp',       'LP Cardápio Digital',          'todo',   'medium', 'gs', '2026-06-05', 'LP com cardápio e delivery'),
  ('intime',    'campanha', 'Google Ads B2B Intime',        'doing',  'high',   'rf', '2026-05-28', 'Campanhas Search para demo do software'),
  ('polizio',   'criativo', 'Artes Direito Trabalhista',    'done',   'medium', 'jc', '2026-05-18', 'Posts informativos sobre direitos')
on conflict do nothing;

-- Reuniões
insert into public.meetings (client_id, title, date, time, duration, attendees, type) values
  ('cooperja', 'Reunião mensal Cooperja', '2026-06-02', '10:00', 60, '{"gs"}', 'monthly_review')
on conflict do nothing;

-- Marcos
insert into public.milestones (client_id, date, type, title, description) values
  ('cooperja',  '2026-01-10', 'kickoff', 'Kickoff Cooperja',  'Início da parceria, alinhamento estratégico'),
  ('rizzotto',  '2026-02-05', 'kickoff', 'Kickoff Rizzotto',  'Início da parceria'),
  ('kamy',      '2026-01-20', 'kickoff', 'Kickoff Kamy',      'Início da parceria de moda'),
  ('ararastur', '2025-11-15', 'kickoff', 'Kickoff Ararastur', 'Início da parceria de turismo'),
  ('cacarola',  '2025-12-01', 'kickoff', 'Kickoff Caçarola',  'Início da parceria gastronômica'),
  ('intime',    '2025-10-20', 'kickoff', 'Kickoff Intime',    'Início da parceria B2B'),
  ('polizio',   '2026-03-01', 'kickoff', 'Kickoff Polizio',   'Início da parceria com advocacia')
on conflict do nothing;

-- Stats mensais
insert into public.monthly_stats (mes, year, leads, fechados, receita) values
  ('Jan', 2026, 18, 3, 9600),
  ('Fev', 2026, 24, 4, 12800),
  ('Mar', 2026, 21, 3, 9600),
  ('Abr', 2026, 31, 5, 16000),
  ('Mai', 2026, 28, 4, 12800)
on conflict do nothing;

-- Leads CRM
insert into public.leads (name, phone, source, stage_id, pipeline_id, value, assignee, created_at) values
  ('Livianne Alcântara', '+5547999990001', 'WhatsApp',       'novo',        1, 0,    'GS', '2026-05-10'),
  ('RT Publicidade',     '+5547999990002', 'Meta Ads',        'novo',        1, 0,    'GS', '2026-05-11'),
  ('Marcos Teixeira',    '+5548991234567', 'WhatsApp',        'novo',        1, 0,    'GS', '2026-05-12'),
  ('Dr. Paulo Varejão',  '+5547999990004', 'Meta Formulário', 'contato',     1, 0,    'GS', '2026-05-08'),
  ('Morando Advocacia',  '+5547999990005', 'Orgânico',        'contato',     1, 0,    'JC', '2026-05-09'),
  ('Francine Baenea',    '+5547999990007', 'Meta Formulário', 'qualificado', 1, 1870, 'GS', '2026-05-06'),
  ('Luís Henrique',      '+5547999990008', 'WhatsApp',        'proposta',    1, 1870, 'GS', '2026-05-05'),
  ('Graça',              '+5547999990011', 'Indicação',       'ganho',       1, 3370, 'GS', '2026-05-01'),
  ('Cooperja',           '+5547991110001', 'Cliente',         'ativo',       2, 4500, 'GS', '2026-01-10'),
  ('Posto Rizzotto',     '+5547991110002', 'Cliente',         'ativo',       2, 3200, 'GS', '2026-02-05'),
  ('Ararastur',          '+5547991110004', 'Cliente',         'risco',       2, 1900, 'GS', '2025-11-15'),
  ('Caçarola',           '+5547991110005', 'Cliente',         'risco',       2, 2200, 'GS', '2025-12-01')
on conflict do nothing;
