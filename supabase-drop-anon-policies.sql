-- ============================================================
-- TráfegOn — REMOVE todo acesso anônimo (fecha o 2º vazamento)
-- Depois desta migração, quem NÃO está logado (role anon, usando a
-- anon key pública) não lê nem escreve nada. Apenas usuários logados
-- (role authenticated, via Supabase Auth) acessam, conforme as
-- políticas "authed_read"/"authed_write" que já existem.
--
-- Execute no Supabase SQL Editor:
--   https://supabase.com/dashboard/project/bfyshboqvisnuefeyqdv/sql
--
-- Seguro: NÃO altera dados, só remove políticas de acesso do anon.
-- Reversível: se algo quebrar, reaplique supabase-anon-policies.sql.
-- ============================================================

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND 'anon' = ANY (roles)      -- políticas que liberam o papel anon
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    RAISE NOTICE 'Removida política anon: % em %.%', r.policyname, r.schemaname, r.tablename;
  END LOOP;
END $$;

-- Conferência: deve retornar 0 linhas (nenhuma política anon restante)
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public' AND 'anon' = ANY (roles);
