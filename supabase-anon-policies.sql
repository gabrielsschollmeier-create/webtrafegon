-- ============================================================
-- TráfegOn — Políticas para acesso anônimo (sem autenticação)
-- O app usa a chave anon sem sistema de login, então o RLS
-- precisa liberar a role "anon" para ler e escrever.
--
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

DO $$ DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pipelines',
    'pipeline_stages',
    'leads',
    'activities',
    'erp_clients',
    'tasks',
    'meetings',
    'milestones',
    'collaborators',
    'monthly_stats'
  ] LOOP
    -- Remove políticas anon antigas se existirem
    EXECUTE format('DROP POLICY IF EXISTS "anon_select" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "anon_all"    ON public.%I', t);

    -- Leitura para anon
    EXECUTE format(
      'CREATE POLICY "anon_select" ON public.%I FOR SELECT TO anon USING (true)',
      t
    );

    -- Escrita (insert / update / delete) para anon
    EXECUTE format(
      'CREATE POLICY "anon_all" ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;
