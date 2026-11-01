-- Registro das alterações feitas nas contas de Google Ads pelo módulo Tráfego do hub.
-- Só cria uma tabela nova; não altera nenhuma tabela existente.

create table if not exists public.trafego_alteracoes (
  id             bigint generated always as identity primary key,
  criado_em      timestamptz not null default now(),
  usuario_email  text not null,
  conta_id       text not null,
  conta_nome     text,
  campanha_id    text,
  campanha_nome  text,
  acao           text not null,
  resumo         text not null,
  detalhe        jsonb not null default '{}'::jsonb
);

create index if not exists trafego_alteracoes_conta_idx on public.trafego_alteracoes (conta_id, criado_em desc);

alter table public.trafego_alteracoes enable row level security;

drop policy if exists "trafego_alteracoes_ler" on public.trafego_alteracoes;
create policy "trafego_alteracoes_ler" on public.trafego_alteracoes
  for select to authenticated using (true);

-- Cada pessoa só grava registros em nome do próprio e-mail. Não há update nem delete: o histórico não se altera.
drop policy if exists "trafego_alteracoes_gravar" on public.trafego_alteracoes;
create policy "trafego_alteracoes_gravar" on public.trafego_alteracoes
  for insert to authenticated with check (usuario_email = (auth.jwt() ->> 'email'));
