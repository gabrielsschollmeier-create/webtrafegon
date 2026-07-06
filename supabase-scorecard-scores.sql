-- ============================================================
-- TráfegOn — Tabela do Scorecard (mover do localStorage para o Supabase)
-- ADITIVO: só cria a tabela. NÃO altera nem remove nada existente.
--
-- Execute no Supabase SQL Editor:
--   https://supabase.com/dashboard/project/bfyshboqvisnuefeyqdv/sql
-- ============================================================

create table if not exists public.scorecard_scores (
  cycle        text not null,           -- ex: '2026-W26' (semana ISO) ou '2026-06' (mês)
  member_id    text not null,           -- id do colaborador
  criterion_id text not null,           -- id do critério do cargo
  state        text not null,           -- 'ok' | 'partial' | 'miss'
  updated_at   timestamptz default now(),
  primary key (cycle, member_id, criterion_id)
);

alter table public.scorecard_scores enable row level security;

-- Só usuário logado (authenticated) lê e grava — consistente com as demais tabelas.
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'scorecard_scores' and policyname = 'sc_authed_all'
  ) then
    create policy sc_authed_all on public.scorecard_scores
      for all to authenticated using (true) with check (true);
  end if;
end $$;

-- Conferência
select 'scorecard_scores criada' as ok;
