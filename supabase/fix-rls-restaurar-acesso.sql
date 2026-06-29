-- =============================================================
-- CORREÇÃO: restaurar acesso aos dados (Ons, tarefas, pontuações)
-- Causa: app passou a usar a anon key, mas as tabelas estavam com
-- RLS bloqueando o acesso anon -> SELECT voltava 0 linhas.
-- Os dados NUNCA foram apagados, só ficaram invisíveis.
--
-- Este script libera leitura/escrita via anon key (mesmo acesso
-- que a service key dava antes, porém sem expor a chave admin).
-- É idempotente: pode rodar quantas vezes quiser.
-- =============================================================

do $$
declare
  t text;
  tbls text[] := array[
    'activities',
    'ad_metrics',
    'ad_settings',
    'ai_config',
    'ai_usage',
    'campanha_snapshots',
    'collaborators',
    'erp_clients',
    'leads',
    'meetings',
    'milestones',
    'monthly_stats',
    'notifications',
    'pipeline_stages',
    'pipelines',
    'profiles',
    'tasks',
    'ton_alertas',
    'ton_clientes',
    'ton_historico',
    'ton_memorias'
  ];
begin
  foreach t in array tbls loop
    -- garante que RLS está ligado (necessário para a policy valer)
    execute format('alter table public.%I enable row level security;', t);
    -- remove policy antiga (se já existir) para recriar limpa
    execute format('drop policy if exists trafegon_acesso_total on public.%I;', t);
    -- libera SELECT/INSERT/UPDATE/DELETE para anon e authenticated
    execute format(
      'create policy trafegon_acesso_total on public.%I '
      || 'for all to anon, authenticated using (true) with check (true);', t
    );
  end loop;
end $$;
