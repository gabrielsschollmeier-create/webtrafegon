-- Inserir clientes faltantes no sistema
-- Rodar no Supabase SQL Editor: https://supabase.com/dashboard/project/bfyshboqvisnuefeyqdv/sql/new

INSERT INTO public.erp_clients (id, name, color, manager_id, status, since, monthly_value, niche)
VALUES
  ('andressa_adv',    'Andressa Advogada',             '#c084fc', 'am', 'active',  '2026-05-20', 0,    'Advocacia'),
  ('cooperja_lojas',  'Cooperja Lojas',                '#86efac', 'gs', 'active',  '2026-05-20', 0,    'Agropecuária'),
  ('fonseca_gonc',    'Fonseca e Gonçalves Adv',       '#67e8f9', 'am', 'active',  '2026-05-20', 0,    'Advocacia'),
  ('lenergy',         'Lenergy',                       '#fde047', 'gs', 'paused',  '2026-05-20', 0,    'Energia Solar'),
  ('mayara_campos',   'Mayara Campos Advogada',        '#f9a8d4', 'am', 'active',  '2026-05-20', 0,    'Advocacia'),
  ('rca_adv',         'RCA Advogados',                 '#a5b4fc', 'am', 'active',  '2026-05-20', 0,    'Advocacia')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  color        = EXCLUDED.color,
  manager_id   = EXCLUDED.manager_id,
  status       = EXCLUDED.status,
  monthly_value = EXCLUDED.monthly_value,
  niche        = EXCLUDED.niche;
