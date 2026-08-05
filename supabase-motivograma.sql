-- ============================================================
-- TráfegOn — Motivograma (respostas do time)
-- ADITIVO: só cria tabela e políticas novas. NÃO altera nem remove nada existente.
--
-- Execute no Supabase SQL Editor:
--   https://supabase.com/dashboard/project/bfyshboqvisnuefeyqdv/sql
--
-- REGRA DE CONFIDENCIALIDADE:
--   Qualquer pessoa do time pode ENVIAR a própria resposta.
--   Depois de enviada, SOMENTE gabrielsschollmeier@gmail.com consegue ler.
--   Nem quem respondeu consegue reler a própria resposta pela API.
-- ============================================================

create table if not exists public.motivograma_respostas (
  rodada       text not null,              -- ex: '2026-S2'
  user_email   text not null,              -- e-mail de quem respondeu (= auth.email())
  user_id      text,                       -- slug interno ('gs', 'ana_sm'...)
  nome         text,
  funcao       text,

  respostas    jsonb not null,             -- todas as respostas cruas, por código de item
  fatores      jsonb,                      -- bloco F: [{ id, i, p, gap }]
  top3         jsonb,                      -- 3 fatores mais importantes, ordenados
  ancoras      jsonb,                      -- bloco G: 2 âncoras ordenadas
  abertas      jsonb,                      -- bloco I: respostas discursivas

  -- Scores 0–100 (calculados no envio)
  aut numeric, mae numeric, vin numeric,
  des numeric, eng numeric, hig numeric, lid numeric,
  ime numeric,                             -- Índice de Motivação e Engajamento
  irs numeric,                             -- Índice de Risco de Saída
  gmp numeric,                             -- Gap Motivacional Ponderado
  enps int,                                -- 0–10
  pensou_sair boolean,

  duracao_seg  int,                        -- tempo de preenchimento (sinal de resposta apressada)
  created_at   timestamptz default now(),

  primary key (rodada, user_email)
);

alter table public.motivograma_respostas enable row level security;

-- ── ESCRITA: cada pessoa do time envia SOMENTE a própria resposta ──
drop policy if exists mtv_insert_propria on public.motivograma_respostas;
create policy mtv_insert_propria on public.motivograma_respostas
  for insert to authenticated
  with check (
    user_email = auth.email()
    and auth.email() in (
      'gabrielsschollmeier@gmail.com',
      'carolinepaganiadv@gmail.com',
      'gestaotrafegon@gmail.com',
      'socialmediaclientestrafegon@gmail.com',
      'atendimentotrafegon@gmail.com',
      'elieserpeper@gmail.com',
      'contato@tudoinforj.com.br',
      'socialmediatrafegon@gmail.com',
      'socialmediatrafegonjuridico@gmail.com'
    )
  );

-- ── LEITURA: exclusiva do Gabriel ──
drop policy if exists mtv_select_gabriel on public.motivograma_respostas;
create policy mtv_select_gabriel on public.motivograma_respostas
  for select to authenticated
  using ( auth.email() = 'gabrielsschollmeier@gmail.com' );

-- ── EXCLUSÃO: só o Gabriel (para reabrir uma rodada a quem respondeu errado) ──
drop policy if exists mtv_delete_gabriel on public.motivograma_respostas;
create policy mtv_delete_gabriel on public.motivograma_respostas
  for delete to authenticated
  using ( auth.email() = 'gabrielsschollmeier@gmail.com' );

-- Sem política de UPDATE: resposta enviada não se edita. Para refazer, o Gabriel apaga.

create index if not exists motivograma_rodada_idx
  on public.motivograma_respostas(rodada, created_at desc);

-- ── "Eu já respondi?" sem dar acesso de leitura ──────────────
-- A pessoa precisa saber se já respondeu (senão preenche 15 min à toa em outro
-- navegador). Esta função roda como dona da tabela (security definer), mas só
-- responde true/false sobre a PRÓPRIA linha — nunca devolve conteúdo.
create or replace function public.motivograma_ja_respondi(p_rodada text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.motivograma_respostas
    where rodada = p_rodada and user_email = auth.email()
  );
$$;

revoke all on function public.motivograma_ja_respondi(text) from public;
grant execute on function public.motivograma_ja_respondi(text) to authenticated;

-- Conferência
select 'motivograma_respostas criada' as ok;
