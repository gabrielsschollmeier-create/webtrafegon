-- ======================================================
-- Migration: notifications table (event-based)
-- Execute no SQL Editor do Supabase
-- ======================================================

create table if not exists public.notifications (
  id               uuid default gen_random_uuid() primary key,
  target_collab_id text not null,    -- slug do colaborador destinatario (ex: 'gs')
  actor_collab_id  text,             -- slug de quem disparou a acao
  event_type       text not null,    -- 'task_assigned' | 'task_unassigned' | 'task_moved' | 'task_deleted' | 'co_added' | 'co_removed'
  task_id          text,
  task_title       text,
  message          text,
  read             boolean default false,
  created_at       timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "notif_authenticated"
  on public.notifications for all
  using (auth.role() = 'authenticated');

-- Indice para busca rapida por colaborador
create index if not exists notifications_target_idx
  on public.notifications(target_collab_id, created_at desc);
