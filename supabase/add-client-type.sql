-- Migration: adiciona / atualiza coluna client_type em erp_clients
-- Execute no SQL Editor do Supabase Dashboard

-- 1. Adiciona a coluna se não existir (idempotente)
alter table public.erp_clients
  add column if not exists client_type text default 'recorrente';

-- 2. Remove constraint antiga (se existir) para aceitar os novos tipos
alter table public.erp_clients
  drop constraint if exists erp_clients_client_type_check;

-- 3. Adiciona constraint atualizada com todos os tipos suportados
alter table public.erp_clients
  add constraint erp_clients_client_type_check
  check (client_type in ('recorrente', 'avulso', 'destrava_digital', 'sites', 'landing_page', 'implementacao_comercial'));

-- 4. Corrige clientes que foram salvos com 'avulso' por erro de mapeamento anterior:
--    só migra os que não têm override no frontend (CLIENT_SUBTYPE_OVERRIDES)
--    Os IDs abaixo são os que o frontend já sobrescreve via CLIENT_SUBTYPE_OVERRIDES.
--    Qualquer outro client_type='avulso' criado depois do novo modal deve ser revisto manualmente.
-- (nenhuma alteração automática — seguro deixar como está)

-- Verificação
select id, name, client_type from public.erp_clients order by created_at desc limit 20;
