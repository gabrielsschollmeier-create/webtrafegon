-- ============================================================
-- TráfegOn Suite — Schema Supabase
-- Cole TODO o conteúdo no Supabase > SQL Editor e clique RUN
-- ============================================================

-- 1. Tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'colaborador',
  color          TEXT NOT NULL DEFAULT '#6eda2c',
  avatar         TEXT NOT NULL DEFAULT 'U',
  since          DATE,
  monthly_value  DECIMAL(10,2) DEFAULT 0,
  client_slug    TEXT,
  portal_modules JSONB DEFAULT '{"indicadores":true,"entregaveis":true,"reunioes":true,"timeline":true}',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_leitura"          ON public.profiles;
DROP POLICY IF EXISTS "profiles_inserir_proprio"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_atualizar_proprio" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_tudo"       ON public.profiles;

CREATE POLICY "profiles_leitura" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_inserir_proprio" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_atualizar_proprio" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_admin_tudo" ON public.profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- 2. Trigger: cria perfil automaticamente em novos cadastros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, color, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador'),
    COALESCE(NEW.raw_user_meta_data->>'color', '#6eda2c'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', upper(left(split_part(NEW.email, '@', 1), 1)))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. Perfis dos usuários já criados (equipe + clientes)
-- ============================================================
INSERT INTO public.profiles (id, name, email, role, color, avatar, since, client_slug)
VALUES
  ('5d3bc9ba-e771-4ac8-a3a6-5072f3c00eeb', 'Gabriel S.',        'gabriel@trafegon.com.br', 'admin',       '#6eda2c', 'GS', '2025-01-10', NULL),
  ('e5a33c54-6aa4-4738-832f-690e2addf04a', 'João C.',            'joao@trafegon.com.br',    'colaborador', '#be29ec', 'JC', '2025-04-15', NULL),
  ('a261e713-cecf-481f-a31a-b6820d8de237', 'Ana M.',             'ana@trafegon.com.br',     'colaborador', '#ea8a29', 'AM', '2025-06-01', NULL),
  ('22dd27fd-a1a8-4b72-8bc9-72a854eec146', 'Rafael F.',          'rafael@trafegon.com.br',  'colaborador', '#60a5fa', 'RF', '2026-02-01', NULL),
  ('2ab42aa4-17d1-4352-ad95-5ca2a85fa9b1', 'Cooperja',           'cooperja@cliente.com',    'cliente',     '#6eda2c', 'CJ', NULL, 'cooperja'),
  ('3c85a12b-4fcc-4abb-a4e3-d5062e4e8d70', 'Posto Rizzotto',     'rizzotto@cliente.com',    'cliente',     '#60a5fa', 'PR', NULL, 'rizzotto'),
  ('de36bca7-547b-43c5-80b7-d06f5a8bfe1d', 'Kamy',               'kamy@cliente.com',        'cliente',     '#be29ec', 'KM', NULL, 'kamy'),
  ('3380cf93-8d32-4854-9aaa-588353ba3df2', 'Ararastur',          'ararastur@cliente.com',   'cliente',     '#ea8a29', 'AR', NULL, 'ararastur'),
  ('c81dbef9-cf8b-43ce-8a76-8171d64ac7dc', 'Caçarola',           'cacarola@cliente.com',    'cliente',     '#f87171', 'CA', NULL, 'cacarola'),
  ('75f186d2-1617-4944-b72d-2b32e9196541', 'Intime Sistemas',    'intime@cliente.com',      'cliente',     '#a78bfa', 'IT', NULL, 'intime'),
  ('05c1ce23-c0c0-4122-8bb0-8c54bbecb5b2', 'Polizio Advogados',  'polizio@cliente.com',     'cliente',     '#34d399', 'PA', NULL, 'polizio')
ON CONFLICT (id) DO UPDATE SET
  name   = EXCLUDED.name,
  role   = EXCLUDED.role,
  color  = EXCLUDED.color,
  avatar = EXCLUDED.avatar,
  since  = EXCLUDED.since,
  client_slug = EXCLUDED.client_slug;

-- Confirmar
SELECT name, email, role FROM public.profiles ORDER BY role, name;
