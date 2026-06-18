-- ============================================================
-- TON Learning System
-- Persiste conversas e insights extraídos automaticamente
-- pelo assistente IA (TON) para construir base de conhecimento.
-- ============================================================

-- Sessões completas de conversa com o TON
create table if not exists public.ton_conversations (
  id                  bigserial primary key,
  user_id             text,
  client_id           text,
  role                text,
  level               text,
  messages            jsonb not null default '[]',
  insights_extracted  boolean default false,
  created_at          timestamptz default now()
);

-- Insights extraídos de cada sessão
create table if not exists public.ton_insights (
  id                  bigserial primary key,
  conversation_id     bigint references public.ton_conversations(id) on delete set null,
  category            text not null,  -- 'estrategia' | 'duvida_comum' | 'ideia' | 'decisao' | 'problema_cliente'
  insight             text not null,
  tags                text[] default '{}',
  client_id           text,
  importance          smallint default 3 check (importance between 1 and 5),
  created_at          timestamptz default now()
);

-- Índices para buscas frequentes
create index if not exists idx_ton_insights_category    on public.ton_insights(category);
create index if not exists idx_ton_insights_client_id   on public.ton_insights(client_id);
create index if not exists idx_ton_insights_created_at  on public.ton_insights(created_at desc);
create index if not exists idx_ton_conv_created_at      on public.ton_conversations(created_at desc);

-- RLS
alter table public.ton_conversations enable row level security;
alter table public.ton_insights      enable row level security;

-- Equipe interna pode ler e inserir tudo (mesmo padrão das outras tabelas do ERP)
create policy "equipe_ton_conv_all"    on public.ton_conversations for all using (true) with check (true);
create policy "equipe_ton_insights_all" on public.ton_insights     for all using (true) with check (true);
